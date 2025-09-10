/**
 * @module Effects
 *
 * @since v1.3.0
 */

// XXX
// TODO:
// - clamp to internally calculate violation and resulting clamped composer
//   state and pass this onto the pin
//   - clamp store to store bounds and clamp specific offsets (current/low/high)
//     and translate
//   - requestUpdate to accept useDeviation param
//
// - composer clamp reference when restarted after other pinned is wrong;
//   master pin needs to save clamped state and pass it to restart? then
//   restart needs to apply this deviation to the ref state?
//
// - view clamp to support middle (x/y)
//
// - effect callbacks to receive viewport size
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
  RawOrRelativeNumber,
  DeepPartial,
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
 * state parameters via {@link FXClampLogic.toComposerParam} and
 * {@link FXClampLogic.toClampParam}.
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
 *     init(this, arg, config);
 *   }
 * }
 * ```
 *
 * @typeParam Data   The type of data the clamp stores. This is arbitrary data
 *                   to be shared across the {@link FXClampLogic} methods.
 * @typeParam Args   The type of arguments to pass to the instance methods
 *                   (defined in your {@link FXClampLogic}).
 *
 * See {@link FXClampStore}.
 *
 * @category Base
 */
export const registerFXClamp = <T extends string, Data, Args extends unknown[]>(
  definitions: FXClampDefinitions<T, Data, Args>,
) => {
  if (registeredTypes.has(definitions.type)) {
    throw usageError(
      `FXClamp type '${definitions.type}' is already registered`,
    );
  }

  registeredTypes.set(definitions.type, definitions);

  return {
    init: (self: FXClamp<T>, bounds: FXClampBounds | null, ...args: Args) => {
      const initData: FXClampInitData<Args> = {
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
   *                  {@link FXClampLogic.toClampParam | the logic's toComposerParam}
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
> = {
  /**
   * Unique name for the clamp type.
   */
  type: T;

  /**
   * See {@link FXClampLogic}.
   */
  logic: FXClampLogic<Data, Args>;
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
export type FXClampLogic<Data, Args extends unknown[]> = {
  /**
   * The function will be called once when the clamp instance is created.
   *
   * It should {@link FXClampStore.setData | set the clamp's data} and do other
   * initialization.
   */
  run: (store: FXClampStore<Data>, ...args: Args) => void;

  /**
   * The function should return an up-to-date clamp parameters or active state.
   *
   * If the clamp defines bounds, then it may return an array of up-to-date
   * parameters. In any case, the clamp may return a boolean where `true` means
   * the clamp is active and `false` means it's not. If it returns only a
   * boolean, the composer's state is not adjusted in any way, but simply
   * frozen at its current values if the clamp is active.
   *
   * It is called when the clamp is first initialized (after {@link run} has
   * been called) or when it's resumed.
   *
   * **IMPORTANT:** If returning an array of parameters, the number of entries
   * in the array must be the same each time, and their order must be fixed.
   */
  refresh: (store: FXClampStore<Data>) => boolean | FXClampParams[];

  /**
   * If given, it will be called when the clamp is paused.
   */
  pause?: (store: FXClampStore<Data>) => void;

  /**
   * If given, it will be called when the clamp is resumed.
   */
  resume?: (store: FXClampStore<Data>) => void;

  /**
   * Only used for bounded clamps during {@link refresh | updates} that set
   * parameters and unless {@link FXClampStore.update | `applyDeviation`} was
   * set to false.
   *
   * If given, it is used to translate from the clamp's parameters to the
   * composer's state parameters. If not given, the translation is one to one.
   */
  toComposerState?: (
    store: FXClampStore<Data>,
    params: FXClampParams,
  ) => DeepPartial<FXState>;

  /**
   * Only used for bounded clamps during {@link refresh | updates} that set
   * parameters and unless {@link FXClampStore.update | `applyDeviation`} was
   * set to false.
   *
   * If given, it is used to translate between from the composers's state
   * parameters to the clamp's parameters. If not given, the translation is one
   * to one.
   */
  toClampParams?: (store: FXClampStore<Data>, state: FXState) => FXClampParams;
};

/**
 * Internal state and data management for a clamp to be used by its logic
 * methods.
 *
 * @category Base
 */
export type FXClampStore<Data> = {
  /**
   * Updates the clamp's parameters or state as per
   * {@link FXClampLogic.refresh | the clamp logic's refresh} method.
   *
   * Note that if the clamp is paused, it will update the state only when
   * resumed.
   *
   * @param [options.input]          If given, this will be used as the update
   *                                 and the
   *                                 {@link FXClampLogic.refresh | logic's refresh}
   *                                 method will not be called.
   * @param [options.applyDeviation] Only relevant for bounded clamps. Ignored
   *                                 if the update input (or refresh result) is
   *                                 a boolean only.
   *                                 This setting is true by default and it
   *                                 results in the composer's state being
   *                                 adjusted by the same amount that the
   *                                 bounds were violated, so as to clamp it
   *                                 to the bounded parameters (after they have
   *                                 been translated using
   *                                 {@link FXClampLogic.toComposerState}).
   *                                 Set it to false to disable this behaviour
   *                                 and simply freeze the composer state to
   *                                 its current values when activating.
   *                                 This makes sense for example if the
   *                                 clamp's parameters are not based on or
   *                                 influenced by the composer's state.
   * @param [options.realtime]       If true, it indicates the update should
   *                                 happen immediately instead of waiting for
   *                                 the next animation frame. Only set this if
   *                                 required.
   * @param [options.state]          The composer state that the parameters are
   *                                 related to. If not given, the current
   *                                 composer state is used.
   */
  update: (options?: {
    input?: FXClampParams[] | boolean;
    applyDeviation?: boolean;
    realtime?: boolean;
    state?: FXState;
  }) => void;

  /**
   * Returns the current state of the clamp. `params` holds the parameters that
   * were returned during the last {@link FXClampLogic.refresh | refresh} if
   * any.
   */
  getClampState: () => { params: FXClampParams[] | null; active: boolean };

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
export type FXClampBounds = {
  [A in "x" | "y" | "z"]?: BoundedValue;
};

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
 * This is passed by the base clamp implementation to the associated pin.
 *
 * @category Base
 */
export type FXClampUpdate = {
  /**
   * The composer state to update to.
   */
  state: FXState;

  /**
   * True if the clamp is active.
   */
  active: boolean;

  /**
   * True if the update should happen immediately.
   */
  realtime: boolean;
};

// ------------------------------

const createClampInstance = <T extends string, D, A extends unknown[]>(
  clamp: FXClamp<T>,
  composer: FXComposer,
  requestPinUpdate: (update: FXClampUpdate) => void,
  parentLogger?: LoggerInterface,
): FXClampInstance => {
  /* istanbul ignore next */
  if (!_.isInstanceOf(clamp, FXClampBase)) {
    throw usageError("Object is not an FXClamp");
  }

  const definitions = registeredTypes.get<T, D, A>(clamp.type);
  /* istanbul ignore next */
  if (!definitions) {
    throw bugError(`No definitions saved for clamp type '${clamp.type}'`);
  }

  const { logic } = definitions;
  const {
    _args: args,
    _bounds: bounds,
    _invert: invert,
  } = getInitData<A>(clamp);

  let isPaused = true; // don't start until the pin restarts us
  // XXX let lastChangeWhilePaused: FXClampViolation | null = null;

  const storeData: {
    _data?: D;
  } = {}; // XXX

  const store: FXClampStore<D> = {
    update: (options) => {
      // XXX TODO
    },

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
  };

  // ----------

  // const updateViolation = (
  //   params: FXClampParams[],
  //   options?: { applyDeviation?: boolean; realtime?: boolean },
  // ) => {
  //   // XXX
  //   // calculate violation
  //   // scale deviation ?
  // };

  // // -----
  // // XXX ------------------------------

  // const XXXgetState = (useReference: boolean, refresh?: boolean) => {
  //   if (refresh) {
  //     storeData._state = refreshState(store);
  //   }

  //   const state = useReference ? storeData._refState : storeData._state;

  //   /* istanbul ignore next */
  //   if (_.isUndefined(state)) {
  //     throw bugError(`No state saved for clamp '${clamp.type}'`);
  //   }

  //   return _.copyNested(state);
  // };

  // // -----

  // const setViolation = (violation: FXClampViolation) => {
  //   const { active } = violation;
  //   if (!isPaused) {
  //     logger?.debug7("Setting new clamp violation", violation);
  //     requestPinUpdate(_.copyNested(violation));
  //   } else if (!!lastChangeWhilePaused?.active !== active) {
  //     lastChangeWhilePaused = violation;
  //   }
  // };

  // const setRunningState = (state: RUNNING_STATE, updateRef = false) => {
  //   const isChanged = isPaused !== (state === PAUSE);
  //   if (isChanged) {
  //     isPaused = !isPaused;

  //     logger?.debug7(`${isPaused ? "Pausing" : "Resuming"} clamp`);

  //     if (!isPaused && lastChangeWhilePaused) {
  //       setViolation(lastChangeWhilePaused);
  //       lastChangeWhilePaused = null;
  //     }

  //     if (!isPaused) {
  //       store.getState(true); // refresh the state
  //     }
  //   }

  //   if (updateRef) {
  //     storeData._refState = storeData._state;
  //     storeData._refComposerState = composer.getState();
  //     logger?.debug7("Updated reference state", storeData._refState);
  //   }

  //   if (isChanged) {
  //     (isPaused ? logic?.pause : logic?.resume)?.call(self, store);
  //   }
  // };

  // --------------------

  const self: FXClampInstance = {
    pause: () => setRunningState(PAUSE),
    resume: () => setRunningState(RESUME),
    restart: (reference?: FXState) => {
      // XXX TODO reference
      setRunningState(RESUME, true);
    },
  };

  const logger = debug
    ? debug.Logger.getLoggerFor(self, {
        name: `FXClamp-${clamp.type}${invert ? "-inverted" : ""}`,
        parent: parentLogger,
        logAtCreation: args,
      })
    : void 0;

  const vpSizeWatch = watchSize(null, logger);

  const refresh = logic.refresh?.bind(self);

  // --------------------

  logic.run.call(self, store, ...args);

  return self;
};

// ------------------------------

type FXClampInitData<A extends unknown[]> = {
  _invert: boolean;
  _args: A;
  _bounds: FXClampBounds | null;
};

interface RegistrationMap {
  has(type: string): boolean;
  get<T extends string, D, A extends unknown[]>(
    type: T,
  ): FXClampDefinitions<T, D, A> | undefined;
  set<T extends string, D, A extends unknown[]>(
    type: T,
    definitions: FXClampDefinitions<T, D, A>,
  ): this;
}

interface BuilderDataMap {
  get<A extends unknown[]>(clamp: FXClamp): FXClampInitData<A> | undefined;
  set<A extends unknown[]>(clamp: FXClamp, initData: FXClampInitData<A>): this;
}

type BoundViolationInput = {
  _bounds: FXClampBounds;
  _current: FXClampParams;
  _previous: FXClampParams;
  _reference: FXClampParams;
  _viewportSize: { get: () => Size };
};

type BoundViolation = {
  _violated: boolean;
  _clampTo: FXClampParams;
};

type ViewOffsetsInput = {
  _targets: Element[];
  _root: Element | undefined;
  _xyToAnchor: { x: "left" | "right"; y: "top" | "bottom" };
  _viewportSize: { get: () => Size };
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
  []
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

    refresh: (store) => [store.getComposer().getState()],
    pause: (store) => store.getData()._tweenWatch.stop(),
    resume: (store) => store.getData()._tweenWatch.start(),
  },
});

const { init: initView } = registerFXClamp<
  "view",
  {
    _offsetsInput: ViewOffsetsInput;
    _viewWatch: StartStopper;
    _monitor: StartStopper;
  },
  [{ x: "left" | "right"; y: "top" | "bottom" }, FXViewClampConfig | undefined]
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
        _viewportSize: {
          get: () => store.getViewportSize(),
        },
      };

      const animatingComposer = customTarget
        ? getComposerInstance(customTarget)
        : composer;

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

      const getSavedOffsets = () => {
        const { params: offsets } = store.getClampState();
        if (!offsets) {
          throw bugError("No offsets saved for view clamp");
        }
        return offsets;
      };

      // -----

      const onStyleHandler = (
        predictOffsets: (
          state: FXState,
          prevOffsets: FXClampParams[],
        ) => FXClampParams[],
        state: FXState,
      ) => {
        const prevOffsets = getSavedOffsets();
        const predictedOffsets = predictOffsets(state, prevOffsets);
        const applyDeviation = animatingComposer === composer;
        store.update({
          input: predictedOffsets,
          applyDeviation,
          realtime: true,
          state,
        });

        // Check if corrections are needed after repaint.
        // Keep going for as long as there are changes which would happen if
        // the styles use transitions.
        onRepaintCheck.start();
      };

      // -----

      const onRepaintChecker = async () => {
        const prevOffsets = getSavedOffsets();
        store.update();
        const offsets = getSavedOffsets();

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
          onRepaintCheck.stop();
        }
      };

      const onRepaintCheck = loopOnRepaint(onRepaintChecker);

      // -----

      // If the targets we're watching are animated by a composer, use an
      // onStyle callback and afterwards check for needed corrections short-term.
      // Otherwise, if the target is not animated by any composer, we have to
      // loop on each repaint following an animation frame.
      let monitor: StartStopper;
      if (animatingComposer) {
        const { predictOffsets, toClampParams, toClampParams } =
          getViewOffsetsPredictor(animatingComposer, offsetsInput);

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
            onRepaintCheck.stop();
          },
        };
      } else {
        monitor = loopOnRepaint(
          () =>
            store.update({
              applyDeviation: false,
              realtime: true,
            }),
          logger,
        );
      }

      store.setData({
        _offsetsInput: offsetsInput,
        _viewWatch: viewWatch,
        _monitor: monitor,
      });
    },

    refresh: (store) => getViewOffsets(store.getData()._offsetsInput),

    pause: (store) => {
      const data = store.getData();
      data._viewWatch.stop();
      data._monitor.stop();
    },

    resume: (store) => store.getData()._viewWatch.start(),
  },
});

// --------------------

const getInitData = <A extends unknown[]>(clamp: FXClamp) => {
  const initData = allBuilderData.get<A>(clamp);
  /* istanbul ignore next */
  if (!initData) {
    throw bugError(`No init data saved for clamp '${clamp.type}'`);
  }
  return initData;
};

const getViewOffsets = (input: ViewOffsetsInput) => {
  const offsets: FXClampParams[] = [];
  const viewport = input._viewportSize.get();

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

const getViewOffsetsPredictor = (
  composer: FXComposer,
  input: ViewOffsetsInput,
) => {
  const calibrator = () => {
    const offsets = getViewOffsets(input);
    return offsets.map((o) => ({
      x: o.x.current,
      y: o.y.current,
    }));
  };

  const stateToXY = (s: FXState, usePrevious = false) => {
    const prop = usePrevious ? "previous" : "current";
    return {
      x: s.x[prop],
      y: s.y[prop],
    };
  };

  const delta = 100;
  const numElements = _.lengthOf(input._targets);

  // Assume that offsets don't depend on state's Z value, and only check X/Y
  // dependency.
  // Also assume that all elements are translated in the same way by the
  // composer.
  //
  // => we have 4 linear equations to solve for with calibration:
  //
  // 1. Offset's X as a function of state's X value
  //    o_x = A_x + B_xx * s_x (when s_y is 0)
  //
  // 2. Offset's X as a function of state's Y value
  //    o_x = A_x + B_xy * s_y (when s_x is 0)
  //
  // 3. Offset's Y as a function of state's X value
  //    o_y = A_y + B_yx * s_x (when s_y is 0)
  //
  // 4. Offset's Y as a function of state's Y value
  //    o_y = A_y + B_yy * s_y (when s_x is 0)
  //
  // In general:
  // A_j = o_j at the initial state of 0
  // B_jk = (o_j - A_j) / s_k
  //
  // So we measure offsets at 3 points:
  // - s_x = 0, s_y = 0
  // - s_x = delta, s_y = 0
  // - s_x = 0, s_y = delta

  const offsets0 = composer.withCalibrationContext(calibrator, {
    x: { current: 0 },
    y: { current: 0 },
  });

  const offsetsVarX = composer.withCalibrationContext(calibrator, {
    x: { current: delta },
  });

  const offsetsVarY = composer.withCalibrationContext(calibrator, {
    y: { current: delta },
  });

  const constants = (() => {
    const o = offsets0[0];
    const oVarX = offsetsVarX[0];
    const oVarY = offsetsVarY[0];

    return {
      A_x: o.x,
      A_y: o.y,
      B_xx: (oVarX.x - o.x) / delta,
      B_xy: (oVarY.x - o.x) / delta,
      B_yx: (oVarX.y - o.y) / delta,
      B_yy: (oVarY.y - o.y) / delta,
    };
  })();

  const predictOffsets = (
    state: FXState,
    prevOffsets: FXClampParams[],
  ): FXClampParams[] => {
    const s = stateToXY(state);
    const prevS = stateToXY(state, true);

    const predicted: FXClampParams[] = [];
    for (let i = 0; i < numElements; i++) {
      const params = _.copyNested(prevOffsets[i]);
      const c = constants;

      params.x.current +=
        (s.x - prevS.x) * c.B_xx + // + change due to change in state X
        (s.y - prevS.y) * c.B_xy; // + change due to change in state Y

      params.y.current +=
        (s.x - prevS.x) * c.B_yx + // + change due to change in state X
        (s.y - prevS.y) * c.B_yy; // + change due to change in state Y

      predicted.push(params);
    }

    return predicted;
  };

  const toComposerState = (params: FXClampParams): DeepPartial<FXState> => {
    // XXX
  };

  const toClampParams = (state: FXState): FXClampParams => {
    // XXX
  };

  return { predictOffsets, toComposerState, toClampParams };
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
): number | null => {
  const reference = input._reference[axis].current;
  const low = input._current[axis].low;
  const high = input._current[axis].high;
  const viewport = input._viewportSize.get();

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
  const getDiff = (
    boundedValue: RawOrRelativeNumber | ViewportLength | undefined,
    axis: "x" | "y" | "z",
  ) => {
    const rawBound = toRawBoundsValue(boundedValue, input, axis);
    return {
      _rawBound: rawBound,
      _diff: _.isNull(rawBound)
        ? null
        : input._current[axis].current - rawBound,
    };
  };

  let violated = false;
  const clampTo = _.copyNested(input._current);

  for (const axis of ["x", "y", "z"] as const) {
    const boundedValue = input._bounds[axis];
    if (_.isNullish(boundedValue)) {
      continue;
    }

    let rawBound: number | null = null,
      thisViolated = false;

    if (_.isPrimitive(boundedValue)) {
      ({ _rawBound: rawBound } = getDiff(boundedValue, axis));

      if (!_.isNull(rawBound)) {
        // This is an "exact" bound, therefore it has been violated if it the
        // bound has been crossed since the previous time.
        thisViolated =
          input._current[axis].current < rawBound !==
          input._previous[axis].current < rawBound;
      }
    } else {
      for (const k of ["min", "max"] as const) {
        const { _rawBound, _diff: diff } = getDiff(boundedValue[k], axis);
        rawBound = _rawBound;

        if (!_.isNull(diff)) {
          // Diff is the current - bound.
          // This is a min/max bound, therefore it has been violated if
          // - it is min and current < bound (diff < 0), or
          // - it is max and current > bound (diff > 0)
          thisViolated = k === "min" ? diff < 0 : diff > 0;
        }
      }
    }

    if (thisViolated && !_.isNull(rawBound)) {
      clampTo[axis].current = rawBound;
      violated = true;
    }
  }

  return { _violated: violated, _clampTo: clampTo };
};

// --------------------

setInstanceCreator("clamp", createClampInstance);

_.brandClass(FXClampBase, "FXClampBase");
_.brandClass(FXComposerClamp, "FXComposerClamp");
_.brandClass(FXViewClamp, "FXViewClamp");
