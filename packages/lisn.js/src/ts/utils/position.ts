/**
 * @module Utils
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { Position } from "@lisn/globals/types";

/**
 * @category Validation
 */
export const isValidPosition = (position: string): position is Position =>
  MH.includes(POSITIONS as readonly string[], position);

/**
 * @category Validation
 */
export const isValidTwoFoldPosition = (
  position: string,
): position is `${Position}-${Position}` =>
  position.match(TWO_FOLD_POSITION_REGEX) !== null;

/**
 * @ignore
 * @internal
 */
export const POSITIONS = [
  MC.S_TOP,
  MC.S_BOTTOM,
  MC.S_LEFT,
  MC.S_RIGHT,
] as const;

// --------------------

const POSITIONS_OPTIONS_STR = "(" + POSITIONS.join("|") + ")";

const TWO_FOLD_POSITION_REGEX = RegExp(
  `^${POSITIONS_OPTIONS_STR}-${POSITIONS_OPTIONS_STR}$`,
);
