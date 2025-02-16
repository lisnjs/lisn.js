/**
 * @module Actions
 *
 * @categoryDescription Controlling openables
 * {@link Open} opens or closes the {@link Openable} widget setup for the given
 * element.
 */
import { Action } from "../actions/action.cjs";
/**
 * Opens or closes the {@link Openable} widget setup for the given element.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "open".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div class="lisn-modal" data-lisn-on-view="@open +reference=top:50%"></div>
 * ```
 *
 * @category Controlling openables
 */
export declare class Open implements Action {
    /**
     * Opens the Openable widget setup for the element.
     */
    readonly do: () => Promise<void>;
    /**
     * Closes the Openable widget setup for the element.
     */
    readonly undo: () => Promise<void>;
    /**
     * Toggles the Openable widget setup for the element.
     */
    readonly toggle: () => Promise<void>;
    static register(): void;
    constructor(element: Element);
}
//# sourceMappingURL=open.d.ts.map