/**
 * @module Utils
 */

import * as MC from "../globals/minification-constants.js";
import { isValidStrList } from "./validation.js";
import { newBitSpaces, createBitSpace } from "../modules/bit-spaces.js";

/**
 * Returns true if the given string is a valid category.
 *
 * @category Validation
 */
export const isValidMutationCategory = category => DOM_CATEGORIES_SPACE.has(category);

/**
 * Returns true if the given string or array is a list of valid categories.
 *
 * @category Validation
 */
export const isValidMutationCategoryList = categories => isValidStrList(categories, isValidMutationCategory, false);

/**
 * @ignore
 * @internal
 */
export const DOM_CATEGORIES_SPACE = createBitSpace(newBitSpaces(), MC.S_ADDED, MC.S_REMOVED, MC.S_ATTRIBUTE);
//# sourceMappingURL=dom.js.map