/**
 * @module Utils
 */

import * as _ from "@lisn/_internal";

import { usageError } from "@lisn/globals/errors";

import { settings } from "@lisn/globals/settings";

import {
  ScrollDirection,
  ScrollTarget,
  TargetCoordinates,
  CoordinateOffset,
  ScrollPosition,
  Anchor,
} from "@lisn/globals/types";

import { getComputedStylePropNow } from "@lisn/utils/css-alter";
import { SCROLL_DIRECTIONS } from "@lisn/utils/directions";
import {
  waitForInteractive,
  waitForElementOrInteractive,
} from "@lisn/utils/dom-events";
import { waitForMeasureTime } from "@lisn/utils/dom-optimize";
import { addEventListenerTo, removeEventListenerFrom } from "@lisn/utils/event";
import { logError, logWarn } from "@lisn/utils/log";
import { maxAbs } from "@lisn/utils/math";
import { randId, formatAsString } from "@lisn/utils/text";
import { animation3DTweener, Tweener } from "@lisn/utils/tween";
import { isValidStrList } from "@lisn/utils/validation";

import { createXMap } from "@lisn/modules/x-map";

import debug from "@lisn/debug/debug";

/**
 * @category Scrolling
 */
export type ScrollAction = {
  cancel: () => boolean;

  /**
   * Will reject if the scroll is cancelled.
   */
  waitFor: () => Promise<ScrollPosition>;
};

/**
 * @category Scrolling
 * @interface
 */
export type ScrollToOptions = {
  /**
   * The element that should be scrolled.
   *
   * @defaultValue If `document.body` is scrollable, will use that; otherwise `document.scrollingElement`
   */
  scrollable?: Element;

  /**
   * Offset the target coordinates by the given amount(s).
   *
   * E.g. if the final target coordinates are computed to be
   * `{top: 100, left: 0}` and you specify offset as `{top: 10, left: 20}`, it
   * will scroll to  `{top: 110, left: 20}`.
   *
   * @defaultValue undefined
   */
  offset?: CoordinateOffset;

  // TODO maybe support fixed average velocity as an alternative to fixed duration?
  /**
   * The duration of the scroll animation in milliseconds. If not given, it is
   * instant.
   *
   * @defaultValue {@link settings.effectLag}
   */
  duration?: number;

  /**
   * Whether another request to us to scroll the same target can interrupt this
   * scroll before it finishes.
   *
   * @defaultValue false
   */
  weCanInterrupt?: boolean;

  /**
   * Whether a user attempt to scroll the target can interrupt this before it
   * finishes.
   *
   * @defaultValue false
   */
  userCanInterrupt?: boolean;

  /**
   * If the scrolling element is already at the given coordinates (or strictly
   * speaking we allow for 5 pixels difference), then if `altTarget` is given,
   * this will become the target to scroll to.
   *
   * @defaultValue undefined
   */
  altTarget?: TargetCoordinates | Element | string;

  /**
   * Offset the target coordinates by the given amount(s) when `altTarget` is used.
   *
   * See {@link ScrollToOptions.offset}.
   *
   * @defaultValue undefined
   */
  altOffset?: CoordinateOffset;

  /**
   * A built-in or custom tweener function to calculate the interpolation from
   * current to target.
   *
   * @defaultValue "spring"
   */
  tweener?: Tweener;
};

// ----------

