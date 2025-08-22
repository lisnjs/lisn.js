/**
 * @module Effects
 *
 * @since v1.3.0
 */

import * as _ from "@lisn/_internal";

import { usageError, bugError } from "@lisn/globals/errors";

import { toNum, toNumWithBounds, isValidNum } from "@lisn/utils/math";

import { FXComposer } from "@lisn/effects/fx-composer";

/**
 * @interface
 */
export interface EffectInterface<T extends keyof EffectRegistry> {
  /**
   * Unique type for the effect
   */
  type: T;

  /**
   * Returns true if the effect is absolute. If true, the
   * {@link FXHandler | handlers} receive absolute
   * {@link FXParams | parameters} and each call to {@link update} will reset
   * the effect back to the default/blank state.
   *
   * Otherwise, the handlers receive delta values reflecting the change in
   * parameters since the last animation frame and the effect's state is
   * preserved between calls to {@link update}.
   */
  isAbsolute: () => boolean;

  /**
   * Updates the effect as per the given state.
   */
  update: (state: FXState, composer: FXComposer) => this;

  /**
   * Returns a **static copy** of the effect that has the current state/value of
   * this effect, but no handlers.
   *
   * @param negate If given, `negate` will be inverted and used as the base
   *               before adding the current effect's state. Not all effects may
   *               implement this.
   */
  export: (negate?: Effect<T>) => Effect<T>;

  /**
   * Returns a **new live** effect that has all the handlers from this one and
   * from the given effects, added in order. The resulting state/value is the
   * combined product of its current state and that of all the other given ones.
   *
   * Calling this with no arguments essentially clones the effect.
   *
   * **NOTE:** If any of the given effects is
   * {@link Effect.isAbsolute | absolute}, all previous ones are essentially
   * discarded and the resulting effect becomes absolute.
   */
  toComposition: (...others: Effect<T>[]) => Effect<T>;

  /**
   * Returns an object with CSS properties and their values that represent the
   * effect's current state.
   *
   * @param negate See {@link export}.
   */
  toCss: (negate?: Effect<T>) => Record<string, string>;
}

export type Effect<T extends keyof EffectRegistry = keyof EffectRegistry> =
  EffectRegistry[T] & EffectInterface<T>;

export type FXHandler<R> = (
  parameters: FXParams,
  state: FXState,
  composer: FXComposer,
) => R;

/**
 * The parameters for the current animation frame that {@link FXHandler}s should
 * use.
 */
