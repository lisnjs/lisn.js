/**
 * @module Utils
 *
 * @categoryDescription Tweening
 *
 * Tweening functions implement various interpolation methods from a current to
 * target position.
 */

// TODO in future (maybe)
// - bouncing easeOutBack and easeInOutBack
// - spring with controllable damping parameter

import * as _ from "@lisn/_internal";

import { usageError } from "@lisn/globals/errors";

import { animationFrameGenerator } from "@lisn/utils/animations";
import { isValidNum, roundNumTo, toNumWithBounds } from "@lisn/utils/math";

/**
 * @since v1.3.0
 *
 * @category Tweening
 */
export type Tweener = TweenerFn | TweenerName;

/**
 * @since v1.3.0
 *
 * @category Tweening
 */
export type TweenerName = keyof typeof TWEENERS;

/**
 * A tweener function should be a generator that accepts updates to target and
 * lag and keeps whatever state it needs to.
 *
 * Notice that because of how generators work, updates sent on the first call to
 * `next()` are not received.
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export type TweenerFn = (
  input: TweenerInput,
) => Generator<TweenerOutput, void, TweenerUpdate>;

/**
 * Initial state for a {@link Tweener}s.
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export type TweenerInput = {
  /**
   * The current value to interpolate towards the target.
   */
  current: number;

  /**
   * The target value.
   */
  target: number;

  /**
   * The lag setting in **milliseconds**.
   */
  lag: number;

  /**
   * The time in **milliseconds** since the last animation frame.
   */
  deltaTime: number;

  /**
   * Number of decimal places to round position to in order to determine when
   * tweening is done (when it's close enough to target).
   *
   * Since most tweeners only approach the target asymptotically, a certain
   * margin of error should be accepted.
   *
   * @defaultValue Specific to each {@link Tweener}
   */
  precision?: number;
};

/**
 * Updated values to a {@link Tweener} via its `next()` method.
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export type TweenerUpdate = {
  /**
   * Set a new target.
   */
  target?: number;

  /**
   * Update the lag value.
   */
  lag?: number;

  /**
   * The time in **milliseconds** since the last animation frame. Defaults to
   * the last `deltaTime` set.
   */
  deltaTime?: number;
};

/**
 * The state that a {@link Tweener} yields.
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export type TweenerOutput = {
  /**
   * The updated value after interpolation.
   */
  current: number;
};

// -------------------------------------------------------------------------
// --------------------------- BUILT-IN TWEENERS ---------------------------
// -------------------------------------------------------------------------

// --------------------------------- SPRING --------------------------------

