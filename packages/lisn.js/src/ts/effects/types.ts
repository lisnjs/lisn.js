/**
 * @module Effects
 *
 * @since v1.3.0
 */

import { NotFunction } from "@lisn/globals/types";

import type { EffectBase } from "@lisn/effects/effect";
import type { FXPin } from "@lisn/effects/fx-pin";

// XXX rename these to make it clear that FXParams is specific to Effect and
// FX*State* to a composer
// and move into effect and composer

// ------------------------------- EFFECTS --------------------------------

export type EffectConfig = {
  /**
   * If true, the {@link EffectUpdater | updaters} receive absolute
   * {@link FXParams | parameters} and each call to update the method will reset
   * the effect back to a blank state (**not** to the initial state at the time
   * of creation).
   *
   * Otherwise, the updaters receive delta values reflecting the change in
   * parameters since the last animation frame and the effect's state is
   * preserved between updates.
   *
   * @defaultValue false
   */
  isAbsolute?: boolean;

  /**
   * Set a pin for this effect.
   */
  pin?: FXPin;
};

/**
 * An effect updater function should return a value specific to each effect type
 * and sub-type (e.g. translate sub-type part of transform).
 *
 * Returning `undefined` should leave the current value unchanged.
 */
export type EffectUpdater<R extends NotFunction<unknown>> = (
  parameters: FXParams,
  state: FXState,
) => R | undefined;

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

// -----

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
 * @category Base
 */
export interface EffectInstanceInterface<T extends string> {
  /**
   * Unique type for the effect. Must correspond to the type of the
   * {@link Effect} that created the effect.
   */
  readonly type: T;

  /**
   * Returns true if the effect is absolute. See {@link EffectConfig.isAbsolute}.
   */
  isAbsolute: () => boolean;

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
 * The current effect instance which the logic operates can be accessed as the
 * `this` value (as long as the logic method is not an arrow function).
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
 *   given, will be used to scale the {@link FXParams | parameters} by the
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

// ------------------------------- COMPOSER -------------------------------

/**
 * The parameters for the current animation frame that
 * {@link Effects.EffectUpdater}s should use.
 *
 * @category Composer
 */
export type FXParams = {
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

/**
 * The update for an axis (low, high and target) values.
 *
 * @category Composer
 */
export type FXAxisStateUpdate = {
  /**
   * The new low value. If it is greater than {@link high}, they are swapped.
   */
  low?: number;

  /**
   * The new high value. If it is less than {@link low}, they are swapped.
   */
  high?: number;

  /**
   * The new target value which we're interpolating towards.
   *
   * If it exceeds the current {@link FXAxisState.high} value, the high will be
   * updated to this target value.
   *
   * If it is below the current {@link FXAxisState.low} value, the low will be
   * updated to this target value.
   */
  target?: number;

  /**
   * If set to true, it tells the composer not to tween, but instead jump
   * straight to the target value.
   *
   * This gets defaulted back to false during each update unless you explicitly
   * set it to `true`.
   */
  snap?: boolean;
};

/**
 * @category Composer
 */
export type FXStateUpdate = {
  x?: FXAxisStateUpdate;
  y?: FXAxisStateUpdate;
  z?: FXAxisStateUpdate;
};

/**
 * The current state of an axis (X, Y or Z).
 *
 * @category Composer
 */
export type FXAxisState = {
  /**
   * The low value. Used for computing {@link FXParams.nx | normalized}
   * parameters.
   *
   * Initial value is 0.
   */
  low: number;

  /**
   * The high value. Used for computing {@link FXParams.nx | normalized}
   * parameters.
   *
   * Initial value is 0.
   */
  high: number;

  /**
   * The initial value at which the composer started interpolating (since the
   * last trigger).
   *
   * Initial value is 0.
   */
  initial: number;

  /**
   * The value at the last animation frame.
   *
   * Initial value is 0.
   */
  previous: number;

  /**
   * The current value.
   *
   * Initial value is 0.
   */
  current: number;

  /**
   * The target value which the composer is interpolating towards.
   *
   * Initial value is 0.
   */
  target: number;

  /**
   * The composer's {@link Effects.FXComposerConfig.lag | lag} for this axis.
   */
  lag: number;

  /**
   * The composer's {@link Effects.FXComposerConfig.depth | depth} for this
   * axis.
   */
  depth: number;

  /**
   * If true, it means the composer was told to
   * {@link FXAxisStateUpdate.snap | snap} straight to the target value during
   * the last update.
   *
   * Initial value is `false`.
   */
  snap: boolean;
};

/**
 * Describes the whole state of the composer's parameters.
 *
 * @category Composer
 */
export type FXState = {
  x: FXAxisState;
  y: FXAxisState;
  z: FXAxisState;
};
