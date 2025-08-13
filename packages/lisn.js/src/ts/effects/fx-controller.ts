/**
 * @module Effects/FXController
 *
 * @since v1.3.0
 */

// XXX
// TODO support critically damped or plain quadratic or custom interpolation **iterator**
// TODO generalise:
// - ScrollOffsets => generic
// - remove scrollData
// - manual call interpolate
// - optionally enable scroll tracking

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { settings } from "@lisn/globals/settings";

import {
  AtLeastOne,
  OnlyOneOf,
  ScrollTarget,
  View,
  ViewTarget,
  RawOrRelativeNumber,
  CommaSeparatedStr,
} from "@lisn/globals/types";

import { newAnimationFrameIterator } from "@lisn/utils/animations";
import { setStyleProp, delStyleProp } from "@lisn/utils/css-alter";
import {
  newCriticallyDampedIterator,
  toNum,
  toRawNum,
  RawNumberCalculator,
} from "@lisn/utils/math";
import { deepCopy } from "@lisn/utils/misc";
import { getOppositeViews } from "@lisn/utils/views";

import {
  CallbackHandler,
  Callback,
  wrapCallback,
  addNewCallbackToSet,
  addNewCallbackToMap,
  invokeCallbackSet,
} from "@lisn/modules/callback";

import {
  Effect,
  EffectsList,
  EffectRegistry,
  ScrollOffsets,
} from "@lisn/effects/effect";

import {
  ScrollWatcher,
  ScrollData,
  OnScrollHandler,
  OnScrollCallback,
} from "@lisn/watchers/scroll-watcher";
import {
  ViewWatcher,
  OnViewCallback,
  OnViewHandler,
} from "@lisn/watchers/view-watcher";

export type EffectRange = OnlyOneOf<EffectBoundedRange, EffectWhileRange>;

// TODO ALL and ANY multi-conditions
export type EffectBoundedRange = {
  when: ViewReference | ScrollReference;
  until: ViewReference | ScrollReference;
};

export type EffectWhileRange = {
  while: ViewReference;
};

export type ViewReference = {
  views: CommaSeparatedStr<View> | View[];
  target: ViewTarget;
};

export type ScrollReference = AtLeastOne<{
  top: number | RawOrRelativeNumber;
  left: number | RawOrRelativeNumber;
}>;

/**
 * {@link FXController} represents a set of effects (transforms or styles) that
 * can be applied to an element when certain scroll-based conditions match. A
 * condition could be a range of horizontal/vertical scroll offset values or the
 * position of one or more elements relative to the viewport.
 */
export class FXController {
  /**
   * Adds one or more effects.
   *
   * @returns The same {@link FXController} instance.
   */
  readonly add: <TL extends readonly (keyof EffectRegistry)[]>(
    effects: EffectsList<TL>,
    range?: EffectRange,
  ) => FXController;

  /**
   * Temporarily disables the controller. Scroll and view tracking is disabled,
   * effects are not being updated and no {@link onAnimation} callbacks are
   * called.
   */
  readonly disable: () => void;

  /**
   * Re-enables the controller. Scroll and view tracking is resumed and almost
   * immediately afterwards, all effects will be updated to match the current
   * scroll offsets without animation (i.e. instantly).
   */
  readonly enable: () => void;

  /**
   * Calls the given handler when the controller is disabled.
   */
  readonly onDisable: (handler: FXControllerStateHandler) => void;

  /**
   * Calls the given handler when the controller is enabled.
   */
  readonly onEnable: (handler: FXControllerStateHandler) => void;

  /**
   * Returns true if the controller is disabled.
   */
  readonly isDisabled: () => boolean;

  /**
   * Removes all previously added effects.
   */
  readonly clear: () => void;

  /**
   * Calls the given handler when the controller is cleared.
   */
  readonly onClear: (handler: FXControllerStateHandler) => void;

  /**
   * Calls the given handler whenever the controller animates as a result of
   * scroll event. The handler is called at every animation frame **after** all
   * effects have been applied, such that calling {@link toCss} or
   * {@link getComposition} will reflect the latest effect states.
   *
   * @param depth  If given, the {@link ScrollOffsets} in the
   *               {@link AnimationFrameData} passed to the callback will be
   *               re-scaled to this depth. Otherwise the depth will be that of
   *               this controller.
   * @param depthY If given, this will be the vertical depth. If not given,
   *               `depth` will be used for both directions.
   */
  readonly onAnimation: (
    handler: OnAnimationHandler,
    depth?: number,
    depthY?: number,
  ) => void;

