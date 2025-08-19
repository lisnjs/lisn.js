/**
 * For minification optimization
 *
 * @module
 * @ignore
 * @internal
 */

import { MapBase, SetBase } from "@lisn/globals/types";

// -------------------- CONSTANTS

// credit: underscore.js
export const root: typeof globalThis =
  (typeof globalThis === "object" &&
    globalThis.globalThis === globalThis &&
    globalThis) ||
  (typeof self === "object" && self.self === self && self) ||
  (typeof global == "object" && global.global === global && global) ||
  Function("return this")() ||
  {};

export const PREFIX = "lisn";
export const LOG_PREFIX = "[LISN.js]";

export const OBJECT = Object;
export const SYMBOL = Symbol;
export const ARRAY = Array;
export const STRING = String;
export const FUNCTION = Function;
export const MATH = Math;
export const NUMBER = Number;
export const PROMISE = Promise;

export const INFINITY = Infinity;

export const S_ABSOLUTE = "absolute";
export const S_FIXED = "fixed";
export const S_STICKY = "sticky";

export const S_WIDTH = "width";
export const S_HEIGHT = "height";

export const S_TOP = "top";
export const S_BOTTOM = "bottom";

export const S_UP = "up";
export const S_DOWN = "down";

export const S_LEFT = "left";
export const S_RIGHT = "right";

export const S_AT = "at";
export const S_ABOVE = "above";
export const S_BELOW = "below";

export const S_IN = "in";
export const S_OUT = "out";

export const S_NONE = "none";
export const S_AMBIGUOUS = "ambiguous";

export const S_ADDED = "added";
export const S_REMOVED = "removed";
export const S_ATTRIBUTE = "attribute";

export const S_KEY = "key";
export const S_MOUSE = "mouse";
export const S_POINTER = "pointer";
export const S_TOUCH = "touch";
export const S_WHEEL = "wheel";
export const S_CLICK = "click";
export const S_HOVER = "hover";
export const S_PRESS = "press";

export const S_SCROLL = "scroll";
export const S_ZOOM = "zoom";
export const S_DRAG = "drag";
export const S_UNKNOWN = "unknown";

export const S_SCROLL_TOP = `${S_SCROLL}Top`;
export const S_SCROLL_LEFT = `${S_SCROLL}Left`;

export const S_SCROLL_WIDTH = `${S_SCROLL}Width`;
export const S_SCROLL_HEIGHT = `${S_SCROLL}Height`;

export const S_CLIENT_WIDTH = "clientWidth";
export const S_CLIENT_HEIGHT = "clientHeight";

export const S_SCROLL_TOP_FRACTION = `${S_SCROLL}TopFraction`;
export const S_SCROLL_LEFT_FRACTION = `${S_SCROLL}LeftFraction`;

export const S_HORIZONTAL = "horizontal";
export const S_VERTICAL = "vertical";
export const S_SKIP_INITIAL = "skipInitial";
export const S_DEBOUNCE_WINDOW = "debounceWindow";
export const S_TOGGLE = "toggle";

export const S_CANCEL = "cancel";

export const S_KEYDOWN = `${S_KEY}${S_DOWN}`;

export const S_MOUSEUP = `${S_MOUSE}${S_UP}`;
export const S_MOUSEDOWN = `${S_MOUSE}${S_DOWN}`;
export const S_MOUSEMOVE = `${S_MOUSE}move`;

export const S_POINTERUP = `${S_POINTER}${S_UP}`;
export const S_POINTERDOWN = `${S_POINTER}${S_DOWN}`;
export const S_POINTERENTER = `${S_POINTER}enter`;
export const S_POINTERLEAVE = `${S_POINTER}leave`;
export const S_POINTERMOVE = `${S_POINTER}move`;
export const S_POINTERCANCEL = `${S_POINTER}${S_CANCEL}`;

export const S_TOUCHSTART = `${S_TOUCH}start`;
export const S_TOUCHEND = `${S_TOUCH}end`;
export const S_TOUCHMOVE = `${S_TOUCH}move`;
export const S_TOUCHCANCEL = `${S_TOUCH}${S_CANCEL}`;

export const S_DRAGSTART = `${S_DRAG}start`;
export const S_DRAGEND = `${S_DRAG}end`;
export const S_DRAGENTER = `${S_DRAG}enter`;
export const S_DRAGOVER = `${S_DRAG}over`;
export const S_DRAGLEAVE = `${S_DRAG}leave`;
export const S_DROP = "drop";

export const S_SELECTSTART = "selectstart";

export const S_ATTRIBUTES = "attributes";
export const S_CHILD_LIST = "childList";

export const S_REVERSE = "reverse";
export const S_DRAGGABLE = "draggable";
export const S_DISABLED = "disabled";

export const S_ARROW = "arrow";

export const S_ROLE = "role";

export const S_AUTO = "auto";
export const S_VISIBLE = "visible";

