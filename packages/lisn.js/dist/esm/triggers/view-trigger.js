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
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Triggers
 *
 * @categoryDescription View
 * {@link ViewTrigger} allows you to run actions when the viewport's scroll
 * position relative to a given target or offset from top/bottom/left/right is
 * one of the matching "views" (at/above/below/left/right), and undo those
 * actions when the viewport's "view" is not matching.
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { settings } from "../globals/settings.js";
import { hasClass, addClasses, getData } from "../utils/css-alter.js";
import { wrapElement, insertGhostClone } from "../utils/dom-alter.js";
import { isInlineTag } from "../utils/dom-query.js";
import { waitForReferenceElement } from "../utils/dom-search.js";
import { formatAsString } from "../utils/text.js";
import { validateStrList, validateString, validateNumList } from "../utils/validation.js";
import { getOppositeViews, isValidView, isValidScrollOffset } from "../utils/views.js";
import { Animate } from "../actions/animate.js";
import { AnimatePlay } from "../actions/animate-play.js";
import { ViewWatcher } from "../watchers/view-watcher.js";
import { registerTrigger, Trigger } from "./trigger.js";
import debug from "../debug/debug.js";

/**
 * {@link ViewTrigger} allows you to run actions when the viewport's scroll
 * position relative to a given target or offset from top/bottom/left/right is
 * one of the matching "views" (at/above/below/left/right), and undo those
 * actions when the viewport's "view" is not matching.
 *
 * -------
 *
 * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
 * specification.
 *
 * - Arguments (optional): One or more (comma-separated) {@link View}s.
 *   Default is "at".
 * - Additional trigger options:
 *   - `target`: A string element specification for an element (see
 *     {@link Utils.getReferenceElement | getReferenceElement}) or a
 *     {@link Types.ScrollOffset | ScrollOffset}.
 *   - `root`: A string element specification. See
 *     {@link Utils.getReferenceElement | getReferenceElement}.
 *   - `rootMargin`: A string.
 *   - `threshold`: A number or list (comma-separated) of numbers.
 *
 * @example
 * Show the element when it's in the viewport, hide otherwise.
 *
 * ```html
 * <div data-lisn-on-view="at @show"></div>
 * ```
 *
 * @example
 * Same as above. "views" is optional and defaults to "at".
 *
 * ```html
 * <div data-lisn-on-view="@show"></div>
 * ```
 *
 * @example
 * As above but using a CSS class instead of data attribute:
 *
 * ```html
 * <div class="lisn-on-view--@show"></div>
 * ```
 *
 * @example
 * Show the element 1000ms after the first time it enters the viewport.
 *
 * ```html
 * <div data-lisn-on-view="@show +once +delay=1000"></div>
 * ```
 *
 * @example
 * Add class `seen` the first time the element enters the viewport, and play
 * the animations defined on it 1000ms after each time it enters the viewport,
 * reverse the animations as soon as it goes out of view.
 *
 * ```html
 * <div data-lisn-on-view="@add-class=seen +once ;
 *                         @animate +do-delay=1000"
 * ></div>
 * ```
 *
 * @example
 * Add class `seen` when the viewport is at or below the element (element
 * above viewport), remove it when the viewport is above the element.
 * Element going to the left or right of the viewport will not trigger the
 * action. See {@link getOppositeViews}:
 *
 * ```html
 * <div data-lisn-on-view="at,below @add-class=seen"></div>
 * ```
 *
 * @example
 * Add class `cls` when the viewport is above or to the left the element
 * (element below or to the right of the viewport), remove it when the
 * viewport is either at, below or to the right of the element.
 *
 * ```html
 * <div data-lisn-on-view="above,left @add-class=cls"></div>
 * ```
 *
 * @example
 * Hide the element when the viewport is above the next element with class
 * `section`, show it when the viewport is below or at the target element.
 *
 * ```html
 * <div data-lisn-on-view="above @hide +target=next.section"></div>
 * <div class="section"></div>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <div data-lisn-on-view="above @hide +target=next-section"></div>
 * <div data-lisn-ref="section"></div>
 * ```
 *
 * @example
 * Open the {@link Widgets.Openable | Openable} widget configured for this
 * element when the viewport is 75% down from the top of the page.
 *
 * ```html
 * <div data-lisn-on-view="@open +target=top:75%"></div>
 * ```
 *
 * @category View
 */
