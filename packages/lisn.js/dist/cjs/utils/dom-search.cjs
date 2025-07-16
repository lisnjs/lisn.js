"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForReferenceElement = exports.getReferenceElement = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _cssAlter = require("./css-alter.cjs");
var _domEvents = require("./dom-events.cjs");
var _log = require("./log.cjs");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * @module Utils
 *
 * @categoryDescription DOM: Searching for reference elements
 * The functions allow you to find elements that match a given string
 * specification.
 */

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
const getReferenceElement = (spec, thisElement) => {
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
  const relation = ["next", "prev", "this", "first", "last"].find(p => spec.startsWith(`${p}.`) || spec.startsWith(`${p}-`) || spec === p);
  if (!relation) {
    throw MH.usageError(`Invalid search specification '${spec}'`);
  }
  const rest = spec.slice(MH.lengthOf(relation));
  const matchOp = rest.slice(0, 1);
  let refOrCls = rest.slice(1);
  let selector;
  if (matchOp === ".") {
    selector = matchOp + refOrCls;
  } else {
    if (!refOrCls) {
      refOrCls = (0, _cssAlter.getData)(thisElement, PREFIX_REF) || "";
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
      /* istanbul ignore next */{
        (0, _log.logError)(MH.bugError(`Unhandled relation case ${relation}`));
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
exports.getReferenceElement = getReferenceElement;
const waitForReferenceElement = (spec, thisElement, timeout = 200) => (0, _domEvents.waitForElement)(() => getReferenceElement(spec, thisElement), timeout);

// ----------------------------------------
exports.waitForReferenceElement = waitForReferenceElement;
const PREFIX_REF = MH.prefixName("ref");
const DATA_REF = MH.prefixData(PREFIX_REF);
const getAllReferenceElements = selector => MH.docQuerySelectorAll(selector);
const getFirstReferenceElement = selector => MH.docQuerySelector(selector);
const getLastReferenceElement = selector => {
  const allRefs = getAllReferenceElements(selector);
  return allRefs && allRefs[MH.lengthOf(allRefs) - 1] || null;
};
const getThisReferenceElement = (selector, thisElement) => thisElement.closest(selector);
const getNextReferenceElement = (selector, thisElement) => getNextOrPrevReferenceElement(selector, thisElement, false);
const getPrevReferenceElement = (selector, thisElement) => getNextOrPrevReferenceElement(selector, thisElement, true);
const getNextOrPrevReferenceElement = (selector, thisElement, goBackward) => {
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
//# sourceMappingURL=dom-search.cjs.map