/**
 * A tweener based on the motion of a critically damped user-driven spring.
 *
 * Default {@link TweenerInput.precision | precision} is 1.
 *
 * The generator is guaranteed to yield at least once and accept an
 * {@link TweenerUpdate | update}, even if the input position is already at the
 * target.
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export const springTweener: TweenerFn = function* ({
  current,
  target,
  lag = 0,
  deltaTime = 0,
  precision = 1,
}) {
  let velocity = 0;
  while (true) {
    validateInput({ current, target, lag, deltaTime, precision });

    if (lag < 1) {
      yield { current: target }; // we're done
      return;
    }

    if (deltaTime > 1) {
      const dtSec = deltaTime / 1000;
      const lagSec = lag / 1000;
      // Since the position only approaches asymptotically the target it never truly
      // reaches it exactly we need an approximation to calculate w0. N determines
      // how far away from the target position we are after `lag` milliseconds.
      const N = 6.7;
      const w0 = N / lagSec;

      const A = current - target;
      const B = velocity + w0 * A;
      const e = _.exp(-w0 * dtSec);

      current = target + (A + B * dtSec) * e;
      velocity = (B - w0 * (A + B * dtSec)) * e;
    }

    const update = yield { current };

    target = update?.target ?? target;
    lag = update?.lag ?? lag;
    deltaTime = update?.deltaTime ?? deltaTime;

    if (
      isCloseTo(velocity / 10, 0, precision) &&
      isCloseTo(current, target, precision)
    ) {
      yield { current: target }; // snap exactly to target
      return;
    }
  }
};

// ------------------------------ EASING-BASED -----------------------------

/**
 * @ignore
 * @internnal
 *
 * Creates a new {@link TweenerFn} based on an ease in/ease out function.
 *
 * @param easeInOut Accepts as a single argument the progress p from 0 to 1, and
 *                  should return the normalised value x(p) from 0 to 1 (though
 *                  for bouncing easings, x may go outside 0 to 1 range).
 *                  See https://easings.net/
 * @param invert    A function that's the inverse of easeInOut. Accepts two
 *                  arguments:
 *                  - the normalised value x(p)
 *                  - true if x was increasing and false if it was decreasing;
 *                    this is required by bouncing easings that may reach the
 *                    same x value at two different values for p
 *                  It should return the progress p from 0 to 1 at which
 *                  easeInOut's result equals that. Used for re-computing the
 *                  progress whenever the target or lag change.
 *
 * Default {@link TweenerInput.precision | precision} is 1.
 *
 * The generator is guaranteed to yield at least once and accept an
 * {@link TweenerUpdate | update}, even if the input position is already at the
 * target.
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export const createEaseInOutTweener = (
  easeInOut: (progress: number) => number,
  invert: (value: number, isIncreasing: boolean) => number,
) => {
  const tweener: TweenerFn = function* ({
    current,
    target,
    lag = 0,
    deltaTime = 0,
    precision = 1,
  }) {
    let reference = current,
      oldTarget = target,
      old = current,
      progress = 0,
      eased = 0;

    while (true) {
      validateInput({ current, target, lag, deltaTime, precision });

      if (lag < 1) {
        yield { current: target }; // we're done
        return;
      }

      if (deltaTime > 1) {
        if (target !== oldTarget) {
          if (
            current - reference > target - reference !==
            current - reference > oldTarget - reference
          ) {
            // We need to reverse directions => start a new easing from here.
            reference = current;
            progress = 0;
          } else {
            // We continue in the same direction, but we need to "jump onto"
            // another curve that is heading for a new target. So we update our
            // progress to what it should be on the new curve to keep the
            // current position.

            // Fractional x(p).
            const x = _.abs(current - reference) / _.abs(target - reference);
            const oldX = _.abs(old - reference) / _.abs(target - reference);
            const isIncreasing = x > oldX;
            progress = invert(x, isIncreasing); // XXX can we figure it out without invert?
          }
        }

        progress = toNumWithBounds(progress + deltaTime / lag, {
          max: 1,
        });
        eased = easeInOut(progress);

        old = current;
        current = reference + (target - reference) * eased;
      }

      const update = yield { current };

      oldTarget = target;
      target = update?.target ?? target;
      lag = update?.lag ?? lag;
      deltaTime = update?.deltaTime ?? deltaTime;

      if (
        isCloseTo(100 * progress, 100, precision) &&
        isCloseTo(current, target, precision)
      ) {
        return;
      }
    }
  };

  return tweener;
};

/**
 * A tweener that interpolates linearly (constant velocity).
 *
 * Default {@link TweenerInput.precision | precision} is 1.
 *
 * The generator is guaranteed to yield at least once and accept an
 * {@link TweenerUpdate | update}, even if the input position is already at the
 * target.
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export const linearTweener = createEaseInOutTweener(
  (p) => p,
  (p) => p,
);

/**
 * A tweener that interpolates based on a quadratic function.
 *
 * Default {@link TweenerInput.precision | precision} is 1.
 *
 * The generator is guaranteed to yield at least once and accept an
 * {@link TweenerUpdate | update}, even if the input position is already at the
 * target.
 *
 * @see https://easings.net/#easeInOutQuad
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export const quadraticTweener = createEaseInOutTweener(
  (p) => (p < 0.5 ? 2 * _.pow(p, 2) : 1 - _.pow(-2 * p + 2, 2) / 2),
  (x) => (x < 0.5 ? _.sqrt(x / 2) : (_.sqrt(2 * (1 - x)) - 2) / -2),
);

/**
 * A tweener that interpolates based on a ease in, ease out cubic function.
 *
 * Default {@link TweenerInput.precision | precision} is 1.
 *
 * The generator is guaranteed to yield at least once and accept an
 * {@link TweenerUpdate | update}, even if the input position is already at the
 * target.
 *
 * @see https://easings.net/#easeInOutCubic
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export const cubicTweener = createEaseInOutTweener(
  (p) => (p < 0.5 ? 4 * _.pow(p, 3) : 1 - _.pow(-2 * p + 2, 3) / 2),
  (x) => (x < 0.5 ? _.pow(x / 4, 1 / 3) : (_.pow(2 * (1 - x), 1 / 3) - 2) / -2),
);

/**
 * A tweener that interpolates based on a ease in, ease out sine function.
 *
 * Default {@link TweenerInput.precision | precision} is 1.
 *
 * The generator is guaranteed to yield at least once and accept an
 * {@link TweenerUpdate | update}, even if the input position is already at the
 * target.
 *
 * @see https://easings.net/#easeInOutSine
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export const sineTweener = createEaseInOutTweener(
  (p) => -(_.cos(_.MATH.PI * p) - 1) / 2,
  (x) => _.MATH.acos(1 - x * 2) / _.MATH.PI,
);

// -------------------------------------------------------------------------
// -------------------- BUILT-IN TWEENERS SINGLE EXPORT --------------------
// -------------------------------------------------------------------------

/**
 * @since v1.3.0
 *
 * @category Tweening
 */
