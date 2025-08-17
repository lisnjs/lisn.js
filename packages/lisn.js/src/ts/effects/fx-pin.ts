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
import { newXMap } from "@lisn/modules/x-map";

/**
 * {@link FXPin} can be associated with an {@link Effects.Effect | Effects} (for
 * each {@link Effects.FXComposer}) in order to "pin" or freeze them and stop
 * them from being updated.
 *
 * It is activated or deactivated when one or more {@link FXPinMatcher}s match.
 *
 * There are built-in matchers in {@link PIN_MATCHERS}, or you can create your
 * own (see {@link createFXPinMatcherType}).
 */
export class FXPin {
  /**
   * Returns true if the pin is active.
   */
  readonly isActive: () => boolean;

  /**
   * Activates the pin when **all** the given matchers match. If you want to pin
   * when any one of a list of matchers match, call {@link} when multiple times,
   * passing it one matcher at a time.
   *
   * You can call {@link when} multiple times: each one adds an independent
   * set of matchers to watch and when all matchers in a set match, the pin is
   * activated.
   */
  readonly when: (...matchers: FXPinMatcher[]) => this;

  /**
   * Like {@link when} but it deactivates the pin when **all** the given
   * matchers match.
   */
  readonly until: (...matchers: FXPinMatcher[]) => this;

  /**
   * Activates the pin when **all** the given matchers match and deactivates it
   * when **none** of them match.
   *
   * ```javascript
   * pin.while(matcherA, matcherB, matcherC);
   *
   * // This is equivalent to:
   *
   * pin.when(matcherA, matcherB, matcherC);
   * pin.until(...[matcherA, matcherB, matcherC].map(m => PIN_MATCHERS.negate(m)));
   * ```
   */
  readonly while: (...matchers: FXPinMatcher[]) => this;

  /**
   * Calls the given handler whenever the pin's state changes.
   */
  readonly onChange: (handler: FXPinHandler) => void;

  /**
   * Removes a previously added {@link onChange} handler.
   */
  readonly offChange: (handler: FXPinHandler) => void;

  constructor() {
    let isActive = true;

    const changeCallbacks = MH.newMap<FXPinHandler, FXPinCallback>();

    const matcherGroups = newXMap<
      FXPinMatcher,
      Array<{
        _activate: boolean;
        _group: FXPinMatcher[];
      }>
    >(() => []);

    const setState = (activate: boolean) => {
      if (isActive !== activate) {
        isActive = activate;
        invokeHandlers(changeCallbacks.values(), isActive, this);
      }
    };

    const addMatcherGroup = (activate: boolean, matchers: FXPinMatcher[]) => {
      const entry = {
        _activate: activate,
        _group: matchers,
      };

      for (const m of matchers) {
        const entries = matcherGroups.sGet(m);
        entries.push(entry);
        m.onChange(onMatcherChange);
      }
    };

    const onMatcherChange = (matches: boolean, matcher: FXPinMatcher) => {
      const sets = matcherGroups.get(matcher) ?? [];
      for (const s of sets) {
        if (s._group.every((m) => m.matches())) {
          setState(s._activate);
        }
      }
    };

    // --------------------

    this.onChange = (handler) => {
      addNewCallbackToMap(changeCallbacks, handler);
    };

    this.offChange = (handler) => {
      MH.remove(changeCallbacks.get(handler));
    };

    this.isActive = () => isActive;

    this.when = (...matchers) => {
      addMatcherGroup(true, matchers);
      return this;
    };

    this.until = (...matchers) => {
      addMatcherGroup(false, matchers);
      return this;
    };

    this.while = (...matchers) =>
      this.when(...matchers).until(
        ...matchers.map((m) => PIN_MATCHERS.negate(m)),
      );
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

export type FXPinMatcherFactory<Args extends readonly unknown[]> = {
  (...args: Args): FXPinMatcher;
};

export type FXPinMatcherStore<D = unknown> = {
  /**
   * Returns the current state, last set using {@link setState}.
   */
  getState: () => boolean;

  /**
   * Updates the current state.
   */
  setState: (matcher: boolean) => void;

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
 * @param executor A function which accepts a {@link FXPinMatcherStore} as well
 *                 as the user-supplied arguments that are passed to the
 *                 executor. The executor is responsible for calling {@link
 *                 setState} and {@link setData} whenever it's state or data
 *                 change. It will be called inside the class executor with
 *                 `this` set to the newly created matcher, in case it needs
 *                 access to it.
 * @param init     The initial data for the matcher.
 */
export const createFXPinMatcherType = <Args extends readonly unknown[], D>(
  executor: (store: FXPinMatcherStore<D>, ...args: Args) => void,
  init: D,
): FXPinMatcherFactory<Args> => {
  return function (...args: Args): FXPinMatcher {
    const storeData = { matches: false, data: init, refData: init };

    const store: FXPinMatcherStore<D> = {
      getState: () => storeData.matches,
      setState: (m) => {
        if (storeData.matches !== m) {
          storeData.matches = m;
          invokeHandlers(changeCallbacks.values(), storeData.matches, self);
        }
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

    const self: FXPinMatcher = {
      matches: () => storeData.matches,

      onChange: (handler: FXPinMatcherHandler) => {
        addNewCallbackToMap(changeCallbacks, handler);
      },

      offChange: (handler: FXPinMatcherHandler) => {
        MH.remove(changeCallbacks.get(handler));
      },

      restart: () => {
        storeData.refData = storeData.data;
      },
    };

    executor.call(self, store, ...args);

    return self;
  };
};

// ----------

export const PIN_MATCHERS = {
  negate: createFXPinMatcherType((store, matcher: FXPinMatcher) => {
    store.setState(!matcher.matches());
    matcher.onChange((state) => store.setState(!state));
  }, null),
} as const;
