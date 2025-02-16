"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SameHeight = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _settings = require("../globals/settings.cjs");
var _cssAlter = require("../utils/css-alter.cjs");
var _domQuery = require("../utils/dom-query.cjs");
var _log = require("../utils/log.cjs");
var _math = require("../utils/math.cjs");
var _text = require("../utils/text.cjs");
var _validation = require("../utils/validation.cjs");
var _sizeWatcher = require("../watchers/size-watcher.cjs");
var _widget = require("./widget.cjs");
var _debug = _interopRequireDefault(require("../debug/debug.cjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
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
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _superPropGet(t, o, e, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Widgets
 */ // This widget finds optimal widths of flexbox children so that their heights
// are equal or as close as possible to each other. It takes into account
// whether they contain text (and possibly other elements, but not images) or
// images.
//
// NOTE:
//  - We assume that a given flexbox child is either a "text container" and
//    contains only text and other non-image elements (such as buttons), or is
//    an "image container" and contains only images.
//  - We also assume that all the text inside a text container is the same
//    font size as the font size of the text container.
//
// ~~~~~~ BACKGROUND: analysis for one text container and one image container ~~~~~~
//
// A text box has a fixed area, its height decreasing as width increases.
// Whereas an image has a fixed aspect ratio, its height increasing as width
// increases.
//
// We want to find an optimal configuration at which the text container (which
// can include other elements apart from text) and image heights are equal, or
// if not possible, at which they are as close as possible to each other while
// satisfying as best as possible these "guidelines" (constraints that are not
// enforced), based on visual appeal:
//   - minGap, minimum gap between each item
//   - maxWidthR, maximum ratio between the width of the widest child and the
//     narrowest child
//   - maxFreeR, maximum free space in the container as a percentage of its
//     total width
//
// Then we set flex-basis as the optimal width (making sure this is disabled
// when the flex direction is column). This allows for fluid width if the user
// to configure shrink or wrap on the flexbox using CSS.
//
// ~~~~~~ FORMULAE: text and image width as a function of their height ~~~~~~
//
// For a given height, h, the widths of the text and image are:
//
//                 txtArea
//   txtW(h) =  —————————————
//              h - txtExtraH
//
//   imgW(h) = imgAspectR * h
//
// where txtExtraH comes from buttons and other non-text elements inside the
// text container, whose height is treated as fixed (not changing with width).
//
// ~~~~~~ PLOT: total width as a function of height ~~~~~~
//
// The sum of the widths of image and text varies with their height, h, as:
//
//   w(h) = txtW(h) + imgW(h)
//
//              txtArea
//        =  —————————————  +  imgAspectR * h
//           h - txtExtraH
//
//
//       w(h)
//        ^
//        | |              .
//        | .             .
//        |  .           .
// flexW  +   .         .
//        |    .       .
//        |     .    .
//        |       -
//        |
//        |———|———|—————|———————————> h
//            h1  h0    h2
//
//
// ~~~~~~ FORMULAE: height at which total width is minimum ~~~~~~
//
// The minimum of the function w(h) is at h = h0
//
//            ⌈   txtArea  ⌉
//   h0 = sqrt| —————————— | + txtExtraH
//            ⌊ imgAspectR ⌋
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// The widths of image and text container at height = h0 are:
//
//   txtW(h0) = sqrt( txtArea * imgAspectR )
//
//   imgW(h0) = sqrt( txtArea * imgAspectR ) + imgAspectR * txtExtraH
//            = txtW(h0) + imgAspectR * txtExtraH
//
// - NOTE: at if txtExtraH is 0 (i.e. the container has only text), then
//   their widths are equal at h0; otherwise the image is wider
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// There are zero, one or two values of h at which w(h) equals the flexbox
// width, flexW. Labelled h1 and h2 above.
//
// ~~~~~~ FORMULAE: height at which total width is equal to flexbox width ~~~~~~
//
// The heights at which the sum of the widths, w(h) equals exactly flexW are:
//
//          -b ± sqrt( b^2 - 4ac )
//   h2/1 = ——————————————————————
//                  2a
//
// where:
// a = imgAspectR
// b = - ( (imgAspectR * txtExtraH) + flexW )
// c = txtArea + (txtExtraH * flexW)
//
// If h1 and h2 are real, then h1 <= h0 <= h2, as shown in plot above.
//
// ~~~~~~ SCENARIOS: free space or overflow in the flexbox ~~~~~~
//
// Whether there is a solution to the above equation, i.e. whether h1 and h2
// are real, depends on which scenario we have:
//
// 1. If flexW = w(h0), then h1 = h2 = h0
// 2. If flexW < w(h0), then there is no exact solution, i.e. it's impossible
//    to fit the text and image inside the flexbox and have them equal heights;
//    there is overflow even at h0
// 3. If flexW > w(h0) (as in the graph above), then at h0 there is free space
//    in the flexbox and we can choose any height between h1 and h2
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// The widths h0, h1 and h2 represent the following visual configuration:
//   - h0: intermediate height, maximum free space in the container;
//   - h1: minimum height (i.e. wide text and small image), no free space in
//     the container;
//   - h2: maximum height (i.e. narrow text and large image), no free space in
//     the container;
//
// ~~~~~~ THEREFORE: approach ~~~~~~
//
// 1. If flexW = w(h0), i.e. h1 = h2 = h0:
//    => we choose h0 as the height
// 2. If flexW < w(h0), i.e. it's impossible to fit the text and image inside
//    the flexbox and have them equal heights:
//    => we still choose h0 as the height as that gives the least amount of
//       overflow; user-defined CSS can control whether the items will be
//       shrunk, the flexbox will wrap or overflow
// 3. If flexW > w(h0), i.e. at h0 there is free space in the flexbox:
//    => choose a height between h1 and h2 that best fits with the guidelines
//       maxWidthR and maxFreeR
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// In scenario 3 we can look at the guidelines, maxWidthR and maxFreeR.
//
// ~~~~~~ GUIDELINE: maxWidthR ~~~~~~
//
// ~~~~~~ FORMULAE: height at which text and image width are equal ~~~~~~
//
// The width of the text and image container are equal at height hR0:
//
//         txtExtraH + sqrt( txtExtraH^2  +  4 * (h0 - txtExtraH)^2 )
// hR0  =  ——————————————————————————————————————————————————————————
//                                    2
//
// ~~~~~~ FORMULAE: height at which text to image width is maxWidthR ~~~~~~
//
// For heights < hR0, i.e. text becomes wider than the image, at some point the
// ratio of text width to image width becomes maxWidthR. This happens at hR1.
//
//                         ⌈                 4 * (h0 - txtExtraH)^2 ⌉
//         txtExtraH + sqrt| txtExtraH^2  +  —————————————————————— |
//                         ⌊                        maxWidthR       ⌋
// hR1  =  ——————————————————————————————————————————————————————————
//                                    2
//
// ~~~~~~ FORMULAE: height at which image to text width is maxWidthR ~~~~~~
//
// For heights > hR0, i.e. text becomes narrower than the image, at some point
// the ratio of image width to text width becomes maxWidthR. This happens at hR2.
//
//         txtExtraH + sqrt( txtExtraH^2  +  4 * maxWidthR * (h0 - txtExtraH)^2 )
// hR2  =  ——————————————————————————————————————————————————————————————————————
//                                        2
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// NOTE:
// - hR1 <= hR0 <= hR2 && hR0 <= h0
// - hR0, hR1 and hR2 are the first (larger) roots of the quadratic equation
//   with coefficients:
//     a = imgAspectR * R
//     b = - imgAspectR * txtExtraH * R
//     c = - textArea
//   where R = 1 gives hR0, R = maxWidthR gives hR1 and R = 1 / maxWidthR gives hR2
// - The smaller roots of the equation should be negative, so we ignore them
//
// ~~~~~~ GUIDELINE: maxFreeR ~~~~~~
//
// ~~~~~~ FORMULAE: free space in flexbox relative to its width ~~~~~~
//
// The percentage of free space in the container is:
//
//           flexW - w(h)
// freeR  =  ————————————
//              flexW
//
//
//                             txtArea
//                flexW  -  —————————————  - imgAspectR * h
//                          h - txtExtraH
//             =  —————————————————————————————————————————
//                                flexW
//
// ~~~~~~ FORMULAE: height at which relative free space is maxFreeR ~~~~~~
//
// This would be equal to maxFreeR at hF1 and hF2:
//
//          -b ± sqrt( b^2 - 4ac )
//   hF2/1 = ——————————————————————
//                  2a
//
// where:
// a = imgAspectR
// b = - ( (imgAspectR * txtExtraH) + ( flexW * (1 - maxFreeR) ) )
// c = txtArea + ( txtExtraH * flexW * (1 - maxFreeR) )
//
// If hF1 and hF2 are real, then h1 < hF1 <= h0 <= hF2 < h2.
//
// ~~~~~~ THEREFORE: choosing a height in scenario 3 ~~~~~~
//
// So in scenario 3 we can choose any height h between
//
//   max(h1, hR1, hF1)  and  min(h2, hR2, hF2)
//
// Note, it's possible that max(h1, hR1, hF1) is greater than min(h2, hR2, hF2),
// e.g. if hF1 > hR2 or hR1 > hF2.
//
// This will make the text and image equal height, fitting in the flexbox, and
// if possible, satisfying both maxFreeR and maxWidthR.
//
// Here we choose the smallest height possible, which would result in the
// larger ratio between text width and image width, but it will satisfy the
// constraints maxFreeR and maxWidthR, so that is ok.
//
// ~~~~~~ GENERALISING: for more than one text and/or image container ~~~~~~
//
// We can generalise the above in order to find an approximate solution for the
// case of multiple text or image containers (an exact solution would require
// solving a polynomial of degree equal to the number of elements).
//
// If we imaging putting all text in one container and all images in another
// container we are back at the above exact solutions for a single text and
// image container.
//
// We can solve for the following parameters:
// - txtArea:    total text area
//               = sum_i(txtArea_i)
//
// - txtExtraH:  weighted average extra height
//               = sum_i(txtExtraH_i * txtArea_i) / txtArea
//
// - imgAspectR: total image aspect ratio (for horizontally laid out image
//               containers)
//               = sum_i(imgAspectR_i)
//
// ~~~~~~ CASE 1: only images containers ~~~~~~
// If we have only image containers, we solve for the optimal height as follows:
//
//   flexW = imgAspectR * h
//
//                   flexW
//   => hIdeal  =  ——————————
//                 imgAspectR
//
// ~~~~~~ CASE 2: only text containers ~~~~~~
// If we have only text containers, we solve for the optimal height as follows:
//
//                  txtArea
//   flexW  =  ——————————————————
//             hIdeal - txtExtraH
//
//                 txtArea
//   => hIdeal  =  ———————  +  txtExtraH
//                  flexW
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Once we've found the optimal height h, we calculate the individual widths of
// the flexbox children as:
//
//                  txtArea_i
//   txtW_i(h) =  —————————————
//                h - txtExtraH_i
//
//   imgW_i(h) = imgAspectR_i * h
//
// ~~~~~~ IMPLEMENTATION ~~~~~~
//
// We go through the flexbox children and determine whether a child is a "text
// container" or an "image container".
//
// For image containers, we measure the width and height and calculate the
// aspect ratio using these.
//
// For text containers, we measure their width and height. We calculate the
// text area by measuring the size of all children of the text container that
// are deemed to contain only text (or if the entire text container is deemed
// to contain only text, then we take its size). Then we sum the areas of
// all such text-only boxes.
//
// To determine the extra height in the text container, we take the total
// height of all text-only boxes inside it, and we subtract that from its
// measured height.
//
// NOTE:
// - This does not work if the flexbox children are set to align stretch,
//   because in such cases there would be free vertical space in the container
//   that shouldn't be counted.
// - If the flexbox children or any of their descendants have paddings and
//   margins, then this calculation would only work if the paddings/margins
//   inside text containers are absolute and only on top and bottom, and
//   paddings/margins inside image containers are in percentages and only on
//   descendants of the image container. Otherwise the image aspect ratio and the
//   extra text height would not be constant, and there may be extra width in
//   the text container. It is very tricky to take all of this into account. So
//   we ignore such cases and assume constant image aspect ratio and constant
//   text area and text container extra height.
//
// We use resize observers to get the size of relevant elements and
// re-calculate as needed.
/**
 * Configures the given element as a {@link SameHeight} widget.
 *
 * The SameHeight widget sets up the given element as a flexbox and sets the
 * flex basis of its components so that their heights are as close as possible
 * to each other. It tracks their size (see {@link SizeWatcher}) and
 * continually updates the basis as needed.
 *
 * When calculating the best flex basis that would result in equal heights,
 * SameHeight determines whether a flex child is mostly text or mostly images
 * since the height of these scales in opposite manner with their width.
 * Therefore, the components of the widget should contain either mostly text or
 * mostly images.
 *
 * The widget should have more than one item and the items must be immediate
 * children of the container element.
 *
 * SameHeight tries to automatically determine if an item is mostly text or
 * mostly images based on the total display text content, but you can override
 * this in two ways:
 * 1. By passing a map of elements as {@link SameHeightConfig.items | items}
 *    instead of an array, and setting the value for each to either `"text"` or
 *    `"image"`
 * 2. By setting the `data-lisn-same-height-item` attribute to `"text"` or
 *   `"image"` on the children. **NOTE** however that when auto-discovering the
 *   items (i.e. when you have not explicitly passed a list/map of items), if
 *   you set the `data-lisn-same-height-item` attribute on _any_ child you must
 *   also add this attribute to all other children that are to be used by the
 *   widget. Other children (that don't have this attribute) will be ignored
 *   and assumed to be either zero-size or position absolute/fixed.
 *
 * **IMPORTANT:** You should not instantiate more than one {@link SameHeight}
 * widget on a given element. Use {@link SameHeight.get} to get an existing
 * instance if any. If there is already a widget instance, it will be destroyed!
 *
 * **IMPORTANT:** The element you pass will be set to `display: flex` and its
 * children will get `box-sizing: border-box` and continually updated
 * `flex-basis` style. You can add additional CSS to the element or its
 * children if you wish. For example you may wish to set `flex-wrap: wrap` on
 * the element and a `min-width` on the children.
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see {@link settings.autoWidgets}), the
 * following CSS classes or data attributes are recognized:
 * - `lisn-same-height` class or `data-lisn-same-height` attribute set on the
 *   container element that constitutes the widget
 *
 * When using auto-widgets, the elements that will be used as items are
 * discovered in the following way:
 * 1. The immediate children of the top-level element that constitutes the
 *    widget that have the `lisn-same-height-item` class or
 *    `data-lisn-same-height-item` attribute are taken.
 * 2. If none of the root's children have this class or attribute, then all of
 *    the immediate children of the widget element except any `script` or
 *    `style` elements are taken as the items.
 *
 * See below examples for what values you can use set for the data attribute
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This defines a simple SameHeight widget with one text and one image child.
 *
 * ```html
 * <div class="lisn-same-height">
 *   <div>
 *     <p>
 *       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
 *       eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
 *       minim veniam, quis nostrud exercitation ullamco laboris nisi ut
 *       aliquip ex ea commodo consequat. Duis aute irure dolor in
 *       reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
 *       pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
 *       culpa qui officia deserunt mollit anim id est laborum.
 *     </p>
 *   </div>
 *
 *   <div>
 *     <img
 *       src="https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2@1.5x.png"
 *     />
 *   </div>
 * </div>
 * ```
 *
 * @example
 * This defines a SameHeight widget with the flexbox children specified
 * explicitly (and one ignored), as well as having all custom settings.
 *
 * ```html
 * <div data-lisn-same-height="diff-tolerance=20
 *                             | resize-threshold=10
 *                             | debounce-window=50
 *                             | min-gap=50
 *                             | max-free-r=0.2
 *                             | max-width-r=3.2">
 *   <div>Example ignored child</div>
 *
 *   <div data-lisn-same-height-item><!-- Will be detected as text anyway -->
 *     <p>
 *       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
 *       eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
 *       minim veniam, quis nostrud exercitation ullamco laboris nisi ut
 *       aliquip ex ea commodo consequat. Duis aute irure dolor in
 *       reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
 *       pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
 *       culpa qui officia deserunt mollit anim id est laborum.
 *     </p>
 *   </div>
 *
 *   <!-- Explicitly set to image type, though it will be detected as such -->
 *   <div data-lisn-same-height-item="image">
 *     <img
 *       src="https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2@1.5x.png"
 *     />
 *   </div>
 *
 *   <!-- Explicitly set to text type, because it will NOT be detected as such (text too short). -->
 *   <div data-lisn-same-height-item="text">
 *     <p>
 *       Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 *     </p>
 *   </div>
 * </div>
 * ```
 */
var SameHeight = exports.SameHeight = /*#__PURE__*/function (_Widget) {
  function SameHeight(containerElement, config) {
    var _SameHeight$get;
    var _this;
    _classCallCheck(this, SameHeight);
    var destroyPromise = (_SameHeight$get = SameHeight.get(containerElement)) === null || _SameHeight$get === void 0 ? void 0 : _SameHeight$get.destroy();
    _this = _callSuper(this, SameHeight, [containerElement, {
      id: DUMMY_ID
    }]);
    /**
     * Switches the flexbox to vertical (column) mode.
     *
     * You can alternatively do this by setting the
     * `data-lisn-orientation="vertical"` attribute on the element at any time.
     *
     * You can do this for example as part of a trigger:
     *
     * @example
     * ```html
     * <div class="lisn-same-height"
     *      data-lisn-on-layout="max-mobile-wide:set-attribute=data-lisn-orientation#vertical">
     *      <!-- ... children -->
     * </div>
     * ```
     */
    _defineProperty(_this, "toColumn", void 0);
    /**
     * Switches the flexbox back to horizontal (row) mode, which is the default.
     *
     * You can alternatively do this by deleting the
     * `data-lisn-orientation` attribute on the element, or setting it to
     * `"horizontal"` at any time.
     */
    _defineProperty(_this, "toRow", void 0);
    /**
     * Returns the elements used as the flex children.
     */
    _defineProperty(_this, "getItems", void 0);
    /**
     * Returns a map of the elements used as the flex children with their type.
     */
    _defineProperty(_this, "getItemConfigs", void 0);
    var items = getItemsFrom(containerElement, config === null || config === void 0 ? void 0 : config.items);
    if (MH.sizeOf(items) < 2) {
      throw MH.usageError("SameHeight must have more than 1 item");
    }
    var _iterator = _createForOfIteratorHelper(items.keys()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        if (MH.parentOf(item) !== containerElement) {
          throw MH.usageError("SameHeight's items must be its immediate children");
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    fetchConfig(containerElement, config).then(function (fullConfig) {
      (destroyPromise || MH.promiseResolve()).then(function () {
        if (_this.isDestroyed()) {
          return;
        }
        init(_this, containerElement, items, fullConfig);
      });
    });
    _this.toColumn = function () {
      return (0, _cssAlter.setData)(containerElement, MC.PREFIX_ORIENTATION, MC.S_VERTICAL);
    };
    _this.toRow = function () {
      return (0, _cssAlter.delData)(containerElement, MC.PREFIX_ORIENTATION);
    };
    _this.getItems = function () {
      return _toConsumableArray(items.keys());
    };
    _this.getItemConfigs = function () {
      return MH.newMap(_toConsumableArray(items.entries()));
    };
    return _this;
  }
  _inherits(SameHeight, _Widget);
  return _createClass(SameHeight, null, [{
    key: "get",
    value:
    /**
     * If the element is already configured as a SameHeight widget, the widget
     * instance is returned. Otherwise null.
     */
    function get(containerElement) {
      var instance = _superPropGet(SameHeight, "get", this, 2)([containerElement, DUMMY_ID]);
      if (MH.isInstanceOf(instance, SameHeight)) {
        return instance;
      }
      return null;
    }
  }, {
    key: "register",
    value: function register() {
      (0, _widget.registerWidget)(WIDGET_NAME, function (element, config) {
        if (MH.isHTMLElement(element)) {
          if (!SameHeight.get(element)) {
            return new SameHeight(element, config);
          }
        } else {
          (0, _log.logError)(MH.usageError("Only HTMLElement is supported for SameHeight widget"));
        }
        return null;
      }, configValidator);
    }
  }]);
}(_widget.Widget);
/**
 * @interface
 */
// ------------------------------
var WIDGET_NAME = "same-height";
var PREFIXED_NAME = MH.prefixName(WIDGET_NAME);
var PREFIX_ROOT = "".concat(PREFIXED_NAME, "__root");

// Use different classes for styling items to the one used for auto-discovering
// them, so that re-creating existing widgets can correctly find the items to
// be used by the new widget synchronously before the current one is destroyed.
var PREFIX_ITEM = "".concat(PREFIXED_NAME, "__item");
var PREFIX_ITEM__FOR_SELECT = "".concat(PREFIXED_NAME, "-item");
var S_TEXT = "text";
var S_IMAGE = "image";

// Only one SameHeight widget per element is allowed, but Widget requires a
// non-blank ID.
var DUMMY_ID = PREFIXED_NAME;

// We consider elements that have text content of at least <MIN_CHARS_FOR_TEXT>
// characters to be text.
var MIN_CHARS_FOR_TEXT = 100;
var configValidator = _defineProperty(_defineProperty(_defineProperty(_defineProperty({
  diffTolerance: _validation.validateNumber,
  resizeThreshold: _validation.validateNumber
}, MC.S_DEBOUNCE_WINDOW, _validation.validateNumber), "minGap", _validation.validateNumber), "maxFreeR", _validation.validateNumber), "maxWidthR", _validation.validateNumber);
var isText = function isText(element) {
  return (0, _cssAlter.getData)(element, PREFIX_ITEM__FOR_SELECT) === S_TEXT || (0, _cssAlter.getData)(element, PREFIX_ITEM__FOR_SELECT) !== S_IMAGE && MH.isHTMLElement(element) && MH.lengthOf(element.innerText) >= MIN_CHARS_FOR_TEXT;
};
var areImagesLoaded = function areImagesLoaded(element) {
  var _iterator2 = _createForOfIteratorHelper(element.querySelectorAll("img")),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var img = _step2.value;
      // Don't rely on img.complete since sometimes this returns false even
      // though the image is loaded and has a size. Just check the size.
      if (img.naturalWidth === 0 || img.width === 0 || img.naturalHeight === 0 || img.height === 0) {
        return false;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return true;
};
var fetchConfig = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(containerElement, userConfig) {
    var _userConfig$minGap, _userConfig$maxFreeR, _userConfig$maxWidthR, _userConfig$diffToler, _userConfig$resizeThr, _userConfig$debounceW;
    var colGapStr, minGap;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _cssAlter.getComputedStyleProp)(containerElement, "column-gap");
        case 2:
          colGapStr = _context.sent;
          minGap = getNumValue(MH.strReplace(colGapStr, /px$/, ""), _settings.settings.sameHeightMinGap);
          return _context.abrupt("return", {
            _minGap: (0, _math.toNumWithBounds)((_userConfig$minGap = userConfig === null || userConfig === void 0 ? void 0 : userConfig.minGap) !== null && _userConfig$minGap !== void 0 ? _userConfig$minGap : minGap, {
              min: 0
            }, 10),
            _maxFreeR: (0, _math.toNumWithBounds)((_userConfig$maxFreeR = userConfig === null || userConfig === void 0 ? void 0 : userConfig.maxFreeR) !== null && _userConfig$maxFreeR !== void 0 ? _userConfig$maxFreeR : _settings.settings.sameHeightMaxFreeR, {
              min: 0,
              max: 0.9
            }, -1),
            _maxWidthR: (0, _math.toNumWithBounds)((_userConfig$maxWidthR = userConfig === null || userConfig === void 0 ? void 0 : userConfig.maxWidthR) !== null && _userConfig$maxWidthR !== void 0 ? _userConfig$maxWidthR : _settings.settings.sameHeightMaxWidthR, {
              min: 1
            }, -1),
            _diffTolerance: (_userConfig$diffToler = userConfig === null || userConfig === void 0 ? void 0 : userConfig.diffTolerance) !== null && _userConfig$diffToler !== void 0 ? _userConfig$diffToler : _settings.settings.sameHeightDiffTolerance,
            _resizeThreshold: (_userConfig$resizeThr = userConfig === null || userConfig === void 0 ? void 0 : userConfig.resizeThreshold) !== null && _userConfig$resizeThr !== void 0 ? _userConfig$resizeThr : _settings.settings.sameHeightResizeThreshold,
            _debounceWindow: (_userConfig$debounceW = userConfig === null || userConfig === void 0 ? void 0 : userConfig.debounceWindow) !== null && _userConfig$debounceW !== void 0 ? _userConfig$debounceW : _settings.settings.sameHeightDebounceWindow
          });
        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function fetchConfig(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var getNumValue = function getNumValue(strValue, defaultValue) {
  var num = strValue ? MH.parseFloat(strValue) : NaN;
  return MH.isNaN(num) ? defaultValue : num;
};
var findItems = function findItems(containerElement) {
  var items = _toConsumableArray(MH.querySelectorAll(containerElement, (0, _widget.getDefaultWidgetSelector)(PREFIX_ITEM__FOR_SELECT)));
  if (!MH.lengthOf(items)) {
    items.push.apply(items, _toConsumableArray((0, _domQuery.getVisibleContentChildren)(containerElement)));
  }
  return items;
};
var getItemsFrom = function getItemsFrom(containerElement, inputItems) {
  var itemMap = MH.newMap();
  inputItems = inputItems || findItems(containerElement);
  var addItem = function addItem(item, itemType) {
    itemType = itemType || (isText(item) ? S_TEXT : S_IMAGE);
    itemMap.set(item, itemType);
  };
  if (MH.isArray(inputItems)) {
    var _iterator3 = _createForOfIteratorHelper(inputItems),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var item = _step3.value;
        addItem(item);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  } else if (MH.isInstanceOf(inputItems, Map)) {
    var _iterator4 = _createForOfIteratorHelper(inputItems.entries()),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var _step4$value = _slicedToArray(_step4.value, 2),
          _item = _step4$value[0],
          itemType = _step4$value[1];
        addItem(_item, itemType);
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
  }
  return itemMap;
};
var init = function init(widget, containerElement, items, config) {
  var logger = _debug["default"] ? new _debug["default"].Logger({
    name: "SameHeight-".concat((0, _text.formatAsString)(containerElement))
  }) : null;
  var diffTolerance = config._diffTolerance;
  var debounceWindow = config._debounceWindow;
  var sizeWatcher = _sizeWatcher.SizeWatcher.reuse(_defineProperty(_defineProperty({}, MC.S_DEBOUNCE_WINDOW, debounceWindow), "resizeThreshold", config._resizeThreshold));
  var allItems = MH.newMap();
  var callCounter = 0;
  var isFirstTime = true;
  var lastOptimalHeight = 0;
  var hasScheduledReset = false;
  var counterTimeout = null;

  // ----------

  var resizeHandler = function resizeHandler(element, sizeData) {
    // Since the SizeWatcher calls us once for every element, we batch the
    // re-calculations so they are done once in every cycle.
    // Allow the queue of ResizeObserverEntry in the SizeWatcher to be
    // emptied, and therefore to ensure we have the latest size for all
    // elements.
    if (!hasScheduledReset) {
      debug: logger === null || logger === void 0 || logger.debug7("Scheduling calculations", callCounter);
      hasScheduledReset = true;
      MH.setTimer(function () {
        hasScheduledReset = false;
        if (callCounter > 1) {
          debug: logger === null || logger === void 0 || logger.debug7("Already re-calculated once, skipping");
          callCounter = 0;
          return;
        }
        callCounter++;
        if (counterTimeout) {
          MH.clearTimer(counterTimeout);
        }
        var measurements = calculateMeasurements(containerElement, allItems, isFirstTime, logger);
        var height = measurements ? getOptimalHeight(measurements, config, logger) : null;
        if (height && MH.abs(lastOptimalHeight - height) > diffTolerance) {
          // Re-set widths again. We may be called again in the next cycle if
          // the change in size exceeds the resizeThreshold.
          lastOptimalHeight = height;
          isFirstTime = false;
          setWidths(height); // no need to await

          // If we are _not_ called again in the next cycle (just after
          // debounceWindow), then reset the counter. It means the resultant
          // change in size did not exceed the SizeWatcher threshold.
          counterTimeout = MH.setTimer(function () {
            callCounter = 0;
          }, debounceWindow + 50);
        } else {
          // Done, until the next time elements are resized
          callCounter = 0;
        }
      }, 0);
    }

    // Save the size of the item
    var properties = allItems.get(element);
    if (!properties) {
      (0, _log.logError)(MH.bugError("Got SizeWatcher call for unknown element"));
      return;
    }
    properties._width = sizeData.border[MC.S_WIDTH] || sizeData.content[MC.S_WIDTH];
    properties._height = sizeData.border[MC.S_HEIGHT] || sizeData.content[MC.S_HEIGHT];
    debug: logger === null || logger === void 0 || logger.debug7("Got size", element, properties);
  };

  // ----------

  var observeAll = function observeAll() {
    isFirstTime = true;
    var _iterator5 = _createForOfIteratorHelper(allItems.keys()),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var element = _step5.value;
        sizeWatcher.onResize(resizeHandler, {
          target: element
        });
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
  };

  // ----------

  var unobserveAll = function unobserveAll() {
    var _iterator6 = _createForOfIteratorHelper(allItems.keys()),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var element = _step6.value;
        sizeWatcher.offResize(resizeHandler, element);
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
  };

  // ----------

  var setWidths = function setWidths(height) {
    var _iterator7 = _createForOfIteratorHelper(allItems.entries()),
      _step7;
    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var _step7$value = _slicedToArray(_step7.value, 2),
          element = _step7$value[0],
          properties = _step7$value[1];
        if (MH.parentOf(element) === containerElement) {
          var width = getWidthAtH(element, properties, height);
          debug: logger === null || logger === void 0 || logger.debug9("Setting width property", element, properties, width);
          (0, _cssAlter.setNumericStyleProps)(element, {
            sameHeightW: width
          }, {
            _units: "px"
          });
        }
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }
  };

  // SETUP ------------------------------

  widget.onDisable(unobserveAll);
  widget.onEnable(observeAll);
  widget.onDestroy(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var _iterator8, _step8, element;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _iterator8 = _createForOfIteratorHelper(allItems.keys());
          _context2.prev = 1;
          _iterator8.s();
        case 3:
          if ((_step8 = _iterator8.n()).done) {
            _context2.next = 12;
            break;
          }
          element = _step8.value;
          if (!(MH.parentOf(element) === containerElement)) {
            _context2.next = 10;
            break;
          }
          _context2.next = 8;
          return (0, _cssAlter.setNumericStyleProps)(element, {
            sameHeightW: NaN
          });
        case 8:
          _context2.next = 10;
          return (0, _cssAlter.removeClasses)(element, PREFIX_ITEM);
        case 10:
          _context2.next = 3;
          break;
        case 12:
          _context2.next = 17;
          break;
        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](1);
          _iterator8.e(_context2.t0);
        case 17:
          _context2.prev = 17;
          _iterator8.f();
          return _context2.finish(17);
        case 20:
          allItems.clear();
          _context2.next = 23;
          return (0, _cssAlter.removeClasses)(containerElement, PREFIX_ROOT);
        case 23:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 14, 17, 20]]);
  })));

  // Find all relevant items: the container, its direct children and the
  // top-level text only elements.
  var getProperties = function getProperties(itemType) {
    return {
      _type: itemType,
      _width: NaN,
      _height: NaN,
      _aspectR: NaN,
      _area: NaN,
      _extraH: NaN,
      _components: []
    };
  };
  allItems.set(containerElement, getProperties(""));
  var _iterator9 = _createForOfIteratorHelper(items.entries()),
    _step9;
  try {
    for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
      var _step9$value = _slicedToArray(_step9.value, 2),
        item = _step9$value[0],
        itemType = _step9$value[1];
      (0, _cssAlter.addClasses)(item, PREFIX_ITEM);
      var properties = getProperties(itemType);
      allItems.set(item, properties);
      if (itemType === S_TEXT) {
        properties._components = _getTextComponents(item);
        var _iterator10 = _createForOfIteratorHelper(properties._components),
          _step10;
        try {
          for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
            var child = _step10.value;
            allItems.set(child, getProperties(""));
          }
        } catch (err) {
          _iterator10.e(err);
        } finally {
          _iterator10.f();
        }
      }
    }
  } catch (err) {
    _iterator9.e(err);
  } finally {
    _iterator9.f();
  }
  (0, _cssAlter.addClasses)(containerElement, PREFIX_ROOT);
  observeAll();
};

