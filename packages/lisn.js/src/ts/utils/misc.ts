/**
 * @module
 * @ignore
 * @internal
 */

import * as MH from "@lisn/globals/minification-helpers";

import { roundNumTo } from "@lisn/utils/math";

/**
 * @since v1.3.0
 */
export const deepCopy = <T extends object>(obj: T): T => {
  const clone = MH.copyObject(obj);
  for (const key in clone) {
    if (MH.isNonPrimitive(obj[key])) {
      obj[key] = deepCopy(obj[key]);
    }
  }

  return clone;
};

export const copyExistingKeys = <T extends object>(fromObj: T, toObj: T) => {
  for (const key in toObj) {
    if (!MH.hasOwnProp(toObj, key)) {
      continue;
    }

    if (key in fromObj) {
      const current = toObj[key];
      const updated = fromObj[key];
      if (MH.isNonPrimitive(updated) && MH.isNonPrimitive(current)) {
        copyExistingKeys(updated, current);
      } else if (updated !== undefined) {
        toObj[key] = updated;
      }
    }
  }
};

// Omits the keys in object keysToRm from obj. This is to avoid hardcording the
// key names as a string so as to allow minifier to mangle them, and to avoid
// using object spread.
export const omitKeys = <
  O extends object,
  R extends { [K in keyof O]?: unknown },
>(
  obj: O,
  keysToRm: R,
): Omit<O, keyof R> => {
  const res: Partial<O> = {};
  let key: keyof O;

  for (key in obj) {
    if (!(key in keysToRm)) {
      res[key] = obj[key];
    }
  }

  return res as Omit<O, keyof R>;
};

// Returns true if the two objects are equal. If values are numeric, it will
// round to the given number of decimal places.
type NestedRecord<T = string | number | undefined | null> = {
  [key: string]: T | NestedRecord<T>;
};

export const compareValuesIn = <
  T extends NestedRecord<V>,
  V extends string | number | undefined | null,
>(
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

    if (MH.isNonPrimitive(valA) && MH.isNonPrimitive(valB)) {
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
