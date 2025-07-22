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

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { logWarn } from "@lisn/utils/log";
import { waitForDelay } from "@lisn/utils/tasks";
import { formatAsString } from "@lisn/utils/text";

import { Trigger } from "@lisn/triggers/trigger";

import { Action, registerAction } from "@lisn/actions/action";

/**
 * Enables or disables a list of triggers defined on the given element.
 *
 * **IMPORTANT:** When constructed, it disables all given triggers as a form of
 * initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "enable".
 * - Arguments (required): one or more unique IDs of triggers defined on the
 *   given element
 * - Options: none
 *
 * @example
 * ```html
 * <button id="btn">Enable/disable</button>
 * <button data-lisn-on-click="
 *         @enable: triggerA,triggerB +target=#btn
 *         @add-class: clsA +id=triggerA
 *      "
 *      data-lisn-on-click="@add-class: clsB +id=triggerB"
 * ></button>
 * ```
 *
 * @category Controlling triggers
 */
export class Enable implements Action {
  /**
   * Enables the triggers with IDs given to the constructor.
   */
  readonly do: () => Promise<void>;

  /**
   * Disables the triggers with IDs given to the constructor.
   */
  readonly undo: () => Promise<void>;

  /**
   * Toggles the enabled state on each trigger given to the constructor.
   */
  readonly toggle: () => Promise<void>;

  static register() {
    registerAction("enable", (element, ids) => new Enable(element, ...ids));
  }

  constructor(element: Element, ...ids: string[]) {
    const { _enable, _disable, _toggleEnable } = getMethods(element, ids);
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
 * - Action name: "disable".
 * - Arguments (required): one or more unique IDs of triggers defined on the
 *   given element
 * - Options: none
 *
 * @example
 * ```html
 * <button id="btn">Enable/disable</button>
 * <button data-lisn-on-click="
 *         @disable: triggerA,triggerB +target=#btn
 *         @add-class: clsA +id=triggerA
 *      "
 *      data-lisn-on-click="@add-class: clsB +id=triggerB"
 * ></button>
 * ```
 *
 * @category Controlling triggers
 */
export class Disable implements Action {
  /**
   * Disables the triggers with IDs given to the constructor.
   */
  readonly do: () => Promise<void>;

  /**
   * Enables the triggers with IDs given to the constructor.
   */
  readonly undo: () => Promise<void>;

  /**
   * Toggles the enabled state on each trigger given to the constructor.
   */
  readonly toggle: () => Promise<void>;

  static register() {
    registerAction("disable", (element, ids) => new Disable(element, ...ids));
  }

  constructor(element: Element, ...ids: string[]) {
    const { _enable, _disable, _toggleEnable } = getMethods(element, ids);
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
 * - Action name: "run".
 * - Arguments (required): one or more unique IDs of triggers defined on the
 *   given element
 * - Options: none
 *
 * @example
 * ```html
 * <button data-lisn-on-click="
 *         @run: triggerA,triggerB
 *         @add-class: clsA +id=triggerA
 *      "
 *      data-lisn-on-run="@add-class: clsB +id=triggerB"
 * ></button>
 * ```
 *
 * @category Controlling triggers
 */
export class Run implements Action {
  /**
   * Runs the triggers with IDs given to the constructor.
   */
  readonly do: () => Promise<void>;

  /**
   * Reverses the triggers with IDs given to the constructor.
   */
  readonly undo: () => Promise<void>;

  /**
   * Toggles the triggers with IDs given to the constructor.
   */
  readonly toggle: () => Promise<void>;

  static register() {
    registerAction("run", (element, ids) => new Run(element, ...ids));
  }

  constructor(element: Element, ...ids: string[]) {
    const { _run, _reverse, _toggle } = getMethods(element, ids);

    this.do = _run;
    this.undo = _reverse;
    this[MC.S_TOGGLE] = _toggle;
  }
}

// --------------------

const getMethods = (element: Element, ids: string[]) => {
  const triggerPromises = getTriggers(element, ids);
  const call = async (
    method:
      | "enable"
      | "disable"
      | "toggleEnable"
      | "run"
      | "reverse"
      | "toggle",
  ) => {
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
    _toggle: () => call(MC.S_TOGGLE),
  };
};

const getTriggers = async (element: Element, ids: string[]) => {
  const triggers: Trigger[] = [];
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
        logWarn(
          `No trigger with ID ${id} for element ${formatAsString(element)}`,
        );
        continue;
      }
    }

    triggers.push(trigger);
  }

  return triggers;
};
