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
export const getVisibleContentChildren = el => MH.filter([...MH.childrenOf(el)], e => isVisibleContentTag(MH.tagName(e)));

/**
 * Returns whether the given tag is _not_ `script` or `style`. Comparison is
 * case insensitive.
 *
 * @category DOM: Querying
 */
export const isVisibleContentTag = tagName => !MH.includes(["script", "style"], MH.toLowerCase(tagName));

/**
 * Returns whether the given tag name has by default an inline display.
 * Comparison is case insensitive.
 *
 * @category DOM: Querying
 */
export const isInlineTag = tagName => inlineTags.has(tagName.toLowerCase());

/**
 * Returns whether the given element is as {@link DOMElement}.
 *
 * @category DOM: Querying
 */
export const isDOMElement = target => MH.isHTMLElement(target) || MH.isInstanceOf(target, SVGElement) || typeof MathMLElement !== "undefined" && MH.isInstanceOf(target, MathMLElement);

// --------------------

const inlineTags = MH.newSet(["a", "abbr", "acronym", "b", "bdi", "bdo", "big", "button", "cite", "code", "data", "dfn", "em", "i", "img", "input", "kbd", "label", "mark", "map", "object", "output", "q", "rp", "rt", "ruby", "s", "samp", "script", "select", "small", "span", "strong", "sub", "sup", "textarea", "time", "tt", "u", "var"]);
//# sourceMappingURL=dom-query.js.map