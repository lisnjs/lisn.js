/**
 * @module Utils
 */

import * as _ from "@lisn/_internal";

import { Position } from "@lisn/globals/types";

/**
 * @category Validation
 */
export const isValidPosition = (position: string): position is Position =>
  _.includes(POSITIONS as readonly string[], position);

/**
 * @category Validation
 */
export const isValidTwoFoldPosition = (
  position: string,
): position is `${Position}-${Position}` =>
  !_.isNull(position.match(TWO_FOLD_POSITION_REGEX));

/**
 * @ignore
 * @internal
 */
export const POSITIONS = [_.S_TOP, _.S_BOTTOM, _.S_LEFT, _.S_RIGHT] as const;

// --------------------

const POSITIONS_OPTIONS_STR = "(" + POSITIONS.join("|") + ")";

const TWO_FOLD_POSITION_REGEX = RegExp(
  `^${POSITIONS_OPTIONS_STR}-${POSITIONS_OPTIONS_STR}$`,
);
