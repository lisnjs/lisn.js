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
  addNewCallbackToMap,
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
 * This is a generic class that accepts a custom executor function. You want to
 * subclass it when defining your own trigger types.
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
   */
  readonly poll: () => AsyncGenerator<FXStateUpdate, never, undefined>;

  /**
   * Returns true if the trigger is active (not paused).
   */
  readonly isActive: () => boolean;

  /**
   * Pauses data collection.
   */
  readonly pause: () => void;

  /**
   * Resumes data collection
   */
  readonly resume: () => void;

  /**
   * Calls the given handler whenever the trigger's state changes.
   *
   * The handler is called after updating the state, such that calling
   * {@link isActive} from the handler will reflect the latest state.
   */
  readonly onChange: (handler: FXTriggerHandler) => void;

  /**
   * Removes a previously added {@link onChange} handler.
   */
  readonly offChange: (handler: FXTriggerHandler) => void;

  constructor(executor: (push: (update: FXStateUpdate) => void) => void) {
    let isActive = true;

    const changeCallbacks = _.createMap<FXTriggerHandler, FXTriggerCallback>();

    let resolve: (update: FXStateUpdate) => void;
    const nextPromise = () =>
      _.createPromise<FXStateUpdate>((r) => (resolve = r));

    const push = (update: FXStateUpdate) => resolve(update);

    const setState = (activate: boolean) => {
      isActive = activate;
      invokeHandlers(changeCallbacks.values(), activate, this);
    };

    // --------------------

    this.isActive = () => isActive;
    this.pause = () => setState(false);
    this.resume = () => setState(true);

    this.poll = async function* () {
      while (true) {
        const data = await nextPromise();
        if (isActive) {
          yield data;
        }
      }
    };

    this.onChange = (handler) => {
      addNewCallbackToMap(changeCallbacks, handler);
    };

    this.offChange = (handler) => {
      _.remove(changeCallbacks.get(handler));
    };

    // --------------------

    executor.call(this, push);
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
    const scrollWatcher = ScrollWatcher.reuse({ [_.S_DEBOUNCE_WINDOW]: 0 });
    let scrollHandler: OnScrollHandler;
    let shouldSnap = true;

    const addOrRemoveWatcher = () => {
      shouldSnap = true;
      if (this.isActive()) {
        scrollWatcher.trackScroll(scrollHandler, { scrollable });
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

_.brandClass(FXTrigger, "FXTrigger");
_.brandClass(FXScrollTrigger, "FXScrollTrigger");
