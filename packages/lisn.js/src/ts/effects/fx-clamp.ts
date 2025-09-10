/**
 * @module Effects
 *
 * @since v1.3.0
 */

// XXX
// TODO:
// - composer clamp reference when restarted after other pinned is wrong;
//   master pin needs to save deviation and pass it to restart? then restart
//   needs to apply this deviation to the ref state?
//
// - need to be able to update deviation even when still actively clamping
//
// - view clamp to support middle (x/y)
//
// - effect callbacks to receive viewport size
//
// -----------------
// Fixed?
// - view clamp doesn't react when jump scrolling (activates but doesn't do
//   anything)
//
// - view clamp doesn't work with transition: after each restyling of composer
//   it needs to loop on after paint until offsets no longer change
//
// => when using onStyle, we need to predict the deviation based on previous
//    depth scale and previous offsets during mutate time; then loop on after
//    paint for a bit (until it settles or until the next onStyle) to check for
//    needed correction.

import * as _ from "@lisn/_internal";

import { bugError, usageError } from "@lisn/globals/errors";

import {
  Size,
  ViewportLength,
  AtLeastOne,
  OnlyOne,
  SemiRequired,
  RawOrRelativeNumber,
} from "@lisn/globals/types";

import { havingMaxAbs, toRawNum, RawNumberCalculator } from "@lisn/utils/math";

import { createConcurrentCallback } from "@lisn/modules/callback";

import type {
  FXComposer,
  FXComposerHandler,
  FXState,
} from "@lisn/effects/fx-composer";
import {
  StartStopper,
  setInstanceCreator,
  getComposerInstance,
  atLeastOneVisible,
  watchSize,
  loopOnRepaint,
} from "@lisn/effects/_internal";

import { ViewWatcher } from "@lisn/watchers/view-watcher";

import debug from "@lisn/debug/debug";
import { LoggerInterface } from "@lisn/debug/types";

const CLAMP: unique symbol = _.SYMBOL.for(
  "LISN.js/types/clamp",
) as typeof CLAMP;

/**
 * Base clamp builder class.
 *
 * @category Base
 */
export abstract class FXClampBase<T extends string> implements FXClamp<T> {
  /**
   * @ignore
   * @internal
   */
  readonly [CLAMP] = true;

  abstract type: T;

  readonly invert: () => this;

  constructor() {
    const data: FXClampInitData<unknown[]> = { _invert: false, _args: null };
    allBuilderData.set(this, data);

    this.invert = () => {
      data._invert = true;
      return this;
    };
  }
}

/**
 * @category Pinning
 */
export interface FXClamp<T extends string = string> {
  /**
   * @ignore
   * @internal
   */
  readonly [CLAMP]: true;

  /**
   * Unique name for the clamp type.
   */
  readonly type: T;

  /**
   * Inverts the logic of the clamp. It will activate when it previously would
   * deactivate and vice versa.
   */
  readonly invert: () => this;
}

/**
 * This sets a limit (minimum and/or maximum, or exact value) for a parameter
 * (specific to each matcher).
 *
 * ----- vw/vh suffix:
 * If the value has a `vw` or `vh` suffix, it will be treated as a percentage of
 * the width or height of the viewport.
 *
 * ----- % suffix:
 * If the value has a `%` suffix, the way it is handled depends on each matcher.
 *
 * ----- +/- prefix:
 * Offsets with `+` or `-` prefix are relative to the values at the time the
 * matcher was last restarted.
 *
 * See each matcher for examples and concrete meaning.
 *
 * @category Pinning
 */
export type BoundedValue =
  | RawOrRelativeNumber
  | ViewportLength
  | AtLeastOne<{
      min: RawOrRelativeNumber | ViewportLength;
      max: RawOrRelativeNumber | ViewportLength;
    }>;

// -------------------------------------------------------------------------
// --------------------------- BUILT-IN MATCHERS ---------------------------
// -------------------------------------------------------------------------

// ------------------------------- COMPOSER --------------------------------

/**
 * {@link FXComposerClamp} is activated when the composer's
 * {@link FXState | state parameters} are **outside** the given
 * {@link FXComposerClampBounds | bounds}.
 *
 * It supports relative offsets as `"+<limit>"` or `"-<limit>"` which will be
 * relative to the parameters at the time it was last restarted.
 *
 * See {@link FXComposerClampBounds}.
 *
 * @category Pinning
 */
export class FXComposerClamp extends FXClampBase<"composer"> {
  readonly type = "composer";

  constructor(bounds: FXComposerClampBounds) {
    super();

    if (_.isNullish(bounds?.x ?? bounds?.y ?? bounds?.z)) {
      throw usageError(
        "At least one parameter bounding value is required for FXComposerClamp",
      );
    }

    const { setArgs } = initComposer(this);
    setArgs(bounds);
  }
}

