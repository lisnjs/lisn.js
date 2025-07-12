"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerWidget = exports.getWidgetConfig = exports.getDefaultWidgetSelector = exports.fetchWidgetConfig = exports.fetchUniqueWidget = exports.Widget = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _settings = require("../globals/settings.cjs");
var _cssAlter = require("../utils/css-alter.cjs");
var _domEvents = require("../utils/dom-events.cjs");
var _log = require("../utils/log.cjs");
var _misc = require("../utils/misc.cjs");
var _tasks = require("../utils/tasks.cjs");
var _text = require("../utils/text.cjs");
var _callback = require("../modules/callback.cjs");
var _xMap = require("../modules/x-map.cjs");
var _domWatcher = require("../watchers/dom-watcher.cjs");
var _debug = _interopRequireDefault(require("../debug/debug.cjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
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
class Widget {
  /**
   * Retrieve an existing widget by element and ID.
   */
  static get(element, id) {
    var _instances$get$get, _instances$get;
    return (_instances$get$get = (_instances$get = instances.get(element)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(id)) !== null && _instances$get$get !== void 0 ? _instances$get$get : null;
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
    const logger = _debug.default ? new _debug.default.Logger({
      name: `${this.constructor.name}-${(0, _text.formatAsString)(element)}`,
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
    this.onDisable = handler => disableCallbacks.add((0, _callback.wrapCallback)(handler));
    this.onEnable = handler => enableCallbacks.add((0, _callback.wrapCallback)(handler));
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
    this.onDestroy = handler => destroyCallbacks.add((0, _callback.wrapCallback)(handler));
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
exports.Widget = Widget;
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
 * @param name      The name of the widget. Should be in kebab-case.
 * @param newWidget Called for every element matching the widget selector.
 * @param configValidator
 *                  A validator object, or a function that returns such an
 *                  object, for all options supported by the widget. If
 *                  given, then the `newWidget` function will also be
 *                  passed a configuration object constructed from the
 *                  element's data attribute.
 * @param [options.selector]
 *                  The selector to match elements for. If not given, then
 *                  uses a default value of `[data-lisn-<name>], .lisn-<name>`
 * @param [options.supportsMultiple]
 *                  If true, and if `configValidator` is given, then the
 *                  value of the element's widget specific data attribute
 *                  will be split on ";" and each one parsed individually
 *                  as a configuration. Then the `newWidget` function will
 *                  be called once for each configuration.
 */
const registerWidget = async (name, newWidget, configValidator, options) => {
  if (registeredWidgets.has(name)) {
    return;
  }
  registeredWidgets.add(name);

  // init after DOM loaded so that the settings can be configured by the user
  // straight after loading LISN.js
  await (0, _domEvents.waitForInteractive)();
  const prefixedName = MH.prefixName(name);
  const selector = (options === null || options === void 0 ? void 0 : options.selector) || getDefaultWidgetSelector(prefixedName);
  if (_settings.settings.autoWidgets) {
    const domWatcher = _domWatcher.DOMWatcher.reuse();
    domWatcher.onMutation(async operation => {
      const element = MH.currentTargetOf(operation);
      const thisConfigValidator = MH.isFunction(configValidator) ? await configValidator(element) : configValidator;
      const widgets = [];
      const configSpecs = [];
      const dataAttr = (0, _cssAlter.getData)(element, prefixedName);
      if (options !== null && options !== void 0 && options.supportsMultiple) {
        if ((0, _cssAlter.hasClass)(element, prefixedName)) {
          configSpecs.push("");
        }
        if (dataAttr !== null) {
          configSpecs.push(...(dataAttr ? (0, _text.splitOn)(dataAttr, ";", true) : [""]));
        }
      } else {
        configSpecs.push(dataAttr !== null && dataAttr !== void 0 ? dataAttr : "");
      }
      for (const spec of configSpecs) {
        const config = thisConfigValidator ? await fetchWidgetConfig(spec, thisConfigValidator) : undefined;
        const theseWidgets = await newWidget(element, config);
        if (theseWidgets) {
          widgets.push(...(0, _misc.toArrayIfSingle)(theseWidgets));
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
exports.registerWidget = registerWidget;
const getWidgetConfig = (input, validator, separator = "|") => {
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
exports.getWidgetConfig = getWidgetConfig;
const fetchWidgetConfig = async (input, validator, separator = "|") => {
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
exports.fetchWidgetConfig = fetchWidgetConfig;
const getDefaultWidgetSelector = prefix => `.${prefix},[data-${prefix}]`;

/**
 * @ignore
 * @internal
 */
exports.getDefaultWidgetSelector = getDefaultWidgetSelector;
const fetchUniqueWidget = async (name, element, Type) => {
  let widget = Type.get(element);
  if (!widget) {
    await (0, _tasks.waitForDelay)(0); // in case it's being processed now
    widget = Type.get(element);
    if (!widget) {
      (0, _log.logWarn)(`No ${name} widget for element ${(0, _text.formatAsString)(element)}`);
      return null;
    }
  }
  return widget;
};
exports.fetchUniqueWidget = fetchUniqueWidget;
const instances = (0, _xMap.newXWeakMap)(() => MH.newMap());
const registeredWidgets = MH.newSet();

// --------------------

const toOptionsObject = (input, separator) => {
  const options = {};
  for (const entry of MH.filter((0, _text.splitOn)(input !== null && input !== void 0 ? input : "", separator, true), v => !MH.isEmpty(v))) {
    const [key, value] = (0, _text.splitOn)(entry, /\s*=\s*/, true, 1);
    options[(0, _text.kebabToCamelCase)(key)] = value !== null && value !== void 0 ? value : "";
  }
  return options;
};
//# sourceMappingURL=widget.cjs.map