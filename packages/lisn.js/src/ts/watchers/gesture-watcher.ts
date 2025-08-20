/**
 * @module Watchers/GestureWatcher
 */

import * as _ from "@lisn/_internal";

import { illegalConstructorError } from "@lisn/globals/errors";

import {
  Direction,
  GestureIntent,
  GestureDevice,
  CommaSeparatedStr,
} from "@lisn/globals/types";

import {
  addClasses,
  removeClasses,
  setNumericStyleJsVars,
} from "@lisn/utils/css-alter";
import { isValidDirection } from "@lisn/utils/directions";
import {
  addEventListenerTo,
  removeEventListenerFrom,
  preventSelect,
  undoPreventSelect,
} from "@lisn/utils/event";
import { getDebouncedHandler } from "@lisn/utils/tasks";

import { addDeltaZ } from "@lisn/utils/gesture";

import {
  isValidInputDevice,
  isValidIntent,
  GestureFragment,
  DEVICES,
  INTENTS,
} from "@lisn/utils/gesture";
import { getKeyGestureFragment } from "@lisn/utils/gesture-key";
import { getPointerGestureFragment } from "@lisn/utils/gesture-pointer";
import { getTouchGestureFragment } from "@lisn/utils/gesture-touch";
import { getWheelGestureFragment } from "@lisn/utils/gesture-wheel";
import { logError } from "@lisn/utils/log";
import {
  maxAbs,
  toNonNegNum,
  toPosNum,
  toNumWithBounds,
} from "@lisn/utils/math";
import { randId, objToStrKey } from "@lisn/utils/text";
import { validateStrList } from "@lisn/utils/validation";

import {
  CallbackHandler,
  Callback,
  wrapCallback,
} from "@lisn/modules/callback";
import { createXWeakMap } from "@lisn/modules/x-map";

import { LoggerInterface } from "@lisn/debug/types";
import debug from "@lisn/debug/debug";

/**
 * {@link GestureWatcher} listens for user gestures resulting from wheel,
 * pointer, touch or key input events.
 *
 * It supports scroll, zoom or drag type gestures.
 *
 * It manages registered callbacks globally and reuses event listeners for more
 * efficient performance.
 */
export class GestureWatcher {
  /**
   * Call the given handler whenever the user performs a gesture on the target
   * matching the given options.
   *
   * **IMPORTANT:** The same handler can _not_ be added multiple times for the
   * same event target, even if the options differ. If the handler has already
   * been added for this target, either using {@link onGesture} or
   * {@link trackGesture}, then it will be removed and re-added with the
   * current options.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the options are invalid.
   */
  readonly onGesture: (
    target: EventTarget,
    handler: OnGestureHandler,
    options?: OnGestureOptions,
  ) => Promise<void>;

  /**
   * Removes a previously added handler.
   */
  readonly offGesture: (target: EventTarget, handler: OnGestureHandler) => void;

  /**
   * This is the same as {@link onGesture} except that if `handler` is not
   * given, then it defaults to an internal handler that updates a set of CSS
   * variables on the target's style:
   *
   *   - `--lisn-js--<Intent>-delta-x`
   *   - `--lisn-js--<Intent>-delta-y`
   *   - `--lisn-js--<Intent>-delta-z`
   *
   * where and `<Intent>` is one of {@link GestureIntent} and the delta X, Y
   * and Z are the _total summed up_ `deltaX`, `deltaY` and `deltaZ` since the
   * callback was added, summed over all devices used (key, touch, etc).
   *
   * **IMPORTANT:** The same handler can _not_ be added multiple times for the
   * same target, even if the options differ. If the handler has already been
   * added for this target, either using {@link trackGesture} or using
   * {@link onGesture}, then it will be removed and re-added with the current
   * options.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the options are invalid.
   */
  readonly trackGesture: (
    element: Element,
    handler?: OnGestureHandler | null,
    options?: OnGestureOptions,
  ) => Promise<void>;

  /**
   * Removes a previously added handler for {@link trackGesture}.
   */
  readonly noTrackGesture: (
    element: Element,
    handler?: OnGestureHandler | null,
  ) => void;

  /**
   * Creates a new instance of GestureWatcher with the given
   * {@link GestureWatcherConfig}. It does not save it for future reuse.
   */
  static create(config?: GestureWatcherConfig) {
    return new GestureWatcher(getConfig(config), CONSTRUCTOR_KEY);
  }

