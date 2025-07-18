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
import { FlexDirection } from "../globals/types.js";
/**
 * Removes the given `fromCls` class and adds the given `toCls` class to the
 * element.
 *
 * Unlike {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/replace | DOMTokenList:replace},
 * this will always add `toCls` even if `fromCls` isn't in the element's class list.
 *
 * @returns {} True if there was a change made (class removed or added),
 *             false otherwise.
 *
 * @category CSS: Altering
 */
export declare const transitionElementNow: (element: Element, fromCls: string, toCls: string) => boolean;
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
export declare const transitionElement: (element: Element, fromCls: string, toCls: string, delay?: number) => Promise<boolean>;
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
export declare const displayElementNow: (element: Element) => boolean;
/**
 * Like {@link displayElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export declare const displayElement: (element: Element, delay?: number) => Promise<boolean>;
/**
 * The opposite of {@link displayElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category CSS: Altering
 */
export declare const undisplayElementNow: (element: Element) => boolean;
/**
 * Like {@link undisplayElementNow} except it will {@link waitForMutateTime},
 * and optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export declare const undisplayElement: (element: Element, delay?: number) => Promise<boolean>;
/**
 * Transitions an element from class `lisn-hide` (which makes the element
 * hidden) to `lisn-show` (which shows it). These classes have CSS
 * transitions applied so the element is faded into and out of view.
 *
 * @see {@link transitionElementNow}.
 *
 * @category CSS: Altering
 */
export declare const showElementNow: (element: Element) => boolean;
/**
 * Like {@link showElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export declare const showElement: (element: Element, delay?: number) => Promise<boolean>;
/**
 * The opposite of {@link showElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category CSS: Altering
 */
export declare const hideElementNow: (element: Element) => boolean;
/**
 * Like {@link hideElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export declare const hideElement: (element: Element, delay?: number) => Promise<boolean>;
/**
 * If {@link isElementUndisplayed}, it will {@link displayElementNow},
 * otherwise it will {@link undisplayElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category CSS: Altering
 */
export declare const toggleDisplayElementNow: (element: Element) => boolean;
/**
 * Like {@link toggleDisplayElementNow} except it will {@link waitForMutateTime},
 * and optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export declare const toggleDisplayElement: (element: Element, delay?: number) => Promise<boolean>;
/**
 * If {@link isElementHidden}, it will {@link showElementNow}, otherwise
 * {@link hideElementNow}.
 *
 * @see {@link transitionElementNow}
 *
 * @category CSS: Altering
 */
export declare const toggleShowElementNow: (element: Element) => boolean;
/**
 * Like {@link toggleShowElementNow} except it will {@link waitForMutateTime}, and
 * optionally a delay.
 *
 * @see {@link transitionElement}
 *
 * @category CSS: Altering (optimized)
 */
export declare const toggleShowElement: (element: Element, delay?: number) => Promise<boolean>;
/**
 * Returns true if the element's class list contains `lisn-hide`.
 *
 * @category CSS: Altering (optimized)
 */
export declare const isElementHidden: (element: Element) => boolean;
/**
 * Returns true if the element's class list contains `lisn-undisplay`.
 *
 * @category CSS: Altering (optimized)
 */
export declare const isElementUndisplayed: (element: Element) => boolean;
/**
 * Returns true if the element's class list contains the given class.
 *
 * @category CSS: Altering (optimized)
 */
export declare const hasClass: (el: Element, className: string) => boolean;
/**
 * Adds the given classes to the element.
 *
 * @category CSS: Altering
 */
export declare const addClassesNow: (el: Element, ...classNames: string[]) => void;
/**
 * Like {@link addClassesNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export declare const addClasses: (el: Element, ...classNames: string[]) => Promise<void>;
/**
 * Removes the given classes to the element.
 *
 * @category CSS: Altering
 */
export declare const removeClassesNow: (el: Element, ...classNames: string[]) => void;
/**
 * Like {@link removeClassesNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export declare const removeClasses: (el: Element, ...classNames: string[]) => Promise<void>;
/**
 * Toggles the given class on the element.
 *
 * @param {} force See {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle | DOMTokenList:toggle}
 *
 * @category CSS: Altering
 */
export declare const toggleClassNow: (el: Element, className: string, force?: boolean) => boolean;
/**
 * Like {@link toggleClassNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export declare const toggleClass: (el: Element, className: string, force?: boolean) => Promise<boolean>;
/**
 * Returns the value of the given data attribute. The name of the attribute
 * must _not_ start with `data`. It can be in either camelCase or kebab-case,
 * it is converted as needed.
 *
 * @category CSS: Altering (optimized)
 */
export declare const getData: (el: Element, name: string) => string | null;
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
export declare const getBooleanData: (el: Element, name: string) => boolean;
/**
 * @ignore
 * @deprecated
 */
export declare const getBoolData: (el: Element, name: string) => boolean;
/**
 * Sets the given data attribute.
 *
 * The name of the attribute must _not_ start with `data`. It can be in either
 * camelCase or kebab-case, it is converted as needed.
 *
 * @category CSS: Altering
 */
export declare const setDataNow: (el: Element, name: string, value: string) => void;
/**
 * Like {@link setDataNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export declare const setData: (el: Element, name: string, value: string) => Promise<void>;
/**
 * Sets the given data attribute with value "true" (default) or "false".
 *
 * The name of the attribute must _not_ start with `data`. It can be in either
 * camelCase or kebab-case, it is converted as needed.
 *
 * @category CSS: Altering
 */
