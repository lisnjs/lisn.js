/**
 * @module Effects
 *
 * @since v1.3.0
 *
 * @categoryDescription Triggers
 * A trigger is what the {@link Effects.FXComposer | FXComposer} can
 * continually poll for new data.
 */

import * as _ from "@lisn/_internal";

import { bugError, usageError } from "@lisn/globals/errors";

import { ScrollTarget } from "@lisn/globals/types";

import { addDeltaZ } from "@lisn/utils/gesture";
import { toNumWithBounds } from "@lisn/utils/math";
import { waitForDelay } from "@lisn/utils/tasks";

import { createConcurrentCallback } from "@lisn/modules/callback";

import type { FXStateUpdate } from "@lisn/effects/fx-composer";
import {
  StartStopper,
  setInstanceGetter,
  setInstanceCreator,
} from "@lisn/effects/_internal";

import { ScrollWatcher, OnScrollHandler } from "@lisn/watchers/scroll-watcher";
import {
  GestureWatcher,
  OnGestureHandler,
  OnGestureOptions,
} from "@lisn/watchers/gesture-watcher";

import debug from "@lisn/debug/debug";
import { LoggerInterface } from "@lisn/debug/types";

const TRIGGER: unique symbol = _.SYMBOL.for(
  "LISN.js/types/trigger",
) as typeof TRIGGER;

/**
 * Base trigger class.
 *
 * @category Base
 */
export abstract class FXTriggerBase<T extends string> implements FXTrigger<T> {
  /**
   * @ignore
   * @internal
   */
  readonly [TRIGGER] = true;

  abstract type: T;

  constructor() {
    const data: FXTriggerInitData<unknown[]> = { _args: null };
    allBuilderData.set(this, data);
  }
}

/**
 * @category Triggers
 */
export interface FXTrigger<T extends string = string> {
  /**
   * @ignore
   * @internal
   */
  readonly [TRIGGER]: true;

  /**
   * Unique name for the trigger type.
   */
  readonly type: T;
}

// ------------------------------------------------------------------------
// -------------------------- BUILT-IN TRIGGERS ---------------------------
// ------------------------------------------------------------------------

// --------------------------------- PROXY ---------------------------------

/**
 * {@link FXProxyTrigger} is triggered by another trigger and uses its
 * {@link FXStateUpdate} but can transform the values or introduce delay before
 * it fires.
 *
 * @category Triggers
 */
export class FXProxyTrigger extends FXTriggerBase<"proxy"> {
  readonly type = "proxy";

  constructor(trigger: FXTrigger, config: FXProxyTriggerConfig) {
    super();

    if (!trigger) {
      throw usageError("A trigger is required for FXProxyTrigger");
    }

    const { setArgs } = initProxy(this);
    setArgs(trigger, config);
  }
}

/**
 * @category Triggers
 */
export type FXProxyTriggerConfig = {
  /**
   * A delay in milliseconds before this trigger fires following an update from
   * the original, proxied trigger.
   *
   * If the trigger fires again before delay has passed, the new data will
   * simply be queued. No updates are dropped.
   *
   * @defaultValue 0
   */
  delay?: number;

  /**
   * If given, it will be called with the update data from the proxied trigger
   * and must return new values. The function is called after the {@link delay}
   * has passed.
   *
   * @defaultValue undefined
   */
  transformFn?: (update: FXStateUpdate) => FXStateUpdate;
};

// -------------------------------- SCROLL ---------------------------------

/**
 * {@link FXScrollTrigger} is triggered by scroll events and sends an
 * {@link FXStateUpdate} based on the top/left scroll offsets and scroll
 * width/height.
 *
 * @category Triggers
 */
export class FXScrollTrigger extends FXTriggerBase<"scroll"> {
  readonly type = "scroll";

  /**
   * @param scrollable If not given, then it will use {@link ScrollWatcher}
   * default.
   */
  constructor(scrollable?: ScrollTarget) {
    super();

    const { setArgs } = initScroll(this);
    setArgs(scrollable);
  }
}

// -------------------------------- GESTURE --------------------------------

/**
 * {@link FXGestureTrigger} is triggered by user gestures and sends an
 * {@link FXStateUpdate} based on the total delta values. See
 * {@link GestureWatcher}.
 *
 * @category Triggers
 */
