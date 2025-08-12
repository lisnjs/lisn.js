/**
 * @module Watchers/ScrollWatcher
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { XYDirection, ScrollDirection, SizeTarget } from "@lisn/globals/types";

import {
  ScrollTarget,
  TargetCoordinate,
  TargetCoordinates,
  CommaSeparatedStr,
} from "@lisn/globals/types";

import { setNumericStyleJsVars } from "@lisn/utils/css-alter";
import { getMaxDeltaDirection } from "@lisn/utils/directions";
import { moveElement, tryWrapContent } from "@lisn/utils/dom-alter";
import { waitForMeasureTime } from "@lisn/utils/dom-optimize";
import { addEventListenerTo, removeEventListenerFrom } from "@lisn/utils/event";
import { logError } from "@lisn/utils/log";
import { toNonNegNum, maxAbs } from "@lisn/utils/math";
import {
  scrollTo,
  getCurrentScrollAction,
  getClientWidthNow,
  getClientHeightNow,
  tryGetMainScrollableElement,
  fetchMainContentElement,
  fetchMainScrollableElement,
  fetchScrollableElement,
  isValidScrollDirection,
  ScrollAction,
  ScrollToOptions,
} from "@lisn/utils/scroll";
import { objToStrKey } from "@lisn/utils/text";
import { validateStrList } from "@lisn/utils/validation";

import {
  CallbackHandler,
  Callback,
  wrapCallback,
} from "@lisn/modules/callback";
import { newXWeakMap } from "@lisn/modules/x-map";

import { MutationOperation, DOMWatcher } from "@lisn/watchers/dom-watcher";
import { SizeWatcher } from "@lisn/watchers/size-watcher";

import debug from "@lisn/debug/debug";

// re-export for convenience
export type { ScrollAction, ScrollToOptions } from "@lisn/utils/scroll";

/**
 * {@link ScrollWatcher} listens for scroll events in any direction.
 *
 * It manages registered callbacks globally and reuses event listeners for more
 * efficient performance.
 */
export class ScrollWatcher {
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
  readonly onScroll: (
    handler: OnScrollHandler,
    options?: OnScrollOptions,
  ) => Promise<void>;

  /**
   * Removes a previously added handler.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the scrollable is invalid.
   */
  readonly offScroll: (
    handler: OnScrollHandler,
    scrollable?: ScrollTarget,
  ) => void;

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
  readonly trackScroll: (
    handler?: OnScrollHandler | null,
    options?: OnScrollOptions,
  ) => Promise<void>;

  /**
   * Removes a previously added handler for {@link trackScroll}.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the scrollable is invalid.
   */
  readonly noTrackScroll: (
    handler?: OnScrollHandler | null,
    scrollable?: ScrollTarget,
  ) => void;

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
  readonly fetchCurrentScroll: (
    scrollable?: ScrollTarget,
    realtime?: boolean,
  ) => Promise<ScrollData>;

  /**
   * Scrolls the given scrollable element to in the given direction.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the direction or options are invalid.
   */
  readonly scroll: (
    direction: XYDirection,
    options?: ScrollOptions,
  ) => Promise<ScrollAction | null>;

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
  readonly scrollTo: (
    to: TargetCoordinates | Element | string,
    options?: ScrollToOptions,
  ) => Promise<ScrollAction | null>;

  /**
   * Returns the current {@link ScrollAction} if any.
   *
   * @param scrollable If not given, it defaults to
   *                   {@link Settings.settings.mainScrollableElementSelector | the main scrolling element}
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the scrollable is invalid.
   */
  readonly fetchCurrentScrollAction: (
    scrollable?: Element,
  ) => Promise<ScrollAction | null>;

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
  readonly stopUserScrolling: (options?: {
    scrollable?: ScrollTarget;
    immediate?: boolean;
  }) => Promise<void>;

  /**
   * Returns the element that holds the main page content. By default it's
   * `document.body` but is overridden by
   * {@link Settings.settings.mainScrollableElementSelector}.
   *
   * It will wait for the element to be available if not already.
   */
  static fetchMainContentElement(): Promise<HTMLElement> {
    return fetchMainContentElement();
  }