  /**
   * Removes a previously added handler.
   */
  readonly offAnimation: (handler: OnAnimationHandler) => void;

  /**
   * Will continually apply the latest {@link toCss | CSS} to the given
   * elements, except while the controller is disabled.
   *
   * @param clearOnDisable If true, when the controller is disabled, the CSS
   *                       properties will be cleared and reapplied on enabling
   *                       the controller.
   * @param negate         See {@link toCss}
   */
  readonly animate: (
    elements: Element[],
    clearOnDisable?: boolean,
    negate?: FXController,
  ) => void;

  /**
   * Will clear the relevant {@link toCss | CSS} properties from the given
   * elements and stop animating them.
   */
  readonly deanimate: (elements: Element[]) => void;

  /**
   * Returns an object with the CSS properties and their values to set for the
   * element being animated.
   *
   * @param negate If given, then all effects added on this controller that
   *               support negation (see {@link Effect.export}) will receive the
   *               combined effect of their respective type as the one to
   *               negate.
   */
  readonly toCss: (negate?: FXController) => Record<string, string>;

  /**
   * Returns the combined effect for the given type.
   */
  readonly getComposition: <T extends keyof EffectRegistry>(
    type: T,
  ) => Effect<T> | undefined;

  /**
   * Returns the controller's **effective** configuration.
   *
   * If `undefined`, it means it will use the default {@link ScrollWatcher}
   * scrolling element.
   */
  readonly getConfig: () => FXControllerEffectiveConfig;

  /**
   * Updates the controller's {@link FXControllerConfig.lag | lag}
   */
  readonly setLag: (
    lag: RawOrRelativeNumber,
    lagY?: RawOrRelativeNumber,
  ) => void;

  /**
   * Updates the controller's {@link FXControllerConfig.depth | depth}
   *
   * Note that this will result in the effects being rescaled to this depth.
   */
  readonly setDepth: (
    depth: RawOrRelativeNumber,
    depthY?: RawOrRelativeNumber,
  ) => void;

