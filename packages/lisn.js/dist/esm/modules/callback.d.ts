/**
 * @module Modules/Callback
 */
/**
 * @typeParam Args See {@link Callback}
 */
export type CallbackHandler<Args extends unknown[] = []> = (...args: Args) => CallbackReturnType | Promise<CallbackReturnType>;
export type CallbackReturnType = typeof Callback.KEEP | typeof Callback.REMOVE | void;
/**
 * For minification optimization. Exposed through Callback.wrap.
 *
 * @ignore
 * @internal
 */
export declare const wrapCallback: <Args extends unknown[] = []>(handlerOrCallback: CallbackHandler<Args> | Callback<Args>, debounceWindow?: number) => Callback<Args>;
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
export declare class Callback<Args extends unknown[] = []> {
    /**
     * Possible return value for the handler.
     *
     * Do not do anything. Same as not retuning anything from the function.
     */
    static readonly KEEP: unique symbol;
    /**
     * Possible return value for the handler.
     *
     * Will remove this callback.
     */
    static readonly REMOVE: unique symbol;
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
     * @param debounceWindow If non-0, the callback will be called at most
     *                       every `debounceWindow` ms. The arguments it will
     *                       be called with will be the last arguments the
     *                       wrapper was called with.
     */
    static readonly wrap: <Args_1 extends unknown[] = []>(handlerOrCallback: CallbackHandler<Args_1> | Callback<Args_1>, debounceWindow?: number) => Callback<Args_1>;
    /**
     * @param handler The actual function to call. This should return one of
     *                the known {@link CallbackReturnType} values.
     */
    constructor(handler: CallbackHandler<Args>);
}
//# sourceMappingURL=callback.d.ts.map