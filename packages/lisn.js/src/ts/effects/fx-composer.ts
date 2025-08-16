/**
 * @module Effects/FXComposer
 *
 * @since v1.3.0
 */

import * as MH from "@lisn/globals/minification-helpers";

import { settings } from "@lisn/globals/settings";

import { AtLeastOne, RawOrRelativeNumber } from "@lisn/globals/types";

import { newAnimationFrameIterator } from "@lisn/utils/animations";
import { setStyleProp, delStyleProp } from "@lisn/utils/css-alter";
import { newCriticallyDampedIterator, toRawNum } from "@lisn/utils/math";
import { deepCopy, compareValuesIn } from "@lisn/utils/misc";

import {
  CallbackHandler,
  Callback,
  addNewCallbackToMap,
} from "@lisn/modules/callback";

import {
  Effect,
  EffectsList,
  EffectRegistry,
  FXAxisState,
  FXState,
  getUpdatedState,
} from "@lisn/effects/effect";

import { FXTrigger } from "@lisn/effects/triggers/fx-trigger";

import { FXToggle } from "@lisn/effects/toggles/fx-toggle";

/**
 * {@link FXComposer} XXX TODO
 */
export class FXComposer {
  /**
   * Adds one or more effects.
   *
   * Note that if any of the effects are {@link Effect.isAbsolute | absolute}
   * they essentially discard all previous ones of their respective
   * {@link Effect.type | type} (e.g transform).
   *
   * @param toggle If given, the composer will associate all the effects added
   *               with this call to the toggle's state, and when the toggle is
   *               off, those effects won't be {@link Effect.update | updates}.
   *
   * @returns The same {@link FXComposer} instance.
   */
  readonly add: <TL extends readonly (keyof EffectRegistry)[]>(
    effects: EffectsList<TL>,
    toggle?: FXToggle,
  ) => FXComposer;

  /**
   * Removes previously {@link add | added} effects.
   *
   * @returns The same {@link FXComposer} instance.
   */
  readonly remove: <TL extends readonly (keyof EffectRegistry)[]>(
    effects: EffectsList<TL>,
  ) => FXComposer;

  /**
   * Removes all previously added effects.
   */
  readonly reset: () => void;

  /**
   * Calls the given handler when the composer is reset.
   *
   * If there are no effects in the composer when {@link reset} is called, the
   * handlers are not called.
   *
   * The handler is called after clearing the effects.
   */
  readonly onReset: (handler: FXComposerHandler) => void;

  /**
   * Removes a previously added {@link onReset} handler.
   */
  readonly offReset: (handler: FXComposerHandler) => void;

  /**
   * Calls the given handler whenever the composer is triggered.
   *
   * The handler is called after updating the state.
   */
  readonly onTrigger: (handler: FXComposerHandler) => void;

  /**
   * Removes a previously added {@link onTrigger} handler.
   */
  readonly offTrigger: (handler: FXComposerHandler) => void;

  /**
   * Calls the given handler whenever the composer tweens (i.e. interpolates)
   * the current {@link FXParams}. This happens on every animation frame
   * while interpolating the effects towards the
   * {@link FXAxisState.target | target} parameters.
   *
   * The handler is called during an animation frame **after** all effects have
   * been applied, such that calling {@link toCss} or {@link getComposition}
   * will reflect the latest effect states.
   */
  readonly onTween: (handler: FXComposerHandler) => void;

  /**
   * Removes a previously added {@link onTween} handler.
   */
  readonly offTween: (handler: FXComposerHandler) => void;

  /**
   * Will apply the latest {@link toCss | CSS} to the given elements once.
   *
   * @param negate See {@link toCss}.
   */
  readonly animate: (elements: Element[], negate?: FXComposer) => void;

  /**
   * Will clear the relevant {@link toCss | CSS} properties from the given
   * elements.
   */
  readonly deanimate: (elements: Element[]) => void;

  /**
   * Will continually apply the latest {@link toCss | CSS} to the given
   * elements.
   *
   * @param negate See {@link toCss}.
   */
  readonly startAnimate: (elements: Element[], negate?: FXComposer) => void;

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
   * @param negate If given, then all effects added on this composer that
   *               support negation (see {@link Effect.export}) will receive the
   *               combined effect of their respective type as the one to
   *               negate.
   */
  readonly toCss: (negate?: FXComposer) => Record<string, string>;

  /**
   * Returns the combined effect for the given type.
   */
  readonly getComposition: <T extends keyof EffectRegistry>(
    type: T,
  ) => Effect<T> | undefined;

  /**
   * Returns a copy of the composer's {@link FXState}.
   */
  readonly getState: () => FXState;

