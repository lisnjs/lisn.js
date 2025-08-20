/**
 * @module Effects
 *
 * @since v1.3.0
 */

import * as _ from "@lisn/_internal";

import { usageError } from "@lisn/globals/errors";

import {
  View,
  ViewTarget,
  CommaSeparatedStr,
  AtLeastOne,
  ScrollTarget,
  RawOrRelativeNumber,
} from "@lisn/globals/types";

import { toRawNum, RawNumberCalculator } from "@lisn/utils/math";
import { getOppositeViews } from "@lisn/utils/views";

import {
  CallbackHandler,
  Callback,
  addHandlerToMap,
  invokeHandlers,
} from "@lisn/modules/callback";

import { FXState } from "@lisn/effects/effect";
import { FXComposer } from "@lisn/effects/fx-composer";
import { FXPin } from "@lisn/effects/fx-pin";

import { ScrollWatcher, ScrollData } from "@lisn/watchers/scroll-watcher";
import { ViewWatcher, ViewWatcherConfig } from "@lisn/watchers/view-watcher";

// -------------------------------------------------------------------------
// -------------------- BUILT-IN MATCHERS SINGLE EXPORT --------------------
// -------------------------------------------------------------------------

/**
 * Function wrappers around built-in matchers.
 */
export const FX_MATCH = {
  negate: (matcher: FXMatcher) => new FXNegateMatcher(matcher),
  composer: (composer: FXComposer, bounds: FXComposerMatcherBounds) =>
    new FXComposerMatcher(composer, bounds),
  scroll: (bounds: FXScrollMatcherBounds, scrollable?: ScrollTarget) =>
    new FXScrollMatcher(bounds, scrollable),
  view: (
    viewTarget: ViewTarget,
    views: CommaSeparatedStr<View> | View[],
    config?: ViewWatcherConfig,
  ) => new FXViewMatcher(viewTarget, views, config),
  pin: (pin: FXPin) => new FXPinMatcher(pin),
} as const;

// -------------------------------------------------------------------------

/**
 * A pin matcher internally keeps track of certain conditions and has a binary
 * state (matches/does not match).
 *
 * This is a generic class that accepts a custom executor function. You may want
 * to subclass it when defining your own matcher types.
 *
 * There are built-in matchers in {@link FX_MATCH}.
 *
 * @param executor A function which accepts a {@link FXMatcherStore}. The
 *                 executor is responsible for calling
 *                 {@link FXMatcherStore.setState | store.setState} whenever
 *                 it's state changes. It will be called inside the class
 *                 constructor with `this` set to the newly created matcher.
 */
export class FXMatcher {
  /**
   * Returns true if the matcher has matched.
   */
  matches: () => boolean;

  /**
   * Calls the given handler whenever the matcher's state changes.
   *
   * The handler is called after updating the state, such that calling
   * {@link matches} from the handler will reflect the latest state.
   */
  onChange: (handler: FXMatcherHandler) => void;

  /**
   * Removes a previously added {@link offChange} handler.
   */
  offChange: (handler: FXMatcherHandler) => void;

  constructor(executor: (store: FXMatcherStore) => void) {
    const storeData = { matches: false };

    const store: FXMatcherStore = {
      getState: () => storeData.matches,
      setState: (m) => {
        if (!_.isBoolean(m)) {
          throw usageError("Matcher state must be a boolean");
        }

        if (storeData.matches !== m) {
          storeData.matches = m;
          invokeHandlers(changeCallbacks.values(), m, this);
        }
      },
    };

    const changeCallbacks = _.createMap<FXMatcherHandler, FXMatcherCallback>();

    // --------------------

    this.matches = () => storeData.matches;

    this.onChange = (handler) => {
      addHandlerToMap(handler, changeCallbacks);
    };

    this.offChange = (handler) => {
      _.remove(changeCallbacks.get(handler));
    };

    // --------------------

    executor.call(this, store);
  }
}

/**
 * A relative pin matcher is a type of matcher that supports relative inputs
 * (e.g. "+200") and it calculates the resulting value based on its internal
 * data at the time it was last {@link FXRelativeMatcher.restart | restarted}.
 *
 * This is a generic class that accepts a custom executor function. You want to
 * subclass it when defining your own matcher types.
 *
 * @param executor A function which accepts a {@link FXMatcherStore}. The
 *                 executor is responsible for calling
 *                 {@link FXRelativeMatcherStore.setState | store.setState} and
 *                 {@link FXRelativeMatcherStore.setData | store.setData}
 *                 whenever it's state or data change. It should also set
 *                 {@link FXRelativeMatcherStore.restartCallback | store.restartCallback}
 *                 to potentially update its state when the matcher is
 *                 restarted. The executor will be called inside the class
 *                 constructor with `this` set to the newly created matcher.
 */
export class FXRelativeMatcher<D = unknown> extends FXMatcher {
  /**
   * Updates the matcher's internal reference data to be its current data.
   */
  restart: () => void;

