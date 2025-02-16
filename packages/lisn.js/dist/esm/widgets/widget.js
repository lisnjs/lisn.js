function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * ## Specification for the HTML API for widgets
 *
 * The following describes the general syntax when using the HTML API for
 * automatic creation of widgets based on data attributes
 * ({@link Settings.settings.autoWidgets | settings.autoWidgets} must be true.
 *
 * A widget specification should be given as a
 * `data-lisn-<WidgetName>="<WidgetConfList>"` attribute.
 *
 * Alternatively, if using all default configurations, you can simply add the
 * `lisn-<WidgetName>` CSS class. Specifying a configuration using CSS classes
 * is not currently possible for widgets, only triggers.
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
 * multiple configurations. Refer to the specific widget.
 *
 * The characters "|", ";", "=" are reserved separators and cannot be used
 * literally as part of an option value.
 *
 * @module Widgets
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { settings } from "../globals/settings.js";
import { hasClass, getData } from "../utils/css-alter.js";
import { waitForInteractive } from "../utils/dom-events.js";
import { logWarn } from "../utils/log.js";
import { toArrayIfSingle } from "../utils/misc.js";
import { waitForDelay } from "../utils/tasks.js";
import { formatAsString, kebabToCamelCase, splitOn } from "../utils/text.js";
import { wrapCallback } from "../modules/callback.js";
import { newXWeakMap } from "../modules/x-map.js";
import { DOMWatcher } from "../watchers/dom-watcher.js";
import debug from "../debug/debug.js";
export class Widget {
  /**
   * Retrieve an existing widget by element and ID.
   */
  static get(element, id) {
    var _instances$get;
    return ((_instances$get = instances.get(element)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(id)) || null;
  }

  /**
   * **IMPORTANT:** If ID is given and there's already a widget with this ID on
   * this element, it will be destroyed!
   */
  constructor(element, config) {
    /**
     * Disables the functionality of the widget. What this means is specific to
     * each widget.
     */
    _defineProperty(this, "disable", void 0);
    /**
     * Re-enables the functionality of the widget. What this means is specific to
     * each widget.
     */
    _defineProperty(this, "enable", void 0);
    /**
     * Re-enables the widget if disabled, otherwise disables it.
     */
    _defineProperty(this, "toggleEnable", void 0);
    /**
     * The given handler will be called when the widget is disabled.
     */
    _defineProperty(this, "onDisable", void 0);
    /**
     * The given handler will be called when the widget is enabled.
     */
    _defineProperty(this, "onEnable", void 0);
    /**
     * Returns true if the widget is currently disabled.
     */
    _defineProperty(this, "isDisabled", void 0);
    /**
     * Undoes all modifications to the element and returns it to its original state.
     *
     * You will need to recreate it if you want to enable its functionality again.
     */
    _defineProperty(this, "destroy", void 0);
    /**
     * The given handler will be called when the widget is destroyed.
     */
    _defineProperty(this, "onDestroy", void 0);
    /**
     * Returns true if the widget is destroyed.
     */
    _defineProperty(this, "isDestroyed", void 0);
    /**
     * Returns the element passed to the widget constructor.
     */
    _defineProperty(this, "getElement", void 0);
    const logger = debug ? new debug.Logger({
      name: `${this.constructor.name}-${formatAsString(element)}`,
      logAtCreation: this
    }) : null;
    const id = config === null || config === void 0 ? void 0 : config.id;
    if (id) {
      var _instances$get2;
      (_instances$get2 = instances.get(element)) === null || _instances$get2 === void 0 || (_instances$get2 = _instances$get2.get(id)) === null || _instances$get2 === void 0 || _instances$get2.destroy(); // don't await here
      instances.sGet(element).set(id, this);
    }
    let isDisabled = false;
    let isDestroyed = false;
    let destroyPromise;
    const enableCallbacks = MH.newSet();
    const disableCallbacks = MH.newSet();
    const destroyCallbacks = MH.newSet();
    this.disable = async () => {
      if (!isDisabled) {
        debug: logger === null || logger === void 0 || logger.debug8("Disabling");
        isDisabled = true;
        for (const callback of disableCallbacks) {
          await callback.invoke(this);
        }
      }
    };
    this.enable = async () => {
      if (!isDestroyed && isDisabled) {
        debug: logger === null || logger === void 0 || logger.debug8("Enabling");
        isDisabled = false;
        for (const callback of enableCallbacks) {
          await callback.invoke(this);
        }
      }
    };
    this.toggleEnable = async () => {
      if (!isDestroyed) {
        await (isDisabled ? this.enable : this.disable)();
      }
    };
    this.onDisable = handler => disableCallbacks.add(wrapCallback(handler));
    this.onEnable = handler => enableCallbacks.add(wrapCallback(handler));
    this.isDisabled = () => isDisabled;
    this.destroy = () => {
      if (!destroyPromise) {
        destroyPromise = (async () => {
          debug: logger === null || logger === void 0 || logger.debug8("Destroying");
          isDestroyed = true;
          await this.disable();
          for (const callback of destroyCallbacks) {
            await callback.invoke(this);
          }
          enableCallbacks.clear();
          disableCallbacks.clear();
          destroyCallbacks.clear();
          if (id) {
            const elInstances = instances.get(element);
            if ((elInstances === null || elInstances === void 0 ? void 0 : elInstances.get(id)) === this) {
              MH.deleteKey(elInstances, id);
              instances.prune(element);
            }
          }
        })();
      }
      return destroyPromise;
    };
    this.onDestroy = handler => destroyCallbacks.add(wrapCallback(handler));
    this.isDestroyed = () => isDestroyed;
    this.getElement = () => element;
  }
}

/**
 * **NOTE:** If the function returns a widget or a list of widgets created for
 * the given element, then each one will be automatically destroyed if the
 * element is removed from the DOM.
 */

/**
 * @see {@link getWidgetConfig}.
 */

/**
 * @see {@link getWidgetConfig}.
 */

/**
 * @see {@link getWidgetConfig}.
 */

/**
 * @see {@link getWidgetConfig}.
 */

/**
 * Enables automatic setting up of a widget from an elements matching the given
 * selector.
 *
 * If {@link settings.autoWidgets} is true, nothing is done. Otherwise,
 * when an element matching the selector is added to the DOM, `newWidget` will
 * be called and it's expected to setup the widget.
 *
 * **IMPORTANT:** The widget that is returned by `newWidget` will be
 * automatically destroyed when the element that created them is removed from
 * the DOM.
 *
 * **IMPORTANT:** If a widget by that name is already registered, the current
 * call does nothing, even if the remaining arguments differ.
 *
 * @param {} name       The name of the widget. Should be in kebab-case.
 * @param {} newWidget  Called for every element matching the widget selector.
 * @param {} configValidator
 *                      A validator object, or a function that returns such an
 *                      object, for all options supported by the widget. If
 *                      given, then the `newWidget` function will also be
 *                      passed a configuration object constructed from the
 *                      element's data attribute.
 * @param {} [options.selector]
 *                      The selector to match elements for. If not given, then
 *                      uses a default value of `[data-lisn-<name>], .lisn-<name>`
 * @param {} [options.supportsMultiple]
 *                      If true, and if `configValidator` is given, then the
 *                      value of the element's widget specific data attribute
 *                      will be split on ";" and each one parsed individually
 *                      as a configuration. Then the `newWidget` function will
 *                      be called once for each configuration.
 */
export const registerWidget = async (name, newWidget, configValidator, options) => {
  var _options$selector;
  if (registeredWidgets.has(name)) {
    return;
  }
  registeredWidgets.add(name);

  // init after DOM loaded so that the settings can be configured by the user
  // straight after loading LISN.js
  await waitForInteractive();
  const prefixedName = MH.prefixName(name);
  const selector = (_options$selector = options === null || options === void 0 ? void 0 : options.selector) !== null && _options$selector !== void 0 ? _options$selector : getDefaultWidgetSelector(prefixedName);
  if (settings.autoWidgets) {
    const domWatcher = DOMWatcher.reuse();
    domWatcher.onMutation(async operation => {
      const element = MH.currentTargetOf(operation);
      const thisConfigValidator = MH.isFunction(configValidator) ? await configValidator(element) : configValidator;
      const widgets = [];
      const configSpecs = [];
      const dataAttr = getData(element, prefixedName);
      if (options !== null && options !== void 0 && options.supportsMultiple) {
        if (hasClass(element, prefixedName)) {
          configSpecs.push("");
        }
        if (dataAttr !== null) {
          configSpecs.push(...(dataAttr ? splitOn(dataAttr, ";", true) : [""]));
        }
      } else {
        configSpecs.push(dataAttr !== null && dataAttr !== void 0 ? dataAttr : "");
      }
      for (const spec of configSpecs) {
        const config = thisConfigValidator ? await fetchWidgetConfig(spec, thisConfigValidator) : undefined;
        const theseWidgets = await newWidget(element, config);
        if (theseWidgets) {
          widgets.push(...toArrayIfSingle(theseWidgets));
        }
      }

      // auto-destroy on element remove
      if (MH.lengthOf(widgets)) {
        domWatcher.onMutation(() => {
          for (const w of widgets) {
            w.destroy();
          }
        }, {
          target: element,
          categories: [MC.S_REMOVED]
        });
      }
    }, {
      selector,
      categories: [MC.S_ADDED]
    });
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
 * By default, for widgets `<separator>` is "|".
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
 * There are several built-in validating functions that you can make use of.
 *
 * @see {@link Utils.validateStrList}
 * @see {@link Utils.validateNumber}
 * @see {@link Utils.validateBoolean}
 * @see {@link Utils.validateString}
 * @see {@link Utils.validateBooleanOrString}
 */
export const getWidgetConfig = (input, validator, separator = "|") => {
  const config = {};
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
export const fetchWidgetConfig = async (input, validator, separator = "|") => {
  const config = {};
  const configPromises = getWidgetConfig(input, validator, separator);
  for (const key in configPromises) {
    config[key] = await configPromises[key];
  }
  return config;
};

/**
 * @ignore
 * @internal
 */
export const getDefaultWidgetSelector = prefix => `.${prefix},[data-${prefix}]`;

/**
 * @ignore
 * @internal
 */
export const fetchUniqueWidget = async (name, element, Type) => {
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
const instances = newXWeakMap(() => MH.newMap());
const registeredWidgets = MH.newSet();

// --------------------

const toOptionsObject = (input, separator) => {
  const options = {};
  for (const entry of MH.filter(splitOn(input !== null && input !== void 0 ? input : "", separator, true), v => !MH.isEmpty(v))) {
    const [key, value] = splitOn(entry, /\s*=\s*/, true, 1);
    options[kebabToCamelCase(key)] = value !== null && value !== void 0 ? value : "";
  }
  return options;
};
//# sourceMappingURL=widget.js.map