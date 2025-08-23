/**
 * @module Effects
 *
 * @since v1.3.0
 */

import * as _ from "@lisn/_internal";

import { settings } from "@lisn/globals/settings";

import {
  AtLeastOne,
  RawOrRelativeNumber,
  DeepPartial,
} from "@lisn/globals/types";

import { setStyleProp, delStyleProp } from "@lisn/utils/css-alter";
import { toRawNum } from "@lisn/utils/math";
import { compareValuesIn } from "@lisn/utils/misc";
import {
  animation3DTweener,
  Tweener,
  Animation3DTweenerUpdate,
} from "@lisn/utils/tween";

import {
  CallbackHandler,
  Callback,
  invokeHandler,
  addHandlerToMap,
} from "@lisn/modules/callback";

import {
  Effect,
  FXAxisState,
  FXState,
  FXStateUpdate,
  getUpdatedState,
} from "@lisn/effects/effect";

import { FXComposition } from "@lisn/effects/fx-composition";
import { FXScrollTrigger, FXTrigger } from "@lisn/effects/fx-trigger";
import { FXPin } from "@lisn/effects/fx-pin";

import debug from "@lisn/debug/debug";

/**
 * {@link FXComposer} links together multiple effects or other composers. It
 * works with {@link FXTrigger}s and each time it is triggered, it updates its
 * effects.
 */
export class FXComposer {
  /**
   * Adds an effect or another composer to the current chain of composition.
   *
   * Adding the same link multiple times will result in it being applied
   * multiple times when the composer updates its
   * {@link getComposition | composition}.
   *
   * If the given link is an {@link Effect} it will be managed by **this**
   * composer and will be {@link Effect.update | updated} with the composer's
   * state at each frame while it is tweening.
   *
   * Otherwise, if the link is another {@link FXComposer}, it will simply be
   * queried for its current {@link getComposition | composition} each time this
   * composer tweens and the returned composed effects will be used as is in the
   * state of this composer's composition.
   *
   * This allows you to animate a single property of an element (e.g. transform)
   * by multiple composers, each one with different triggers, lag or depth.
   *
   * However, you should call {@link startAnimate} with the element only on this
   * composer, to which you add all other relevant composers.
   *
   * **NOTE:** Effects added here are {@link Effect.toComposition | cloned}
   * beforehand, so you can add the same effect instance to multiple composers,
   * or multiple times to the same composer.
   *
   * **IMPORTANT:** If you add an {@link Effect.isAbsolute | absolute} effect,
   * or a composer that has absolute effects it essentially discards all
   * previous effects of the respective {@link Effect.type | type}.
   *
   * @param pin If given, then when the pin is active, the given effect won't be
   *            updated, but simply added to the composition with its current
   *            state. Only relevant when adding an {@link Effect}, otherwise it
   *            is ignored.
   */
  readonly add: (link: Effect | FXComposer, pin?: FXPin) => this;

  /**
   * Removes all previously added effects.
   */
  readonly clear: () => this;

  /**
   * Calls the given handler when the composer is cleared.
   *
   * If there are no effects in the composer when {@link clear} is called, the
   * handlers are not called.
   *
   * The handler is called after clearing the effects.
   */
  readonly onClear: (handler: FXComposerHandler) => this;

