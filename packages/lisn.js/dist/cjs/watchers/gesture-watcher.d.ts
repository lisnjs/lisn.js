/**
 * @module Watchers/GestureWatcher
 */
import { Direction, GestureIntent, GestureDevice, CommaSeparatedStr } from "../globals/types.cjs";
import { CallbackHandler, Callback } from "../modules/callback.cjs";
/**
 * {@link GestureWatcher} listens for user gestures resulting from wheel,
 * pointer, touch or key input events.
 *
 * It supports scroll, zoom or drag type gestures.
 *
 * It manages registered callbacks globally and reuses event listeners for more
 * efficient performance.
 */
export declare class GestureWatcher {
    /**
     * Call the given handler whenever the user performs a gesture on the target
     * matching the given options.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same event target, even if the options differ. If the handler has already
     * been added for this target, either using {@link onGesture} or
     * {@link trackGesture}, then it will be removed and re-added with the
     * current options.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the options are invalid.
     */
    readonly onGesture: (target: EventTarget, handler: OnGestureHandler, options?: OnGestureOptions) => Promise<void>;
    /**
     * Removes a previously added handler.
     */
    readonly offGesture: (target: EventTarget, handler: OnGestureHandler) => void;
    /**
     * This is the same as {@link onGesture} except that if `handler` is not
     * given, then it defaults to an internal handler that updates a set of CSS
     * variables on the target's style:
     *
     *   - `--lisn-js--<Intent>-delta-x`
     *   - `--lisn-js--<Intent>-delta-y`
     *   - `--lisn-js--<Intent>-delta-z`
     *
     * where and `<Intent>` is one of {@link GestureIntent} and the delta X, Y
     * and Z are the _total summed up_ `deltaX`, `deltaY` and `deltaZ` since the
     * callback was added, summed over all devices used (key, touch, etc).
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same target, even if the options differ. If the handler has already been
     * added for this target, either using {@link trackGesture} or using
     * {@link onGesture}, then it will be removed and re-added with the current
     * options.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the options are invalid.
     */
    readonly trackGesture: (element: Element, handler?: OnGestureHandler | null, options?: OnGestureOptions) => Promise<void>;
    /**
     * Removes a previously added handler for {@link trackGesture}.
     */
    readonly noTrackGesture: (element: Element, handler?: OnGestureHandler | null) => void;
    /**
     * Creates a new instance of GestureWatcher with the given
     * {@link GestureWatcherConfig}. It does not save it for future reuse.
     */
    static create(config?: GestureWatcherConfig): GestureWatcher;
    /**
     * Returns an existing instance of GestureWatcher with the given
     * {@link GestureWatcherConfig}, or creates a new one.
     *
     * **NOTE:** It saves it for future reuse, so don't use this for temporary
     * short-lived watchers.
     */
    static reuse(config?: GestureWatcherConfig): GestureWatcher;
    private constructor();
}
/**
 * @interface
 */
export type GestureWatcherConfig = {
    /**
     * The default value for
     * {@link OnGestureOptions.preventDefault | preventDefault} in calls to
     * {@link GestureWatcher.onGesture}.
     *
     * @defaultValue true
     */
    preventDefault?: boolean;
    /**
     * The default value for
     * {@link OnGestureOptions.debounceWindow | debounceWindow} in calls to
     * {@link GestureWatcher.onGesture}.
     *
     * @defaultValue 150
     */
    debounceWindow?: number;
    /**
     * The default value for
     * {@link OnGestureOptions.deltaThreshold | deltaThreshold} in calls to
     * {@link GestureWatcher.onGesture}.
     *
     * @defaultValue 5
     */
    deltaThreshold?: number;
    /**
     * The default value for
     * {@link OnGestureOptions.angleDiffThreshold | angleDiffThreshold} in calls to
     * {@link GestureWatcher.onGesture}.
     *
     * It does not make much sense to set this to 0.
     *
     * The value is in _degrees_, not radians.
     *
     * @defaultValue 35
     */
    angleDiffThreshold?: number;
    /**
     * The default value for
     * {@link OnGestureOptions.naturalTouchScroll | naturalTouchScroll} in calls to
     * {@link GestureWatcher.onGesture}.
     *
     * @defaultValue true
     */
    naturalTouchScroll?: boolean;
    /**
     * The default value for
     * {@link OnGestureOptions.touchDragHoldTime | touchDragHoldTime} in calls to
     * {@link GestureWatcher.onGesture}.
     *
     * @defaultValue 500
     */
    touchDragHoldTime?: number;
    /**
     * The default value for
     * {@link OnGestureOptions.touchDragNumFingers | touchDragNumFingers} in calls to
     * {@link GestureWatcher.onGesture}.
     *
     * @defaultValue 1
     */
    touchDragNumFingers?: number;
};
/**
 * @interface
 */
