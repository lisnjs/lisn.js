/**
 * @module Effects/FXController
 *
 * @since v1.3.0
 */

// XXX TODO a way to temp disable watchers without clearing

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

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
import { ViewWatcher, OnViewCallback } from "@lisn/watchers/view-watcher";

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
   * Removes all previously added effects.
   */
  readonly clear: () => void;

  /**
   * Calls the given handler whenever the controller animates as a result of
   * scroll event. The handler is called at every animation frame **after** all
   * effects have been applied, such that calling {@link toCss} or
   * {@link getComposition} will reflect the latest effect states.
   *
   * @param depth If given, the {@link ScrollOffsets} in the
   * {@link AnimationFrameData} passed to the callback will be re-scaled to this
   * depth. Otherwise the depth will be that of this controller.
   */
  readonly onAnimation: (handler: OnAnimationHandler, depth?: number) => void;

  /**
   * Removes a previously added handler.
   */
  readonly offAnimation: (handler: OnAnimationHandler) => void;

  /**
   * Returns an object with the CSS properties and their values to set for the
   * element being animated.
   *
   * @param relativeTo If the element being animated is nested inside another
   *                   one like that, then pass the parent element's controller
   *                   so that transforms and other effects can be set relative
   *                   to the parent.
   */
  readonly toCss: (relativeTo?: FXController) => Record<string, string>;

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

  constructor(config?: FXControllerConfig) {
    const parent = config?.parent ?? null;
    const parentConfig = parent?.getConfig();
    const parentLagX = parentConfig?.lagX ?? 0;
    const parentLagY = parentConfig?.lagY ?? 0;
    const parentDepth = parentConfig?.depth ?? 1;
    const effectiveConfig: FXControllerEffectiveConfig = {
      scrollable: config?.scrollable ?? parentConfig?.scrollable,
      parent,
      lagX: toRawNum(config?.lagX ?? config?.lag, parentLagX, parentLagX),
      lagY: toRawNum(config?.lagY ?? config?.lag, parentLagY, parentLagY),
      depth: toRawNum(config?.depth, parentDepth, parentDepth),
    };

    const { scrollable, lagX, lagY, depth } = effectiveConfig;

    const shouldUseParent =
      parent && parentConfig && parentConfig.scrollable === scrollable;

    const scrollWatcher = ScrollWatcher.reuse({ [MC.S_DEBOUNCE_WINDOW]: 0 });
    const viewWatcher = ViewWatcher.reuse();
    const effectsMap: EffectsMap = new Map();
    const compositionsMap: CompositionMap = new Map();
    const scrollConditionCallbacks: OnScrollCallback[] = [];
    const viewConditionCallbacks: Array<
      [OnViewCallback, ViewTarget, CommaSeparatedStr<View> | View[]]
    > = [];
    const animationCallbacks: Map<
      OnAnimationHandler,
      [OnAnimationCallback, number | undefined]
    > = MH.newMap();

    const currentFrameData: Partial<AnimationFrameData> = {};
    let isFirstTimeAfterEnable = true;

    // ----------

    const onScroll: OnScrollHandler = (e, scrollData) => {
      currentFrameData.target = {
        isAbsolute: true,
        depth,
        x: scrollData[MC.S_SCROLL_LEFT] / depth,
        nx: scrollData[MC.S_SCROLL_LEFT_FRACTION],
        y: scrollData[MC.S_SCROLL_TOP] / depth,
        ny: scrollData[MC.S_SCROLL_TOP_FRACTION],
      };
      currentFrameData.scroll = scrollData;

      interpolate(); // don't await
    };

    const onAnimationFrame = (data: AnimationFrameData) => {
      MH.assign(currentFrameData, data);

      applyEffects(data);
      callCallbacks(data);
    };

    const callCallbacks = (data: AnimationFrameData) => {
      for (const [cbk, thisDepth] of animationCallbacks.values()) {
        cbk.invoke(cloneData(data, thisDepth), this);
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

        const incrementalOffsets = getIncremental(
          depth,
          currentOffsets,
          prevOffsets,
        );

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
        const cbk: OnScrollCallback = wrapCallback((e__ignored, scrollData) => {
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
        });

        scrollWatcher.onScroll(cbk, { scrollable });
        scrollConditionCallbacks.push(cbk);
      };

      const addViewCondition = (
        activate: boolean,
        { views, target }: ViewReference,
      ) => {
        const cbk = wrapCallback(async () => {
          state._activeSince = activate
            ? (currentFrameData.scroll ??
              (await scrollWatcher.fetchCurrentScroll(scrollable)))
            : null;
        });

        viewWatcher.onView(target, cbk, { views });
        viewConditionCallbacks.push([cbk, target, views]);
      };

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

    // ----------

    this.add = (effects, range) => {
      const state = newEffectState(range);

      for (const effect of effects) {
        const states = effectsMap.get(effect.type) ?? [];
        states.push({ _effect: effect, _state: state });
      }

      return this;
    };

    this.disable = () => {
      isFirstTimeAfterEnable = true;

      for (const cbk of scrollConditionCallbacks) {
        scrollWatcher.offScroll(cbk, scrollable);
      }

      for (const [cbk, target] of viewConditionCallbacks) {
        viewWatcher.offView(target, cbk);
      }

      if (shouldUseParent) {
        parent.offAnimation(onAnimationFrame);
      } else {
        scrollWatcher.offScroll(onScroll, scrollable);
      }
    };

    this.enable = () => {
      for (const cbk of scrollConditionCallbacks) {
        scrollWatcher.onScroll(cbk, { scrollable });
      }

      for (const [cbk, target, views] of viewConditionCallbacks) {
        viewWatcher.onView(target, cbk, { views });
      }

      if (shouldUseParent) {
        parent.onAnimation(onAnimationFrame, depth);
      } else {
        scrollWatcher.onScroll(onScroll, { scrollable });
      }
    };

    this.clear = () => {
      for (const cbk of scrollConditionCallbacks) {
        MH.remove(cbk);
      }

      for (const [cbk] of viewConditionCallbacks) {
        MH.remove(cbk);
      }

      scrollConditionCallbacks.length = 0; // clear
      viewConditionCallbacks.length = 0; // clear
      effectsMap.clear();
    };

    this.onAnimation = (handler, depth) => {
      const callback = wrapCallback(handler);
      callback.onRemove(() => {
        MH.deleteKey(animationCallbacks, handler);
      });

      animationCallbacks.set(handler, [callback, depth]);
    };

    this.offAnimation = (handler) =>
      MH.remove((animationCallbacks?.get(handler) ?? [])[0]);

    this.toCss = (relativeTo) => {
      const css: Record<string, string> = {};
      for (const [type, effect] of compositionsMap) {
        const referenceEffect = relativeTo?.getComposition(type);
        MH.assign(css, effect.toCss(referenceEffect));
      }
      return css;
    };

    this.getComposition = (type) => compositionsMap.get(type);

    this.getConfig = () => MH.copyObject(effectiveConfig);

    // ----------

    this.enable();
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
   * @defaultValue The parent's scrollable or if no parent, then {@link ScrollWatcher} default
   */
  scrollable?: ScrollTarget | undefined;

  /** If the element being animated is nested inside another one like that, then
   * pass the parent element's controller so that transforms and other effects
   * can be set relative to the parent.
   */
  parent?: FXController | null;

  /**
   * The time in milliseconds it takes for effect states to catch up to the
   * actual scroll offset. It can be relative to the parent's lag. It must
   * result in a positive number.
   *
   * @defaultValue 0 // instant
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
   * The special value "auto" is XXX
   *
   * @defaultValue 1
   */
  depth?: RawOrRelativeNumber;
};

export type FXControllerEffectiveConfig = {
  scrollable: ScrollTarget | undefined;
  parent: FXController | null;
  lagX: number;
  lagY: number;
  depth: number;
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

const cloneData = (data: AnimationFrameData, newDepth: number | undefined) => {
  data = deepCopy(data);
  if (!MH.isNullish(newDepth)) {
    const rescale = (offsets: ScrollOffsets) => {
      const factor = offsets.depth / newDepth;
      offsets.depth = newDepth;
      offsets.x *= factor;
      offsets.y *= factor;
    };

    rescale(data.target);
    rescale(data.current);
    rescale(data.sinceLast);
  }

  return data;
};

const getIncremental = (
  depth: number,
  current: ScrollOffsets,
  previous: ScrollOffsets | undefined,
) => {
  const getDiffOf = (key: "x" | "y" | "nx" | "ny") =>
    current[key] - (previous ? previous[key] : 0);

  return {
    isAbsolute: false,
    depth,
    x: getDiffOf("x"),
    nx: getDiffOf("nx"),
    y: getDiffOf("y"),
    ny: getDiffOf("ny"),
  };
};
