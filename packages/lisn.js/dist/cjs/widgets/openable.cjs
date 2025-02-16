"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerOpenable = exports.Popup = exports.Openable = exports.Offcanvas = exports.Modal = exports.Collapsible = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _settings = require("../globals/settings.cjs");
var _cssAlter = require("../utils/css-alter.cjs");
var _domAlter = require("../utils/dom-alter.cjs");
var _domEvents = require("../utils/dom-events.cjs");
var _domOptimize = require("../utils/dom-optimize.cjs");
var _domQuery = require("../utils/dom-query.cjs");
var _event = require("../utils/event.cjs");
var _log = require("../utils/log.cjs");
var _math = require("../utils/math.cjs");
var _misc = require("../utils/misc.cjs");
var _tasks = require("../utils/tasks.cjs");
var _position = require("../utils/position.cjs");
var _size = require("../utils/size.cjs");
var _validation = require("../utils/validation.cjs");
var _callback = require("../modules/callback.cjs");
var _sizeWatcher = require("../watchers/size-watcher.cjs");
var _viewWatcher = require("../watchers/view-watcher.cjs");
var _widget = require("./widget.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
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
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Widgets
 */
/* ********************
 * Base Openable
 * ********************/

/**
 * Enables automatic setting up of an {@link Openable} widget from an
 * elements matching its content element selector (`[data-lisn-<name>]` or
 * `.lisn-<name>`).
 *
 * The name you specify here should generally be the same name you pass in
 * {@link OpenableProperties.name | options.name} to the
 * {@link Openable.constructor} but it does not need to be the same.
 *
 * @param {} name        The name of the openable. Should be in kebab-case.
 * @param {} newOpenable Called for every element matching the selector.
 * @param {} configValidator
 *                        A validator object, or a function that returns such
 *                        an object, for all options supported by the widget.
 *
 * @see {@link registerWidget}
 */
var registerOpenable = exports.registerOpenable = function registerOpenable(name, newOpenable, configValidator) {
  (0, _widget.registerWidget)(name, function (element, config) {
    if (MH.isHTMLElement(element)) {
      if (!Openable.get(element)) {
        return newOpenable(element, config);
      }
    } else {
      (0, _log.logError)(MH.usageError("Openable widget supports only HTMLElement"));
    }
    return null;
  }, configValidator);
};

/**
 * {@link Openable} is an abstract base class. You should not directly
 * instantiate it but can inherit it to create your own custom openable widget.
 *
 * **IMPORTANT:** You should not instantiate more than one {@link Openable}
 * widget, regardless of type, on a given element. Use {@link Openable.get} to
 * get an existing instance if any. If there is already an {@link Openable}
 * widget of any type on this element, it will be destroyed!
 *
 * @see {@link registerOpenable}
 */
var Openable = exports.Openable = /*#__PURE__*/function (_Widget) {
  function Openable(element, properties) {
    var _this;
    _classCallCheck(this, Openable);
    _this = _callSuper(this, Openable, [element]);
    /**
     * Opens the widget unless it is disabled.
     */
    _defineProperty(_this, "open", void 0);
    /**
     * Closes the widget.
     */
    _defineProperty(_this, "close", void 0);
    /**
     * Closes the widget if it is open, or opens it if it is closed (unless
     * it is disabled).
     */
    _defineProperty(_this, "toggle", void 0);
    /**
     * The given handler will be called when the widget is open.
     *
     * If it returns a promise, it will be awaited upon.
     */
    _defineProperty(_this, "onOpen", void 0);
    /**
     * The given handler will be called when the widget is closed.
     *
     * If it returns a promise, it will be awaited upon.
     */
    _defineProperty(_this, "onClose", void 0);
    /**
     * Returns true if the widget is currently open.
     */
    _defineProperty(_this, "isOpen", void 0);
    /**
     * Returns the root element created by us that wraps the original content
     * element passed to the constructor. It is located in the content element's
     * original place.
     */
    _defineProperty(_this, "getRoot", void 0);
    /**
     * Returns the element that was found to be the container. It is the closest
     * ancestor that has a `lisn-collapsible-container` class, or if no such
     * ancestor then the immediate parent of the content element.
     */
    _defineProperty(_this, "getContainer", void 0);
    /**
     * Returns the trigger elements, if any. Note that these may be wrappers
     * around the original triggers passed.
     */
    _defineProperty(_this, "getTriggers", void 0);
    /**
     * Returns the trigger elements along with their configuration.
     */
    _defineProperty(_this, "getTriggerConfigs", void 0);
    var isModal = properties.isModal,
      isOffcanvas = properties.isOffcanvas;
    var openCallbacks = MH.newSet();
    var closeCallbacks = MH.newSet();
    var isOpen = false;

    // ----------

    var open = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var _iterator, _step, callback;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!(_this.isDisabled() || isOpen)) {
                _context.next = 2;
                break;
              }
              return _context.abrupt("return");
            case 2:
              isOpen = true;
              _iterator = _createForOfIteratorHelper(openCallbacks);
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
              if (isModal) {
                (0, _cssAlter.setHasModal)();
              }
              _context.next = 23;
              return (0, _cssAlter.setBoolData)(root, PREFIX_IS_OPEN);
            case 23:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[4, 14, 17, 20]]);
      }));
      return function open() {
        return _ref.apply(this, arguments);
      };
    }();

    // ----------

    var close = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var _iterator2, _step2, callback;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!(_this.isDisabled() || !isOpen)) {
                _context2.next = 2;
                break;
              }
              return _context2.abrupt("return");
            case 2:
              isOpen = false;
              _iterator2 = _createForOfIteratorHelper(closeCallbacks);
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
              if (isModal) {
                (0, _cssAlter.delHasModal)();
              }
              if (isOffcanvas) {
                scrollWrapperToTop(); // no need to await
              }
              _context2.next = 24;
              return (0, _cssAlter.unsetBoolData)(root, PREFIX_IS_OPEN);
            case 24:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[4, 14, 17, 20]]);
      }));
      return function close() {
        return _ref2.apply(this, arguments);
      };
    }();

    // ----------

    var scrollWrapperToTop = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _tasks.waitForDelay)(1000);
            case 2:
              _context3.next = 4;
              return (0, _domOptimize.waitForMeasureTime)();
            case 4:
              MH.elScrollTo(outerWrapper, {
                top: 0,
                left: 0
              });
            case 5:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      return function scrollWrapperToTop() {
        return _ref3.apply(this, arguments);
      };
    }();

    // --------------------

    _this.open = open;
    _this.close = close;
    _this[MC.S_TOGGLE] = function () {
      return isOpen ? close() : open();
    };
    _this.onOpen = function (handler) {
      return openCallbacks.add((0, _callback.wrapCallback)(handler));
    };
    _this.onClose = function (handler) {
      return closeCallbacks.add((0, _callback.wrapCallback)(handler));
    };
    _this.isOpen = function () {
      return isOpen;
    };
    _this.getRoot = function () {
      return root;
    };
    _this.getContainer = function () {
      return container;
    };
    _this.getTriggers = function () {
      return _toConsumableArray(triggers.keys());
    };
    _this.getTriggerConfigs = function () {
      return MH.newMap(_toConsumableArray(triggers.entries()));
    };
    _this.onDestroy(function () {
      openCallbacks.clear();
      closeCallbacks.clear();
    });
    var _setupElements = setupElements(_this, element, properties),
      root = _setupElements.root,
      container = _setupElements.container,
      triggers = _setupElements.triggers,
      outerWrapper = _setupElements.outerWrapper;
    return _this;
  }
  _inherits(Openable, _Widget);
  return _createClass(Openable, null, [{
    key: "get",
    value:
    /**
     * Retrieve an existing widget by its content element or any of its triggers.
     *
     * If the element is already part of a configured {@link Openable} widget,
     * the widget instance is returned. Otherwise `null`.
     *
     * Note that trigger elements are not guaranteed to be unique among openable
     * widgets as the same element can be a trigger for multiple such widgets. If
     * the element you pass is a trigger, then the last openable widget that was
     * created for it will be returned.
     */
    function get(element) {
      // We manage the instances here since we also map associated elements and
      // not just the main content element that created the widget.
      return instances.get(element) || null;
    }
  }]);
}(_widget.Widget);
/**
 * Per-trigger based configuration. Can either be given as an object as the
 * value of the {@link OpenableProperties.triggers} map, or it can be set as a
 * string configuration in the `data-lisn-<name>-trigger` data attribute. See
 * {@link getWidgetConfig} for the syntax.
 *
 * @example
 * ```html
 * <div data-lisn-collapsible-trigger="auto-close
 *                                     | icon=right
 *                                     | icon-closed=arrow-down
 *                                     | icon-open=x"
 * ></div>
 * ```
 *
 * @interface
 */
/**
 * @interface
 */
/* ********************
 * Collapsible
 * ********************/
