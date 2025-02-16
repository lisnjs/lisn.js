function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * @module Utils
 *
 * @categoryDescription CSS: Altering
 * These functions transition an element from one CSS class to another, but
 * could lead to forced layout if not scheduled using {@link waitForMutateTime}.
 * If a delay is supplied, then the transition is "scheduled" and if the
 * opposite transition is executed before the scheduled one, the original one
 * is cancelled. See {@link transitionElement} for an example.
 *
 * @categoryDescription CSS: Altering (optimized)
 * These functions transition an element from one CSS class to another in an
 * optimized way using {@link waitForMutateTime} and so are asynchronous.
 * If a delay is supplied, then the transition is "scheduled" and if the
 * opposite transition is executed before the scheduled one, the original one
 * is cancelled. See {@link transitionElement} for an example.
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { waitForMeasureTime, waitForMutateTime, waitForSubsequentMutateTime } from "./dom-optimize.js";
import { isDOMElement } from "./dom-query.js";
import { isValidNum, roundNumTo } from "./math.js";
import { waitForDelay } from "./tasks.js";
import { camelToKebabCase, splitOn } from "./text.js";

/**
 * Removes the given `fromCls` class and adds the given `toCls` class to the
 * element.
 *
 * Unlike {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/replace | DOMTokenList:replace},
 * this will always add `toCls` even if `fromCls` isn't in the element's class list.
 *
 * @returns {} True if there was a change made (class removed or added),
 *             false otherwise.
 *
 * @category CSS: Altering
 */
export var transitionElementNow = function transitionElementNow(element, fromCls, toCls) {
  cancelCSSTransitions(element, fromCls, toCls);

  // Avoid triggering MutationObserver unnecessarily.
  var didChange = false;
  if (hasClass(element, fromCls)) {
    didChange = true;
    removeClassesNow(element, fromCls);
  }
  if (!hasClass(element, toCls)) {
    addClassesNow(element, toCls);
    didChange = true;
  }
  return didChange;
};

/**
 * Like {@link transitionElementNow} except it will {@link waitForMutateTime},
 * and optionally a delay, and it finally awaits for the effective style's
 * transition-duration.
 *
 * If a delay is supplied, then the transition is "scheduled" and if the
 * opposite transition is executed before the scheduled one, this one is
 * cancelled.
 *
 * @example
 *
 * - {@link showElement} with delay of 100 schedules `lisn-hide` -> `lisn-show`
 *   in 100ms
 * - then if {@link hideElementNow} is called, or a scheduled
 *   {@link hideElement} completes  before that timer runs out, this call to
 *   {@link showElement} aborts
 *
 * ```javascript
 * hideElement(someElement, 10);
 * // this will be aborted in 10ms when the scheduled hideElement above
 * // completes
 * showElement(someElement, 100);
 * ```
 *
 * ```javascript
 * // this will be aborted in 10ms when the hideElement that will be scheduled
 * // below completes
 * showElement(someElement, 100);
 * hideElement(someElement, 10);
 * ```
 *
 * ```javascript
 * // this will be aborted immediately by hideElementNow that runs straight
 * // afterwards
 * showElement(someElement, 100);
 * hideElementNow(someElement);
 * ```
 *
 * ```javascript
 * hideElementNow(someElement);
 * // this will NOT be aborted because hideElementNow has completed already
 * showElement(someElement, 100);
 * ```
 *
 * @category CSS: Altering (optimized)
 */
