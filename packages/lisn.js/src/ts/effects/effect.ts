/**
 * @module Effects/Effect
 *
 * @since v1.3.0
 */

/**
 * @interface
 */
export type Effect = {
  apply: (element: Element, offsets: ScrollOffsets) => Effect;
};

export type EffectHandler<R> = (offsets: ScrollOffsets) => R;

/**
 * The scroll offsets for the current animation frame, being smoothly
 * interpolated towards the target ones.
 *
 * @category Effects
 */
export type ScrollOffsets = {
  /**
   * The current interpolated value for the scroll left offset.
   */
  x: number;

  /**
   * The change in {@link x} since the last animation frame.
   */
  dx: number;

  /**
   * Normalized {@link x}: {@link x} as a fraction from 0 to 1 (maximum scroll
   * left offset).
   */
  nx: number;

  /**
   * The change in {@link nx} since the last animation frame.
   */
  dnx: number;

  /**
   * The current interpolated value for the scroll top offset.
   */
  y: number;

  /**
   * The change in {@link y} since the last animation frame.
   */
  dy: number;

  /**
   * Normalized {@link y}: {@link y} as a fraction from 0 to 1 (maximum scroll
   * top offset).
   */
  ny: number;

  /**
   * The change in {@link ny} since the last animation frame.
   */
  dny: number;
};
