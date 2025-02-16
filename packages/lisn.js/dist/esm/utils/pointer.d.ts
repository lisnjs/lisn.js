/**
 * @module Utils
 */
import { PointerAction } from "../globals/types.js";
/**
 * Returns true if the given string is a valid pointer action.
 *
 * @category Validation
 */
export declare const isValidPointerAction: (action: string) => action is PointerAction;
/**
 * Returns true if the given string or array is a valid list of pointer
 * actions.
 *
 * @category Validation
 */
export declare const isValidPointerActionList: (actions: string | string[]) => actions is "click" | "hover" | "press" | PointerAction[] | "hover,press" | "press,hover" | "click,hover" | "click,press" | "click,hover,press" | "click,press,hover" | "press,click" | "hover,click" | "hover,click,press" | "hover,press,click" | "press,click,hover" | "press,hover,click";
/**
 * @ignore
 * @internal
 */
export declare const POINTER_ACTIONS: PointerAction[];
//# sourceMappingURL=pointer.d.ts.map