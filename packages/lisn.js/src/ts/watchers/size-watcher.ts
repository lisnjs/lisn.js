/**
 * @module Watchers/SizeWatcher
 */

import * as _ from "@lisn/_internal";

import { usageError, illegalConstructorError } from "@lisn/globals/errors";

import { Box, Dimension, Size, SizeTarget } from "@lisn/globals/types";

import { setNumericStyleJsVars } from "@lisn/utils/css-alter";
import { logError } from "@lisn/utils/log";
import { toNonNegNum } from "@lisn/utils/math";
import {
  isValidBox,
  isValidDimension,
  getEntryBorderBox,
  getEntryContentBox,
  tryGetViewportOverlay,
  fetchViewportOverlay,
} from "@lisn/utils/size";
import { objToStrKey } from "@lisn/utils/text";

import {
  CallbackHandler,
  Callback,
  wrapCallback,
} from "@lisn/modules/callback";
import { createXWeakMap } from "@lisn/modules/x-map";
import { XResizeObserver } from "@lisn/modules/x-resize-observer";

import debug from "@lisn/debug/debug";

/**
 * {@link SizeWatcher} monitors the size of a given target. It's built on top
 * of {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver | ResizeObserver}.
 *
 * It manages registered callbacks globally and reuses ResizeObservers.
 *
 * Each instance of SizeWatcher manages up to two ResizeObservers: one
 * for content-box size changes and one for border-box size changes.
 */
export class SizeWatcher {
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
  readonly onResize: (
    handler: OnResizeHandler,
    options?: OnResizeOptions,
  ) => Promise<void>;

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
  readonly trackSize: (
    handler?: OnResizeHandler | null,
    options?: OnResizeOptions,
  ) => Promise<void>;

  /**
   * Removes a previously added handler for {@link trackSize}.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the target is invalid.
   */
  readonly noTrackSize: (
    handler?: OnResizeHandler | null,
    target?: SizeTarget,
  ) => void;

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
  static create(config?: SizeWatcherConfig) {
    return new SizeWatcher(getConfig(config), CONSTRUCTOR_KEY);
  }

  /**
   * Returns an existing instance of SizeWatcher with the given
   * {@link SizeWatcherConfig}, or creates a new one.
   *
   * **NOTE:** It saves it for future reuse, so don't use this for temporary
   * short-lived watchers.
   */
  static reuse(config?: SizeWatcherConfig) {
    const myConfig = getConfig(config);
    const configStrKey = objToStrKey(myConfig);

    let instance = instances.get(configStrKey);
    if (!instance) {
      instance = new SizeWatcher(myConfig, CONSTRUCTOR_KEY);
      instances.set(configStrKey, instance);
    }

    return instance;
  }

