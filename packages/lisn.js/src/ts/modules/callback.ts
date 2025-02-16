/**
 * @module Modules/Callback
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { getDebouncedHandler } from "@lisn/utils/tasks";

import debug from "@lisn/debug/debug";

/**
 * @typeParam Args  See {@link Callback}
 */
export type CallbackHandler<Args extends unknown[] = []> = (
  ...args: Args
) => CallbackReturnType | Promise<CallbackReturnType>;

export type CallbackReturnType =
  | typeof Callback.KEEP
  | typeof Callback.REMOVE
  | void;

/**
 * For minification optimization. Exposed through Callback.wrap.
 *
 * @ignore
 * @internal
 */
export const wrapCallback = <Args extends unknown[] = []>(
  handlerOrCallback: CallbackHandler<Args> | Callback<Args>,
  debounceWindow = 0,
): Callback<Args> => {
  const isFunction = MH.isFunction(handlerOrCallback);
  let isRemoved = () => false;

  if (isFunction) {
    // check if it's an invoke method
    const callback = callablesMap.get(handlerOrCallback);
    if (callback) {
      return wrapCallback(callback);
    }
  } else {
    isRemoved = handlerOrCallback.isRemoved;
  }

  const handler: CallbackHandler<Args> = isFunction
    ? handlerOrCallback
    : (...args: Args) => handlerOrCallback.invoke(...args);

  const wrapper = new Callback<Args>(
    getDebouncedHandler(debounceWindow, (...args: Args) => {
      if (!isRemoved()) {
        return handler(...args);
      }
    }),
  );

  if (!isFunction) {
    handlerOrCallback.onRemove(wrapper.remove);
  }

  return wrapper;
};

/**
 * {@link Callback} wraps user-supplied callbacks. Supports
 * - removing a callback either when calling {@link remove} or if the user
 *   handler returns {@link Callback.REMOVE}
 * - calling custom {@link onRemove} hooks
 * - debouncing (via {@link wrap})
 * - awaiting on an asynchronous handler and ensuring that the handler does not
 *  run concurrently to itself, i.e. subsequent {@link invoke}s will be queued
 *
 * @typeParam Args  The type of arguments that the callback expects.
 */
export class Callback<Args extends unknown[] = []> {
  /**
   * Possible return value for the handler.
   *
   * Do not do anything. Same as not retuning anything from the function.
   */
  static readonly KEEP: unique symbol = MC.SYMBOL(
    "KEEP",
  ) as typeof Callback.KEEP;

  /**
   * Possible return value for the handler.
   *
   * Will remove this callback.
   */
  static readonly REMOVE: unique symbol = MC.SYMBOL(
    "REMOVE",
  ) as typeof Callback.REMOVE;

  /**
   * Call the handler with the given arguments.
   *
   * If the handler is asynchronous, it awaits on it. Furthermore, calls will
   * always wait for previous calls to this handler to complete first, i.e. it
   * never runs concurrently to itself. If you need multiple calls to the async
   * handler to run concurrently, then wrap it in a non-async function that
   * does not await it.
   *
   * The returned promise is rejected in two cases:
   * - If the callback throws an error or returns a rejected Promise.
   * - If the callback is removed _after_ you call {@link invoke} but before the
   *   handler is actually called (while it's waiting in the queue to be called)
   *   In this case, the rejection reason is {@link Callback.REMOVE}.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the callback is already removed.
   */
  readonly invoke: (...args: Args) => Promise<void>;

  /**
   * Mark the callback as removed and call the registered {@link onRemove} hooks.
   *
   * Future attempts to call it will result in
   * {@link Errors.LisnUsageError | LisnUsageError}.
   */
  readonly remove: () => void;

  /**
   * Returns true if the callback has been removed and cannot be called again.
   */
  readonly isRemoved: () => boolean;

  /**
   * Registers the given function to be called when the callback is removed.
   *
   * You can call {@link onRemove} multiple times to register multiple hooks.
   */
  readonly onRemove: (fn: () => void) => void;

