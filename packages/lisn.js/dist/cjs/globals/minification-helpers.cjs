"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.querySelector = exports.promiseResolve = exports.promiseAll = exports.preventExtensions = exports.preventDefault = exports.prefixName = exports.prefixLisnData = exports.prefixData = exports.prefixCssVar = exports.prefixCssJsVar = exports.pow = exports.parseFloat = exports.parentOf = exports.onAnimationFrame = exports.newWeakSet = exports.newWeakMap = exports.newSet = exports.newResizeObserver = exports.newPromise = exports.newMutationObserver = exports.newMap = exports.newIntersectionObserver = exports.min = exports.merge = exports.max = exports.log2 = exports.lengthOf = exports.keysOf = exports.kebabToCamelCase = exports.isWheelEvent = exports.isTouchPointerEvent = exports.isTouchEvent = exports.isString = exports.isPointerEvent = exports.isObject = exports.isNumber = exports.isNullish = exports.isNonPrimitive = exports.isNodeBAfterA = exports.isNode = exports.isNaN = exports.isMouseEvent = exports.isLiteralString = exports.isKeyboardEvent = exports.isIterableObject = exports.isInstanceOf = exports.isHTMLElement = exports.isFunction = exports.isEmpty = exports.isElement = exports.isDoc = exports.isBoolean = exports.isArray = exports.includes = exports.illegalConstructorError = exports.hasOwnProp = exports.hasDOM = exports.getWindow = exports.getTabIndex = exports.getReadyState = exports.getPointerType = exports.getElementById = exports.getDocScrollingElement = exports.getDocElement = exports.getDoc = exports.getBoundingClientRect = exports.getBody = exports.getAttr = exports.freezeObj = exports.floor = exports.filterBlank = exports.filter = exports.elScrollTo = exports.elScrollBy = exports.docQuerySelectorAll = exports.docQuerySelector = exports.deleteObjKey = exports.deleteKey = exports.delAttr = exports.defineProperty = exports.currentTargetOf = exports.createElement = exports.createButton = exports.copyObject = exports.copyBoundingRectProps = exports.constructorOf = exports.consoleWarn = exports.consoleLog = exports.consoleInfo = exports.consoleError = exports.consoleDebug = exports.clearTimer = exports.classList = exports.childrenOf = exports.ceil = exports.camelToKebabCase = exports.bugError = exports.assign = exports.arrayFrom = exports.abs = void 0;
exports.usageError = exports.unsetTabIndex = exports.unsetAttr = exports.typeOrClassOf = exports.typeOf = exports.toUpperCase = exports.toLowerCase = exports.timeSince = exports.timeNow = exports.targetOf = exports.tagName = exports.stringify = exports.strReplace = exports.sqrt = exports.sizeOf = exports.setTimer = exports.setTabIndex = exports.setAttr = exports.round = exports.remove = exports.querySelectorAll = void 0;
var MC = _interopRequireWildcard(require("./minification-constants.cjs"));
var _errors = require("./errors.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * For minification optimization
 *
 * @module
 * @ignore
 * @internal
 */

// credit: underscore.js
const root = typeof self === "object" && self.self === self && self || typeof global == "object" && global.global === global && global || Function("return this")() || {};
const kebabToCamelCase = str => str.replace(/-./g, m => toUpperCase(m.charAt(1)));
exports.kebabToCamelCase = kebabToCamelCase;
const camelToKebabCase = str => str.replace(/[A-Z][a-z]/g, m => "-" + toLowerCase(m)).replace(/[A-Z]+/, m => "-" + toLowerCase(m));
exports.camelToKebabCase = camelToKebabCase;
const prefixName = name => `${MC.PREFIX}-${name}`;
exports.prefixName = prefixName;
const prefixCssVar = name => "--" + prefixName(name);
exports.prefixCssVar = prefixCssVar;
const prefixCssJsVar = name => prefixCssVar("js--" + name);
exports.prefixCssJsVar = prefixCssJsVar;
const prefixData = name => `data-${camelToKebabCase(name)}`;
exports.prefixData = prefixData;
const prefixLisnData = name => prefixData(prefixName(name));
exports.prefixLisnData = prefixLisnData;
const toLowerCase = s => s.toLowerCase();
exports.toLowerCase = toLowerCase;
const toUpperCase = s => s.toUpperCase();
exports.toUpperCase = toUpperCase;
const timeNow = exports.timeNow = Date.now.bind(Date);
const timeSince = startTime => timeNow() - startTime;
exports.timeSince = timeSince;
const hasDOM = () => typeof document !== "undefined";
exports.hasDOM = hasDOM;
const getWindow = () => window;
exports.getWindow = getWindow;
const getDoc = () => document;
exports.getDoc = getDoc;
const getDocElement = () => getDoc().documentElement;
exports.getDocElement = getDocElement;
const getDocScrollingElement = () => getDoc().scrollingElement;
exports.getDocScrollingElement = getDocScrollingElement;
const getBody = () => getDoc().body;
exports.getBody = getBody;
const getReadyState = () => getDoc().readyState;
exports.getReadyState = getReadyState;
const getPointerType = event => isPointerEvent(event) ? event.pointerType : isMouseEvent(event) ? "mouse" : null;
exports.getPointerType = getPointerType;
const onAnimationFrame = exports.onAnimationFrame = hasDOM() ? root.requestAnimationFrame.bind(root) : () => {};
const createElement = (tagName, options) => getDoc().createElement(tagName, options);
exports.createElement = createElement;
const createButton = (label = "", tag = "button") => {
  const btn = createElement(tag);
  setTabIndex(btn);
  setAttr(btn, MC.S_ROLE, "button");
  setAttr(btn, MC.ARIA_PREFIX + "label", label);
  return btn;
};
exports.createButton = createButton;
const isNullish = v => v === undefined || v === null;
exports.isNullish = isNullish;
const isEmpty = v => isNullish(v) || v === "";
exports.isEmpty = isEmpty;
const isIterableObject = v => isNonPrimitive(v) && MC.SYMBOL.iterator in v;
exports.isIterableObject = isIterableObject;
const isArray = v => isInstanceOf(v, MC.ARRAY);
exports.isArray = isArray;
const isObject = v => isInstanceOf(v, MC.OBJECT);
exports.isObject = isObject;
const isNonPrimitive = v => v !== null && typeOf(v) === "object";

// only primitive number
exports.isNonPrimitive = isNonPrimitive;
const isNumber = v => typeOf(v) === "number";

/* eslint-disable-next-line @typescript-eslint/no-wrapper-object-types */
exports.isNumber = isNumber;
const isString = v => typeOf(v) === "string" || isInstanceOf(v, MC.STRING);
exports.isString = isString;
const isLiteralString = v => typeOf(v) === "string";
exports.isLiteralString = isLiteralString;
const isBoolean = v => typeOf(v) === "boolean";

/* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type */
exports.isBoolean = isBoolean;
const isFunction = v => typeOf(v) === "function" || isInstanceOf(v, MC.FUNCTION);
exports.isFunction = isFunction;
const isDoc = target => target === getDoc();
exports.isDoc = isDoc;
const isMouseEvent = event => isInstanceOf(event, MouseEvent);
exports.isMouseEvent = isMouseEvent;
const isPointerEvent = event => isInstanceOf(event, PointerEvent);
exports.isPointerEvent = isPointerEvent;
const isTouchPointerEvent = event => isPointerEvent(event) && getPointerType(event) === MC.S_TOUCH;
exports.isTouchPointerEvent = isTouchPointerEvent;
const isWheelEvent = event => isInstanceOf(event, WheelEvent);
exports.isWheelEvent = isWheelEvent;
const isKeyboardEvent = event => isInstanceOf(event, KeyboardEvent);
exports.isKeyboardEvent = isKeyboardEvent;
const isTouchEvent = event => isInstanceOf(event, TouchEvent);
exports.isTouchEvent = isTouchEvent;
const isNode = target => isInstanceOf(target, Node);
exports.isNode = isNode;
const isElement = target => isInstanceOf(target, Element);
exports.isElement = isElement;
const isHTMLElement = target => isInstanceOf(target, HTMLElement);
exports.isHTMLElement = isHTMLElement;
const isNodeBAfterA = (nodeA, nodeB) => (nodeA.compareDocumentPosition(nodeB) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
exports.isNodeBAfterA = isNodeBAfterA;
const strReplace = (s, match, replacement) => s.replace(match, replacement);
exports.strReplace = strReplace;
const setTimer = exports.setTimer = root.setTimeout.bind(root);
const clearTimer = exports.clearTimer = root.clearTimeout.bind(root);
const getBoundingClientRect = el => el.getBoundingClientRect();

// Copy size properties explicitly to another object so they can be used with
// the spread operator (DOMRect/DOMRectReadOnly's properties are not enumerable)
exports.getBoundingClientRect = getBoundingClientRect;
const copyBoundingRectProps = rect => {
  return {
    x: rect.x,
    left: rect.left,
    right: rect.right,
    [MC.S_WIDTH]: rect[MC.S_WIDTH],
    y: rect.y,
    top: rect.top,
    bottom: rect.bottom,
    [MC.S_HEIGHT]: rect[MC.S_HEIGHT]
  };
};
exports.copyBoundingRectProps = copyBoundingRectProps;
const querySelector = (root, selector) => root.querySelector(selector);
exports.querySelector = querySelector;
const querySelectorAll = (root, selector) => root.querySelectorAll(selector);
exports.querySelectorAll = querySelectorAll;
const docQuerySelector = selector => querySelector(getDoc(), selector);
exports.docQuerySelector = docQuerySelector;
const docQuerySelectorAll = selector => querySelectorAll(getDoc(), selector);
exports.docQuerySelectorAll = docQuerySelectorAll;
const getElementById = id => getDoc().getElementById(id);
exports.getElementById = getElementById;
const getAttr = (el, name) => el.getAttribute(name);
exports.getAttr = getAttr;
const setAttr = (el, name, value = "true") => el.setAttribute(name, value);
exports.setAttr = setAttr;
const unsetAttr = (el, name) => el.setAttribute(name, "false");
exports.unsetAttr = unsetAttr;
const delAttr = (el, name) => el.removeAttribute(name);
exports.delAttr = delAttr;
const includes = (arr, v, startAt) => arr.indexOf(v, startAt) >= 0;
exports.includes = includes;
const filter = (array, filterFn) => array.filter(filterFn);
exports.filter = filter;
const filterBlank = array => {
  const result = array ? filter(array, v => !isEmpty(v)) : undefined;
  return lengthOf(result) ? result : undefined;
};
exports.filterBlank = filterBlank;
const sizeOf = obj => {
  var _obj$size;
  return (_obj$size = obj === null || obj === void 0 ? void 0 : obj.size) !== null && _obj$size !== void 0 ? _obj$size : 0;
};
exports.sizeOf = sizeOf;
const lengthOf = obj => {
  var _obj$length;
  return (_obj$length = obj === null || obj === void 0 ? void 0 : obj.length) !== null && _obj$length !== void 0 ? _obj$length : 0;
};
exports.lengthOf = lengthOf;
const tagName = el => el.tagName;
exports.tagName = tagName;
const preventDefault = event => event.preventDefault();
exports.preventDefault = preventDefault;
const arrayFrom = exports.arrayFrom = MC.ARRAY.from.bind(MC.ARRAY);
const keysOf = obj => MC.OBJECT.keys(obj);
exports.keysOf = keysOf;
const defineProperty = exports.defineProperty = MC.OBJECT.defineProperty.bind(MC.OBJECT);

// use it in place of object spread
const merge = (...a) => {
  return MC.OBJECT.assign({}, ...a);
};
exports.merge = merge;
const copyObject = obj => merge(obj);
exports.copyObject = copyObject;
const promiseResolve = exports.promiseResolve = MC.PROMISE.resolve.bind(MC.PROMISE);
const promiseAll = exports.promiseAll = MC.PROMISE.all.bind(MC.PROMISE);
const assign = exports.assign = MC.OBJECT.assign.bind(MC.OBJECT);
const freezeObj = exports.freezeObj = MC.OBJECT.freeze.bind(MC.OBJECT);
const hasOwnProp = (o, prop) => MC.OBJECT.prototype.hasOwnProperty.call(o, prop);
exports.hasOwnProp = hasOwnProp;
const preventExtensions = exports.preventExtensions = MC.OBJECT.preventExtensions.bind(MC.OBJECT);
const stringify = exports.stringify = JSON.stringify.bind(JSON);
const floor = exports.floor = MC.MATH.floor.bind(MC.MATH);
const ceil = exports.ceil = MC.MATH.ceil.bind(MC.MATH);
const log2 = exports.log2 = MC.MATH.log2.bind(MC.MATH);
const sqrt = exports.sqrt = MC.MATH.sqrt.bind(MC.MATH);
const max = exports.max = MC.MATH.max.bind(MC.MATH);
const min = exports.min = MC.MATH.min.bind(MC.MATH);
const abs = exports.abs = MC.MATH.abs.bind(MC.MATH);
const round = exports.round = MC.MATH.round.bind(MC.MATH);
const pow = exports.pow = MC.MATH.pow.bind(MC.MATH);
const parseFloat = exports.parseFloat = MC.NUMBER.parseFloat.bind(MC.NUMBER);
const isNaN = exports.isNaN = MC.NUMBER.isNaN.bind(MC.NUMBER);
const isInstanceOf = (value, Class) => value instanceof Class;
exports.isInstanceOf = isInstanceOf;
const constructorOf = obj => obj.constructor;
exports.constructorOf = constructorOf;
const typeOf = obj => typeof obj;
exports.typeOf = typeOf;
const typeOrClassOf = obj => {
  var _constructorOf;
  return isObject(obj) ? (_constructorOf = constructorOf(obj)) === null || _constructorOf === void 0 ? void 0 : _constructorOf.name : typeOf(obj);
};
exports.typeOrClassOf = typeOrClassOf;
const parentOf = element => (element === null || element === void 0 ? void 0 : element.parentElement) || null;
exports.parentOf = parentOf;
const childrenOf = element => (element === null || element === void 0 ? void 0 : element.children) || [];
exports.childrenOf = childrenOf;
const targetOf = obj => obj === null || obj === void 0 ? void 0 : obj.target;
exports.targetOf = targetOf;
const currentTargetOf = obj => obj === null || obj === void 0 ? void 0 : obj.currentTarget;
exports.currentTargetOf = currentTargetOf;
const classList = el => el === null || el === void 0 ? void 0 : el.classList;
exports.classList = classList;
const S_TABINDEX = "tabindex";
const getTabIndex = el => getAttr(el, S_TABINDEX);
exports.getTabIndex = getTabIndex;
const setTabIndex = (el, index = "0") => setAttr(el, S_TABINDEX, index);
exports.setTabIndex = setTabIndex;
const unsetTabIndex = el => delAttr(el, S_TABINDEX);
exports.unsetTabIndex = unsetTabIndex;
const remove = obj => obj === null || obj === void 0 ? void 0 : obj.remove();
exports.remove = remove;
const deleteObjKey = (obj, key) => delete obj[key];
exports.deleteObjKey = deleteObjKey;
const deleteKey = (map, key) => map === null || map === void 0 ? void 0 : map.delete(key);
exports.deleteKey = deleteKey;
const elScrollTo = (el, coords, behavior = "instant") => el.scrollTo(merge({
  behavior
}, coords));
exports.elScrollTo = elScrollTo;
const elScrollBy = (el, coords, behavior = "instant") => el.scrollBy(merge({
  behavior
}, coords));
exports.elScrollBy = elScrollBy;
const newPromise = executor => new Promise(executor);
exports.newPromise = newPromise;
const newMap = entries => new Map(entries);
exports.newMap = newMap;
const newWeakMap = entries => new WeakMap(entries);
exports.newWeakMap = newWeakMap;
const newSet = values => new Set(values);
exports.newSet = newSet;
const newWeakSet = values => new WeakSet(values);
exports.newWeakSet = newWeakSet;
const newIntersectionObserver = (callback, options) => new IntersectionObserver(callback, options);
exports.newIntersectionObserver = newIntersectionObserver;
const newResizeObserver = callback => typeof ResizeObserver === "undefined" ? null : new ResizeObserver(callback);
exports.newResizeObserver = newResizeObserver;
const newMutationObserver = callback => new MutationObserver(callback);
exports.newMutationObserver = newMutationObserver;
const usageError = msg => new _errors.LisnUsageError(msg);
exports.usageError = usageError;
const bugError = msg => new _errors.LisnBugError(msg);
exports.bugError = bugError;
const illegalConstructorError = useWhat => usageError(`Illegal constructor. Use ${useWhat}.`);
exports.illegalConstructorError = illegalConstructorError;
const CONSOLE = console;
const consoleDebug = exports.consoleDebug = CONSOLE.debug.bind(CONSOLE);
const consoleLog = exports.consoleLog = CONSOLE.log.bind(CONSOLE);
const consoleInfo = exports.consoleInfo = CONSOLE.info.bind(CONSOLE);
const consoleWarn = exports.consoleWarn = CONSOLE.warn.bind(CONSOLE);
const consoleError = exports.consoleError = CONSOLE.error.bind(CONSOLE);

// --------------------
//# sourceMappingURL=minification-helpers.cjs.map