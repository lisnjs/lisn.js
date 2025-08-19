/**
 * @module Triggers
 *
 * @categoryDescription Input
 * {@link CheckTrigger} allows you to run actions when the user checks a target
 * checkbox input element, and undo those actions when they uncheck the checkbox.
 */

import * as _ from "@lisn/_internal";

import { waitForReferenceElement } from "@lisn/utils/dom-search";
import { addEventListenerTo, removeEventListenerFrom } from "@lisn/utils/event";

import { Action } from "@lisn/actions/action";

import {
  registerTrigger,
  Trigger,
  TriggerConfig,
} from "@lisn/triggers/trigger";

import { WidgetConfigValidatorFunc } from "@lisn/widgets/widget";

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
 * - Additional trigger options (see {@link CheckTriggerConfig}:
 *   - `target`: A string element specification.
 *     See {@link Utils.getReferenceElement | getReferenceElement}.
 *
 * @example
 * Add classes `active` and `checked` when the user checks the checkbox,
 * remove them when unchecked.
 *
 * ```html
 * <input type="checkbox" data-lisn-on-check="@add-class: active,checked"/>
 * ```
 *
 * @example
 * As above, but using a CSS class instead of data attribute:
 *
 * ```html
 * <input type="checkbox" class="lisn-on-check--@add-class: active,checked"/>
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
 * <div data-lisn-on-check="@add-class: used +once ;
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
 * <div data-lisn-on-check="@add-class: c1,c2 @enable: my-trigger +target=next.checkbox"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <input type="checkbox" class="checkbox"/>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <div data-lisn-on-check="@add-class: c1,c2 @enable: my-trigger +target=next-checkbox"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <input type="checkbox" data-lisn-ref="checkbox"/>
 * ```
 *
 * @category Input
 */
export class CheckTrigger extends Trigger {
  readonly getConfig: () => CheckTriggerConfig;

  static register() {
    registerTrigger(
      "check",
      (element, args, actions, config) =>
        new CheckTrigger(element, actions, config),
      createConfigValidator,
    );
  }

  /**
   * If no actions are supplied, nothing is done.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the config is invalid.
   */
  constructor(
    element: Element,
    actions: Action[],
    config?: CheckTriggerConfig,
  ) {
    config ??= {};
    super(element, actions, config);
    this.getConfig = () => _.deepCopy(config);

    if (!_.lengthOf(actions)) {
      return;
    }

    const target = _.targetOf(config) ?? element;

    if (!_.isHTMLInputElement(target)) {
      return;
    }

    const onToggle = () => (target.checked ? this.run() : this.reverse());

    addEventListenerTo(target, "change", onToggle);

    this.onDestroy(() => {
      removeEventListenerFrom(target, "change", onToggle);
    });
  }
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

// --------------------

const createConfigValidator: WidgetConfigValidatorFunc<CheckTriggerConfig> = (
  element,
) => {
  return {
    target: (key, value) =>
      _.isLiteralString(value)
        ? waitForReferenceElement(value, element).then((v) => v ?? void 0) // ugh, typescript...
        : void 0,
  };
};

_.brandClass(CheckTrigger, "CheckTrigger");
