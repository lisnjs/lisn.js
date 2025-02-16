function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
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
import { maxAbs, areParallel } from "./math.js";
import { isValidStrList, validateStrList } from "./validation.js";

/**
 * Returns the cardinal direction in the XY plane for the larger of the two
 * deltas (horizontal vs vertical).
 *
 * If both deltas are 0, returns "none".
 *
 * If both deltas are equal and non-0, returns "ambiguous".
 *
 * @category Directions
 */
export var getMaxDeltaDirection = function getMaxDeltaDirection(deltaX, deltaY) {
  if (!MH.abs(deltaX) && !MH.abs(deltaY)) {
    return MC.S_NONE;
  }
  if (MH.abs(deltaX) === MH.abs(deltaY)) {
    return MC.S_AMBIGUOUS;
  }
  if (MH.abs(deltaX) > MH.abs(deltaY)) {
    return deltaX < 0 ? MC.S_LEFT : MC.S_RIGHT;
  }
  return deltaY < 0 ? MC.S_UP : MC.S_DOWN;
};

/**
 * Returns the approximate direction of the given 2D vector as one of the
 * cardinal (XY plane) ones: "up", "down", "left" or "right"; or "ambiguous".
 *
 * @param {} angleDiffThreshold  See {@link areParallel} or
 *                               {@link Utils.areAntiParallel | areAntiParallel}.
 *                               This determines whether the inferred direction
 *                               is ambiguous. For it to _not_ be ambiguous it
 *                               must align with one of the four cardinal
 *                               directions to within `angleDiffThreshold`.
 *                               It doesn't make sense for this value to be < 0
 *                               or >= 45 degrees. If it is, it's forced to be
 *                               positive (absolute) and <= 44.99.
 *
 * @category Directions
 */
export var getVectorDirection = function getVectorDirection(vector) {
  var angleDiffThreshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  angleDiffThreshold = MH.min(44.99, MH.abs(angleDiffThreshold));
  if (!maxAbs.apply(void 0, _toConsumableArray(vector))) {
    return MC.S_NONE;
  } else if (areParallel(vector, [1, 0], angleDiffThreshold)) {
    return MC.S_RIGHT;
  } else if (areParallel(vector, [0, 1], angleDiffThreshold)) {
    return MC.S_DOWN;
  } else if (areParallel(vector, [-1, 0], angleDiffThreshold)) {
    return MC.S_LEFT;
  } else if (areParallel(vector, [0, -1], angleDiffThreshold)) {
    return MC.S_UP;
  }
  return MC.S_AMBIGUOUS;
};

/**
 * Returns the opposite direction to the given direction or null if the given
 * direction has no opposite.
 *
 * @example
 * ```javascript
 * getOppositeDirection("up"); // -> "down"
 * getOppositeDirection("down"); // -> "up"
 * getOppositeDirection("left"); // -> "right"
 * getOppositeDirection("right"); // -> "left"
 * getOppositeDirection("none"); // -> null
 * getOppositeDirection("ambiguous"); // -> null
 * ```
 *
 * @category Directions
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the given view is not valid.
 */
export var getOppositeDirection = function getOppositeDirection(direction) {
  if (!(direction in OPPOSITE_DIRECTIONS)) {
    throw MH.usageError("Invalid 'direction'");
  }
  return OPPOSITE_DIRECTIONS[direction];
};

/**
 * Returns the set of directions which are opposite to the given set of directions.
 *
 * There are two sets of opposite pairs ("up"/"down" and "left"/"right") and at
 * least one of the two opposing directions of a pair must be present for the
 * other one to be included. If both directions that constitute a pair of
 * opposites is given, then the other pair is returned instead (minus any that
 * are present in the input). See examples below for clarification.
 *
 * @example
 * ```javascript
 * getOppositeXYDirections("up"); // -> ["down"]
 * getOppositeXYDirections("left"); // -> ["right"]
 * getOppositeXYDirections("up,down"); // -> ["left","right"]
 * getOppositeXYDirections("up,left"); // -> ["down","right"]
 * getOppositeXYDirections("up,left,right"); // -> ["down"]
 * getOppositeXYDirections("none"); // -> throws
 * getOppositeXYDirections("ambiguous"); // -> throws
 * getOppositeXYDirections("in"); // -> throws
 * ```
 *
 * @category Directions
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the given view is not valid.
 */
export var getOppositeXYDirections = function getOppositeXYDirections(directions) {
  var directionList = validateStrList("directions", directions, isValidXYDirection);
  if (!directionList) {
    throw MH.usageError("'directions' is required");
  }
  var opposites = [];
  var _iterator = _createForOfIteratorHelper(directionList),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _direction = _step.value;
      var opposite = getOppositeDirection(_direction);
      if (opposite && isValidXYDirection(opposite) && !MH.includes(directionList, opposite)) {
        opposites.push(opposite);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (!MH.lengthOf(opposites)) {
    var _iterator2 = _createForOfIteratorHelper(XY_DIRECTIONS),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var direction = _step2.value;
        if (!MH.includes(directionList, direction)) {
          opposites.push(direction);
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }
  return opposites;
};

/**
 * Returns true if the given direction is one of the known XY ones.
 *
 * @category Validation
 */
export var isValidXYDirection = function isValidXYDirection(direction) {
  return MH.includes(XY_DIRECTIONS, direction);
};

/**
 * Returns true if the given direction is one of the known Z ones.
 *
 * @category Validation
 */
export var isValidZDirection = function isValidZDirection(direction) {
  return MH.includes(Z_DIRECTIONS, direction);
};

/**
 * Returns true if the given string is a valid direction.
 *
 * @category Validation
 */
export var isValidDirection = function isValidDirection(direction) {
  return MH.includes(DIRECTIONS, direction);
};

/**
 * Returns true if the given string or array is a list of valid directions.
 *
 * @category Validation
 */
export var isValidDirectionList = function isValidDirectionList(directions) {
  return isValidStrList(directions, isValidDirection, false);
};

/**
 * @ignore
 * @internal
 */
export var XY_DIRECTIONS = [MC.S_UP, MC.S_DOWN, MC.S_LEFT, MC.S_RIGHT];

/**
 * @ignore
 * @internal
 */
export var Z_DIRECTIONS = [MC.S_IN, MC.S_OUT];

/**
 * @ignore
 * @internal
 */
export var SCROLL_DIRECTIONS = [].concat(XY_DIRECTIONS, [MC.S_NONE, MC.S_AMBIGUOUS]);

/**
 * @ignore
 * @internal
 */
export var DIRECTIONS = [].concat(XY_DIRECTIONS, Z_DIRECTIONS, [MC.S_NONE, MC.S_AMBIGUOUS]);

// --------------------

var OPPOSITE_DIRECTIONS = _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, MC.S_UP, MC.S_DOWN), MC.S_DOWN, MC.S_UP), MC.S_LEFT, MC.S_RIGHT), MC.S_RIGHT, MC.S_LEFT), MC.S_IN, MC.S_OUT), MC.S_OUT, MC.S_IN), MC.S_NONE, null), MC.S_AMBIGUOUS, null);
//# sourceMappingURL=directions.js.map