  /**
   * Returns an existing instance of GestureWatcher with the given
   * {@link GestureWatcherConfig}, or creates a new one.
   *
   * **NOTE:** It saves it for future reuse, so don't use this for temporary
   * short-lived watchers.
   */
  static reuse(config?: GestureWatcherConfig) {
    const myConfig = getConfig(config);
    const configStrKey = objToStrKey(myConfig);

    let instance = instances.get(configStrKey);
    if (!instance) {
      instance = new GestureWatcher(myConfig, CONSTRUCTOR_KEY);
      instances.set(configStrKey, instance);
    }

    return instance;
  }

  private constructor(
    config: GestureWatcherConfigInternal,
    key: typeof CONSTRUCTOR_KEY,
  ) {
    if (key !== CONSTRUCTOR_KEY) {
      throw illegalConstructorError("GestureWatcher.create");
    }

    const logger = debug
      ? new debug.Logger({ name: "GestureWatcher", logAtCreation: config })
      : null;

    const allCallbacks = createXWeakMap<
      EventTarget,
      Map<
        OnGestureHandler,
        {
          _callback: OnGestureCallback;
          _wrapper: OnGestureHandlerWrapper;
          _options: OnGestureOptionsInternal;
        }
      >
    >(() => _.createMap());

    // For each target and event type, add only 1 global listener that will then
    // manage the event queues and callbacks.
    const allListeners = createXWeakMap<
      EventTarget,
      Map<GestureDevice, DeviceListeners>
    >(() => _.createMap());

    // ----------

    const createCallback = (
      target: EventTarget,
      handler: OnGestureHandler,
      options: OnGestureOptionsInternal,
    ): OnGestureCallback => {
      _.remove(allCallbacks.get(target)?.get(handler)?._callback);

      debug: logger?.debug5("Adding/updating handler for", options);

      const { _callback, _wrapper } = getCallbackAndWrapper(
        handler,
        options,
        this,
        logger,
      );

      _callback.onRemove(() => deleteHandler(target, handler, options));

      allCallbacks.sGet(target).set(handler, {
        _callback,
        _wrapper,
        _options: options,
      });

      return _callback;
    };

    // ----------

    // async for consistency with other watchers and future compatibility in
    // case of change needed
    const setupOnGesture = async (
      target: EventTarget,
      handler: OnGestureHandler,
      userOptions: OnGestureOptions | undefined,
    ) => {
      const options = getOptions(config, userOptions ?? {});
      createCallback(target, handler, options);

      for (const device of options._devices ?? DEVICES) {
        let listeners = allListeners.get(target)?.get(device);
        if (listeners) {
          debug: logger?.debug4(
            `Listeners already added for ${device}`,
            target,
            options,
          );
        } else {
          debug: logger?.debug4(
            `Adding listeners for ${device}`,
            target,
            options,
          );

          listeners = setupListeners(target, device, options);
          allListeners.sGet(target).set(device, listeners);
        }

        listeners._nCallbacks++;
        if (options._preventDefault) {
          listeners._nPreventDefault++;
        }
      }
    };

    // ----------

    const deleteHandler = (
      target: EventTarget,
      handler: OnGestureHandler,
      options: OnGestureOptionsInternal,
    ) => {
      debug: logger?.debug5("Removing handler", target, handler, options);
      _.deleteKey(allCallbacks.get(target), handler);
      allCallbacks.prune(target);

      for (const device of options._devices ?? DEVICES) {
        const listeners = allListeners.get(target)?.get(device);
        if (listeners) {
          listeners._nCallbacks--;
          if (options._preventDefault) {
            listeners._nPreventDefault--;
          }

          if (!listeners._nCallbacks) {
            debug: logger?.debug4(
              `No more callbacks for target and device ${device}; removing listeners`,
              target,
            );

            _.deleteKey(allListeners.get(target), device);
            listeners._remove();
          }
        }
      }
    };

    // ----------

    const invokeCallbacks = (
      target: EventTarget,
      device: GestureDevice,
      event: Event,
    ): boolean /* true if terminated */ => {
      const preventDefault =
        (allListeners.get(target)?.get(device)?._nPreventDefault ?? 0) > 0;

      let isTerminated = false;
      for (const { _wrapper } of allCallbacks.get(target)?.values() || []) {
        isTerminated =
          _wrapper(target, device, event, preventDefault) || isTerminated;
      }

      return isTerminated;
    };

    // ----------

    const setupListeners = (
      target: EventTarget,
      device: GestureDevice,
      options: OnGestureOptionsInternal,
    ): DeviceListeners => {
      const intents = options._intents;
      let hasAddedTabIndex = false;
      let hasPreventedSelect = false;

      if (device === _.S_KEY && _.isElement(target) && !_.getTabIndex(target)) {
        hasAddedTabIndex = true;
        // enable element to receive keydown events
        _.setTabIndex(target);
      } else if (_.isElement(target) && device === _.S_TOUCH) {
        if (options._preventDefault) {
          addClasses(target, _.PREFIX_NO_TOUCH_ACTION);
        }

        if (!intents || _.includes(intents, _.S_DRAG)) {
          hasPreventedSelect = true;
          preventSelect(target);
        }
      }

      const addOrRemoveListeners = (
        action: "add" | "remove",
        listener: EventListener,
        eventTypes: readonly (keyof GlobalEventHandlersEventMap)[],
      ) => {
        const method =
          action === "add" ? addEventListenerTo : removeEventListenerFrom;
        for (const eventType of eventTypes) {
          debug: logger?.debug8(`${action} listener for ${eventType}`, target);
          method(target, eventType, listener, {
            passive: false,
            capture: true,
          });
        }
      };

      const addInitialListener = () =>
        addOrRemoveListeners("add", initialListener, initiatingEvents[device]);

      const removeInitialListener = () =>
        addOrRemoveListeners(
          "remove",
          initialListener,
          initiatingEvents[device],
        );

      const addOngoingListener = () =>
        addOrRemoveListeners("add", processEvent, ongoingEvents[device]);

      const removeOngoingListener = () =>
        addOrRemoveListeners("remove", processEvent, ongoingEvents[device]);

      const initialListener = (event: Event) => {
        processEvent(event);
        removeInitialListener();
        addOngoingListener();
      };

      const processEvent = (event: Event) => {
        const isTerminated = invokeCallbacks(target, device, event);
        if (isTerminated) {
          removeOngoingListener();
          addInitialListener();
        }
      };

      addInitialListener();

      return {
        _nCallbacks: 0,
        _nPreventDefault: 0,
        _remove: () => {
          if (_.isElement(target)) {
            if (hasAddedTabIndex) {
              _.unsetTabIndex(target);
            }

            removeClasses(target, _.PREFIX_NO_TOUCH_ACTION);

            if (hasPreventedSelect) {
              undoPreventSelect(target);
            }
          }

          removeOngoingListener();
          removeInitialListener();
        },
      };
    };

    // ----------

    this.trackGesture = (element, handler?, options?) => {
      if (!handler) {
        handler = setGestureCssProps;
        // initial values
        for (const intent of INTENTS) {
          setGestureCssProps(element, {
            intent,
            totalDeltaX: 0,
            totalDeltaY: 0,
            totalDeltaZ: 1,
          });
        }
      }

      return setupOnGesture(element, handler, options);
    };

    // ----------

    this.noTrackGesture = (element, handler?) => {
      if (!handler) {
        handler = setGestureCssProps;

        // delete the properties
        for (const intent of INTENTS) {
          setGestureCssProps(element, { intent });
        }
      }

      this.offGesture(element, handler);
    };

    // ----------

    this.onGesture = setupOnGesture;

    // ----------

    this.offGesture = (target, handler) => {
      _.remove(allCallbacks.get(target)?.get(handler)?._callback);
    };
  }
}

