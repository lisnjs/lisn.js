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
 * ## Specification for the HTML API for triggers
 *
 * The following describes the general syntax when using the HTML API and
 * automatic widgets
 * ({@link Settings.settings.autoWidgets | settings.autoWidgets} is true)
 * specifically for triggers and actions.
 *
 * A trigger specification should be given as a
 * `data-lisn-on-<TriggerName>="<TriggerSpecList>"` attribute.
 * A fallback option of using a CSS class of the form
 * `lisn-on-<TriggerName>--<TriggerSpec>` is also supported but not recommended.
 *
 * The general specification for a trigger is of the form:
 *
 * ```
 * <TriggerSpecList> ::= <TriggerSpec> { ";" <TriggerSpec> }
 *
 * <TriggerSpec> ::= [ <TriggerArg> { "," <TriggerArg> } ]
 *                   "@" <ActionSpec> { "@" <ActionSpec> }
 *                   { "+" <TriggerOption> }
 *
 * <TriggerOption> ::=
 *     <BooleanOptionName> [ "=" ( "false" | "true" ) ] |
 *     <OptionName> "=" <OptionValue>
 *
 * <ActionSpec> ::= <ActionName> [ ":" <ActionArgOrOption> { "," <ActionArgOrOption> } ]
 *
 * <ActionArgOrOption> ::= <ActionArg> | <OptionName> "=" <OptionValue>
 * ```
 *
 * where `<TriggerArg>` is the particular trigger's main argument, which could
 * be required or optional (and not all triggers accept an argument). See each
 * trigger's specification for their arguments and options.
 *
 * Also refer to each action for their accepted arguments and/or options if any.
 *
 * **NOTE:**
 *
 * There can be 0 or more spaces around any of the separator characters.
 *
 * At least one action (with a preceding "@" character) is always required.
 *
 * The characters ";", ",", "=", "@", "+" and ":" are reserved separators and
 * cannot be used literally as part of an argument or option value.
 *
 * @module Triggers
 *
 * @categoryDescription Manual run
 * {@link Trigger} is the base trigger class that you can extend when building
 * custom triggers and it also registers a trigger that needs to be run
 * manually (by e.g. the {@link Actions.Run | Run} action).
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { LisnUsageError } from "../globals/errors.js";
import { wrapCallback } from "../modules/callback.js";
import { getData } from "../utils/css-alter.js";
import { waitForReferenceElement } from "../utils/dom-search.js";
import { waitForDelay } from "../utils/tasks.js";
import { formatAsString, randId, splitOn } from "../utils/text.js";
import { validateString, validateNumber, validateBoolean } from "../utils/validation.js";
import { fetchAction } from "../actions/action.js";
import { Widget, registerWidget, fetchWidgetConfig } from "../widgets/widget.js";
import debug from "../debug/debug.js";

/**
 * {@link Trigger} is the base trigger class that you can extend when building
 * custom triggers and it also registers a trigger that needs to be run
 * manually (by e.g. the {@link Actions.Run | Run} action).
 *
 * -------
 *
 * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
 * specification.
 *
 * @example
 * Show the element 1000ms after the first time the trigger is run.
 *
 * ```html
 * <div data-lisn-on-run="@show +once +delay=1000"></div>
 * ```
 *
 * @category Manual run
 */
