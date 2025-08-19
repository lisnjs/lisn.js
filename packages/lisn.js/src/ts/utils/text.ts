/**
 * @module Utils
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { Anchor, Size, StrRecord } from "@lisn/globals/types";

/**
 * Formats an object as a string. It supports more meaningful formatting as
 * string for certain types rather than using the default string
 * representation.
 *
 * **NOTE:** This is not intended for serialization of data that needs to be
 * de-serialized. Only for debugging output.
 *
 * @param value    The value to format as string.
 * @param [maxLen] Maximum length of the returned string. If not given or
 *                 is <= 0, the string is not truncated. Otherwise, if the
 *                 result is longer than maxLen, it is truncated to
 *                 `maxLen - 3` and added a suffix of "...".
 *                 Note that if `maxLen` is > 0 but <= 3, the result is
 *                 always "..."
 *
 * @category Text
 */
export const formatAsString = (value: unknown, maxLen?: number) => {
  const result = maybeConvertToString(value, false);

  if (!MH.isNullish(maxLen) && maxLen > 0 && MH.lengthOf(result) > maxLen) {
    return result.slice(0, MH.max(0, maxLen - 3)) + "...";
  }

  return result;
};

/**
 * Join an array of values as string using separator. It uses
 * {@link formatAsString} rather than the default string representation as
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join | Array:join} would.
 *
 * @param separator The separator to use to delimit each argument.
 * @param args      Objects or values to convert to string and join.
 *
 * @category Text
 */
export const joinAsString = (separator: string, ...args: unknown[]) =>
  args.map((a) => formatAsString(a)).join(separator);

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
 * @param trim  If true, entries will be trimmed for whitespace after splitting.
 *
 * @param limit If not given or < 0, the string will be split on every
 *              occurrence of `separator`. Otherwise, it will be split on
 *              the first `limit` number of occurrences of `separator`.
 *
 * @category Text
 */
export const splitOn = (
  input: string,
  separator: string | RegExp,
  trim?: boolean,
  limit?: number,
) => {
  if (!input.trim()) {
    return [];
  }

  limit ??= -1;

  const output: string[] = [];
  const addEntry = (s: string) => output.push(trim ? s.trim() : s);

  while (limit--) {
    let matchIndex = -1,
      matchLength = 0;
    if (MH.isLiteralString(separator)) {
      matchIndex = input.indexOf(separator);
      matchLength = MH.lengthOf(separator);
    } else {
      const match = separator.exec(input);
      matchIndex = match?.index ?? -1;
      matchLength = match ? MH.lengthOf(match[0]) : 0;
    }

    if (matchIndex < 0) {
      break;
    }

    addEntry(input.slice(0, matchIndex));
    input = input.slice(matchIndex + matchLength);
  }

  addEntry(input);
  return output;
};

/**
 * Converts a kebab-cased-string to camelCase.
 * The result is undefined if the input string is not formatted in
 * kebab-case.
 *
 * @category Text
 */
export const kebabToCamelCase = MH.kebabToCamelCase;

/**
 * Converts a camelCasedString to kebab-case.
 * The result is undefined if the input string is not formatted in
 * camelCase.
 *
 * @category Text
 */
export const camelToKebabCase = MH.camelToKebabCase;

/**
 * Generates a random string of a fixed length.
 *
 * **IMPORTANT:** This is _not_ suitable for cryptographic applications.
 *
 * @param nChars The length of the returned stirng.
 *
 * @category Text
 */
export const randId = (nChars = 8) => {
  const segment = () =>
    MH.floor(100000 + MC.MATH.random() * 900000).toString(36);

  let s = "";
  while (MH.lengthOf(s) < nChars) {
    s += segment();
  }
  return s.slice(0, nChars);
};

/**
 * Returns an array of numeric margins in pixels from the given margin string.
 * The string should contain margins in either pixels or percentage; other
 * units are not supported.
 *
 * Percentage values are converted to pixels relative to the given
 * `absoluteSize`: left/right margins are calculated relative to the width, and
 * top/bottom margins are calculated relative to the height.
 *
 * **IMPORTANT:** For the margin property itself, percentages are always
 * relative to the **width** of the parent, so you should pass the parent width
 * as both the width and the height keys in `absoluteSize`. But for
 * IntersectionObserver's `rootMargin`, top/bottom margin is relative to the
 * height of the root, so pass the actual root size (width and height).
 *
 * @param absoluteSize The size of the parent. If you are calculating margins
 *                     for the CSS margin property, only the width is used. In
 *                     this case you can simply pass the width (a number) as
 *                     this parameter.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If any of the margins is not in the format `<number>`,
 *                `<number>px` or `<number>%`
 *
 * @returns [topMarginInPx, rightMarginInPx, bottomMarginInPx, leftMarginInPx]
 *
 * @since Since v1.3.0 `absoluteSize` can be a plain number. Previously it was
 * required to be a {@link Size}.
 *
 * @category Text
 */
