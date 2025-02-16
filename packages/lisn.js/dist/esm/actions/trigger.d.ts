/**
 * @module Actions
 *
 * @categoryDescription Controlling triggers
 * {@link Enable} and {@link Disable} enable or disable a list of triggers
 * defined on the given element.
 *
 * {@link Run} runs or reverses a list of triggers defined on the given
 * element.
 */
import { Action } from "../actions/action.js";
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
export declare class Enable implements Action {
    /**
     * Enables the triggers with IDs given to the constructor.
     */
    readonly do: () => Promise<void>;
    /**
     * Disables the triggers with IDs given to the constructor.
     */
    readonly undo: () => Promise<void>;
    /**
     * Toggles the enabled state on each trigger given to the constructor.
     */
    readonly toggle: () => Promise<void>;
    static register(): void;
    constructor(element: Element, ...ids: string[]);
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
export declare class Disable implements Action {
    /**
     * Disables the triggers with IDs given to the constructor.
     */
    readonly do: () => Promise<void>;
    /**
     * Enables the triggers with IDs given to the constructor.
     */
    readonly undo: () => Promise<void>;
    /**
     * Toggles the enabled state on each trigger given to the constructor.
     */
    readonly toggle: () => Promise<void>;
    static register(): void;
    constructor(element: Element, ...ids: string[]);
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
export declare class Run implements Action {
    /**
     * Runs the triggers with IDs given to the constructor.
     */
    readonly do: () => Promise<void>;
    /**
     * Reverses the triggers with IDs given to the constructor.
     */
    readonly undo: () => Promise<void>;
    /**
     * Toggles the triggers with IDs given to the constructor.
     */
    readonly toggle: () => Promise<void>;
    static register(): void;
    constructor(element: Element, ...ids: string[]);
}
//# sourceMappingURL=trigger.d.ts.map