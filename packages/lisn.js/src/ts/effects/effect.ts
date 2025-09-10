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

import { SemiPartial, NotFunction } from "@lisn/globals/types";

import { bugError, usageError } from "@lisn/globals/errors";

import { logError } from "@lisn/utils/log";

import type { FXComposer, FXState } from "@lisn/effects/fx-composer";
import type { FXPin } from "@lisn/effects/fx-pin";

import {
  setInstanceCreator,
  createPinInstance,
  toParameters,
  scaleParameters,
} from "@lisn/effects/_internal";

import debug from "@lisn/debug/debug";
import { LoggerInterface } from "@lisn/debug/types";

/**
 * An effect updater function should return a value specific to each effect type
 * and sub-type (e.g. translate sub-type part of transform).
 *
 * Returning `undefined` should leave the current value unchanged.
 */
export type EffectUpdater<R extends NotFunction<unknown>> = (
  parameters: EffectParams,
  state: FXState,
) => R | undefined;

export type EffectConfig = {
  /**
   * If true, the {@link EffectUpdater | updaters} receive absolute
   * {@link EffectParams | parameters} and each call to update the method will
   * reset the effect back to a blank state (**not** to the initial state at the
   * time of creation).
   *
   * Otherwise, the updaters receive delta values reflecting the change in
   * parameters since the last animation frame and the effect's state is
   * preserved between updates.
   *
   * If not specified, the default value is true if the effect has no
   * {@link pin}, and false if it does have a {@link pin} set.
   *
   * @defaultValue undefined // true if the effect has no {@link pin}, false
   * otherwise
   */
  isAbsolute?: boolean;

  /**
   * Set a pin for this effect.
   */
  pin?: FXPin;
};

export type EffectName = {
  [T in keyof EffectRegistry]: EffectRegistry[T] extends EffectBase<T>
    ? T
    : never;
}[keyof EffectRegistry];

export type Effect<T extends EffectName = EffectName> = EffectRegistry[T] &
  EffectBase<T>;

export type EffectInstance<T extends EffectName = EffectName> = {
  [K in T]: EffectInstanceInterface<K>;
}[T];

/**
 * Add to this interface to register a new effect type, for type check support.
 * The key must match the type passed as the definitions to
 * {@link createEffectType}.
 *
 * @example
 * ```typescript
 * declare module "lisn.js/effects" {
 *   interface EffectRegistry {
 *     fancy: FancyEffect;
 *   }
 * }
 * ```
 *
 * @category Base
 */
/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
export interface EffectRegistry {}

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
      const { pin, isAbsolute = !pin } = config ?? {};

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

/**
 * @category Base
 */
export interface EffectInstanceInterface<T extends string> {
  /**
   * Unique type for the effect. Must correspond to the type of the
   * {@link Effect} that created the effect.
   */
  readonly type: T;

  /**
   * Returns true if the effect is absolute. See
   * {@link Effects.EffectConfig.isAbsolute | EffectConfig.isAbsolute}.
   */
  isAbsolute: () => boolean;

  /**
   * Pauses the pin for this effect if any.
   */
  pausePin: () => void;

  /**
   * Resumes the pin for this effect if any.
   */
  resumePin: () => void;

  /**
   * Triggers an update of the effect as per the composer's state.
   */
  update: () => void;

  /**
   * Returns a copy of the effect that has the same state as the
   * current state of the effect.
   *
   * @param discardUpdaters If false (default) the copy has all the
   *                        {@link EffectUpdater | updaters} from this effect.
   *                        If true, updaters are discarded, so the copy is
   *                        initially static, but new updaters can be added.
   */
  clone: (discardUpdaters?: boolean) => EffectInstanceInterface<T>;

