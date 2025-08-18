/**
 * @module Effects
 *
 * @since v1.3.0
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import {
  AtLeastOne,
  ScrollTarget,
  RawOrRelativeNumber,
} from "@lisn/globals/types";

import { toRawNum, RawNumberCalculator } from "@lisn/utils/math";

import {
  CallbackHandler,
  Callback,
  addNewCallbackToMap,
  invokeHandlers,
} from "@lisn/modules/callback";

import { FXState } from "@lisn/effects/effect";
import { FXComposer, FXComposerHandler } from "@lisn/effects/fx-composer";

import { ScrollWatcher, OnScrollHandler } from "@lisn/watchers/scroll-watcher";

/**
 * A pin matcher internally keeps track of certain conditions and has a binary
 * state (matches/does not match).
 *
 * This is a generic class that accepts a custom executor function. You want to
 * subclass it when defining your own matcher types.
 *
 * @param executor A function which accepts a {@link FXPinMatcherStore}. The
 *                 executor is responsible for calling
 *                 {@link FXPinMatcher.setState | store.setState} whenever it's
 *                 state changes. It will be called inside the class constructor
 *                 with `this` set to the newly created matcher.
 */
export abstract class FXPinMatcher {
  /**
   * Returns true if the matcher has matched.
   */
  matches: () => boolean;

  /**
   * Calls the given handler whenever the matcher's state changes.
   */
  onChange: (handler: FXPinMatcherHandler) => void;

  /**
   * Removes a previously added {@link offChange} handler.
   */
  offChange: (handler: FXPinMatcherHandler) => void;

  protected constructor(executor: (store: FXPinMatcherStore) => void) {
    const storeData = { matches: false };

    const store: FXPinMatcherStore = {
      getState: () => storeData.matches,
      setState: (m) => {
        if (storeData.matches !== m) {
          storeData.matches = m;
          invokeHandlers(changeCallbacks.values(), storeData.matches, this);
        }
      },
    };

    const changeCallbacks = MH.newMap<
      FXPinMatcherHandler,
      FXPinMatcherCallback
    >();

    // --------------------

    this.matches = () => storeData.matches;

    this.onChange = (handler: FXPinMatcherHandler) => {
      addNewCallbackToMap(changeCallbacks, handler);
    };

    this.offChange = (handler: FXPinMatcherHandler) => {
      MH.remove(changeCallbacks.get(handler));
    };

    executor.call(this, store);
  }
}

/**
 * A relative pin matcher is a type of matcher that supports relative inputs
 * (e.g. "+200") and XXX
 *
 * This is a generic class that accepts a custom executor function. You want to
 * subclass it when defining your own matcher types.
 *
 * @param executor A function which accepts a {@link FXPinMatcherStore}. The
 *                 executor is responsible for calling
 *                 {@link FXPinMatcher.setState | store.setState} and
 *                 {@link FXPinMatcher.setData | store.setData} whenever it's
 *                 state or data change. It will be called inside the class
 *                 constructor with `this` set to the newly created matcher.
 */
export abstract class FXPinRelativeMatcher<D = unknown> extends FXPinMatcher {
  /**
   * Updates the matcher's internal reference data to be its current data.
   */
  restart: () => void;

  protected constructor(
    executor: (store: FXPinRelativeMatcherStore<D>) => void,
  ) {
    let baseStore: FXPinMatcherStore;
    super((store) => (baseStore = store));

    const storeData: { data?: D; refData?: D } = {};

    const store: FXPinRelativeMatcherStore<D> = {
      getState: () => baseStore.getState(),
      setState: (m) => baseStore.setState(m),
      getData: () => storeData.data,
      setData: (data) => {
        storeData.data = data;
      },
      getReferenceData: () => storeData.refData,
    };

    // --------------------

    this.restart = () => {
      storeData.refData = storeData.data;
    };

    executor.call(this, store);
  }
}

/**
 * The handler is invoked with two arguments:
 *
 * - The current state of the {@link FXPinMatcher} where `true` means it
 *   matches.
 * - The {@link FXPinMatcher} instance.
 */
