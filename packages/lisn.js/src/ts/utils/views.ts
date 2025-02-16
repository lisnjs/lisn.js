/**
 * @module Utils
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { ScrollOffset, View, CommaSeparatedStr } from "@lisn/globals/types";

import { isValidStrList, validateStrList } from "@lisn/utils/validation";

import { newBitSpaces, createBitSpace } from "@lisn/modules/bit-spaces";

/**
 * Returns true if the given string is a valid {@link ScrollOffset}.
 *
 * @category Validation
 */
export const isValidScrollOffset = (offset: string): offset is ScrollOffset =>
  offset.match(OFFSET_REGEX) !== null;

/**
 * Returns true if the given string is a valid "view".
 *
 * @category Validation
 */
export const isValidView = (view: string): view is View =>
  MH.includes(VIEWS, view);

/**
 * Returns true if the given string or array is a list of valid views.
 *
 * @category Validation
 */
export const isValidViewList = (views: string | string[]) =>
  isValidStrList(views, isValidView, false);

/**
 * Returns the views that are opposite to the given set of views.
 *
 * Above and below are opposites, and so are left and right.
 *
 * "at" is a special case. It is considered opposite to any view in the sense
 * that if it is not present in `views` it will always be included in the
 * returned array. However it is not "strongly" opposite in the sense that it
 * will not cause other views to be included in the result unless it is the
 * only view in `views`. That is, there are two sets of strongly opposite pairs
 * ("above"/"below" and "left"/"right") and at least one of the two opposing
 * views of a pair must be present for the other one to be included, _except in
 * the special case of `views` being "at"_. See examples below for
 * clarification.
 *
 * **Note** that the order of the returned array is not defined.
 *
 * @example
 * Returns ["above", "below", "left", "right"] (not definite order), since
 * "at" is the only view present and is opposite to all:
 *
 * ```javascript
 * getOppositeViews("at"); // -> ["above", "below", "left", "right"] (not necessarily in this order)
 * ```
 *
 * @example
 * Returns ["below"]. "left" and "right" are NOT included even though "at" is
 * given, because at least one of the two opposing views of a pair must be
 * present for the other one to be included (except in the special case of
 * `views` being "at").
 *
 * ```javascript
 * getOppositeViews("at,above"); // -> ["below"]
 * ```
 *
 * @example
 * ```javascript
 * getOppositeViews("above"); // -> ["at", "below"] (not necessarily in this order)
 * ```
 *
 * @example
 * ```javascript
 * getOppositeViews("above,below"); // -> ["at"]
 * ```
 *
 * @example
 * ```javascript
 * getOppositeViews("at,above,below"); // -> []
 * ```
 *
 * @example
 * ```javascript
 * getOppositeViews("above,right"); // -> ["at", "below", "left"] (not necessarily in this order)
 * ```
 *
 * @example
 * ```javascript
 * getOppositeViews("at,above,right"); // -> ["below", "left"] (not necessarily in this order)
 * ```
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the given view is not valid, including if it's empty "".
 *
 * @category Views
 */
export const getOppositeViews = (
  views: CommaSeparatedStr<View> | View[],
): View[] => {
  if (!views) {
    throw MH.usageError("'views' cannot be empty");
  }

  const bitmask = getViewsBitmask(views);
  let oppositeBitmask = VIEWS_SPACE.bitmask & ~bitmask; // initial, all not present in bitmask

  // If the given view is "at", then include all the other ones.
  // Otherwise include only the opposite views of those directional
  // (above/below/left/right) that are present. I.e. if neither left not right
  // is given, then don't include them
  if (bitmask !== VIEWS_SPACE.bit.at) {
    // remove the opposite ones to those not present
    if (!(bitmask & VIEWS_SPACE.bit.above)) {
      oppositeBitmask &= ~VIEWS_SPACE.bit.below;
    }

    if (!(bitmask & VIEWS_SPACE.bit.below)) {
      oppositeBitmask &= ~VIEWS_SPACE.bit.above;
    }

    if (!(bitmask & VIEWS_SPACE.bit.left)) {
      oppositeBitmask &= ~VIEWS_SPACE.bit.right;
    }

    if (!(bitmask & VIEWS_SPACE.bit.right)) {
      oppositeBitmask &= ~VIEWS_SPACE.bit.left;
    }
  }

  return getViewsFromBitmask(oppositeBitmask);
};

/**
 * @ignore
 * @internal
 */
export const getViewsBitmask = (
  viewsStr: View[] | string | undefined,
): number => {
  let viewsBitmask = 0;
  const views = validateStrList("views", viewsStr, isValidView);

  if (views) {
    for (const v of views) {
      if (!isValidView(v)) {
        throw MH.usageError(`Unknown view '${v}'`);
      }

      viewsBitmask |= VIEWS_SPACE.bit[v];
    }
  } else {
    viewsBitmask = VIEWS_SPACE.bitmask; // default: all
  }

  return viewsBitmask;
};

/**
 * @ignore
 * @internal
 */
export const parseScrollOffset = (input: string) => {
  const match = input.match(OFFSET_REGEX);
  if (!match) {
    throw MH.usageError(`Invalid offset: '${input}'`);
  }

  const reference = match[1];
  const value = match[2];
  /* istanbul ignore next */ // shouldn't happen
  if (!reference || !value) {
    throw MH.bugError("Offset regex: blank capture groups");
  }

  return { reference, value };
};

const VIEWS: View[] = [
  MC.S_AT,
  MC.S_ABOVE,
  MC.S_BELOW,
  MC.S_LEFT,
  MC.S_RIGHT,
] as const;

/**
 * @ignore
 * @internal
 */
export const VIEWS_SPACE = createBitSpace<View>(newBitSpaces(), ...VIEWS);

// --------------------

// Don't use capture groups for old browser support
const OFFSET_REGEX = RegExp("(top|bottom|left|right): *([^ ].+)");

const getViewsFromBitmask = (bitmask: number): View[] => {
  const views: View[] = [];
  for (let bit = VIEWS_SPACE.start; bit <= VIEWS_SPACE.end; bit++) {
    const value = 1 << bit;
    if (bitmask & value) {
      const name = VIEWS_SPACE.nameOf(value);
      if (name) {
        views.push(name);
      }
    }
  }

  return views;
};
