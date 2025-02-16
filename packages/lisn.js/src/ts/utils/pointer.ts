/**
 * @module Utils
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { PointerAction } from "@lisn/globals/types";

import { isValidStrList } from "@lisn/utils/validation";

/**
 * Returns true if the given string is a valid pointer action.
 *
 * @category Validation
 */
export const isValidPointerAction = (action: string): action is PointerAction =>
  MH.includes(POINTER_ACTIONS, action);

/**
 * Returns true if the given string or array is a valid list of pointer
 * actions.
 *
 * @category Validation
 */
export const isValidPointerActionList = (actions: string | string[]) =>
  isValidStrList(actions, isValidPointerAction, false);

/**
 * @ignore
 * @internal
 */
export const POINTER_ACTIONS: PointerAction[] = [
  MC.S_CLICK,
  MC.S_HOVER,
  MC.S_PRESS,
] as const;
