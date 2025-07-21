"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsetBooleanDataNow = exports.unsetBooleanData = exports.unsetBoolDataNow = exports.unsetBoolData = exports.undisplayElementNow = exports.undisplayElement = exports.transitionElementNow = exports.transitionElement = exports.toggleShowElementNow = exports.toggleShowElement = exports.toggleDisplayElementNow = exports.toggleDisplayElement = exports.toggleClassesNow = exports.toggleClasses = exports.toggleClassNow = exports.toggleClass = exports.showElementNow = exports.showElement = exports.setStylePropNow = exports.setStyleProp = exports.setNumericStyleJsVarsNow = exports.setNumericStyleJsVars = exports.setHasModal = exports.setDataNow = exports.setData = exports.setBooleanDataNow = exports.setBooleanData = exports.setBoolDataNow = exports.setBoolData = exports.replaceClassNow = exports.replaceClass = exports.removeClassesNow = exports.removeClasses = exports.isFlexChild = exports.isFlex = exports.isElementUndisplayed = exports.isElementHidden = exports.hideElementNow = exports.hideElement = exports.hasClass = exports.hasAnyClass = exports.hasAllClasses = exports.getStylePropNow = exports.getStyleProp = exports.getParentFlexDirection = exports.getMaxTransitionDuration = exports.getFlexDirection = exports.getData = exports.getComputedStylePropNow = exports.getComputedStyleProp = exports.getBooleanData = exports.getBoolData = exports.displayElementNow = exports.displayElement = exports.disableInitialTransition = exports.delStylePropNow = exports.delStyleProp = exports.delHasModal = exports.delDataNow = exports.delData = exports.copyStyle = exports.addClassesNow = exports.addClasses = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _domOptimize = require("./dom-optimize.cjs");
var _domQuery = require("./dom-query.cjs");
var _math = require("./math.cjs");
var _tasks = require("./tasks.cjs");
var _text = require("./text.cjs");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * @module Utils
 *
 * @categoryDescription CSS: Altering
 * These functions transition an element from one CSS class to another, but
 * could lead to forced layout if not scheduled using {@link waitForMutateTime}.
 * If a delay is supplied, then the transition is "scheduled" and if the
 * opposite transition is executed before the scheduled one, the original one
 * is cancelled. See {@link transitionElement} for an example.
 *
 * @categoryDescription CSS: Altering (optimized)
 * These functions transition an element from one CSS class to another in an
 * optimized way using {@link waitForMutateTime} and so are asynchronous.
 * If a delay is supplied, then the transition is "scheduled" and if the
 * opposite transition is executed before the scheduled one, the original one
 * is cancelled. See {@link transitionElement} for an example.
 */

/**
 * Removes the given `fromCls` class and adds the given `toCls` class to the
 * element.
 *
 * Unlike {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/replace | DOMTokenList:replace},
 * this will always add `toCls` even if `fromCls` isn't in the element's class list.
 *
 * @returns True if there was a change made (class removed or added), false
 * otherwise.
 *
 * @category CSS: Altering
 */
const transitionElementNow = (element, fromCls, toCls) => {
  cancelCSSTransitions(element, fromCls, toCls);

  // Avoid triggering MutationObserver unnecessarily.
  let didChange = false;
  if (hasClass(element, fromCls)) {
    didChange = true;
    removeClassesNow(element, fromCls);
  }
  if (!hasClass(element, toCls)) {
    addClassesNow(element, toCls);
    didChange = true;
  }
  return didChange;
};

/**
 * Like {@link transitionElementNow} except it will {@link waitForMutateTime},
 * and optionally a delay, and it finally awaits for the effective style's
 * transition-duration.
 *
 * If a delay is supplied, then the transition is "scheduled" and if the
 * opposite transition is executed before the scheduled one, this one is
 * cancelled.
 *
 * @example
 *
 * - {@link showElement} with delay of 100 schedules `lisn-hide` -> `lisn-show`
 *   in 100ms
 * - then if {@link hideElementNow} is called, or a scheduled
 *   {@link hideElement} completes  before that timer runs out, this call to
 *   {@link showElement} aborts
 *
 * ```javascript
 * hideElement(someElement, 10);
 * // this will be aborted in 10ms when the scheduled hideElement above
 * // completes
 * showElement(someElement, 100);
 * ```
 *
 * ```javascript
 * // this will be aborted in 10ms when the hideElement that will be scheduled
 * // below completes
 * showElement(someElement, 100);
 * hideElement(someElement, 10);
 * ```
 *
 * ```javascript
 * // this will be aborted immediately by hideElementNow that runs straight
 * // afterwards
 * showElement(someElement, 100);
 * hideElementNow(someElement);
 * ```
 *
 * ```javascript
 * hideElementNow(someElement);
 * // this will NOT be aborted because hideElementNow has completed already
 * showElement(someElement, 100);
 * ```
 *
 * @category CSS: Altering (optimized)
 */
