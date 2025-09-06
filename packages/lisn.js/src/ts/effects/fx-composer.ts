/**
 * @module Effects
 *
 * @since v1.3.0
 *
 * @categoryDescription Composer
 * {@link FXComposer} links together multiple effects or other composers. It
 * works with {@link FXTrigger}s and each time it is triggered, it updates its
 * state and {@link FXComposition | effect composition}. It can animate one or
 * more elements by applying its CSS to them.
 */

import * as _ from "@lisn/_internal";

import {
  AtLeastOne,
  RawOrRelativeNumber,
  DeepPartial,
} from "@lisn/globals/types";

import { settings } from "@lisn/globals/settings";

import { usageError } from "@lisn/globals/errors";

import { setStylePropNow, delStylePropNow } from "@lisn/utils/css-alter";
import { waitForMutateTime } from "@lisn/utils/dom-optimize";
import { logError } from "@lisn/utils/log";
import { isValidNum, toNumWithBounds, toNum } from "@lisn/utils/math";
import { compareValuesIn } from "@lisn/utils/misc";
import {
  animation3DTweener,
  Tweener,
  Animation3DTweenerUpdate,
} from "@lisn/utils/tween";

import {
  CallbackHandler,
  Callback,
  CallbackManager,
  createCallback,
  createCallbackManager,
} from "@lisn/modules/callback";

import type { Effect, EffectInstance } from "@lisn/effects/effect";
import { FXComposition } from "@lisn/effects/fx-composition";
import { FXScrollTrigger, FXTrigger } from "@lisn/effects/fx-trigger";

import {
  createEffectInstance,
  getPinInstance,
  getUpdatedState,
  createTriggerInstance,
  atLeastOneVisible,
  setInstanceGetter,
} from "@lisn/effects/_internal";

import debug from "@lisn/debug/debug";

/**
 * {@link FXComposer} links together multiple effects or other composers. It
 * works with {@link FXTrigger}s and each time it is triggered, it updates
 * tweens or interpolates its state smoothly. It animates one or more elements.
 *
 * @category Composer
 */
export class FXComposer {
  /**
   * Adds one or more links, which can be either an effect or another composer,
   * to the current chain of composition.
   *
   * Adding the same link multiple times will result in it being applied
   * multiple times when the composer updates its composition.
   *
   * If the link is another {@link FXComposer}, its composition will be used
   * "as is" in this composer's composition. This is an efficient way to reuse
   * effects across composers where the effects need to be synchronised.
   *
   * This also allows you to animate a single property of an element (e.g.
   * transform) where the relevant effect's state is the result of multiple
   * composers, each one with different triggers, lag or depth.
   *
   * However, you should **not** animate the same element with multiple
   * composers.
   *
   * **IMPORTANT:** If you add an
   * {@link Effects.EffectConfig.isAbsolute | absolute} effect, or a
   * composer that has absolute effects it discards all previous effects of the
   * respective {@link Effects.EffectInstanceInterface.type | type}.
   */
  readonly add: (...links: Array<Effect | FXComposer>) => this;

  /**
   * Returns true if the composer is running (not paused).
   */
  readonly isActive: () => boolean;

  /**
   * Pauses the composer. It will stop polling the trigger and therefore, stop
   * updating its effects or animating the elements.
   *
   * If the composer is already paused, this does nothing.
   *
   * @param clearCss If true, it will clear the CSS from the elements until
   *                 resumed.
   */
  readonly pause: (clearCss?: boolean) => this;

  /**
   * Resumes the composer.
   */
  readonly resume: () => this;

  /**
   * Calls the given handler when the composer is paused or resumed.
   *
   * The handler is called after updating the state such that calling
   * {@link isActive} from the handler will reflect the latest state.
   */
  readonly onToggle: (handler: FXComposerHandler) => this;

  /**
   * Removes a previously added {@link onToggle} handler.
   */
  readonly offToggle: (handler: FXComposerHandler) => this;

