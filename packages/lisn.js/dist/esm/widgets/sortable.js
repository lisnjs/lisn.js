function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _superPropGet(t, o, e, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Widgets
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { addClasses, removeClasses, getBoolData, setBoolData, unsetBoolData, delData, copyStyle, setNumericStyleProps } from "../utils/css-alter.js";
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
export var Sortable = /*#__PURE__*/function (_Widget) {
  /**
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If there are less than 2 items given or found.
   */
  function Sortable(element, config) {
    var _Sortable$get;
    var _this;
    _classCallCheck(this, Sortable);
    var destroyPromise = (_Sortable$get = Sortable.get(element)) === null || _Sortable$get === void 0 ? void 0 : _Sortable$get.destroy();
    _this = _callSuper(this, Sortable, [element, {
      id: DUMMY_ID
    }]);
    /**
     * Disables the given item number. Note that item numbers start at 1.
     *
     * @param {} currentOrder If false (default), the item numbers refer to the
     *                        original order. If true, they refer to the current
     *                        document order.
     */
    _defineProperty(_this, "disableItem", void 0);
    /**
     * Re-enables the given item number. Note that item numbers start at 1.
     *
     * @param {} currentOrder If false (default), the item numbers refer to the
     *                        original order. If true, they refer to the current
     *                        document order.
     */
    _defineProperty(_this, "enableItem", void 0);
    /**
     * Re-enables the given item number if it is disabled, otherwise disables it.
     * Note that item numbers start at 1.
     *
     * @param {} currentOrder If false (default), the item numbers refer to the
     *                        original order. If true, they refer to the current
     *                        document order.
     */
    _defineProperty(_this, "toggleItem", void 0);
    /**
     * Returns true if the given item number is disabled. Note that item numbers
     * start at 1.
     *
     * @param {} currentOrder If false (default), the item numbers refer to the
     *                        original order. If true, they refer to the current
     *                        document order.
     */
    _defineProperty(_this, "isItemDisabled", void 0);
    /**
     * The given handler will be called whenever the user moves an item to
     * another position. It will be called after the item is moved so
     * {@link getItems} called with `currentOrder = true` will return the updated
     * order.
     *
     * If the handler returns a promise, it will be awaited upon.
     */
    _defineProperty(_this, "onMove", void 0);
    /**
     * Returns the item elements.
     *
     * @param {} currentOrder If false (default), returns the items in the
     *                        original order. If true, they are returned in the
     *                        current document order.
     */
    _defineProperty(_this, "getItems", void 0);
    var items = (config === null || config === void 0 ? void 0 : config.items) || [];
    if (!MH.lengthOf(items)) {
      items.push.apply(items, _toConsumableArray(MH.querySelectorAll(element, getDefaultWidgetSelector(PREFIX_ITEM__FOR_SELECT))));
      if (!MH.lengthOf(items)) {
        items.push.apply(items, _toConsumableArray(MH.querySelectorAll(element, "[".concat(MC.S_DRAGGABLE, "]"))));
        if (!MH.lengthOf(items)) {
          items.push.apply(items, _toConsumableArray(getVisibleContentChildren(element)));
        }
      }
    }
    if (MH.lengthOf(items) < 2) {
      throw MH.usageError("Sortable must have more than 1 item");
    }
    var methods = getMethods(_this, items, config);
    (destroyPromise || MH.promiseResolve()).then(function () {
      if (_this.isDestroyed()) {
        return;
      }
      init(_this, element, items, methods);
    });
    _this.disableItem = methods._disableItem;
    _this.enableItem = methods._enableItem;
    _this.toggleItem = methods._toggleItem;
    _this.isItemDisabled = methods._isItemDisabled;
    _this.onMove = methods._onMove;
    _this.getItems = function () {
      var currentOrder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return currentOrder ? methods._getSortedItems() : _toConsumableArray(items);
    };
    return _this;
  }
  _inherits(Sortable, _Widget);
  return _createClass(Sortable, null, [{
    key: "get",
    value: function get(element) {
      var instance = _superPropGet(Sortable, "get", this, 2)([element, DUMMY_ID]);
      if (MH.isInstanceOf(instance, Sortable)) {
        return instance;
      }
      return null;
    }
  }, {
    key: "register",
    value: function register() {
      registerWidget(WIDGET_NAME, function (element, config) {
        if (!Sortable.get(element)) {
          return new Sortable(element, config);
        }
        return null;
      }, configValidator);
    }
  }]);
}(Widget);

/**
 * @interface
 */

// --------------------

var WIDGET_NAME = "sortable";
var PREFIXED_NAME = MH.prefixName(WIDGET_NAME);
var PREFIX_IS_DRAGGABLE = MH.prefixName("is-draggable");

// Use different classes for styling items to the one used for auto-discovering
// them, so that re-creating existing widgets can correctly find the items to
// be used by the new widget synchronously before the current one is destroyed.
var PREFIX_ITEM = "".concat(PREFIXED_NAME, "__item");
var PREFIX_ITEM__FOR_SELECT = "".concat(PREFIXED_NAME, "-item");
var PREFIX_FLOATING_CLONE = "".concat(PREFIXED_NAME, "__ghost");

// Only one Sortable widget per element is allowed, but Widget requires a
// non-blank ID.
// In fact, it doesn't make much sense to have more than 1 scroll-to-top button
// on the whole page, but we support it, hence use a class rather than a DOM ID.
var DUMMY_ID = PREFIXED_NAME;
var configValidator = {
  mode: function mode(key, value) {
    return validateString(key, value, function (v) {
      return v === "swap" || v === "move";
    });
  }
};
var touchMoveOptions = {
  passive: false,
  capture: true
};
var isItemDraggable = function isItemDraggable(item) {
  return getBoolData(item, PREFIX_IS_DRAGGABLE);
};
var init = function init(widget, element, items, methods) {
  var currentDraggedItem = null;
  var floatingClone = null;
  var ignoreCancel = false;
  var grabOffset = [0, 0];
  var setIgnoreCancel = function setIgnoreCancel() {
    return ignoreCancel = true;
  };
  var onDragStart = function onDragStart(event) {
    var currTarget = MH.currentTargetOf(event);
    if (MH.isElement(currTarget) && isItemDraggable(currTarget) && MH.isMouseEvent(event)) {
      currentDraggedItem = currTarget;
      MH.setAttr(currTarget, MC.S_DRAGGABLE);
      if (MH.isTouchPointerEvent(event)) {
        var target = MH.targetOf(event);
        if (MH.isElement(target)) {
          target.releasePointerCapture(event.pointerId);
        }
      }
      addEventListenerTo(MH.getDoc(), MC.S_TOUCHMOVE, onTouchMove, touchMoveOptions);
      waitForMeasureTime().then(function () {
        // Get pointer offset relative to the current item being dragged
        // regardless of what the event target is and what transforms is has
        // applied.
        var rect = MH.getBoundingClientRect(currTarget);
        grabOffset = [event.clientX - rect.left, event.clientY - rect.top];
      });
    }
  };
  var onDragEnd = function onDragEnd(event) {
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
  var onTouchMove = function onTouchMove(event) {
    if (MH.isTouchEvent(event) && MH.lengthOf(event.touches) === 1) {
      var parentEl = MH.parentOf(currentDraggedItem);
      if (parentEl && currentDraggedItem) {
        MH.preventDefault(event);
        var touch = event.touches[0];
        var clientX = touch.clientX;
        var clientY = touch.clientY;
        if (!floatingClone) {
          floatingClone = cloneElement(currentDraggedItem);
          addClasses(floatingClone, PREFIX_FLOATING_CLONE);
          copyStyle(currentDraggedItem, floatingClone, ["width", "height"]).then(function () {
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
  var onDragEnter = function onDragEnter(event) {
    var currTarget = MH.currentTargetOf(event);
    var dragged = currentDraggedItem;
    if ((MH.isTouchPointerEvent(event) || event.type === MC.S_DRAGENTER) && dragged && MH.isElement(currTarget) && currTarget !== dragged) {
      methods._dragItemOnto(dragged, currTarget); // no need to await
    }
  };
  var setupEvents = function setupEvents() {
    var _iterator = _createForOfIteratorHelper(items),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
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
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };

  // SETUP ------------------------------
  var _iterator2 = _createForOfIteratorHelper(items),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var item = _step2.value;
      addClasses(item, PREFIX_ITEM);
      setBoolData(item, PREFIX_IS_DRAGGABLE);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  widget.onEnable(setupEvents);
  widget.onDisable(function () {
    var _iterator3 = _createForOfIteratorHelper(items),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var item = _step3.value;
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
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  });
  widget.onDestroy(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var _iterator4, _step4, item;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _iterator4 = _createForOfIteratorHelper(items);
          _context.prev = 1;
          _iterator4.s();
        case 3:
          if ((_step4 = _iterator4.n()).done) {
            _context.next = 11;
            break;
          }
          item = _step4.value;
          _context.next = 7;
          return removeClasses(item, PREFIX_ITEM);
        case 7:
          _context.next = 9;
          return delData(item, PREFIX_IS_DRAGGABLE);
        case 9:
          _context.next = 3;
          break;
        case 11:
          _context.next = 16;
          break;
        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](1);
          _iterator4.e(_context.t0);
        case 16:
          _context.prev = 16;
          _iterator4.f();
          return _context.finish(16);
        case 19:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 13, 16, 19]]);
  })));
  setupEvents();
};
var getMethods = function getMethods(widget, items, config) {
  var doSwap = (config === null || config === void 0 ? void 0 : config.mode) === "swap";
  var disabledItems = {};
  var callbacks = MH.newSet();
  var getSortedItems = function getSortedItems() {
    return _toConsumableArray(items).sort(function (a, b) {
      return MH.isNodeBAfterA(a, b) ? -1 : 1;
    });
  };
  var getOrigItemNumber = function getOrigItemNumber(itemNum) {
    var currentOrder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return currentOrder ? items.indexOf(getSortedItems()[itemNum - 1]) + 1 : itemNum;
  };
  var isItemDisabled = function isItemDisabled(itemNum) {
    var currentOrder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return disabledItems[getOrigItemNumber(itemNum, currentOrder)] === true;
  };
  var disableItem = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(itemNum) {
      var currentOrder,
        _args2 = arguments;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            currentOrder = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : false;
            itemNum = getOrigItemNumber(toInt(itemNum), currentOrder);
            if (!(widget.isDisabled() || itemNum < 1 || itemNum > MH.lengthOf(items))) {
              _context2.next = 4;
              break;
            }
            return _context2.abrupt("return");
          case 4:
            // set immediately for toggle to work without awaiting on it
            disabledItems[itemNum] = true;
            _context2.next = 7;
            return unsetBoolData(items[itemNum - 1], PREFIX_IS_DRAGGABLE);
          case 7:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function disableItem(_x) {
      return _ref2.apply(this, arguments);
    };
  }();
  var enableItem = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(itemNum) {
      var currentOrder,
        _args3 = arguments;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            currentOrder = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : false;
            itemNum = getOrigItemNumber(toInt(itemNum), currentOrder);
            if (!(widget.isDisabled() || !isItemDisabled(itemNum))) {
              _context3.next = 4;
              break;
            }
            return _context3.abrupt("return");
          case 4:
            // set immediately for toggle to work without awaiting on it
            disabledItems[itemNum] = false;
            _context3.next = 7;
            return setBoolData(items[itemNum - 1], PREFIX_IS_DRAGGABLE);
          case 7:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function enableItem(_x2) {
      return _ref3.apply(this, arguments);
    };
  }();
  var toggleItem = function toggleItem(itemNum) {
    var currentOrder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return isItemDisabled(itemNum, currentOrder) ? enableItem(itemNum, currentOrder) : disableItem(itemNum, currentOrder);
  };
  var onMove = function onMove(handler) {
    return callbacks.add(wrapCallback(handler));
  };

  // This is internal only for now...
  var dragItemOnto = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(dragged, draggedOver) {
      var _iterator5, _step5, callback;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            if (!doSwap) {
              _context4.next = 5;
              break;
            }
            _context4.next = 3;
            return swapElements(dragged, draggedOver, {
              ignoreMove: true
            });
          case 3:
            _context4.next = 7;
            break;
          case 5:
            _context4.next = 7;
            return moveElement(dragged, {
              to: draggedOver,
              position: MH.isNodeBAfterA(dragged, draggedOver) ? "after" : "before",
              ignoreMove: true
            });
          case 7:
            _iterator5 = _createForOfIteratorHelper(callbacks);
            _context4.prev = 8;
            _iterator5.s();
          case 10:
            if ((_step5 = _iterator5.n()).done) {
              _context4.next = 16;
              break;
            }
            callback = _step5.value;
            _context4.next = 14;
            return callback.invoke(widget);
          case 14:
            _context4.next = 10;
            break;
          case 16:
            _context4.next = 21;
            break;
          case 18:
            _context4.prev = 18;
            _context4.t0 = _context4["catch"](8);
            _iterator5.e(_context4.t0);
          case 21:
            _context4.prev = 21;
            _iterator5.f();
            return _context4.finish(21);
          case 24:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[8, 18, 21, 24]]);
    }));
    return function dragItemOnto(_x3, _x4) {
      return _ref4.apply(this, arguments);
    };
  }();
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