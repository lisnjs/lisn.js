/**
 * @module Actions
 */

import * as MH from "../globals/minification-helpers.js";
import { splitOn } from "../utils/text.js";
import { fetchWidgetConfig } from "../widgets/widget.js";

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
export const registerAction = (name, newAction, configValidator) => {
  if (registeredActions.has(name)) {
    return;
  }
  const newActionFromSpec = async (element, argsAndOptions) => {
    const thisConfigValidator = MH.isFunction(configValidator) ? await configValidator(element) : configValidator;
    const args = [];
    const config = thisConfigValidator ? await fetchWidgetConfig(argsAndOptions, thisConfigValidator, ",") : undefined;
    for (const entry of splitOn(argsAndOptions, ",", true)) {
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
export const fetchAction = async (element, name, argsAndOptions) => {
  const newActionFromSpec = registeredActions.get(name);
  if (!newActionFromSpec) {
    throw MH.usageError(`Unknown action '${name}'`);
  }
  return await newActionFromSpec(element, argsAndOptions || "");
};

// --------------------

const registeredActions = MH.newMap();
//# sourceMappingURL=action.js.map