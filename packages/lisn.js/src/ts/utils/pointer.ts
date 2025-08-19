/**
 * @module Utils
 */

import * as _ from "@lisn/_internal";

import { PointerAction } from "@lisn/globals/types";

import { isValidStrList } from "@lisn/utils/validation";

/**
 * Returns true if the given string is a valid pointer action.
 *
 * @category Validation
 */
export const isValidPointerAction = (action: string): action is PointerAction =>
  _.includes(POINTER_ACTIONS, action);

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
  _.S_CLICK,
  _.S_HOVER,
  _.S_PRESS,
] as const;
