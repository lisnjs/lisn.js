/**
 * @module
 * @ignore
 * @internal
 */

import * as MH from "@lisn/globals/minification-helpers";

import { NestedRecord } from "@lisn/globals/types";

import { roundNumTo } from "@lisn/utils/math";

/**
 * Copies object deeply including nested properties. Plain objects are recursed
 * into, arrays and sets are cloned, but other values are copied as is.
 *
 * @since v1.3.0
 */
export const deepCopy = <T extends NestedRecord<V>, V>(obj: T): T => {
  // XXX TODO generalise it to work with arbitrary values and copy each iterable
  // element
  const clone = MH.copyObject(obj); // shallow copy

  for (const key in clone) {
    const value = obj[key];
    if (MH.isPlainObject(value)) {
      clone[key] = deepCopy(value) as T[typeof key];
    } else if (MH.isArray(value)) {
      clone[key] = [...value] as T[typeof key]; // TODO deep copy each element
    } else if (MH.isInstanceOf(value, Set)) {
      clone[key] = MH.newSet(value) as T[typeof key]; // TODO deep copy each element
    }
  }

  return clone;
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
    } else if (MH.isNumber(valA) && MH.isNumber(valB)) {
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
): key is keyof T => MH.isNonPrimitive(obj) && key in obj;

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
