/**
 * @module Modules
 */

import * as _ from "@lisn/_internal";

import { usageError } from "@lisn/globals/errors";

import { getDebouncedHandler } from "@lisn/utils/tasks";

import debug from "@lisn/debug/debug";

// [TODO v2]:
// - don't await unless return is actually a promise (i.e. don't enforce
//   callbacks being async)
// - isConcurrent true by default?
// - both wrap and Callback constructor to accept options: isConcurrent and
//   debounceWindow

/**
 * @typeParam Args See {@link Callback}
 *
 * @category Callback
 */
export type CallbackHandler<Args extends readonly unknown[] = []> = (
  ...args: Args
) => CallbackReturnType | Promise<CallbackReturnType>;

/**
 * @category Callback
 */
export type CallbackReturnType =
  | typeof Callback.KEEP
  | typeof Callback.REMOVE
  | void;

/**
 * The handler is invoked with one argument:
 *
 * - The {@link Callback} instance.
 *
 * @category Callback
 */
export type OnRemoveHandlerArgs = [Callback];
/**
 * @category Callback
 */
export type OnRemoveCallback = Callback<OnRemoveHandlerArgs>;
/**
 * @category Callback
 */
export type OnRemoveHandler =
  | OnRemoveCallback
  | CallbackHandler<OnRemoveHandlerArgs>;

/**
 * {@link Callback} wraps user-supplied callbacks. Supports
 * - removing a callback either when calling {@link remove} or if the user
 *   handler returns {@link Callback.REMOVE}
 * - calling custom {@link onRemove} hooks
 * - debouncing (via {@link wrap})
 * - awaiting on an asynchronous handler
 * - ensuring that the handler does not run concurrently to itself, i.e.
 *   subsequent {@link invoke}s will be queued; this can be disabled
 *
 * @typeParam Args The type of arguments that the callback expects.
 *
 * @category Callback
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
   * Returns true if the handler can run concurrently to itself, i.e. if
   * `isConcurrent = true` was passed to the constructor.
   *
   * @since v1.3.0
   */
  readonly isConcurrent: () => boolean;

  /**
   * Call the handler with the given arguments. It will await on the handler.
   *
   * If the handler is not {@link isConcurrent | concurrent}, then:
   * 1. It will be invoked asynchronously, and
   * 2. Calls will always wait for previous calls to this handler to complete
   *    first, i.e. it never runs concurrently to itself.
   *
   * Otherwise:
   * 1. The handler will be invoked synchronously (though invoke will still
   *    await on its return value) and
   * 2. Multiple calls to {@link invoke} will not be queued, but instead run
   *    concurrently.
   *
   * The returned promise is rejected in three cases:
   * - If the callback throws an error or returns a rejected Promise. The
   *   rejection reason will be the error.
   * - If the callback is removed _before you call {@link invoke}. The rejection
   *   reason will be a {@link Errors.LisnUsageError | LisnUsageError}.
   * - If the callback is removed _after_ you call {@link invoke} but before the
   *   handler is actually run (while it's waiting in the queue to be called).
   *   The rejection reason is {@link Callback.REMOVE}.
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
   *
   * It will also set up the returned wrapper callback so that it is removed
   * when the original (given) callback is removed. However, removing the
   * returned wrapper callback will _not_ cause the original callback (being
   * wrapped) to be removed. If you want to do this, then do
   * `wrapper.onRemove(original.remove)`.
   *
   * If the handler is {@link Callback.isConcurrent | isConcurrent}, so will the
   * wrapper be.
   *
   * Note that if the argument is a callback that's already debounced by a
   * _larger_ window, then `debounceWindow` will have no effect.
   *
   * @param debounceWindow If non-0, the callback will be called at most
   *                       every `debounceWindow` ms. The arguments it will
   *                       be called with will be the last arguments the
   *                       wrapper was called with.
   */
  static wrap<Args extends readonly unknown[] = []>(
    handlerOrCallback: CallbackHandler<Args> | Callback<Args>,
    debounceWindow = 0,
  ): Callback<Args> {
    const isFunction = _.isFunction(handlerOrCallback);
    let isConcurrent = false;
    let isRemovedFn = () => false;

    if (isFunction) {
      // check if it's an invoke method
      const callback = callablesMap.get(handlerOrCallback);
      if (callback) {
        return wrapCallback(callback);
      }
    } else {
      // it's a callback
      isRemovedFn = handlerOrCallback.isRemoved;
      isConcurrent = handlerOrCallback.isConcurrent();
    }

    const handler: CallbackHandler<Args> = isFunction
      ? handlerOrCallback
      : (...args: Args) => handlerOrCallback.invoke(...args);

    const wrapper = createCallback(
      getDebouncedHandler(debounceWindow, (...args: Args) => {
        if (!isRemovedFn()) {
          return handler(...args);
        }
      }),
      isConcurrent,
    );

    if (!isFunction) {
      handlerOrCallback.onRemove(wrapper.remove);
    }

    return wrapper;
  }

  /**
   * @param handler      The actual function to call. This should return one of
   *                     the known {@link CallbackReturnType} values.
   * @param isConcurrent See {@link invoke}.
   *
   * @since The `isConcurrent` option was added in v1.3.0
   */
  constructor(handler: CallbackHandler<Args>, isConcurrent = false) {
    const logger = debug
      ? new debug.Logger({ name: "Callback", logAtCreation: handler })
      : null;

    let isRemoved = false;
    const id = _.SYMBOL();

    const removeHandlers = _.createSet<OnRemoveHandler>();

    const executor = async (
      resolve: () => void,
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      reject: (reason?: any) => void,
      args: Args,
    ) => {
      let result;
      try {
        result = handler(...args);
        if (_.isInstanceOf(result, _.PROMISE)) {
          result = await result;
        }
      } catch (err) {
        reject(err);
      }

      if (result === Callback.REMOVE) {
        this.remove();
      }

      resolve();
    };

    // --------------------

    this.isConcurrent = () => isConcurrent;

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
      _.createPromise((resolve, reject) => {
        debug: logger?.debug8("Calling with", args);
        if (isRemoved) {
          reject(usageError("Callback has been removed"));
          return;
        }

        if (isConcurrent) {
          executor(resolve, reject, args);
        } else {
          CallbackScheduler._push(
            id,
            () => executor(resolve, reject, args),
            reject,
          );
        }
      });

    callablesMap.set(this.invoke, this);
  }
}

