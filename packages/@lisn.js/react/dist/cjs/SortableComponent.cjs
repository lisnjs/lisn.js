"use strict";
"use client";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortableItemComponent = exports.SortableComponent = void 0;
var _react = require("react");
var _lisn = require("lisn.js");
var _useWidget = require("./useWidget");
var _util = require("./util");
var _excluded = ["as", "children", "config", "widgetRef"],
  _excluded2 = ["as", "children"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var SortableComponent = exports.SortableComponent = function SortableComponent(_ref) {
  var as = _ref.as,
    children = _ref.children,
    config = _ref.config,
    widgetRef = _ref.widgetRef,
    props = _objectWithoutProperties(_ref, _excluded);
  var elementRef = (0, _useWidget.useWidget)(newSortable, config, widgetRef);
  return (0, _react.createElement)(as || "div", _objectSpread({
    ref: elementRef
  }, props), children);
};
var SortableItemComponent = exports.SortableItemComponent = function SortableItemComponent(_ref2) {
  var as = _ref2.as,
    children = _ref2.children,
    props = _objectWithoutProperties(_ref2, _excluded2);
  return (0, _react.createElement)(as || "div", _objectSpread(_defineProperty({}, "data-lisn-sortable-item", ""), props), children);
};

// --------------------

var newSortable = function newSortable(element, config) {
  return new _lisn.Sortable(element, Object.assign({}, config, {
    items: (0, _util.getElementsFromRefs)(config === null || config === void 0 ? void 0 : config.items)
  }));
};
//# sourceMappingURL=SortableComponent.cjs.map