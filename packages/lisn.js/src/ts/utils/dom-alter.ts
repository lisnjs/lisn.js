/**
 * @module Utils
 *
 * @categoryDescription DOM: Altering
 * These functions alter the DOM tree, but could lead to forced layout if not
 * scheduled using {@link Utils.waitForMutateTime}.
 *
 * @categoryDescription DOM: Altering (optimized)
 * These functions alter the DOM tree in an optimized way using
 * {@link Utils.waitForMutateTime} and so are asynchronous.
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { settings } from "@lisn/globals/settings";

import {
  hideElement,
  hasAnyClass,
  addClassesNow,
  removeClassesNow,
  getData,
  setDataNow,
  setBooleanData,
} from "@lisn/utils/css-alter";
import { asyncMutatorFor } from "@lisn/utils/dom-optimize";
import { isInlineTag } from "@lisn/utils/dom-query";
import { logWarn } from "@lisn/utils/log";
import { randId } from "@lisn/utils/text";

/**
 * Wraps the element in the given wrapper, or a newly created element if not given.
 *
 * @param [options.wrapper]
 *              If it's an element, it is used as the wrapper. If it's a string
 *              tag name, then a new element with this tag is created as the
 *              wrapper. If not given, then `div` is used if the element to be
 *              wrapped has an block-display tag, or otherwise `span` (if the
 *              element to be wrapped has an inline tag name).
 * @param [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              replacing the element (so as to not trigger relevant callbacks).
 * @returns The wrapper element that was either passed in options or created.
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
 * Like {@link wrapElementNow} except it will {@link Utils.waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export const wrapElement = asyncMutatorFor(wrapElementNow);

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
  const { ignoreMove } = options ?? {};

  moveChildrenNow(element, wrapper, { ignoreMove });
  moveElementNow(wrapper, {
    to: element,
    ignoreMove,
  });

  return wrapper;
};

/**
 * Like {@link wrapChildrenNow} except it will {@link Utils.waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export const wrapChildren = asyncMutatorFor(wrapChildrenNow);

/**
 * Replace an element with another one.
 *
 * @param [options.ignoreMove]
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
 * Like {@link replaceElementNow} except it will {@link Utils.waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export const replaceElement = asyncMutatorFor(replaceElementNow);

/**
 * Replace an element with another one.
 *
 * @param [options.ignoreMove]
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
 * Like {@link swapElementsNow} except it will {@link Utils.waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export const swapElements = asyncMutatorFor(swapElementsNow);

// [TODO v2]: moveChildren to accept newParent as options.to

/**
 * Move an element's children to a new element
 *
 * @param [options.ignoreMove]
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
 * Like {@link moveChildrenNow} except it will {@link Utils.waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export const moveChildren = asyncMutatorFor(moveChildrenNow);

/**
 * Moves an element to a new position.
 *
 * @param [options.to]         The new parent or sibling (depending on
 *                             `options.position`). If not given, the
 *                             element is removed from the DOM.
 * @param [options.position]   - append (default): append to `options.to`
 *                             - prepend: prepend to `options.to`
 *                             - before: insert before `options.to`
 *                             - after: insert after `options.to`
 * @param [options.ignoreMove] If true, the DOM watcher instances will
 *                             ignore the operation of moving the element
 *                             (so as to not trigger relevant callbacks).
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
 * Like {@link moveElementNow} except it will {@link Utils.waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export const moveElement = asyncMutatorFor(moveElementNow);

/**
 * It will {@link hideElement} and then remove it from the DOM.
 *
 * @param [options.ignoreMove]
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
export const isAllowedToWrap = (element: Element) =>
  settings.contentWrappingAllowed === true &&
  getData(element, MC.PREFIX_NO_WRAP) === null;

/**
 * @ignore
 * @internal
 *
 * @param classNames Default is [MC.PREFIX_WRAPPER]. Pass `null` to disable check.
 */
