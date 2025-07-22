/**
 * ## Specification for the HTML API for actions
 *
 * When using the HTML API, actions are always used with triggers. Please see
 * {@link Triggers | the documentation on triggers} for the required syntax.
 *
 * @module Actions
 */

import * as MH from "@lisn/globals/minification-helpers";

import { splitOn } from "@lisn/utils/text";

import { WidgetConfigValidator, fetchWidgetConfig } from "@lisn/widgets/widget";

/**
 * @interface
 */
export type Action = {
  do: () => void;
  undo: () => void;
  toggle: () => void;
};

export type ActionCreateFn<Config extends Record<string, unknown>> = (
  element: Element,
  args: string[],
  config?: Config,
) => Action | Promise<Action>;

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
export const registerAction = <Config extends Record<string, unknown>>(
  name: string,
  newAction: ActionCreateFn<Config>,
  configValidator?: null | WidgetConfigValidator<Config>,
) => {
  if (registeredActions.has(name)) {
    return;
  }

  const newActionFromSpec = async (
    element: Element,
    argsAndOptions: string,
  ) => {
    const thisConfigValidator = MH.isFunction(configValidator)
      ? await configValidator(element)
      : configValidator;

    const args: string[] = [];
    const config = thisConfigValidator
      ? await fetchWidgetConfig(
          argsAndOptions,
          thisConfigValidator,
          ARG_SEP_CHAR,
        )
      : undefined;

    for (const entry of splitOn(argsAndOptions, ARG_SEP_CHAR, true)) {
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
export const fetchAction = async (
  element: Element,
  name: string,
  argsAndOptions?: string,
): Promise<Action> => {
  const newActionFromSpec = registeredActions.get(name);
  if (!newActionFromSpec) {
    throw MH.usageError(`Unknown action '${name}'`);
  }

  return await newActionFromSpec(element, argsAndOptions ?? "");
};

// --------------------

const ARG_SEP_CHAR = ",";

const registeredActions = MH.newMap<
  string,
  (element: Element, spec: string) => Action | Promise<Action>
>();
