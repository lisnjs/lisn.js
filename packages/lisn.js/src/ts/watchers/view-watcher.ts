/**
 * @module Watchers/ViewWatcher
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import {
  ViewTarget,
  View,
  BoundingRect,
  CommaSeparatedStr,
} from "@lisn/globals/types";

import { setNumericStyleJsVars } from "@lisn/utils/css-alter";
import { waitForInteractive } from "@lisn/utils/dom-events";
import {
  waitForMeasureTime,
  waitForSubsequentMeasureTime,
} from "@lisn/utils/dom-optimize";
import { logError } from "@lisn/utils/log";
import { omitKeys, compareValuesIn } from "@lisn/utils/misc";
import { createOverlay, OverlayOptions } from "@lisn/utils/overlays";
import { getClosestScrollable } from "@lisn/utils/scroll";
import { fetchViewportSize } from "@lisn/utils/size";
import { toMargins, objToStrKey } from "@lisn/utils/text";
import {
  VIEWS_SPACE,
  getViewsBitmask,
  parseScrollOffset,
} from "@lisn/utils/views";

import {
  CallbackHandler,
  Callback,
  wrapCallback,
} from "@lisn/modules/callback";
import { newXMap, newXWeakMap } from "@lisn/modules/x-map";
import { XIntersectionObserver } from "@lisn/modules/x-intersection-observer";

import { DOMWatcher } from "@lisn/watchers/dom-watcher";
import { ScrollWatcher } from "@lisn/watchers/scroll-watcher";
import { SizeWatcher } from "@lisn/watchers/size-watcher";

import debug from "@lisn/debug/debug";

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
  readonly onView: (
    target: ViewTarget,
    handler: OnViewHandler,
    options?: OnViewOptions,
  ) => Promise<void>;

  /**
   * Removes a previously added handler.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the target is invalid.
   */
  readonly offView: (target: ViewTarget, handler: OnViewHandler) => void;

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
  readonly trackView: (
    element: Element,
    handler?: OnViewHandler | null,
    options?: TrackViewOptions,
  ) => Promise<void>;

  /**
   * Removes a previously added handler for {@link trackView}.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the target is invalid.
   */
  readonly noTrackView: (
    element: Element,
    handler?: OnViewHandler | null,
  ) => void;

  /**
   * Get the current view relative to the target. By default, it will
   * {@link waitForMeasureTime} and so will be delayed by one frame.
   *
   * @param realtime If true, it will not {@link waitForMeasureTime}. Use
   *                 this only when doing realtime scroll-based animations
   *                 as it may cause a forced layout.
   */
  readonly fetchCurrentView: (
    target: ViewTarget,
    realtime?: boolean,
  ) => Promise<ViewData>;

  /**
   * Creates a new instance of ViewWatcher with the given
   * {@link ViewWatcherConfig}. It does not save it for future reuse.
   */
  static create(config?: ViewWatcherConfig) {
    return new ViewWatcher(getConfig(config), CONSTRUCTOR_KEY);
  }

  /**
   * Returns an existing instance of ViewWatcher with the given
   * {@link ViewWatcherConfig}, or creates a new one.
   *
   * **NOTE:** It saves it for future reuse, so don't use this for temporary
   * short-lived watchers.
   */
  static reuse(config?: ViewWatcherConfig) {
    const myConfig = getConfig(config);
    const configStrKey = objToStrKey(omitKeys(myConfig, { _root: null }));

    let instance = instances.get(myConfig._root)?.get(configStrKey);
    if (!instance) {
      instance = new ViewWatcher(myConfig, CONSTRUCTOR_KEY);
      instances.sGet(myConfig._root).set(configStrKey, instance);
    }

    return instance;
  }

  private constructor(
    config: ViewWatcherConfigInternal,
    key: typeof CONSTRUCTOR_KEY,
  ) {
    if (key !== CONSTRUCTOR_KEY) {
      throw MH.illegalConstructorError("ViewWatcher.create");
    }

    const logger = debug
      ? new debug.Logger({ name: "ViewWatcher", logAtCreation: config })
      : null;

    const allViewData = MH.newWeakMap<Element, ViewData>();

    const allCallbacks = newXWeakMap<
      Element,
      Map<
        OnViewHandler,
        {
          _callback: OnViewCallback;
          _trackType: TrackType;
          _options: OnViewOptionsInternal;
        }
      >
    >(() => MH.newMap());

    const intersectionHandler = (entries: IntersectionObserverEntry[]) => {
      debug: logger?.debug9(`Got ${entries.length} new entries`, entries);

      for (const entry of entries) {
        processEntry(entry);
      }
    };

    const observeOptions = {
      root: config._root,
      threshold: config._threshold,
      rootMargin: config._rootMargin,
    };

    const xObserver = new XIntersectionObserver(
      intersectionHandler,
      observeOptions,
    );

    // ----------

    const fetchCurrentView = (
      element: Element,
      realtime = false,
    ): Promise<ViewData> => {
      const fetchData = async (
        entryOrElement: IntersectionObserverEntry | Element,
      ) => {
        const intersection = await fetchIntersectionData(
          config,
          entryOrElement,
          realtime,
        );
        const data = await fetchViewData(intersection, realtime);
        return data;
      };

      if (realtime) {
        return fetchData(element);
      }

      return MH.newPromise((resolve) => {
        // Use a temp IntersectionObserver
        const observer = MH.newIntersectionObserver((entries) => {
          const promise = fetchData(entries[0]);
          observer.disconnect();
          promise.then(resolve);
        }, observeOptions);

        observer.observe(element);
      });
    };

    // ----------

    const createCallback = (
      handler: OnViewHandler,
      options: OnViewOptionsInternal,
      trackType: TrackType,
    ): OnViewCallback => {
      const element = options._element;
      MH.remove(allCallbacks.get(element)?.get(handler)?._callback);

      debug: logger?.debug5("Adding/updating handler", options);
      const callback = wrapCallback(handler);
      callback.onRemove(() => {
        deleteHandler(handler, options);
      });

      allCallbacks.sGet(element).set(handler, {
        _callback: callback,
        _trackType: trackType,
        _options: options,
      });

      return callback;
    };

    // ----------

    const setupOnView = async (
      target: ViewTarget,
      handler: OnViewHandler,
      userOptions: (OnViewOptions & TrackViewOptions) | undefined,
      trackType: TrackType,
    ) => {
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

      if (
        viewData.rootBounds[MC.S_WIDTH] === 0 &&
        viewData.rootBounds[MC.S_HEIGHT] === 0
      ) {
        // Possibly the root is being setup now, wait for one AF
        debug: logger?.debug5(
          "Got zero root size, deferring for a bit",
          config._root,
        );
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

      if (!userOptions?.skipInitial) {
        debug: logger?.debug5("Calling initially with", element, viewData);
        if (viewsToBitmask(viewData.views) & options._viewsBitmask) {
          await invokeCallback(callback, element, viewData);
        }
      }
    };

    // ----------

    const removeOnView = async (
      target: ViewTarget,
      handler: OnViewHandler,
      trackType: TrackType,
    ) => {
      // For time sync, so that if called immediately after onView without
      // awaiting, it will remove the callback that is about to be added.
      // But if no such handler has been added we may unnecessarily
      // create an overlay... TODO
      const options = await fetchOptions(config._root, target, {});
      const element = options._element;

      const currEntry = allCallbacks.get(element)?.get(handler);
      if (currEntry?._trackType === trackType) {
        MH.remove(currEntry._callback);

        if (handler === setViewCssProps) {
          // delete the properties
          setViewCssProps(element, null);
        }
      }
    };

    // ----------

    const deleteHandler = (
      handler: OnViewHandler,
      options: OnViewOptionsInternal,
    ) => {
      const element = options._element;

      MH.deleteKey(allCallbacks.get(element), handler);
      allCallbacks.prune(element);

      if (!allCallbacks.has(element)) {
        debug: logger?.debug4(
          "No more callbacks for target; unobserving",
          element,
        );

        xObserver.unobserve(element);
        MH.deleteKey(allViewData, element);
      }
    };

    // ----------

    const processEntry = async (entry: IntersectionObserverEntry) => {
      // In reality, it can't be just a base Element
      const element = MH.targetOf(entry);

      // This doesn't need to be "realtime", since IntersectionObserver alone
      // introduces a delay.
      const intersection = await fetchIntersectionData(config, entry);
      const latestData = await fetchViewData(intersection);
      debug: logger?.debug9("Got ViewData", element, latestData);

      const viewsBitmask = viewsToBitmask(latestData.views);

      for (const entry of allCallbacks.get(element)?.values() || []) {
        if (viewsBitmask & entry._options._viewsBitmask) {
          invokeCallback(entry._callback, element, latestData);
        }
      }
    };

    // ----------

    const setupInviewTrack = async (
      options: OnViewOptionsInternal,
      viewCallback: OnViewCallback,
      viewData: ViewData,
    ) => {
      const element = options._element;
      debug: logger?.debug8(
        "Setting up size, scroll and attribute tracking",
        element,
      );

      const sizeWatcher = SizeWatcher.reuse();
      const scrollWatcher = ScrollWatcher.reuse();
      const realtime = options._debounceWindow === 0;

      // Detect when target's class or style attribute change
      const domWatcher = DOMWatcher.create({
        root: element,
        // only direct children
        subtree: false,
      });

      // We need to remove the tracking callback when target leaves view and re-add
      // it when it enters view. But the OnViewCallback that is associated may have
      // already been added prior, by calling onView with this handler, so we can't
      // always wrap around it, in order to detect when it's called with a change
      // of view. So we setup another OnViewCallback tied to the tracking callback.
      let isInview = false;

      let removeTrackCallback: (() => void) | null = null;

      // Finds any scrollable ancestors of the element and detect scroll on them.
      const scrollableAncestors = await fetchScrollableAncestors(
        element,
        realtime,
      );
      if (viewCallback.isRemoved()) {
        return;
      }

      const addTrackCallback = () => {
        const trackCallback = wrapCallback(async () => {
          const prevData = allViewData.get(element);

          // Get the latest view data for the target
          const latestData = await fetchCurrentView(element, realtime);
          debug: logger?.debug9("Got ViewData", element, latestData);

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
            debug: logger?.debug9("ViewData same as last");
          }
        });

        // TODO Is there a better way to detect when it's moved?
        viewCallback.onRemove(trackCallback.remove);
        removeTrackCallback = trackCallback.remove;

        // Detect when target's class or style attribute change
        domWatcher.onMutation(trackCallback, {
          categories: [MC.S_ATTRIBUTE],
          [MC.S_SKIP_INITIAL]: true,
        });

        // Detect when target is resized
        sizeWatcher.onResize(trackCallback, {
          target: element,
          [MC.S_DEBOUNCE_WINDOW]: options._debounceWindow,
          threshold: options._resizeThreshold,
          [MC.S_SKIP_INITIAL]: true,
        });

        // Detect when the root is resized
        sizeWatcher.onResize(trackCallback, {
          target: config._root ?? MH.getWindow(),
          [MC.S_DEBOUNCE_WINDOW]: options._debounceWindow,
          threshold: options._resizeThreshold,
          [MC.S_SKIP_INITIAL]: true,
        });

        // Detect when the target's scrollable ancestors are scrolled (this
        // will almost certainly include the main scrollable element).
        for (const ancestor of scrollableAncestors) {
          scrollWatcher.onScroll(trackCallback, {
            scrollable: ancestor,
            [MC.S_DEBOUNCE_WINDOW]: options._debounceWindow,
            threshold: options._scrollThreshold,
            [MC.S_SKIP_INITIAL]: true,
          });
        }
      };

      const enterOrLeaveCallback = createCallback(
        (target__ignored, viewData) => {
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
        },
        MH.assign(options, {
          _viewsBitmask: VIEWS_SPACE.bitmask,
        }),
        TRACK_REGULAR,
      );

      viewCallback.onRemove(enterOrLeaveCallback.remove);

      allViewData.set(element, viewData); // to avoid duplicate initial call
      // Setup the track and the "inView" state
      if (!enterOrLeaveCallback.isRemoved()) {
        invokeCallback(enterOrLeaveCallback, element, viewData);
      }
    };

    // ----------

    this.fetchCurrentView = (target, realtime = false) =>
      fetchElement(config._root, target).then((element) =>
        fetchCurrentView(element, realtime),
      );

    // ----------

    this.trackView = (element, handler?, options?) => {
      if (!handler) {
        handler = setViewCssProps;
      }

      return setupOnView(element, handler, options, TRACK_FULL);
    };

    // ----------

    this.noTrackView = (element, handler?) => {
      if (!handler) {
        handler = setViewCssProps;
      }

      removeOnView(element, handler, TRACK_FULL); // no need to await
    };

    // ----------

    this.onView = (target, handler, options?) =>
      setupOnView(target, handler, options, TRACK_REGULAR);

    // ----------

    this.offView = (target, handler) =>
      removeOnView(target, handler, TRACK_REGULAR); // no need to await
  }
}

