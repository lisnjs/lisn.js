/**
 * @module Utils
 */
/**
 * The callback is passed two arguments:
 * 1. The total elapsed time in milliseconds since the start
 * 2. The elapsed time in milliseconds since the previous frame
 *
 * The first time this callback is called both of these will be 0.
 *
 * The callback must return `true` if it wants to animate again on the next
 * frame and `false` if done.
 */
export type AnimationCallback = (totalElapsed: number, elapsedSinceLast: number) => boolean;
/**
 * Returns a promise that resolves at the next animation frame. Async/await
 * version of requestAnimationFrame.
 *
 * @returns The timestamp gotten from requestAnimationFrame
 *
 * @category Animations
 */
export declare const waitForAnimationFrame: () => Promise<number>;
/**
 * Calls the given callback on every animation frame.
 *
 * The returned Promise resolves when the callback is done (returns `false`).
 *
 * @see {@link AnimationCallback}
 *
 * @since v1.2.0
 *
 * @category Animations
 */
export declare const onEveryAnimationFrame: (callback: AnimationCallback) => Promise<void>;
/**
 * Generator version of {@link onEveryAnimationFrame}.
 *
 * Returns a new async iterator which yields the total elapsed time and elapsed
 * time since the last call on every animation frame.
 *
 * @example
 * ```javascript
 * for await (const [totalElapsed, elapsedSinceLast] of animationFrameIterator()) {
 *   // ... do something
 *   if (done) break;
 * }
 * ```
 *
 * @since v1.2.0
 *
 * @category Animations
 */
export declare function animationFrameIterator(): AsyncGenerator<number[], void, unknown>;
/**
 * @param webAnimationCallback This function is called for each
 *                             {@link https://developer.mozilla.org/en-US/docs/Web/API/Animation | Animation}
 *                             on the element. It {@link waitForMeasureTime}
 *                             before reading the animations.
 * @param legacyCallback       This function is called if the browser does not
 *                             support the Web Animations API. It is called
 *                             after {@link waitForMutateTime} so it can safely
 *                             modify styles.
 * @param realtime             If true, then it does not
 *                             {@link waitForMeasureTime} or
 *                             {@link waitForMutateTime} and runs
 *                             synchronously.
 *
 * @category Animations
 */
export declare const iterateAnimations: (element: Element, webAnimationCallback: (animation: Animation) => void, legacyCallback: (element: Element) => void, realtime?: boolean) => Promise<void>;
/**
 * @ignore
 * @internal
 */
export declare const resetCssAnimationsNow: (element: Element) => void;
//# sourceMappingURL=animations.d.ts.map