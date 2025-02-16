/**
 * @module Widgets
 */
import { Widget } from "../widgets/widget.cjs";
/**
 * Configures the given element as an {@link AutoHide} widget.
 *
 * The AutoHide widget automatically hides (and optionally removes) the given
 * element, or children of it that match a given selector, after a certain
 * delay.
 *
 * It executes these actions every time the matching element(s) have a change
 * of attribute or appear (are inserted) into the DOM.
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-auto-hide` class or `data-lisn-auto-hide` attribute
 * - `lisn-auto-remove` class or `data-lisn-auto-remove` attribute (enables
 *   {@link AutoHideConfig.remove})
 *
 * **NOTE:** This widget supports multiple instances per element, you can
 * specify multiple widget configurations, separated with ";".
 *
 * See below examples for what values you can use set for the data attributes
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This will automatically hide (with class `lisn-hide`) the element 3 seconds
 * (default delay) after it is inserted into the DOM or after it gets any
 * attributes changed on it (for example that might show it again).
 *
 * ```html
 * <div class="lisn-auto-hide">
 *   Automatically hidden in 3s.
 * </div>
 * ```
 *
 * @example
 * This will automatically hide and then remove the element 3 seconds (default
 * delay) after it is inserted into the DOM.
 *
 * ```html
 * <div class="lisn-auto-remove">
 *   Automatically hidden and removed in 3s.
 * </div>
 * ```
 *
 * @example
 * This will automatically
 * - hide `p` elements with class `message` 2 seconds after they are inserted
 *   or changed
 * - hide `p` elements with class `warning` 5 seconds after they are inserted
 *   or changed; and it will save that particular {@link AutoHide} widget with
 *   ID `myID` so that it can be looked up using {@link AutoHide.get}
 * - remove `p` elements with class `disposable` 3 seconds (default delay)
 *   after they are inserted or changed
 *
 * ```html
 * <div data-lisn-auto-hide="selector=p.message delay=2000 ;
 *                           selector=p.warning delay=5000 id=myID"
 *      data-lisn-auto-remove="selector=p.disposable">
 *   <p>Some text, this will stay.</p>
 *   <p class="message">
 *     Automatically hidden in 2s.
 *   </p>
 *   <p class="warning">
 *     Automatically hidden in 5s.
 *   </p>
 *   <p class="disposable">
 *     Automatically hidden and removed in 3s.
 *   </p>
 * </div>
 * ```
 */
export declare class AutoHide extends Widget {
    static get(element: Element, id: string): AutoHide | null;
    static register(): void;
    constructor(element: Element, config?: AutoHideConfig);
}
/**
 * @interface
 */
export type AutoHideConfig = {
    /**
     * An ID for the widget so that it can be looked up by element and ID using
     * {@link AutoHide.get}. It has to be unique for each element, but you can
     * use the same ID on different elements.
     *
     * @defaultValue undefined
     */
    id?: string;
    /**
     * If true, the matched elements are removed from the DOM instead of just
     * hidden.
     *
     * @defaultValue false
     */
    remove?: boolean;
    /**
     * If given, then the elements to be hidden/removed are selected using the
     * given `selector` starting at the container element. If not given, then
     * the container element itself is the target to be hidden/removed.
     *
     * E.g. if `selector` is `p.message`, then any newly added/changed `<p>`
     * elements with class `message` nested under the container element will be
     * auto-hidden/removed.
     *
     * @defaultValue undefined
     */
    selector?: string;
    /**
     * How long to wait before hiding or removing the matched elements.
     *
     * @defaultValue 3000
     */
    delay?: number;
};
//# sourceMappingURL=auto-hide.d.ts.map