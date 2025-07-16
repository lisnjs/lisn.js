"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GestureWatcher = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _cssAlter = require("../utils/css-alter.cjs");
var _directions = require("../utils/directions.cjs");
var _event2 = require("../utils/event.cjs");
var _tasks = require("../utils/tasks.cjs");
var _gesture = require("../utils/gesture.cjs");
var _gestureKey = require("../utils/gesture-key.cjs");
var _gesturePointer = require("../utils/gesture-pointer.cjs");
var _gestureTouch = require("../utils/gesture-touch.cjs");
var _gestureWheel = require("../utils/gesture-wheel.cjs");
var _log = require("../utils/log.cjs");
var _math = require("../utils/math.cjs");
var _text = require("../utils/text.cjs");
var _validation = require("../utils/validation.cjs");
var _callback2 = require("../modules/callback.cjs");
var _xMap = require("../modules/x-map.cjs");
var _debug = _interopRequireDefault(require("../debug/debug.cjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Watchers/GestureWatcher
 */
/**
 * {@link GestureWatcher} listens for user gestures resulting from wheel,
 * pointer, touch or key input events.
 *
 * It supports scroll, zoom or drag type gestures.
 *
 * It manages registered callbacks globally and reuses event listeners for more
 * efficient performance.
 */
class GestureWatcher {
  /**
   * Creates a new instance of GestureWatcher with the given
   * {@link GestureWatcherConfig}. It does not save it for future reuse.
   */
  static create(config = {}) {
    return new GestureWatcher(getConfig(config), CONSTRUCTOR_KEY);
  }

  /**
   * Returns an existing instance of GestureWatcher with the given
   * {@link GestureWatcherConfig}, or creates a new one.
   *
   * **NOTE:** It saves it for future reuse, so don't use this for temporary
   * short-lived watchers.
   */
  static reuse(config = {}) {
    const myConfig = getConfig(config);
    const configStrKey = (0, _text.objToStrKey)(myConfig);
    let instance = instances.get(configStrKey);
    if (!instance) {
      instance = new GestureWatcher(myConfig, CONSTRUCTOR_KEY);
      instances.set(configStrKey, instance);
    }
    return instance;
  }
  constructor(config, key) {
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
    _defineProperty(this, "onGesture", void 0);
    /**
     * Removes a previously added handler.
     */
    _defineProperty(this, "offGesture", void 0);
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
    _defineProperty(this, "trackGesture", void 0);
    /**
     * Removes a previously added handler for {@link trackGesture}.
     */
    _defineProperty(this, "noTrackGesture", void 0);
    if (key !== CONSTRUCTOR_KEY) {
      throw MH.illegalConstructorError("GestureWatcher.create");
    }
    const logger = _debug.default ? new _debug.default.Logger({
      name: "GestureWatcher",
      logAtCreation: config
    }) : null;
    const allCallbacks = (0, _xMap.newXWeakMap)(() => MH.newMap());

    // For each target and event type, add only 1 global listener that will then
    // manage the event queues and callbacks.
    const allListeners = (0, _xMap.newXWeakMap)(() => MH.newMap());

    // ----------

    const createCallback = (target, handler, options) => {
      var _allCallbacks$get;
      MH.remove((_allCallbacks$get = allCallbacks.get(target)) === null || _allCallbacks$get === void 0 || (_allCallbacks$get = _allCallbacks$get.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      debug: logger === null || logger === void 0 || logger.debug5("Adding/updating handler for", options);
      const {
        _callback,
        _wrapper
      } = getCallbackAndWrapper(handler, options, logger);
      _callback.onRemove(() => deleteHandler(target, handler, options));
      allCallbacks.sGet(target).set(handler, {
        _callback,
        _wrapper,
        _options: options
      });
      return _callback;
    };

    // ----------

    // async for consistency with other watchers and future compatibility in
    // case of change needed
    const setupOnGesture = async (target, handler, userOptions) => {
      const options = getOptions(config, userOptions || {});
      createCallback(target, handler, options);
      for (const device of options._devices || _gesture.DEVICES) {
        var _allListeners$get;
        let listeners = (_allListeners$get = allListeners.get(target)) === null || _allListeners$get === void 0 ? void 0 : _allListeners$get.get(device);
        if (listeners) {
          debug: logger === null || logger === void 0 || logger.debug4(`Listeners already added for ${device}`, target, options);
        } else {
          debug: logger === null || logger === void 0 || logger.debug4(`Adding listeners for ${device}`, target, options);
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

    const deleteHandler = (target, handler, options) => {
      MH.deleteKey(allCallbacks.get(target), handler);
      allCallbacks.prune(target);
      for (const device of options._devices || _gesture.DEVICES) {
        var _allListeners$get2;
        const listeners = (_allListeners$get2 = allListeners.get(target)) === null || _allListeners$get2 === void 0 ? void 0 : _allListeners$get2.get(device);
        if (listeners) {
          listeners._nCallbacks--;
          if (options._preventDefault) {
            listeners._nPreventDefault--;
          }
          if (!listeners._nCallbacks) {
            debug: logger === null || logger === void 0 || logger.debug4(`No more callbacks for target and device ${device}; removing listeners`, target);
            MH.deleteKey(allListeners.get(target), device);
            listeners._remove();
          }
        }
      }
    };

    // ----------

    const invokeCallbacks = (target, device, event) => {
      var _allListeners$get3;
      const preventDefault = (((_allListeners$get3 = allListeners.get(target)) === null || _allListeners$get3 === void 0 || (_allListeners$get3 = _allListeners$get3.get(device)) === null || _allListeners$get3 === void 0 ? void 0 : _allListeners$get3._nPreventDefault) || 0) > 0;
      let isTerminated = false;
      for (const {
        _wrapper
      } of ((_allCallbacks$get2 = allCallbacks.get(target)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2.values()) || []) {
        var _allCallbacks$get2;
        isTerminated = _wrapper(target, device, event, preventDefault) || isTerminated;
      }
      return isTerminated;
    };

    // ----------

    const setupListeners = (target, device, options) => {
      const intents = options._intents;
      let hasAddedTabIndex = false;
      let hasPreventedSelect = false;
      if (device === MC.S_KEY && MH.isElement(target) && !MH.getTabIndex(target)) {
        hasAddedTabIndex = true;
        // enable element to receive keydown events
        MH.setTabIndex(target);
      } else if (MH.isElement(target) && device === MC.S_TOUCH) {
        if (options._preventDefault) {
          (0, _cssAlter.addClasses)(target, MC.PREFIX_NO_TOUCH_ACTION);
        }
        if (!intents || MH.includes(intents, MC.S_DRAG)) {
          hasPreventedSelect = true;
          (0, _event2.preventSelect)(target);
        }
      }
      const addOrRemoveListeners = (action, listener, eventTypes) => {
        const method = action === "add" ? _event2.addEventListenerTo : _event2.removeEventListenerFrom;
        for (const eventType of eventTypes) {
          debug: logger === null || logger === void 0 || logger.debug8(`${action} listener for ${eventType}`, target);
          method(target, eventType, listener, {
            passive: false,
            capture: true
          });
        }
      };
      const addInitialListener = () => addOrRemoveListeners("add", initialListener, initiatingEvents[device]);
      const removeInitialListener = () => addOrRemoveListeners("remove", initialListener, initiatingEvents[device]);
      const addOngoingListener = () => addOrRemoveListeners("add", processEvent, ongoingEvents[device]);
      const removeOngoingListener = () => addOrRemoveListeners("remove", processEvent, ongoingEvents[device]);
      const initialListener = event => {
        processEvent(event);
        removeInitialListener();
        addOngoingListener();
      };
      const processEvent = event => {
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
          if (MH.isElement(target)) {
            if (hasAddedTabIndex) {
              MH.unsetTabIndex(target);
            }
            (0, _cssAlter.removeClasses)(target, MC.PREFIX_NO_TOUCH_ACTION);
            if (hasPreventedSelect) {
              (0, _event2.undoPreventSelect)(target);
            }
          }
          removeOngoingListener();
          removeInitialListener();
        }
      };
    };

    // ----------

    this.trackGesture = (element, handler, options) => {
      if (!handler) {
        handler = setGestureCssProps;
        // initial values
        for (const intent of _gesture.INTENTS) {
          setGestureCssProps(element, {
            intent,
            totalDeltaX: 0,
            totalDeltaY: 0,
            totalDeltaZ: 1
          });
        }
      }
      return setupOnGesture(element, handler, options);
    };

    // ----------

    this.noTrackGesture = (element, handler) => {
      if (!handler) {
        handler = setGestureCssProps;

        // delete the properties
        for (const intent of _gesture.INTENTS) {
          setGestureCssProps(element, {
            intent
          });
        }
      }
      this.offGesture(element, handler);
    };

    // ----------

    this.onGesture = setupOnGesture;

    // ----------

    this.offGesture = (target, handler) => {
      var _allCallbacks$get3;
      debug: logger === null || logger === void 0 || logger.debug5("Removing handler");
      MH.remove((_allCallbacks$get3 = allCallbacks.get(target)) === null || _allCallbacks$get3 === void 0 || (_allCallbacks$get3 = _allCallbacks$get3.get(handler)) === null || _allCallbacks$get3 === void 0 ? void 0 : _allCallbacks$get3._callback);
    };
  }
}

/**
 * @interface
 */

/**
 * @interface
 */

/**
 * The handler is invoked with two arguments:
 *
 * - the event target that was passed to the {@link GestureWatcher.onGesture}
 *   call (equivalent to
 *   {@link https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget | Event:currentTarget}).
 * - the {@link GestureData} that describes the gesture's progression since the
 *   last time the callback was called and since the callback was added.
 */

// ----------------------------------------

// Specific to a combination of target + device
exports.GestureWatcher = GestureWatcher;
const CONSTRUCTOR_KEY = MC.SYMBOL();
const instances = MH.newMap();
const getConfig = config => {
  var _config$preventDefaul, _config$naturalTouchS, _config$touchDragHold, _config$touchDragNumF;
  return {
    _preventDefault: (_config$preventDefaul = config.preventDefault) !== null && _config$preventDefaul !== void 0 ? _config$preventDefaul : true,
    _debounceWindow: (0, _math.toNonNegNum)(config[MC.S_DEBOUNCE_WINDOW], 150),
    _deltaThreshold: (0, _math.toNonNegNum)(config.deltaThreshold, 5),
    _angleDiffThreshold: (0, _math.toPosNum)(config.angleDiffThreshold, 35),
    _naturalTouchScroll: (_config$naturalTouchS = config.naturalTouchScroll) !== null && _config$naturalTouchS !== void 0 ? _config$naturalTouchS : true,
    _touchDragHoldTime: (_config$touchDragHold = config.touchDragHoldTime) !== null && _config$touchDragHold !== void 0 ? _config$touchDragHold : 500,
    _touchDragNumFingers: (_config$touchDragNumF = config.touchDragNumFingers) !== null && _config$touchDragNumF !== void 0 ? _config$touchDragNumF : 1
  };
};
const initiatingEvents = {
  key: [MC.S_KEYDOWN],
  // If the browser doesn't support pointer events, then
  // addEventListenerTo will transform it into mousedown
  //
  // We need to listen for click, since that occurs after a pointerup (i.e.
  // after a gesure is terminated and the ongoing listeners removed), but it
  // needs to have its default action prevented.
  pointer: [MC.S_POINTERDOWN, MC.S_CLICK],
  touch: [MC.S_TOUCHSTART],
  wheel: [MC.S_WHEEL]
};
const ongoingEvents = {
  key: [MC.S_KEYDOWN],
  pointer: [
  // If the browser doesn't support point events, then
  // addEventListenerTo will transform them into mouse*
  MC.S_POINTERDOWN, MC.S_POINTERUP,
  // would terminate
  MC.S_POINTERMOVE, MC.S_POINTERCANCEL,
  // would terminate
  MC.S_CLICK // would terminate; can be default-prevented
  ],
  touch: [MC.S_TOUCHSTART, MC.S_TOUCHEND, MC.S_TOUCHMOVE, MC.S_TOUCHCANCEL],
  wheel: [MC.S_WHEEL]
};
const fragmentGetters = {
  [MC.S_KEY]: _gestureKey.getKeyGestureFragment,
  [MC.S_POINTER]: _gesturePointer.getPointerGestureFragment,
  [MC.S_TOUCH]: _gestureTouch.getTouchGestureFragment,
  [MC.S_WHEEL]: _gestureWheel.getWheelGestureFragment
};
const getOptions = (config, options) => {
  var _options$minTotalDelt, _options$maxTotalDelt, _options$minTotalDelt2, _options$maxTotalDelt2, _options$minTotalDelt3, _options$maxTotalDelt3, _options$preventDefau, _options$naturalTouch, _options$touchDragHol, _options$touchDragNum;
  const debounceWindow = (0, _math.toNonNegNum)(options[MC.S_DEBOUNCE_WINDOW], config._debounceWindow // watcher is never debounced, so apply default here
  );
  const deltaThreshold = (0, _math.toNonNegNum)(options.deltaThreshold, config._deltaThreshold);
  return {
    _devices: (0, _validation.validateStrList)("devices", options.devices, _gesture.isValidInputDevice) || null,
    _directions: (0, _validation.validateStrList)("directions", options.directions, _directions.isValidDirection) || null,
    _intents: (0, _validation.validateStrList)("intents", options.intents, _gesture.isValidIntent) || null,
    _minTotalDeltaX: (_options$minTotalDelt = options.minTotalDeltaX) !== null && _options$minTotalDelt !== void 0 ? _options$minTotalDelt : null,
    _maxTotalDeltaX: (_options$maxTotalDelt = options.maxTotalDeltaX) !== null && _options$maxTotalDelt !== void 0 ? _options$maxTotalDelt : null,
    _minTotalDeltaY: (_options$minTotalDelt2 = options.minTotalDeltaY) !== null && _options$minTotalDelt2 !== void 0 ? _options$minTotalDelt2 : null,
    _maxTotalDeltaY: (_options$maxTotalDelt2 = options.maxTotalDeltaY) !== null && _options$maxTotalDelt2 !== void 0 ? _options$maxTotalDelt2 : null,
    _minTotalDeltaZ: (_options$minTotalDelt3 = options.minTotalDeltaZ) !== null && _options$minTotalDelt3 !== void 0 ? _options$minTotalDelt3 : null,
    _maxTotalDeltaZ: (_options$maxTotalDelt3 = options.maxTotalDeltaZ) !== null && _options$maxTotalDelt3 !== void 0 ? _options$maxTotalDelt3 : null,
    _preventDefault: (_options$preventDefau = options.preventDefault) !== null && _options$preventDefau !== void 0 ? _options$preventDefau : config._preventDefault,
    _debounceWindow: debounceWindow,
    _deltaThreshold: deltaThreshold,
    _angleDiffThreshold: (0, _math.toNonNegNum)(options.angleDiffThreshold, config._angleDiffThreshold),
    _naturalTouchScroll: (_options$naturalTouch = options.naturalTouchScroll) !== null && _options$naturalTouch !== void 0 ? _options$naturalTouch : config._naturalTouchScroll,
    _touchDragHoldTime: (_options$touchDragHol = options.touchDragHoldTime) !== null && _options$touchDragHol !== void 0 ? _options$touchDragHol : config._touchDragHoldTime,
    _touchDragNumFingers: (_options$touchDragNum = options.touchDragNumFingers) !== null && _options$touchDragNum !== void 0 ? _options$touchDragNum : config._touchDragNumFingers
  };
};

// Since each callback needs to accumulate events during its debounce window
// and until its threshold is exceeded, we use a wrapper around the
// user-supplied handler to do that.
const getCallbackAndWrapper = (handler, options, logger) => {
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
  const eventQueue = [];
  const id = (0, _text.randId)();

  // Since handler could be a function or a callback (not callable), we wrap it
  // so that in case it's already a callback, its removal will result in
  // deleteHandler getting called. It is not debounced itself, instead there's
  // a debounced wrapper that invokes it.
  const callback = (0, _callback2.wrapCallback)(handler);

  // The debounced callback wrapper is what is debounced.
  // It accumulates total deltas and checks if the conditions (of threshold,
  // direction and intent) are satisfied before calling the real handler.
  //
  // Most importantly, since it is only called when the debounce window has
  // expired it can clear the event queue if the threshold is also exceeded.
  const debouncedWrapper = (0, _tasks.getDebouncedHandler)(options._debounceWindow, (target, fragment, eventQueueCopy) => {
    var _eventQueueCopy, _eventQueueCopy$;
    if (callback.isRemoved()) {
      return;
    }
    const deltaX = fragment.deltaX;
    const deltaY = fragment.deltaY;
    const deltaZ = fragment.deltaZ;
    const device = fragment.device;
    if (MH.round((0, _math.maxAbs)(deltaX, deltaY, (1 - deltaZ) * 100)) < deltaThreshold) {
      debug: logger === null || logger === void 0 || logger.debug7(`[${id}] Delta threshold not exceeded for callback`);
      return;
    }
    debug: logger === null || logger === void 0 || logger.debug9(`[${id}] Done summing events for ${device}`);
    clearEventQueue(device, eventQueue);
    const newTotalDeltaX = (0, _math.toNumWithBounds)(totalDeltaX + deltaX, {
      min: minTotalDeltaX,
      max: maxTotalDeltaX
    });
    const newTotalDeltaY = (0, _math.toNumWithBounds)(totalDeltaY + deltaY, {
      min: minTotalDeltaY,
      max: maxTotalDeltaY
    });
    const newTotalDeltaZ = (0, _math.toNumWithBounds)((0, _gesture.addDeltaZ)(totalDeltaZ, deltaZ), {
      min: minTotalDeltaZ,
      max: maxTotalDeltaZ
    });
    if (newTotalDeltaX === totalDeltaX && newTotalDeltaY === totalDeltaY && newTotalDeltaZ === totalDeltaZ) {
      return;
    }
    totalDeltaX = newTotalDeltaX;
    totalDeltaY = newTotalDeltaY;
    totalDeltaZ = newTotalDeltaZ;
    const direction = fragment.direction;
    const intent = fragment.intent;
    const time = ((_eventQueueCopy = eventQueueCopy[MH.lengthOf(eventQueueCopy) - 1]) === null || _eventQueueCopy === void 0 ? void 0 : _eventQueueCopy.timeStamp) - ((_eventQueueCopy$ = eventQueueCopy[0]) === null || _eventQueueCopy$ === void 0 ? void 0 : _eventQueueCopy$.timeStamp) || 0;
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
      totalDeltaZ
    };
    if (direction !== MC.S_NONE && (!directions || MH.includes(directions, direction)) && (!intents || MH.includes(intents, intent))) {
      callback.invoke(target, data, eventQueueCopy).catch(_log.logError);
    } else {
      debug: logger === null || logger === void 0 || logger.debug7(`[${id}] Directions or intents not matching for callback`);
    }
  });

  // This wrapper is NOT debounced and adds the events to the queue, prevents
  // default action if needed, and indicates whether the gesture is terminated.
  const wrapper = (target, device, event, preventDefault) => {
    eventQueue.push(event);
    const fragment = fragmentGetters[device](eventQueue, {
      angleDiffThreshold,
      deltaThreshold,
      reverseScroll,
      dragHoldTime,
      dragNumFingers
    });
    debug: logger === null || logger === void 0 || logger.debug8(`[${id}] Got fragment for ${device} (${event.type})`, fragment, [...eventQueue].map(e => e.type));
    if (preventDefault) {
      preventDefaultActionFor(event, !!fragment || event.type === MC.S_CLICK && preventNextClick);
    }
    if (fragment === false) {
      // not enough events in the queue, pass
      debug: logger === null || logger === void 0 || logger.debug9(`[${id}] Not enough events for gesture ${device}`);
      return false;
    } else if (fragment === null) {
      // consider the gesture terminated
      clearEventQueue(device, eventQueue);
      debug: logger === null || logger === void 0 || logger.debug9(`[${id}] Gesture for ${device} terminated`);
      return true;
    }
    if (device === MC.S_POINTER) {
      // If we're here, there's been a drag, expect a click immediately
      // afterwards and prevent default action.
      preventNextClick = true;
      MH.setTimer(() => {
        preventNextClick = false;
      }, 10);
    }
    debouncedWrapper(target, fragment, [...eventQueue] // copy
    );
    return false;
  };
  return {
    _callback: callback,
    _wrapper: wrapper
  };
};
const clearEventQueue = (device, queue) => {
  const keepLastEvent = device === MC.S_POINTER || device === MC.S_TOUCH;
  queue.splice(0, MH.lengthOf(queue) - (keepLastEvent ? 1 : 0));
};
const preventDefaultActionFor = (event, isActualGesture) => {
  const target = event.currentTarget;
  const eventType = event.type;
  const isPointerDown = eventType === MC.S_POINTERDOWN || eventType === MC.S_MOUSEDOWN;
  if (eventType === MC.S_TOUCHMOVE || eventType === MC.S_WHEEL || (eventType === MC.S_CLICK || eventType === MC.S_KEYDOWN) && isActualGesture || isPointerDown && event.buttons === 1) {
    MH.preventDefault(event);
    if (isPointerDown && MH.isHTMLElement(target)) {
      // Otherwise capturing key events won't work
      target.focus({
        preventScroll: true
      });
    }
  }
};
const setGestureCssProps = (target, data) => {
  const intent = data.intent;
  if (!MH.isElement(target) || !intent || intent === MC.S_UNKNOWN) {
    return;
  }
  const prefix = `${intent}-`;
  if (intent === MC.S_ZOOM) {
    (0, _cssAlter.setNumericStyleProps)(target, {
      deltaZ: data.totalDeltaZ
    }, {
      _prefix: prefix,
      _numDecimal: 2
    }); // don't await here
  } else {
    (0, _cssAlter.setNumericStyleProps)(target, {
      deltaX: data.totalDeltaX,
      deltaY: data.totalDeltaY
    }, {
      _prefix: prefix
    }); // don't await here
  }
};
//# sourceMappingURL=gesture-watcher.cjs.map