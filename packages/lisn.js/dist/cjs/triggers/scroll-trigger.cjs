"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollTrigger = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _directions = require("../utils/directions.cjs");
var _domSearch = require("../utils/dom-search.cjs");
var _validation = require("../utils/validation.cjs");
var _scrollWatcher = require("../watchers/scroll-watcher.cjs");
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
 * @categoryDescription Scroll
 * {@link ScrollTrigger} allows you to run actions when the user scrolls a
 * target element (or the main scrollable element) in a given direction, and
 * undo those actions when they scroll in the opposite direction.
 */
/**
 * {@link ScrollTrigger} allows you to run actions when the user scrolls a
 * target element (or the main scrollable element) in a given direction, and
 * undo those actions when they scroll in the opposite direction.
 *
 * -------
 *
 * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
 * specification.
 *
 * - Arguments (optional): One or more (comma-separated) scroll directions.
 *   Note that if you do not specify any directions, then the trigger will just
 *   run once, on any scroll.
 * - Additional trigger options:
 *   - `scrollable`: A string element specification.
 *      See {@link Utils.getReferenceElement | getReferenceElement}.
 *   - `threshold`: A number.
 *
 * @example
 * Show the element when the user scrolls the page up, hide when scrolling
 * down. User scrolling left or right not trigger the action. See
 * {@link getOppositeXYDirections}:
 *
 * ```html
 * <div data-lisn-on-scroll="up @show"></div>
 * ```
 *
 * @example
 * As above, but using a CSS class instead of data attribute:
 *
 * ```html
 * <div class="lisn-on-scroll--up@show"></div>
 * ```
 *
 * @example
 * Show the element 1000ms after the first time the user scrolls the page up:
 *
 * ```html
 * <div data-lisn-on-scroll="up @show +once +delay=1000"></div>
 * ```
 *
 * @example
 * Add class `scrolled` the first time the user scrolls the page in any
 * direction (note that the `once` option is implied here), and show the
 * element 1000ms after each time the user scrolls the page up, hide it as soon
 * as they scroll down:
 *
 * ```html
 * <div data-lisn-on-scroll="@add-class=scrolled ;
 *                           up @show +do-delay=1000"
 * ></div>
 * ```
 *
 * @example
 * When the user scrolls up or down the closest ancestor with class `section`,
 * then add classes `c1` and `c2` and enable trigger `my-trigger` defined on
 * this same element; undo all of that when scrolling right or left:
 *
 * ```html
 * <div class="section">
 *   <div data-lisn-on-scroll="up,down @add-class=c1,c2 @enable=my-trigger +scrollable=this.section"
 *      data-lisn-on-run="@show +id=my-trigger"
 *   ></div>
 *</div>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <div data-lisn-ref="section">
 *   <div data-lisn-on-scroll="up,down @add-class=c1,c2 @enable=my-trigger +scrollable=this-section"
 *      data-lisn-on-run="@show +id=my-trigger"
 *   ></div>
 *</div>
 * ```
 *
 * @category Scroll
 */
var ScrollTrigger = exports.ScrollTrigger = /*#__PURE__*/function (_Trigger) {
  /**
   * If no actions are supplied, nothing is done.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the config is invalid.
   */
  function ScrollTrigger(element, actions, config) {
    var _this;
    _classCallCheck(this, ScrollTrigger);
    config = config !== null && config !== void 0 ? config : {};
    var directions = config.directions;
    if (!directions) {
      config.once = true;
      directions = [MC.S_UP, MC.S_DOWN, MC.S_LEFT, MC.S_RIGHT];
    }
    _this = _callSuper(this, ScrollTrigger, [element, actions, config]);
    _defineProperty(_this, "getConfig", void 0);
    _this.getConfig = function () {
      return MH.copyObject(config);
    };
    if (!MH.lengthOf(actions)) {
      return _possibleConstructorReturn(_this);
    }
    var watcher = _scrollWatcher.ScrollWatcher.reuse();
    var scrollable = config.scrollable;
    var threshold = config.threshold;
    var oppositeDirections = directions ? (0, _directions.getOppositeXYDirections)(directions) : [];
    watcher.onScroll(_this.run, {
      directions: directions,
      scrollable: scrollable,
      threshold: threshold
    });
    if (MH.lengthOf(oppositeDirections)) {
      watcher.onScroll(_this.reverse, {
        directions: oppositeDirections,
        scrollable: scrollable,
        threshold: threshold
      });
    }
    return _this;
  }
  _inherits(ScrollTrigger, _Trigger);
  return _createClass(ScrollTrigger, null, [{
    key: "register",
    value: function register() {
      (0, _trigger.registerTrigger)(MC.S_SCROLL, function (element, args, actions, config) {
        return new ScrollTrigger(element, actions, MH.assign(config, {
          directions: (0, _validation.validateStrList)("directions", args, _directions.isValidXYDirection)
        }));
      }, newConfigValidator);
    }
  }]);
}(_trigger.Trigger);
/**
 * @category Scroll
 * @interface
 */
// --------------------

var newConfigValidator = function newConfigValidator(element) {
  return {
    scrollable: function scrollable(key, value) {
      var _ref;
      return (_ref = MH.isLiteralString(value) ? (0, _domSearch.waitForReferenceElement)(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    },
    threshold: _validation.validateNumber
  };
};
//# sourceMappingURL=scroll-trigger.cjs.map