export type FXPinMatcherHandlerArgs<T extends FXPinMatcher = FXPinMatcher> = [
  boolean,
  T,
];
export type FXPinMatcherCallback<T extends FXPinMatcher = FXPinMatcher> =
  Callback<FXPinMatcherHandlerArgs<T>>;
export type FXPinMatcherHandler<T extends FXPinMatcher = FXPinMatcher> =
  | FXPinMatcherCallback<T>
  | CallbackHandler<FXPinMatcherHandlerArgs<T>>;

/**
 * Internal state and data management for a matcher to be used by its executor.
 */
export type FXPinMatcherStore = {
  /**
   * Returns the current state, last set using {@link setState}.
   */
  getState: () => boolean;

  /**
   * Updates the current state.
   */
  setState: (matcher: boolean) => void;
};

/**
 * Internal state and data management for a relative matcher to be used by its
 * executor.
 *
 * @interface
 */
export type FXPinRelativeMatcherStore<D = unknown> = FXPinMatcherStore & {
  /**
   * Returns the current data, last set using {@link setData}.
   */
  getData: () => D | undefined;

  /**
   * Updates the current data.
   */
  setData: (data: D) => void;

  /**
   * Returns the data at the time {@link FXPinMatcher.restart | restart} was
   * last called on the matcher.
   */
  getReferenceData: () => D | undefined;
};

// ------------------------------------------------------------------------
// -------------------------- BUILT-IN MATCHERS ---------------------------
// ------------------------------------------------------------------------

// -------------------------------- NEGATE ---------------------------------

/**
 * Negates the given matcher. {@link FXPinMatcher.restart | restarting} it
 * **won't** call the restart method on the original matcher.
 */
export class FXPinNegateMatcher extends FXPinMatcher {
  constructor(matcher: FXPinMatcher) {
    const executor = (store: FXPinMatcherStore) => {
      store.setState(!matcher.matches());
      matcher.onChange((state) => store.setState(!state));
    };
    super(executor);
  }
}

// -------------------------------- SCROLL ---------------------------------

/**
 * Matches when the scroll offset of the given scrollable is less than or
 * greater than the given reference. It supports
 * {@link RawOrRelativeNumber | relative} offsets as `"+<number>"` or
 * `"-<number>"` which will be relative to when it was last restarted.
 *
 * If the value is a percentage rather than an absolute number, it will be
 * treated as a fraction of the scroll width or height of the scrollable. See
 * {@link FXPinScrollMatcherConfig} for an example.
 *
 * If you are using this matcher for an effect that's triggered on scroll (i.e.
 * updated by a composer that is triggered by an {@link FXScrollTrigger}), it's
 * better to use the {@link FXPinComposerMatcher} and pass it the composer.
 */
export class FXPinScrollMatcher extends FXPinRelativeMatcher<
  FXPinAllAxesData<"top" | "left">
> {
  constructor(scrollable: ScrollTarget, config: FXPinScrollMatcherConfig) {
    if (!config) {
      throw MH.usageError(
        "At least one scroll offset bounding value is required for FXPinScrollMatcher",
      );
    }

    const scrollWatcher = ScrollWatcher.reuse({ [MC.S_DEBOUNCE_WINDOW]: 0 });

    const executor = (
      store: FXPinRelativeMatcherStore<FXPinAllAxesData<"top" | "left">>,
    ) => {
      const updateData: OnScrollHandler = (e__ignored, scrollData) => {
        const data: FXPinAllAxesData<"top" | "left"> = {
          top: {
            min: 0,
            max: scrollData[MC.S_SCROLL_HEIGHT],
            current: scrollData[MC.S_SCROLL_TOP],
          },
          left: {
            min: 0,
            max: scrollData[MC.S_SCROLL_WIDTH],
            current: scrollData[MC.S_SCROLL_LEFT],
          },
        };

        store.setData(data);
        store.setState(
          axesAreWithinBounds(config, data, store.getReferenceData()),
        );
      };

      scrollWatcher.trackScroll(updateData, { scrollable });
    };

    super(executor);
  }
}

