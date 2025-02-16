"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAction = exports.fetchAction = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _text = require("../utils/text.cjs");
var _widget = require("../widgets/widget.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * @module Actions
 */

/**
 * @interface
 */

/**
 * Registers the given action so that it can be parsed by
 * {@link Triggers.registerTrigger}.
 *
 * **IMPORTANT:** If an action by that name is already registered, the current
 * call does nothing, even if the remaining arguments differ.
 *
 * @param {} name      The name of the action. Should be in kebab-case.
 * @param {} newAction Called for every action specification for a trigger
 *                     parsed by {@link Triggers.registerTrigger}
 */
const registerAction = (name, newAction, configValidator) => {
  if (registeredActions.has(name)) {
    return;
  }
  const newActionFromSpec = async (element, argsAndOptions) => {
    const thisConfigValidator = MH.isFunction(configValidator) ? await configValidator(element) : configValidator;
    const args = [];
    const config = thisConfigValidator ? await (0, _widget.fetchWidgetConfig)(argsAndOptions, thisConfigValidator, ",") : undefined;
    for (const entry of (0, _text.splitOn)(argsAndOptions, ",", true)) {
      if (entry) {
        if (!MH.includes(entry, "=")) {
          args.push(entry);
        }
      }
    }
    return newAction(element, args, config);
  };
  registeredActions.set(name, newActionFromSpec);
};

/**
 * Returns an {@link Action} registered under the given name and instantiated
 * with the given element and arguments and options parsed from the given string.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the given spec is not valid.
 */
exports.registerAction = registerAction;
const fetchAction = async (element, name, argsAndOptions) => {
  const newActionFromSpec = registeredActions.get(name);
  if (!newActionFromSpec) {
    throw MH.usageError(`Unknown action '${name}'`);
  }
  return await newActionFromSpec(element, argsAndOptions || "");
};

// --------------------
exports.fetchAction = fetchAction;
const registeredActions = MH.newMap();
//# sourceMappingURL=action.cjs.map