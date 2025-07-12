/**
 * @module Utils
 */
import { GestureFragment } from "../utils/gesture.js";
/**
 * Returns a {@link GestureFragment} for the given events. If the browser
 * supports Pointer events, then only "pointermove" events will be considered.
 * Otherwise, only "mousemove" events will be considered.
 *
 * If there are less than 2 such events in the given list of events, returns
 * `false`.
 *
 * If the gesture is to be considered terminated, e.g. because there is
 * "pointercancel" in the list or buttons other than the primary are pressed,
 * returns `null`.
 *
 * Pointer gestures always require the primary button to be pressed and the
 * resulting intent is always "drag", and `deltaZ` is always 1.
 *
 * @param [options.angleDiffThreshold] See {@link getVectorDirection}
 *
 * @returns `false` if there are less than 2 "pointermove"/"mousemove" events
 * in the list, `null` if the gesture is terminated, otherwise a
 * {@link GestureFragment}.
 *
 * @category Gestures
 */
export declare const getPointerGestureFragment: (events: Event | readonly Event[], options?: {
    angleDiffThreshold?: number;
}) => GestureFragment | null | false;
//# sourceMappingURL=gesture-pointer.d.ts.map