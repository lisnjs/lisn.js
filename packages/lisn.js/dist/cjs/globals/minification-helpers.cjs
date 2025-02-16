"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.querySelector = exports.promiseResolve = exports.promiseAll = exports.preventExtensions = exports.preventDefault = exports.prefixName = exports.prefixLisnData = exports.prefixData = exports.prefixCssVar = exports.prefixCssJsVar = exports.pow = exports.parseFloat = exports.parentOf = exports.onAnimationFrame = exports.newWeakSet = exports.newWeakMap = exports.newSet = exports.newResizeObserver = exports.newPromise = exports.newMutationObserver = exports.newMap = exports.newIntersectionObserver = exports.min = exports.merge = exports.max = exports.log2 = exports.lengthOf = exports.keysOf = exports.kebabToCamelCase = exports.isWheelEvent = exports.isTouchPointerEvent = exports.isTouchEvent = exports.isString = exports.isPointerEvent = exports.isObject = exports.isNumber = exports.isNullish = exports.isNonPrimitive = exports.isNodeBAfterA = exports.isNode = exports.isNaN = exports.isMouseEvent = exports.isLiteralString = exports.isKeyboardEvent = exports.isIterableObject = exports.isInstanceOf = exports.isHTMLElement = exports.isFunction = exports.isEmpty = exports.isElement = exports.isDoc = exports.isBoolean = exports.isArray = exports.includes = exports.illegalConstructorError = exports.hasOwnProp = exports.hasDOM = exports.getWindow = exports.getTabIndex = exports.getReadyState = exports.getPointerType = exports.getElementById = exports.getDocScrollingElement = exports.getDocElement = exports.getDoc = exports.getBoundingClientRect = exports.getBody = exports.getAttr = exports.freezeObj = exports.floor = exports.filterBlank = exports.filter = exports.elScrollTo = exports.elScrollBy = exports.docQuerySelectorAll = exports.docQuerySelector = exports.deleteObjKey = exports.deleteKey = exports.delAttr = exports.defineProperty = exports.currentTargetOf = exports.createElement = exports.createButton = exports.copyObject = exports.copyBoundingRectProps = exports.constructorOf = exports.consoleWarn = exports.consoleLog = exports.consoleInfo = exports.consoleError = exports.consoleDebug = exports.clearTimer = exports.classList = exports.childrenOf = exports.ceil = exports.camelToKebabCase = exports.bugError = exports.assign = exports.arrayFrom = exports.abs = void 0;
exports.usageError = exports.unsetTabIndex = exports.unsetAttr = exports.typeOrClassOf = exports.typeOf = exports.toUpperCase = exports.toLowerCase = exports.timeSince = exports.timeNow = exports.targetOf = exports.tagName = exports.stringify = exports.strReplace = exports.sqrt = exports.sizeOf = exports.setTimer = exports.setTabIndex = exports.setAttr = exports.round = exports.remove = exports.querySelectorAll = void 0;
var MC = _interopRequireWildcard(require("./minification-constants.cjs"));
var _errors = require("./errors.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); } /**
 * For minification optimization
 *
 * @module
 * @ignore
 * @internal
 */
// credit: underscore.js
var root = (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" && self.self === self && self || (typeof global === "undefined" ? "undefined" : _typeof(global)) == "object" && global.global === global && global || Function("return this")() || {};
var kebabToCamelCase = exports.kebabToCamelCase = function kebabToCamelCase(str) {
  return str.replace(/-./g, function (m) {
    return toUpperCase(m.charAt(1));
  });
};
var camelToKebabCase = exports.camelToKebabCase = function camelToKebabCase(str) {
  return str.replace(/[A-Z][a-z]/g, function (m) {
    return "-" + toLowerCase(m);
  }).replace(/[A-Z]+/, function (m) {
    return "-" + toLowerCase(m);
  });
};
var prefixName = exports.prefixName = function prefixName(name) {
  return "".concat(MC.PREFIX, "-").concat(name);
};
var prefixCssVar = exports.prefixCssVar = function prefixCssVar(name) {
  return "--" + prefixName(name);
};
var prefixCssJsVar = exports.prefixCssJsVar = function prefixCssJsVar(name) {
  return prefixCssVar("js--" + name);
};
var prefixData = exports.prefixData = function prefixData(name) {
  return "data-".concat(camelToKebabCase(name));
};
var prefixLisnData = exports.prefixLisnData = function prefixLisnData(name) {
  return prefixData(prefixName(name));
};
var toLowerCase = exports.toLowerCase = function toLowerCase(s) {
  return s.toLowerCase();
};
var toUpperCase = exports.toUpperCase = function toUpperCase(s) {
  return s.toUpperCase();
};
var timeNow = exports.timeNow = Date.now.bind(Date);
var timeSince = exports.timeSince = function timeSince(startTime) {
  return timeNow() - startTime;
};
var hasDOM = exports.hasDOM = function hasDOM() {
  return typeof document !== "undefined";
};
var getWindow = exports.getWindow = function getWindow() {
  return window;
};
var getDoc = exports.getDoc = function getDoc() {
  return document;
};
var getDocElement = exports.getDocElement = function getDocElement() {
  return getDoc().documentElement;
};
var getDocScrollingElement = exports.getDocScrollingElement = function getDocScrollingElement() {
  return getDoc().scrollingElement;
};
var getBody = exports.getBody = function getBody() {
  return getDoc().body;
};
var getReadyState = exports.getReadyState = function getReadyState() {
  return getDoc().readyState;
};
var getPointerType = exports.getPointerType = function getPointerType(event) {
  return isPointerEvent(event) ? event.pointerType : isMouseEvent(event) ? "mouse" : null;
};
var onAnimationFrame = exports.onAnimationFrame = hasDOM() ? root.requestAnimationFrame.bind(root) : function () {};
var createElement = exports.createElement = function createElement(tagName, options) {
  return getDoc().createElement(tagName, options);
};
var createButton = exports.createButton = function createButton() {
  var label = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var tag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "button";
  var btn = createElement(tag);
  setTabIndex(btn);
  setAttr(btn, MC.S_ROLE, "button");
  setAttr(btn, MC.ARIA_PREFIX + "label", label);
  return btn;
};
var isNullish = exports.isNullish = function isNullish(v) {
  return v === undefined || v === null;
};
var isEmpty = exports.isEmpty = function isEmpty(v) {
  return isNullish(v) || v === "";
};
var isIterableObject = exports.isIterableObject = function isIterableObject(v) {
  return isNonPrimitive(v) && MC.SYMBOL.iterator in v;
};
var isArray = exports.isArray = function isArray(v) {
  return isInstanceOf(v, MC.ARRAY);
};
var isObject = exports.isObject = function isObject(v) {
  return isInstanceOf(v, MC.OBJECT);
};
var isNonPrimitive = exports.isNonPrimitive = function isNonPrimitive(v) {
  return v !== null && typeOf(v) === "object";
};

// only primitive number
var isNumber = exports.isNumber = function isNumber(v) {
  return typeOf(v) === "number";
};

/* eslint-disable-next-line @typescript-eslint/no-wrapper-object-types */
var isString = exports.isString = function isString(v) {
  return typeOf(v) === "string" || isInstanceOf(v, MC.STRING);
};
var isLiteralString = exports.isLiteralString = function isLiteralString(v) {
  return typeOf(v) === "string";
};
var isBoolean = exports.isBoolean = function isBoolean(v) {
  return typeOf(v) === "boolean";
};

/* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type */
var isFunction = exports.isFunction = function isFunction(v) {
  return typeOf(v) === "function" || isInstanceOf(v, MC.FUNCTION);
};
var isDoc = exports.isDoc = function isDoc(target) {
  return target === getDoc();
};
var isMouseEvent = exports.isMouseEvent = function isMouseEvent(event) {
  return isInstanceOf(event, MouseEvent);
};
var isPointerEvent = exports.isPointerEvent = function isPointerEvent(event) {
  return isInstanceOf(event, PointerEvent);
};
var isTouchPointerEvent = exports.isTouchPointerEvent = function isTouchPointerEvent(event) {
  return isPointerEvent(event) && getPointerType(event) === MC.S_TOUCH;
};
var isWheelEvent = exports.isWheelEvent = function isWheelEvent(event) {
  return isInstanceOf(event, WheelEvent);
};
var isKeyboardEvent = exports.isKeyboardEvent = function isKeyboardEvent(event) {
  return isInstanceOf(event, KeyboardEvent);
};
var isTouchEvent = exports.isTouchEvent = function isTouchEvent(event) {
  return isInstanceOf(event, TouchEvent);
};
var isNode = exports.isNode = function isNode(target) {
  return isInstanceOf(target, Node);
};
var isElement = exports.isElement = function isElement(target) {
  return isInstanceOf(target, Element);
};
var isHTMLElement = exports.isHTMLElement = function isHTMLElement(target) {
  return isInstanceOf(target, HTMLElement);
};
var isNodeBAfterA = exports.isNodeBAfterA = function isNodeBAfterA(nodeA, nodeB) {
  return (nodeA.compareDocumentPosition(nodeB) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
};
var strReplace = exports.strReplace = function strReplace(s, match, replacement) {
  return s.replace(match, replacement);
};
var setTimer = exports.setTimer = root.setTimeout.bind(root);
var clearTimer = exports.clearTimer = root.clearTimeout.bind(root);
var getBoundingClientRect = exports.getBoundingClientRect = function getBoundingClientRect(el) {
  return el.getBoundingClientRect();
};

// Copy size properties explicitly to another object so they can be used with
// the spread operator (DOMRect/DOMRectReadOnly's properties are not enumerable)
var copyBoundingRectProps = exports.copyBoundingRectProps = function copyBoundingRectProps(rect) {
  return _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({
    x: rect.x,
    left: rect.left,
    right: rect.right
  }, MC.S_WIDTH, rect[MC.S_WIDTH]), "y", rect.y), "top", rect.top), "bottom", rect.bottom), MC.S_HEIGHT, rect[MC.S_HEIGHT]);
};
var querySelector = exports.querySelector = function querySelector(root, selector) {
  return root.querySelector(selector);
};
var querySelectorAll = exports.querySelectorAll = function querySelectorAll(root, selector) {
  return root.querySelectorAll(selector);
};
var docQuerySelector = exports.docQuerySelector = function docQuerySelector(selector) {
  return querySelector(getDoc(), selector);
};
var docQuerySelectorAll = exports.docQuerySelectorAll = function docQuerySelectorAll(selector) {
  return querySelectorAll(getDoc(), selector);
};
var getElementById = exports.getElementById = function getElementById(id) {
  return getDoc().getElementById(id);
};
var getAttr = exports.getAttr = function getAttr(el, name) {
  return el.getAttribute(name);
};
var setAttr = exports.setAttr = function setAttr(el, name) {
  var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "true";
  return el.setAttribute(name, value);
};
var unsetAttr = exports.unsetAttr = function unsetAttr(el, name) {
  return el.setAttribute(name, "false");
};
var delAttr = exports.delAttr = function delAttr(el, name) {
  return el.removeAttribute(name);
};
var includes = exports.includes = function includes(arr, v, startAt) {
  return arr.indexOf(v, startAt) >= 0;
};
var filter = exports.filter = function filter(array, filterFn) {
  return array.filter(filterFn);
};
var filterBlank = exports.filterBlank = function filterBlank(array) {
  var result = array ? filter(array, function (v) {
    return !isEmpty(v);
  }) : undefined;
  return lengthOf(result) ? result : undefined;
};
var sizeOf = exports.sizeOf = function sizeOf(obj) {
  var _obj$size;
  return (_obj$size = obj === null || obj === void 0 ? void 0 : obj.size) !== null && _obj$size !== void 0 ? _obj$size : 0;
};
var lengthOf = exports.lengthOf = function lengthOf(obj) {
  var _obj$length;
  return (_obj$length = obj === null || obj === void 0 ? void 0 : obj.length) !== null && _obj$length !== void 0 ? _obj$length : 0;
};
var tagName = exports.tagName = function tagName(el) {
  return el.tagName;
};
var preventDefault = exports.preventDefault = function preventDefault(event) {
  return event.preventDefault();
};
var arrayFrom = exports.arrayFrom = MC.ARRAY.from.bind(MC.ARRAY);
var keysOf = exports.keysOf = function keysOf(obj) {
  return MC.OBJECT.keys(obj);
};
var defineProperty = exports.defineProperty = MC.OBJECT.defineProperty.bind(MC.OBJECT);

