function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
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
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * ## Specification for the HTML API for widgets
 *
 * The following describes the general syntax when using the HTML API for
 * automatic creation of widgets based on data attributes
 * ({@link Settings.settings.autoWidgets | settings.autoWidgets} must be true.
 *
 * A widget specification should be given as a
 * `data-lisn-<WidgetName>="<WidgetConfList>"` attribute.
 *
 * Alternatively, if using all default configurations, you can simply add the
 * `lisn-<WidgetName>` CSS class. Specifying a configuration using CSS classes
 * is not currently possible for widgets, only triggers.
 *
 * The general specification for a widget is of the form:
 *
 * ```
 * <WidgetConfList> ::= <WidgetConf> { ";" <WidgetConf> }
 *
 * <WidgetConf> ::= [ <WidgetOption> { "|" <WidgetOption> } ]
 *
 * <WidgetOption> ::=
 *     <BooleanOptionName> [ "=" ( "false" | "true" ) ] |
 *     <OptionName> "=" <OptionValue>
 * ```
 *
 * **NOTE:**
 *
 * There can be 0 or more spaces around any of the separator characters.
 *
 * Not all widgets support multiple instances per single element and therefore
 * multiple configurations. Refer to the specific widget.
 *
 * The characters "|", ";", "=" are reserved separators and cannot be used
 * literally as part of an option value.
 *
 * @module Widgets
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { settings } from "../globals/settings.js";
import { hasClass, getData } from "../utils/css-alter.js";
import { waitForInteractive } from "../utils/dom-events.js";
import { logWarn } from "../utils/log.js";
import { toArrayIfSingle } from "../utils/misc.js";
import { waitForDelay } from "../utils/tasks.js";
import { formatAsString, kebabToCamelCase, splitOn } from "../utils/text.js";
import { wrapCallback } from "../modules/callback.js";
import { newXWeakMap } from "../modules/x-map.js";
import { DOMWatcher } from "../watchers/dom-watcher.js";
import debug from "../debug/debug.js";
export var Widget = /*#__PURE__*/function () {
  /**
   * **IMPORTANT:** If ID is given and there's already a widget with this ID on
   * this element, it will be destroyed!
   */
  function Widget(element, config) {
    var _this = this;
    _classCallCheck(this, Widget);
    /**
     * Disables the functionality of the widget. What this means is specific to
     * each widget.
     */
    _defineProperty(this, "disable", void 0);
    /**
     * Re-enables the functionality of the widget. What this means is specific to
     * each widget.
     */
    _defineProperty(this, "enable", void 0);
    /**
     * Re-enables the widget if disabled, otherwise disables it.
     */
    _defineProperty(this, "toggleEnable", void 0);
    /**
     * The given handler will be called when the widget is disabled.
     */
    _defineProperty(this, "onDisable", void 0);
    /**
     * The given handler will be called when the widget is enabled.
     */
    _defineProperty(this, "onEnable", void 0);
    /**
     * Returns true if the widget is currently disabled.
     */
    _defineProperty(this, "isDisabled", void 0);
    /**
     * Undoes all modifications to the element and returns it to its original state.
     *
     * You will need to recreate it if you want to enable its functionality again.
     */
    _defineProperty(this, "destroy", void 0);
    /**
     * The given handler will be called when the widget is destroyed.
     */
    _defineProperty(this, "onDestroy", void 0);
    /**
     * Returns true if the widget is destroyed.
     */
    _defineProperty(this, "isDestroyed", void 0);
    /**
     * Returns the element passed to the widget constructor.
     */
    _defineProperty(this, "getElement", void 0);
    var logger = debug ? new debug.Logger({
      name: "".concat(this.constructor.name, "-").concat(formatAsString(element)),
      logAtCreation: this
    }) : null;
    var id = config === null || config === void 0 ? void 0 : config.id;
    if (id) {
      var _instances$get;
      (_instances$get = instances.get(element)) === null || _instances$get === void 0 || (_instances$get = _instances$get.get(id)) === null || _instances$get === void 0 || _instances$get.destroy(); // don't await here
      instances.sGet(element).set(id, this);
    }
    var isDisabled = false;
    var isDestroyed = false;
    var destroyPromise;
    var enableCallbacks = MH.newSet();
    var disableCallbacks = MH.newSet();
    var destroyCallbacks = MH.newSet();
    this.disable = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var _iterator, _step, callback;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (isDisabled) {
              _context.next = 20;
              break;
            }
            debug: logger === null || logger === void 0 || logger.debug8("Disabling");
            isDisabled = true;
            _iterator = _createForOfIteratorHelper(disableCallbacks);
            _context.prev = 4;
            _iterator.s();
          case 6:
            if ((_step = _iterator.n()).done) {
              _context.next = 12;
              break;
            }
            callback = _step.value;
            _context.next = 10;
            return callback.invoke(_this);
          case 10:
            _context.next = 6;
            break;
          case 12:
            _context.next = 17;
            break;
          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](4);
            _iterator.e(_context.t0);
          case 17:
            _context.prev = 17;
            _iterator.f();
            return _context.finish(17);
          case 20:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[4, 14, 17, 20]]);
    }));
    this.enable = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var _iterator2, _step2, callback;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if (!(!isDestroyed && isDisabled)) {
              _context2.next = 20;
              break;
            }
            debug: logger === null || logger === void 0 || logger.debug8("Enabling");
            isDisabled = false;
            _iterator2 = _createForOfIteratorHelper(enableCallbacks);
            _context2.prev = 4;
            _iterator2.s();
          case 6:
            if ((_step2 = _iterator2.n()).done) {
              _context2.next = 12;
              break;
            }
            callback = _step2.value;
            _context2.next = 10;
            return callback.invoke(_this);
          case 10:
            _context2.next = 6;
            break;
          case 12:
            _context2.next = 17;
            break;
          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](4);
            _iterator2.e(_context2.t0);
          case 17:
            _context2.prev = 17;
            _iterator2.f();
            return _context2.finish(17);
          case 20:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[4, 14, 17, 20]]);
    }));
    this.toggleEnable = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (isDestroyed) {
              _context3.next = 3;
              break;
            }
            _context3.next = 3;
            return (isDisabled ? _this.enable : _this.disable)();
          case 3:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    this.onDisable = function (handler) {
      return disableCallbacks.add(wrapCallback(handler));
    };
    this.onEnable = function (handler) {
      return enableCallbacks.add(wrapCallback(handler));
    };
    this.isDisabled = function () {
      return isDisabled;
    };
    this.destroy = function () {
      if (!destroyPromise) {
        destroyPromise = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
          var _iterator3, _step3, callback, elInstances;
          return _regeneratorRuntime().wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                debug: logger === null || logger === void 0 || logger.debug8("Destroying");
                isDestroyed = true;
                _context4.next = 4;
                return _this.disable();
              case 4:
                _iterator3 = _createForOfIteratorHelper(destroyCallbacks);
                _context4.prev = 5;
                _iterator3.s();
              case 7:
                if ((_step3 = _iterator3.n()).done) {
                  _context4.next = 13;
                  break;
                }
                callback = _step3.value;
                _context4.next = 11;
                return callback.invoke(_this);
              case 11:
                _context4.next = 7;
                break;
              case 13:
                _context4.next = 18;
                break;
              case 15:
                _context4.prev = 15;
                _context4.t0 = _context4["catch"](5);
                _iterator3.e(_context4.t0);
              case 18:
                _context4.prev = 18;
                _iterator3.f();
                return _context4.finish(18);
              case 21:
                enableCallbacks.clear();
                disableCallbacks.clear();
                destroyCallbacks.clear();
                if (id) {
                  elInstances = instances.get(element);
                  if ((elInstances === null || elInstances === void 0 ? void 0 : elInstances.get(id)) === _this) {
                    MH.deleteKey(elInstances, id);
                    instances.prune(element);
                  }
                }
              case 25:
              case "end":
                return _context4.stop();
            }
          }, _callee4, null, [[5, 15, 18, 21]]);
        }))();
      }
      return destroyPromise;
    };
    this.onDestroy = function (handler) {
      return destroyCallbacks.add(wrapCallback(handler));
    };
    this.isDestroyed = function () {
      return isDestroyed;
    };
    this.getElement = function () {
      return element;
    };
  }
  return _createClass(Widget, null, [{
    key: "get",
    value:
    /**
     * Retrieve an existing widget by element and ID.
     */
    function get(element, id) {
      var _instances$get2;
      return ((_instances$get2 = instances.get(element)) === null || _instances$get2 === void 0 ? void 0 : _instances$get2.get(id)) || null;
    }
  }]);
}();