  /**
   * Returns the scrollable element that holds the wrapper around the main page
   * content. By default it's `document.scrollable` (unless `document.body` is
   * actually scrollable, in which case it will be used) but it will be
   * different if {@link Settings.settings.mainScrollableElementSelector} is set.
   *
   * It will wait for the element to be available if not already.
   */
  static fetchMainScrollableElement(): Promise<HTMLElement> {
    return fetchMainScrollableElement();
  }

  /**
   * Creates a new instance of ScrollWatcher with the given
   * {@link ScrollWatcherConfig}. It does not save it for future reuse.
   */
  static create(config?: ScrollWatcherConfig) {
    return new ScrollWatcher(getConfig(config), CONSTRUCTOR_KEY);
  }

  /**
   * Returns an existing instance of ScrollWatcher with the given
   * {@link ScrollWatcherConfig}, or creates a new one.
   *
   * **NOTE:** It saves it for future reuse, so don't use this for temporary
   * short-lived watchers.
   */
  static reuse(config?: ScrollWatcherConfig) {
    const myConfig = getConfig(config);
    const configStrKey = objToStrKey(myConfig);

    let instance = instances.get(configStrKey);
    if (!instance) {
      instance = new ScrollWatcher(myConfig, CONSTRUCTOR_KEY);
      instances.set(configStrKey, instance);
    }

    return instance;
  }

  private constructor(
    config: ScrollWatcherConfigInternal,
    key: typeof CONSTRUCTOR_KEY,
  ) {
    if (key !== CONSTRUCTOR_KEY) {
      throw MH.illegalConstructorError("ScrollWatcher.create");
    }

    const logger = debug
      ? new debug.Logger({ name: "ScrollWatcher", logAtCreation: config })
      : null;

    const allScrollData = MH.newWeakMap<Element, ScrollData>();

    const activeListeners = MH.newWeakMap<
      ScrollTarget,
      { _nRealtime: number }
    >();

    const allCallbacks = newXWeakMap<
      Element,
      Map<OnScrollHandler, CallbackEntry>
    >(() => MH.newMap());

    // ----------

    const fetchCurrentScroll = async (
      element: Element,
      realtime = false,
      isScrollEvent = false,
    ): Promise<ScrollData> => {
      // The scroll data can change event without a scroll event, e.g. by the
      // element changing size, so always get the latest here.
      const previousEventData = allScrollData.get(element);
      const latestData = await fetchScrollData(
        element,
        previousEventData,
        realtime,
      );

      // If there hasn't been a scroll event, use the old scroll direction
      if (!isScrollEvent && previousEventData) {
        latestData.direction = previousEventData.direction;
      }
      return latestData;
    };

    // ----------

    const createCallback = (
      handler: OnScrollHandler,
      options: OnScrollOptionsInternal,
      trackType: TrackType,
    ): CallbackEntry => {
      const element = options._element;
      MH.remove(allCallbacks.get(element)?.get(handler)?._callback);

      debug: logger?.debug5("Adding/updating handler", options);
      const callback = wrapCallback(handler, options._debounceWindow);
      callback.onRemove(() => {
        deleteHandler(handler, options);
      });

      const entry = {
        _callback: callback,
        _trackType: trackType,
        _options: options,
      };
      allCallbacks.sGet(element).set(handler, entry);

      return entry;
    };

    // ----------

    const setupOnScroll = async (
      handler: OnScrollHandler,
      userOptions: OnScrollOptions | undefined,
      trackType: TrackType,
    ) => {
      const options = await fetchOnScrollOptions(config, userOptions ?? {});
      const element = options._element;

      // Don't await for the scroll data before creating the callback so that
      // setupOnScroll and removeOnScroll have the same "timing" and therefore
      // calling onScroll and offScroll immediately without awaiting removes the
      // callback.
      const entry = createCallback(handler, options, trackType);
      const callback = entry._callback;

      const eventTarget = options._eventTarget;
      const scrollData = await fetchCurrentScroll(
        element,
        options._debounceWindow === 0,
      );

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
        debug: logger?.debug4("Adding scroll listener", eventTarget);
        listenerOptions = { _nRealtime: 0 };
        activeListeners.set(eventTarget, listenerOptions);
        // Don't debounce the scroll handler, only the callbacks.
        addEventListenerTo(eventTarget, MC.S_SCROLL, scrollHandler);
      }

      if (options._debounceWindow === 0) {
        listenerOptions._nRealtime++;
      }

      const directions = options._directions;
      if (
        !callback.isRemoved() &&
        !userOptions?.skipInitial &&
        directionMatches(directions, scrollData.direction)
      ) {
        debug: logger?.debug5("Calling initially with", element, scrollData);
        // Use a one-off callback that's not debounced for the initial call.
        await invokeCallback(wrapCallback(handler), element, scrollData);
      }
    };

