function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * For minification optimization
 *
 * @module
 * @ignore
 * @internal
 */

import * as MC from "./minification-constants.js";
import { LisnUsageError, LisnBugError } from "./errors.js";

// credit: underscore.js
var root = (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" && self.self === self && self || (typeof global === "undefined" ? "undefined" : _typeof(global)) == "object" && global.global === global && global || Function("return this")() || {};
export var kebabToCamelCase = function kebabToCamelCase(str) {
  return str.replace(/-./g, function (m) {
    return toUpperCase(m.charAt(1));
  });
};
export var camelToKebabCase = function camelToKebabCase(str) {
  return str.replace(/[A-Z][a-z]/g, function (m) {
    return "-" + toLowerCase(m);
  }).replace(/[A-Z]+/, function (m) {
    return "-" + toLowerCase(m);
  });
};
export var prefixName = function prefixName(name) {
  return "".concat(MC.PREFIX, "-").concat(name);
};
export var prefixCssVar = function prefixCssVar(name) {
  return "--" + prefixName(name);
};
export var prefixCssJsVar = function prefixCssJsVar(name) {
  return prefixCssVar("js--" + name);
};
export var prefixData = function prefixData(name) {
  return "data-".concat(camelToKebabCase(name));
};
export var prefixLisnData = function prefixLisnData(name) {
  return prefixData(prefixName(name));
};
export var toLowerCase = function toLowerCase(s) {
  return s.toLowerCase();
};
export var toUpperCase = function toUpperCase(s) {
  return s.toUpperCase();
};
export var timeNow = Date.now.bind(Date);
export var timeSince = function timeSince(startTime) {
  return timeNow() - startTime;
};
export var hasDOM = function hasDOM() {
  return typeof document !== "undefined";
};
export var getWindow = function getWindow() {
  return window;
};
export var getDoc = function getDoc() {
  return document;
};
export var getDocElement = function getDocElement() {
  return getDoc().documentElement;
};
export var getDocScrollingElement = function getDocScrollingElement() {
  return getDoc().scrollingElement;
};
export var getBody = function getBody() {
  return getDoc().body;
};
export var getReadyState = function getReadyState() {
  return getDoc().readyState;
};
export var getPointerType = function getPointerType(event) {
  return isPointerEvent(event) ? event.pointerType : isMouseEvent(event) ? "mouse" : null;
};
export var onAnimationFrame = hasDOM() ? root.requestAnimationFrame.bind(root) : function () {};
export var createElement = function createElement(tagName, options) {
  return getDoc().createElement(tagName, options);
};
export var createButton = function createButton() {
  var label = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var tag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "button";
  var btn = createElement(tag);
  setTabIndex(btn);
  setAttr(btn, MC.S_ROLE, "button");
  setAttr(btn, MC.ARIA_PREFIX + "label", label);
  return btn;
};
export var isNullish = function isNullish(v) {
  return v === undefined || v === null;
};
export var isEmpty = function isEmpty(v) {
  return isNullish(v) || v === "";
};
export var isIterableObject = function isIterableObject(v) {
  return isNonPrimitive(v) && MC.SYMBOL.iterator in v;
};
export var isArray = function isArray(v) {
  return isInstanceOf(v, MC.ARRAY);
};
export var isObject = function isObject(v) {
  return isInstanceOf(v, MC.OBJECT);
};
export var isNonPrimitive = function isNonPrimitive(v) {
  return v !== null && typeOf(v) === "object";
};

// only primitive number
export var isNumber = function isNumber(v) {
  return typeOf(v) === "number";
};

/* eslint-disable-next-line @typescript-eslint/no-wrapper-object-types */
export var isString = function isString(v) {
  return typeOf(v) === "string" || isInstanceOf(v, MC.STRING);
};
export var isLiteralString = function isLiteralString(v) {
  return typeOf(v) === "string";
};
export var isBoolean = function isBoolean(v) {
  return typeOf(v) === "boolean";
};

/* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type */
export var isFunction = function isFunction(v) {
  return typeOf(v) === "function" || isInstanceOf(v, MC.FUNCTION);
};
export var isDoc = function isDoc(target) {
  return target === getDoc();
};
export var isMouseEvent = function isMouseEvent(event) {
  return isInstanceOf(event, MouseEvent);
};
export var isPointerEvent = function isPointerEvent(event) {
  return isInstanceOf(event, PointerEvent);
};
export var isTouchPointerEvent = function isTouchPointerEvent(event) {
  return isPointerEvent(event) && getPointerType(event) === MC.S_TOUCH;
};
export var isWheelEvent = function isWheelEvent(event) {
  return isInstanceOf(event, WheelEvent);
};
export var isKeyboardEvent = function isKeyboardEvent(event) {
  return isInstanceOf(event, KeyboardEvent);
};
export var isTouchEvent = function isTouchEvent(event) {
  return isInstanceOf(event, TouchEvent);
};
export var isNode = function isNode(target) {
  return isInstanceOf(target, Node);
};
export var isElement = function isElement(target) {
  return isInstanceOf(target, Element);
};
export var isHTMLElement = function isHTMLElement(target) {
  return isInstanceOf(target, HTMLElement);
};
export var isNodeBAfterA = function isNodeBAfterA(nodeA, nodeB) {
  return (nodeA.compareDocumentPosition(nodeB) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
};
export var strReplace = function strReplace(s, match, replacement) {
  return s.replace(match, replacement);
};
export var setTimer = root.setTimeout.bind(root);
export var clearTimer = root.clearTimeout.bind(root);
export var getBoundingClientRect = function getBoundingClientRect(el) {
  return el.getBoundingClientRect();
};

// Copy size properties explicitly to another object so they can be used with
// the spread operator (DOMRect/DOMRectReadOnly's properties are not enumerable)
export var copyBoundingRectProps = function copyBoundingRectProps(rect) {
  return _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({
    x: rect.x,
    left: rect.left,
    right: rect.right
  }, MC.S_WIDTH, rect[MC.S_WIDTH]), "y", rect.y), "top", rect.top), "bottom", rect.bottom), MC.S_HEIGHT, rect[MC.S_HEIGHT]);
};
export var querySelector = function querySelector(root, selector) {
  return root.querySelector(selector);
};
export var querySelectorAll = function querySelectorAll(root, selector) {
  return root.querySelectorAll(selector);
};
export var docQuerySelector = function docQuerySelector(selector) {
  return querySelector(getDoc(), selector);
};
export var docQuerySelectorAll = function docQuerySelectorAll(selector) {
  return querySelectorAll(getDoc(), selector);
};
export var getElementById = function getElementById(id) {
  return getDoc().getElementById(id);
};
export var getAttr = function getAttr(el, name) {
  return el.getAttribute(name);
};
export var setAttr = function setAttr(el, name) {
  var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "true";
  return el.setAttribute(name, value);
};
export var unsetAttr = function unsetAttr(el, name) {
  return el.setAttribute(name, "false");
};
export var delAttr = function delAttr(el, name) {
  return el.removeAttribute(name);
};
export var includes = function includes(arr, v, startAt) {
  return arr.indexOf(v, startAt) >= 0;
};
export var filter = function filter(array, filterFn) {
  return array.filter(filterFn);
};
export var filterBlank = function filterBlank(array) {
  var result = array ? filter(array, function (v) {
    return !isEmpty(v);
  }) : undefined;
  return lengthOf(result) ? result : undefined;
};
export var sizeOf = function sizeOf(obj) {
  var _obj$size;
  return (_obj$size = obj === null || obj === void 0 ? void 0 : obj.size) !== null && _obj$size !== void 0 ? _obj$size : 0;
};
export var lengthOf = function lengthOf(obj) {
  var _obj$length;
  return (_obj$length = obj === null || obj === void 0 ? void 0 : obj.length) !== null && _obj$length !== void 0 ? _obj$length : 0;
};
export var tagName = function tagName(el) {
  return el.tagName;
};
export var preventDefault = function preventDefault(event) {
  return event.preventDefault();
};
export var arrayFrom = MC.ARRAY.from.bind(MC.ARRAY);
export var keysOf = function keysOf(obj) {
  return MC.OBJECT.keys(obj);
};
export var defineProperty = MC.OBJECT.defineProperty.bind(MC.OBJECT);