  /**
   * Returns a **new live** effect that has all the updaters from this one and
   * from the given effects, added in order. The resulting state/value is the
   * combined product of its current state and that of all the other given ones.
   *
   * **NOTE:** If any of the given effects is {@link isAbsolute | absolute}, all
   * previous ones (prior to the last absolute effect in the series) are
   * discarded and the resulting effect becomes absolute. This is because
   * absolute effects reset their state on each update.
   */
  toComposition: (
    other: EffectInstanceInterface<T>,
    ...others: EffectInstanceInterface<T>[]
  ) => EffectInstanceInterface<T>;

  /**
   * Returns an object with CSS properties and their values that represent the
   * effect's current state. If the composer
   * {@link Effects.FXComposerConfig.negateParent | negates its parent}, the
   * returned CSS will reflect this.
   */
  toCss: () => Record<string, string>;
}

/**
 * Defines a new effect type.
 *
 * @category Base
 */
export type EffectDefinitions<T extends EffectName, S> = {
  /**
   * Unique name for the effect type.
   */
  type: T;

  /**
   * See {@link EffectLogic}.
   */
  logic: EffectLogic<T, S>;

  /**
   * Sets the default blank state. The state is cloned according to
   * {@link EffectLogic.clone} when a fresh one is needed.
   */
  nullState: S;
};

/**
 * These methods define how effects update themselves and compose with other
 * effects of the same type.
 *
 * Each method is passed the current effect's state. The initial state is set in
 * {@link EffectDefinitions.nullState}.
 *
 * Inside each method, the current effect instance which the logic operates can
 * be accessed as the `this` value (as long as the logic method is not an arrow
 * function).
 *
 * @category Base
 */
export type EffectLogic<T extends EffectName, S> = {
  /**
   * It is called whenever the effect instance is updated, once for each updater
   * function that has been added, with the type of the updater (e.g. "translate")
   * and the return value of the updater.
   *
   * If the updater function returns `undefined`, `processUpdate` is not called.
   *
   * It is fine to mutate the state object, but in any case, it should return
   * the state object to be saved (which can be the same object that is passed
   * to the function).
   */
  processUpdate: <M extends EffectUpdaterName<T>>(
    state: S,
    name: M,
    result: Exclude<EffectUpdaterReturn<T, M>, undefined>,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    tag: any,
  ) => S;

  /**
   * Must return a **new** state that is identical to the given state.
   */
  clone: (state: S) => S;

  /**
   * Must return a **new** state that's the combined one for the two given
   * states.
   */
  composeWith: (state: S, other: S) => S;

  /**
   * Must return an object with CSS properties as keys and string values for
   * each property.
   *
   * @param negate If given, and if the effect supports negation (relevant for
   *               transforms), it should return the CSS that "cancels out" the
   *               given state to be negated, so that the current effect's state
   *               is absolute.
   */
  toCss: (state: S, negate?: S) => Record<string, string>;
};

/**
 * The return value that an {@link EffectUpdater | updater} function should
 * return for a given type (e.g. "translate"), which is the name of the method
 * in the effect builder class that accepts this updater function.
 *
 * For example it resolve to `{x?: number, y?: number: z?: number}` for the
 * {@link Effects.Transform | transform}'s translate method.
 *
 * @category Base
 */
export type EffectUpdaterReturn<
  T extends EffectName,
  M extends keyof Effect<T> & string,
> = Effect<T>[M] extends (...args: infer A) => Effect<T>
  ? A extends [EffectUpdater<infer R> | infer R__ignored]
    ? A extends [EffectUpdater<R> | R] // enforce updater return and the non-updater value to be of same type
      ? R
      : never
    : never
  : never;

/**
 * A union of all method names in the effect builder class that accept an
 * {@link EffectUpdater | updater} function or its return value directly.
 *
 * For example it resolves to "rotate" | "scale" | "skew" | "translate" for the
 * {@link Effects.Transform | transform}.
 *
 * @category Base
 */
