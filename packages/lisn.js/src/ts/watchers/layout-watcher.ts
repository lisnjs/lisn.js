/**
 * @module Watchers/LayoutWatcher
 */

// NOTES FOR DEVELOPERS
//
// For each layout (device or aspect ratio), we create an overlay that has a
// a width that corresponds to the layout:
//  - for device layouts, it's a fixed width in pixels, equal to the minimum
//    width of the device
//  - for aspect ratio layouts, the overlay has a width that's relative to
//    the root's height, equal to the minimum width of the aspect ratio
//
// Then we observe each overlay with an IntersectionObserver whose root
// is this Watcher's root and whose root margin is -100% from the left (i.e.
// right-most edge of the root).
//
// If the root is null, i.e. the viewport, the overlays will have a "fixed"
// position and be inserted in document.body. Otherwise, they'll be inserted
// in the root element with an "absolute" position. The root element, if not
// body must be positioned. It gets a default position of "relative" through
// the class `.lisn-overlay-container`, which Overlays ensures it gets.
//
// If using custom root we track its size through SizeWatcher as the
// aspectRatio overlays are relative to the height, and we can't rely on CSS
// alone as the root may not have a fixed height through CSS.
//
// Whenever any overlay intersects the root, this means that the viewport
// width is now equal to or narrower than the overlay.
//
// ~~~~ The current device or aspect ratio corresponds to the _widest_
// ~~~~ overlay that does not intersect.
//
// For example:
//
// | mobile
// ========| mobile-wide
// ======================| tablet
// =========================================| desktop
//
// _________________________________| viewport width
//
// Here, mobile, mobile-wide and tablet overlays are _not_ intersecting, only
// desktop intersects. The device layout is therefore tablet.
//
// Therefore:
// - have the layout bit spaces ordered from narrowest layout at lowest bit
//   to widest layout at hightest bit
// - keep a running bitmask of which overlays are not intersecting and update
//   it each time there is an IntersectionObserverEntry.
// - get the highest device or aspect ratio bit in that bitmask to find out
//   the widest non-intersecting overlay
//
// For simplicity we create overlays also for layouts that have a 0-width.

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { settings } from "@lisn/globals/settings";

import {
  Layout,
  DeviceSpec,
  Device,
  AspectRatioSpec,
  AspectRatio,
} from "@lisn/globals/types";

import { getData } from "@lisn/utils/css-alter";
import {
  getLayoutBitmask,
  NUM_LAYOUTS,
  ORDERED_DEVICES,
  ORDERED_ASPECTR,
} from "@lisn/utils/layout";
import { logError, logWarn } from "@lisn/utils/log";
import { omitKeys, copyExistingKeys } from "@lisn/utils/misc";
import { createOverlay } from "@lisn/utils/overlays";
import { objToStrKey } from "@lisn/utils/text";

import {
  CallbackHandler,
  Callback,
  wrapCallback,
} from "@lisn/modules/callback";
import { newXMap } from "@lisn/modules/x-map";

import { SizeWatcher } from "@lisn/watchers/size-watcher";

import debug from "@lisn/debug/debug";

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
export class LayoutWatcher {
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
  readonly onLayout: (
    handler: OnLayoutHandler,
    options?: OnLayoutOptions,
  ) => Promise<void>;

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
  static create(config: LayoutWatcherConfig = {}) {
    return new LayoutWatcher(getConfig(config), CONSTRUCTOR_KEY);
  }

  /**
   * Returns an existing instance of LayoutWatcher with the given
   * {@link LayoutWatcherConfig}, or creates a new one.
   *
   * **NOTE:** It saves it for future reuse, so don't use this for temporary
   * short-lived watchers.
   */
  static reuse(config: LayoutWatcherConfig = {}) {
    const myConfig = getConfig(config);
    const configStrKey = objToStrKey(omitKeys(myConfig, { _root: null }));

    let instance = instances.get(myConfig._root)?.get(configStrKey);
    if (!instance) {
      instance = new LayoutWatcher(myConfig, CONSTRUCTOR_KEY);
      instances.sGet(myConfig._root).set(configStrKey, instance);
    }

    return instance;
  }

