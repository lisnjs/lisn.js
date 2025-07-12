/**
 * @module Utils
 */

import * as MH from "@lisn/globals/minification-helpers";

import { LisnUsageError } from "@lisn/globals/errors";

import { CommaSeparatedStr } from "@lisn/globals/types";

import { toNum } from "@lisn/utils/math";
import { toBoolean } from "@lisn/utils/misc";
import { splitOn } from "@lisn/utils/text";

/**
 * Returns true if the input is a string array or comma-separated string, whose
 * elements are valid according to the `validator` function.
 *
 * @param allowEmpty If `false`, then input without any entries is
 * considered _invalid_.
 *
 * @category Validation
 */
export const isValidStrList = <T extends string = string>(
  value: unknown,
  checkFn: (value: string) => value is T,
  allowEmpty = true,
): value is CommaSeparatedStr<T> | T[] => {
  try {
    const res = validateStrList("", value, checkFn);
    return allowEmpty || !MH.isNullish(res);
  } catch (err) {
    if (MH.isInstanceOf(err, LisnUsageError)) {
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
 * @param key Used in the error message thrown
 *
 * @returns `undefined` if the input contains no non-empty values (after
 * trimming whitespace on left/right from each), otherwise a non-empty array of
 * values.
 *
 * @category Validation
 */
export const validateStrList = <T extends string = string>(
  key: string,
  value: unknown,
  checkFn?: (value: string) => value is T,
): T[] | undefined =>
  MH.filterBlank(
    toArray(value)?.map((v) =>
      _validateString(key, v, checkFn, "a string or a string array"),
    ),
  );

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
 * @param key Used in the error message thrown
 *
 * @returns `undefined` if the input contains no non-empty values (after
 * trimming whitespace on left/right from each), otherwise a non-empty array of
 * values.
 *
 * @category Validation
 */
export const validateNumList = (
  key: string,
  value: unknown,
): number[] | undefined =>
  MH.filterBlank(
    toArray(value)?.map((v) =>
      _validateNumber(key, v, "a number or a number array"),
    ),
  );

/**
 * Returns a number corresponding to the supplied value, ensuring the supplied
 * value is a valid number or a string containing only a number.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the value is invalid.
 *
 * @returns `undefined` if the input is nullish.
 *
 * @category Validation
 */
export const validateNumber = (key: string, value: unknown) =>
  _validateNumber(key, value);

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
 * @returns `undefined` if the input is nullish.
 *
 * @category Validation
 */
export const validateBoolean = (key: string, value: unknown) =>
  _validateBoolean(key, value);

/**
 * Returns a valid string from the supplied value, ensuring the supplied value
 * is a string that conforms to the given `checkFn`.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the value is invalid.
 *
 * @param checkFn If given and the supplied value is a string, then it is
 *                called with the value as a single argument. It must return
 *                true if the value is valid and false otherwise. If it is not
 *                given, then any literal string is accepted.
 *
 * @returns `undefined` if the input is nullish.
 *
 * @category Validation
 */
export const validateString = <T extends string = string>(
  key: string,
  value: unknown,
  checkFn?: (value: string) => value is T,
) => _validateString(key, value, checkFn);

/**
 * Like {@link validateString} except it requires input to be given and
 * non-empty.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the value is invalid or empty.
 *
 * @category Validation
 */
export const validateStringRequired = <T extends string = string>(
  key: string,
  value: unknown,
  checkFn?: (value: string) => value is T,
): T => {
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
 * @param stringCheckFn If given and the supplied value is a string _other than
 *                      a boolean string_, then it is called with the value as
 *                      a single argument. It must return true if the value is
 *                      valid and false otherwise. If it is not given, then any
 *                      literal string is accepted.
 *
 * @category Validation
 */
export const validateBooleanOrString = <T extends string = string>(
  key: string,
  value: unknown,
  stringCheckFn?: (value: string) => value is T,
) => _validateBooleanOrString(key, value, stringCheckFn);

// --------------------

const toArray = (value: unknown): unknown[] | undefined => {
  let result: unknown[] | null;
  if (MH.isArray(value)) {
    result = value;
  } else if (MH.isIterableObject(value)) {
    result = MH.arrayFrom(value);
  } else if (MH.isLiteralString(value)) {
    result = splitOn(value, ",");
  } else if (!MH.isNullish(value)) {
    result = [value];
  } else {
    result = null;
  }

  return result
    ? MH.filterBlank(result.map((v) => (MH.isLiteralString(v) ? v.trim() : v)))
    : undefined;
};

const _validateNumber = (
  key: string,
  value: unknown,
  typeDescription?: string,
) => {
  if (MH.isNullish(value)) {
    return;
  }

  const numVal = toNum(value, null);
  if (numVal === null) {
    throw MH.usageError(`'${key}' must be ${typeDescription ?? "a number"}`);
  }

  return numVal;
};

const _validateBoolean = (
  key: string,
  value: unknown,
  typeDescription?: string,
) => {
  if (MH.isNullish(value)) {
    return;
  }

  const boolVal = toBoolean(value);
  if (boolVal === null) {
    throw MH.usageError(
      `'${key}' must be ${typeDescription ?? '"true" or "false"'}`,
    );
  }

  return boolVal;
};

const _validateString = <T extends string = string>(
  key: string,
  value: unknown,
  checkFn?: (value: string) => value is T,
  typeDescription?: string,
): (typeof checkFn extends null | undefined ? string : T) | undefined => {
  if (MH.isNullish(value)) {
    return;
  }

  if (!MH.isLiteralString(value)) {
    throw MH.usageError(`'${key}' must be ${typeDescription ?? "a string"}`);
  } else if (checkFn && !checkFn(value)) {
    throw MH.usageError(`Invalid value for '${key}'`);
  }

  return value as typeof checkFn extends null | undefined ? string : T;
};

const _validateBooleanOrString = <T extends string = string>(
  key: string,
  value: unknown,
  stringCheckFn?: (value: string) => value is T,
  typeDescription?: string,
) => {
  if (MH.isNullish(value)) {
    return;
  }

  const boolVal = toBoolean(value);
  if (boolVal !== null) {
    return boolVal;
  }

  if (!MH.isLiteralString(value)) {
    throw MH.usageError(
      `'${key}' must be ${typeDescription ?? "a boolean or string"}`,
    );
  }

  return _validateString(key, value, stringCheckFn);
};