/**
 * Configures the given element as a {@link Collapsible} widget.
 *
 * The Collapsible widget sets up the given element to be collapsed and
 * expanded upon activation. Activation can be done manually by calling
 * {@link open} or when clicking on any of the given
 * {@link CollapsibleConfig.triggers | triggers}.
 *
 * **NOTE:** The Collapsible widget always wraps each trigger element in
 * another element in order to allow positioning the icon, if any.
 *
 * **IMPORTANT:** You should not instantiate more than one {@link Openable}
 * widget, regardless of type, on a given element. Use {@link Openable.get} to
 * get an existing instance if any. If there is already an {@link Openable}
 * widget of any type on this element, it will be destroyed!
 *
 * -----
 *
 * You can use the following dynamic attributes or CSS properties in your
 * stylesheet:
 *
 * The following dynamic attributes are set on the root element that is created
 * by LISN and has a class `lisn-collapsible__root`:
 * - `data-lisn-is-open`: `"true"` or `"false"`
 * - `data-lisn-reverse`: `"true"` or `"false"`
 * - `data-lisn-orientation`: `"horizontal"` or `"vertical"`
 *
 * The following dynamic attributes are set on each trigger:
 * - `data-lisn-opens-on-hover: `"true"` or `"false"`
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-collapsible` class or `data-lisn-collapsible` attribute set on the
 *   element that holds the content of the collapsible
 * - `lisn-collapsible-trigger` class or `data-lisn-collapsible-trigger`
 *   attribute set on elements that should act as the triggers.
 *   If using a data attribute, you can configure the trigger via the value
 *   with a similar syntax to the configuration of the openable widget. For
 *   example:
 *   - Set the attribute to `"hover"` in order to have this trigger open the
 *     collapsible on hover _in addition to click_.
 *   - Set the attribute to `"hover|auto-close"` in order to have this trigger
 *     open the collapsible on hover but and override
 *     {@link CollapsibleConfig.autoClose} with true.
 *
 * When using auto-widgets, the elements that will be used as triggers are
 * discovered in the following way:
 * 1. If the content element has a `data-lisn-collapsible-content-id` attribute,
 *    then it must be a unique (for the current page) ID. In this case, the
 *    trigger elements will be any element in the document that has a
 *    `lisn-collapsible-trigger` class or `data-lisn-collapsible-trigger`
 *    attribute and the same `data-lisn-collapsible-content-id` attribute.
 * 2. Otherwise, the closest ancestor that has a `lisn-collapsible-container`
 *    class, or if no such ancestor then the immediate parent of the content
 *    element, is searched for any elements that have a
 *    `lisn-collapsible-trigger` class or `data-lisn-collapsible-trigger`
 *    attribute and that do _not_ have a `data-lisn-collapsible-content-id`
 *    attribute, and that are _not_ children of the content element.
 *
 * See below examples for what values you can use set for the data attributes
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This defines a simple collapsible with one trigger.
 *
 * ```html
 * <div>
 *   <div class="lisn-collapsible-trigger">Expand</div>
 *   <div class="lisn-collapsible">
 *     Some long content here...
 *   </div>
 * </div>
 * ```
 *
 * @example
 * This defines a collapsible that is partially visible when collapsed, and
 * where the trigger is in a different parent to the content.
 *
 * ```html
 * <div>
 *   <div data-lisn-collapsible-content-id="readmore"
 *        data-lisn-collapsible="peek">
 *     <p>
 *       Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis
 *       viverra faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus
 *       aliquet turpis. Diam potenti egestas dolor auctor nostra vestibulum.
 *       Tempus auctor quis turpis; pulvinar ante ultrices. Netus morbi
 *       imperdiet volutpat litora tellus turpis a. Sociosqu interdum sodales
 *       sapien nulla aptent pellentesque praesent. Senectus magnis
 *       pellentesque; dis porta justo habitant.
 *     </p>
 *
 *     <p>
 *       Imperdiet placerat habitant tristique turpis habitasse ligula pretium
 *       vehicula. Mauris molestie lectus leo aliquam condimentum elit fermentum
 *       tempus nisi. Eget mi vestibulum quisque enim himenaeos. Odio nascetur
 *       vel congue vivamus eleifend ut nascetur. Ultrices quisque non dictumst
 *       risus libero varius tincidunt vel. Suscipit netus maecenas imperdiet
 *       elementum donec maximus suspendisse luctus. Eu velit semper urna sem
 *       ullamcorper nisl turpis hendrerit. Gravida commodo nisl malesuada nibh
 *       ultricies scelerisque hendrerit tempus vehicula. Risus eleifend eros
 *       aliquam turpis elit ridiculus est class.
 *     </p>
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-collapsible-content-id="readmore"
 *        class="lisn-collapsible-trigger">
 *     Read more
 *   </div>
 * </div>
 * ```
 *
 * @example
 * As above, but with all other possible configuration settings set explicitly.
 *
 * ```html
 * <div>
 *   <div data-lisn-collapsible-content-id="readmore"
 *        data-lisn-collapsible="peek=50px
 *                               | horizontal=false
 *                               | reverse=false
 *                               | auto-close
 *                               | icon=right
 *                               | icon-closed=arrow-up"
 *                               | icon-open=arrow-down">
 *     <p>
 *       Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis
 *       viverra faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus
 *       aliquet turpis. Diam potenti egestas dolor auctor nostra vestibulum.
 *       Tempus auctor quis turpis; pulvinar ante ultrices. Netus morbi
 *       imperdiet volutpat litora tellus turpis a. Sociosqu interdum sodales
 *       sapien nulla aptent pellentesque praesent. Senectus magnis
 *       pellentesque; dis porta justo habitant.
 *     </p>
 *
 *     <p>
 *       Imperdiet placerat habitant tristique turpis habitasse ligula pretium
 *       vehicula. Mauris molestie lectus leo aliquam condimentum elit fermentum
 *       tempus nisi. Eget mi vestibulum quisque enim himenaeos. Odio nascetur
 *       vel congue vivamus eleifend ut nascetur. Ultrices quisque non dictumst
 *       risus libero varius tincidunt vel. Suscipit netus maecenas imperdiet
 *       elementum donec maximus suspendisse luctus. Eu velit semper urna sem
 *       ullamcorper nisl turpis hendrerit. Gravida commodo nisl malesuada nibh
 *       ultricies scelerisque hendrerit tempus vehicula. Risus eleifend eros
 *       aliquam turpis elit ridiculus est class.
 *     </p>
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-collapsible-content-id="readmore"
 *        class="lisn-collapsible-trigger">
 *     Read more
 *   </div>
 * </div>
 * ```
 */
