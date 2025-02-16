"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SizeWatcher = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _cssAlter = require("../utils/css-alter.cjs");
var _log = require("../utils/log.cjs");
var _math = require("../utils/math.cjs");
var _size = require("../utils/size.cjs");
var _text = require("../utils/text.cjs");
var _callback = require("../modules/callback.cjs");
var _xMap = require("../modules/x-map.cjs");
var _xResizeObserver = require("../modules/x-resize-observer.cjs");
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
 * @module Watchers/SizeWatcher
 */
/**
 * {@link SizeWatcher} monitors the size of a given target. It's built on top
 * of {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver | ResizeObserver}.
 *
 * It manages registered callbacks globally and reuses ResizeObservers.
 *
 * Each instance of SizeWatcher manages up to two ResizeObservers: one
 * for content-box size changes and one for border-box size changes.
 */
var SizeWatcher = exports.SizeWatcher = /*#__PURE__*/function () {
  function SizeWatcher(config, key) {
    _classCallCheck(this, SizeWatcher);
    /**
     * Call the given handler whenever the target's size changes.
     *
     * Unless {@link OnResizeOptions.skipInitial} is true, the handler is also
     * called (almost) immediately with the latest size data.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same target, even if the options differ. If the handler has already been
     * added for this target, either using {@link onResize} or {@link trackSize},
     * then it will be removed and re-added with the current options.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target or options are invalid.
     */
    _defineProperty(this, "onResize", void 0);
    /**
     * Removes a previously added handler.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target is invalid.
     */
    _defineProperty(this, "offResize", void 0);
    /**
     * This is the same as {@link onResize} except that if `handler` is not given,
     * then it defaults to an  handler that updates a set of CSS variables on the
     * target's style:
     *
     * - If {@link OnResizeOptions.target | options.target} is not given, or is
     *   `window`, the following CSS variables are set on the root (`html`)
     *   element and represent the viewport size:
     *   - `--lisn-js--window-border-width`
     *   - `--lisn-js--window-border-height`
     *   - `--lisn-js--window-content-width`
     *   - `--lisn-js--window-content-height`
     *
     * - Otherwise, the following variables are set on the target itself and
     *   represent its visible size:
     *   - `--lisn-js--border-width`
     *   - `--lisn-js--border-height`
     *   - `--lisn-js--content-width`
     *   - `--lisn-js--content-height`
     *
     * If `target` is `document`, then it will use `document.documentElement`.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same target, even if the options differ. If the handler has already been
     * added for this target, either using {@link onResize} or {@link trackSize},
     * then it will be removed and re-added with the current options.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target or options are invalid.
     */
    _defineProperty(this, "trackSize", void 0);
    /**
     * Removes a previously added handler for {@link trackSize}.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target is invalid.
     */
    _defineProperty(this, "noTrackSize", void 0);
    /**
     * Get the size of the given target. It will get the size from a
     * ResizeObserverEntry and so it's always delayed by one frame at least.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target is invalid.
     */
    _defineProperty(this, "fetchCurrentSize", void 0);
    if (key !== CONSTRUCTOR_KEY) {
      throw MH.illegalConstructorError("SizeWatcher.create");
    }
    var logger = _debug["default"] ? new _debug["default"].Logger({
      name: "SizeWatcher",
      logAtCreation: config
    }) : null;
    var allSizeData = MH.newWeakMap();
    var allCallbacks = (0, _xMap.newXWeakMap)(function () {
      return MH.newMap();
    });

    // ----------

    var resizeHandler = function resizeHandler(entries) {
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

    // Don't debounce the observer, only callbacks.
    var xObserver = new _xResizeObserver.XResizeObserver(resizeHandler);

    // ----------

    var fetchCurrentSize = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(target) {
        var element, sizeData;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return fetchElement(target);
            case 2:
              element = _context.sent;
              sizeData = allSizeData.get(element);
              if (!sizeData) {
                _context.next = 6;
                break;
              }
              return _context.abrupt("return", MH.copyObject(sizeData));
            case 6:
              return _context.abrupt("return", MH.newPromise(function (resolve) {
                // Use a temp ResizeObserver
                var observer = MH.newResizeObserver(function (entries) {
                  var sizeData = getSizeData(entries[0]);
                  observer === null || observer === void 0 || observer.disconnect();
                  resolve(sizeData); // no need to copy or save it
                });
                if (observer) {
                  observer.observe(element);
                } else {
                  // Warning would have already been logged by XResizeObserver
                  resolve({
                    border: _defineProperty(_defineProperty({}, MC.S_WIDTH, 0), MC.S_HEIGHT, 0),
                    content: _defineProperty(_defineProperty({}, MC.S_WIDTH, 0), MC.S_HEIGHT, 0)
                  });
                }
              }));
            case 7:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function fetchCurrentSize(_x) {
        return _ref.apply(this, arguments);
      };
    }();

    // ----------

    var fetchOptions = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(options) {
        var _options$box, _options$dimension, _options$MC$S_DEBOUNC;
        var box, dimension;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              box = (_options$box = options.box) !== null && _options$box !== void 0 ? _options$box : null;
              if (!(box && !(0, _size.isValidBox)(box))) {
                _context2.next = 3;
                break;
              }
              throw MH.usageError("Unknown box type: '".concat(box, "'"));
            case 3:
              dimension = (_options$dimension = options.dimension) !== null && _options$dimension !== void 0 ? _options$dimension : null;
              if (!(dimension && !(0, _size.isValidDimension)(dimension))) {
                _context2.next = 6;
                break;
              }
              throw MH.usageError("Unknown dimension: '".concat(dimension, "'"));
            case 6:
              _context2.next = 8;
              return fetchElement(MH.targetOf(options));
            case 8:
              _context2.t0 = _context2.sent;
              _context2.t1 = box;
              _context2.t2 = dimension;
              _context2.t3 = (0, _math.toNonNegNum)(options.threshold, config._resizeThreshold) || 1;
              _context2.t4 = (_options$MC$S_DEBOUNC = options[MC.S_DEBOUNCE_WINDOW]) !== null && _options$MC$S_DEBOUNC !== void 0 ? _options$MC$S_DEBOUNC : config._debounceWindow;
              return _context2.abrupt("return", {
                _element: _context2.t0,
                _box: _context2.t1,
                _dimension: _context2.t2,
                _threshold: _context2.t3,
                _debounceWindow: _context2.t4
              });
            case 14:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      return function fetchOptions(_x2) {
        return _ref2.apply(this, arguments);
      };
    }();

    // ----------

    var createCallback = function createCallback(handler, options) {
      var _allCallbacks$get;
      var element = options._element;
      MH.remove((_allCallbacks$get = allCallbacks.get(element)) === null || _allCallbacks$get === void 0 || (_allCallbacks$get = _allCallbacks$get.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      debug: logger === null || logger === void 0 || logger.debug5("Adding/updating handler", options);
      var callback = (0, _callback.wrapCallback)(handler, options._debounceWindow);
      callback.onRemove(function () {
        deleteHandler(handler, options);
      });
      var entry = {
        _callback: callback,
        _options: options
      };
      allCallbacks.sGet(element).set(handler, entry);
      return entry;
    };

    // ----------

    var setupOnResize = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(handler, userOptions) {
        var options, element, entry, callback, sizeData;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return fetchOptions(userOptions || {});
            case 2:
              options = _context3.sent;
              element = options._element; // Don't await for the size data before creating the callback so that
              // setupOnResize and removeOnResize have the same "timing" and therefore
              // calling onResize and offResize immediately without awaiting removes the
              // callback.
              entry = createCallback(handler, options);
              callback = entry._callback;
              _context3.next = 8;
              return fetchCurrentSize(element);
            case 8:
              sizeData = _context3.sent;
              if (!callback.isRemoved()) {
                _context3.next = 11;
                break;
              }
              return _context3.abrupt("return");
            case 11:
              entry._data = sizeData;
              allSizeData.set(element, sizeData);

              // Always use observeLater. This is because the initial call to callback
              // shouldn't be debounced, and so we call it manually here, regardless if
              // it's a new target or not. Therefore we don't want the observer to also
              // call it in case it _is_ a new target.
              // It's ok if already observed, won't do anything.
              xObserver.observeLater(element);
              if (userOptions !== null && userOptions !== void 0 && userOptions.skipInitial) {
                _context3.next = 18;
                break;
              }
              debug: logger === null || logger === void 0 || logger.debug5("Calling initially with", element, sizeData);
              // Use a one-off callback that's not debounced for the initial call.
              _context3.next = 18;
              return invokeCallback((0, _callback.wrapCallback)(handler), element, sizeData);
            case 18:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      return function setupOnResize(_x3, _x4) {
        return _ref3.apply(this, arguments);
      };
    }();

    // ----------

    var removeOnResize = /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(handler, target) {
        var _allCallbacks$get2;
        var options, element, currEntry;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return fetchOptions({
                target: target
              });
            case 2:
              options = _context4.sent;
              element = options._element;
              currEntry = (_allCallbacks$get2 = allCallbacks.get(element)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2.get(handler);
              if (currEntry) {
                MH.remove(currEntry._callback);
                if (handler === setSizeCssProps) {
                  // delete the properties
                  setSizeCssProps(element, null);
                }
              }
            case 6:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      return function removeOnResize(_x5, _x6) {
        return _ref4.apply(this, arguments);
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
        MH.deleteKey(allSizeData, element);
      }
    };

    // ----------

    var processEntry = function processEntry(entry) {
      var _allCallbacks$get3;
      // In reality, it can't be just a base Element
      var element = MH.targetOf(entry);
      var latestData = getSizeData(entry);
      allSizeData.set(element, latestData);
      debug: logger === null || logger === void 0 || logger.debug9("New size data", element, latestData);
      var _iterator2 = _createForOfIteratorHelper(((_allCallbacks$get3 = allCallbacks.get(element)) === null || _allCallbacks$get3 === void 0 ? void 0 : _allCallbacks$get3.values()) || []),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _entry = _step2.value;
          var thresholdsExceeded = hasExceededThreshold(_entry._options, latestData, _entry._data);
          if (!thresholdsExceeded) {
            debug: logger === null || logger === void 0 || logger.debug9("Threshold not exceeded");
            continue;
          }
          _entry._data = latestData;
          invokeCallback(_entry._callback, element, latestData);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    };

    // ----------

    this.fetchCurrentSize = fetchCurrentSize;

    // ----------

    this.trackSize = /*#__PURE__*/function () {
      var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(handler, options) {
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              if (!handler) {
                handler = setSizeCssProps;
              }
              return _context5.abrupt("return", setupOnResize(handler, options));
            case 2:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      return function (_x7, _x8) {
        return _ref5.apply(this, arguments);
      };
    }();

    // ----------

    this.noTrackSize = function (handler, target) {
      if (!handler) {
        handler = setSizeCssProps;
      }
      removeOnResize(handler, target); // no need to await
    };

    // ----------

    this.onResize = setupOnResize;

    // ----------

    this.offResize = function (handler, target) {
      removeOnResize(handler, target); // no need to await
    };
  }
  return _createClass(SizeWatcher, null, [{
    key: "create",
    value:
    /**
     * Creates a new instance of SizeWatcher with the given
     * {@link SizeWatcherConfig}. It does not save it for future reuse.
     */
    function create() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new SizeWatcher(getConfig(config), CONSTRUCTOR_KEY);
    }

    /**
     * Returns an existing instance of SizeWatcher with the given
     * {@link SizeWatcherConfig}, or creates a new one.
     *
     * **NOTE:** It saves it for future reuse, so don't use this for temporary
     * short-lived watchers.
     */
  }, {
    key: "reuse",
    value: function reuse() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var myConfig = getConfig(config);
      var configStrKey = (0, _text.objToStrKey)(myConfig);
      var instance = instances.get(configStrKey);
      if (!instance) {
        instance = new SizeWatcher(myConfig, CONSTRUCTOR_KEY);
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
 * The handler is invoked with three arguments:
 *
 * - the element that has been resized: if the target you requested was the
 *   viewport, then this will be a fixed positioned overlay that tracks the
 *   size of the viewport
 * - the {@link SizeData} for the element
 */
// ----------------------------------------
var CONSTRUCTOR_KEY = MC.SYMBOL();
var instances = MH.newMap();
var getConfig = function getConfig(config) {
  return {
    _debounceWindow: (0, _math.toNonNegNum)(config[MC.S_DEBOUNCE_WINDOW], 75),
    // If threshold is 0, internally treat as 1 (pixel)
    _resizeThreshold: (0, _math.toNonNegNum)(config.resizeThreshold, 50) || 1
  };
};

// --------------------

var hasExceededThreshold = function hasExceededThreshold(options, latestData, lastThresholdData) {
  if (!lastThresholdData) {
    /* istanbul ignore */
    return false;
  }
  var box, dim;
  for (box in latestData) {
    if (options._box && options._box !== box) {
      continue;
    }
    for (dim in latestData[box]) {
      if (options._dimension && options._dimension !== dim) {
        continue;
      }
      var diff = MH.abs(latestData[box][dim] - lastThresholdData[box][dim]);
      if (diff >= options._threshold) {
        return true;
      }
    }
  }
  return false;
};
var getSizeData = function getSizeData(entry) {
  var borderBox = (0, _size.getEntryBorderBox)(entry, true);
  var contentBox = (0, _size.getEntryContentBox)(entry);
  return {
    border: borderBox,
    content: contentBox
  };
};
var setSizeCssProps = function setSizeCssProps(element, sizeData) {
  var prefix = "";
  if (element === (0, _size.tryGetViewportOverlay)()) {
    // Set the CSS vars on the root element
    element = MH.getDocElement();
    prefix = "window-";
  }
  var props = {
    borderWidth: sizeData === null || sizeData === void 0 ? void 0 : sizeData.border[MC.S_WIDTH],
    borderHeight: sizeData === null || sizeData === void 0 ? void 0 : sizeData.border[MC.S_HEIGHT],
    contentWidth: sizeData === null || sizeData === void 0 ? void 0 : sizeData.content[MC.S_WIDTH],
    contentHeight: sizeData === null || sizeData === void 0 ? void 0 : sizeData.content[MC.S_HEIGHT]
  };
  (0, _cssAlter.setNumericStyleProps)(element, props, {
    _prefix: prefix
  }); // don't await here
};
var fetchElement = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(target) {
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          if (!MH.isElement(target)) {
            _context6.next = 2;
            break;
          }
          return _context6.abrupt("return", target);
        case 2:
          if (!(!target || target === MH.getWindow())) {
            _context6.next = 4;
            break;
          }
          return _context6.abrupt("return", (0, _size.fetchViewportOverlay)());
        case 4:
          if (!(target === MH.getDoc())) {
            _context6.next = 6;
            break;
          }
          return _context6.abrupt("return", MH.getDocElement());
        case 6:
          throw MH.usageError("Unsupported resize target");
        case 7:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function fetchElement(_x9) {
    return _ref6.apply(this, arguments);
  };
}();
var invokeCallback = function invokeCallback(callback, element, sizeData) {
  return callback.invoke(element, MH.copyObject(sizeData))["catch"](_log.logError);
};
//# sourceMappingURL=size-watcher.cjs.map