export type EffectUpdaterName<T extends EffectName> = {
  [M in keyof Effect<T> & string]: Effect<T>[M] extends (
    ...args: infer A
  ) => Effect<T>
    ? A extends [EffectUpdater<infer R> | infer R__ignored]
      ? A extends [EffectUpdater<R> | R] // enforce updater return and the non-updater value to be of same type
        ? M
        : never
      : never
    : never;
}[keyof Effect<T> & string];

/**
 * An object describing an updater function (which are called on
 * {@link EffectInstanceInterface.update | update}) or an updater return value
 * (used for initialization) that the user has added.
 *
 * It should contain the following keys:
 * - name: The name of the method. It should correspond to the name of the
 *   method, e.g. "translate", "rotate", etc.
 * - updater: An updater method or a value consistent with the return type of
 *   such a method that's been passed by the user by calling the updater method,
 *   e.g. {@link Effects.Transform.translate | Transform.translate}.
 * - scaler (optional): The {@link ParallaxScalerFn | parallax scaler} if
 *   given, will be used to scale the {@link EffectParams | parameters} by the
 *   composer's parallax depth before passing them to the updater method on
 *   {@link EffectInstanceInterface.update | update}. You can omit this if
 *   this updater method doesn't use parallax depth or if `updater` is already
 *   a resolved value to initialize.
 * - tag (optional): Arbitrary value that you want passed to
 *   {@link EffectLogic.processUpdate | your logic's `processUpdate`} to
 *   identify this entry if needed.
 *
 * @example
 * If a user created a {@link Effects.Transform | Transform} like so:
 *
 * ```javascript
 * const t = new Transform();
 *
 * t.translate({ x: 50 }); // set initial translation
 *
 * t.translate( // translate on update
 *   (params) => ({ return { x: params.x, y: params.y } })
 * )
 *
 * t.rotate( // rotate on update
 *   (params) => ({ deg: params.z })
 * );
 * ```
 *
 * Then the transform builder class would add the following updater entries
 * (using the `addUpdater` or `setUpdaters` it received during registration):
 *
 * ```javascript
 * setUpdaters([
 *   {
 *     name: "translate",
 *     updater: { x: 50 },
 *   },
 *   {
 *     name: "translate",
 *     updater: (params) => ({ return { x: params.x, y: params.y } }),
 *     scaler: (param, depth) => param / depth
 *   },
 *   {
 *     name: "rotate",
 *     updater: (params) => ({ deg: params.z }),
 *   },
 * ])
 * ```
 *
 * @category Base
 */
export type EffectUpdaterEntry<
  T extends EffectName,
  M extends EffectUpdaterName<T> = EffectUpdaterName<T>,
> = {
  name: M;
  updater: EffectUpdater<EffectUpdaterReturn<T, M>> | EffectUpdaterReturn<T, M>;
  scaler?: ParallaxScalerFn | null;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  tag?: any;
};

/**
 * Used to scale a parameter for one of the axis by the respective parallax
 * depth.
 *
 * The function will receive the pre-scaled parameter value (which would be
 * absolute if the effect is absolute, or they would be delta values otherwise)
 * for this axis, as well as the composer's depth along this axis and should
 * return the final parameter value to use.
 *
 * @category Base
 */
export type ParallaxScalerFn = (
  param: number,
  depth: number,
  axis: "x" | "y" | "z",
) => number;

/**
 * The parameters for the current animation frame that
 * {@link Effects.EffectUpdater}s should use.
 *
 * @category Composer
 */