  /**
   * Returns the composer's **effective** configuration.
   */
  readonly getConfig: () => FXComposerEffectiveConfig;

  /**
   * Updates the composer's {@link FXComposerConfig.lag | lag}
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
   * Updates the composer's {@link FXComposerConfig.depth | parallax depth}
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
  constructor(config: FXComposerConfig) {
    const { parent, negate: defaultNegate, trigger } = config ?? {};

    const effectiveConfig: FXComposerEffectiveConfig = {
      parent,
      negate: defaultNegate,
      // updated below in setLag
      lagX: 0,
      lagY: 0,
      lagZ: 0,
      // updated below in setDepth
      depthX: 1,
      depthY: 1,
      depthZ: 1,
    };

    const effectsMap: EffectsMap<{
      [T in keyof EffectRegistry]: Map<Effect<T>, FXToggle | undefined>;
    }> = new Map();

    const compositionsMap: EffectsMap<{
      [T in keyof EffectRegistry]: Effect<T>;
    }> = new Map();

    const resetCallbacks = MH.newMap<FXComposerHandler, FXComposerCallback>();
    const triggerCallbacks = MH.newMap<FXComposerHandler, FXComposerCallback>();
    const tweenCallbacks = MH.newMap<FXComposerHandler, FXComposerCallback>();

    const animatedElements = MH.newMap<
      Element,
      [FXComposerHandler, Set<Element>]
    >();

    const currentFXState = newDefaultState();

    // ----------

    const add = <TL extends readonly (keyof EffectRegistry)[]>(
      effects: EffectsList<TL>,
      toggle?: FXToggle,
    ) => {
      for (const effect of effects) {
        let entriesForType = effectsMap.get(effect.type);
        if (!entriesForType) {
          entriesForType = MH.newMap();
          effectsMap.set(effect.type, entriesForType);
        }

        entriesForType.set(effect, toggle);
      }

      return this;
    };

    const remove = <TL extends readonly (keyof EffectRegistry)[]>(
      effects: EffectsList<TL>,
    ) => {
      for (const effect of effects) {
        const entriesForType = effectsMap.get(effect.type);
        MH.deleteKey(entriesForType, effect);
      }

      return this;
    };

    // ----------

    const reset = () => {
      if (MH.sizeOf(effectsMap) > 0) {
        effectsMap.clear();
        invokeCallbacks(resetCallbacks);
      }
    };

    // ----------

    const onReset = (handler: FXComposerHandler) =>
      addNewCallbackToMap(handler, resetCallbacks);

    const offReset = (handler: FXComposerHandler) =>
      MH.remove(resetCallbacks.get(handler));

    // ----------

    const animate = (elements: Element[], negate?: FXComposer) =>
      applyCss(elements, false, negate);

    const deanimate = (elements: Element[]) => applyCss(elements, true);

    // ----------

    const startAnimate = (elements: Element[], negate?: FXComposer) => {
      // Use a single handler for all elements for performance gain.
      // Clean it up when all have been called with stopAnimate.
      const relatedElements = MH.newSet(elements);

      const handler = () => applyCss(relatedElements, false, negate);

      const data: [FXComposerHandler, Set<Element>] = [
        handler,
        relatedElements,
      ];

      for (const element of elements) {
        animatedElements.set(element, data);
      }

      handler(); // set the CSS now
      onTween(handler);
    };

    // ----------

    const stopAnimate = (elements: Element[], clear?: boolean) => {
      if (clear) {
        applyCss(elements, true);
      }

      for (const element of elements) {
        const [handler, relatedElements] = animatedElements.get(element) ?? [];

        MH.deleteKey(animatedElements, element);
        MH.deleteKey(relatedElements, element);
        if (handler && MH.sizeOf(relatedElements) === 0) {
          offTween(handler);
        }
      }
    };

    // ----------

    const updateStateConf = <P extends "lag" | "depth">(
      input: RawOrRelativeNumber | Partial<FXComposerConfig> | undefined,
      prop: P,
      defaultValue: number,
    ) => {
      const parentConfig: Partial<FXComposerEffectiveConfig> =
        parent?.getConfig() ?? {};

      let values: Partial<FXComposerConfig>;
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
      input: RawOrRelativeNumber | Partial<FXComposerConfig> | undefined,
    ) => updateStateConf(input, "lag", settings.effectLag);

    const setDepth = (
      input: RawOrRelativeNumber | Partial<FXComposerConfig> | undefined,
    ) => {
      const updated = updateStateConf(input, "depth", 1);
      if (updated) {
        tween(); // update the effects and call callbacks
      }
    };

    // ----------

    const toCss = (negate?: FXComposer) => {
      negate ??= defaultNegate;
      const css: Record<string, string> = {};

      for (const [type, effect] of compositionsMap) {
        const negatedEffect = negate?.getComposition(type);
        MH.assign(css, effect.toCss(negatedEffect));
      }

      return css;
    };

    // ----------

    const onTrigger = (handler: FXComposerHandler) =>
      addNewCallbackToMap(handler, triggerCallbacks);

    const offTrigger = (handler: FXComposerHandler) =>
      MH.remove(triggerCallbacks.get(handler));

    // ----------

    const onTween = (handler: FXComposerHandler) =>
      addNewCallbackToMap(handler, tweenCallbacks);

    const offTween = (handler: FXComposerHandler) =>
      MH.remove(tweenCallbacks.get(handler));

    // ----------

    const invokeCallbacks = (
      callbacks: Map<FXComposerHandler, FXComposerCallback>,
    ) => {
      for (const cbk of callbacks.values()) {
        cbk.invoke(deepCopy(currentFXState), this);
      }
    };

    // ----------

    const applyCss = (
      elements: Element[] | Set<Element>,
      clear: boolean,
      negate?: FXComposer,
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
    const tween = async (snap = false) => {
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
            // Starting a new tween now
            currentFXState[axis].initial = current;
          }

          currentFXState[axis].previous = current;

          if (snap) {
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
            delete iterators[axis];
          }
        }

        updateEffects();
        invokeCallbacks(tweenCallbacks);

        if (!iterators.x && !iterators.y && !iterators.z) {
          isTweening = false;
          break;
        }
      }
    };

    // ----------

    const updateEffects = () => {
      for (const [type, entries] of effectsMap) {
        const toCompose: Effect<typeof type>[] = [];

        for (const [effect, toggle] of entries) {
          if (!toggle || toggle.isON()) {
            toCompose.push(
              effect.update(deepCopy(currentFXState), this) as Effect<
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

    const pollTrigger = async () => {
      for await (const data of trigger()) {
        const newState = getUpdatedState(currentFXState, this, data);

        if (!compareValuesIn(currentFXState, newState, 5)) {
          MH.assign(currentFXState, newState);
          tween(data?.snap);
          invokeCallbacks(triggerCallbacks);
        }
      }
    };

    // ----------

    this.add = add;
    this.remove = remove;

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

    setLag(config);
    setDepth(config);

    if (!trigger) {
      return; // XXX
      throw MH.usageError("FXComposer trigger is required");
    }

    pollTrigger();
  }
}

export type FXComposerConfig = {
  /**
   * The trigger to use to get {@link Effects/Effect.FXStateUpdate | updates} to
   * the {@link FXAxisState}s.
   *
   * It is required.
   */
  trigger: FXTrigger;

