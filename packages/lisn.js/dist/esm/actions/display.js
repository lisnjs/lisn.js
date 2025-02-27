function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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

import * as MC from "../globals/minification-constants.js";
import { displayElement, displayElementNow, undisplayElement, undisplayElementNow, toggleDisplayElement } from "../utils/css-alter.js";
import { registerAction } from "./action.js";

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
export class Display {
  static register() {
    registerAction("display", element => new Display(element));
  }
  constructor(element) {
    /**
     * It reverts the element to its original `display` property.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Sets `display: none` on the element.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Displays the element if it's "undisplayed", otherwise "undisplays" it.
     */
    _defineProperty(this, "toggle", void 0);
    undisplayElementNow(element); // initial state

    const {
      _display,
      _undisplay,
      _toggle
    } = getMethods(element);
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
export class Undisplay {
  static register() {
    registerAction("undisplay", element => new Undisplay(element));
  }
  constructor(element) {
    /**
     * Sets `display: none` on the element.
     */
    _defineProperty(this, "do", void 0);
    /**
     * It reverts the element to its original `display` property.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Displays the element if it's "undisplayed", otherwise "undisplays" it.
     */
    _defineProperty(this, "toggle", void 0);
    displayElementNow(element); // initial state

    const {
      _display,
      _undisplay,
      _toggle
    } = getMethods(element);
    this.do = _undisplay;
    this.undo = _display;
    this[MC.S_TOGGLE] = _toggle;
  }
}

// --------------------

const getMethods = element => {
  return {
    _display: async () => {
      await displayElement(element); // ignore return val
    },
    _undisplay: async () => {
      await undisplayElement(element); // ignore return val
    },
    _toggle: async () => {
      await toggleDisplayElement(element); // ignore return val
    }
  };
};
//# sourceMappingURL=display.js.map