  constructor(executor: (store: FXRelativeMatcherStore<D>) => void) {
    let baseStore: FXMatcherStore;
    super((store) => (baseStore = store));

    const storeData: { data?: D; refData?: D } = {};

    const store: FXRelativeMatcherStore<D> = {
      getState: () => baseStore.getState(),
      setState: (m) => baseStore.setState(m),
      getData: () => _.deepCopy(storeData.data),
      setData: (data) => {
        storeData.data = _.deepCopy(data);
      },
      getReferenceData: () => _.deepCopy(storeData.refData),
    };

    // --------------------

    this.restart = () => {
      storeData.refData = storeData.data;
      if (_.isFunction(store.restartCallback)) {
        store.restartCallback();
      }
    };

    // --------------------

    executor.call(this, store);
  }
}

/**
 * The handler is invoked with two arguments:
 *
 * - `true` if the matcher matches, `false` otherwise.
 * - The {@link FXMatcher} instance.
 */
export type FXMatcherHandlerArgs<T extends FXMatcher = FXMatcher> = [
  boolean,
  T,
];
export type FXMatcherCallback<T extends FXMatcher = FXMatcher> = Callback<
  FXMatcherHandlerArgs<T>
>;
export type FXMatcherHandler<T extends FXMatcher = FXMatcher> =
  | FXMatcherCallback<T>
  | CallbackHandler<FXMatcherHandlerArgs<T>>;

/**
 * Internal state and data management for a matcher to be used by its executor.
 */