  constructor(config?: FXControllerConfig) {
    const parent = config?.parent;
    const parentScrollable = parent?.getConfig().scrollable;
    const scrollable = config?.scrollable ?? parentScrollable;
    const defaultNegate = config?.negate;

    const effectiveConfig: FXControllerEffectiveConfig = {
      scrollable,
      parent,
      negate: defaultNegate,
      disabled: config?.disabled ?? false,
      lagX: 0, // updated below in setLag
      lagY: 0, // updated below in setLag
      depthX: 1, // updated below in setDepth
      depthY: 1, // updated below in setDepth
    };

    const useParent = parent && parentScrollable === scrollable;

    const scrollWatcher = ScrollWatcher.reuse({ [MC.S_DEBOUNCE_WINDOW]: 0 });
    const viewWatcher = ViewWatcher.reuse();
    const effectsMap: EffectsMap = new Map();
    const compositionsMap: CompositionMap = new Map();

    const scrollConditionCallbacks = MH.newSet<OnScrollCallback>();
    const viewConditionCallbacks = MH.newMap<
      OnViewCallback,
      [ViewTarget, CommaSeparatedStr<View> | View[]]
    >();
    const animationCallbacks = MH.newMap<
      OnAnimationHandler,
      [OnAnimationCallback, number | undefined, number | undefined]
    >();

    const enableCallbacks = MH.newSet<FXControllerStateCallback>();
    const disableCallbacks = MH.newSet<FXControllerStateCallback>();
    const clearCallbacks = MH.newSet<FXControllerStateCallback>();

    const animatedElements = MH.newMap<
      Element,
      [OnAnimationHandler, Set<Element>]
    >();

    const currentFrameData: Partial<AnimationFrameData> = {};
    let isFirstTimeAfterEnable = true;

    // ----------

    const isDisabled = () => effectiveConfig.disabled;
    const setDisabled = (d: boolean) => (effectiveConfig.disabled = d);

    // ----------

    const disable = () => {
      setDisabled(true);
      invokeCallbackSet(disableCallbacks, this);

      for (const cbk of scrollConditionCallbacks) {
        scrollWatcher.offScroll(cbk, scrollable);
      }

      for (const [cbk, [target]] of viewConditionCallbacks) {
        viewWatcher.offView(target, cbk);
      }

      if (useParent) {
        parent.offAnimation(onAnimationFrame);
      } else {
        scrollWatcher.offScroll(onScroll, scrollable);
      }
    };

    // ----------

    const enable = () => {
      isFirstTimeAfterEnable = true;
      setDisabled(false);
      invokeCallbackSet(enableCallbacks, this);

      for (const cbk of scrollConditionCallbacks) {
        scrollWatcher.onScroll(cbk, { scrollable });
      }

      for (const [cbk, [target, views]] of viewConditionCallbacks) {
        viewWatcher.onView(target, cbk, { views });
      }

      if (useParent) {
        const { depthX, depthY } = effectiveConfig;
        parent.onAnimation(onAnimationFrame, depthX, depthY);
      } else {
        scrollWatcher.onScroll(onScroll, { scrollable });
      }
    };

    // ----------

    const onDisable = (handler: FXControllerStateHandler) =>
      addNewCallbackToSet(handler, disableCallbacks);

    const onEnable = (handler: FXControllerStateHandler) =>
      addNewCallbackToSet(handler, enableCallbacks);

    // ----------

    const clear = () => {
      invokeCallbackSet(clearCallbacks, this);

      for (const cbk of [
        ...scrollConditionCallbacks,
        ...viewConditionCallbacks.keys(),
      ]) {
        MH.remove(cbk);
      }

      effectsMap.clear();
    };

    // ----------

    const onClear = (handler: FXControllerStateHandler) =>
      addNewCallbackToSet(handler, clearCallbacks);

    // ----------

    const animate = (
      elements: Element[],
      clearOnDisable?: boolean,
      negate?: FXController,
    ) => {
      // Use a single callback for all elements for performance gain.
      // Clean it up when all have been deanimated.
      const allRelatedElements = MH.newSet(elements);
      const animCallback = wrapCallback(() =>
        applyCss(allRelatedElements, false, negate),
      );

      const data: [OnAnimationHandler, Set<Element>] = [
        animCallback,
        allRelatedElements,
      ];

      for (const element of elements) {
        animatedElements.set(element, data);
      }

      animCallback.invoke(); // set the CSS now
      onAnimation(animCallback);

      if (clearOnDisable) {
        const disableCbk = wrapCallback(() =>
          applyCss(allRelatedElements, true),
        );
        animCallback.onRemove(disableCbk.remove);
      }
    };

    // ----------

    const deanimate = (elements: Element[]) => {
      applyCss(elements, true); // clear the CSS

      for (const element of elements) {
        const [callback, allRelatedElements] =
          animatedElements.get(element) ?? [];

        MH.deleteKey(animatedElements, element);
        MH.deleteKey(allRelatedElements, element);
        if (callback && MH.sizeOf(allRelatedElements) === 0) {
          offAnimation(callback);
        }
      }
    };

    // ----------

    const setLag = (lag: RawOrRelativeNumber, lagY?: RawOrRelativeNumber) => {
      const defaultLag = settings.effectLag;
      const parentConfig = parent?.getConfig();
      const parentLagX = parentConfig?.lagX ?? defaultLag;
      const parentLagY = parentConfig?.lagY ?? defaultLag;
      effectiveConfig.lagX = toRawNum(lag, parentLagX, parentLagX);
      effectiveConfig.lagY = toRawNum(lagY ?? lag, parentLagY, parentLagY);
    };

    // ----------

    const setDepth = (
      depth: RawOrRelativeNumber,
      depthY?: RawOrRelativeNumber,
    ) => {
      const parentConfig = parent?.getConfig();
      const parentDepthX = parentConfig?.depthX ?? 1;
      const parentDepthY = parentConfig?.depthY ?? 1;
      const newDepthX = toRawNum(depth, parentDepthX, parentDepthX);
      const newDepthY = toRawNum(depthY ?? depth, parentDepthY, parentDepthY);

      if (
        newDepthX !== effectiveConfig.depthX ||
        newDepthY !== effectiveConfig.depthY
      ) {
        effectiveConfig.depthX = newDepthX;
        effectiveConfig.depthY = newDepthY;

        rescaleDataInPlace(currentFrameData, newDepthX, newDepthY);
        interpolate(); // re-apply effects and call callbacks
      }
    };

    // ----------

    const toCss = (negate?: FXController) => {
      negate ??= defaultNegate;
      const css: Record<string, string> = {};
      for (const [type, effect] of compositionsMap) {
        const referenceEffect = negate?.getComposition(type);
        MH.assign(css, effect.toCss(referenceEffect));
      }
      return css;
    };

    // ----------

    const onAnimation = (
      handler: OnAnimationHandler,
      depth?: number,
      depthY?: number,
    ) => addNewCallbackToMap(handler, animationCallbacks, [depth, depthY]);

    // ----------

    const offAnimation = (handler: OnAnimationHandler) => {
      const cbk = (animationCallbacks?.get(handler) ?? [])[0];
      MH.remove(cbk);
    };

    // ----------

    const onScroll: OnScrollHandler = (e, scrollData) => {
      const { depthX, depthY } = effectiveConfig;
      currentFrameData.target = {
        isAbsolute: true,
        depthX,
        depthY,
        x: scrollData[MC.S_SCROLL_LEFT] / depthX,
        nx: scrollData[MC.S_SCROLL_LEFT_FRACTION],
        y: scrollData[MC.S_SCROLL_TOP] / depthY,
        ny: scrollData[MC.S_SCROLL_TOP_FRACTION],
      };
      currentFrameData.scroll = scrollData;

      interpolate(); // don't await
    };

    // ----------

    const onAnimationFrame = (data: AnimationFrameData) => {
      MH.assign(currentFrameData, data);

      applyEffects(data);
      callCallbacks(data);
    };

    // ----------

    const callCallbacks = (data: AnimationFrameData) => {
      for (const [cbk, thisDepth, thisDepthY] of animationCallbacks.values()) {
        const thisData = deepCopy(data);
        rescaleDataInPlace(thisData, thisDepth, thisDepthY);
        cbk.invoke(thisData, this);
      }
    };

    // ----------

    const applyCss = (
      elements: Element[] | Set<Element>,
      clear: boolean,
      negate?: FXController,
    ) => {
      const css = toCss(negate);
      for (const prop in css) {
        for (const element of elements) {
          if (clear) {
            setStyleProp(element, prop, css[prop]);
          } else {
            delStyleProp(element, prop);
          }
        }
      }
    };

    // ----------

    let isAnimating = false;
    const interpolate = async () => {
      if (isAnimating) {
        return;
      }

      isAnimating = true;

      const iterators: {
        x?: ReturnType<typeof newCriticallyDampedIterator>;
        y?: ReturnType<typeof newCriticallyDampedIterator>;
      } = {};
      for await (const { sinceLast: dt } of newAnimationFrameIterator()) {
        const scrollData = currentFrameData.scroll;
        const targetOffsets = currentFrameData.target;
        if (!scrollData || !targetOffsets) {
          throw MH.bugError("No target offsets to interpolate to");
        }

        const { lagX, lagY } = effectiveConfig;
        const prevOffsets = currentFrameData.current;
        const currentOffsets: ScrollOffsets = MH.copyObject(
          isFirstTimeAfterEnable || !prevOffsets ? targetOffsets : prevOffsets,
        );

        for (const direction of ["x", "y"] as const) {
          const lag = direction === "x" ? lagX : lagY;
          const target = targetOffsets[direction];
          const current = currentOffsets[direction];
          let done = current === target;

          if (!done) {
            const state = {
              l: current,
              lTarget: target,
              lag,
              dt,
            };

            iterators[direction] ??= newCriticallyDampedIterator(state);

            const result = iterators[direction].next(state);
            currentOffsets[direction] = result.value.l;
            currentOffsets[`n${direction}`] *= 1 + result.value.dlFr;
            done = !!result.done;
          }

          if (done) {
            delete iterators[direction]; // will need to be re-created if we're not done on the next loop
          }
        }

        const incrementalOffsets = getIncremental(currentOffsets, prevOffsets);

        // onAnimationFrame will update currentFrameData
        onAnimationFrame({
          scroll: scrollData,
          current: currentOffsets,
          sinceLast: incrementalOffsets,
          target: targetOffsets,
        });

        if (!iterators.x && !iterators.y) {
          isAnimating = false;
          break;
        }
      }
    };

    // ----------

    const applyEffects = (data: AnimationFrameData) => {
      for (const [type, entries] of effectsMap) {
        const toCompose: Effect<typeof type>[] = [];

        for (const entry of entries) {
          if (entry._state !== null) {
            const effect = entry._effect;
            toCompose.push(
              effect.apply(
                effect.isAbsolute() ? data.current : data.sinceLast,
              ) as Effect<typeof type>,
            );
          }
        }

        const composed = toCompose[0]?.toComposition(...toCompose.slice(1));
        if (composed) {
          compositionsMap.set(type, composed);
        } else {
          compositionsMap.delete(type);
        }
      }

      return this;
    };

    // ----------

    const newEffectState = (range: EffectRange | undefined) => {
      const state: EffectState = {
        _activeSince: null,
      };

      const addScrollCondition = (
        activate: boolean,
        { top, left }: ScrollReference,
      ) => {
        const handler: OnScrollHandler = (e__ignored, scrollData) => {
          // It's active if either this condition activates the effect and the
          // current offset is larger than the reference, or this condition
          // deactivates the effect but the current offset is still smaller than
          // the reference.

          const leftIsPastRef =
            offsetIsPastRef(left, scrollData, "x") ?? activate;
          const topIsPastRef =
            offsetIsPastRef(top, scrollData, "y") ?? activate;
          const isActive = activate === (leftIsPastRef && topIsPastRef);

          state._activeSince = isActive ? scrollData : null;
        };

        const callback = addNewCallbackToSet(handler, scrollConditionCallbacks);

        if (!isDisabled()) {
          scrollWatcher.onScroll(callback, { scrollable });
        }
      };

      const addViewCondition = (
        activate: boolean,
        { views, target }: ViewReference,
      ) => {
        const handler: OnViewHandler = async () => {
          state._activeSince = activate
            ? (currentFrameData.scroll ??
              (await scrollWatcher.fetchCurrentScroll(scrollable)))
            : null;
        };

        const callback = addNewCallbackToMap(
          handler,
          viewConditionCallbacks,
          [target, views],
          true,
        );

        if (!isDisabled()) {
          viewWatcher.onView(target, callback, { views });
        }
      };
      // See note above about the scrollConditionCallbacks

      const addCondition = (
        activate: boolean,
        ref: ScrollReference | ViewReference | undefined,
      ) => {
        if (ref) {
          if ("target" in ref) {
            addViewCondition(true, ref);
          } else {
            addScrollCondition(true, ref);
          }
        }
      };

      if (range) {
        if (range.while) {
          addViewCondition(true, range.while);
          const { views, target } = range.while;
          addViewCondition(false, { views: getOppositeViews(views), target });
        } else {
          addCondition(true, range.when);
          addCondition(false, range.until);
        }
      }

      return state;
    };

    // --------------------

    this.add = (effects, range) => {
      const state = newEffectState(range);

      for (const effect of effects) {
        const states = effectsMap.get(effect.type) ?? [];
        states.push({ _effect: effect, _state: state });
      }

      return this;
    };

    this.disable = disable;
    this.enable = enable;
    this.isDisabled = isDisabled;
    this.onDisable = onDisable;
    this.onEnable = onEnable;

    this.clear = clear;
    this.onClear = onClear;

    this.onAnimation = onAnimation;
    this.offAnimation = offAnimation;

    this.animate = animate;
    this.deanimate = deanimate;

    this.toCss = toCss;
    this.getComposition = (type) => compositionsMap.get(type);
    this.getConfig = () => MH.copyObject(effectiveConfig);
    this.setLag = setLag;
    this.setDepth = setDepth;

    // --------------------

    const defaultLag = config?.lag ?? "+0";
    const defaultDepth = config?.depth ?? "+0";
    setLag(config?.lagX ?? defaultLag, config?.lagY ?? defaultLag);
    setDepth(config?.depthX ?? defaultDepth, config?.depthY ?? defaultDepth);

    if (!isDisabled()) {
      enable();
    }
  }
}

