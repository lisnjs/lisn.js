/**
 * @module Triggers
 *
 * @categoryDescription Pointer
 * {@link ClickTrigger} allows you to run actions when a user clicks a target
 * element (first time and every other time, i.e. odd number of click), and undo
 * those actions when a user clicks the target element again (or every even
 * number of clicks). It always acts as a toggle.
 *
 * {@link PressTrigger} allows you to run actions when the user presses and
 * holds a pointing device (or their finger) on a target element, and undo those
 * actions when they release their pointing device or lift their finger off.
 *
 * {@link HoverTrigger} allows you to run actions when the user hovers overs a
 * target element, and undo those actions when their pointing device moves off
 * the target. On touch devices it acts just like {@link PressTrigger}.
 */

import * as _ from "@lisn/_internal";

import { waitForReferenceElement } from "@lisn/utils/dom-search";
import { validateBoolean } from "@lisn/utils/validation";

import {
  PointerWatcher,
  OnPointerHandler,
} from "@lisn/watchers/pointer-watcher";

import { Action } from "@lisn/actions/action";

import {
  registerTrigger,
  Trigger,
  TriggerConfig,
} from "@lisn/triggers/trigger";

import { WidgetConfigValidatorFunc } from "@lisn/widgets/widget";

/**
 * {@link ClickTrigger} allows you to run actions when a user clicks a target
 * element (first time and every other time, i.e. odd number of click), and
 * undo them when a user clicks the target element again (or every even number
 * of clicks). It always acts as a toggle.
 *
 * -------
 *
 * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
 * specification.
 *
 * - Arguments: none
 * - Additional trigger options (see {@link PointerTriggerConfig}):
 *   - `target`: A string element specification.
 *     See {@link Utils.getReferenceElement | getReferenceElement}.
 *   - `prevent-default`: A boolean.
 *   - `prevent-select`: A boolean.
 *
 * @example
 * Add classes `active` and `toggled-on` when the user clicks the element
 * (first time and every other time, i.e. odd number of click), remove them
 * when clicked again (or even number of click);
 *
 * ```html
 * <div data-lisn-on-click="@add-class: active,toggled-on"></div>
 * ```
 *
 * @example
 * As above, but using a CSS class instead of data attribute:
 *
 * ```html
 * <div class="lisn-on-click--@add-class: active,toggled-on"></div>
 * ```
 *
 * @example
 * Play the animations on the element 1000ms after the first time the user
 * clicks it.
 *
 * ```html
 * <div data-lisn-on-click="@animate +once +delay=1000"></div>
 * ```
 *
 * @example
 * Add class `visited` the first time the user clicks the element, and play or
 * reverse the animations on the element 1000ms after each time the user clicks
 * it.
 *
 * ```html
 * <div data-lisn-on-click="@add-class: visited +once ;
 *                          @animate +delay=1000"
 * ></div>
 * ```
 *
 * @example
 * When the user clicks the next element with class `box` then add classes `c1`
 * and `c2` to the element (that the trigger is defined on) and enable trigger
 * `my-trigger` defined on this same element; undo all of that on even number
 * of clicks on the reference box element.
 *
 * ```html
 * <div data-lisn-on-click="@add-class: c1,c2 @enable: my-trigger +target=next.box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div class="box"></div>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <div data-lisn-on-click="@add-class: c1,c2 @enable: my-trigger +target=next-box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div data-lisn-ref="box"></div>
 * ```
 *
 * @category Pointer
 */
export class ClickTrigger extends Trigger {
  readonly getConfig: () => PointerTriggerConfig;

