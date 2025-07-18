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