export type OnGestureOptions = {
    /**
     * One or more device types to listen for. If not specified, then all devices
     * are enabled.
     *
     * It can be a comma-separated list of {@link GestureDevice}s or an array of
     * such devices.
     *
     * @defaultValue undefined
     */
    devices?: CommaSeparatedStr<GestureDevice> | GestureDevice[];
    /**
     * If given, callback will only be called if the gesture's direction is one
     * of the given ones.
     *
     * It can be a comma-separated list of {@link Direction}s or an array of such
     * directions.
     *
     * @defaultValue undefined
     */
    directions?: CommaSeparatedStr<Direction> | Direction[];
    /**
     * If given, callback will only be called if the gesture's intent is one
     * of the given ones.
     *
     * It can be a comma-separated list of {@link GestureIntent}s or an
     * array of such intents.
     *
     * @defaultValue undefined
     */
    intents?: CommaSeparatedStr<GestureIntent> | GestureIntent[];
    /**
     * Set minimum total delta X. Further reductions in delta X below this value
     * will be ignored.
     *
     * The value is in pixels and can be negative.
     *
     * @defaultValue undefined
     */
    minTotalDeltaX?: number;
    /**
     * Set maximum total delta X. Further increase in delta X above this value
     * will be ignored.
     *
     * The value is in pixels.
     *
     * @defaultValue undefined
     */
    maxTotalDeltaX?: number;
    /**
     * Set minimum total delta Y. Further reductions in delta Y below this value
     * will be ignored.
     *
     * The value is in pixels and can be negative.
     *
     * @defaultValue undefined
     */
    minTotalDeltaY?: number;
    /**
     * Set maximum total delta Y. Further increase in delta Y above this value
     * will be ignored.
     *
     * The value is in pixels.
     *
     * @defaultValue undefined
     */
    maxTotalDeltaY?: number;
    /**
     * Set minimum total delta Z. Further reductions in delta Z below this value
     * will be ignored.
     *
     * The value is in percentage zoom, relative to 1, and can be less than 1 but
     * must be > 0.1 which is a hard minimum.
     *
     * @defaultValue undefined
     */
    minTotalDeltaZ?: number;
    /**
     * Set maximum total delta Z. Further increase in delta Z above this value
     * will be ignored.
     *
     * The value is in percentage zoom, relative to 1, and must be positive.
     *
     * @defaultValue undefined
     */
    maxTotalDeltaZ?: number;
    /**
     * If true, the events of the gesture, e.g. relevant key presses or touch
     * moves, etc, will have their default action prevented.
     *
     * **IMPORTANT:** For pointer gestures, then pointer/mouse down and click
     * will be prevented.
     *
     * @defaultValue {@link GestureWatcherConfig.preventDefault}
     */
    preventDefault?: boolean;
    /**
     * If given, callback will be called at most once every `debounceWindow`
     * milliseconds.
     *
     * Note that if both `debounceWindow` and `deltaThreshold` are set, _both_
     * must be exceeded before callback is called.
     *
     * @defaultValue {@link GestureWatcherConfig.debounceWindow}
     */
    debounceWindow?: number;
    /**
     * Callback will only be called when the gesture's accumulated delta, since
     * the last time callback was called, exceeds `deltaThreshold`.
     *
     * At least one of the three deltas (X, Y or Z) must exceed this number (in
     * absolute value). Note that when comparing `deltaZ`, it is multiplied by
     * 100 since it represents fractions of 1 (100%). So supplying
     * `deltaThreshold` of 10 means is equivalent to the following condition:
     *
     * ```
     * abs(deltaX) >= 10 || abs(deltaY) >= 10 ||  abs(1 - deltaZ) >= 0.1
     * ```
     *
     * Accumulation of the delta ends if the gesture is terminated, for example,
     * in case of touch gestures, by a "touchcancel" event of by the final finger
     * lifting off..
     *
     * Note that if both `debounceWindow` and `deltaThreshold` are set, _both_
     * must be exceeded before callback is called.
     *
     * @defaultValue {@link GestureWatcherConfig.deltaThreshold}
     */
    deltaThreshold?: number;
    /**
     * See {@link Utils.getVectorDirection | getVectorDirection}.
     *
     * @defaultValue {@link GestureWatcherConfig.angleDiffThreshold}
     */
    angleDiffThreshold?: number;
    /**
     * Whether touch scroll gestures follow the natural direction: swipe up
     * with scroll intent results in direction down and swipe down results in
     * direction up.
     *
     * @defaultValue {@link GestureWatcherConfig.naturalTouchScroll}
     */
    naturalTouchScroll?: boolean;
    /**
     * If the user presses and holds on a touchscreen for at least the given
     * amount of milliseconds before moving the finger(s), touch gestures other
     * than pinch will be treated as a drag intent instead of scroll as long as
     * the number of fingers touching the screen is {@link touchDragNumFingers}.
     *
     * Set to 0 in order to treat _all_ non-pinch touch gestures as drag.
     *
     * Set to a negative number in order to treat _all_ non-pinch touch gestures
     * as scroll.
     *
     * @defaultValue {@link GestureWatcherConfig.touchDragHoldTime}
     */
    touchDragHoldTime?: number;
    /**
     * The number of fingers that could be considered a drag intent for touch
     * gestures.
     *
     * @defaultValue {@link GestureWatcherConfig.touchDragHoldTime}
     */
    touchDragNumFingers?: number;
};
/**
 * The handler is invoked with two arguments:
 *
 * - the event target that was passed to the {@link GestureWatcher.onGesture}
 *   call (equivalent to
 *   {@link https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget | Event:currentTarget}).
 * - the {@link GestureData} that describes the gesture's progression since the
 *   last time the callback was called and since the callback was added.
 */
