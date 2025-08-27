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

import { setStylePropNow, delStylePropNow } from "@lisn/utils/css-alter";
import { waitForMutateTime } from "@lisn/utils/dom-optimize";
import { isValidNum, toNumWithBounds, toRawNum } from "@lisn/utils/math";
import { compareValuesIn, toIterableIfNot } from "@lisn/utils/misc";
import {
  animation3DTweener,
  Tweener,
  Animation3DTweenerUpdate,
} from "@lisn/utils/tween";

import {
  CallbackHandler,
  Callback,
  createCallback,
  invokeHandler,
  addHandlerToMap,
} from "@lisn/modules/callback";
import { createXMap } from "@lisn/modules/x-map";

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
 * state and {@link FXComposition | effect composition}.
 */
export class FXComposer {
  /**
   * Adds one or more links, which can be either an effect or another composer,
   * to the current chain of composition.
   *
   * Effects added here are {@link Effect.toComposition | cloned} beforehand, so
   * you can add the same effect instance to multiple composers, or multiple
   * times to the same composer.
   *
   * Adding the same link multiple times will result in it being applied
   * multiple times when the composer updates its
   * {@link getComposition | composition}.
   *
   * If the given link is an {@link Effect} it will be managed by **this**
   * composer and will be {@link Effect.update | updated} with the composer's
   * state at each frame while it is tweening.
   *
   * Otherwise, if the link is another {@link FXComposer}, its composition will
   * be used as is in this composer's composition and not updated with the state
   * of this composer.
   *
   * This allows you to animate a single property of an element (e.g. transform)
   * by multiple composers, each one with different triggers, lag or depth.
   *
   * However, you should call {@link startAnimate} with the element only on this
   * composer, to which you add all other relevant composers.
   *
   * If you want to clone and use all effects from another composer for this one
   * to manage and update, simply pass `otherComposer.getComposition().values()`
   * as the links to add.
   *
   * **IMPORTANT:** If you add an {@link Effect.isAbsolute | absolute} effect,
   * or a composer that has absolute effects it discards all previous effects of
   * the respective {@link Effect.type | type}.
   *
   * @param pin If given, then when the pin is active, the given effect won't be
   *            updated, but simply added to the composition with its current
   *            state. Only relevant when adding an {@link Effect}, otherwise it
   *            is ignored.
   */
  readonly add: (
    links: Effect | FXComposer | Iterable<Effect | FXComposer>,
    pin?: FXPin,
  ) => this;

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
   * If the state remains unchanged, the handlers are not called.
   *
   * The handler is called after updating the state but before starting to tween
   * such that calling {@link getState} from the handler will reflect the latest
   * state with the new targets, but with the old current values.
   */
  readonly onTrigger: (handler: FXComposerHandler) => this;

  /**
   * Removes a previously added {@link onTrigger} handler.
   */
  readonly offTrigger: (handler: FXComposerHandler) => this;

  /**
   * Calls the given handler whenever the composer tweens (i.e. interpolates)
   * the current {@link FXState}. This happens on every animation frame while
   * interpolating the effects towards the {@link FXAxisState.target | target}
   * parameters following a trigger update.
   *
   * The handler is called once before starting to interpolate following a
   * trigger (same as the {@link onTrigger} handlers, and then it is called
   * during an animation frame after the state has been updated and all effects
   * have been updated and applied, such that calling {@link getState},
   * {@link toCss} or {@link getComposition} from the handler will reflect the
   * latest state or effect composition.
   */
  readonly onTween: (handler: FXComposerHandler) => this;

  /**
   * Removes a previously added {@link onTween} handler.
   */
  readonly offTween: (handler: FXComposerHandler) => this;

