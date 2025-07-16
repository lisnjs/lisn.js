"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SizeWatcher = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _cssAlter = require("../utils/css-alter.cjs");
var _log = require("../utils/log.cjs");
var _math = require("../utils/math.cjs");
var _size = require("../utils/size.cjs");
var _text = require("../utils/text.cjs");
var _callback = require("../modules/callback.cjs");
var _xMap = require("../modules/x-map.cjs");
var _xResizeObserver = require("../modules/x-resize-observer.cjs");
var _debug = _interopRequireDefault(require("../debug/debug.cjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Watchers/SizeWatcher
 */
/**
 * {@link SizeWatcher} monitors the size of a given target. It's built on top
 * of {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver | ResizeObserver}.
 *
 * It manages registered callbacks globally and reuses ResizeObservers.
 *
 * Each instance of SizeWatcher manages up to two ResizeObservers: one
 * for content-box size changes and one for border-box size changes.
 */
class SizeWatcher {
  /**
   * Creates a new instance of SizeWatcher with the given
   * {@link SizeWatcherConfig}. It does not save it for future reuse.
   */
  static create(config = {}) {
    return new SizeWatcher(getConfig(config), CONSTRUCTOR_KEY);
  }

  /**
   * Returns an existing instance of SizeWatcher with the given
   * {@link SizeWatcherConfig}, or creates a new one.
   *
   * **NOTE:** It saves it for future reuse, so don't use this for temporary
   * short-lived watchers.
   */
  static reuse(config = {}) {
    const myConfig = getConfig(config);
    const configStrKey = (0, _text.objToStrKey)(myConfig);
    let instance = instances.get(configStrKey);
    if (!instance) {
      instance = new SizeWatcher(myConfig, CONSTRUCTOR_KEY);
      instances.set(configStrKey, instance);
    }
    return instance;
  }
  constructor(config, key) {
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
    _defineProperty(this, "onResize", void 0);
    /**
     * Removes a previously added handler.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target is invalid.
     */
    _defineProperty(this, "offResize", void 0);
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
    _defineProperty(this, "trackSize", void 0);
    /**
     * Removes a previously added handler for {@link trackSize}.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target is invalid.
     */
    _defineProperty(this, "noTrackSize", void 0);
    /**
     * Get the size of the given target. It will get the size from a
     * ResizeObserverEntry and so it's always delayed by one frame at least.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target is invalid.
     */
    _defineProperty(this, "fetchCurrentSize", void 0);
    if (key !== CONSTRUCTOR_KEY) {
      throw MH.illegalConstructorError("SizeWatcher.create");
    }
    const logger = _debug.default ? new _debug.default.Logger({
      name: "SizeWatcher",
      logAtCreation: config
    }) : null;
    const allSizeData = MH.newWeakMap();
    const allCallbacks = (0, _xMap.newXWeakMap)(() => MH.newMap());

    // ----------

    const resizeHandler = entries => {
      for (const entry of entries) {
        processEntry(entry);
      }
    };

    // Don't debounce the observer, only callbacks.
    const xObserver = new _xResizeObserver.XResizeObserver(resizeHandler);

    // ----------

    const fetchCurrentSize = async target => {
      const element = await fetchElement(target);
      const sizeData = allSizeData.get(element);
      if (sizeData) {
        return MH.copyObject(sizeData);
      }
      return MH.newPromise(resolve => {
        // Use a temp ResizeObserver
        const observer = MH.newResizeObserver(entries => {
          const sizeData = getSizeData(entries[0]);
          observer === null || observer === void 0 || observer.disconnect();
          resolve(sizeData); // no need to copy or save it
        });
        if (observer) {
          observer.observe(element);
        } else {
          // Warning would have already been logged by XResizeObserver
          resolve({
            border: {
              [MC.S_WIDTH]: 0,
              [MC.S_HEIGHT]: 0
            },
            content: {
              [MC.S_WIDTH]: 0,
              [MC.S_HEIGHT]: 0
            }
          });
        }
      });
    };

    // ----------

    const fetchOptions = async options => {
      var _options$box, _options$dimension, _options$MC$S_DEBOUNC;
      const box = (_options$box = options.box) !== null && _options$box !== void 0 ? _options$box : null;
      if (box && !(0, _size.isValidBox)(box)) {
        throw MH.usageError(`Unknown box type: '${box}'`);
      }
      const dimension = (_options$dimension = options.dimension) !== null && _options$dimension !== void 0 ? _options$dimension : null;
      if (dimension && !(0, _size.isValidDimension)(dimension)) {
        throw MH.usageError(`Unknown dimension: '${dimension}'`);
      }
      return {
        _element: await fetchElement(MH.targetOf(options)),
        _box: box,
        _dimension: dimension,
        // If threshold is 0, internally treat as 1 (pixel)
        _threshold: (0, _math.toNonNegNum)(options.threshold, config._resizeThreshold) || 1,
        _debounceWindow: (_options$MC$S_DEBOUNC = options[MC.S_DEBOUNCE_WINDOW]) !== null && _options$MC$S_DEBOUNC !== void 0 ? _options$MC$S_DEBOUNC : config._debounceWindow
      };
    };

    // ----------

    const createCallback = (handler, options) => {
      var _allCallbacks$get;
      const element = options._element;
      MH.remove((_allCallbacks$get = allCallbacks.get(element)) === null || _allCallbacks$get === void 0 || (_allCallbacks$get = _allCallbacks$get.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      debug: logger === null || logger === void 0 || logger.debug5("Adding/updating handler", options);
      const callback = (0, _callback.wrapCallback)(handler, options._debounceWindow);
      callback.onRemove(() => {
        deleteHandler(handler, options);
      });
      const entry = {
        _callback: callback,
        _options: options
      };
      allCallbacks.sGet(element).set(handler, entry);
      return entry;
    };

    // ----------

    const setupOnResize = async (handler, userOptions) => {
      const options = await fetchOptions(userOptions || {});
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
      if (!(userOptions !== null && userOptions !== void 0 && userOptions.skipInitial)) {
        debug: logger === null || logger === void 0 || logger.debug5("Calling initially with", element, sizeData);
        // Use a one-off callback that's not debounced for the initial call.
        await invokeCallback((0, _callback.wrapCallback)(handler), element, sizeData);
      }
    };

    // ----------

    const removeOnResize = async (handler, target) => {
      var _allCallbacks$get2;
      const options = await fetchOptions({
        target
      });
      const element = options._element;
      const currEntry = (_allCallbacks$get2 = allCallbacks.get(element)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2.get(handler);
      if (currEntry) {
        MH.remove(currEntry._callback);
        if (handler === setSizeCssProps) {
          // delete the properties
          setSizeCssProps(element, null);
        }
      }
    };

    // ----------

    const deleteHandler = (handler, options) => {
      const element = options._element;
      MH.deleteKey(allCallbacks.get(element), handler);
      allCallbacks.prune(element);
      if (!allCallbacks.has(element)) {
        debug: logger === null || logger === void 0 || logger.debug4("No more callbacks for target; unobserving", element);
        xObserver.unobserve(element);
        MH.deleteKey(allSizeData, element);
      }
    };

    // ----------

    const processEntry = entry => {
      // In reality, it can't be just a base Element
      const element = MH.targetOf(entry);
      const latestData = getSizeData(entry);
      allSizeData.set(element, latestData);
      debug: logger === null || logger === void 0 || logger.debug9("New size data", element, latestData);
      for (const entry of ((_allCallbacks$get3 = allCallbacks.get(element)) === null || _allCallbacks$get3 === void 0 ? void 0 : _allCallbacks$get3.values()) || []) {
        var _allCallbacks$get3;
        const thresholdsExceeded = hasExceededThreshold(entry._options, latestData, entry._data);
        if (!thresholdsExceeded) {
          debug: logger === null || logger === void 0 || logger.debug9("Threshold not exceeded");
          continue;
        }
        entry._data = latestData;
        invokeCallback(entry._callback, element, latestData);
      }
    };

    // ----------

    this.fetchCurrentSize = fetchCurrentSize;

    // ----------

    this.trackSize = async (handler, options) => {
      if (!handler) {
        handler = setSizeCssProps;
      }
      return setupOnResize(handler, options);
    };

    // ----------

    this.noTrackSize = (handler, target) => {
      if (!handler) {
        handler = setSizeCssProps;
      }
      removeOnResize(handler, target); // no need to await
    };

    // ----------

    this.onResize = setupOnResize;

    // ----------

    this.offResize = (handler, target) => {
      removeOnResize(handler, target); // no need to await
    };
  }
}

/**
 * @interface
 */

/**
 * @interface
 */

/**
 * The handler is invoked with three arguments:
 *
 * - the element that has been resized: if the target you requested was the
 *   viewport, then this will be a fixed positioned overlay that tracks the
 *   size of the viewport
 * - the {@link SizeData} for the element
 */

// ----------------------------------------
exports.SizeWatcher = SizeWatcher;
const CONSTRUCTOR_KEY = MC.SYMBOL();
const instances = MH.newMap();
const getConfig = config => {
  return {
    _debounceWindow: (0, _math.toNonNegNum)(config[MC.S_DEBOUNCE_WINDOW], 75),
    // If threshold is 0, internally treat as 1 (pixel)
    _resizeThreshold: (0, _math.toNonNegNum)(config.resizeThreshold, 50) || 1
  };
};

// --------------------

const hasExceededThreshold = (options, latestData, lastThresholdData) => {
  if (!lastThresholdData) {
    /* istanbul ignore */
    return false;
  }
  let box, dim;
  for (box in latestData) {
    if (options._box && options._box !== box) {
      continue;
    }
    for (dim in latestData[box]) {
      if (options._dimension && options._dimension !== dim) {
        continue;
      }
      const diff = MH.abs(latestData[box][dim] - lastThresholdData[box][dim]);
      if (diff >= options._threshold) {
        return true;
      }
    }
  }
  return false;
};
const getSizeData = entry => {
  const borderBox = (0, _size.getEntryBorderBox)(entry, true);
  const contentBox = (0, _size.getEntryContentBox)(entry);
  return {
    border: borderBox,
    content: contentBox
  };
};
const setSizeCssProps = (element, sizeData) => {
  let prefix = "";
  if (element === (0, _size.tryGetViewportOverlay)()) {
    // Set the CSS vars on the root element
    element = MH.getDocElement();
    prefix = "window-";
  }
  const props = {
    borderWidth: sizeData === null || sizeData === void 0 ? void 0 : sizeData.border[MC.S_WIDTH],
    borderHeight: sizeData === null || sizeData === void 0 ? void 0 : sizeData.border[MC.S_HEIGHT],
    contentWidth: sizeData === null || sizeData === void 0 ? void 0 : sizeData.content[MC.S_WIDTH],
    contentHeight: sizeData === null || sizeData === void 0 ? void 0 : sizeData.content[MC.S_HEIGHT]
  };
  (0, _cssAlter.setNumericStyleProps)(element, props, {
    _prefix: prefix
  }); // don't await here
};
const fetchElement = async target => {
  if (MH.isElement(target)) {
    return target;
  }
  if (!target || target === MH.getWindow()) {
    return (0, _size.fetchViewportOverlay)();
  }
  if (target === MH.getDoc()) {
    return MH.getDocElement();
  }
  throw MH.usageError("Unsupported resize target");
};
const invokeCallback = (callback, element, sizeData) => callback.invoke(element, MH.copyObject(sizeData)).catch(_log.logError);
//# sourceMappingURL=size-watcher.cjs.map