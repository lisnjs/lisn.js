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
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Triggers
 *
 * @categoryDescription Pointer
 * {@link ClickTrigger} allows you to run actions when a user clicks a target
 * element (first time and every other time, i.e. odd number of click), and
 * undo them when a user clicks the target element again (or every even number
 * of clicks). It always acts as a toggle.
 *
 * {@link PressTrigger} allows you to run actions when the user presses and
 * holds a pointing device (or their finger) on a target element, and undo
 * those actions when they release their pointing device or lift their finger
 * off.
 *
 * {@link HoverTrigger} allows you to run actions when the user hovers overs
 * a target element, and undo those actions when their pointing device moves
 * off the target. On touch devices it acts just like {@link PressTrigger}.
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { waitForReferenceElement } from "../utils/dom-search.js";
import { omitKeys } from "../utils/misc.js";
import { validateBoolean } from "../utils/validation.js";
import { PointerWatcher } from "../watchers/pointer-watcher.js";
import { registerTrigger, Trigger } from "./trigger.js";
/**
 * {@link ClickTrigger} allows you to run actions when a user clicks a target
 * element (first time and every other time, i.e. odd number of click), and
 * undo them when a user clicks the target element again (or every even number
 * of clicks). It always acts as a toggle.
 *
 * -------
 *
 * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
 * specification.
 *
 * - Arguments: none
 * - Additional trigger options: none
 *   - `target`: A string element specification.
 *     See {@link Utils.getReferenceElement | getReferenceElement}.
 *   - `prevent-default`: A boolean.
 *   - `prevent-select`: A boolean.
 *
 * @example
 * Add classes `active` and `toggled-on` when the user clicks the element
 * (first time and every other time, i.e. odd number of click), remove them
 * when clicked again (or even number of click);
 *
 * ```html
 * <div data-lisn-on-click="@add-class=active,toggled-on"></div>
 * ```
 *
 * @example
 * As above, but using a CSS class instead of data attribute:
 *
 * ```html
 * <div class="lisn-on-click--@add-class=active,toggled-on"></div>
 * ```
 *
 * @example
 * Play the animations on the element 1000ms after the first time the user
 * clicks it.
 *
 * ```html
 * <div data-lisn-on-click="@animate +once +delay=1000"></div>
 * ```
 *
 * @example
 * Add class `visited` the first time the user clicks the element, and
 * play or reverse the animations on the element 1000ms each time the
 * user clicks it.
 *
 * ```html
 * <div data-lisn-on-click="@add-class=visited +once ;
 *                          @animate +delay=1000"
 * ></div>
 * ```
 *
 * @example
 * When the user clicks the next element with class `box` then add classes `c1`
 * and `c2` to the element (that the trigger is defined on) and enable trigger
 * `my-trigger` defined on this same element; undo all of that on even number
 * of clicks on the reference box element.
 *
 * ```html
 * <div data-lisn-on-click="@add-class=c1,c2 @enable=my-trigger +target=next.box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div class="box"></div>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <div data-lisn-on-click="@add-class=c1,c2 @enable=my-trigger +target=next-box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div data-lisn-ref="box"></div>
 * ```
 *
 * @category Pointer
 */
export var ClickTrigger = /*#__PURE__*/function (_Trigger) {
  /**
   * If no actions are supplied, nothing is done.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the config is invalid.
   */
  function ClickTrigger(element, actions) {
    var _this;
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _classCallCheck(this, ClickTrigger);
    _this = _callSuper(this, ClickTrigger, [element, actions, config]);
    _defineProperty(_this, "getConfig", void 0);
    _this.getConfig = function () {
      return MH.copyObject(config);
    };
    setupWatcher(_this, element, actions, config, MC.S_CLICK);
    return _this;
  }
  _inherits(ClickTrigger, _Trigger);
  return _createClass(ClickTrigger, null, [{
    key: "register",
    value: function register() {
      registerTrigger(MC.S_CLICK, function (element, args, actions, config) {
        return new ClickTrigger(element, actions, config);
      }, newConfigValidator);
    }
  }]);
}(Trigger);

/**
 * {@link PressTrigger} allows you to run actions when the user presses and
 * holds a pointing device (or their finger) on a target element, and undo
 * those actions when they release their pointing device or lift their finger
 * off.
 *
 * -------
 *
 * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
 * specification.
 *
 * - Arguments: none
 * - Additional trigger options: none
 *   - `target`: A string element specification.
 *     See {@link Utils.getReferenceElement | getReferenceElement}.
 *   - `prevent-default`: boolean
 *   - `prevent-select`: boolean
 *
 * @example
 * Add classes `active` and `pressed` when the user presses and holds (with
 * mouse, finger or any pointer) the element, remove them when they release
 * the mouse.
 *
 * ```html
 * <div data-lisn-on-press="@add-class=active,pressed"></div>
 * ```
 *
 * @example
 * As above, but using a CSS class instead of data attribute:
 *
 * ```html
 * <div class="lisn-on-press--@add-class=active,pressed"></div>
 * ```
 *
 * @example
 * Play the animations on the element 1000ms after the first time the user
 * presses on the element it.
 *
 * ```html
 * <div data-lisn-on-press="@animate +once +delay=1000"></div>
 * ```
 *
 * @example
 * Add class `pressed` the first time the user presses on the element, and
 * play the animations on the element while the user is pressing on the element
 * with a delay of 100ms, reverse the animations as soon as the user releases
 * the mouse.
 *
 * ```html
 * <div data-lisn-on-click="@add-class=pressed +once ;
 *                          @animate +do-delay=100"
 * ></div>
 * ```
 *
 * @example
 * When the user presses and holds the next element with class `box` then add
 * classes `c1` and `c2` to the element (that the trigger is defined on) and
 * enable trigger `my-trigger` defined on this same element; undo all of that
 * when they release the mouse (or lift their finger/pointer device) from the
 * reference box element.
 *
 * ```html
 * <div data-lisn-on-press="@add-class=c1,c2 @enable=my-trigger +target=next.box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div class="box"></div>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <div data-lisn-on-press="@add-class=c1,c2 @enable=my-trigger +target=next-box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div data-lisn-ref="box"></div>
 * ```
 *
 * @category Pointer
 */
