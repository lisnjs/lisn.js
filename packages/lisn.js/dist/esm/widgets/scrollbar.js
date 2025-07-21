function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Widgets
 */

// [TODO v2]: Instead of wrapping children and changing which element is the
// actual scrollable (and having to mapScrollable, etc), use the provided
// element as the scrolling one but wrap IT (not its children) and insert the
// scrollbars before it. Then remove, "id" and "className" config options.

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { settings } from "../globals/settings.js";
import { supportsSticky, isMobile, isInQuirksMode } from "../utils/browser.js";
import { showElement, hideElement, displayElement, undisplayElement, hasClass, addClasses, addClassesNow, removeClasses, removeClassesNow, getData, setData, setBooleanData, setBooleanDataNow, setDataNow, delData, delDataNow, getComputedStyleProp, getComputedStylePropNow, setStyleProp, setNumericStyleJsVars } from "../utils/css-alter.js";
import { moveElementNow, moveElement, isAllowedToWrap, getContentWrapper, wrapChildren, unwrapContentNow, getOrAssignID } from "../utils/dom-alter.js";
import { waitForMeasureTime, waitForMutateTime } from "../utils/dom-optimize.js";
import { addEventListenerTo, removeEventListenerFrom, preventSelect } from "../utils/event.js";
import { logError, logWarn } from "../utils/log.js";
import { toArrayIfSingle } from "../utils/misc.js";
import { isScrollable, getDefaultScrollingElement, getClientWidthNow, getClientHeightNow, mapScrollable, unmapScrollable, tryGetMainScrollableElement } from "../utils/scroll.js";
import { formatAsString } from "../utils/text.js";
import { validateStrList, validateNumber, validateBoolean, validateString } from "../utils/validation.js";
import { ScrollWatcher } from "../watchers/scroll-watcher.js";
import { SizeWatcher } from "../watchers/size-watcher.js";
import { Widget, registerWidget } from "./widget.js";
import debug from "../debug/debug.js";

