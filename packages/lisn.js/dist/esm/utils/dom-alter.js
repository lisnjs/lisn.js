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

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { settings } from "../globals/settings.js";
import { hideElement, hasClass, addClassesNow, getData, setDataNow, setBooleanData } from "./css-alter.js";
import { waitForMutateTime } from "./dom-optimize.js";
import { isInlineTag } from "./dom-query.js";
import { logWarn } from "./log.js";
import { randId } from "./text.js";

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
export const wrapElementNow = (element, options) => {
  const wrapper = createWrapperFor(element, options === null || options === void 0 ? void 0 : options.wrapper);
  if ((options === null || options === void 0 ? void 0 : options.ignoreMove) === true) {
    ignoreMove(element, {
      from: MH.parentOf(element),
      to: wrapper
    });
    ignoreMove(wrapper, {
      to: MH.parentOf(element)
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
export const wrapElement = async (element, options) => waitForMutateTime().then(() => wrapElementNow(element, options));

/**
 * Wraps the element's children in the given wrapper, or a newly created element
 * if not given.
 *
 * @see {@link wrapElementNow}.
 *
 * @category DOM: Altering
 */
export const wrapChildrenNow = (element, options) => {
  const wrapper = createWrapperFor(element, options === null || options === void 0 ? void 0 : options.wrapper);
  moveChildrenNow(element, wrapper, {
    ignoreMove: true
  });
  moveElementNow(wrapper, {
    to: element,
    ignoreMove: true
  });
  return wrapper;
};

/**
 * Like {@link wrapChildrenNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export const wrapChildren = async (element, options) => waitForMutateTime().then(() => wrapChildrenNow(element, options));

/**
 * Replace an element with another one.
 *
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              moving the element (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering
 */
export const replaceElementNow = (element, newElement, options) => {
  if ((options === null || options === void 0 ? void 0 : options.ignoreMove) === true) {
    ignoreMove(
    // remove element
    element, {
      from: MH.parentOf(element)
    });
    ignoreMove(
    // move newElement to element's current parent
    newElement, {
      from: MH.parentOf(newElement),
      to: MH.parentOf(element)
    });
  }
  element.replaceWith(newElement);
};

/**
 * Like {@link replaceElementNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export const replaceElement = async (element, newElement, options) => waitForMutateTime().then(() => replaceElementNow(element, newElement, options));

/**
 * Replace an element with another one.
 *
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              moving the element (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering
 */
export const swapElementsNow = (elementA, elementB, options) => {
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
export const swapElements = async (elementA, elementB, options) => waitForMutateTime().then(() => swapElementsNow(elementA, elementB, options));

/**
 * Move an element's children to a new element
 *
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              moving the children (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering
 */
export const moveChildrenNow = (oldParent, newParent, options) => {
  if ((options === null || options === void 0 ? void 0 : options.ignoreMove) === true) {
    for (const child of MH.childrenOf(oldParent)) {
      ignoreMove(child, {
        from: oldParent,
        to: newParent
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
export const moveChildren = async (oldParent, newParent, options) => waitForMutateTime().then(() => moveChildrenNow(oldParent, newParent, options));

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
export const moveElementNow = (element, options) => {
  let parentEl = (options === null || options === void 0 ? void 0 : options.to) || null;
  const position = (options === null || options === void 0 ? void 0 : options.position) || "append";
  if (position === "before" || position === "after") {
    parentEl = MH.parentOf(options === null || options === void 0 ? void 0 : options.to);
  }
  if ((options === null || options === void 0 ? void 0 : options.ignoreMove) === true) {
    ignoreMove(element, {
      from: MH.parentOf(element),
      to: parentEl
    });
  }
  if (options !== null && options !== void 0 && options.to) {
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
export const moveElement = async (element, options) => waitForMutateTime().then(() => moveElementNow(element, options));

/**
 * It will {@link hideElement} and then remove it from the DOM.
 *
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              replacing the element (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering (optimized)
 */
export const hideAndRemoveElement = async (element, delay = 0, options) => {
  await hideElement(element, delay);
  moveElementNow(element, options);
};

/**
 * @ignore
 * @internal
 */
export const getOrAssignID = (element, prefix = "") => {
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
export const isAllowedToWrap = element => settings.contentWrappingAllowed === true && getData(element, MC.PREFIX_NO_WRAP) === null;

/**
 * @ignore
 * @internal
 */
export const getWrapper = (element, options) => {
  const {
    tagName,
    className = MC.PREFIX_WRAPPER
  } = options !== null && options !== void 0 ? options : {};
  const parent = MH.parentOf(element);
  if (MH.lengthOf(MH.childrenOf(parent)) === 1 && MH.isHTMLElement(parent) && (!tagName || MH.toLowerCase(MH.tagName(parent)) === MH.toLowerCase(tagName)) && (!className || hasClass(parent, className))) {
    // Already wrapped
    return parent;
  }
  return null; // don't check the element itself, only its parent
};

/**
 * @ignore
 * @internal
 */
export const getContentWrapper = (element, options) => {
  const {
    tagName,
    className = MC.PREFIX_CONTENT_WRAPPER
  } = options !== null && options !== void 0 ? options : {};
  const firstChild = MH.childrenOf(element)[0];
  if (MH.lengthOf(MH.childrenOf(element)) === 1 && MH.isHTMLElement(firstChild) && (!tagName || MH.toLowerCase(MH.tagName(firstChild)) === MH.toLowerCase(tagName)) && (!className || hasClass(firstChild, className))) {
    // Already wrapped
    return firstChild;
  }
  return null;
};

/**
 * @ignore
 * @internal
 */
export const tryWrapNow = (element, options) => _tryWrapNow(element, options);

/**
 * @ignore
 * @internal
 */
export const tryWrap = (element, options) => _tryWrap(element, options);

/**
 * @ignore
 * @internal
 */
export const tryWrapContentNow = (element, options) => _tryWrapNow(element, options, true);

/**
 * @ignore
 * @internal
 */
export const tryWrapContent = (element, options) => _tryWrap(element, options, true);

/**
 * @ignore
 * @internal
 */
export const cloneElement = element => {
  const clone = element.cloneNode(true);
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
export const insertGhostCloneNow = (element, insertBefore = null) => {
  const clone = cloneElement(element);
  clone.id = "";
  addClassesNow(clone, MC.PREFIX_GHOST, MC.PREFIX_TRANSITION_DISABLE, MC.PREFIX_ANIMATE_DISABLE);
  const wrapper = _tryWrapNow(clone, {
    required: true
  });
  moveElementNow(wrapper, {
    to: insertBefore || element,
    position: "before",
    ignoreMove: true
  });
  return {
    _wrapper: wrapper,
    _clone: clone
  };
};

/**
 * @ignore
 * @internal
 *
 * Exposed via DOMWatcher
 */
export const insertGhostClone = (element, insertBefore = null) => waitForMutateTime().then(() => insertGhostCloneNow(element, insertBefore));

/**
 * @ignore
 * @internal
 *
 * Exposed via DOMWatcher
 */
export const ignoreMove = (target, options) => recordsToSkipOnce.set(target, {
  from: options.from || null,
  to: options.to || null
});

/**
 * @ignore
 * @internal
 */
export const getIgnoreMove = target => recordsToSkipOnce.get(target) || null;

/**
 * @ignore
 * @internal
 */
export const clearIgnoreMove = target => {
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
export const insertArrow = (target, direction, position = "append", tag = "span") => {
  const arrow = MH.createElement(tag);
  addClassesNow(arrow, MH.prefixName(MC.S_ARROW));
  setDataNow(arrow, MH.prefixName("direction"), direction);
  moveElement(arrow, {
    to: target,
    position,
    ignoreMove: true
  });
  return arrow;
};

// ----------------------------------------

const recordsToSkipOnce = MH.newMap();
const createWrapperFor = (element, wrapper) => {
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
const _tryWrapNow = (element, options, wrapContent = false // if true, wrap its children, otherwise given element
) => {
  const {
    tagName,
    className = wrapContent ? MC.PREFIX_CONTENT_WRAPPER : MC.PREFIX_WRAPPER,
    ignoreMove = true,
    required = false,
    requiredBy = ""
  } = options !== null && options !== void 0 ? options : {};
  const getWrapperFn = wrapContent ? getContentWrapper : getWrapper;
  const wrapFn = wrapContent ? wrapChildrenNow : wrapElementNow;
  const allowedToWrap = isAllowedToWrap(element);
  let wrapper = getWrapperFn(element, options);
  if (!wrapper && (required || allowedToWrap)) {
    wrapper = wrapFn(element, {
      wrapper: tagName,
      ignoreMove
    });
    addClassesNow(wrapper, className);
    if (isInlineTag(MH.tagName(wrapper))) {
      addClassesNow(wrapper, MC.PREFIX_INLINE_WRAPPER);
    }
    if (!allowedToWrap && requiredBy) {
      logWarn(`content wrapping is disabled for element but wrapping is required by ${requiredBy}`);
    }
  }
  return wrapper;
};
const _tryWrap = (element, options, wrapContent = false // if true, wrap its children, otherwise given element
) => waitForMutateTime().then(() => _tryWrapNow(element, options, wrapContent));
//# sourceMappingURL=dom-alter.js.map