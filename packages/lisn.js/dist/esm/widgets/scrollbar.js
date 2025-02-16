function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
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
import { settings } from "../globals/settings.js";
import { showElement, hideElement, displayElement, undisplayElement, hasClass, addClasses, addClassesNow, removeClasses, removeClassesNow, getData, setData, setBoolData, setBoolDataNow, setDataNow, delData, delDataNow, getComputedStyleProp, getComputedStylePropNow, setStyleProp, setNumericStyleProps } from "../utils/css-alter.js";
import { moveElementNow, moveElement, moveChildrenNow, wrapChildren, getOrAssignID } from "../utils/dom-alter.js";
import { waitForMeasureTime, waitForMutateTime } from "../utils/dom-optimize.js";
import { addEventListenerTo, removeEventListenerFrom, preventSelect } from "../utils/event.js";
import { logError, logWarn } from "../utils/log.js";
import { toArrayIfSingle } from "../utils/misc.js";
import { isScrollable, getDefaultScrollingElement, getClientWidthNow, getClientHeightNow, mapScrollable, unmapScrollable, tryGetMainScrollableElement } from "../utils/scroll.js";
import { formatAsString } from "../utils/text.js";
import { validateStrList, validateNumber, validateBoolean, validateString } from "../utils/validation.js";
import { ScrollWatcher } from "../watchers/scroll-watcher.js";
import { SizeWatcher } from "../watchers/size-watcher.js";
import { Widget, registerWidget } from "./widget.js";
import debug from "../debug/debug.js";

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
 * default) {@link settings.contentWrappingAllowed}.
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
 * This will create custom scrollbars for the main scrolling element
 * (see {@link settings.mainScrollableElementSelector}).
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
export var Scrollbar = /*#__PURE__*/function (_Widget) {
  /**
   * Note that passing `document.body` is considered equivalent to
   * `document.documentElement`.
   */
  function Scrollbar(scrollable, config) {
    var _Scrollbar$get;
    var _this;
    _classCallCheck(this, Scrollbar);
    if (scrollable === MH.getDocElement()) {
      scrollable = MH.getBody();
    }
    var destroyPromise = (_Scrollbar$get = Scrollbar.get(scrollable)) === null || _Scrollbar$get === void 0 ? void 0 : _Scrollbar$get.destroy();
    _this = _callSuper(this, Scrollbar, [scrollable, {
      id: DUMMY_ID
    }]);
    /**
     * Returns the actual scrollable element created by us which will be a
     * descendant of the original element passed to the constructor (unless
     * {@link settings.contentWrappingAllowed} is false).
     */
    _defineProperty(_this, "getScrollable", void 0);
    var props = getScrollableProps(scrollable);
    var ourScrollable = props.scrollable;
    (destroyPromise || MH.promiseResolve()).then(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!_this.isDestroyed()) {
              _context.next = 2;
              break;
            }
            return _context.abrupt("return");
          case 2:
            _context.next = 4;
            return init(_this, scrollable, props, config);
          case 4:
          case "end":
            return _context.stop();
        }
      }, _callee);
    })));
    _this.getScrollable = function () {
      return ourScrollable;
    };
    return _this;
  }
  _inherits(Scrollbar, _Widget);
  return _createClass(Scrollbar, null, [{
    key: "get",
    value:
    /**
     * If element is omitted, returns the instance created by {@link enableMain}
     * if any.
     */
    function get(scrollable) {
      if (!scrollable) {
        return mainWidget;
      }
      if (scrollable === MH.getDocElement()) {
        scrollable = MH.getBody();
      }
      var instance = _superPropGet(Scrollbar, "get", this, 2)([scrollable, DUMMY_ID]);
      if (MH.isInstanceOf(instance, Scrollbar)) {
        return instance;
      }
      return null;
    }

    /**
     * Enables scrollbars on the {@link settings.mainScrollableElementSelector}.
     *
     * **NOTE:** It returns a Promise to a widget because it will wait for the
     * main element to be present in the DOM if not already.
     */
  }, {
    key: "enableMain",
    value: function enableMain(config) {
      return ScrollWatcher.fetchMainScrollableElement().then(function (main) {
        var widget = new Scrollbar(main, config);
        widget.onDestroy(function () {
          if (mainWidget === widget) {
            mainWidget = null;
          }
        });
        mainWidget = widget;
        return widget;
      });
    }
  }, {
    key: "register",
    value: function register() {
      registerWidget(WIDGET_NAME, function (element, config) {
        if (MH.isHTMLElement(element)) {
          if (!Scrollbar.get(element)) {
            return new Scrollbar(element, config);
          }
        } else {
          logError(MH.usageError("Only HTMLElement is supported for Scrollbar widget"));
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

var WIDGET_NAME = "scrollbar";
var PREFIXED_NAME = MH.prefixName(WIDGET_NAME);
// Only one Scrollbar widget per element is allowed, but Widget
// requires a non-blank ID.
// In fact, it doesn't make much sense to have more than 1 scroll-to-top button
// on the whole page, but we support it, hence use a class rather than a DOM ID.
var DUMMY_ID = PREFIXED_NAME;
var PREFIX_ROOT = "".concat(PREFIXED_NAME, "__root");
var PREFIX_CONTAINER = "".concat(PREFIXED_NAME, "__container");
var PREFIX_CONTENT = "".concat(PREFIXED_NAME, "__content");
var PREFIX_BAR = "".concat(PREFIXED_NAME, "__bar");
var PREFIX_WRAPPER = "".concat(PREFIXED_NAME, "__wrapper");
var PREFIX_FILL = "".concat(PREFIXED_NAME, "__fill");
var PREFIX_SPACER = "".concat(PREFIXED_NAME, "__spacer");
var PREFIX_HANDLE = "".concat(PREFIXED_NAME, "__handle");
var PREFIX_DRAGGABLE = MH.prefixName("draggable");
var PREFIX_CLICKABLE = MH.prefixName("clickable");
var PREFIX_HAS_WRAPPER = MH.prefixName("has-wrapper");
var PREFIX_ALLOW_COLLAPSE = MH.prefixName("allow-collapse");
var PREFIX_HAS_FIXED_HEIGHT = MH.prefixName("has-fixed-height");
var PREFIX_HAS_SCROLLBAR = MH.prefixName("has-scrollbar");
var PREFIX_HIDE_SCROLL = MH.prefixName("hide-scroll");
var S_SET_POINTER_CAPTURE = "setPointerCapture";
var S_RELEASE_POINTER_CAPTURE = "releasePointerCapture";
var S_ARIA_VALUENOW = MC.ARIA_PREFIX + "valuenow";
var S_SCROLLBAR = "scrollbar";
var mainWidget = null;
var configValidator = {
  id: validateString,
  className: validateStrList,
  hideNative: validateBoolean,
  onMobile: validateBoolean,
  positionH: validateString,
  positionV: validateString,
  autoHide: validateNumber,
  clickScroll: validateBoolean,
  dragScroll: validateBoolean,
  useHandle: validateBoolean
};
var getScrollableProps = function getScrollableProps(containerElement) {
  // If main scrollable element doesn't exist yet, then the containerElement
  // passed can't be it anyway, so no need to use fetchMainScrollableElement.
  var mainScrollableElement = tryGetMainScrollableElement();
  var body = MH.getBody();
  var defaultScrollable = getDefaultScrollingElement();
  var isBody = containerElement === body;
  var isMainScrollable = (isBody ? defaultScrollable : containerElement) === mainScrollableElement;
  var root = isMainScrollable ? mainScrollableElement : isBody ? defaultScrollable : containerElement;

  // check if we're using body in quirks mode
  var isBodyInQuirks = root === body && defaultScrollable === body;
  var allowedToWrap = settings.contentWrappingAllowed && getData(containerElement, MC.PREFIX_NO_WRAP) === null;
  var needsSticky = !isMainScrollable && !allowedToWrap;
  var barParent = isMainScrollable ? body : containerElement;
  var hasFixedHeight = isScrollable(root, {
    axis: "y"
  });
  var contentWrapper = null;
  var scrollable = root;
  if (!isMainScrollable && !isBody && allowedToWrap) {
    if (allowedToWrap) {
      contentWrapper = MH.createElement("div");
      scrollable = contentWrapper;
    } else {
      logWarn("Scrollbar on elements other than the main scrollable " + "when settings.contentWrappingAllowed is false relies on " + "position: sticky, is experimental and may not work properly");
    }
  }
  return {
    isMainScrollable: isMainScrollable,
    isBody: isBody,
    isBodyInQuirks: isBodyInQuirks,
    root: root,
    scrollable: scrollable,
    barParent: barParent,
    contentWrapper: contentWrapper,
    needsSticky: needsSticky,
    hasFixedHeight: hasFixedHeight
  };
};
var init = function init(widget, containerElement, props, config) {
  var _ref2, _config$onMobile, _ref3, _config$hideNative, _config$autoHide, _config$clickScroll, _ref4, _config$dragScroll, _ref5, _config$useHandle;
  var isMainScrollable = props.isMainScrollable,
    isBody = props.isBody,
    isBodyInQuirks = props.isBodyInQuirks,
    root = props.root,
    scrollable = props.scrollable,
    barParent = props.barParent,
    contentWrapper = props.contentWrapper,
    needsSticky = props.needsSticky,
    hasFixedHeight = props.hasFixedHeight;
  var logger = debug ? new debug.Logger({
    name: "Scrollbar-".concat(formatAsString(root)),
    logAtCreation: {
      props: props,
      config: config
    }
  }) : null;

  // config
  var onMobile = (_ref2 = (_config$onMobile = config === null || config === void 0 ? void 0 : config.onMobile) !== null && _config$onMobile !== void 0 ? _config$onMobile : settings.scrollbarOnMobile) !== null && _ref2 !== void 0 ? _ref2 : false;
  var hideNative = (_ref3 = (_config$hideNative = config === null || config === void 0 ? void 0 : config.hideNative) !== null && _config$hideNative !== void 0 ? _config$hideNative : settings.scrollbarHideNative) !== null && _ref3 !== void 0 ? _ref3 : false;
  var positionH = (config === null || config === void 0 ? void 0 : config.positionH) || settings.scrollbarPositionH;
  var positionV = (config === null || config === void 0 ? void 0 : config.positionV) || settings.scrollbarPositionV;
  var autoHideDelay = (_config$autoHide = config === null || config === void 0 ? void 0 : config.autoHide) !== null && _config$autoHide !== void 0 ? _config$autoHide : settings.scrollbarAutoHide;
  var clickScroll = (_config$clickScroll = config === null || config === void 0 ? void 0 : config.clickScroll) !== null && _config$clickScroll !== void 0 ? _config$clickScroll : settings.scrollbarClickScroll;
  var dragScroll = (_ref4 = (_config$dragScroll = config === null || config === void 0 ? void 0 : config.dragScroll) !== null && _config$dragScroll !== void 0 ? _config$dragScroll : settings.scrollbarDragScroll) !== null && _ref4 !== void 0 ? _ref4 : false;
  var useHandle = (_ref5 = (_config$useHandle = config === null || config === void 0 ? void 0 : config.useHandle) !== null && _config$useHandle !== void 0 ? _config$useHandle : settings.scrollbarUseHandle) !== null && _ref5 !== void 0 ? _ref5 : false;
  if (MC.IS_MOBILE && !onMobile) {
    return;
  }
  mapScrollable(root, scrollable);

  // ----------

  var newScrollbar = function newScrollbar(wrapper, position) {
    var barIsHorizontal = position === MC.S_TOP || position === MC.S_BOTTOM;
    var scrollbar = MH.createElement("div");
    addClassesNow(scrollbar, PREFIX_BAR);
    setDataNow(scrollbar, MC.PREFIX_ORIENTATION, barIsHorizontal ? MC.S_HORIZONTAL : MC.S_VERTICAL);
    setDataNow(scrollbar, MC.PREFIX_PLACE, position);
    if (clickScroll || dragScroll) {
      MH.setAttr(scrollbar, MC.S_ROLE, S_SCROLLBAR);
      MH.setAttr(scrollbar, MC.S_ARIA_CONTROLS, scrollDomID);
    }
    var fill = MH.createElement("div");
    addClassesNow(fill, useHandle ? PREFIX_SPACER : PREFIX_FILL);
    var handle = null;
    if (useHandle) {
      handle = MH.createElement("div");
      addClassesNow(handle, PREFIX_HANDLE);
      setBoolDataNow(handle, PREFIX_DRAGGABLE, dragScroll);
    }
    setBoolDataNow(scrollbar, PREFIX_DRAGGABLE, dragScroll && !useHandle);
    setBoolDataNow(scrollbar, PREFIX_CLICKABLE, clickScroll);
    moveElementNow(fill, {
      to: scrollbar
    });
    if (handle) {
      moveElementNow(handle, {
        to: scrollbar
      });
    }
    moveElementNow(scrollbar, {
      to: wrapper
    });
    return {
      _bar: scrollbar,
      _handle: handle,
      _fill: fill
    };
  };

  // ----------

  var setProgress = /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(scrollData, tracksH) {
      var scrollbar, hasBarPrefix, completeFraction, viewFraction, scrollAxis;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            scrollbar = tracksH ? scrollbarH : scrollbarV;
            hasBarPrefix = "".concat(PREFIX_HAS_SCROLLBAR, "-").concat(tracksH ? positionH : positionV);
            completeFraction = tracksH ? scrollData[MC.S_SCROLL_LEFT_FRACTION] : scrollData[MC.S_SCROLL_TOP_FRACTION];
            viewFraction = tracksH ? scrollData[MC.S_CLIENT_WIDTH] / scrollData[MC.S_SCROLL_WIDTH] : scrollData[MC.S_CLIENT_HEIGHT] / scrollData[MC.S_SCROLL_HEIGHT];
            logger === null || logger === void 0 || logger.debug9("Updating progress", {
              tracksH: tracksH,
              completeFraction: completeFraction,
              viewFraction: viewFraction
            });
            MH.setAttr(scrollbar, S_ARIA_VALUENOW, MH.round(completeFraction * 100) + "");
            setNumericStyleProps(scrollbar, {
              viewFr: viewFraction,
              completeFr: completeFraction
            }, {
              _numDecimal: 4
            });
            scrollAxis = tracksH ? "x" : "y";
            if (isScrollable(scrollable, {
              axis: scrollAxis
            }) && viewFraction < 1) {
              setBoolData(containerElement, hasBarPrefix);
              displayElement(scrollbar);
            } else {
              delData(containerElement, hasBarPrefix);
              undisplayElement(scrollbar);
            }
          case 9:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function setProgress(_x, _x2) {
      return _ref6.apply(this, arguments);
    };
  }();

  // ----------

  var updateProgress = function updateProgress(target, scrollData) {
    setProgress(scrollData, true);
    setProgress(scrollData, false);
    if (!isMainScrollable && !isBody) {
      setBoxMeasureProps(containerElement);
    }
    if (autoHideDelay > 0) {
      showElement(wrapper).then(function () {
        return hideElement(wrapper, autoHideDelay);
      });
    }
  };
  var updatePropsOnResize = function updatePropsOnResize(target, sizeData) {
    setBoxMeasureProps(containerElement);
    setNumericStyleProps(containerElement, {
      barHeight: sizeData.border[MC.S_HEIGHT]
    }, {
      _units: "px",
      _numDecimal: 2
    });
  };

  // ----------

  var isDragging = false;
  var lastOffset = 0;
  var lastTargetFraction = 0;
  var scrollAction;
  var onClickOrDrag = /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(event, tracksH) {
      var scrollbar, handle, target, eventType, isClick, isHandleClick, startsDrag, barIsHorizontal, barLength, currScrollOffset, maxScrollOffset, rect, offset, deltaOffset, handleLength, targetScrollOffset, targetCoordinates, _scrollAction;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            MH.preventDefault(event);
            scrollbar = tracksH ? scrollbarH : scrollbarV;
            handle = tracksH ? handleH : handleV;
            target = MH.targetOf(event);
            if (!(!MH.isMouseEvent(event) || !MH.isHTMLElement(target))) {
              _context3.next = 6;
              break;
            }
            return _context3.abrupt("return");
          case 6:
            eventType = event.type;
            isClick = eventType === MC.S_POINTERDOWN || eventType === MC.S_MOUSEDOWN;
            isHandleClick = isClick && useHandle && hasClass(target, PREFIX_HANDLE);
            startsDrag = isClick && dragScroll && (isHandleClick || !useHandle);
            if (startsDrag) {
              isDragging = true;
              setOrReleasePointerCapture(event, scrollbar, S_SET_POINTER_CAPTURE);
            }
            logger === null || logger === void 0 || logger.debug10("Click or drag", {
              eventType: eventType,
              isClick: isClick,
              isHandleClick: isHandleClick,
              isDragging: isDragging,
              startsDrag: startsDrag
            });
            if (!(!isClick && !isDragging || isClick && !startsDrag && !clickScroll)) {
              _context3.next = 14;
              break;
            }
            return _context3.abrupt("return");
          case 14:
            _context3.next = 16;
            return waitForMeasureTime();
          case 16:
            barIsHorizontal = isHorizontal(scrollbar);
            barLength = barIsHorizontal ? scrollbar[MC.S_CLIENT_WIDTH] : scrollbar[MC.S_CLIENT_HEIGHT];
            currScrollOffset = tracksH ? scrollable[MC.S_SCROLL_LEFT] : scrollable[MC.S_SCROLL_TOP];
            maxScrollOffset = tracksH ? scrollable[MC.S_SCROLL_WIDTH] - getClientWidthNow(scrollable) : scrollable[MC.S_SCROLL_HEIGHT] - getClientHeightNow(scrollable); // Get click offset relative to the scrollbar regardless of what the
            // event target is and what transforms is has applied.
            rect = MH.getBoundingClientRect(scrollbar);
            offset = barIsHorizontal ? event.clientX - rect.left : event.clientY - rect.top;
            logger === null || logger === void 0 || logger.debug10("Pointer offset", offset);
            if (!(offset === lastOffset)) {
              _context3.next = 25;
              break;
            }
            return _context3.abrupt("return");
          case 25:
            deltaOffset = isClick ? offset : offset - lastOffset;
            lastOffset = offset;
            if (!isClick && useHandle) {
              // Dragging the handle
              handleLength = handle ? MH.parseFloat(getComputedStylePropNow(handle, barIsHorizontal ? MC.S_WIDTH : MC.S_HEIGHT)) : 0;
              lastTargetFraction = lastTargetFraction + deltaOffset / (barLength - (handleLength || 0));
            } else if (isHandleClick) {
              // Starting a handle drag
              lastTargetFraction = currScrollOffset / maxScrollOffset;
            } else {
              // Clicking or dragging on the bar -> scroll to the offset under the pointer
              lastTargetFraction = offset / barLength;
            }
            if (!(isHandleClick || isClick && !clickScroll)) {
              _context3.next = 30;
              break;
            }
            return _context3.abrupt("return");
          case 30:
            targetScrollOffset = lastTargetFraction * maxScrollOffset;
            targetCoordinates = tracksH ? {
              left: targetScrollOffset
            } : {
              top: targetScrollOffset
            };
            logger === null || logger === void 0 || logger.debug10("Scroll target offset", {
              lastTargetFraction: lastTargetFraction,
              targetCoordinates: targetCoordinates
            });
            if (!isClick) {
              _context3.next = 39;
              break;
            }
            _context3.next = 36;
            return scrollWatcher.scrollTo(targetCoordinates, {
              scrollable: scrollable,
              weCanInterrupt: true
            });
          case 36:
            scrollAction = _context3.sent;
            _context3.next = 42;
            break;
          case 39:
            (_scrollAction = scrollAction) === null || _scrollAction === void 0 || _scrollAction.cancel();
            scrollAction = null;
            MH.elScrollTo(scrollable, targetCoordinates);
          case 42:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function onClickOrDrag(_x3, _x4) {
      return _ref7.apply(this, arguments);
    };
  }();

  // ----------

  var onRelease = function onRelease(event, tracksH) {
    var scrollbar = tracksH ? scrollbarH : scrollbarV;
    setOrReleasePointerCapture(event, scrollbar, S_RELEASE_POINTER_CAPTURE);
    isDragging = false;
    scrollAction = null;
  };
  var onClickOrDragH = function onClickOrDragH(event) {
    return onClickOrDrag(event, true);
  };
  var onClickOrDragV = function onClickOrDragV(event) {
    return onClickOrDrag(event, false);
  };
  var onReleaseH = function onReleaseH(event) {
    return onRelease(event, true);
  };
  var onReleaseV = function onReleaseV(event) {
    return onRelease(event, false);
  };

  // ----------

  var maybeSetNativeHidden = function maybeSetNativeHidden() {
    if (hideNative) {
      addClasses(scrollable, PREFIX_HIDE_SCROLL);
      if (isBodyInQuirks) {
        addClasses(MH.getDocElement(), PREFIX_HIDE_SCROLL);
      }
    }
  };
  var setNativeShown = function setNativeShown() {
    removeClasses(scrollable, PREFIX_HIDE_SCROLL);
    if (isBodyInQuirks) {
      removeClasses(MH.getDocElement(), PREFIX_HIDE_SCROLL);
    }
  };

  // ----------

  var addWatchers = function addWatchers() {
    // Track scroll in any direction as well as changes in border or content size
    // of the element and its contents.
    scrollWatcher.trackScroll(updateProgress, {
      threshold: 0,
      scrollable: scrollable
    });

    // Track changes in content or border size of the container element which
    // would also detect changes in its padding.
    sizeWatcher.onResize(updatePropsOnResize, {
      target: containerElement,
      threshold: 0
    });
  };
  var removeWatchers = function removeWatchers() {
    scrollWatcher.noTrackScroll(updateProgress, scrollable);
    sizeWatcher.offResize(updatePropsOnResize, containerElement);
  };

  // SETUP ------------------------------

  if (!isMainScrollable && !isBody) {
    addClasses(containerElement, PREFIX_CONTAINER);
  }
  setBoolData(containerElement, PREFIX_ALLOW_COLLAPSE, !MC.IS_MOBILE);

  // Wrap children if needed
  if (contentWrapper) {
    addClasses(contentWrapper, PREFIX_CONTENT);
    wrapChildren(containerElement, {
      wrapper: contentWrapper,
      ignoreMove: true
    }); // no need to await here

    setBoolData(containerElement, PREFIX_HAS_WRAPPER);
    if (hasFixedHeight) {
      setBoolData(containerElement, PREFIX_HAS_FIXED_HEIGHT);
    }
  }
  maybeSetNativeHidden();
  if (config !== null && config !== void 0 && config.id) {
    scrollable.id = config.id;
  }
  if (config !== null && config !== void 0 && config.className) {
    addClasses.apply(void 0, [scrollable].concat(_toConsumableArray(toArrayIfSingle(config.className))));
  }
  var scrollDomID =
  // for ARIA
  clickScroll || dragScroll ? getOrAssignID(scrollable, S_SCROLLBAR) : "";
  var scrollWatcher = ScrollWatcher.reuse(_defineProperty({}, MC.S_DEBOUNCE_WINDOW, 0));
  var sizeWatcher = SizeWatcher.reuse(_defineProperty({}, MC.S_DEBOUNCE_WINDOW, 0));
  addClasses(barParent, PREFIX_ROOT);
  var wrapper = MH.createElement("div");
  preventSelect(wrapper);
  addClasses(wrapper, MC.PREFIX_NO_TOUCH_ACTION);
  addClasses(wrapper, PREFIX_WRAPPER);
  if (isBody || isMainScrollable) {
    setData(wrapper, MC.PREFIX_POSITION, MC.S_FIXED);
  } else if (needsSticky) {
    setData(wrapper, MC.PREFIX_POSITION, MC.S_STICKY);
  }
  var _newScrollbar = newScrollbar(wrapper, positionH),
    scrollbarH = _newScrollbar._bar,
    handleH = _newScrollbar._handle;
  var _newScrollbar2 = newScrollbar(wrapper, positionV),
    scrollbarV = _newScrollbar2._bar,
    handleV = _newScrollbar2._handle;
  moveElement(wrapper, {
    to: barParent,
    position: "prepend"
  });
  addWatchers();

  // Track clicking and dragging on the two scrollbars
  if (dragScroll) {
    addEventListenerTo(scrollbarH, MC.S_POINTERMOVE, onClickOrDragH);
    addEventListenerTo(scrollbarV, MC.S_POINTERMOVE, onClickOrDragV);
    addEventListenerTo(scrollbarH, MC.S_POINTERUP, onReleaseH);
    addEventListenerTo(scrollbarV, MC.S_POINTERUP, onReleaseV);
  }
  if (dragScroll || clickScroll) {
    addEventListenerTo(scrollbarH, MC.S_POINTERDOWN, onClickOrDragH);
    addEventListenerTo(scrollbarV, MC.S_POINTERDOWN, onClickOrDragV);
  }
  widget.onDisable(function () {
    removeWatchers();
    undisplayElement(scrollbarH);
    undisplayElement(scrollbarV);
    setNativeShown();
  });
  widget.onEnable(function () {
    addWatchers();
    displayElement(scrollbarH);
    displayElement(scrollbarV);
    maybeSetNativeHidden();
  });
  widget.onDestroy(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
    var _i, _arr, position;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          unmapScrollable(root);
          _context4.next = 3;
          return waitForMutateTime();
        case 3:
          if (contentWrapper) {
            moveChildrenNow(contentWrapper, containerElement, {
              ignoreMove: true
            });
            moveElementNow(contentWrapper); // remove
          }
          moveElementNow(wrapper); // remove

          if (dragScroll) {
            removeEventListenerFrom(scrollbarH, MC.S_POINTERMOVE, onClickOrDragH);
            removeEventListenerFrom(scrollbarV, MC.S_POINTERMOVE, onClickOrDragV);
            removeEventListenerFrom(scrollbarH, MC.S_POINTERUP, onReleaseH);
            removeEventListenerFrom(scrollbarV, MC.S_POINTERUP, onReleaseV);
          }
          if (dragScroll || clickScroll) {
            removeEventListenerFrom(scrollbarH, MC.S_POINTERDOWN, onClickOrDragH);
            removeEventListenerFrom(scrollbarV, MC.S_POINTERDOWN, onClickOrDragV);
          }
          removeClassesNow(barParent, PREFIX_ROOT);
          removeClassesNow(containerElement, PREFIX_CONTAINER);
          for (_i = 0, _arr = [MC.S_TOP, MC.S_BOTTOM, MC.S_LEFT, MC.S_RIGHT]; _i < _arr.length; _i++) {
            position = _arr[_i];
            delDataNow(containerElement, "".concat(PREFIX_HAS_SCROLLBAR, "-").concat(position));
          }
          delDataNow(containerElement, PREFIX_HAS_WRAPPER);
          if (hasFixedHeight) {
            delDataNow(containerElement, PREFIX_HAS_FIXED_HEIGHT);
          }
        case 12:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  })));
};
var isHorizontal = function isHorizontal(scrollbar) {
  return getData(scrollbar, MC.PREFIX_ORIENTATION) === MC.S_HORIZONTAL;
};
var setBoxMeasureProps = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(element) {
    var _i2, _arr2, side, _i3, _arr3, key, padding;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _i2 = 0, _arr2 = [MC.S_TOP, MC.S_RIGHT, MC.S_BOTTOM, MC.S_LEFT];
        case 1:
          if (!(_i2 < _arr2.length)) {
            _context5.next = 16;
            break;
          }
          side = _arr2[_i2];
          _i3 = 0, _arr3 = ["padding-".concat(side), "border-".concat(side, "-width")];
        case 4:
          if (!(_i3 < _arr3.length)) {
            _context5.next = 13;
            break;
          }
          key = _arr3[_i3];
          _context5.next = 8;
          return getComputedStyleProp(element, key);
        case 8:
          padding = _context5.sent;
          setStyleProp(element, MH.prefixCssJsVar(key), padding);
        case 10:
          _i3++;
          _context5.next = 4;
          break;
        case 13:
          _i2++;
          _context5.next = 1;
          break;
        case 16:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function setBoxMeasureProps(_x5) {
    return _ref9.apply(this, arguments);
  };
}();
var setOrReleasePointerCapture = function setOrReleasePointerCapture(event, scrollbar, method) {
  if (MH.isPointerEvent(event) && method in scrollbar) {
    scrollbar[method](event.pointerId);
  }
};
//# sourceMappingURL=scrollbar.js.map