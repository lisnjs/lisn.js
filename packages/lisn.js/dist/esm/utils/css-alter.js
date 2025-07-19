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

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { waitForMeasureTime, waitForMutateTime, asyncMeasurerFor, asyncMutatorFor, waitForSubsequentMutateTime } from "./dom-optimize.js";
import { isDOMElement } from "./dom-query.js";
import { isValidNum, roundNumTo } from "./math.js";
import { waitForDelay } from "./tasks.js";
import { camelToKebabCase, splitOn } from "./text.js";

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
export const transitionElementNow = (element, fromCls, toCls) => {
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
export const transitionElement = async (element, fromCls, toCls, delay = 0) => {
  const thisTransition = scheduleCSSTransition(element, toCls);
  if (delay) {
    await waitForDelay(delay);
  }
  await waitForMutateTime();
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
    await waitForDelay(transitionDuration);
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
export const displayElementNow = element => transitionElementNow(element, MC.PREFIX_UNDISPLAY, MC.PREFIX_DISPLAY);

/**
 * Like {@link displayElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export const displayElement = (element, delay = 0) => transitionElement(element, MC.PREFIX_UNDISPLAY, MC.PREFIX_DISPLAY, delay);

/**
 * The opposite of {@link displayElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category CSS: Altering
 */
export const undisplayElementNow = element => transitionElementNow(element, MC.PREFIX_DISPLAY, MC.PREFIX_UNDISPLAY);

/**
 * Like {@link undisplayElementNow} except it will {@link waitForMutateTime},
 * and optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export const undisplayElement = (element, delay = 0) => transitionElement(element, MC.PREFIX_DISPLAY, MC.PREFIX_UNDISPLAY, delay);

/**
 * Transitions an element from class `lisn-hide` (which makes the element
 * hidden) to `lisn-show` (which shows it). These classes have CSS
 * transitions applied so the element is faded into and out of view.
 *
 * @see {@link transitionElementNow}.
 *
 * @category CSS: Altering
 */
export const showElementNow = element => transitionElementNow(element, MC.PREFIX_HIDE, MC.PREFIX_SHOW);

/**
 * Like {@link showElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export const showElement = (element, delay = 0) => transitionElement(element, MC.PREFIX_HIDE, MC.PREFIX_SHOW, delay);

/**
 * The opposite of {@link showElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category CSS: Altering
 */
export const hideElementNow = element => transitionElementNow(element, MC.PREFIX_SHOW, MC.PREFIX_HIDE);

/**
 * Like {@link hideElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export const hideElement = (element, delay = 0) => transitionElement(element, MC.PREFIX_SHOW, MC.PREFIX_HIDE, delay);

/**
 * If {@link isElementUndisplayed}, it will {@link displayElementNow},
 * otherwise it will {@link undisplayElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category CSS: Altering
 */
export const toggleDisplayElementNow = element => isElementUndisplayed(element) ? displayElementNow(element) : undisplayElementNow(element);

/**
 * Like {@link toggleDisplayElementNow} except it will {@link waitForMutateTime},
 * and optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export const toggleDisplayElement = (element, delay = 0) => isElementUndisplayed(element) ? displayElement(element, delay) : undisplayElement(element, delay);

/**
 * If {@link isElementHidden}, it will {@link showElementNow}, otherwise
 * {@link hideElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category CSS: Altering
 */
export const toggleShowElementNow = element => isElementHidden(element) ? showElementNow(element) : hideElementNow(element);

/**
 * Like {@link toggleShowElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export const toggleShowElement = (element, delay = 0) => isElementHidden(element) ? showElement(element, delay) : hideElement(element, delay);

/**
 * Returns true if the element's class list contains `lisn-hide`.
 *
 * @category CSS: Altering (optimized)
 */
export const isElementHidden = element => hasClass(element, MC.PREFIX_HIDE);

/**
 * Returns true if the element's class list contains `lisn-undisplay`.
 *
 * @category CSS: Altering (optimized)
 */
export const isElementUndisplayed = element => hasClass(element, MC.PREFIX_UNDISPLAY);

/**
 * Returns true if the element's class list contains the given class.
 *
 * @category CSS: Altering (optimized)
 */
export const hasClass = (element, className) => MH.classList(element).contains(className);

/**
 * Returns true if the element's class list contains all of the given classes.
 *
 * @since v1.2.0
 *
 * @category CSS: Altering (optimized)
 */
export const hasAllClasses = (element, ...classNames) => MH.lengthOf(classNames) > 0 && !MH.some(classNames, className => !hasClass(element, className));

/**
 * Returns true if the element's class list contains any of the given classes.
 *
 * @since v1.2.0
 *
 * @category CSS: Altering (optimized)
 */
export const hasAnyClass = (element, ...classNames) => MH.some(classNames, className => hasClass(element, className));

/**
 * Adds the given classes to the element.
 *
 * @category CSS: Altering
 */
export const addClassesNow = (element, ...classNames) => MH.classList(element).add(...classNames);

/**
 * Like {@link addClassesNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export const addClasses = asyncMutatorFor(addClassesNow);

/**
 * Removes the given classes to the element.
 *
 * @category CSS: Altering
 */
export const removeClassesNow = (element, ...classNames) => MH.classList(element).remove(...classNames);

/**
 * Like {@link removeClassesNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export const removeClasses = asyncMutatorFor(removeClassesNow);

/**
 * Toggles the given class on the element.
 *
 * @param force See {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle | DOMTokenList:toggle}
 *
 * @category CSS: Altering
 */
export const toggleClassNow = (element, className, force) => MH.classList(element).toggle(className, force);

/**
 * Like {@link toggleClassNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export const toggleClass = asyncMutatorFor(toggleClassNow);

/**
 * Toggles the given classes on the element. This function does not accept the
 * `force` parameter.
 *
 * @since v1.2.0
 *
 * @category CSS: Altering
 */
export const toggleClassesNow = (element, ...classNames) => {
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
export const toggleClasses = asyncMutatorFor(toggleClassesNow);

/**
 * Replaces the given class on the element with a new one.
 *
 * @param force See {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/replace | DOMTokenList:replace}
 *
 * @since v1.2.0
 *
 * @category CSS: Altering
 */
export const replaceClassNow = (element, oldClassName, newClassName) => MH.classList(element).replace(oldClassName, newClassName);

/**
 * Like {@link replaceClassNow} except it will {@link waitForMutateTime}.
 *
 * @since v1.2.0
 *
 * @category CSS: Altering (optimized)
 */
export const replaceClass = asyncMutatorFor(replaceClassNow);

// For *Data: to avoid unnecessary type checking that ensures element is
// HTMLElement or SVGElement, use getAttribute instead of dataset.

/**
 * Returns the value of the given data attribute. The name of the attribute
 * must _not_ start with `data`. It can be in either camelCase or kebab-case,
 * it is converted as needed.
 *
 * @category CSS: Altering (optimized)
 */
export const getData = (element, name) => MH.getAttr(element, MH.prefixData(name));

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
export const getBooleanData = (element, name) => {
  const value = getData(element, name);
  return value !== null && value !== "false";
};

/**
 * @ignore
 * @deprecated
 */
export const getBoolData = getBooleanData;

/**
 * Sets the given data attribute.
 *
 * The name of the attribute must _not_ start with `data`. It can be in either
 * camelCase or kebab-case, it is converted as needed.
 *
 * @category CSS: Altering
 */
export const setDataNow = (element, name, value) => MH.setAttr(element, MH.prefixData(name), value);

/**
 * Like {@link setDataNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export const setData = asyncMutatorFor(setDataNow);

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
export const setBooleanDataNow = (element, name, value = true) => MH.setAttr(element, MH.prefixData(name), value + "");

/**
 * @ignore
 * @deprecated
 */
export const setBoolDataNow = setBooleanDataNow;

/**
 * Like {@link setBooleanDataNow} except it will {@link waitForMutateTime}.
 *
 * @since v1.2.0
 *
 * @category CSS: Altering (optimized)
 */
export const setBooleanData = asyncMutatorFor(setBooleanDataNow);

/**
 * @ignore
 * @deprecated
 */
export const setBoolData = setBooleanData;

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
export const unsetBooleanDataNow = (element, name) => MH.unsetAttr(element, MH.prefixData(name));

/**
 * @ignore
 * @deprecated
 */
export const unsetBoolDataNow = unsetBooleanDataNow;

/**
 * Like {@link unsetBooleanDataNow} except it will {@link waitForMutateTime}.
 *
 * @since v1.2.0
 *
 * @category CSS: Altering (optimized)
 */
export const unsetBooleanData = asyncMutatorFor(unsetBooleanDataNow);

/**
 * @ignore
 * @deprecated
 */
export const unsetBoolData = unsetBooleanData;

/**
 * Deletes the given data attribute.
 *
 * The name of the attribute must _not_ start with `data`. It can be in either
 * camelCase or kebab-case, it is converted as needed.
 *
 * @category CSS: Altering
 */
export const delDataNow = (element, name) => MH.delAttr(element, MH.prefixData(name));

/**
 * Like {@link delDataNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export const delData = asyncMutatorFor(delDataNow);

/**
 * Returns the value of the given property from the computed style of the
 * element.
 *
 * @category DOM: Altering
 */
export const getComputedStylePropNow = (element, prop) => getComputedStyle(element).getPropertyValue(prop);

/**
 * Like {@link getComputedStylePropNow} except it will {@link waitForMeasureTime}.
 *
 * @category DOM: Altering (optimized)
 */
export const getComputedStyleProp = asyncMeasurerFor(getComputedStylePropNow);

/**
 * Returns the value of the given property from the inline style of the
 * element.
 *
 * @category DOM: Altering
 */
export const getStylePropNow = (element, prop) => {
  var _style;
  return (_style = element.style) === null || _style === void 0 ? void 0 : _style.getPropertyValue(prop);
};

/**
 * Like {@link getStylePropNow} except it will {@link waitForMeasureTime}.
 *
 * @category DOM: Altering (optimized)
 */
export const getStyleProp = asyncMeasurerFor(getStylePropNow);

/**
 * Sets the given property on the inline style of the element.
 *
 * @category DOM: Altering
 */
export const setStylePropNow = (element, prop, value) => {
  var _style2;
  return (_style2 = element.style) === null || _style2 === void 0 ? void 0 : _style2.setProperty(prop, value);
};

/**
 * Like {@link setStylePropNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export const setStyleProp = asyncMutatorFor(setStylePropNow);

/**
 * Deletes the given property on the inline style of the element.
 *
 * @category DOM: Altering
 */
export const delStylePropNow = (element, prop) => {
  var _style3;
  return (_style3 = element.style) === null || _style3 === void 0 ? void 0 : _style3.removeProperty(prop);
};

/**
 * Like {@link delStylePropNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export const delStyleProp = asyncMutatorFor(delStylePropNow);

/**
 * Returns the flex direction of the given element **if it has a flex layout**.
 *
 * @returns `null` if the element does not have a flex layout.
 *
 * @since v1.2.0
 */
export const getFlexDirection = async element => {
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
export const getParentFlexDirection = async element => {
  const parent = MH.parentOf(element);
  return parent ? getFlexDirection(parent) : null;
};

/**
 * Returns true if the given element has a flex layout. If direction is given,
 * then it also needs to match.
 *
 * @since v1.2.0
 */
export const isFlex = async (element, direction) => {
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
export const isFlexChild = async (element, direction) => {
  const parent = MH.parentOf(element);
  return parent ? isFlex(parent, direction) : false;
};

/**
 * In milliseconds.
 *
 * @ignore
 * @internal
 */
export const getMaxTransitionDuration = async element => {
  const propVal = await getComputedStyleProp(element, "transition-duration");
  return MH.max(...splitOn(propVal, ",", true).map(strValue => {
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
export const disableInitialTransition = async (element, delay = 0) => {
  await addClasses(element, MC.PREFIX_TRANSITION_DISABLE);
  if (delay) {
    await waitForDelay(delay);
  }
  await waitForSubsequentMutateTime();
  removeClassesNow(element, MC.PREFIX_TRANSITION_DISABLE);
};

/**
 * @ignore
 * @internal
 */
export const setHasModal = () => setBooleanData(MH.getBody(), PREFIX_HAS_MODAL);

/**
 * @ignore
 * @internal
 */
export const delHasModal = () => delData(MH.getBody(), PREFIX_HAS_MODAL);

/**
 * @ignore
 * @internal
 */
export const copyStyle = async (fromElement, toElement, includeComputedProps) => {
  if (!isDOMElement(fromElement) || !isDOMElement(toElement)) {
    return;
  }
  await waitForMeasureTime();
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
export const setNumericStyleJsVarsNow = (element, props, options = {}) => {
  if (!isDOMElement(element)) {
    return;
  }
  const varPrefix = MH.prefixCssJsVar((options === null || options === void 0 ? void 0 : options._prefix) || "");
  for (const prop in props) {
    const cssPropSuffix = camelToKebabCase(prop);
    const varName = `${varPrefix}${cssPropSuffix}`;
    let value;
    if (!isValidNum(props[prop])) {
      value = null;
    } else {
      var _options$_numDecimal;
      value = props[prop];
      const thisNumDecimal = (_options$_numDecimal = options === null || options === void 0 ? void 0 : options._numDecimal) !== null && _options$_numDecimal !== void 0 ? _options$_numDecimal : value > 0 && value < 1 ? 2 : 0;
      value = roundNumTo(value, thisNumDecimal);
    }
    if (value === null) {
      delStylePropNow(element, varName);
    } else {
      setStylePropNow(element, varName, value + ((options === null || options === void 0 ? void 0 : options._units) || ""));
    }
  }
};

/**
 * @ignore
 * @internal
 */
export const setNumericStyleJsVars = asyncMutatorFor(setNumericStyleJsVarsNow);

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
//# sourceMappingURL=css-alter.js.map