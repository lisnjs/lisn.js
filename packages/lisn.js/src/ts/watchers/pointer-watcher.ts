/**
 * @module Watchers/PointerWatcher
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { PointerAction, CommaSeparatedStr } from "@lisn/globals/types";

import {
  addEventListenerTo,
  removeEventListenerFrom,
  preventSelect,
  undoPreventSelect,
} from "@lisn/utils/event";
import { logError } from "@lisn/utils/log";
import { deepCopy } from "@lisn/utils/misc";
import { isValidPointerAction, POINTER_ACTIONS } from "@lisn/utils/pointer";
import { objToStrKey } from "@lisn/utils/text";
import { validateStrList } from "@lisn/utils/validation";

import {
  CallbackHandler,
  Callback,
  wrapCallback,
} from "@lisn/modules/callback";
import { newXWeakMap } from "@lisn/modules/x-map";

/**
 * {@link PointerWatcher} listens for simple pointer actions like clicks, press
 * and hold or hover.
 */
export class PointerWatcher {
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
  readonly onPointer: (
    target: EventTarget,
    startHandler: OnPointerHandler,
    endHandler?: OnPointerHandler,
    options?: OnPointerOptions,
  ) => Promise<void>;

  /**
   * Removes previously added handlers.
   */
  readonly offPointer: (
    target: EventTarget,
    startHandler: OnPointerHandler,
    endHandler?: OnPointerHandler,
  ) => void;

  /**
   * Creates a new instance of PointerWatcher with the given
   * {@link PointerWatcherConfig}. It does not save it for future reuse.
   */
  static create(config?: PointerWatcherConfig) {
    return new PointerWatcher(getConfig(config), CONSTRUCTOR_KEY);
  }

  /**
   * Returns an existing instance of PointerWatcher with the given
   * {@link PointerWatcherConfig}, or creates a new one.
   *
   * **NOTE:** It saves it for future reuse, so don't use this for temporary
   * short-lived watchers.
   */
  static reuse(config?: PointerWatcherConfig) {
    const myConfig = getConfig(config);
    const configStrKey = objToStrKey(myConfig);

    let instance = instances.get(configStrKey);
    if (!instance) {
      instance = new PointerWatcher(myConfig, CONSTRUCTOR_KEY);
      instances.set(configStrKey, instance);
    }

    return instance;
  }

  private constructor(
    config: PointerWatcherConfigInternal,
    key: typeof CONSTRUCTOR_KEY,
  ) {
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
    const allCallbacks = newXWeakMap<
      EventTarget,
      Map<OnPointerHandler, OnPointerCallback>
    >(() => MH.newMap());

    // ----------

    const createCallback = (
      target: EventTarget,
      handler: OnPointerHandler,
    ): OnPointerCallback => {
      MH.remove(allCallbacks.get(target)?.get(handler));

      const callback = wrapCallback(handler);
      callback.onRemove(() => {
        MH.deleteKey(allCallbacks.get(target), handler);
      });

      allCallbacks.sGet(target).set(handler, callback);
      return callback;
    };

    // async for consistency with other watchers and future compatibility in
    // case of change needed
    const setupOnPointer = async (
      target: EventTarget,
      startHandler: OnPointerHandler,
      endHandler: OnPointerHandler | undefined,
      userOptions: OnPointerOptions | undefined,
    ) => {
      const options = getOptions(config, userOptions);
      const startCallback = createCallback(target, startHandler);
      const endCallback =
        endHandler && endHandler !== startHandler
          ? createCallback(target, endHandler)
          : startCallback;

      for (const action of options._actions) {
        listenerSetupFn[action](
          target,
          startCallback,
          endCallback,
          options,
          this,
        );
      }
    };

    // ----------

    this.onPointer = setupOnPointer;

    // ----------

    this.offPointer = (target, startHandler, endHandler?) => {
      const entry = allCallbacks.get(target);
      MH.remove(entry?.get(startHandler));
      if (endHandler) {
        MH.remove(entry?.get(endHandler));
      }
    };
  }
}

/**
 * @interface
 */
export type PointerWatcherConfig = {
  /**
   * The default value for
   * {@link OnPointerOptions.preventDefault | preventDefault} in calls to
   * {@link PointerWatcher.onPointer}.
   *
   * @defaultValue false
   */
  preventDefault?: boolean;

  /**
   * The default value for
   * {@link OnPointerOptions.preventSelect | preventSelect} in calls to
   * {@link PointerWatcher.onPointer}.
   *
   * @defaultValue true
   */
  preventSelect?: boolean;
};

/**
 * @interface
 */
export type OnPointerOptions = {
  /**
   * One or more of of "click", "hover" or "press". If not specified, then all
   * actions are enabled.
   *
   * It can be a comma-separated list of {@link PointerAction}s or an array of
   * such actions.
   *
   * For click actions, the start handler is called for every odd number of
   * clicks (1st, 3rd, 5th, etc), and the end handler is called for every other
   * click. It functions like a toggle.
   *
   * For hover and press actions, the start handler is called when the pointer
   * enters or presses down on the target respectively, and the end handler is
   * called when the pointer leaves or comes off the target respectively.
   *
   * Note that on touch screens, hover and press actions behave identically.
   *
   * @defaultValue undefined
   */
  actions?: CommaSeparatedStr<PointerAction> | PointerAction[];

  /**
   * If true, the events of the pointer actions, e.g. click, will have their
   * default action prevented.
   *
   * @defaultValue {@link PointerWatcherConfig.preventDefault}
   */
  preventDefault?: boolean;

  /**
   * If true (default), then for press actions (and hover actions on touch
   * screens) it will prevent starting a text selection.
   *
   * @defaultValue {@link PointerWatcherConfig.preventSelect}
   */
  preventSelect?: boolean;
};

