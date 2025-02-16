/**
 * @module Watchers/ScrollWatcher
 */
import { XYDirection, ScrollDirection } from "../globals/types.js";
import { ScrollTarget, TargetCoordinates, CommaSeparatedStr } from "../globals/types.js";
import { ScrollAction, ScrollToOptions } from "../utils/scroll.js";
import { CallbackHandler, Callback } from "../modules/callback.js";
export type { ScrollAction, ScrollToOptions } from "../utils/scroll.js";
/**
 * {@link ScrollWatcher} listens for scroll events in any direction.
 *
 * It manages registered callbacks globally and reuses event listeners for more
 * efficient performance.
 */
export declare class ScrollWatcher {
    /**
     * Call the given handler whenever the given scrollable is scrolled.
     *
     * Unless {@link OnScrollOptions.skipInitial} is true, the handler is also
     * called (almost) immediately with the latest scroll data. If a scroll has
     * not yet been observed on the scrollable and its `scrollTop` and
     * `scrollLeft` are 0, then the direction is {@link Types.NoDirection} and
     * the handler is only called if {@link Types.NoDirection} is part of the
     * supplied {@link OnScrollOptions.directions | options.directions} (or
     * {@link OnScrollOptions.directions | options.directions} is not given).
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same scrollable, even if the options differ. If the handler has already
     * been added for this scrollable, either using {@link trackScroll} or using
     * {@link onScroll}, then it will be removed and re-added with the current
     * options. So if previously it was also tracking content size changes using
     * {@link trackScroll}, it will no longer do so.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the options are invalid.
     */
    readonly onScroll: (handler: OnScrollHandler, options?: OnScrollOptions) => Promise<void>;
    /**
     * Removes a previously added handler.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the scrollable is invalid.
     */
    readonly offScroll: (handler: OnScrollHandler, scrollable?: ScrollTarget) => void;
    /**
     * This everything that {@link onScroll} does plus more:
     *
     * In addition to a scroll event, the handler is also called when either the
     * offset size or scroll (content) size of the scrollable changes as that
     * would affect its `scrollTopFraction` and `scrollLeftFraction` and possibly
     * the `scrollTop` and `scrollLeft` as well.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same scrollable, even if the options differ. If the handler has already
     * been added for this scrollable, either using {@link trackScroll} or using
     * {@link onScroll}, then it will be removed and re-added with the current
     * options.
     *
     * ------
     *
     * If `handler` is not given, then it defaults to an internal handler that
     * updates a set of CSS variables on the scrollable element's style:
     *
     * - If {@link OnScrollOptions.scrollable | options.scrollable} is not given,
     *   or is `null`, `window` or `document`, the following CSS variables are
     *   set on the root (`html`) element and represent the scroll of the
     *   {@link fetchMainScrollableElement}:
     *   - `--lisn-js--page-scroll-top`
     *   - `--lisn-js--page-scroll-top-fraction`
     *   - `--lisn-js--page-scroll-left`
     *   - `--lisn-js--page-scroll-left-fraction`
     *   - `--lisn-js--page-scroll-width`
     *   - `--lisn-js--page-scroll-height`
     *
     * - Otherwise, the following variables are set on the scrollable itself,
     *   and represent its scroll offset:
     *   - `--lisn-js--scroll-top`
     *   - `--lisn-js--scroll-top-fraction`
     *   - `--lisn-js--scroll-left`
     *   - `--lisn-js--scroll-left-fraction`
     *   - `--lisn-js--scroll-width`
     *   - `--lisn-js--scroll-height`
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the options are invalid.
     */
    readonly trackScroll: (handler?: OnScrollHandler | null, options?: OnScrollOptions) => Promise<void>;
    /**
     * Removes a previously added handler for {@link trackScroll}.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the scrollable is invalid.
     */
    readonly noTrackScroll: (handler?: OnScrollHandler | null, scrollable?: ScrollTarget) => void;
    /**
     * Get the scroll offset of the given scrollable. By default, it will
     * {@link waitForMeasureTime} and so will be delayed by one frame.
     *
     * @param {} realtime If true, it will not {@link waitForMeasureTime}. Use
     *                    this only when doing realtime scroll-based animations
     *                    as it may cause a forced layout.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the scrollable is invalid.
     */
    readonly fetchCurrentScroll: (scrollable?: ScrollTarget, realtime?: boolean) => Promise<ScrollData>;
    /**
     * Scrolls the given scrollable element to in the given direction.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the direction or options are invalid.
     */
    readonly scroll: (direction: XYDirection, options?: ScrollOptions) => Promise<ScrollAction | null>;
    /**
     * Scrolls the given scrollable element to the given `to` scrollable.
     *
     * Returns `null` if there's an ongoing scroll that is not cancellable.
     *
     * Note that if `to` is an element or a selector, then it _must_ be a
     * descendant of the scrollable element.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the "to" coordinates or options are invalid.
     *
     * @param {} to  If this is an element, then its top-left position is used as
     *               the target coordinates. If it is a string, then it is treated
     *               as a selector for an element using `querySelector`.
     * @param {} [options.scrollable]
     *               If not given, it defaults to {@link fetchMainScrollableElement}
     *
     * @return {} `null` if there's an ongoing scroll that is not cancellable,
     * otherwise a {@link ScrollAction}.
     */
    readonly scrollTo: (to: TargetCoordinates | Element | string, options?: ScrollToOptions) => Promise<ScrollAction | null>;
    /**
     * Returns the current {@link ScrollAction} if any.
     *
     * @param {} scrollable
     *               If not given, it defaults to {@link fetchMainScrollableElement}
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the scrollable is invalid.
     */
    readonly fetchCurrentScrollAction: (scrollable?: Element) => Promise<ScrollAction | null>;
    /**
     * Cancels the ongoing scroll that's resulting from smooth scrolling
     * triggered in the past. Does not interrupt or prevent further scrolling.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the scrollable is invalid.
     *
     * @param {} [options.immediate]  If true, then it will not use
     *                                {@link waitForMeasureTime} or
     *                                {@link Utils.waitForMutateTime | waitForMutateTime}.
     *                                Warning: this will likely result in forced layout.
     */
    readonly stopUserScrolling: (options?: {
        scrollable?: ScrollTarget;
        immediate?: boolean;
    }) => Promise<void>;
    /**
     * Returns the element that holds the main page content. By default it's
     * `document.body` but is overridden by
     * {@link settings.mainScrollableElementSelector}.
     *
     * It will wait for the element to be available if not already.
     */
    static fetchMainContentElement(): Promise<HTMLElement>;
    /**
     * Returns the scrollable element that holds the wrapper around the main page
     * content. By default it's `document.scrollable` (unless `document.body` is
     * actually scrollable, in which case it will be used) but it will be
     * different if {@link settings.mainScrollableElementSelector} is set.
     *
     * It will wait for the element to be available if not already.
     */
    static fetchMainScrollableElement(): Promise<HTMLElement>;
    /**
     * Creates a new instance of ScrollWatcher with the given
     * {@link ScrollWatcherConfig}. It does not save it for future reuse.
     */
    static create(config?: ScrollWatcherConfig): ScrollWatcher;
    /**
     * Returns an existing instance of ScrollWatcher with the given
     * {@link ScrollWatcherConfig}, or creates a new one.
     *
     * **NOTE:** It saves it for future reuse, so don't use this for temporary
     * short-lived watchers.
     */
    static reuse(config?: ScrollWatcherConfig): ScrollWatcher;
    private constructor();
}
/**
 * @interface
 */
