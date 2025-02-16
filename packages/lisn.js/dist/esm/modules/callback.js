var _Callback;
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Modules/Callback
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { getDebouncedHandler } from "../utils/tasks.js";
import debug from "../debug/debug.js";

/**
 * @typeParam Args  See {@link Callback}
 */

/**
 * For minification optimization. Exposed through Callback.wrap.
 *
 * @ignore
 * @internal
 */
export const wrapCallback = (handlerOrCallback, debounceWindow = 0) => {
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
  const handler = isFunction ? handlerOrCallback : (...args) => handlerOrCallback.invoke(...args);
  const wrapper = new Callback(getDebouncedHandler(debounceWindow, (...args) => {
    if (!isRemoved()) {
      return handler(...args);
    }
  }));
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
export class Callback {
  /**
   * @param {} handler     The actual function to call. This should return one of
   *                       the known {@link CallbackReturnType} values.
   */
  constructor(handler) {
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
    _defineProperty(this, "invoke", void 0);
    /**
     * Mark the callback as removed and call the registered {@link onRemove} hooks.
     *
     * Future attempts to call it will result in
     * {@link Errors.LisnUsageError | LisnUsageError}.
     */
    _defineProperty(this, "remove", void 0);
    /**
     * Returns true if the callback has been removed and cannot be called again.
     */
    _defineProperty(this, "isRemoved", void 0);
    /**
     * Registers the given function to be called when the callback is removed.
     *
     * You can call {@link onRemove} multiple times to register multiple hooks.
     */
    _defineProperty(this, "onRemove", void 0);
    const logger = debug ? new debug.Logger({
      name: "Callback",
      logAtCreation: handler
    }) : null;
    let isRemoved = false;
    const id = MC.SYMBOL();
    const onRemove = MH.newSet();
    this.isRemoved = () => isRemoved;
    this.remove = () => {
      debug: logger === null || logger === void 0 || logger.debug8("Removing");
      if (!isRemoved) {
        isRemoved = true;
        for (const rmFn of onRemove) {
          rmFn();
        }
        CallbackScheduler._clear(id);
      }
    };
    this.onRemove = fn => onRemove.add(fn);
    this.invoke = (...args) => MH.newPromise((resolve, reject) => {
      debug: logger === null || logger === void 0 || logger.debug8("Calling with", args);
      if (isRemoved) {
        reject(MH.usageError("Callback has been removed"));
        return;
      }
      CallbackScheduler._push(id, async () => {
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
      }, reject);
    });
    callablesMap.set(this.invoke, this);
  }
}

// ----------------------------------------
_Callback = Callback;
/**
 * Possible return value for the handler.
 *
 * Do not do anything. Same as not retuning anything from the function.
 */
_defineProperty(Callback, "KEEP", MC.SYMBOL("KEEP"));
/**
 * Possible return value for the handler.
 *
 * Will remove this callback.
 */
_defineProperty(Callback, "REMOVE", MC.SYMBOL("REMOVE"));
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
_defineProperty(Callback, "wrap", wrapCallback);
const callablesMap = MH.newWeakMap();
const CallbackScheduler = (() => {
  const queues = MH.newMap();
  const flush = async queue => {
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
    _clear: id => {
      const queue = queues.get(id);
      if (queue) {
        let item;
        while (item = queue.shift()) {
          if (!item._running) {
            item._onRemove(Callback.REMOVE);
          }
        }
        MH.deleteKey(queues, id);
      }
    },
    _push: (id, task, onRemove) => {
      let queue = queues.get(id);
      if (!queue) {
        queue = [];
        queues.set(id, queue);
      }
      queue.push({
        _task: task,
        _onRemove: onRemove,
        _running: false
      });
      if (MH.lengthOf(queue) === 1) {
        flush(queue);
      }
    }
  };
})();
//# sourceMappingURL=callback.js.map