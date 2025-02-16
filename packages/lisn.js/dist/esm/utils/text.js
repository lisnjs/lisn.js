/**
 * @module Utils
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
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
export var formatAsString = function formatAsString(value, maxLen) {
  var result = _maybeConvertToString(value, false);
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
 * @param {} separator  The separator to use to delimit each argument.
 * @param {} args       Objects or values to convert to string and join.
 *
 * @category Text
 */
export var joinAsString = function joinAsString(separator) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  return args.map(function (a) {
    return formatAsString(a);
  }).join(separator);
};

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
export var splitOn = function splitOn(input, separator, trim, limit) {
  if (!input.trim()) {
    return [];
  }
  limit = limit !== null && limit !== void 0 ? limit : -1;
  var output = [];
  var addEntry = function addEntry(s) {
    return output.push(trim ? s.trim() : s);
  };
  while (limit--) {
    var matchIndex = -1,
      matchLength = 0;
    if (MH.isLiteralString(separator)) {
      matchIndex = input.indexOf(separator);
      matchLength = MH.lengthOf(separator);
    } else {
      var _match$index;
      var match = separator.exec(input);
      matchIndex = (_match$index = match === null || match === void 0 ? void 0 : match.index) !== null && _match$index !== void 0 ? _match$index : -1;
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
export var kebabToCamelCase = MH.kebabToCamelCase;

/**
 * Converts a camelCasedString to kebab-case.
 * The result is undefined if the input string is not formatted in
 * camelCase.
 *
 * @category Text
 */
export var camelToKebabCase = MH.camelToKebabCase;

/**
 * Generates a random string of a fixed length.
 *
 * **IMPORTANT:** This is _not_ suitable for cryptographic applications.
 *
 * @param {} [nChars = 8]  The length of the returned stirng.
 *
 * @category Text
 */
export var randId = function randId() {
  var nChars = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;
  var segment = function segment() {
    return MH.floor(100000 + MC.MATH.random() * 900000).toString(36);
  };
  var s = "";
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
 * `absoluteSize`: left/right margins relative to the width, and top/bottom
 * margins relative to the height.
 *
 * Note that for the margin property, percentages are always relative to the
 * WIDTH of the parent, so you should pass the parent width as both the width
 * and the height keys in `absoluteSize`. But for IntersectionObserver's
 * `rootMargin`, top/bottom margin is relative to the height of the root, so
 * pass the actual root size.
 *
 * @return {} [topMarginInPx, rightMarginInPx, bottomMarginInPx, leftMarginInPx]
 *
 * @category Text
 */
export var toMargins = function toMargins(value, absoluteSize) {
  var _parts$, _parts$2, _ref, _parts$3;
  var toPxValue = function toPxValue(strValue, index) {
    var margin = MH.parseFloat(strValue || "") || 0;
    if (strValue === margin + "%") {
      margin *= index % 2 ? absoluteSize[MC.S_HEIGHT] : absoluteSize[MC.S_WIDTH];
    }
    return margin;
  };
  var parts = splitOn(value, " ", true);
  var margins = [
  // top
  toPxValue(parts[0], 0),
  // right
  toPxValue((_parts$ = parts[1]) !== null && _parts$ !== void 0 ? _parts$ : parts[0], 1),
  // bottom
  toPxValue((_parts$2 = parts[2]) !== null && _parts$2 !== void 0 ? _parts$2 : parts[0], 2),
  // left
  toPxValue((_ref = (_parts$3 = parts[3]) !== null && _parts$3 !== void 0 ? _parts$3 : parts[1]) !== null && _ref !== void 0 ? _ref : parts[0], 3)];
  return margins;
};

/**
 * @ignore
 * @internal
 */
export var objToStrKey = function objToStrKey(obj) {
  return MH.stringify(_flattenForSorting(obj));
};

// --------------------

var _flattenForSorting = function flattenForSorting(obj) {
  var array = MH.isArray(obj) ? obj : MH.keysOf(obj).sort().map(function (k) {
    return obj[k];
  });
  return array.map(function (value) {
    if (MH.isArray(value) || MH.isNonPrimitive(value) && MH.constructorOf(value) === MC.OBJECT) {
      return _flattenForSorting(value);
    }
    return value;
  });
};
var stringifyReplacer = function stringifyReplacer(key, value) {
  return key ? _maybeConvertToString(value, true) : value;
};
var _maybeConvertToString = function maybeConvertToString(value, nested) {
  var result = "";
  if (MH.isElement(value)) {
    var classStr = MH.classList(value).toString().trim();
    result = value.id ? "#" + value.id : "<".concat(MH.tagName(value)).concat(classStr ? ' class="' + classStr + '"' : "", ">");

    //
  } else if (MH.isInstanceOf(value, Error)) {
    /* istanbul ignore else */
    if ("stack" in value && MH.isString(value.stack)) {
      result = value.stack;
    } else {
      result = "Error: ".concat(value.message);
    }

    //
  } else if (MH.isArray(value)) {
    result = "[" + value.map(function (v) {
      return MH.isString(v) ? MH.stringify(v) : _maybeConvertToString(v, false);
    }).join(",") + "]";

    //
  } else if (MH.isIterableObject(value)) {
    result = MH.typeOrClassOf(value) + "(" + _maybeConvertToString(MH.arrayFrom(value), false) + ")";

    //
  } else if (MH.isNonPrimitive(value)) {
    result = nested ? value : MH.stringify(value, stringifyReplacer);

    //
  } else {
    // primitive
    result = nested ? value : MC.STRING(value);
  }
  return result;
};
//# sourceMappingURL=text.js.map