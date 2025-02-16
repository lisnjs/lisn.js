/**
 * @module Utils
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { settings } from "../globals/settings.js";
import { getComputedStylePropNow } from "./css-alter.js";
import { SCROLL_DIRECTIONS } from "./directions.js";
import { waitForInteractive, waitForElementOrInteractive } from "./dom-events.js";
import { waitForMeasureTime, waitForMutateTime } from "./dom-optimize.js";
import { addEventListenerTo, removeEventListenerFrom } from "./event.js";
import { logError, logWarn } from "./log.js";
import { maxAbs, easeInOutQuad } from "./math.js";
import { isValidStrList } from "./validation.js";
import { newXMap } from "../modules/x-map.js";

/**
 * @category Scrolling
 */

/**
 * @category Scrolling
 * @interface
 */

// ----------

/**
 * Returns true if the given element is scrollable in the given direction, or
 * in either direction (if `axis` is not given).
 *
 * **IMPORTANT:** If you enable `active` then be aware that:
 * 1. It may attempt to scroll the target in order to determine whether it's
 *    scrollable in a more reliable way than the default method of comparing
 *    clientWidth/Height to scrollWidth/Height. If there is currently any
 *    ongoing scroll on the target, this will stop it, so never use that inside
 *    scroll-triggered handlers.
 * 2. If the layout has been invalidated and not yet recalculated,
 *    this will cause a forced layout, so always {@link waitForMeasureTime}
 *    before calling this function when possible.
 *
 * @param {} [options.axis]    One of "x" or "y" for horizontal or vertical
 *                             scroll respectively. If not given, it checks
 *                             both.
 * @param {} [options.active]  If true, then if the target's current scroll
 *                             offset is 0, it will attempt to scroll it rather
 *                             than looking at the clientWidth/Height to
 *                             scrollWidth/Height. This is more reliable but can
 *                             cause issues, see note above.
 * @param {} [options.noCache] By default the result of a check is cached for
 *                             1s and if there's already a cached result for
 *                             this element, it is returns. Set this to true to
 *                             disable checking the cache and also saving the
 *                             result into the cache.
 *
 * @category Scrolling
 */
export const isScrollable = (element, options) => {
  const {
    axis,
    active,
    noCache
  } = options || {};
  if (!axis) {
    return isScrollable(element, {
      axis: "y",
      active,
      noCache
    }) || isScrollable(element, {
      axis: "x",
      active,
      noCache
    });
  }
  if (!noCache) {
    var _isScrollableCache$ge;
    const cachedResult = (_isScrollableCache$ge = isScrollableCache.get(element)) === null || _isScrollableCache$ge === void 0 ? void 0 : _isScrollableCache$ge.get(axis);
    if (!MH.isNullish(cachedResult)) {
      return cachedResult;
    }
  }
  const offset = axis === "x" ? "Left" : "Top";
  let result = false;
  let doCache = !noCache;
  if (element[`scroll${offset}`]) {
    result = true;
  } else if (active) {
    // Use scrollTo with explicit behavior set to instant instead of setting
    // the scrollTop/Left properties since the latter doesn't work with
    // scroll-behavior smooth.
    MH.elScrollTo(element, {
      [MH.toLowerCase(offset)]: 1
    });
    const canScroll = element[`scroll${offset}`] > 0;
    MH.elScrollTo(element, {
      [MH.toLowerCase(offset)]: 0
    });
    result = canScroll;
  } else {
    const dimension = axis === "x" ? "Width" : "Height";
    result = element[`scroll${dimension}`] > element[`client${dimension}`];
    // No need to cache a passive check.
    doCache = false;
  }
  if (doCache) {
    isScrollableCache.sGet(element).set(axis, result);
    MH.setTimer(() => {
      MH.deleteKey(isScrollableCache.get(element), axis);
      isScrollableCache.prune(element);
    }, IS_SCROLLABLE_CACHE_TIMEOUT);
  }
  return result;
};

/**
 * Returns the closest scrollable ancestor of the given element, _not including
 * it_.
 *
 * @param {} options See {@link isScrollable}
 *
 * @return {} `null` if no scrollable ancestors are found.
 *
 * @category Scrolling
 */
