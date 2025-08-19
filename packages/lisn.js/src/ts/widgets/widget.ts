/**
 * ## Specification for the HTML API for widgets
 *
 * The following describes the general syntax when using the HTML API for
 * automatic creation of widgets based on data attributes
 * {@link Settings.settings.autoWidgets | settings.autoWidgets} must be true.
 *
 * A widget specification should be given as a
 * `data-lisn-<WidgetName>="<WidgetConfList>"` attribute.
 *
 * Alternatively, if using all default configurations, you can simply add the
 * `lisn-<WidgetName>` CSS class. Specifying a configuration using CSS classes
 * is not currently possible for widgets, only for triggers (though it's
 * discouraged).
 *
 * The general specification for a widget is of the form:
 *
 * ```
 * <WidgetConfList> ::= <WidgetConf> { ";" <WidgetConf> }
 *
 * <WidgetConf> ::= [ <WidgetOption> { "|" <WidgetOption> } ]
 *
 * <WidgetOption> ::=
 *     <BooleanOptionName> [ "=" ( "false" | "true" ) ] |
 *     <OptionName> "=" <OptionValue>
 * ```
 *
 * **NOTE:**
 *
 * There can be 0 or more spaces around any of the separator characters.
 *
 * Not all widgets support multiple instances per single element and therefore
 * multiple configurations. Refer to each specific widget.
 *
 * The characters `|`, `;`, `=` are reserved separators and cannot be used
 * literally as part of an option value.
 *
 * See documentation on a specific widget for examples.
 *
 * @module Widgets
 */

import * as _ from "@lisn/_internal";

import { settings } from "@lisn/globals/settings";

import { hasClass, getData } from "@lisn/utils/css-alter";
import { waitForInteractive } from "@lisn/utils/dom-events";
import { logWarn } from "@lisn/utils/log";
import { toArrayIfSingle } from "@lisn/utils/misc";
import { waitForDelay } from "@lisn/utils/tasks";
import { formatAsString, kebabToCamelCase, splitOn } from "@lisn/utils/text";

import {
  CallbackHandler,
  Callback,
  addNewCallbackToMap,
  invokeHandlers,
} from "@lisn/modules/callback";
import { createXWeakMap } from "@lisn/modules/x-map";

import { DOMWatcher } from "@lisn/watchers/dom-watcher";

import debug from "@lisn/debug/debug";

export abstract class Widget {
  /**
   * Disables the functionality of the widget. What this means is specific to
   * each widget.
   *
   * If it's already disabled, it does nothing.
   */
  readonly disable: () => Promise<void>;

  /**
   * Re-enables the functionality of the widget. What this means is specific to
   * each widget.
   *
   * If it's already enabled, it does nothing.
   */
  readonly enable: () => Promise<void>;

  /**
   * Re-enables the widget if disabled, otherwise disables it.
   */
  readonly toggleEnable: () => Promise<void>;

  /**
   * Calls the given handler when the widget is disabled. If the widget is
   * already disabled, the handlers are not called.
   *
   * The handler is called after setting the state to disabled, such that
   * calling {@link isDisabled} from the handler will return `true`.
   */
  readonly onDisable: (handler: WidgetHandler) => void;

  /**
   * Removes a previously added {@link onDisable} handler.
   *
   * @since v1.3.0
   */
  readonly offDisable: (handler: WidgetHandler) => void;

  /**
   * Calls the given handler when the widget is enabled. If the widget is
   * already enabled, the handlers are not called.
   *
   * The handler is called after setting the state to enabled, such that
   * calling {@link isDisabled} from the handler will return `false`.
   */
  readonly onEnable: (handler: WidgetHandler) => void;

  /**
   * Removes a previously added {@link onEnable} handler.
   *
   * @since v1.3.0
   */
  readonly offEnable: (handler: WidgetHandler) => void;

  /**
   * Returns true if the widget is currently disabled.
   */
  readonly isDisabled: () => boolean;

  /**
   * Undoes all modifications to the element and returns it to its original state.
   *
   * You will need to recreate it if you want to enable its functionality again.
   */
  readonly destroy: () => Promise<void>;

  /**
   * Calls the given handler when the widget is destroyed. If the widget is
   * already destroyed, the handlers are not called.
   *
   * The handler is called after destroying the widget, such that calling
   * {@link isDestroyed} from the handler will return `true`.
   */
  readonly onDestroy: (handler: WidgetHandler) => void;

