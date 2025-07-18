function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Watchers/ViewWatcher
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { setNumericStyleJsVars } from "../utils/css-alter.js";
import { waitForInteractive } from "../utils/dom-events.js";
import { waitForMeasureTime, waitForSubsequentMeasureTime } from "../utils/dom-optimize.js";
import { logError } from "../utils/log.js";
import { omitKeys, compareValuesIn } from "../utils/misc.js";
import { createOverlay } from "../utils/overlays.js";
import { getClosestScrollable } from "../utils/scroll.js";
import { fetchViewportSize } from "../utils/size.js";
import { toMargins, objToStrKey } from "../utils/text.js";
import { VIEWS_SPACE, getViewsBitmask, parseScrollOffset } from "../utils/views.js";
import { wrapCallback } from "../modules/callback.js";
import { newXMap, newXWeakMap } from "../modules/x-map.js";
import { XIntersectionObserver } from "../modules/x-intersection-observer.js";
import { DOMWatcher } from "./dom-watcher.js";
import { ScrollWatcher } from "./scroll-watcher.js";
import { SizeWatcher } from "./size-watcher.js";
import debug from "../debug/debug.js";

/**
 * {@link ViewWatcher} monitors the position of a given target relative to the
 * given {@link ViewWatcherConfig.root | root} or the viewport.
 *
 * It's built on top of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver | IntersectionObserver}.
 *
 * It manages registered callbacks globally and reuses IntersectionObservers
 * for more efficient performance.
 */
export class ViewWatcher {
  /**
   * Creates a new instance of ViewWatcher with the given
   * {@link ViewWatcherConfig}. It does not save it for future reuse.
   */
  static create(config) {
    return new ViewWatcher(getConfig(config), CONSTRUCTOR_KEY);
  }

