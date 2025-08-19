/**
 * @module Utils
 */

import * as _ from "@lisn/_internal";

/**
 * Returns all the child elements of the given element that are not `script` or
 * `style` tags.
 *
 * @category DOM: Querying
 */
export const getVisibleContentChildren = (element: Element) =>
  _.filter([..._.childrenOf(element)], (ch) =>
    isVisibleContentTag(_.tagName(ch)),
  );

/**
 * Returns whether the given tag is _not_ `script` or `style`. Comparison is
 * case insensitive.
 *
 * @category DOM: Querying
 */
export const isVisibleContentTag = (tagName: string) =>
  !_.includes(["script", "style"], _.toLowerCase(tagName));

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
export const isDOMElement = _.isStyledElement;

/**
 * @ignore
 * @internal
 *
 * Returns true if `nodeA` follows `nodeB` in document order.
 *
 * @category DOM: Querying
 */
export const isNodeBAfterA = (nodeA: Node, nodeB: Node) =>
  (nodeA.compareDocumentPosition(nodeB) & Node.DOCUMENT_POSITION_FOLLOWING) !==
  0;

// --------------------

const inlineTags = _.createSet([
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