export declare const setBooleanDataNow: (el: Element, name: string, value?: boolean) => void;
/**
 * @ignore
 * @deprecated
 */
export declare const setBoolDataNow: (el: Element, name: string, value?: boolean) => void;
/**
 * Like {@link setBooleanDataNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export declare const setBooleanData: (el: Element, name: string, value?: boolean) => Promise<void>;
/**
 * @ignore
 * @deprecated
 */
export declare const setBoolData: (el: Element, name: string, value?: boolean) => Promise<void>;
/**
 * Sets the given data attribute with value "false".
 *
 * The name of the attribute must _not_ start with `data`. It can be in either
 * camelCase or kebab-case, it is converted as needed.
 *
 * @category CSS: Altering
 */
export declare const unsetBooleanDataNow: (el: Element, name: string) => void;
/**
 * @ignore
 * @deprecated
 */
export declare const unsetBoolDataNow: (el: Element, name: string) => void;
/**
 * Like {@link unsetBooleanDataNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export declare const unsetBooleanData: (el: Element, name: string) => Promise<void>;
/**
 * @ignore
 * @deprecated
 */
export declare const unsetBoolData: (el: Element, name: string) => Promise<void>;
/**
 * Deletes the given data attribute.
 *
 * The name of the attribute must _not_ start with `data`. It can be in either
 * camelCase or kebab-case, it is converted as needed.
 *
 * @category CSS: Altering
 */
export declare const delDataNow: (el: Element, name: string) => void;
/**
 * Like {@link delDataNow} except it will {@link waitForMutateTime}.
 *
 * @category CSS: Altering (optimized)
 */
export declare const delData: (el: Element, name: string) => Promise<void>;
/**
 * Returns the value of the given property from the computed style of the
 * element.
 *
 * @category DOM: Altering
 */
export declare const getComputedStylePropNow: (element: Element, prop: string) => string;
/**
 * Like {@link getComputedStylePropNow} except it will {@link waitForMeasureTime}.
 *
 * @category DOM: Altering (optimized)
 */
export declare const getComputedStyleProp: (element: Element, prop: string) => Promise<string>;
/**
 * Returns the value of the given property from the inline style of the
 * element.
 *
 * @category DOM: Altering
 */
export declare const getStylePropNow: (element: Element, prop: string) => string;
/**
 * Like {@link getStylePropNow} except it will {@link waitForMeasureTime}.
 *
 * @category DOM: Altering (optimized)
 */
export declare const getStyleProp: (element: Element, prop: string) => Promise<string>;
/**
 * Sets the given property on the inline style of the element.
 *
 * @category DOM: Altering
 */
export declare const setStylePropNow: (element: Element, prop: string, value: string) => void;
/**
 * Like {@link setStylePropNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export declare const setStyleProp: (element: Element, prop: string, value: string) => Promise<void>;
/**
 * Deletes the given property on the inline style of the element.
 *
 * @category DOM: Altering
 */
export declare const delStylePropNow: (element: Element, prop: string) => string;
/**
 * Like {@link delStylePropNow} except it will {@link waitForMutateTime}.
 *
 * @category DOM: Altering (optimized)
 */
export declare const delStyleProp: (element: Element, prop: string) => Promise<string>;
/**
 * Returns the flex direction of the given element **if it has a flex layout**.
 *
 * @returns {} `null` if the element does not have a flex layout.
 */
export declare const getFlexDirection: (element: Element) => Promise<FlexDirection | null>;
/**
 * Returns the flex direction of the given element's parent **if it has a flex
 * layout**.
 *
 * @returns {} `null` if the element's parent does not have a flex layout.
 */
export declare const getParentFlexDirection: (element: Element) => Promise<FlexDirection | null>;
/**
 * Returns true if the given element has a flex layout. If direction is given,
 * then it also needs to match.
 */
export declare const isFlex: (element: Element, direction?: FlexDirection) => Promise<boolean>;
/**
 * Returns true if the given element's parent has a flex layout. If direction is
 * given, then it also needs to match.
 */
export declare const isFlexChild: (element: Element, direction?: FlexDirection) => Promise<boolean>;
/**
 * In milliseconds.
 *
 * @ignore
 * @internal
 */
export declare const getMaxTransitionDuration: (element: Element) => Promise<number>;
/**
 * @ignore
 * @internal
 */
export declare const disableInitialTransition: (element: Element, delay?: number) => Promise<void>;
/**
 * @ignore
 * @internal
 */
export declare const setHasModal: () => Promise<void>;
/**
 * @ignore
 * @internal
 */
export declare const delHasModal: () => Promise<void>;
/**
 * @ignore
 * @internal
 */
export declare const copyStyle: (fromElement: Element, toElement: Element, includeComputedProps?: string[]) => Promise<void>;
/**
 * If the props keys are in camelCase they are converted to kebab-case
 *
 * If a value is null or undefined, the property is deleted.
 *
 * @ignore
 * @internal
 */
export declare const setNumericStyleJsVars: (element: Element, props: CssNumericProps, options?: {
    _prefix?: string;
    _units?: string;
    _numDecimal?: number;
    _transformFn?: (prop: string, currVal: number, newVal: number) => number;
}) => Promise<void>;
/**
 * @ignore
 * @internal
 */
type CssNumericProps = Record<string, number | undefined | null>;
export {};
//# sourceMappingURL=css-alter.d.ts.map