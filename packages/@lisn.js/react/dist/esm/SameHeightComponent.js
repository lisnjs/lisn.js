"use client";

const _excluded = ["as", "children", "config", "widgetRef"],
  _excluded2 = ["type", "as", "children"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import { createElement } from "react";
import { SameHeight } from "lisn.js";
import { useWidget } from "./useWidget";
import { getElementsFromRefs } from "./util";
export const SameHeightComponent = _ref => {
  let {
      as,
      children,
      config,
      widgetRef
    } = _ref,
    props = _objectWithoutProperties(_ref, _excluded);
  const elementRef = useWidget(newSameHeight, config, widgetRef);
  return createElement(as || "div", _objectSpread({
    ref: elementRef
  }, props), children);
};
export const SameHeightItemComponent = _ref2 => {
  let {
      type,
      as,
      children
    } = _ref2,
    props = _objectWithoutProperties(_ref2, _excluded2);
  return createElement(as || "div", _objectSpread({
    ["data-lisn-same-height-item"]: type !== null && type !== void 0 ? type : ""
  }, props), children);
};

// --------------------

const newSameHeight = (element, config) => element instanceof HTMLElement ? new SameHeight(element, Object.assign({}, config, {
  items: getElementsFromRefs(config === null || config === void 0 ? void 0 : config.items)
})) : null;
//# sourceMappingURL=SameHeightComponent.js.map