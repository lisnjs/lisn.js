/**
 * @module Effects
 *
 * @since v1.3.0
 */

// XXX
// TODO:
// - el doesn't revert to its original offset
// - disable transition
// - updated reference state is wrong
// - avoid updating pin if current for all axes is the same
// - lastClampedComposerState being cleared when it shouldn't be
//
// - view clamp to support middle (x/y)
// - effect callbacks to receive viewport size
// - infinite loops when calibration is all 0s?
//
// -----------------
// Fixed?
// - need to be able to update deviation even when still actively clamping
//
// - view clamp doesn't react when jump scrolling (activates but doesn't do
//   anything)
//
// - view clamp doesn't work with transition: after each restyling of composer
//   it needs to loop on after paint until offsets no longer change
//
// - composer clamp reference when restarted after other pinned is wrong;
//   master pin needs to save clamped state and pass it to restart? then
//   restart needs to apply this deviation to the ref state?

import * as _ from "@lisn/_internal";

import { bugError, usageError } from "@lisn/globals/errors";

import {
  Size,
  ViewportLength,
  AtLeastOne,
  OnlyOne,
  RawOrRelativeNumber,
} from "@lisn/globals/types";

import { logError } from "@lisn/utils/log";
import { compareValuesIn } from "@lisn/utils/misc";
import {
  RawNumberCalculator,
  toRawNum,
  havingMinAbs,
  havingMaxAbs,
} from "@lisn/utils/math";

import { createConcurrentCallback } from "@lisn/modules/callback";

import type {
  FXComposer,
  FXComposerHandler,
  FXState,
} from "@lisn/effects/fx-composer";
import type { FXPinState } from "@lisn/effects/fx-pin";
import {
  StartStopper,
  FXPinActions,
  setInstanceCreator,
  getComposerInstance,
  atLeastOneVisible,
  watchSize,
  loopOnRepaint,
} from "@lisn/effects/_internal";

import { ViewWatcher } from "@lisn/watchers/view-watcher";

