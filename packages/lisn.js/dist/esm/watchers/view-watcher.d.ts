/**
 * @module Watchers/ViewWatcher
 */
import { ViewTarget, View, BoundingRect, CommaSeparatedStr } from "../globals/types.js";
import { CallbackHandler, Callback } from "../modules/callback.js";
/**
 * {@link ViewWatcher} monitors the position of a given target relative to the
 * given {@link ViewWatcherConfig.root | root} or the viewport.
 *
 * It's built on top of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver | IntersectionObserver}.
 *
 * It manages registered callbacks globally and reuses IntersectionObservers
 * for more efficient performance.
 */
export declare class ViewWatcher {
    /**
     * Call the given handler whenever the {@link ViewWatcherConfig.root | root}'s
     * view relative to the target position changes, i.e. when the target enters
     * or leaves the root.
     *
     * Unless {@link OnViewOptions.skipInitial} is true, the handler is also
     * called (almost) immediately with the current view if it matches this
     * set of options*.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same target, even if the options differ. If the handler has already been
     * added for this target, either using {@link trackView} or using
     * {@link onView}, then it will be removed and re-added with the current
     * options. So if previously it was also tracking position across root
     * using {@link trackView}, it will no longer do so.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target or the options are invalid.
     */
    readonly onView: (target: ViewTarget, handler: OnViewHandler, options?: OnViewOptions) => Promise<void>;
    /**
     * Removes a previously added handler.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target is invalid.
     */
    readonly offView: (target: ViewTarget, handler: OnViewHandler) => void;
    /**
     * This does more than just {@link onView}. The difference is that in
     * addition to a change of {@link View}, such as the target entering or
     * leaving the ViewWatcher's {@link ViewWatcherConfig.root | root} (by
     * default the viewport), the handler is also called each time the target's
     * relative view changes _while inside the root_.
     *
     * A change of relative position happens when:
     * - the target is resized
     * - the root is resized
     * - the any of the target's scrollable ancestors is scrolled
     * - the target's attributes changed that resulted in a change of position
     *
     * All of the above are accounted for. Internally it uses
     * {@link ScrollWatcher}, {@link DOMWatcher} and {@link SizeWatcher} to keep
     * track of all of this.
     *
     * If the target is leaves the ViewWatcher's
     * {@link ViewWatcherConfig.root | root}, the handler will be called with
     * the {@link ViewData}, and the above events will stop being tracked until
     * the target enters the watcher's root again.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same target, even if the options differ. If the handler has already been
     * added for this target, either using {@link trackView} or using
     * {@link onView}, then it will be removed and re-added with the current
     * options.
     *
     * ------
     *
     * If `handler` is not given, then it defaults to an internal handler that
     * updates the following set of CSS variables on the target's style and
     * represent its relative position:
     *
     * - `--lisn-js--r-top`
     * - `--lisn-js--r-bottom`
     * - `--lisn-js--r-left`
     * - `--lisn-js--r-right`
     * - `--lisn-js--r-width`
     * - `--lisn-js--r-height`
     * - `--lisn-js--r-h-middle`
     * - `--lisn-js--r-v-middle`
     *
     * See {@link ViewData.relative} for an explanation of each.
     *
     * Note that only Element targets are supported here and not offsets.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target or "views" are invalid.
     */
    readonly trackView: (element: Element, handler?: OnViewHandler | null, options?: TrackViewOptions) => Promise<void>;
    /**
     * Removes a previously added handler for {@link trackView}.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target is invalid.
     */
    readonly noTrackView: (element: Element, handler?: OnViewHandler | null) => void;
    /**
     * Get the current view relative to the target. By default, it will
     * {@link waitForMeasureTime} and so will be delayed by one frame.
     *
     * @param {} realtime If true, it will not {@link waitForMeasureTime}. Use
     *                    this only when doing realtime scroll-based animations
     *                    as it may cause a forced layout.
     */
    readonly fetchCurrentView: (target: ViewTarget, realtime?: boolean) => Promise<ViewData>;
    /**
     * Creates a new instance of ViewWatcher with the given
     * {@link ViewWatcherConfig}. It does not save it for future reuse.
     */
    static create(config?: ViewWatcherConfig): ViewWatcher;
    /**
     * Returns an existing  instance of ViewWatcher with the given
     * {@link ViewWatcherConfig}, or creates a new one.
     *
     * **NOTE:** It saves it for future reuse, so don't use this for temporary
     * short-lived watchers.
     */
    static reuse(config?: ViewWatcherConfig): ViewWatcher;
    private constructor();
}
/**
 * @interface
 */
