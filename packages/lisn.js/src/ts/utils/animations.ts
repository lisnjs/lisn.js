/**
 * @module Utils
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import {
  addClassesNow,
  removeClassesNow,
  getData,
} from "@lisn/utils/css-alter";
import {
  waitForMeasureTime,
  waitForMutateTime,
} from "@lisn/utils/dom-optimize";
import { criticallyDamped } from "@lisn/utils/math";

/**
 * @since v1.2.0
 *
 * @category Animations
 */
export type ElapsedTimes = {
  total: number;
  sinceLast: number;
};

/**
 * The callback is as an argument the {@link ElapsedTimes | elapsed times}:
 * - The total elapsed time in milliseconds since the start
 * - The elapsed time in milliseconds since the previous frame
 *
 * The first time this callback is called both of these will be 0 unless seed
 * values were provided.
 *
 * The callback must return `true` if it wants to animate again on the next
 * frame and `false` if done.
 *
 * @since v1.2.0
 *
 * @category Animations
 */
export type AnimationCallback = (elapsed: ElapsedTimes) => boolean;

/**
 * Returns a promise that resolves at the next animation frame. Async/await
 * version of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame | requestAnimationFrame}.
 *
 * @returns The timestamp gotten from `requestAnimationFrame`
 *
 * @category Animations
 */
export const waitForAnimationFrame = async () =>
  MH.newPromise<number>((resolve) => {
    MH.onAnimationFrame(resolve);
  });

/**
 * Calls the given callback on every animation frame.
 *
 * The returned Promise resolves when the callback is done (returns `false`).
 *
 * @param callback  See {@link AnimationCallback}.
 * @param elapsed   Seed values to use as the total elapsed and elapsed since
 *                  last. Otherwise it will use the timestamp of the first frame
 *                  as the start, which will result in those values being 0 the
 *                  first time.
 *
 * @since v1.2.0
 *
 * @category Animations
 */
export const onEveryAnimationFrame = async (
  callback: AnimationCallback,
  elapsed?: ElapsedTimes,
) => {
  for await (elapsed of newAnimationFrameIterator(elapsed)) {
    const shouldRepeat = callback(elapsed);
    if (!shouldRepeat) {
      break;
    }
  }
};

/**
 * Generator version of {@link onEveryAnimationFrame}.
 *
 * Returns a new async iterator which yields the total elapsed time and elapsed
 * time since the last call on every animation frame.
 *
 * @example
 * ```javascript
 * for await (const elapsed of newAnimationFrameIterator()) {
 *   // ... do something
 *   if (done) break;
 * }
 * ```
 *
 * @since v1.2.0
 *
 * @category Animations
 */
export async function* newAnimationFrameIterator(
  elapsed?: ElapsedTimes,
): AsyncGenerator<ElapsedTimes, never> {
  let startTime: number, previousTimeStamp: number;
  const { total: totalSeed = 0, sinceLast: sinceLastSeed = 0 } = elapsed ?? {};

  const step = async () => {
    const timeStamp = await waitForAnimationFrame();
    if (!startTime || !previousTimeStamp) {
      // First time
      startTime = timeStamp - totalSeed;
      previousTimeStamp = timeStamp - sinceLastSeed;
    }

    const totalElapsed = timeStamp - startTime;
    const elapsedSinceLast = timeStamp - previousTimeStamp;
    previousTimeStamp = timeStamp;

    return { total: totalElapsed, sinceLast: elapsedSinceLast };
  };

  while (true) {
    yield step();
  }
}

