function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Actions
 */

import * as MC from "../globals/minification-constants.js";
import { showElement, hideElement, toggleShowElement, disableInitialTransition } from "../utils/css-alter.js";
import { registerAction } from "./action.js";

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
export class Show {
  static register() {
    registerAction("show", element => new Show(element));
  }
  constructor(element) {
    /**
     * Shows the element with a smooth fade in transition.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Hides the element with a smooth fade out transition.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Shows the element if it is hidden, hides it otherwise.
     */
    _defineProperty(this, "toggle", void 0);
    disableInitialTransition(element);
    hideElement(element); // initial state

    const {
      _show,
      _hide,
      _toggle
    } = getMethods(element);
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
export class Hide {
  static register() {
    registerAction("hide", element => new Hide(element));
  }
  constructor(element) {
    /**
     * Hides the element with a smooth fade out transition.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Shows the element with a smooth fade in transition.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Shows the element if it is hidden, hides it otherwise.
     */
    _defineProperty(this, "toggle", void 0);
    disableInitialTransition(element);
    showElement(element); // initial state

    const {
      _show,
      _hide,
      _toggle
    } = getMethods(element);
    this.do = _hide;
    this.undo = _show;
    this[MC.S_TOGGLE] = _toggle;
  }
}

// --------------------

const getMethods = element => {
  return {
    _show: async () => {
      await showElement(element); // ignore return val
    },
    _hide: async () => {
      await hideElement(element); // ignore return val
    },
    _toggle: async () => {
      await toggleShowElement(element); // ignore return val
    }
  };
};
//# sourceMappingURL=show.js.map