"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toPosNum = exports.toNumWithBounds = exports.toNum = exports.toNonNegNum = exports.toInt = exports.sortedKeysByVal = exports.roundNumTo = exports.radToDeg = exports.quadraticRoots = exports.normalizeAngle = exports.minAbs = exports.maxAbs = exports.keyWithMinVal = exports.keyWithMaxVal = exports.isValidNum = exports.havingMinAbs = exports.havingMaxAbs = exports.hAngle = exports.getBitmask = exports.easeInOutQuad = exports.distanceBetween = exports.degToRad = exports.areParallel = exports.areAntiParallel = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * @module Utils
 */

/**
 * Round a number to the given decimal precision (default is 0).
 *
 * @param {} [numDecimal = 0]
 *
 * @category Math
 */
const roundNumTo = (value, numDecimal = 0) => {
  const multiplicationFactor = MH.pow(10, numDecimal);
  return MH.round(value * multiplicationFactor) / multiplicationFactor;
};

/**
 * Returns true if the given value is a valid _finite_ number.
 *
 * @category Validation
 */
exports.roundNumTo = roundNumTo;
const isValidNum = value => MH.isNumber(value) && MC.NUMBER.isFinite(value);

/**
 * If the given value is a valid _finite_ number, it is returned, otherwise
 * the default is returned.
 *
 * @category Math
 */