/**
 * @interface
 */
export type GestureWatcherConfig = {
  /**
   * The default value for
   * {@link OnGestureOptions.preventDefault | preventDefault} in calls to
   * {@link GestureWatcher.onGesture}.
   *
   * @defaultValue true
   */
  preventDefault?: boolean;

  /**
   * The default value for
   * {@link OnGestureOptions.debounceWindow | debounceWindow} in calls to
   * {@link GestureWatcher.onGesture}.
   *
   * @defaultValue 150
   */
  debounceWindow?: number;

  /**
   * The default value for
   * {@link OnGestureOptions.deltaThreshold | deltaThreshold} in calls to
   * {@link GestureWatcher.onGesture}.
   *
   * @defaultValue 5
   */
  deltaThreshold?: number;

  /**
   * The default value for
   * {@link OnGestureOptions.angleDiffThreshold | angleDiffThreshold} in calls to
   * {@link GestureWatcher.onGesture}.
   *
   * It does not make much sense to set this to 0.
   *
   * The value is in _degrees_, not radians.
   *
   * @defaultValue 35
   */
  angleDiffThreshold?: number;

  /**
   * The default value for
   * {@link OnGestureOptions.naturalTouchScroll | naturalTouchScroll} in calls to
   * {@link GestureWatcher.onGesture}.
   *
   * @defaultValue true
   */
  naturalTouchScroll?: boolean;

  /**
   * The default value for
   * {@link OnGestureOptions.touchDragHoldTime | touchDragHoldTime} in calls to
   * {@link GestureWatcher.onGesture}.
   *
   * @defaultValue 500
   */
  touchDragHoldTime?: number;

  /**
   * The default value for
   * {@link OnGestureOptions.touchDragNumFingers | touchDragNumFingers} in calls to
   * {@link GestureWatcher.onGesture}.
   *
   * @defaultValue 1
   */
  touchDragNumFingers?: number;
};

