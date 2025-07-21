/**
 * @module Widgets
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { settings } from "@lisn/globals/settings";

import { newCriticallyDampedAnimationIterator } from "@lisn/utils/animations";
import { supportsSticky } from "@lisn/utils/browser";
import {
  addClassesNow,
  removeClassesNow,
  getData,
  setBooleanDataNow,
  delDataNow,
  setStylePropNow,
  getComputedStylePropNow,
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
import { toNumWithBounds } from "@lisn/utils/math";
import { getDefaultScrollingElement } from "@lisn/utils/scroll";
import { formatAsString } from "@lisn/utils/text";
import { validateNumber, validateString } from "@lisn/utils/validation";

import { ScrollWatcher, ScrollData } from "@lisn/watchers/scroll-watcher";
import { SizeWatcher, SizeData } from "@lisn/watchers/size-watcher";

import {
  Widget,
  WidgetConfigValidatorObject,
  registerWidget,
  getWidgetConfig,
} from "@lisn/widgets/widget";

import debug from "@lisn/debug/debug";

/**
 * Configures the given element as a {@link SmoothScroll} widget.
 *
 * The SmoothScroll widget creates a highly configurable animated scrolling
 * experience. By default it creates basic smooth scrolling with options for lag
 * duration.
 *
 * However you can define custom transforms in an easy yet flexible way.
 *
 * It supports scroll in any direction as well as using a custom scrolling
 * element that may only takes up part of the page, all while preserving
 * **native** scrolling behaviour (i.e. it does not disable native scroll and
 * does not use fake scrollbars).
 *
 * Any descendant element of the scrollable can define custom lag duration and
 * transforms as well as a parallax depth. Such child elements are referred to
 * as "layers".
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
 * **NOTE:** If the scrollable element you pass is other than
 * `document.documentElement` or `document.body`, SmoothScroll will then rely on
 * position: sticky.
 *
 * **IMPORTANT:** You should not instantiate more than one
 * {@link SmoothScroll} widget on a given element. Use
 * {@link SmoothScroll.get} to get an existing instance if any. If there is
 * already a widget instance, it will be destroyed!
 *
 * -----
 *
 * The following dynamic CSS properties are set on the root scrollable as well
 * as on each layer element:
 * - `--lisn-js--offset-x`: the horizontal scroll offset in pixels (does not
 *   include "px" in the value); this is the scrollable's `scrollLeft` divided
 *   by the depth factor of the layer.
 * - `--lisn-js--offset-y`: the vertical scroll offset in pixels (does not
 *   include "px" in the value); this is the scrollable's `scrollTop` divided by
 *   the depth factor of the layer.
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-smooth-scroll` class or `data-lisn-smooth-scroll` attribute set
 *   on the element that constitutes the scrollable container.
 * - `data-lisn-smooth-scroll-layer` attribute set on elements that want to
 *   define custom lag or depth values
 * - `data-lisn-smooth-scroll-transforms` attribute set on either the scrollable
 *   or on descendant elements that want to define custom transforms.
 *
 * See below examples for what values you can use set for the data attribute
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This will create smooth scrolling for
 * {@link settings.mainScrollableElementSelector | the main scrolling element}.
 *
 * This will work even if {@link settings.autoWidgets}) is false
 *
 * ```html
 * <!-- LISN should be loaded beforehand -->
 * <script>
 *   // You can also just customise global default settings:
 *   // LISN.settings.smoothScrollLag = 800;
 *   // XXX TODO others
 *
 *   LISN.widgets.SmoothScroll.enableMain({
 *     lag: 800,
 *     // XXX TODO others
 *   });
 * </script>
 * ```
 *
 * @example
 * This will create smooth scrolling for a custom scrolling element (i.e. one
 * with a fixed width/height and overflow "auto" or "scroll").
 *
 * ```html
 * <div class="scrolling lisn-smooth-scroll">
 *   <!-- content here... -->
 * </div>
 * ```
 *
 * @example
 * As above but with custom settings and parallax children (layers).
 *
 * ```html
 * <div
 *   class="scrolling"
 *   data-lisn-smooth-scroll="lag=700">
 *   <!-- content here... -->
 *
 *   <div data-lisn-smooth-scroll-layer="depth=auto">
 *     <!-- auto-parallax content here... -->
 *   </div>
 *
 *   <div data-lisn-smooth-scroll-layer="lag=+300 | depth=1.3">
 *     <!-- parallax at 130% content here with lag of 1000... -->
 *   </div>
 * </div>
 * ```
 *
 * @example
 * This defines multiple layers with custom transforms for various scroll offset
 * bounds. These bounds are defined by reference offsets or elements.
 *
 * ```html
 * XXX TODO
 * ```
 */
