/**
 * @module Utils
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { isValidStrList } from "./validation.js";

/**
 * Returns true if the given string is a valid pointer action.
 *
 * @category Validation
 */
export const isValidPointerAction = action => MH.includes(POINTER_ACTIONS, action);

/**
 * Returns true if the given string or array is a valid list of pointer
 * actions.
 *
 * @category Validation
 */
export const isValidPointerActionList = actions => isValidStrList(actions, isValidPointerAction, false);

/**
 * @ignore
 * @internal
 */
export const POINTER_ACTIONS = [MC.S_CLICK, MC.S_HOVER, MC.S_PRESS];
//# sourceMappingURL=pointer.js.map