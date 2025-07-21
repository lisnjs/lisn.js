/**
 * @module Utils
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { waitForMeasureTime } from "./dom-optimize.js";
import { createOverlay } from "./overlays.js";

/**
 * Returns the content box size of the given
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry | ResizeObserverEntry}.
 *
 * @category Size measurements
 */
export const getEntryContentBox = entry => {
  const size = entry.contentBoxSize;
  if (size) {
    return getSizeFromInlineBlock(size);
  }
  const rect = entry.contentRect;
  return {
    [MC.S_WIDTH]: rect[MC.S_WIDTH],
    [MC.S_HEIGHT]: rect[MC.S_HEIGHT]
  };
};

/**
 * Returns the border box size of the given
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry | ResizeObserverEntry}.
 *
 * @param fallbackToContent If the entry does not contain border box
 *                          measurements (depending on browser), then fall back
 *                          to using the content box size. Otherwise (by
 *                          default) will return `NaN` values for width and
 *                          height.
 *
 * @category Size measurements
 */
export const getEntryBorderBox = (entry, fallbackToContent = false) => {
  const size = entry.borderBoxSize;
  if (size) {
    return getSizeFromInlineBlock(size);
  } else if (fallbackToContent) {
    return getEntryContentBox(entry);
  }
  return {
    [MC.S_WIDTH]: NaN,
    [MC.S_HEIGHT]: NaN
  };
};

/**
 * Returns true if the given string is a valid box type.
 *
 * @category Validation
 */
export const isValidBox = box => MH.includes(ALL_BOXES, box);

/**
 * Returns true if the given string is a valid dimension.
 *
 * @category Validation
 */
export const isValidDimension = dimension => MH.includes(ALL_DIMENSIONS, dimension);

/**
 * @ignore
 * @internal
 */
export const tryGetViewportOverlay = () => viewportOverlay !== null && viewportOverlay !== void 0 ? viewportOverlay : null;

/**
 * @ignore
 * @internal
 *
 * Exposed via SizeWatcher
 */
export const fetchViewportOverlay = async () => {
  await init();
  return viewportOverlay;
};

/**
 * @ignore
 * @internal
 */
export const fetchViewportSize = async (realtime = false) => {
  var _MH$getDocScrollingEl, _root$clientWidth, _root$clientHeight;
  if (!realtime) {
    await waitForMeasureTime();
  }
  const root = MH.hasDOM() ? (_MH$getDocScrollingEl = MH.getDocScrollingElement()) !== null && _MH$getDocScrollingEl !== void 0 ? _MH$getDocScrollingEl : MH.getBody() : null;
  return {
    [MC.S_WIDTH]: (_root$clientWidth = root === null || root === void 0 ? void 0 : root.clientWidth) !== null && _root$clientWidth !== void 0 ? _root$clientWidth : 0,
    [MC.S_HEIGHT]: (_root$clientHeight = root === null || root === void 0 ? void 0 : root.clientHeight) !== null && _root$clientHeight !== void 0 ? _root$clientHeight : 0
  };
};

// ----------------------------------------

const S_INLINE_SIZE = "inlineSize";
const S_BLOCK_SIZE = "blockSize";
const ALL_BOXES = ["content", "border"];
const ALL_DIMENSIONS = [MC.S_WIDTH, MC.S_HEIGHT];
const getSizeFromInlineBlock = size => {
  /* istanbul ignore else */
  if (MH.isIterableObject(size)) {
    return {
      [MC.S_WIDTH]: size[0][S_INLINE_SIZE],
      [MC.S_HEIGHT]: size[0][S_BLOCK_SIZE]
    };
  }
  return {
    // in some browsers inlineSize and blockSize are scalars and nor Arrays
    [MC.S_WIDTH]: size[S_INLINE_SIZE],
    [MC.S_HEIGHT]: size[S_BLOCK_SIZE]
  };
};

// ------------------------------

let viewportOverlay;
let initPromise = null;
const init = () => {
  if (!initPromise) {
    initPromise = (async () => {
      viewportOverlay = await createOverlay({
        id: MH.prefixName("vp-ovrl"),
        style: {
          position: "fixed",
          [MC.S_WIDTH]: "100vw",
          [MC.S_HEIGHT]: "100vh"
        }
      });
    })();
  }
  return initPromise;
};
//# sourceMappingURL=size.js.map