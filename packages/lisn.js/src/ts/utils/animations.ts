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

/**
 * The callback is passed two arguments:
 * 1. The total elapsed time in milliseconds since the start
 * 2. The elapsed time in milliseconds since the previous frame
 *
 * The first time this callback is called both of these will be 0.
 *
 * The callback must return `true` if it wants to animate again on the next
 * frame and `false` if done.
 */
export type AnimationCallback = (
  totalElapsed: number,
  elapsedSinceLast: number,
) => boolean;

/**
 * Returns a promise that resolves at the next animation frame. Async/await
 * version of requestAnimationFrame.
 *
 * @returns The timestamp gotten from requestAnimationFrame
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
 * @see {@link AnimationCallback}
 *
 * @category Animations
 */
export const onEveryAnimationFrame = (callback: AnimationCallback) => {
  let startTime: number, previousTimeStamp: number;
  const step = (timeStamp: number) => {
    if (!startTime) {
      startTime = timeStamp;
      previousTimeStamp = timeStamp;
    }

    const totalElapsed = timeStamp - startTime;
    const elapsedSinceLast = timeStamp - previousTimeStamp;
    previousTimeStamp = timeStamp;

    const shouldRepeat = callback(totalElapsed, elapsedSinceLast);

    if (shouldRepeat) {
      MH.onAnimationFrame(step);
    }
  };

  MH.onAnimationFrame(step);
};

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
