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
  EffectsList,
  EffectRegistry,
  ScrollOffsets,
} from "@lisn/effects/effect";

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
  readonly add: <T extends readonly (keyof EffectRegistry)[]>(
    effects: EffectsList<T>,
    range?: EffectRange,
  ) => FXController;

  /**
   * Removes all previously added effects.
   *
   * @returns The same {@link FXController} instance.
   */
  readonly clear: () => FXController;

  /**
   * Applies all added effects for the given scroll offsets. Effects are only
   * applied if their range condition matches (or if no such condition was
   * supplied).
   *
   * Effects are applied in order and each one adds to, if possible, or
   * otherwise overrides previous ones of the same category. Transforms always
   * multiply each previous one, however the final perspective used in the
   * transform is that of the last one.
   *
   * @param parentController If the element being animated is nested inside
   *                         another one like that, then pass the parent
   *                         element's controller so that transforms can be set
   *                         relative to the parent.
   *
   * @returns The same {@link FXController} instance.
   */
  readonly apply: (offsets: ScrollOffsets) => FXController;

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

    let entries: Array<EffectState>;

    this.add = (effects, range) => {
      entries.push(newEffectsEntry(scrollable, effects, range));
      return this;
    };

    this.clear = () => {
      for (const e of entries) {
        for (const c of e._callbacks) {
          c.remove();
        }
      }
      entries = [];
      return this;
    };

    this.apply = (offsets) => {
      for (const e of entries) {
        for (const effects of e._effects.values()) {
          for (const effect of effects) {
            effect.apply(offsets);
          }
        }
      }
      return this;
    };

    this.toCss = (relativeTo) => {
      const css: Record<string, string> = {};
      // XXX TODO
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
  get<K extends keyof EffectRegistry>(key: K): Effect<K>[] | undefined;
  set<K extends keyof EffectRegistry>(key: K, value: Effect<K>[]): this;
  has<K extends keyof EffectRegistry>(key: K): boolean;
  delete<K extends keyof EffectRegistry>(key: K): boolean;
  keys(): IterableIterator<keyof EffectRegistry>;
  values(): IterableIterator<Effect<keyof EffectRegistry>[]>;
  entries(): IterableIterator<
    [keyof EffectRegistry, Effect<keyof EffectRegistry>[]]
  >;
  [Symbol.iterator](): IterableIterator<
    [keyof EffectRegistry, Effect<keyof EffectRegistry>[]]
  >;
}

type EffectState = {
  _effects: EffectsMap;
  _callbacks: Array<OnScrollCallback | OnViewCallback>;
  _activeSince: ScrollData | null;
};

const newEffectsEntry = <T extends readonly (keyof EffectRegistry)[]>(
  scrollable: ScrollTarget | undefined,
  effects: EffectsList<T>,
  range: EffectRange | undefined,
) => {
  const scrollWatcher = ScrollWatcher.reuse({ [MC.S_DEBOUNCE_WINDOW]: 0 });
  const viewWatcher = ViewWatcher.reuse();
  const effectsMap: EffectsMap = new Map();
  for (const e of effects) {
    const arr = effectsMap.get(e.type) ?? [];
    arr.push(e);
    effectsMap.set(e.type, arr);
  }

  const state: EffectState = {
    _effects: effectsMap,
    _callbacks: [],
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
    state._callbacks.push(cbk);
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
    state._callbacks.push(cbk);
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

// XXX type testing
// export class Foo implements EffectInterface<"foo"> {
//   readonly type = "foo";
//   readonly apply!: (offsets: ScrollOffsets) => Foo;
//   readonly toCss!: (relativeTo?: Foo) => Record<string, string>;
//   readonly toComposition!: (...others: Array<Foo>) => Foo;
// }
//
// declare module "@lisn/effects/effect" {
//   interface EffectRegistry {
//     foo: Foo;
//   }
// }
//
// const foo = <T extends readonly (keyof EffectRegistry)[]>(
//   effects: EffectsList<T>,
// ) => effects;
//
// const bar = <T extends readonly (keyof EffectRegistry)[]>(
//   ...effects: EffectsList<T>
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
// effectsMap.set("transform", [new Transform()]);
// effectsMap.set("transform", [new Foo()]);
// effectsMap.set("foo", [new Foo()]);
// effectsMap.set("foo", [new Foo(), new Foo()]);
// const x__ignored = effectsMap.get("transform");
// const y__ignored = effectsMap.get("foo");
// const z__ignored = effectsMap.keys();
// const zz__ignored = effectsMap.values();
