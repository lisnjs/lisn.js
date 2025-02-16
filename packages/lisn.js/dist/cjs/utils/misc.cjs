"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toBool = exports.toArrayIfSingle = exports.omitKeys = exports.keyExists = exports.isTouchScreen = exports.copyExistingKeys = exports.compareValuesIn = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _math = require("./math.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
/**
 * @module
 * @ignore
 * @internal
 */

var isTouchScreen = exports.isTouchScreen = function isTouchScreen() {
  return MH.hasDOM() ? matchMedia("(any-pointer: coarse)").matches : false;
};
var _copyExistingKeys = exports.copyExistingKeys = function copyExistingKeys(fromObj, toObj) {
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
var omitKeys = exports.omitKeys = function omitKeys(obj, keysToRm) {
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
var _compareValuesIn = exports.compareValuesIn = function compareValuesIn(objA, objB) {
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
      if ((0, _math.roundNumTo)(valA, roundTo) !== (0, _math.roundNumTo)(valB, roundTo)) {
        return false;
      }
    } else if (valA !== valB) {
      return false;
    }
  }
  return true;
};
var keyExists = exports.keyExists = function keyExists(obj, key) {
  return MH.isNonPrimitive(obj) && key in obj;
};
var toArrayIfSingle = exports.toArrayIfSingle = function toArrayIfSingle(value) {
  return MH.isArray(value) ? value : !MH.isNullish(value) ? [value] : [];
};
var toBool = exports.toBool = function toBool(value) {
  return value === true || value === "true" || value === "" ? true : MH.isNullish(value) || value === false || value === "false" ? false : null;
};
//# sourceMappingURL=misc.cjs.map