  /**
   * Wraps the given handler or callback as a callback, optionally debounced by
   * the given debounce window.
   *
   * If the argument is already a callback _or an invoke method of a callback_,
   * then the wrapper will call that callback and return the same value as it.
   * It will also set up the returned wrapper callback so that it is removed
   * when the original (given) callback is removed. However, removing the
   * returned wrapper callback will _not_ cause the original callback (being
   * wrapped) to be removed. If you want to do this, then do
   * `wrapper.onRemove(wrapped.remove)`.
   *
   * Note that if the argument is a callback that's already debounced by a
   * _larger_ window, then `debounceWindow` will have no effect.
   *
   * @param {} debounceWindow  If non-0, the callback will be called at most
   *                           every `debounceWindow` ms. The arguments it will
   *                           be called with will be the last arguments the
   *                           wrapper was called with.
   */
  static readonly wrap = wrapCallback;

  /**
   * @param {} handler     The actual function to call. This should return one of
   *                       the known {@link CallbackReturnType} values.
   */
  constructor(handler: CallbackHandler<Args>) {
    const logger = debug
      ? new debug.Logger({ name: "Callback", logAtCreation: handler })
      : null;

    let isRemoved = false;
    const id = MC.SYMBOL();

    const onRemove = MH.newSet<() => void>();

    this.isRemoved = () => isRemoved;

    this.remove = () => {
      debug: logger?.debug8("Removing");
      if (!isRemoved) {
        isRemoved = true;

        for (const rmFn of onRemove) {
          rmFn();
        }

        CallbackScheduler._clear(id);
      }
    };

    this.onRemove = (fn) => onRemove.add(fn);

    this.invoke = (...args) =>
      MH.newPromise((resolve, reject) => {
        debug: logger?.debug8("Calling with", args);
        if (isRemoved) {
          reject(MH.usageError("Callback has been removed"));
          return;
        }

        CallbackScheduler._push(
          id,
          async () => {
            let result;
            try {
              result = await handler(...args);
            } catch (err) {
              reject(err);
            }

            if (result === Callback.REMOVE) {
              this.remove();
            }

            resolve();
          },
          reject,
        );
      });

    callablesMap.set(this.invoke, this);
  }
}

// ----------------------------------------

type CallbackSchedulerTask = () => Promise<void>;
type CallbackSchedulerQueueItem = {
  _task: CallbackSchedulerTask;
  _running: boolean;
  _onRemove: (reason: typeof Callback.REMOVE) => void;
};

type CallableCallback<Args extends unknown[] = []> = (...args: Args) => void;

const callablesMap = MH.newWeakMap<CallableCallback, Callback>();

const CallbackScheduler = (() => {
  const queues = MH.newMap<symbol, CallbackSchedulerQueueItem[]>();

  const flush = async (queue: CallbackSchedulerQueueItem[]) => {
    // So that callbacks are always called asynchronously for consistency,
    // await here before calling 1st
    await null;
    while (MH.lengthOf(queue)) {
      // shouldn't throw anything as Callback must catch errors
      queue[0]._running = true;
      await queue[0]._task();

      // only remove when done
      queue.shift();
    }
  };

  return {
    _clear: (id: symbol) => {
      const queue = queues.get(id);
      if (queue) {
        let item: CallbackSchedulerQueueItem | undefined;
        while ((item = queue.shift())) {
          if (!item._running) {
            item._onRemove(Callback.REMOVE);
          }
        }

        MH.deleteKey(queues, id);
      }
    },

    _push: (id: symbol, task: CallbackSchedulerTask, onRemove: () => void) => {
      let queue = queues.get(id);
      if (!queue) {
        queue = [];
        queues.set(id, queue);
      }

      queue.push({ _task: task, _onRemove: onRemove, _running: false });
      if (MH.lengthOf(queue) === 1) {
        flush(queue);
      }
    },
  };
})();