export const getWrapper = (
  element: Element,
  options?: {
    tagName?: keyof HTMLElementTagNameMap;
    classNames?: string[] | null;
  },
) => {
  const { tagName, classNames = [MC.PREFIX_WRAPPER] } = options ?? {};
  const parent = MH.parentOf(element);
  if (
    MH.lengthOf(MH.childrenOf(parent)) === 1 &&
    MH.isHTMLElement(parent) &&
    (!tagName || MH.hasTagName(parent, tagName)) &&
    (!classNames || hasAnyClass(parent, ...classNames))
  ) {
    // Already wrapped
    return parent;
  }

  return null; // don't check the element itself, only its parent
};

/**
 * @ignore
 * @internal
 *
 * @param classNames Default is [MC.PREFIX_WRAPPER]. Pass `null` to disable check.
 */
export const getContentWrapper = (
  element: Element,
  options?: {
    tagName?: keyof HTMLElementTagNameMap;
    classNames?: string[] | null;
  },
) => {
  const { tagName, classNames = [MC.PREFIX_WRAPPER] } = options ?? {};
  const firstChild = MH.childrenOf(element)[0];
  if (
    MH.lengthOf(MH.childrenOf(element)) === 1 &&
    MH.isHTMLElement(firstChild) &&
    (!tagName || MH.hasTagName(firstChild, tagName)) &&
    (!classNames || hasAnyClass(firstChild, ...classNames))
  ) {
    // Already wrapped
    return firstChild;
  }

  return null;
};

/**
 * @ignore
 * @internal
 */
export const tryWrapNow = <O extends ContentWrappingOptions>(
  element: Element,
  options?: O,
) => _tryWrapNow(element, options);

/**
 * @ignore
 * @internal
 */
export const tryWrap = asyncMutatorFor(tryWrapNow);

/**
 * @ignore
 * @internal
 */
export const tryWrapContentNow = <O extends ContentWrappingOptions>(
  element: Element,
  options?: O,
) => _tryWrapNow(element, options, true);

/**
 * @ignore
 * @internal
 */
export const tryWrapContent = asyncMutatorFor(tryWrapContentNow);

/**
 * @ignore
 * @internal
 */
export const unwrapContentNow = (wrapper: Element, classNames?: string[]) => {
  const parent = wrapper.parentElement;
  if (parent) {
    moveChildrenNow(wrapper, parent, { ignoreMove: true });
    moveElementNow(wrapper, { ignoreMove: true });
    if (classNames) {
      removeClassesNow(wrapper, ...classNames);
    }
  }
};

/**
 * @ignore
 * @internal
 */
export const unwrapContent = asyncMutatorFor(unwrapContentNow);

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

  const wrapper = _tryWrapNow(clone, { required: true });

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
export const insertGhostClone = asyncMutatorFor(insertGhostCloneNow);

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

type ContentWrappingOptions = {
  tagName?: keyof HTMLElementTagNameMap;
  classNames?: string[]; // if the wrapper has any one of these, it will be re-used
  ignoreMove?: boolean; // default is true here
  required?: boolean; // if true, will ignore contentWrappingAllowed and data-lisn-no-wrap
  requiredBy?: string; // for logging purposes
};

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

const _tryWrapNow = <O extends ContentWrappingOptions>(
  element: Element,
  options: O | undefined,
  wrapContent = false, // if true, wrap its children, otherwise given element
) => {
  const {
    tagName,
    classNames = [MC.PREFIX_WRAPPER],
    ignoreMove = true,
    required = false,
    requiredBy = "",
  } = options ?? {};

  const getWrapperFn = wrapContent ? getContentWrapper : getWrapper;
  const wrapFn = wrapContent ? wrapChildrenNow : wrapElementNow;
  const allowedToWrap = isAllowedToWrap(element);

  let wrapper = getWrapperFn(element, options);
  if (!wrapper && (required || allowedToWrap)) {
    wrapper = wrapFn(element, { wrapper: tagName, ignoreMove });
    if (classNames) {
      addClassesNow(wrapper, ...classNames);
    }
    if (isInlineTag(MH.tagName(wrapper))) {
      addClassesNow(wrapper, MC.PREFIX_INLINE_WRAPPER);
    }

    if (!allowedToWrap && requiredBy) {
      logWarn(
        `content wrapping is disabled for element but wrapping is required by ${requiredBy}`,
      );
    }
  }

  return wrapper as O extends { required: true }
    ? HTMLElement
    : HTMLElement | null;
};
