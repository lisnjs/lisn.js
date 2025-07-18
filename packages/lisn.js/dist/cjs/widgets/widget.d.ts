/**
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
import { CallbackHandler, Callback } from "../modules/callback.cjs";
export declare class Widget {
    /**
     * Disables the functionality of the widget. What this means is specific to
     * each widget.
     */
    readonly disable: () => Promise<void>;
    /**
     * Re-enables the functionality of the widget. What this means is specific to
     * each widget.
     */
    readonly enable: () => Promise<void>;
    /**
     * Re-enables the widget if disabled, otherwise disables it.
     */
    readonly toggleEnable: () => Promise<void>;
    /**
     * The given handler will be called when the widget is disabled.
     */
    readonly onDisable: (handler: WidgetHandler) => void;
    /**
     * The given handler will be called when the widget is enabled.
     */
    readonly onEnable: (handler: WidgetHandler) => void;
    /**
     * Returns true if the widget is currently disabled.
     */
    readonly isDisabled: () => boolean;
    /**
     * Undoes all modifications to the element and returns it to its original state.
     *
     * You will need to recreate it if you want to enable its functionality again.
     */
    readonly destroy: () => Promise<void>;
    /**
     * The given handler will be called when the widget is destroyed.
     */
    readonly onDestroy: (handler: WidgetHandler) => void;
    /**
     * Returns true if the widget is destroyed.
     */
    readonly isDestroyed: () => boolean;
    /**
     * Returns the element passed to the widget constructor.
     */
    readonly getElement: () => Element;
    /**
     * Retrieve an existing widget by element and ID.
     */
    static get(element: Element, id: string): Widget | null;
    /**
     * **IMPORTANT:** If ID is given and there's already a widget with this ID on
     * this element, it will be destroyed!
     */
    constructor(element: Element, config?: {
        id?: string;
    });
}
export type WidgetCallbackArgs = [Widget];
export type WidgetCallback = Callback<WidgetCallbackArgs>;
export type WidgetHandler = WidgetCallback | CallbackHandler<WidgetCallbackArgs>;
/**
 * **NOTE:** If the function returns a widget or a list of widgets created for
 * the given element, then each one will be automatically destroyed if the
 * element is removed from the DOM.
 */
export type WidgetCreateFn<Config extends Record<string, unknown>> = (element: Element, config?: Config) => Widget | Widget[] | null | Promise<Widget | Widget[] | null>;
/**
 * @see {@link getWidgetConfig}.
 */
export type WidgetConfigValidatorObject<Config extends Record<string, unknown>> = {
    [K in keyof Config]: (key: K, v: unknown) => Config[K];
};
/**
 * @see {@link getWidgetConfig}.
 */
export type WidgetConfigAsyncValidatorObject<Config extends Record<string, unknown>> = {
    [K in keyof Config]: (key: K, v: unknown) => Config[K] | Promise<Config[K]>;
};
/**
 * @see {@link getWidgetConfig}.
 */
export type WidgetConfigValidatorFunc<Config extends Record<string, unknown>> = (element: Element) => WidgetConfigValidatorObject<Config> | WidgetConfigAsyncValidatorObject<Config>;
/**
 * @see {@link getWidgetConfig}.
 */
export type WidgetConfigValidator<Config extends Record<string, unknown>> = WidgetConfigValidatorObject<Config> | WidgetConfigValidatorFunc<Config>;
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
export declare const registerWidget: <Config extends Record<string, unknown>>(name: string, newWidget: WidgetCreateFn<Config>, configValidator?: null | WidgetConfigValidator<Config>, options?: {
    selector?: string;
    supportsMultiple?: boolean;
}) => Promise<void>;
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
export declare const getWidgetConfig: <Config extends Record<string, unknown>>(input: Record<string, unknown> | string | null | undefined, validator: WidgetConfigValidatorObject<Config>, separator?: string) => Config;
/**
 * Like {@link getWidgetConfig} but it accepts an object whose validator
 * functions may return a promise.
 */
export declare const fetchWidgetConfig: <Config extends Record<string, unknown>>(input: Record<string, unknown> | string | null | undefined, validator: WidgetConfigAsyncValidatorObject<Config>, separator?: string) => Promise<Config>;
/**
 * @ignore
 * @internal
 */
export declare const getDefaultWidgetSelector: (prefix: string) => string;
/**
 * @ignore
 * @internal
 */
export declare const fetchUniqueWidget: <W extends Widget>(name: string, element: Element, Type: {
    get: (element: Element) => W | null;
}) => Promise<W | null>;
//# sourceMappingURL=widget.d.ts.map