  private constructor(
    config: SizeWatcherConfigInternal,
    key: typeof CONSTRUCTOR_KEY,
  ) {
    if (key !== CONSTRUCTOR_KEY) {
      throw illegalConstructorError("SizeWatcher.create");
    }

    const logger = debug
      ? new debug.Logger({ name: "SizeWatcher", logAtCreation: config })
      : null;

    const allSizeData = _.createWeakMap<Element, SizeData>();

    const allCallbacks = createXWeakMap<
      Element,
      Map<OnResizeHandler, CallbackEntry>
    >(() => _.createMap());

    // ----------

    const resizeHandler = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        processEntry(entry);
      }
    };

    // Don't debounce the observer, only callbacks.
    const xObserver = new XResizeObserver(resizeHandler);

    // ----------

    const fetchCurrentSize = async (
      target: SizeTarget | undefined,
    ): Promise<SizeData> => {
      const element = await fetchElement(target);
      const sizeData = allSizeData.get(element);
      if (sizeData) {
        return _.deepCopy(sizeData);
      }

      return _.createPromise((resolve) => {
        // Use a temp ResizeObserver
        const observer = _.createResizeObserver((entries) => {
          const sizeData = getSizeData(entries[0]);
          observer?.disconnect();
          resolve(sizeData); // no need to copy or save it
        });

        if (observer) {
          observer.observe(element);
        } else {
          // Warning would have already been logged by XResizeObserver
          resolve({
            border: { [_.S_WIDTH]: 0, [_.S_HEIGHT]: 0 },
            content: { [_.S_WIDTH]: 0, [_.S_HEIGHT]: 0 },
          });
        }
      });
    };

    // ----------

    const fetchOptions = async (
      options: OnResizeOptions,
    ): Promise<OnResizeOptionsInternal> => {
      const box = options.box ?? null;
      if (box && !isValidBox(box)) {
        throw usageError(`Unknown box type: '${box}'`);
      }

      const dimension = options.dimension ?? null;
      if (dimension && !isValidDimension(dimension)) {
        throw usageError(`Unknown dimension: '${dimension}'`);
      }

      return {
        _element: await fetchElement(_.targetOf(options)),
        _box: box,
        _dimension: dimension,
        // If threshold is 0, internally treat as 1 (pixel)
        _threshold:
          toNonNegNum(options.threshold, config._resizeThreshold) || 1,
        _debounceWindow: options[_.S_DEBOUNCE_WINDOW] ?? config._debounceWindow,
      };
    };

    // ----------

    const createCallback = (
      handler: OnResizeHandler,
      options: OnResizeOptionsInternal,
    ): CallbackEntry => {
      const element = options._element;
      _.remove(allCallbacks.get(element)?.get(handler)?._callback);

      debug: logger?.debug5("Adding/updating handler", options);
      const callback = wrapCallback(handler, options._debounceWindow);
      callback.onRemove(() => deleteHandler(handler, options));

      const entry = { _callback: callback, _options: options };
      allCallbacks.sGet(element).set(handler, entry);
      return entry;
    };

    // ----------

    const setupOnResize = async (
      handler: OnResizeHandler,
      userOptions: OnResizeOptions | undefined,
    ) => {
      const options = await fetchOptions(userOptions ?? {});
      const element = options._element;

      // Don't await for the size data before creating the callback so that
      // setupOnResize and removeOnResize have the same "timing" and therefore
      // calling onResize and offResize immediately without awaiting removes the
      // callback.
      const entry = createCallback(handler, options);
      const callback = entry._callback;
      const sizeData = await fetchCurrentSize(element);

      if (callback.isRemoved()) {
        return;
      }

      entry._data = sizeData;
      allSizeData.set(element, sizeData);

      // Always use observeLater. This is because the initial call to callback
      // shouldn't be debounced, and so we call it manually here, regardless if
      // it's a new target or not. Therefore we don't want the observer to also
      // call it in case it _is_ a new target.
      // It's ok if already observed, won't do anything.
      xObserver.observeLater(element);

      if (!userOptions?.skipInitial) {
        debug: logger?.debug5("Calling initially with", element, sizeData);
        // Use a one-off callback that's not debounced for the initial call.
        await invokeCallback(
          wrapCallback(handler),
          element,
          sizeData,
          void 0,
          this,
        );
      }
    };

    // ----------

    const removeOnResize = async (
      handler: OnResizeHandler,
      target: SizeTarget | undefined,
    ) => {
      const options = await fetchOptions({ target });
      const element = options._element;
      const currEntry = allCallbacks.get(element)?.get(handler);
      if (currEntry) {
        _.remove(currEntry._callback);

        if (handler === setSizeCssProps) {
          // delete the properties
          setSizeCssProps(element, null);
        }
      }
    };

    // ----------

    const deleteHandler = (
      handler: OnResizeHandler,
      options: OnResizeOptionsInternal,
    ) => {
      const element = options._element;
      _.deleteKey(allCallbacks.get(element), handler);
      allCallbacks.prune(element);

      if (!allCallbacks.has(element)) {
        debug: logger?.debug4(
          "No more callbacks for target; unobserving",
          element,
        );
        xObserver.unobserve(element);
        _.deleteKey(allSizeData, element);
      }
    };

    // ----------

    const processEntry = (entry: ResizeObserverEntry) => {
      // In reality, it can't be just a base Element
      const element = _.targetOf(entry);

      const latestData = getSizeData(entry);
      allSizeData.set(element, latestData);

      debug: logger?.debug9("New size data", element, latestData);

      for (const entry of allCallbacks.get(element)?.values() || []) {
        const thresholdsExceeded = hasExceededThreshold(
          entry._options,
          latestData,
          entry._data,
        );

        if (!thresholdsExceeded) {
          debug: logger?.debug9("Threshold not exceeded");
          continue;
        }

        invokeCallback(entry._callback, element, latestData, entry._data, this);
        entry._data = latestData;
      }
    };

    // ----------

    this.fetchCurrentSize = fetchCurrentSize;

    // ----------

    this.trackSize = async (handler?, options?) => {
      if (!handler) {
        handler = setSizeCssProps;
      }

      return setupOnResize(handler, options);
    };

    // ----------

    this.noTrackSize = (handler?, target?) => {
      if (!handler) {
        handler = setSizeCssProps;
      }

      removeOnResize(handler, target); // no need to await
    };

    // ----------

    this.onResize = setupOnResize;

    // ----------

    this.offResize = (handler, target?) => {
      removeOnResize(handler, target); // no need to await
    };
  }
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
 * The handler is invoked with four arguments:
 *
 * - The element that has been resized: if the target you requested was the
 *   viewport, then this will be a fixed positioned overlay that tracks the
 *   size of the viewport
 * - The {@link SizeData} for the element.
 * - (since v1.3.0) The {@link SizeData} for the element when the callback was
 *   last called. Will be `undefined` during the initial call.
 * - (since v1.3.0) The {@link SizeWatcher} instance.
 */
