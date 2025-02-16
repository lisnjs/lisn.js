function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
import { disableInitialTransition, addClasses, removeClassesNow, getData, setData, setBoolData, delDataNow, setStyleProp, delStylePropNow } from "../utils/css-alter.js";
import { waitForMeasureTime, waitForMutateTime } from "../utils/dom-optimize.js";
import { getVisibleContentChildren } from "../utils/dom-query.js";
import { addEventListenerTo, removeEventListenerFrom } from "../utils/event.js";
import { isValidInputDevice } from "../utils/gesture.js";
import { toInt } from "../utils/math.js";
import { toBool } from "../utils/misc.js";
import { getClosestScrollable } from "../utils/scroll.js";
import { validateStrList, validateNumber, validateString, validateBoolean } from "../utils/validation.js";
import { wrapCallback } from "../modules/callback.js";
import { GestureWatcher } from "../watchers/gesture-watcher.js";
import { ScrollWatcher } from "../watchers/scroll-watcher.js";
import { ViewWatcher } from "../watchers/view-watcher.js";
import { Widget, registerWidget, getDefaultWidgetSelector } from "./widget.js";

/**
 * Configures the given element as a {@link Pager} widget.
 *
 * The Pager widget sets up the elements that make up its pages to be overlayed
 * on top of each other with only one of them visible at a time. When a user
 * performs a scroll-like gesture (see {@link GestureWatcher}), the pages are
 * flicked through: gestures, whose direction is down (or left) result in the
 * next page being shown, otherwise the previous.
 *
 * The widget should have more than one page.
 *
 * Optionally, the widget can have a set of "switch" elements and a set of
 * "toggle" elements which correspond one-to-one to each page. Switches go to
 * the given page and toggles toggle the enabled/disabled state of the page.
 *
 * **IMPORTANT:** The page elements will be positioned absolutely, and
 * therefore the pager likely needs to have an explicit height. If you enable
 * {@link PagerConfig.fullscreen}, then the element will get `height: 100vh`
 * set. Otherwise, you need to set its height in your CSS.
 *
 * **IMPORTANT:** You should not instantiate more than one {@link Pager}
 * widget on a given element. Use {@link Pager.get} to get an existing
 * instance if any. If there is already a widget instance, it will be destroyed!
 *
 * -----
 *
 * You can use the following dynamic attributes or CSS properties in your
 * stylesheet:
 *
 * The following dynamic attributes are set on the pager element:
 * - `data-lisn-orientation`: `"horizontal"` or `"vertical"`
 * - `data-lisn-use-parallax`: `"true"` or `"false"`
 * - `data-lisn-total-pages`: the number of pages
 * - `data-lisn-current-page`: the current page number
 * - `data-lisn-current-page-is-last`: `"true"` or `"false"`
 * - `data-lisn-current-page-is-first-enabled`: `"true"` or `"false"`
 * - `data-lisn-current-page-is-last-enabled`: `"true"` or `"false"`
 *
 * The following dynamic CSS properties are also set on the pager element's style:
 * - `--lisn-js--total-pages`: the number of pages
 * - `--lisn-js--current-page`: the current page number
 *
 * The following dynamic attributes are set on each page, toggle or switch element:
 * - `data-lisn-page-state`: `"current"`, `"next"`, `"covered"` or `"disabled"`
 * - `data-lisn-page-number`: the corresponding page's number
 *
 * The following analogous dynamic CSS properties are also set on each page,
 * toggle or switch element's style:
 * - `--lisn-js--page-number`: the corresponding page's number
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-pager` class or `data-lisn-pager` attribute set on the container
 *   element that constitutes the pager
 * - `lisn-pager-page` class or `data-lisn-pager-page` attribute set on
 *   elements that should act as the pages.
 * - `lisn-pager-toggle` class or `data-lisn-pager-toggle` attribute set on
 *   elements that should act as the toggles.
 * - `lisn-pager-switch` class or `data-lisn-pager-switch` attribute set on
 *   elements that should act as the switches.
 *
 * When using auto-widgets, the elements that will be used as pages are
 * discovered in the following way:
 * 1. The top-level element that constitutes the widget is searched for any
 *    elements that contain the `lisn-pager-page` class or
 *    `data-lisn-pager-page` attribute. They do not have to be immediate
 *    children of the root element, but they **should** all be siblings.
 * 2. If there are no such elements, all of the immediate children of the
 *    widget element except any `script` or `style` elements are taken as the
 *    pages.
 *
 * The toggles and switches are descendants of the top-level element that
 * constitutes the widget, that contain the
 * `lisn-pager-toggle`/`lisn-pager-switch` class or `data-lisn-pager-toggle`/
 * `data-lisn-pager-switch` attribute. They do not have to be immediate
 * children of the root element.
 *
 * See below examples for what values you can use set for the data attributes
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This defines a simple pager with default settings.
 *
 * ```html
 * <div class="lisn-pager">
 *   <div>Vertical: Page 1</div>
 *   <div>Vertical: Page 2</div>
 *   <div>Vertical: Page 3</div>
 *   <div>Vertical: Page 4</div>
 * </div>
 * ```
 *
 * @example
 * As above but with all settings explicitly set to their default (`false`).
 *
 * ```html
 * <div data-lisn-pager="fullscreen=false | parallax=false | horizontal=false">
 *   <div>Vertical: Page 1</div>
 *   <div>Vertical: Page 2</div>
 *   <div>Vertical: Page 3</div>
 *   <div>Vertical: Page 4</div>
 * </div>
 * ```
 *
 * @example
 * This defines a pager with custom settings.
 *
 * ```html
 * <div data-lisn-pager="fullscreen | parallax | horizontal | gestures=false">
 *   <div>Horizontal: Page 1</div>
 *   <div>Horizontal: Page 2</div>
 *   <div>Horizontal: Page 3</div>
 *   <div>Horizontal: Page 4</div>
 * </div>
 * ```
 *
 * @example
 * This defines a pager with custom settings, as well as toggle and switch buttons.
 *
 * ```html
 * <div data-lisn-pager="fullscreen | parallax | horizontal | gestures=false">
 *   <div>
 *     <div data-lisn-pager-page>Horizontal: Page 1</div>
 *     <div data-lisn-pager-page>Horizontal: Page 2</div>
 *     <div data-lisn-pager-page>Horizontal: Page 3</div>
 *     <div data-lisn-pager-page>Horizontal: Page 4</div>
 *   </div>
 *
 *   <div>
 *     <button data-lisn-pager-toggle>Toggle page 1</button>
 *     <button data-lisn-pager-toggle>Toggle page 2</button>
 *     <button data-lisn-pager-toggle>Toggle page 3</button>
 *     <button data-lisn-pager-toggle>Toggle page 4</button>
 *   </div>
 *
 *   <div>
 *     <button data-lisn-pager-switch>Go to page 1</button>
 *     <button data-lisn-pager-switch>Go to page 2</button>
 *     <button data-lisn-pager-switch>Go to page 3</button>
 *     <button data-lisn-pager-switch>Go to page 4</button>
 *   </div>
 * </div>
 * ```
 */
