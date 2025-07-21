/**
 * @module Utils
 */
export type ElapsedTimes = {
    total: number;
    sinceLast: number;
};
/**
 * The callback is as an argument the {@link ElapsedTimes | elapsed times}:
 * - The total elapsed time in milliseconds since the start
 * - The elapsed time in milliseconds since the previous frame
 *
 * The first time this callback is called both of these will be 0 unless seed
 * values were provided.
 *
 * The callback must return `true` if it wants to animate again on the next
 * frame and `false` if done.
 *
 * @since v1.2.0
 *
 * @category Animations
 */
export type AnimationCallback = (elapsed: ElapsedTimes) => boolean;
/**
 * Returns a promise that resolves at the next animation frame. Async/await
 * version of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame | requestAnimationFrame}.
 *
 * @returns The timestamp gotten from `requestAnimationFrame`
 *
 * @category Animations
 */
export declare const waitForAnimationFrame: () => Promise<number>;
/**
 * Calls the given callback on every animation frame.
 *
 * The returned Promise resolves when the callback is done (returns `false`).
 *
 * @param callback  See {@link AnimationCallback}.
 * @param elapsed   Seed values to use as the total elapsed and elapsed since
 *                  last. Otherwise it will use the timestamp of the first frame
 *                  as the start, which will result in those values being 0 the
 *                  first time.
 *
 * @since v1.2.0
 *
 * @category Animations
 */
export declare const onEveryAnimationFrame: (callback: AnimationCallback, elapsed?: ElapsedTimes) => Promise<void>;
/**
 * Generator version of {@link onEveryAnimationFrame}.
 *
 * Returns a new async iterator which yields the total elapsed time and elapsed
 * time since the last call on every animation frame.
 *
 * @example
 * ```javascript
 * for await (const elapsed of newAnimationFrameIterator()) {
 *   // ... do something
 *   if (done) break;
 * }
 * ```
 *
 * @since v1.2.0
 *
 * @category Animations
 */
export declare function newAnimationFrameIterator(elapsed?: ElapsedTimes): AsyncGenerator<ElapsedTimes, never>;
/**
 * Returns an animation iterator based on {@link criticallyDamped} that starts
 * at the given position `l`, with velocity `v = 0` and time `t = 0` and yields
 * the new position and velocity, and total time at every animation frame.
 *
 * @param [settings.l]         The initial starting position.
 * @param [settings.lTarget]   The initial target position. Can be updated when
 *                             calling next().
 * @param [settings.lag]       See {@link criticallyDamped}.
 * @param [settings.precision] See {@link criticallyDamped}.
 *
 * @returns An iterator whose `next` method accepts an optional new `lTarget`.
 * The iterator yields an object containing successive values for:
 * - position (`l`)
 * - velocity (`v`)
 * - total time elapsed (`t`)
 *
 * @example
 * If you never need to update the target you can use a for await loop:
 *
 * ```javascript
 * const iterator = newCriticallyDampedAnimationIterator({
 *   l: 10,
 *   lTarget: 100,
 *   lag: 1500
 * });
 *
 * for await (const { l, v, t } of iterator) {
 *   console.log({ l, v, t });
 * }
 * ```
 *
 * @example
 * If you do need to update the target, then call `next` explicitly:
 *
 * ```javascript
 * const iterator = newCriticallyDampedAnimationIterator({
 *   l: 10,
 *   lTarget: 100,
 *   lag: 1500
 * });
 *
 * let { value: { l, v, t } } = await iterator.next();
 * ({ value: { l, v, t } } = await iterator.next()); // updated
 * ({ value: { l, v, t } } = await iterator.next(200)); // updated towards a new target
 * ```
 *
 * @since v1.2.0
 *
 * @category Animations
 */
export declare function newCriticallyDampedAnimationIterator(settings: {
    lTarget: number;
    lag: number;
    l?: number;
}): AsyncGenerator<{
    l: number;
    v: number;
    t: number;
}, never>;
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