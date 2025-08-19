/**
 * @module Utils
 *
 * @categoryDescription DOM: Querying
 * These functions query the style, attributes or other aspects of elements, but
 * could lead to forced layout if not scheduled using {@link waitForMeasureTime}.
 *
 * @categoryDescription DOM: Querying (optimized)
 * These functions query the style, attributes or other aspects of elements in
 * an optimized way. Functions that could cause a forced layout use
 * {@link waitForMeasureTime} and so are asynchronous. Functions that can
 * perform the check without forcing a re-layout are synchronous.
 *
 * @categoryDescription Style: Altering
 * These functions transition an element from one CSS class to another, but
 * could lead to forced layout if not scheduled using {@link waitForMutateTime}.
 * If a delay is supplied, then the transition is "scheduled" and if the
 * opposite transition is executed before the scheduled one, the original one
 * is cancelled. See {@link transitionElement} for an example.
 *
 * @categoryDescription Style: Altering (optimized)
 * These functions transition an element from one CSS class to another in an
 * optimized way using {@link waitForMutateTime} and so are asynchronous.
 * If a delay is supplied, then the transition is "scheduled" and if the
 * opposite transition is executed before the scheduled one, the original one
 * is cancelled. See {@link transitionElement} for an example.
 */

import * as _ from "@lisn/_internal";

import { DOMElement, FlexDirection } from "@lisn/globals/types";

import {
  waitForMeasureTime,
  waitForMutateTime,
  asyncMeasurerFor,
  asyncMutatorFor,
  waitForSubsequentMutateTime,
} from "@lisn/utils/dom-optimize";
import { isDOMElement } from "@lisn/utils/dom-query";
import { isValidNum, roundNumTo } from "@lisn/utils/math";
import { waitForDelay } from "@lisn/utils/tasks";
import { camelToKebabCase, splitOn } from "@lisn/utils/text";

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
 * @category Style: Altering
 */
