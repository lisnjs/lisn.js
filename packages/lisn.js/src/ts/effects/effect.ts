/**
 * @module Effects/Effect
 *
 * @since v1.3.0
 */

/**
 * @interface
 */
export interface EffectInterface<T extends keyof EffectRegistry> {
  /**
   * Unique type for the transform
   */
  type: T;

  /**
   * Returns true if the effect is absolute. If true, its handlers receive
   * absolute offsets instead of delta values and applying the effect discards
   * all previous ones of its type.
   */
  isAbsolute: () => boolean;

  /**
   * Applies all added effects for the given scroll offsets.
   */
  apply: (offsets: ScrollOffsets) => Effect<T>;

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
   * {@link TransformConfig.isAbsolute | absolute}, all previous ones are
   * essentially discarded and the resulting effect becomes absolute.
   */
  toComposition: (...others: Effect<T>[]) => Effect<T>;

  /**
   * Returns an object with CSS properties and their values that represent the
   * effect.
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

export type EffectHandler<R> = (offsets: ScrollOffsets) => R;

/**
 * The scroll offsets for the current animation frame, being smoothly
 * interpolated towards the target ones.
 *
 * @category Effects
 */
export type ScrollOffsets = {
  /**
   * Indicates whether the values are absolute (actual offsets) or incremental
   * (delta values since last frame). They would be incremental if this is
   * being passed to an {@link EffectHandler} for an {@link Effect} that's not
   * {@link Effect.isAbsolute | absolute}.
   */
  isAbsolute: boolean;

  /**
   * The {@link Effects/FXController.FXControllerConfig.depthX | controller's horizontal depth}
   * that has scaled the x offsets. {@link x} is the actual element's scroll
   * left offset divided by this depth.
   */
  depthX: number;

  /**
   * The {@link Effects/FXController.FXControllerConfig.depthY | controller's vertical depth}
   * that has scaled the y offsets. {@link y} is the actual element's scroll
   * top offset divided by this depth.
   */
  depthY: number;

  /**
   * If the data is absolute, this holds the current interpolated value for
   * the scroll left offset scaled by the horizontal parallax depth of the
   * controller.
   *
   * Otherwise, this holds the change in this absolute value since the last
   * animation frame.
   */
  x: number;

  /**
   * Normalized {@link x}: {@link x} as a fraction from 0 to 1 (maximum scroll
   * left offset).
   */
  nx: number;

  /**
   * If the data is absolute, this holds the current interpolated value for
   * the scroll top offset scaled by the vertical parallax depth of the
   * controller.
   *
   * Otherwise, this holds the change in this absolute value since the last
   * animation frame.
   */
  y: number;

  /**
   * Normalized {@link y}: {@link y} as a fraction from 0 to 1 (maximum scroll
   * top offset).
   */
  ny: number;
};

/**
 * Add to this when registering a new effect.
 */
/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
export interface EffectRegistry {}
