/**
 * @module Utils
 */

import * as _ from "@lisn/_internal";

import { usageError } from "@lisn/globals/errors";

import {
  Direction,
  XYDirection,
  ZDirection,
  NoDirection,
  AmbiguousDirection,
  CommaSeparatedStr,
  Vector,
} from "@lisn/globals/types";

import { maxAbs, areParallel } from "@lisn/utils/math";
import { isValidStrList, validateStrList } from "@lisn/utils/validation";

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
export const getMaxDeltaDirection = (
  deltaX: number,
  deltaY: number,
): XYDirection | NoDirection | AmbiguousDirection => {
  if (!_.abs(deltaX) && !_.abs(deltaY)) {
    return _.S_NONE;
  }

  if (_.abs(deltaX) === _.abs(deltaY)) {
    return _.S_AMBIGUOUS;
  }

  if (_.abs(deltaX) > _.abs(deltaY)) {
    return deltaX < 0 ? _.S_LEFT : _.S_RIGHT;
  }
  return deltaY < 0 ? _.S_UP : _.S_DOWN;
};

/**
 * Returns the approximate direction of the given 2D vector as one of the
 * cardinal (XY plane) ones: "up", "down", "left" or "right"; or "ambiguous".
 *
 * @param angleDiffThreshold See {@link areParallel} or
 *                           {@link Utils.areAntiParallel | areAntiParallel}.
 *                           This determines whether the inferred direction is
 *                           ambiguous. For it to _not_ be ambiguous it must
 *                           align with one of the four cardinal directions to
 *                           within `angleDiffThreshold`. It doesn't make
 *                           sense for this value to be < 0 or >= 45 degrees.
 *                           If it is, it's forced to be positive (absolute)
 *                           and <= 44.99.
 *
 * @category Directions
 */
export const getVectorDirection = (
  vector: Vector,
  angleDiffThreshold = 0,
): XYDirection | AmbiguousDirection | NoDirection => {
  angleDiffThreshold = _.min(44.99, _.abs(angleDiffThreshold));

  if (!maxAbs(...vector)) {
    return _.S_NONE;
  } else if (areParallel(vector, [1, 0], angleDiffThreshold)) {
    return _.S_RIGHT;
  } else if (areParallel(vector, [0, 1], angleDiffThreshold)) {
    return _.S_DOWN;
  } else if (areParallel(vector, [-1, 0], angleDiffThreshold)) {
    return _.S_LEFT;
  } else if (areParallel(vector, [0, -1], angleDiffThreshold)) {
    return _.S_UP;
  }

  return _.S_AMBIGUOUS;
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
export const getOppositeDirection = (
  direction: Direction,
): Direction | null => {
  if (!(direction in OPPOSITE_DIRECTIONS)) {
    throw usageError("Invalid 'direction'");
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
export const getOppositeXYDirections = (
  directions: CommaSeparatedStr<XYDirection> | XYDirection[],
): XYDirection[] => {
  const directionList = validateStrList(
    "directions",
    directions,
    isValidXYDirection,
  );

  if (!directionList) {
    throw usageError("'directions' is required");
  }

  const opposites: XYDirection[] = [];
  for (const direction of directionList) {
    const opposite = getOppositeDirection(direction);
    if (
      opposite &&
      isValidXYDirection(opposite) &&
      !_.includes(directionList, opposite)
    ) {
      opposites.push(opposite);
    }
  }

  if (!_.lengthOf(opposites)) {
    for (const direction of XY_DIRECTIONS) {
      if (!_.includes(directionList, direction)) {
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
export const isValidXYDirection = (
  direction: string,
): direction is XYDirection => _.includes(XY_DIRECTIONS, direction);

/**
 * Returns true if the given direction is one of the known Z ones.
 *
 * @category Validation
 */
export const isValidZDirection = (direction: string): direction is ZDirection =>
  _.includes(Z_DIRECTIONS, direction);

/**
 * Returns true if the given string is a valid direction.
 *
 * @category Validation
 */
export const isValidDirection = (direction: string): direction is Direction =>
  _.includes(DIRECTIONS, direction);

/**
 * Returns true if the given string or array is a list of valid directions.
 *
 * @category Validation
 */
export const isValidDirectionList = (
  directions: string | string[],
): directions is CommaSeparatedStr<Direction> | Direction[] =>
  isValidStrList(directions, isValidDirection, false);

/**
 * @ignore
 * @internal
 */
export const XY_DIRECTIONS = [_.S_UP, _.S_DOWN, _.S_LEFT, _.S_RIGHT] as const;

/**
 * @ignore
 * @internal
 */
export const Z_DIRECTIONS = [_.S_IN, _.S_OUT] as const;

/**
 * @ignore
 * @internal
 */
export const SCROLL_DIRECTIONS = [
  ...XY_DIRECTIONS,
  _.S_NONE,
  _.S_AMBIGUOUS,
] as const;

/**
 * @ignore
 * @internal
 */
export const DIRECTIONS = [
  ...XY_DIRECTIONS,
  ...Z_DIRECTIONS,
  _.S_NONE,
  _.S_AMBIGUOUS,
] as const;

// --------------------

const OPPOSITE_DIRECTIONS = {
  [_.S_UP]: _.S_DOWN,
  [_.S_DOWN]: _.S_UP,
  [_.S_LEFT]: _.S_RIGHT,
  [_.S_RIGHT]: _.S_LEFT,
  [_.S_IN]: _.S_OUT,
  [_.S_OUT]: _.S_IN,
  [_.S_NONE]: null,
  [_.S_AMBIGUOUS]: null,
} as const;
