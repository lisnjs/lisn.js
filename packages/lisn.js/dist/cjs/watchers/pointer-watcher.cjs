"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PointerWatcher = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _event = require("../utils/event.cjs");
var _log = require("../utils/log.cjs");
var _pointer = require("../utils/pointer.cjs");
var _text = require("../utils/text.cjs");
var _validation = require("../utils/validation.cjs");
var _callback = require("../modules/callback.cjs");
var _xMap = require("../modules/x-map.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Watchers/PointerWatcher
 */
/**
 * {@link PointerWatcher} listens for simple pointer actions like clicks, press
 * and hold or hover.
 */
class PointerWatcher {
  /**
   * Creates a new instance of PointerWatcher with the given
   * {@link PointerWatcherConfig}. It does not save it for future reuse.
   */
  static create(config = {}) {
    return new PointerWatcher(getConfig(config), CONSTRUCTOR_KEY);
  }

  /**
   * Returns an existing instance of PointerWatcher with the given
   * {@link PointerWatcherConfig}, or creates a new one.
   *
   * **NOTE:** It saves it for future reuse, so don't use this for temporary
   * short-lived watchers.
   */
  static reuse(config = {}) {
    const myConfig = getConfig(config);
    const configStrKey = (0, _text.objToStrKey)(myConfig);
    let instance = instances.get(configStrKey);
    if (!instance) {
      instance = new PointerWatcher(myConfig, CONSTRUCTOR_KEY);
      instances.set(configStrKey, instance);
    }
    return instance;
  }
  constructor(config, key) {
    /**
     * Call the `startHandler` whenever the pointer action begins.
     * Call the `endHandler` whenever the pointer action ends. If `endHandler` is
     * not given, it defaults to `startHandler`.
     *
     * For an explanation of what "begins" and "ends" means for each supported
     * action, see {@link OnPointerOptions.actions}.
     *
     * **IMPORTANT:** The same handlers can _not_ be added multiple times for the
     * same event target, even if the options differ. If the handler has already
     * been added for this target, then it will be removed and re-added with the
     * current options.
     */
    _defineProperty(this, "onPointer", void 0);
    /**
     * Removes previously added handlers.
     */
    _defineProperty(this, "offPointer", void 0);
    if (key !== CONSTRUCTOR_KEY) {
      throw MH.illegalConstructorError("PointerWatcher.create");
    }

    // Keep this watcher super simple. The events we listen for don't fire at a
    // high rate and it's unlikely for there to be many many callbacks for each
    // target and event type, so don't bother with using a delegating listener,
    // etc.

    // Keep a map of callbacks so we can lookup the callback by the handler
    // (and also to prevent duplicate handler for each target, for consistency
    // with other watchers).
    const allCallbacks = (0, _xMap.newXWeakMap)(() => MH.newMap());

    // ----------

    const createCallback = (target, handler) => {
      var _allCallbacks$get;
      MH.remove((_allCallbacks$get = allCallbacks.get(target)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get.get(handler));
      const callback = (0, _callback.wrapCallback)(handler);
      callback.onRemove(() => {
        MH.deleteKey(allCallbacks.get(target), handler);
      });
      allCallbacks.sGet(target).set(handler, callback);
      return callback;
    };

    // async for consistency with other watchers and future compatibility in
    // case of change needed
    const setupOnPointer = async (target, startHandler, endHandler, userOptions) => {
      const options = getOptions(config, userOptions);
      const startCallback = createCallback(target, startHandler);
      const endCallback = endHandler && endHandler !== startHandler ? createCallback(target, endHandler) : startCallback;
      for (const action of options._actions) {
        listenerSetupFn[action](target, startCallback, endCallback, options);
      }
    };

    // ----------

    this.onPointer = setupOnPointer;

    // ----------

    this.offPointer = (target, startHandler, endHandler) => {
      const entry = allCallbacks.get(target);
      MH.remove(entry === null || entry === void 0 ? void 0 : entry.get(startHandler));
      if (endHandler) {
        MH.remove(entry === null || entry === void 0 ? void 0 : entry.get(endHandler));
      }
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
 * - the event target that was passed to the {@link PointerWatcher.onPointer}
 *   call (equivalent to
 *   {@link https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget | Event:currentTarget}).
 * - the {@link PointerActionData} describing the state of the action.
 */

// ----------------------------------------
exports.PointerWatcher = PointerWatcher;
const CONSTRUCTOR_KEY = MC.SYMBOL();
const instances = MH.newMap();
const getConfig = config => {
  var _config$preventDefaul, _config$preventSelect;
  return {
    _preventDefault: (_config$preventDefaul = config === null || config === void 0 ? void 0 : config.preventDefault) !== null && _config$preventDefaul !== void 0 ? _config$preventDefaul : false,
    _preventSelect: (_config$preventSelect = config === null || config === void 0 ? void 0 : config.preventSelect) !== null && _config$preventSelect !== void 0 ? _config$preventSelect : true
  };
};
const getOptions = (config, options) => {
  var _options$preventDefau, _options$preventSelec;
  return {
    _actions: (0, _validation.validateStrList)("actions", options === null || options === void 0 ? void 0 : options.actions, _pointer.isValidPointerAction) || _pointer.POINTER_ACTIONS,
    _preventDefault: (_options$preventDefau = options === null || options === void 0 ? void 0 : options.preventDefault) !== null && _options$preventDefau !== void 0 ? _options$preventDefau : config._preventDefault,
    _preventSelect: (_options$preventSelec = options === null || options === void 0 ? void 0 : options.preventSelect) !== null && _options$preventSelec !== void 0 ? _options$preventSelec : config._preventSelect
  };
};
const setupClickListener = (target, startCallback, endCallback, options) => {
  // false if next will start; true if next will end.
  let toggleState = false;
  const wrapper = event => {
    if (options._preventDefault) {
      MH.preventDefault(event);
    }
    toggleState = !toggleState;
    const data = {
      action: MC.S_CLICK,
      state: toggleState ? "ON" : "OFF"
    };
    invokeCallback(toggleState ? startCallback : endCallback, target, data, event);
  };
  (0, _event.addEventListenerTo)(target, MC.S_CLICK, wrapper);
  const remove = () => (0, _event.removeEventListenerFrom)(target, MC.S_CLICK, wrapper);
  startCallback.onRemove(remove);
  endCallback.onRemove(remove);
};
const setupPointerListeners = (action, target, startCallback, endCallback, options) => {
  // If the browser doesn't support pointer events, then
  // addEventListenerTo will transform these into mouse*
  const startEventSuff = action === MC.S_HOVER ? "enter" : "down";
  const endEventSuff = action === MC.S_HOVER ? "leave" : "up";
  const startEvent = MC.S_POINTER + startEventSuff;
  const endEvent = MC.S_POINTER + endEventSuff;
  const wrapper = (event, callback) => {
    if (options._preventDefault) {
      MH.preventDefault(event);
    }
    const data = {
      action,
      state: MH.strReplace(event.type, /pointer|mouse/, "") === startEventSuff ? "ON" : "OFF"
    };
    invokeCallback(callback, target, data, event);
  };
  const startListener = event => wrapper(event, startCallback);
  const endListener = event => wrapper(event, endCallback);
  (0, _event.addEventListenerTo)(target, startEvent, startListener);
  (0, _event.addEventListenerTo)(target, endEvent, endListener);

  // On some touch screen devices pressing and holding will initiate select
  // and result in touchend, so we prevent text select
  if (options._preventSelect) {
    (0, _event.preventSelect)(target);
  }
  startCallback.onRemove(() => {
    (0, _event.undoPreventSelect)(target);
    (0, _event.removeEventListenerFrom)(target, startEvent, startListener);
  });
  endCallback.onRemove(() => {
    (0, _event.undoPreventSelect)(target);
    (0, _event.removeEventListenerFrom)(target, endEvent, endListener);
  });
};
const listenerSetupFn = {
  click: setupClickListener,
  hover: (...args) => setupPointerListeners(MC.S_HOVER, ...args),
  press: (...args) => setupPointerListeners(MC.S_PRESS, ...args)
};
const invokeCallback = (callback, target, actionData, event) => callback.invoke(target, MH.copyObject(actionData), event).catch(_log.logError);
//# sourceMappingURL=pointer-watcher.cjs.map