"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GestureWatcher = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _cssAlter = require("../utils/css-alter.cjs");
var _directions = require("../utils/directions.cjs");
var _event2 = require("../utils/event.cjs");
var _tasks = require("../utils/tasks.cjs");
var _gesture = require("../utils/gesture.cjs");
var _gestureKey = require("../utils/gesture-key.cjs");
var _gesturePointer = require("../utils/gesture-pointer.cjs");
var _gestureTouch = require("../utils/gesture-touch.cjs");
var _gestureWheel = require("../utils/gesture-wheel.cjs");
var _log = require("../utils/log.cjs");
var _math = require("../utils/math.cjs");
var _text = require("../utils/text.cjs");
var _validation = require("../utils/validation.cjs");
var _callback2 = require("../modules/callback.cjs");
var _xMap = require("../modules/x-map.cjs");
var _debug = _interopRequireDefault(require("../debug/debug.cjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Watchers/GestureWatcher
 */
/**
 * {@link GestureWatcher} listens for user gestures resulting from wheel,
 * pointer, touch or key input events.
 *
 * It supports scroll, zoom or drag type gestures.
 *
 * It manages registered callbacks globally and reuses event listeners for more
 * efficient performance.
 */
var GestureWatcher = exports.GestureWatcher = /*#__PURE__*/function () {
  function GestureWatcher(config, key) {
    var _this = this;
    _classCallCheck(this, GestureWatcher);
    /**
     * Call the given handler whenever the user performs a gesture on the target
     * matching the given options.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same event target, even if the options differ. If the handler has already
     * been added for this target, either using {@link onGesture} or
     * {@link trackGesture}, then it will be removed and re-added with the
     * current options.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the options are invalid.
     */
    _defineProperty(this, "onGesture", void 0);
    /**
     * Removes a previously added handler.
     */
    _defineProperty(this, "offGesture", void 0);
    /**
     * This is the same as {@link onGesture} except that if `handler` is not
     * given, then it defaults to an internal handler that updates a set of CSS
     * variables on the target's style:
     *
     *   - `--lisn-js--<Intent>-delta-x`
     *   - `--lisn-js--<Intent>-delta-y`
     *   - `--lisn-js--<Intent>-delta-z`
     *
     * where and `<Intent>` is one of {@link GestureIntent} and the delta X, Y
     * and Z are the _total summed up_ `deltaX`, `deltaY` and `deltaZ` since the
     * callback was added, summed over all devices used (key, touch, etc).
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same target, even if the options differ. If the handler has already been
     * added for this target, either using {@link trackGesture} or using
     * {@link onGesture}, then it will be removed and re-added with the current
     * options.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the options are invalid.
     */
    _defineProperty(this, "trackGesture", void 0);
    /**
     * Removes a previously added handler for {@link trackGesture}.
     */
    _defineProperty(this, "noTrackGesture", void 0);
    if (key !== CONSTRUCTOR_KEY) {
      throw MH.illegalConstructorError("GestureWatcher.create");
    }
    var logger = _debug["default"] ? new _debug["default"].Logger({
      name: "GestureWatcher",
      logAtCreation: config
    }) : null;
    var allCallbacks = (0, _xMap.newXWeakMap)(function () {
      return MH.newMap();
    });

    // For each target and event type, add only 1 global listener that will then
    // manage the event queues and callbacks.
    var allListeners = (0, _xMap.newXWeakMap)(function () {
      return MH.newMap();
    });

    // ----------

    var createCallback = function createCallback(target, handler, options) {
      var _allCallbacks$get;
      MH.remove((_allCallbacks$get = allCallbacks.get(target)) === null || _allCallbacks$get === void 0 || (_allCallbacks$get = _allCallbacks$get.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      debug: logger === null || logger === void 0 || logger.debug5("Adding/updating handler for", options);
      var _getCallbackAndWrappe = getCallbackAndWrapper(handler, options, logger),
        _callback = _getCallbackAndWrappe._callback,
        _wrapper = _getCallbackAndWrappe._wrapper;
      _callback.onRemove(function () {
        return deleteHandler(target, handler, options);
      });
      allCallbacks.sGet(target).set(handler, {
        _callback: _callback,
        _wrapper: _wrapper,
        _options: options
      });
      return _callback;
    };

    // ----------

    // async for consistency with other watchers and future compatibility in
    // case of change needed
    var setupOnGesture = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(target, handler, userOptions) {
        var options, _iterator, _step, _allListeners$get, device, listeners;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              options = getOptions(config, userOptions || {});
              createCallback(target, handler, options);
              _iterator = _createForOfIteratorHelper(options._devices || _gesture.DEVICES);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  device = _step.value;
                  listeners = (_allListeners$get = allListeners.get(target)) === null || _allListeners$get === void 0 ? void 0 : _allListeners$get.get(device);
                  if (listeners) {
                    debug: logger === null || logger === void 0 || logger.debug4("Listeners already added for ".concat(device), target, options);
                  } else {
                    debug: logger === null || logger === void 0 || logger.debug4("Adding listeners for ".concat(device), target, options);
                    listeners = setupListeners(target, device, options);
                    allListeners.sGet(target).set(device, listeners);
                  }
                  listeners._nCallbacks++;
                  if (options._preventDefault) {
                    listeners._nPreventDefault++;
                  }
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function setupOnGesture(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }();

    // ----------

    var deleteHandler = function deleteHandler(target, handler, options) {
      MH.deleteKey(allCallbacks.get(target), handler);
      allCallbacks.prune(target);
      var _iterator2 = _createForOfIteratorHelper(options._devices || _gesture.DEVICES),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _allListeners$get2;
          var device = _step2.value;
          var listeners = (_allListeners$get2 = allListeners.get(target)) === null || _allListeners$get2 === void 0 ? void 0 : _allListeners$get2.get(device);
          if (listeners) {
            listeners._nCallbacks--;
            if (options._preventDefault) {
              listeners._nPreventDefault--;
            }
            if (!listeners._nCallbacks) {
              debug: logger === null || logger === void 0 || logger.debug4("No more callbacks for target and device ".concat(device, "; removing listeners"), target);
              MH.deleteKey(allListeners.get(target), device);
              listeners._remove();
            }
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    };

    // ----------

    var invokeCallbacks = function invokeCallbacks(target, device, event) {
      var _allListeners$get3, _allCallbacks$get2;
      var preventDefault = (((_allListeners$get3 = allListeners.get(target)) === null || _allListeners$get3 === void 0 || (_allListeners$get3 = _allListeners$get3.get(device)) === null || _allListeners$get3 === void 0 ? void 0 : _allListeners$get3._nPreventDefault) || 0) > 0;
      var isTerminated = false;
      var _iterator3 = _createForOfIteratorHelper(((_allCallbacks$get2 = allCallbacks.get(target)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2.values()) || []),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _wrapper = _step3.value._wrapper;
          isTerminated = _wrapper(target, device, event, preventDefault) || isTerminated;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      return isTerminated;
    };

    // ----------

    var setupListeners = function setupListeners(target, device, options) {
      var intents = options._intents;
      var hasAddedTabIndex = false;
      var hasPreventedSelect = false;
      if (device === MC.S_KEY && MH.isElement(target) && !MH.getTabIndex(target)) {
        hasAddedTabIndex = true;
        // enable element to receive keydown events
        MH.setTabIndex(target);
      } else if (MH.isElement(target) && device === MC.S_TOUCH) {
        if (options._preventDefault) {
          (0, _cssAlter.addClasses)(target, MC.PREFIX_NO_TOUCH_ACTION);
        }
        if (!intents || MH.includes(intents, MC.S_DRAG)) {
          hasPreventedSelect = true;
          (0, _event2.preventSelect)(target);
        }
      }
      var addOrRemoveListeners = function addOrRemoveListeners(action, listener, eventTypes) {
        var method = action === "add" ? _event2.addEventListenerTo : _event2.removeEventListenerFrom;
        var _iterator4 = _createForOfIteratorHelper(eventTypes),
          _step4;
        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var eventType = _step4.value;
            debug: logger === null || logger === void 0 || logger.debug8("".concat(action, " listener for ").concat(eventType), target);
            method(target, eventType, listener, {
              passive: false,
              capture: true
            });
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      };
      var addInitialListener = function addInitialListener() {
        return addOrRemoveListeners("add", initialListener, initiatingEvents[device]);
      };
      var removeInitialListener = function removeInitialListener() {
        return addOrRemoveListeners("remove", initialListener, initiatingEvents[device]);
      };
      var addOngoingListener = function addOngoingListener() {
        return addOrRemoveListeners("add", processEvent, ongoingEvents[device]);
      };
      var removeOngoingListener = function removeOngoingListener() {
        return addOrRemoveListeners("remove", processEvent, ongoingEvents[device]);
      };
      var initialListener = function initialListener(event) {
        processEvent(event);
        removeInitialListener();
        addOngoingListener();
      };
      var processEvent = function processEvent(event) {
        var isTerminated = invokeCallbacks(target, device, event);
        if (isTerminated) {
          removeOngoingListener();
          addInitialListener();
        }
      };
      addInitialListener();
      return {
        _nCallbacks: 0,
        _nPreventDefault: 0,
        _remove: function _remove() {
          if (MH.isElement(target)) {
            if (hasAddedTabIndex) {
              MH.unsetTabIndex(target);
            }
            (0, _cssAlter.removeClasses)(target, MC.PREFIX_NO_TOUCH_ACTION);
            if (hasPreventedSelect) {
              (0, _event2.undoPreventSelect)(target);
            }
          }
          removeOngoingListener();
          removeInitialListener();
        }
      };
    };

    // ----------

    this.trackGesture = function (element, handler, options) {
      if (!handler) {
        handler = setGestureCssProps;
        // initial values
        var _iterator5 = _createForOfIteratorHelper(_gesture.INTENTS),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var intent = _step5.value;
            setGestureCssProps(element, {
              intent: intent,
              totalDeltaX: 0,
              totalDeltaY: 0,
              totalDeltaZ: 1
            });
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }
      return setupOnGesture(element, handler, options);
    };

    // ----------

    this.noTrackGesture = function (element, handler) {
      if (!handler) {
        handler = setGestureCssProps;

        // delete the properties
        var _iterator6 = _createForOfIteratorHelper(_gesture.INTENTS),
          _step6;
        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var intent = _step6.value;
            setGestureCssProps(element, {
              intent: intent
            });
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
      }
      _this.offGesture(element, handler);
    };

    // ----------

    this.onGesture = setupOnGesture;

    // ----------

    this.offGesture = function (target, handler) {
      var _allCallbacks$get3;
      debug: logger === null || logger === void 0 || logger.debug5("Removing handler");
      MH.remove((_allCallbacks$get3 = allCallbacks.get(target)) === null || _allCallbacks$get3 === void 0 || (_allCallbacks$get3 = _allCallbacks$get3.get(handler)) === null || _allCallbacks$get3 === void 0 ? void 0 : _allCallbacks$get3._callback);
    };
  }
  return _createClass(GestureWatcher, null, [{
    key: "create",
    value:
    /**
     * Creates a new instance of GestureWatcher with the given
     * {@link GestureWatcherConfig}. It does not save it for future reuse.
     */
    function create() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new GestureWatcher(getConfig(config), CONSTRUCTOR_KEY);
    }

    /**
     * Returns an existing instance of GestureWatcher with the given
     * {@link GestureWatcherConfig}, or creates a new one.
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
        instance = new GestureWatcher(myConfig, CONSTRUCTOR_KEY);
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
 * The handler is invoked with two arguments:
 *
 * - the event target that was passed to the {@link GestureWatcher.onGesture}
 *   call (equivalent to
 *   {@link https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget | Event:currentTarget}).
 * - the {@link GestureData} that describes the gesture's progression since the
 *   last time the callback was called and since the callback was added.
 */
// ----------------------------------------
// Specific to a combination of target + device
var CONSTRUCTOR_KEY = MC.SYMBOL();
var instances = MH.newMap();
var getConfig = function getConfig(config) {
  var _config$preventDefaul, _config$naturalTouchS, _config$touchDragHold, _config$touchDragNumF;
  return {
    _preventDefault: (_config$preventDefaul = config.preventDefault) !== null && _config$preventDefaul !== void 0 ? _config$preventDefaul : true,
    _debounceWindow: (0, _math.toNonNegNum)(config[MC.S_DEBOUNCE_WINDOW], 150),
    _deltaThreshold: (0, _math.toNonNegNum)(config.deltaThreshold, 5),
    _angleDiffThreshold: (0, _math.toPosNum)(config.angleDiffThreshold, 35),
    _naturalTouchScroll: (_config$naturalTouchS = config.naturalTouchScroll) !== null && _config$naturalTouchS !== void 0 ? _config$naturalTouchS : true,
    _touchDragHoldTime: (_config$touchDragHold = config.touchDragHoldTime) !== null && _config$touchDragHold !== void 0 ? _config$touchDragHold : 500,
    _touchDragNumFingers: (_config$touchDragNumF = config.touchDragNumFingers) !== null && _config$touchDragNumF !== void 0 ? _config$touchDragNumF : 1
  };
};
var initiatingEvents = {
  key: [MC.S_KEYDOWN],
  // If the browser doesn't support pointer events, then
  // addEventListenerTo will transform it into mousedown
  //
  // We need to listen for click, since that occurs after a pointerup (i.e.
  // after a gesure is terminated and the ongoing listeners removed), but it
  // needs to have its default action prevented.
  pointer: [MC.S_POINTERDOWN, MC.S_CLICK],
  touch: [MC.S_TOUCHSTART],
  wheel: [MC.S_WHEEL]
};
var ongoingEvents = {
  key: [MC.S_KEYDOWN],
  pointer: [
  // If the browser doesn't support point events, then
  // addEventListenerTo will transform them into mouse*
  MC.S_POINTERDOWN, MC.S_POINTERUP,
  // would terminate
  MC.S_POINTERMOVE, MC.S_POINTERCANCEL,
  // would terminate
  MC.S_CLICK // would terminate; can be default-prevented
  ],
  touch: [MC.S_TOUCHSTART, MC.S_TOUCHEND, MC.S_TOUCHMOVE, MC.S_TOUCHCANCEL],
  wheel: [MC.S_WHEEL]
};
var fragmentGetters = _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, MC.S_KEY, _gestureKey.getKeyGestureFragment), MC.S_POINTER, _gesturePointer.getPointerGestureFragment), MC.S_TOUCH, _gestureTouch.getTouchGestureFragment), MC.S_WHEEL, _gestureWheel.getWheelGestureFragment);
var getOptions = function getOptions(config, options) {
  var _options$minTotalDelt, _options$maxTotalDelt, _options$minTotalDelt2, _options$maxTotalDelt2, _options$minTotalDelt3, _options$maxTotalDelt3, _options$preventDefau, _options$naturalTouch, _options$touchDragHol, _options$touchDragNum;
  var debounceWindow = (0, _math.toNonNegNum)(options[MC.S_DEBOUNCE_WINDOW], config._debounceWindow // watcher is never debounced, so apply default here
  );
  var deltaThreshold = (0, _math.toNonNegNum)(options.deltaThreshold, config._deltaThreshold);
  return {
    _devices: (0, _validation.validateStrList)("devices", options.devices, _gesture.isValidInputDevice) || null,
    _directions: (0, _validation.validateStrList)("directions", options.directions, _directions.isValidDirection) || null,
    _intents: (0, _validation.validateStrList)("intents", options.intents, _gesture.isValidIntent) || null,
    _minTotalDeltaX: (_options$minTotalDelt = options.minTotalDeltaX) !== null && _options$minTotalDelt !== void 0 ? _options$minTotalDelt : null,
    _maxTotalDeltaX: (_options$maxTotalDelt = options.maxTotalDeltaX) !== null && _options$maxTotalDelt !== void 0 ? _options$maxTotalDelt : null,
    _minTotalDeltaY: (_options$minTotalDelt2 = options.minTotalDeltaY) !== null && _options$minTotalDelt2 !== void 0 ? _options$minTotalDelt2 : null,
    _maxTotalDeltaY: (_options$maxTotalDelt2 = options.maxTotalDeltaY) !== null && _options$maxTotalDelt2 !== void 0 ? _options$maxTotalDelt2 : null,
    _minTotalDeltaZ: (_options$minTotalDelt3 = options.minTotalDeltaZ) !== null && _options$minTotalDelt3 !== void 0 ? _options$minTotalDelt3 : null,
    _maxTotalDeltaZ: (_options$maxTotalDelt3 = options.maxTotalDeltaZ) !== null && _options$maxTotalDelt3 !== void 0 ? _options$maxTotalDelt3 : null,
    _preventDefault: (_options$preventDefau = options.preventDefault) !== null && _options$preventDefau !== void 0 ? _options$preventDefau : config._preventDefault,
    _debounceWindow: debounceWindow,
    _deltaThreshold: deltaThreshold,
    _angleDiffThreshold: (0, _math.toNonNegNum)(options.angleDiffThreshold, config._angleDiffThreshold),
    _naturalTouchScroll: (_options$naturalTouch = options.naturalTouchScroll) !== null && _options$naturalTouch !== void 0 ? _options$naturalTouch : config._naturalTouchScroll,
    _touchDragHoldTime: (_options$touchDragHol = options.touchDragHoldTime) !== null && _options$touchDragHol !== void 0 ? _options$touchDragHol : config._touchDragHoldTime,
    _touchDragNumFingers: (_options$touchDragNum = options.touchDragNumFingers) !== null && _options$touchDragNum !== void 0 ? _options$touchDragNum : config._touchDragNumFingers
  };
};

// Since each callback needs to accumulate events during its debounce window
// and until its threshold is exceeded, we use a wrapper around the
// user-supplied handler to do that.
var getCallbackAndWrapper = function getCallbackAndWrapper(handler, options, logger) {
  var totalDeltaX = 0,
    totalDeltaY = 0,
    totalDeltaZ = 1;
  // When there's a pointer down, drag then pointerup, since we prevent
  // pointerdown default action, this results in a click event shortly
  // afterwards even when there's been a movement of the mouse. We detect that
  // and prevent this click.
  var preventNextClick = false;
  var directions = options._directions;
  var intents = options._intents;
  var minTotalDeltaX = options._minTotalDeltaX;
  var maxTotalDeltaX = options._maxTotalDeltaX;
  var minTotalDeltaY = options._minTotalDeltaY;
  var maxTotalDeltaY = options._maxTotalDeltaY;
  var minTotalDeltaZ = options._minTotalDeltaZ;
  var maxTotalDeltaZ = options._maxTotalDeltaZ;
  var deltaThreshold = options._deltaThreshold;
  var angleDiffThreshold = options._angleDiffThreshold;
  var reverseScroll = !options._naturalTouchScroll;
  var dragHoldTime = options._touchDragHoldTime;
  var dragNumFingers = options._touchDragNumFingers;

  // The event queue is cleared when the threshold is exceeded AND the debounce
  // window has passed. It's not necessary for the actual handler to be called
  // then (e.g. if the direction or intent doesn't match, it won't be).
  var eventQueue = [];
  var id = (0, _text.randId)();

  // Since handler could be a function or a callback (not callable), we wrap it
  // so that in case it's already a callback, its removal will result in
  // deleteHandler getting called. It is not debounced itself, instead there's
  // a debounced wrapper that invokes it.
  var callback = (0, _callback2.wrapCallback)(handler);

  // The debounced callback wrapper is what is debounced.
  // It accumulates total deltas and checks if the conditions (of threshold,
  // direction and intent) are satisfied before calling the real handler.
  //
  // Most importantly, since it is only called when the debounce window has
  // expired it can clear the event queue if the threshold is also exceeded.
  var debouncedWrapper = (0, _tasks.getDebouncedHandler)(options._debounceWindow, function (target, fragment, eventQueueCopy) {
    var _eventQueueCopy, _eventQueueCopy$;
    if (callback.isRemoved()) {
      return;
    }
    var deltaX = fragment.deltaX;
    var deltaY = fragment.deltaY;
    var deltaZ = fragment.deltaZ;
    var device = fragment.device;
    if (MH.round((0, _math.maxAbs)(deltaX, deltaY, (1 - deltaZ) * 100)) < deltaThreshold) {
      debug: logger === null || logger === void 0 || logger.debug7("[".concat(id, "] Delta threshold not exceeded for callback"));
      return;
    }
    debug: logger === null || logger === void 0 || logger.debug9("[".concat(id, "] Done summing events for ").concat(device));
    clearEventQueue(device, eventQueue);
    var newTotalDeltaX = (0, _math.toNumWithBounds)(totalDeltaX + deltaX, {
      min: minTotalDeltaX,
      max: maxTotalDeltaX
    });
    var newTotalDeltaY = (0, _math.toNumWithBounds)(totalDeltaY + deltaY, {
      min: minTotalDeltaY,
      max: maxTotalDeltaY
    });
    var newTotalDeltaZ = (0, _math.toNumWithBounds)((0, _gesture.addDeltaZ)(totalDeltaZ, deltaZ), {
      min: minTotalDeltaZ,
      max: maxTotalDeltaZ
    });
    if (newTotalDeltaX === totalDeltaX && newTotalDeltaY === totalDeltaY && newTotalDeltaZ === totalDeltaZ) {
      return;
    }
    totalDeltaX = newTotalDeltaX;
    totalDeltaY = newTotalDeltaY;
    totalDeltaZ = newTotalDeltaZ;
    var direction = fragment.direction;
    var intent = fragment.intent;
    var time = ((_eventQueueCopy = eventQueueCopy[MH.lengthOf(eventQueueCopy) - 1]) === null || _eventQueueCopy === void 0 ? void 0 : _eventQueueCopy.timeStamp) - ((_eventQueueCopy$ = eventQueueCopy[0]) === null || _eventQueueCopy$ === void 0 ? void 0 : _eventQueueCopy$.timeStamp) || 0;
    var data = {
      device: device,
      direction: direction,
      intent: intent,
      deltaX: deltaX,
      deltaY: deltaY,
      deltaZ: deltaZ,
      time: time,
      totalDeltaX: totalDeltaX,
      totalDeltaY: totalDeltaY,
      totalDeltaZ: totalDeltaZ
    };
    if (direction !== MC.S_NONE && (!directions || MH.includes(directions, direction)) && (!intents || MH.includes(intents, intent))) {
      callback.invoke(target, data, eventQueueCopy)["catch"](_log.logError);
    } else {
      debug: logger === null || logger === void 0 || logger.debug7("[".concat(id, "] Directions or intents not matching for callback"));
    }
  });

  // This wrapper is NOT debounced and adds the events to the queue, prevents
  // default action if needed, and indicates whether the gesture is terminated.
  var wrapper = function wrapper(target, device, event, preventDefault) {
    eventQueue.push(event);
    var fragment = fragmentGetters[device](eventQueue, {
      angleDiffThreshold: angleDiffThreshold,
      deltaThreshold: deltaThreshold,
      reverseScroll: reverseScroll,
      dragHoldTime: dragHoldTime,
      dragNumFingers: dragNumFingers
    });
    debug: logger === null || logger === void 0 || logger.debug8("[".concat(id, "] Got fragment for ").concat(device, " (").concat(event.type, ")"), fragment, [].concat(eventQueue).map(function (e) {
      return e.type;
    }));
    if (preventDefault) {
      preventDefaultActionFor(event, !!fragment || event.type === MC.S_CLICK && preventNextClick);
    }
    if (fragment === false) {
      // not enough events in the queue, pass
      debug: logger === null || logger === void 0 || logger.debug9("[".concat(id, "] Not enough events for gesture ").concat(device));
      return false;
    } else if (fragment === null) {
      // consider the gesture terminated
      clearEventQueue(device, eventQueue);
      debug: logger === null || logger === void 0 || logger.debug9("[".concat(id, "] Gesture for ").concat(device, " terminated"));
      return true;
    }
    if (device === MC.S_POINTER) {
      // If we're here, there's been a drag, expect a click immediately
      // afterwards and prevent default action.
      preventNextClick = true;
      MH.setTimer(function () {
        preventNextClick = false;
      }, 10);
    }
    debouncedWrapper(target, fragment, [].concat(eventQueue) // copy
    );
    return false;
  };
  return {
    _callback: callback,
    _wrapper: wrapper
  };
};
var clearEventQueue = function clearEventQueue(device, queue) {
  var keepLastEvent = device === MC.S_POINTER || device === MC.S_TOUCH;
  queue.splice(0, MH.lengthOf(queue) - (keepLastEvent ? 1 : 0));
};
var preventDefaultActionFor = function preventDefaultActionFor(event, isActualGesture) {
  var target = event.currentTarget;
  var eventType = event.type;
  var isPointerDown = eventType === MC.S_POINTERDOWN || eventType === MC.S_MOUSEDOWN;
  if (eventType === MC.S_TOUCHMOVE || eventType === MC.S_WHEEL || (eventType === MC.S_CLICK || eventType === MC.S_KEYDOWN) && isActualGesture || isPointerDown && event.buttons === 1) {
    MH.preventDefault(event);
    if (isPointerDown && MH.isHTMLElement(target)) {
      // Otherwise capturing key events won't work
      target.focus({
        preventScroll: true
      });
    }
  }
};
var setGestureCssProps = function setGestureCssProps(target, data) {
  var intent = data.intent;
  if (!MH.isElement(target) || !intent || intent === MC.S_UNKNOWN) {
    return;
  }
  var prefix = "".concat(intent, "-");
  if (intent === MC.S_ZOOM) {
    (0, _cssAlter.setNumericStyleProps)(target, {
      deltaZ: data.totalDeltaZ
    }, {
      _prefix: prefix,
      _numDecimal: 2
    }); // don't await here
  } else {
    (0, _cssAlter.setNumericStyleProps)(target, {
      deltaX: data.totalDeltaX,
      deltaY: data.totalDeltaY
    }, {
      _prefix: prefix
    }); // don't await here
  }
};
//# sourceMappingURL=gesture-watcher.cjs.map