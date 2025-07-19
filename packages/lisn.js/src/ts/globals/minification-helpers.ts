/**
 * For minification optimization
 *
 * @module
 * @ignore
 * @internal
 */

import * as MC from "@lisn/globals/minification-constants";

import {
  BoundingRect,
  IterableObject,
  Constructor,
  InstanceType,
  MapBase,
  SetBase,
  Spread,
} from "@lisn/globals/types";

import { LisnUsageError, LisnBugError } from "@lisn/globals/errors";

// credit: underscore.js
export const root =
  (typeof self === "object" && self.self === self && self) ||
  (typeof global == "object" && global.global === global && global) ||
  Function("return this")() ||
  {};

export const userAgent =
  typeof navigator === "undefined" ? "" : navigator.userAgent;

export const kebabToCamelCase = (str: string) =>
  str.replace(/-./g, (m) => toUpperCase(m.charAt(1)));

export const camelToKebabCase = (str: string) =>
  str
    .replace(/[A-Z][a-z]/g, (m) => "-" + toLowerCase(m))
    .replace(/[A-Z]+/, (m) => "-" + toLowerCase(m));

export const prefixName = (name: string) => `${MC.PREFIX}-${name}`;

export const prefixCssVar = (name: string) => "--" + prefixName(name);

export const prefixCssJsVar = (name: string) => prefixCssVar("js--" + name);

export const prefixData = (name: string) => `data-${camelToKebabCase(name)}`;

export const prefixLisnData = (name: string) => prefixData(prefixName(name));

export const toLowerCase = (s: string) => s.toLowerCase();

export const toUpperCase = (s: string) => s.toUpperCase();

export const timeNow = Date.now.bind(Date);

export const timeSince = (startTime: number) => timeNow() - startTime;

export const hasDOM = () => typeof document !== "undefined";

export const getWindow = () => window;

export const getDoc = () => document;

export const getDocElement = () => getDoc().documentElement;

export const getDocScrollingElement = () =>
  getDoc().scrollingElement as HTMLElement | null;

export const getBody = () => getDoc().body;

export const getReadyState = () => getDoc().readyState;

export const getPointerType = (event: Event) =>
  isPointerEvent(event)
    ? event.pointerType
    : isMouseEvent(event)
      ? "mouse"
      : null;

export const onAnimationFrame = (callback: FrameRequestCallback) =>
  requestAnimationFrame(callback);

export const createElement = (
  tagName: string,
  options?: ElementCreationOptions,
) => getDoc().createElement(tagName, options);

export const createButton = (label = "", tag = "button") => {
  const btn = createElement(tag);
  setTabIndex(btn);
  setAttr(btn, MC.S_ROLE, "button");
  setAttr(btn, MC.ARIA_PREFIX + "label", label);
  return btn;
};

export const isNullish = (v: unknown): v is null | undefined =>
  v === undefined || v === null;

export const isEmpty = (v: unknown): v is null | undefined | "" =>
  isNullish(v) || v === "";

export const isIterableObject = (v: unknown): v is IterableObject<unknown> =>
  isNonPrimitive(v) && MC.SYMBOL.iterator in v;

export const isArray = (v: unknown) => isInstanceOf(v, MC.ARRAY);

export const isObject = (v: unknown) => isInstanceOf(v, MC.OBJECT);

export const isNonPrimitive = (v: unknown): v is object =>
  v !== null && typeOf(v) === "object";

// only primitive number
export const isNumber = (v: unknown): v is number => typeOf(v) === "number";

/* eslint-disable-next-line @typescript-eslint/no-wrapper-object-types */
export const isString = (v: unknown): v is string | String =>
  typeOf(v) === "string" || isInstanceOf(v, MC.STRING);

export const isLiteralString = (v: unknown): v is string =>
  typeOf(v) === "string";

export const isBoolean = (v: unknown): v is boolean => typeOf(v) === "boolean";

/* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type */
export const isFunction = (v: unknown): v is Function =>
  typeOf(v) === "function" || isInstanceOf(v, MC.FUNCTION);

export const isDoc = (target: unknown): target is Document =>
  target === getDoc();

export const isMouseEvent = (event: Event): event is MouseEvent =>
  isInstanceOf(event, MouseEvent);

export const isPointerEvent = (event: Event): event is PointerEvent =>
  typeof PointerEvent !== "undefined" && isInstanceOf(event, PointerEvent);

export const isTouchPointerEvent = (event: Event): event is PointerEvent =>
  isPointerEvent(event) && getPointerType(event) === MC.S_TOUCH;

export const isWheelEvent = (event: Event): event is WheelEvent =>
  isInstanceOf(event, WheelEvent);

export const isKeyboardEvent = (event: Event): event is KeyboardEvent =>
  isInstanceOf(event, KeyboardEvent);

export const isTouchEvent = (event: Event): event is TouchEvent =>
  typeof TouchEvent !== "undefined" && isInstanceOf(event, TouchEvent);

