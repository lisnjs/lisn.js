"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTrigger = exports.Trigger = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _errors = require("../globals/errors.cjs");
var _callback = require("../modules/callback.cjs");
var _cssAlter = require("../utils/css-alter.cjs");
var _domSearch = require("../utils/dom-search.cjs");
var _tasks = require("../utils/tasks.cjs");
var _text = require("../utils/text.cjs");
var _validation = require("../utils/validation.cjs");
var _action = require("../actions/action.cjs");
var _widget = require("../widgets/widget.cjs");
var _debug = _interopRequireDefault(require("../debug/debug.cjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * ## Specification for the HTML API for triggers
 *
 * The following describes the general syntax when using the HTML API and
 * automatic widgets
 * ({@link Settings.settings.autoWidgets | settings.autoWidgets} is true)
 * specifically for triggers and actions.
 *
 * A trigger specification should be given as a
 * `data-lisn-on-<TriggerName>="<TriggerSpecList>"` attribute.
 * A fallback option of using a CSS class of the form
 * `lisn-on-<TriggerName>--<TriggerSpec>` is also supported but not recommended.
 *
 * The general specification for a trigger is of the form:
 *
 * ```
 * <TriggerSpecList> ::= <TriggerSpec> { ";" <TriggerSpec> }
 *
 * <TriggerSpec> ::= [ <TriggerArg> { "," <TriggerArg> } ]
 *                   "@" <ActionSpec> { "@" <ActionSpec> }
 *                   { "+" <TriggerOption> }
 *
 * <TriggerOption> ::=
 *     <BooleanOptionName> [ "=" ( "false" | "true" ) ] |
 *     <OptionName> "=" <OptionValue>
 *
 * <ActionSpec> ::= <ActionName> [ ":" <ActionArgOrOption> { "," <ActionArgOrOption> } ]
 *
 * <ActionArgOrOption> ::= <ActionArg> | <OptionName> "=" <OptionValue>
 * ```
 *
 * where `<TriggerArg>` is the particular trigger's main argument, which could
 * be required or optional (and not all triggers accept an argument). See each
 * trigger's specification for their arguments and options.
 *
 * Also refer to each action for their accepted arguments and/or options if any.
 *
 * **NOTE:**
 *
 * There can be 0 or more spaces around any of the separator characters.
 *
 * At least one action (with a preceding "@" character) is always required.
 *
 * The characters ";", ",", "=", "@", "+" and ":" are reserved separators and
 * cannot be used literally as part of an argument or option value.
 *
 * @module Triggers
 *
 * @categoryDescription Manual run
 * {@link Trigger} is the base trigger class that you can extend when building
 * custom triggers and it also registers a trigger that needs to be run
 * manually (by e.g. the {@link Actions.Run | Run} action).
 */
/**
 * {@link Trigger} is the base trigger class that you can extend when building
 * custom triggers and it also registers a trigger that needs to be run
 * manually (by e.g. the {@link Actions.Run | Run} action).
 *
 * -------
 *
 * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
 * specification.
 *
 * @example
 * Show the element 1000ms after the first time the trigger is run.
 *
 * ```html
 * <div data-lisn-on-run="@show +once +delay=1000"></div>
 * ```
 *
 * @category Manual run
 */
class Trigger extends _widget.Widget {
  static get(element, id) {
    const instance = super.get(element, id);
    if (MH.isInstanceOf(instance, Trigger)) {
      return instance;
    }
    return null;
  }
  static register() {
    registerTrigger("run", (element, a, actions, config) => new Trigger(element, actions, config), {});
  }

  /**
   * If no actions are supplied, nothing is done.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the config is invalid.
   */
  constructor(element, actions, config) {
    var _config$once, _config$oneWay, _config$doDelay, _config$undoDelay;
    super(element, config);
    /**
     * "Do"es all the {@link Action}s linked to the trigger.
     */
    _defineProperty(this, "run", void 0);
    /**
     * "Undo"es all the {@link Action}s linked to the trigger.
     */
    _defineProperty(this, "reverse", void 0);
    /**
     * "Toggle"s all the {@link Action}s linked to the trigger.
     */
    _defineProperty(this, "toggle", void 0);
    /**
     * Returns the trigger's actions.
     */
    _defineProperty(this, "getActions", void 0);
    /**
     * Returns the trigger config.
     */
    _defineProperty(this, "getConfig", void 0);
    const logger = _debug.default ? new _debug.default.Logger({
      name: `Trigger-${(0, _text.formatAsString)(element)}`,
      logAtCreation: {
        actions,
        config
      }
    }) : null;
    const once = (_config$once = config === null || config === void 0 ? void 0 : config.once) !== null && _config$once !== void 0 ? _config$once : false;
    const oneWay = (_config$oneWay = config === null || config === void 0 ? void 0 : config.oneWay) !== null && _config$oneWay !== void 0 ? _config$oneWay : false;
    const delay = (config === null || config === void 0 ? void 0 : config.delay) || 0;
    const doDelay = (_config$doDelay = config === null || config === void 0 ? void 0 : config.doDelay) !== null && _config$doDelay !== void 0 ? _config$doDelay : delay;
    const undoDelay = (_config$undoDelay = config === null || config === void 0 ? void 0 : config.undoDelay) !== null && _config$undoDelay !== void 0 ? _config$undoDelay : delay;
    let lastCallId;
    // false if next should be do; true if next should be undo.
    // Used for determining delays only.
    let toggleState = false;
    const callActions = async (delay, callFn, newToggleState) => {
      if (this.isDisabled()) {
        return;
      }
      const myCallId = (0, _text.randId)();
      lastCallId = myCallId;
      debug: logger === null || logger === void 0 || logger.debug10(`callActions [${myCallId}] (new toggle state ${newToggleState})`, callFn);
      if (delay) {
        await (0, _tasks.waitForDelay)(delay);
        if (lastCallId !== myCallId) {
          // overriden by subsequent call
          debug: logger === null || logger === void 0 || logger.debug10(`callActions [${myCallId}]: overriden by ${lastCallId}`);
          return;
        }
      }
      for (const action of actions) {
        debug: logger === null || logger === void 0 || logger.debug10(`callActions [${myCallId}]`, action);
        callFn(action);
      }
      toggleState = newToggleState;
      if (toggleState && once) {
        this.destroy();
      }
    };
    const run = (0, _callback.wrapCallback)(() => {
      callActions(doDelay, action => {
        action.do();
      }, true); // don't await
    });
    const reverse = (0, _callback.wrapCallback)(() => {
      if (!oneWay) {
        callActions(undoDelay, action => {
          action.undo();
        }, false); // don't await
      }
    });
    const toggle = (0, _callback.wrapCallback)(() => {
      callActions(toggleState ? undoDelay : doDelay, action => {
        action[MC.S_TOGGLE]();
      }, !toggleState); // don't await
    });

    // ----------

    this.onDestroy(() => {
      debug: logger === null || logger === void 0 || logger.debug5("Removing callbacks");
      MH.remove(run);
      MH.remove(reverse);
      MH.remove(toggle);
    });
    this.run = run.invoke;
    this.reverse = reverse.invoke;
    this[MC.S_TOGGLE] = oneWay ? run.invoke : toggle.invoke;
    this.getActions = () => [...actions]; // copy
    this.getConfig = () => MH.copyObject(config || {});
  }
}

/**
 * @interface
 */
exports.Trigger = Trigger;
/**
 * Registers the given trigger as a widget to be automatically configured for
 * all elements that have a trigger specification with the given name.
 *
 * A trigger specification can be given as a
 * `data-lisn-on-<TriggerName>="<TriggerSpec> { ";" <TriggerSpec> }"` attribute
 * or as one or more `lisn-on-<TriggerName>--<TriggerSpec>` classes.
 *
 * See the top of the {@link Triggers} page for an explanation of `<TriggerSpec>`.
 *
 * Using classes instead of attributes is not recommended and only available as
 * a fallback option.
 *
 * **IMPORTANT:** If a trigger by that name is already registered, the current
 * call does nothing, even if the remaining arguments differ.
 *
 * @param {} name       The name of the trigger. Should be in kebab-case.
 * @param {} newTrigger Called for every trigger specification on any element
 *                      that has one or more trigger specifications.
 * @param {} configValidator
 *                      A validator object, or a function that returns such an
 *                      object, for all options that are specific to the
 *                      trigger. Base options (in {@link TriggerConfig}) will
 *                      be parsed automatically and don't need to be handled by
 *                      `configValidator`.
 *                      If the parameter is a function, it will be called with
 *                      the element on which the trigger is being defined.
 *
 * @see {@link registerWidget}
 */
const registerTrigger = (name, newTrigger, configValidator) => {
  const clsPref = MH.prefixName(`on-${name}`);
  const newWidget = async element => {
    var _getData;
    const widgets = [];
    const baseConfigValidator = newBaseConfigValidator(element);
    const thisConfigValidator = MH.isFunction(configValidator) ? await configValidator(element) : configValidator;
    const allSpecs = (0, _text.splitOn)((_getData = (0, _cssAlter.getData)(element, MH.prefixName(`on-${name}`))) !== null && _getData !== void 0 ? _getData : "", TRIGGER_SEP, true);
    for (const cls of MH.classList(element)) {
      if (cls.startsWith(`${clsPref}--`)) {
        allSpecs.push(cls.slice(MH.lengthOf(clsPref) + 2));
      }
    }
    for (const spec of allSpecs) {
      var _config$actOn;
      const [tmp, configSpec] = (0, _text.splitOn)(spec, OPTION_PREF_CHAR, true, 1);
      const [argSpec, allActionSpecs] = (0, _text.splitOn)(tmp, ACTION_PREF_CHAR, true, 1);
      const args = MH.filterBlank((0, _text.splitOn)(argSpec, ",", true)) || [];
      const config = await (0, _widget.fetchWidgetConfig)(configSpec, MH.assign(baseConfigValidator, thisConfigValidator), OPTION_PREF_CHAR);
      const actionTarget = (_config$actOn = config.actOn) !== null && _config$actOn !== void 0 ? _config$actOn : element;
      const actions = [];
      for (const actionSpec of (0, _text.splitOn)(allActionSpecs || "", ACTION_PREF_CHAR, true)) {
        const [name, actionArgsAndOptions] = (0, _text.splitOn)(actionSpec, ACTION_ARGS_PREF_CHAR, true, 1);
        try {
          actions.push(await (0, _action.fetchAction)(actionTarget, name, actionArgsAndOptions || ""));
        } catch (err) {
          if (MH.isInstanceOf(err, _errors.LisnUsageError)) {
            // fetchAction would have logged an error
            continue;
          }
          throw err;
        }
      }
      widgets.push(await newTrigger(element, args, actions, config));
    }
    return widgets;
  };
  (0, _widget.registerWidget)(name, newWidget, null, {
    selector: `[class^="${clsPref}--"],[class*=" ${clsPref}--"],[data-${clsPref}]`
  });
};

// --------------------
exports.registerTrigger = registerTrigger;
const TRIGGER_SEP = ";";
const OPTION_PREF_CHAR = "+";
const ACTION_PREF_CHAR = "@";
const ACTION_ARGS_PREF_CHAR = ":";
const newBaseConfigValidator = element => {
  return {
    id: _validation.validateString,
    once: _validation.validateBoolean,
    oneWay: _validation.validateBoolean,
    delay: _validation.validateNumber,
    doDelay: _validation.validateNumber,
    undoDelay: _validation.validateNumber,
    actOn: (key, value) => {
      var _ref;
      return (_ref = MH.isLiteralString(value) ? (0, _domSearch.waitForReferenceElement)(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    }
  };
};
//# sourceMappingURL=trigger.cjs.map