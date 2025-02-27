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

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import {
  hideElement,
  hasClass,
  addClassesNow,
  setDataNow,
  setBooleanData,
} from "@lisn/utils/css-alter";
import { waitForMutateTime } from "@lisn/utils/dom-optimize";
import { isInlineTag } from "@lisn/utils/dom-query";
import { randId } from "@lisn/utils/text";

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
export const wrapElementNow = (
  element: Element,
  options?: {
    wrapper?: HTMLElement | keyof HTMLElementTagNameMap;
    ignoreMove?: boolean;
  },
) => {
  const wrapper = createWrapperFor(element, options?.wrapper);

  if (options?.ignoreMove === true) {
    ignoreMove(element, {
      from: MH.parentOf(element),
      to: wrapper,
    });

    ignoreMove(wrapper, {
      to: MH.parentOf(element),
    });
  }

  element.replaceWith(wrapper);
  wrapper.append(element);

  return wrapper;
};

/**
 * Like {@link wrapElementNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export const wrapElement = async (
  element: Element,
  options?: {
    wrapper?: HTMLElement | keyof HTMLElementTagNameMap;
    ignoreMove?: boolean;
  },
) => waitForMutateTime().then(() => wrapElementNow(element, options));

/**
 * Wraps the element's children in the given wrapper, or a newly created element
 * if not given.
 *
 * @see {@link wrapElementNow}.
 *
 * @category DOM: Altering
 */
export const wrapChildrenNow = (
  element: Element,
  options?: {
    wrapper?: HTMLElement | keyof HTMLElementTagNameMap;
    ignoreMove?: boolean;
  },
) => {
  const wrapper = createWrapperFor(element, options?.wrapper);

  moveChildrenNow(element, wrapper, { ignoreMove: true });
  moveElementNow(wrapper, {
    to: element,
    ignoreMove: true,
  });

  return wrapper;
};

/**
 * Like {@link wrapChildrenNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export const wrapChildren = async (
  element: Element,
  options?: {
    wrapper?: HTMLElement | keyof HTMLElementTagNameMap;
    ignoreMove?: boolean;
  },
) => waitForMutateTime().then(() => wrapChildrenNow(element, options));

/**
 * Replace an element with another one.
 *
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              moving the element (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering
 */
export const replaceElementNow = (
  element: Element,
  newElement: Element,
  options?: {
    ignoreMove?: boolean;
  },
) => {
  if (options?.ignoreMove === true) {
    ignoreMove(
      // remove element
      element,
      { from: MH.parentOf(element) },
    );

    ignoreMove(
      // move newElement to element's current parent
      newElement,
      { from: MH.parentOf(newElement), to: MH.parentOf(element) },
    );
  }

  element.replaceWith(newElement);
};

/**
 * Like {@link replaceElementNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export const replaceElement = async (
  element: Element,
  newElement: Element,
  options?: {
    ignoreMove?: boolean;
  },
) =>
  waitForMutateTime().then(() =>
    replaceElementNow(element, newElement, options),
  );

/**
 * Replace an element with another one.
 *
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              moving the element (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering
 */
export const swapElementsNow = (
  elementA: Element,
  elementB: Element,
  options?: {
    ignoreMove?: boolean;
  },
) => {
  const temp = MH.createElement("div");
  replaceElementNow(elementA, temp, options);
  replaceElementNow(elementB, elementA, options);
  replaceElementNow(temp, elementB, options);
};

/**
 * Like {@link swapElementsNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export const swapElements = async (
  elementA: Element,
  elementB: Element,
  options?: {
    ignoreMove?: boolean;
  },
) =>
  waitForMutateTime().then(() => swapElementsNow(elementA, elementB, options));

/**
 * Move an element's children to a new element
 *
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              moving the children (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering
 */
export const moveChildrenNow = (
  oldParent: Element,
  newParent: Element,
  options?: {
    ignoreMove?: boolean;
  },
) => {
  if (options?.ignoreMove === true) {
    for (const child of MH.childrenOf(oldParent)) {
      ignoreMove(child, {
        from: oldParent,
        to: newParent,
      });
    }
  }

  newParent.append(...MH.childrenOf(oldParent));
};

/**
 * Like {@link moveChildrenNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export const moveChildren = async (
  oldParent: Element,
  newParent: Element,
  options?: {
    ignoreMove?: boolean;
  },
) =>
  waitForMutateTime().then(() =>
    moveChildrenNow(oldParent, newParent, options),
  );

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
export const moveElementNow = (
  element: Element,
  options?: {
    to?: Element;
    position?: "append" | "prepend" | "before" | "after";
    ignoreMove?: boolean;
  },
) => {
  let parentEl = options?.to || null;
  const position = options?.position || "append";
  if (position === "before" || position === "after") {
    parentEl = MH.parentOf(options?.to);
  }

  if (options?.ignoreMove === true) {
    ignoreMove(element, {
      from: MH.parentOf(element),
      to: parentEl,
    });
  }

  if (options?.to) {
    options.to[position](element);
  } else {
    MH.remove(element);
  }
};

/**
 * Like {@link moveElementNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export const moveElement = async (
  element: Element,
  options?: {
    to?: Element;
    position?: "append" | "prepend" | "before" | "after";
    ignoreMove?: boolean;
  },
) => waitForMutateTime().then(() => moveElementNow(element, options));

/**
 * It will {@link hideElement} and then remove it from the DOM.
 *
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              replacing the element (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering (optimized)
 */
