/**
 * @module Effects
 *
 * @since v1.3.0
 */

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

import { toRawNum, RawNumberCalculator } from "@lisn/utils/math";
import { toIterableIfNot } from "@lisn/utils/misc";

import { createCallback } from "@lisn/modules/callback";

import { FXState } from "@lisn/effects/types";
import { FXComposer, FXComposerHandler } from "@lisn/effects/fx-composer";
import {
  atLeastOneVisible,
  watchSize,
  loopOnAfterPaint,
} from "@lisn/effects/_internal";

import { ViewWatcher } from "@lisn/watchers/view-watcher";

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
 * {@link registerClamp} registers a new clamp type. It returns an object with
 * an `init` property holding a function.
 *
 * Your clamp class should call this `init` function in its constructor, passing
 * it itself (`this`). `init` will return an object containing the following
 * function:
 * - `setConfig`: sets the configuration that the {@link FXClampStore} will hold
 *                for the instance
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If this clamp type has already been registered.
 *
 * XXX TODO example
 *
 * @typeParam State  The type of state the clamp has. The store will hold both
 *                   the current state as well as the state at the time the
 *                   clamp was last restarted.
 * @typeParam Data   The type of data the clamp stores. This is arbitrary data
 *                   to be shared across the {@link FXClampLogic} methods.
 * @typeParam Config The type of configuration the clamp needs. Use this to pass
 *                   data from your clamp class onto the instance methods
 *                   (defined in your {@link FXClampLogic}).
 *
 * See {@link FXClampStore}.
 *
 * @category Base
 */
export const registerClamp = <T extends string, State, Data, Config>(
  definitions: FXClampDefinitions<T, State, Data, Config>,
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
        setConfig: (config: Config) => {
          const data = getInitData<Config>(self);
          data._config = config;
        },
      } as const;
    },
  };
};

const CLAMP: unique symbol = _.SYMBOL.for(
  "LISN.js/types/clamp",
) as typeof CLAMP;

/**
 * Base clamp builder class.
 *
 * @category Base
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

  /**
   * Unique name for the clamp type.
   */
  abstract type: T;

  /**
   * Inverts the logic of the clamp. It will activate when it previously would
   * deactivate and vice versa.
   */
  readonly invert: () => this;

  constructor() {
    const data: FXClampInitData<unknown> = { _invert: false, _config: null };
    allBuilderData.set(this, data);

    this.invert = () => {
      data._invert = true;
      return this;
    };
  }
}

/**
 * @category Base
 */
export interface FXClampInstance {
  /**
   * Returns true if the clamp is running (not paused).
   */
  isActive: () => boolean;

  /**
   * Pauses the clamp's monitoring of the condition.
   */
  pause: () => void;

  /**
   * Resumes the clamp's monitoring of the condition.
   */
  resume: () => void;

  /**
   * Updates the clamps's internal reference data to be its current data.
   *
   * It also resumes it if it is paused.
   */
  restart: () => void;
}

/**
 * Defines a new clamp type.
 *
 * @category Base
 */
export type FXClampDefinitions<T extends string, State, Data, Config> = {
  /**
   * Unique name for the clamp type.
   */
  type: T;

  /**
   * See {@link FXClampLogic}.
   */
  logic: FXClampLogic<State, Data, Config>;
};

/**
 * These methods define how clamps operate and copy their state/data.
 *
 * The current clamp instance which the logic operates can be accessed as the
 * `this` value (as long as the logic method is not an arrow function).
 *
 * @category Base
 */