export type ViewWatcherConfig = {
    /**
     * The root element to use for the IntersectionObserver.
     *
     * **NOTE:** If the target you want to observe (via
     * {@link ViewWatcher.onView}) is inside a scrolling element, then you should
     * probably set the watcher's root to be that scrolling element or a wrapper
     * around it. However, even if you don't or can't do that, the watcher will
     * try to be smart about that, and when the target is no longer intercepting
     * because it's scrolled outside its scrolling container, and yet its
     * bounding box is still inside the watcher root (e.g. the viewport) the
     * watcher will determine the relative view based on the scrolling container
     * and not the actual watcher root.
     *
     * @defaultValue null
     */
    root?: Element | null;
    /**
     * The rootMargin to pass to the IntersectionObserver constructor options.
     *
     * @defaultValue "0px 0px 0px 0px"
     */
    rootMargin?: string;
    /**
     * The threshold to pass to the IntersectionObserver constructor options.
     *
     * @defaultValue 0
     */
    threshold?: number | number[];
};
/**
 * @interface
 */
export type OnViewOptions = {
    /**
     * Specifies a list of {@link View}s to target for.
     *
     * The handler will only be called if there is a change of view relative to
     * the target that matches the given ones.
     *
     * It can be a comma-separated list of "views" or an array of such names.
     *
     * @defaultValue undefined
     */
    views?: CommaSeparatedStr<View> | View[];
    /**
     * Do not call the handler until there's a future resize of the element.
     *
     * By default we call the handler (almost) immediately with the current size
     * data for the target.
     *
     * @defaultValue false
     */
    skipInitial?: boolean;
};
/**
 * @interface
 */
export type TrackViewOptions = {
    /**
     * Use this debounce window for the {@link ScrollWatcher} and
     * {@link SizeWatcher} involved in the view tracking.
     *
     * **IMPORTANT:**
     * If the debounce window is non-0 (default), then the callback is always
     * delayed by at least an animation frame following a scroll event to allow
     * for optimized `scrollTop`/`scrollLeft` measurements via
     * {@link waitForMeasureTime}.
     *
     * If you set this is 0, this indicates that the callback should be
     * "realtime" and will therefore skip {@link waitForMeasureTime}, which could
     * lead to forced re-layouts during scroll, but you probably need this when
     * doing scroll-based animations.
     *
     * @defaultValue undefined // ScrollWatcher and SizeWatcher defaults
     */
    debounceWindow?: number;
    /**
     * Use this resize threshold for the {@link SizeWatcher} involved in the view
     * tracking.
     *
     * @defaultValue undefined // SizeWatcher default
     */
    resizeThreshold?: number;
    /**
     * Use this scroll threshold for the {@link ScrollWatcher} involved in the
     * view tracking.
     *
     * @defaultValue undefined // ScrollWatcher default
     */
    scrollThreshold?: number;
    /**
     * Do not call the handler until there's a future resize of the element.
     *
     * By default we call the handler (almost) immediately with the current size
     * data for the target.
     *
     * @defaultValue false
     */
    skipInitial?: boolean;
};
/**
 * The handler is invoked with two arguments:
 *
 * - The element that is the target of the IntersectionObserver. If the call to
 *   {@link ViewWatcher.onView} specified an element as the target, it will be
 *   the same. If it specified an offset, then the element passed to the
 *   callback will be an absolutely positioned trigger overlay that's created
 *   as a result.
 * - the {@link ViewData} for relative to the target
 */
export type OnViewHandlerArgs = [Element, ViewData];
export type OnViewCallback = Callback<OnViewHandlerArgs>;
export type OnViewHandler = CallbackHandler<OnViewHandlerArgs> | OnViewCallback;
export type ViewData = {
    isIntersecting: boolean;
    targetBounds: BoundingRect;
    rootBounds: BoundingRect;
    /**
     * The current view or views of the target. There would be two views given
     * only if the target is _not_ in view and it's diagonally across from the
     * root, e.g. both below and to the right.
     */
    views: [View, View?];
    /**
     * This is the target's position relative to the
     * {@link ViewWatcherConfig.root | root} with values relative to the root
     * size.
     *
     * It is like the {@link targetBounds} except that each quantity is scaled by
     * the root's width or height, and having two additional computed values.
     */
    relative: {
        x: number;
        y: number;
        top: number;
        bottom: number;
        left: number;
        right: number;
        width: number;
        height: number;
        /**
         * Average of the relative left and right.
         */
        hMiddle: number;
        /**
         * Average of the relative top and bottom.
         */
        vMiddle: number;
    };
};
//# sourceMappingURL=view-watcher.d.ts.map