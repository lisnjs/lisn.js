"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateStringRequired = exports.validateString = exports.validateStrList = exports.validateNumber = exports.validateNumList = exports.validateBooleanOrString = exports.validateBoolean = exports.isValidStrList = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _errors = require("../globals/errors.cjs");
var _math = require("./math.cjs");
var _misc = require("./misc.cjs");
var _text = require("./text.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * @module Utils
 */

/**
 * Returns true if the input is a string array or comma-separated string, whose
 * elements are valid according to the `validator` function.
 *
 * @param {} allowEmpty If `false`, then input without any entries is
 * considered _invalid_.
 *
 * @category Validation
 */
const isValidStrList = (value, checkFn, allowEmpty = true) => {
  try {
    const res = validateStrList("", value, checkFn);
    return allowEmpty || !MH.isNullish(res);
  } catch (err) {
    if (MH.isInstanceOf(err, _errors.LisnUsageError)) {
      return false;
    }
    throw err;
  }
};

/**
 * Returns an array of strings from the given list while validating each one
 * using the `checkFn` function.
 *
 * If it returns without throwing, the input is necessarily valid.
 * If the result is an empty array, it will return `null`.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the input is not a string or array of strings, or if any
 *                entries do not pass `checkFn`.
 *
 * @param {} key Used in the error message thrown
 *
 * @return {} `undefined` if the input contains no non-empty values (after
 * trimming whitespace on left/right from each), otherwise a non-empty array of
 * values.
 *
 * @category Validation
 */
exports.isValidStrList = isValidStrList;
const validateStrList = (key, value, checkFn) => {
  var _toArray;
  return MH.filterBlank((_toArray = toArray(value)) === null || _toArray === void 0 ? void 0 : _toArray.map(v => _validateString(key, v, checkFn, "a string or a string array")));
};

/**
 * Returns an array of numbers from the given list.
 *
 * If it returns without throwing, the input is necessarily valid.
 * If the result is an empty array, it will return `null`.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the input is not a number or array of numbers. Numerical
 *                strings are accepted.
 *
 * @param {} key Used in the error message thrown
 *
 * @return {} `undefined` if the input contains no non-empty values (after
 * trimming whitespace on left/right from each), otherwise a non-empty array of
 * values.
 *
 * @category Validation
 */
exports.validateStrList = validateStrList;
const validateNumList = (key, value) => {
  var _toArray2;
  return MH.filterBlank((_toArray2 = toArray(value)) === null || _toArray2 === void 0 ? void 0 : _toArray2.map(v => _validateNumber(key, v, "a number or a number array")));
};

/**
 * Returns a number corresponding to the supplied value, ensuring the supplied
 * value is a valid number or a string containing only a number.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the value is invalid.
 *
 * @return {} `undefined` if the input is nullish.
 *
 * @category Validation
 */
exports.validateNumList = validateNumList;
const validateNumber = (key, value) => _validateNumber(key, value);

/**
 * Returns a boolean corresponding to the given value as follows:
 *
 * - `null` and `undefined` result in `undefined`
 * - `false` and `"false"` result in `false`
 * - `""`, `true` and `"true"` result in `true`
 * - other values throw an error error
 *
 * Note that an empty string is treated as `true`.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the value is not a valid boolean or boolean string.
 *
 * @return {} `undefined` if the input is nullish.
 *
 * @category Validation
 */
exports.validateNumber = validateNumber;
const validateBoolean = (key, value) => _validateBoolean(key, value);

/**
 * Returns a valid string from the supplied value, ensuring the supplied value
 * is a string that conforms to the given `checkFn`.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the value is invalid.
 *
 * @param {} checkFn      If given and the supplied value is a string, then it
 *                        is called with the value as a single argument. It
 *                        must return true if the value is valid and false
 *                        otherwise.
 *                        If it is not given, then any literal string is
 *                        accepted.
 *
 * @return {} `undefined` if the input is nullish.
 *
 * @category Validation
 */
exports.validateBoolean = validateBoolean;
const validateString = (key, value, checkFn) => _validateString(key, value, checkFn);

/**
 * Like {@link validateString} except it requires input to be given and
 * non-empty.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the value is invalid or empty.
 *
 * @category Validation
 */
exports.validateString = validateString;
const validateStringRequired = (key, value, checkFn) => {
  const result = _validateString(key, value, checkFn);
  if (MH.isEmpty(result)) {
    throw MH.usageError(`'${key}' is required`);
  }
  return result;
};

/**
 * Returns a valid boolean or a string from the supplied value, ensuring the
 * supplied value is either a boolean or boolean string (see
 * {@link validateBoolean}), or a string that conforms to the given `checkFn`.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the value is invalid.
 *
 * @param {} stringCheckFn If given and the supplied value is a string _other
 *                         than a boolean string_, then it is called with the
 *                         value as a single argument. It must return true if
 *                         the value is valid and false otherwise.
 *                         If it is not given, then any literal string is
 *                         accepted.
 *
 * @category Validation
 */
exports.validateStringRequired = validateStringRequired;
const validateBooleanOrString = (key, value, stringCheckFn) => _validateBooleanOrString(key, value, stringCheckFn);

// --------------------
exports.validateBooleanOrString = validateBooleanOrString;
const toArray = value => {
  let result;
  if (MH.isArray(value)) {
    result = value;
  } else if (MH.isIterableObject(value)) {
    result = MH.arrayFrom(value);
  } else if (MH.isLiteralString(value)) {
    result = (0, _text.splitOn)(value, ",");
  } else if (!MH.isNullish(value)) {
    result = [value];
  } else {
    result = null;
  }
  return result ? MH.filterBlank(result.map(v => MH.isLiteralString(v) ? v.trim() : v)) : undefined;
};
const _validateNumber = (key, value, typeDescription) => {
  if (MH.isNullish(value)) {
    return;
  }
  const numVal = (0, _math.toNum)(value, null);
  if (numVal === null) {
    throw MH.usageError(`'${key}' must be ${typeDescription !== null && typeDescription !== void 0 ? typeDescription : "a number"}`);
  }
  return numVal;
};
const _validateBoolean = (key, value, typeDescription) => {
  if (MH.isNullish(value)) {
    return;
  }
  const boolVal = (0, _misc.toBoolean)(value);
  if (boolVal === null) {
    throw MH.usageError(`'${key}' must be ${typeDescription !== null && typeDescription !== void 0 ? typeDescription : '"true" or "false"'}`);
  }
  return boolVal;
};
const _validateString = (key, value, checkFn, typeDescription) => {
  if (MH.isNullish(value)) {
    return;
  }
  if (!MH.isLiteralString(value)) {
    throw MH.usageError(`'${key}' must be ${typeDescription !== null && typeDescription !== void 0 ? typeDescription : "a string"}`);
  } else if (checkFn && !checkFn(value)) {
    throw MH.usageError(`Invalid value for '${key}'`);
  }
  return value;
};
const _validateBooleanOrString = (key, value, stringCheckFn, typeDescription) => {
  if (MH.isNullish(value)) {
    return;
  }
  const boolVal = (0, _misc.toBoolean)(value);
  if (boolVal !== null) {
    return boolVal;
  }
  if (!MH.isLiteralString(value)) {
    throw MH.usageError(`'${key}' must be ${typeDescription !== null && typeDescription !== void 0 ? typeDescription : "a boolean or string"}`);
  }
  return _validateString(key, value, stringCheckFn);
};
//# sourceMappingURL=validation.cjs.map