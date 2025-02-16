function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
/**
 * @module Widgets
 */

import * as MH from "../globals/minification-helpers.js";
import { waitForReferenceElement } from "../utils/dom-search.js";
import { validateNumber, validateString, validateNumList } from "../utils/validation.js";
import { ViewWatcher } from "../watchers/view-watcher.js";
import { Widget, registerWidget } from "./widget.js";

/**
 * This is a simple wrapper around the {@link ViewWatcher}. If you are using
 * the JavaScript API, you should use the {@link ViewWatcher} directly. The
 * purpose of this widget is to expose the watcher's ability to track an
 * element's position across the viewport (or a given root element) and set
 * relevant CSS properties via the HTML API. See {@link ViewWatcher.trackView}.
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-track-view` class or `data-lisn-track-view` attribute set on
 *   the element that constitutes the widget.
 *
 * See below examples for what values you can use set for the data attributes
 * in order to modify the configuration of the automatically created widget.
 *
 * Note that the root margin value can either be comma-separated or
 * space-separated.
 *
 * @example
 * This will track the element across the viewport and set the relevant CSS
 * properties.
 *
 * ```html
 * <div class="lisn-track-view"></div>
 * ```
 *
 * @example
 * As above but with custom settings.
 *
 * ```html
 * <div id="myRoot"></div>
 * <div data-lisn-track-view="root=#myRoot
 *                            | root-margin=100px,50px
 *                            | threshold=0,0.5"
 * ></div>
 * ```
 */
export var TrackView = /*#__PURE__*/function (_Widget) {
  function TrackView(element, config) {
    var _config$rootMargin;
    var _this;
    _classCallCheck(this, TrackView);
    _this = _callSuper(this, TrackView, [element, {
      id: DUMMY_ID
    }]);
    var watcher = ViewWatcher.reuse({
      root: config === null || config === void 0 ? void 0 : config.root,
      rootMargin: config === null || config === void 0 || (_config$rootMargin = config.rootMargin) === null || _config$rootMargin === void 0 ? void 0 : _config$rootMargin.replace(/,/g, " "),
      threshold: config === null || config === void 0 ? void 0 : config.threshold
    });
    watcher.trackView(element, null, config);
    _this.onDestroy(function () {
      return watcher.noTrackView(element);
    });
    return _this;
  }
  _inherits(TrackView, _Widget);
  return _createClass(TrackView, null, [{
    key: "get",
    value: function get(element) {
      var instance = _superPropGet(TrackView, "get", this, 2)([element, DUMMY_ID]);
      if (MH.isInstanceOf(instance, TrackView)) {
        return instance;
      }
      return null;
    }
  }, {
    key: "register",
    value: function register() {
      registerWidget(WIDGET_NAME, function (element, config) {
        if (!TrackView.get(element)) {
          return new TrackView(element, config);
        }
        return null;
      }, newConfigValidator);
    }
  }]);
}(Widget);

/**
 * @interface
 */

// --------------------

var WIDGET_NAME = "track-view";
// Only one TrackView widget per element is allowed, but Widget requires a
// non-blank ID.
var DUMMY_ID = WIDGET_NAME;
var newConfigValidator = function newConfigValidator(element) {
  return {
    root: function root(key, value) {
      var _ref;
      return (_ref = MH.isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    },
    rootMargin: validateString,
    threshold: function threshold(key, value) {
      return validateNumList(key, value);
    },
    debounceWindow: validateNumber,
    resizeThreshold: validateNumber,
    scrollThreshold: validateNumber
  };
};
//# sourceMappingURL=track-view.js.map