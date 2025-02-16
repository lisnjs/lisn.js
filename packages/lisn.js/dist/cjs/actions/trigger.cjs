"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Run = exports.Enable = exports.Disable = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _log = require("../utils/log.cjs");
var _tasks = require("../utils/tasks.cjs");
var _text = require("../utils/text.cjs");
var _trigger = require("../triggers/trigger.cjs");
var _action = require("./action.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Actions
 *
 * @categoryDescription Controlling triggers
 * {@link Enable} and {@link Disable} enable or disable a list of triggers
 * defined on the given element.
 *
 * {@link Run} runs or reverses a list of triggers defined on the given
 * element.
 */
/**
 * Enables or disables a list of triggers defined on the given element.
 *
 * **IMPORTANT:** When constructed, it disables all given triggers as a form of
 * initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 *   - Action name: "enable".
 *   - Accepted string arguments: one or more unique IDs of triggers defined on
 *     the given element
 *
 * @example
 * ```html
 * <button id="btn">Enable/disable</button>
 * <button data-lisn-on-click="
 *         @enable=triggerA,triggerB +target=#btn
 *         @add-class=clsA +id=triggerA
 *      "
 *      data-lisn-on-click="@add-class=clsB +id=triggerB"
 * ></button>
 * ```
 *
 * @category Controlling triggers
 */
class Enable {
  static register() {
    (0, _action.registerAction)("enable", (element, ids) => new Enable(element, ...ids));
  }
  constructor(element, ...ids) {
    /**
     * Enables the triggers with IDs given to the constructor.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Disables the triggers with IDs given to the constructor.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Toggles the enabled state on each trigger given to the constructor.
     */
    _defineProperty(this, "toggle", void 0);
    const {
      _enable,
      _disable,
      _toggleEnable
    } = getMethods(element, ids);
    _disable(); // initial state

    this.do = _enable;
    this.undo = _disable;
    this[MC.S_TOGGLE] = _toggleEnable;
  }
}

/**
 * Disables or enables a list of triggers defined on the given element.
 *
 * **IMPORTANT:** When constructed, it enables all given triggers as a form of
 * initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 *   - Action name: "disable".
 *   - Accepted string arguments: one or more unique IDs of triggers defined on
 *     the given element
 *
 * @example
 * ```html
 * <button id="btn">Enable/disable</button>
 * <button data-lisn-on-click="
 *         @disable=triggerA,triggerB +target=#btn
 *         @add-class=clsA +id=triggerA
 *      "
 *      data-lisn-on-click="@add-class=clsB +id=triggerB"
 * ></button>
 * ```
 *
 * @category Controlling triggers
 */
exports.Enable = Enable;
class Disable {
  static register() {
    (0, _action.registerAction)("disable", (element, ids) => new Disable(element, ...ids));
  }
  constructor(element, ...ids) {
    /**
     * Disables the triggers with IDs given to the constructor.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Enables the triggers with IDs given to the constructor.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Toggles the enabled state on each trigger given to the constructor.
     */
    _defineProperty(this, "toggle", void 0);
    const {
      _enable,
      _disable,
      _toggleEnable
    } = getMethods(element, ids);
    _enable(); // initial state

    this.do = _disable;
    this.undo = _enable;
    this[MC.S_TOGGLE] = _toggleEnable;
  }
}

/**
 * Runs or reverses a list of triggers defined on the given element.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 *   - Action name: "run".
 *   - Accepted string arguments: one or more unique IDs of triggers defined on
 *     the given element
 *
 * @example
 * ```html
 * <button data-lisn-on-click="
 *         @run=triggerA,triggerB
 *         @add-class=clsA +id=triggerA
 *      "
 *      data-lisn-on-run="@add-class=clsB +id=triggerB"
 * ></button>
 * ```
 *
 * @category Controlling triggers
 */
exports.Disable = Disable;
class Run {
  static register() {
    (0, _action.registerAction)("run", (element, ids) => new Run(element, ...ids));
  }
  constructor(element, ...ids) {
    /**
     * Runs the triggers with IDs given to the constructor.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Reverses the triggers with IDs given to the constructor.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Toggles the triggers with IDs given to the constructor.
     */
    _defineProperty(this, "toggle", void 0);
    const {
      _run,
      _reverse,
      _toggle
    } = getMethods(element, ids);
    this.do = _run;
    this.undo = _reverse;
    this[MC.S_TOGGLE] = _toggle;
  }
}

// --------------------
exports.Run = Run;
const getMethods = (element, ids) => {
  const triggerPromises = getTriggers(element, ids);
  const call = async method => {
    const triggers = await triggerPromises;
    for (const trigger of triggers) {
      trigger[method]();
    }
  };
  return {
    _enable: () => call("enable"),
    _disable: () => call("disable"),
    _toggleEnable: () => call("toggleEnable"),
    _run: () => call("run"),
    _reverse: () => call("reverse"),
    _toggle: () => call(MC.S_TOGGLE)
  };
};
const getTriggers = async (element, ids) => {
  const triggers = [];
  if (!MH.lengthOf(ids)) {
    (0, _log.logWarn)("At least 1 ID is required for enable action");
    return triggers;
  }
  for (const id of ids) {
    let trigger = _trigger.Trigger.get(element, id);
    if (!trigger) {
      await (0, _tasks.waitForDelay)(0); // in case it's being processed now
      trigger = _trigger.Trigger.get(element, id);
      if (!trigger) {
        (0, _log.logWarn)(`No trigger with ID ${id} for element ${(0, _text.formatAsString)(element)}`);
        continue;
      }
    }
    triggers.push(trigger);
  }
  return triggers;
};
//# sourceMappingURL=trigger.cjs.map