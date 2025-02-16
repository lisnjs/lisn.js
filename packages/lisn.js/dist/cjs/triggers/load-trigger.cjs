"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoadTrigger = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _domEvents = require("../utils/dom-events.cjs");
var _trigger = require("./trigger.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
 * @module Triggers
 *
 * @categoryDescription Load
 * {@link LoadTrigger} allows you to run actions once when the page is loaded.
 */
/**
 * {@link LoadTrigger} allows you to run actions one when the page is loaded.
 *
 * -------
 *
 * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
 * specification.
 *
 * - Arguments: none
 * - Additional trigger options: none
 *
 * @example
 * Scroll to the given element when the page is loaded:
 *
 * ```html
 * <div data-lisn-on-load=":scroll-to"></div>
 * ```
 *
 * @example
 * Scroll to 100px above the given element 500ms after the page is loaded:
 *
 * ```html
 * <div data-lisn-on-load="@scroll-to=0,-100 +delay=500"></div>
 * ```
 *
 * @example
 * Scroll to 100px above the given element 500ms after the page is loaded, and
 * play animations defined on it 500ms later (1000ms after it's loaded):
 *
 * ```html
 * <div data-lisn-on-load="@scroll-to=0,-100 +delay=500 ;
 *                         @animate +delay=1000"
 * ></div>
 * ```
 *
 * @category Load
 */
var LoadTrigger = exports.LoadTrigger = /*#__PURE__*/function (_Trigger) {
  /**
   * If no actions are supplied, nothing is done.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the config is invalid.
   */
  function LoadTrigger(element, actions, config) {
    var _this;
    _classCallCheck(this, LoadTrigger);
    _this = _callSuper(this, LoadTrigger, [element, actions, config]);
    _defineProperty(_this, "getConfig", void 0);
    _this.getConfig = function () {
      return MH.copyObject(config);
    };
    if (!MH.lengthOf(actions)) {
      return _possibleConstructorReturn(_this);
    }
    (0, _domEvents.waitForPageReady)().then(_this.run);
    return _this;
  }
  _inherits(LoadTrigger, _Trigger);
  return _createClass(LoadTrigger, null, [{
    key: "register",
    value: function register() {
      (0, _trigger.registerTrigger)("load", function (element, args, actions, config) {
        return new LoadTrigger(element, actions, config);
      });
    }
  }]);
}(_trigger.Trigger);
//# sourceMappingURL=load-trigger.cjs.map