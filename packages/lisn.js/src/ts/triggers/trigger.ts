/**
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
 * `lisn-on-<TriggerName>--<TriggerSpec>` is also supported if needed but is not
 * recommended and may be deprecated in future.
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
 * <ActionSpec> ::= <ActionName> [ ":" <ActionArgsAndOptions> ]
 *
 * <ActionArgsAndOptions> ::= <ActionArgs> [ "," <ActionOptions> ] |
 *                            <ActionOptions>
 *
 * <ActionArgs> ::= <Arg> { "," <Arg> }
 *
 * <ActionOptions> ::= <OptionName> = <OptionValue> { "," <OptionName> = <OptionValue> }
 * ```
 *
 * Some triggers or actions accept both arguments as well as `=` separated
 * key=value options. Some accept only arguments or only options. See each
 * trigger or actions's specification for their accepted or required arguments
 * and options. When specifying action arguments and options, place the
 * arguments first.
 *
 * **NOTE:**
 *
 * There can be 0 or more spaces around any of the separator characters.
 *
 * At least one action (with a preceding `@` character) is always required.
 *
 * The characters `;`, `,`, `=`, `@`, `+` and `:` are reserved separators and
 * cannot be used literally as part of an argument or option value.
 *
 * See documentation on a specific trigger or action for examples.
 *
 * @module Triggers
 *
 * @categoryDescription Manual run
 * {@link Trigger} is the base trigger class that you can extend when building
 * custom triggers and it also registers a trigger that needs to be run
 * manually (by e.g. the {@link Actions.Run | Run} action).
 */

// [TODO v2]: Perhaps remove support for trigger spec in CSS classes?

import * as _ from "@lisn/_internal";

import { LisnUsageError } from "@lisn/globals/errors";

import { wrapCallback } from "@lisn/modules/callback";

import { getData } from "@lisn/utils/css-alter";
import { waitForReferenceElement } from "@lisn/utils/dom-search";
import { waitForDelay } from "@lisn/utils/tasks";
import { formatAsString, randId, splitOn } from "@lisn/utils/text";
import {
  validateString,
  validateNumber,
  validateBoolean,
} from "@lisn/utils/validation";

import { Action, fetchAction } from "@lisn/actions/action";

import {
  Widget,
  WidgetConfigValidator,
  WidgetConfigValidatorFunc,
  WidgetConfigAsyncValidatorObject,
  registerWidget,
  fetchWidgetConfig,
} from "@lisn/widgets/widget";

import debug from "@lisn/debug/debug";

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
export class Trigger extends Widget {
  /**
   * "Do"es all the {@link Action}s linked to the trigger.
   */
  readonly run: () => Promise<void>;

  /**
   * "Undo"es all the {@link Action}s linked to the trigger.
   */
  readonly reverse: () => Promise<void>;

  /**
   * "Toggle"s all the {@link Action}s linked to the trigger.
   */
  readonly toggle: () => Promise<void>;

  /**
   * Returns the trigger's actions.
   */
  readonly getActions: () => Action[];

  /**
   * Returns the trigger config.
   */
  readonly getConfig: () => TriggerConfig;

  static get(element: Element, id: string): Trigger | null {
    const instance = super.get(element, id);
    if (_.isInstanceOf(instance, Trigger)) {
      return instance;
    }
    return null;
  }

  static register() {
    registerTrigger(
      "run",
      (element, a, actions, config) => new Trigger(element, actions, config),
      {},
    );
  }