export const TWEENERS = {
  spring: springTweener,
  linear: linearTweener,
  quadratic: quadraticTweener,
  cubic: cubicTweener,
  sine: sineTweener,
} as const;

// ------------------------------

/**
 * Initial state for {@link animation3DTweener}.
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export type Animation3DTweenerInput<Axes extends "x" | "y" | "z"> = {
  [K in Axes]: {
    /**
     * The current value to interpolate towards the target.
     */
    current: number;

    /**
     * The target value.
     */
    target: number;

    /**
     * The lag setting. If it lag} is less than or equal to 0, it will
     * essentially {@link snap}.
     */
    lag: number;

    /**
     * If set to true, it tells the tween generator not to tween, but instead
     * jump straight to the target values. Equivalent to setting {@link lag} to
     * 0.
     */
    snap?: boolean;

    /**
     * Number of decimal places to round position to to determine when we're
     * done (close enough to target).
     *
     * @defaultValue Specific to each {@link Tweener}
     */
    precision?: number;
  };
};

/**
 * Updated values to {@link animation3DTweener} via its `next()` method.
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export type Animation3DTweenerUpdate<Axes extends "x" | "y" | "z"> = {
  [K in Axes]?: {
    /**
     * Set a new target.
     */
    target?: number;

    /**
     * Update the lag value.
     */
    lag?: number;

    /**
     * If set to true, it tells the tween generator not to tween, but instead jump
     * straight to the target values.
     *
     * This gets defaulted back to false during each update unless you explicitly
     * set it to `true`.
     */
    snap?: boolean;
  };
};

/**
 * The state that {@link animation3DTweener} yields.
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export type Animation3DTweenerOutput<Axes extends "x" | "y" | "z"> = {
  [K in Axes]: {
    /**
     * The initial value at which the tweener started interpolating.
     */
    initial: number;

    /**
     * The value at the last animation frame.
     */
    previous: number;

    /**
     * The current value the tweener interpolated.
     */
    current: number;

    /**
     * The target value.
     */
    target: number;

    /**
     * The lag setting.
     */
    lag: number;

    /**
     * If set to true, it means the tweener was told to snap straight to the
     * target value during the last update.
     */
    snap: boolean;

    /**
     * The value that was passed via {@link Animation3DTweenerInput} or the
     * default of 1.
     */
    precision: number;
  };
};