/**
 * Minimum and/or maximum, or exact X, Y and/or Z composer state parameters.
 *
 * ----- vw/vh suffix:
 * If the value has a `vw` or `vh` suffix, it will be treated as a percentage of
 * the width or height of the viewport.
 *
 * ----- % suffix:
 * If the value has a `%` suffix, it will be treated as a percentage of the
 * difference between the {@link Effects.FXAxisState.low | low} and
 * {@link Effects.FXAxisState.high | high} values of each axis' current value.
 *
 * ----- +/- prefix:
 * Offsets with `+` or `-` prefix are relative to the values at the time the
 * matcher was last restarted.
 *
 * @example
 * - `10` or `"10"` is treated as an absolute value of 10 (units of the
 *   composer's parameters), ignoring the reference value (at the time of last
 *   restart).
 * - `"10vw"` and `"10vh"` are treated as an absolute value of 10% the width or
 *   height of the viewport, where pixels are assumed to match whatever units
 *   the composer's parameters use.
 * - `"10%"` is treated as an absolute value of "low + 0.1 * (high - low)",
 *   ignoring the reference value (at the time of last restart).
 *
 * - `"+10"` is treated as 10 more than the value since the matcher was last
 *   restarted.
 * - `"-10"` is treated as 10 less than the value since the matcher was last
 *   restarted.
 *
 * - `"+10vw"` and `"+10vh"` are treated as 10% the viewport width or height
 *   more than the value since the matcher was last restarted.
 * - `"-10vw"` and `"-10vh"` are treated as 10% the viewport width or height
 *   less than the value since the matcher was last restarted.
 *
 * - `"+10%"` is treated as "0.1 * (high - low)" more than the value since the
 *   matcher was last restarted.
 * - `"-10%"` is treated as "0.1 * (high - low)" less than the value since the
 *   matcher was last restarted.
 *
 * @category Pinning
 */
export type FXComposerClampBounds = AtLeastOne<{
  x: BoundedValue;
  y: BoundedValue;
  z: BoundedValue;
}>;

// --------------------------------- VIEW ----------------------------------

/**
 * {@link FXViewClamp} is activated when a composer element's, or an
 * explicitly given element's, offset from the top, bottom, left and/or right of
 * its containing root (by default the viewport) are **outside** the given
 * {@link FXViewClampBounds | bounds}.
 *
 * It supports relative offsets as `"+<limit>"` or `"-<limit>"` which will be
 * relative to the offsets at the time it was last restarted.
 *
 * The clamp can operate in two modes: monitoring one or all of the composer's
 * elements, or monitoring an unrelated element. See below for an explanation
 * of each.
 *
 * **IMPORTANT:** If the element(s) being monitored by the clamp are animated
 * by the composer, then the clamp assumes that the only thing affecting the
 * position of the element is a linear translation that's proportional to the
 * composer's state (and possibly the state of composers animating ancestor
 * elements as well). For performance optimization, the element's offsets are
 * not immediately re-measured after the composer updates the style, and so if
 * there are other unexpected factors translating the element, this can lead to
 * unexpected results or visible glitches.
 *
 * ## Default mode: Monitoring each of the composer's elements
 *
 * By default the clamp will watch each of the composer's elements (that it is
 * animating) and clamp/freeze the composer's state whenever any one of these
 * elements violates the bounds you specify for the clamp.
 *
 * This will result in the element that exceeded the bound the be pinned
 * precisely at the boundary it crossed (for example "top: 50%" if this is
 * what you specified in the bounds), while the other elements (that have not
 * yet violated the bounds) will be pinned at their respective position they
 * held at the time the violation occurred. The relative position the elements
 * with respect to each other is preserved. This is because the clamp controls
 * the state of the composer and this affects all its effects and all elements
 * it animates.
 *
 * If you want each element to be pinned individually to a certain offset
 * within the viewport, then you must use separate composers to animate each of
 * these elements.
 *
 * ## Alternative mode: Monitoring a custom element
 *
 * You can specify a single custom element that the clamp should watch instead
 * of the composer's elements by setting {@link FXViewClampConfig.target}.
 *
 * This element can be a single one of the composer's elements, or it can be
 * any other element (animated by another composer, or not animated by any
 * composer).
 *
 * **IMPORTANT:** If this element is **not** being animated by the composer
 * associated with this clamp, then it will not be pinned; it will simply cause
 * the composer's state to be frozen whenever this element's position violates
 * the bound.
 *
 * @category Pinning
 */
export class FXViewClamp extends FXClampBase<"view"> {
  readonly type = "view";

  constructor(bounds: FXViewClampBounds, config?: FXViewClampConfig) {
    super();

    const { top, bottom, left, right } = bounds;

    if (_.isNullish(top ?? bottom ?? left ?? right)) {
      throw usageError(
        "At least one parameter bounding value is required for FXViewClamp",
      );
    }

    for (const [a, b, msg] of [
      [top, bottom, "top and bottom"],
      [left, right, "left and right"],
    ]) {
      if (!_.isNullish(a) && !_.isNullish(b)) {
        throw usageError(
          `Only one of ${msg} bounding value is allowed for FXViewClamp`,
        );
      }
    }

    const { setArgs } = initView(this);
    setArgs(bounds, config);
  }
}