  /**
   * If no actions are supplied, nothing is done.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the config is invalid.
   */
  constructor(element: Element, actions: Action[], config?: TriggerConfig) {
    config ??= {};
    super(element, config);

    const logger = debug
      ? new debug.Logger({
          name: `Trigger-${formatAsString(element)}`,
          logAtCreation: { actions, config },
        })
      : null;

    const once = config.once ?? false;
    const oneWay = config.oneWay ?? false;
    const delay = config.delay ?? 0;
    const doDelay = config.doDelay ?? delay;
    const undoDelay = config.undoDelay ?? delay;

    let lastCallId: string;
    // false if next should be do; true if next should be undo.
    // Used for determining delays only.
    let toggleState = false;

    const callActions = async (
      delay: number,
      callFn: (action: Action) => void,
      newToggleState: boolean,
    ) => {
      if (this.isDisabled()) {
        return;
      }

      const myCallId = randId();
      lastCallId = myCallId;
      debug: logger?.debug10(
        `callActions [${myCallId}] (new toggle state ${newToggleState})`,
        callFn,
      );

      if (delay) {
        await waitForDelay(delay);
        if (lastCallId !== myCallId) {
          // overriden by subsequent call
          debug: logger?.debug10(
            `callActions [${myCallId}]: overriden by ${lastCallId}`,
          );
          return;
        }
      }

      for (const action of actions) {
        debug: logger?.debug10(`callActions [${myCallId}]`, action);
        callFn(action);
      }

      toggleState = newToggleState;

      if (toggleState && once) {
        this.destroy();
      }
    };

    const run = wrapCallback(() => {
      callActions(
        doDelay,
        (action) => {
          action.do();
        },
        true,
      ); // don't await
    });

    const reverse = wrapCallback(() => {
      if (!oneWay) {
        callActions(
          undoDelay,
          (action) => {
            action.undo();
          },
          false,
        ); // don't await
      }
    });

    const toggle = wrapCallback(() => {
      callActions(
        toggleState ? undoDelay : doDelay,
        (action) => {
          action[_.S_TOGGLE]();
        },
        !toggleState,
      ); // don't await
    });

    // ----------

    this.onDestroy(() => {
      debug: logger?.debug5("Removing callbacks");
      _.remove(run);
      _.remove(reverse);
      _.remove(toggle);
    });

    this.run = run.invoke;
    this.reverse = reverse.invoke;
    this[_.S_TOGGLE] = oneWay ? run.invoke : toggle.invoke;
    this.getActions = () => [...actions]; // copy
    this.getConfig = () => _.deepCopy(config);
  }
}

/**
 * @interface
 */
export type TriggerConfig = {
  /**
   * An ID for the trigger so that it can be looked up by ID. It has to be
   * unique for each element, but you can use the same ID on different
   * elements.
   *
   * @defaultValue undefined
   */
  id?: string;

  /**
   * If true, the trigger will run at most once. This will result in the `run`
   * or `toggle` methods removing all three of `run`, `reverse` and `toggle`
   * when called, so that the actions are done at most once.
   *
   * @defaultValue false
   */
  once?: boolean;

  /**
   * If true, then the `reverse` method of the trigger will do nothing and the
   * `toggle` method will always do the actions, i.e. will be equivalent to
   * `run`.
   *
   * @defaultValue false
   */
  oneWay?: boolean;

  /**
   * Delay in milliseconds before doing, undoing or toggling actions.
   *
   * @defaultValue 0
   */
  delay?: number;

  /**
   * Delay in milliseconds before doing actions.
   *
   * @defaultValue {@link TriggerConfig.delay}
   */
  doDelay?: number;

  /**
   * Delay in milliseconds before undoing actions.
   *
   * @defaultValue {@link TriggerConfig.delay}
   */
  undoDelay?: number;

  /**
   * The element to instantiate all actions on this trigger for.
   *
   * @defaultValue The element on which the {@link Trigger} is defined
   */
  actOn?: Element;
};

export type TriggerCreateFn<Config extends TriggerConfig> = (
  element: Element,
  args: string[],
  actions: Action[],
  config: Config,
) => Trigger | Promise<Trigger>;