export const ARIA_PREFIX = "aria-";
export const S_ARIA_CONTROLS = ARIA_PREFIX + "controls";

export const PREFIX_RELATIVE = `${PREFIX}-relative`;
export const PREFIX_WRAPPER = `${PREFIX}-wrapper`;
export const PREFIX_WRAPPER_CONTENT = `${PREFIX_WRAPPER}-content`;
export const PREFIX_WRAPPER_INLINE = `${PREFIX_WRAPPER}-inline`;
export const PREFIX_TRANSITION = `${PREFIX}-transition`;
export const PREFIX_TRANSITION_DISABLE = `${PREFIX_TRANSITION}__disable`;
export const PREFIX_HIDE = `${PREFIX}-hide`;
export const PREFIX_SHOW = `${PREFIX}-show`;
export const PREFIX_DISPLAY = `${PREFIX}-display`;
export const PREFIX_UNDISPLAY = `${PREFIX}-undisplay`;
export const PREFIX_PLACE = `${PREFIX}-place`;
export const PREFIX_ORIENTATION = `${PREFIX}-orientation`;
export const PREFIX_POSITION = `${PREFIX}-position`;
export const PREFIX_GHOST = `${PREFIX}-ghost`;
export const PREFIX_BORDER_SIZE = `${PREFIX}-border-size`;
export const PREFIX_NO_SELECT = `${PREFIX}-no-select`;
export const PREFIX_NO_TOUCH_ACTION = `${PREFIX}-no-touch-action`;
export const PREFIX_NO_WRAP = `${PREFIX}-no-wrap`;

export const S_ANIMATE = "animate";
export const ANIMATE_PREFIX = `${PREFIX}-${S_ANIMATE}__`;
export const PREFIX_ANIMATE_DISABLE = `${ANIMATE_PREFIX}disable`;
export const PREFIX_ANIMATE_PAUSE = `${ANIMATE_PREFIX}pause`;
export const PREFIX_ANIMATE_REVERSE = `${ANIMATE_PREFIX}${S_REVERSE}`;
export const PREFIX_ANIMATE_INFINITE = `${ANIMATE_PREFIX}infinite`;

// -------------------- String prefixing

export const prefixName = (name: string) => `${PREFIX}-${name}`;

export const prefixCssVar = (name: string) => "--" + prefixName(name);

export const prefixCssJsVar = (name: string) => prefixCssVar("js--" + name);

// -------------------- Global and common functions

// ---------- DOM

export const hasDOM = () => typeof document !== "undefined";

export const getWindow = () => window;

export const getDoc = () => document;

export const getDocElement = () => getDoc().documentElement;

export const getDocScrollingElement = () =>
  getDoc().scrollingElement as HTMLElement | null;

export const getBody = () => getDoc().body;

export const getReadyState = () => getDoc().readyState;

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

export const getBoundingClientRect = (element: Element) =>
  element.getBoundingClientRect();

export const tagName = (element: Element) => element.tagName;

// case-insensitive
export const hasTagName = (element: Element, tag: string) =>
  toUpperCase(tagName(element)) === toUpperCase(tag);

export const parentOf = (element: Element | undefined | null) =>
  element?.parentElement ?? null;

export const childrenOf = (element: Element | undefined | null) =>
  element?.children || [];

export const closestParent = (element: Element, selector: string) =>
  element.closest(selector);

export const createElement = (
  tagName: string,
  options?: ElementCreationOptions,
) => getDoc().createElement(tagName, options);

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

// ---------- Browser

export const userAgent =
  typeof navigator === "undefined" ? "" : navigator.userAgent;

export const onAnimationFrame = (callback: FrameRequestCallback) =>
  requestAnimationFrame(callback);

export const setTimer = root.setTimeout.bind(root);

export const clearTimer = root.clearTimeout.bind(root);

export const timeNow = Date.now.bind(Date);

export const timeSince = (startTime: number) => timeNow() - startTime;

// ---------- String

export const toLowerCase = (s: string) => s.toLowerCase();

export const toUpperCase = (s: string) => s.toUpperCase();

export const strReplace = (
  s: string,
  match: string | RegExp,
  replacement: string,
) => s.replace(match, replacement);

// ---------- Events

export const preventDefault = (event: Event) => event.preventDefault();

export function targetOf<T>(obj: { target: T }): T;
export function targetOf(obj: object | null | undefined): undefined;
export function targetOf(obj: object | null | undefined) {
  return obj && "target" in obj ? obj.target : void 0;
}

export function currentTargetOf<T>(obj: { currentTarget: T }): T;
export function currentTargetOf(obj: object | null | undefined): undefined;
export function currentTargetOf(obj: object | null | undefined) {
  return obj && "currentTarget" in obj ? obj.currentTarget : void 0;
}

// ---------- Array-like

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

export const sizeOf = (obj: { size: number } | null | undefined) =>
  obj?.size ?? 0;

