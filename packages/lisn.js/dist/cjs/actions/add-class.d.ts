/**
 * @module Actions
 *
 * @categoryDescription Adding/removing class
 * {@link AddClass} and {@link RemoveClass} add or remove a list of CSS classes
 * to/from the given element.
 */
import { Action } from "../actions/action.cjs";
/**
 * Adds or removes a list of CSS classes to/from the given element.
 *
 * **IMPORTANT:** When constructed, it removes all given classes from the
 * element as a form of initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "add-class".
 * - Accepted string arguments: one or more CSS classes
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div data-lisn-on-view="@add-class: clsA, clsB"></div>
 * ```
 *
 * @category Adding/removing class
 */
export declare class AddClass implements Action {
    /**
     * Adds the classes given to the constructor.
     */
    readonly do: () => Promise<void>;
    /**
     * Removes the classes given to the constructor.
     */
    readonly undo: () => Promise<void>;
    /**
     * Toggles each class given to the constructor.
     */
    readonly toggle: () => Promise<void>;
    static register(): void;
    constructor(element: Element, ...classNames: string[]);
}
/**
 * Removes or adds a list of CSS classes to/from the given element.
 *
 * **IMPORTANT:** When constructed, it adds all given classes from the element
 * as a form of initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "remove-class".
 * - Accepted string arguments: one or more CSS classes
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div data-lisn-on-view="@remove-class: clsA, clsB"></div>
 * ```
 *
 * @category Adding/removing class
 */
export declare class RemoveClass implements Action {
    /**
     * Removes the classes given to the constructor.
     */
    readonly do: () => Promise<void>;
    /**
     * Adds the classes given to the constructor.
     */
    readonly undo: () => Promise<void>;
    /**
     * Toggles each class given to the constructor.
     */
    readonly toggle: () => Promise<void>;
    static register(): void;
    constructor(element: Element, ...classNames: string[]);
}
//# sourceMappingURL=add-class.d.ts.map