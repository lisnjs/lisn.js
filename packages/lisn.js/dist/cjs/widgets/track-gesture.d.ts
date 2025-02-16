/**
 * @module Widgets
 */
import { Widget } from "../widgets/widget.cjs";
/**
 * This is a simple wrapper around the {@link GestureWatcher}. If you are using
 * the JavaScript API, you should use the {@link GestureWatcher} directly. The
 * purpose of this widget is to expose the watcher's ability to track gestures
 * and set relevant CSS properties via the HTML API. See
 * {@link GestureWatcher.trackGesture}.
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-track-gesture` class or `data-lisn-track-gesture` attribute set on
 *   the element that constitutes the widget.
 *
 * See below examples for what values you can use set for the data attributes
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This will track user gestures over this element and set the relevant CSS
 * properties. It will use the default {@link GestureWatcher} options.
 *
 * ```html
 * <div class="lisn-track-gesture"></div>
 * ```
 *
 * @example
 * As above but with custom settings.
 *
 * ```html
 * <div data-lisn-track-gesture="prevent-default=false
 *                               | min-delta-x=-100
 *                               | max-delta-x=100
 *                               | min-delta-y=-100
 *                               | max-delta-y=100
 *                               | min-delta-z=0.5
 *                               | max-delta-z=2"
 * ></div>
 * ```
 */
export declare class TrackGesture extends Widget {
    static get(element: Element): TrackGesture | null;
    static register(): void;
    constructor(element: Element, config?: TrackGestureConfig);
}
/**
 * @interface
 */
export type TrackGestureConfig = {
    /**
     * Corresponds to
     * {@link Watchers/GestureWatcher.OnGestureOptions.preventDefault | OnGestureOptions.preventDefault}.
     *
     * @defaultValue undefined // GestureWatcher default
     */
    preventDefault?: boolean;
    /**
     * Corresponds to
     * {@link Watchers/GestureWatcher.OnGestureOptions.minTotalDeltaX | OnGestureOptions.minTotalDeltaX}.
     *
     * @defaultValue undefined // GestureWatcher default
     */
    minDeltaX?: number;
    /**
     * Corresponds to
     * {@link Watchers/GestureWatcher.OnGestureOptions.maxTotalDeltaX | OnGestureOptions.maxTotalDeltaX}.
     *
     * @defaultValue undefined // GestureWatcher default
     */
    maxDeltaX?: number;
    /**
     * Corresponds to
     * {@link Watchers/GestureWatcher.OnGestureOptions.minTotalDeltaY | OnGestureOptions.minTotalDeltaY}.
     *
     * @defaultValue undefined // GestureWatcher default
     */
    minDeltaY?: number;
    /**
     * Corresponds to
     * {@link Watchers/GestureWatcher.OnGestureOptions.maxTotalDeltaY | OnGestureOptions.maxTotalDeltaY}.
     *
     * @defaultValue undefined // GestureWatcher default
     */
    maxDeltaY?: number;
    /**
     * Corresponds to
     * {@link Watchers/GestureWatcher.OnGestureOptions.minTotalDeltaZ | OnGestureOptions.minTotalDeltaZ}.
     *
     * @defaultValue undefined // GestureWatcher default
     */
    minDeltaZ?: number;
    /**
     * Corresponds to
     * {@link Watchers/GestureWatcher.OnGestureOptions.maxTotalDeltaZ | OnGestureOptions.maxTotalDeltaZ}.
     *
     * @defaultValue undefined // GestureWatcher default
     */
    maxDeltaZ?: number;
};
//# sourceMappingURL=track-gesture.d.ts.map