var Collapsible = exports.Collapsible = /*#__PURE__*/function (_Openable2) {
  function Collapsible(element, config) {
    var _config$autoClose, _config$reverse;
    var _this2;
    _classCallCheck(this, Collapsible);
    var isHorizontal = config === null || config === void 0 ? void 0 : config.horizontal;
    var orientation = isHorizontal ? MC.S_HORIZONTAL : MC.S_VERTICAL;
    var onSetup = function onSetup() {
      // The triggers here are wrappers around the original which will be
      // replaced by the original on destroy, so no need to clean up this.
      var _iterator3 = _createForOfIteratorHelper(_this2.getTriggerConfigs().entries()),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _step3$value = _slicedToArray(_step3.value, 2),
            trigger = _step3$value[0],
            triggerConfig = _step3$value[1];
          insertCollapsibleIcon(trigger, triggerConfig, _assertThisInitialized(_this2), config);
          (0, _cssAlter.setDataNow)(trigger, MC.PREFIX_ORIENTATION, orientation);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    };
    _this2 = _callSuper(this, Collapsible, [element, {
      name: WIDGET_NAME_COLLAPSIBLE,
      id: config === null || config === void 0 ? void 0 : config.id,
      className: config === null || config === void 0 ? void 0 : config.className,
      autoClose: (_config$autoClose = config === null || config === void 0 ? void 0 : config.autoClose) !== null && _config$autoClose !== void 0 ? _config$autoClose : false,
      isModal: false,
      isOffcanvas: false,
      closeButton: false,
      triggers: config === null || config === void 0 ? void 0 : config.triggers,
      wrapTriggers: true,
      onSetup: onSetup
    }]);
    var root = _this2.getRoot();
    var wrapper = MH.childrenOf(root)[0];
    (0, _cssAlter.setData)(root, MC.PREFIX_ORIENTATION, orientation);
    (0, _cssAlter.setBoolData)(root, PREFIX_REVERSE, (_config$reverse = config === null || config === void 0 ? void 0 : config.reverse) !== null && _config$reverse !== void 0 ? _config$reverse : false);

    // -------------------- Transitions
    (0, _cssAlter.disableInitialTransition)(element, 100);
    (0, _cssAlter.disableInitialTransition)(root, 100);
    (0, _cssAlter.disableInitialTransition)(wrapper, 100);
    var disableTransitionTimer = null;
    var tempEnableTransition = /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
        var transitionDuration;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return (0, _cssAlter.removeClasses)(root, MC.PREFIX_TRANSITION_DISABLE);
            case 2:
              _context4.next = 4;
              return (0, _cssAlter.removeClasses)(wrapper, MC.PREFIX_TRANSITION_DISABLE);
            case 4:
              if (disableTransitionTimer) {
                MH.clearTimer(disableTransitionTimer);
              }
              _context4.next = 7;
              return (0, _cssAlter.getMaxTransitionDuration)(root);
            case 7:
              transitionDuration = _context4.sent;
              disableTransitionTimer = MH.setTimer(function () {
                if (_this2.isOpen()) {
                  (0, _cssAlter.addClasses)(root, MC.PREFIX_TRANSITION_DISABLE);
                  (0, _cssAlter.addClasses)(wrapper, MC.PREFIX_TRANSITION_DISABLE);
                  disableTransitionTimer = null;
                }
              }, transitionDuration);
            case 9:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      return function tempEnableTransition() {
        return _ref4.apply(this, arguments);
      };
    }();

    // Disable transitions except during open/close, so that resizing the
    // window for example doesn't result in lagging width/height transition.
    _this2.onOpen(tempEnableTransition);
    _this2.onClose(tempEnableTransition);

    // -------------------- Peek
    var peek = config === null || config === void 0 ? void 0 : config.peek;
    if (peek) {
      _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
        var peekSize;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              peekSize = null;
              if (!MH.isString(peek)) {
                _context5.next = 5;
                break;
              }
              peekSize = peek;
              _context5.next = 8;
              break;
            case 5:
              _context5.next = 7;
              return (0, _cssAlter.getStyleProp)(element, VAR_PEEK_SIZE);
            case 7:
              peekSize = _context5.sent;
            case 8:
              (0, _cssAlter.addClasses)(root, PREFIX_PEEK);
              if (peekSize) {
                (0, _cssAlter.setStyleProp)(root, VAR_PEEK_SIZE, peekSize);
              }
            case 10:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }))();
    }

    // -------------------- Width in horizontal mode
    if (isHorizontal) {
      var updateWidth = /*#__PURE__*/function () {
        var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
          var width;
          return _regeneratorRuntime().wrap(function _callee6$(_context6) {
            while (1) switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return (0, _cssAlter.getComputedStyleProp)(root, MC.S_WIDTH);
              case 2:
                width = _context6.sent;
                _context6.next = 5;
                return (0, _cssAlter.setStyleProp)(element, VAR_JS_COLLAPSIBLE_WIDTH, width);
              case 5:
              case "end":
                return _context6.stop();
            }
          }, _callee6);
        }));
        return function updateWidth() {
          return _ref6.apply(this, arguments);
        };
      }();
      MH.setTimer(updateWidth);

      // Save its current width so that if it contains text, it does not
      // "collapse" and end up super tall.
      _this2.onClose(updateWidth);
      _this2.onOpen(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return updateWidth();
            case 2:
              // Delete the fixed width property soon after opening to allow it to
              // resize again while it's open.
              (0, _tasks.waitForDelay)(2000).then(function () {
                if (_this2.isOpen()) {
                  (0, _cssAlter.delStyleProp)(element, VAR_JS_COLLAPSIBLE_WIDTH);
                }
              });
            case 3:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      })));
    }
    return _this2;
  }
  _inherits(Collapsible, _Openable2);
  return _createClass(Collapsible, null, [{
    key: "register",
    value: function register() {
      registerOpenable(WIDGET_NAME_COLLAPSIBLE, function (el, config) {
        return new Collapsible(el, config);
      }, collapsibleConfigValidator);
    }
  }]);
}(Openable);
/**
 * @interface
 */
/* ********************
 * Popup
 * ********************/
/**
 * Configures the given element as a {@link Popup} widget.
 *
 * The Popup widget sets up the given element to be hidden and open in a
 * floating popup upon activation. Activation can be done manually by calling
 * {@link open} or when clicking on any of the given
 * {@link PopupConfig.triggers | triggers}.
 *
 * **IMPORTANT:** The popup is positioned absolutely in its container and the
 * position is relative to the container. The container gets `width:
 * fit-content` by default but you can override this in your CSS. The popup
 * also gets a configurable `min-width` set.
 *
 * **IMPORTANT:** You should not instantiate more than one {@link Openable}
 * widget, regardless of type, on a given element. Use {@link Openable.get} to
 * get an existing instance if any. If there is already an {@link Openable}
 * widget of any type on this element, it will be destroyed!
 *
 * -----
 *
 * You can use the following dynamic attributes or CSS properties in your
 * stylesheet:
 *
 * The following dynamic attributes are set on the root element that is created
 * by LISN and has a class `lisn-popup__root`:
 * - `data-lisn-is-open`: `"true"` or `"false"`
 * - `data-lisn-place`: the actual position (top, bottom, left, top-left, etc)
 *
 * The following dynamic attributes are set on each trigger:
 * - `data-lisn-opens-on-hover: `"true"` or `"false"`
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-popup` class or `data-lisn-popup` attribute set on the element that
 *   holds the content of the popup
 * - `lisn-popup-trigger` class or `data-lisn-popup-trigger`
 *   attribute set on elements that should act as the triggers.
 *   If using a data attribute, you can configure the trigger via the value
 *   with a similar syntax to the configuration of the openable widget. For
 *   example:
 *   - Set the attribute to `"hover"` in order to have this trigger open the
 *     popup on hover _in addition to click_.
 *   - Set the attribute to `"hover|auto-close=false"` in order to have this
 *     trigger open the popup on hover but and override
 *     {@link PopupConfig.autoClose} with true.
 *
 * When using auto-widgets, the elements that will be used as triggers are
 * discovered in the following way:
 * 1. If the content element has a `data-lisn-popup-content-id` attribute, then
 *    it must be a unique (for the current page) ID. In this case, the trigger
 *    elements will be any element in the document that has a
 *    `lisn-popup-trigger` class or `data-lisn-popup-trigger` attribute and the
 *    same `data-lisn-popup-content-id` attribute.
 * 2. Otherwise, the closest ancestor that has a `lisn-popup-container` class,
 *    or if no such ancestor then the immediate parent of the content element,
 *    is searched for any elements that have a `lisn-popup-trigger` class or
 *    `data-lisn-popup-trigger` attribute and that do _not_ have a
 *    `data-lisn-popup-content-id` attribute, and that are _not_ children of
 *    the content element.
 *
 * See below examples for what values you can use set for the data attributes
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This defines a simple popup with one trigger.
 *
 * ```html
 * <div>
 *   <div class="lisn-popup-trigger">Open</div>
 *   <div class="lisn-popup">
 *     Some content here...
 *   </div>
 * </div>
 * ```
 *
 * @example
 * This defines a popup that has a close button, and where the trigger is in a
 * different parent to the content.
 *
 * ```html
 * <div>
 *   <div data-lisn-popup-content-id="popup"
 *        data-lisn-popup="close-button">
 *     Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis viverra
 *     faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus aliquet
 *     turpis. Diam potenti egestas dolor auctor nostra vestibulum. Tempus
 *     auctor quis turpis; pulvinar ante ultrices. Netus morbi imperdiet
 *     volutpat litora tellus turpis a. Sociosqu interdum sodales sapien nulla
 *     aptent pellentesque praesent. Senectus magnis pellentesque; dis porta
 *     justo habitant.
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-popup-content-id="popup" class="lisn-popup-trigger">
 *     Open
 *   </div>
 * </div>
 * ```
 *
 * @example
 * As above, but with all possible configuration settings set explicitly.
 *
 * ```html
 * <div>
 *   <div data-lisn-popup-content-id="popup" class="lisn-popup-trigger">
 *     Open
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-popup-content-id="popup"
 *        data-lisn-popup="close-button | position=bottom | auto-close=false">
 *     Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis viverra
 *     faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus aliquet
 *     turpis. Diam potenti egestas dolor auctor nostra vestibulum. Tempus
 *     auctor quis turpis; pulvinar ante ultrices. Netus morbi imperdiet
 *     volutpat litora tellus turpis a. Sociosqu interdum sodales sapien nulla
 *     aptent pellentesque praesent. Senectus magnis pellentesque; dis porta
 *     justo habitant.
 *   </div>
 * </div>
 * ```
 */
var Popup = exports.Popup = /*#__PURE__*/function (_Openable3) {
  function Popup(element, config) {
    var _config$autoClose2, _config$closeButton, _config$position;
    var _this3;
    _classCallCheck(this, Popup);
    _this3 = _callSuper(this, Popup, [element, {
      name: WIDGET_NAME_POPUP,
      id: config === null || config === void 0 ? void 0 : config.id,
      className: config === null || config === void 0 ? void 0 : config.className,
      autoClose: (_config$autoClose2 = config === null || config === void 0 ? void 0 : config.autoClose) !== null && _config$autoClose2 !== void 0 ? _config$autoClose2 : true,
      isModal: false,
      isOffcanvas: false,
      closeButton: (_config$closeButton = config === null || config === void 0 ? void 0 : config.closeButton) !== null && _config$closeButton !== void 0 ? _config$closeButton : false,
      triggers: config === null || config === void 0 ? void 0 : config.triggers
    }]);
    var root = _this3.getRoot();
    var container = _this3.getContainer();
    var position = (_config$position = config === null || config === void 0 ? void 0 : config.position) !== null && _config$position !== void 0 ? _config$position : S_AUTO;
    if (position !== S_AUTO) {
      (0, _cssAlter.setData)(root, MC.PREFIX_PLACE, position);
    }
    if (container && position === S_AUTO) {
      // Automatic position
      _this3.onOpen(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
        var _yield$MH$promiseAll, _yield$MH$promiseAll2, contentSize, containerView, placement;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return MH.promiseAll([_sizeWatcher.SizeWatcher.reuse().fetchCurrentSize(element), _viewWatcher.ViewWatcher.reuse().fetchCurrentView(container)]);
            case 2:
              _yield$MH$promiseAll = _context8.sent;
              _yield$MH$promiseAll2 = _slicedToArray(_yield$MH$promiseAll, 2);
              contentSize = _yield$MH$promiseAll2[0];
              containerView = _yield$MH$promiseAll2[1];
              _context8.next = 8;
              return fetchPopupPlacement(contentSize, containerView);
            case 8:
              placement = _context8.sent;
              if (!placement) {
                _context8.next = 12;
                break;
              }
              _context8.next = 12;
              return (0, _cssAlter.setData)(root, MC.PREFIX_PLACE, placement);
            case 12:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      })));
    }
    return _this3;
  }
  _inherits(Popup, _Openable3);
  return _createClass(Popup, null, [{
    key: "register",
    value: function register() {
      registerOpenable(WIDGET_NAME_POPUP, function (el, config) {
        return new Popup(el, config);
      }, popupConfigValidator);
    }
  }]);
}(Openable);
/**
 * @interface
 */
