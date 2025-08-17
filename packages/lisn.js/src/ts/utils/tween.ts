/**
 * @module Utils
 *
 * @categoryDescription Tweening
 *
 * Tweening functions implement various interpolation methods from a current to
 * target position.
 */

import * as MH from "@lisn/globals/minification-helpers";

import { animationFrameGenerator } from "@lisn/utils/animations";
import { isValidNum, roundNumTo, toNumWithBounds } from "@lisn/utils/math";
import { deepCopy, compareValuesIn } from "@lisn/utils/misc";

/**
 * @category Tweening
 *
 * @since v1.3.0
 */
export type Tweener<Input extends Partial<TweenerInput> = TweenerInput> =
  | TweenerFn<Input>
  | TweenerName;

/**
 * @category Tweening
 *
 * @since v1.3.0
 */
export type TweenerName = keyof typeof TWEENERS;

/**
 * @category Tweening
 *
 * @since v1.3.0
 */
export type TweenerFn<Input extends Partial<TweenerInput> = TweenerInput> = (
  input: Input,
) => TweenerOutput;

/**
 * Possible inputs to tweener functions. Not all may be required.
 *
 * @category Tweening
 *
 * @since v1.3.0
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

  /**
   * The total time elapsed since the start of the tweening.
   */
  totalTime: number;
};

/**
 * @category Tweening
 *
 * @since v1.3.0
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

/**
 * @category Tweening
 *
 * @since v1.3.0
 */
export type SpringTweenerInput = {
  current: number;
  target: number;
  lag: number;
  velocity: number;
  deltaTime: number;
};

/**
 * A tweener based on the motion of a critically damped user-driven spring.
 *
 * @param [conf.precision = 1] Number of decimal places to round position to in
 *                             order to determine when it's "done" (close enough
 *                             to target).
 *
 * @category Tweening
 *
 * @since v1.3.0
 */
export const springTweener = (
  { current, target, lag, velocity, deltaTime }: SpringTweenerInput,
  conf?: { precision?: number },
) => {
  const { precision = 1 } = conf ?? {};
  lag = toNumWithBounds(lag, { min: 1 }) / 1000; // to seconds

  // Since the position only approaches asymptotically the target it never truly
  // reaches it exactly we need an approximation to calculate w0. N determines
  // how far away from the target position we are after `lag` milliseconds.
  const N = 9.5; // XXX should this depend on target - initial diff?
  const w0 = N / lag;

  deltaTime /= 1000; // to seconds

  if (roundNumTo(target - current, precision) === 0) {
    // we're done
    current = target; // snap it to exactly target
    velocity = 0;
  } else if (deltaTime > 0) {
    const A = current - target;
    const B = velocity + w0 * A;
    const e = MH.exp(-w0 * deltaTime);

    current = target + (A + B * deltaTime) * e;
    velocity = (B - w0 * (A + B * deltaTime)) * e;
  }

  return { current, velocity };
};

/**
 * @category Tweening
 *
 * @since v1.3.0
 */
export const TWEENERS = {
  spring: springTweener,
} as const;

// ------------------------------

/**
 * @category Tweening
 *
 * @since v1.3.0
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
     * The lag setting.
     */
    lag: number;

    /**
     * If set to true, it tells the tween generator not to tween, but instead jump
     * straight to the target values.
     */
    snap: boolean;
  };
};

/**
 * @category Tweening
 *
 * @since v1.3.0
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
     * If set to true, it tells the tween generator not to tween, but instead jump
     * straight to the target values.
     */
    snap: boolean;
  };
};

/**
 * @category Tweening
 *
 * @since v1.3.0
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
 * @category Tweening
 *
 * @since v1.3.0
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
      _totalTime: number;
      _velocity: number;
    };
  } = {
    x: { _done: true, _totalTime: 0, _velocity: 0 },
    y: { _done: true, _totalTime: 0, _velocity: 0 },
    z: { _done: true, _totalTime: 0, _velocity: 0 },
  };

  const isTweening = () =>
    !motion.x._done || !motion.y._done || !motion.z._done;

  const isUpdated = (newUpdateData: Tween3DUpdate<Axes> | undefined) => {
    newUpdateData = MH.merge(updateData, newUpdateData);
    return !compareValuesIn(newUpdateData, updateData);
  };

  // We'll be updating the state object. previous updated in every loop
  const state = deepCopy(init) as Tween3DGeneratorOutput<Axes>;
  for (const a in init) {
    state[a].initial = state[a].previous = state[a].current;
  }

  let updateData: Tween3DUpdate<Axes> = {};

  for await (const {
    total: totalTime,
    sinceLast: deltaTime,
  } of animationFrameGenerator()) {
    if (deltaTime === 0) {
      continue;
    }

    let a: Axes;
    for (a in init) {
      const params = state[a];
      const motionParams = motion[a];
      motionParams._totalTime = totalTime;

      // Apply update
      const newParams = updateData[a] ?? {};
      params.target = newParams.target ?? params.target;
      params.lag = newParams.lag ?? params.lag;
      params.snap = newParams.snap ?? params.snap;

      const prev = params.current;

      if (params.snap) {
        params.current = params.target;
      }

      if (params.current !== params.target) {
        params.previous = prev;

        const tweenerFn = tweenerFns[a] ?? getTweenerFn(tweener, a);
        tweenerFns[a] = tweenerFn;

        const result = tweenerFn({
          current: params.current,
          target: params.target,
          lag: params.lag,
          velocity: motionParams._velocity,
          deltaTime,
          totalTime: motionParams._totalTime,
        });

        params.current = result.current;
        motionParams._velocity = result.velocity;
      }

      motionParams._done = params.current === params.target;
    }

    const newUpdateData = yield deepCopy(state);
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
 * @category Math
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
  const { lTarget, dt, lag, l = 0, v = 0, precision } = settings;
  const result = springTweener(
    {
      current: l,
      target: lTarget,
      velocity: v,
      lag,
      deltaTime: dt,
    },
    {
      precision,
    },
  );

  return { l: result.current, v: result.velocity };
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
 * @category Animations
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
  if (MH.isFunction(tweener)) {
    return tweener;
  }

  if (MH.isObject(tweener)) {
    if (!(axis in tweener)) {
      throw MH.usageError(`Missing tweener for axis ${axis}`);
    }

    return getTweenerFn(tweener[axis], axis);
  }

  if (!(tweener in TWEENERS)) {
    throw MH.usageError("Unknown tweener name");
  }

  return TWEENERS[tweener];
};
