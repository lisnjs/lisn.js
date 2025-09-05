/**
 * @module Effects
 *
 * @since v1.3.0
 *
 * @categoryDescription Base
 * These types, classes and functions are to be used by those who want to extend
 * LISN's effect suite by defining own effects, matchers, triggers, etc.
 */

// TODO Reveal Effect:
// - draw: for svg stroke (using svg.getTotalLength, stroke-dasharray)
//   - optionally accept path element or absolute path length to avoid percentages
//   - from 0 to 100: <N>% 110% where N is from 0 to just above 100
//   - from 100 to 0: 0% <N>% 110% where N is from just above 100 to 0
//   - from centre outwards: 0 <50 - N/2>% <N>% 100% where N is from 0 to just above 100
// - ... various clipping masks to reveal entire element
//   - https://jsfiddle.net/z9gjL5o6/

import * as _ from "@lisn/_internal";

import { SemiPartial } from "@lisn/globals/types";

import { bugError, usageError } from "@lisn/globals/errors";

import { logError } from "@lisn/utils/log";
import { toNum } from "@lisn/utils/math";

import {
  EffectUpdater,
  EffectName,
  Effect,
  EffectConfig,
  EffectInstance,
  EffectDefinitions,
  EffectLogic,
  EffectUpdaterEntry,
  ParallaxScalerFn,
  EffectUpdaterReturn,
  EffectUpdaterName,
  FXParams,
  FXAxisState,
  FXState,
  FXStateUpdate,
} from "@lisn/effects/types";
import { FXComposer } from "@lisn/effects/fx-composer";
import { getOrCreatePinInstance, FXPin } from "@lisn/effects/fx-pin";

/**
 * An effect holds a state that can be translated into CSS to be applied on an
 * element. Effects are managed {@link FXComposer}s.
 *
 * There are several built-in effects:
 * - {@link Transform}
 * - {@link Filter}
 *
 * {@link registerEffect} registers a new effect type. It returns an object with
 * an `init` property holding a function.
 *
 * Your effect class should call this `init` function in its constructor,
 * passing it itself (`this`) and an {@link EffectConfig}. `init` will return an
 * object containing the following functions that the effect can use to modify
 * the data that is going to instantiate the effect for the composer.
 * - `addUpdater`:  a function which can push an {@link EffectUpdaterEntry} into
 *                  the effect's data for instantiation
 * - `setUpdaters`: a function which overrides all updaters in the effect's data
 *                  for instantiation
 *
 * Your custom effect class **must** extend {@link EffectBase}.
 *
 * For type check support, you also want to register the effect into the
 * {@link EffectRegistry} mapping.
 *
 * See example below for implementing a basic effect class.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If this effect type has already been registered.
 *
 * @example
 * ```typescript
 * type FancyState = {
 *   data: number[];
 * }
 *
 * const { init } = registerEffect<"fancy", FancyState>({
 *   type: "fancy",
 *   logic: {
 *     processUpdate(state, name, result, tag) {
 *       state.data.push(result);
 *       return state;
 *     },
 *     clone(state) {
 *       return {
 *         data: [...state.data],
 *       }
 *     },
 *     composeWith(state, other) {
 *       return {
 *         data: [...state.data, ...other.data],
 *       }
 *     },
 *     toCss(state) {
 *       return {
 *         fancy: `${state.data.reduce((sum, a) => sum + a, 0)}`;
 *       }
 *     },
 *   },
 *   nullState: {
 *     data: [],
 *   },
 * });
 *
 * export class Fancy extends EffectBase<"fancy"> {
 *   readonly type = "fancy"; // required
 *
 *   readonly fancy: (updater: EffectUpdater<number> | number) => this;
 *
 *   readonly schmancy: (updater: EffectUpdater<number> | number) => this;
 *
 *   constructor(config?: EffectConfig) {
 *     super();
 *
 *     const { addUpdater, setUpdaters } = init(this, config);
 *
 *     this.fancy = (updater) => {
 *       addUpdater({ name: "fancy", updater });
 *       return this;
 *     }
 *
 *     this.schmancy = (updater) => {
 *       setUpdaters([ { name: "schmancy", updater } ]);
 *       return this;
 *     }
 *   }
 * }
 *
 * declare module "lisn.js/effects" {
 *   interface EffectRegistry {
 *     fancy: Fancy;
 *   }
 * }
 *
 * ```
 *
 * @typeParam State The type of state the effect holds.
 *
 * @category Base
 */
