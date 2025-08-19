/**
 * @module
 * @ignore
 * @internal
 */

import * as M from "@lisn/_internal/minification";

import {
  BoundingRect,
  NestedRecord,
  IterableObject,
  Class,
  ClassInstance,
  GlobalClassByName,
  DOMElement,
} from "@lisn/globals/types";

// -------------------- String operations

export const kebabToCamelCase = (str: string) =>
  str.replace(/-./g, (m) => M.toUpperCase(m.charAt(1)));

export const camelToKebabCase = (str: string) =>
  str
    .replace(/[A-Z][a-z]/g, (m) => "-" + M.toLowerCase(m))
    .replace(/[A-Z]+/, (m) => "-" + M.toLowerCase(m));

export const toDataAttrName = (name: string) =>
  `data-${camelToKebabCase(name)}`;

// -------------------- DOM operations

export const createButton = (label = "", tag = "button") => {
  const btn = M.createElement(tag);
  M.setTabIndex(btn);
  M.setAttr(btn, M.S_ROLE, "button");
  M.setAttr(btn, M.ARIA_PREFIX + "label", label);
  return btn;
};

export const copyBoundingRectProps = (rect: BoundingRect): BoundingRect => {
  return {
    x: rect.x,
    left: rect.left,
    right: rect.right,
    [M.S_WIDTH]: rect[M.S_WIDTH],
    y: rect.y,
    top: rect.top,
    bottom: rect.bottom,
    [M.S_HEIGHT]: rect[M.S_HEIGHT],
  };
};

// -------------------- Array operations

export const filterBlank = <A extends readonly unknown[]>(
  array: A | null | undefined,
) => {
  const result = array
    ? M.filter(array, (v): v is NonNullable<A[number]> => !isEmpty(v))
    : void 0;

  return M.lengthOf(result) ? result : void 0;
};

// -------------------- Object operations

/**
 * Recursively copies the given value. Handles circular references.
 *
 * The following types are deeply copied:
 * - Plain objects (i.e. with prototype Object or null)
 * - Array
 * - ArrayBuffer, DataView and TypedArray
 * - Map
 * - Set
 * - Date
 * - RegExp
 *
 * Other values are returned as is
 *
 * @since v1.3.0
 */
export const deepCopy = <T>(value: T, _seen = new WeakMap()): T => {
  if (!isObject(value)) {
    // Primitive or function
    return value;
  }

  if (_seen.has(value)) {
    // Circular reference
    return _seen.get(value);
  }

  if (isArray(value)) {
    const out = new M.ARRAY(value.length);
    _seen.set(value, out);
    for (let i = 0; i < value.length; i++) {
      if (i in value) {
        out[i] = deepCopy(value[i], _seen);
      }
    }
    return out as T;
  }

  if (isMap(value)) {
    const out = M.newMap();
    _seen.set(value, out);
    for (const [k, v] of value) {
      const kCopy = deepCopy(k, _seen);
      const vCopy = deepCopy(v, _seen);
      out.set(kCopy, vCopy);
    }
    return out as T;
  }

  if (isSet(value)) {
    const out = M.newSet();
    _seen.set(value, out);
    for (const v of value) {
      out.add(deepCopy(v, _seen));
    }
    return out as T;
  }

  if (isOfType(value, "ArrayBuffer")) {
    return value.slice(0) as T;
  }

  if (isOfType(value, "DataView")) {
    const buf = deepCopy(value.buffer, _seen);
    return new DataView(buf, value.byteOffset, value.byteLength) as T;
  } else if (ArrayBuffer.isView(value)) {
    // DataView already handled above, so this is TypedArray:
    // Int8Array, Uint8Array, Float32Array, etc.
    const Ctor = value.constructor as { new (t: T): T };
    return new Ctor(value);
  }

  if (isOfType(value, "Date")) {
    return new Date(value.getTime()) as T;
  }

  if (isOfType(value, "RegExp")) {
    const flags = !isUndefined(value.flags)
      ? value.flags
      : (value.global ? "g" : "") +
        (value.ignoreCase ? "i" : "") +
        (value.multiline ? "m" : "") +
        (value.unicode ? "u" : "") +
        (value.sticky ? "y" : "") +
        (value.dotAll ? "s" : "");
    const copy = new RegExp(value.source, flags);
    copy.lastIndex = value.lastIndex;
    return copy as T;
  }

  if (!isPlainObject(value)) {
    // Non-clonable
    return value;
  }

  // Plain object (preserve prototype, if it's null & property descriptors,
  // including symbols)
  const out = M.OBJECT.create(M.getPrototypeOf(value));
  _seen.set(value, out);

  for (const key of Reflect.ownKeys(value)) {
    const desc = M.OBJECT.getOwnPropertyDescriptor(value, key);
    if (!desc) {
      continue;
    }

    if ("value" in desc) {
      // Data descriptor: deep copy the value
      desc.value = deepCopy(desc.value, _seen);
    }
    // Otherwise it's accessor descriptor: keep same getter/setter references
    // (cannot deep copy closures, so we redefine them as is)
    M.defineProperty(out, key, desc);
  }

  return out;
};