export const transitionElementNow = (
  element: Element,
  fromCls: string,
  toCls: string,
) => {
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
 * @category Style: Altering (optimized)
 */
export const transitionElement = async (
  element: Element,
  fromCls: string,
  toCls: string,
  delay = 0,
) => {
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
 * @category Style: Altering
 */
export const displayElementNow = (element: Element) =>
  transitionElementNow(element, _.PREFIX_UNDISPLAY, _.PREFIX_DISPLAY);

/**
 * Like {@link displayElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category Style: Altering (optimized)
 */
export const displayElement = (element: Element, delay = 0) =>
  transitionElement(element, _.PREFIX_UNDISPLAY, _.PREFIX_DISPLAY, delay);

/**
 * The opposite of {@link displayElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category Style: Altering
 */
export const undisplayElementNow = (element: Element) =>
  transitionElementNow(element, _.PREFIX_DISPLAY, _.PREFIX_UNDISPLAY);

/**
 * Like {@link undisplayElementNow} except it will {@link waitForMutateTime},
 * and optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category Style: Altering (optimized)
 */
export const undisplayElement = (element: Element, delay = 0) =>
  transitionElement(element, _.PREFIX_DISPLAY, _.PREFIX_UNDISPLAY, delay);

/**
 * Transitions an element from class `lisn-hide` (which makes the element
 * hidden) to `lisn-show` (which shows it). These classes have CSS
 * transitions applied so the element is faded into and out of view.
 *
 * @see {@link transitionElementNow}.
 *
 * @category Style: Altering
 */
export const showElementNow = (element: Element) =>
  transitionElementNow(element, _.PREFIX_HIDE, _.PREFIX_SHOW);

/**
 * Like {@link showElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category Style: Altering (optimized)
 */
export const showElement = (element: Element, delay = 0) =>
  transitionElement(element, _.PREFIX_HIDE, _.PREFIX_SHOW, delay);

/**
 * The opposite of {@link showElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category Style: Altering
 */
export const hideElementNow = (element: Element) =>
  transitionElementNow(element, _.PREFIX_SHOW, _.PREFIX_HIDE);

/**
 * Like {@link hideElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category Style: Altering (optimized)
 */
export const hideElement = (element: Element, delay = 0) =>
  transitionElement(element, _.PREFIX_SHOW, _.PREFIX_HIDE, delay);

/**
 * If {@link isElementUndisplayed}, it will {@link displayElementNow},
 * otherwise it will {@link undisplayElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category Style: Altering
 */
export const toggleDisplayElementNow = (element: Element) =>
  isElementUndisplayed(element)
    ? displayElementNow(element)
    : undisplayElementNow(element);

/**
 * Like {@link toggleDisplayElementNow} except it will {@link waitForMutateTime},
 * and optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category Style: Altering (optimized)
 */
export const toggleDisplayElement = (element: Element, delay = 0) =>
  isElementUndisplayed(element)
    ? displayElement(element, delay)
    : undisplayElement(element, delay);

/**
 * If {@link isElementHidden}, it will {@link showElementNow}, otherwise
 * {@link hideElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category Style: Altering
 */
export const toggleShowElementNow = (element: Element) =>
  isElementHidden(element) ? showElementNow(element) : hideElementNow(element);

/**
 * Like {@link toggleShowElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category Style: Altering (optimized)
 */
export const toggleShowElement = (element: Element, delay = 0) =>
  isElementHidden(element)
    ? showElement(element, delay)
    : hideElement(element, delay);

/**
 * Returns true if the element's class list contains `lisn-hide`.
 *
 * @category DOM: Querying (optimized)
 */
export const isElementHidden = (element: Element) =>
  hasClass(element, _.PREFIX_HIDE);

/**
 * Returns true if the element's class list contains `lisn-undisplay`.
 *
 * @category DOM: Querying (optimized)
 */
export const isElementUndisplayed = (element: Element) =>
  hasClass(element, _.PREFIX_UNDISPLAY);

/**
 * Returns true if the element's class list contains the given class.
 *
 * @category DOM: Querying (optimized)
 */
export const hasClass = (element: Element, className: string) =>
  _.classList(element).contains(className);

/**
 * Returns true if the element's class list contains all of the given classes.
 *
 * @since v1.2.0
 *
 * @category DOM: Querying (optimized)
 */
export const hasAllClasses = (element: Element, ...classNames: string[]) =>
  _.lengthOf(classNames) > 0 &&
  !_.some(classNames, (className) => !hasClass(element, className));

/**
 * Returns true if the element's class list contains any of the given classes.
 *
 * @since v1.2.0
 *
 * @category DOM: Querying (optimized)
 */
export const hasAnyClass = (element: Element, ...classNames: string[]) =>
  _.some(classNames, (className) => hasClass(element, className));

/**
 * Adds the given classes to the element.
 *
 * @category Style: Altering
 */
export const addClassesNow = (element: Element, ...classNames: string[]) =>
  _.classList(element).add(...classNames);

/**
 * Like {@link addClassesNow} except it will {@link waitForMutateTime}.
 *
 * @category Style: Altering (optimized)
 */
export const addClasses = asyncMutatorFor(addClassesNow);

/**
 * Removes the given classes to the element.
 *
 * @category Style: Altering
 */
export const removeClassesNow = (element: Element, ...classNames: string[]) =>
  _.remove(_.classList(element), ...classNames);

/**
 * Like {@link removeClassesNow} except it will {@link waitForMutateTime}.
 *
 * @category Style: Altering (optimized)
 */
export const removeClasses = asyncMutatorFor(removeClassesNow);

/**
 * Toggles the given class on the element.
 *
 * @param force See {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle | DOMTokenList:toggle}
 *
 * @category Style: Altering
 */
export const toggleClassNow = (
  element: Element,
  className: string,
  force?: boolean,
) => _.classList(element).toggle(className, force);

/**
 * Like {@link toggleClassNow} except it will {@link waitForMutateTime}.
 *
 * @category Style: Altering (optimized)
 */
export const toggleClass = asyncMutatorFor(toggleClassNow);

/**
 * Toggles the given classes on the element. This function does not accept the
 * `force` parameter.
 *
 * @since v1.2.0
 *
 * @category Style: Altering
 */
export const toggleClassesNow = (element: Element, ...classNames: string[]) => {
  for (const cls of classNames) {
    toggleClassNow(element, cls);
  }
};

/**
 * Like {@link toggleClassesNow} except it will {@link waitForMutateTime}.
 *
 * @since v1.2.0
 *
 * @category Style: Altering (optimized)
 */
export const toggleClasses = asyncMutatorFor(toggleClassesNow);

/**
 * Replaces the given class on the element with a new one.
 *
 * @since v1.2.0
 *
 * @category Style: Altering
 */
export const replaceClassNow = (
  element: Element,
  oldClassName: string,
  newClassName: string,
) => _.classList(element).replace(oldClassName, newClassName);

/**
 * Like {@link replaceClassNow} except it will {@link waitForMutateTime}.
 *
 * @since v1.2.0
 *
 * @category Style: Altering (optimized)
 */
export const replaceClass = asyncMutatorFor(replaceClassNow);

// For *Data: to avoid unnecessary type checking that ensures element is
// HTMLElement or SVGElement, use getAttribute instead of dataset.

/**
 * Returns the value of the given data attribute. The name of the attribute
 * must _not_ start with `data`. It can be in either camelCase or kebab-case,
 * it is converted as needed.
 *
 * @category DOM: Querying (optimized)
 */
export const getData = (element: Element, name: string) =>
  _.getAttr(element, _.toDataAttrName(name));

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
 * @category DOM: Querying (optimized)
 */
export const getBooleanData = (element: Element, name: string) => {
  const value = getData(element, name);
  return !_.isNull(value) && value !== "false";
};

/**
 * @ignore
 * @deprecated
 *
 * Deprecated alias for {@link getBooleanData}
 */
export const getBoolData = getBooleanData;

/**
 * Sets the given data attribute.
 *
 * The name of the attribute must _not_ start with `data`. It can be in either
 * camelCase or kebab-case, it is converted as needed.
 *
 * @category Style: Altering
 */
export const setDataNow = (element: Element, name: string, value: string) =>
  _.setAttr(element, _.toDataAttrName(name), value);

/**
 * Like {@link setDataNow} except it will {@link waitForMutateTime}.
 *
 * @category Style: Altering (optimized)
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
 * @category Style: Altering
 */
export const setBooleanDataNow = (
  element: Element,
  name: string,
  value = true,
) => _.setAttr(element, _.toDataAttrName(name), value + "");

/**
 * @ignore
 * @deprecated
 *
 * Deprecated alias for {@link setBooleanData}
 */
export const setBoolDataNow = setBooleanDataNow;

/**
 * Like {@link setBooleanDataNow} except it will {@link waitForMutateTime}.
 *
 * @since v1.2.0
 *
 * @category Style: Altering (optimized)
 */
export const setBooleanData = asyncMutatorFor(setBooleanDataNow);

/**
 * @ignore
 * @deprecated
 *
 * Deprecated alias for {@link setBoolean}
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
 * @category Style: Altering
 */
export const unsetBooleanDataNow = (element: Element, name: string) =>
  _.unsetAttr(element, _.toDataAttrName(name));

/**
 * @ignore
 * @deprecated
 *
 * Deprecated alias for {@link unsetBooleanNow}
 */
export const unsetBoolDataNow = unsetBooleanDataNow;

/**
 * Like {@link unsetBooleanDataNow} except it will {@link waitForMutateTime}.
 *
 * @since v1.2.0
 *
 * @category Style: Altering (optimized)
 */
export const unsetBooleanData = asyncMutatorFor(unsetBooleanDataNow);

/**
 * @ignore
 * @deprecated
 *
 * Deprecated alias for {@link unsetBoolean}
 */
export const unsetBoolData = unsetBooleanData;

/**
 * Deletes the given data attribute.
 *
 * The name of the attribute must _not_ start with `data`. It can be in either
 * camelCase or kebab-case, it is converted as needed.
 *
 * @category Style: Altering
 */
export const delDataNow = (element: Element, name: string) =>
  _.delAttr(element, _.toDataAttrName(name));

/**
 * Like {@link delDataNow} except it will {@link waitForMutateTime}.
 *
 * @category Style: Altering (optimized)
 */
export const delData = asyncMutatorFor(delDataNow);

/**
 * Returns the value of the given property from the computed style of the
 * element.
 *
 * @category DOM: Querying
 */
export const getComputedStylePropNow = (element: Element, prop: string) =>
  getComputedStyle(element).getPropertyValue(prop);

/**
 * Like {@link getComputedStylePropNow} except it will {@link waitForMeasureTime}.
 *
 * @category DOM: Querying (optimized)
 */
export const getComputedStyleProp = asyncMeasurerFor(getComputedStylePropNow);

/**
 * Returns the value of the given property from the inline style of the
 * element.
 *
 * @category DOM: Querying
 */
export const getStylePropNow = (element: Element, prop: string) =>
  (element as DOMElement).style?.getPropertyValue(prop);

/**
 * Like {@link getStylePropNow} except it will {@link waitForMeasureTime}.
 *
 * @category DOM: Querying (optimized)
 */
export const getStyleProp = asyncMeasurerFor(getStylePropNow);

/**
 * Sets the given property on the inline style of the element.
 *
 * @category DOM: Altering
 */
export const setStylePropNow = (
  element: Element,
  prop: string,
  value: string,
) => (element as DOMElement).style?.setProperty(prop, value);

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
export const delStylePropNow = (element: Element, prop: string) =>
  (element as DOMElement).style?.removeProperty(prop);

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
 *
 * @category DOM: Querying (optimized)
 */
export const getFlexDirection = async (
  element: Element,
): Promise<FlexDirection | null> => {
  const displayStyle = await getComputedStyleProp(element, "display");
  if (!displayStyle.includes("flex")) {
    return null;
  }

  return (await getComputedStyleProp(
    element,
    "flex-direction",
  )) as FlexDirection;
};

/**
 * Returns the flex direction of the given element's parent **if it has a flex
 * layout**.
 *
 * @returns `null` if the element's parent does not have a flex layout.
 *
 * @since v1.2.0
 *
 * @category DOM: Querying (optimized)
 */
export const getParentFlexDirection = async (
  element: Element,
): Promise<FlexDirection | null> => {
  const parent = _.parentOf(element);
  return parent ? getFlexDirection(parent) : null;
};

/**
 * Returns true if the given element has a flex layout. If direction is given,
 * then it also needs to match.
 *
 * @since v1.2.0
 *
 * @category DOM: Querying (optimized)
 */
export const isFlex = async (element: Element, direction?: FlexDirection) => {
  const flexDirection = await getFlexDirection(element);

  if (direction) {
    return direction === flexDirection;
  }

  return !_.isNull(flexDirection);
};

/**
 * Returns true if the given element's parent has a flex layout. If direction is
 * given, then it also needs to match.
 *
 * @since v1.2.0
 *
 * @category DOM: Querying (optimized)
 */
export const isFlexChild = async (
  element: Element,
  direction?: FlexDirection,
) => {
  const parent = _.parentOf(element);
  return parent ? isFlex(parent, direction) : false;
};

/**
 * In milliseconds.
 *
 * @ignore
 * @internal
 */
export const getMaxTransitionDuration = async (element: Element) => {
  const propVal = await getComputedStyleProp(element, "transition-duration");

  return _.max(
    ...splitOn(propVal, ",", true).map((strValue) => {
      let duration = _.parseFloat(strValue) || 0;

      if (strValue === duration + "s") {
        duration *= 1000;
      }

      return duration;
    }),
  );
};

/**
 * @ignore
 * @internal
 */
export const disableInitialTransition = async (element: Element, delay = 0) => {
  await addClasses(element, _.PREFIX_TRANSITION_DISABLE);
  if (delay) {
    await waitForDelay(delay);
  }

  await waitForSubsequentMutateTime();
  removeClassesNow(element, _.PREFIX_TRANSITION_DISABLE);
};

/**
 * @ignore
 * @internal
 */
export const setHasModal = () => setBooleanData(_.getBody(), PREFIX_HAS_MODAL);

/**
 * @ignore
 * @internal
 */
export const delHasModal = () => delData(_.getBody(), PREFIX_HAS_MODAL);

/**
 * @ignore
 * @internal
 */
export const copyStyle = async (
  fromElement: Element,
  toElement: Element,
  includeComputedProps?: string[],
) => {
  if (!isDOMElement(fromElement) || !isDOMElement(toElement)) {
    return;
  }

  await waitForMeasureTime();
  const props: Record<string, string> = {};

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

  addClasses(toElement, ..._.classList(fromElement));
};

/**
 * If the props keys are in camelCase they are converted to kebab-case
 *
 * If a value is null or undefined, the property is deleted.
 *
 * @ignore
 * @internal
 */
export const setNumericStyleJsVarsNow = (
  element: Element,
  props: CssNumericProps,
  options: {
    _prefix?: string;
    _units?: string;
    _numDecimal?: number;
  } = {},
) => {
  if (!isDOMElement(element)) {
    return;
  }

  const varPrefix = _.prefixCssJsVar(options?._prefix ?? "");
  for (const prop in props) {
    const cssPropSuffix = camelToKebabCase(prop);
    const varName = `${varPrefix}${cssPropSuffix}`;

    let value: number | null;

    if (!isValidNum(props[prop])) {
      value = null;
    } else {
      value = props[prop];
      const thisNumDecimal =
        options?._numDecimal ?? (value > 0 && value < 1 ? 2 : 0);
      value = roundNumTo(value, thisNumDecimal);
    }

    if (_.isNull(value)) {
      delStylePropNow(element, varName);
    } else {
      setStylePropNow(element, varName, value + (options?._units ?? ""));
    }
  }
};

/**
 * @ignore
 * @internal
 */
export const setNumericStyleJsVars = asyncMutatorFor(setNumericStyleJsVarsNow);

// ----------------------------------------

type CssNumericProps = Record<string, number | undefined | null>;

type CSSTransition = {
  _cancel: () => void;
  _finish: () => void;
  _isCancelled: () => boolean;
};

const PREFIX_HAS_MODAL = _.prefixName("has-modal");

const scheduledCSSTransitions = _.newWeakMap<
  Element,
  Record<string, CSSTransition>
>();

const cancelCSSTransitions = (element: Element, ...toClasses: string[]) => {
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

const scheduleCSSTransition = (element: Element, toCls: string) => {
  let scheduledTransitions = scheduledCSSTransitions.get(element);
  if (!scheduledTransitions) {
    scheduledTransitions = {};
    scheduledCSSTransitions.set(element, scheduledTransitions);
  }

  let isCancelled = false;
  scheduledTransitions[toCls] = {
    _cancel: () => {
      isCancelled = true;
      _.deleteObjKey(scheduledTransitions, toCls);
    },
    _finish: () => {
      _.deleteObjKey(scheduledTransitions, toCls);
    },
    _isCancelled: () => {
      return isCancelled;
    },
  };

  return scheduledTransitions[toCls];
};
