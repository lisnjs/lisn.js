/**
 * @module Effects
 *
 * @since v1.3.0
 */

import * as MH from "@lisn/globals/minification-helpers";

import { settings } from "@lisn/globals/settings";

import {
  AtLeastOne,
  RawOrRelativeNumber,
  DeepPartial,
} from "@lisn/globals/types";

import { setStyleProp, delStyleProp } from "@lisn/utils/css-alter";
import { toRawNum } from "@lisn/utils/math";
import { deepCopy, compareValuesIn } from "@lisn/utils/misc";
import {
  tween3DAnimationGenerator,
  Tweener,
  Tween3DUpdate,
} from "@lisn/utils/tween";

import {
  CallbackHandler,
  Callback,
  addNewCallbackToMap,
} from "@lisn/modules/callback";

import {
  Effect,
  FXAxisState,
  FXState,
  FXStateUpdate,
  getUpdatedState,
} from "@lisn/effects/effect";

import { FXComposition } from "@lisn/effects/fx-composition";
import { FXTrigger } from "@lisn/effects/triggers/fx-trigger";

/**
 * {@link FXComposer} XXX TODO
 */
export class FXComposer {
  /**
   * Adds more effects or other composers to the current chain of composition.
   *
   * Effects added here are managed by **this** composer and will be
   * {@link Effect.update | updated} with the composer's state at each frame
   * while it is tweening.
   *
   * Other composers added here will simply be queried for their current
   * {@link getComposition | composition} each time this composer tweens and
   * the returned effects will be used as is in the chain of this composer's
   * composition.
   *
   * This allows you to animate a single property of an element (e.g. transform)
   * by multiple composers, each one with different triggers, lag or depth.
   *
   * However, you should call {@link startAnimate} with the element only on this
   * composer, to which you add all other relevant composers.
   *
   * **NOTE:** If any of the effects added here or returned by related composers
   * are {@link Effect.isAbsolute | absolute} they essentially discard all
   * previous effects of their respective {@link Effect.type | type}.
   */
  readonly add: (...compositionLinks: Array<Effect | FXComposer>) => this;

  /**
   * Removes previously {@link add | added} effects or composers from the chain
   * of composition.
   */
  readonly remove: (...compositionLinks: Array<Effect | FXComposer>) => this;

  /**
   * Removes all previously added effects.
   */
  readonly reset: () => this;

  /**
   * Calls the given handler when the composer is reset.
   *
   * If there are no effects in the composer when {@link reset} is called, the
   * handlers are not called.
   *
   * The handler is called after clearing the effects.
   */
  readonly onReset: (handler: FXComposerHandler) => this;

  /**
   * Removes a previously added {@link onReset} handler.
   */
  readonly offReset: (handler: FXComposerHandler) => this;

  /**
   * Calls the given handler whenever the composer is triggered.
   *
   * The handler is called after updating the state.
   */
  readonly onTrigger: (handler: FXComposerHandler) => this;

  /**
   * Removes a previously added {@link onTrigger} handler.
   */
  readonly offTrigger: (handler: FXComposerHandler) => this;

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
  readonly onTween: (handler: FXComposerHandler) => this;

  /**
   * Removes a previously added {@link onTween} handler.
   */
  readonly offTween: (handler: FXComposerHandler) => this;

  /**
   * Will apply the latest {@link toCss | CSS} to the given elements once.
   *
   * Note that relevant CSS properties are applied directly to the element's
   * style and override current values. You should not have more than one
   * composer animate the same properties (i.e. using the same effect types) on
   * any given element.
   *
   * If you want to combine multiple effects of the same type from multiple
   * composers, {@link add} each relevant composer to the "master" composer and
   * call {@link animate} on it only.
   *
   * It will {@link Utils.waitForMutateTime | waitForMutateTime} before
   * modifying the style.
   *
   * @param negate See {@link toCss}.
   */
  readonly animate: (elements: Element[], negate?: FXComposer) => Promise<this>;

  /**
   * Will clear the relevant {@link toCss | CSS} properties from the given
   * elements.
   *
   * It will {@link Utils.waitForMutateTime | waitForMutateTime} before
   * modifying the style.
   */
  readonly deanimate: (elements: Element[]) => Promise<this>;

  /**
   * Will continually apply the latest {@link toCss | CSS} to the given
   * elements.
   *
   * @param negate See {@link toCss}.
   */
  readonly startAnimate: (elements: Element[], negate?: FXComposer) => this;

