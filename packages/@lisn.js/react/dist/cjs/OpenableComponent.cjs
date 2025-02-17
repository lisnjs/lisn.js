"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PopupTriggerComponent = exports.PopupComponent = exports.OffcanvasTriggerComponent = exports.OffcanvasComponent = exports.ModalTriggerComponent = exports.ModalComponent = exports.CollapsibleTriggerComponent = exports.CollapsibleComponent = void 0;
var _react = require("react");
var _lisn = require("lisn.js");
var _useWidget = require("./useWidget");
var _util = require("./util");
const _excluded = ["config", "widgetRef"],
  _excluded2 = ["config", "widgetRef"],
  _excluded3 = ["config", "widgetRef"],
  _excluded4 = ["config", "widgetRef"],
  _excluded5 = ["name", "as", "children", "config", "contentId"],
  _excluded6 = ["name", "as", "contentId", "elementRef", "className", "children"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
const CollapsibleComponent = _ref => {
  let {
      config,
      widgetRef
    } = _ref,
    props = _objectWithoutProperties(_ref, _excluded);
  const elementRef = useOpenable(newCollapsible, config, widgetRef);
  return createOpenableElement(_objectSpread({
    name: "collapsible",
    elementRef
  }, props));
};
exports.CollapsibleComponent = CollapsibleComponent;
const newCollapsible = (element, config) => element instanceof HTMLElement ? new _lisn.Collapsible(element, Object.assign({}, config, {
  triggers: (0, _util.getElementsFromRefs)(config === null || config === void 0 ? void 0 : config.triggers)
})) : null;

// ----------

const PopupComponent = _ref2 => {
  let {
      config,
      widgetRef
    } = _ref2,
    props = _objectWithoutProperties(_ref2, _excluded2);
  const elementRef = useOpenable(newPopup, config, widgetRef);
  return createOpenableElement(_objectSpread({
    name: "popup",
    elementRef
  }, props));
};
exports.PopupComponent = PopupComponent;
const newPopup = (element, config) => element instanceof HTMLElement ? new _lisn.Popup(element, Object.assign({}, config, {
  triggers: (0, _util.getElementsFromRefs)(config === null || config === void 0 ? void 0 : config.triggers)
})) : null;

// ----------

const ModalComponent = _ref3 => {
  let {
      config,
      widgetRef
    } = _ref3,
    props = _objectWithoutProperties(_ref3, _excluded3);
  const elementRef = useOpenable(newModal, config, widgetRef);
  return createOpenableElement(_objectSpread({
    name: "modal",
    elementRef
  }, props));
};
exports.ModalComponent = ModalComponent;
const newModal = (element, config) => element instanceof HTMLElement ? new _lisn.Modal(element, Object.assign({}, config, {
  triggers: (0, _util.getElementsFromRefs)(config === null || config === void 0 ? void 0 : config.triggers)
})) : null;

// ----------

const OffcanvasComponent = _ref4 => {
  let {
      config,
      widgetRef
    } = _ref4,
    props = _objectWithoutProperties(_ref4, _excluded4);
  const elementRef = useOpenable(newOffcanvas, config, widgetRef);
  return createOpenableElement(_objectSpread({
    name: "offcanvas",
    elementRef
  }, props));
};
exports.OffcanvasComponent = OffcanvasComponent;
const newOffcanvas = (element, config) => element instanceof HTMLElement ? new _lisn.Offcanvas(element, Object.assign({}, config, {
  triggers: (0, _util.getElementsFromRefs)(config === null || config === void 0 ? void 0 : config.triggers)
})) : null;

// ----------

const CollapsibleTriggerComponent = allProps => TriggerComponent(_objectSpread({
  name: "collapsible"
}, allProps));
exports.CollapsibleTriggerComponent = CollapsibleTriggerComponent;
const PopupTriggerComponent = allProps => TriggerComponent(_objectSpread({
  name: "popup"
}, allProps));
exports.PopupTriggerComponent = PopupTriggerComponent;
const ModalTriggerComponent = allProps => TriggerComponent(_objectSpread({
  name: "modal"
}, allProps));
exports.ModalTriggerComponent = ModalTriggerComponent;
const OffcanvasTriggerComponent = allProps => TriggerComponent(_objectSpread({
  name: "offcanvas"
}, allProps));
exports.OffcanvasTriggerComponent = OffcanvasTriggerComponent;
const TriggerComponent = _ref5 => {
  let {
      name,
      as,
      children,
      config,
      contentId
    } = _ref5,
    props = _objectWithoutProperties(_ref5, _excluded5);
  // Since a trigger config object can only be passed as part of the widget
  // configuration (in a trigger map) and that is created in another component,
  // we have to use data attributes to pass the config.
  let configStr = "";
  let prop;
  config = config || {};
  for (prop in config) {
    configStr += (configStr ? "|" : "") + prop + "=" + String(config[prop]);
  }
  return (0, _react.createElement)(as || "div", _objectSpread(_objectSpread({
    [`data-lisn-${name}-trigger`]: configStr
  }, contentId ? {
    [`data-lisn-${name}-content-id`]: contentId
  } : {}), props), children);
};

// --------------------

const useOpenable = (newWidget, config, widgetRef) => {
  const elementRef = (0, _useWidget.useWidget)(newWidget, config, widgetRef);
  (0, _react.useEffect)(() => {
    const element = elementRef.current;
    if (element instanceof Element) {
      element.classList.remove("lisn-undisplay");
    }
  }, [elementRef]);
  return elementRef;
};
const createOpenableElement = _ref6 => {
  let {
      name,
      as,
      contentId,
      elementRef,
      className,
      children
    } = _ref6,
    baseProps = _objectWithoutProperties(_ref6, _excluded6);
  return (0, _react.createElement)(as || "div", _objectSpread(_objectSpread({
    ref: elementRef
  }, contentId ? {
    [`data-lisn-${name}-content-id`]: contentId
  } : {}), {}, {
    className: [className !== null && className !== void 0 ? className : "", "lisn-undisplay"].join(" ")
  }, baseProps), children);
};
//# sourceMappingURL=OpenableComponent.cjs.map