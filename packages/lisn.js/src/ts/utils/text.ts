/**
 * @module Utils
 */

import * as _ from "@lisn/_internal";

import { usageError } from "@lisn/globals/errors";

import { Anchor, Size, StrRecord } from "@lisn/globals/types";

/**
 * @category Text
 */
export type TextFormatOptions = {
  /**
   * The maximum length of the returned string. If > 0, if the length of the
   * final string is longer than maxLen, it is truncated to `maxLen - 3` and
   * added a suffix of "...". Note that if `maxLen` is > 0 but <= 3, the result
   * is always "..."
   *
   * If <= 0, the string is not truncated.
   *
   * @defaultValue 0
   */
  maxLength?: number;

  /**
   * Maximum depth of recursion. If <= 0 there is no maximum depth.
   *
   * There's a hard-coded maximum of 100, which cannot be exceeded.
   *
   * @defaultValue 0
   */
  depth?: number;

  /**
   * This only applies when formatting objects and iterables and {@link compact}
   * is false. Otherwise it is ignored.
   *
   * If, when all entries in an object/array are joined with a comma, the length
   * of the resulting inner string (not including indentation or property name)
   * is less than this, then the are left on one line (separated with comma and
   * space). Otherwise, each entry will be on a new line and indented.
   *
   * If <= 0, all entries are on a new line and indented.
   *
   * @defaultValue 0
   */
  lineLength?: number;

  /**
   * If true, it will omit spacing and indentation.
   *
   * @defaultValue false.
   */
  compact?: boolean;

  /**
   * Custom callback which can modify how objects and iterables are formatted.
   * It is called for each object (non-primitive value). If it returns a string,
   * the result is used as is. Otherwise, the input is formatted as per the
   * default formatter.
   *
   * @defaultValue undefined
   */
  formatter?: (value: unknown) => unknown;
};

/**
 * Formats an object as a string. It supports more meaningful formatting as
 * string for certain types rather than using the default string
 * representation.
 *
 * **NOTE:** This is not intended for serialization of data that needs to be
 * de-serialized. Only for debugging output.
 *
 * @param value     The value to format as string.
 * @param options   See {@link TextFormatOptions}. For backwards compatibility,
 *                  if options is a plain number, it is treated as
 *                  `options.maxLength`.
 *
 * @since Support for `compact`, `depth` and `formatter` options was added in
 * v1.3.0. Previously the second argument was a number specifying the maximum
 * length. This signature is still supported.
 *
 * @category Text
 */
export function formatAsString(value: unknown, maxLen?: number): string;
export function formatAsString(
  value: unknown,
  options?: TextFormatOptions,
): string;
export function formatAsString(
  value: unknown,
  options?: number | TextFormatOptions,
): string {
  const {
    maxLength,
    depth = 0,
    lineLength = 0,
    compact = false,
    formatter,
  } = _.isNumber(options) ? { maxLength: options } : (options ?? {});

  const result = convertToString(value, {
    _depth: depth,
    _lineLength: lineLength,
    _compact: compact,
    _formatter: formatter,
  });

  if (
    !_.isNullish(maxLength) &&
    maxLength > 0 &&
    _.lengthOf(result) > maxLength
  ) {
    return _.slice(result, 0, _.max(0, maxLength - 3)) + "...";
  }

  return result;
}

/**
 * Join an array of values as string using separator. It uses
 * {@link formatAsString} rather than the default string representation as
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join | Array:join} would.
 *
 * @param options   See {@link TextFormatOptions}. It accepts an additional
 *                  option `separator` which specifies the separator to use. For
 *                  backwards compatibility, if options is a plain string, it is
 *                  treated as `options.separator`.
 *                  Note that if you pass `maxLength` in options, it will apply
 *                  to each argument individually, not to the final joined
 *                  string.
 * @param args      Objects or values to convert to string and join.
 *
 * @since Support for passing options to {@link formatAsString} was added in
 * v1.3.0. Previously the first argument was a string specifying the separator.
 * This signature is still supported.
 *
 * @category Text
 */
export function joinAsString(separator: string, ...args: unknown[]): string;
export function joinAsString(
  options: {
    separator: string;
  } & TextFormatOptions,
  ...args: unknown[]
): string;