/**
 * An animation frame generator which tweens the current value along one or more
 * axis (X, Y or Z) towards a target one.
 *
 * Its `next` method accepts update to the target and lag settings as well as an
 * option to make it snap instantly to the target.
 *
 * Notice that because of how generators work, updates sent on the first call to
 * `next()` are not received.
 *
 * The generator is guaranteed to yield at least once and accept an
 * {@link Animation3DTweenerUpdate | update}, even if the input position is
 * already at the target.
 *
 * When all input axis have reached their target values, the generator returns.
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export async function* animation3DTweener<Axes extends "x" | "y" | "z">(
  tweener: Tweener | { [K in Axes]: Tweener },
  init: Animation3DTweenerInput<Axes>,
): AsyncGenerator<
  Animation3DTweenerOutput<Axes>,
  void,
  Animation3DTweenerUpdate<Axes> | undefined
> {
  const tweenGenerators: {
    [K in Axes]?: ReturnType<TweenerFn>;
  } = {};

  const axesDone = {
    x: !("x" in init),
    y: !("y" in init),
    z: !("z" in init),
  };

  // --------------------

  const isDone = (axis?: Axes) =>
    axis ? axesDone[axis] : axesDone.x && axesDone.y && axesDone.z;

  const setAxisDone = (axis: Axes, done = true) => {
    axesDone[axis] = done;

    if (axesDone[axis]) {
      // needs to be recreated if there's an update
      delete tweenGenerators[axis];
    }
  };

  const applyUpdate = (updateData: Animation3DTweenerUpdate<Axes>) => {
    for (const axis in output) {
      const newParams = updateData[axis];
      if (!newParams) {
        continue;
      }

      const params = output[axis];
      params.snap = false; // default

      // Copy only target, lag and snap over
      _.copySelectKeysTo(newParams, params, { target: 1, lag: 1, snap: 1 });

      // After applying update check if we should mark the axis as done. It's
      // done only if it's generator has finished running (i.e. axis is
      // currently marked as done) **and** current is at target.
      setAxisDone(
        axis,
        isDone(axis) &&
          isCloseTo(
            output[axis].target,
            output[axis].current,
            output[axis].precision,
          ),
      );
    }
  };

  const getNextValue = (axis: Axes, deltaTime: number) => {
    let generator: ReturnType<TweenerFn> | undefined = tweenGenerators[axis];
    const input = output[axis];

    if (!generator) {
      generator = getTweener(
        tweener,
        axis,
      )({
        current: input.current,
        target: input.target,
        lag: input.lag,
        deltaTime,
        precision: input.precision,
      });

      if (!("next" in generator) || !_.isFunction(generator.next)) {
        throw usageError("Tweener must be a generator function");
      }

      tweenGenerators[axis] = generator;
    }

    return generator.next({
      target: input.target,
      lag: input.lag,
      deltaTime,
    });
  };

  // --------------------

  // We'll be updating the state object. "previous" updated in every loop
  const output = _.deepCopy(init) as Animation3DTweenerOutput<Axes>;
  for (const axis in init) {
    output[axis].initial = output[axis].previous = output[axis].current;
    output[axis].precision ??= 1;
    output[axis].snap ??= false;
  }

  let skipYield = false,
    hasYielded = false;
  for await (const { sinceLast: deltaTime } of animationFrameGenerator()) {
    if (deltaTime === 0) {
      continue;
    }

    for (const axis in output) {
      if (isDone(axis)) {
        continue;
      }

      const params = output[axis];
      const previous = params.current;

      if (params.snap || params.lag < 1) {
        params.current = params.target;
        setAxisDone(axis);
      } else {
        const next = getNextValue(axis, deltaTime);
        if (next.done) {
          setAxisDone(axis);
          // This was the last generator to finish and it's done, so
          // there's no update to the state
          skipYield = hasYielded && isDone();
        } else {
          params.previous = previous;
          params.current = next.value.current;
        }
      }
    }

    if (!skipYield) {
      const updateData = yield _.deepCopy(output);
      hasYielded = true;
      if (updateData) {
        applyUpdate(updateData);
      }
    }

    if (isDone()) {
      break;
    }
  }

  return;
}

/**
 * @ignore
 * @deprecated
 *
 * Use {@link springTweener} instead.
 *
 * @since v1.2.0
 *
 * @category Tweening
 */