export const registerEffect = <const T extends EffectName, State>(
  definitions: EffectDefinitions<T, State>,
) => {
  if (registeredTypes.has(definitions.type)) {
    throw usageError(`Effect type '${definitions.type}' is already registered`);
  }

  registeredTypes.set(definitions.type, definitions);

  return {
    init: (self: Effect<T>, config?: EffectConfig) => {
      const { isAbsolute = false, pin } = config ?? {};

      const init: Required<EffectInitData<T>> = {
        _isAbsolute: isAbsolute,
        _pin: pin,
        _updaters: [],
      };

      allBuilderData.set(self, init);

      return {
        addUpdater: (updater: EffectUpdaterEntry<T>) =>
          addUpdater(self, updater),
        setUpdaters: (updaters: EffectUpdaterEntry<T>[]) =>
          setUpdaters(self, updaters),
      } as const;
    },
  } as const;
};

const EFFECT: unique symbol = _.SYMBOL.for(
  "LISN.js/types/effect",
) as typeof EFFECT;

/**
 * Base effect builder class.
 *
 * @category Base
 */
export abstract class EffectBase<T extends string> {
  /**
   * @ignore
   * @internal
   */
  readonly [EFFECT] = true;

  /**
   * Unique name for the effect type.
   */
  abstract type: T;
}

// --------------------

/**
 * @internal
 * @ignore
 *
 * Returns the {@link FXParams | parameters} for the given composer state.
 */
export const toParameters = (state: FXState, isAbsolute = false): FXParams => {
  state = getUpdatedState(state); // validate

  const getAxisParam = (axisState: FXAxisState, normalized = false) => {
    const { current, previous, low, high } = axisState;
    let result = isAbsolute ? current : current - previous;

    if (normalized) {
      if (low === high) {
        result = 1;
      } else {
        if (isAbsolute) {
          result -= low;
        }

        result /= high - low;
      }
    }

    return result;
  };

  return {
    x: getAxisParam(state.x),
    nx: getAxisParam(state.x, true),
    y: getAxisParam(state.y),
    ny: getAxisParam(state.y, true),
    z: getAxisParam(state.z),
    nz: getAxisParam(state.z, true),
  };
};

/**
 * @internal
 * @ignore
 *
 * Returns the parameters scaled by the given scaling function using the
 * parallax depths in the state.
 */
export const scaleParameters = (
  parameters: FXParams,
  state: FXState,
  scaler: ParallaxScalerFn,
): FXParams => {
  return {
    x: scaler(parameters.x, state.x.depth, "x"),
    nx: parameters.nx,
    y: scaler(parameters.y, state.y.depth, "y"),
    ny: parameters.ny,
    z: scaler(parameters.z, state.z.depth, "z"),
    nz: parameters.nz,
  };
};

/**
 * @internal
 * @ignore
 *
 * Returns a new updated state as per the update data if any while enforcing
 * valid values for all properties.
 *
 * **NOTE:** For any axis:
 * - If the input state has snap: true and there is no update given for this
 *   axis (`update` or `update[axis]` is `undefined`), snap is preserved.
 *   Otherwise, if there's an update given for the axis, snap is reset to
 *   `false`, unless the update explicitly sets it to `true`.
 */
