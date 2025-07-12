/**
 * @module Modules/XResizeObserver
 */
export type XResizeObserverCallback = (entries: ResizeObserverEntry[], observer: XResizeObserver) => void;
/**
 * {@link XResizeObserver} is an extension of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver | ResizeObserver}
 * - observes both border box and content box size changes
 * - can skip the initial callback that happens shortly after setting up via
 *   {@link observeLater}
 * - can debounce the callback
 */
export declare class XResizeObserver {
    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/observe | ResizeObserver:observe} except it accepts multiple targets.
     */
    readonly observe: (...targets: Element[]) => void;
    /**
     * Like {@link observe} but it ignores the initial almost immediate callback
     * and only calls the callback on a subsequent resize.
     *
     * If the target is already being observed, nothing is done.
     */
    readonly observeLater: (...targets: Element[]) => void;
    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/unobserve | ResizeObserver:unobserve} except it accepts multiple targets.
     */
    readonly unobserve: (...targets: Element[]) => void;
    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/disconnect | ResizeObserver:disconnect}.
     */
    readonly disconnect: () => void;
    /**
     * @param debounceWindow Debounce the handler so that it's called at most
     *                       every `debounceWindow` ms.
     */
    constructor(callback: XResizeObserverCallback, debounceWindow?: number);
}
//# sourceMappingURL=x-resize-observer.d.ts.map