  /**
   * Removes a previously added {@link onDestroy} handler.
   *
   * @since v1.3.0
   */
  readonly offDestroy: (handler: WidgetHandler) => void;

  /**
   * Returns true if the widget is destroyed.
   */
  readonly isDestroyed: () => boolean;

  /**
   * Returns the element passed to the widget constructor.
   */
  readonly getElement: () => Element;

  /**
   * Retrieve an existing widget by element and ID.
   */
  static get(element: Element, id: string): Widget | null {
    return instances.get(element)?.get(id) ?? null;
  }

  /**
   * **IMPORTANT:** If ID is given and there's already a widget with this ID on
   * this element, it will be destroyed!
   */
  protected constructor(element: Element, config?: { id?: string }) {
    const logger = debug
      ? new debug.Logger({
          name: `${this.constructor.name}-${formatAsString(element)}`,
          logAtCreation: this,
        })
      : null;

    const id = config?.id;
    if (id) {
      instances.get(element)?.get(id)?.destroy(); // don't await here
      instances.sGet(element).set(id, this);
    }

    let isDisabled = false;
    let isDestroyed = false;
    let destroyPromise: Promise<void>;

    const enableCallbacks = _.createMap<WidgetHandler, WidgetCallback>();
    const disableCallbacks = _.createMap<WidgetHandler, WidgetCallback>();
    const destroyCallbacks = _.createMap<WidgetHandler, WidgetCallback>();

    this.disable = async () => {
      if (!isDisabled) {
        debug: logger?.debug8("Disabling");
        isDisabled = true;
        await invokeHandlers(disableCallbacks.values(), this);
      }
    };

    this.enable = async () => {
      if (!isDestroyed && isDisabled) {
        debug: logger?.debug8("Enabling");
        isDisabled = false;
        await invokeHandlers(enableCallbacks.values(), this);
      }
    };

    this.toggleEnable = async () => {
      if (!isDestroyed) {
        await (isDisabled ? this.enable : this.disable)();
      }
    };

    this.onDisable = (handler) => {
      addNewCallbackToMap(disableCallbacks, handler);
    };

    this.offDisable = (handler) => {
      _.remove(disableCallbacks.get(handler));
    };

    this.onEnable = (handler) => {
      addNewCallbackToMap(enableCallbacks, handler);
    };

    this.offEnable = (handler) => {
      _.remove(enableCallbacks.get(handler));
    };

    this.isDisabled = () => isDisabled;

    this.destroy = () => {
      if (!destroyPromise) {
        destroyPromise = (async () => {
          debug: logger?.debug8("Destroying");
          isDestroyed = true;
          await this.disable();

          await invokeHandlers(destroyCallbacks.values(), this);

          enableCallbacks.clear();
          disableCallbacks.clear();
          destroyCallbacks.clear();

          if (id) {
            const elInstances = instances.get(element);
            if (elInstances?.get(id) === this) {
              _.deleteKey(elInstances, id);
              instances.prune(element);
            }
          }
        })();
      }

      return destroyPromise;
    };

    this.onDestroy = (handler) => {
      addNewCallbackToMap(destroyCallbacks, handler);
    };

    this.offDestroy = (handler) => {
      _.remove(destroyCallbacks.get(handler));
    };

    this.isDestroyed = () => isDestroyed;

    this.getElement = () => element;
  }
}

/**
 * The handler is invoked with one argument:
 *
 * - The {@link Widget} instance.
 */
export type WidgetHandlerArgs = [Widget];
export type WidgetCallback = Callback<WidgetHandlerArgs>;
export type WidgetHandler = WidgetCallback | CallbackHandler<WidgetHandlerArgs>;

/**
 * @ignore
 * @deprecated
 *
 * Deprecated alias for {@link WidgetHandlerArgs}
 */
export type WidgetCallbackArgs = WidgetHandlerArgs;

/**
 * **NOTE:** If the function returns a widget or a list of widgets created for
 * the given element, then each one will be automatically destroyed if the
 * element is removed from the DOM.
 */
export type WidgetCreateFn<Config extends Record<string, unknown>> = (
  element: Element,
  config?: Config,
) => Widget | Widget[] | null | Promise<Widget | Widget[] | null>;

/**
 * @see {@link getWidgetConfig}.
 */
export type WidgetConfigValidatorObject<
  Config extends Record<string, unknown>,
> = {
  [K in keyof Config]: (key: K, v: unknown) => Config[K];
};

