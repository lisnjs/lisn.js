/**
 * @module Modules/Callback
 */

import * as _ from "@lisn/_internal";

import { usageError } from "@lisn/globals/errors";

import { getDebouncedHandler } from "@lisn/utils/tasks";

import debug from "@lisn/debug/debug";

/**
 * @typeParam Args See {@link Callback}
 */
export type CallbackHandler<Args extends readonly unknown[] = []> = (
  ...args: Args
) => CallbackReturnType | Promise<CallbackReturnType>;

export type CallbackReturnType =
  | typeof Callback.KEEP
  | typeof Callback.REMOVE
  | void;

/**
 * The handler is invoked with one argument:
 *
 * - The {@link Callback} instance.
 */
export type OnRemoveHandlerArgs = [Callback];
export type OnRemoveCallback = Callback<OnRemoveHandlerArgs>;
export type OnRemoveHandler =
  | OnRemoveCallback
  | CallbackHandler<OnRemoveHandlerArgs>;

/**
 * For minification optimization. Exposed through Callback.wrap.
 *
 * @ignore
 * @internal
 */
export const wrapCallback = <Args extends readonly unknown[] = []>(
  handlerOrCallback: CallbackHandler<Args> | Callback<Args>,
  debounceWindow = 0,
): Callback<Args> => {
  const isFunction = _.isFunction(handlerOrCallback);
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
 * @typeParam Args The type of arguments that the callback expects.
 */
export class Callback<Args extends readonly unknown[] = []> {
  /**
   * Possible return value for the handler.
   *
   * Do not do anything. Same as not retuning anything from the function.
   */
  static readonly KEEP: unique symbol = _.SYMBOL(
    "KEEP",
  ) as typeof Callback.KEEP;

  /**
   * Possible return value for the handler.
   *
   * Will remove this callback.
   */
  static readonly REMOVE: unique symbol = _.SYMBOL(
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
  readonly remove: () => typeof Callback.REMOVE;

  /**
   * Returns true if the callback has been removed and cannot be called again.
   */
  readonly isRemoved: () => boolean;

  /**
   * Calls the given handler when the callback is removed.
   *
   * The handler will be passed one argument: the current callback that's been
   * removed.
   *
   * The handler is called after marking the callback as removed, such that
   * calling {@link isRemoved} from the handler will return `true`.
   */
  readonly onRemove: (handler: OnRemoveHandler) => void;

  /**
   * Removes a previously added {@link onRemove} handler.
   *
   * @since v1.3.0
   */
  readonly offRemove: (handler: OnRemoveHandler) => void;

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
   * `wrapper.onRemove(original.remove)`.
   *
   * Note that if the argument is a callback that's already debounced by a
   * _larger_ window, then `debounceWindow` will have no effect.
   *
   * @param debounceWindow If non-0, the callback will be called at most
   *                       every `debounceWindow` ms. The arguments it will
   *                       be called with will be the last arguments the
   *                       wrapper was called with.
   */
  static readonly wrap = wrapCallback;

  /**
   * @param handler The actual function to call. This should return one of
   *                the known {@link CallbackReturnType} values.
   */
  constructor(handler: CallbackHandler<Args>) {
    const logger = debug
      ? new debug.Logger({ name: "Callback", logAtCreation: handler })
      : null;

    let isRemoved = false;
    const id = _.SYMBOL();

    const removeHandlers = _.newSet<OnRemoveHandler>();

    this.isRemoved = () => isRemoved;

    this.remove = () => {
      if (!isRemoved) {
        debug: logger?.debug8("Removing");
        isRemoved = true;

        invokeHandlers(removeHandlers, this);

        removeHandlers.clear();
        CallbackScheduler._clear(id);
      }

      return Callback.REMOVE;
    };

    this.onRemove = (handler) => {
      removeHandlers.add(handler);
      if (_.isInstanceOf(handler, Callback)) {
        handler.onRemove(() => {
          _.deleteKey(removeHandlers, handler);
        });
      }
    };

    this.offRemove = (handler) => {
      _.deleteKey(removeHandlers, handler);
    };

    this.invoke = (...args) =>
      _.newPromise((resolve, reject) => {
        debug: logger?.debug8("Calling with", args);
        if (isRemoved) {
          reject(usageError("Callback has been removed"));
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

// ----------

/**
 * Invokes the given callbacks or handlers with the given args.
 *
 * They are invoked concurrently, but if any return a Promise, it will be
 * awaited upon.
 *
 * @ignore
 * @internal
 */
export const invokeHandlers = async <
  T extends CallbackHandler<Args> | Callback<Args>,
  Args extends readonly unknown[],
>(
  set: Iterable<T>,
  ...args: Args
) => {
  const promises: unknown[] = [];
  for (const handler of set) {
    if (_.isInstanceOf(handler, Callback)) {
      promises.push(handler.invoke(...args));
    } else if (_.isFunction(handler)) {
      // TypeScript can't figure it out that it's a function otherwise
      promises.push(handler(...args));
    }
  }

  await Promise.all(promises);
};

export function addNewCallbackToMap<
  Args extends readonly unknown[],
  Handler extends CallbackHandler<Args> | Callback<Args>,
  Data extends unknown[],
>(
  map: Map<Handler, [Callback<Args>, ...Data]>,
  handler: Handler,
  data: Data,
): Callback<Args>;

export function addNewCallbackToMap<
  Args extends readonly unknown[],
  Handler extends CallbackHandler<Args> | Callback<Args>,
  Data,
>(
  map: Map<Handler, [Callback<Args>, Data]>,
  handler: Handler,
  data: Data,
): Callback<Args>;

export function addNewCallbackToMap<
  Args extends readonly unknown[],
  Handler extends CallbackHandler<Args> | Callback<Args>,
>(map: Map<Handler, Callback<Args>>, handler: Handler): Callback<Args>;

/**
 * **Wraps** the given handler as a new callback and adds it to the given map.
 *
 * It also sets up an {@link Callback.onRemove | `onRemove`} handler on the
 * wrapper so that whenever it, or the original handler, are removed, the entry
 * is deleted from the map. Therefore, to remove the callback from the map you
 * can either just delete the key (handler), or call
 * {@link Callback.remove | `remove`} on the wrapper (which will not affect the
 * original handler, if it was a callback.
 *
 * The key in the map will be the original handler and the value:
 * - if `data` is `null` or `undefined`, the value set will be the newly wrapped
 *   callback.
 * - if `data` is an array, the value set will be an array with the newly
 *   wrapped callback prepended at the start
 * - otherwise, the value set will be a tuple of `[callback, data]`
 *
 * @ignore
 * @internal
 */
export function addNewCallbackToMap(
  map: Map<CallbackHandler<unknown[]> | Callback<unknown[]>, unknown>,
  handler: CallbackHandler<unknown[]> | Callback<unknown[]>,
  data?: unknown,
) {
  const callback = wrapCallback(handler);
  let value: unknown = callback;

  if (_.isArray(data)) {
    value = [callback, ...data];
  } else if (!_.isNullish(data)) {
    value = [callback, data];
  }

  map.set(handler, value);
  callback.onRemove(() => {
    _.deleteKey(map, handler);
  });

  return callback;
}

// ----------------------------------------

type CallbackSchedulerTask = () => Promise<void>;
type CallbackSchedulerQueueItem = {
  _task: CallbackSchedulerTask;
  _running: boolean;
  _onRemove: (reason: typeof Callback.REMOVE) => void;
};

type CallableCallback<Args extends readonly unknown[] = []> = (
  ...args: Args
) => void;

const callablesMap = _.newWeakMap<CallableCallback, Callback>();

const CallbackScheduler = (() => {
  const queues = _.newMap<symbol, CallbackSchedulerQueueItem[]>();

  const flush = async (queue: CallbackSchedulerQueueItem[]) => {
    // So that callbacks are always called asynchronously for consistency,
    // await here before calling 1st
    await null;
    while (_.lengthOf(queue)) {
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

        _.deleteKey(queues, id);
      }
    },

    _push: (id: symbol, task: CallbackSchedulerTask, onRemove: () => void) => {
      let queue = queues.get(id);
      if (!queue) {
        queue = [];
        queues.set(id, queue);
      }

      queue.push({ _task: task, _onRemove: onRemove, _running: false });
      if (_.lengthOf(queue) === 1) {
        flush(queue);
      }
    },
  };
})();

_.brandClass(Callback, "Callback");
