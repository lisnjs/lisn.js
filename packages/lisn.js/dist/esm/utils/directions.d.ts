/**
 * @module Utils
 */
import { Direction, XYDirection, ZDirection, NoDirection, AmbiguousDirection, CommaSeparatedStr, Vector } from "../globals/types.js";
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
export declare const getMaxDeltaDirection: (deltaX: number, deltaY: number) => XYDirection | NoDirection | AmbiguousDirection;
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
export declare const getVectorDirection: (vector: Vector, angleDiffThreshold?: number) => XYDirection | AmbiguousDirection | NoDirection;
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
export declare const getOppositeDirection: (direction: Direction) => Direction | null;
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
export declare const getOppositeXYDirections: (directions: CommaSeparatedStr<XYDirection> | XYDirection[]) => XYDirection[];
/**
 * Returns true if the given direction is one of the known XY ones.
 *
 * @category Validation
 */
export declare const isValidXYDirection: (direction: string) => direction is XYDirection;
/**
 * Returns true if the given direction is one of the known Z ones.
 *
 * @category Validation
 */
export declare const isValidZDirection: (direction: string) => direction is ZDirection;
/**
 * Returns true if the given string is a valid direction.
 *
 * @category Validation
 */
export declare const isValidDirection: (direction: string) => direction is Direction;
/**
 * Returns true if the given string or array is a list of valid directions.
 *
 * @category Validation
 */
export declare const isValidDirectionList: (directions: string | string[]) => directions is CommaSeparatedStr<Direction> | Direction[];
/**
 * @ignore
 * @internal
 */
export declare const XY_DIRECTIONS: readonly ["up", "down", "left", "right"];
/**
 * @ignore
 * @internal
 */
export declare const Z_DIRECTIONS: readonly ["in", "out"];
/**
 * @ignore
 * @internal
 */
export declare const SCROLL_DIRECTIONS: readonly ["up", "down", "left", "right", "none", "ambiguous"];
/**
 * @ignore
 * @internal
 */
export declare const DIRECTIONS: readonly ["up", "down", "left", "right", "in", "out", "none", "ambiguous"];
//# sourceMappingURL=directions.d.ts.map