/**
 * @module Widgets
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { newCriticallyDampedAnimationIterator } from "@lisn/utils/animations";
import { supportsSticky } from "@lisn/utils/browser";
import {
  addClassesNow,
  removeClassesNow,
  setBooleanDataNow,
  delDataNow,
  setNumericStyleJsVars,
  setNumericStyleJsVarsNow,
} from "@lisn/utils/css-alter";
import {
  getContentWrapper,
  tryWrapContentNow,
  unwrapContentNow,
} from "@lisn/utils/dom-alter";
import {
  waitForMeasureTime,
  waitForMutateTime,
} from "@lisn/utils/dom-optimize";
import { logError } from "@lisn/utils/log";
import { toArrayIfSingle } from "@lisn/utils/misc";
import { getDefaultScrollingElement } from "@lisn/utils/scroll";
import { formatAsString } from "@lisn/utils/text";
import {
  validateStrList,
  validateNumber,
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
 * Configures the given element as a {@link SmoothScroll} widget.
 *
 * The SmoothScroll widget creates a configurable smooth scrolling
 * experience, including support for lag and parallax depth, and using a custom
 * element that only takes up part of the page, all while preserving native
 * scrolling behaviour (i.e. it does not disable native scroll and does not use
 * fake scrollbars).
 *
 * **IMPORTANT:** The scrollable element you pass must have its children
 * wrapped. This will be done automatically unless you create these wrappers
 * yourself by ensuring your structure is as follows:
 *
 * ```html
 * <!-- If using the document as the scrollable -->
 * <body><!-- Element you instantiate as SmoothScroll, or you can pass documentElement -->
 *   <div class="lisn-smooth-scroll__content"><!-- Required wrapper; will be created if missing -->
 *     <div class="lisn-smooth-scroll__inner"><!-- Required inner wrapper; will be created if missing -->
 *       <!-- YOUR CONTENT -->
 *     </div>
 *   </div>
 * </body>
 * ```
 *
 * ```html
 * <!-- If using a custom scrollable -->
 * <div class="scrollable"><!-- Element you instantiate as SmoothScroll -->
 *   <div class="lisn-smooth-scroll__content"><!-- Required outer wrapper; will be created if missing -->
 *     <div class="lisn-smooth-scroll__inner"><!-- Required inner wrapper; will be created if missing -->
 *       <!-- YOUR CONTENT -->
 *     </div>
 *   </div>
 * </div>
 * ```
 *
 * **IMPORTANT:** If the scrollable element you pass is other than
 * `document.documentElement` or `document.body`, SmoothScroll will then rely on
 * position: sticky. XXX TODO
 *
 * **IMPORTANT:** You should not instantiate more than one
 * {@link SmoothScroll} widget on a given element. Use
 * {@link SmoothScroll.get} to get an existing instance if any. If there is
 * already a widget instance, it will be destroyed!
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-smooth-scroll` class or `data-lisn-smooth-scroll` attribute set
 *   on the container element that constitutes the scrollable container
 *
 * See below examples for what values you can use set for the data attribute
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This will create a smooth scroller for
 * {@link settings.mainScrollableElementSelector | the main scrolling element}.
 *
 * This will work even if {@link settings.autoWidgets}) is false
 *
 * ```html
 * <!-- LISN should be loaded beforehand -->
 * <script>
 *   // You can also just customise global default settings:
 *   // LISN.settings.smoothScroll = "TODO";
 *
 *   LISN.widgets.SmoothScroll.enableMain({
 *     XXX: "TODO",
 *   });
 * </script>
 * ```
 *
 * @example
 * This will create a smooth scroller for a custom scrolling element (i.e. one
 * with overflow "auto" or "scroll").
 *
 * ```html
 * <div class="scrolling lisn-smooth-scroll">
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
 *   data-lisn-smooth-scroll="XXX=TODO
 *                            | XXX=TODO
 *                        ">
 *   <!-- content here... -->
 * </div>
 * ```
 */
export class SmoothScroll extends Widget {
  // XXX TODO getScrollable ?