/**
 * Minimum and/or maximum, or exact top, bottom, left and/or right offset of the
 * view target from the given root's edge.
 * - top offset is the difference between the given root's top edge and the
 *   target's top edge; it is positive then the target's top edge is below
 *   the root's top edge.
 * - bottom offset is the difference between the target's bottom edge and the
 *   root's bottom edge; it is positive then the target's bottom edge is above
 *   the root's bottom edge.
 * - right offset is the difference between the given root's right edge and the
 *   target's right edge; it is positive then the target's right edge is to the
 *   left of the root's right edge.
 * - left offset is the difference between the target's left edge and the
 *   root's left edge; it is positive then the target's left edge is to the
 *   right of the root's left edge.
 *
 * You cannot specify both top and bottom, nor can you specify both left and
 * right. But you can specify one of top or bottom, and also one of left or right.
 *
 * ----- vw/vh suffix:
 * If the value has a `vw` or `vh` suffix, it will be treated as a percentage of
 * the width or height of the viewport.
 *
 * ----- % suffix:
 * If the value has a `%` suffix, it will be treated as a percentage of the
 * root's size. If there is no explicit root given, then this is the same as the
 * viewport size.
 *
 * ----- +/- prefix:
 * Offsets with `+` or `-` prefix are relative to the offsets at the time the
 * matcher was last restarted.
 *
 * All offsets given ultimately resolve to pixels and it is assumed this matches
 * whatever units the composer's parameters use, so that the composer's state is
 * clamped correctly.
 *
 * @example
 * - `10` or `"10"` is treated as an absolute value of 10 pixels, ignoring the
 *   reference value (at the time of last restart)
 * - `"10vw"` and `"10vh"` are treated as an absolute value of 10% the width or
 *   height of the viewport, where pixels are assumed to match whatever units
 *   the composer's parameters use.
 * - `"10%"` is treated as an absolute value of 10% the width (for X parameters)
 *   or height (for Y parameters) of the root's size.
 *
 * - `"+10"` is treated as 10 more than the value since the matcher was last
 *   restarted.
 * - `"-10"` is treated as 10 less than the value since the matcher was last
 *   restarted.
 *
 * - `"+10vw"` and `"+10vh"` are treated as 10% the viewport width or height
 *   more than the value since the matcher was last restarted.
 * - `"-10vw"` and `"-10vh"` are treated as 10% the viewport width or height
 *   less than the value since the matcher was last restarted.
 *
 * - `"+10%"` is treated as 10% (of the root's size) more than the value since
 *   the matcher was last restarted.
 * - `"-10%"` is treated as 10% (of the root's size) less than the value since
 *   the matcher was last restarted.
 *
 * @category Pinning
 */
export type FXViewClampBounds = AtLeastOne<
  OnlyOne<{
    top: BoundedValue;
    bottom: BoundedValue;
  }> &
    OnlyOne<{
      left: BoundedValue;
      right: BoundedValue;
    }>
>;

/**
 * @category Pinning
 */
export type FXViewClampConfig = {
  /**
   * By default the clamp will watch each of the composer's elements.
   *
   * You can override this with a single element. The element doesn't need to
   * be one of the composer's elements.
   *
   * See the explanation {@link FXViewClamp here} about what it means if the
   * element is not one of the composer's elements.
   *
   * @defaultValue undefined // each of the composer's elements
   */
  target?: Element;

  /**
   * The root to pass to the {@link ViewWatcher}. If the element this clamp is
   * monitoring is inside a custom scrollable, pass this scrollable as the root.
   *
   * @defaultValue undefined // the viewport
   */
  root?: Element;

  /**
   * The clamp only closely monitors the movement of the target element when
   * it is close to entering the viewport (or the root view), in order to
   * maximize performance. If the user scrolls quickly or otherwise the target
   * element moves quickly, the clamp might not react quickly enough and this
   * would lead to a "jump". Set this to true to widen the margin around the
   * viewport that will activate the close monitoring.
   *
   * @defaultValue false
   */
  aggressiveWatching?: boolean;
};

// -------------------- BASE --------------------

/**
 * Clamps are used by {@link FXPin}s as building blocks for a pin's multi-way
 * conditions.
 *
 * A clamp internally keeps track of a single condition and as soon as the
 * condition matches it requests to pin to activate or deactivate itself.
 *
 * There are several built-in clamps:
 * - {@link FXComposerClamp}
 * - {@link FXViewClamp}
 *
 * {@link registerFXClamp} registers a new clamp type. It returns an object with
 * an `init` property holding a function.
 *
 * Your clamp class should call this `init` function in its constructor, passing
 * it itself (`this`). `init` will return an object containing the following
 * function:
 * - `setArgs`: Sets the arguments that the {@link FXClampLogic}'s run method
 *              will receive. Your clamp class **must** call this in its
 *              constructor.
 *
 * See example below for implementing a basic clamp class.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If this clamp type has already been registered.
 *
 * @example
 * ```typescript
 * type CustomArg = string;
 * type CustomConfig = { opt: boolean };
 *
 * const { init } = registerFXClamp<
 *   "custom",
 *   number, // state
 *   { start: () => void, stop: () => void }, // data
 *   [CustomArg, CustomConfig | undefined], // arguments passed to run
 * >({
 *   type: "custom",
 *   logic: {
 *     run(store, arg, config) {
 *       // required, set initial state and data
 *       store.setState(0);
 *       // ... rest of init
 *       store.setData({
 *         start: () => {
 *           // ...
 *         },
 *
 *         stop: () => {
 *           // ...
 *         }
 *       });
 *     },
 *
 *     pause(store) {
 *       store.getData().stop();
 *     },
 *
 *     resume(store) {
 *       store.getData().start();
 *     },
 *   }
 * });
 *
 * export class FXCustomClamp extends FXClampBase<"custom"> {
 *   readonly type = "custom"; // required
 *
 *   constructor(arg: CustomArgs, config?: CustomConfig) {
 *     super();
 *
 *     const { setArgs } = init(this);
 *     setArgs(arg, config);
 *   }
 * }
 * ```
 *
 * @typeParam State  The type of state the clamp has. The store will hold both
 *                   the current state as well as the state at the time the
 *                   clamp was last restarted.
 * @typeParam Data   The type of data the clamp stores. This is arbitrary data
 *                   to be shared across the {@link FXClampLogic} methods.
 * @typeParam Args   The type of arguments to pass to the instance methods
 *                   (defined in your {@link FXClampLogic}).
 *
 * See {@link FXClampStore}.
 *
 * @category Base
 */
export const registerFXClamp = <
  T extends string,
  State,
  Data,
  Args extends unknown[],
