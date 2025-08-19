/**
 * @module Effects
 *
 * @since v1.3.0
 */

import * as _ from "@lisn/_internal";

import {
  CallbackHandler,
  Callback,
  addNewCallbackToMap,
  invokeHandlers,
} from "@lisn/modules/callback";
import { newXMap } from "@lisn/modules/x-map";

import {
  FXMatcher,
  FXRelativeMatcher,
  FX_MATCH,
} from "@lisn/effects/fx-matcher";

/**
 * {@link FXPin} can be associated with an {@link Effects.Effect | Effects} (for
 * each {@link Effects.FXComposer}) in order to "pin" or freeze them and stop
 * them from being updated.
 *
 * It is activated or deactivated when one or more {@link FXMatcher}s match.
 *
 * There are built-in matchers in {@link FX_MATCH}, or you can create your own
 * by extending {@link FXMatcher}.
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
   *
   * For any {@link FXRelativeMatcher | relative matchers}, their
   * {@link FXMatcher.restart | restart} method will be called when the pin
   * is **deactivated**. Therefore, it does not make sense to add a relative
   * matcher with both {@link when} and {@link until}.
   */
  readonly when: (...matchers: FXMatcher[]) => this;

  /**
   * Like {@link when} but it deactivates the pin when **all** the given
   * matchers match.
   *
   * For any {@link FXRelativeMatcher | relative matchers}, their
   * {@link FXMatcher.restart | restart} method will be called when the pin
   * is **activated**. Therefore, it does not make sense to add a relative
   * matcher with both {@link when} and {@link until}.
   */
  readonly until: (...matchers: FXMatcher[]) => this;

  /**
   * Activates the pin when **all** the given matchers match and deactivates it
   * when **none** of them match. It is equivalent to calling {@link when},
   * followed by {@link until} with negated matchers.
   *
   * ```javascript
   * pin.while(matcherA, matcherB, matcherC);
   *
   * // This is equivalent to:
   *
   * pin.when(matcherA, matcherB, matcherC);
   * pin.until(...[matcherA, matcherB, matcherC].map(m => FX_MATCH.negate(m)));
   * ```
   */
  readonly while: (...matchers: FXMatcher[]) => this;

  /**
   * Calls the given handler whenever the pin's state changes.
   *
   * The handler is called after updating the state, such that calling
   * {@link isActive} from the handler will reflect the latest state.
   */
  readonly onChange: (handler: FXPinHandler) => void;

  /**
   * Removes a previously added {@link onChange} handler.
   */
  readonly offChange: (handler: FXPinHandler) => void;

  constructor() {
    let isActive = true;

    const changeCallbacks = _.newMap<FXPinHandler, FXPinCallback>();

    const matcherGroups = newXMap<
      FXMatcher,
      Array<{
        _activate: boolean;
        _group: FXMatcher[];
      }>
    >(() => []);

    const setState = (activate: boolean) => {
      if (isActive !== activate) {
        isActive = activate;

        for (const [m, entries] of matcherGroups) {
          if (_.isInstanceOf(m, FXRelativeMatcher)) {
            for (const entry of entries) {
              if (entry._activate !== activate) {
                m.restart();
              }
            }
          }
        }

        invokeHandlers(changeCallbacks.values(), activate, this);
      }
    };

    const addMatcherGroup = (activate: boolean, matchers: FXMatcher[]) => {
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

    const onMatcherChange = (matches: boolean, matcher: FXMatcher) => {
      const entries = matcherGroups.get(matcher) ?? [];
      for (const entry of entries) {
        if (entry._group.every((m) => m.matches())) {
          setState(entry._activate);
        }
      }
    };

    // --------------------

    this.onChange = (handler) => {
      addNewCallbackToMap(changeCallbacks, handler);
    };

    this.offChange = (handler) => {
      _.remove(changeCallbacks.get(handler));
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
      this.when(...matchers).until(...matchers.map((m) => FX_MATCH.negate(m)));
  }
}

/**
 * The handler is invoked with two arguments:
 *
 * - `true` if the pin is now active, `false` if it's inactive.
 * - The {@link FXPin} instance.
 */
export type FXPinHandlerArgs = [boolean, FXPin];
export type FXPinCallback = Callback<FXPinHandlerArgs>;
export type FXPinHandler = FXPinCallback | CallbackHandler<FXPinHandlerArgs>;

_.brandClass(FXPin, "FXPin");
