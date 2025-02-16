/**
 * @module Actions
 *
 * @categoryDescription Showing/hiding elements
 * {@link Display} and {@link Undisplay} displays or "undisplays" (display:
 * none) the given element.
 *
 * {@link Actions.Show | Show} and {@link Actions.Hide | Hide} show or hide the
 * given element with a smooth fading transition.
 */

import * as MC from "@lisn/globals/minification-constants";

import {
  displayElement,
  displayElementNow,
  undisplayElement,
  undisplayElementNow,
  toggleDisplayElement,
} from "@lisn/utils/css-alter";

import { Action, registerAction } from "@lisn/actions/action";

/**
 * Displays or "undisplays" (display: none) the given element.
 *
 * **IMPORTANT:** When constructed, it adds `display: none` to the element as a
 * form of initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "display".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <button id="btn">Display/undisplay</button>
 * <div data-lisn-on-click="@display +target=#btn"></div>
 * ```
 *
 * @category Showing/hiding elements
 */
export class Display implements Action {
  /**
   * It reverts the element to its original `display` property.
   */
  readonly do: () => Promise<void>;

  /**
   * Sets `display: none` on the element.
   */
  readonly undo: () => Promise<void>;

  /**
   * Displays the element if it's "undisplayed", otherwise "undisplays" it.
   */
  readonly toggle: () => Promise<void>;

  static register() {
    registerAction("display", (element) => new Display(element));
  }

  constructor(element: Element) {
    undisplayElementNow(element); // initial state

    const { _display, _undisplay, _toggle } = getMethods(element);
    this.do = _display;
    this.undo = _undisplay;
    this[MC.S_TOGGLE] = _toggle;
  }
}

/**
 * "Undisplays" (display: none) or displays the given element.
 *
 * **IMPORTANT:** When constructed, it removes the `lisn-undisplay` class if
 * present on the element as a form of initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "undisplay".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <button id="btn">Display/undisplay</button>
 * <div data-lisn-on-click="@undisplay +target=#btn"></div>
 * ```
 *
 * @category Showing/hiding elements
 */
export class Undisplay implements Action {
  /**
   * Sets `display: none` on the element.
   */
  readonly do: () => Promise<void>;

  /**
   * It reverts the element to its original `display` property.
   */
  readonly undo: () => Promise<void>;

  /**
   * Displays the element if it's "undisplayed", otherwise "undisplays" it.
   */
  readonly toggle: () => Promise<void>;

  static register() {
    registerAction("undisplay", (element) => new Undisplay(element));
  }

  constructor(element: Element) {
    displayElementNow(element); // initial state

    const { _display, _undisplay, _toggle } = getMethods(element);
    this.do = _undisplay;
    this.undo = _display;
    this[MC.S_TOGGLE] = _toggle;
  }
}

// --------------------

const getMethods = (element: Element) => {
  return {
    _display: async () => {
      await displayElement(element); // ignore return val
    },

    _undisplay: async () => {
      await undisplayElement(element); // ignore return val
    },

    _toggle: async () => {
      await toggleDisplayElement(element); // ignore return val
    },
  };
};
