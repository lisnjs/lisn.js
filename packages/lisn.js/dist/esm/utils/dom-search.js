/**
 * @module Utils
 *
 * @categoryDescription DOM: Searching for reference elements
 * The functions allow you to find elements that match a given string
 * specification.
 */

import * as MH from "../globals/minification-helpers.js";
import { getData } from "./css-alter.js";
import { waitForElement } from "./dom-events.js";
import { logError } from "./log.js";

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
 * @param {} thisElement The element to search relative to
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                        If the specification is invalid or if thisElement is
 *                        not given for a specification of "next", "prev" or "this"
 */
export var getReferenceElement = function getReferenceElement(spec, thisElement) {
  if (!spec) {
    return thisElement;
  }
  if (spec[0] === "#") {
    // element ID
    var _referenceElement = MH.getElementById(spec.slice(1));
    if (!_referenceElement) {
      return null;
    }
    return _referenceElement;
  }
  var relation = ["next", "prev", "this", "first", "last"].find(function (p) {
    return spec.startsWith("".concat(p, ".")) || spec.startsWith("".concat(p, "-")) || spec === p;
  });
  if (!relation) {
    throw MH.usageError("Invalid search specification '".concat(spec, "'"));
  }
  var rest = spec.slice(MH.lengthOf(relation));
  var matchOp = rest.slice(0, 1);
  var refOrCls = rest.slice(1);
  var selector;
  if (matchOp === ".") {
    selector = matchOp + refOrCls;
  } else {
    if (!refOrCls) {
      refOrCls = getData(thisElement, PREFIX_REF) || "";
    }
    if (!refOrCls) {
      throw MH.usageError("No reference name in '".concat(spec, "'"));
    }
    selector = "[".concat(DATA_REF, "=\"").concat(refOrCls, "\"]");
  }
  var referenceElement;
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
      /* istanbul ignore next */{
        logError(MH.bugError("Unhandled relation case ".concat(relation)));
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
export var waitForReferenceElement = function waitForReferenceElement(spec, thisElement) {
  var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;
  return waitForElement(function () {
    return getReferenceElement(spec, thisElement);
  }, timeout);
};

// ----------------------------------------

var PREFIX_REF = MH.prefixName("ref");
var DATA_REF = MH.prefixData(PREFIX_REF);
var getAllReferenceElements = function getAllReferenceElements(selector) {
  return MH.docQuerySelectorAll(selector);
};
var getFirstReferenceElement = function getFirstReferenceElement(selector) {
  return MH.docQuerySelector(selector);
};
var getLastReferenceElement = function getLastReferenceElement(selector) {
  var allRefs = getAllReferenceElements(selector);
  return allRefs && allRefs[MH.lengthOf(allRefs) - 1] || null;
};
var getThisReferenceElement = function getThisReferenceElement(selector, thisElement) {
  return thisElement.closest(selector);
};
var getNextReferenceElement = function getNextReferenceElement(selector, thisElement) {
  return getNextOrPrevReferenceElement(selector, thisElement, false);
};
var getPrevReferenceElement = function getPrevReferenceElement(selector, thisElement) {
  return getNextOrPrevReferenceElement(selector, thisElement, true);
};
var getNextOrPrevReferenceElement = function getNextOrPrevReferenceElement(selector, thisElement, goBackward) {
  thisElement = getThisReferenceElement(selector, thisElement) || thisElement;
  if (!MH.getDoc().contains(thisElement)) {
    return null;
  }
  var allRefs = getAllReferenceElements(selector);
  if (!allRefs) {
    return null;
  }
  var numRefs = MH.lengthOf(allRefs);
  var refIndex = goBackward ? numRefs - 1 : -1;
  for (var i = 0; i < numRefs; i++) {
    var currentIsAfter = MH.isNodeBAfterA(thisElement, allRefs[i]);

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
//# sourceMappingURL=dom-search.js.map