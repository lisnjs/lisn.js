function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * @module Utils
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
/**
 * Round a number to the given decimal precision (default is 0).
 *
 * @param {} [numDecimal = 0]
 *
 * @category Math
 */
export var roundNumTo = function roundNumTo(value) {
  var numDecimal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var multiplicationFactor = MH.pow(10, numDecimal);
  return MH.round(value * multiplicationFactor) / multiplicationFactor;
};

/**
 * Returns true if the given value is a valid _finite_ number.
 *
 * @category Validation
 */
export var isValidNum = function isValidNum(value) {
  return MH.isNumber(value) && MC.NUMBER.isFinite(value);
};

/**
 * If the given value is a valid _finite_ number, it is returned, otherwise
 * the default is returned.
 *
 * @category Math
 */
export var toNum = function toNum(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var numValue = MH.isLiteralString(value) ? MH.parseFloat(value) : value;

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
export var toInt = function toInt(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var numValue = toNum(value, null);
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
export var toNonNegNum = function toNonNegNum(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var numValue = toNum(value, null);
  return numValue !== null && numValue >= 0 ? numValue : defaultValue;
};

/**
 * If the given value is a valid positive number, it is returned, otherwise the
 * default is returned.
 *
 * @category Math
 */
export var toPosNum = function toPosNum(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var numValue = toNum(value, null);
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
export var toNumWithBounds = function toNumWithBounds(value, limits, defaultValue) {
  var _limits$min, _limits$max;
  var isDefaultGiven = defaultValue !== undefined;
  var numValue = toNum(value, null);
  var min = (_limits$min = limits === null || limits === void 0 ? void 0 : limits.min) !== null && _limits$min !== void 0 ? _limits$min : null;
  var max = (_limits$max = limits === null || limits === void 0 ? void 0 : limits.max) !== null && _limits$max !== void 0 ? _limits$max : null;
  var result;
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
export var maxAbs = function maxAbs() {
  for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }
  return MH.max.apply(MH, _toConsumableArray(values.map(function (v) {
    return MH.abs(v);
  })));
};

/**
 * Returns the smallest absolute value among the given ones.
 *
 * The result is always positive.
 *
 * @category Math
 */
export var minAbs = function minAbs() {
  for (var _len2 = arguments.length, values = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    values[_key2] = arguments[_key2];
  }
  return MH.min.apply(MH, _toConsumableArray(values.map(function (v) {
    return MH.abs(v);
  })));
};

/**
 * Returns the value with the largest absolute value among the given ones.
 *
 * The result can be negative.
 *
 * @category Math
 */
export var havingMaxAbs = function havingMaxAbs() {
  for (var _len3 = arguments.length, values = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    values[_key3] = arguments[_key3];
  }
  return MH.lengthOf(values) ? values.sort(function (a, b) {
    return MH.abs(b) - MH.abs(a);
  })[0] : -MC.INFINITY;
};

/**
 * Returns the value with the smallest absolute value among the given ones.
 *
 * The result can be negative.
 *
 * @category Math
 */
export var havingMinAbs = function havingMinAbs() {
  for (var _len4 = arguments.length, values = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    values[_key4] = arguments[_key4];
  }
  return MH.lengthOf(values) ? values.sort(function (a, b) {
    return MH.abs(a) - MH.abs(b);
  })[0] : MC.INFINITY;
};

/**
 * Returns the angle (in radians) that the vector defined by the given x, y
 * makes with the positive horizontal axis.
 *
 * The angle returned is in the range -PI to PI, not including -PI.
 *
 * @category Math
 */
export var hAngle = function hAngle(x, y) {
  return normalizeAngle(MC.MATH.atan2(y, x));
}; // ensure that -PI is transformed to +PI

/**
 * Normalizes the given angle (in radians) so that it's in the range -PI to PI,
 * not including -PI.
 *
 * @category Math
 */
export var normalizeAngle = function normalizeAngle(a) {
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
export var degToRad = function degToRad(a) {
  return a * MC.PI / 180;
};

/**
 * Converts the given angle in radians to degrees.
 *
 * @category Math
 */
export var radToDeg = function radToDeg(a) {
  return a * 180 / MC.PI;
};

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
export var areParallel = function areParallel(vA, vB) {
  var angleDiffThreshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var angleA = hAngle(vA[0], vA[1]);
  var angleB = hAngle(vB[0], vB[1]);
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
export var areAntiParallel = function areAntiParallel(vA, vB) {
  var angleDiffThreshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  return areParallel(vA, [-vB[0], -vB[1]], angleDiffThreshold);
};

/**
 * Returns the distance between two points on the screen.
 *
 * @category Math
 */
export var distanceBetween = function distanceBetween(ptA, ptB) {
  return MH.sqrt(MH.pow(ptA[0] - ptB[0], 2) + MH.pow(ptA[1] - ptB[1], 2));
};

/**
 * Returns the two roots of the quadratic equation with coefficients
 * `a`, `b` & `c`, i.e. `a * x^2 + b * x + c = 0`
 *
 * The roots may be `NaN` if the quadratic has no real solutions.
 *
 * @category Math
 */
export var quadraticRoots = function quadraticRoots(a, b, c) {
  var z = MH.sqrt(b * b - 4 * a * c);
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
export var easeInOutQuad = function easeInOutQuad(x) {
  return x < 0.5 ? 2 * x * x : 1 - MH.pow(-2 * x + 2, 2) / 2;
};

/**
 * Returns an array of object's keys sorted by the numeric value they hold.
 *
 * @category Math
 */
export var sortedKeysByVal = function sortedKeysByVal(obj) {
  var descending = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (descending) {
    return MH.keysOf(obj).sort(function (x, y) {
      return obj[y] - obj[x];
    });
  }
  return MH.keysOf(obj).sort(function (x, y) {
    return obj[x] - obj[y];
  });
};

/**
 * Returns the key in the given object which holds the largest numeric value.
 *
 * If the object is empty, returns `undefined`.
 *
 * @category Math
 */
export var keyWithMaxVal = function keyWithMaxVal(obj) {
  return sortedKeysByVal(obj).slice(-1)[0];
};

/**
 * Returns the key in the given object which holds the smallest numeric value.
 *
 * If the object is empty, returns `undefined`.
 *
 * @category Math
 */
export var keyWithMinVal = function keyWithMinVal(obj) {
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
var _getBitmask = function getBitmask(start, end) {
  return start > end ? _getBitmask(end, start) : ~0 >>> 32 - end - 1 + start << start;
};
export { _getBitmask as getBitmask };
//# sourceMappingURL=math.js.map