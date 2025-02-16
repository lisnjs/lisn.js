"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isVisibleContentTag = exports.isInlineTag = exports.isDOMElement = exports.getVisibleContentChildren = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * @module Utils
 */

/**
 * Returns all the child elements of the given element that are not `script` or
 * `style` tags.
 *
 * @category DOM: Querying
 */
const getVisibleContentChildren = el => MH.filter([...MH.childrenOf(el)], e => isVisibleContentTag(MH.tagName(e)));

/**
 * Returns whether the given tag is _not_ `script` or `style`. Comparison is
 * case insensitive.
 *
 * @category DOM: Querying
 */
exports.getVisibleContentChildren = getVisibleContentChildren;
const isVisibleContentTag = tagName => !MH.includes(["script", "style"], MH.toLowerCase(tagName));

/**
 * Returns whether the given tag name has by default an inline display.
 * Comparison is case insensitive.
 *
 * @category DOM: Querying
 */
exports.isVisibleContentTag = isVisibleContentTag;
const isInlineTag = tagName => inlineTags.has(tagName.toLowerCase());

/**
 * Returns whether the given element is as {@link DOMElement}.
 *
 * @category DOM: Querying
 */
exports.isInlineTag = isInlineTag;
const isDOMElement = target => MH.isHTMLElement(target) || MH.isInstanceOf(target, SVGElement) || typeof MathMLElement !== "undefined" && MH.isInstanceOf(target, MathMLElement);

// --------------------
exports.isDOMElement = isDOMElement;
const inlineTags = MH.newSet(["a", "abbr", "acronym", "b", "bdi", "bdo", "big", "button", "cite", "code", "data", "dfn", "em", "i", "img", "input", "kbd", "label", "mark", "map", "object", "output", "q", "rp", "rt", "ruby", "s", "samp", "script", "select", "small", "span", "strong", "sub", "sup", "textarea", "time", "tt", "u", "var"]);
//# sourceMappingURL=dom-query.cjs.map