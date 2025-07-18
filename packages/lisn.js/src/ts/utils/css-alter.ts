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

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { DOMElement, FlexDirection } from "@lisn/globals/types";

import {
  waitForMeasureTime,
  waitForMutateTime,
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
 * @category CSS: Altering
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
 * @category CSS: Altering (optimized)
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
 * @category CSS: Altering
 */
export const displayElementNow = (element: Element) =>
  transitionElementNow(element, MC.PREFIX_UNDISPLAY, MC.PREFIX_DISPLAY);

/**
 * Like {@link displayElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export const displayElement = (element: Element, delay = 0) =>
  transitionElement(element, MC.PREFIX_UNDISPLAY, MC.PREFIX_DISPLAY, delay);

/**
 * The opposite of {@link displayElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category CSS: Altering
 */
export const undisplayElementNow = (element: Element) =>
  transitionElementNow(element, MC.PREFIX_DISPLAY, MC.PREFIX_UNDISPLAY);

/**
 * Like {@link undisplayElementNow} except it will {@link waitForMutateTime},
 * and optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export const undisplayElement = (element: Element, delay = 0) =>
  transitionElement(element, MC.PREFIX_DISPLAY, MC.PREFIX_UNDISPLAY, delay);

/**
 * Transitions an element from class `lisn-hide` (which makes the element
 * hidden) to `lisn-show` (which shows it). These classes have CSS
 * transitions applied so the element is faded into and out of view.
 *
 * @see {@link transitionElementNow}.
 *
 * @category CSS: Altering
 */
export const showElementNow = (element: Element) =>
  transitionElementNow(element, MC.PREFIX_HIDE, MC.PREFIX_SHOW);

/**
 * Like {@link showElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export const showElement = (element: Element, delay = 0) =>
  transitionElement(element, MC.PREFIX_HIDE, MC.PREFIX_SHOW, delay);

/**
 * The opposite of {@link showElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category CSS: Altering
 */
export const hideElementNow = (element: Element) =>
  transitionElementNow(element, MC.PREFIX_SHOW, MC.PREFIX_HIDE);

/**
 * Like {@link hideElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export const hideElement = (element: Element, delay = 0) =>
  transitionElement(element, MC.PREFIX_SHOW, MC.PREFIX_HIDE, delay);

/**
 * If {@link isElementUndisplayed}, it will {@link displayElementNow},
 * otherwise it will {@link undisplayElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category CSS: Altering
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
 * @category CSS: Altering (optimized)
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
 * @category CSS: Altering
 */
export const toggleShowElementNow = (element: Element) =>
  isElementHidden(element) ? showElementNow(element) : hideElementNow(element);

/**
 * Like {@link toggleShowElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export const toggleShowElement = (element: Element, delay = 0) =>
  isElementHidden(element)
    ? showElement(element, delay)
    : hideElement(element, delay);

/**
 * Returns true if the element's class list contains `lisn-hide`.
 *
 * @category CSS: Altering (optimized)
 */
export const isElementHidden = (element: Element) =>
  hasClass(element, MC.PREFIX_HIDE);

/**
 * Returns true if the element's class list contains `lisn-undisplay`.
 *
 * @category CSS: Altering (optimized)
 */
export const isElementUndisplayed = (element: Element) =>
  hasClass(element, MC.PREFIX_UNDISPLAY);

/**
 * Returns true if the element's class list contains the given class.
 *
 * @category CSS: Altering (optimized)
 */
export const hasClass = (element: Element, className: string) =>
  MH.classList(element).contains(className);

/**
 * Returns true if the element's class list contains all of the given classes.
 *
 * @category CSS: Altering (optimized)
 */
export const hasAllClasses = (element: Element, classNames: string[]) =>
  !MH.some(classNames, (className) => !hasClass(element, className));

/**
 * Returns true if the element's class list contains any of the given classes.
 *
 * @category CSS: Altering (optimized)
 */
export const hasAnyClass = (element: Element, classNames: string[]) =>
  MH.some(classNames, (className) => hasClass(element, className));

/**
 * Adds the given classes to the element.
 *
 * @category CSS: Altering
 */
export const addClassesNow = (element: Element, ...classNames: string[]) =>
  MH.classList(element).add(...classNames);

/**
 * Like {@link addClassesNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export const addClasses = (element: Element, ...classNames: string[]) =>
  waitForMutateTime().then(() => addClassesNow(element, ...classNames));

/**
 * Removes the given classes to the element.
 *
 * @category CSS: Altering
 */
export const removeClassesNow = (element: Element, ...classNames: string[]) =>
  MH.classList(element).remove(...classNames);

/**
 * Like {@link removeClassesNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export const removeClasses = (element: Element, ...classNames: string[]) =>
  waitForMutateTime().then(() => removeClassesNow(element, ...classNames));

/**
 * Toggles the given class on the element.
 *
 * @param force See {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle | DOMTokenList:toggle}
 *
 * @category CSS: Altering
 */
export const toggleClassNow = (
  element: Element,
  className: string,
  force?: boolean,
) => MH.classList(element).toggle(className, force);

/**
 * Like {@link toggleClassNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export const toggleClass = (
  element: Element,
  className: string,
  force?: boolean,
) => waitForMutateTime().then(() => toggleClassNow(element, className, force));

// For *Data: to avoid unnecessary type checking that ensures element is
// HTMLElement or SVGElement, use getAttribute instead of dataset.

/**
 * Returns the value of the given data attribute. The name of the attribute
 * must _not_ start with `data`. It can be in either camelCase or kebab-case,
 * it is converted as needed.
 *
 * @category CSS: Altering (optimized)
 */
export const getData = (element: Element, name: string) =>
  MH.getAttr(element, MH.prefixData(name));

/**
 * Returns the value of the given data attribute as a boolean. Its value is
 * expected to be either blank or "true" (which result in `true`), or "false"
 * (which results in `false`).
 *
 * The name of the attribute must _not_ start with `data`. It can be in either
 * camelCase or kebab-case, it is converted as needed.
 *
 * @category CSS: Altering (optimized)
 */
export const getBooleanData = (element: Element, name: string) => {
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
export const setDataNow = (element: Element, name: string, value: string) =>
  MH.setAttr(element, MH.prefixData(name), value);

/**
 * Like {@link setDataNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export const setData = (element: Element, name: string, value: string) =>
  waitForMutateTime().then(() => setDataNow(element, name, value));

/**
 * Sets the given data attribute with value "true" (default) or "false".
 *
 * The name of the attribute must _not_ start with `data`. It can be in either
 * camelCase or kebab-case, it is converted as needed.
 *
 * @category CSS: Altering
 */
export const setBooleanDataNow = (
  element: Element,
  name: string,
  value = true,
) => MH.setAttr(element, MH.prefixData(name), value + "");

/**
 * @ignore
 * @deprecated
 */
export const setBoolDataNow = setBooleanDataNow;

/**
 * Like {@link setBooleanDataNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export const setBooleanData = (element: Element, name: string, value = true) =>
  waitForMutateTime().then(() => setBooleanDataNow(element, name, value));

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
 * @category CSS: Altering
 */
export const unsetBooleanDataNow = (element: Element, name: string) =>
  MH.unsetAttr(element, MH.prefixData(name));

/**
 * @ignore
 * @deprecated
 */
export const unsetBoolDataNow = unsetBooleanDataNow;

/**
 * Like {@link unsetBooleanDataNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export const unsetBooleanData = (element: Element, name: string) =>
  waitForMutateTime().then(() => unsetBooleanDataNow(element, name));

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
export const delDataNow = (element: Element, name: string) =>
  MH.delAttr(element, MH.prefixData(name));

/**
 * Like {@link delDataNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export const delData = (element: Element, name: string) =>
  waitForMutateTime().then(() => delDataNow(element, name));

/**
 * Returns the value of the given property from the computed style of the
 * element.
 *
 * @category DOM: Altering
 */
export const getComputedStylePropNow = (element: Element, prop: string) =>
  getComputedStyle(element).getPropertyValue(prop);

/**
 * Like {@link getComputedStylePropNow} except it will {@link waitForMeasureTime}.
 *
 * @category DOM: Altering (optimized)
 */
export const getComputedStyleProp = (element: Element, prop: string) =>
  waitForMeasureTime().then(() => getComputedStylePropNow(element, prop));

/**
 * Returns the value of the given property from the inline style of the
 * element.
 *
 * @category DOM: Altering
 */
export const getStylePropNow = (element: Element, prop: string) =>
  (element as DOMElement).style?.getPropertyValue(prop);

/**
 * Like {@link getStylePropNow} except it will {@link waitForMeasureTime}.
 *
 * @category DOM: Altering (optimized)
 */
export const getStyleProp = (element: Element, prop: string) =>
  waitForMeasureTime().then(() => getStylePropNow(element, prop));

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
export const setStyleProp = (element: Element, prop: string, value: string) =>
  waitForMutateTime().then(() => setStylePropNow(element, prop, value));

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
export const delStyleProp = (element: Element, prop: string) =>
  waitForMutateTime().then(() => delStylePropNow(element, prop));

/**
 * Returns the flex direction of the given element **if it has a flex layout**.
 *
 * @returns `null` if the element does not have a flex layout.
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
 */
export const getParentFlexDirection = async (
  element: Element,
): Promise<FlexDirection | null> => {
  const parent = MH.parentOf(element);
  return parent ? getFlexDirection(parent) : null;
};

/**
 * Returns true if the given element has a flex layout. If direction is given,
 * then it also needs to match.
 */
export const isFlex = async (element: Element, direction?: FlexDirection) => {
  const flexDirection = await getFlexDirection(element);

  if (direction) {
    return direction === flexDirection;
  }

  return flexDirection !== null;
};

/**
 * Returns true if the given element's parent has a flex layout. If direction is
 * given, then it also needs to match.
 */
export const isFlexChild = async (
  element: Element,
  direction?: FlexDirection,
) => {
  const parent = MH.parentOf(element);
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

  return MH.max(
    ...splitOn(propVal, ",", true).map((strValue) => {
      let duration = MH.parseFloat(strValue) || 0;

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
export const setNumericStyleJsVars = async (
  element: Element,
  props: CssNumericProps,
  options: {
    _prefix?: string;
    _units?: string;
    _numDecimal?: number;
    _transformFn?: (prop: string, currVal: number, newVal: number) => number;
  } = {},
) => {
  if (!isDOMElement(element)) {
    return;
  }

  const transformFn = options._transformFn;

  const varPrefix = MH.prefixCssJsVar(options?._prefix || "");
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

      if (transformFn) {
        const currValue = MH.parseFloat(await getStyleProp(element, varName));

        value = transformFn(prop, currValue || 0, value);
      }

      value = roundNumTo(value, thisNumDecimal);
    }

    if (value === null) {
      delStyleProp(element, varName);
    } else {
      setStyleProp(element, varName, value + (options?._units || ""));
    }
  }
};

/**
 * @ignore
 * @internal
 */
type CssNumericProps = Record<string, number | undefined | null>;

// ----------------------------------------

type CSSTransition = {
  _cancel: () => undefined;
  _finish: () => undefined;
  _isCancelled: () => boolean;
};

const PREFIX_HAS_MODAL = MH.prefixName("has-modal");

const scheduledCSSTransitions = MH.newWeakMap<
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
      MH.deleteObjKey(scheduledTransitions, toCls);
    },
    _finish: () => {
      MH.deleteObjKey(scheduledTransitions, toCls);
    },
    _isCancelled: () => {
      return isCancelled;
    },
  };

  return scheduledTransitions[toCls];
};