  static register() {
    registerTrigger(
      _.S_CLICK,
      (element, args, actions, config) =>
        new ClickTrigger(element, actions, config),
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
    config?: PointerTriggerConfig,
  ) {
    config ??= {};
    super(element, actions, config);
    this.getConfig = () => _.deepCopy(config);

    setupWatcher(this, element, actions, config, _.S_CLICK);
  }
}

/**
 * {@link PressTrigger} allows you to run actions when the user presses and
 * holds a pointing device (or their finger) on a target element, and undo
 * those actions when they release their pointing device or lift their finger
 * off.
 *
 * -------
 *
 * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
 * specification.
 *
 * - Arguments: none
 * - Additional trigger options (see {@link PointerTriggerConfig}):
 *   - `target`: A string element specification.
 *     See {@link Utils.getReferenceElement | getReferenceElement}.
 *   - `prevent-default`: boolean
 *   - `prevent-select`: boolean
 *
 * @example
 * Add classes `active` and `pressed` when the user presses and holds (with
 * mouse, finger or any pointer) the element, remove them when they release
 * the mouse.
 *
 * ```html
 * <div data-lisn-on-press="@add-class: active,pressed"></div>
 * ```
 *
 * @example
 * As above, but using a CSS class instead of data attribute:
 *
 * ```html
 * <div class="lisn-on-press--@add-class: active,pressed"></div>
 * ```
 *
 * @example
 * Play the animations on the element 1000ms after the first time the user
 * presses on the element it.
 *
 * ```html
 * <div data-lisn-on-press="@animate +once +delay=1000"></div>
 * ```
 *
 * @example
 * Add class `pressed` the first time the user presses on the element, and
 * play the animations on the element while the user is pressing on the element
 * with a delay of 100ms, reverse the animations as soon as the user releases
 * the mouse.
 *
 * ```html
 * <div data-lisn-on-click="@add-class: pressed +once ;
 *                          @animate +do-delay=100"
 * ></div>
 * ```
 *
 * @example
 * When the user presses and holds the next element with class `box` then add
 * classes `c1` and `c2` to the element (that the trigger is defined on) and
 * enable trigger `my-trigger` defined on this same element; undo all of that
 * when they release the mouse (or lift their finger/pointer device) from the
 * reference box element.
 *
 * ```html
 * <div data-lisn-on-press="@add-class: c1,c2 @enable: my-trigger +target=next.box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div class="box"></div>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <div data-lisn-on-press="@add-class: c1,c2 @enable: my-trigger +target=next-box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div data-lisn-ref="box"></div>
 * ```
 *
 * @category Pointer
 */
export class PressTrigger extends Trigger {
  readonly getConfig: () => PointerTriggerConfig;

  static register() {
    registerTrigger(
      _.S_PRESS,
      (element, args, actions, config) =>
        new PressTrigger(element, actions, config),
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
    config?: PointerTriggerConfig,
  ) {
    config ??= {};
    super(element, actions, config);
    this.getConfig = () => _.deepCopy(config);

    setupWatcher(this, element, actions, config, _.S_PRESS);
  }
}

/**
 * {@link HoverTrigger} allows you to run actions when the user hovers overs
 * a target element, and undo those actions when their pointing device moves
 * off the target. On touch devices it acts just like {@link PressTrigger}.
 *
 * -------
 *
 * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
 * specification.
 *
 * - Arguments: none
 * - Additional trigger options (see {@link PointerTriggerConfig}):
 *   - `target`: A string element specification.
 *     See {@link Utils.getReferenceElement | getReferenceElement}.
 *   - `prevent-default`: boolean
 *   - `prevent-select`: boolean
 *
 * @example
 * Add classes `active` and `hovered` when the user hovers over the element,
 * remove them otherwise.
 *
 * ```html
 * <div data-lisn-on-hover="@add-class: active,hovered"></div>
 * ```
 *
 * @example
 * As above, but using a CSS class instead of data attribute:
 *
 * ```html
 * <div class="lisn-on-press--@add-class: active,hovered"></div>
 * ```
 *
 * @example
 * Play the animations on the element 1000ms after the first time the user
 * hovers over the element it.
 *
 * ```html
 * <div data-lisn-on-hover="@animate +once +delay=1000"></div>
 * ```
 *
 * @example
 * Add class `hovered` the first time the user hovers over the element, and
 * play the animations on the element while the user is hovering over the
 * element with a delay of 100ms, reverse the animations as soon as the user
 * mouse leaves the element.
 *
 * ```html
 * <div data-lisn-on-click="@add-class: hovered +once ;
 *                          @animate +do-delay=100"
 * ></div>
 * ```
 *
 * @example
 * When the user hovers over the next element with class `box` then add classes
 * `c1` and `c2` to the element (that the trigger is defined on) and enable
 * trigger `my-trigger` defined on this same element; undo all of that when
 * their pointing device (or finger) moves off the reference element.
 *
 * ```html
 * <div data-lisn-on-hover="@add-class: c1,c2 @enable: my-trigger +target=next.box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div class="box"></div>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <div data-lisn-on-hover="@add-class: c1,c2 @enable: my-trigger +target=next-box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div data-lisn-ref="box"></div>
 * ```
 *
 * @category Pointer
 */
export class HoverTrigger extends Trigger {
  readonly getConfig: () => PointerTriggerConfig;

