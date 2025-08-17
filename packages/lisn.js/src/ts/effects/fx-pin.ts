/**
 * @module Effects
 *
 * @since v1.3.0
 */

import * as MH from "@lisn/globals/minification-helpers";

import {
  CallbackHandler,
  Callback,
  addNewCallbackToMap,
  invokeHandlers,
} from "@lisn/modules/callback";

/**
 * {@link FXPin} can be associated with an {@link Effects.Effect | Effects} (for
 * each {@link Effects.FXComposer}) in order to "pin" or freeze them and stop
 * them from being updated.
 */
export abstract class FXPin {
  /**
   * Returns true if the pin is active.
   */
  readonly isPinned: () => boolean;

  /**
   * Calls the given handler whenever the pin's state changes.
   */
  readonly onChange: (handler: FXPinHandler) => void;

  /**
   * Removes a previously added {@link onChange} handler.
   */
  readonly offChange: (handler: FXPinHandler) => void;

  protected constructor() {
    let isPinned = true;
    const changeCallbacks = MH.newMap<FXPinHandler, FXPinCallback>();

    const invokeCallbacks = () =>
      invokeHandlers(changeCallbacks.values(), isPinned, this);

    this.onChange = (handler) => {
      addNewCallbackToMap(changeCallbacks, handler);
    };

    this.offChange = (handler) => {
      MH.remove(changeCallbacks.get(handler));
    };

    this.isPinned = () => isPinned;
  }
}

/**
 * The handler is invoked with two arguments:
 *
 * - The current state of the {@link FXPin} where `true` is ON and `false`
 *   is OFF.
 * - The {@link FXPin} instance.
 */
export type FXPinHandlerArgs = [boolean, FXPin];
export type FXPinCallback = Callback<FXPinHandlerArgs>;
export type FXPinHandler = FXPinCallback | CallbackHandler<FXPinHandlerArgs>;

/**
 * A pin matcher internally keeps track of certain conditions and has a binary
 * state (matches/does not match).
 *
 * Use {@link FXPinMatcherFactory} to define your own custom matchers.
 */
export type FXPinMatcher = {
  /**
   * Should return true if the matcher has matched.
   */
  matches: () => boolean;

  /**
   * Should call the given handler whenever the matcher's state changes.
   */
  onChange: (handler: FXPinMatcherHandler) => void;

  /**
   * Should remove a previously added {@link offChange} handler.
   */
  offChange: (handler: FXPinMatcherHandler) => void;

  /**
   * If the matcher supports relative inputs, such as a **change** in parameter,
   * relative to when it was last restarted, then calling this method should
   * update its internal reference data to be its current data.
   */
  restart: () => void;
};

/**
 * The handler is invoked with two arguments:
 *
 * - The current state of the {@link FXPinMatcher} where `true` means it
 *   matches.
 * - The {@link FXPinMatcher} instance.
 */
export type FXPinMatcherHandlerArgs<T extends FXPinMatcher = FXPinMatcher> = [
  boolean,
  T,
];
export type FXPinMatcherCallback<T extends FXPinMatcher = FXPinMatcher> =
  Callback<FXPinMatcherHandlerArgs<T>>;
export type FXPinMatcherHandler<T extends FXPinMatcher = FXPinMatcher> =
  | FXPinMatcherCallback<T>
  | CallbackHandler<FXPinMatcherHandlerArgs<T>>;

export type FXPinMatcherConstructor<Args extends readonly unknown[]> = {
  new (...args: Args): FXPinMatcher;
};

export type FXPinMatcherStore<D = unknown> = {
  /**
   * Returns the current state, last set using {@link setMatches}.
   */
  getMatches: () => boolean;

  /**
   * Updates the current state.
   */
  setMatches: (matcher: boolean) => void;

  /**
   * Returns the current data, last set using {@link setData}.
   */
  getData: () => D;

  /**
   * Updates the current data.
   */
  setData: (data: D) => void;

  /**
   * Returns the data at the time {@link FXPinMatcher.restart | restart} was
   * last called on the matcher.
   */
  getReferenceData: () => D;
};

/**
 * Creates a new matcher class.
 *
 * @param constructor A function which accepts a {@link FXPinMatcherStore} as
 *                    well as the user-supplied arguments that are passed to the
 *                    constructor. The constructor is responsible for calling
 *                    {@link setMatches} and {@link setData} whenever it's state
 *                    or data change. It will be called inside the class
 *                    constructor with `this` set to the instance.
 * @param init        The initial data for the matcher.
 */
export const FXPinMatcherFactory = <Args extends readonly unknown[], D>(
  constructor: (store: FXPinMatcherStore<D>, ...args: Args) => void,
  init: D,
): FXPinMatcherConstructor<Args> => {
  return class implements FXPinMatcher {
    readonly matches: () => boolean;
    readonly onChange: (handler: FXPinMatcherHandler) => void;
    readonly offChange: (handler: FXPinMatcherHandler) => void;
    readonly restart: () => void;

    constructor(...args: Args) {
      const storeData = { matches: false, data: init, refData: init };

      const store: FXPinMatcherStore<D> = {
        getMatches: () => storeData.matches,
        setMatches: (m) => {
          storeData.matches = m;
          invokeHandlers(changeCallbacks.values(), storeData.matches, this);
        },
        getData: () => storeData.data,
        setData: (data) => {
          storeData.data = data;
        },
        getReferenceData: () => storeData.refData,
      };

      const changeCallbacks = MH.newMap<
        FXPinMatcherHandler,
        FXPinMatcherCallback
      >();

      this.matches = () => storeData.matches;

      this.onChange = (handler: FXPinMatcherHandler) => {
        addNewCallbackToMap(changeCallbacks, handler);
      };

      this.offChange = (handler: FXPinMatcherHandler) => {
        MH.remove(changeCallbacks.get(handler));
      };

      this.restart = () => {
        storeData.refData = storeData.data;
      };

      constructor.call(this, store, ...args);
    }
  };
};
