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
import { createXMap } from "@lisn/modules/x-map";

import { FXMatcher, FX_MATCH } from "@lisn/effects/fx-matcher";
import { bugError } from "@lisn/globals";

/**
 * {@link FXPin} can be associated with an {@link Effects.Effect | Effects} (via
 * {@link Effects.FXComposer.add | FXComposer.add}) in order to "pin" or freeze
 * effects and stop them from being updated by the composer.
 *
 * It is activated or deactivated based on various conditions built by calling
 * {@link when}, {@link until} or {@link while}.
 *
 * To understand how {@link when}, {@link until} and {@link while} work together,
 * think of the following analogy. The pin itself is like a light (when it's
 * active, the light is ON), and each call to {@link when}, {@link until} or
 * {@link while} adds a single new condition which is like a "switch" for the
 * light.
 *
 * - Calling {@link while} is like installing a stateful latching toggle switch:
 *   push ON, push OFF. While the condition is fulfilled, the pin is active
 *   **and stays active** no matter what. When **none** of the {@link while}
 *   conditions are fulfilled anymore, the pin is deactivated.
 *
 * - Calling {@link when} is like installing a stateless one-way "tap to
 *   activate" switch. When the condition is fulfilled, the pin is activated.
 *
 * - Calling {@link until} is like installing a stateless one-way "tap to
 *   deactivate" switch. It works similarly to the {@link when} condition,
 *   except that when the condition is fulfilled the pin will **only be
 *   deactivated if no {@link while} conditions are currently fulfilled**.
 *
 * Conditions added in any of these ways are checked at the time of being added
 * and the pin may be activated or deactivated as explained above.
 *
 * Each condition is a set of one or more matchers and/or other pins. For a
 * condition to be fulfilled, **all** of the given matchers must match and
 * **all** of the given pins must be active.
 */
export class FXPin {
  /**
   * Returns true if the pin is active.
   */
  readonly isActive: () => boolean;

  /**
   * The pin will be activated when all of the given matchers/pins match/are
   * activated. This is a one-way "activate now" condition.
   *
   * If you are using any relative matchers here, you may want to
   * {@link Effects.FXRelativeMatcher.restart | restart} them
   * {@link onChange | when the pin is deactivated}.
   */
  readonly when: (...matchers: Array<FXMatcher | FXPin>) => this;

  /**
   * The pin will be deactivated when all of the given matchers/pins match/are
   * activated, unless there are {@link while} conditions that are currently
   * fulfilled. This is a one-way "deactivate now if possible" condition.
   *
   * If you are using any relative matchers here, you may want to
   * {@link Effects.FXRelativeMatcher.restart | restart} them
   * {@link onChange | when the pin is activated}.
   */
  readonly until: (...matchers: Array<FXMatcher | FXPin>) => this;

  /**
   * The pin will be activated when all of the given matchers/pins match/are
   * activate. The pin will be deactivated when this and all other conditions
   * added with {@link while} are no longer fulfilled.
   */
  readonly while: (...matchers: Array<FXMatcher | FXPin>) => this;

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
    let isActive = false;
    let numFulfilledLocking = 0; // number of fulfilled while conditions
    let numLocking = 0; // total number of while conditions; for testing

    const changeCallbacks = _.createMap<FXPinHandler, FXPinCallback>();

    const conditions = createXMap<FXMatcher, Condition[]>(() => []);

    const isLocked = () => numFulfilledLocking > 0;

    const incrementLocking = () => {
      if (numFulfilledLocking === numLocking) {
        throw bugError("FXPin: number of locking conditions > maximum");
      }

      numFulfilledLocking++;
      setState(true);
    };

    const decrementLocking = () => {
      if (!isLocked()) {
        throw bugError("FXPin: number of locking conditions < 0");
      }

      numFulfilledLocking--;

      if (!isLocked()) {
        setState(false); // deactivate
      }
    };

    const setState = (activate: boolean) => {
      if (isActive !== activate && (activate || !isLocked())) {
        isActive = activate;
        invokeHandlers(changeCallbacks.values(), activate, this);
      }
    };

    const addCondition = (
      type: CONDITION_TYPE,
      matchersOrPins: Array<FXMatcher | FXPin>,
    ) => {
      if (type === LOCK) {
        numLocking++;
      }

      const matchers = matchersOrPins.map((e) =>
        _.isInstanceOf(e, FXPin) ? FX_MATCH.pin(e) : e,
      );

      const condition: Condition = {
        _type: type,
        _fulfilled: false,
        _group: matchers,
      };

      for (const matcher of matchers) {
        conditions.sGet(matcher).push(condition);
        matcher.onChange(onMatcherChange);
      }

      // check the current state now
      checkCondition(condition);

      return this;
    };

    const checkCondition = (condition: Condition) => {
      const isFulfilled = condition._group.every((m) => m.matches());

      if (isFulfilled === condition._fulfilled) {
        return; // no change
      }

      condition._fulfilled = isFulfilled;

      if (condition._type === LOCK) {
        if (isFulfilled) {
          incrementLocking();
        } else {
          decrementLocking();
        }
      } else if (isFulfilled) {
        setState(condition._type === ACTIVATE ? true : false); // will check if locked
      }
    };

    const onMatcherChange = (matches: boolean, matcher: FXMatcher) => {
      const matcherConditions = conditions.get(matcher) ?? [];
      for (const condition of matcherConditions) {
        checkCondition(condition);
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
    this.when = (...matchers) => addCondition(ACTIVATE, matchers);
    this.until = (...matchers) => addCondition(DEACTIVATE, matchers);
    this.while = (...matchers) => addCondition(LOCK, matchers);
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

// ------------------------------

type Condition = {
  _type: CONDITION_TYPE;
  _fulfilled: boolean;
  _group: FXMatcher[];
};

type CONDITION_TYPE = typeof ACTIVATE | typeof DEACTIVATE | typeof LOCK;
const ACTIVATE = 0;
const DEACTIVATE = 1;
const LOCK = 2;
