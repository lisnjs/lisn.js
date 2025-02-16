/**
 * @module
 * @ignore
 * @internal
 */

import * as MH from "../globals/minification-helpers.js";
import { roundNumTo } from "./math.js";
export var isTouchScreen = function isTouchScreen() {
  return MH.hasDOM() ? matchMedia("(any-pointer: coarse)").matches : false;
};
var _copyExistingKeys = function copyExistingKeys(fromObj, toObj) {
  for (var key in toObj) {
    if (!MH.hasOwnProp(toObj, key)) {
      continue;
    }
    if (key in fromObj) {
      if (MH.isNonPrimitive(fromObj[key]) && MH.isNonPrimitive(toObj[key])) {
        _copyExistingKeys(fromObj[key], toObj[key]);
      } else {
        toObj[key] = fromObj[key];
      }
    }
  }
};

// Omits the keys in object keysToRm from obj. This is to avoid hardcording the
// key names as a string so as to allow minifier to mangle them, and to avoid
// using object spread.
export { _copyExistingKeys as copyExistingKeys };
export var omitKeys = function omitKeys(obj, keysToRm) {
  var res = {};
  var key;
  for (key in obj) {
    if (!(key in keysToRm)) {
      res[key] = obj[key];
    }
  }
  return res;
};

// Returns true if the two objects are equal. If values are numeric, it will
// round to the given number of decimal places.
var _compareValuesIn = function compareValuesIn(objA, objB) {
  var roundTo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;
  for (var key in objA) {
    if (!MH.hasOwnProp(objA, key)) {
      continue;
    }
    var valA = objA[key];
    var valB = objB[key];
    if (MH.isNonPrimitive(valA) && MH.isNonPrimitive(valB)) {
      if (!_compareValuesIn(valA, valB)) {
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
export { _compareValuesIn as compareValuesIn };
export var keyExists = function keyExists(obj, key) {
  return MH.isNonPrimitive(obj) && key in obj;
};
export var toArrayIfSingle = function toArrayIfSingle(value) {
  return MH.isArray(value) ? value : !MH.isNullish(value) ? [value] : [];
};
export var toBool = function toBool(value) {
  return value === true || value === "true" || value === "" ? true : MH.isNullish(value) || value === false || value === "false" ? false : null;
};
//# sourceMappingURL=misc.js.map