export var Pager = /*#__PURE__*/function (_Widget) {
  /**
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If there are less than 2 pages given or found, or if any
   *                page is not a descendant of the main pager element.
   */
  function Pager(element, config) {
    var _Pager$get;
    var _this;
    _classCallCheck(this, Pager);
    var destroyPromise = (_Pager$get = Pager.get(element)) === null || _Pager$get === void 0 ? void 0 : _Pager$get.destroy();
    _this = _callSuper(this, Pager, [element, {
      id: DUMMY_ID
    }]);
    /**
     * Advances the widget's page by 1. If the current page is the last one,
     * nothing is done, unless {@link PagerConfig.fullscreen} is true in which
     * case the pager's scrollable ancestor will be scrolled down/right
     * (depending on the gesture direction).
     */
    _defineProperty(_this, "nextPage", void 0);
    /**
     * Reverses the widget's page by 1. If the current page is the first one,
     * nothing is done, unless {@link PagerConfig.fullscreen} is true in which
     * case the pager's scrollable ancestor will be scrolled up/left
     * (depending on the gesture direction).
     */
    _defineProperty(_this, "prevPage", void 0);
    /**
     * Advances the widget to the given page. Note that page numbers start at 1.
     *
     * If this page is disabled, nothing is done.
     */
    _defineProperty(_this, "goToPage", void 0);
    /**
     * Disables the given page number. Note that page numbers start at 1.
     *
     * The page will be skipped during transitioning to previous/next.
     *
     * If the page is the current one, then the current page will be switched to
     * the previous one (that's not disabled), or if this is the first enabled
     * page, then it will switch to the next one that's not disabled.
     *
     * If this is the last enabled page, nothing is done.
     */
    _defineProperty(_this, "disablePage", void 0);
    /**
     * Re-enables the given page number. Note that page numbers start at 1.
     */
    _defineProperty(_this, "enablePage", void 0);
    /**
     * Re-enables the given page if it is disabled, otherwise disables it. Note
     * that page numbers start at 1.
     */
    _defineProperty(_this, "togglePage", void 0);
    /**
     * Returns true if the given page number is disabled. Note that page
     * numbers start at 1.
     */
    _defineProperty(_this, "isPageDisabled", void 0);
    /**
     * Returns the current page.
     */
    _defineProperty(_this, "getCurrentPage", void 0);
    /**
     * Returns the previous page, before the last transition.
     *
     * If there has been no change of page, returns the first page, same as
     * {@link getCurrentPageNum}.
     */
    _defineProperty(_this, "getPreviousPage", void 0);
    /**
     * Returns the number of the current page. Note that numbers start at 1.
     */
    _defineProperty(_this, "getCurrentPageNum", void 0);
    /**
     * Returns the number of the previous page, before the last transition. Note
     * that numbers start at 1.
     *
     * If there has been no change of page, returns the number of the first page,
     * same as {@link getCurrentPageNum}.
     */
    _defineProperty(_this, "getPreviousPageNum", void 0);
    /**
     * The given handler will be called whenever there is a change of page. It
     * will be called after the current page number is updated internally (so
     * {@link getPreviousPageNum} and {@link getCurrentPageNum} will return the
     * updated numbers), but before the page transition styles are updated.
     *
     * If the handler returns a promise, it will be awaited upon.
     */
    _defineProperty(_this, "onTransition", void 0);
    /**
     * Returns the page elements.
     */
    _defineProperty(_this, "getPages", void 0);
    /**
     * Returns the toggle elements if any.
     */
    _defineProperty(_this, "getToggles", void 0);
    /**
     * Returns the switch elements if any.
     */
    _defineProperty(_this, "getSwitches", void 0);
    var pages = (config === null || config === void 0 ? void 0 : config.pages) || [];
    var toggles = (config === null || config === void 0 ? void 0 : config.toggles) || [];
    var switches = (config === null || config === void 0 ? void 0 : config.switches) || [];
    var nextPrevSwitch = {
      _next: (config === null || config === void 0 ? void 0 : config.nextSwitch) || null,
      _prev: (config === null || config === void 0 ? void 0 : config.prevSwitch) || null
    };
    var pageSelector = getDefaultWidgetSelector(PREFIX_PAGE__FOR_SELECT);
    var toggleSelector = getDefaultWidgetSelector(PREFIX_TOGGLE__FOR_SELECT);
    var switchSelector = getDefaultWidgetSelector(PREFIX_SWITCH__FOR_SELECT);
    var nextSwitchSelector = getDefaultWidgetSelector(PREFIX_NEXT_SWITCH__FOR_SELECT);
    var prevSwitchSelector = getDefaultWidgetSelector(PREFIX_PREV_SWITCH__FOR_SELECT);
    if (!MH.lengthOf(pages)) {
      pages.push.apply(pages, _toConsumableArray(MH.querySelectorAll(element, pageSelector)));
      if (!MH.lengthOf(pages)) {
        pages.push.apply(pages, _toConsumableArray(getVisibleContentChildren(element).filter(function (e) {
          return !e.matches(switchSelector);
        })));
      }
    }
    if (!MH.lengthOf(toggles)) {
      toggles.push.apply(toggles, _toConsumableArray(MH.querySelectorAll(element, toggleSelector)));
    }
    if (!MH.lengthOf(switches)) {
      switches.push.apply(switches, _toConsumableArray(MH.querySelectorAll(element, switchSelector)));
    }
    if (!nextPrevSwitch._next) {
      nextPrevSwitch._next = MH.querySelector(element, nextSwitchSelector);
    }
    if (!nextPrevSwitch._prev) {
      nextPrevSwitch._prev = MH.querySelector(element, prevSwitchSelector);
    }
    var numPages = MH.lengthOf(pages);
    if (numPages < 2) {
      throw MH.usageError("Pager must have more than 1 page");
    }
    var _iterator = _createForOfIteratorHelper(pages),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var page = _step.value;
        if (!element.contains(page) || page === element) {
          throw MH.usageError("Pager's pages must be its descendants");
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var components = {
      _pages: pages,
      _toggles: toggles,
      _switches: switches,
      _nextPrevSwitch: nextPrevSwitch
    };
    var methods = getMethods(_this, components, element, config);
    (destroyPromise || MH.promiseResolve()).then(function () {
      if (_this.isDestroyed()) {
        return;
      }
      init(_this, element, components, config, methods);
    });
    _this.nextPage = function () {
      return methods._nextPage();
    };
    _this.prevPage = function () {
      return methods._prevPage();
    };
    _this.goToPage = function (pageNum) {
      return methods._goToPage(pageNum);
    };
    _this.disablePage = methods._disablePage;
    _this.enablePage = methods._enablePage;
    _this.togglePage = methods._togglePage;
    _this.isPageDisabled = methods._isPageDisabled;
    _this.getCurrentPage = methods._getCurrentPage;
    _this.getPreviousPage = methods._getPreviousPage;
    _this.getCurrentPageNum = methods._getCurrentPageNum;
    _this.getPreviousPageNum = methods._getPreviousPageNum;
    _this.onTransition = methods._onTransition;
    _this.getPages = function () {
      return _toConsumableArray(pages);
    };
    _this.getSwitches = function () {
      return _toConsumableArray(switches);
    };
    _this.getToggles = function () {
      return _toConsumableArray(toggles);
    };
    return _this;
  }
  _inherits(Pager, _Widget);
  return _createClass(Pager, null, [{
    key: "get",
    value: function get(element) {
      var instance = _superPropGet(Pager, "get", this, 2)([element, DUMMY_ID]);
      if (MH.isInstanceOf(instance, Pager)) {
        return instance;
      }
      return null;
    }
  }, {
    key: "register",
    value: function register() {
      registerWidget(WIDGET_NAME, function (element, config) {
        if (!Pager.get(element)) {
          return new Pager(element, config);
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

// Swiping on some trackpads results in "trailing" wheel events sent for some
// while which results in multiple pages being advanced in a short while. So we
// limit how often pages can be advanced.
var MIN_TIME_BETWEEN_WHEEL = 1000;
var S_CURRENT = "current";
var S_ARIA_CURRENT = MC.ARIA_PREFIX + S_CURRENT;
var S_COVERED = "covered";
var S_NEXT = "next";
var S_TOTAL_PAGES = "total-pages";
var S_CURRENT_PAGE = "current-page";
var S_PAGE_NUMBER = "page-number";
var WIDGET_NAME = "pager";
var PREFIXED_NAME = MH.prefixName(WIDGET_NAME);
var PREFIX_ROOT = "".concat(PREFIXED_NAME, "__root");
var PREFIX_PAGE_CONTAINER = "".concat(PREFIXED_NAME, "__page-container");

// Use different classes for styling items to the one used for auto-discovering
// them, so that re-creating existing widgets can correctly find the items to
// be used by the new widget synchronously before the current one is destroyed.
var PREFIX_PAGE = "".concat(PREFIXED_NAME, "__page");
var PREFIX_PAGE__FOR_SELECT = "".concat(PREFIXED_NAME, "-page");
var PREFIX_TOGGLE__FOR_SELECT = "".concat(PREFIXED_NAME, "-toggle");
var PREFIX_SWITCH__FOR_SELECT = "".concat(PREFIXED_NAME, "-switch");
var PREFIX_NEXT_SWITCH__FOR_SELECT = "".concat(PREFIXED_NAME, "-next-switch");
var PREFIX_PREV_SWITCH__FOR_SELECT = "".concat(PREFIXED_NAME, "-prev-switch");
var PREFIX_IS_FULLSCREEN = MH.prefixName("is-fullscreen");
var PREFIX_USE_PARALLAX = MH.prefixName("use-parallax");
var PREFIX_TOTAL_PAGES = MH.prefixName(S_TOTAL_PAGES);
var PREFIX_CURRENT_PAGE = MH.prefixName(S_CURRENT_PAGE);
var PREFIX_CURRENT_PAGE_IS_LAST = "".concat(PREFIX_CURRENT_PAGE, "-is-last");
var PREFIX_CURRENT_PAGE_IS_FIRST_ENABLED = "".concat(PREFIX_CURRENT_PAGE, "-is-first-enabled");
var PREFIX_CURRENT_PAGE_IS_LAST_ENABLED = "".concat(PREFIX_CURRENT_PAGE_IS_LAST, "-enabled");
var PREFIX_PAGE_STATE = MH.prefixName("page-state");
var PREFIX_PAGE_NUMBER = MH.prefixName(S_PAGE_NUMBER);
var VAR_TOTAL_PAGES = MH.prefixCssJsVar(S_TOTAL_PAGES);
var VAR_CURRENT_PAGE = MH.prefixCssJsVar(S_CURRENT_PAGE);
var VAR_PAGE_NUMBER = MH.prefixCssJsVar(S_PAGE_NUMBER);

// Only one Pager widget per element is allowed, but Widget requires a
// non-blank ID.
var DUMMY_ID = PREFIXED_NAME;
var configValidator = {
  initialPage: validateNumber,
  fullscreen: validateBoolean,
  parallax: validateBoolean,
  horizontal: validateBoolean,
  useGestures: function useGestures(key, value) {
    if (MH.isNullish(value)) {
      return undefined;
    }
    var bool = toBool(value);
    if (bool !== null) {
      return bool;
    }
    return validateStrList("useGestures", validateString(key, value), isValidInputDevice) || true;
  },
  alignGestureDirection: validateBoolean,
  preventDefault: validateBoolean
};
var fetchClosestScrollable = function fetchClosestScrollable(element) {
  return waitForMeasureTime().then(function () {
    var _getClosestScrollable;
    return (_getClosestScrollable = getClosestScrollable(element, {
      active: true
    })) !== null && _getClosestScrollable !== void 0 ? _getClosestScrollable : undefined;
  });
};
var setPageNumber = function setPageNumber(components, pageNum) {
  var lastPromise = MH.promiseResolve();
  var _iterator2 = _createForOfIteratorHelper([components._pages[pageNum - 1], components._toggles[pageNum - 1], components._switches[pageNum - 1]]),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var el = _step2.value;
      if (el) {
        setData(el, PREFIX_PAGE_NUMBER, pageNum + "");
        lastPromise = setStyleProp(el, VAR_PAGE_NUMBER, pageNum + "");
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return lastPromise;
};
var setCurrentPage = function setCurrentPage(pagerEl, currPageNum, numPages, isPageDisabled) {
  var isFirstEnabled = true;
  var isLastEnabled = true;
  for (var n = 1; n <= numPages; n++) {
    if (!isPageDisabled(n)) {
      if (n < currPageNum) {
        isFirstEnabled = false;
      } else if (n > currPageNum) {
        isLastEnabled = false;
      }
    }
  }
  setStyleProp(pagerEl, VAR_CURRENT_PAGE, currPageNum + "");
  setData(pagerEl, PREFIX_CURRENT_PAGE, currPageNum + "");
  setBoolData(pagerEl, PREFIX_CURRENT_PAGE_IS_LAST, numPages === numPages);
  setBoolData(pagerEl, PREFIX_CURRENT_PAGE_IS_FIRST_ENABLED, isFirstEnabled);
  return setBoolData(pagerEl, PREFIX_CURRENT_PAGE_IS_LAST_ENABLED, isLastEnabled);
};
var setPageState = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(components, pageNum, state) {
    var _iterator3, _step3, el;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _iterator3 = _createForOfIteratorHelper([components._pages[pageNum - 1], components._toggles[pageNum - 1], components._switches[pageNum - 1]]);
          _context.prev = 1;
          _iterator3.s();
        case 3:
          if ((_step3 = _iterator3.n()).done) {
            _context.next = 10;
            break;
          }
          el = _step3.value;
          if (!el) {
            _context.next = 8;
            break;
          }
          _context.next = 8;
          return setData(el, PREFIX_PAGE_STATE, state);
        case 8:
          _context.next = 3;
          break;
        case 10:
          _context.next = 15;
          break;
        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](1);
          _iterator3.e(_context.t0);
        case 15:
          _context.prev = 15;
          _iterator3.f();
          return _context.finish(15);
        case 18:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 12, 15, 18]]);
  }));
  return function setPageState(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var init = function init(widget, element, components, config, methods) {
  var _pages$, _config$initialPage, _config$fullscreen, _config$parallax, _config$horizontal, _config$useGestures, _config$alignGestureD, _config$preventDefaul;
  var pages = components._pages;
  var toggles = components._toggles;
  var switches = components._switches;
  var nextSwitch = components._nextPrevSwitch._next;
  var prevSwitch = components._nextPrevSwitch._prev;
  var pageContainer = (_pages$ = pages[0]) === null || _pages$ === void 0 ? void 0 : _pages$.parentElement;
  var initialPage = toInt((_config$initialPage = config === null || config === void 0 ? void 0 : config.initialPage) !== null && _config$initialPage !== void 0 ? _config$initialPage : 1);
  var isFullscreen = (_config$fullscreen = config === null || config === void 0 ? void 0 : config.fullscreen) !== null && _config$fullscreen !== void 0 ? _config$fullscreen : false;
  var isParallax = (_config$parallax = config === null || config === void 0 ? void 0 : config.parallax) !== null && _config$parallax !== void 0 ? _config$parallax : false;
  var isHorizontal = (_config$horizontal = config === null || config === void 0 ? void 0 : config.horizontal) !== null && _config$horizontal !== void 0 ? _config$horizontal : false;
  var orientation = isHorizontal ? MC.S_HORIZONTAL : MC.S_VERTICAL;
  var useGestures = (_config$useGestures = config === null || config === void 0 ? void 0 : config.useGestures) !== null && _config$useGestures !== void 0 ? _config$useGestures : true;
  var alignGestureDirection = (_config$alignGestureD = config === null || config === void 0 ? void 0 : config.alignGestureDirection) !== null && _config$alignGestureD !== void 0 ? _config$alignGestureD : false;
  var preventDefault = (_config$preventDefaul = config === null || config === void 0 ? void 0 : config.preventDefault) !== null && _config$preventDefaul !== void 0 ? _config$preventDefaul : true;
  var scrollWatcher = ScrollWatcher.reuse();
  var gestureWatcher = null;
  var viewWatcher = null;
  if (isFullscreen) {
    viewWatcher = ViewWatcher.reuse({
      rootMargin: "0px",
      threshold: 0.3
    });
  }
  if (useGestures) {
    gestureWatcher = GestureWatcher.reuse();
  }
  var getGestureOptions = function getGestureOptions(directions) {
    return {
      devices: MH.isBoolean(useGestures) // i.e. true; if it's false, then gestureWatcher is null
      ? undefined // all devices
      : useGestures,
      intents: [MC.S_DRAG, MC.S_SCROLL],
      directions: directions,
      deltaThreshold: 25,
      preventDefault: preventDefault
    };
  };
  var scrollToPager = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = scrollWatcher;
            _context2.t1 = element;
            _context2.next = 4;
            return fetchClosestScrollable(element);
          case 4:
            _context2.t2 = _context2.sent;
            _context2.t3 = {
              scrollable: _context2.t2
            };
            _context2.t0.scrollTo.call(_context2.t0, _context2.t1, _context2.t3);
          case 7:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function scrollToPager() {
      return _ref2.apply(this, arguments);
    };
  }();
  var transitionOnGesture = function transitionOnGesture(target, data) {
    var swapDirection = data.intent === MC.S_DRAG;
    if (MH.includes([MC.S_LEFT, MC.S_UP], data.direction)) {
      (swapDirection ? methods._nextPage : methods._prevPage)(data);
    } else {
      (swapDirection ? methods._prevPage : methods._nextPage)(data);
    }
  };
  var addWatcher = function addWatcher() {
    var _gestureWatcher, _viewWatcher;
    (_gestureWatcher = gestureWatcher) === null || _gestureWatcher === void 0 || _gestureWatcher.onGesture(element, transitionOnGesture, getGestureOptions(alignGestureDirection ? isHorizontal ? [MC.S_LEFT, MC.S_RIGHT] : [MC.S_UP, MC.S_DOWN] : undefined // all directions
    ));
    (_viewWatcher = viewWatcher) === null || _viewWatcher === void 0 || _viewWatcher.onView(element, scrollToPager, {
      views: "at"
    });
  };
  var getPageNumForEvent = function getPageNumForEvent(event) {
    var target = MH.currentTargetOf(event);
    return MH.isElement(target) ? toInt(getData(target, PREFIX_PAGE_NUMBER)) : 0;
  };
  var toggleClickListener = function toggleClickListener(event) {
    var pageNum = getPageNumForEvent(event);
    methods._togglePage(pageNum);
  };
  var switchClickListener = function switchClickListener(event) {
    var pageNum = getPageNumForEvent(event);
    methods._goToPage(pageNum);
  };
  var nextSwitchClickListener = function nextSwitchClickListener() {
    return methods._nextPage();
  };
  var prevSwitchClickListener = function prevSwitchClickListener() {
    return methods._prevPage();
  };
  var removeWatcher = function removeWatcher() {
    var _gestureWatcher2, _viewWatcher2;
    (_gestureWatcher2 = gestureWatcher) === null || _gestureWatcher2 === void 0 || _gestureWatcher2.offGesture(element, transitionOnGesture);
    (_viewWatcher2 = viewWatcher) === null || _viewWatcher2 === void 0 || _viewWatcher2.offView(element, scrollToPager);
  };

  // SETUP ------------------------------

  widget.onDisable(removeWatcher);
  widget.onEnable(addWatcher);
  widget.onDestroy(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
    var idx, _iterator4, _step4, _step4$value, el, listener;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return waitForMutateTime();
        case 2:
          delDataNow(element, MC.PREFIX_ORIENTATION);
          delDataNow(element, PREFIX_IS_FULLSCREEN);
          delDataNow(element, PREFIX_USE_PARALLAX);
          delDataNow(element, PREFIX_CURRENT_PAGE);
          delDataNow(element, PREFIX_CURRENT_PAGE_IS_LAST);
          delDataNow(element, PREFIX_CURRENT_PAGE_IS_FIRST_ENABLED);
          delDataNow(element, PREFIX_CURRENT_PAGE_IS_LAST_ENABLED);
          delDataNow(element, PREFIX_TOTAL_PAGES);
          delStylePropNow(element, VAR_CURRENT_PAGE);
          delStylePropNow(element, VAR_TOTAL_PAGES);
          for (idx = 0; idx < MH.lengthOf(pages); idx++) {
            removeClassesNow(pages[idx], PREFIX_PAGE);
            _iterator4 = _createForOfIteratorHelper([[pages[idx], null], [toggles[idx], toggleClickListener], [switches[idx], switchClickListener]]);
            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                _step4$value = _slicedToArray(_step4.value, 2), el = _step4$value[0], listener = _step4$value[1];
                if (el) {
                  delDataNow(el, PREFIX_PAGE_STATE);
                  delDataNow(el, PREFIX_PAGE_NUMBER);
                  delStylePropNow(el, VAR_PAGE_NUMBER);
                  if (listener) {
                    removeEventListenerFrom(el, MC.S_CLICK, listener);
                  }
                }
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
            MH.delAttr(pages[idx], S_ARIA_CURRENT);
          }
          if (nextSwitch) {
            removeEventListenerFrom(nextSwitch, MC.S_CLICK, nextSwitchClickListener);
          }
          if (prevSwitch) {
            removeEventListenerFrom(prevSwitch, MC.S_CLICK, prevSwitchClickListener);
          }
          removeClassesNow(element, PREFIX_ROOT);
          if (pageContainer) {
            removeClassesNow(pageContainer, PREFIX_PAGE_CONTAINER);
          }
        case 17:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  })));
  addWatcher();
  addClasses(element, PREFIX_ROOT);
  if (pageContainer) {
    addClasses(pageContainer, PREFIX_PAGE_CONTAINER);
  }
  var numPages = MH.lengthOf(pages);
  setData(element, MC.PREFIX_ORIENTATION, orientation);
  setBoolData(element, PREFIX_IS_FULLSCREEN, isFullscreen);
  setBoolData(element, PREFIX_USE_PARALLAX, isParallax);
  setData(element, PREFIX_TOTAL_PAGES, numPages + "");
  setStyleProp(element, VAR_TOTAL_PAGES, (numPages || 1) + "");
  var _iterator5 = _createForOfIteratorHelper(pages),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var page = _step5.value;
      disableInitialTransition(page);
      addClasses(page, PREFIX_PAGE);
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
  for (var idx = 0; idx < numPages; idx++) {
    setPageNumber(components, idx + 1);
    setPageState(components, idx + 1, S_NEXT);
    var _iterator6 = _createForOfIteratorHelper([[toggles[idx], toggleClickListener], [switches[idx], switchClickListener]]),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var _step6$value = _slicedToArray(_step6.value, 2),
          el = _step6$value[0],
          listener = _step6$value[1];
        if (el) {
          addEventListenerTo(el, MC.S_CLICK, listener);
        }
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
  }
  if (nextSwitch) {
    addEventListenerTo(nextSwitch, MC.S_CLICK, nextSwitchClickListener);
  }
  if (prevSwitch) {
    addEventListenerTo(prevSwitch, MC.S_CLICK, prevSwitchClickListener);
  }
  if (initialPage < 1 || initialPage > numPages) {
    initialPage = 1;
  }
  methods._goToPage(initialPage);
};
var getMethods = function getMethods(widget, components, element, config) {
  var pages = components._pages;
  var scrollWatcher = ScrollWatcher.reuse();
  var isFullscreen = config === null || config === void 0 ? void 0 : config.fullscreen;
  var disabledPages = {};
  var callbacks = MH.newSet();
  var fetchScrollOptions = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return fetchClosestScrollable(element);
          case 2:
            _context4.t0 = _context4.sent;
            return _context4.abrupt("return", {
              scrollable: _context4.t0,
              asFractionOf: "visible",
              weCanInterrupt: true
            });
          case 4:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    return function fetchScrollOptions() {
      return _ref4.apply(this, arguments);
    };
  }();
  var currPageNum = -1;
  var lastPageNum = -1;
  var lastTransition = 0;
  var canTransition = function canTransition(gestureData) {
    if (widget.isDisabled()) {
      return false;
    }
    if ((gestureData === null || gestureData === void 0 ? void 0 : gestureData.device) !== MC.S_WHEEL) {
      return true;
    }
    var timeNow = MH.timeNow();
    if (timeNow - lastTransition > MIN_TIME_BETWEEN_WHEEL) {
      lastTransition = timeNow;
      return true;
    }
    return false;
  };
  var goToPage = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(pageNum, gestureData) {
      var numPages, _iterator7, _step7, callback, n;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            pageNum = toInt(pageNum, -1);
            if (!(pageNum === currPageNum || !canTransition(gestureData))) {
              _context5.next = 3;
              break;
            }
            return _context5.abrupt("return");
          case 3:
            numPages = MH.lengthOf(pages);
            if (!(currPageNum === 1 && pageNum === 0 || currPageNum === numPages && pageNum === numPages + 1)) {
              _context5.next = 13;
              break;
            }
            if (!isFullscreen) {
              _context5.next = 12;
              break;
            }
            _context5.t0 = scrollWatcher;
            _context5.t1 = pageNum ? (gestureData === null || gestureData === void 0 ? void 0 : gestureData.direction) === MC.S_RIGHT ? MC.S_RIGHT : MC.S_DOWN : (gestureData === null || gestureData === void 0 ? void 0 : gestureData.direction) === MC.S_LEFT ? MC.S_LEFT : MC.S_UP;
            _context5.next = 10;
            return fetchScrollOptions();
          case 10:
            _context5.t2 = _context5.sent;
            _context5.t0.scroll.call(_context5.t0, _context5.t1, _context5.t2);
          case 12:
            return _context5.abrupt("return");
          case 13:
            if (!(isPageDisabled(pageNum) || pageNum < 1 || pageNum > numPages)) {
              _context5.next = 15;
              break;
            }
            return _context5.abrupt("return");
          case 15:
            lastPageNum = currPageNum > 0 ? currPageNum : pageNum;
            currPageNum = pageNum;
            _iterator7 = _createForOfIteratorHelper(callbacks);
            _context5.prev = 18;
            _iterator7.s();
          case 20:
            if ((_step7 = _iterator7.n()).done) {
              _context5.next = 26;
              break;
            }
            callback = _step7.value;
            _context5.next = 24;
            return callback.invoke(widget);
          case 24:
            _context5.next = 20;
            break;
          case 26:
            _context5.next = 31;
            break;
          case 28:
            _context5.prev = 28;
            _context5.t3 = _context5["catch"](18);
            _iterator7.e(_context5.t3);
          case 31:
            _context5.prev = 31;
            _iterator7.f();
            return _context5.finish(31);
          case 34:
            MH.delAttr(pages[lastPageNum - 1], S_ARIA_CURRENT);
            for (n = lastPageNum; n !== currPageNum; currPageNum < lastPageNum ? n-- : n++) {
              if (!isPageDisabled(n)) {
                setPageState(components, n, currPageNum < lastPageNum ? S_NEXT : S_COVERED);
              }
            }
            setCurrentPage(element, currPageNum, numPages, isPageDisabled);
            MH.setAttr(pages[currPageNum - 1], S_ARIA_CURRENT);
            _context5.next = 40;
            return setPageState(components, currPageNum, S_CURRENT);
          case 40:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[18, 28, 31, 34]]);
    }));
    return function goToPage(_x4, _x5) {
      return _ref5.apply(this, arguments);
    };
  }();
  var nextPage = /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(gestureData) {
      var targetPage;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            targetPage = currPageNum + 1;
            while (isPageDisabled(targetPage)) {
              targetPage++;
            }
            return _context6.abrupt("return", goToPage(targetPage, gestureData));
          case 3:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    return function nextPage(_x6) {
      return _ref6.apply(this, arguments);
    };
  }();
  var prevPage = /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(gestureData) {
      var targetPage;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            targetPage = currPageNum - 1;
            while (isPageDisabled(targetPage)) {
              targetPage--;
            }
            return _context7.abrupt("return", goToPage(targetPage, gestureData));
          case 3:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    }));
    return function prevPage(_x7) {
      return _ref7.apply(this, arguments);
    };
  }();
  var isPageDisabled = function isPageDisabled(pageNum) {
    return disabledPages[pageNum] === true;
  };
  var disablePage = /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(pageNum) {
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            pageNum = toInt(pageNum);
            if (!(widget.isDisabled() || pageNum < 1 || pageNum > MH.lengthOf(pages))) {
              _context8.next = 3;
              break;
            }
            return _context8.abrupt("return");
          case 3:
            // set immediately for toggle to work without awaiting on it
            disabledPages[pageNum] = true;
            if (!(pageNum === currPageNum)) {
              _context8.next = 13;
              break;
            }
            _context8.next = 7;
            return prevPage();
          case 7:
            if (!(pageNum === currPageNum)) {
              _context8.next = 13;
              break;
            }
            _context8.next = 10;
            return nextPage();
          case 10:
            if (!(pageNum === currPageNum)) {
              _context8.next = 13;
              break;
            }
            disabledPages[pageNum] = false;
            return _context8.abrupt("return");
          case 13:
            setCurrentPage(element, currPageNum, MH.lengthOf(pages), isPageDisabled);
            _context8.next = 16;
            return setPageState(components, pageNum, MC.S_DISABLED);
          case 16:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    }));
    return function disablePage(_x8) {
      return _ref8.apply(this, arguments);
    };
  }();
  var enablePage = /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(pageNum) {
      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            pageNum = toInt(pageNum);
            if (!(widget.isDisabled() || !isPageDisabled(pageNum))) {
              _context9.next = 3;
              break;
            }
            return _context9.abrupt("return");
          case 3:
            // set immediately for toggle to work without awaiting on it
            disabledPages[pageNum] = false;
            setCurrentPage(element, currPageNum, MH.lengthOf(pages), isPageDisabled);
            _context9.next = 7;
            return setPageState(components, pageNum, pageNum < currPageNum ? S_COVERED : S_NEXT);
          case 7:
          case "end":
            return _context9.stop();
        }
      }, _callee9);
    }));
    return function enablePage(_x9) {
      return _ref9.apply(this, arguments);
    };
  }();
  var togglePage = function togglePage(pageNum) {
    return isPageDisabled(pageNum) ? enablePage(pageNum) : disablePage(pageNum);
  };
  var onTransition = function onTransition(handler) {
    return callbacks.add(wrapCallback(handler));
  };
  return {
    _nextPage: nextPage,
    _prevPage: prevPage,
    _goToPage: goToPage,
    _disablePage: disablePage,
    _enablePage: enablePage,
    _togglePage: togglePage,
    _isPageDisabled: isPageDisabled,
    _getCurrentPage: function _getCurrentPage() {
      return pages[currPageNum - 1];
    },
    _getPreviousPage: function _getPreviousPage() {
      return pages[lastPageNum - 1];
    },
    _getCurrentPageNum: function _getCurrentPageNum() {
      return MH.lengthOf(pages) > 0 ? currPageNum : 0;
    },
    _getPreviousPageNum: function _getPreviousPageNum() {
      return MH.lengthOf(pages) > 0 ? lastPageNum : 0;
    },
    _onTransition: onTransition
  };
};
//# sourceMappingURL=pager.js.map