  /**
   * Returns an existing  instance of ViewWatcher with the given
   * {@link ViewWatcherConfig}, or creates a new one.
   *
   * **NOTE:** It saves it for future reuse, so don't use this for temporary
   * short-lived watchers.
   */
  static reuse(config) {
    var _instances$get;
    const myConfig = getConfig(config);
    const configStrKey = objToStrKey(omitKeys(myConfig, {
      _root: null
    }));
    let instance = (_instances$get = instances.get(myConfig._root)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(configStrKey);
    if (!instance) {
      instance = new ViewWatcher(myConfig, CONSTRUCTOR_KEY);
      instances.sGet(myConfig._root).set(configStrKey, instance);
    }
    return instance;
  }
  constructor(config, key) {
    /**
     * Call the given handler whenever the {@link ViewWatcherConfig.root | root}'s
     * view relative to the target position changes, i.e. when the target enters
     * or leaves the root.
     *
     * Unless {@link OnViewOptions.skipInitial} is true, the handler is also
     * called (almost) immediately with the current view if it matches this
     * set of options*.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same target, even if the options differ. If the handler has already been
     * added for this target, either using {@link trackView} or using
     * {@link onView}, then it will be removed and re-added with the current
     * options. So if previously it was also tracking position across root
     * using {@link trackView}, it will no longer do so.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target or the options are invalid.
     */
    _defineProperty(this, "onView", void 0);
    /**
     * Removes a previously added handler.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target is invalid.
     */
    _defineProperty(this, "offView", void 0);
    /**
     * This does more than just {@link onView}. The difference is that in
     * addition to a change of {@link View}, such as the target entering or
     * leaving the ViewWatcher's {@link ViewWatcherConfig.root | root} (by
     * default the viewport), the handler is also called each time the target's
     * relative view changes _while inside the root_.
     *
     * A change of relative position happens when:
     * - the target is resized
     * - the root is resized
     * - the any of the target's scrollable ancestors is scrolled
     * - the target's attributes changed that resulted in a change of position
     *
     * All of the above are accounted for. Internally it uses
     * {@link ScrollWatcher}, {@link DOMWatcher} and {@link SizeWatcher} to keep
     * track of all of this.
     *
     * If the target is leaves the ViewWatcher's
     * {@link ViewWatcherConfig.root | root}, the handler will be called with
     * the {@link ViewData}, and the above events will stop being tracked until
     * the target enters the watcher's root again.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same target, even if the options differ. If the handler has already been
     * added for this target, either using {@link trackView} or using
     * {@link onView}, then it will be removed and re-added with the current
     * options.
     *
     * ------
     *
     * If `handler` is not given, then it defaults to an internal handler that
     * updates the following set of CSS variables on the target's style and
     * represent its relative position:
     *
     * - `--lisn-js--r-top`
     * - `--lisn-js--r-bottom`
     * - `--lisn-js--r-left`
     * - `--lisn-js--r-right`
     * - `--lisn-js--r-width`
     * - `--lisn-js--r-height`
     * - `--lisn-js--r-h-middle`
     * - `--lisn-js--r-v-middle`
     *
     * See {@link ViewData.relative} for an explanation of each.
     *
     * Note that only Element targets are supported here and not offsets.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target or "views" are invalid.
     */
    _defineProperty(this, "trackView", void 0);
    /**
     * Removes a previously added handler for {@link trackView}.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target is invalid.
     */
    _defineProperty(this, "noTrackView", void 0);
    /**
     * Get the current view relative to the target. By default, it will
     * {@link waitForMeasureTime} and so will be delayed by one frame.
     *
     * @param realtime If true, it will not {@link waitForMeasureTime}. Use
     *                 this only when doing realtime scroll-based animations
     *                 as it may cause a forced layout.
     */
    _defineProperty(this, "fetchCurrentView", void 0);
    if (key !== CONSTRUCTOR_KEY) {
      throw MH.illegalConstructorError("ViewWatcher.create");
    }
    const logger = debug ? new debug.Logger({
      name: "ViewWatcher",
      logAtCreation: config
    }) : null;
    const allViewData = MH.newWeakMap();
    const allCallbacks = newXWeakMap(() => MH.newMap());
    const intersectionHandler = entries => {
      debug: logger === null || logger === void 0 || logger.debug9(`Got ${entries.length} new entries`, entries);
      for (const entry of entries) {
        processEntry(entry);
      }
    };
    const observeOptions = {
      root: config._root,
      threshold: config._threshold,
      rootMargin: config._rootMargin
    };
    const xObserver = new XIntersectionObserver(intersectionHandler, observeOptions);

    // ----------

    const fetchCurrentView = (element, realtime = false) => {
      const fetchData = async entryOrElement => {
        const intersection = await fetchIntersectionData(config, entryOrElement, realtime);
        const data = await fetchViewData(intersection, realtime);
        return data;
      };
      if (realtime) {
        return fetchData(element);
      }
      return MH.newPromise(resolve => {
        // Use a temp IntersectionObserver
        const observer = MH.newIntersectionObserver(entries => {
          const promise = fetchData(entries[0]);
          observer.disconnect();
          promise.then(resolve);
        }, observeOptions);
        observer.observe(element);
      });
    };

    // ----------

    const createCallback = (handler, options, trackType) => {
      var _allCallbacks$get;
      const element = options._element;
      MH.remove((_allCallbacks$get = allCallbacks.get(element)) === null || _allCallbacks$get === void 0 || (_allCallbacks$get = _allCallbacks$get.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      debug: logger === null || logger === void 0 || logger.debug5("Adding/updating handler", options);
      const callback = wrapCallback(handler);
      callback.onRemove(() => {
        deleteHandler(handler, options);
      });
      allCallbacks.sGet(element).set(handler, {
        _callback: callback,
        _trackType: trackType,
        _options: options
      });
      return callback;
    };

    // ----------

    const setupOnView = async (target, handler, userOptions, trackType) => {
      const options = await fetchOptions(config._root, target, userOptions);
      const element = options._element;
      const callback = createCallback(handler, options, trackType);

      // View watcher should be used before the DOM is loaded since the initial
      // size of the root may be 0 or close to 0 and would lead to premature
      // triggering.
      await waitForInteractive();

      // Initial call doesn't need to be realtime, and best to use an actual
      // IntersectionObserverEntry for that one.
      let viewData = await fetchCurrentView(element);
      if (viewData.rootBounds[MC.S_WIDTH] === 0 && viewData.rootBounds[MC.S_HEIGHT] === 0) {
        // Possibly the root is being setup now, wait for one AF
        debug: logger === null || logger === void 0 || logger.debug5("Got zero root size, deferring for a bit", config._root);
        await waitForSubsequentMeasureTime();
        viewData = await fetchCurrentView(element);
      }
      if (trackType === TRACK_FULL) {
        // Detect resize or scroll
        await setupInviewTrack(options, callback, viewData);
      }
      if (callback.isRemoved()) {
        return;
      }

      // Always use observeLater to skip the initial call from the
      // IntersectionObserver, and call callbacks that have skipInitial: false
      // here. Otherwise, we can't tell from inside the intersectionHandler whether
      // a callback wants to skip its initial call or not.
      //
      // It's ok if already observed, won't do anything.
      xObserver.observeLater(element);
      if (!(userOptions !== null && userOptions !== void 0 && userOptions.skipInitial)) {
        debug: logger === null || logger === void 0 || logger.debug5("Calling initially with", element, viewData);
        if (viewsToBitmask(viewData.views) & options._viewsBitmask) {
          await invokeCallback(callback, element, viewData);
        }
      }
    };

    // ----------

    const removeOnView = async (target, handler, trackType) => {
      var _allCallbacks$get2;
      // For time sync, so that if called immediately after onView without
      // awaiting, it will remove the callback that is about to be added.
      // But if no such handler has been added we may unnecessarily
      // create an overlay... TODO
      const options = await fetchOptions(config._root, target, {});
      const element = options._element;
      const currEntry = (_allCallbacks$get2 = allCallbacks.get(element)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2.get(handler);
      if ((currEntry === null || currEntry === void 0 ? void 0 : currEntry._trackType) === trackType) {
        MH.remove(currEntry._callback);
        if (handler === setViewCssProps) {
          // delete the properties
          setViewCssProps(element, null);
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
        MH.deleteKey(allViewData, element);
      }
    };

    // ----------

    const processEntry = async entry => {
      // In reality, it can't be just a base Element
      const element = MH.targetOf(entry);

      // This doesn't need to be "realtime", since IntersectionObserver alone
      // introduces a delay.
      const intersection = await fetchIntersectionData(config, entry);
      const latestData = await fetchViewData(intersection);
      debug: logger === null || logger === void 0 || logger.debug9("Got ViewData", element, latestData);
      const viewsBitmask = viewsToBitmask(latestData.views);
      for (const entry of ((_allCallbacks$get3 = allCallbacks.get(element)) === null || _allCallbacks$get3 === void 0 ? void 0 : _allCallbacks$get3.values()) || []) {
        var _allCallbacks$get3;
        if (viewsBitmask & entry._options._viewsBitmask) {
          invokeCallback(entry._callback, element, latestData);
        }
      }
    };

    // ----------

    const setupInviewTrack = async (options, viewCallback, viewData) => {
      const element = options._element;
      debug: logger === null || logger === void 0 || logger.debug8("Setting up size, scroll and attribute tracking", element);
      const sizeWatcher = SizeWatcher.reuse();
      const scrollWatcher = ScrollWatcher.reuse();
      const realtime = options._debounceWindow === 0;

      // Detect when target's class or style attribute change
      const domWatcher = DOMWatcher.create({
        root: element,
        // only direct children
        subtree: false
      });

      // We need to remove the tracking callback when target leaves view and re-add
      // it when it enters view. But the OnViewCallback that is associated may have
      // already been added prior, by calling onView with this handler, so we can't
      // always wrap around it, in order to detect when it's called with a change
      // of view. So we setup another OnViewCallback tied to the tracking callback.
      let isInview = false;
      let removeTrackCallback = null;

      // Finds any scrollable ancestors of the element and detect scroll on them.
      const scrollableAncestors = await fetchScrollableAncestors(element, realtime);
      if (viewCallback.isRemoved()) {
        return;
      }
      const addTrackCallback = () => {
        var _config$_root;
        const trackCallback = wrapCallback(async () => {
          const prevData = allViewData.get(element);

          // Get the latest view data for the target
          const latestData = await fetchCurrentView(element, realtime);
          debug: logger === null || logger === void 0 || logger.debug9("Got ViewData", element, latestData);
          const changed = viewChanged(latestData, prevData);
          if (changed) {
            // When comparing for changes, we round the numbers to certain number
            // of decimal places, and allViewData serves as a "last threshold"
            // state, so only update it if there was a significant change.
            // Otherwise very quick changes in small increments would get
            // rejected as "no change".
            allViewData.set(element, latestData);
            if (isInview && !viewCallback.isRemoved()) {
              // Could have been removed during the debounce window
              await invokeCallback(viewCallback, element, latestData);
            }
          } else {
            debug: logger === null || logger === void 0 || logger.debug9("ViewData same as last");
          }
        });

        // TODO Is there a better way to detect when it's moved?
        viewCallback.onRemove(trackCallback.remove);
        removeTrackCallback = trackCallback.remove;

        // Detect when target's class or style attribute change
        domWatcher.onMutation(trackCallback, {
          categories: [MC.S_ATTRIBUTE],
          [MC.S_SKIP_INITIAL]: true
        });

        // Detect when target is resized
        sizeWatcher.onResize(trackCallback, {
          target: element,
          [MC.S_DEBOUNCE_WINDOW]: options._debounceWindow,
          threshold: options._resizeThreshold,
          [MC.S_SKIP_INITIAL]: true
        });

        // Detect when the root is resized
        sizeWatcher.onResize(trackCallback, {
          target: (_config$_root = config._root) !== null && _config$_root !== void 0 ? _config$_root : MH.getWindow(),
          [MC.S_DEBOUNCE_WINDOW]: options._debounceWindow,
          threshold: options._resizeThreshold,
          [MC.S_SKIP_INITIAL]: true
        });

        // Detect when the target's scrollable ancestors are scrolled (this
        // will almost certainly include the main scrollable element).
        for (const ancestor of scrollableAncestors) {
          scrollWatcher.onScroll(trackCallback, {
            scrollable: ancestor,
            [MC.S_DEBOUNCE_WINDOW]: options._debounceWindow,
            threshold: options._scrollThreshold,
            [MC.S_SKIP_INITIAL]: true
          });
        }
      };
      const enterOrLeaveCallback = createCallback((target__ignored, viewData) => {
        if (viewData.views[0] === MC.S_AT) {
          if (!isInview) {
            isInview = true;
            addTrackCallback();
          }
        } else if (removeTrackCallback) {
          isInview = false;
          removeTrackCallback();
          removeTrackCallback = null;
        }
      }, MH.assign(options, {
        _viewsBitmask: VIEWS_SPACE.bitmask
      }), TRACK_REGULAR);
      viewCallback.onRemove(enterOrLeaveCallback.remove);
      allViewData.set(element, viewData); // to avoid duplicate initial call
      // Setup the track and the "inView" state
      if (!enterOrLeaveCallback.isRemoved()) {
        invokeCallback(enterOrLeaveCallback, element, viewData);
      }
    };

    // ----------

    this.fetchCurrentView = (target, realtime = false) => fetchElement(config._root, target).then(element => fetchCurrentView(element, realtime));

    // ----------

    this.trackView = (element, handler, options) => {
      if (!handler) {
        handler = setViewCssProps;
      }
      return setupOnView(element, handler, options, TRACK_FULL);
    };

    // ----------

    this.noTrackView = (element, handler) => {
      if (!handler) {
        handler = setViewCssProps;
      }
      removeOnView(element, handler, TRACK_FULL); // no need to await
    };

    // ----------

    this.onView = (target, handler, options) => setupOnView(target, handler, options, TRACK_REGULAR);

    // ----------

    this.offView = (target, handler) => removeOnView(target, handler, TRACK_REGULAR); // no need to await
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
 * - The element that is the target of the IntersectionObserver. If the call to
 *   {@link ViewWatcher.onView} specified an element as the target, it will be
 *   the same. If it specified an offset, then the element passed to the
 *   callback will be an absolutely positioned trigger overlay that's created
 *   as a result.
 * - the {@link ViewData} for relative to the target
 */

// ----------------------------------------

const CONSTRUCTOR_KEY = MC.SYMBOL();
const instances = newXMap(() => MH.newMap());
const getConfig = config => {
  var _config$rootMargin;
  return {
    _root: (config === null || config === void 0 ? void 0 : config.root) || null,
    _rootMargin: (_config$rootMargin = config === null || config === void 0 ? void 0 : config.rootMargin) !== null && _config$rootMargin !== void 0 ? _config$rootMargin : "0px 0px 0px 0px",
    _threshold: (config === null || config === void 0 ? void 0 : config.threshold) || 0
  };
};
const TRACK_REGULAR = 1; // only entering/leaving root
const TRACK_FULL = 2; // entering/leaving + moving across (fine-grained)

// --------------------

const fetchOptions = async (root, target, options) => {
  return {
    _element: await fetchElement(root, target),
    _viewsBitmask: getViewsBitmask(options === null || options === void 0 ? void 0 : options.views),
    _debounceWindow: options === null || options === void 0 ? void 0 : options.debounceWindow,
    _resizeThreshold: options === null || options === void 0 ? void 0 : options.resizeThreshold,
    _scrollThreshold: options === null || options === void 0 ? void 0 : options.scrollThreshold
  };
};
const fetchScrollableAncestors = async (element, realtime) => {
  if (!realtime) {
    await waitForMeasureTime();
  }
  const scrollableAncestors = [];
  let ancestor = element;
  while (ancestor = getClosestScrollable(ancestor, {
    active: true
  })) {
    scrollableAncestors.push(ancestor);
  }
  return scrollableAncestors;
};
const viewChanged = (latestData, prevData) => !prevData || viewsToBitmask(prevData.views) !== viewsToBitmask(latestData.views) || !compareValuesIn(MH.copyBoundingRectProps(prevData.targetBounds), MH.copyBoundingRectProps(latestData.targetBounds)) || !compareValuesIn(prevData.rootBounds, latestData.rootBounds) || !compareValuesIn(prevData.relative, latestData.relative);
const viewsToBitmask = views => VIEWS_SPACE.bit[views[0]] | (views[1] ? VIEWS_SPACE.bit[views[1]] : 0);
const fetchIntersectionData = async (config, entryOrTarget, realtime = false) => {
  const root = config._root;
  const vpSize = await fetchViewportSize(realtime);
  const rootMargins = toMargins(config._rootMargin, vpSize);
  let target;
  let targetBounds;
  let rootBounds = null;
  let isIntersecting = null;
  let isCrossOrigin = null;
  if (MH.isInstanceOf(entryOrTarget, IntersectionObserverEntry)) {
    target = entryOrTarget.target;
    targetBounds = entryOrTarget.boundingClientRect;
    rootBounds = entryOrTarget.rootBounds;
    isIntersecting = entryOrTarget.isIntersecting;
    isCrossOrigin = !entryOrTarget.rootBounds;
  } else {
    target = entryOrTarget;
    targetBounds = await fetchBounds(target, realtime);
  }
  if (!rootBounds) {
    rootBounds = await fetchBounds(root, realtime, rootMargins);
  }
  return {
    _target: target,
    _targetBounds: targetBounds,
    _root: root,
    _rootMargins: rootMargins,
    _rootBounds: rootBounds,
    _isIntersecting: isIntersecting,
    _isCrossOrigin: isCrossOrigin
  };
};
const fetchBounds = async (root, realtime, rootMargins) => {
  let rect;
  if (root) {
    if (!realtime) {
      await waitForMeasureTime();
    }
    rect = MH.copyBoundingRectProps(MH.getBoundingClientRect(root));
  } else {
    const {
      width,
      height
    } = await fetchViewportSize(realtime);
    rect = {
      x: 0,
      left: 0,
      right: width,
      width,
      y: 0,
      top: 0,
      bottom: height,
      height
    };
  }
  if (rootMargins) {
    rect.x = rect[MC.S_LEFT] -= rootMargins[3];
    rect[MC.S_RIGHT] += rootMargins[1];
    rect[MC.S_WIDTH] += rootMargins[1] + rootMargins[3];
    rect.y = rect[MC.S_TOP] -= rootMargins[0];
    rect[MC.S_BOTTOM] += rootMargins[2];
    rect[MC.S_HEIGHT] += rootMargins[0] + rootMargins[2];
  }
  return rect;
};
const fetchViewData = async (intersection, realtime = false) => {
  var _intersection$_isInte;
  const vpSize = await fetchViewportSize(realtime);
  const vpHeight = vpSize[MC.S_HEIGHT];
  const vpWidth = vpSize[MC.S_WIDTH];
  const views = await fetchViews(intersection, realtime);
  const relative = MH.merge({
    hMiddle: NaN,
    vMiddle: NaN
  }, MH.copyBoundingRectProps(intersection._targetBounds));
  relative.y /= vpHeight;
  relative[MC.S_TOP] /= vpHeight;
  relative[MC.S_BOTTOM] /= vpHeight;
  relative[MC.S_HEIGHT] /= vpHeight;
  relative.x /= vpWidth;
  relative[MC.S_LEFT] /= vpWidth;
  relative[MC.S_RIGHT] /= vpWidth;
  relative[MC.S_WIDTH] /= vpWidth;
  relative.hMiddle = (relative[MC.S_LEFT] + relative[MC.S_RIGHT]) / 2;
  relative.vMiddle = (relative[MC.S_TOP] + relative[MC.S_BOTTOM]) / 2;
  const viewData = {
    isIntersecting: (_intersection$_isInte = intersection._isIntersecting) !== null && _intersection$_isInte !== void 0 ? _intersection$_isInte : views[0] === MC.S_AT,
    targetBounds: intersection._targetBounds,
    rootBounds: intersection._rootBounds,
    views,
    relative
  };
  return viewData;
};
const fetchViews = async (intersection, realtime, useScrollingAncestor) => {
  if (intersection._isIntersecting) {
    return [MC.S_AT];
  }
  let rootBounds;
  if (useScrollingAncestor) {
    rootBounds = await fetchBounds(useScrollingAncestor, realtime, intersection._rootMargins);
  } else {
    rootBounds = intersection._rootBounds;
  }
  const targetBounds = intersection._targetBounds;
  const delta = {
    _left: rootBounds[MC.S_LEFT] - targetBounds[MC.S_LEFT],
    _right: targetBounds[MC.S_RIGHT] - rootBounds[MC.S_RIGHT],
    _top: rootBounds[MC.S_TOP] - targetBounds[MC.S_TOP],
    _bottom: targetBounds[MC.S_BOTTOM] - rootBounds[MC.S_BOTTOM]
  };
  let xView = null;
  let yView = null;
  if (delta._left > 0 && delta._right > 0) {
    // Target is wider than root: use greater delta to determine position.
    // Remember, the view is the _root_ position relative to target.
    xView = delta._left > delta._right ? MC.S_RIGHT : MC.S_LEFT;
  } else if (delta._left > 0) {
    // Target is to the left of the root
    xView = MC.S_RIGHT;
  } else if (delta._right > 0) {
    // Target is to the right of the root
    xView = MC.S_LEFT;
  } // else target is horizontally contained in root, see below

  if (delta._top > 0 && delta._bottom > 0) {
    // Target is taller than root: use greater delta to determine position.
    // Remember, the view is the _root_ position relative to target.
    yView = delta._top > delta._bottom ? MC.S_BELOW : MC.S_ABOVE;
  } else if (delta._top > 0) {
    // Target is above the root
    yView = MC.S_BELOW;
  } else if (delta._bottom > 0) {
    // Target is below the root
    yView = MC.S_ABOVE;
  } // else target is vertically contained in root, see below

  if (xView && yView) {
    // diagonally out of vide
    return [xView, yView];
  } else if (xView) {
    // horizontally out of vide
    return [xView];
  } else if (yView) {
    // vertically out of vide
    return [yView];
  }

  // The target is contained in the root bounds and yet isIntersecting was
  // not true. This means that either:
  //
  // 1. It may be intersecting, but we didn't get an actual
  //    IntersectionObserverEntry and we don't know if it's intersecting
  //    or not
  // 2. The target is inside a scrolling element that is _not_ being used as
  //    the observer root, and the target has scrolled out of the scrollable
  //    bounds but still inside the viewport
  // 3. We're inside a cross-origin iFrame and the iFrame is partially or
  //    fully not-intersecting

  if (!intersection._isCrossOrigin) {
    // This is case 1. or 2. => get the views relative to the closest
    // scrollable ancestor relative to which it is _not_ intersecting, if
    // any. If it's nested inside several scrolling elements, we'll end up
    // looping over each one until we find the one for which the target is
    // outside its box.
    //
    // It is too risky to use active isScrollable check here since we could be
    // inside an onScroll handler, so just use passive.
    const scrollingAncestor = getClosestScrollable(useScrollingAncestor !== null && useScrollingAncestor !== void 0 ? useScrollingAncestor : intersection._target);
    if (scrollingAncestor) {
      return fetchViews(intersection, realtime, scrollingAncestor);
    }
  }

  // Either case 3. (cross-origin iframe outside the viewport) or case 1. and
  // the target is actually intersecting the root. Either way, it's to be
  // considered in-view of its root.
  return [MC.S_AT];
};
const setViewCssProps = (element, viewData) => {
  var _viewData$relative;
  const relative = (_viewData$relative = viewData === null || viewData === void 0 ? void 0 : viewData.relative) !== null && _viewData$relative !== void 0 ? _viewData$relative : {};
  const props = {
    top: relative.top,
    bottom: relative.bottom,
    left: relative.left,
    right: relative.right,
    [MC.S_WIDTH]: relative[MC.S_WIDTH],
    [MC.S_HEIGHT]: relative[MC.S_HEIGHT],
    hMiddle: relative.hMiddle,
    vMiddle: relative.vMiddle
  };
  setNumericStyleJsVars(element, props, {
    _prefix: "r-",
    _numDecimal: 4
  }); // don't await here
};
const fetchElement = async (root, target) => {
  if (MH.isElement(target)) {
    return target;
  } else if (!MH.isString(target)) {
    throw MH.usageError("'target' must be an offset string or an HTMLElement | SVGElement | MathMLElement");
  }
  const overlayOptions = getOverlayOptions(root, target);
  return await createOverlay(overlayOptions);
};
const getOverlayOptions = (root, target) => {
  const {
    reference,
    value
  } = parseScrollOffset(target);
  let ovrDimension;
  if (reference === MC.S_TOP || reference === MC.S_BOTTOM) {
    ovrDimension = MC.S_WIDTH;
  } else if (reference === MC.S_LEFT || reference === MC.S_RIGHT) {
    ovrDimension = MC.S_HEIGHT;
  } else {
    throw MH.usageError(`Invalid offset reference: '${reference}'`);
  }
  return {
    parent: MH.isHTMLElement(root) ? root : undefined,
    style: {
      [reference]: value,
      [ovrDimension]: "100%"
    }
  };
};
const invokeCallback = (callback, element, viewData) => callback.invoke(element, MH.copyObject(viewData)).catch(logError);
//# sourceMappingURL=view-watcher.js.map