/**
 * **NOTE:** If the function returns a widget or a list of widgets created for
 * the given element, then each one will be automatically destroyed if the
 * element is removed from the DOM.
 */

/**
 * @see {@link getWidgetConfig}.
 */

/**
 * @see {@link getWidgetConfig}.
 */

/**
 * @see {@link getWidgetConfig}.
 */

/**
 * @see {@link getWidgetConfig}.
 */

/**
 * Enables automatic setting up of a widget from an elements matching the given
 * selector.
 *
 * If {@link settings.autoWidgets} is true, nothing is done. Otherwise,
 * when an element matching the selector is added to the DOM, `newWidget` will
 * be called and it's expected to setup the widget.
 *
 * **IMPORTANT:** The widget that is returned by `newWidget` will be
 * automatically destroyed when the element that created them is removed from
 * the DOM.
 *
 * **IMPORTANT:** If a widget by that name is already registered, the current
 * call does nothing, even if the remaining arguments differ.
 *
 * @param {} name       The name of the widget. Should be in kebab-case.
 * @param {} newWidget  Called for every element matching the widget selector.
 * @param {} configValidator
 *                      A validator object, or a function that returns such an
 *                      object, for all options supported by the widget. If
 *                      given, then the `newWidget` function will also be
 *                      passed a configuration object constructed from the
 *                      element's data attribute.
 * @param {} [options.selector]
 *                      The selector to match elements for. If not given, then
 *                      uses a default value of `[data-lisn-<name>], .lisn-<name>`
 * @param {} [options.supportsMultiple]
 *                      If true, and if `configValidator` is given, then the
 *                      value of the element's widget specific data attribute
 *                      will be split on ";" and each one parsed individually
 *                      as a configuration. Then the `newWidget` function will
 *                      be called once for each configuration.
 */