// use it in place of object spread
export var merge = function merge() {
  var _MC$OBJECT;
  for (var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++) {
    a[_key] = arguments[_key];
  }
  return (_MC$OBJECT = MC.OBJECT).assign.apply(_MC$OBJECT, [{}].concat(a));
};
export var copyObject = function copyObject(obj) {
  return merge(obj);
};
export var promiseResolve = MC.PROMISE.resolve.bind(MC.PROMISE);
export var promiseAll = MC.PROMISE.all.bind(MC.PROMISE);
export var assign = MC.OBJECT.assign.bind(MC.OBJECT);
export var freezeObj = MC.OBJECT.freeze.bind(MC.OBJECT);
export var hasOwnProp = function hasOwnProp(o, prop) {
  return MC.OBJECT.prototype.hasOwnProperty.call(o, prop);
};
export var preventExtensions = MC.OBJECT.preventExtensions.bind(MC.OBJECT);
export var stringify = JSON.stringify.bind(JSON);
export var floor = MC.MATH.floor.bind(MC.MATH);
export var ceil = MC.MATH.ceil.bind(MC.MATH);
export var log2 = MC.MATH.log2.bind(MC.MATH);
export var sqrt = MC.MATH.sqrt.bind(MC.MATH);
export var max = MC.MATH.max.bind(MC.MATH);
export var min = MC.MATH.min.bind(MC.MATH);
export var abs = MC.MATH.abs.bind(MC.MATH);
export var round = MC.MATH.round.bind(MC.MATH);
export var pow = MC.MATH.pow.bind(MC.MATH);
export var parseFloat = MC.NUMBER.parseFloat.bind(MC.NUMBER);
export var isNaN = MC.NUMBER.isNaN.bind(MC.NUMBER);
export var isInstanceOf = function isInstanceOf(value, Class) {
  return value instanceof Class;
};
export var constructorOf = function constructorOf(obj) {
  return obj.constructor;
};
export var typeOf = function typeOf(obj) {
  return _typeof(obj);
};
export var typeOrClassOf = function typeOrClassOf(obj) {
  var _constructorOf;
  return isObject(obj) ? (_constructorOf = constructorOf(obj)) === null || _constructorOf === void 0 ? void 0 : _constructorOf.name : typeOf(obj);
};
export var parentOf = function parentOf(element) {
  return (element === null || element === void 0 ? void 0 : element.parentElement) || null;
};
export var childrenOf = function childrenOf(element) {
  return (element === null || element === void 0 ? void 0 : element.children) || [];
};
export var targetOf = function targetOf(obj) {
  return obj === null || obj === void 0 ? void 0 : obj.target;
};
export var currentTargetOf = function currentTargetOf(obj) {
  return obj === null || obj === void 0 ? void 0 : obj.currentTarget;
};
export var classList = function classList(el) {
  return el === null || el === void 0 ? void 0 : el.classList;
};
var S_TABINDEX = "tabindex";
export var getTabIndex = function getTabIndex(el) {
  return getAttr(el, S_TABINDEX);
};
export var setTabIndex = function setTabIndex(el) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0";
  return setAttr(el, S_TABINDEX, index);
};
export var unsetTabIndex = function unsetTabIndex(el) {
  return delAttr(el, S_TABINDEX);
};
export var remove = function remove(obj) {
  return obj === null || obj === void 0 ? void 0 : obj.remove();
};
export var deleteObjKey = function deleteObjKey(obj, key) {
  return delete obj[key];
};
export var deleteKey = function deleteKey(map, key) {
  return map === null || map === void 0 ? void 0 : map["delete"](key);
};
export var elScrollTo = function elScrollTo(el, coords) {
  var behavior = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "instant";
  return el.scrollTo(merge({
    behavior: behavior
  }, coords));
};
export var elScrollBy = function elScrollBy(el, coords) {
  var behavior = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "instant";
  return el.scrollBy(merge({
    behavior: behavior
  }, coords));
};
export var newPromise = function newPromise(executor) {
  return new Promise(executor);
};
export var newMap = function newMap(entries) {
  return new Map(entries);
};
export var newWeakMap = function newWeakMap(entries) {
  return new WeakMap(entries);
};
export var newSet = function newSet(values) {
  return new Set(values);
};
export var newWeakSet = function newWeakSet(values) {
  return new WeakSet(values);
};
export var newIntersectionObserver = function newIntersectionObserver(callback, options) {
  return new IntersectionObserver(callback, options);
};
export var newResizeObserver = function newResizeObserver(callback) {
  return typeof ResizeObserver === "undefined" ? null : new ResizeObserver(callback);
};
export var newMutationObserver = function newMutationObserver(callback) {
  return new MutationObserver(callback);
};
export var usageError = function usageError(msg) {
  return new LisnUsageError(msg);
};
export var bugError = function bugError(msg) {
  return new LisnBugError(msg);
};
export var illegalConstructorError = function illegalConstructorError(useWhat) {
  return usageError("Illegal constructor. Use ".concat(useWhat, "."));
};
var CONSOLE = console;
export var consoleDebug = CONSOLE.debug.bind(CONSOLE);
export var consoleLog = CONSOLE.log.bind(CONSOLE);
export var consoleInfo = CONSOLE.info.bind(CONSOLE);
export var consoleWarn = CONSOLE.warn.bind(CONSOLE);
export var consoleError = CONSOLE.error.bind(CONSOLE);

// --------------------
//# sourceMappingURL=minification-helpers.js.map