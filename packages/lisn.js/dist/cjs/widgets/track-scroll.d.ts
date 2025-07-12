/**
 * @module Widgets
 */
import { Widget } from "../widgets/widget.cjs";
/**
 * This is a simple wrapper around the {@link ScrollWatcher}. If you are using
 * the JavaScript API, you should use the {@link ScrollWatcher} directly. The
 * purpose of this widget is to expose the watcher's ability to track scroll
 * and set relevant CSS properties via the HTML API. See
 * {@link ScrollWatcher.trackScroll}.
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-track-scroll` class or `data-lisn-track-scroll` attribute set on
 *   the element that constitutes the widget.
 *
 * @example
 * This will track scroll on this element and set the relevant CSS properties.
 *
 * ```html
 * <div class="lisn-track-scroll"></div>
 * ```
 *
 * @example
 * As above but with custom options
 *
 * ```html
 * <div data-lisn-track-scroll="threshold=0 | debounce-window=0"></div>
 * ```
 */
export declare class TrackScroll extends Widget {
    static get(element: Element): TrackScroll | null;
    static register(): void;
    constructor(element: Element, config?: TrackScrollConfig);
}
/**
 * @interface
 */
export type TrackScrollConfig = {
    /**
     * Corresponds to
     * {@link Watchers/ScrollWatcher.OnScrollOptions.threshold | OnScrollOptions.threshold}.
     *
     * @defaultValue undefined // ScrollWatcher default
     */
    threshold?: number;
    /**
     * Corresponds to
     * {@link Watchers/ScrollWatcher.OnScrollOptions.debounceWindow | OnScrollOptions.debounceWindow}.
     *
     * @defaultValue undefined // ScrollWatcher default
     */
    debounceWindow?: number;
};
//# sourceMappingURL=track-scroll.d.ts.map