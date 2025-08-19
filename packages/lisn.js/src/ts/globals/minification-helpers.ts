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
  Class,
  ClassInstance,
  GlobalClassByName,
  MapBase,
  SetBase,
  Spread,
  EmptyLiteral,
  DOMElement,
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

export const toDataAttrName = (name: string) =>
  `data-${camelToKebabCase(name)}`;

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

export const isNullish = (v: unknown) => v === undefined || v === null;

export const isEmpty = (v: unknown) => isNullish(v) || v === "";

export const isOfType = <T extends keyof StringTagMap>(
  v: unknown,
  tag: T,
  checkLevelsUp = 0,
): v is StringTagMap[T] =>
  isInstanceOfByClassName(v, tag) ||
  MC.OBJECT.prototype.toString.call(v) === `[object ${tag}]` ||
  (checkLevelsUp > 0 && isOfType(getPrototypeOf(v), tag, checkLevelsUp - 1));

// Not including function
export const isObject = (v: unknown) => v !== null && typeof v === "object";

export const isPlainObject = (
  v: unknown,
): v is Record<string | symbol, unknown> =>
  isObject(v) &&
  (getPrototypeOf(v) === null || getPrototypeOf(getPrototypeOf(v)) === null);

export const isIterableObject = (v: unknown): v is IterableObject<unknown> =>
  isObject(v) && MC.SYMBOL.iterator in v;

export const isArray = MC.ARRAY.isArray.bind(MC.ARRAY);

export const isPrimitive = (v: unknown) =>
  isLiteralString(v) ||
  isSymbol(v) ||
  isLiteralNumber(v) ||
  isBoolean(v) ||
  isNullish(v);

// only primitive number
export const isLiteralNumber = (v: unknown) => typeof v === "number";

export const isNumber = (v: unknown) => isOfType(v, "Number");

export const isString = (v: unknown) => isOfType(v, "String");

export const isLiteralString = (v: unknown) => typeof v === "string";

export const isSymbol = (v: unknown) => typeof v === "symbol";

export const isBoolean = (v: unknown) => typeof v === "boolean";

export const isFunction = (v: unknown) =>
  typeof v === "function" || isOfType(v, "Function");

export const isMap = (v: unknown) => isOfType(v, "Map");

export const isSet = (v: unknown) => isOfType(v, "Set");

export const isMouseEvent = (event: Event) => isOfType(event, "MouseEvent");

export const isPointerEvent = (event: Event) => isOfType(event, "PointerEvent");

export const isTouchPointerEvent = (event: Event): event is PointerEvent =>
  isPointerEvent(event) && getPointerType(event) === MC.S_TOUCH;

export const isWheelEvent = (event: Event) => isOfType(event, "WheelEvent");

export const isKeyboardEvent = (event: Event) =>
  isOfType(event, "KeyboardEvent");

export const isTouchEvent = (event: Event) => isOfType(event, "TouchEvent");

export const isDoc = (target: unknown) => isOfType(target, "HTMLDocument");

export const isNode = (target: unknown): target is Node =>
  (typeof Node === "function" && isInstanceOf(target, Node)) ||
  (target != null &&
    typeof (target as Node).nodeType === "number" &&
    typeof (target as Node).nodeName === "string");

export const isElement = (target: unknown): target is Element =>
  isNode(target) && target.nodeType === 1;

export const isStyledElement = <
  N extends keyof ElementNamespaceMap | undefined,
>(
  target: unknown,
  namespace?: N,
): target is N extends keyof ElementNamespaceMap
  ? ElementNamespaceMap[N]
  : DOMElement =>
  isElement(target) &&
  isObject((target as HTMLElement).style) &&
  (!namespace || target.namespaceURI === namespace);

export const isHTMLElement = (target: unknown) =>
  (typeof HTMLElement === "function" && isInstanceOf(target, HTMLElement)) ||
  isStyledElement(target, HTML_NS);

export const isSVGElement = (target: unknown) =>
  (typeof SVGElement === "function" && isInstanceOf(target, SVGElement)) ||
  isStyledElement(target, SVG_NS);

export const isMathMLElement = (target: unknown) =>
  (typeof MathMLElement === "function" &&
    isInstanceOf(target, MathMLElement)) ||
  isStyledElement(target, MATHML_NS);

