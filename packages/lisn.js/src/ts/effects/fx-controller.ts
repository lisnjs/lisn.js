/**
 * @module Effects/FXController
 *
 * @since v1.3.0
 */

// XXX
// - can we remove EffectRegistry and just use string as the type
// TODO support critically damped or plain quadratic or custom interpolation **iterator**
// TODO generalise:
// - manual call interpolate
// - optionally enable scroll tracking
// - custom range condition

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
  FXParameters,
  FXFrameAxisState,
  FXFrameState,
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
// XXX Document these
export type EffectBoundedRange = {
  when: ViewReference | ParamReference;
  until: ViewReference | ParamReference;
};

export type EffectWhileRange = {
  while: ViewReference;
};

export type ViewReference = {
  views: CommaSeparatedStr<View> | View[];
  target: ViewTarget;
};

export type ParamReference = AtLeastOne<{
  x: number | RawOrRelativeNumber;
  y: number | RawOrRelativeNumber;
  z: number | RawOrRelativeNumber;
}>;

/**
 * {@link FXController} XXX TODO
 */
export class FXController {
  /**
   * Adds one or more effects.
   *
   * Note that if any of the effects are {@link Effect.isAbsolute | absolute}
   * they essentially discard all previous ones of their respective type (e.g
   * transform).
   *
   * @returns The same {@link FXController} instance.
   */
  readonly add: <TL extends readonly (keyof EffectRegistry)[]>(
    effects: EffectsList<TL>,
    range?: EffectRange,
  ) => FXController;

  /**
   * Temporarily disables the controller. Scroll and view tracking, if any, is
   * disabled, effects are not being updated and no {@link onAnimation}
   * callbacks are called. XXX TODO children's onAnimationHandler should still be
   * called
   */
  readonly disable: () => void;

  /**
   * Re-enables the controller. All effects will be applied to match the current
   * state without animation/interpolation (i.e. instantly).
   */
  readonly enable: () => void;

  /**
   * Re-enables the controller if disabled, otherwise disables it.
   */
  readonly toggleEnable: () => void;

  /**
   * Calls the given handler when the controller is disabled. If the controller
   * is already disabled, the handlers are not called.
   *
   * The handler is called after setting the state to disabled, such that
   * calling {@link isDisabled} from the handler will return `true`.
   */
  readonly onDisable: (handler: FXControllerStateHandler) => void;

  /**
   * Calls the given handler when the controller is enabled. If the controller
   * is already enabled, the handlers are not called.
   *
   * The handler is called after setting the state to enabled, such that
   * calling {@link isDisabled} from the handler will return `false`.
   */
  readonly onEnable: (handler: FXControllerStateHandler) => void;

  /**
   * Returns true if the controller is disabled.
   */
  readonly isDisabled: () => boolean;

  /**
   * Removes all previously added effects.
   */
  readonly reset: () => void;

  /**
   * Calls the given handler when the controller is reset.
   *
   * If there are no effects in the controller when {@link reset} is called, the
   * handlers are not called.
   *
   * The handler is called after clearing the effects.
   */
  readonly onReset: (handler: FXControllerStateHandler) => void;

  /**
   * Calls the given handler whenever the controller updates the effect
   * parameters.
   *
   * The handler is called during an animation frame **after** all effects have
   * been applied, such that calling {@link toCss} or {@link getComposition}
   * will reflect the latest effect states.
   */
  readonly onAnimation: (handler: OnAnimationHandler) => void;

  /**
   * Removes a previously added {@link onAnimation} handler.
   */
  readonly offAnimation: (handler: OnAnimationHandler) => void;

  /**
   * Will apply the latest {@link toCss | CSS} to the given elements once.
   *
   * @param negate See {@link toCss}.
   */
  readonly animate: (elements: Element[], negate?: FXController) => void;

  /**
   * Will clear the relevant {@link toCss | CSS} properties from the given
   * elements.
   */
  readonly deanimate: (elements: Element[]) => void;

