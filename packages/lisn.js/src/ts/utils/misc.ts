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
 * @param The value to return in case `value` is an empty string
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
 */
export const toBool = toBoolean;

/**
 * If the given value is not an array, it returns `[value]`.
 */
export const toArrayIfSingle = <T>(value?: T | T[] | null | undefined): T[] =>
  _.isArray(value) ? value : !_.isNullish(value) ? [value] : [];

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
    if (!_.hasOwnProp(objA, key)) {
      continue;
    }

    const valA = objA[key];
    const valB = objB[key];

    if (_.isPlainObject(valA) && _.isPlainObject(valB)) {
      if (!compareValuesIn(valA, valB)) {
        return false;
      }
    } else if (_.isLiteralNumber(valA) && _.isLiteralNumber(valB)) {
      if (roundNumTo(valA, roundTo) !== roundNumTo(valB, roundTo)) {
        return false;
      }
    } else if (valA !== valB) {
      return false;
    }
  }

  return true;
};
