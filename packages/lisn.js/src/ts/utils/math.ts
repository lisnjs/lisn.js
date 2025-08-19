/**
 * @module Utils
 */

import * as _ from "@lisn/_internal";

import { Point, Vector, AtLeastOne } from "@lisn/globals/types";

/**
 * Round a number to the given decimal precision.
 *
 * @category Math
 */
export const roundNumTo = (value: number, numDecimal = 0) => {
  const multiplicationFactor = _.pow(10, numDecimal);
  return _.round(value * multiplicationFactor) / multiplicationFactor;
};

/**
 * Returns true if the given value is a valid _finite_ number.
 *
 * @category Validation
 */
export const isValidNum = (value: unknown): value is number =>
  _.isNumber(value) && _.NUMBER.isFinite(value);

/**
 * Returns true if the given value is a valid _finite_ number or a numerical
 * string.
 *
 * @category Validation
 */
export const isValidNumerical = (
  value: unknown,
): value is number | `${number}` => !!toNum(value, false);

/**
 * If the given value is a valid _finite_ number, it is returned, otherwise
 * the default is returned.
 *
 * @category Math
 */
export const toNum = <D extends number | false | null = 0>(
  value: unknown,
  defaultValue: D | 0 = 0,
): number | D => {
  const numValue = _.isLiteralString(value) ? _.parseFloat(value) : value;

  // parseFloat will strip trailing non-numeric characters, so we check that
  // the parsed number is equal to the string, if it was a string, using loose
  // equality, in order to make sure the entire string was a number.
  return isValidNum(numValue) && numValue == value ? numValue : defaultValue;
};

/**
 * If the given value is a valid _finite integer_ number, it is returned,
 * otherwise the default is returned.
 *
 * @category Math
 */
export const toInt = <D extends number | false | null = 0>(
  value: unknown,
  defaultValue: D | 0 = 0,
): number | D => {
  let numValue = toNum(value, null);
  numValue = numValue === null ? numValue : _.floor(numValue);

  // Ensure that the parsed int equaled the original by loose equality.
  return isValidNum(numValue) && numValue == value ? numValue : defaultValue;
};

/**
 * If the given value is a valid non-negative _finite_ number, it is returned,
 * otherwise the default is returned.
 *
 * @category Math
 */
export const toNonNegNum = <D extends number | false | null = 0>(
  value: unknown,
  defaultValue: D | 0 = 0,
): number | D => {
  const numValue = toNum(value, null);
  return numValue !== null && numValue >= 0 ? numValue : defaultValue;
};

/**
 * If the given value is a valid positive number, it is returned, otherwise the
 * default is returned.
 *
 * @category Math
 */
export const toPosNum = <D extends number | false | null = 0>(
  value: unknown,
  defaultValue: D | 0 = 0,
): number | D => {
  const numValue = toNum(value, null);
  return numValue !== null && numValue > 0 ? numValue : defaultValue;
};

/**
 * Returns the given number bound by min and/or max value.
 *
 * If the value is not a valid number, then `defaultValue` is returned if given
 * (_including if it is null_), otherwise `limits.min` if given and not null,
 * otherwise `limits.max` if given and not null, or finally 0.
 *
 * If the value is outside the bounds, then:
 * - if `defaultValue` is given, `defaultValue` is returned (_including if it
 *   is null_)
 * - otherwise, the min or the max value (whichever one is violated) is
 *   returned
 *
 * @category Math
 */
export const toNumWithBounds = <D extends number | false | null = number>(
  value: unknown,
  limits: AtLeastOne<{ min: number | null; max: number | null }>,
  defaultValue?: D,
): number | D => {
  const isDefaultGiven = defaultValue !== undefined;
  const numValue = toNum(value, null);
  const min = limits?.min ?? null;
  const max = limits?.max ?? null;

  let result: number | D;
  if (!isValidNum(numValue)) {
    result = isDefaultGiven ? defaultValue : (min ?? max ?? 0);
  } else if (min !== null && numValue < min) {
    result = isDefaultGiven ? defaultValue : min;
  } else if (max !== null && numValue > max) {
    result = isDefaultGiven ? defaultValue : max;
  } else {
    result = numValue;
  }

  return result;
};

/**
 * Used as a custom calculator for {@link toRawNum}. The function should return
 * the final numerical result.
 *
 * @since v1.3.0
 *
 * @category Math
 */
export type RawNumberCalculator = (props: {
  /**
   * The original value passed to {@link toRawNum}
   */
  input: unknown;

  /**
   * Whether `+` or `-` prefix is present in {@link input}. At least one of
   * {@link isAdditive} or {@link isPercent} is guaranteed to be true.
   */
  isAdditive: boolean;

  /**
   * Whether `%` suffix is present in {@link input}. At least one of
   * {@link isAdditive} or {@link isPercent} is guaranteed to be true.
   */
  isPercent: boolean;

  /**
   * The actual numerical value of {@link input} after stripping the `%` suffix
   * if any, but not the prefix (i.e. it will be negative if there was a `-`
   * prefix)
   */
  numerical: number;
}) => number;

