/**
 * @module Effects/Triggers
 *
 * @since v1.3.0
 */

// XXX TODO support delay and offsets

import * as _ from "@lisn/_internal";

import { ScrollTarget } from "@lisn/globals/types";

import {
  CallbackHandler,
  Callback,
  addHandlerToMap,
  invokeHandlers,
} from "@lisn/modules/callback";

import { FXStateUpdate } from "@lisn/effects/effect";

import { ScrollWatcher, OnScrollHandler } from "@lisn/watchers/scroll-watcher";

// -------------------------------------------------------------------------
// -------------------- BUILT-IN TRIGGERS SINGLE EXPORT --------------------
// -------------------------------------------------------------------------

/**
 * Function wrappers around built-in triggers.
 */
export const FX_TRIGGER = {
  scroll: (scrollable?: ScrollTarget) => new FXScrollTrigger(scrollable),
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
 *
 * @param executor A function which accepts a `push` function. The executor
 *                 should call this function when it has new data to send to the
 *                 composer. It is also the responsibility for the executor to
 *                 set up an {@link onChange} handler and pause its data
 *                 collection when the trigger is paused.
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
   * Returns true if the trigger is active (not paused).
   */
  readonly isActive: () => boolean;

  /**
   * Pauses the trigger. It will not yield new data until resumed.
   */
  readonly pause: () => void;

  /**
   * Resumes the trigger.
   */
  readonly resume: () => void;

  /**
   * Calls the given handler whenever the trigger's {@link isActive | state}
   * changes.
   *
   * The handler is called after pausing or resuming the trigger, such that
   * calling {@link isActive} from the handler will reflect the latest state.
   */
  readonly onChange: (handler: FXTriggerHandler) => void;

  /**
   * Removes a previously added {@link onChange} handler.
   */
  readonly offChange: (handler: FXTriggerHandler) => void;

  constructor(executor: (push: (update: FXStateUpdate) => void) => void) {
    let isActive = true;

    const changeCallbacks = _.createMap<FXTriggerHandler, FXTriggerCallback>();
    const pollers = _.createSet<Poller>();

    // Save it in an object in order to allow pushing `null` and
    // distinguishing it from no pushing.
    let lastPush: PollUpdate | null = null;
    let pushedWhilePaused = false;

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
        invokeHandlers(changeCallbacks, activate, this);

        if (activate && pushedWhilePaused) {
          // wake up pollers with the last data pushed while paused
          updateState(lastPush);
        }
      }
    };

    // --------------------

    this.isActive = () => isActive;
    this.pause = () => setState(false);
    this.resume = () => setState(true);

    this.poll = async function* () {
      const poller = createPoller();
      pollers.add(poller);

      if (lastPush && isActive) {
        // there's been a push already
        yield _.deepCopy(lastPush._update);
      }

      try {
        while (true) {
          yield _.deepCopy(await poller._pull());
        }
      } finally {
        _.deleteKey(pollers, poller);
      }
    };

    this.onChange = (handler) => {
      addHandlerToMap(handler, changeCallbacks);
    };

    this.offChange = (handler) => {
      _.remove(changeCallbacks.get(handler));
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
 * - `true` if the trigger is now running, `false` if it's paused.
 * - The {@link FXTrigger} instance.
 */
export type FXTriggerHandlerArgs = [boolean, FXTrigger];
export type FXTriggerCallback = Callback<FXTriggerHandlerArgs>;
export type FXTriggerHandler =
  | FXTriggerCallback
  | CallbackHandler<FXTriggerHandlerArgs>;

// ------------------------------------------------------------------------
// -------------------------- BUILT-IN TRIGGERS ---------------------------
// ------------------------------------------------------------------------

// -------------------------------- SCROLL ---------------------------------

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
      if (this.isActive()) {
        scrollWatcher.trackScroll(
          scrollHandler,
          _.realtimeWatcherConf({
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
            min: 0,
            max: scrollData[_.S_SCROLL_WIDTH],
            target: scrollData[_.S_SCROLL_LEFT],
            snap: shouldSnap,
          },
          y: {
            min: 0,
            max: scrollData[_.S_SCROLL_HEIGHT],
            target: scrollData[_.S_SCROLL_TOP],
            snap: shouldSnap,
          },
        });
        shouldSnap = false;
      };
    };

    // --------------------

    super(executor);

    this.onChange(addOrRemoveWatcher);

    addOrRemoveWatcher();
  }
}

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
_.brandClass(FXScrollTrigger, "FXScrollTrigger");
