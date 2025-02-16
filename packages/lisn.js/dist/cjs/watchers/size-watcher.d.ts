/**
 * @module Watchers/SizeWatcher
 */
import { Box, Dimension, Size, SizeTarget } from "../globals/types.cjs";
import { CallbackHandler, Callback } from "../modules/callback.cjs";
/**
 * {@link SizeWatcher} monitors the size of a given target. It's built on top
 * of {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver | ResizeObserver}.
 *
 * It manages registered callbacks globally and reuses ResizeObservers.
 *
 * Each instance of SizeWatcher manages up to two ResizeObservers: one
 * for content-box size changes and one for border-box size changes.
 */
export declare class SizeWatcher {
    /**
     * Call the given handler whenever the target's size changes.
     *
     * Unless {@link OnResizeOptions.skipInitial} is true, the handler is also
     * called (almost) immediately with the latest size data.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same target, even if the options differ. If the handler has already been
     * added for this target, either using {@link onResize} or {@link trackSize},
     * then it will be removed and re-added with the current options.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target or options are invalid.
     */
    readonly onResize: (handler: OnResizeHandler, options?: OnResizeOptions) => Promise<void>;
    /**
     * Removes a previously added handler.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target is invalid.
     */
    readonly offResize: (handler: OnResizeHandler, target?: SizeTarget) => void;
    /**
     * This is the same as {@link onResize} except that if `handler` is not given,
     * then it defaults to an  handler that updates a set of CSS variables on the
     * target's style:
     *
     * - If {@link OnResizeOptions.target | options.target} is not given, or is
     *   `window`, the following CSS variables are set on the root (`html`)
     *   element and represent the viewport size:
     *   - `--lisn-js--window-border-width`
     *   - `--lisn-js--window-border-height`
     *   - `--lisn-js--window-content-width`
     *   - `--lisn-js--window-content-height`
     *
     * - Otherwise, the following variables are set on the target itself and
     *   represent its visible size:
     *   - `--lisn-js--border-width`
     *   - `--lisn-js--border-height`
     *   - `--lisn-js--content-width`
     *   - `--lisn-js--content-height`
     *
     * If `target` is `document`, then it will use `document.documentElement`.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same target, even if the options differ. If the handler has already been
     * added for this target, either using {@link onResize} or {@link trackSize},
     * then it will be removed and re-added with the current options.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target or options are invalid.
     */
    readonly trackSize: (handler?: OnResizeHandler | null, options?: OnResizeOptions) => Promise<void>;
    /**
     * Removes a previously added handler for {@link trackSize}.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target is invalid.
     */
    readonly noTrackSize: (handler?: OnResizeHandler | null, target?: SizeTarget) => void;
    /**
     * Get the size of the given target. It will get the size from a
     * ResizeObserverEntry and so it's always delayed by one frame at least.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target is invalid.
     */
    readonly fetchCurrentSize: (target?: SizeTarget) => Promise<SizeData>;
    /**
     * Creates a new instance of SizeWatcher with the given
     * {@link SizeWatcherConfig}. It does not save it for future reuse.
     */
    static create(config?: SizeWatcherConfig): SizeWatcher;
    /**
     * Returns an existing instance of SizeWatcher with the given
     * {@link SizeWatcherConfig}, or creates a new one.
     *
     * **NOTE:** It saves it for future reuse, so don't use this for temporary
     * short-lived watchers.
     */
    static reuse(config?: SizeWatcherConfig): SizeWatcher;
    private constructor();
}
/**
 * @interface
 */
export type SizeWatcherConfig = {
    /**
     * The default value for
     * {@link OnResizeOptions.debounceWindow | debounceWindow} in calls to
     * {@link SizeWatcher.onResize}.
     *
     * @defaultValue 75
     */
    debounceWindow?: number;
    /**
     * The default value for
     * {@link OnResizeOptions.threshold | threshold} in calls to
     * {@link SizeWatcher.onResize}.
     *
     * @defaultValue 50
     */
    resizeThreshold?: number;
};
/**
 * @interface
 */
export type OnResizeOptions = {
    /**
     * If it is not given, or is `null` or `window`, then it will track the size
     * of the viewport (akin to `clientHeight` on `documentElement`).
     *
     * If it is `document`, then it will use `document.documentElement`.
     *
     * Other values of target must be an `Element` and are taken literally.
     *
     * @defaultValue undefined
     */
    target?: SizeTarget;
    /**
     * Specifies whether to listen for changes in content box size or border box
     * size.
     *
     * If not given, then it listens for changes in either.
     *
     * @defaultValue undefined
     */
    box?: Box;
    /**
     * Specifies whether to listen for changes in width or height.
     *
     * If not given, then it listens for changes in either.
     *
     * @defaultValue undefined
     */
    dimension?: Dimension;
    /**
     * If non-0, the handler will only be called when the target's size in the
     * observed {@link OnResizeOptions.dimension} and {@link OnResizeOptions.box}
     * type has changed at least `threshold` pixels since the last time the
     * handler was called.
     *
     * Special case when `threshold` is 0 and at least one of
     * {@link OnResizeOptions.dimension} or {@link OnResizeOptions.box} is given:
     * if there's a resize event but the size in the observed dimensions/box
     * types has not changed, the callback is _not_ called.
     *
     * @defaultValue {@link SizeWatcherConfig.resizeThreshold}
     */
    threshold?: number;
    /**
     * Do not call the handler until there's a future resize of the element.
     *
     * By default we call the handler (almost) immediately with the current size
     * data for the target.
     *
     * @defaultValue false
     */
    skipInitial?: boolean;
    /**
     * If non-0, the handler will be "debounced" so it's called at most
     * `debounceWindow` milliseconds.
     *
     * @defaultValue {@link SizeWatcherConfig.debounceWindow}
     */
    debounceWindow?: number;
};
/**
 * The handler is invoked with three arguments:
 *
 * - the element that has been resized: if the target you requested was the
 *   viewport, then this will be a fixed positioned overlay that tracks the
 *   size of the viewport
 * - the {@link SizeData} for the element
 */
export type OnResizeHandlerArgs = [Element, SizeData];
export type OnResizeCallback = Callback<OnResizeHandlerArgs>;
export type OnResizeHandler = CallbackHandler<OnResizeHandlerArgs> | OnResizeCallback;
export type SizeData = Record<Box, Size>;
//# sourceMappingURL=size-watcher.d.ts.map