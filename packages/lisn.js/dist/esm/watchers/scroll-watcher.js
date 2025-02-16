function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Watchers/ScrollWatcher
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { settings } from "../globals/settings.js";
import { getData, setNumericStyleProps } from "../utils/css-alter.js";
import { getMaxDeltaDirection } from "../utils/directions.js";
import { moveElement, wrapScrollingContent } from "../utils/dom-alter.js";
import { waitForMeasureTime } from "../utils/dom-optimize.js";
import { addEventListenerTo, removeEventListenerFrom } from "../utils/event.js";
import { logError } from "../utils/log.js";
import { toNonNegNum, maxAbs } from "../utils/math.js";
import { scrollTo, getCurrentScrollAction, getClientWidthNow, getClientHeightNow, tryGetMainScrollableElement, fetchMainContentElement as _fetchMainContentElement, fetchMainScrollableElement as _fetchMainScrollableElement, fetchScrollableElement, isValidScrollDirection } from "../utils/scroll.js";
import { objToStrKey } from "../utils/text.js";
import { validateStrList } from "../utils/validation.js";
import { wrapCallback } from "../modules/callback.js";
import { newXWeakMap } from "../modules/x-map.js";
import { DOMWatcher } from "./dom-watcher.js";
import { SizeWatcher } from "./size-watcher.js";
import debug from "../debug/debug.js";

// re-export for convenience

/**
 * {@link ScrollWatcher} listens for scroll events in any direction.
 *
 * It manages registered callbacks globally and reuses event listeners for more
 * efficient performance.
 */