/**
 * @interface
 */
export type OnGestureOptions = {
  /**
   * One or more device types to listen for. If not specified, then all devices
   * are enabled.
   *
   * It can be a comma-separated list of {@link GestureDevice}s or an array of
   * such devices.
   *
   * @defaultValue undefined
   */
  devices?: CommaSeparatedStr<GestureDevice> | GestureDevice[];

  /**
   * If given, callback will only be called if the gesture's direction is one
   * of the given ones.
   *
   * It can be a comma-separated list of {@link Direction}s or an array of such
   * directions.
   *
   * @defaultValue undefined
   */
  directions?: CommaSeparatedStr<Direction> | Direction[];

  /**
   * If given, callback will only be called if the gesture's intent is one
   * of the given ones.
   *
   * It can be a comma-separated list of {@link GestureIntent}s or an
   * array of such intents.
   *
   * @defaultValue undefined
   */
  intents?: CommaSeparatedStr<GestureIntent> | GestureIntent[];

  /**
   * Set minimum total delta X. Further reductions in delta X below this value
   * will be ignored.
   *
   * The value is in pixels and can be negative.
   *
   * @defaultValue undefined
   */
  minTotalDeltaX?: number;

  /**
   * Set maximum total delta X. Further increase in delta X above this value
   * will be ignored.
   *
   * The value is in pixels.
   *
   * @defaultValue undefined
   */
  maxTotalDeltaX?: number;

  /**
   * Set minimum total delta Y. Further reductions in delta Y below this value
   * will be ignored.
   *
   * The value is in pixels and can be negative.
   *
   * @defaultValue undefined
   */
  minTotalDeltaY?: number;

  /**
   * Set maximum total delta Y. Further increase in delta Y above this value
   * will be ignored.
   *
   * The value is in pixels.
   *
   * @defaultValue undefined
   */
  maxTotalDeltaY?: number;

  /**
   * Set minimum total delta Z. Further reductions in delta Z below this value
   * will be ignored.
   *
   * The value is in percentage zoom, relative to 1, and can be less than 1 but
   * must be > 0.1 which is a hard minimum.
   *
   * @defaultValue undefined
   */
  minTotalDeltaZ?: number;

  /**
   * Set maximum total delta Z. Further increase in delta Z above this value
   * will be ignored.
   *
   * The value is in percentage zoom, relative to 1, and must be positive.
   *
   * @defaultValue undefined
   */
  maxTotalDeltaZ?: number;

  /**
   * If true, the events of the gesture, e.g. relevant key presses or touch
   * moves, etc, will have their default action prevented.
   *
   * **IMPORTANT:** For pointer gestures, then pointer/mouse down and click
   * will be prevented.
   *
   * @defaultValue {@link GestureWatcherConfig.preventDefault}
   */
  preventDefault?: boolean;

  /**
   * If given, callback will be called at most once every `debounceWindow`
   * milliseconds.
   *
   * Note that if both `debounceWindow` and `deltaThreshold` are set, _both_
   * must be exceeded before callback is called.
   *
   * @defaultValue {@link GestureWatcherConfig.debounceWindow}
   */
  debounceWindow?: number;

  /**
   * Callback will only be called when the gesture's accumulated delta, since
   * the last time callback was called, exceeds `deltaThreshold`.
   *
   * At least one of the three deltas (X, Y or Z) must exceed this number (in
   * absolute value). Note that when comparing `deltaZ`, it is multiplied by
   * 100 since it represents fractions of 1 (100%). So supplying
   * `deltaThreshold` of 10 means is equivalent to the following condition:
   *
   * ```
   * abs(deltaX) >= 10 || abs(deltaY) >= 10 ||  abs(1 - deltaZ) >= 0.1
   * ```
   *
   * Accumulation of the delta ends if the gesture is terminated, for example,
   * in case of touch gestures, by a "touchcancel" event of by the final finger
   * lifting off..
   *
   * Note that if both `debounceWindow` and `deltaThreshold` are set, _both_
   * must be exceeded before callback is called.
   *
   * @defaultValue {@link GestureWatcherConfig.deltaThreshold}
   */
  deltaThreshold?: number;

  /**
   * See {@link Utils.getVectorDirection | getVectorDirection}.
   *
   * @defaultValue {@link GestureWatcherConfig.angleDiffThreshold}
   */
  angleDiffThreshold?: number;

  /**
   * Whether touch scroll gestures follow the natural direction: swipe up
   * with scroll intent results in direction down and swipe down results in
   * direction up.
   *
   * @defaultValue {@link GestureWatcherConfig.naturalTouchScroll}
   */
  naturalTouchScroll?: boolean;

  /**
   * If the user presses and holds on a touchscreen for at least the given
   * amount of milliseconds before moving the finger(s), touch gestures other
   * than pinch will be treated as a drag intent instead of scroll as long as
   * the number of fingers touching the screen is {@link touchDragNumFingers}.
   *
   * Set to 0 in order to treat _all_ non-pinch touch gestures as drag.
   *
   * Set to a negative number in order to treat _all_ non-pinch touch gestures
   * as scroll.
   *
   * @defaultValue {@link GestureWatcherConfig.touchDragHoldTime}
   */
  touchDragHoldTime?: number;

  /**
   * The number of fingers that could be considered a drag intent for touch
   * gestures.
   *
   * @defaultValue {@link GestureWatcherConfig.touchDragHoldTime}
   */
  touchDragNumFingers?: number;
};

