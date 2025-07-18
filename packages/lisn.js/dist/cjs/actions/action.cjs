"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAction = exports.fetchAction = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _text = require("../utils/text.cjs");
var _widget = require("../widgets/widget.cjs");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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
 * @param name      The name of the action. Should be in kebab-case.
 * @param newAction Called for every action specification for a trigger
 *                  parsed by {@link Triggers.registerTrigger}
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