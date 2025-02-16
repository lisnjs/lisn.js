/**
 * @module Actions
 *
 * @categoryDescription Animation
 * {@link AnimatePlay} and {@link AnimatePause} resume or pause all animations
 * on the given element. They work with CSS or Web Animations.
 *
 * {@link Actions.Animate | Animate} plays or reverses all animations on the
 * given element. It works with CSS or Web Animations.
 */
import { Action } from "../actions/action.cjs";
/**
 * Resumes or pauses all animations on the given element.
 *
 * It works with CSS or Web Animations.
 *
 * **IMPORTANT:** When constructed, it resets and pauses the animations as a
 * form of initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "animate-play".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <button id="btn">Play/pause</button>
 * <div data-lisn-on-click="@animate-play +target=#btn"></div>
 * ```
 *
 * @category Animation
 */
export declare class AnimatePlay implements Action {
    /**
     * Resumes the animations without resetting them.
     */
    readonly do: () => Promise<void>;
    /**
     * Pauses the animations without resetting them.
     */
    readonly undo: () => Promise<void>;
    /**
     * Resumes the animations if paused, otherwise pauses them.
     */
    readonly toggle: () => Promise<void>;
    static register(): void;
    constructor(element: Element);
}
/**
 * Pauses or resumes all animations on the given element.
 *
 * It works with CSS or Web Animations.
 *
 * **IMPORTANT:** When constructed, it plays the animations as a form of
 * initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "animate-pause".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <button id="btn">Play/pause</button>
 * <div data-lisn-on-click="@animate-pause +target=#btn"></div>
 * ```
 *
 * @category Animation
 */
export declare class AnimatePause implements Action {
    /**
     * Pauses the animations without resetting them.
     */
    readonly do: () => Promise<void>;
    /**
     * Resumes the animations without resetting them.
     */
    readonly undo: () => Promise<void>;
    /**
     * Resumes the animations if paused, otherwise pauses them.
     */
    readonly toggle: () => Promise<void>;
    static register(): void;
    constructor(element: Element);
}
//# sourceMappingURL=animate-play.d.ts.map