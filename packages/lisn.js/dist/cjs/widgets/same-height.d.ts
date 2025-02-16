/**
 * @module Widgets
 */
import { Widget } from "../widgets/widget.cjs";
/**
 * Configures the given element as a {@link SameHeight} widget.
 *
 * The SameHeight widget sets up the given element as a flexbox and sets the
 * flex basis of its components so that their heights are as close as possible
 * to each other. It tracks their size (see {@link SizeWatcher}) and
 * continually updates the basis as needed.
 *
 * When calculating the best flex basis that would result in equal heights,
 * SameHeight determines whether a flex child is mostly text or mostly images
 * since the height of these scales in opposite manner with their width.
 * Therefore, the components of the widget should contain either mostly text or
 * mostly images.
 *
 * The widget should have more than one item and the items must be immediate
 * children of the container element.
 *
 * SameHeight tries to automatically determine if an item is mostly text or
 * mostly images based on the total display text content, but you can override
 * this in two ways:
 * 1. By passing a map of elements as {@link SameHeightConfig.items | items}
 *    instead of an array, and setting the value for each to either `"text"` or
 *    `"image"`
 * 2. By setting the `data-lisn-same-height-item` attribute to `"text"` or
 *   `"image"` on the children. **NOTE** however that when auto-discovering the
 *   items (i.e. when you have not explicitly passed a list/map of items), if
 *   you set the `data-lisn-same-height-item` attribute on _any_ child you must
 *   also add this attribute to all other children that are to be used by the
 *   widget. Other children (that don't have this attribute) will be ignored
 *   and assumed to be either zero-size or position absolute/fixed.
 *
 * **IMPORTANT:** You should not instantiate more than one {@link SameHeight}
 * widget on a given element. Use {@link SameHeight.get} to get an existing
 * instance if any. If there is already a widget instance, it will be destroyed!
 *
 * **IMPORTANT:** The element you pass will be set to `display: flex` and its
 * children will get `box-sizing: border-box` and continually updated
 * `flex-basis` style. You can add additional CSS to the element or its
 * children if you wish. For example you may wish to set `flex-wrap: wrap` on
 * the element and a `min-width` on the children.
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see {@link settings.autoWidgets}), the
 * following CSS classes or data attributes are recognized:
 * - `lisn-same-height` class or `data-lisn-same-height` attribute set on the
 *   container element that constitutes the widget
 *
 * When using auto-widgets, the elements that will be used as items are
 * discovered in the following way:
 * 1. The immediate children of the top-level element that constitutes the
 *    widget that have the `lisn-same-height-item` class or
 *    `data-lisn-same-height-item` attribute are taken.
 * 2. If none of the root's children have this class or attribute, then all of
 *    the immediate children of the widget element except any `script` or
 *    `style` elements are taken as the items.
 *
 * See below examples for what values you can use set for the data attribute
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This defines a simple SameHeight widget with one text and one image child.
 *
 * ```html
 * <div class="lisn-same-height">
 *   <div>
 *     <p>
 *       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
 *       eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
 *       minim veniam, quis nostrud exercitation ullamco laboris nisi ut
 *       aliquip ex ea commodo consequat. Duis aute irure dolor in
 *       reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
 *       pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
 *       culpa qui officia deserunt mollit anim id est laborum.
 *     </p>
 *   </div>
 *
 *   <div>
 *     <img
 *       src="https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2@1.5x.png"
 *     />
 *   </div>
 * </div>
 * ```
 *
 * @example
 * This defines a SameHeight widget with the flexbox children specified
 * explicitly (and one ignored), as well as having all custom settings.
 *
 * ```html
 * <div data-lisn-same-height="diff-tolerance=20
 *                             | resize-threshold=10
 *                             | debounce-window=50
 *                             | min-gap=50
 *                             | max-free-r=0.2
 *                             | max-width-r=3.2">
 *   <div>Example ignored child</div>
 *
 *   <div data-lisn-same-height-item><!-- Will be detected as text anyway -->
 *     <p>
 *       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
 *       eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
 *       minim veniam, quis nostrud exercitation ullamco laboris nisi ut
 *       aliquip ex ea commodo consequat. Duis aute irure dolor in
 *       reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
 *       pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
 *       culpa qui officia deserunt mollit anim id est laborum.
 *     </p>
 *   </div>
 *
 *   <!-- Explicitly set to image type, though it will be detected as such -->
 *   <div data-lisn-same-height-item="image">
 *     <img
 *       src="https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2@1.5x.png"
 *     />
 *   </div>
 *
 *   <!-- Explicitly set to text type, because it will NOT be detected as such (text too short). -->
 *   <div data-lisn-same-height-item="text">
 *     <p>
 *       Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 *     </p>
 *   </div>
 * </div>
 * ```
 */