export type FXControllerConfig = {
  /**
   * The parent scrollable element. Used for
   * {@link ScrollReference | scroll-based range conditions}.
   *
   * If a {@link parent} is given and no scrollable is supplied here (or it is
   * the same as the parent's scrollable), this controller will use the parent's
   * scroll tracking.
   *
   * @defaultValue The parent's scrollable or if no parent, then
   * {@link ScrollWatcher} default
   */
  scrollable?: ScrollTarget | undefined;

  /**
   * The parent controller. Used for
   * - Resolving relative values of lag or depth.
   * - Eliminating redundant scroll tracking if both parent and this controller
   *   use the same scrollable.
   *
   * @defaultValue undefined
   */
  parent?: FXController;

  /**
   * The default value for the controller to negate in calls to
   * {@link FXController.animate | animate} and
   * {@link FXController.toCss | toCss}
   *
   * @defaultValue undefined
   */
  negate?: FXController;

  /**
   * Whether to set the initial state of the controller to disabled.
   *
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * The time in milliseconds it takes for effect states to catch up to the
   * actual scroll offset. It can be relative to the parent's lag. It must
   * result in a positive number.
   *
   * @defaultValue {@link settings.effectLag}
   */
  lag?: RawOrRelativeNumber;

  /**
   * The lag along the horizontal axis. It can be relative to the parent's lag.
   * It must result in a positive number.
   *
   * @defaultValue {@link lag}
   */
  lagX?: RawOrRelativeNumber;

  /**
   * The lag along the vertical axis. It can be relative to the parent's lag. It
   * must result in a positive number.
   *
   * @defaultValue {@link lag}
   */
  lagY?: RawOrRelativeNumber;

  /**
   * Parallax depth. This is a scaling ratio for the scroll offsets. It can be
   * relative to the parent's depth. It must result in a positive number. Values
   * larger than 1 will result in smaller values for the interpolated offsets
   * that effect handlers receive.
   *
   * @defaultValue 1
   */
  depth?: RawOrRelativeNumber;

  /**
   * Parallax depth along the horizontal axis.
   *
   * @defaultValue {@link depth}
   */
  depthX?: RawOrRelativeNumber;

  /**
   * Parallax depth along the vertical axis.
   *
   * @defaultValue {@link depth}
   */
  depthY?: RawOrRelativeNumber;
};

