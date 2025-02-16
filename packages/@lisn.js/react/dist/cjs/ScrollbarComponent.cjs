"use strict";
"use client";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useScrollbar = exports.ScrollbarComponent = void 0;
var _react = require("react");
var _lisn = require("lisn.js");
var _useWidget = require("./useWidget");
var _useDeepMemo = require("./useDeepMemo");
var _excluded = ["as", "children", "config", "widgetRef", "className"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var ScrollbarComponent = exports.ScrollbarComponent = function ScrollbarComponent(_ref) {
  var _config$hideNative;
  var as = _ref.as,
    children = _ref.children,
    config = _ref.config,
    widgetRef = _ref.widgetRef,
    className = _ref.className,
    props = _objectWithoutProperties(_ref, _excluded);
  var elementRef = (0, _useWidget.useWidget)(newScrollbar, config, widgetRef);
  return (0, _react.createElement)(as || "div", _objectSpread({
    ref: elementRef,
    className: [className !== null && className !== void 0 ? className : "", ((_config$hideNative = config === null || config === void 0 ? void 0 : config.hideNative) !== null && _config$hideNative !== void 0 ? _config$hideNative : _lisn.settings.scrollbarHideNative) ? "lisn-hide-scroll" : ""].join(" ")
  }, props), children);
};
var useScrollbar = exports.useScrollbar = function useScrollbar(config) {
  var widgetRef = (0, _react.useRef)(null);
  var configMemo = (0, _useDeepMemo.useDeepMemo)(config);
  (0, _react.useEffect)(function () {
    var widgetPromise = _lisn.Scrollbar.enableMain(configMemo);
    widgetPromise.then(function (widget) {
      widgetRef.current = widget;
    });
    return function () {
      widgetPromise.then(function (widget) {
        return widget.destroy();
      });
    };
  }, [configMemo]);
  return {
    getWidget: function getWidget() {
      return widgetRef.current;
    }
  };
};

// ----------

var newScrollbar = function newScrollbar(element, config) {
  return element instanceof HTMLElement ? new _lisn.Scrollbar(element, config) : null;
};
//# sourceMappingURL=ScrollbarComponent.cjs.map