/**
 * Returns an animation iterator based on {@link criticallyDamped} that starts
 * at the given position `l`, with velocity `v = 0` and time `t = 0` and yields
 * the new position and velocity, total time and fractional change in position
 * at every animation frame.
 *
 * @param [settings.lTarget]   The initial target position. Can be updated when
 *                             calling next().
 * @param [settings.lag]       See {@link criticallyDamped}.
 * @param [settings.l = 0]     The initial starting position.
 * @param [settings.precision] See {@link criticallyDamped}.
 *
 * @returns An iterator whose `next` method accepts an optional new `lTarget`.
 * The iterator yields an object containing successive values for:
 * - `l`: position
 * - `v`: velocity
 * - `t`: total time elapsed
 * - `dlFr`: fractional (from 0 to 1) change in position since the last frame
 *
 * @example
 * If you never need to update the target you can use a for await loop:
 *
 * ```javascript
 * const iterator = newCriticallyDampedAnimationIterator({
 *   l: 10,
 *   lTarget: 100,
 *   lag: 1500
 * });
 *
 * for await (const { l, v, t, dlFr } of iterator) {
 *   console.log({ l, v, t, dlFr });
 * }
 * ```
 *
 * @example
 * If you do need to update the target, then call `next` explicitly:
 *
 * ```javascript
 * const iterator = newCriticallyDampedAnimationIterator({
 *   l: 10,
 *   lTarget: 100,
 *   lag: 1500
 * });
 *
 * let { value: { l, v, t, dlFr } } = await iterator.next();
 * ({ value: { l, v, t, dlFr } } = await iterator.next()); // updated
 * ({ value: { l, v, t, dlFr } } = await iterator.next(200)); // updated towards a new target
 * ```
 *
 * @since v1.2.0 (Fractional change in position in return value was added in
 * v1.3.0)
 *
 * @category Animations
 */
export async function* newCriticallyDampedAnimationIterator(settings: {
  lTarget: number;
  lag: number;
  l?: number;
  precision?: number;
}): AsyncGenerator<{ l: number; v: number; t: number; dlFr: number }, never> {
  let { l, lTarget } = settings;
  const { lag, precision } = settings;
  let v = 0,
    t = 0,
    dt = 0,
    dlFr = 0;

  const next = () => {
    ({ l, v, dlFr } = criticallyDamped({
      lTarget,
      dt,
      lag,
      l,
      v,
      precision,
    }));
    return { l, v, t, dlFr };
  };

  for await ({ total: t, sinceLast: dt } of newAnimationFrameIterator()) {
    if (dt === 0) {
      continue;
    }

    lTarget = yield next() ?? lTarget;
  }

  throw null; // tell TypeScript it will never end
}

/**
 * @param webAnimationCallback This function is called for each
 *                             {@link https://developer.mozilla.org/en-US/docs/Web/API/Animation | Animation}
 *                             on the element. It {@link waitForMeasureTime}
 *                             before reading the animations.
 * @param legacyCallback       This function is called if the browser does not
 *                             support the Web Animations API. It is called
 *                             after {@link waitForMutateTime} so it can safely
 *                             modify styles.
 * @param realtime             If true, then it does not
 *                             {@link waitForMeasureTime} or
 *                             {@link waitForMutateTime} and runs
 *                             synchronously.
 *
 * @category Animations
 */
export const iterateAnimations = async (
  element: Element,
  webAnimationCallback: (animation: Animation) => void,
  legacyCallback: (element: Element) => void,
  realtime = false,
) => {
  /* istanbul ignore next */ // jsdom doesn't support Web Animations
  if (
    "getAnimations" in element &&
    getData(element, MH.prefixName("test-legacy")) === null
  ) {
    if (!realtime) {
      await waitForMeasureTime();
    }

    for (const animation of element.getAnimations()) {
      webAnimationCallback(animation);
    }

    // Old browsers, no Animation API
  } else {
    if (!realtime) {
      await waitForMutateTime();
    }

    legacyCallback(element);
  }
};

/**
 * @ignore
 * @internal
 */
export const resetCssAnimationsNow = (element: Element) => {
  addClassesNow(element, MC.PREFIX_ANIMATE_DISABLE); // cause it to reset
  // If we remove the disable class immediately, then it will not have the
  // effect to reset the animation, since the browser won't see any change in
  // the classList at the start of the frame. So we ideally need to remove the
  // disable class after the next paint. However, depending on the animation,
  // and its state, disabling animation and waiting for the next animation
  // frame may cause a visible glitch, so we need to force layout now.
  /* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
  element[MC.S_CLIENT_WIDTH]; // forces layout

  removeClassesNow(element, MC.PREFIX_ANIMATE_DISABLE);
};