    // ----------

    const removeOnScroll = async (
      handler: OnScrollHandler,
      scrollable: ScrollTarget | undefined,
      trackType: TrackType,
    ) => {
      const options = await fetchOnScrollOptions(config, { scrollable });
      const element = options._element;
      const currEntry = allCallbacks.get(element)?.get(handler);
      if (currEntry?._trackType === trackType) {
        MH.remove(currEntry._callback);

        if (handler === setScrollCssProps) {
          // delete the properties
          setScrollCssProps(element, null);
        }
      }
    };

    // ----------

    const deleteHandler = (
      handler: OnScrollHandler,
      options: OnScrollOptionsInternal,
    ) => {
      const element = options._element;
      const eventTarget = options._eventTarget;

      MH.deleteKey(allCallbacks.get(element), handler);
      allCallbacks.prune(element);

      const listenerOptions = activeListeners.get(eventTarget);
      if (listenerOptions && options._debounceWindow === 0) {
        listenerOptions._nRealtime--;
      }

      if (!allCallbacks.has(element)) {
        debug: logger?.debug4(
          "No more callbacks for scrollable; removing listener",
          element,
        );

        MH.deleteKey(allScrollData, element);
        removeEventListenerFrom(eventTarget, MC.S_SCROLL, scrollHandler);
        MH.deleteKey(activeListeners, eventTarget);
        // TODO: Should we unwrap children if previously WE wrapped them?
      }
    };

    // ----------