exports.transitionElementNow = transitionElementNow;
const transitionElement = async (element, fromCls, toCls, delay = 0) => {
  const thisTransition = scheduleCSSTransition(element, toCls);
  if (delay) {
    await (0, _tasks.waitForDelay)(delay);
  }
  await (0, _domOptimize.waitForMutateTime)();
  if (thisTransition._isCancelled()) {
    // it has been overridden by a later transition
    return false;
  }
  const didChange = transitionElementNow(element, fromCls, toCls);
  thisTransition._finish();
  if (!didChange) {
    return false;
  }

  // Await for the transition duration so that caller awaiting on us knows when
  // it's complete.
  const transitionDuration = await getMaxTransitionDuration(element);
  if (transitionDuration) {
    await (0, _tasks.waitForDelay)(transitionDuration);
  }
  return true;
};

/**
 * Transitions an element from class `lisn-undisplay` (which applies `display:
 * none`) to `lisn-display` (no style associated with this).
 *
 * The difference between this and simply removing the `lisn-undisplay` class
 * is that previously scheduled transitions to `lisn-undisplay` will be
 * cancelled.
 *
 * @see {@link transitionElementNow}
 *
 * @category CSS: Altering
 */
exports.transitionElement = transitionElement;
const displayElementNow = element => transitionElementNow(element, MC.PREFIX_UNDISPLAY, MC.PREFIX_DISPLAY);

/**
 * Like {@link displayElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
exports.displayElementNow = displayElementNow;
const displayElement = (element, delay = 0) => transitionElement(element, MC.PREFIX_UNDISPLAY, MC.PREFIX_DISPLAY, delay);

/**
 * The opposite of {@link displayElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category CSS: Altering
 */
exports.displayElement = displayElement;
const undisplayElementNow = element => transitionElementNow(element, MC.PREFIX_DISPLAY, MC.PREFIX_UNDISPLAY);

/**
 * Like {@link undisplayElementNow} except it will {@link waitForMutateTime},
 * and optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
exports.undisplayElementNow = undisplayElementNow;
const undisplayElement = (element, delay = 0) => transitionElement(element, MC.PREFIX_DISPLAY, MC.PREFIX_UNDISPLAY, delay);

/**
 * Transitions an element from class `lisn-hide` (which makes the element
 * hidden) to `lisn-show` (which shows it). These classes have CSS
 * transitions applied so the element is faded into and out of view.
 *
 * @see {@link transitionElementNow}.
 *
 * @category CSS: Altering
 */
exports.undisplayElement = undisplayElement;
const showElementNow = element => transitionElementNow(element, MC.PREFIX_HIDE, MC.PREFIX_SHOW);

/**
 * Like {@link showElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
exports.showElementNow = showElementNow;
const showElement = (element, delay = 0) => transitionElement(element, MC.PREFIX_HIDE, MC.PREFIX_SHOW, delay);

/**
 * The opposite of {@link showElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category CSS: Altering
 */
exports.showElement = showElement;
const hideElementNow = element => transitionElementNow(element, MC.PREFIX_SHOW, MC.PREFIX_HIDE);

/**
 * Like {@link hideElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
exports.hideElementNow = hideElementNow;
const hideElement = (element, delay = 0) => transitionElement(element, MC.PREFIX_SHOW, MC.PREFIX_HIDE, delay);

/**
 * If {@link isElementUndisplayed}, it will {@link displayElementNow},
 * otherwise it will {@link undisplayElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category CSS: Altering
 */
exports.hideElement = hideElement;
const toggleDisplayElementNow = element => isElementUndisplayed(element) ? displayElementNow(element) : undisplayElementNow(element);

/**
 * Like {@link toggleDisplayElementNow} except it will {@link waitForMutateTime},
 * and optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
exports.toggleDisplayElementNow = toggleDisplayElementNow;
const toggleDisplayElement = (element, delay = 0) => isElementUndisplayed(element) ? displayElement(element, delay) : undisplayElement(element, delay);

/**
 * If {@link isElementHidden}, it will {@link showElementNow}, otherwise
 * {@link hideElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category CSS: Altering
 */