export var ScrollWatcher = /*#__PURE__*/function () {
  function ScrollWatcher(config, key) {
    var _this = this;
    _classCallCheck(this, ScrollWatcher);
    /**
     * Call the given handler whenever the given scrollable is scrolled.
     *
     * Unless {@link OnScrollOptions.skipInitial} is true, the handler is also
     * called (almost) immediately with the latest scroll data. If a scroll has
     * not yet been observed on the scrollable and its `scrollTop` and
     * `scrollLeft` are 0, then the direction is {@link Types.NoDirection} and
     * the handler is only called if {@link Types.NoDirection} is part of the
     * supplied {@link OnScrollOptions.directions | options.directions} (or
     * {@link OnScrollOptions.directions | options.directions} is not given).
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same scrollable, even if the options differ. If the handler has already
     * been added for this scrollable, either using {@link trackScroll} or using
     * {@link onScroll}, then it will be removed and re-added with the current
     * options. So if previously it was also tracking content size changes using
     * {@link trackScroll}, it will no longer do so.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the options are invalid.
     */
    _defineProperty(this, "onScroll", void 0);
    /**
     * Removes a previously added handler.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the scrollable is invalid.
     */
    _defineProperty(this, "offScroll", void 0);
    /**
     * This everything that {@link onScroll} does plus more:
     *
     * In addition to a scroll event, the handler is also called when either the
     * offset size or scroll (content) size of the scrollable changes as that
     * would affect its `scrollTopFraction` and `scrollLeftFraction` and possibly
     * the `scrollTop` and `scrollLeft` as well.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same scrollable, even if the options differ. If the handler has already
     * been added for this scrollable, either using {@link trackScroll} or using
     * {@link onScroll}, then it will be removed and re-added with the current
     * options.
     *
     * ------
     *
     * If `handler` is not given, then it defaults to an internal handler that
     * updates a set of CSS variables on the scrollable element's style:
     *
     * - If {@link OnScrollOptions.scrollable | options.scrollable} is not given,
     *   or is `null`, `window` or `document`, the following CSS variables are
     *   set on the root (`html`) element and represent the scroll of the
     *   {@link fetchMainScrollableElement}:
     *   - `--lisn-js--page-scroll-top`
     *   - `--lisn-js--page-scroll-top-fraction`
     *   - `--lisn-js--page-scroll-left`
     *   - `--lisn-js--page-scroll-left-fraction`
     *   - `--lisn-js--page-scroll-width`
     *   - `--lisn-js--page-scroll-height`
     *
     * - Otherwise, the following variables are set on the scrollable itself,
     *   and represent its scroll offset:
     *   - `--lisn-js--scroll-top`
     *   - `--lisn-js--scroll-top-fraction`
     *   - `--lisn-js--scroll-left`
     *   - `--lisn-js--scroll-left-fraction`
     *   - `--lisn-js--scroll-width`
     *   - `--lisn-js--scroll-height`
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the options are invalid.
     */
    _defineProperty(this, "trackScroll", void 0);
    /**
     * Removes a previously added handler for {@link trackScroll}.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the scrollable is invalid.
     */
    _defineProperty(this, "noTrackScroll", void 0);
    /**
     * Get the scroll offset of the given scrollable. By default, it will
     * {@link waitForMeasureTime} and so will be delayed by one frame.
     *
     * @param {} realtime If true, it will not {@link waitForMeasureTime}. Use
     *                    this only when doing realtime scroll-based animations
     *                    as it may cause a forced layout.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the scrollable is invalid.
     */
    _defineProperty(this, "fetchCurrentScroll", void 0);
    /**
     * Scrolls the given scrollable element to in the given direction.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the direction or options are invalid.
     */
    _defineProperty(this, "scroll", void 0);
    /**
     * Scrolls the given scrollable element to the given `to` scrollable.
     *
     * Returns `null` if there's an ongoing scroll that is not cancellable.
     *
     * Note that if `to` is an element or a selector, then it _must_ be a
     * descendant of the scrollable element.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the "to" coordinates or options are invalid.
     *
     * @param {} to  If this is an element, then its top-left position is used as
     *               the target coordinates. If it is a string, then it is treated
     *               as a selector for an element using `querySelector`.
     * @param {} [options.scrollable]
     *               If not given, it defaults to {@link fetchMainScrollableElement}
     *
     * @return {} `null` if there's an ongoing scroll that is not cancellable,
     * otherwise a {@link ScrollAction}.
     */
    _defineProperty(this, "scrollTo", void 0);
    /**
     * Returns the current {@link ScrollAction} if any.
     *
     * @param {} scrollable
     *               If not given, it defaults to {@link fetchMainScrollableElement}
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the scrollable is invalid.
     */
    _defineProperty(this, "fetchCurrentScrollAction", void 0);
    /**
     * Cancels the ongoing scroll that's resulting from smooth scrolling
     * triggered in the past. Does not interrupt or prevent further scrolling.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the scrollable is invalid.
     *
     * @param {} [options.immediate]  If true, then it will not use
     *                                {@link waitForMeasureTime} or
     *                                {@link Utils.waitForMutateTime | waitForMutateTime}.
     *                                Warning: this will likely result in forced layout.
     */
    _defineProperty(this, "stopUserScrolling", void 0);
    if (key !== CONSTRUCTOR_KEY) {
      throw MH.illegalConstructorError("ScrollWatcher.create");
    }
    var logger = debug ? new debug.Logger({
      name: "ScrollWatcher",
      logAtCreation: config
    }) : null;
    var allScrollData = MH.newWeakMap();
    var activeListeners = MH.newWeakMap();
    var allCallbacks = newXWeakMap(function () {
      return MH.newMap();
    });

    // ----------

    var fetchCurrentScroll = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(element) {
        var realtime,
          isScrollEvent,
          previousEventData,
          latestData,
          _args = arguments;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              realtime = _args.length > 1 && _args[1] !== undefined ? _args[1] : false;
              isScrollEvent = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;
              // The scroll data can change event without a scroll event, e.g. by the
              // element changing size, so always get the latest here.
              previousEventData = allScrollData.get(element);
              _context.next = 5;
              return fetchScrollData(element, previousEventData, realtime);
            case 5:
              latestData = _context.sent;
              // If there hasn't been a scroll event, use the old scroll direction
              if (!isScrollEvent && previousEventData) {
                latestData.direction = previousEventData.direction;
              }
              return _context.abrupt("return", latestData);
            case 8:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function fetchCurrentScroll(_x) {
        return _ref.apply(this, arguments);
      };
    }();

    // ----------

    var createCallback = function createCallback(handler, options, trackType) {
      var _allCallbacks$get;
      var element = options._element;
      MH.remove((_allCallbacks$get = allCallbacks.get(element)) === null || _allCallbacks$get === void 0 || (_allCallbacks$get = _allCallbacks$get.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      debug: logger === null || logger === void 0 || logger.debug5("Adding/updating handler", options);
      var callback = wrapCallback(handler, options._debounceWindow);
      callback.onRemove(function () {
        deleteHandler(handler, options);
      });
      var entry = {
        _callback: callback,
        _trackType: trackType,
        _options: options
      };
      allCallbacks.sGet(element).set(handler, entry);
      return entry;
    };

    // ----------

    var setupOnScroll = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(handler, userOptions, trackType) {
        var options, element, entry, callback, eventTarget, scrollData, listenerOptions, directions;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return fetchOnScrollOptions(config, userOptions || {});
            case 2:
              options = _context2.sent;
              element = options._element; // Don't await for the scroll data before creating the callback so that
              // setupOnScroll and removeOnScroll have the same "timing" and therefore
              // calling onScroll and offScroll immediately without awaiting removes the
              // callback.
              entry = createCallback(handler, options, trackType);
              callback = entry._callback;
              eventTarget = options._eventTarget;
              _context2.next = 9;
              return fetchCurrentScroll(element, options._debounceWindow === 0);
            case 9:
              scrollData = _context2.sent;
              if (!callback.isRemoved()) {
                _context2.next = 12;
                break;
              }
              return _context2.abrupt("return");
            case 12:
              entry._data = scrollData;
              allScrollData.set(element, scrollData);
              if (!(trackType === TRACK_FULL)) {
                _context2.next = 17;
                break;
              }
              _context2.next = 17;
              return setupSizeTrack(entry);
            case 17:
              listenerOptions = activeListeners.get(eventTarget);
              if (!listenerOptions) {
                debug: logger === null || logger === void 0 || logger.debug4("Adding scroll listener", eventTarget);
                listenerOptions = {
                  _nRealtime: 0
                };
                activeListeners.set(eventTarget, listenerOptions);
                // Don't debounce the scroll handler, only the callbacks.
                addEventListenerTo(eventTarget, MC.S_SCROLL, scrollHandler);
              }
              if (options._debounceWindow === 0) {
                listenerOptions._nRealtime++;
              }
              directions = options._directions;
              if (!(!callback.isRemoved() && !(userOptions !== null && userOptions !== void 0 && userOptions.skipInitial) && directionMatches(directions, scrollData.direction))) {
                _context2.next = 25;
                break;
              }
              debug: logger === null || logger === void 0 || logger.debug5("Calling initially with", element, scrollData);
              // Use a one-off callback that's not debounced for the initial call.
              _context2.next = 25;
              return invokeCallback(wrapCallback(handler), element, scrollData);
            case 25:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      return function setupOnScroll(_x2, _x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }();

    // ----------

    var removeOnScroll = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(handler, scrollable, trackType) {
        var _allCallbacks$get2;
        var options, element, currEntry;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return fetchOnScrollOptions(config, {
                scrollable: scrollable
              });
            case 2:
              options = _context3.sent;
              element = options._element;
              currEntry = (_allCallbacks$get2 = allCallbacks.get(element)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2.get(handler);
              if ((currEntry === null || currEntry === void 0 ? void 0 : currEntry._trackType) === trackType) {
                MH.remove(currEntry._callback);
                if (handler === setScrollCssProps) {
                  // delete the properties
                  setScrollCssProps(element, null);
                }
              }
            case 6:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      return function removeOnScroll(_x5, _x6, _x7) {
        return _ref3.apply(this, arguments);
      };
    }();

    // ----------

    var deleteHandler = function deleteHandler(handler, options) {
      var element = options._element;
      var eventTarget = options._eventTarget;
      MH.deleteKey(allCallbacks.get(element), handler);
      allCallbacks.prune(element);
      var listenerOptions = activeListeners.get(eventTarget);
      if (listenerOptions && options._debounceWindow === 0) {
        listenerOptions._nRealtime--;
      }
      if (!allCallbacks.has(element)) {
        debug: logger === null || logger === void 0 || logger.debug4("No more callbacks for scrollable; removing listener", element);
        MH.deleteKey(allScrollData, element);
        removeEventListenerFrom(eventTarget, MC.S_SCROLL, scrollHandler);
        MH.deleteKey(activeListeners, eventTarget);
      }
    };

    // ----------

    var setupSizeTrack = /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(entry) {
        var options, element, scrollCallback, doc, docScrollingElement, resizeCallback, sizeWatcher, setupOnResize, observedElements, allowedToWrap, wrapper, _iterator, _step, child, domWatcher, onAddedCallback;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              options = entry._options;
              element = options._element;
              scrollCallback = entry._callback;
              debug: logger === null || logger === void 0 || logger.debug8("Setting up size tracking", element);
              doc = MH.getDoc();
              docScrollingElement = MH.getDocScrollingElement();
              resizeCallback = wrapCallback(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
                var latestData, thresholdsExceeded;
                return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                  while (1) switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.next = 2;
                      return fetchCurrentScroll(element);
                    case 2:
                      latestData = _context4.sent;
                      thresholdsExceeded = hasExceededThreshold(options, latestData, entry._data);
                      if (thresholdsExceeded) {
                        _context4.next = 8;
                        break;
                      }
                      debug: logger === null || logger === void 0 || logger.debug9("Threshold not exceeded", options, latestData, entry._data);
                      _context4.next = 11;
                      break;
                    case 8:
                      if (scrollCallback.isRemoved()) {
                        _context4.next = 11;
                        break;
                      }
                      _context4.next = 11;
                      return invokeCallback(scrollCallback, element, latestData);
                    case 11:
                    case "end":
                      return _context4.stop();
                  }
                }, _callee4);
              })));
              scrollCallback.onRemove(resizeCallback.remove);

              // Don't use default instance as it has a high threshold.
              sizeWatcher = SizeWatcher.reuse();
              setupOnResize = function setupOnResize(target) {
                return sizeWatcher.onResize(resizeCallback, _defineProperty(_defineProperty({
                  target: target
                }, MC.S_DEBOUNCE_WINDOW, options._debounceWindow), "threshold", options._threshold));
              };
              if (!(element === docScrollingElement)) {
                _context5.next = 14;
                break;
              }
              // In case we're tracking the main document scroll, then we only need to
              // observe the viewport size and the size of the documentElement (which is
              // the content size).

              setupOnResize(); // viewport size
              setupOnResize(doc); // content size
              return _context5.abrupt("return");
            case 14:
              // ResizeObserver only detects changes in offset width/height which is
              // the visible size of the scrolling element, and that is not affected by the
              // size of its content.
              // But we also need to detect changes in the scroll width/height which is
              // the size of the content.
              // We also need to keep track of elements being added to the scrollable element.
              observedElements = MH.newSet([element]); // Observe the scrolling element
              setupOnResize(element);

              // And also its children (if possible, single wrapper around children
              allowedToWrap = settings.contentWrappingAllowed === true && element !== docScrollingElement && getData(element, MC.PREFIX_NO_WRAP) === null;
              if (!allowedToWrap) {
                _context5.next = 25;
                break;
              }
              _context5.next = 20;
              return wrapScrollingContent(element);
            case 20:
              wrapper = _context5.sent;
              setupOnResize(wrapper);
              observedElements.add(wrapper);

              //
              _context5.next = 27;
              break;
            case 25:
              _iterator = _createForOfIteratorHelper(MH.childrenOf(element));
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  child = _step.value;
                  setupOnResize(child);
                  observedElements.add(child);
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
            case 27:
              // Watch for newly added elements
              domWatcher = DOMWatcher.create({
                root: element,
                // only direct children
                subtree: false
              });
              onAddedCallback = wrapCallback(function (operation) {
                var child = MH.currentTargetOf(operation);
                // If we've just added the wrapper, it will be in DOMWatcher's queue,
                // so check.
                if (child !== wrapper) {
                  if (allowedToWrap) {
                    // Move this child into the wrapper. If this results in change of size
                    // for wrapper, SizeWatcher will call us.
                    moveElement(child, {
                      to: wrapper,
                      ignoreMove: true
                    });
                  } else {
                    // Track the size of this child.
                    // Don't skip initial, call the callback now
                    setupOnResize(child);
                    observedElements.add(child);
                  }
                }
              });
              domWatcher.onMutation(onAddedCallback, {
                categories: [MC.S_ADDED]
              });
              resizeCallback.onRemove(onAddedCallback.remove);
            case 31:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      return function setupSizeTrack(_x8) {
        return _ref4.apply(this, arguments);
      };
    }();

    // ----------

    var scrollHandler = /*#__PURE__*/function () {
      var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(event) {
        var _activeListeners$get, _allCallbacks$get3;
        var scrollable, element, realtime, latestData, _iterator2, _step2, entry, _options, thresholdsExceeded;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              // We cannot use event.currentTarget because scrollHandler is called inside
              // a setTimeout so by that time, currentTarget is null or something else.
              //
              // However, target and currentTarget only differ when the event is in the
              // bubbling or capturing phase. Because
              //
              // - the scroll event only bubbles when fired on document, and (it only
              //   bubbles up to window)
              // - and we never attach the listener to the capturing phase
              // - and we always use document instead of window to listen for scroll on
              //   document
              //
              // then event.target suffices.
              scrollable = MH.targetOf(event);
              /* istanbul ignore next */
              if (!(!scrollable || !(MH.isElement(scrollable) || MH.isDoc(scrollable)))) {
                _context6.next = 3;
                break;
              }
              return _context6.abrupt("return");
            case 3:
              _context6.next = 5;
              return fetchScrollableElement(scrollable);
            case 5:
              element = _context6.sent;
              realtime = (((_activeListeners$get = activeListeners.get(scrollable)) === null || _activeListeners$get === void 0 ? void 0 : _activeListeners$get._nRealtime) || 0) > 0;
              _context6.next = 9;
              return fetchCurrentScroll(element, realtime, true);
            case 9:
              latestData = _context6.sent;
              allScrollData.set(element, latestData);
              debug: logger === null || logger === void 0 || logger.debug9("Scroll event", element, latestData);
              _iterator2 = _createForOfIteratorHelper(((_allCallbacks$get3 = allCallbacks.get(element)) === null || _allCallbacks$get3 === void 0 ? void 0 : _allCallbacks$get3.values()) || []);
              _context6.prev = 13;
              _iterator2.s();
            case 15:
              if ((_step2 = _iterator2.n()).done) {
                _context6.next = 29;
                break;
              }
              entry = _step2.value;
              // Consider the direction since the last scroll event and not the
              // direction based on the largest delta the last time the callback
              // was called.
              _options = entry._options;
              thresholdsExceeded = hasExceededThreshold(_options, latestData, entry._data);
              if (thresholdsExceeded) {
                _context6.next = 22;
                break;
              }
              debug: logger === null || logger === void 0 || logger.debug9("Threshold not exceeded", _options, latestData, entry._data);
              return _context6.abrupt("continue", 27);
            case 22:
              // If threshold has been exceeded, always update the latest data for
              // this callback.
              entry._data = latestData;
              if (directionMatches(_options._directions, latestData.direction)) {
                _context6.next = 26;
                break;
              }
              debug: logger === null || logger === void 0 || logger.debug9("Direction does not match", _options, latestData);
              return _context6.abrupt("continue", 27);
            case 26:
              invokeCallback(entry._callback, element, latestData);
            case 27:
              _context6.next = 15;
              break;
            case 29:
              _context6.next = 34;
              break;
            case 31:
              _context6.prev = 31;
              _context6.t0 = _context6["catch"](13);
              _iterator2.e(_context6.t0);
            case 34:
              _context6.prev = 34;
              _iterator2.f();
              return _context6.finish(34);
            case 37:
            case "end":
              return _context6.stop();
          }
        }, _callee6, null, [[13, 31, 34, 37]]);
      }));
      return function scrollHandler(_x9) {
        return _ref6.apply(this, arguments);
      };
    }();

    // ----------

    this.fetchCurrentScroll = function (scrollable, realtime) {
      return fetchScrollableElement(scrollable).then(function (element) {
        return fetchCurrentScroll(element, realtime);
      });
    };

    // ----------

    this.scroll = function (direction) {
      var _options$amount;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!isValidScrollDirection(direction)) {
        throw MH.usageError("Unknown scroll direction: '".concat(direction, "'"));
      }
      var isVertical = direction === MC.S_UP || direction === MC.S_DOWN;
      var sign = direction === MC.S_UP || direction === MC.S_LEFT ? -1 : 1;
      var targetCoordinate;
      var amount = (_options$amount = options.amount) !== null && _options$amount !== void 0 ? _options$amount : 100;
      var asFractionOf = options.asFractionOf;
      if (asFractionOf === "visible") {
        targetCoordinate = isVertical ? function (el) {
          return el[MC.S_SCROLL_TOP] + sign * amount * getClientHeightNow(el) / 100;
        } : function (el) {
          return el[MC.S_SCROLL_LEFT] + sign * amount * getClientWidthNow(el) / 100;
        };

        //
      } else if (asFractionOf === "content") {
        targetCoordinate = isVertical ? function (el) {
          return el[MC.S_SCROLL_TOP] + sign * amount * el[MC.S_SCROLL_HEIGHT] / 100;
        } : function (el) {
          return el[MC.S_SCROLL_LEFT] + sign * amount * el[MC.S_SCROLL_WIDTH] / 100;
        };

        //
      } else if (asFractionOf !== undefined && asFractionOf !== "pixel") {
        throw MH.usageError("Unknown 'asFractionOf' keyword: '".concat(asFractionOf, "'"));

        //
      } else {
        targetCoordinate = isVertical ? function (el) {
          return el[MC.S_SCROLL_TOP] + sign * amount;
        } : function (el) {
          return el[MC.S_SCROLL_LEFT] + sign * amount;
        };
      }
      var target = isVertical ? {
        top: targetCoordinate
      } : {
        left: targetCoordinate
      };
      return _this.scrollTo(target, options);
    };

    // ----------

    this.scrollTo = /*#__PURE__*/function () {
      var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(to) {
        var options,
          _args7 = arguments;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              options = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : {};
              _context7.t0 = scrollTo;
              _context7.t1 = to;
              _context7.t2 = MH;
              _context7.t3 = {
                duration: config._scrollDuration
              };
              _context7.t4 =
              // default
              options;
              _context7.next = 8;
              return fetchScrollableElement(options.scrollable);
            case 8:
              _context7.t5 = _context7.sent;
              _context7.t6 = {
                scrollable: _context7.t5
              };
              _context7.t7 = _context7.t2.merge.call(_context7.t2, _context7.t3, _context7.t4, _context7.t6);
              return _context7.abrupt("return", (0, _context7.t0)(_context7.t1, _context7.t7));
            case 12:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      }));
      return function (_x10) {
        return _ref7.apply(this, arguments);
      };
    }();

    // ----------

    this.fetchCurrentScrollAction = function (scrollable) {
      return fetchScrollableElement(scrollable).then(function (element) {
        return getCurrentScrollAction(element);
      });
    };

    // ----------

    this.stopUserScrolling = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
      var options,
        element,
        stopScroll,
        _args8 = arguments;
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            options = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : {};
            _context8.next = 3;
            return fetchScrollableElement(options.scrollable);
          case 3:
            element = _context8.sent;
            stopScroll = function stopScroll() {
              return MH.elScrollTo(element, {
                top: element[MC.S_SCROLL_TOP],
                left: element[MC.S_SCROLL_LEFT]
              });
            };
            if (options.immediate) {
              stopScroll();
            } else {
              waitForMeasureTime().then(stopScroll);
            }
          case 6:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    }));

    // ----------

    this.trackScroll = function (handler, options) {
      if (!handler) {
        handler = setScrollCssProps;
      }
      return setupOnScroll(handler, options, TRACK_FULL);
    };

    // ----------

    this.noTrackScroll = function (handler, scrollable) {
      if (!handler) {
        handler = setScrollCssProps;
      }
      removeOnScroll(handler, scrollable, TRACK_FULL); // no need to await
    };

    // ----------

    this.onScroll = function (handler, options) {
      return setupOnScroll(handler, options, TRACK_REGULAR);
    };

    // ----------

    this.offScroll = function (handler, scrollable) {
      removeOnScroll(handler, scrollable, TRACK_REGULAR); // no need to await
    };
  }
  return _createClass(ScrollWatcher, null, [{
    key: "fetchMainContentElement",
    value:
    /**
     * Returns the element that holds the main page content. By default it's
     * `document.body` but is overridden by
     * {@link settings.mainScrollableElementSelector}.
     *
     * It will wait for the element to be available if not already.
     */
    function fetchMainContentElement() {
      return _fetchMainContentElement();
    }

    /**
     * Returns the scrollable element that holds the wrapper around the main page
     * content. By default it's `document.scrollable` (unless `document.body` is
     * actually scrollable, in which case it will be used) but it will be
     * different if {@link settings.mainScrollableElementSelector} is set.
     *
     * It will wait for the element to be available if not already.
     */
  }, {
    key: "fetchMainScrollableElement",
    value: function fetchMainScrollableElement() {
      return _fetchMainScrollableElement();
    }

    /**
     * Creates a new instance of ScrollWatcher with the given
     * {@link ScrollWatcherConfig}. It does not save it for future reuse.
     */
  }, {
    key: "create",
    value: function create() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new ScrollWatcher(getConfig(config), CONSTRUCTOR_KEY);
    }

    /**
     * Returns an existing instance of ScrollWatcher with the given
     * {@link ScrollWatcherConfig}, or creates a new one.
     *
     * **NOTE:** It saves it for future reuse, so don't use this for temporary
     * short-lived watchers.
     */
  }, {
    key: "reuse",
    value: function reuse() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var myConfig = getConfig(config);
      var configStrKey = objToStrKey(myConfig);
      var instance = instances.get(configStrKey);
      if (!instance) {
        instance = new ScrollWatcher(myConfig, CONSTRUCTOR_KEY);
        instances.set(configStrKey, instance);
      }
      return instance;
    }
  }]);
}();