>(
  definitions: FXClampDefinitions<T, State, Data, Args>,
) => {
  if (registeredTypes.has(definitions.type)) {
    throw usageError(
      `FXClamp type '${definitions.type}' is already registered`,
    );
  }

  registeredTypes.set(definitions.type, definitions);

  return {
    init: (self: FXClamp<T>) => {
      return {
        setArgs: (...args: Args) => {
          const data = getInitData<Args>(self);
          data._args = args;
        },
      } as const;
    },
  };
};

/**
 * @category Base
 */
export interface FXClampInstance {
  /**
   * Pauses the clamp's monitoring of the condition.
   */
  pause: () => void;

  /**
   * Resumes the clamp's monitoring of the condition.
   */
  resume: () => void;

  /**
   * Updates the clamps's
   * {@link FXClampStore.getReferenceState | reference state} to be its current
   * state.
   *
   * It will also {@link resume} the clamp if it's paused.
   */
  restart: () => void;
}

/**
 * Defines a new clamp type.
 *
 * @category Base
 */
export type FXClampDefinitions<
  T extends string,
  State,
  Data,
  Args extends unknown[],
> = {
  /**
   * Unique name for the clamp type.
   */
  type: T;

  /**
   * See {@link FXClampLogic}.
   */
  logic: FXClampLogic<State, Data, Args>;
};

/**
 * These methods define how clamps operate and copy their state/data.
 *
 * Inside each method, the current clamp instance which the logic operates can
 * be accessed as the `this` value (as long as the logic method is not an arrow
 * function).
 *
 * @category Base
 */
export type FXClampLogic<State, Data, Args extends unknown[]> = {
  /**
   * The function will be called once when the clamp instance is created.
   *
   * It should {@link FXClampStore.setData | set the clamp's data} and do other
   * initialization.
   */
  run: (store: FXClampStore<State, Data>, ...args: Args) => void;

  /**
   * It is called when the clamp is first initialized (after {@link run} has
   * been called) or when it's resumed and
   * must return an up-to-date state.
   */
  refreshState: (store: FXClampStore<State, Data>) => State;

  /**
   * If given, it will be called when the clamp is paused.
   */
  pause?: (store: FXClampStore<State, Data>) => void;

  /**
   * If given, it will be called when the clamp is resumed.
   */
  resume?: (store: FXClampStore<State, Data>) => void;

  /**
   * If given, it will be used to copy the state before storing it in or
   * retrieving it from the store. It is required in order to keep a copy of the
   * state when restarting.
   *
   * @defaultValue An internal function which deeply copies arbitrary data, but
   * may not be the most performance-efficient.
   */
  copyState?: (state: State) => State;
};

/**
 * Internal state and data management for a clamp to be used by its logic
 * methods.
 *
 * @category Base
 */
export type FXClampStore<State, Data> = {
  /**
   * Returns the current state, last set using {@link setState}.
   *
   * It is copied according to
   * {@link FXClampLogic.copyState | your logic's `copyState`} before returning.
   *
   * @param refresh If true, it will first {@link FXClampLogic.refreshState}
   *                refresh the state.
   */
  getState: (refresh?: boolean) => State;

  /**
   * Updates the current state.
   *
   * It is copied according to
   * {@link FXClampLogic.copyState | your logic's `copyState`} before storing.
   */
  setState: (state: State) => void;

  /**
   * Returns the state at the time the clamp was last
   * {@link FXClampInstance.restart | restarted}.
   *
   * It is copied according to
   * {@link FXClampLogic.copyState | your logic's `copyState`} before returning.
   */
  getReferenceState: () => State;

  /**
   * Returns the current data, last set using {@link setData}.
   *
   * You **must** call {@link setData} before calling this.
   *
   * It is not copied before storing.
   */
  getData: () => Data;

  /**
   * Updates the current data.
   *
   * It is not copied before returning.
   */
  setData: (data: Data) => void;

  /**
   * Returns the {@link FXComposer} associated with this clamp.
   */
  getComposer: () => FXComposer;

  /**
   * Returns the composer's current state. Same as
   * {@link `getComposer`}`().getState()`.
   */
  getComposerState: () => FXState;

  /**
   * Returns the composer's state at the time the clamp was last
   * {@link FXClampInstance.restart | restarted}.
   */
  getReferenceComposerState: () => FXState;

  /**
   * Informs the pin that the clamp's state has changed.
   *
   * Set `active` to true if the clamp is now active, meaning that the pin
   * should also be activated. Set `active` to false otherwise, meaning that the
   * pin may be deactivated.
   *
   * If the clamp supports limits or bounds, such as maximum/minimum x/y/z, then
   * in either case (active or not), set the deviation from the limits as the
   * difference between the current value of x/y/z and the limit for that axis.
   *
   * For example if the clamp is activated on minimum x = 100 and the composer's
   * state is 150, set deviation to `{ x: 50 }` and active to `true`; and if the
   * composer's state is 50, then set deviation to `{ x: -50 }` and active to
   * `false`.
   *
   * Note that if the clamp is paused, it will update the state only when
   * resumed.
   *
   * If the correction to the state requires immediate updating of the CSS (if,
   * for example, it was as a result of a layout change), set `realtime` to
   * true.
   *
   * If a particular composer state needs to be used, other than the current
   * composer state, pass this as the `state` property.
   */
  requestUpdate: (violation: FXClampViolation) => void;
};

/**
 * Base clamp builder class.
 *
 * @category Base
 */
export type FXClampViolation = {
  active: boolean;
  deviation: { x?: number; y?: number; z?: number } | null;
  state: FXState;
  realtime?: boolean;
};

// ------------------------------