export var PressTrigger = /*#__PURE__*/function (_Trigger2) {
  /**
   * If no actions are supplied, nothing is done.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the config is invalid.
   */
  function PressTrigger(element, actions) {
    var _this2;
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _classCallCheck(this, PressTrigger);
    _this2 = _callSuper(this, PressTrigger, [element, actions, config]);
    _defineProperty(_this2, "getConfig", void 0);
    _this2.getConfig = function () {
      return MH.copyObject(config);
    };
    setupWatcher(_this2, element, actions, config, MC.S_PRESS);
    return _this2;
  }
  _inherits(PressTrigger, _Trigger2);
  return _createClass(PressTrigger, null, [{
    key: "register",
    value: function register() {
      registerTrigger(MC.S_PRESS, function (element, args, actions, config) {
        return new PressTrigger(element, actions, config);
      }, newConfigValidator);
    }
  }]);
}(Trigger);

/**
 * {@link HoverTrigger} allows you to run actions when the user hovers overs
 * a target element, and undo those actions when their pointing device moves
 * off the target. On touch devices it acts just like {@link PressTrigger}.
 *
 * -------
 *
 * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
 * specification.
 *
 * - Arguments: none
 * - Additional trigger options: none
 *   - `target`: A string element specification.
 *     See {@link Utils.getReferenceElement | getReferenceElement}.
 *   - `prevent-default`: boolean
 *   - `prevent-select`: boolean
 *
 * @example
 * Add classes `active` and `hovered` when the user hovers over the element,
 * remove them otherwise.
 *
 * ```html
 * <div data-lisn-on-hover="@add-class=active,hovered"></div>
 * ```
 *
 * @example
 * As above, but using a CSS class instead of data attribute:
 *
 * ```html
 * <div class="lisn-on-press--@add-class=active,hovered"></div>
 * ```
 *
 * @example
 * Play the animations on the element 1000ms after the first time the user
 * hovers over the element it.
 *
 * ```html
 * <div data-lisn-on-hover="@animate +once +delay=1000"></div>
 * ```
 *
 * @example
 * Add class `hovered` the first time the user hovers over the element, and
 * play the animations on the element while the user is hovering over the
 * element with a delay of 100ms, reverse the animations as soon as the user
 * mouse leaves the element.
 *
 * ```html
 * <div data-lisn-on-click="@add-class=hovered +once ;
 *                          @animate +do-delay=100"
 * ></div>
 * ```
 *
 * @example
 * When the user hovers over the next element with class `box` then add classes
 * `c1` and `c2` to the element (that the trigger is defined on) and enable
 * trigger `my-trigger` defined on this same element; undo all of that when
 * their pointing device (or finger) moves off the reference element.
 *
 * ```html
 * <div data-lisn-on-hover="@add-class=c1,c2 @enable=my-trigger +target=next.box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div class="box"></div>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <div data-lisn-on-hover="@add-class=c1,c2 @enable=my-trigger +target=next-box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div data-lisn-ref="box"></div>
 * ```
 *
 * @category Pointer
 */
export var HoverTrigger = /*#__PURE__*/function (_Trigger3) {
  /**
   * If no actions are supplied, nothing is done.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the config is invalid.
   */
  function HoverTrigger(element, actions) {
    var _this3;
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _classCallCheck(this, HoverTrigger);
    _this3 = _callSuper(this, HoverTrigger, [element, actions, config]);
    _defineProperty(_this3, "getConfig", void 0);
    _this3.getConfig = function () {
      return MH.copyObject(config);
    };
    setupWatcher(_this3, element, actions, config, MC.S_HOVER);
    return _this3;
  }
  _inherits(HoverTrigger, _Trigger3);
  return _createClass(HoverTrigger, null, [{
    key: "register",
    value: function register() {
      registerTrigger(MC.S_HOVER, function (element, args, actions, config) {
        return new HoverTrigger(element, actions, config);
      }, newConfigValidator);
    }
  }]);
}(Trigger);

/**
 * @category Pointer
 * @interface
 */

// --------------------

var newConfigValidator = function newConfigValidator(element) {
  return {
    target: function target(key, value) {
      var _ref;
      return (_ref = MH.isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    },
    preventDefault: validateBoolean,
    preventSelect: validateBoolean
  };
};
var setupWatcher = function setupWatcher(widget, element, actions, config, action) {
  if (!MH.lengthOf(actions)) {
    return;
  }
  var target = MH.targetOf(config) || element;

  // For clicks use the trigger's own toggle function so that it remembers ITS
  // state rather than the odd/even clicks. Otherwise if the trigger is
  // disabled, then clicking will "swap" the state.
  var startHandler;
  var endHandler;
  if (action === MC.S_CLICK) {
    startHandler = endHandler = widget[MC.S_TOGGLE];
  } else {
    startHandler = widget.run;
    endHandler = widget.reverse;
  }
  PointerWatcher.reuse().onPointer(target, startHandler, endHandler, MH.merge({
    actions: action
  }, omitKeys(config, {
    target: null
  })));
};
//# sourceMappingURL=pointer-trigger.js.map