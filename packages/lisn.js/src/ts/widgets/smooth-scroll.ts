/**
 * @module Widgets
 */

// XXX TODO more effect types: opacity, color, background-color, filters, svg stroke, etc, and custom props
// for svg stroke, see svg.getTotalLength, stroke-dasharray and stroke-offset

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { settings } from "@lisn/globals/settings";

import { RawOrRelativeNumber } from "@lisn/globals/types";

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
import { toNumWithBounds, toRawNum } from "@lisn/utils/math";
import { getDefaultScrollingElement } from "@lisn/utils/scroll";
import { formatAsString } from "@lisn/utils/text";
import {
  validateNumber,
  validateRawOrRelativeNumber,
} from "@lisn/utils/validation";

import { FXController } from "@lisn/effects/fx-controller";
import { Transform } from "@lisn/effects/transform";

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
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-smooth-scroll` class or `data-lisn-smooth-scroll` attribute set
 *   on the element that constitutes the scrollable container.
 * - `data-lisn-smooth-scroll-layer` attribute set on elements that want to
 *   define custom lag or depth values
 *
 * Note that currently it is not possible to set custom effects using the HTML
 * API.
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
            // TODO parse effects from the data-lisn-smooth-scroll-effects
            // attribute?
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
   * The effect controller to use. If not given, a default controller will be
   * used which creates a regular smooth scroll effect that tracks the actual
   * scroll.
   *
   * @defaultValue undefined // Regular smooth scroll (translation)
   */
  controller?: FXController;

  /**
   * Elements which use custom animation settings. They must be descendants of
   * the scrollable.
   *
   * If this is not specified, then the top-level element that constitutes the
   * widget is searched for any elements that contain the
   * `data-lisn-smooth-scroll-layer` attribute.
   *
   * If you pass an array of elements, they will be used as layers, and their
   * {@link SmoothScrollLayerConfig | configuration} will be taken from the
   * `data-lisn-smooth-scroll-layer` attribute. If you pass a map, its keys are
   * the elements and its values are used as the configuration, ignoring the
   * data attribute.
   *
   * @defaultValue undefined
   */
  layers?: Element[] | Map<Element, SmoothScrollLayerConfig | null>;
};

/**
 * Custom lag, depth or controller for a descendant element of the scrollable.
 * Can either be given as an object as the value of the
 * {@link SmoothScrollConfig.layers} map, or it can be set as a string
 * configuration in the `data-lisn-smooth-scroll-layer` data attribute (except
 * the effect controller). See {@link getWidgetConfig} for the syntax.
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
   * Override the parent layer or root's lag for this child. It can be relative
   * to the parent's lag.
   *
   * @defaultValue undefined
   */
  lag?: RawOrRelativeNumber;

  /**
   * Override the parent layer or root's horizontal lag for this child. It can
   * be relative to the parent's lag.
   *
   * @defaultValue undefined
   */
  lagX?: RawOrRelativeNumber;

  /**
   * Override the parent layer or root's vertical lag for this child. It can
   * be relative to the parent's lag.
   *
   * @defaultValue undefined
   */
  lagY?: RawOrRelativeNumber;

  /**
   * Override the parent layer or root's effect controller for this child.
   *
   * Note that {@link Effects/Transform.Transform | transforms} applied to a parent layer are always inverted/negated
   * on child layers so the transforms given for a layer will be its actual
   * transform (relative to the viewport).
   *
   * @defaultValue undefined
   */
  controller?: FXController;

  /**
   * Parallax depth. This is a scaling ratio for the scroll offset. It can be
   * relative to the parent's depth. It must result in a positive number. Values
   * larger than 1 will result in a smaller amount of transformation.
   *
   * The special value "auto" is accepted only when using the default transform
   * (which shifts the content to simulate scrolling). When the depth is set to
   * "auto" the height/width of the element XXX TODO
   *
   * @defaultValue 1
   */
  depth?: RawOrRelativeNumber;
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
const PREFIX_USES_STICKY = MH.prefixName("uses-sticky");

const PREFIX_LAYER = `${PREFIXED_NAME}-layer`;
const PREFIX_TRANSFORM = `${PREFIXED_NAME}-transform`;
const SELECTOR_LAYER = `[data-${PREFIX_LAYER}],[data-${PREFIX_TRANSFORM}]`;

type SmoothScrollLayerState = {
  _lagX: number;
  _lagY: number;
  _depth: number;
  _controller: FXController;
  _children: Set<Element>;
  _parentState: SmoothScrollLayerState | null;
  _scrollData?: ScrollData;
};

let mainWidget: SmoothScroll | null = null;

// For HTML API only
const configValidator: WidgetConfigValidatorObject<SmoothScrollConfig> = {
  lag: validateNumber,
  lagX: validateNumber,
  lagY: validateNumber,
};

// For HTML API only
const layerConfigValidator: WidgetConfigValidatorObject<SmoothScrollLayerConfig> =
  {
    lag: validateRawOrRelativeNumber,
    lagX: validateRawOrRelativeNumber,
    lagY: validateRawOrRelativeNumber,
    depth: validateRawOrRelativeNumber,
  };

const getParentLayer = (scrollable: Element, layer: Element) => {
  const closest = MH.closestParent(layer, SELECTOR_LAYER);
  return closest && scrollable.contains(closest) && closest !== scrollable
    ? closest
    : null;
};

const getLayersFrom = (
  scrollable: Element,
  rootConfig: SmoothScrollConfig | undefined,
) => {
  const layerMap = MH.newMap<Element, SmoothScrollLayerState>(); // will include the root

  const defaultLag = settings.smoothScrollLag;
  let defaultController: FXController;

  const getDefaultController = () => {
    defaultController ??= new FXController({ scrollable }).add([
      new Transform({ isAbsolute: true }).translate((data) => ({
        x: data.x,
        y: data.y,
      })),
    ]);
    return defaultController;
  };

  const getLayerConfig = (layer: Element) => {
    let config: SmoothScrollLayerConfig | null | undefined;
    // let parseEffectsAttr = false;

    if (layer === scrollable) {
      config = rootConfig;
    } else if (MH.isArray(inputLayers)) {
      // parseEffectsAttr = true;
      config = getWidgetConfig(
        getData(layer, PREFIX_LAYER) ?? "",
        layerConfigValidator,
      );
    } else {
      config = inputLayers.get(layer);
    }

    // TODO read effects from the data-lisn-smooth-scroll-effects attribute?
    // if (parseEffectsAttr) {
    // }

    return config;
  };

  const getLayerState = (layer: Element): SmoothScrollLayerState => {
    let state = layerMap.get(layer);
    if (!state) {
      const config = getLayerConfig(layer);
      const parent = getParentLayer(scrollable, layer);
      const parentState = parent ? getLayerState(parent) : null;

      if (parentState) {
        parentState._children.add(layer);
      }

      state = {
        _lagX: toRawNum(
          config?.lagX,
          parentState?._lagX ?? rootConfig?.lagX ?? defaultLag,
        ),
        _lagY: toRawNum(
          config?.lagY,
          parentState?._lagY ?? rootConfig?.lagY ?? defaultLag,
        ),
        _depth: toNumWithBounds(
          toRawNum(config?.depth, parentState?._depth ?? 1),
          { min: 0.01 },
          1,
        ),
        _controller:
          config?.controller ??
          parentState?._controller ??
          getDefaultController(),
        _children: MH.newSet(),
        _parentState: parentState,
      };

      layerMap.set(layer, state);
    }

    return state;
  };

  // ----------

  const inputLayers = rootConfig?.layers ?? [
    ...MH.querySelectorAll(scrollable, SELECTOR_LAYER),
  ];

  const layersIterable = MH.isArray(inputLayers)
    ? inputLayers
    : (inputLayers?.keys() ?? []);

  for (const layer of layersIterable) {
    getLayerState(layer);
  }

  return layerMap;
};

type WrappersFor<K extends string> = {
  [key in K]: HTMLElement;
};

const createWrappersNow = <K extends string>(
  element: HTMLElement,
  classNamesEntries: readonly [
    // from outer-most to inner-most wrapper:
    K, // key to use in the returned object,
    string[], // classNames to add and remove on unwrap,
    string[], // classNames to add but not remove,
  ][],
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

  const layers = getLayersFrom(scrollable, config);

  const logger = debug
    ? new debug.Logger({
        name: `SmoothScroll-${formatAsString(scrollable)}`,
        logAtCreation: { config, isBody },
      })
    : null;

  // TODO Fallback to using scroll gestures:
  // Position the outerWrapper as fixed, listen for gestures and initiate
  // scrolling on the scrollable
  if (!isBody && !supportsSticky()) {
    logError(
      "SmoothScroll on elements other than the document relies on " +
        "position: sticky, but this browser does not support sticky.",
    );
    return;
  }

  const sizeWatcher = isBody
    ? SizeWatcher.reuse({ [MC.S_DEBOUNCE_WINDOW]: 0 })
    : null;

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

  const addWatchers = () => {
    sizeWatcher?.onResize(updatePropsOnResize, {
      target: innerWrapper,
      threshold: 0,
    });
  };

  const removeWatchers = () => {
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
    for (const state of layers.values()) {
      state._controller.clear();
    }

    await waitForMutateTime();

    unwrapFn();

    // delete CSS vars from root
    setSizeVars(root, NaN, NaN, true);

    removeClassesNow(root, PREFIX_ROOT);
    delDataNow(root, PREFIX_USES_STICKY);
  });
};
