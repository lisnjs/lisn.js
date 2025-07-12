/**
 * @module Utils
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { Box, Dimension, Size } from "@lisn/globals/types";

import { waitForMeasureTime } from "@lisn/utils/dom-optimize";
import { createOverlay } from "@lisn/utils/overlays";

/**
 * Returns the content box size of the given
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry | ResizeObserverEntry}.
 *
 * @category Size measurements
 */
export const getEntryContentBox = (entry: ResizeObserverEntry): Size => {
  const size = entry.contentBoxSize;

  if (size) {
    return getSizeFromInlineBlock(size);
  }

  const rect = entry.contentRect;
  return { [MC.S_WIDTH]: rect[MC.S_WIDTH], [MC.S_HEIGHT]: rect[MC.S_HEIGHT] };
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
export const getEntryBorderBox = (
  entry: ResizeObserverEntry,
  fallbackToContent = false,
): Size => {
  const size = entry.borderBoxSize;

  if (size) {
    return getSizeFromInlineBlock(size);
  } else if (fallbackToContent) {
    return getEntryContentBox(entry);
  }

  return { [MC.S_WIDTH]: NaN, [MC.S_HEIGHT]: NaN };
};

/**
 * Returns true if the given string is a valid box type.
 *
 * @category Validation
 */
export const isValidBox = (box: string): box is Box =>
  MH.includes(ALL_BOXES, box);

/**
 * Returns true if the given string is a valid dimension.
 *
 * @category Validation
 */
export const isValidDimension = (dimension: string): dimension is Dimension =>
  MH.includes(ALL_DIMENSIONS, dimension);

/**
 * @ignore
 * @internal
 */
export const tryGetViewportOverlay = (): HTMLElement | null =>
  viewportOverlay ?? null;

/**
 * @ignore
 * @internal
 *
 * Exposed via SizeWatcher
 */
export const fetchViewportOverlay = async (): Promise<HTMLElement> => {
  await init();

  return viewportOverlay;
};

/**
 * @ignore
 * @internal
 */
export const fetchViewportSize = async (realtime = false) => {
  if (!realtime) {
    await waitForMeasureTime();
  }

  const root = MH.hasDOM()
    ? (MH.getDocScrollingElement() ?? MH.getBody())
    : null;

  return {
    [MC.S_WIDTH]: root?.clientWidth ?? 0,
    [MC.S_HEIGHT]: root?.clientHeight ?? 0,
  };
};

// ----------------------------------------

const S_INLINE_SIZE = "inlineSize";
const S_BLOCK_SIZE = "blockSize";

const ALL_BOXES: Box[] = ["content", "border"] as const;
const ALL_DIMENSIONS: Dimension[] = [MC.S_WIDTH, MC.S_HEIGHT] as const;

const getSizeFromInlineBlock = (
  size: ResizeObserverSize | ReadonlyArray<ResizeObserverSize>,
): Size => {
  /* istanbul ignore else */
  if (MH.isIterableObject(size)) {
    return {
      [MC.S_WIDTH]: size[0][S_INLINE_SIZE],
      [MC.S_HEIGHT]: size[0][S_BLOCK_SIZE],
    };
  }
  return {
    // in some browsers inlineSize and blockSize are scalars and nor Arrays
    [MC.S_WIDTH]: (size as { [S_INLINE_SIZE]: number })[S_INLINE_SIZE],
    [MC.S_HEIGHT]: (size as { [S_BLOCK_SIZE]: number })[S_BLOCK_SIZE],
  };
};

// ------------------------------

let viewportOverlay: HTMLElement;
let initPromise: Promise<void> | null = null;
const init = (): Promise<void> => {
  if (!initPromise) {
    initPromise = (async () => {
      viewportOverlay = await createOverlay({
        id: MH.prefixName("vp-ovrl"),
        style: {
          position: "fixed",
          [MC.S_WIDTH]: "100vw",
          [MC.S_HEIGHT]: "100vh",
        },
      });
    })();
  }

  return initPromise;
};
