/**
 * @module Utils
 */

import * as _ from "@lisn/_internal";

import {
  addClassesNow,
  removeClassesNow,
  getData,
} from "@lisn/utils/css-alter";
import {
  waitForMeasureTime,
  waitForMutateTime,
} from "@lisn/utils/dom-optimize";

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
  _.createPromise<number>((resolve) => {
    _.onAnimationFrame(resolve);
  });

/**
 * Calls the given callback on every animation frame.
 *
 * The returned Promise resolves when the callback is done (returns `false`).
 *
 * @param callback  See {@link AnimationCallback}.
 * @param elapsed   Seed values to use as the total elapsed and elapsed since
 *                  last. Otherwise it will use the timestamp of the first frame
 *                  as the start, which will result in the elapsed values being
 *                  0 the first time.
 *
 * @since v1.2.0
 *
 * @category Animations
 */
export const onEveryAnimationFrame = async (
  callback: AnimationCallback,
  elapsed?: ElapsedTimes,
) => {
  for await (elapsed of animationFrameGenerator(elapsed)) {
    const shouldRepeat = callback(elapsed);
    if (!shouldRepeat) {
      break;
    }
  }
};

/**
 * Infinite async generator version of {@link onEveryAnimationFrame}.
 *
 * Continually yields the total elapsed time and elapsed time since the last
 * call on every animation frame.
 *
 * @example
 * ```javascript
 * for await (const elapsed of animationFrameGenerator()) {
 *   // ... do something
 *   if (done) break;
 * }
 * ```
 *
 * @since v1.2.0
 *
 * @category Animations
 */
export async function* animationFrameGenerator(
  elapsed?: ElapsedTimes,
): AsyncGenerator<ElapsedTimes, never, undefined> {
  let startTime: number, previousTimeStamp: number;
  const { total: totalSeed = 0, sinceLast: sinceLastSeed = 0 } = elapsed ?? {};

  const step = async () => {
    const timeStamp = await waitForAnimationFrame();
    if (!startTime || !previousTimeStamp) {
      // First time
      startTime = timeStamp - totalSeed;
      previousTimeStamp = timeStamp - sinceLastSeed;
    }

    const total = timeStamp - startTime;
    const sinceLast = timeStamp - previousTimeStamp;
    previousTimeStamp = timeStamp;

    return { total, sinceLast };
  };

  while (true) {
    yield step();
  }
}

/**
 * @ignore
 * @deprecated
 *
 * Deprecated alias for {@link animationFrameGenerator}
 */
export const newAnimationFrameIterator = animationFrameGenerator;

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
    _.isNull(getData(element, _.prefixName("test-legacy")))
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
  addClassesNow(element, _.PREFIX_ANIMATE_DISABLE); // cause it to reset
  // If we remove the disable class immediately, then it will not have the
  // effect to reset the animation, since the browser won't see any change in
  // the classList at the start of the frame. So we ideally need to remove the
  // disable class after the next paint. However, depending on the animation,
  // and its state, disabling animation and waiting for the next animation
  // frame may cause a visible glitch, so we need to force layout now.
  /* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
  element[_.S_CLIENT_WIDTH]; // forces layout

  removeClassesNow(element, _.PREFIX_ANIMATE_DISABLE);
};