/**
 * {@link CallbackManager} stores handlers or callbacks and can invoke all of
 * them at once.
 *
 * @typeParam Args The type of arguments that the callback expects.
 *
 * @param [options.defaultIsConcurrent] If the handler is not a callback already,
 *                                      this sets its isConcurrent. Otherwise
 *                                      the wrapper will inherit the callback's
 *                                      setting.
 * @param [options.debounceWindow]      See {@link Callback.wrap}
 * @param [options.onRemove]            Will call the given handler when the
 *                                      callback is removed or deleted from the
 *                                      map.
 *
 * @category Callback
 *
 * @since v1.3.0
 */
export class CallbackManager<Args extends readonly unknown[] = []> {
  /**
   * Adds a new handler or callback to the manager.
   */
  readonly add: (
    handler: CallbackHandler<Args> | Callback<Args>,
    options?: {
      onRemove?: OnRemoveHandler;
      defaultIsConcurrent?: boolean;
      debounceWindow?: number;
    },
  ) => void;

  /**
   * Removes a previously added callback or handler.
   */
  readonly delete: (handler: CallbackHandler<Args> | Callback<Args>) => void;

  /**
   * Removes all callbacks or handlers added.
   */
  readonly clear: () => void;

  /**
   * Invokes all callbacks it holds with the given arguments.
   */
  readonly invoke: (...args: Args) => Promise<void>;

  /**
   * @param config Default options for {@link add}
   */
  constructor(config?: {
    onRemove?: OnRemoveHandler;
    defaultIsConcurrent?: boolean;
    debounceWindow?: number;
  }) {
    const callbacks = _.createMap<
      CallbackHandler<Args> | Callback<Args>,
      Callback<Args>
    >();

    this.add = (handler, options) => {
      const wrapped = addHandlerToMap(
        handler,
        callbacks,
        options?.defaultIsConcurrent ?? config?.defaultIsConcurrent,
        options?.debounceWindow ?? config?.debounceWindow,
      );

      const onRemove = options?.onRemove ?? config?.onRemove;
      if (onRemove) {
        wrapped.onRemove(onRemove);
      }
    };

    this.delete = (handler) => {
      _.remove(callbacks.get(handler));
    };

    this.clear = () => {
      for (const wrapped of callbacks.values()) {
        _.remove(wrapped);
      }
    };

    this.invoke = (...args) => invokeHandlers(callbacks, ...args);
  }
}

// ----------

/**
 * For minification optimization.
 *
 * @ignore
 * @internal
 *
 * @category Callback
 */
export const wrapCallback = Callback.wrap;

/**
 * For minification optimization.
 *
 * @ignore
 * @internal
 *
 * @category Callback
 */
export const createCallback = <Args extends readonly unknown[]>(
  handler: CallbackHandler<Args>,
  isConcurrent = false,
) => new Callback(handler, isConcurrent);

/**
 * For minification optimization.
 *
 * @ignore
 * @internal
 *
 * @category Callback
 */
