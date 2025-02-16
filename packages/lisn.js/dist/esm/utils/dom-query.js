function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * @module Utils
 */

import * as MH from "../globals/minification-helpers.js";
/**
 * Returns all the child elements of the given element that are not `script` or
 * `style` tags.
 *
 * @category DOM: Querying
 */
export var getVisibleContentChildren = function getVisibleContentChildren(el) {
  return MH.filter(_toConsumableArray(MH.childrenOf(el)), function (e) {
    return isVisibleContentTag(MH.tagName(e));
  });
};

/**
 * Returns whether the given tag is _not_ `script` or `style`. Comparison is
 * case insensitive.
 *
 * @category DOM: Querying
 */
export var isVisibleContentTag = function isVisibleContentTag(tagName) {
  return !MH.includes(["script", "style"], MH.toLowerCase(tagName));
};

/**
 * Returns whether the given tag name has by default an inline display.
 * Comparison is case insensitive.
 *
 * @category DOM: Querying
 */
export var isInlineTag = function isInlineTag(tagName) {
  return inlineTags.has(tagName.toLowerCase());
};

/**
 * Returns whether the given element is as {@link DOMElement}.
 *
 * @category DOM: Querying
 */
export var isDOMElement = function isDOMElement(target) {
  return MH.isHTMLElement(target) || MH.isInstanceOf(target, SVGElement) || typeof MathMLElement !== "undefined" && MH.isInstanceOf(target, MathMLElement);
};

// --------------------

var inlineTags = MH.newSet(["a", "abbr", "acronym", "b", "bdi", "bdo", "big", "button", "cite", "code", "data", "dfn", "em", "i", "img", "input", "kbd", "label", "mark", "map", "object", "output", "q", "rp", "rt", "ruby", "s", "samp", "script", "select", "small", "span", "strong", "sub", "sup", "textarea", "time", "tt", "u", "var"]);
//# sourceMappingURL=dom-query.js.map