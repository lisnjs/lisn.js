"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollWatcher = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _cssAlter = require("../utils/css-alter.cjs");
var _directions = require("../utils/directions.cjs");
var _domAlter = require("../utils/dom-alter.cjs");
var _domOptimize = require("../utils/dom-optimize.cjs");
var _event = require("../utils/event.cjs");
var _log = require("../utils/log.cjs");
var _math = require("../utils/math.cjs");
var _scroll = require("../utils/scroll.cjs");
var _text = require("../utils/text.cjs");
var _validation = require("../utils/validation.cjs");
var _callback = require("../modules/callback.cjs");
var _xMap = require("../modules/x-map.cjs");
var _domWatcher = require("./dom-watcher.cjs");
var _sizeWatcher = require("./size-watcher.cjs");
var _debug = _interopRequireDefault(require("../debug/debug.cjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Watchers/ScrollWatcher
 */
// re-export for convenience

/**
 * {@link ScrollWatcher} listens for scroll events in any direction.
 *
 * It manages registered callbacks globally and reuses event listeners for more
 * efficient performance.
 */
class ScrollWatcher {
  /**
   * Returns the element that holds the main page content. By default it's
   * `document.body` but is overridden by
   * {@link Settings.settings.mainScrollableElementSelector}.
   *
   * It will wait for the element to be available if not already.
   */
  static fetchMainContentElement() {
    return (0, _scroll.fetchMainContentElement)();
  }

  /**
   * Returns the scrollable element that holds the wrapper around the main page
   * content. By default it's `document.scrollable` (unless `document.body` is
   * actually scrollable, in which case it will be used) but it will be
   * different if {@link Settings.settings.mainScrollableElementSelector} is set.
   *
   * It will wait for the element to be available if not already.
   */
  static fetchMainScrollableElement() {
    return (0, _scroll.fetchMainScrollableElement)();
  }

  /**
   * Creates a new instance of ScrollWatcher with the given
   * {@link ScrollWatcherConfig}. It does not save it for future reuse.
   */
  static create(config) {
    return new ScrollWatcher(getConfig(config), CONSTRUCTOR_KEY);
  }

  /**
   * Returns an existing instance of ScrollWatcher with the given
   * {@link ScrollWatcherConfig}, or creates a new one.
   *
   * **NOTE:** It saves it for future reuse, so don't use this for temporary
   * short-lived watchers.
   */
  static reuse(config) {
    const myConfig = getConfig(config);
    const configStrKey = (0, _text.objToStrKey)(myConfig);
    let instance = instances.get(configStrKey);
    if (!instance) {
      instance = new ScrollWatcher(myConfig, CONSTRUCTOR_KEY);
      instances.set(configStrKey, instance);
    }
    return instance;
  }
  constructor(config, key) {
    /**
     * Call the given handler whenever the given scrollable is scrolled.
     *
     * Unless {@link OnScrollOptions.skipInitial} is true, the handler is also
     * called (almost) immediately with the latest scroll data. If a scroll has
     * not yet been observed on the scrollable and its `scrollTop` and
     * `scrollLeft` are 0, then the direction is {@link Types.NoDirection} and
     * the handler is only called if {@link Types.NoDirection} is part of the
     * supplied {@link OnScrollOptions.directions | options.directions} (or
     * {@link OnScrollOptions.directions | options.directions} is not given).
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same scrollable, even if the options differ. If the handler has already
     * been added for this scrollable, either using {@link trackScroll} or using
     * {@link onScroll}, then it will be removed and re-added with the current
     * options. So if previously it was also tracking content size changes using
     * {@link trackScroll}, it will no longer do so.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the options are invalid.
     */
    _defineProperty(this, "onScroll", void 0);
    /**
     * Removes a previously added handler.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the scrollable is invalid.
     */
    _defineProperty(this, "offScroll", void 0);
    /**
     * This everything that {@link onScroll} does plus more:
     *
     * In addition to a scroll event, the handler is also called when either the
     * offset size or scroll (content) size of the scrollable changes as that
     * would affect its `scrollTopFraction` and `scrollLeftFraction` and possibly
     * the `scrollTop` and `scrollLeft` as well.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same scrollable, even if the options differ. If the handler has already
     * been added for this scrollable, either using {@link trackScroll} or using
     * {@link onScroll}, then it will be removed and re-added with the current
     * options.
     *
     * ------
     *
     * If `handler` is not given, then it defaults to an internal handler that
     * updates a set of CSS variables on the scrollable element's style:
     *
     * - If {@link OnScrollOptions.scrollable | options.scrollable} is not given,
     *   or is `null`, `window` or `document`, the following CSS variables are
     *   set on the root (`html`) element and represent the scroll of the
     *   {@link Settings.settings.mainScrollableElementSelector | the main scrolling element}:
     *   - `--lisn-js--page-scroll-top`
     *   - `--lisn-js--page-scroll-top-fraction`
     *   - `--lisn-js--page-scroll-left`
     *   - `--lisn-js--page-scroll-left-fraction`
     *   - `--lisn-js--page-scroll-width`
     *   - `--lisn-js--page-scroll-height`
     *
     * - Otherwise, the following variables are set on the scrollable itself,
     *   and represent its scroll offset:
     *   - `--lisn-js--scroll-top`
     *   - `--lisn-js--scroll-top-fraction`
     *   - `--lisn-js--scroll-left`
     *   - `--lisn-js--scroll-left-fraction`
     *   - `--lisn-js--scroll-width`
     *   - `--lisn-js--scroll-height`
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the options are invalid.
     */
    _defineProperty(this, "trackScroll", void 0);
    /**
     * Removes a previously added handler for {@link trackScroll}.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the scrollable is invalid.
     */
    _defineProperty(this, "noTrackScroll", void 0);
    /**
     * Get the scroll offset of the given scrollable. By default, it will
     * {@link waitForMeasureTime} and so will be delayed by one frame.
     *
     * @param realtime If true, it will not {@link waitForMeasureTime}. Use
     *                 this only when doing realtime scroll-based animations
     *                 as it may cause a forced layout.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the scrollable is invalid.
     */
    _defineProperty(this, "fetchCurrentScroll", void 0);
    /**
     * Scrolls the given scrollable element to in the given direction.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the direction or options are invalid.
     */
    _defineProperty(this, "scroll", void 0);
    /**
     * Scrolls the given scrollable element to the given `to` scrollable.
     *
     * Returns `null` if there's an ongoing scroll that is not cancellable.
     *
     * Note that if `to` is an element or a selector, then it _must_ be a
     * descendant of the scrollable element.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the "to" coordinates or options are invalid.
     *
     * @param to If this is an element, then its top-left position is used as
     *           the target coordinates. If it is a string, then it is treated
     *           as a selector for an element using `querySelector`.
     * @param [options.scrollable]
     *           If not given, it defaults to
     *           {@link Settings.settings.mainScrollableElementSelector | the main scrolling element}.
     *
     * @returns `null` if there's an ongoing scroll that is not cancellable,
     * otherwise a {@link ScrollAction}.
     */
    _defineProperty(this, "scrollTo", void 0);
    /**
     * Returns the current {@link ScrollAction} if any.
     *
     * @param scrollable If not given, it defaults to
     *                   {@link Settings.settings.mainScrollableElementSelector | the main scrolling element}
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the scrollable is invalid.
     */
    _defineProperty(this, "fetchCurrentScrollAction", void 0);
    /**
     * Cancels the ongoing scroll that's resulting from smooth scrolling
     * triggered in the past. Does not interrupt or prevent further scrolling.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the scrollable is invalid.
     *
     * @param [options.immediate] If true, then it will not use
     *                            {@link waitForMeasureTime} or
     *                            {@link Utils.waitForMutateTime | waitForMutateTime}.
     *                            Warning: this will likely result in forced layout.
     */
    _defineProperty(this, "stopUserScrolling", void 0);
    if (key !== CONSTRUCTOR_KEY) {
      throw MH.illegalConstructorError("ScrollWatcher.create");
    }
    const logger = _debug.default ? new _debug.default.Logger({
      name: "ScrollWatcher",
      logAtCreation: config
    }) : null;
    const allScrollData = MH.newWeakMap();
    const activeListeners = MH.newWeakMap();
    const allCallbacks = (0, _xMap.newXWeakMap)(() => MH.newMap());

    // ----------

    const fetchCurrentScroll = async (element, realtime = false, isScrollEvent = false) => {
      // The scroll data can change event without a scroll event, e.g. by the
      // element changing size, so always get the latest here.
      const previousEventData = allScrollData.get(element);
      const latestData = await fetchScrollData(element, previousEventData, realtime);

      // If there hasn't been a scroll event, use the old scroll direction
      if (!isScrollEvent && previousEventData) {
        latestData.direction = previousEventData.direction;
      }
      return latestData;
    };

    // ----------

    const createCallback = (handler, options, trackType) => {
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
        _trackType: trackType,
        _options: options
      };
      allCallbacks.sGet(element).set(handler, entry);
      return entry;
    };

    // ----------

    const setupOnScroll = async (handler, userOptions, trackType) => {
      const options = await fetchOnScrollOptions(config, userOptions !== null && userOptions !== void 0 ? userOptions : {});
      const element = options._element;

      // Don't await for the scroll data before creating the callback so that
      // setupOnScroll and removeOnScroll have the same "timing" and therefore
      // calling onScroll and offScroll immediately without awaiting removes the
      // callback.
      const entry = createCallback(handler, options, trackType);
      const callback = entry._callback;
      const eventTarget = options._eventTarget;
      const scrollData = await fetchCurrentScroll(element, options._debounceWindow === 0);
      if (callback.isRemoved()) {
        return;
      }
      entry._data = scrollData;
      allScrollData.set(element, scrollData);
      if (trackType === TRACK_FULL) {
        await setupSizeTrack(entry);
      }
      let listenerOptions = activeListeners.get(eventTarget);
      if (!listenerOptions) {
        debug: logger === null || logger === void 0 || logger.debug4("Adding scroll listener", eventTarget);
        listenerOptions = {
          _nRealtime: 0
        };
        activeListeners.set(eventTarget, listenerOptions);
        // Don't debounce the scroll handler, only the callbacks.
        (0, _event.addEventListenerTo)(eventTarget, MC.S_SCROLL, scrollHandler);
      }
      if (options._debounceWindow === 0) {
        listenerOptions._nRealtime++;
      }
      const directions = options._directions;
      if (!callback.isRemoved() && !(userOptions !== null && userOptions !== void 0 && userOptions.skipInitial) && directionMatches(directions, scrollData.direction)) {
        debug: logger === null || logger === void 0 || logger.debug5("Calling initially with", element, scrollData);
        // Use a one-off callback that's not debounced for the initial call.
        await invokeCallback((0, _callback.wrapCallback)(handler), element, scrollData);
      }
    };

    // ----------

    const removeOnScroll = async (handler, scrollable, trackType) => {
      var _allCallbacks$get2;
      const options = await fetchOnScrollOptions(config, {
        scrollable
      });
      const element = options._element;
      const currEntry = (_allCallbacks$get2 = allCallbacks.get(element)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2.get(handler);
      if ((currEntry === null || currEntry === void 0 ? void 0 : currEntry._trackType) === trackType) {
        MH.remove(currEntry._callback);
        if (handler === setScrollCssProps) {
          // delete the properties
          setScrollCssProps(element, null);
        }
      }
    };

    // ----------

    const deleteHandler = (handler, options) => {
      const element = options._element;
      const eventTarget = options._eventTarget;
      MH.deleteKey(allCallbacks.get(element), handler);
      allCallbacks.prune(element);
      const listenerOptions = activeListeners.get(eventTarget);
      if (listenerOptions && options._debounceWindow === 0) {
        listenerOptions._nRealtime--;
      }
      if (!allCallbacks.has(element)) {
        debug: logger === null || logger === void 0 || logger.debug4("No more callbacks for scrollable; removing listener", element);
        MH.deleteKey(allScrollData, element);
        (0, _event.removeEventListenerFrom)(eventTarget, MC.S_SCROLL, scrollHandler);
        MH.deleteKey(activeListeners, eventTarget);
        // TODO: Should we unwrap children if previously WE wrapped them?
      }
    };

    // ----------

    const setupSizeTrack = async entry => {
      const options = entry._options;
      const element = options._element;
      const scrollCallback = entry._callback;
      debug: logger === null || logger === void 0 || logger.debug8("Setting up size tracking", element);
      const doc = MH.getDoc();
      const docScrollingElement = MH.getDocScrollingElement();
      const resizeCallback = (0, _callback.wrapCallback)(async () => {
        // Get the latest scroll data for the scrollable
        // Currently, the resize callback is already delayed by a frame due to
        // the SizeWatcher, so we don't need to treat this as realtime.
        const latestData = await fetchCurrentScroll(element);
        const thresholdsExceeded = hasExceededThreshold(options, latestData, entry._data);
        if (!thresholdsExceeded) {
          debug: logger === null || logger === void 0 || logger.debug9("Threshold not exceeded", options, latestData, entry._data);
        } else if (!scrollCallback.isRemoved()) {
          await invokeCallback(scrollCallback, element, latestData);
        }
      });
      scrollCallback.onRemove(resizeCallback.remove);

      // Don't use default instance as it has a high threshold.
      const sizeWatcher = _sizeWatcher.SizeWatcher.reuse();
      const setupOnResize = target => sizeWatcher.onResize(resizeCallback, {
        target,
        [MC.S_DEBOUNCE_WINDOW]: options._debounceWindow,
        // TODO maybe accepts resizeThreshold option
        threshold: options._threshold
      });
      if (element === docScrollingElement) {
        // In case we're tracking the main document scroll, then we only need to
        // observe the viewport size and the size of the documentElement (which is
        // the content size).

        setupOnResize(); // viewport size
        setupOnResize(doc); // content size

        return;
      }

      // ResizeObserver only detects changes in offset width/height which is
      // the visible size of the scrolling element, and that is not affected by the
      // size of its content.
      // But we also need to detect changes in the scroll width/height which is
      // the size of the content.
      // We also need to keep track of elements being added to the scrollable element.

      const observedElements = MH.newSet([element]);

      // Observe the scrolling element
      setupOnResize(element);

      // And also its children (if possible, a single wrapper around them
      const wrapper = await (0, _domAlter.tryWrapContent)(element, {
        _classNames: [MC.PREFIX_WRAPPER, PREFIX_WRAPPER]
      });
      if (wrapper) {
        setupOnResize(wrapper);
        observedElements.add(wrapper);

        //
      } else {
        for (const child of MH.childrenOf(element)) {
          setupOnResize(child);
          observedElements.add(child);
        }
      }

      // Watch for newly added elements
      const domWatcher = _domWatcher.DOMWatcher.create({
        root: element,
        // only direct children
        subtree: false
      });
      const onAddedCallback = (0, _callback.wrapCallback)(operation => {
        const child = MH.currentTargetOf(operation);
        // If we've just added the wrapper, it will be in DOMWatcher's queue,
        // so check.
        if (child !== wrapper) {
          if (wrapper) {
            // Move this child into the wrapper. If this results in change of size
            // for wrapper, SizeWatcher will call us.
            (0, _domAlter.moveElement)(child, {
              to: wrapper,
              ignoreMove: true
            });
          } else {
            // Track the size of this child.
            // Don't skip initial, call the callback now
            setupOnResize(child);
            observedElements.add(child);
          }
        }
      });
      domWatcher.onMutation(onAddedCallback, {
        categories: [MC.S_ADDED]
      });
      resizeCallback.onRemove(onAddedCallback.remove);
    };

    // ----------

    const scrollHandler = async event => {
      var _activeListeners$get$, _activeListeners$get;
      // We cannot use event.currentTarget because scrollHandler is called inside
      // a setTimeout so by that time, currentTarget is null or something else.
      //
      // However, target and currentTarget only differ when the event is in the
      // bubbling or capturing phase. Because
      //
      // - the scroll event only bubbles when fired on document, and (it only
      //   bubbles up to window)
      // - and we never attach the listener to the capturing phase
      // - and we always use document instead of window to listen for scroll on
      //   document
      //
      // then event.target suffices.
      const scrollable = MH.targetOf(event);
      /* istanbul ignore next */
      if (!scrollable || !(MH.isElement(scrollable) || MH.isDoc(scrollable))) {
        return;
      }
      const element = await (0, _scroll.fetchScrollableElement)(scrollable);
      const realtime = ((_activeListeners$get$ = (_activeListeners$get = activeListeners.get(scrollable)) === null || _activeListeners$get === void 0 ? void 0 : _activeListeners$get._nRealtime) !== null && _activeListeners$get$ !== void 0 ? _activeListeners$get$ : 0) > 0;
      const latestData = await fetchCurrentScroll(element, realtime, true);
      allScrollData.set(element, latestData);
      debug: logger === null || logger === void 0 || logger.debug9("Scroll event", element, latestData);
      for (const entry of ((_allCallbacks$get3 = allCallbacks.get(element)) === null || _allCallbacks$get3 === void 0 ? void 0 : _allCallbacks$get3.values()) || []) {
        var _allCallbacks$get3;
        // Consider the direction since the last scroll event and not the
        // direction based on the largest delta the last time the callback
        // was called.
        const options = entry._options;
        const thresholdsExceeded = hasExceededThreshold(options, latestData, entry._data);
        if (!thresholdsExceeded) {
          debug: logger === null || logger === void 0 || logger.debug9("Threshold not exceeded", options, latestData, entry._data);
          continue;
        }

        // If threshold has been exceeded, always update the latest data for
        // this callback.
        entry._data = latestData;
        if (!directionMatches(options._directions, latestData.direction)) {
          debug: logger === null || logger === void 0 || logger.debug9("Direction does not match", options, latestData);
          continue;
        }
        invokeCallback(entry._callback, element, latestData);
      }
    };

    // ----------

    this.fetchCurrentScroll = (scrollable, realtime) => (0, _scroll.fetchScrollableElement)(scrollable).then(element => fetchCurrentScroll(element, realtime));

    // ----------

    this.scroll = (direction, options) => {
      var _options$amount;
      if (!(0, _scroll.isValidScrollDirection)(direction)) {
        throw MH.usageError(`Unknown scroll direction: '${direction}'`);
      }
      const isVertical = direction === MC.S_UP || direction === MC.S_DOWN;
      const sign = direction === MC.S_UP || direction === MC.S_LEFT ? -1 : 1;
      let targetCoordinate;
      const amount = (_options$amount = options === null || options === void 0 ? void 0 : options.amount) !== null && _options$amount !== void 0 ? _options$amount : 100;
      const asFractionOf = options === null || options === void 0 ? void 0 : options.asFractionOf;
      if (asFractionOf === "visible") {
        targetCoordinate = isVertical ? el => el[MC.S_SCROLL_TOP] + sign * amount * (0, _scroll.getClientHeightNow)(el) / 100 : el => el[MC.S_SCROLL_LEFT] + sign * amount * (0, _scroll.getClientWidthNow)(el) / 100;

        //
      } else if (asFractionOf === "content") {
        targetCoordinate = isVertical ? el => el[MC.S_SCROLL_TOP] + sign * amount * el[MC.S_SCROLL_HEIGHT] / 100 : el => el[MC.S_SCROLL_LEFT] + sign * amount * el[MC.S_SCROLL_WIDTH] / 100;

        //
      } else if (asFractionOf !== undefined && asFractionOf !== "pixel") {
        throw MH.usageError(`Unknown 'asFractionOf' keyword: '${asFractionOf}'`);

        //
      } else {
        targetCoordinate = isVertical ? el => el[MC.S_SCROLL_TOP] + sign * amount : el => el[MC.S_SCROLL_LEFT] + sign * amount;
      }
      const target = isVertical ? {
        top: targetCoordinate
      } : {
        left: targetCoordinate
      };
      return this.scrollTo(target, options);
    };

    // ----------

    this.scrollTo = async (to, options) => {
      var _options$duration;
      return (0, _scroll.scrollTo)(to, MH.merge(options, {
        duration: (_options$duration = options === null || options === void 0 ? void 0 : options.duration) !== null && _options$duration !== void 0 ? _options$duration : config._scrollDuration,
        // default
        scrollable: await (0, _scroll.fetchScrollableElement)(options === null || options === void 0 ? void 0 : options.scrollable) // override
      }));
    };

    // ----------

    this.fetchCurrentScrollAction = scrollable => (0, _scroll.fetchScrollableElement)(scrollable).then(element => (0, _scroll.getCurrentScrollAction)(element));

    // ----------

    this.stopUserScrolling = async options => {
      const element = await (0, _scroll.fetchScrollableElement)(options === null || options === void 0 ? void 0 : options.scrollable);
      const stopScroll = () => MH.elScrollTo(element, {
        top: element[MC.S_SCROLL_TOP],
        left: element[MC.S_SCROLL_LEFT]
      });
      if (options !== null && options !== void 0 && options.immediate) {
        stopScroll();
      } else {
        (0, _domOptimize.waitForMeasureTime)().then(stopScroll);
      }
    };

    // ----------

    this.trackScroll = (handler, options) => {
      if (!handler) {
        handler = setScrollCssProps;
      }
      return setupOnScroll(handler, options, TRACK_FULL);
    };

    // ----------

    this.noTrackScroll = (handler, scrollable) => {
      if (!handler) {
        handler = setScrollCssProps;
      }
      removeOnScroll(handler, scrollable, TRACK_FULL); // no need to await
    };

    // ----------

    this.onScroll = (handler, options) => setupOnScroll(handler, options, TRACK_REGULAR);

    // ----------

    this.offScroll = (handler, scrollable) => {
      removeOnScroll(handler, scrollable, TRACK_REGULAR); // no need to await
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
 * @interface
 */

/**
 * The handler is invoked with two arguments:
 *
 * - the element that has been resized
 * - the {@link ScrollData} for the element
 */

// ----------------------------------------
exports.ScrollWatcher = ScrollWatcher;
const CONSTRUCTOR_KEY = MC.SYMBOL();
const instances = MH.newMap();
const PREFIX_WRAPPER = MH.prefixName("scroll-watcher-wrapper");
const getConfig = config => {
  config !== null && config !== void 0 ? config : config = {};
  return {
    _debounceWindow: (0, _math.toNonNegNum)(config[MC.S_DEBOUNCE_WINDOW], 75),
    // If threshold is 0, internally treat as 1 (pixel)
    _scrollThreshold: (0, _math.toNonNegNum)(config.scrollThreshold, 50) || 1,
    _scrollDuration: (0, _math.toNonNegNum)(config.scrollDuration, 1000)
  };
};
const TRACK_REGULAR = 1; // only scroll events
const TRACK_FULL = 2; // scroll + resizing of content and/or wrapper

// --------------------

const fetchOnScrollOptions = async (config, options) => {
  var _options$MC$S_DEBOUNC;
  const directions = (0, _validation.validateStrList)("directions", options.directions, _scroll.isValidScrollDirection) || null;
  const element = await (0, _scroll.fetchScrollableElement)(options.scrollable);
  return {
    _element: element,
    _eventTarget: getEventTarget(element),
    _directions: directions,
    // If threshold is 0, internally treat as 1 (pixel)
    _threshold: (0, _math.toNonNegNum)(options.threshold, config._scrollThreshold) || 1,
    _debounceWindow: (_options$MC$S_DEBOUNC = options[MC.S_DEBOUNCE_WINDOW]) !== null && _options$MC$S_DEBOUNC !== void 0 ? _options$MC$S_DEBOUNC : config._debounceWindow
  };
};
const directionMatches = (userDirections, latestDirection) => !userDirections || MH.includes(userDirections, latestDirection);
const hasExceededThreshold = (options, latestData, lastThresholdData) => {
  const directions = options._directions;
  const threshold = options._threshold;
  if (!lastThresholdData) {
    /* istanbul ignore */
    return false;
  }
  const topDiff = (0, _math.maxAbs)(latestData[MC.S_SCROLL_TOP] - lastThresholdData[MC.S_SCROLL_TOP], latestData[MC.S_SCROLL_HEIGHT] - lastThresholdData[MC.S_SCROLL_HEIGHT], latestData[MC.S_CLIENT_HEIGHT] - lastThresholdData[MC.S_CLIENT_HEIGHT]);
  const leftDiff = (0, _math.maxAbs)(latestData[MC.S_SCROLL_LEFT] - lastThresholdData[MC.S_SCROLL_LEFT], latestData[MC.S_SCROLL_WIDTH] - lastThresholdData[MC.S_SCROLL_WIDTH], latestData[MC.S_CLIENT_WIDTH] - lastThresholdData[MC.S_CLIENT_WIDTH]);

  // If the callback is only interested in up/down, then only check the
  // scrollTop delta, and similarly for left/right.
  let checkTop = false,
    checkLeft = false;
  if (!directions || MH.includes(directions, MC.S_NONE) || MH.includes(directions, MC.S_AMBIGUOUS)) {
    checkTop = checkLeft = true;
  } else {
    if (MH.includes(directions, MC.S_UP) || MH.includes(directions, MC.S_DOWN)) {
      checkTop = true;
    }
    if (MH.includes(directions, MC.S_LEFT) || MH.includes(directions, MC.S_RIGHT)) {
      checkLeft = true;
    }
  }
  return checkTop && topDiff >= threshold || checkLeft && leftDiff >= threshold;
};
const fetchScrollData = async (element, previousEventData, realtime) => {
  var _previousEventData$sc, _previousEventData$sc2;
  if (!realtime) {
    await (0, _domOptimize.waitForMeasureTime)();
  }
  const scrollTop = MH.ceil(element[MC.S_SCROLL_TOP]);
  const scrollLeft = MH.ceil(element[MC.S_SCROLL_LEFT]);
  const scrollWidth = element[MC.S_SCROLL_WIDTH];
  const scrollHeight = element[MC.S_SCROLL_HEIGHT];
  const clientWidth = (0, _scroll.getClientWidthNow)(element);
  const clientHeight = (0, _scroll.getClientHeightNow)(element);
  const scrollTopFraction = MH.round(scrollTop) / (scrollHeight - clientHeight || MC.INFINITY);
  const scrollLeftFraction = MH.round(scrollLeft) / (scrollWidth - clientWidth || MC.INFINITY);
  const prevScrollTop = (_previousEventData$sc = previousEventData === null || previousEventData === void 0 ? void 0 : previousEventData.scrollTop) !== null && _previousEventData$sc !== void 0 ? _previousEventData$sc : 0;
  const prevScrollLeft = (_previousEventData$sc2 = previousEventData === null || previousEventData === void 0 ? void 0 : previousEventData.scrollLeft) !== null && _previousEventData$sc2 !== void 0 ? _previousEventData$sc2 : 0;
  const direction = (0, _directions.getMaxDeltaDirection)(scrollLeft - prevScrollLeft, scrollTop - prevScrollTop);
  return {
    direction,
    [MC.S_CLIENT_WIDTH]: clientWidth,
    [MC.S_CLIENT_HEIGHT]: clientHeight,
    [MC.S_SCROLL_WIDTH]: scrollWidth,
    [MC.S_SCROLL_HEIGHT]: scrollHeight,
    [MC.S_SCROLL_TOP]: scrollTop,
    [MC.S_SCROLL_TOP_FRACTION]: scrollTopFraction,
    [MC.S_SCROLL_LEFT]: scrollLeft,
    [MC.S_SCROLL_LEFT_FRACTION]: scrollLeftFraction
  };
};
const setScrollCssProps = (element, scrollData) => {
  let prefix = "";
  if (element === (0, _scroll.tryGetMainScrollableElement)()) {
    // Set the CSS vars on the root element
    element = MH.getDocElement();
    prefix = "page-";
  }
  scrollData !== null && scrollData !== void 0 ? scrollData : scrollData = {};
  const props = {
    [MC.S_SCROLL_TOP]: scrollData[MC.S_SCROLL_TOP],
    [MC.S_SCROLL_TOP_FRACTION]: scrollData[MC.S_SCROLL_TOP_FRACTION],
    [MC.S_SCROLL_LEFT]: scrollData[MC.S_SCROLL_LEFT],
    [MC.S_SCROLL_LEFT_FRACTION]: scrollData[MC.S_SCROLL_LEFT_FRACTION],
    [MC.S_SCROLL_WIDTH]: scrollData[MC.S_SCROLL_WIDTH],
    [MC.S_SCROLL_HEIGHT]: scrollData[MC.S_SCROLL_HEIGHT]
  };
  (0, _cssAlter.setNumericStyleJsVars)(element, props, {
    _prefix: prefix
  });
};
const getEventTarget = element => {
  if (element === MH.getDocScrollingElement()) {
    return MH.getDoc();
  }
  return element;
};
const invokeCallback = (callback, element, scrollData) => callback.invoke(element, MH.copyObject(scrollData)).catch(_log.logError);
//# sourceMappingURL=scroll-watcher.cjs.map