  /**
   * Will continually apply the latest {@link toCss | CSS} to the given
   * elements, except while the controller is disabled.
   *
   * @param clearOnDisable If true, when the controller is disabled, the CSS
   *                       properties will be cleared from the elements and
   *                       reapplied on enabling the controller.
   * @param negate         See {@link toCss}.
   */
  readonly startAnimate: (
    elements: Element[],
    clearOnDisable?: boolean,
    negate?: FXController,
  ) => void;

  /**
   * Will stop animating the given elements.
   *
   * @param clear If true, the {@link toCss | CSS} properties will be cleared
   *              from the elements now.
   */
  readonly stopAnimate: (elements: Element[], clear?: boolean) => void;

  /**
   * Returns an object with the CSS properties and their values to be set on
   * an element.
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
   */
  readonly getConfig: () => FXControllerEffectiveConfig;

  /**
   * Updates the controller's {@link FXControllerConfig.lag | lag}
   *
   * @param lag If a single number is given, it is set for all three axes.
   */
  readonly setLag: (
    lag:
      | RawOrRelativeNumber
      | AtLeastOne<{
          lag: RawOrRelativeNumber;
          lagX: RawOrRelativeNumber;
          lagY: RawOrRelativeNumber;
          lagZ: RawOrRelativeNumber;
        }>,
  ) => void;