export class FXGestureTrigger extends FXTriggerBase<"gesture"> {
  readonly type = "gesture";

  constructor(target: EventTarget, config?: FXGestureTriggerConfig) {
    super();
    if (!target) {
      throw usageError("A target is required for FXGestureTrigger");
    }

    const { setArgs } = initGesture(this);
    setArgs(target, config);
  }
}

/**
 * See {@link OnGestureOptions}.
 *
 * @interface
 *
 * @category Triggers
 */
export type FXGestureTriggerConfig = Omit<
  OnGestureOptions,
  "debounceWindow" | "deltaThreshold"
>;

// -------------------- BASE --------------------

/**
 * A trigger is what the {@link Effects.FXComposer | FXComposer} can
 * continually poll for new data.
 *
 * It can be polled by multiple receivers, so you can reuse triggers across
 * composers.
 *
 * {@link registerFXTrigger} registers a new trigger type. It returns an object
 * with an `init` property holding a function.
 *
 * Your trigger class should call this `init` function in its constructor,
 * passing it itself (`this`). `init` will return an object containing the
 * following function:
 * - `setArgs`: Sets the arguments that the {@link FXTriggerLogic}'s run method
 *              will receive. Your trigger class **must** call this in its
 *              constructor.
 *
 * See example below for implementing a basic trigger class.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If this trigger type has already been registered.
 *
 * @example
 * ```typescript
 * type CustomArg = string;
 * type CustomConfig = { opt: boolean };
 *
 * const { init } = registerFXTrigger<
 *   "custom",
 *   number, // state
 *   { start: () => void, stop: () => void }, // data
 *   [CustomArg, CustomConfig | undefined], // arguments passed to run
 * >({
 *   type: "custom",
 *   logic: {
 *     run(store, arg, config) {
 *       // required, set initial state and data
 *       store.setState(0);
 *       // ... rest of init
 *       store.setData({
 *         start: () => {
 *           // ...
 *         },
 *
 *         stop: () => {
 *           // ...
 *         }
 *       });
 *     },
 *
 *     pause(store) {
 *       store.getData().stop();
 *     },
 *
 *     resume(store) {
 *       store.getData().start();
 *     },
 *   }
 * });
 *
 * export class FXCustomTrigger extends FXTriggerBase<"custom"> {
 *   readonly type = "custom"; // required
 *
 *   constructor(arg: CustomArgs, config?: CustomConfig) {
 *     super();
 *
 *     const { setArgs } = init(this);
 *     setArgs(arg, config);
 *   }
 * }
 * ```
 *
 *
 * @typeParam Data The type of data the trigger stores. This is arbitrary data
 *                 to be shared across the {@link FXTriggerLogic} methods.
 * @typeParam Args The type of arguments to pass to the instance methods
 *                 (defined in your {@link FXTriggerLogic}).
 *
 * @category Base
 */
export const registerFXTrigger = <
  const T extends string,
  Data,
  Args extends unknown[] = [],
>(
  definitions: FXTriggerDefinitions<T, Data, Args>,
) => {
  if (registeredTypes.has(definitions.type)) {
    throw usageError(
      `Trigger type '${definitions.type}' is already registered`,
    );
  }

  registeredTypes.set(definitions.type, definitions);

  return {
    init: (self: FXTrigger<T>) => {
      return {
        setArgs: (...args: Args) => {
          const data = getInitData<Args>(self);
          data._args = args;
        },
      } as const;
    },
  };
};

/**
 * @category Base
 */
export interface FXTriggerInstance {
  /**
   * An infinite async generator that continually yields new data.
   *
   * It can be called by multiple receivers.
   *
   * It will automatically detect when there are no more pollers and pause
   * itself.
   *
   * **NOTE:** The trigger does not queue or buffer data while it's paused or if
   * there are no active pollers, and therefore multiple pushes of new data
   * before the first call to {@link poll} or while the trigger is paused, will
   * only yield the last data that was pushed.
   *
   * You should generally use this in a `for await..of` loop, since the
   * generator's `next` method does not accept any value. If you need to call
   * `next` manually, make sure you also call the generator's `return` method
   * when done, to allow it to detect a poller has quit and therefore
   * automatically pause if needed.
   *
   * @example
   * ```javascript
   * for await (const updateData of trigger.poll()) {
   *   // ...
   * }
   * ```
   *
   * @example
   * ```javascript
   * const generator = trigger.poll();
   * while (true) {
   *   const { value } = generator.next();
   *   if (shouldQuit) {
   *     generator.return();
   *     break;
   *   }
   * }
   * ```
   */
  readonly poll: () => AsyncGenerator<FXStateUpdate, undefined, undefined>;
}