export type FXClampLogic<State, Data, Config> = {
  /**
   * The function will be called once when the clamp instance is created.
   */
  run: (store: FXClampStore<State, Data, Config>) => void;

  /**
   * If given, it will be called when the clamp is paused.
   */
  pause?: (store: FXClampStore<State, Data, Config>) => void;

  /**
   * If given, it will be called when the clamp is resumed.
   */
  resume?: (store: FXClampStore<State, Data, Config>) => void;

  /**
   * If given, it will be used to copy the state before storing it in or
   * retrieving it from the store. It is required in order to keep a copy of the
   * state at the time of last restart.
   *
   * @defaultValue An internal function which deeply copies arbitrary data, but
   * may not be the most performance-efficient.
   */
  copyState?: (state: State | undefined) => State | undefined;

  /**
   * If given, it will be used to copy the data before storing it in or
   * retrieving it from the store. If omitted the data is **not** copied, so if
   * you modify it after storing or retrieving, it will be modified in the
   * store.
   *
   * @defaultValue undefined // none
   */
  copyData?: (state: Data | undefined) => Data | undefined;
};

/**
 * Internal state and data management for a clamp to be used by its logic
 * methods.
 *
 * @category Base
 */
export type FXClampStore<State, Data, Config> = {
  /**
   * Returns the configuration set by the clamp prior to instantiation.
   *
   * Note that it is not copied, so you should generally avoid modifying it.
   */
  getConfig: () => Config | null;

  /**
   * Returns the current state, last set using {@link setState}.
   *
   * It is copied according to
   * {@link FXClampLogic.copyState | your logic's `copyState`} before returning.
   */
  getState: () => State | undefined;

  /**
   * Updates the current state.
   *
   * It is copied according to
   * {@link FXClampLogic.copyState | your logic's `copyState`} before storing.
   */
  setState: (state: State) => void;

  /**
   * Returns the state at the time the clamp was last
   * {@link FXClampInstance.restart | restarted}. Returns undefined if the clamp
   * has never been restarted.
   *
   * It is copied according to
   * {@link FXClampLogic.copyState | your logic's `copyState`} before returning.
   */
  getReferenceState: () => State | undefined;

  /**
   * Returns the current data, last set using {@link setData}.
   *
   * It is copied according to
   * {@link FXClampLogic.copyData | your logic's `copyData`} before returning.
   */
  getData: () => Data | undefined;

  /**
   * Updates the current data.
   *
   * It is copied according to
   * {@link FXClampLogic.copyData | your logic's `copyData`} before storing.
   */
  setData: (data: Data) => void;

  /**
   * Returns the {@link FXComposer} associated with this clamp.
   */
  getComposer: () => FXComposer;

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
   */
  notify: (
    active: boolean,
    deviation: { x?: number; y?: number; z?: number } | null,
  ) => void;
};

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

    const { setConfig } = initComposer(this);
    setConfig(bounds);
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
 * relative to the parameters at the time it was last restarted.
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

    const { setConfig } = initView(this);
    setConfig({ _config: config, _bounds: bounds });
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
   * By default the clamp will watch each of the composer's elements (that it is
   * animating). Override this by setting the targets here.
   *
   * @defaultValue undefined // the composer's elements
   */
  targets?: Element | Element[];

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

// --------------------

/**
 * @internal
 * @ignore
 */