  /**
   * Removes all previously added effects and clears the CSS from the elements
   * being animated. It also {@link pause | pauses} the composer until new
   * effects are added.
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
   * Returns true if the composer has been destroyed.
   */
  readonly isDestroyed: () => boolean;

  /**
   * {@link clear | Clears} the composer and marks it as destroyed. No more
   * effects can be added to it. Its elements can now be animated by other
   * composers.
   */
  readonly destroy: () => this;

  /**
   * Calls the given handler when the composer is destroyed.
   *
   * {@link isDestroyed} from the handler will return true.
   */
  readonly onDestroy: (handler: FXComposerHandler) => this;

  /**
   * Removes a previously added {@link onDestroy} handler.
   */
  readonly offDestroy: (handler: FXComposerHandler) => this;

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
   *   {@link Effects.EffectConfig.isAbsolute | absolute} effects are
   *   updated
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
   * Returns an object with the combined CSS properties and their values from
   * all the effects in the composition. This is the CSS that's applied to the
   * elements being animated.
   *
   * Note that effects of the same type (or class) are composed together, so in
   * general there will likely not be any conflicting values whereby more than
   * one effect returns the same property from their
   * {@link Effects.EffectInstanceInterface.toCss | toCss} method. If there are such
   * cases, then by default subsequent values will override previous ones for
   * that property. However, certain properties are handled as a list and the
   * values are joined. These are:
   * - `transition`
   * - `animation`
   * - `filter`
   * - `transform`
   * - `will-change`
   * - `background`
   *
   * So if multiple effect **types** (e.g. Transform, Filter) return a
   * `transition` property for example, it will be merged.
   */
  readonly toCss: () => Record<string, string>;

  /**
   * Returns **a copy** of the current state of the composition, i.e. the
   * combined state of all effects, one for each effect type.
   *
   * @param discardUpdaters See {@link Effects.EffectInstanceInterface.clone | EffectInstanceInterface.clone}
   */
  readonly getComposition: (discardUpdaters?: boolean) => FXComposition;

  /**
   * Returns **a copy** of the composer's {@link FXState}.
   */
  readonly getState: () => FXState;

  /**
   * Returns the list of elements being animated by the composer.
   */
  readonly getElements: () => Element[];

  /**
   * Adds to the list of elements being animated by the composer.
   */
  readonly addElements: (...elements: Element[]) => this;

  /**
   * Resets the list of elements being animated by the composer.
   */
  readonly setElements: (...elements: Element[]) => this;

  /**
   * Returns the composer's **effective** configuration.
   */
  readonly getConfig: () => FXComposerEffectiveConfig;

  /**
   * Updates the composer's {@link FXComposerConfig.autoStandBy | autoStandBy}
   * setting.
   *
   * @param [autoStandBy = true] If not given, default is true.
   */
  readonly setAutoStandBy: (autoStandBy?: boolean) => this;

  /**
   * Updates the composer's {@link FXComposerConfig.lag | lag}.
   *
   * @param lag If a single number is given, it is set for all three axes.
   *            Otherwise, the format is the same as for {@link FXComposerConfig}.
   */
  readonly setLag: (
    lag:
      | number
      | AtLeastOne<{
          lag: number;
          lagX: number;
          lagY: number;
          lagZ: number;
        }>,
  ) => this;

  /**
   * Updates the composer's {@link FXComposerConfig.depth | parallax depth}.
   *
   * Note that this will result in the effects managed by this composer being
   * updated for this new depth and the {@link onCompose} handlers being called.
   *
   * **NOTE:** Any effects that are
   * {@link Effects.EffectConfig.isAbsolute | absolute}, will update their
   * values as per the new depth. Their handlers will receive the current
   * absolute parameters re-scaled at the new depth. Effects that are **not**
   * {@link Effects.EffectConfig.isAbsolute | absolute} will remain unchanged,
   * since there is no change to the target values of the {@link FXState | state}.
   * Further tweening will result in the delta values received by the handlers
   * of these non-absolute effects being re-scaled at the new depth.
   *
   * @param depth If a single number is given, it is set for all three axes.
   *              Otherwise, the format is the same as for {@link FXComposerConfig}.
   */
  readonly setDepth: (
    depth:
      | number
      | AtLeastOne<{
          depth: number;
          depthX: number;
          depthY: number;
          depthZ: number;
        }>,
  ) => this;

