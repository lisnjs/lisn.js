/**
 * @module Utils
 */

import * as MH from "@lisn/globals/minification-helpers";

/**
 * Returns all the child elements of the given element that are not `script` or
 * `style` tags.
 *
 * @category DOM: Querying
 */
export const getVisibleContentChildren = (element: Element) =>
  MH.filter([...MH.childrenOf(element)], (ch) =>
    isVisibleContentTag(MH.tagName(ch)),
  );

/**
 * Returns whether the given tag is _not_ `script` or `style`. Comparison is
 * case insensitive.
 *
 * @category DOM: Querying
 */
export const isVisibleContentTag = (tagName: string) =>
  !MH.includes(["script", "style"], MH.toLowerCase(tagName));

/**
 * Returns whether the given tag name has by default an inline display.
 * Comparison is case insensitive.
 *
 * @category DOM: Querying
 */
export const isInlineTag = (tagName: string) =>
  inlineTags.has(tagName.toLowerCase());

/**
 * Returns whether the given element is as {@link DOMElement}.
 *
 * @category DOM: Querying
 */
export const isDOMElement = MH.isStyledElement;

// --------------------

const inlineTags = MH.newSet([
  "a",
  "abbr",
  "acronym",
  "b",
  "bdi",
  "bdo",
  "big",
  "button",
  "cite",
  "code",
  "data",
  "dfn",
  "em",
  "i",
  "img",
  "input",
  "kbd",
  "label",
  "mark",
  "map",
  "object",
  "output",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "select",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "textarea",
  "time",
  "tt",
  "u",
  "var",
]);
