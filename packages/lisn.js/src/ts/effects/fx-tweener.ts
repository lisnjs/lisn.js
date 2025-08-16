/**
 * @module Effects/Tweeners
 *
 * @since v1.3.0
 */

import { criticallyDamped } from "@lisn/utils/math";

export type FXTweener = (input: FXTweenerInput) => FXTweenerOutput;

export type FXTweenerInput = {
  current: number;
  target: number;
  velocity: number;
  lag: number;
  deltaTime: number;
  totalTime: number;
};

export type FXTweenerOutput = {
  current: number;
  velocity: number;
};

// ------------------------------

const springTweener: FXTweener = ({
  current,
  target,
  lag,
  velocity,
  deltaTime,
}) => {
  const result = criticallyDamped({
    lTarget: target,
    dt: deltaTime,
    lag: lag,
    l: current,
    v: velocity,
  });
  return { current: result.l, velocity: result.v };
};

// ------------------------------

export const FX_TWEENERS = {
  spring: springTweener,
} as const;