/**
 * Returns true if the given element is scrollable in the given direction, or
 * in either direction (if `axis` is not given).
 *
 * It first checks whether the current scroll offset on the target along the
 * given axis is non-0, and if so returns true immediately. Otherwise it will
 * attempt to determine if it's scrollable using one of these methods
 * (controlled by `options.active`):
 * - passive check (default): Will examine `clientWidth/Height`,
 *   `scrollWidth/Height` as well as the computed `overflow` CSS property to try
 *   to determine if the target is scrollable. This is not 100% reliable but is
 *   safer than the active check
 * - active check: Will attempt to scroll the target by 1px and examine if the
 *   scroll offset had changed, then revert it back to 0. This is a more
 *   reliable check, however it can cause issues in certain contexts. In
 *   particular, if a scroll on the target had just been initiated (but it's
 *   scroll offset was still 0), the scroll may be cancelled. Never use that
 *   inside scroll-based handlers.
 *
 * **NOTE:** If the layout has been invalidated and not yet recalculated, this
 * will cause a forced layout, so always {@link waitForMeasureTime} before
 * calling this function when possible.
 *
 * @param [options.axis]    One of "x" or "y" for horizontal or vertical scroll
 *                          respectively. If not given, it checks both.
 * @param [options.active]  If true, then if the target's current scroll offset
 *                          is 0, it will attempt to scroll it rather than
 *                          looking at its overflow.
 * @param [options.noCache] By default the result of a check is cached for 1s
 *                          and if there's already a cached result for this
 *                          element, it is returned. Set this to true to disable
 *                          checking the cache and also saving the result into
 *                          the cache.
 *
 * @category Scrolling
 */
export const isScrollable = (
  element: Element,
  options?: {
    axis?: "x" | "y";
    active?: boolean;
    noCache?: boolean;
  },
): boolean => {
  const { axis, active, noCache } = options ?? {};
  if (!axis) {
    return (
      isScrollable(element, { axis: "y", active, noCache }) ||
      isScrollable(element, { axis: "x", active, noCache })
    );
  }

  if (!noCache) {
    const cachedResult = isScrollableCache.get(element)?.get(axis);
    if (!_.isNullish(cachedResult)) {
      return cachedResult;
    }
  }

  const offset = axis === "x" ? "Left" : "Top";
  let result = false;

  if (element[`scroll${offset}`]) {
    result = true;
  } else if (active) {
    // Use scrollTo with explicit behavior set to instant instead of setting
    // the scrollTop/Left properties since the latter doesn't work with
    // scroll-behavior smooth.
    _.elScrollTo(element, { [_.toLowerCase(offset)]: 1 });
    const canScroll = element[`scroll${offset}`] > 0;
    _.elScrollTo(element, { [_.toLowerCase(offset)]: 0 });
    result = canScroll;
  } else {
    const dimension = axis === "x" ? "Width" : "Height";
    const isDocScrollable = element === _.getDocScrollingElement();

    const hasOverflow =
      element[`scroll${dimension}`] > element[`client${dimension}`];
    const overflowProp = getComputedStylePropNow(element, "overflow");
    const scrollingOverflows = [
      _.S_SCROLL,
      _.S_AUTO,
      ...(isDocScrollable ? [_.S_VISIBLE] : []),
    ];

    result = hasOverflow && _.includes(scrollingOverflows, overflowProp);
  }

  if (!noCache) {
    isScrollableCache.sGet(element).set(axis, result);
    _.setTimer(() => {
      _.deleteKey(isScrollableCache.get(element), axis);
      isScrollableCache.prune(element);
    }, IS_SCROLLABLE_CACHE_TIMEOUT);
  }

  return result;
};

/**
 * Returns the closest scrollable ancestor of the given element, _not including
 * it_.
 *
 * @param options See {@link isScrollable}
 *
 * @returns `null` if no scrollable ancestors are found.
 *
 * @category Scrolling
 */
export const getClosestScrollable = (
  element: Element,
  options?: {
    axis?: "x" | "y";
    active?: boolean;
    noCache?: boolean;
  },
) => {
  // Walk up the tree, starting at the element in question but excluding it.
  let ancestor: Element | null | undefined = element;
  while ((ancestor = _.parentOf(ancestor))) {
    if (isScrollable(ancestor, options)) {
      return ancestor;
    }
  }

  return null;
};

/**
 * Returns the current {@link ScrollAction} if any.
 *
 * @category Scrolling
 */