export const getClosestScrollable = (element, options) => {
  // Walk up the tree, starting at the element in question but excluding it.
  let ancestor = element;
  while (ancestor = MH.parentOf(ancestor)) {
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
export const getCurrentScrollAction = scrollable => {
  scrollable = toScrollableOrDefault(scrollable);
  const action = currentScrollAction.get(scrollable);
  if (action) {
    return MH.copyObject(action);
  }
  return null;
};

/**
 * Scrolls the given scrollable element to the given `to` target.
 *
 * Returns `null` if there's an ongoing scroll that is not cancellable.
 *
 * Note that if `to` is an element or a selector, then it _must_ be a
 * descendant of the scrollable element.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *               If the target coordinates are invalid.
 *
 * @param {} to  If this is an element, then its top-left position is used as
 *               the target coordinates. If it is a string, then it is treated
 *               as a selector for an element using `querySelector`.
 *
 * @return {} `null` if there's an ongoing scroll that is not cancellable,
 * otherwise a {@link ScrollAction}.
 *
 * @category Scrolling
 */
export const scrollTo = (to, userOptions) => {
  const options = getOptions(to, userOptions);
  const scrollable = options._scrollable;

  // cancel current scroll action if any
  const currentScroll = currentScrollAction.get(scrollable);
  if (currentScroll) {
    if (!currentScroll.cancel()) {
      // current scroll action is not cancellable by us
      return null;
    }
  }
  let isCancelled = false;
  const cancelFn = options._weCanInterrupt ? () => isCancelled = true : () => false;
  const scrollEvents = ["touchmove", "wheel"]; // don't bother with keyboard
  let preventScrollHandler = null;
  if (options._userCanInterrupt) {
    for (const eventType of scrollEvents) {
      addEventListenerTo(scrollable, eventType, () => {
        isCancelled = true;
      }, {
        once: true
      });
    }
  } else {
    preventScrollHandler = MH.preventDefault;
    for (const eventType of scrollEvents) {
      addEventListenerTo(scrollable, eventType, preventScrollHandler, {
        passive: false
      });
    }
  }
  const promise = initiateScroll(options, () => isCancelled);
  const thisScrollAction = {
    waitFor: () => promise,
    cancel: cancelFn
  };
  const cleanup = () => {
    if (currentScrollAction.get(scrollable) === thisScrollAction) {
      MH.deleteKey(currentScrollAction, scrollable);
    }
    if (preventScrollHandler) {
      for (const eventType of scrollEvents) {
        removeEventListenerFrom(scrollable, eventType, preventScrollHandler, {
          passive: false
        });
      }
    }
  };
  thisScrollAction.waitFor().then(cleanup).catch(cleanup);
  currentScrollAction.set(scrollable, thisScrollAction);
  return thisScrollAction;
};

/**
 * Returns true if the given string is a valid scroll direction.
 *
 * @category Validation
 */
export const isValidScrollDirection = direction => MH.includes(SCROLL_DIRECTIONS, direction);

/**
 * Returns true if the given string or array is a list of valid scroll
 * directions.
 *
 * @category Validation
 */
export const isValidScrollDirectionList = directions => isValidStrList(directions, isValidScrollDirection, false);

/**
 * @ignore
 * @internal
 */
export const mapScrollable = (original, actualScrollable) => mappedScrollables.set(original, actualScrollable);

/**
 * @ignore
 * @internal
 */
export const unmapScrollable = original => MH.deleteKey(mappedScrollables, original);

/**
 * @ignore
 * @internal
 */
export const getClientWidthNow = element => isScrollableBodyInQuirks(element) ? element.offsetWidth - getBorderWidth(element, MC.S_LEFT) - getBorderWidth(element, MC.S_RIGHT) : element[MC.S_CLIENT_WIDTH];

/**
 * @ignore
 * @internal
 */
export const getClientHeightNow = element => isScrollableBodyInQuirks(element) ? element.offsetHeight - getBorderWidth(element, MC.S_TOP) - getBorderWidth(element, MC.S_BOTTOM) : element[MC.S_CLIENT_HEIGHT];

/**
 * @ignore
 * @internal
 */
export const tryGetMainContentElement = () => mainContentElement !== null && mainContentElement !== void 0 ? mainContentElement : null;

/**
 * @ignore
 * @internal
 *
 * Exposed via ScrollWatcher
 */
export const fetchMainContentElement = async () => {
  await init();
  return mainContentElement;
};

/**
 * @ignore
 * @internal
 */
export const tryGetMainScrollableElement = () => mainScrollableElement !== null && mainScrollableElement !== void 0 ? mainScrollableElement : null;

/**
 * @ignore
 * @internal
 *
 * Exposed via ScrollWatcher
 */
export const fetchMainScrollableElement = async () => {
  await init();
  return mainScrollableElement;
};

/**
 * @ignore
 * @internal
 */
export const getDefaultScrollingElement = () => {
  const body = MH.getBody();
  return isScrollable(body) ? body : MH.getDocScrollingElement() || body;
};

/**
 * @ignore
 * @internal
 */
export const tryGetScrollableElement = target => toScrollableOrMain(target, tryGetMainScrollableElement);

/**
 * @ignore
 * @internal
 */
export const fetchScrollableElement = async target => toScrollableOrMain(target, fetchMainScrollableElement);

// ----------------------------------------

const IS_SCROLLABLE_CACHE_TIMEOUT = 1000;
const isScrollableCache = newXMap(() => MH.newMap());
const mappedScrollables = MH.newMap();
const currentScrollAction = MH.newMap();
const DIFF_THRESHOLD = 5;
const arePositionsDifferent = (start, end) => maxAbs(start.top - end.top, start.left - end.left) >= DIFF_THRESHOLD;
const toScrollableOrMain = (target, getMain) => {
  if (MH.isElement(target)) {
    return mappedScrollables.get(target) || target;
  }
  if (!target || target === MH.getWindow() || target === MH.getDoc()) {
    return getMain();
  }
  throw MH.usageError("Unsupported scroll target");
};
const toScrollableOrDefault = scrollable => scrollable !== null && scrollable !== void 0 ? scrollable : getDefaultScrollingElement();
const getOptions = (to, options) => {
  var _options$weCanInterru, _options$userCanInter;
  const scrollable = toScrollableOrDefault(options === null || options === void 0 ? void 0 : options.scrollable);
  const target = getTargetCoordinates(scrollable, to);
  const altTarget = options !== null && options !== void 0 && options.altTarget ? getTargetCoordinates(scrollable, options === null || options === void 0 ? void 0 : options.altTarget) : null;
  return {
    _target: target,
    _offset: (options === null || options === void 0 ? void 0 : options.offset) || null,
    _altTarget: altTarget,
    _altOffset: (options === null || options === void 0 ? void 0 : options.altOffset) || null,
    _scrollable: scrollable,
    _duration: (options === null || options === void 0 ? void 0 : options.duration) || 0,
    _weCanInterrupt: (_options$weCanInterru = options === null || options === void 0 ? void 0 : options.weCanInterrupt) !== null && _options$weCanInterru !== void 0 ? _options$weCanInterru : false,
    _userCanInterrupt: (_options$userCanInter = options === null || options === void 0 ? void 0 : options.userCanInterrupt) !== null && _options$userCanInter !== void 0 ? _options$userCanInter : false
  };
};
const getTargetCoordinates = (scrollable, target) => {
  const docScrollingElement = MH.getDocScrollingElement();
  if (MH.isElement(target)) {
    if (scrollable === target || !scrollable.contains(target)) {
      throw MH.usageError("Target must be a descendant of the scrollable one");
    }
    return {
      top: () => scrollable[MC.S_SCROLL_TOP] + MH.getBoundingClientRect(target).top - (scrollable === docScrollingElement ? 0 : MH.getBoundingClientRect(scrollable).top),
      left: () => scrollable[MC.S_SCROLL_LEFT] + MH.getBoundingClientRect(target).left - (scrollable === docScrollingElement ? 0 : MH.getBoundingClientRect(scrollable).left)
    };
  }
  if (MH.isString(target)) {
    const targetEl = MH.docQuerySelector(target);
    if (!targetEl) {
      throw MH.usageError(`No match for '${target}'`);
    }
    return getTargetCoordinates(scrollable, targetEl);
  }
  if (!MH.isObject(target) || !("top" in target || "left" in target)) {
    throw MH.usageError("Invalid coordinates");
  }
  return target;
};
const getStartEndPosition = async options => {
  await waitForMeasureTime();
  const applyOffset = (position, offset) => {
    position.top += (offset === null || offset === void 0 ? void 0 : offset.top) || 0;
    position.left += (offset === null || offset === void 0 ? void 0 : offset.left) || 0;
  };
  const scrollable = options._scrollable;
  const start = {
    top: scrollable[MC.S_SCROLL_TOP],
    left: scrollable[MC.S_SCROLL_LEFT]
  };
  let end = getEndPosition(scrollable, start, options._target);
  applyOffset(end, options._offset);
  if (!arePositionsDifferent(start, end) && options._altTarget) {
    end = getEndPosition(scrollable, start, options._altTarget);
    applyOffset(end, options._altOffset);
  }
  return {
    start,
    end
  };
};

// must be called in "measure time"
const getEndPosition = (scrollable, startPosition, targetCoordinates) => {
  // by default no change in scroll top or left
  const endPosition = MH.copyObject(startPosition);
  if (!MH.isNullish(targetCoordinates === null || targetCoordinates === void 0 ? void 0 : targetCoordinates.top)) {
    if (MH.isFunction(targetCoordinates.top)) {
      endPosition.top = targetCoordinates.top(scrollable);
    } else {
      endPosition.top = targetCoordinates.top;
    }
  }
  if (!MH.isNullish(targetCoordinates === null || targetCoordinates === void 0 ? void 0 : targetCoordinates.left)) {
    if (MH.isFunction(targetCoordinates.left)) {
      endPosition.left = targetCoordinates.left(scrollable);
    } else {
      endPosition.left = targetCoordinates.left;
    }
  }

  // Set boundaries
  const scrollH = scrollable[MC.S_SCROLL_HEIGHT];
  const scrollW = scrollable[MC.S_SCROLL_WIDTH];
  const clientH = getClientHeightNow(scrollable);
  const clientW = getClientWidthNow(scrollable);
  endPosition.top = MH.min(scrollH - clientH, endPosition.top);
  endPosition.top = MH.max(0, endPosition.top);
  endPosition.left = MH.min(scrollW - clientW, endPosition.left);
  endPosition.left = MH.max(0, endPosition.left);
  return endPosition;
};
const initiateScroll = async (options, isCancelled) => {
  const position = await getStartEndPosition(options);
  const duration = options._duration;
  const scrollable = options._scrollable;
  let startTime, previousTimeStamp;
  let currentPosition = position.start;
  const step = async () => {
    await waitForMutateTime(); // effectively next animation frame
    // Element.scrollTo equates to a measurement and needs to run after
    // painting to avoid forced layout.
    await waitForMeasureTime();
    const timeStamp = MH.timeNow();
    if (isCancelled()) {
      // Reject the promise
      throw currentPosition;
    }
    if (!startTime) {
      // If it's very close to the target, no need to scroll smoothly
      if (duration === 0 || !arePositionsDifferent(currentPosition, position.end)) {
        MH.elScrollTo(scrollable, position.end);
        return position.end;
      }
      startTime = timeStamp;
    }
    if (startTime !== timeStamp && previousTimeStamp !== timeStamp) {
      const elapsed = timeStamp - startTime;
      const progress = easeInOutQuad(MH.min(1, elapsed / duration));
      currentPosition = {
        top: position.start.top + (position.end.top - position.start.top) * progress,
        left: position.start.left + (position.end.left - position.start.left) * progress
      };
      MH.elScrollTo(scrollable, currentPosition);
      if (progress === 1) {
        return currentPosition;
      }
    }
    previousTimeStamp = timeStamp;
    return step();
  };
  return step();
};
const isScrollableBodyInQuirks = element => element === MH.getBody() && MH.getDocScrollingElement() === null;

// must be called in "measure time"
const getBorderWidth = (element, side) => MH.ceil(MH.parseFloat(getComputedStylePropNow(element, `border-${side}`)));

// ------------------------------

let mainContentElement;
let mainScrollableElement;
let initPromise = null;
const init = () => {
  if (!initPromise) {
    initPromise = (async () => {
      const mainScrollableElementSelector = settings.mainScrollableElementSelector;
      const contentElement = await waitForElementOrInteractive(() => {
        return mainScrollableElementSelector ? MH.docQuerySelector(mainScrollableElementSelector) : MH.getBody(); // default if no selector
      });

      // defaults
      mainScrollableElement = getDefaultScrollingElement();
      mainContentElement = MH.getBody();
      if (!contentElement) {
        logError(MH.usageError(`No match for '${mainScrollableElementSelector}'. ` + "Scroll tracking/capturing may not work as intended."));
      } else if (!MH.isHTMLElement(contentElement)) {
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
if (MH.hasDOM()) {
  waitForInteractive().then(init);
}
//# sourceMappingURL=scroll.js.map