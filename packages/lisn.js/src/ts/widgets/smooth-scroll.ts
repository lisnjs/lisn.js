/**
 * @module Widgets
 *
 * @categoryDescription SmoothScroll
 * {@link SmoothScroll} creates a highly configurable animated scrolling
 * experience. By default it creates basic smooth scrolling with options for
 * lag duration.
 *
 * However you can define custom effects in an easy yet flexible way. See
 * {@link FXComposer}.
 */

import * as _ from "@lisn/_internal";

import { RawOrRelativeNumber } from "@lisn/globals/types";

import { usageError, bugError } from "@lisn/globals/errors";

import { settings } from "@lisn/globals/settings";

import { supportsSticky } from "@lisn/utils/browser";
import {
  addClasses,
  addClassesNow,
  removeClasses,
  removeClassesNow,
  getData,
  setBooleanDataNow,
  delDataNow,
  getComputedStylePropNow,
  setNumericStyleJsVars,
  setNumericStyleJsVarsNow,
} from "@lisn/utils/css-alter";
import {
  getContentWrapper,
  moveElement,
  moveElementNow,
  tryWrapContentNow,
  unwrapContentNow,
} from "@lisn/utils/dom-alter";
import {
  waitForMeasureTime,
  waitForMutateTime,
} from "@lisn/utils/dom-optimize";
import { isNodeBAfterA } from "@lisn/utils/dom-query";
import { logError } from "@lisn/utils/log";
import { isValidNum, toRawNum } from "@lisn/utils/math";
import { getDefaultScrollingElement } from "@lisn/utils/scroll";
import { Tweener } from "@lisn/utils/tween";
import {
  validateNonNegNumber,
  validateRawOrRelativeNumber,
} from "@lisn/utils/validation";

import { FXComposer } from "@lisn/effects/fx-composer";
import { FXScrollTrigger } from "@lisn/effects/fx-trigger";
import { Transform } from "@lisn/effects/transform";

import { DOMWatcher, MutationOperation } from "@lisn/watchers/dom-watcher";
import { ScrollWatcher, ScrollData } from "@lisn/watchers/scroll-watcher";
import { SizeWatcher, SizeData } from "@lisn/watchers/size-watcher";

import {
  Widget,
  WidgetConfigValidatorObject,
  registerWidget,
  getWidgetConfig,
} from "@lisn/widgets/widget";

/**
 * Configures the given element as a {@link SmoothScroll} widget.
 *
 * The SmoothScroll widget creates a highly configurable animated scrolling
 * experience. By default it creates basic smooth scrolling with options for lag
 * duration.
 *
 * However you can define custom effects in an easy yet flexible way. See
 * {@link FXComposer}
 *
 * It supports scroll in any direction as well as using a custom scrolling
 * element that may only takes up part of the page, all while preserving
 * **native** scrolling behaviour (i.e. it does not disable native scroll and
 * does not use fake scrollbars).
 *
 * Any descendant element of the scrollable can define custom lag duration and
 * effects, as well as a parallax depth. Such child elements are referred to
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
 *     <!-- YOUR CONTENT -->
 *   </div>
 * </body>
 * ```
 *
 * ```html
 * <!-- If using a custom scrollable -->
 * <div class="scrollable"><!-- Element you instantiate as SmoothScroll -->
 *   <div class="lisn-smooth-scroll__pin"><!-- Required outer wrapper; will be created if missing -->
 *     <div class="lisn-smooth-scroll__content"><!-- Required inner wrapper; will be created if missing -->
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
 *
 * @category SmoothScroll
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

    if (!_.isHTMLElement(scrollable)) {
      throw ONLY_HTML_ELEMENT_ERR;
    }
    scrollable = toScrollable(scrollable);

    const instance = super.get(scrollable, DUMMY_ID);
    if (_.isInstanceOf(instance, SmoothScroll)) {
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
        if (_.isHTMLElement(element)) {
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

    let layers: Map<Element, SmoothScrollLayerState> | null = null;

    this.getComposer = (layer) => {
      let key: Element = scrollable;
      if (layer && !isRootLayer(scrollable, layer)) {
        key = layer;
      }
      return layers?.get(key)?._composer;
    };

    // TODO Fallback to using scroll gestures:
    // Position the contentWrapper as fixed, listen for gestures and initiate
    // scrolling on the scrollable
    if (!isBody && !supportsSticky()) {
      logError(
        "SmoothScroll on elements other than the document relies on " +
          "position: sticky, but this browser does not support sticky.",
      );
      return;
    }

    layers = getLayersFrom(scrollable, config, new FXScrollTrigger(scrollable));

    for (const layer of layers.keys()) {
      if (!scrollable.contains(layer)) {
        throw usageError("SmoothScroll's layers must be its descendants");
      }
    }

    (destroyPromise || _.promiseResolve()).then(async () => {
      if (this.isDestroyed()) {
        return;
      }

      init(this, scrollable, config, layers);
    });
  }
}

/**
 * @interface
 *
 * @category SmoothScroll
 */