export const getCurrentScrollAction = (
  scrollable?: Element,
): ScrollAction | null => {
  scrollable = toScrollableOrDefault(scrollable);
  const action = currentScrollInfos.get(scrollable)?._action;
  return action ? _.copyObject(action) : null;
};

/**
 * Scrolls the given scrollable element to the given `to` target.
 *
 * Returns `null` if there's an ongoing scroll that is not cancellable.
 *
 * Note that if `to` is an element or a query selector string, then it _must_ be
 * a descendant of the scrollable element.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *               If the target coordinates are invalid.
 *
 * @param to If this is an element, then its top-left position is used as
 *           the target coordinates. If it is a string, then it is treated
 *           as a selector for an element using `querySelector`.
 *
 * @returns `null` if there's an ongoing scroll that is not cancellable,
 * otherwise a {@link ScrollAction}.
 *
 * @category Scrolling
 */
export const scrollTo = (
  to: TargetCoordinates | Element | string,
  userOptions?: ScrollToOptions,
): ScrollAction | null => {
  const options = getOptions(to, userOptions);
  const scrollable = options._scrollable;

  // cancel current scroll action if any
  const existingScrollAction = currentScrollInfos.get(scrollable)?._action;
  if (existingScrollAction) {
    if (!existingScrollAction.cancel()) {
      // current scroll action is not cancellable by us
      return null;
    }
  }

  let isCancelled = false;

  const cancelFn = options._weCanInterrupt
    ? () => (isCancelled = true)
    : () => false;

  const scrollEvents = ["touchmove", "wheel"]; // don't bother with keyboard
  let preventScrollHandler: EventListener | null = null;

  if (options._userCanInterrupt) {
    for (const eventType of scrollEvents) {
      addEventListenerTo(
        scrollable,
        eventType,
        () => {
          isCancelled = true;
        },
        { once: true },
      );
    }
  } else {
    preventScrollHandler = _.preventDefault;
    for (const eventType of scrollEvents) {
      addEventListenerTo(scrollable, eventType, preventScrollHandler, {
        passive: false,
      });
    }
  }

  const thisInfo = {
    _action: {
      waitFor: () => scrollActionPromise,
      cancel: cancelFn,
    },
  };

  const cleanup = () => {
    if (currentScrollInfos.get(scrollable)?._action === thisInfo._action) {
      // It means our action completed; otherwise, if we were cancelled by
      // another action, _action would have been overridden by the next one.
      _.deleteKey(currentScrollInfos, scrollable);
    }

    if (preventScrollHandler) {
      for (const eventType of scrollEvents) {
        removeEventListenerFrom(scrollable, eventType, preventScrollHandler, {
          passive: false,
        });
      }
    }
  };

  const scrollActionPromise = initiateScroll(options, () => isCancelled);
  thisInfo._action.waitFor().then(cleanup).catch(cleanup);

  updateCurrentScrollInfo(scrollable, thisInfo);
  return thisInfo._action;
};

/**
 * Returns true if the given string is a valid scroll direction.
 *
 * @category Validation
 */
export const isValidScrollDirection = (
  direction: string,
): direction is ScrollDirection => _.includes(SCROLL_DIRECTIONS, direction);

/**
 * Returns true if the given string or array is a list of valid scroll
 * directions.
 *
 * @category Validation
 */
export const isValidScrollDirectionList = (directions: string | string[]) =>
  isValidStrList(directions, isValidScrollDirection, false);

/**
 * @ignore
 * @internal
 */
export const mapScrollable = (original: Element, actualScrollable: Element) =>
  mappedScrollables.set(original, actualScrollable);

/**
 * @ignore
 * @internal
 */
export const unmapScrollable = (original: Element) =>
  _.deleteKey(mappedScrollables, original);

/**
 * @ignore
 * @internal
 */
