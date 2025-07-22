/**
 * @module Actions
 *
 * @categoryDescription Controlling openables
 * {@link Open} opens or closes the {@link Openable} widget setup for the given
 * element.
 */

import * as MC from "@lisn/globals/minification-constants";

import { Openable } from "@lisn/widgets/openable";
import { fetchUniqueWidget } from "@lisn/widgets/widget";

import { Action, registerAction } from "@lisn/actions/action";

/**
 * Opens or closes the {@link Openable} widget setup for the given element.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "open".
 * - Arguments: none
 * - Options: none
 *
 * @example
 * ```html
 * <div class="lisn-modal" data-lisn-on-view="@open +reference=top:50%"></div>
 * ```
 *
 * @category Controlling openables
 */
export class Open implements Action {
  /**
   * Opens the Openable widget setup for the element.
   */
  readonly do: () => Promise<void>;

  /**
   * Closes the Openable widget setup for the element.
   */
  readonly undo: () => Promise<void>;

  /**
   * Toggles the Openable widget setup for the element.
   */
  readonly toggle: () => Promise<void>;

  static register() {
    registerAction("open", (element) => new Open(element));
  }

  constructor(element: Element) {
    const open = (widget: Openable | null) => widget?.open();
    const close = (widget: Openable | null) => widget?.close();
    const toggle = (widget: Openable | null) => widget?.toggle();

    const widgetPromise = fetchUniqueWidget("openable", element, Openable);

    this.do = () => widgetPromise.then(open);
    this.undo = () => widgetPromise.then(close);
    this[MC.S_TOGGLE] = () => widgetPromise.then(toggle);
  }
}
