"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unmapScrollable = exports.tryGetScrollableElement = exports.tryGetMainScrollableElement = exports.tryGetMainContentElement = exports.scrollTo = exports.mapScrollable = exports.isValidScrollDirectionList = exports.isValidScrollDirection = exports.isScrollable = exports.getDefaultScrollingElement = exports.getCurrentScrollAction = exports.getClosestScrollable = exports.getClientWidthNow = exports.getClientHeightNow = exports.fetchScrollableElement = exports.fetchMainScrollableElement = exports.fetchMainContentElement = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _settings = require("../globals/settings.cjs");
var _cssAlter = require("./css-alter.cjs");
var _directions = require("./directions.cjs");
var _domEvents = require("./dom-events.cjs");
var _domOptimize = require("./dom-optimize.cjs");
var _event = require("./event.cjs");
var _log = require("./log.cjs");
var _math = require("./math.cjs");
var _validation = require("./validation.cjs");
var _xMap = require("../modules/x-map.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Utils
 */
/**
 * @category Scrolling
 */

/**
 * @category Scrolling
 * @interface
 */

// ----------

/**
 * Returns true if the given element is scrollable in the given direction, or
 * in either direction (if `axis` is not given).
 *
 * **IMPORTANT:** If you enable `active` then be aware that:
 * 1. It may attempt to scroll the target in order to determine whether it's
 *    scrollable in a more reliable way than the default method of comparing
 *    clientWidth/Height to scrollWidth/Height. If there is currently any
 *    ongoing scroll on the target, this will stop it, so never use that inside
 *    scroll-triggered handlers.
 * 2. If the layout has been invalidated and not yet recalculated,
 *    this will cause a forced layout, so always {@link waitForMeasureTime}
 *    before calling this function when possible.
 *
 * @param {} [options.axis]    One of "x" or "y" for horizontal or vertical
 *                             scroll respectively. If not given, it checks
 *                             both.
 * @param {} [options.active]  If true, then if the target's current scroll
 *                             offset is 0, it will attempt to scroll it rather
 *                             than looking at the clientWidth/Height to
 *                             scrollWidth/Height. This is more reliable but can
 *                             cause issues, see note above.
 * @param {} [options.noCache] By default the result of a check is cached for
 *                             1s and if there's already a cached result for
 *                             this element, it is returns. Set this to true to
 *                             disable checking the cache and also saving the
 *                             result into the cache.
 *
 * @category Scrolling
 */
var _isScrollable = exports.isScrollable = function isScrollable(element, options) {
  var _ref = options || {},
    axis = _ref.axis,
    active = _ref.active,
    noCache = _ref.noCache;
  if (!axis) {
    return _isScrollable(element, {
      axis: "y",
      active: active,
      noCache: noCache
    }) || _isScrollable(element, {
      axis: "x",
      active: active,
      noCache: noCache
    });
  }
  if (!noCache) {
    var _isScrollableCache$ge;
    var cachedResult = (_isScrollableCache$ge = isScrollableCache.get(element)) === null || _isScrollableCache$ge === void 0 ? void 0 : _isScrollableCache$ge.get(axis);
    if (!MH.isNullish(cachedResult)) {
      return cachedResult;
    }
  }
  var offset = axis === "x" ? "Left" : "Top";
  var result = false;
  var doCache = !noCache;
  if (element["scroll".concat(offset)]) {
    result = true;
  } else if (active) {
    // Use scrollTo with explicit behavior set to instant instead of setting
    // the scrollTop/Left properties since the latter doesn't work with
    // scroll-behavior smooth.
    MH.elScrollTo(element, _defineProperty({}, MH.toLowerCase(offset), 1));
    var canScroll = element["scroll".concat(offset)] > 0;
    MH.elScrollTo(element, _defineProperty({}, MH.toLowerCase(offset), 0));
    result = canScroll;
  } else {
    var dimension = axis === "x" ? "Width" : "Height";
    result = element["scroll".concat(dimension)] > element["client".concat(dimension)];
    // No need to cache a passive check.
    doCache = false;
  }
  if (doCache) {
    isScrollableCache.sGet(element).set(axis, result);
    MH.setTimer(function () {
      MH.deleteKey(isScrollableCache.get(element), axis);
      isScrollableCache.prune(element);
    }, IS_SCROLLABLE_CACHE_TIMEOUT);
  }
  return result;
};

/**
 * Returns the closest scrollable ancestor of the given element, _not including
 * it_.
 *
 * @param {} options See {@link isScrollable}
 *
 * @return {} `null` if no scrollable ancestors are found.
 *
 * @category Scrolling
 */
var getClosestScrollable = exports.getClosestScrollable = function getClosestScrollable(element, options) {
  // Walk up the tree, starting at the element in question but excluding it.
  var ancestor = element;
  while (ancestor = MH.parentOf(ancestor)) {
    if (_isScrollable(ancestor, options)) {
      return ancestor;
    }
  }
  return null;
};

/**
 * Returns the current {@link ScrollAction} if any.
 *
 * @category Scrolling
 */
var getCurrentScrollAction = exports.getCurrentScrollAction = function getCurrentScrollAction(scrollable) {
  scrollable = toScrollableOrDefault(scrollable);
  var action = currentScrollAction.get(scrollable);
  if (action) {
    return MH.copyObject(action);
  }
  return null;
};

/**
 * Scrolls the given scrollable element to the given `to` target.
 *
 * Returns `null` if there's an ongoing scroll that is not cancellable.
 *
 * Note that if `to` is an element or a selector, then it _must_ be a
 * descendant of the scrollable element.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *               If the target coordinates are invalid.
 *
 * @param {} to  If this is an element, then its top-left position is used as
 *               the target coordinates. If it is a string, then it is treated
 *               as a selector for an element using `querySelector`.
 *
 * @return {} `null` if there's an ongoing scroll that is not cancellable,
 * otherwise a {@link ScrollAction}.
 *
 * @category Scrolling
 */
var scrollTo = exports.scrollTo = function scrollTo(to, userOptions) {
  var options = getOptions(to, userOptions);
  var scrollable = options._scrollable;

  // cancel current scroll action if any
  var currentScroll = currentScrollAction.get(scrollable);
  if (currentScroll) {
    if (!currentScroll.cancel()) {
      // current scroll action is not cancellable by us
      return null;
    }
  }
  var isCancelled = false;
  var cancelFn = options._weCanInterrupt ? function () {
    return isCancelled = true;
  } : function () {
    return false;
  };
  var scrollEvents = ["touchmove", "wheel"]; // don't bother with keyboard
  var preventScrollHandler = null;
  if (options._userCanInterrupt) {
    var _iterator = _createForOfIteratorHelper(scrollEvents),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var eventType = _step.value;
        (0, _event.addEventListenerTo)(scrollable, eventType, function () {
          isCancelled = true;
        }, {
          once: true
        });
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } else {
    preventScrollHandler = MH.preventDefault;
    var _iterator2 = _createForOfIteratorHelper(scrollEvents),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _eventType = _step2.value;
        (0, _event.addEventListenerTo)(scrollable, _eventType, preventScrollHandler, {
          passive: false
        });
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }
  var promise = initiateScroll(options, function () {
    return isCancelled;
  });
  var thisScrollAction = {
    waitFor: function waitFor() {
      return promise;
    },
    cancel: cancelFn
  };
  var cleanup = function cleanup() {
    if (currentScrollAction.get(scrollable) === thisScrollAction) {
      MH.deleteKey(currentScrollAction, scrollable);
    }
    if (preventScrollHandler) {
      for (var _i = 0, _scrollEvents = scrollEvents; _i < _scrollEvents.length; _i++) {
        var _eventType2 = _scrollEvents[_i];
        (0, _event.removeEventListenerFrom)(scrollable, _eventType2, preventScrollHandler, {
          passive: false
        });
      }
    }
  };
  thisScrollAction.waitFor().then(cleanup)["catch"](cleanup);
  currentScrollAction.set(scrollable, thisScrollAction);
  return thisScrollAction;
};

/**
 * Returns true if the given string is a valid scroll direction.
 *
 * @category Validation
 */
var isValidScrollDirection = exports.isValidScrollDirection = function isValidScrollDirection(direction) {
  return MH.includes(_directions.SCROLL_DIRECTIONS, direction);
};

/**
 * Returns true if the given string or array is a list of valid scroll
 * directions.
 *
 * @category Validation
 */
var isValidScrollDirectionList = exports.isValidScrollDirectionList = function isValidScrollDirectionList(directions) {
  return (0, _validation.isValidStrList)(directions, isValidScrollDirection, false);
};

/**
 * @ignore
 * @internal
 */
var mapScrollable = exports.mapScrollable = function mapScrollable(original, actualScrollable) {
  return mappedScrollables.set(original, actualScrollable);
};

/**
 * @ignore
 * @internal
 */
var unmapScrollable = exports.unmapScrollable = function unmapScrollable(original) {
  return MH.deleteKey(mappedScrollables, original);
};

/**
 * @ignore
 * @internal
 */
var getClientWidthNow = exports.getClientWidthNow = function getClientWidthNow(element) {
  return isScrollableBodyInQuirks(element) ? element.offsetWidth - getBorderWidth(element, MC.S_LEFT) - getBorderWidth(element, MC.S_RIGHT) : element[MC.S_CLIENT_WIDTH];
};

/**
 * @ignore
 * @internal
 */
var getClientHeightNow = exports.getClientHeightNow = function getClientHeightNow(element) {
  return isScrollableBodyInQuirks(element) ? element.offsetHeight - getBorderWidth(element, MC.S_TOP) - getBorderWidth(element, MC.S_BOTTOM) : element[MC.S_CLIENT_HEIGHT];
};

/**
 * @ignore
 * @internal
 */
var tryGetMainContentElement = exports.tryGetMainContentElement = function tryGetMainContentElement() {
  return mainContentElement !== null && mainContentElement !== void 0 ? mainContentElement : null;
};

/**
 * @ignore
 * @internal
 *
 * Exposed via ScrollWatcher
 */
var fetchMainContentElement = exports.fetchMainContentElement = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return init();
        case 2:
          return _context.abrupt("return", mainContentElement);
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function fetchMainContentElement() {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * @ignore
 * @internal
 */
var tryGetMainScrollableElement = exports.tryGetMainScrollableElement = function tryGetMainScrollableElement() {
  return mainScrollableElement !== null && mainScrollableElement !== void 0 ? mainScrollableElement : null;
};

/**
 * @ignore
 * @internal
 *
 * Exposed via ScrollWatcher
 */
var fetchMainScrollableElement = exports.fetchMainScrollableElement = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return init();
        case 2:
          return _context2.abrupt("return", mainScrollableElement);
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function fetchMainScrollableElement() {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * @ignore
 * @internal
 */
var getDefaultScrollingElement = exports.getDefaultScrollingElement = function getDefaultScrollingElement() {
  var body = MH.getBody();
  return _isScrollable(body) ? body : MH.getDocScrollingElement() || body;
};

/**
 * @ignore
 * @internal
 */
var tryGetScrollableElement = exports.tryGetScrollableElement = function tryGetScrollableElement(target) {
  return toScrollableOrMain(target, tryGetMainScrollableElement);
};

/**
 * @ignore
 * @internal
 */
var fetchScrollableElement = exports.fetchScrollableElement = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(target) {
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", toScrollableOrMain(target, fetchMainScrollableElement));
        case 1:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function fetchScrollableElement(_x) {
    return _ref4.apply(this, arguments);
  };
}();

// ----------------------------------------

var IS_SCROLLABLE_CACHE_TIMEOUT = 1000;
var isScrollableCache = (0, _xMap.newXMap)(function () {
  return MH.newMap();
});
var mappedScrollables = MH.newMap();
var currentScrollAction = MH.newMap();
var DIFF_THRESHOLD = 5;
var arePositionsDifferent = function arePositionsDifferent(start, end) {
  return (0, _math.maxAbs)(start.top - end.top, start.left - end.left) >= DIFF_THRESHOLD;
};
var toScrollableOrMain = function toScrollableOrMain(target, getMain) {
  if (MH.isElement(target)) {
    return mappedScrollables.get(target) || target;
  }
  if (!target || target === MH.getWindow() || target === MH.getDoc()) {
    return getMain();
  }
  throw MH.usageError("Unsupported scroll target");
};
var toScrollableOrDefault = function toScrollableOrDefault(scrollable) {
  return scrollable !== null && scrollable !== void 0 ? scrollable : getDefaultScrollingElement();
};
var getOptions = function getOptions(to, options) {
  var _options$weCanInterru, _options$userCanInter;
  var scrollable = toScrollableOrDefault(options === null || options === void 0 ? void 0 : options.scrollable);
  var target = _getTargetCoordinates(scrollable, to);
  var altTarget = options !== null && options !== void 0 && options.altTarget ? _getTargetCoordinates(scrollable, options === null || options === void 0 ? void 0 : options.altTarget) : null;
  return {
    _target: target,
    _offset: (options === null || options === void 0 ? void 0 : options.offset) || null,
    _altTarget: altTarget,
    _altOffset: (options === null || options === void 0 ? void 0 : options.altOffset) || null,
    _scrollable: scrollable,
    _duration: (options === null || options === void 0 ? void 0 : options.duration) || 0,
    _weCanInterrupt: (_options$weCanInterru = options === null || options === void 0 ? void 0 : options.weCanInterrupt) !== null && _options$weCanInterru !== void 0 ? _options$weCanInterru : false,
    _userCanInterrupt: (_options$userCanInter = options === null || options === void 0 ? void 0 : options.userCanInterrupt) !== null && _options$userCanInter !== void 0 ? _options$userCanInter : false
  };
};
var _getTargetCoordinates = function getTargetCoordinates(scrollable, target) {
  var docScrollingElement = MH.getDocScrollingElement();
  if (MH.isElement(target)) {
    if (scrollable === target || !scrollable.contains(target)) {
      throw MH.usageError("Target must be a descendant of the scrollable one");
    }
    return {
      top: function top() {
        return scrollable[MC.S_SCROLL_TOP] + MH.getBoundingClientRect(target).top - (scrollable === docScrollingElement ? 0 : MH.getBoundingClientRect(scrollable).top);
      },
      left: function left() {
        return scrollable[MC.S_SCROLL_LEFT] + MH.getBoundingClientRect(target).left - (scrollable === docScrollingElement ? 0 : MH.getBoundingClientRect(scrollable).left);
      }
    };
  }
  if (MH.isString(target)) {
    var targetEl = MH.docQuerySelector(target);
    if (!targetEl) {
      throw MH.usageError("No match for '".concat(target, "'"));
    }
    return _getTargetCoordinates(scrollable, targetEl);
  }
  if (!MH.isObject(target) || !("top" in target || "left" in target)) {
    throw MH.usageError("Invalid coordinates");
  }
  return target;
};
var getStartEndPosition = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(options) {
    var applyOffset, scrollable, start, end;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return (0, _domOptimize.waitForMeasureTime)();
        case 2:
          applyOffset = function applyOffset(position, offset) {
            position.top += (offset === null || offset === void 0 ? void 0 : offset.top) || 0;
            position.left += (offset === null || offset === void 0 ? void 0 : offset.left) || 0;
          };
          scrollable = options._scrollable;
          start = {
            top: scrollable[MC.S_SCROLL_TOP],
            left: scrollable[MC.S_SCROLL_LEFT]
          };
          end = getEndPosition(scrollable, start, options._target);
          applyOffset(end, options._offset);
          if (!arePositionsDifferent(start, end) && options._altTarget) {
            end = getEndPosition(scrollable, start, options._altTarget);
            applyOffset(end, options._altOffset);
          }
          return _context4.abrupt("return", {
            start: start,
            end: end
          });
        case 9:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function getStartEndPosition(_x2) {
    return _ref5.apply(this, arguments);
  };
}();

// must be called in "measure time"
var getEndPosition = function getEndPosition(scrollable, startPosition, targetCoordinates) {
  // by default no change in scroll top or left
  var endPosition = MH.copyObject(startPosition);
  if (!MH.isNullish(targetCoordinates === null || targetCoordinates === void 0 ? void 0 : targetCoordinates.top)) {
    if (MH.isFunction(targetCoordinates.top)) {
      endPosition.top = targetCoordinates.top(scrollable);
    } else {
      endPosition.top = targetCoordinates.top;
    }
  }
  if (!MH.isNullish(targetCoordinates === null || targetCoordinates === void 0 ? void 0 : targetCoordinates.left)) {
    if (MH.isFunction(targetCoordinates.left)) {
      endPosition.left = targetCoordinates.left(scrollable);
    } else {
      endPosition.left = targetCoordinates.left;
    }
  }

  // Set boundaries
  var scrollH = scrollable[MC.S_SCROLL_HEIGHT];
  var scrollW = scrollable[MC.S_SCROLL_WIDTH];
  var clientH = getClientHeightNow(scrollable);
  var clientW = getClientWidthNow(scrollable);
  endPosition.top = MH.min(scrollH - clientH, endPosition.top);
  endPosition.top = MH.max(0, endPosition.top);
  endPosition.left = MH.min(scrollW - clientW, endPosition.left);
  endPosition.left = MH.max(0, endPosition.left);
  return endPosition;
};
var initiateScroll = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(options, isCancelled) {
    var position, duration, scrollable, startTime, previousTimeStamp, currentPosition, _step3;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return getStartEndPosition(options);
        case 2:
          position = _context6.sent;
          duration = options._duration;
          scrollable = options._scrollable;
          currentPosition = position.start;
          _step3 = /*#__PURE__*/function () {
            var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
              var timeStamp, elapsed, progress;
              return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                while (1) switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return (0, _domOptimize.waitForMutateTime)();
                  case 2:
                    _context5.next = 4;
                    return (0, _domOptimize.waitForMeasureTime)();
                  case 4:
                    timeStamp = MH.timeNow();
                    if (!isCancelled()) {
                      _context5.next = 7;
                      break;
                    }
                    throw currentPosition;
                  case 7:
                    if (startTime) {
                      _context5.next = 12;
                      break;
                    }
                    if (!(duration === 0 || !arePositionsDifferent(currentPosition, position.end))) {
                      _context5.next = 11;
                      break;
                    }
                    MH.elScrollTo(scrollable, position.end);
                    return _context5.abrupt("return", position.end);
                  case 11:
                    startTime = timeStamp;
                  case 12:
                    if (!(startTime !== timeStamp && previousTimeStamp !== timeStamp)) {
                      _context5.next = 19;
                      break;
                    }
                    elapsed = timeStamp - startTime;
                    progress = (0, _math.easeInOutQuad)(MH.min(1, elapsed / duration));
                    currentPosition = {
                      top: position.start.top + (position.end.top - position.start.top) * progress,
                      left: position.start.left + (position.end.left - position.start.left) * progress
                    };
                    MH.elScrollTo(scrollable, currentPosition);
                    if (!(progress === 1)) {
                      _context5.next = 19;
                      break;
                    }
                    return _context5.abrupt("return", currentPosition);
                  case 19:
                    previousTimeStamp = timeStamp;
                    return _context5.abrupt("return", _step3());
                  case 21:
                  case "end":
                    return _context5.stop();
                }
              }, _callee5);
            }));
            return function step() {
              return _ref7.apply(this, arguments);
            };
          }();
          return _context6.abrupt("return", _step3());
        case 8:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function initiateScroll(_x3, _x4) {
    return _ref6.apply(this, arguments);
  };
}();
var isScrollableBodyInQuirks = function isScrollableBodyInQuirks(element) {
  return element === MH.getBody() && MH.getDocScrollingElement() === null;
};