/**
 * Find the top-level text-only elements that are descendants of the given one.
 */
var _getTextComponents = function getTextComponents(element) {
  var components = [];
  var _iterator11 = _createForOfIteratorHelper((0, _domQuery.getVisibleContentChildren)(element)),
    _step11;
  try {
    for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
      var child = _step11.value;
      if (isText(child)) {
        components.push(child);
      } else {
        components.push.apply(components, _toConsumableArray(_getTextComponents(child)));
      }
    }
  } catch (err) {
    _iterator11.e(err);
  } finally {
    _iterator11.f();
  }
  return components;
};
var calculateMeasurements = function calculateMeasurements(containerElement, allItems, isFirstTime, logger) {
  if ((0, _cssAlter.getData)(containerElement, MC.PREFIX_ORIENTATION) === MC.S_VERTICAL) {
    debug: logger === null || logger === void 0 || logger.debug8("In vertical mode");
    return null;
  }
  debug: logger === null || logger === void 0 || logger.debug7("Calculating measurements");
  // initial values
  var tArea = NaN,
    tExtraH = 0,
    imgAR = NaN,
    flexW = NaN,
    nItems = 0;
  var _iterator12 = _createForOfIteratorHelper(allItems.entries()),
    _step12;
  try {
    for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
      var _step12$value = _slicedToArray(_step12.value, 2),
        element = _step12$value[0],
        properties = _step12$value[1];
      var width = properties._width;
      var height = properties._height;
      if (element === containerElement) {
        flexW = width;
        nItems = MH.lengthOf((0, _domQuery.getVisibleContentChildren)(element));

        //
      } else if (properties._type === S_TEXT) {
        var thisTxtArea = 0,
          thisTxtExtraH = 0;
        var components = properties._components;
        if (MH.lengthOf(components)) {
          var _iterator13 = _createForOfIteratorHelper(properties._components),
            _step13;
          try {
            for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
              var component = _step13.value;
              var cmpProps = allItems.get(component);
              if (cmpProps) {
                thisTxtArea += cmpProps._width * cmpProps._height;
              } else {
                (0, _log.logError)(MH.bugError("Text component not observed"));
              }
            }
          } catch (err) {
            _iterator13.e(err);
          } finally {
            _iterator13.f();
          }
          thisTxtExtraH = height - thisTxtArea / width;
        } else {
          thisTxtArea = width * height;
        }
        properties._area = thisTxtArea;
        properties._extraH = thisTxtExtraH;
        tArea = (tArea || 0) + thisTxtArea;
        tExtraH += thisTxtExtraH;

        //
      } else if (properties._type === S_IMAGE) {
        if (isFirstTime && !areImagesLoaded(element)) {
          debug: logger === null || logger === void 0 || logger.debug8("Images not loaded");
          return null;
        }
        var thisAspectR = width / height;
        imgAR = (imgAR || 0) + thisAspectR;
        properties._aspectR = thisAspectR;

        //
      } else {
        // skip grandchildren (text components), here
        continue;
      }
      debug: logger === null || logger === void 0 || logger.debug8("Examined", properties, {
        tArea: tArea,
        tExtraH: tExtraH,
        imgAR: imgAR,
        flexW: flexW
      });
    }
  } catch (err) {
    _iterator12.e(err);
  } finally {
    _iterator12.f();
  }
  return {
    _tArea: tArea,
    _tExtraH: tExtraH,
    _imgAR: imgAR,
    _flexW: flexW,
    _nItems: nItems
  };
};
var getWidthAtH = function getWidthAtH(element, properties, targetHeight) {
  return properties._type === S_TEXT ? properties._area / (targetHeight - (properties._extraH || 0)) : properties._aspectR * targetHeight;
};
var getOptimalHeight = function getOptimalHeight(measurements, config, logger) {
  var tArea = measurements._tArea;
  var tExtraH = measurements._tExtraH;
  var imgAR = measurements._imgAR;
  var flexW = measurements._flexW - (measurements._nItems - 1) * config._minGap;
  var maxFreeR = config._maxFreeR;
  var maxWidthR = config._maxWidthR;
  debug: logger === null || logger === void 0 || logger.debug8("Getting optimal height", measurements, config);

  // CASE 1: No text items
  if (MH.isNaN(tArea)) {
    debug: logger === null || logger === void 0 || logger.debug8("No text items");
    if (!imgAR) {
      debug: logger === null || logger === void 0 || logger.debug8("Images not loaded");
      return NaN;
    }
    return flexW / imgAR;
  }

  // CASE 2: No images
  if (MH.isNaN(imgAR)) {
    debug: logger === null || logger === void 0 || logger.debug8("No images");
    return tArea / flexW + tExtraH;
  }
  if (!imgAR || !tArea) {
    debug: logger === null || logger === void 0 || logger.debug8("Expected both images and text, but no imgAR or tArea");
    return NaN;
  }
  var h0 = MH.sqrt(tArea / imgAR) + tExtraH;

  // heights satisfying w(h) === flexW
  var _quadraticRoots = (0, _math.quadraticRoots)(imgAR, -(imgAR * tExtraH + flexW), tArea + tExtraH * flexW),
    _quadraticRoots2 = _slicedToArray(_quadraticRoots, 2),
    h2 = _quadraticRoots2[0],
    h1 = _quadraticRoots2[1];

  // heights satisfying maxWidthR
  var hR0 = NaN,
    hR1 = NaN,
    hR2 = NaN;
  if (maxWidthR > 0) {
    hR0 = (0, _math.quadraticRoots)(imgAR, -imgAR * tExtraH, -tArea)[0];
    hR1 = (0, _math.quadraticRoots)(imgAR * maxWidthR, -imgAR * tExtraH * maxWidthR, -tArea)[0];
    hR2 = (0, _math.quadraticRoots)(imgAR / maxWidthR, -imgAR * tExtraH / maxWidthR, -tArea)[0];
  }

  // heights satisfying maxFreeR
  var hF2 = NaN,
    hF1 = NaN;
  if (maxFreeR >= 0) {
    var _quadraticRoots3 = (0, _math.quadraticRoots)(imgAR, -(imgAR * tExtraH + flexW * (1 - maxFreeR)), tArea + tExtraH * flexW * (1 - maxFreeR));
    var _quadraticRoots4 = _slicedToArray(_quadraticRoots3, 2);
    hF2 = _quadraticRoots4[0];
    hF1 = _quadraticRoots4[1];
  }

  // limits on constraints
  var hConstr1 = MH.max.apply(MH, _toConsumableArray(MH.filter([h1, hR1, hF1], function (v) {
    return (0, _math.isValidNum)(v);
  })));
  var hConstr2 = MH.min.apply(MH, _toConsumableArray(MH.filter([h2, hR2, hF2], function (v) {
    return (0, _math.isValidNum)(v);
  })));

  // text and image widths at h0
  var tw0 = tArea / (h0 - tExtraH);
  var iw0 = h0 * imgAR;

  // free space at h0
  var freeSpace0 = flexW - tw0 - iw0;
  debug: logger === null || logger === void 0 || logger.debug8("Optimal height calculations", config, measurements, {
    h0: h0,
    h1: h1,
    h2: h2,
    hR0: hR0,
    hR1: hR1,
    hR2: hR2,
    hF1: hF1,
    hF2: hF2,
    hConstr1: hConstr1,
    hConstr2: hConstr2,
    tw0: tw0,
    iw0: iw0,
    freeSpace0: freeSpace0
  });

  // ~~~~ Some sanity checks
  // If any of then is NaN, the comparison would be false, so we don't need to
  // check.
  // Also, we round the difference to 0.1 pixels to account for rounding
  // errors during calculations.
  if (!h0 || h0 <= 0) {
    debug: logger === null || logger === void 0 || logger.debug1("Invalid calculation: Invalid h0");
  } else if ((0, _math.isValidNum)(h1) !== (0, _math.isValidNum)(h2)) {
    debug: logger === null || logger === void 0 || logger.debug1("Invalid calculation: One and only one of h1 or h2 is real");
  } else if ((0, _math.isValidNum)(hR1) !== (0, _math.isValidNum)(hR2)) {
    debug: logger === null || logger === void 0 || logger.debug1("Invalid calculation: One and only one of hR1 or hR2 is real");
  } else if ((0, _math.isValidNum)(hF1) !== (0, _math.isValidNum)(hF2)) {
    debug: logger === null || logger === void 0 || logger.debug1("Invalid calculation: One and only one of hF1 or hF2 is real");
  } else if (h1 - h0 > 0.1) {
    debug: logger === null || logger === void 0 || logger.debug1("Invalid calculation: h1 > h0");
  } else if (h0 - h2 > 0.1) {
    debug: logger === null || logger === void 0 || logger.debug1("Invalid calculation: h0 > h2");
  } else if (hR0 - h0 > 0.1) {
    debug: logger === null || logger === void 0 || logger.debug1("Invalid calculation: hR0 > h0");
  } else if (hR1 - hR0 > 0.1) {
    debug: logger === null || logger === void 0 || logger.debug1("Invalid calculation: hR1 > hR0");
  } else if (hR0 - hR2 > 0.1) {
    debug: logger === null || logger === void 0 || logger.debug1("Invalid calculation: hR0 > hR2");
  } else if (hF1 - hF2 > 0.1) {
    debug: logger === null || logger === void 0 || logger.debug1("Invalid calculation: hF1 > hF2");
  } else if (h1 - hF1 > 0.1) {
    debug: logger === null || logger === void 0 || logger.debug1("Invalid calculation: h1 > hF1");
  } else if (hF2 - h2 > 0.1) {
    debug: logger === null || logger === void 0 || logger.debug1("Invalid calculation: hF2 > h2");
  } else {
    // Choose a height
    if (freeSpace0 <= 0) {
      // scenario 1 or 2
      return h0;
    } else {
      // scenario 3
      return MH.min(hConstr1, hConstr2);
    }
  }
  (0, _log.logError)(MH.bugError("Invalid SameHeight calculations"), measurements, config);
  return NaN; // sanity checks failed
};
//# sourceMappingURL=same-height.cjs.map