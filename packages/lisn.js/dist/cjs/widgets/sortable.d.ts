/**
 * @module Widgets
 */
import { Widget, WidgetHandler } from "../widgets/widget.cjs";
/**
 * Configures the given element as a {@link Sortable} widget.
 *
 * The Sortable widget allows the user to reorder elements by dragging and
 * dropping. It works on touch devices as well. However, it does not yet
 * support automatic scrolling when dragging beyond edge of screen on mobile
 * devices. For this, you may want to use
 * {@link https://github.com/SortableJS/Sortable | SortableJS} instead.
 *
 * The widget should have more than one draggable item.
 *
 * **IMPORTANT:** You should not instantiate more than one {@link Sortable}
 * widget on a given element. Use {@link Sortable.get} to get an existing
 * instance if any. If there is already a widget instance, it will be destroyed!
 *
 * -----
 *
 * You can use the following dynamic attributes or CSS properties in your
 * stylesheet:
 *
 * The following dynamic attributes are set on each item element:
 * - `data-lisn-is-draggable`: `"true"` or `"false"` (false if the item is disabled)
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-sortable` class or `data-lisn-sortable` attribute set on the
 *   container element that constitutes the sortable container
 * - `lisn-sortable-item` class or `data-lisn-sortable-item` attribute set on
 *   elements that should act as the items.
 *
 * When using auto-widgets, the elements that will be used as items are
 * discovered in the following way:
 * 1. The top-level element that constitutes the widget is searched for any
 *    elements that contain the `lisn-sortable-item` class or
 *    `data-lisn-sortable-item` attribute. They do not have to be immediate
 *    children of the root element.
 * 2. If there are no such elements, all of the immediate children of the
 *    widget element (other than `script` and `style` elements) are taken as
 *    the items.
 *
 * @example
 * ```html
 * <div class="lisn-sortable">
 *   <div class="box">Item 1</div>
 *   <div class="box">Item 2</div>
 *   <div class="box">Item 3</div>
 *   <div class="box">Item 4</div>
 * </div>
 * ```
 */
export declare class Sortable extends Widget {
    /**
     * Disables the given item number. Note that item numbers start at 1.
     *
     * @param currentOrder If false (default), the item numbers refer to the
     *                     original order. If true, they refer to the current
     *                     document order.
     */
    readonly disableItem: (itemNum: number, currentOrder?: boolean) => Promise<void>;
    /**
     * Re-enables the given item number. Note that item numbers start at 1.
     *
     * @param currentOrder If false (default), the item numbers refer to the
     *                     original order. If true, they refer to the current
     *                     document order.
     */
    readonly enableItem: (itemNum: number, currentOrder?: boolean) => Promise<void>;
    /**
     * Re-enables the given item number if it is disabled, otherwise disables it.
     * Note that item numbers start at 1.
     *
     * @param currentOrder If false (default), the item numbers refer to the
     *                     original order. If true, they refer to the current
     *                     document order.
     */
    readonly toggleItem: (itemNum: number, currentOrder?: boolean) => Promise<void>;
    /**
     * Returns true if the given item number is disabled. Note that item numbers
     * start at 1.
     *
     * @param currentOrder If false (default), the item numbers refer to the
     *                     original order. If true, they refer to the current
     *                     document order.
     */
    readonly isItemDisabled: (itemNum: number, currentOrder?: boolean) => boolean;
    /**
     * The given handler will be called whenever the user moves an item to
     * another position. It will be called after the item is moved so
     * {@link getItems} called with `currentOrder = true` will return the updated
     * order.
     *
     * If the handler returns a promise, it will be awaited upon.
     */
    readonly onMove: (handler: WidgetHandler) => void;
    /**
     * Returns the item elements.
     *
     * @param currentOrder If false (default), returns the items in the
     *                     original order. If true, they are returned in the
     *                     current document order.
     */
    readonly getItems: (currentOrder?: boolean) => Element[];
    static get(element: Element): Sortable | null;
    static register(): void;
    /**
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If there are less than 2 items given or found.
     */
    constructor(element: Element, config?: SortableConfig);
}
/**
 * @interface
 */
export type SortableConfig = {
    /**
     * The elements that will be used as the draggable items.
     *
     * The widget should have more than one draggable item.
     *
     * If this is not specified, then
     * 1. The top-level element that constitutes the widget is searched for any
     *    elements that contain the class `lisn-sortable-item`. They do not
     *    have to be immediate children of the root element.
     * 2. If there are no such elements, all of the immediate children of the
     *    widget element (other than `script` and `style` elements) are taken as
     *    the items.
     */
    items?: Element[];
    /**
     * Whether to move the dragged item to before/after the drop target, or swap
     * it with the drop target.
     *
     * Note that the moving/swapping action is being done as the user is dragging
     * as soon as they drag over another item, so in order to achieve a swap
     * effect, the user needs to be able to drag an item from one location to
     * another without the path of the mouse crossing over all in-between items.
     *
     * @defaultValue "move";
     */
    mode?: "move" | "swap";
};
//# sourceMappingURL=sortable.d.ts.map