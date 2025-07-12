/**
 * @module Utils
 */
import { GestureFragment } from "../utils/gesture.js";
/**
 * Returns a {@link GestureFragment} for the given events. Only "keydown"
 * events will be considered.
 *
 * If there are no "keydown" events in the given list of events, returns
 * `false`.
 *
 * The deltas of all events are summed together before determining final delta
 * and direction.
 *
 * If the events are of conflicting types, i.e. some scroll, some zoom, then
 * the intent will be "unknown" and the direction will be "ambiguous".
 *
 * Otherwise, if the deltas sum up to 0, the direction will be "none".
 *
 * **IMPORTANT NOTES ON THE DELTA VALUES**
 *
 * For key gestures the deltas are unreliable. You should not assume they
 * correspond to the would-be scroll or zoom amount that the browser would do.
 * But they can be used to determine relative amounts for animating, etc.
 *
 * Key press events can be divided into 3 categories: that scroll by a "line"
 * (e.g. arrow keys), by a "page" (e.g. PageUp/PageDown) or by the full content
 * height/width (e.g. Home/End). The actual scroll amount that _would_ result
 * from the event is dependent on the browser, the window size or the element's
 * scroll width/height, so ours can only be a best guess.
 *
 * Since the actual pixel equivalent is browser specific, we use reasonable
 * default values of delta for each of these "line", "page" or "content" modes,
 * similar to what
 * {@link Utils.getWheelGestureFragment | getWheelGestureFragment} does:
 * - For "line", then a configurable fixed value is used
 *  ({@link settings.deltaLineHeight}).
 * - For "page", then a configurable fixed value is used
 *  ({@link settings.deltaPageHeight}).
 * - For "content", the element's scroll height is used if given, otherwise
 *   the viewport height (same as "page"). We do not try to get the current
 *   scroll height of the target element, (which would be the best guess value
 *   of `deltaY` in case of Home/End key presses), as that would either involve
 *   an asynchronous action or would result in forced layout. If the caller is
 *   already tracking the scroll height of the target, you can pass this as an
 *   argument. Otherwise, we'll default to using the viewport height, same as
 *   for PageUp/Down.
 *
 * If the key gesture fragment is a result of multiple events that were
 * accumulated, the deltas are summed as usual, e.g. if a "page" is equal to 20
 * "lines", then pressing PageDown and then 10 times Up, would result in a
 * delta equal to 10 "lines" down.
 *
 * For zoom intents, `deltaZ` gives a relative change of scale, whereby each
 * press of + or - steps up by 15% or down by ~13% (`1 / 1.15` to be exact)
 * since the previous one.
 *
 * @param [options.angleDiffThreshold] See {@link getVectorDirection}
 * @param [options.scrollHeight]       Use this as deltaY when Home/End is
 *                                     pressed.
 *
 * @returns `false` if there are no "keydown" events in the list, otherwise a
 * {@link GestureFragment}.
 *
 * @category Gestures
 */
export declare const getKeyGestureFragment: (events: Event | readonly Event[], options?: {
    angleDiffThreshold?: number;
    scrollHeight?: number;
}) => GestureFragment | false;
//# sourceMappingURL=gesture-key.d.ts.map