export const lengthOf = (obj: { length: number } | null | undefined) =>
  obj?.length ?? 0;

export const lastOf = <A extends readonly unknown[]>(a: A | null | undefined) =>
  a?.slice(-1)[0] as LastElement<A>;

export const firstOf = <A extends readonly unknown[]>(
  a: A | null | undefined,
) => a?.slice(0, 1)[0] as FirstElement<A>;

export const arrayFrom = ARRAY.from.bind(ARRAY);

// ---------- Objects

export const assign = OBJECT.assign.bind(OBJECT);

export const defineProperty = OBJECT.defineProperty.bind(OBJECT);

export const getPrototypeOf = OBJECT.getPrototypeOf.bind(OBJECT);

export const preventExtensions = OBJECT.preventExtensions.bind(OBJECT);

export const freezeObj = OBJECT.freeze.bind(OBJECT);

export const hasOwnProp = (o: object, prop: string | symbol) =>
  OBJECT.prototype.hasOwnProperty.call(o, prop);

export const keysOf = <T extends Record<string | symbol, unknown>>(
  obj: T,
): Array<keyof T & string> => OBJECT.keys(obj);

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

export const deleteObjKey = <O extends object>(obj: O, key: keyof O) =>
  delete obj[key];

// ---------- Promises

export const promiseResolve = PROMISE.resolve.bind(PROMISE);

export const promiseAll = PROMISE.all.bind(PROMISE);

export const createPromise = <T>(
  executor: (
    resolve: (value: T) => void,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    reject: (reason?: any) => void,
  ) => void,
) => new Promise(executor);

// ---------- Math

export const floor = MATH.floor.bind(MATH);

export const ceil = MATH.ceil.bind(MATH);

export const log2 = MATH.log2.bind(MATH);

export const sqrt = MATH.sqrt.bind(MATH);

export const max = MATH.max.bind(MATH);

export const min = MATH.min.bind(MATH);

export const abs = MATH.abs.bind(MATH);

export const round = MATH.round.bind(MATH);

export const pow = MATH.pow.bind(MATH);

export const exp = MATH.exp.bind(MATH);

export const cos = MATH.cos.bind(MATH);

export const sin = MATH.sin.bind(MATH);

export const tan = MATH.tan.bind(MATH);

export const random = MATH.random.bind(MATH);

export const parseFloat = NUMBER.parseFloat.bind(NUMBER);

export const isNaN = NUMBER.isNaN.bind(NUMBER);

// ---------- Maps and Sets

export const createMap = <K, V>(
  entries?: readonly (readonly [K, V])[] | null,
) => new Map(entries);

export const createWeakMap = <K extends WeakKey, V>(
  entries?: readonly (readonly [K, V])[] | null,
) => new WeakMap(entries);

export const createSet = <T>(values?: readonly T[] | null) => new Set(values);

export const createWeakSet = <T extends WeakKey>(
  values?: readonly T[] | null,
) => new WeakSet(values);

export const deleteKey = <K, V>(
  map: MapBase<K, V> | SetBase<K> | null | undefined,
  key: K,
) => map?.delete(key);

// ---------- Misc

export const stringify = JSON.stringify.bind(JSON);

// Call the remove method on an object that has it
export const remove = <A extends readonly unknown[]>(
  obj: { remove: (...args: A) => void } | null | undefined,
  ...args: A
) => obj?.remove(...args);

export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
) => new IntersectionObserver(callback, options);

export const createResizeObserver = (callback: ResizeObserverCallback) =>
  typeof ResizeObserver === "undefined" ? null : new ResizeObserver(callback);

export const createMutationObserver = (callback: MutationCallback) =>
  new MutationObserver(callback);

// ---------- Console

const CONSOLE = console;
export const consoleDebug = CONSOLE.debug.bind(CONSOLE);

export const consoleLog = CONSOLE.log.bind(CONSOLE);

export const consoleInfo = CONSOLE.info.bind(CONSOLE);

export const consoleWarn = CONSOLE.warn.bind(CONSOLE);

export const consoleError = CONSOLE.error.bind(CONSOLE);

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

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type Spread<A extends readonly [...any]> = A extends [infer L]
  ? L extends null | undefined
    ? EmptyLiteral
    : L
  : A extends [infer L, ...infer R]
    ? SpreadTwo<L extends null | undefined ? EmptyLiteral : L, Spread<R>>
    : unknown;

type OptionalPropertyNames<T> = {
  /* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
  [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never;
}[keyof T];

type SpreadProperties<L, R, K extends keyof L & keyof R> = {
  [P in K]: L[P] | Exclude<R[P], undefined>;
};

type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

type SpreadTwo<L, R> = Id<
  Pick<L, Exclude<keyof L, keyof R>> &
    Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>> &
    Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>> &
    SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>;

const EMPTY__ignored = {} as const;

type EmptyLiteral = typeof EMPTY__ignored;