/**
 * Defines a new trigger type.
 *
 * @category Base
 */
export type FXTriggerDefinitions<
  T extends string,
  Data,
  Args extends unknown[],
> = {
  /**
   * Unique name for the trigger type.
   */
  type: T;

  /**
   * See {@link FXTriggerLogic}.
   */
  logic: FXTriggerLogic<Data, Args>;
};

/**
 * Inside each method, the current trigger instance which the logic operates can
 * be accessed as the `this` value (as long as the logic method is not an arrow
 * function).
 *
 * @category Base
 */
export type FXTriggerLogic<Data, Args extends unknown[]> = {
  /**
   * The function will be called once when the trigger instance is created.
   */
  run: (store: FXTriggerStore<Data>, ...args: Args) => void;

  /**
   * If given, it will be called when the trigger pauses.
   *
   * **NOTE:** The initial state of the trigger is always paused until there's
   * at least one poller, and it pauses when there are no more pollers.
   */
  pause?: (store: FXTriggerStore<Data>) => void;

  /**
   * If given, it will be called when the trigger resumes.
   *
   * **NOTE:** The initial state of the trigger is always paused until there's
   * at least one poller, and it pauses when there are no more pollers.
   */
  resume?: (store: FXTriggerStore<Data>) => void;
};

/**
 * Internal data management for a trigger to be used by its logic methods.
 *
 * @category Base
 */
export type FXTriggerStore<Data> = {
  /**
   * Call this when your trigger instance has new data to send to the composer.
   */
  push: (update: FXStateUpdate) => void;

  /**
   * Returns the current data, last set using {@link setData}.
   *
   * You **must** call {@link setData} before calling this.
   *
   * It is not copied before storing.
   */
  getData: () => Data;

  /**
   * Updates the current data.
   *
   * It is not copied before returning.
   */
  setData: (data: Data) => void;
};

// ------------------------------

const getTriggerInstance = <T extends string>(trigger: FXTrigger<T>) =>
  allInstances.get(trigger);

const createTriggerInstance = <T extends string, D, A extends unknown[]>(
  trigger: FXTrigger<T>,
  logger?: LoggerInterface,
): FXTriggerInstance => {
  /* istanbul ignore next */
  if (!_.isInstanceOf(trigger, FXTriggerBase)) {
    throw usageError("Object is not an FXTrigger");
  }

  const existing = getTriggerInstance(trigger);
  if (existing) {
    return existing;
  }

  const definitions = registeredTypes.get<T, D, A>(trigger.type);
  /* istanbul ignore next */
  if (!definitions) {
    throw bugError(`No definitions saved for trigger type '${trigger.type}'`);
  }

  const { logic } = definitions;

  const init = getInitData<A>(trigger);
  const { _args: args } = init;

  /* istanbul ignore next */
  if (!_.isArray(args)) {
    // child class didn't call setArgs
    throw usageError(`No arguments saved for trigger '${trigger.type}'`);
  }

  let isActive = false;

  const pollers = _.createSet<Poller>();

  // Save it in an object in order to allow pushing `null` and
  // distinguishing it from no pushing.
  let lastPush: PollUpdate | null = null;
  let pushedWhilePaused = false;

  const storeData: {
    _data?: D;
  } = {};

  const store: FXTriggerStore<D> = {
    push: (update: FXStateUpdate) => updateState({ _update: update }),

    getData: () => {
      /* istanbul ignore next */
      const data = storeData._data;
      if (_.isUndefined(data)) {
        throw usageError(`No data saved for trigger '${trigger.type}'`);
      }

      return data;
    },
    setData: (data) => {
      storeData._data = data;
    },
  };

  // ----------

  const updateState = (state: PollUpdate | null) => {
    lastPush = state;
    pushedWhilePaused = !isActive;

    if (state && isActive) {
      for (const poller of pollers) {
        poller._push(state._update);
      }
    }
  };

  // ----------

  const setState = (activate: boolean) => {
    if (isActive !== activate) {
      isActive = activate;

      if (activate && pushedWhilePaused) {
        // wake up pollers with the last data pushed while paused
        updateState(lastPush);
      }

      (isActive ? logic?.resume : logic?.pause)?.call(self, store);
    }
  };

  // --------------------

  async function* poll(): AsyncGenerator<FXStateUpdate, undefined, undefined> {
    setState(true); // resume if needed

    const poller = createPoller();
    pollers.add(poller);

    if (lastPush && isActive) {
      // there's been a push already
      yield _.copyNested(lastPush._update);
    }

    try {
      while (true) {
        yield _.copyNested(await poller._pull());
      }
    } finally {
      _.deleteKey(pollers, poller);

      if (!_.sizeOf(pollers)) {
        setState(false); // pause
      }
    }
  }

  // --------------------

  const self: FXTriggerInstance = { poll };
  const logger__ignored = debug
    ? debug.Logger.getLoggerFor(self, {
        parent: logger,
      })
    : void 0;

  allInstances.set(trigger, self);

  logic.run.call(self, store, ...args);
  return self;
};

