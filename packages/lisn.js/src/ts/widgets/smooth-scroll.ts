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
  addClasses,
  addClassesNow,
  removeClasses,
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

import { FXComposer } from "@lisn/effects/fx-composer";
import { Transform } from "@lisn/effects/transform";

import { ScrollWatcher, ScrollData } from "@lisn/watchers/scroll-watcher";
import { SizeWatcher, SizeData } from "@lisn/watchers/size-watcher";

import {
  Widget,
  WidgetConfigValidatorObject,
  registerWidget,
  getWidgetConfig,
} from "@lisn/widgets/widget";

import { LoggerInterface } from "@lisn/debug/types";
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
 * To use with auto-widgets (HTML API) (see {@link settings.autoWidgets}), the
 * following CSS classes or data attributes are recognized:
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
 *   // LISN.settings.effectLag = 800;
 *
 *   LISN.widgets.SmoothScroll.enableMain({
 *     lag: 800,
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
   * Returns the {@link FXComposer} used for the root or the given layer. You
   * can add custom effects to it.
   */
  readonly getComposer: (layer?: Element) => FXComposer | undefined;

  /**
   * If element is omitted, returns the instance created by {@link enableMain}
   * if any.
   */
  static get(scrollable?: Element): SmoothScroll | null {
    if (!scrollable) {
      return mainWidget;
    }

    if (!MH.isHTMLElement(scrollable)) {
      throw ONLY_HTML_ELEMENT_ERR;
    }
    scrollable = toScrollable(scrollable);

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
          logError(ONLY_HTML_ELEMENT_ERR);
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
    scrollable = toScrollable(scrollable);
    const isBody = scrollable === getDefaultScrollingElement();

    const destroyPromise = SmoothScroll.get(scrollable)?.destroy();
    super(scrollable, { id: DUMMY_ID });

    const logger = debug
      ? new debug.Logger({
          name: `SmoothScroll-${formatAsString(scrollable)}`,
          logAtCreation: { config, isBody },
        })
      : null;

    let layers: Map<Element, SmoothScrollLayerState> | null = null;
    this.getComposer = (layer) => layers?.get(layer ?? scrollable)?._composer;

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

    layers = getLayersFrom(scrollable, config);

    (destroyPromise || MH.promiseResolve()).then(async () => {
      if (this.isDestroyed()) {
        return;
      }

      init(this, scrollable, config, layers, logger);
    });
  }
}

/**
 * @interface
 */
export type SmoothScrollConfig = {
  /**
   * The lag for the {@link SmoothScroll.getComposer | root composer}.
   *
   * @defaultValue {@link settings.effectLag}
   */
  lag?: number;

  /**
   * The horizontal lag for the
   * {@link SmoothScroll.getComposer | root composer}.
   *
   * @defaultValue {@link lag}
   */
  lagX?: number;

  /**
   * The vertical lag for the {@link SmoothScroll.getComposer | root composer}.
   *
   * @defaultValue {@link lag}
   */
  lagY?: number;

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

  /**
   * Set this to false to prevent adding the default
   * {@link Transform | translation effect} to the
   * {@link SmoothScroll.getComposer | root composer}.
   *
   * @defaultValue true
   */
  defaultEffects?: boolean;
};

/**
 * Custom lag or depth for a descendant element of the scrollable. Can either
 * be given as an object as the value of the {@link SmoothScrollConfig.layers}
 * map, or it can be set as a string configuration in the
 * `data-lisn-smooth-scroll-layer` data attribute. See {@link getWidgetConfig}
 * for the syntax.
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
   * The lag for {@link SmoothScroll.getComposer | this layer's composer}.
   *
   * @defaultValue undefined // parent lag
   */
  lag?: RawOrRelativeNumber;

  /**
   * The horizontal lag for
   * {@link SmoothScroll.getComposer | this layer's composer}.
   *
   * @defaultValue undefined // parent lagX
   */
  lagX?: RawOrRelativeNumber;

  /**
   * The vertical lag for
   * {@link SmoothScroll.getComposer | this layer's composer}.
   *
   * @defaultValue undefined // parent lagY
   */
  lagY?: RawOrRelativeNumber;

  /**
   * The parallax depth for
   * {@link SmoothScroll.getComposer | this layer's composer}.
   *
   * The special value "auto" is supported here and will result in vertical
   * (or horizontal) depth equal to the scrollable's scroll height (or width)
   * divided by the layer element's height (or width). It will also be
   * dynamically updated when either resizes.
   *
   * Note that if using a relative numerical string, the parent's depth cannot
   * be "auto".
   *
   * @defaultValue 1
   */
  depth?: RawOrRelativeNumber | "auto";

  /**
   * The horizontal parallax depth for
   * {@link SmoothScroll.getComposer | this layer's composer}.
   *
   * @defaultValue {@link depth}
   */
  depthX?: RawOrRelativeNumber | "auto";

  /**
   * The vertical parallax depth for
   * {@link SmoothScroll.getComposer | this layer's composer}.
   *
   * @defaultValue {@link depth}
   */
  depthY?: RawOrRelativeNumber | "auto";

  /**
   * Set this to false to prevent adding the default
   * {@link Transform | translation effect} to
   * {@link SmoothScroll.getComposer | this layer's composer}.
   *
   * @defaultValue true
   */
  defaultEffects?: boolean;
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
const SELECTOR_LAYER = `[data-${PREFIX_LAYER}]`;

const ONLY_HTML_ELEMENT_ERR = MH.usageError(
  "Only HTMLElement is supported for SmoothScroll widget",
);

type SmoothScrollLayerState = {
  _lagX: number;
  _lagY: number;
  _depthX: number | "auto";
  _depthY: number | "auto";
  _composer: FXComposer;
  _children: Set<Element>;
  _parentState: SmoothScrollLayerState | null;
  _scrollData?: ScrollData;
  _sizeData?: SizeData["border"];
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
    depthX: validateRawOrRelativeNumber,
    depthY: validateRawOrRelativeNumber,
  };

const stateUsesAutoDepth = (state: SmoothScrollLayerState) =>
  state._depthX === MC.S_AUTO || state._depthY === MC.S_AUTO;

const toScrollable = (scrollable: HTMLElement) =>
  scrollable === MH.getDocElement() || scrollable === MH.getBody()
    ? getDefaultScrollingElement()
    : scrollable;

const toDepth = (depth: unknown, parentDepth: number | "auto") => {
  depth ??= parentDepth;
  if (depth === MC.S_AUTO) {
    return depth;
  }

  const reference = parentDepth === MC.S_AUTO ? 1 : parentDepth;
  return toNumWithBounds(
    toRawNum(depth, reference, reference),
    { min: 0.01 },
    1,
  );
};

const getParentLayer = (scrollable: Element, layer: Element) => {
  let closest = MH.closestParent(layer, SELECTOR_LAYER) ?? scrollable;
  if (!scrollable.contains(closest)) {
    closest = scrollable;
  }

  return closest !== layer ? closest : null;
};

const getLayersFrom = (
  scrollable: Element,
  rootConfig: SmoothScrollConfig | undefined,
) => {
  // map will include the root scrollable
  const layerMap = MH.newMap<Element, SmoothScrollLayerState>();
  const defaultLag = rootConfig?.lag ?? settings.effectLag;
  const defaultLagX = rootConfig?.lagX ?? defaultLag;
  const defaultLagY = rootConfig?.lagY ?? defaultLag;

  const newComposer = (
    useDefaultEffects: boolean,
    config: {
      lagX: number;
      lagY: number;
      depthX: number;
      depthY: number;
      parent?: FXComposer;
    },
  ) => {
    const trigger = "XXX TODO";
    const composer = new FXComposer(MH.merge(config, { trigger }));
    if (useDefaultEffects) {
      composer.add([
        new Transform({ isAbsolute: true }).translate((data) => ({
          x: data.x,
          y: data.y,
        })),
      ]);
    }

    return composer;
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

      const parentLagX = parentState?._lagX ?? defaultLagX;
      const parentLagY = parentState?._lagY ?? defaultLagY;
      const parentDepthX = parentState?._depthX ?? 1;
      const parentDepthY = parentState?._depthY ?? 1;

      const lagX = toRawNum(
        config?.lagX ?? config?.lag,
        parentLagX,
        parentLagX,
      );
      const lagY = toRawNum(
        config?.lagY ?? config?.lag,
        parentLagY,
        parentLagY,
      );
      const depthX = toDepth(config?.depthX ?? config?.depth, parentDepthX);
      const depthY = toDepth(config?.depthY ?? config?.depth, parentDepthY);
      const useDefaultEffects = config?.defaultEffects ?? true;

      state = {
        _lagX: lagX,
        _lagY: lagY,
        _depthX: depthX,
        _depthY: depthY,
        _composer: newComposer(useDefaultEffects, {
          lagX,
          lagY,
          depthX: depthX === MC.S_AUTO ? 1 : depthX,
          depthY: depthY === MC.S_AUTO ? 1 : depthY,
          parent: parentState?._composer,
        }),
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

  for (const layer of [scrollable, ...layersIterable]) {
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
  layers: Map<Element, SmoothScrollLayerState>,
  logger: LoggerInterface | null,
) => {
  const isBody = scrollable === getDefaultScrollingElement();
  const root = isBody ? MH.getBody() : scrollable;
  const anyIsAutoDepth = !![...layers].find(([__ignored, state]) =>
    stateUsesAutoDepth(state),
  );
  const rootState = layers.get(scrollable);
  if (!rootState) {
    throw MH.bugError("No SmoothScroll state saved for the root");
  }

  const scrollWatcher = anyIsAutoDepth
    ? ScrollWatcher.reuse({ [MC.S_DEBOUNCE_WINDOW]: 0 })
    : null;
  const sizeWatcher =
    anyIsAutoDepth || isBody
      ? SizeWatcher.reuse({ [MC.S_DEBOUNCE_WINDOW]: 0 })
      : null;

  const updateScrollData = (target: Element, scrollData: ScrollData) => {
    rootState._scrollData = scrollData;
    resetAutoDepth();
  };

  const updateSizeData = (target: Element, sizeData: SizeData) => {
    const state = layers.get(target);
    if (!state) {
      throw MH.bugError("No SmoothScroll state saved for layer");
    }
    state._sizeData = sizeData.border;
    resetAutoDepth(state);
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

  const addWatchersAndComposers = () => {
    scrollWatcher?.trackScroll(updateScrollData, { scrollable });
    sizeWatcher?.onResize(updatePropsOnResize, {
      target: innerWrapper,
      threshold: 0,
    });

    for (const [layer, state] of layers) {
      if (stateUsesAutoDepth(state)) {
        sizeWatcher?.onResize(updateSizeData, { target: layer, threshold: 0 });
      }
    }

    // setXXXState("enable");
    // XXX TODO add CSS from composer
  };

  const removeWatchersAndComposers = () => {
    scrollWatcher?.noTrackScroll(updateScrollData, scrollable);
    sizeWatcher?.offResize(updatePropsOnResize, innerWrapper);

    for (const [layer, state] of layers) {
      if (stateUsesAutoDepth(state)) {
        sizeWatcher?.offResize(updateSizeData, layer);
      }
    }

    // setXXXState("disable");
    // XXX TODO clear CSS from composer
  };

  // const setXXXState = (method: "enable" | "disable" | "clear") => {
  //   for (const state of layers.values()) {
  //     state._composer[method]();
  //   }
  // };

  const resetAutoDepth = (state?: SmoothScrollLayerState) => {
    if (!state) {
      for (const state of layers.values()) {
        resetAutoDepth(state);
      }
      return;
    }

    const rootScrollData = rootState._scrollData;
    const layerSize = state._sizeData;
    if (!rootScrollData || !layerSize) {
      throw MH.bugError("No size data saved for root or layer");
    }

    const depthX = rootScrollData[MC.S_SCROLL_WIDTH] / layerSize[MC.S_WIDTH];
    const depthY = rootScrollData[MC.S_SCROLL_HEIGHT] / layerSize[MC.S_HEIGHT];
    state._composer.setDepth({ depthX, depthY });
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

  addWatchersAndComposers();

  widget.onDisable(() => {
    removeWatchersAndComposers();
    removeClasses(root, PREFIX_ROOT);
  });

  widget.onEnable(() => {
    addWatchersAndComposers();
    addClasses(root, PREFIX_ROOT);
  });

  widget.onDestroy(async () => {
    // setXXXState("clear");

    await waitForMutateTime();

    unwrapFn();

    // delete CSS vars from root
    setSizeVars(root, NaN, NaN, true);

    removeClassesNow(root, PREFIX_ROOT);
    delDataNow(root, PREFIX_USES_STICKY);
  });
};