export class SmoothScroll extends Widget {
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
   * Creates animated scrolling for the
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

    (destroyPromise || MH.promiseResolve()).then(async () => {
      if (this.isDestroyed()) {
        return;
      }

      init(this, scrollable, config);
    });
  }
}

/**
 * @interface
 */
export type SmoothScrollConfig = {
  /**
   * The time in milliseconds it takes for content to catch up to the actual
   * scroll offset. This can be overridden for each layer.
   *
   * @defaultValue {@link settings.smoothScrollLag}
   */
  lag?: number;

  /**
   * The lag along the horizontal axis. This can be overridden for each layer.
   *
   * @defaultValue {@link lag}
   */
  lagX?: number;

  /**
   * The lag along the vertical axis. This can be overridden for each layer.
   *
   * @defaultValue {@link lag}
   */
  lagY?: number;

  /**
   * Transforms to apply based on scroll.
   *
   * @defaultValue {@link settings.smoothScrollTransforms}
   */
  transforms?: ScrollTransforms;

  /**
   * Elements which use custom animation settings. They must be descendants of
   * the scrollable.
   */
  layers?: Element[] | Map<Element, SmoothScrollLayerConfig | null>;
};

/**
 * Custom lag, depth or transform for a descendant element of the scrollable.
 * Can either be given as an object as the value of the
 * {@link SmoothScrollConfig.layers} map, or it can be set as a string
 * configuration in the `data-lisn-smooth-scroll-layer` data attribute. See
 * {@link getWidgetConfig} for the syntax.
 *
 * @example
 * ```html
 * <div data-lisn-smooth-scroll-layer="lag-x=-100
 *                                     | lag-y=+200
 *                                     | depth=auto"
 * ></div>
 * ```
 *
 * @interface
 */
export type SmoothScrollLayerConfig = {
  /**
   * Override the root's lag for this child. The value is absolute, not
   * accumulative.
   *
   * @defaultValue undefined
   */
  lag?: number;

  /**
   * Override the root's horizontal lag for this child. The value is absolute,
   * not accumulative.
   *
   * @defaultValue undefined
   */
  lagX?: number;

  /**
   * Override the root's vertical lag for this child. The value is absolute,
   * not accumulative.
   *
   * @defaultValue undefined
   */
  lagY?: number;

  /**
   * Override the root's transforms for this child. Note that transforms applied
   * on the scrollable or on parent layers are not negated on child layers, so
   * this value is always accumulative.
   *
   * @defaultValue undefined
   */
  transforms?: ScrollTransforms;

  /**
   * Parallax depth. This is a scaling ratio for the scroll offset. Values
   * smaller than 1 will result in a smaller amount of transformation.
   *
   * The special value "auto" is accepted only when using the default transform
   * (which shifts the content to simulate scrolling). When the depth is set to
   * "auto" the height/width of the element XXX TODO
   *
   * @defaultValue 1
   */
  depth?: number;

  // XXX TODO depthX and depthY?
};

export type ScrollTransforms =
  | ScrollTransformString
  | ScrollTransformCallback
  | ScrollTransformList;

/**
 * This is any valid value for the CSS transform property. It can contain the
 * following special placeholders which will be replaced with actual numerical
 * values:
 * - `${x}`: The calculated left offset in pixels for this layer, i.e. the
 *   scrollable's `scrollLeft` offset divided by the layer's depth.
 *   It is a positive number without units.
 * - `${y}`: The calculated top offset in pixels for this layer, i.e. the
 *   scrollable's `scrollTop` offset divided by the layer's depth.
 *   It is a positive number without units.
 * - `${maxX}`: The maximum left offset, i.e. the scrollable's `scrollWidth`
 *   divided by the layer's depth. It is a positive number without units.
 * - `${maxY}`: The maximum top offset, i.e. the scrollable's `scrollHeight`
 *   divided by the layer's depth. It is a positive number without units.
 *
 * @example
 * ```javascript
 * "translate(-${x}px, -${y}px) rotate(-180deg * ${y} / ${maxY})"
 * ```
 */
export type ScrollTransformString = string;