// ------------------------------

type Poller = {
  _pull: () => Promise<FXStateUpdate>;
  _push: (update: FXStateUpdate) => void;
};

type PollUpdate = { _update: FXStateUpdate };

type FXTriggerInitData<A extends unknown[]> = {
  _args: A | null;
};

interface RegistrationMap {
  has(type: string): boolean;
  get<T extends string, D, A extends unknown[]>(
    type: T,
  ): FXTriggerDefinitions<T, D, A> | undefined;
  set<T extends string, D, A extends unknown[]>(
    type: T,
    definitions: FXTriggerDefinitions<T, D, A>,
  ): this;
}

interface BuilderDataMap {
  get<A extends unknown[]>(
    trigger: FXTrigger,
  ): FXTriggerInitData<A> | undefined;
  set<A extends unknown[]>(
    trigger: FXTrigger,
    data: FXTriggerInitData<A>,
  ): this;
}

const registeredTypes: RegistrationMap = new Map();
const allBuilderData = new WeakMap() as BuilderDataMap;
const allInstances = _.createWeakMap<FXTrigger, FXTriggerInstance>();

// --------------------

const { init: initProxy } = registerFXTrigger<
  "proxy",
  StartStopper,
  [FXTrigger, FXProxyTriggerConfig]
>({
  type: "proxy",
  logic: {
    async run(store, trigger, config) {
      const logger = debug ? debug.Logger.getLoggerFor(this) : void 0;

      const { delay = 0, transformFn } = config ?? {};

      const relayUpdate = async (update: FXStateUpdate) => {
        if (delay > 0) {
          await waitForDelay(delay);
        }

        store.push(transformFn ? transformFn(update) : update);
      };

      const triggerInstance = createTriggerInstance(trigger, logger);
      let poller: AsyncGenerator<FXStateUpdate, undefined, undefined> | null =
        null;

      const poll: StartStopper = {
        start: async () => {
          poller = triggerInstance.poll();

          while (true) {
            const { value: update, done } = await poller.next();
            if (done) {
              break;
            }

            relayUpdate(update); // don't await, just queue
          }
        },
        stop: () => {
          poller?.return(void 0);
        },
      };

      store.setData(poll);
    },

    pause: (store) => store.getData().stop(),
    resume: (store) => store.getData().start(),
  },
});

const { init: initScroll } = registerFXTrigger<
  "scroll",
  StartStopper,
  [ScrollTarget | undefined]
