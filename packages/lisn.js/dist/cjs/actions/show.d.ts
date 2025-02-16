/**
 * @module Actions
 */
import { Action } from "../actions/action.cjs";
/**
 * Shows or hides the given element with a smooth fading transition.
 *
 * **IMPORTANT:** When constructed, it will hide the element as a form of
 * initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "show".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <button id="btn">Show/hide</button>
 * <div data-lisn-on-click="@show +target=#btn"></div>
 * ```
 *
 * @category Showing/hiding elements
 */
export declare class Show implements Action {
    /**
     * Shows the element with a smooth fade in transition.
     */
    readonly do: () => Promise<void>;
    /**
     * Hides the element with a smooth fade out transition.
     */
    readonly undo: () => Promise<void>;
    /**
     * Shows the element if it is hidden, hides it otherwise.
     */
    readonly toggle: () => Promise<void>;
    static register(): void;
    constructor(element: Element);
}
/**
 * Hides or shows the given element with a smooth fading transition.
 *
 * **IMPORTANT:** When constructed, it will remove any `lisn-hide` class from
 * the element as a form of initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "hide".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <button id="btn">Show/hide</button>
 * <div data-lisn-on-click="@hide +target=#btn"></div>
 * ```
 *
 * @category Showing/hiding elements
 */
export declare class Hide implements Action {
    /**
     * Hides the element with a smooth fade out transition.
     */
    readonly do: () => Promise<void>;
    /**
     * Shows the element with a smooth fade in transition.
     */
    readonly undo: () => Promise<void>;
    /**
     * Shows the element if it is hidden, hides it otherwise.
     */
    readonly toggle: () => Promise<void>;
    static register(): void;
    constructor(element: Element);
}
//# sourceMappingURL=show.d.ts.map