/**
 * Converts the given {@link RawOrRelativeNumber} to a raw number using the
 * given reference or calculator function. If the final result is invalid, the
 * default is returned.
 *
 * The default calculation process, if `input` is relative and if
 * `referenceOrCalculator` is only a number is as follows:
 * - If `input` is percentage, it is multiplied with the reference value.
 *   Afterwards, if `input` also has a `+` or `-` prefix, the resulting
 *   percentage is added to the reference. I.e:
 *   - `"30%"` results in `0.3 * reference`
 *   - `"+30%"` results in `1.3 * reference`
 *   - `"-30%"` results in `0.7 * reference`
 * - Otherwise, if `input` only has a `+` or `-` prefix it is added or
 *   subtracted from the reference.
 *
 * @param input     If it's a pure number or a positive numerical string without
 *                  `+` prefix, it is treated as the raw value to use and no
 *                  reference or further calculation is used. Otherwise the raw
 *                  value is calculated using `referenceOrCalculator`
 * @param referenceOrCalculator
 *                  If given as a number, it will be the reference value used
 *                  with the default calculation process (see above).
 *                  Otherwise, if given as a function, then it is used as the
 *                  calculator and its return value is used as the final result.
 *
 * @example
 * If you want to use the default calculator function, but specify a custom
 * reference value based on the type of input, you could call {@link toRawNum}
 * recursively like so:
 *
 * ```javascript
 * const calculator = ({input, isAdditive, isPercent, numerical}) => {
 *   return toRawNum(input, isAdditive && isPercent ? referenceA : referenceB);
 * }
 *
 * toRawNum(input, calculator);
 * ```
 *
 * @since v1.3.0
 *
 * @category Math
 */
export const toRawNum = <D extends number | false | null = 0>(
  input: unknown,
  referenceOrCalculator: number | RawNumberCalculator,
  defaultValue?: D,
) => {
  let numerical = NaN,
    isAdditive = false,
    isPercent = false;

  if (_.isLiteralNumber(input)) {
    numerical = input;
  } else if (_.isString(input)) {
    const opA = input.slice(0, 1);
    const opB = input.slice(-1);
    isAdditive = opA === "+" || opA === "-";
    isPercent = opB === "%";
    numerical = toNum(isPercent ? input.slice(0, -1) : input, NaN);
  }

  let result = numerical;
  if (isAdditive || isPercent) {
    const calculator: RawNumberCalculator = _.isFunction(referenceOrCalculator)
      ? referenceOrCalculator
      : ({ isAdditive, isPercent, numerical }) => {
          const reference = referenceOrCalculator;
          if (isPercent) {
            return (reference * numerical) / 100 + (isAdditive ? reference : 0);
          }
          return reference + numerical;
        };

    result = calculator({ input, isAdditive, isPercent, numerical });
  }

  return toNum(result, defaultValue);
};

/**
 * Returns the largest absolute value among the given ones.
 *
 * The result is always positive.
 *
 * @category Math
 */
export const maxAbs = (...values: number[]) =>
  _.max(...values.map((v) => _.abs(v)));

/**
 * Returns the smallest absolute value among the given ones.
 *
 * The result is always positive.
 *
 * @category Math
 */
export const minAbs = (...values: number[]) =>
  _.min(...values.map((v) => _.abs(v)));

/**
 * Returns the value with the largest absolute value among the given ones.
 *
 * The result can be negative.
 *
 * @category Math
 */
export const havingMaxAbs = (...values: number[]): number =>
  _.lengthOf(values)
    ? values.sort((a, b) => _.abs(b) - _.abs(a))[0]
    : -_.INFINITY;

/**
 * Returns the value with the smallest absolute value among the given ones.
 *
 * The result can be negative.
 *
 * @category Math
 */
export const havingMinAbs = (...values: number[]) =>
  _.lengthOf(values)
    ? values.sort((a, b) => _.abs(a) - _.abs(b))[0]
    : _.INFINITY;

/**
 * Returns the sum of the given values.
 *
 * @since v1.3.0
 *
 * @category Math
 */
export const sum = (...values: number[]) =>
  values.reduce((total, current) => total + current, 0);

/**
 * Returns the angle (in radians) that the vector defined by the given x, y
 * makes with the positive horizontal axis.
 *
 * The angle returned is in the range -PI to PI, not including -PI.
 *
 * @category Math
 */
export const hAngle = (x: number, y: number) =>
  normalizeAngle(_.MATH.atan2(y, x)); // ensure that -PI is transformed to +PI

/**
 * Normalizes the given angle (in radians) so that it's in the range -PI to PI,
 * not including -PI.
 *
 * @category Math
 */
export const normalizeAngle = (a: number) => {
  // ensure it's positive in the range 0 to 2 PI
  while (a < 0 || a > _.PI * 2) {
    a += (a < 0 ? 1 : -1) * _.PI * 2;
  }

  // then, if > PI, offset by - 2PI
  return a > _.PI ? a - _.PI * 2 : a;
};

