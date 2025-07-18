/**
 * @module Utils
 */
import { Point, Vector, AtLeastOne } from "../globals/types.cjs";
/**
 * Round a number to the given decimal precision.
 *
 * @category Math
 */
export declare const roundNumTo: (value: number, numDecimal?: number) => number;
/**
 * Returns true if the given value is a valid _finite_ number.
 *
 * @category Validation
 */
export declare const isValidNum: (value: unknown) => value is number;
/**
 * If the given value is a valid _finite_ number, it is returned, otherwise
 * the default is returned.
 *
 * @category Math
 */
export declare const toNum: <D extends number | false | null = 0>(value: unknown, defaultValue?: D | 0) => number | D;
/**
 * If the given value is a valid _finite integer_ number, it is returned,
 * otherwise the default is returned.
 *
 * @category Math
 */
export declare const toInt: <D extends number | false | null = 0>(value: unknown, defaultValue?: D | 0) => number | D;
/**
 * If the given value is a valid non-negative _finite_ number, it is returned,
 * otherwise the default is returned.
 *
 * @category Math
 */
export declare const toNonNegNum: <D extends number | false | null = 0>(value: unknown, defaultValue?: D | 0) => number | D;
/**
 * If the given value is a valid positive number, it is returned, otherwise the
 * default is returned.
 *
 * @category Math
 */
export declare const toPosNum: <D extends number | false | null = 0>(value: unknown, defaultValue?: D | 0) => number | D;
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
export declare const toNumWithBounds: <D extends number | false | null = number>(value: unknown, limits: AtLeastOne<{
    min: number | null;
    max: number | null;
}>, defaultValue?: D) => number | D;
/**
 * Returns the largest absolute value among the given ones.
 *
 * The result is always positive.
 *
 * @category Math
 */
export declare const maxAbs: (...values: number[]) => number;
/**
 * Returns the smallest absolute value among the given ones.
 *
 * The result is always positive.
 *
 * @category Math
 */
export declare const minAbs: (...values: number[]) => number;
/**
 * Returns the value with the largest absolute value among the given ones.
 *
 * The result can be negative.
 *
 * @category Math
 */
export declare const havingMaxAbs: (...values: number[]) => number;
/**
 * Returns the value with the smallest absolute value among the given ones.
 *
 * The result can be negative.
 *
 * @category Math
 */
export declare const havingMinAbs: (...values: number[]) => number;
/**
 * Returns the angle (in radians) that the vector defined by the given x, y
 * makes with the positive horizontal axis.
 *
 * The angle returned is in the range -PI to PI, not including -PI.
 *
 * @category Math
 */
export declare const hAngle: (x: number, y: number) => number;
/**
 * Normalizes the given angle (in radians) so that it's in the range -PI to PI,
 * not including -PI.
 *
 * @category Math
 */
export declare const normalizeAngle: (a: number) => number;
/**
 * Converts the given angle in degrees to radians.
 *
 * @category Math
 */
export declare const degToRad: (a: number) => number;
/**
 * Converts the given angle in radians to degrees.
 *
 * @category Math
 */
export declare const radToDeg: (a: number) => number;
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
export declare const areParallel: (vA: Vector, vB: Vector, angleDiffThreshold?: number) => boolean;
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
export declare const areAntiParallel: (vA: Vector, vB: Vector, angleDiffThreshold?: number) => boolean;
/**
 * Returns the distance between two points on the screen.
 *
 * @category Math
 */
export declare const distanceBetween: (ptA: Point, ptB: Point) => number;
/**
 * Returns the two roots of the quadratic equation with coefficients
 * `a`, `b` & `c`, i.e. `a * x^2 + b * x + c = 0`
 *
 * The roots may be `NaN` if the quadratic has no real solutions.
 *
 * @category Math
 */
export declare const quadraticRoots: (a: number, b: number, c: number) => number[];
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
export declare const easeInOutQuad: (x: number) => number;
/**
 * Returns an array of object's keys sorted by the numeric value they hold.
 *
 * @category Math
 */
export declare const sortedKeysByVal: <T extends Record<string, number>>(obj: T, descending?: boolean) => Array<keyof T>;
/**
 * Returns the key in the given object which holds the largest numeric value.
 *
 * If the object is empty, returns `undefined`.
 *
 * @category Math
 */
export declare const keyWithMaxVal: (obj: Record<string, number>) => string | undefined;
/**
 * Returns the key in the given object which holds the smallest numeric value.
 *
 * If the object is empty, returns `undefined`.
 *
 * @category Math
 */
export declare const keyWithMinVal: (obj: Record<string, number>) => string | undefined;
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
export declare const getBitmask: (start: number, end: number) => number;
//# sourceMappingURL=math.d.ts.map