exports.toggleDisplayElement = toggleDisplayElement;
const toggleShowElementNow = element => isElementHidden(element) ? showElementNow(element) : hideElementNow(element);

/**
 * Like {@link toggleShowElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
exports.toggleShowElementNow = toggleShowElementNow;
const toggleShowElement = (element, delay = 0) => isElementHidden(element) ? showElement(element, delay) : hideElement(element, delay);

/**
 * Returns true if the element's class list contains `lisn-hide`.
 *
 * @category CSS: Altering (optimized)
 */
exports.toggleShowElement = toggleShowElement;
const isElementHidden = element => hasClass(element, MC.PREFIX_HIDE);

/**
 * Returns true if the element's class list contains `lisn-undisplay`.
 *
 * @category CSS: Altering (optimized)
 */
exports.isElementHidden = isElementHidden;
const isElementUndisplayed = element => hasClass(element, MC.PREFIX_UNDISPLAY);

/**
 * Returns true if the element's class list contains the given class.
 *
 * @category CSS: Altering (optimized)
 */
exports.isElementUndisplayed = isElementUndisplayed;
const hasClass = (element, className) => MH.classList(element).contains(className);

/**
 * Returns true if the element's class list contains all of the given classes.
 *
 * @since v1.2.0
 *
 * @category CSS: Altering (optimized)
 */
exports.hasClass = hasClass;
const hasAllClasses = (element, ...classNames) => MH.lengthOf(classNames) > 0 && !MH.some(classNames, className => !hasClass(element, className));

/**
 * Returns true if the element's class list contains any of the given classes.
 *
 * @since v1.2.0
 *
 * @category CSS: Altering (optimized)
 */
exports.hasAllClasses = hasAllClasses;
const hasAnyClass = (element, ...classNames) => MH.some(classNames, className => hasClass(element, className));

/**
 * Adds the given classes to the element.
 *
 * @category CSS: Altering
 */
exports.hasAnyClass = hasAnyClass;
const addClassesNow = (element, ...classNames) => MH.classList(element).add(...classNames);

/**
 * Like {@link addClassesNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
exports.addClassesNow = addClassesNow;
const addClasses = exports.addClasses = (0, _domOptimize.asyncMutatorFor)(addClassesNow);

/**
 * Removes the given classes to the element.
 *
 * @category CSS: Altering
 */
const removeClassesNow = (element, ...classNames) => MH.classList(element).remove(...classNames);

/**
 * Like {@link removeClassesNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
exports.removeClassesNow = removeClassesNow;
const removeClasses = exports.removeClasses = (0, _domOptimize.asyncMutatorFor)(removeClassesNow);

/**
 * Toggles the given class on the element.
 *
 * @param force See {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle | DOMTokenList:toggle}
 *
 * @category CSS: Altering
 */
const toggleClassNow = (element, className, force) => MH.classList(element).toggle(className, force);

/**
 * Like {@link toggleClassNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
exports.toggleClassNow = toggleClassNow;
const toggleClass = exports.toggleClass = (0, _domOptimize.asyncMutatorFor)(toggleClassNow);

/**
 * Toggles the given classes on the element. This function does not accept the
 * `force` parameter.
 *
 * @since v1.2.0
 *
 * @category CSS: Altering
 */
const toggleClassesNow = (element, ...classNames) => {
  for (const cls of classNames) {
    toggleClassNow(element, cls);
  }
};

/**
 * Like {@link toggleClassesNow} except it will {@link waitForMutateTime}.
 *
 * @since v1.2.0
 *
 * @category CSS: Altering (optimized)
 */
exports.toggleClassesNow = toggleClassesNow;
const toggleClasses = exports.toggleClasses = (0, _domOptimize.asyncMutatorFor)(toggleClassesNow);

/**
 * Replaces the given class on the element with a new one.
 *
 * @param force See {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/replace | DOMTokenList:replace}
 *
 * @since v1.2.0
 *
 * @category CSS: Altering
 */
const replaceClassNow = (element, oldClassName, newClassName) => MH.classList(element).replace(oldClassName, newClassName);

/**
 * Like {@link replaceClassNow} except it will {@link waitForMutateTime}.
 *
 * @since v1.2.0
 *
 * @category CSS: Altering (optimized)
 */