/**
 * Minimum and/or maximum top and/or left scroll offsets.
 *
 * {@link RawOrRelativeNumber | Relative} offsets with `+` or `-` prefix are
 * relative to when the matcher was last restarted.
 *
 * If the value is a percentage, it will be treated as a fraction of the scroll
 * width or height of the scrollable.
 *
 * @example
 * - `10` or `"10"` is treated as an absolute scroll top/left offset of 10
 *   pixels ignoring the reference value (at the time of last restart).
 * - `"10%"` is treated as an absolute scroll top/left offset of 10%
 *   of the scroll height/width of the scrollable, ignoring the reference value
 *   (at the time of last restart).
 *
 * - `"+10"` is treated as 10 pixels further down/right since the matcher was
 *   last restarted.
 * - `"-10"` is treated as 10 pixels back up/left since the matcher was last
 *   restarted.
 * - `"+10%"` is treated as 10% the scroll height/width further down/right since
 *   the matcher was last restarted.
 * - `"-10%"` is treated as 10% the scroll height/width back up/left since the
 *   matcher was last restarted.
 */
export type FXPinScrollMatcherConfig = AtLeastOne<{
  /**
   * Maximum top and/or left scroll offset. If the scroll offset exceeds this,
   * the matcher will not match.
   */
  max: AtLeastOne<{
    top: RawOrRelativeNumber;
    left: RawOrRelativeNumber;
  }>;

  /**
   * Minimum top and/or left scroll offset. If the scroll offset is less than
   * this, the matcher will not match.
   */
  min: AtLeastOne<{
    top: RawOrRelativeNumber;
    left: RawOrRelativeNumber;
  }>;
}>;

// ------------------------------- COMPOSER --------------------------------

/**
 * Matches when the given composer's parameters are less than or greater than
 * the given reference values. It supports {@link RawOrRelativeNumber | relative}
 * offsets as `"+<number>"` or `"-<number>"` which will be relative to when it
 * was last restarted.
 *
 * If the value is a percentage rather than an absolute number, it will be
 * treated as a fraction of the difference between the minimum and maximum
 * values of each axis' parameters. See {@link FXPinComposerMatcherConfig} for
 * an example.
 */
export class FXPinComposerMatcher extends FXPinRelativeMatcher<FXState> {
  constructor(composer: FXComposer, config: FXPinComposerMatcherConfig) {
    if (!config) {
      throw MH.usageError(
        "At least one parameter bounding value is required for FXPinComposerMatcher",
      );
    }

    const executor = (store: FXPinRelativeMatcherStore<FXState>) => {
      const updateData: FXComposerHandler = (fxState) => {
        store.setData(fxState);
        store.setState(
          axesAreWithinBounds(config, fxState, store.getReferenceData()),
        );
      };

      composer.onTween(updateData);
    };

    super(executor);
  }
}

/**
 * Minimum and/or maximum X, Y and/or Z composer state parameters.
 *
 * {@link RawOrRelativeNumber | Relative} offsets with `+` or `-` prefix are
 * relative to when the matcher was last restarted.
 *
 * If the value is a percentage, it will be treated as a fraction of the
 * difference between the maximum and minimum values for the respective axis.
 *
 * @example
 * - `10` or `"10"` is treated as an absolute value of 10 ignoring the reference
 *   value (at the time of last restart).
 * - `"10%"` is treated as an absolute value of "min + 10% of the (max - min)",
 *   ignoring the reference value (at the time of last restart).
 *
 * - `"+10"` is treated as 10 more than the value since the matcher was last
 *   restarted.
 * - `"-10"` is treated as 10 less than the value since the matcher was last
 *   restarted.
 * - `"+10%"` is treated as 10% more than the value since the matcher was last
 *   restarted.
 * - `"-10%"` is treated as 10% less than the value since the matcher was last
 *   restarted.
 */
