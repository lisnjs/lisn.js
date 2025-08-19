/**
 * @module
 * @ignore
 * @internal
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { NestedRecord } from "@lisn/globals/types";

import { roundNumTo } from "@lisn/utils/math";

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
  if (!MH.isObject(value)) {
    // Primitive or function
    return value;
  }

  if (_seen.has(value)) {
    // Circular reference
    return _seen.get(value);
  }

  if (MH.isArray(value)) {
    const out = new MC.ARRAY(value.length);
    _seen.set(value, out);
    for (let i = 0; i < value.length; i++) {
      if (i in value) {
        out[i] = deepCopy(value[i], _seen);
      }
    }
    return out as T;
  }

  if (MH.isMap(value)) {
    const out = MH.newMap();
    _seen.set(value, out);
    for (const [k, v] of value) {
      const kCopy = deepCopy(k, _seen);
      const vCopy = deepCopy(v, _seen);
      out.set(kCopy, vCopy);
    }
    return out as T;
  }

  if (MH.isSet(value)) {
    const out = MH.newSet();
    _seen.set(value, out);
    for (const v of value) {
      out.add(deepCopy(v, _seen));
    }
    return out as T;
  }

  if (MH.isOfType(value, "ArrayBuffer")) {
    return value.slice(0) as T;
  }

  if (MH.isOfType(value, "DataView")) {
    const buf = deepCopy(value.buffer, _seen);
    return new DataView(buf, value.byteOffset, value.byteLength) as T;
  } else if (ArrayBuffer.isView(value)) {
    // DataView already handled above, so this is TypedArray:
    // Int8Array, Uint8Array, Float32Array, etc.
    const Ctor = value.constructor as { new (t: T): T };
    return new Ctor(value);
  }

  if (MH.isOfType(value, "Date")) {
    return new Date(value.getTime()) as T;
  }

  if (MH.isOfType(value, "RegExp")) {
    const flags =
      value.flags !== undefined
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

  if (!MH.isPlainObject(value)) {
    // Non-clonable
    return value;
  }

  // Plain object (preserve prototype, if it's null & property descriptors,
  // including symbols)
  const out = MC.OBJECT.create(MH.getPrototypeOf(value));
  _seen.set(value, out);

  for (const key of Reflect.ownKeys(value)) {
    const desc = MC.OBJECT.getOwnPropertyDescriptor(value, key);
    if (!desc) {
      continue;
    }

    if ("value" in desc) {
      // Data descriptor: deep copy the value
      desc.value = deepCopy(desc.value, _seen);
    }
    // Otherwise it's accessor descriptor: keep same getter/setter references
    // (cannot deep copy closures, so we redefine them as is)
    MH.defineProperty(out, key, desc);
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
    if (!MH.hasOwnProp(toObj, key)) {
      continue;
    }

    if (key in fromObj) {
      const current = toObj[key];
      const updated = fromObj[key];
      if (MH.isPlainObject(updated) && MH.isPlainObject(current)) {
        copyExistingKeysTo(updated, current);
      } else if (updated !== undefined) {
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

/**
 * Returns true if the two objects are equal. If values are numeric, it will
 * round to the given number of decimal places.
 */
export const compareValuesIn = <T extends NestedRecord<V>, V>(
  objA: T,
  objB: T,
  roundTo = 3,
) => {
  for (const key in objA) {
    if (!MH.hasOwnProp(objA, key)) {
      continue;
    }

    const valA = objA[key];
    const valB = objB[key];

    if (MH.isPlainObject(valA) && MH.isPlainObject(valB)) {
      if (!compareValuesIn(valA, valB)) {
        return false;
      }
    } else if (MH.isLiteralNumber(valA) && MH.isLiteralNumber(valB)) {
      if (roundNumTo(valA, roundTo) !== roundNumTo(valB, roundTo)) {
        return false;
      }
    } else if (valA !== valB) {
      return false;
    }
  }

  return true;
};

export const keyExists = <T extends object>(
  obj: T,
  key: string | number | symbol,
): key is keyof T => MH.isObject(obj) && key in obj;

export const toArrayIfSingle = <T>(value?: T | T[] | null | undefined): T[] =>
  MH.isArray(value) ? value : !MH.isNullish(value) ? [value] : [];

export const toBoolean = (value: unknown) =>
  value === true || value === "true" || value === ""
    ? true
    : MH.isNullish(value) || value === false || value === "false"
      ? false
      : null;

/**
 * @deprecated
 *
 * Deprecated alias for {@link toBoolean}
 */
export const toBool = toBoolean;
