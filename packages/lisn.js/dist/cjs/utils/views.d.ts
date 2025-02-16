/**
 * @module Utils
 */
import { ScrollOffset, View, CommaSeparatedStr } from "../globals/types.cjs";
/**
 * Returns true if the given string is a valid {@link ScrollOffset}.
 *
 * @category Validation
 */
export declare const isValidScrollOffset: (offset: string) => offset is ScrollOffset;
/**
 * Returns true if the given string is a valid "view".
 *
 * @category Validation
 */
export declare const isValidView: (view: string) => view is View;
/**
 * Returns true if the given string or array is a list of valid views.
 *
 * @category Validation
 */
export declare const isValidViewList: (views: string | string[]) => views is "at" | "left" | "right" | "above" | "below" | "left,right" | "right,left" | "above,below" | "below,above" | "right,above" | "right,below" | "right,above,below" | "right,below,above" | "below,right" | "above,right" | "above,right,below" | "above,below,right" | "below,right,above" | "below,above,right" | "left,above" | "left,below" | "left,above,below" | "left,below,above" | "left,right,above" | "left,right,below" | "left,right,above,below" | "left,right,below,above" | "left,below,right" | "left,above,right" | "left,above,right,below" | "left,above,below,right" | "left,below,right,above" | "left,below,above,right" | "below,left" | "above,left" | "above,left,below" | "above,below,left" | "below,left,above" | "below,above,left" | "right,left,above" | "right,left,below" | "right,left,above,below" | "right,left,below,above" | "right,below,left" | "right,above,left" | "right,above,left,below" | "right,above,below,left" | "right,below,left,above" | "right,below,above,left" | "below,left,right" | "below,right,left" | "above,left,right" | "above,right,left" | "above,left,right,below" | "above,left,below,right" | "above,right,left,below" | "above,right,below,left" | "above,below,left,right" | "above,below,right,left" | "below,left,right,above" | "below,left,above,right" | "below,right,left,above" | "below,right,above,left" | "below,above,left,right" | "below,above,right,left" | "at,left" | "at,right" | "at,above" | "at,below" | "at,left,right" | "at,right,left" | "at,above,below" | "at,below,above" | "at,right,above" | "at,right,below" | "at,right,above,below" | "at,right,below,above" | "at,below,right" | "at,above,right" | "at,above,right,below" | "at,above,below,right" | "at,below,right,above" | "at,below,above,right" | "at,left,above" | "at,left,below" | "at,left,above,below" | "at,left,below,above" | "at,left,right,above" | "at,left,right,below" | "at,left,right,above,below" | "at,left,right,below,above" | "at,left,below,right" | "at,left,above,right" | "at,left,above,right,below" | "at,left,above,below,right" | "at,left,below,right,above" | "at,left,below,above,right" | "at,below,left" | "at,above,left" | "at,above,left,below" | "at,above,below,left" | "at,below,left,above" | "at,below,above,left" | "at,right,left,above" | "at,right,left,below" | "at,right,left,above,below" | "at,right,left,below,above" | "at,right,below,left" | "at,right,above,left" | "at,right,above,left,below" | "at,right,above,below,left" | "at,right,below,left,above" | "at,right,below,above,left" | "at,below,left,right" | "at,below,right,left" | "at,above,left,right" | "at,above,right,left" | "at,above,left,right,below" | "at,above,left,below,right" | "at,above,right,left,below" | "at,above,right,below,left" | "at,above,below,left,right" | "at,above,below,right,left" | "at,below,left,right,above" | "at,below,left,above,right" | "at,below,right,left,above" | "at,below,right,above,left" | "at,below,above,left,right" | "at,below,above,right,left" | "below,at" | "above,at" | "above,at,below" | "above,below,at" | "below,at,above" | "below,above,at" | "right,at" | "right,at,above" | "right,at,below" | "right,at,above,below" | "right,at,below,above" | "right,below,at" | "right,above,at" | "right,above,at,below" | "right,above,below,at" | "right,below,at,above" | "right,below,above,at" | "below,at,right" | "below,right,at" | "above,at,right" | "above,at,right,below" | "above,at,below,right" | "above,right,at" | "above,right,at,below" | "above,right,below,at" | "above,below,at,right" | "above,below,right,at" | "below,at,right,above" | "below,at,above,right" | "below,right,at,above" | "below,right,above,at" | "below,above,at,right" | "below,above,right,at" | "left,at" | "left,at,right" | "left,at,above" | "left,at,below" | "left,at,above,below" | "left,at,below,above" | "left,at,right,above" | "left,at,right,below" | "left,at,right,above,below" | "left,at,right,below,above" | "left,at,below,right" | "left,at,above,right" | "left,at,above,right,below" | "left,at,above,below,right" | "left,at,below,right,above" | "left,at,below,above,right" | "left,below,at" | "left,above,at" | "left,above,at,below" | "left,above,below,at" | "left,below,at,above" | "left,below,above,at" | "left,right,at" | "left,right,at,above" | "left,right,at,below" | "left,right,at,above,below" | "left,right,at,below,above" | "left,right,below,at" | "left,right,above,at" | "left,right,above,at,below" | "left,right,above,below,at" | "left,right,below,at,above" | "left,right,below,above,at" | "left,below,at,right" | "left,below,right,at" | "left,above,at,right" | "left,above,at,right,below" | "left,above,at,below,right" | "left,above,right,at" | "left,above,right,at,below" | "left,above,right,below,at" | "left,above,below,at,right" | "left,above,below,right,at" | "left,below,at,right,above" | "left,below,at,above,right" | "left,below,right,at,above" | "left,below,right,above,at" | "left,below,above,at,right" | "left,below,above,right,at" | "below,at,left" | "below,left,at" | "above,at,left" | "above,at,left,below" | "above,at,below,left" | "above,left,at" | "above,left,at,below" | "above,left,below,at" | "above,below,at,left" | "above,below,left,at" | "below,at,left,above" | "below,at,above,left" | "below,left,at,above" | "below,left,above,at" | "below,above,at,left" | "below,above,left,at" | "right,at,left" | "right,at,left,above" | "right,at,left,below" | "right,at,left,above,below" | "right,at,left,below,above" | "right,at,below,left" | "right,at,above,left" | "right,at,above,left,below" | "right,at,above,below,left" | "right,at,below,left,above" | "right,at,below,above,left" | "right,left,at" | "right,left,at,above" | "right,left,at,below" | "right,left,at,above,below" | "right,left,at,below,above" | "right,left,below,at" | "right,left,above,at" | "right,left,above,at,below" | "right,left,above,below,at" | "right,left,below,at,above" | "right,left,below,above,at" | "right,below,at,left" | "right,below,left,at" | "right,above,at,left" | "right,above,at,left,below" | "right,above,at,below,left" | "right,above,left,at" | "right,above,left,at,below" | "right,above,left,below,at" | "right,above,below,at,left" | "right,above,below,left,at" | "right,below,at,left,above" | "right,below,at,above,left" | "right,below,left,at,above" | "right,below,left,above,at" | "right,below,above,at,left" | "right,below,above,left,at" | "below,at,left,right" | "below,at,right,left" | "below,left,at,right" | "below,left,right,at" | "below,right,at,left" | "below,right,left,at" | "above,at,left,right" | "above,at,right,left" | "above,at,left,right,below" | "above,at,left,below,right" | "above,at,right,left,below" | "above,at,right,below,left" | "above,at,below,left,right" | "above,at,below,right,left" | "above,left,at,right" | "above,left,at,right,below" | "above,left,at,below,right" | "above,left,right,at" | "above,left,right,at,below" | "above,left,right,below,at" | "above,left,below,at,right" | "above,left,below,right,at" | "above,right,at,left" | "above,right,at,left,below" | "above,right,at,below,left" | "above,right,left,at" | "above,right,left,at,below" | "above,right,left,below,at" | "above,right,below,at,left" | "above,right,below,left,at" | "above,below,at,left,right" | "above,below,at,right,left" | "above,below,left,at,right" | "above,below,left,right,at" | "above,below,right,at,left" | "above,below,right,left,at" | "below,at,left,right,above" | "below,at,left,above,right" | "below,at,right,left,above" | "below,at,right,above,left" | "below,at,above,left,right" | "below,at,above,right,left" | "below,left,at,right,above" | "below,left,at,above,right" | "below,left,right,at,above" | "below,left,right,above,at" | "below,left,above,at,right" | "below,left,above,right,at" | "below,right,at,left,above" | "below,right,at,above,left" | "below,right,left,at,above" | "below,right,left,above,at" | "below,right,above,at,left" | "below,right,above,left,at" | "below,above,at,left,right" | "below,above,at,right,left" | "below,above,left,at,right" | "below,above,left,right,at" | "below,above,right,at,left" | "below,above,right,left,at" | View[];
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
export declare const getOppositeViews: (views: CommaSeparatedStr<View> | View[]) => View[];
/**
 * @ignore
 * @internal
 */
export declare const getViewsBitmask: (viewsStr: View[] | string | undefined) => number;
/**
 * @ignore
 * @internal
 */
export declare const parseScrollOffset: (input: string) => {
    reference: string;
    value: string;
};
/**
 * @ignore
 * @internal
 */
export declare const VIEWS_SPACE: import("../modules/bit-spaces.cjs").BitSpace<View>;
//# sourceMappingURL=views.d.ts.map