export type EffectParams = {
  /**
   * If the effect is {@link EffectConfig.isAbsolute | absolute}, it is the
   * current value for the X-axis. Otherwise it is the change in that value
   * since the last animation frame.
   *
   * Depending on each effect and effect category, it may also be scaled by the
   * parallax depth of the {@link Effects.FXComposer}.
   */
  x: number;

  /**
   * If the effect is {@link EffectConfig.isAbsolute | absolute}, it is the
   * normalized {@link x} relative to the difference between
   * {@link FXAxisState.low | low} (`nx = 0`) and {@link FXAxisState.high | high}
   * (`nx = 1`). It may be below 0 or above 1 since {@link FXAxisState.low | low}
   * and {@link FXAxisState.high | high} are only reference values used for
   * computing this normalized parameter, and not strictly enforced.
   *
   * If {@link FXAxisState.low | low} equals {@link FXAxisState.high | high},
   * this will always be set to 1.
   *
   * If the effect is not absolute, it is the change in the absolute normalized
   * value since the last animation frame.
   *
   * It is always independent of parallax depth.
   */
  nx: number;

  /**
   * Like {@link x} but for the Y-axis.
   */
  y: number;

  /**
   * Like {@link nx} but for the Y-axis.
   */
  ny: number;

  /**
   * Like {@link x} but for the Z-axis.
   */
  z: number;

  /**
   * Like {@link nx} but for the Z-axis.
   */
  nz: number;
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
  /* istanbul ignore next */
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

const createEffectInstance = <T extends EffectName>(
  effect: Effect<T>,
  composer: FXComposer,
  requestRecompose: (realtime?: boolean) => void,
  logger?: LoggerInterface,
): EffectInstance<T> => {
  /* istanbul ignore next */
  if (!_.isInstanceOf(effect, EffectBase)) {
    throw usageError("Object is not an Effect");
  }

  const definitions = registeredTypes.get(effect.type);
  /* istanbul ignore next */
  if (!definitions) {
    throw bugError(`No definitions saved for effect type '${effect.type}'`);
  }

  const init = getInitData(effect);

  return _createEffectInstance(
    definitions,
    _.merge(init, { _composer: composer }),
    requestRecompose,
    logger,
  );
};

const _createEffectInstance = <T extends EffectName, S>(
  definitions: {
    type: T;
    logic: EffectLogic<T, S>;
    nullState: S;
  },
  init: SemiPartial<EffectInitData<T> & EffectInstanceData<T, S>, "_state">,
  requestRecompose: (realtime?: boolean) => void,
  parentLogger: LoggerInterface | undefined,
): EffectInstance<T> => {
  const update = (clampedState?: FXState) => {
    if (!clampedState && pinInstance?.isActive()) {
      logger?.debug10("Pinned, skipping update");
      return;
    }

    const state = clampedState ?? composer.getState();

    if (isAbsolute) {
      // reset state
      data._state = cloneState(nullState);
    }

    const parameters = toParameters(state, isAbsolute);
    logger?.debug10("Updating", state, parameters);

    for (const entry of data._updaters) {
      const { name, updater, scaler, tag } = entry;
      const scaledParameters = scaler
        ? scaleParameters(parameters, state, scaler)
        : parameters;

      const result = updater(scaledParameters, state);

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
      requestRecompose,
      parentLogger,
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
    pausePin: () => pinInstance?.pause(),
    resumePin: () => pinInstance?.resume(),
    update: () => update(),
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

  const logger = debug
    ? debug.Logger.getLoggerFor(self, {
        name: `Effect-${type}`,
        parent: parentLogger,
      })
    : void 0;

  const processUpdate = _.bind(logic.processUpdate, self);
  const cloneState = _.bind(logic.clone, self);
  const composeStateWith = _.bind(logic.composeWith, self);
  const stateToCss = _.bind(logic.toCss, self);

  // ----------

  const { _isAbsolute: isAbsolute = false, _composer: composer } = init;
  const negated = composer.getConfig().negated;
  const nullState = cloneState(definitions.nullState);

  const pinInstance = init._pin
    ? createPinInstance(
        init._pin,
        composer,
        (clampedState, realtime) => {
          update(clampedState);
          requestRecompose(realtime);
        },
        logger,
      )
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

// --------------------

setInstanceCreator("effect", createEffectInstance);

_.brandClass(EffectBase, "EffectBase");
