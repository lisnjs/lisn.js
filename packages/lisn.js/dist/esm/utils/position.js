/**
 * @module Utils
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
/**
 * @category Validation
 */
export var isValidPosition = function isValidPosition(position) {
  return MH.includes(POSITIONS, position);
};

/**
 * @category Validation
 */
export var isValidTwoFoldPosition = function isValidTwoFoldPosition(position) {
  return position.match(TWO_FOLD_POSITION_REGEX) !== null;
};

/**
 * @ignore
 * @internal
 */
export var POSITIONS = [MC.S_TOP, MC.S_BOTTOM, MC.S_LEFT, MC.S_RIGHT];

// --------------------

var POSITIONS_OPTIONS_STR = "(" + POSITIONS.join("|") + ")";
var TWO_FOLD_POSITION_REGEX = RegExp("^".concat(POSITIONS_OPTIONS_STR, "-").concat(POSITIONS_OPTIONS_STR, "$"));
//# sourceMappingURL=position.js.map