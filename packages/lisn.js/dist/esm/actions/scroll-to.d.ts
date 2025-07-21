/**
 * @module Actions
 *
 * @categoryDescription Scrolling
 * {@link ScrollTo} scrolls to the given element or to the previous scroll
 * position.
 */
import { CoordinateOffset } from "../globals/types.js";
import { Action } from "../actions/action.js";
/**
 * Scrolls to the given element or to the previous scroll position.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "scroll-to".
 * - Accepted string arguments: none
 * - Accepted options:
 *   - `offsetX`: A number.
 *   - `offsetY`: A number.
 *   - `duration`: A number.
 *   - `scrollable`: A string element specification for an element (see
 *     {@link Utils.getReferenceElement | getReferenceElement}). Note that,
 *     unless it's a DOM ID, the specification is parsed relative to the
 *     element being acted on and not the element the trigger is defined on (in
 *     case you've used the `act-on` trigger option).
 *
 * **NOTE:** Do not place a + sign in front of the offset values (just omit it
 * if you want a positive offset). Otherwise it will be interpreted as a
 * trigger option.
 *
 * @example
 * When the user clicks the button, scroll the main scrolling element to
 * element's position:
 *
 * ```html
 * <button id="btn">Scroll to/back</button>
 * <div data-lisn-on-click="@scroll-to +target=#btn"></div>
 * ```
 *
 * @example
 * When the user clicks the button, scroll the main scrolling element to
 * element's position +10px down:
 *
 * ```html
 * <button id="btn">Scroll to/back</button>
 * <div data-lisn-on-click="@scroll-to: offsetY=10 +target=#btn"></div>
 * ```
 *
 * @example
 * When the user clicks the button, scroll the main scrolling element to
 * element's position 10px _down_ and 50px _left_, with a duration of 200ms:
 *
 * ```html
 * <button id="btn">Scroll to/back</button>
 * <div data-lisn-on-click="@scroll-to: offsetY=10, offsetX=-50, duration=200 +target=#btn"></div>
 * ```
 *
 * @example
 * When the user clicks the button, scroll the closest parent element with
 * class `scrollable` to the element's position:
 *
 * ```html
 * <button id="btn">Scroll to/back</button>
 * <div class="scrollable">
 *   <div data-lisn-on-click="@scroll-to: scrollable=this.scrollable +target=#btn"></div>
 * </div>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <button id="btn">Scroll to/back</button>
 * <div data-lisn-ref="scrollable">
 *   <div data-lisn-on-click="@scroll-to: scrollable=this-scrollable +target=#btn"></div>
 * </div>
 * ```
 *
 * @category Scrolling
 */
export declare class ScrollTo implements Action {
    /**
     * Scrolls the main scrolling element to the element's position.
     */
    readonly do: () => Promise<void>;
    /**
     * Scrolls the main scrolling element to the last scroll position before the
     * action was {@link do}ne. If the action had never been done, does nothing.
     */
    readonly undo: () => Promise<void>;
    /**
     * Scrolls the main scrolling element to the element's position, if it's not
     * already there, or otherwise scrolls the main scrolling element to the
     * previous saved scroll position.
     */
    readonly toggle: () => Promise<void>;
    static register(): void;
    constructor(element: Element, config?: ScrollToConfig);
}
/**
 * @interface
 * @category Scrolling
 */
export type ScrollToConfig = {
    /**
     * See {@link Utils.ScrollToOptions.offset}.
     *
     * @defaultValue undefined // none
     */
    offset?: CoordinateOffset;
    /**
     * The duration in milliseconds of the scroll animation.
     *
     * @defaultValue {@link ScrollWatcher} default
     */
    duration?: number;
    /**
     * The element that should be scrolled.
     *
     * @defaultValue {@link ScrollWatcher} default
     */
    scrollable?: Element;
};
//# sourceMappingURL=scroll-to.d.ts.map