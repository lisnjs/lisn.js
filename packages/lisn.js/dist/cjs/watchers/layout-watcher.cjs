"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LayoutWatcher = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _settings = require("../globals/settings.cjs");
var _cssAlter = require("../utils/css-alter.cjs");
var _layout = require("../utils/layout.cjs");
var _log = require("../utils/log.cjs");
var _misc = require("../utils/misc.cjs");
var _overlays = require("../utils/overlays.cjs");
var _text = require("../utils/text.cjs");
var _callback = require("../modules/callback.cjs");
var _xMap = require("../modules/x-map.cjs");
var _sizeWatcher = require("./size-watcher.cjs");
var _debug = _interopRequireDefault(require("../debug/debug.cjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
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
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Watchers/LayoutWatcher
 */ // NOTES FOR DEVELOPERS
//
// For each layout (device or aspect ratio), we create an overlay that has a
// a width that corresponds to the layout:
//  - for device layouts, it's a fixed width in pixels, equal to the minimum
//    width of the device
//  - for aspect ratio layouts, the overlay has a width that's relative to
//    the root's height, equal to the minimum width of the aspect ratio
//
// Then we observe each overlay with an IntersectionObserver whose root
// is this Watcher's root and whose root margin is -100% from the left (i.e.
// right-most edge of the root).
//
// If the root is null, i.e. the viewport, the overlays will have a "fixed"
// position and be inserted in document.body. Otherwise, they'll be inserted
// in the root element with an "absolute" position. The root element, if not
// body must be positioned. It gets a default position of "relative" through
// the class `.lisn-overlay-container`, which Overlays ensures it gets.
//
// If using custom root we track its size through SizeWatcher as the
// aspectRatio overlays are relative to the height, and we can't rely on CSS
// alone as the root may not have a fixed height through CSS.
//
// Whenever any overlay intersects the root, this means that the viewport
// width is now equal to or narrower than the overlay.
//
// ~~~~ The current device or aspect ratio corresponds to the _widest_
// ~~~~ overlay that does not intersect.
//
// For example:
//
// | mobile
// ========| mobile-wide
// ======================| tablet
// =========================================| desktop
//
// _________________________________| viewport width
//
// Here, mobile, mobile-wide and tablet overlays are _not_ intersecting, only
// desktop intersects. The device layout is therefore tablet.
//
// Therefore:
// - have the layout bit spaces ordered from narrowest layout at lowest bit
//   to widest layout at hightest bit
// - keep a running bitmask of which overlays are not intersecting and update
//   it each time there is an IntersectionObserverEntry.
// - get the highest device or aspect ratio bit in that bitmask to find out
//   the widest non-intersecting overlay
//
// For simplicity we create overlays also for layouts that have a 0-width.
/**
 * {@link LayoutWatcher} listens for changes in either the width or aspect
 * ratio of the viewport or the given {@link LayoutWatcherConfig.root | root}.
 *
 * It does not track resize events; rather it's built on top of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver | IntersectionObserver}.
 *
 * It manages registered callbacks globally and reuses IntersectionObservers
 * for more efficient performance.
 */
var LayoutWatcher = exports.LayoutWatcher = /*#__PURE__*/function () {
  function LayoutWatcher(config, key) {
    _classCallCheck(this, LayoutWatcher);
    /**
     * Call the given handler whenever the layout changes.
     *
     * Unless {@link OnLayoutOptions.skipInitial} is true, the handler is also
     * called (almost) immediately with the current layout.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times, even if
     * the options differ. If the handler has already been added, it is removed
     * and re-added with the current options.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the options are invalid.
     */
    _defineProperty(this, "onLayout", void 0);
    /**
     * Removes a previously added handler.
     */
    _defineProperty(this, "offLayout", void 0);
    /**
     * Get the current screen layout.
     */
    _defineProperty(this, "fetchCurrentLayout", void 0);
    if (key !== CONSTRUCTOR_KEY) {
      throw MH.illegalConstructorError("LayoutWatcher.create");
    }
    var logger = _debug["default"] ? new _debug["default"].Logger({
      name: "LayoutWatcher",
      logAtCreation: config
    }) : null;
    var nonIntersectingBitmask = 0;
    var currentLayoutData = {
      device: null,
      aspectRatio: null
    };
    var allCallbacks = MH.newMap();

    // ----------

    var fetchCurrentLayout = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return readyPromise;
            case 2:
              return _context.abrupt("return", MH.copyObject(currentLayoutData));
            case 3:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function fetchCurrentLayout() {
        return _ref.apply(this, arguments);
      };
    }();

    // ----------

    var setupOverlays = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var _yield$createOverlays, root, overlays;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return createOverlays(config._root, config._deviceBreakpoints, config._aspectRatioBreakpoints);
            case 2:
              _yield$createOverlays = _context2.sent;
              root = _yield$createOverlays.root;
              overlays = _yield$createOverlays.overlays;
              return _context2.abrupt("return", MH.newPromise(function (resolve) {
                var isReady = false;
                var intersectionHandler = function intersectionHandler(entries) {
                  var numEntries = MH.lengthOf(entries);
                  debug: logger === null || logger === void 0 || logger.debug9("Got ".concat(numEntries, " new entries"), entries);
                  if (!isReady) {
                    /* istanbul ignore next */ // shouldn't happen
                    if (numEntries < _layout.NUM_LAYOUTS) {
                      (0, _log.logWarn)(MH.bugError("Got IntersectionObserver ".concat(numEntries, ", ") + "expected >= ".concat(_layout.NUM_LAYOUTS)));
                    }
                  }
                  var _iterator = _createForOfIteratorHelper(entries),
                    _step;
                  try {
                    for (_iterator.s(); !(_step = _iterator.n()).done;) {
                      var entry = _step.value;
                      nonIntersectingBitmask = getNonIntersecting(nonIntersectingBitmask, entry);
                    }

                    // If this is the initial call from IntersectionObserver, skip callbacks.
                    // Those that have skipInitial: false would be called elsewhere, by
                    // setupOnLayout
                  } catch (err) {
                    _iterator.e(err);
                  } finally {
                    _iterator.f();
                  }
                  processLayoutChange(!isReady);
                  isReady = true;
                  resolve(); // ready after IntersectionObserver has called us the 1st time
                };

                // ----------

                var observeOptions = {
                  root: root,
                  rootMargin: "5px 0% 5px -100%"
                };
                var observer = MH.newIntersectionObserver(intersectionHandler, observeOptions);
                var _iterator2 = _createForOfIteratorHelper(overlays),
                  _step2;
                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    var triggerOverlay = _step2.value;
                    observer.observe(triggerOverlay);
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }
              }));
            case 6:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      return function setupOverlays() {
        return _ref2.apply(this, arguments);
      };
    }();

    // ----------

    var createCallback = function createCallback(handler, layoutBitmask) {
      var _allCallbacks$get;
      MH.remove((_allCallbacks$get = allCallbacks.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      debug: logger === null || logger === void 0 || logger.debug5("Adding/updating handler", layoutBitmask);
      var callback = (0, _callback.wrapCallback)(handler);
      callback.onRemove(function () {
        deleteHandler(handler);
      });
      allCallbacks.set(handler, {
        _callback: callback,
        _layoutBitmask: layoutBitmask
      });
      return callback;
    };
    var setupOnLayout = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(handler, options) {
        var layoutBitmask, callback, layoutData;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              layoutBitmask = (0, _layout.getLayoutBitmask)(options);
              callback = createCallback(handler, layoutBitmask);
              if (!(options !== null && options !== void 0 && options.skipInitial)) {
                _context3.next = 4;
                break;
              }
              return _context3.abrupt("return");
            case 4:
              _context3.next = 6;
              return fetchCurrentLayout();
            case 6:
              layoutData = _context3.sent;
              if (!(!callback.isRemoved() && changeMatches(layoutBitmask, layoutData, null))) {
                _context3.next = 11;
                break;
              }
              debug: logger === null || logger === void 0 || logger.debug5("Calling initially with", layoutData);
              _context3.next = 11;
              return invokeCallback(callback, layoutData);
            case 11:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      return function setupOnLayout(_x, _x2) {
        return _ref3.apply(this, arguments);
      };
    }();
    var deleteHandler = function deleteHandler(handler) {
      MH.deleteKey(allCallbacks, handler);
      // no need to unobserve the overlays
    };
    var processLayoutChange = function processLayoutChange(skipCallbacks) {
      var deviceBit = MH.floor(MH.log2(nonIntersectingBitmask & _layout.ORDERED_DEVICES.bitmask));
      var aspectRatioBit = MH.floor(MH.log2(nonIntersectingBitmask & _layout.ORDERED_ASPECTR.bitmask));
      var layoutData = {
        device: null,
        aspectRatio: null
      };

      // -Infinity means all of the overlays are intersecting, which would only
      // happen if the narrowest overlay is not actually 0-width (which is not the
      // case by default and against the recommended settings).
      if (deviceBit !== -MC.INFINITY) {
        layoutData.device = _layout.ORDERED_DEVICES.nameOf(1 << deviceBit);
      }
      if (aspectRatioBit !== -MC.INFINITY) {
        layoutData.aspectRatio = _layout.ORDERED_ASPECTR.nameOf(1 << aspectRatioBit);
      }
      debug: logger === null || logger === void 0 || logger.debug8("New layout", layoutData);
      if (!skipCallbacks) {
        var _iterator3 = _createForOfIteratorHelper(allCallbacks.values()),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var entry = _step3.value;
            var layoutBitmask = entry._layoutBitmask;
            if (!changeMatches(layoutBitmask, layoutData, currentLayoutData)) {
              debug: logger === null || logger === void 0 || logger.debug9("Layout change does not match bitmask ".concat(layoutBitmask));
              continue;
            }
            invokeCallback(entry._callback, layoutData);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
      currentLayoutData = layoutData;
    };
    var readyPromise = setupOverlays(); // no need to await

    // ----------

    this.fetchCurrentLayout = fetchCurrentLayout;

    // ----------

    this.onLayout = setupOnLayout;

    // ----------

    this.offLayout = function (handler) {
      var _allCallbacks$get2;
      debug: logger === null || logger === void 0 || logger.debug5("Removing handler");
      MH.remove((_allCallbacks$get2 = allCallbacks.get(handler)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2._callback);
    };
  }
  return _createClass(LayoutWatcher, null, [{
    key: "create",
    value:
    /**
     * Creates a new instance of LayoutWatcher with the given
     * {@link LayoutWatcherConfig}. It does not save it for future reuse.
     */
    function create() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new LayoutWatcher(getConfig(config), CONSTRUCTOR_KEY);
    }

    /**
     * Returns an existing instance of LayoutWatcher with the given
     * {@link LayoutWatcherConfig}, or creates a new one.
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
        instance = new LayoutWatcher(myConfig, CONSTRUCTOR_KEY);
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
 * The handler is invoked with one argument:
 *
 * - the current {@link LayoutData}
 */
/**
 * Note that {@link device} or {@link aspectRatio} would only be null if the
 * viewport is narrower than the narrowest device/aspect ratio. This would only
 * happen if the narrowest device/aspect ratio is _not_ 0-width (which is not
 * the case with the default breakpoints and is against the recommendation for
 * setting breakpoints.
 */
// ----------------------------------------
var CONSTRUCTOR_KEY = MC.SYMBOL();
var instances = (0, _xMap.newXMap)(function () {
  return MH.newMap();
});
var VAR_BORDER_HEIGHT = MH.prefixCssJsVar("border-height");
var PREFIX_DEVICE = MH.prefixName("device");
var PREFIX_ASPECTR = MH.prefixName("aspect-ratio");
var getConfig = function getConfig(config) {
  var deviceBreakpoints = MH.copyObject(_settings.settings.deviceBreakpoints);
  if (config !== null && config !== void 0 && config.deviceBreakpoints) {
    (0, _misc.copyExistingKeys)(config.deviceBreakpoints, deviceBreakpoints);
  }
  var aspectRatioBreakpoints = MH.copyObject(_settings.settings.aspectRatioBreakpoints);
  if (config !== null && config !== void 0 && config.aspectRatioBreakpoints) {
    (0, _misc.copyExistingKeys)(config.aspectRatioBreakpoints, aspectRatioBreakpoints);
  }
  return {
    _root: (config === null || config === void 0 ? void 0 : config.root) || null,
    _deviceBreakpoints: deviceBreakpoints,
    _aspectRatioBreakpoints: aspectRatioBreakpoints
  };
};

// ----------------------------------------

var createOverlays = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(root, deviceBreakpoints, aspectRatioBreakpoints) {
    var overlayPromises, overlayParent, device, parentHeightCss, aspectRatio, overlays;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          overlayPromises = [];
          if (!root) {
            _context4.next = 5;
            break;
          }
          overlayParent = root;
          _context4.next = 8;
          break;
        case 5:
          _context4.next = 7;
          return (0, _overlays.createOverlay)({
            style: _defineProperty({
              position: "fixed"
            }, MC.S_WIDTH, "100vw")
          });
        case 7:
          overlayParent = _context4.sent;
        case 8:
          for (device in deviceBreakpoints) {
            overlayPromises.push((0, _overlays.createOverlay)({
              parent: overlayParent,
              style: _defineProperty({
                position: "absolute"
              }, MC.S_WIDTH, deviceBreakpoints[device] + "px"),
              data: _defineProperty({}, PREFIX_DEVICE, device)
            }));
          }
          parentHeightCss = root ? "var(".concat(VAR_BORDER_HEIGHT, ", 0) * 1px") : "100vh";
          if (root) {
            _sizeWatcher.SizeWatcher.reuse().trackSize(null, {
              target: root
            });
          }
          for (aspectRatio in aspectRatioBreakpoints) {
            overlayPromises.push((0, _overlays.createOverlay)({
              parent: overlayParent,
              style: _defineProperty({
                position: "absolute"
              }, MC.S_WIDTH, "calc(".concat(aspectRatioBreakpoints[aspectRatio], " ") + "* ".concat(parentHeightCss, ")")),
              data: _defineProperty({}, PREFIX_ASPECTR, aspectRatio)
            }));
          }
          _context4.next = 14;
          return MH.promiseAll(overlayPromises);
        case 14:
          overlays = _context4.sent;
          return _context4.abrupt("return", {
            root: overlayParent,
            overlays: overlays
          });
        case 16:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function createOverlays(_x3, _x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();
var getOverlayLayout = function getOverlayLayout(overlay) {
  var layout = (0, _cssAlter.getData)(overlay, PREFIX_DEVICE) || (0, _cssAlter.getData)(overlay, PREFIX_ASPECTR);
  /* istanbul ignore else */
  if (layout && (_layout.ORDERED_DEVICES.has(layout) || _layout.ORDERED_ASPECTR.has(layout))) {
    return layout;
  } else {
    // shouldn't happen
    (0, _log.logError)(MH.bugError("No device or aspectRatio data attribute"));
    return null;
  }
};
var changeMatches = function changeMatches(layoutBitmask, thisLayoutData, prevLayoutData) {
  // True if the callback is interested in a change of device and there's a
  // change of device and the new device is one of the ones it's interested in
  // (or it's null, i.e. device is undefined).
  // And the same for aspect ratios.

  if ((prevLayoutData === null || prevLayoutData === void 0 ? void 0 : prevLayoutData.device) !== thisLayoutData.device && (!thisLayoutData.device || _layout.ORDERED_DEVICES.bit[thisLayoutData.device] & layoutBitmask)) {
    return true;
  }
  if ((prevLayoutData === null || prevLayoutData === void 0 ? void 0 : prevLayoutData.aspectRatio) !== thisLayoutData.aspectRatio && (!thisLayoutData.aspectRatio || _layout.ORDERED_ASPECTR.bit[thisLayoutData.aspectRatio] & layoutBitmask)) {
    return true;
  }
  return false;
};
var getNonIntersecting = function getNonIntersecting(nonIntersectingBitmask, entry) {
  var target = MH.targetOf(entry);
  /* istanbul ignore next */ // shouldn't happen
  if (!MH.isHTMLElement(target)) {
    (0, _log.logError)(MH.bugError("IntersectionObserver called us with '".concat(MH.typeOrClassOf(target), "'")));
    return nonIntersectingBitmask;
  }
  var layout = getOverlayLayout(target);
  var bit = 0;
  if (!layout) {
    // error already logged by getOverlayLayout
  } else if (_layout.ORDERED_DEVICES.has(layout)) {
    bit = _layout.ORDERED_DEVICES.bit[layout];
  } else if (_layout.ORDERED_ASPECTR.has(layout)) {
    bit = _layout.ORDERED_ASPECTR.bit[layout];
  } else {
    /* istanbul ignore next */ // shouldn't happen
    (0, _log.logError)(MH.bugError("Unknown device or aspectRatio data attribute: ".concat(layout)));
  }
  if (entry.isIntersecting) {
    nonIntersectingBitmask &= ~bit;
  } else {
    nonIntersectingBitmask |= bit;
  }
  return nonIntersectingBitmask;
};
var invokeCallback = function invokeCallback(callback, layoutData) {
  return callback.invoke(MH.copyObject(layoutData))["catch"](_log.logError);
};
//# sourceMappingURL=layout-watcher.cjs.map