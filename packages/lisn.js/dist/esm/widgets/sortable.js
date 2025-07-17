function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Widgets
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { addClasses, removeClasses, getBooleanData, setBooleanData, unsetBooleanData, delData, copyStyle, setNumericStyleProps } from "../utils/css-alter.js";
import { moveElement, swapElements, cloneElement } from "../utils/dom-alter.js";
import { waitForMeasureTime } from "../utils/dom-optimize.js";
import { getVisibleContentChildren } from "../utils/dom-query.js";
import { addEventListenerTo, removeEventListenerFrom, preventSelect, undoPreventSelect } from "../utils/event.js";
import { toInt } from "../utils/math.js";
import { validateString } from "../utils/validation.js";
import { wrapCallback } from "../modules/callback.js";
import { Widget, registerWidget, getDefaultWidgetSelector } from "./widget.js";

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
export class Sortable extends Widget {
  static get(element) {
    const instance = super.get(element, DUMMY_ID);
    if (MH.isInstanceOf(instance, Sortable)) {
      return instance;
    }
    return null;
  }
  static register() {
    registerWidget(WIDGET_NAME, (element, config) => {
      if (!Sortable.get(element)) {
        return new Sortable(element, config);
      }
      return null;
    }, configValidator);
  }

  /**
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If there are less than 2 items given or found.
   */
  constructor(element, config) {
    var _Sortable$get;
    const destroyPromise = (_Sortable$get = Sortable.get(element)) === null || _Sortable$get === void 0 ? void 0 : _Sortable$get.destroy();
    super(element, {
      id: DUMMY_ID
    });
    /**
     * Disables the given item number. Note that item numbers start at 1.
     *
     * @param {} currentOrder If false (default), the item numbers refer to the
     *                        original order. If true, they refer to the current
     *                        document order.
     */
    _defineProperty(this, "disableItem", void 0);
    /**
     * Re-enables the given item number. Note that item numbers start at 1.
     *
     * @param {} currentOrder If false (default), the item numbers refer to the
     *                        original order. If true, they refer to the current
     *                        document order.
     */
    _defineProperty(this, "enableItem", void 0);
    /**
     * Re-enables the given item number if it is disabled, otherwise disables it.
     * Note that item numbers start at 1.
     *
     * @param {} currentOrder If false (default), the item numbers refer to the
     *                        original order. If true, they refer to the current
     *                        document order.
     */
    _defineProperty(this, "toggleItem", void 0);
    /**
     * Returns true if the given item number is disabled. Note that item numbers
     * start at 1.
     *
     * @param {} currentOrder If false (default), the item numbers refer to the
     *                        original order. If true, they refer to the current
     *                        document order.
     */
    _defineProperty(this, "isItemDisabled", void 0);
    /**
     * The given handler will be called whenever the user moves an item to
     * another position. It will be called after the item is moved so
     * {@link getItems} called with `currentOrder = true` will return the updated
     * order.
     *
     * If the handler returns a promise, it will be awaited upon.
     */
    _defineProperty(this, "onMove", void 0);
    /**
     * Returns the item elements.
     *
     * @param {} currentOrder If false (default), returns the items in the
     *                        original order. If true, they are returned in the
     *                        current document order.
     */
    _defineProperty(this, "getItems", void 0);
    const items = (config === null || config === void 0 ? void 0 : config.items) || [];
    if (!MH.lengthOf(items)) {
      items.push(...MH.querySelectorAll(element, getDefaultWidgetSelector(PREFIX_ITEM__FOR_SELECT)));
      if (!MH.lengthOf(items)) {
        items.push(...MH.querySelectorAll(element, `[${MC.S_DRAGGABLE}]`));
        if (!MH.lengthOf(items)) {
          items.push(...getVisibleContentChildren(element));
        }
      }
    }
    if (MH.lengthOf(items) < 2) {
      throw MH.usageError("Sortable must have more than 1 item");
    }
    const methods = getMethods(this, items, config);
    (destroyPromise || MH.promiseResolve()).then(() => {
      if (this.isDestroyed()) {
        return;
      }
      init(this, element, items, methods);
    });
    this.disableItem = methods._disableItem;
    this.enableItem = methods._enableItem;
    this.toggleItem = methods._toggleItem;
    this.isItemDisabled = methods._isItemDisabled;
    this.onMove = methods._onMove;
    this.getItems = (currentOrder = false) => currentOrder ? methods._getSortedItems() : [...items];
  }
}

/**
 * @interface
 */

// --------------------

