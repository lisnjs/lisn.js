/**
 * @module Effects/Triggers
 *
 * @since v1.3.0
 */

import * as _ from "@lisn/_internal";

import { usageError } from "@lisn/globals/errors";

import { ScrollTarget } from "@lisn/globals/types";

import { addDeltaZ } from "@lisn/utils/gesture";
import { toNumWithBounds } from "@lisn/utils/math";
import { waitForDelay } from "@lisn/utils/tasks";

import {
  CallbackHandler,
  Callback,
  addHandlerToMap,
  invokeHandlers,
} from "@lisn/modules/callback";

import { FXStateUpdate } from "@lisn/effects/effect";

import { ScrollWatcher, OnScrollHandler } from "@lisn/watchers/scroll-watcher";
import {
  GestureWatcher,
  OnGestureHandler,
  OnGestureOptions,
} from "@lisn/watchers/gesture-watcher";

// -------------------------------------------------------------------------
// -------------------- BUILT-IN TRIGGERS SINGLE EXPORT --------------------
// -------------------------------------------------------------------------

/**
 * Function wrappers around built-in triggers.
 */
export const FX_TRIGGER = {
  proxy: (trigger: FXTrigger, config: FXProxyTriggerConfig) =>
    new FXProxyTrigger(trigger, config),
  scroll: (scrollable?: ScrollTarget) => new FXScrollTrigger(scrollable),
  gesture: (target: EventTarget, config?: FXGestureTriggerConfig) =>
    new FXGestureTrigger(target, config),
} as const;

// -------------------------------------------------------------------------

/**
 * A trigger is what the {@link FXComposer} can continually poll for new data.
 *
 * It can be polled by multiple receivers, so you can reuse triggers across
 * composers.
 *
 * This is a generic class that accepts a custom executor function. You may want
 * to subclass it when defining your own trigger types.
 */
export class FXTrigger {
  /**
   * An infinite async generator that continually yields new data.
   *
   * **NOTE:** The trigger does not queue or buffer data while it's paused or if
   * there are no active pollers, and therefore multiple pushes of new data
   * before the first call to {@link poll} or while the trigger is paused, will
   * only yield the last data that was pushed.
   */
  readonly poll: () => AsyncGenerator<FXStateUpdate, never, undefined>;

  /**
   * Returns true if the trigger is running (not paused).
   */
  readonly isRunning: () => boolean;

  /**
   * Pauses the trigger. It will not yield new data until resumed.
   */
  readonly pause: () => void;

  /**
   * Resumes the trigger.
   */
  readonly resume: () => void;

  /**
   * Calls the given handler whenever the trigger's {@link isRunning | state}
   * changes.
   *
   * The handler is called after pausing or resuming the trigger, such that
   * calling {@link isRunning} from the handler will reflect the latest state.
   */
  readonly onToggle: (handler: FXTriggerHandler) => void;

  /**
   * Removes a previously added {@link onToggle} handler.
   */
  readonly offToggle: (handler: FXTriggerHandler) => void;

  /**
   *
   * @param executor A function which accepts a `push` function. The executor
   *                 should call this function when it has new data to send to
   *                 the composer. It is also the responsibility for the
   *                 executor to set up an {@link onToggle} handler and pause
   *                 its data collection when the trigger is paused. It will be
   *                 called inside the class constructor with `this` set to the
   *                 newly created trigger.
   */
  constructor(executor: (push: (update: FXStateUpdate) => void) => void) {
    let isRunning = true;

    const toggleCallbacks = _.createMap<FXTriggerHandler, FXTriggerCallback>();
    const pollers = _.createSet<Poller>();

    // Save it in an object in order to allow pushing `null` and
    // distinguishing it from no pushing.
    let lastPush: PollUpdate | null = null;
    let pushedWhilePaused = false;

    const updateState = (state: PollUpdate | null) => {
      lastPush = state;
      pushedWhilePaused = !isRunning;

      if (state && isRunning) {
        for (const poller of pollers) {
          poller._push(state._update);
        }
      }
    };

    // ----------

    const setState = (activate: boolean) => {
      if (isRunning !== activate) {
        isRunning = activate;

        if (activate && pushedWhilePaused) {
          // wake up pollers with the last data pushed while paused
          updateState(lastPush);
        }

        invokeHandlers(toggleCallbacks, this, { isRunning });
      }
    };

    // --------------------

    this.isRunning = () => isRunning;
    this.pause = () => setState(false);
    this.resume = () => setState(true);

    this.poll = async function* () {
      const poller = createPoller();
      pollers.add(poller);

      if (lastPush && isRunning) {
        // there's been a push already
        yield _.copyNested(lastPush._update);
      }

      try {
        while (true) {
          yield _.copyNested(await poller._pull());
        }
      } finally {
        _.deleteKey(pollers, poller);
      }
    };

    this.onToggle = (handler) => {
      addHandlerToMap(handler, toggleCallbacks);
    };

    this.offToggle = (handler) => {
      _.remove(toggleCallbacks.get(handler));
    };

    // --------------------

    executor.call(this, (update: FXStateUpdate) =>
      updateState({ _update: update }),
    );
  }
}

/**
 * The handler is invoked with two arguments:
 *
 * - The {@link FXTrigger} instance.
 * - An object containing `isRunning` boolean property, indicating the state of
 *   the trigger at the time the callback was invoked. Note that by default,
 *   unless you pass a concurrent {@link Callback}, the handler will be invoked
 *   asynchronously, and so the state of the trigger may have changed by the
 *   time the handler runs. If you need the know the latest state, call
 *   {@link FXTrigger.isRunning | isRunning} on the trigger instance.
 */