export const createClampInstance = <T extends string, S, D, C>(
  clamp: FXClamp<T>,
  composer: FXComposer,
  notifyPin: (state: FXState | null) => void,
): FXClampInstance => {
  if (!_.isInstanceOf(clamp, FXClampBase)) {
    throw usageError("Object is not an FXClamp");
  }

  const definitions = registeredTypes.get<T, S, D, C>(clamp.type);
  if (!definitions) {
    throw bugError(`No definitions saved for clamp type '${clamp.type}'`);
  }

  const init = getInitData<C>(clamp);

  const { logic } = definitions;

  let isActive = false; // don't start until the pin resumes us
  let lastChangeWhilePaused: {
    _clampedState: FXState | null;
  } | null = null;

  const storeData: {
    _config: C | null;
    _clampedState: FXState | null;
    _data?: D;
    _state?: S;
    _refState?: S;
  } = {
    _config: init._config,
    _clampedState: null,
  };

  const store: FXClampStore<S, D, C> = {
    getConfig: () => storeData._config,

    getState: () => copyState(storeData._state),
    setState: (state) => {
      storeData._state = copyState(state);
    },
    getReferenceState: () => copyState(storeData._refState),

    getData: () => copyData(storeData._data),
    setData: (data) => {
      storeData._data = copyData(data);
    },

    getComposer: () => composer,

    notify: (active, deviation) => {
      if (init._invert) {
        active = !active;
      }

      let clampedState: FXState | null = null;

      if (active) {
        clampedState = composer.getState();
        if (deviation) {
          for (const a of ["x", "y", "z"] as const) {
            clampedState[a].current -= deviation[a] ?? 0;
          }
        }
      }

      setClampedState(clampedState);
    },
  };

  // ----------

  const setClampedState = (clampedState: FXState | null) => {
    if (isActive) {
      if (_.isNull(storeData._clampedState) !== _.isNull(clampedState)) {
        storeData._clampedState = clampedState;
        notifyPin(clampedState);
      }
      lastChangeWhilePaused = null;
    } else {
      lastChangeWhilePaused = {
        _clampedState: clampedState,
      };
    }
  };

  const setActiveState = (activate: boolean) => {
    if (isActive !== activate) {
      isActive = activate;

      if (isActive && lastChangeWhilePaused) {
        setClampedState(lastChangeWhilePaused._clampedState);
      }

      (isActive ? logic?.resume : logic?.pause)?.call(self, store);
    }
  };

  // --------------------

  const self: FXClampInstance = {
    isActive: () => isActive,
    pause: () => setActiveState(false),
    resume: () => setActiveState(true),
    restart: () => {
      storeData._refState = storeData._state;
      self.resume();
    },
  };

  const copyState = logic.copyState?.bind(self) ?? _.deepCopy;
  const copyData = logic.copyData?.bind(self) ?? ((d) => d);

  // --------------------

  logic.run.call(self, store);
  return self;
};

// ------------------------------

type StartStopWatcher = {
  start: () => void;
  stop: () => void;
};

type BoundedState<Axes extends "x" | "y" | "z"> = {
  _bounds: { [A in Axes]?: BoundedValue };
  _current: { [A in Axes]: number };
  _previous: { [A in Axes]: number };
  _reference: { [A in Axes]: number };
  _low: { [A in Axes]: number };
  _high: { [A in Axes]: number };
  _viewportSize: Size;
  _composerState?: FXState;
};

type BoundedStateViolation = {
  active: boolean;
  deviation: { x: number; y: number; z: number } | null;
};

type FXClampInitData<C> = {
  _invert: boolean;
  _config: C | null;
};

interface RegistrationMap {
  has(type: string): boolean;
  get<T extends string, S, D, C>(
    type: T,
  ): FXClampDefinitions<T, S, D, C> | undefined;
  set<T extends string, S, D, C>(
    type: T,
    definitions: FXClampDefinitions<T, S, D, C>,
  ): this;
}

interface BuilderDataMap {
  get<C>(clamp: FXClamp<string>): FXClampInitData<C> | undefined;
  set<C>(clamp: FXClamp<string>, config: FXClampInitData<C>): this;
}

const registeredTypes: RegistrationMap = new Map();
const allBuilderData = new WeakMap() as BuilderDataMap;

const { init: initComposer } = registerClamp<
  "composer",
  FXState,
  {
    _vpSizeWatch: StartStopWatcher;
    _tweenWatch: StartStopWatcher;
  },
  FXComposerClampBounds