export const isHTMLInputElement = (
  target: unknown,
): target is HTMLInputElement =>
  (typeof HTMLInputElement === "function" &&
    isInstanceOf(target, HTMLInputElement)) ||
  (isHTMLElement(target) && hasTagName(target, "input"));

export const isAnimation = (value: unknown) =>
  (typeof Animation === "function" && isInstanceOf(value, Animation)) ||
  isOfType(value, "Animation", 2);

export const isCSSAnimation = (value: unknown) =>
  (typeof CSSAnimation === "function" && isInstanceOf(value, CSSAnimation)) ||
  isOfType(value, "CSSAnimation", 2);

export const isKeyframeEffect = (value: unknown) =>
  (typeof KeyframeEffect === "function" &&
    isInstanceOf(value, KeyframeEffect)) ||
  isOfType(value, "KeyframeEffect");

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

export const closestParent = (element: Element, selector: string) =>
  element.closest(selector);

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

// case-insensitive
export const hasTagName = (element: Element, tag: string) =>
  toUpperCase(tagName(element)) === toUpperCase(tag);

export const preventDefault = (event: Event) => event.preventDefault();

export const arrayFrom = MC.ARRAY.from.bind(MC.ARRAY);

export const keysOf = <T extends Record<string | symbol, unknown>>(
  obj: T,
): Array<keyof T & string> => MC.OBJECT.keys(obj);

// use it in place of object spread
export const merge = <A extends readonly (object | null | undefined)[]>(
  ...a: [...A]
) => {
  return assign({}, ...a) as Spread<A>;
};

export function copyObject<T extends object>(obj: T): T;
export function copyObject(obj: null | undefined): EmptyLiteral;
// implementation (wide) — callers see the overloads, not this signature
export function copyObject(obj: object | null | undefined) {
  return merge(obj);
}

export const promiseResolve = MC.PROMISE.resolve.bind(MC.PROMISE);

export const promiseAll = MC.PROMISE.all.bind(MC.PROMISE);

export const assign = MC.OBJECT.assign.bind(MC.OBJECT);

export const freezeObj = MC.OBJECT.freeze.bind(MC.OBJECT);

export const hasOwnProp = (o: object, prop: string | symbol) =>
  MC.OBJECT.prototype.hasOwnProperty.call(o, prop);

export const defineProperty = MC.OBJECT.defineProperty.bind(MC.OBJECT);

export const getPrototypeOf = MC.OBJECT.getPrototypeOf.bind(MC.OBJECT);

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

export const exp = MC.MATH.exp.bind(MC.MATH);

export const cos = MC.MATH.cos.bind(MC.MATH);

export const sin = MC.MATH.sin.bind(MC.MATH);

export const tan = MC.MATH.tan.bind(MC.MATH);

export const parseFloat = MC.NUMBER.parseFloat.bind(MC.NUMBER);

export const isNaN = MC.NUMBER.isNaN.bind(MC.NUMBER);

export const isInstanceOf = <
  C extends Class<unknown> | keyof typeof globalThis,
>(
  value: unknown,
  classOrName: C,
  checkLisnBrand = false,
): value is C extends keyof typeof globalThis
  ? GlobalClassByName<C>
  : ClassInstance<C> =>
  isLiteralString(classOrName)
    ? isInstanceOfByClassName(value, classOrName)
    : isInstanceOfByClass(value, classOrName, checkLisnBrand);

export const constructorOf = (obj: object) => obj.constructor;

export const typeOf = (obj: unknown) => typeof obj;

export const typeOrClassOf = (obj: unknown) =>
  isObject(obj) ? constructorOf(obj)?.name : typeOf(obj);

export const parentOf = (element: Element | undefined | null) =>
  element?.parentElement ?? null;

export const childrenOf = (element: Element | undefined | null) =>
  element?.children || [];

export function targetOf<T>(obj: { target: T }): T;
export function targetOf(obj: object | null | undefined): undefined;
export function targetOf(obj: object | null | undefined) {
  return obj && "target" in obj ? obj.target : undefined;
}

export function currentTargetOf<T>(obj: { currentTarget: T }): T;
export function currentTargetOf(obj: object | null | undefined): undefined;
export function currentTargetOf(obj: object | null | undefined) {
  return obj && "currentTarget" in obj ? obj.currentTarget : undefined;
}

