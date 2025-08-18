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
 * A pin matcher internally keeps track of certain conditions and has a binary
 * state (matches/does not match).
 *
 * This is a generic class that accepts a custom executor function. You want to
 * subclass it when defining your own matcher types.
 *
 * @param executor A function which accepts a {@link FXPinMatcherStore}. The
 *                 executor is responsible for calling
 *                 {@link FXPinMatcher.setState | store.setState} whenever it's
 *                 state changes. It will be called inside the class constructor
 *                 with `this` set to the newly created matcher.
 */
export abstract class FXPinMatcher {
  /**
   * Returns true if the matcher has matched.
   */
  matches: () => boolean;

  /**
   * Calls the given handler whenever the matcher's state changes.
   */
  onChange: (handler: FXPinMatcherHandler) => void;

  /**
   * Removes a previously added {@link offChange} handler.
   */
  offChange: (handler: FXPinMatcherHandler) => void;

  protected constructor(executor: (store: FXPinMatcherStore) => void) {
    const storeData = { matches: false };

    const store: FXPinMatcherStore = {
      getState: () => storeData.matches,
      setState: (m) => {
        if (storeData.matches !== m) {
          storeData.matches = m;
          invokeHandlers(changeCallbacks.values(), storeData.matches, this);
        }
      },
    };

    const changeCallbacks = MH.newMap<
      FXPinMatcherHandler,
      FXPinMatcherCallback
    >();

    // --------------------

    this.matches = () => storeData.matches;

    this.onChange = (handler: FXPinMatcherHandler) => {
      addNewCallbackToMap(changeCallbacks, handler);
    };

    this.offChange = (handler: FXPinMatcherHandler) => {
      MH.remove(changeCallbacks.get(handler));
    };

    executor.call(this, store);
  }
}

/**
 * A relative pin matcher is a type of matcher that supports relative inputs
 * (e.g. "+200") and XXX
 *
 * This is a generic class that accepts a custom executor function. You want to
 * subclass it when defining your own matcher types.
 *
 * @param executor A function which accepts a {@link FXPinMatcherStore}. The
 *                 executor is responsible for calling
 *                 {@link FXPinMatcher.setState | store.setState} and
 *                 {@link FXPinMatcher.setData | store.setData} whenever it's
 *                 state or data change. It will be called inside the class
 *                 constructor with `this` set to the newly created matcher.
 */
export abstract class FXPinRelativeMatcher<D = unknown> extends FXPinMatcher {
  /**
   * Updates the matcher's internal reference data to be its current data.
   */
  restart: () => void;

  protected constructor(
    executor: (store: FXPinRelativeMatcherStore<D>) => void,
  ) {
    let baseStore: FXPinMatcherStore;
    super((store) => (baseStore = store));

    const storeData: { data?: D; refData?: D } = {};

    const store: FXPinRelativeMatcherStore<D> = {
      getState: () => baseStore.getState(),
      setState: (m) => baseStore.setState(m),
      getData: () => storeData.data,
      setData: (data) => {
        storeData.data = data;
      },
      getReferenceData: () => storeData.refData,
    };

    // --------------------

    this.restart = () => {
      storeData.refData = storeData.data;
    };

    executor.call(this, store);
  }
}

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

/**
 * Internal state and data management for a matcher to be used by its executor.
 */
export type FXPinMatcherStore = {
  /**
   * Returns the current state, last set using {@link setState}.
   */
  getState: () => boolean;

  /**
   * Updates the current state.
   */
  setState: (matcher: boolean) => void;
};

/**
 * Internal state and data management for a relative matcher to be used by its
 * executor.
 *
 * @interface
 */
export type FXPinRelativeMatcherStore<D = unknown> = FXPinMatcherStore & {
  /**
   * Returns the current data, last set using {@link setData}.
   */
  getData: () => D | undefined;

  /**
   * Updates the current data.
   */
  setData: (data: D) => void;

  /**
   * Returns the data at the time {@link FXPinMatcher.restart | restart} was
   * last called on the matcher.
   */
  getReferenceData: () => D | undefined;
};

// ----------

/**
 * Negates the given matcher. {@link FXPinMatcher.restart | restarting} it
 * **won't** call the restart method on the original matcher.
 */
export class FXPinNegateMatcher extends FXPinMatcher {
  constructor(matcher: FXPinMatcher) {
    const executor = (store: FXPinMatcherStore) => {
      store.setState(!matcher.matches());
      matcher.onChange((state) => store.setState(!state));
    };
    super(executor);
  }
}

/**
 * Function wrappers around built-in matchers.
 */
export const PIN_MATCHERS = {
  negate: (matcher: FXPinMatcher) => new FXPinNegateMatcher(matcher),
} as const;