const createClampInstance = <T extends string, S, D, A extends unknown[]>(
  clamp: FXClamp<T>,
  composer: FXComposer,
  requestPinUpdate: (violation: FXClampViolation) => void,
  parentLogger?: LoggerInterface,
): FXClampInstance => {
  /* istanbul ignore next */
  if (!_.isInstanceOf(clamp, FXClampBase)) {
    throw usageError("Object is not an FXClamp");
  }

  const definitions = registeredTypes.get<T, S, D, A>(clamp.type);
  /* istanbul ignore next */
  if (!definitions) {
    throw bugError(`No definitions saved for clamp type '${clamp.type}'`);
  }

  const init = getInitData<A>(clamp);

  const { _args: args, _invert: invert } = init;

  /* istanbul ignore next */
  if (!_.isArray(args)) {
    // child class didn't call setArgs
    throw usageError(`No arguments saved for clamp '${clamp.type}'`);
  }

  const { logic } = definitions;

  let isPaused = true; // don't start until the pin restarts us
  let lastChangeWhilePaused: FXClampViolation | null = null;

  const storeData: {
    _data?: D;
    _state?: S;
    _refState?: S;
    _refComposerState: FXState;
  } = { _refComposerState: composer.getState() };

  const getState = (useReference: boolean, refresh?: boolean) => {
    if (refresh) {
      storeData._state = refreshState(store);
    }

    const state = useReference ? storeData._refState : storeData._state;

    /* istanbul ignore next */
    if (_.isUndefined(state)) {
      throw bugError(`No state saved for clamp '${clamp.type}'`);
    }

    return copyState<S>(state);
  };

  const store: FXClampStore<S, D> = {
    getState: (refresh) => getState(false, refresh),
    setState: (state) => {
      logger?.debug10("New state", state);
      storeData._state = copyState<S>(state);
    },
    getReferenceState: () => getState(true),

    getData: () => {
      /* istanbul ignore next */
      const data = storeData._data;
      if (_.isUndefined(data)) {
        throw usageError(`No data saved for clamp '${clamp.type}'`);
      }

      return data;
    },
    setData: (data) => {
      storeData._data = data;
    },

    getComposer: () => composer,
    getComposerState: () => composer.getState(),
    getReferenceComposerState: () => _.copyNested(storeData._refComposerState),

    requestUpdate: (violation) => {
      let active = violation.active;
      const { state, deviation, realtime } = violation;

      logger?.debug7("Got violation", violation, { invert });

      if (invert) {
        active = !active;
      }

      setViolation({ state, active, deviation, realtime });
    },
  };

  // ----------

  const setViolation = (violation: FXClampViolation) => {
    const { active } = violation;
    if (!isPaused) {
      logger?.debug7("Setting new clamp violation", violation);
      requestPinUpdate(_.copyNested(violation));
    } else if (!!lastChangeWhilePaused?.active !== active) {
      lastChangeWhilePaused = violation;
    }
  };

  const setRunningState = (state: RUNNING_STATE, updateRef = false) => {
    const isChanged = isPaused !== (state === PAUSE);
    if (isChanged) {
      isPaused = !isPaused;

      logger?.debug7(`${isPaused ? "Pausing" : "Resuming"} clamp`);

      if (!isPaused && lastChangeWhilePaused) {
        setViolation(lastChangeWhilePaused);
        lastChangeWhilePaused = null;
      }

      if (!isPaused) {
        store.getState(true); // refresh the state
      }
    }

    if (updateRef) {
      storeData._refState = storeData._state;
      storeData._refComposerState = composer.getState();
      logger?.debug7("Updated reference state", storeData._refState);
    }

    if (isChanged) {
      (isPaused ? logic?.pause : logic?.resume)?.call(self, store);
    }
  };

  // --------------------

  const self: FXClampInstance = {
    pause: () => setRunningState(PAUSE),
    resume: () => setRunningState(RESUME),
    restart: () => setRunningState(RESUME, true),
  };

  const logger = debug
    ? debug.Logger.getLoggerFor(self, {
        name: `FXClamp-${clamp.type}${invert ? "-inverted" : ""}`,
        parent: parentLogger,
        logAtCreation: args,
      })
    : void 0;

  const copyState = logic.copyState?.bind(self) ?? _.deepCopy;
  const refreshState = logic.refreshState?.bind(self);

  // --------------------

  logic.run.call(self, store, ...args);

  return self;
};

// ------------------------------

type BoundedState<Axes extends "x" | "y" | "z"> = {
  _state: FXState;
  _bounds: { [A in Axes]?: BoundedValue };
  _current: { [A in Axes]: number };
  _previous: { [A in Axes]: number };
  _reference: { [A in Axes]: number };
  _low: { [A in Axes]: number };
  _high: { [A in Axes]: number };
  _vpSizeWatch: { get: () => Size };
};

type Offsets = Array<{ x: number; y: number }>;

type ViewOffsetsInput = {
  _targets: Element[];
  _root: Element | undefined;
  _xyToAnchor: { x: "left" | "right"; y: "top" | "bottom" };
  _vpSizeWatch: { get: () => Size };
};

type FXClampInitData<A extends unknown[]> = {
  _invert: boolean;
  _args: A | null;
};

interface RegistrationMap {
  has(type: string): boolean;
  get<T extends string, S, D, A extends unknown[]>(
    type: T,
  ): FXClampDefinitions<T, S, D, A> | undefined;
  set<T extends string, S, D, A extends unknown[]>(
    type: T,
    definitions: FXClampDefinitions<T, S, D, A>,
  ): this;
}

interface BuilderDataMap {
  get<A extends unknown[]>(clamp: FXClamp): FXClampInitData<A> | undefined;
  set<A extends unknown[]>(clamp: FXClamp, data: FXClampInitData<A>): this;
}