export declare class SameHeight extends Widget {
    /**
     * Switches the flexbox to vertical (column) mode.
     *
     * You can alternatively do this by setting the
     * `data-lisn-orientation="vertical"` attribute on the element at any time.
     *
     * You can do this for example as part of a trigger:
     *
     * @example
     * ```html
     * <div class="lisn-same-height"
     *      data-lisn-on-layout="max-mobile-wide:set-attribute=data-lisn-orientation#vertical">
     *      <!-- ... children -->
     * </div>
     * ```
     */
    readonly toColumn: () => Promise<void>;
    /**
     * Switches the flexbox back to horizontal (row) mode, which is the default.
     *
     * You can alternatively do this by deleting the
     * `data-lisn-orientation` attribute on the element, or setting it to
     * `"horizontal"` at any time.
     */
    readonly toRow: () => Promise<void>;
    /**
     * Returns the elements used as the flex children.
     */
    readonly getItems: () => Element[];
    /**
     * Returns a map of the elements used as the flex children with their type.
     */
    readonly getItemConfigs: () => Map<Element, "text" | "image">;
    /**
     * If the element is already configured as a SameHeight widget, the widget
     * instance is returned. Otherwise null.
     */
    static get(containerElement: Element): SameHeight | null;
    static register(): void;
    constructor(containerElement: HTMLElement, config?: SameHeightConfig);
}
/**
 * @interface
 */
export type SameHeightConfig = {
    /**
     * The elements that will make up the items. They **MUST** be immediate
     * children of the container element.
     *
     * The widget should have more than one item.
     *
     * If this is not specified, then
     * 1. The immediate children of the top-level element that constitutes the
     *    widget that have the `lisn-same-height-item` class or
     *    `data-lisn-same-height-item` attribute are taken.
     * 2. If none of the root's children have this class or attribute, then all of
     *    the immediate children of the widget element except any `script` or
     *    `style` elements are taken as the items.
     */
    items?: Element[] | Map<Element, "image" | "text">;
    /**
     * After setting the flex basis of the children and their size updates, in
     * case the resultant height differs from the predicted calculated one by
     * `diffTolerance` in pixels, then the calculations are re-run using the new
     * sizes. Calculations are re-run at most once only.
     *
     * Differences between the predicted and resultant height would happen if the
     * children contain a mixture of text and images or if there are margins or
     * paddings that don't scale in the same way as the content.
     *
     * @defaultValue {@link settings.sameHeightDiffTolerance}
     */
    diffTolerance?: number;
    /**
     * The `resizeThreshold` to pass to the {@link SizeWatcher}.
     *
     * @defaultValue {@link settings.sameHeightResizeThreshold}
     */
    resizeThreshold?: number;
    /**
     * The `debounceWindow` to pass to the {@link SizeWatcher}.
     *
     * @defaultValue {@link settings.sameHeightDebounceWindow}
     */
    debounceWindow?: number;
    /**
     * Minimum gap between the flex items. Note that setting this to 0 while at
     * the same time setting `flex-wrap` to `wrap` (or `wrap-reverse`) on the
     * element may lead to premature/unnecessary wrapping.
     *
     * Note that this is not strictly enforced, and is only used in finding
     * optimal height based on other constraints. If you want to enforce this gap,
     * set it as a `column-gap` CSS rule.
     *
     * @defaultValue The effective `column-gap` on the container element style or
     *               if none, {@link settings.sameHeightMinGap}
     */
    minGap?: number;
    /**
     * Maximum ratio between the free space in the flex container and its total
     * width. You can set this to a negative number to disable this restriction.
     *
     * It has to be < 1. Otherwise it is invalid and disables this restriction.
     *
     * Note that this is not strictly enforced, and is only used in finding
     * optimal height based on other constraints.
     *
     * @defaultValue {@link settings.sameHeightMaxFreeR}
     */
    maxFreeR?: number;
    /**
     * Maximum ratio between the width of the widest item and the narrowest item.
     * You can set this to 0 or a negative number to disable this restriction.
     *
     * It has to be >= 1. Otherwise it is invalid and disables this restriction.
     *
     * Note that this is not strictly enforced, and is only used in finding
     * optimal height based on other constraints.
     *
     * @defaultValue {@link settings.sameHeightMaxWidthR}
     */
    maxWidthR?: number;
};
//# sourceMappingURL=same-height.d.ts.map