export const isNode = (target: unknown) => isInstanceOf(target, Node);

export const isElement = (target: unknown) => isInstanceOf(target, Element);

export const isHTMLElement = (target: unknown) =>
  isInstanceOf(target, HTMLElement);

export const isNodeBAfterA = (nodeA: Node, nodeB: Node) =>
  (nodeA.compareDocumentPosition(nodeB) & Node.DOCUMENT_POSITION_FOLLOWING) !==
  0;

export const strReplace = (
  s: string,
  match: string | RegExp,
  replacement: string,
) => s.replace(match, replacement);

export const setTimer = root.setTimeout.bind(root);

export const clearTimer = root.clearTimeout.bind(root);

export const getBoundingClientRect = (element: Element) =>
  element.getBoundingClientRect();

// Copy size properties explicitly to another object so they can be used with
// the spread operator (DOMRect/DOMRectReadOnly's properties are not enumerable)
export const copyBoundingRectProps = (rect: BoundingRect): BoundingRect => {
  return {
    x: rect.x,
    left: rect.left,
    right: rect.right,
    [MC.S_WIDTH]: rect[MC.S_WIDTH],
    y: rect.y,
    top: rect.top,
    bottom: rect.bottom,
    [MC.S_HEIGHT]: rect[MC.S_HEIGHT],
  };
};

export const querySelector = (root: Element | Document, selector: string) =>
  root.querySelector(selector);

export const querySelectorAll = (root: Element | Document, selector: string) =>
  root.querySelectorAll(selector);

export const docQuerySelector = (selector: string) =>
  querySelector(getDoc(), selector);

export const docQuerySelectorAll = (selector: string) =>
  querySelectorAll(getDoc(), selector);

export const getElementById = (id: string) => getDoc().getElementById(id);

export const getAttr = (element: Element, name: string) =>
  element.getAttribute(name);

export const setAttr = (element: Element, name: string, value = "true") =>
  element.setAttribute(name, value);

export const unsetAttr = (element: Element, name: string) =>
  element.setAttribute(name, "false");

export const delAttr = (element: Element, name: string) =>
  element.removeAttribute(name);

export const includes = (
  arr: readonly unknown[] | string,
  v: unknown,
  startAt?: number,
) => (arr.indexOf as (v: unknown, startAt?: number) => number)(v, startAt) >= 0;

export const every = <
  A extends readonly unknown[],
  C extends ArrayCallbackFn<A[number]>,
>(
  array: A,
  predicate: C,
) => array.every(predicate);

export const some = <
  A extends readonly unknown[],
  C extends ArrayCallbackFn<A[number]>,
>(
  array: A,
  predicate: C,
) => array.some(predicate);

export const filter = <
  A extends readonly unknown[],
  T extends A[number],
  C extends ArrayCallbackFn<A[number]> | FilterFnTypeP<A[number], T>,
>(
  array: A,
  filterFn: C,
) => array.filter(filterFn) as FilteredType<C, A[number], T>[];

export const filterBlank = <A extends readonly unknown[]>(
  array: A | null | undefined,
) => {
  const result = array
    ? filter(array, (v): v is NonNullable<A[number]> => !isEmpty(v))
    : undefined;

  return lengthOf(result) ? result : undefined;
};

export const sizeOf = (obj: { size: number } | null | undefined) =>
  obj?.size ?? 0;

export const lengthOf = (obj: { length: number } | null | undefined) =>
  obj?.length ?? 0;

export const lastOf = <A extends readonly unknown[]>(a: A | null | undefined) =>
  a?.slice(-1)[0] as LastElement<A>;

export const firstOf = <A extends readonly unknown[]>(
  a: A | null | undefined,
) => a?.slice(0, 1)[0] as FirstElement<A>;

export const tagName = (element: Element) => element.tagName;

export const hasTagName = (element: Element, tag: string) =>
  toLowerCase(tagName(element)) === toLowerCase(tag);

export const preventDefault = (event: Event) => event.preventDefault();

export const arrayFrom = MC.ARRAY.from.bind(MC.ARRAY);

export const keysOf = <T extends Record<string | symbol, unknown>>(
  obj: T,
): Array<keyof T & string> => MC.OBJECT.keys(obj);

export const defineProperty = MC.OBJECT.defineProperty.bind(MC.OBJECT);

// use it in place of object spread
export const merge = <A extends readonly (object | null | undefined)[]>(
  ...a: [...A]
) => {
  return MC.OBJECT.assign({}, ...a) as Spread<A>;
};

export const copyObject = <T extends object | undefined>(obj: T) => merge(obj);

export const promiseResolve = MC.PROMISE.resolve.bind(MC.PROMISE);

export const promiseAll = MC.PROMISE.all.bind(MC.PROMISE);

export const assign = MC.OBJECT.assign.bind(MC.OBJECT);

