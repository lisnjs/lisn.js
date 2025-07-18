/**
 * @module Widgets
 */
import { Position } from "../globals/types.js";
import { Widget } from "../widgets/widget.js";
/**
 * Configures the given element, which must be scrollable, to use a
 * {@link Scrollbar}.
 *
 * The Scrollbar widget is a customizable alternative to the native
 * scrollbars (vertical and horizontal). You can position each of the two
 * scrollbars on any of the four sides of the element, make them automatically
 * hide after certain time of inactivity, style them as a traditional handle
 * scrollbar or a percentage fill progress bar and so on.
 *
 * It is also itself draggable/clickable so it _can_ be used to scroll the
 * element similar to the native scrollbar. The drag/click functionality can be
 * disabled too.
 *
 * **NOTE:** If you have disabled the {@link Widgets.PageLoader | PageLoader}
 * and have left {@link ScrollbarConfig.hideNative} ON, but are seeing the
 * native scrollbars just for a fraction of a second at the beginning of the
 * page load, you may want to manually add `lisn-hide-scroll` class on the
 * scrollable element to make sure the scrollbars are hidden as soon as
 * possible (before the scrollbar widget has time to initialize.
 *
 * **IMPORTANT:** If you are using the Scrollbar on an element other than the
 * main scrollable element, it's highly recommended to enable (it is enabled by
 * default) {@link settings.contentWrappingAllowed}. Otherwise wrap all of its
 * children in a single element with a class `lisn-wrapper`:
 * ```html
 * <div class="scrollable">
 *   <div class="lisn-wrapper">
 *     <!-- CONTENT -->
 *   </div>
 * </div>
 * ```
 *
 * **IMPORTANT:** You should not instantiate more than one {@link Scrollbar}
 * widget on a given element. Use {@link Scrollbar.get} to get an existing
 * instance if any. If there is already a widget instance, it will be destroyed!
 *
 * -----
 *
 * You can use the following dynamic attributes or CSS properties in your
 * stylesheet:
 *
 * The following dynamic attributes are set on the element:
 * - `data-lisn-has-scrollbar-top`: `"true"` or `"false"`
 * - `data-lisn-has-scrollbar-bottom`: `"true"` or `"false"`
 * - `data-lisn-has-scrollbar-left`: `"true"` or `"false"`
 * - `data-lisn-has-scrollbar-right`: `"true"` or `"false"`
 *
 * The following dynamic attributes are set on each progressbar element:
 * - `data-lisn-orientation`: `"horizontal"` or `"vertical"`
 * - `data-lisn-place`: `"top"`, `"bottom"`, `"left"` or `"right"`
 * - `data-lisn-draggable`: `"true"` or `"false"`
 * - `data-lisn-clickable`: `"true"` or `"false"`
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see {@link settings.autoWidgets}), the
 * following CSS classes or data attributes are recognized:
 * - `lisn-scrollbar` class or `data-lisn-scrollbar` attribute set on the
 *   scrollable element that you want to enable custom scrollbars for
 *
 * See below examples for what values you can use set for the data attribute
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This will create custom scrollbars for
 * {@link settings.mainScrollableElementSelector | the main scrolling element}.
 *
 * This will work even if {@link settings.autoWidgets}) is false
 *
 * ```html
 * <!-- LISN should be loaded beforehand -->
 * <script>
 *   // You can also just customise global default settings:
 *   // LISN.settings.scrollbarPositionV = "top";
 *   // LISN.settings.scrollbarAutoHide = 3000;
 *   // LISN.settings.scrollbarUseHandle = true;
 *
 *   LISN.widgets.Scrollbar.enableMain({
 *     position: "top",
 *     autoHide: 3000,
 *     useHandle: true
 *   });
 * </script>
 * ```
 *
 * @example
 * This will create custom scrollbars for a custom scrolling element (i.e. one
 * with overflow "auto" or "scroll").
 *
 * ```html
 * <div class="scrolling lisn-scrollbar">
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
 *   data-lisn-scrollbar="hide-native=false
 *                        | positionH=top
 *                        | positionV=left
 *                        | auto-hide=2000
 *                        | click-scroll=false
 *                        | drag-scroll=false
 *                        | use-handle=false
 *                        ">
 *   <!-- content here... -->
 * </div>
 * ```
 */