export const getClientWidthNow = (element: Element) =>
  isScrollableBodyInQuirks(element)
    ? element.offsetWidth -
      getBorderWidth(element, _.S_LEFT) -
      getBorderWidth(element, _.S_RIGHT)
    : element[_.S_CLIENT_WIDTH];

/**
 * @ignore
 * @internal
 */
export const getClientHeightNow = (element: Element) =>
  isScrollableBodyInQuirks(element)
    ? element.offsetHeight -
      getBorderWidth(element, _.S_TOP) -
      getBorderWidth(element, _.S_BOTTOM)
    : element[_.S_CLIENT_HEIGHT];

/**
 * @ignore
 * @internal
 */
export const tryGetMainContentElement = (): HTMLElement | null =>
  mainContentElement ?? null;

/**
 * @ignore
 * @internal
 *
 * Exposed via ScrollWatcher
 */
export const fetchMainContentElement = async (): Promise<HTMLElement> => {
  await init();

  return mainContentElement;
};

/**
 * @ignore
 * @internal
 */
export const tryGetMainScrollableElement = (): HTMLElement | null =>
  mainScrollableElement ?? null;

/**
 * @ignore
 * @internal
 *
 * Exposed via ScrollWatcher
 */
export const fetchMainScrollableElement = async (): Promise<HTMLElement> => {
  await init();

  return mainScrollableElement;
};

/**
 * @ignore
 * @internal
 */
export const getDefaultScrollingElement = () => {
  const body = _.getBody();
  return isScrollable(body) ? body : (_.getDocScrollingElement() ?? body);
};

/**
 * @ignore
 * @internal
 */
export const tryGetScrollableElement = (
  target: ScrollTarget | null | undefined,
): Element | null => toScrollableOrMain(target, tryGetMainScrollableElement);

/**
 * @ignore
 * @internal
 */
export const fetchScrollableElement = async (
  target: ScrollTarget | null | undefined,
): Promise<Element> => toScrollableOrMain(target, fetchMainScrollableElement);

// ----------------------------------------

type ScrollToOptionsInternal = {
  _target: TargetCoordinates;
  _offset: CoordinateOffset | null;
  _altTarget: TargetCoordinates | null;
  _altOffset: CoordinateOffset | null;
  _scrollable: Element;
  _duration: number;
  _weCanInterrupt: boolean;
  _userCanInterrupt: boolean;
  _tweener: Tweener;
};

type ScrollInfo = {
  _action?: ScrollAction;
  // _generator is the current ongoing animation3DTweener
  // If a scroll action is cancelled by another scroll action, it will re-use
  // the same generator to avoid interruption in the scroll animation
  _generator?: ReturnType<typeof animation3DTweener<"x" | "y">>;
};

const IS_SCROLLABLE_CACHE_TIMEOUT = 1000;
const isScrollableCache = createXMap<Element, Map<"x" | "y", boolean>>(() =>
  _.createMap(),
);

const mappedScrollables = _.createWeakMap<Element, Element>();

const currentScrollInfos = _.createWeakMap<Element, ScrollInfo>();

const DIFF_THRESHOLD = 5;
const arePositionsDifferent = (
  start: ScrollPosition,
  end: ScrollPosition,
  threshold = DIFF_THRESHOLD,
) => maxAbs(start.top - end.top, start.left - end.left) > threshold;

// must be called in "measure time"
const getBorderWidth = (element: Element, side: Anchor) =>
  _.ceil(_.parseFloat(getComputedStylePropNow(element, `border-${side}`)));

const isScrollableBodyInQuirks = (element: Element): element is HTMLElement =>
  element === _.getBody() && !_.getDocScrollingElement();

const toScrollableOrMain = <R>(
  target: ScrollTarget | null | undefined,
  getMain: () => R,
): Element | R => {
  if (_.isElement(target)) {
    return mappedScrollables.get(target) ?? target;
  }

  if (!target || target === _.getWindow() || target === _.getDoc()) {
    return getMain();
  }

  throw usageError("Unsupported scroll target");
};

