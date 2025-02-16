/**
 * @module Actions
 *
 * @categoryDescription Controlling pagers
 * {@link NextPage} and {@link PrevPage} advance or reverse the {@link Pager}
 * widget setup for the given element.
 *
 * {@link GoToPage} sets the {@link Pager} to the given page or toggles to the
 * last saved one.
 *
 * {@link EnablePage} and {@link DisablePage} enable or disable the given page
 * of the {@link Pager} widget setup for the given element.
 */
import { Action } from "../actions/action.cjs";
/**
 * Advances or reverses the {@link Pager} widget setup for the given element.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "next-page".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div class="lisn-pager" data-lisn-on-click="@next-page +target=#myNextButton"></div>
 * <button id="myNextButton"></button>
 * ```
 *
 * @category Controlling pagers
 */
export declare class NextPage implements Action {
    /**
     * Advances the pager by one page.
     */
    readonly do: () => Promise<void>;
    /**
     * Reverses the pager by one page.
     */
    readonly undo: () => Promise<void>;
    /**
     * Undoes the last action: reverses the pager if {@link do} was last called
     * or advances it otherwise.
     */
    readonly toggle: () => Promise<void>;
    static register(): void;
    constructor(element: Element);
}
/**
 * Reverses or advances the {@link Pager} widget setup for the given element.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "prev-page".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div class="lisn-pager" data-lisn-on-click="@prev-page +target=#myPrevButton"></div>
 * <button id="myPrevButton"></button>
 * ```
 *
 * @category Controlling pagers
 */
export declare class PrevPage implements Action {
    /**
     * Reverses the pager by one page.
     */
    readonly do: () => Promise<void>;
    /**
     * Advances the pager by one page.
     */
    readonly undo: () => Promise<void>;
    /**
     * Undoes the last action: advances the pager if {@link do} was last called
     * or reverses it otherwise.
     */
    readonly toggle: () => Promise<void>;
    static register(): void;
    constructor(element: Element);
}
/**
 * Goes to a given page, or to the last one beforehand, of the {@link Pager}
 * widget setup for the given element.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "go-to-page".
 * - Accepted string arguments: the number of the target page
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div class="lisn-pager" data-lisn-on-click="@go-to-page:2 +target=#myGoToButton"></div>
 * <button id="myGoToButton"></button>
 * ```
 *
 * @category Controlling pagers
 */
export declare class GoToPage implements Action {
    /**
     * Goes to the page number given to the constructor. Numbers start at 1.
     */
    readonly do: () => Promise<void>;
    /**
     * Goes to the last saved page number before the action was {@link do}ne. If
     * the action had never been done, does nothing.
     */
    readonly undo: () => Promise<void>;
    /**
     * Goes to the page number given to the constructor, or if already at this
     * number, goes to the last saved page if any. Numbers start at 1.
     */
    readonly toggle: () => Promise<void>;
    static register(): void;
    constructor(element: Element, pageNum: number);
}
/**
 * Enables or disables the given page of the {@link Pager} widget setup for the
 * given element.
 *
 * **IMPORTANT:** When constructed, it disables the given page as a form of
 * initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "enable-page".
 * - Accepted string arguments: the number of the target page
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div class="lisn-pager" data-lisn-on-click="@enable-page:2 +target=#myEnableButton"></div>
 * <button id="myEnableButton"></button>
 * ```
 *
 * @category Controlling pagers
 */
export declare class EnablePage implements Action {
    /**
     * Enables the page number given to the constructor. Numbers start at 1.
     */
    readonly do: () => Promise<void>;
    /**
     * Disables the page number given to the constructor. Numbers start at 1.
     */
    readonly undo: () => Promise<void>;
    /**
     * Enables the page number given to the constructor, if it is disabled,
     * otherwise disables it. Numbers start at 1.
     */
    readonly toggle: () => Promise<void>;
    static register(): void;
    constructor(element: Element, pageNum: number);
}
/**
 * Disables or enables the given page of the {@link Pager} widget setup for the
 * given element.
 *
 * **IMPORTANT:** When constructed, it enables the given page as a form of
 * initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "disable-page".
 * - Accepted string arguments: the number of the target page
 * - Accepted options: none
 *
 * @example
 * ```html
 * <button id="myDisableButton"></button>
 * <div class="lisn-pager" data-lisn-on-click="@disable-page:2 +target=#myDisableButton"></div>
 * ```
 *
 * @category Controlling pagers
 */
export declare class DisablePage implements Action {
    /**
     * Disables the page number given to the constructor. Numbers start at 1.
     */
    readonly do: () => Promise<void>;
    /**
     * Enables the page number given to the constructor. Numbers start at 1.
     */
    readonly undo: () => Promise<void>;
    /**
     * Disables the page number given to the constructor, if it is enabled,
     * otherwise enables it. Numbers start at 1.
     */
    readonly toggle: () => Promise<void>;
    static register(): void;
    constructor(element: Element, pageNum: number);
}
//# sourceMappingURL=pager.d.ts.map