/**
 * Normalizes a vector defined by the given x, y and z coordinates to length 1.
 *
 * @since v1.3.0
 *
 * @category Math
 */
export const normalizeAxis = (x: number, y: number, z = 0) => {
  const len = _.sqrt(x * x + y * y + z * z);
  return len > 0 ? [x / len, y / len, z / len] : [0, 0, 0];
};

/**
 * Converts the given angle in degrees to radians.
 *
 * @category Math
 */
export const degToRad = (a: number) => (a * _.PI) / 180;

/**
 * Converts the given angle in radians to degrees.
 *
 * @category Math
 */
export const radToDeg = (a: number) => (a * 180) / _.PI;

/**
 * Returns true if the given vectors point in the same direction.
 *
 * @param angleDiffThreshold
 *                  Sets the threshold in degrees when comparing the angles of
 *                  two vectors. E.g. for 5 degrees threshold, directions
 *                  whose vectors are within 5 degrees of each other are
 *                  considered parallel.
 *                  It doesn't make sense for this value to be < 0 or >= 90
 *                  degrees. If it is, it's forced to be positive (absolute)
 *                  and <= 89.99.
 *
 * @category Math
 */
export const areParallel = (vA: Vector, vB: Vector, angleDiffThreshold = 0) => {
  const angleA = hAngle(vA[0], vA[1]);
  const angleB = hAngle(vB[0], vB[1]);
  angleDiffThreshold = _.min(89.99, _.abs(angleDiffThreshold));

  return _.abs(normalizeAngle(angleA - angleB)) <= degToRad(angleDiffThreshold);
};

/**
 * Returns true if the given vectors point in the opposite direction.
 *
 * @param angleDiffThreshold
 *                  Sets the threshold in degrees when comparing the angles of
 *                  two vectors. E.g. for 5 degrees threshold, directions
 *                  whose vectors are within 175-185 degrees of each other are
 *                  considered antiparallel.
 *                  It doesn't make sense for this value to be < 0 or >= 90
 *                  degrees. If it is, it's forced to be positive (absolute)
 *                  and <= 89.99.
 *
 * @category Math
 */
export const areAntiParallel = (
  vA: Vector,
  vB: Vector,
  angleDiffThreshold = 0,
) => areParallel(vA, [-vB[0], -vB[1]], angleDiffThreshold);

/**
 * Returns the distance between two points on the screen.
 *
 * @category Math
 */
export const distanceBetween = (ptA: Point, ptB: Point) =>
  _.sqrt(_.pow(ptA[0] - ptB[0], 2) + _.pow(ptA[1] - ptB[1], 2));

/**
 * Returns the two roots of the quadratic equation with coefficients
 * `a`, `b` & `c`, i.e. `a * x^2 + b * x + c = 0`
 *
 * The roots may be `NaN` if the quadratic has no real solutions.
 *
 * @category Math
 */
export const quadraticRoots = (a: number, b: number, c: number) => {
  const z = _.sqrt(b * b - 4 * a * c);
  return [(-b + z) / (2 * a), (-b - z) / (2 * a)];
};

/**
 * Returns the value that an "easing" quadratic function would have at the
 * given x.
 *
 * @see https://easings.net/#easeInOutQuad
 *
 * @param x Must be between 0 and 1.
 *
 * @returns The current y-axis value between 0 and 1.
 *
 * @category Math
 */
export const easeInOutQuad = (x: number) =>
  x < 0.5 ? 2 * x * x : 1 - _.pow(-2 * x + 2, 2) / 2;

/**
 * Returns an array of object's keys sorted by the numeric value they hold.
 *
 * @category Math
 */
export const sortedKeysByVal = <T extends Record<string, number>>(
  obj: T,
  descending = false,
): Array<keyof T> => {
  if (descending) {
    return _.keysOf(obj).sort((x: keyof T, y: keyof T) => obj[y] - obj[x]);
  }

  return _.keysOf(obj).sort((x: keyof T, y: keyof T) => obj[x] - obj[y]);
};

/**
 * Returns the key in the given object which holds the largest numeric value.
 *
 * If the object is empty, returns `undefined`.
 *
 * @category Math
 */
export const keyWithMaxVal = (
  obj: Record<string, number>,
): string | undefined => {
  return _.lastOf(sortedKeysByVal(obj));
};

/**
 * Returns the key in the given object which holds the smallest numeric value.
 *
 * If the object is empty, returns `undefined`.
 *
 * @category Math
 */
export const keyWithMinVal = (
  obj: Record<string, number>,
): string | undefined => {
  return _.firstOf(sortedKeysByVal(obj));
};

/**
 * Takes two integers and returns a bitmask that covers all values between
 * 1 << start and 1 << end, _including the starting and ending one_.
 *
 * If pStart > pEnd, they are reversed.
 *
 * getBitmask(start, start) always returns 1 << start
 * getBitmask(start, end) always returns same as getBitmask(end, start)
 *
 * @category Math
 */
export const getBitmask = (start: number, end: number): number =>
  start > end
    ? getBitmask(end, start)
    : (~0 >>> (32 - end - 1 + start)) << start;