  /**
   * Will stop animating the given elements.
   *
   * @param clear If true, the {@link toCss | CSS} properties will be cleared
   *              from the elements now.
   */
  readonly stopAnimate: (elements: Element[], clear?: boolean) => this;

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
   * Returns the current composition, i.e. the combined effects for each type.
   */
  readonly getComposition: () => FXComposition;

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
  ) => this;

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
  ) => this;

  /**
   * This creates a new async generator that will yield update data
   * whenever the returned helper callback is called.
   */
  constructor(config: FXComposerConfig) {
    const {
      parent,
      negate: defaultNegate,
      trigger,
      tweener = "spring",
    } = config ?? {};

    const effectiveConfig: FXComposerEffectiveConfig = {
      parent,
      negate: defaultNegate,
      tweener,
      // updated below in setLag
      lagX: 0,
      lagY: 0,
      lagZ: 0,
      // updated below in setDepth
      depthX: 1,
      depthY: 1,
      depthZ: 1,
    };

    const compositionChain = MH.newSet<Effect | FXComposer>();
    const currentComposition = new FXComposition();

    const resetCallbacks = MH.newMap<FXComposerHandler, FXComposerCallback>();
    const triggerCallbacks = MH.newMap<FXComposerHandler, FXComposerCallback>();
    const tweenCallbacks = MH.newMap<FXComposerHandler, FXComposerCallback>();

    const animatedElements = MH.newMap<
      Element,
      [FXComposerHandler, Set<Element>]
    >();

    const currentFXState = newDefaultState();

    // ----------

    const add = (...links: Array<Effect | FXComposer>) => {
      for (const link of links) {
        compositionChain.add(link);
      }

      return this;
    };

    const remove = (...links: Array<Effect | FXComposer>) => {
      for (const link of links) {
        MH.deleteKey(compositionChain, link);
      }

      return this;
    };

    // ----------

    const reset = () => {
      if (MH.sizeOf(compositionChain) > 0) {
        compositionChain.clear();
        invokeCallbacks(resetCallbacks);
      }

      return this;
    };

    // ----------

    const onReset = (handler: FXComposerHandler) => {
      addNewCallbackToMap(handler, resetCallbacks);
      return this;
    };

    const offReset = (handler: FXComposerHandler) => {
      MH.remove(resetCallbacks.get(handler));
      return this;
    };

    // ----------

    const onTrigger = (handler: FXComposerHandler) => {
      addNewCallbackToMap(handler, triggerCallbacks);
      return this;
    };

    const offTrigger = (handler: FXComposerHandler) => {
      MH.remove(triggerCallbacks.get(handler));
      return this;
    };

    // ----------

    const onTween = (handler: FXComposerHandler) => {
      addNewCallbackToMap(handler, tweenCallbacks);
      return this;
    };

    const offTween = (handler: FXComposerHandler) => {
      MH.remove(tweenCallbacks.get(handler));
      return this;
    };

    // ----------

    const animate = async (elements: Element[], negate?: FXComposer) => {
      await applyCss(elements, false, negate);
      return this;
    };

    const deanimate = async (elements: Element[]) => {
      await applyCss(elements, true);
      return this;
    };

    // ----------

    const startAnimate = (elements: Element[], negate?: FXComposer) => {
      // Use a single handler for all elements for performance gain.
      // Clean it up when all have been called with stopAnimate.
      const relatedElements = MH.newSet(elements);

      const handler = () => {
        applyCss(relatedElements, false, negate);
      };

      const data: [FXComposerHandler, Set<Element>] = [
        handler,
        relatedElements,
      ];

      for (const element of elements) {
        animatedElements.set(element, data);
      }

      handler(); // set the CSS now
      onTween(handler);

      return this;
    };

    // ----------

    const stopAnimate = (elements: Element[], clear?: boolean) => {
      if (clear) {
        applyCss(elements, true); // no need to await
      }

      for (const element of elements) {
        const [handler, relatedElements] = animatedElements.get(element) ?? [];

        MH.deleteKey(animatedElements, element);
        MH.deleteKey(relatedElements, element);
        if (handler && MH.sizeOf(relatedElements) === 0) {
          offTween(handler);
        }
      }

      return this;
    };

    // ----------

    const toCss = (negate?: FXComposer) => {
      const negatedComposition = (negate ?? defaultNegate)?.getComposition();
      const css: Record<string, string> = {};

      for (const [type, effect] of currentComposition) {
        const negatedEffect = negatedComposition?.get(type);
        MH.assign(css, effect.toCss(negatedEffect));
      }

      return css;
    };

    // ----------

    const setLag = (
      input: RawOrRelativeNumber | Partial<FXComposerConfig> | undefined,
    ) => {
      updateConf(input, "lag", settings.effectLag);
      return this;
    };

    const setDepth = (
      input: RawOrRelativeNumber | Partial<FXComposerConfig> | undefined,
    ) => {
      const didUpdate = updateConf(input, "depth", 1);
      if (didUpdate) {
        tween(); // update the effects and call callbacks
      }

      return this;
    };

    // ----------

    const updateConf = <P extends "lag" | "depth">(
      input: RawOrRelativeNumber | Partial<FXComposerConfig> | undefined,
      prop: P,
      defaultValue: number,
    ) => {
      const parentConfig: Partial<FXComposerEffectiveConfig> =
        parent?.getConfig() ?? {};

      let values: Partial<FXComposerConfig>;
      if (MH.isObject(input)) {
        values = input;
      } else {
        values = { [prop]: input };
      }

      let didUpdate = false;
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

        didUpdate ||= effectiveConfig[`${prop}${A}`] !== newVal;

        effectiveConfig[`${prop}${A}`] = newVal;
        currentFXState[a][prop] = newVal;
      }

      return didUpdate;
    };

    // ----------

    const updateState = <T extends boolean | undefined>(
      newState: DeepPartial<FXState> | null,
      updateData?: FXStateUpdate,
      checkIfChanged?: T,
    ) => {
      newState = getUpdatedState(
        MH.merge(currentFXState, newState),
        this,
        updateData,
      );

      let didUpdate: boolean | undefined = undefined;
      if (checkIfChanged) {
        didUpdate = !compareValuesIn(currentFXState, newState, 5);
      }

      MH.assign(currentFXState, newState); // override current state object

      return didUpdate as T extends boolean ? boolean : void;
    };

    // ----------

    const invokeCallbacks = (
      callbacks: Map<FXComposerHandler, FXComposerCallback>,
    ) => {
      for (const cbk of callbacks.values()) {
        cbk.invoke(deepCopy(currentFXState), this);
      }
    };

    // ----------

    let isTweening = false;
    const tween = async () => {
      if (isTweening) {
        return;
      }

      isTweening = true;

      const tweenGenerator = tween3DAnimationGenerator(tweener, currentFXState);
      while (true) {
        const tweenUpdate: Tween3DUpdate<keyof FXState> = {};
        for (const a of ["x", "y", "z"] as const) {
          tweenUpdate[a] = { snap: currentFXState[a].snap };
          for (const p of ["target", "lag"] as const) {
            tweenUpdate[a][p] = currentFXState[a][p];
          }
        }

        const { value: newState, done } =
          await tweenGenerator.next(tweenUpdate);

        if (done) {
          isTweening = false;
          break;
        }

        updateState(newState);
        recompose();
        invokeCallbacks(tweenCallbacks);
      }
    };

    // ----------

    const recompose = () => {
      currentComposition.clear();

      for (const link of compositionChain) {
        if (MH.isInstanceOf(link, FXComposer)) {
          for (const effect of link.getComposition().values()) {
            currentComposition.add(effect);
          }
        } else {
          currentComposition.add(link.update(deepCopy(currentFXState), this));
        }
      }

      return this;
    };

    // ----------

    const pollTrigger = async () => {
      for await (const updateData of trigger()) {
        const didUpdate = updateState(null, updateData, true);

        if (didUpdate) {
          tween();
          invokeCallbacks(triggerCallbacks);
        }
      }
    };

    // ----------

    const applyCss = async (
      elements: Element[] | Set<Element>,
      clear: boolean,
      negate?: FXComposer,
    ) => {
      const css = toCss(negate);
      for (const prop in css) {
        for (const element of elements) {
          if (clear) {
            await setStyleProp(element, prop, css[prop]);
          } else {
            await delStyleProp(element, prop);
          }
        }
      }
    };

    // --------------------

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
    this.getComposition = () => currentComposition.export();
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
   * The trigger to use to get {@link Effects.FXStateUpdate | updates} to the
   * {@link FXAxisState}s.
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

  /**
   * A built-in or custom tweener function to calculate the interpolation from
   * current to target.
   *
   * @defaultValue "spring"
   */
  tweener?: Tweener | { [K in "x" | "y" | "z"]: Tweener };

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
  tweener: Tweener | { [K in "x" | "y" | "z"]: Tweener };
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
    snap: false,
  };

  return deepCopy({ x: axisState, y: axisState, z: axisState });
};
