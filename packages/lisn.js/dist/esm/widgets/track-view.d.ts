/**
 * @module Widgets
 */
import { Widget } from "../widgets/widget.js";
/**
 * This is a simple wrapper around the {@link ViewWatcher}. If you are using
 * the JavaScript API, you should use the {@link ViewWatcher} directly. The
 * purpose of this widget is to expose the watcher's ability to track an
 * element's position across the viewport (or a given root element) and set
 * relevant CSS properties via the HTML API. See {@link ViewWatcher.trackView}.
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-track-view` class or `data-lisn-track-view` attribute set on
 *   the element that constitutes the widget.
 *
 * See below examples for what values you can use set for the data attributes
 * in order to modify the configuration of the automatically created widget.
 *
 * Note that the root margin value can either be comma-separated or
 * space-separated.
 *
 * @example
 * This will track the element across the viewport and set the relevant CSS
 * properties.
 *
 * ```html
 * <div class="lisn-track-view"></div>
 * ```
 *
 * @example
 * As above but with custom settings.
 *
 * ```html
 * <div id="myRoot"></div>
 * <div data-lisn-track-view="root=#myRoot
 *                            | root-margin=100px,50px
 *                            | threshold=0,0.5
 *                            | debounce-window=0
 *                            | resize-threshold=0
 *                            | scroll-threshold=0"
 * ></div>
 * ```
 */
export declare class TrackView extends Widget {
    static get(element: Element): TrackView | null;
    static register(): void;
    constructor(element: Element, config?: TrackViewConfig);
}
/**
 * @interface
 */
export type TrackViewConfig = {
    /**
     * Corresponds to
     * {@link Watchers/ViewWatcher.ViewWatcherConfig.root | ViewWatcherConfig.root}.
     *
     * @defaultValue undefined // ViewWatcher default
     */
    root?: Element | null;
    /**
     * Corresponds to
     * {@link Watchers/ViewWatcher.ViewWatcherConfig.rootMargin | ViewWatcherConfig.rootMargin}.
     *
     * @defaultValue undefined // ViewWatcher default
     */
    rootMargin?: string;
    /**
     * Corresponds to
     * {@link Watchers/ViewWatcher.ViewWatcherConfig.threshold | ViewWatcherConfig.threshold}.
     *
     * @defaultValue undefined // ViewWatcher default
     */
    threshold?: number | number[];
    /**
     * Corresponds to
     * {@link Watchers/ViewWatcher.TrackViewOptions.debounceWindow | TrackViewOptions.debounceWindow}.
     *
     * @defaultValue undefined // ViewWatcher default
     */
    debounceWindow?: number;
    /**
     * Corresponds to
     * {@link Watchers/ViewWatcher.TrackViewOptions.resizeThreshold | TrackViewOptions.resizeThreshold}.
     *
     * @defaultValue undefined // ViewWatcher default
     */
    resizeThreshold?: number;
    /**
     * Corresponds to
     * {@link Watchers/ViewWatcher.TrackViewOptions.scrollThreshold | TrackViewOptions.scrollThreshold}.
     *
     * @defaultValue undefined // ViewWatcher default
     */
    scrollThreshold?: number;
};
//# sourceMappingURL=track-view.d.ts.map