/**
 * The handler is invoked with four arguments:
 *
 * - The event target that was passed to the {@link PointerWatcher.onPointer}
 *   call (equivalent to
 *   {@link https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget | Event:currentTarget}).
 * - The {@link PointerActionData} describing the state of the action.
 * - The event that triggered the action.
 * - (since v1.3.0) The {@link PointerWatcher} instance.
 */
export type OnPointerHandlerArgs = [
  EventTarget,
  PointerActionData,
  Event,
  PointerWatcher,
];
export type OnPointerCallback = Callback<OnPointerHandlerArgs>;
export type OnPointerHandler =
  | CallbackHandler<OnPointerHandlerArgs>
  | OnPointerCallback;

export type PointerActionData = {
  action: PointerAction;
  state: "ON" | "OFF";
};

// ----------------------------------------

type PointerWatcherConfigInternal = {
  _preventDefault: boolean;
  _preventSelect: boolean;
};

type OnPointerOptionsInternal = {
  _actions: PointerAction[];
  _preventDefault: boolean;
  _preventSelect: boolean;
};

const CONSTRUCTOR_KEY: unique symbol = MC.SYMBOL() as typeof CONSTRUCTOR_KEY;
const instances = MH.newMap<string, PointerWatcher>();

const getConfig = (
  config: PointerWatcherConfig | undefined,
): PointerWatcherConfigInternal => {
  return {
    _preventDefault: config?.preventDefault ?? false,
    _preventSelect: config?.preventSelect ?? true,
  };
};

const getOptions = (
  config: PointerWatcherConfigInternal,
  options: OnPointerOptions | undefined,
): OnPointerOptionsInternal => {
  return {
    _actions:
      validateStrList("actions", options?.actions, isValidPointerAction) ||
      POINTER_ACTIONS,
    _preventDefault: options?.preventDefault ?? config._preventDefault,
    _preventSelect: options?.preventSelect ?? config._preventSelect,
  };
};

const setupClickListener = (
  target: EventTarget,
  startCallback: OnPointerCallback,
  endCallback: OnPointerCallback,
  options: OnPointerOptionsInternal,
  watcher: PointerWatcher,
) => {
  // false if next will start; true if next will end.
  let toggleState = false;

  const wrapper = (event: Event) => {
    if (options._preventDefault) {
      MH.preventDefault(event);
    }

    toggleState = !toggleState;

    const data: PointerActionData = {
      action: MC.S_CLICK,
      state: toggleState ? "ON" : "OFF",
    };

    invokeCallback(
      toggleState ? startCallback : endCallback,
      target,
      data,
      event,
      watcher,
    );
  };

  addEventListenerTo(target, MC.S_CLICK, wrapper);

  const remove = () => {
    removeEventListenerFrom(target, MC.S_CLICK, wrapper);
  };

  startCallback.onRemove(remove);
  endCallback.onRemove(remove);
};

const setupPointerListeners = (
  action: typeof MC.S_HOVER | typeof MC.S_PRESS,
  target: EventTarget,
  startCallback: OnPointerCallback,
  endCallback: OnPointerCallback,
  options: OnPointerOptionsInternal,
  watcher: PointerWatcher,
) => {
  // If the browser doesn't support pointer events, then
  // addEventListenerTo will transform these into mouse*
  const startEventSuff = action === MC.S_HOVER ? "enter" : "down";
  const endEventSuff = action === MC.S_HOVER ? "leave" : "up";
  const startEvent = MC.S_POINTER + startEventSuff;
  const endEvent = MC.S_POINTER + endEventSuff;

  const wrapper = (event: Event, callback: OnPointerCallback) => {
    if (options._preventDefault) {
      MH.preventDefault(event);
    }

    const data: PointerActionData = {
      action,
      state:
        MH.strReplace(event.type, /pointer|mouse/, "") === startEventSuff
          ? "ON"
          : "OFF",
    };

    invokeCallback(callback, target, data, event, watcher);
  };
  const startListener = (event: Event) => wrapper(event, startCallback);
  const endListener = (event: Event) => wrapper(event, endCallback);

  addEventListenerTo(target, startEvent, startListener);
  addEventListenerTo(target, endEvent, endListener);

  // On some touch screen devices pressing and holding will initiate select
  // and result in touchend, so we prevent text select
  if (options._preventSelect) {
    preventSelect(target);
  }

  startCallback.onRemove(() => {
    undoPreventSelect(target);
    removeEventListenerFrom(target, startEvent, startListener);
  });

  endCallback.onRemove(() => {
    undoPreventSelect(target);
    removeEventListenerFrom(target, endEvent, endListener);
  });
};

const listenerSetupFn: {
  [D in PointerAction]: (
    target: EventTarget,
    startCallback: OnPointerCallback,
    endCallback: OnPointerCallback,
    options: OnPointerOptionsInternal,
    watcher: PointerWatcher,
  ) => void;
} = {
  click: setupClickListener,
  hover: (...args) => setupPointerListeners(MC.S_HOVER, ...args),
  press: (...args) => setupPointerListeners(MC.S_PRESS, ...args),
} as const;

const invokeCallback = (
  callback: OnPointerCallback,
  target: EventTarget,
  actionData: PointerActionData,
  event: Event,
  watcher: PointerWatcher,
) =>
  callback.invoke(target, deepCopy(actionData), event, watcher).catch(logError);
