/**
 * @module Utils
 *
 * @categoryDescription Tweening
 *
 * Tweening functions implement various interpolation methods from a current to
 * target position.
 */

import * as _ from "@lisn/_internal";

import { usageError } from "@lisn/globals/errors";

import { animationFrameGenerator } from "@lisn/utils/animations";
import {
  isValidNum,
  roundNumTo,
  toNum,
  toNumWithBounds,
} from "@lisn/utils/math";
import { compareValuesIn } from "@lisn/utils/misc";

/**
 * @since v1.3.0
 *
 * @category Tweening
 */
export type Tweener<S = unknown> = TweenerFn<S> | TweenerName;

/**
 * @since v1.3.0
 *
 * @category Tweening
 */
export type TweenerName = keyof typeof TWEENERS;

/**
 * @since v1.3.0
 *
 * @category Tweening
 */
export type TweenerFn<S = unknown> = (
  input: TweenerInput<S>,
) => TweenerOutput<S>;

/**
 * Input passed to {@link Tweener}s.
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export type TweenerInput<S = unknown> = {
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
   * The time in **milliseconds** since the last call to the tweener.
   */
  deltaTime: number;

  /**
   * The state of the tweener that it returned during the last call. Will be
   * `undefined` on the first call.
   */
  state?: S;
};

/**
 * @since v1.3.0
 *
 * @category Tweening
 */
export type TweenerOutput<S> = {
  /**
   * The updated value after interpolation. Pass this as the
   * {@link TweenerInput.current} on the next call.
   */
  current: number;

  /**
   * The tweener's state that it wants to receive on the next call.
   */
  state: S;
};

// -------------------------------------------------------------------------
// --------------------------- BUILT-IN TWEENERS ---------------------------
// -------------------------------------------------------------------------

// --------------------------------- SPRING --------------------------------

/**
 * A tweener based on the motion of a critically damped user-driven spring.
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export const springTweener: TweenerFn<{ velocity: number }> = ({
  current,
  target,
  lag = 0,
  deltaTime = 0,
  state,
}) => {
  let { velocity = 0 } = state ?? {};

  lag = toNum(lag) / 1000; // in seconds
  if (current === target || lag <= 0) {
    current = target;
    velocity = 0;
  } else if (deltaTime > 0) {
    deltaTime /= 1000; // in seconds

    // Since the position only approaches asymptotically the target it never truly
    // reaches it exactly we need an approximation to calculate w0. N determines
    // how far away from the target position we are after `lag` milliseconds.
    const N = 8.5;
    const w0 = N / lag;

    const A = current - target;
    const B = velocity + w0 * A;
    const e = _.exp(-w0 * deltaTime);

    current = target + (A + B * deltaTime) * e;
    velocity = (B - w0 * (A + B * deltaTime)) * e;
  }

  return { current, state: { velocity } };
};

// ------------------------------ EASING-BASED -----------------------------

export type EasingTweenerState = {
  initial: number;
  target: number;
  elapsed: number;
  duration: number;
};

/**
 * Creates a new {@link TweenerFn} based on an easing function.
 *
 * @param easingFn Accepts a single argument, the progress from 0 to 1, and
 * should return the normalised value from 0 to 1.
 *
 * @see https://easings.net/
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export const createEasingTweener = (easingFn: (progress: number) => number) => {
  const polyTweener: TweenerFn<EasingTweenerState> = ({
    current,
    target,
    lag = 0,
    deltaTime = 0,
    state,
  }) => {
    if (!state) {
      state = {
        initial: current,
        target,
        elapsed: 0,
        duration: lag,
      };
    }

    lag = toNum(lag);
    if (current === target || lag <= 0) {
      current = target;
    } else {
      if (state.target !== target) {
        // The difference between the current position and where we would have been
        // had this target been set from the start.
        const idealState = polyTweener({
          current: state.initial,
          target,
          lag,
          deltaTime: lag - (state.duration - state.elapsed), // lag - remaining time
        });
        const deviation = idealState.current - current;

        // Increase the target duration proportionately
        state.duration += lag * (deviation / target);
        state.target = target;
      }

      state.elapsed += deltaTime;

      const progress =
        1 -
        toNumWithBounds((state.duration - state.elapsed) / lag, {
          min: 0,
          max: 1,
        });

      const eased = easingFn(progress);
      current = state.initial + (state.target - state.initial) * eased;
    }

    return { current, state };
  };

  return polyTweener;
};

/**
 * A tweener that interpolates linearly (constant velocity).
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export const linearTweener = createEasingTweener((p) => p);

/**
 * A tweener that interpolates based on a quadratic function.
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export const quadraticTweener = createEasingTweener((p) =>
  p < 0.5 ? 2 * _.pow(p, 2) : 1 - _.pow(-2 * p + 2, 2) / 2,
);

/**
 * A tweener that interpolates based on a ease in, ease out cubic function.
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export const cubicTweener = createEasingTweener((p) =>
  p < 0.5 ? 4 * _.pow(p, 3) : 1 - _.pow(-2 * p + 2, 3) / 2,
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
} as const;

// ------------------------------

/**
 * @since v1.3.0
 *
 * @category Tweening
 */