export const getUpdatedState = (
  state: Partial<FXState> | undefined,
  update?: FXStateUpdate,
): FXState => {
  state ??= {};
  update ??= {};

  const toBool = (input: unknown) => (_.isBoolean(input) ? input : false);

  const validateAxis = (
    axisState: Partial<FXAxisState> | undefined,
  ): FXAxisState => {
    axisState ??= {};
    let { low, high } = axisState;
    low = toNum(low, 0);
    high = toNum(high, 0);
    if (low > high) {
      [low, high] = [high, low]; // swap
    }

    const lag = toNum(axisState.lag, 0);
    const depth = toNum(axisState.depth, 1);

    // default initial is low
    // default previous and current are initial
    // default target is current
    const initial = toNum(axisState.initial, low);
    const previous = toNum(axisState.previous, initial);
    const current = toNum(axisState.current, initial);
    const target = toNum(axisState.target, current);

    if (target > high) {
      high = target;
    } else if (target < low) {
      low = target;
    }

    return {
      // known properties only
      low,
      high,
      lag,
      depth,
      snap: toBool(axisState.snap),
      initial: initial,
      previous: previous,
      current: current,
      target: target,
    };
  };

  const updateAxis = (axis: "x" | "y" | "z") => {
    const axisState = validateAxis(state[axis]); // validate input state

    const axisUpdate = update[axis] ?? axisState;
    for (const prop of ["low", "high", "target"] as const) {
      axisState[prop] = toNum(axisUpdate[prop], axisState[prop]);
    }
    axisState.snap = toBool(axisUpdate.snap);

    return validateAxis(axisState); // validate final state
  };

  return {
    x: updateAxis("x"),
    y: updateAxis("y"),
    z: updateAxis("z"),
  };
};

/**
 * @internal
 * @ignore
 */
export const createEffectInstance = <T extends EffectName>(
  effect: Effect<T>,
  composer: FXComposer,
): EffectInstance<T> => {
  if (!_.isInstanceOf(effect, EffectBase)) {
    throw usageError("Object is not an Effect");
  }

  const definitions = registeredTypes.get(effect.type);
  if (!definitions) {
    throw bugError(`No definitions saved for effect type '${effect.type}'`);
  }

  const init = getInitData(effect);

  return _createEffectInstance(
    definitions,
    _.merge(init, { _composer: composer }),
  );
};

// ------------------------------

type EffectUpdaterFnEntry<
  T extends EffectName,
  M extends EffectUpdaterName<T> = EffectUpdaterName<T>,
> = {
  name: M;
  updater: EffectUpdater<EffectUpdaterReturn<T, M>>;
  scaler?: ParallaxScalerFn | null;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  tag?: any;
};

type EffectInitData<T extends EffectName> = {
  _isAbsolute: boolean;
  _pin: FXPin | undefined;
  _updaters: EffectUpdaterEntry<T>[];
};

type EffectInstanceData<T extends EffectName, S> = {
  _isAbsolute: boolean;
  _pin: FXPin | undefined;
  _updaters: EffectUpdaterFnEntry<T>[];
  _state: S;
  _composer: FXComposer;
};

interface RegistrationMap {
  has(type: EffectName): boolean;
  get<T extends EffectName, S>(type: T): EffectDefinitions<T, S> | undefined;
  set<T extends EffectName, S>(
    type: T,
    definitions: EffectDefinitions<T, S>,
  ): this;
}

interface BuilderDataMap {
  get<T extends EffectName>(effect: Effect<T>): EffectInitData<T> | undefined;
  set<T extends EffectName>(effect: Effect<T>, data: EffectInitData<T>): this;
}

interface InstanceDataMap {
  get<T extends EffectName, S>(
    effectInstance: EffectInstance<T>,
  ): EffectInstanceData<T, S> | undefined;
  set<T extends EffectName, S>(
    effectInstance: EffectInstance<T>,
    data: EffectInstanceData<T, S>,
  ): this;
}

const registeredTypes: RegistrationMap = new Map();
const allBuilderData = new WeakMap() as BuilderDataMap;
const allInstanceData = new WeakMap() as InstanceDataMap;

// ------------------------------

const getInitData = <T extends EffectName>(effect: Effect<T>) => {
  const data = allBuilderData.get(effect);
  if (!data) {
    throw bugError(`No init data saved for effect '${effect.type}'`);
  }
  return data;
};

const setUpdaters = <T extends EffectName>(
  effect: Effect<T>,
  updaters: EffectUpdaterEntry<T>[],
) => {
  const data = getInitData(effect);
  data._updaters = updaters;
};

const addUpdater = <T extends EffectName>(
  effect: Effect<T>,
  updater: EffectUpdaterEntry<T>,
) => {
  const data = getInitData(effect);
  data._updaters.push(updater);
};

