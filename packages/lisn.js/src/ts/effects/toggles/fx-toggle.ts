/**
 * @module Effects/Toggles
 *
 * @since v1.3.0
 */

import * as MH from "@lisn/globals/minification-helpers";

import {
  CallbackHandler,
  Callback,
  addNewCallbackToSet,
  invokeCallbackSet,
} from "@lisn/modules/callback";

export abstract class FXToggle {
  /**
   * Turns the toggle off. If it's already off, it does nothing.
   *
   * The handler is called after updating the state, such that calling
   * {@link isON} from the handler will return `false`.
   */
  readonly turnOFF: () => void;

  /**
   * Turns the toggle on. If it's already on, it does nothing.
   *
   * The handler is called after updating the state, such that calling
   * {@link isON} from the handler will return `true`.
   */
  readonly turnON: () => void;

  /**
   * Swaps the state of the toggle.
   *
   * The handler is called after updating the state, such that calling
   * {@link isON} from the handler will return the new state.
   */
  readonly toggle: () => void;

  /**
   * Calls the given handler whenever the toggle's state changes.
   */
  readonly onToggle: (handler: FXToggleHandler) => void;

  /**
   * Returns true if the toggle is enabled.
   */
  readonly isON: () => boolean;

  protected constructor() {
    let isON = true;
    const toggleCallbacks = MH.newSet<FXToggleCallback>();

    const invokeCallbacks = () =>
      invokeCallbackSet(toggleCallbacks, isON, this);

    this.turnOFF = () => {
      if (isON) {
        this.toggle();
      }
    };

    this.turnON = () => {
      if (!isON) {
        this.toggle();
      }
    };

    this.toggle = () => {
      isON = !isON;
      invokeCallbacks();
    };

    this.onToggle = (handler) => addNewCallbackToSet(handler, toggleCallbacks);

    this.isON = () => isON;
  }
}

/**
 * The handler is invoked with two arguments:
 *
 * - The current state of the {@link FXToggle} where `true` is ON and `false`
 *   is OFF.
 * - The {@link FXToggle} instance.
 */
export type FXToggleHandlerArgs = [boolean, FXToggle];
export type FXToggleCallback = Callback<FXToggleHandlerArgs>;
export type FXToggleHandler =
  | FXToggleCallback
  | CallbackHandler<FXToggleHandlerArgs>;