  private constructor(
    config: LayoutWatcherConfigInternal,
    key: typeof CONSTRUCTOR_KEY,
  ) {
    if (key !== CONSTRUCTOR_KEY) {
      throw MH.illegalConstructorError("LayoutWatcher.create");
    }

    const logger = debug
      ? new debug.Logger({ name: "LayoutWatcher", logAtCreation: config })
      : null;
    let nonIntersectingBitmask = 0;
    let currentLayoutData: LayoutData = {
      device: null,
      aspectRatio: null,
    };

    const allCallbacks = MH.newMap<
      OnLayoutHandler,
      {
        _callback: OnLayoutCallback;
        _layoutBitmask: number;
      }
    >();

    // ----------

    const fetchCurrentLayout = async (): Promise<LayoutData> => {
      await readyPromise;

      return MH.copyObject(currentLayoutData);
    };

    // ----------

    const setupOverlays = async () => {
      const { root, overlays } = await createOverlays(
        config._root,
        config._deviceBreakpoints,
        config._aspectRatioBreakpoints,
      );

      return MH.newPromise<void>((resolve) => {
        let isReady = false;

        const intersectionHandler = (entries: IntersectionObserverEntry[]) => {
          const numEntries = MH.lengthOf(entries);
          debug: logger?.debug9(`Got ${numEntries} new entries`, entries);

          if (!isReady) {
            /* istanbul ignore next */ // shouldn't happen
            if (numEntries < NUM_LAYOUTS) {
              logWarn(
                MH.bugError(
                  `Got IntersectionObserver ${numEntries}, ` +
                    `expected >= ${NUM_LAYOUTS}`,
                ),
              );
            }
          }

          for (const entry of entries) {
            nonIntersectingBitmask = getNonIntersecting(
              nonIntersectingBitmask,
              entry,
            );
          }

          // If this is the initial call from IntersectionObserver, skip callbacks.
          // Those that have skipInitial: false would be called elsewhere, by
          // setupOnLayout
          processLayoutChange(!isReady);
          isReady = true;
          resolve(); // ready after IntersectionObserver has called us the 1st time
        };

        // ----------

        const observeOptions = {
          root,
          rootMargin: "5px 0% 5px -100%",
        };

        const observer = MH.newIntersectionObserver(
          intersectionHandler,
          observeOptions,
        );

        for (const triggerOverlay of overlays) {
          observer.observe(triggerOverlay);
        }
      });
    };

    // ----------

    const createCallback = (
      handler: OnLayoutHandler,
      layoutBitmask: number,
    ): OnLayoutCallback => {
      MH.remove(allCallbacks.get(handler)?._callback);

      debug: logger?.debug5("Adding/updating handler", layoutBitmask);
      const callback = wrapCallback(handler);
      callback.onRemove(() => {
        deleteHandler(handler);
      });

      allCallbacks.set(handler, {
        _callback: callback,
        _layoutBitmask: layoutBitmask,
      });
      return callback;
    };

    const setupOnLayout = async (
      handler: OnLayoutHandler,
      options: OnLayoutOptions | undefined,
    ) => {
      const layoutBitmask = getLayoutBitmask(options);
      const callback = createCallback(handler, layoutBitmask);

      if (options?.skipInitial) {
        return;
      }

      const layoutData = await fetchCurrentLayout();

      if (
        !callback.isRemoved() &&
        changeMatches(layoutBitmask, layoutData, null)
      ) {
        debug: logger?.debug5("Calling initially with", layoutData);
        await invokeCallback(callback, layoutData);
      }
    };

    const deleteHandler = (handler: OnLayoutHandler) => {
      MH.deleteKey(allCallbacks, handler);
      // no need to unobserve the overlays
    };

    const processLayoutChange = (skipCallbacks: boolean) => {
      const deviceBit = MH.floor(
        MH.log2(nonIntersectingBitmask & ORDERED_DEVICES.bitmask),
      );

      const aspectRatioBit = MH.floor(
        MH.log2(nonIntersectingBitmask & ORDERED_ASPECTR.bitmask),
      );

      const layoutData: LayoutData = { device: null, aspectRatio: null };

      // -Infinity means all of the overlays are intersecting, which would only
      // happen if the narrowest overlay is not actually 0-width (which is not the
      // case by default and against the recommended settings).
      if (deviceBit !== -MC.INFINITY) {
        layoutData.device = ORDERED_DEVICES.nameOf(1 << deviceBit);
      }
      if (aspectRatioBit !== -MC.INFINITY) {
        layoutData.aspectRatio = ORDERED_ASPECTR.nameOf(1 << aspectRatioBit);
      }

      debug: logger?.debug8("New layout", layoutData);

      if (!skipCallbacks) {
        for (const entry of allCallbacks.values()) {
          const layoutBitmask = entry._layoutBitmask;
          if (!changeMatches(layoutBitmask, layoutData, currentLayoutData)) {
            debug: logger?.debug9(
              `Layout change does not match bitmask ${layoutBitmask}`,
            );
            continue;
          }

          invokeCallback(entry._callback, layoutData);
        }
      }

      currentLayoutData = layoutData;
    };

    const readyPromise = setupOverlays(); // no need to await

    // ----------

    this.fetchCurrentLayout = fetchCurrentLayout;

    // ----------

    this.onLayout = setupOnLayout;

    // ----------

    this.offLayout = (handler) => {
      debug: logger?.debug5("Removing handler");
      MH.remove(allCallbacks.get(handler)?._callback);
    };
  }
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
export type OnLayoutHandler =
  | CallbackHandler<OnLayoutHandlerArgs>
  | OnLayoutCallback;

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

// ----------------------------------------

type LayoutWatcherConfigInternal = {
  _root: HTMLElement | null;
  _deviceBreakpoints: typeof settings.deviceBreakpoints;
  _aspectRatioBreakpoints: typeof settings.aspectRatioBreakpoints;
};

const CONSTRUCTOR_KEY: unique symbol = MC.SYMBOL() as typeof CONSTRUCTOR_KEY;
const instances = newXMap<HTMLElement | null, Map<string, LayoutWatcher>>(() =>
  MH.newMap(),
);

const VAR_BORDER_HEIGHT = MH.prefixCssJsVar("border-height");
const PREFIX_DEVICE = MH.prefixName("device");
const PREFIX_ASPECTR = MH.prefixName("aspect-ratio");

const getConfig = (
  config: LayoutWatcherConfig | undefined,
): LayoutWatcherConfigInternal => {
  const deviceBreakpoints = MH.copyObject(settings.deviceBreakpoints);
  if (config?.deviceBreakpoints) {
    copyExistingKeys(config.deviceBreakpoints, deviceBreakpoints);
  }

  const aspectRatioBreakpoints = MH.copyObject(settings.aspectRatioBreakpoints);

  if (config?.aspectRatioBreakpoints) {
    copyExistingKeys(config.aspectRatioBreakpoints, aspectRatioBreakpoints);
  }

  return {
    _root: config?.root || null,
    _deviceBreakpoints: deviceBreakpoints,
    _aspectRatioBreakpoints: aspectRatioBreakpoints,
  };
};

// ----------------------------------------

const createOverlays = async (
  root: HTMLElement | null,
  deviceBreakpoints: typeof settings.deviceBreakpoints,
  aspectRatioBreakpoints: typeof settings.aspectRatioBreakpoints,
) => {
  const overlayPromises = [];

  let overlayParent: HTMLElement;
  if (root) {
    overlayParent = root;
  } else {
    // Since modals remove the scrollbar on the body when active, the width of
    // the body changes upon open/close of a modal, which would create
    // glitching if it happens near a device breakpoint. So if the root is the
    // viewport, we create a fixed positioned container to hold the overlays
    // and set its width to be 100vw and use that as the root of
    overlayParent = await createOverlay({
      style: {
        position: "fixed",
        [MC.S_WIDTH]: "100vw",
      },
    });
  }

  let device: Device;
  for (device in deviceBreakpoints) {
    overlayPromises.push(
      createOverlay({
        parent: overlayParent,
        style: {
          position: "absolute",
          [MC.S_WIDTH]: deviceBreakpoints[device] + "px",
        },
        data: {
          [PREFIX_DEVICE]: device,
        },
      }),
    );
  }

  const parentHeightCss = root ? `var(${VAR_BORDER_HEIGHT}, 0) * 1px` : "100vh";
  if (root) {
    SizeWatcher.reuse().trackSize(null, { target: root });
  }

  let aspectRatio: AspectRatio;
  for (aspectRatio in aspectRatioBreakpoints) {
    overlayPromises.push(
      createOverlay({
        parent: overlayParent,
        style: {
          position: "absolute",
          [MC.S_WIDTH]:
            `calc(${aspectRatioBreakpoints[aspectRatio]} ` +
            `* ${parentHeightCss})`,
        },
        data: {
          [PREFIX_ASPECTR]: aspectRatio,
        },
      }),
    );
  }

  const overlays = await MH.promiseAll(overlayPromises);
  return { root: overlayParent, overlays };
};

const getOverlayLayout = (overlay: HTMLElement): Layout | null => {
  const layout =
    getData(overlay, PREFIX_DEVICE) || getData(overlay, PREFIX_ASPECTR);
  /* istanbul ignore else */
  if (layout && (ORDERED_DEVICES.has(layout) || ORDERED_ASPECTR.has(layout))) {
    return layout;
  } else {
    // shouldn't happen
    logError(MH.bugError("No device or aspectRatio data attribute"));
    return null;
  }
};

const changeMatches = (
  layoutBitmask: number,
  thisLayoutData: LayoutData,
  prevLayoutData: LayoutData | undefined | null,
): boolean => {
  // True if the callback is interested in a change of device and there's a
  // change of device and the new device is one of the ones it's interested in
  // (or it's null, i.e. device is undefined).
  // And the same for aspect ratios.

  if (
    prevLayoutData?.device !== thisLayoutData.device &&
    (!thisLayoutData.device ||
      ORDERED_DEVICES.bit[thisLayoutData.device] & layoutBitmask)
  ) {
    return true;
  }

  if (
    prevLayoutData?.aspectRatio !== thisLayoutData.aspectRatio &&
    (!thisLayoutData.aspectRatio ||
      ORDERED_ASPECTR.bit[thisLayoutData.aspectRatio] & layoutBitmask)
  ) {
    return true;
  }

  return false;
};

const getNonIntersecting = (
  nonIntersectingBitmask: number, // current
  entry: IntersectionObserverEntry,
): number => {
  const target = MH.targetOf(entry);
  /* istanbul ignore next */ // shouldn't happen
  if (!MH.isHTMLElement(target)) {
    logError(
      MH.bugError(
        `IntersectionObserver called us with '${MH.typeOrClassOf(target)}'`,
      ),
    );
    return nonIntersectingBitmask;
  }

  const layout = getOverlayLayout(target);
  let bit = 0;
  if (!layout) {
    // error already logged by getOverlayLayout
  } else if (ORDERED_DEVICES.has(layout)) {
    bit = ORDERED_DEVICES.bit[layout];
  } else if (ORDERED_ASPECTR.has(layout)) {
    bit = ORDERED_ASPECTR.bit[layout];
  } else {
    /* istanbul ignore next */ // shouldn't happen
    logError(
      MH.bugError(`Unknown device or aspectRatio data attribute: ${layout}`),
    );
  }

  if (entry.isIntersecting) {
    nonIntersectingBitmask &= ~bit;
  } else {
    nonIntersectingBitmask |= bit;
  }

  return nonIntersectingBitmask;
};

const invokeCallback = (callback: OnLayoutCallback, layoutData: LayoutData) =>
  callback.invoke(MH.copyObject(layoutData)).catch(logError);
