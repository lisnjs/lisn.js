/**
 * @module Widgets
 */
import { GestureDevice, CommaSeparatedStr } from "../globals/types.cjs";
import { Widget, WidgetHandler } from "../widgets/widget.cjs";
/**
 * Configures the given element as a {@link Pager} widget.
 *
 * The Pager widget sets up the elements that make up its pages to be overlayed
 * on top of each other with only one of them visible at a time. When a user
 * performs a scroll-like gesture (see {@link GestureWatcher}), the pages are
 * flicked through: gestures, whose direction is down (or left) result in the
 * next page being shown, otherwise the previous.
 *
 * The widget should have more than one page.
 *
 * Optionally, the widget can have a set of "switch" elements and a set of
 * "toggle" elements which correspond one-to-one to each page. Switches go to
 * the given page and toggles toggle the enabled/disabled state of the page.
 *
 * **IMPORTANT:** Unless the {@link PagerStyle.style} is set to "carousel", the
 * page elements will be positioned absolutely, and therefore the pager likely
 * needs to have an explicit height. If you enable
 * {@link PagerConfig.fullscreen}, then the element will get `height: 100vh`
 * set. Otherwise, you need to set its height in your CSS.
 *
 * **IMPORTANT:** You should not instantiate more than one {@link Pager}
 * widget on a given element. Use {@link Pager.get} to get an existing
 * instance if any. If there is already a widget instance, it will be destroyed!
 *
 * -----
 *
 * You can use the following dynamic attributes or CSS properties in your
 * stylesheet:
 *
 * The following dynamic attributes are set on the pager element:
 * - `data-lisn-orientation`: `"horizontal"` or `"vertical"`
 * - `data-lisn-use-parallax`: `"true"` or `"false"`
 * - `data-lisn-total-pages`: the number of pages
 * - `data-lisn-visible-pages`: **for carousel only** the number of visible pages;
 *   can be fractional if {@link PagerConfig.peek} is enabled
 * - `data-lisn-current-page`: the current page number
 * - `data-lisn-current-page-is-last`: `"true"` or `"false"`
 * - `data-lisn-current-page-is-first-enabled`: `"true"` or `"false"`
 * - `data-lisn-current-page-is-last-enabled`: `"true"` or `"false"`
 *
 * The following dynamic CSS properties are also set on the pager element's style:
 * - `--lisn-js--total-pages`: the number of pages
 * - `--lisn-js--visible-pages`: **for carousel only** the number of visible pages
 * - `--lisn-js--current-page`: the current page number
 *
 * The following dynamic attributes are set on each page, toggle or switch element:
 * - `data-lisn-page-state`: `"current"`, `"next"`, `"covered"` or `"disabled"`
 * - `data-lisn-page-number`: the corresponding page's number
 *
 * The following analogous dynamic CSS properties are also set on each page,
 * toggle or switch element's style:
 * - `--lisn-js--page-number`: the corresponding page's number
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-pager` class or `data-lisn-pager` attribute set on the container
 *   element that constitutes the pager
 * - `lisn-pager-page` class or `data-lisn-pager-page` attribute set on
 *   elements that should act as the pages.
 * - `lisn-pager-toggle` class or `data-lisn-pager-toggle` attribute set on
 *   elements that should act as the toggles.
 * - `lisn-pager-switch` class or `data-lisn-pager-switch` attribute set on
 *   elements that should act as the switches.
 *
 * When using auto-widgets, the elements that will be used as pages are
 * discovered in the following way:
 * 1. The top-level element that constitutes the widget is searched for any
 *    elements that contain the `lisn-pager-page` class or
 *    `data-lisn-pager-page` attribute. They do not have to be immediate
 *    children of the root element, but they **should** all be siblings.
 * 2. If there are no such elements, all of the immediate children of the
 *    widget element except any `script` or `style` elements are taken as the
 *    pages.
 *
 * The toggles and switches are descendants of the top-level element that
 * constitutes the widget, that contain the
 * `lisn-pager-toggle`/`lisn-pager-switch` class or `data-lisn-pager-toggle`/
 * `data-lisn-pager-switch` attribute. They do not have to be immediate
 * children of the root element.
 *
 * See below examples for what values you can use set for the data attributes
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This defines a simple pager with default settings.
 *
 * ```html
 * <div class="lisn-pager">
 *   <div>Vertical: Page 1</div>
 *   <div>Vertical: Page 2</div>
 *   <div>Vertical: Page 3</div>
 *   <div>Vertical: Page 4</div>
 * </div>
 * ```
 *
 * @example
 * As above but with all settings explicitly set to their default (`false`).
 *
 * ```html
 * <div data-lisn-pager="fullscreen=false | parallax=false | horizontal=false">
 *   <div>Vertical: Page 1</div>
 *   <div>Vertical: Page 2</div>
 *   <div>Vertical: Page 3</div>
 *   <div>Vertical: Page 4</div>
 * </div>
 * ```
 *
 * @example
 * This defines a pager with custom settings.
 *
 * ```html
 * <div data-lisn-pager="fullscreen | parallax | horizontal | gestures=false">
 *   <div>Horizontal: Page 1</div>
 *   <div>Horizontal: Page 2</div>
 *   <div>Horizontal: Page 3</div>
 *   <div>Horizontal: Page 4</div>
 * </div>
 * ```
 *
 * @example
 * This defines a pager with custom settings, as well as toggle and switch buttons.
 *
 * ```html
 * <div data-lisn-pager="fullscreen | parallax | horizontal | gestures=false">
 *   <div>
 *     <div data-lisn-pager-page>Horizontal: Page 1</div>
 *     <div data-lisn-pager-page>Horizontal: Page 2</div>
 *     <div data-lisn-pager-page>Horizontal: Page 3</div>
 *     <div data-lisn-pager-page>Horizontal: Page 4</div>
 *   </div>
 *
 *   <div>
 *     <button data-lisn-pager-toggle>Toggle page 1</button>
 *     <button data-lisn-pager-toggle>Toggle page 2</button>
 *     <button data-lisn-pager-toggle>Toggle page 3</button>
 *     <button data-lisn-pager-toggle>Toggle page 4</button>
 *   </div>
 *
 *   <div>
 *     <button data-lisn-pager-switch>Go to page 1</button>
 *     <button data-lisn-pager-switch>Go to page 2</button>
 *     <button data-lisn-pager-switch>Go to page 3</button>
 *     <button data-lisn-pager-switch>Go to page 4</button>
 *   </div>
 * </div>
 * ```
 */