/* ********************
 * Modal
 * ********************/
/**
 * Configures the given element as a {@link Modal} widget.
 *
 * The Modal widget sets up the given element to be hidden and open in a fixed
 * full-screen modal popup upon activation. Activation can be done manually by
 * calling {@link open} or when clicking on any of the given
 * {@link ModalConfig.triggers | triggers}.
 *
 * **IMPORTANT:** You should not instantiate more than one {@link Openable}
 * widget, regardless of type, on a given element. Use {@link Openable.get} to
 * get an existing instance if any. If there is already an {@link Openable}
 * widget of any type on this element, it will be destroyed!
 *
 * -----
 *
 * You can use the following dynamic attributes or CSS properties in your
 * stylesheet:
 *
 * The following dynamic attributes are set on the root element that is created
 * by LISN and has a class `lisn-modal__root`:
 * - `data-lisn-is-open`: `"true"` or `"false"`
 *
 * The following dynamic attributes are set on each trigger:
 * - `data-lisn-opens-on-hover: `"true"` or `"false"`
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-modal` class or `data-lisn-modal` attribute set on the element that
 *   holds the content of the modal
 * - `lisn-modal-trigger` class or `data-lisn-modal-trigger`
 *   attribute set on elements that should act as the triggers.
 *   If using a data attribute, you can configure the trigger via the value
 *   with a similar syntax to the configuration of the openable widget. For
 *   example:
 *   - Set the attribute to `"hover"` in order to have this trigger open the
 *     modal on hover _in addition to click_.
 *   - Set the attribute to `"hover|auto-close=false"` in order to have this
 *     trigger open the modal on hover but and override
 *     {@link ModalConfig.autoClose} with true.
 *
 * When using auto-widgets, the elements that will be used as triggers are
 * discovered in the following way:
 * 1. If the content element has a `data-lisn-modal-content-id` attribute, then
 *    it must be a unique (for the current page) ID. In this case, the trigger
 *    elements will be any element in the document that has a
 *    `lisn-modal-trigger` class or `data-lisn-modal-trigger` attribute and the
 *    same `data-lisn-modal-content-id` attribute.
 * 2. Otherwise, the closest ancestor that has a `lisn-modal-container` class,
 *    or if no such ancestor then the immediate parent of the content element,
 *    is searched for any elements that have a `lisn-modal-trigger` class or
 *    `data-lisn-modal-trigger` attribute and that do _not_ have a
 *    `data-lisn-modal-content-id` attribute, and that are _not_ children of
 *    the content element.
 *
 * See below examples for what values you can use set for the data attributes
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This defines a simple modal with one trigger.
 *
 * ```html
 * <div>
 *   <div class="lisn-modal-trigger">Open</div>
 *   <div class="lisn-modal">
 *     Some content here...
 *   </div>
 * </div>
 * ```
 *
 * @example
 * This defines a modal that doesn't automatically close on click outside or
 * Escape and, and that has several triggers in a different parent to the
 * content.
 *
 * ```html
 * <div>
 *   <div data-lisn-modal-content-id="modal"
 *        data-lisn-modal="auto-close=false">
 *     Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis viverra
 *     faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus aliquet
 *     turpis. Diam potenti egestas dolor auctor nostra vestibulum. Tempus
 *     auctor quis turpis; pulvinar ante ultrices. Netus morbi imperdiet
 *     volutpat litora tellus turpis a. Sociosqu interdum sodales sapien nulla
 *     aptent pellentesque praesent. Senectus magnis pellentesque; dis porta
 *     justo habitant.
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-modal-content-id="modal" class="lisn-modal-trigger">
 *     Open
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-modal-content-id="modal" class="lisn-modal-trigger">
 *     Another trigger
 *   </div>
 * </div>
 * ```
 *
 * @example
 * As above, but with all possible configuration settings set explicitly.
 *
 * ```html
 * <div>
 *   <div data-lisn-modal-content-id="modal"
 *        data-lisn-modal="auto-close=false | close-button=true">
 *     Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis viverra
 *     faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus aliquet
 *     turpis. Diam potenti egestas dolor auctor nostra vestibulum. Tempus
 *     auctor quis turpis; pulvinar ante ultrices. Netus morbi imperdiet
 *     volutpat litora tellus turpis a. Sociosqu interdum sodales sapien nulla
 *     aptent pellentesque praesent. Senectus magnis pellentesque; dis porta
 *     justo habitant.
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-modal-content-id="modal" class="lisn-modal-trigger">
 *     Open
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-modal-content-id="modal" class="lisn-modal-trigger">
 *     Another trigger
 *   </div>
 * </div>
 * ```
 */
var Modal = exports.Modal = /*#__PURE__*/function (_Openable4) {
  function Modal(element, config) {
    var _config$autoClose3, _config$closeButton2;
    _classCallCheck(this, Modal);
    return _callSuper(this, Modal, [element, {
      name: WIDGET_NAME_MODAL,
      id: config === null || config === void 0 ? void 0 : config.id,
      className: config === null || config === void 0 ? void 0 : config.className,
      autoClose: (_config$autoClose3 = config === null || config === void 0 ? void 0 : config.autoClose) !== null && _config$autoClose3 !== void 0 ? _config$autoClose3 : true,
      isModal: true,
      isOffcanvas: true,
      closeButton: (_config$closeButton2 = config === null || config === void 0 ? void 0 : config.closeButton) !== null && _config$closeButton2 !== void 0 ? _config$closeButton2 : true,
      triggers: config === null || config === void 0 ? void 0 : config.triggers
    }]);
  }
  _inherits(Modal, _Openable4);
  return _createClass(Modal, null, [{
    key: "register",
    value: function register() {
      registerOpenable(WIDGET_NAME_MODAL, function (el, config) {
        return new Modal(el, config);
      }, modalConfigValidator);
    }
  }]);
}(Openable);
/**
 * @interface
 */
/* ********************
 * Offcanvas
 * ********************/
