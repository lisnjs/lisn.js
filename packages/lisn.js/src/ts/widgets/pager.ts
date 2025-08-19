/**
 * @module Widgets
 */

import * as _ from "@lisn/_internal";

import { usageError } from "@lisn/globals/errors";

import {
  Direction,
  GestureDevice,
  CommaSeparatedStr,
} from "@lisn/globals/types";

import {
  disableInitialTransition,
  addClasses,
  removeClassesNow,
  getData,
  setData,
  setBooleanData,
  delDataNow,
  getComputedStyleProp,
  setStyleProp,
  delStylePropNow,
} from "@lisn/utils/css-alter";
import {
  waitForMeasureTime,
  waitForMutateTime,
} from "@lisn/utils/dom-optimize";
import { getVisibleContentChildren } from "@lisn/utils/dom-query";
import { addEventListenerTo, removeEventListenerFrom } from "@lisn/utils/event";
import { isValidInputDevice } from "@lisn/utils/gesture";
import { toInt } from "@lisn/utils/math";
import { toBoolean } from "@lisn/utils/misc";
import { getClosestScrollable } from "@lisn/utils/scroll";
import { formatAsString } from "@lisn/utils/text";
import {
  validateStrList,
  validateNumber,
  validateString,
  validateBoolean,
} from "@lisn/utils/validation";

import { addNewCallbackToMap, invokeHandlers } from "@lisn/modules/callback";

import {
  GestureWatcher,
  OnGestureOptions,
  GestureData,
} from "@lisn/watchers/gesture-watcher";
import { ScrollWatcher, ScrollOptions } from "@lisn/watchers/scroll-watcher";
import { SizeWatcher, SizeData } from "@lisn/watchers/size-watcher";
import { ViewWatcher } from "@lisn/watchers/view-watcher";

import {
  Widget,
  WidgetConfigValidatorObject,
  WidgetCallback,
  WidgetHandler,
  registerWidget,
  getDefaultWidgetSelector,
} from "@lisn/widgets/widget";