const toScrollableOrDefault = (scrollable: Element | undefined): Element =>
  scrollable ?? getDefaultScrollingElement();

const getOptions = (
  to: TargetCoordinates | Element | string,
  options: ScrollToOptions | undefined,
): ScrollToOptionsInternal => {
  const scrollable = toScrollableOrDefault(options?.scrollable);
  const target = getTargetCoordinates(scrollable, to);
  const altTarget = options?.altTarget
    ? getTargetCoordinates(scrollable, options?.altTarget)
    : null;

  return {
    _target: target,
    _offset: options?.offset ?? null,
    _altTarget: altTarget,
    _altOffset: options?.altOffset ?? null,
    _scrollable: scrollable,
    _duration: options?.duration ?? settings.effectLag,
    _weCanInterrupt: options?.weCanInterrupt ?? false,
    _userCanInterrupt: options?.userCanInterrupt ?? false,
    _tweener: options?.tweener ?? "spring",
  };
};

const updateCurrentScrollInfo = (
  scrollable: Element,
  newInfo: Partial<ScrollInfo>,
) => {
  const existingScrollInfo = currentScrollInfos.get(scrollable);
  currentScrollInfos.set(scrollable, _.merge(existingScrollInfo, newInfo));
};

const getTargetCoordinates = (
  scrollable: Element,
  target: TargetCoordinates | Element | string,
): TargetCoordinates => {
  const isDocScrollingElement = scrollable === _.getDocScrollingElement();

  if (_.isElement(target)) {
    if (scrollable === target || !scrollable.contains(target)) {
      throw usageError("Target must be a descendant of the scrollable one");
    }

    return {
      top: () =>
        _.getBoundingClientRect(target).top -
        _.getBoundingClientRect(scrollable).top +
        (isDocScrollingElement ? 0 : scrollable[_.S_SCROLL_TOP]),
      left: () =>
        _.getBoundingClientRect(target).left -
        _.getBoundingClientRect(scrollable).left +
        (isDocScrollingElement ? 0 : scrollable[_.S_SCROLL_LEFT]),
    };
  }

  if (_.isString(target)) {
    const targetEl = _.docQuerySelector(target);
    if (!targetEl) {
      throw usageError(`No match for '${target}'`);
    }

    return getTargetCoordinates(scrollable, targetEl);
  }

  if (!_.isObject(target) || !("top" in target || "left" in target)) {
    throw usageError("Invalid coordinates");
  }

  return target;
};

const getStartEndPosition = async (
  options: ScrollToOptionsInternal,
): Promise<{ _start: ScrollPosition; _end: ScrollPosition }> => {
  await waitForMeasureTime();

  const applyOffset = (
    position: ScrollPosition,
    offset: CoordinateOffset | null,
  ) => {
    position.top += offset?.top ?? 0;
    position.left += offset?.left ?? 0;
  };

  const scrollable = options._scrollable;
  const start = {
    top: scrollable[_.S_SCROLL_TOP],
    left: scrollable[_.S_SCROLL_LEFT],
  };

  let end = getEndPosition(scrollable, start, options._target);
  applyOffset(end, options._offset);

  if (!arePositionsDifferent(start, end) && options._altTarget) {
    end = getEndPosition(scrollable, start, options._altTarget);
    applyOffset(end, options._altOffset);
  }

  return { _start: start, _end: end };
};

