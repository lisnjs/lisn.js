function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Actions
 *
 * @categoryDescription Controlling triggers
 * {@link Enable} and {@link Disable} enable or disable a list of triggers
 * defined on the given element.
 *
 * {@link Run} runs or reverses a list of triggers defined on the given
 * element.
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { logWarn } from "../utils/log.js";
import { waitForDelay } from "../utils/tasks.js";
import { formatAsString } from "../utils/text.js";
import { Trigger } from "../triggers/trigger.js";
import { registerAction } from "./action.js";

/**
 * Enables or disables a list of triggers defined on the given element.
 *
 * **IMPORTANT:** When constructed, it disables all given triggers as a form of
 * initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 *   - Action name: "enable".
 *   - Accepted string arguments: one or more unique IDs of triggers defined on
 *     the given element
 *
 * @example
 * ```html
 * <button id="btn">Enable/disable</button>
 * <button data-lisn-on-click="
 *         @enable=triggerA,triggerB +target=#btn
 *         @add-class=clsA +id=triggerA
 *      "
 *      data-lisn-on-click="@add-class=clsB +id=triggerB"
 * ></button>
 * ```
 *
 * @category Controlling triggers
 */
export class Enable {
  static register() {
    registerAction("enable", (element, ids) => new Enable(element, ...ids));
  }
  constructor(element, ...ids) {
    /**
     * Enables the triggers with IDs given to the constructor.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Disables the triggers with IDs given to the constructor.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Toggles the enabled state on each trigger given to the constructor.
     */
    _defineProperty(this, "toggle", void 0);
    const {
      _enable,
      _disable,
      _toggleEnable
    } = getMethods(element, ids);
    _disable(); // initial state

    this.do = _enable;
    this.undo = _disable;
    this[MC.S_TOGGLE] = _toggleEnable;
  }
}

/**
 * Disables or enables a list of triggers defined on the given element.
 *
 * **IMPORTANT:** When constructed, it enables all given triggers as a form of
 * initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 *   - Action name: "disable".
 *   - Accepted string arguments: one or more unique IDs of triggers defined on
 *     the given element
 *
 * @example
 * ```html
 * <button id="btn">Enable/disable</button>
 * <button data-lisn-on-click="
 *         @disable=triggerA,triggerB +target=#btn
 *         @add-class=clsA +id=triggerA
 *      "
 *      data-lisn-on-click="@add-class=clsB +id=triggerB"
 * ></button>
 * ```
 *
 * @category Controlling triggers
 */
export class Disable {
  static register() {
    registerAction("disable", (element, ids) => new Disable(element, ...ids));
  }
  constructor(element, ...ids) {
    /**
     * Disables the triggers with IDs given to the constructor.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Enables the triggers with IDs given to the constructor.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Toggles the enabled state on each trigger given to the constructor.
     */
    _defineProperty(this, "toggle", void 0);
    const {
      _enable,
      _disable,
      _toggleEnable
    } = getMethods(element, ids);
    _enable(); // initial state

    this.do = _disable;
    this.undo = _enable;
    this[MC.S_TOGGLE] = _toggleEnable;
  }
}

/**
 * Runs or reverses a list of triggers defined on the given element.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 *   - Action name: "run".
 *   - Accepted string arguments: one or more unique IDs of triggers defined on
 *     the given element
 *
 * @example
 * ```html
 * <button data-lisn-on-click="
 *         @run=triggerA,triggerB
 *         @add-class=clsA +id=triggerA
 *      "
 *      data-lisn-on-run="@add-class=clsB +id=triggerB"
 * ></button>
 * ```
 *
 * @category Controlling triggers
 */
export class Run {
  static register() {
    registerAction("run", (element, ids) => new Run(element, ...ids));
  }
  constructor(element, ...ids) {
    /**
     * Runs the triggers with IDs given to the constructor.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Reverses the triggers with IDs given to the constructor.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Toggles the triggers with IDs given to the constructor.
     */
    _defineProperty(this, "toggle", void 0);
    const {
      _run,
      _reverse,
      _toggle
    } = getMethods(element, ids);
    this.do = _run;
    this.undo = _reverse;
    this[MC.S_TOGGLE] = _toggle;
  }
}

// --------------------

const getMethods = (element, ids) => {
  const triggerPromises = getTriggers(element, ids);
  const call = async method => {
    const triggers = await triggerPromises;
    for (const trigger of triggers) {
      trigger[method]();
    }
  };
  return {
    _enable: () => call("enable"),
    _disable: () => call("disable"),
    _toggleEnable: () => call("toggleEnable"),
    _run: () => call("run"),
    _reverse: () => call("reverse"),
    _toggle: () => call(MC.S_TOGGLE)
  };
};
const getTriggers = async (element, ids) => {
  const triggers = [];
  if (!MH.lengthOf(ids)) {
    logWarn("At least 1 ID is required for enable action");
    return triggers;
  }
  for (const id of ids) {
    let trigger = Trigger.get(element, id);
    if (!trigger) {
      await waitForDelay(0); // in case it's being processed now
      trigger = Trigger.get(element, id);
      if (!trigger) {
        logWarn(`No trigger with ID ${id} for element ${formatAsString(element)}`);
        continue;
      }
    }
    triggers.push(trigger);
  }
  return triggers;
};
//# sourceMappingURL=trigger.js.map