/**
 * The handler is invoked with four arguments:
 *
 * - The event target that was passed to the {@link GestureWatcher.onGesture}
 *   call (equivalent to
 *   {@link https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget | Event:currentTarget}).
 * - The {@link GestureData} that describes the gesture's progression since the
 *   last time the callback was called and since the callback was added.
 * - The list of events that constituted the gesture.
 * - (since v1.3.0) The {@link GestureWatcher} instance.
 */
export type OnGestureHandlerArgs = [
  EventTarget,
  GestureData,
  Event[],
  GestureWatcher,
];
export type OnGestureCallback = Callback<OnGestureHandlerArgs>;
export type OnGestureHandler =
  | CallbackHandler<OnGestureHandlerArgs>
  | OnGestureCallback;

export type GestureData = {
  device: GestureDevice;
  direction: Direction;
  intent: GestureIntent;

  /**
   * Delta in the horizontal direction since the start of the gesture.
   */
  deltaX: number;

  /**
   * Delta in the vertical direction since the start of the gesture.
   */
  deltaY: number;

  /**
   * Relative fractional zoom in or out for zoom intents since the start of
   * the gesture.
   *
   * For zoom in, `deltaZ` is always > 1, and for zoom out it is < 1.
   *
   * For non-zoom gestures it is 1.
   */
  deltaZ: number;

  /**
   * The time in milliseconds it took for the gesture. This will be the
   * difference in timestamps between the first and last event that composed
   * the gesture. For key and wheel gestures this could be 0, since 1 event is
   * sufficient for them.
   */
  time: number;
  // TODO totalTime, velocity (bound by max), averageVelocity (bound by max)

  /**
   * Delta in the horizontal direction since the callback was added.
   */
  totalDeltaX: number;

  /**
   * Delta in the vertical direction since the callback was added.
   */
  totalDeltaY: number;

  /**
   * Percentage (relative) zoom in or out for zoom intents since the callback
   * was added.
   */
  totalDeltaZ: number;
};

// ----------------------------------------

type GestureWatcherConfigInternal = {
  _preventDefault: boolean;
  _debounceWindow: number;
  _deltaThreshold: number;
  _angleDiffThreshold: number;
  _naturalTouchScroll: boolean;
  _touchDragHoldTime: number;
  _touchDragNumFingers: number;
};

type OnGestureOptionsInternal = {
  _devices: GestureDevice[] | null;
  _directions: Direction[] | null;
  _intents: GestureIntent[] | null;
  _minTotalDeltaX: number | null;
  _maxTotalDeltaX: number | null;
  _minTotalDeltaY: number | null;
  _maxTotalDeltaY: number | null;
  _minTotalDeltaZ: number | null;
  _maxTotalDeltaZ: number | null;
  _preventDefault: boolean;
  _debounceWindow: number;
  _deltaThreshold: number;
  _angleDiffThreshold: number;
  _naturalTouchScroll: boolean;
  _touchDragHoldTime: number;
  _touchDragNumFingers: number;
};