// must be called in "measure time"
const getEndPosition = (
  scrollable: Element,
  startPosition: ScrollPosition,
  targetCoordinates: TargetCoordinates,
): ScrollPosition => {
  // by default no change in scroll top or left
  const endPosition = _.copyObject(startPosition);

  if (!_.isNullish(targetCoordinates?.top)) {
    if (_.isFunction(targetCoordinates.top)) {
      endPosition.top = targetCoordinates.top(scrollable);
    } else {
      endPosition.top = targetCoordinates.top;
    }
  }

  if (!_.isNullish(targetCoordinates?.left)) {
    if (_.isFunction(targetCoordinates.left)) {
      endPosition.left = targetCoordinates.left(scrollable);
    } else {
      endPosition.left = targetCoordinates.left;
    }
  }

  // Set boundaries
  const scrollH = scrollable[_.S_SCROLL_HEIGHT];
  const scrollW = scrollable[_.S_SCROLL_WIDTH];
  const clientH = getClientHeightNow(scrollable);
  const clientW = getClientWidthNow(scrollable);
  endPosition.top = _.min(scrollH - clientH, endPosition.top);
  endPosition.top = _.max(0, endPosition.top);

  endPosition.left = _.min(scrollW - clientW, endPosition.left);
  endPosition.left = _.max(0, endPosition.left);

  return endPosition;
};

const initiateScroll = async (
  options: ScrollToOptionsInternal,
  isCancelled: () => boolean,
) => {
  const position = await getStartEndPosition(options);
  const duration = options._duration;
  const scrollable = options._scrollable;

  const logger = debug
    ? new debug.Logger({
        name: `scroll-${formatAsString(scrollable)}-${randId()}`,
        logAtCreation: {
          options,
          position,
        },
      })
    : null;

  const currentPosition = _.copyObject(position._start);

  if (isCancelled()) {
    // Reject the promise
    logger?.debug8("Cancelled");
    throw currentPosition;
  }

  // If we cancelled another action, pick up from where it had left
  let generator = currentScrollInfos.get(scrollable)?._generator;
  if (!generator) {
    generator = animation3DTweener(options._tweener, {
      x: {
        current: position._start.left,
        target: position._end.left,
        lag: duration,
      },
      y: {
        current: position._start.top,
        target: position._end.top,
        lag: duration,
      },
    });

    updateCurrentScrollInfo(scrollable, {
      _generator: generator,
    });
  }

  for await (const state of generator) {
    currentPosition.left = state.x.previous;
    currentPosition.top = state.y.previous;
    logger?.debug10("Got", state);

    // Element.scrollTo equates to a measurement and needs to run after
    // painting to avoid forced layout.
    await waitForMeasureTime();

    if (isCancelled()) {
      // Reject the promise
      logger?.debug8("Cancelled");
      throw currentPosition;
    }

    currentPosition.left = state.x.current;
    currentPosition.top = state.y.current;

    _.elScrollTo(scrollable, currentPosition);
  }

  logger?.debug8("Done");
  return currentPosition;
};

// ------------------------------

let mainContentElement: HTMLElement;
let mainScrollableElement: HTMLElement;

let initPromise: Promise<void> | null = null;
const init = (): Promise<void> => {
  if (!initPromise) {
    initPromise = (async () => {
      const mainScrollableElementSelector =
        settings.mainScrollableElementSelector;

      const contentElement = await waitForElementOrInteractive(() => {
        return mainScrollableElementSelector
          ? _.docQuerySelector(mainScrollableElementSelector)
          : _.getBody(); // default if no selector
      });

      // defaults
      mainScrollableElement = getDefaultScrollingElement();
      mainContentElement = _.getBody();

      if (!contentElement) {
        logError(
          usageError(
            `No match for '${mainScrollableElementSelector}'. ` +
              "Scroll tracking/capturing may not work as intended.",
          ),
        );
      } else if (!_.isHTMLElement(contentElement)) {
        logWarn("mainScrollableElementSelector should point to an HTMLElement");
      } else if (contentElement !== mainContentElement) {
        mainScrollableElement = mainContentElement = contentElement;
      }
    })();
  }

  return initPromise;
};

// Try to find the main scrollable/content elements asap so that tryGetMain*
// can return them if called before fetchMain*
if (_.hasDOM()) {
  waitForInteractive().then(init);
}