/**
 * @see {@link getWidgetConfig}.
 */
export type WidgetConfigAsyncValidatorObject<
  Config extends Record<string, unknown>,
> = {
  [K in keyof Config]: (key: K, v: unknown) => Config[K] | Promise<Config[K]>;
};

/**
 * @see {@link getWidgetConfig}.
 */
export type WidgetConfigValidatorFunc<Config extends Record<string, unknown>> =
  (
    element: Element,
  ) =>
    | WidgetConfigValidatorObject<Config>
    | WidgetConfigAsyncValidatorObject<Config>;

/**
 * @see {@link getWidgetConfig}.
 */
export type WidgetConfigValidator<Config extends Record<string, unknown>> =
  | WidgetConfigValidatorObject<Config>
  | WidgetConfigValidatorFunc<Config>;

/**
 * Enables automatic setting up of a widget from an elements matching the given
 * selector.
 *
 * If {@link settings.autoWidgets} is true, nothing is done. Otherwise, when an
 * element matching the selector is added to the DOM, `createWidget` will be
 * called and it's expected to setup the widget.
 *
 * **IMPORTANT:** The widget that is returned by `createWidget` will be
 * automatically destroyed when the element that created them is removed from
 * the DOM.
 *
 * **IMPORTANT:** If a widget by that name is already registered, the current
 * call does nothing, even if the remaining arguments differ.
 *
 * @param name         The name of the widget. Should be in kebab-case.
 * @param createWidget Called for every element matching the widget selector.
 * @param configValidator
 *                     A validator object, or a function that returns such an
 *                     object, for all options supported by the widget. If
 *                     given, then the `createWidget` function will also be
 *                     passed a configuration object constructed from the
 *                     element's data attribute. The widget's configuration is
 *                     read from the `data-lisn-<name>` attribute.
 * @param [options.selector]
 *                     The selector to match elements for. If not given, then
 *                     uses a default value of `[data-lisn-<name>], .lisn-<name>`
 * @param [options.supportsMultiple]
 *                     If true, and if `configValidator` is given, then the
 *                     value of the element's widget specific data attribute
 *                     will be split on `;` and each one parsed individually as
 *                     a configuration. Then the `createWidget` function will
 *                     be called once for each configuration.
 */
export const registerWidget = async <Config extends Record<string, unknown>>(
  name: string,
  createWidget: WidgetCreateFn<Config>,
  configValidator?: null | WidgetConfigValidator<Config>,
  options?: {
    selector?: string;
    supportsMultiple?: boolean;
    // TODO options for separators
  },
) => {
  if (registeredWidgets.has(name)) {
    return;
  }

  registeredWidgets.add(name);

  // init after DOM loaded so that the settings can be configured by the user
  // straight after loading LISN.js
  await waitForInteractive();

  const selector =
    options?.selector || getDefaultWidgetSelector(_.prefixName(name));

  if (settings.autoWidgets) {
    const domWatcher = DOMWatcher.reuse();
    domWatcher.onMutation(
      async (operation) => {
        const element = _.currentTargetOf(operation);
        const thisConfigValidator = _.isFunction(configValidator)
          ? await configValidator(element)
          : configValidator;

        const widgets: Widget[] = [];
        const configSpecs = getDataAttrConfigSpecs(
          name,
          element,
          options?.supportsMultiple ? CONFIG_SEP_CHAR : null,
        );

        for (const spec of configSpecs) {
          const config = thisConfigValidator
            ? await fetchWidgetConfig(spec, thisConfigValidator)
            : void 0;

          const theseWidgets = await createWidget(element, config);
          if (theseWidgets) {
            widgets.push(...toArrayIfSingle(theseWidgets));
          }
        }

        // auto-destroy on element remove
        if (_.lengthOf(widgets)) {
          domWatcher.onMutation(
            () => {
              for (const w of widgets) {
                w.destroy();
              }
            },
            {
              target: element,
              categories: [_.S_REMOVED],
            },
          );
        }
      },
      {
        selector,
        categories: [_.S_ADDED],
      },
    );
  }
};

