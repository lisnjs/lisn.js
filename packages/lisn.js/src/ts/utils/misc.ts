/**
 * @module Utils
 */

import * as _ from "@lisn/_internal";

import { NestedRecord } from "@lisn/globals/types";

import { roundNumTo } from "@lisn/utils/math";

/**
 * Converts the given value to a boolean as follows:
 *
 * - `true` and `"true"` => `true`
 * - `null`, `undefined`, `false` and `"false"` => `false`
 * - `""` (empty string) => `emptyStr` (by default true, which is consistent
 *   with the values for boolean attributes)
 * - anything else => `null` (invalid value)
 *
 * If `value` is a string, it is lower-cased and trimmed of whitespace before
 * comparing.
 *
 * @category Misc
 */
export const toBoolean = (value: unknown, emptyStr = true) => {
  if (_.isLiteralString(value)) {
    value = _.toLowerCase(value).trim();
  }

  return value === true || value === "true"
    ? true
    : value === ""
      ? emptyStr
      : _.isNullish(value) || value === false || value === "false"
        ? false
        : null;
};

/**
 * @ignore
 * @deprecated
 *
 * Deprecated alias for {@link toBoolean}
 *
 * @category Misc
 */
export const toBool = toBoolean;

/**
 * If the given value is an iterable it returns it as is.
 *
 * If given value is `null` or `undefined` it returns an empty array.
 *
 * Otherwise it returns an array with the value as the only element.
 *
 * @category Misc
 */
export const toIterableIfNot = <T>(
  value?: T | Iterable<T> | null | undefined,
): Iterable<T> =>
  _.isIterableObject(value) ? value : !_.isNullish(value) ? [value] : [];

/**
 * Returns true if the two values are equal. Nested objects and arrays are
 * recursed into (since v1.3.0). Numeric values are rounded to the given number
 * of decimal places.
 *
 * @category Misc
 */
export const compareValuesIn = (valA: unknown, valB: unknown, roundTo = 3) => {
  if (_.isPlainObject(valA) && _.isPlainObject(valB)) {
    if (_.lengthOf(_.keysOf(valA)) !== _.lengthOf(_.keysOf(valB))) {
      return false;
    }

    for (const key in valA) {
      if (!compareValuesIn(valA[key], valB[key], roundTo)) {
        return false;
      }
    }

    return true;
  } else if (_.isArray(valA) && _.isArray(valB)) {
    if (_.lengthOf(valA) !== _.lengthOf(valB)) {
      return false;
    }

    for (let idx = 0; idx < _.lengthOf(valA); idx++) {
      if (!compareValuesIn(valA[idx], valB[idx], roundTo)) {
        return false;
      }
    }

    return true;
  } else if (_.isLiteralNumber(valA) && _.isLiteralNumber(valB)) {
    return roundNumTo(valA, roundTo) === roundNumTo(valB, roundTo);
  }

  return valA === valB;
};
