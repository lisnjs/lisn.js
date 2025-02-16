"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XResizeObserver = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _log = require("../utils/log.cjs");
var _debug = _interopRequireDefault(require("../debug/debug.cjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
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
 * @module Modules/XResizeObserver
 */
/**
 * {@link XResizeObserver} is an extension of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver | ResizeObserver}
 * - observes both border box and content box size changes
 * - can skip the initial callback that happens shortly after setting up via
 *   {@link observeLater}
 * - can debounce the callback
 */
var XResizeObserver = exports.XResizeObserver = /*#__PURE__*/_createClass(
/**
 * @param {} debounceWindow Debounce the handler so that it's called at most
 *                          every `debounceWindow` ms.
 */
function XResizeObserver(callback, debounceWindow) {
  var _this = this;
  _classCallCheck(this, XResizeObserver);
  /**
   * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/observe | ResizeObserver:observe} except it accepts multiple targets.
   */
  _defineProperty(this, "observe", void 0);
  /**
   * Like {@link observe} but it ignores the initial almost immediate callback
   * and only calls the callback on a subsequent resize.
   *
   * If the target is already being observed, nothing is done.
   */
  _defineProperty(this, "observeLater", void 0);
  /**
   * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/unobserve | ResizeObserver:unobserve} except it accepts multiple targets.
   */
  _defineProperty(this, "unobserve", void 0);
  /**
   * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/disconnect | ResizeObserver:disconnect}.
   */
  _defineProperty(this, "disconnect", void 0);
  var logger = _debug["default"] ? new _debug["default"].Logger({
    name: "XResizeObserver"
  }) : null;

  // Keep the latest ResizeObserverEntry for each target during the
  // debounceWindow. Short-lived, so ok to use a Map.
  var buffer = MH.newMap();

  // Since internally we have two observers, one for border box, one for
  // content box, we will get called initially twice for a target. So we keep
  // a counter of 1 or 2 for how many more calls to ignore.
  var targetsToSkip = MH.newWeakMap();
  var observedTargets = MH.newWeakSet();
  debounceWindow = debounceWindow || 0;
  var timer = null;
  var resizeHandler = function resizeHandler(entries) {
    // Override entries for previous targets, but keep entries whose targets
    // were not resized in this round
    var _iterator = _createForOfIteratorHelper(entries),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        var target = MH.targetOf(entry);
        var skipNum = targetsToSkip.get(target);
        if (skipNum !== undefined) {
          if (skipNum === 2) {
            // expect one more call
            targetsToSkip.set(target, 1);
          } else {
            // done
            /* istanbul ignore next */
            if (skipNum !== 1) {
              (0, _log.logError)(MH.bugError("# targetsToSkip is ".concat(skipNum)));
            }
            MH.deleteKey(targetsToSkip, target);
          }
          continue;
        }
        buffer.set(target, entry);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    debug: logger === null || logger === void 0 || logger.debug9("Got ".concat(entries.length, " new entries. ") + "Have ".concat(buffer.size, " unique-target entries"), entries);
    if (!timer && MH.sizeOf(buffer)) {
      timer = MH.setTimer(function () {
        if (MH.sizeOf(buffer)) {
          callback(MH.arrayFrom(buffer.values()), _this);
          buffer.clear();
        }
        timer = null;
      }, debounceWindow);
    }
  };
  var borderObserver = MH.newResizeObserver(resizeHandler);
  var contentObserver = MH.newResizeObserver(resizeHandler);
  if (!borderObserver || !contentObserver) {
    (0, _log.logWarn)("This browser does not support ResizeObserver. Some features won't work.");
  }
  var observeTarget = function observeTarget(target) {
    observedTargets.add(target);
    borderObserver === null || borderObserver === void 0 || borderObserver.observe(target, {
      box: "border-box"
    });
    contentObserver === null || contentObserver === void 0 || contentObserver.observe(target);
  };

  // --------------------

  this.observe = function () {
    for (var _len = arguments.length, targets = new Array(_len), _key = 0; _key < _len; _key++) {
      targets[_key] = arguments[_key];
    }
    debug: logger === null || logger === void 0 || logger.debug10("Observing targets", targets);
    for (var _i = 0, _targets = targets; _i < _targets.length; _i++) {
      var target = _targets[_i];
      observeTarget(target);
    }
  };
  this.observeLater = function () {
    for (var _len2 = arguments.length, targets = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      targets[_key2] = arguments[_key2];
    }
    debug: logger === null || logger === void 0 || logger.debug10("Observing targets (later)", targets);
    for (var _i2 = 0, _targets2 = targets; _i2 < _targets2.length; _i2++) {
      var target = _targets2[_i2];
      // Only skip them if not already observed, otherwise the initial
      // (almost) immediate callback won't happen anyway.
      if (observedTargets.has(target)) {
        continue;
      }
      targetsToSkip.set(target, 2);
      observeTarget(target);
    }
  };
  this.unobserve = function () {
    for (var _len3 = arguments.length, targets = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      targets[_key3] = arguments[_key3];
    }
    debug: logger === null || logger === void 0 || logger.debug10("Unobserving targets", targets);
    for (var _i3 = 0, _targets3 = targets; _i3 < _targets3.length; _i3++) {
      var target = _targets3[_i3];
      MH.deleteKey(observedTargets, target);
      borderObserver === null || borderObserver === void 0 || borderObserver.unobserve(target);
      contentObserver === null || contentObserver === void 0 || contentObserver.unobserve(target);
    }
  };
  this.disconnect = function () {
    debug: logger === null || logger === void 0 || logger.debug10("Disconnecting");
    observedTargets = MH.newWeakSet();
    borderObserver === null || borderObserver === void 0 || borderObserver.disconnect();
    contentObserver === null || contentObserver === void 0 || contentObserver.disconnect();
  };
});
//# sourceMappingURL=x-resize-observer.cjs.map