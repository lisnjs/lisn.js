"use client";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _excluded = ["config", "widgetRef"],
  _excluded2 = ["config", "widgetRef"],
  _excluded3 = ["config", "widgetRef"],
  _excluded4 = ["config", "widgetRef"],
  _excluded5 = ["name", "as", "children", "config", "contentId"],
  _excluded6 = ["name", "as", "contentId", "elementRef", "className", "children"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import { useEffect, createElement } from "react";
import { Collapsible, Popup, Modal, Offcanvas } from "lisn.js";
import { useWidget } from "./useWidget";
import { getElementsFromRefs } from "./util";
export var CollapsibleComponent = function CollapsibleComponent(_ref) {
  var config = _ref.config,
    widgetRef = _ref.widgetRef,
    props = _objectWithoutProperties(_ref, _excluded);
  var elementRef = useOpenable(newCollapsible, config, widgetRef);
  return createOpenableElement(_objectSpread({
    name: "collapsible",
    elementRef: elementRef
  }, props));
};
var newCollapsible = function newCollapsible(element, config) {
  return element instanceof HTMLElement ? new Collapsible(element, Object.assign({}, config, {
    triggers: getElementsFromRefs(config === null || config === void 0 ? void 0 : config.triggers)
  })) : null;
};

// ----------

export var PopupComponent = function PopupComponent(_ref2) {
  var config = _ref2.config,
    widgetRef = _ref2.widgetRef,
    props = _objectWithoutProperties(_ref2, _excluded2);
  var elementRef = useOpenable(newPopup, config, widgetRef);
  return createOpenableElement(_objectSpread({
    name: "popup",
    elementRef: elementRef
  }, props));
};
var newPopup = function newPopup(element, config) {
  return element instanceof HTMLElement ? new Popup(element, Object.assign({}, config, {
    triggers: getElementsFromRefs(config === null || config === void 0 ? void 0 : config.triggers)
  })) : null;
};

// ----------

export var ModalComponent = function ModalComponent(_ref3) {
  var config = _ref3.config,
    widgetRef = _ref3.widgetRef,
    props = _objectWithoutProperties(_ref3, _excluded3);
  var elementRef = useOpenable(newModal, config, widgetRef);
  return createOpenableElement(_objectSpread({
    name: "modal",
    elementRef: elementRef
  }, props));
};
var newModal = function newModal(element, config) {
  return element instanceof HTMLElement ? new Modal(element, Object.assign({}, config, {
    triggers: getElementsFromRefs(config === null || config === void 0 ? void 0 : config.triggers)
  })) : null;
};

// ----------

export var OffcanvasComponent = function OffcanvasComponent(_ref4) {
  var config = _ref4.config,
    widgetRef = _ref4.widgetRef,
    props = _objectWithoutProperties(_ref4, _excluded4);
  var elementRef = useOpenable(newOffcanvas, config, widgetRef);
  return createOpenableElement(_objectSpread({
    name: "offcanvas",
    elementRef: elementRef
  }, props));
};
var newOffcanvas = function newOffcanvas(element, config) {
  return element instanceof HTMLElement ? new Offcanvas(element, Object.assign({}, config, {
    triggers: getElementsFromRefs(config === null || config === void 0 ? void 0 : config.triggers)
  })) : null;
};

// ----------

export var CollapsibleTriggerComponent = function CollapsibleTriggerComponent(allProps) {
  return TriggerComponent(_objectSpread({
    name: "collapsible"
  }, allProps));
};
export var PopupTriggerComponent = function PopupTriggerComponent(allProps) {
  return TriggerComponent(_objectSpread({
    name: "popup"
  }, allProps));
};
export var ModalTriggerComponent = function ModalTriggerComponent(allProps) {
  return TriggerComponent(_objectSpread({
    name: "modal"
  }, allProps));
};
export var OffcanvasTriggerComponent = function OffcanvasTriggerComponent(allProps) {
  return TriggerComponent(_objectSpread({
    name: "offcanvas"
  }, allProps));
};
var TriggerComponent = function TriggerComponent(_ref5) {
  var name = _ref5.name,
    as = _ref5.as,
    children = _ref5.children,
    config = _ref5.config,
    contentId = _ref5.contentId,
    props = _objectWithoutProperties(_ref5, _excluded5);
  // Since a trigger config object can only be passed as part of the widget
  // configuration (in a trigger map) and that is created in another component,
  // we have to use data attributes to pass the config.
  var configStr = "";
  var prop;
  config = config || {};
  for (prop in config) {
    configStr += (configStr ? "|" : "") + prop + "=" + String(config[prop]);
  }
  return createElement(as || "div", _objectSpread(_objectSpread(_defineProperty({}, "data-lisn-".concat(name, "-trigger"), configStr), contentId ? _defineProperty({}, "data-lisn-".concat(name, "-content-id"), contentId) : {}), props), children);
};

// --------------------

var useOpenable = function useOpenable(newWidget, config, widgetRef) {
  var elementRef = useWidget(newWidget, config, widgetRef);
  useEffect(function () {
    var element = elementRef.current;
    if (element instanceof Element) {
      element.classList.remove("lisn-undisplay");
    }
  }, [elementRef]);
  return elementRef;
};
var createOpenableElement = function createOpenableElement(_ref7) {
  var name = _ref7.name,
    as = _ref7.as,
    contentId = _ref7.contentId,
    elementRef = _ref7.elementRef,
    className = _ref7.className,
    children = _ref7.children,
    baseProps = _objectWithoutProperties(_ref7, _excluded6);
  return createElement(as || "div", _objectSpread(_objectSpread({
    ref: elementRef
  }, contentId ? _defineProperty({}, "data-lisn-".concat(name, "-content-id"), contentId) : {}), {}, {
    className: [className !== null && className !== void 0 ? className : "", "lisn-undisplay"].join(" ")
  }, baseProps), children);
};
//# sourceMappingURL=OpenableComponent.js.map