/**
 * @module Modules
 */

import * as _ from "@lisn/_internal";

import { bugError, usageError } from "@lisn/globals/errors";

import { getDebouncedHandler } from "@lisn/utils/tasks";

import debug from "@lisn/debug/debug";
import { LoggerInterface } from "@lisn/debug/types";

// [TODO v2]:
// - don't await unless return is actually a promise (i.e. don't enforce
//   callbacks being async)
// - concurrent true by default?

/**
 * @typeParam Args See {@link Callback}
 * @typeParam Ret  See {@link Callback}
 *
 * @since v1.3.0 The handler's return value is captured and returned by
 * {@link Callback.invoke}.
 *
 * @category Callback
 */
export type CallbackHandler<
  Args extends readonly unknown[] = unknown[],
  Ret = void,
> = (...args: Args) => Ret | Promise<Ret>;

/**
 * The handler is invoked with two arguments:
 *
 * - The reason for removal.
 * - The {@link Callback} instance.
 *
 * @category Callback
 *
 * @since Arguments are passed since v1.3.0. Previously no arguments were passed
 * to the `onRemove` handler.
 */
export type OnRemoveHandlerArgs<
  Args extends readonly unknown[] = unknown[],
  Ret = void,
> = [RemoveReason, Callback<Args, Ret>];
/**
 * @category Callback
 */
export type OnRemoveCallback<
  Args extends readonly unknown[] = unknown[],
  Ret = void,
> = Callback<OnRemoveHandlerArgs<Args, Ret>, unknown>;
/**
 * @category Callback
 */
export type OnRemoveHandler<
  Args extends readonly unknown[] = unknown[],
  Ret = void,
> =
  | OnRemoveCallback<Args, Ret>
  | CallbackHandler<OnRemoveHandlerArgs<Args, Ret>, unknown>;

/**
 * @category Callback
 *
 * @since v1.3.0
 */
export type RemoveReason =
  | typeof Callback.REMOVE_REASON_USER
  | typeof Callback.REMOVE_REASON_RETURN;

/**
 * @category Callback
 *
 * @since v1.3.0
 */
