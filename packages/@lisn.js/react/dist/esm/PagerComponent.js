"use client";

const _excluded = ["as", "children", "config", "widgetRef"],
  _excluded2 = ["as", "children", "className"],
  _excluded3 = ["as", "children"],
  _excluded4 = ["as", "children"],
  _excluded5 = ["as", "children"],
  _excluded6 = ["as", "children"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import { useEffect, useRef, createElement } from "react";
import { Pager } from "lisn.js";
import { useWidget } from "./useWidget";
import { getElementsFromRefs } from "./util";
export const PagerComponent = _ref => {
  let {
      as,
      children,
      config,
      widgetRef
    } = _ref,
    props = _objectWithoutProperties(_ref, _excluded);
  const elementRef = useWidget(newPager, config, widgetRef);
  return createElement(as || "div", _objectSpread({
    ref: elementRef
  }, props), children);
};
export const PagerPageComponent = _ref2 => {
  let {
      as,
      children,
      className
    } = _ref2,
    props = _objectWithoutProperties(_ref2, _excluded2);
  const elementRef = useRef(null);
  useEffect(() => {
    const element = elementRef.current;
    if (element instanceof Element) {
      element.classList.remove("lisn-undisplay");
    }
  }, [elementRef]);
  return createElement(as || "div", _objectSpread({
    ["data-lisn-pager-page"]: "",
    ref: elementRef,
    className: [className !== null && className !== void 0 ? className : "", "lisn-undisplay"].join(" ")
  }, props), children);
};
export const PagerToggleComponent = _ref3 => {
  let {
      as,
      children
    } = _ref3,
    props = _objectWithoutProperties(_ref3, _excluded3);
  return createElement(as || "div", _objectSpread({
    ["data-lisn-pager-toggle"]: ""
  }, props), children);
};
export const PagerSwitchComponent = _ref4 => {
  let {
      as,
      children
    } = _ref4,
    props = _objectWithoutProperties(_ref4, _excluded4);
  return createElement(as || "div", _objectSpread({
    ["data-lisn-pager-switch"]: ""
  }, props), children);
};
export const PagerPrevSwitchComponent = _ref5 => {
  let {
      as,
      children
    } = _ref5,
    props = _objectWithoutProperties(_ref5, _excluded5);
  return createElement(as || "div", _objectSpread({
    ["data-lisn-pager-prev-switch"]: ""
  }, props), children);
};
export const PagerNextSwitchComponent = _ref6 => {
  let {
      as,
      children
    } = _ref6,
    props = _objectWithoutProperties(_ref6, _excluded6);
  return createElement(as || "div", _objectSpread({
    ["data-lisn-pager-next-switch"]: ""
  }, props), children);
};

// --------------------

const newPager = (element, config) => new Pager(element, Object.assign({}, config, {
  pages: getElementsFromRefs(config === null || config === void 0 ? void 0 : config.pages),
  toggles: getElementsFromRefs(config === null || config === void 0 ? void 0 : config.toggles),
  switches: getElementsFromRefs(config === null || config === void 0 ? void 0 : config.switches)
}));
//# sourceMappingURL=PagerComponent.js.map