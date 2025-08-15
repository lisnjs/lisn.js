/**
 * @module Effects/FXController
 *
 * @since v1.3.0
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { settings } from "@lisn/globals/settings";

import {
  AtLeastOne,
  OnlyOneOf,
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
  addNewCallbackToMap,
} from "@lisn/modules/callback";

import {
  Effect,
  EffectsList,
  EffectRegistry,
  FXStateUpdate,
  FXAxisState,
  FXState,
  updateState,
} from "@lisn/effects/effect";

import { ScrollWatcher, OnScrollHandler } from "@lisn/watchers/scroll-watcher";
import { ViewWatcher, OnViewHandler } from "@lisn/watchers/view-watcher";

export type EffectRange = OnlyOneOf<EffectBoundedRange, EffectWhileRange>;

// TODO ALL and ANY multi-conditions
// XXX Document these
export type EffectBoundedRange = {
  when: ViewReference | StateReference;
  until: ViewReference | StateReference;
};

export type EffectWhileRange = {
  while: ViewReference;
};

export type ViewReference = {
  views: CommaSeparatedStr<View> | View[];
  target: ViewTarget;
};

export type StateReference = AtLeastOne<{
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
   * disabled, effects are not being updated, the trigger is not polled and no
   * {@link onTween} callbacks are called.
   */
  readonly disable: () => void;

  /**
   * Re-enables the controller. All effects will be applied to match the current
   * state without tweening/interpolation (i.e. instantly).
   */
  readonly enable: () => void;

  /**
   * Re-enables the controller if disabled, otherwise disables it.
   */
  readonly toggleEnable: () => void;

  /**
   * Calls the given handler when the controller is enabled or disabled.
   *
   * The handler is called after updating its state the controller, such that
   * calling {@link isDisabled} from the handler will return the new value.
   */
  readonly onToggle: (handler: FXControllerHandler) => void;

  /**
   * Removes a previously added {@link onToggle} handler.
   */
  readonly offToggle: (handler: FXControllerHandler) => void;

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
  readonly onReset: (handler: FXControllerHandler) => void;

  /**
   * Removes a previously added {@link onReset} handler.
   */
  readonly offReset: (handler: FXControllerHandler) => void;

  /**
   * Calls the given handler whenever the controller is triggered.
   *
   * The handler is called after updating the state.
   */
  readonly onTrigger: (handler: FXControllerHandler) => void;

  /**
   * Removes a previously added {@link onTrigger} handler.
   */
  readonly offTrigger: (handler: FXControllerHandler) => void;

  /**
   * Calls the given handler whenever the controller tweens (i.e. interpolates)
   * the current {@link FXParams}. This happens on every animation frame
   * while interpolating the effects towards the
   * {@link FXAxisState.target | target} parameters.
   *
   * The handler is called during an animation frame **after** all effects have
   * been applied, such that calling {@link toCss} or {@link getComposition}
   * will reflect the latest effect states.
   */
  readonly onTween: (handler: FXControllerHandler) => void;

  /**
   * Removes a previously added {@link onTween} handler.
   */
  readonly offTween: (handler: FXControllerHandler) => void;

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
   * Returns a copy of the controller's {@link FXState}.
   */
  readonly getState: () => FXState;

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

  /**
   * This creates a new async generator that will yield update data
   * whenever the returned helper callback is called.
   */
  static createTrigger(): FXTriggerPair {
    let resolve: (data: FXStateUpdate) => void;

    const nextPromise = () =>
      MH.newPromise<FXStateUpdate>((r) => (resolve = r));

    const trigger: FXTrigger = async function* () {
      while (true) {
        yield await nextPromise();
      }
    };

    const sendUpdate = (data: FXStateUpdate) => resolve(data);

    return { trigger, sendUpdate };
  }

  constructor(config?: FXControllerConfig) {
    const {
      parent,
      negate: defaultNegate,
      trigger: userTrigger = MC.S_SCROLL,
    } = config ?? {};

    const effectiveConfig: FXControllerEffectiveConfig = {
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

    let scrollWatcher: ScrollWatcher | null = null;
    const viewWatcher = ViewWatcher.reuse();
    let trigger: FXTrigger;

    const effectsMap: EffectsMap = new Map();
    const compositionsMap: CompositionMap = new Map();

    const toggleCallbacks = MH.newMap<
      FXControllerHandler,
      FXControllerCallback
    >();
    const resetCallbacks = MH.newMap<
      FXControllerHandler,
      FXControllerCallback
    >();

    const triggerCallbacks = MH.newMap<
      FXControllerHandler,
      FXControllerCallback
    >();
    const tweenCallbacks = MH.newMap<
      FXControllerHandler,
      FXControllerCallback
    >();

    const animatedElements = MH.newMap<
      Element,
      [FXControllerHandler, Set<Element>]
    >();

    const currentFXState = newDefaultState();
    let isFirstTimeAfterEnable = true;

    // ----------

    const isDisabled = () => effectiveConfig.disabled;

    // ----------

    const disable = () => {
      if (!isDisabled()) {
        effectiveConfig.disabled = true;
        invokeCallbacks(toggleCallbacks);
      }
    };

    // ----------

    const enable = () => {
      if (isDisabled()) {
        isFirstTimeAfterEnable = true;
        effectiveConfig.disabled = false;

        invokeCallbacks(toggleCallbacks);
        pollTrigger();
      }
    };

    // ----------

    const onToggle = (handler: FXControllerHandler) =>
      addNewCallbackToMap(handler, toggleCallbacks);

    const offToggle = (handler: FXControllerHandler) =>
      MH.remove(toggleCallbacks.get(handler));

    // ----------

    const reset = () => {
      if (MH.sizeOf(effectsMap) > 0) {
        effectsMap.clear();
        invokeCallbacks(resetCallbacks);
      }
    };

    // ----------

    const onReset = (handler: FXControllerHandler) =>
      addNewCallbackToMap(handler, resetCallbacks);

    const offReset = (handler: FXControllerHandler) =>
      MH.remove(resetCallbacks.get(handler));

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

      // Wrap it as a callback, since we'll be adding it as both onTween and
      // onToggle (if clearOnDisable is true). This way, if the original user
      // callback is removed, our wrapped callback will be removed and
      // subsequently, it's removed from all three callback sets.
      const callback = wrapCallback(() => {
        if (isDisabled()) {
          // We would be here if we were called as an onToggle handler
          applyCss(relatedElements, true); // clear the CSS
        } else {
          applyCss(relatedElements, false, negate);
        }
      });

      const data: [FXControllerHandler, Set<Element>] = [
        callback,
        relatedElements,
      ];

      for (const element of elements) {
        animatedElements.set(element, data);
      }

      callback.invoke(); // set the CSS now
      onTween(callback);

      if (clearOnDisable) {
        onToggle(callback);
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
          offTween(callback);
        }
      }
    };

    // ----------

    const updateStateConf = <P extends "lag" | "depth">(
      input: RawOrRelativeNumber | Partial<FXControllerConfig> | undefined,
      prop: P,
      defaultValue: number,
    ) => {
      const parentConfig: Partial<FXControllerEffectiveConfig> =
        parent?.getConfig() ?? {};

      let values: Partial<FXControllerConfig>;
      if (MH.isNonPrimitive(input)) {
        values = input;
      } else {
        values = { [prop]: input };
      }

      let updated = false;
      for (const [a, A] of [
        ["x", "X"],
        ["y", "Y"],
        ["z", "Z"],
      ] as const) {
        const parentVal = parentConfig[`${prop}${A}`] ?? defaultValue;
        const newVal = toRawNum(
          values[`${prop}${A}`] ?? values[prop],
          parentVal,
          parentVal,
        );

        updated ||= effectiveConfig[`${prop}${A}`] !== newVal;

        effectiveConfig[`${prop}${A}`] = newVal;
        currentFXState[a][prop] = newVal;
      }

      return updated;
    };

    // ----------

    const setLag = (
      input: RawOrRelativeNumber | Partial<FXControllerConfig> | undefined,
    ) => updateStateConf(input, "lag", settings.effectLag);

    const setDepth = (
      input: RawOrRelativeNumber | Partial<FXControllerConfig> | undefined,
    ) => {
      const updated = updateStateConf(input, "depth", 1);
      if (updated) {
        tween(); // re-apply effects and call callbacks
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

    const onTrigger = (handler: FXControllerHandler) =>
      addNewCallbackToMap(handler, triggerCallbacks);

    const offTrigger = (handler: FXControllerHandler) =>
      MH.remove(triggerCallbacks.get(handler));

    // ----------

    const onTween = (handler: FXControllerHandler) =>
      addNewCallbackToMap(handler, tweenCallbacks);

    const offTween = (handler: FXControllerHandler) =>
      MH.remove(tweenCallbacks.get(handler));

    // ----------

    const invokeCallbacks = (
      callbacks: Map<FXControllerHandler, FXControllerCallback>,
    ) => {
      for (const cbk of callbacks.values()) {
        cbk.invoke(deepCopy(currentFXState), this);
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

    let isTweening = false;
    const tween = async () => {
      if (isTweening) {
        return;
      }

      isTweening = true;

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
          const { target, current } = currentFXState[axis];
          let done = current === target;

          if (MH.isNullish(iterators[axis])) {
            currentFXState[axis].initial = current;
          }

          currentFXState[axis].previous = current;

          if (isFirstTimeAfterEnable) {
            isFirstTimeAfterEnable = false;
            currentFXState[axis].current = target;
            done = true;
          }

          if (!done) {
            const springState = {
              l: current,
              lTarget: target,
              lag,
              dt,
            };

            iterators[axis] ??= newCriticallyDampedIterator(springState);

            const result = iterators[axis].next(springState);
            currentFXState[axis].current = result.value.l;
            done = !!result.done;
          }

          if (done) {
            // Will need to be re-created if we're not done on the next loop.
            delete iterators[axis];
          }
        }

        applyEffects();
        invokeCallbacks(tweenCallbacks);

        if (!iterators.x && !iterators.y && !iterators.z) {
          isTweening = false;
          break;
        }
      }
    };

    // ----------

    const applyEffects = () => {
      for (const [type, entries] of effectsMap) {
        const toCompose: Effect<typeof type>[] = [];

        for (const entry of entries) {
          if (entry._data._activeSince !== null) {
            const effect = entry._effect;
            toCompose.push(
              effect.apply(deepCopy(currentFXState), this) as Effect<
                typeof type
              >,
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

    const newEffectData = (range: EffectRange | undefined) => {
      const data: EffectData = {
        _activeSince: null,
      };

      const addStateCondition = (
        activate: boolean,
        reference: StateReference,
      ) => {
        const callback: FXControllerHandler = wrapCallback((state) => {
          // It's active if either this condition activates the effect and the
          // current state value is larger than (exceeds) the reference one, or
          // this condition deactivates the effect but the current state value
          // is still smaller than the reference.

          const exceedsRef = (axis: "x" | "y" | "z") =>
            currentExceedsRef(reference[axis], state[axis]) ?? activate;

          const isActive =
            activate ===
            (exceedsRef("x") && exceedsRef("y") && exceedsRef("z"));

          data._activeSince = isActive ? state : null;
        });

        onTrigger(callback);
        onReset(callback.remove);
      };

      const addViewCondition = (
        activate: boolean,
        { views, target }: ViewReference,
      ) => {
        const viewHandler: OnViewHandler = async () => {
          data._activeSince = activate ? currentFXState : null;
        };

        const addOrRemoveWatcher = wrapCallback(() =>
          isDisabled()
            ? viewWatcher.offView(target, viewHandler)
            : viewWatcher.onView(target, viewHandler, { views }),
        );

        addOrRemoveWatcher.invoke();
        onToggle(addOrRemoveWatcher);
        onReset(addOrRemoveWatcher.remove);
      };

      const addCondition = (
        activate: boolean,
        ref: StateReference | ViewReference | undefined,
      ) => {
        if (ref) {
          if ("target" in ref) {
            addViewCondition(true, ref);
          } else {
            addStateCondition(true, ref);
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

      return data;
    };

    // ----------

    const pollTrigger = async () => {
      for await (const data of trigger()) {
        if (isDisabled()) {
          return;
        }

        // XXX check if it has changed
        MH.assign(currentFXState, updateState(currentFXState, this, data));
        tween();
        invokeCallbacks(triggerCallbacks);
      }
    };

    // ----------

    this.add = (effects, range) => {
      const effectData = newEffectData(range);

      for (const effect of effects) {
        const allEffectData = effectsMap.get(effect.type) ?? [];
        allEffectData.push({ _effect: effect, _data: effectData });
      }

      return this;
    };

    this.disable = disable;
    this.enable = enable;
    this.toggleEnable = () => (isDisabled() ? enable() : disable());
    this.isDisabled = isDisabled;
    this.onToggle = onToggle;
    this.offToggle = offToggle;

    this.reset = reset;
    this.onReset = onReset;
    this.offReset = offReset;

    this.onTrigger = onTrigger;
    this.offTrigger = offTrigger;

    this.onTween = onTween;
    this.offTween = offTween;

    this.animate = animate;
    this.deanimate = deanimate;
    this.startAnimate = startAnimate;
    this.stopAnimate = stopAnimate;

    this.toCss = toCss;
    this.getComposition = (type) => compositionsMap.get(type);
    this.getState = () => deepCopy(currentFXState);
    this.getConfig = () => deepCopy(effectiveConfig);
    this.setLag = setLag;
    this.setDepth = setDepth;

    // --------------------

    if (userTrigger === MC.S_SCROLL) {
      scrollWatcher = ScrollWatcher.reuse({ [MC.S_DEBOUNCE_WINDOW]: 0 });
      let sendUpdate;
      ({ trigger, sendUpdate } = FXController.createTrigger());

      const scrollable = undefined; // XXX
      const scrollHandler: OnScrollHandler = (e, scrollData) =>
        sendUpdate({
          x: {
            min: 0,
            max: scrollData[MC.S_SCROLL_WIDTH],
            target: scrollData[MC.S_SCROLL_LEFT],
          },
          y: {
            min: 0,
            max: scrollData[MC.S_SCROLL_HEIGHT],
            target: scrollData[MC.S_SCROLL_TOP],
          },
          z: {
            min: 0,
            max: 0,
            target: 0,
          },
        });

      const addOrRemoveWatcher = () =>
        isDisabled()
          ? scrollWatcher?.offScroll(scrollHandler, scrollable)
          : scrollWatcher?.onScroll(scrollHandler, { scrollable });

      addOrRemoveWatcher();
      onToggle(addOrRemoveWatcher);
    } else if (MH.isFunction(userTrigger)) {
      trigger = userTrigger;
    } else {
      throw MH.usageError(
        "FXController trigger must be an async generator or 'scroll'",
      );
    }

    setLag(config);
    setDepth(config);

    if (!isDisabled()) {
      pollTrigger();
    }
  }
}

export type FXControllerConfig = {
  /**
   * The parent controller. Used for resolving relative values of lag or depth.
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
   * Whether to disable the controller initially.
   *
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * XXX update
   *
   * The trigger to use to get new minimum, maximum and target values for the
   * {@link FXAxisState}s.
   *
   * By default, an internal scroll-based trigger is used which listens for
   * scrolling and updates the state as follows:
   * - x.min: 0
   * - y.min: 0
   * - z.min: 0
   *
   * - x.max: {@link scrollable}'s scroll width
   * - y.max: {@link scrollable}'s scroll height
   * - z.max: 0
   *
   * - x.target: {@link scrollable}'s scroll left offset
   * - y.target: {@link scrollable}'s scroll top offset
   * - z.target: 0
   *
   * If you want to use a custom trigger it should be an infinite async
   * generator that yields new {@link FXStateUpdate | update data}.
   *
   * If the data is coming from event-based triggers and you want to simply call
   * a function when there's new data, you can use
   * {@link FXController.createTrigger}.
   *
   * @defaultValue undefined // A default XXX instance
   */
  trigger?: FXTrigger;

  // XXX custom tweener or "criticallyDamped", "quadratic", etc

  /**
   * The time in milliseconds it takes for effect states to catch up to the
   * {@link FXState | target parameters}. It can be relative to the parent's
   * lag. It must result in a positive number.
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
 * - The current {@link FXState}
 * - The {@link FXController} instance.
 */
export type FXControllerCallbackArgs = [FXState, FXController];
export type FXControllerCallback = Callback<FXControllerCallbackArgs>;
export type FXControllerHandler =
  | FXControllerCallback
  | CallbackHandler<FXControllerCallbackArgs>;

// XXX Make it a class:
// - various triggers (separate class):
//   - scroll based
//   - controller based (with same or custom state); support trigger on
//     percentage done of tweening
// - delay
// Also a factory function for creating:
// - event-based trigger
// - poll-based trigger
// XXX Rename to FXTrigger
export type FXTrigger = () => AsyncGenerator<FXStateUpdate, never, undefined>;

export type FXTriggerPair = {
  /**
   * This is what you pass to {@link FXControllerConfig.trigger}.
   */
  trigger: FXTrigger;

  /**
   * This is what you call with your latest {@link FXStateUpdate} data to have
   * it trigger the controller.
   */
  sendUpdate: (data: FXStateUpdate) => void;
};

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
  _data: EffectData;
};

type EffectData = { _activeSince: FXState | null };

const newDefaultState = (): FXState => {
  const axisState: FXAxisState = {
    min: 0,
    max: 0,
    initial: 0,
    previous: 0,
    current: 0,
    target: 0,
    lag: 0,
    depth: 1,
  };

  return deepCopy({ x: axisState, y: axisState, z: axisState });
};

const currentExceedsRef = (
  reference: RawOrRelativeNumber | undefined,
  state: FXAxisState,
): boolean | null => {
  const { min, max, current } = state;

  const calculator: RawNumberCalculator = ({
    isAdditive,
    isPercent,
    numerical,
  }) => {
    let result = isPercent ? min + (numerical * (max - min)) / 100 : numerical;

    if (isAdditive) {
      result += current;
    }

    return result;
  };

  const refNumber = toRawNum(reference, calculator, NaN);
  const diff = toNum(refNumber - current, null);
  return MH.isNumber(diff) ? diff < 0 : null;
};