  /**
   * Calls the given handler whenever the composer updates its
   * {@link getComposition | composition}. This happens **as long as there are
   * effects or composers {@link add | added}** and then one of these occurs:
   * - new effects or composers are {@link add | added}
   * - the composer triggered with new data and tweens
   * - any other composers {@link add | added} update their composition
   * - the composer's {@link setDepth | depth is updated} and subsequently the
   *   {@link Effect.isAbsolute | absolute} effects are updated
   *
   * The handler is called after updating its composition, such that calling
   * {@link toCss} or {@link getComposition} from the handler will reflect the
   * latest effect composition.
   */
  readonly onCompose: (handler: FXComposerHandler) => this;

  /**
   * Removes a previously added {@link onCompose} handler.
   */
  readonly offCompose: (handler: FXComposerHandler) => this;

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
  readonly animate: (
    elements: Element | Element[],
    negate?: FXComposer,
  ) => Promise<this>;

  /**
   * Will clear the relevant {@link toCss | CSS} properties from the given
   * elements.
   *
   * It will {@link Utils.waitForMutateTime | waitForMutateTime} before
   * modifying the style.
   */
  readonly deanimate: (elements: Element | Element[]) => Promise<this>;

  /**
   * Will continually apply the latest {@link toCss | CSS} to the given
   * elements.
   *
   * @param negate See {@link toCss}. The given negated composer will be watched
   *               for any changes in its composition, and this will result in
   *               updating the CSS on the elements.
   */
  readonly startAnimate: (
    elements: Element | Element[],
    negate?: FXComposer,
  ) => this;

  /**
   * Will stop animating the given elements.
   *
   * @param clearCss If true, the {@link toCss | CSS} properties will be cleared
   *                 from the elements now.
   */
  readonly stopAnimate: (
    elements: Element | Element[],
    clearCss?: boolean,
  ) => this;

  /**
   * Returns an object with the combined CSS properties and their values from
   * all the effects in the composition.
   *
   * Note that effects of the same type (or class) are composed together, so in
   * general there will likely not be any conflicting values whereby more than
   * one effect returns the same property from their {@link Effect.toCss | toCss}
   * method. If there are such cases, then by default subsequent values will
   * override previous ones for the property. However, certain properties are
   * handled as a list and the values are joined. These are:
   * - `transition`
   * - `animation`
   * - `filter`
   * - `transform`
   * - `will-change`
   * - `background`
   *
   * @param negate If given, then for every effect in the composition, the
   *               corresponding effect (of the same type) in the given negated
   *               composer's composition will be queried, and used for
   *               negation. See {@link Effect.export}
   */
  readonly toCss: (negate?: FXComposer) => Record<string, string>;