export declare class Pager extends Widget {
    /**
     * Advances the widget's page by 1. If the current page is the last one,
     * nothing is done, unless {@link PagerConfig.fullscreen} is true in which
     * case the pager's scrollable ancestor will be scrolled down/right
     * (depending on the gesture direction).
     */
    readonly nextPage: () => Promise<void>;
    /**
     * Reverses the widget's page by 1. If the current page is the first one,
     * nothing is done, unless {@link PagerConfig.fullscreen} is true in which
     * case the pager's scrollable ancestor will be scrolled up/left
     * (depending on the gesture direction).
     */
    readonly prevPage: () => Promise<void>;
    /**
     * Advances the widget to the given page. Note that page numbers start at 1.
     *
     * If this page is disabled, nothing is done.
     */
    readonly goToPage: (pageNum: number) => Promise<void>;
    /**
     * Disables the given page number. Note that page numbers start at 1.
     *
     * The page will be skipped during transitioning to previous/next.
     *
     * If the page is the current one, then the current page will be switched to
     * the previous one (that's not disabled), or if this is the first enabled
     * page, then it will switch to the next one that's not disabled.
     *
     * If this is the last enabled page, nothing is done.
     */
    readonly disablePage: (pageNum: number) => Promise<void>;
    /**
     * Re-enables the given page number. Note that page numbers start at 1.
     */
    readonly enablePage: (pageNum: number) => Promise<void>;
    /**
     * Re-enables the given page if it is disabled, otherwise disables it. Note
     * that page numbers start at 1.
     */
    readonly togglePage: (pageNum: number) => Promise<void>;
    /**
     * Returns true if the given page number is disabled. Note that page
     * numbers start at 1.
     */
    readonly isPageDisabled: (pageNum: number) => boolean;
    /**
     * Returns the current page.
     */
    readonly getCurrentPage: () => Element;
    /**
     * Returns the previous page, before the last transition.
     *
     * If there has been no change of page, returns the first page, same as
     * {@link getCurrentPageNum}.
     */
    readonly getPreviousPage: () => Element;
    /**
     * Returns the number of the current page. Note that numbers start at 1.
     */
    readonly getCurrentPageNum: () => number;
    /**
     * Returns the number of the previous page, before the last transition. Note
     * that numbers start at 1.
     *
     * If there has been no change of page, returns the number of the first page,
     * same as {@link getCurrentPageNum}.
     */
    readonly getPreviousPageNum: () => number;
    /**
     * The given handler will be called whenever there is a change of page. It
     * will be called after the current page number is updated internally (so
     * {@link getPreviousPageNum} and {@link getCurrentPageNum} will return the
     * updated numbers), but before the page transition styles are updated.
     *
     * If the handler returns a promise, it will be awaited upon.
     */
    readonly onTransition: (handler: WidgetHandler) => void;
    /**
     * Returns the page elements.
     */
    readonly getPages: () => Element[];
    /**
     * Returns the toggle elements if any.
     */
    readonly getToggles: () => Element[];
    /**
     * Returns the switch elements if any.
     */
    readonly getSwitches: () => Element[];
    static get(element: Element): Pager | null;
    static register(): void;
    /**
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If there are less than 2 pages given or found, or if any
     *                page is not a descendant of the main pager element.
     */
    constructor(element: Element, config?: PagerConfig);
}
/**
 * @interface
 */