  /**
   * The parent composer. Used for resolving relative values of lag or depth.
   *
   * @defaultValue undefined
   */
  parent?: FXComposer;

  /**
   * The default value for the composer to negate in calls to
   * {@link FXComposer.animate | animate} and {@link FXComposer.toCss | toCss}
   *
   * In most cases you'll want to pass the {@link parent} composer here.
   *
   * @defaultValue undefined
   */
  negate?: FXComposer;

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

export type FXComposerEffectiveConfig = {
  parent: FXComposer | undefined;
  negate: FXComposer | undefined;
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
 * - The {@link FXComposer} instance.
 */
export type FXComposerHandlerArgs = [FXState, FXComposer];
export type FXComposerCallback = Callback<FXComposerHandlerArgs>;
export type FXComposerHandler =
  | FXComposerCallback
  | CallbackHandler<FXComposerHandlerArgs>;

// ------------------------------

interface EffectsMap<V extends { [T in keyof EffectRegistry]: unknown }> {
  size: number;
  get<T extends keyof EffectRegistry>(key: T): V[T] | undefined;
  set<T extends keyof EffectRegistry>(key: T, value: V[T]): this;
  has<T extends keyof EffectRegistry>(key: T): boolean;
  delete<T extends keyof EffectRegistry>(key: T): boolean;
  clear(): void;
  keys(): IterableIterator<keyof EffectRegistry>;
  values(): IterableIterator<V[keyof EffectRegistry]>;
  entries<T extends keyof EffectRegistry>(): IterableIterator<[T, V[T]]>;
  forEach<T extends keyof EffectRegistry>(
    callbackfn: (value: Effect<T>[], key: T, map: this) => void,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    thisArg?: any,
  ): void;
  [Symbol.iterator]<T extends keyof EffectRegistry>(): IterableIterator<
    [T, V[T]]
  >;
}

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