export function classList(element: Element): DOMTokenList;
export function classList(element: null | undefined): undefined;
export function classList(element: Element | null | undefined) {
  return element?.classList;
}

const S_TABINDEX = "tabindex";
export const getTabIndex = (element: Element) => getAttr(element, S_TABINDEX);

export const setTabIndex = (element: Element, index = "0") =>
  setAttr(element, S_TABINDEX, index);

export const unsetTabIndex = (element: Element) => delAttr(element, S_TABINDEX);

export const remove = <A extends readonly unknown[]>(
  obj: { remove: (...args: A) => void } | null | undefined,
  ...args: A
) => obj?.remove(...args);

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

export const brandClass = <C extends Class<T>, T>(
  Class: C,
  name: string,
): C => {
  const brandSym = MC.SYMBOL.for(`LISN.js/${name}`);

  for (const [prop, value] of [
    [MC.SYMBOL.toStringTag, name],
    [LISN_BRAND_PROP, brandSym],
  ]) {
    defineProperty(Class.prototype, prop, {
      value,
      enumerable: false,
      writable: false,
      configurable: false,
    });
  }

  return Class;
};

// --------------------

type StringTagMap = {
  /* eslint-disable-next-line @typescript-eslint/no-wrapper-object-types */
  Number: Number | number;
  /* eslint-disable-next-line @typescript-eslint/no-wrapper-object-types */
  String: String | string;
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type */
  Function: Function;
  Error: Error;
  Date: Date;
  RegExp: RegExp;

  Array: unknown[];
  Map: Map<unknown, unknown>;
  Set: Set<unknown>;
  ArrayBuffer: ArrayBuffer;
  DataView: DataView;
  DOMMatrix: DOMMatrix;
  DOMMatrixReadOnly: DOMMatrixReadOnly;

  MouseEvent: MouseEvent;
  PointerEvent: PointerEvent;
  WheelEvent: WheelEvent;
  KeyboardEvent: KeyboardEvent;
  TouchEvent: TouchEvent;
  HTMLDocument: Document;

  IntersectionObserverEntry: IntersectionObserverEntry;

  Animation: Animation;
  CSSAnimation: CSSAnimation;
  KeyframeEffect: KeyframeEffect;
};

type ElementNamespaceMap = {
  [HTML_NS]: HTMLElement;
  [SVG_NS]: SVGElement;
  [MATHML_NS]: MathMLElement;
};

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

const LISN_BRAND_PROP: unique symbol = MC.SYMBOL.for(
  "__lisn.js:brand",
) as typeof LISN_BRAND_PROP;

const HTML_NS = "http://www.w3.org/1999/xhtml";
const SVG_NS = "http://www.w3.org/2000/svg";
const MATHML_NS = "http://www.w3.org/1998/Math/MathML";

const isInstanceOfByClass = <C extends Class<unknown>>(
  value: unknown,
  Class: C,
  checkLisnBrand = false,
): value is ClassInstance<C> => {
  if (!isFunction(Class) || !isObject(value)) {
    return false;
  }

  if (value instanceof Class) {
    return true;
  }

  return checkLisnBrand ? isInstanceOfLisnClass(value, Class) : false;
};

const isInstanceOfLisnClass = <C extends Class<unknown>>(
  value: unknown,
  Class: C,
): value is ClassInstance<C> => {
  if (!isFunction(Class) || !isObject(value)) {
    return false;
  }

  const proto = Class.prototype;
  const clsBrandSym = isObject(proto)
    ? (proto as { [LISN_BRAND_PROP]: symbol })[LISN_BRAND_PROP]
    : undefined;

  if (!clsBrandSym) {
    return false;
  }

  const valBrandSym = (value as { [LISN_BRAND_PROP]: symbol | undefined })[
    LISN_BRAND_PROP
  ];
  return (
    valBrandSym == clsBrandSym ||
    isInstanceOfLisnClass(getPrototypeOf(value), Class)
  );
};

const isInstanceOfByClassName = <C extends keyof typeof globalThis>(
  value: unknown,
  className: C,
): value is GlobalClassByName<C> =>
  isInstanceOfByClass(value, globalThis[className]);
