function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Actions
 *
 * @categoryDescription Adding/removing class
 * {@link AddClass} and {@link RemoveClass} add or remove a list of CSS classes
 * to/from the given element.
 */

import * as MC from "../globals/minification-constants.js";
import { addClasses, removeClasses, toggleClasses } from "../utils/css-alter.js";
import { registerAction } from "./action.js";

/**
 * Adds or removes a list of CSS classes to/from the given element.
 *
 * **IMPORTANT:** When constructed, it removes all given classes from the
 * element as a form of initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "add-class".
 * - Accepted string arguments: one or more CSS classes
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div data-lisn-on-view="@add-class: clsA, clsB"></div>
 * ```
 *
 * @category Adding/removing class
 */
export class AddClass {
  static register() {
    registerAction("add-class", (element, classNames) => new AddClass(element, ...classNames));
  }
  constructor(element, ...classNames) {
    /**
     * Adds the classes given to the constructor.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Removes the classes given to the constructor.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Toggles each class given to the constructor.
     */
    _defineProperty(this, "toggle", void 0);
    const {
      _add,
      _remove,
      _toggle
    } = getMethods(element, classNames);
    _remove(); // initial state

    this.do = _add;
    this.undo = _remove;
    this[MC.S_TOGGLE] = _toggle;
  }
}

/**
 * Removes or adds a list of CSS classes to/from the given element.
 *
 * **IMPORTANT:** When constructed, it adds all given classes from the element
 * as a form of initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "remove-class".
 * - Accepted string arguments: one or more CSS classes
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div data-lisn-on-view="@remove-class: clsA, clsB"></div>
 * ```
 *
 * @category Adding/removing class
 */
export class RemoveClass {
  static register() {
    registerAction("remove-class", (element, classNames) => new RemoveClass(element, ...classNames));
  }
  constructor(element, ...classNames) {
    /**
     * Removes the classes given to the constructor.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Adds the classes given to the constructor.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Toggles each class given to the constructor.
     */
    _defineProperty(this, "toggle", void 0);
    const {
      _add,
      _remove,
      _toggle
    } = getMethods(element, classNames);
    _add(); // initial state

    this.do = _remove;
    this.undo = _add;
    this[MC.S_TOGGLE] = _toggle;
  }
}

// --------------------

const getMethods = (element, classNames) => {
  return {
    _add: () => addClasses(element, ...classNames),
    _remove: () => removeClasses(element, ...classNames),
    _toggle: () => toggleClasses(element, ...classNames)
  };
};
//# sourceMappingURL=add-class.js.map