type OnGestureHandlerWrapper = (
  _target: EventTarget,
  _device: GestureDevice,
  _event: Event,
  _preventDefault: boolean,
) => boolean;

// Specific to a combination of target + device
type DeviceListeners = {
  _nCallbacks: number; // total number of callbacks
  _nPreventDefault: number; // total number wanting to prevent default action
  _remove: () => void;
};

const CONSTRUCTOR_KEY: unique symbol = _.SYMBOL() as typeof CONSTRUCTOR_KEY;
const instances = _.createMap<string, GestureWatcher>();

const getConfig = (
  config: GestureWatcherConfig | undefined,
): GestureWatcherConfigInternal => {
  config ??= {};
  return {
    _preventDefault: config.preventDefault ?? true,
    _debounceWindow: toNonNegNum(config[_.S_DEBOUNCE_WINDOW], 150),
    _deltaThreshold: toNonNegNum(config.deltaThreshold, 5),
    _angleDiffThreshold: toPosNum(config.angleDiffThreshold, 35),
    _naturalTouchScroll: config.naturalTouchScroll ?? true,
    _touchDragHoldTime: config.touchDragHoldTime ?? 500,
    _touchDragNumFingers: config.touchDragNumFingers ?? 1,
  };
};

const initiatingEvents: {
  [D in GestureDevice]: readonly (keyof GlobalEventHandlersEventMap)[];
} = {
  key: [_.S_KEYDOWN],
  // If the browser doesn't support pointer events, then
  // addEventListenerTo will transform it into mousedown
  //
  // We need to listen for click, since that occurs after a pointerup (i.e.
  // after a gesure is terminated and the ongoing listeners removed), but it
  // needs to have its default action prevented.
  pointer: [_.S_POINTERDOWN, _.S_CLICK],
  touch: [_.S_TOUCHSTART],
  wheel: [_.S_WHEEL],
} as const;

const ongoingEvents: {
  [D in GestureDevice]: readonly (keyof GlobalEventHandlersEventMap)[];
} = {
  key: [_.S_KEYDOWN],
  pointer: [
    // If the browser doesn't support point events, then
    // addEventListenerTo will transform them into mouse*
    _.S_POINTERDOWN,
    _.S_POINTERUP, // would terminate
    _.S_POINTERMOVE,
    _.S_POINTERCANCEL, // would terminate
    _.S_CLICK, // would terminate; can be default-prevented
  ],
  touch: [_.S_TOUCHSTART, _.S_TOUCHEND, _.S_TOUCHMOVE, _.S_TOUCHCANCEL],
  wheel: [_.S_WHEEL],
} as const;

const fragmentGetters: {
  [D in GestureDevice]: (
    events: Event[],
    options: {
      deltaThreshold?: number;
      angleDiffThreshold?: number;
      reverseScroll?: boolean;
      dragHoldTime?: number;
      dragNumFingers?: number;
    },
  ) => GestureFragment | null | false;
} = {
  [_.S_KEY]: getKeyGestureFragment,
  [_.S_POINTER]: getPointerGestureFragment,
  [_.S_TOUCH]: getTouchGestureFragment,
  [_.S_WHEEL]: getWheelGestureFragment,
};

const getOptions = (
  config: GestureWatcherConfigInternal,
  options: OnGestureOptions,
): OnGestureOptionsInternal => {
  const debounceWindow = toNonNegNum(
    options[_.S_DEBOUNCE_WINDOW],
    config._debounceWindow, // watcher is never debounced, so apply default here
  );
  const deltaThreshold = toNonNegNum(
    options.deltaThreshold,
    config._deltaThreshold,
  );

  return {
    _devices:
      validateStrList("devices", options.devices, isValidInputDevice) ?? null,
    _directions:
      validateStrList("directions", options.directions, isValidDirection) ??
      null,
    _intents:
      validateStrList("intents", options.intents, isValidIntent) ?? null,
    _minTotalDeltaX: options.minTotalDeltaX ?? null,
    _maxTotalDeltaX: options.maxTotalDeltaX ?? null,
    _minTotalDeltaY: options.minTotalDeltaY ?? null,
    _maxTotalDeltaY: options.maxTotalDeltaY ?? null,
    _minTotalDeltaZ: options.minTotalDeltaZ ?? null,
    _maxTotalDeltaZ: options.maxTotalDeltaZ ?? null,
    _preventDefault: options.preventDefault ?? config._preventDefault,
    _debounceWindow: debounceWindow,
    _deltaThreshold: deltaThreshold,
    _angleDiffThreshold: toNonNegNum(
      options.angleDiffThreshold,
      config._angleDiffThreshold,
    ),
    _naturalTouchScroll:
      options.naturalTouchScroll ?? config._naturalTouchScroll,
    _touchDragHoldTime: options.touchDragHoldTime ?? config._touchDragHoldTime,
    _touchDragNumFingers:
      options.touchDragNumFingers ?? config._touchDragNumFingers,
  };
};

