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
const root = typeof self === "object" && self.self === self && self || typeof global == "object" && global.global === global && global || Function("return this")() || {};
export const kebabToCamelCase = str => str.replace(/-./g, m => toUpperCase(m.charAt(1)));
export const camelToKebabCase = str => str.replace(/[A-Z][a-z]/g, m => "-" + toLowerCase(m)).replace(/[A-Z]+/, m => "-" + toLowerCase(m));
export const prefixName = name => `${MC.PREFIX}-${name}`;
export const prefixCssVar = name => "--" + prefixName(name);
export const prefixCssJsVar = name => prefixCssVar("js--" + name);
export const prefixData = name => `data-${camelToKebabCase(name)}`;
export const prefixLisnData = name => prefixData(prefixName(name));
export const toLowerCase = s => s.toLowerCase();
export const toUpperCase = s => s.toUpperCase();
export const timeNow = Date.now.bind(Date);
export const timeSince = startTime => timeNow() - startTime;
export const hasDOM = () => typeof document !== "undefined";
export const getWindow = () => window;
export const getDoc = () => document;
export const getDocElement = () => getDoc().documentElement;
export const getDocScrollingElement = () => getDoc().scrollingElement;
export const getBody = () => getDoc().body;
export const getReadyState = () => getDoc().readyState;
export const getPointerType = event => isPointerEvent(event) ? event.pointerType : isMouseEvent(event) ? "mouse" : null;
export const onAnimationFrame = callback => requestAnimationFrame(callback);
export const createElement = (tagName, options) => getDoc().createElement(tagName, options);
export const createButton = (label = "", tag = "button") => {
  const btn = createElement(tag);
  setTabIndex(btn);
  setAttr(btn, MC.S_ROLE, "button");
  setAttr(btn, MC.ARIA_PREFIX + "label", label);
  return btn;
};
export const isNullish = v => v === undefined || v === null;
export const isEmpty = v => isNullish(v) || v === "";
export const isIterableObject = v => isNonPrimitive(v) && MC.SYMBOL.iterator in v;
export const isArray = v => isInstanceOf(v, MC.ARRAY);
export const isObject = v => isInstanceOf(v, MC.OBJECT);
export const isNonPrimitive = v => v !== null && typeOf(v) === "object";

// only primitive number
export const isNumber = v => typeOf(v) === "number";

/* eslint-disable-next-line @typescript-eslint/no-wrapper-object-types */
export const isString = v => typeOf(v) === "string" || isInstanceOf(v, MC.STRING);
export const isLiteralString = v => typeOf(v) === "string";
export const isBoolean = v => typeOf(v) === "boolean";

/* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type */
export const isFunction = v => typeOf(v) === "function" || isInstanceOf(v, MC.FUNCTION);
export const isDoc = target => target === getDoc();
export const isMouseEvent = event => isInstanceOf(event, MouseEvent);
export const isPointerEvent = event => typeof PointerEvent !== "undefined" && isInstanceOf(event, PointerEvent);
export const isTouchPointerEvent = event => isPointerEvent(event) && getPointerType(event) === MC.S_TOUCH;
export const isWheelEvent = event => isInstanceOf(event, WheelEvent);
export const isKeyboardEvent = event => isInstanceOf(event, KeyboardEvent);
export const isTouchEvent = event => typeof TouchEvent !== "undefined" && isInstanceOf(event, TouchEvent);
export const isNode = target => isInstanceOf(target, Node);
export const isElement = target => isInstanceOf(target, Element);
export const isHTMLElement = target => isInstanceOf(target, HTMLElement);
export const isNodeBAfterA = (nodeA, nodeB) => (nodeA.compareDocumentPosition(nodeB) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
export const strReplace = (s, match, replacement) => s.replace(match, replacement);
export const setTimer = root.setTimeout.bind(root);
export const clearTimer = root.clearTimeout.bind(root);
export const getBoundingClientRect = element => element.getBoundingClientRect();

// Copy size properties explicitly to another object so they can be used with
// the spread operator (DOMRect/DOMRectReadOnly's properties are not enumerable)
export const copyBoundingRectProps = rect => {
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
export const querySelector = (root, selector) => root.querySelector(selector);
export const querySelectorAll = (root, selector) => root.querySelectorAll(selector);
export const docQuerySelector = selector => querySelector(getDoc(), selector);
export const docQuerySelectorAll = selector => querySelectorAll(getDoc(), selector);
export const getElementById = id => getDoc().getElementById(id);
export const getAttr = (element, name) => element.getAttribute(name);
export const setAttr = (element, name, value = "true") => element.setAttribute(name, value);
export const unsetAttr = (element, name) => element.setAttribute(name, "false");
export const delAttr = (element, name) => element.removeAttribute(name);
export const includes = (arr, v, startAt) => arr.indexOf(v, startAt) >= 0;
export const every = (array, predicate) => array.every(predicate);
export const some = (array, predicate) => array.some(predicate);
export const filter = (array, filterFn) => array.filter(filterFn);
export const filterBlank = array => {
  const result = array ? filter(array, v => !isEmpty(v)) : undefined;
  return lengthOf(result) ? result : undefined;
};
export const sizeOf = obj => {
  var _obj$size;
  return (_obj$size = obj === null || obj === void 0 ? void 0 : obj.size) !== null && _obj$size !== void 0 ? _obj$size : 0;
};
export const lengthOf = obj => {
  var _obj$length;
  return (_obj$length = obj === null || obj === void 0 ? void 0 : obj.length) !== null && _obj$length !== void 0 ? _obj$length : 0;
};
export const lastOf = a => a === null || a === void 0 ? void 0 : a.slice(-1)[0];
export const firstOf = a => a === null || a === void 0 ? void 0 : a.slice(0, 1)[0];
export const tagName = element => element.tagName;
export const hasTagName = (element, tag) => toLowerCase(tagName(element)) === toLowerCase(tag);
export const preventDefault = event => event.preventDefault();
export const arrayFrom = MC.ARRAY.from.bind(MC.ARRAY);
export const keysOf = obj => MC.OBJECT.keys(obj);
export const defineProperty = MC.OBJECT.defineProperty.bind(MC.OBJECT);

// use it in place of object spread
export const merge = (...a) => {
  return MC.OBJECT.assign({}, ...a);
};

// alias for clarity of purpose
export const copyObject = obj => merge(obj);
export const promiseResolve = MC.PROMISE.resolve.bind(MC.PROMISE);
export const promiseAll = MC.PROMISE.all.bind(MC.PROMISE);
export const assign = MC.OBJECT.assign.bind(MC.OBJECT);
export const freezeObj = MC.OBJECT.freeze.bind(MC.OBJECT);
export const hasOwnProp = (o, prop) => MC.OBJECT.prototype.hasOwnProperty.call(o, prop);
export const preventExtensions = MC.OBJECT.preventExtensions.bind(MC.OBJECT);
export const stringify = JSON.stringify.bind(JSON);
export const floor = MC.MATH.floor.bind(MC.MATH);
export const ceil = MC.MATH.ceil.bind(MC.MATH);
export const log2 = MC.MATH.log2.bind(MC.MATH);
export const sqrt = MC.MATH.sqrt.bind(MC.MATH);
export const max = MC.MATH.max.bind(MC.MATH);
export const min = MC.MATH.min.bind(MC.MATH);
export const abs = MC.MATH.abs.bind(MC.MATH);
export const round = MC.MATH.round.bind(MC.MATH);
export const pow = MC.MATH.pow.bind(MC.MATH);
export const parseFloat = MC.NUMBER.parseFloat.bind(MC.NUMBER);
export const isNaN = MC.NUMBER.isNaN.bind(MC.NUMBER);
export const isInstanceOf = (value, Class) => value instanceof Class;
export const constructorOf = obj => obj.constructor;
export const typeOf = obj => typeof obj;
export const typeOrClassOf = obj => {
  var _constructorOf;
  return isObject(obj) ? (_constructorOf = constructorOf(obj)) === null || _constructorOf === void 0 ? void 0 : _constructorOf.name : typeOf(obj);
};
export const parentOf = element => (element === null || element === void 0 ? void 0 : element.parentElement) || null;
export const childrenOf = element => (element === null || element === void 0 ? void 0 : element.children) || [];
export const targetOf = obj => obj === null || obj === void 0 ? void 0 : obj.target;
export const currentTargetOf = obj => obj === null || obj === void 0 ? void 0 : obj.currentTarget;
export const classList = element => element === null || element === void 0 ? void 0 : element.classList;
const S_TABINDEX = "tabindex";
export const getTabIndex = element => getAttr(element, S_TABINDEX);
export const setTabIndex = (element, index = "0") => setAttr(element, S_TABINDEX, index);
export const unsetTabIndex = element => delAttr(element, S_TABINDEX);
export const remove = obj => obj === null || obj === void 0 ? void 0 : obj.remove();
export const deleteObjKey = (obj, key) => delete obj[key];
export const deleteKey = (map, key) => map === null || map === void 0 ? void 0 : map.delete(key);
export const elScrollTo = (element, coords, behavior = "instant") => element.scrollTo(merge({
  behavior
}, coords));
export const elScrollBy = (element, coords, behavior = "instant") => element.scrollBy(merge({
  behavior
}, coords));
export const newPromise = executor => new Promise(executor);
export const newMap = entries => new Map(entries);
export const newWeakMap = entries => new WeakMap(entries);
export const newSet = values => new Set(values);
export const newWeakSet = values => new WeakSet(values);
export const newIntersectionObserver = (callback, options) => new IntersectionObserver(callback, options);
export const newResizeObserver = callback => typeof ResizeObserver === "undefined" ? null : new ResizeObserver(callback);
export const newMutationObserver = callback => new MutationObserver(callback);
export const usageError = msg => new LisnUsageError(msg);
export const bugError = msg => new LisnBugError(msg);
export const illegalConstructorError = useWhat => usageError(`Illegal constructor. Use ${useWhat}.`);
const CONSOLE = console;
export const consoleDebug = CONSOLE.debug.bind(CONSOLE);
export const consoleLog = CONSOLE.log.bind(CONSOLE);
export const consoleInfo = CONSOLE.info.bind(CONSOLE);
export const consoleWarn = CONSOLE.warn.bind(CONSOLE);
export const consoleError = CONSOLE.error.bind(CONSOLE);

// --------------------
//# sourceMappingURL=minification-helpers.js.map