// must be called in "measure time"
var getBorderWidth = function getBorderWidth(element, side) {
  return MH.ceil(MH.parseFloat((0, _cssAlter.getComputedStylePropNow)(element, "border-".concat(side))));
};

// ------------------------------

var mainContentElement;
var mainScrollableElement;
var initPromise = null;
var init = function init() {
  if (!initPromise) {
    initPromise = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
      var mainScrollableElementSelector, contentElement;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            mainScrollableElementSelector = _settings.settings.mainScrollableElementSelector;
            _context7.next = 3;
            return (0, _domEvents.waitForElementOrInteractive)(function () {
              return mainScrollableElementSelector ? MH.docQuerySelector(mainScrollableElementSelector) : MH.getBody(); // default if no selector
            });
          case 3:
            contentElement = _context7.sent;
            // defaults
            mainScrollableElement = getDefaultScrollingElement();
            mainContentElement = MH.getBody();
            if (!contentElement) {
              (0, _log.logError)(MH.usageError("No match for '".concat(mainScrollableElementSelector, "'. ") + "Scroll tracking/capturing may not work as intended."));
            } else if (!MH.isHTMLElement(contentElement)) {
              (0, _log.logWarn)("mainScrollableElementSelector should point to an HTMLElement");
            } else if (contentElement !== mainContentElement) {
              mainScrollableElement = mainContentElement = contentElement;
            }
          case 7:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    }))();
  }
  return initPromise;
};

// Try to find the main scrollable/content elements asap so that tryGetMain*
// can return them if called before fetchMain*
if (MH.hasDOM()) {
  (0, _domEvents.waitForInteractive)().then(init);
}
//# sourceMappingURL=scroll.cjs.map