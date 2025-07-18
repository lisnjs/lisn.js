/**
 * @module
 * @ignore
 * @internal
 */

import * as MH from "../globals/minification-helpers.js";
import { roundNumTo } from "./math.js";
export const isTouchScreen = () => MH.hasDOM() ? matchMedia("(any-pointer: coarse)").matches : false;
export const supportsSticky = () => MH.hasDOM() ? typeof CSS !== "undefined" && CSS.supports("position", "sticky") : false;
export const isInQuirksMode = () => MH.hasDOM() ? document.compatMode === "BackCompat" : false;
export const copyExistingKeys = (fromObj, toObj) => {
  for (const key in toObj) {
    if (!MH.hasOwnProp(toObj, key)) {
      continue;
    }
    if (key in fromObj) {
      if (MH.isNonPrimitive(fromObj[key]) && MH.isNonPrimitive(toObj[key])) {
        copyExistingKeys(fromObj[key], toObj[key]);
      } else {
        toObj[key] = fromObj[key];
      }
    }
  }
};

// Omits the keys in object keysToRm from obj. This is to avoid hardcording the
// key names as a string so as to allow minifier to mangle them, and to avoid
// using object spread.
export const omitKeys = (obj, keysToRm) => {
  const res = {};
  let key;
  for (key in obj) {
    if (!(key in keysToRm)) {
      res[key] = obj[key];
    }
  }
  return res;
};

// Returns true if the two objects are equal. If values are numeric, it will
// round to the given number of decimal places.
export const compareValuesIn = (objA, objB, roundTo = 3) => {
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
export const keyExists = (obj, key) => MH.isNonPrimitive(obj) && key in obj;
export const toArrayIfSingle = value => MH.isArray(value) ? value : !MH.isNullish(value) ? [value] : [];
export const toBoolean = value => value === true || value === "true" || value === "" ? true : MH.isNullish(value) || value === false || value === "false" ? false : null;

/**
 * @deprecated
 */
export const toBool = toBoolean;
//# sourceMappingURL=misc.js.map