/**
 * @interface
 */
export type ViewWatcherConfig = {
  /**
   * The root element to use for the IntersectionObserver.
   *
   * **NOTE:** If the target you want to observe (via
   * {@link ViewWatcher.onView}) is inside a scrolling element, then you should
   * probably set the watcher's root to be that scrolling element or a wrapper
   * around it. However, even if you don't or can't do that, the watcher will
   * try to be smart about that, and when the target is no longer intercepting
   * because it's scrolled outside its scrolling container, and yet its
   * bounding box is still inside the watcher root (e.g. the viewport) the
   * watcher will determine the relative view based on the scrolling container
   * and not the actual watcher root.
   *
   * @defaultValue null
   */
  root?: Element | null;

  /**
   * The rootMargin to pass to the IntersectionObserver constructor options.
   *
   * @defaultValue "0px 0px 0px 0px"
   */
  rootMargin?: string;

  /**
   * The threshold to pass to the IntersectionObserver constructor options.
   *
   * @defaultValue 0
   */
  threshold?: number | number[];
};

/**
 * @interface
 */
export type OnViewOptions = {
  /**
   * Specifies a list of {@link View}s to target for.
   *
   * The handler will only be called if there is a change of view relative to
   * the target that matches the given ones.
   *
   * It can be a comma-separated list of "views" or an array of such names.
   *
   * @defaultValue undefined
   */
  views?: CommaSeparatedStr<View> | View[];

  /**
   * Do not call the handler until there's a future resize of the element.
   *
   * By default we call the handler (almost) immediately with the current size
   * data for the target.
   *
   * @defaultValue false
   */
  skipInitial?: boolean;
};

