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
  createCallback,
  addHandlerToMap,
  invokeHandlers,
} from "@lisn/modules/callback";

import { FXState } from "@lisn/effects/effect";
import { FXComposer } from "@lisn/effects/fx-composer";
import { FXPin } from "@lisn/effects/fx-pin";

import {
  ScrollWatcher,
  ScrollData,
  OnScrollHandler,
} from "@lisn/watchers/scroll-watcher";
import { ViewWatcher, ViewWatcherConfig } from "@lisn/watchers/view-watcher";

// -------------------------------------------------------------------------
// -------------------- BUILT-IN MATCHERS SINGLE EXPORT --------------------
// -------------------------------------------------------------------------

/**
 * Function wrappers around built-in matchers.
 */
export const FX_MATCH = {
  negate: (matcher: FXMatcher) => new FXNegateMatcher(matcher),
  pin: (pin: FXPin) => new FXPinMatcher(pin),
  composer: (bounds: FXComposerMatcherBounds, composer: FXComposer) =>
    new FXComposerMatcher(bounds, composer),
  scroll: (bounds: FXScrollMatcherBounds, scrollable?: ScrollTarget) =>
    new FXScrollMatcher(bounds, scrollable),
  view: (
    views: CommaSeparatedStr<View> | View[],
    viewTarget: ViewTarget,
    config?: ViewWatcherConfig,
  ) => new FXViewMatcher(views, viewTarget, config),
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
 */
export class FXMatcher {
  /**
   * Returns true if the matcher has matched.
   */
  readonly matches: () => boolean;

  /**
   * Returns true if the matcher is running (not paused).
   */
  readonly isRunning: () => boolean;

  /**
   * Pauses the matcher. It will not change its {@link matches} state until
   * resumed.
   */
  readonly pause: () => void;

  /**
   * Resumes the matcher. If the state was internally updated while paused, the
   * new value will now be available via {@link matches} and the {@link onChange}
   * handlers will be called.
   */
  readonly resume: () => void;

  /**
   * Calls the given handler whenever the matcher's
   * {@link matches | matching state} changes.
   *
   * The handler is called after updating the state, such that calling
   * {@link matches} from the handler will reflect the latest state.
   */
  readonly onChange: (handler: FXMatcherHandler) => void;

  /**
   * Removes a previously added {@link offChange} handler.
   */
  readonly offChange: (handler: FXMatcherHandler) => void;

  /**
   * Calls the given handler whenever the matcher's
   * {@link isRunning | active state} changes.
   *
   * The handler is called after pausing or resuming the matcher, such that
   * calling {@link isRunning} from the handler will reflect the latest state.
   */
  readonly onToggle: (handler: FXMatcherHandler) => void;

  /**
   * Removes a previously added {@link onToggle} handler.
   */
  readonly offToggle: (handler: FXMatcherHandler) => void;

  /**
   * @param executor A function which accepts a {@link FXMatcherStore}. The
   *                 executor is responsible for calling
   *                 {@link FXMatcherStore.setState | store.setState} whenever
   *                 it's state changes. It is also the responsibility for the
   *                 executor to set up an {@link onToggle} handler and pause
   *                 its monitoring when the matcher is paused. It will be
   *                 called inside the class constructor with `this` set to the
   *                 newly created matcher.
   */
  constructor(executor: (store: FXMatcherStore) => void) {
    let isRunning = true;
    let lastChangeWhilePaused: boolean | null = null;

    const storeData = { matches: false };

    const store: FXMatcherStore = {
      getState: () => storeData.matches,
      setState: (m) => {
        if (isRunning) {
          if (!_.isBoolean(m)) {
            throw usageError("Matcher state must be a boolean");
          }

          if (storeData.matches !== m) {
            storeData.matches = m;
            invokeCallbacks(changeCallbacks);
          }
        } else {
          lastChangeWhilePaused = m;
        }
      },
    };

    const changeCallbacks = _.createMap<FXMatcherHandler, FXMatcherCallback>();
    const toggleCallbacks = _.createMap<FXMatcherHandler, FXMatcherCallback>();

    // ----------

    const invokeCallbacks = (
      callbacks: Map<FXMatcherHandler, FXMatcherCallback>,
    ) =>
      invokeHandlers(callbacks, this, {
        matches: storeData.matches,
        isRunning,
      });

    const setRunningState = (activate: boolean) => {
      if (isRunning !== activate) {
        isRunning = activate;

        if (activate && !_.isNull(lastChangeWhilePaused)) {
          store.setState(lastChangeWhilePaused);
          lastChangeWhilePaused = null;
        }

        invokeCallbacks(toggleCallbacks);
      }
    };

    // --------------------

    this.matches = () => storeData.matches;
    this.isRunning = () => isRunning;
    this.pause = () => setRunningState(false);
    this.resume = () => setRunningState(true);

    this.onChange = (handler) => {
      addHandlerToMap(handler, changeCallbacks);
    };

    this.offChange = (handler) => {
      _.remove(changeCallbacks.get(handler));
    };

    this.onToggle = (handler) => {
      addHandlerToMap(handler, toggleCallbacks);
    };

    this.offToggle = (handler) => {
      _.remove(toggleCallbacks.get(handler));
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
  readonly restart: () => void;

  constructor(executor: (store: FXRelativeMatcherStore<D>) => void) {
    let baseStore: FXMatcherStore;
    super((store) => (baseStore = store));

    const storeData: { data?: D; refData?: D } = {};

    const store: FXRelativeMatcherStore<D> = {
      getState: () => baseStore.getState(),
      setState: (m) => baseStore.setState(m),
      getData: () => _.copyNested(storeData.data),
      setData: (data) => {
        storeData.data = _.copyNested(data);
        if (_.isUndefined(storeData.refData)) {
          // set initial reference
          storeData.refData = storeData.data;
        }
      },
      getReferenceData: () => _.copyNested(storeData.refData),
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
 * - The {@link FXMatcher} instance.
 * - An object containing `matches` and `isRunning` boolean properties,
 *   indicating the state of the matcher at the time the callback was invoked.
 *   Note that by default, unless you pass a concurrent {@link Callback}, the
 *   handler will be invoked asynchronously, and so the state of the matcher may
 *   have changed by the time the handler runs. If you need the know the latest
 *   states, call {@link FXMatcher.isRunning | isRunning} and
 *   {@link FXMatcher.matches | matches} on the matcher instance.
 */
export type FXMatcherHandlerArgs<T extends FXMatcher = FXMatcher> = [
  T,
  { matches: boolean; isRunning: boolean },
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
   * called on the matcher, or the initial data {@link setData | data} if the
   * matcher had never been restarted).
   */
  getReferenceData: () => D | undefined;

  /**
   * If you set this, it will be called when the matcher is restarted, after the
   * reference data has been updated.
   */
  restartCallback?: () => void;
};

// -------------------------------------------------------------------------
// --------------------------- BUILT-IN MATCHERS ---------------------------
// -------------------------------------------------------------------------

// -------------------------------- NEGATE ---------------------------------

/**
 * Negates the given matcher.
 */
export class FXNegateMatcher extends FXMatcher {
  constructor(matcher: FXMatcher) {
    const executor = (store: FXMatcherStore) => {
      store.setState(!matcher.matches());
      // No point in removing callback on pause; parent won't update state
      // anyway
      matcher.onChange(
        createCallback((m, { matches }) => store.setState(!matches), true),
      );
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
      store.setState(pin.isPinned());
      // No point in removing callback on pause; parent won't update state
      // anyway
      pin.onChange(
        createCallback((p, { isPinned }) => store.setState(isPinned), true),
      );
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
 * treated as a fraction of the difference between the
 * {@link Effects.FXAxisState.low | low} and
 * {@link Effects.FXAxisState.high | high} values of each axis' parameters. See
 * {@link FXComposerMatcherBounds} for an example.
 */
export class FXComposerMatcher extends FXRelativeMatcher<FXState> {
  constructor(bounds: FXComposerMatcherBounds, composer: FXComposer) {
    if (!composer) {
      throw usageError("A composer is required for FXComposerMatcher");
    }

    if (!bounds) {
      // TODO check if there's at least one if bounds is an object
      throw usageError(
        "At least one parameter bounding value is required for FXComposerMatcher",
      );
    }

    let updateData: Callback;

    const addOrRemoveCallback = () => {
      if (this.isRunning()) {
        composer.onTween(updateData);
      } else {
        composer.offTween(updateData);
      }
    };

    const executor = (store: FXRelativeMatcherStore<FXState>) => {
      updateData = createCallback(() => {
        const fxState = composer.getState();
        store.setData(fxState);

        // getReferenceData here won't return undefined since the first call to
        // setData also sets the reference, but TypeScript doesn't know that
        const refData = store.getReferenceData() ?? fxState;
        store.setState(areAxesWithinBounds(bounds, fxState, refData));
      }, true);

      updateData.invoke(); // check initial state

      // Recheck if within bounds on restart
      store.restartCallback = updateData.invoke;
    };

    super(executor);

    this.onToggle(addOrRemoveCallback);
    addOrRemoveCallback();
  }
}

/**
 * Minimum and/or maximum X, Y and/or Z composer state parameters.
 *
 * {@link RawOrRelativeNumber | Relative} offsets with `+` or `-` prefix are
 * relative to the values at the time the matcher was last restarted (or the
 * initial value).
 *
 * If the value is a percentage, it will be treated as a fraction of the
 * difference between the {@link Effects.FXAxisState.low | low} and
 * {@link Effects.FXAxisState.high | high} values of each axis' parameters.
 *
 * @example
 * - `10` or `"10"` is treated as an absolute value of 10 ignoring the reference
 *   value (at the time of last restart).
 * - `"10%"` is treated as an absolute value of "low + 10% * (high - low)",
 *   ignoring the reference value (at the time of last restart).
 *
 * - `"+10"` is treated as 10 more than the value since the matcher was last
 *   restarted.
 * - `"-10"` is treated as 10 less than the value since the matcher was last
 *   restarted.
 * - `"+10%"` is treated as "10% * (high - low)" more than the value since the
 *   matcher was last restarted or the initial value.
 * - `"-10%"` is treated as "10% * (high - low)" less than the value since the
 *   matcher was last restarted or the initial value.
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
      // TODO check if there's at least one if bounds is an object
      throw usageError(
        "At least one scroll offset bounding value is required for FXScrollMatcher",
      );
    }

    const scrollWatcher = ScrollWatcher.reuse();

    let updateData: (data?: FXPinAllAxesData<"top" | "left">) => void;

    const watcherHandler: OnScrollHandler = (e, scrollData) =>
      updateData(scrollToAxesData(scrollData));

    const addOrRemoveWatcher = () => {
      if (this.isRunning()) {
        scrollWatcher.trackScroll(
          watcherHandler,
          _.fastWatcherConf({ scrollable }),
        );
      } else {
        scrollWatcher.noTrackScroll(watcherHandler, scrollable);
      }
    };

    const executor = (
      store: FXRelativeMatcherStore<FXPinAllAxesData<"top" | "left">>,
    ) => {
      updateData = (data) => {
        if (data) {
          store.setData(data);
        } else {
          data = store.getData();
        }

        if (data) {
          // getReferenceData here won't return undefined since the first call
          // to setData also sets the reference, but TypeScript doesn't know that
          const refData = store.getReferenceData() ?? data;
          store.setState(areAxesWithinBounds(bounds, data, refData));
        }
      };

      // ScrollWatcher will soon call us with initial state, asynchronously

      // Recheck if within bounds on restart
      store.restartCallback = updateData;
    };

    super(executor);
    this.onToggle(addOrRemoveWatcher);
    addOrRemoveWatcher();
  }
}

/**
 * Minimum and/or maximum top and/or left scroll offsets.
 *
 * {@link RawOrRelativeNumber | Relative} offsets with `+` or `-` prefix are
 * relative to the values at the time the matcher was last restarted (or the
 * initial value).
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
 *   the matcher was last restarted or the initial value.
 * - `"-10%"` is treated as 10% the scroll height/width back up/left since the
 *   matcher was last restarted or the initial value.
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
    views: CommaSeparatedStr<View> | View[],
    viewTarget: ViewTarget,
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

    let matchHandler: () => void;
    let noMatchHandler: () => void;

    const addOrRemoveWatcher = () => {
      if (this.isRunning()) {
        viewWatcher.onView(viewTarget, matchHandler, { views });
        viewWatcher.onView(viewTarget, noMatchHandler, {
          views: oppositeViews,
        });
      } else {
        viewWatcher.offView(viewTarget, matchHandler);
        viewWatcher.offView(viewTarget, noMatchHandler);
      }
    };

    const executor = (store: FXMatcherStore) => {
      matchHandler = () => store.setState(true);
      noMatchHandler = () => store.setState(false);
    };

    super(executor);
    this.onToggle(addOrRemoveWatcher);
    addOrRemoveWatcher();
  }
}

// ------------------------------

type FXPinAxisData = { low: number; high: number; current: number };

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
  reference: FXPinAxisData,
  defaultValue: number,
): number => {
  const calculator: RawNumberCalculator = ({
    isAdditive,
    isPercent,
    numerical,
  }) => {
    let result;

    if (isPercent) {
      result =
        (isAdditive ? reference.current : values.low) +
        (numerical * (values.high - values.low)) / 100;
    } else {
      result = numerical + (isAdditive ? reference.current : 0);
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
 * constraint) **or** the `values.current` is greater than or equal to
 * `minValue`, `false` otherwise.
 */
const isAxisGE = (
  minValue: RawOrRelativeNumber | undefined,
  values: FXPinAxisData,
  reference: FXPinAxisData,
) => values.current >= toRawAxisValue(minValue, values, reference, -_.INFINITY);

/**
 * Converts the given `maxValue` raw or relative number with
 * {@link toRawAxisValue}, then compares it to `values.current`.
 *
 * @returns `true` if `minValue` does not resolve to a valid number (i.e. no
 * constraint) **or** the `values.current` is less than or equal to `minValue`,
 * `false` otherwise.
 */
const isAxisLE = (
  maxValue: RawOrRelativeNumber | undefined,
  values: FXPinAxisData,
  reference: FXPinAxisData,
) => values.current <= toRawAxisValue(maxValue, values, reference, _.INFINITY);

const areAxesWithinBounds = <Keys extends string>(
  bounds: { [B in "min" | "max"]?: { [K in Keys]?: RawOrRelativeNumber } },
  data: FXPinAllAxesData<Keys>,
  referenceData: FXPinAllAxesData<Keys>,
) => {
  const { min, max } = bounds;

  let result = true;
  for (const a in data) {
    const axisRef = referenceData[a];
    const axisMax = max ? max[a] : NaN;
    const axisMin = min ? min[a] : NaN;

    result &&=
      isAxisGE(axisMin, data[a], axisRef) &&
      isAxisLE(axisMax, data[a], axisRef);
  }

  return result;
};

const scrollToAxesData = (
  scrollData: ScrollData,
): FXPinAllAxesData<"top" | "left"> => ({
  top: {
    low: 0,
    high: scrollData[_.S_SCROLL_HEIGHT],
    current: scrollData[_.S_SCROLL_TOP],
  },
  left: {
    low: 0,
    high: scrollData[_.S_SCROLL_WIDTH],
    current: scrollData[_.S_SCROLL_LEFT],
  },
});

_.brandClass(FXMatcher, "FXMatcher");
_.brandClass(FXRelativeMatcher, "FXRelativeMatcher");
_.brandClass(FXNegateMatcher, "FXNegateMatcher");
_.brandClass(FXPinMatcher, "FXPinMatcher");
_.brandClass(FXComposerMatcher, "FXComposerMatcher");
_.brandClass(FXScrollMatcher, "FXScrollMatcher");
_.brandClass(FXViewMatcher, "FXViewMatcher");
