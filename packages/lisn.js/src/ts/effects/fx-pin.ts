/**
 * @module Effects
 *
 * @since v1.3.0
 *
 * @categoryDescription Pinning
 * {@link FXPin} can be associated with an {@link Effects.Effect | Effects}
 * (via {@link Effects.FXComposer.add | FXComposer.add}) in order to "pin" or
 * freeze effects and stop them from being updated by the composer.
 *
 * It is activated or deactivated based on various {@link FXPin.when | when},
 * {@link FXPin.until | until} or {@link FXPin.while | while} conditions defined
 * by {@link FXClamp}s.
 */

import * as _ from "@lisn/_internal";

import { bugError, usageError } from "@lisn/globals/errors";

import { logError } from "@lisn/utils/log";

import { FXComposer } from "@lisn/effects/fx-composer";
import {
  FXClamp,
  FXClampInstance,
  createClampInstance,
} from "@lisn/effects/fx-clamp";
import { FXState } from "@lisn/effects/types";

import { createXWeakMap } from "@lisn/modules/x-map";

import debug from "@lisn/debug/debug";

/**
 * {@link FXPin} can be associated with {@link Effects.Effect | effects}
 * in order to temporarily "pin" or freeze effects to a certain composer state
 * and prevent them from being further updated by the composer.
 *
 * The pin is configured based on various {@link when}, {@link until} or
 * {@link while} conditions based on {@link FXClamp}s.
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
 *   deactivate" switch. It works similarly to the {@link when} switch,
 *   except that when the condition is fulfilled the pin will **only be
 *   deactivated if there are no {@link while} conditions are currently
 *   fulfilled**.
 *
 * Each condition is a set of one or more {@link FXClamp | clamp}s. For a
 * condition to be fulfilled, **all** of the given clamps must be active.
 *
 * So passing multiple clamps to a single call to {@link while}, {@link when}
 * and {@link until} is like joining the clamps with an AND clause. And each
 * subsequent call to {@link while}, {@link when} and {@link until} is like
 * joining those conditions with an OR clause.
 *
 * **NOTE:**
 * When the pin is activated, it will
 * {@link FXClampInstance.restart | restart} all {@link until} clamps
 * and pause all {@link when} and {@link while} clamps until the pin is
 * deactivated again.
 *
 * When the pin is deactivated, it will restart all {@link when} and
 * {@link while} clamps and pause all {@link until} clamps until the pin
 * is activated again.
 *
 * @category Pinning
 */
export class FXPin {
  /**
   * The pin will be activated when **all** of the given clamps are active.
   * The actual clamp used by the pin will be the last clamp to be activated.
   * This is a one-way "pin now" condition.
   */
  readonly when: (...clamps: FXClamp[]) => this;

  /**
   * The pin will be deactivated when **all** of the given clamps are active,
   * unless there are {@link while} conditions that are currently fulfilled and
   * thus locking the pin into an active state. This is a one-way "deactivate
   * now if possible" condition.
   */
  readonly until: (...clamps: FXClamp[]) => this;

  /**
   * The pin will be activated when **all** of the given clamps are active (see
   * {@link when}) and deactivated when this condition and all other
   * {@link while} conditions are no longer fulfilled i.e. at least one clamp
   * in each of the sets of clamps added with {@link while} is inactive. This
   * is a two-way "activate and lock, or deactivate" condition.
   */
  readonly while: (...clamps: FXClamp[]) => this;

  constructor() {
    const conditionBuilders: ConditionBuilders = {
      _when: [],
      _until: [],
      _while: [],
    };

    this.when = (...matchers) => {
      conditionBuilders._when.push(matchers);
      return this;
    };

    this.until = (...matchers) => {
      conditionBuilders._until.push(matchers);
      return this;
    };

    this.while = (...matchers) => {
      conditionBuilders._while.push(matchers);
      return this;
    };

    allBuilderData.set(this, conditionBuilders);
  }
}