export var transitionElement = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(element, fromCls, toCls) {
    var delay,
      thisTransition,
      didChange,
      transitionDuration,
      _args = arguments;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          delay = _args.length > 3 && _args[3] !== undefined ? _args[3] : 0;
          thisTransition = scheduleCSSTransition(element, toCls);
          if (!delay) {
            _context.next = 5;
            break;
          }
          _context.next = 5;
          return waitForDelay(delay);
        case 5:
          _context.next = 7;
          return waitForMutateTime();
        case 7:
          if (!thisTransition._isCancelled()) {
            _context.next = 9;
            break;
          }
          return _context.abrupt("return", false);
        case 9:
          didChange = transitionElementNow(element, fromCls, toCls);
          thisTransition._finish();
          if (didChange) {
            _context.next = 13;
            break;
          }
          return _context.abrupt("return", false);
        case 13:
          _context.next = 15;
          return getMaxTransitionDuration(element);
        case 15:
          transitionDuration = _context.sent;
          if (!transitionDuration) {
            _context.next = 19;
            break;
          }
          _context.next = 19;
          return waitForDelay(transitionDuration);
        case 19:
          return _context.abrupt("return", true);
        case 20:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function transitionElement(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Transitions an element from class `lisn-undisplay` (which applies `display:
 * none`) to `lisn-display` (no style associated with this).
 *
 * The difference between this and simply removing the `lisn-undisplay` class
 * is that previously scheduled transitions to `lisn-undisplay` will be
 * cancelled.
 *
 * @see {@link transitionElementNow}
 *
 * @category CSS: Altering
 */
export var displayElementNow = function displayElementNow(element) {
  return transitionElementNow(element, MC.PREFIX_UNDISPLAY, MC.PREFIX_DISPLAY);
};

/**
 * Like {@link displayElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export var displayElement = function displayElement(element) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return transitionElement(element, MC.PREFIX_UNDISPLAY, MC.PREFIX_DISPLAY, delay);
};

/**
 * The opposite of {@link displayElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category CSS: Altering
 */
export var undisplayElementNow = function undisplayElementNow(element) {
  return transitionElementNow(element, MC.PREFIX_DISPLAY, MC.PREFIX_UNDISPLAY);
};

/**
 * Like {@link undisplayElementNow} except it will {@link waitForMutateTime},
 * and optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export var undisplayElement = function undisplayElement(element) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return transitionElement(element, MC.PREFIX_DISPLAY, MC.PREFIX_UNDISPLAY, delay);
};

/**
 * Transitions an element from class `lisn-hide` (which makes the element
 * hidden) to `lisn-show` (which shows it). These classes have CSS
 * transitions applied so the element is faded into and out of view.
 *
 * @see {@link transitionElementNow}.
 *
 * @category CSS: Altering
 */
export var showElementNow = function showElementNow(element) {
  return transitionElementNow(element, MC.PREFIX_HIDE, MC.PREFIX_SHOW);
};

/**
 * Like {@link showElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export var showElement = function showElement(element) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return transitionElement(element, MC.PREFIX_HIDE, MC.PREFIX_SHOW, delay);
};

/**
 * The opposite of {@link showElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category CSS: Altering
 */
export var hideElementNow = function hideElementNow(element) {
  return transitionElementNow(element, MC.PREFIX_SHOW, MC.PREFIX_HIDE);
};

/**
 * Like {@link hideElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export var hideElement = function hideElement(element) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return transitionElement(element, MC.PREFIX_SHOW, MC.PREFIX_HIDE, delay);
};

/**
 * If {@link isElementUndisplayed}, it will {@link displayElementNow},
 * otherwise it will {@link undisplayElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category CSS: Altering
 */
export var toggleDisplayElementNow = function toggleDisplayElementNow(element) {
  return isElementUndisplayed(element) ? displayElementNow(element) : undisplayElementNow(element);
};

/**
 * Like {@link toggleDisplayElementNow} except it will {@link waitForMutateTime},
 * and optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export var toggleDisplayElement = function toggleDisplayElement(element) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return isElementUndisplayed(element) ? displayElement(element, delay) : undisplayElement(element, delay);
};

/**
 * If {@link isElementHidden}, it will {@link showElementNow}, otherwise
 * {@link hideElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category CSS: Altering
 */
export var toggleShowElementNow = function toggleShowElementNow(element) {
  return isElementHidden(element) ? showElementNow(element) : hideElementNow(element);
};

/**
 * Like {@link toggleShowElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export var toggleShowElement = function toggleShowElement(element) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return isElementHidden(element) ? showElement(element, delay) : hideElement(element, delay);
};

/**
 * Returns true if the element's class list contains `lisn-hide`.
 *
 * @category CSS: Altering (optimized)
 */
export var isElementHidden = function isElementHidden(element) {
  return hasClass(element, MC.PREFIX_HIDE);
};

/**
 * Returns true if the element's class list contains `lisn-undisplay`.
 *
 * @category CSS: Altering (optimized)
 */
export var isElementUndisplayed = function isElementUndisplayed(element) {
  return hasClass(element, MC.PREFIX_UNDISPLAY);
};

/**
 * Returns true if the element's class list contains the given class.
 *
 * @category CSS: Altering (optimized)
 */
export var hasClass = function hasClass(el, className) {
  return MH.classList(el).contains(className);
};

/**
 * Adds the given classes to the element.
 *
 * @category CSS: Altering
 */
export var addClassesNow = function addClassesNow(el) {
  var _MH$classList;
  for (var _len = arguments.length, classNames = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    classNames[_key - 1] = arguments[_key];
  }
  return (_MH$classList = MH.classList(el)).add.apply(_MH$classList, classNames);
};

/**
 * Like {@link addClassesNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export var addClasses = function addClasses(el) {
  for (var _len2 = arguments.length, classNames = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    classNames[_key2 - 1] = arguments[_key2];
  }
  return waitForMutateTime().then(function () {
    return addClassesNow.apply(void 0, [el].concat(classNames));
  });
};

/**
 * Removes the given classes to the element.
 *
 * @category CSS: Altering
 */
export var removeClassesNow = function removeClassesNow(el) {
  var _MH$classList2;
  for (var _len3 = arguments.length, classNames = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    classNames[_key3 - 1] = arguments[_key3];
  }
  return (_MH$classList2 = MH.classList(el)).remove.apply(_MH$classList2, classNames);
};

/**
 * Like {@link removeClassesNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export var removeClasses = function removeClasses(el) {
  for (var _len4 = arguments.length, classNames = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    classNames[_key4 - 1] = arguments[_key4];
  }
  return waitForMutateTime().then(function () {
    return removeClassesNow.apply(void 0, [el].concat(classNames));
  });
};

/**
 * Toggles the given class on the element.
 *
 * @param {} force See {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle | DOMTokenList:toggle}
 *
 * @category CSS: Altering
 */
export var toggleClassNow = function toggleClassNow(el, className, force) {
  return MH.classList(el).toggle(className, force);
};

/**
 * Like {@link toggleClassNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export var toggleClass = function toggleClass(el, className, force) {
  return waitForMutateTime().then(function () {
    return toggleClassNow(el, className, force);
  });
};

// For *Data: to avoid unnecessary type checking that ensures element is
// HTMLElement or SVGElement, use getAttribute instead of dataset.

/**
 * Returns the value of the given data attribute. The name of the attribute
 * must _not_ start with `data`. It can be in either camelCase or kebab-case,
 * it is converted as needed.
 *
 * @category CSS: Altering (optimized)
 */
export var getData = function getData(el, name) {
  return MH.getAttr(el, MH.prefixData(name));
};

/**
 * Returns the value of the given data attribute as a boolean. Its value is
 * expected to be either blank or "true" (which result in `true`), or "false"
 * (which results in `false`).
 *
 * The name of the attribute must _not_ start with `data`. It can be in either
 * camelCase or kebab-case, it is converted as needed.
 *
 * @category CSS: Altering (optimized)
 */
export var getBoolData = function getBoolData(el, name) {
  var value = getData(el, name);
  return value !== null && value !== "false";
};

/**
 * Sets the given data attribute.
 *
 * The name of the attribute must _not_ start with `data`. It can be in either
 * camelCase or kebab-case, it is converted as needed.
 *
 * @category CSS: Altering
 */
export var setDataNow = function setDataNow(el, name, value) {
  return MH.setAttr(el, MH.prefixData(name), value);
};

/**
 * Like {@link setDataNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export var setData = function setData(el, name, value) {
  return waitForMutateTime().then(function () {
    return setDataNow(el, name, value);
  });
};

/**
 * Sets the given data attribute with value "true" (default) or "false".
 *
 * The name of the attribute must _not_ start with `data`. It can be in either
 * camelCase or kebab-case, it is converted as needed.
 *
 * @category CSS: Altering
 */
export var setBoolDataNow = function setBoolDataNow(el, name) {
  var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return MH.setAttr(el, MH.prefixData(name), value + "");
};

/**
 * Like {@link setBoolDataNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export var setBoolData = function setBoolData(el, name) {
  var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return waitForMutateTime().then(function () {
    return setBoolDataNow(el, name, value);
  });
};

/**
 * Sets the given data attribute with value "false".
 *
 * The name of the attribute must _not_ start with `data`. It can be in either
 * camelCase or kebab-case, it is converted as needed.
 *
 * @category CSS: Altering
 */
export var unsetBoolDataNow = function unsetBoolDataNow(el, name) {
  return MH.unsetAttr(el, MH.prefixData(name));
};

/**
 * Like {@link unsetBoolDataNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export var unsetBoolData = function unsetBoolData(el, name) {
  return waitForMutateTime().then(function () {
    return unsetBoolDataNow(el, name);
  });
};

/**
 * Deletes the given data attribute.
 *
 * The name of the attribute must _not_ start with `data`. It can be in either
 * camelCase or kebab-case, it is converted as needed.
 *
 * @category CSS: Altering
 */
export var delDataNow = function delDataNow(el, name) {
  return MH.delAttr(el, MH.prefixData(name));
};

/**
 * Like {@link delDataNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export var delData = function delData(el, name) {
  return waitForMutateTime().then(function () {
    return delDataNow(el, name);
  });
};

/**
 * Returns the value of the given property from the computed style of the
 * element.
 *
 * @category DOM: Altering
 */
export var getComputedStylePropNow = function getComputedStylePropNow(element, prop) {
  return getComputedStyle(element).getPropertyValue(prop);
};

/**
 * Like {@link getComputedStylePropNow} except it will {@link waitForMeasureTime}.
 *
 * @category DOM: Altering (optimized)
 */
export var getComputedStyleProp = function getComputedStyleProp(element, prop) {
  return waitForMeasureTime().then(function () {
    return getComputedStylePropNow(element, prop);
  });
};

/**
 * Returns the value of the given property from the inline style of the
 * element.
 *
 * @category DOM: Altering
 */
export var getStylePropNow = function getStylePropNow(element, prop) {
  var _style;
  return (_style = element.style) === null || _style === void 0 ? void 0 : _style.getPropertyValue(prop);
};

/**
 * Like {@link getStylePropNow} except it will {@link waitForMeasureTime}.
 *
 * @category DOM: Altering (optimized)
 */
export var getStyleProp = function getStyleProp(element, prop) {
  return waitForMeasureTime().then(function () {
    return getStylePropNow(element, prop);
  });
};

/**
 * Sets the given property on the inline style of the element.
 *
 * @category DOM: Altering
 */
export var setStylePropNow = function setStylePropNow(element, prop, value) {
  var _style2;
  return (_style2 = element.style) === null || _style2 === void 0 ? void 0 : _style2.setProperty(prop, value);
};

/**
 * Like {@link setStylePropNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export var setStyleProp = function setStyleProp(element, prop, value) {
  return waitForMutateTime().then(function () {
    return setStylePropNow(element, prop, value);
  });
};

/**
 * Deletes the given property on the inline style of the element.
 *
 * @category DOM: Altering
 */
export var delStylePropNow = function delStylePropNow(element, prop) {
  var _style3;
  return (_style3 = element.style) === null || _style3 === void 0 ? void 0 : _style3.removeProperty(prop);
};

/**
 * Like {@link delStylePropNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export var delStyleProp = function delStyleProp(element, prop) {
  return waitForMutateTime().then(function () {
    return delStylePropNow(element, prop);
  });
};

/**
 * In milliseconds.
 *
 * @ignore
 * @internal
 */
export var getMaxTransitionDuration = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(element) {
    var propVal;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return getComputedStyleProp(element, "transition-duration");
        case 2:
          propVal = _context2.sent;
          return _context2.abrupt("return", MH.max.apply(MH, _toConsumableArray(splitOn(propVal, ",", true).map(function (strValue) {
            var duration = MH.parseFloat(strValue) || 0;
            if (strValue === duration + "s") {
              duration *= 1000;
            }
            return duration;
          }))));
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getMaxTransitionDuration(_x4) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * @ignore
 * @internal
 */
export var disableInitialTransition = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(element) {
    var delay,
      _args3 = arguments;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          delay = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : 0;
          _context3.next = 3;
          return addClasses(element, MC.PREFIX_TRANSITION_DISABLE);
        case 3:
          if (!delay) {
            _context3.next = 6;
            break;
          }
          _context3.next = 6;
          return waitForDelay(delay);
        case 6:
          _context3.next = 8;
          return waitForSubsequentMutateTime();
        case 8:
          removeClassesNow(element, MC.PREFIX_TRANSITION_DISABLE);
        case 9:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function disableInitialTransition(_x5) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * @ignore
 * @internal
 */
export var setHasModal = function setHasModal() {
  return setBoolData(MH.getBody(), PREFIX_HAS_MODAL);
};

/**
 * @ignore
 * @internal
 */
export var delHasModal = function delHasModal() {
  return delData(MH.getBody(), PREFIX_HAS_MODAL);
};

/**
 * @ignore
 * @internal
 */
export var copyStyle = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(fromElement, toElement, includeComputedProps) {
    var props, _iterator, _step, prop, style, _prop, value, _prop2;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          if (!(!isDOMElement(fromElement) || !isDOMElement(toElement))) {
            _context4.next = 2;
            break;
          }
          return _context4.abrupt("return");
        case 2:
          _context4.next = 4;
          return waitForMeasureTime();
        case 4:
          props = {};
          if (includeComputedProps) {
            _iterator = _createForOfIteratorHelper(includeComputedProps);
            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                prop = _step.value;
                props[prop] = getComputedStylePropNow(fromElement, prop);
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          }
          style = fromElement.style; // only inline styles
          for (_prop in style) {
            value = style.getPropertyValue(_prop);
            if (value) {
              props[_prop] = value;
            }
          }
          for (_prop2 in props) {
            setStyleProp(toElement, _prop2, props[_prop2]);
          }
          addClasses.apply(void 0, [toElement].concat(_toConsumableArray(MH.classList(fromElement))));
        case 10:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function copyStyle(_x6, _x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

/**
 * If the props keys are in camelCase they are converted to kebab-case
 *
 * If a value is null or undefined, the property is deleted.
 *
 * @ignore
 * @internal
 */
export var setNumericStyleProps = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(element, props) {
    var options,
      transformFn,
      varPrefix,
      prop,
      cssPropSuffix,
      varName,
      value,
      _options$_numDecimal,
      thisNumDecimal,
      currValue,
      _args5 = arguments;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          options = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : {};
          if (isDOMElement(element)) {
            _context5.next = 3;
            break;
          }
          return _context5.abrupt("return");
        case 3:
          transformFn = options._transformFn;
          varPrefix = MH.prefixCssJsVar((options === null || options === void 0 ? void 0 : options._prefix) || "");
          _context5.t0 = _regeneratorRuntime().keys(props);
        case 6:
          if ((_context5.t1 = _context5.t0()).done) {
            _context5.next = 28;
            break;
          }
          prop = _context5.t1.value;
          cssPropSuffix = camelToKebabCase(prop);
          varName = "".concat(varPrefix).concat(cssPropSuffix);
          value = void 0;
          if (isValidNum(props[prop])) {
            _context5.next = 15;
            break;
          }
          value = null;
          _context5.next = 25;
          break;
        case 15:
          value = props[prop];
          thisNumDecimal = (_options$_numDecimal = options === null || options === void 0 ? void 0 : options._numDecimal) !== null && _options$_numDecimal !== void 0 ? _options$_numDecimal : value > 0 && value < 1 ? 2 : 0;
          if (!transformFn) {
            _context5.next = 24;
            break;
          }
          _context5.t2 = MH;
          _context5.next = 21;
          return getStyleProp(element, varName);
        case 21:
          _context5.t3 = _context5.sent;
          currValue = _context5.t2.parseFloat.call(_context5.t2, _context5.t3);
          value = transformFn(prop, currValue || 0, value);
        case 24:
          value = roundNumTo(value, thisNumDecimal);
        case 25:
          if (value === null) {
            delStyleProp(element, varName);
          } else {
            setStyleProp(element, varName, value + ((options === null || options === void 0 ? void 0 : options._units) || ""));
          }
          _context5.next = 6;
          break;
        case 28:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function setNumericStyleProps(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

/**
 * @ignore
 * @internal
 */

// ----------------------------------------

var PREFIX_HAS_MODAL = MH.prefixName("has-modal");
var scheduledCSSTransitions = MH.newWeakMap();
var cancelCSSTransitions = function cancelCSSTransitions(element) {
  var scheduledTransitions = scheduledCSSTransitions.get(element);
  if (!scheduledTransitions) {
    return;
  }
  for (var _len5 = arguments.length, toClasses = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    toClasses[_key5 - 1] = arguments[_key5];
  }
  for (var _i = 0, _toClasses = toClasses; _i < _toClasses.length; _i++) {
    var toCls = _toClasses[_i];
    var scheduledTransition = scheduledTransitions[toCls];
    if (scheduledTransition) {
      scheduledTransition._cancel();
    }
  }
};
var scheduleCSSTransition = function scheduleCSSTransition(element, toCls) {
  var scheduledTransitions = scheduledCSSTransitions.get(element);
  if (!scheduledTransitions) {
    scheduledTransitions = {};
    scheduledCSSTransitions.set(element, scheduledTransitions);
  }
  var isCancelled = false;
  scheduledTransitions[toCls] = {
    _cancel: function _cancel() {
      isCancelled = true;
      MH.deleteObjKey(scheduledTransitions, toCls);
    },
    _finish: function _finish() {
      MH.deleteObjKey(scheduledTransitions, toCls);
    },
    _isCancelled: function _isCancelled() {
      return isCancelled;
    }
  };
  return scheduledTransitions[toCls];
};
//# sourceMappingURL=css-alter.js.map