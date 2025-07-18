/**
 * @module Utils
 */
import { Size, StrRecord } from "../globals/types.js";
/**
 * Formats an object as a string. It supports more meaningful formatting as
 * string for certain types rather than using the default string
 * representation.
 *
 * **NOTE:** This is not intended for serialization of data that needs to be
 * de-serialized. Only for debugging output.
 *
 * @param {} value     The value to format as string.
 * @param {} [maxLen]  Maximum length of the returned string. If not given or
 *                     is <= 0, the string is not truncated. Otherwise, if the
 *                     result is longer than maxLen, it is truncated to
 *                     `maxLen - 3` and added a suffix of "...".
 *                     Note that if `maxLen` is > 0 but <= 3, the result is
 *                     always "..."
 *
 * @category Text
 */
export declare const formatAsString: (value: unknown, maxLen?: number) => string;
/**
 * Join an array of values as string using separator. It uses
 * {@link formatAsString} rather than the default string representation as
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join | Array:join} would.
 *
 * @param {} separator  The separator to use to delimit each argument.
 * @param {} args       Objects or values to convert to string and join.
 *
 * @category Text
 */
export declare const joinAsString: (separator: string, ...args: unknown[]) => string;
/**
 * Similar to
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split | String.prototype.split}
 * except that
 * 1. `limit` is interpreted as the maximum number of splits, and the
 *   returned array contains `limit + 1` entries. Also if `limit` is given and
 *   the number of substrings is greater than the limit, all the remaining
 *   substrings are present in the final substring.
 * 2. If input is an empty string (or containing only whitespace), returns an
 *    empty array.
 *
 * @example
 * ```javascript
 * splitOn('foo, bar, baz', RegExp(',\\s*'), 0); // -> ['foo, bar, baz']
 * splitOn('foo, bar, baz', RegExp(',\\s*'), 1); // -> ['foo', 'bar, baz']
 * splitOn('foo, bar, baz', RegExp(',\\s*'), 2); // -> ['foo', 'bar', 'baz']
 * splitOn('foo, bar, baz', RegExp(',\\s*'), 3); // -> ['foo', 'bar', 'baz']
 * ```
 *
 * @param {} trim  If true, entries will be trimmed for whitespace after splitting.
 *
 * @param {} limit If not given or < 0, the string will be split on every
 *                 occurrence of `separator`. Otherwise, it will be split on
 *                 the first `limit` number of occurrences of `separator`.
 *
 * @category Text
 */
export declare const splitOn: (input: string, separator: string | RegExp, trim?: boolean, limit?: number) => string[];
/**
 * Converts a kebab-cased-string to camelCase.
 * The result is undefined if the input string is not formatted in
 * kebab-case.
 *
 * @category Text
 */
export declare const kebabToCamelCase: (str: string) => string;
/**
 * Converts a camelCasedString to kebab-case.
 * The result is undefined if the input string is not formatted in
 * camelCase.
 *
 * @category Text
 */
export declare const camelToKebabCase: (str: string) => string;
/**
 * Generates a random string of a fixed length.
 *
 * **IMPORTANT:** This is _not_ suitable for cryptographic applications.
 *
 * @param {} [nChars = 8]  The length of the returned stirng.
 *
 * @category Text
 */
export declare const randId: (nChars?: number) => string;
/**
 * Returns an array of numeric margins in pixels from the given margin string.
 * The string should contain margins in either pixels or percentage; other
 * units are not supported.
 *
 * Percentage values are converted to pixels relative to the given
 * `absoluteSize`: left/right margins relative to the width, and top/bottom
 * margins relative to the height.
 *
 * Note that for the margin property, percentages are always relative to the
 * WIDTH of the parent, so you should pass the parent width as both the width
 * and the height keys in `absoluteSize`. But for IntersectionObserver's
 * `rootMargin`, top/bottom margin is relative to the height of the root, so
 * pass the actual root size.
 *
 * @returns {} [topMarginInPx, rightMarginInPx, bottomMarginInPx, leftMarginInPx]
 *
 * @category Text
 */
export declare const toMargins: (value: string, absoluteSize: Size) => [number, number, number, number];
/**
 * @ignore
 * @internal
 */
export declare const objToStrKey: (obj: StrRecord) => string;
//# sourceMappingURL=text.d.ts.map