  /**
   * @param elements The elements the composer will animate.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If any of the elements are already being animated by another
   *                composer.
   */
  constructor(elements: Iterable<Element>, config?: FXComposerConfig) {
    const logger = debug
      ? new debug.Logger({
          name: "FXComposer",
          logAtCreation: { elements, config },
        })
      : null;

    // ----- config

    const {
      trigger = new FXScrollTrigger(),
      tweener: userTweener = "spring",
      negateParent = true,
    } = config ?? {};

    const tweener =
      _.isString(userTweener) || _.isFunction(userTweener)
        ? userTweener
        : {
            x: userTweener.x ?? "spring",
            y: userTweener.y ?? "spring",
            z: userTweener.z ?? "spring",
          };

    const effectiveConfig: FXComposerEffectiveConfig = {
      trigger,
      tweener,
      // the remaining is set below when starting
      negated: null,
      autoStandBy: false,
      lagX: 0,
      lagY: 0,
      lagZ: 0,
      depthX: 1,
      depthY: 1,
      depthZ: 1,
    };

    // ----- data

    const compositionChain: Array<EffectInstance | FXComposer> = [];
    const currentComposition = new FXComposition();
    compositions.set(this, currentComposition);

    const animatedElements = _.createSet<Element>();

    const toggleCallbacks = createCallbackManager<FXComposerHandlerArgs>();
    const clearCallbacks = createCallbackManager<FXComposerHandlerArgs>();
    const destroyCallbacks = createCallbackManager<FXComposerHandlerArgs>();
    const triggerCallbacks = createCallbackManager<FXComposerHandlerArgs>();
    const tweenCallbacks = createCallbackManager<FXComposerHandlerArgs>();
    const composeCallbacks = createCallbackManager<FXComposerHandlerArgs>();

    const currentFXState = createState();

    const triggerInstance = createTriggerInstance(trigger);

    let parent = getParentComposer(elements);
    let isActive = false; // we start after initialized
    let isDestroyed = false;
    let isTweening = false;
    let updatePending = false;
    let hasVisibleElements = false;
    let hasIncrementalEffects = false;

    // ----- viewport watching (for auto stand-by)
    // set/reset when updating elements or autoStandBy
    let viewWatch: ReturnType<typeof atLeastOneVisible> | null = null;

    const resetViewWatch = () => {
      viewWatch?.stop();
      // We don't bother figuring out if animated elements are inside a custom
      // scrollable, just use the viewport as the root.
      viewWatch = effectiveConfig.autoStandBy
        ? atLeastOneVisible(animatedElements, (hasVisible) => {
            hasVisibleElements = hasVisible;

            if (
              effectiveConfig.autoStandBy &&
              !hasVisibleElements &&
              !hasIncrementalEffects
            ) {
              pause();
            } else {
              resume();
            }
          })
        : null;
    };

    // ----------

    const recomposeOnOtherCompose = createCallback(() => {
      recompose(UPDATE_NONE);
    }, true);

    const reanimateOnNegatedCompose = createCallback(() => {
      applyCss(); // no need to await
    }, true);

    // ----------

    const add = (link: Effect | FXComposer) => {
      if (_.isInstanceOf(link, FXComposer)) {
        compositionChain.push(link);
        link.onCompose(recomposeOnOtherCompose);
        addToComposition(link);
      } else {
        const effectInstance = createEffectInstance(link, this);
        compositionChain.push(effectInstance);
        addToComposition(effectInstance);

        hasIncrementalEffects ||= !effectInstance.isAbsolute();
      }
    };

    // ----------

    const pause = (options?: {
      _clearCss?: boolean;
      _skipCallbacks?: boolean;
    }) => setRunningState(PAUSE, options);

    const resume = (options?: { _skipCallbacks?: boolean }) =>
      setRunningState(RESUME, options);

    const setRunningState = (
      state: RUNNING_STATE,
      options?: { _clearCss?: boolean; _skipCallbacks?: boolean },
    ) => {
      const activate = state === RESUME;
      if (isActive !== activate && !isDestroyed) {
        logger?.debug5(activate ? "Resuming" : "Pausing");
        const negated = effectiveConfig.negated;

        if (negated) {
          (activate ? negated.onCompose : negated.offCompose)(
            reanimateOnNegatedCompose,
          );
        }

        for (const link of compositionChain) {
          if (_.isInstanceOf(link, FXComposer)) {
            (activate ? link.onCompose : link.offCompose)(
              recomposeOnOtherCompose,
            );
          } else {
            const pinInstance = getPinInstance(this, link);
            if (pinInstance) {
              (activate ? pinInstance.resume : pinInstance.pause)();
            }
          }
        }

        applyCss(!activate && options?._clearCss);

        isActive = activate;
        if (viewWatch) {
          (activate ? viewWatch.start : viewWatch.stop)();
        }

        if (!options?._skipCallbacks) {
          invokeCallbacks(toggleCallbacks);
        }

        if (activate) {
          pollTrigger();
        }
      }

      return this;
    };

    // ----------

    const clear = () => {
      if (_.lengthOf(compositionChain)) {
        logger?.debug5("Clearing");
        pause({ _clearCss: true });

        compositionChain.length = 0; // clear
        currentComposition.clear();

        hasIncrementalEffects = false;

        invokeCallbacks(clearCallbacks);
      }

      return this;
    };

    // ----------

    const destroy = () => {
      if (!isDestroyed) {
        logger?.debug5("Destroying");
        clear();
        isDestroyed = true;

        for (const el of animatedElements) {
          _.deleteKey(allAnimatedElements, el);
        }

        _.deleteKey(compositions, this);

        invokeCallbacks(destroyCallbacks).then(() => {
          toggleCallbacks.clear();
          clearCallbacks.clear();
          destroyCallbacks.clear();
          triggerCallbacks.clear();
          tweenCallbacks.clear();
          composeCallbacks.clear();
        });
      }

      return this;
    };

    // ----------

    const toCss = () => {
      const css: Record<string, string> = {};

      for (const [type__ignored, effect] of currentComposition) {
        const thisCss = effect.toCss();

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

    const setElements = (...elements: Element[]) => {
      for (const el of elements) {
        if (allAnimatedElements.has(el)) {
          throw usageError("Element already animated by another composer");
        }

        allAnimatedElements.set(el, this);
      }

      pause({ _clearCss: true, _skipCallbacks: true });

      animatedElements.clear();
      for (const el of elements) {
        animatedElements.add(el);
      }

      parent = getParentComposer(elements);
      effectiveConfig.negated = negateParent ? parent : null;

      resetViewWatch();
      resume({ _skipCallbacks: true });

      return this;
    };

    // ----------

    const setAutoStandBy = (autoStandBy?: boolean) => {
      if (_.isNullish(autoStandBy)) {
        autoStandBy = false;
        if (parent) {
          const parentConfig = parent.getConfig();
          autoStandBy =
            parentConfig.depthX <= effectiveConfig.depthX &&
            parentConfig.depthY <= effectiveConfig.depthY &&
            parentConfig.depthZ <= effectiveConfig.depthZ;
        }
      }

      if (effectiveConfig.autoStandBy !== autoStandBy) {
        effectiveConfig.autoStandBy = autoStandBy;
        resetViewWatch();
      }

      return this;
    };

    // ----------

    const setLag = (
      input: RawOrRelativeNumber | Partial<FXComposerConfig> | undefined,
    ) => {
      updateConf(input, "lag", settings.effectLag, { min: 0 });
      // No need to re-tween. If it's currently tweening, it will automatically
      // pick up the new lag. Otherwise, effects don't need updating and no need
      // to call onTween handlers.
      return this;
    };

    const setDepth = (
      input: RawOrRelativeNumber | Partial<FXComposerConfig> | undefined,
    ) => {
      const didUpdate = updateConf(input, "depth", 1, { min: 0.01 });
      if (didUpdate) {
        // If it's currently tweening, it will recompose anyway.
        if (!isTweening) {
          recompose(UPDATE_ABSOLUTE);
        }
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
        let newVal = toNum(values[`${prop}${A}`] ?? values[prop], NaN);

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

      updateState(); // will re-apply lag/depth from config
      return didUpdate;
    };

    // ----------

    const updateState = (
      newState?: DeepPartial<FXState> | null,
      updateData?: FXStateUpdate,
    ): boolean => {
      if (newState) {
        _.copyExistingKeysTo(newState, currentFXState);
      }

      const validated = getUpdatedState(currentFXState, updateData);
      const didUpdate = !compareValuesIn(currentFXState, validated, 5);

      logger?.debug10("New state", validated, { didUpdate });
      _.assign(currentFXState, validated); // override current state object

      updatePending ||= didUpdate;

      return didUpdate;
    };

    // ----------

    const addHandler = (
      handler: FXComposerHandler,
      callbacks: CallbackManager<FXComposerHandlerArgs>,
    ) => {
      callbacks.add(handler);
      return this;
    };

    const deleteHandler = (
      handler: FXComposerHandler,
      callbacks: CallbackManager<FXComposerHandlerArgs>,
    ) => {
      callbacks.delete(handler);
      return this;
    };

    const invokeCallbacks = (
      callbacks: CallbackManager<FXComposerHandlerArgs>,
    ) => callbacks.invoke(this);

    // ----------

    const tween = async () => {
      if (isTweening) {
        return;
      }

      isTweening = true;

      logger?.debug7("Starting tween", _.copyNested(currentFXState));
      const tweenGenerator = animation3DTweener(tweener, currentFXState);
      while (true) {
        if (!isActive) {
          break;
        }

        const tweenUpdate: Animation3DTweenerUpdate<keyof FXState> = {};
        for (const a of ["x", "y", "z"] as const) {
          tweenUpdate[a] = { snap: currentFXState[a].snap };
          for (const p of ["target", "lag"] as const) {
            tweenUpdate[a][p] = currentFXState[a][p];
          }
        }

        logger?.debug10("Tweening", tweenUpdate);
        updatePending = false;
        const { value: newState, done } =
          await tweenGenerator.next(tweenUpdate);

        logger?.debug10("Tween result", newState, { done, updatePending });
        if (done) {
          break;
        }

        const partial: DeepPartial<FXState> = {};
        for (const a of ["x", "y", "z"] as const) {
          // target, lag and snap are set by us on each frame, ignore
          for (const p of ["initial", "previous", "current"] as const) {
            partial[a] ??= {};
            partial[a][p] = newState[a][p];
          }

          updatePending ||= newState[a].target !== currentFXState[a].target;
        }

        updateState(partial);
        recompose();
        invokeCallbacks(tweenCallbacks);
      }

      isTweening = false;
      if (updatePending) {
        // restart
        tween();
      }
    };

    // ----------

    const addToComposition = (link: EffectInstance | FXComposer) => {
      if (_.isInstanceOf(link, FXComposer)) {
        for (const effect of compositions.get(link)?.values() ?? []) {
          currentComposition.add(effect);
        }
      } else {
        currentComposition.add(link);
      }
    };

    // ----------

    const recompose = (update: UPDATE_MODE = UPDATE_ALL) => {
      if (_.sizeOf(currentComposition)) {
        currentComposition.clear();
        logger?.debug10("Recomposing", _.copyNested(currentFXState));

        const shouldSkipAbsolute =
          effectiveConfig.autoStandBy && !hasVisibleElements;

        for (const link of compositionChain) {
          if (
            !_.isInstanceOf(link, FXComposer) &&
            (update === UPDATE_ALL ||
              (update === UPDATE_ABSOLUTE && link.isAbsolute())) &&
            (!shouldSkipAbsolute || !link.isAbsolute())
          ) {
            link.update();
          }

          addToComposition(link);
        }

        applyCss(); // no need to await
        invokeCallbacks(composeCallbacks);
      }

      return this;
    };

    // ----------

    let isPolling = false;
    const pollTrigger = async () => {
      if (!isPolling) {
        isPolling = true;

        for await (const updateData of triggerInstance.poll()) {
          if (!isActive) {
            break;
          }

          const didUpdate = updateState(null, updateData);
          logger?.debug9("Got trigger data", { updateData, didUpdate });

          if (didUpdate) {
            invokeCallbacks(triggerCallbacks);
            invokeCallbacks(tweenCallbacks);
            tween();
          }
        }

        isPolling = false;
      }
    };

    // ----------

    const applyCss = async (clearCss = false) => {
      const css = toCss();
      logger?.debug10("Applying CSS ", animatedElements, css, clearCss);
      await waitForMutateTime();
      for (const prop in css) {
        for (const element of animatedElements) {
          if (clearCss) {
            delStylePropNow(element, prop);
          } else {
            setStylePropNow(element, prop, css[prop]);
          }
        }
      }
    };

    // --------------------

    this.add = (...links) => {
      if (isDestroyed) {
        logError(usageError("FXComposer is destroyed"));
        return this;
      }

      logger?.debug7("Adding links", links);

      for (const link of links) {
        add(link);
      }

      resume();
      invokeCallbacks(composeCallbacks);
      return this;
    };

    this.isActive = () => isActive;
    this.pause = (clearCss?: boolean) => pause({ _clearCss: clearCss });
    this.resume = () => resume();
    this.onToggle = (handler) => addHandler(handler, toggleCallbacks);
    this.offToggle = (handler) => deleteHandler(handler, toggleCallbacks);

    this.clear = clear;
    this.onClear = (handler) => addHandler(handler, clearCallbacks);
    this.offClear = (handler) => deleteHandler(handler, clearCallbacks);

    this.isDestroyed = () => isDestroyed;
    this.destroy = destroy;
    this.onDestroy = (handler) => addHandler(handler, destroyCallbacks);
    this.offDestroy = (handler) => deleteHandler(handler, destroyCallbacks);

    this.onTrigger = (handler) => addHandler(handler, triggerCallbacks);
    this.offTrigger = (handler) => deleteHandler(handler, triggerCallbacks);

    this.onTween = (handler) => addHandler(handler, tweenCallbacks);
    this.offTween = (handler) => deleteHandler(handler, tweenCallbacks);

    this.onCompose = (handler) => addHandler(handler, composeCallbacks);
    this.offCompose = (handler) => deleteHandler(handler, composeCallbacks);

    this.toCss = toCss;
    this.getComposition = (discardUpdaters) =>
      currentComposition.clone(discardUpdaters);
    this.getState = () => _.copyNested(currentFXState);
    this.getElements = () => [...animatedElements];
    this.addElements = (...elements: Element[]) =>
      setElements(...animatedElements, ...elements);
    this.setElements = (...elements: Element[]) => setElements(...elements);
    this.getConfig = () => _.copyNested(effectiveConfig);
    this.setAutoStandBy = setAutoStandBy;
    this.setLag = setLag;
    this.setDepth = setDepth;

    // SETUP --------------------

    setAutoStandBy(config?.autoStandBy);

    // Set default lag now, since if it's not supplied in the config, it won't
    // update it. Depth is already at default of 1.
    setLag(settings.effectLag);

    setLag(config);
    setDepth(config);

    setElements(...elements); // it will resume when done

    logger?.debug5(effectiveConfig);
  }
}

/**
 * @category Composer
 */
export type FXComposerConfig = {
  /**
   * The trigger to use. By default an {@link FXScrollTrigger} is used with the
   * default scrollable (see
   * {@link Watchers.OnScrollOptions.scrollable | ScrollWatcher})
   *
   * @defaultValue undefined // new FXScrollTrigger()
   */
  trigger?: FXTrigger;

  /**
   * A built-in or custom tweener function to calculate the interpolation from
   * current to target.
   *
   * @defaultValue "spring"
   */
  tweener?: Tweener | { [K in "x" | "y" | "z"]?: Tweener };

  /**
   * If the elements you are animating with this composer are descendants of
   * another element that's being animated by another composer, then by default
   * effects that support negation, like transforms, will cancel out the closest
   * parent composer's effects so as to treat the transformation as absolute
   * rather than relative to the parent. (Remember, transforming an element,
   * transforms also all its children, and applying transforms to the children
   * only "adds" to the overall transform).
   *
   * **IMPORTANT:** Either all, or none of the elements you pass to this
   * composer must be descendants of another composer's element. Otherwise this
   * won't work as expected.
   *
   * Set this to false to disable this behaviour.
   *
   * @defaultValue true
   */
  negateParent?: boolean;

  /**
   * If true, then if all of the composer's elements are outside the viewport,
   * the composer will temporarily stop updating effects that are
   * {@link Effects.EffectConfig.isAbsolute | absolute}. And if all of the
   * composer's effects are absolute, the composer will temporarily
   * {@link FXComposer.pause | pause}.
   *
   * Set this to false to disable this behaviour.
   *
   * If not specified, the default value is true if this composer has a
   * parent composer (see {@link negateParent}) whose depth is smaller than or
   * equal to this composer's depth along each axis. (If the parent's depth is
   * larger, then this composer's elements may be translated by larger distances
   * than the parent, in which case auto stand-by doesn't work reliably).
   *
   * Note that if you change this composer's depth or the parent composer's
   * depth later on, {@link autoStandBy} **won't** be updated.
   *
   * @defaultValue undefined // See explanation above
   */
  autoStandBy?: boolean;

  /**
   * The time in milliseconds it takes for effect states to catch up to the
   * {@link FXState | target parameters}.
   *
   * It must result in a non-negative number, otherwise it will be forced to 0.
   *
   * @defaultValue {@link settings.effectLag}
   */
  lag?: number;

  /**
   * The {@link lag} along the X axis only.
   *
   * @defaultValue {@link lag}
   */
  lagX?: number;

  /**
   * The {@link lag} along the Y axis only.
   *
   * @defaultValue {@link lag}
   */
  lagY?: RawOrRelativeNumber;

  /**
   * The {@link lag} along the Z axis only.
   *
   * @defaultValue {@link lag}
   */
  lagZ?: RawOrRelativeNumber;

  /**
   * Parallax depth.
   *
   * It must be >= 0.01, otherwise it is forced to 0.01.
   *
   * Refer to each specific {@link Effect} to see whether and how it is used.
   *
   * Currently the only built-in effect using parallax depth is
   * {@link Effects.Transform | Transform}'s translation.
   *
   * @defaultValue 1
   */
  depth?: number;

  /**
   * The {@link depth} along the X axis only.
   *
   * @defaultValue {@link depth}
   */
  depthX?: number;

  /**
   * The {@link depth} along the Y axis only.
   *
   * @defaultValue {@link depth}
   */
  depthY?: number;

  /**
   * The {@link depth} along the Z axis only.
   *
   * @defaultValue {@link depth}
   */
  depthZ?: number;
};

/**
 * @category Composer
 */
export type FXComposerEffectiveConfig = {
  trigger: FXTrigger;
  tweener: Tweener | { [K in "x" | "y" | "z"]: Tweener };
  negated: FXComposer | null;
  autoStandBy: boolean;
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
 *
 * @category Composer
 */
export type FXComposerHandlerArgs = [FXComposer];
/**
 * @category Composer
 */
export type FXComposerCallback = Callback<FXComposerHandlerArgs>;
/**
 * @category Composer
 */
export type FXComposerHandler =
  | FXComposerCallback
  | CallbackHandler<FXComposerHandlerArgs>;

/**
 * The update for an axis (low, high and target) values.
 *
 * @category Composer
 */
export type FXAxisStateUpdate = {
  /**
   * The new low value. If it is greater than {@link high}, they are swapped.
   */
  low?: number;

  /**
   * The new high value. If it is less than {@link low}, they are swapped.
   */
  high?: number;

  /**
   * The new target value which we're interpolating towards.
   *
   * If it exceeds the current {@link FXAxisState.high} value, the high will be
   * updated to this target value.
   *
   * If it is below the current {@link FXAxisState.low} value, the low will be
   * updated to this target value.
   */
  target?: number;

  /**
   * If set to true, it tells the composer not to tween, but instead jump
   * straight to the target value.
   *
   * This gets defaulted back to false during each update unless you explicitly
   * set it to `true`.
   */
  snap?: boolean;
};

/**
 * @category Composer
 */
export type FXStateUpdate = {
  x?: FXAxisStateUpdate;
  y?: FXAxisStateUpdate;
  z?: FXAxisStateUpdate;
};

/**
 * The current state of an axis (X, Y or Z).
 *
 * @category Composer
 */
export type FXAxisState = {
  /**
   * The low value. Used for computing {@link EffectParams.nx | normalized}
   * parameters.
   *
   * Initial value is 0.
   */
  low: number;

  /**
   * The high value. Used for computing {@link EffectParams.nx | normalized}
   * parameters.
   *
   * Initial value is 0.
   */
  high: number;

  /**
   * The initial value at which the composer started interpolating (since the
   * last trigger).
   *
   * Initial value is 0.
   */
  initial: number;

  /**
   * The value at the last animation frame.
   *
   * Initial value is 0.
   */
  previous: number;

  /**
   * The current value.
   *
   * Initial value is 0.
   */
  current: number;

  /**
   * The target value which the composer is interpolating towards.
   *
   * Initial value is 0.
   */
  target: number;

  /**
   * The composer's {@link Effects.FXComposerConfig.lag | lag} for this axis.
   */
  lag: number;

  /**
   * The composer's {@link Effects.FXComposerConfig.depth | depth} for this
   * axis.
   */
  depth: number;

  /**
   * If true, it means the composer was told to
   * {@link FXAxisStateUpdate.snap | snap} straight to the target value during
   * the last update.
   *
   * Initial value is `false`.
   */
  snap: boolean;
};

/**
 * Describes the whole state of the composer's parameters.
 *
 * @category Composer
 */
export type FXState = {
  x: FXAxisState;
  y: FXAxisState;
  z: FXAxisState;
};

// ------------------------------

type UPDATE_MODE =
  | typeof UPDATE_NONE
  | typeof UPDATE_ABSOLUTE
  | typeof UPDATE_ALL;

type RUNNING_STATE = typeof PAUSE | typeof RESUME;

const UPDATE_NONE: unique symbol = _.SYMBOL() as typeof UPDATE_NONE;
const UPDATE_ABSOLUTE: unique symbol = _.SYMBOL() as typeof UPDATE_ABSOLUTE;
const UPDATE_ALL: unique symbol = _.SYMBOL() as typeof UPDATE_ALL;

const PAUSE: unique symbol = _.SYMBOL() as typeof PAUSE;
const RESUME: unique symbol = _.SYMBOL() as typeof RESUME;

const LIST_PROPERTIES: Record<string, string> = {
  transition: ",",
  animation: ",",
  "will-change": ",",
  background: ",",
  filter: " ",
  transform: " ",
};

const compositions = _.createWeakMap<FXComposer, FXComposition>();
const allAnimatedElements = _.createWeakMap<Element, FXComposer>();

const getComposerInstance = (element: Element) =>
  allAnimatedElements.get(element);

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

  return _.copyNested({ x: axisState, y: axisState, z: axisState });
};

const getParentComposer = (elements: Iterable<Element>): FXComposer | null => {
  // check only the first element, since either all or none of them should be
  // descendants
  let el = [...elements][0]?.parentElement;

  while (el) {
    const composer = allAnimatedElements.get(el);
    if (composer) {
      return composer;
    }
    el = el.parentElement;
  }

  return null;
};

// --------------------

setInstanceGetter("composer", getComposerInstance);

_.brandClass(FXComposer, "FXComposer");
