"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapScrollingContent = exports.wrapElementNow = exports.wrapElement = exports.wrapChildrenNow = exports.wrapChildren = exports.swapElementsNow = exports.swapElements = exports.replaceElementNow = exports.replaceElement = exports.moveElementNow = exports.moveElement = exports.moveChildrenNow = exports.moveChildren = exports.insertGhostCloneNow = exports.insertGhostClone = exports.insertArrow = exports.ignoreMove = exports.hideAndRemoveElement = exports.getOrAssignID = exports.getIgnoreMove = exports.cloneElement = exports.clearIgnoreMove = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _cssAlter = require("./css-alter.cjs");
var _domOptimize = require("./dom-optimize.cjs");
var _domQuery = require("./dom-query.cjs");
var _text = require("./text.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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
const wrapElementNow = (element, options) => {
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
exports.wrapElementNow = wrapElementNow;
const wrapElement = async (element, options) => (0, _domOptimize.waitForMutateTime)().then(() => wrapElementNow(element, options));

/**
 * Wraps the element's children in the given wrapper, or a newly created element
 * if not given.
 *
 * @see {@link wrapElementNow}.
 *
 * @category DOM: Altering
 */
exports.wrapElement = wrapElement;
const wrapChildrenNow = (element, options) => {
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
exports.wrapChildrenNow = wrapChildrenNow;
const wrapChildren = async (element, options) => (0, _domOptimize.waitForMutateTime)().then(() => wrapChildrenNow(element, options));

/**
 * Replace an element with another one.
 *
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              moving the element (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering
 */
exports.wrapChildren = wrapChildren;
const replaceElementNow = (element, newElement, options) => {
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
exports.replaceElementNow = replaceElementNow;
const replaceElement = async (element, newElement, options) => (0, _domOptimize.waitForMutateTime)().then(() => replaceElementNow(element, newElement, options));

/**
 * Replace an element with another one.
 *
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              moving the element (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering
 */
exports.replaceElement = replaceElement;
const swapElementsNow = (elementA, elementB, options) => {
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
exports.swapElementsNow = swapElementsNow;
const swapElements = async (elementA, elementB, options) => (0, _domOptimize.waitForMutateTime)().then(() => swapElementsNow(elementA, elementB, options));

/**
 * Move an element's children to a new element
 *
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              moving the children (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering
 */
exports.swapElements = swapElements;
const moveChildrenNow = (oldParent, newParent, options) => {
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
exports.moveChildrenNow = moveChildrenNow;
const moveChildren = async (oldParent, newParent, options) => (0, _domOptimize.waitForMutateTime)().then(() => moveChildrenNow(oldParent, newParent, options));

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
exports.moveChildren = moveChildren;
const moveElementNow = (element, options) => {
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
exports.moveElementNow = moveElementNow;
const moveElement = async (element, options) => (0, _domOptimize.waitForMutateTime)().then(() => moveElementNow(element, options));

/**
 * It will {@link hideElement} and then remove it from the DOM.
 *
 * @param {} [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              replacing the element (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering (optimized)
 */
exports.moveElement = moveElement;
const hideAndRemoveElement = async (element, delay = 0, options) => {
  await (0, _cssAlter.hideElement)(element, delay);
  moveElementNow(element, options);
};

/**
 * @ignore
 * @internal
 */
exports.hideAndRemoveElement = hideAndRemoveElement;
const getOrAssignID = (element, prefix = "") => {
  let domID = element.id;
  if (!domID) {
    domID = `${prefix}-${(0, _text.randId)()}`;
    element.id = domID;
  }
  return domID;
};

/**
 * @ignore
 * @internal
 */
exports.getOrAssignID = getOrAssignID;
const wrapScrollingContent = async element => {
  await (0, _domOptimize.waitForMutateTime)();
  let wrapper;
  const firstChild = MH.childrenOf(element)[0];
  if (MH.lengthOf(MH.childrenOf(element)) === 1 && MH.isHTMLElement(firstChild) && (0, _cssAlter.hasClass)(firstChild, PREFIX_CONTENT_WRAPPER)) {
    // Another concurrent call has just wrapped it
    wrapper = firstChild;
  } else {
    wrapper = wrapChildrenNow(element, {
      ignoreMove: true
    });
    (0, _cssAlter.addClassesNow)(wrapper, PREFIX_CONTENT_WRAPPER);
  }
  return wrapper;
};

/**
 * @ignore
 * @internal
 */
exports.wrapScrollingContent = wrapScrollingContent;
const cloneElement = element => {
  const clone = element.cloneNode(true);
  (0, _cssAlter.setBooleanData)(clone, MH.prefixName("clone"));
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
exports.cloneElement = cloneElement;
const insertGhostCloneNow = (element, insertBefore = null) => {
  const clone = cloneElement(element);
  clone.id = "";
  (0, _cssAlter.addClassesNow)(clone, MC.PREFIX_GHOST, MC.PREFIX_TRANSITION_DISABLE, MC.PREFIX_ANIMATE_DISABLE);
  const wrapper = wrapElementNow(clone);
  (0, _cssAlter.addClassesNow)(wrapper, MC.PREFIX_WRAPPER);
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
exports.insertGhostCloneNow = insertGhostCloneNow;
const insertGhostClone = (element, insertBefore = null) => (0, _domOptimize.waitForMutateTime)().then(() => insertGhostCloneNow(element, insertBefore));

/**
 * @ignore
 * @internal
 *
 * Exposed via DOMWatcher
 */
exports.insertGhostClone = insertGhostClone;
const ignoreMove = (target, options) => recordsToSkipOnce.set(target, {
  from: options.from || null,
  to: options.to || null
});

/**
 * @ignore
 * @internal
 */
exports.ignoreMove = ignoreMove;
const getIgnoreMove = target => recordsToSkipOnce.get(target) || null;

/**
 * @ignore
 * @internal
 */
exports.getIgnoreMove = getIgnoreMove;
const clearIgnoreMove = target => {
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
exports.clearIgnoreMove = clearIgnoreMove;
const insertArrow = (target, direction, position = "append", tag = "span") => {
  const arrow = MH.createElement(tag);
  (0, _cssAlter.addClassesNow)(arrow, MH.prefixName(MC.S_ARROW));
  (0, _cssAlter.setDataNow)(arrow, MH.prefixName("direction"), direction);
  moveElement(arrow, {
    to: target,
    position,
    ignoreMove: true
  });
  return arrow;
};

// ----------------------------------------
exports.insertArrow = insertArrow;
const PREFIX_CONTENT_WRAPPER = MH.prefixName("content-wrapper");
const recordsToSkipOnce = MH.newMap();
const createWrapperFor = (element, wrapper) => {
  if (MH.isElement(wrapper)) {
    return wrapper;
  }
  let tag = wrapper;
  if (!tag) {
    if ((0, _domQuery.isInlineTag)(MH.tagName(element))) {
      tag = "span";
    } else {
      tag = "div";
    }
  }
  return MH.createElement(tag);
};
//# sourceMappingURL=dom-alter.cjs.map