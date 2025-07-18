/**
 * @module Utils
 *
 * @categoryDescription DOM: Searching for reference elements
 * The functions allow you to find elements that match a given string
 * specification.
 */

import * as MH from "@lisn/globals/minification-helpers";

import { getData } from "@lisn/utils/css-alter";
import { waitForElement } from "@lisn/utils/dom-events";
import { logError } from "@lisn/utils/log";

/**
 * Get the element that matches the given reference specification.
 *
 * The specification is of the form:
 *
 * ```
 * <FullSpec> ::=
 *     <Relation> "." <ClassName>  |
 *     <Relation> ["-" <ReferenceName>] |
 *     #<DOM_ID>
 *
 * <Relation> :==
 *     "next"  |
 *     "prev"  |
 *     "this"  |
 *     "first" |
 *     "last"
 * ```
 *
 * - `<DOM_ID>` is the unique ID of the element
 * - `<ClassName>` is a CSS class on the element
 * - `<ReferenceName>` is the value of the `data-lisn-ref` attribute on the
 *   element you are targeting. If not given, defaults to the value of the
 *   `data-lisn-ref` attribute on `thisElement`.
 *
 * There now follows an explanation of how "next", "prev", "this", "first" and
 * "last" search the DOM:
 * - "next": the tree is search in document order (depth first, then breadth),
 *   so the returned element could be a descendant of `thisElement`
 * - "prev": the tree is search in document order (depth first, then breadth),
 *   but excluding ancestors of `thisElement`, so the returned element is
 *   guaranteed to _not_ be an ancestor or descendant of `thisElement`.
 * - "this": if the given element itself matches the specification, it is
 *   returned, otherwise the closest ancestor of the given element that matches
 *   the specification
 * - "first": the first element matching; the tree is search in document order
 *   (depth first, then breadth).
 * - "last": the last element matching; the tree is search in document order
 *   (depth first, then breadth).
 *
 * @category DOM: Searching for reference elements
 *
 * @param thisElement The element to search relative to
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                        If the specification is invalid or if thisElement is
 *                        not given for a specification of "next", "prev" or "this"
 */
export const getReferenceElement = (
  spec: string,
  thisElement: Element,
): Element | null => {
  if (!spec) {
    return thisElement;
  }

  if (spec[0] === "#") {
    // element ID
    const referenceElement = MH.getElementById(spec.slice(1));
    if (!referenceElement) {
      return null;
    }
    return referenceElement;
  }

  const relation = ["next", "prev", "this", "first", "last"].find(
    (p) => spec.startsWith(`${p}.`) || spec.startsWith(`${p}-`) || spec === p,
  );

  if (!relation) {
    throw MH.usageError(`Invalid search specification '${spec}'`);
  }

  const rest = spec.slice(MH.lengthOf(relation));
  const matchOp = rest.slice(0, 1);
  let refOrCls = rest.slice(1);

  let selector: string;
  if (matchOp === ".") {
    selector = matchOp + refOrCls;
  } else {
    if (!refOrCls) {
      refOrCls = getData(thisElement, PREFIX_REF) || "";
    }

    if (!refOrCls) {
      throw MH.usageError(`No reference name in '${spec}'`);
    }

    selector = `[${DATA_REF}="${refOrCls}"]`;
  }

  let referenceElement;
  if (relation === "first") {
    referenceElement = getFirstReferenceElement(selector);
  } else if (relation === "last") {
    referenceElement = getLastReferenceElement(selector);
  } else {
    if (relation === "this") {
      referenceElement = getThisReferenceElement(selector, thisElement);
    } else if (relation === "next") {
      referenceElement = getNextReferenceElement(selector, thisElement);
    } else if (relation === "prev") {
      referenceElement = getPrevReferenceElement(selector, thisElement);
    } else {
      /* istanbul ignore next */ {
        logError(MH.bugError(`Unhandled relation case ${relation}`));
        return null;
      }
    }
  }

  if (!referenceElement) {
    return null;
  }

  return referenceElement;
};

/**
 * Like {@link getReferenceElement} excepts if no element matches the
 * specification if will wait for at most the given time for such an element.
 *
 * @category DOM: Searching for reference elements
 */
export const waitForReferenceElement = (
  spec: string,
  thisElement: Element,
  timeout = 200,
) => waitForElement(() => getReferenceElement(spec, thisElement), timeout);

// ----------------------------------------

const PREFIX_REF = MH.prefixName("ref");
const DATA_REF = MH.prefixData(PREFIX_REF);

const getAllReferenceElements = (
  selector: string,
): NodeListOf<Element> | null => MH.docQuerySelectorAll(selector);

const getFirstReferenceElement = (selector: string): Element | null =>
  MH.docQuerySelector(selector);

const getLastReferenceElement = (selector: string): Element | null => {
  const allRefs = getAllReferenceElements(selector);
  return (allRefs && allRefs[MH.lengthOf(allRefs) - 1]) || null;
};

const getThisReferenceElement = (
  selector: string,
  thisElement: Element,
): Element | null => thisElement.closest(selector);

const getNextReferenceElement = (selector: string, thisElement: Element) =>
  getNextOrPrevReferenceElement(selector, thisElement, false);

const getPrevReferenceElement = (selector: string, thisElement: Element) =>
  getNextOrPrevReferenceElement(selector, thisElement, true);

const getNextOrPrevReferenceElement = (
  selector: string,
  thisElement: Element,
  goBackward: boolean,
): Element | null => {
  thisElement = getThisReferenceElement(selector, thisElement) || thisElement;

  if (!MH.getDoc().contains(thisElement)) {
    return null;
  }

  const allRefs = getAllReferenceElements(selector);
  if (!allRefs) {
    return null;
  }

  const numRefs = MH.lengthOf(allRefs);
  let refIndex = goBackward ? numRefs - 1 : -1;
  for (let i = 0; i < numRefs; i++) {
    const currentIsAfter = MH.isNodeBAfterA(thisElement, allRefs[i]);

    // As soon as we find either the starting element or the first element
    // that follows it, stop iteration.
    // - If we're looking for the previous reference, then take the previous
    //   element in the iteration.
    // - Otherwise, if the current element in the iteration is the same as the
    //   starting one, then take either the next element in the iteration.
    //   - Otherwise, (if the current element follows the starting one, as
    //     would happen if the starting element was not in the list of matched
    //     elements, take the current element in the iteration.
    if (allRefs[i] === thisElement || currentIsAfter) {
      refIndex = i + (goBackward ? -1 : currentIsAfter ? 0 : 1);
      break;
    }
  }

  return allRefs[refIndex] || null;
};
