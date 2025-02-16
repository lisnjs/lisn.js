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
export const getMaxDeltaDirection = (deltaX, deltaY) => {
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
export const getVectorDirection = (vector, angleDiffThreshold = 0) => {
  angleDiffThreshold = MH.min(44.99, MH.abs(angleDiffThreshold));
  if (!maxAbs(...vector)) {
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
export const getOppositeDirection = direction => {
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
export const getOppositeXYDirections = directions => {
  const directionList = validateStrList("directions", directions, isValidXYDirection);
  if (!directionList) {
    throw MH.usageError("'directions' is required");
  }
  const opposites = [];
  for (const direction of directionList) {
    const opposite = getOppositeDirection(direction);
    if (opposite && isValidXYDirection(opposite) && !MH.includes(directionList, opposite)) {
      opposites.push(opposite);
    }
  }
  if (!MH.lengthOf(opposites)) {
    for (const direction of XY_DIRECTIONS) {
      if (!MH.includes(directionList, direction)) {
        opposites.push(direction);
      }
    }
  }
  return opposites;
};

/**
 * Returns true if the given direction is one of the known XY ones.
 *
 * @category Validation
 */
export const isValidXYDirection = direction => MH.includes(XY_DIRECTIONS, direction);

/**
 * Returns true if the given direction is one of the known Z ones.
 *
 * @category Validation
 */
export const isValidZDirection = direction => MH.includes(Z_DIRECTIONS, direction);

/**
 * Returns true if the given string is a valid direction.
 *
 * @category Validation
 */
export const isValidDirection = direction => MH.includes(DIRECTIONS, direction);

/**
 * Returns true if the given string or array is a list of valid directions.
 *
 * @category Validation
 */
export const isValidDirectionList = directions => isValidStrList(directions, isValidDirection, false);

/**
 * @ignore
 * @internal
 */
export const XY_DIRECTIONS = [MC.S_UP, MC.S_DOWN, MC.S_LEFT, MC.S_RIGHT];

/**
 * @ignore
 * @internal
 */
export const Z_DIRECTIONS = [MC.S_IN, MC.S_OUT];

/**
 * @ignore
 * @internal
 */
export const SCROLL_DIRECTIONS = [...XY_DIRECTIONS, MC.S_NONE, MC.S_AMBIGUOUS];

/**
 * @ignore
 * @internal
 */
export const DIRECTIONS = [...XY_DIRECTIONS, ...Z_DIRECTIONS, MC.S_NONE, MC.S_AMBIGUOUS];

// --------------------

const OPPOSITE_DIRECTIONS = {
  [MC.S_UP]: MC.S_DOWN,
  [MC.S_DOWN]: MC.S_UP,
  [MC.S_LEFT]: MC.S_RIGHT,
  [MC.S_RIGHT]: MC.S_LEFT,
  [MC.S_IN]: MC.S_OUT,
  [MC.S_OUT]: MC.S_IN,
  [MC.S_NONE]: null,
  [MC.S_AMBIGUOUS]: null
};
//# sourceMappingURL=directions.js.map