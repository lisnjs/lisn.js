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
export declare const getReferenceElement: (spec: string, thisElement: Element) => Element | null;
/**
 * Like {@link getReferenceElement} excepts if no element matches the
 * specification if will wait for at most the given time for such an element.
 *
 * @category DOM: Searching for reference elements
 */
export declare const waitForReferenceElement: (spec: string, thisElement: Element, timeout?: number) => Promise<Element>;
//# sourceMappingURL=dom-search.d.ts.map