/**
 * The callback will be called with the current scroll data that was measured
 * during this scroll event and must return a valid transform string or list.
 */
export type ScrollTransformCallback = (
  scrollData: ScrollData,
) => ScrollTransformString | ScrollTransformList;

/**
 * An array of transforms, each one applying only for a given range of
 * horizontal/vertical scroll offset values.
 */
export type ScrollTransformList = Array<{
  transform: ScrollTransformString | ScrollTransformCallback;

  /**
   * The starting scroll offsets that this transform should apply from.
   *
   * @defaultValue 0
   */
  from?: ScrollOffsetReference;

  /**
   * The final scroll offsets that this transform should apply to.
   *
   * @defaultValue undefined // The maximum offset
   */
  to?: ScrollOffsetReference;
}>;

// --------------------

const WIDGET_NAME = "smooth-scroll";
const PREFIXED_NAME = MH.prefixName(WIDGET_NAME);
// Only one SmoothScroll widget per element is allowed, but Widget requires a
// non-blank ID.
const DUMMY_ID = PREFIXED_NAME;
const PREFIX_ROOT = `${PREFIXED_NAME}__root`;
const PREFIX_OUTER_WRAPPER = `${PREFIXED_NAME}__content`;
const PREFIX_INNER_WRAPPER = `${PREFIXED_NAME}__inner`;
const PREFIX_USES_STICKY = MH.prefixName("uses-sticky");

const PREFIX_LAYER = `${PREFIXED_NAME}-layer`;
const PREFIX_TRANSFORM = `${PREFIXED_NAME}-transform`;

let mainWidget: SmoothScroll | null = null;

const configValidator: WidgetConfigValidatorObject<SmoothScrollConfig> = {
  lag: validateNumber,
  lagX: validateNumber,
  lagY: validateNumber,
  // XXX TODO
};

const layerConfigValidator: WidgetConfigValidatorObject<SmoothScrollLayerConfig> =
  {
    lag: validateNumber,
    lagX: validateNumber,
    lagY: validateNumber,
    // XXX TODO
  };

const getLayersFrom = (
  scrollable: Element,
  inputLayers: SmoothScrollConfig["layers"],
) => {
  // XXX TODO transforms
  const layerMap = MH.newMap<Element, SmoothScrollLayerConfig>();

  inputLayers = inputLayers ?? [
    ...MH.querySelectorAll(scrollable, `[data-${PREFIX_LAYER}]`),
  ];

  if (MH.isArray(inputLayers)) {
    for (const layer of inputLayers) {
      layerMap.set(
        layer,
        getWidgetConfig(getData(layer, PREFIX_LAYER), layerConfigValidator),
      );
    }
  } else if (MH.isInstanceOf(inputLayers, Map)) {
    for (const [layer, layerConfig] of inputLayers.entries()) {
      layerMap.set(layer, getWidgetConfig(layerConfig, layerConfigValidator));
    }
  }

  return layerMap;
};

type WrappersFor<K extends string> = {
  [key in K]: HTMLElement;
};