const WIDGET_NAME = "sortable";
const PREFIXED_NAME = MH.prefixName(WIDGET_NAME);
const PREFIX_IS_DRAGGABLE = MH.prefixName("is-draggable");

// Use different classes for styling items to the one used for auto-discovering
// them, so that re-creating existing widgets can correctly find the items to
// be used by the new widget synchronously before the current one is destroyed.
const PREFIX_ITEM = `${PREFIXED_NAME}__item`;
const PREFIX_ITEM__FOR_SELECT = `${PREFIXED_NAME}-item`;
const PREFIX_FLOATING_CLONE = `${PREFIXED_NAME}__ghost`;

// Only one Sortable widget per element is allowed, but Widget requires a
// non-blank ID.
const DUMMY_ID = PREFIXED_NAME;
const configValidator = {
  mode: (key, value) => validateString(key, value, v => v === "swap" || v === "move")
};
const touchMoveOptions = {
  passive: false,
  capture: true
};
const isItemDraggable = item => getBooleanData(item, PREFIX_IS_DRAGGABLE);
const init = (widget, element, items, methods) => {
  let currentDraggedItem = null;
  let floatingClone = null;
  let ignoreCancel = false;
  let grabOffset = [0, 0];
  const setIgnoreCancel = () => ignoreCancel = true;
  const onDragStart = event => {
    const currTarget = MH.currentTargetOf(event);
    if (MH.isElement(currTarget) && isItemDraggable(currTarget) && MH.isMouseEvent(event)) {
      currentDraggedItem = currTarget;
      MH.setAttr(currTarget, MC.S_DRAGGABLE);
      if (MH.isTouchPointerEvent(event)) {
        const target = MH.targetOf(event);
        if (MH.isElement(target)) {
          target.releasePointerCapture(event.pointerId);
        }
      }
      addEventListenerTo(MH.getDoc(), MC.S_TOUCHMOVE, onTouchMove, touchMoveOptions);
      waitForMeasureTime().then(() => {
        // Get pointer offset relative to the current item being dragged
        // regardless of what the event target is and what transforms is has
        // applied.
        const rect = MH.getBoundingClientRect(currTarget);
        grabOffset = [event.clientX - rect.left, event.clientY - rect.top];
      });
    }
  };
  const onDragEnd = event => {
    if (ignoreCancel && event.type === MC.S_POINTERCANCEL) {
      ignoreCancel = false;
      return;
    }
    if (currentDraggedItem) {
      MH.unsetAttr(currentDraggedItem, MC.S_DRAGGABLE);
      currentDraggedItem = null;
      removeEventListenerFrom(MH.getDoc(), MC.S_TOUCHMOVE, onTouchMove, touchMoveOptions);
      if (floatingClone) {
        moveElement(floatingClone);
        floatingClone = null;
      }
    }
  };
  const onTouchMove = event => {
    if (MH.isTouchEvent(event) && MH.lengthOf(event.touches) === 1) {
      const parentEl = MH.parentOf(currentDraggedItem);
      if (parentEl && currentDraggedItem) {
        MH.preventDefault(event);
        const touch = event.touches[0];
        const clientX = touch.clientX;
        const clientY = touch.clientY;
        if (!floatingClone) {
          floatingClone = cloneElement(currentDraggedItem);
          addClasses(floatingClone, PREFIX_FLOATING_CLONE);
          copyStyle(currentDraggedItem, floatingClone, ["width", "height"]).then(() => {
            if (floatingClone) {
              moveElement(floatingClone, {
                to: parentEl
              });
            }
          });
        }
        if (floatingClone) {
          setNumericStyleProps(floatingClone, {
            clientX: clientX - grabOffset[0],
            clientY: clientY - grabOffset[1]
          }, {
            _units: "px"
          });
        }
      }
    }
  };
  const onDragEnter = event => {
    const currTarget = MH.currentTargetOf(event);
    const dragged = currentDraggedItem;
    if ((MH.isTouchPointerEvent(event) || event.type === MC.S_DRAGENTER) && dragged && MH.isElement(currTarget) && currTarget !== dragged) {
      methods._dragItemOnto(dragged, currTarget); // no need to await
    }
  };
  const setupEvents = () => {
    for (const item of items) {
      preventSelect(item);
      addEventListenerTo(item, MC.S_POINTERDOWN, onDragStart);
      addEventListenerTo(item, MC.S_DRAGSTART, setIgnoreCancel); // non-touch

      addEventListenerTo(item, MC.S_POINTERENTER, onDragEnter); // touch
      addEventListenerTo(item, MC.S_DRAGENTER, onDragEnter); // non-touch

      addEventListenerTo(item, MC.S_DRAGOVER, MH.preventDefault); // non-touch

      addEventListenerTo(item, MC.S_DRAGEND, onDragEnd); // non-touch
      addEventListenerTo(item, MC.S_DROP, onDragEnd); // non-touch

      addEventListenerTo(MH.getDoc(), MC.S_POINTERUP, onDragEnd);
      addEventListenerTo(MH.getDoc(), MC.S_POINTERCANCEL, onDragEnd);
    }
  };

  // SETUP ------------------------------

  for (const item of items) {
    addClasses(item, PREFIX_ITEM);
    setBooleanData(item, PREFIX_IS_DRAGGABLE);
  }
  widget.onEnable(setupEvents);
  widget.onDisable(() => {
    for (const item of items) {
      undoPreventSelect(item);
      removeEventListenerFrom(item, MC.S_POINTERDOWN, onDragStart);
      removeEventListenerFrom(item, MC.S_DRAGSTART, setIgnoreCancel);
      removeEventListenerFrom(item, MC.S_POINTERENTER, onDragEnter);
      removeEventListenerFrom(item, MC.S_DRAGENTER, onDragEnter);
      removeEventListenerFrom(item, MC.S_DRAGOVER, MH.preventDefault);
      removeEventListenerFrom(item, MC.S_POINTERUP, onDragEnd);
      removeEventListenerFrom(item, MC.S_POINTERCANCEL, onDragEnd);
      removeEventListenerFrom(item, MC.S_DRAGEND, onDragEnd);
      removeEventListenerFrom(item, MC.S_DROP, onDragEnd);
    }
  });
  widget.onDestroy(async () => {
    for (const item of items) {
      await removeClasses(item, PREFIX_ITEM);
      await delData(item, PREFIX_IS_DRAGGABLE);
    }
  });
  setupEvents();
};
const getMethods = (widget, items, config) => {
  const doSwap = (config === null || config === void 0 ? void 0 : config.mode) === "swap";
  const disabledItems = {};
  const callbacks = MH.newSet();
  const getSortedItems = () => [...items].sort((a, b) => MH.isNodeBAfterA(a, b) ? -1 : 1);
  const getOrigItemNumber = (itemNum, currentOrder = false) => currentOrder ? items.indexOf(getSortedItems()[itemNum - 1]) + 1 : itemNum;
  const isItemDisabled = (itemNum, currentOrder = false) => disabledItems[getOrigItemNumber(itemNum, currentOrder)] === true;
  const disableItem = async (itemNum, currentOrder = false) => {
    itemNum = getOrigItemNumber(toInt(itemNum), currentOrder);
    if (widget.isDisabled() || itemNum < 1 || itemNum > MH.lengthOf(items)) {
      return;
    }

    // set immediately for toggle to work without awaiting on it
    disabledItems[itemNum] = true;
    await unsetBooleanData(items[itemNum - 1], PREFIX_IS_DRAGGABLE);
  };
  const enableItem = async (itemNum, currentOrder = false) => {
    itemNum = getOrigItemNumber(toInt(itemNum), currentOrder);
    if (widget.isDisabled() || !isItemDisabled(itemNum)) {
      return;
    }

    // set immediately for toggle to work without awaiting on it
    disabledItems[itemNum] = false;
    await setBooleanData(items[itemNum - 1], PREFIX_IS_DRAGGABLE);
  };
  const toggleItem = (itemNum, currentOrder = false) => isItemDisabled(itemNum, currentOrder) ? enableItem(itemNum, currentOrder) : disableItem(itemNum, currentOrder);
  const onMove = handler => callbacks.add(wrapCallback(handler));

  // This is internal only for now...
  const dragItemOnto = async (dragged, draggedOver) => {
    if (doSwap) {
      await swapElements(dragged, draggedOver, {
        ignoreMove: true
      });
    } else {
      await moveElement(dragged, {
        to: draggedOver,
        position: MH.isNodeBAfterA(dragged, draggedOver) ? "after" : "before",
        ignoreMove: true
      });
    }
    for (const callback of callbacks) {
      await callback.invoke(widget);
    }
  };
  return {
    _getSortedItems: getSortedItems,
    _disableItem: disableItem,
    _enableItem: enableItem,
    _toggleItem: toggleItem,
    _isItemDisabled: isItemDisabled,
    _onMove: onMove,
    _dragItemOnto: dragItemOnto
  };
};
//# sourceMappingURL=sortable.js.map