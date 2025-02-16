/**
 * @module Utils
 */
import { DOMElement } from "../globals/types.js";
/**
 * Returns all the child elements of the given element that are not `script` or
 * `style` tags.
 *
 * @category DOM: Querying
 */
export declare const getVisibleContentChildren: (el: Element) => Element[];
/**
 * Returns whether the given tag is _not_ `script` or `style`. Comparison is
 * case insensitive.
 *
 * @category DOM: Querying
 */
export declare const isVisibleContentTag: (tagName: string) => boolean;
/**
 * Returns whether the given tag name has by default an inline display.
 * Comparison is case insensitive.
 *
 * @category DOM: Querying
 */
export declare const isInlineTag: (tagName: string) => boolean;
/**
 * Returns whether the given element is as {@link DOMElement}.
 *
 * @category DOM: Querying
 */
export declare const isDOMElement: (target: unknown) => target is DOMElement;
//# sourceMappingURL=dom-query.d.ts.map