export type FXControllerEffectiveConfig = {
  scrollable: ScrollTarget | undefined;
  parent: FXController | undefined;
  negate: FXController | undefined;
  disabled: boolean;
  lagX: number;
  lagY: number;
  depthX: number;
  depthY: number;
};

export type AnimationFrameData = {
  /**
   * The latest scroll data for the
   * {@link FXControllerConfig.scrollable | scrollable}.
   */
  scroll: ScrollData;

  /**
   * The current (interpolated) absolute scroll offsets.
   */
  current: ScrollOffsets;

  /**
   * The change in the current (interpolated) scroll offsets, since the last
   * animation frame.
   */
  sinceLast: ScrollOffsets;

  /**
   * The target absolute scroll offsets, based on the
   * {@link scroll | scroll data} but scaled by the controller's depth.
   */
  target: ScrollOffsets;
};

/**
 * The handler is invoked with two arguments:
 *
 * - An {@link AnimationFrameData}.
 * - The {@link FXController} instance.
 */
export type OnAnimationHandlerArgs = [AnimationFrameData, FXController];
export type OnAnimationCallback = Callback<OnAnimationHandlerArgs>;
export type OnAnimationHandler =
  | CallbackHandler<OnAnimationHandlerArgs>
  | OnAnimationCallback;