/**
 * Registers the given trigger as a widget to be automatically configured for
 * all elements that have a trigger specification with the given name.
 *
 * See the {@link Triggers} page for an explanation of the string specification
 * syntax.
 *
 * **IMPORTANT:** If a trigger by that name is already registered, the current
 * call does nothing, even if the remaining arguments differ.
 *
 * @param name       The name of the trigger. Should be in kebab-case.
 * @param newTrigger Called for every trigger specification on any element
 *                   that has one or more trigger specifications.
 * @param configValidator
 *                   A validator object, or a function that returns such an
 *                   object, for all options that are specific to the
 *                   trigger. Base options (in {@link TriggerConfig}) will
 *                   be parsed automatically and don't need to be handled by
 *                   `configValidator`.
 *                   If the parameter is a function, it will be called with
 *                   the element on which the trigger is being defined.
 *
 * @see {@link registerWidget}
 */
export const registerTrigger = <Config extends TriggerConfig = TriggerConfig>(
  name: string,
  newTrigger: TriggerCreateFn<Config>,
  configValidator?: null | WidgetConfigValidator<Config>,
) => {
  const clsPref = _.prefixName(`on-${name}`);

  const newWidget = async (element: Element) => {
    const widgets: Widget[] = [];
    const baseConfigValidator = newBaseConfigValidator(element);
    const thisConfigValidator = _.isFunction(configValidator)
      ? await configValidator(element)
      : configValidator;

    const allSpecs = splitOn(
      getData(element, _.prefixName(`on-${name}`)) ?? "",
      TRIGGER_SEP_CHAR,
      true,
    );

    for (const cls of _.classList(element)) {
      if (cls.startsWith(`${clsPref}--`)) {
        allSpecs.push(cls.slice(_.lengthOf(clsPref) + 2));
      }
    }

    for (const spec of allSpecs) {
      const [tmp, configSpec] = splitOn(spec, OPTION_PREF_CHAR, true, 1);
      const [argSpec, allActionSpecs] = splitOn(tmp, ACTION_PREF_CHAR, true, 1);

      const args = _.filterBlank(splitOn(argSpec, ARGS_SEP_CHAR, true)) || [];

      const config = await fetchWidgetConfig(
        configSpec,
        _.assign(
          baseConfigValidator,
          thisConfigValidator,
        ) as WidgetConfigAsyncValidatorObject<Required<TriggerConfig> & Config>,
        OPTION_PREF_CHAR,
      );

      const actionTarget = config.actOn ?? element;

      const actions = [];
      for (const actionSpec of splitOn(
        allActionSpecs ?? "",
        ACTION_PREF_CHAR,
        true,
      )) {
        const [name, actionArgsAndOptions] = splitOn(
          actionSpec,
          ACTION_ARGS_PREF_CHAR,
          true,
          1,
        );

        try {
          actions.push(
            await fetchAction(actionTarget, name, actionArgsAndOptions ?? ""),
          );
        } catch (err) {
          if (_.isInstanceOf(err, LisnUsageError)) {
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

  registerWidget(name, newWidget, null, {
    selector: `[class^="${clsPref}--"],[class*=" ${clsPref}--"],[data-${clsPref}]`,
  });
};

// --------------------

const TRIGGER_SEP_CHAR = ";";
const ARGS_SEP_CHAR = ",";
const OPTION_PREF_CHAR = "+";
const ACTION_PREF_CHAR = "@";
const ACTION_ARGS_PREF_CHAR = ":";

const newBaseConfigValidator: WidgetConfigValidatorFunc<TriggerConfig> = (
  element,
) => {
  return {
    id: validateString,
    once: validateBoolean,
    oneWay: validateBoolean,
    delay: validateNumber,
    doDelay: validateNumber,
    undoDelay: validateNumber,
    actOn: (key, value) =>
      _.isLiteralString(value)
        ? waitForReferenceElement(value, element).then((v) => v ?? undefined) // ugh, typescript...
        : undefined,
  };
};

_.brandClass(Trigger, "Trigger");