// Since each callback needs to accumulate events during its debounce window
// and until its threshold is exceeded, we use a wrapper around the
// user-supplied handler to do that.
const getCallbackAndWrapper = (
  handler: OnGestureHandler,
  options: OnGestureOptionsInternal,
  watcher: GestureWatcher,
  logger: LoggerInterface | null,
): { _callback: OnGestureCallback; _wrapper: OnGestureHandlerWrapper } => {
  let totalDeltaX = 0,
    totalDeltaY = 0,
    totalDeltaZ = 1;
  // When there's a pointer down, drag then pointerup, since we prevent
  // pointerdown default action, this results in a click event shortly
  // afterwards even when there's been a movement of the mouse. We detect that
  // and prevent this click.
  let preventNextClick = false;

  const directions = options._directions;
  const intents = options._intents;
  const minTotalDeltaX = options._minTotalDeltaX;
  const maxTotalDeltaX = options._maxTotalDeltaX;
  const minTotalDeltaY = options._minTotalDeltaY;
  const maxTotalDeltaY = options._maxTotalDeltaY;
  const minTotalDeltaZ = options._minTotalDeltaZ;
  const maxTotalDeltaZ = options._maxTotalDeltaZ;
  const deltaThreshold = options._deltaThreshold;
  const angleDiffThreshold = options._angleDiffThreshold;
  const reverseScroll = !options._naturalTouchScroll;
  const dragHoldTime = options._touchDragHoldTime;
  const dragNumFingers = options._touchDragNumFingers;

  // The event queue is cleared when the threshold is exceeded AND the debounce
  // window has passed. It's not necessary for the actual handler to be called
  // then (e.g. if the direction or intent doesn't match, it won't be).
  const eventQueue: Event[] = [];
  const id = randId();

  // Since handler could be a function or a callback (not callable), we wrap it
  // so that in case it's already a callback, its removal will result in
  // deleteHandler getting called. It is not debounced itself, instead there's
  // a debounced wrapper that invokes it.
  const callback = wrapCallback(handler);

  // The debounced callback wrapper is what is debounced.
  // It accumulates total deltas and checks if the conditions (of threshold,
  // direction and intent) are satisfied before calling the real handler.
  //
  // Most importantly, since it is only called when the debounce window has
  // expired it can clear the event queue if the threshold is also exceeded.
  const debouncedWrapper = getDebouncedHandler(
    options._debounceWindow,
    (
      target: EventTarget,
      fragment: GestureFragment,
      eventQueueCopy: Event[],
    ) => {
      if (callback.isRemoved()) {
        return;
      }

      const deltaX = fragment.deltaX;
      const deltaY = fragment.deltaY;
      const deltaZ = fragment.deltaZ;
      const device = fragment.device;

      if (
        _.round(maxAbs(deltaX, deltaY, (1 - deltaZ) * 100)) < deltaThreshold
      ) {
        debug: logger?.debug7(
          `[${id}] Delta threshold not exceeded for callback`,
        );
        return;
      }

      debug: logger?.debug9(`[${id}] Done summing events for ${device}`);
      clearEventQueue(device, eventQueue);

      const newTotalDeltaX = toNumWithBounds(totalDeltaX + deltaX, {
        min: minTotalDeltaX,
        max: maxTotalDeltaX,
      });

      const newTotalDeltaY = toNumWithBounds(totalDeltaY + deltaY, {
        min: minTotalDeltaY,
        max: maxTotalDeltaY,
      });

      const newTotalDeltaZ = toNumWithBounds(addDeltaZ(totalDeltaZ, deltaZ), {
        min: minTotalDeltaZ,
        max: maxTotalDeltaZ,
      });

      if (
        newTotalDeltaX === totalDeltaX &&
        newTotalDeltaY === totalDeltaY &&
        newTotalDeltaZ === totalDeltaZ
      ) {
        return;
      }

      totalDeltaX = newTotalDeltaX;
      totalDeltaY = newTotalDeltaY;
      totalDeltaZ = newTotalDeltaZ;

      const direction = fragment.direction;
      const intent = fragment.intent;
      const time =
        eventQueueCopy[_.lengthOf(eventQueueCopy) - 1]?.timeStamp -
          eventQueueCopy[0]?.timeStamp || 0;

      const data = {
        device,
        direction,
        intent,
        deltaX,
        deltaY,
        deltaZ,
        time,
        totalDeltaX,
        totalDeltaY,
        totalDeltaZ,
      };

      if (
        direction !== _.S_NONE &&
        (!directions || _.includes(directions, direction)) &&
        (!intents || _.includes(intents, intent))
      ) {
        callback.invoke(target, data, eventQueueCopy, watcher).catch(logError);
      } else {
        debug: logger?.debug7(
          `[${id}] Directions or intents not matching for callback`,
        );
      }
    },
  );

  // This wrapper is NOT debounced and adds the events to the queue, prevents
  // default action if needed, and indicates whether the gesture is terminated.
  const wrapper = (
    target: EventTarget,
    device: GestureDevice,
    event: Event,
    preventDefault: boolean,
  ) => {
    eventQueue.push(event);

    const fragment = fragmentGetters[device](eventQueue, {
      angleDiffThreshold,
      deltaThreshold,
      reverseScroll,
      dragHoldTime,
      dragNumFingers,
    });

    debug: logger?.debug8(
      `[${id}] Got fragment for ${device} (${event.type})`,
      fragment,
      [...eventQueue].map((e) => e.type),
    );

    if (preventDefault) {
      preventDefaultActionFor(
        event,
        !!fragment || (event.type === _.S_CLICK && preventNextClick),
      );
    }

    if (fragment === false) {
      // not enough events in the queue, pass
      debug: logger?.debug9(`[${id}] Not enough events for gesture ${device}`);
      return false;
    } else if (_.isNull(fragment)) {
      // consider the gesture terminated
      clearEventQueue(device, eventQueue);
      debug: logger?.debug9(`[${id}] Gesture for ${device} terminated`);
      return true;
    }

    if (device === _.S_POINTER) {
      // If we're here, there's been a drag, expect a click immediately
      // afterwards and prevent default action.
      preventNextClick = true;
      _.setTimer(() => {
        preventNextClick = false;
      }, 10);
    }

    debouncedWrapper(
      target,
      fragment,
      [...eventQueue], // copy
    );

    return false;
  };

  return { _callback: callback, _wrapper: wrapper };
};