    const setupSizeTrack = async (entry: CallbackEntry) => {
      const options = entry._options;
      const element = options._element;
      const scrollCallback = entry._callback;
      debug: logger?.debug8("Setting up size tracking", element);

      const doc = MH.getDoc();
      const docScrollingElement = MH.getDocScrollingElement();

      const resizeCallback = wrapCallback(async () => {
        // Get the latest scroll data for the scrollable
        // Currently, the resize callback is already delayed by a frame due to
        // the SizeWatcher, so we don't need to treat this as realtime.
        const latestData = await fetchCurrentScroll(element);
        const thresholdsExceeded = hasExceededThreshold(
          options,
          latestData,
          entry._data,
        );

        if (!thresholdsExceeded) {
          debug: logger?.debug9(
            "Threshold not exceeded",
            options,
            latestData,
            entry._data,
          );
        } else if (!scrollCallback.isRemoved()) {
          await invokeCallback(scrollCallback, element, latestData);
        }
      });

      scrollCallback.onRemove(resizeCallback.remove);

      // Don't use default instance as it has a high threshold.
      const sizeWatcher = SizeWatcher.reuse();
      const setupOnResize = (target?: SizeTarget) =>
        sizeWatcher.onResize(resizeCallback, {
          target,
          [MC.S_DEBOUNCE_WINDOW]: options._debounceWindow,
          // TODO maybe accepts resizeThreshold option
          threshold: options._threshold,
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

      const observedElements = MH.newSet<Element>([element]);

      // Observe the scrolling element
      setupOnResize(element);

      // And also its children (if possible, a single wrapper around them
      const wrapper = await tryWrapContent(element, {
        _classNames: [
          MC.PREFIX_WRAPPER,
          MC.PREFIX_WRAPPER_CONTENT,
          PREFIX_WRAPPER,
        ],
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
      const domWatcher = DOMWatcher.create({
        root: element,
        // only direct children
        subtree: false,
      });

      const onAddedCallback = wrapCallback((operation: MutationOperation) => {
        const child = MH.currentTargetOf(operation);
        // If we've just added the wrapper, it will be in DOMWatcher's queue,
        // so check.
        if (child !== wrapper) {
          if (wrapper) {
            // Move this child into the wrapper. If this results in change of size
            // for wrapper, SizeWatcher will call us.
            moveElement(child, { to: wrapper, ignoreMove: true });
          } else {
            // Track the size of this child.
            // Don't skip initial, call the callback now
            setupOnResize(child);
            observedElements.add(child);
          }
        }
      });

      domWatcher.onMutation(onAddedCallback, { categories: [MC.S_ADDED] });
      resizeCallback.onRemove(onAddedCallback.remove);
    };

    // ----------

    const scrollHandler = async (event: Event) => {
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

      const element = await fetchScrollableElement(scrollable);
      const realtime = (activeListeners.get(scrollable)?._nRealtime ?? 0) > 0;
      const latestData = await fetchCurrentScroll(element, realtime, true);
      allScrollData.set(element, latestData);

      debug: logger?.debug9("Scroll event", element, latestData);

      for (const entry of allCallbacks.get(element)?.values() || []) {
        // Consider the direction since the last scroll event and not the
        // direction based on the largest delta the last time the callback
        // was called.
        const options = entry._options;
        const thresholdsExceeded = hasExceededThreshold(
          options,
          latestData,
          entry._data,
        );

        if (!thresholdsExceeded) {
          debug: logger?.debug9(
            "Threshold not exceeded",
            options,
            latestData,
            entry._data,
          );
          continue;
        }

        // If threshold has been exceeded, always update the latest data for
        // this callback.
        entry._data = latestData;

        if (!directionMatches(options._directions, latestData.direction)) {
          debug: logger?.debug9(
            "Direction does not match",
            options,
            latestData,
          );
          continue;
        }

        invokeCallback(entry._callback, element, latestData);
      }
    };

    // ----------

    this.fetchCurrentScroll = (scrollable?, realtime?) =>
      fetchScrollableElement(scrollable).then((element) =>
        fetchCurrentScroll(element, realtime),
      );

    // ----------

    this.scroll = (direction, options) => {
      if (!isValidScrollDirection(direction)) {
        throw MH.usageError(`Unknown scroll direction: '${direction}'`);
      }

      const isVertical = direction === MC.S_UP || direction === MC.S_DOWN;
      const sign = direction === MC.S_UP || direction === MC.S_LEFT ? -1 : 1;
      let targetCoordinate: TargetCoordinate;

      const amount = options?.amount ?? 100;
      const asFractionOf = options?.asFractionOf;

      if (asFractionOf === "visible") {
        targetCoordinate = isVertical
          ? (el) =>
              el[MC.S_SCROLL_TOP] +
              (sign * amount * getClientHeightNow(el)) / 100
          : (el) =>
              el[MC.S_SCROLL_LEFT] +
              (sign * amount * getClientWidthNow(el)) / 100;

        //
      } else if (asFractionOf === "content") {
        targetCoordinate = isVertical
          ? (el) =>
              el[MC.S_SCROLL_TOP] +
              (sign * amount * el[MC.S_SCROLL_HEIGHT]) / 100
          : (el) =>
              el[MC.S_SCROLL_LEFT] +
              (sign * amount * el[MC.S_SCROLL_WIDTH]) / 100;

        //
      } else if (asFractionOf !== undefined && asFractionOf !== "pixel") {
        throw MH.usageError(
          `Unknown 'asFractionOf' keyword: '${asFractionOf}'`,
        );

        //
      } else {
        targetCoordinate = isVertical
          ? (el) => el[MC.S_SCROLL_TOP] + sign * amount
          : (el) => el[MC.S_SCROLL_LEFT] + sign * amount;
      }

      const target = isVertical
        ? { top: targetCoordinate }
        : { left: targetCoordinate };

      return this.scrollTo(target, options);
    };

    // ----------

    this.scrollTo = async (to, options) =>
      scrollTo(
        to,
        MH.merge(options, {
          duration: options?.duration ?? config._scrollDuration, // default
          scrollable: await fetchScrollableElement(options?.scrollable), // override
        }),
      );

    // ----------

    this.fetchCurrentScrollAction = (scrollable?) =>
      fetchScrollableElement(scrollable).then((element) =>
        getCurrentScrollAction(element),
      );

    // ----------

    this.stopUserScrolling = async (options) => {
      const element = await fetchScrollableElement(options?.scrollable);
      const stopScroll = () =>
        MH.elScrollTo(element, {
          top: element[MC.S_SCROLL_TOP],
          left: element[MC.S_SCROLL_LEFT],
        });

      if (options?.immediate) {
        stopScroll();
      } else {
        waitForMeasureTime().then(stopScroll);
      }
    };

    // ----------

    this.trackScroll = (handler?, options?) => {
      if (!handler) {
        handler = setScrollCssProps;
      }

      return setupOnScroll(handler, options, TRACK_FULL);
    };

    // ----------

    this.noTrackScroll = (handler?, scrollable?) => {
      if (!handler) {
        handler = setScrollCssProps;
      }

      removeOnScroll(handler, scrollable, TRACK_FULL); // no need to await
    };

    // ----------

    this.onScroll = (handler, options?) =>
      setupOnScroll(handler, options, TRACK_REGULAR);

    // ----------

    this.offScroll = (handler, scrollable?) => {
      removeOnScroll(handler, scrollable, TRACK_REGULAR); // no need to await
    };
  }
}

/**
 * @interface
 */
export type ScrollWatcherConfig = {
  /**
   * The default value for
   * {@link OnScrollOptions.debounceWindow | debounceWindow} in calls to
   * {@link ScrollWatcher.onScroll}.
   *
   * @defaultValue 75
   */
  debounceWindow?: number;

  /**
   * The default value for
   * {@link OnScrollOptions.threshold | threshold} in calls to
   * {@link ScrollWatcher.onScroll}.
   *
   * @defaultValue 50
   */
  scrollThreshold?: number;

  /**
   * The default value for
   * {@link ScrollOptions.duration | duration} in calls to
   * {@link ScrollWatcher.scroll} and {@link ScrollWatcher.scrollTo}.
   *
   * @defaultValue 1000
   */
  scrollDuration?: number;
};

/**
 * @interface
 */
export type OnScrollOptions = {
  /**
   * If it is not given, or is `null`, `window` or `document`, then it will
   * track the scroll of the
   * {@link Settings.settings.mainScrollableElementSelector | the main scrolling element}.
   *
   * Other values must be an `Element` and are taken literally.
   *
   * @defaultValue undefined
   */
  scrollable?: ScrollTarget;

  /**
   * If non-0, the scroll handler will only be called when the scrollable's
   * scroll offset in the observed direction has changed at least
   * `scrollThreshold` pixels since the last time the handler was called.
   *
   * @defaultValue {@link ScrollWatcherConfig.scrollThreshold}
   */
  threshold?: number;

  /**
   * Specifies a list of {@link ScrollDirection}s to listen for.
   *
   * It can be a comma-separated list of direction names or an array of such
   * names.
   *
   * If not given, then it listens for scrolls in any direction, including
   * {@link Types.NoDirection} and {@link Types.AmbiguousDirection}.
   *
   * The {@link Types.NoDirection} occurs when the callback is called initially
   * (if `skipInitial` is not `true`) and there hasn't yet been a scroll
   * observed on the scrollable _and_ it's `scrollTop`/`scrollLeft` are 0.
   *
   * The {@link Types.AmbiguousDirection} occurs when the user scrolls
   * diagonally with close to equal deltas in both horizontal and vertical
   * direction.
   *
   * **IMPORTANT:**
   *
   * The direction of a scroll event is always based on comparing `deltaX` and
   * `deltaY` relative to the _last scroll event_ (within the `debounceWindow`,
   * and not to the scroll data for the last time the callback was called (in
   * case it was skipped because `threshold` was not exceeded or in case it was
   * debounced by a larger window than the watcher).
   *
   * I.e. if you have both `threshold` and `directions` restricted, or if the
   * callback has a larger debounce window than the watcher, it is possible for
   * there to be a change in the relevant `scrollTop`/`scrollLeft` offset that
   * exceeds the threshold, and for the callback to _not_ be called.
   *
   * For a callback to be called, both of these must be true:
   * - the change in `scrollTop`/`scrollLeft`, _compared to the last time the
   *   callback was called_ must exceed the {@link threshold}
   * - the effective scroll direction, _compared to the last scroll event_
   *   prior to the _watcher's_ debounce window must be one of the given
   *   {@link directions}.
   *
   * @defaultValue undefined
   */
  directions?: CommaSeparatedStr<ScrollDirection> | ScrollDirection[];

  /**
   * Do not call the handler until there's a future scroll of the element.
   *
   * By default we call the handler (almost) immediately if there's been a
   * scroll in one of the given directions, or if there has not been a scroll
   * but directions includes {@link Types.NoDirection}, but you can disable
   * this initial call here.
   *
   * @defaultValue false
   */
  skipInitial?: boolean;

  /**
   * If non-0, the handler will be "debounced" so it's called at most
   * `debounceWindow` milliseconds.
   *
   * **IMPORTANT:**
   * If the debounce window is non-0 (default), then the callback is always
   * delayed by at least an animation frame following a scroll event to allow
   * for optimized `scrollTop`/`scrollLeft` measurements via
   * {@link waitForMeasureTime}.
   *
   * If you set this is 0, this indicates that the callback should be
   * "realtime" and will therefore skip {@link waitForMeasureTime}, which could
   * lead to forced re-layouts, but you probably need this when doing
   * scroll-based animations.
   *
   * @defaultValue {@link ScrollWatcherConfig.debounceWindow}
   */
  debounceWindow?: number;
};

/**
 * @interface
 */
export type ScrollOptions = ScrollToOptions & {
  /**
   * How much to scroll in the given direction.
   *
   * @defaultValue 100
   */
  amount?: number;

  /**
   * If set to "pixel" (default), `amount` is taken as absolute pixels.
   *
   * If set to "visible", `amount` is taken as percent of the element's visible
   * size in the scrolling direction (100 means full client width for
   * horizontal or height for vertical scroll).
   *
   * If set to "content", `amount` is taken as percent of the element's full
   * content size in the scrolling direction (100 means full scroll width for
   * horizontal or height for vertical scroll).
   *
   * @defaultValue "pixel"
   */
  asFractionOf?: "pixel" | "visible" | "content";
};

/**
 * The handler is invoked with two arguments:
 *
 * - the element that has been resized
 * - the {@link ScrollData} for the element
 */
export type OnScrollHandlerArgs = [Element, ScrollData];
export type OnScrollCallback = Callback<OnScrollHandlerArgs>;
export type OnScrollHandler =
  | CallbackHandler<OnScrollHandlerArgs>
  | OnScrollCallback;

export type ScrollData = {
  clientWidth: number;
  clientHeight: number;
  scrollWidth: number;
  scrollHeight: number;

  scrollTop: number;

  /**
   * This is the `scrollTop` relative to the full `scrollHeight` minus the
   * `clientHeight`, ranging from 0 to 1.
   */
  scrollTopFraction: number;

  scrollLeft: number;

  /**
   * This is the `scrollLeft` relative to the full `scrollWidth` minus the
   * `clientWidth`, ranging from 0 to 1.
   */
  scrollLeftFraction: number;

  /**
   * This is the direction of the last scroll action, i.e. _compared to the
   * last scroll event_, not necessarily based on the deltas compared to the
   * last time this callback was called.
   */
  direction: ScrollDirection;
};

// ----------------------------------------

type ScrollWatcherConfigInternal = {
  _debounceWindow: number;
  _scrollThreshold: number;
  _scrollDuration: number;
};

type OnScrollOptionsInternal = {
  _element: Element;
  _eventTarget: ScrollTarget;
  _directions: ScrollDirection[] | null;
  _threshold: number;
  _debounceWindow: number;
};

type CallbackEntry = {
  _callback: OnScrollCallback;
  _trackType: TrackType;
  _options: OnScrollOptionsInternal;
  _data?: ScrollData;
};

type TrackType = typeof TRACK_REGULAR | typeof TRACK_FULL;

const CONSTRUCTOR_KEY: unique symbol = MC.SYMBOL() as typeof CONSTRUCTOR_KEY;
const instances = MH.newMap<string, ScrollWatcher>();

const PREFIX_WRAPPER = MH.prefixName("scroll-watcher-wrapper");

const getConfig = (
  config: ScrollWatcherConfig | undefined,
): ScrollWatcherConfigInternal => {
  config ??= {};
  return {
    _debounceWindow: toNonNegNum(config[MC.S_DEBOUNCE_WINDOW], 75),
    // If threshold is 0, internally treat as 1 (pixel)
    _scrollThreshold: toNonNegNum(config.scrollThreshold, 50) || 1,
    _scrollDuration: toNonNegNum(config.scrollDuration, 1000),
  };
};

const TRACK_REGULAR = 1; // only scroll events
const TRACK_FULL = 2; // scroll + resizing of content and/or wrapper

// --------------------

const fetchOnScrollOptions = async (
  config: ScrollWatcherConfigInternal,
  options: OnScrollOptions,
): Promise<OnScrollOptionsInternal> => {
  const directions =
    validateStrList("directions", options.directions, isValidScrollDirection) ||
    null;

  const element = await fetchScrollableElement(options.scrollable);

  return {
    _element: element,
    _eventTarget: getEventTarget(element),
    _directions: directions,
    // If threshold is 0, internally treat as 1 (pixel)
    _threshold: toNonNegNum(options.threshold, config._scrollThreshold) || 1,
    _debounceWindow: options[MC.S_DEBOUNCE_WINDOW] ?? config._debounceWindow,
  };
};

const directionMatches = (
  userDirections: ScrollDirection[] | null,
  latestDirection: ScrollDirection,
) => !userDirections || MH.includes(userDirections, latestDirection);

const hasExceededThreshold = (
  options: OnScrollOptionsInternal,
  latestData: ScrollData,
  lastThresholdData: ScrollData | undefined,
): boolean => {
  const directions = options._directions;
  const threshold = options._threshold;
  if (!lastThresholdData) {
    /* istanbul ignore */
    return false;
  }

  const topDiff = maxAbs(
    latestData[MC.S_SCROLL_TOP] - lastThresholdData[MC.S_SCROLL_TOP],
    latestData[MC.S_SCROLL_HEIGHT] - lastThresholdData[MC.S_SCROLL_HEIGHT],
    latestData[MC.S_CLIENT_HEIGHT] - lastThresholdData[MC.S_CLIENT_HEIGHT],
  );

  const leftDiff = maxAbs(
    latestData[MC.S_SCROLL_LEFT] - lastThresholdData[MC.S_SCROLL_LEFT],
    latestData[MC.S_SCROLL_WIDTH] - lastThresholdData[MC.S_SCROLL_WIDTH],
    latestData[MC.S_CLIENT_WIDTH] - lastThresholdData[MC.S_CLIENT_WIDTH],
  );

  // If the callback is only interested in up/down, then only check the
  // scrollTop delta, and similarly for left/right.
  let checkTop = false,
    checkLeft = false;
  if (
    !directions ||
    MH.includes(directions, MC.S_NONE) ||
    MH.includes(directions, MC.S_AMBIGUOUS)
  ) {
    checkTop = checkLeft = true;
  } else {
    if (
      MH.includes(directions, MC.S_UP) ||
      MH.includes(directions, MC.S_DOWN)
    ) {
      checkTop = true;
    }
    if (
      MH.includes(directions, MC.S_LEFT) ||
      MH.includes(directions, MC.S_RIGHT)
    ) {
      checkLeft = true;
    }
  }

  return (
    (checkTop && topDiff >= threshold) || (checkLeft && leftDiff >= threshold)
  );
};

const fetchScrollData = async (
  element: Element,
  previousEventData: ScrollData | undefined,
  realtime: boolean,
): Promise<ScrollData> => {
  if (!realtime) {
    await waitForMeasureTime();
  }

  const scrollTop = MH.ceil(element[MC.S_SCROLL_TOP]);
  const scrollLeft = MH.ceil(element[MC.S_SCROLL_LEFT]);
  const scrollWidth = element[MC.S_SCROLL_WIDTH];
  const scrollHeight = element[MC.S_SCROLL_HEIGHT];
  const clientWidth = getClientWidthNow(element);
  const clientHeight = getClientHeightNow(element);

  const scrollTopFraction =
    MH.round(scrollTop) / (scrollHeight - clientHeight || MC.INFINITY);
  const scrollLeftFraction =
    MH.round(scrollLeft) / (scrollWidth - clientWidth || MC.INFINITY);

  const prevScrollTop = previousEventData?.scrollTop ?? 0;
  const prevScrollLeft = previousEventData?.scrollLeft ?? 0;

  const direction = getMaxDeltaDirection(
    scrollLeft - prevScrollLeft,
    scrollTop - prevScrollTop,
  );

  return {
    direction,
    [MC.S_CLIENT_WIDTH]: clientWidth,
    [MC.S_CLIENT_HEIGHT]: clientHeight,
    [MC.S_SCROLL_WIDTH]: scrollWidth,
    [MC.S_SCROLL_HEIGHT]: scrollHeight,
    [MC.S_SCROLL_TOP]: scrollTop,
    [MC.S_SCROLL_TOP_FRACTION]: scrollTopFraction,
    [MC.S_SCROLL_LEFT]: scrollLeft,
    [MC.S_SCROLL_LEFT_FRACTION]: scrollLeftFraction,
  };
};

const setScrollCssProps = (
  element: Element,
  scrollData: Partial<ScrollData> | undefined | null,
) => {
  let prefix = "";
  if (element === tryGetMainScrollableElement()) {
    // Set the CSS vars on the root element
    element = MH.getDocElement();
    prefix = "page-";
  }

  scrollData ??= {};
  const props = {
    [MC.S_SCROLL_TOP]: scrollData[MC.S_SCROLL_TOP],
    [MC.S_SCROLL_TOP_FRACTION]: scrollData[MC.S_SCROLL_TOP_FRACTION],
    [MC.S_SCROLL_LEFT]: scrollData[MC.S_SCROLL_LEFT],
    [MC.S_SCROLL_LEFT_FRACTION]: scrollData[MC.S_SCROLL_LEFT_FRACTION],
    [MC.S_SCROLL_WIDTH]: scrollData[MC.S_SCROLL_WIDTH],
    [MC.S_SCROLL_HEIGHT]: scrollData[MC.S_SCROLL_HEIGHT],
  };
  setNumericStyleJsVars(element, props, { _prefix: prefix });
};

const getEventTarget = (element: Element): ScrollTarget => {
  if (element === MH.getDocScrollingElement()) {
    return MH.getDoc();
  }

  return element;
};

const invokeCallback = (
  callback: OnScrollCallback,
  element: Element,
  scrollData: ScrollData,
) => callback.invoke(element, MH.copyObject(scrollData)).catch(logError);