/**
 * @interface
 */
export type TrackViewOptions = {
  /**
   * Use this debounce window for the {@link ScrollWatcher} and
   * {@link SizeWatcher} involved in the view tracking.
   *
   * **IMPORTANT:**
   * If the debounce window is non-0 (default), then the callback is always
   * delayed by at least an animation frame following a scroll event to allow
   * for optimized `scrollTop`/`scrollLeft` measurements via
   * {@link waitForMeasureTime}.
   *
   * If you set this is 0, this indicates that the callback should be
   * "realtime" and will therefore skip {@link waitForMeasureTime}, which could
   * lead to forced re-layouts during scroll, but you probably need this when
   * doing scroll-based animations.
   *
   * @defaultValue undefined // ScrollWatcher and SizeWatcher defaults
   */
  debounceWindow?: number;

  /**
   * Use this resize threshold for the {@link SizeWatcher} involved in the view
   * tracking.
   *
   * @defaultValue undefined // SizeWatcher default
   */
  resizeThreshold?: number;

  /**
   * Use this scroll threshold for the {@link ScrollWatcher} involved in the
   * view tracking.
   *
   * @defaultValue undefined // ScrollWatcher default
   */
  scrollThreshold?: number;

  /**
   * Do not call the handler until there's a future resize of the element.
   *
   * By default we call the handler (almost) immediately with the current size
   * data for the target.
   *
   * @defaultValue false
   */
  skipInitial?: boolean;
};

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
export type OnViewHandlerArgs = [Element, ViewData];
export type OnViewCallback = Callback<OnViewHandlerArgs>;
export type OnViewHandler = CallbackHandler<OnViewHandlerArgs> | OnViewCallback;