  /**
   * If element is omitted, returns the instance created by {@link enableMain}
   * if any.
   */
  static get(scrollable?: Element): SmoothScroll | null {
    if (!scrollable) {
      return mainWidget;
    }

    if (scrollable === MH.getDocElement()) {
      scrollable = MH.getBody();
    }

    const instance = super.get(scrollable, DUMMY_ID);
    if (MH.isInstanceOf(instance, SmoothScroll)) {
      return instance;
    }
    return null;
  }

  /**
   * Creates a smooth scroller for the
   * {@link settings.mainScrollableElementSelector | the main scrolling element}.
   *
   * **NOTE:** It returns a Promise to a widget because it will wait for the
   * main scrollable element to be present in the DOM if not already.
   */
  static async enableMain(config?: SmoothScrollConfig) {
    const scrollable = await ScrollWatcher.fetchMainScrollableElement();
    const widget = new SmoothScroll(scrollable, config);
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
          if (!SmoothScroll.get(element)) {
            return new SmoothScroll(element, config);
          }
        } else {
          logError(
            MH.usageError(
              "Only HTMLElement is supported for SmoothScroll widget",
            ),
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
  constructor(scrollable: HTMLElement, config?: SmoothScrollConfig) {
    if (scrollable === MH.getDocElement()) {
      scrollable = MH.getBody();
    }

    const destroyPromise = SmoothScroll.get(scrollable)?.destroy();
    super(scrollable, { id: DUMMY_ID });

    // const props = getScrollableProps(scrollable); // XXX
    // const ourScrollable = props.scrollable; // XXX

    (destroyPromise || MH.promiseResolve()).then(async () => {
      if (this.isDestroyed()) {
        return;
      }

      init(this, scrollable, config);
      // XXX init(this, scrollable, props, config);
    });
  }
}

/**
 * @interface
 */
export type SmoothScrollConfig = {
  /**
   * The DOM ID to set on the outer content wrapper. Will result in the content
   * wrapper element that's created by us getting this ID.
   *
   * @defaultValue undefined
   */
  id?: string;

  /**
   * A class name or a list of class names to set on the outer content wrapper.
   * Will result in the content wrapper element that's created by us getting
   * these classes.
   *
   * @defaultValue undefined
   */
  className?: string[] | string;

  /**
   * XXX TODO
   *
   * @defaultValue {@link settings.smoothScrollLag}
   */
  lag?: number;

  /**
   * XXX TODO
   *
   * @defaultValue {@link settings.smoothScrollDepth}
   */
  depth?: number;
};

// --------------------

const WIDGET_NAME = "smooth-scroll";
const PREFIXED_NAME = MH.prefixName(WIDGET_NAME);
// Only one SmoothScroll widget per element is allowed, but Widget requires a
// non-blank ID.
const DUMMY_ID = PREFIXED_NAME;
const PREFIX_ROOT = `${PREFIXED_NAME}__root`;
const PREFIX_OUTER_WRAPPER = `${PREFIXED_NAME}__content`;
const PREFIX_INNER_WRAPPER = `${PREFIXED_NAME}__inner`;
const PREFIX_HAS_H_SCROLL = MH.prefixName("has-h-scroll");
const PREFIX_HAS_V_SCROLL = MH.prefixName("has-v-scroll");
const PREFIX_USES_STICKY = MH.prefixName("uses-sticky");

let mainWidget: SmoothScroll | null = null;

const configValidator: WidgetConfigValidatorObject<SmoothScrollConfig> = {
  id: validateString,
  className: validateStrList,
  lag: validateNumber,
};

type WrappersFor<K extends string> = {
  [key in K]: HTMLElement;
};

const createWrappers = <K extends string>(
  element: HTMLElement,
  // from outer-most to inner-most:
  // [
  //   key to use in the returned object,
  //   classNames to add,
  // ]
  classNamesEntries: readonly [K, string[], string[]][],
): { wrappers: WrappersFor<K>; unwrapFn: () => void } => {
  const wrapContentNow = (element: HTMLElement, classNames: string[]) =>
    tryWrapContentNow(element, {
      _classNames: classNames,
      _required: true,
      _requiredBy: "SmoothScroll",
    });

  let lastWrapper = element;
  const result = {} as WrappersFor<K>;
  let createdByUs: [HTMLElement, string[]][] = [];

  const unwrapFn = () => {
    for (const [wrapper, classNames] of createdByUs) {
      unwrapContentNow(wrapper, classNames);
    }
    createdByUs = [];
  };

  for (const [key, classNames, extraClassNames] of classNamesEntries) {
    let wrapper = getContentWrapper(lastWrapper, {
      _classNames: [...classNames, ...extraClassNames],
    });

    if (!wrapper) {
      wrapper = wrapContentNow(lastWrapper, [
        ...classNames,
        ...extraClassNames,
      ]);
      createdByUs.push([wrapper, classNames]); // only remove the specific classes
    }

    lastWrapper = wrapper;
    result[key] = wrapper;
  }

  return { wrappers: result, unwrapFn };
};

// XXX TODO children can use unique lag factor
const init = async (
  widget: SmoothScroll,
  scrollable: HTMLElement,
  // props: ReturnType<typeof getScrollableProps>, XXX
  config: SmoothScrollConfig | undefined,
) => {
  const docEl = MH.getDocElement();
  const body = MH.getBody();
  const defaultScrollable = getDefaultScrollingElement();
  let isBody = false;
  let root = scrollable;

  if (scrollable === docEl || scrollable === body) {
    scrollable = defaultScrollable;
    root = body;
    isBody = true;
  }

  const logger = debug
    ? new debug.Logger({
        name: `SmoothScroll-${formatAsString(scrollable)}`,
        logAtCreation: { config, isBody },
      })
    : null;

  if (!isBody && !supportsSticky()) {
    logError(
      "SmoothScroll on elements other than the document relies on " +
        "position: sticky, but this browser does not support sticky.",
    );
    return;
  }

  const scrollWatcher = ScrollWatcher.reuse({ [MC.S_DEBOUNCE_WINDOW]: 0 });
  const sizeWatcher = SizeWatcher.reuse({ [MC.S_DEBOUNCE_WINDOW]: 0 });

  // We only care if it has horizontal/vertical scroll if we're using a custom
  // scrollable, so no need to check otherwise.
  // XXX
  // const hasHScroll = needsSticky
  //   ? isScrollable(scrollable, { axis: "x" })
  //   : false;
  // const hasVScroll = needsSticky
  //   ? isScrollable(scrollable, { axis: "y" })
  //   : false;

  // ----------

  const setSizeVars = (
    element: Element,
    width: number,
    height: number,
    now = false,
  ) => {
    (now ? setNumericStyleJsVarsNow : setNumericStyleJsVars)(
      element,
      { width, height },
      { _units: "px", _numDecimal: 2 },
    );
  };

  // If there's a scroll or size change for the scrollable container, update the
  // transforms and possibly the width/height of the content (if it uses sticky).
  const updatePropsOnScroll = (target: Element, scrollData: ScrollData) => {
    console.log("XXX", scrollData);
    updateTargetPosition(scrollData);

    // If the scrollable scrolls horizontally we need to set a fixed width on
    // the inner wrapper, and if it scrolls vertically we need to set a fixed
    // height.
    // XXX
    // if (needsSticky) {
    //   setSizeVars(
    //     innerWrapper,
    //     hasHScroll ? scrollData[MC.S_CLIENT_WIDTH] : NaN,
    //     hasVScroll ? scrollData[MC.S_CLIENT_HEIGHT] : NaN,
    //   );
    // }
  };

  // If content is resized, update the body size to match its size
  const updatePropsOnResize = (target: Element, sizeData: SizeData) => {
    console.log("XXX", sizeData);
    setSizeVars(
      root,
      sizeData.border[MC.S_WIDTH],
      sizeData.border[MC.S_HEIGHT],
    );
  };

  // ----------

  const currentPositions = { x: 0, y: 0 };
  const targetPositions = MH.copyObject(currentPositions);

  const updateTargetPosition = (scrollData: ScrollData) => {
    for (const d of ["x", "y"] as const) {
      const current = currentPositions[d];
      const target = targetPositions[d];
      const newTarget =
        scrollData[d === "x" ? MC.S_SCROLL_LEFT : MC.S_SCROLL_TOP];

      const isOngoing = current !== target;
      targetPositions[d] = newTarget;

      if (!isOngoing) {
        animateTransforms(d);
      }
    }
  };

  const animateTransforms = async (d: "x" | "y"): Promise<void> => {
    const lag = config?.lag ?? 1000; // XXX
    debug: logger?.debug10(
      `Starting animating ${d} transforms with lag ${lag}`,
    );

    let target = targetPositions[d];
    let current = currentPositions[d];
    const iterator = newCriticallyDampedAnimationIterator({
      l: current,
      lTarget: target,
      lag,
    });

    while (({ l: current } = (await iterator.next(target)).value)) {
      currentPositions[d] = current;
      target = targetPositions[d];

      setNumericStyleJsVars(
        innerWrapper,
        { [d]: -current },
        { _prefix: "offset-", _units: "px", _numDecimal: 2 },
      );

      console.log(
        "XXX",
        JSON.stringify({
          d,
          current,
          target,
        }),
      );

      if (current === target) {
        debug: logger?.debug10(`Done animating ${d} transforms`, target);
        return;
      }
    }
  };

  // ----------

  const addWatchers = () => {
    scrollWatcher.onScroll(updatePropsOnScroll, {
      threshold: 0,
      scrollable,
    });

    sizeWatcher.onResize(updatePropsOnResize, {
      target: innerWrapper,
      threshold: 0,
    });
  };

  const removeWatchers = () => {
    scrollWatcher.offScroll(updatePropsOnScroll, scrollable);
    sizeWatcher.offResize(updatePropsOnResize, innerWrapper);
  };

  // SETUP ------------------------------

  let initialContentWidth = 0,
    initialContentHeight = 0;
  // TODO also measure the margins on body and set those on the outerWrapper
  if (isBody) {
    await waitForMeasureTime();
    initialContentWidth = scrollable[MC.S_SCROLL_WIDTH];
    initialContentHeight = scrollable[MC.S_SCROLL_HEIGHT];

    debug: logger?.debug5({
      clientWidth: scrollable.clientWidth,
      clientHeight: scrollable.clientHeight,
      scrollWidth: initialContentWidth,
      scrollHeight: initialContentHeight,
    });
  }

  await waitForMutateTime();
  addClassesNow(root, PREFIX_ROOT);

  // Wrap the contents in a fixed/sticky positioned wrapper.
  // [TODO v2]: Better way to centrally manage wrapping and wrapping of elements
  const { wrappers, unwrapFn } = createWrappers(root, [
    ["o", [PREFIX_OUTER_WRAPPER], [MC.PREFIX_WRAPPER]],
    ["i", [PREFIX_INNER_WRAPPER], [MC.PREFIX_WRAPPER_INLINE]],
  ]);

  const outerWrapper = wrappers.o;
  const innerWrapper = wrappers.i;

  if (!isBody) {
    // XXX
    // setBooleanDataNow(root, PREFIX_HAS_H_SCROLL, hasHScroll);
    // setBooleanDataNow(root, PREFIX_HAS_V_SCROLL, hasVScroll);
    setBooleanDataNow(root, PREFIX_USES_STICKY);
  }

  if (config?.id) {
    outerWrapper.id = config.id;
  }

  if (config?.className) {
    addClassesNow(outerWrapper, ...toArrayIfSingle(config.className));
  }

  if (isBody) {
    // set its size now to prevent initial layout shifts
    setSizeVars(root, initialContentWidth, initialContentHeight, true);
  }

  addWatchers();

  widget.onDisable(() => {
    removeWatchers();
    // XXX TODO re-enable regular scrolling
  });

  widget.onEnable(() => {
    addWatchers();
    // XXX TODO re-enable smooth scrolling
  });

  widget.onDestroy(async () => {
    await waitForMutateTime();

    unwrapFn();

    // delete CSS vars from root
    setSizeVars(root, NaN, NaN, true);

    removeClassesNow(root, PREFIX_ROOT);
    // delDataNow(root, PREFIX_HAS_H_SCROLL); // XXX
    // delDataNow(root, PREFIX_HAS_V_SCROLL); // XXX
    delDataNow(root, PREFIX_USES_STICKY);
  });
};