export var ViewTrigger = /*#__PURE__*/function (_Trigger) {
  /**
   * If no actions are supplied, nothing is done.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the config is invalid.
   */
  function ViewTrigger(element, actions, config) {
    var _config$rootMargin;
    var _this;
    _classCallCheck(this, ViewTrigger);
    _this = _callSuper(this, ViewTrigger, [element, actions, config]);
    _defineProperty(_this, "getConfig", void 0);
    var logger = debug ? new debug.Logger({
      name: "ViewTrigger-".concat(formatAsString(element))
    }) : null;
    _this.getConfig = function () {
      return MH.copyObject(config || {});
    };
    if (!MH.lengthOf(actions)) {
      return _possibleConstructorReturn(_this);
    }
    var watcher = ViewWatcher.reuse({
      root: config === null || config === void 0 ? void 0 : config.root,
      rootMargin: config === null || config === void 0 || (_config$rootMargin = config.rootMargin) === null || _config$rootMargin === void 0 ? void 0 : _config$rootMargin.replace(/,/g, " "),
      threshold: config === null || config === void 0 ? void 0 : config.threshold
    });
    var target = (config === null || config === void 0 ? void 0 : config.target) || element;
    var views = (config === null || config === void 0 ? void 0 : config.views) || MC.S_AT;
    var oppositeViews = getOppositeViews(views);
    var setupWatcher = function setupWatcher(target) {
      if (!MH.lengthOf(oppositeViews)) {
        debug: logger === null || logger === void 0 || logger.debug6("Trigger can never be reversed, running now");
        // The action is never undone
        _this.run();
      } else {
        debug: logger === null || logger === void 0 || logger.debug6("Setting up trigger", views, oppositeViews);
        watcher.onView(target, _this.run, {
          views: views
        });
        watcher.onView(target, _this.reverse, {
          views: oppositeViews
        });
      }
    };

    // See comment in globals/settings under contentWrappingAllowed
    var willAnimate = false;
    var _iterator = _createForOfIteratorHelper(actions),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var action = _step.value;
        if (MH.isInstanceOf(action, Animate) || MH.isInstanceOf(action, AnimatePlay)) {
          willAnimate = true;
          break;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (willAnimate) {
      setupRepresentative(element).then(setupWatcher);
    } else {
      setupWatcher(target);
    }
    return _this;
  }
  _inherits(ViewTrigger, _Trigger);
  return _createClass(ViewTrigger, null, [{
    key: "register",
    value: function register() {
      registerTrigger("view", function (element, args, actions, config) {
        return new ViewTrigger(element, actions, MH.assign(config, {
          views: validateStrList("views", args, isValidView)
        }));
      }, newConfigValidator);
    }
  }]);
}(Trigger);

/**
 * @category View
 * @interface
 */

// ----------

var newConfigValidator = function newConfigValidator(element) {
  return {
    target: function target(key, value) {
      var _ref;
      return MH.isLiteralString(value) && isValidScrollOffset(value) ? value : (_ref = MH.isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    },
    root: function root(key, value) {
      var _ref2;
      return (_ref2 = MH.isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref2 !== void 0 ? _ref2 : undefined;
    },
    rootMargin: validateString,
    threshold: function threshold(key, value) {
      return validateNumList(key, value);
    }
  };
};
var setupRepresentative = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(element) {
    var _MH$classList;
    var allowedToWrap, target, prev, prevChild;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          allowedToWrap = settings.contentWrappingAllowed === true && getData(element, MC.PREFIX_NO_WRAP) === null &&
          // Done by another animate action?
          !((_MH$classList = MH.classList(MH.parentOf(element))) !== null && _MH$classList !== void 0 && _MH$classList.contains(MC.PREFIX_WRAPPER));
          if (!allowedToWrap) {
            _context.next = 9;
            break;
          }
          _context.next = 4;
          return wrapElement(element, {
            ignoreMove: true
          });
        case 4:
          target = _context.sent;
          addClasses(target, MC.PREFIX_WRAPPER);
          if (isInlineTag(MH.tagName(target))) {
            addClasses(target, MC.PREFIX_INLINE_WRAPPER);
          }
          _context.next = 18;
          break;
        case 9:
          // Otherwise create a dummy hidden clone that's not animated and position
          // it absolutely in a wrapper of size 0 that's inserted just before the
          // actual element, so that the hidden clone overlaps the actual element's
          // regular (pre-transformed) position.
          prev = element.previousElementSibling;
          prevChild = MH.childrenOf(prev)[0];
          if (!(prev && hasClass(prev, MC.PREFIX_WRAPPER) && prevChild && hasClass(prevChild, MC.PREFIX_GHOST))) {
            _context.next = 15;
            break;
          }
          // Done by a previous animate action?
          target = prevChild;
          _context.next = 18;
          break;
        case 15:
          _context.next = 17;
          return insertGhostClone(element);
        case 17:
          target = _context.sent._clone;
        case 18:
          return _context.abrupt("return", target);
        case 19:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function setupRepresentative(_x) {
    return _ref3.apply(this, arguments);
  };
}();
//# sourceMappingURL=view-trigger.js.map