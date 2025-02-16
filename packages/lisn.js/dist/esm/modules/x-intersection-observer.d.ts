/**
 * @module Modules/XIntersectionObserver
 */
export type XIntersectionObserverCallback = (entries: IntersectionObserverEntry[], observer: XIntersectionObserver) => void;
/**
 * {@link XIntersectionObserver} is an extension of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver | IntersectionObserver}
 * with added capabilities:
 * - can skip the initial callback that happens shortly after setting up via
 *   {@link observeLater}
 */
export declare class XIntersectionObserver {
    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root | IntersectionObserver:root}.
     */
    readonly root: Element | Document | null;
    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin | IntersectionObserver:rootMargin}.
     */
    readonly rootMargin: string;
    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds | IntersectionObserver:thresholds}.
     */
    readonly thresholds: number[];
    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/observe | IntersectionObserver:observe} except it accepts multiple
     * targets.
     */
    readonly observe: (...targets: Element[]) => void;
    /**
     * Like {@link observe} but it ignores the initial almost immediate callback
     * and only calls the callback on a subsequent intersection change.
     */
    readonly observeLater: (...targets: Element[]) => void;
    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/unobserve | IntersectionObserver:unobserve} except it accepts multiple
     * targets.
     */
    readonly unobserve: (...targets: Element[]) => void;
    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/disconnect | IntersectionObserver:disconnect}.
     */
    readonly disconnect: () => void;
    /**
     * Like `IntersectionObserver.takeRecords`.
     */
    readonly takeRecords: () => void;
    constructor(callback: XIntersectionObserverCallback, observeOptions?: IntersectionObserverInit);
}
//# sourceMappingURL=x-intersection-observer.d.ts.map