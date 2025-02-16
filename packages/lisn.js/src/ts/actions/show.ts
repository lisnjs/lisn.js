/**
 * @module Actions
 */

import * as MC from "@lisn/globals/minification-constants";

import {
  showElement,
  hideElement,
  toggleShowElement,
  disableInitialTransition,
} from "@lisn/utils/css-alter";

import { Action, registerAction } from "@lisn/actions/action";

/**
 * Shows or hides the given element with a smooth fading transition.
 *
 * **IMPORTANT:** When constructed, it will hide the element as a form of
 * initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "show".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <button id="btn">Show/hide</button>
 * <div data-lisn-on-click="@show +target=#btn"></div>
 * ```
 *
 * @category Showing/hiding elements
 */
export class Show implements Action {
  /**
   * Shows the element with a smooth fade in transition.
   */
  readonly do: () => Promise<void>;

  /**
   * Hides the element with a smooth fade out transition.
   */
  readonly undo: () => Promise<void>;

  /**
   * Shows the element if it is hidden, hides it otherwise.
   */
  readonly toggle: () => Promise<void>;

  static register() {
    registerAction("show", (element) => new Show(element));
  }

  constructor(element: Element) {
    disableInitialTransition(element);
    hideElement(element); // initial state

    const { _show, _hide, _toggle } = getMethods(element);
    this.do = _show;
    this.undo = _hide;
    this[MC.S_TOGGLE] = _toggle;
  }
}

/**
 * Hides or shows the given element with a smooth fading transition.
 *
 * **IMPORTANT:** When constructed, it will remove any `lisn-hide` class from
 * the element as a form of initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "hide".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <button id="btn">Show/hide</button>
 * <div data-lisn-on-click="@hide +target=#btn"></div>
 * ```
 *
 * @category Showing/hiding elements
 */
export class Hide implements Action {
  /**
   * Hides the element with a smooth fade out transition.
   */
  readonly do: () => Promise<void>;

  /**
   * Shows the element with a smooth fade in transition.
   */
  readonly undo: () => Promise<void>;

  /**
   * Shows the element if it is hidden, hides it otherwise.
   */
  readonly toggle: () => Promise<void>;

  static register() {
    registerAction("hide", (element) => new Hide(element));
  }

  constructor(element: Element) {
    disableInitialTransition(element);
    showElement(element); // initial state

    const { _show, _hide, _toggle } = getMethods(element);
    this.do = _hide;
    this.undo = _show;
    this[MC.S_TOGGLE] = _toggle;
  }
}

// --------------------

const getMethods = (element: Element) => {
  return {
    _show: async () => {
      await showElement(element); // ignore return val
    },

    _hide: async () => {
      await hideElement(element); // ignore return val
    },

    _toggle: async () => {
      await toggleShowElement(element); // ignore return val
    },
  };
};
