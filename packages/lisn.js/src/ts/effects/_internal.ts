/**
 * @module
 * @ignore
 * @internal
 */

import * as _ from "@lisn/_internal";

import { Size } from "@lisn/globals/types";

import { bugError } from "@lisn/globals/errors";

import { waitForSubsequentMeasureTime } from "@lisn/utils/dom-optimize";
import { toNum } from "@lisn/utils/math";
import { getSizeOf } from "@lisn/utils/size";

import { createCallback } from "@lisn/modules/callback";

import type {
  FXComposer,
  FXAxisState,
  FXState,
  FXStateUpdate,
} from "@lisn/effects/fx-composer";
import type {
  EffectName,
  Effect,
  EffectInstance,
  ParallaxScalerFn,
  EffectParams,
} from "@lisn/effects/effect";
import type { FXPin, FXPinInstance } from "@lisn/effects/fx-pin";
import type { FXClamp, FXClampInstance } from "@lisn/effects/fx-clamp";
import type { FXTrigger, FXTriggerInstance } from "@lisn/effects/fx-trigger";

import { SizeWatcher, OnResizeHandler } from "@lisn/watchers/size-watcher";
import { ViewWatcher, OnViewHandler } from "@lisn/watchers/view-watcher";

export type StartStopper = {
  start: () => void;
  stop: () => void;
};

// Instances --------------------

export const setInstanceGetter = <K extends keyof InstanceGetters>(
  category: K,
  getter: InstanceGetters[K],
) => {
  instanceGetters[category] = getter;
};

export const setInstanceCreator = <K extends keyof InstanceCreators>(
  category: K,
  creator: InstanceCreators[K],
) => {
  instanceCreators[category] = creator;
};

// effects -----

export const getComposerInstance = (element: Element) =>
  instanceGetters.composer(element);

// effects -----

export const createEffectInstance = <T extends EffectName>(
  effect: Effect<T>,
  composer: FXComposer,
) => instanceCreators.effect(effect, composer);

// pins -----

export const getPinInstance = <T extends EffectName>(
  composer: FXComposer,
  effectInstance: EffectInstance<T>,
) => instanceGetters.pin(composer, effectInstance);

export const createPinInstance = <T extends EffectName>(
  pin: FXPin,
  composer: FXComposer,
  effectInstance: EffectInstance<T>,
) => instanceCreators.pin(pin, composer, effectInstance);

// clamps -----

export const createClampInstance = <T extends string>(
  clamp: FXClamp<T>,
  composer: FXComposer,
  notifyPin: (
    active: boolean,
    deviation: { x?: number; y?: number; z?: number } | null,
  ) => void,
) => instanceCreators.clamp(clamp, composer, notifyPin);

// triggers -----

export const getTriggerInstance = <T extends string>(trigger: FXTrigger<T>) =>
  instanceGetters.trigger(trigger);

export const createTriggerInstance = <T extends string>(
  trigger: FXTrigger<T>,
) => instanceCreators.trigger(trigger);

// FX state and params --------------------

/**
 * Returns the {@link EffectParams | parameters} for the given composer state.
 */
export const toParameters = (
  state: FXState,
  isAbsolute = false,
): EffectParams => {
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
 * Returns the parameters scaled by the given scaling function using the
 * parallax depths in the state.
 */
export const scaleParameters = (
  parameters: EffectParams,
  state: FXState,
  scaler: ParallaxScalerFn,
): EffectParams => {
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

// Monitoring --------------------

export const atLeastOneVisible = (
  elements: Iterable<Element>,
  callback: (hasVisible: boolean) => void,
  viewWatcher?: ViewWatcher,
) => {
  viewWatcher ??= ViewWatcher.reuse({ rootMargin: "200px" });
  const visible = _.createMap<Element, boolean>();

  let hasVisible = false;

  const viewHandler: OnViewHandler = createCallback((el, viewData) => {
    const isThisVisible = viewData.views[0] === "at";
    visible.set(el, isThisVisible);

    const newHasVisible = isThisVisible || [...visible.values()].some((v) => v);

    if (hasVisible !== newHasVisible) {
      hasVisible = newHasVisible;
      callback(hasVisible);
    }
  }, true);

  const start = () => {
    for (const el of elements) {
      viewWatcher.onView(el, viewHandler);
    }
  };

  const stop = () => {
    for (const el of elements) {
      viewWatcher.offView(el, viewHandler);
    }
  };

  return { start, stop } as const;
};

export const watchSize = (target?: Element) => {
  const mapKey = target ?? null;
  let size = sizes.get(mapKey) ?? getSizeOf(target);

  const sizeWatcher = SizeWatcher.reuse();
  const resizeHandler: OnResizeHandler = createCallback(
    (e__ignored, sizeData) => {
      size = sizeData.border;
      sizes.set(mapKey, size);
    },
    true,
  );

  const start = () => {
    sizeWatcher.onResize(resizeHandler, _.fastWatcherConf({ target }));
  };

  const stop = () => {
    sizeWatcher.offResize(resizeHandler);
    _.deleteKey(sizes, mapKey);
  };

  return {
    get: (): Size => _.copyObject(size),
    start,
    stop,
  } as const;
};

export const loopOnAfterPaint = (callback: () => void) => {
  let shouldStop = false;
  let isRunning = false;

  const looper = async () => {
    if (!isRunning) {
      isRunning = true;

      while (true) {
        await waitForSubsequentMeasureTime(); // just after each repaint
        if (shouldStop) {
          break;
        }

        callback();
      }

      isRunning = false;
    }
  };

  return {
    stop: () => {
      shouldStop = true;
    },
    start: () => {
      looper();
    },
  } as const;
};

// ------------------------------

type InstanceGetters = {
  composer: (element: Element) => FXComposer | undefined;

  pin: <T extends EffectName>(
    composer: FXComposer,
    effectInstance: EffectInstance<T>,
  ) => FXPinInstance | undefined;

  trigger: <T extends string>(
    trigger: FXTrigger<T>,
  ) => FXTriggerInstance | undefined;
};

type InstanceCreators = {
  effect: <T extends EffectName>(
    effect: Effect<T>,
    composer: FXComposer,
  ) => EffectInstance<T>;

  pin: <T extends EffectName>(
    pin: FXPin,
    composer: FXComposer,
    effectInstance: EffectInstance<T>,
  ) => FXPinInstance;

  clamp: <T extends string>(
    clamp: FXClamp<T>,
    composer: FXComposer,
    notifyPin: (
      active: boolean,
      deviation: { x?: number; y?: number; z?: number } | null,
    ) => void,
  ) => FXClampInstance;

  trigger: <T extends string>(trigger: FXTrigger<T>) => FXTriggerInstance;
};

const noInstanceGetterErr = (t: string) =>
  bugError(`No instance getter for ${t}`);

const noInstanceCreatorErr = (t: string) =>
  bugError(`No instance creator for ${t}`);

const instanceGetters: InstanceGetters = {
  composer: () => {
    throw noInstanceGetterErr("effect");
  },
  pin: () => {
    throw noInstanceGetterErr("pin");
  },
  trigger: () => {
    throw noInstanceGetterErr("trigger");
  },
};

const instanceCreators: InstanceCreators = {
  effect: () => {
    throw noInstanceCreatorErr("effect");
  },
  pin: () => {
    throw noInstanceCreatorErr("pin");
  },
  clamp: () => {
    throw noInstanceCreatorErr("clamp");
  },
  trigger: () => {
    throw noInstanceCreatorErr("trigger");
  },
};

const sizes = _.createMap<Element | null, Size>();
