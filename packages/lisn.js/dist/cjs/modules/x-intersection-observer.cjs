"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XIntersectionObserver = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Modules/XIntersectionObserver
 */
/**
 * {@link XIntersectionObserver} is an extension of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver | IntersectionObserver}
 * with added capabilities:
 * - can skip the initial callback that happens shortly after setting up via
 *   {@link observeLater}
 */
var XIntersectionObserver = exports.XIntersectionObserver = /*#__PURE__*/_createClass(function XIntersectionObserver(callback, observeOptions) {
  var _this = this;
  _classCallCheck(this, XIntersectionObserver);
  /**
   * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root | IntersectionObserver:root}.
   */
  _defineProperty(this, "root", void 0);
  /**
   * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin | IntersectionObserver:rootMargin}.
   */
  _defineProperty(this, "rootMargin", void 0);
  /**
   * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds | IntersectionObserver:thresholds}.
   */
  _defineProperty(this, "thresholds", void 0);
  /**
   * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/observe | IntersectionObserver:observe} except it accepts multiple
   * targets.
   */
  _defineProperty(this, "observe", void 0);
  /**
   * Like {@link observe} but it ignores the initial almost immediate callback
   * and only calls the callback on a subsequent intersection change.
   */
  _defineProperty(this, "observeLater", void 0);
  /**
   * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/unobserve | IntersectionObserver:unobserve} except it accepts multiple
   * targets.
   */
  _defineProperty(this, "unobserve", void 0);
  /**
   * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/disconnect | IntersectionObserver:disconnect}.
   */
  _defineProperty(this, "disconnect", void 0);
  /**
   * Like `IntersectionObserver.takeRecords`.
   */
  _defineProperty(this, "takeRecords", void 0);
  var observedTargets = MH.newWeakSet();
  var targetsToSkip = MH.newWeakSet();
  var intersectionHandler = function intersectionHandler(entries) {
    var selectedEntries = [];
    var _iterator = _createForOfIteratorHelper(entries),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        if (targetsToSkip.has(MH.targetOf(entry))) {
          MH.deleteKey(targetsToSkip, MH.targetOf(entry));
          continue;
        }
        selectedEntries.push(entry);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (MH.lengthOf(selectedEntries)) {
      callback(selectedEntries, _this);
    }
  };
  var observer = MH.newIntersectionObserver(intersectionHandler, observeOptions);
  MH.defineProperty(this, "root", {
    get: function get() {
      return observer.root;
    }
  });
  MH.defineProperty(this, "rootMargin", {
    get: function get() {
      return observer.rootMargin;
    }
  });
  MH.defineProperty(this, "thresholds", {
    get: function get() {
      return observer.thresholds;
    }
  });
  this.observe = function () {
    for (var _len = arguments.length, targets = new Array(_len), _key = 0; _key < _len; _key++) {
      targets[_key] = arguments[_key];
    }
    for (var _i = 0, _targets = targets; _i < _targets.length; _i++) {
      var target = _targets[_i];
      observedTargets.add(target);
      observer.observe(target);
    }
  };
  this.observeLater = function () {
    for (var _len2 = arguments.length, targets = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      targets[_key2] = arguments[_key2];
    }
    for (var _i2 = 0, _targets2 = targets; _i2 < _targets2.length; _i2++) {
      var target = _targets2[_i2];
      // Only skip them if not already observed, otherwise the initial
      // (almost) immediate callback won't happen anyway.
      if (observedTargets.has(target)) {
        continue;
      }
      targetsToSkip.add(target);
      _this.observe(target);
    }
  };
  this.unobserve = function () {
    for (var _len3 = arguments.length, targets = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      targets[_key3] = arguments[_key3];
    }
    for (var _i3 = 0, _targets3 = targets; _i3 < _targets3.length; _i3++) {
      var target = _targets3[_i3];
      MH.deleteKey(observedTargets, target);
      observer.unobserve(target);
    }
  };
  this.disconnect = function () {
    observedTargets = MH.newWeakSet();
    observer.disconnect();
  };
  this.takeRecords = function () {
    return observer.takeRecords();
  };
});
//# sourceMappingURL=x-intersection-observer.cjs.map