exports.replaceClassNow = replaceClassNow;
const replaceClass = exports.replaceClass = (0, _domOptimize.asyncMutatorFor)(replaceClassNow);

// For *Data: to avoid unnecessary type checking that ensures element is
// HTMLElement or SVGElement, use getAttribute instead of dataset.

/**
 * Returns the value of the given data attribute. The name of the attribute
 * must _not_ start with `data`. It can be in either camelCase or kebab-case,
 * it is converted as needed.
 *
 * @category CSS: Altering (optimized)
 */
const getData = (element, name) => MH.getAttr(element, MH.prefixData(name));

/**
 * Returns the value of the given data attribute as a boolean. Its value is
 * expected to be either blank or "true" (which result in `true`), or "false"
 * (which results in `false`).
 *
 * The name of the attribute must _not_ start with `data`. It can be in either
 * camelCase or kebab-case, it is converted as needed.
 *
 * @since v1.2.0
 *
 * @category CSS: Altering (optimized)
 */
exports.getData = getData;
const getBooleanData = (element, name) => {
  const value = getData(element, name);
  return value !== null && value !== "false";
};

/**
 * @ignore
 * @deprecated
 */
exports.getBooleanData = getBooleanData;
const getBoolData = exports.getBoolData = getBooleanData;

/**
 * Sets the given data attribute.
 *
 * The name of the attribute must _not_ start with `data`. It can be in either
 * camelCase or kebab-case, it is converted as needed.
 *
 * @category CSS: Altering
 */
const setDataNow = (element, name, value) => MH.setAttr(element, MH.prefixData(name), value);

/**
 * Like {@link setDataNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
exports.setDataNow = setDataNow;
const setData = exports.setData = (0, _domOptimize.asyncMutatorFor)(setDataNow);

/**
 * Sets the given data attribute with value "true" (default) or "false".
 *
 * The name of the attribute must _not_ start with `data`. It can be in either
 * camelCase or kebab-case, it is converted as needed.
 *
 * @since v1.2.0
 *
 * @category CSS: Altering
 */
const setBooleanDataNow = (element, name, value = true) => MH.setAttr(element, MH.prefixData(name), value + "");

/**
 * @ignore
 * @deprecated
 */
exports.setBooleanDataNow = setBooleanDataNow;
const setBoolDataNow = exports.setBoolDataNow = setBooleanDataNow;

/**
 * Like {@link setBooleanDataNow} except it will {@link waitForMutateTime}.
 *
 * @since v1.2.0
 *
 * @category CSS: Altering (optimized)
 */
const setBooleanData = exports.setBooleanData = (0, _domOptimize.asyncMutatorFor)(setBooleanDataNow);

/**
 * @ignore
 * @deprecated
 */
const setBoolData = exports.setBoolData = setBooleanData;

/**
 * Sets the given data attribute with value "false".
 *
 * The name of the attribute must _not_ start with `data`. It can be in either
 * camelCase or kebab-case, it is converted as needed.
 *
 * @since v1.2.0
 *
 * @category CSS: Altering
 */
const unsetBooleanDataNow = (element, name) => MH.unsetAttr(element, MH.prefixData(name));

/**
 * @ignore
 * @deprecated
 */
exports.unsetBooleanDataNow = unsetBooleanDataNow;
const unsetBoolDataNow = exports.unsetBoolDataNow = unsetBooleanDataNow;

/**
 * Like {@link unsetBooleanDataNow} except it will {@link waitForMutateTime}.
 *
 * @since v1.2.0
 *
 * @category CSS: Altering (optimized)
 */
const unsetBooleanData = exports.unsetBooleanData = (0, _domOptimize.asyncMutatorFor)(unsetBooleanDataNow);

/**
 * @ignore
 * @deprecated
 */
const unsetBoolData = exports.unsetBoolData = unsetBooleanData;

/**
 * Deletes the given data attribute.
 *
 * The name of the attribute must _not_ start with `data`. It can be in either
 * camelCase or kebab-case, it is converted as needed.
 *
 * @category CSS: Altering
 */
const delDataNow = (element, name) => MH.delAttr(element, MH.prefixData(name));

/**
 * Like {@link delDataNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
exports.delDataNow = delDataNow;
const delData = exports.delData = (0, _domOptimize.asyncMutatorFor)(delDataNow);

/**
 * Returns the value of the given property from the computed style of the
 * element.
 *
 * @category DOM: Altering
 */
const getComputedStylePropNow = (element, prop) => getComputedStyle(element).getPropertyValue(prop);