export var Trigger = /*#__PURE__*/function (_Widget) {
  /**
   * If no actions are supplied, nothing is done.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the config is invalid.
   */
  function Trigger(element, actions, config) {
    var _config$once, _config$oneWay, _config$doDelay, _config$undoDelay;
    var _this;
    _classCallCheck(this, Trigger);
    _this = _callSuper(this, Trigger, [element, config]);
    /**
     * "Do"es all the {@link Action}s linked to the trigger.
     */
    _defineProperty(_this, "run", void 0);
    /**
     * "Undo"es all the {@link Action}s linked to the trigger.
     */
    _defineProperty(_this, "reverse", void 0);
    /**
     * "Toggle"s all the {@link Action}s linked to the trigger.
     */
    _defineProperty(_this, "toggle", void 0);
    /**
     * Returns the trigger's actions.
     */
    _defineProperty(_this, "getActions", void 0);
    /**
     * Returns the trigger config.
     */
    _defineProperty(_this, "getConfig", void 0);
    var logger = debug ? new debug.Logger({
      name: "Trigger-".concat(formatAsString(element)),
      logAtCreation: {
        actions: actions,
        config: config
      }
    }) : null;
    var once = (_config$once = config === null || config === void 0 ? void 0 : config.once) !== null && _config$once !== void 0 ? _config$once : false;
    var oneWay = (_config$oneWay = config === null || config === void 0 ? void 0 : config.oneWay) !== null && _config$oneWay !== void 0 ? _config$oneWay : false;
    var delay = (config === null || config === void 0 ? void 0 : config.delay) || 0;
    var doDelay = (_config$doDelay = config === null || config === void 0 ? void 0 : config.doDelay) !== null && _config$doDelay !== void 0 ? _config$doDelay : delay;
    var undoDelay = (_config$undoDelay = config === null || config === void 0 ? void 0 : config.undoDelay) !== null && _config$undoDelay !== void 0 ? _config$undoDelay : delay;
    var lastCallId;
    // false if next should be do; true if next should be undo.
    // Used for determining delays only.
    var toggleState = false;
    var callActions = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(delay, callFn, newToggleState) {
        var myCallId, _iterator, _step, action;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!_this.isDisabled()) {
                _context.next = 2;
                break;
              }
              return _context.abrupt("return");
            case 2:
              myCallId = randId();
              lastCallId = myCallId;
              debug: logger === null || logger === void 0 || logger.debug10("callActions [".concat(myCallId, "] (new toggle state ").concat(newToggleState, ")"), callFn);
              if (!delay) {
                _context.next = 11;
                break;
              }
              _context.next = 8;
              return waitForDelay(delay);
            case 8:
              if (!(lastCallId !== myCallId)) {
                _context.next = 11;
                break;
              }
              // overriden by subsequent call
              debug: logger === null || logger === void 0 || logger.debug10("callActions [".concat(myCallId, "]: overriden by ").concat(lastCallId));
              return _context.abrupt("return");
            case 11:
              _iterator = _createForOfIteratorHelper(actions);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  action = _step.value;
                  debug: logger === null || logger === void 0 || logger.debug10("callActions [".concat(myCallId, "]"), action);
                  callFn(action);
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              toggleState = newToggleState;
              if (toggleState && once) {
                MH.remove(run);
                MH.remove(reverse);
                MH.remove(toggle);
              }
            case 15:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function callActions(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }();
    var run = wrapCallback(function () {
      callActions(doDelay, function (action) {
        action["do"]();
      }, true); // don't await
    });
    var reverse = wrapCallback(function () {
      if (!oneWay) {
        callActions(undoDelay, function (action) {
          action.undo();
        }, false); // don't await
      }
    });
    var toggle = wrapCallback(function () {
      callActions(toggleState ? undoDelay : doDelay, function (action) {
        action[MC.S_TOGGLE]();
      }, !toggleState); // don't await
    });

    // ----------

    _this.run = run.invoke;
    _this.reverse = reverse.invoke;
    _this[MC.S_TOGGLE] = oneWay ? run.invoke : toggle.invoke;
    _this.getActions = function () {
      return _toConsumableArray(actions);
    }; // copy
    _this.getConfig = function () {
      return MH.copyObject(config || {});
    };
    return _this;
  }
  _inherits(Trigger, _Widget);
  return _createClass(Trigger, null, [{
    key: "get",
    value: function get(element, id) {
      var instance = _superPropGet(Trigger, "get", this, 2)([element, id]);
      if (MH.isInstanceOf(instance, Trigger)) {
        return instance;
      }
      return null;
    }
  }, {
    key: "register",
    value: function register() {
      registerTrigger("run", function (element, a, actions, config) {
        return new Trigger(element, actions, config);
      }, {});
    }
  }]);
}(Widget);

/**
 * @interface
 */

/**
 * Registers the given trigger as a widget to be automatically configured for
 * all elements that have a trigger specification with the given name.
 *
 * A trigger specification can be given as a
 * `data-lisn-on-<TriggerName>="<TriggerSpec> { ";" <TriggerSpec> }"` attribute
 * or as one or more `lisn-on-<TriggerName>--<TriggerSpec>` classes.
 *
 * See the top of the {@link Triggers} page for an explanation of `<TriggerSpec>`.
 *
 * Using classes instead of attributes is not recommended and only available as
 * a fallback option.
 *
 * **IMPORTANT:** If a trigger by that name is already registered, the current
 * call does nothing, even if the remaining arguments differ.
 *
 * @param {} name       The name of the trigger. Should be in kebab-case.
 * @param {} newTrigger Called for every trigger specification on any element
 *                      that has one or more trigger specifications.
 * @param {} configValidator
 *                      A validator object, or a function that returns such an
 *                      object, for all options that are specific to the
 *                      trigger. Base options (in {@link TriggerConfig}) will
 *                      be parsed automatically and don't need to be handled by
 *                      `configValidator`.
 *                      If the parameter is a function, it will be called with
 *                      the element on which the trigger is being defined.
 *
 * @see {@link registerWidget}
 */
