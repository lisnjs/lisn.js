/**
 * @module Utils
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
/**
 * @category Validation
 */
export const isValidPosition = position => MH.includes(POSITIONS, position);

/**
 * @category Validation
 */
export const isValidTwoFoldPosition = position => position.match(TWO_FOLD_POSITION_REGEX) !== null;

/**
 * @ignore
 * @internal
 */
export const POSITIONS = [MC.S_TOP, MC.S_BOTTOM, MC.S_LEFT, MC.S_RIGHT];

// --------------------

const POSITIONS_OPTIONS_STR = "(" + POSITIONS.join("|") + ")";
const TWO_FOLD_POSITION_REGEX = RegExp(`^${POSITIONS_OPTIONS_STR}-${POSITIONS_OPTIONS_STR}$`);
//# sourceMappingURL=position.js.map