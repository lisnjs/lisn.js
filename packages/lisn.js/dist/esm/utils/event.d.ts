/**
 * @module Utils
 */
/**
 * Calls the given event listener, which could be a function that's callable
 * directly, or an object that has a `handleEvent` function property.
 *
 * @category Events: Generic
 */
export declare const callEventListener: (handler: EventListenerOrEventListenerObject, event: Event) => void;
/**
 * Adds an event listener for the given event name to the given target.
 *
 * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener | EventTarget:addEventListener}
 * but it handles `options` object in case the browser does not support those.
 * Does not support the `signal` option unless browser natively supports that.
 *
 * @returns `true` if successfully added, or `false` if the same handler has
 * already been added by us, or if the handler is not a valid event listener.
 *
 * @category Events: Generic
 */
export declare const addEventListenerTo: (target: EventTarget, eventType: string, handler: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => boolean;
/**
 * Removes an event listener that has been added using
 * {@link addEventListenerTo}.
 *
 * **IMPORTANT:** If you have added a listener using the built-in
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener | EventTarget:addEventListener},
 * then you should use
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener | EventTarget:removeEventListener},
 * to remove it, not this function.
 *
 * @returns `true` if successfully removed, or `false` if the handler has not
 * been added by us.
 *
 * @category Events: Generic
 */
export declare const removeEventListenerFrom: (target: EventTarget, eventType: string, handler: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => boolean;
/**
 * @ignore
 * @internal
 */
export declare const preventSelect: (target: EventTarget) => void;
/**
 * @ignore
 * @internal
 */
export declare const undoPreventSelect: (target: EventTarget) => void;
/**
 * @ignore
 * @internal
 */
export declare const getBrowserSupport: () => BrowserEventSupport;
type BrowserEventSupport = {
    _pointer: boolean;
    _optionsArg: boolean;
    _options: {
        capture: boolean;
        passive: boolean;
        once: boolean;
        signal: boolean;
    };
};
export {};
//# sourceMappingURL=event.d.ts.map