import debug from "@lisn/debug/debug";

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
 * **IMPORTANT:** Unless the {@link PagerConfig.style} is set to "carousel", the
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
 *   element that constitutes the pager.
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
 * As above but with all settings explicitly set.
 *
 * ```html
 * <div data-lisn-pager="initial-page=1
 *                       | style=carousel
 *                       | page-size=200
 *                       | peek
 *                       | fullscreen=false
 *                       | parallax
 *                       | horizontal=false
 *                       | use-gestures
 *                       | align-gesture-direction
 *                       | prevent-default">
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
export class Pager extends Widget {
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
   * Calls the given handler whenever there is a change of page. It will be
   * called after the current page number is updated internally (so
   * {@link getPreviousPageNum} and {@link getCurrentPageNum} will return the
   * updated numbers), but before the page transition styles are updated.
   *
   * If the handler returns a promise, it will be awaited upon.
   */
  readonly onTransition: (handler: WidgetHandler) => void;

  /**
   * Removes a previously added {@link onTransition} handler.
   *
   * @since v1.3.0
   */
  readonly offTransition: (handler: WidgetHandler) => void;

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

  static get(element: Element): Pager | null {
    const instance = super.get(element, DUMMY_ID);
    if (_.isInstanceOf(instance, Pager)) {
      return instance;
    }
    return null;
  }

  static register() {
    registerWidget(
      WIDGET_NAME,
      (element, config) => {
        if (!Pager.get(element)) {
          return new Pager(element, config);
        }
        return null;
      },
      configValidator,
    );
  }

  /**
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If there are less than 2 pages given or found, or if any
   *                page is not a descendant of the main pager element.
   */
  constructor(element: Element, config?: PagerConfig) {
    const destroyPromise = Pager.get(element)?.destroy();
    super(element, { id: DUMMY_ID });

    const pages = config?.pages || [];
    const toggles = config?.toggles || [];
    const switches = config?.switches || [];
    const nextPrevSwitch = {
      _next: config?.nextSwitch ?? null,
      _prev: config?.prevSwitch ?? null,
    };

    const pageSelector = getDefaultWidgetSelector(PREFIX_PAGE__FOR_SELECT);
    const toggleSelector = getDefaultWidgetSelector(PREFIX_TOGGLE__FOR_SELECT);
    const switchSelector = getDefaultWidgetSelector(PREFIX_SWITCH__FOR_SELECT);
    const nextSwitchSelector = getDefaultWidgetSelector(
      PREFIX_NEXT_SWITCH__FOR_SELECT,
    );
    const prevSwitchSelector = getDefaultWidgetSelector(
      PREFIX_PREV_SWITCH__FOR_SELECT,
    );

    if (!_.lengthOf(pages)) {
      pages.push(..._.querySelectorAll(element, pageSelector));

      if (!_.lengthOf(pages)) {
        pages.push(
          ...getVisibleContentChildren(element).filter(
            (e) => !e.matches(switchSelector),
          ),
        );
      }
    }

    if (!_.lengthOf(toggles)) {
      toggles.push(..._.querySelectorAll(element, toggleSelector));
    }

    if (!_.lengthOf(switches)) {
      switches.push(..._.querySelectorAll(element, switchSelector));
    }

    if (!nextPrevSwitch._next) {
      nextPrevSwitch._next = _.querySelector(element, nextSwitchSelector);
    }

    if (!nextPrevSwitch._prev) {
      nextPrevSwitch._prev = _.querySelector(element, prevSwitchSelector);
    }

    const numPages = _.lengthOf(pages);
    if (numPages < 2) {
      throw usageError("Pager must have more than 1 page");
    }

    for (const page of pages) {
      if (!element.contains(page) || page === element) {
        throw usageError("Pager's pages must be its descendants");
      }
    }

    const components = {
      _pages: pages,
      _toggles: toggles,
      _switches: switches,
      _nextPrevSwitch: nextPrevSwitch,
    };

    const methods = getMethods(this, components, element, config);

    (destroyPromise || _.promiseResolve()).then(() => {
      if (this.isDestroyed()) {
        return;
      }

      init(this, element, components, config, methods);
    });

    this.nextPage = () => methods._nextPage();
    this.prevPage = () => methods._prevPage();
    this.goToPage = (pageNum) => methods._goToPage(pageNum);
    this.disablePage = methods._disablePage;
    this.enablePage = methods._enablePage;
    this.togglePage = methods._togglePage;
    this.isPageDisabled = methods._isPageDisabled;
    this.getCurrentPage = methods._getCurrentPage;
    this.getPreviousPage = methods._getPreviousPage;
    this.getCurrentPageNum = methods._getCurrentPageNum;
    this.getPreviousPageNum = methods._getPreviousPageNum;
    this.onTransition = methods._onTransition;
    this.offTransition = methods._offTransition;

    this.getPages = () => [...pages];
    this.getSwitches = () => [...switches];
    this.getToggles = () => [...toggles];
  }
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
   * @since v1.1.0
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
   * @since Introduced in v1.1.0.
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
   * @since Introduced in v1.1.0.
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

// --------------------

type Components = {
  _pages: Element[];
  _toggles: Element[];
  _switches: Element[];
  _nextPrevSwitch: { _next: Element | null; _prev: Element | null };
};

// Swiping on some trackpads results in "trailing" wheel events sent for some
// while which results in multiple pages being advanced in a short while. So we
// limit how often pages can be advanced.
const MIN_TIME_BETWEEN_WHEEL = 1000;

const S_CURRENT = "current";
const S_ARIA_CURRENT = _.ARIA_PREFIX + S_CURRENT;
const S_COVERED = "covered";
const S_NEXT = "next";
const S_TOTAL_PAGES = "total-pages";
const S_VISIBLE_PAGES = "visible-pages";
const S_CURRENT_PAGE = "current-page";
const S_PAGE_NUMBER = "page-number";
const WIDGET_NAME = "pager";
const PREFIXED_NAME = _.prefixName(WIDGET_NAME);
const PREFIX_ROOT = `${PREFIXED_NAME}__root`;
const PREFIX_PAGE_CONTAINER = `${PREFIXED_NAME}__page-container`;

// Use different classes for styling items to the one used for auto-discovering
// them, so that re-creating existing widgets can correctly find the items to
// be used by the new widget synchronously before the current one is destroyed.
const PREFIX_PAGE = `${PREFIXED_NAME}__page`;
const PREFIX_PAGE__FOR_SELECT = `${PREFIXED_NAME}-page`;
const PREFIX_TOGGLE__FOR_SELECT = `${PREFIXED_NAME}-toggle`;
const PREFIX_SWITCH__FOR_SELECT = `${PREFIXED_NAME}-switch`;
const PREFIX_NEXT_SWITCH__FOR_SELECT = `${PREFIXED_NAME}-next-switch`;
const PREFIX_PREV_SWITCH__FOR_SELECT = `${PREFIXED_NAME}-prev-switch`;

const PREFIX_STYLE = `${PREFIXED_NAME}-style`;
const PREFIX_IS_FULLSCREEN = _.prefixName("is-fullscreen");
const PREFIX_USE_PARALLAX = _.prefixName("use-parallax");
const PREFIX_TOTAL_PAGES = _.prefixName(S_TOTAL_PAGES);
const PREFIX_VISIBLE_PAGES = _.prefixName(S_VISIBLE_PAGES);
const PREFIX_CURRENT_PAGE = _.prefixName(S_CURRENT_PAGE);
const PREFIX_CURRENT_PAGE_IS_LAST = `${PREFIX_CURRENT_PAGE}-is-last`;
const PREFIX_CURRENT_PAGE_IS_FIRST_ENABLED = `${PREFIX_CURRENT_PAGE}-is-first-enabled`;
const PREFIX_CURRENT_PAGE_IS_LAST_ENABLED = `${PREFIX_CURRENT_PAGE_IS_LAST}-enabled`;
const PREFIX_PAGE_STATE = _.prefixName("page-state");
const PREFIX_PAGE_NUMBER = _.prefixName(S_PAGE_NUMBER);
const VAR_CURRENT_PAGE = _.prefixCssJsVar(S_CURRENT_PAGE);
const VAR_TOTAL_PAGES = _.prefixCssJsVar(S_TOTAL_PAGES);
const VAR_VISIBLE_PAGES = _.prefixCssJsVar(S_VISIBLE_PAGES);
const VAR_VISIBLE_GAPS = _.prefixCssJsVar("visible-gaps");
const VAR_TRANSLATED_PAGES = _.prefixCssJsVar("translated-pages");
const VAR_TRANSLATED_GAPS = _.prefixCssJsVar("translated-gaps");
const VAR_PAGE_NUMBER = _.prefixCssJsVar(S_PAGE_NUMBER);

// Only one Pager widget per element is allowed, but Widget requires a
// non-blank ID.
const DUMMY_ID = PREFIXED_NAME;

const SUPPORTED_STYLES = ["slider", "carousel", "tabs"] as const;
type PagerStyle = (typeof SUPPORTED_STYLES)[number];

const isValidStyle = (value: string): value is PagerStyle =>
  _.includes(SUPPORTED_STYLES, value);

// For HTML API only
const configValidator: WidgetConfigValidatorObject<PagerConfig> = {
  initialPage: validateNumber,
  style: (key, value) => validateString(key, value, isValidStyle),
  pageSize: validateNumber,
  peek: validateBoolean,
  fullscreen: validateBoolean,
  parallax: validateBoolean,
  horizontal: validateBoolean,
  useGestures: (key, value) => {
    if (_.isNullish(value)) {
      return undefined;
    }

    const bool = toBoolean(value);
    if (bool !== null) {
      return bool;
    }

    return (
      validateStrList(
        "useGestures",
        validateString(key, value),
        isValidInputDevice,
      ) || true
    );
  },
  alignGestureDirection: validateBoolean,
  preventDefault: validateBoolean,
};

const fetchClosestScrollable = (element: Element) =>
  waitForMeasureTime().then(
    () => getClosestScrollable(element, { active: true }) ?? undefined,
  );

const setPageNumber = (components: Components, pageNum: number) => {
  let lastPromise: Promise<void> = _.promiseResolve();
  for (const el of [
    components._pages[pageNum - 1],
    components._toggles[pageNum - 1],
    components._switches[pageNum - 1],
  ] as const) {
    if (el) {
      setData(el, PREFIX_PAGE_NUMBER, pageNum + "");
      lastPromise = setStyleProp(el, VAR_PAGE_NUMBER, pageNum + "");
    }
  }

  return lastPromise;
};

const setPageState = async (
  components: Components,
  pageNum: number,
  state: string,
) => {
  for (const el of [
    components._pages[pageNum - 1],
    components._toggles[pageNum - 1],
    components._switches[pageNum - 1],
  ] as const) {
    if (el) {
      await setData(el, PREFIX_PAGE_STATE, state);
    }
  }
};

const setCurrentPage = (
  pagerEl: Element,
  pageNumbers: {
    _current: number;
    _total: number;
  },
  isPageDisabled: (pageNum: number) => boolean,
) => {
  let isFirstEnabled = true;
  let isLastEnabled = true;
  for (let n = 1; n <= pageNumbers._total; n++) {
    if (!isPageDisabled(n)) {
      if (n < pageNumbers._current) {
        isFirstEnabled = false;
      } else if (n > pageNumbers._current) {
        isLastEnabled = false;
      }
    }
  }

  setStyleProp(pagerEl, VAR_CURRENT_PAGE, pageNumbers._current + "");
  setData(pagerEl, PREFIX_CURRENT_PAGE, pageNumbers._current + "");
  setBooleanData(
    pagerEl,
    PREFIX_CURRENT_PAGE_IS_LAST,
    pageNumbers._current === pageNumbers._total,
  );
  setBooleanData(pagerEl, PREFIX_CURRENT_PAGE_IS_FIRST_ENABLED, isFirstEnabled);
  return setBooleanData(
    pagerEl,
    PREFIX_CURRENT_PAGE_IS_LAST_ENABLED,
    isLastEnabled,
  );
};

const init = (
  widget: Pager,
  element: Element,
  components: Components,
  config: PagerConfig | undefined,
  methods: ReturnType<typeof getMethods>,
) => {
  const logger = debug
    ? new debug.Logger({
        name: `Pager-${formatAsString(element)}`,
        logAtCreation: config,
      })
    : null;

  const pages = components._pages;
  const toggles = components._toggles;
  const switches = components._switches;
  const nextSwitch = components._nextPrevSwitch._next;
  const prevSwitch = components._nextPrevSwitch._prev;
  const pageContainer = _.parentOf(pages[0]);

  let initialPage = toInt(config?.initialPage ?? 1);
  const pagerStyle = config?.style || "slider";
  const isCarousel = pagerStyle === "carousel";
  const minPageSize = config?.pageSize ?? 300;
  const enablePeek = config?.peek ?? false;
  const isFullscreen = config?.fullscreen ?? false;
  const isParallax = config?.parallax ?? false;
  const isHorizontal = config?.horizontal ?? false;
  const orientation = isHorizontal ? _.S_HORIZONTAL : _.S_VERTICAL;
  const useGestures = config?.useGestures ?? true;
  const alignGestureDirection = config?.alignGestureDirection ?? false;
  const preventDefault = config?.preventDefault ?? true;

  const scrollWatcher = ScrollWatcher.reuse();
  const sizeWatcher = isCarousel
    ? SizeWatcher.reuse({ resizeThreshold: 10 })
    : null;
  const gestureWatcher = useGestures ? GestureWatcher.reuse() : null;
  const viewWatcher = isFullscreen
    ? ViewWatcher.reuse({ rootMargin: "0px", threshold: 0.3 })
    : null;

  const recalculateCarouselProps = async (t?: Element, data?: SizeData) => {
    if (data) {
      // there's been a resize
      const gap = _.parseFloat(await getComputedStyleProp(element, "gap")) || 0;
      const containerSize = data.content[isHorizontal ? _.S_WIDTH : _.S_HEIGHT];

      const getNumVisiblePages = (addPeek = false) =>
        (numVisiblePages = _.max(
          1, // at least 1
          _.min(
            _.floor(
              (containerSize + gap - (addPeek ? 0.5 * minPageSize : 0)) /
                (minPageSize + gap),
            ),
            numPages, // and at most total number
          ),
        ));

      numVisiblePages = getNumVisiblePages();
      if (enablePeek && numVisiblePages < numPages) {
        // Not all pages fit now and we will add a "peek" from the pages on the
        // edge.
        // Re-calculate with peek added in case the resultant page size when we
        // add the "peek" will make it smaller than the min.
        numVisiblePages = getNumVisiblePages(true);
      }

      debug: logger?.debug8("Pager resized", {
        gap,
        containerSize,
        numVisiblePages,
      });
    } // otherwise just a page transition

    const currPageNum = widget.getCurrentPageNum();
    const prevPageNum = widget.getPreviousPageNum();
    const numHidden = numPages - numVisiblePages;
    const hasPeek = enablePeek && numVisiblePages < numPages;

    // centre the current page as much as possible
    let visibleStart = currPageNum - (numVisiblePages - 1) / 2;
    let isAtEdge = false;

    if (visibleStart >= numHidden + 1) {
      visibleStart = numHidden + 1;
      isAtEdge = true;
    } else if (visibleStart <= 1) {
      visibleStart = 1;
      isAtEdge = true;
    }

    let numTranslated = 0;
    if (hasPeek) {
      numTranslated = _.max(0, visibleStart - 1 - (isAtEdge ? 0.5 : 0.25));
    } else {
      numTranslated =
        (prevPageNum > currPageNum ? _.floor : _.ceil)(visibleStart) - 1;
    }

    const numVisibleGaps = !hasPeek
      ? numVisiblePages - 1
      : isAtEdge || numVisiblePages % 2 === 0
        ? numVisiblePages
        : numVisiblePages + 1;

    const fractionalNumVisiblePages = hasPeek
      ? numVisiblePages + 0.5
      : numVisiblePages;

    debug: logger?.debug8("Carousel calculations", {
      currPageNum,
      prevPageNum,
      visibleStart,
      isAtEdge,
      numVisiblePages,
      numVisibleGaps,
      numTranslated,
    });

    setData(element, PREFIX_VISIBLE_PAGES, fractionalNumVisiblePages + "");
    setStyleProp(element, VAR_VISIBLE_PAGES, fractionalNumVisiblePages + "");
    setStyleProp(element, VAR_VISIBLE_GAPS, numVisibleGaps + "");
    setStyleProp(element, VAR_TRANSLATED_PAGES, numTranslated + "");
    setStyleProp(element, VAR_TRANSLATED_GAPS, _.floor(numTranslated) + "");
  };

  const getGestureOptions = (
    directions: Direction | Direction[] | undefined,
  ): OnGestureOptions => {
    return {
      devices: _.isBoolean(useGestures) // i.e. true; if it's false, then gestureWatcher is null
        ? undefined // all devices
        : useGestures,
      intents: [_.S_DRAG, _.S_SCROLL],
      directions,
      deltaThreshold: 25,
      preventDefault,
    };
  };

  const scrollToPager = async () => {
    scrollWatcher.scrollTo(element, {
      scrollable: await fetchClosestScrollable(element),
    });
  };

  const transitionOnGesture = (target: EventTarget, data: GestureData) => {
    const swapDirection = data.intent === _.S_DRAG;

    if (_.includes([_.S_LEFT, _.S_UP], data.direction)) {
      (swapDirection ? methods._nextPage : methods._prevPage)(data);
    } else {
      (swapDirection ? methods._prevPage : methods._nextPage)(data);
    }
  };

  const addWatchers = () => {
    gestureWatcher?.onGesture(
      element,
      transitionOnGesture,
      getGestureOptions(
        alignGestureDirection
          ? isHorizontal
            ? [_.S_LEFT, _.S_RIGHT]
            : [_.S_UP, _.S_DOWN]
          : undefined, // all directions
      ),
    );

    sizeWatcher?.onResize(recalculateCarouselProps, { target: element });
    viewWatcher?.onView(element, scrollToPager, { views: "at" });
  };

  const removeWatchers = () => {
    gestureWatcher?.offGesture(element, transitionOnGesture);
    sizeWatcher?.offResize(recalculateCarouselProps, element);
    viewWatcher?.offView(element, scrollToPager);
  };

  const getPageNumForEvent = (event: Event) => {
    const target = _.currentTargetOf(event);
    return _.isElement(target) ? toInt(getData(target, PREFIX_PAGE_NUMBER)) : 0;
  };

  const toggleClickListener = (event: Event) => {
    const pageNum = getPageNumForEvent(event);
    methods._togglePage(pageNum);
  };

  const switchClickListener = (event: Event) => {
    const pageNum = getPageNumForEvent(event);
    methods._goToPage(pageNum);
  };

  const nextSwitchClickListener = () => methods._nextPage();
  const prevSwitchClickListener = () => methods._prevPage();

  // SETUP ------------------------------

  widget.onDisable(removeWatchers);
  widget.onEnable(addWatchers);

  widget.onDestroy(async () => {
    await waitForMutateTime();
    delDataNow(element, _.PREFIX_ORIENTATION);
    delDataNow(element, PREFIX_STYLE);
    delDataNow(element, PREFIX_IS_FULLSCREEN);
    delDataNow(element, PREFIX_USE_PARALLAX);
    delDataNow(element, PREFIX_CURRENT_PAGE);
    delDataNow(element, PREFIX_CURRENT_PAGE_IS_LAST);
    delDataNow(element, PREFIX_CURRENT_PAGE_IS_FIRST_ENABLED);
    delDataNow(element, PREFIX_CURRENT_PAGE_IS_LAST_ENABLED);
    delDataNow(element, PREFIX_TOTAL_PAGES);
    delDataNow(element, PREFIX_VISIBLE_PAGES);
    delStylePropNow(element, VAR_CURRENT_PAGE);
    delStylePropNow(element, VAR_TOTAL_PAGES);
    delStylePropNow(element, VAR_VISIBLE_PAGES);
    delStylePropNow(element, VAR_VISIBLE_GAPS);
    delStylePropNow(element, VAR_TRANSLATED_PAGES);
    delStylePropNow(element, VAR_TRANSLATED_GAPS);

    for (let idx = 0; idx < _.lengthOf(pages); idx++) {
      removeClassesNow(pages[idx], PREFIX_PAGE);

      for (const [el, listener] of [
        [pages[idx], null],
        [toggles[idx], toggleClickListener],
        [switches[idx], switchClickListener],
      ] as const) {
        if (el) {
          delDataNow(el, PREFIX_PAGE_STATE);
          delDataNow(el, PREFIX_PAGE_NUMBER);
          delStylePropNow(el, VAR_PAGE_NUMBER);
          if (listener) {
            removeEventListenerFrom(el, _.S_CLICK, listener);
          }
        }
      }

      _.delAttr(pages[idx], S_ARIA_CURRENT);
    }

    if (nextSwitch) {
      removeEventListenerFrom(nextSwitch, _.S_CLICK, nextSwitchClickListener);
    }

    if (prevSwitch) {
      removeEventListenerFrom(prevSwitch, _.S_CLICK, prevSwitchClickListener);
    }

    removeClassesNow(element, PREFIX_ROOT);
    if (pageContainer) {
      removeClassesNow(pageContainer, PREFIX_PAGE_CONTAINER);
    }
  });

  if (isCarousel) {
    widget.onTransition(() => recalculateCarouselProps());
  }

  addWatchers();
  addClasses(element, PREFIX_ROOT);
  if (pageContainer) {
    addClasses(pageContainer, PREFIX_PAGE_CONTAINER);
  }

  const numPages = _.lengthOf(pages);
  let numVisiblePages = numPages;

  setData(element, _.PREFIX_ORIENTATION, orientation);
  setData(element, PREFIX_STYLE, pagerStyle);
  setBooleanData(element, PREFIX_IS_FULLSCREEN, isFullscreen);
  setBooleanData(element, PREFIX_USE_PARALLAX, isParallax);
  setData(element, PREFIX_TOTAL_PAGES, numPages + "");
  setStyleProp(element, VAR_TOTAL_PAGES, (numPages || 1) + "");

  for (const page of pages) {
    disableInitialTransition(page);
    addClasses(page, PREFIX_PAGE);
  }

  for (let idx = 0; idx < numPages; idx++) {
    setPageNumber(components, idx + 1);
    setPageState(components, idx + 1, S_NEXT);

    for (const [el, listener] of [
      [toggles[idx], toggleClickListener],
      [switches[idx], switchClickListener],
    ] as const) {
      if (el) {
        addEventListenerTo(el, _.S_CLICK, listener);
      }
    }
  }

  if (nextSwitch) {
    addEventListenerTo(nextSwitch, _.S_CLICK, nextSwitchClickListener);
  }

  if (prevSwitch) {
    addEventListenerTo(prevSwitch, _.S_CLICK, prevSwitchClickListener);
  }

  if (initialPage < 1 || initialPage > numPages) {
    initialPage = 1;
  }
  methods._goToPage(initialPage);
};

const getMethods = (
  widget: Pager,
  components: Components,
  element: Element,
  config: PagerConfig | undefined,
) => {
  const pages = components._pages;
  const scrollWatcher = ScrollWatcher.reuse();
  const isFullscreen = config?.fullscreen;
  const disabledPages: Record<number, boolean> = {};
  const callbacks = _.newMap<WidgetHandler, WidgetCallback>();

  const fetchScrollOptions = async (): Promise<ScrollOptions> => ({
    scrollable: await fetchClosestScrollable(element),
    // default amount is already 100%
    asFractionOf: "visible",
    weCanInterrupt: true,
  });

  let currPageNum = -1;
  let lastPageNum = -1;
  let lastTransition = 0;

  const canTransition = (gestureData?: GestureData) => {
    if (widget.isDisabled()) {
      return false;
    }

    if (gestureData?.device !== _.S_WHEEL) {
      return true;
    }

    const timeNow = _.timeNow();
    if (timeNow - lastTransition > MIN_TIME_BETWEEN_WHEEL) {
      lastTransition = timeNow;
      return true;
    }

    return false;
  };

  const goToPage = async (pageNum: number, gestureData?: GestureData) => {
    pageNum = toInt(pageNum, -1);
    if (pageNum === currPageNum || !canTransition(gestureData)) {
      return;
    }

    const numPages = _.lengthOf(pages);

    if (
      (currPageNum === 1 && pageNum === 0) ||
      (currPageNum === numPages && pageNum === numPages + 1)
    ) {
      // next/prev page beyond last/first
      if (isFullscreen) {
        scrollWatcher.scroll(
          pageNum
            ? gestureData?.direction === _.S_RIGHT
              ? _.S_RIGHT
              : _.S_DOWN
            : gestureData?.direction === _.S_LEFT
              ? _.S_LEFT
              : _.S_UP,
          await fetchScrollOptions(),
        ); // no need to await
      }

      return;
    }

    if (isPageDisabled(pageNum) || pageNum < 1 || pageNum > numPages) {
      // invalid or disabled
      return;
    }

    lastPageNum = currPageNum > 0 ? currPageNum : pageNum;
    currPageNum = pageNum;

    await invokeHandlers(callbacks.values(), widget);

    _.delAttr(pages[lastPageNum - 1], S_ARIA_CURRENT);
    for (
      let n = lastPageNum;
      n !== currPageNum;
      currPageNum < lastPageNum ? n-- : n++
    ) {
      if (!isPageDisabled(n)) {
        setPageState(
          components,
          n,
          currPageNum < lastPageNum ? S_NEXT : S_COVERED,
        );
      }
    }

    setCurrentPage(
      element,
      { _current: currPageNum, _total: numPages },
      isPageDisabled,
    );
    _.setAttr(pages[currPageNum - 1], S_ARIA_CURRENT);
    await setPageState(components, currPageNum, S_CURRENT);
  };

  const nextPage = async (gestureData?: GestureData) => {
    let targetPage = currPageNum + 1;
    while (isPageDisabled(targetPage)) {
      targetPage++;
    }

    return goToPage(targetPage, gestureData);
  };

  const prevPage = async (gestureData?: GestureData) => {
    let targetPage = currPageNum - 1;
    while (isPageDisabled(targetPage)) {
      targetPage--;
    }

    return goToPage(targetPage, gestureData);
  };

  const isPageDisabled = (pageNum: number) => disabledPages[pageNum] === true;

  const disablePage = async (pageNum: number) => {
    pageNum = toInt(pageNum);
    if (widget.isDisabled() || pageNum < 1 || pageNum > _.lengthOf(pages)) {
      return;
    }

    // set immediately for toggle to work without awaiting on it
    disabledPages[pageNum] = true;

    if (pageNum === currPageNum) {
      await prevPage();

      if (pageNum === currPageNum) {
        // was the first enabled one
        await nextPage();

        if (pageNum === currPageNum) {
          // was the only enabled one
          disabledPages[pageNum] = false;
          return;
        }
      }
    }

    setCurrentPage(
      element,
      { _current: currPageNum, _total: _.lengthOf(pages) },
      isPageDisabled,
    );
    await setPageState(components, pageNum, _.S_DISABLED);
  };

  const enablePage = async (pageNum: number) => {
    pageNum = toInt(pageNum);
    if (widget.isDisabled() || !isPageDisabled(pageNum)) {
      return;
    }

    // set immediately for toggle to work without awaiting on it
    disabledPages[pageNum] = false;

    setCurrentPage(
      element,
      { _current: currPageNum, _total: _.lengthOf(pages) },
      isPageDisabled,
    );
    await setPageState(
      components,
      pageNum,
      pageNum < currPageNum ? S_COVERED : S_NEXT,
    );
  };

  const togglePage = (pageNum: number) =>
    isPageDisabled(pageNum) ? enablePage(pageNum) : disablePage(pageNum);

  const onTransition = (handler: WidgetHandler) => {
    addNewCallbackToMap(callbacks, handler);
  };

  const offTransition = (handler: WidgetHandler) => {
    _.remove(callbacks.get(handler));
  };

  return {
    _nextPage: nextPage,
    _prevPage: prevPage,
    _goToPage: goToPage,
    _disablePage: disablePage,
    _enablePage: enablePage,
    _togglePage: togglePage,
    _isPageDisabled: isPageDisabled,
    _getCurrentPage: () => pages[currPageNum - 1],
    _getPreviousPage: () => pages[lastPageNum - 1],
    _getCurrentPageNum: () => (_.lengthOf(pages) > 0 ? currPageNum : 0),
    _getPreviousPageNum: () => (_.lengthOf(pages) > 0 ? lastPageNum : 0),
    _onTransition: onTransition,
    _offTransition: offTransition,
  };
};

_.brandClass(Pager, "Pager");