/**
 * Configures the given element, which must be scrollable, to use a
 * {@link Scrollbar}.
 *
 * The Scrollbar widget is a customizable alternative to the native
 * scrollbars (vertical and horizontal). You can position each of the two
 * scrollbars on any of the four sides of the element, make them automatically
 * hide after certain time of inactivity, style them as a traditional handle
 * scrollbar or a percentage fill progress bar and so on.
 *
 * It is also itself draggable/clickable so it _can_ be used to scroll the
 * element similar to the native scrollbar. The drag/click functionality can be
 * disabled too.
 *
 * **NOTE:** If you have disabled the {@link Widgets.PageLoader | PageLoader}
 * and have left {@link ScrollbarConfig.hideNative} ON, but are seeing the
 * native scrollbars just for a fraction of a second at the beginning of the
 * page load, you may want to manually add `lisn-hide-scroll` class on the
 * scrollable element to make sure the scrollbars are hidden as soon as
 * possible (before the scrollbar widget has time to initialize.
 *
 * **IMPORTANT:** If you are using the Scrollbar on an element other than the
 * main scrollable element, it's highly recommended to
 * {@link settings.contentWrappingAllowed | enable content wrapping} (it is
 * enabled by default). Otherwise, Scrollbar will rely on position: sticky. If
 * you want to instead manually create the wrappers yourself, ensure your
 * structure is as follows:
 * ```html
 * <div class="scrollable"><!-- Element you instantiate as Scrollbar -->
 *   <div class="lisn-scrollbar__content"><!-- Optional wrapper to avoid relying on sticky -->
 *     <div class="lisn-wrapper"><!-- Optional wrapper to enable efficient scroll tracking -->
 *       <!-- YOUR CONTENT -->
 *     </div>
 *   </div>
 * </div>
 * ```
 *
 * **IMPORTANT:** You should not instantiate more than one {@link Scrollbar}
 * widget on a given element. Use {@link Scrollbar.get} to get an existing
 * instance if any. If there is already a widget instance, it will be destroyed!
 *
 * -----
 *
 * You can use the following dynamic attributes or CSS properties in your
 * stylesheet:
 *
 * The following dynamic attributes are set on the element:
 * - `data-lisn-has-scrollbar-top`: `"true"` or `"false"`
 * - `data-lisn-has-scrollbar-bottom`: `"true"` or `"false"`
 * - `data-lisn-has-scrollbar-left`: `"true"` or `"false"`
 * - `data-lisn-has-scrollbar-right`: `"true"` or `"false"`
 *
 * The following dynamic attributes are set on each progressbar element:
 * - `data-lisn-orientation`: `"horizontal"` or `"vertical"`
 * - `data-lisn-place`: `"top"`, `"bottom"`, `"left"` or `"right"`
 * - `data-lisn-draggable`: `"true"` or `"false"`
 * - `data-lisn-clickable`: `"true"` or `"false"`
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see {@link settings.autoWidgets}), the
 * following CSS classes or data attributes are recognized:
 * - `lisn-scrollbar` class or `data-lisn-scrollbar` attribute set on the
 *   scrollable element that you want to enable custom scrollbars for
 *
 * See below examples for what values you can use set for the data attribute
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This will create custom scrollbars for
 * {@link settings.mainScrollableElementSelector | the main scrolling element}.
 *
 * This will work even if {@link settings.autoWidgets}) is false
 *
 * ```html
 * <!-- LISN should be loaded beforehand -->
 * <script>
 *   // You can also just customise global default settings:
 *   // LISN.settings.scrollbarPositionV = "top";
 *   // LISN.settings.scrollbarAutoHide = 3000;
 *   // LISN.settings.scrollbarUseHandle = true;
 *
 *   LISN.widgets.Scrollbar.enableMain({
 *     position: "top",
 *     autoHide: 3000,
 *     useHandle: true
 *   });
 * </script>
 * ```
 *
 * @example
 * This will create custom scrollbars for a custom scrolling element (i.e. one
 * with overflow "auto" or "scroll").
 *
 * ```html
 * <div class="scrolling lisn-scrollbar">
 *   <!-- content here... -->
 * </div>
 * ```
 *
 * @example
 * As above but with custom settings.
 *
 * ```html
 * <div
 *   class="scrolling"
 *   data-lisn-scrollbar="hide-native=false
 *                        | positionH=top
 *                        | positionV=left
 *                        | auto-hide=2000
 *                        | click-scroll=false
 *                        | drag-scroll=false
 *                        | use-handle=false
 *                        ">
 *   <!-- content here... -->
 * </div>
 * ```
 */
export class Scrollbar extends Widget {
  /**
   * If element is omitted, returns the instance created by {@link enableMain}
   * if any.
   */
  static get(scrollable) {
    if (!scrollable) {
      return mainWidget;
    }
    if (scrollable === MH.getDocElement()) {
      scrollable = MH.getBody();
    }
    const instance = super.get(scrollable, DUMMY_ID);
    if (MH.isInstanceOf(instance, Scrollbar)) {
      return instance;
    }
    return null;
  }

  /**
   * Enables scrollbars on the
   * {@link settings.mainScrollableElementSelector | the main scrolling element}.
   *
   * **NOTE:** It returns a Promise to a widget because it will wait for the
   * main scrollable element to be present in the DOM if not already.
   */
  static async enableMain(config) {
    // [TODO v2]: enableMain should be synchronous and the constructor should
    // wait for the scrollable, allowing users who want to use the main
    // scrollable to just pass null/undefined/window. Then getScrollable should
    // return null or the actual scrollable if available + add fetchScrollable
    // to return a Promise.
    const scrollable = await ScrollWatcher.fetchMainScrollableElement();
    const widget = new Scrollbar(scrollable, config);
    widget.onDestroy(() => {
      if (mainWidget === widget) {
        mainWidget = null;
      }
    });
    mainWidget = widget;
    return widget;
  }
  static register() {
    registerWidget(WIDGET_NAME, (element, config) => {
      if (MH.isHTMLElement(element)) {
        if (!Scrollbar.get(element)) {
          return new Scrollbar(element, config);
        }
      } else {
        logError(MH.usageError("Only HTMLElement is supported for Scrollbar widget"));
      }
      return null;
    }, configValidator);
  }