export function joinAsString(
  options: string | ({ separator: string } & TextFormatOptions),
  ...args: unknown[]
) {
  let separator: string;
  let formatOptions: TextFormatOptions;
  if (_.isString(options)) {
    separator = options;
    formatOptions = {};
  } else {
    separator = options.separator;
    formatOptions = options;
  }

  return args.map((a) => formatAsString(a, formatOptions)).join(separator);
}

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
    if (_.isLiteralString(separator)) {
      matchIndex = input.indexOf(separator);
      matchLength = _.lengthOf(separator);
    } else {
      const match = separator.exec(input);
      matchIndex = match?.index ?? -1;
      matchLength = match ? _.lengthOf(match[0]) : 0;
    }

    if (matchIndex < 0) {
      break;
    }

    addEntry(_.slice(input, 0, matchIndex));
    input = _.slice(input, matchIndex + matchLength);
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
export const kebabToCamelCase = _.kebabToCamelCase;

/**
 * Converts a camelCasedString to kebab-case.
 * The result is undefined if the input string is not formatted in
 * camelCase.
 *
 * @category Text
 */
export const camelToKebabCase = _.camelToKebabCase;

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
  const segment = () => _.floor(100000 + _.random() * 900000).toString(36);

  let s = "";
  while (_.lengthOf(s) < nChars) {
    s += segment();
  }
  return _.slice(s, 0, nChars);
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
  if (_.isNumber(absoluteSize)) {
    width = height = absoluteSize;
  } else {
    ({ width, height } = absoluteSize);
    height ??= width;
  }

  const toPxValue = (strValue: string | undefined, absValue: number) => {
    let margin = _.parseFloat(strValue ?? "") || 0;

    if (strValue === `${margin}%`) {
      margin *= absValue;
    } else if (strValue !== `${margin}px` && strValue !== `${margin}`) {
      throw usageError(
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

  if (_.isNumber(value)) {
    value = [value];
  } else if (_.isString(value)) {
    value = splitOn(value, " ", true);
  }

  if (_.isArray(value)) {
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

  return parts.map((v) => (_.isNumber(v) ? `${v}px` : v)).join(" ");
};

/**
 * @ignore
 * @internal
 */
export const objToStrKey = (obj: StrRecord): string =>
  _.stringify(flattenForSorting(obj));

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
  const array = _.isArray(obj)
    ? obj
    : _.keysOf(obj)
        .sort()
        .map((k) => obj[k]);

  return array.map((value) => {
    if (_.isArray(value) || _.isPlainObject(value)) {
      return flattenForSorting(value);
    }
    return value;
  });
};

const CONVERT_TO_STRING_MAX_DEPTH = 100;
const CONVERT_TO_STRING_MAX_GLOBAL_DEPTH = 1000;
type ConvertToStringContext = {
  _level: number;
  _seen: Map<object, { _result: string }>;
};

const convertToStringContext: ConvertToStringContext = {
  _level: 0,
  _seen: _.createMap(),
};

const convertToString = (
  value: unknown,
  options: {
    _depth: number;
    _lineLength: number;
    _compact: boolean;
    _formatter?: (value: unknown) => unknown;
  },
  level = 0,
  skipToJSON = false,
): string => {
  if (convertToStringContext._level >= CONVERT_TO_STRING_MAX_GLOBAL_DEPTH) {
    throw usageError("Recursion in formatAsString");
  }

  const isFirst = convertToStringContext._level === 0;

  let result = "";
  try {
    convertToStringContext._level++;
    result = _convertToString(value, options, level, skipToJSON);
  } finally {
    convertToStringContext._level--;
    if (isFirst) {
      convertToStringContext._level = 0;
      convertToStringContext._seen.clear();
    }
  }

  return result;
};

const _convertToString = (
  value: unknown,
  options: {
    _depth: number;
    _lineLength: number;
    _compact: boolean;
    _formatter?: (value: unknown) => unknown;
  },
  level = convertToStringContext._level,
  skipToJSON = false,
): string => {
  const seen = convertToStringContext._seen;

  // HELPERS ----------

  const detectCycle = (v: object) => {
    let cycleHit: { _complete: boolean; _entry: { _result: string } };

    let entry = seen.get(v);

    if (_.isUndefined(entry)) {
      // mark as in progress
      entry = { _result: "<recursion>" };
      seen.set(v, entry);
      cycleHit = { _complete: false, _entry: entry };
    } else {
      cycleHit = { _complete: true, _entry: entry };
    }

    return cycleHit;
  };

  // -----

  const indentationAt = (l: number) => newLine + space.repeat(l);

  const asTaggedObject = (
    partsOrString: string | string[],
    noNewLine = false,
  ) => {
    const tmpSep = "!\0";

    const isIterable = _.isIterableObject(value);
    let tag = _.typeOrClassOf(value);
    let outerBrackets: [string, string] = isIterable ? ["(", ")"] : ["<", ">"];
    const innerBrackets: [string, string] = isIterable
      ? ["[", "]"]
      : ["{", "}"];

    if (tag === "Array" || tag === "Object") {
      tag = "";
      outerBrackets = ["", ""];
    }

    let strRep: string;
    if (_.isString(partsOrString)) {
      strRep = partsOrString;
    } else {
      strRep = partsOrString.join(tmpSep);

      let preEntrySpace: string;
      let postEntrySpace: string;

      if (!_.lengthOf(strRep)) {
        preEntrySpace = "";
        postEntrySpace = "";
      } else if (noNewLine || _.lengthOf(strRep) <= _lineLength) {
        preEntrySpace = space;
        postEntrySpace = space;
      } else {
        preEntrySpace = indentationAt(level + 1);
        postEntrySpace = indentationAt(level);
      }

      strRep =
        innerBrackets[0] +
        preEntrySpace +
        strRep.replace(new RegExp(tmpSep, "g"), "," + preEntrySpace) +
        postEntrySpace +
        innerBrackets[1];
    }

    return tag + outerBrackets[0] + strRep + outerBrackets[1];
  };

  // -----

  const nestedToString = (thisValue: unknown) => {
    let string = "";
    if (_.isFunction(thisValue)) {
      string = `FUNCTION<${thisValue.name}>`;
    } else {
      string = convertToString(thisValue, options, level + 1);
    }

    return string;
  };

  // --------------------
  // --------------------

  const _depth =
    options._depth <= 0
      ? CONVERT_TO_STRING_MAX_DEPTH
      : _.min(CONVERT_TO_STRING_MAX_DEPTH, options._depth);

  const { _lineLength, _compact, _formatter } = options;
  const space = _compact ? "" : " ";
  const newLine = _compact ? "" : "\n";

  if (level >= _depth) {
    if (_.isObject(value)) {
      return asTaggedObject(["..."], true);
    } else if (level > _depth) {
      return "...";
    }
  }

  let cycleHit:
    | { _complete: boolean; _entry: { _result: string } }
    | undefined = void 0;

  if (_.isObject(value)) {
    cycleHit = detectCycle(value);
    if (cycleHit?._complete) {
      return cycleHit._entry._result;
    }

    if (_formatter) {
      const newValue = _formatter(value);

      if (_.isObject(newValue) && newValue !== value) {
        cycleHit = detectCycle(newValue);
        if (cycleHit?._complete) {
          return cycleHit._entry._result;
        }
      }

      value = newValue;
    }
  }

  let result = "";

  // toJSON ----------
  if (
    !skipToJSON &&
    _.isObject(value) &&
    "toJSON" in value &&
    _.isFunction(value.toJSON)
  ) {
    result = value.toJSON();
    if (!_.isString(result)) {
      let skipNextToJSON = false;
      if (result === value) {
        seen.delete(value);
        skipNextToJSON = true;
      }

      result = asTaggedObject(
        convertToString(result, options, level, skipNextToJSON),
      );
    }

    // Window ----------
  } else if (value === _.getWindow()) {
    result = "<WINDOW>";
  } else if (_.isInstanceOf(value, Window)) {
    result = "<WINDOW> (other)";

    // Document ----------
  } else if (value === _.getDoc()) {
    result = "<DOCUMENT>";
  } else if (_.isInstanceOf(value, Document)) {
    result = "<DOCUMENT> (other)";
  } else if (_.isInstanceOf(value, DocumentFragment)) {
    result = "<DOCUMENT FRAGMENT>";

    // Element ----------
  } else if (_.isElement(value)) {
    const classStr = _.classList(value).toString().trim();
    const tagName = _.tagName(value);

    result =
      "<" +
      tagName +
      (value.id
        ? ` id="${value.id}"`
        : classStr
          ? ` class="${classStr}"`
          : "") +
      ">";

    // Error ----------
  } else if (_.isOfType(value, "Error")) {
    /* istanbul ignore else */
    if ("stack" in value && _.isString(value.stack)) {
      result = value.stack;
    } else {
      result = `Error: ${value.message}`;
    }

    // Arbitrary object ----------
  } else if (_.isObject(value)) {
    const parts: string[] = [];

    // Iterables ----------
    if (_.isIterableObject(value)) {
      for (const thisValue of value) {
        parts.push(nestedToString(thisValue));
      }

      // Non-iterables ----------
    } else {
      for (const prop in value) {
        const thisValue: unknown = value[prop as keyof typeof value];
        parts.push(prop + ":" + space + nestedToString(thisValue));
      }
    }

    result = asTaggedObject(parts);

    // Primitives ----------
  } else {
    result = _.STRING(value);
  }

  if (_compact) {
    result = result.replace(/\s+/g, " ");
  }

  if (cycleHit) {
    // update the result in the map
    cycleHit._entry._result = result;
  }

  return result;
};