>({
  type: "scroll",
  logic: {
    run(store, scrollable) {
      const logger = debug
        ? debug.Logger.getLoggerFor(this, { forElement: scrollable })
        : void 0;

      const scrollWatcher = ScrollWatcher.reuse();
      let shouldSnap = true;

      const scrollHandler: OnScrollHandler = createConcurrentCallback(
        (e__ignored, scrollData) => {
          store.push({
            x: {
              low: 0,
              high: scrollData[_.S_SCROLL_WIDTH] - scrollData[_.S_CLIENT_WIDTH],
              target: scrollData[_.S_SCROLL_LEFT],
              snap: shouldSnap,
            },
            y: {
              low: 0,
              high:
                scrollData[_.S_SCROLL_HEIGHT] - scrollData[_.S_CLIENT_HEIGHT],
              target: scrollData[_.S_SCROLL_TOP],
              snap: shouldSnap,
            },
          });
          shouldSnap = false;
        },
        { logger },
      );

      const watch: StartStopper = {
        start: () => {
          shouldSnap = true;
          scrollWatcher.trackScroll(
            scrollHandler,
            _.fastWatcherConf({
              scrollable,
            }),
          );
        },
        stop: () => {
          scrollWatcher.noTrackScroll(scrollHandler, scrollable);
        },
      };

      store.setData(watch);
    },

    pause: (store) => store.getData().stop(),
    resume: (store) => store.getData().start(),
  },
});

const { init: initGesture } = registerFXTrigger<
  "gesture",
  StartStopper,
  [EventTarget, FXGestureTriggerConfig | undefined]
>({
  type: "gesture",
  logic: {
    run: (store, target, config) => {
      const {
        minTotalDeltaX = null,
        minTotalDeltaY = null,
        minTotalDeltaZ = null,
        maxTotalDeltaX = null,
        maxTotalDeltaY = null,
        maxTotalDeltaZ = null,
      } = config ?? {};

      const gestureWatcher = GestureWatcher.reuse();

      // We need to keep track of the total deltas here, since when removing and
      // re-adding the watcher handler on pause/resume, will reset the total
      // deltas we receive from the GestureWatcher.
      const totalDeltas = { x: 0, y: 0, z: 1 };

      const gestureHandler: OnGestureHandler = (t__ignored, gestureData) => {
        totalDeltas.x = toNumWithBounds(totalDeltas.x + gestureData.deltaX, {
          min: minTotalDeltaX,
          max: maxTotalDeltaX,
        });
        totalDeltas.y = toNumWithBounds(totalDeltas.y + gestureData.deltaY, {
          min: minTotalDeltaY,
          max: maxTotalDeltaY,
        });
        totalDeltas.z = toNumWithBounds(
          addDeltaZ(totalDeltas.z, gestureData.deltaZ),
          {
            min: minTotalDeltaZ,
            max: maxTotalDeltaZ,
          },
        );

        store.push({
          x: {
            low: 0,
            high: totalDeltas.x,
            target: totalDeltas.x,
          },
          y: {
            low: 0,
            high: totalDeltas.y,
            target: totalDeltas.y,
          },
          z: {
            low: 0,
            high: totalDeltas.z,
            target: totalDeltas.z,
          },
        });
      };

      const watch: StartStopper = {
        start: () => {
          gestureWatcher.onGesture(
            target,
            gestureHandler,
            _.merge(config, {
              debounceWindow: 0,
              deltaThreshold: 0,
            }),
          );
        },
        stop: () => {
          gestureWatcher.offGesture(target, gestureHandler);
        },
      };

      store.setData(watch);
    },

    pause: (store) => store.getData().stop(),
    resume: (store) => store.getData().start(),
  },
});

// --------------------

const getInitData = <A extends unknown[]>(trigger: FXTrigger) => {
  const data = allBuilderData.get<A>(trigger);
  /* istanbul ignore next */
  if (!data) {
    throw bugError(`No init data saved for trigger '${trigger.type}'`);
  }
  return data;
};

const createPoller = (): Poller => {
  const queue: PollUpdate[] = [];

  let wakeUp: (() => void) | null = null;

  const push = (update: FXStateUpdate) => {
    queue.push({ _update: update });

    if (wakeUp) {
      wakeUp();
    }
  };

  const pull = async () => {
    const entry = queue.shift();
    if (entry) {
      return entry._update;
    }

    // Wait for push
    await _.createPromise<void>((r) => (wakeUp = r));
    wakeUp = null;

    return pull();
  };

  return { _push: push, _pull: pull };
};

// --------------------

setInstanceGetter("trigger", getTriggerInstance);
setInstanceCreator("trigger", createTriggerInstance);

_.brandClass(FXTriggerBase, "FXTriggerBase");
_.brandClass(FXProxyTrigger, "FXProxyTrigger");
_.brandClass(FXScrollTrigger, "FXScrollTrigger");
_.brandClass(FXGestureTrigger, "FXGestureTrigger");
