function _asyncIterator(r) { var n, t, o, e = 2; for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) { if (t && null != (n = r[t])) return n.call(r); if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r)); t = "@@asyncIterator", o = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(r) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var n = r.done; return Promise.resolve(r.value).then(function (r) { return { value: r, done: n }; }); } return AsyncFromSyncIterator = function (r) { this.s = r, this.n = r.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function () { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function (r) { var n = this.s.return; return void 0 === n ? Promise.resolve({ value: r, done: !0 }) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); }, throw: function (r) { var n = this.s.return; return void 0 === n ? Promise.reject(r) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(r); }
/**
 * @module Utils
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { settings } from "../globals/settings.js";
import { newAnimationFrameIterator } from "./animations.js";
import { getComputedStylePropNow } from "./css-alter.js";
import { SCROLL_DIRECTIONS } from "./directions.js";
import { waitForInteractive, waitForElementOrInteractive } from "./dom-events.js";
import { waitForMeasureTime } from "./dom-optimize.js";
import { addEventListenerTo, removeEventListenerFrom } from "./event.js";
import { logError, logWarn } from "./log.js";
import { maxAbs, criticallyDamped } from "./math.js";
import { randId, formatAsString } from "./text.js";
import { isValidStrList } from "./validation.js";
import { newXMap } from "../modules/x-map.js";
import debug from "../debug/debug.js";

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
export const isScrollable = (element, options) => {
  const {
    axis,
    active,
    noCache
  } = options !== null && options !== void 0 ? options : {};
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
    const isDocScrollable = element === MH.getDocScrollingElement();
    const hasOverflow = element[`scroll${dimension}`] > element[`client${dimension}`];
    const overflowProp = getComputedStylePropNow(element, "overflow");
    const scrollingOverflows = [MC.S_SCROLL, MC.S_AUTO, ...(isDocScrollable ? [MC.S_VISIBLE] : [])];
    result = hasOverflow && MH.includes(scrollingOverflows, overflowProp);
  }
  if (!noCache) {
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
 * @param options See {@link isScrollable}
 *
 * @returns `null` if no scrollable ancestors are found.
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
  const info = currentScrollInfos.get(scrollable);
  if (info) {
    return MH.copyObject(info._action);
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
 * @param to If this is an element, then its top-left position is used as
 *           the target coordinates. If it is a string, then it is treated
 *           as a selector for an element using `querySelector`.
 *
 * @returns `null` if there's an ongoing scroll that is not cancellable,
 * otherwise a {@link ScrollAction}.
 *
 * @category Scrolling
 */
export const scrollTo = (to, userOptions) => {
  const options = getOptions(to, userOptions);
  const scrollable = options._scrollable;

  // cancel current scroll action if any
  const info = currentScrollInfos.get(scrollable);
  if (info) {
    if (!info._action.cancel()) {
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
  const thisInfo = {
    _action: {
      waitFor: () => scrollActionPromise,
      cancel: cancelFn
    }
  };
  const cleanup = () => {
    var _currentScrollInfos$g;
    if (((_currentScrollInfos$g = currentScrollInfos.get(scrollable)) === null || _currentScrollInfos$g === void 0 ? void 0 : _currentScrollInfos$g._action) === thisInfo._action) {
      MH.deleteKey(currentScrollInfos, scrollable);
    }
    if (preventScrollHandler) {
      for (const eventType of scrollEvents) {
        removeEventListenerFrom(scrollable, eventType, preventScrollHandler, {
          passive: false
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
  var _MH$getDocScrollingEl;
  const body = MH.getBody();
  return isScrollable(body) ? body : (_MH$getDocScrollingEl = MH.getDocScrollingElement()) !== null && _MH$getDocScrollingEl !== void 0 ? _MH$getDocScrollingEl : body;
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
const currentScrollInfos = MH.newMap();
const DIFF_THRESHOLD = 5;
const arePositionsDifferent = (start, end, threshold = DIFF_THRESHOLD) => maxAbs(start.top - end.top, start.left - end.left) > threshold;

// must be called in "measure time"
const getBorderWidth = (element, side) => MH.ceil(MH.parseFloat(getComputedStylePropNow(element, `border-${side}`)));
const isScrollableBodyInQuirks = element => element === MH.getBody() && MH.getDocScrollingElement() === null;
const toScrollableOrMain = (target, getMain) => {
  if (MH.isElement(target)) {
    var _mappedScrollables$ge;
    return (_mappedScrollables$ge = mappedScrollables.get(target)) !== null && _mappedScrollables$ge !== void 0 ? _mappedScrollables$ge : target;
  }
  if (!target || target === MH.getWindow() || target === MH.getDoc()) {
    return getMain();
  }
  throw MH.usageError("Unsupported scroll target");
};
const toScrollableOrDefault = scrollable => scrollable !== null && scrollable !== void 0 ? scrollable : getDefaultScrollingElement();
const getOptions = (to, options) => {
  var _options$offset, _options$altOffset, _options$duration, _options$weCanInterru, _options$userCanInter;
  const scrollable = toScrollableOrDefault(options === null || options === void 0 ? void 0 : options.scrollable);
  const target = getTargetCoordinates(scrollable, to);
  const altTarget = options !== null && options !== void 0 && options.altTarget ? getTargetCoordinates(scrollable, options === null || options === void 0 ? void 0 : options.altTarget) : null;
  return {
    _target: target,
    _offset: (_options$offset = options === null || options === void 0 ? void 0 : options.offset) !== null && _options$offset !== void 0 ? _options$offset : null,
    _altTarget: altTarget,
    _altOffset: (_options$altOffset = options === null || options === void 0 ? void 0 : options.altOffset) !== null && _options$altOffset !== void 0 ? _options$altOffset : null,
    _scrollable: scrollable,
    _duration: (_options$duration = options === null || options === void 0 ? void 0 : options.duration) !== null && _options$duration !== void 0 ? _options$duration : 0,
    _weCanInterrupt: (_options$weCanInterru = options === null || options === void 0 ? void 0 : options.weCanInterrupt) !== null && _options$weCanInterru !== void 0 ? _options$weCanInterru : false,
    _userCanInterrupt: (_options$userCanInter = options === null || options === void 0 ? void 0 : options.userCanInterrupt) !== null && _options$userCanInter !== void 0 ? _options$userCanInter : false
  };
};
const updateCurrentScrollInfo = (scrollable, newInfo) => {
  var _newInfo$_action;
  const existingScrollInfo = currentScrollInfos.get(scrollable);
  const _action = (_newInfo$_action = newInfo._action) !== null && _newInfo$_action !== void 0 ? _newInfo$_action : existingScrollInfo === null || existingScrollInfo === void 0 ? void 0 : existingScrollInfo._action;
  if (_action) {
    currentScrollInfos.set(scrollable, MH.merge(existingScrollInfo, newInfo, {
      _action
    }));
  }
};
const getTargetCoordinates = (scrollable, target) => {
  const isDocScrollingElement = scrollable === MH.getDocScrollingElement();
  if (MH.isElement(target)) {
    if (scrollable === target || !scrollable.contains(target)) {
      throw MH.usageError("Target must be a descendant of the scrollable one");
    }
    return {
      top: () => MH.getBoundingClientRect(target).top - MH.getBoundingClientRect(scrollable).top + (isDocScrollingElement ? 0 : scrollable[MC.S_SCROLL_TOP]),
      left: () => MH.getBoundingClientRect(target).left - MH.getBoundingClientRect(scrollable).left + (isDocScrollingElement ? 0 : scrollable[MC.S_SCROLL_LEFT])
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
    var _offset$top, _offset$left;
    position.top += (_offset$top = offset === null || offset === void 0 ? void 0 : offset.top) !== null && _offset$top !== void 0 ? _offset$top : 0;
    position.left += (_offset$left = offset === null || offset === void 0 ? void 0 : offset.left) !== null && _offset$left !== void 0 ? _offset$left : 0;
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
    _start: start,
    _end: end
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
  var _existingScrollInfo$_, _existingScrollInfo$_2;
  const position = await getStartEndPosition(options);
  const duration = options._duration;
  const scrollable = options._scrollable;
  const existingScrollInfo = currentScrollInfos.get(scrollable);
  const currentPosition = (_existingScrollInfo$_ = existingScrollInfo === null || existingScrollInfo === void 0 ? void 0 : existingScrollInfo._position) !== null && _existingScrollInfo$_ !== void 0 ? _existingScrollInfo$_ : position._start;
  const currentVelocity = (_existingScrollInfo$_2 = existingScrollInfo === null || existingScrollInfo === void 0 ? void 0 : existingScrollInfo._velocity) !== null && _existingScrollInfo$_2 !== void 0 ? _existingScrollInfo$_2 : {
    [MC.S_TOP]: 0,
    [MC.S_LEFT]: 0
  };
  let elapsed = existingScrollInfo === null || existingScrollInfo === void 0 ? void 0 : existingScrollInfo._elapsed;
  const logger = debug ? new debug.Logger({
    name: `scroll-${formatAsString(scrollable)}-${randId()}`,
    logAtCreation: {
      options,
      position,
      elapsed,
      currentPosition: MH.copyObject(currentPosition),
      currentVelocity: MH.copyObject(currentVelocity)
    }
  }) : null;
  var _iteratorAbruptCompletion = false;
  var _didIteratorError = false;
  var _iteratorError;
  try {
    for (var _iterator = _asyncIterator(newAnimationFrameIterator(elapsed)), _step; _iteratorAbruptCompletion = !(_step = await _iterator.next()).done; _iteratorAbruptCompletion = false) {
      elapsed = _step.value;
      {
        const deltaTime = elapsed.sinceLast;
        if (deltaTime === 0) {
          // First time
          continue;
        }

        // Element.scrollTo equates to a measurement and needs to run after
        // painting to avoid forced layout.
        await waitForMeasureTime();
        if (isCancelled()) {
          // Reject the promise
          logger === null || logger === void 0 || logger.debug8("Cancelled");
          throw currentPosition;
        }
        for (const s of [MC.S_LEFT, MC.S_TOP]) {
          const {
            l,
            v
          } = criticallyDamped({
            l: currentPosition[s],
            v: currentVelocity[s],
            lTarget: position._end[s],
            dt: deltaTime,
            lag: duration
          });
          currentPosition[s] = l;
          currentVelocity[s] = v;
        }
        updateCurrentScrollInfo(scrollable, {
          _position: currentPosition,
          _velocity: currentVelocity,
          _elapsed: elapsed
        });
        const isDone = !arePositionsDifferent(currentPosition, position._end, 0.5);
        if (isDone) {
          MH.assign(currentPosition, position._end); // use exact final coordinates
        }
        MH.elScrollTo(scrollable, currentPosition);
        if (isDone) {
          logger === null || logger === void 0 || logger.debug8("Done");
          break;
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (_iteratorAbruptCompletion && _iterator.return != null) {
        await _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
  return currentPosition;
};

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