export declare class Scrollbar extends Widget {
    /**
     * Returns the actual scrollable element us which, unless the scrollable you
     * passed to the constructor is the
     * {@link settings.mainScrollableElementSelector | the main scrolling element}
     * or unless {@link settings.contentWrappingAllowed} is false,
     * will be a new element created by us that is a descendant of the original
     * element you passed.
     */
    readonly getScrollable: () => Element;
    /**
     * If element is omitted, returns the instance created by {@link enableMain}
     * if any.
     */
    static get(scrollable?: Element): Scrollbar | null;
    /**
     * Enables scrollbars on the
     * {@link settings.mainScrollableElementSelector | the main scrolling element}.
     *
     * **NOTE:** It returns a Promise to a widget because it will wait for the
     * main scrollable element to be present in the DOM if not already.
     */
    static enableMain(config?: ScrollbarConfig): Promise<Scrollbar>;
    static register(): void;
    /**
     * Note that passing `document.body` is considered equivalent to
     * `document.documentElement`.
     */
    constructor(scrollable: HTMLElement, config?: ScrollbarConfig);
}
/**
 * @interface
 */
export type ScrollbarConfig = {
    /**
     * The DOM ID to set on the
     * {@link Scrollbar.getScrollable | scrollable element}. Will result in the
     * scrollable element getting this ID. This is useful if the element is a
     * wrapper created by us and you want it to be assigned an ID.
     *
     * **IMPORTANT:** If the scrollable is the
     * {@link settings.mainScrollableElementSelector | the main scrolling element}
     * or if you've disabled {@link settings.contentWrappingAllowed}, then the
     * scrollable element provided as the widget element will _not_ have its
     * content wrapped and will remain the actual scrollable. In this case, its
     * ID will be set to this, so if it already has an ID, it will be overridden
     * with this value.
     *
     * @defaultValue undefined
     */
    id?: string;
    /**
     * A class name or a list of class names to set on the
     * {@link Scrollbar.getScrollable | scrollable element}. Will result in the
     * scrollable element getting these classes. This is useful if the element is
     * a wrapper created by us and you want it to be assigned classes.
     *
     * See explanation for {@link id}.
     *
     * @defaultValue undefined
     */
    className?: string[] | string;
    /**
     * Hide the native scroll bar.
     *
     * Note that the LISN scrollbar is itself draggable/clickable so it
     * _can_ be used to scroll the element similar to the native scrollbar.
     *
     * @defaultValue {@link settings.scrollbarHideNative}
     */
    hideNative?: boolean;
    /**
     * Whether to enable also on mobile and tablet devices. Detection is based on
     * user agent.
     *
     * @defaultValue {@link settings.scrollbarOnMobile}
     */
    onMobile?: boolean;
    /**
     * Where to place the scrollbar that tracks the horizontal scroll.
     *
     * It does not need to be a horizontal position; it can for example be "left"
     * or "right".
     *
     * @defaultValue {@link settings.scrollbarPositionH}
     */
    positionH?: Position;
    /**
     * Where to place the scrollbar that tracks the vertical scroll.
     *
     * It does not need to be a vertical position; it can for example be "top"
     * or "bottom".
     *
     * @defaultValue {@link settings.scrollbarPositionV}
     */
    positionV?: Position;
    /**
     * Auto-hide the scrollbar when there's no scrolling happening for the given
     * number of milliseconds.
     *
     * Set to 0 or a negative value to disable hiding.
     *
     * @defaultValue {@link settings.scrollbarAutoHide}
     */
    autoHide?: number;
    /**
     * Whether to scroll the element when a user clicks anywhere on the
     * scrollbar.
     *
     * @defaultValue {@link settings.scrollbarClickScroll}
     */
    clickScroll?: boolean;
    /**
     * Whether to scroll the element when a user drags the handle (if
     * {@link useHandle}) or drags along anywhere on the scrollbar (if _not_
     * {@link useHandle}).
     *
     * @defaultValue {@link settings.scrollbarDragScroll}
     */
    dragScroll?: boolean;
    /**
     * Whether to use a traditional fixed-length handle (like the native
     * scrollbar) to indicate the position or the default style of a fill (that
     * starts at the beginning and ends at the scroll fraction).
     *
     * @defaultValue {@link settings.scrollbarUseHandle}
     */
    useHandle?: boolean;
};
//# sourceMappingURL=scrollbar.d.ts.map