// use it in place of object spread
var merge = exports.merge = function merge() {
  var _MC$OBJECT;
  for (var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++) {
    a[_key] = arguments[_key];
  }
  return (_MC$OBJECT = MC.OBJECT).assign.apply(_MC$OBJECT, [{}].concat(a));
};
var copyObject = exports.copyObject = function copyObject(obj) {
  return merge(obj);
};
var promiseResolve = exports.promiseResolve = MC.PROMISE.resolve.bind(MC.PROMISE);
var promiseAll = exports.promiseAll = MC.PROMISE.all.bind(MC.PROMISE);
var assign = exports.assign = MC.OBJECT.assign.bind(MC.OBJECT);
var freezeObj = exports.freezeObj = MC.OBJECT.freeze.bind(MC.OBJECT);
var hasOwnProp = exports.hasOwnProp = function hasOwnProp(o, prop) {
  return MC.OBJECT.prototype.hasOwnProperty.call(o, prop);
};
var preventExtensions = exports.preventExtensions = MC.OBJECT.preventExtensions.bind(MC.OBJECT);
var stringify = exports.stringify = JSON.stringify.bind(JSON);
var floor = exports.floor = MC.MATH.floor.bind(MC.MATH);
var ceil = exports.ceil = MC.MATH.ceil.bind(MC.MATH);
var log2 = exports.log2 = MC.MATH.log2.bind(MC.MATH);
var sqrt = exports.sqrt = MC.MATH.sqrt.bind(MC.MATH);
var max = exports.max = MC.MATH.max.bind(MC.MATH);
var min = exports.min = MC.MATH.min.bind(MC.MATH);
var abs = exports.abs = MC.MATH.abs.bind(MC.MATH);
var round = exports.round = MC.MATH.round.bind(MC.MATH);
var pow = exports.pow = MC.MATH.pow.bind(MC.MATH);
var parseFloat = exports.parseFloat = MC.NUMBER.parseFloat.bind(MC.NUMBER);
var isNaN = exports.isNaN = MC.NUMBER.isNaN.bind(MC.NUMBER);
var isInstanceOf = exports.isInstanceOf = function isInstanceOf(value, Class) {
  return value instanceof Class;
};
var constructorOf = exports.constructorOf = function constructorOf(obj) {
  return obj.constructor;
};
var typeOf = exports.typeOf = function typeOf(obj) {
  return _typeof(obj);
};
var typeOrClassOf = exports.typeOrClassOf = function typeOrClassOf(obj) {
  var _constructorOf;
  return isObject(obj) ? (_constructorOf = constructorOf(obj)) === null || _constructorOf === void 0 ? void 0 : _constructorOf.name : typeOf(obj);
};
var parentOf = exports.parentOf = function parentOf(element) {
  return (element === null || element === void 0 ? void 0 : element.parentElement) || null;
};
var childrenOf = exports.childrenOf = function childrenOf(element) {
  return (element === null || element === void 0 ? void 0 : element.children) || [];
};
var targetOf = exports.targetOf = function targetOf(obj) {
  return obj === null || obj === void 0 ? void 0 : obj.target;
};
var currentTargetOf = exports.currentTargetOf = function currentTargetOf(obj) {
  return obj === null || obj === void 0 ? void 0 : obj.currentTarget;
};
var classList = exports.classList = function classList(el) {
  return el === null || el === void 0 ? void 0 : el.classList;
};
var S_TABINDEX = "tabindex";
var getTabIndex = exports.getTabIndex = function getTabIndex(el) {
  return getAttr(el, S_TABINDEX);
};
var setTabIndex = exports.setTabIndex = function setTabIndex(el) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0";
  return setAttr(el, S_TABINDEX, index);
};
var unsetTabIndex = exports.unsetTabIndex = function unsetTabIndex(el) {
  return delAttr(el, S_TABINDEX);
};
var remove = exports.remove = function remove(obj) {
  return obj === null || obj === void 0 ? void 0 : obj.remove();
};
var deleteObjKey = exports.deleteObjKey = function deleteObjKey(obj, key) {
  return delete obj[key];
};
var deleteKey = exports.deleteKey = function deleteKey(map, key) {
  return map === null || map === void 0 ? void 0 : map["delete"](key);
};
var elScrollTo = exports.elScrollTo = function elScrollTo(el, coords) {
  var behavior = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "instant";
  return el.scrollTo(merge({
    behavior: behavior
  }, coords));
};
var elScrollBy = exports.elScrollBy = function elScrollBy(el, coords) {
  var behavior = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "instant";
  return el.scrollBy(merge({
    behavior: behavior
  }, coords));
};
var newPromise = exports.newPromise = function newPromise(executor) {
  return new Promise(executor);
};
var newMap = exports.newMap = function newMap(entries) {
  return new Map(entries);
};
var newWeakMap = exports.newWeakMap = function newWeakMap(entries) {
  return new WeakMap(entries);
};
var newSet = exports.newSet = function newSet(values) {
  return new Set(values);
};
var newWeakSet = exports.newWeakSet = function newWeakSet(values) {
  return new WeakSet(values);
};
var newIntersectionObserver = exports.newIntersectionObserver = function newIntersectionObserver(callback, options) {
  return new IntersectionObserver(callback, options);
};
var newResizeObserver = exports.newResizeObserver = function newResizeObserver(callback) {
  return typeof ResizeObserver === "undefined" ? null : new ResizeObserver(callback);
};
var newMutationObserver = exports.newMutationObserver = function newMutationObserver(callback) {
  return new MutationObserver(callback);
};
var usageError = exports.usageError = function usageError(msg) {
  return new _errors.LisnUsageError(msg);
};
var bugError = exports.bugError = function bugError(msg) {
  return new _errors.LisnBugError(msg);
};
var illegalConstructorError = exports.illegalConstructorError = function illegalConstructorError(useWhat) {
  return usageError("Illegal constructor. Use ".concat(useWhat, "."));
};
var CONSOLE = console;
var consoleDebug = exports.consoleDebug = CONSOLE.debug.bind(CONSOLE);
var consoleLog = exports.consoleLog = CONSOLE.log.bind(CONSOLE);
var consoleInfo = exports.consoleInfo = CONSOLE.info.bind(CONSOLE);
var consoleWarn = exports.consoleWarn = CONSOLE.warn.bind(CONSOLE);
var consoleError = exports.consoleError = CONSOLE.error.bind(CONSOLE);

// --------------------
//# sourceMappingURL=minification-helpers.cjs.map