export type CallbackConfig = {
  /**
   * See {@link Callback.invoke}.
   */
  concurrent?: boolean;

  /**
   * See {@link Callback.invoke}.
   */
  debounceWindow?: number;

  /**
   * The logger to user for debug logging.
   */
  logger?: LoggerInterface;
};

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
 * @typeParam Ret  The return type of the handler (not including the special
 *                 values {@link Callback.KEEP} and {@link Callback.REMOVE}.
 *
 * @category Callback
 */
export class Callback<Args extends readonly unknown[] = unknown[], Ret = void> {
  /**
   * If the handler returns this value, it's ignored. Same as retuning
   * `undefined` from the handler.
   */
  static readonly KEEP: unique symbol = _.SYMBOL(
    "KEEP",
  ) as typeof Callback.KEEP;

  /**
   * If the handler returns this value, the callback will be removed.
   */
  static readonly REMOVE: unique symbol = _.SYMBOL(
    "REMOVE",
  ) as typeof Callback.REMOVE;

  /**
   * Indicates the callback was removed because its remove method was called.
   *
   * @since v1.3.0
   */
  static readonly REMOVE_REASON_USER: unique symbol = _.SYMBOL(
    "USER",
  ) as typeof Callback.REMOVE_REASON_USER;

  /**
   * Indicates the callback was removed because the handler returned
   * {@link Callback.REMOVE}.
   *
   * @since v1.3.0
   */
  static readonly REMOVE_REASON_RETURN: unique symbol = _.SYMBOL(
    "RETURN",
  ) as typeof Callback.REMOVE_REASON_RETURN;

  /**
   * Returns true if the handler can run concurrently to itself, i.e. if
   * `current: true` was passed to the constructor.
   *
   * See {@link invoke}
   *
   * @since v1.3.0
   */
  readonly isConcurrent: () => boolean;

  /**
   * Returns the callback's debounce window.
   *
   * @since v1.3.0
   */
  readonly getDebounceWindow: () => number;

  /**
   * Call the handler with the given arguments. It will await on the handler.
   *
   * The returned promise resolves to the return value from the handler (since
   * v1.3.0)
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
   * If the callback is debounced, i.e. if `debounceWindow` larger than 0 was
   * passed to the constructor, the callback will be called at most every
   * `debounceWindow` ms. The arguments it will be called with will be the last
   * arguments the callback was called with. Furthermore, sequential calls to
   * {@link invoke} will all resolve with the same return value the handler
   * eventually returned when called after the debounce window.
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
   *
   * @since Since v1.3.0, the returned promise resolves to the return value from
   * the handler. Previously it always resolved with `undefined`.
   */
  readonly invoke: (...args: Args) => Promise<Ret>;

  /**
   * Mark the callback as removed and call the registered {@link onRemove} hooks.
   *
   * Future attempts to call it will result in
   * {@link Errors.LisnUsageError | LisnUsageError}.
   *
   * @since Reason is accepted since v1.3.0
   */
  readonly remove: (reason?: RemoveReason) => typeof Callback.REMOVE;

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
  readonly onRemove: (handler: OnRemoveHandler<Args, Ret>) => void;

  /**
   * Removes a previously added {@link onRemove} handler.
   *
   * @since v1.3.0
   */
  readonly offRemove: (handler: OnRemoveHandler<Args, Ret>) => void;

  /**
   * Wraps the given handler or callback as a callback, optionally debounced by
   * the given debounce window.
   *
   * ## Wrapping existing callbacks
   *
   * If the argument is already a callback _or an invoke method of a callback_,
   * then the wrapper will call that callback's handler and return the same
   * value as it.
   *
   * It will also set up the returned wrapper callback so that it is removed
   * when the original (given) callback is removed.
   *
   * If the handler returns {@link Callback.REMOVE}, then both the wrapper and
   * original callback will be removed.
   * However, removing the returned wrapper callback manually (by calling its
   * {@link remove} method) will _not_ cause the original callback to be
   * removed. If you want to do this, then do
   * `wrapper.onRemove(original.remove)`.
   *
   * @param config See {@link CallbackConfig}.
   *               If the handler is already a callback and
   *               {@link Callback.isConcurrent | is concurrent}, so will the
   *               wrapper be. And if the handler is already a callback that's
   *               debounced by a _larger_ window, then `debounceWindow` will
   *               have no effect. For backwards compatibility, if config is a
   *               plain number, it is treated as `config.debounceWindow`.
   *
   * @since Support for `config` was added in v1.3.0. Previously the second
   * argument was a number specifying the debounce window. This signature is
   * still supported.
   *
   */
  static wrap<Args extends readonly unknown[] = unknown[], Ret = void>(
    handlerOrCallback: CallbackHandler<Args, Ret> | Callback<Args, Ret>,
    config?: CallbackConfig | number,
  ): Callback<Args, Ret> {
    const isFunction = _.isFunction(handlerOrCallback);

    let debounceWindow = 0;
    let concurrent = false;
    let logger: LoggerInterface | undefined = void 0;
    if (_.isObject(config)) {
      ({ concurrent = false, debounceWindow = 0, logger } = config);
    } else if (_.isNumber(config)) {
      debounceWindow = config;
    }

    let handler: CallbackHandler<Args, Ret>;
    if (isFunction) {
      // check if it's an invoke method
      const callback = invokersMap.get<Args, Ret>(handlerOrCallback);
      if (callback) {
        return wrapCallback(callback, config);
      }

      handler = handlerOrCallback;
    } else {
      // it's a callback
      concurrent = handlerOrCallback.isConcurrent();
      // Technically, we don't need to modify debounceWindow, or we could even
      // set it to 0 if the callback's debounce window is larger than the given,
      // but so that the wrapper's getDebounceWindow returns the effective
      // window, we set it to the larger of the two.
      debounceWindow = _.max(
        debounceWindow,
        handlerOrCallback.getDebounceWindow(),
      );

      handler = getHandlerFor(handlerOrCallback);
    }

    const wrapper = createCallback(handler, {
      debounceWindow,
      concurrent,
      logger,
    });

    if (!isFunction) {
      handlerOrCallback.onRemove(wrapper.remove);
      wrapper.onRemove((reason) => {
        if (reason === Callback.REMOVE_REASON_RETURN) {
          handlerOrCallback.remove(reason);
        }
      });
    }

    return wrapper;
  }

  /**
   * @param handler The function to call when the callback is
   *                {@link invoke | invoked}.
   *
   * @since Since v1.3.0, `config` is accepted and the handler's return value
   * is captured and returned by {@link invoke}.
   */
  constructor(handler: CallbackHandler<Args, Ret>, config?: CallbackConfig) {
    const logger =
      config?.logger ??
      (debug
        ? debug.Logger.getLoggerFor(this, {
            logAtCreation: { handler, config },
          })
        : null);

    const concurrent = config?.concurrent ?? false;
    const debounceWindow = _.max(0, config?.debounceWindow ?? 0);

    let isRemoved = false;
    const id = _.SYMBOL();

    const removeHandlers = _.createSet<OnRemoveHandler<Args, Ret>>();
    const invokeQueue = createInvokeQueue<Ret>();

    // ----------

    const scheduleCall = (args: Args) => {
      const queue = invokeQueue.offload(); // copy and clear original

      if (concurrent) {
        callHandler(queue, args);
      } else {
        CallbackScheduler._push(
          id,
          () => callHandler(queue, args),
          queue.reject,
        );
      }
    };

    const callHandler = async (queue: InvokeQueue<Ret>, args: Args) => {
      debug: logger?.debug8("Calling with", args);
      try {
        let result = handler(...args);
        if (_.isInstanceOf(result, _.PROMISE)) {
          result = await result;
        }

        if (result === Callback.REMOVE) {
          this.remove(Callback.REMOVE_REASON_RETURN);
        }

        queue.resolve(result);
      } catch (err) {
        queue.reject(err);
      }
    };

    // ----------

    let invokeWrapper: (args: Args) => void;

    if (debounceWindow > 0) {
      invokeWrapper = getDebouncedHandler(debounceWindow, (args: Args) => {
        if (isRemoved) {
          invokeQueue.reject(Callback.REMOVE);
        } else {
          scheduleCall(args);
        }
      });
    } else {
      invokeWrapper = scheduleCall;
    }

    // --------------------

    this.isConcurrent = () => concurrent;

    this.getDebounceWindow = () => debounceWindow;

    this.isRemoved = () => isRemoved;

    this.remove = (reason: RemoveReason = Callback.REMOVE_REASON_USER) => {
      if (!isRemoved) {
        debug: logger?.debug8("Removing");
        isRemoved = true;

        CallbackScheduler._clear(id);
        invokeHandlers(removeHandlers, reason, this).then(() => {
          removeHandlers.clear();
        });
      }

      return Callback.REMOVE;
    };

    this.onRemove = (rHandler) => {
      debug: logger?.debug8("Adding onRemove handler");
      removeHandlers.add(rHandler);
      if (_.isInstanceOf(rHandler, Callback)) {
        rHandler.onRemove(() => {
          _.deleteKey(removeHandlers, rHandler);
        });
      }
    };

    this.offRemove = (rHandler) => {
      _.deleteKey(removeHandlers, rHandler);
    };

    this.invoke = (...args) =>
      _.createPromise<Ret>((resolve, reject) => {
        if (isRemoved) {
          reject(usageError("Callback has been removed"));
        } else {
          debug: logger?.debug8("Scheduling with", args);

          invokeQueue.add(resolve, reject);
          invokeWrapper(args);
        }
      });

    invokersMap.set(this.invoke, this);
    handlersMap.set(this, handler);
  }
}

// ------------------------------

/**
 * @category Callback
 *
 * @interface
 *
 * @since v1.3.0
 */
export type CallbackManagerConfig<Args extends readonly unknown[] = unknown[]> =
  {
    onRemove?: OnRemoveHandler<Args>;
  } & CallbackConfig;

/**
 * {@link CallbackManager} stores handlers or callbacks and can invoke all of
 * them at once.
 *
 * @typeParam Args The type of arguments that the callback expects.
 *
 * @param [config.concurrent]     See {@link Callback.wrap}
 *                                this sets its `concurrent`. Otherwise the
 *                                wrapper will inherit the callback's setting.
 * @param [config.debounceWindow] See {@link Callback.wrap}
 * @param [config.onRemove]       Will call the given handler when the
 *                                callback is removed or deleted from the map.
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
    config?: CallbackManagerConfig<Args>,
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
   * Returns true if there are no callbacks in the manager.
   */
  readonly isEmpty: () => boolean;

  /**
   * @param defaultConfig Default config for {@link add}
   */
  constructor(defaultConfig?: CallbackManagerConfig<Args>) {
    const callbacks = _.createMap<
      CallbackHandler<Args> | Callback<Args>,
      Callback<Args>
    >();

    this.add = (handler, config) => {
      const wrapped = addHandlerToMap(handler, callbacks, {
        concurrent: config?.concurrent ?? defaultConfig?.concurrent,
        debounceWindow: config?.debounceWindow ?? defaultConfig?.debounceWindow,
        logger: config?.logger ?? defaultConfig?.logger,
      });

      const onRemove = config?.onRemove ?? defaultConfig?.onRemove;
      if (onRemove) {
        wrapped.onRemove(onRemove);
      }
    };

    this.delete = (handler) => {
      callbacks.get(handler)?.remove();
    };

    this.clear = () => {
      for (const wrapped of callbacks.values()) {
        wrapped.remove();
      }
    };

    this.invoke = (...args) => invokeHandlers(callbacks, ...args);

    this.isEmpty = () => !_.sizeOf(callbacks);
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
export const createCallback = <Args extends readonly unknown[], Ret = void>(
  handler: CallbackHandler<Args, Ret>,
  config?: CallbackConfig,
) => new Callback(handler, config);

/**
 * For minification optimization.
 *
 * @ignore
 * @internal
 *
 * @category Callback
 */
export const createConcurrentCallback = <
  Args extends readonly unknown[],
  Ret = void,
>(
  handler: CallbackHandler<Args, Ret>,
  config?: CallbackConfig,
) => createCallback(handler, _.merge(config, { concurrent: true }));

/**
 * For minification optimization.
 *
 * @ignore
 * @internal
 *
 * @category Callback
 */
export const createCallbackManager = <Args extends readonly unknown[]>(
  defaultConfig?: CallbackManagerConfig<Args>,
) => new CallbackManager<Args>(defaultConfig);

/**
 * Wraps the given handler as a callback, even if it's already a callback,
 * and adds it to the given map. The key is the original handler and the value
 * is the newly wrapped callback.
 *
 * It sets up an {@link Callback.onRemove | onRemove} handler to delete the
 * handler from the map when the callback is removed.
 *
 * @ignore
 * @internal
 *
 * @category Callback
 */
export const addHandlerToMap = <Args extends readonly unknown[], Ret>(
  handler: CallbackHandler<Args, Ret> | Callback<Args, Ret>,
  map: Map<
    CallbackHandler<Args, Ret> | Callback<Args, Ret>,
    Callback<Args, Ret>
  >,
  config?: CallbackConfig,
) => {
  const callback = wrapCallback(handler, config);
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
export const invokeHandler = async <Args extends readonly unknown[], Ret>(
  handler: CallbackHandler<Args, Ret> | Callback<Args, Ret>,
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
export const invokeHandlers = async <Args extends readonly unknown[], Ret>(
  mapOrSet:
    | Map<CallbackHandler<Args, Ret> | Callback<Args, Ret>, Callback<Args, Ret>>
    | Set<CallbackHandler<Args, Ret> | Callback<Args, Ret>>,
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

type CallbackInvoker<Args extends readonly unknown[], Ret> = (
  ...args: Args
) => Promise<Ret>;

interface InvokersMap {
  get<Args extends readonly unknown[], Ret>(
    invoker: CallbackInvoker<Args, Ret> | CallbackHandler<Args, Ret>,
  ): Callback<Args, Ret> | undefined;
  set<Args extends readonly unknown[], Ret>(
    invoker: CallbackInvoker<Args, Ret>,
    callback: Callback<Args, Ret>,
  ): this;
}

interface HandlersMap {
  get<Args extends readonly unknown[], Ret>(
    callback: Callback<Args, Ret>,
  ): CallbackHandler<Args, Ret> | undefined;
  set<Args extends readonly unknown[], Ret>(
    callback: Callback<Args, Ret>,
    handler: CallbackHandler<Args, Ret>,
  ): this;
}

const invokersMap = _.createWeakMap() as InvokersMap;
const handlersMap = _.createWeakMap() as HandlersMap;

const getHandlerFor = <Args extends readonly unknown[], Ret>(
  callback: Callback<Args, Ret>,
) => {
  const handler = handlersMap.get(callback);
  if (!handler) {
    throw bugError("No handler saved for callback");
  }
  return handler;
};

// --------------------

type ResolveFn<Ret> = (ret: Ret) => void;
type RejectFn = (reason: unknown) => void;
type InvokeQueue<Ret> = {
  add: (resolve: ResolveFn<Ret>, reject: RejectFn) => void;
  resolve: ResolveFn<Ret>;
  reject: RejectFn;
  offload: () => InvokeQueue<Ret>;
};

const createInvokeQueue = <Ret>() => _createInvokeQueue<Ret>([]);

const _createInvokeQueue = <Ret>(
  queue: Array<{ resolve: ResolveFn<Ret>; reject: RejectFn }>,
): InvokeQueue<Ret> => {
  function settleAll(action: "resolve", arg: Ret): void;
  function settleAll(action: "reject", arg: unknown): void;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  function settleAll(action: "resolve" | "reject", arg: any) {
    let q;
    while ((q = queue.shift())) {
      q[action](arg);
    }
  }

  return {
    add: (resolve: ResolveFn<Ret>, reject: RejectFn) => {
      queue.push({ resolve, reject });
    },
    resolve: (ret: Ret) => settleAll("resolve", ret),
    reject: (reason: unknown) => settleAll("reject", reason),
    offload: () => {
      const cpy = _createInvokeQueue(queue);
      queue = [];
      return cpy;
    },
  } as const;
};

// --------------------

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

    _push: (
      id: symbol,
      task: CallbackSchedulerTask,
      reject: (reason: typeof Callback.REMOVE) => void,
    ) => {
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
_.brandClass(CallbackManager, "CallbackManager");