export type ScrollWatcherConfig = {
    /**
     * The default value for
     * {@link OnScrollOptions.debounceWindow | debounceWindow} in calls to
     * {@link ScrollWatcher.onScroll}.
     *
     * @defaultValue 75
     */
    debounceWindow?: number;
    /**
     * The default value for
     * {@link OnScrollOptions.threshold | threshold} in calls to
     * {@link ScrollWatcher.onScroll}.
     *
     * @defaultValue 50
     */
    scrollThreshold?: number;
    /**
     * The default value for
     * {@link ScrollOptions.duration | duration} in calls to
     * {@link ScrollWatcher.scroll} and {@link ScrollWatcher.scrollTo}.
     *
     * @defaultValue 1000
     */
    scrollDuration?: number;
};
/**
 * @interface
 */
export type OnScrollOptions = {
    /**
     * If it is not given, or is `null`, `window` or `document`, then it will
     * track the scroll of the {@link ScrollWatcher.fetchMainScrollableElement}.
     *
     * Other values must be an `Element` and are taken literally.
     *
     * @defaultValue undefined
     */
    scrollable?: ScrollTarget;
    /**
     * If non-0, the scroll handler will only be called when the scrollable's
     * scroll offset in the observed direction has changed at least
     * `scrollThreshold` pixels since the last time the handler was called.
     *
     * @defaultValue {@link ScrollWatcherConfig.scrollThreshold}
     */
    threshold?: number;
    /**
     * Specifies a list of {@link ScrollDirection}s to listen for.
     *
     * It can be a comma-separated list of direction names or an array of such
     * names.
     *
     * If not given, then it listens for scrolls in any direction, including
     * {@link Types.NoDirection} and {@link Types.AmbiguousDirection}.
     *
     * The {@link Types.NoDirection} occurs when the callback is called initially
     * (if `skipInitial` is not `true`) and there hasn't yet been a scroll
     * observed on the scrollable _and_ it's `scrollTop`/`scrollLeft` are 0.
     *
     * The {@link Types.AmbiguousDirection} occurs when the user scrolls
     * diagonally with close to equal deltas in both horizontal and vertical
     * direction.
     *
     * **IMPORTANT:**
     *
     * The direction of a scroll event is always based on comparing `deltaX` and
     * `deltaY` relative to the _last scroll event_ (within the `debounceWindow`,
     * and not to the scroll data for the last time the callback was called (in
     * case it was skipped because `threshold` was not exceeded or in case it was
     * debounced by a larger window than the watcher).
     *
     * I.e. if you have both `threshold` and `directions` restricted, or if the
     * callback has a larger debounce window than the watcher, it is possible for
     * there to be a change in the relevant `scrollTop`/`scrollLeft` offset that
     * exceeds the threshold, and for the callback to _not_ be called.
     *
     * For a callback to be called, both of these must be true:
     * - the change in `scrollTop`/`scrollLeft`, _compared to the last time the
     *   callback was called_ must exceed the {@link threshold}
     * - the effective scroll direction, _compared to the last scroll event_
     *   prior to the _watcher's_ debounce window must be one of the given
     *   {@link directions}.
     *
     * @defaultValue undefined
     */
    directions?: CommaSeparatedStr<ScrollDirection> | ScrollDirection[];
    /**
     * Do not call the handler until there's a future scroll of the element.
     *
     * By default we call the handler (almost) immediately if there's been a
     * scroll in one of the given directions, or if there has not been a scroll
     * but directions includes {@link Types.NoDirection}, but you can disable
     * this initial call here.
     *
     * @defaultValue false
     */
    skipInitial?: boolean;
    /**
     * If non-0, the handler will be "debounced" so it's called at most
     * `debounceWindow` milliseconds.
     *
     * **IMPORTANT:**
     * If the debounce window is non-0 (default), then the callback is always
     * delayed by at least an animation frame following a scroll event to allow
     * for optimized `scrollTop`/`scrollLeft` measurements via
     * {@link waitForMeasureTime}.
     *
     * If you set this is 0, this indicates that the callback should be
     * "realtime" and will therefore skip {@link waitForMeasureTime}, which could
     * lead to forced re-layouts, but you probably need this when doing
     * scroll-based animations.
     *
     * @defaultValue {@link ScrollWatcherConfig.debounceWindow}
     */
    debounceWindow?: number;
};
/**
 * @interface
 */
