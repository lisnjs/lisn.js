/**
 * @module Utils
 */

import * as MC from "@lisn/globals/minification-constants";

import { MutationCategory } from "@lisn/globals/types";

import { isValidStrList } from "@lisn/utils/validation";

import { newBitSpaces, createBitSpace } from "@lisn/modules/bit-spaces";

/**
 * Returns true if the given string is a valid category.
 *
 * @category Validation
 */
export const isValidMutationCategory = (
  category: string,
): category is MutationCategory => DOM_CATEGORIES_SPACE.has(category);

/**
 * Returns true if the given string or array is a list of valid categories.
 *
 * @category Validation
 */
export const isValidMutationCategoryList = (categories: string | string[]) =>
  isValidStrList(categories, isValidMutationCategory, false);

/**
 * @ignore
 * @internal
 */
export const DOM_CATEGORIES_SPACE = createBitSpace<MutationCategory>(
  newBitSpaces(),
  MC.S_ADDED,
  MC.S_REMOVED,
  MC.S_ATTRIBUTE,
);