exports.isValidNum = isValidNum;
const toNum = (value, defaultValue = 0) => {
  const numValue = MH.isLiteralString(value) ? MH.parseFloat(value) : value;

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
exports.toNum = toNum;
const toInt = (value, defaultValue = 0) => {
  let numValue = toNum(value, null);
  numValue = numValue === null ? numValue : MH.floor(numValue);

  // Ensure that the parsed int equaled the original by loose equality.
  return isValidNum(numValue) && numValue == value ? numValue : defaultValue;
};

/**
 * If the given value is a valid non-negative _finite_ number, it is returned,
 * otherwise the default is returned.
 *
 * @category Math
 */
exports.toInt = toInt;
const toNonNegNum = (value, defaultValue = 0) => {
  const numValue = toNum(value, null);
  return numValue !== null && numValue >= 0 ? numValue : defaultValue;
};

/**
 * If the given value is a valid positive number, it is returned, otherwise the
 * default is returned.
 *
 * @category Math
 */
exports.toNonNegNum = toNonNegNum;
const toPosNum = (value, defaultValue = 0) => {
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
exports.toPosNum = toPosNum;
const toNumWithBounds = (value, limits, defaultValue) => {
  var _limits$min, _limits$max;
  const isDefaultGiven = defaultValue !== undefined;
  const numValue = toNum(value, null);
  const min = (_limits$min = limits === null || limits === void 0 ? void 0 : limits.min) !== null && _limits$min !== void 0 ? _limits$min : null;
  const max = (_limits$max = limits === null || limits === void 0 ? void 0 : limits.max) !== null && _limits$max !== void 0 ? _limits$max : null;
  let result;
  if (!isValidNum(numValue)) {
    var _ref;
    result = isDefaultGiven ? defaultValue : (_ref = min !== null && min !== void 0 ? min : max) !== null && _ref !== void 0 ? _ref : 0;
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
 * Returns the largest absolute value among the given ones.
 *
 * The result is always positive.
 *
 * @category Math
 */
exports.toNumWithBounds = toNumWithBounds;
const maxAbs = (...values) => MH.max(...values.map(v => MH.abs(v)));

/**
 * Returns the smallest absolute value among the given ones.
 *
 * The result is always positive.
 *
 * @category Math
 */
exports.maxAbs = maxAbs;
const minAbs = (...values) => MH.min(...values.map(v => MH.abs(v)));

/**
 * Returns the value with the largest absolute value among the given ones.
 *
 * The result can be negative.
 *
 * @category Math
 */
exports.minAbs = minAbs;
const havingMaxAbs = (...values) => MH.lengthOf(values) ? values.sort((a, b) => MH.abs(b) - MH.abs(a))[0] : -MC.INFINITY;

/**
 * Returns the value with the smallest absolute value among the given ones.
 *
 * The result can be negative.
 *
 * @category Math
 */
exports.havingMaxAbs = havingMaxAbs;
const havingMinAbs = (...values) => MH.lengthOf(values) ? values.sort((a, b) => MH.abs(a) - MH.abs(b))[0] : MC.INFINITY;

/**
 * Returns the angle (in radians) that the vector defined by the given x, y
 * makes with the positive horizontal axis.
 *
 * The angle returned is in the range -PI to PI, not including -PI.
 *
 * @category Math
 */
exports.havingMinAbs = havingMinAbs;
const hAngle = (x, y) => normalizeAngle(MC.MATH.atan2(y, x)); // ensure that -PI is transformed to +PI

/**
 * Normalizes the given angle (in radians) so that it's in the range -PI to PI,
 * not including -PI.
 *
 * @category Math
 */
exports.hAngle = hAngle;
const normalizeAngle = a => {
  // ensure it's positive in the range 0 to 2 PI
  while (a < 0 || a > MC.PI * 2) {
    a += (a < 0 ? 1 : -1) * MC.PI * 2;
  }

  // then, if > PI, offset by - 2PI
  return a > MC.PI ? a - MC.PI * 2 : a;
};

/**
 * Converts the given angle in degrees to radians.
 *
 * @category Math
 */
exports.normalizeAngle = normalizeAngle;
const degToRad = a => a * MC.PI / 180;

/**
 * Converts the given angle in radians to degrees.
 *
 * @category Math
 */
exports.degToRad = degToRad;
const radToDeg = a => a * 180 / MC.PI;

/**
 * Returns true if the given vectors point in the same direction.
 *
 * @param {} angleDiffThreshold
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
exports.radToDeg = radToDeg;
const areParallel = (vA, vB, angleDiffThreshold = 0) => {
  const angleA = hAngle(vA[0], vA[1]);
  const angleB = hAngle(vB[0], vB[1]);
  angleDiffThreshold = MH.min(89.99, MH.abs(angleDiffThreshold));
  return MH.abs(normalizeAngle(angleA - angleB)) <= degToRad(angleDiffThreshold);
};

/**
 * Returns true if the given vectors point in the opposite direction.
 *
 * @param {} angleDiffThreshold
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
exports.areParallel = areParallel;
const areAntiParallel = (vA, vB, angleDiffThreshold = 0) => areParallel(vA, [-vB[0], -vB[1]], angleDiffThreshold);

/**
 * Returns the distance between two points on the screen.
 *
 * @category Math
 */
exports.areAntiParallel = areAntiParallel;
const distanceBetween = (ptA, ptB) => MH.sqrt(MH.pow(ptA[0] - ptB[0], 2) + MH.pow(ptA[1] - ptB[1], 2));

/**
 * Returns the two roots of the quadratic equation with coefficients
 * `a`, `b` & `c`, i.e. `a * x^2 + b * x + c = 0`
 *
 * The roots may be `NaN` if the quadratic has no real solutions.
 *
 * @category Math
 */
exports.distanceBetween = distanceBetween;
const quadraticRoots = (a, b, c) => {
  const z = MH.sqrt(b * b - 4 * a * c);
  return [(-b + z) / (2 * a), (-b - z) / (2 * a)];
};

/**
 * Returns the value that an "easing" quadratic function would have at the
 * given x.
 *
 * @see https://easings.net/#easeInOutQuad
 *
 * @category Math
 */
exports.quadraticRoots = quadraticRoots;
const easeInOutQuad = x => x < 0.5 ? 2 * x * x : 1 - MH.pow(-2 * x + 2, 2) / 2;

/**
 * Returns an array of object's keys sorted by the numeric value they hold.
 *
 * @category Math
 */
exports.easeInOutQuad = easeInOutQuad;
const sortedKeysByVal = (obj, descending = false) => {
  if (descending) {
    return MH.keysOf(obj).sort((x, y) => obj[y] - obj[x]);
  }
  return MH.keysOf(obj).sort((x, y) => obj[x] - obj[y]);
};

/**
 * Returns the key in the given object which holds the largest numeric value.
 *
 * If the object is empty, returns `undefined`.
 *
 * @category Math
 */
exports.sortedKeysByVal = sortedKeysByVal;
const keyWithMaxVal = obj => {
  return sortedKeysByVal(obj).slice(-1)[0];
};

/**
 * Returns the key in the given object which holds the smallest numeric value.
 *
 * If the object is empty, returns `undefined`.
 *
 * @category Math
 */
exports.keyWithMaxVal = keyWithMaxVal;
const keyWithMinVal = obj => {
  return sortedKeysByVal(obj).slice(0, 1)[0];
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
exports.keyWithMinVal = keyWithMinVal;
const getBitmask = (start, end) => start > end ? getBitmask(end, start) : ~0 >>> 32 - end - 1 + start << start;
exports.getBitmask = getBitmask;
//# sourceMappingURL=math.cjs.map