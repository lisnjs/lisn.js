/**
 * @module Widgets
 */

// [TODO v2]: Instead of wrapping children and changing which element is the
// actual scrollable (and having to mapScrollable, etc), use the provided
// element as the scrolling one but wrap IT (not its children) and insert the
// scrollbars before it. Then remove, "id" and "className" config options.

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { settings } from "@lisn/globals/settings";

import { Position } from "@lisn/globals/types";

import {
  showElement,
  hideElement,
  displayElement,
  undisplayElement,
  hasClass,
  addClasses,
  addClassesNow,
  removeClasses,
  removeClassesNow,
  getData,
  setData,
  setBooleanData,
  setBooleanDataNow,
  setDataNow,
  delData,
  delDataNow,
  getComputedStyleProp,
  getComputedStylePropNow,
  setStyleProp,
  setNumericStyleJsVars,
} from "@lisn/utils/css-alter";
import {
  moveElementNow,
  moveElement,
  moveChildrenNow,
  isAllowedToWrap,
  getContentWrapper,
  wrapChildren,
  getOrAssignID,
} from "@lisn/utils/dom-alter";
import {
  waitForMeasureTime,
  waitForMutateTime,
} from "@lisn/utils/dom-optimize";
import {
  addEventListenerTo,
  removeEventListenerFrom,
  preventSelect,
} from "@lisn/utils/event";
import { logError, logWarn } from "@lisn/utils/log";
import { toArrayIfSingle, supportsSticky } from "@lisn/utils/misc";
import {
  isScrollable,
  getDefaultScrollingElement,
  getClientWidthNow,
  getClientHeightNow,
  mapScrollable,
  unmapScrollable,
  tryGetMainScrollableElement,
  ScrollAction,
} from "@lisn/utils/scroll";
import { formatAsString } from "@lisn/utils/text";
import {
  validateStrList,
  validateNumber,
  validateBoolean,
  validateString,
} from "@lisn/utils/validation";

import { ScrollWatcher, ScrollData } from "@lisn/watchers/scroll-watcher";
import { SizeWatcher, SizeData } from "@lisn/watchers/size-watcher";

import {
  Widget,
  WidgetConfigValidatorObject,
  registerWidget,
} from "@lisn/widgets/widget";

