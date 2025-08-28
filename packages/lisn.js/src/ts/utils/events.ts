/**
 * @module Utils
 */

import * as _ from "@lisn/_internal";

import { addClasses, removeClasses } from "@lisn/utils/css-alter";

import { XMap, createXMapGetter, createXWeakMap } from "@lisn/modules/x-map";

/**
 * Calls the given event listener, which could be a function that's callable
 * directly, or an object that has a `handleEvent` function property.
 *
 * @category Events: Generic
 */
export const callEventListener = (
  handler: EventListenerOrEventListenerObject,
  event: Event,
) => {
  if (_.isFunction(handler)) {
    handler.call(event.currentTarget ?? self, event);
  } else {
    handler.handleEvent.call(event.currentTarget ?? self, event);
  }
};

/**
 * Adds an event listener for the given event name to the given target.
 *
 * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener | EventTarget:addEventListener}
 * but it handles `options` object in case the browser does not support those.
 * Does not support the `signal` option unless browser natively supports that.
 *
 * @returns `true` if successfully added, or `false` if the same handler has
 * already been added by us, or if the handler is not a valid event listener.
 *
 * @category Events: Generic
 */
export const addEventListenerTo = (
  target: EventTarget,
  eventType: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
): boolean => {
  options ??= false;
  eventType = transformEventType(eventType);
  if (getEventHandlerData(target, eventType, handler, options)) {
    // already added
    return false;
  }

  let thirdArg = options;
  let wrappedHandler = handler;

  // If the user passed an options object but the browser only supports a
  // boolen for 'useCapture', then handle this.
  const supports = getBrowserSupport();
  if (_.isObject(options)) {
    if (!supports._optionsArg) {
      thirdArg = options.capture ?? false;
    }

    if (options.once && !supports._options.once) {
      // Remove the handler once it's called once
      wrappedHandler = (event) => {
        removeEventListenerFrom(target, eventType, handler, options);
        callEventListener(handler, event);
      };
    }
  }

  setEventHandlerData(target, eventType, handler, options, {
    _wrappedHandler: wrappedHandler,
    _thirdArg: thirdArg,
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
 * @returns `true` if successfully removed, or `false` if the handler has not
 * been added by us.
 *
 * @category Events: Generic
 */
export const removeEventListenerFrom = (
  target: EventTarget,
  eventType: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
) => {
  options ??= false;
  eventType = transformEventType(eventType);
  const data = getEventHandlerData(target, eventType, handler, options);

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
export const preventSelect = (target: EventTarget) => {
  addEventListenerTo(target, _.S_SELECTSTART, _.preventDefault);
  if (_.isElement(target)) {
    addClasses(target, _.PREFIX_NO_SELECT);
  }
};

/**
 * @ignore
 * @internal
 */
export const undoPreventSelect = (target: EventTarget) => {
  removeEventListenerFrom(target, _.S_SELECTSTART, _.preventDefault);
  if (_.isElement(target)) {
    removeClasses(target, _.PREFIX_NO_SELECT);
  }
};

/**
 * @ignore
 * @internal
 */
export const getBrowserSupport = (): BrowserEventSupport => {
  if (browserEventSupport) {
    // already detected
    return browserEventSupport;
  }

  const supports = {
    _pointer: false,
    _optionsArg: false,
    _options: {
      capture: false,
      passive: false,
      once: false,
      signal: false,
    },
  };

  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#safely_detecting_option_support
  const optTest = {};
  let opt: keyof typeof supports._options;
  for (opt in supports._options) {
    const thisOpt = opt;
    _.defineProperty(optTest, thisOpt, {
      get: () => {
        supports._options[thisOpt] = true;
        if (thisOpt === "signal") {
          return new AbortController().signal;
        }
        return false;
      },
    });
  }

  const dummyHandler = () => {}; // TypeScript does not accept null
  const dummyElement = _.createElement("div");
  try {
    dummyElement.addEventListener("testOptionSupport", dummyHandler, optTest);
    dummyElement.removeEventListener(
      "testOptionSupport",
      dummyHandler,
      optTest,
    );
    supports._optionsArg = true;
  } catch (e__ignored) {
    //
  }

  supports._pointer = "onpointerup" in dummyElement;

  browserEventSupport = supports;
  return supports;
};

// --------------------

type EventHandlerData = {
  _wrappedHandler: EventListenerOrEventListenerObject;
  _thirdArg: boolean | AddEventListenerOptions;
};

let browserEventSupport: BrowserEventSupport;

const registeredEventHandlerData = createXWeakMap<
  EventTarget,
  XMap<
    string, // event type
    XMap<
      EventListenerOrEventListenerObject, // user-supplied handler
      Map<
        string, // str repr of options
        EventHandlerData
      >
    >
  >
>(createXMapGetter(createXMapGetter(() => _.createMap())));

// detect browser features, see below
type BrowserEventSupport = {
  _pointer: boolean;
  _optionsArg: boolean;
  _options: {
    capture: boolean;
    passive: boolean;
    once: boolean;
    signal: boolean;
  };
};

const getEventOptionsStr = (
  options: boolean | AddEventListenerOptions,
): string => {
  const finalOptions = {
    capture: false,
    passive: false,
    once: false,
  };

  if (options === false || options === true) {
    finalOptions.capture = options;
  } else if (_.isObject(options)) {
    let p: keyof typeof finalOptions;
    for (p in finalOptions) {
      finalOptions[p] = options[p] ?? false;
    }
  }

  return _.stringify(finalOptions);
};

const getEventHandlerData = (
  target: EventTarget,
  eventType: string,
  handler: EventListenerOrEventListenerObject,
  options: boolean | AddEventListenerOptions,
) => {
  const optionsStr = getEventOptionsStr(options);
  return registeredEventHandlerData
    .get(target)
    ?.get(eventType)
    ?.get(handler)
    ?.get(optionsStr);
};

const deleteEventHandlerData = (
  target: EventTarget,
  eventType: string,
  handler: EventListenerOrEventListenerObject,
  options: boolean | AddEventListenerOptions,
) => {
  const optionsStr = getEventOptionsStr(options);
  _.deleteKey(
    registeredEventHandlerData.get(target)?.get(eventType)?.get(handler),
    optionsStr,
  );
  registeredEventHandlerData.prune(target, eventType, handler);
};

const setEventHandlerData = (
  target: EventTarget,
  eventType: string,
  handler: EventListenerOrEventListenerObject,
  options: boolean | AddEventListenerOptions,
  data: EventHandlerData,
) => {
  const optionsStr = getEventOptionsStr(options);
  registeredEventHandlerData
    .sGet(target)
    .sGet(eventType)
    .sGet(handler)
    .set(optionsStr, data);
};

const transformEventType = (eventType: string) => {
  const supports = getBrowserSupport();
  if (eventType.startsWith(_.S_POINTER) && !supports._pointer) {
    // TODO maybe log a warning message is it's not supported, e.g. there's no
    // mousecancel
    return _.strReplace(eventType, _.S_POINTER, _.S_MOUSE);
  }

  return eventType;
};
