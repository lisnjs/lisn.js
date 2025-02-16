/**
 * @module Utils
 *
 * @categoryDescription DOM: Altering
 * These functions alter the DOM tree, but could lead to forced layout if not
 * scheduled using {@link waitForMutateTime}.
 *
 * @categoryDescription DOM: Altering (optimized)
 * These functions alter the DOM tree in an optimized way using
 * {@link waitForMutateTime} and so are asynchronous.
 */
/**
 * Wraps the element in the given wrapper, or a newly created element if not given.
 *
 * @param {} [options.wrapper]
 *              If it's an element, it is used as the wrapper. If it's a string
 *              tag name, then a new element with this tag is created as the
 *              wrapper. If not given, then `div` is used if the element to be
 *              wrapped has an block-display tag, or otherwise `span` (if the
 *              element to be wrapped has an inline tag name).
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              replacing the element (so as to not trigger relevant callbacks).
 * @returns {} The wrapper element that was either passed in options or created.
 *
 * @category DOM: Altering
 */
export declare const wrapElementNow: (element: Element, options?: {
    wrapper?: HTMLElement | keyof HTMLElementTagNameMap;
    ignoreMove?: boolean;
}) => HTMLElement;
/**
 * Like {@link wrapElementNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export declare const wrapElement: (element: Element, options?: {
    wrapper?: HTMLElement | keyof HTMLElementTagNameMap;
    ignoreMove?: boolean;
}) => Promise<HTMLElement>;
/**
 * Wraps the element's children in the given wrapper, or a newly created element
 * if not given.
 *
 * @see {@link wrapElementNow}.
 *
 * @category DOM: Altering
 */
export declare const wrapChildrenNow: (element: Element, options?: {
    wrapper?: HTMLElement | keyof HTMLElementTagNameMap;
    ignoreMove?: boolean;
}) => HTMLElement;
/**
 * Like {@link wrapChildrenNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export declare const wrapChildren: (element: Element, options?: {
    wrapper?: HTMLElement | keyof HTMLElementTagNameMap;
    ignoreMove?: boolean;
}) => Promise<HTMLElement>;
/**
 * Replace an element with another one.
 *
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              moving the element (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering
 */
export declare const replaceElementNow: (element: Element, newElement: Element, options?: {
    ignoreMove?: boolean;
}) => void;
/**
 * Like {@link replaceElementNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export declare const replaceElement: (element: Element, newElement: Element, options?: {
    ignoreMove?: boolean;
}) => Promise<void>;
/**
 * Replace an element with another one.
 *
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              moving the element (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering
 */
export declare const swapElementsNow: (elementA: Element, elementB: Element, options?: {
    ignoreMove?: boolean;
}) => void;
/**
 * Like {@link swapElementsNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export declare const swapElements: (elementA: Element, elementB: Element, options?: {
    ignoreMove?: boolean;
}) => Promise<void>;
/**
 * Move an element's children to a new element
 *
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              moving the children (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering
 */
export declare const moveChildrenNow: (oldParent: Element, newParent: Element, options?: {
    ignoreMove?: boolean;
}) => void;
/**
 * Like {@link moveChildrenNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export declare const moveChildren: (oldParent: Element, newParent: Element, options?: {
    ignoreMove?: boolean;
}) => Promise<void>;
/**
 * Moves an element to a new position.
 *
 * @param {} [options.to]         The new parent or sibling (depending on
 *                                `options.position`). If not given, the
 *                                element is removed from the DOM.
 * @param {} [options.position]   - append (default): append to `options.to`
 *                                - prepend: prepend to `options.to`
 *                                - before: insert before `options.to`
 *                                - after: insert after `options.to`
 * @param {} [options.ignoreMove] If true, the DOM watcher instances will
 *                                ignore the operation of moving the element
 *                                (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering
 */
export declare const moveElementNow: (element: Element, options?: {
    to?: Element;
    position?: "append" | "prepend" | "before" | "after";
    ignoreMove?: boolean;
}) => void;
/**
 * Like {@link moveElementNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export declare const moveElement: (element: Element, options?: {
    to?: Element;
    position?: "append" | "prepend" | "before" | "after";
    ignoreMove?: boolean;
}) => Promise<void>;
/**
 * It will {@link hideElement} and then remove it from the DOM.
 *
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              replacing the element (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering (optimized)
 */
export declare const hideAndRemoveElement: (element: Element, delay?: number, options?: {
    ignoreMove?: boolean;
}) => Promise<void>;
/**
 * @ignore
 * @internal
 */
export declare const getOrAssignID: (element: Element, prefix?: string) => string;
/**
 * @ignore
 * @internal
 */
export declare const wrapScrollingContent: (element: Element) => Promise<HTMLElement>;
/**
 * @ignore
 * @internal
 */
export declare const cloneElement: <E extends Element>(element: E) => E;
/**
 * Creates a dummy hidden clone that's got animation and transitions disabled
 * and absolute position, wrapped in a wrapper (of size 0) and inserts it just
 * before the `insertBefore` element (or if not given, the original element),
 * so that the hidden clone overlaps the actual element's regular
 * (pre-transformed) position.
 *
 * It clears the ID of the clone.
 *
 * Returns the clone.
 *
 * @ignore
 * @internal
 */
export declare const insertGhostCloneNow: <E extends Element>(element: E, insertBefore?: Element | null) => {
    _wrapper: HTMLElement;
    _clone: E;
};
/**
 * @ignore
 * @internal
 *
 * Exposed via DOMWatcher
 */
export declare const insertGhostClone: <E extends Element>(element: E, insertBefore?: Element | null) => Promise<{
    _wrapper: HTMLElement;
    _clone: E;
}>;
/**
 * @ignore
 * @internal
 *
 * Exposed via DOMWatcher
 */
export declare const ignoreMove: (target: Element, options: {
    from?: Element | null;
    to?: Element | null;
}) => Map<Element, {
    from: Element | null;
    to: Element | null;
}>;
/**
 * @ignore
 * @internal
 */
export declare const getIgnoreMove: (target: Element) => {
    from: Element | null;
    to: Element | null;
} | null;
/**
 * @ignore
 * @internal
 */
export declare const clearIgnoreMove: (target: Element) => void;
/**
 * @ignore
 * @internal
 */
export declare const insertArrow: (target: Element, direction: "up" | "down" | "left" | "right", position?: "prepend" | "append" | "before" | "after", tag?: string) => HTMLElement;
//# sourceMappingURL=dom-alter.d.ts.map