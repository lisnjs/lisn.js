/**
 * @module Utils
 */
import { GestureFragment } from "../utils/gesture.cjs";
/**
 * @category Gestures
 */
export type TouchDiff = {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    deltaX: number;
    deltaY: number;
    isSignificant: boolean;
};
/**
 * Returns a {@link GestureFragment} for the given events. Only "touchmove" events
 * will be considered.
 *
 * If there are less than 2 such events in the given list of events, returns `false`.
 *
 * If the gesture is to be considered terminated, e.g. because there is
 * "touchcancel" in the list, returns `null`.
 *
 * Note that by default swipe actions follow the natural direction: swipe up
 * with scroll intent results in direction down and swipe down results in
 * direction up. Drag intent always follows the direction of the gesture.
 *
 * For zoom intents, which necessarily involves exactly two fingers `deltaZ`
 * is based on the relative change in distance between the fingers.
 *
 * @param [options.deltaThreshold]
 *                          A change of x or y coordinate less than this is
 *                          considered insignificant, for the purposes of
 *                          determining:
 *                          1) whether the inferred direction is in one of the
 *                             four cardinal ones, or otherwise ambiguous; and
 *                          2) whether more than two fingers have moved and
 *                             therefore whether the direction could be zoom or
 *                             not
 * @param [options.angleDiffThreshold] See {@link getVectorDirection}
 * @param [options.reverseScroll]
 *                          If set to `true`, will disable natural scroll
 *                          direction.
 * @param [options.dragHoldTime]
 *                          If the user presses and holds for at least the
 *                          given amount of milliseconds before moving the
 *                          finger(s), gestures other than pinch will be
 *                          treated as a drag instead of scroll as long as the
 *                          number of fingers touching the screen is
 *                          `options.dragNumFingers`. Default is 500ms.
 * @param [options.dragNumFingers]
 *                          The number of fingers that could be considered a
 *                          drag intent. Default is 1.
 *
 * @returns `false` if there are less than 2 "touchmove" events in the list,
 * `null` if the gesture is terminated, otherwise a {@link GestureFragment}.
 *
 * @category Gestures
 */
export declare const getTouchGestureFragment: (events: Event[], options?: {
    deltaThreshold?: number;
    angleDiffThreshold?: number;
    reverseScroll?: boolean;
    dragHoldTime?: number;
    dragNumFingers?: number;
}) => GestureFragment | null | false;
/**
 * Returns a description of the changes in each finger between the first and
 * the last relevant TouchEvent in the list.
 *
 * If the gesture is to be considered terminated, e.g. because there is
 * "touchcancel" in the list, returns `null`.
 *
 * Note that, `deltaX`/`deltaY` are the end X/Y coordinate minus the start X/Y
 * coordinate. For natural scroll direction you should swap their signs.
 *
 * @param deltaThreshold If the change of x and y coordinate are both less
 *                       than this, it is marked as not significant.
 *
 * @category Gestures
 */
export declare const getTouchDiff: (events: Event[], deltaThreshold?: number) => TouchDiff[] | null;
//# sourceMappingURL=gesture-touch.d.ts.map