export type FXControllerStateCallbackArgs = [FXController];
export type FXControllerStateCallback = Callback<FXControllerStateCallbackArgs>;
export type FXControllerStateHandler =
  | FXControllerStateCallback
  | CallbackHandler<FXControllerStateCallbackArgs>;

// ------------------------------

interface EffectsMap {
  get<T extends keyof EffectRegistry>(key: T): EffectEntry<T>[] | undefined;
  set<T extends keyof EffectRegistry>(key: T, value: EffectEntry<T>[]): this;
  has<T extends keyof EffectRegistry>(key: T): boolean;
  delete<T extends keyof EffectRegistry>(key: T): boolean;
  clear(): void;
  keys(): IterableIterator<keyof EffectRegistry>;
  values(): IterableIterator<EffectEntry<keyof EffectRegistry>[]>;
  entries<T extends keyof EffectRegistry>(): IterableIterator<
    [T, EffectEntry<T>[]]
  >;
  forEach<T extends keyof EffectRegistry>(
    callbackfn: (value: Effect<T>[], key: T, map: this) => void,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    thisArg?: any,
  ): void;
  [Symbol.iterator]<T extends keyof EffectRegistry>(): IterableIterator<
    [T, EffectEntry<T>[]]
  >;
}

interface CompositionMap {
  get<T extends keyof EffectRegistry>(key: T): Effect<T> | undefined;
  set<T extends keyof EffectRegistry>(key: T, value: Effect<T>): this;
  has<T extends keyof EffectRegistry>(key: T): boolean;
  delete<T extends keyof EffectRegistry>(key: T): boolean;
  clear(): void;
  keys(): IterableIterator<keyof EffectRegistry>;
  values(): IterableIterator<Effect<keyof EffectRegistry>>;
  entries(): IterableIterator<
    [keyof EffectRegistry, Effect<keyof EffectRegistry>]
  >;
  forEach(
    callbackfn: (
      value: Effect<keyof EffectRegistry>[],
      key: keyof EffectRegistry,
      map: this,
    ) => void,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    thisArg?: any,
  ): void;
  [Symbol.iterator](): IterableIterator<
    [keyof EffectRegistry, Effect<keyof EffectRegistry>]
  >;
}

