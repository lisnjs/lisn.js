"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapScrollingContent = exports.wrapElementNow = exports.wrapElement = exports.wrapChildrenNow = exports.wrapChildren = exports.swapElementsNow = exports.swapElements = exports.replaceElementNow = exports.replaceElement = exports.moveElementNow = exports.moveElement = exports.moveChildrenNow = exports.moveChildren = exports.insertGhostCloneNow = exports.insertGhostClone = exports.insertArrow = exports.ignoreMove = exports.hideAndRemoveElement = exports.getOrAssignID = exports.getIgnoreMove = exports.cloneElement = exports.clearIgnoreMove = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _cssAlter = require("./css-alter.cjs");
var _domOptimize = require("./dom-optimize.cjs");
var _domQuery = require("./dom-query.cjs");
var _text = require("./text.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; } /**
 * @module Utils
 *
 * @categoryDescription DOM: Altering
 * These functions alter the DOM tree, but could lead to forced layout if not
 * scheduled using {@link waitForMutateTime}.
 *
 * @categoryDescription DOM: Altering (optimized)
 * These functions alter the DOM tree in an optimized way using
 * {@link waitForMutateTime} and so are asynchronous.
 */
/**
 * Wraps the element in the given wrapper, or a newly created element if not given.
 *
 * @param {} [options.wrapper]
 *              If it's an element, it is used as the wrapper. If it's a string
 *              tag name, then a new element with this tag is created as the
 *              wrapper. If not given, then `div` is used if the element to be
 *              wrapped has an block-display tag, or otherwise `span` (if the
 *              element to be wrapped has an inline tag name).
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              replacing the element (so as to not trigger relevant callbacks).
 * @returns {} The wrapper element that was either passed in options or created.
 *
 * @category DOM: Altering
 */
var wrapElementNow = exports.wrapElementNow = function wrapElementNow(element, options) {
  var wrapper = createWrapperFor(element, options === null || options === void 0 ? void 0 : options.wrapper);
  if ((options === null || options === void 0 ? void 0 : options.ignoreMove) === true) {
    ignoreMove(element, {
      from: MH.parentOf(element),
      to: wrapper
    });
    ignoreMove(wrapper, {
      to: MH.parentOf(element)
    });
  }
  element.replaceWith(wrapper);
  wrapper.append(element);
  return wrapper;
};

/**
 * Like {@link wrapElementNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
var wrapElement = exports.wrapElement = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(element, options) {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", (0, _domOptimize.waitForMutateTime)().then(function () {
            return wrapElementNow(element, options);
          }));
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function wrapElement(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Wraps the element's children in the given wrapper, or a newly created element
 * if not given.
 *
 * @see {@link wrapElementNow}.
 *
 * @category DOM: Altering
 */
var wrapChildrenNow = exports.wrapChildrenNow = function wrapChildrenNow(element, options) {
  var wrapper = createWrapperFor(element, options === null || options === void 0 ? void 0 : options.wrapper);
  moveChildrenNow(element, wrapper, {
    ignoreMove: true
  });
  moveElementNow(wrapper, {
    to: element,
    ignoreMove: true
  });
  return wrapper;
};

/**
 * Like {@link wrapChildrenNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
var wrapChildren = exports.wrapChildren = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(element, options) {
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", (0, _domOptimize.waitForMutateTime)().then(function () {
            return wrapChildrenNow(element, options);
          }));
        case 1:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function wrapChildren(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Replace an element with another one.
 *
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              moving the element (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering
 */
var replaceElementNow = exports.replaceElementNow = function replaceElementNow(element, newElement, options) {
  if ((options === null || options === void 0 ? void 0 : options.ignoreMove) === true) {
    ignoreMove(
    // remove element
    element, {
      from: MH.parentOf(element)
    });
    ignoreMove(
    // move newElement to element's current parent
    newElement, {
      from: MH.parentOf(newElement),
      to: MH.parentOf(element)
    });
  }
  element.replaceWith(newElement);
};

/**
 * Like {@link replaceElementNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
var replaceElement = exports.replaceElement = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(element, newElement, options) {
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", (0, _domOptimize.waitForMutateTime)().then(function () {
            return replaceElementNow(element, newElement, options);
          }));
        case 1:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function replaceElement(_x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * Replace an element with another one.
 *
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              moving the element (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering
 */
var swapElementsNow = exports.swapElementsNow = function swapElementsNow(elementA, elementB, options) {
  var temp = MH.createElement("div");
  replaceElementNow(elementA, temp, options);
  replaceElementNow(elementB, elementA, options);
  replaceElementNow(temp, elementB, options);
};

/**
 * Like {@link swapElementsNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
var swapElements = exports.swapElements = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(elementA, elementB, options) {
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt("return", (0, _domOptimize.waitForMutateTime)().then(function () {
            return swapElementsNow(elementA, elementB, options);
          }));
        case 1:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function swapElements(_x8, _x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}();

/**
 * Move an element's children to a new element
 *
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              moving the children (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering
 */
var moveChildrenNow = exports.moveChildrenNow = function moveChildrenNow(oldParent, newParent, options) {
  if ((options === null || options === void 0 ? void 0 : options.ignoreMove) === true) {
    var _iterator = _createForOfIteratorHelper(MH.childrenOf(oldParent)),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var child = _step.value;
        ignoreMove(child, {
          from: oldParent,
          to: newParent
        });
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  newParent.append.apply(newParent, _toConsumableArray(MH.childrenOf(oldParent)));
};

/**
 * Like {@link moveChildrenNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
var moveChildren = exports.moveChildren = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(oldParent, newParent, options) {
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          return _context5.abrupt("return", (0, _domOptimize.waitForMutateTime)().then(function () {
            return moveChildrenNow(oldParent, newParent, options);
          }));
        case 1:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function moveChildren(_x11, _x12, _x13) {
    return _ref5.apply(this, arguments);
  };
}();

/**
 * Moves an element to a new position.
 *
 * @param {} [options.to]         The new parent or sibling (depending on
 *                                `options.position`). If not given, the
 *                                element is removed from the DOM.
 * @param {} [options.position]   - append (default): append to `options.to`
 *                                - prepend: prepend to `options.to`
 *                                - before: insert before `options.to`
 *                                - after: insert after `options.to`
 * @param {} [options.ignoreMove] If true, the DOM watcher instances will
 *                                ignore the operation of moving the element
 *                                (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering
 */
var moveElementNow = exports.moveElementNow = function moveElementNow(element, options) {
  var parentEl = (options === null || options === void 0 ? void 0 : options.to) || null;
  var position = (options === null || options === void 0 ? void 0 : options.position) || "append";
  if (position === "before" || position === "after") {
    parentEl = MH.parentOf(options === null || options === void 0 ? void 0 : options.to);
  }
  if ((options === null || options === void 0 ? void 0 : options.ignoreMove) === true) {
    ignoreMove(element, {
      from: MH.parentOf(element),
      to: parentEl
    });
  }
  if (options !== null && options !== void 0 && options.to) {
    options.to[position](element);
  } else {
    MH.remove(element);
  }
};

/**
 * Like {@link moveElementNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
var moveElement = exports.moveElement = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(element, options) {
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          return _context6.abrupt("return", (0, _domOptimize.waitForMutateTime)().then(function () {
            return moveElementNow(element, options);
          }));
        case 1:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function moveElement(_x14, _x15) {
    return _ref6.apply(this, arguments);
  };
}();

/**
 * It will {@link hideElement} and then remove it from the DOM.
 *
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              replacing the element (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering (optimized)
 */
var hideAndRemoveElement = exports.hideAndRemoveElement = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(element) {
    var delay,
      options,
      _args7 = arguments;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          delay = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : 0;
          options = _args7.length > 2 ? _args7[2] : undefined;
          _context7.next = 4;
          return (0, _cssAlter.hideElement)(element, delay);
        case 4:
          moveElementNow(element, options);
        case 5:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function hideAndRemoveElement(_x16) {
    return _ref7.apply(this, arguments);
  };
}();

/**
 * @ignore
 * @internal
 */
var getOrAssignID = exports.getOrAssignID = function getOrAssignID(element) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var domID = element.id;
  if (!domID) {
    domID = "".concat(prefix, "-").concat((0, _text.randId)());
    element.id = domID;
  }
  return domID;
};

/**
 * @ignore
 * @internal
 */
var wrapScrollingContent = exports.wrapScrollingContent = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(element) {
    var wrapper, firstChild;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return (0, _domOptimize.waitForMutateTime)();
        case 2:
          firstChild = MH.childrenOf(element)[0];
          if (MH.lengthOf(MH.childrenOf(element)) === 1 && MH.isHTMLElement(firstChild) && (0, _cssAlter.hasClass)(firstChild, PREFIX_CONTENT_WRAPPER)) {
            // Another concurrent call has just wrapped it
            wrapper = firstChild;
          } else {
            wrapper = wrapChildrenNow(element, {
              ignoreMove: true
            });
            (0, _cssAlter.addClassesNow)(wrapper, PREFIX_CONTENT_WRAPPER);
          }
          return _context8.abrupt("return", wrapper);
        case 5:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function wrapScrollingContent(_x17) {
    return _ref8.apply(this, arguments);
  };
}();

/**
 * @ignore
 * @internal
 */
var cloneElement = exports.cloneElement = function cloneElement(element) {
  var clone = element.cloneNode(true);
  (0, _cssAlter.setBoolData)(clone, MH.prefixName("clone"));
  return clone;
};

/**
 * Creates a dummy hidden clone that's got animation and transitions disabled
 * and absolute position, wrapped in a wrapper (of size 0) and inserts it just
 * before the `insertBefore` element (or if not given, the original element),
 * so that the hidden clone overlaps the actual element's regular
 * (pre-transformed) position.
 *
 * It clears the ID of the clone.
 *
 * Returns the clone.
 *
 * @ignore
 * @internal
 */
var insertGhostCloneNow = exports.insertGhostCloneNow = function insertGhostCloneNow(element) {
  var insertBefore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var clone = cloneElement(element);
  clone.id = "";
  (0, _cssAlter.addClassesNow)(clone, MC.PREFIX_GHOST, MC.PREFIX_TRANSITION_DISABLE, MC.PREFIX_ANIMATE_DISABLE);
  var wrapper = wrapElementNow(clone);
  (0, _cssAlter.addClassesNow)(wrapper, MC.PREFIX_WRAPPER);
  moveElementNow(wrapper, {
    to: insertBefore || element,
    position: "before",
    ignoreMove: true
  });
  return {
    _wrapper: wrapper,
    _clone: clone
  };
};

/**
 * @ignore
 * @internal
 *
 * Exposed via DOMWatcher
 */
var insertGhostClone = exports.insertGhostClone = function insertGhostClone(element) {
  var insertBefore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return (0, _domOptimize.waitForMutateTime)().then(function () {
    return insertGhostCloneNow(element, insertBefore);
  });
};

/**
 * @ignore
 * @internal
 *
 * Exposed via DOMWatcher
 */
var ignoreMove = exports.ignoreMove = function ignoreMove(target, options) {
  return recordsToSkipOnce.set(target, {
    from: options.from || null,
    to: options.to || null
  });
};

/**
 * @ignore
 * @internal
 */
var getIgnoreMove = exports.getIgnoreMove = function getIgnoreMove(target) {
  return recordsToSkipOnce.get(target) || null;
};

/**
 * @ignore
 * @internal
 */
var clearIgnoreMove = exports.clearIgnoreMove = function clearIgnoreMove(target) {
  // We should not clear the entry the first time the operation is observed
  // (when we return true here), because there may be multiple DOMWatcher
  // instances that will observe it and need to query it. Instead do it shortly.
  MH.setTimer(function () {
    MH.deleteKey(recordsToSkipOnce, target);
  }, 100);
};

/**
 * @ignore
 * @internal
 */
var insertArrow = exports.insertArrow = function insertArrow(target, direction) {
  var position = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "append";
  var tag = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "span";
  var arrow = MH.createElement(tag);
  (0, _cssAlter.addClassesNow)(arrow, MH.prefixName(MC.S_ARROW));
  (0, _cssAlter.setDataNow)(arrow, MH.prefixName("direction"), direction);
  moveElement(arrow, {
    to: target,
    position: position,
    ignoreMove: true
  });
  return arrow;
};

// ----------------------------------------

var PREFIX_CONTENT_WRAPPER = MH.prefixName("content-wrapper");
var recordsToSkipOnce = MH.newMap();
var createWrapperFor = function createWrapperFor(element, wrapper) {
  if (MH.isElement(wrapper)) {
    return wrapper;
  }
  var tag = wrapper;
  if (!tag) {
    if ((0, _domQuery.isInlineTag)(MH.tagName(element))) {
      tag = "span";
    } else {
      tag = "div";
    }
  }
  return MH.createElement(tag);
};
//# sourceMappingURL=dom-alter.cjs.map