export type FXTriggerHandlerArgs = [FXTrigger, { isRunning: boolean }];
export type FXTriggerCallback = Callback<FXTriggerHandlerArgs>;
export type FXTriggerHandler =
  | FXTriggerCallback
  | CallbackHandler<FXTriggerHandlerArgs>;

// ------------------------------------------------------------------------
// -------------------------- BUILT-IN TRIGGERS ---------------------------
// ------------------------------------------------------------------------

// --------------------------------- PROXY ---------------------------------

/**
 * {@link FXProxyTrigger} is triggered by another trigger and uses its
 * {@link FXStateUpdate} but can transform the values or introduce delay before
 * it fires.
 */
export class FXProxyTrigger extends FXTrigger {
  constructor(trigger: FXTrigger, config: FXProxyTriggerConfig) {
    if (!trigger) {
      throw usageError("A trigger is required for FXProxyTrigger");
    }

    const { delay = 0, transformFn } = config ?? {};

    const executor = (push: (update: FXStateUpdate) => void) => {
      (async () => {
        const relayUpdate = async (update: FXStateUpdate) => {
          if (delay > 0) {
            await waitForDelay(delay);
          }

          push(transformFn ? transformFn(update) : update);
        };

        for await (const update of trigger.poll()) {
          relayUpdate(update); // don't await, just queue
        }
      })();
    };

    // --------------------

    super(executor);
  }
}

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
 */
export class FXScrollTrigger extends FXTrigger {
  /**
   * @param scrollable If not given, then it will use {@link ScrollWatcher}
   * default.
   */
  constructor(scrollable?: ScrollTarget) {
    const scrollWatcher = ScrollWatcher.reuse();
    let scrollHandler: OnScrollHandler;
    let shouldSnap = true;

    const addOrRemoveWatcher = () => {
      shouldSnap = true;
      if (this.isRunning()) {
        scrollWatcher.trackScroll(
          scrollHandler,
          _.fastWatcherConf({
            scrollable,
          }),
        );
      } else {
        scrollWatcher.noTrackScroll(scrollHandler, scrollable);
      }
    };

    const executor = (push: (update: FXStateUpdate) => void) => {
      scrollHandler = (e__ignored, scrollData) => {
        push({
          x: {
            low: 0,
            high: scrollData[_.S_SCROLL_WIDTH] - scrollData[_.S_CLIENT_WIDTH],
            target: scrollData[_.S_SCROLL_LEFT],
            snap: shouldSnap,
          },
          y: {
            low: 0,
            high: scrollData[_.S_SCROLL_HEIGHT] - scrollData[_.S_CLIENT_HEIGHT],
            target: scrollData[_.S_SCROLL_TOP],
            snap: shouldSnap,
          },
        });
        shouldSnap = false;
      };
    };

    // --------------------

    super(executor);

    this.onToggle(addOrRemoveWatcher);
    addOrRemoveWatcher();
  }
}

// -------------------------------- GESTURE --------------------------------

/**
 * {@link FXGestureTrigger} is triggered by user gestures and sends an
 * {@link FXStateUpdate} based on the total delta values. See
 * {@link GestureWatcher}.
 */
export class FXGestureTrigger extends FXTrigger {
  constructor(target: EventTarget, config?: FXGestureTriggerConfig) {
    if (!target) {
      throw usageError("A target is required for FXGestureTrigger");
    }

    const {
      minTotalDeltaX = null,
      minTotalDeltaY = null,
      minTotalDeltaZ = null,
      maxTotalDeltaX = null,
      maxTotalDeltaY = null,
      maxTotalDeltaZ = null,
    } = config ?? {};

    const gestureWatcher = GestureWatcher.reuse();
    let gestureHandler: OnGestureHandler;

    // We need to keep track of the total deltas here, since when removing and
    // re-adding the watcher handler on pause/resume, will reset the total
    // deltas we receive from the GestureWatcher.
    const totalDeltas = { x: 0, y: 0, z: 1 };

    const addOrRemoveWatcher = () => {
      if (this.isRunning()) {
        gestureWatcher.onGesture(
          target,
          gestureHandler,
          _.merge(config, {
            debounceWindow: 0,
            deltaThreshold: 0,
          }),
        );
      } else {
        gestureWatcher.offGesture(target, gestureHandler);
      }
    };

    const executor = (push: (update: FXStateUpdate) => void) => {
      gestureHandler = (t__ignored, gestureData) => {
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

        push({
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
    };

    // --------------------

    super(executor);

    this.onToggle(addOrRemoveWatcher);
    addOrRemoveWatcher();
  }
}

/**
 * See {@link OnGestureOptions}.
 *
 * @interface
 */
export type FXGestureTriggerConfig = Omit<
  OnGestureOptions,
  "debounceWindow" | "deltaThreshold"
>;

// ------------------------------

type Poller = {
  _pull: () => Promise<FXStateUpdate>;
  _push: (update: FXStateUpdate) => void;
};

type PollUpdate = { _update: FXStateUpdate };

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

_.brandClass(FXTrigger, "FXTrigger");
_.brandClass(FXProxyTrigger, "FXProxyTrigger");
_.brandClass(FXScrollTrigger, "FXScrollTrigger");
_.brandClass(FXGestureTrigger, "FXGestureTrigger");
