/**
 * @module Actions
 */
import { Action } from "../actions/action.js";
/**
 * Plays or reverses all animations on the given element.
 *
 * It works with CSS or Web Animations.
 *
 * **IMPORTANT:** When constructed, it resets and pauses the animations as a
 * form of initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "animate".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div data-lisn-on-view="@animate"></div>
 * ```
 *
 * @category Animation
 */
export declare class Animate implements Action {
    /**
     * (Re)plays the animations forwards.
     */
    readonly do: () => Promise<void>;
    /**
     * (Re)plays the animations backwards.
     */
    readonly undo: () => Promise<void>;
    /**
     * Reverses the animations from its current direction.
     */
    readonly toggle: () => Promise<void>;
    static register(): void;
    constructor(element: Element);
}
//# sourceMappingURL=animate.d.ts.map