export type ScrollOptions = ScrollToOptions & {
    /**
     * How much to scroll in the given direction.
     *
     * @defaultValue 100
     */
    amount?: number;
    /**
     * If set to "pixel" (default), `amount` is taken as absolute pixels.
     *
     * If set to "visible", `amount` is taken as percent of the element's visible
     * size in the scrolling direction (100 means full client width for
     * horizontal or height for vertical scroll).
     *
     * If set to "content", `amount` is taken as percent of the element's full
     * content size in the scrolling direction (100 means full scroll width for
     * horizontal or height for vertical scroll).
     *
     * @defaultValue "pixel"
     */
    asFractionOf?: "pixel" | "visible" | "content";
};
/**
 * The handler is invoked with two arguments:
 *
 * - the element that has been resized
 * - the {@link ScrollData} for the element
 */
export type OnScrollHandlerArgs = [Element, ScrollData];
export type OnScrollCallback = Callback<OnScrollHandlerArgs>;
export type OnScrollHandler = CallbackHandler<OnScrollHandlerArgs> | OnScrollCallback;
export type ScrollData = {
    clientWidth: number;
    clientHeight: number;
    scrollTop: number;
    /**
     * This is the `scrollTop` relative to the full `scrollHeight` minus the
     * `clientHeight`, ranging from 0 to 1.
     */
    scrollTopFraction: number;
    scrollLeft: number;
    /**
     * This is the `scrollLeft` relative to the full `scrollWidth` minus the
     * `clientWidth`, ranging from 0 to 1.
     */
    scrollLeftFraction: number;
    scrollWidth: number;
    scrollHeight: number;
    /**
     * This is the direction of the last scroll action, i.e. _compared to the
     * last scroll event_, not necessarily based on the deltas compared to the
     * last time this callback was called.
     */
    direction: ScrollDirection;
};
//# sourceMappingURL=scroll-watcher.d.ts.map