export type SmoothScrollConfig = {
  /**
   * The {@link FXComposerConfig.tweener | tweener} for
   * {@link SmoothScroll.getComposer | the root composer}.
   *
   * @defaultValue {@link FXComposer} default
   */
  tweener?: Tweener | { [K in "x" | "y"]: Tweener };

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
 *
 * @category SmoothScroll
 */
export type SmoothScrollLayerConfig = {
  /**
   * The {@link FXComposerConfig.tweener | tweener} for
   * {@link SmoothScroll.getComposer | this layer's composer}.
   *
   * @defaultValue The main widget's
   * {@link SmoothScrollConfig.tweener | tweener} setting
   */
  tweener?: Tweener | { [K in "x" | "y"]: Tweener };

  /**
   * The lag for {@link SmoothScroll.getComposer | this layer's composer}.
   *
   * It can be relative to the parent layer's lag.
   *
   * @defaultValue undefined // parent lag
   */
  lag?: RawOrRelativeNumber;

  /**
   * The horizontal lag for
   * {@link SmoothScroll.getComposer | this layer's composer}.
   *
   * It can be relative to the parent layer's lagX.
   *
   * @defaultValue undefined // parent lagX
   */
  lagX?: RawOrRelativeNumber;

  /**
   * The vertical lag for
   * {@link SmoothScroll.getComposer | this layer's composer}.
   *
   * It can be relative to the parent layer's lagY.
   *
   * @defaultValue undefined // parent lagY
   */
  lagY?: RawOrRelativeNumber;

  /**
   * The parallax depth for
   * {@link SmoothScroll.getComposer | this layer's composer}.
   *
   * It can be relative to the parent layer's depth.
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
   * It can be relative to the parent layer's depthX.
   *
   * @defaultValue {@link depth}
   */
  depthX?: RawOrRelativeNumber | "auto";

  /**
   * The vertical parallax depth for
   * {@link SmoothScroll.getComposer | this layer's composer}.
   *
   * It can be relative to the parent layer's depthY.
   *
   * @defaultValue {@link depth}
   */
  depthY?: RawOrRelativeNumber | "auto";

  /**
   * Set this to false to prevent adding the default
   * {@link Transform | translation effect} to
   * {@link SmoothScroll.getComposer | this layer's composer}.
   *
   * @defaultValue The main widget's
   * {@link SmoothScrollConfig.defaultEffects | defaultEffects} setting
   */
  defaultEffects?: boolean;
};

// --------------------

const WIDGET_NAME = "smooth-scroll";
const PREFIXED_NAME = _.prefixName(WIDGET_NAME);
// Only one SmoothScroll widget per element is allowed, but Widget requires a
// non-blank ID.
const DUMMY_ID = PREFIXED_NAME;
const PREFIX_ROOT = `${PREFIXED_NAME}__root`;
const PREFIX_OVERFLOW = `${PREFIXED_NAME}__overflow`;
const PREFIX_PIN_WRAPPER = `${PREFIXED_NAME}__pin`;
const PREFIX_CONTENT_WRAPPER = `${PREFIXED_NAME}__content`;
const PREFIX_USES_STICKY = _.prefixName("uses-sticky");

const PREFIX_LAYER = `${PREFIXED_NAME}-layer`;
const SELECTOR_LAYER = `[data-${PREFIX_LAYER}]`;

const ONLY_HTML_ELEMENT_ERR = usageError(
  "Only HTMLElement is supported for SmoothScroll widget",
);

type SmoothScrollLayerState = {
  _lagX: number;
  _lagY: number;
  _depthX: number | "auto";
  _depthY: number | "auto";
  _composer: FXComposer;
  _children: Set<Element>;
  _defaultEffects: boolean;
  _scrollData?: ScrollData;
  _sizeData?: SizeData["border"];
};

let mainWidget: SmoothScroll | null = null;

const validateDepth = (key: string, value: unknown) =>
  value === _.S_AUTO ? value : validateRawOrRelativeNumber(key, value);

const toDepth = (value: unknown, ref: number | "auto") => {
  const refNum = ref === _.S_AUTO ? 1 : ref;
  return value === _.S_AUTO ? value : toRawNum(value, refNum, refNum);
};

// For HTML API only
const configValidator: WidgetConfigValidatorObject<SmoothScrollConfig> = {
  lag: validateNonNegNumber,
  lagX: validateNonNegNumber,
  lagY: validateNonNegNumber,
};

// For HTML API only
const layerConfigValidator: WidgetConfigValidatorObject<SmoothScrollLayerConfig> =
  {
    lag: validateRawOrRelativeNumber,
    lagX: validateRawOrRelativeNumber,
    lagY: validateRawOrRelativeNumber,
    depth: validateDepth,
    depthX: validateDepth,
    depthY: validateDepth,
  };

const stateUsesAutoDepth = (state: SmoothScrollLayerState) =>
  state._depthX === _.S_AUTO || state._depthY === _.S_AUTO;

const toScrollable = (scrollable: HTMLElement) =>
  scrollable === _.getDocElement() || scrollable === _.getBody()
    ? getDefaultScrollingElement()
    : scrollable;

const isRootLayer = (scrollable: HTMLElement, layer: Element) =>
  layer === _.getDocElement() || layer === _.getBody()
    ? scrollable === getDefaultScrollingElement()
    : layer === scrollable;

const getParentLayer = (scrollable: HTMLElement, layer: Element) => {
  if (layer === scrollable) {
    return null;
  }

  let closestLayer: Element | null = null;
  const parent = layer.parentElement;
  if (parent) {
    closestLayer = _.closestParent(parent, SELECTOR_LAYER);
    if (!closestLayer || !scrollable.contains(closestLayer)) {
      closestLayer = scrollable;
    }
  }

  return closestLayer ?? scrollable;
};

const getLayersFrom = (
  scrollable: HTMLElement,
  rootConfig: SmoothScrollConfig | undefined,
  trigger: FXScrollTrigger,
) => {
  // map will include the root scrollable
  const layerMap = _.createMap<Element, SmoothScrollLayerState>();
  const defaultLag = rootConfig?.lag ?? settings.effectLag;

  const getLayerConfig = (layer: Element) => {
    let config: SmoothScrollLayerConfig | null | undefined;
    // let parseEffectsAttr = false;

    if (layer === scrollable) {
      config = _.merge(rootConfig, {
        // do not accept depth for root
        depth: 1,
        depthX: 1,
        depthY: 1,
        depthZ: 1,
      });
    } else if (_.isArray(inputLayers)) {
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

      parentState?._children.add(layer);

      const parentLagX = parentState?._lagX ?? defaultLag;
      const parentLagY = parentState?._lagY ?? defaultLag;
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

      state = {
        _lagX: lagX,
        _lagY: lagY,
        _depthX: depthX,
        _depthY: depthY,
        _defaultEffects:
          config?.defaultEffects ?? parentState?._defaultEffects ?? true,
        _composer: new FXComposer([], {
          trigger,
          lagX,
          lagY,
          lagZ: 0,
          negateParent: true,
          depthX: depthX === _.S_AUTO ? 1 : depthX,
          depthY: depthY === _.S_AUTO ? 1 : depthY,
          tweener: config?.tweener ?? rootConfig?.tweener,
        }),
        _children: _.createSet(),
      };

      layerMap.set(layer, state);
    }

    return state;
  };

  // ----------

  const inputLayers = rootConfig?.layers ?? [
    ..._.querySelectorAll(scrollable, SELECTOR_LAYER),
  ];

  const layersIterable = _.isArray(inputLayers)
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
) => {
  const getStateOf = (layer: Element) => {
    const state = layers.get(layer);
    /* istanbul ignore next */
    if (!state) {
      throw bugError("No SmoothScroll state saved for layer");
    }
    return state;
  };

  const isDoc = scrollable === getDefaultScrollingElement();
  const root = isDoc ? _.getBody() : scrollable;

  const anyUseAutoDepth = !![...layers].find(([__ignored, state]) =>
    stateUsesAutoDepth(state),
  );

  const rootState = getStateOf(scrollable);

  const sizeWatcher = SizeWatcher.reuse();
  // we need scroll width/height measurements for "auto" parallax
  const scrollWatcher = anyUseAutoDepth ? ScrollWatcher.reuse() : null;

  const domWatcher = DOMWatcher.create({
    root,
    // only direct children
    subtree: false,
  });

  // ----------

  // If the content is resized, update the size of body or the dummy overflow to
  // match its size.
  // Only applies when using the document scrolling element.
  const updatePropsOnResize = (target: Element, sizeData: SizeData) => {
    setSizeVars(root, sizeData.border[_.S_WIDTH], sizeData.border[_.S_HEIGHT]);
  };

  // ----------

  // If any elements are dynamically added into the root, move them into the
  // content wrapper.
  const moveNewElements = (operation: MutationOperation) => {
    const child = _.currentTargetOf(operation);
    if (child !== outerWrapper && child !== overflowEl) {
      // Move this child into the contentWrapper
      moveElement(child, {
        to: contentWrapper,
        position: isNodeBAfterA(contentWrapper, child) ? "append" : "prepend",
        ignoreMove: true,
      });
    }
  };

  // ----------
  // For "auto" parallax

  const updateSizeData = (target: Element, sizeData: SizeData) => {
    const state = getStateOf(target);
    state._sizeData = sizeData.border;
    resetAutoDepth(state);
  };

  const updateScrollData = (target: Element, scrollData: ScrollData) => {
    rootState._scrollData = scrollData;
    resetAutoDepth();
  };

  // ----------

  const addWatchers = () => {
    scrollWatcher?.trackScroll(
      updateScrollData,
      _.fastWatcherConf({
        scrollable,
      }),
    );

    sizeWatcher.onResize(
      updatePropsOnResize,
      _.fastWatcherConf({
        target: contentWrapper,
      }),
    );

    domWatcher.onMutation(moveNewElements, { categories: [_.S_ADDED] });

    for (const [layer, state] of layers) {
      if (stateUsesAutoDepth(state)) {
        sizeWatcher.onResize(
          updateSizeData,
          _.fastWatcherConf({ target: layer }),
        );
      }

      layers.get(layer)?._composer.resume();
    }
  };

  const removeWatchers = () => {
    scrollWatcher?.noTrackScroll(updateScrollData, scrollable);
    sizeWatcher.offResize(updatePropsOnResize, contentWrapper);
    domWatcher.offMutation(moveNewElements);

    for (const [layer, state] of layers) {
      if (stateUsesAutoDepth(state)) {
        sizeWatcher.offResize(updateSizeData, layer);
      }

      layers.get(layer)?._composer.pause(true);
    }
  };

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
      return; // watchers haven't called us yet
    }

    const maxScrollLeft =
      rootScrollData[_.S_SCROLL_WIDTH] - rootScrollData[_.S_CLIENT_WIDTH];
    const maxScrollTop =
      rootScrollData[_.S_SCROLL_HEIGHT] - rootScrollData[_.S_CLIENT_HEIGHT];

    const maxLayerLeft =
      layerSize[_.S_WIDTH] - rootScrollData[_.S_CLIENT_WIDTH];
    const maxLayerTop =
      layerSize[_.S_HEIGHT] - rootScrollData[_.S_CLIENT_HEIGHT];

    // If it's smaller than the viewport, keep it fixed
    const depthX =
      maxLayerLeft <= 0
        ? _.NUMBER.MAX_SAFE_INTEGER
        : maxScrollLeft / maxLayerLeft;
    const depthY =
      maxLayerTop <= 0 ? _.NUMBER.MAX_SAFE_INTEGER : maxScrollTop / maxLayerTop;

    state._composer.setDepth({ depthX, depthY });
  };

  const setComposerElements = (layer: Element = scrollable) => {
    const state = getStateOf(layer);

    state._composer.setElements(layer === scrollable ? contentWrapper : layer);
    if (state._defaultEffects) {
      state._composer.add(
        new Transform().translate((params) => ({
          x: -params.x,
          y: -params.y,
        })),
      );
    }

    for (const layer of state._children) {
      setComposerElements(layer);
    }
  };

  // SETUP ------------------------------

  let initialContentWidth = 0,
    initialContentHeight = 0;
  const spacings = { top: 0, left: 0, bottom: 0, right: 0 };

  if (isDoc) {
    await waitForMeasureTime();
    initialContentWidth = scrollable[_.S_SCROLL_WIDTH];
    initialContentHeight = scrollable[_.S_SCROLL_HEIGHT];

    // Copy over the margins and paddings from body to match since the container
    // will be positioned as fixed.
    for (const side of [_.S_TOP, _.S_RIGHT, _.S_BOTTOM, _.S_LEFT] as const) {
      for (const key of [`margin-${side}`, `padding-${side}`]) {
        const value = _.parseFloat(getComputedStylePropNow(root, key));
        if (isValidNum(value)) {
          spacings[side] += value;
        }
      }
    }
  }

  await waitForMutateTime();
  // Wrap the contents in a fixed/sticky positioned content wrapper.
  // If we're using a custom scrollable, the content wrapper also needs to be
  // inside a sticky "pin" wrapper.
  // [TODO v2]: Better way to centrally manage wrapping and wrapping of elements
  const {
    wrappers,
    unwrapFn,
  }: {
    wrappers: { c: HTMLElement; p?: HTMLElement };
    unwrapFn: () => void;
  } = createWrappersNow(
    root,
    isDoc
      ? [["c", [PREFIX_CONTENT_WRAPPER], [_.PREFIX_WRAPPER]]]
      : [
          ["p", [PREFIX_PIN_WRAPPER], [_.PREFIX_WRAPPER]],
          ["c", [PREFIX_CONTENT_WRAPPER], [_.PREFIX_WRAPPER]],
        ],
  );

  const contentWrapper = wrappers.c;
  const outerWrapper = wrappers.p ?? contentWrapper;

  let overflowEl: Element | null = null;
  if (isDoc) {
    // Set its size now to prevent initial layout shifts
    setSizeVars(root, initialContentWidth, initialContentHeight, true);
    setNumericStyleJsVarsNow(contentWrapper, spacings, {
      _units: "px",
      _numDecimal: 2,
    });
  } else {
    setBooleanDataNow(root, PREFIX_USES_STICKY);
    overflowEl = _.createElement("div");
    addClassesNow(overflowEl, PREFIX_OVERFLOW);
    moveElementNow(overflowEl, { to: root });

    // Don't let ScrollWatcher wrap its children, the pin wrapper and the dummy
    // overflow
    setBooleanDataNow(root, _.PREFIX_NO_WRAP);
  }

  addClassesNow(root, PREFIX_ROOT);
  addWatchers();
  setComposerElements();

  widget.onDisable(() => {
    removeWatchers();
    removeClasses(root, PREFIX_ROOT);
  });

  widget.onEnable(() => {
    addWatchers();
    addClasses(root, PREFIX_ROOT);
  });

  widget.onDestroy(async () => {
    for (const state of layers.values()) {
      state._composer.destroy();
    }

    await waitForMutateTime();

    if (overflowEl) {
      moveElementNow(overflowEl); // remove
    }
    unwrapFn();

    // delete CSS vars from root
    setSizeVars(root, NaN, NaN, true);

    removeClassesNow(root, PREFIX_ROOT);
    delDataNow(root, PREFIX_USES_STICKY);
  });
};

_.brandClass(SmoothScroll, "SmoothScroll");