export const hideAndRemoveElement = async (
  element: Element,
  delay = 0,
  options?: {
    ignoreMove?: boolean;
  },
) => {
  await hideElement(element, delay);
  moveElementNow(element, options);
};

/**
 * @ignore
 * @internal
 */
export const getOrAssignID = (element: Element, prefix = "") => {
  let domID = element.id;
  if (!domID) {
    domID = `${prefix}-${randId()}`;
    element.id = domID;
  }

  return domID;
};

/**
 * @ignore
 * @internal
 */
export const wrapScrollingContent = async (element: Element) => {
  await waitForMutateTime();

  let wrapper: HTMLElement;
  const firstChild = MH.childrenOf(element)[0];
  if (
    MH.lengthOf(MH.childrenOf(element)) === 1 &&
    MH.isHTMLElement(firstChild) &&
    hasClass(firstChild, PREFIX_CONTENT_WRAPPER)
  ) {
    // Another concurrent call has just wrapped it
    wrapper = firstChild;
  } else {
    wrapper = wrapChildrenNow(element, { ignoreMove: true });
    addClassesNow(wrapper, PREFIX_CONTENT_WRAPPER);
  }

  return wrapper;
};

/**
 * @ignore
 * @internal
 */
export const cloneElement = <E extends Element>(element: E) => {
  const clone = element.cloneNode(true) as E;
  setBooleanData(clone, MH.prefixName("clone"));
  return clone;
};

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
export const insertGhostCloneNow = <E extends Element>(
  element: E,
  insertBefore: Element | null = null,
) => {
  const clone = cloneElement(element);
  clone.id = "";

  addClassesNow(
    clone,
    MC.PREFIX_GHOST,
    MC.PREFIX_TRANSITION_DISABLE,
    MC.PREFIX_ANIMATE_DISABLE,
  );

  const wrapper = wrapElementNow(clone);
  addClassesNow(wrapper, MC.PREFIX_WRAPPER);

  moveElementNow(wrapper, {
    to: insertBefore || element,
    position: "before",
    ignoreMove: true,
  });

  return { _wrapper: wrapper, _clone: clone };
};

/**
 * @ignore
 * @internal
 *
 * Exposed via DOMWatcher
 */
export const insertGhostClone = <E extends Element>(
  element: E,
  insertBefore: Element | null = null,
) => waitForMutateTime().then(() => insertGhostCloneNow(element, insertBefore));

/**
 * @ignore
 * @internal
 *
 * Exposed via DOMWatcher
 */
export const ignoreMove = (
  target: Element,
  options: { from?: Element | null; to?: Element | null },
) =>
  recordsToSkipOnce.set(target, {
    from: options.from || null,
    to: options.to || null,
  });

/**
 * @ignore
 * @internal
 */
export const getIgnoreMove = (
  target: Element,
): { from: Element | null; to: Element | null } | null =>
  recordsToSkipOnce.get(target) || null;

/**
 * @ignore
 * @internal
 */
export const clearIgnoreMove = (target: Element) => {
  // We should not clear the entry the first time the operation is observed
  // (when we return true here), because there may be multiple DOMWatcher
  // instances that will observe it and need to query it. Instead do it shortly.
  MH.setTimer(() => {
    MH.deleteKey(recordsToSkipOnce, target);
  }, 100);
};

/**
 * @ignore
 * @internal
 */
export const insertArrow = (
  target: Element,
  direction: "up" | "down" | "left" | "right",
  position: "prepend" | "append" | "before" | "after" = "append",
  tag = "span",
) => {
  const arrow = MH.createElement(tag);
  addClassesNow(arrow, MH.prefixName(MC.S_ARROW));
  setDataNow(arrow, MH.prefixName("direction"), direction);
  moveElement(arrow, { to: target, position, ignoreMove: true });
  return arrow;
};

// ----------------------------------------

const PREFIX_CONTENT_WRAPPER = MH.prefixName("content-wrapper");

const recordsToSkipOnce = MH.newMap<
  /* target being moved */ Element,
  { from: Element | null; to: Element | null }
>();

const createWrapperFor = (
  element: Element,
  wrapper: HTMLElement | keyof HTMLElementTagNameMap | undefined,
) => {
  if (MH.isElement(wrapper)) {
    return wrapper;
  }

  let tag = wrapper;
  if (!tag) {
    if (isInlineTag(MH.tagName(element))) {
      tag = "span";
    } else {
      tag = "div";
    }
  }

  return MH.createElement(tag);
};