export var registerTrigger = function registerTrigger(name, newTrigger, configValidator) {
  var clsPref = MH.prefixName("on-".concat(name));
  var newWidget = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(element) {
      var _getData;
      var widgets, baseConfigValidator, thisConfigValidator, allSpecs, _iterator2, _step2, cls, _iterator3, _step3, _config$actOn, spec, _splitOn, _splitOn2, tmp, configSpec, _splitOn3, _splitOn4, argSpec, allActionSpecs, _args2, _config, actionTarget, _actions, _iterator4, _step4, actionSpec, _splitOn5, _splitOn6, _name, actionArgsAndOptions;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            widgets = [];
            baseConfigValidator = newBaseConfigValidator(element);
            if (!MH.isFunction(configValidator)) {
              _context2.next = 8;
              break;
            }
            _context2.next = 5;
            return configValidator(element);
          case 5:
            _context2.t0 = _context2.sent;
            _context2.next = 9;
            break;
          case 8:
            _context2.t0 = configValidator;
          case 9:
            thisConfigValidator = _context2.t0;
            allSpecs = splitOn((_getData = getData(element, MH.prefixName("on-".concat(name)))) !== null && _getData !== void 0 ? _getData : "", TRIGGER_SEP, true);
            _iterator2 = _createForOfIteratorHelper(MH.classList(element));
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                cls = _step2.value;
                if (cls.startsWith("".concat(clsPref, "--"))) {
                  allSpecs.push(cls.slice(MH.lengthOf(clsPref) + 2));
                }
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
            _iterator3 = _createForOfIteratorHelper(allSpecs);
            _context2.prev = 14;
            _iterator3.s();
          case 16:
            if ((_step3 = _iterator3.n()).done) {
              _context2.next = 62;
              break;
            }
            spec = _step3.value;
            _splitOn = splitOn(spec, OPTION_PREF_CHAR, true, 1), _splitOn2 = _slicedToArray(_splitOn, 2), tmp = _splitOn2[0], configSpec = _splitOn2[1];
            _splitOn3 = splitOn(tmp, ACTION_PREF_CHAR, true, 1), _splitOn4 = _slicedToArray(_splitOn3, 2), argSpec = _splitOn4[0], allActionSpecs = _splitOn4[1];
            _args2 = MH.filterBlank(splitOn(argSpec, ",", true)) || [];
            _context2.next = 23;
            return fetchWidgetConfig(configSpec, MH.assign(baseConfigValidator, thisConfigValidator), OPTION_PREF_CHAR);
          case 23:
            _config = _context2.sent;
            actionTarget = (_config$actOn = _config.actOn) !== null && _config$actOn !== void 0 ? _config$actOn : element;
            _actions = [];
            _iterator4 = _createForOfIteratorHelper(splitOn(allActionSpecs || "", ACTION_PREF_CHAR, true));
            _context2.prev = 27;
            _iterator4.s();
          case 29:
            if ((_step4 = _iterator4.n()).done) {
              _context2.next = 47;
              break;
            }
            actionSpec = _step4.value;
            _splitOn5 = splitOn(actionSpec, ACTION_ARGS_PREF_CHAR, true, 1), _splitOn6 = _slicedToArray(_splitOn5, 2), _name = _splitOn6[0], actionArgsAndOptions = _splitOn6[1];
            _context2.prev = 32;
            _context2.t1 = _actions;
            _context2.next = 36;
            return fetchAction(actionTarget, _name, actionArgsAndOptions || "");
          case 36:
            _context2.t2 = _context2.sent;
            _context2.t1.push.call(_context2.t1, _context2.t2);
            _context2.next = 45;
            break;
          case 40:
            _context2.prev = 40;
            _context2.t3 = _context2["catch"](32);
            if (!MH.isInstanceOf(_context2.t3, LisnUsageError)) {
              _context2.next = 44;
              break;
            }
            return _context2.abrupt("continue", 45);
          case 44:
            throw _context2.t3;
          case 45:
            _context2.next = 29;
            break;
          case 47:
            _context2.next = 52;
            break;
          case 49:
            _context2.prev = 49;
            _context2.t4 = _context2["catch"](27);
            _iterator4.e(_context2.t4);
          case 52:
            _context2.prev = 52;
            _iterator4.f();
            return _context2.finish(52);
          case 55:
            _context2.t5 = widgets;
            _context2.next = 58;
            return newTrigger(element, _args2, _actions, _config);
          case 58:
            _context2.t6 = _context2.sent;
            _context2.t5.push.call(_context2.t5, _context2.t6);
          case 60:
            _context2.next = 16;
            break;
          case 62:
            _context2.next = 67;
            break;
          case 64:
            _context2.prev = 64;
            _context2.t7 = _context2["catch"](14);
            _iterator3.e(_context2.t7);
          case 67:
            _context2.prev = 67;
            _iterator3.f();
            return _context2.finish(67);
          case 70:
            return _context2.abrupt("return", widgets);
          case 71:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[14, 64, 67, 70], [27, 49, 52, 55], [32, 40]]);
    }));
    return function newWidget(_x4) {
      return _ref2.apply(this, arguments);
    };
  }();
  registerWidget(name, newWidget, null, {
    selector: "[class^=\"".concat(clsPref, "--\"],[class*=\" ").concat(clsPref, "--\"],[data-").concat(clsPref, "]")
  });
};

// --------------------

var TRIGGER_SEP = ";";
var OPTION_PREF_CHAR = "+";
var ACTION_PREF_CHAR = "@";
var ACTION_ARGS_PREF_CHAR = ":";
var newBaseConfigValidator = function newBaseConfigValidator(element) {
  return {
    id: validateString,
    once: validateBoolean,
    oneWay: validateBoolean,
    delay: validateNumber,
    doDelay: validateNumber,
    undoDelay: validateNumber,
    actOn: function actOn(key, value) {
      var _ref3;
      return (_ref3 = MH.isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref3 !== void 0 ? _ref3 : undefined;
    }
  };
};
//# sourceMappingURL=trigger.js.map