  static register() {
    registerTrigger(
      _.S_HOVER,
      (element, args, actions, config) =>
        new HoverTrigger(element, actions, config),
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
    config?: PointerTriggerConfig,
  ) {
    config ??= {};
    super(element, actions, config);
    this.getConfig = () => _.deepCopy(config);

    setupWatcher(this, element, actions, config, _.S_HOVER);
  }
}

/**
 * @category Pointer
 * @interface
 */
export type PointerTriggerConfig = TriggerConfig & {
  /**
   * The target to use for the hover action.
   *
   * @defaultValue The element on which the {@link Trigger} is defined
   */
  target?: Element;

  /**
   * See {@link Watchers/PointerWatcher.OnPointerOptions | OnPointerOptions}.
   *
   * @defaultValue {@link PointerWatcher} default, false
   */
  preventDefault?: boolean;

  /**
   * See {@link Watchers/PointerWatcher.OnPointerOptions | OnPointerOptions}.
   *
   * @defaultValue {@link PointerWatcher} default, true
   */
  preventSelect?: boolean;
};

// --------------------

const createConfigValidator: WidgetConfigValidatorFunc<PointerTriggerConfig> = (
  element,
) => {
  return {
    target: (key, value) =>
      _.isLiteralString(value)
        ? waitForReferenceElement(value, element).then((v) => v ?? void 0) // ugh, typescript...
        : void 0,
    preventDefault: validateBoolean,
    preventSelect: validateBoolean,
  };
};

const setupWatcher = (
  widget: ClickTrigger | HoverTrigger | PressTrigger,
  element: Element,
  actions: Action[],
  config: PointerTriggerConfig,
  action: "click" | "hover" | "press",
) => {
  if (!_.lengthOf(actions)) {
    return;
  }

  config ??= {};
  const target = _.targetOf(config) ?? element;

  // For clicks use the trigger's own toggle function so that it remembers ITS
  // state rather than the odd/even clicks. Otherwise if the trigger is
  // disabled, then clicking will "swap" the state.
  let startHandler: OnPointerHandler;
  let endHandler: OnPointerHandler;
  if (action === _.S_CLICK) {
    startHandler = endHandler = widget[_.S_TOGGLE];
  } else {
    startHandler = widget.run;
    endHandler = widget.reverse;
  }

  PointerWatcher.reuse().onPointer(
    target,
    startHandler,
    endHandler,
    _.merge(
      {
        actions: action,
      },
      _.omitKeys(config, { target: null }),
    ),
  );
};

_.brandClass(ClickTrigger, "ClickTrigger");
_.brandClass(PressTrigger, "PressTrigger");
_.brandClass(HoverTrigger, "HoverTrigger");