export type PagerConfig = {
    /**
     * The elements that will make up the pages.
     *
     * They do not have to be immediate children of the root element, but they
     * should all be siblings.
     *
     * The widget should have more than one page.
     *
     * If this is not specified, then
     * 1. The top-level element that constitutes the widget is searched for any
     *    elements that contain the `lisn-pager-page` class or the
     *    `data-lisn-pager-page` attribute, and these are used as pages.
     * 2. If there are no such elements, all of the immediate children of the
     *    widget element (other than `script` and `style` elements) are taken as
     *    the pages.
     *
     * **IMPORTANT:** Unless the {@link style} is set to "carousel", the page
     * elements will be positioned absolutely, and therefore the pager likely
     * needs to have an explicit height. If you enable {@link fullscreen}, then
     * the element will get `height: 100vh` set. Otherwise, you need to set its
     * height in your CSS.
     *
     * @defaultValue undefined
     */
    pages?: Element[];
    /**
     * If given, these elements should match one-to-one the page elements.
     *
     * Each toggle element will be assigned a click listener that toggles the
     * enabled/disabled state of the page.
     *
     * If this is not specified, then the top-level element that constitutes the
     * widget is searched for any elements that contain the `lisn-pager-toggle`
     * class or the `data-lisn-pager-toggle` attribute, and these are used as
     * toggles.
     *
     * @defaultValue undefined
     */
    toggles?: Element[];
    /**
     * If given, these elements should match one-to-one the page elements.
     *
     * Each toggle element will be assigned a click listener that switches the
     * pager to the page.
     *
     * If this is not specified, then the top-level element that constitutes the
     * widget is searched for any elements that contain the `lisn-pager-switch`
     * class or the `data-lisn-pager-switch` attribute, and these are used as
     * switches.
     *
     * @defaultValue undefined
     */
    switches?: Element[];
    /**
     * This element will be assigned a click listener that goes to the next page.
     *
     * If this is not given, then the top-level element that constitutes the
     * widget is searched for the first element that contains the
     * `lisn-pager-next-switch` class or the `data-lisn-pager-next-switch`
     * attribute, and this is used.
     *
     * @defaultValue undefined
     */
    nextSwitch?: Element;
    /**
     * This element will be assigned a click listener that goes to the previous
     * page.
     *
     * If this is not given, then the top-level element that constitutes the
     * widget is searched for the first element that contains the
     * `lisn-pager-prev-switch` class or the `data-lisn-pager-prev-switch`
     * attribute, and this is used.
     *
     * @defaultValue undefined
     */
    prevSwitch?: Element;
    /**
     * Set the initial page number.
     *
     * @defaultValue 1
     */
    initialPage?: number;
    /**
     * Set the style of the widget. This determines the basic CSS applied.
     *
     * When importing the stylesheets in your project, if not using the full
     * stylesheet (lisn.css) you can import either pager.css which contains all
     * three pager styles, or only `pager-<style>.css`.
     *
     * **NOTE:** The base css only includes the minimum required for positioning
     * and transitioning pages. The switches and toggles are intentionally not
     * styled for flexibility. You should style those in your CSS.
     *
     * **IMPORTANT:** Unless the {@link style} is set to "carousel", the page
     * elements will be positioned absolutely, and therefore the pager likely
     * needs to have an explicit height. If you enable {@link fullscreen}, then
     * the element will get `height: 100vh` set. Otherwise, you need to set its
     * height in your CSS.
     *
     * @defaultValue "slider"
     */
    style?: "slider" | "carousel" | "tabs";
    /**
     * Only relevant is {@link style} is "carousel".
     *
     * The *minimum* page height (or width in {@link horizontal} mode) in pixels.
     * This will determine the number of visible slides at any one width of the
     * pager. Pages will still grow to fill the size of the carousel itself.
     *
     * @defaultValue 300
     */
    pageSize?: number;
    /**
     * Only relevant is {@link style} is "carousel".
     *
     * Whether to show a bit of the upcoming and/or previous pages that are
     * hidden when not all fit.
     *
     * @defaultValue false
     */
    peek?: boolean;
    /**
     * If true, then:
     * - if the pager {@link style} is "slider", the pager's height will be set
     *   to the viewport height (100vh)
     * - the pager's scrolling ancestor will be scrolled to the top of the pager
     *   when 30% of it is in view
     * - scrolling beyond the first or last page will initiate scroll up/left or
     *   down/right the pager's scrolling ancestor in order to allow "leaving"
     *   the pager
     *
     * Note that except in "carousel" {@link style} the pager's pages will be
     * positioned absolutely, and so if you do _not_ enable this option, you will
     * need to manually set the height of the page parent element via CSS.
     *
     * @defaultValue false
     */
    fullscreen?: boolean;
    /**
     * Only relevant is {@link style} is "slider" (default) or "carousel".
     *
     * Use a parallax effect for switching pages.
     *
     * @defaultValue false
     */
    parallax?: boolean;
    /**
     * Only relevant is {@link style} is "slider" (default) or "carousel".
     *
     * Transition pages sideways instead of vertically.
     *
     * @defaultValue false
     */
    horizontal?: boolean;
    /**
     * Transition pages upon user scroll-like and drag-like gestures via the
     * given {@link GestureDevice}s. If set to true, then gestures using all
     * device types are supported.
     *
     * Note that drag gesture is only supported by the "pointer" device and also
     * the "pointer" device only supports drag gestures, so if you want to
     * disable drag gestures, simply pass "wheel,key,touch" as this option.
     *
     * @defaultValue true
     */
    useGestures?: boolean | CommaSeparatedStr<GestureDevice> | GestureDevice[];
    /**
     * If true, then pages will be advanced backwards/forwards regardless if the
     * gesture direction is horizontal or vertical.
     *
     * If false then, a gesture will go to the next page only if its direction is
     * down if {@link horizontal} is false/right if {@link horizontal} is true,
     * and to the previous page only if the gesture direction is up if
     * {@link horizontal} is false/left if {@link horizontal} is true.
     *
     * **IMPORTANT:**
     * If {@link fullscreen}, {@link preventDefault} and
     * {@link alignGestureDirection} are all true, then the pager's scrollable
     * parent must be scrollable in the same direction as the pager orientation,
     * otherwise automatic scroll beyond the last/first page won't work.
     *
     * @defaultValue false
     */
    alignGestureDirection?: boolean;
    /**
     * Whether to prevent the default action for events that would result in
     * gestures.
     *
     * **NOTE:**
     * If true (default), then all events that originate from a device given in
     * {@link useGestures} and that could result in a gesture will be prevented
     * regardless of their direction and whether {@link alignGestureDirection} is
     * true.
     *
     * @defaultValue true
     */
    preventDefault?: boolean;
};
//# sourceMappingURL=pager.d.ts.map