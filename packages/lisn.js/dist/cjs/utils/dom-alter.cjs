"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapElementNow = exports.wrapElement = exports.wrapChildrenNow = exports.wrapChildren = exports.unwrapContentNow = exports.unwrapContent = exports.tryWrapNow = exports.tryWrapContentNow = exports.tryWrapContent = exports.tryWrap = exports.swapElementsNow = exports.swapElements = exports.replaceElementNow = exports.replaceElement = exports.moveElementNow = exports.moveElement = exports.moveChildrenNow = exports.moveChildren = exports.isAllowedToWrap = exports.insertGhostCloneNow = exports.insertGhostClone = exports.insertArrow = exports.ignoreMove = exports.hideAndRemoveElement = exports.getWrapper = exports.getOrAssignID = exports.getIgnoreMove = exports.getContentWrapper = exports.cloneElement = exports.clearIgnoreMove = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _settings = require("../globals/settings.cjs");
var _cssAlter = require("./css-alter.cjs");
var _domOptimize = require("./dom-optimize.cjs");
var _domQuery = require("./dom-query.cjs");
var _log = require("./log.cjs");
var _text = require("./text.cjs");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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
 * Like {@link wrapElementNow} except it will {@link Utils.waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
exports.wrapElementNow = wrapElementNow;
const wrapElement = exports.wrapElement = (0, _domOptimize.asyncMutatorFor)(wrapElementNow);

/**
 * Wraps the element's children in the given wrapper, or a newly created element
 * if not given.
 *
 * @see {@link wrapElementNow}.
 *
 * @category DOM: Altering
 */
const wrapChildrenNow = (element, options) => {
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
exports.wrapChildrenNow = wrapChildrenNow;
const wrapChildren = exports.wrapChildren = (0, _domOptimize.asyncMutatorFor)(wrapChildrenNow);

/**
 * Replace an element with another one.
 *
 * @param [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              moving the element (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering
 */
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
 * Like {@link replaceElementNow} except it will {@link Utils.waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
exports.replaceElementNow = replaceElementNow;
const replaceElement = exports.replaceElement = (0, _domOptimize.asyncMutatorFor)(replaceElementNow);

/**
 * Replace an element with another one.
 *
 * @param [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              moving the element (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering
 */
const swapElementsNow = (elementA, elementB, options) => {
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
exports.swapElementsNow = swapElementsNow;
const swapElements = exports.swapElements = (0, _domOptimize.asyncMutatorFor)(swapElementsNow);

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
 * Like {@link moveChildrenNow} except it will {@link Utils.waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
exports.moveChildrenNow = moveChildrenNow;
const moveChildren = exports.moveChildren = (0, _domOptimize.asyncMutatorFor)(moveChildrenNow);

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
 * Like {@link moveElementNow} except it will {@link Utils.waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
exports.moveElementNow = moveElementNow;
const moveElement = exports.moveElement = (0, _domOptimize.asyncMutatorFor)(moveElementNow);

/**
 * It will {@link hideElement} and then remove it from the DOM.
 *
 * @param [options.ignoreMove]
 *              If true, the DOM watcher instances will ignore the operation of
 *              replacing the element (so as to not trigger relevant callbacks).
 *
 * @category DOM: Altering (optimized)
 */
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
 *
 * @since v1.2.0
 */
exports.getOrAssignID = getOrAssignID;
const isAllowedToWrap = element => _settings.settings.contentWrappingAllowed === true && (0, _cssAlter.getData)(element, MC.PREFIX_NO_WRAP) === null;

/**
 * @ignore
 * @internal
 *
 * @param classNames Default is [MC.PREFIX_WRAPPER]. Pass `null` to disable check.
 *
 * @since v1.2.0
 */
exports.isAllowedToWrap = isAllowedToWrap;
const getWrapper = (element, options) => {
  const {
    tagName,
    classNames = [MC.PREFIX_WRAPPER]
  } = options !== null && options !== void 0 ? options : {};
  const parent = MH.parentOf(element);
  if (MH.lengthOf(MH.childrenOf(parent)) === 1 && MH.isHTMLElement(parent) && (!tagName || MH.hasTagName(parent, tagName)) && (!classNames || (0, _cssAlter.hasAnyClass)(parent, ...classNames))) {
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
 *
 * @since v1.2.0
 */
exports.getWrapper = getWrapper;
const getContentWrapper = (element, options) => {
  const {
    tagName,
    classNames = [MC.PREFIX_WRAPPER]
  } = options !== null && options !== void 0 ? options : {};
  const firstChild = MH.childrenOf(element)[0];
  if (MH.lengthOf(MH.childrenOf(element)) === 1 && MH.isHTMLElement(firstChild) && (!tagName || MH.hasTagName(firstChild, tagName)) && (!classNames || (0, _cssAlter.hasAnyClass)(firstChild, ...classNames))) {
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
exports.getContentWrapper = getContentWrapper;
const tryWrapNow = (element, options) => _tryWrapNow(element, options);

/**
 * @ignore
 * @internal
 *
 * @since v1.2.0
 */
exports.tryWrapNow = tryWrapNow;
const tryWrap = exports.tryWrap = (0, _domOptimize.asyncMutatorFor)(tryWrapNow);

/**
 * @ignore
 * @internal
 *
 * @since v1.2.0
 */
const tryWrapContentNow = (element, options) => _tryWrapNow(element, options, true);

/**
 * @ignore
 * @internal
 *
 * @since v1.2.0
 */
exports.tryWrapContentNow = tryWrapContentNow;
const tryWrapContent = exports.tryWrapContent = (0, _domOptimize.asyncMutatorFor)(tryWrapContentNow);

/**
 * @ignore
 * @internal
 *
 * @since v1.2.0
 */
const unwrapContentNow = (wrapper, classNames) => {
  const parent = wrapper.parentElement;
  if (parent) {
    moveChildrenNow(wrapper, parent, {
      ignoreMove: true
    });
    moveElementNow(wrapper, {
      ignoreMove: true
    });
    if (classNames) {
      (0, _cssAlter.removeClassesNow)(wrapper, ...classNames);
    }
  }
};

/**
 * @ignore
 * @internal
 *
 * @since v1.2.0
 */
exports.unwrapContentNow = unwrapContentNow;
const unwrapContent = exports.unwrapContent = (0, _domOptimize.asyncMutatorFor)(unwrapContentNow);

/**
 * @ignore
 * @internal
 */
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
exports.insertGhostCloneNow = insertGhostCloneNow;
const insertGhostClone = exports.insertGhostClone = (0, _domOptimize.asyncMutatorFor)(insertGhostCloneNow);

/**
 * @ignore
 * @internal
 *
 * Exposed via DOMWatcher
 */
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
const _tryWrapNow = (element, options, wrapContent = false // if true, wrap its children, otherwise given element
) => {
  const {
    tagName,
    classNames = [MC.PREFIX_WRAPPER],
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
    if (classNames) {
      (0, _cssAlter.addClassesNow)(wrapper, ...classNames);
    }
    if ((0, _domQuery.isInlineTag)(MH.tagName(wrapper))) {
      (0, _cssAlter.addClassesNow)(wrapper, MC.PREFIX_INLINE_WRAPPER);
    }
    if (!allowedToWrap && requiredBy) {
      (0, _log.logWarn)(`content wrapping is disabled for element but wrapping is required by ${requiredBy}`);
    }
  }
  return wrapper;
};
//# sourceMappingURL=dom-alter.cjs.map