  /**
   * Removes a previously added {@link onClear} handler.
   */
  readonly offClear: (handler: FXComposerHandler) => this;

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
   * been updated and applied, such that calling {@link toCss} or
   * {@link getComposition} will reflect the latest effect states.
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
   * @param clearCss If true, the {@link toCss | CSS} properties will be cleared
   *                 from the elements now.
   */
  readonly stopAnimate: (elements: Element[], clearCss?: boolean) => this;

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
   * Returns the current state of the composition, i.e. the combined state of
   * all effects for each effect type.
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
  constructor(config?: FXComposerConfig) {
    const {
      parent,
      negate: defaultNegate,
      tweener = "spring",
      trigger = new FXScrollTrigger(),
    } = config ?? {};

    const effectiveConfig: FXComposerEffectiveConfig = {
      trigger,
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

    const compositionChain: Array<[Effect | FXComposer, FXPin | undefined]> =
      [];
    const currentComposition = new FXComposition();

    const clearCallbacks = _.createMap<FXComposerHandler, FXComposerCallback>();
    const triggerCallbacks = _.createMap<
      FXComposerHandler,
      FXComposerCallback
    >();
    const tweenCallbacks = _.createMap<FXComposerHandler, FXComposerCallback>();

    const animatedElements = _.createMap<
      Element,
      [FXComposerHandler, Set<Element>]
    >();

    const currentFXState = createState();

    // ----------

    const add = (link: Effect | FXComposer, pin?: FXPin) => {
      logger?.debug7("Adding link ", link, pin);
      if (_.isInstanceOf(link, FXComposer)) {
        compositionChain.push([link, void 0]);
      } else {
        compositionChain.push([link.toComposition(), pin]);
      }

      return this;
    };

    // ----------

    const clear = () => {
      logger?.debug5("Clearing");
      if (_.lengthOf(compositionChain) > 0) {
        compositionChain.length = 0; // clear
        invokeCallbacks(clearCallbacks);
      }

      return this;
    };

    // ----------

    const onClear = (handler: FXComposerHandler) => {
      addHandlerToMap(handler, clearCallbacks);
      return this;
    };

    const offClear = (handler: FXComposerHandler) => {
      _.remove(clearCallbacks.get(handler));
      return this;
    };

    // ----------

    const onTrigger = (handler: FXComposerHandler) => {
      addHandlerToMap(handler, triggerCallbacks);
      return this;
    };

    const offTrigger = (handler: FXComposerHandler) => {
      _.remove(triggerCallbacks.get(handler));
      return this;
    };

    // ----------

    const onTween = (handler: FXComposerHandler) => {
      addHandlerToMap(handler, tweenCallbacks);
      return this;
    };

    const offTween = (handler: FXComposerHandler) => {
      _.remove(tweenCallbacks.get(handler));
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
      logger?.debug5("Starting animating ", elements, negate);
      // Use a single handler for all elements for performance gain.
      // Clean it up when all have been called with stopAnimate.
      const relatedElements = _.createSet(elements);

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

    const stopAnimate = (elements: Element[], clearCss?: boolean) => {
      logger?.debug5("Stopping animating ", elements, clearCss);
      if (clearCss) {
        applyCss(elements, true); // no need to await
      }

      for (const element of elements) {
        const [handler, relatedElements] = animatedElements.get(element) ?? [];

        _.deleteKey(animatedElements, element);
        _.deleteKey(relatedElements, element);
        if (handler && _.sizeOf(relatedElements) === 0) {
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
        _.assign(css, effect.toCss(negatedEffect));
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
      if (_.isObject(input)) {
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
        _.merge(currentFXState, newState),
        this,
        updateData,
      );

      let didUpdate: boolean | undefined = void 0;

      if (checkIfChanged) {
        didUpdate = !compareValuesIn(currentFXState, newState, 5);
      }

      _.assign(currentFXState, newState); // override current state object

      return didUpdate as T extends boolean ? boolean : void;
    };

    // ----------

    const invokeCallbacks = (
      callbacks: Map<FXComposerHandler, FXComposerCallback>,
    ) => {
      for (const cbk of callbacks.values()) {
        invokeHandler(cbk, _.deepCopy(currentFXState), this);
      }
    };

    // ----------

    let isTweening = false;
    const tween = async () => {
      if (isTweening) {
        return;
      }

      isTweening = true;

      const tweenGenerator = animation3DTweener(tweener, currentFXState);
      while (true) {
        const tweenUpdate: Animation3DTweenerUpdate<keyof FXState> = {};
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

      for (const [link, pin] of compositionChain) {
        if (_.isInstanceOf(link, FXComposer)) {
          for (const effect of link.getComposition().values()) {
            currentComposition.add(effect);
          }
        } else {
          currentComposition.add(
            pin?.isActive()
              ? link
              : link.update(_.deepCopy(currentFXState), this),
          );
        }
      }

      return this;
    };

    // ----------

    const pollTrigger = async () => {
      for await (const updateData of trigger.poll()) {
        const didUpdate = updateState(null, updateData, true);
        logger?.debug9("Got trigger data", { updateData, didUpdate });

        if (didUpdate) {
          tween();
          invokeCallbacks(triggerCallbacks);
        }
      }
    };

    // ----------

    const applyCss = async (
      elements: Element[] | Set<Element>,
      clearCss: boolean,
      negate?: FXComposer,
    ) => {
      const css = toCss(negate);
      logger?.debug10("Applying CSS ", elements, css, clearCss);
      for (const prop in css) {
        for (const element of elements) {
          if (clearCss) {
            await delStyleProp(element, prop);
          } else {
            await setStyleProp(element, prop, css[prop]);
          }
        }
      }
    };

    // --------------------

    this.add = add;

    this.clear = clear;
    this.onClear = onClear;
    this.offClear = offClear;

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
    this.getState = () => _.deepCopy(currentFXState);
    this.getConfig = () => _.deepCopy(effectiveConfig);
    this.setLag = setLag;
    this.setDepth = setDepth;

    // --------------------

    setLag(config);
    setDepth(config);

    const logger = debug
      ? new debug.Logger({ name: "FXComposer", logAtCreation: effectiveConfig })
      : null;

    pollTrigger();
  }
}

export type FXComposerConfig = {
  /**
   * The parent composer. Used for resolving relative values of lag or depth.
   *
   * @defaultValue undefined
   */
  parent?: FXComposer;

  /**
   * The trigger to use. By default an {@link FXScrollTrigger} is used with the
   * default scrollable (see
   * {@link Watchers/ScrollWatcher.OnScrollOptions.scrollable | ScrollWatcher})
   *
   * @defaultValue undefined // new FXScrollTrigger()
   */
  trigger?: FXTrigger;

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
  trigger: FXTrigger;
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

const createState = (): FXState => {
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

  return _.deepCopy({ x: axisState, y: axisState, z: axisState });
};

_.brandClass(FXComposer, "FXComposer");