export const criticallyDamped = (settings: {
  lTarget: number;
  dt: number;
  lag: number;
  l?: number;
  v?: number;
  precision?: number;
}) => {
  const { lTarget, precision = 2 } = settings;
  const lag = toNumWithBounds(settings.lag, { min: 1 }) / 1000; // to seconds

  // Since the position only approaches asymptotically the target it never truly
  // reaches it exactly we need an approximation to calculate w0. N determines
  // how far away from the target position we are after `lag` milliseconds.
  const N = 7;
  const w0 = N / lag;

  let { l = 0, v = 0, dt } = settings;
  dt /= 1000; // to seconds

  if (roundNumTo(l - lTarget, precision) === 0) {
    // we're done
    l = lTarget;
    v = 0;
  } else if (dt > 0) {
    const A = l - lTarget;
    const B = v + w0 * A;
    const e = _.exp(-w0 * dt);

    l = lTarget + (A + B * dt) * e;
    v = (B - w0 * (A + B * dt)) * e;
  }

  return { l, v };
};

/**
 * @ignore
 * @deprecated
 *
 * Use
 * {@link animation3DTweener | `animation3DTweener("spring", ...)`}
 * instead.
 *
 * @since v1.2.0
 *
 * @category Tweening
 */
export async function* newCriticallyDampedAnimationIterator(settings: {
  lTarget: number;
  lag: number;
  l?: number;
  precision?: number;
}): AsyncGenerator<
  { l: number; v: number; t: number },
  { l: number; v: number; t: number },
  number
> {
  let { l, lTarget } = settings;
  const { lag, precision } = settings;
  let v = 0,
    t = 0,
    dt = 0;

  const next = () => {
    ({ l, v } = criticallyDamped({
      lTarget,
      lag,
      l,
      dt,
      v,
      precision,
    }));
    return { l, v, t };
  };

  for await ({ total: t, sinceLast: dt } of animationFrameGenerator()) {
    if (dt === 0) {
      continue;
    }

    const result = next();
    lTarget = (yield result) ?? lTarget;
    if (l === lTarget || !isValidNum(l)) {
      return result;
    }
  }

  throw null; // tell TypeScript it never reaches here
}

// ------------------------------

const getTweener = <Axes extends "x" | "y" | "z">(
  tweener: Tweener | { [K in Axes]: Tweener },
  axis: Axes,
): TweenerFn => {
  if (_.isFunction(tweener)) {
    return tweener;
  }

  if (_.isObject(tweener)) {
    if (!(axis in tweener)) {
      throw usageError(`Missing tweener for axis ${axis}`);
    }

    return getTweener(tweener[axis], axis);
  }

  if (!(tweener in TWEENERS)) {
    throw usageError("Unknown tweener name");
  }

  return TWEENERS[tweener] as TweenerFn;
};

const validateInput = <I extends Partial<TweenerInput>>(input: I) => {
  for (const p in input) {
    if (!isValidNum(input[p])) {
      throw usageError(`${p} must be a number, got ${input[p]}`);
    }
  }
};

const isCloseTo = (value: number, ref: number, precision: number) =>
  roundNumTo(value - ref, precision) === 0;