/**
 * Configures the given element as a {@link Offcanvas} widget.
 *
 * The Offcanvas widget sets up the given element to be hidden and open in a
 * fixed overlay (non full-screen) upon activation. Activation can be done
 * manually by calling {@link open} or when clicking on any of the given
 * {@link OffcanvasConfig.triggers | triggers}.
 *
 * **IMPORTANT:** You should not instantiate more than one {@link Openable}
 * widget, regardless of type, on a given element. Use {@link Openable.get} to
 * get an existing instance if any. If there is already an {@link Openable}
 * widget of any type on this element, it will be destroyed!
 *
 * -----
 *
 * You can use the following dynamic attributes or CSS properties in your
 * stylesheet:
 *
 * The following dynamic attributes are set on the root element that is created
 * by LISN and has a class `lisn-offcanvas__root`:
 * - `data-lisn-is-open`: `"true"` or `"false"`
 * - `data-lisn-place`: the actual position `"top"`, `"bottom"`, `"left"` or
 *   `"right"`
 *
 * The following dynamic attributes are set on each trigger:
 * - `data-lisn-opens-on-hover: `"true"` or `"false"`
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-offcanvas` class or `data-lisn-offcanvas` attribute set on the
 *   element that holds the content of the offcanvas
 * - `lisn-offcanvas-trigger` class or `data-lisn-offcanvas-trigger`
 *   attribute set on elements that should act as the triggers.
 *   If using a data attribute, you can configure the trigger via the value
 *   with a similar syntax to the configuration of the openable widget. For
 *   example:
 *   - Set the attribute to `"hover"` in order to have this trigger open the
 *     offcanvas on hover _in addition to click_.
 *   - Set the attribute to `"hover|auto-close=false"` in order to have this
 *     trigger open the offcanvas on hover but and override
 *     {@link OffcanvasConfig.autoClose} with true.
 *
 * When using auto-widgets, the elements that will be used as triggers are
 * discovered in the following way:
 * 1. If the content element has a `data-lisn-offcanvas-content-id` attribute,
 *    then it must be a unique (for the current page) ID. In this case, the
 *    trigger elements will be any element in the document that has a
 *    `lisn-offcanvas-trigger` class or `data-lisn-offcanvas-trigger` attribute
 *    and the same `data-lisn-offcanvas-content-id` attribute.
 * 2. Otherwise, the closest ancestor that has a `lisn-offcanvas-container`
 *    class, or if no such ancestor then the immediate parent of the content
 *    element, is searched for any elements that have a
 *    `lisn-offcanvas-trigger` class or `data-lisn-offcanvas-trigger` attribute
 *    and that do _not_ have a `data-lisn-offcanvas-content-id`
 *    attribute, and that are _not_ children of the content element.
 *
 * See below examples for what values you can use set for the data attributes
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This defines a simple offcanvas with one trigger.
 *
 * ```html
 * <div>
 *   <div class="lisn-offcanvas-trigger">Open</div>
 *   <div class="lisn-offcanvas">
 *     Some content here...
 *   </div>
 * </div>
 * ```
 *
 * @example
 * This defines a offcanvas that doesn't automatically close on click outside
 * or Escape and, and that has several triggers in a different parent to the
 * content.
 *
 * ```html
 * <div>
 *   <div data-lisn-offcanvas-content-id="offcanvas"
 *        data-lisn-offcanvas="auto-close=false">
 *     Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis viverra
 *     faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus aliquet
 *     turpis. Diam potenti egestas dolor auctor nostra vestibulum. Tempus
 *     auctor quis turpis; pulvinar ante ultrices. Netus morbi imperdiet
 *     volutpat litora tellus turpis a. Sociosqu interdum sodales sapien nulla
 *     aptent pellentesque praesent. Senectus magnis pellentesque; dis porta
 *     justo habitant.
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-offcanvas-content-id="offcanvas" class="lisn-offcanvas-trigger">
 *     Open
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-offcanvas-content-id="offcanvas" class="lisn-offcanvas-trigger">
 *     Another trigger
 *   </div>
 * </div>
 * ```
 *
 * @example
 * As above, but with all possible configuration settings set explicitly.
 *
 * ```html
 * <div>
 *   <div data-lisn-offcanvas-content-id="offcanvas"
 *        data-lisn-offcanvas="position=top | auto-close=false | close-button=true">
 *     Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis viverra
 *     faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus aliquet
 *     turpis. Diam potenti egestas dolor auctor nostra vestibulum. Tempus
 *     auctor quis turpis; pulvinar ante ultrices. Netus morbi imperdiet
 *     volutpat litora tellus turpis a. Sociosqu interdum sodales sapien nulla
 *     aptent pellentesque praesent. Senectus magnis pellentesque; dis porta
 *     justo habitant.
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-offcanvas-content-id="offcanvas" class="lisn-offcanvas-trigger">
 *     Open
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-offcanvas-content-id="offcanvas" class="lisn-offcanvas-trigger">
 *     Another trigger
 *   </div>
 * </div>
 * ```
 */
var Offcanvas = exports.Offcanvas = /*#__PURE__*/function (_Openable5) {
  function Offcanvas(element, config) {
    var _config$autoClose4, _config$closeButton3;
    var _this4;
    _classCallCheck(this, Offcanvas);
    _this4 = _callSuper(this, Offcanvas, [element, {
      name: WIDGET_NAME_OFFCANVAS,
      id: config === null || config === void 0 ? void 0 : config.id,
      className: config === null || config === void 0 ? void 0 : config.className,
      autoClose: (_config$autoClose4 = config === null || config === void 0 ? void 0 : config.autoClose) !== null && _config$autoClose4 !== void 0 ? _config$autoClose4 : true,
      isModal: false,
      isOffcanvas: true,
      closeButton: (_config$closeButton3 = config === null || config === void 0 ? void 0 : config.closeButton) !== null && _config$closeButton3 !== void 0 ? _config$closeButton3 : true,
      triggers: config === null || config === void 0 ? void 0 : config.triggers
    }]);
    var position = (config === null || config === void 0 ? void 0 : config.position) || MC.S_RIGHT;
    (0, _cssAlter.setData)(_this4.getRoot(), MC.PREFIX_PLACE, position);
    return _this4;
  }
  _inherits(Offcanvas, _Openable5);
  return _createClass(Offcanvas, null, [{
    key: "register",
    value: function register() {
      registerOpenable(WIDGET_NAME_OFFCANVAS, function (el, config) {
        return new Offcanvas(el, config);
      }, offcanvasConfigValidator);
    }
  }]);
}(Openable);
/**
 * @interface
 */