import debug from "@lisn/debug/debug";
import { LoggerInterface } from "@lisn/debug/types";
import { waitForMeasureTime } from "@lisn/utils";

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
    this.invert = () => {
      const initData = getInitData(this);
      initData._invert = true;
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
 * Bounds with `+` or `-` prefix are relative to the values at the time the
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
 * It supports relative bounds as `"+<limit>"` or `"-<limit>"` which will be
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

    initComposer(this, bounds);
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
 * Bounds with `+` or `-` prefix are relative to the values at the time the
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
 * It supports relative bounds as `"+<limit>"` or `"-<limit>"` which will be
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

    const xyToAnchor = {
      x: _.S_LEFT in bounds ? _.S_LEFT : _.S_RIGHT,
      y: _.S_TOP in bounds ? _.S_TOP : _.S_BOTTOM,
    } as const;

    const xyBounds = {
      x: bounds[xyToAnchor.x],
      y: bounds[xyToAnchor.y],
    };

    initView(this, xyBounds, xyToAnchor, config);
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
 * Bounds with `+` or `-` prefix are relative to the offsets at the time the
 * matcher was last restarted.
 *
 * All bounds given ultimately resolve to pixels and it is assumed this matches
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
 * it itself (`this`), the arguments that the {@link FXTriggerLogic}'s run
 * method expects, as well as the bounds if any.
 *
 * ## Types of clamps
 *
 * Clamps can be of two types:
 * 1. clamps that support bounds (or limits) to certain parameters and activate
 *    when the bounds are violated; and
 * 2. clamps that simply activate or deactivate when a certain event happens
 *
 * Currently, both built-in clamps are of the first type, but your custom clamp
 * can be of the second type.
 *
 * ### Bounded clamps
 * Clamps that define bounds adjust the composer's state when the bounds are
 * violated, in order to clamp it to fit within bounds. The condition they
 * monitor should translate to composer state parameters. The clamps can store
 * one or more sets of X/Y/Z parameters in the {@link FXClampStore} and define
 * the needed calculation to translate to and from clamp parameters to composer
 * state parameters via {@link FXClampLogic.toComposerDeltas} and
 * {@link FXClampLogic.toClampDeltas}.
 *
 * The {@link FXClampLogic.refresh} method should return an array of parameter
 * sets. A violation of the bounds will be calculated for each entry will, and
 * the maximum violation will be used to calculate the clamped composer state.
 *
 * The base clamp implementation will calculate whether the bounds have been
 * violated and request the pin to activate and adjust the composer state
 * accordingly.
 *
 * Bounded clamps **must** call the `setBounds` function in their constructor
 * to set the bounds.
 *
 * ### Unbounded clamps
 * Clamps that don't support bounds simply return a boolean from their
 * {@link FXClampLogic.refresh | logic's refresh} method to indicate whether
 * the clamp is active or not.
 *
 * __________________________
 *
 * See example below for implementing a basic clamp class.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If this clamp type has already been registered.
 *
 * @example
 * XXX TODO complete example
 * ```typescript
 * type CustomArg = string;
 * type CustomConfig = { opt: boolean };
 *
 * const { init } = registerFXClamp<
 *   "custom",
 *   { start: () => void, stop: () => void }, // data
 *   [CustomArg, CustomConfig | undefined], // arguments passed to run
 *   false, // does not use bounds
 * >({
 *   type: "custom",
 *   logic: {
 *     run(store, arg, config) {
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
 *     init(this, null, arg, config);
 *   }
 * }
 * ```
 *
 * @typeParam Data    The type of data the clamp stores. This is arbitrary data
 *                    to be shared across the {@link FXClampLogic} methods.
 * @typeParam Args    The type of arguments to pass to the instance methods
 *                    (defined in your {@link FXClampLogic}).
 * @typeParam Bounded True of the clamp is bounded.
 *
 * See {@link FXClampStore}.
 *
 * @category Base
 */
export const registerFXClamp = <
  T extends string,
  Data,
  Args extends unknown[],
  Bounded extends boolean,
>(
  definitions: FXClampDefinitions<T, Data, Args, Bounded>,
) => {
  if (registeredTypes.has(definitions.type)) {
    throw usageError(
      `FXClamp type '${definitions.type}' is already registered`,
    );
  }

  registeredTypes.set(definitions.type, definitions);

  return {
    init: (self: FXClamp<T>, bounds: FXClampBounds<Bounded>, ...args: Args) => {
      const initData: InitData<Args, Bounded> = {
        _invert: false,
        _args: args,
        _bounds: bounds,
      };
      allBuilderData.set(self, initData);
    },
  } as const;
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
   * Updates the clamps's reference parameters to be its current ones.
   *
   * It will also {@link resume} the clamp if it's paused.
   *
   * @param reference If given, this state will be translated to clamp parameters
   *                  according to
   *                  {@link FXClampLogic.toClampDeltas | the logic's toComposerDeltas}
   *                  and used to construct the reference parameters, instead
   *                  of the current parameters being used.
   */
  restart: (reference?: FXState) => void;
}

/**
 * Defines a new clamp type.
 *
 * @category Base
 */
export type FXClampDefinitions<
  T extends string,
  Data,
  Args extends unknown[],
  Bounded extends boolean,
> = {
  /**
   * Unique name for the clamp type.
   */
  type: T;

  /**
   * See {@link FXClampLogic}.
   */
  logic: FXClampLogic<Data, Args, Bounded>;
};

/**
 * These methods define how clamps operate.
 *
 * Inside each method, the current clamp instance which the logic operates can
 * be accessed as the `this` value (as long as the logic method is not an arrow
 * function).
 *
 * @category Base
 */
export type FXClampLogic<
  Data,
  Args extends unknown[],
  Bounded extends boolean,
> = {
  /**
   * The function will be called once when the clamp instance is created.
   *
   * It should {@link FXClampStore.setData | set the clamp's data} and do other
   * initialization.
   */
  run: (store: FXClampStore<Data, Bounded>, ...args: Args) => void;

  /**
   * The function should return an up-to-date clamp parameters or active state.
   *
   * If the clamp is bounded, then it **must** return an array of up-to-date
   * parameters. Otherwise, the clamp **must** return a boolean where `true`
   * means the clamp is active and `false` means it's not.
   *
   * It is called when the clamp is first initialized (after {@link run} has
   * been called) or when it's resumed.
   *
   * **IMPORTANT:** Bounded clamps must always return an array of parameters,
   * with the same number of entries each time, and their order must be fixed.
   */
  refresh: (store: FXClampStore<Data, Bounded>) => FXClampUpdate<Bounded>;

  /**
   * If given, it will be called when the clamp is paused.
   */
  pause?: (store: FXClampStore<Data, Bounded>) => void;

  /**
   * If given, it will be called when the clamp is resumed.
   */
  resume?: (store: FXClampStore<Data, Bounded>) => void;

  /**
   * Only used for bounded clamps during {@link refresh | updates} that set
   * parameters and unless {@link FXClampUpdate | applyDeviation} was set to
   * false.
   *
   * If given, it is used to translate from the clamp's parameters to the
   * composer's state parameters. If not given, the translation is one to one.
   *
   * @param clampDeltas The change in X/Y/Z of the clamp parameters
   *
   * @returns Should return the change to be applied to the composer state axes.
   */
  toComposerDeltas?: (
    store: FXClampStore<Data, Bounded>,
    clampDeltas: AxesDeltaValues,
  ) => AxesDeltaValues;

  /**
   * Only used for bounded clamps during {@link refresh | updates} that set
   * parameters and unless {@link FXClampUpdate | applyDeviation} was set to
   * false.
   *
   * If given, it is used to translate between from the composers's state
   * parameters to the clamp's parameters. If not given, the translation is one
   * to one.
   *
   * @param composerDeltas The change in X/Y/Z of the composer axes
   *
   * @returns Should return the change to be applied to the clamp parameters
   */
  toClampDeltas?: (
    store: FXClampStore<Data, Bounded>,
    composerDeltas: AxesDeltaValues,
  ) => AxesDeltaValues;
};

/**
 * Internal state and data management for a clamp to be used by its logic
 * methods.
 *
 * @category Base
 */
export type FXClampStore<Data, Bounded extends boolean> = {
  /**
   * Updates the clamp's parameters or state as per
   * {@link FXClampLogic.refresh | the clamp logic's refresh} method.
   *
   * Note that if the clamp is paused, it will only process the update if the
   * clamp is bounded and the bounds have been violated.
   *
   * @param override If given, this will be used as the update and the
   *                 {@link FXClampLogic.refresh | logic's refresh} method will
   *                 not be called.
   */
  update: (override?: FXClampUpdate<Bounded>) => void;

  /**
   * Returns the current state of the clamp.
   *
   * For bounded clamps, `params` holds the parameters that were returned during
   * the last {@link FXClampLogic.refresh | refresh} and `active` will be true
   * if the bounds are violated, false otherwise.
   */
  getClampState: () => FXClampState<Bounded>;

  /**
   * Returns the current state of the pin associated with the clamp.
   */
  getPinState: () => FXPinState;

  /**
   * Returns the current viewport size.
   */
  getViewportSize: () => Size;

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
};

/**
 * @category Base
 */
export type FXClampState<Bounded extends boolean> = Bounded extends true
  ? { active: boolean; params: FXClampParams[] }
  : { active: boolean };

/**
 * @category Base
 */
export type FXClampUpdate<Bounded extends boolean> = {
  input: FXClampUpdateInput<Bounded>;
} & FXClampUpdateOptions<Bounded>;

/**
 * @category Base
 */
export type FXClampUpdateInput<Bounded extends boolean> = Bounded extends true
  ? FXClampParams[]
  : boolean;

/**
 * @category Base
 */
export type FXClampUpdateOptions<Bounded extends boolean> = {
  /**
   * Only relevant for bounded clamps.
   *
   * This setting is true by default and it results in the composer's state
   * being adjusted by the same amount that the bounds were violated, so as to
   * clamp it to the bounded parameters (after they have been translated using
   * {@link FXClampLogic.toComposerState}). Set it to false to disable this
   * behaviour and simply freeze the composer state to its current values when
   * activating. This makes sense for example if the clamp's parameters are not
   * based on or influenced by the composer's state.
   *
   * @defaultValue true
   */
  applyDeviation?: Bounded extends true ? boolean : never;

  /**
   * If true, it indicates the update should happen immediately instead of
   * waiting for the next animation frame. Only set this if required.
   */
  realtime?: boolean;

  /**
   * The composer state that the parameters are related to. If not given, the
   * current composer state is used.
   */
  state?: FXState;
};

/**
 * @category Base
 */
export type FXClampBounds<Bounded extends boolean> = Bounded extends true
  ? {
      [A in "x" | "y" | "z"]?: BoundedValue;
    }
  : null;

/**
 * @category Base
 */
export type FXClampParams = {
  [A in "x" | "y" | "z"]: {
    current: number;
    low: number;
    high: number;
  };
};

/**
 * Define a change in the values of X/Y/Z parameters of the composer or clamp.
 *
 * @category Base
 */
export type AxesDeltaValues = { [A in "x" | "y" | "z"]: number };

// ------------------------------

const createClampInstance = <
  T extends string,
  D,
  A extends unknown[],
  B extends boolean,
>(
  clamp: FXClamp<T>,
  composer: FXComposer,
  pinActions: FXPinActions,
  parentLogger?: LoggerInterface,
): FXClampInstance => {
  /* istanbul ignore next */
  if (!_.isInstanceOf(clamp, FXClampBase)) {
    throw usageError("Object is not an FXClamp");
  }

  const definitions = registeredTypes.get<T, D, A, B>(clamp.type);
  /* istanbul ignore next */
  if (!definitions) {
    throw bugError(`No definitions saved for clamp type '${clamp.type}'`);
  }

  const { logic } = definitions;
  const {
    _args: args,
    _bounds: bounds,
    _invert: invert,
  } = getInitData<A, B>(clamp);

  let isPaused = true; // don't start until the pin restarts us
  let lastClampedComposerState: FXState | null = null;

  const instanceData = createInstanceData<D, B>(bounds);

  const store: FXClampStore<D, B> = {
    update: (override) => {
      const result = override ?? refresh(store);
      const {
        input,
        applyDeviation = false,
        realtime = false,
        state = composer.getState(),
      } = result;

      let deviation: AxesDeltaValues | null = null;
      try {
        deviation = updateClampState(
          clamp,
          instanceData,
          input,
          vpSizeWatch.get(),
          logger,
        );
      } catch (err) {
        // So that it's logged only once
        logError(err);
        return;
      }

      const s = instanceData._clampState;
      if (!s) {
        logError(bugError("Clamp state not updated"));
        return;
      }

      const clampedComposerState =
        applyDeviation && deviation
          ? getClampedComposerState(
              lastClampedComposerState ?? state,
              toComposerDeltas(store, deviation),
            )
          : state;

      // XXX
      // - avoid updating pin if current for all axes is the same
      // - lastClampedComposerState being cleared when it shouldn't be
      if (deviation && (deviation.x || deviation.y || deviation.z)) {
        lastClampedComposerState = clampedComposerState;
      } else if (
        !compareValuesIn(instanceData._prevClampState, instanceData._clampState)
      ) {
        // There was a change to the clamp parameters, but no deviation, so
        // we're not clamping anymore.
        lastClampedComposerState = null;
      }

      const update = {
        state: clampedComposerState,
        active: s.active,
        realtime,
      };

      if (!isPaused || (isBounded(instanceData) && update.active)) {
        logger?.debug10("Updated clamp", {
          isPaused,
          input,
          state,
          lastClampedComposerState,
          deviation,
          update,
        });
        pinActions.requestUpdate(update);
      }
    },

    getClampState: () => _.copyNested(getClampState(clamp, instanceData)),

    getPinState: () => pinActions.getState(),

    getViewportSize: () => vpSizeWatch.get(),

    getData: () => {
      /* istanbul ignore next */
      const data = instanceData._data;
      if (_.isUndefined(data)) {
        throw usageError(`No data saved for clamp '${clamp.type}' yet`);
      }

      return data;
    },
    setData: (data) => {
      instanceData._data = data;
    },

    getComposer: () => composer,
  };

  // ----------

  const setRunningState = (
    state: RUNNING_STATE,
    updateRef: FXState | boolean = false,
  ) => {
    const isChanged = isPaused !== (state === PAUSE);
    if (isChanged) {
      isPaused = !isPaused;
      logger?.debug7(`${isPaused ? "Pausing" : "Resuming"} clamp`);

      if (!isPaused) {
        store.update(); // refresh the state
      }
    }

    if (updateRef) {
      const currComposerState = composer.getState();
      const customRefComposerState = updateRef === true ? null : updateRef;
      instanceData._refComposerState =
        customRefComposerState ?? currComposerState;

      if (isBounded(instanceData) && customRefComposerState) {
        const deviation = getComposerStateDiff(
          currComposerState,
          customRefComposerState,
        );

        const r = getClampState(clamp, instanceData, true);
        logger?.debug7("Adjusting reference state", {
          deviation,
          ref: r,
        });
        // const cpy = _.copyNested(r.params); // XXX
        r.params = getClampedParams(r.params, toClampDeltas(store, deviation));
        // console.warn("XXX", {
        //   currComposerState,
        //   customRefComposerState,
        //   deviation,
        //   clampDeltas: toClampDeltas(store, deviation),
        //   cpy,
        //   new: r.params,
        // });
      }

      logger?.debug7("Updated reference state", instanceData._refClampState);
    }

    if (isChanged) {
      (isPaused ? logic?.pause : logic?.resume)?.call(self, store);
    }
  };

  // --------------------

  const self: FXClampInstance = {
    pause: () => setRunningState(PAUSE),
    resume: () => setRunningState(RESUME),
    restart: (reference?: FXState) =>
      setRunningState(RESUME, reference ?? true),
  };

  const logger = debug
    ? debug.Logger.getLoggerFor(self, {
        name: `FXClamp-${clamp.type}${invert ? "-inverted" : ""}`,
        parent: parentLogger,
        logAtCreation: args,
      })
    : void 0;

  const vpSizeWatch = watchSize(null, logger);
  const refresh = logic.refresh.bind(self);
  const toClampDeltas = logic.toClampDeltas?.bind(self) ?? ((s, d) => d);
  const toComposerDeltas = logic.toComposerDeltas?.bind(self) ?? ((s, d) => d);

  // --------------------

  logic.run.call(self, store, ...args);

  return self;
};

// ------------------------------

type InitData<A extends unknown[], B extends boolean> = {
  _invert: boolean;
  _args: A;
  _bounds: FXClampBounds<B>;
};

interface RegistrationMap {
  has(type: string): boolean;
  get<T extends string, D, A extends unknown[], B extends boolean>(
    type: T,
  ): FXClampDefinitions<T, D, A, B> | undefined;
  set<T extends string, D, A extends unknown[], B extends boolean>(
    type: T,
    definitions: FXClampDefinitions<T, D, A, B>,
  ): this;
}

interface BuilderDataMap {
  get<A extends unknown[], B extends boolean>(
    clamp: FXClamp,
  ): InitData<A, B> | undefined;
  set<A extends unknown[], B extends boolean>(
    clamp: FXClamp,
    initData: InitData<A, B>,
  ): this;
}

type InstanceData<D, B extends boolean> = B extends true
  ? {
      _bounds: FXClampBounds<true>;
      _clampState?: { params: FXClampParams[]; active: boolean };
      _prevClampState?: { params: FXClampParams[]; active: boolean };
      _refClampState?: { params: FXClampParams[]; active: boolean };
      _refComposerState?: FXState;
      _data?: D;
    }
  : {
      _bounds: FXClampBounds<false>;
      _clampState?: { active: boolean };
      _prevClampState?: { active: boolean };
      _refClampState?: { active: boolean };
      _refComposerState?: FXState;
      _data?: D;
    };

type BoundViolationInput = {
  _bounds: FXClampBounds<true>;
  _current: FXClampParams[];
  _previous: FXClampParams[];
  _reference: FXClampParams[];
  _viewportSize: Size;
};

type BoundViolation = {
  _violated: boolean;
  _deviation: AxesDeltaValues;
};

type ViewOffsetsInput = {
  _targets: Element[];
  _root: Element | undefined;
  _xyToAnchor: { x: "left" | "right"; y: "top" | "bottom" };
  _viewportSizeWatch: { get: () => Size };
};

type RUNNING_STATE = typeof PAUSE | typeof RESUME;
const PAUSE: unique symbol = _.SYMBOL() as typeof PAUSE;
const RESUME: unique symbol = _.SYMBOL() as typeof RESUME;

const registeredTypes: RegistrationMap = new Map();
const allBuilderData = new WeakMap() as BuilderDataMap;

// --------------------

const { init: initComposer } = registerFXClamp<
  "composer",
  {
    _tweenWatch: StartStopper;
  },
  [],
  true
>({
  type: "composer",
  logic: {
    run(store) {
      const logger = debug ? debug.Logger.getLoggerFor(this) : void 0;
      const composer = store.getComposer();
      const tweenHandler: FXComposerHandler = createConcurrentCallback(
        () => store.update(),
        { logger },
      );

      const tweenWatch = {
        start: () => composer.onTween(tweenHandler),
        stop: () => composer.offTween(tweenHandler),
      } as const;

      store.setData({
        _tweenWatch: tweenWatch,
      });
    },

    refresh: (store) => ({ input: [store.getComposer().getState()] }),
    pause: (store) => store.getData()._tweenWatch.stop(),
    resume: (store) => store.getData()._tweenWatch.start(),
  },
});

const { init: initView } = registerFXClamp<
  "view",
  {
    _applyDeviation: boolean;
    _offsetsInput: ViewOffsetsInput;
    _viewWatch: StartStopper;
    _monitor: StartStopper;
    _toComposerDeltas: (clampDeltas: AxesDeltaValues) => AxesDeltaValues;
    _toClampDeltas: (clampDeltas: AxesDeltaValues) => AxesDeltaValues;
  },
  [{ x: "left" | "right"; y: "top" | "bottom" }, FXViewClampConfig | undefined],
  true
>({
  type: "view",
  logic: {
    run(store, xyToAnchor, config) {
      const logger = debug
        ? debug.Logger.getLoggerFor(this, { logAtCreation: config })
        : void 0;

      const composer = store.getComposer();
      const { target: customTarget, root, aggressiveWatching } = config ?? {};

      const targets = customTarget ? [customTarget] : composer.getElements();
      const numTargets = _.lengthOf(targets);

      const offsetsInput: ViewOffsetsInput = {
        _targets: targets,
        _root: root,
        _xyToAnchor: xyToAnchor,
        _viewportSizeWatch: {
          get: () => store.getViewportSize(),
        },
      };

      const animatingComposer = customTarget
        ? getComposerInstance(customTarget)
        : composer;

      const applyDeviation = animatingComposer === composer;

      const viewWatch = atLeastOneVisible(
        targets,
        (hasVisible) => {
          (hasVisible ? monitor.start : monitor.stop)();
        },
        ViewWatcher.reuse({
          root,
          rootMargin: aggressiveWatching ? "500px" : "200px",
        }),
        logger,
      );

      // ----------

      const onStyleHandler = (
        predictOffsets: (
          state: FXState,
          prevOffsets: FXClampParams[],
        ) => FXClampParams[],
        state: FXState,
      ) => {
        const prevOffsets = store.getClampState().params;
        const pinState = store.getPinState();
        const predictedOffsets = predictOffsets(
          pinState.clamped ? pinState.state : state,
          prevOffsets,
        );
        store.update({
          input: predictedOffsets,
          applyDeviation,
          realtime: true,
          state,
        });

        // Check the actual offsets after repaint, in case corrections are
        // needed.
        waitForMeasureTime().then(() => store.update());
      };

      // -----

      // If the targets we're watching are animated by a composer, use an
      // onStyle callback and afterwards check for needed corrections short-term.
      // Otherwise, if the target is not animated by any composer, we have to
      // loop on each repaint following an animation frame.
      let monitor: StartStopper;
      let toClampDeltas: (clampDeltas: AxesDeltaValues) => AxesDeltaValues;
      let toComposerDeltas: (clampDeltas: AxesDeltaValues) => AxesDeltaValues;

      if (animatingComposer) {
        let predictOffsets: (
          state: FXState,
          prevOffsets: FXClampParams[],
        ) => FXClampParams[];

        const recalibrate = () => {
          ({ predictOffsets, toClampDeltas, toComposerDeltas } =
            getViewOffsetsCalibration(animatingComposer, offsetsInput, logger));
        };

        recalibrate();
        animatingComposer.onAdd(recalibrate);

        const callback: FXComposerHandler = createConcurrentCallback(
          (c, { state }) => onStyleHandler(predictOffsets, state),
          { logger },
        );

        monitor = {
          start: () => {
            animatingComposer.onStyle(callback);
          },
          stop: () => {
            animatingComposer.offStyle(callback);
          },
        };
      } else {
        toClampDeltas = toComposerDeltas = () => ({ x: 0, y: 0, z: 0 });

        monitor = loopOnRepaint(() => store.update(), logger);
      }

      store.setData({
        _applyDeviation: applyDeviation,
        _offsetsInput: offsetsInput,
        _viewWatch: viewWatch,
        _monitor: monitor,
        // toComposerDeltas and toComposerDeltas may be updated, so set a proxy
        // function
        _toComposerDeltas: (d) => toComposerDeltas(d),
        _toClampDeltas: (d) => toClampDeltas(d),
      });
    },

    refresh: (store) => {
      const applyDeviation = store.getData()._applyDeviation;

      return {
        applyDeviation,
        realtime: true,
        input: getViewOffsets(store.getData()._offsetsInput),
      };
    },

    pause: (store) => {
      const data = store.getData();
      data._viewWatch.stop();
      data._monitor.stop();
    },

    resume: (store) => store.getData()._viewWatch.start(),

    toComposerDeltas: (store, clampDeltas) =>
      store.getData()._toComposerDeltas(clampDeltas),

    toClampDeltas: (store, composerDeltas) =>
      store.getData()._toClampDeltas(composerDeltas),
  },
});

// --------------------

const getInitData = <A extends unknown[], B extends boolean>(
  clamp: FXClamp,
) => {
  const initData = allBuilderData.get<A, B>(clamp);
  /* istanbul ignore next */
  if (!initData) {
    throw bugError(`No init data saved for clamp '${clamp.type}'`);
  }
  return initData;
};

function createInstanceData<D, B extends boolean>(
  bounds: FXClampBounds<B>,
): InstanceData<D, B>;
function createInstanceData(bounds: FXClampBounds<boolean>) {
  return { _bounds: bounds };
}

function getClampState<D>(
  clamp: FXClamp,
  instanceData: InstanceData<D, true>,
  useReference?: boolean,
): FXClampState<true>;
function getClampState<D>(
  clamp: FXClamp,
  instanceData: InstanceData<D, false>,
  useReference?: boolean,
): FXClampState<false>;
function getClampState<D, B extends boolean>(
  clamp: FXClamp,
  instanceData: InstanceData<D, B>,
  useReference?: boolean,
): FXClampState<B>;
function getClampState<D>(
  clamp: FXClamp,
  instanceData: InstanceData<D, boolean>,
  useReference = false,
) {
  /* istanbul ignore next */
  const state = useReference
    ? instanceData._refClampState
    : instanceData._clampState;

  if (!state) {
    throw bugError(`No state saved for clamp '${clamp.type}'`);
  }

  return state;
}

const updateClampState = <D, B extends boolean>(
  clamp: FXClamp,
  instanceData: InstanceData<D, B>,
  input: FXClampUpdateInput<B>,
  viewportSize: Size,
  logger: LoggerInterface | undefined,
): AxesDeltaValues | null => {
  let deviation: AxesDeltaValues | null = null;
  let newState: InstanceData<D, B>["_clampState"];

  if (isBounded(instanceData)) {
    if (_.isBoolean(input)) {
      throw usageError(
        `Clamp '${clamp.type}' is bounded. Update must be array of parameters`,
      );
    }

    const currParams = instanceData._clampState?.params;
    if (currParams && _.lengthOf(currParams) !== _.lengthOf(input)) {
      throw usageError(
        `Clamp '${clamp.type}': length of update parameters array must be fixed`,
      );
    }

    newState = { params: input, active: false };
  } else {
    if (!_.isBoolean(input)) {
      throw usageError(
        `Clamp '${clamp.type}' is not bounded. Update must be true/false`,
      );
    }

    newState = { active: input };
  }

  instanceData._prevClampState = instanceData._clampState;
  instanceData._clampState = newState;
  if (!instanceData._refClampState) {
    instanceData._refClampState = newState;
  }

  if (isBounded(instanceData)) {
    const violationInput = getBoundViolationInput(
      clamp,
      instanceData,
      viewportSize,
    );

    if (violationInput) {
      const violation = getBoundViolation(violationInput);
      logger?.debug10("Bound violation", { violationInput, violation });

      newState.active = violation._violated;
      deviation = violation._deviation;
    }
  }

  return deviation;
};

const isBounded = <D>(
  data: InstanceData<D, boolean>,
): data is InstanceData<D, true> => !!data._bounds;

const getBoundViolationInput = <D, B extends boolean>(
  clamp: FXClamp,
  data: InstanceData<D, B>,
  viewportSize: Size,
): BoundViolationInput | null => {
  if (!isBounded(data)) {
    return null;
  }

  const prevParams = data._prevClampState?.params;
  if (!prevParams) {
    return null;
  }

  const params = getClampState(clamp, data).params;
  const refParams = getClampState(clamp, data, true).params;

  return {
    _bounds: data._bounds,
    _current: params,
    _previous: prevParams,
    _reference: refParams,
    _viewportSize: viewportSize,
  };
};

/**
 * Converts the given input raw or relative number as explained in
 * {@link FXComposerClampBounds} or {@link FXViewClampBounds}.
 *
 * @returns `null` if it doesn't resolve to a valid number.
 */
const toRawBoundsValue = (
  boundedValue: RawOrRelativeNumber | ViewportLength | undefined,
  input: BoundViolationInput,
  axis: "x" | "y" | "z",
  idx: number,
): number | null => {
  const reference = input._reference[idx][axis].current;
  const low = input._current[idx][axis].low;
  const high = input._current[idx][axis].high;

  const viewport = input._viewportSize;

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

const getBoundViolation = (input: BoundViolationInput): BoundViolation => {
  const getAxisDeviation = (
    boundedValue: RawOrRelativeNumber | ViewportLength | undefined,
    axis: "x" | "y" | "z",
    idx: number,
  ) => {
    const rawBound = toRawBoundsValue(boundedValue, input, axis, idx);
    return _.isNull(rawBound)
      ? null
      : {
          _rawBound: rawBound,
          _diff: input._current[idx][axis].current - rawBound,
        };
  };

  let violated = false;
  const deviation: AxesDeltaValues = { x: 0, y: 0, z: 0 };

  for (const axis of ["x", "y", "z"] as const) {
    const boundedValue = input._bounds[axis];
    if (_.isNullish(boundedValue)) {
      continue;
    }

    let axisViolated = false;

    for (let idx = 0; idx < _.lengthOf(input._current); idx++) {
      let thisViolated = false;
      let thisDiff = 0;

      if (_.isPrimitive(boundedValue)) {
        const res = getAxisDeviation(boundedValue, axis, idx);
        if (res) {
          thisDiff = res._diff;
          // This is an "exact" bound, therefore it has been violated if it the
          // bound has been crossed since the previous time.
          thisViolated =
            thisDiff !== 0 &&
            input._current[idx][axis].current < res._rawBound !==
              input._previous[idx][axis].current < res._rawBound;
        }
      } else {
        const res = {
          min: getAxisDeviation(boundedValue.min, axis, idx),
          max: getAxisDeviation(boundedValue.max, axis, idx),
        };

        if (res.min && res.max) {
          if (res.min._rawBound > res.max._rawBound) {
            [res.min, res.max] = [res.max, res.min];
          }
        }

        for (const k of ["min", "max"] as const) {
          if (res[k]) {
            const diff = res[k]._diff;

            // Diff is the current - bound.
            // This is a min/max bound, therefore it has been violated if
            // - it is min and current < bound (diff < 0), or
            // - it is max and current > bound (diff > 0)
            if (k === "min" ? diff < 0 : diff > 0) {
              thisViolated = true;
              thisDiff = diff;
              break;
            }
          }
        }

        if (!thisViolated) {
          // If neither min nor max were violated, choose the smaller deviation
          thisDiff =
            res.min && res.max
              ? havingMinAbs(res.min._diff, res.max._diff)
              : ((res.min ?? res.max)?._diff ?? 0);
        }
      }

      // ----------

      if (thisViolated) {
        if (axisViolated) {
          // If this axis bound has already been violated
          // choose the largest deviation
          deviation[axis] = havingMaxAbs(deviation[axis], thisDiff);
        } else {
          // Otherwise, if this is the first time it's been violated, use this
          // as the deviation; discard previous ones
          deviation[axis] = thisDiff;
        }
      } else if (!axisViolated) {
        // If this axis bound has not yet been violated, including in this round,
        // choose the smallest deviation
        deviation[axis] = havingMinAbs(deviation[axis], thisDiff);
      }

      // If this round didn't violate, but previous rounds did violate this
      // axis bound, leave the deviation as it is

      axisViolated ||= thisViolated;
    }

    violated ||= axisViolated;
  }

  return { _violated: violated, _deviation: deviation };
};

const getClampedParams = (params: FXClampParams[], deltas: AxesDeltaValues) => {
  const result = _.copyNested(params);
  for (const p of result) {
    for (const a of ["x", "y", "z"] as const) {
      p[a].current -= deltas[a] ?? 0;
    }
  }

  return result;
};

const getClampedComposerState = (state: FXState, deltas: AxesDeltaValues) => {
  const result = _.copyNested(state);
  for (const a of ["x", "y", "z"] as const) {
    result[a].previous = result[a].current;
    result[a].current -= deltas[a] ?? 0;
  }

  return result;
};

const getComposerStateDiff = (
  stateA: FXState,
  stateB: FXState,
): AxesDeltaValues => {
  const deltas = { x: 0, y: 0, z: 0 };
  for (const a of ["x", "y", "z"] as const) {
    deltas[a] = stateA[a].current - stateB[a].current;
  }

  return deltas;
};

// ----------

const getViewOffsets = (input: ViewOffsetsInput) => {
  const offsets: FXClampParams[] = [];
  const viewport = input._viewportSizeWatch.get();

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
      x: {
        current: tblrOffsets[input._xyToAnchor.x],
        low: 0,
        high: viewport.width,
      },
      y: {
        current: tblrOffsets[input._xyToAnchor.y],
        low: 0,
        high: viewport.height,
      },
      z: {
        current: 0,
        low: 0,
        high: 0,
      },
    });
  }

  return offsets;
};

const getViewOffsetsCalibration = (
  composer: FXComposer,
  input: ViewOffsetsInput,
  logger: LoggerInterface | undefined,
) => {
  const calibrator = () => {
    const offsets = getViewOffsets(input);
    return offsets.map((o) => ({
      x: o.x.current,
      y: o.y.current,
    }));
  };

  const deltaS = 100;
  const numElements = _.lengthOf(input._targets);

  // Assume that offsets don't depend on state's Z value, and only check X/Y
  // dependency.
  // Also assume that all elements are translated in the same way by the
  // composer.
  //
  // => we have 4 linear equations to solve for with calibration:
  //
  // 1. Offset's X as a function of state's X value
  //    delta(o_x) = A_xx * delta(s_x) (when delta(s_y) is 0)
  //
  // 2. Offset's X as a function of state's Y value
  //    delta(o_x) = A_xy * delta(s_y) (when delta(s_x) is 0)
  //
  // 3. Offset's Y as a function of state's X value
  //    delta(o_y) = A_yx * delta(s_x) (when delta(s_y) is 0)
  //
  // 4. Offset's Y as a function of state's Y value
  //    delta(o_y) = A_yy * delta(s_y) (when delta(s_x) is 0)
  //
  // In general:
  // A_jk = delta(o_j) / delta(s_k)
  //
  // So we measure offsets at 3 points:
  // - s_x = 0, s_y = 0
  // - s_x = 100, s_y = 0
  // - s_x = 0, s_y = 100
  //
  // ------------------------------
  //
  // => Solution in terms of delta(s_j):
  //
  // delta(s_x) = ( A_yy * delta(o_x) - A_xy * delta(o_y) ) / D
  // delta(s_y) = ( A_xx * delta(o_y) - A_yx * delta(o_x) ) / D
  //
  // where D = A_xx * A_yy - A_xy * A_yx

  const offsets0 = composer.withCalibrationContext(calibrator, {
    x: { current: 0, target: deltaS },
    y: { current: 0, target: deltaS },
  });

  const offsetsVarX = composer.withCalibrationContext(calibrator, {
    x: { current: deltaS, target: deltaS },
  });

  const offsetsVarY = composer.withCalibrationContext(calibrator, {
    y: { current: deltaS, target: deltaS },
  });

  const constants = (() => {
    const o = offsets0[0];
    const oVarX = offsetsVarX[0];
    const oVarY = offsetsVarY[0];

    return {
      A_xx: (oVarX.x - o.x) / deltaS,
      A_xy: (oVarY.x - o.x) / deltaS,
      A_yx: (oVarX.y - o.y) / deltaS,
      A_yy: (oVarY.y - o.y) / deltaS,
    };
  })();

  logger?.debug7("Got calibration", {
    offsets0,
    offsetsVarX,
    offsetsVarY,
    constants,
  });

  const predictOffsets = (
    state: FXState,
    prevOffsets: FXClampParams[],
  ): FXClampParams[] => {
    const composerDeltas = {
      x: state.x.current - state.x.previous,
      y: state.y.current - state.y.previous,
      z: 0,
    };

    const clampDeltas = toClampDeltas(composerDeltas);

    const predicted: FXClampParams[] = [];
    for (let i = 0; i < numElements; i++) {
      const params = _.copyNested(prevOffsets[i]);
      params.x.current += clampDeltas.x;
      params.y.current += clampDeltas.y;
      predicted.push(params);
    }

    return predicted;
  };

  const toComposerDeltas = (clampDeltas: AxesDeltaValues): AxesDeltaValues => {
    const c = constants;
    const det = c.A_xx * c.A_yy - c.A_xy * c.A_yx;

    let x = 0,
      y = 0;
    const z = 0;
    if (det !== 0) {
      x = (c.A_yy * clampDeltas.x - c.A_xy * clampDeltas.y) / det;
      y = (c.A_xx * clampDeltas.y - c.A_yx * clampDeltas.x) / det;
    } else if (c.A_xx * c.A_yy === 0) {
      if (clampDeltas.x && c.A_xx && !c.A_xy) {
        x = clampDeltas.x / c.A_xx;
      } else if (clampDeltas.y && c.A_yx && !c.A_yx) {
        x = clampDeltas.y / c.A_yx;
      }

      if (clampDeltas.x && c.A_xy && !c.A_xx) {
        y = clampDeltas.x / c.A_xy;
      } else if (clampDeltas.y && c.A_yy && !c.A_yx) {
        y = clampDeltas.y / c.A_yy;
      }
    }
    // Otherwise XXX TODO: ambiguous and not invertible

    return { x, y, z };
  };

  const toClampDeltas = (composerDeltas: AxesDeltaValues): AxesDeltaValues => {
    const c = constants;
    return {
      x: composerDeltas.x * c.A_xx + composerDeltas.y * c.A_xy,
      y: composerDeltas.x * c.A_yx + composerDeltas.y * c.A_yy,
      z: 0,
    };
  };

  return { predictOffsets, toComposerDeltas, toClampDeltas };
};

// --------------------

setInstanceCreator("clamp", createClampInstance);

_.brandClass(FXClampBase, "FXClampBase");
_.brandClass(FXComposerClamp, "FXComposerClamp");
_.brandClass(FXViewClamp, "FXViewClamp");