type RUNNING_STATE = typeof PAUSE | typeof RESUME;
const PAUSE: unique symbol = _.SYMBOL() as typeof PAUSE;
const RESUME: unique symbol = _.SYMBOL() as typeof RESUME;

const registeredTypes: RegistrationMap = new Map();
const allBuilderData = new WeakMap() as BuilderDataMap;

// --------------------

const { init: initComposer } = registerFXClamp<
  "composer",
  FXState,
  {
    _vpSizeWatch: StartStopper;
    _tweenWatch: StartStopper;
  },
  [FXComposerClampBounds]
>({
  type: "composer",
  logic: {
    run(store, bounds) {
      const logger = debug
        ? debug.Logger.getLoggerFor(this, { logAtCreation: bounds })
        : void 0;

      const vpSizeWatch = watchSize(null, logger);

      const composer = store.getComposer();

      const tweenHandler: FXComposerHandler = createConcurrentCallback(
        () => {
          const refComposerState = store.getReferenceState();
          const composerState = store.getState(true);

          // XXX
          const boundedState = getComposerBoundedState(
            composerState,
            refComposerState,
          );
          // const boundedState: BoundedState<"x" | "y" | "z"> = _.merge(offsets, {
          //   _bounds: bounds,
          //   _vpSizeWatch: vpSizeWatch,
          // });

          const violation = getBoundViolation(boundedState);
          logger?.debug10("Bounded state violation", boundedState, violation);
          store.requestUpdate(violation);
        },
        { logger },
      );

      const tweenWatch = {
        start: () => composer.onTween(tweenHandler),
        stop: () => composer.offTween(tweenHandler),
      } as const;

      store.setData({
        _vpSizeWatch: vpSizeWatch,
        _tweenWatch: tweenWatch,
      });
    },

    refreshState: (store) => {
      return store.getComposer().getState();
    },

    pause: (store) => {
      const data = store.getData();
      data._vpSizeWatch.stop();
      data._tweenWatch.stop();
    },

    resume: (store) => {
      const data = store.getData();
      data._vpSizeWatch.start();
      data._tweenWatch.start();
    },
  },
});

const { init: initView } = registerFXClamp<
  "view",
  Offsets,
  {
    _offsetInput: ViewOffsetsInput & {
      _vpSizeWatch: StartStopper & ViewOffsetsInput["_vpSizeWatch"];
    };
    _rootSizeWatch: StartStopper;
    _viewWatch: StartStopper;
    _closeMonitor: StartStopper;
  },
  [FXViewClampBounds, FXViewClampConfig | undefined]
