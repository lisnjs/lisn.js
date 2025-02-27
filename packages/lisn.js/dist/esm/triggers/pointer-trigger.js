function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Triggers
 *
 * @categoryDescription Pointer
 * {@link ClickTrigger} allows you to run actions when a user clicks a target
 * element (first time and every other time, i.e. odd number of click), and
 * undo them when a user clicks the target element again (or every even number
 * of clicks). It always acts as a toggle.
 *
 * {@link PressTrigger} allows you to run actions when the user presses and
 * holds a pointing device (or their finger) on a target element, and undo
 * those actions when they release their pointing device or lift their finger
 * off.
 *
 * {@link HoverTrigger} allows you to run actions when the user hovers overs
 * a target element, and undo those actions when their pointing device moves
 * off the target. On touch devices it acts just like {@link PressTrigger}.
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { waitForReferenceElement } from "../utils/dom-search.js";
import { omitKeys } from "../utils/misc.js";
import { validateBoolean } from "../utils/validation.js";
import { PointerWatcher } from "../watchers/pointer-watcher.js";
import { registerTrigger, Trigger } from "./trigger.js";
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
 * - Additional trigger options: none
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
 * <div data-lisn-on-click="@add-class=active,toggled-on"></div>
 * ```
 *
 * @example
 * As above, but using a CSS class instead of data attribute:
 *
 * ```html
 * <div class="lisn-on-click--@add-class=active,toggled-on"></div>
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
 * Add class `visited` the first time the user clicks the element, and
 * play or reverse the animations on the element 1000ms each time the
 * user clicks it.
 *
 * ```html
 * <div data-lisn-on-click="@add-class=visited +once ;
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
 * <div data-lisn-on-click="@add-class=c1,c2 @enable=my-trigger +target=next.box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div class="box"></div>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <div data-lisn-on-click="@add-class=c1,c2 @enable=my-trigger +target=next-box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div data-lisn-ref="box"></div>
 * ```
 *
 * @category Pointer
 */
export class ClickTrigger extends Trigger {
  static register() {
    registerTrigger(MC.S_CLICK, (element, args, actions, config) => new ClickTrigger(element, actions, config), newConfigValidator);
  }

  /**
   * If no actions are supplied, nothing is done.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the config is invalid.
   */
  constructor(element, actions, config = {}) {
    super(element, actions, config);
    _defineProperty(this, "getConfig", void 0);
    this.getConfig = () => MH.copyObject(config);
    setupWatcher(this, element, actions, config, MC.S_CLICK);
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
 * - Additional trigger options: none
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
 * <div data-lisn-on-press="@add-class=active,pressed"></div>
 * ```
 *
 * @example
 * As above, but using a CSS class instead of data attribute:
 *
 * ```html
 * <div class="lisn-on-press--@add-class=active,pressed"></div>
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
 * <div data-lisn-on-click="@add-class=pressed +once ;
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
 * <div data-lisn-on-press="@add-class=c1,c2 @enable=my-trigger +target=next.box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div class="box"></div>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <div data-lisn-on-press="@add-class=c1,c2 @enable=my-trigger +target=next-box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div data-lisn-ref="box"></div>
 * ```
 *
 * @category Pointer
 */
export class PressTrigger extends Trigger {
  static register() {
    registerTrigger(MC.S_PRESS, (element, args, actions, config) => new PressTrigger(element, actions, config), newConfigValidator);
  }

  /**
   * If no actions are supplied, nothing is done.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the config is invalid.
   */
  constructor(element, actions, config = {}) {
    super(element, actions, config);
    _defineProperty(this, "getConfig", void 0);
    this.getConfig = () => MH.copyObject(config);
    setupWatcher(this, element, actions, config, MC.S_PRESS);
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
 * - Additional trigger options: none
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
 * <div data-lisn-on-hover="@add-class=active,hovered"></div>
 * ```
 *
 * @example
 * As above, but using a CSS class instead of data attribute:
 *
 * ```html
 * <div class="lisn-on-press--@add-class=active,hovered"></div>
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
 * <div data-lisn-on-click="@add-class=hovered +once ;
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
 * <div data-lisn-on-hover="@add-class=c1,c2 @enable=my-trigger +target=next.box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div class="box"></div>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <div data-lisn-on-hover="@add-class=c1,c2 @enable=my-trigger +target=next-box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div data-lisn-ref="box"></div>
 * ```
 *
 * @category Pointer
 */
export class HoverTrigger extends Trigger {
  static register() {
    registerTrigger(MC.S_HOVER, (element, args, actions, config) => new HoverTrigger(element, actions, config), newConfigValidator);
  }

  /**
   * If no actions are supplied, nothing is done.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the config is invalid.
   */
  constructor(element, actions, config = {}) {
    super(element, actions, config);
    _defineProperty(this, "getConfig", void 0);
    this.getConfig = () => MH.copyObject(config);
    setupWatcher(this, element, actions, config, MC.S_HOVER);
  }
}

/**
 * @category Pointer
 * @interface
 */

// --------------------

const newConfigValidator = element => {
  return {
    target: (key, value) => {
      var _ref;
      return (_ref = MH.isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    },
    preventDefault: validateBoolean,
    preventSelect: validateBoolean
  };
};
const setupWatcher = (widget, element, actions, config, action) => {
  if (!MH.lengthOf(actions)) {
    return;
  }
  const target = MH.targetOf(config) || element;

  // For clicks use the trigger's own toggle function so that it remembers ITS
  // state rather than the odd/even clicks. Otherwise if the trigger is
  // disabled, then clicking will "swap" the state.
  let startHandler;
  let endHandler;
  if (action === MC.S_CLICK) {
    startHandler = endHandler = widget[MC.S_TOGGLE];
  } else {
    startHandler = widget.run;
    endHandler = widget.reverse;
  }
  PointerWatcher.reuse().onPointer(target, startHandler, endHandler, MH.merge({
    actions: action
  }, omitKeys(config, {
    target: null
  })));
};
//# sourceMappingURL=pointer-trigger.js.map