export const toMargins = (value: string, absoluteSize: Size | number) => {
  let width: number, height: number;
  if (MH.isNumber(absoluteSize)) {
    width = height = absoluteSize;
  } else {
    ({ width, height } = absoluteSize);
    height ??= width;
  }

  const toPxValue = (strValue: string | undefined, absValue: number) => {
    let margin = MH.parseFloat(strValue ?? "") || 0;

    if (strValue === `${margin}%`) {
      margin *= absValue;
    } else if (strValue !== `${margin}px` && strValue !== `${margin}`) {
      throw MH.usageError(
        "Converting margin string to pixels: margin values should be in pixel or percentage.",
      );
    }

    return margin;
  };

  const parts = toFourMargins(splitOn(value, " ", true));
  // Even indices (0 and 2) are for top/bottom, so relative to height, otherwise
  // relative to width
  return parts.map((v, i) => toPxValue(v, i % 2 ? width : height)) as [
    number,
    number,
    number,
    number,
  ];
};

/**
 * Like {@link toMargins} except it returns an object containing `top`, `right`,
 * `bottom`, `left` properties with the numeric margins in pixels.
 *
 * @since v1.3.0
 *
 * @category Text
 */
export const toMarginProps = (value: string, absoluteSize: Size) => {
  const margins = toMargins(value, absoluteSize);

  return {
    top: margins[0],
    right: margins[1],
    bottom: margins[2],
    left: margins[3],
  };
};

/**
 * Converts the given margins as a string in the
 * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/margin | expected format}
 *
 * @param value If it's a number, it's used for all four sides.
 *
 *              If it's a string, it should be any valid CSS margin string, i.e.
 *              a space-separated list of one to four margins.
 *
 *              If it's an array it should be in one of these forms:
 *              - [margin]: the margin for all four sides
 *              - [margin, margin]: the margin for
 *                top and bottom | left and right respectively
 *              - [margin, margin, margin]: the margin for
 *                top | left and right | bottom respectively
 *              - [margin, margin, margin, margin]: the margin for
 *                top | right | bottom | left respectively
 *
 *              If it's an object it should contain one or more of
 *              top/right/bottom/left values.
 *
 *              Each value should be a number of a string. If it's a string,
 *              it's preserved as is. If it's a number, it's assumed to be
 *              pixels and converted to a `<number>px` string.
 *
 * @returns `<top> <right> <bottom> <left>`
 *
 * @since v1.3.0
 *
 * @category Text
 */
export const toMarginString = (
  value:
    | number
    | string
    | Array<number | string>
    | { [K in Anchor]?: number | string },
) => {
  let parts: [
    string | number,
    string | number,
    string | number,
    string | number,
  ];

  if (MH.isNumber(value)) {
    value = [value];
  } else if (MH.isString(value)) {
    value = splitOn(value, " ", true);
  }

  if (MH.isArray(value)) {
    parts = toFourMargins(value);
  } else {
    const top = value.top ?? 0;
    parts = [
      // top
      top,
      // right
      value.right ?? top,
      // bottom
      value.bottom ?? top,
      // left
      value.left ?? value.right ?? top,
    ];
  }

  return parts.map((v) => (MH.isNumber(v) ? `${v}px` : v)).join(" ");
};

/**
 * @ignore
 * @internal
 */
export const objToStrKey = (obj: StrRecord): string =>
  MH.stringify(flattenForSorting(obj));

// --------------------

const toFourMargins = <T extends string | number>(parts: T[]): [T, T, T, T] => {
  return [
    // top
    parts[0],
    // right
    parts[1] ?? parts[0],
    // bottom
    parts[2] ?? parts[0],
    // left
    parts[3] ?? parts[1] ?? parts[0],
  ];
};

const flattenForSorting = (obj: StrRecord): unknown[] => {
  const array = MH.isArray(obj)
    ? obj
    : MH.keysOf(obj)
        .sort()
        .map((k) => obj[k]);

  return array.map((value) => {
    if (MH.isArray(value) || MH.isPlainObject(value)) {
      return flattenForSorting(value);
    }
    return value;
  });
};

const stringifyReplacer = (key: string, value: unknown) =>
  key ? maybeConvertToString(value, true) : value;

function maybeConvertToString<V>(value: V, nested: true): string | V;
function maybeConvertToString(value: unknown, nested: false): string;
function maybeConvertToString<V>(value: V, nested: boolean) {
  let result: string | V = "";

  if (MH.isElement(value)) {
    const classStr = MH.classList(value).toString().trim();

    result = value.id
      ? "#" + value.id
      : `<${MH.tagName(value)}${classStr ? ' class="' + classStr + '"' : ""}>`;

    //
  } else if (MH.isOfType(value, "Error")) {
    /* istanbul ignore else */
    if ("stack" in value && MH.isString(value.stack)) {
      result = value.stack;
    } else {
      result = `Error: ${value.message}`;
    }

    //
  } else if (MH.isArray(value)) {
    result =
      "[" +
      value
        .map((v) =>
          MH.isString(v) ? MH.stringify(v) : maybeConvertToString(v, false),
        )
        .join(",") +
      "]";

    //
  } else if (MH.isIterableObject(value)) {
    result =
      MH.typeOrClassOf(value) +
      "(" +
      maybeConvertToString(MH.arrayFrom(value), false) +
      ")";

    //
  } else if (!MH.isPrimitive(value)) {
    result = nested ? value : MH.stringify(value, stringifyReplacer);

    //
  } else {
    // primitive
    result = nested ? value : MC.STRING(value);
  }

  return result;
}
