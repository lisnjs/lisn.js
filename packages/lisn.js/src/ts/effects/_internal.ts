/**
 * @module
 * @ignore
 * @internal
 */

import * as _ from "@lisn/_internal";

import { Size } from "@lisn/globals/types";

import { bugError } from "@lisn/globals/errors";

import { animationFrameGenerator } from "@lisn/utils/animations";
import { waitForMeasureTime } from "@lisn/utils/dom-optimize";
import { toNum } from "@lisn/utils/math";
import { getSizeOf } from "@lisn/utils/size";

import { createConcurrentCallback } from "@lisn/modules/callback";

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
import type {
  FXClamp,
  FXClampInstance,
  FXClampViolation,
} from "@lisn/effects/fx-clamp";
import type { FXTrigger, FXTriggerInstance } from "@lisn/effects/fx-trigger";

import { SizeWatcher, OnResizeHandler } from "@lisn/watchers/size-watcher";
import { ViewWatcher, OnViewHandler } from "@lisn/watchers/view-watcher";

import { LoggerInterface } from "@lisn/debug/types";

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
  requestRecompose: (realtime?: boolean) => void,
  logger?: LoggerInterface,
) => instanceCreators.effect(effect, composer, requestRecompose, logger);

// pins -----

export const createPinInstance = (
  pin: FXPin,
  composer: FXComposer,
  requestEffectUpdate: (clampedState: FXState, realtime?: boolean) => void,
  logger?: LoggerInterface,
) => instanceCreators.pin(pin, composer, requestEffectUpdate, logger);

// clamps -----

export const createClampInstance = <T extends string>(
  clamp: FXClamp<T>,
  composer: FXComposer,
  requestPinUpdate: (violation: FXClampViolation) => void,
  logger?: LoggerInterface,
) => instanceCreators.clamp(clamp, composer, requestPinUpdate, logger);

// triggers -----

export const getTriggerInstance = <T extends string>(trigger: FXTrigger<T>) =>
  instanceGetters.trigger(trigger);

export const createTriggerInstance = <T extends string>(
  trigger: FXTrigger<T>,
  logger?: LoggerInterface,
) => instanceCreators.trigger(trigger, logger);

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
  viewWatcher?: ViewWatcher | null,
  logger?: LoggerInterface | undefined,
) => {
  viewWatcher ??= ViewWatcher.reuse({ rootMargin: "200px" });
  const visible = _.createMap<Element, boolean>();
  let hasVisible = false;

  const viewHandler: OnViewHandler = createConcurrentCallback(
    (el, viewData) => {
      const isThisVisible = viewData.views[0] === "at";
      visible.set(el, isThisVisible);

      const newHasVisible =
        isThisVisible || [...visible.values()].some((v) => v);

      if (hasVisible !== newHasVisible) {
        hasVisible = newHasVisible;
        callback(hasVisible);
      }
    },
    { logger },
  );

  const start = () => {
    for (const el of elements) {
      viewWatcher.onView(el, viewHandler);
    }
  };

  const stop = () => {
    for (const el of elements) {
      viewWatcher.offView(el, viewHandler);
      visible.clear();
      hasVisible = false;
    }
  };

  return { start, stop } as const;
};

export const watchSize = (
  target?: Element | null,
  logger?: LoggerInterface | undefined,
) => {
  const mapKey = target ?? null;
  let size = sizes.get(mapKey) ?? getSizeOf(target);

  const sizeWatcher = SizeWatcher.reuse();
  const resizeHandler: OnResizeHandler = createConcurrentCallback(
    (e__ignored, sizeData) => {
      size = sizeData.border;
      sizes.set(mapKey, size);
    },
    { logger },
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

export const loopOnRepaint = (
  callback: () => void,
  logger?: LoggerInterface,
) => {
  let isRunning = false;
  let generator: AsyncGenerator | null = null;

  const looper = async () => {
    if (!isRunning) {
      logger?.debug10("Starting repaint check loop");
      isRunning = true;

      generator = animationFrameGenerator();
      for await (const e__ignored of generator) {
        // wait for the browser to repaint
        await waitForMeasureTime();
        callback();
      }

      isRunning = false;
    }
  };

  return {
    stop: () => {
      if (isRunning) {
        logger?.debug10("Stopping repaint check loop");
        generator?.return(void 0);
        generator = null;
      }
    },
    start: () => {
      looper();
    },
  } as const;
};

// ------------------------------

type InstanceGetters = {
  composer: (element: Element) => FXComposer | undefined;

  trigger: <T extends string>(
    trigger: FXTrigger<T>,
  ) => FXTriggerInstance | undefined;
};

type InstanceCreators = {
  effect: <T extends EffectName>(
    effect: Effect<T>,
    composer: FXComposer,
    requestRecompose: (realtime?: boolean) => void,
    logger?: LoggerInterface,
  ) => EffectInstance<T>;

  pin: (
    pin: FXPin,
    composer: FXComposer,
    requestEffectUpdate: (clampedState: FXState, realtime?: boolean) => void,
    logger?: LoggerInterface,
  ) => FXPinInstance;

  clamp: <T extends string>(
    clamp: FXClamp<T>,
    composer: FXComposer,
    requestPinUpdate: (violation: FXClampViolation) => void,
    logger?: LoggerInterface,
  ) => FXClampInstance;

  trigger: <T extends string>(
    trigger: FXTrigger<T>,
    logger?: LoggerInterface,
  ) => FXTriggerInstance;
};

const noInstanceGetterErr = (t: string) =>
  bugError(`No instance getter for ${t}`);

const noInstanceCreatorErr = (t: string) =>
  bugError(`No instance creator for ${t}`);

const instanceGetters: InstanceGetters = {
  composer: () => {
    throw noInstanceGetterErr("effect");
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