export const freezeObj = MC.OBJECT.freeze.bind(MC.OBJECT);

export const hasOwnProp = (o: object, prop: string | symbol) =>
  MC.OBJECT.prototype.hasOwnProperty.call(o, prop);

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

export const isInstanceOf = <C extends Constructor<unknown>>(
  value: unknown,
  Class: C,
): value is InstanceType<C> => value instanceof Class;

export const constructorOf = (obj: object) => obj.constructor;

export const typeOf = (obj: unknown) => typeof obj;

export const typeOrClassOf = (obj: unknown) =>
  isObject(obj) ? constructorOf(obj)?.name : typeOf(obj);

export const parentOf = (element: Element | undefined | null) =>
  element?.parentElement || null;

export const childrenOf = (element: Element | undefined | null) =>
  element?.children || [];

export const targetOf = <O extends { target?: unknown } | null | undefined>(
  obj: O,
) =>
  obj?.target as O extends { target: infer T }
    ? T
    : O extends { target?: infer T }
      ? T | undefined
      : undefined;

export const currentTargetOf = <
  O extends { currentTarget?: unknown } | null | undefined,
>(
  obj: O,
) =>
  obj?.currentTarget as O extends { currentTarget: infer T }
    ? T
    : O extends { currentTarget?: infer T }
      ? T | undefined
      : undefined;

export const classList = <T extends Element | null | undefined>(element: T) =>
  element?.classList as T extends Element ? DOMTokenList : undefined;

const S_TABINDEX = "tabindex";
export const getTabIndex = (element: Element) => getAttr(element, S_TABINDEX);

export const setTabIndex = (element: Element, index = "0") =>
  setAttr(element, S_TABINDEX, index);

export const unsetTabIndex = (element: Element) => delAttr(element, S_TABINDEX);

export const remove = (obj: { remove: () => void } | null | undefined) =>
  obj?.remove();

export const deleteObjKey = <O extends object>(obj: O, key: keyof O) =>
  delete obj[key];

export const deleteKey = <K, V>(
  map: MapBase<K, V> | SetBase<K> | null | undefined,
  key: K,
) => map?.delete(key);

export const elScrollTo = (
  element: Element,
  coords: { top?: number; left?: number },
  behavior: ScrollBehavior = "instant",
) => element.scrollTo(merge({ behavior }, coords));

export const elScrollBy = (
  element: Element,
  coords: { top?: number; left?: number },
  behavior: ScrollBehavior = "instant",
) => element.scrollBy(merge({ behavior }, coords));

export const newPromise = <T>(
  executor: (
    resolve: (value: T) => void,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    reject: (reason?: any) => void,
  ) => void,
) => new Promise(executor);

export const newMap = <K, V>(entries?: readonly (readonly [K, V])[] | null) =>
  new Map(entries);

export const newWeakMap = <K extends WeakKey, V>(
  entries?: readonly (readonly [K, V])[] | null,
) => new WeakMap(entries);

export const newSet = <T>(values?: readonly T[] | null) => new Set(values);

export const newWeakSet = <T extends WeakKey>(values?: readonly T[] | null) =>
  new WeakSet(values);

export const newIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
) => new IntersectionObserver(callback, options);

export const newResizeObserver = (callback: ResizeObserverCallback) =>
  typeof ResizeObserver === "undefined" ? null : new ResizeObserver(callback);

export const newMutationObserver = (callback: MutationCallback) =>
  new MutationObserver(callback);

export const usageError = (msg: string) => new LisnUsageError(msg);

export const bugError = (msg: string) => new LisnBugError(msg);

export const illegalConstructorError = (useWhat: string) =>
  usageError(`Illegal constructor. Use ${useWhat}.`);

const CONSOLE = console;
export const consoleDebug = CONSOLE.debug.bind(CONSOLE);

export const consoleLog = CONSOLE.log.bind(CONSOLE);

export const consoleInfo = CONSOLE.info.bind(CONSOLE);

export const consoleWarn = CONSOLE.warn.bind(CONSOLE);

export const consoleError = CONSOLE.error.bind(CONSOLE);

// --------------------

type FirstElement<T extends readonly unknown[]> = T extends readonly [
  infer Head,
  ...infer Last__ignored,
]
  ? Head
  : T[number] | undefined;

type LastElement<T extends readonly unknown[]> = T extends readonly [
  ...infer Head__ignored,
  infer Last,
]
  ? Last
  : T[number] | undefined;

type ArrayCallbackFn<V> = (
  value: V,
  index: number,
  array: readonly V[],
) => unknown;
type FilterFnTypeP<V, T extends V> = (
  value: V,
  index: number,
  array: readonly V[],
) => value is T;
type FilteredType<
  C extends ArrayCallbackFn<V> | FilterFnTypeP<V, T>,
  V,
  T extends V,
> = C extends FilterFnTypeP<V, infer T> ? T : V;
