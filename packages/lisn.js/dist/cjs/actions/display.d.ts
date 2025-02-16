/**
 * @module Actions
 *
 * @categoryDescription Showing/hiding elements
 * {@link Display} and {@link Undisplay} displays or "undisplays" (display:
 * none) the given element.
 *
 * {@link Actions.Show | Show} and {@link Actions.Hide | Hide} show or hide the
 * given element with a smooth fading transition.
 */
import { Action } from "../actions/action.cjs";
/**
 * Displays or "undisplays" (display: none) the given element.
 *
 * **IMPORTANT:** When constructed, it adds `display: none` to the element as a
 * form of initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "display".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <button id="btn">Display/undisplay</button>
 * <div data-lisn-on-click="@display +target=#btn"></div>
 * ```
 *
 * @category Showing/hiding elements
 */
export declare class Display implements Action {
    /**
     * It reverts the element to its original `display` property.
     */
    readonly do: () => Promise<void>;
    /**
     * Sets `display: none` on the element.
     */
    readonly undo: () => Promise<void>;
    /**
     * Displays the element if it's "undisplayed", otherwise "undisplays" it.
     */
    readonly toggle: () => Promise<void>;
    static register(): void;
    constructor(element: Element);
}
/**
 * "Undisplays" (display: none) or displays the given element.
 *
 * **IMPORTANT:** When constructed, it removes the `lisn-undisplay` class if
 * present on the element as a form of initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "undisplay".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <button id="btn">Display/undisplay</button>
 * <div data-lisn-on-click="@undisplay +target=#btn"></div>
 * ```
 *
 * @category Showing/hiding elements
 */
export declare class Undisplay implements Action {
    /**
     * Sets `display: none` on the element.
     */
    readonly do: () => Promise<void>;
    /**
     * It reverts the element to its original `display` property.
     */
    readonly undo: () => Promise<void>;
    /**
     * Displays the element if it's "undisplayed", otherwise "undisplays" it.
     */
    readonly toggle: () => Promise<void>;
    static register(): void;
    constructor(element: Element);
}
//# sourceMappingURL=display.d.ts.map