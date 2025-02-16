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
import { Action } from "../actions/action.cjs";
import { Widget, WidgetConfigValidator } from "../widgets/widget.cjs";
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
export declare class Trigger extends Widget {
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
    static get(element: Element, id: string): Trigger | null;
    static register(): void;
    /**
     * If no actions are supplied, nothing is done.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the config is invalid.
     */
    constructor(element: Element, actions: Action[], config?: TriggerConfig);
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
export type TriggerCreateFn<Config extends TriggerConfig> = (element: Element, args: string[], actions: Action[], config: Config) => Trigger | Promise<Trigger>;
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
export declare const registerTrigger: <Config extends TriggerConfig = TriggerConfig>(name: string, newTrigger: TriggerCreateFn<Config>, configValidator?: null | WidgetConfigValidator<Config>) => void;
//# sourceMappingURL=trigger.d.ts.map