import debug from "@lisn/debug/debug";

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
   * Returns the actual scrollable element us which, unless the scrollable you
   * passed to the constructor is the
   * {@link settings.mainScrollableElementSelector | the main scrolling element}
   * or unless
   * {@link settings.contentWrappingAllowed | you've disabled content wrapping},
   * this will be a new element created by us that is a descendant of the
   * original element you passed.
   */
  readonly getScrollable: () => Element;

  /**
   * If element is omitted, returns the instance created by {@link enableMain}
   * if any.
   */
  static get(scrollable?: Element): Scrollbar | null {
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
  static async enableMain(config?: ScrollbarConfig) {
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
    registerWidget(
      WIDGET_NAME,
      (element, config) => {
        if (MH.isHTMLElement(element)) {
          if (!Scrollbar.get(element)) {
            return new Scrollbar(element, config);
          }
        } else {
          logError(
            MH.usageError("Only HTMLElement is supported for Scrollbar widget"),
          );
        }
        return null;
      },
      configValidator,
    );
  }

  /**
   * Note that passing `document.body` is considered equivalent to
   * `document.documentElement`.
   */
  constructor(scrollable: HTMLElement, config?: ScrollbarConfig) {
    if (scrollable === MH.getDocElement()) {
      scrollable = MH.getBody();
    }

    const destroyPromise = Scrollbar.get(scrollable)?.destroy();
    super(scrollable, { id: DUMMY_ID });

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
export type ScrollbarConfig = {
  /**
   * The DOM ID to set on the
   * {@link Scrollbar.getScrollable | scrollable element}. Will result in the
   * scrollable element getting this ID. This is useful if the scrollable is a
   * wrapper created by us and you want it to be assigned an ID.
   *
   * **IMPORTANT:** If the scrollable is the
   * {@link settings.mainScrollableElementSelector | the main scrolling element}
   * or {@link settings.contentWrappingAllowed | if you've disabled content wrapping},
   * then the scrollable element provided as the widget element will _not_ have
   * its content wrapped and will remain the actual scrollable. In this case,
   * its ID will be set to this, so if it already has an ID, it will be
   * overridden with this value.
   *
   * @defaultValue undefined
   */
  id?: string;

  /**
   * A class name or a list of class names to set on the
   * {@link Scrollbar.getScrollable | scrollable element}. Will result in the
   * scrollable element getting these classes. This is useful if the scrollable
   * is a wrapper created by us and you want it to be assigned classes.
   *
   * See explanation for {@link id}.
   *
   * @defaultValue undefined
   */
  className?: string[] | string;

  /**
   * Hide the native scroll bar.
   *
   * Note that the LISN scrollbar is itself draggable/clickable so it
   * _can_ be used to scroll the element similar to the native scrollbar.
   *
   * @defaultValue {@link settings.scrollbarHideNative}
   */
  hideNative?: boolean;

  /**
   * Whether to enable also on mobile and tablet devices. Detection is based on
   * user agent.
   *
   * @defaultValue {@link settings.scrollbarOnMobile}
   */
  onMobile?: boolean;

  /**
   * Where to place the scrollbar that tracks the horizontal scroll.
   *
   * It does not need to be a horizontal position; it can for example be "left"
   * or "right".
   *
   * @defaultValue {@link settings.scrollbarPositionH}
   */
  positionH?: Position;

  /**
   * Where to place the scrollbar that tracks the vertical scroll.
   *
   * It does not need to be a vertical position; it can for example be "top"
   * or "bottom".
   *
   * @defaultValue {@link settings.scrollbarPositionV}
   */
  positionV?: Position;

  /**
   * Auto-hide the scrollbar when there's no scrolling happening for the given
   * number of milliseconds.
   *
   * Set to 0 or a negative value to disable hiding.
   *
   * @defaultValue {@link settings.scrollbarAutoHide}
   */
  autoHide?: number;

  /**
   * Whether to scroll the element when a user clicks anywhere on the
   * scrollbar.
   *
   * @defaultValue {@link settings.scrollbarClickScroll}
   */
  clickScroll?: boolean;

  /**
   * Whether to scroll the element when a user drags the handle (if
   * {@link useHandle}) or drags along anywhere on the scrollbar (if _not_
   * {@link useHandle}).
   *
   * @defaultValue {@link settings.scrollbarDragScroll}
   */
  dragScroll?: boolean;

  /**
   * Whether to use a traditional fixed-length handle (like the native
   * scrollbar) to indicate the position or the default style of a fill (that
   * starts at the beginning and ends at the scroll fraction).
   *
   * @defaultValue {@link settings.scrollbarUseHandle}
   */
  useHandle?: boolean;
};

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

let mainWidget: Scrollbar | null = null;

const configValidator: WidgetConfigValidatorObject<ScrollbarConfig> = {
  id: validateString,
  className: validateStrList,
  hideNative: validateBoolean,
  onMobile: validateBoolean,
  positionH: validateString,
  positionV: validateString,
  autoHide: validateNumber,
  clickScroll: validateBoolean,
  dragScroll: validateBoolean,
  useHandle: validateBoolean,
};

const getScrollableProps = (containerElement: HTMLElement) => {
  // If main scrollable element doesn't exist yet, then the containerElement
  // passed can't be it anyway, so no need to use fetchMainScrollableElement.
  const mainScrollableElement = tryGetMainScrollableElement();

  const body = MH.getBody();
  const defaultScrollable = getDefaultScrollingElement();

  const isBody = containerElement === body;
  const isMainScrollable =
    (isBody ? defaultScrollable : containerElement) === mainScrollableElement;

  const root: HTMLElement = isMainScrollable
    ? mainScrollableElement
    : isBody
      ? defaultScrollable
      : containerElement;

  // check if we're using body in quirks mode
  const isBodyInQuirks = root === body && defaultScrollable === body;

  const allowedToWrap = isAllowedToWrap(containerElement);
  const barParent = isMainScrollable ? body : containerElement;
  const hasVScroll = isScrollable(root, { axis: "y" });

  let contentWrapper: HTMLElement | null = null;
  let supported = true;
  let hasExistingWrapper = true;

  if (!isMainScrollable && !isBody) {
    // we need to wrap if possible
    contentWrapper = getContentWrapper(containerElement, {
      classNames: [PREFIX_CONTENT],
    });
    hasExistingWrapper = !MH.isNullish(contentWrapper);

    if (!contentWrapper) {
      const warnMsgPrefix =
        "Scrollbar on elements other than " +
        "the main scrollable when content wrapping is " +
        "disabled relies on position: sticky";

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

  const needsSticky =
    !isMainScrollable && !allowedToWrap && !hasExistingWrapper;

  return {
    supported,
    isMainScrollable,
    isBody,
    isBodyInQuirks,
    root,
    scrollable: contentWrapper ?? root,
    barParent,
    contentWrapper,
    hasExistingWrapper,
    needsSticky,
    hasVScroll,
  };
};

const init = (
  widget: Scrollbar,
  containerElement: HTMLElement,
  props: ReturnType<typeof getScrollableProps>,
  config: ScrollbarConfig | undefined,
) => {
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
    hasVScroll,
  } = props;

  const logger = debug
    ? new debug.Logger({
        name: `Scrollbar-${formatAsString(root)}`,
        logAtCreation: { props, config },
      })
    : null;

  // config
  const onMobile = config?.onMobile ?? settings.scrollbarOnMobile ?? false;
  const hideNative =
    config?.hideNative ?? settings.scrollbarHideNative ?? false;
  const positionH = config?.positionH || settings.scrollbarPositionH;
  const positionV = config?.positionV || settings.scrollbarPositionV;
  const autoHideDelay = config?.autoHide ?? settings.scrollbarAutoHide;
  const clickScroll = config?.clickScroll ?? settings.scrollbarClickScroll;
  const dragScroll =
    config?.dragScroll ?? settings.scrollbarDragScroll ?? false;
  const useHandle = config?.useHandle ?? settings.scrollbarUseHandle ?? false;

  if (MC.IS_MOBILE && !onMobile) {
    return;
  }

  // Ensure scroll tracking that will be setup on the original element uses the
  // new scrollable we create.
  // XXX TODO But this still breaks any existing scroll tracking
  mapScrollable(root, scrollable);

  // ----------

  const newScrollbar = (wrapper: Element, position: string) => {
    const barIsHorizontal = position === MC.S_TOP || position === MC.S_BOTTOM;

    const scrollbar = MH.createElement("div");
    addClassesNow(scrollbar, PREFIX_BAR);
    setDataNow(
      scrollbar,
      MC.PREFIX_ORIENTATION,
      barIsHorizontal ? MC.S_HORIZONTAL : MC.S_VERTICAL,
    );
    setDataNow(scrollbar, MC.PREFIX_PLACE, position);

    if (clickScroll || dragScroll) {
      MH.setAttr(scrollbar, MC.S_ROLE, S_SCROLLBAR);
      MH.setAttr(scrollbar, MC.S_ARIA_CONTROLS, scrollDomID);
    }

    const fill = MH.createElement("div");
    addClassesNow(fill, useHandle ? PREFIX_SPACER : PREFIX_FILL);

    let handle: Element | null = null;
    if (useHandle) {
      handle = MH.createElement("div");
      addClassesNow(handle, PREFIX_HANDLE);
      setBooleanDataNow(handle, PREFIX_DRAGGABLE, dragScroll);
    }

    setBooleanDataNow(scrollbar, PREFIX_DRAGGABLE, dragScroll && !useHandle);
    setBooleanDataNow(scrollbar, PREFIX_CLICKABLE, clickScroll);

    moveElementNow(fill, { to: scrollbar });

    if (handle) {
      moveElementNow(handle, { to: scrollbar });
    }
    moveElementNow(scrollbar, { to: wrapper });

    return {
      _bar: scrollbar,
      _handle: handle,
      _fill: fill,
    };
  };

  // ----------

  const setProgress = async (scrollData: ScrollData, tracksH: boolean) => {
    const scrollbar = tracksH ? scrollbarH : scrollbarV;
    const hasBarPrefix = `${PREFIX_HAS_SCROLLBAR}-${tracksH ? positionH : positionV}`;

    const completeFraction = tracksH
      ? scrollData[MC.S_SCROLL_LEFT_FRACTION]
      : scrollData[MC.S_SCROLL_TOP_FRACTION];

    const viewFraction = tracksH
      ? scrollData[MC.S_CLIENT_WIDTH] / scrollData[MC.S_SCROLL_WIDTH]
      : scrollData[MC.S_CLIENT_HEIGHT] / scrollData[MC.S_SCROLL_HEIGHT];

    logger?.debug9("Updating progress", {
      tracksH,
      completeFraction,
      viewFraction,
    });

    MH.setAttr(
      scrollbar,
      S_ARIA_VALUENOW,
      MH.round(completeFraction * 100) + "",
    );

    setNumericStyleJsVars(
      scrollbar,
      { viewFr: viewFraction, completeFr: completeFraction },
      { _numDecimal: 4 },
    );

    const scrollAxis = tracksH ? "x" : "y";
    if (isScrollable(scrollable, { axis: scrollAxis }) && viewFraction < 1) {
      setBooleanData(containerElement, hasBarPrefix);
      displayElement(scrollbar);
    } else {
      delData(containerElement, hasBarPrefix);
      undisplayElement(scrollbar);
    }
  };

  // ----------

  const updateProgress = (target: Element, scrollData: ScrollData) => {
    setProgress(scrollData, true);
    setProgress(scrollData, false);

    if (!isMainScrollable && !isBody) {
      setBoxMeasureProps(containerElement);
    }

    if (autoHideDelay > 0) {
      showElement(wrapper).then(() => hideElement(wrapper, autoHideDelay));
    }
  };

  const updatePropsOnResize = (target: Element, sizeData: SizeData) => {
    setBoxMeasureProps(containerElement);
    setNumericStyleJsVars(
      containerElement,
      { barHeight: sizeData.border[MC.S_HEIGHT] },
      { _units: "px", _numDecimal: 2 },
    );
  };

  // ----------

  let isDragging = false;
  let lastOffset = 0;
  let lastTargetFraction = 0;
  let scrollAction: ScrollAction | null;

  const onClickOrDrag = async (event: Event, tracksH: boolean) => {
    MH.preventDefault(event);
    const scrollbar = tracksH ? scrollbarH : scrollbarV;
    const handle = tracksH ? handleH : handleV;

    const target = MH.targetOf(event);
    if (!MH.isMouseEvent(event) || !MH.isHTMLElement(target)) {
      return;
    }

    const eventType = event.type;

    const isClick =
      eventType === MC.S_POINTERDOWN || eventType === MC.S_MOUSEDOWN;
    const isHandleClick =
      isClick && useHandle && hasClass(target, PREFIX_HANDLE);
    const startsDrag = isClick && dragScroll && (isHandleClick || !useHandle);

    if (startsDrag) {
      isDragging = true;
      setOrReleasePointerCapture(event, scrollbar, S_SET_POINTER_CAPTURE);
    }

    logger?.debug10("Click or drag", {
      eventType,
      isClick,
      isHandleClick,
      isDragging,
      startsDrag,
    });

    if ((!isClick && !isDragging) || (isClick && !startsDrag && !clickScroll)) {
      // - Either moving pointer when no drag scroll has been started OR
      // - Clicking when no drag is allowed in the context of the click and no
      //   click scroll is allowed either
      return;
    }

    await waitForMeasureTime();
    const barIsHorizontal = isHorizontal(scrollbar);

    const barLength = barIsHorizontal
      ? scrollbar[MC.S_CLIENT_WIDTH]
      : scrollbar[MC.S_CLIENT_HEIGHT];

    const currScrollOffset = tracksH
      ? scrollable[MC.S_SCROLL_LEFT]
      : scrollable[MC.S_SCROLL_TOP];

    const maxScrollOffset = tracksH
      ? scrollable[MC.S_SCROLL_WIDTH] - getClientWidthNow(scrollable)
      : scrollable[MC.S_SCROLL_HEIGHT] - getClientHeightNow(scrollable);

    // Get click offset relative to the scrollbar regardless of what the
    // event target is and what transforms is has applied.
    const rect = MH.getBoundingClientRect(scrollbar);
    const offset = barIsHorizontal
      ? event.clientX - rect.left
      : event.clientY - rect.top;

    logger?.debug10("Pointer offset", offset);

    if (offset === lastOffset) {
      return;
    }

    const deltaOffset = isClick ? offset : offset - lastOffset;
    lastOffset = offset;

    if (!isClick && useHandle) {
      // Dragging the handle
      const handleLength = handle
        ? MH.parseFloat(
            getComputedStylePropNow(
              handle,
              barIsHorizontal ? MC.S_WIDTH : MC.S_HEIGHT,
            ),
          )
        : 0;

      lastTargetFraction =
        lastTargetFraction + deltaOffset / (barLength - (handleLength || 0));
    } else if (isHandleClick) {
      // Starting a handle drag
      lastTargetFraction = currScrollOffset / maxScrollOffset;
    } else {
      // Clicking or dragging on the bar -> scroll to the offset under the pointer
      lastTargetFraction = offset / barLength;
    }

    if (isHandleClick || (isClick && !clickScroll)) {
      return;
    }

    const targetScrollOffset = lastTargetFraction * maxScrollOffset;
    const targetCoordinates = tracksH
      ? { left: targetScrollOffset }
      : { top: targetScrollOffset };

    logger?.debug10("Scroll target offset", {
      lastTargetFraction,
      targetCoordinates,
    });

    if (isClick) {
      // smooth scroll
      scrollAction = await scrollWatcher.scrollTo(targetCoordinates, {
        scrollable,
        weCanInterrupt: true,
      });
    } else {
      scrollAction?.cancel();
      scrollAction = null;
      MH.elScrollTo(scrollable, targetCoordinates);
    }
  };

  // ----------

  const onRelease = (event: Event, tracksH: boolean) => {
    const scrollbar = tracksH ? scrollbarH : scrollbarV;
    setOrReleasePointerCapture(event, scrollbar, S_RELEASE_POINTER_CAPTURE);

    isDragging = false;
    scrollAction = null;
  };

  const onClickOrDragH = (event: Event) => onClickOrDrag(event, true);
  const onClickOrDragV = (event: Event) => onClickOrDrag(event, false);
  const onReleaseH = (event: Event) => onRelease(event, true);
  const onReleaseV = (event: Event) => onRelease(event, false);

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
      scrollable,
    });

    // Track changes in content or border size of the container element which
    // would also detect changes in its padding.
    sizeWatcher.onResize(updatePropsOnResize, {
      target: containerElement,
      threshold: 0,
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

  const scrollWatcher = ScrollWatcher.reuse({ [MC.S_DEBOUNCE_WINDOW]: 0 });
  const sizeWatcher = SizeWatcher.reuse({ [MC.S_DEBOUNCE_WINDOW]: 0 });

  if (!isMainScrollable && !isBody) {
    addClasses(containerElement, PREFIX_CONTAINER);
  }

  setBooleanData(containerElement, PREFIX_ALLOW_COLLAPSE, !MC.IS_MOBILE);
  setBooleanData(containerElement, PREFIX_HAS_WRAPPER, !!contentWrapper);
  setBooleanData(
    containerElement,
    PREFIX_HAS_V_SCROLL,
    !!contentWrapper && hasVScroll,
  );

  // Wrap children if needed
  if (contentWrapper && !hasExistingWrapper) {
    wrapChildren(containerElement, {
      wrapper: contentWrapper,
      ignoreMove: true,
    }); // no need to await here
    addClasses(contentWrapper, PREFIX_CONTENT);
  }

  maybeSetNativeHidden();

  if (config?.id) {
    scrollable.id = config.id;
  }

  if (config?.className) {
    addClasses(scrollable, ...toArrayIfSingle(config.className));
  }

  const hadDomID = !!scrollable.id;
  const scrollDomID = // for ARIA
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

  const { _bar: scrollbarH, _handle: handleH } = newScrollbar(
    wrapper,
    positionH,
  );
  const { _bar: scrollbarV, _handle: handleV } = newScrollbar(
    wrapper,
    positionV,
  );

  moveElement(wrapper, {
    to: barParent,
    position: "prepend",
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

    if (!hadDomID) {
      scrollable.id = "";
    }

    await waitForMutateTime();
    if (contentWrapper && !hasExistingWrapper) {
      moveChildrenNow(contentWrapper, containerElement, { ignoreMove: true });
      moveElementNow(contentWrapper); // remove
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

const isHorizontal = (scrollbar: Element) =>
  getData(scrollbar, MC.PREFIX_ORIENTATION) === MC.S_HORIZONTAL;

const setBoxMeasureProps = async (element: HTMLElement) => {
  for (const side of [MC.S_TOP, MC.S_RIGHT, MC.S_BOTTOM, MC.S_LEFT]) {
    for (const key of [`padding-${side}`, `border-${side}-width`]) {
      const padding = await getComputedStyleProp(element, key);
      setStyleProp(element, MH.prefixCssJsVar(key), padding);
    }
  }
};

const setOrReleasePointerCapture = (
  event: Event,
  scrollbar: Element,
  method: "setPointerCapture" | "releasePointerCapture",
) => {
  if (MH.isPointerEvent(event) && method in scrollbar) {
    scrollbar[method](event.pointerId);
  }
};