/**
 * @interface
 */

/**
 * @interface
 */

/**
 * @interface
 */

/**
 * The handler is invoked with two arguments:
 *
 * - the element that has been resized
 * - the {@link ScrollData} for the element
 */

// ----------------------------------------

var CONSTRUCTOR_KEY = MC.SYMBOL();
var instances = MH.newMap();
var getConfig = function getConfig(config) {
  return {
    _debounceWindow: toNonNegNum(config[MC.S_DEBOUNCE_WINDOW], 75),
    // If threshold is 0, internally treat as 1 (pixel)
    _scrollThreshold: toNonNegNum(config.scrollThreshold, 50) || 1,
    _scrollDuration: toNonNegNum(config.scrollDuration, 1000)
  };
};
var TRACK_REGULAR = 1; // only scroll events
var TRACK_FULL = 2; // scroll + resizing of content and/or wrapper

// --------------------

var fetchOnScrollOptions = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(config, options) {
    var _options$MC$S_DEBOUNC;
    var directions, element;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          directions = validateStrList("directions", options.directions, isValidScrollDirection) || null;
          _context9.next = 3;
          return fetchScrollableElement(options.scrollable);
        case 3:
          element = _context9.sent;
          return _context9.abrupt("return", {
            _element: element,
            _eventTarget: getEventTarget(element),
            _directions: directions,
            // If threshold is 0, internally treat as 1 (pixel)
            _threshold: toNonNegNum(options.threshold, config._scrollThreshold) || 1,
            _debounceWindow: (_options$MC$S_DEBOUNC = options[MC.S_DEBOUNCE_WINDOW]) !== null && _options$MC$S_DEBOUNC !== void 0 ? _options$MC$S_DEBOUNC : config._debounceWindow
          });
        case 5:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return function fetchOnScrollOptions(_x11, _x12) {
    return _ref9.apply(this, arguments);
  };
}();
var directionMatches = function directionMatches(userDirections, latestDirection) {
  return !userDirections || MH.includes(userDirections, latestDirection);
};
var hasExceededThreshold = function hasExceededThreshold(options, latestData, lastThresholdData) {
  var directions = options._directions;
  var threshold = options._threshold;
  if (!lastThresholdData) {
    /* istanbul ignore */
    return false;
  }
  var topDiff = maxAbs(latestData[MC.S_SCROLL_TOP] - lastThresholdData[MC.S_SCROLL_TOP], latestData[MC.S_SCROLL_HEIGHT] - lastThresholdData[MC.S_SCROLL_HEIGHT], latestData[MC.S_CLIENT_HEIGHT] - lastThresholdData[MC.S_CLIENT_HEIGHT]);
  var leftDiff = maxAbs(latestData[MC.S_SCROLL_LEFT] - lastThresholdData[MC.S_SCROLL_LEFT], latestData[MC.S_SCROLL_WIDTH] - lastThresholdData[MC.S_SCROLL_WIDTH], latestData[MC.S_CLIENT_WIDTH] - lastThresholdData[MC.S_CLIENT_WIDTH]);

  // If the callback is only interested in up/down, then only check the
  // scrollTop delta, and similarly for left/right.
  var checkTop = false,
    checkLeft = false;
  if (!directions || MH.includes(directions, MC.S_NONE) || MH.includes(directions, MC.S_AMBIGUOUS)) {
    checkTop = checkLeft = true;
  } else {
    if (MH.includes(directions, MC.S_UP) || MH.includes(directions, MC.S_DOWN)) {
      checkTop = true;
    }
    if (MH.includes(directions, MC.S_LEFT) || MH.includes(directions, MC.S_RIGHT)) {
      checkLeft = true;
    }
  }
  return checkTop && topDiff >= threshold || checkLeft && leftDiff >= threshold;
};
var fetchScrollData = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(element, previousEventData, realtime) {
    var scrollTop, scrollLeft, scrollWidth, scrollHeight, clientWidth, clientHeight, scrollTopFraction, scrollLeftFraction, prevScrollTop, prevScrollLeft, direction;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          if (realtime) {
            _context10.next = 3;
            break;
          }
          _context10.next = 3;
          return waitForMeasureTime();
        case 3:
          scrollTop = MH.ceil(element[MC.S_SCROLL_TOP]);
          scrollLeft = MH.ceil(element[MC.S_SCROLL_LEFT]);
          scrollWidth = element[MC.S_SCROLL_WIDTH];
          scrollHeight = element[MC.S_SCROLL_HEIGHT];
          clientWidth = getClientWidthNow(element);
          clientHeight = getClientHeightNow(element);
          scrollTopFraction = MH.round(scrollTop) / (scrollHeight - clientHeight || MC.INFINITY);
          scrollLeftFraction = MH.round(scrollLeft) / (scrollWidth - clientWidth || MC.INFINITY);
          prevScrollTop = (previousEventData === null || previousEventData === void 0 ? void 0 : previousEventData.scrollTop) || 0;
          prevScrollLeft = (previousEventData === null || previousEventData === void 0 ? void 0 : previousEventData.scrollLeft) || 0;
          direction = getMaxDeltaDirection(scrollLeft - prevScrollLeft, scrollTop - prevScrollTop);
          return _context10.abrupt("return", _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({
            direction: direction
          }, MC.S_SCROLL_TOP, scrollTop), MC.S_SCROLL_TOP_FRACTION, scrollTopFraction), MC.S_SCROLL_LEFT, scrollLeft), MC.S_SCROLL_LEFT_FRACTION, scrollLeftFraction), MC.S_SCROLL_WIDTH, scrollWidth), MC.S_SCROLL_HEIGHT, scrollHeight), MC.S_CLIENT_WIDTH, clientWidth), MC.S_CLIENT_HEIGHT, clientHeight));
        case 15:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return function fetchScrollData(_x13, _x14, _x15) {
    return _ref10.apply(this, arguments);
  };
}();
var setScrollCssProps = function setScrollCssProps(element, scrollData) {
  var prefix = "";
  if (element === tryGetMainScrollableElement()) {
    // Set the CSS vars on the root element
    element = MH.getDocElement();
    prefix = "page-";
  }
  scrollData = scrollData || {};
  var props = _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, MC.S_SCROLL_TOP, scrollData[MC.S_SCROLL_TOP]), MC.S_SCROLL_TOP_FRACTION, scrollData[MC.S_SCROLL_TOP_FRACTION]), MC.S_SCROLL_LEFT, scrollData[MC.S_SCROLL_LEFT]), MC.S_SCROLL_LEFT_FRACTION, scrollData[MC.S_SCROLL_LEFT_FRACTION]), MC.S_SCROLL_WIDTH, scrollData[MC.S_SCROLL_WIDTH]), MC.S_SCROLL_HEIGHT, scrollData[MC.S_SCROLL_HEIGHT]);
  setNumericStyleProps(element, props, {
    _prefix: prefix
  });
};
var getEventTarget = function getEventTarget(element) {
  if (element === MH.getDocScrollingElement()) {
    return MH.getDoc();
  }
  return element;
};
var invokeCallback = function invokeCallback(callback, element, scrollData) {
  return callback.invoke(element, MH.copyObject(scrollData))["catch"](logError);
};
//# sourceMappingURL=scroll-watcher.js.map