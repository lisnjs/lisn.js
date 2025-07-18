"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isVisibleContentTag = exports.isInlineTag = exports.isDOMElement = exports.getVisibleContentChildren = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * @module Utils
 */

/**
 * Returns all the child elements of the given element that are not `script` or
 * `style` tags.
 *
 * @category DOM: Querying
 */
const getVisibleContentChildren = element => MH.filter([...MH.childrenOf(element)], ch => isVisibleContentTag(MH.tagName(ch)));

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