>({
  type: "composer",
  logic: {
    run: (store) => {
      const bounds = store.getConfig() ?? {};
      if (!bounds) {
        throw bugError("No bounds saved for clamp type 'scroll'");
      }

      const vpSizeWatch = watchSize();

      const composer = store.getComposer();

      const tweenHandler: FXComposerHandler = createCallback(() => {
        const refComposerState = store.getReferenceState();

        const composerState = composer.getState();
        store.setState(composerState);

        if (!refComposerState) {
          return;
        }

        const offsets = getComposerOffsets(composerState, refComposerState);

        const boundedState: BoundedState<"x" | "y" | "z"> = _.merge(offsets, {
          _bounds: bounds,
          _viewportSize: vpSizeWatch.get(),
          _composerState: composerState,
        });

        const violation = getClampViolation(boundedState);
        store.notify(violation.active, violation.deviation);
      }, true);

      const tweenWatch = {
        start: () => composer.onTween(tweenHandler),
        stop: () => composer.offTween(tweenHandler),
      } as const;

      store.setData({
        _vpSizeWatch: vpSizeWatch,
        _tweenWatch: tweenWatch,
      });
    },

    pause: (store) => {
      const data = store.getData();
      data?._vpSizeWatch.stop();
      data?._tweenWatch.stop();
    },

    resume: (store) => {
      const data = store.getData();
      data?._vpSizeWatch.start();
      data?._tweenWatch.start();
    },
  },
});

const { init: initView } = registerClamp<
  "view",
  Map<Element, { x: number; y: number }>,
  {
    _viewWatch: StartStopWatcher;
    _vpSizeWatch: StartStopWatcher;
    _rootSizeWatch: StartStopWatcher;
    _afterPaintLooper: StartStopWatcher;
  },
  { _bounds: FXViewClampBounds; _config: FXViewClampConfig | undefined }
>({
  type: "view",
  logic: {
    run: (store) => {
      const { _config: config, _bounds: bounds } = store.getConfig() ?? {};
      if (!bounds) {
        throw bugError("No bounds saved for clamp type 'view'");
      }

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

      const { targets: customTargets, root, aggressiveWatching } = config ?? {};

      const targets = toIterableIfNot(customTargets ?? composer.getElements());

      const vpSizeWatch = watchSize();
      const rootSizeWatch = root ? watchSize(root) : vpSizeWatch;

      const afterPaintLooper = loopOnAfterPaint(() => {
        const prevOffsets = store.getState();
        const refOffsets = store.getReferenceState();
        const offsets = getViewOffsets(
          vpSizeWatch.get(),
          xyToAnchor,
          targets,
          root,
        );
        store.setState(offsets);

        if (!prevOffsets || !refOffsets) {
          return;
        }

        const composerState = composer.getState();
        const vpSize = vpSizeWatch.get();
        const rootSize = rootSizeWatch.get();

        const high = {
          x: rootSize.width,
          y: rootSize.height,
        };

        const violations: BoundedStateViolation[] = [];
        for (const t of targets) {
          const tPrevOffsets = prevOffsets.get(t);
          const tRefOffsets = refOffsets.get(t);
          const tOffsets = offsets.get(t);
          if (!tPrevOffsets || !tRefOffsets || !tOffsets) {
            throw bugError("No offsets saved for view clamp target");
          }

          const boundedState: BoundedState<"x" | "y"> = {
            _bounds: xyBounds,
            _current: tOffsets,
            _previous: tPrevOffsets,
            _reference: tRefOffsets,
            _low: low,
            _high: high,
            _viewportSize: vpSize,
            _composerState: composerState,
          };

          violations.push(getClampViolation(boundedState));
        }

        const violation = getMaxClampViolation(violations);
        store.notify(violation.active, violation.deviation);
      });

      const viewWatch = atLeastOneVisible(
        targets,
        (hasVisible) => {
          (hasVisible ? afterPaintLooper.start : afterPaintLooper.stop)();
        },
        ViewWatcher.reuse({
          root,
          rootMargin: aggressiveWatching ? "500px" : "200px",
        }),
      );

      store.setData({
        _viewWatch: viewWatch,
        _vpSizeWatch: vpSizeWatch,
        _rootSizeWatch: rootSizeWatch,
        _afterPaintLooper: afterPaintLooper,
      });
    },

    pause: (store) => {
      const data = store.getData();
      data?._viewWatch.stop();
      data?._vpSizeWatch.stop();
      data?._rootSizeWatch.stop();
      data?._afterPaintLooper.stop();
    },

    resume: (store) => {
      const data = store.getData();
      data?._viewWatch.start();
      data?._vpSizeWatch.start();
      data?._rootSizeWatch.start();
    },

    copyState: (s) => (s ? _.createMap([...s.entries()]) : void 0),
  },
});