  /**
   * Returns the current state of the composition, i.e. the combined state of
   * all effects for each effect type.
   *
   * It is a **live** copy of the composition, where each effect is
   * {@link Effect.toComposition | cloned} while preserving its handlers.
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
   * Note that if the value is relative to the parent's lag, it is resolved at
   * the time of this call to {@link setLag} and not updated when the parent's
   * lag changes.
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
   * Note that if the value is relative to the parent's depth, it is resolved at
   * the time of this call to {@link setDepth} and not updated when the parent's
   * depth changes.
   *
   * Note that this will result in the effects managed by this composer being
   * updated for this new depth and the {@link onCompose} handlers being called.
   *
   * **NOTE:** Any effects that are {@link Effect.isAbsolute | absolute}, will
   * update their values as per the new depth. Their handlers will receive the
   * current parameters re-scaled at the new depth. Effects that are **not**
   * {@link Effect.isAbsolute | absolute} will remain unchanged, since there is
   * no change to the target values of the {@link FXState | state}. Further
   * tweening will result in the delta values received by the handlers of these
   * non-absolute effects being re-scaled at the new depth.
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
    const logger = debug
      ? new debug.Logger({ name: "FXComposer", logAtCreation: config })
      : null;

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
    const composeCallbacks = _.createMap<
      FXComposerHandler,
      FXComposerCallback
    >();

    const animatedElements = _.createMap<Element, FXComposer | undefined>();
    const animatedElementsByNegated = createXMap<FXComposer, Set<Element>>(() =>
      _.createSet(),
    );

    const currentFXState = createState();

    // ----------

    const recomposeOnOtherCompose = createCallback(() => {
      recompose(false);
    }, true);

    const reanimateOnNegatedCompose = createCallback((negate: FXComposer) => {
      const elements = animatedElementsByNegated.get(negate);
      if (elements) {
        applyCss(elements, false, negate); // no need to await
      }
    }, true);

    // ----------

    const add = (
      links: Effect | FXComposer | Iterable<Effect | FXComposer>,
      pin?: FXPin,
    ) => {
      logger?.debug7("Adding link ", links, pin);

      const linksIter = toIterableIfNot(links);

      for (let link of linksIter) {
        if (_.isInstanceOf(link, FXComposer)) {
          compositionChain.push([link, void 0]);
          link.onCompose(recomposeOnOtherCompose);
        } else {
          link = link.toComposition(); // clone
          compositionChain.push([link, pin]);
        }

        addToComposition(link, false);
      }

      invokeCallbacks(composeCallbacks);

      return this;
    };

    // ----------

    const clear = () => {
      logger?.debug5("Clearing");
      if (_.lengthOf(compositionChain) > 0) {
        for (const [link] of compositionChain) {
          if (_.isInstanceOf(link, FXComposer)) {
            link.offCompose(recomposeOnOtherCompose);
          }
        }

        compositionChain.length = 0; // clear
        currentComposition.clear();

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

    const onCompose = (handler: FXComposerHandler) => {
      addHandlerToMap(handler, composeCallbacks);
      return this;
    };

    const offCompose = (handler: FXComposerHandler) => {
      _.remove(composeCallbacks.get(handler));
      return this;
    };

    // ----------

    const animate = async (
      elements: Element | Element[],
      negate?: FXComposer,
    ) => {
      await applyCss(toIterableIfNot(elements), false, negate);
      return this;
    };

    const deanimate = async (elements: Element | Element[]) => {
      await applyCss(toIterableIfNot(elements), true);
      return this;
    };

    // ----------

    const startAnimate = (
      elements: Element | Element[],
      negate?: FXComposer,
    ) => {
      logger?.debug5("Starting animating ", elements, negate);

      const elementsIter = toIterableIfNot(elements);
      const negatedComposer = negate ?? defaultNegate;

      for (const element of elementsIter) {
        // clean up previous entry if there was one using another composer to negate
        stopAnimate(element);

        if (negatedComposer) {
          animatedElementsByNegated.sGet(negatedComposer).add(element);
          negatedComposer.onCompose(reanimateOnNegatedCompose);
        }

        animatedElements.set(element, negatedComposer);
      }

      // apply the CSS now
      applyCss(elementsIter, false, negate); // no need to await

      return this;
    };

    // ----------

    const stopAnimate = (elements: Element | Element[], clearCss?: boolean) => {
      logger?.debug5("Stopping animating ", elements, clearCss);

      const elementsIter = toIterableIfNot(elements);

      if (clearCss) {
        applyCss(elementsIter, true); // no need to await
      }

      for (const element of elementsIter) {
        const negatedComposer = animatedElements.get(element);
        _.deleteKey(animatedElements, element);

        if (negatedComposer) {
          const relatedElements =
            animatedElementsByNegated.get(negatedComposer);

          _.deleteKey(relatedElements, element);

          if (_.sizeOf(relatedElements) === 0) {
            // no more elements using the old negated composer
            negatedComposer.offCompose(reanimateOnNegatedCompose);
            _.deleteKey(animatedElementsByNegated, negatedComposer);
          }
        }
      }

      return this;
    };

    // ----------

    const toCss = (negate?: FXComposer) => {
      const negatedComposer = negate ?? defaultNegate;
      const negatedComposition = negatedComposer?.getComposition();
      const css: Record<string, string> = {};

      for (const [type, effect] of currentComposition) {
        const negatedEffect = negatedComposition?.get(type);
        const thisCss = effect.toCss(negatedEffect);

        for (const p in thisCss) {
          const val = _.STRING(thisCss[p]);

          if (p in LIST_PROPERTIES && p in css) {
            const listSep = LIST_PROPERTIES[p];
            css[p] += listSep + val;
          } else {
            css[p] = val;
          }
        }
      }

      return css;
    };

    // ----------

    const setLag = (
      input: RawOrRelativeNumber | Partial<FXComposerConfig> | undefined,
    ) => {
      updateConf(input, "lag", settings.effectLag, { min: 0 });
      // Update the current state. No need to re-tween. If it's currently
      // tweening, it will automatically pick up the new lag. Otherwise, effects
      // don't need updating and no need to call onTween handlers.
      updateState(); // will re-apply lag from config

      return this;
    };

    const setDepth = (
      input: RawOrRelativeNumber | Partial<FXComposerConfig> | undefined,
    ) => {
      const didUpdate = updateConf(input, "depth", 1, { min: 0.01 });
      if (didUpdate) {
        recompose(UPDATE_ABSOLUTE);
      }

      return this;
    };

    // ----------

    const updateConf = <P extends "lag" | "depth">(
      input: RawOrRelativeNumber | Partial<FXComposerConfig> | undefined,
      prop: P,
      defaultValue: number,
      bounds?: AtLeastOne<{ min: number; max: number }>,
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
        let newVal = toRawNum(
          values[`${prop}${A}`] ?? values[prop],
          parentVal,
          NaN,
        );

        if (!isValidNum(newVal)) {
          continue;
        }

        if (bounds) {
          newVal = toNumWithBounds(newVal, bounds);
        }

        didUpdate ||= effectiveConfig[`${prop}${A}`] !== newVal;

        effectiveConfig[`${prop}${A}`] = newVal;
        currentFXState[a][prop] = newVal;
      }

      return didUpdate;
    };

    // ----------

    const updateState = <T extends boolean | undefined>(
      newState?: DeepPartial<FXState> | null,
      updateData?: FXStateUpdate,
      checkIfChanged?: T,
    ) => {
      if (newState) {
        _.copyExistingKeysTo(newState, currentFXState);
      }
      const validated = getUpdatedState(currentFXState, this, updateData);

      let didUpdate: boolean | undefined = void 0;

      if (checkIfChanged) {
        didUpdate = !compareValuesIn(currentFXState, validated, 5);
      }

      logger?.debug10("New state", validated);
      _.assign(currentFXState, validated); // override current state object

      return didUpdate as T extends boolean ? boolean : void;
    };

    // ----------

    const invokeCallbacks = (
      callbacks: Map<FXComposerHandler, FXComposerCallback>,
    ) => {
      for (const cbk of callbacks.values()) {
        invokeHandler(cbk, this);
      }
    };

    // ----------

    let isTweening = false;
    const tween = async () => {
      if (isTweening) {
        return;
      }

      isTweening = true;

      logger?.debug7("Starting tween", _.deepCopy(currentFXState));
      const tweenGenerator = animation3DTweener(tweener, currentFXState);
      while (true) {
        const tweenUpdate: Animation3DTweenerUpdate<keyof FXState> = {};
        for (const a of ["x", "y", "z"] as const) {
          tweenUpdate[a] = { snap: currentFXState[a].snap };
          for (const p of ["target", "lag"] as const) {
            tweenUpdate[a][p] = currentFXState[a][p];
          }
        }

        logger?.debug10("Tweening", tweenUpdate);
        const { value: newState, done } =
          await tweenGenerator.next(tweenUpdate);

        logger?.debug10("Tween result", done, newState);
        if (done) {
          isTweening = false;
          break;
        }

        const partial: DeepPartial<FXState> = {};
        for (const a of ["x", "y", "z"] as const) {
          // target, lag and snap are set by us on each frame, ignore
          for (const p of ["initial", "previous", "current"] as const) {
            partial[a] ??= {};
            partial[a][p] = newState[a][p];
          }
        }

        updateState(partial);
        recompose();
        invokeCallbacks(tweenCallbacks);
      }
    };

    // ----------

    const addToComposition = (
      link: Effect | FXComposer,
      updateMode: false | UPDATE_MODE = UPDATE_ALL,
    ) => {
      if (_.isInstanceOf(link, FXComposer)) {
        for (const effect of link.getComposition().values()) {
          currentComposition.add(effect);
        }
      } else {
        if (
          updateMode === UPDATE_ALL ||
          (updateMode === UPDATE_ABSOLUTE && link.isAbsolute())
        ) {
          link.update(_.deepCopy(currentFXState), this);
        }

        currentComposition.add(link);
      }
    };

    // ----------

    const recompose = (updateMode: false | UPDATE_MODE = UPDATE_ALL) => {
      if (currentComposition.size > 0) {
        currentComposition.clear();
        logger?.debug10("Recomposing", _.deepCopy(currentFXState));

        for (const [link, pin] of compositionChain) {
          addToComposition(link, pin?.isActive() ? false : updateMode);
        }

        for (const [element, negatedComposer] of animatedElements) {
          applyCss([element], false, negatedComposer); // no need to await
        }

        invokeCallbacks(composeCallbacks);
      }

      return this;
    };

    // ----------

    const pollTrigger = async () => {
      for await (const updateData of trigger.poll()) {
        const didUpdate = updateState(null, updateData, true);
        logger?.debug9("Got trigger data", { updateData, didUpdate });

        if (didUpdate) {
          invokeCallbacks(triggerCallbacks);
          invokeCallbacks(tweenCallbacks);
          tween();
        }
      }
    };

    // ----------

    const applyCss = async (
      elements: Iterable<Element>,
      clearCss: boolean,
      negate?: FXComposer,
    ) => {
      const css = toCss(negate);
      logger?.debug10("Applying CSS ", elements, css, clearCss);
      await waitForMutateTime();
      for (const prop in css) {
        for (const element of elements) {
          if (clearCss) {
            delStylePropNow(element, prop);
          } else {
            setStylePropNow(element, prop, css[prop]);
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

    this.onCompose = onCompose;
    this.offCompose = offCompose;

    this.animate = animate;
    this.deanimate = deanimate;
    this.startAnimate = startAnimate;
    this.stopAnimate = stopAnimate;

    this.toCss = toCss;
    this.getComposition = () => currentComposition.clone();
    this.getState = () => _.deepCopy(currentFXState);
    this.getConfig = () => _.deepCopy(effectiveConfig);
    this.setLag = setLag;
    this.setDepth = setDepth;

    // --------------------

    // Set default lag now, since if it's not supplied in the config, it won't
    // update it. Depth is already at default of 1.
    setLag(settings.effectLag);

    setLag(config);
    setDepth(config);

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
   * lag. Note however, that the value is resolved at the time the composer is
   * created and not updated when the parent's lag changes.
   *
   * It must result in a non-negative number, otherwise it will be forced to 0.
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
   * Parallax depth. It can be relative to the parent's depth. Note however,
   * that the value is resolved at the time the composer is created and not
   * updated when the parent's depth changes.
   *
   * It must result in a positive number; minimum allowed is 0.01.
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
 * The handler is invoked with one argument:
 *
 * - The {@link FXComposer} instance.
 */
export type FXComposerHandlerArgs = [FXComposer];
export type FXComposerCallback = Callback<FXComposerHandlerArgs>;
export type FXComposerHandler =
  | FXComposerCallback
  | CallbackHandler<FXComposerHandlerArgs>;

// ------------------------------

type UPDATE_MODE = typeof UPDATE_ALL | typeof UPDATE_ABSOLUTE;

const UPDATE_ALL = 0;
const UPDATE_ABSOLUTE = 1;

const LIST_PROPERTIES: Record<string, string> = {
  transition: ",",
  animation: ",",
  "will-change": ",",
  background: ",",
  filter: " ",
  transform: " ",
};

const createState = (): FXState => {
  const axisState: FXAxisState = {
    low: 0,
    high: 0,
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