export type FXParams = {
  /**
   * If the effect is {@link Effect.isAbsolute | absolute}, it is the current
   * value for the X-axis. Otherwise it is the change in that value since the
   * last animation frame.
   *
   * Depending on each effect and effect category, it may also be scaled by the
   * parallax depth of the {@link Effects.FXComposer}.
   */
  x: number;

  /**
   * If the effect is {@link Effect.isAbsolute | absolute}, it is the normalized
   * {@link x}: from 0 ({@link FXState.x.min}) to 1 ({@link FXState.x.max})
   * value for this axis. If {@link FXState.x.min} equals {@link FXState.x.max},
   * this will be set to 1.
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
 * The update for an axis (minimum, maximum and target) values.
 */
export type FXAxisStateUpdate = {
  /**
   * The minimum value.
   */
  min?: number;

  /**
   * The maximum value.
   */
  max?: number;

  /**
   * The target value which we're interpolating towards.
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

export type FXStateUpdate = {
  x?: FXAxisStateUpdate;
  y?: FXAxisStateUpdate;
  z?: FXAxisStateUpdate;
};

/**
 * The current state of an axis (X, Y or Z).
 */
export type FXAxisState = {
  /**
   * The minimum value.
   */
  min: number;

  /**
   * The maximum value.
   */
  max: number;

  /**
   * The initial value at which the composer started interpolating (since the
   * last trigger).
   */
  initial: number;

  /**
   * The value at the last animation frame.
   */
  previous: number;

  /**
   * The current value.
   */
  current: number;

  /**
   * The target value which the composer is interpolating towards.
   */
  target: number;

  /**
   * The composer's {@link FXComposerConfig.lag | lag} for this axis.
   */
  lag: number;

  /**
   * The composer's {@link FXComposerConfig.depth | depth} for this axis.
   */
  depth: number;

  /**
   * If true, it means the composer was told to
   * {@link FXAxisStateUpdate.snap | snap} straight to the target value during
   * the last update.
   */
  snap: boolean;
};

/**
 * Describes the whole state of the composer's parameters.
 */
export type FXState = {
  x: FXAxisState;
  y: FXAxisState;
  z: FXAxisState;
};

/**
 * Add to this interface to register a new effect type. The key must match the
 * {@link Effect.type} property.
 *
 * @example
 *
 * ```typescript
 * export class FancyEffect implements EffectInterface<"fancy"> {
 *   readonly type = "fancy";
 *   // ... implement remaining methods from EffectInterface
 * }
 *
 * declare module "lisn.js/effects" {
 *   interface EffectRegistry {
 *     fancy: FancyEffect;
 *   }
 * }
 */
/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
export interface EffectRegistry {}

/**
 * Used to scale a parameter for one of the axis by the respective parallax
 * depth.
 *
 * The function will receive the pre-scaled parameter value (which could be
 * absolute or delta) for this axis and the composer's depth along this axis
 * and should return the final parameter value to use.
 */
export type ParallaxScalerFn = (
  param: number,
  depth: number,
  axis: "x" | "y" | "z",
) => number;

/**
 * Returns the {@link FXParams | parameters} for the given state.
 *
 * @param [options.isAbsolute] If false (default), the parameters will equal the
 *                             change in values since the last animation frame.
 *                             If true, they will equal the current values for
 *                             the axes.
 * @param [options.scalerFn]   If given, the parameters along each axis will be
 *                             scaled by the composer's parallax depth for this
 *                             axis.
 */
export const toParameters = (
  state: FXState,
  composer: FXComposer,
  options?: { isAbsolute?: boolean; scalerFn?: ParallaxScalerFn },
): FXParams => {
  state = getUpdatedState(state, composer); // validate
  const { isAbsolute, scalerFn } = options ?? {};

  const getAxisParam = (axisState: FXAxisState, normalized = false) => {
    const { current, previous, max, min } = axisState;
    let result = isAbsolute ? current : current - previous;
    let maxResult = isAbsolute ? max : max - min;
    let minResult = isAbsolute ? min : min - max;

    if (normalized) {
      maxResult = 1;
      minResult = isAbsolute ? 0 : -1;

      if (max === min) {
        result = 1;
      } else {
        if (isAbsolute) {
          result -= min;
        }

        result /= max - min;
      }
    }

    if (!isValidNum(result) || result < minResult || result > maxResult) {
      // getUpdatedState should have ensured values are in range.
      throw bugError(
        "FX: Calculated invalid value for normalized axis parameter",
      );
    }

    return result;
  };

  const parameters: FXParams = {
    x: getAxisParam(state.x),
    nx: getAxisParam(state.x, true),
    y: getAxisParam(state.y),
    ny: getAxisParam(state.y, true),
    z: getAxisParam(state.z),
    nz: getAxisParam(state.z, true),
  };

  return scalerFn
    ? scaleParameters(parameters, composer, scalerFn)
    : parameters;
};

/**
 * Returns the parameters scaled by the given scaling function using the
 * composer's parallax depths.
 */
export const scaleParameters = (
  parameters: FXParams,
  composer: FXComposer,
  scalerFn: ParallaxScalerFn,
): FXParams => {
  const { depthX, depthY, depthZ } = composer.getConfig();

  return {
    x: scalerFn(parameters.x, depthX, "x"),
    nx: parameters.nx,
    y: scalerFn(parameters.y, depthY, "y"),
    ny: parameters.ny,
    z: scalerFn(parameters.z, depthZ, "z"),
    nz: parameters.nz,
  };
};

/**
 * Returns a new updated state as per the update data if any while enforcing
 * valid values for all properties.
 *
 * **NOTE:** For any axis:
 * - lag and depth are always set from the composer's configuration.
 * - If the input state has snap: true and there is no update given for this
 *   axis (`update` or `update[axis]` is `undefined`), snap is preserved.
 *   Otherwise, if there's an update given for the axis, snap is reset to
 *   `false`, unless the update explicitly sets it to `true`
 */
export const getUpdatedState = (
  state: Partial<FXState> | undefined,
  composer: FXComposer,
  update?: FXStateUpdate,
): FXState => {
  state ??= {};
  update ??= {};

  const composerConfig = composer.getConfig();

  const toBool = (input: unknown) => (_.isBoolean(input) ? input : false);

  const validateAxis = (
    axisState: Partial<FXAxisState> | undefined,
    axis: "x" | "y" | "z",
  ) => {
    const axisC = axis === "x" ? "X" : axis === "y" ? "Y" : "Z";

    axisState ??= {};
    let { min, max } = axisState;
    min = toNum(min, 0);
    max = toNum(max, min > 0 ? min : 0);
    if (min > max) {
      [min, max] = [max, min]; // swap
    }

    const lag = composerConfig[`lag${axisC}`];
    const depth = composerConfig[`depth${axisC}`];
    const filteredState: FXAxisState = {
      // known properties only
      min,
      max,
      lag,
      depth,
      snap: toBool(axisState.snap),
      // updated below
      initial: 0,
      previous: 0,
      current: 0,
      target: 0,
    };

    for (const prop of ["initial", "previous", "current", "target"] as const) {
      filteredState[prop] = toNumWithBounds(axisState[prop], {
        min,
        max,
      });
    }

    return filteredState;
  };

  const updateAxis = (axis: "x" | "y" | "z") => {
    const axisState = validateAxis(state[axis], axis); // validate input state

    const axisUpdate = update[axis] ?? { snap: axisState.snap };
    for (const prop of ["min", "max", "target"] as const) {
      axisState[prop] = toNum(axisUpdate[prop], axisState[prop]);
    }
    axisState.snap = toBool(axisUpdate.snap);

    return validateAxis(axisState, axis); // validate final state
  };

  return {
    x: updateAxis("x"),
    y: updateAxis("y"),
    z: updateAxis("z"),
  };
};

/**
 * @ignore
 * @internal
 */

export const validateOutputParameters = (
  name: string,
  outputs: number[],
  requireNonZero = false,
) => {
  for (const p of outputs) {
    if (!isValidNum(p) || (requireNonZero && _.abs(p) < 1e-10)) {
      throw usageError(
        `${name} must be finite${requireNonZero ? " and non-zero" : ""}`,
      );
    }
  }
};