>({
  type: "view",
  logic: {
    run(store, bounds, config) {
      const logger = debug
        ? debug.Logger.getLoggerFor(this, { logAtCreation: { bounds, config } })
        : void 0;

      const xyToAnchor = {
        x: _.S_LEFT in bounds ? _.S_LEFT : _.S_RIGHT,
        y: _.S_TOP in bounds ? _.S_TOP : _.S_BOTTOM,
      } as const;

      const xyBounds = {
        x: bounds.left ?? bounds.right,
        y: bounds.top ?? bounds.bottom,
      };
      const low = { x: 0, y: 0 } as const;

      const composer = store.getComposer();

      const { target: customTarget, root, aggressiveWatching } = config ?? {};

      const targets = customTarget ? [customTarget] : composer.getElements();
      const numTargets = _.lengthOf(targets);

      const vpSizeWatch = watchSize(null, logger);
      const rootSizeWatch = root ? watchSize(root, logger) : vpSizeWatch;

      const offsetInput = {
        _targets: targets,
        _root: root,
        _xyToAnchor: xyToAnchor,
        _vpSizeWatch: vpSizeWatch,
      };

      const animatingComposer = customTarget
        ? getComposerInstance(customTarget)
        : composer;

      const viewWatch = atLeastOneVisible(
        targets,
        (hasVisible) => {
          (hasVisible ? closeMonitor.start : closeMonitor.stop)();
        },
        ViewWatcher.reuse({
          root,
          rootMargin: aggressiveWatching ? "500px" : "200px",
        }),
        logger,
      );

      // ----------

      const updateViolation = (
        composerState: FXState,
        offsets: { _current: Offsets; _previous: Offsets },
        usesDeviation: boolean,
      ) => {
        const refOffsets = store.getReferenceState();

        const rootSize = rootSizeWatch.get();
        const high = {
          x: rootSize.width,
          y: rootSize.height,
        };

        const violations: FXClampViolation[] = [];
        for (let i = 0; i < numTargets; i++) {
          const boundedState: BoundedState<"x" | "y"> = {
            _state: composerState,
            _bounds: xyBounds,
            _current: offsets._current[i],
            _previous: offsets._previous[i],
            _reference: refOffsets[i],
            _low: low,
            _high: high,
            _vpSizeWatch: vpSizeWatch,
          };

          violations.push(getBoundViolation(boundedState));
        }

        const { active, deviation } = getMaxBoundViolation(violations);
        const violation = {
          state: composerState,
          active,
          deviation: usesDeviation ? deviation : null,
          realtime: true,
        };

        logger?.debug10(
          "Bounded state violation",
          {
            composerState,
            usesDeviation,
            current: offsets._current,
            previous: offsets._previous,
            reference: refOffsets,
            low,
            high,
            xyBounds,
          },
          violation,
        );

        store.requestUpdate(violation);
      };

      // -----

      const onStyleHandler = (
        predictOffsets: ReturnType<typeof getViewOffsetsPredictor>,
        composerState: FXState,
      ) => {
        const prevOffsets = store.getState();
        const predictedOffsets = predictOffsets(composerState, prevOffsets);
        store.setState(predictedOffsets);

        const usesDeviation = animatingComposer === composer;
        updateViolation(
          composerState,
          { _current: predictedOffsets, _previous: prevOffsets },
          usesDeviation,
        );

        // Check if corrections are needed after repaint.
        // Keep going for as long as there are changes which would happen if
        // the styles use transitions.
        repaintWatch.start();
      };

      // -----

      const repaintHandler = async (options: {
        _usesDeviation: boolean;
        _keepGoing: boolean;
      }) => {
        const prevOffsets = store.getState();
        const offsets = store.getState(true); // refresh state
        updateViolation(
          (animatingComposer ?? composer).getState(),
          { _current: offsets, _previous: prevOffsets },
          options._usesDeviation,
        );

        if (!options._keepGoing) {
          let hasChanged = false;
          for (let i = 0; i < numTargets; i++) {
            if (
              offsets[i].x !== prevOffsets[i].x ||
              offsets[i].y !== prevOffsets[i].y
            ) {
              hasChanged = true;
              break;
            }
          }

          if (!hasChanged) {
            repaintWatch.stop();
          }
        }
      };

      // -----

      // If the targets we're watching are animated by a composer, use an
      // onStyle callback rather than looping on each animation frame when
      // monitoring closely.
      let closeMonitor: StartStopper;
      let repaintWatch: StartStopper;
      if (animatingComposer) {
        const predictOffsets = getViewOffsetsPredictor(
          animatingComposer,
          offsetInput,
        );

        const callback: FXComposerHandler = createConcurrentCallback(
          (c, { state }) => onStyleHandler(predictOffsets, state),
          { logger },
        );

        closeMonitor = {
          start: () => {
            animatingComposer.onStyle(callback);
          },
          stop: () => {
            animatingComposer.offStyle(callback);
            repaintWatch.stop();
          },
        };

        repaintWatch = loopOnRepaint(
          () => repaintHandler({ _keepGoing: false, _usesDeviation: true }),
          logger,
        );
      } else {
        closeMonitor = repaintWatch = loopOnRepaint(
          () => repaintHandler({ _keepGoing: true, _usesDeviation: false }),
          logger,
        );
      }

      store.setData({
        _offsetInput: offsetInput,
        _rootSizeWatch: rootSizeWatch,
        _viewWatch: viewWatch,
        _closeMonitor: closeMonitor,
      });
    },

    refreshState: (store) => {
      const data = store.getData();
      return getViewOffsets(data._offsetInput);
    },

    pause: (store) => {
      const data = store.getData();
      data._offsetInput._vpSizeWatch.stop();
      data._rootSizeWatch.stop();
      data._viewWatch.stop();
      data._closeMonitor.stop();
    },

    resume: (store) => {
      const data = store.getData();
      data._offsetInput._vpSizeWatch.start();
      data._rootSizeWatch.start();
      data._viewWatch.start();
    },

    copyState: (s) => [...s],
  },
});

// --------------------

const getInitData = <A extends unknown[]>(clamp: FXClamp) => {
  const data = allBuilderData.get<A>(clamp);
  /* istanbul ignore next */
  if (!data) {
    throw bugError(`No init data saved for clamp '${clamp.type}'`);
  }
  return data;
};

const getComposerOffsets = (
  currState: FXState,
  refState: FXState,
): SemiRequired<
  BoundedState<"x" | "y" | "z">,
  "_current" | "_previous" | "_reference" | "_low" | "_high"
> => {
  const fromProp = (
    state: FXState,
    prop: "current" | "previous" | "low" | "high",
  ): { x: number; y: number; z: number } => ({
    x: state.x[prop],
    y: state.y[prop],
    z: state.z[prop],
  });

  return {
    _current: fromProp(currState, "current"),
    _previous: fromProp(currState, "previous"),
    _reference: fromProp(refState, "current"),
    _low: fromProp(currState, "low"),
    _high: fromProp(currState, "high"),
  };
};

const getViewOffsets = (input: ViewOffsetsInput) => {
  const offsets: Offsets = [];
  const viewport = input._vpSizeWatch.get();

  for (const t of input._targets) {
    const rect = _.getBoundingClientRect(t);
    const rootRect = input._root ? _.getBoundingClientRect(input._root) : null;
    const tblrOffsets = {
      top: rect.top - (rootRect?.top ?? 0),
      bottom: (rootRect?.bottom ?? viewport.height) - rect.bottom,
      left: rect.left - (rootRect?.left ?? 0),
      right: (rootRect?.right ?? viewport.width) - rect.right,
    };

    offsets.push({
      x: tblrOffsets[input._xyToAnchor.x],
      y: tblrOffsets[input._xyToAnchor.y],
    });
  }

  return offsets;
};

