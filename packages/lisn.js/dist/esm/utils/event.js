/**
 * @module Utils
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { addClasses, removeClasses } from "./css-alter.js";
import { copyExistingKeys } from "./misc.js";
import { newXMapGetter, newXWeakMap } from "../modules/x-map.js";

/**
 * Calls the given event listener, which could be a function that's callable
 * directly, or an object that has a `handleEvent` function property.
 *
 * @category Events: Generic
 */
export var callEventListener = function callEventListener(handler, event) {
  if (MH.isFunction(handler)) {
    handler.call(event.currentTarget || self, event);
  } else {
    handler.handleEvent.call(event.currentTarget || self, event);
  }
};

/**
 * Adds an event listener for the given event name to the given target.
 *
 * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener | EventTarget:addEventListener}
 * but it handles `options` object in case the browser does not support those.
 * Does not support the `signal` option unless browser natively supports that.
 *
 * @return {} `true` if successfully added, or `false` if the same handler has
 * already been added by us, or if the handler is not a valid event listener.
 *
 * @category Events: Generic
 */
export var addEventListenerTo = function addEventListenerTo(target, eventType, handler) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  eventType = transformEventType(eventType);
  if (getEventHandlerData(target, eventType, handler, options)) {
    // already added
    return false;
  }
  var thirdArg = options;
  var wrappedHandler = handler;

  // If the user passed an options object but the browser only supports a
  // boolen for 'useCapture', then handle this.
  var supports = getBrowserSupport();
  if (MH.isNonPrimitive(options)) {
    if (!supports._optionsArg) {
      var _options$capture;
      thirdArg = (_options$capture = options.capture) !== null && _options$capture !== void 0 ? _options$capture : false;
    }
    if (options.once && !supports._options.once) {
      // Remove the handler once it's called once
      wrappedHandler = function wrappedHandler(event) {
        removeEventListenerFrom(target, eventType, handler, options);
        callEventListener(handler, event);
      };
    }
  }
  setEventHandlerData(target, eventType, handler, options, {
    _wrappedHandler: wrappedHandler,
    _thirdArg: thirdArg
  });
  target.addEventListener(eventType, wrappedHandler, thirdArg);
  return true;
};

/**
 * Removes an event listener that has been added using
 * {@link addEventListenerTo}.
 *
 * **IMPORTANT:** If you have added a listener using the built-in
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener | EventTarget:addEventListener},
 * then you should use
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener | EventTarget:removeEventListener},
 * to remove it, not this function.
 *
 * @return {} `true` if successfully removed, or `false` if the handler has not
 * been added by us.
 *
 * @category Events: Generic
 */
export var removeEventListenerFrom = function removeEventListenerFrom(target, eventType, handler) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  eventType = transformEventType(eventType);
  var data = getEventHandlerData(target, eventType, handler, options);
  if (!data) {
    return false;
  }
  target.removeEventListener(eventType, data._wrappedHandler, data._thirdArg);
  deleteEventHandlerData(target, eventType, handler, options);
  return true;
};

/**
 * @ignore
 * @internal
 */
export var preventSelect = function preventSelect(target) {
  addEventListenerTo(target, MC.S_SELECTSTART, MH.preventDefault);
  if (MH.isElement(target)) {
    addClasses(target, MC.PREFIX_NO_SELECT);
  }
};

/**
 * @ignore
 * @internal
 */
export var undoPreventSelect = function undoPreventSelect(target) {
  removeEventListenerFrom(target, MC.S_SELECTSTART, MH.preventDefault);
  if (MH.isElement(target)) {
    removeClasses(target, MC.PREFIX_NO_SELECT);
  }
};

/**
 * @ignore
 * @internal
 */
export var getBrowserSupport = function getBrowserSupport() {
  if (browserEventSupport) {
    // already detected
    return browserEventSupport;
  }
  var supports = {
    _pointer: false,
    _optionsArg: false,
    _options: {
      capture: false,
      passive: false,
      once: false,
      signal: false
    }
  };

  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#safely_detecting_option_support
  var optTest = {};
  var opt;
  var _loop = function _loop() {
    var thisOpt = opt;
    MH.defineProperty(optTest, thisOpt, {
      get: function get() {
        supports._options[thisOpt] = true;
        if (thisOpt === "signal") {
          return new AbortController().signal;
        }
        return false;
      }
    });
  };
  for (opt in supports._options) {
    _loop();
  }
  var dummyHandler = function dummyHandler() {}; // TypeScript does not accept null
  var dummyElement = MH.createElement("div");
  try {
    dummyElement.addEventListener("testOptionSupport", dummyHandler, optTest);
    dummyElement.removeEventListener("testOptionSupport", dummyHandler, optTest);
    supports._optionsArg = true;
  } catch (e__ignored) {
    //
  }
  supports._pointer = "onpointerup" in dummyElement;
  browserEventSupport = supports;
  return supports;
};

// --------------------

var browserEventSupport;
var registeredEventHandlerData = newXWeakMap(newXMapGetter(newXMapGetter(function () {
  return MH.newMap();
})));

// detect browser features, see below

var getEventOptionsStr = function getEventOptionsStr(options) {
  var finalOptions = {
    capture: false,
    passive: false,
    once: false
  };
  if (options === false || options === true) {
    finalOptions.capture = options;
  } else if (MH.isObject(options)) {
    copyExistingKeys(options, finalOptions);
  }
  return MH.stringify(finalOptions);
};
var getEventHandlerData = function getEventHandlerData(target, eventType, handler, options) {
  var _registeredEventHandl;
  var optionsStr = getEventOptionsStr(options);
  return (_registeredEventHandl = registeredEventHandlerData.get(target)) === null || _registeredEventHandl === void 0 || (_registeredEventHandl = _registeredEventHandl.get(eventType)) === null || _registeredEventHandl === void 0 || (_registeredEventHandl = _registeredEventHandl.get(handler)) === null || _registeredEventHandl === void 0 ? void 0 : _registeredEventHandl.get(optionsStr);
};
var deleteEventHandlerData = function deleteEventHandlerData(target, eventType, handler, options) {
  var _registeredEventHandl2;
  var optionsStr = getEventOptionsStr(options);
  MH.deleteKey((_registeredEventHandl2 = registeredEventHandlerData.get(target)) === null || _registeredEventHandl2 === void 0 || (_registeredEventHandl2 = _registeredEventHandl2.get(eventType)) === null || _registeredEventHandl2 === void 0 ? void 0 : _registeredEventHandl2.get(handler), optionsStr);
  registeredEventHandlerData.prune(target, eventType, handler);
};
var setEventHandlerData = function setEventHandlerData(target, eventType, handler, options, data) {
  var optionsStr = getEventOptionsStr(options);
  registeredEventHandlerData.sGet(target).sGet(eventType).sGet(handler).set(optionsStr, data);
};
var transformEventType = function transformEventType(eventType) {
  var supports = getBrowserSupport();
  if (eventType.startsWith(MC.S_POINTER) && !supports._pointer) {
    // TODO maybe log a warning message is it's not supported, e.g. there's no
    // mousecancel
    return MH.strReplace(eventType, MC.S_POINTER, MC.S_MOUSE);
  }
  return eventType;
};
//# sourceMappingURL=event.js.map