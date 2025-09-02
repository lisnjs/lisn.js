/**
 * ## Specification for the HTML API for actions
 *
 * When using the HTML API, actions are always used with triggers. Please see
 * {@link Triggers | the documentation on triggers} for the required syntax.
 *
 * @module Actions
 *
 * @categoryDescription Base
 * These types, classes and functions are to be used by those who want to define
 * their own actions.
 */

import * as _ from "@lisn/_internal";

import { usageError } from "@lisn/globals/errors";

import { splitOn } from "@lisn/utils/text";

import { WidgetConfigValidator, fetchWidgetConfig } from "@lisn/widgets/widget";

/**
 * @category Base
 */
export interface Action {
  do: () => void;
  undo: () => void;
  toggle: () => void;
}

/**
 * @category Base
 */
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
 * @param name         The name of the action. Should be in kebab-case.
 * @param createAction Called for every action specification for a trigger
 *                     parsed by {@link Triggers.registerTrigger}
 *
 * @category Base
 */
export const registerAction = <Config extends Record<string, unknown>>(
  name: string,
  createAction: ActionCreateFn<Config>,
  configValidator?: null | WidgetConfigValidator<Config>,
) => {
  if (registeredActions.has(name)) {
    return;
  }

  const createActionFromSpec = async (
    element: Element,
    argsAndOptions: string,
  ) => {
    const thisConfigValidator = _.isFunction(configValidator)
      ? await configValidator(element)
      : configValidator;

    const args: string[] = [];

    // In general, if an action accepts a boolean *option* (not argument), it
    // may not be followed by a =value. So we pass the full string to the
    // fetchWidgetConfig which will parse such boolean options if they are
    // defined in the config validator.
    const config = thisConfigValidator
      ? await fetchWidgetConfig(
          argsAndOptions,
          thisConfigValidator,
          ARG_SEP_CHAR,
        )
      : void 0;

    for (const entry of splitOn(argsAndOptions, ARG_SEP_CHAR, true)) {
      if (entry) {
        if (!_.includes(entry, "=") && !(config && entry in config)) {
          args.push(entry);
        }
      }
    }

    return createAction(element, args, config);
  };

  registeredActions.set(name, createActionFromSpec);
};

/**
 * Returns an {@link Action} registered under the given name and instantiated
 * with the given element and arguments and options parsed from the given string.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the given spec is not valid.
 *
 * @category Base
 */
export const fetchAction = async (
  element: Element,
  name: string,
  argsAndOptions?: string,
): Promise<Action> => {
  const createActionFromSpec = registeredActions.get(name);
  if (!createActionFromSpec) {
    throw usageError(`Unknown action '${name}'`);
  }

  return await createActionFromSpec(element, argsAndOptions ?? "");
};

// --------------------

const ARG_SEP_CHAR = ",";

const registeredActions = _.createMap<
  string,
  (element: Element, spec: string) => Action | Promise<Action>
>();