const getViewOffsetsPredictor = (
  composer: FXComposer,
  input: ViewOffsetsInput,
) => {
  const calibrator = () => getViewOffsets(input);

  const stateToXY = (s: FXState, usePrevious = false) => {
    const prop = usePrevious ? "previous" : "current";
    return {
      x: s.x[prop],
      y: s.y[prop],
    };
  };

  const delta = 100;
  const numElements = _.lengthOf(input._targets);

  // Assume it doesn't depend on z, and only check x/y dependency.
  // Check separately.

  const offsetsI = composer.withCalibrationContext(calibrator, {
    x: { current: 0 },
    y: { current: 0 },
  });

  const offsetsVarX = composer.withCalibrationContext(calibrator, {
    x: { current: delta },
  });

  const offsetsVarY = composer.withCalibrationContext(calibrator, {
    y: { current: delta },
  });

  const multipliers: Array<{
    xVarX: number;
    xVarY: number;
    yVarX: number;
    yVarY: number;
  }> = [];

  for (let i = 0; i < numElements; i++) {
    const oI = offsetsI[i];
    const oVarX = offsetsVarX[i];
    const oVarY = offsetsVarY[i];

    const m = {
      xVarX: (oVarX.x - oI.x) / delta, // change in offset X as a result of change in state X
      xVarY: (oVarY.x - oI.x) / delta, // change in offset X as a result of change in state Y

      yVarX: (oVarX.y - oI.y) / delta, // change in offset Y as a result of change in state X
      yVarY: (oVarY.y - oI.y) / delta, // change in offset Y as a result of change in state Y
    };

    multipliers.push(m);
  }

  return (state: FXState, prevOffsets: Offsets): Offsets => {
    const s = stateToXY(state);
    const prevS = stateToXY(state, true);

    const predicted: Offsets = [];
    for (let i = 0; i < numElements; i++) {
      const o = prevOffsets[i];
      const m = multipliers[i];

      const x =
        o.x + // previous X offset
        (s.x - prevS.x) * m.xVarX + // + change due to change in state X
        (s.y - prevS.y) * m.xVarY; // + change due to change in state Y

      const y =
        o.y + // previous Y offset
        (s.x - prevS.x) * m.yVarX + // + change due to change in state X
        (s.y - prevS.y) * m.yVarY; // + change due to change in state Y

      predicted.push({ x, y });
    }

    return predicted;
  };
};

/**
 * Converts the given input raw or relative number as explained in
 * {@link FXComposerClampBounds} or {@link FXViewClampBounds}.
 *
 * @returns `null` if it doesn't resolve to a valid number.
 */
const toRawBoundsValue = <Axes extends "x" | "y" | "z">(
  boundedValue: RawOrRelativeNumber | ViewportLength | undefined,
  input: BoundedState<Axes>,
  axis: Axes,
): number | null => {
  const reference = input._reference[axis];
  const low = input._low[axis];
  const high = input._high[axis];
  const viewport = input._vpSizeWatch.get();

  let rawOrRelBound: string | number | undefined = boundedValue;
  let multiplier = 1;
  if (_.isLiteralString(rawOrRelBound)) {
    const suff = _.slice(rawOrRelBound, -2);
    if (suff === "vw" || suff === "vh") {
      rawOrRelBound = _.slice(rawOrRelBound, 0, -2);
      multiplier = (suff == "vw" ? viewport.width : viewport.height) / 100;
    }
  }

  const calculator: RawNumberCalculator = ({
    isAdditive,
    isPercent,
    numerical,
  }) => {
    let result;
    numerical *= multiplier;

    if (isPercent) {
      result =
        (isAdditive ? reference : low) + (numerical * (high - low)) / 100;
    } else {
      result = numerical + (isAdditive ? reference : 0);
    }

    return result;
  };

  return toRawNum(rawOrRelBound, calculator, null);
};

const getBoundViolation = <Axes extends "x" | "y" | "z">(
  input: BoundedState<Axes>,
): FXClampViolation => {
  const getDiff = (
    boundedValue: RawOrRelativeNumber | ViewportLength | undefined,
    axis: Axes,
  ) => {
    const raw = toRawBoundsValue(boundedValue, input, axis);
    return { raw, diff: _.isNull(raw) ? null : raw - input._current[axis] };
  };

  let active = false;
  const deviation = { x: 0, y: 0, z: 0 };

  for (const axis in input._bounds) {
    const boundedValue = input._bounds[axis];
    if (_.isNullish(boundedValue)) {
      continue;
    }

    if (_.isNonNullablePrimitive(boundedValue)) {
      const { raw, diff } = getDiff(boundedValue, axis);
      deviation[axis] = diff ?? 0;
      // this is an "exact" bound, therefore it has been violated if it the
      // bound has been crossed since the previous time
      if (!_.isNull(raw)) {
        active ||= input._current[axis] < raw !== input._previous[axis] < raw;
      }
    } else {
      for (const k of ["min", "max"] as const) {
        const bound = boundedValue[k];

        if (!_.isNullish(bound)) {
          const thisDeviation = getDiff(bound, axis).diff ?? 0;
          // this is a min/max bound, therefore it has been violated if it's min and
          // current < bound or if it's max and current > bound
          const thisViolated =
            k === "min" ? thisDeviation > 0 : thisDeviation < 0;

          if (thisViolated) {
            deviation[axis] = havingMaxAbs(deviation[axis], thisDeviation);
            active = true;
          }
        }
      }
    }
  }

  return { active, deviation, state: input._state };
};

const getMaxBoundViolation = (
  deviations: FXClampViolation[],
): FXClampViolation => {
  const maxDeviation = { x: 0, y: 0, z: 0 };
  let maxActive = false;

  for (const { active, deviation } of deviations) {
    maxActive ||= active;
    maxDeviation.x = havingMaxAbs(maxDeviation.x, deviation?.x ?? 0);
    maxDeviation.y = havingMaxAbs(maxDeviation.y, deviation?.y ?? 0);
    maxDeviation.z = havingMaxAbs(maxDeviation.z, deviation?.z ?? 0);
  }

  return { active: maxActive, deviation: maxDeviation };
};

// --------------------

setInstanceCreator("clamp", createClampInstance);

_.brandClass(FXClampBase, "FXClampBase");
_.brandClass(FXComposerClamp, "FXComposerClamp");
_.brandClass(FXViewClamp, "FXViewClamp");