export type ViewData = {
  isIntersecting: boolean;

  targetBounds: BoundingRect;

  rootBounds: BoundingRect;

  /**
   * The current view or views of the target. There would be two views given
   * only if the target is _not_ in view and it's diagonally across from the
   * root, e.g. both below and to the right.
   */
  views: [View, View?];

  /**
   * This is the target's position relative to the
   * {@link ViewWatcherConfig.root | root} with values relative to the root
   * size.
   *
   * It is like the {@link targetBounds} except that each quantity is scaled by
   * the root's width or height, and having two additional computed values.
   */
  relative: {
    x: number;
    y: number;
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;

    /**
     * Average of the relative left and right.
     */
    hMiddle: number;

    /**
     * Average of the relative top and bottom.
     */
    vMiddle: number;
  };
};

// ----------------------------------------

type ViewWatcherConfigInternal = {
  _root: Element | null;
  _rootMargin: string;
  _threshold: number | number[];
};

type OnViewOptionsInternal = {
  _element: Element;
  _viewsBitmask: number;
  _debounceWindow: number | undefined;
  _resizeThreshold: number | undefined;
  _scrollThreshold: number | undefined;
};

type IntersectionData = {
  _target: Element;
  _targetBounds: BoundingRect;
  _root: Element | null;
  _rootMargins: [number, number, number, number];
  _rootBounds: BoundingRect;
  _isIntersecting: boolean | null; // null means unknown, no IntersectionObserverEntry
  _isCrossOrigin: boolean | null; // null means unknown, no IntersectionObserverEntry
};