/**
 * @category Base
 */
export interface FXPinInstance {
  /**
   * Pauses all clamps.
   */
  readonly pause: () => void;

  /**
   * Pauses all relevant clamps (if the pin was active prior to pausing, it
   * will resume all {@link FXPin.until | until} clamps, otherwise it will
   * resume the other clamps.
   */
  readonly resume: () => void;

  /**
   * Returns true if the pin is actively clamping (and it's not paused).
   */
  readonly isActive: () => boolean;

  /**
   * Returns a possibly clamped composer state, limited to fit within the
   * bounds configured by the clamps.
   *
   * If the pin is not {@link isActive | active} or it's
   * {@link pause | paused}, it returns the unmodified composer state.
   */
  readonly getClampedState: () => FXState;
}

// --------------------

/**
 * @internal
 * @ignore
 */
export const getPinInstance = (pin: FXPin, composer: FXComposer) =>
  allInstances.get(pin)?.get(composer);

/**
 * @internal
 * @ignore
 */
export const getOrCreatePinInstance = (
  pin: FXPin,
  composer: FXComposer,
): FXPinInstance => {
  if (!_.isInstanceOf(pin, FXPin)) {
    throw usageError("Object is not an FXPin");
  }

  const existing = allInstances.get(pin)?.get(composer);
  if (existing) {
    return existing;
  }

  const conditionBuilders = allBuilderData.get(pin);
  if (!conditionBuilders) {
    throw bugError("No init data saved for pin");
  }

  const logger = debug
    ? new debug.Logger({
        name: "FXPin",
      })
    : null;

  let isPaused = true; // we start when initialized
  let effectiveClampedState: FXState | null = null;
  let numFulfilledLocking = 0; // number of fulfilled while conditions
  let numLocking = 0; // total number of while conditions; for testing

  const conditions = _.createMap<FXClampInstance, Condition>();
  const clampStates = _.createMap<FXClampInstance, FXState | null>();

  // ----------

  const addConditions = (type: CONDITION_TYPE, clampsSets: FXClamp[][]) => {
    for (const set of clampsSets) {
      if (type === LOCK) {
        numLocking++;
      }

      const clamps = set.map((c): FXClampInstance => {
        const clampInstance = createClampInstance(
          c,
          composer,
          (clampedState) => {
            onClampChange(clampInstance, clampedState);
          },
        );

        return clampInstance;
      });

      const condition: Condition = {
        _type: type,
        _fulfilled: false,
        _clamps: clamps,
      };

      for (const c of clamps) {
        conditions.set(c, condition);
        clampStates.set(c, null);
      }
    }
  };

  addConditions(ACTIVATE, conditionBuilders._when);
  addConditions(DEACTIVATE, conditionBuilders._until);
  addConditions(LOCK, conditionBuilders._while);

  // ----------

  const onClampChange = (
    clampInstance: FXClampInstance,
    clampedState: FXState | null,
  ) => {
    clampStates.set(clampInstance, clampedState);

    const condition = conditions.get(clampInstance);
    if (condition) {
      const fulfilled = condition._clamps.every((c) => !!clampStates.get(c));
      if (fulfilled !== condition._fulfilled) {
        condition._fulfilled = fulfilled;
        onConditionChange(condition, clampedState);
      }
    }
  };

  // ----------

  const isLocked = () => numFulfilledLocking > 0;

  const isActive = () => !isPaused && !!effectiveClampedState;

  // ----------

  const incrementLocking = () => {
    /* istanbul ignore next */
    if (numFulfilledLocking === numLocking) {
      logError(bugError("FXPin: number of locking conditions > maximum"));
      return;
    }

    numFulfilledLocking++;
  };

  const decrementLocking = () => {
    /* istanbul ignore next */
    if (!isLocked()) {
      logError(bugError("FXPin: number of locking conditions < 0"));
      return;
    }

    numFulfilledLocking--;
  };

  // ----------

  const onConditionChange = (
    condition: Condition,
    clampedState: FXState | null,
  ) => {
    let activate;

    logger?.debug7("Condidtion changed", condition);

    if (condition._type === LOCK) {
      if (condition._fulfilled) {
        incrementLocking();
        activate = true;
      } else {
        decrementLocking();
        activate = false;
      }
    } else if (condition._fulfilled) {
      activate = condition._type === ACTIVATE;
    } else {
      return; // one-way condition no longer fulfilled doesn't change the state
    }

    const isClamping = !!effectiveClampedState;
    // Only change if the current active state of the clamp has changed, and do
    // not deactivate if it's locked.
    if (isClamping !== activate && (activate || !isLocked())) {
      effectiveClampedState = activate ? clampedState : null;
      setState(activate ? RESUME : PAUSE, CLAMP_RESTART);
    }
  };

  // ----------

  const setState = (
    state: RUNNING_STATE,
    resumeMode: CLAMP_RESUME_MODE = CLAMP_RESUME,
  ) => {
    if (isPaused !== (state === PAUSE)) {
      isPaused = !isPaused;

      logger?.debug6("Setting pin state", { isPaused });

      for (const condition of conditions.values()) {
        for (const clampInstance of condition._clamps) {
          // We'll pause the clamp if either:
          // - we're pausing the pin
          // - the pin is actively clamping and the clamp instance is of type
          //   ACTIVATE or LOCK
          // - the pin is not paused but not actively clamping and the clamp
          //   instance is of type DEACTIVATE
          if (isPaused || isActive() === (condition._type !== DEACTIVATE)) {
            clampInstance.pause();
          } else {
            (resumeMode === CLAMP_RESTART
              ? clampInstance.restart
              : clampInstance.resume)();
          }
        }
      }
    }
  };

  // --------------------

  const self: FXPinInstance = {
    pause: () => setState(PAUSE),
    resume: () => setState(RESUME),
    isActive,
    getClampedState: () =>
      !isPaused && effectiveClampedState
        ? _.copyNested(effectiveClampedState)
        : composer.getState(),
  };

  allInstances.sGet(pin).set(composer, self);

  setState(RESUME, CLAMP_RESTART); // resume and restart relevant clamps

  return self;
};