// ------------------------------
var instances = MH.newWeakMap();
var WIDGET_NAME_COLLAPSIBLE = "collapsible";
var WIDGET_NAME_POPUP = "popup";
var WIDGET_NAME_MODAL = "modal";
var WIDGET_NAME_OFFCANVAS = "offcanvas";
var PREFIX_CLOSE_BTN = MH.prefixName("close-button");
var PREFIX_IS_OPEN = MH.prefixName("is-open");
var PREFIX_REVERSE = MH.prefixName(MC.S_REVERSE);
var PREFIX_PEEK = MH.prefixName("peek");
var PREFIX_OPENS_ON_HOVER = MH.prefixName("opens-on-hover");
var PREFIX_LINE = MH.prefixName("line");
var PREFIX_ICON_POSITION = MH.prefixName("icon-position");
var PREFIX_TRIGGER_ICON = MH.prefixName("trigger-icon");
var PREFIX_ICON_WRAPPER = MH.prefixName("icon-wrapper");
var S_AUTO = "auto";
var S_ARIA_EXPANDED = MC.ARIA_PREFIX + "expanded";
var S_ARIA_MODAL = MC.ARIA_PREFIX + "modal";
var VAR_PEEK_SIZE = MH.prefixCssVar("peek-size");
var VAR_JS_COLLAPSIBLE_WIDTH = MH.prefixCssJsVar("collapsible-width");
var MIN_CLICK_TIME_AFTER_HOVER_OPEN = 1000;
var S_ARROW_UP = "".concat(MC.S_ARROW, "-").concat(MC.S_UP);
var S_ARROW_DOWN = "".concat(MC.S_ARROW, "-").concat(MC.S_DOWN);
var S_ARROW_LEFT = "".concat(MC.S_ARROW, "-").concat(MC.S_LEFT);
var S_ARROW_RIGHT = "".concat(MC.S_ARROW, "-").concat(MC.S_RIGHT);
var ARROW_TYPES = [S_ARROW_UP, S_ARROW_DOWN, S_ARROW_LEFT, S_ARROW_RIGHT];
var ICON_CLOSED_TYPES = ["plus"].concat(ARROW_TYPES);
var ICON_OPEN_TYPES = ["minus", "x"].concat(ARROW_TYPES);
var isValidIconClosed = function isValidIconClosed(value) {
  return MH.includes(ICON_CLOSED_TYPES, value);
};
var isValidIconOpen = function isValidIconOpen(value) {
  return MH.includes(ICON_OPEN_TYPES, value);
};
var triggerConfigValidator = {
  id: _validation.validateString,
  className: function className(key, value) {
    return (0, _validation.validateStrList)(key, (0, _misc.toArrayIfSingle)(value));
  },
  autoClose: _validation.validateBoolean,
  icon: function icon(key, value) {
    return value && (0, _misc.toBool)(value) === false ? false : (0, _validation.validateString)(key, value, _position.isValidPosition);
  },
  iconClosed: function iconClosed(key, value) {
    return (0, _validation.validateString)(key, value, isValidIconClosed);
  },
  iconOpen: function iconOpen(key, value) {
    return (0, _validation.validateString)(key, value, isValidIconOpen);
  },
  hover: _validation.validateBoolean
};
var collapsibleConfigValidator = {
  id: _validation.validateString,
  className: function className(key, value) {
    return (0, _validation.validateStrList)(key, (0, _misc.toArrayIfSingle)(value));
  },
  horizontal: _validation.validateBoolean,
  reverse: _validation.validateBoolean,
  peek: _validation.validateBooleanOrString,
  autoClose: _validation.validateBoolean,
  icon: function icon(key, value) {
    return (0, _misc.toBool)(value) === false ? false : (0, _validation.validateString)(key, value, _position.isValidPosition);
  },
  iconClosed: function iconClosed(key, value) {
    return (0, _validation.validateString)(key, value, isValidIconClosed);
  },
  iconOpen: function iconOpen(key, value) {
    return (0, _validation.validateString)(key, value, isValidIconOpen);
  }
};
var popupConfigValidator = {
  id: _validation.validateString,
  className: function className(key, value) {
    return (0, _validation.validateStrList)(key, (0, _misc.toArrayIfSingle)(value));
  },
  closeButton: _validation.validateBoolean,
  position: function position(key, value) {
    return (0, _validation.validateString)(key, value, function (v) {
      return v === S_AUTO || (0, _position.isValidPosition)(v) || (0, _position.isValidTwoFoldPosition)(v);
    });
  },
  autoClose: _validation.validateBoolean
};
var modalConfigValidator = {
  id: _validation.validateString,
  className: function className(key, value) {
    return (0, _validation.validateStrList)(key, (0, _misc.toArrayIfSingle)(value));
  },
  closeButton: _validation.validateBoolean,
  autoClose: _validation.validateBoolean
};
var offcanvasConfigValidator = {
  id: _validation.validateString,
  className: function className(key, value) {
    return (0, _validation.validateStrList)(key, (0, _misc.toArrayIfSingle)(value));
  },
  closeButton: _validation.validateBoolean,
  position: function position(key, value) {
    return (0, _validation.validateString)(key, value, _position.isValidPosition);
  },
  autoClose: _validation.validateBoolean
};
var getPrefixedNames = function getPrefixedNames(name) {
  var pref = MH.prefixName(name);
  return {
    _root: "".concat(pref, "__root"),
    _overlay: "".concat(pref, "__overlay"),
    // only used for modal/offcanvas
    _innerWrapper: "".concat(pref, "__inner-wrapper"),
    _outerWrapper: "".concat(pref, "__outer-wrapper"),
    _content: "".concat(pref, "__content"),
    _container: "".concat(pref, "__container"),
    _trigger: "".concat(pref, "__trigger"),
    // Use different classes for styling to the ones used for auto-discovering
    // elements, so that re-creating existing widgets can correctly find the
    // elements to be used by the new widget synchronously before the current
    // one is destroyed.
    _containerForSelect: "".concat(pref, "-container"),
    _triggerForSelect: "".concat(pref, "-trigger"),
    _contentId: "".concat(pref, "-content-id")
  };
};
var findContainer = function findContainer(content, cls) {
  var currWidget = instances.get(content);
  // If there's an existing widget that we're about to destroy, the content
  // element will be wrapped in several elements and won't be restored until
  // the next mutate time. In that case, to correctly determine the container
  // element, use the current widget's root element, which is located in the
  // content element's original place.
  var childRef = (currWidget === null || currWidget === void 0 ? void 0 : currWidget.getRoot()) || content;
  if (!MH.parentOf(childRef)) {
    // The current widget is not yet initialized (i.e. we are re-creating it
    // immediately after it was constructed)
    childRef = content;
  }

  // Find the content container
  var container = childRef.closest(".".concat(cls));
  if (!container) {
    container = MH.parentOf(childRef);
  }
  return container;
};
var findTriggers = function findTriggers(content, prefixedNames) {
  var container = findContainer(content, prefixedNames._containerForSelect);
  // jsdom does not like the below selector when suffixed by [data-*] or :not()...
  // const triggerSelector = `:is(.${prefixedNames._triggerForSelect},[data-${prefixedNames._triggerForSelect}])`;
  // So use this:
  var getTriggerSelector = function getTriggerSelector(suffix) {
    return ".".concat(prefixedNames._triggerForSelect).concat(suffix, ",") + "[data-".concat(prefixedNames._triggerForSelect, "]").concat(suffix);
  };
  var contentId = (0, _cssAlter.getData)(content, prefixedNames._contentId);
  var triggers = [];
  if (contentId) {
    triggers = _toConsumableArray(MH.docQuerySelectorAll(getTriggerSelector("[data-".concat(prefixedNames._contentId, "=\"").concat(contentId, "\"]"))));
  } else if (container) {
    triggers = _toConsumableArray(MH.arrayFrom(MH.querySelectorAll(container, getTriggerSelector(":not([data-".concat(prefixedNames._contentId, "])")))).filter(function (t) {
      return !content.contains(t);
    }));
  }
  return triggers;
};
var getTriggersFrom = function getTriggersFrom(content, inputTriggers, wrapTriggers, prefixedNames) {
  var triggerMap = MH.newMap();
  inputTriggers = inputTriggers || findTriggers(content, prefixedNames);
  var addTrigger = function addTrigger(trigger, triggerConfig) {
    if (wrapTriggers) {
      var wrapper = MH.createElement((0, _domQuery.isInlineTag)(MH.tagName(trigger)) ? "span" : "div");
      (0, _domAlter.wrapElement)(trigger, {
        wrapper: wrapper,
        ignoreMove: true
      }); // no need to await
      trigger = wrapper;
    }
    triggerMap.set(trigger, triggerConfig);
  };
  if (MH.isArray(inputTriggers)) {
    var _iterator4 = _createForOfIteratorHelper(inputTriggers),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var trigger = _step4.value;
        addTrigger(trigger, (0, _widget.getWidgetConfig)((0, _cssAlter.getData)(trigger, prefixedNames._triggerForSelect), triggerConfigValidator));
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
  } else if (MH.isInstanceOf(inputTriggers, Map)) {
    var _iterator5 = _createForOfIteratorHelper(inputTriggers.entries()),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var _step5$value = _slicedToArray(_step5.value, 2),
          _trigger = _step5$value[0],
          triggerConfig = _step5$value[1];
        addTrigger(_trigger, (0, _widget.getWidgetConfig)(triggerConfig, triggerConfigValidator));
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
  }
  return triggerMap;
};
var setupElements = function setupElements(widget, content, properties) {
  var _properties$wrapTrigg;
  var prefixedNames = getPrefixedNames(properties.name);
  var container = findContainer(content, prefixedNames._containerForSelect);
  var wrapTriggers = (_properties$wrapTrigg = properties.wrapTriggers) !== null && _properties$wrapTrigg !== void 0 ? _properties$wrapTrigg : false;
  var triggers = getTriggersFrom(content, properties.triggers, wrapTriggers, prefixedNames);

  // Create two wrappers
  var innerWrapper = MH.createElement("div");
  (0, _cssAlter.addClasses)(innerWrapper, prefixedNames._innerWrapper);
  var outerWrapper = (0, _domAlter.wrapElementNow)(innerWrapper);

  // Setup the root element.
  // For off-canvas types we need another wrapper to serve as the root and we
  // need a placeholder element to save the content's original position so it
  // can be restored on destroy.
  // Otherwise use outerWrapper for root and insert the root where the content
  // was.
  var root;
  var placeholder;
  if (properties.isOffcanvas) {
    (0, _cssAlter.addClasses)(outerWrapper, prefixedNames._outerWrapper);
    root = (0, _domAlter.wrapElementNow)(outerWrapper);
    placeholder = MH.createElement("div");
    var overlay = MH.createElement("div");
    (0, _cssAlter.addClasses)(overlay, prefixedNames._overlay);
    (0, _domAlter.moveElement)(overlay, {
      to: root
    });
  } else {
    // Otherwise use the outer wrapper as the root
    root = placeholder = outerWrapper;
  }
  if (properties.id) {
    root.id = properties.id;
  }
  if (properties.className) {
    _cssAlter.addClassesNow.apply(void 0, [root].concat(_toConsumableArray((0, _misc.toArrayIfSingle)(properties.className))));
  }
  (0, _cssAlter.unsetBoolData)(root, PREFIX_IS_OPEN);
  var domID = (0, _domAlter.getOrAssignID)(root, properties.name);
  if (properties.isModal) {
    MH.setAttr(root, MC.S_ROLE, "dialog");
    MH.setAttr(root, S_ARIA_MODAL);
  }
  (0, _cssAlter.addClasses)(root, prefixedNames._root);
  (0, _cssAlter.disableInitialTransition)(root);

  // Add a close button?
  if (properties.closeButton) {
    var closeBtn = MH.createButton("Close");
    (0, _cssAlter.addClasses)(closeBtn, PREFIX_CLOSE_BTN);

    // If autoClose is true, it will be closed on click anyway, because the
    // close button is outside the content.
    (0, _event.addEventListenerTo)(closeBtn, MC.S_CLICK, function () {
      widget.close();
    });
    (0, _domAlter.moveElement)(closeBtn, {
      to: properties.isOffcanvas ? root : innerWrapper
    });
  }

  // Transfer the relevant classes/data attrs from content to root element, so
  // that our CSS can work without :has.
  // This won't cause forced layout since the root is not yet attached to the
  // DOM.
  for (var _i = 0, _arr = [_settings.settings.lightThemeClassName, _settings.settings.darkThemeClassName]; _i < _arr.length; _i++) {
    var cls = _arr[_i];
    if ((0, _cssAlter.hasClass)(content, cls)) {
      (0, _cssAlter.addClasses)(root, cls);
    }
  }
  var elements = {
    content: content,
    root: root,
    container: container,
    outerWrapper: outerWrapper,
    triggers: triggers
  };

  // -------------------- Close / destroy hooks
  widget.onClose(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
    var _iterator6, _step6, trigger;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _iterator6 = _createForOfIteratorHelper(triggers.keys());
          _context9.prev = 1;
          _iterator6.s();
        case 3:
          if ((_step6 = _iterator6.n()).done) {
            _context9.next = 11;
            break;
          }
          trigger = _step6.value;
          (0, _cssAlter.delData)(trigger, PREFIX_OPENS_ON_HOVER);
          MH.unsetAttr(trigger, S_ARIA_EXPANDED);
          _context9.next = 9;
          return (0, _cssAlter.unsetBoolData)(trigger, PREFIX_IS_OPEN);
        case 9:
          _context9.next = 3;
          break;
        case 11:
          _context9.next = 16;
          break;
        case 13:
          _context9.prev = 13;
          _context9.t0 = _context9["catch"](1);
          _iterator6.e(_context9.t0);
        case 16:
          _context9.prev = 16;
          _iterator6.f();
          return _context9.finish(16);
        case 19:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[1, 13, 16, 19]]);
  })));
  widget.onDestroy(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
    var _iterator7, _step7, _step7$value, trigger, triggerConfig, _i2, _arr2, el;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return (0, _domOptimize.waitForMutateTime)();
        case 2:
          (0, _domAlter.replaceElementNow)(placeholder, content, {
            ignoreMove: true
          });
          (0, _domAlter.moveElementNow)(root); // remove
          (0, _cssAlter.removeClassesNow)(content, prefixedNames._content);
          if (container) {
            (0, _cssAlter.removeClassesNow)(container, prefixedNames._container);
          }
          _iterator7 = _createForOfIteratorHelper(triggers.entries());
          try {
            for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
              _step7$value = _slicedToArray(_step7.value, 2), trigger = _step7$value[0], triggerConfig = _step7$value[1];
              MH.delAttr(trigger, MC.S_ARIA_CONTROLS);
              MH.delAttr(trigger, S_ARIA_EXPANDED);
              (0, _cssAlter.delDataNow)(trigger, PREFIX_OPENS_ON_HOVER);
              (0, _cssAlter.delDataNow)(trigger, PREFIX_IS_OPEN);
              _cssAlter.removeClassesNow.apply(void 0, [trigger, prefixedNames._trigger].concat(_toConsumableArray((triggerConfig === null || triggerConfig === void 0 ? void 0 : triggerConfig.className) || [])));
              if (trigger.id === (triggerConfig === null || triggerConfig === void 0 ? void 0 : triggerConfig.id)) {
                trigger.id = "";
              }
              if (wrapTriggers) {
                (0, _domAlter.replaceElementNow)(trigger, MH.childrenOf(trigger)[0], {
                  ignoreMove: true
                });
              }
            }
          } catch (err) {
            _iterator7.e(err);
          } finally {
            _iterator7.f();
          }
          triggers.clear();
          for (_i2 = 0, _arr2 = [content].concat(_toConsumableArray(triggers.keys())); _i2 < _arr2.length; _i2++) {
            el = _arr2[_i2];
            if (instances.get(el) === widget) {
              MH.deleteKey(instances, el);
            }
          }
        case 10:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  })));

  // -------------------- SETUP
  // Save the elements so we can lookup the instance
  var currWidget = instances.get(content);
  for (var _i3 = 0, _arr3 = [content].concat(_toConsumableArray(triggers.keys())); _i3 < _arr3.length; _i3++) {
    var el = _arr3[_i3];
    instances.set(el, widget);
  }

  // Wait for the DOMWatcher to be active, which may not be before interactive.
  (0, _domEvents.waitForInteractive)().then(currWidget === null || currWidget === void 0 ? void 0 : currWidget.destroy).then(_domOptimize.waitForMutateTime).then(function () {
    if (widget.isDestroyed()) {
      return;
    }
    (0, _cssAlter.addClassesNow)(content, prefixedNames._content);
    if (container) {
      (0, _cssAlter.addClassesNow)(container, prefixedNames._container);
    }
    if (properties.isOffcanvas) {
      (0, _domAlter.moveElementNow)(root, {
        to: MH.getBody(),
        ignoreMove: true
      });
    }

    // Move the placeholder element to before the content and then move
    // content into inner wrapper.
    (0, _domAlter.moveElementNow)(placeholder, {
      // for not-offcanvas it's also the root
      to: content,
      position: "before",
      ignoreMove: true
    });
    (0, _domAlter.moveElementNow)(content, {
      to: innerWrapper,
      ignoreMove: true
    });

    // Setup the triggers
    var _iterator8 = _createForOfIteratorHelper(triggers.entries()),
      _step8;
    try {
      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
        var _step8$value = _slicedToArray(_step8.value, 2),
          trigger = _step8$value[0],
          triggerConfig = _step8$value[1];
        MH.setAttr(trigger, MC.S_ARIA_CONTROLS, domID);
        MH.unsetAttr(trigger, S_ARIA_EXPANDED);
        (0, _cssAlter.setBoolDataNow)(trigger, PREFIX_OPENS_ON_HOVER, triggerConfig[MC.S_HOVER]);
        (0, _cssAlter.unsetBoolDataNow)(trigger, PREFIX_IS_OPEN);
        _cssAlter.addClassesNow.apply(void 0, [trigger, prefixedNames._trigger].concat(_toConsumableArray((triggerConfig === null || triggerConfig === void 0 ? void 0 : triggerConfig.className) || [])));
        if (triggerConfig !== null && triggerConfig !== void 0 && triggerConfig.id) {
          trigger.id = triggerConfig.id;
        }
      }
    } catch (err) {
      _iterator8.e(err);
    } finally {
      _iterator8.f();
    }
    setupListeners(widget, elements, properties, prefixedNames);
    if (properties.onSetup) {
      properties.onSetup();
    }
  });
  return elements;
};
var setupListeners = function setupListeners(widget, elements, properties, prefixedNames) {
  var content = elements.content,
    root = elements.root,
    triggers = elements.triggers;
  var doc = MH.getDoc();
  var hoverTimeOpened = 0;
  var isPointerOver = false;
  var activeTrigger = null;

  // ----------

  var isTrigger = function isTrigger(element) {
    return MH.includes(MH.arrayFrom(triggers.keys()), element.closest((0, _widget.getDefaultWidgetSelector)(prefixedNames._trigger)));
  };
  var shouldPreventDefault = function shouldPreventDefault(trigger) {
    var _triggers$get$prevent, _triggers$get;
    return (_triggers$get$prevent = (_triggers$get = triggers.get(trigger)) === null || _triggers$get === void 0 ? void 0 : _triggers$get.preventDefault) !== null && _triggers$get$prevent !== void 0 ? _triggers$get$prevent : true;
  };
  var usesHover = function usesHover(trigger) {
    var _triggers$get2;
    return (_triggers$get2 = triggers.get(trigger)) === null || _triggers$get2 === void 0 ? void 0 : _triggers$get2.hover;
  };
  var usesAutoClose = function usesAutoClose(trigger) {
    var _ref11, _triggers$get3;
    return (_ref11 = trigger ? (_triggers$get3 = triggers.get(trigger)) === null || _triggers$get3 === void 0 ? void 0 : _triggers$get3.autoClose : null) !== null && _ref11 !== void 0 ? _ref11 : properties.autoClose;
  };

  // ----------

  var toggleTrigger = function toggleTrigger(event, openIt) {
    var trigger = MH.currentTargetOf(event);
    if (MH.isElement(trigger)) {
      if (shouldPreventDefault(trigger)) {
        MH.preventDefault(event);
      }

      // If a click was fired shortly after opening on hover, ignore
      if (openIt !== false &&
      // not explicitly asked to close
      widget.isOpen() && MH.timeSince(hoverTimeOpened) < MIN_CLICK_TIME_AFTER_HOVER_OPEN) {
        return;
      }
      if (openIt !== null && openIt !== void 0 ? openIt : !widget.isOpen()) {
        // open it
        activeTrigger = trigger;
        MH.setAttr(trigger, S_ARIA_EXPANDED); // will be unset on close
        (0, _cssAlter.setBoolData)(trigger, PREFIX_IS_OPEN); // will be unset on close

        widget.open(); // no need to await

        if (usesAutoClose(trigger)) {
          if (usesHover(trigger)) {
            (0, _event.addEventListenerTo)(root, MC.S_POINTERENTER, setIsPointerOver);
            (0, _event.addEventListenerTo)(root, MC.S_POINTERLEAVE, pointerLeft);
          }

          // auto-close listeners setup by the onOpen handler below
        }
      } else {
        widget.close(); // out onClose handler below will remove listeners
      }
    }
  };

  // ----------

  var setIsPointerOver = function setIsPointerOver() {
    isPointerOver = true;
  };

  // ----------

  var unsetIsPointerOver = function unsetIsPointerOver(event) {
    // Keep it set to true if this is a touch pointer type; otherwise unset
    isPointerOver = isPointerOver && MH.isTouchPointerEvent(event);
  };

  // ----------

  var pointerEntered = function pointerEntered(event) {
    setIsPointerOver();
    if (!widget.isOpen()) {
      hoverTimeOpened = MH.timeNow();
      toggleTrigger(event, true);
    }
  };

  // ----------

  var pointerLeft = function pointerLeft(event) {
    unsetIsPointerOver(event);
    var trigger = MH.currentTargetOf(event);
    if (MH.isElement(trigger) && usesAutoClose(trigger)) {
      MH.setTimer(function () {
        if (!isPointerOver) {
          widget.close();
        }
      },
      // use a delay that allows the mouse to move from trigger to content
      // without closing it
      // TODO make this user-configurable
      properties.isOffcanvas ? 300 : 50);
    }
  };

  // ----------

  var closeIfEscape = function closeIfEscape(event) {
    if (event.key === "Escape") {
      widget.close(); // no need to await
    }
  };

  // ----------

  var closeIfClickOutside = function closeIfClickOutside(event) {
    var target = MH.targetOf(event);
    if (target === doc || MH.isElement(target) && !content.contains(target) &&
    // outside content
    !isTrigger(target) // handled by pointer watcher
    ) {
      widget.close();
    }
  };

  // ----------

  var maybeSetupAutoCloseListeners = function maybeSetupAutoCloseListeners(trigger, remove) {
    if (usesAutoClose(trigger)) {
      var addOrRemove = remove ? _event.removeEventListenerFrom : _event.addEventListenerTo;
      addOrRemove(doc, "keyup", closeIfEscape);

      // Add a short delay so that we don't catch the bubbling of the click event
      // that opened the widget.
      MH.setTimer(function () {
        return addOrRemove(doc, MC.S_CLICK, closeIfClickOutside);
      }, 100);
      if (trigger && usesHover(trigger)) {
        addOrRemove(trigger, MC.S_POINTERLEAVE, pointerLeft);
      }
    }
  };

  // ----------

  var setupOrCleanup = function setupOrCleanup(remove) {
    var addOrRemove = remove ? _event.removeEventListenerFrom : _event.addEventListenerTo;
    var _iterator9 = _createForOfIteratorHelper(triggers.entries()),
      _step9;
    try {
      for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
        var _step9$value = _slicedToArray(_step9.value, 2),
          trigger = _step9$value[0],
          triggerConfig = _step9$value[1];
        // Always setup click listeners
        addOrRemove(trigger, MC.S_CLICK, toggleTrigger);
        if (triggerConfig[MC.S_HOVER]) {
          addOrRemove(trigger, MC.S_POINTERENTER, pointerEntered);
        }
      }
    } catch (err) {
      _iterator9.e(err);
    } finally {
      _iterator9.f();
    }
  };

  // ----------

  setupOrCleanup(false);
  widget.onOpen(function () {
    maybeSetupAutoCloseListeners(activeTrigger, false); // setup listeners if relevant
  });
  widget.onClose(function () {
    hoverTimeOpened = 0;
    isPointerOver = false;
    (0, _event.removeEventListenerFrom)(root, MC.S_POINTERENTER, setIsPointerOver);
    (0, _event.removeEventListenerFrom)(root, MC.S_POINTERLEAVE, pointerLeft);
    maybeSetupAutoCloseListeners(activeTrigger, true); // remove listeners if any
    activeTrigger = null;
  });
  widget.onDestroy(function () {
    setupOrCleanup(true); // remove
  });
};

