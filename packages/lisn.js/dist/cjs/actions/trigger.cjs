"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Run = exports.Enable = exports.Disable = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _log = require("../utils/log.cjs");
var _tasks = require("../utils/tasks.cjs");
var _text = require("../utils/text.cjs");
var _trigger = require("../triggers/trigger.cjs");
var _action = require("./action.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Actions
 *
 * @categoryDescription Controlling triggers
 * {@link Enable} and {@link Disable} enable or disable a list of triggers
 * defined on the given element.
 *
 * {@link Run} runs or reverses a list of triggers defined on the given
 * element.
 */
/**
 * Enables or disables a list of triggers defined on the given element.
 *
 * **IMPORTANT:** When constructed, it disables all given triggers as a form of
 * initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 *   - Action name: "enable".
 *   - Accepted string arguments: one or more unique IDs of triggers defined on
 *     the given element
 *
 * @example
 * ```html
 * <button id="btn">Enable/disable</button>
 * <button data-lisn-on-click="
 *         @enable=triggerA,triggerB +target=#btn
 *         @add-class=clsA +id=triggerA
 *      "
 *      data-lisn-on-click="@add-class=clsB +id=triggerB"
 * ></button>
 * ```
 *
 * @category Controlling triggers
 */
var Enable = exports.Enable = /*#__PURE__*/function () {
  function Enable(element) {
    _classCallCheck(this, Enable);
    /**
     * Enables the triggers with IDs given to the constructor.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Disables the triggers with IDs given to the constructor.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Toggles the enabled state on each trigger given to the constructor.
     */
    _defineProperty(this, "toggle", void 0);
    for (var _len = arguments.length, ids = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      ids[_key - 1] = arguments[_key];
    }
    var _getMethods = getMethods(element, ids),
      _enable = _getMethods._enable,
      _disable = _getMethods._disable,
      _toggleEnable = _getMethods._toggleEnable;
    _disable(); // initial state

    this["do"] = _enable;
    this.undo = _disable;
    this[MC.S_TOGGLE] = _toggleEnable;
  }
  return _createClass(Enable, null, [{
    key: "register",
    value: function register() {
      (0, _action.registerAction)("enable", function (element, ids) {
        return _construct(Enable, [element].concat(_toConsumableArray(ids)));
      });
    }
  }]);
}();
/**
 * Disables or enables a list of triggers defined on the given element.
 *
 * **IMPORTANT:** When constructed, it enables all given triggers as a form of
 * initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 *   - Action name: "disable".
 *   - Accepted string arguments: one or more unique IDs of triggers defined on
 *     the given element
 *
 * @example
 * ```html
 * <button id="btn">Enable/disable</button>
 * <button data-lisn-on-click="
 *         @disable=triggerA,triggerB +target=#btn
 *         @add-class=clsA +id=triggerA
 *      "
 *      data-lisn-on-click="@add-class=clsB +id=triggerB"
 * ></button>
 * ```
 *
 * @category Controlling triggers
 */
var Disable = exports.Disable = /*#__PURE__*/function () {
  function Disable(element) {
    _classCallCheck(this, Disable);
    /**
     * Disables the triggers with IDs given to the constructor.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Enables the triggers with IDs given to the constructor.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Toggles the enabled state on each trigger given to the constructor.
     */
    _defineProperty(this, "toggle", void 0);
    for (var _len2 = arguments.length, ids = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      ids[_key2 - 1] = arguments[_key2];
    }
    var _getMethods2 = getMethods(element, ids),
      _enable = _getMethods2._enable,
      _disable = _getMethods2._disable,
      _toggleEnable = _getMethods2._toggleEnable;
    _enable(); // initial state

    this["do"] = _disable;
    this.undo = _enable;
    this[MC.S_TOGGLE] = _toggleEnable;
  }
  return _createClass(Disable, null, [{
    key: "register",
    value: function register() {
      (0, _action.registerAction)("disable", function (element, ids) {
        return _construct(Disable, [element].concat(_toConsumableArray(ids)));
      });
    }
  }]);
}();
/**
 * Runs or reverses a list of triggers defined on the given element.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 *   - Action name: "run".
 *   - Accepted string arguments: one or more unique IDs of triggers defined on
 *     the given element
 *
 * @example
 * ```html
 * <button data-lisn-on-click="
 *         @run=triggerA,triggerB
 *         @add-class=clsA +id=triggerA
 *      "
 *      data-lisn-on-run="@add-class=clsB +id=triggerB"
 * ></button>
 * ```
 *
 * @category Controlling triggers
 */
var Run = exports.Run = /*#__PURE__*/function () {
  function Run(element) {
    _classCallCheck(this, Run);
    /**
     * Runs the triggers with IDs given to the constructor.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Reverses the triggers with IDs given to the constructor.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Toggles the triggers with IDs given to the constructor.
     */
    _defineProperty(this, "toggle", void 0);
    for (var _len3 = arguments.length, ids = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      ids[_key3 - 1] = arguments[_key3];
    }
    var _getMethods3 = getMethods(element, ids),
      _run = _getMethods3._run,
      _reverse = _getMethods3._reverse,
      _toggle = _getMethods3._toggle;
    this["do"] = _run;
    this.undo = _reverse;
    this[MC.S_TOGGLE] = _toggle;
  }
  return _createClass(Run, null, [{
    key: "register",
    value: function register() {
      (0, _action.registerAction)("run", function (element, ids) {
        return _construct(Run, [element].concat(_toConsumableArray(ids)));
      });
    }
  }]);
}(); // --------------------
var getMethods = function getMethods(element, ids) {
  var triggerPromises = getTriggers(element, ids);
  var call = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(method) {
      var triggers, _iterator, _step, trigger;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return triggerPromises;
          case 2:
            triggers = _context.sent;
            _iterator = _createForOfIteratorHelper(triggers);
            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                trigger = _step.value;
                trigger[method]();
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          case 5:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function call(_x) {
      return _ref.apply(this, arguments);
    };
  }();
  return {
    _enable: function _enable() {
      return call("enable");
    },
    _disable: function _disable() {
      return call("disable");
    },
    _toggleEnable: function _toggleEnable() {
      return call("toggleEnable");
    },
    _run: function _run() {
      return call("run");
    },
    _reverse: function _reverse() {
      return call("reverse");
    },
    _toggle: function _toggle() {
      return call(MC.S_TOGGLE);
    }
  };
};
var getTriggers = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(element, ids) {
    var triggers, _iterator2, _step2, id, trigger;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          triggers = [];
          if (MH.lengthOf(ids)) {
            _context2.next = 4;
            break;
          }
          (0, _log.logWarn)("At least 1 ID is required for enable action");
          return _context2.abrupt("return", triggers);
        case 4:
          _iterator2 = _createForOfIteratorHelper(ids);
          _context2.prev = 5;
          _iterator2.s();
        case 7:
          if ((_step2 = _iterator2.n()).done) {
            _context2.next = 20;
            break;
          }
          id = _step2.value;
          trigger = _trigger.Trigger.get(element, id);
          if (trigger) {
            _context2.next = 17;
            break;
          }
          _context2.next = 13;
          return (0, _tasks.waitForDelay)(0);
        case 13:
          // in case it's being processed now
          trigger = _trigger.Trigger.get(element, id);
          if (trigger) {
            _context2.next = 17;
            break;
          }
          (0, _log.logWarn)("No trigger with ID ".concat(id, " for element ").concat((0, _text.formatAsString)(element)));
          return _context2.abrupt("continue", 18);
        case 17:
          triggers.push(trigger);
        case 18:
          _context2.next = 7;
          break;
        case 20:
          _context2.next = 25;
          break;
        case 22:
          _context2.prev = 22;
          _context2.t0 = _context2["catch"](5);
          _iterator2.e(_context2.t0);
        case 25:
          _context2.prev = 25;
          _iterator2.f();
          return _context2.finish(25);
        case 28:
          return _context2.abrupt("return", triggers);
        case 29:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[5, 22, 25, 28]]);
  }));
  return function getTriggers(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=trigger.cjs.map