export var registerWidget = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(name, newWidget, configValidator, options) {
    var _options$selector;
    var prefixedName, selector, domWatcher;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          if (!registeredWidgets.has(name)) {
            _context6.next = 2;
            break;
          }
          return _context6.abrupt("return");
        case 2:
          registeredWidgets.add(name);

          // init after DOM loaded so that the settings can be configured by the user
          // straight after loading LISN.js
          _context6.next = 5;
          return waitForInteractive();
        case 5:
          prefixedName = MH.prefixName(name);
          selector = (_options$selector = options === null || options === void 0 ? void 0 : options.selector) !== null && _options$selector !== void 0 ? _options$selector : getDefaultWidgetSelector(prefixedName);
          if (settings.autoWidgets) {
            domWatcher = DOMWatcher.reuse();
            domWatcher.onMutation(/*#__PURE__*/function () {
              var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(operation) {
                var element, thisConfigValidator, widgets, configSpecs, dataAttr, _i, _configSpecs, spec, _config, theseWidgets;
                return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                  while (1) switch (_context5.prev = _context5.next) {
                    case 0:
                      element = MH.currentTargetOf(operation);
                      if (!MH.isFunction(configValidator)) {
                        _context5.next = 7;
                        break;
                      }
                      _context5.next = 4;
                      return configValidator(element);
                    case 4:
                      _context5.t0 = _context5.sent;
                      _context5.next = 8;
                      break;
                    case 7:
                      _context5.t0 = configValidator;
                    case 8:
                      thisConfigValidator = _context5.t0;
                      widgets = [];
                      configSpecs = [];
                      dataAttr = getData(element, prefixedName);
                      if (options !== null && options !== void 0 && options.supportsMultiple) {
                        if (hasClass(element, prefixedName)) {
                          configSpecs.push("");
                        }
                        if (dataAttr !== null) {
                          configSpecs.push.apply(configSpecs, _toConsumableArray(dataAttr ? splitOn(dataAttr, ";", true) : [""]));
                        }
                      } else {
                        configSpecs.push(dataAttr !== null && dataAttr !== void 0 ? dataAttr : "");
                      }
                      _i = 0, _configSpecs = configSpecs;
                    case 14:
                      if (!(_i < _configSpecs.length)) {
                        _context5.next = 31;
                        break;
                      }
                      spec = _configSpecs[_i];
                      if (!thisConfigValidator) {
                        _context5.next = 22;
                        break;
                      }
                      _context5.next = 19;
                      return fetchWidgetConfig(spec, thisConfigValidator);
                    case 19:
                      _context5.t1 = _context5.sent;
                      _context5.next = 23;
                      break;
                    case 22:
                      _context5.t1 = undefined;
                    case 23:
                      _config = _context5.t1;
                      _context5.next = 26;
                      return newWidget(element, _config);
                    case 26:
                      theseWidgets = _context5.sent;
                      if (theseWidgets) {
                        widgets.push.apply(widgets, _toConsumableArray(toArrayIfSingle(theseWidgets)));
                      }
                    case 28:
                      _i++;
                      _context5.next = 14;
                      break;
                    case 31:
                      // auto-destroy on element remove
                      if (MH.lengthOf(widgets)) {
                        domWatcher.onMutation(function () {
                          var _iterator4 = _createForOfIteratorHelper(widgets),
                            _step4;
                          try {
                            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                              var w = _step4.value;
                              w.destroy();
                            }
                          } catch (err) {
                            _iterator4.e(err);
                          } finally {
                            _iterator4.f();
                          }
                        }, {
                          target: element,
                          categories: [MC.S_REMOVED]
                        });
                      }
                    case 32:
                    case "end":
                      return _context5.stop();
                  }
                }, _callee5);
              }));
              return function (_x5) {
                return _ref6.apply(this, arguments);
              };
            }(), {
              selector: selector,
              categories: [MC.S_ADDED]
            });
          }
        case 8:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function registerWidget(_x, _x2, _x3, _x4) {
    return _ref5.apply(this, arguments);
  };
}();