type EffectEntry<T extends keyof EffectRegistry> = {
  _effect: Effect<T>;
  _state: EffectState;
};

type EffectState = {
  _activeSince: ScrollData | null;
};

const offsetIsPastRef = (
  input: RawOrRelativeNumber | undefined,
  scrollData: ScrollData,
  direction: "x" | "y",
): boolean | null => {
  const maxOffset =
    scrollData[direction === "x" ? MC.S_SCROLL_WIDTH : MC.S_SCROLL_HEIGHT];
  const currOffset =
    scrollData[direction === "x" ? MC.S_SCROLL_LEFT : MC.S_SCROLL_TOP];

  const calculator: RawNumberCalculator = ({
    isAdditive,
    isPercent,
    numerical,
  }) => {
    let result = numerical;
    if (isPercent) {
      result *= maxOffset / 100;
    }

    if (isAdditive) {
      result += currOffset;
    }

    return result;
  };

  const refVal = toRawNum(input, calculator, NaN);
  const diff = toNum(refVal - currOffset, null);
  return MH.isNumber(diff) ? diff < 0 : null;
};

const rescaleDataInPlace = (
  data: Partial<AnimationFrameData>,
  newDepth: number | undefined,
  newDepthY: number | undefined,
) => {
  newDepthY ??= newDepth;
  if (MH.isNullish(newDepth) || MH.isNullish(newDepthY)) {
    return;
  }

  const rescale = (offsets: ScrollOffsets | undefined) => {
    if (offsets) {
      offsets.x *= offsets.depthX / newDepth;
      offsets.y *= offsets.depthY / newDepthY;

      offsets.depthX = newDepth;
      offsets.depthY = newDepthY;
    }
  };

  rescale(data.target);
  rescale(data.current);
  rescale(data.sinceLast);
};

const getIncremental = (
  current: ScrollOffsets,
  previous: ScrollOffsets | undefined,
) => {
  const getDiffOf = (key: "x" | "y" | "nx" | "ny") =>
    current[key] - (previous ? previous[key] : 0);

  return {
    isAbsolute: false,
    depthX: current.depthX,
    depthY: current.depthY,
    x: getDiffOf("x"),
    nx: getDiffOf("nx"),
    y: getDiffOf("y"),
    ny: getDiffOf("ny"),
  };
};
