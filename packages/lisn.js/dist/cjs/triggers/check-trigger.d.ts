/**
 * @module Triggers
 *
 * @categoryDescription Input
 * {@link CheckTrigger} allows you to run actions when the user checks a target
 * checkbox input element, and undo those actions when they uncheck the checkbox.
 */
import { Action } from "../actions/action.cjs";
import { Trigger, TriggerConfig } from "../triggers/trigger.cjs";
/**
 * {@link CheckTrigger} allows you to run actions when the user checks a target
 * checkbox input element, and undo those actions when they uncheck the checkbox.
 *
 * -------
 *
 * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
 * specification.
 *
 * - Arguments: none
 * - Additional trigger options: none
 *   - `target`: A string element specification.
 *     See {@link Utils.getReferenceElement | getReferenceElement}.
 *
 * @example
 * Add classes `active` and `checked` when the user checks the checkbox,
 * remove them when unchecked.
 *
 * ```html
 * <input type="checkbox" data-lisn-on-check="@add-class=active,checked"/>
 * ```
 *
 * @example
 * As above, but using a CSS class instead of data attribute:
 *
 * ```html
 * <input type="checkbox" class="lisn-on-check--@add-class=active,checked"/>
 * ```
 *
 * @example
 * Play the animations on the element each time the user checks the next
 * element with class `checkbox` (do nothing when it's unchecked).
 *
 * ```html
 * <div data-lisn-on-check="@animate +one-way +target=next.checkbox"></div>
 * <input type="checkbox" class="checkbox"/>
 * ```
 *
 * @example
 * Add class `used` the first time the user checks the next element with class
 * `checkbox`, and play or reverse the animations 200ms after each time the
 * user toggles the reference checkbox.
 *
 * ```html
 * <div data-lisn-on-check="@add-class=used +once ;
 *                          @animate +delay=200 +target=next.checkbox"
 * ></div>
 * <input type="checkbox" class="checkbox"/>
 * ```
 *
 * @example
 * When the user checks the next element with class `checkbox` then add classes `c1`
 * and `c2` to the element (that the trigger is defined on) and enable trigger
 * `my-trigger` defined on this same element; undo all of that when the user unchecks
 * the reference checkbox.
 *
 * ```html
 * <div data-lisn-on-check="@add-class=c1,c2 @enable=my-trigger +target=next.checkbox"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <input type="checkbox" class="checkbox"/>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <div data-lisn-on-check="@add-class=c1,c2 @enable=my-trigger +target=next-checkbox"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <input type="checkbox" data-lisn-ref="checkbox"/>
 * ```
 *
 * @category Input
 */
export declare class CheckTrigger extends Trigger {
    readonly getConfig: () => CheckTriggerConfig;
    static register(): void;
    /**
     * If no actions are supplied, nothing is done.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the config is invalid.
     */
    constructor(element: Element, actions: Action[], config?: CheckTriggerConfig);
}
/**
 * @category Input
 * @interface
 */
export type CheckTriggerConfig = TriggerConfig & {
    /**
     * The target to use for the hover action.
     *
     * @defaultValue The element on which the {@link Trigger} is defined
     */
    target?: Element;
};
//# sourceMappingURL=check-trigger.d.ts.map