const clearEventQueue = (device: GestureDevice, queue: Event[]) => {
  const keepLastEvent = device === _.S_POINTER || device === _.S_TOUCH;
  queue.splice(0, _.lengthOf(queue) - (keepLastEvent ? 1 : 0));
};

const preventDefaultActionFor = (event: Event, isActualGesture: boolean) => {
  const target = event.currentTarget;
  const eventType = event.type;
  const isPointerDown =
    eventType === _.S_POINTERDOWN || eventType === _.S_MOUSEDOWN;

  if (
    eventType === _.S_TOUCHMOVE ||
    eventType === _.S_WHEEL ||
    ((eventType === _.S_CLICK || eventType === _.S_KEYDOWN) &&
      isActualGesture) ||
    (isPointerDown && (event as MouseEvent).buttons === 1)
  ) {
    _.preventDefault(event);

    if (isPointerDown && _.isHTMLElement(target)) {
      // Otherwise capturing key events won't work
      target.focus({ preventScroll: true });
    }
  }
};

const setGestureCssProps = (
  target: EventTarget,
  data: Partial<GestureData>,
) => {
  const intent = data.intent;

  if (!_.isElement(target) || !intent || intent === _.S_UNKNOWN) {
    return;
  }

  const prefix = `${intent}-`;

  if (intent === _.S_ZOOM) {
    setNumericStyleJsVars(
      target,
      {
        deltaZ: data.totalDeltaZ,
      },
      {
        _prefix: prefix,
        _numDecimal: 2,
      },
    ); // don't await here
  } else {
    setNumericStyleJsVars(
      target,
      {
        deltaX: data.totalDeltaX,
        deltaY: data.totalDeltaY,
      },
      {
        _prefix: prefix,
      },
    ); // don't await here
  }
};

_.brandClass(GestureWatcher, "GestureWatcher");
