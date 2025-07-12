/**
 * @module Utils
 */
import { Box, Dimension, Size } from "../globals/types.js";
/**
 * Returns the content box size of the given
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry | ResizeObserverEntry}.
 *
 * @category Size measurements
 */
export declare const getEntryContentBox: (entry: ResizeObserverEntry) => Size;
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
export declare const getEntryBorderBox: (entry: ResizeObserverEntry, fallbackToContent?: boolean) => Size;
/**
 * Returns true if the given string is a valid box type.
 *
 * @category Validation
 */
export declare const isValidBox: (box: string) => box is Box;
/**
 * Returns true if the given string is a valid dimension.
 *
 * @category Validation
 */
export declare const isValidDimension: (dimension: string) => dimension is Dimension;
/**
 * @ignore
 * @internal
 */
export declare const tryGetViewportOverlay: () => HTMLElement | null;
/**
 * @ignore
 * @internal
 *
 * Exposed via SizeWatcher
 */
export declare const fetchViewportOverlay: () => Promise<HTMLElement>;
/**
 * @ignore
 * @internal
 */
export declare const fetchViewportSize: (realtime?: boolean) => Promise<{
    width: number;
    height: number;
}>;
//# sourceMappingURL=size.d.ts.map