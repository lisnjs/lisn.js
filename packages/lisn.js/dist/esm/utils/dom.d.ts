/**
 * @module Utils
 */
import { MutationCategory } from "../globals/types.js";
/**
 * Returns true if the given string is a valid category.
 *
 * @category Validation
 */
export declare const isValidMutationCategory: (category: string) => category is MutationCategory;
/**
 * Returns true if the given string or array is a list of valid categories.
 *
 * @category Validation
 */
export declare const isValidMutationCategoryList: (categories: string | string[]) => categories is "removed" | "added" | "attribute" | "added,attribute" | "attribute,added" | "removed,added" | "removed,attribute" | "removed,added,attribute" | "removed,attribute,added" | "attribute,removed" | "added,removed" | "added,removed,attribute" | "added,attribute,removed" | "attribute,removed,added" | "attribute,added,removed" | MutationCategory[];
/**
 * @ignore
 * @internal
 */
export declare const DOM_CATEGORIES_SPACE: import("../modules/bit-spaces.js").BitSpace<MutationCategory>;
//# sourceMappingURL=dom.d.ts.map