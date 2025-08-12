/**
 * @module Modules/FXController
 *
 * @since v1.3.0
 */

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

import { toNum, toRawNum, RawNumberCalculator } from "@lisn/utils/math";
import { getOppositeViews } from "@lisn/utils/views";

import { wrapCallback } from "@lisn/modules/callback";

import {
  Effect,
  // EffectInterface, // XXX
  EffectsList,
  EffectRegistry,
  ScrollOffsets,
} from "@lisn/effects/effect";
// import { Transform } from "@lisn/effects/transform"; // XXX

import {
  ScrollWatcher,
  ScrollData,
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
   * Removes all previously added effects.
   *
   * @returns The same {@link FXController} instance.
   */
  readonly clear: () => FXController;

  /**
   * Applies all added effects for the given scroll data. Effects are only
   * applied if their range condition matches (or if no such condition was
   * supplied).
   *
   * Effects are applied in order of being added. Each effect adds to, or if it's
   * {@link Effect.isAbsolute | absolute} overrides, previous ones of the same
   * category.
   *
   * @param depth          The parallax depth. Will result in offsets being scaled.
   * @param scrollData     The current scroll offsets of the element.
   * @param prevScrollData The last known scroll offsets of the element.
   *
   * @returns The same {@link FXController} instance.
   */
  readonly apply: (
    depth: number,
    scrollData: ScrollData,
    prevScrollData: ScrollData | undefined,
  ) => FXController;

  /**
   * Returns the combined effect for the given type.
   */
  readonly getComposition: <T extends keyof EffectRegistry>(
    type: T,
  ) => Effect<T> | undefined;

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

  constructor(config?: FXControllerConfig) {
    const { scrollable } = config ?? {};

    const effectsMap: EffectsMap = new Map();
    const compositionsMap: CompositionMap = new Map();
    const callbacks: Array<OnScrollCallback | OnViewCallback> = [];

    this.add = (effects, range) => {
      const state = newEffectState(scrollable, callbacks, range);

      for (const effect of effects) {
        const states = effectsMap.get(effect.type) ?? [];
        states.push({ _effect: effect, _state: state });
      }
      return this;
    };

    this.clear = () => {
      for (const cbk of callbacks) {
        cbk.remove();
      }
      callbacks.length = 0; // clear
      effectsMap.clear();
      return this;
    };

    this.apply = (depth, scrollData, prevScrollData) => {
      const incrOffsets = getScrollOffsets(depth, scrollData, prevScrollData);
      const absOffsets = getScrollOffsets(depth, scrollData);

      for (const [type, entries] of effectsMap) {
        const toCompose: Effect<typeof type>[] = [];

        for (const entry of entries) {
          if (entry._state !== null) {
            const effect = entry._effect;
            toCompose.push(
              effect.apply(
                effect.isAbsolute() ? absOffsets : incrOffsets,
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

    this.getComposition = (type) => compositionsMap.get(type);

    this.toCss = (relativeTo) => {
      const css: Record<string, string> = {};
      for (const [type, effect] of compositionsMap) {
        const referenceEffect = relativeTo?.getComposition(type);
        MH.assign(css, effect.toCss(referenceEffect));
      }
      return css;
    };
  }
}

export type FXControllerConfig = {
  /**
   * The parent scrollable element. Required for
   * {@link ScrollReference | scroll-based range conditions}.
   *
   * @defaultValue undefined
   */
  scrollable?: ScrollTarget;
};

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

const newEffectState = (
  scrollable: ScrollTarget | undefined,
  callbacks: Array<OnScrollCallback | OnViewCallback>,
  range: EffectRange | undefined,
) => {
  const scrollWatcher = ScrollWatcher.reuse({ [MC.S_DEBOUNCE_WINDOW]: 0 });
  const viewWatcher = ViewWatcher.reuse();

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

      const leftIsPastRef = offsetIsPastRef(left, scrollData, "x") ?? activate;
      const topIsPastRef = offsetIsPastRef(top, scrollData, "y") ?? activate;
      const isActive = activate === (leftIsPastRef && topIsPastRef);

      state._activeSince = isActive ? scrollData : null;
    });

    scrollWatcher.onScroll(cbk, { scrollable });
    callbacks.push(cbk);
  };

  const addViewCondition = (
    activate: boolean,
    { views, target }: ViewReference,
  ) => {
    const cbk = wrapCallback(async () => {
      state._activeSince = activate
        ? await scrollWatcher.fetchCurrentScroll(scrollable)
        : null;
    });

    viewWatcher.onView(target, cbk, { views });
    callbacks.push(cbk);
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

const getScrollOffsets = (
  depth: number,
  scrollData: ScrollData,
  prevScrollData?: ScrollData,
): ScrollOffsets => {
  const getValue = (key: Exclude<keyof ScrollData, "direction">) =>
    scrollData[key] - (prevScrollData ? prevScrollData[key] : 0);

  return {
    x: getValue(MC.S_SCROLL_LEFT) / depth,
    nx: getValue(MC.S_SCROLL_LEFT_FRACTION),
    y: getValue(MC.S_SCROLL_TOP) / depth,
    ny: getValue(MC.S_SCROLL_TOP_FRACTION),
  };
};

// XXX type testing
// export class Foo implements EffectInterface<"foo"> {
//   readonly type = "foo";
//   readonly isAbsolute!: () => boolean;
//   readonly apply!: (offsets: ScrollOffsets) => Foo;
//   readonly toComposition!: (...others: Foo[]) => Foo;
//   readonly toCss!: (relativeTo?: Foo) => Record<string, string>;
// }
//
// declare module "@lisn/effects/effect" {
//   interface EffectRegistry {
//     foo: Foo;
//   }
// }
//
// const fx = new FXController();
// fx.add([new Transform(), new Foo()]).add([new Transform()]);
// const tr1__ignored = fx.getComposition("transform");
// const tr2__ignored: Transform | undefined = fx.getComposition("transform");
//
// const foo = <TL extends readonly (keyof EffectRegistry)[]>(
//   effects: EffectsList<TL>,
// ) => effects;
//
// const bar = <TL extends readonly (keyof EffectRegistry)[]>(
//   ...effects: EffectsList<TL>
// ) => effects;
//
// const x1__ignored = foo([new Transform()]);
// const x2__ignored = foo([new Transform(), new Transform()]);
// const x3__ignored = foo([new Transform(), new Foo()]);
// const x4__ignored = bar(new Transform());
// const x5__ignored = bar(new Transform(), new Transform());
// const x6__ignored = bar(new Transform(), new Foo());
//
// const effectsMap: EffectsMap = new Map();
// effectsMap.set("transform", [
//   { _effect: new Transform(), _state: { _activeSince: null } },
// ]);
// effectsMap.set("transform", [
//   { _effect: new Foo(), _state: { _activeSince: null } },
// ]); // should error
// effectsMap.set("foo", [
//   { _effect: new Transform(), _state: { _activeSince: null } },
// ]); // should error
// effectsMap.set("foo", [{ _effect: new Foo(), _state: { _activeSince: null } }]);
// const x__ignored = effectsMap.get("transform");
// const y__ignored = effectsMap.get("foo");
// const z__ignored = effectsMap.keys();
// const zz__ignored = effectsMap.values();
//
// const t = new Transform();
// const ta__ignored = t.apply({} as ScrollOffsets);
//
// const baz = <T extends keyof EffectRegistry>(e: Effect<T>) => {
//   const res = e.apply({} as ScrollOffsets);
//   return res;
// };
//
// const zzz__ignored = baz(new Transform());