  /**
   * Updates the controller's {@link FXControllerConfig.depth | parallax depth}
   *
   * Note that this will result in the effects being re-applied for this new
   * depth.
   *
   * @param depth If a single number is given, it is set for all three axes.
   */
  readonly setDepth: (
    depth:
      | RawOrRelativeNumber
      | AtLeastOne<{
          depth: RawOrRelativeNumber;
          depthX: RawOrRelativeNumber;
          depthY: RawOrRelativeNumber;
          depthZ: RawOrRelativeNumber;
        }>,
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
      // updated below in setLag
      lagX: 0,
      lagY: 0,
      lagZ: 0,
      // updated below in setDepth
      depthX: 1,
      depthY: 1,
      depthZ: 1,
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
      OnAnimationCallback
    >();

    const enableCallbacks = MH.newSet<FXControllerStateCallback>();
    const disableCallbacks = MH.newSet<FXControllerStateCallback>();
    const resetCallbacks = MH.newSet<FXControllerStateCallback>();

    const animatedElements = MH.newMap<
      Element,
      [OnAnimationHandler, Set<Element>]
    >();

    let currentFrameState: FXFrameState | null = null;
    let isFirstTimeAfterEnable = true;

    // ----------

    const isDisabled = () => effectiveConfig.disabled;

    // ----------

    const disable = () => {
      if (!isDisabled()) {
        effectiveConfig.disabled = true;

        invokeCallbackSet(disableCallbacks, this);

        for (const cbk of scrollConditionCallbacks) {
          scrollWatcher.offScroll(cbk, scrollable);
        }

        for (const [cbk, [target]] of viewConditionCallbacks) {
          viewWatcher.offView(target, cbk);
        }

        if (useParent) {
          parent.offAnimation(onAnimationHandler);
        } else {
          // XXX TODO if it has children relying on it, don't disable
          scrollWatcher.offScroll(onScroll, scrollable);
        }
      }
    };

    // ----------

    const enable = () => {
      if (isDisabled()) {
        isFirstTimeAfterEnable = true;
        effectiveConfig.disabled = false;

        invokeCallbackSet(enableCallbacks, this);

        for (const cbk of scrollConditionCallbacks) {
          scrollWatcher.onScroll(cbk, { scrollable });
        }

        for (const [cbk, [target, views]] of viewConditionCallbacks) {
          viewWatcher.onView(target, cbk, { views });
        }

        if (useParent) {
          parent.onAnimation(onAnimationHandler);
          // XXX TODO manually apply effects with the latest data from the
          // parent
        } else {
          scrollWatcher.onScroll(onScroll, { scrollable });
        }
      }
    };

    // ----------

    const onDisable = (handler: FXControllerStateHandler) =>
      addNewCallbackToSet(handler, disableCallbacks);

    const onEnable = (handler: FXControllerStateHandler) =>
      addNewCallbackToSet(handler, enableCallbacks);

    // ----------

    const reset = () => {
      if (MH.sizeOf(effectsMap) > 0) {
        for (const cbk of [
          ...scrollConditionCallbacks,
          ...viewConditionCallbacks.keys(),
        ]) {
          MH.remove(cbk);
        }

        effectsMap.clear();

        invokeCallbackSet(resetCallbacks, this);
      }
    };

    // ----------

    const onReset = (handler: FXControllerStateHandler) =>
      addNewCallbackToSet(handler, resetCallbacks);

    // ----------

    const animate = (elements: Element[], negate?: FXController) =>
      applyCss(elements, false, negate);

    const deanimate = (elements: Element[]) => applyCss(elements, true);

    // ----------

    const startAnimate = (
      elements: Element[],
      clearOnDisable?: boolean,
      negate?: FXController,
    ) => {
      // Use a single callback for all elements for performance gain.
      // Clean it up when all have been called with stopAnimate.
      const relatedElements = MH.newSet(elements);

      // Wrap it as a callback, since we'll be adding it as both onAnimation and
      // onDisable/onEnable (if clearOnDisable is true). This way, if the
      // original user callback is removed, our wrapped callback will be removed
      // and subsequently, it's removed from all three callback sets.
      const callback = wrapCallback(() => {
        if (isDisabled()) {
          // We would be here if we were called as an onDisable handler
          applyCss(relatedElements, true); // clear the CSS
        } else {
          applyCss(relatedElements, false, negate);
        }
      });

      const data: [OnAnimationHandler, Set<Element>] = [
        callback,
        relatedElements,
      ];

      for (const element of elements) {
        animatedElements.set(element, data);
      }

      callback.invoke(); // set the CSS now
      onAnimation(callback);

      if (clearOnDisable) {
        onDisable(callback);
        onEnable(callback);
      }
    };

    // ----------

    const stopAnimate = (elements: Element[], clear?: boolean) => {
      if (clear) {
        applyCss(elements, true);
      }

      for (const element of elements) {
        const [callback, relatedElements] = animatedElements.get(element) ?? [];

        MH.deleteKey(animatedElements, element);
        MH.deleteKey(relatedElements, element);
        if (callback && MH.sizeOf(relatedElements) === 0) {
          offAnimation(callback);
        }
      }
    };

    // ----------

    const setLag = (
      input: RawOrRelativeNumber | Partial<FXControllerConfig> | undefined,
    ) => {
      const defaultLag = settings.effectLag;
      let lag, lagX, lagY, lagZ;

      if (MH.isNonPrimitive(input)) {
        ({ lag, lagX, lagY, lagZ } = input);
      } else {
        lag = input;
      }

      const parentConfig = parent?.getConfig();
      const parentLagX = parentConfig?.lagX ?? defaultLag;
      const parentLagY = parentConfig?.lagY ?? defaultLag;
      const parentLagZ = parentConfig?.lagZ ?? defaultLag;

      effectiveConfig.lagX = toRawNum(lagX ?? lag, parentLagX, parentLagX);
      effectiveConfig.lagY = toRawNum(lagY ?? lag, parentLagY, parentLagY);
      effectiveConfig.lagZ = toRawNum(lagZ ?? lag, parentLagZ, parentLagZ);
    };

    // ----------

    const setDepth = (
      input: RawOrRelativeNumber | Partial<FXControllerConfig> | undefined,
    ) => {
      let depth, depthX, depthY, depthZ;

      if (MH.isNonPrimitive(input)) {
        ({ depth, depthX, depthY, depthZ } = input);
      } else {
        depth = input;
      }

      const parentConfig = parent?.getConfig();
      const parentDepthX = parentConfig?.depthX ?? 1;
      const parentDepthY = parentConfig?.depthY ?? 1;
      const parentDepthZ = parentConfig?.depthZ ?? 1;

      const newDepthX = toRawNum(depthX ?? depth, parentDepthX, parentDepthX);
      const newDepthY = toRawNum(depthY ?? depth, parentDepthY, parentDepthY);
      const newDepthZ = toRawNum(depthZ ?? depth, parentDepthZ, parentDepthZ);

      if (
        newDepthX !== effectiveConfig.depthX ||
        newDepthY !== effectiveConfig.depthY ||
        newDepthZ !== effectiveConfig.depthZ
      ) {
        effectiveConfig.depthX = newDepthX;
        effectiveConfig.depthY = newDepthY;
        effectiveConfig.depthZ = newDepthZ;

        interpolate(); // re-apply effects and call callbacks
      }
    };

    // ----------

    const toCss = (negate?: FXController) => {
      negate ??= defaultNegate;
      const css: Record<string, string> = {};

      for (const [type, effect] of compositionsMap) {
        const negatedEffect = negate?.getComposition(type);
        MH.assign(css, effect.toCss(negatedEffect));
      }

      return css;
    };

    // ----------

    const onAnimation = (handler: OnAnimationHandler) =>
      addNewCallbackToMap(handler, animationCallbacks);

    // ----------

    const offAnimation = (handler: OnAnimationHandler) =>
      MH.remove(animationCallbacks?.get(handler));

    // ----------

    const onScroll: OnScrollHandler = (e, scrollData) => {
      // XXX TODO update currentFrameState

      interpolate(); // don't await
    };

    // ----------

    const onAnimationHandler = (state: FXFrameState) => {
      currentFrameState = state;
      applyEffects(state);
      callCallbacks(state);
    };

    // ----------

    const callCallbacks = (state: FXFrameState) => {
      for (const cbk of animationCallbacks.values()) {
        cbk.invoke(deepCopy(state), this);
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
      if (isAnimating || !currentFrameState) {
        return;
      }

      isAnimating = true;

      const iterators: {
        x?: ReturnType<typeof newCriticallyDampedIterator>;
        y?: ReturnType<typeof newCriticallyDampedIterator>;
        z?: ReturnType<typeof newCriticallyDampedIterator>;
      } = {};

      for await (const { sinceLast: dt } of newAnimationFrameIterator()) {
        const { lagX, lagY, lagZ } = effectiveConfig;
        const lags = { x: lagX, y: lagY, z: lagZ };

        for (const axis of ["x", "y", "z"] as const) {
          const lag = lags[axis];
          const { target, current } = currentFrameState[axis];
          let done = current === target;

          currentFrameState[axis].previous = current;

          if (isFirstTimeAfterEnable) {
            isFirstTimeAfterEnable = false;
            currentFrameState[axis].current = target;
            done = true;
          }

          if (!done) {
            const state = {
              l: current,
              lTarget: target,
              lag,
              dt,
            };

            iterators[axis] ??= newCriticallyDampedIterator(state);

            const result = iterators[axis].next(state);
            currentFrameState[axis].current = result.value.l;
            done = !!result.done;
          }

          if (done) {
            // Will need to be re-created if we're not done on the next loop.
            delete iterators[axis];
          }
        }

        // onAnimationHandler will update currentFrameData
        onAnimationHandler(currentFrameState);

        if (!iterators.x && !iterators.y && !iterators.z) {
          isAnimating = false;
          break;
        }
      }
    };

    // ----------

    const applyEffects = (state: FXFrameState) => {
      for (const [type, entries] of effectsMap) {
        const toCompose: Effect<typeof type>[] = [];

        for (const entry of entries) {
          if (entry._state._activeSince !== null) {
            const effect = entry._effect;
            toCompose.push(effect.apply(state, this) as Effect<typeof type>);
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

    // XXX
    const newEffectState = (range: EffectRange | undefined) => {
      const state: EffectState = {
        _activeSince: null,
      };

      const addScrollCondition = (
        activate: boolean,
        { top, left }: OffsetReference,
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
        ref: OffsetReference | ViewReference | undefined,
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
    this.toggleEnable = () => (isDisabled() ? enable() : disable());
    this.isDisabled = isDisabled;
    this.onDisable = onDisable;
    this.onEnable = onEnable;

    this.reset = reset;
    this.onReset = onReset;

    this.onAnimation = onAnimation;
    this.offAnimation = offAnimation;

    this.animate = animate;
    this.deanimate = deanimate;
    this.startAnimate = startAnimate;
    this.stopAnimate = stopAnimate;

    this.toCss = toCss;
    this.getComposition = (type) => compositionsMap.get(type);
    this.getConfig = () => MH.copyObject(effectiveConfig);
    this.setLag = setLag;
    this.setDepth = setDepth;

    // --------------------

    setLag(config);
    setDepth(config);

    if (!isDisabled()) {
      enable();
    }
  }
}

export type FXControllerConfig = {
  /**
   * The parent scrollable element. Used for scroll-based
   * {@link OffsetReference | offset conditions}.
   *
   * If a {@link parent} is given and no scrollable is supplied here (or it is
   * the same as the parent's scrollable), this controller will use the parent's
   * scroll tracking for efficiency.
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
   * In most cases you'll want to pass the {@link parent} controller here.
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
   * {@link FXFrameState | target parameters}. It can be relative to the
   * parent's lag. It must result in a positive number.
   *
   * @defaultValue undefined
   */
  lag?: RawOrRelativeNumber;

  /**
   * The {@link lag} along the X axis only.
   *
   * @defaultValue {@link lag} or otherwise the parent's {@link lagX} or
   * otherwise {@link settings.effectLag}
   */
  lagX?: RawOrRelativeNumber;

  /**
   * The {@link lag} along the Y axis only.
   *
   * @defaultValue {@link lag} or otherwise the parent's {@link lagY} or
   * otherwise {@link settings.effectLag}
   */
  lagY?: RawOrRelativeNumber;

  /**
   * The {@link lag} along the Z axis only.
   *
   * @defaultValue {@link lag} or otherwise the parent's {@link lagZ} or
   * otherwise {@link settings.effectLag}
   */
  lagZ?: RawOrRelativeNumber;

  /**
   * Parallax depth. It can be relative to the parent's depth. It must result in
   * a positive number.
   *
   * Refer to each specific {@link Effect} to see whether and how it is used.
   *
   * @defaultValue undefined
   */
  depth?: RawOrRelativeNumber;

  /**
   * The {@link depth} along the X axis only.
   *
   * @defaultValue {@link depth} or otherwise the parent's {@link depthX} or
   * otherwise 1.
   */
  depthX?: RawOrRelativeNumber;

  /**
   * The {@link depth} along the Y axis only.
   *
   * @defaultValue {@link depth} or otherwise the parent's {@link depthY} or
   * otherwise 1.
   */
  depthY?: RawOrRelativeNumber;

  /**
   * The {@link depth} along the Z axis only.
   *
   * @defaultValue {@link depth} or otherwise the parent's {@link depthZ} or
   * otherwise 1.
   */
  depthZ?: RawOrRelativeNumber;
};

export type FXControllerEffectiveConfig = {
  scrollable: ScrollTarget | undefined;
  parent: FXController | undefined;
  negate: FXController | undefined;
  disabled: boolean;
  lagX: number;
  lagY: number;
  lagZ: number;
  depthX: number;
  depthY: number;
  depthZ: number;
};

/**
 * The handler is invoked with two arguments:
 *
 * - The current {@link FXFrameState}
 * - The {@link FXController} instance.
 */
export type OnAnimationHandlerArgs = [FXFrameState, FXController];
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
  size: number;
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
  size: number;
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

type EffectState = { _activeSince: FXFrameState | null };

// XXX
const offsetIsPastRef = (
  input: RawOrRelativeNumber | undefined,
  offsets: EffectOffsets,
  direction: "x" | "y" | "z",
): boolean | null => {
  const directionC = MH.toUpperCase(direction) as "X" | "Y" | "Z";

  const maxOffset = offsets[`max${directionC}`];
  const minOffset = offsets[`min${directionC}`];
  const currentOffset = offsets[direction];

  const calculator: RawNumberCalculator = ({
    isAdditive,
    isPercent,
    numerical,
  }) => {
    let result = isPercent
      ? minOffset + (numerical * (maxOffset - minOffset)) / 100
      : numerical;

    if (isAdditive) {
      result += currentOffset;
    }

    return result;
  };

  const refVal = toRawNum(input, calculator, NaN);
  const diff = toNum(refVal - currentOffset, null);
  return MH.isNumber(diff) ? diff < 0 : null;
};
