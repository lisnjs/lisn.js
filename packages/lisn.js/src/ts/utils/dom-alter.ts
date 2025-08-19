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

import * as _ from "@lisn/_internal";

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
      from: _.parentOf(element),
      to: wrapper,
    });

    ignoreMove(wrapper, {
      to: _.parentOf(element),
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
      { from: _.parentOf(element) },
    );

    ignoreMove(
      // move newElement to element's current parent
      newElement,
      { from: _.parentOf(newElement), to: _.parentOf(element) },
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
  const temp = _.createElement("div");
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
    for (const child of _.childrenOf(oldParent)) {
      ignoreMove(child, {
        from: oldParent,
        to: newParent,
      });
    }
  }

  newParent.append(..._.childrenOf(oldParent));
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
  let parentEl = options?.to ?? null;
  const position = options?.position || "append";
  if (position === "before" || position === "after") {
    parentEl = _.parentOf(options?.to);
  }

  if (options?.ignoreMove === true) {
    ignoreMove(element, {
      from: _.parentOf(element),
      to: parentEl,
    });
  }

  if (options?.to) {
    options.to[position](element);
  } else {
    _.remove(element);
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
 *
 * @since v1.2.0
 */
export const isAllowedToWrap = (element: Element) =>
  settings.contentWrappingAllowed === true &&
  _.isNull(getData(element, _.PREFIX_NO_WRAP));

/**
 * @ignore
 * @internal
 *
 * @param [options.classNames] Default is [_.PREFIX_WRAPPER].
 *                             Pass `null` to disable check.
 *
 * @since v1.2.0
 */
export const getWrapper = (
  element: Element,
  options?: {
    _tagName?: keyof HTMLElementTagNameMap;
    _classNames?: string[] | null;
  },
) => {
  const { _tagName: tagName, _classNames: classNames = [_.PREFIX_WRAPPER] } =
    options ?? {};
  const parent = _.parentOf(element);
  if (
    _.lengthOf(_.childrenOf(parent)) === 1 &&
    _.isHTMLElement(parent) &&
    (!tagName || _.hasTagName(parent, tagName)) &&
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
 * @param [options.classNames] Default is [_.PREFIX_WRAPPER_CONTENT].
 *                             Pass `null` to disable check.
 *
 * @since v1.2.0
 */
export const getContentWrapper = (
  element: Element,
  options?: {
    _tagName?: keyof HTMLElementTagNameMap;
    _classNames?: string[] | null;
  },
) => {
  const {
    _tagName: tagName,
    _classNames: classNames = [_.PREFIX_WRAPPER_CONTENT],
  } = options ?? {};
  const firstChild = _.childrenOf(element)[0];
  if (
    _.lengthOf(_.childrenOf(element)) === 1 &&
    _.isHTMLElement(firstChild) &&
    (!tagName || _.hasTagName(firstChild, tagName)) &&
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
export const createWrapperFor = (
  element: Element,
  wrapper?: HTMLElement | keyof HTMLElementTagNameMap,
) => {
  if (_.isElement(wrapper)) {
    return wrapper;
  }

  let tag = wrapper;
  if (!tag) {
    if (isInlineTag(_.tagName(element))) {
      tag = "span";
    } else {
      tag = "div";
    }
  }

  return _.createElement(tag);
};

/**
 * @ignore
 * @internal
 *
 * @since v1.2.0
 */
export const tryWrapNow = <O extends ContentWrappingOptions>(
  element: Element,
  options?: O,
) => _tryWrapNow(element, options);

/**
 * @ignore
 * @internal
 *
 * @since v1.2.0
 */
export const tryWrap = asyncMutatorFor(tryWrapNow);

/**
 * @ignore
 * @internal
 *
 * @since v1.2.0
 */
export const tryWrapContentNow = <O extends ContentWrappingOptions>(
  element: Element,
  options?: O,
) => _tryWrapNow(element, options, true);

/**
 * @ignore
 * @internal
 *
 * @since v1.2.0
 */
export const tryWrapContent = asyncMutatorFor(tryWrapContentNow);

/**
 * @ignore
 * @internal
 *
 * @since v1.2.0
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
 *
 * @since v1.2.0
 */
export const unwrapContent = asyncMutatorFor(unwrapContentNow);

/**
 * @ignore
 * @internal
 */
export const cloneElement = <E extends Element>(element: E) => {
  const clone = element.cloneNode(true) as E;
  setBooleanData(clone, _.prefixName("clone"));
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
    _.PREFIX_GHOST,
    _.PREFIX_TRANSITION_DISABLE,
    _.PREFIX_ANIMATE_DISABLE,
  );

  const wrapper = _tryWrapNow(clone, {
    _classNames: [_.PREFIX_RELATIVE, _.PREFIX_WRAPPER],
    _required: true,
  });

  moveElementNow(wrapper, {
    to: insertBefore ?? element,
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
    from: options.from ?? null,
    to: options.to ?? null,
  });

/**
 * @ignore
 * @internal
 */
export const getIgnoreMove = (
  target: Element,
): { from: Element | null; to: Element | null } | null =>
  recordsToSkipOnce.get(target) ?? null;

/**
 * @ignore
 * @internal
 */
export const clearIgnoreMove = (target: Element) => {
  // We should not clear the entry the first time the operation is observed
  // (when we return true here), because there may be multiple DOMWatcher
  // instances that will observe it and need to query it. Instead do it shortly.
  _.setTimer(() => {
    _.deleteKey(recordsToSkipOnce, target);
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
  const arrow = _.createElement(tag);
  addClassesNow(arrow, _.prefixName(_.S_ARROW));
  setDataNow(arrow, _.prefixName("direction"), direction);
  moveElement(arrow, { to: target, position, ignoreMove: true });
  return arrow;
};

// ----------------------------------------

type ContentWrappingOptions = {
  _tagName?: keyof HTMLElementTagNameMap;
  _classNames?: string[]; // if the wrapper has any one of these, it will be re-used
  _ignoreMove?: boolean; // default is true here
  _required?: boolean; // if true, will ignore contentWrappingAllowed and data-lisn-no-wrap
  _requiredBy?: string; // for logging purposes
};

const recordsToSkipOnce = _.newMap<
  /* target being moved */ Element,
  { from: Element | null; to: Element | null }
>();

const _tryWrapNow = <O extends ContentWrappingOptions>(
  element: Element,
  options: O | undefined,
  wrapContent = false, // if true, wrap its children, otherwise given element
) => {
  const {
    _tagName: tagName,
    _classNames: classNames = wrapContent
      ? [_.PREFIX_WRAPPER_CONTENT]
      : [_.PREFIX_WRAPPER],
    _ignoreMove: ignoreMove = true,
    _required: required = false,
    _requiredBy: requiredBy = "",
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

    if (!allowedToWrap && requiredBy) {
      logWarn(
        `content wrapping is disabled for element but wrapping is required by ${requiredBy}`,
      );
    }
  }

  return wrapper as O extends { _required: true }
    ? HTMLElement
    : HTMLElement | null;
};
