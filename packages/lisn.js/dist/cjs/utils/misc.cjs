"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tryImport = exports.toBool = exports.toArrayIfSingle = exports.omitKeys = exports.keyExists = exports.isTouchScreen = exports.copyExistingKeys = exports.compareValuesIn = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _math = require("./math.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * @module
 * @ignore
 * @internal
 */

const isTouchScreen = () => MH.hasDOM() ? matchMedia("(any-pointer: coarse)").matches : false;
exports.isTouchScreen = isTouchScreen;
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
const toBool = value => value === true || value === "true" || value === "" ? true : MH.isNullish(value) || value === false || value === "false" ? false : null;
exports.toBool = toBool;
const tryImport = async path => {
  try {
    return await import(path);
  } catch (e__ignored) {
    // module doesn't exist
    return null;
  }
};
exports.tryImport = tryImport;
//# sourceMappingURL=misc.cjs.map