  /**
   * Note that passing `document.body` is considered equivalent to
   * `document.documentElement`.
   */
  constructor(scrollable, config) {
    var _Scrollbar$get;
    if (scrollable === MH.getDocElement()) {
      scrollable = MH.getBody();
    }
    const destroyPromise = (_Scrollbar$get = Scrollbar.get(scrollable)) === null || _Scrollbar$get === void 0 ? void 0 : _Scrollbar$get.destroy();
    super(scrollable, {
      id: DUMMY_ID
    });
    /**
     * Returns the actual scrollable element us which, unless the scrollable you
     * passed to the constructor is the
     * {@link settings.mainScrollableElementSelector | the main scrolling element}
     * or unless
     * {@link settings.contentWrappingAllowed | you've disabled content wrapping},
     * this will be a new element created by us that is a descendant of the
     * original element you passed.
     */
    _defineProperty(this, "getScrollable", void 0);
    const props = getScrollableProps(scrollable);
    const ourScrollable = props.scrollable;
    (destroyPromise || MH.promiseResolve()).then(async () => {
      if (this.isDestroyed()) {
        return;
      }
      init(this, scrollable, props, config);
    });
    this.getScrollable = () => ourScrollable;
  }
}

/**
 * @interface
 */

// --------------------

const WIDGET_NAME = "scrollbar";
const PREFIXED_NAME = MH.prefixName(WIDGET_NAME);
// Only one Scrollbar widget per element is allowed, but Widget
// requires a non-blank ID.
const DUMMY_ID = PREFIXED_NAME;
const PREFIX_ROOT = `${PREFIXED_NAME}__root`;
const PREFIX_CONTAINER = `${PREFIXED_NAME}__container`;
const PREFIX_CONTENT = `${PREFIXED_NAME}__content`;
const PREFIX_BAR = `${PREFIXED_NAME}__bar`;
const PREFIX_WRAPPER = `${PREFIXED_NAME}__wrapper`;
const PREFIX_FILL = `${PREFIXED_NAME}__fill`;
const PREFIX_SPACER = `${PREFIXED_NAME}__spacer`;
const PREFIX_HANDLE = `${PREFIXED_NAME}__handle`;
const PREFIX_DRAGGABLE = MH.prefixName("draggable");
const PREFIX_CLICKABLE = MH.prefixName("clickable");
const PREFIX_HAS_WRAPPER = MH.prefixName("has-wrapper");
const PREFIX_ALLOW_COLLAPSE = MH.prefixName("allow-collapse");
const PREFIX_HAS_V_SCROLL = MH.prefixName("has-v-scroll");
const PREFIX_HAS_SCROLLBAR = MH.prefixName("has-scrollbar");
const PREFIX_HIDE_SCROLL = MH.prefixName("hide-scroll");
const S_SET_POINTER_CAPTURE = "setPointerCapture";
const S_RELEASE_POINTER_CAPTURE = "releasePointerCapture";
const S_ARIA_VALUENOW = MC.ARIA_PREFIX + "valuenow";
const S_SCROLLBAR = "scrollbar";
let mainWidget = null;
const configValidator = {
  id: validateString,
  className: validateStrList,
  hideNative: validateBoolean,
  onMobile: validateBoolean,
  positionH: validateString,
  positionV: validateString,
  autoHide: validateNumber,
  clickScroll: validateBoolean,
  dragScroll: validateBoolean,
  useHandle: validateBoolean
};
const getScrollableProps = containerElement => {
  // If main scrollable element doesn't exist yet, then the containerElement
  // passed can't be it anyway, so no need to use fetchMainScrollableElement.
  const mainScrollableElement = tryGetMainScrollableElement();
  const body = MH.getBody();
  const defaultScrollable = getDefaultScrollingElement();
  const isBody = containerElement === body;
  const isMainScrollable = (isBody ? defaultScrollable : containerElement) === mainScrollableElement;
  const root = isMainScrollable ? mainScrollableElement : isBody ? defaultScrollable : containerElement;

  // check if we're using body in quirks mode
  const isBodyInQuirks = isBody && isInQuirksMode();
  const allowedToWrap = isAllowedToWrap(containerElement);
  const barParent = isMainScrollable ? body : containerElement;
  const hasVScroll = isScrollable(root, {
    axis: "y"
  });
  let contentWrapper = null;
  let supported = true;
  let hasExistingWrapper = true;
  if (!isMainScrollable && !isBody) {
    // we need to wrap if possible
    contentWrapper = getContentWrapper(containerElement, {
      _classNames: [PREFIX_CONTENT]
    });
    hasExistingWrapper = !MH.isNullish(contentWrapper);
    if (!contentWrapper) {
      const warnMsgPrefix = "Scrollbar on elements other than " + "the main scrollable when content wrapping is " + "disabled relies on position: sticky";
      if (allowedToWrap) {
        // we'll wrap later, but create the wrapper now as it will be the actual
        // scrollable
        contentWrapper = MH.createElement("div");
      } else if (supportsSticky()) {
        logWarn(`${warnMsgPrefix}, is experimental and may not work properly.`);
      } else {
        logError(`${warnMsgPrefix}, but this browser does not support sticky.`);
        supported = false;
      }
    }
  }
  const needsSticky = !isMainScrollable && !allowedToWrap && !hasExistingWrapper;
  return {
    supported,
    isMainScrollable,
    isBody,
    isBodyInQuirks,
    root,
    scrollable: contentWrapper !== null && contentWrapper !== void 0 ? contentWrapper : root,
    barParent,
    contentWrapper,
    hasExistingWrapper,
    needsSticky,
    hasVScroll
  };
};
const init = (widget, containerElement, props, config) => {
  var _ref, _config$onMobile, _ref2, _config$hideNative, _config$autoHide, _config$clickScroll, _ref3, _config$dragScroll, _ref4, _config$useHandle;
  const {
    supported,
    isMainScrollable,
    isBody,
    isBodyInQuirks,
    root,
    scrollable,
    barParent,
    contentWrapper,
    hasExistingWrapper,
    needsSticky,
    hasVScroll
  } = props;
  const logger = debug ? new debug.Logger({
    name: `Scrollbar-${formatAsString(root)}`,
    logAtCreation: {
      props,
      config
    }
  }) : null;

  // config
  const onMobile = (_ref = (_config$onMobile = config === null || config === void 0 ? void 0 : config.onMobile) !== null && _config$onMobile !== void 0 ? _config$onMobile : settings.scrollbarOnMobile) !== null && _ref !== void 0 ? _ref : false;
  const hideNative = (_ref2 = (_config$hideNative = config === null || config === void 0 ? void 0 : config.hideNative) !== null && _config$hideNative !== void 0 ? _config$hideNative : settings.scrollbarHideNative) !== null && _ref2 !== void 0 ? _ref2 : false;
  const positionH = (config === null || config === void 0 ? void 0 : config.positionH) || settings.scrollbarPositionH;
  const positionV = (config === null || config === void 0 ? void 0 : config.positionV) || settings.scrollbarPositionV;
  const autoHideDelay = (_config$autoHide = config === null || config === void 0 ? void 0 : config.autoHide) !== null && _config$autoHide !== void 0 ? _config$autoHide : settings.scrollbarAutoHide;
  const clickScroll = (_config$clickScroll = config === null || config === void 0 ? void 0 : config.clickScroll) !== null && _config$clickScroll !== void 0 ? _config$clickScroll : settings.scrollbarClickScroll;
  const dragScroll = (_ref3 = (_config$dragScroll = config === null || config === void 0 ? void 0 : config.dragScroll) !== null && _config$dragScroll !== void 0 ? _config$dragScroll : settings.scrollbarDragScroll) !== null && _ref3 !== void 0 ? _ref3 : false;
  const useHandle = (_ref4 = (_config$useHandle = config === null || config === void 0 ? void 0 : config.useHandle) !== null && _config$useHandle !== void 0 ? _config$useHandle : settings.scrollbarUseHandle) !== null && _ref4 !== void 0 ? _ref4 : false;
  if (isMobile() && !onMobile) {
    return;
  }

  // Ensure scroll tracking that will be setup on the original element uses the
  // new scrollable we create.
  // XXX TODO But this still breaks any existing scroll tracking
  mapScrollable(root, scrollable);

  // ----------

  const newScrollbar = (wrapper, position) => {
    const barIsHorizontal = position === MC.S_TOP || position === MC.S_BOTTOM;
    const scrollbar = MH.createElement("div");
    addClassesNow(scrollbar, PREFIX_BAR);
    setDataNow(scrollbar, MC.PREFIX_ORIENTATION, barIsHorizontal ? MC.S_HORIZONTAL : MC.S_VERTICAL);
    setDataNow(scrollbar, MC.PREFIX_PLACE, position);
    if (clickScroll || dragScroll) {
      MH.setAttr(scrollbar, MC.S_ROLE, S_SCROLLBAR);
      MH.setAttr(scrollbar, MC.S_ARIA_CONTROLS, scrollDomID);
    }
    const fill = MH.createElement("div");
    addClassesNow(fill, useHandle ? PREFIX_SPACER : PREFIX_FILL);
    let handle = null;
    if (useHandle) {
      handle = MH.createElement("div");
      addClassesNow(handle, PREFIX_HANDLE);
      setBooleanDataNow(handle, PREFIX_DRAGGABLE, dragScroll);
    }
    setBooleanDataNow(scrollbar, PREFIX_DRAGGABLE, dragScroll && !useHandle);
    setBooleanDataNow(scrollbar, PREFIX_CLICKABLE, clickScroll);
    moveElementNow(fill, {
      to: scrollbar
    });
    if (handle) {
      moveElementNow(handle, {
        to: scrollbar
      });
    }
    moveElementNow(scrollbar, {
      to: wrapper
    });
    return {
      _bar: scrollbar,
      _handle: handle,
      _fill: fill
    };
  };

  // ----------

  const setProgress = async (scrollData, tracksH) => {
    const scrollbar = tracksH ? scrollbarH : scrollbarV;
    const hasBarPrefix = `${PREFIX_HAS_SCROLLBAR}-${tracksH ? positionH : positionV}`;
    const completeFraction = tracksH ? scrollData[MC.S_SCROLL_LEFT_FRACTION] : scrollData[MC.S_SCROLL_TOP_FRACTION];
    const viewFraction = tracksH ? scrollData[MC.S_CLIENT_WIDTH] / scrollData[MC.S_SCROLL_WIDTH] : scrollData[MC.S_CLIENT_HEIGHT] / scrollData[MC.S_SCROLL_HEIGHT];
    debug: logger === null || logger === void 0 || logger.debug9("Updating progress", {
      tracksH,
      completeFraction,
      viewFraction
    });
    MH.setAttr(scrollbar, S_ARIA_VALUENOW, MH.round(completeFraction * 100) + "");
    setNumericStyleJsVars(scrollbar, {
      viewFr: viewFraction,
      completeFr: completeFraction
    }, {
      _numDecimal: 4
    });
    const scrollAxis = tracksH ? "x" : "y";
    if (isScrollable(scrollable, {
      axis: scrollAxis
    }) && viewFraction < 1) {
      setBooleanData(containerElement, hasBarPrefix);
      displayElement(scrollbar);
    } else {
      delData(containerElement, hasBarPrefix);
      undisplayElement(scrollbar);
    }
  };

  // ----------

  const updateProgress = (target, scrollData) => {
    setProgress(scrollData, true);
    setProgress(scrollData, false);
    if (!isMainScrollable && !isBody) {
      setBoxMeasureProps(containerElement);
    }
    if (autoHideDelay > 0) {
      showElement(wrapper).then(() => hideElement(wrapper, autoHideDelay));
    }
  };
  const updatePropsOnResize = (target, sizeData) => {
    setBoxMeasureProps(containerElement);
    setNumericStyleJsVars(containerElement, {
      barHeight: sizeData.border[MC.S_HEIGHT]
    }, {
      _units: "px",
      _numDecimal: 2
    });
  };

  // ----------

  let isDragging = false;
  let lastOffset = 0;
  let lastTargetFraction = 0;
  let scrollAction;
  const onClickOrDrag = async (event, tracksH) => {
    MH.preventDefault(event);
    const scrollbar = tracksH ? scrollbarH : scrollbarV;
    const handle = tracksH ? handleH : handleV;
    const target = MH.targetOf(event);
    if (!MH.isMouseEvent(event) || !MH.isHTMLElement(target)) {
      return;
    }
    const eventType = event.type;
    const isClick = eventType === MC.S_POINTERDOWN || eventType === MC.S_MOUSEDOWN;
    const isHandleClick = isClick && useHandle && hasClass(target, PREFIX_HANDLE);
    const startsDrag = isClick && dragScroll && (isHandleClick || !useHandle);
    if (startsDrag) {
      isDragging = true;
      setOrReleasePointerCapture(event, scrollbar, S_SET_POINTER_CAPTURE);
    }
    debug: logger === null || logger === void 0 || logger.debug10("Click or drag", {
      eventType,
      isClick,
      isHandleClick,
      isDragging,
      startsDrag
    });
    if (!isClick && !isDragging || isClick && !startsDrag && !clickScroll) {
      // - Either moving pointer when no drag scroll has been started OR
      // - Clicking when no drag is allowed in the context of the click and no
      //   click scroll is allowed either
      return;
    }
    await waitForMeasureTime();
    const barIsHorizontal = isHorizontal(scrollbar);
    const barLength = barIsHorizontal ? scrollbar[MC.S_CLIENT_WIDTH] : scrollbar[MC.S_CLIENT_HEIGHT];
    const currScrollOffset = tracksH ? scrollable[MC.S_SCROLL_LEFT] : scrollable[MC.S_SCROLL_TOP];
    const maxScrollOffset = tracksH ? scrollable[MC.S_SCROLL_WIDTH] - getClientWidthNow(scrollable) : scrollable[MC.S_SCROLL_HEIGHT] - getClientHeightNow(scrollable);

    // Get click offset relative to the scrollbar regardless of what the
    // event target is and what transforms is has applied.
    const rect = MH.getBoundingClientRect(scrollbar);
    const offset = barIsHorizontal ? event.clientX - rect.left : event.clientY - rect.top;
    debug: logger === null || logger === void 0 || logger.debug10("Pointer offset", offset);
    if (offset === lastOffset) {
      return;
    }
    const deltaOffset = isClick ? offset : offset - lastOffset;
    lastOffset = offset;
    if (!isClick && useHandle) {
      // Dragging the handle
      const handleLength = handle ? MH.parseFloat(getComputedStylePropNow(handle, barIsHorizontal ? MC.S_WIDTH : MC.S_HEIGHT)) : 0;
      lastTargetFraction = lastTargetFraction + deltaOffset / (barLength - (handleLength || 0));
    } else if (isHandleClick) {
      // Starting a handle drag
      lastTargetFraction = currScrollOffset / maxScrollOffset;
    } else {
      // Clicking or dragging on the bar -> scroll to the offset under the pointer
      lastTargetFraction = offset / barLength;
    }
    if (isHandleClick || isClick && !clickScroll) {
      return;
    }
    const targetScrollOffset = lastTargetFraction * maxScrollOffset;
    const targetCoordinates = tracksH ? {
      left: targetScrollOffset
    } : {
      top: targetScrollOffset
    };
    debug: logger === null || logger === void 0 || logger.debug10("Scroll target offset", {
      lastTargetFraction,
      targetCoordinates
    });
    if (isClick) {
      // smooth scroll
      scrollAction = await scrollWatcher.scrollTo(targetCoordinates, {
        scrollable,
        weCanInterrupt: true
      });
    } else {
      var _scrollAction;
      (_scrollAction = scrollAction) === null || _scrollAction === void 0 || _scrollAction.cancel();
      scrollAction = null;
      MH.elScrollTo(scrollable, targetCoordinates);
    }
  };

  // ----------

  const onRelease = (event, tracksH) => {
    const scrollbar = tracksH ? scrollbarH : scrollbarV;
    setOrReleasePointerCapture(event, scrollbar, S_RELEASE_POINTER_CAPTURE);
    isDragging = false;
    scrollAction = null;
  };
  const onClickOrDragH = event => onClickOrDrag(event, true);
  const onClickOrDragV = event => onClickOrDrag(event, false);
  const onReleaseH = event => onRelease(event, true);
  const onReleaseV = event => onRelease(event, false);

  // ----------

  const maybeSetNativeHidden = () => {
    if (hideNative) {
      addClasses(scrollable, PREFIX_HIDE_SCROLL);
      if (isBodyInQuirks) {
        addClasses(MH.getDocElement(), PREFIX_HIDE_SCROLL);
      }
    }
  };
  const setNativeShown = () => {
    removeClasses(scrollable, PREFIX_HIDE_SCROLL);
    if (isBodyInQuirks) {
      removeClasses(MH.getDocElement(), PREFIX_HIDE_SCROLL);
    }
  };

  // ----------

  const addWatchers = () => {
    // Track scroll in any direction as well as changes in border or content size
    // of the element and its contents.
    scrollWatcher.trackScroll(updateProgress, {
      threshold: 0,
      scrollable
    });

    // Track changes in content or border size of the container element which
    // would also detect changes in its padding.
    sizeWatcher.onResize(updatePropsOnResize, {
      target: containerElement,
      threshold: 0
    });
  };
  const removeWatchers = () => {
    scrollWatcher.noTrackScroll(updateProgress, scrollable);
    sizeWatcher.offResize(updatePropsOnResize, containerElement);
  };

  // SETUP ------------------------------

  if (!supported) {
    setNativeShown();
    return;
  }
  const scrollWatcher = ScrollWatcher.reuse({
    [MC.S_DEBOUNCE_WINDOW]: 0
  });
  const sizeWatcher = SizeWatcher.reuse({
    [MC.S_DEBOUNCE_WINDOW]: 0
  });
  if (!isMainScrollable && !isBody) {
    addClasses(containerElement, PREFIX_CONTAINER);
  }
  setBooleanData(containerElement, PREFIX_ALLOW_COLLAPSE, !isMobile());
  setBooleanData(containerElement, PREFIX_HAS_WRAPPER, !!contentWrapper);
  setBooleanData(containerElement, PREFIX_HAS_V_SCROLL, !!contentWrapper && hasVScroll);

  // Wrap children if needed
  if (contentWrapper && !hasExistingWrapper) {
    wrapChildren(containerElement, {
      wrapper: contentWrapper,
      ignoreMove: true
    }); // no need to await here
    addClasses(contentWrapper, PREFIX_CONTENT);
  }
  maybeSetNativeHidden();
  const origDomID = scrollable.id;
  if (config !== null && config !== void 0 && config.id) {
    scrollable.id = config.id;
  }
  if (config !== null && config !== void 0 && config.className) {
    addClasses(scrollable, ...toArrayIfSingle(config.className));
  }
  const scrollDomID =
  // for ARIA
  clickScroll || dragScroll ? getOrAssignID(scrollable, S_SCROLLBAR) : "";
  addClasses(barParent, PREFIX_ROOT);
  const wrapper = MH.createElement("div");
  preventSelect(wrapper);
  addClasses(wrapper, MC.PREFIX_NO_TOUCH_ACTION);
  addClasses(wrapper, PREFIX_WRAPPER);
  if (isBody || isMainScrollable) {
    setData(wrapper, MC.PREFIX_POSITION, MC.S_FIXED);
  } else if (needsSticky) {
    setData(wrapper, MC.PREFIX_POSITION, MC.S_STICKY);
  }
  const {
    _bar: scrollbarH,
    _handle: handleH
  } = newScrollbar(wrapper, positionH);
  const {
    _bar: scrollbarV,
    _handle: handleV
  } = newScrollbar(wrapper, positionV);
  moveElement(wrapper, {
    to: barParent,
    position: "prepend"
  });
  addWatchers();

  // Track clicking and dragging on the two scrollbars
  if (dragScroll) {
    addEventListenerTo(scrollbarH, MC.S_POINTERMOVE, onClickOrDragH);
    addEventListenerTo(scrollbarV, MC.S_POINTERMOVE, onClickOrDragV);
    addEventListenerTo(scrollbarH, MC.S_POINTERUP, onReleaseH);
    addEventListenerTo(scrollbarV, MC.S_POINTERUP, onReleaseV);
  }
  if (dragScroll || clickScroll) {
    addEventListenerTo(scrollbarH, MC.S_POINTERDOWN, onClickOrDragH);
    addEventListenerTo(scrollbarV, MC.S_POINTERDOWN, onClickOrDragV);
  }
  widget.onDisable(() => {
    removeWatchers();
    undisplayElement(scrollbarH);
    undisplayElement(scrollbarV);
    setNativeShown();
  });
  widget.onEnable(() => {
    addWatchers();
    displayElement(scrollbarH);
    displayElement(scrollbarV);
    maybeSetNativeHidden();
  });
  widget.onDestroy(async () => {
    unmapScrollable(root);
    scrollable.id = origDomID;
    if (config !== null && config !== void 0 && config.className) {
      removeClasses(scrollable, ...toArrayIfSingle(config.className));
    }
    await waitForMutateTime();
    if (contentWrapper && !hasExistingWrapper) {
      unwrapContentNow(contentWrapper, [PREFIX_CONTENT]);
    }
    moveElementNow(wrapper); // remove

    if (dragScroll) {
      removeEventListenerFrom(scrollbarH, MC.S_POINTERMOVE, onClickOrDragH);
      removeEventListenerFrom(scrollbarV, MC.S_POINTERMOVE, onClickOrDragV);
      removeEventListenerFrom(scrollbarH, MC.S_POINTERUP, onReleaseH);
      removeEventListenerFrom(scrollbarV, MC.S_POINTERUP, onReleaseV);
    }
    if (dragScroll || clickScroll) {
      removeEventListenerFrom(scrollbarH, MC.S_POINTERDOWN, onClickOrDragH);
      removeEventListenerFrom(scrollbarV, MC.S_POINTERDOWN, onClickOrDragV);
    }
    removeClassesNow(barParent, PREFIX_ROOT);
    removeClassesNow(containerElement, PREFIX_CONTAINER);
    for (const position of [MC.S_TOP, MC.S_BOTTOM, MC.S_LEFT, MC.S_RIGHT]) {
      delDataNow(containerElement, `${PREFIX_HAS_SCROLLBAR}-${position}`);
    }
    delDataNow(containerElement, PREFIX_ALLOW_COLLAPSE);
    delDataNow(containerElement, PREFIX_HAS_WRAPPER);
    delDataNow(containerElement, PREFIX_HAS_V_SCROLL);
  });
};
const isHorizontal = scrollbar => getData(scrollbar, MC.PREFIX_ORIENTATION) === MC.S_HORIZONTAL;
const setBoxMeasureProps = async element => {
  for (const side of [MC.S_TOP, MC.S_RIGHT, MC.S_BOTTOM, MC.S_LEFT]) {
    for (const key of [`padding-${side}`, `border-${side}-width`]) {
      const padding = await getComputedStyleProp(element, key);
      setStyleProp(element, MH.prefixCssJsVar(key), padding);
    }
  }
};
const setOrReleasePointerCapture = (event, scrollbar, method) => {
  if (MH.isPointerEvent(event) && method in scrollbar) {
    scrollbar[method](event.pointerId);
  }
};
//# sourceMappingURL=scrollbar.js.map