/**
 * Returns a configuration object from the given user input, which can be
 * either an object or a `<separator>` separated string of key=values.
 *
 * If `input` is a string, it must be of the format:
 *
 * ```
 * <UserConfigString> ::= <OptionSpec> { <Separator> <OptionSpec> }
 *
 * <OptionSpec> ::=
 *     <BooleanOptionName> [ "=" ( "false" | "true" ) ] |
 *     <OptionName> "=" <OptionValue>
 * ```
 *
 * By default, for widgets `<separator>` is `|`.
 *
 * **NOTE:** If `input` is a string, option names will be converted from
 * kebab-case to camelCase.
 *
 * The given `validator` defines the shape of the returned object. It is called
 * for each entry _in the `validator` object_, with that key and the
 * corresponding value from the input configuration, as the two parameters.
 *
 * If a key is not found in the input, the value passed to the validating
 * function will be `undefined`.
 *
 * If the input is a string and a key has no value, the value passed to the
 * validating function will be an empty string `""`.
 *
 * The final configuration contains all keys from the `validator` object with
 * the value that the validating function for each key returned.
 *
 * There are several built-in validating functions that you can make use of:
 * - {@link Utils.validateStrList}
 * - {@link Utils.validateNumList}
 * - {@link Utils.validateNumber}
 * - {@link Utils.validateBoolean}
 * - {@link Utils.validateString}
 * - {@link Utils.validateStringRequired}
 * - {@link Utils.validateBooleanOrString}
 */
export const getWidgetConfig = <Config extends Record<string, unknown>>(
  input: Record<string, unknown> | string | null | undefined,
  validator: WidgetConfigValidatorObject<Config>,
  separator = OPT_SEP_CHAR,
): Config => {
  const config = {} as Config;
  if (!(input instanceof Object)) {
    input = toOptionsObject(input, separator);
  }

  for (const key in validator) {
    config[key] = validator[key](key, input[key]);
  }
  return config;
};

/**
 * Like {@link getWidgetConfig} but it accepts an object whose validator
 * functions may return a promise.
 */
export const fetchWidgetConfig = async <Config extends Record<string, unknown>>(
  input: Record<string, unknown> | string | null | undefined,
  validator: WidgetConfigAsyncValidatorObject<Config>,
  separator = OPT_SEP_CHAR,
): Promise<Config> => {
  const config = {} as Config;
  const configPromises = getWidgetConfig<{
    [K in keyof Config]: Config[K] | Promise<Config[K]>;
  }>(input, validator, separator);

  for (const key in configPromises) {
    config[key] = await configPromises[key];
  }

  return config;
};

/**
 * @ignore
 * @internal
 */
export const getDataAttrConfigSpecs = (
  name: string,
  element: Element,
  separator?: null | string, // If given, it will split input
) => {
  const prefixedName = _.prefixName(name);
  const configSpecs: string[] = [];
  const dataAttr = getData(element, prefixedName);

  if (_.isNullish(separator)) {
    // Does not support multiple configs
    configSpecs.push(dataAttr ?? "");
  } else {
    if (hasClass(element, prefixedName)) {
      configSpecs.push("");
    }

    if (!_.isNull(dataAttr)) {
      configSpecs.push(
        ...(dataAttr ? splitOn(dataAttr, CONFIG_SEP_CHAR, true) : [""]),
      );
    }
  }

  return configSpecs;
};

/**
 * @ignore
 * @internal
 */
export const getDefaultWidgetSelector = (prefix: string) =>
  `.${prefix},[data-${prefix}]`;

/**
 * @ignore
 * @internal
 */
export const fetchUniqueWidget = async <W extends Widget>(
  name: string,
  element: Element,
  Type: { get: (element: Element) => W | null },
): Promise<W | null> => {
  let widget = Type.get(element);
  if (!widget) {
    await waitForDelay(0); // in case it's being processed now
    widget = Type.get(element);

    if (!widget) {
      logWarn(`No ${name} widget for element ${formatAsString(element)}`);
      return null;
    }
  }

  return widget;
};

// --------------------

const CONFIG_SEP_CHAR = ";";
const OPT_SEP_CHAR = "|";

const instances = createXWeakMap<Element, Map<string, Widget>>(() =>
  _.createMap(),
);
const registeredWidgets = _.createSet<string>();

const toOptionsObject = (
  input: string | null | undefined,
  separator: string,
) => {
  const options: Record<string, string> = {};
  for (const entry of _.filter(
    splitOn(input ?? "", separator, true),
    (v) => !_.isEmpty(v),
  )) {
    const [key, value] = splitOn(entry, /\s*=\s*/, true, 1);
    options[kebabToCamelCase(key)] = value ?? "";
  }
  return options;
};

_.brandClass(Widget, "Widget");
