/**
 * @module Triggers
 *
 * @categoryDescription View
 * {@link ViewTrigger} allows you to run actions when the viewport's scroll
 * position relative to a given target or offset from top/bottom/left/right is
 * one of the matching "views" (at/above/below/left/right), and undo those
 * actions when the viewport's "view" is not matching.
 */
import { ViewTarget, View, CommaSeparatedStr } from "../globals/types.js";
import { Action } from "../actions/action.js";
import { Trigger, TriggerConfig } from "../triggers/trigger.js";
/**
 * {@link ViewTrigger} allows you to run actions when the viewport's scroll
 * position relative to a given target or offset from top/bottom/left/right is
 * one of the matching "views" (at/above/below/left/right), and undo those
 * actions when the viewport's "view" is not matching.
 *
 * -------
 *
 * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
 * specification.
 *
 * - Arguments (optional): One or more (comma-separated) {@link View}s.
 *   Default is "at".
 * - Additional trigger options:
 *   - `target`: A string element specification for an element (see
 *     {@link Utils.getReferenceElement | getReferenceElement}) or a
 *     {@link Types.ScrollOffset | ScrollOffset}.
 *   - `root`: A string element specification. See
 *     {@link Utils.getReferenceElement | getReferenceElement}.
 *   - `rootMargin`: A string.
 *   - `threshold`: A number or list (comma-separated) of numbers.
 *
 * @example
 * Show the element when it's in the viewport, hide otherwise.
 *
 * ```html
 * <div data-lisn-on-view="at @show"></div>
 * ```
 *
 * @example
 * Same as above. "views" is optional and defaults to "at".
 *
 * ```html
 * <div data-lisn-on-view="@show"></div>
 * ```
 *
 * @example
 * As above but using a CSS class instead of data attribute:
 *
 * ```html
 * <div class="lisn-on-view--@show"></div>
 * ```
 *
 * @example
 * Show the element 1000ms after the first time it enters the viewport.
 *
 * ```html
 * <div data-lisn-on-view="@show +once +delay=1000"></div>
 * ```
 *
 * @example
 * Add class `seen` the first time the element enters the viewport, and play
 * the animations defined on it 1000ms after each time it enters the viewport,
 * reverse the animations as soon as it goes out of view.
 *
 * ```html
 * <div data-lisn-on-view="@add-class=seen +once ;
 *                         @animate +do-delay=1000"
 * ></div>
 * ```
 *
 * @example
 * Add class `seen` when the viewport is at or below the element (element
 * above viewport), remove it when the viewport is above the element.
 * Element going to the left or right of the viewport will not trigger the
 * action. See {@link getOppositeViews}:
 *
 * ```html
 * <div data-lisn-on-view="at,below @add-class=seen"></div>
 * ```
 *
 * @example
 * Add class `cls` when the viewport is above or to the left the element
 * (element below or to the right of the viewport), remove it when the
 * viewport is either at, below or to the right of the element.
 *
 * ```html
 * <div data-lisn-on-view="above,left @add-class=cls"></div>
 * ```
 *
 * @example
 * Hide the element when the viewport is above the next element with class
 * `section`, show it when the viewport is below or at the target element.
 *
 * ```html
 * <div data-lisn-on-view="above @hide +target=next.section"></div>
 * <div class="section"></div>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <div data-lisn-on-view="above @hide +target=next-section"></div>
 * <div data-lisn-ref="section"></div>
 * ```
 *
 * @example
 * Open the {@link Widgets.Openable | Openable} widget configured for this
 * element when the viewport is 75% down from the top of the page.
 *
 * ```html
 * <div data-lisn-on-view="@open +target=top:75%"></div>
 * ```
 *
 * @category View
 */
export declare class ViewTrigger extends Trigger {
    readonly getConfig: () => ViewTriggerConfig;
    static register(): void;
    /**
     * If no actions are supplied, nothing is done.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the config is invalid.
     */
    constructor(element: Element, actions: Action[], config?: ViewTriggerConfig);
}
/**
 * @category View
 * @interface
 */
export type ViewTriggerConfig = TriggerConfig & {
    /**
     * The {@link View} to use as the trigger.
     * See also {@link Watchers/ViewWatcher.OnViewOptions | OnViewOptions}
     *
     * Actions will be "done" when the view matches the given spec and "undone"
     * otherwise. What the opposite views are depends on the given view. E.g. for
     * "at", opposites are all the other ones;  for "above", the opposite ones
     * are "at" and "below"; for "at,above" opposite is "below", etc.
     *
     * @defaultValue "at"
     */
    views?: CommaSeparatedStr<View> | View[];
    /**
     * The target to use for the ViewWatcher. It can be a string offset
     * specification.
     * See {@link Watchers/ViewWatcher.OnViewOptions | OnViewOptions}
     *
     * @defaultValue The element on which the {@link ViewTrigger} is defined
     */
    target?: ViewTarget;
    /**
     * The root to pass to the {@link ViewWatcher}.
     * See also {@link Watchers/ViewWatcher.ViewWatcherConfig | ViewWatcherConfig}
     *
     * @defaultValue {@link ViewWatcher} default
     */
    root?: Element | null;
    /**
     * The root margin to pass to the {@link ViewWatcher}.
     * See also {@link Watchers/ViewWatcher.ViewWatcherConfig | ViewWatcherConfig}
     *
     * It can be either space-separated or comma-separated.
     *
     * @defaultValue {@link ViewWatcher} default
     */
    rootMargin?: string;
    /**
     * The threshold to pass to the {@link ViewWatcher}.
     * See also {@link Watchers/ViewWatcher.ViewWatcherConfig | ViewWatcherConfig}
     *
     * @defaultValue {@link ViewWatcher} default
     */
    threshold?: number | number[];
};
//# sourceMappingURL=view-trigger.d.ts.map