/**
 * @module Effects/Effect
 *
 * @since v1.3.0
 */

import { FXController } from "@lisn/effects/fx-controller";

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
   * {@link FXTweenState | parameters} and each call to {@link apply} will
   * reset the effect back to the default/blank state.
   *
   * Otherwise, the handlers receive delta values reflecting the change in
   * parameters since the last animation frame and the effect's state is
   * preserved between calls to {@link apply}.
   */
  isAbsolute: () => boolean;

  /**
   * Applies all added effects for the given state.
   */
  apply: (state: FXState, controller: FXController) => Effect<T>;

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
   * the given effects, in order. The resulting state/value is the combined
   * product of its current state and that of all the other given ones.
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

export type Effect<T extends keyof EffectRegistry> = EffectRegistry[T] &
  EffectInterface<T>;

export type EffectsList<TL extends readonly (keyof EffectRegistry)[]> = [
  ...{
    [T in keyof TL]: Effect<TL[T]>;
  },
];

export type FXHandler<R> = (
  parameters: FXTweenState,
  state: FXState,
  controller: FXController,
) => R;

/**
 * The parameters for the current animation frame that {@link FXHandler}s should
 * use.
 *
 * If the effect is {@link Effect.isAbsolute | absolute} they will be based on
 * the current values of the {@link FXAxisState}s. Otherwise they will
 * be based on the change in those values since the previous animation frame.
 *
 * Depending on each effect and effect category, these values may also be scaled
 * by the parallax depth of the {@link Effects/FXController.FXController}.
 */
export type FXTweenState = {
  /**
   * The current value, or the change in current value, for the X-axis.
   */
  x: number;

  /**
   * The normalized {@link x}: from 0 ({@link FXAxisState.min | minimum})
   * to 1 ({@link FXAxisState.max | maximum}) value for this axis. It is
   * always independent of parallax depth.
   */
  nx: number;

  /**
   * The current value, or the change in current value, for the Y-axis.
   */
  y: number;

  /**
   * The normalized {@link y}: from 0 ({@link FXAxisState.min | minimum})
   * to 1 ({@link FXAxisState.max | maximum}) value for this axis. It is
   * always independent of parallax depth.
   */
  ny: number;

  /**
   * The current value, or the change in current value, for the Z-axis.
   */
  z: number;

  /**
   * The normalized {@link z}: from 0 ({@link FXAxisState.min | minimum})
   * to 1 ({@link FXAxisState.max | maximum}) value for this axis. It is
   * always independent of parallax depth.
   */
  nz: number;
};

/**
 * The "calibration" of an axis (minimum, maximum and target) values.
 */
export type FXAxisCalibration = {
  /**
   * The minimum value.
   */
  min: number;

  /**
   * The maximum value.
   */
  max: number;

  /**
   * The target value which we're interpolating towards.
   */
  target: number;
};

export type FXCalibration = {
  x: FXAxisCalibration;
  y: FXAxisCalibration;
  z: FXAxisCalibration;
};

/**
 * The current state of an axis (X, Y or Z).
 */
export type FXAxisState = FXAxisCalibration & {
  /**
   * The value at the last animation frame.
   */
  previous: number;

  /**
   * The current value.
   */
  current: number;
};

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
 * declare module "@lisn/effects/effect" {
 *   interface EffectRegistry {
 *     transform: Transform;
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
 * absolute or delta) for this axis and the controller's depth along this axis
 * and should return the final parameter value to use.
 */
export type ParallaxScalerFn = (
  param: number,
  depth: number,
  axis: "x" | "y" | "z",
) => number;

/**
 * Returns the {@link FXTweenState | parameters} for the given state.
 *
 * @param [options.isAbsolute] If false (default), the parameters will equal the
 *                             change in values since the last animation frame.
 *                             If true, they will equal the current values for
 *                             the axes.
 * @param [options.scalerFn]   If given, the parameters along each axis will be
 *                             scaled by the controller's parallax depth for
 *                             this axis.
 */
export const getParameters = (
  state: FXState,
  controller: FXController,
  options?: { isAbsolute?: boolean; scalerFn?: ParallaxScalerFn },
) => {
  const { isAbsolute, scalerFn } = options ?? {};

  const getAxisParam = (axisState: FXAxisState, normalized = false) => {
    const { current, previous, max, min } = axisState;
    let result = isAbsolute ? current : current - previous;

    if (normalized) {
      if (isAbsolute) {
        result -= min;
      }

      result /= max - min;
    }

    return result;
  };

  const parameters: FXTweenState = {
    x: getAxisParam(state.x),
    nx: getAxisParam(state.x, true),
    y: getAxisParam(state.y),
    ny: getAxisParam(state.y, true),
    z: getAxisParam(state.z),
    nz: getAxisParam(state.z, true),
  };

  return scalerFn
    ? scaleParameters(parameters, controller, scalerFn)
    : parameters;
};

/**
 * Returns the parameters scaled by the given scaling function using the
 * controller's parallax depths.
 */
export const scaleParameters = (
  parameters: FXTweenState,
  controller: FXController,
  scalerFn: ParallaxScalerFn,
) => {
  const { depthX, depthY, depthZ } = controller.getConfig();

  return {
    x: scalerFn(parameters.x, depthX, "x"),
    nx: parameters.nx,
    y: scalerFn(parameters.y, depthY, "y"),
    ny: parameters.ny,
    z: scalerFn(parameters.z, depthZ, "z"),
    nz: parameters.nz,
  };
};
