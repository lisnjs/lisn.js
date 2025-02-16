"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AutoHide = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _cssAlter = require("../utils/css-alter.cjs");
var _domAlter = require("../utils/dom-alter.cjs");
var _domEvents = require("../utils/dom-events.cjs");
var _validation = require("../utils/validation.cjs");
var _domWatcher = require("../watchers/dom-watcher.cjs");
var _widget = require("./widget.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _superPropGet(t, o, e, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); } /**
 * @module Widgets
 */
/**
 * Configures the given element as an {@link AutoHide} widget.
 *
 * The AutoHide widget automatically hides (and optionally removes) the given
 * element, or children of it that match a given selector, after a certain
 * delay.
 *
 * It executes these actions every time the matching element(s) have a change
 * of attribute or appear (are inserted) into the DOM.
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-auto-hide` class or `data-lisn-auto-hide` attribute
 * - `lisn-auto-remove` class or `data-lisn-auto-remove` attribute (enables
 *   {@link AutoHideConfig.remove})
 *
 * **NOTE:** This widget supports multiple instances per element, you can
 * specify multiple widget configurations, separated with ";".
 *
 * See below examples for what values you can use set for the data attributes
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This will automatically hide (with class `lisn-hide`) the element 3 seconds
 * (default delay) after it is inserted into the DOM or after it gets any
 * attributes changed on it (for example that might show it again).
 *
 * ```html
 * <div class="lisn-auto-hide">
 *   Automatically hidden in 3s.
 * </div>
 * ```
 *
 * @example
 * This will automatically hide and then remove the element 3 seconds (default
 * delay) after it is inserted into the DOM.
 *
 * ```html
 * <div class="lisn-auto-remove">
 *   Automatically hidden and removed in 3s.
 * </div>
 * ```
 *
 * @example
 * This will automatically
 * - hide `p` elements with class `message` 2 seconds after they are inserted
 *   or changed
 * - hide `p` elements with class `warning` 5 seconds after they are inserted
 *   or changed; and it will save that particular {@link AutoHide} widget with
 *   ID `myID` so that it can be looked up using {@link AutoHide.get}
 * - remove `p` elements with class `disposable` 3 seconds (default delay)
 *   after they are inserted or changed
 *
 * ```html
 * <div data-lisn-auto-hide="selector=p.message delay=2000 ;
 *                           selector=p.warning delay=5000 id=myID"
 *      data-lisn-auto-remove="selector=p.disposable">
 *   <p>Some text, this will stay.</p>
 *   <p class="message">
 *     Automatically hidden in 2s.
 *   </p>
 *   <p class="warning">
 *     Automatically hidden in 5s.
 *   </p>
 *   <p class="disposable">
 *     Automatically hidden and removed in 3s.
 *   </p>
 * </div>
 * ```
 */
var AutoHide = exports.AutoHide = /*#__PURE__*/function (_Widget) {
  function AutoHide(element, config) {
    var _this;
    _classCallCheck(this, AutoHide);
    _this = _callSuper(this, AutoHide, [element, config]);
    var selector = config === null || config === void 0 ? void 0 : config.selector;
    var watcher = _domWatcher.DOMWatcher.create({
      root: element,
      subtree: selector ? true : false
    });

    // Watch for attribute change on this element, and for relevant children
    // being added/changed
    var watcherOptions = selector ? _defineProperty({
      selector: selector,
      categories: [MC.S_ADDED, MC.S_ATTRIBUTE]
    }, MC.S_SKIP_INITIAL, true) : _defineProperty({
      categories: [MC.S_ATTRIBUTE]
    }, MC.S_SKIP_INITIAL, true);
    var hideOrRemoveEl = config !== null && config !== void 0 && config.remove ? _domAlter.hideAndRemoveElement : _cssAlter.hideElement;
    var hideRelevant = function hideRelevant() {
      if (_this.isDisabled()) {
        return;
      }
      var targetElements = selector ? MH.querySelectorAll(element, selector) : [element];
      var _iterator = _createForOfIteratorHelper(targetElements),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _config$delay;
          var elem = _step.value;
          hideOrRemoveEl(elem, (_config$delay = config === null || config === void 0 ? void 0 : config.delay) !== null && _config$delay !== void 0 ? _config$delay : DEFAULT_DELAY);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    };
    var addWatcher = function addWatcher() {
      return watcher.onMutation(hideRelevant, watcherOptions);
    };
    var removeWatcher = function removeWatcher() {
      return watcher.offMutation(hideRelevant);
    };

    // ------------------------------

    // Don't hide/remove before the page is loaded
    (0, _domEvents.waitForPageReady)().then(function () {
      // Hide initially
      if (_this.isDestroyed()) {
        return;
      }
      hideRelevant();
      addWatcher();
    });
    _this.onDisable(removeWatcher);
    _this.onEnable(function () {
      hideRelevant();
      addWatcher();
    });
    return _this;
  }
  _inherits(AutoHide, _Widget);
  return _createClass(AutoHide, null, [{
    key: "get",
    value: function get(element, id) {
      var instance = _superPropGet(AutoHide, "get", this, 2)([element, id]);
      if (MH.isInstanceOf(instance, AutoHide)) {
        return instance;
      }
      return null;
    }
  }, {
    key: "register",
    value: function register() {
      var _iterator2 = _createForOfIteratorHelper([[WIDGET_NAME_HIDE, false], [WIDGET_NAME_REMOVE, true]]),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _step2$value = _slicedToArray(_step2.value, 2),
            name = _step2$value[0],
            remove = _step2$value[1];
          (0, _widget.registerWidget)(name, function (element, config) {
            return new AutoHide(element, config);
          }, newConfigValidator(remove), {
            supportsMultiple: true
          });
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }]);
}(_widget.Widget);
/**
 * @interface
 */
// ------------------------------

var WIDGET_NAME_HIDE = "auto-hide";
var WIDGET_NAME_REMOVE = "auto-remove";
var DEFAULT_DELAY = 3000;
var newConfigValidator = function newConfigValidator(autoRemove) {
  return {
    id: _validation.validateString,
    remove: function remove() {
      return autoRemove;
    },
    selector: _validation.validateString,
    delay: _validation.validateNumber
  };
};
//# sourceMappingURL=auto-hide.cjs.map