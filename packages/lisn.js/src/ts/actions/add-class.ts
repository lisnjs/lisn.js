/**
 * @module Actions
 *
 * @categoryDescription Adding/removing class
 * {@link AddClass} and {@link RemoveClass} add or remove a list of CSS classes
 * to/from the given element.
 */

import * as _ from "@lisn/_internal";

import {
  addClasses,
  removeClasses,
  toggleClasses,
} from "@lisn/utils/css-alter";

import { Action, registerAction } from "@lisn/actions/action";

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
 * - Arguments (required): one or more CSS classes
 * - Options: none
 *
 * @example
 * ```html
 * <div data-lisn-on-view="@add-class: clsA, clsB"></div>
 * ```
 *
 * @category Adding/removing class
 */
export class AddClass implements Action {
  /**
   * Adds the classes given to the constructor.
   */
  readonly do: () => Promise<void>;

  /**
   * Removes the classes given to the constructor.
   */
  readonly undo: () => Promise<void>;

  /**
   * Toggles each class given to the constructor.
   */
  readonly toggle: () => Promise<void>;

  static register() {
    registerAction(
      "add-class",
      (element, classNames) => new AddClass(element, ...classNames),
    );
  }

  constructor(element: Element, ...classNames: string[]) {
    const { _add, _remove, _toggle } = getMethods(element, classNames);
    _remove(); // initial state

    this.do = _add;
    this.undo = _remove;
    this[_.S_TOGGLE] = _toggle;
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
 * - Arguments (required): one or more CSS classes
 * - Options: none
 *
 * @example
 * ```html
 * <div data-lisn-on-view="@remove-class: clsA, clsB"></div>
 * ```
 *
 * @category Adding/removing class
 */
export class RemoveClass implements Action {
  /**
   * Removes the classes given to the constructor.
   */
  readonly do: () => Promise<void>;

  /**
   * Adds the classes given to the constructor.
   */
  readonly undo: () => Promise<void>;

  /**
   * Toggles each class given to the constructor.
   */
  readonly toggle: () => Promise<void>;

  static register() {
    registerAction(
      "remove-class",
      (element, classNames) => new RemoveClass(element, ...classNames),
    );
  }

  constructor(element: Element, ...classNames: string[]) {
    const { _add, _remove, _toggle } = getMethods(element, classNames);
    _add(); // initial state

    this.do = _remove;
    this.undo = _add;
    this[_.S_TOGGLE] = _toggle;
  }
}

// --------------------

const getMethods = (element: Element, classNames: string[]) => {
  return {
    _add: () => addClasses(element, ...classNames),
    _remove: () => removeClasses(element, ...classNames),
    _toggle: () => toggleClasses(element, ...classNames),
  };
};

_.brandClass(AddClass, "AddClass");
_.brandClass(RemoveClass, "RemoveClass");