export type OnResizeHandlerArgs = [
  Element,
  SizeData,
  SizeData | undefined,
  SizeWatcher,
];
export type OnResizeCallback = Callback<OnResizeHandlerArgs>;
export type OnResizeHandler =
  | CallbackHandler<OnResizeHandlerArgs>
  | OnResizeCallback;

export type SizeData = Record<Box, Size>;

// ----------------------------------------

type SizeWatcherConfigInternal = {
  _debounceWindow: number;
  _resizeThreshold: number;
};

type OnResizeOptionsInternal = {
  _element: Element;
  _box: Box | null;
  _dimension: Dimension | null;
  _threshold: number;
  _debounceWindow: number;
};

type CallbackEntry = {
  _callback: OnResizeCallback;
  _options: OnResizeOptionsInternal;
  _data?: SizeData;
};

const CONSTRUCTOR_KEY: unique symbol = _.SYMBOL() as typeof CONSTRUCTOR_KEY;
const instances = _.createMap<string, SizeWatcher>();

const getConfig = (
  config: SizeWatcherConfig | undefined,
): SizeWatcherConfigInternal => {
  config ??= {};
  return {
    _debounceWindow: toNonNegNum(config[_.S_DEBOUNCE_WINDOW], 75),
    // If threshold is 0, internally treat as 1 (pixel)
    _resizeThreshold: toNonNegNum(config.resizeThreshold, 50) || 1,
  };
};

// --------------------

const hasExceededThreshold = (
  options: OnResizeOptionsInternal,
  latestData: SizeData,
  lastThresholdData: SizeData | undefined,
): boolean => {
  if (!lastThresholdData) {
    /* istanbul ignore */
    return false;
  }

  let box: Box, dim: Dimension;
  for (box in latestData) {
    if (options._box && options._box !== box) {
      continue;
    }

    for (dim in latestData[box]) {
      if (options._dimension && options._dimension !== dim) {
        continue;
      }

      const diff = _.abs(latestData[box][dim] - lastThresholdData[box][dim]);
      if (diff >= options._threshold) {
        return true;
      }
    }
  }

  return false;
};

const getSizeData = (entry: ResizeObserverEntry): SizeData => {
  const borderBox = getEntryBorderBox(entry, true);
  const contentBox = getEntryContentBox(entry);

  return {
    border: borderBox,
    content: contentBox,
  };
};

const setSizeCssProps = (
  element: Element,
  sizeData: SizeData | undefined | null,
) => {
  let prefix = "";
  if (element === tryGetViewportOverlay()) {
    // Set the CSS vars on the root element
    element = _.getDocElement();
    prefix = "window-";
  }

  const props = {
    borderWidth: sizeData?.border[_.S_WIDTH],
    borderHeight: sizeData?.border[_.S_HEIGHT],
    contentWidth: sizeData?.content[_.S_WIDTH],
    contentHeight: sizeData?.content[_.S_HEIGHT],
  };
  setNumericStyleJsVars(element, props, { _prefix: prefix }); // don't await here
};

const fetchElement = async (
  target: SizeTarget | undefined,
): Promise<Element> => {
  if (_.isElement(target)) {
    return target;
  }

  if (!target || target === _.getWindow()) {
    return fetchViewportOverlay();
  }

  if (target === _.getDoc()) {
    return _.getDocElement();
  }

  throw usageError("Unsupported resize target");
};

const invokeCallback = (
  callback: OnResizeCallback,
  element: Element,
  sizeData: SizeData,
  lastSizeData: SizeData | undefined,
  watcher: SizeWatcher,
) =>
  callback
    .invoke(
      element,
      _.deepCopy(sizeData),
      lastSizeData, // no need to copy that one as it's not used again
      watcher,
    )
    .catch(logError);

_.brandClass(SizeWatcher, "SizeWatcher");