const createWrappersNow = <K extends string>(
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

const init = async (
  widget: SmoothScroll,
  scrollable: HTMLElement,
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

  const layers = getLayersFrom(scrollable, config?.layers);

  const logger = debug
    ? new debug.Logger({
        name: `SmoothScroll-${formatAsString(scrollable)}`,
        logAtCreation: { config, isBody },
      })
    : null;

  // XXX TODO fallback to using scroll gestures
  // Position the outerWrapper as fixed, listen for gestures and initiate
  // scrolling on the scrollable
  if (!isBody && !supportsSticky()) {
    logError(
      "SmoothScroll on elements other than the document relies on " +
        "position: sticky, but this browser does not support sticky.",
    );
    return;
  }

  const scrollWatcher = ScrollWatcher.reuse({ [MC.S_DEBOUNCE_WINDOW]: 0 });
  const sizeWatcher = isBody
    ? SizeWatcher.reuse({ [MC.S_DEBOUNCE_WINDOW]: 0 })
    : null;

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

  // When there's a scroll, update the target scroll offset and if needed start
  // the animation.
  const updatePropsOnScroll = (target: Element, scrollData: ScrollData) => {
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

  // If the content is resized, update the body size to match its size.
  // Only applies when using the document scrolling element.
  const updatePropsOnResize = (target: Element, sizeData: SizeData) => {
    setSizeVars(
      root, // document.body
      sizeData.border[MC.S_WIDTH],
      sizeData.border[MC.S_HEIGHT],
    );
  };

  // ----------

  const currentPositions = { x: 0, y: 0 };
  const targetPositions = MH.copyObject(currentPositions);

  const animateTransforms = async (
    d: "x" | "y",
    element?: Element,
  ): Promise<void> => {
    if (!element) {
      element = innerWrapper;

      // animate all layers too
      for (const layer of layers.keys()) {
        animateTransforms(d, layer); // don't await here
      }
    }

    const thisConfig: SmoothScrollLayerConfig =
      layers.get(element) ?? config ?? {};
    const thisLag =
      thisConfig[d === "x" ? "lagX" : "lagY"] ??
      thisConfig.lag ??
      settings.smoothScrollLag;
    const thisDepth = toNumWithBounds(thisConfig.depth ?? 1, { min: 0.01 });

    debug: logger?.debug10(
      `Starting animating ${d} transforms with lag ${thisLag}`,
      element,
    );

    let target = targetPositions[d];
    let current = currentPositions[d];
    const iterator = newCriticallyDampedAnimationIterator({
      l: current,
      lTarget: target,
      lag: thisLag,
    });

    while (({ l: current } = (await iterator.next(target)).value)) {
      currentPositions[d] = current;
      target = targetPositions[d];

      setNumericStyleJsVars(
        element,
        { [d]: current / thisDepth },
        { _prefix: "offset-", _numDecimal: 2 },
      );

      if (current === target) {
        debug: logger?.debug10(
          `Done animating ${d} transforms to ${target}`,
          element,
        );
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

    sizeWatcher?.onResize(updatePropsOnResize, {
      target: innerWrapper,
      threshold: 0,
    });
  };

  const removeWatchers = () => {
    scrollWatcher.offScroll(updatePropsOnScroll, scrollable);
    sizeWatcher?.offResize(updatePropsOnResize, innerWrapper);
  };

  // SETUP ------------------------------

  let initialContentWidth = 0,
    initialContentHeight = 0;
  const propsToCopy: Record<string, string> = {};
  if (isBody) {
    await waitForMeasureTime();
    initialContentWidth = scrollable[MC.S_SCROLL_WIDTH];
    initialContentHeight = scrollable[MC.S_SCROLL_HEIGHT];

    // Copy over the margins and paddings from body to match since the container
    // will be positioned as fixed.
    for (const side of [MC.S_TOP, MC.S_RIGHT, MC.S_BOTTOM, MC.S_LEFT]) {
      for (const key of [`margin-${side}`, `padding-${side}`]) {
        propsToCopy[key] = getComputedStylePropNow(root, key);
      }
    }

    debug: logger?.debug5({
      clientWidth: scrollable.clientWidth,
      clientHeight: scrollable.clientHeight,
      scrollWidth: initialContentWidth,
      scrollHeight: initialContentHeight,
    });
  }

  await waitForMutateTime();
  // Wrap the contents in a fixed/sticky positioned wrapper.
  // [TODO v2]: Better way to centrally manage wrapping and wrapping of elements
  const { wrappers, unwrapFn } = createWrappersNow(root, [
    ["o", [PREFIX_OUTER_WRAPPER], [MC.PREFIX_WRAPPER]],
    ["i", [PREFIX_INNER_WRAPPER], [MC.PREFIX_WRAPPER_INLINE]],
  ]);

  const outerWrapper = wrappers.o;
  const innerWrapper = wrappers.i;

  if (isBody) {
    // Set its size now to prevent initial layout shifts
    setSizeVars(root, initialContentWidth, initialContentHeight, true);

    for (const prop in propsToCopy) {
      setStylePropNow(outerWrapper, prop, propsToCopy[prop]);
    }
  } else {
    setBooleanDataNow(root, PREFIX_USES_STICKY);
  }

  addClassesNow(root, PREFIX_ROOT);

  addWatchers();

  widget.onDisable(() => {
    removeWatchers();
    // XXX TODO re-enable regular scrolling
  });

  widget.onEnable(() => {
    addWatchers();
    // XXX TODO re-enable animated scrolling
  });

  widget.onDestroy(async () => {
    await waitForMutateTime();

    unwrapFn();

    // delete CSS vars from root
    setSizeVars(root, NaN, NaN, true);

    removeClassesNow(root, PREFIX_ROOT);
    delDataNow(root, PREFIX_USES_STICKY);
  });
};