export const createCallbackManager = <
  Args extends readonly unknown[],
>(config?: {
  onRemove?: OnRemoveHandler;
  defaultIsConcurrent?: boolean;
  debounceWindow?: number;
}) => new CallbackManager<Args>(config);

/**
 * Wraps the given handler as a callback, even if it's already a callback,
 * and adds it to the given map. The key is the original handler and the value
 * is the newly wrapped callback.
 *
 * It sets up an {@link Callback.onRemove | onRemove} handler to delete the
 * handler from the map when the callback is removed.
 *
 * @param defaultIsConcurrent If the handler is not a callback already, this
 *                            sets its isConcurrent. Otherwise the wrapper will
 *                            inherit the callback's setting.
 *
 * @ignore
 * @internal
 *
 * @category Callback
 */
export const addHandlerToMap = <Args extends readonly unknown[]>(
  handler: CallbackHandler<Args> | Callback<Args>,
  map: Map<CallbackHandler<Args> | Callback<Args>, Callback<Args>>,
  defaultIsConcurrent = false,
  debounceWindow = 0,
) => {
  let callback;
  if (_.isFunction(handler)) {
    callback = createCallback(handler, defaultIsConcurrent);
    if (debounceWindow) {
      callback = wrapCallback(callback, debounceWindow);
    }
  } else {
    callback = wrapCallback(handler, debounceWindow);
  }

  map.set(handler, callback);

  callback.onRemove(() => {
    _.deleteKey(map, handler);
  });

  return callback;
};

/**
 * Invokes the given handler with the given args.
 *
 * If it is a callback that has been removed, it skip it.
 *
 * It will also catch and ignore Callback.REMOVE rejection (which happens when
 * the callback is removed after calling invoke, but before the wrapped function
 * is called).
 *
 * @returns The return value of the handler.
 *
 * @ignore
 * @internal
 *
 * @category Callback
 */
export const invokeHandler = async <Args extends readonly unknown[]>(
  handler: CallbackHandler<Args> | Callback<Args>,
  ...args: Args
) => {
  let result = undefined;

  if (_.isFunction(handler)) {
    result = handler(...args);
  } else if (!handler.isRemoved()) {
    try {
      result = await handler.invoke(...args);
    } catch (err) {
      if (err !== Callback.REMOVE) {
        throw err;
      }
    }
  }

  return result;
};

/**
 * Invokes the handlers that are the values of the given map or set with the
 * given args.
 *
 * If any of them are callbacks that have been removed, it will skip calling it
 * and  will delete the entry from the map/set.
 *
 * They are called concurrently, but if any return a Promise, it will be
 * awaited upon.
 *
 * @ignore
 * @internal
 *
 * @category Callback
 */
export const invokeHandlers = async <Args extends readonly unknown[]>(
  mapOrSet:
    | Map<CallbackHandler<Args> | Callback<Args>, Callback<Args>>
    | Set<CallbackHandler<Args> | Callback<Args>>,
  ...args: Args
) => {
  const promises: unknown[] = [];
  for (const [key, handler] of mapOrSet.entries()) {
    if (!_.isFunction(handler) && handler.isRemoved()) {
      _.deleteKey(mapOrSet, key);
      continue;
    }

    promises.push(invokeHandler(handler, ...args));
  }

  await Promise.all(promises);
};

// ----------------------------------------

type CallbackSchedulerTask = () => Promise<void>;
type CallbackSchedulerQueueItem = {
  _task: CallbackSchedulerTask;
  _running: boolean;
  _reject: (reason: typeof Callback.REMOVE) => void;
};

type CallableCallback<Args extends readonly unknown[] = []> = (
  ...args: Args
) => void;

const callablesMap = _.createWeakMap<CallableCallback, Callback>();

const CallbackScheduler = (() => {
  const queues = _.createMap<symbol, CallbackSchedulerQueueItem[]>();

  const flush = async (queue: CallbackSchedulerQueueItem[]) => {
    // So that callbacks are always called asynchronously, await here before
    // calling 1st
    await null;
    while (_.lengthOf(queue)) {
      // shouldn't throw anything as Callback must catch errors
      queue[0]._running = true;
      await queue[0]._task();

      // only remove when task is done
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
            item._reject(Callback.REMOVE);
          }
        }

        _.deleteKey(queues, id);
      }
    },

    _push: (id: symbol, task: CallbackSchedulerTask, reject: () => void) => {
      let queue = queues.get(id);
      if (!queue) {
        queue = [];
        queues.set(id, queue);
      }

      queue.push({ _task: task, _reject: reject, _running: false });
      if (_.lengthOf(queue) === 1) {
        flush(queue);
      }
    },
  };
})();

_.brandClass(Callback, "Callback");