type TrackType = typeof TRACK_REGULAR | typeof TRACK_FULL;

const CONSTRUCTOR_KEY: unique symbol = MC.SYMBOL() as typeof CONSTRUCTOR_KEY;
const instances = newXMap<Element | null, Map<string, ViewWatcher>>(() =>
  MH.newMap(),
);

const getConfig = (
  config: ViewWatcherConfig | undefined,
): ViewWatcherConfigInternal => {
  return {
    _root: config?.root ?? null,
    _rootMargin: config?.rootMargin ?? "0px 0px 0px 0px",
    _threshold: config?.threshold ?? 0,
  };
};

const TRACK_REGULAR = 1; // only entering/leaving root
const TRACK_FULL = 2; // entering/leaving + moving across (fine-grained)

// --------------------

const fetchOptions = async (
  root: Element | null,
  target: ViewTarget,
  options: (OnViewOptions & TrackViewOptions) | undefined,
): Promise<OnViewOptionsInternal> => {
  return {
    _element: await fetchElement(root, target),
    _viewsBitmask: getViewsBitmask(options?.views),
    _debounceWindow: options?.debounceWindow,
    _resizeThreshold: options?.resizeThreshold,
    _scrollThreshold: options?.scrollThreshold,
  };
};

const fetchScrollableAncestors = async (
  element: Element,
  realtime: boolean,
) => {
  if (!realtime) {
    await waitForMeasureTime();
  }

  const scrollableAncestors = [];
  let ancestor: Element | null | undefined = element;
  while ((ancestor = getClosestScrollable(ancestor, { active: true }))) {
    scrollableAncestors.push(ancestor);
  }

  return scrollableAncestors;
};

const viewChanged = (latestData: ViewData, prevData: ViewData | undefined) =>
  !prevData ||
  viewsToBitmask(prevData.views) !== viewsToBitmask(latestData.views) ||
  !compareValuesIn(
    MH.copyBoundingRectProps(prevData.targetBounds),
    MH.copyBoundingRectProps(latestData.targetBounds),
  ) ||
  !compareValuesIn(prevData.rootBounds, latestData.rootBounds) ||
  !compareValuesIn(prevData.relative, latestData.relative);

const viewsToBitmask = (views: [View, View?]) =>
  VIEWS_SPACE.bit[views[0]] | (views[1] ? VIEWS_SPACE.bit[views[1]] : 0);

const fetchIntersectionData = async (
  config: ViewWatcherConfigInternal,
  entryOrTarget: IntersectionObserverEntry | Element,
  realtime = false,
): Promise<IntersectionData> => {
  const root = config._root;
  const vpSize = await fetchViewportSize(realtime);
  const rootMargins = toMargins(config._rootMargin, vpSize);

  let target: Element;
  let targetBounds: BoundingRect;
  let rootBounds: BoundingRect | null = null;
  let isIntersecting: boolean | null = null;
  let isCrossOrigin: boolean | null = null;

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
    _isCrossOrigin: isCrossOrigin,
  };
};