const _createEffectInstance = <T extends EffectName, S>(
  definitions: {
    type: T;
    logic: EffectLogic<T, S>;
    nullState: S;
  },
  init: SemiPartial<EffectInitData<T> & EffectInstanceData<T, S>, "_state">,
): EffectInstance<T> => {
  const update = () => {
    const clampedState = pinInstance?.getClampedState() ?? composer.getState();

    if (isAbsolute) {
      // reset state
      data._state = cloneState(nullState);
    }

    const parameters = toParameters(clampedState, isAbsolute);

    for (const entry of data._updaters) {
      const { name, updater, scaler, tag } = entry;
      const scaledParameters = scaler
        ? scaleParameters(parameters, clampedState, scaler)
        : parameters;

      const result = updater(scaledParameters, clampedState);

      if (!_.isUndefined(result)) {
        processUpdate(data._state, name, result, tag);
      }
    }
  };

  // -----

  const clone = (instanceData = data, discardUpdaters = false) => {
    return _createEffectInstance(
      definitions,
      discardUpdaters
        ? _.merge(instanceData, {
            _updaters: [],
          })
        : instanceData,
    );
  };

  // -----

  const toComposition = (...others: EffectInstance<T>[]): EffectInstance<T> => {
    let toCompose: EffectInstance<T>[] = [];

    for (const e of [self, ...others]) {
      if (e.isAbsolute()) {
        toCompose = [];
      }

      toCompose.push(e);
    }

    let resultIsAbsolute = false;
    let resultState: S | null = null;
    const resultUpdaters: EffectUpdaterFnEntry<T>[] = [];

    for (const effectI of toCompose) {
      const thisData: EffectInstanceData<T, S> | undefined =
        effectI === self ? data : allInstanceData.get(effectI);

      if (!thisData) {
        logError(bugError("No instance data saved for effect instance"));
        return clone();
      }

      if (thisData) {
        resultIsAbsolute ||= thisData._isAbsolute;
        resultState = resultState
          ? composeStateWith(resultState, thisData._state)
          : thisData._state;
        resultUpdaters.push(...thisData._updaters);
      }
    }

    if (!resultState) {
      logError(bugError("No state for effect composition"));
      return clone();
    }

    return clone({
      _isAbsolute: resultIsAbsolute,
      _pin: void 0,
      _state: resultState,
      _updaters: resultUpdaters,
      _composer: composer,
    });
  };

  // --------------------

  const { type, logic } = definitions;
  const self: EffectInstance<T> = {
    type: type,
    isAbsolute: () => isAbsolute,
    getPin: () => init._pin,
    update,
    clone: (discardUpdaters) => clone(data, discardUpdaters),
    toComposition,
    toCss: () => {
      const negatedEffectI: EffectInstance<T> | undefined = negated
        ?.getComposition()
        .get(type);

      const negatedState: S | undefined = negatedEffectI
        ? allInstanceData.get<T, S>(negatedEffectI)?._state
        : void 0;

      return stateToCss(data._state, negatedState);
    },
  };

  const processUpdate = _.bind(logic.processUpdate, self);
  const cloneState = _.bind(logic.clone, self);
  const composeStateWith = _.bind(logic.composeWith, self);
  const stateToCss = _.bind(logic.toCss, self);

  // ----------

  const { _isAbsolute: isAbsolute = false, _composer: composer } = init;
  const negated = composer.getConfig().negated;
  const nullState = cloneState(definitions.nullState);

  const pinInstance = init._pin
    ? getOrCreatePinInstance(init._pin, composer)
    : void 0;

  const data: EffectInstanceData<T, S> = {
    _isAbsolute: isAbsolute,
    _pin: init._pin,
    _state: cloneState(init._state ?? nullState),
    _updaters: [],
    _composer: composer,
  };
  allInstanceData.set(self, data);

  // ----------

  for (const entry of init._updaters ?? []) {
    if (_.isFunction(entry.updater)) {
      data._updaters.push(entry);
    } else {
      // TODO why is updater inferred to here as never
      const v: EffectUpdaterReturn<T, typeof entry.name> = entry.updater;
      processUpdate(data._state, entry.name, v, entry.tag);
    }
  }

  return self;
};

_.brandClass(EffectBase, "EffectBase");