// --------------------

const getInitData = <C>(clamp: FXClamp<string>) => {
  const data = allBuilderData.get<C>(clamp);
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

const getViewOffsets = (
  viewportSize: Size,
  xyToAnchor: { x: "left" | "right"; y: "top" | "bottom" },
  elements: Iterable<Element>,
  root?: Element,
) => {
  const offsets = _.createMap<Element, { x: number; y: number }>();

  for (const element of elements) {
    const rect = _.getBoundingClientRect(element);
    const rootRect = root ? _.getBoundingClientRect(root) : null;
    const tblrOffsets = {
      top: rect.top - (rootRect?.top ?? 0),
      bottom: (rootRect?.bottom ?? viewportSize.height) - rect.bottom,
      left: rect.left - (rootRect?.left ?? 0),
      right: (rootRect?.right ?? viewportSize.width) - rect.right,
    };

    offsets.set(element, {
      x: tblrOffsets[xyToAnchor.x],
      y: tblrOffsets[xyToAnchor.y],
    });
  }

  return offsets;
};

/**
 * Converts the given input raw or relative number as explained in
 * {@link FXComposerClampBounds} or {@link FXViewClampBounds}.
 *
 * @return `null` if it doesn't resolve to a valid number.
 */
const toRawBoundsValue = <Axes extends "x" | "y" | "z">(
  boundedValue: RawOrRelativeNumber | ViewportLength | undefined,
  input: BoundedState<Axes>,
  axis: Axes,
): number | null => {
  const reference = input._reference[axis];
  const low = input._low[axis];
  const high = input._high[axis];
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

  return toRawNum(input, calculator, null);
};

const getClampViolation = <Axes extends "x" | "y" | "z">(
  input: BoundedState<Axes>,
): BoundedStateViolation => {
  const getDeviation = (
    boundedValue: RawOrRelativeNumber | ViewportLength | undefined,
    axis: Axes,
  ) => {
    const raw = toRawBoundsValue(boundedValue, input, axis);
    return _.isNull(raw) ? null : _.round(raw - input._current[axis]);
  };

  const { _composerState: composerState } = input;

  const deviation = { x: 0, y: 0, z: 0 };

  for (const axis in input._bounds) {
    const boundedValue = input._bounds[axis];
    if (_.isPrimitive(boundedValue)) {
      deviation[axis] = getDeviation(boundedValue, axis) ?? 0;
    } else {
      const { min, max } = boundedValue;
      deviation[axis] = getDeviation(min, axis) ?? getDeviation(max, axis) ?? 0;
    }

    if (composerState) {
      const depthScale =
        (composerState[axis].current - composerState[axis].previous) /
        (input._current[axis] - input._previous[axis]);
      deviation[axis] *= depthScale;
    }
  }

  const active = (deviation.x || deviation.y || deviation.z) !== 0;
  return { active, deviation };
};

const getMaxClampViolation = (
  deviations: BoundedStateViolation[],
): BoundedStateViolation => {
  const maxDeviation = { x: 0, y: 0, z: 0 };
  let maxActive = false;

  for (const { active, deviation } of deviations) {
    maxActive ||= active;
    maxDeviation.x = _.max(maxDeviation.x, deviation?.x ?? 0);
    maxDeviation.y = _.max(maxDeviation.y, deviation?.y ?? 0);
    maxDeviation.z = _.max(maxDeviation.z, deviation?.z ?? 0);
  }

  return { active: maxActive, deviation: maxDeviation };
};

_.brandClass(FXClampBase, "FXClampBase");
_.brandClass(FXComposerClamp, "FXComposerClamp");
_.brandClass(FXViewClamp, "FXViewClamp");