export type FXMatcherStore = {
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
export type FXRelativeMatcherStore<D = unknown> = FXMatcherStore & {
  /**
   * Returns the current data, last set using {@link setData}.
   */
  getData: () => D | undefined;

  /**
   * Updates the current data.
   */
  setData: (data: D) => void;

  /**
   * Returns the data at the time {@link FXMatcher.restart | restart} was last
   * called on the matcher.
   */
  getReferenceData: () => D | undefined;

  /**
   * If you set this, it will be called when the matcher is restarted, after the
   * reference data has been updated.
   */
  restartCallback?: () => void;
};

// ------------------------------------------------------------------------
// -------------------------- BUILT-IN MATCHERS ---------------------------
// ------------------------------------------------------------------------

// -------------------------------- NEGATE ---------------------------------

/**
 * Negates the given matcher.
 */
export class FXNegateMatcher extends FXMatcher {
  constructor(matcher: FXMatcher) {
    const executor = (store: FXMatcherStore) => {
      store.setState(!matcher.matches());
      matcher.onChange((state) => store.setState(!state));
    };
    super(executor);
  }
}

// ------------------------------- COMPOSER --------------------------------

/**
 * {@link FXComposerMatcher} matches when the given composer's parameters are
 * less than or greater than the given reference values. It supports
 * {@link RawOrRelativeNumber | relative} offsets as `"+<number>"` or
 * `"-<number>"` which will be relative to the parameters at the time it was
 * last restarted.
 *
 * If the value is a percentage rather than an absolute number, it will be
 * treated as a fraction of the difference between the minimum and maximum
 * values of each axis' parameters. See {@link FXComposerMatcherBounds} for
 * an example.
 */
export class FXComposerMatcher extends FXRelativeMatcher<FXState> {
  constructor(composer: FXComposer, config: FXComposerMatcherBounds) {
    if (!config) {
      throw usageError(
        "At least one parameter bounding value is required for FXComposerMatcher",
      );
    }

    const executor = (store: FXRelativeMatcherStore<FXState>) => {
      const updateData = (fxState?: FXState) => {
        if (fxState) {
          store.setData(fxState);
        } else {
          fxState = store.getData();
        }

        if (fxState) {
          store.setState(
            axesAreWithinBounds(config, fxState, store.getReferenceData()),
          );
        }
      };

      composer.onTween(updateData);

      // Recheck if within bounds
      store.restartCallback = updateData;
    };

    super(executor);
  }
}

/**
 * Minimum and/or maximum X, Y and/or Z composer state parameters.
 *
 * {@link RawOrRelativeNumber | Relative} offsets with `+` or `-` prefix are
 * relative to the values at the time the matcher was last restarted.
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
export type FXComposerMatcherBounds = AtLeastOne<{
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

// -------------------------------- SCROLL ---------------------------------

/**
 * {@link FXScrollMatcher} matches when the scroll offset of the given
 * scrollable is less than or greater than the given reference. It supports
 * {@link RawOrRelativeNumber | relative} offsets as `"+<number>"` or
 * `"-<number>"` which will be relative to the parameters at the time it was
 * last restarted.
 *
 * If the value is a percentage rather than an absolute number, it will be
 * treated as a fraction of the scroll width or height of the scrollable. See
 * {@link FXScrollMatcherBounds} for an example.
 *
 * If you are using this matcher for an effect that's triggered on scroll (i.e.
 * updated by a composer that is triggered by an {@link FXScrollTrigger}), it's
 * better to use the {@link FXComposerMatcher} and pass it the composer.
 */
export class FXScrollMatcher extends FXRelativeMatcher<
  FXPinAllAxesData<"top" | "left">
> {
  /**
   * @param scrollable If not given, then it will use {@link ScrollWatcher}
   * default.
   */
  constructor(bounds: FXScrollMatcherBounds, scrollable?: ScrollTarget) {
    if (!bounds) {
      throw usageError(
        "At least one scroll offset bounding value is required for FXScrollMatcher",
      );
    }

    const scrollWatcher = ScrollWatcher.reuse({ [_.S_DEBOUNCE_WINDOW]: 0 });

    const executor = (
      store: FXRelativeMatcherStore<FXPinAllAxesData<"top" | "left">>,
    ) => {
      const updateData = (data?: FXPinAllAxesData<"top" | "left">) => {
        if (data) {
          store.setData(data);
        } else {
          data = store.getData();
        }

        if (data) {
          store.setState(
            axesAreWithinBounds(bounds, data, store.getReferenceData()),
          );
        }
      };

      scrollWatcher.trackScroll(
        (e, scrollData) => updateData(scrollToAxesData(scrollData)),
        {
          scrollable,
        },
      );

      // Recheck if within bounds
      store.restartCallback = updateData;
    };

    super(executor);
  }
}

/**
 * Minimum and/or maximum top and/or left scroll offsets.
 *
 * {@link RawOrRelativeNumber | Relative} offsets with `+` or `-` prefix are
 * relative to the values at the time the matcher was last restarted.
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
export type FXScrollMatcherBounds = AtLeastOne<{
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
//
// --------------------------------- VIEW ----------------------------------

/**
 * {@link FXViewMatcher} matches when the "view" of given root, or the
 * viewport by default, relative to the given view target matches the specified
 * {@link View | views}.
 *
 * @see {@link ViewWatcher}.
 */
export class FXViewMatcher extends FXMatcher {
  constructor(
    viewTarget: ViewTarget,
    views: CommaSeparatedStr<View> | View[],
    config?: ViewWatcherConfig,
  ) {
    if (!viewTarget || !views) {
      throw usageError("View target and views are required for FXViewMatcher");
    }

    const oppositeViews = getOppositeViews(views);
    if (!_.lengthOf(oppositeViews)) {
      throw usageError(
        "Views given to FXViewMatcher cannot include all possible views",
      );
    }

    const viewWatcher = ViewWatcher.reuse(config);

    const executor = (store: FXMatcherStore) => {
      viewWatcher.onView(viewTarget, () => store.setState(true), { views });
      viewWatcher.onView(viewTarget, () => store.setState(false), {
        views: oppositeViews,
      });
    };

    super(executor);
  }
}

// --------------------------------- PIN -----------------------------------

/**
 * Matches while the given pin is active.
 */
export class FXPinMatcher extends FXMatcher {
  constructor(pin: FXPin) {
    const executor = (store: FXMatcherStore) => {
      store.setState(pin.isActive());
      pin.onChange((state) => store.setState(state));
    };
    super(executor);
  }
}

// ------------------------------

type FXPinAxisData = { min: number; max: number; current: number };

type FXPinAllAxesData<Keys extends string> = { [K in Keys]: FXPinAxisData };

/**
 * Converts the given input raw or relative number as explained in
 * {@link FXComposerMatcherBounds}.
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
) => values.current > toRawAxisValue(minValue, values, reference, -_.INFINITY);

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
) => values.current < toRawAxisValue(maxValue, values, reference, _.INFINITY);

const axesAreWithinBounds = <Keys extends string>(
  bounds: { [B in "min" | "max"]?: { [K in Keys]?: RawOrRelativeNumber } },
  data: FXPinAllAxesData<Keys>,
  referenceData: FXPinAllAxesData<Keys> | undefined,
) => {
  const { min, max } = bounds;

  let result = true;
  for (const a in data) {
    const axisRef = referenceData ? referenceData[a] : void 0;
    const axisMax = max ? max[a] : NaN;
    const axisMin = min ? min[a] : NaN;

    result ||=
      axisIsGreaterThan(axisMin, data[a], axisRef) &&
      axisIsLessThan(axisMax, data[a], axisRef);
  }

  return result;
};

const scrollToAxesData = (
  scrollData: ScrollData,
): FXPinAllAxesData<"top" | "left"> => ({
  top: {
    min: 0,
    max: scrollData[_.S_SCROLL_HEIGHT],
    current: scrollData[_.S_SCROLL_TOP],
  },
  left: {
    min: 0,
    max: scrollData[_.S_SCROLL_WIDTH],
    current: scrollData[_.S_SCROLL_LEFT],
  },
});

_.brandClass(FXMatcher, "FXMatcher");
_.brandClass(FXRelativeMatcher, "FXRelativeMatcher");
_.brandClass(FXNegateMatcher, "FXNegateMatcher");
_.brandClass(FXComposerMatcher, "FXComposerMatcher");
_.brandClass(FXScrollMatcher, "FXScrollMatcher");
_.brandClass(FXViewMatcher, "FXViewMatcher");
_.brandClass(FXPinMatcher, "FXPinMatcher");