// ------------------------------

type Condition = {
  _type: CONDITION_TYPE;
  _fulfilled: boolean;
  _clamps: FXClampInstance[];
};

type ConditionBuilders = {
  _when: FXClamp[][];
  _until: FXClamp[][];
  _while: FXClamp[][];
};

type CONDITION_TYPE = typeof ACTIVATE | typeof DEACTIVATE | typeof LOCK;
const ACTIVATE: unique symbol = _.SYMBOL() as typeof ACTIVATE; // i.e. when
const DEACTIVATE: unique symbol = _.SYMBOL() as typeof DEACTIVATE; // i.e. until
const LOCK: unique symbol = _.SYMBOL() as typeof LOCK; // i.e. while

type RUNNING_STATE = typeof PAUSE | typeof RESUME;
const PAUSE: unique symbol = _.SYMBOL() as typeof PAUSE;
const RESUME: unique symbol = _.SYMBOL() as typeof RESUME;

type CLAMP_RESUME_MODE = typeof CLAMP_RESUME | typeof CLAMP_RESTART;
const CLAMP_RESUME: unique symbol = _.SYMBOL() as typeof CLAMP_RESUME;
const CLAMP_RESTART: unique symbol = _.SYMBOL() as typeof CLAMP_RESTART;

const allBuilderData = _.createWeakMap<FXPin, ConditionBuilders>();
// A given pin builder for a given composer returns the same instance, it's
// reused across the composer's effects.
const allInstances = createXWeakMap<FXPin, Map<FXComposer, FXPinInstance>>(() =>
  _.createMap(),
);

_.brandClass(FXPin, "FXPin");
