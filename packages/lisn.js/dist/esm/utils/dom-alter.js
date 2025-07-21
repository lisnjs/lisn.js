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

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { settings } from "../globals/settings.js";
import { hideElement, hasAnyClass, addClassesNow, removeClassesNow, getData, setDataNow, setBooleanData } from "./css-alter.js";
import { asyncMutatorFor } from "./dom-optimize.js";
import { isInlineTag } from "./dom-query.js";
import { logWarn } from "./log.js";
import { randId } from "./text.js";

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
export const wrapChildrenNow = (element, options) => {
  const wrapper = createWrapperFor(element, options === null || options === void 0 ? void 0 : options.wrapper);
  const {
    ignoreMove
  } = options !== null && options !== void 0 ? options : {};
  moveChildrenNow(element, wrapper, {
    ignoreMove
  });
  moveElementNow(wrapper, {
    to: element,
    ignoreMove
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
export const swapElementsNow = (elementA, elementB, options) => {
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
export const moveElementNow = (element, options) => {
  var _options$to;
  let parentEl = (_options$to = options === null || options === void 0 ? void 0 : options.to) !== null && _options$to !== void 0 ? _options$to : null;
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
 *
 * @since v1.2.0
 */
export const isAllowedToWrap = element => settings.contentWrappingAllowed === true && getData(element, MC.PREFIX_NO_WRAP) === null;

/**
 * @ignore
 * @internal
 *
 * @param [options.classNames] Default is [MC.PREFIX_WRAPPER]. Pass `null` to
 *                             disable check.
 *
 * @since v1.2.0
 */
export const getWrapper = (element, options) => {
  const {
    _tagName: tagName,
    _classNames: classNames = [MC.PREFIX_WRAPPER]
  } = options !== null && options !== void 0 ? options : {};
  const parent = MH.parentOf(element);
  if (MH.lengthOf(MH.childrenOf(parent)) === 1 && MH.isHTMLElement(parent) && (!tagName || MH.hasTagName(parent, tagName)) && (!classNames || hasAnyClass(parent, ...classNames))) {
    // Already wrapped
    return parent;
  }
  return null; // don't check the element itself, only its parent
};

/**
 * @ignore
 * @internal
 *
 * @param [options.classNames] Default is [MC.PREFIX_WRAPPER]. Pass `null` to
 *                             disable check.
 *
 * @since v1.2.0
 */
export const getContentWrapper = (element, options) => {
  const {
    _tagName: tagName,
    _classNames: classNames = [MC.PREFIX_WRAPPER]
  } = options !== null && options !== void 0 ? options : {};
  const firstChild = MH.childrenOf(element)[0];
  if (MH.lengthOf(MH.childrenOf(element)) === 1 && MH.isHTMLElement(firstChild) && (!tagName || MH.hasTagName(firstChild, tagName)) && (!classNames || hasAnyClass(firstChild, ...classNames))) {
    // Already wrapped
    return firstChild;
  }
  return null;
};

/**
 * @ignore
 * @internal
 *
 * @since v1.2.0
 */
export const tryWrapNow = (element, options) => _tryWrapNow(element, options);

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
export const tryWrapContentNow = (element, options) => _tryWrapNow(element, options, true);

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
export const unwrapContentNow = (wrapper, classNames) => {
  const parent = wrapper.parentElement;
  if (parent) {
    moveChildrenNow(wrapper, parent, {
      ignoreMove: true
    });
    moveElementNow(wrapper, {
      ignoreMove: true
    });
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
    _required: true
  });
  moveElementNow(wrapper, {
    to: insertBefore !== null && insertBefore !== void 0 ? insertBefore : element,
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
export const insertGhostClone = asyncMutatorFor(insertGhostCloneNow);

/**
 * @ignore
 * @internal
 *
 * Exposed via DOMWatcher
 */
export const ignoreMove = (target, options) => {
  var _options$from, _options$to2;
  return recordsToSkipOnce.set(target, {
    from: (_options$from = options.from) !== null && _options$from !== void 0 ? _options$from : null,
    to: (_options$to2 = options.to) !== null && _options$to2 !== void 0 ? _options$to2 : null
  });
};

/**
 * @ignore
 * @internal
 */
export const getIgnoreMove = target => {
  var _recordsToSkipOnce$ge;
  return (_recordsToSkipOnce$ge = recordsToSkipOnce.get(target)) !== null && _recordsToSkipOnce$ge !== void 0 ? _recordsToSkipOnce$ge : null;
};

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
    _tagName: tagName,
    _classNames: classNames = [MC.PREFIX_WRAPPER],
    _ignoreMove: ignoreMove = true,
    _required: required = false,
    _requiredBy: requiredBy = ""
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
    if (classNames) {
      addClassesNow(wrapper, ...classNames);
    }
    if (isInlineTag(MH.tagName(wrapper))) {
      addClassesNow(wrapper, MC.PREFIX_INLINE_WRAPPER);
    }
    if (!allowedToWrap && requiredBy) {
      logWarn(`content wrapping is disabled for element but wrapping is required by ${requiredBy}`);
    }
  }
  return wrapper;
};
//# sourceMappingURL=dom-alter.js.map