export type FXPinComposerMatcherConfig = AtLeastOne<{
  /**
   * Maximum X, Y and/or Z values for the composer's state parameters. If the
   * parameters exceed this, the matcher will not match.
   */
  max: AtLeastOne<{
    x: RawOrRelativeNumber;
    y: RawOrRelativeNumber;
    z: RawOrRelativeNumber;
  }>;

  /**
   * Minimum X, Y and/or Z values for the composer's state parameters. If the
   * parameters are less than this, the matcher will not match.
   */
  min: AtLeastOne<{
    x: RawOrRelativeNumber;
    y: RawOrRelativeNumber;
    z: RawOrRelativeNumber;
  }>;
}>;

// -------------------------------------------------------------------------
// -------------------- BUILT-IN MATCHERS SINGLE EXPORT --------------------
// -------------------------------------------------------------------------

/**
 * Function wrappers around built-in matchers.
 */
export const PIN_MATCHERS = {
  negate: (matcher: FXPinMatcher) => new FXPinNegateMatcher(matcher),
  scroll: (scrollable: ScrollTarget, config: FXPinScrollMatcherConfig) =>
    new FXPinScrollMatcher(scrollable, config),
  composer: (composer: FXComposer, config: FXPinComposerMatcherConfig) =>
    new FXPinComposerMatcher(composer, config),
} as const;

// ------------------------------

type FXPinAxisData = { min: number; max: number; current: number };

type FXPinAllAxesData<Keys extends string> = { [K in Keys]: FXPinAxisData };

/**
 * Converts the given input raw or relative number as explained in
 * FXPinComposerMatcherConfig.
 *
 * @return `defaultValue` if it doesn't resolve to a valid number.
 */
const toRawAxisValue = (
  input: RawOrRelativeNumber | undefined,
  values: FXPinAxisData,
  reference: FXPinAxisData | undefined,
  defaultValue: number,
): number => {
  const calculator: RawNumberCalculator = ({
    isAdditive,
    isPercent,
    numerical,
  }) => {
    let result = isPercent
      ? values.min + (numerical * (values.max - values.min)) / 100
      : numerical;

    if (isAdditive) {
      result += reference?.current ?? values.min;
    }

    return result;
  };

  return toRawNum(input, calculator, defaultValue);
};

/**
 * Converts the given `minValue` raw or relative number with
 * {@link toRawAxisValue}, then compares it to `values.current`.
 *
 * @returns `true` if `minValue` does not resolve to a valid number (i.e. no
 * constraint) **or** the `values.current` is greater than `minValue`, `false`
 * otherwise.
 */
const axisIsGreaterThan = (
  minValue: RawOrRelativeNumber | undefined,
  values: FXPinAxisData,
  reference: FXPinAxisData | undefined,
) => values.current > toRawAxisValue(minValue, values, reference, -MC.INFINITY);

/**
 * Converts the given `maxValue` raw or relative number with
 * {@link toRawAxisValue}, then compares it to `values.current`.
 *
 * @returns `true` if `minValue` does not resolve to a valid number (i.e. no
 * constraint) **or** the `values.current` is less than `minValue`, `false`
 * otherwise.
 */
const axisIsLessThan = (
  maxValue: RawOrRelativeNumber | undefined,
  values: FXPinAxisData,
  reference: FXPinAxisData | undefined,
) => values.current < toRawAxisValue(maxValue, values, reference, MC.INFINITY);

const axesAreWithinBounds = <Keys extends string>(
  bounds: { [B in "min" | "max"]?: { [K in Keys]?: RawOrRelativeNumber } },
  data: FXPinAllAxesData<Keys>,
  referenceData: FXPinAllAxesData<Keys> | undefined,
) => {
  const { min, max } = bounds;

  let result = true;
  for (const a in data) {
    const axisRef = referenceData ? referenceData[a] : undefined;
    const axisMax = max ? max[a] : NaN;
    const axisMin = min ? min[a] : NaN;

    result ||=
      axisIsGreaterThan(axisMin, data[a], axisRef) &&
      axisIsLessThan(axisMax, data[a], axisRef);
  }

  return result;
};
