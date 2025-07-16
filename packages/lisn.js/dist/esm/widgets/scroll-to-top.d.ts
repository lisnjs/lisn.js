/**
 * @module Widgets
 */
import { ScrollOffset } from "../globals/types.js";
import { Widget } from "../widgets/widget.js";
/**
 * Configures the given element as a {@link ScrollToTop} widget.
 *
 * The ScrollToTop widget adds a scroll-to-top button in the lower right corder
 * of the screen (can be changed to bottom left) which scrolls smoothly (and
 * more slowly than the native scroll) back to the top.
 *
 * The button is only shown when the scroll offset from the top is more than a
 * given configurable amount.
 *
 * **IMPORTANT:** When configuring an existing element as the button (i.e. using
 * `new ScrollToTop` or auto-widgets, rather than {@link ScrollToTop.enableMain}):
 * - if using {@link settings.mainScrollableElementSelector}, the button element
 *   will have it's CSS position set to `fixed`;
 * - otherwise, if using a custom scrollable element, the button element may be
 *   moved in the DOM tree in order to position it on top of the scrollable
 * If you don't want the button element changed in any way, then consider using
 * the {@link Triggers.ClickTrigger | ClickTrigger} with a
 * {@link Actions.ScrollTo | ScrollTo} action.
 *
 * **IMPORTANT:** You should not instantiate more than one {@link ScrollToTop}
 * widget on a given element. Use {@link ScrollToTop.get} to get an existing
 * instance if any. If there is already a widget instance, it will be destroyed!
 *
 * -----
 *
 * You can use the following dynamic attributes or CSS properties in your
 * stylesheet:
 *
 * The following dynamic attributes are set on the element:
 * - `data-lisn-place`: `"left"` or `"right"`
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-scroll-to-top` class or `data-lisn-scroll-to-top` attribute set on
 *   the element that constitutes the widget. The element should be empty.
 *
 * See below examples for what values you can use set for the data attributes
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This will create a scroll-to-top button using the JavaScript API.
 *
 * This will work even if
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}) is false.
 *
 * ```html
 * <!-- LISN should be loaded beforehand -->
 * <script>
 *   LISN.widgets.ScrollToTop.enableMain({
 *     position: "left",
 *     offset: "top: 300vh"
 *   });
 * </script>
 * ```
 *
 * You can customise the offset show/hide trigger via CSS as well as long as
 * {@link ScrollToTopConfig.offset} is left at its default value which uses
 * this CSS property:
 *
 * ```html
 * <style type="text/css" media="screen">
 *   :root {
 *     --lisn-scroll-to-top--offset: 300vh;
 *   }
 * </style>
 * ```
 *
 * @example
 * This will configure the given element as a scroll-to-top button for the main
 * scrolling element using an existing element for the button with default
 * {@link ScrollToTopConfig}.
 *
 * ```html
 * <button class="lisn-scroll-to-top"></button>
 * ```
 * @example
 * As above but with custom settings.
 *
 * ```html
 * <button data-lisn-scroll-to-top="position=left | offset=top:300vh"></button>
 * ```
 *
 * @example
 * This will configure the given element as a scroll-to-top button for a custom
 * scrolling element (i.e. one with overflow "auto" or "scroll").
 *
 * ```html
 * <div id="scrollable">
 *   <!-- content here... -->
 * </div>
 * <button data-lisn-scroll-to-top="scrollable=#scrollable"></button>
 * ```
 *
 * @example
 * As above, but using a reference specification with a class name to find the
 * scrollable.
 *
 * ```html
 * <div class="scrollable">
 *   <!-- content here... -->
 * </div>
 * <button data-lisn-scroll-to-top="scrollable=prev.scrollable"></button>
 * ```
 *
 * @example
 * As above but with all custom settings.
 *
 * ```html
 * <div class="scrollable">
 *   <!-- content here... -->
 * </div>
 * <button data-lisn-scroll-to-top="scrollable=prev.scrollable
 *                               | position=left
 *                               | offset=top:300vh
 * "></button>
 * ```
 */
export declare class ScrollToTop extends Widget {
    /**
     * If element is omitted, returns the instance created by {@link enableMain}
     * if any.
     */
    static get(element?: Element): ScrollToTop | null;
    static register(): void;
    /**
     * Creates a new button element, inserts it into the document body and
     * configures it as a {@link ScrollToTop}.
     */
    static enableMain(config?: ScrollToTopConfig): ScrollToTop;
    constructor(element: Element, config?: ScrollToTopConfig);
}
/**
 * @interface
 */
export type ScrollToTopConfig = {
    /**
     * The button will be shown when the scroll top offset of the page is below
     * the given value, and hidden otherwise. Accepts a colon-separated key:value
     * string where the key is "top" or "bottom" (or if your page scrolls
     * horizontally, then use "left" or "right"), and the value can be any valid
     * CSS length specification, e.g. "top: 200vh" or "top: var(--offset, 50%)".
     *
     * Alternatively, you set the `--lisn-scroll-to-top--offset` CSS variable on
     * the document root, which is used by the default value.
     *
     * @defaultValue "top: var(--lisn-scroll-to-top--offset, 200vh)"
     */
    offset?: ScrollOffset;
    /**
     * The horizontal position of the scroll-to-top button.
     *
     * @defaultValue "right"
     */
    position?: "left" | "right";
    /**
     * The element that should be scrolled.
     *
     * @defaultValue {@link ScrollWatcher} default
     */
    scrollable?: Element;
};
//# sourceMappingURL=scroll-to-top.d.ts.map