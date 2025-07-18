/**
 * @module Utils
 */
import { GestureFragment } from "../utils/gesture.cjs";
/**
 * Returns a {@link GestureFragment} for the given events. Only "wheel" events
 * will be considered.
 *
 * If there are no "wheel" events in the given list of events, returns `false`.
 *
 * The deltas of all events are summed together before determining final delta
 * and direction.
 *
 * If the events are of conflicting types, i.e. some scroll, some zoom, then
 * the intent will be "unknown" and the direction will be "ambiguous".
 *
 * If the deltas sum up to 0, the direction will be "none".
 *
 * **IMPORTANT NOTES ON THE DELTA VALUES**
 *
 * For wheel gestures the deltas are _highly_ unreliable, especially when
 * zooming (Control + wheel or pinching trackpad). You should not assume they
 * correspond to the would-be scroll or zoom amount that the browser would do.
 * But they can be used to determine relative amounts for animating, etc.
 *
 * If the browser reports the delta values of a WheelEvent to be in mode "line",
 * then a configurable fixed value is used
 * ({@link Settings.settings.deltaLineHeight | settings.deltaLineHeight}).
 *
 * If the browser reports the delta values of a WheelEvent to be in mode "page",
 * then a configurable fixed value is used
 * ({@link Settings.settings.deltaPageWidth | settings.deltaPageWidth} and
 * ({@link Settings.settings.deltaPageHeight | settings.deltaPageHeight}).
 *
 * For zoom intents `deltaZ` is based on what the browser reports as the
 * `deltaY`, which in most browsers roughly corresponds to a percentage zoom
 * factor.
 *
 * @param {} [options.angleDiffThreshold] See {@link getVectorDirection}.
 *                                        Default is 5.
 *
 * @returns {} `false` if there are no "wheel" events in the list, otherwise a
 * {@link GestureFragment}.
 *
 * @category Gestures
 */
export declare const getWheelGestureFragment: (events: Event | readonly Event[], options?: {
    angleDiffThreshold?: number;
}) => GestureFragment | null | false;
//# sourceMappingURL=gesture-wheel.d.ts.map