"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewWatcher = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _cssAlter = require("../utils/css-alter.cjs");
var _domEvents = require("../utils/dom-events.cjs");
var _domOptimize = require("../utils/dom-optimize.cjs");
var _log = require("../utils/log.cjs");
var _misc = require("../utils/misc.cjs");
var _overlays = require("../utils/overlays.cjs");
var _scroll = require("../utils/scroll.cjs");
var _size = require("../utils/size.cjs");
var _text = require("../utils/text.cjs");
var _views = require("../utils/views.cjs");
var _callback = require("../modules/callback.cjs");
var _xMap = require("../modules/x-map.cjs");
var _xIntersectionObserver = require("../modules/x-intersection-observer.cjs");
var _domWatcher = require("./dom-watcher.cjs");
var _scrollWatcher = require("./scroll-watcher.cjs");
var _sizeWatcher = require("./size-watcher.cjs");
var _debug = _interopRequireDefault(require("../debug/debug.cjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Watchers/ViewWatcher
 */
/**
 * {@link ViewWatcher} monitors the position of a given target relative to the
 * given {@link ViewWatcherConfig.root | root} or the viewport.
 *
 * It's built on top of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver | IntersectionObserver}.
 *
 * It manages registered callbacks globally and reuses IntersectionObservers
 * for more efficient performance.
 */
var ViewWatcher = exports.ViewWatcher = /*#__PURE__*/function () {
  function ViewWatcher(config, key) {
    _classCallCheck(this, ViewWatcher);
    /**
     * Call the given handler whenever the {@link ViewWatcherConfig.root | root}'s
     * view relative to the target position changes, i.e. when the target enters
     * or leaves the root.
     *
     * Unless {@link OnViewOptions.skipInitial} is true, the handler is also
     * called (almost) immediately with the current view if it matches this
     * set of options*.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same target, even if the options differ. If the handler has already been
     * added for this target, either using {@link trackView} or using
     * {@link onView}, then it will be removed and re-added with the current
     * options. So if previously it was also tracking position across root
     * using {@link trackView}, it will no longer do so.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target or the options are invalid.
     */
    _defineProperty(this, "onView", void 0);
    /**
     * Removes a previously added handler.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target is invalid.
     */
    _defineProperty(this, "offView", void 0);
    /**
     * This does more than just {@link onView}. The difference is that in
     * addition to a change of {@link View}, such as the target entering or
     * leaving the ViewWatcher's {@link ViewWatcherConfig.root | root} (by
     * default the viewport), the handler is also called each time the target's
     * relative view changes _while inside the root_.
     *
     * A change of relative position happens when:
     * - the target is resized
     * - the root is resized
     * - the any of the target's scrollable ancestors is scrolled
     * - the target's attributes changed that resulted in a change of position
     *
     * All of the above are accounted for. Internally it uses
     * {@link ScrollWatcher}, {@link DOMWatcher} and {@link SizeWatcher} to keep
     * track of all of this.
     *
     * If the target is leaves the ViewWatcher's
     * {@link ViewWatcherConfig.root | root}, the handler will be called with
     * the {@link ViewData}, and the above events will stop being tracked until
     * the target enters the watcher's root again.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same target, even if the options differ. If the handler has already been
     * added for this target, either using {@link trackView} or using
     * {@link onView}, then it will be removed and re-added with the current
     * options.
     *
     * ------
     *
     * If `handler` is not given, then it defaults to an internal handler that
     * updates the following set of CSS variables on the target's style and
     * represent its relative position:
     *
     * - `--lisn-js--r-top`
     * - `--lisn-js--r-bottom`
     * - `--lisn-js--r-left`
     * - `--lisn-js--r-right`
     * - `--lisn-js--r-width`
     * - `--lisn-js--r-height`
     * - `--lisn-js--r-h-middle`
     * - `--lisn-js--r-v-middle`
     *
     * See {@link ViewData.relative} for an explanation of each.
     *
     * Note that only Element targets are supported here and not offsets.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target or "views" are invalid.
     */
    _defineProperty(this, "trackView", void 0);
    /**
     * Removes a previously added handler for {@link trackView}.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target is invalid.
     */
    _defineProperty(this, "noTrackView", void 0);
    /**
     * Get the current view relative to the target. By default, it will
     * {@link waitForMeasureTime} and so will be delayed by one frame.
     *
     * @param {} realtime If true, it will not {@link waitForMeasureTime}. Use
     *                    this only when doing realtime scroll-based animations
     *                    as it may cause a forced layout.
     */
    _defineProperty(this, "fetchCurrentView", void 0);
    if (key !== CONSTRUCTOR_KEY) {
      throw MH.illegalConstructorError("ViewWatcher.create");
    }
    var logger = _debug["default"] ? new _debug["default"].Logger({
      name: "ViewWatcher",
      logAtCreation: config
    }) : null;
    var allViewData = MH.newWeakMap();
    var allCallbacks = (0, _xMap.newXWeakMap)(function () {
      return MH.newMap();
    });
    var intersectionHandler = function intersectionHandler(entries) {
      debug: logger === null || logger === void 0 || logger.debug9("Got ".concat(entries.length, " new entries"), entries);
      var _iterator = _createForOfIteratorHelper(entries),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;
          processEntry(entry);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    };
    var observeOptions = {
      root: config._root,
      threshold: config._threshold,
      rootMargin: config._rootMargin
    };
    var xObserver = new _xIntersectionObserver.XIntersectionObserver(intersectionHandler, observeOptions);

    // ----------

    var fetchCurrentView = function fetchCurrentView(element) {
      var realtime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var fetchData = /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(entryOrElement) {
          var intersection, data;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return fetchIntersectionData(config, entryOrElement, realtime);
              case 2:
                intersection = _context.sent;
                _context.next = 5;
                return fetchViewData(intersection, realtime);
              case 5:
                data = _context.sent;
                return _context.abrupt("return", data);
              case 7:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }));
        return function fetchData(_x) {
          return _ref.apply(this, arguments);
        };
      }();
      if (realtime) {
        return fetchData(element);
      }
      return MH.newPromise(function (resolve) {
        // Use a temp IntersectionObserver
        var observer = MH.newIntersectionObserver(function (entries) {
          var promise = fetchData(entries[0]);
          observer.disconnect();
          promise.then(resolve);
        }, observeOptions);
        observer.observe(element);
      });
    };

    // ----------

    var createCallback = function createCallback(handler, options, trackType) {
      var _allCallbacks$get;
      var element = options._element;
      MH.remove((_allCallbacks$get = allCallbacks.get(element)) === null || _allCallbacks$get === void 0 || (_allCallbacks$get = _allCallbacks$get.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      debug: logger === null || logger === void 0 || logger.debug5("Adding/updating handler", options);
      var callback = (0, _callback.wrapCallback)(handler);
      callback.onRemove(function () {
        deleteHandler(handler, options);
      });
      allCallbacks.sGet(element).set(handler, {
        _callback: callback,
        _trackType: trackType,
        _options: options
      });
      return callback;
    };

    // ----------

    var setupOnView = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(target, handler, userOptions, trackType) {
        var options, element, callback, viewData;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return fetchOptions(config._root, target, userOptions);
            case 2:
              options = _context2.sent;
              element = options._element;
              callback = createCallback(handler, options, trackType); // View watcher should be used before the DOM is loaded since the initial
              // size of the root may be 0 or close to 0 and would lead to premature
              // triggering.
              _context2.next = 7;
              return (0, _domEvents.waitForInteractive)();
            case 7:
              _context2.next = 9;
              return fetchCurrentView(element);
            case 9:
              viewData = _context2.sent;
              if (!(viewData.rootBounds[MC.S_WIDTH] === 0 && viewData.rootBounds[MC.S_HEIGHT] === 0)) {
                _context2.next = 17;
                break;
              }
              // Possibly the root is being setup now, wait for one AF
              debug: logger === null || logger === void 0 || logger.debug5("Got zero root size, deferring for a bit", config._root);
              _context2.next = 14;
              return (0, _domOptimize.waitForSubsequentMeasureTime)();
            case 14:
              _context2.next = 16;
              return fetchCurrentView(element);
            case 16:
              viewData = _context2.sent;
            case 17:
              if (!(trackType === TRACK_FULL)) {
                _context2.next = 20;
                break;
              }
              _context2.next = 20;
              return setupInviewTrack(options, callback, viewData);
            case 20:
              if (!callback.isRemoved()) {
                _context2.next = 22;
                break;
              }
              return _context2.abrupt("return");
            case 22:
              // Always use observeLater to skip the initial call from the
              // IntersectionObserver, and call callbacks that have skipInitial: false
              // here. Otherwise, we can't tell from inside the intersectionHandler whether
              // a callback wants to skip its initial call or not.
              //
              // It's ok if already observed, won't do anything.
              xObserver.observeLater(element);
              if (userOptions !== null && userOptions !== void 0 && userOptions.skipInitial) {
                _context2.next = 28;
                break;
              }
              debug: logger === null || logger === void 0 || logger.debug5("Calling initially with", element, viewData);
              if (!(viewsToBitmask(viewData.views) & options._viewsBitmask)) {
                _context2.next = 28;
                break;
              }
              _context2.next = 28;
              return invokeCallback(callback, element, viewData);
            case 28:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      return function setupOnView(_x2, _x3, _x4, _x5) {
        return _ref2.apply(this, arguments);
      };
    }();

    // ----------

    var removeOnView = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(target, handler, trackType) {
        var _allCallbacks$get2;
        var options, element, currEntry;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return fetchOptions(config._root, target, {});
            case 2:
              options = _context3.sent;
              element = options._element;
              currEntry = (_allCallbacks$get2 = allCallbacks.get(element)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2.get(handler);
              if ((currEntry === null || currEntry === void 0 ? void 0 : currEntry._trackType) === trackType) {
                MH.remove(currEntry._callback);
                if (handler === setViewCssProps) {
                  // delete the properties
                  setViewCssProps(element, null);
                }
              }
            case 6:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      return function removeOnView(_x6, _x7, _x8) {
        return _ref3.apply(this, arguments);
      };
    }();

    // ----------

    var deleteHandler = function deleteHandler(handler, options) {
      var element = options._element;
      MH.deleteKey(allCallbacks.get(element), handler);
      allCallbacks.prune(element);
      if (!allCallbacks.has(element)) {
        debug: logger === null || logger === void 0 || logger.debug4("No more callbacks for target; unobserving", element);
        xObserver.unobserve(element);
        MH.deleteKey(allViewData, element);
      }
    };

    // ----------

    var processEntry = /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(entry) {
        var _allCallbacks$get3;
        var element, intersection, latestData, viewsBitmask, _iterator2, _step2, _entry;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              // In reality, it can't be just a base Element
              element = MH.targetOf(entry); // This doesn't need to be "realtime", since IntersectionObserver alone
              // introduces a delay.
              _context4.next = 3;
              return fetchIntersectionData(config, entry);
            case 3:
              intersection = _context4.sent;
              _context4.next = 6;
              return fetchViewData(intersection);
            case 6:
              latestData = _context4.sent;
              debug: logger === null || logger === void 0 || logger.debug9("Got ViewData", element, latestData);
              viewsBitmask = viewsToBitmask(latestData.views);
              _iterator2 = _createForOfIteratorHelper(((_allCallbacks$get3 = allCallbacks.get(element)) === null || _allCallbacks$get3 === void 0 ? void 0 : _allCallbacks$get3.values()) || []);
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  _entry = _step2.value;
                  if (viewsBitmask & _entry._options._viewsBitmask) {
                    invokeCallback(_entry._callback, element, latestData);
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
            case 11:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      return function processEntry(_x9) {
        return _ref4.apply(this, arguments);
      };
    }();

    // ----------

    var setupInviewTrack = /*#__PURE__*/function () {
      var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(options, viewCallback, viewData) {
        var element, sizeWatcher, scrollWatcher, realtime, domWatcher, isInview, removeTrackCallback, scrollableAncestors, addTrackCallback, enterOrLeaveCallback;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              element = options._element;
              debug: logger === null || logger === void 0 || logger.debug8("Setting up size, scroll and attribute tracking", element);
              sizeWatcher = _sizeWatcher.SizeWatcher.reuse();
              scrollWatcher = _scrollWatcher.ScrollWatcher.reuse();
              realtime = options._debounceWindow === 0; // Detect when target's class or style attribute change
              domWatcher = _domWatcher.DOMWatcher.create({
                root: element,
                // only direct children
                subtree: false
              }); // We need to remove the tracking callback when target leaves view and re-add
              // it when it enters view. But the OnViewCallback that is associated may have
              // already been added prior, by calling onView with this handler, so we can't
              // always wrap around it, in order to detect when it's called with a change
              // of view. So we setup another OnViewCallback tied to the tracking callback.
              isInview = false;
              removeTrackCallback = null; // Finds any scrollable ancestors of the element and detect scroll on them.
              _context6.next = 10;
              return fetchScrollableAncestors(element, realtime);
            case 10:
              scrollableAncestors = _context6.sent;
              if (!viewCallback.isRemoved()) {
                _context6.next = 13;
                break;
              }
              return _context6.abrupt("return");
            case 13:
              addTrackCallback = function addTrackCallback() {
                var _config$_root;
                var trackCallback = (0, _callback.wrapCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
                  var prevData, latestData, changed;
                  return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                    while (1) switch (_context5.prev = _context5.next) {
                      case 0:
                        prevData = allViewData.get(element); // Get the latest view data for the target
                        _context5.next = 3;
                        return fetchCurrentView(element, realtime);
                      case 3:
                        latestData = _context5.sent;
                        debug: logger === null || logger === void 0 || logger.debug9("Got ViewData", element, latestData);
                        changed = viewChanged(latestData, prevData);
                        if (!changed) {
                          _context5.next = 13;
                          break;
                        }
                        // When comparing for changes, we round the numbers to certain number
                        // of decimal places, and allViewData serves as a "last threshold"
                        // state, so only update it if there was a significant change.
                        // Otherwise very quick changes in small increments would get
                        // rejected as "no change".
                        allViewData.set(element, latestData);
                        if (!(isInview && !viewCallback.isRemoved())) {
                          _context5.next = 11;
                          break;
                        }
                        _context5.next = 11;
                        return invokeCallback(viewCallback, element, latestData);
                      case 11:
                        _context5.next = 14;
                        break;
                      case 13:
                        debug: logger === null || logger === void 0 || logger.debug9("ViewData same as last");
                      case 14:
                      case "end":
                        return _context5.stop();
                    }
                  }, _callee5);
                })));

                // TODO Is there a better way to detect when it's moved?
                viewCallback.onRemove(trackCallback.remove);
                removeTrackCallback = trackCallback.remove;

                // Detect when target's class or style attribute change
                domWatcher.onMutation(trackCallback, _defineProperty({
                  categories: [MC.S_ATTRIBUTE]
                }, MC.S_SKIP_INITIAL, true));

                // Detect when target is resized
                sizeWatcher.onResize(trackCallback, _defineProperty(_defineProperty(_defineProperty({
                  target: element
                }, MC.S_DEBOUNCE_WINDOW, options._debounceWindow), "threshold", options._resizeThreshold), MC.S_SKIP_INITIAL, true));

                // Detect when the root is resized
                sizeWatcher.onResize(trackCallback, _defineProperty(_defineProperty(_defineProperty({
                  target: (_config$_root = config._root) !== null && _config$_root !== void 0 ? _config$_root : MH.getWindow()
                }, MC.S_DEBOUNCE_WINDOW, options._debounceWindow), "threshold", options._resizeThreshold), MC.S_SKIP_INITIAL, true));

                // Detect when the target's scrollable ancestors are scrolled (this
                // will almost certainly include the main scrollable element).
                var _iterator3 = _createForOfIteratorHelper(scrollableAncestors),
                  _step3;
                try {
                  for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                    var ancestor = _step3.value;
                    scrollWatcher.onScroll(trackCallback, _defineProperty(_defineProperty(_defineProperty({
                      scrollable: ancestor
                    }, MC.S_DEBOUNCE_WINDOW, options._debounceWindow), "threshold", options._scrollThreshold), MC.S_SKIP_INITIAL, true));
                  }
                } catch (err) {
                  _iterator3.e(err);
                } finally {
                  _iterator3.f();
                }
              };
              enterOrLeaveCallback = createCallback(function (target__ignored, viewData) {
                if (viewData.views[0] === MC.S_AT) {
                  if (!isInview) {
                    isInview = true;
                    addTrackCallback();
                  }
                } else if (removeTrackCallback) {
                  isInview = false;
                  removeTrackCallback();
                  removeTrackCallback = null;
                }
              }, MH.assign(options, {
                _viewsBitmask: _views.VIEWS_SPACE.bitmask
              }), TRACK_REGULAR);
              viewCallback.onRemove(enterOrLeaveCallback.remove);
              allViewData.set(element, viewData); // to avoid duplicate initial call
              // Setup the track and the "inView" state
              if (!enterOrLeaveCallback.isRemoved()) {
                invokeCallback(enterOrLeaveCallback, element, viewData);
              }
            case 18:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      return function setupInviewTrack(_x10, _x11, _x12) {
        return _ref5.apply(this, arguments);
      };
    }();

    // ----------

    this.fetchCurrentView = function (target) {
      var realtime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return fetchElement(config._root, target).then(function (element) {
        return fetchCurrentView(element, realtime);
      });
    };

    // ----------

    this.trackView = function (element, handler, options) {
      if (!handler) {
        handler = setViewCssProps;
      }
      return setupOnView(element, handler, options, TRACK_FULL);
    };

    // ----------

    this.noTrackView = function (element, handler) {
      if (!handler) {
        handler = setViewCssProps;
      }
      removeOnView(element, handler, TRACK_FULL); // no need to await
    };

    // ----------

    this.onView = function (target, handler, options) {
      return setupOnView(target, handler, options, TRACK_REGULAR);
    };

    // ----------

    this.offView = function (target, handler) {
      return removeOnView(target, handler, TRACK_REGULAR);
    }; // no need to await
  }
  return _createClass(ViewWatcher, null, [{
    key: "create",
    value:
    /**
     * Creates a new instance of ViewWatcher with the given
     * {@link ViewWatcherConfig}. It does not save it for future reuse.
     */
    function create() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new ViewWatcher(getConfig(config), CONSTRUCTOR_KEY);
    }

    /**
     * Returns an existing  instance of ViewWatcher with the given
     * {@link ViewWatcherConfig}, or creates a new one.
     *
     * **NOTE:** It saves it for future reuse, so don't use this for temporary
     * short-lived watchers.
     */
  }, {
    key: "reuse",
    value: function reuse() {
      var _instances$get;
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var myConfig = getConfig(config);
      var configStrKey = (0, _text.objToStrKey)((0, _misc.omitKeys)(myConfig, {
        _root: null
      }));
      var instance = (_instances$get = instances.get(myConfig._root)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(configStrKey);
      if (!instance) {
        instance = new ViewWatcher(myConfig, CONSTRUCTOR_KEY);
        instances.sGet(myConfig._root).set(configStrKey, instance);
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
 * - The element that is the target of the IntersectionObserver. If the call to
 *   {@link ViewWatcher.onView} specified an element as the target, it will be
 *   the same. If it specified an offset, then the element passed to the
 *   callback will be an absolutely positioned trigger overlay that's created
 *   as a result.
 * - the {@link ViewData} for relative to the target
 */
// ----------------------------------------
var CONSTRUCTOR_KEY = MC.SYMBOL();
var instances = (0, _xMap.newXMap)(function () {
  return MH.newMap();
});
var getConfig = function getConfig(config) {
  var _config$rootMargin;
  return {
    _root: (config === null || config === void 0 ? void 0 : config.root) || null,
    _rootMargin: (_config$rootMargin = config === null || config === void 0 ? void 0 : config.rootMargin) !== null && _config$rootMargin !== void 0 ? _config$rootMargin : "0px 0px 0px 0px",
    _threshold: (config === null || config === void 0 ? void 0 : config.threshold) || 0
  };
};
var TRACK_REGULAR = 1; // only entering/leaving root
var TRACK_FULL = 2; // entering/leaving + moving across (fine-grained)

// --------------------

var fetchOptions = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(root, target, options) {
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return fetchElement(root, target);
        case 2:
          _context7.t0 = _context7.sent;
          _context7.t1 = (0, _views.getViewsBitmask)(options === null || options === void 0 ? void 0 : options.views);
          _context7.t2 = options === null || options === void 0 ? void 0 : options.debounceWindow;
          _context7.t3 = options === null || options === void 0 ? void 0 : options.resizeThreshold;
          _context7.t4 = options === null || options === void 0 ? void 0 : options.scrollThreshold;
          return _context7.abrupt("return", {
            _element: _context7.t0,
            _viewsBitmask: _context7.t1,
            _debounceWindow: _context7.t2,
            _resizeThreshold: _context7.t3,
            _scrollThreshold: _context7.t4
          });
        case 8:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function fetchOptions(_x13, _x14, _x15) {
    return _ref7.apply(this, arguments);
  };
}();
var fetchScrollableAncestors = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(element, realtime) {
    var scrollableAncestors, ancestor;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          if (realtime) {
            _context8.next = 3;
            break;
          }
          _context8.next = 3;
          return (0, _domOptimize.waitForMeasureTime)();
        case 3:
          scrollableAncestors = [];
          ancestor = element;
          while (ancestor = (0, _scroll.getClosestScrollable)(ancestor, {
            active: true
          })) {
            scrollableAncestors.push(ancestor);
          }
          return _context8.abrupt("return", scrollableAncestors);
        case 7:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function fetchScrollableAncestors(_x16, _x17) {
    return _ref8.apply(this, arguments);
  };
}();
var viewChanged = function viewChanged(latestData, prevData) {
  return !prevData || viewsToBitmask(prevData.views) !== viewsToBitmask(latestData.views) || !(0, _misc.compareValuesIn)(MH.copyBoundingRectProps(prevData.targetBounds), MH.copyBoundingRectProps(latestData.targetBounds)) || !(0, _misc.compareValuesIn)(prevData.rootBounds, latestData.rootBounds) || !(0, _misc.compareValuesIn)(prevData.relative, latestData.relative);
};
var viewsToBitmask = function viewsToBitmask(views) {
  return _views.VIEWS_SPACE.bit[views[0]] | (views[1] ? _views.VIEWS_SPACE.bit[views[1]] : 0);
};
var fetchIntersectionData = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(config, entryOrTarget) {
    var realtime,
      root,
      vpSize,
      rootMargins,
      target,
      targetBounds,
      rootBounds,
      isIntersecting,
      isCrossOrigin,
      _args9 = arguments;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          realtime = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : false;
          root = config._root;
          _context9.next = 4;
          return (0, _size.fetchViewportSize)(realtime);
        case 4:
          vpSize = _context9.sent;
          rootMargins = (0, _text.toMargins)(config._rootMargin, vpSize);
          rootBounds = null;
          isIntersecting = null;
          isCrossOrigin = null;
          if (!MH.isInstanceOf(entryOrTarget, IntersectionObserverEntry)) {
            _context9.next = 17;
            break;
          }
          target = entryOrTarget.target;
          targetBounds = entryOrTarget.boundingClientRect;
          rootBounds = entryOrTarget.rootBounds;
          isIntersecting = entryOrTarget.isIntersecting;
          isCrossOrigin = !entryOrTarget.rootBounds;
          _context9.next = 21;
          break;
        case 17:
          target = entryOrTarget;
          _context9.next = 20;
          return fetchBounds(target, realtime);
        case 20:
          targetBounds = _context9.sent;
        case 21:
          if (rootBounds) {
            _context9.next = 25;
            break;
          }
          _context9.next = 24;
          return fetchBounds(root, realtime, rootMargins);
        case 24:
          rootBounds = _context9.sent;
        case 25:
          return _context9.abrupt("return", {
            _target: target,
            _targetBounds: targetBounds,
            _root: root,
            _rootMargins: rootMargins,
            _rootBounds: rootBounds,
            _isIntersecting: isIntersecting,
            _isCrossOrigin: isCrossOrigin
          });
        case 26:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return function fetchIntersectionData(_x18, _x19) {
    return _ref9.apply(this, arguments);
  };
}();
var fetchBounds = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(root, realtime, rootMargins) {
    var rect, _yield$fetchViewportS, width, height;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          if (!root) {
            _context10.next = 7;
            break;
          }
          if (realtime) {
            _context10.next = 4;
            break;
          }
          _context10.next = 4;
          return (0, _domOptimize.waitForMeasureTime)();
        case 4:
          rect = MH.copyBoundingRectProps(MH.getBoundingClientRect(root));
          _context10.next = 13;
          break;
        case 7:
          _context10.next = 9;
          return (0, _size.fetchViewportSize)(realtime);
        case 9:
          _yield$fetchViewportS = _context10.sent;
          width = _yield$fetchViewportS.width;
          height = _yield$fetchViewportS.height;
          rect = {
            x: 0,
            left: 0,
            right: width,
            width: width,
            y: 0,
            top: 0,
            bottom: height,
            height: height
          };
        case 13:
          if (rootMargins) {
            rect.x = rect[MC.S_LEFT] -= rootMargins[3];
            rect[MC.S_RIGHT] += rootMargins[1];
            rect[MC.S_WIDTH] += rootMargins[1] + rootMargins[3];
            rect.y = rect[MC.S_TOP] -= rootMargins[0];
            rect[MC.S_BOTTOM] += rootMargins[2];
            rect[MC.S_HEIGHT] += rootMargins[0] + rootMargins[2];
          }
          return _context10.abrupt("return", rect);
        case 15:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return function fetchBounds(_x20, _x21, _x22) {
    return _ref10.apply(this, arguments);
  };
}();
var fetchViewData = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(intersection) {
    var _intersection$_isInte;
    var realtime,
      vpSize,
      vpHeight,
      vpWidth,
      views,
      relative,
      viewData,
      _args11 = arguments;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          realtime = _args11.length > 1 && _args11[1] !== undefined ? _args11[1] : false;
          _context11.next = 3;
          return (0, _size.fetchViewportSize)(realtime);
        case 3:
          vpSize = _context11.sent;
          vpHeight = vpSize[MC.S_HEIGHT];
          vpWidth = vpSize[MC.S_WIDTH];
          _context11.next = 8;
          return _fetchViews(intersection, realtime);
        case 8:
          views = _context11.sent;
          relative = MH.merge({
            hMiddle: NaN,
            vMiddle: NaN
          }, MH.copyBoundingRectProps(intersection._targetBounds));
          relative.y /= vpHeight;
          relative[MC.S_TOP] /= vpHeight;
          relative[MC.S_BOTTOM] /= vpHeight;
          relative[MC.S_HEIGHT] /= vpHeight;
          relative.x /= vpWidth;
          relative[MC.S_LEFT] /= vpWidth;
          relative[MC.S_RIGHT] /= vpWidth;
          relative[MC.S_WIDTH] /= vpWidth;
          relative.hMiddle = (relative[MC.S_LEFT] + relative[MC.S_RIGHT]) / 2;
          relative.vMiddle = (relative[MC.S_TOP] + relative[MC.S_BOTTOM]) / 2;
          viewData = {
            isIntersecting: (_intersection$_isInte = intersection._isIntersecting) !== null && _intersection$_isInte !== void 0 ? _intersection$_isInte : views[0] === MC.S_AT,
            targetBounds: intersection._targetBounds,
            rootBounds: intersection._rootBounds,
            views: views,
            relative: relative
          };
          return _context11.abrupt("return", viewData);
        case 22:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return function fetchViewData(_x23) {
    return _ref11.apply(this, arguments);
  };
}();
var _fetchViews = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12(intersection, realtime, useScrollingAncestor) {
    var rootBounds, targetBounds, delta, xView, yView, scrollingAncestor;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          if (!intersection._isIntersecting) {
            _context12.next = 2;
            break;
          }
          return _context12.abrupt("return", [MC.S_AT]);
        case 2:
          if (!useScrollingAncestor) {
            _context12.next = 8;
            break;
          }
          _context12.next = 5;
          return fetchBounds(useScrollingAncestor, realtime, intersection._rootMargins);
        case 5:
          rootBounds = _context12.sent;
          _context12.next = 9;
          break;
        case 8:
          rootBounds = intersection._rootBounds;
        case 9:
          targetBounds = intersection._targetBounds;
          delta = {
            _left: rootBounds[MC.S_LEFT] - targetBounds[MC.S_LEFT],
            _right: targetBounds[MC.S_RIGHT] - rootBounds[MC.S_RIGHT],
            _top: rootBounds[MC.S_TOP] - targetBounds[MC.S_TOP],
            _bottom: targetBounds[MC.S_BOTTOM] - rootBounds[MC.S_BOTTOM]
          };
          xView = null;
          yView = null;
          if (delta._left > 0 && delta._right > 0) {
            // Target is wider than root: use greater delta to determine position.
            // Remember, the view is the _root_ position relative to target.
            xView = delta._left > delta._right ? MC.S_RIGHT : MC.S_LEFT;
          } else if (delta._left > 0) {
            // Target is to the left of the root
            xView = MC.S_RIGHT;
          } else if (delta._right > 0) {
            // Target is to the right of the root
            xView = MC.S_LEFT;
          } // else target is horizontally contained in root, see below

          if (delta._top > 0 && delta._bottom > 0) {
            // Target is taller than root: use greater delta to determine position.
            // Remember, the view is the _root_ position relative to target.
            yView = delta._top > delta._bottom ? MC.S_BELOW : MC.S_ABOVE;
          } else if (delta._top > 0) {
            // Target is above the root
            yView = MC.S_BELOW;
          } else if (delta._bottom > 0) {
            // Target is below the root
            yView = MC.S_ABOVE;
          } // else target is vertically contained in root, see below
          if (!(xView && yView)) {
            _context12.next = 19;
            break;
          }
          return _context12.abrupt("return", [xView, yView]);
        case 19:
          if (!xView) {
            _context12.next = 23;
            break;
          }
          return _context12.abrupt("return", [xView]);
        case 23:
          if (!yView) {
            _context12.next = 25;
            break;
          }
          return _context12.abrupt("return", [yView]);
        case 25:
          if (intersection._isCrossOrigin) {
            _context12.next = 29;
            break;
          }
          // This is case 1. or 2. => get the views relative to the closest
          // scrollable ancestor relative to which it is _not_ intersecting, if
          // any. If it's nested inside several scrolling elements, we'll end up
          // looping over each one until we find the one for which the target is
          // outside its box.
          //
          // It is too risky to use active isScrollable check here since we could be
          // inside an onScroll handler, so just use passive.
          scrollingAncestor = (0, _scroll.getClosestScrollable)(useScrollingAncestor !== null && useScrollingAncestor !== void 0 ? useScrollingAncestor : intersection._target);
          if (!scrollingAncestor) {
            _context12.next = 29;
            break;
          }
          return _context12.abrupt("return", _fetchViews(intersection, realtime, scrollingAncestor));
        case 29:
          return _context12.abrupt("return", [MC.S_AT]);
        case 30:
        case "end":
          return _context12.stop();
      }
    }, _callee12);
  }));
  return function fetchViews(_x24, _x25, _x26) {
    return _ref12.apply(this, arguments);
  };
}();
var setViewCssProps = function setViewCssProps(element, viewData) {
  var relative = (viewData === null || viewData === void 0 ? void 0 : viewData.relative) || {};
  var props = _defineProperty(_defineProperty(_defineProperty(_defineProperty({
    top: relative.top,
    bottom: relative.bottom,
    left: relative.left,
    right: relative.right
  }, MC.S_WIDTH, relative[MC.S_WIDTH]), MC.S_HEIGHT, relative[MC.S_HEIGHT]), "hMiddle", relative.hMiddle), "vMiddle", relative.vMiddle);
  (0, _cssAlter.setNumericStyleProps)(element, props, {
    _prefix: "r-",
    _numDecimal: 4
  }); // don't await here
};
var fetchElement = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee13(root, target) {
    var overlayOptions;
    return _regeneratorRuntime().wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          if (!MH.isElement(target)) {
            _context13.next = 4;
            break;
          }
          return _context13.abrupt("return", target);
        case 4:
          if (MH.isString(target)) {
            _context13.next = 6;
            break;
          }
          throw MH.usageError("'target' must be an offset string or an HTMLElement | SVGElement | MathMLElement");
        case 6:
          overlayOptions = getOverlayOptions(root, target);
          _context13.next = 9;
          return (0, _overlays.createOverlay)(overlayOptions);
        case 9:
          return _context13.abrupt("return", _context13.sent);
        case 10:
        case "end":
          return _context13.stop();
      }
    }, _callee13);
  }));
  return function fetchElement(_x27, _x28) {
    return _ref13.apply(this, arguments);
  };
}();
var getOverlayOptions = function getOverlayOptions(root, target) {
  var _parseScrollOffset = (0, _views.parseScrollOffset)(target),
    reference = _parseScrollOffset.reference,
    value = _parseScrollOffset.value;
  var ovrDimension;
  if (reference === MC.S_TOP || reference === MC.S_BOTTOM) {
    ovrDimension = MC.S_WIDTH;
  } else if (reference === MC.S_LEFT || reference === MC.S_RIGHT) {
    ovrDimension = MC.S_HEIGHT;
  } else {
    throw MH.usageError("Invalid offset reference: '".concat(reference, "'"));
  }
  return {
    parent: MH.isHTMLElement(root) ? root : undefined,
    style: _defineProperty(_defineProperty({}, reference, value), ovrDimension, "100%")
  };
};
var invokeCallback = function invokeCallback(callback, element, viewData) {
  return callback.invoke(element, MH.copyObject(viewData))["catch"](_log.logError);
};
//# sourceMappingURL=view-watcher.cjs.map