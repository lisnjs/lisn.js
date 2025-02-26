"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pager = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _cssAlter = require("../utils/css-alter.cjs");
var _domOptimize = require("../utils/dom-optimize.cjs");
var _domQuery = require("../utils/dom-query.cjs");
var _event = require("../utils/event.cjs");
var _gesture = require("../utils/gesture.cjs");
var _math = require("../utils/math.cjs");
var _misc = require("../utils/misc.cjs");
var _scroll = require("../utils/scroll.cjs");
var _text = require("../utils/text.cjs");
var _validation = require("../utils/validation.cjs");
var _callback = require("../modules/callback.cjs");
var _gestureWatcher = require("../watchers/gesture-watcher.cjs");
var _scrollWatcher = require("../watchers/scroll-watcher.cjs");
var _sizeWatcher = require("../watchers/size-watcher.cjs");
var _viewWatcher = require("../watchers/view-watcher.cjs");
var _widget = require("./widget.cjs");
var _debug = _interopRequireDefault(require("../debug/debug.cjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Widgets
 */
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
class Pager extends _widget.Widget {
  static get(element) {
    const instance = super.get(element, DUMMY_ID);
    if (MH.isInstanceOf(instance, Pager)) {
      return instance;
    }
    return null;
  }
  static register() {
    (0, _widget.registerWidget)(WIDGET_NAME, (element, config) => {
      if (!Pager.get(element)) {
        return new Pager(element, config);
      }
      return null;
    }, configValidator);
  }

  /**
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If there are less than 2 pages given or found, or if any
   *                page is not a descendant of the main pager element.
   */
  constructor(element, config) {
    var _Pager$get;
    const destroyPromise = (_Pager$get = Pager.get(element)) === null || _Pager$get === void 0 ? void 0 : _Pager$get.destroy();
    super(element, {
      id: DUMMY_ID
    });
    /**
     * Advances the widget's page by 1. If the current page is the last one,
     * nothing is done, unless {@link PagerConfig.fullscreen} is true in which
     * case the pager's scrollable ancestor will be scrolled down/right
     * (depending on the gesture direction).
     */
    _defineProperty(this, "nextPage", void 0);
    /**
     * Reverses the widget's page by 1. If the current page is the first one,
     * nothing is done, unless {@link PagerConfig.fullscreen} is true in which
     * case the pager's scrollable ancestor will be scrolled up/left
     * (depending on the gesture direction).
     */
    _defineProperty(this, "prevPage", void 0);
    /**
     * Advances the widget to the given page. Note that page numbers start at 1.
     *
     * If this page is disabled, nothing is done.
     */
    _defineProperty(this, "goToPage", void 0);
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
    _defineProperty(this, "disablePage", void 0);
    /**
     * Re-enables the given page number. Note that page numbers start at 1.
     */
    _defineProperty(this, "enablePage", void 0);
    /**
     * Re-enables the given page if it is disabled, otherwise disables it. Note
     * that page numbers start at 1.
     */
    _defineProperty(this, "togglePage", void 0);
    /**
     * Returns true if the given page number is disabled. Note that page
     * numbers start at 1.
     */
    _defineProperty(this, "isPageDisabled", void 0);
    /**
     * Returns the current page.
     */
    _defineProperty(this, "getCurrentPage", void 0);
    /**
     * Returns the previous page, before the last transition.
     *
     * If there has been no change of page, returns the first page, same as
     * {@link getCurrentPageNum}.
     */
    _defineProperty(this, "getPreviousPage", void 0);
    /**
     * Returns the number of the current page. Note that numbers start at 1.
     */
    _defineProperty(this, "getCurrentPageNum", void 0);
    /**
     * Returns the number of the previous page, before the last transition. Note
     * that numbers start at 1.
     *
     * If there has been no change of page, returns the number of the first page,
     * same as {@link getCurrentPageNum}.
     */
    _defineProperty(this, "getPreviousPageNum", void 0);
    /**
     * The given handler will be called whenever there is a change of page. It
     * will be called after the current page number is updated internally (so
     * {@link getPreviousPageNum} and {@link getCurrentPageNum} will return the
     * updated numbers), but before the page transition styles are updated.
     *
     * If the handler returns a promise, it will be awaited upon.
     */
    _defineProperty(this, "onTransition", void 0);
    /**
     * Returns the page elements.
     */
    _defineProperty(this, "getPages", void 0);
    /**
     * Returns the toggle elements if any.
     */
    _defineProperty(this, "getToggles", void 0);
    /**
     * Returns the switch elements if any.
     */
    _defineProperty(this, "getSwitches", void 0);
    const pages = (config === null || config === void 0 ? void 0 : config.pages) || [];
    const toggles = (config === null || config === void 0 ? void 0 : config.toggles) || [];
    const switches = (config === null || config === void 0 ? void 0 : config.switches) || [];
    const nextPrevSwitch = {
      _next: (config === null || config === void 0 ? void 0 : config.nextSwitch) || null,
      _prev: (config === null || config === void 0 ? void 0 : config.prevSwitch) || null
    };
    const pageSelector = (0, _widget.getDefaultWidgetSelector)(PREFIX_PAGE__FOR_SELECT);
    const toggleSelector = (0, _widget.getDefaultWidgetSelector)(PREFIX_TOGGLE__FOR_SELECT);
    const switchSelector = (0, _widget.getDefaultWidgetSelector)(PREFIX_SWITCH__FOR_SELECT);
    const nextSwitchSelector = (0, _widget.getDefaultWidgetSelector)(PREFIX_NEXT_SWITCH__FOR_SELECT);
    const prevSwitchSelector = (0, _widget.getDefaultWidgetSelector)(PREFIX_PREV_SWITCH__FOR_SELECT);
    if (!MH.lengthOf(pages)) {
      pages.push(...MH.querySelectorAll(element, pageSelector));
      if (!MH.lengthOf(pages)) {
        pages.push(...(0, _domQuery.getVisibleContentChildren)(element).filter(e => !e.matches(switchSelector)));
      }
    }
    if (!MH.lengthOf(toggles)) {
      toggles.push(...MH.querySelectorAll(element, toggleSelector));
    }
    if (!MH.lengthOf(switches)) {
      switches.push(...MH.querySelectorAll(element, switchSelector));
    }
    if (!nextPrevSwitch._next) {
      nextPrevSwitch._next = MH.querySelector(element, nextSwitchSelector);
    }
    if (!nextPrevSwitch._prev) {
      nextPrevSwitch._prev = MH.querySelector(element, prevSwitchSelector);
    }
    const numPages = MH.lengthOf(pages);
    if (numPages < 2) {
      throw MH.usageError("Pager must have more than 1 page");
    }
    for (const page of pages) {
      if (!element.contains(page) || page === element) {
        throw MH.usageError("Pager's pages must be its descendants");
      }
    }
    const components = {
      _pages: pages,
      _toggles: toggles,
      _switches: switches,
      _nextPrevSwitch: nextPrevSwitch
    };
    const methods = getMethods(this, components, element, config);
    (destroyPromise || MH.promiseResolve()).then(() => {
      if (this.isDestroyed()) {
        return;
      }
      init(this, element, components, config, methods);
    });
    this.nextPage = () => methods._nextPage();
    this.prevPage = () => methods._prevPage();
    this.goToPage = pageNum => methods._goToPage(pageNum);
    this.disablePage = methods._disablePage;
    this.enablePage = methods._enablePage;
    this.togglePage = methods._togglePage;
    this.isPageDisabled = methods._isPageDisabled;
    this.getCurrentPage = methods._getCurrentPage;
    this.getPreviousPage = methods._getPreviousPage;
    this.getCurrentPageNum = methods._getCurrentPageNum;
    this.getPreviousPageNum = methods._getPreviousPageNum;
    this.onTransition = methods._onTransition;
    this.getPages = () => [...pages];
    this.getSwitches = () => [...switches];
    this.getToggles = () => [...toggles];
  }
}

/**
 * @interface
 */

// --------------------
exports.Pager = Pager;
// Swiping on some trackpads results in "trailing" wheel events sent for some
// while which results in multiple pages being advanced in a short while. So we
// limit how often pages can be advanced.
const MIN_TIME_BETWEEN_WHEEL = 1000;
const S_CURRENT = "current";
const S_ARIA_CURRENT = MC.ARIA_PREFIX + S_CURRENT;
const S_COVERED = "covered";
const S_NEXT = "next";
const S_TOTAL_PAGES = "total-pages";
const S_VISIBLE_PAGES = "visible-pages";
const S_CURRENT_PAGE = "current-page";
const S_PAGE_NUMBER = "page-number";
const WIDGET_NAME = "pager";
const PREFIXED_NAME = MH.prefixName(WIDGET_NAME);
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
const PREFIX_IS_FULLSCREEN = MH.prefixName("is-fullscreen");
const PREFIX_USE_PARALLAX = MH.prefixName("use-parallax");
const PREFIX_TOTAL_PAGES = MH.prefixName(S_TOTAL_PAGES);
const PREFIX_VISIBLE_PAGES = MH.prefixName(S_VISIBLE_PAGES);
const PREFIX_CURRENT_PAGE = MH.prefixName(S_CURRENT_PAGE);
const PREFIX_CURRENT_PAGE_IS_LAST = `${PREFIX_CURRENT_PAGE}-is-last`;
const PREFIX_CURRENT_PAGE_IS_FIRST_ENABLED = `${PREFIX_CURRENT_PAGE}-is-first-enabled`;
const PREFIX_CURRENT_PAGE_IS_LAST_ENABLED = `${PREFIX_CURRENT_PAGE_IS_LAST}-enabled`;
const PREFIX_PAGE_STATE = MH.prefixName("page-state");
const PREFIX_PAGE_NUMBER = MH.prefixName(S_PAGE_NUMBER);
const VAR_CURRENT_PAGE = MH.prefixCssJsVar(S_CURRENT_PAGE);
const VAR_TOTAL_PAGES = MH.prefixCssJsVar(S_TOTAL_PAGES);
const VAR_VISIBLE_PAGES = MH.prefixCssJsVar(S_VISIBLE_PAGES);
const VAR_VISIBLE_GAPS = MH.prefixCssJsVar("visible-gaps");
const VAR_TRANSLATED_PAGES = MH.prefixCssJsVar("translated-pages");
const VAR_TRANSLATED_GAPS = MH.prefixCssJsVar("translated-gaps");
const VAR_PAGE_NUMBER = MH.prefixCssJsVar(S_PAGE_NUMBER);

// Only one Pager widget per element is allowed, but Widget requires a
// non-blank ID.
const DUMMY_ID = PREFIXED_NAME;
const SUPPORTED_STYLES = ["slider", "carousel", "tabs"];
const isValidStyle = value => MH.includes(SUPPORTED_STYLES, value);
const configValidator = {
  initialPage: _validation.validateNumber,
  style: (key, value) => (0, _validation.validateString)(key, value, isValidStyle),
  pageSize: _validation.validateNumber,
  peek: _validation.validateBoolean,
  fullscreen: _validation.validateBoolean,
  parallax: _validation.validateBoolean,
  horizontal: _validation.validateBoolean,
  useGestures: (key, value) => {
    if (MH.isNullish(value)) {
      return undefined;
    }
    const bool = (0, _misc.toBool)(value);
    if (bool !== null) {
      return bool;
    }
    return (0, _validation.validateStrList)("useGestures", (0, _validation.validateString)(key, value), _gesture.isValidInputDevice) || true;
  },
  alignGestureDirection: _validation.validateBoolean,
  preventDefault: _validation.validateBoolean
};
const fetchClosestScrollable = element => (0, _domOptimize.waitForMeasureTime)().then(() => {
  var _getClosestScrollable;
  return (_getClosestScrollable = (0, _scroll.getClosestScrollable)(element, {
    active: true
  })) !== null && _getClosestScrollable !== void 0 ? _getClosestScrollable : undefined;
});
const setPageNumber = (components, pageNum) => {
  let lastPromise = MH.promiseResolve();
  for (const el of [components._pages[pageNum - 1], components._toggles[pageNum - 1], components._switches[pageNum - 1]]) {
    if (el) {
      (0, _cssAlter.setData)(el, PREFIX_PAGE_NUMBER, pageNum + "");
      lastPromise = (0, _cssAlter.setStyleProp)(el, VAR_PAGE_NUMBER, pageNum + "");
    }
  }
  return lastPromise;
};
const setPageState = async (components, pageNum, state) => {
  for (const el of [components._pages[pageNum - 1], components._toggles[pageNum - 1], components._switches[pageNum - 1]]) {
    if (el) {
      await (0, _cssAlter.setData)(el, PREFIX_PAGE_STATE, state);
    }
  }
};
const setCurrentPage = (pagerEl, pageNumbers, isPageDisabled) => {
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
  (0, _cssAlter.setStyleProp)(pagerEl, VAR_CURRENT_PAGE, pageNumbers._current + "");
  (0, _cssAlter.setData)(pagerEl, PREFIX_CURRENT_PAGE, pageNumbers._current + "");
  (0, _cssAlter.setBoolData)(pagerEl, PREFIX_CURRENT_PAGE_IS_LAST, pageNumbers._current === pageNumbers._total);
  (0, _cssAlter.setBoolData)(pagerEl, PREFIX_CURRENT_PAGE_IS_FIRST_ENABLED, isFirstEnabled);
  return (0, _cssAlter.setBoolData)(pagerEl, PREFIX_CURRENT_PAGE_IS_LAST_ENABLED, isLastEnabled);
};
const init = (widget, element, components, config, methods) => {
  var _pages$, _config$initialPage, _config$style, _config$pageSize, _config$peek, _config$fullscreen, _config$parallax, _config$horizontal, _config$useGestures, _config$alignGestureD, _config$preventDefaul;
  const logger = _debug.default ? new _debug.default.Logger({
    name: `Pager-${(0, _text.formatAsString)(element)}`,
    logAtCreation: config
  }) : null;
  const pages = components._pages;
  const toggles = components._toggles;
  const switches = components._switches;
  const nextSwitch = components._nextPrevSwitch._next;
  const prevSwitch = components._nextPrevSwitch._prev;
  const pageContainer = (_pages$ = pages[0]) === null || _pages$ === void 0 ? void 0 : _pages$.parentElement;
  let initialPage = (0, _math.toInt)((_config$initialPage = config === null || config === void 0 ? void 0 : config.initialPage) !== null && _config$initialPage !== void 0 ? _config$initialPage : 1);
  const pagerStyle = (_config$style = config === null || config === void 0 ? void 0 : config.style) !== null && _config$style !== void 0 ? _config$style : "slider";
  const isCarousel = pagerStyle === "carousel";
  const minPageSize = (_config$pageSize = config === null || config === void 0 ? void 0 : config.pageSize) !== null && _config$pageSize !== void 0 ? _config$pageSize : 300;
  const enablePeek = (_config$peek = config === null || config === void 0 ? void 0 : config.peek) !== null && _config$peek !== void 0 ? _config$peek : false;
  const isFullscreen = (_config$fullscreen = config === null || config === void 0 ? void 0 : config.fullscreen) !== null && _config$fullscreen !== void 0 ? _config$fullscreen : false;
  const isParallax = (_config$parallax = config === null || config === void 0 ? void 0 : config.parallax) !== null && _config$parallax !== void 0 ? _config$parallax : false;
  const isHorizontal = (_config$horizontal = config === null || config === void 0 ? void 0 : config.horizontal) !== null && _config$horizontal !== void 0 ? _config$horizontal : false;
  const orientation = isHorizontal ? MC.S_HORIZONTAL : MC.S_VERTICAL;
  const useGestures = (_config$useGestures = config === null || config === void 0 ? void 0 : config.useGestures) !== null && _config$useGestures !== void 0 ? _config$useGestures : true;
  const alignGestureDirection = (_config$alignGestureD = config === null || config === void 0 ? void 0 : config.alignGestureDirection) !== null && _config$alignGestureD !== void 0 ? _config$alignGestureD : false;
  const preventDefault = (_config$preventDefaul = config === null || config === void 0 ? void 0 : config.preventDefault) !== null && _config$preventDefaul !== void 0 ? _config$preventDefaul : true;
  const scrollWatcher = _scrollWatcher.ScrollWatcher.reuse();
  const sizeWatcher = isCarousel ? _sizeWatcher.SizeWatcher.reuse({
    resizeThreshold: 10
  }) : null;
  const gestureWatcher = useGestures ? _gestureWatcher.GestureWatcher.reuse() : null;
  const viewWatcher = isFullscreen ? _viewWatcher.ViewWatcher.reuse({
    rootMargin: "0px",
    threshold: 0.3
  }) : null;
  const recalculateCarouselProps = async (t, data) => {
    if (data) {
      // there's been a resize
      const gap = MH.parseFloat(await (0, _cssAlter.getComputedStyleProp)(element, "gap")) || 0;
      const containerSize = data.content[isHorizontal ? MC.S_WIDTH : MC.S_HEIGHT];
      const getNumVisiblePages = (addPeek = false) => numVisiblePages = MH.max(1,
      // at least 1
      MH.min(MH.floor((containerSize + gap - (addPeek ? 0.5 * minPageSize : 0)) / (minPageSize + gap)), numPages // and at most total number
      ));
      numVisiblePages = getNumVisiblePages();
      if (enablePeek && numVisiblePages < numPages) {
        // Not all pages fit now and we will add a "peek" from the pages on the
        // edge.
        // Re-calculate with peek added in case the resultant page size when we
        // add the "peek" will make it smaller than the min.
        numVisiblePages = getNumVisiblePages(true);
      }
      logger === null || logger === void 0 || logger.debug8("Pager resized", {
        gap,
        containerSize,
        numVisiblePages
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
      numTranslated = MH.max(0, visibleStart - 1 - (isAtEdge ? 0.5 : 0.25));
    } else {
      numTranslated = (prevPageNum > currPageNum ? MH.floor : MH.ceil)(visibleStart) - 1;
    }
    const numVisibleGaps = !hasPeek ? numVisiblePages - 1 : isAtEdge || numVisiblePages % 2 === 0 ? numVisiblePages : numVisiblePages + 1;
    const fractionalNumVisiblePages = hasPeek ? numVisiblePages + 0.5 : numVisiblePages;
    logger === null || logger === void 0 || logger.debug8("Carousel calculations", {
      currPageNum,
      prevPageNum,
      visibleStart,
      isAtEdge,
      numVisiblePages,
      numVisibleGaps,
      numTranslated
    });
    (0, _cssAlter.setData)(element, PREFIX_VISIBLE_PAGES, fractionalNumVisiblePages + "");
    (0, _cssAlter.setStyleProp)(element, VAR_VISIBLE_PAGES, fractionalNumVisiblePages + "");
    (0, _cssAlter.setStyleProp)(element, VAR_VISIBLE_GAPS, numVisibleGaps + "");
    (0, _cssAlter.setStyleProp)(element, VAR_TRANSLATED_PAGES, numTranslated + "");
    (0, _cssAlter.setStyleProp)(element, VAR_TRANSLATED_GAPS, MH.floor(numTranslated) + "");
  };
  const getGestureOptions = directions => {
    return {
      devices: MH.isBoolean(useGestures) // i.e. true; if it's false, then gestureWatcher is null
      ? undefined // all devices
      : useGestures,
      intents: [MC.S_DRAG, MC.S_SCROLL],
      directions,
      deltaThreshold: 25,
      preventDefault
    };
  };
  const scrollToPager = async () => {
    scrollWatcher.scrollTo(element, {
      scrollable: await fetchClosestScrollable(element)
    });
  };
  const transitionOnGesture = (target, data) => {
    const swapDirection = data.intent === MC.S_DRAG;
    if (MH.includes([MC.S_LEFT, MC.S_UP], data.direction)) {
      (swapDirection ? methods._nextPage : methods._prevPage)(data);
    } else {
      (swapDirection ? methods._prevPage : methods._nextPage)(data);
    }
  };
  const addWatchers = () => {
    gestureWatcher === null || gestureWatcher === void 0 || gestureWatcher.onGesture(element, transitionOnGesture, getGestureOptions(alignGestureDirection ? isHorizontal ? [MC.S_LEFT, MC.S_RIGHT] : [MC.S_UP, MC.S_DOWN] : undefined // all directions
    ));
    sizeWatcher === null || sizeWatcher === void 0 || sizeWatcher.onResize(recalculateCarouselProps, {
      target: element
    });
    viewWatcher === null || viewWatcher === void 0 || viewWatcher.onView(element, scrollToPager, {
      views: "at"
    });
  };
  const removeWatchers = () => {
    gestureWatcher === null || gestureWatcher === void 0 || gestureWatcher.offGesture(element, transitionOnGesture);
    sizeWatcher === null || sizeWatcher === void 0 || sizeWatcher.offResize(recalculateCarouselProps, element);
    viewWatcher === null || viewWatcher === void 0 || viewWatcher.offView(element, scrollToPager);
  };
  const getPageNumForEvent = event => {
    const target = MH.currentTargetOf(event);
    return MH.isElement(target) ? (0, _math.toInt)((0, _cssAlter.getData)(target, PREFIX_PAGE_NUMBER)) : 0;
  };
  const toggleClickListener = event => {
    const pageNum = getPageNumForEvent(event);
    methods._togglePage(pageNum);
  };
  const switchClickListener = event => {
    const pageNum = getPageNumForEvent(event);
    methods._goToPage(pageNum);
  };
  const nextSwitchClickListener = () => methods._nextPage();
  const prevSwitchClickListener = () => methods._prevPage();

  // SETUP ------------------------------

  widget.onDisable(removeWatchers);
  widget.onEnable(addWatchers);
  widget.onDestroy(async () => {
    await (0, _domOptimize.waitForMutateTime)();
    (0, _cssAlter.delDataNow)(element, MC.PREFIX_ORIENTATION);
    (0, _cssAlter.delDataNow)(element, PREFIX_STYLE);
    (0, _cssAlter.delDataNow)(element, PREFIX_IS_FULLSCREEN);
    (0, _cssAlter.delDataNow)(element, PREFIX_USE_PARALLAX);
    (0, _cssAlter.delDataNow)(element, PREFIX_CURRENT_PAGE);
    (0, _cssAlter.delDataNow)(element, PREFIX_CURRENT_PAGE_IS_LAST);
    (0, _cssAlter.delDataNow)(element, PREFIX_CURRENT_PAGE_IS_FIRST_ENABLED);
    (0, _cssAlter.delDataNow)(element, PREFIX_CURRENT_PAGE_IS_LAST_ENABLED);
    (0, _cssAlter.delDataNow)(element, PREFIX_TOTAL_PAGES);
    (0, _cssAlter.delDataNow)(element, PREFIX_VISIBLE_PAGES);
    (0, _cssAlter.delStylePropNow)(element, VAR_CURRENT_PAGE);
    (0, _cssAlter.delStylePropNow)(element, VAR_TOTAL_PAGES);
    (0, _cssAlter.delStylePropNow)(element, VAR_VISIBLE_PAGES);
    (0, _cssAlter.delStylePropNow)(element, VAR_VISIBLE_GAPS);
    (0, _cssAlter.delStylePropNow)(element, VAR_TRANSLATED_PAGES);
    (0, _cssAlter.delStylePropNow)(element, VAR_TRANSLATED_GAPS);
    for (let idx = 0; idx < MH.lengthOf(pages); idx++) {
      (0, _cssAlter.removeClassesNow)(pages[idx], PREFIX_PAGE);
      for (const [el, listener] of [[pages[idx], null], [toggles[idx], toggleClickListener], [switches[idx], switchClickListener]]) {
        if (el) {
          (0, _cssAlter.delDataNow)(el, PREFIX_PAGE_STATE);
          (0, _cssAlter.delDataNow)(el, PREFIX_PAGE_NUMBER);
          (0, _cssAlter.delStylePropNow)(el, VAR_PAGE_NUMBER);
          if (listener) {
            (0, _event.removeEventListenerFrom)(el, MC.S_CLICK, listener);
          }
        }
      }
      MH.delAttr(pages[idx], S_ARIA_CURRENT);
    }
    if (nextSwitch) {
      (0, _event.removeEventListenerFrom)(nextSwitch, MC.S_CLICK, nextSwitchClickListener);
    }
    if (prevSwitch) {
      (0, _event.removeEventListenerFrom)(prevSwitch, MC.S_CLICK, prevSwitchClickListener);
    }
    (0, _cssAlter.removeClassesNow)(element, PREFIX_ROOT);
    if (pageContainer) {
      (0, _cssAlter.removeClassesNow)(pageContainer, PREFIX_PAGE_CONTAINER);
    }
  });
  if (isCarousel) {
    widget.onTransition(() => recalculateCarouselProps());
  }
  addWatchers();
  (0, _cssAlter.addClasses)(element, PREFIX_ROOT);
  if (pageContainer) {
    (0, _cssAlter.addClasses)(pageContainer, PREFIX_PAGE_CONTAINER);
  }
  const numPages = MH.lengthOf(pages);
  let numVisiblePages = numPages;
  (0, _cssAlter.setData)(element, MC.PREFIX_ORIENTATION, orientation);
  (0, _cssAlter.setData)(element, PREFIX_STYLE, pagerStyle);
  (0, _cssAlter.setBoolData)(element, PREFIX_IS_FULLSCREEN, isFullscreen);
  (0, _cssAlter.setBoolData)(element, PREFIX_USE_PARALLAX, isParallax);
  (0, _cssAlter.setData)(element, PREFIX_TOTAL_PAGES, numPages + "");
  (0, _cssAlter.setStyleProp)(element, VAR_TOTAL_PAGES, (numPages || 1) + "");
  for (const page of pages) {
    (0, _cssAlter.disableInitialTransition)(page);
    (0, _cssAlter.addClasses)(page, PREFIX_PAGE);
  }
  for (let idx = 0; idx < numPages; idx++) {
    setPageNumber(components, idx + 1);
    setPageState(components, idx + 1, S_NEXT);
    for (const [el, listener] of [[toggles[idx], toggleClickListener], [switches[idx], switchClickListener]]) {
      if (el) {
        (0, _event.addEventListenerTo)(el, MC.S_CLICK, listener);
      }
    }
  }
  if (nextSwitch) {
    (0, _event.addEventListenerTo)(nextSwitch, MC.S_CLICK, nextSwitchClickListener);
  }
  if (prevSwitch) {
    (0, _event.addEventListenerTo)(prevSwitch, MC.S_CLICK, prevSwitchClickListener);
  }
  if (initialPage < 1 || initialPage > numPages) {
    initialPage = 1;
  }
  methods._goToPage(initialPage);
};
const getMethods = (widget, components, element, config) => {
  const pages = components._pages;
  const scrollWatcher = _scrollWatcher.ScrollWatcher.reuse();
  const isFullscreen = config === null || config === void 0 ? void 0 : config.fullscreen;
  const disabledPages = {};
  const callbacks = MH.newSet();
  const fetchScrollOptions = async () => ({
    scrollable: await fetchClosestScrollable(element),
    // default amount is already 100%
    asFractionOf: "visible",
    weCanInterrupt: true
  });
  let currPageNum = -1;
  let lastPageNum = -1;
  let lastTransition = 0;
  const canTransition = gestureData => {
    if (widget.isDisabled()) {
      return false;
    }
    if ((gestureData === null || gestureData === void 0 ? void 0 : gestureData.device) !== MC.S_WHEEL) {
      return true;
    }
    const timeNow = MH.timeNow();
    if (timeNow - lastTransition > MIN_TIME_BETWEEN_WHEEL) {
      lastTransition = timeNow;
      return true;
    }
    return false;
  };
  const goToPage = async (pageNum, gestureData) => {
    pageNum = (0, _math.toInt)(pageNum, -1);
    if (pageNum === currPageNum || !canTransition(gestureData)) {
      return;
    }
    const numPages = MH.lengthOf(pages);
    if (currPageNum === 1 && pageNum === 0 || currPageNum === numPages && pageNum === numPages + 1) {
      // next/prev page beyond last/first
      if (isFullscreen) {
        scrollWatcher.scroll(pageNum ? (gestureData === null || gestureData === void 0 ? void 0 : gestureData.direction) === MC.S_RIGHT ? MC.S_RIGHT : MC.S_DOWN : (gestureData === null || gestureData === void 0 ? void 0 : gestureData.direction) === MC.S_LEFT ? MC.S_LEFT : MC.S_UP, await fetchScrollOptions()); // no need to await
      }
      return;
    }
    if (isPageDisabled(pageNum) || pageNum < 1 || pageNum > numPages) {
      // invalid or disabled
      return;
    }
    lastPageNum = currPageNum > 0 ? currPageNum : pageNum;
    currPageNum = pageNum;
    for (const callback of callbacks) {
      await callback.invoke(widget);
    }
    MH.delAttr(pages[lastPageNum - 1], S_ARIA_CURRENT);
    for (let n = lastPageNum; n !== currPageNum; currPageNum < lastPageNum ? n-- : n++) {
      if (!isPageDisabled(n)) {
        setPageState(components, n, currPageNum < lastPageNum ? S_NEXT : S_COVERED);
      }
    }
    setCurrentPage(element, {
      _current: currPageNum,
      _total: numPages
    }, isPageDisabled);
    MH.setAttr(pages[currPageNum - 1], S_ARIA_CURRENT);
    await setPageState(components, currPageNum, S_CURRENT);
  };
  const nextPage = async gestureData => {
    let targetPage = currPageNum + 1;
    while (isPageDisabled(targetPage)) {
      targetPage++;
    }
    return goToPage(targetPage, gestureData);
  };
  const prevPage = async gestureData => {
    let targetPage = currPageNum - 1;
    while (isPageDisabled(targetPage)) {
      targetPage--;
    }
    return goToPage(targetPage, gestureData);
  };
  const isPageDisabled = pageNum => disabledPages[pageNum] === true;
  const disablePage = async pageNum => {
    pageNum = (0, _math.toInt)(pageNum);
    if (widget.isDisabled() || pageNum < 1 || pageNum > MH.lengthOf(pages)) {
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
    setCurrentPage(element, {
      _current: currPageNum,
      _total: MH.lengthOf(pages)
    }, isPageDisabled);
    await setPageState(components, pageNum, MC.S_DISABLED);
  };
  const enablePage = async pageNum => {
    pageNum = (0, _math.toInt)(pageNum);
    if (widget.isDisabled() || !isPageDisabled(pageNum)) {
      return;
    }

    // set immediately for toggle to work without awaiting on it
    disabledPages[pageNum] = false;
    setCurrentPage(element, {
      _current: currPageNum,
      _total: MH.lengthOf(pages)
    }, isPageDisabled);
    await setPageState(components, pageNum, pageNum < currPageNum ? S_COVERED : S_NEXT);
  };
  const togglePage = pageNum => isPageDisabled(pageNum) ? enablePage(pageNum) : disablePage(pageNum);
  const onTransition = handler => callbacks.add((0, _callback.wrapCallback)(handler));
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
    _getCurrentPageNum: () => MH.lengthOf(pages) > 0 ? currPageNum : 0,
    _getPreviousPageNum: () => MH.lengthOf(pages) > 0 ? lastPageNum : 0,
    _onTransition: onTransition
  };
};
//# sourceMappingURL=pager.cjs.map