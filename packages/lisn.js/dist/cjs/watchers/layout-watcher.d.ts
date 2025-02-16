/**
 * @module Watchers/LayoutWatcher
 */
import { settings } from "../globals/settings.cjs";
import { DeviceSpec, Device, AspectRatioSpec, AspectRatio } from "../globals/types.cjs";
import { CallbackHandler, Callback } from "../modules/callback.cjs";
/**
 * {@link LayoutWatcher} listens for changes in either the width or aspect
 * ratio of the viewport or the given {@link LayoutWatcherConfig.root | root}.
 *
 * It does not track resize events; rather it's built on top of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver | IntersectionObserver}.
 *
 * It manages registered callbacks globally and reuses IntersectionObservers
 * for more efficient performance.
 */
export declare class LayoutWatcher {
    /**
     * Call the given handler whenever the layout changes.
     *
     * Unless {@link OnLayoutOptions.skipInitial} is true, the handler is also
     * called (almost) immediately with the current layout.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times, even if
     * the options differ. If the handler has already been added, it is removed
     * and re-added with the current options.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the options are invalid.
     */
    readonly onLayout: (handler: OnLayoutHandler, options?: OnLayoutOptions) => Promise<void>;
    /**
     * Removes a previously added handler.
     */
    readonly offLayout: (handler: OnLayoutHandler) => void;
    /**
     * Get the current screen layout.
     */
    readonly fetchCurrentLayout: () => Promise<LayoutData>;
    /**
     * Creates a new instance of LayoutWatcher with the given
     * {@link LayoutWatcherConfig}. It does not save it for future reuse.
     */
    static create(config?: LayoutWatcherConfig): LayoutWatcher;
    /**
     * Returns an existing instance of LayoutWatcher with the given
     * {@link LayoutWatcherConfig}, or creates a new one.
     *
     * **NOTE:** It saves it for future reuse, so don't use this for temporary
     * short-lived watchers.
     */
    static reuse(config?: LayoutWatcherConfig): LayoutWatcher;
    private constructor();
}
/**
 * @interface
 */
export type LayoutWatcherConfig = {
    /**
     * The root element whose layout to watch. If not given or `null`, then the
     * viewport layout is watched.
     *
     * @defaultValue null
     */
    root?: HTMLElement | null;
    /**
     * Use custom device breakpoints. Only known device names ({@link Device})
     * are supported. If any are missing from the given dictionary, the value
     * from {@link settings.deviceBreakpoints} is used.
     *
     * @defaultValue {@link settings.deviceBreakpoints}
     */
    deviceBreakpoints?: typeof settings.deviceBreakpoints;
    /**
     * Use custom aspect ratio breakpoints. Only known aspect ratio names
     * ({@link AspectRatio}) are supported. If any are missing from the given
     * dictionary, the value from {@link settings.aspectRatioBreakpoints} is
     * used.
     *
     * @defaultValue {@link settings.aspectRatioBreakpoints}
     */
    aspectRatioBreakpoints?: typeof settings.aspectRatioBreakpoints;
};
/**
 * @interface
 */
export type OnLayoutOptions = {
    /**
     * Specifies a list of {@link Device}s to target for.
     *
     * The handler will only be called if there is a change of device to a device
     * matching the specification.
     *
     * It can be:
     * - "min <Device>": devices at least as wide as `<Device>`
     * - "max <Device>": devices at most as wide as `<Device>`
     * - "<DeviceMin> to <DeviceMax>": devices at least as wide as `<DeviceMin>`
     *                                 and at most as wide as `<DeviceMax>`
     * - a comma-separated list of device names
     * - an array of device names
     *
     * **NOTE**
     *
     * If only one of {@link devices} or {@link aspectRatios} is specified, the
     * handler will only be called for matching changes of device or aspect ratio
     * respectively.
     *
     * If neither is specified, the handler will be called for any change of layout
     * (device or aspect ratio).
     *
     * Also note that an empty array is treated the same as not given, or `null`.
     *
     * @defaultValue undefined
     */
    devices?: DeviceSpec | Device[];
    /**
     * Specifies a list of {@link AspectRatio}s to target for.
     *
     * The handler will only be called if there is a change of aspect ratio to
     * an aspect ratios matching the specification.
     *
     * It can be:
     * - "min <AspectRatio>": aspect ratios at least as wide as `<AspectRatio>`
     * - "max <AspectRatio>": aspect ratios at most as wide as `<AspectRatio>`
     * - "<AspectRatioMin> to <AspectRatioMax>": aspect ratios at least as wide
     *                        as `<AspectRatioMin>` and at most as wide as
     *                        `<AspectRatioMax>`
     * - a comma-separated list of aspect ratio names
     * - an array of aspect ratio names
     *
     * **NOTE**
     *
     * If only one of {@link devices} or {@link aspectRatios} is specified, the
     * handler will only be called for matching changes of device or aspect ratio
     * respectively.
     *
     * If neither is specified, the handler will be called for any change of layout
     * (device or aspect ratio).
     *
     * @defaultValue undefined
     */
    aspectRatios?: AspectRatioSpec | AspectRatio[];
    /**
     * Do not call the handler until there's a future change of layout.
     *
     * By default, we call the handler (almost) immediately with the current
     * layout data if it matches the given {@link devices} and {@link aspectRatios}.
     *
     * @defaultValue false
     */
    skipInitial?: boolean;
};
/**
 * The handler is invoked with one argument:
 *
 * - the current {@link LayoutData}
 */
export type OnLayoutHandlerArgs = [LayoutData];
export type OnLayoutCallback = Callback<OnLayoutHandlerArgs>;
export type OnLayoutHandler = CallbackHandler<OnLayoutHandlerArgs> | OnLayoutCallback;
/**
 * Note that {@link device} or {@link aspectRatio} would only be null if the
 * viewport is narrower than the narrowest device/aspect ratio. This would only
 * happen if the narrowest device/aspect ratio is _not_ 0-width (which is not
 * the case with the default breakpoints and is against the recommendation for
 * setting breakpoints.
 */
export type LayoutData = {
    device: Device | null;
    aspectRatio: AspectRatio | null;
};
//# sourceMappingURL=layout-watcher.d.ts.map