/**
 * @module Actions
 */
import { WidgetConfigValidator } from "../widgets/widget.cjs";
/**
 * @interface
 */
export type Action = {
    do: () => void;
    undo: () => void;
    toggle: () => void;
};
export type ActionCreateFn<Config extends Record<string, unknown>> = (element: Element, args: string[], config?: Config) => Action | Promise<Action>;
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
export declare const registerAction: <Config extends Record<string, unknown>>(name: string, newAction: ActionCreateFn<Config>, configValidator?: null | WidgetConfigValidator<Config>) => void;
/**
 * Returns an {@link Action} registered under the given name and instantiated
 * with the given element and arguments and options parsed from the given string.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the given spec is not valid.
 */
export declare const fetchAction: (element: Element, name: string, argsAndOptions?: string) => Promise<Action>;
//# sourceMappingURL=action.d.ts.map