/**
 * Like {@link getComputedStylePropNow} except it will {@link waitForMeasureTime}.
 *
 * @category DOM: Altering (optimized)
 */
exports.getComputedStylePropNow = getComputedStylePropNow;
const getComputedStyleProp = exports.getComputedStyleProp = (0, _domOptimize.asyncMeasurerFor)(getComputedStylePropNow);

/**
 * Returns the value of the given property from the inline style of the
 * element.
 *
 * @category DOM: Altering
 */
const getStylePropNow = (element, prop) => {
  var _style;
  return (_style = element.style) === null || _style === void 0 ? void 0 : _style.getPropertyValue(prop);
};

/**
 * Like {@link getStylePropNow} except it will {@link waitForMeasureTime}.
 *
 * @category DOM: Altering (optimized)
 */
exports.getStylePropNow = getStylePropNow;
const getStyleProp = exports.getStyleProp = (0, _domOptimize.asyncMeasurerFor)(getStylePropNow);

/**
 * Sets the given property on the inline style of the element.
 *
 * @category DOM: Altering
 */
const setStylePropNow = (element, prop, value) => {
  var _style2;
  return (_style2 = element.style) === null || _style2 === void 0 ? void 0 : _style2.setProperty(prop, value);
};

/**
 * Like {@link setStylePropNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
exports.setStylePropNow = setStylePropNow;
const setStyleProp = exports.setStyleProp = (0, _domOptimize.asyncMutatorFor)(setStylePropNow);

/**
 * Deletes the given property on the inline style of the element.
 *
 * @category DOM: Altering
 */
const delStylePropNow = (element, prop) => {
  var _style3;
  return (_style3 = element.style) === null || _style3 === void 0 ? void 0 : _style3.removeProperty(prop);
};

/**
 * Like {@link delStylePropNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
exports.delStylePropNow = delStylePropNow;
const delStyleProp = exports.delStyleProp = (0, _domOptimize.asyncMutatorFor)(delStylePropNow);

/**
 * Returns the flex direction of the given element **if it has a flex layout**.
 *
 * @returns `null` if the element does not have a flex layout.
 *
 * @since v1.2.0
 */
const getFlexDirection = async element => {
  const displayStyle = await getComputedStyleProp(element, "display");
  if (!displayStyle.includes("flex")) {
    return null;
  }
  return await getComputedStyleProp(element, "flex-direction");
};

/**
 * Returns the flex direction of the given element's parent **if it has a flex
 * layout**.
 *
 * @returns `null` if the element's parent does not have a flex layout.
 *
 * @since v1.2.0
 */
exports.getFlexDirection = getFlexDirection;
const getParentFlexDirection = async element => {
  const parent = MH.parentOf(element);
  return parent ? getFlexDirection(parent) : null;
};

/**
 * Returns true if the given element has a flex layout. If direction is given,
 * then it also needs to match.
 *
 * @since v1.2.0
 */
exports.getParentFlexDirection = getParentFlexDirection;
const isFlex = async (element, direction) => {
  const flexDirection = await getFlexDirection(element);
  if (direction) {
    return direction === flexDirection;
  }
  return flexDirection !== null;
};

/**
 * Returns true if the given element's parent has a flex layout. If direction is
 * given, then it also needs to match.
 *
 * @since v1.2.0
 */
exports.isFlex = isFlex;
const isFlexChild = async (element, direction) => {
  const parent = MH.parentOf(element);
  return parent ? isFlex(parent, direction) : false;
};

/**
 * In milliseconds.
 *
 * @ignore
 * @internal
 */
exports.isFlexChild = isFlexChild;
const getMaxTransitionDuration = async element => {
  const propVal = await getComputedStyleProp(element, "transition-duration");
  return MH.max(...(0, _text.splitOn)(propVal, ",", true).map(strValue => {
    let duration = MH.parseFloat(strValue) || 0;
    if (strValue === duration + "s") {
      duration *= 1000;
    }
    return duration;
  }));
};

/**
 * @ignore
 * @internal
 */
exports.getMaxTransitionDuration = getMaxTransitionDuration;
const disableInitialTransition = async (element, delay = 0) => {
  await addClasses(element, MC.PREFIX_TRANSITION_DISABLE);
  if (delay) {
    await (0, _tasks.waitForDelay)(delay);
  }
  await (0, _domOptimize.waitForSubsequentMutateTime)();
  removeClassesNow(element, MC.PREFIX_TRANSITION_DISABLE);
};