// COLLAPSIBLE ------------------------------

var insertCollapsibleIcon = function insertCollapsibleIcon(trigger, triggerConfig, widget, widgetConfig) {
  var _triggerConfig$icon, _ref12, _triggerConfig$iconCl, _ref13, _triggerConfig$iconOp;
  var iconPosition = (_triggerConfig$icon = triggerConfig.icon) !== null && _triggerConfig$icon !== void 0 ? _triggerConfig$icon : widgetConfig === null || widgetConfig === void 0 ? void 0 : widgetConfig.icon;
  var iconClosed = (_ref12 = (_triggerConfig$iconCl = triggerConfig.iconClosed) !== null && _triggerConfig$iconCl !== void 0 ? _triggerConfig$iconCl : widgetConfig === null || widgetConfig === void 0 ? void 0 : widgetConfig.iconClosed) !== null && _ref12 !== void 0 ? _ref12 : "plus";
  var iconOpen = (_ref13 = (_triggerConfig$iconOp = triggerConfig.iconOpen) !== null && _triggerConfig$iconOp !== void 0 ? _triggerConfig$iconOp : widgetConfig === null || widgetConfig === void 0 ? void 0 : widgetConfig.iconOpen) !== null && _ref13 !== void 0 ? _ref13 : "minus";
  if (iconPosition) {
    (0, _cssAlter.addClasses)(trigger, PREFIX_ICON_WRAPPER);
    (0, _cssAlter.setData)(trigger, PREFIX_ICON_POSITION, iconPosition);
    var icon = MH.createElement("span");
    (0, _cssAlter.setDataNow)(icon, PREFIX_TRIGGER_ICON, iconClosed);
    for (var l = 0; l < 2; l++) {
      var line = MH.createElement("span");
      (0, _cssAlter.addClassesNow)(line, PREFIX_LINE);
      (0, _domAlter.moveElementNow)(line, {
        to: icon
      });
    }
    (0, _domAlter.moveElement)(icon, {
      to: trigger,
      ignoreMove: true
    });
    widget.onOpen(function () {
      if ((0, _cssAlter.getBoolData)(trigger, PREFIX_IS_OPEN)) {
        (0, _cssAlter.setData)(icon, PREFIX_TRIGGER_ICON, iconOpen);
      }
    });
    widget.onClose(function () {
      (0, _cssAlter.setData)(icon, PREFIX_TRIGGER_ICON, iconClosed);
    });
  }
};