/**
 * For all keys present in `toObj`, if the key is also in `fromObj`, it copies
 * the value recursively from `fromObj` into `toObj` in place.
 *
 * Plain objects are recursed into, but other values are copied as is.
 *
 * @since v1.3.0 Was previously called copyExistingKeys
 */
export const copyExistingKeysTo = <T extends NestedRecord<V>, V>(
  fromObj: T,
  toObj: T,
) => {
  for (const key in toObj) {
    if (!M.hasOwnProp(toObj, key)) {
      continue;
    }

    if (key in fromObj) {
      const current = toObj[key];
      const updated = fromObj[key];
      if (isPlainObject(updated) && isPlainObject(current)) {
        copyExistingKeysTo(updated, current);
      } else if (!isUndefined(updated)) {
        toObj[key] = updated;
      }
    }
  }
};

/**
 * Omits the keys in object `keysToRm` from `obj`. This is to avoid hardcording
 * the key names as a string so as to allow minifier to mangle them, and to
 * avoid using object spread.
 */
export const omitKeys = <
  T extends object,
  R extends { [K in keyof T]?: unknown },
>(
  obj: T,
  keysToRm: R,
): Omit<T, keyof R> => {
  const res: Partial<T> = {};

  for (const key in obj) {
    if (!(key in keysToRm)) {
      res[key] = obj[key];
    }
  }

  return res as Omit<T, keyof R>;
};

/**
 * For all keys present in `keysToSelect`, if the key is also in `fromObj`, it
 * copies the value **non-recursively**, as is, from `fromObj` into `toObj` in
 * place.
 *
 * @since v1.3.0
 */
export const copySelectKeysTo = <
  T extends object,
  R extends { [K in keyof T]?: unknown },
>(
  fromObj: T,
  toObj: T,
  keysToSelect: R,
) => {
  for (const key in fromObj) {
    if (key in keysToSelect) {
      toObj[key] = fromObj[key];
    }
  }
};

export const keyExists = <T extends object>(
  obj: T,
  key: string | number | symbol,
): key is keyof T => isObject(obj) && key in obj;

// -------------------- Misc

export const getPointerType = (event: Event) =>
  isPointerEvent(event)
    ? event.pointerType
    : isMouseEvent(event)
      ? "mouse"
      : null;

// -------------------- Type checking

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

export const isNull = (v: unknown) => v === null;

export const isUndefined = (v: unknown) => v === void 0;

export const isNullish = (v: unknown) => isNull(v) || isUndefined(v);

export const isEmpty = (v: unknown) => isNullish(v) || v === "";

export const isOfType = <T extends keyof StringTagMap>(
  v: unknown,
  tag: T,
  checkLevelsUp = 0,
): v is StringTagMap[T] =>
  isInstanceOfByClassName(v, tag) ||
  M.OBJECT.prototype.toString.call(v) === `[object ${tag}]` ||
  (checkLevelsUp > 0 && isOfType(M.getPrototypeOf(v), tag, checkLevelsUp - 1));

// Not including function
export const isObject = (v: unknown) => !isNull(v) && typeof v === "object";

export const isPlainObject = (
  v: unknown,
): v is Record<string | symbol, unknown> =>
  isObject(v) &&
  (isNull(M.getPrototypeOf(v)) ||
    isNull(M.getPrototypeOf(M.getPrototypeOf(v))));

export const isIterableObject = (v: unknown): v is IterableObject<unknown> =>
  isObject(v) && M.SYMBOL.iterator in v;

export const isArray = M.ARRAY.isArray.bind(M.ARRAY);

export const isPrimitive = (v: unknown) =>
  isLiteralString(v) ||
  isSymbol(v) ||
  isLiteralNumber(v) ||
  isBoolean(v) ||
  isNullish(v);

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
  isPointerEvent(event) && getPointerType(event) === M.S_TOUCH;

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
  (isHTMLElement(target) && M.hasTagName(target, "input"));

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

// ---------- Branding

export const brandClass = <C extends Class<T>, T>(
  Class: C,
  name: string,
): C => {
  const brandSym = M.SYMBOL.for(`LISN.js/${name}`);

  for (const [onProto, prop, value] of [
    [true, M.SYMBOL.toStringTag, name],
    [true, LISN_BRAND_PROP, brandSym],
    [false, "name", name],
  ] as const) {
    M.defineProperty(onProto ? Class.prototype : Class, prop, {
      value,
      enumerable: false,
      writable: false,
      configurable: false,
    });
  }

  return Class;
};

// ------------------------------

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

const LISN_BRAND_PROP: unique symbol = M.SYMBOL.for(
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
    : void 0;

  if (!clsBrandSym) {
    return false;
  }

  const valBrandSym = (value as { [LISN_BRAND_PROP]: symbol | undefined })[
    LISN_BRAND_PROP
  ];
  return (
    valBrandSym == clsBrandSym ||
    isInstanceOfLisnClass(M.getPrototypeOf(value), Class)
  );
};

const isInstanceOfByClassName = <C extends keyof typeof globalThis>(
  value: unknown,
  className: C,
): value is GlobalClassByName<C> =>
  isInstanceOfByClass(value, globalThis[className]);