export type OnGestureHandlerArgs = [EventTarget, GestureData, Event[]];
export type OnGestureCallback = Callback<OnGestureHandlerArgs>;
export type OnGestureHandler = CallbackHandler<OnGestureHandlerArgs> | OnGestureCallback;
export type GestureData = {
    device: GestureDevice;
    direction: Direction;
    intent: GestureIntent;
    /**
     * Delta in the horizontal direction since the start of the gesture.
     */
    deltaX: number;
    /**
     * Delta in the vertical direction since the start of the gesture.
     */
    deltaY: number;
    /**
     * Relative fractional zoom in or out for zoom intents since the start of
     * the gesture.
     *
     * For zoom in, `deltaZ` is always > 1, and for zoom out it is < 1.
     *
     * For non-zoom gestures it is 1.
     */
    deltaZ: number;
    /**
     * The time in milliseconds it took for the gesture. This will be the
     * difference in timestamps between the first and last event that composed
     * the gesture. For key and wheel gestures this could be 0, since 1 event is
     * sufficient for them.
     */
    time: number;
    /**
     * Delta in the horizontal direction since the callback was added.
     */
    totalDeltaX: number;
    /**
     * Delta in the vertical direction since the callback was added.
     */
    totalDeltaY: number;
    /**
     * Percentage (relative) zoom in or out for zoom intents since the callback
     * was added.
     */
    totalDeltaZ: number;
};
//# sourceMappingURL=gesture-watcher.d.ts.map