// POPUP ------------------------------

var fetchPopupPlacement = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(contentSize, containerView) {
    var containerPosition, containerTop, containerBottom, containerLeft, containerRight, containerHMiddle, containerVMiddle, vpSize, popupWidth, popupHeight, placementVars, placement, finalPlacement, alignmentVars, alignment;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          containerPosition = containerView.relative;
          containerTop = containerPosition[MC.S_TOP];
          containerBottom = containerPosition[MC.S_BOTTOM];
          containerLeft = containerPosition[MC.S_LEFT];
          containerRight = containerPosition[MC.S_RIGHT];
          containerHMiddle = containerPosition.hMiddle;
          containerVMiddle = containerPosition.vMiddle;
          _context11.next = 9;
          return (0, _size.fetchViewportSize)();
        case 9:
          vpSize = _context11.sent;
          popupWidth = contentSize.border[MC.S_WIDTH] / vpSize[MC.S_WIDTH];
          popupHeight = contentSize.border[MC.S_HEIGHT] / vpSize[MC.S_HEIGHT]; // - Find the maximum of these quantities:
          //   - containerTop - popupHeight:
          //     the space on top if placed on top-(left|right|)
          //   - 1 - (containerBottom + popupHeight):
          //     the space on bottom be if placed on bottom-(left|right|)
          //   - containerLeft - popupWidth:
          //     the space on left if placed on left-(top|bottom|)
          //   - 1 - (containerRight + popupWidth):
          //     the space on right if placed on right-(top|bottom|)
          //
          // This determines the main placement: top|bottom|left|right
          // Then to determine secondary alignment:
          // - For top/bottom placement, determine horizontal alignment:
          //   - Find the maximum of these quantities:
          //     - 1 - (containerLeft + popupWidth):
          //       the space on right if left-aligned
          //     - containerRight - popupWidth:
          //       the space on left if right-aligned
          //     - min(
          //           containerHMiddle - popupWidth / 2,
          //           1 - (containerHMiddle + popupWidth / 2),
          //       ):
          //       the minimum of the space on either left or right if center-aligned
          //
          // - For left/right placement, determine vertical alignment:
          //   - Find the maximum of these quantities:
          //     - 1 - (containerTop + popupHeight):
          //       the space on bottom if top-aligned
          //     - containerBottom - popupHeight:
          //       the space on top if bottom-aligned
          //     - min(
          //           containerVMiddle - popupHeight / 2,
          //           1 - (containerVMiddle + popupHeight / 2),
          //       ):
          //       the minimum of the space on either top or bottom if center-aligned
          placementVars = {
            top: containerTop - popupHeight,
            bottom: 1 - (containerBottom + popupHeight),
            left: containerLeft - popupWidth,
            right: 1 - (containerRight + popupWidth)
          };
          placement = (0, _math.keyWithMaxVal)(placementVars);
          if (!(placement === undefined)) {
            _context11.next = 16;
            break;
          }
          return _context11.abrupt("return");
        case 16:
          finalPlacement = placement;
          _context11.t0 = placement;
          _context11.next = _context11.t0 === MC.S_TOP ? 20 : _context11.t0 === MC.S_BOTTOM ? 20 : _context11.t0 === MC.S_LEFT ? 22 : _context11.t0 === MC.S_RIGHT ? 22 : 24;
          break;
        case 20:
          alignmentVars = {
            left: 1 - (containerLeft + popupWidth),
            right: containerRight - popupWidth,
            middle: MH.min(containerHMiddle - popupWidth / 2, 1 - (containerHMiddle + popupWidth / 2))
          };
          return _context11.abrupt("break", 25);
        case 22:
          alignmentVars = {
            top: 1 - (containerTop + popupHeight),
            bottom: containerBottom - popupHeight,
            middle: MH.min(containerVMiddle - popupHeight / 2, 1 - (containerVMiddle + popupHeight / 2))
          };
          return _context11.abrupt("break", 25);
        case 24:
          return _context11.abrupt("return");
        case 25:
          alignment = (0, _math.keyWithMaxVal)(alignmentVars);
          if (alignment !== "middle") {
            finalPlacement += "-" + alignment;
          }
          return _context11.abrupt("return", finalPlacement);
        case 28:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return function fetchPopupPlacement(_x, _x2) {
    return _ref14.apply(this, arguments);
  };
}();
//# sourceMappingURL=openable.cjs.map