export type Tween3DGeneratorInput<Axes extends "x" | "y" | "z"> = {
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
     * @defaultValue 1
     */
    precision?: number;
  };
};

/**
 * @since v1.3.0
 *
 * @category Tweening
 */
export type Tween3DGeneratorOutput<Axes extends "x" | "y" | "z"> = {
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
     * target value.
     */
    snap: boolean;

    /**
     * The value that was passed via {@link Tween3DGeneratorInput} or the
     * default of 1.
     */
    precision: number;
  };
};

/**
 * @since v1.3.0
 *
 * @category Tweening
 */
export type Tween3DUpdate<Axes extends "x" | "y" | "z"> = {
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
     */
    snap?: boolean;
  };
};

/**
 * An animation frame generator which tweens the current value along one or more
 * axis (X, Y or Z) towards a target one.
 *
 * Its `next` method accepts update to the target and lag settings as well as an
 * option to make it snap instantly to the target.
 *
 * When all input axis have reached their target values, the generator returns.
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export async function* tween3DAnimationGenerator<Axes extends "x" | "y" | "z">(
  tweener: Tweener | { [K in Axes]: Tweener },
  init: Tween3DGeneratorInput<Axes>,
): AsyncGenerator<
  Tween3DGeneratorOutput<Axes>,
  void,
  Tween3DUpdate<Axes> | undefined
> {
  const tweenerFns: {
    [K in "x" | "y" | "z"]?: TweenerFn;
  } = {};

  const motion: {
    [K in "x" | "y" | "z"]: {
      _done: boolean;
      _state?: unknown;
    };
  } = {
    x: { _done: true },
    y: { _done: true },
    z: { _done: true },
  };

  const isTweening = () =>
    !motion.x._done || !motion.y._done || !motion.z._done;

  const isUpdated = (newUpdateData: Tween3DUpdate<Axes> | undefined) => {
    newUpdateData = _.merge(updateData, newUpdateData);
    return !compareValuesIn(newUpdateData, updateData);
  };

  // We'll be updating the state object. "previous" updated in every loop
  const output = _.deepCopy(init) as Tween3DGeneratorOutput<Axes>;
  for (const a in init) {
    output[a].initial = output[a].previous = output[a].current;
    output[a].precision ??= 1;
  }

  let updateData: Tween3DUpdate<Axes> = {};

  for await (const { sinceLast: deltaTime } of animationFrameGenerator()) {
    if (deltaTime === 0) {
      continue;
    }

    let a: Axes;
    for (a in output) {
      const params = output[a];
      const motionParams = motion[a];

      // Apply update
      const newParams = updateData[a] ?? {};
      params.target = newParams.target ?? params.target;
      params.lag = toNumWithBounds(newParams.lag ?? params.lag, { min: 0 });
      params.snap = newParams.snap ?? params.snap;

      const prev = params.current;

      if (params.snap || params.lag <= 0) {
        params.current = params.target;
      }

      if (params.current !== params.target) {
        params.previous = prev;

        const tweenerFn = tweenerFns[a] ?? getTweenerFn(tweener, a);
        tweenerFns[a] = tweenerFn;

        let current = params.current;
        let state = motionParams._state;
        ({ current, state } = tweenerFn({
          current,
          target: params.target,
          lag: params.lag,
          deltaTime,
          state,
        }));

        // XXX TODO this won't work with tweeners that bounce
        if (
          isCloseToTarget({
            current,
            target: params.target,
            precision: params.precision,
          })
        ) {
          current = params.target;
        }

        params.current = current;
        motionParams._state = state;
      }

      motionParams._done = params.current === params.target;
    }

    const newUpdateData = yield _.deepCopy(output);
    const done = !isTweening() && !isUpdated(newUpdateData);

    if (done) {
      break;
    }

    updateData = newUpdateData ?? {};
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
}): {
  l: number;
  v: number;
} => {
  const { lTarget, dt, lag, l = 0, v = 0, precision = 1 } = settings;
  let {
    current,
    state: { velocity },
  } = springTweener({
    current: l,
    target: lTarget,
    lag,
    deltaTime: dt,
    state: { velocity: v },
  });

  if (isCloseToTarget({ target: lTarget, current, precision })) {
    current = lTarget;
    velocity = 0;
  }

  return { l: current, v: velocity };
};

/**
 * @ignore
 * @deprecated
 *
 * Use
 * {@link tween3DAnimationGenerator | `tween3DAnimationGenerator("spring", ...)`}
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

const getTweenerFn = <Axes extends "x" | "y" | "z">(
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

    return getTweenerFn(tweener[axis], axis);
  }

  if (!(tweener in TWEENERS)) {
    throw usageError("Unknown tweener name");
  }

  return TWEENERS[tweener] as TweenerFn;
};

const isCloseToTarget = ({
  current,
  target,
  precision,
}: {
  current: number;
  target: number;
  precision: number;
}) => roundNumTo(target - current, precision) === 0;
