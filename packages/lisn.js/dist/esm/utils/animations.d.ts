/**
 * @module Utils
 */
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