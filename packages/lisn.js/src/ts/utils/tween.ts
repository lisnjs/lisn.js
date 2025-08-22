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
export type Tweener<Input extends Partial<TweenerInput> = TweenerInput> =
  | TweenerFn<Input>
  | TweenerName;

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
export type TweenerFn<Input extends Partial<TweenerInput> = TweenerInput> = (
  input: Input,
) => TweenerOutput;

/**
 * Possible inputs to tweener functions. Not all may be required.
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
   * The lag setting.
   */
  lag: number;

  /**
   * The current velocity returned by the last call to the tweener.
   */
  velocity: number;

  /**
   * The time in milliseconds since the last call to the tweener.
   */
  deltaTime: number;
};

/**
 * @since v1.3.0
 *
 * @category Tweening
 */
export type TweenerOutput = {
  /**
   * The updated value after interpolation. Pass this as the
   * {@link TweenerInput.current} on the next call.
   */
  current: number;

  /**
   * The updated velocity after interpolation. Pass this as the
   * {@link TweenerInput.velocity} on the next call.
   */
  velocity: number;
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
export const springTweener: TweenerFn = ({
  current,
  target,
  lag = 0,
  velocity = 0,
  deltaTime = 0,
}) => {
  lag = toNum(lag) / 1000; // in seconds
  if (lag <= 0) {
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

  return { current, velocity };
};

// --------------------------------- LINEAR --------------------------------

/**
 * A tweener that interpolates linearly (constant velocity).
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export const linearTweener: TweenerFn = ({
  current,
  target,
  lag = 0,
  velocity = 0,
  deltaTime = 0,
}) => {
  lag = toNum(lag) / 1000; // in seconds
  if (lag <= 0) {
    current = target;
    velocity = 0;
  } else if (deltaTime > 0) {
    deltaTime /= 1000; // in seconds
    const distance = target - current;

    if (velocity === 0) {
      // Initial call
      velocity = distance / lag;
    }

    current += velocity * deltaTime;
    if (current > target == velocity > 0) {
      // overshot target
      current = target;
    }
  }

  return { current, velocity };
};

// ------------------------------- QUADRATIC -------------------------------

/**
 * A tweener that interpolates based on a quadratic function.
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export const quadraticTweener: TweenerFn = ({
  current,
  target,
  lag = 0,
  velocity = 0,
  deltaTime = 0,
}) => {
  // XXX
  lag = toNum(lag) / 1000; // in seconds
  if (lag <= 0) {
    current = target;
    velocity = 0;
  } else if (deltaTime > 0) {
    deltaTime = deltaTime / 1000; // in seconds
    const distance = target - current;

    // estimate normalized progress from velocity & distance
    let p = 0;
    const ratio = (velocity * lag) / (2 * distance);
    if (ratio > 0 && ratio <= 1) {
      p = 1 - ratio;
    }

    // update progress
    p = toNumWithBounds(p + deltaTime / lag, { min: 0, max: 1 });

    const eased = 1 - _.pow(1 - p, 2);

    current = target - distance * (1 - eased);
    velocity = 2 * (1 - p) * (distance / lag);
  }

  return { current, velocity };
};

// --------------------------------- CUBIC ---------------------------------

/**
 * A tweener that interpolates based on a cubic function.
 *
 * @since v1.3.0
 *
 * @category Tweening
 */
export const cubicTweener: TweenerFn = ({
  current,
  target,
  lag = 0,
  velocity = 0,
  deltaTime = 0,
}) => {
  // XXX
  lag = toNum(lag) / 1000; // in seconds
  if (lag <= 0) {
    current = target;
    velocity = 0;
  } else if (deltaTime > 0) {
    deltaTime = deltaTime / 1000; // in seconds
    const distance = target - current;

    // estimate normalized progress from velocity & distance
    let p = 0;
    const ratio = (velocity * lag) / (3 * distance);
    if (ratio > 0 && ratio <= 1) {
      p = 1 - _.sqrt(ratio);
    }

    // update progress
    p = toNumWithBounds(p + deltaTime / lag, { min: 0, max: 1 });

    const eased = 1 - _.pow(1 - p, 3);

    current = target - distance * (1 - eased);
    velocity = 3 * _.pow(1 - p, 2) * (distance / lag);
  }

  return { current, velocity };
};

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
      _velocity: number;
    };
  } = {
    x: { _done: true, _velocity: 0 },
    y: { _done: true, _velocity: 0 },
    z: { _done: true, _velocity: 0 },
  };

  const isTweening = () =>
    !motion.x._done || !motion.y._done || !motion.z._done;

  const isUpdated = (newUpdateData: Tween3DUpdate<Axes> | undefined) => {
    newUpdateData = _.merge(updateData, newUpdateData);
    return !compareValuesIn(newUpdateData, updateData);
  };

  // We'll be updating the state object. "previous" updated in every loop
  const state = _.deepCopy(init) as Tween3DGeneratorOutput<Axes>;
  for (const a in init) {
    state[a].initial = state[a].previous = state[a].current;
    state[a].precision ??= 1;
  }

  let updateData: Tween3DUpdate<Axes> = {};

  for await (const { sinceLast: deltaTime } of animationFrameGenerator()) {
    if (deltaTime === 0) {
      continue;
    }

    let a: Axes;
    for (a in state) {
      const params = state[a];
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

        let { current, velocity } = tweenerFn({
          current: params.current,
          target: params.target,
          lag: params.lag,
          velocity: motionParams._velocity,
          deltaTime,
        });

        if (
          isCloseToTarget({
            current,
            target: params.target,
            precision: params.precision,
          })
        ) {
          current = params.target;
          velocity = 0;
        }

        params.current = current;
        motionParams._velocity = velocity;
      }

      motionParams._done = params.current === params.target;
    }

    const newUpdateData = yield _.deepCopy(state);
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
  let { current, velocity } = springTweener({
    current: l,
    target: lTarget,
    velocity: v,
    lag,
    deltaTime: dt,
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
) => {
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

  return TWEENERS[tweener];
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