const fetchBounds = async (
  root: Element | null,
  realtime: boolean,
  rootMargins?: [number, number, number, number],
): Promise<BoundingRect> => {
  let rect: BoundingRect;

  if (root) {
    if (!realtime) {
      await waitForMeasureTime();
    }

    rect = MH.copyBoundingRectProps(MH.getBoundingClientRect(root));
  } else {
    const { width, height } = await fetchViewportSize(realtime);
    rect = {
      x: 0,
      left: 0,
      right: width,
      width,
      y: 0,
      top: 0,
      bottom: height,
      height,
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

const fetchViewData = async (
  intersection: IntersectionData,
  realtime = false,
): Promise<ViewData> => {
  const vpSize = await fetchViewportSize(realtime);
  const vpHeight = vpSize[MC.S_HEIGHT];
  const vpWidth = vpSize[MC.S_WIDTH];

  const views = await fetchViews(intersection, realtime);

  const relative = MH.merge(
    { hMiddle: NaN, vMiddle: NaN },
    MH.copyBoundingRectProps(intersection._targetBounds),
  );

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

  const viewData: ViewData = {
    isIntersecting: intersection._isIntersecting ?? views[0] === MC.S_AT,
    targetBounds: intersection._targetBounds,
    rootBounds: intersection._rootBounds,
    views,
    relative,
  };

  return viewData;
};

const fetchViews = async (
  intersection: IntersectionData,
  realtime: boolean,
  useScrollingAncestor?: Element,
): Promise<[View, View?]> => {
  if (intersection._isIntersecting) {
    return [MC.S_AT];
  }

  let rootBounds: BoundingRect;
  if (useScrollingAncestor) {
    rootBounds = await fetchBounds(
      useScrollingAncestor,
      realtime,
      intersection._rootMargins,
    );
  } else {
    rootBounds = intersection._rootBounds;
  }

  const targetBounds = intersection._targetBounds;
  const delta = {
    _left: rootBounds[MC.S_LEFT] - targetBounds[MC.S_LEFT],
    _right: targetBounds[MC.S_RIGHT] - rootBounds[MC.S_RIGHT],
    _top: rootBounds[MC.S_TOP] - targetBounds[MC.S_TOP],
    _bottom: targetBounds[MC.S_BOTTOM] - rootBounds[MC.S_BOTTOM],
  };

  let xView: View | null = null;
  let yView: View | null = null;
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
    const scrollingAncestor = getClosestScrollable(
      useScrollingAncestor ?? intersection._target,
    );

    if (scrollingAncestor) {
      return fetchViews(intersection, realtime, scrollingAncestor);
    }
  }

  // Either case 3. (cross-origin iframe outside the viewport) or case 1. and
  // the target is actually intersecting the root. Either way, it's to be
  // considered in-view of its root.
  return [MC.S_AT];
};

const setViewCssProps = (
  element: Element,
  viewData: ViewData | undefined | null,
) => {
  const relative: Record<string, number> = viewData?.relative ?? {};
  const props = {
    top: relative.top,
    bottom: relative.bottom,
    left: relative.left,
    right: relative.right,
    [MC.S_WIDTH]: relative[MC.S_WIDTH],
    [MC.S_HEIGHT]: relative[MC.S_HEIGHT],
    hMiddle: relative.hMiddle,
    vMiddle: relative.vMiddle,
  };
  setNumericStyleJsVars(element, props, { _prefix: "r-", _numDecimal: 4 }); // don't await here
};

const fetchElement = async (
  root: Element | null,
  target: ViewTarget,
): Promise<Element> => {
  if (MH.isElement(target)) {
    return target;
  } else if (!MH.isString(target)) {
    throw MH.usageError(
      "'target' must be an offset string or an HTMLElement | SVGElement | MathMLElement",
    );
  }

  const overlayOptions = getOverlayOptions(root, target);
  return await createOverlay(overlayOptions);
};

const getOverlayOptions = (
  root: Element | null,
  target: string,
): OverlayOptions => {
  const { reference, value } = parseScrollOffset(target);

  let ovrDimension: "width" | "height";
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
      [ovrDimension]: "100%",
    },
  };
};

const invokeCallback = (
  callback: OnViewCallback,
  element: Element,
  viewData: ViewData,
) => callback.invoke(element, MH.copyObject(viewData)).catch(logError);
