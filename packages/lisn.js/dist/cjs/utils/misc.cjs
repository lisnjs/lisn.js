"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toBoolean = exports.toBool = exports.toArrayIfSingle = exports.supportsSticky = exports.omitKeys = exports.keyExists = exports.isTouchScreen = exports.isInQuirksMode = exports.copyExistingKeys = exports.compareValuesIn = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _math = require("./math.cjs");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * @module
 * @ignore
 * @internal
 */

const isTouchScreen = () => MH.hasDOM() ? matchMedia("(any-pointer: coarse)").matches : false;
exports.isTouchScreen = isTouchScreen;
const supportsSticky = () => MH.hasDOM() ? typeof CSS !== "undefined" && CSS.supports("position", "sticky") : false;
exports.supportsSticky = supportsSticky;
const isInQuirksMode = () => MH.hasDOM() ? document.compatMode === "BackCompat" : false;
exports.isInQuirksMode = isInQuirksMode;
const copyExistingKeys = (fromObj, toObj) => {
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
exports.copyExistingKeys = copyExistingKeys;
const omitKeys = (obj, keysToRm) => {
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
exports.omitKeys = omitKeys;
const compareValuesIn = (objA, objB, roundTo = 3) => {
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
      if ((0, _math.roundNumTo)(valA, roundTo) !== (0, _math.roundNumTo)(valB, roundTo)) {
        return false;
      }
    } else if (valA !== valB) {
      return false;
    }
  }
  return true;
};
exports.compareValuesIn = compareValuesIn;
const keyExists = (obj, key) => MH.isNonPrimitive(obj) && key in obj;
exports.keyExists = keyExists;
const toArrayIfSingle = value => MH.isArray(value) ? value : !MH.isNullish(value) ? [value] : [];
exports.toArrayIfSingle = toArrayIfSingle;
const toBoolean = value => value === true || value === "true" || value === "" ? true : MH.isNullish(value) || value === false || value === "false" ? false : null;

/**
 * @deprecated
 */
exports.toBoolean = toBoolean;
const toBool = exports.toBool = toBoolean;
//# sourceMappingURL=misc.cjs.map