/**
 * @ignore
 * @internal
 */
exports.disableInitialTransition = disableInitialTransition;
const setHasModal = () => setBooleanData(MH.getBody(), PREFIX_HAS_MODAL);

/**
 * @ignore
 * @internal
 */
exports.setHasModal = setHasModal;
const delHasModal = () => delData(MH.getBody(), PREFIX_HAS_MODAL);

/**
 * @ignore
 * @internal
 */
exports.delHasModal = delHasModal;
const copyStyle = async (fromElement, toElement, includeComputedProps) => {
  if (!(0, _domQuery.isDOMElement)(fromElement) || !(0, _domQuery.isDOMElement)(toElement)) {
    return;
  }
  await (0, _domOptimize.waitForMeasureTime)();
  const props = {};
  if (includeComputedProps) {
    for (const prop of includeComputedProps) {
      props[prop] = getComputedStylePropNow(fromElement, prop);
    }
  }
  const style = fromElement.style; // only inline styles
  for (const prop in style) {
    const value = style.getPropertyValue(prop);
    if (value) {
      props[prop] = value;
    }
  }
  for (const prop in props) {
    setStyleProp(toElement, prop, props[prop]);
  }
  addClasses(toElement, ...MH.classList(fromElement));
};

/**
 * If the props keys are in camelCase they are converted to kebab-case
 *
 * If a value is null or undefined, the property is deleted.
 *
 * @ignore
 * @internal
 */
exports.copyStyle = copyStyle;
const setNumericStyleJsVarsNow = (element, props, options = {}) => {
  var _options$_prefix;
  if (!(0, _domQuery.isDOMElement)(element)) {
    return;
  }
  const varPrefix = MH.prefixCssJsVar((_options$_prefix = options === null || options === void 0 ? void 0 : options._prefix) !== null && _options$_prefix !== void 0 ? _options$_prefix : "");
  for (const prop in props) {
    const cssPropSuffix = (0, _text.camelToKebabCase)(prop);
    const varName = `${varPrefix}${cssPropSuffix}`;
    let value;
    if (!(0, _math.isValidNum)(props[prop])) {
      value = null;
    } else {
      var _options$_numDecimal;
      value = props[prop];
      const thisNumDecimal = (_options$_numDecimal = options === null || options === void 0 ? void 0 : options._numDecimal) !== null && _options$_numDecimal !== void 0 ? _options$_numDecimal : value > 0 && value < 1 ? 2 : 0;
      value = (0, _math.roundNumTo)(value, thisNumDecimal);
    }
    if (value === null) {
      delStylePropNow(element, varName);
    } else {
      var _options$_units;
      setStylePropNow(element, varName, value + ((_options$_units = options === null || options === void 0 ? void 0 : options._units) !== null && _options$_units !== void 0 ? _options$_units : ""));
    }
  }
};

/**
 * @ignore
 * @internal
 */
exports.setNumericStyleJsVarsNow = setNumericStyleJsVarsNow;
const setNumericStyleJsVars = exports.setNumericStyleJsVars = (0, _domOptimize.asyncMutatorFor)(setNumericStyleJsVarsNow);

// ----------------------------------------

const PREFIX_HAS_MODAL = MH.prefixName("has-modal");
const scheduledCSSTransitions = MH.newWeakMap();
const cancelCSSTransitions = (element, ...toClasses) => {
  const scheduledTransitions = scheduledCSSTransitions.get(element);
  if (!scheduledTransitions) {
    return;
  }
  for (const toCls of toClasses) {
    const scheduledTransition = scheduledTransitions[toCls];
    if (scheduledTransition) {
      scheduledTransition._cancel();
    }
  }
};
const scheduleCSSTransition = (element, toCls) => {
  let scheduledTransitions = scheduledCSSTransitions.get(element);
  if (!scheduledTransitions) {
    scheduledTransitions = {};
    scheduledCSSTransitions.set(element, scheduledTransitions);
  }
  let isCancelled = false;
  scheduledTransitions[toCls] = {
    _cancel: () => {
      isCancelled = true;
      MH.deleteObjKey(scheduledTransitions, toCls);
    },
    _finish: () => {
      MH.deleteObjKey(scheduledTransitions, toCls);
    },
    _isCancelled: () => {
      return isCancelled;
    }
  };
  return scheduledTransitions[toCls];
};
//# sourceMappingURL=css-alter.cjs.map