/**
 * Returns a configuration object from the given user input, which can be
 * either an object or a `<separator>` separated string of key=values.
 *
 * If `input` is a string, it must be of the format:
 *
 * ```
 * <UserConfigString> ::= <OptionSpec> { <Separator> <OptionSpec> }
 *
 * <OptionSpec> ::=
 *     <BooleanOptionName> [ "=" ( "false" | "true" ) ] |
 *     <OptionName> "=" <OptionValue>
 * ```
 *
 * By default, for widgets `<separator>` is "|".
 *
 * **NOTE:** If `input` is a string, option names will be converted from
 * kebab-case to camelCase.
 *
 * The given `validator` defines the shape of the returned object. It is called
 * for each entry _in the `validator` object_, with that key and the
 * corresponding value from the input configuration, as the two parameters.
 *
 * If a key is not found in the input, the value passed to the validating
 * function will be `undefined`.
 *
 * If the input is a string and a key has no value, the value passed to the
 * validating function will be an empty string `""`.
 *
 * The final configuration contains all keys from the `validator` object with
 * the value that the validating function for each key returned.
 *
 * There are several built-in validating functions that you can make use of.
 *
 * @see {@link Utils.validateStrList}
 * @see {@link Utils.validateNumber}
 * @see {@link Utils.validateBoolean}
 * @see {@link Utils.validateString}
 * @see {@link Utils.validateBooleanOrString}
 */
export var getWidgetConfig = function getWidgetConfig(input, validator) {
  var separator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "|";
  var config = {};
  if (!(input instanceof Object)) {
    input = toOptionsObject(input, separator);
  }
  for (var _key in validator) {
    config[_key] = validator[_key](_key, input[_key]);
  }
  return config;
};

/**
 * Like {@link getWidgetConfig} but it accepts an object whose validator
 * functions may return a promise.
 */
export var fetchWidgetConfig = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(input, validator) {
    var separator,
      config,
      configPromises,
      _key2,
      _args7 = arguments;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          separator = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : "|";
          config = {};
          configPromises = getWidgetConfig(input, validator, separator);
          _context7.t0 = _regeneratorRuntime().keys(configPromises);
        case 4:
          if ((_context7.t1 = _context7.t0()).done) {
            _context7.next = 11;
            break;
          }
          _key2 = _context7.t1.value;
          _context7.next = 8;
          return configPromises[_key2];
        case 8:
          config[_key2] = _context7.sent;
          _context7.next = 4;
          break;
        case 11:
          return _context7.abrupt("return", config);
        case 12:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function fetchWidgetConfig(_x6, _x7) {
    return _ref7.apply(this, arguments);
  };
}();

/**
 * @ignore
 * @internal
 */
export var getDefaultWidgetSelector = function getDefaultWidgetSelector(prefix) {
  return ".".concat(prefix, ",[data-").concat(prefix, "]");
};

/**
 * @ignore
 * @internal
 */
export var fetchUniqueWidget = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(name, element, Type) {
    var widget;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          widget = Type.get(element);
          if (widget) {
            _context8.next = 8;
            break;
          }
          _context8.next = 4;
          return waitForDelay(0);
        case 4:
          // in case it's being processed now
          widget = Type.get(element);
          if (widget) {
            _context8.next = 8;
            break;
          }
          logWarn("No ".concat(name, " widget for element ").concat(formatAsString(element)));
          return _context8.abrupt("return", null);
        case 8:
          return _context8.abrupt("return", widget);
        case 9:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function fetchUniqueWidget(_x8, _x9, _x10) {
    return _ref8.apply(this, arguments);
  };
}();
var instances = newXWeakMap(function () {
  return MH.newMap();
});
var registeredWidgets = MH.newSet();

// --------------------

var toOptionsObject = function toOptionsObject(input, separator) {
  var options = {};
  var _iterator5 = _createForOfIteratorHelper(MH.filter(splitOn(input !== null && input !== void 0 ? input : "", separator, true), function (v) {
      return !MH.isEmpty(v);
    })),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var entry = _step5.value;
      var _splitOn = splitOn(entry, /\s*=\s*/, true, 1),
        _splitOn2 = _slicedToArray(_splitOn, 2),
        _key3 = _splitOn2[0],
        value = _splitOn2[1];
      options[kebabToCamelCase(_key3)] = value !== null && value !== void 0 ? value : "";
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
  return options;
};
//# sourceMappingURL=widget.js.map