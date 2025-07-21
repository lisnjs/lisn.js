/**
 * @module Widgets
 */
import { Widget } from "../widgets/widget.cjs";
/**
 * Configures the given element as a {@link SmoothScroll} widget.
 *
 * The SmoothScroll widget creates a configurable smooth scrolling
 * experience, including support for lag and parallax depth, and using a custom
 * element that only takes up part of the page, all while preserving native
 * scrolling behaviour (i.e. it does not disable native scroll and does not use
 * fake scrollbars).
 *
 * **IMPORTANT:** The scrollable element you pass must have its children
 * wrapped. This will be done automatically unless you create these wrappers
 * yourself by ensuring your structure is as follows:
 *
 * ```html
 * <!-- If using the document as the scrollable -->
 * <body><!-- Element you instantiate as SmoothScroll, or you can pass documentElement -->
 *   <div class="lisn-smooth-scroll__content"><!-- Required wrapper; will be created if missing -->
 *     <div class="lisn-smooth-scroll__inner"><!-- Required inner wrapper; will be created if missing -->
 *       <!-- YOUR CONTENT -->
 *     </div>
 *   </div>
 * </body>
 * ```
 *
 * ```html
 * <!-- If using a custom scrollable -->
 * <div class="scrollable"><!-- Element you instantiate as SmoothScroll -->
 *   <div class="lisn-smooth-scroll__content"><!-- Required outer wrapper; will be created if missing -->
 *     <div class="lisn-smooth-scroll__inner"><!-- Required inner wrapper; will be created if missing -->
 *       <!-- YOUR CONTENT -->
 *     </div>
 *   </div>
 * </div>
 * ```
 *
 * **IMPORTANT:** If the scrollable element you pass is other than
 * `document.documentElement` or `document.body`, SmoothScroll will then rely on
 * position: sticky. XXX TODO
 *
 * **IMPORTANT:** You should not instantiate more than one
 * {@link SmoothScroll} widget on a given element. Use
 * {@link SmoothScroll.get} to get an existing instance if any. If there is
 * already a widget instance, it will be destroyed!
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-smooth-scroll` class or `data-lisn-smooth-scroll` attribute set
 *   on the container element that constitutes the scrollable container
 *
 * See below examples for what values you can use set for the data attribute
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This will create a smooth scroller for
 * {@link settings.mainScrollableElementSelector | the main scrolling element}.
 *
 * This will work even if {@link settings.autoWidgets}) is false
 *
 * ```html
 * <!-- LISN should be loaded beforehand -->
 * <script>
 *   // You can also just customise global default settings:
 *   // LISN.settings.smoothScroll = "TODO";
 *
 *   LISN.widgets.SmoothScroll.enableMain({
 *     XXX: "TODO",
 *   });
 * </script>
 * ```
 *
 * @example
 * This will create a smooth scroller for a custom scrolling element (i.e. one
 * with overflow "auto" or "scroll").
 *
 * ```html
 * <div class="scrolling lisn-smooth-scroll">
 *   <!-- content here... -->
 * </div>
 * ```
 *
 * @example
 * As above but with custom settings.
 *
 * ```html
 * <div
 *   class="scrolling"
 *   data-lisn-smooth-scroll="XXX=TODO
 *                            | XXX=TODO
 *                        ">
 *   <!-- content here... -->
 * </div>
 * ```
 */
export declare class SmoothScroll extends Widget {
    /**
     * If element is omitted, returns the instance created by {@link enableMain}
     * if any.
     */
    static get(scrollable?: Element): SmoothScroll | null;
    /**
     * Creates a smooth scroller for the
     * {@link settings.mainScrollableElementSelector | the main scrolling element}.
     *
     * **NOTE:** It returns a Promise to a widget because it will wait for the
     * main scrollable element to be present in the DOM if not already.
     */
    static enableMain(config?: SmoothScrollConfig): Promise<SmoothScroll>;
    static register(): void;
    /**
     * Note that passing `document.body` is considered equivalent to
     * `document.documentElement`.
     */
    constructor(scrollable: HTMLElement, config?: SmoothScrollConfig);
}
/**
 * @interface
 */
export type SmoothScrollConfig = {
    /**
     * The DOM ID to set on the outer content wrapper. Will result in the content
     * wrapper element that's created by us getting this ID.
     *
     * @defaultValue undefined
     */
    id?: string;
    /**
     * A class name or a list of class names to set on the outer content wrapper.
     * Will result in the content wrapper element that's created by us getting
     * these classes.
     *
     * @defaultValue undefined
     */
    className?: string[] | string;
    /**
     * XXX TODO
     *
     * @defaultValue {@link settings.smoothScrollLag}
     */
    lag?: number;
    /**
     * XXX TODO
     *
     * @defaultValue {@link settings.smoothScrollDepth}
     */
    depth?: number;
};
//# sourceMappingURL=smooth-scroll.d.ts.map