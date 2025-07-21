/*!
 * LISN.js v1.2.0
 * (c) 2025 @AaylaSecura
 * Released under the MIT License.
 */
(function (exports) {
  'use strict';

  /**
   * For minification optimization.
   *
   * @module
   * @ignore
   * @internal
   */

  const PREFIX = "lisn";
  const LOG_PREFIX = "[LISN.js]";
  const OBJECT = Object;
  const SYMBOL = Symbol;
  const ARRAY = Array;
  const STRING = String;
  const FUNCTION = Function;
  const MATH = Math;
  const NUMBER = Number;
  const PROMISE = Promise;
  const PI = MATH.PI;
  const INFINITY = Infinity;
  const S_ABSOLUTE = "absolute";
  const S_FIXED = "fixed";
  const S_STICKY = "sticky";
  const S_WIDTH = "width";
  const S_HEIGHT = "height";
  const S_TOP = "top";
  const S_BOTTOM = "bottom";
  const S_UP = "up";
  const S_DOWN = "down";
  const S_LEFT = "left";
  const S_RIGHT = "right";
  const S_AT = "at";
  const S_ABOVE = "above";
  const S_BELOW = "below";
  const S_IN = "in";
  const S_OUT = "out";
  const S_NONE = "none";
  const S_AMBIGUOUS = "ambiguous";
  const S_ADDED = "added";
  const S_REMOVED = "removed";
  const S_ATTRIBUTE = "attribute";
  const S_KEY = "key";
  const S_MOUSE = "mouse";
  const S_POINTER = "pointer";
  const S_TOUCH = "touch";
  const S_WHEEL = "wheel";
  const S_CLICK = "click";
  const S_HOVER = "hover";
  const S_PRESS = "press";
  const S_SCROLL = "scroll";
  const S_ZOOM = "zoom";
  const S_DRAG = "drag";
  const S_UNKNOWN = "unknown";
  const S_SCROLL_TOP = `${S_SCROLL}Top`;
  const S_SCROLL_LEFT = `${S_SCROLL}Left`;
  const S_SCROLL_WIDTH = `${S_SCROLL}Width`;
  const S_SCROLL_HEIGHT = `${S_SCROLL}Height`;
  const S_CLIENT_WIDTH = "clientWidth";
  const S_CLIENT_HEIGHT = "clientHeight";
  const S_SCROLL_TOP_FRACTION = `${S_SCROLL}TopFraction`;
  const S_SCROLL_LEFT_FRACTION = `${S_SCROLL}LeftFraction`;
  const S_HORIZONTAL = "horizontal";
  const S_VERTICAL = "vertical";
  const S_SKIP_INITIAL = "skipInitial";
  const S_DEBOUNCE_WINDOW = "debounceWindow";
  const S_TOGGLE = "toggle";
  const S_CANCEL = "cancel";
  const S_KEYDOWN = `${S_KEY}${S_DOWN}`;
  const S_MOUSEUP = `${S_MOUSE}${S_UP}`;
  const S_MOUSEDOWN = `${S_MOUSE}${S_DOWN}`;
  const S_POINTERUP = `${S_POINTER}${S_UP}`;
  const S_POINTERDOWN = `${S_POINTER}${S_DOWN}`;
  const S_POINTERENTER = `${S_POINTER}enter`;
  const S_POINTERLEAVE = `${S_POINTER}leave`;
  const S_POINTERMOVE = `${S_POINTER}move`;
  const S_POINTERCANCEL = `${S_POINTER}${S_CANCEL}`;
  const S_TOUCHSTART = `${S_TOUCH}start`;
  const S_TOUCHEND = `${S_TOUCH}end`;
  const S_TOUCHMOVE = `${S_TOUCH}move`;
  const S_TOUCHCANCEL = `${S_TOUCH}${S_CANCEL}`;
  const S_DRAGSTART = `${S_DRAG}start`;
  const S_DRAGEND = `${S_DRAG}end`;
  const S_DRAGENTER = `${S_DRAG}enter`;
  const S_DRAGOVER = `${S_DRAG}over`;
  const S_DROP = "drop";
  const S_SELECTSTART = "selectstart";
  const S_ATTRIBUTES = "attributes";
  const S_CHILD_LIST = "childList";
  const S_REVERSE = "reverse";
  const S_DRAGGABLE = "draggable";
  const S_DISABLED = "disabled";
  const S_ARROW = "arrow";
  const S_ROLE = "role";
  const S_AUTO$1 = "auto";
  const S_VISIBLE = "visible";
  const ARIA_PREFIX = "aria-";
  const S_ARIA_CONTROLS = ARIA_PREFIX + "controls";
  const PREFIX_WRAPPER$3 = `${PREFIX}-wrapper`;
  const PREFIX_INLINE_WRAPPER = `${PREFIX_WRAPPER$3}-inline`;
  const PREFIX_TRANSITION = `${PREFIX}-transition`;
  const PREFIX_TRANSITION_DISABLE = `${PREFIX_TRANSITION}__disable`;
  const PREFIX_HIDE = `${PREFIX}-hide`;
  const PREFIX_SHOW = `${PREFIX}-show`;
  const PREFIX_DISPLAY = `${PREFIX}-display`;
  const PREFIX_UNDISPLAY = `${PREFIX}-undisplay`;
  const PREFIX_PLACE = `${PREFIX}-place`;
  const PREFIX_ORIENTATION = `${PREFIX}-orientation`;
  const PREFIX_POSITION = `${PREFIX}-position`;
  const PREFIX_GHOST = `${PREFIX}-ghost`;
  const PREFIX_NO_SELECT = `${PREFIX}-no-select`;
  const PREFIX_NO_TOUCH_ACTION = `${PREFIX}-no-touch-action`;
  const PREFIX_NO_WRAP = `${PREFIX}-no-wrap`;
  const S_ANIMATE = "animate";
  const ANIMATE_PREFIX = `${PREFIX}-${S_ANIMATE}__`;
  const PREFIX_ANIMATE_DISABLE = `${ANIMATE_PREFIX}disable`;
  const PREFIX_ANIMATE_PAUSE = `${ANIMATE_PREFIX}pause`;
  const PREFIX_ANIMATE_REVERSE = `${ANIMATE_PREFIX}${S_REVERSE}`;

  /**
   * @module Errors
   */


  /**
   * Base error type emitted by LISN.
   */
  class LisnError extends Error {}

  /**
   * Error type emitted for invalid input or incorrect usage of a function.
   */
  class LisnUsageError extends LisnError {
    constructor(message = "") {
      super(`${LOG_PREFIX} Incorrect usage: ${message}`);
      this.name = "LisnUsageError";
    }
  }

  /**
   * Error type emitted if an assertion is wrong => report bug.
   */
  class LisnBugError extends LisnError {
    constructor(message = "") {
      super(`${LOG_PREFIX} Please report a bug: ${message}`);
      this.name = "LisnBugError";
    }
  }

  /**
   * For minification optimization
   *
   * @module
   * @ignore
   * @internal
   */


  // credit: underscore.js
  const root = typeof self === "object" && self.self === self && self || typeof global == "object" && global.global === global && global || Function("return this")() || {};
  const userAgent = typeof navigator === "undefined" ? "" : navigator.userAgent;
  const kebabToCamelCase$1 = str => str.replace(/-./g, m => toUpperCase(m.charAt(1)));
  const camelToKebabCase$1 = str => str.replace(/[A-Z][a-z]/g, m => "-" + toLowerCase(m)).replace(/[A-Z]+/, m => "-" + toLowerCase(m));
  const prefixName = name => `${PREFIX}-${name}`;
  const prefixCssVar = name => "--" + prefixName(name);
  const prefixCssJsVar = name => prefixCssVar("js--" + name);
  const prefixData = name => `data-${camelToKebabCase$1(name)}`;
  const toLowerCase = s => s.toLowerCase();
  const toUpperCase = s => s.toUpperCase();
  const timeNow = Date.now.bind(Date);
  const timeSince = startTime => timeNow() - startTime;
  const hasDOM = () => typeof document !== "undefined";
  const getWindow = () => window;
  const getDoc = () => document;
  const getDocElement = () => getDoc().documentElement;
  const getDocScrollingElement = () => getDoc().scrollingElement;
  const getBody = () => getDoc().body;
  const getReadyState = () => getDoc().readyState;
  const getPointerType = event => isPointerEvent(event) ? event.pointerType : isMouseEvent(event) ? "mouse" : null;
  const onAnimationFrame = callback => requestAnimationFrame(callback);
  const createElement = (tagName, options) => getDoc().createElement(tagName, options);
  const createButton = (label = "", tag = "button") => {
    const btn = createElement(tag);
    setTabIndex(btn);
    setAttr(btn, S_ROLE, "button");
    setAttr(btn, ARIA_PREFIX + "label", label);
    return btn;
  };
  const isNullish = v => v === undefined || v === null;
  const isEmpty = v => isNullish(v) || v === "";
  const isIterableObject = v => isNonPrimitive(v) && SYMBOL.iterator in v;
  const isArray = v => isInstanceOf(v, ARRAY);
  const isObject = v => isInstanceOf(v, OBJECT);
  const isNonPrimitive = v => v !== null && typeOf(v) === "object";

  // only primitive number
  const isNumber = v => typeOf(v) === "number";

  /* eslint-disable-next-line @typescript-eslint/no-wrapper-object-types */
  const isString = v => typeOf(v) === "string" || isInstanceOf(v, STRING);
  const isLiteralString = v => typeOf(v) === "string";
  const isBoolean = v => typeOf(v) === "boolean";

  /* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type */
  const isFunction = v => typeOf(v) === "function" || isInstanceOf(v, FUNCTION);
  const isDoc = target => target === getDoc();
  const isMouseEvent = event => isInstanceOf(event, MouseEvent);
  const isPointerEvent = event => typeof PointerEvent !== "undefined" && isInstanceOf(event, PointerEvent);
  const isTouchPointerEvent = event => isPointerEvent(event) && getPointerType(event) === S_TOUCH;
  const isWheelEvent = event => isInstanceOf(event, WheelEvent);
  const isKeyboardEvent = event => isInstanceOf(event, KeyboardEvent);
  const isTouchEvent = event => typeof TouchEvent !== "undefined" && isInstanceOf(event, TouchEvent);
  const isElement = target => isInstanceOf(target, Element);
  const isHTMLElement = target => isInstanceOf(target, HTMLElement);
  const isNodeBAfterA = (nodeA, nodeB) => (nodeA.compareDocumentPosition(nodeB) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
  const strReplace = (s, match, replacement) => s.replace(match, replacement);
  const setTimer = root.setTimeout.bind(root);
  const clearTimer = root.clearTimeout.bind(root);
  const getBoundingClientRect = element => element.getBoundingClientRect();

  // Copy size properties explicitly to another object so they can be used with
  // the spread operator (DOMRect/DOMRectReadOnly's properties are not enumerable)
  const copyBoundingRectProps = rect => {
    return {
      x: rect.x,
      left: rect.left,
      right: rect.right,
      [S_WIDTH]: rect[S_WIDTH],
      y: rect.y,
      top: rect.top,
      bottom: rect.bottom,
      [S_HEIGHT]: rect[S_HEIGHT]
    };
  };
  const querySelector = (root, selector) => root.querySelector(selector);
  const querySelectorAll = (root, selector) => root.querySelectorAll(selector);
  const docQuerySelector = selector => querySelector(getDoc(), selector);
  const docQuerySelectorAll = selector => querySelectorAll(getDoc(), selector);
  const getElementById = id => getDoc().getElementById(id);
  const getAttr = (element, name) => element.getAttribute(name);
  const setAttr = (element, name, value = "true") => element.setAttribute(name, value);
  const unsetAttr = (element, name) => element.setAttribute(name, "false");
  const delAttr = (element, name) => element.removeAttribute(name);
  const includes = (arr, v, startAt) => arr.indexOf(v, startAt) >= 0;
  const some = (array, predicate) => array.some(predicate);
  const filter = (array, filterFn) => array.filter(filterFn);
  const filterBlank = array => {
    const result = array ? filter(array, v => !isEmpty(v)) : undefined;
    return lengthOf(result) ? result : undefined;
  };
  const sizeOf = obj => {
    var _obj$size;
    return (_obj$size = obj === null || obj === void 0 ? void 0 : obj.size) !== null && _obj$size !== void 0 ? _obj$size : 0;
  };
  const lengthOf = obj => {
    var _obj$length;
    return (_obj$length = obj === null || obj === void 0 ? void 0 : obj.length) !== null && _obj$length !== void 0 ? _obj$length : 0;
  };
  const lastOf = a => a === null || a === void 0 ? void 0 : a.slice(-1)[0];
  const firstOf = a => a === null || a === void 0 ? void 0 : a.slice(0, 1)[0];
  const tagName = element => element.tagName;
  const hasTagName = (element, tag) => toLowerCase(tagName(element)) === toLowerCase(tag);
  const preventDefault = event => event.preventDefault();
  const arrayFrom = ARRAY.from.bind(ARRAY);
  const keysOf = obj => OBJECT.keys(obj);
  const defineProperty = OBJECT.defineProperty.bind(OBJECT);

  // use it in place of object spread
  const merge = (...a) => {
    return OBJECT.assign({}, ...a);
  };
  const copyObject = obj => merge(obj);
  const promiseResolve = PROMISE.resolve.bind(PROMISE);
  const promiseAll = PROMISE.all.bind(PROMISE);
  const assign = OBJECT.assign.bind(OBJECT);
  OBJECT.freeze.bind(OBJECT);
  const hasOwnProp = (o, prop) => OBJECT.prototype.hasOwnProperty.call(o, prop);
  const preventExtensions = OBJECT.preventExtensions.bind(OBJECT);
  const stringify = JSON.stringify.bind(JSON);
  const floor = MATH.floor.bind(MATH);
  const ceil = MATH.ceil.bind(MATH);
  const log2 = MATH.log2.bind(MATH);
  const sqrt = MATH.sqrt.bind(MATH);
  const max = MATH.max.bind(MATH);
  const min = MATH.min.bind(MATH);
  const abs = MATH.abs.bind(MATH);
  const round = MATH.round.bind(MATH);
  const pow = MATH.pow.bind(MATH);
  const exp = MATH.exp.bind(MATH);
  const parseFloat = NUMBER.parseFloat.bind(NUMBER);
  const isNaN = NUMBER.isNaN.bind(NUMBER);
  const isInstanceOf = (value, Class) => value instanceof Class;
  const constructorOf = obj => obj.constructor;
  const typeOf = obj => typeof obj;
  const typeOrClassOf = obj => {
    var _constructorOf;
    return isObject(obj) ? (_constructorOf = constructorOf(obj)) === null || _constructorOf === void 0 ? void 0 : _constructorOf.name : typeOf(obj);
  };
  const parentOf = element => {
    var _element$parentElemen;
    return (_element$parentElemen = element === null || element === void 0 ? void 0 : element.parentElement) !== null && _element$parentElemen !== void 0 ? _element$parentElemen : null;
  };
  const childrenOf = element => (element === null || element === void 0 ? void 0 : element.children) || [];
  const targetOf = obj => obj === null || obj === void 0 ? void 0 : obj.target;
  const currentTargetOf = obj => obj === null || obj === void 0 ? void 0 : obj.currentTarget;
  const classList = element => element === null || element === void 0 ? void 0 : element.classList;
  const S_TABINDEX = "tabindex";
  const getTabIndex = element => getAttr(element, S_TABINDEX);
  const setTabIndex = (element, index = "0") => setAttr(element, S_TABINDEX, index);
  const unsetTabIndex = element => delAttr(element, S_TABINDEX);
  const remove = obj => obj === null || obj === void 0 ? void 0 : obj.remove();
  const deleteObjKey = (obj, key) => delete obj[key];
  const deleteKey = (map, key) => map === null || map === void 0 ? void 0 : map.delete(key);
  const elScrollTo = (element, coords, behavior = "instant") => element.scrollTo(merge({
    behavior
  }, coords));
  const newPromise = executor => new Promise(executor);
  const newMap = entries => new Map(entries);
  const newWeakMap = entries => new WeakMap(entries);
  const newSet = values => new Set(values);
  const newWeakSet = values => new WeakSet(values);
  const newIntersectionObserver = (callback, options) => new IntersectionObserver(callback, options);
  const newResizeObserver = callback => typeof ResizeObserver === "undefined" ? null : new ResizeObserver(callback);
  const newMutationObserver = callback => new MutationObserver(callback);
  const usageError = msg => new LisnUsageError(msg);
  const bugError = msg => new LisnBugError(msg);
  const illegalConstructorError = useWhat => usageError(`Illegal constructor. Use ${useWhat}.`);
  const CONSOLE = console;
  const consoleDebug = CONSOLE.debug.bind(CONSOLE);
  const consoleLog = CONSOLE.log.bind(CONSOLE);
  const consoleInfo = CONSOLE.info.bind(CONSOLE);
  const consoleWarn = CONSOLE.warn.bind(CONSOLE);
  const consoleError = CONSOLE.error.bind(CONSOLE);

  // --------------------

  /**
   * @module Settings
   */


  /**
   * LISN's settings.
   * @readonly
   *
   * If you wish to modify them, then you need to do so immediately after loading
   * LISN before you instantiate any watchers, etc. For example:
   *
   * ```html
   * <!doctype html>
   * <html>
   *   <head>
   *     <meta charset="UTF-8" />
   *     <meta name="viewport" content="width=device-width" />
   *     <script src="lisn.js" charset="utf-8"></script>
   *     <script charset="utf-8">
   *       // modify LISN settings, for example:
   *       LISN.settings.deviceBreakpoints.desktop = 1024;
   *     </script>
   *   </head>
   *   <body>
   *   </body>
   * </html>
   * ```
   */
  const settings = preventExtensions({
    /**
     * A unique selector (preferably `#some-id`) for the element that holds the
     * main page content, if other than `document.body`.
     *
     * E.g. if your main content is inside a custom scrollable container, rather
     * than directly in `document.body`, then pass a selector for it here.
     *
     * The element must be scrollable, i.e. have a fixed size and `overflow: scroll`.
     *
     * **IMPORTANT:** You must set this before initializing any watchers, widgets,
     * etc. If you are using the HTML API, then you must set this before the
     * document `readyState` becomes interactive.
     *
     * @defaultValue null // document.scrollingElement
     * @category Generic
     */
    mainScrollableElementSelector: null,
    /**
     * This setting allows us to automatically wrap certain elements or groups of
     * elements into a single `div` or `span` element to allow for more reliable
     * or efficient working of certain features. In particular:
     *
     * 1. View tracking using relative offsets and a scrolling root **requires wrapping**
     *
     * When using view position tracking with a percentage offset specification
     * (e.g. `top: 50%`) _and_ a custom root element that is scrollable_ (and
     * obviously has a size smaller than the content), you **MUST** enable
     * content wrapping, otherwise the trigger offset elements cannot be
     * positioned relative to the scrolling _content size_.
     *
     * 2. Scroll tracking
     *
     * When using scroll tracking, including scrollbars, on a scrolling element
     * (that obviously has a size smaller than the content), it's recommended for
     * the content of the scrollable element to be wrapped in a single `div`
     * container, to allow for more efficient and reliable detection of changes
     * in the _scrollable content_ size.
     *
     * If content wrapping is disabled, when scroll tracking is used on a given
     * element (other than the root of the document), each of the immediate
     * children of the scrollable element have their sizes tracked, which could
     * lead to more resource usage.
     *
     * 3. Scrollbars on custom elements
     *
     * When you setup a {@link Widgets.Scrollbar} widget for a custom
     * scrollable element that may not be the main scrollable (and therefore
     * won't take up the full viewport all the time), then to be able to position
     * to scrollbar relative to the scrollable element, its content needs to be
     * wrapped.
     *
     * If this setting is OFF, then the scrollbars on custom elements have to
     * rely on position sticky which doesn't have as wide browser support as the
     * default option.
     *
     * 4. Animating on viewport enter/leave
     *
     * For elements that have transforms applied as part of an animation or
     * transition, if you wish to run or reverse the animation when the element
     * enters or leaves the viewport, then the transform can interfere with the
     * viewport tracking. For example, if undoing the animation as soon as the
     * element leaves the viewport makes it enter it again (because it's moved),
     * then this will result in a glitch.
     *
     * If content wrapping is disabled, then to get around such issues, a dummy
     * element is positioned on top of the actual element and is the one tracked
     * across the viewport instead. Either approach could cause issues depending
     * on your CSS, so it's your choice which one is applied.
     *
     * ----------
     *
     * **IMPORTANT:** Certain widgets always require wrapping of elements or their
     * children. This setting only applies in cases where wrapping is optional.
     * If you can, it's recommended to leave this setting ON. You can still try to
     * disable wrapping on a per-element basis by setting `data-lisn-no-wrap`
     * attribute on it. Alternatively, if the elements that need wrapping are
     * already wrapped in an element with a class `lisn-wrapper`, this will be
     * used as the wrapper.
     *
     * @defaultValue true
     * @category Generic
     */
    contentWrappingAllowed: true,
    // [TODO v2] rename this setting

    /**
     * The timeout in milliseconds for waiting for the `document.readyState` to
     * become `complete`. The timer begins _once the `readyState` becomes
     * `interactive`_.
     *
     * The page will be considered "ready" either when the `readyState` becomes
     * `complete` or this many milliseconds after it becomes `interactive`,
     * whichever is first.
     *
     * Set to 0 or a negative number to disable timeout.
     *
     * @defaultValue 2000 // i.e. 2s
     * @category Generic
     */
    pageLoadTimeout: 2000,
    /**
     * This enables LISN's HTML API. Then the page will be parsed (and watched
     * for dynamically added elements at any time) for any elements matching a
     * widget selector. Any element that has a matching CSS class or data
     * attribute will be setup according to the relevant widget, which may wrap,
     * clone or add attributes to the element.
     *
     * This is enabled by default for bundles, and disabled otherwise.
     *
     * **IMPORTANT:** You must set this before the document `readyState` becomes
     * interactive.
     *
     * @defaultValue `false` in general, but `true` in browser bundles
     * @category Widgets
     */
    autoWidgets: false,
    /**
     * Default setting for
     * {@link Widgets.ScrollbarConfig.hideNative | ScrollbarConfig.hideNative}.
     *
     * @defaultValue true
     * @category Widgets/Scrollbar
     */
    scrollbarHideNative: true,
    /**
     * Default setting for
     * {@link Widgets.ScrollbarConfig.onMobile | ScrollbarConfig.onMobile}.
     *
     * @defaultValue false
     * @category Widgets/Scrollbar
     */
    scrollbarOnMobile: false,
    /**
     * Default setting for
     * {@link Widgets.ScrollbarConfig.positionH | ScrollbarConfig.positionH}.
     *
     * @defaultValue "bottom"
     * @category Widgets/Scrollbar
     */
    scrollbarPositionH: "bottom",
    /**
     * Default setting for
     * {@link Widgets.ScrollbarConfig.positionV | ScrollbarConfig.positionV}.
     *
     * @defaultValue "right"
     * @category Widgets/Scrollbar
     */
    scrollbarPositionV: "right",
    /**
     * Default setting for
     * {@link Widgets.ScrollbarConfig.autoHide | ScrollbarConfig.autoHide}.
     *
     * @defaultValue -1
     * @category Widgets/Scrollbar
     */
    scrollbarAutoHide: -1,
    /**
     * Default setting for
     * {@link Widgets.ScrollbarConfig.clickScroll | ScrollbarConfig.clickScroll}.
     *
     * @defaultValue true
     * @category Widgets/Scrollbar
     */
    scrollbarClickScroll: true,
    /**
     * Default setting for
     * {@link Widgets.ScrollbarConfig.dragScroll | ScrollbarConfig.dragScroll}.
     *
     * @defaultValue true
     * @category Widgets/Scrollbar
     */
    scrollbarDragScroll: true,
    /**
     * Default setting for
     * {@link Widgets.ScrollbarConfig.useHandle | ScrollbarConfig.useHandle}.
     *
     * @defaultValue false
     * @category Widgets/Scrollbar
     */
    scrollbarUseHandle: false,
    /**
     * Default setting for
     * {@link Widgets.SameHeightConfig.diffTolerance | SameHeightConfig.diffTolerance}.
     *
     * @defaultValue 15
     * @category Widgets/SameHeight
     */
    sameHeightDiffTolerance: 15,
    /**
     * Default setting for
     * {@link Widgets.SameHeightConfig.resizeThreshold | SameHeightConfig.resizeThreshold}.
     *
     * @defaultValue 5
     * @category Widgets/SameHeight
     */
    sameHeightResizeThreshold: 5,
    /**
     * Default setting for
     * {@link Widgets.SameHeightConfig.debounceWindow | SameHeightConfig.debounceWindow}.
     *
     * @defaultValue 100
     * @category Widgets/SameHeight
     */
    sameHeightDebounceWindow: 100,
    /**
     * Default setting for
     * {@link Widgets.SameHeightConfig.minGap | SameHeightConfig.minGap}.
     *
     * @defaultValue 30
     * @category Widgets/SameHeight
     */
    sameHeightMinGap: 30,
    /**
     * Default setting for
     * {@link Widgets.SameHeightConfig.maxFreeR | SameHeightConfig.maxFreeR}.
     *
     * @defaultValue 0.4
     * @category Widgets/SameHeight
     */
    sameHeightMaxFreeR: 0.4,
    /**
     * Default setting for
     * {@link Widgets.SameHeightConfig.maxWidthR | SameHeightConfig.maxWidthR}.
     *
     * @defaultValue 1.7
     * @category Widgets/SameHeight
     */
    sameHeightMaxWidthR: 1.7,
    /**
     * Set custom device breakpoints as width in pixels.
     *
     * The value of each sets its lower limit, i.e. it specifies a device whose
     * width is larger than the given value (and up to the next larger one).
     *
     * If you specify only some of the below devices, then the other ones will
     * keep their default breakpoint values.
     *
     * Adding device types, other than the ones listed below is not supported.
     *
     * @category Device layouts
     */
    deviceBreakpoints: {
      /**
       * This should be left as 0 as it's the catch-all for anything narrower
       * than "mobile-wide".
       *
       * @defaultValue 0
       */
      mobile: 0,
      /**
       * Anything wider than the given value is "mobile-wide", up to the value of
       * "tablet".
       *
       * @defaultValue 576
       */
      "mobile-wide": 576,
      /**
       * Anything wider than the given value is "tablet", up to the value of
       * "desktop".
       *
       * @defaultValue 768
       */
      tablet: 768,
      // tablet is anything above this (up to desktop)

      /**
       * Anything wider than the given value is "desktop".
       *
       * @defaultValue 992
       */
      desktop: 992 // desktop is anything above this
    },
    /**
     * Set custom aspect ratio breakpoints (as ratio of width to height).
     *
     * The value of each sets its lower limit, i.e. it specifies an aspect ratio
     * that is wider than the given value (and up to the next wider one).
     *
     * If you specify only some of the below aspect ratios, then the other ones
     * will keep their default breakpoint values.
     *
     * Adding aspect ratio types, other than the ones listed below is not
     * supported.
     *
     * @category Device layouts
     */
    aspectRatioBreakpoints: {
      /**
       * This should be left as 0 as it's the catch-all for anything with
       * a narrower aspect ratio than "tall".
       *
       * @defaultValue 0
       */
      "very-tall": 0,
      // very tall is up to 9:16

      /**
       * Anything with a wider aspect ratio than the given value is "tall", up to
       * the value of "square".
       *
       * @defaultValue 9 / 16
       */
      tall: 9 / 16,
      // tall is between 9:16 and 3:4

      /**
       * Anything with a wider aspect ratio than the given value is "square", up
       * to the value of "wide".
       *
       * @defaultValue 3 / 4
       */
      square: 3 / 4,
      // square is between 3:4 and 4:3

      /**
       * Anything with a wider aspect ratio than the given value is "wide", up to
       * the value of "very-wide".
       *
       * @defaultValue 4 / 3
       */
      wide: 4 / 3,
      // wide is between 4:3 and 16:9

      /**
       * Anything with a wider aspect ratio than the given value is "very-wide".
       *
       * @defaultValue 16 / 9
       */
      "very-wide": 16 / 9 // very wide is above 16:9
    },
    /**
     * The CSS class that enables light theme.
     *
     * **IMPORTANT:** If you change this, you should also change the
     * `$light-theme-cls` variable in the SCSS configuration, or otherwise add the
     * following to your CSS:
     *
     * :root,
     * .custom-light-theme-cls {
     *   --lisn-color-fg: some-dark-color;
     *   --lisn-color-fg-t: some-dark-color-with-transparency;
     *   --lisn-color-bg: some-light-color;
     *   --lisn-color-bg-t: some-light-color-with-transparency;
     * }
     */
    lightThemeClassName: "light-theme",
    /**
     * The CSS class that enables dark theme.
     *
     * **IMPORTANT:** If you change this, you should also change the
     * `$dark-theme-cls` variable in the SCSS configuration, or otherwise add the
     * following to your CSS:
     *
     * .custom-dark-theme-cls {
     *   --lisn-color-fg: some-light-color;
     *   --lisn-color-fg-t: some-light-color-with-transparency;
     *   --lisn-color-bg: some-dark-color;
     *   --lisn-color-bg-t: some-dark-color-with-transparency;
     * }
     */
    darkThemeClassName: "dark-theme",
    /**
     * Used to determine the effective delta in pixels for gestures triggered by
     * some key (arrows) and wheel events (where the browser reports the delta
     * mode to be LINE).
     *
     * Value is in pixels.
     *
     * @defaultValue 40
     * @category Gestures
     */
    deltaLineHeight: 40,
    /**
     * Used to determine the effective delta in pixels for gestures triggered by
     * some wheel events (where the browser reports the delta mode to be PAGE).
     *
     * Value is in pixels.
     *
     * @defaultValue 1600
     * @category Gestures
     */
    deltaPageWidth: 1600,
    /**
     * Used to determine the effective delta in pixels for gestures triggered by
     * some key (PageUp/PageDown/Space) and wheel events (where the browser
     * reports the delta mode to be PAGE).
     *
     * Value is in pixels.
     *
     * @defaultValue 800
     * @category Gestures
     */
    deltaPageHeight: 800,
    /**
     * Controls the debugging verbosity level. Values from 0 (none) to 10 (insane)
     * are recognized.
     *
     * **Note:** Logging is not available in bundles except in the "debug" bundle.
     *
     * @defaultValue `0` except in the "debug" bundle where it defaults to 10
     * @category Logging
     */
    verbosityLevel: 0,
    /**
     * The URL of the remote logger to connect to. LISN uses
     * {@link https://socket.io/docs/v4/client-api/ | socket.io-client}
     * to talk to the client and emits messages on the following namespaces:
     *
     * - `console.debug`
     * - `console.log`
     * - `console.info`
     * - `console.warn`
     * - `console.error`
     *
     * There is a simple logging server that ships with LISN, see the source
     * code repository.
     *
     * You can always explicitly disable remote logging on a given page by
     * setting `disableRemoteLog=1` query parameter in the URL.
     *
     * **Note:** Logging is not available in bundles (except in the `debug` bundle).
     *
     * @defaultValue null
     * @category Logging
     */
    remoteLoggerURL: null,
    /**
     * Enable remote logging only on mobile devices.
     *
     * You can always disable remote logging for any page by setting
     * `disableRemoteLog=1` URL query parameter.
     *
     * **Note:** Logging is not available in bundles (except in the `debug` bundle).
     *
     * @defaultValue false
     * @category Logging
     */
    remoteLoggerOnMobileOnly: false
  });

  // --------------------

  /**
   * @module Utils
   */

  /**
   * Round a number to the given decimal precision.
   *
   * @category Math
   */
  const roundNumTo = (value, numDecimal = 0) => {
    const multiplicationFactor = pow(10, numDecimal);
    return round(value * multiplicationFactor) / multiplicationFactor;
  };

  /**
   * Returns true if the given value is a valid _finite_ number.
   *
   * @category Validation
   */
  const isValidNum = value => isNumber(value) && NUMBER.isFinite(value);

  /**
   * If the given value is a valid _finite_ number, it is returned, otherwise
   * the default is returned.
   *
   * @category Math
   */
  const toNum = (value, defaultValue = 0) => {
    const numValue = isLiteralString(value) ? parseFloat(value) : value;

    // parseFloat will strip trailing non-numeric characters, so we check that
    // the parsed number is equal to the string, if it was a string, using loose
    // equality, in order to make sure the entire string was a number.
    return isValidNum(numValue) && numValue == value ? numValue : defaultValue;
  };

  /**
   * If the given value is a valid _finite integer_ number, it is returned,
   * otherwise the default is returned.
   *
   * @category Math
   */
  const toInt = (value, defaultValue = 0) => {
    let numValue = toNum(value, null);
    numValue = numValue === null ? numValue : floor(numValue);

    // Ensure that the parsed int equaled the original by loose equality.
    return isValidNum(numValue) && numValue == value ? numValue : defaultValue;
  };

  /**
   * If the given value is a valid non-negative _finite_ number, it is returned,
   * otherwise the default is returned.
   *
   * @category Math
   */
  const toNonNegNum = (value, defaultValue = 0) => {
    const numValue = toNum(value, null);
    return numValue !== null && numValue >= 0 ? numValue : defaultValue;
  };

  /**
   * If the given value is a valid positive number, it is returned, otherwise the
   * default is returned.
   *
   * @category Math
   */
  const toPosNum = (value, defaultValue = 0) => {
    const numValue = toNum(value, null);
    return numValue !== null && numValue > 0 ? numValue : defaultValue;
  };

  /**
   * Returns the given number bound by min and/or max value.
   *
   * If the value is not a valid number, then `defaultValue` is returned if given
   * (_including if it is null_), otherwise `limits.min` if given and not null,
   * otherwise `limits.max` if given and not null, or finally 0.
   *
   * If the value is outside the bounds, then:
   * - if `defaultValue` is given, `defaultValue` is returned (_including if it
   *   is null_)
   * - otherwise, the min or the max value (whichever one is violated) is
   *   returned
   *
   * @category Math
   */
  const toNumWithBounds = (value, limits, defaultValue) => {
    var _limits$min, _limits$max;
    const isDefaultGiven = defaultValue !== undefined;
    const numValue = toNum(value, null);
    const min = (_limits$min = limits === null || limits === void 0 ? void 0 : limits.min) !== null && _limits$min !== void 0 ? _limits$min : null;
    const max = (_limits$max = limits === null || limits === void 0 ? void 0 : limits.max) !== null && _limits$max !== void 0 ? _limits$max : null;
    let result;
    if (!isValidNum(numValue)) {
      var _ref;
      result = isDefaultGiven ? defaultValue : (_ref = min !== null && min !== void 0 ? min : max) !== null && _ref !== void 0 ? _ref : 0;
    } else if (min !== null && numValue < min) {
      result = isDefaultGiven ? defaultValue : min;
    } else if (max !== null && numValue > max) {
      result = isDefaultGiven ? defaultValue : max;
    } else {
      result = numValue;
    }
    return result;
  };

  /**
   * Returns the largest absolute value among the given ones.
   *
   * The result is always positive.
   *
   * @category Math
   */
  const maxAbs = (...values) => max(...values.map(v => abs(v)));

  /**
   * Returns the smallest absolute value among the given ones.
   *
   * The result is always positive.
   *
   * @category Math
   */
  const minAbs = (...values) => min(...values.map(v => abs(v)));

  /**
   * Returns the value with the largest absolute value among the given ones.
   *
   * The result can be negative.
   *
   * @category Math
   */
  const havingMaxAbs = (...values) => lengthOf(values) ? values.sort((a, b) => abs(b) - abs(a))[0] : -INFINITY;

  /**
   * Returns the value with the smallest absolute value among the given ones.
   *
   * The result can be negative.
   *
   * @category Math
   */
  const havingMinAbs = (...values) => lengthOf(values) ? values.sort((a, b) => abs(a) - abs(b))[0] : INFINITY;

  /**
   * Returns the angle (in radians) that the vector defined by the given x, y
   * makes with the positive horizontal axis.
   *
   * The angle returned is in the range -PI to PI, not including -PI.
   *
   * @category Math
   */
  const hAngle = (x, y) => normalizeAngle(MATH.atan2(y, x)); // ensure that -PI is transformed to +PI

  /**
   * Normalizes the given angle (in radians) so that it's in the range -PI to PI,
   * not including -PI.
   *
   * @category Math
   */
  const normalizeAngle = a => {
    // ensure it's positive in the range 0 to 2 PI
    while (a < 0 || a > PI * 2) {
      a += (a < 0 ? 1 : -1) * PI * 2;
    }

    // then, if > PI, offset by - 2PI
    return a > PI ? a - PI * 2 : a;
  };

  /**
   * Converts the given angle in degrees to radians.
   *
   * @category Math
   */
  const degToRad = a => a * PI / 180;

  /**
   * Converts the given angle in radians to degrees.
   *
   * @category Math
   */
  const radToDeg = a => a * 180 / PI;

  /**
   * Returns true if the given vectors point in the same direction.
   *
   * @param angleDiffThreshold
   *                  Sets the threshold in degrees when comparing the angles of
   *                  two vectors. E.g. for 5 degrees threshold, directions
   *                  whose vectors are within 5 degrees of each other are
   *                  considered parallel.
   *                  It doesn't make sense for this value to be < 0 or >= 90
   *                  degrees. If it is, it's forced to be positive (absolute)
   *                  and <= 89.99.
   *
   * @category Math
   */
  const areParallel = (vA, vB, angleDiffThreshold = 0) => {
    const angleA = hAngle(vA[0], vA[1]);
    const angleB = hAngle(vB[0], vB[1]);
    angleDiffThreshold = min(89.99, abs(angleDiffThreshold));
    return abs(normalizeAngle(angleA - angleB)) <= degToRad(angleDiffThreshold);
  };

  /**
   * Returns true if the given vectors point in the opposite direction.
   *
   * @param angleDiffThreshold
   *                  Sets the threshold in degrees when comparing the angles of
   *                  two vectors. E.g. for 5 degrees threshold, directions
   *                  whose vectors are within 175-185 degrees of each other are
   *                  considered antiparallel.
   *                  It doesn't make sense for this value to be < 0 or >= 90
   *                  degrees. If it is, it's forced to be positive (absolute)
   *                  and <= 89.99.
   *
   * @category Math
   */
  const areAntiParallel = (vA, vB, angleDiffThreshold = 0) => areParallel(vA, [-vB[0], -vB[1]], angleDiffThreshold);

  /**
   * Returns the distance between two points on the screen.
   *
   * @category Math
   */
  const distanceBetween = (ptA, ptB) => sqrt(pow(ptA[0] - ptB[0], 2) + pow(ptA[1] - ptB[1], 2));

  /**
   * Returns the two roots of the quadratic equation with coefficients
   * `a`, `b` & `c`, i.e. `a * x^2 + b * x + c = 0`
   *
   * The roots may be `NaN` if the quadratic has no real solutions.
   *
   * @category Math
   */
  const quadraticRoots = (a, b, c) => {
    const z = sqrt(b * b - 4 * a * c);
    return [(-b + z) / (2 * a), (-b - z) / (2 * a)];
  };

  /**
   * Returns the value that an "easing" quadratic function would have at the
   * given x.
   *
   * @see https://easings.net/#easeInOutQuad
   *
   * @param x Must be between 0 and 1.
   *
   * @returns The current y-axis value between 0 and 1.
   *
   * @category Math
   */
  const easeInOutQuad = x => x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;

  /**
   * Returns the new position and velocity for a critically damped user-driven
   * spring state toward a current target position.
   *
   * @param [settings.lTarget]       Target final position.
   * @param [settings.dt]            Time step in milliseconds since the last call.
   *                                 Must be small for the returned values to be
   *                                 meaningful.
   * @param [settings.lag]           Lag in milliseconds (how long it should take
   *                                 for it to reach the final position). Must be
   *                                 positive.
   * @param [settings.l = 0]         Current position (starting or one returned by
   *                                 previous call).
   * @param [settings.v = 0]         Current velocity (returned by previous call).
   * @param [settings.precision = 2] Number of decimal places to round position to
   *                                 in order to determine when it's "done".
   * @returns Updated position and velocity
   *
   * @since v1.2.0
   *
   * @category Math
   */
  const criticallyDamped = settings => {
    const {
      lTarget,
      precision = 2
    } = settings;
    const lag = toNumWithBounds(settings.lag, {
      min: 1
    }) / 1000; // to seconds

    // Since the position only approaches asymptotically the target it never truly
    // reaches it exactly we need an approximation to calculate w0. N determines
    // how far away from the target position we are after `lag` milliseconds.
    const N = 7;
    const w0 = N / lag;
    let {
      l = 0,
      v = 0,
      dt
    } = settings;
    dt /= 1000; // to seconds

    if (roundNumTo(l - lTarget, precision) === 0) {
      // we're done
      l = lTarget;
      v = 0;
    } else if (dt > 0) {
      const A = l - lTarget;
      const B = v + w0 * A;
      const e = exp(-w0 * dt);
      l = lTarget + (A + B * dt) * e;
      v = (B - w0 * (A + B * dt)) * e;
    }
    return {
      l,
      v
    };
  };

  /**
   * Returns an array of object's keys sorted by the numeric value they hold.
   *
   * @category Math
   */
  const sortedKeysByVal = (obj, descending = false) => {
    if (descending) {
      return keysOf(obj).sort((x, y) => obj[y] - obj[x]);
    }
    return keysOf(obj).sort((x, y) => obj[x] - obj[y]);
  };

  /**
   * Returns the key in the given object which holds the largest numeric value.
   *
   * If the object is empty, returns `undefined`.
   *
   * @category Math
   */
  const keyWithMaxVal = obj => {
    return lastOf(sortedKeysByVal(obj));
  };

  /**
   * Returns the key in the given object which holds the smallest numeric value.
   *
   * If the object is empty, returns `undefined`.
   *
   * @category Math
   */
  const keyWithMinVal = obj => {
    return firstOf(sortedKeysByVal(obj));
  };

  /**
   * Takes two integers and returns a bitmask that covers all values between
   * 1 << start and 1 << end, _including the starting and ending one_.
   *
   * If pStart > pEnd, they are reversed.
   *
   * getBitmask(start, start) always returns 1 << start
   * getBitmask(start, end) always returns same as getBitmask(end, start)
   *
   * @category Math
   */
  const getBitmask = (start, end) => start > end ? getBitmask(end, start) : -1 >>> 32 - end - 1 + start << start;

  /**
   * @module
   * @ignore
   * @internal
   */

  const copyExistingKeys = (fromObj, toObj) => {
    for (const key in toObj) {
      if (!hasOwnProp(toObj, key)) {
        continue;
      }
      if (key in fromObj) {
        if (isNonPrimitive(fromObj[key]) && isNonPrimitive(toObj[key])) {
          copyExistingKeys(fromObj[key], toObj[key]);
        } else {
          toObj[key] = fromObj[key];
        }
      }
    }
  };

  // Omits the keys in object keysToRm from obj. This is to avoid hardcording the
  // key names as a string so as to allow minifier to mangle them, and to avoid
  // using object spread.
  const omitKeys = (obj, keysToRm) => {
    const res = {};
    let key;
    for (key in obj) {
      if (!(key in keysToRm)) {
        res[key] = obj[key];
      }
    }
    return res;
  };

  // Returns true if the two objects are equal. If values are numeric, it will
  // round to the given number of decimal places.
  const compareValuesIn = (objA, objB, roundTo = 3) => {
    for (const key in objA) {
      if (!hasOwnProp(objA, key)) {
        continue;
      }
      const valA = objA[key];
      const valB = objB[key];
      if (isNonPrimitive(valA) && isNonPrimitive(valB)) {
        if (!compareValuesIn(valA, valB)) {
          return false;
        }
      } else if (isNumber(valA) && isNumber(valB)) {
        if (roundNumTo(valA, roundTo) !== roundNumTo(valB, roundTo)) {
          return false;
        }
      } else if (valA !== valB) {
        return false;
      }
    }
    return true;
  };
  const keyExists = (obj, key) => isNonPrimitive(obj) && key in obj;
  const toArrayIfSingle = value => isArray(value) ? value : !isNullish(value) ? [value] : [];
  const toBoolean = value => value === true || value === "true" || value === "" ? true : isNullish(value) || value === false || value === "false" ? false : null;

  /**
   * @deprecated
   */
  const toBool = toBoolean;

  /**
   * @module Utils
   */

  /**
   * Formats an object as a string. It supports more meaningful formatting as
   * string for certain types rather than using the default string
   * representation.
   *
   * **NOTE:** This is not intended for serialization of data that needs to be
   * de-serialized. Only for debugging output.
   *
   * @param value    The value to format as string.
   * @param [maxLen] Maximum length of the returned string. If not given or
   *                 is <= 0, the string is not truncated. Otherwise, if the
   *                 result is longer than maxLen, it is truncated to
   *                 `maxLen - 3` and added a suffix of "...".
   *                 Note that if `maxLen` is > 0 but <= 3, the result is
   *                 always "..."
   *
   * @category Text
   */
  const formatAsString = (value, maxLen) => {
    const result = maybeConvertToString(value, false);
    if (!isNullish(maxLen) && maxLen > 0 && lengthOf(result) > maxLen) {
      return result.slice(0, max(0, maxLen - 3)) + "...";
    }
    return result;
  };

  /**
   * Join an array of values as string using separator. It uses
   * {@link formatAsString} rather than the default string representation as
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join | Array:join} would.
   *
   * @param separator The separator to use to delimit each argument.
   * @param args      Objects or values to convert to string and join.
   *
   * @category Text
   */
  const joinAsString = (separator, ...args) => args.map(a => formatAsString(a)).join(separator);

  /**
   * Similar to
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split | String.prototype.split}
   * except that
   * 1. `limit` is interpreted as the maximum number of splits, and the
   *   returned array contains `limit + 1` entries. Also if `limit` is given and
   *   the number of substrings is greater than the limit, all the remaining
   *   substrings are present in the final substring.
   * 2. If input is an empty string (or containing only whitespace), returns an
   *    empty array.
   *
   * @example
   * ```javascript
   * splitOn('foo, bar, baz', RegExp(',\\s*'), 0); // -> ['foo, bar, baz']
   * splitOn('foo, bar, baz', RegExp(',\\s*'), 1); // -> ['foo', 'bar, baz']
   * splitOn('foo, bar, baz', RegExp(',\\s*'), 2); // -> ['foo', 'bar', 'baz']
   * splitOn('foo, bar, baz', RegExp(',\\s*'), 3); // -> ['foo', 'bar', 'baz']
   * ```
   *
   * @param trim  If true, entries will be trimmed for whitespace after splitting.
   *
   * @param limit If not given or < 0, the string will be split on every
   *              occurrence of `separator`. Otherwise, it will be split on
   *              the first `limit` number of occurrences of `separator`.
   *
   * @category Text
   */
  const splitOn = (input, separator, trim, limit) => {
    if (!input.trim()) {
      return [];
    }
    limit !== null && limit !== void 0 ? limit : limit = -1;
    const output = [];
    const addEntry = s => output.push(trim ? s.trim() : s);
    while (limit--) {
      let matchIndex = -1,
        matchLength = 0;
      if (isLiteralString(separator)) {
        matchIndex = input.indexOf(separator);
        matchLength = lengthOf(separator);
      } else {
        var _match$index;
        const match = separator.exec(input);
        matchIndex = (_match$index = match === null || match === void 0 ? void 0 : match.index) !== null && _match$index !== void 0 ? _match$index : -1;
        matchLength = match ? lengthOf(match[0]) : 0;
      }
      if (matchIndex < 0) {
        break;
      }
      addEntry(input.slice(0, matchIndex));
      input = input.slice(matchIndex + matchLength);
    }
    addEntry(input);
    return output;
  };

  /**
   * Converts a kebab-cased-string to camelCase.
   * The result is undefined if the input string is not formatted in
   * kebab-case.
   *
   * @category Text
   */
  const kebabToCamelCase = kebabToCamelCase$1;

  /**
   * Converts a camelCasedString to kebab-case.
   * The result is undefined if the input string is not formatted in
   * camelCase.
   *
   * @category Text
   */
  const camelToKebabCase = camelToKebabCase$1;

  /**
   * Generates a random string of a fixed length.
   *
   * **IMPORTANT:** This is _not_ suitable for cryptographic applications.
   *
   * @param nChars The length of the returned stirng.
   *
   * @category Text
   */
  const randId = (nChars = 8) => {
    const segment = () => floor(100000 + MATH.random() * 900000).toString(36);
    let s = "";
    while (lengthOf(s) < nChars) {
      s += segment();
    }
    return s.slice(0, nChars);
  };

  /**
   * Returns an array of numeric margins in pixels from the given margin string.
   * The string should contain margins in either pixels or percentage; other
   * units are not supported.
   *
   * Percentage values are converted to pixels relative to the given
   * `absoluteSize`: left/right margins relative to the width, and top/bottom
   * margins relative to the height.
   *
   * Note that for the margin property, percentages are always relative to the
   * WIDTH of the parent, so you should pass the parent width as both the width
   * and the height keys in `absoluteSize`. But for IntersectionObserver's
   * `rootMargin`, top/bottom margin is relative to the height of the root, so
   * pass the actual root size.
   *
   * @returns [topMarginInPx, rightMarginInPx, bottomMarginInPx, leftMarginInPx]
   *
   * @category Text
   */
  const toMargins = (value, absoluteSize) => {
    var _parts$, _parts$2, _ref, _parts$3;
    const toPxValue = (strValue, index) => {
      let margin = parseFloat(strValue !== null && strValue !== void 0 ? strValue : "") || 0;
      if (strValue === margin + "%") {
        margin *= index % 2 ? absoluteSize[S_HEIGHT] : absoluteSize[S_WIDTH];
      }
      return margin;
    };
    const parts = splitOn(value, " ", true);
    const margins = [
    // top
    toPxValue(parts[0], 0),
    // right
    toPxValue((_parts$ = parts[1]) !== null && _parts$ !== void 0 ? _parts$ : parts[0], 1),
    // bottom
    toPxValue((_parts$2 = parts[2]) !== null && _parts$2 !== void 0 ? _parts$2 : parts[0], 2),
    // left
    toPxValue((_ref = (_parts$3 = parts[3]) !== null && _parts$3 !== void 0 ? _parts$3 : parts[1]) !== null && _ref !== void 0 ? _ref : parts[0], 3)];
    return margins;
  };

  /**
   * @ignore
   * @internal
   */
  const objToStrKey = obj => stringify(flattenForSorting(obj));

  // --------------------

  const flattenForSorting = obj => {
    const array = isArray(obj) ? obj : keysOf(obj).sort().map(k => obj[k]);
    return array.map(value => {
      if (isArray(value) || isNonPrimitive(value) && constructorOf(value) === OBJECT) {
        return flattenForSorting(value);
      }
      return value;
    });
  };
  const stringifyReplacer = (key, value) => key ? maybeConvertToString(value, true) : value;
  const maybeConvertToString = (value, nested) => {
    let result = "";
    if (isElement(value)) {
      const classStr = classList(value).toString().trim();
      result = value.id ? "#" + value.id : `<${tagName(value)}${classStr ? ' class="' + classStr + '"' : ""}>`;

      //
    } else if (isInstanceOf(value, Error)) {
      /* istanbul ignore else */
      if ("stack" in value && isString(value.stack)) {
        result = value.stack;
      } else {
        result = `Error: ${value.message}`;
      }

      //
    } else if (isArray(value)) {
      result = "[" + value.map(v => isString(v) ? stringify(v) : maybeConvertToString(v, false)).join(",") + "]";

      //
    } else if (isIterableObject(value)) {
      result = typeOrClassOf(value) + "(" + maybeConvertToString(arrayFrom(value), false) + ")";

      //
    } else if (isNonPrimitive(value)) {
      result = nested ? value : stringify(value, stringifyReplacer);

      //
    } else {
      // primitive
      result = nested ? value : STRING(value);
    }
    return result;
  };

  /**
   * @module Utils
   */


  /**
   * Returns true if the input is a string array or comma-separated string, whose
   * elements are valid according to the `validator` function.
   *
   * @param allowEmpty If `false`, then input without any entries is
   * considered _invalid_.
   *
   * @category Validation
   */
  const isValidStrList = (value, checkFn, allowEmpty = true) => {
    try {
      const res = validateStrList("", value, checkFn);
      return allowEmpty || !isNullish(res);
    } catch (err) {
      if (isInstanceOf(err, LisnUsageError)) {
        return false;
      }
      throw err;
    }
  };

  /**
   * Returns an array of strings from the given list while validating each one
   * using the `checkFn` function.
   *
   * If it returns without throwing, the input is necessarily valid.
   * If the result is an empty array, it will return `null`.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the input is not a string or array of strings, or if any
   *                entries do not pass `checkFn`.
   *
   * @param key Used in the error message thrown
   *
   * @returns `undefined` if the input contains no non-empty values (after
   * trimming whitespace on left/right from each), otherwise a non-empty array of
   * values.
   *
   * @category Validation
   */
  const validateStrList = (key, value, checkFn) => {
    var _toArray;
    return filterBlank((_toArray = toArray(value)) === null || _toArray === void 0 ? void 0 : _toArray.map(v => _validateString(key, v, checkFn, "a string or a string array")));
  };

  /**
   * Returns an array of numbers from the given list.
   *
   * If it returns without throwing, the input is necessarily valid.
   * If the result is an empty array, it will return `null`.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the input is not a number or array of numbers. Numerical
   *                strings are accepted.
   *
   * @param key Used in the error message thrown
   *
   * @returns `undefined` if the input contains no non-empty values (after
   * trimming whitespace on left/right from each), otherwise a non-empty array of
   * values.
   *
   * @category Validation
   */
  const validateNumList = (key, value) => {
    var _toArray2;
    return filterBlank((_toArray2 = toArray(value)) === null || _toArray2 === void 0 ? void 0 : _toArray2.map(v => _validateNumber(key, v, "a number or a number array")));
  };

  /**
   * Returns a number corresponding to the supplied value, ensuring the supplied
   * value is a valid number or a string containing only a number.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the value is invalid.
   *
   * @returns `undefined` if the input is nullish.
   *
   * @category Validation
   */
  const validateNumber = (key, value) => _validateNumber(key, value);

  /**
   * Returns a boolean corresponding to the given value as follows:
   *
   * - `null` and `undefined` result in `undefined`
   * - `false` and `"false"` result in `false`
   * - `""`, `true` and `"true"` result in `true`
   * - other values throw an error error
   *
   * Note that an empty string is treated as `true`.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the value is not a valid boolean or boolean string.
   *
   * @returns `undefined` if the input is nullish.
   *
   * @category Validation
   */
  const validateBoolean = (key, value) => _validateBoolean(key, value);

  /**
   * Returns a valid string from the supplied value, ensuring the supplied value
   * is a string that conforms to the given `checkFn`.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the value is invalid.
   *
   * @param checkFn If given and the supplied value is a string, then it is
   *                called with the value as a single argument. It must return
   *                true if the value is valid and false otherwise. If it is not
   *                given, then any literal string is accepted.
   *
   * @returns `undefined` if the input is nullish.
   *
   * @category Validation
   */
  const validateString = (key, value, checkFn) => _validateString(key, value, checkFn);

  /**
   * Like {@link validateString} except it requires input to be given and
   * non-empty.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the value is invalid or empty.
   *
   * @category Validation
   */
  const validateStringRequired = (key, value, checkFn) => {
    const result = _validateString(key, value, checkFn);
    if (isEmpty(result)) {
      throw usageError(`'${key}' is required`);
    }
    return result;
  };

  /**
   * Returns a valid boolean or a string from the supplied value, ensuring the
   * supplied value is either a boolean or boolean string (see
   * {@link validateBoolean}), or a string that conforms to the given `checkFn`.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the value is invalid.
   *
   * @param stringCheckFn If given and the supplied value is a string _other than
   *                      a boolean string_, then it is called with the value as
   *                      a single argument. It must return true if the value is
   *                      valid and false otherwise. If it is not given, then any
   *                      literal string is accepted.
   *
   * @category Validation
   */
  const validateBooleanOrString = (key, value, stringCheckFn) => _validateBooleanOrString(key, value, stringCheckFn);

  // --------------------

  const toArray = value => {
    let result;
    if (isArray(value)) {
      result = value;
    } else if (isIterableObject(value)) {
      result = arrayFrom(value);
    } else if (isLiteralString(value)) {
      result = splitOn(value, ",");
    } else if (!isNullish(value)) {
      result = [value];
    } else {
      result = null;
    }
    return result ? filterBlank(result.map(v => isLiteralString(v) ? v.trim() : v)) : undefined;
  };
  const _validateNumber = (key, value, typeDescription) => {
    if (isNullish(value)) {
      return;
    }
    const numVal = toNum(value, null);
    if (numVal === null) {
      throw usageError(`'${key}' must be ${typeDescription !== null && typeDescription !== void 0 ? typeDescription : "a number"}`);
    }
    return numVal;
  };
  const _validateBoolean = (key, value, typeDescription) => {
    if (isNullish(value)) {
      return;
    }
    const boolVal = toBoolean(value);
    if (boolVal === null) {
      throw usageError(`'${key}' must be ${'"true" or "false"'}`);
    }
    return boolVal;
  };
  const _validateString = (key, value, checkFn, typeDescription) => {
    if (isNullish(value)) {
      return;
    }
    if (!isLiteralString(value)) {
      throw usageError(`'${key}' must be ${typeDescription !== null && typeDescription !== void 0 ? typeDescription : "a string"}`);
    } else if (checkFn && !checkFn(value)) {
      throw usageError(`Invalid value for '${key}'`);
    }
    return value;
  };
  const _validateBooleanOrString = (key, value, stringCheckFn, typeDescription) => {
    if (isNullish(value)) {
      return;
    }
    const boolVal = toBoolean(value);
    if (boolVal !== null) {
      return boolVal;
    }
    if (!isLiteralString(value)) {
      throw usageError(`'${key}' must be ${"a boolean or string"}`);
    }
    return _validateString(key, value, stringCheckFn);
  };

  /**
   * @module Modules/BitSpaces
   */


  /**
   * A union of all property names in the space.
   */

  /**
   * {@link BitSpace} represents a single set of mutually exclusive (or
   * orthogonal) properties.
   *
   * Each property has a numeric value equal to 1 bit-shifted by a certain number
   * of bits.
   *
   * Created using {@link BitSpaces.create}
   *
   * @interface
   */

  /**
   * {@link BitSpaces} represents one or more related {@link BitSpace}s whose bit
   * values will not overlap.
   */
  class BitSpaces {
    /**
     * Creates and returns a new BitSpace that is bit shifted to the left as
     * many bits as the ending bit of the previous space created by this
     * instances, so that each new space created is non-overlapping with previous
     * ones.
     *
     * The numeric values of the properties are guaranteed to be in the same
     * order, increasing in value, as the keys passed to the function.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the number of bits in the space will exceed 32.
     *
     * @example
     * ```javascript
     * const spaces = new BitSpaces();
     * const spaceA = spaces.create("up", "down");
     *
     * // spaces.nBits   => 2
     * // spaces.bitmask => 3
     * //
     * // spaceA:
     * // {
     * //     bit: {
     * //         up:     1, // at bit 0, i.e. 1 << 0
     * //         down:   2, // at bit 1, i.e. 1 << 1
     * //     },
     * //     start:      0,
     * //     end:        1,
     * //     bitmask:    3, // 1 << 0 | 1 << 1
     * //     has:        (p) => p === "up" || p === "down",
     * //     bitmaskFor: (pStart, pEnd) => ...
     * //     nameOf:     (v) => v === 1 ? "up" : v === 2 ? "down" : null
     * // }
     *
     * const spaceB = spaces.create("left", "right");
     *
     * // spaces.nBits   => 4
     * // spaces.bitmask => 15
     * //
     * // spaceB:
     * // {
     * //     bit: {
     * //         left:   4, // at bit 2, i.e. 1 << 2
     * //         right:  8, // at bit 3, i.e. 1 << 3
     * //     },
     * //     start:      2,
     * //     end:        3,
     * //     bitmask:    12, // 1 << 2 | 1 << 3
     * //     has:        (p) => p === "left" || p === "right",
     * //     bitmaskFor: (pStart, pEnd) => ...
     * //     nameOf:     (v) => v === 4 ? "left" : v === 8 ? "right" : null
     * // }
     *
     * ```
     */

    /**
     * Returns the number of bits all created spaces span, i.e. the end bit of
     * the one + 1.
     */

    /**
     * Returns a bitmask containing all values in all created spaces.
     */

    constructor() {
      const counter = newCounter();
      this.create = (...propNames) => newBitSpace(counter, propNames);
      defineProperty(this, "nBits", {
        get: () => counter._nBits
      });
      defineProperty(this, "bitmask", {
        get: () => counter._bitmask
      });
    }
  }

  /**
   * For minification optimization
   *
   * @ignore
   * @internal
   */
  const newBitSpaces = () => new BitSpaces();

  /**
   * For minification optimization
   *
   * @ignore
   * @internal
   */
  const createBitSpace = (spaces, ...propNames) => spaces.create(...propNames);

  // ----------------------------------------

  const newCounter = () => ({
    _nBits: 0,
    _bitmask: 0
  });
  const newBitSpace = (counter, propNames) => {
    const start = counter._nBits;
    const end = start + lengthOf(propNames) - 1;
    if (end >= 31) {
      throw usageError("BitSpaces overflow");
    }
    const bitmask = getBitmask(start, end);
    const space = {
      bit: {},
      start,
      end,
      bitmask,
      has: p => isString(p) && p in space.bit && isNumber(space.bit[p]),
      bitmaskFor: (pStart, pEnd) => {
        if (!isEmpty(pStart) && !space.has(pStart) || !isEmpty(pEnd) && !space.has(pEnd)) {
          return 0;
        }
        const thisStart = !isEmpty(pStart) ? log2(space.bit[pStart]) : start;
        const thisEnd = !isEmpty(pEnd) ? log2(space.bit[pEnd]) : end;
        return getBitmask(thisStart, thisEnd);
      },
      nameOf: val => {
        var _propNames;
        return (_propNames = propNames[log2(val) - start]) !== null && _propNames !== void 0 ? _propNames : null;
      }
    };
    for (const name of propNames) {
      defineProperty(space.bit, name, {
        value: 1 << counter._nBits++,
        enumerable: true
      });
    }
    counter._bitmask |= bitmask;
    return space;
  };

  /**
   * @module Utils
   */


  /**
   * Returns true if the given string is a valid category.
   *
   * @category Validation
   */
  const isValidMutationCategory = category => DOM_CATEGORIES_SPACE.has(category);

  /**
   * Returns true if the given string or array is a list of valid categories.
   *
   * @category Validation
   */
  const isValidMutationCategoryList = categories => isValidStrList(categories, isValidMutationCategory, false);

  /**
   * @ignore
   * @internal
   */
  const DOM_CATEGORIES_SPACE = createBitSpace(newBitSpaces(), S_ADDED, S_REMOVED, S_ATTRIBUTE);

  function _OverloadYield(e, d) {
    this.v = e, this.k = d;
  }
  function _asyncIterator(r) {
    var n,
      t,
      o,
      e = 2;
    for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) {
      if (t && null != (n = r[t])) return n.call(r);
      if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r));
      t = "@@asyncIterator", o = "@@iterator";
    }
    throw new TypeError("Object is not async iterable");
  }
  function AsyncFromSyncIterator(r) {
    function AsyncFromSyncIteratorContinuation(r) {
      if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object."));
      var n = r.done;
      return Promise.resolve(r.value).then(function (r) {
        return {
          value: r,
          done: n
        };
      });
    }
    return AsyncFromSyncIterator = function (r) {
      this.s = r, this.n = r.next;
    }, AsyncFromSyncIterator.prototype = {
      s: null,
      n: null,
      next: function () {
        return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
      },
      return: function (r) {
        var n = this.s.return;
        return void 0 === n ? Promise.resolve({
          value: r,
          done: true
        }) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
      },
      throw: function (r) {
        var n = this.s.return;
        return void 0 === n ? Promise.reject(r) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
      }
    }, new AsyncFromSyncIterator(r);
  }
  function _awaitAsyncGenerator(e) {
    return new _OverloadYield(e, 0);
  }
  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e[r] = t, e;
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r);
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _wrapAsyncGenerator(e) {
    return function () {
      return new AsyncGenerator(e.apply(this, arguments));
    };
  }
  function AsyncGenerator(e) {
    var r, t;
    function resume(r, t) {
      try {
        var n = e[r](t),
          o = n.value,
          u = o instanceof _OverloadYield;
        Promise.resolve(u ? o.v : o).then(function (t) {
          if (u) {
            var i = "return" === r ? "return" : "next";
            if (!o.k || t.done) return resume(i, t);
            t = e[i](t).value;
          }
          settle(n.done ? "return" : "normal", t);
        }, function (e) {
          resume("throw", e);
        });
      } catch (e) {
        settle("throw", e);
      }
    }
    function settle(e, n) {
      switch (e) {
        case "return":
          r.resolve({
            value: n,
            done: true
          });
          break;
        case "throw":
          r.reject(n);
          break;
        default:
          r.resolve({
            value: n,
            done: false
          });
      }
      (r = r.next) ? resume(r.key, r.arg) : t = null;
    }
    this._invoke = function (e, n) {
      return new Promise(function (o, u) {
        var i = {
          key: e,
          arg: n,
          resolve: o,
          reject: u,
          next: null
        };
        t ? t = t.next = i : (r = t = i, resume(e, n));
      });
    }, "function" != typeof e.return && (this.return = void 0);
  }
  AsyncGenerator.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function () {
    return this;
  }, AsyncGenerator.prototype.next = function (e) {
    return this._invoke("next", e);
  }, AsyncGenerator.prototype.throw = function (e) {
    return this._invoke("throw", e);
  }, AsyncGenerator.prototype.return = function (e) {
    return this._invoke("return", e);
  };

  /**
   * @module Utils
   */


  /**
   * @category Tasks
   */

  /**
   * @category Tasks
   */

  /**
   * @category Tasks
   */

  /* eslint-disable-next-line no-var */

  /**
   * Schedules a task with high priority to be executed as soon as possible.
   *
   * It uses {@link https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/postTask | Scheduler:postTask}
   * if available, otherwise falls back to
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel | MessageChannel}.
   *
   * @category Tasks
   */
  const scheduleHighPriorityTask = task => {
    if (typeof scheduler !== "undefined") {
      scheduler.postTask(task, {
        priority: "user-blocking"
      });
    } else {
      // Fallback to MessageChannel
      const channel = new MessageChannel();
      channel.port1.onmessage = () => {
        channel.port1.close();
        task();
      };
      channel.port2.postMessage("");
    }
  };

  /**
   * Returns a wrapper around the given handler that is debounced by the given
   * debounce window.
   *
   * @category Tasks
   */
  const getDebouncedHandler = (debounceWindow, handler) => {
    if (!debounceWindow) {
      return handler;
    }
    let timer = null;
    let lastArgs;
    return (...args) => {
      lastArgs = args;
      if (timer === null) {
        timer = setTimer(async () => {
          await handler(...lastArgs);
          timer = null;
        }, debounceWindow);
      }
    };
  };

  /**
   * Returns a promise that resolves at least the given number of delay (in
   * milliseconds) later. Uses `setTimeout`.
   *
   * @category Tasks
   */
  const waitForDelay = delay => newPromise(resolve => {
    setTimer(resolve, delay);
  });

  /**
   * @module Debugging
   */

  /**
   * Logs to the local browser console. On iOS devices it uses `console.info` for
   * all levels because of a bug in WebKit whereby other log levels don't show in
   * some remote debuggers. Also, iOS console only supports a single argument, so
   * it joins the given arguments as a single string.
   *
   * @category Logging
   */
  class LocalConsole {
    constructor() {
      this.debug = isiOS ? iOSlog : isJest ? jestLog.debug : consoleDebug;
      this.log = isiOS ? iOSlog : isJest ? jestLog.log : consoleLog;
      this.info = isiOS ? iOSlog : isJest ? jestLog.info : consoleInfo;
      this.warn = isiOS ? iOSlog : isJest ? jestLog.warn : consoleWarn;
      this.error = isiOS ? iOSlog : isJest ? jestLog.error : consoleError;
    }
  }

  // ------------------------------

  const isiOS = includes(userAgent, "iPhone OS");
  const iOSlog = (...args) => consoleInfo(joinAsString(" ", ...args));
  const isJest = includes(userAgent, " jsdom/");
  const jestLog = {
    debug: (...args) => consoleDebug(joinAsString(" ", ...args)),
    log: (...args) => consoleLog(joinAsString(" ", ...args)),
    info: (...args) => consoleInfo(joinAsString(" ", ...args)),
    warn: (...args) => consoleWarn(joinAsString(" ", ...args)),
    error: (...args) => consoleError(joinAsString(" ", ...args))
  };

  /**
   * For minification optimization
   *
   * @ignore
   * @internal
   */
  const newXMap = getDefaultV => new XMap(getDefaultV);

  /**
   * For minification optimization. Exposed through {@link XMap.newXMapGetter}.
   *
   * @ignore
   * @internal
   */
  const newXMapGetter = getDefaultV => () => newXMap(getDefaultV);

  /**
   * For minification optimization
   *
   * @ignore
   * @internal
   */
  const newXWeakMap = getDefaultV => new XWeakMap(getDefaultV);

  /**
   * For minification optimization. Exposed through {@link XMap.newXWeakMapGetter}.
   *
   * @ignore
   * @internal
   */
  const newXWeakMapGetter = getDefaultV => () => newXWeakMap(getDefaultV);
  class XMapBase {
    /**
     * Returns the value at the given key in the {@link XMap} or {@link XWeakMap}.
     */

    /**
     * Like {@link get} except that if the key is not found in the map, then it
     * will set and return a default value by calling `getDefaultV` passed to the
     * constructor.
     */

    /**
     * Sets a value at the given key in the {@link XMap} or {@link XWeakMap}.
     */

    /**
     * Deletes a value at the given key in the {@link XMap} or {@link XWeakMap}.
     */

    /**
     * Deletes empty keys in the {@link XMap} or {@link XWeakMap} starting at the
     * final nested path and checking the level above after deletion.
     *
     * A key is considered empty if it's value is undefined or it's an empty Map,
     * Set, Array, etc (anything with size or length property equal to 0).
     */

    /**
     * Returns true if the {@link XMap} or {@link XWeakMap} contains the given key.
     */

    constructor(root, getDefaultV) {
      this.get = key => root.get(key);
      this.set = (key, value) => root.set(key, value);
      this.delete = key => deleteKey(root, key);
      this.has = key => root.has(key);
      this.sGet = key => {
        let result = root.get(key);
        if (result === undefined) {
          result = getDefaultV(key);
          root.set(key, result);
        }
        return result;
      };
      this.prune = (sk, ...rest) => {
        const value = root.get(sk);
        if (value instanceof XMapBase && lengthOf(rest)) {
          value.prune(rest[0], ...rest.slice(1));
        }
        if (value === undefined || isIterableObject(value) && !("size" in value && value.size || "length" in value && value.length)) {
          deleteKey(root, sk);
        }
      };
    }
  }

  /**
   * {@link XMap} is like
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map | Map},
   * except that it supports automatically creating missing entries with
   * {@link sGet} according to a default value getter function.
   *
   * @typeParam K The type of the keys the map holds.
   * @typeParam V The type of the values the map holds.
   */
  class XMap extends XMapBase {
    /**
     * @param getDefaultV This function is called each time {@link sGet} is
     *                    called with a non-existent key and must return a value
     *                    that is then set for that key and returned.
     */
    constructor(getDefaultV) {
      const root = newMap();
      super(root, getDefaultV);
      defineProperty(this, "size", {
        get: () => root.size
      });
      this.clear = () => root.clear();
      this.entries = () => root.entries();
      this.keys = () => root.keys();
      this.values = () => root.values();
      this[SYMBOL.iterator] = () => root[SYMBOL.iterator]();
    }
  }

  /**
   * {@link XWeakMap} is like
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap | WeakMap},
   * except that it supports automatically creating missing entries with
   * with {@link sGet} according to a default value getter function.
   *
   * @typeParam K The type of the keys the map holds.
   * @typeParam V The type of the values the map holds.
   */
  /**
   * Returns the number of entries in the {@link XMap}.
   */
  /**
   * Deletes all entries in the {@link XMap}.
   */
  /**
   * Returns an iterator over the {@link XMap} entries.
   */
  /**
   * Returns an iterator over the {@link XMap} keys.
   */
  /**
   * Returns an iterator over the {@link XMap} values.
   */
  /**
   * Returns a function that when called returns a new {@link XMap}.
   *
   * You can pass this to the constructor of an {@link XMap} or an
   * {@link XWeakMap}, whose values are {@link XMap}s.
   */
  _defineProperty(XMap, "newXMapGetter", newXMapGetter);
  class XWeakMap extends XMapBase {
    /**
     * @param getDefaultV This function is called each time {@link sGet} is
     *                    called with a non-existent key and must return a value
     *                    that is then set for that key and returned.
     */
    constructor(getDefaultV) {
      const root = newWeakMap();
      super(root, getDefaultV);
    }
  }
  /**
   * Returns a function that when called returns a new {@link XWeakMap}.
   *
   * You can pass this to the constructor of an {@link XMap} or an
   * {@link XWeakMap}, whose values are {@link XWeakMap}s.
   */
  _defineProperty(XWeakMap, "newXWeakMapGetter", newXWeakMapGetter);

  /**
   * @module Debugging
   */

  /* ******************************
   * Remote console
   * *******************************/

  /**
   * Connects to a remote {@link https://socket.io/ | socket.io} server and logs
   * messages to it.
   *
   * In the root of the Git repository, there is a simple example server that
   * listens for these messages and logs them to the local console.
   *
   * @category Logging
   */
  class RemoteConsole {
    /**
     * Emits a message with ID `console.debug`.
     */

    /**
     * Emits a message with ID `console.log`.
     */

    /**
     * Emits a message with ID `console.info`.
     */

    /**
     * Emits a message with ID `console.warn`.
     */

    /**
     * Emits a message with ID `console.error`.
     */

    /**
     * Disconnects and destroys the {@link RemoteConsole}. Cannot be undone.
     */

    /**
     * Returns true if the client has been disconnected for more than
     * the connect timeout.
     */

    /**
     * Creates a new {@link RemoteConsole} and attempts to connect to the logger
     * at the given URL.
     *
     * @param url                     The URL of the remote logger.
     * @param [connectTimeout = 1500] The timeout in ms for a connection
     *                                to be considered failed.
     */
    constructor(url, connectTimeout = DEFAULT_TIMEOUT) {
      let hasFailed = false; // initially
      let isClosed = false;

      // Because socket.io module is optional we need to import it dynamically,
      // which is always async. So to avoid Console and Logger also needing to be
      // async, we queue messages sent to a RemoteConsole here and try to import
      // socket.io here.
      let tmpQueue = [];
      let sendLog = (level, args) => {
        tmpQueue.push([level, args]);
      };
      let destroy = () => {};
      this.hasFailed = () => hasFailed;
      this.debug = (...args) => sendLog("debug", args);
      this.log = (...args) => sendLog("log", args);
      this.info = (...args) => sendLog("info", args);
      this.warn = (...args) => sendLog("warn", args);
      this.error = (...args) => sendLog("error", args);
      this.destroy = () => destroy();
      const cleanup = () => {
        var _instances$get;
        hasFailed = true;
        sendLog = (level__ignored, args__ignored) => {};
        tmpQueue = [];
        const instance = (_instances$get = instances$9.get(url)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(connectTimeout);
        if (instance === this) {
          deleteKey(instances$9.get(url), connectTimeout);
          instances$9.prune(url);
        }
      };
      (async () => {
        let socket;
        const moduleName = "socket.io-client"; // suppress Vite static analysis
        try {
          socket = await import(/* webpackIgnore: true */moduleName);
        } catch (e__ignored) {
          // module doesn't exist
          cleanup();
          return;
        }
        const ioClient = socket.io(url);

        // if not connected within connectTimeout initially, set as failed
        let disconnectTimer = setTimer(() => {
          hasFailed = true;
        }, connectTimeout);
        ioClient.on("disconnect", () => {
          // if not re-connected within connectTimeout, set as failed
          clearTimer(disconnectTimer);
          if (!isClosed) {
            disconnectTimer = setTimer(() => {
              hasFailed = true;
            }, connectTimeout);
          }
        });
        ioClient.on("connect", () => {
          clearTimer(disconnectTimer);
          hasFailed = false;
        });

        // Now we can send directly to the client
        sendLog = (level, args) => {
          if (!hasFailed) {
            ioClient.emit(`console.${level}`, joinAsString(" ", ...args));
          }
        };
        destroy = () => {
          isClosed = true; // do not wait for re-connect
          ioClient.disconnect();
          cleanup();
        };

        // Flush the queue
        let entry;
        while (entry = tmpQueue.shift()) {
          sendLog(entry[0], entry[1]);
        }
      })();
    }

    /**
     * Returns an existing {@link RemoteConsole} for the given URL and timeout or
     * creates a new one.
     *
     * If a new one is created, it will be saved for later reuse.
     *
     * @param url              The URL of the remote logger.
     * @param [connectTimeout] The timeout in ms for a remote connection to
     *                         be considered failed. Default is 1500.
     */
    static reuse(url, connectTimeout = DEFAULT_TIMEOUT) {
      var _instances$get2;
      let rConsole = (_instances$get2 = instances$9.get(url)) === null || _instances$get2 === void 0 ? void 0 : _instances$get2.get(connectTimeout);
      if (!rConsole) {
        rConsole = new RemoteConsole(url, connectTimeout);
        instances$9.sGet(url).set(connectTimeout, rConsole);
      }
      return rConsole;
    }
  }
  const instances$9 = newXMap(() => newMap());
  const DEFAULT_TIMEOUT = 1500;

  /**
   * @module Debugging
   */


  /**
   * Holds a {@link LocalConsole} and optionally a {@link RemoteConsole} and logs
   * to both.
   */
  class Console {
    /**
     * @param remoteUrl        Attempt to use a remote logger at this URL.
     * @param [connectTimeout] The timeout in ms for a remote connection to be
     *                         considered failed. See {@link RemoteConsole}.
     */
    constructor(remoteUrl, connectTimeout) {
      let remoteConsole;
      // RemoteConsole import may be replaced with null by rollup when bundling
      // production, so check
      if (remoteUrl) {
        remoteConsole = RemoteConsole.reuse(remoteUrl, connectTimeout);
      } else {
        remoteConsole = null;
      }
      const localConsole = new LocalConsole();
      const sendLog = (level, args) => {
        localConsole[level](...args);
        if (remoteConsole) {
          remoteConsole[level](...args);
        }
      };
      this.debug = (...args) => sendLog("debug", args);
      this.log = (...args) => sendLog("log", args);
      this.info = (...args) => sendLog("info", args);
      this.warn = (...args) => sendLog("warn", args);
      this.error = (...args) => sendLog("error", args);
    }
  }

  /**
   * @module Debugging
   *
   * @categoryDescription Logging
   * {@link Debugging.LocalConsole | LocalConsole} logs to the local browser
   * console. On iOS devices it uses `console.info` for all levels because of a
   * bug in WebKit whereby other log levels don't show in some remote debuggers.
   * Also, iOS console only supports a single argument, so it joins the given
   * arguments as a single string.
   *
   * {@link Debugging.RemoteConsole | RemoteConsole} connects to a remote
   * {@link https://socket.io/ | socket.io} server and logs messages to it.
   *
   * {@link Console} holds a {@link LocalConsole} and optionally a
   * {@link RemoteConsole} and logs to both.
   *
   * {@link Logger} holds a {@link Console} and implements debug at 10 different
   * levels. The maximum logged level is configurable. Also emits a prefix in
   * debug messages that identifies the instance.
   */


  /**
   * Holds a {@link Console} and implements debug at 10 different levels. The
   * maximum logged level is configurable. Also emits a prefix in debug messages
   * that identifies the instance.
   *
   * @category Logging
   */
  class Logger {
    constructor(config) {
      var _myConfig$name, _myConfig$verbosityLe;
      config !== null && config !== void 0 ? config : config = {};
      const myConfig = merge({
        // set defaults
        verbosityLevel: settings.verbosityLevel,
        remoteLoggerURL: settings.remoteLoggerURL,
        remoteLoggerOnMobileOnly: settings.remoteLoggerOnMobileOnly,
        debugID: randId()
      }, config);
      let remoteLoggerURL = "";
      if (!getBooleanURLParam("disableRemoteLog") && (myConfig.remoteLoggerOnMobileOnly === false || isMobile$1())) {
        var _myConfig$remoteLogge;
        remoteLoggerURL = (_myConfig$remoteLogge = myConfig.remoteLoggerURL) !== null && _myConfig$remoteLogge !== void 0 ? _myConfig$remoteLogge : "";
      }
      const name = (_myConfig$name = myConfig.name) !== null && _myConfig$name !== void 0 ? _myConfig$name : "";
      const myConsole = new Console(remoteLoggerURL, myConfig.remoteLoggerConnectTimeout);
      // use setters bellow to validate value
      let verbosityLevel = 0;
      const logPrefix = `[LISN${name ? ": " + name : ""}]`;
      const debugID = myConfig.debugID;
      const debugPrefix = `[LISN${(name ? ": " + name : "") + (debugID ? "-" + debugID : "")}]`;
      this.getName = () => name;
      this.getVerbosityLevel = () => verbosityLevel;
      this.setVerbosityLevel = l => {
        verbosityLevel = l;
      };
      this.setVerbosityLevel((_myConfig$verbosityLe = myConfig.verbosityLevel) !== null && _myConfig$verbosityLe !== void 0 ? _myConfig$verbosityLe : 0);
      this.debug1 = (...args) => logDebugN(this, 1, debugPrefix, ...args);
      this.debug2 = (...args) => logDebugN(this, 2, debugPrefix, ...args);
      this.debug3 = (...args) => logDebugN(this, 3, debugPrefix, ...args);
      this.debug4 = (...args) => logDebugN(this, 4, debugPrefix, ...args);
      this.debug5 = (...args) => logDebugN(this, 5, debugPrefix, ...args);
      this.debug6 = (...args) => logDebugN(this, 6, debugPrefix, ...args);
      this.debug7 = (...args) => logDebugN(this, 7, debugPrefix, ...args);
      this.debug8 = (...args) => logDebugN(this, 8, debugPrefix, ...args);
      this.debug9 = (...args) => logDebugN(this, 9, debugPrefix, ...args);
      this.debug10 = (...args) => logDebugN(this, 10, debugPrefix, ...args);
      this.debug = (...args) => myConsole.debug(debugPrefix, ...args);
      this.log = (...args) => myConsole.log(logPrefix, ...args);
      this.info = (...args) => myConsole.info(logPrefix, ...args);
      this.warn = (...args) => myConsole.warn(logPrefix, ...args);
      this.error = (...args) => {
        myConsole.error(logPrefix, ...args);
      };

      // --------------------
      if ("logAtCreation" in myConfig) {
        this.debug6("New logger:", myConfig.logAtCreation);
      }
    }
  }
  // ----------------------------------------

  const logDebugN = (logger, level, ...args) => {
    if (!isNumber(level)) {
      args.unshift(level);
      level = 1;
      logger.error(bugError("Missing logger.debug level"));
    }
    if (logger.getVerbosityLevel() < level) {
      return;
    }
    logger.debug(`[DEBUG ${level}]`, ...args);
  };
  const isMobile$1 = () => {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(userAgent);
  };
  const getBooleanURLParam = name => {
    const value = getURLParameter(name);
    return value && (value === "1" || toLowerCase(value) === "true");
  };
  const getURLParameter = name => {
    if (!hasDOM()) {
      return null;
    }
    const loc = getDoc().location;
    if (typeof URLSearchParams !== "undefined") {
      const urlParams = new URLSearchParams(loc.search);
      return urlParams.get(name);
    }
    name = strReplace(name, /[[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const match = loc.href.match(regex);
    if (!match) {
      return null;
    }
    if (!match[2]) {
      return "";
    }
    return decodeURIComponent(strReplace(match[2], /\+/g, " "));
  };

  /**
   * @module
   * @ignore
   * @internal
   */

  const result = {
    Logger};

  /**
   * @typeParam Args See {@link Callback}
   */

  /**
   * For minification optimization. Exposed through Callback.wrap.
   *
   * @ignore
   * @internal
   */
  const wrapCallback = (handlerOrCallback, debounceWindow = 0) => {
    const isFunction$1 = isFunction(handlerOrCallback);
    let isRemoved = () => false;
    if (isFunction$1) {
      // check if it's an invoke method
      const callback = callablesMap.get(handlerOrCallback);
      if (callback) {
        return wrapCallback(callback);
      }
    } else {
      isRemoved = handlerOrCallback.isRemoved;
    }
    const handler = isFunction$1 ? handlerOrCallback : (...args) => handlerOrCallback.invoke(...args);
    const wrapper = new Callback(getDebouncedHandler(debounceWindow, (...args) => {
      if (!isRemoved()) {
        return handler(...args);
      }
    }));
    if (!isFunction$1) {
      handlerOrCallback.onRemove(wrapper.remove);
    }
    return wrapper;
  };

  /**
   * {@link Callback} wraps user-supplied callbacks. Supports
   * - removing a callback either when calling {@link remove} or if the user
   *   handler returns {@link Callback.REMOVE}
   * - calling custom {@link onRemove} hooks
   * - debouncing (via {@link wrap})
   * - awaiting on an asynchronous handler and ensuring that the handler does not
   *  run concurrently to itself, i.e. subsequent {@link invoke}s will be queued
   *
   * @typeParam Args The type of arguments that the callback expects.
   */
  class Callback {
    /**
     * @param handler The actual function to call. This should return one of
     *                the known {@link CallbackReturnType} values.
     */
    constructor(handler) {
      const logger = result ? new result.Logger({
        name: "Callback",
        logAtCreation: handler
      }) : null;
      let isRemoved = false;
      const id = SYMBOL();
      const onRemove = newSet();
      this.isRemoved = () => isRemoved;
      this.remove = () => {
        if (!isRemoved) {
          logger === null || logger === void 0 || logger.debug8("Removing");
          isRemoved = true;
          for (const rmFn of onRemove) {
            rmFn();
          }
          CallbackScheduler._clear(id);
        }
      };
      this.onRemove = fn => onRemove.add(fn);
      this.invoke = (...args) => newPromise((resolve, reject) => {
        logger === null || logger === void 0 || logger.debug8("Calling with", args);
        if (isRemoved) {
          reject(usageError("Callback has been removed"));
          return;
        }
        CallbackScheduler._push(id, async () => {
          let result;
          try {
            result = await handler(...args);
          } catch (err) {
            reject(err);
          }
          if (result === Callback.REMOVE) {
            this.remove();
          }
          resolve();
        }, reject);
      });
      callablesMap.set(this.invoke, this);
    }
  }
  /**
   * Possible return value for the handler.
   *
   * Do not do anything. Same as not retuning anything from the function.
   */
  _defineProperty(Callback, "KEEP", SYMBOL("KEEP"));
  /**
   * Possible return value for the handler.
   *
   * Will remove this callback.
   */
  _defineProperty(Callback, "REMOVE", SYMBOL("REMOVE"));
  /**
   * Wraps the given handler or callback as a callback, optionally debounced by
   * the given debounce window.
   *
   * If the argument is already a callback _or an invoke method of a callback_,
   * then the wrapper will call that callback and return the same value as it.
   * It will also set up the returned wrapper callback so that it is removed
   * when the original (given) callback is removed. However, removing the
   * returned wrapper callback will _not_ cause the original callback (being
   * wrapped) to be removed. If you want to do this, then do
   * `wrapper.onRemove(wrapped.remove)`.
   *
   * Note that if the argument is a callback that's already debounced by a
   * _larger_ window, then `debounceWindow` will have no effect.
   *
   * @param debounceWindow If non-0, the callback will be called at most
   *                       every `debounceWindow` ms. The arguments it will
   *                       be called with will be the last arguments the
   *                       wrapper was called with.
   */
  _defineProperty(Callback, "wrap", wrapCallback);
  const callablesMap = newWeakMap();
  const CallbackScheduler = (() => {
    const queues = newMap();
    const flush = async queue => {
      // So that callbacks are always called asynchronously for consistency,
      // await here before calling 1st
      await null;
      while (lengthOf(queue)) {
        // shouldn't throw anything as Callback must catch errors
        queue[0]._running = true;
        await queue[0]._task();

        // only remove when done
        queue.shift();
      }
    };
    return {
      _clear: id => {
        const queue = queues.get(id);
        if (queue) {
          let item;
          while (item = queue.shift()) {
            if (!item._running) {
              item._onRemove(Callback.REMOVE);
            }
          }
          deleteKey(queues, id);
        }
      },
      _push: (id, task, onRemove) => {
        let queue = queues.get(id);
        if (!queue) {
          queue = [];
          queues.set(id, queue);
        }
        queue.push({
          _task: task,
          _onRemove: onRemove,
          _running: false
        });
        if (lengthOf(queue) === 1) {
          flush(queue);
        }
      }
    };
  })();

  /**
   * @module Utils
   */


  /**
   * Like `console.info` except if the string representation of the given
   * arguments has already been logged, it does nothing.
   *
   * @category Logging
   */
  const logInfo = (...args) => {
    if (!isMessageSeen(args)) {
      consoleInfo(LOG_PREFIX, ...args);
    }
  };

  /**
   * Like `console.warn` except if the string representation of the given
   * arguments has already been logged, it does nothing.
   *
   * @category Logging
   */
  const logWarn = (...args) => {
    if (!isMessageSeen(args)) {
      consoleWarn(LOG_PREFIX, ...args);
    }
  };

  /**
   * Like `console.error` except if the string representation of the given
   * arguments has already been logged, it does nothing.
   *
   * @category Logging
   */
  const logError = (...args) => {
    if ((lengthOf(args) > 1 || args[0] !== Callback.REMOVE) && !isMessageSeen(args)) {
      consoleError(LOG_PREFIX, ...args);
    }
  };
  const discardMessages = newSet();
  const isMessageSeen = args => {
    const msg = joinAsString(" ", ...args);
    const isSeen = discardMessages.has(msg);
    discardMessages.add(msg);
    return isSeen;
  };

  /**
   * @module Utils
   *
   * @categoryDescription DOM: Preventing layout trashing
   *
   * {@link waitForMeasureTime} allows you to schedule tasks that read or
   * "measure", the DOM, for example getting computed styles, taking the
   * `offsetWidth` or the `scrollTop` of an element, etc... anything that _would_
   * force a layout if it runs after the layout has been invalidated by a
   * "mutation".
   *
   * See https://gist.github.com/paulirish/5d52fb081b3570c81e3 for a list of
   * operations that should be run on a valid layout to avoid forced layouts.
   *
   * {@link waitForMutateTime} allows you to schedule tasks that invalidate the
   * DOM layout by making changes to the style, inserting or removing elements,
   * etc.
   *
   * These ensure that:
   * - All mutation tasks that would invalidate the style run together before the
   *   next repaint.
   * - All measurement tasks that need a valid style will run as soon as possible
   *   after the next repaint.
   * - If a mutation task is scheduled by another mutation task, it will run in
   *   the same batch.
   * - If a measurement task is scheduled by either a mutation or another
   *   measurement task, it will run in the same batch.
   */


  /**
   * Returns a Promise that is resolved before the next repaint.
   *
   * @category DOM: Preventing layout trashing
   */
  const waitForMutateTime = () => newPromise(resolve => {
    scheduleDOMTask(scheduledDOMMutations, resolve);
  });

  /**
   * Returns a Promise that is resolved as soon as possible after the next
   * repaint.
   *
   * @category DOM: Preventing layout trashing
   */
  const waitForMeasureTime = () => newPromise(resolve => {
    scheduleDOMTask(scheduledDOMMeasurements, resolve);
  });

  /**
   * Returns a Promise that is resolved before the repaint that follows the next
   * repaint.
   *
   * @category DOM: Preventing layout trashing
   */
  const waitForSubsequentMutateTime = () => waitForMutateTime().then(waitForMeasureTime).then(waitForMutateTime);

  /**
   * Returns a Promise that is resolved as soon as possible after the repaint
   * that follows the next repaint.
   *
   * @category DOM: Preventing layout trashing
   */
  const waitForSubsequentMeasureTime = () => waitForMeasureTime().then(waitForMutateTime).then(waitForMeasureTime);

  /**
   * @ignore
   * @internal
   *
   * @since v1.2.0
   */
  const asyncMutatorFor = func => async (...args) => waitForMutateTime().then(() => func(...args));

  /**
   * @ignore
   * @internal
   *
   * @since v1.2.0
   */
  const asyncMeasurerFor = func => async (...args) => waitForMeasureTime().then(() => func(...args));

  // ----------------------------------------

  const scheduledDOMMeasurements = [];
  const scheduledDOMMutations = [];
  let hasScheduledDOMTasks = false;
  const scheduleDOMTask = (queue, resolve) => {
    queue.push(resolve);
    if (!hasScheduledDOMTasks) {
      hasScheduledDOMTasks = true;
      onAnimationFrame(runAllDOMTasks);
    }
  };
  const runAllDOMTasks = async () => {
    // We suspend (await null) after each queue to ensure that microtasks that
    // have been added by await waitFor* or waitFor*().then run before the next
    // queue, so that if they schedule more measurements and/or mutations, they
    // can be flushed now, in the same batch.

    // We're inside an animation frame. Run all mutation tasks now.
    while (lengthOf(scheduledDOMMutations)) {
      runDOMTaskQueue(scheduledDOMMutations);
      // wait for tasks awaiting on the resolved promises, then check queue again
      await null;
    }

    // The measurement queue is now empty => scheduling measurements after
    // this point will result in rescheduling both queues again in the next
    // frame.
    //
    // Schedule the measurement tasks as soon as possible, after the upcoming
    // paint. Use a macro task with as high priority as possible.
    scheduleHighPriorityTask(async () => {
      while (lengthOf(scheduledDOMMeasurements)) {
        runDOMTaskQueue(scheduledDOMMeasurements);
        // wait for tasks awaiting on the resolved promises, then check queue again
        await null;
      }
      if (lengthOf(scheduledDOMMutations)) {
        // There have been mutations added. Schedule another flush.
        onAnimationFrame(runAllDOMTasks);
      } else {
        hasScheduledDOMTasks = false;
      }
    });
  };
  const runDOMTaskQueue = queue => {
    let resolve;
    while (resolve = queue.shift()) {
      try {
        resolve();
      } catch (err) /* istanbul ignore next */{
        logError(err);
      }
    }
  };

  /**
   * @module Utils
   */

  /**
   * Returns all the child elements of the given element that are not `script` or
   * `style` tags.
   *
   * @category DOM: Querying
   */
  const getVisibleContentChildren = element => filter([...childrenOf(element)], ch => isVisibleContentTag(tagName(ch)));

  /**
   * Returns whether the given tag is _not_ `script` or `style`. Comparison is
   * case insensitive.
   *
   * @category DOM: Querying
   */
  const isVisibleContentTag = tagName => !includes(["script", "style"], toLowerCase(tagName));

  /**
   * Returns whether the given tag name has by default an inline display.
   * Comparison is case insensitive.
   *
   * @category DOM: Querying
   */
  const isInlineTag = tagName => inlineTags.has(tagName.toLowerCase());

  /**
   * Returns whether the given element is as {@link DOMElement}.
   *
   * @category DOM: Querying
   */
  const isDOMElement = target => isHTMLElement(target) || isInstanceOf(target, SVGElement) || typeof MathMLElement !== "undefined" && isInstanceOf(target, MathMLElement);

  // --------------------

  const inlineTags = newSet(["a", "abbr", "acronym", "b", "bdi", "bdo", "big", "button", "cite", "code", "data", "dfn", "em", "i", "img", "input", "kbd", "label", "mark", "map", "object", "output", "q", "rp", "rt", "ruby", "s", "samp", "script", "select", "small", "span", "strong", "sub", "sup", "textarea", "time", "tt", "u", "var"]);

  /**
   * @module Utils
   *
   * @categoryDescription DOM: Querying
   * These functions query the style, attributes or other aspects of elements, but
   * could lead to forced layout if not scheduled using {@link waitForMeasureTime}.
   *
   * @categoryDescription DOM: Querying (optimized)
   * These functions query the style, attributes or other aspects of elements in
   * an optimized way. Functions that could cause a forced layout use
   * {@link waitForMeasureTime} and so are asynchronous. Functions that can
   * perform the check without forcing a re-layout are synchronous.
   *
   * @categoryDescription Style: Altering
   * These functions transition an element from one CSS class to another, but
   * could lead to forced layout if not scheduled using {@link waitForMutateTime}.
   * If a delay is supplied, then the transition is "scheduled" and if the
   * opposite transition is executed before the scheduled one, the original one
   * is cancelled. See {@link transitionElement} for an example.
   *
   * @categoryDescription Style: Altering (optimized)
   * These functions transition an element from one CSS class to another in an
   * optimized way using {@link waitForMutateTime} and so are asynchronous.
   * If a delay is supplied, then the transition is "scheduled" and if the
   * opposite transition is executed before the scheduled one, the original one
   * is cancelled. See {@link transitionElement} for an example.
   */


  /**
   * Removes the given `fromCls` class and adds the given `toCls` class to the
   * element.
   *
   * Unlike {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/replace | DOMTokenList:replace},
   * this will always add `toCls` even if `fromCls` isn't in the element's class list.
   *
   * @returns True if there was a change made (class removed or added), false
   * otherwise.
   *
   * @category Style: Altering
   */
  const transitionElementNow = (element, fromCls, toCls) => {
    cancelCSSTransitions(element, fromCls, toCls);

    // Avoid triggering MutationObserver unnecessarily.
    let didChange = false;
    if (hasClass(element, fromCls)) {
      didChange = true;
      removeClassesNow(element, fromCls);
    }
    if (!hasClass(element, toCls)) {
      addClassesNow(element, toCls);
      didChange = true;
    }
    return didChange;
  };

  /**
   * Like {@link transitionElementNow} except it will {@link waitForMutateTime},
   * and optionally a delay, and it finally awaits for the effective style's
   * transition-duration.
   *
   * If a delay is supplied, then the transition is "scheduled" and if the
   * opposite transition is executed before the scheduled one, this one is
   * cancelled.
   *
   * @example
   *
   * - {@link showElement} with delay of 100 schedules `lisn-hide` -> `lisn-show`
   *   in 100ms
   * - then if {@link hideElementNow} is called, or a scheduled
   *   {@link hideElement} completes  before that timer runs out, this call to
   *   {@link showElement} aborts
   *
   * ```javascript
   * hideElement(someElement, 10);
   * // this will be aborted in 10ms when the scheduled hideElement above
   * // completes
   * showElement(someElement, 100);
   * ```
   *
   * ```javascript
   * // this will be aborted in 10ms when the hideElement that will be scheduled
   * // below completes
   * showElement(someElement, 100);
   * hideElement(someElement, 10);
   * ```
   *
   * ```javascript
   * // this will be aborted immediately by hideElementNow that runs straight
   * // afterwards
   * showElement(someElement, 100);
   * hideElementNow(someElement);
   * ```
   *
   * ```javascript
   * hideElementNow(someElement);
   * // this will NOT be aborted because hideElementNow has completed already
   * showElement(someElement, 100);
   * ```
   *
   * @category Style: Altering (optimized)
   */
  const transitionElement = async (element, fromCls, toCls, delay = 0) => {
    const thisTransition = scheduleCSSTransition(element, toCls);
    if (delay) {
      await waitForDelay(delay);
    }
    await waitForMutateTime();
    if (thisTransition._isCancelled()) {
      // it has been overridden by a later transition
      return false;
    }
    const didChange = transitionElementNow(element, fromCls, toCls);
    thisTransition._finish();
    if (!didChange) {
      return false;
    }

    // Await for the transition duration so that caller awaiting on us knows when
    // it's complete.
    const transitionDuration = await getMaxTransitionDuration(element);
    if (transitionDuration) {
      await waitForDelay(transitionDuration);
    }
    return true;
  };

  /**
   * Transitions an element from class `lisn-undisplay` (which applies `display:
   * none`) to `lisn-display` (no style associated with this).
   *
   * The difference between this and simply removing the `lisn-undisplay` class
   * is that previously scheduled transitions to `lisn-undisplay` will be
   * cancelled.
   *
   * @see {@link transitionElementNow}
   *
   * @category Style: Altering
   */
  const displayElementNow = element => transitionElementNow(element, PREFIX_UNDISPLAY, PREFIX_DISPLAY);

  /**
   * Like {@link displayElementNow} except it will {@link waitForMutateTime}, and
   * optionally a delay.
   *
   * @see {@link transitionElement}
   *
   * @category Style: Altering (optimized)
   */
  const displayElement = (element, delay = 0) => transitionElement(element, PREFIX_UNDISPLAY, PREFIX_DISPLAY, delay);

  /**
   * The opposite of {@link displayElementNow}.
   *
   * @see {@link transitionElementNow}
   *
   * @category Style: Altering
   */
  const undisplayElementNow = element => transitionElementNow(element, PREFIX_DISPLAY, PREFIX_UNDISPLAY);

  /**
   * Like {@link undisplayElementNow} except it will {@link waitForMutateTime},
   * and optionally a delay.
   *
   * @see {@link transitionElement}
   *
   * @category Style: Altering (optimized)
   */
  const undisplayElement = (element, delay = 0) => transitionElement(element, PREFIX_DISPLAY, PREFIX_UNDISPLAY, delay);

  /**
   * Transitions an element from class `lisn-hide` (which makes the element
   * hidden) to `lisn-show` (which shows it). These classes have CSS
   * transitions applied so the element is faded into and out of view.
   *
   * @see {@link transitionElementNow}.
   *
   * @category Style: Altering
   */
  const showElementNow = element => transitionElementNow(element, PREFIX_HIDE, PREFIX_SHOW);

  /**
   * Like {@link showElementNow} except it will {@link waitForMutateTime}, and
   * optionally a delay.
   *
   * @see {@link transitionElement}
   *
   * @category Style: Altering (optimized)
   */
  const showElement = (element, delay = 0) => transitionElement(element, PREFIX_HIDE, PREFIX_SHOW, delay);

  /**
   * The opposite of {@link showElementNow}.
   *
   * @see {@link transitionElementNow}
   *
   * @category Style: Altering
   */
  const hideElementNow = element => transitionElementNow(element, PREFIX_SHOW, PREFIX_HIDE);

  /**
   * Like {@link hideElementNow} except it will {@link waitForMutateTime}, and
   * optionally a delay.
   *
   * @see {@link transitionElement}
   *
   * @category Style: Altering (optimized)
   */
  const hideElement = (element, delay = 0) => transitionElement(element, PREFIX_SHOW, PREFIX_HIDE, delay);

  /**
   * If {@link isElementUndisplayed}, it will {@link displayElementNow},
   * otherwise it will {@link undisplayElementNow}.
   *
   * @see {@link transitionElementNow}
   *
   * @category Style: Altering
   */
  const toggleDisplayElementNow = element => isElementUndisplayed(element) ? displayElementNow(element) : undisplayElementNow(element);

  /**
   * Like {@link toggleDisplayElementNow} except it will {@link waitForMutateTime},
   * and optionally a delay.
   *
   * @see {@link transitionElement}
   *
   * @category Style: Altering (optimized)
   */
  const toggleDisplayElement = (element, delay = 0) => isElementUndisplayed(element) ? displayElement(element, delay) : undisplayElement(element, delay);

  /**
   * If {@link isElementHidden}, it will {@link showElementNow}, otherwise
   * {@link hideElementNow}.
   *
   * @see {@link transitionElementNow}
   *
   * @category Style: Altering
   */
  const toggleShowElementNow = element => isElementHidden(element) ? showElementNow(element) : hideElementNow(element);

  /**
   * Like {@link toggleShowElementNow} except it will {@link waitForMutateTime}, and
   * optionally a delay.
   *
   * @see {@link transitionElement}
   *
   * @category Style: Altering (optimized)
   */
  const toggleShowElement = (element, delay = 0) => isElementHidden(element) ? showElement(element, delay) : hideElement(element, delay);

  /**
   * Returns true if the element's class list contains `lisn-hide`.
   *
   * @category DOM: Querying (optimized)
   */
  const isElementHidden = element => hasClass(element, PREFIX_HIDE);

  /**
   * Returns true if the element's class list contains `lisn-undisplay`.
   *
   * @category DOM: Querying (optimized)
   */
  const isElementUndisplayed = element => hasClass(element, PREFIX_UNDISPLAY);

  /**
   * Returns true if the element's class list contains the given class.
   *
   * @category DOM: Querying (optimized)
   */
  const hasClass = (element, className) => classList(element).contains(className);

  /**
   * Returns true if the element's class list contains all of the given classes.
   *
   * @since v1.2.0
   *
   * @category DOM: Querying (optimized)
   */
  const hasAllClasses = (element, ...classNames) => lengthOf(classNames) > 0 && !some(classNames, className => !hasClass(element, className));

  /**
   * Returns true if the element's class list contains any of the given classes.
   *
   * @since v1.2.0
   *
   * @category DOM: Querying (optimized)
   */
  const hasAnyClass = (element, ...classNames) => some(classNames, className => hasClass(element, className));

  /**
   * Adds the given classes to the element.
   *
   * @category Style: Altering
   */
  const addClassesNow = (element, ...classNames) => classList(element).add(...classNames);

  /**
   * Like {@link addClassesNow} except it will {@link waitForMutateTime}.
   *
   * @category Style: Altering (optimized)
   */
  const addClasses = asyncMutatorFor(addClassesNow);

  /**
   * Removes the given classes to the element.
   *
   * @category Style: Altering
   */
  const removeClassesNow = (element, ...classNames) => classList(element).remove(...classNames);

  /**
   * Like {@link removeClassesNow} except it will {@link waitForMutateTime}.
   *
   * @category Style: Altering (optimized)
   */
  const removeClasses = asyncMutatorFor(removeClassesNow);

  /**
   * Toggles the given class on the element.
   *
   * @param force See {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle | DOMTokenList:toggle}
   *
   * @category Style: Altering
   */
  const toggleClassNow = (element, className, force) => classList(element).toggle(className, force);

  /**
   * Like {@link toggleClassNow} except it will {@link waitForMutateTime}.
   *
   * @category Style: Altering (optimized)
   */
  const toggleClass = asyncMutatorFor(toggleClassNow);

  /**
   * Toggles the given classes on the element. This function does not accept the
   * `force` parameter.
   *
   * @since v1.2.0
   *
   * @category Style: Altering
   */
  const toggleClassesNow = (element, ...classNames) => {
    for (const cls of classNames) {
      toggleClassNow(element, cls);
    }
  };

  /**
   * Like {@link toggleClassesNow} except it will {@link waitForMutateTime}.
   *
   * @since v1.2.0
   *
   * @category Style: Altering (optimized)
   */
  const toggleClasses = asyncMutatorFor(toggleClassesNow);

  /**
   * Replaces the given class on the element with a new one.
   *
   * @since v1.2.0
   *
   * @category Style: Altering
   */
  const replaceClassNow = (element, oldClassName, newClassName) => classList(element).replace(oldClassName, newClassName);

  /**
   * Like {@link replaceClassNow} except it will {@link waitForMutateTime}.
   *
   * @since v1.2.0
   *
   * @category Style: Altering (optimized)
   */
  const replaceClass = asyncMutatorFor(replaceClassNow);

  // For *Data: to avoid unnecessary type checking that ensures element is
  // HTMLElement or SVGElement, use getAttribute instead of dataset.

  /**
   * Returns the value of the given data attribute. The name of the attribute
   * must _not_ start with `data`. It can be in either camelCase or kebab-case,
   * it is converted as needed.
   *
   * @category DOM: Querying (optimized)
   */
  const getData = (element, name) => getAttr(element, prefixData(name));

  /**
   * Returns the value of the given data attribute as a boolean. Its value is
   * expected to be either blank or "true" (which result in `true`), or "false"
   * (which results in `false`).
   *
   * The name of the attribute must _not_ start with `data`. It can be in either
   * camelCase or kebab-case, it is converted as needed.
   *
   * @since v1.2.0
   *
   * @category DOM: Querying (optimized)
   */
  const getBooleanData = (element, name) => {
    const value = getData(element, name);
    return value !== null && value !== "false";
  };

  /**
   * @ignore
   * @deprecated
   */
  const getBoolData = getBooleanData;

  /**
   * Sets the given data attribute.
   *
   * The name of the attribute must _not_ start with `data`. It can be in either
   * camelCase or kebab-case, it is converted as needed.
   *
   * @category Style: Altering
   */
  const setDataNow = (element, name, value) => setAttr(element, prefixData(name), value);

  /**
   * Like {@link setDataNow} except it will {@link waitForMutateTime}.
   *
   * @category Style: Altering (optimized)
   */
  const setData = asyncMutatorFor(setDataNow);

  /**
   * Sets the given data attribute with value "true" (default) or "false".
   *
   * The name of the attribute must _not_ start with `data`. It can be in either
   * camelCase or kebab-case, it is converted as needed.
   *
   * @since v1.2.0
   *
   * @category Style: Altering
   */
  const setBooleanDataNow = (element, name, value = true) => setAttr(element, prefixData(name), value + "");

  /**
   * @ignore
   * @deprecated
   */
  const setBoolDataNow = setBooleanDataNow;

  /**
   * Like {@link setBooleanDataNow} except it will {@link waitForMutateTime}.
   *
   * @since v1.2.0
   *
   * @category Style: Altering (optimized)
   */
  const setBooleanData = asyncMutatorFor(setBooleanDataNow);

  /**
   * @ignore
   * @deprecated
   */
  const setBoolData = setBooleanData;

  /**
   * Sets the given data attribute with value "false".
   *
   * The name of the attribute must _not_ start with `data`. It can be in either
   * camelCase or kebab-case, it is converted as needed.
   *
   * @since v1.2.0
   *
   * @category Style: Altering
   */
  const unsetBooleanDataNow = (element, name) => unsetAttr(element, prefixData(name));

  /**
   * @ignore
   * @deprecated
   */
  const unsetBoolDataNow = unsetBooleanDataNow;

  /**
   * Like {@link unsetBooleanDataNow} except it will {@link waitForMutateTime}.
   *
   * @since v1.2.0
   *
   * @category Style: Altering (optimized)
   */
  const unsetBooleanData = asyncMutatorFor(unsetBooleanDataNow);

  /**
   * @ignore
   * @deprecated
   */
  const unsetBoolData = unsetBooleanData;

  /**
   * Deletes the given data attribute.
   *
   * The name of the attribute must _not_ start with `data`. It can be in either
   * camelCase or kebab-case, it is converted as needed.
   *
   * @category Style: Altering
   */
  const delDataNow = (element, name) => delAttr(element, prefixData(name));

  /**
   * Like {@link delDataNow} except it will {@link waitForMutateTime}.
   *
   * @category Style: Altering (optimized)
   */
  const delData = asyncMutatorFor(delDataNow);

  /**
   * Returns the value of the given property from the computed style of the
   * element.
   *
   * @category DOM: Querying
   */
  const getComputedStylePropNow = (element, prop) => getComputedStyle(element).getPropertyValue(prop);

  /**
   * Like {@link getComputedStylePropNow} except it will {@link waitForMeasureTime}.
   *
   * @category DOM: Querying (optimized)
   */
  const getComputedStyleProp = asyncMeasurerFor(getComputedStylePropNow);

  /**
   * Returns the value of the given property from the inline style of the
   * element.
   *
   * @category DOM: Querying
   */
  const getStylePropNow = (element, prop) => {
    var _style;
    return (_style = element.style) === null || _style === void 0 ? void 0 : _style.getPropertyValue(prop);
  };

  /**
   * Like {@link getStylePropNow} except it will {@link waitForMeasureTime}.
   *
   * @category DOM: Querying (optimized)
   */
  const getStyleProp = asyncMeasurerFor(getStylePropNow);

  /**
   * Sets the given property on the inline style of the element.
   *
   * @category DOM: Altering
   */
  const setStylePropNow = (element, prop, value) => {
    var _style2;
    return (_style2 = element.style) === null || _style2 === void 0 ? void 0 : _style2.setProperty(prop, value);
  };

  /**
   * Like {@link setStylePropNow} except it will {@link waitForMutateTime}.
   *
   * @category DOM: Altering (optimized)
   */
  const setStyleProp = asyncMutatorFor(setStylePropNow);

  /**
   * Deletes the given property on the inline style of the element.
   *
   * @category DOM: Altering
   */
  const delStylePropNow = (element, prop) => {
    var _style3;
    return (_style3 = element.style) === null || _style3 === void 0 ? void 0 : _style3.removeProperty(prop);
  };

  /**
   * Like {@link delStylePropNow} except it will {@link waitForMutateTime}.
   *
   * @category DOM: Altering (optimized)
   */
  const delStyleProp = asyncMutatorFor(delStylePropNow);

  /**
   * Returns the flex direction of the given element **if it has a flex layout**.
   *
   * @returns `null` if the element does not have a flex layout.
   *
   * @category DOM: Querying (optimized)
   *
   * @since v1.2.0
   */
  const getFlexDirection = async element => {
    const displayStyle = await getComputedStyleProp(element, "display");
    if (!displayStyle.includes("flex")) {
      return null;
    }
    return await getComputedStyleProp(element, "flex-direction");
  };

  /**
   * Returns the flex direction of the given element's parent **if it has a flex
   * layout**.
   *
   * @returns `null` if the element's parent does not have a flex layout.
   *
   * @category DOM: Querying (optimized)
   *
   * @since v1.2.0
   */
  const getParentFlexDirection = async element => {
    const parent = parentOf(element);
    return parent ? getFlexDirection(parent) : null;
  };

  /**
   * Returns true if the given element has a flex layout. If direction is given,
   * then it also needs to match.
   *
   * @category DOM: Querying (optimized)
   *
   * @since v1.2.0
   */
  const isFlex = async (element, direction) => {
    const flexDirection = await getFlexDirection(element);
    if (direction) {
      return direction === flexDirection;
    }
    return flexDirection !== null;
  };

  /**
   * Returns true if the given element's parent has a flex layout. If direction is
   * given, then it also needs to match.
   *
   * @category DOM: Querying (optimized)
   *
   * @since v1.2.0
   */
  const isFlexChild = async (element, direction) => {
    const parent = parentOf(element);
    return parent ? isFlex(parent, direction) : false;
  };

  /**
   * In milliseconds.
   *
   * @ignore
   * @internal
   */
  const getMaxTransitionDuration = async element => {
    const propVal = await getComputedStyleProp(element, "transition-duration");
    return max(...splitOn(propVal, ",", true).map(strValue => {
      let duration = parseFloat(strValue) || 0;
      if (strValue === duration + "s") {
        duration *= 1000;
      }
      return duration;
    }));
  };

  /**
   * @ignore
   * @internal
   */
  const disableInitialTransition = async (element, delay = 0) => {
    await addClasses(element, PREFIX_TRANSITION_DISABLE);
    if (delay) {
      await waitForDelay(delay);
    }
    await waitForSubsequentMutateTime();
    removeClassesNow(element, PREFIX_TRANSITION_DISABLE);
  };

  /**
   * @ignore
   * @internal
   */
  const setHasModal = () => setBooleanData(getBody(), PREFIX_HAS_MODAL);

  /**
   * @ignore
   * @internal
   */
  const delHasModal = () => delData(getBody(), PREFIX_HAS_MODAL);

  /**
   * @ignore
   * @internal
   */
  const copyStyle = async (fromElement, toElement, includeComputedProps) => {
    if (!isDOMElement(fromElement) || !isDOMElement(toElement)) {
      return;
    }
    await waitForMeasureTime();
    const props = {};
    if (includeComputedProps) {
      for (const prop of includeComputedProps) {
        props[prop] = getComputedStylePropNow(fromElement, prop);
      }
    }
    const style = fromElement.style; // only inline styles
    for (const prop in style) {
      const value = style.getPropertyValue(prop);
      if (value) {
        props[prop] = value;
      }
    }
    for (const prop in props) {
      setStyleProp(toElement, prop, props[prop]);
    }
    addClasses(toElement, ...classList(fromElement));
  };

  /**
   * If the props keys are in camelCase they are converted to kebab-case
   *
   * If a value is null or undefined, the property is deleted.
   *
   * @ignore
   * @internal
   */
  const setNumericStyleJsVarsNow = (element, props, options = {}) => {
    var _options$_prefix;
    if (!isDOMElement(element)) {
      return;
    }
    const varPrefix = prefixCssJsVar((_options$_prefix = options === null || options === void 0 ? void 0 : options._prefix) !== null && _options$_prefix !== void 0 ? _options$_prefix : "");
    for (const prop in props) {
      const cssPropSuffix = camelToKebabCase(prop);
      const varName = `${varPrefix}${cssPropSuffix}`;
      let value;
      if (!isValidNum(props[prop])) {
        value = null;
      } else {
        var _options$_numDecimal;
        value = props[prop];
        const thisNumDecimal = (_options$_numDecimal = options === null || options === void 0 ? void 0 : options._numDecimal) !== null && _options$_numDecimal !== void 0 ? _options$_numDecimal : value > 0 && value < 1 ? 2 : 0;
        value = roundNumTo(value, thisNumDecimal);
      }
      if (value === null) {
        delStylePropNow(element, varName);
      } else {
        var _options$_units;
        setStylePropNow(element, varName, value + ((_options$_units = options === null || options === void 0 ? void 0 : options._units) !== null && _options$_units !== void 0 ? _options$_units : ""));
      }
    }
  };

  /**
   * @ignore
   * @internal
   */
  const setNumericStyleJsVars = asyncMutatorFor(setNumericStyleJsVarsNow);

  // ----------------------------------------

  const PREFIX_HAS_MODAL = prefixName("has-modal");
  const scheduledCSSTransitions = newWeakMap();
  const cancelCSSTransitions = (element, ...toClasses) => {
    const scheduledTransitions = scheduledCSSTransitions.get(element);
    if (!scheduledTransitions) {
      return;
    }
    for (const toCls of toClasses) {
      const scheduledTransition = scheduledTransitions[toCls];
      if (scheduledTransition) {
        scheduledTransition._cancel();
      }
    }
  };
  const scheduleCSSTransition = (element, toCls) => {
    let scheduledTransitions = scheduledCSSTransitions.get(element);
    if (!scheduledTransitions) {
      scheduledTransitions = {};
      scheduledCSSTransitions.set(element, scheduledTransitions);
    }
    let isCancelled = false;
    scheduledTransitions[toCls] = {
      _cancel: () => {
        isCancelled = true;
        deleteObjKey(scheduledTransitions, toCls);
      },
      _finish: () => {
        deleteObjKey(scheduledTransitions, toCls);
      },
      _isCancelled: () => {
        return isCancelled;
      }
    };
    return scheduledTransitions[toCls];
  };

  /**
   * @module Utils
   *
   * @categoryDescription DOM: Altering
   * These functions alter the DOM tree, but could lead to forced layout if not
   * scheduled using {@link Utils.waitForMutateTime}.
   *
   * @categoryDescription DOM: Altering (optimized)
   * These functions alter the DOM tree in an optimized way using
   * {@link Utils.waitForMutateTime} and so are asynchronous.
   */


  /**
   * Wraps the element in the given wrapper, or a newly created element if not given.
   *
   * @param [options.wrapper]
   *              If it's an element, it is used as the wrapper. If it's a string
   *              tag name, then a new element with this tag is created as the
   *              wrapper. If not given, then `div` is used if the element to be
   *              wrapped has an block-display tag, or otherwise `span` (if the
   *              element to be wrapped has an inline tag name).
   * @param [options.ignoreMove]
   *              If true, the DOM watcher instances will ignore the operation of
   *              replacing the element (so as to not trigger relevant callbacks).
   * @returns The wrapper element that was either passed in options or created.
   *
   * @category DOM: Altering
   */
  const wrapElementNow = (element, options) => {
    const wrapper = createWrapperFor(element, options === null || options === void 0 ? void 0 : options.wrapper);
    if ((options === null || options === void 0 ? void 0 : options.ignoreMove) === true) {
      ignoreMove(element, {
        from: parentOf(element),
        to: wrapper
      });
      ignoreMove(wrapper, {
        to: parentOf(element)
      });
    }
    element.replaceWith(wrapper);
    wrapper.append(element);
    return wrapper;
  };

  /**
   * Like {@link wrapElementNow} except it will {@link Utils.waitForMutateTime}.
   *
   * @category DOM: Altering (optimized)
   */
  const wrapElement = asyncMutatorFor(wrapElementNow);

  /**
   * Wraps the element's children in the given wrapper, or a newly created element
   * if not given.
   *
   * @see {@link wrapElementNow}.
   *
   * @category DOM: Altering
   */
  const wrapChildrenNow = (element, options) => {
    const wrapper = createWrapperFor(element, options === null || options === void 0 ? void 0 : options.wrapper);
    const {
      ignoreMove
    } = options !== null && options !== void 0 ? options : {};
    moveChildrenNow(element, wrapper, {
      ignoreMove
    });
    moveElementNow(wrapper, {
      to: element,
      ignoreMove
    });
    return wrapper;
  };

  /**
   * Like {@link wrapChildrenNow} except it will {@link Utils.waitForMutateTime}.
   *
   * @category DOM: Altering (optimized)
   */
  const wrapChildren = asyncMutatorFor(wrapChildrenNow);

  /**
   * Replace an element with another one.
   *
   * @param [options.ignoreMove]
   *              If true, the DOM watcher instances will ignore the operation of
   *              moving the element (so as to not trigger relevant callbacks).
   *
   * @category DOM: Altering
   */
  const replaceElementNow = (element, newElement, options) => {
    if ((options === null || options === void 0 ? void 0 : options.ignoreMove) === true) {
      ignoreMove(
      // remove element
      element, {
        from: parentOf(element)
      });
      ignoreMove(
      // move newElement to element's current parent
      newElement, {
        from: parentOf(newElement),
        to: parentOf(element)
      });
    }
    element.replaceWith(newElement);
  };

  /**
   * Like {@link replaceElementNow} except it will {@link Utils.waitForMutateTime}.
   *
   * @category DOM: Altering (optimized)
   */
  const replaceElement = asyncMutatorFor(replaceElementNow);

  /**
   * Replace an element with another one.
   *
   * @param [options.ignoreMove]
   *              If true, the DOM watcher instances will ignore the operation of
   *              moving the element (so as to not trigger relevant callbacks).
   *
   * @category DOM: Altering
   */
  const swapElementsNow = (elementA, elementB, options) => {
    const temp = createElement("div");
    replaceElementNow(elementA, temp, options);
    replaceElementNow(elementB, elementA, options);
    replaceElementNow(temp, elementB, options);
  };

  /**
   * Like {@link swapElementsNow} except it will {@link Utils.waitForMutateTime}.
   *
   * @category DOM: Altering (optimized)
   */
  const swapElements = asyncMutatorFor(swapElementsNow);

  // [TODO v2]: moveChildren to accept newParent as options.to

  /**
   * Move an element's children to a new element
   *
   * @param [options.ignoreMove]
   *              If true, the DOM watcher instances will ignore the operation of
   *              moving the children (so as to not trigger relevant callbacks).
   *
   * @category DOM: Altering
   */
  const moveChildrenNow = (oldParent, newParent, options) => {
    if ((options === null || options === void 0 ? void 0 : options.ignoreMove) === true) {
      for (const child of childrenOf(oldParent)) {
        ignoreMove(child, {
          from: oldParent,
          to: newParent
        });
      }
    }
    newParent.append(...childrenOf(oldParent));
  };

  /**
   * Like {@link moveChildrenNow} except it will {@link Utils.waitForMutateTime}.
   *
   * @category DOM: Altering (optimized)
   */
  const moveChildren = asyncMutatorFor(moveChildrenNow);

  /**
   * Moves an element to a new position.
   *
   * @param [options.to]         The new parent or sibling (depending on
   *                             `options.position`). If not given, the
   *                             element is removed from the DOM.
   * @param [options.position]   - append (default): append to `options.to`
   *                             - prepend: prepend to `options.to`
   *                             - before: insert before `options.to`
   *                             - after: insert after `options.to`
   * @param [options.ignoreMove] If true, the DOM watcher instances will
   *                             ignore the operation of moving the element
   *                             (so as to not trigger relevant callbacks).
   *
   * @category DOM: Altering
   */
  const moveElementNow = (element, options) => {
    var _options$to;
    let parentEl = (_options$to = options === null || options === void 0 ? void 0 : options.to) !== null && _options$to !== void 0 ? _options$to : null;
    const position = (options === null || options === void 0 ? void 0 : options.position) || "append";
    if (position === "before" || position === "after") {
      parentEl = parentOf(options === null || options === void 0 ? void 0 : options.to);
    }
    if ((options === null || options === void 0 ? void 0 : options.ignoreMove) === true) {
      ignoreMove(element, {
        from: parentOf(element),
        to: parentEl
      });
    }
    if (options !== null && options !== void 0 && options.to) {
      options.to[position](element);
    } else {
      remove(element);
    }
  };

  /**
   * Like {@link moveElementNow} except it will {@link Utils.waitForMutateTime}.
   *
   * @category DOM: Altering (optimized)
   */
  const moveElement = asyncMutatorFor(moveElementNow);

  /**
   * It will {@link hideElement} and then remove it from the DOM.
   *
   * @param [options.ignoreMove]
   *              If true, the DOM watcher instances will ignore the operation of
   *              replacing the element (so as to not trigger relevant callbacks).
   *
   * @category DOM: Altering (optimized)
   */
  const hideAndRemoveElement = async (element, delay = 0, options) => {
    await hideElement(element, delay);
    moveElementNow(element, options);
  };

  /**
   * @ignore
   * @internal
   */
  const getOrAssignID = (element, prefix = "") => {
    let domID = element.id;
    if (!domID) {
      domID = `${prefix}-${randId()}`;
      element.id = domID;
    }
    return domID;
  };

  /**
   * @ignore
   * @internal
   *
   * @since v1.2.0
   */
  const isAllowedToWrap = element => settings.contentWrappingAllowed === true && getData(element, PREFIX_NO_WRAP) === null;

  /**
   * @ignore
   * @internal
   *
   * @param [options.classNames] Default is [MC.PREFIX_WRAPPER]. Pass `null` to
   *                             disable check.
   *
   * @since v1.2.0
   */
  const getWrapper = (element, options) => {
    const {
      _tagName: tagName,
      _classNames: classNames = [PREFIX_WRAPPER$3]
    } = options !== null && options !== void 0 ? options : {};
    const parent = parentOf(element);
    if (lengthOf(childrenOf(parent)) === 1 && isHTMLElement(parent) && (!tagName || hasTagName(parent, tagName)) && (!classNames || hasAnyClass(parent, ...classNames))) {
      // Already wrapped
      return parent;
    }
    return null; // don't check the element itself, only its parent
  };

  /**
   * @ignore
   * @internal
   *
   * @param [options.classNames] Default is [MC.PREFIX_WRAPPER]. Pass `null` to
   *                             disable check.
   *
   * @since v1.2.0
   */
  const getContentWrapper = (element, options) => {
    const {
      _tagName: tagName,
      _classNames: classNames = [PREFIX_WRAPPER$3]
    } = options !== null && options !== void 0 ? options : {};
    const firstChild = childrenOf(element)[0];
    if (lengthOf(childrenOf(element)) === 1 && isHTMLElement(firstChild) && (!tagName || hasTagName(firstChild, tagName)) && (!classNames || hasAnyClass(firstChild, ...classNames))) {
      // Already wrapped
      return firstChild;
    }
    return null;
  };

  /**
   * @ignore
   * @internal
   *
   * @since v1.2.0
   */
  const tryWrapNow = (element, options) => _tryWrapNow(element, options);

  /**
   * @ignore
   * @internal
   *
   * @since v1.2.0
   */
  const tryWrap = asyncMutatorFor(tryWrapNow);

  /**
   * @ignore
   * @internal
   *
   * @since v1.2.0
   */
  const tryWrapContentNow = (element, options) => _tryWrapNow(element, options, true);

  /**
   * @ignore
   * @internal
   *
   * @since v1.2.0
   */
  const tryWrapContent = asyncMutatorFor(tryWrapContentNow);

  /**
   * @ignore
   * @internal
   *
   * @since v1.2.0
   */
  const unwrapContentNow = (wrapper, classNames) => {
    const parent = wrapper.parentElement;
    if (parent) {
      moveChildrenNow(wrapper, parent, {
        ignoreMove: true
      });
      moveElementNow(wrapper, {
        ignoreMove: true
      });
      if (classNames) {
        removeClassesNow(wrapper, ...classNames);
      }
    }
  };

  /**
   * @ignore
   * @internal
   *
   * @since v1.2.0
   */
  const unwrapContent = asyncMutatorFor(unwrapContentNow);

  /**
   * @ignore
   * @internal
   */
  const cloneElement = element => {
    const clone = element.cloneNode(true);
    setBooleanData(clone, prefixName("clone"));
    return clone;
  };

  /**
   * Creates a dummy hidden clone that's got animation and transitions disabled
   * and absolute position, wrapped in a wrapper (of size 0) and inserts it just
   * before the `insertBefore` element (or if not given, the original element),
   * so that the hidden clone overlaps the actual element's regular
   * (pre-transformed) position.
   *
   * It clears the ID of the clone.
   *
   * Returns the clone.
   *
   * @ignore
   * @internal
   */
  const insertGhostCloneNow = (element, insertBefore = null) => {
    const clone = cloneElement(element);
    clone.id = "";
    addClassesNow(clone, PREFIX_GHOST, PREFIX_TRANSITION_DISABLE, PREFIX_ANIMATE_DISABLE);
    const wrapper = _tryWrapNow(clone, {
      _required: true
    });
    moveElementNow(wrapper, {
      to: insertBefore !== null && insertBefore !== void 0 ? insertBefore : element,
      position: "before",
      ignoreMove: true
    });
    return {
      _wrapper: wrapper,
      _clone: clone
    };
  };

  /**
   * @ignore
   * @internal
   *
   * Exposed via DOMWatcher
   */
  const insertGhostClone = asyncMutatorFor(insertGhostCloneNow);

  /**
   * @ignore
   * @internal
   *
   * Exposed via DOMWatcher
   */
  const ignoreMove = (target, options) => {
    var _options$from, _options$to2;
    return recordsToSkipOnce.set(target, {
      from: (_options$from = options.from) !== null && _options$from !== void 0 ? _options$from : null,
      to: (_options$to2 = options.to) !== null && _options$to2 !== void 0 ? _options$to2 : null
    });
  };

  /**
   * @ignore
   * @internal
   */
  const getIgnoreMove = target => {
    var _recordsToSkipOnce$ge;
    return (_recordsToSkipOnce$ge = recordsToSkipOnce.get(target)) !== null && _recordsToSkipOnce$ge !== void 0 ? _recordsToSkipOnce$ge : null;
  };

  /**
   * @ignore
   * @internal
   */
  const clearIgnoreMove = target => {
    // We should not clear the entry the first time the operation is observed
    // (when we return true here), because there may be multiple DOMWatcher
    // instances that will observe it and need to query it. Instead do it shortly.
    setTimer(() => {
      deleteKey(recordsToSkipOnce, target);
    }, 100);
  };

  /**
   * @ignore
   * @internal
   */
  const insertArrow = (target, direction, position = "append", tag = "span") => {
    const arrow = createElement(tag);
    addClassesNow(arrow, prefixName(S_ARROW));
    setDataNow(arrow, prefixName("direction"), direction);
    moveElement(arrow, {
      to: target,
      position,
      ignoreMove: true
    });
    return arrow;
  };

  // ----------------------------------------

  const recordsToSkipOnce = newMap();
  const createWrapperFor = (element, wrapper) => {
    if (isElement(wrapper)) {
      return wrapper;
    }
    let tag = wrapper;
    if (!tag) {
      if (isInlineTag(tagName(element))) {
        tag = "span";
      } else {
        tag = "div";
      }
    }
    return createElement(tag);
  };
  const _tryWrapNow = (element, options, wrapContent = false // if true, wrap its children, otherwise given element
  ) => {
    const {
      _tagName: tagName$1,
      _classNames: classNames = [PREFIX_WRAPPER$3],
      _ignoreMove: ignoreMove = true,
      _required: required = false,
      _requiredBy: requiredBy = ""
    } = options !== null && options !== void 0 ? options : {};
    const getWrapperFn = wrapContent ? getContentWrapper : getWrapper;
    const wrapFn = wrapContent ? wrapChildrenNow : wrapElementNow;
    const allowedToWrap = isAllowedToWrap(element);
    let wrapper = getWrapperFn(element, options);
    if (!wrapper && (required || allowedToWrap)) {
      wrapper = wrapFn(element, {
        wrapper: tagName$1,
        ignoreMove
      });
      if (classNames) {
        addClassesNow(wrapper, ...classNames);
      }
      if (isInlineTag(tagName(wrapper))) {
        addClassesNow(wrapper, PREFIX_INLINE_WRAPPER);
      }
      if (!allowedToWrap && requiredBy) {
        logWarn(`content wrapping is disabled for element but wrapping is required by ${requiredBy}`);
      }
    }
    return wrapper;
  };

  /**
   * @module Utils
   */

  /**
   * Returns a Promise that is resolved when the given `checkFn` function returns
   * a value other than `null` or `undefined`.
   *
   * The Promise is resolved with `checkFn`'s return value.
   *
   * The function is called initially, and then every time there are changes to
   * the DOM children. Uses
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver | MutationObserver}.
   *
   * @param timeout If given, then if no such element is present after this many
   *                milliseconds, the promise will resolve to `null`.
   *
   * @category DOM: Events
   */
  const waitForElement = (checkFn, timeout) => newPromise(resolve => {
    const callFn = () => {
      const result = checkFn();
      if (!isNullish(result)) {
        resolve(result);
        return true; // done
      }
      return false;
    };
    if (callFn()) {
      return; // resolved already
    }
    if (!isNullish(timeout)) {
      setTimer(() => {
        resolve(null);
        observer.disconnect();
      }, timeout);
    }
    const observer = newMutationObserver(() => {
      if (callFn()) {
        observer.disconnect();
      }
    });
    observer.observe(getDocElement(), {
      childList: true,
      subtree: true
    });
  });

  /**
   * Returns a Promise that is resolved when the given `checkFn` function returns
   * a value other than `null` or `undefined` or the
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState | Document:readyState}
   * becomes "interactive".
   *
   * It always calls the given `checkFn` first before examining the `readyState`.
   *
   * If the `readyState` became interactive before the element was found, the
   * Promise resolves to `null`. Otherwise the Promise is resolved with `checkFn`'s
   * return value.
   *
   * The function is called initially, and then every time there are changes to
   * the DOM children. Uses
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver | MutationObserver}.
   *
   * @category DOM: Events
   */
  const waitForElementOrInteractive = checkFn => newPromise(resolve => {
    let isInteractive = false;
    // Check element first, then readyState. The callback to waitForElement is
    // run synchronously first time, so isInteractive will be false and checkFn
    // will run.
    waitForElement(() => isInteractive || checkFn()).then(res => {
      if (!isInteractive) {
        resolve(res);
      } // else already resolved to null
    });
    waitForInteractive().then(() => {
      isInteractive = true;
      resolve(null);
    });
  });

  /**
   * Returns a Promise that is resolved when the
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState | Document:readyState}
   * is "interactive" (or if it's already "interactive" or "complete", the
   * Promise is fulfilled immediately).
   *
   * @category DOM: Events
   */
  const waitForInteractive = () => newPromise(resolve => {
    const readyState = getReadyState();
    if (readyState === INTERACTIVE || readyState === COMPLETE) {
      resolve();
      return;
    }
    getDoc().addEventListener("DOMContentLoaded", () => resolve());
  });

  /**
   * Returns a Promise that is resolved when the
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState | Document:readyState}
   * is "complete" (or if it's already "complete", the Promise is fulfilled
   * immediately).
   *
   * @category DOM: Events
   */
  const waitForComplete = () => newPromise(resolve => {
    if (getReadyState() === COMPLETE) {
      resolve();
      return;
    }
    getDoc().addEventListener("readystatechange", () => {
      if (getReadyState() === COMPLETE) {
        resolve();
      }
    });
  });

  /**
   * Returns a Promise that is resolved either when the
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState | Document:readyState}
   * is "complete" or the `readyState` is "interactive" and at least
   * {@link settings.pageLoadTimeout} milliseconds have passed (if > 0) since it
   * became "interactive".
   *
   * @category DOM: Events
   */
  const waitForPageReady = () => newPromise(resolve => {
    if (pageIsReady) {
      resolve();
      return;
    }
    return waitForInteractive().then(() => {
      // Setup a listener for the complete state but wait at most
      // <pageLoadTimeout> (if specified)
      let timer = null;
      const dispatchReady = () => {
        pageIsReady = true;
        if (timer) {
          clearTimer(timer);
          timer = null;
        }
        resolve();
      };
      if (settings.pageLoadTimeout > 0) {
        timer = setTimer(() => {
          dispatchReady();
        }, settings.pageLoadTimeout);
      }
      waitForComplete().then(dispatchReady);
    });
  });

  /**
   * Returns true if the page is "ready". See {@link waitForPageReady}.
   *
   * @category DOM: Events
   */
  const isPageReady = () => pageIsReady;

  // --------------------

  const COMPLETE = "complete";
  const INTERACTIVE = "interactive";
  let pageIsReady = false;
  if (!hasDOM()) {
    pageIsReady = true;
  } else {
    waitForPageReady(); // ensure pageIsReady is set even if waitForPageReady is not called
  }

  /**
   * @module Watchers/DOMWatcher
   */


  /**
   * {@link DOMWatcher} listens for changes do the DOM tree. It's built on top of
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver | MutationObserver}.
   *
   * It manages registered callbacks globally and reuses MutationObservers for
   * more efficient performance.
   *
   * Each instance of DOMWatcher manages up to two MutationObservers: one
   * for `childList` changes and one for attribute changes, and it disconnects
   * them when there are no active callbacks for the relevant type.
   *
   * `characterData` and changes to base
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Node | Node}s
   * (non-{@link https://developer.mozilla.org/en-US/docs/Web/API/Element | Element})
   * are not supported.
   */
  class DOMWatcher {
    /**
     * Call the given handler whenever there's a matching mutation within this
     * DOMWatcher's {@link DOMWatcherConfig.root | root}.
     *
     * If {@link OnMutationOptions.skipInitial | options.skipInitial} is `false`
     * (default), _and_ {@link OnMutationOptions.selector | options.selector} is
     * given, _and_ {@link OnMutationOptions.categories | options.categories}
     * includes "added", the handler is also called (almost) immediately with all
     * existing elements matching the selector under this DOMWatcher's
     * {@link DOMWatcherConfig.root | root}.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times, even if
     * the options differ. If the handler has already been added, it is removed
     * and re-added with the current options.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the options are not valid.
     */

    /**
     * Removes a previously added handler.
     */

    /**
     * Ignore an upcoming moving/adding/removing of an element.
     *
     * The operation must complete within the next cycle, by the time
     * MutationObserver calls us.
     *
     * Use this to prevent this instance of DOMWatcher from calling any callbacks
     * that listen for relevant changes as a result of this operation, to prevent
     * loops for example.
     *
     * **IMPORTANT:**
     *
     * Ignoring moving of an element from a parent _inside_ this DOMWatcher's
     * root to another parent that's _outside_ the root, will work as expected,
     * even though the "adding to the new parent" mutation will not be observed.
     * This is because the element's current parent at the time of the mutation
     * callback can be examined.
     *
     * However if you want to ignore moving of an element _from a parent outside
     * this DOMWatcher's root_ you need to specify from: null since the "removal
     * from the old parent" mutation would not be observed and there's no way to
     * examine it's previous parent at the time the "adding to the new parent"
     * mutation is observed.
     *
     * For this reason, setting `options.from` to be an element that's not under
     * the root is internally treated the same as `options.from: null`.
     */

    /**
     * Creates a new instance of DOMWatcher with the given
     * {@link DOMWatcherConfig}. It does not save it for future reuse.
     */
    static create(config) {
      return new DOMWatcher(getConfig$6(config), CONSTRUCTOR_KEY$6);
    }

    /**
     * Returns an existing instance of DOMWatcher with the given
     * {@link DOMWatcherConfig}, or creates a new one.
     *
     * **NOTE:** It saves it for future reuse, so don't use this for temporary
     * short-lived watchers.
     */
    static reuse(config) {
      var _instances$get;
      const myConfig = getConfig$6(config);
      const configStrKey = objToStrKey(omitKeys(myConfig, {
        _root: null
      }));
      const root = myConfig._root === getBody() ? null : myConfig._root;
      let instance = (_instances$get = instances$8.get(root)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(configStrKey);
      if (!instance) {
        instance = new DOMWatcher(myConfig, CONSTRUCTOR_KEY$6);
        instances$8.sGet(root).set(configStrKey, instance);
      }
      return instance;
    }
    constructor(config, key) {
      if (key !== CONSTRUCTOR_KEY$6) {
        throw illegalConstructorError("DOMWatcher.create");
      }
      const logger = result ? new result.Logger({
        name: "DOMWatcher",
        logAtCreation: config
      }) : null;
      const buffer = newXMap(t => ({
        _target: t,
        _categoryBitmask: 0,
        _attributes: newSet(),
        _addedTo: null,
        _removedFrom: null
      }));
      const allCallbacks = newMap();

      // ----------

      let timer = null;
      const mutationHandler = records => {
        logger === null || logger === void 0 || logger.debug9(`Got ${records.length} new records`, records);
        for (const record of records) {
          const target = targetOf(record);
          const recType = record.type;

          /* istanbul ignore next */
          if (!isElement(target)) {
            continue;
          }
          if (recType === S_CHILD_LIST) {
            for (const child of record.addedNodes) {
              if (isElement(child)) {
                const operation = buffer.sGet(child);
                operation._addedTo = target;
                operation._categoryBitmask |= ADDED_BIT;
              }
            }
            for (const child of record.removedNodes) {
              if (isElement(child)) {
                const operation = buffer.sGet(child);
                operation._removedFrom = target;
                operation._categoryBitmask |= REMOVED_BIT;
              }
            }

            //
          } else if (recType === S_ATTRIBUTES && record.attributeName) {
            const operation = buffer.sGet(target);
            operation._attributes.add(record.attributeName);
            operation._categoryBitmask |= ATTRIBUTE_BIT;
          }
        }

        // Schedule flushing of the buffer asynchronously so that we can combine
        // the records from the two MutationObservers.
        if (!timer && sizeOf(buffer)) {
          timer = setTimer(() => {
            logger === null || logger === void 0 || logger.debug9(`Processing ${buffer.size} operations`);
            for (const operation of buffer.values()) {
              if (shouldSkipOperation(operation)) {
                logger === null || logger === void 0 || logger.debug10("Skipping operation", operation);
              } else {
                processOperation(operation);
              }
            }
            buffer.clear();
            timer = null;
          }, 0);
        }
      };
      const observers = {
        [S_CHILD_LIST]: {
          _observer: newMutationObserver(mutationHandler),
          _isActive: false
        },
        [S_ATTRIBUTES]: {
          _observer: newMutationObserver(mutationHandler),
          _isActive: false
        }
      };

      // ----------

      const createCallback = (handler, options) => {
        var _allCallbacks$get;
        remove((_allCallbacks$get = allCallbacks.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
        logger === null || logger === void 0 || logger.debug5("Adding/updating handler", options);
        const callback = wrapCallback(handler);
        callback.onRemove(() => deleteHandler(handler));
        allCallbacks.set(handler, {
          _callback: callback,
          _options: options
        });
        return callback;
      };

      // ----------

      const setupOnMutation = async (handler, userOptions) => {
        var _config$_root;
        const options = getOptions$3(userOptions !== null && userOptions !== void 0 ? userOptions : {});
        const callback = createCallback(handler, options);
        let root = (_config$_root = config._root) !== null && _config$_root !== void 0 ? _config$_root : getBody();
        if (!root) {
          root = await waitForElement(getBody);
        } else {
          // So that the call is always async
          await null;
        }
        if (callback.isRemoved()) {
          return;
        }
        if (options._categoryBitmask & (ADDED_BIT | REMOVED_BIT)) {
          activateObserver(root, S_CHILD_LIST);
        }
        if (options._categoryBitmask & ATTRIBUTE_BIT) {
          activateObserver(root, S_ATTRIBUTES);
        }
        if (userOptions !== null && userOptions !== void 0 && userOptions.skipInitial || !options._selector || !(options._categoryBitmask & ADDED_BIT)) {
          return;
        }

        // As some of the matching elements that currently exist in the root may
        // have just been added and therefore in the MutationObserver's queue, to
        // avoid calling the handler with those entries twice, we empty its queue
        // now and process it (which would also invoke the newly added callback).
        // Then we skip any elements returned in querySelectorAll that were in
        // the queue.

        const childQueue = observers[S_CHILD_LIST]._observer.takeRecords();
        mutationHandler(childQueue);
        for (const element of [...querySelectorAll(root, options._selector), ...(root.matches(options._selector) ? [root] : [])]) {
          const initOperation = {
            _target: element,
            _categoryBitmask: ADDED_BIT,
            _attributes: newSet(),
            _addedTo: parentOf(element),
            _removedFrom: null
          };
          const bufferedOperation = buffer.get(element);
          const diffOperation = getDiffOperation(initOperation, bufferedOperation);
          if (diffOperation) {
            if (shouldSkipOperation(diffOperation)) {
              logger === null || logger === void 0 || logger.debug10("Skipping operation", diffOperation);
            } else {
              logger === null || logger === void 0 || logger.debug5("Calling initially with", diffOperation);
              await invokeCallback$5(callback, diffOperation);
            }
          }
        }
      };

      // ----------

      const deleteHandler = handler => {
        deleteKey(allCallbacks, handler);
        let activeCategories = 0;
        for (const entry of allCallbacks.values()) {
          activeCategories |= entry._options._categoryBitmask;
        }
        if (!(activeCategories & (ADDED_BIT | REMOVED_BIT))) {
          deactivateObserver(S_CHILD_LIST);
        }
        if (!(activeCategories & ATTRIBUTE_BIT)) {
          deactivateObserver(S_ATTRIBUTES);
        }
      };

      // ----------

      const processOperation = operation => {
        logger === null || logger === void 0 || logger.debug10("Processing operation", operation);
        for (const entry of allCallbacks.values()) {
          const categoryBitmask = entry._options._categoryBitmask;
          const target = entry._options._target;
          const selector = entry._options._selector;
          if (!(operation._categoryBitmask & categoryBitmask)) {
            logger === null || logger === void 0 || logger.debug10(`Category does not match: ${categoryBitmask}`);
            continue;
          }
          const currentTargets = [];
          if (target) {
            if (!operation._target.contains(target)) {
              logger === null || logger === void 0 || logger.debug10("Target does not match", target);
              continue;
            }
            currentTargets.push(target);
          }
          if (selector) {
            const matches = [...querySelectorAll(operation._target, selector)];
            if (operation._target.matches(selector)) {
              matches.push(operation._target);
            }
            if (!lengthOf(matches)) {
              logger === null || logger === void 0 || logger.debug10(`Selector does not match: ${selector}`);
              continue;
            }
            currentTargets.push(...matches);
          }
          invokeCallback$5(entry._callback, operation, currentTargets);
        }
      };

      // ----------

      const activateObserver = (root, mutationType) => {
        if (!observers[mutationType]._isActive) {
          logger === null || logger === void 0 || logger.debug3(`Activating mutation observer for '${mutationType}'`);
          observers[mutationType]._observer.observe(root, {
            [mutationType]: true,
            subtree: config._subtree
          });
          observers[mutationType]._isActive = true;
        }
      };

      // ----------

      const deactivateObserver = mutationType => {
        if (observers[mutationType]._isActive) {
          logger === null || logger === void 0 || logger.debug3(`Disconnecting mutation observer for '${mutationType}'`);
          observers[mutationType]._observer.disconnect();
          observers[mutationType]._isActive = false;
        }
      };

      // ----------

      const shouldSkipOperation = operation => {
        var _config$_root2;
        const target = operation._target;
        const requestToSkip = getIgnoreMove(target);
        if (!requestToSkip) {
          return false;
        }
        const removedFrom = operation._removedFrom;
        const addedTo = parentOf(target);
        const requestFrom = requestToSkip.from;
        const requestTo = requestToSkip.to;
        const root = (_config$_root2 = config._root) !== null && _config$_root2 !== void 0 ? _config$_root2 : getBody();
        // If "from" is currently outside our root, we may not have seen a
        // removal operation.
        if ((removedFrom === requestFrom || !root.contains(requestFrom)) && addedTo === requestTo) {
          clearIgnoreMove(target);
          return true;
        }
        return false;
      };

      // ----------

      this.ignoreMove = ignoreMove;

      // ----------

      this.onMutation = setupOnMutation;

      // ----------

      this.offMutation = handler => {
        var _allCallbacks$get2;
        logger === null || logger === void 0 || logger.debug5("Removing handler");
        remove((_allCallbacks$get2 = allCallbacks.get(handler)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2._callback);
      };
    }
  }

  /**
   * @interface
   */

  /**
   * @interface
   */

  /**
   * The handler is invoked with one argument:
   *
   * - a {@link MutationOperation} for a set of mutations related to a particular
   *   element
   *
   * The handler could be invoked multiple times in each "round" (cycle of event
   * loop) if there are mutation operations for more than one element that match
   * the supplied {@link OnMutationOptions}.
   */

  // ----------------------------------------

  const CONSTRUCTOR_KEY$6 = SYMBOL();
  const instances$8 = newXMap(() => newMap());
  const getConfig$6 = config => {
    var _config$root, _config$subtree;
    return {
      _root: (_config$root = config === null || config === void 0 ? void 0 : config.root) !== null && _config$root !== void 0 ? _config$root : null,
      _subtree: (_config$subtree = config === null || config === void 0 ? void 0 : config.subtree) !== null && _config$subtree !== void 0 ? _config$subtree : true
    };
  };
  const CATEGORIES_BITS = DOM_CATEGORIES_SPACE.bit;
  const ADDED_BIT = CATEGORIES_BITS[S_ADDED];
  const REMOVED_BIT = CATEGORIES_BITS[S_REMOVED];
  const ATTRIBUTE_BIT = CATEGORIES_BITS[S_ATTRIBUTE];

  // ----------------------------------------

  const getOptions$3 = options => {
    var _options$selector, _options$target;
    let categoryBitmask = 0;
    const categories = validateStrList("categories", options.categories, DOM_CATEGORIES_SPACE.has);
    if (categories) {
      for (const cat of categories) {
        categoryBitmask |= CATEGORIES_BITS[cat];
      }
    } else {
      categoryBitmask = DOM_CATEGORIES_SPACE.bitmask; // default: all
    }
    const selector = (_options$selector = options.selector) !== null && _options$selector !== void 0 ? _options$selector : "";
    if (!isString(selector)) {
      throw usageError("'selector' must be a string");
    }
    return {
      _categoryBitmask: categoryBitmask,
      _target: (_options$target = options.target) !== null && _options$target !== void 0 ? _options$target : null,
      _selector: selector
    };
  };
  const getDiffOperation = (operationA, operationB) => {
    if (!operationB || operationA._target !== operationB._target) {
      return operationA;
    }
    const attributes = newSet();
    for (const attr of operationA._attributes) {
      if (!operationB._attributes.has(attr)) {
        attributes.add(attr);
      }
    }
    const categoryBitmask = operationA._categoryBitmask ^ operationB._categoryBitmask;
    const addedTo = operationA._addedTo === operationB._addedTo ? null : operationA._addedTo;
    const removedFrom = operationA._removedFrom === operationB._removedFrom ? null : operationA._removedFrom;
    if (!sizeOf(attributes) && !categoryBitmask && !addedTo && !removedFrom) {
      return null;
    }
    return {
      _target: operationA._target,
      _categoryBitmask: categoryBitmask,
      _attributes: attributes,
      _addedTo: addedTo,
      _removedFrom: removedFrom
    };
  };
  const invokeCallback$5 = (callback, operation, currentTargets = []) => {
    if (!lengthOf(currentTargets)) {
      currentTargets = [operation._target];
    }
    for (const currentTarget of currentTargets) {
      callback.invoke({
        target: operation._target,
        currentTarget,
        attributes: operation._attributes,
        addedTo: operation._addedTo,
        removedFrom: operation._removedFrom
      }).catch(logError);
    }
  };

  /**
   * @module Utils
   */


  /**
   * Returns the cardinal direction in the XY plane for the larger of the two
   * deltas (horizontal vs vertical).
   *
   * If both deltas are 0, returns "none".
   *
   * If both deltas are equal and non-0, returns "ambiguous".
   *
   * @category Directions
   */
  const getMaxDeltaDirection = (deltaX, deltaY) => {
    if (!abs(deltaX) && !abs(deltaY)) {
      return S_NONE;
    }
    if (abs(deltaX) === abs(deltaY)) {
      return S_AMBIGUOUS;
    }
    if (abs(deltaX) > abs(deltaY)) {
      return deltaX < 0 ? S_LEFT : S_RIGHT;
    }
    return deltaY < 0 ? S_UP : S_DOWN;
  };

  /**
   * Returns the approximate direction of the given 2D vector as one of the
   * cardinal (XY plane) ones: "up", "down", "left" or "right"; or "ambiguous".
   *
   * @param angleDiffThreshold See {@link areParallel} or
   *                           {@link Utils.areAntiParallel | areAntiParallel}.
   *                           This determines whether the inferred direction is
   *                           ambiguous. For it to _not_ be ambiguous it must
   *                           align with one of the four cardinal directions to
   *                           within `angleDiffThreshold`. It doesn't make
   *                           sense for this value to be < 0 or >= 45 degrees.
   *                           If it is, it's forced to be positive (absolute)
   *                           and <= 44.99.
   *
   * @category Directions
   */
  const getVectorDirection = (vector, angleDiffThreshold = 0) => {
    angleDiffThreshold = min(44.99, abs(angleDiffThreshold));
    if (!maxAbs(...vector)) {
      return S_NONE;
    } else if (areParallel(vector, [1, 0], angleDiffThreshold)) {
      return S_RIGHT;
    } else if (areParallel(vector, [0, 1], angleDiffThreshold)) {
      return S_DOWN;
    } else if (areParallel(vector, [-1, 0], angleDiffThreshold)) {
      return S_LEFT;
    } else if (areParallel(vector, [0, -1], angleDiffThreshold)) {
      return S_UP;
    }
    return S_AMBIGUOUS;
  };

  /**
   * Returns the opposite direction to the given direction or null if the given
   * direction has no opposite.
   *
   * @example
   * ```javascript
   * getOppositeDirection("up"); // -> "down"
   * getOppositeDirection("down"); // -> "up"
   * getOppositeDirection("left"); // -> "right"
   * getOppositeDirection("right"); // -> "left"
   * getOppositeDirection("none"); // -> null
   * getOppositeDirection("ambiguous"); // -> null
   * ```
   *
   * @category Directions
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the given view is not valid.
   */
  const getOppositeDirection = direction => {
    if (!(direction in OPPOSITE_DIRECTIONS)) {
      throw usageError("Invalid 'direction'");
    }
    return OPPOSITE_DIRECTIONS[direction];
  };

  /**
   * Returns the set of directions which are opposite to the given set of directions.
   *
   * There are two sets of opposite pairs ("up"/"down" and "left"/"right") and at
   * least one of the two opposing directions of a pair must be present for the
   * other one to be included. If both directions that constitute a pair of
   * opposites is given, then the other pair is returned instead (minus any that
   * are present in the input). See examples below for clarification.
   *
   * @example
   * ```javascript
   * getOppositeXYDirections("up"); // -> ["down"]
   * getOppositeXYDirections("left"); // -> ["right"]
   * getOppositeXYDirections("up,down"); // -> ["left","right"]
   * getOppositeXYDirections("up,left"); // -> ["down","right"]
   * getOppositeXYDirections("up,left,right"); // -> ["down"]
   * getOppositeXYDirections("none"); // -> throws
   * getOppositeXYDirections("ambiguous"); // -> throws
   * getOppositeXYDirections("in"); // -> throws
   * ```
   *
   * @category Directions
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the given view is not valid.
   */
  const getOppositeXYDirections = directions => {
    const directionList = validateStrList("directions", directions, isValidXYDirection);
    if (!directionList) {
      throw usageError("'directions' is required");
    }
    const opposites = [];
    for (const direction of directionList) {
      const opposite = getOppositeDirection(direction);
      if (opposite && isValidXYDirection(opposite) && !includes(directionList, opposite)) {
        opposites.push(opposite);
      }
    }
    if (!lengthOf(opposites)) {
      for (const direction of XY_DIRECTIONS) {
        if (!includes(directionList, direction)) {
          opposites.push(direction);
        }
      }
    }
    return opposites;
  };

  /**
   * Returns true if the given direction is one of the known XY ones.
   *
   * @category Validation
   */
  const isValidXYDirection = direction => includes(XY_DIRECTIONS, direction);

  /**
   * Returns true if the given direction is one of the known Z ones.
   *
   * @category Validation
   */
  const isValidZDirection = direction => includes(Z_DIRECTIONS, direction);

  /**
   * Returns true if the given string is a valid direction.
   *
   * @category Validation
   */
  const isValidDirection = direction => includes(DIRECTIONS, direction);

  /**
   * Returns true if the given string or array is a list of valid directions.
   *
   * @category Validation
   */
  const isValidDirectionList = directions => isValidStrList(directions, isValidDirection, false);

  /**
   * @ignore
   * @internal
   */
  const XY_DIRECTIONS = [S_UP, S_DOWN, S_LEFT, S_RIGHT];

  /**
   * @ignore
   * @internal
   */
  const Z_DIRECTIONS = [S_IN, S_OUT];

  /**
   * @ignore
   * @internal
   */
  const SCROLL_DIRECTIONS = [...XY_DIRECTIONS, S_NONE, S_AMBIGUOUS];

  /**
   * @ignore
   * @internal
   */
  const DIRECTIONS = [...XY_DIRECTIONS, ...Z_DIRECTIONS, S_NONE, S_AMBIGUOUS];

  // --------------------

  const OPPOSITE_DIRECTIONS = {
    [S_UP]: S_DOWN,
    [S_DOWN]: S_UP,
    [S_LEFT]: S_RIGHT,
    [S_RIGHT]: S_LEFT,
    [S_IN]: S_OUT,
    [S_OUT]: S_IN,
    [S_NONE]: null,
    [S_AMBIGUOUS]: null
  };

  /**
   * @module Utils
   */


  /**
   * Calls the given event listener, which could be a function that's callable
   * directly, or an object that has a `handleEvent` function property.
   *
   * @category Events: Generic
   */
  const callEventListener = (handler, event) => {
    if (isFunction(handler)) {
      var _event$currentTarget;
      handler.call((_event$currentTarget = event.currentTarget) !== null && _event$currentTarget !== void 0 ? _event$currentTarget : self, event);
    } else {
      var _event$currentTarget2;
      handler.handleEvent.call((_event$currentTarget2 = event.currentTarget) !== null && _event$currentTarget2 !== void 0 ? _event$currentTarget2 : self, event);
    }
  };

  /**
   * Adds an event listener for the given event name to the given target.
   *
   * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener | EventTarget:addEventListener}
   * but it handles `options` object in case the browser does not support those.
   * Does not support the `signal` option unless browser natively supports that.
   *
   * @returns `true` if successfully added, or `false` if the same handler has
   * already been added by us, or if the handler is not a valid event listener.
   *
   * @category Events: Generic
   */
  const addEventListenerTo = (target, eventType, handler, options) => {
    options !== null && options !== void 0 ? options : options = false;
    eventType = transformEventType(eventType);
    if (getEventHandlerData(target, eventType, handler, options)) {
      // already added
      return false;
    }
    let thirdArg = options;
    let wrappedHandler = handler;

    // If the user passed an options object but the browser only supports a
    // boolen for 'useCapture', then handle this.
    const supports = getBrowserSupport();
    if (isNonPrimitive(options)) {
      if (!supports._optionsArg) {
        var _options$capture;
        thirdArg = (_options$capture = options.capture) !== null && _options$capture !== void 0 ? _options$capture : false;
      }
      if (options.once && !supports._options.once) {
        // Remove the handler once it's called once
        wrappedHandler = event => {
          removeEventListenerFrom(target, eventType, handler, options);
          callEventListener(handler, event);
        };
      }
    }
    setEventHandlerData(target, eventType, handler, options, {
      _wrappedHandler: wrappedHandler,
      _thirdArg: thirdArg
    });
    target.addEventListener(eventType, wrappedHandler, thirdArg);
    return true;
  };

  /**
   * Removes an event listener that has been added using
   * {@link addEventListenerTo}.
   *
   * **IMPORTANT:** If you have added a listener using the built-in
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener | EventTarget:addEventListener},
   * then you should use
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener | EventTarget:removeEventListener},
   * to remove it, not this function.
   *
   * @returns `true` if successfully removed, or `false` if the handler has not
   * been added by us.
   *
   * @category Events: Generic
   */
  const removeEventListenerFrom = (target, eventType, handler, options) => {
    options !== null && options !== void 0 ? options : options = false;
    eventType = transformEventType(eventType);
    const data = getEventHandlerData(target, eventType, handler, options);
    if (!data) {
      return false;
    }
    target.removeEventListener(eventType, data._wrappedHandler, data._thirdArg);
    deleteEventHandlerData(target, eventType, handler, options);
    return true;
  };

  /**
   * @ignore
   * @internal
   */
  const preventSelect = target => {
    addEventListenerTo(target, S_SELECTSTART, preventDefault);
    if (isElement(target)) {
      addClasses(target, PREFIX_NO_SELECT);
    }
  };

  /**
   * @ignore
   * @internal
   */
  const undoPreventSelect = target => {
    removeEventListenerFrom(target, S_SELECTSTART, preventDefault);
    if (isElement(target)) {
      removeClasses(target, PREFIX_NO_SELECT);
    }
  };

  /**
   * @ignore
   * @internal
   */
  const getBrowserSupport = () => {
    if (browserEventSupport) {
      // already detected
      return browserEventSupport;
    }
    const supports = {
      _pointer: false,
      _optionsArg: false,
      _options: {
        capture: false,
        passive: false,
        once: false,
        signal: false
      }
    };

    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#safely_detecting_option_support
    const optTest = {};
    let opt;
    for (opt in supports._options) {
      const thisOpt = opt;
      defineProperty(optTest, thisOpt, {
        get: () => {
          supports._options[thisOpt] = true;
          if (thisOpt === "signal") {
            return new AbortController().signal;
          }
          return false;
        }
      });
    }
    const dummyHandler = () => {}; // TypeScript does not accept null
    const dummyElement = createElement("div");
    try {
      dummyElement.addEventListener("testOptionSupport", dummyHandler, optTest);
      dummyElement.removeEventListener("testOptionSupport", dummyHandler, optTest);
      supports._optionsArg = true;
    } catch (e__ignored) {
      //
    }
    supports._pointer = "onpointerup" in dummyElement;
    browserEventSupport = supports;
    return supports;
  };

  // --------------------

  let browserEventSupport;
  const registeredEventHandlerData = newXWeakMap(newXMapGetter(newXMapGetter(() => newMap())));

  // detect browser features, see below

  const getEventOptionsStr = options => {
    const finalOptions = {
      capture: false,
      passive: false,
      once: false
    };
    if (options === false || options === true) {
      finalOptions.capture = options;
    } else if (isObject(options)) {
      copyExistingKeys(options, finalOptions);
    }
    return stringify(finalOptions);
  };
  const getEventHandlerData = (target, eventType, handler, options) => {
    var _registeredEventHandl;
    const optionsStr = getEventOptionsStr(options);
    return (_registeredEventHandl = registeredEventHandlerData.get(target)) === null || _registeredEventHandl === void 0 || (_registeredEventHandl = _registeredEventHandl.get(eventType)) === null || _registeredEventHandl === void 0 || (_registeredEventHandl = _registeredEventHandl.get(handler)) === null || _registeredEventHandl === void 0 ? void 0 : _registeredEventHandl.get(optionsStr);
  };
  const deleteEventHandlerData = (target, eventType, handler, options) => {
    var _registeredEventHandl2;
    const optionsStr = getEventOptionsStr(options);
    deleteKey((_registeredEventHandl2 = registeredEventHandlerData.get(target)) === null || _registeredEventHandl2 === void 0 || (_registeredEventHandl2 = _registeredEventHandl2.get(eventType)) === null || _registeredEventHandl2 === void 0 ? void 0 : _registeredEventHandl2.get(handler), optionsStr);
    registeredEventHandlerData.prune(target, eventType, handler);
  };
  const setEventHandlerData = (target, eventType, handler, options, data) => {
    const optionsStr = getEventOptionsStr(options);
    registeredEventHandlerData.sGet(target).sGet(eventType).sGet(handler).set(optionsStr, data);
  };
  const transformEventType = eventType => {
    const supports = getBrowserSupport();
    if (eventType.startsWith(S_POINTER) && !supports._pointer) {
      // TODO maybe log a warning message is it's not supported, e.g. there's no
      // mousecancel
      return strReplace(eventType, S_POINTER, S_MOUSE);
    }
    return eventType;
  };

  /**
   * @module Utils
   */


  /**
   * `deltaX` and `deltaY` together specify the precise direction in the XY plane
   * of the move if relevant (i.e. other than zoom intent). The direction
   * specifies the effective X ("left"/"right"), Y ("up"/"down") or Z ("in"/"out")
   * direction, or "none"/"ambiguous".
   *
   * `deltaZ` specifies relative zoom in or out for zoom intents.
   * For zoom in, deltaZ is always > 1, and for zoom out it is < 1.
   * For non-zoom events it is 1.
   *
   * For zoom intents, `direction` would be either in, out or none.
   * For other intents, it would be up, down, left, right, none or ambiguous.
   *
   * For important notes on the delta values see
   * - {@link Utils.getKeyGestureFragment | getKeyGestureFragment}
   * - {@link Utils.getTouchGestureFragment | getTouchGestureFragment}
   * - {@link Utils.getWheelGestureFragment | getWheelGestureFragment}
   *
   * @category Gestures
   */

  /**
   * Returns true if the given string is a valid gesture device.
   *
   * @category Validation
   */
  const isValidInputDevice = device => includes(DEVICES, device);

  /**
   * Returns true if the given string is a valid gesture intent.
   *
   * @category Validation
   */
  const isValidIntent = intent => includes(INTENTS, intent);

  /**
   * Returns true if the given string or array is a list of valid gesture
   * devices.
   *
   * @category Validation
   */
  const isValidInputDeviceList = devices => isValidStrList(devices, isValidInputDevice, false);

  /**
   * Returns true if the given string or array is a list of valid gesture
   * intents.
   *
   * @category Validation
   */
  const isValidIntentList = intents => isValidStrList(intents, isValidIntent, false);

  /**
   * @ignore
   * @internal
   */
  const addDeltaZ = (current, increment) => max(MIN_DELTA_Z, current * increment);

  /**
   * @ignore
   * @internal
   */
  const DEVICES = [S_KEY, S_POINTER, S_TOUCH, S_WHEEL];

  /**
   * @ignore
   * @internal
   */
  const INTENTS = [S_SCROLL, S_ZOOM, S_DRAG, S_UNKNOWN];

  // Do not allow zooming out more than this value
  const MIN_DELTA_Z = 0.1;

  /**
   * @module Utils
   */


  /**
   * Returns a {@link GestureFragment} for the given events. Only "keydown"
   * events will be considered.
   *
   * If there are no "keydown" events in the given list of events, returns
   * `false`.
   *
   * The deltas of all events are summed together before determining final delta
   * and direction.
   *
   * If the events are of conflicting types, i.e. some scroll, some zoom, then
   * the intent will be "unknown" and the direction will be "ambiguous".
   *
   * Otherwise, if the deltas sum up to 0, the direction will be "none".
   *
   * **IMPORTANT NOTES ON THE DELTA VALUES**
   *
   * For key gestures the deltas are unreliable. You should not assume they
   * correspond to the would-be scroll or zoom amount that the browser would do.
   * But they can be used to determine relative amounts for animating, etc.
   *
   * Key press events can be divided into 3 categories: that scroll by a "line"
   * (e.g. arrow keys), by a "page" (e.g. PageUp/PageDown) or by the full content
   * height/width (e.g. Home/End). The actual scroll amount that _would_ result
   * from the event is dependent on the browser, the window size or the element's
   * scroll width/height, so ours can only be a best guess.
   *
   * Since the actual pixel equivalent is browser specific, we use reasonable
   * default values of delta for each of these "line", "page" or "content" modes,
   * similar to what
   * {@link Utils.getWheelGestureFragment | getWheelGestureFragment} does:
   * - For "line", then a configurable fixed value is used
   *  ({@link settings.deltaLineHeight}).
   * - For "page", then a configurable fixed value is used
   *  ({@link settings.deltaPageHeight}).
   * - For "content", the element's scroll height is used if given, otherwise
   *   the viewport height (same as "page"). We do not try to get the current
   *   scroll height of the target element, (which would be the best guess value
   *   of `deltaY` in case of Home/End key presses), as that would either involve
   *   an asynchronous action or would result in forced layout. If the caller is
   *   already tracking the scroll height of the target, you can pass this as an
   *   argument. Otherwise, we'll default to using the viewport height, same as
   *   for PageUp/Down.
   *
   * If the key gesture fragment is a result of multiple events that were
   * accumulated, the deltas are summed as usual, e.g. if a "page" is equal to 20
   * "lines", then pressing PageDown and then 10 times Up, would result in a
   * delta equal to 10 "lines" down.
   *
   * For zoom intents, `deltaZ` gives a relative change of scale, whereby each
   * press of + or - steps up by 15% or down by ~13% (`1 / 1.15` to be exact)
   * since the previous one.
   *
   * @param [options.angleDiffThreshold] See {@link getVectorDirection}
   * @param [options.scrollHeight]       Use this as deltaY when Home/End is
   *                                     pressed.
   *
   * @returns `false` if there are no "keydown" events in the list, otherwise a
   * {@link GestureFragment}.
   *
   * @category Gestures
   */
  const getKeyGestureFragment = (events, options) => {
    var _options$scrollHeight;
    if (!isIterableObject(events)) {
      events = [events];
    }
    const LINE = settings.deltaLineHeight;
    const PAGE = settings.deltaPageHeight;
    const CONTENT = (_options$scrollHeight = options === null || options === void 0 ? void 0 : options.scrollHeight) !== null && _options$scrollHeight !== void 0 ? _options$scrollHeight : PAGE;
    const deltasUp = amount => [0, -amount, 1];
    const deltasDown = amount => [0, amount, 1];
    const deltasLeft = amount => [-amount, 0, 1];
    const deltasRight = amount => [amount, 0, 1];
    const deltasIn = [0, 0, 1.15];
    const deltasOut = [0, 0, 1 / 1.15];
    let direction = S_NONE;
    let intent = null;
    let deltaX = 0,
      deltaY = 0,
      deltaZ = 1;
    for (const event of events) {
      var _deltasForKey$event$k;
      if (!isKeyboardEvent(event) || event.type !== S_KEYDOWN) {
        continue;
      }
      const deltasForKey = {
        [SK_UP]: deltasUp(LINE),
        [SK_ARROWUP]: deltasUp(LINE),
        [SK_PAGEUP]: deltasUp(PAGE),
        Home: deltasUp(CONTENT),
        [SK_DOWN]: deltasDown(LINE),
        [SK_ARROWDOWN]: deltasDown(LINE),
        [SK_PAGEDOWN]: deltasDown(PAGE),
        End: deltasDown(CONTENT),
        [SK_LEFT]: deltasLeft(LINE),
        [SK_ARROWLEFT]: deltasLeft(LINE),
        [SK_RIGHT]: deltasRight(LINE),
        [SK_ARROWRIGHT]: deltasRight(LINE),
        " ": (event.shiftKey ? deltasUp : deltasDown)(PAGE),
        "+": deltasIn,
        "=": event.ctrlKey ? deltasIn : null,
        "-": deltasOut
      };
      const theseDeltas = (_deltasForKey$event$k = deltasForKey[event.key]) !== null && _deltasForKey$event$k !== void 0 ? _deltasForKey$event$k : null;
      if (!theseDeltas) {
        // not a relevant key
        continue;
      }
      const [thisDeltaX, thisDeltaY, thisDeltaZ] = theseDeltas;
      const thisIntent = thisDeltaZ !== 1 ? S_ZOOM : S_SCROLL;
      deltaX += thisDeltaX;
      deltaY += thisDeltaY;
      deltaZ = addDeltaZ(deltaZ, thisDeltaZ);
      if (!intent) {
        intent = thisIntent;
      } else if (intent !== thisIntent) {
        // mixture of zoom and scroll
        intent = S_UNKNOWN;
      }
    }
    if (!intent) {
      return false; // no relevant events
    } else if (intent === S_UNKNOWN) {
      direction = S_AMBIGUOUS;
    } else if (intent === S_ZOOM) {
      direction = deltaZ > 1 ? S_IN : deltaZ < 1 ? S_OUT : S_NONE;
    } else {
      direction = getVectorDirection([deltaX, deltaY], options === null || options === void 0 ? void 0 : options.angleDiffThreshold);
    }
    return direction === S_NONE ? false : {
      device: S_KEY,
      direction,
      intent,
      deltaX,
      deltaY,
      deltaZ
    };
  };

  // --------------------

  const SK_UP = "Up";
  const SK_DOWN = "Down";
  const SK_LEFT = "Left";
  const SK_RIGHT = "Right";
  const SK_PAGE = "Page";
  const SK_ARROW = "Arrow";
  const SK_PAGEUP = SK_PAGE + SK_UP;
  const SK_PAGEDOWN = SK_PAGE + SK_DOWN;
  const SK_ARROWUP = SK_ARROW + SK_UP;
  const SK_ARROWDOWN = SK_ARROW + SK_DOWN;
  const SK_ARROWLEFT = SK_ARROW + SK_LEFT;
  const SK_ARROWRIGHT = SK_ARROW + SK_RIGHT;

  /**
   * @module Utils
   */

  /**
   * Returns a {@link GestureFragment} for the given events. If the browser
   * supports Pointer events, then only "pointermove" events will be considered.
   * Otherwise, only "mousemove" events will be considered.
   *
   * If there are less than 2 such events in the given list of events, returns
   * `false`.
   *
   * If the gesture is to be considered terminated, e.g. because there is
   * "pointercancel" in the list or buttons other than the primary are pressed,
   * returns `null`.
   *
   * Pointer gestures always require the primary button to be pressed and the
   * resulting intent is always "drag", and `deltaZ` is always 1.
   *
   * @param [options.angleDiffThreshold] See {@link getVectorDirection}
   *
   * @returns `false` if there are less than 2 "pointermove"/"mousemove" events
   * in the list, `null` if the gesture is terminated, otherwise a
   * {@link GestureFragment}.
   *
   * @category Gestures
   */
  const getPointerGestureFragment = (events, options) => {
    if (!isIterableObject(events)) {
      events = [events];
    }
    let isCancelled = false;
    const supports = getBrowserSupport();

    // If the browser supports pointer events, then only take those; otherwise
    // take the mouse events
    const pointerEventClass = supports._pointer ? PointerEvent : MouseEvent;
    const pointerUpType = supports._pointer ? S_POINTERUP : S_MOUSEUP;
    const filteredEvents = filter(events, event => {
      const eType = event.type;
      isCancelled = isCancelled || eType === S_POINTERCANCEL;
      if (eType !== S_CLICK && isInstanceOf(event, pointerEventClass)) {
        // Only events where the primary button is pressed (unless it's a
        // pointerup event, in which case no buttons should be pressed) are
        // considered, otherwise consider it terminated
        isCancelled = isCancelled || eType === pointerUpType && event.buttons !== 0 || eType !== pointerUpType && event.buttons !== 1;
        // we don't handle touch pointer events
        return !isTouchPointerEvent(event);
      }
      return false;
    });
    const numEvents = lengthOf(filteredEvents);
    if (numEvents < 2) {
      return false; // no enough events
    }
    if (isCancelled) {
      return null; // terminated
    }
    const firstEvent = filteredEvents[0];
    const lastEvent = filteredEvents[numEvents - 1];
    if (getPointerType(firstEvent) !== getPointerType(lastEvent)) {
      return null; // different devices, consider it terminated
    }
    const deltaX = lastEvent.clientX - firstEvent.clientX;
    const deltaY = lastEvent.clientY - firstEvent.clientY;
    const direction = getVectorDirection([deltaX, deltaY], options === null || options === void 0 ? void 0 : options.angleDiffThreshold);
    return direction === S_NONE ? false : {
      device: S_POINTER,
      direction,
      intent: S_DRAG,
      deltaX,
      deltaY,
      deltaZ: 1
    };
  };

  /**
   * @module Utils
   */


  /**
   * @category Gestures
   */

  /**
   * Returns a {@link GestureFragment} for the given events. Only "touchmove" events
   * will be considered.
   *
   * If there are less than 2 such events in the given list of events, returns `false`.
   *
   * If the gesture is to be considered terminated, e.g. because there is
   * "touchcancel" in the list, returns `null`.
   *
   * Note that by default swipe actions follow the natural direction: swipe up
   * with scroll intent results in direction down and swipe down results in
   * direction up. Drag intent always follows the direction of the gesture.
   *
   * For zoom intents, which necessarily involves exactly two fingers `deltaZ`
   * is based on the relative change in distance between the fingers.
   *
   * @param [options.deltaThreshold]
   *                          A change of x or y coordinate less than this is
   *                          considered insignificant, for the purposes of
   *                          determining:
   *                          1) whether the inferred direction is in one of the
   *                             four cardinal ones, or otherwise ambiguous; and
   *                          2) whether more than two fingers have moved and
   *                             therefore whether the direction could be zoom or
   *                             not
   * @param [options.angleDiffThreshold] See {@link getVectorDirection}
   * @param [options.reverseScroll]
   *                          If set to `true`, will disable natural scroll
   *                          direction.
   * @param [options.dragHoldTime]
   *                          If the user presses and holds for at least the
   *                          given amount of milliseconds before moving the
   *                          finger(s), gestures other than pinch will be
   *                          treated as a drag instead of scroll as long as the
   *                          number of fingers touching the screen is
   *                          `options.dragNumFingers`. Default is 500ms.
   * @param [options.dragNumFingers]
   *                          The number of fingers that could be considered a
   *                          drag intent. Default is 1.
   *
   * @returns `false` if there are less than 2 "touchmove" events in the list,
   * `null` if the gesture is terminated, otherwise a {@link GestureFragment}.
   *
   * @category Gestures
   */
  const getTouchGestureFragment = (events, options) => {
    var _options$dragHoldTime, _options$dragNumFinge;
    if (!isIterableObject(events)) {
      events = [events];
    }
    let moves = getTouchDiff(events, options === null || options === void 0 ? void 0 : options.deltaThreshold);
    if (!moves) {
      return null; // terminated
    }
    let numMoves = lengthOf(moves);
    const holdTime = getHoldTime(events);
    const canBeDrag = holdTime >= ((_options$dragHoldTime = options === null || options === void 0 ? void 0 : options.dragHoldTime) !== null && _options$dragHoldTime !== void 0 ? _options$dragHoldTime : 500) && numMoves === ((_options$dragNumFinge = options === null || options === void 0 ? void 0 : options.dragNumFingers) !== null && _options$dragNumFinge !== void 0 ? _options$dragNumFinge : 1);
    const angleDiffThreshold = options === null || options === void 0 ? void 0 : options.angleDiffThreshold;
    let deltaX = havingMaxAbs(...moves.map(m => m.deltaX));
    let deltaY = havingMaxAbs(...moves.map(m => m.deltaY));
    let deltaZ = 1;
    if (numMoves > 2) {
      // Take only the significant ones
      moves = filter(moves, d => d.isSignificant);
      numMoves = lengthOf(moves);
    }
    let direction = S_NONE;
    let intent = S_UNKNOWN;
    if (numMoves === 2) {
      // Check if it's a zoom
      const vectorA = [moves[0].deltaX, moves[0].deltaY];
      const vectorB = [moves[1].deltaX, moves[1].deltaY];

      // If either finger is approx stationary, or if they move in opposite directions,
      // treat it as zoom.
      if (!havingMaxAbs(...vectorA) ||
      // finger A still
      !havingMaxAbs(...vectorB) ||
      // finger B still
      areAntiParallel(vectorA, vectorB, angleDiffThreshold)) {
        // It's a pinch motion => zoom
        const startDistance = distanceBetween([moves[0].startX, moves[0].startY], [moves[1].startX, moves[1].startY]);
        const endDistance = distanceBetween([moves[0].endX, moves[0].endY], [moves[1].endX, moves[1].endY]);
        direction = startDistance < endDistance ? S_IN : S_OUT;
        deltaZ = endDistance / startDistance;
        deltaX = deltaY = 0;
        intent = S_ZOOM;
      }
    }
    const deltaSign = canBeDrag || options !== null && options !== void 0 && options.reverseScroll ? 1 : -1;
    // If scrolling, swap the deltas for natural scroll direction.
    // Add +0 to force -0 to be +0 since jest doesn't think they're equal
    deltaX = deltaSign * deltaX + 0;
    deltaY = deltaSign * deltaY + 0;
    if (direction === S_NONE) {
      // Wasn't a zoom. Check if all moves are aligned.
      let isFirst = true;
      for (const m of moves) {
        // There's at least one significant move, assume scroll or drag intent.
        intent = canBeDrag ? S_DRAG : S_SCROLL;
        const thisDirection = getVectorDirection([deltaSign * m.deltaX, deltaSign * m.deltaY], angleDiffThreshold);
        if (thisDirection === S_NONE) {
          continue;
        }
        if (isFirst) {
          direction = thisDirection;
        } else if (direction !== thisDirection) {
          direction = S_AMBIGUOUS;
          break;
        }
        isFirst = false;
      }
    }
    if (direction === S_NONE) {
      const lastTouchEvent = lastOf(events.filter(isTouchEvent));
      // If all fingers have lifted off, consider it terminated, otherwise wait
      // for more events.
      return lengthOf(lastTouchEvent === null || lastTouchEvent === void 0 ? void 0 : lastTouchEvent.touches) ? false : null;
    }
    return {
      device: S_TOUCH,
      direction,
      intent,
      deltaX,
      deltaY,
      deltaZ
    };
  };

  /**
   * Returns a description of the changes in each finger between the first and
   * the last relevant TouchEvent in the list.
   *
   * If the gesture is to be considered terminated, e.g. because there is
   * "touchcancel" in the list, returns `null`.
   *
   * Note that, `deltaX`/`deltaY` are the end X/Y coordinate minus the start X/Y
   * coordinate. For natural scroll direction you should swap their signs.
   *
   * @param deltaThreshold If the change of x and y coordinate are both less
   *                       than this, it is marked as not significant.
   *
   * @category Gestures
   */
  const getTouchDiff = (events, deltaThreshold = 0) => {
    // Group each touch point of each event by identifier, so that we can get the
    // start and end coordinate of each finger
    const groupedTouches = newXMap(() => []);
    for (const event of events) {
      if (!isTouchEvent(event)) {
        continue;
      }
      if (event.type === S_TOUCHCANCEL) {
        return null; // gesture terminated
      }
      for (const touch of event.touches) {
        groupedTouches.sGet(touch.identifier).push(touch);
      }
    }
    const moves = [];
    for (const touchList of groupedTouches.values()) {
      const nTouches = lengthOf(touchList);
      if (nTouches < 2) {
        // Only one event had that finger in it, so there's no move for it
        continue;
      }
      const firstTouch = touchList[0];
      const lastTouch = touchList[nTouches - 1];
      const startX = firstTouch.clientX;
      const startY = firstTouch.clientY;
      const endX = lastTouch.clientX;
      const endY = lastTouch.clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const isSignificant = maxAbs(deltaX, deltaY) >= deltaThreshold;

      // Consider it a move in one of the 4 cardinal ones
      moves.push({
        startX,
        startY,
        endX,
        endY,
        deltaX,
        deltaY,
        isSignificant
      });
    }
    return moves;
  };

  // --------------------

  const getHoldTime = events => {
    const firstStart = events.findIndex(e => e.type === S_TOUCHSTART);
    const firstMove = events.findIndex(e => e.type === S_TOUCHMOVE);
    if (firstStart < 0 || firstMove < 1) {
      return 0;
    }
    return events[firstMove].timeStamp - events[firstStart].timeStamp;
  };

  /**
   * @module
   * @ignore
   * @internal
   *
   * FULL CREDIT FOR THIS GOES TO
   * https://github.com/facebookarchive/fixed-data-table/blob/master/src/vendor_upstream/dom/normalizeWheel.js
   *
   * ADAPTED FROM THE ABOVE SOURCE
   *
   * ORIGINAL COPYRIGHT IN FILE PRESERVED:
   *
   * Copyright (c) 2015, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * ORIGINAL LICENSE
   *
   * BSD License
   *
   * For FixedDataTable software
   *
   * Copyright (c) 2015, Facebook, Inc. All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without modification,
   * are permitted provided that the following conditions are met:
   *
   *  * Redistributions of source code must retain the above copyright notice, this
   *    list of conditions and the following disclaimer.
   *
   *  * Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the documentation
   *    and/or other materials provided with the distribution.
   *
   *  * Neither the name Facebook nor the names of its contributors may be used to
   *    endorse or promote products derived from this software without specific
   *    prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
   * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
   * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
   * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
   * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */


  /**
   * ORIGINAL DEVELOPER COMMENT PRESERVED
   *
   * Mouse wheel (and 2-finger trackpad) support on the web sucks.  It is
   * complicated, thus this doc is long and (hopefully) detailed enough to answer
   * your questions.
   *
   * If you need to react to the mouse wheel in a predictable way, this code is
   * like your bestest friend. * hugs *
   *
   * As of today, there are 4 DOM event types you can listen to:
   *
   *   'wheel'                -- Chrome(31+), FF(17+), IE(9+)
   *   'mousewheel'           -- Chrome, IE(6+), Opera, Safari
   *   'MozMousePixelScroll'  -- FF(3.5 only!) (2010-2013) -- don't bother!
   *   'DOMMouseScroll'       -- FF(0.9.7+) since 2003
   *
   * So what to do?  The is the best:
   *
   *   normalizeWheel.getEventType();
   *
   * In your event callback, use this code to get sane interpretation of the
   * deltas.  This code will return an object with properties:
   *
   *   spinX   -- normalized spin speed (use for zoom) - x plane
   *   spinY   -- " - y plane
   *   pixelX  -- normalized distance (to pixels) - x plane
   *   pixelY  -- " - y plane
   *
   * Wheel values are provided by the browser assuming you are using the wheel to
   * scroll a web page by a number of lines or pixels (or pages).  Values can vary
   * significantly on different platforms and browsers, forgetting that you can
   * scroll at different speeds.  Some devices (like trackpads) emit more events
   * at smaller increments with fine granularity, and some emit massive jumps with
   * linear speed or acceleration.
   *
   * This code does its best to normalize the deltas for you:
   *
   *   - spin is trying to normalize how far the wheel was spun (or trackpad
   *     dragged).  This is super useful for zoom support where you want to
   *     throw away the chunky scroll steps on the PC and make those equal to
   *     the slow and smooth tiny steps on the Mac. Key data: This code tries to
   *     resolve a single slow step on a wheel to 1.
   *
   *   - pixel is normalizing the desired scroll delta in pixel units.  You'll
   *     get the crazy differences between browsers, but at least it'll be in
   *     pixels!
   *
   *   - positive value indicates scrolling DOWN/RIGHT, negative UP/LEFT.  This
   *     should translate to positive value zooming IN, negative zooming OUT.
   *     This matches the newer 'wheel' event.
   *
   * Why are there spinX, spinY (or pixels)?
   *
   *   - spinX is a 2-finger side drag on the trackpad, and a shift + wheel turn
   *     with a mouse.  It results in side-scrolling in the browser by default.
   *
   *   - spinY is what you expect -- it's the classic axis of a mouse wheel.
   *
   *   - I dropped spinZ/pixelZ.  It is supported by the DOM 3 'wheel' event and
   *     probably is by browsers in conjunction with fancy 3D controllers .. but
   *     you know.
   *
   * Implementation info:
   *
   * Examples of 'wheel' event if you scroll slowly (down) by one step with an
   * average mouse:
   *
   *   OS X + Chrome  (mouse)     -    4   pixel delta  (wheelDelta -120)
   *   OS X + Safari  (mouse)     -  N/A   pixel delta  (wheelDelta  -12)
   *   OS X + Firefox (mouse)     -    0.1 line  delta  (wheelDelta  N/A)
   *   Win8 + Chrome  (mouse)     -  100   pixel delta  (wheelDelta -120)
   *   Win8 + Firefox (mouse)     -    3   line  delta  (wheelDelta -120)
   *
   * On the trackpad:
   *
   *   OS X + Chrome  (trackpad)  -    2   pixel delta  (wheelDelta   -6)
   *   OS X + Firefox (trackpad)  -    1   pixel delta  (wheelDelta  N/A)
   *
   * On other/older browsers.. it's more complicated as there can be multiple and
   * also missing delta values.
   *
   * The 'wheel' event is more standard:
   *
   * http://www.w3.org/TR/DOM-Level-3-Events/#events-wheelevents
   *
   * The basics is that it includes a unit, deltaMode (pixels, lines, pages), and
   * deltaX, deltaY and deltaZ.  Some browsers provide other values to maintain
   * backward compatibility with older events.  Those other values help us
   * better normalize spin speed.  Example of what the browsers provide:
   *
   *                          | event.wheelDelta | event.detail
   *        ------------------+------------------+--------------
   *          Safari v5/OS X  |       -120       |       0
   *          Safari v5/Win7  |       -120       |       0
   *         Chrome v17/OS X  |       -120       |       0
   *         Chrome v17/Win7  |       -120       |       0
   *                IE9/Win7  |       -120       |   undefined
   *         Firefox v4/OS X  |     undefined    |       1
   *         Firefox v4/Win7  |     undefined    |       3
   */
  const normalizeWheel = event => {
    let spinX = 0,
      spinY = 0,
      pixelX = event.deltaX,
      pixelY = event.deltaY;
    const LINE = settings.deltaLineHeight;

    // Legacy
    if (event.detail !== undefined) {
      spinY = event.detail;
    }
    if (event.wheelDelta !== undefined) {
      spinY = -event.wheelDelta / 120;
    }
    if (event.wheelDeltaY !== undefined) {
      spinY = -event.wheelDeltaY / 120;
    }
    if (event.wheelDeltaX !== undefined) {
      spinX = -event.wheelDeltaX / 120;
    }
    if ((pixelX || pixelY) && event.deltaMode) {
      if (event.deltaMode === 1) {
        // delta in LINE units
        pixelX *= LINE;
        pixelY *= LINE;
      } else {
        // delta in PAGE units
        pixelX *= settings.deltaPageWidth;
        pixelY *= settings.deltaPageHeight;
      }
    }

    // Fall-back if spin cannot be determined
    if (pixelX && !spinX) {
      spinX = pixelX < 1 ? -1 : 1;
    }
    if (pixelY && !spinY) {
      spinY = pixelY < 1 ? -1 : 1;
    }
    return {
      spinX,
      spinY,
      pixelX,
      pixelY
    };
  };

  // --------------------

  /**
   * @module Utils
   */


  /**
   * Returns a {@link GestureFragment} for the given events. Only "wheel" events
   * will be considered.
   *
   * If there are no "wheel" events in the given list of events, returns `false`.
   *
   * The deltas of all events are summed together before determining final delta
   * and direction.
   *
   * If the events are of conflicting types, i.e. some scroll, some zoom, then
   * the intent will be "unknown" and the direction will be "ambiguous".
   *
   * If the deltas sum up to 0, the direction will be "none".
   *
   * **IMPORTANT NOTES ON THE DELTA VALUES**
   *
   * For wheel gestures the deltas are _highly_ unreliable, especially when
   * zooming (Control + wheel or pinching trackpad). You should not assume they
   * correspond to the would-be scroll or zoom amount that the browser would do.
   * But they can be used to determine relative amounts for animating, etc.
   *
   * If the browser reports the delta values of a WheelEvent to be in mode "line",
   * then a configurable fixed value is used
   * ({@link Settings.settings.deltaLineHeight | settings.deltaLineHeight}).
   *
   * If the browser reports the delta values of a WheelEvent to be in mode "page",
   * then a configurable fixed value is used
   * ({@link Settings.settings.deltaPageWidth | settings.deltaPageWidth} and
   * ({@link Settings.settings.deltaPageHeight | settings.deltaPageHeight}).
   *
   * For zoom intents `deltaZ` is based on what the browser reports as the
   * `deltaY`, which in most browsers roughly corresponds to a percentage zoom
   * factor.
   *
   * @param [options.angleDiffThreshold] See {@link getVectorDirection}.
   *                                     Default is 5.
   *
   * @returns `false` if there are no "wheel" events in the list, otherwise a
   * {@link GestureFragment}.
   *
   * @category Gestures
   */
  const getWheelGestureFragment = (events, options) => {
    if (!isIterableObject(events)) {
      events = [events];
    }
    let direction = S_NONE;
    let intent = null;
    let deltaX = 0,
      deltaY = 0,
      deltaZ = 1;
    for (const event of events) {
      if (!isWheelEvent(event) || event.type !== S_WHEEL) {
        continue;
      }
      const data = normalizeWheel(event);
      let thisIntent = S_SCROLL;
      let thisDeltaX = data.pixelX;
      let thisDeltaY = data.pixelY;
      let thisDeltaZ = 1;
      const maxDelta = havingMaxAbs(thisDeltaX, thisDeltaY);
      if (event.ctrlKey && !thisDeltaX) {
        // Browsers report negative deltaY for zoom in, so swap sign
        let percentage = -maxDelta;
        // If it's more than 50, assume it's a mouse wheel => delta is roughly
        // multiple of 10%. Otherwise a trackpad => delta is roughly multiple of 1%
        if (abs(percentage) >= 50) {
          percentage /= 10;
        }
        thisDeltaZ = 1 + percentage / 100;
        thisDeltaX = thisDeltaY = 0;
        thisIntent = S_ZOOM;
      } else if (event.shiftKey && !thisDeltaX) {
        // Holding Shift while turning wheel or swiping trackpad in vertically
        // results in sideways scroll.
        thisDeltaX = thisDeltaY;
        thisDeltaY = 0;
      }
      deltaX += thisDeltaX;
      deltaY += thisDeltaY;
      deltaZ = addDeltaZ(deltaZ, thisDeltaZ);
      if (!thisIntent) ; else if (!intent) {
        intent = thisIntent;
      } else if (intent !== thisIntent) {
        // mixture of zoom and scroll
        intent = S_UNKNOWN;
      }
    }
    if (!intent) {
      return false; // no relevant events
    } else if (intent === S_UNKNOWN) {
      direction = S_AMBIGUOUS;
    } else if (intent === S_ZOOM) {
      direction = deltaZ > 1 ? S_IN : deltaZ < 1 ? S_OUT : S_NONE;
    } else {
      direction = getVectorDirection([deltaX, deltaY], options === null || options === void 0 ? void 0 : options.angleDiffThreshold);
    }
    return direction === S_NONE ? false : {
      device: S_WHEEL,
      direction,
      intent,
      deltaX,
      deltaY,
      deltaZ
    };
  };

  /**
   * @module Watchers/GestureWatcher
   */


  /**
   * {@link GestureWatcher} listens for user gestures resulting from wheel,
   * pointer, touch or key input events.
   *
   * It supports scroll, zoom or drag type gestures.
   *
   * It manages registered callbacks globally and reuses event listeners for more
   * efficient performance.
   */
  class GestureWatcher {
    /**
     * Call the given handler whenever the user performs a gesture on the target
     * matching the given options.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same event target, even if the options differ. If the handler has already
     * been added for this target, either using {@link onGesture} or
     * {@link trackGesture}, then it will be removed and re-added with the
     * current options.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the options are invalid.
     */

    /**
     * Removes a previously added handler.
     */

    /**
     * This is the same as {@link onGesture} except that if `handler` is not
     * given, then it defaults to an internal handler that updates a set of CSS
     * variables on the target's style:
     *
     *   - `--lisn-js--<Intent>-delta-x`
     *   - `--lisn-js--<Intent>-delta-y`
     *   - `--lisn-js--<Intent>-delta-z`
     *
     * where and `<Intent>` is one of {@link GestureIntent} and the delta X, Y
     * and Z are the _total summed up_ `deltaX`, `deltaY` and `deltaZ` since the
     * callback was added, summed over all devices used (key, touch, etc).
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same target, even if the options differ. If the handler has already been
     * added for this target, either using {@link trackGesture} or using
     * {@link onGesture}, then it will be removed and re-added with the current
     * options.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the options are invalid.
     */

    /**
     * Removes a previously added handler for {@link trackGesture}.
     */

    /**
     * Creates a new instance of GestureWatcher with the given
     * {@link GestureWatcherConfig}. It does not save it for future reuse.
     */
    static create(config) {
      return new GestureWatcher(getConfig$5(config), CONSTRUCTOR_KEY$5);
    }

    /**
     * Returns an existing instance of GestureWatcher with the given
     * {@link GestureWatcherConfig}, or creates a new one.
     *
     * **NOTE:** It saves it for future reuse, so don't use this for temporary
     * short-lived watchers.
     */
    static reuse(config) {
      const myConfig = getConfig$5(config);
      const configStrKey = objToStrKey(myConfig);
      let instance = instances$7.get(configStrKey);
      if (!instance) {
        instance = new GestureWatcher(myConfig, CONSTRUCTOR_KEY$5);
        instances$7.set(configStrKey, instance);
      }
      return instance;
    }
    constructor(config, key) {
      if (key !== CONSTRUCTOR_KEY$5) {
        throw illegalConstructorError("GestureWatcher.create");
      }
      const logger = result ? new result.Logger({
        name: "GestureWatcher",
        logAtCreation: config
      }) : null;
      const allCallbacks = newXWeakMap(() => newMap());

      // For each target and event type, add only 1 global listener that will then
      // manage the event queues and callbacks.
      const allListeners = newXWeakMap(() => newMap());

      // ----------

      const createCallback = (target, handler, options) => {
        var _allCallbacks$get;
        remove((_allCallbacks$get = allCallbacks.get(target)) === null || _allCallbacks$get === void 0 || (_allCallbacks$get = _allCallbacks$get.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
        logger === null || logger === void 0 || logger.debug5("Adding/updating handler for", options);
        const {
          _callback,
          _wrapper
        } = getCallbackAndWrapper(handler, options, logger);
        _callback.onRemove(() => deleteHandler(target, handler, options));
        allCallbacks.sGet(target).set(handler, {
          _callback,
          _wrapper,
          _options: options
        });
        return _callback;
      };

      // ----------

      // async for consistency with other watchers and future compatibility in
      // case of change needed
      const setupOnGesture = async (target, handler, userOptions) => {
        const options = getOptions$2(config, userOptions !== null && userOptions !== void 0 ? userOptions : {});
        createCallback(target, handler, options);
        for (const device of (_options$_devices = options._devices) !== null && _options$_devices !== void 0 ? _options$_devices : DEVICES) {
          var _options$_devices, _allListeners$get;
          let listeners = (_allListeners$get = allListeners.get(target)) === null || _allListeners$get === void 0 ? void 0 : _allListeners$get.get(device);
          if (listeners) {
            logger === null || logger === void 0 || logger.debug4(`Listeners already added for ${device}`, target, options);
          } else {
            logger === null || logger === void 0 || logger.debug4(`Adding listeners for ${device}`, target, options);
            listeners = setupListeners(target, device, options);
            allListeners.sGet(target).set(device, listeners);
          }
          listeners._nCallbacks++;
          if (options._preventDefault) {
            listeners._nPreventDefault++;
          }
        }
      };

      // ----------

      const deleteHandler = (target, handler, options) => {
        deleteKey(allCallbacks.get(target), handler);
        allCallbacks.prune(target);
        for (const device of (_options$_devices2 = options._devices) !== null && _options$_devices2 !== void 0 ? _options$_devices2 : DEVICES) {
          var _options$_devices2, _allListeners$get2;
          const listeners = (_allListeners$get2 = allListeners.get(target)) === null || _allListeners$get2 === void 0 ? void 0 : _allListeners$get2.get(device);
          if (listeners) {
            listeners._nCallbacks--;
            if (options._preventDefault) {
              listeners._nPreventDefault--;
            }
            if (!listeners._nCallbacks) {
              logger === null || logger === void 0 || logger.debug4(`No more callbacks for target and device ${device}; removing listeners`, target);
              deleteKey(allListeners.get(target), device);
              listeners._remove();
            }
          }
        }
      };

      // ----------

      const invokeCallbacks = (target, device, event) => {
        var _allListeners$get$get, _allListeners$get3;
        const preventDefault = ((_allListeners$get$get = (_allListeners$get3 = allListeners.get(target)) === null || _allListeners$get3 === void 0 || (_allListeners$get3 = _allListeners$get3.get(device)) === null || _allListeners$get3 === void 0 ? void 0 : _allListeners$get3._nPreventDefault) !== null && _allListeners$get$get !== void 0 ? _allListeners$get$get : 0) > 0;
        let isTerminated = false;
        for (const {
          _wrapper
        } of ((_allCallbacks$get2 = allCallbacks.get(target)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2.values()) || []) {
          var _allCallbacks$get2;
          isTerminated = _wrapper(target, device, event, preventDefault) || isTerminated;
        }
        return isTerminated;
      };

      // ----------

      const setupListeners = (target, device, options) => {
        const intents = options._intents;
        let hasAddedTabIndex = false;
        let hasPreventedSelect = false;
        if (device === S_KEY && isElement(target) && !getTabIndex(target)) {
          hasAddedTabIndex = true;
          // enable element to receive keydown events
          setTabIndex(target);
        } else if (isElement(target) && device === S_TOUCH) {
          if (options._preventDefault) {
            addClasses(target, PREFIX_NO_TOUCH_ACTION);
          }
          if (!intents || includes(intents, S_DRAG)) {
            hasPreventedSelect = true;
            preventSelect(target);
          }
        }
        const addOrRemoveListeners = (action, listener, eventTypes) => {
          const method = action === "add" ? addEventListenerTo : removeEventListenerFrom;
          for (const eventType of eventTypes) {
            logger === null || logger === void 0 || logger.debug8(`${action} listener for ${eventType}`, target);
            method(target, eventType, listener, {
              passive: false,
              capture: true
            });
          }
        };
        const addInitialListener = () => addOrRemoveListeners("add", initialListener, initiatingEvents[device]);
        const removeInitialListener = () => addOrRemoveListeners("remove", initialListener, initiatingEvents[device]);
        const addOngoingListener = () => addOrRemoveListeners("add", processEvent, ongoingEvents[device]);
        const removeOngoingListener = () => addOrRemoveListeners("remove", processEvent, ongoingEvents[device]);
        const initialListener = event => {
          processEvent(event);
          removeInitialListener();
          addOngoingListener();
        };
        const processEvent = event => {
          const isTerminated = invokeCallbacks(target, device, event);
          if (isTerminated) {
            removeOngoingListener();
            addInitialListener();
          }
        };
        addInitialListener();
        return {
          _nCallbacks: 0,
          _nPreventDefault: 0,
          _remove: () => {
            if (isElement(target)) {
              if (hasAddedTabIndex) {
                unsetTabIndex(target);
              }
              removeClasses(target, PREFIX_NO_TOUCH_ACTION);
              if (hasPreventedSelect) {
                undoPreventSelect(target);
              }
            }
            removeOngoingListener();
            removeInitialListener();
          }
        };
      };

      // ----------

      this.trackGesture = (element, handler, options) => {
        if (!handler) {
          handler = setGestureCssProps;
          // initial values
          for (const intent of INTENTS) {
            setGestureCssProps(element, {
              intent,
              totalDeltaX: 0,
              totalDeltaY: 0,
              totalDeltaZ: 1
            });
          }
        }
        return setupOnGesture(element, handler, options);
      };

      // ----------

      this.noTrackGesture = (element, handler) => {
        if (!handler) {
          handler = setGestureCssProps;

          // delete the properties
          for (const intent of INTENTS) {
            setGestureCssProps(element, {
              intent
            });
          }
        }
        this.offGesture(element, handler);
      };

      // ----------

      this.onGesture = setupOnGesture;

      // ----------

      this.offGesture = (target, handler) => {
        var _allCallbacks$get3;
        logger === null || logger === void 0 || logger.debug5("Removing handler");
        remove((_allCallbacks$get3 = allCallbacks.get(target)) === null || _allCallbacks$get3 === void 0 || (_allCallbacks$get3 = _allCallbacks$get3.get(handler)) === null || _allCallbacks$get3 === void 0 ? void 0 : _allCallbacks$get3._callback);
      };
    }
  }

  /**
   * @interface
   */

  /**
   * @interface
   */

  /**
   * The handler is invoked with two arguments:
   *
   * - the event target that was passed to the {@link GestureWatcher.onGesture}
   *   call (equivalent to
   *   {@link https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget | Event:currentTarget}).
   * - the {@link GestureData} that describes the gesture's progression since the
   *   last time the callback was called and since the callback was added.
   */

  // ----------------------------------------

  // Specific to a combination of target + device

  const CONSTRUCTOR_KEY$5 = SYMBOL();
  const instances$7 = newMap();
  const getConfig$5 = config => {
    var _config$preventDefaul, _config$naturalTouchS, _config$touchDragHold, _config$touchDragNumF;
    config !== null && config !== void 0 ? config : config = {};
    return {
      _preventDefault: (_config$preventDefaul = config.preventDefault) !== null && _config$preventDefaul !== void 0 ? _config$preventDefaul : true,
      _debounceWindow: toNonNegNum(config[S_DEBOUNCE_WINDOW], 150),
      _deltaThreshold: toNonNegNum(config.deltaThreshold, 5),
      _angleDiffThreshold: toPosNum(config.angleDiffThreshold, 35),
      _naturalTouchScroll: (_config$naturalTouchS = config.naturalTouchScroll) !== null && _config$naturalTouchS !== void 0 ? _config$naturalTouchS : true,
      _touchDragHoldTime: (_config$touchDragHold = config.touchDragHoldTime) !== null && _config$touchDragHold !== void 0 ? _config$touchDragHold : 500,
      _touchDragNumFingers: (_config$touchDragNumF = config.touchDragNumFingers) !== null && _config$touchDragNumF !== void 0 ? _config$touchDragNumF : 1
    };
  };
  const initiatingEvents = {
    key: [S_KEYDOWN],
    // If the browser doesn't support pointer events, then
    // addEventListenerTo will transform it into mousedown
    //
    // We need to listen for click, since that occurs after a pointerup (i.e.
    // after a gesure is terminated and the ongoing listeners removed), but it
    // needs to have its default action prevented.
    pointer: [S_POINTERDOWN, S_CLICK],
    touch: [S_TOUCHSTART],
    wheel: [S_WHEEL]
  };
  const ongoingEvents = {
    key: [S_KEYDOWN],
    pointer: [
    // If the browser doesn't support point events, then
    // addEventListenerTo will transform them into mouse*
    S_POINTERDOWN, S_POINTERUP,
    // would terminate
    S_POINTERMOVE, S_POINTERCANCEL,
    // would terminate
    S_CLICK // would terminate; can be default-prevented
    ],
    touch: [S_TOUCHSTART, S_TOUCHEND, S_TOUCHMOVE, S_TOUCHCANCEL],
    wheel: [S_WHEEL]
  };
  const fragmentGetters = {
    [S_KEY]: getKeyGestureFragment,
    [S_POINTER]: getPointerGestureFragment,
    [S_TOUCH]: getTouchGestureFragment,
    [S_WHEEL]: getWheelGestureFragment
  };
  const getOptions$2 = (config, options) => {
    var _validateStrList, _validateStrList2, _validateStrList3, _options$minTotalDelt, _options$maxTotalDelt, _options$minTotalDelt2, _options$maxTotalDelt2, _options$minTotalDelt3, _options$maxTotalDelt3, _options$preventDefau, _options$naturalTouch, _options$touchDragHol, _options$touchDragNum;
    const debounceWindow = toNonNegNum(options[S_DEBOUNCE_WINDOW], config._debounceWindow // watcher is never debounced, so apply default here
    );
    const deltaThreshold = toNonNegNum(options.deltaThreshold, config._deltaThreshold);
    return {
      _devices: (_validateStrList = validateStrList("devices", options.devices, isValidInputDevice)) !== null && _validateStrList !== void 0 ? _validateStrList : null,
      _directions: (_validateStrList2 = validateStrList("directions", options.directions, isValidDirection)) !== null && _validateStrList2 !== void 0 ? _validateStrList2 : null,
      _intents: (_validateStrList3 = validateStrList("intents", options.intents, isValidIntent)) !== null && _validateStrList3 !== void 0 ? _validateStrList3 : null,
      _minTotalDeltaX: (_options$minTotalDelt = options.minTotalDeltaX) !== null && _options$minTotalDelt !== void 0 ? _options$minTotalDelt : null,
      _maxTotalDeltaX: (_options$maxTotalDelt = options.maxTotalDeltaX) !== null && _options$maxTotalDelt !== void 0 ? _options$maxTotalDelt : null,
      _minTotalDeltaY: (_options$minTotalDelt2 = options.minTotalDeltaY) !== null && _options$minTotalDelt2 !== void 0 ? _options$minTotalDelt2 : null,
      _maxTotalDeltaY: (_options$maxTotalDelt2 = options.maxTotalDeltaY) !== null && _options$maxTotalDelt2 !== void 0 ? _options$maxTotalDelt2 : null,
      _minTotalDeltaZ: (_options$minTotalDelt3 = options.minTotalDeltaZ) !== null && _options$minTotalDelt3 !== void 0 ? _options$minTotalDelt3 : null,
      _maxTotalDeltaZ: (_options$maxTotalDelt3 = options.maxTotalDeltaZ) !== null && _options$maxTotalDelt3 !== void 0 ? _options$maxTotalDelt3 : null,
      _preventDefault: (_options$preventDefau = options.preventDefault) !== null && _options$preventDefau !== void 0 ? _options$preventDefau : config._preventDefault,
      _debounceWindow: debounceWindow,
      _deltaThreshold: deltaThreshold,
      _angleDiffThreshold: toNonNegNum(options.angleDiffThreshold, config._angleDiffThreshold),
      _naturalTouchScroll: (_options$naturalTouch = options.naturalTouchScroll) !== null && _options$naturalTouch !== void 0 ? _options$naturalTouch : config._naturalTouchScroll,
      _touchDragHoldTime: (_options$touchDragHol = options.touchDragHoldTime) !== null && _options$touchDragHol !== void 0 ? _options$touchDragHol : config._touchDragHoldTime,
      _touchDragNumFingers: (_options$touchDragNum = options.touchDragNumFingers) !== null && _options$touchDragNum !== void 0 ? _options$touchDragNum : config._touchDragNumFingers
    };
  };

  // Since each callback needs to accumulate events during its debounce window
  // and until its threshold is exceeded, we use a wrapper around the
  // user-supplied handler to do that.
  const getCallbackAndWrapper = (handler, options, logger) => {
    let totalDeltaX = 0,
      totalDeltaY = 0,
      totalDeltaZ = 1;
    // When there's a pointer down, drag then pointerup, since we prevent
    // pointerdown default action, this results in a click event shortly
    // afterwards even when there's been a movement of the mouse. We detect that
    // and prevent this click.
    let preventNextClick = false;
    const directions = options._directions;
    const intents = options._intents;
    const minTotalDeltaX = options._minTotalDeltaX;
    const maxTotalDeltaX = options._maxTotalDeltaX;
    const minTotalDeltaY = options._minTotalDeltaY;
    const maxTotalDeltaY = options._maxTotalDeltaY;
    const minTotalDeltaZ = options._minTotalDeltaZ;
    const maxTotalDeltaZ = options._maxTotalDeltaZ;
    const deltaThreshold = options._deltaThreshold;
    const angleDiffThreshold = options._angleDiffThreshold;
    const reverseScroll = !options._naturalTouchScroll;
    const dragHoldTime = options._touchDragHoldTime;
    const dragNumFingers = options._touchDragNumFingers;

    // The event queue is cleared when the threshold is exceeded AND the debounce
    // window has passed. It's not necessary for the actual handler to be called
    // then (e.g. if the direction or intent doesn't match, it won't be).
    const eventQueue = [];
    const id = randId();

    // Since handler could be a function or a callback (not callable), we wrap it
    // so that in case it's already a callback, its removal will result in
    // deleteHandler getting called. It is not debounced itself, instead there's
    // a debounced wrapper that invokes it.
    const callback = wrapCallback(handler);

    // The debounced callback wrapper is what is debounced.
    // It accumulates total deltas and checks if the conditions (of threshold,
    // direction and intent) are satisfied before calling the real handler.
    //
    // Most importantly, since it is only called when the debounce window has
    // expired it can clear the event queue if the threshold is also exceeded.
    const debouncedWrapper = getDebouncedHandler(options._debounceWindow, (target, fragment, eventQueueCopy) => {
      var _eventQueueCopy, _eventQueueCopy$;
      if (callback.isRemoved()) {
        return;
      }
      const deltaX = fragment.deltaX;
      const deltaY = fragment.deltaY;
      const deltaZ = fragment.deltaZ;
      const device = fragment.device;
      if (round(maxAbs(deltaX, deltaY, (1 - deltaZ) * 100)) < deltaThreshold) {
        logger === null || logger === void 0 || logger.debug7(`[${id}] Delta threshold not exceeded for callback`);
        return;
      }
      logger === null || logger === void 0 || logger.debug9(`[${id}] Done summing events for ${device}`);
      clearEventQueue(device, eventQueue);
      const newTotalDeltaX = toNumWithBounds(totalDeltaX + deltaX, {
        min: minTotalDeltaX,
        max: maxTotalDeltaX
      });
      const newTotalDeltaY = toNumWithBounds(totalDeltaY + deltaY, {
        min: minTotalDeltaY,
        max: maxTotalDeltaY
      });
      const newTotalDeltaZ = toNumWithBounds(addDeltaZ(totalDeltaZ, deltaZ), {
        min: minTotalDeltaZ,
        max: maxTotalDeltaZ
      });
      if (newTotalDeltaX === totalDeltaX && newTotalDeltaY === totalDeltaY && newTotalDeltaZ === totalDeltaZ) {
        return;
      }
      totalDeltaX = newTotalDeltaX;
      totalDeltaY = newTotalDeltaY;
      totalDeltaZ = newTotalDeltaZ;
      const direction = fragment.direction;
      const intent = fragment.intent;
      const time = ((_eventQueueCopy = eventQueueCopy[lengthOf(eventQueueCopy) - 1]) === null || _eventQueueCopy === void 0 ? void 0 : _eventQueueCopy.timeStamp) - ((_eventQueueCopy$ = eventQueueCopy[0]) === null || _eventQueueCopy$ === void 0 ? void 0 : _eventQueueCopy$.timeStamp) || 0;
      const data = {
        device,
        direction,
        intent,
        deltaX,
        deltaY,
        deltaZ,
        time,
        totalDeltaX,
        totalDeltaY,
        totalDeltaZ
      };
      if (direction !== S_NONE && (!directions || includes(directions, direction)) && (!intents || includes(intents, intent))) {
        callback.invoke(target, data, eventQueueCopy).catch(logError);
      } else {
        logger === null || logger === void 0 || logger.debug7(`[${id}] Directions or intents not matching for callback`);
      }
    });

    // This wrapper is NOT debounced and adds the events to the queue, prevents
    // default action if needed, and indicates whether the gesture is terminated.
    const wrapper = (target, device, event, preventDefault) => {
      eventQueue.push(event);
      const fragment = fragmentGetters[device](eventQueue, {
        angleDiffThreshold,
        deltaThreshold,
        reverseScroll,
        dragHoldTime,
        dragNumFingers
      });
      logger === null || logger === void 0 || logger.debug8(`[${id}] Got fragment for ${device} (${event.type})`, fragment, [...eventQueue].map(e => e.type));
      if (preventDefault) {
        preventDefaultActionFor(event, !!fragment || event.type === S_CLICK && preventNextClick);
      }
      if (fragment === false) {
        // not enough events in the queue, pass
        logger === null || logger === void 0 || logger.debug9(`[${id}] Not enough events for gesture ${device}`);
        return false;
      } else if (fragment === null) {
        // consider the gesture terminated
        clearEventQueue(device, eventQueue);
        logger === null || logger === void 0 || logger.debug9(`[${id}] Gesture for ${device} terminated`);
        return true;
      }
      if (device === S_POINTER) {
        // If we're here, there's been a drag, expect a click immediately
        // afterwards and prevent default action.
        preventNextClick = true;
        setTimer(() => {
          preventNextClick = false;
        }, 10);
      }
      debouncedWrapper(target, fragment, [...eventQueue] // copy
      );
      return false;
    };
    return {
      _callback: callback,
      _wrapper: wrapper
    };
  };
  const clearEventQueue = (device, queue) => {
    const keepLastEvent = device === S_POINTER || device === S_TOUCH;
    queue.splice(0, lengthOf(queue) - (keepLastEvent ? 1 : 0));
  };
  const preventDefaultActionFor = (event, isActualGesture) => {
    const target = event.currentTarget;
    const eventType = event.type;
    const isPointerDown = eventType === S_POINTERDOWN || eventType === S_MOUSEDOWN;
    if (eventType === S_TOUCHMOVE || eventType === S_WHEEL || (eventType === S_CLICK || eventType === S_KEYDOWN) && isActualGesture || isPointerDown && event.buttons === 1) {
      preventDefault(event);
      if (isPointerDown && isHTMLElement(target)) {
        // Otherwise capturing key events won't work
        target.focus({
          preventScroll: true
        });
      }
    }
  };
  const setGestureCssProps = (target, data) => {
    const intent = data.intent;
    if (!isElement(target) || !intent || intent === S_UNKNOWN) {
      return;
    }
    const prefix = `${intent}-`;
    if (intent === S_ZOOM) {
      setNumericStyleJsVars(target, {
        deltaZ: data.totalDeltaZ
      }, {
        _prefix: prefix,
        _numDecimal: 2
      }); // don't await here
    } else {
      setNumericStyleJsVars(target, {
        deltaX: data.totalDeltaX,
        deltaY: data.totalDeltaY
      }, {
        _prefix: prefix
      }); // don't await here
    }
  };

  /**
   * @module Utils
   */


  /**
   * Returns true if the given string is a valid device name.
   *
   * @category Validation
   */
  const isValidDevice = device => ORDERED_DEVICES.has(device);

  /**
   * Returns true if the given string is a valid aspect ratio name.
   *
   * @category Validation
   */
  const isValidAspectRatio = aspectRatio => ORDERED_ASPECTR.has(aspectRatio);

  /**
   * Returns true if the given string is a valid device specification (including
   * `"min <Device>"`, etc).
   *
   * Returns false for "", although if you passed "" in
   * {@link Watchers/LayoutWatcher.OnLayoutOptions | OnLayoutOptions} it would
   * accept it as specifying _all_ devices.
   *
   * @category Validation
   */
  const isValidDeviceList = device => isValidForType(S_DEVICES, device, ORDERED_DEVICES);

  /**
   * Returns true if the given string is a valid aspect ratio specification
   * (including `"min <AspectRatio>"`, etc).
   *
   * Returns false for "", although if you passed "" in
   * {@link Watchers/LayoutWatcher.OnLayoutOptions | OnLayoutOptions} it would
   * accept it as specifying _all_ aspect ratios.
   *
   * @category Validation
   */
  const isValidAspectRatioList = aspectR => isValidForType(S_ASPECTRS_CAMEL, aspectR, ORDERED_ASPECTR);

  /**
   * Returns a list of {@link Device}s that are not covered by the given device
   * specification. See
   * {@link Watchers/LayoutWatcher.OnLayoutOptions | OnLayoutOptions} for accepted
   * formats.
   *
   * Returns an empty for "" or for a specification that includes all devices.
   *
   * @category Layout
   */
  const getOtherDevices = device => getOtherLayouts(S_DEVICES, device, ORDERED_DEVICES);

  /**
   * Returns a list of {@link AspectRatio}s that are not covered by the given
   * aspect ratio specification. See
   * {@link Watchers/LayoutWatcher.OnLayoutOptions | OnLayoutOptions} for accepted
   * formats.
   *
   * Returns an empty for "" or for a specification that includes all aspect
   * ratios.
   *
   * @category Layout
   */
  const getOtherAspectRatios = aspectR => getOtherLayouts(S_ASPECTRS_CAMEL, aspectR, ORDERED_ASPECTR);

  /**
   * @ignore
   * @internal
   */
  const getLayoutBitmask = options => {
    let layoutBitmask = getBitmaskFromSpec(S_DEVICES, options === null || options === void 0 ? void 0 : options.devices, ORDERED_DEVICES) | getBitmaskFromSpec(S_ASPECTRS_CAMEL, options === null || options === void 0 ? void 0 : options.aspectRatios, ORDERED_ASPECTR);
    if (!layoutBitmask) {
      layoutBitmask = ORDERED_DEVICES.bitmask | ORDERED_ASPECTR.bitmask; // default: all
    }
    return layoutBitmask;
  };

  // In ascending order by width.
  const ORDERED_DEVICE_NAMES = sortedKeysByVal(settings.deviceBreakpoints);
  const ORDERED_ASPECTR_NAMES = sortedKeysByVal(settings.aspectRatioBreakpoints);
  const bitSpaces = newBitSpaces();

  /**
   * @ignore
   * @internal
   */
  const ORDERED_DEVICES = createBitSpace(bitSpaces, ...ORDERED_DEVICE_NAMES);

  /**
   * @ignore
   * @internal
   */
  const ORDERED_ASPECTR = createBitSpace(bitSpaces, ...ORDERED_ASPECTR_NAMES);

  /**
   * @ignore
   * @internal
   */
  const NUM_LAYOUTS = lengthOf(ORDERED_DEVICE_NAMES) + lengthOf(ORDERED_ASPECTR_NAMES);

  // --------------------

  const S_DEVICES = "devices";
  const S_ASPECTRS_CAMEL = "aspectRatios";

  // Don't use capture groups for old browser support
  const LAYOUT_RANGE_REGEX = RegExp("^ *(?:" + "([a-z-]+) +to +([a-z-]+)|" + "min +([a-z-]+)|" + "max +([a-z-]+)" + ") *$");
  const getLayoutsFromBitmask = (keyName, bitmask, bitSpace) => {
    const layouts = [];
    for (let bit = bitSpace.start; bit <= bitSpace.end; bit++) {
      const value = 1 << bit;
      if (bitmask & value) {
        const name = bitSpace.nameOf(value);
        if (name) {
          layouts.push(name);
        }
      }
    }
    return layouts;
  };
  const getOtherLayouts = (keyName, spec, bitSpace) => {
    const bitmask = getBitmaskFromSpec(keyName, spec, bitSpace);
    if (!bitmask) {
      return [];
    }
    const oppositeBitmask = bitSpace.bitmask & ~bitmask;
    return getLayoutsFromBitmask(keyName, oppositeBitmask, bitSpace);
  };
  const isValidForType = (keyName, spec, bitSpace) => {
    try {
      const bitmask = getBitmaskFromSpec(keyName, spec, bitSpace);
      return bitmask !== 0;
    } catch (err) {
      if (isInstanceOf(err, LisnUsageError)) {
        return false;
      }
      throw err;
    }
  };
  const getBitmaskFromSpec = (keyName, spec, bitSpace) => {
    if (isEmpty(spec)) {
      return 0;
    }
    const singleKeyName = keyName.slice(0, -1);
    if (isString(spec)) {
      const rangeMatch = spec.match(LAYOUT_RANGE_REGEX);
      if (rangeMatch) {
        const minLayout = rangeMatch[1] || rangeMatch[3];
        const maxLayout = rangeMatch[2] || rangeMatch[4];
        if (minLayout !== undefined && !bitSpace.has(minLayout)) {
          throw usageError(`Unknown ${singleKeyName} '${minLayout}'`);
        }
        if (maxLayout !== undefined && !bitSpace.has(maxLayout)) {
          throw usageError(`Unknown ${singleKeyName} '${maxLayout}'`);
        }
        return bitSpace.bitmaskFor(minLayout, maxLayout);
      }
    }
    let bitmask = 0;
    const layouts = validateStrList(keyName, spec, bitSpace.has);
    if (layouts) {
      for (const lt of layouts) {
        bitmask |= bitSpace.bit[lt];
      }
    }
    return bitmask;
  };

  /**
   * @since v1.2.0
   *
   * @category Animations
   */

  /**
   * The callback is as an argument the {@link ElapsedTimes | elapsed times}:
   * - The total elapsed time in milliseconds since the start
   * - The elapsed time in milliseconds since the previous frame
   *
   * The first time this callback is called both of these will be 0 unless seed
   * values were provided.
   *
   * The callback must return `true` if it wants to animate again on the next
   * frame and `false` if done.
   *
   * @since v1.2.0
   *
   * @category Animations
   */

  /**
   * Returns a promise that resolves at the next animation frame. Async/await
   * version of
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame | requestAnimationFrame}.
   *
   * @returns The timestamp gotten from `requestAnimationFrame`
   *
   * @category Animations
   */
  const waitForAnimationFrame = async () => newPromise(resolve => {
    onAnimationFrame(resolve);
  });

  /**
   * Calls the given callback on every animation frame.
   *
   * The returned Promise resolves when the callback is done (returns `false`).
   *
   * @param callback  See {@link AnimationCallback}.
   * @param elapsed   Seed values to use as the total elapsed and elapsed since
   *                  last. Otherwise it will use the timestamp of the first frame
   *                  as the start, which will result in those values being 0 the
   *                  first time.
   *
   * @since v1.2.0
   *
   * @category Animations
   */
  const onEveryAnimationFrame = async (callback, elapsed) => {
    var _iteratorAbruptCompletion = false;
    var _didIteratorError = false;
    var _iteratorError;
    try {
      for (var _iterator = _asyncIterator(newAnimationFrameIterator(elapsed)), _step; _iteratorAbruptCompletion = !(_step = await _iterator.next()).done; _iteratorAbruptCompletion = false) {
        elapsed = _step.value;
        {
          const shouldRepeat = callback(elapsed);
          if (!shouldRepeat) {
            break;
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (_iteratorAbruptCompletion && _iterator.return != null) {
          await _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  };

  /**
   * Generator version of {@link onEveryAnimationFrame}.
   *
   * Returns a new async iterator which yields the total elapsed time and elapsed
   * time since the last call on every animation frame.
   *
   * @example
   * ```javascript
   * for await (const elapsed of newAnimationFrameIterator()) {
   *   // ... do something
   *   if (done) break;
   * }
   * ```
   *
   * @since v1.2.0
   *
   * @category Animations
   */
  function newAnimationFrameIterator(_x) {
    return _newAnimationFrameIterator.apply(this, arguments);
  }

  /**
   * Returns an animation iterator based on {@link criticallyDamped} that starts
   * at the given position `l`, with velocity `v = 0` and time `t = 0` and yields
   * the new position and velocity, and total time at every animation frame.
   *
   * @param [settings.lTarget]   The initial target position. Can be updated when
   *                             calling next().
   * @param [settings.lag]       See {@link criticallyDamped}.
   * @param [settings.l = 0]     The initial starting position.
   * @param [settings.precision] See {@link criticallyDamped}.
   *
   * @returns An iterator whose `next` method accepts an optional new `lTarget`.
   * The iterator yields an object containing successive values for:
   * - position (`l`)
   * - velocity (`v`)
   * - total time elapsed (`t`)
   *
   * @example
   * If you never need to update the target you can use a for await loop:
   *
   * ```javascript
   * const iterator = newCriticallyDampedAnimationIterator({
   *   l: 10,
   *   lTarget: 100,
   *   lag: 1500
   * });
   *
   * for await (const { l, v, t } of iterator) {
   *   console.log({ l, v, t });
   * }
   * ```
   *
   * @example
   * If you do need to update the target, then call `next` explicitly:
   *
   * ```javascript
   * const iterator = newCriticallyDampedAnimationIterator({
   *   l: 10,
   *   lTarget: 100,
   *   lag: 1500
   * });
   *
   * let { value: { l, v, t } } = await iterator.next();
   * ({ value: { l, v, t } } = await iterator.next()); // updated
   * ({ value: { l, v, t } } = await iterator.next(200)); // updated towards a new target
   * ```
   *
   * @since v1.2.0
   *
   * @category Animations
   */
  function _newAnimationFrameIterator() {
    _newAnimationFrameIterator = _wrapAsyncGenerator(function* (elapsed) {
      let startTime, previousTimeStamp;
      const {
        total: totalSeed = 0,
        sinceLast: sinceLastSeed = 0
      } = elapsed !== null && elapsed !== void 0 ? elapsed : {};
      const step = async () => {
        const timeStamp = await waitForAnimationFrame();
        if (!startTime || !previousTimeStamp) {
          // First time
          startTime = timeStamp - totalSeed;
          previousTimeStamp = timeStamp - sinceLastSeed;
        }
        const totalElapsed = timeStamp - startTime;
        const elapsedSinceLast = timeStamp - previousTimeStamp;
        previousTimeStamp = timeStamp;
        return {
          total: totalElapsed,
          sinceLast: elapsedSinceLast
        };
      };
      while (true) {
        yield step();
      }
    });
    return _newAnimationFrameIterator.apply(this, arguments);
  }
  function newCriticallyDampedAnimationIterator(_x2) {
    return _newCriticallyDampedAnimationIterator.apply(this, arguments);
  }

  /**
   * @param webAnimationCallback This function is called for each
   *                             {@link https://developer.mozilla.org/en-US/docs/Web/API/Animation | Animation}
   *                             on the element. It {@link waitForMeasureTime}
   *                             before reading the animations.
   * @param legacyCallback       This function is called if the browser does not
   *                             support the Web Animations API. It is called
   *                             after {@link waitForMutateTime} so it can safely
   *                             modify styles.
   * @param realtime             If true, then it does not
   *                             {@link waitForMeasureTime} or
   *                             {@link waitForMutateTime} and runs
   *                             synchronously.
   *
   * @category Animations
   */
  function _newCriticallyDampedAnimationIterator() {
    _newCriticallyDampedAnimationIterator = _wrapAsyncGenerator(function* (settings) {
      let {
        l,
        lTarget
      } = settings;
      const {
        lag,
        precision
      } = settings;
      let v = 0,
        t = 0,
        dt = 0;
      const next = async () => {
        ({
          l,
          v
        } = criticallyDamped({
          lTarget,
          dt,
          lag,
          l,
          v,
          precision
        }));
        return {
          l,
          v,
          t
        };
      };
      var _iteratorAbruptCompletion2 = false;
      var _didIteratorError2 = false;
      var _iteratorError2;
      try {
        for (var _iterator2 = _asyncIterator(newAnimationFrameIterator()), _step2; _iteratorAbruptCompletion2 = !(_step2 = yield _awaitAsyncGenerator(_iterator2.next())).done; _iteratorAbruptCompletion2 = false) {
          ({
            total: t,
            sinceLast: dt
          } = _step2.value);
          {
            var _next;
            if (dt === 0) {
              continue;
            }
            lTarget = yield (_next = next()) !== null && _next !== void 0 ? _next : lTarget;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (_iteratorAbruptCompletion2 && _iterator2.return != null) {
            yield _awaitAsyncGenerator(_iterator2.return());
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
      throw null; // tell TypeScript it will never end
    });
    return _newCriticallyDampedAnimationIterator.apply(this, arguments);
  }
  const iterateAnimations = async (element, webAnimationCallback, legacyCallback, realtime = false) => {
    /* istanbul ignore next */ // jsdom doesn't support Web Animations
    if ("getAnimations" in element && getData(element, prefixName("test-legacy")) === null) {
      if (!realtime) {
        await waitForMeasureTime();
      }
      for (const animation of element.getAnimations()) {
        webAnimationCallback(animation);
      }

      // Old browsers, no Animation API
    } else {
      if (!realtime) {
        await waitForMutateTime();
      }
      legacyCallback(element);
    }
  };

  /**
   * @ignore
   * @internal
   */
  const resetCssAnimationsNow = element => {
    addClassesNow(element, PREFIX_ANIMATE_DISABLE); // cause it to reset
    // If we remove the disable class immediately, then it will not have the
    // effect to reset the animation, since the browser won't see any change in
    // the classList at the start of the frame. So we ideally need to remove the
    // disable class after the next paint. However, depending on the animation,
    // and its state, disabling animation and waiting for the next animation
    // frame may cause a visible glitch, so we need to force layout now.
    /* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
    element[S_CLIENT_WIDTH]; // forces layout

    removeClassesNow(element, PREFIX_ANIMATE_DISABLE);
  };

  /**
   * @category Scrolling
   */

  /**
   * @category Scrolling
   * @interface
   */

  // ----------

  /**
   * Returns true if the given element is scrollable in the given direction, or
   * in either direction (if `axis` is not given).
   *
   * It first checks whether the current scroll offset on the target along the
   * given axis is non-0, and if so returns true immediately. Otherwise it will
   * attempt to determine if it's scrollable using one of these methods
   * (controlled by `options.active`):
   * - passive check (default): Will examine `clientWidth/Height`,
   *   `scrollWidth/Height` as well as the computed `overflow` CSS property to try
   *   to determine if the target is scrollable. This is not 100% reliable but is
   *   safer than the active check
   * - active check: Will attempt to scroll the target by 1px and examine if the
   *   scroll offset had changed, then revert it back to 0. This is a more
   *   reliable check, however it can cause issues in certain contexts. In
   *   particular, if a scroll on the target had just been initiated (but it's
   *   scroll offset was still 0), the scroll may be cancelled. Never use that
   *   inside scroll-based handlers.
   *
   * **NOTE:** If the layout has been invalidated and not yet recalculated, this
   * will cause a forced layout, so always {@link waitForMeasureTime} before
   * calling this function when possible.
   *
   * @param [options.axis]    One of "x" or "y" for horizontal or vertical scroll
   *                          respectively. If not given, it checks both.
   * @param [options.active]  If true, then if the target's current scroll offset
   *                          is 0, it will attempt to scroll it rather than
   *                          looking at its overflow.
   * @param [options.noCache] By default the result of a check is cached for 1s
   *                          and if there's already a cached result for this
   *                          element, it is returned. Set this to true to disable
   *                          checking the cache and also saving the result into
   *                          the cache.
   *
   * @category Scrolling
   */
  const isScrollable = (element, options) => {
    const {
      axis,
      active,
      noCache
    } = options !== null && options !== void 0 ? options : {};
    if (!axis) {
      return isScrollable(element, {
        axis: "y",
        active,
        noCache
      }) || isScrollable(element, {
        axis: "x",
        active,
        noCache
      });
    }
    if (!noCache) {
      var _isScrollableCache$ge;
      const cachedResult = (_isScrollableCache$ge = isScrollableCache.get(element)) === null || _isScrollableCache$ge === void 0 ? void 0 : _isScrollableCache$ge.get(axis);
      if (!isNullish(cachedResult)) {
        return cachedResult;
      }
    }
    const offset = axis === "x" ? "Left" : "Top";
    let result = false;
    if (element[`scroll${offset}`]) {
      result = true;
    } else if (active) {
      // Use scrollTo with explicit behavior set to instant instead of setting
      // the scrollTop/Left properties since the latter doesn't work with
      // scroll-behavior smooth.
      elScrollTo(element, {
        [toLowerCase(offset)]: 1
      });
      const canScroll = element[`scroll${offset}`] > 0;
      elScrollTo(element, {
        [toLowerCase(offset)]: 0
      });
      result = canScroll;
    } else {
      const dimension = axis === "x" ? "Width" : "Height";
      const isDocScrollable = element === getDocScrollingElement();
      const hasOverflow = element[`scroll${dimension}`] > element[`client${dimension}`];
      const overflowProp = getComputedStylePropNow(element, "overflow");
      const scrollingOverflows = [S_SCROLL, S_AUTO$1, ...(isDocScrollable ? [S_VISIBLE] : [])];
      result = hasOverflow && includes(scrollingOverflows, overflowProp);
    }
    if (!noCache) {
      isScrollableCache.sGet(element).set(axis, result);
      setTimer(() => {
        deleteKey(isScrollableCache.get(element), axis);
        isScrollableCache.prune(element);
      }, IS_SCROLLABLE_CACHE_TIMEOUT);
    }
    return result;
  };

  /**
   * Returns the closest scrollable ancestor of the given element, _not including
   * it_.
   *
   * @param options See {@link isScrollable}
   *
   * @returns `null` if no scrollable ancestors are found.
   *
   * @category Scrolling
   */
  const getClosestScrollable = (element, options) => {
    // Walk up the tree, starting at the element in question but excluding it.
    let ancestor = element;
    while (ancestor = parentOf(ancestor)) {
      if (isScrollable(ancestor, options)) {
        return ancestor;
      }
    }
    return null;
  };

  /**
   * Returns the current {@link ScrollAction} if any.
   *
   * @category Scrolling
   */
  const getCurrentScrollAction = scrollable => {
    scrollable = toScrollableOrDefault(scrollable);
    const info = currentScrollInfos.get(scrollable);
    if (info) {
      return copyObject(info._action);
    }
    return null;
  };

  /**
   * Scrolls the given scrollable element to the given `to` target.
   *
   * Returns `null` if there's an ongoing scroll that is not cancellable.
   *
   * Note that if `to` is an element or a selector, then it _must_ be a
   * descendant of the scrollable element.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *               If the target coordinates are invalid.
   *
   * @param to If this is an element, then its top-left position is used as
   *           the target coordinates. If it is a string, then it is treated
   *           as a selector for an element using `querySelector`.
   *
   * @returns `null` if there's an ongoing scroll that is not cancellable,
   * otherwise a {@link ScrollAction}.
   *
   * @category Scrolling
   */
  const scrollTo = (to, userOptions) => {
    const options = getOptions$1(to, userOptions);
    const scrollable = options._scrollable;

    // cancel current scroll action if any
    const info = currentScrollInfos.get(scrollable);
    if (info) {
      if (!info._action.cancel()) {
        // current scroll action is not cancellable by us
        return null;
      }
    }
    let isCancelled = false;
    const cancelFn = options._weCanInterrupt ? () => isCancelled = true : () => false;
    const scrollEvents = ["touchmove", "wheel"]; // don't bother with keyboard
    let preventScrollHandler = null;
    if (options._userCanInterrupt) {
      for (const eventType of scrollEvents) {
        addEventListenerTo(scrollable, eventType, () => {
          isCancelled = true;
        }, {
          once: true
        });
      }
    } else {
      preventScrollHandler = preventDefault;
      for (const eventType of scrollEvents) {
        addEventListenerTo(scrollable, eventType, preventScrollHandler, {
          passive: false
        });
      }
    }
    const thisInfo = {
      _action: {
        waitFor: () => scrollActionPromise,
        cancel: cancelFn
      }
    };
    const cleanup = () => {
      var _currentScrollInfos$g;
      if (((_currentScrollInfos$g = currentScrollInfos.get(scrollable)) === null || _currentScrollInfos$g === void 0 ? void 0 : _currentScrollInfos$g._action) === thisInfo._action) {
        deleteKey(currentScrollInfos, scrollable);
      }
      if (preventScrollHandler) {
        for (const eventType of scrollEvents) {
          removeEventListenerFrom(scrollable, eventType, preventScrollHandler, {
            passive: false
          });
        }
      }
    };
    const scrollActionPromise = initiateScroll(options, () => isCancelled);
    thisInfo._action.waitFor().then(cleanup).catch(cleanup);
    updateCurrentScrollInfo(scrollable, thisInfo);
    return thisInfo._action;
  };

  /**
   * Returns true if the given string is a valid scroll direction.
   *
   * @category Validation
   */
  const isValidScrollDirection = direction => includes(SCROLL_DIRECTIONS, direction);

  /**
   * Returns true if the given string or array is a list of valid scroll
   * directions.
   *
   * @category Validation
   */
  const isValidScrollDirectionList = directions => isValidStrList(directions, isValidScrollDirection, false);

  /**
   * @ignore
   * @internal
   */
  const mapScrollable = (original, actualScrollable) => mappedScrollables.set(original, actualScrollable);

  /**
   * @ignore
   * @internal
   */
  const unmapScrollable = original => deleteKey(mappedScrollables, original);

  /**
   * @ignore
   * @internal
   */
  const getClientWidthNow = element => isScrollableBodyInQuirks(element) ? element.offsetWidth - getBorderWidth(element, S_LEFT) - getBorderWidth(element, S_RIGHT) : element[S_CLIENT_WIDTH];

  /**
   * @ignore
   * @internal
   */
  const getClientHeightNow = element => isScrollableBodyInQuirks(element) ? element.offsetHeight - getBorderWidth(element, S_TOP) - getBorderWidth(element, S_BOTTOM) : element[S_CLIENT_HEIGHT];

  /**
   * @ignore
   * @internal
   */
  const tryGetMainContentElement = () => mainContentElement !== null && mainContentElement !== void 0 ? mainContentElement : null;

  /**
   * @ignore
   * @internal
   *
   * Exposed via ScrollWatcher
   */
  const fetchMainContentElement = async () => {
    await init$6();
    return mainContentElement;
  };

  /**
   * @ignore
   * @internal
   */
  const tryGetMainScrollableElement = () => mainScrollableElement !== null && mainScrollableElement !== void 0 ? mainScrollableElement : null;

  /**
   * @ignore
   * @internal
   *
   * Exposed via ScrollWatcher
   */
  const fetchMainScrollableElement = async () => {
    await init$6();
    return mainScrollableElement;
  };

  /**
   * @ignore
   * @internal
   */
  const getDefaultScrollingElement = () => {
    var _MH$getDocScrollingEl;
    const body = getBody();
    return isScrollable(body) ? body : (_MH$getDocScrollingEl = getDocScrollingElement()) !== null && _MH$getDocScrollingEl !== void 0 ? _MH$getDocScrollingEl : body;
  };

  /**
   * @ignore
   * @internal
   */
  const tryGetScrollableElement = target => toScrollableOrMain(target, tryGetMainScrollableElement);

  /**
   * @ignore
   * @internal
   */
  const fetchScrollableElement = async target => toScrollableOrMain(target, fetchMainScrollableElement);

  // ----------------------------------------

  const IS_SCROLLABLE_CACHE_TIMEOUT = 1000;
  const isScrollableCache = newXMap(() => newMap());
  const mappedScrollables = newMap();
  const currentScrollInfos = newMap();
  const DIFF_THRESHOLD = 5;
  const arePositionsDifferent = (start, end, threshold = DIFF_THRESHOLD) => maxAbs(start.top - end.top, start.left - end.left) > threshold;

  // must be called in "measure time"
  const getBorderWidth = (element, side) => ceil(parseFloat(getComputedStylePropNow(element, `border-${side}`)));
  const isScrollableBodyInQuirks = element => element === getBody() && getDocScrollingElement() === null;
  const toScrollableOrMain = (target, getMain) => {
    if (isElement(target)) {
      var _mappedScrollables$ge;
      return (_mappedScrollables$ge = mappedScrollables.get(target)) !== null && _mappedScrollables$ge !== void 0 ? _mappedScrollables$ge : target;
    }
    if (!target || target === getWindow() || target === getDoc()) {
      return getMain();
    }
    throw usageError("Unsupported scroll target");
  };
  const toScrollableOrDefault = scrollable => scrollable !== null && scrollable !== void 0 ? scrollable : getDefaultScrollingElement();
  const getOptions$1 = (to, options) => {
    var _options$offset, _options$altOffset, _options$duration, _options$weCanInterru, _options$userCanInter;
    const scrollable = toScrollableOrDefault(options === null || options === void 0 ? void 0 : options.scrollable);
    const target = getTargetCoordinates(scrollable, to);
    const altTarget = options !== null && options !== void 0 && options.altTarget ? getTargetCoordinates(scrollable, options === null || options === void 0 ? void 0 : options.altTarget) : null;
    return {
      _target: target,
      _offset: (_options$offset = options === null || options === void 0 ? void 0 : options.offset) !== null && _options$offset !== void 0 ? _options$offset : null,
      _altTarget: altTarget,
      _altOffset: (_options$altOffset = options === null || options === void 0 ? void 0 : options.altOffset) !== null && _options$altOffset !== void 0 ? _options$altOffset : null,
      _scrollable: scrollable,
      _duration: (_options$duration = options === null || options === void 0 ? void 0 : options.duration) !== null && _options$duration !== void 0 ? _options$duration : 0,
      _weCanInterrupt: (_options$weCanInterru = options === null || options === void 0 ? void 0 : options.weCanInterrupt) !== null && _options$weCanInterru !== void 0 ? _options$weCanInterru : false,
      _userCanInterrupt: (_options$userCanInter = options === null || options === void 0 ? void 0 : options.userCanInterrupt) !== null && _options$userCanInter !== void 0 ? _options$userCanInter : false
    };
  };
  const updateCurrentScrollInfo = (scrollable, newInfo) => {
    var _newInfo$_action;
    const existingScrollInfo = currentScrollInfos.get(scrollable);
    const _action = (_newInfo$_action = newInfo._action) !== null && _newInfo$_action !== void 0 ? _newInfo$_action : existingScrollInfo === null || existingScrollInfo === void 0 ? void 0 : existingScrollInfo._action;
    if (_action) {
      currentScrollInfos.set(scrollable, merge(existingScrollInfo, newInfo, {
        _action
      }));
    }
  };
  const getTargetCoordinates = (scrollable, target) => {
    const isDocScrollingElement = scrollable === getDocScrollingElement();
    if (isElement(target)) {
      if (scrollable === target || !scrollable.contains(target)) {
        throw usageError("Target must be a descendant of the scrollable one");
      }
      return {
        top: () => getBoundingClientRect(target).top - getBoundingClientRect(scrollable).top + (isDocScrollingElement ? 0 : scrollable[S_SCROLL_TOP]),
        left: () => getBoundingClientRect(target).left - getBoundingClientRect(scrollable).left + (isDocScrollingElement ? 0 : scrollable[S_SCROLL_LEFT])
      };
    }
    if (isString(target)) {
      const targetEl = docQuerySelector(target);
      if (!targetEl) {
        throw usageError(`No match for '${target}'`);
      }
      return getTargetCoordinates(scrollable, targetEl);
    }
    if (!isObject(target) || !("top" in target || "left" in target)) {
      throw usageError("Invalid coordinates");
    }
    return target;
  };
  const getStartEndPosition = async options => {
    await waitForMeasureTime();
    const applyOffset = (position, offset) => {
      var _offset$top, _offset$left;
      position.top += (_offset$top = offset === null || offset === void 0 ? void 0 : offset.top) !== null && _offset$top !== void 0 ? _offset$top : 0;
      position.left += (_offset$left = offset === null || offset === void 0 ? void 0 : offset.left) !== null && _offset$left !== void 0 ? _offset$left : 0;
    };
    const scrollable = options._scrollable;
    const start = {
      top: scrollable[S_SCROLL_TOP],
      left: scrollable[S_SCROLL_LEFT]
    };
    let end = getEndPosition(scrollable, start, options._target);
    applyOffset(end, options._offset);
    if (!arePositionsDifferent(start, end) && options._altTarget) {
      end = getEndPosition(scrollable, start, options._altTarget);
      applyOffset(end, options._altOffset);
    }
    return {
      _start: start,
      _end: end
    };
  };

  // must be called in "measure time"
  const getEndPosition = (scrollable, startPosition, targetCoordinates) => {
    // by default no change in scroll top or left
    const endPosition = copyObject(startPosition);
    if (!isNullish(targetCoordinates === null || targetCoordinates === void 0 ? void 0 : targetCoordinates.top)) {
      if (isFunction(targetCoordinates.top)) {
        endPosition.top = targetCoordinates.top(scrollable);
      } else {
        endPosition.top = targetCoordinates.top;
      }
    }
    if (!isNullish(targetCoordinates === null || targetCoordinates === void 0 ? void 0 : targetCoordinates.left)) {
      if (isFunction(targetCoordinates.left)) {
        endPosition.left = targetCoordinates.left(scrollable);
      } else {
        endPosition.left = targetCoordinates.left;
      }
    }

    // Set boundaries
    const scrollH = scrollable[S_SCROLL_HEIGHT];
    const scrollW = scrollable[S_SCROLL_WIDTH];
    const clientH = getClientHeightNow(scrollable);
    const clientW = getClientWidthNow(scrollable);
    endPosition.top = min(scrollH - clientH, endPosition.top);
    endPosition.top = max(0, endPosition.top);
    endPosition.left = min(scrollW - clientW, endPosition.left);
    endPosition.left = max(0, endPosition.left);
    return endPosition;
  };
  const initiateScroll = async (options, isCancelled) => {
    var _existingScrollInfo$_, _existingScrollInfo$_2;
    const position = await getStartEndPosition(options);
    const duration = options._duration;
    const scrollable = options._scrollable;
    const existingScrollInfo = currentScrollInfos.get(scrollable);
    const currentPosition = (_existingScrollInfo$_ = existingScrollInfo === null || existingScrollInfo === void 0 ? void 0 : existingScrollInfo._position) !== null && _existingScrollInfo$_ !== void 0 ? _existingScrollInfo$_ : position._start;
    const currentVelocity = (_existingScrollInfo$_2 = existingScrollInfo === null || existingScrollInfo === void 0 ? void 0 : existingScrollInfo._velocity) !== null && _existingScrollInfo$_2 !== void 0 ? _existingScrollInfo$_2 : {
      [S_TOP]: 0,
      [S_LEFT]: 0
    };
    let elapsed = existingScrollInfo === null || existingScrollInfo === void 0 ? void 0 : existingScrollInfo._elapsed;
    const logger = result ? new result.Logger({
      name: `scroll-${formatAsString(scrollable)}-${randId()}`,
      logAtCreation: {
        options,
        position,
        elapsed,
        currentPosition: copyObject(currentPosition),
        currentVelocity: copyObject(currentVelocity)
      }
    }) : null;
    var _iteratorAbruptCompletion = false;
    var _didIteratorError = false;
    var _iteratorError;
    try {
      for (var _iterator = _asyncIterator(newAnimationFrameIterator(elapsed)), _step; _iteratorAbruptCompletion = !(_step = await _iterator.next()).done; _iteratorAbruptCompletion = false) {
        elapsed = _step.value;
        {
          const deltaTime = elapsed.sinceLast;
          if (deltaTime === 0) {
            // First time
            continue;
          }

          // Element.scrollTo equates to a measurement and needs to run after
          // painting to avoid forced layout.
          await waitForMeasureTime();
          if (isCancelled()) {
            // Reject the promise
            logger === null || logger === void 0 || logger.debug8("Cancelled");
            throw currentPosition;
          }
          for (const s of [S_LEFT, S_TOP]) {
            const {
              l,
              v
            } = criticallyDamped({
              l: currentPosition[s],
              v: currentVelocity[s],
              lTarget: position._end[s],
              dt: deltaTime,
              lag: duration
            });
            currentPosition[s] = l;
            currentVelocity[s] = v;
          }
          updateCurrentScrollInfo(scrollable, {
            _position: currentPosition,
            _velocity: currentVelocity,
            _elapsed: elapsed
          });
          const isDone = !arePositionsDifferent(currentPosition, position._end, 0.5);
          if (isDone) {
            assign(currentPosition, position._end); // use exact final coordinates
          }
          elScrollTo(scrollable, currentPosition);
          if (isDone) {
            logger === null || logger === void 0 || logger.debug8("Done");
            break;
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (_iteratorAbruptCompletion && _iterator.return != null) {
          await _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
    return currentPosition;
  };

  // ------------------------------

  let mainContentElement;
  let mainScrollableElement;
  let initPromise$1 = null;
  const init$6 = () => {
    if (!initPromise$1) {
      initPromise$1 = (async () => {
        const mainScrollableElementSelector = settings.mainScrollableElementSelector;
        const contentElement = await waitForElementOrInteractive(() => {
          return mainScrollableElementSelector ? docQuerySelector(mainScrollableElementSelector) : getBody(); // default if no selector
        });

        // defaults
        mainScrollableElement = getDefaultScrollingElement();
        mainContentElement = getBody();
        if (!contentElement) {
          logError(usageError(`No match for '${mainScrollableElementSelector}'. ` + "Scroll tracking/capturing may not work as intended."));
        } else if (!isHTMLElement(contentElement)) {
          logWarn("mainScrollableElementSelector should point to an HTMLElement");
        } else if (contentElement !== mainContentElement) {
          mainScrollableElement = mainContentElement = contentElement;
        }
      })();
    }
    return initPromise$1;
  };

  // Try to find the main scrollable/content elements asap so that tryGetMain*
  // can return them if called before fetchMain*
  if (hasDOM()) {
    waitForInteractive().then(init$6);
  }

  /**
   * @module Utils
   */


  /**
   * @category Overlays
   * @interface
   */

  /**
   * Returns an existing overlay for this specification. If the overlay was just
   * created it may not yet be attached to the DOM.
   *
   * @category Overlays
   */
  const getOverlay = userOptions => {
    var _overlays$get$get, _overlays$get;
    const options = tryGetOverlayOptions(userOptions);
    if (!options) {
      return null;
    }
    return (_overlays$get$get = (_overlays$get = overlays.get(options._parent)) === null || _overlays$get === void 0 ? void 0 : _overlays$get.get(options._overlayKey)) !== null && _overlays$get$get !== void 0 ? _overlays$get$get : null;
  };

  /**
   * Creates a new overlay, and inserts it into the DOM as soon as
   * {@link waitForMutateTime} resolves, or returns an already existing matching
   * overlay.
   *
   * **Note** that if {@link OverlayOptions.id} is set, a new overlay will
   * _always_ be created.
   *
   * @category Overlays
   */
  const createOverlay = async userOptions => {
    const options = await fetchOverlayOptions(userOptions);
    const canReuse = !options._id;
    if (canReuse) {
      var _overlays$get2;
      const existingOverlay = (_overlays$get2 = overlays.get(options._parent)) === null || _overlays$get2 === void 0 ? void 0 : _overlays$get2.get(options._overlayKey);
      if (existingOverlay) {
        if (!parentOf(existingOverlay)) {
          // not yet inserted into the DOM, so wait until it is
          await waitForMutateTime();
        }
        return existingOverlay;
      }
    }

    // Create a new one
    const overlay = createOnlyOverlay(options);
    if (canReuse) {
      // Save it now before awating, so that concurrent requests to create the
      // same one use it
      overlays.sGet(options._parent).set(options._overlayKey, overlay);
    } else {
      overlay.id = options._id;
    }
    const isPercentageHOffset = includes((options._style.left || "") + (options._style.right || ""), "%");
    const isPercentageVOffset = includes((options._style.top || "") + (options._style.bottom || ""), "%");
    let needsContentWrapping = false;
    let parentEl = options._parent;
    if (isPercentageHOffset || isPercentageVOffset) {
      needsContentWrapping = isPercentageHOffset && isScrollable(parentEl, {
        axis: "x"
      }) || isPercentageVOffset && isScrollable(parentEl, {
        axis: "y"
      });
    }
    if (needsContentWrapping) {
      // TODO Is it possible to unwrap the children when no longer needing this
      // overlay? Probably not worth the effort. ViewWatcher doesn't remove old
      // olverlays anyway.
      parentEl = await tryWrapContent(parentEl, {
        _classNames: [PREFIX_WRAPPER$3, PREFIX_WRAPPER$2],
        _required: true,
        _requiredBy: "percentage offset view trigger with scrolling root"
      });
    }
    if (options._style.position === S_ABSOLUTE) {
      // Ensure parent has non-static positioning
      addClasses(parentEl, prefixName("overlay-container"));
    }
    await moveElement(overlay, {
      to: parentEl
    });
    return overlay;
  };

  // ----------------------------------------

  const PREFIX_WRAPPER$2 = prefixName("overlay-wrapper");
  const overlays = newXWeakMap(() => newMap());
  const tryGetOverlayOptions = userOptions => {
    var _userOptions$data, _userOptions$id;
    const style = getCssProperties(userOptions === null || userOptions === void 0 ? void 0 : userOptions.style);
    const data = (_userOptions$data = userOptions === null || userOptions === void 0 ? void 0 : userOptions.data) !== null && _userOptions$data !== void 0 ? _userOptions$data : {};
    const parentEl = tryGetParent(userOptions === null || userOptions === void 0 ? void 0 : userOptions.parent, style.position);
    if (!parentEl) {
      return null;
    }
    return {
      _parent: parentEl,
      _id: (_userOptions$id = userOptions === null || userOptions === void 0 ? void 0 : userOptions.id) !== null && _userOptions$id !== void 0 ? _userOptions$id : "",
      _style: style,
      _data: data,
      _overlayKey: getOverlayKey(style, data)
    };
  };
  const fetchOverlayOptions = async userOptions => {
    var _userOptions$data2, _userOptions$id2;
    const style = getCssProperties(userOptions === null || userOptions === void 0 ? void 0 : userOptions.style);
    const data = (_userOptions$data2 = userOptions === null || userOptions === void 0 ? void 0 : userOptions.data) !== null && _userOptions$data2 !== void 0 ? _userOptions$data2 : {};
    const parentEl = await fetchParent(userOptions === null || userOptions === void 0 ? void 0 : userOptions.parent, style.position);
    return {
      _parent: parentEl,
      _id: (_userOptions$id2 = userOptions === null || userOptions === void 0 ? void 0 : userOptions.id) !== null && _userOptions$id2 !== void 0 ? _userOptions$id2 : "",
      _style: style,
      _data: data,
      _overlayKey: getOverlayKey(style, data)
    };
  };
  const getOverlayKey = (style, data) => objToStrKey(style) + "|" + objToStrKey(data);
  const getCssProperties = style => {
    const finalCssProperties = merge(style, {
      position: (style === null || style === void 0 ? void 0 : style.position) || S_ABSOLUTE
    } // default
    );
    if (finalCssProperties.position === S_ABSOLUTE || finalCssProperties.position === S_FIXED) {
      if (isEmpty(finalCssProperties.top) && isEmpty(finalCssProperties.bottom)) {
        finalCssProperties.top = "0px";
      }
      if (isEmpty(finalCssProperties.left) && isEmpty(finalCssProperties.right)) {
        finalCssProperties.left = "0px";
      }
    }
    return finalCssProperties;
  };
  const tryGetParent = (userSuppliedParent, position) => userSuppliedParent !== null && userSuppliedParent !== void 0 ? userSuppliedParent : position === S_FIXED ? getBody() : tryGetMainContentElement();
  const fetchParent = async (userSuppliedParent, position) => userSuppliedParent !== null && userSuppliedParent !== void 0 ? userSuppliedParent : position === S_FIXED ? await waitForElement(getBody) : await fetchMainContentElement();
  const createOnlyOverlay = options => {
    const overlay = createElement("div");
    addClassesNow(overlay, prefixName("overlay"));
    const data = options._data;
    for (const attr of keysOf(data)) {
      setDataNow(overlay, camelToKebabCase(attr), data[attr]);
    }
    const style = options._style;
    for (const prop of keysOf(style)) {
      setStylePropNow(overlay, prop, style[prop]);
    }
    return overlay;
  };

  /**
   * @module Utils
   */


  /**
   * Returns the content box size of the given
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry | ResizeObserverEntry}.
   *
   * @category Size measurements
   */
  const getEntryContentBox = entry => {
    const size = entry.contentBoxSize;
    if (size) {
      return getSizeFromInlineBlock(size);
    }
    const rect = entry.contentRect;
    return {
      [S_WIDTH]: rect[S_WIDTH],
      [S_HEIGHT]: rect[S_HEIGHT]
    };
  };

  /**
   * Returns the border box size of the given
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry | ResizeObserverEntry}.
   *
   * @param fallbackToContent If the entry does not contain border box
   *                          measurements (depending on browser), then fall back
   *                          to using the content box size. Otherwise (by
   *                          default) will return `NaN` values for width and
   *                          height.
   *
   * @category Size measurements
   */
  const getEntryBorderBox = (entry, fallbackToContent = false) => {
    const size = entry.borderBoxSize;
    if (size) {
      return getSizeFromInlineBlock(size);
    } else if (fallbackToContent) {
      return getEntryContentBox(entry);
    }
    return {
      [S_WIDTH]: NaN,
      [S_HEIGHT]: NaN
    };
  };

  /**
   * Returns true if the given string is a valid box type.
   *
   * @category Validation
   */
  const isValidBox = box => includes(ALL_BOXES, box);

  /**
   * Returns true if the given string is a valid dimension.
   *
   * @category Validation
   */
  const isValidDimension = dimension => includes(ALL_DIMENSIONS, dimension);

  /**
   * @ignore
   * @internal
   */
  const tryGetViewportOverlay = () => viewportOverlay !== null && viewportOverlay !== void 0 ? viewportOverlay : null;

  /**
   * @ignore
   * @internal
   *
   * Exposed via SizeWatcher
   */
  const fetchViewportOverlay = async () => {
    await init$5();
    return viewportOverlay;
  };

  /**
   * @ignore
   * @internal
   */
  const fetchViewportSize = async (realtime = false) => {
    var _MH$getDocScrollingEl, _root$clientWidth, _root$clientHeight;
    if (!realtime) {
      await waitForMeasureTime();
    }
    const root = hasDOM() ? (_MH$getDocScrollingEl = getDocScrollingElement()) !== null && _MH$getDocScrollingEl !== void 0 ? _MH$getDocScrollingEl : getBody() : null;
    return {
      [S_WIDTH]: (_root$clientWidth = root === null || root === void 0 ? void 0 : root.clientWidth) !== null && _root$clientWidth !== void 0 ? _root$clientWidth : 0,
      [S_HEIGHT]: (_root$clientHeight = root === null || root === void 0 ? void 0 : root.clientHeight) !== null && _root$clientHeight !== void 0 ? _root$clientHeight : 0
    };
  };

  // ----------------------------------------

  const S_INLINE_SIZE = "inlineSize";
  const S_BLOCK_SIZE = "blockSize";
  const ALL_BOXES = ["content", "border"];
  const ALL_DIMENSIONS = [S_WIDTH, S_HEIGHT];
  const getSizeFromInlineBlock = size => {
    /* istanbul ignore else */
    if (isIterableObject(size)) {
      return {
        [S_WIDTH]: size[0][S_INLINE_SIZE],
        [S_HEIGHT]: size[0][S_BLOCK_SIZE]
      };
    }
    return {
      // in some browsers inlineSize and blockSize are scalars and nor Arrays
      [S_WIDTH]: size[S_INLINE_SIZE],
      [S_HEIGHT]: size[S_BLOCK_SIZE]
    };
  };

  // ------------------------------

  let viewportOverlay;
  let initPromise = null;
  const init$5 = () => {
    if (!initPromise) {
      initPromise = (async () => {
        viewportOverlay = await createOverlay({
          id: prefixName("vp-ovrl"),
          style: {
            position: "fixed",
            [S_WIDTH]: "100vw",
            [S_HEIGHT]: "100vh"
          }
        });
      })();
    }
    return initPromise;
  };

  /**
   * @module Modules/XResizeObserver
   */

  /**
   * {@link XResizeObserver} is an extension of
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver | ResizeObserver}
   * - observes both border box and content box size changes
   * - can skip the initial callback that happens shortly after setting up via
   *   {@link observeLater}
   * - can debounce the callback
   */
  class XResizeObserver {
    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/observe | ResizeObserver:observe} except it accepts multiple targets.
     */

    /**
     * Like {@link observe} but it ignores the initial almost immediate callback
     * and only calls the callback on a subsequent resize.
     *
     * If the target is already being observed, nothing is done.
     */

    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/unobserve | ResizeObserver:unobserve} except it accepts multiple targets.
     */

    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/disconnect | ResizeObserver:disconnect}.
     */

    /**
     * @param debounceWindow Debounce the handler so that it's called at most
     *                       every `debounceWindow` ms.
     */
    constructor(callback, debounceWindow) {
      const logger = result ? new result.Logger({
        name: "XResizeObserver"
      }) : null;

      // Keep the latest ResizeObserverEntry for each target during the
      // debounceWindow. Short-lived, so ok to use a Map.
      const buffer = newMap();

      // Since internally we have two observers, one for border box, one for
      // content box, we will get called initially twice for a target. So we keep
      // a counter of 1 or 2 for how many more calls to ignore.
      const targetsToSkip = newWeakMap();
      let observedTargets = newWeakSet();
      debounceWindow !== null && debounceWindow !== void 0 ? debounceWindow : debounceWindow = 0;
      let timer = null;
      const resizeHandler = entries => {
        // Override entries for previous targets, but keep entries whose targets
        // were not resized in this round
        for (const entry of entries) {
          const target = targetOf(entry);
          const skipNum = targetsToSkip.get(target);
          if (skipNum !== undefined) {
            if (skipNum === 2) {
              // expect one more call
              targetsToSkip.set(target, 1);
            } else {
              // done
              /* istanbul ignore next */
              if (skipNum !== 1) {
                logError(bugError(`# targetsToSkip is ${skipNum}`));
              }
              deleteKey(targetsToSkip, target);
            }
            continue;
          }
          buffer.set(target, entry);
        }
        logger === null || logger === void 0 || logger.debug9(`Got ${entries.length} new entries. ` + `Have ${buffer.size} unique-target entries`, entries);
        if (!timer && sizeOf(buffer)) {
          timer = setTimer(() => {
            if (sizeOf(buffer)) {
              callback(arrayFrom(buffer.values()), this);
              buffer.clear();
            }
            timer = null;
          }, debounceWindow);
        }
      };
      const borderObserver = newResizeObserver(resizeHandler);
      const contentObserver = newResizeObserver(resizeHandler);
      if (!borderObserver || !contentObserver) {
        logWarn("This browser does not support ResizeObserver. Some features won't work.");
      }
      const observeTarget = target => {
        observedTargets.add(target);
        borderObserver === null || borderObserver === void 0 || borderObserver.observe(target, {
          box: "border-box"
        });
        contentObserver === null || contentObserver === void 0 || contentObserver.observe(target);
      };

      // --------------------

      this.observe = (...targets) => {
        logger === null || logger === void 0 || logger.debug10("Observing targets", targets);
        for (const target of targets) {
          observeTarget(target);
        }
      };
      this.observeLater = (...targets) => {
        logger === null || logger === void 0 || logger.debug10("Observing targets (later)", targets);
        for (const target of targets) {
          // Only skip them if not already observed, otherwise the initial
          // (almost) immediate callback won't happen anyway.
          if (observedTargets.has(target)) {
            continue;
          }
          targetsToSkip.set(target, 2);
          observeTarget(target);
        }
      };
      this.unobserve = (...targets) => {
        logger === null || logger === void 0 || logger.debug10("Unobserving targets", targets);
        for (const target of targets) {
          deleteKey(observedTargets, target);
          borderObserver === null || borderObserver === void 0 || borderObserver.unobserve(target);
          contentObserver === null || contentObserver === void 0 || contentObserver.unobserve(target);
        }
      };
      this.disconnect = () => {
        logger === null || logger === void 0 || logger.debug10("Disconnecting");
        observedTargets = newWeakSet();
        borderObserver === null || borderObserver === void 0 || borderObserver.disconnect();
        contentObserver === null || contentObserver === void 0 || contentObserver.disconnect();
      };
    }
  }

  /**
   * @module Watchers/SizeWatcher
   */


  /**
   * {@link SizeWatcher} monitors the size of a given target. It's built on top
   * of {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver | ResizeObserver}.
   *
   * It manages registered callbacks globally and reuses ResizeObservers.
   *
   * Each instance of SizeWatcher manages up to two ResizeObservers: one
   * for content-box size changes and one for border-box size changes.
   */
  class SizeWatcher {
    /**
     * Call the given handler whenever the target's size changes.
     *
     * Unless {@link OnResizeOptions.skipInitial} is true, the handler is also
     * called (almost) immediately with the latest size data.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same target, even if the options differ. If the handler has already been
     * added for this target, either using {@link onResize} or {@link trackSize},
     * then it will be removed and re-added with the current options.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target or options are invalid.
     */

    /**
     * Removes a previously added handler.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target is invalid.
     */

    /**
     * This is the same as {@link onResize} except that if `handler` is not given,
     * then it defaults to an  handler that updates a set of CSS variables on the
     * target's style:
     *
     * - If {@link OnResizeOptions.target | options.target} is not given, or is
     *   `window`, the following CSS variables are set on the root (`html`)
     *   element and represent the viewport size:
     *   - `--lisn-js--window-border-width`
     *   - `--lisn-js--window-border-height`
     *   - `--lisn-js--window-content-width`
     *   - `--lisn-js--window-content-height`
     *
     * - Otherwise, the following variables are set on the target itself and
     *   represent its visible size:
     *   - `--lisn-js--border-width`
     *   - `--lisn-js--border-height`
     *   - `--lisn-js--content-width`
     *   - `--lisn-js--content-height`
     *
     * If `target` is `document`, then it will use `document.documentElement`.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same target, even if the options differ. If the handler has already been
     * added for this target, either using {@link onResize} or {@link trackSize},
     * then it will be removed and re-added with the current options.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target or options are invalid.
     */

    /**
     * Removes a previously added handler for {@link trackSize}.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target is invalid.
     */

    /**
     * Get the size of the given target. It will get the size from a
     * ResizeObserverEntry and so it's always delayed by one frame at least.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target is invalid.
     */

    /**
     * Creates a new instance of SizeWatcher with the given
     * {@link SizeWatcherConfig}. It does not save it for future reuse.
     */
    static create(config) {
      return new SizeWatcher(getConfig$4(config), CONSTRUCTOR_KEY$4);
    }

    /**
     * Returns an existing instance of SizeWatcher with the given
     * {@link SizeWatcherConfig}, or creates a new one.
     *
     * **NOTE:** It saves it for future reuse, so don't use this for temporary
     * short-lived watchers.
     */
    static reuse(config) {
      const myConfig = getConfig$4(config);
      const configStrKey = objToStrKey(myConfig);
      let instance = instances$6.get(configStrKey);
      if (!instance) {
        instance = new SizeWatcher(myConfig, CONSTRUCTOR_KEY$4);
        instances$6.set(configStrKey, instance);
      }
      return instance;
    }
    constructor(config, key) {
      if (key !== CONSTRUCTOR_KEY$4) {
        throw illegalConstructorError("SizeWatcher.create");
      }
      const logger = result ? new result.Logger({
        name: "SizeWatcher",
        logAtCreation: config
      }) : null;
      const allSizeData = newWeakMap();
      const allCallbacks = newXWeakMap(() => newMap());

      // ----------

      const resizeHandler = entries => {
        for (const entry of entries) {
          processEntry(entry);
        }
      };

      // Don't debounce the observer, only callbacks.
      const xObserver = new XResizeObserver(resizeHandler);

      // ----------

      const fetchCurrentSize = async target => {
        const element = await fetchElement$1(target);
        const sizeData = allSizeData.get(element);
        if (sizeData) {
          return copyObject(sizeData);
        }
        return newPromise(resolve => {
          // Use a temp ResizeObserver
          const observer = newResizeObserver(entries => {
            const sizeData = getSizeData(entries[0]);
            observer === null || observer === void 0 || observer.disconnect();
            resolve(sizeData); // no need to copy or save it
          });
          if (observer) {
            observer.observe(element);
          } else {
            // Warning would have already been logged by XResizeObserver
            resolve({
              border: {
                [S_WIDTH]: 0,
                [S_HEIGHT]: 0
              },
              content: {
                [S_WIDTH]: 0,
                [S_HEIGHT]: 0
              }
            });
          }
        });
      };

      // ----------

      const fetchOptions = async options => {
        var _options$box, _options$dimension, _options$MC$S_DEBOUNC;
        const box = (_options$box = options.box) !== null && _options$box !== void 0 ? _options$box : null;
        if (box && !isValidBox(box)) {
          throw usageError(`Unknown box type: '${box}'`);
        }
        const dimension = (_options$dimension = options.dimension) !== null && _options$dimension !== void 0 ? _options$dimension : null;
        if (dimension && !isValidDimension(dimension)) {
          throw usageError(`Unknown dimension: '${dimension}'`);
        }
        return {
          _element: await fetchElement$1(targetOf(options)),
          _box: box,
          _dimension: dimension,
          // If threshold is 0, internally treat as 1 (pixel)
          _threshold: toNonNegNum(options.threshold, config._resizeThreshold) || 1,
          _debounceWindow: (_options$MC$S_DEBOUNC = options[S_DEBOUNCE_WINDOW]) !== null && _options$MC$S_DEBOUNC !== void 0 ? _options$MC$S_DEBOUNC : config._debounceWindow
        };
      };

      // ----------

      const createCallback = (handler, options) => {
        var _allCallbacks$get;
        const element = options._element;
        remove((_allCallbacks$get = allCallbacks.get(element)) === null || _allCallbacks$get === void 0 || (_allCallbacks$get = _allCallbacks$get.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
        logger === null || logger === void 0 || logger.debug5("Adding/updating handler", options);
        const callback = wrapCallback(handler, options._debounceWindow);
        callback.onRemove(() => {
          deleteHandler(handler, options);
        });
        const entry = {
          _callback: callback,
          _options: options
        };
        allCallbacks.sGet(element).set(handler, entry);
        return entry;
      };

      // ----------

      const setupOnResize = async (handler, userOptions) => {
        const options = await fetchOptions(userOptions !== null && userOptions !== void 0 ? userOptions : {});
        const element = options._element;

        // Don't await for the size data before creating the callback so that
        // setupOnResize and removeOnResize have the same "timing" and therefore
        // calling onResize and offResize immediately without awaiting removes the
        // callback.
        const entry = createCallback(handler, options);
        const callback = entry._callback;
        const sizeData = await fetchCurrentSize(element);
        if (callback.isRemoved()) {
          return;
        }
        entry._data = sizeData;
        allSizeData.set(element, sizeData);

        // Always use observeLater. This is because the initial call to callback
        // shouldn't be debounced, and so we call it manually here, regardless if
        // it's a new target or not. Therefore we don't want the observer to also
        // call it in case it _is_ a new target.
        // It's ok if already observed, won't do anything.
        xObserver.observeLater(element);
        if (!(userOptions !== null && userOptions !== void 0 && userOptions.skipInitial)) {
          logger === null || logger === void 0 || logger.debug5("Calling initially with", element, sizeData);
          // Use a one-off callback that's not debounced for the initial call.
          await invokeCallback$4(wrapCallback(handler), element, sizeData);
        }
      };

      // ----------

      const removeOnResize = async (handler, target) => {
        var _allCallbacks$get2;
        const options = await fetchOptions({
          target
        });
        const element = options._element;
        const currEntry = (_allCallbacks$get2 = allCallbacks.get(element)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2.get(handler);
        if (currEntry) {
          remove(currEntry._callback);
          if (handler === setSizeCssProps) {
            // delete the properties
            setSizeCssProps(element, null);
          }
        }
      };

      // ----------

      const deleteHandler = (handler, options) => {
        const element = options._element;
        deleteKey(allCallbacks.get(element), handler);
        allCallbacks.prune(element);
        if (!allCallbacks.has(element)) {
          logger === null || logger === void 0 || logger.debug4("No more callbacks for target; unobserving", element);
          xObserver.unobserve(element);
          deleteKey(allSizeData, element);
        }
      };

      // ----------

      const processEntry = entry => {
        // In reality, it can't be just a base Element
        const element = targetOf(entry);
        const latestData = getSizeData(entry);
        allSizeData.set(element, latestData);
        logger === null || logger === void 0 || logger.debug9("New size data", element, latestData);
        for (const entry of ((_allCallbacks$get3 = allCallbacks.get(element)) === null || _allCallbacks$get3 === void 0 ? void 0 : _allCallbacks$get3.values()) || []) {
          var _allCallbacks$get3;
          const thresholdsExceeded = hasExceededThreshold$1(entry._options, latestData, entry._data);
          if (!thresholdsExceeded) {
            logger === null || logger === void 0 || logger.debug9("Threshold not exceeded");
            continue;
          }
          entry._data = latestData;
          invokeCallback$4(entry._callback, element, latestData);
        }
      };

      // ----------

      this.fetchCurrentSize = fetchCurrentSize;

      // ----------

      this.trackSize = async (handler, options) => {
        if (!handler) {
          handler = setSizeCssProps;
        }
        return setupOnResize(handler, options);
      };

      // ----------

      this.noTrackSize = (handler, target) => {
        if (!handler) {
          handler = setSizeCssProps;
        }
        removeOnResize(handler, target); // no need to await
      };

      // ----------

      this.onResize = setupOnResize;

      // ----------

      this.offResize = (handler, target) => {
        removeOnResize(handler, target); // no need to await
      };
    }
  }

  /**
   * @interface
   */

  /**
   * @interface
   */

  /**
   * The handler is invoked with three arguments:
   *
   * - the element that has been resized: if the target you requested was the
   *   viewport, then this will be a fixed positioned overlay that tracks the
   *   size of the viewport
   * - the {@link SizeData} for the element
   */

  // ----------------------------------------

  const CONSTRUCTOR_KEY$4 = SYMBOL();
  const instances$6 = newMap();
  const getConfig$4 = config => {
    config !== null && config !== void 0 ? config : config = {};
    return {
      _debounceWindow: toNonNegNum(config[S_DEBOUNCE_WINDOW], 75),
      // If threshold is 0, internally treat as 1 (pixel)
      _resizeThreshold: toNonNegNum(config.resizeThreshold, 50) || 1
    };
  };

  // --------------------

  const hasExceededThreshold$1 = (options, latestData, lastThresholdData) => {
    if (!lastThresholdData) {
      /* istanbul ignore */
      return false;
    }
    let box, dim;
    for (box in latestData) {
      if (options._box && options._box !== box) {
        continue;
      }
      for (dim in latestData[box]) {
        if (options._dimension && options._dimension !== dim) {
          continue;
        }
        const diff = abs(latestData[box][dim] - lastThresholdData[box][dim]);
        if (diff >= options._threshold) {
          return true;
        }
      }
    }
    return false;
  };
  const getSizeData = entry => {
    const borderBox = getEntryBorderBox(entry, true);
    const contentBox = getEntryContentBox(entry);
    return {
      border: borderBox,
      content: contentBox
    };
  };
  const setSizeCssProps = (element, sizeData) => {
    let prefix = "";
    if (element === tryGetViewportOverlay()) {
      // Set the CSS vars on the root element
      element = getDocElement();
      prefix = "window-";
    }
    const props = {
      borderWidth: sizeData === null || sizeData === void 0 ? void 0 : sizeData.border[S_WIDTH],
      borderHeight: sizeData === null || sizeData === void 0 ? void 0 : sizeData.border[S_HEIGHT],
      contentWidth: sizeData === null || sizeData === void 0 ? void 0 : sizeData.content[S_WIDTH],
      contentHeight: sizeData === null || sizeData === void 0 ? void 0 : sizeData.content[S_HEIGHT]
    };
    setNumericStyleJsVars(element, props, {
      _prefix: prefix
    }); // don't await here
  };
  const fetchElement$1 = async target => {
    if (isElement(target)) {
      return target;
    }
    if (!target || target === getWindow()) {
      return fetchViewportOverlay();
    }
    if (target === getDoc()) {
      return getDocElement();
    }
    throw usageError("Unsupported resize target");
  };
  const invokeCallback$4 = (callback, element, sizeData) => callback.invoke(element, copyObject(sizeData)).catch(logError);

  /**
   * @module Watchers/LayoutWatcher
   */


  /**
   * {@link LayoutWatcher} listens for changes in either the width or aspect
   * ratio of the viewport or the given {@link LayoutWatcherConfig.root | root}.
   *
   * It does not track resize events; rather it's built on top of
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver | IntersectionObserver}.
   *
   * It manages registered callbacks globally and reuses IntersectionObservers
   * for more efficient performance.
   */
  class LayoutWatcher {
    /**
     * Call the given handler whenever the layout changes.
     *
     * Unless {@link OnLayoutOptions.skipInitial} is true, the handler is also
     * called (almost) immediately with the current layout.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times, even if
     * the options differ. If the handler has already been added, it is removed
     * and re-added with the current options.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the options are invalid.
     */

    /**
     * Removes a previously added handler.
     */

    /**
     * Get the current screen layout.
     */

    /**
     * Creates a new instance of LayoutWatcher with the given
     * {@link LayoutWatcherConfig}. It does not save it for future reuse.
     */
    static create(config) {
      return new LayoutWatcher(getConfig$3(config), CONSTRUCTOR_KEY$3);
    }

    /**
     * Returns an existing instance of LayoutWatcher with the given
     * {@link LayoutWatcherConfig}, or creates a new one.
     *
     * **NOTE:** It saves it for future reuse, so don't use this for temporary
     * short-lived watchers.
     */
    static reuse(config) {
      var _instances$get;
      const myConfig = getConfig$3(config);
      const configStrKey = objToStrKey(omitKeys(myConfig, {
        _root: null
      }));
      let instance = (_instances$get = instances$5.get(myConfig._root)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(configStrKey);
      if (!instance) {
        instance = new LayoutWatcher(myConfig, CONSTRUCTOR_KEY$3);
        instances$5.sGet(myConfig._root).set(configStrKey, instance);
      }
      return instance;
    }
    constructor(config, key) {
      if (key !== CONSTRUCTOR_KEY$3) {
        throw illegalConstructorError("LayoutWatcher.create");
      }
      const logger = result ? new result.Logger({
        name: "LayoutWatcher",
        logAtCreation: config
      }) : null;
      let nonIntersectingBitmask = 0;
      let currentLayoutData = {
        device: null,
        aspectRatio: null
      };
      const allCallbacks = newMap();

      // ----------

      const fetchCurrentLayout = async () => {
        await readyPromise;
        return copyObject(currentLayoutData);
      };

      // ----------

      const setupOverlays = async () => {
        const {
          root,
          overlays
        } = await createOverlays(config._root, config._deviceBreakpoints, config._aspectRatioBreakpoints);
        return newPromise(resolve => {
          let isReady = false;
          const intersectionHandler = entries => {
            const numEntries = lengthOf(entries);
            logger === null || logger === void 0 || logger.debug9(`Got ${numEntries} new entries`, entries);
            if (!isReady) {
              /* istanbul ignore next */ // shouldn't happen
              if (numEntries < NUM_LAYOUTS) {
                logWarn(bugError(`Got IntersectionObserver ${numEntries}, ` + `expected >= ${NUM_LAYOUTS}`));
              }
            }
            for (const entry of entries) {
              nonIntersectingBitmask = getNonIntersecting(nonIntersectingBitmask, entry);
            }

            // If this is the initial call from IntersectionObserver, skip callbacks.
            // Those that have skipInitial: false would be called elsewhere, by
            // setupOnLayout
            processLayoutChange(!isReady);
            isReady = true;
            resolve(); // ready after IntersectionObserver has called us the 1st time
          };

          // ----------

          const observeOptions = {
            root,
            rootMargin: "5px 0% 5px -100%"
          };
          const observer = newIntersectionObserver(intersectionHandler, observeOptions);
          for (const triggerOverlay of overlays) {
            observer.observe(triggerOverlay);
          }
        });
      };

      // ----------

      const createCallback = (handler, layoutBitmask) => {
        var _allCallbacks$get;
        remove((_allCallbacks$get = allCallbacks.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
        logger === null || logger === void 0 || logger.debug5("Adding/updating handler", layoutBitmask);
        const callback = wrapCallback(handler);
        callback.onRemove(() => {
          deleteHandler(handler);
        });
        allCallbacks.set(handler, {
          _callback: callback,
          _layoutBitmask: layoutBitmask
        });
        return callback;
      };
      const setupOnLayout = async (handler, options) => {
        const layoutBitmask = getLayoutBitmask(options);
        const callback = createCallback(handler, layoutBitmask);
        if (options !== null && options !== void 0 && options.skipInitial) {
          return;
        }
        const layoutData = await fetchCurrentLayout();
        if (!callback.isRemoved() && changeMatches(layoutBitmask, layoutData, null)) {
          logger === null || logger === void 0 || logger.debug5("Calling initially with", layoutData);
          await invokeCallback$3(callback, layoutData);
        }
      };
      const deleteHandler = handler => {
        deleteKey(allCallbacks, handler);
        // no need to unobserve the overlays
      };
      const processLayoutChange = skipCallbacks => {
        const deviceBit = floor(log2(nonIntersectingBitmask & ORDERED_DEVICES.bitmask));
        const aspectRatioBit = floor(log2(nonIntersectingBitmask & ORDERED_ASPECTR.bitmask));
        const layoutData = {
          device: null,
          aspectRatio: null
        };

        // -Infinity means all of the overlays are intersecting, which would only
        // happen if the narrowest overlay is not actually 0-width (which is not the
        // case by default and against the recommended settings).
        if (deviceBit !== -INFINITY) {
          layoutData.device = ORDERED_DEVICES.nameOf(1 << deviceBit);
        }
        if (aspectRatioBit !== -INFINITY) {
          layoutData.aspectRatio = ORDERED_ASPECTR.nameOf(1 << aspectRatioBit);
        }
        logger === null || logger === void 0 || logger.debug8("New layout", layoutData);
        if (!skipCallbacks) {
          for (const entry of allCallbacks.values()) {
            const layoutBitmask = entry._layoutBitmask;
            if (!changeMatches(layoutBitmask, layoutData, currentLayoutData)) {
              logger === null || logger === void 0 || logger.debug9(`Layout change does not match bitmask ${layoutBitmask}`);
              continue;
            }
            invokeCallback$3(entry._callback, layoutData);
          }
        }
        currentLayoutData = layoutData;
      };
      const readyPromise = setupOverlays(); // no need to await

      // ----------

      this.fetchCurrentLayout = fetchCurrentLayout;

      // ----------

      this.onLayout = setupOnLayout;

      // ----------

      this.offLayout = handler => {
        var _allCallbacks$get2;
        logger === null || logger === void 0 || logger.debug5("Removing handler");
        remove((_allCallbacks$get2 = allCallbacks.get(handler)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2._callback);
      };
    }
  }

  /**
   * @interface
   */

  /**
   * @interface
   */

  /**
   * The handler is invoked with one argument:
   *
   * - the current {@link LayoutData}
   */

  /**
   * Note that {@link device} or {@link aspectRatio} would only be null if the
   * viewport is narrower than the narrowest device/aspect ratio. This would only
   * happen if the narrowest device/aspect ratio is _not_ 0-width (which is not
   * the case with the default breakpoints and is against the recommendation for
   * setting breakpoints.
   */

  // ----------------------------------------

  const CONSTRUCTOR_KEY$3 = SYMBOL();
  const instances$5 = newXMap(() => newMap());
  const VAR_BORDER_HEIGHT = prefixCssJsVar("border-height");
  const PREFIX_DEVICE = prefixName("device");
  const PREFIX_ASPECTR = prefixName("aspect-ratio");
  const getConfig$3 = config => {
    var _config$root;
    const deviceBreakpoints = copyObject(settings.deviceBreakpoints);
    if (config !== null && config !== void 0 && config.deviceBreakpoints) {
      copyExistingKeys(config.deviceBreakpoints, deviceBreakpoints);
    }
    const aspectRatioBreakpoints = copyObject(settings.aspectRatioBreakpoints);
    if (config !== null && config !== void 0 && config.aspectRatioBreakpoints) {
      copyExistingKeys(config.aspectRatioBreakpoints, aspectRatioBreakpoints);
    }
    return {
      _root: (_config$root = config === null || config === void 0 ? void 0 : config.root) !== null && _config$root !== void 0 ? _config$root : null,
      _deviceBreakpoints: deviceBreakpoints,
      _aspectRatioBreakpoints: aspectRatioBreakpoints
    };
  };

  // ----------------------------------------

  const createOverlays = async (root, deviceBreakpoints, aspectRatioBreakpoints) => {
    const overlayPromises = [];
    let overlayParent;
    if (root) {
      overlayParent = root;
    } else {
      // Since modals remove the scrollbar on the body when active, the width of
      // the body changes upon open/close of a modal, which would create
      // glitching if it happens near a device breakpoint. So if the root is the
      // viewport, we create a fixed positioned container to hold the overlays
      // and set its width to be 100vw and use that as the root of
      overlayParent = await createOverlay({
        style: {
          position: "fixed",
          [S_WIDTH]: "100vw"
        }
      });
    }
    let device;
    for (device in deviceBreakpoints) {
      overlayPromises.push(createOverlay({
        parent: overlayParent,
        style: {
          position: "absolute",
          [S_WIDTH]: deviceBreakpoints[device] + "px"
        },
        data: {
          [PREFIX_DEVICE]: device
        }
      }));
    }
    const parentHeightCss = root ? `var(${VAR_BORDER_HEIGHT}, 0) * 1px` : "100vh";
    if (root) {
      SizeWatcher.reuse().trackSize(null, {
        target: root
      });
    }
    let aspectRatio;
    for (aspectRatio in aspectRatioBreakpoints) {
      overlayPromises.push(createOverlay({
        parent: overlayParent,
        style: {
          position: "absolute",
          [S_WIDTH]: `calc(${aspectRatioBreakpoints[aspectRatio]} ` + `* ${parentHeightCss})`
        },
        data: {
          [PREFIX_ASPECTR]: aspectRatio
        }
      }));
    }
    const overlays = await promiseAll(overlayPromises);
    return {
      root: overlayParent,
      overlays
    };
  };
  const getOverlayLayout = overlay => {
    const layout = getData(overlay, PREFIX_DEVICE) || getData(overlay, PREFIX_ASPECTR);
    /* istanbul ignore else */
    if (layout && (ORDERED_DEVICES.has(layout) || ORDERED_ASPECTR.has(layout))) {
      return layout;
    } else {
      // shouldn't happen
      logError(bugError("No device or aspectRatio data attribute"));
      return null;
    }
  };
  const changeMatches = (layoutBitmask, thisLayoutData, prevLayoutData) => {
    // True if the callback is interested in a change of device and there's a
    // change of device and the new device is one of the ones it's interested in
    // (or it's null, i.e. device is undefined).
    // And the same for aspect ratios.

    if ((prevLayoutData === null || prevLayoutData === void 0 ? void 0 : prevLayoutData.device) !== thisLayoutData.device && (!thisLayoutData.device || ORDERED_DEVICES.bit[thisLayoutData.device] & layoutBitmask)) {
      return true;
    }
    if ((prevLayoutData === null || prevLayoutData === void 0 ? void 0 : prevLayoutData.aspectRatio) !== thisLayoutData.aspectRatio && (!thisLayoutData.aspectRatio || ORDERED_ASPECTR.bit[thisLayoutData.aspectRatio] & layoutBitmask)) {
      return true;
    }
    return false;
  };
  const getNonIntersecting = (nonIntersectingBitmask, entry) => {
    const target = targetOf(entry);
    /* istanbul ignore next */ // shouldn't happen
    if (!isHTMLElement(target)) {
      logError(bugError(`IntersectionObserver called us with '${typeOrClassOf(target)}'`));
      return nonIntersectingBitmask;
    }
    const layout = getOverlayLayout(target);
    let bit = 0;
    if (!layout) ; else if (ORDERED_DEVICES.has(layout)) {
      bit = ORDERED_DEVICES.bit[layout];
    } else if (ORDERED_ASPECTR.has(layout)) {
      bit = ORDERED_ASPECTR.bit[layout];
    } else {
      /* istanbul ignore next */ // shouldn't happen
      logError(bugError(`Unknown device or aspectRatio data attribute: ${layout}`));
    }
    if (entry.isIntersecting) {
      nonIntersectingBitmask &= ~bit;
    } else {
      nonIntersectingBitmask |= bit;
    }
    return nonIntersectingBitmask;
  };
  const invokeCallback$3 = (callback, layoutData) => callback.invoke(copyObject(layoutData)).catch(logError);

  /**
   * @module Utils
   */


  /**
   * Returns true if the given string is a valid pointer action.
   *
   * @category Validation
   */
  const isValidPointerAction = action => includes(POINTER_ACTIONS, action);

  /**
   * Returns true if the given string or array is a valid list of pointer
   * actions.
   *
   * @category Validation
   */
  const isValidPointerActionList = actions => isValidStrList(actions, isValidPointerAction, false);

  /**
   * @ignore
   * @internal
   */
  const POINTER_ACTIONS = [S_CLICK, S_HOVER, S_PRESS];

  /**
   * @module Watchers/PointerWatcher
   */


  /**
   * {@link PointerWatcher} listens for simple pointer actions like clicks, press
   * and hold or hover.
   */
  class PointerWatcher {
    /**
     * Call the `startHandler` whenever the pointer action begins.
     * Call the `endHandler` whenever the pointer action ends. If `endHandler` is
     * not given, it defaults to `startHandler`.
     *
     * For an explanation of what "begins" and "ends" means for each supported
     * action, see {@link OnPointerOptions.actions}.
     *
     * **IMPORTANT:** The same handlers can _not_ be added multiple times for the
     * same event target, even if the options differ. If the handler has already
     * been added for this target, then it will be removed and re-added with the
     * current options.
     */

    /**
     * Removes previously added handlers.
     */

    /**
     * Creates a new instance of PointerWatcher with the given
     * {@link PointerWatcherConfig}. It does not save it for future reuse.
     */
    static create(config) {
      return new PointerWatcher(getConfig$2(config), CONSTRUCTOR_KEY$2);
    }

    /**
     * Returns an existing instance of PointerWatcher with the given
     * {@link PointerWatcherConfig}, or creates a new one.
     *
     * **NOTE:** It saves it for future reuse, so don't use this for temporary
     * short-lived watchers.
     */
    static reuse(config) {
      const myConfig = getConfig$2(config);
      const configStrKey = objToStrKey(myConfig);
      let instance = instances$4.get(configStrKey);
      if (!instance) {
        instance = new PointerWatcher(myConfig, CONSTRUCTOR_KEY$2);
        instances$4.set(configStrKey, instance);
      }
      return instance;
    }
    constructor(config, key) {
      if (key !== CONSTRUCTOR_KEY$2) {
        throw illegalConstructorError("PointerWatcher.create");
      }

      // Keep this watcher super simple. The events we listen for don't fire at a
      // high rate and it's unlikely for there to be many many callbacks for each
      // target and event type, so don't bother with using a delegating listener,
      // etc.

      // Keep a map of callbacks so we can lookup the callback by the handler
      // (and also to prevent duplicate handler for each target, for consistency
      // with other watchers).
      const allCallbacks = newXWeakMap(() => newMap());

      // ----------

      const createCallback = (target, handler) => {
        var _allCallbacks$get;
        remove((_allCallbacks$get = allCallbacks.get(target)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get.get(handler));
        const callback = wrapCallback(handler);
        callback.onRemove(() => {
          deleteKey(allCallbacks.get(target), handler);
        });
        allCallbacks.sGet(target).set(handler, callback);
        return callback;
      };

      // async for consistency with other watchers and future compatibility in
      // case of change needed
      const setupOnPointer = async (target, startHandler, endHandler, userOptions) => {
        const options = getOptions(config, userOptions);
        const startCallback = createCallback(target, startHandler);
        const endCallback = endHandler && endHandler !== startHandler ? createCallback(target, endHandler) : startCallback;
        for (const action of options._actions) {
          listenerSetupFn[action](target, startCallback, endCallback, options);
        }
      };

      // ----------

      this.onPointer = setupOnPointer;

      // ----------

      this.offPointer = (target, startHandler, endHandler) => {
        const entry = allCallbacks.get(target);
        remove(entry === null || entry === void 0 ? void 0 : entry.get(startHandler));
        if (endHandler) {
          remove(entry === null || entry === void 0 ? void 0 : entry.get(endHandler));
        }
      };
    }
  }

  /**
   * @interface
   */

  /**
   * @interface
   */

  /**
   * The handler is invoked with two arguments:
   *
   * - the event target that was passed to the {@link PointerWatcher.onPointer}
   *   call (equivalent to
   *   {@link https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget | Event:currentTarget}).
   * - the {@link PointerActionData} describing the state of the action.
   */

  // ----------------------------------------

  const CONSTRUCTOR_KEY$2 = SYMBOL();
  const instances$4 = newMap();
  const getConfig$2 = config => {
    var _config$preventDefaul, _config$preventSelect;
    return {
      _preventDefault: (_config$preventDefaul = config === null || config === void 0 ? void 0 : config.preventDefault) !== null && _config$preventDefaul !== void 0 ? _config$preventDefaul : false,
      _preventSelect: (_config$preventSelect = config === null || config === void 0 ? void 0 : config.preventSelect) !== null && _config$preventSelect !== void 0 ? _config$preventSelect : true
    };
  };
  const getOptions = (config, options) => {
    var _options$preventDefau, _options$preventSelec;
    return {
      _actions: validateStrList("actions", options === null || options === void 0 ? void 0 : options.actions, isValidPointerAction) || POINTER_ACTIONS,
      _preventDefault: (_options$preventDefau = options === null || options === void 0 ? void 0 : options.preventDefault) !== null && _options$preventDefau !== void 0 ? _options$preventDefau : config._preventDefault,
      _preventSelect: (_options$preventSelec = options === null || options === void 0 ? void 0 : options.preventSelect) !== null && _options$preventSelec !== void 0 ? _options$preventSelec : config._preventSelect
    };
  };
  const setupClickListener = (target, startCallback, endCallback, options) => {
    // false if next will start; true if next will end.
    let toggleState = false;
    const wrapper = event => {
      if (options._preventDefault) {
        preventDefault(event);
      }
      toggleState = !toggleState;
      const data = {
        action: S_CLICK,
        state: toggleState ? "ON" : "OFF"
      };
      invokeCallback$2(toggleState ? startCallback : endCallback, target, data, event);
    };
    addEventListenerTo(target, S_CLICK, wrapper);
    const remove = () => removeEventListenerFrom(target, S_CLICK, wrapper);
    startCallback.onRemove(remove);
    endCallback.onRemove(remove);
  };
  const setupPointerListeners = (action, target, startCallback, endCallback, options) => {
    // If the browser doesn't support pointer events, then
    // addEventListenerTo will transform these into mouse*
    const startEventSuff = action === S_HOVER ? "enter" : "down";
    const endEventSuff = action === S_HOVER ? "leave" : "up";
    const startEvent = S_POINTER + startEventSuff;
    const endEvent = S_POINTER + endEventSuff;
    const wrapper = (event, callback) => {
      if (options._preventDefault) {
        preventDefault(event);
      }
      const data = {
        action,
        state: strReplace(event.type, /pointer|mouse/, "") === startEventSuff ? "ON" : "OFF"
      };
      invokeCallback$2(callback, target, data, event);
    };
    const startListener = event => wrapper(event, startCallback);
    const endListener = event => wrapper(event, endCallback);
    addEventListenerTo(target, startEvent, startListener);
    addEventListenerTo(target, endEvent, endListener);

    // On some touch screen devices pressing and holding will initiate select
    // and result in touchend, so we prevent text select
    if (options._preventSelect) {
      preventSelect(target);
    }
    startCallback.onRemove(() => {
      undoPreventSelect(target);
      removeEventListenerFrom(target, startEvent, startListener);
    });
    endCallback.onRemove(() => {
      undoPreventSelect(target);
      removeEventListenerFrom(target, endEvent, endListener);
    });
  };
  const listenerSetupFn = {
    click: setupClickListener,
    hover: (...args) => setupPointerListeners(S_HOVER, ...args),
    press: (...args) => setupPointerListeners(S_PRESS, ...args)
  };
  const invokeCallback$2 = (callback, target, actionData, event) => callback.invoke(target, copyObject(actionData), event).catch(logError);

  /**
   * @module Watchers/ScrollWatcher
   */


  // re-export for convenience

  /**
   * {@link ScrollWatcher} listens for scroll events in any direction.
   *
   * It manages registered callbacks globally and reuses event listeners for more
   * efficient performance.
   */
  class ScrollWatcher {
    /**
     * Call the given handler whenever the given scrollable is scrolled.
     *
     * Unless {@link OnScrollOptions.skipInitial} is true, the handler is also
     * called (almost) immediately with the latest scroll data. If a scroll has
     * not yet been observed on the scrollable and its `scrollTop` and
     * `scrollLeft` are 0, then the direction is {@link Types.NoDirection} and
     * the handler is only called if {@link Types.NoDirection} is part of the
     * supplied {@link OnScrollOptions.directions | options.directions} (or
     * {@link OnScrollOptions.directions | options.directions} is not given).
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same scrollable, even if the options differ. If the handler has already
     * been added for this scrollable, either using {@link trackScroll} or using
     * {@link onScroll}, then it will be removed and re-added with the current
     * options. So if previously it was also tracking content size changes using
     * {@link trackScroll}, it will no longer do so.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the options are invalid.
     */

    /**
     * Removes a previously added handler.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the scrollable is invalid.
     */

    /**
     * This everything that {@link onScroll} does plus more:
     *
     * In addition to a scroll event, the handler is also called when either the
     * offset size or scroll (content) size of the scrollable changes as that
     * would affect its `scrollTopFraction` and `scrollLeftFraction` and possibly
     * the `scrollTop` and `scrollLeft` as well.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same scrollable, even if the options differ. If the handler has already
     * been added for this scrollable, either using {@link trackScroll} or using
     * {@link onScroll}, then it will be removed and re-added with the current
     * options.
     *
     * ------
     *
     * If `handler` is not given, then it defaults to an internal handler that
     * updates a set of CSS variables on the scrollable element's style:
     *
     * - If {@link OnScrollOptions.scrollable | options.scrollable} is not given,
     *   or is `null`, `window` or `document`, the following CSS variables are
     *   set on the root (`html`) element and represent the scroll of the
     *   {@link Settings.settings.mainScrollableElementSelector | the main scrolling element}:
     *   - `--lisn-js--page-scroll-top`
     *   - `--lisn-js--page-scroll-top-fraction`
     *   - `--lisn-js--page-scroll-left`
     *   - `--lisn-js--page-scroll-left-fraction`
     *   - `--lisn-js--page-scroll-width`
     *   - `--lisn-js--page-scroll-height`
     *
     * - Otherwise, the following variables are set on the scrollable itself,
     *   and represent its scroll offset:
     *   - `--lisn-js--scroll-top`
     *   - `--lisn-js--scroll-top-fraction`
     *   - `--lisn-js--scroll-left`
     *   - `--lisn-js--scroll-left-fraction`
     *   - `--lisn-js--scroll-width`
     *   - `--lisn-js--scroll-height`
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the options are invalid.
     */

    /**
     * Removes a previously added handler for {@link trackScroll}.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the scrollable is invalid.
     */

    /**
     * Get the scroll offset of the given scrollable. By default, it will
     * {@link waitForMeasureTime} and so will be delayed by one frame.
     *
     * @param realtime If true, it will not {@link waitForMeasureTime}. Use
     *                 this only when doing realtime scroll-based animations
     *                 as it may cause a forced layout.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the scrollable is invalid.
     */

    /**
     * Scrolls the given scrollable element to in the given direction.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the direction or options are invalid.
     */

    /**
     * Scrolls the given scrollable element to the given `to` scrollable.
     *
     * Returns `null` if there's an ongoing scroll that is not cancellable.
     *
     * Note that if `to` is an element or a selector, then it _must_ be a
     * descendant of the scrollable element.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the "to" coordinates or options are invalid.
     *
     * @param to If this is an element, then its top-left position is used as
     *           the target coordinates. If it is a string, then it is treated
     *           as a selector for an element using `querySelector`.
     * @param [options.scrollable]
     *           If not given, it defaults to
     *           {@link Settings.settings.mainScrollableElementSelector | the main scrolling element}.
     *
     * @returns `null` if there's an ongoing scroll that is not cancellable,
     * otherwise a {@link ScrollAction}.
     */

    /**
     * Returns the current {@link ScrollAction} if any.
     *
     * @param scrollable If not given, it defaults to
     *                   {@link Settings.settings.mainScrollableElementSelector | the main scrolling element}
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the scrollable is invalid.
     */

    /**
     * Cancels the ongoing scroll that's resulting from smooth scrolling
     * triggered in the past. Does not interrupt or prevent further scrolling.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the scrollable is invalid.
     *
     * @param [options.immediate] If true, then it will not use
     *                            {@link waitForMeasureTime} or
     *                            {@link Utils.waitForMutateTime | waitForMutateTime}.
     *                            Warning: this will likely result in forced layout.
     */

    /**
     * Returns the element that holds the main page content. By default it's
     * `document.body` but is overridden by
     * {@link Settings.settings.mainScrollableElementSelector}.
     *
     * It will wait for the element to be available if not already.
     */
    static fetchMainContentElement() {
      return fetchMainContentElement();
    }

    /**
     * Returns the scrollable element that holds the wrapper around the main page
     * content. By default it's `document.scrollable` (unless `document.body` is
     * actually scrollable, in which case it will be used) but it will be
     * different if {@link Settings.settings.mainScrollableElementSelector} is set.
     *
     * It will wait for the element to be available if not already.
     */
    static fetchMainScrollableElement() {
      return fetchMainScrollableElement();
    }

    /**
     * Creates a new instance of ScrollWatcher with the given
     * {@link ScrollWatcherConfig}. It does not save it for future reuse.
     */
    static create(config) {
      return new ScrollWatcher(getConfig$1(config), CONSTRUCTOR_KEY$1);
    }

    /**
     * Returns an existing instance of ScrollWatcher with the given
     * {@link ScrollWatcherConfig}, or creates a new one.
     *
     * **NOTE:** It saves it for future reuse, so don't use this for temporary
     * short-lived watchers.
     */
    static reuse(config) {
      const myConfig = getConfig$1(config);
      const configStrKey = objToStrKey(myConfig);
      let instance = instances$3.get(configStrKey);
      if (!instance) {
        instance = new ScrollWatcher(myConfig, CONSTRUCTOR_KEY$1);
        instances$3.set(configStrKey, instance);
      }
      return instance;
    }
    constructor(config, key) {
      if (key !== CONSTRUCTOR_KEY$1) {
        throw illegalConstructorError("ScrollWatcher.create");
      }
      const logger = result ? new result.Logger({
        name: "ScrollWatcher",
        logAtCreation: config
      }) : null;
      const allScrollData = newWeakMap();
      const activeListeners = newWeakMap();
      const allCallbacks = newXWeakMap(() => newMap());

      // ----------

      const fetchCurrentScroll = async (element, realtime = false, isScrollEvent = false) => {
        // The scroll data can change event without a scroll event, e.g. by the
        // element changing size, so always get the latest here.
        const previousEventData = allScrollData.get(element);
        const latestData = await fetchScrollData(element, previousEventData, realtime);

        // If there hasn't been a scroll event, use the old scroll direction
        if (!isScrollEvent && previousEventData) {
          latestData.direction = previousEventData.direction;
        }
        return latestData;
      };

      // ----------

      const createCallback = (handler, options, trackType) => {
        var _allCallbacks$get;
        const element = options._element;
        remove((_allCallbacks$get = allCallbacks.get(element)) === null || _allCallbacks$get === void 0 || (_allCallbacks$get = _allCallbacks$get.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
        logger === null || logger === void 0 || logger.debug5("Adding/updating handler", options);
        const callback = wrapCallback(handler, options._debounceWindow);
        callback.onRemove(() => {
          deleteHandler(handler, options);
        });
        const entry = {
          _callback: callback,
          _trackType: trackType,
          _options: options
        };
        allCallbacks.sGet(element).set(handler, entry);
        return entry;
      };

      // ----------

      const setupOnScroll = async (handler, userOptions, trackType) => {
        const options = await fetchOnScrollOptions(config, userOptions !== null && userOptions !== void 0 ? userOptions : {});
        const element = options._element;

        // Don't await for the scroll data before creating the callback so that
        // setupOnScroll and removeOnScroll have the same "timing" and therefore
        // calling onScroll and offScroll immediately without awaiting removes the
        // callback.
        const entry = createCallback(handler, options, trackType);
        const callback = entry._callback;
        const eventTarget = options._eventTarget;
        const scrollData = await fetchCurrentScroll(element, options._debounceWindow === 0);
        if (callback.isRemoved()) {
          return;
        }
        entry._data = scrollData;
        allScrollData.set(element, scrollData);
        if (trackType === TRACK_FULL$1) {
          await setupSizeTrack(entry);
        }
        let listenerOptions = activeListeners.get(eventTarget);
        if (!listenerOptions) {
          logger === null || logger === void 0 || logger.debug4("Adding scroll listener", eventTarget);
          listenerOptions = {
            _nRealtime: 0
          };
          activeListeners.set(eventTarget, listenerOptions);
          // Don't debounce the scroll handler, only the callbacks.
          addEventListenerTo(eventTarget, S_SCROLL, scrollHandler);
        }
        if (options._debounceWindow === 0) {
          listenerOptions._nRealtime++;
        }
        const directions = options._directions;
        if (!callback.isRemoved() && !(userOptions !== null && userOptions !== void 0 && userOptions.skipInitial) && directionMatches(directions, scrollData.direction)) {
          logger === null || logger === void 0 || logger.debug5("Calling initially with", element, scrollData);
          // Use a one-off callback that's not debounced for the initial call.
          await invokeCallback$1(wrapCallback(handler), element, scrollData);
        }
      };

      // ----------

      const removeOnScroll = async (handler, scrollable, trackType) => {
        var _allCallbacks$get2;
        const options = await fetchOnScrollOptions(config, {
          scrollable
        });
        const element = options._element;
        const currEntry = (_allCallbacks$get2 = allCallbacks.get(element)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2.get(handler);
        if ((currEntry === null || currEntry === void 0 ? void 0 : currEntry._trackType) === trackType) {
          remove(currEntry._callback);
          if (handler === setScrollCssProps) {
            // delete the properties
            setScrollCssProps(element, null);
          }
        }
      };

      // ----------

      const deleteHandler = (handler, options) => {
        const element = options._element;
        const eventTarget = options._eventTarget;
        deleteKey(allCallbacks.get(element), handler);
        allCallbacks.prune(element);
        const listenerOptions = activeListeners.get(eventTarget);
        if (listenerOptions && options._debounceWindow === 0) {
          listenerOptions._nRealtime--;
        }
        if (!allCallbacks.has(element)) {
          logger === null || logger === void 0 || logger.debug4("No more callbacks for scrollable; removing listener", element);
          deleteKey(allScrollData, element);
          removeEventListenerFrom(eventTarget, S_SCROLL, scrollHandler);
          deleteKey(activeListeners, eventTarget);
          // TODO: Should we unwrap children if previously WE wrapped them?
        }
      };

      // ----------

      const setupSizeTrack = async entry => {
        const options = entry._options;
        const element = options._element;
        const scrollCallback = entry._callback;
        logger === null || logger === void 0 || logger.debug8("Setting up size tracking", element);
        const doc = getDoc();
        const docScrollingElement = getDocScrollingElement();
        const resizeCallback = wrapCallback(async () => {
          // Get the latest scroll data for the scrollable
          // Currently, the resize callback is already delayed by a frame due to
          // the SizeWatcher, so we don't need to treat this as realtime.
          const latestData = await fetchCurrentScroll(element);
          const thresholdsExceeded = hasExceededThreshold(options, latestData, entry._data);
          if (!thresholdsExceeded) {
            logger === null || logger === void 0 || logger.debug9("Threshold not exceeded", options, latestData, entry._data);
          } else if (!scrollCallback.isRemoved()) {
            await invokeCallback$1(scrollCallback, element, latestData);
          }
        });
        scrollCallback.onRemove(resizeCallback.remove);

        // Don't use default instance as it has a high threshold.
        const sizeWatcher = SizeWatcher.reuse();
        const setupOnResize = target => sizeWatcher.onResize(resizeCallback, {
          target,
          [S_DEBOUNCE_WINDOW]: options._debounceWindow,
          // TODO maybe accepts resizeThreshold option
          threshold: options._threshold
        });
        if (element === docScrollingElement) {
          // In case we're tracking the main document scroll, then we only need to
          // observe the viewport size and the size of the documentElement (which is
          // the content size).

          setupOnResize(); // viewport size
          setupOnResize(doc); // content size

          return;
        }

        // ResizeObserver only detects changes in offset width/height which is
        // the visible size of the scrolling element, and that is not affected by the
        // size of its content.
        // But we also need to detect changes in the scroll width/height which is
        // the size of the content.
        // We also need to keep track of elements being added to the scrollable element.

        const observedElements = newSet([element]);

        // Observe the scrolling element
        setupOnResize(element);

        // And also its children (if possible, a single wrapper around them
        const wrapper = await tryWrapContent(element, {
          _classNames: [PREFIX_WRAPPER$3, PREFIX_WRAPPER$1]
        });
        if (wrapper) {
          setupOnResize(wrapper);
          observedElements.add(wrapper);

          //
        } else {
          for (const child of childrenOf(element)) {
            setupOnResize(child);
            observedElements.add(child);
          }
        }

        // Watch for newly added elements
        const domWatcher = DOMWatcher.create({
          root: element,
          // only direct children
          subtree: false
        });
        const onAddedCallback = wrapCallback(operation => {
          const child = currentTargetOf(operation);
          // If we've just added the wrapper, it will be in DOMWatcher's queue,
          // so check.
          if (child !== wrapper) {
            if (wrapper) {
              // Move this child into the wrapper. If this results in change of size
              // for wrapper, SizeWatcher will call us.
              moveElement(child, {
                to: wrapper,
                ignoreMove: true
              });
            } else {
              // Track the size of this child.
              // Don't skip initial, call the callback now
              setupOnResize(child);
              observedElements.add(child);
            }
          }
        });
        domWatcher.onMutation(onAddedCallback, {
          categories: [S_ADDED]
        });
        resizeCallback.onRemove(onAddedCallback.remove);
      };

      // ----------

      const scrollHandler = async event => {
        var _activeListeners$get$, _activeListeners$get;
        // We cannot use event.currentTarget because scrollHandler is called inside
        // a setTimeout so by that time, currentTarget is null or something else.
        //
        // However, target and currentTarget only differ when the event is in the
        // bubbling or capturing phase. Because
        //
        // - the scroll event only bubbles when fired on document, and (it only
        //   bubbles up to window)
        // - and we never attach the listener to the capturing phase
        // - and we always use document instead of window to listen for scroll on
        //   document
        //
        // then event.target suffices.
        const scrollable = targetOf(event);
        /* istanbul ignore next */
        if (!scrollable || !(isElement(scrollable) || isDoc(scrollable))) {
          return;
        }
        const element = await fetchScrollableElement(scrollable);
        const realtime = ((_activeListeners$get$ = (_activeListeners$get = activeListeners.get(scrollable)) === null || _activeListeners$get === void 0 ? void 0 : _activeListeners$get._nRealtime) !== null && _activeListeners$get$ !== void 0 ? _activeListeners$get$ : 0) > 0;
        const latestData = await fetchCurrentScroll(element, realtime, true);
        allScrollData.set(element, latestData);
        logger === null || logger === void 0 || logger.debug9("Scroll event", element, latestData);
        for (const entry of ((_allCallbacks$get3 = allCallbacks.get(element)) === null || _allCallbacks$get3 === void 0 ? void 0 : _allCallbacks$get3.values()) || []) {
          var _allCallbacks$get3;
          // Consider the direction since the last scroll event and not the
          // direction based on the largest delta the last time the callback
          // was called.
          const options = entry._options;
          const thresholdsExceeded = hasExceededThreshold(options, latestData, entry._data);
          if (!thresholdsExceeded) {
            logger === null || logger === void 0 || logger.debug9("Threshold not exceeded", options, latestData, entry._data);
            continue;
          }

          // If threshold has been exceeded, always update the latest data for
          // this callback.
          entry._data = latestData;
          if (!directionMatches(options._directions, latestData.direction)) {
            logger === null || logger === void 0 || logger.debug9("Direction does not match", options, latestData);
            continue;
          }
          invokeCallback$1(entry._callback, element, latestData);
        }
      };

      // ----------

      this.fetchCurrentScroll = (scrollable, realtime) => fetchScrollableElement(scrollable).then(element => fetchCurrentScroll(element, realtime));

      // ----------

      this.scroll = (direction, options) => {
        var _options$amount;
        if (!isValidScrollDirection(direction)) {
          throw usageError(`Unknown scroll direction: '${direction}'`);
        }
        const isVertical = direction === S_UP || direction === S_DOWN;
        const sign = direction === S_UP || direction === S_LEFT ? -1 : 1;
        let targetCoordinate;
        const amount = (_options$amount = options === null || options === void 0 ? void 0 : options.amount) !== null && _options$amount !== void 0 ? _options$amount : 100;
        const asFractionOf = options === null || options === void 0 ? void 0 : options.asFractionOf;
        if (asFractionOf === "visible") {
          targetCoordinate = isVertical ? el => el[S_SCROLL_TOP] + sign * amount * getClientHeightNow(el) / 100 : el => el[S_SCROLL_LEFT] + sign * amount * getClientWidthNow(el) / 100;

          //
        } else if (asFractionOf === "content") {
          targetCoordinate = isVertical ? el => el[S_SCROLL_TOP] + sign * amount * el[S_SCROLL_HEIGHT] / 100 : el => el[S_SCROLL_LEFT] + sign * amount * el[S_SCROLL_WIDTH] / 100;

          //
        } else if (asFractionOf !== undefined && asFractionOf !== "pixel") {
          throw usageError(`Unknown 'asFractionOf' keyword: '${asFractionOf}'`);

          //
        } else {
          targetCoordinate = isVertical ? el => el[S_SCROLL_TOP] + sign * amount : el => el[S_SCROLL_LEFT] + sign * amount;
        }
        const target = isVertical ? {
          top: targetCoordinate
        } : {
          left: targetCoordinate
        };
        return this.scrollTo(target, options);
      };

      // ----------

      this.scrollTo = async (to, options) => {
        var _options$duration;
        return scrollTo(to, merge(options, {
          duration: (_options$duration = options === null || options === void 0 ? void 0 : options.duration) !== null && _options$duration !== void 0 ? _options$duration : config._scrollDuration,
          // default
          scrollable: await fetchScrollableElement(options === null || options === void 0 ? void 0 : options.scrollable) // override
        }));
      };

      // ----------

      this.fetchCurrentScrollAction = scrollable => fetchScrollableElement(scrollable).then(element => getCurrentScrollAction(element));

      // ----------

      this.stopUserScrolling = async options => {
        const element = await fetchScrollableElement(options === null || options === void 0 ? void 0 : options.scrollable);
        const stopScroll = () => elScrollTo(element, {
          top: element[S_SCROLL_TOP],
          left: element[S_SCROLL_LEFT]
        });
        if (options !== null && options !== void 0 && options.immediate) {
          stopScroll();
        } else {
          waitForMeasureTime().then(stopScroll);
        }
      };

      // ----------

      this.trackScroll = (handler, options) => {
        if (!handler) {
          handler = setScrollCssProps;
        }
        return setupOnScroll(handler, options, TRACK_FULL$1);
      };

      // ----------

      this.noTrackScroll = (handler, scrollable) => {
        if (!handler) {
          handler = setScrollCssProps;
        }
        removeOnScroll(handler, scrollable, TRACK_FULL$1); // no need to await
      };

      // ----------

      this.onScroll = (handler, options) => setupOnScroll(handler, options, TRACK_REGULAR$1);

      // ----------

      this.offScroll = (handler, scrollable) => {
        removeOnScroll(handler, scrollable, TRACK_REGULAR$1); // no need to await
      };
    }
  }

  /**
   * @interface
   */

  /**
   * @interface
   */

  /**
   * @interface
   */

  /**
   * The handler is invoked with two arguments:
   *
   * - the element that has been resized
   * - the {@link ScrollData} for the element
   */

  // ----------------------------------------

  const CONSTRUCTOR_KEY$1 = SYMBOL();
  const instances$3 = newMap();
  const PREFIX_WRAPPER$1 = prefixName("scroll-watcher-wrapper");
  const getConfig$1 = config => {
    config !== null && config !== void 0 ? config : config = {};
    return {
      _debounceWindow: toNonNegNum(config[S_DEBOUNCE_WINDOW], 75),
      // If threshold is 0, internally treat as 1 (pixel)
      _scrollThreshold: toNonNegNum(config.scrollThreshold, 50) || 1,
      _scrollDuration: toNonNegNum(config.scrollDuration, 1000)
    };
  };
  const TRACK_REGULAR$1 = 1; // only scroll events
  const TRACK_FULL$1 = 2; // scroll + resizing of content and/or wrapper

  // --------------------

  const fetchOnScrollOptions = async (config, options) => {
    var _options$MC$S_DEBOUNC;
    const directions = validateStrList("directions", options.directions, isValidScrollDirection) || null;
    const element = await fetchScrollableElement(options.scrollable);
    return {
      _element: element,
      _eventTarget: getEventTarget(element),
      _directions: directions,
      // If threshold is 0, internally treat as 1 (pixel)
      _threshold: toNonNegNum(options.threshold, config._scrollThreshold) || 1,
      _debounceWindow: (_options$MC$S_DEBOUNC = options[S_DEBOUNCE_WINDOW]) !== null && _options$MC$S_DEBOUNC !== void 0 ? _options$MC$S_DEBOUNC : config._debounceWindow
    };
  };
  const directionMatches = (userDirections, latestDirection) => !userDirections || includes(userDirections, latestDirection);
  const hasExceededThreshold = (options, latestData, lastThresholdData) => {
    const directions = options._directions;
    const threshold = options._threshold;
    if (!lastThresholdData) {
      /* istanbul ignore */
      return false;
    }
    const topDiff = maxAbs(latestData[S_SCROLL_TOP] - lastThresholdData[S_SCROLL_TOP], latestData[S_SCROLL_HEIGHT] - lastThresholdData[S_SCROLL_HEIGHT], latestData[S_CLIENT_HEIGHT] - lastThresholdData[S_CLIENT_HEIGHT]);
    const leftDiff = maxAbs(latestData[S_SCROLL_LEFT] - lastThresholdData[S_SCROLL_LEFT], latestData[S_SCROLL_WIDTH] - lastThresholdData[S_SCROLL_WIDTH], latestData[S_CLIENT_WIDTH] - lastThresholdData[S_CLIENT_WIDTH]);

    // If the callback is only interested in up/down, then only check the
    // scrollTop delta, and similarly for left/right.
    let checkTop = false,
      checkLeft = false;
    if (!directions || includes(directions, S_NONE) || includes(directions, S_AMBIGUOUS)) {
      checkTop = checkLeft = true;
    } else {
      if (includes(directions, S_UP) || includes(directions, S_DOWN)) {
        checkTop = true;
      }
      if (includes(directions, S_LEFT) || includes(directions, S_RIGHT)) {
        checkLeft = true;
      }
    }
    return checkTop && topDiff >= threshold || checkLeft && leftDiff >= threshold;
  };
  const fetchScrollData = async (element, previousEventData, realtime) => {
    var _previousEventData$sc, _previousEventData$sc2;
    if (!realtime) {
      await waitForMeasureTime();
    }
    const scrollTop = ceil(element[S_SCROLL_TOP]);
    const scrollLeft = ceil(element[S_SCROLL_LEFT]);
    const scrollWidth = element[S_SCROLL_WIDTH];
    const scrollHeight = element[S_SCROLL_HEIGHT];
    const clientWidth = getClientWidthNow(element);
    const clientHeight = getClientHeightNow(element);
    const scrollTopFraction = round(scrollTop) / (scrollHeight - clientHeight || INFINITY);
    const scrollLeftFraction = round(scrollLeft) / (scrollWidth - clientWidth || INFINITY);
    const prevScrollTop = (_previousEventData$sc = previousEventData === null || previousEventData === void 0 ? void 0 : previousEventData.scrollTop) !== null && _previousEventData$sc !== void 0 ? _previousEventData$sc : 0;
    const prevScrollLeft = (_previousEventData$sc2 = previousEventData === null || previousEventData === void 0 ? void 0 : previousEventData.scrollLeft) !== null && _previousEventData$sc2 !== void 0 ? _previousEventData$sc2 : 0;
    const direction = getMaxDeltaDirection(scrollLeft - prevScrollLeft, scrollTop - prevScrollTop);
    return {
      direction,
      [S_CLIENT_WIDTH]: clientWidth,
      [S_CLIENT_HEIGHT]: clientHeight,
      [S_SCROLL_WIDTH]: scrollWidth,
      [S_SCROLL_HEIGHT]: scrollHeight,
      [S_SCROLL_TOP]: scrollTop,
      [S_SCROLL_TOP_FRACTION]: scrollTopFraction,
      [S_SCROLL_LEFT]: scrollLeft,
      [S_SCROLL_LEFT_FRACTION]: scrollLeftFraction
    };
  };
  const setScrollCssProps = (element, scrollData) => {
    let prefix = "";
    if (element === tryGetMainScrollableElement()) {
      // Set the CSS vars on the root element
      element = getDocElement();
      prefix = "page-";
    }
    scrollData !== null && scrollData !== void 0 ? scrollData : scrollData = {};
    const props = {
      [S_SCROLL_TOP]: scrollData[S_SCROLL_TOP],
      [S_SCROLL_TOP_FRACTION]: scrollData[S_SCROLL_TOP_FRACTION],
      [S_SCROLL_LEFT]: scrollData[S_SCROLL_LEFT],
      [S_SCROLL_LEFT_FRACTION]: scrollData[S_SCROLL_LEFT_FRACTION],
      [S_SCROLL_WIDTH]: scrollData[S_SCROLL_WIDTH],
      [S_SCROLL_HEIGHT]: scrollData[S_SCROLL_HEIGHT]
    };
    setNumericStyleJsVars(element, props, {
      _prefix: prefix
    });
  };
  const getEventTarget = element => {
    if (element === getDocScrollingElement()) {
      return getDoc();
    }
    return element;
  };
  const invokeCallback$1 = (callback, element, scrollData) => callback.invoke(element, copyObject(scrollData)).catch(logError);

  /**
   * @module Utils
   */


  /**
   * Returns true if the given string is a valid {@link ScrollOffset}.
   *
   * @category Validation
   */
  const isValidScrollOffset = offset => offset.match(OFFSET_REGEX) !== null;

  /**
   * Returns true if the given string is a valid "view".
   *
   * @category Validation
   */
  const isValidView = view => includes(VIEWS, view);

  /**
   * Returns true if the given string or array is a list of valid views.
   *
   * @category Validation
   */
  const isValidViewList = views => isValidStrList(views, isValidView, false);

  /**
   * Returns the views that are opposite to the given set of views.
   *
   * Above and below are opposites, and so are left and right.
   *
   * "at" is a special case. It is considered opposite to any view in the sense
   * that if it is not present in `views` it will always be included in the
   * returned array. However it is not "strongly" opposite in the sense that it
   * will not cause other views to be included in the result unless it is the
   * only view in `views`. That is, there are two sets of strongly opposite pairs
   * ("above"/"below" and "left"/"right") and at least one of the two opposing
   * views of a pair must be present for the other one to be included, _except in
   * the special case of `views` being "at"_. See examples below for
   * clarification.
   *
   * **Note** that the order of the returned array is not defined.
   *
   * @example
   * Returns ["above", "below", "left", "right"] (not definite order), since
   * "at" is the only view present and is opposite to all:
   *
   * ```javascript
   * getOppositeViews("at"); // -> ["above", "below", "left", "right"] (not necessarily in this order)
   * ```
   *
   * @example
   * Returns ["below"]. "left" and "right" are NOT included even though "at" is
   * given, because at least one of the two opposing views of a pair must be
   * present for the other one to be included (except in the special case of
   * `views` being "at").
   *
   * ```javascript
   * getOppositeViews("at,above"); // -> ["below"]
   * ```
   *
   * @example
   * ```javascript
   * getOppositeViews("above"); // -> ["at", "below"] (not necessarily in this order)
   * ```
   *
   * @example
   * ```javascript
   * getOppositeViews("above,below"); // -> ["at"]
   * ```
   *
   * @example
   * ```javascript
   * getOppositeViews("at,above,below"); // -> []
   * ```
   *
   * @example
   * ```javascript
   * getOppositeViews("above,right"); // -> ["at", "below", "left"] (not necessarily in this order)
   * ```
   *
   * @example
   * ```javascript
   * getOppositeViews("at,above,right"); // -> ["below", "left"] (not necessarily in this order)
   * ```
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the given view is not valid, including if it's empty "".
   *
   * @category Views
   */
  const getOppositeViews = views => {
    if (!views) {
      throw usageError("'views' cannot be empty");
    }
    const bitmask = getViewsBitmask(views);
    let oppositeBitmask = VIEWS_SPACE.bitmask & ~bitmask; // initial, all not present in bitmask

    // If the given view is "at", then include all the other ones.
    // Otherwise include only the opposite views of those directional
    // (above/below/left/right) that are present. I.e. if neither left not right
    // is given, then don't include them
    if (bitmask !== VIEWS_SPACE.bit.at) {
      // remove the opposite ones to those not present
      if (!(bitmask & VIEWS_SPACE.bit.above)) {
        oppositeBitmask &= ~VIEWS_SPACE.bit.below;
      }
      if (!(bitmask & VIEWS_SPACE.bit.below)) {
        oppositeBitmask &= ~VIEWS_SPACE.bit.above;
      }
      if (!(bitmask & VIEWS_SPACE.bit.left)) {
        oppositeBitmask &= ~VIEWS_SPACE.bit.right;
      }
      if (!(bitmask & VIEWS_SPACE.bit.right)) {
        oppositeBitmask &= ~VIEWS_SPACE.bit.left;
      }
    }
    return getViewsFromBitmask(oppositeBitmask);
  };

  /**
   * @ignore
   * @internal
   */
  const getViewsBitmask = viewsStr => {
    let viewsBitmask = 0;
    const views = validateStrList("views", viewsStr, isValidView);
    if (views) {
      for (const v of views) {
        if (!isValidView(v)) {
          throw usageError(`Unknown view '${v}'`);
        }
        viewsBitmask |= VIEWS_SPACE.bit[v];
      }
    } else {
      viewsBitmask = VIEWS_SPACE.bitmask; // default: all
    }
    return viewsBitmask;
  };

  /**
   * @ignore
   * @internal
   */
  const parseScrollOffset = input => {
    const match = input.match(OFFSET_REGEX);
    if (!match) {
      throw usageError(`Invalid offset: '${input}'`);
    }
    const reference = match[1];
    const value = match[2];
    /* istanbul ignore next */ // shouldn't happen
    if (!reference || !value) {
      throw bugError("Offset regex: blank capture groups");
    }
    return {
      reference,
      value
    };
  };
  const VIEWS = [S_AT, S_ABOVE, S_BELOW, S_LEFT, S_RIGHT];

  /**
   * @ignore
   * @internal
   */
  const VIEWS_SPACE = createBitSpace(newBitSpaces(), ...VIEWS);

  // --------------------

  // Don't use capture groups for old browser support
  const OFFSET_REGEX = RegExp("(top|bottom|left|right): *([^ ].+)");
  const getViewsFromBitmask = bitmask => {
    const views = [];
    for (let bit = VIEWS_SPACE.start; bit <= VIEWS_SPACE.end; bit++) {
      const value = 1 << bit;
      if (bitmask & value) {
        const name = VIEWS_SPACE.nameOf(value);
        if (name) {
          views.push(name);
        }
      }
    }
    return views;
  };

  /**
   * @module Modules/XIntersectionObserver
   */

  /**
   * {@link XIntersectionObserver} is an extension of
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver | IntersectionObserver}
   * with added capabilities:
   * - can skip the initial callback that happens shortly after setting up via
   *   {@link observeLater}
   */
  class XIntersectionObserver {
    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root | IntersectionObserver:root}.
     */

    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin | IntersectionObserver:rootMargin}.
     */

    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds | IntersectionObserver:thresholds}.
     */

    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/observe | IntersectionObserver:observe} except it accepts multiple
     * targets.
     */

    /**
     * Like {@link observe} but it ignores the initial almost immediate callback
     * and only calls the callback on a subsequent intersection change.
     */

    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/unobserve | IntersectionObserver:unobserve} except it accepts multiple
     * targets.
     */

    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/disconnect | IntersectionObserver:disconnect}.
     */

    /**
     * Like `IntersectionObserver.takeRecords`.
     */

    constructor(callback, observeOptions) {
      let observedTargets = newWeakSet();
      const targetsToSkip = newWeakSet();
      const intersectionHandler = entries => {
        const selectedEntries = [];
        for (const entry of entries) {
          if (targetsToSkip.has(targetOf(entry))) {
            deleteKey(targetsToSkip, targetOf(entry));
            continue;
          }
          selectedEntries.push(entry);
        }
        if (lengthOf(selectedEntries)) {
          callback(selectedEntries, this);
        }
      };
      const observer = newIntersectionObserver(intersectionHandler, observeOptions);
      defineProperty(this, "root", {
        get: () => observer.root
      });
      defineProperty(this, "rootMargin", {
        get: () => observer.rootMargin
      });
      defineProperty(this, "thresholds", {
        get: () => observer.thresholds
      });
      this.observe = (...targets) => {
        for (const target of targets) {
          observedTargets.add(target);
          observer.observe(target);
        }
      };
      this.observeLater = (...targets) => {
        for (const target of targets) {
          // Only skip them if not already observed, otherwise the initial
          // (almost) immediate callback won't happen anyway.
          if (observedTargets.has(target)) {
            continue;
          }
          targetsToSkip.add(target);
          this.observe(target);
        }
      };
      this.unobserve = (...targets) => {
        for (const target of targets) {
          deleteKey(observedTargets, target);
          observer.unobserve(target);
        }
      };
      this.disconnect = () => {
        observedTargets = newWeakSet();
        observer.disconnect();
      };
      this.takeRecords = () => observer.takeRecords();
    }
  }

  /**
   * @module Watchers/ViewWatcher
   */


  /**
   * {@link ViewWatcher} monitors the position of a given target relative to the
   * given {@link ViewWatcherConfig.root | root} or the viewport.
   *
   * It's built on top of
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver | IntersectionObserver}.
   *
   * It manages registered callbacks globally and reuses IntersectionObservers
   * for more efficient performance.
   */
  class ViewWatcher {
    /**
     * Call the given handler whenever the {@link ViewWatcherConfig.root | root}'s
     * view relative to the target position changes, i.e. when the target enters
     * or leaves the root.
     *
     * Unless {@link OnViewOptions.skipInitial} is true, the handler is also
     * called (almost) immediately with the current view if it matches this
     * set of options*.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same target, even if the options differ. If the handler has already been
     * added for this target, either using {@link trackView} or using
     * {@link onView}, then it will be removed and re-added with the current
     * options. So if previously it was also tracking position across root
     * using {@link trackView}, it will no longer do so.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target or the options are invalid.
     */

    /**
     * Removes a previously added handler.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target is invalid.
     */

    /**
     * This does more than just {@link onView}. The difference is that in
     * addition to a change of {@link View}, such as the target entering or
     * leaving the ViewWatcher's {@link ViewWatcherConfig.root | root} (by
     * default the viewport), the handler is also called each time the target's
     * relative view changes _while inside the root_.
     *
     * A change of relative position happens when:
     * - the target is resized
     * - the root is resized
     * - the any of the target's scrollable ancestors is scrolled
     * - the target's attributes changed that resulted in a change of position
     *
     * All of the above are accounted for. Internally it uses
     * {@link ScrollWatcher}, {@link DOMWatcher} and {@link SizeWatcher} to keep
     * track of all of this.
     *
     * If the target is leaves the ViewWatcher's
     * {@link ViewWatcherConfig.root | root}, the handler will be called with
     * the {@link ViewData}, and the above events will stop being tracked until
     * the target enters the watcher's root again.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times for the
     * same target, even if the options differ. If the handler has already been
     * added for this target, either using {@link trackView} or using
     * {@link onView}, then it will be removed and re-added with the current
     * options.
     *
     * ------
     *
     * If `handler` is not given, then it defaults to an internal handler that
     * updates the following set of CSS variables on the target's style and
     * represent its relative position:
     *
     * - `--lisn-js--r-top`
     * - `--lisn-js--r-bottom`
     * - `--lisn-js--r-left`
     * - `--lisn-js--r-right`
     * - `--lisn-js--r-width`
     * - `--lisn-js--r-height`
     * - `--lisn-js--r-h-middle`
     * - `--lisn-js--r-v-middle`
     *
     * See {@link ViewData.relative} for an explanation of each.
     *
     * Note that only Element targets are supported here and not offsets.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target or "views" are invalid.
     */

    /**
     * Removes a previously added handler for {@link trackView}.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the target is invalid.
     */

    /**
     * Get the current view relative to the target. By default, it will
     * {@link waitForMeasureTime} and so will be delayed by one frame.
     *
     * @param realtime If true, it will not {@link waitForMeasureTime}. Use
     *                 this only when doing realtime scroll-based animations
     *                 as it may cause a forced layout.
     */

    /**
     * Creates a new instance of ViewWatcher with the given
     * {@link ViewWatcherConfig}. It does not save it for future reuse.
     */
    static create(config) {
      return new ViewWatcher(getConfig(config), CONSTRUCTOR_KEY);
    }

    /**
     * Returns an existing  instance of ViewWatcher with the given
     * {@link ViewWatcherConfig}, or creates a new one.
     *
     * **NOTE:** It saves it for future reuse, so don't use this for temporary
     * short-lived watchers.
     */
    static reuse(config) {
      var _instances$get;
      const myConfig = getConfig(config);
      const configStrKey = objToStrKey(omitKeys(myConfig, {
        _root: null
      }));
      let instance = (_instances$get = instances$2.get(myConfig._root)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(configStrKey);
      if (!instance) {
        instance = new ViewWatcher(myConfig, CONSTRUCTOR_KEY);
        instances$2.sGet(myConfig._root).set(configStrKey, instance);
      }
      return instance;
    }
    constructor(config, key) {
      if (key !== CONSTRUCTOR_KEY) {
        throw illegalConstructorError("ViewWatcher.create");
      }
      const logger = result ? new result.Logger({
        name: "ViewWatcher",
        logAtCreation: config
      }) : null;
      const allViewData = newWeakMap();
      const allCallbacks = newXWeakMap(() => newMap());
      const intersectionHandler = entries => {
        logger === null || logger === void 0 || logger.debug9(`Got ${entries.length} new entries`, entries);
        for (const entry of entries) {
          processEntry(entry);
        }
      };
      const observeOptions = {
        root: config._root,
        threshold: config._threshold,
        rootMargin: config._rootMargin
      };
      const xObserver = new XIntersectionObserver(intersectionHandler, observeOptions);

      // ----------

      const fetchCurrentView = (element, realtime = false) => {
        const fetchData = async entryOrElement => {
          const intersection = await fetchIntersectionData(config, entryOrElement, realtime);
          const data = await fetchViewData(intersection, realtime);
          return data;
        };
        if (realtime) {
          return fetchData(element);
        }
        return newPromise(resolve => {
          // Use a temp IntersectionObserver
          const observer = newIntersectionObserver(entries => {
            const promise = fetchData(entries[0]);
            observer.disconnect();
            promise.then(resolve);
          }, observeOptions);
          observer.observe(element);
        });
      };

      // ----------

      const createCallback = (handler, options, trackType) => {
        var _allCallbacks$get;
        const element = options._element;
        remove((_allCallbacks$get = allCallbacks.get(element)) === null || _allCallbacks$get === void 0 || (_allCallbacks$get = _allCallbacks$get.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
        logger === null || logger === void 0 || logger.debug5("Adding/updating handler", options);
        const callback = wrapCallback(handler);
        callback.onRemove(() => {
          deleteHandler(handler, options);
        });
        allCallbacks.sGet(element).set(handler, {
          _callback: callback,
          _trackType: trackType,
          _options: options
        });
        return callback;
      };

      // ----------

      const setupOnView = async (target, handler, userOptions, trackType) => {
        const options = await fetchOptions(config._root, target, userOptions);
        const element = options._element;
        const callback = createCallback(handler, options, trackType);

        // View watcher should be used before the DOM is loaded since the initial
        // size of the root may be 0 or close to 0 and would lead to premature
        // triggering.
        await waitForInteractive();

        // Initial call doesn't need to be realtime, and best to use an actual
        // IntersectionObserverEntry for that one.
        let viewData = await fetchCurrentView(element);
        if (viewData.rootBounds[S_WIDTH] === 0 && viewData.rootBounds[S_HEIGHT] === 0) {
          // Possibly the root is being setup now, wait for one AF
          logger === null || logger === void 0 || logger.debug5("Got zero root size, deferring for a bit", config._root);
          await waitForSubsequentMeasureTime();
          viewData = await fetchCurrentView(element);
        }
        if (trackType === TRACK_FULL) {
          // Detect resize or scroll
          await setupInviewTrack(options, callback, viewData);
        }
        if (callback.isRemoved()) {
          return;
        }

        // Always use observeLater to skip the initial call from the
        // IntersectionObserver, and call callbacks that have skipInitial: false
        // here. Otherwise, we can't tell from inside the intersectionHandler whether
        // a callback wants to skip its initial call or not.
        //
        // It's ok if already observed, won't do anything.
        xObserver.observeLater(element);
        if (!(userOptions !== null && userOptions !== void 0 && userOptions.skipInitial)) {
          logger === null || logger === void 0 || logger.debug5("Calling initially with", element, viewData);
          if (viewsToBitmask(viewData.views) & options._viewsBitmask) {
            await invokeCallback(callback, element, viewData);
          }
        }
      };

      // ----------

      const removeOnView = async (target, handler, trackType) => {
        var _allCallbacks$get2;
        // For time sync, so that if called immediately after onView without
        // awaiting, it will remove the callback that is about to be added.
        // But if no such handler has been added we may unnecessarily
        // create an overlay... TODO
        const options = await fetchOptions(config._root, target, {});
        const element = options._element;
        const currEntry = (_allCallbacks$get2 = allCallbacks.get(element)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2.get(handler);
        if ((currEntry === null || currEntry === void 0 ? void 0 : currEntry._trackType) === trackType) {
          remove(currEntry._callback);
          if (handler === setViewCssProps) {
            // delete the properties
            setViewCssProps(element, null);
          }
        }
      };

      // ----------

      const deleteHandler = (handler, options) => {
        const element = options._element;
        deleteKey(allCallbacks.get(element), handler);
        allCallbacks.prune(element);
        if (!allCallbacks.has(element)) {
          logger === null || logger === void 0 || logger.debug4("No more callbacks for target; unobserving", element);
          xObserver.unobserve(element);
          deleteKey(allViewData, element);
        }
      };

      // ----------

      const processEntry = async entry => {
        // In reality, it can't be just a base Element
        const element = targetOf(entry);

        // This doesn't need to be "realtime", since IntersectionObserver alone
        // introduces a delay.
        const intersection = await fetchIntersectionData(config, entry);
        const latestData = await fetchViewData(intersection);
        logger === null || logger === void 0 || logger.debug9("Got ViewData", element, latestData);
        const viewsBitmask = viewsToBitmask(latestData.views);
        for (const entry of ((_allCallbacks$get3 = allCallbacks.get(element)) === null || _allCallbacks$get3 === void 0 ? void 0 : _allCallbacks$get3.values()) || []) {
          var _allCallbacks$get3;
          if (viewsBitmask & entry._options._viewsBitmask) {
            invokeCallback(entry._callback, element, latestData);
          }
        }
      };

      // ----------

      const setupInviewTrack = async (options, viewCallback, viewData) => {
        const element = options._element;
        logger === null || logger === void 0 || logger.debug8("Setting up size, scroll and attribute tracking", element);
        const sizeWatcher = SizeWatcher.reuse();
        const scrollWatcher = ScrollWatcher.reuse();
        const realtime = options._debounceWindow === 0;

        // Detect when target's class or style attribute change
        const domWatcher = DOMWatcher.create({
          root: element,
          // only direct children
          subtree: false
        });

        // We need to remove the tracking callback when target leaves view and re-add
        // it when it enters view. But the OnViewCallback that is associated may have
        // already been added prior, by calling onView with this handler, so we can't
        // always wrap around it, in order to detect when it's called with a change
        // of view. So we setup another OnViewCallback tied to the tracking callback.
        let isInview = false;
        let removeTrackCallback = null;

        // Finds any scrollable ancestors of the element and detect scroll on them.
        const scrollableAncestors = await fetchScrollableAncestors(element, realtime);
        if (viewCallback.isRemoved()) {
          return;
        }
        const addTrackCallback = () => {
          var _config$_root;
          const trackCallback = wrapCallback(async () => {
            const prevData = allViewData.get(element);

            // Get the latest view data for the target
            const latestData = await fetchCurrentView(element, realtime);
            logger === null || logger === void 0 || logger.debug9("Got ViewData", element, latestData);
            const changed = viewChanged(latestData, prevData);
            if (changed) {
              // When comparing for changes, we round the numbers to certain number
              // of decimal places, and allViewData serves as a "last threshold"
              // state, so only update it if there was a significant change.
              // Otherwise very quick changes in small increments would get
              // rejected as "no change".
              allViewData.set(element, latestData);
              if (isInview && !viewCallback.isRemoved()) {
                // Could have been removed during the debounce window
                await invokeCallback(viewCallback, element, latestData);
              }
            } else {
              logger === null || logger === void 0 || logger.debug9("ViewData same as last");
            }
          });

          // TODO Is there a better way to detect when it's moved?
          viewCallback.onRemove(trackCallback.remove);
          removeTrackCallback = trackCallback.remove;

          // Detect when target's class or style attribute change
          domWatcher.onMutation(trackCallback, {
            categories: [S_ATTRIBUTE],
            [S_SKIP_INITIAL]: true
          });

          // Detect when target is resized
          sizeWatcher.onResize(trackCallback, {
            target: element,
            [S_DEBOUNCE_WINDOW]: options._debounceWindow,
            threshold: options._resizeThreshold,
            [S_SKIP_INITIAL]: true
          });

          // Detect when the root is resized
          sizeWatcher.onResize(trackCallback, {
            target: (_config$_root = config._root) !== null && _config$_root !== void 0 ? _config$_root : getWindow(),
            [S_DEBOUNCE_WINDOW]: options._debounceWindow,
            threshold: options._resizeThreshold,
            [S_SKIP_INITIAL]: true
          });

          // Detect when the target's scrollable ancestors are scrolled (this
          // will almost certainly include the main scrollable element).
          for (const ancestor of scrollableAncestors) {
            scrollWatcher.onScroll(trackCallback, {
              scrollable: ancestor,
              [S_DEBOUNCE_WINDOW]: options._debounceWindow,
              threshold: options._scrollThreshold,
              [S_SKIP_INITIAL]: true
            });
          }
        };
        const enterOrLeaveCallback = createCallback((target__ignored, viewData) => {
          if (viewData.views[0] === S_AT) {
            if (!isInview) {
              isInview = true;
              addTrackCallback();
            }
          } else if (removeTrackCallback) {
            isInview = false;
            removeTrackCallback();
            removeTrackCallback = null;
          }
        }, assign(options, {
          _viewsBitmask: VIEWS_SPACE.bitmask
        }), TRACK_REGULAR);
        viewCallback.onRemove(enterOrLeaveCallback.remove);
        allViewData.set(element, viewData); // to avoid duplicate initial call
        // Setup the track and the "inView" state
        if (!enterOrLeaveCallback.isRemoved()) {
          invokeCallback(enterOrLeaveCallback, element, viewData);
        }
      };

      // ----------

      this.fetchCurrentView = (target, realtime = false) => fetchElement(config._root, target).then(element => fetchCurrentView(element, realtime));

      // ----------

      this.trackView = (element, handler, options) => {
        if (!handler) {
          handler = setViewCssProps;
        }
        return setupOnView(element, handler, options, TRACK_FULL);
      };

      // ----------

      this.noTrackView = (element, handler) => {
        if (!handler) {
          handler = setViewCssProps;
        }
        removeOnView(element, handler, TRACK_FULL); // no need to await
      };

      // ----------

      this.onView = (target, handler, options) => setupOnView(target, handler, options, TRACK_REGULAR);

      // ----------

      this.offView = (target, handler) => removeOnView(target, handler, TRACK_REGULAR); // no need to await
    }
  }

  /**
   * @interface
   */

  /**
   * @interface
   */

  /**
   * @interface
   */

  /**
   * The handler is invoked with two arguments:
   *
   * - The element that is the target of the IntersectionObserver. If the call to
   *   {@link ViewWatcher.onView} specified an element as the target, it will be
   *   the same. If it specified an offset, then the element passed to the
   *   callback will be an absolutely positioned trigger overlay that's created
   *   as a result.
   * - the {@link ViewData} for relative to the target
   */

  // ----------------------------------------

  const CONSTRUCTOR_KEY = SYMBOL();
  const instances$2 = newXMap(() => newMap());
  const getConfig = config => {
    var _config$root, _config$rootMargin, _config$threshold;
    return {
      _root: (_config$root = config === null || config === void 0 ? void 0 : config.root) !== null && _config$root !== void 0 ? _config$root : null,
      _rootMargin: (_config$rootMargin = config === null || config === void 0 ? void 0 : config.rootMargin) !== null && _config$rootMargin !== void 0 ? _config$rootMargin : "0px 0px 0px 0px",
      _threshold: (_config$threshold = config === null || config === void 0 ? void 0 : config.threshold) !== null && _config$threshold !== void 0 ? _config$threshold : 0
    };
  };
  const TRACK_REGULAR = 1; // only entering/leaving root
  const TRACK_FULL = 2; // entering/leaving + moving across (fine-grained)

  // --------------------

  const fetchOptions = async (root, target, options) => {
    return {
      _element: await fetchElement(root, target),
      _viewsBitmask: getViewsBitmask(options === null || options === void 0 ? void 0 : options.views),
      _debounceWindow: options === null || options === void 0 ? void 0 : options.debounceWindow,
      _resizeThreshold: options === null || options === void 0 ? void 0 : options.resizeThreshold,
      _scrollThreshold: options === null || options === void 0 ? void 0 : options.scrollThreshold
    };
  };
  const fetchScrollableAncestors = async (element, realtime) => {
    if (!realtime) {
      await waitForMeasureTime();
    }
    const scrollableAncestors = [];
    let ancestor = element;
    while (ancestor = getClosestScrollable(ancestor, {
      active: true
    })) {
      scrollableAncestors.push(ancestor);
    }
    return scrollableAncestors;
  };
  const viewChanged = (latestData, prevData) => !prevData || viewsToBitmask(prevData.views) !== viewsToBitmask(latestData.views) || !compareValuesIn(copyBoundingRectProps(prevData.targetBounds), copyBoundingRectProps(latestData.targetBounds)) || !compareValuesIn(prevData.rootBounds, latestData.rootBounds) || !compareValuesIn(prevData.relative, latestData.relative);
  const viewsToBitmask = views => VIEWS_SPACE.bit[views[0]] | (views[1] ? VIEWS_SPACE.bit[views[1]] : 0);
  const fetchIntersectionData = async (config, entryOrTarget, realtime = false) => {
    const root = config._root;
    const vpSize = await fetchViewportSize(realtime);
    const rootMargins = toMargins(config._rootMargin, vpSize);
    let target;
    let targetBounds;
    let rootBounds = null;
    let isIntersecting = null;
    let isCrossOrigin = null;
    if (isInstanceOf(entryOrTarget, IntersectionObserverEntry)) {
      target = entryOrTarget.target;
      targetBounds = entryOrTarget.boundingClientRect;
      rootBounds = entryOrTarget.rootBounds;
      isIntersecting = entryOrTarget.isIntersecting;
      isCrossOrigin = !entryOrTarget.rootBounds;
    } else {
      target = entryOrTarget;
      targetBounds = await fetchBounds(target, realtime);
    }
    if (!rootBounds) {
      rootBounds = await fetchBounds(root, realtime, rootMargins);
    }
    return {
      _target: target,
      _targetBounds: targetBounds,
      _root: root,
      _rootMargins: rootMargins,
      _rootBounds: rootBounds,
      _isIntersecting: isIntersecting,
      _isCrossOrigin: isCrossOrigin
    };
  };
  const fetchBounds = async (root, realtime, rootMargins) => {
    let rect;
    if (root) {
      if (!realtime) {
        await waitForMeasureTime();
      }
      rect = copyBoundingRectProps(getBoundingClientRect(root));
    } else {
      const {
        width,
        height
      } = await fetchViewportSize(realtime);
      rect = {
        x: 0,
        left: 0,
        right: width,
        width,
        y: 0,
        top: 0,
        bottom: height,
        height
      };
    }
    if (rootMargins) {
      rect.x = rect[S_LEFT] -= rootMargins[3];
      rect[S_RIGHT] += rootMargins[1];
      rect[S_WIDTH] += rootMargins[1] + rootMargins[3];
      rect.y = rect[S_TOP] -= rootMargins[0];
      rect[S_BOTTOM] += rootMargins[2];
      rect[S_HEIGHT] += rootMargins[0] + rootMargins[2];
    }
    return rect;
  };
  const fetchViewData = async (intersection, realtime = false) => {
    var _intersection$_isInte;
    const vpSize = await fetchViewportSize(realtime);
    const vpHeight = vpSize[S_HEIGHT];
    const vpWidth = vpSize[S_WIDTH];
    const views = await fetchViews(intersection, realtime);
    const relative = merge({
      hMiddle: NaN,
      vMiddle: NaN
    }, copyBoundingRectProps(intersection._targetBounds));
    relative.y /= vpHeight;
    relative[S_TOP] /= vpHeight;
    relative[S_BOTTOM] /= vpHeight;
    relative[S_HEIGHT] /= vpHeight;
    relative.x /= vpWidth;
    relative[S_LEFT] /= vpWidth;
    relative[S_RIGHT] /= vpWidth;
    relative[S_WIDTH] /= vpWidth;
    relative.hMiddle = (relative[S_LEFT] + relative[S_RIGHT]) / 2;
    relative.vMiddle = (relative[S_TOP] + relative[S_BOTTOM]) / 2;
    const viewData = {
      isIntersecting: (_intersection$_isInte = intersection._isIntersecting) !== null && _intersection$_isInte !== void 0 ? _intersection$_isInte : views[0] === S_AT,
      targetBounds: intersection._targetBounds,
      rootBounds: intersection._rootBounds,
      views,
      relative
    };
    return viewData;
  };
  const fetchViews = async (intersection, realtime, useScrollingAncestor) => {
    if (intersection._isIntersecting) {
      return [S_AT];
    }
    let rootBounds;
    if (useScrollingAncestor) {
      rootBounds = await fetchBounds(useScrollingAncestor, realtime, intersection._rootMargins);
    } else {
      rootBounds = intersection._rootBounds;
    }
    const targetBounds = intersection._targetBounds;
    const delta = {
      _left: rootBounds[S_LEFT] - targetBounds[S_LEFT],
      _right: targetBounds[S_RIGHT] - rootBounds[S_RIGHT],
      _top: rootBounds[S_TOP] - targetBounds[S_TOP],
      _bottom: targetBounds[S_BOTTOM] - rootBounds[S_BOTTOM]
    };
    let xView = null;
    let yView = null;
    if (delta._left > 0 && delta._right > 0) {
      // Target is wider than root: use greater delta to determine position.
      // Remember, the view is the _root_ position relative to target.
      xView = delta._left > delta._right ? S_RIGHT : S_LEFT;
    } else if (delta._left > 0) {
      // Target is to the left of the root
      xView = S_RIGHT;
    } else if (delta._right > 0) {
      // Target is to the right of the root
      xView = S_LEFT;
    } // else target is horizontally contained in root, see below

    if (delta._top > 0 && delta._bottom > 0) {
      // Target is taller than root: use greater delta to determine position.
      // Remember, the view is the _root_ position relative to target.
      yView = delta._top > delta._bottom ? S_BELOW : S_ABOVE;
    } else if (delta._top > 0) {
      // Target is above the root
      yView = S_BELOW;
    } else if (delta._bottom > 0) {
      // Target is below the root
      yView = S_ABOVE;
    } // else target is vertically contained in root, see below

    if (xView && yView) {
      // diagonally out of vide
      return [xView, yView];
    } else if (xView) {
      // horizontally out of vide
      return [xView];
    } else if (yView) {
      // vertically out of vide
      return [yView];
    }

    // The target is contained in the root bounds and yet isIntersecting was
    // not true. This means that either:
    //
    // 1. It may be intersecting, but we didn't get an actual
    //    IntersectionObserverEntry and we don't know if it's intersecting
    //    or not
    // 2. The target is inside a scrolling element that is _not_ being used as
    //    the observer root, and the target has scrolled out of the scrollable
    //    bounds but still inside the viewport
    // 3. We're inside a cross-origin iFrame and the iFrame is partially or
    //    fully not-intersecting

    if (!intersection._isCrossOrigin) {
      // This is case 1. or 2. => get the views relative to the closest
      // scrollable ancestor relative to which it is _not_ intersecting, if
      // any. If it's nested inside several scrolling elements, we'll end up
      // looping over each one until we find the one for which the target is
      // outside its box.
      //
      // It is too risky to use active isScrollable check here since we could be
      // inside an onScroll handler, so just use passive.
      const scrollingAncestor = getClosestScrollable(useScrollingAncestor !== null && useScrollingAncestor !== void 0 ? useScrollingAncestor : intersection._target);
      if (scrollingAncestor) {
        return fetchViews(intersection, realtime, scrollingAncestor);
      }
    }

    // Either case 3. (cross-origin iframe outside the viewport) or case 1. and
    // the target is actually intersecting the root. Either way, it's to be
    // considered in-view of its root.
    return [S_AT];
  };
  const setViewCssProps = (element, viewData) => {
    var _viewData$relative;
    const relative = (_viewData$relative = viewData === null || viewData === void 0 ? void 0 : viewData.relative) !== null && _viewData$relative !== void 0 ? _viewData$relative : {};
    const props = {
      top: relative.top,
      bottom: relative.bottom,
      left: relative.left,
      right: relative.right,
      [S_WIDTH]: relative[S_WIDTH],
      [S_HEIGHT]: relative[S_HEIGHT],
      hMiddle: relative.hMiddle,
      vMiddle: relative.vMiddle
    };
    setNumericStyleJsVars(element, props, {
      _prefix: "r-",
      _numDecimal: 4
    }); // don't await here
  };
  const fetchElement = async (root, target) => {
    if (isElement(target)) {
      return target;
    } else if (!isString(target)) {
      throw usageError("'target' must be an offset string or an HTMLElement | SVGElement | MathMLElement");
    }
    const overlayOptions = getOverlayOptions(root, target);
    return await createOverlay(overlayOptions);
  };
  const getOverlayOptions = (root, target) => {
    const {
      reference,
      value
    } = parseScrollOffset(target);
    let ovrDimension;
    if (reference === S_TOP || reference === S_BOTTOM) {
      ovrDimension = S_WIDTH;
    } else if (reference === S_LEFT || reference === S_RIGHT) {
      ovrDimension = S_HEIGHT;
    } else {
      throw usageError(`Invalid offset reference: '${reference}'`);
    }
    return {
      parent: isHTMLElement(root) ? root : undefined,
      style: {
        [reference]: value,
        [ovrDimension]: "100%"
      }
    };
  };
  const invokeCallback = (callback, element, viewData) => callback.invoke(element, copyObject(viewData)).catch(logError);

  /**
   * @module
   * @ignore
   * @internal
   */

  var index$5 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    DOMWatcher: DOMWatcher,
    GestureWatcher: GestureWatcher,
    LayoutWatcher: LayoutWatcher,
    PointerWatcher: PointerWatcher,
    ScrollWatcher: ScrollWatcher,
    SizeWatcher: SizeWatcher,
    ViewWatcher: ViewWatcher
  });

  /**
   * @module
   * @ignore
   * @internal
   */

  settings.autoWidgets = true;

  /**
   * ## Specification for the HTML API for widgets
   *
   * The following describes the general syntax when using the HTML API for
   * automatic creation of widgets based on data attributes
   * ({@link Settings.settings.autoWidgets | settings.autoWidgets} must be true.
   *
   * A widget specification should be given as a
   * `data-lisn-<WidgetName>="<WidgetConfList>"` attribute.
   *
   * Alternatively, if using all default configurations, you can simply add the
   * `lisn-<WidgetName>` CSS class. Specifying a configuration using CSS classes
   * is not currently possible for widgets, only triggers.
   *
   * The general specification for a widget is of the form:
   *
   * ```
   * <WidgetConfList> ::= <WidgetConf> { ";" <WidgetConf> }
   *
   * <WidgetConf> ::= [ <WidgetOption> { "|" <WidgetOption> } ]
   *
   * <WidgetOption> ::=
   *     <BooleanOptionName> [ "=" ( "false" | "true" ) ] |
   *     <OptionName> "=" <OptionValue>
   * ```
   *
   * **NOTE:**
   *
   * There can be 0 or more spaces around any of the separator characters.
   *
   * Not all widgets support multiple instances per single element and therefore
   * multiple configurations. Refer to the specific widget.
   *
   * The characters "|", ";", "=" are reserved separators and cannot be used
   * literally as part of an option value.
   *
   * @module Widgets
   */

  class Widget {
    /**
     * Disables the functionality of the widget. What this means is specific to
     * each widget.
     */

    /**
     * Re-enables the functionality of the widget. What this means is specific to
     * each widget.
     */

    /**
     * Re-enables the widget if disabled, otherwise disables it.
     */

    /**
     * The given handler will be called when the widget is disabled.
     */

    /**
     * The given handler will be called when the widget is enabled.
     */

    /**
     * Returns true if the widget is currently disabled.
     */

    /**
     * Undoes all modifications to the element and returns it to its original state.
     *
     * You will need to recreate it if you want to enable its functionality again.
     */

    /**
     * The given handler will be called when the widget is destroyed.
     */

    /**
     * Returns true if the widget is destroyed.
     */

    /**
     * Returns the element passed to the widget constructor.
     */

    /**
     * Retrieve an existing widget by element and ID.
     */
    static get(element, id) {
      var _instances$get$get, _instances$get;
      return (_instances$get$get = (_instances$get = instances$1.get(element)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(id)) !== null && _instances$get$get !== void 0 ? _instances$get$get : null;
    }

    /**
     * **IMPORTANT:** If ID is given and there's already a widget with this ID on
     * this element, it will be destroyed!
     */
    constructor(element, config) {
      const logger = result ? new result.Logger({
        name: `${this.constructor.name}-${formatAsString(element)}`,
        logAtCreation: this
      }) : null;
      const id = config === null || config === void 0 ? void 0 : config.id;
      if (id) {
        var _instances$get2;
        (_instances$get2 = instances$1.get(element)) === null || _instances$get2 === void 0 || (_instances$get2 = _instances$get2.get(id)) === null || _instances$get2 === void 0 || _instances$get2.destroy(); // don't await here
        instances$1.sGet(element).set(id, this);
      }
      let isDisabled = false;
      let isDestroyed = false;
      let destroyPromise;
      const enableCallbacks = newSet();
      const disableCallbacks = newSet();
      const destroyCallbacks = newSet();
      this.disable = async () => {
        if (!isDisabled) {
          logger === null || logger === void 0 || logger.debug8("Disabling");
          isDisabled = true;
          for (const callback of disableCallbacks) {
            await callback.invoke(this);
          }
        }
      };
      this.enable = async () => {
        if (!isDestroyed && isDisabled) {
          logger === null || logger === void 0 || logger.debug8("Enabling");
          isDisabled = false;
          for (const callback of enableCallbacks) {
            await callback.invoke(this);
          }
        }
      };
      this.toggleEnable = async () => {
        if (!isDestroyed) {
          await (isDisabled ? this.enable : this.disable)();
        }
      };
      this.onDisable = handler => disableCallbacks.add(wrapCallback(handler));
      this.onEnable = handler => enableCallbacks.add(wrapCallback(handler));
      this.isDisabled = () => isDisabled;
      this.destroy = () => {
        if (!destroyPromise) {
          destroyPromise = (async () => {
            logger === null || logger === void 0 || logger.debug8("Destroying");
            isDestroyed = true;
            await this.disable();
            for (const callback of destroyCallbacks) {
              await callback.invoke(this);
            }
            enableCallbacks.clear();
            disableCallbacks.clear();
            destroyCallbacks.clear();
            if (id) {
              const elInstances = instances$1.get(element);
              if ((elInstances === null || elInstances === void 0 ? void 0 : elInstances.get(id)) === this) {
                deleteKey(elInstances, id);
                instances$1.prune(element);
              }
            }
          })();
        }
        return destroyPromise;
      };
      this.onDestroy = handler => destroyCallbacks.add(wrapCallback(handler));
      this.isDestroyed = () => isDestroyed;
      this.getElement = () => element;
    }
  }

  /**
   * **NOTE:** If the function returns a widget or a list of widgets created for
   * the given element, then each one will be automatically destroyed if the
   * element is removed from the DOM.
   */

  /**
   * @see {@link getWidgetConfig}.
   */

  /**
   * @see {@link getWidgetConfig}.
   */

  /**
   * @see {@link getWidgetConfig}.
   */

  /**
   * @see {@link getWidgetConfig}.
   */

  /**
   * Enables automatic setting up of a widget from an elements matching the given
   * selector.
   *
   * If {@link settings.autoWidgets} is true, nothing is done. Otherwise,
   * when an element matching the selector is added to the DOM, `newWidget` will
   * be called and it's expected to setup the widget.
   *
   * **IMPORTANT:** The widget that is returned by `newWidget` will be
   * automatically destroyed when the element that created them is removed from
   * the DOM.
   *
   * **IMPORTANT:** If a widget by that name is already registered, the current
   * call does nothing, even if the remaining arguments differ.
   *
   * @param name      The name of the widget. Should be in kebab-case.
   * @param newWidget Called for every element matching the widget selector.
   * @param configValidator
   *                  A validator object, or a function that returns such an
   *                  object, for all options supported by the widget. If
   *                  given, then the `newWidget` function will also be
   *                  passed a configuration object constructed from the
   *                  element's data attribute.
   * @param [options.selector]
   *                  The selector to match elements for. If not given, then
   *                  uses a default value of `[data-lisn-<name>], .lisn-<name>`
   * @param [options.supportsMultiple]
   *                  If true, and if `configValidator` is given, then the
   *                  value of the element's widget specific data attribute
   *                  will be split on ";" and each one parsed individually
   *                  as a configuration. Then the `newWidget` function will
   *                  be called once for each configuration.
   */
  const registerWidget = async (name, newWidget, configValidator, options) => {
    if (registeredWidgets.has(name)) {
      return;
    }
    registeredWidgets.add(name);

    // init after DOM loaded so that the settings can be configured by the user
    // straight after loading LISN.js
    await waitForInteractive();
    const prefixedName = prefixName(name);
    const selector = (options === null || options === void 0 ? void 0 : options.selector) || getDefaultWidgetSelector(prefixedName);
    if (settings.autoWidgets) {
      const domWatcher = DOMWatcher.reuse();
      domWatcher.onMutation(async operation => {
        const element = currentTargetOf(operation);
        const thisConfigValidator = isFunction(configValidator) ? await configValidator(element) : configValidator;
        const widgets = [];
        const configSpecs = [];
        const dataAttr = getData(element, prefixedName);
        if (options !== null && options !== void 0 && options.supportsMultiple) {
          if (hasClass(element, prefixedName)) {
            configSpecs.push("");
          }
          if (dataAttr !== null) {
            configSpecs.push(...(dataAttr ? splitOn(dataAttr, ";", true) : [""]));
          }
        } else {
          configSpecs.push(dataAttr !== null && dataAttr !== void 0 ? dataAttr : "");
        }
        for (const spec of configSpecs) {
          const config = thisConfigValidator ? await fetchWidgetConfig(spec, thisConfigValidator) : undefined;
          const theseWidgets = await newWidget(element, config);
          if (theseWidgets) {
            widgets.push(...toArrayIfSingle(theseWidgets));
          }
        }

        // auto-destroy on element remove
        if (lengthOf(widgets)) {
          domWatcher.onMutation(() => {
            for (const w of widgets) {
              w.destroy();
            }
          }, {
            target: element,
            categories: [S_REMOVED]
          });
        }
      }, {
        selector,
        categories: [S_ADDED]
      });
    }
  };

  /**
   * Returns a configuration object from the given user input, which can be
   * either an object or a `<separator>` separated string of key=values.
   *
   * If `input` is a string, it must be of the format:
   *
   * ```
   * <UserConfigString> ::= <OptionSpec> { <Separator> <OptionSpec> }
   *
   * <OptionSpec> ::=
   *     <BooleanOptionName> [ "=" ( "false" | "true" ) ] |
   *     <OptionName> "=" <OptionValue>
   * ```
   *
   * By default, for widgets `<separator>` is "|".
   *
   * **NOTE:** If `input` is a string, option names will be converted from
   * kebab-case to camelCase.
   *
   * The given `validator` defines the shape of the returned object. It is called
   * for each entry _in the `validator` object_, with that key and the
   * corresponding value from the input configuration, as the two parameters.
   *
   * If a key is not found in the input, the value passed to the validating
   * function will be `undefined`.
   *
   * If the input is a string and a key has no value, the value passed to the
   * validating function will be an empty string `""`.
   *
   * The final configuration contains all keys from the `validator` object with
   * the value that the validating function for each key returned.
   *
   * There are several built-in validating functions that you can make use of.
   *
   * @see {@link Utils.validateStrList}
   * @see {@link Utils.validateNumber}
   * @see {@link Utils.validateBoolean}
   * @see {@link Utils.validateString}
   * @see {@link Utils.validateBooleanOrString}
   */
  const getWidgetConfig = (input, validator, separator = "|") => {
    const config = {};
    if (!(input instanceof Object)) {
      input = toOptionsObject(input, separator);
    }
    for (const key in validator) {
      config[key] = validator[key](key, input[key]);
    }
    return config;
  };

  /**
   * Like {@link getWidgetConfig} but it accepts an object whose validator
   * functions may return a promise.
   */
  const fetchWidgetConfig = async (input, validator, separator = "|") => {
    const config = {};
    const configPromises = getWidgetConfig(input, validator, separator);
    for (const key in configPromises) {
      config[key] = await configPromises[key];
    }
    return config;
  };

  /**
   * @ignore
   * @internal
   */
  const getDefaultWidgetSelector = prefix => `.${prefix},[data-${prefix}]`;

  /**
   * @ignore
   * @internal
   */
  const fetchUniqueWidget = async (name, element, Type) => {
    let widget = Type.get(element);
    if (!widget) {
      await waitForDelay(0); // in case it's being processed now
      widget = Type.get(element);
      if (!widget) {
        logWarn(`No ${name} widget for element ${formatAsString(element)}`);
        return null;
      }
    }
    return widget;
  };
  const instances$1 = newXWeakMap(() => newMap());
  const registeredWidgets = newSet();

  // --------------------

  const toOptionsObject = (input, separator) => {
    const options = {};
    for (const entry of filter(splitOn(input !== null && input !== void 0 ? input : "", separator, true), v => !isEmpty(v))) {
      const [key, value] = splitOn(entry, /\s*=\s*/, true, 1);
      options[kebabToCamelCase(key)] = value !== null && value !== void 0 ? value : "";
    }
    return options;
  };

  /**
   * @module Actions
   */


  /**
   * @interface
   */

  /**
   * Registers the given action so that it can be parsed by
   * {@link Triggers.registerTrigger}.
   *
   * **IMPORTANT:** If an action by that name is already registered, the current
   * call does nothing, even if the remaining arguments differ.
   *
   * @param name      The name of the action. Should be in kebab-case.
   * @param newAction Called for every action specification for a trigger
   *                  parsed by {@link Triggers.registerTrigger}
   */
  const registerAction = (name, newAction, configValidator) => {
    if (registeredActions.has(name)) {
      return;
    }
    const newActionFromSpec = async (element, argsAndOptions) => {
      const thisConfigValidator = isFunction(configValidator) ? await configValidator(element) : configValidator;
      const args = [];
      const config = thisConfigValidator ? await fetchWidgetConfig(argsAndOptions, thisConfigValidator, ",") : undefined;
      for (const entry of splitOn(argsAndOptions, ",", true)) {
        if (entry) {
          if (!includes(entry, "=")) {
            args.push(entry);
          }
        }
      }
      return newAction(element, args, config);
    };
    registeredActions.set(name, newActionFromSpec);
  };

  /**
   * Returns an {@link Action} registered under the given name and instantiated
   * with the given element and arguments and options parsed from the given string.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the given spec is not valid.
   */
  const fetchAction = async (element, name, argsAndOptions) => {
    const newActionFromSpec = registeredActions.get(name);
    if (!newActionFromSpec) {
      throw usageError(`Unknown action '${name}'`);
    }
    return await newActionFromSpec(element, argsAndOptions !== null && argsAndOptions !== void 0 ? argsAndOptions : "");
  };

  // --------------------

  const registeredActions = newMap();

  /**
   * @module Actions
   *
   * @categoryDescription Adding/removing class
   * {@link AddClass} and {@link RemoveClass} add or remove a list of CSS classes
   * to/from the given element.
   */


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
  class AddClass {
    /**
     * Adds the classes given to the constructor.
     */

    /**
     * Removes the classes given to the constructor.
     */

    /**
     * Toggles each class given to the constructor.
     */

    static register() {
      registerAction("add-class", (element, classNames) => new AddClass(element, ...classNames));
    }
    constructor(element, ...classNames) {
      const {
        _add,
        _remove,
        _toggle
      } = getMethods$7(element, classNames);
      _remove(); // initial state

      this.do = _add;
      this.undo = _remove;
      this[S_TOGGLE] = _toggle;
    }
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
  class RemoveClass {
    /**
     * Removes the classes given to the constructor.
     */

    /**
     * Adds the classes given to the constructor.
     */

    /**
     * Toggles each class given to the constructor.
     */

    static register() {
      registerAction("remove-class", (element, classNames) => new RemoveClass(element, ...classNames));
    }
    constructor(element, ...classNames) {
      const {
        _add,
        _remove,
        _toggle
      } = getMethods$7(element, classNames);
      _add(); // initial state

      this.do = _remove;
      this.undo = _add;
      this[S_TOGGLE] = _toggle;
    }
  }

  // --------------------

  const getMethods$7 = (element, classNames) => {
    return {
      _add: () => addClasses(element, ...classNames),
      _remove: () => removeClasses(element, ...classNames),
      _toggle: () => toggleClasses(element, ...classNames)
    };
  };

  /**
   * @module Actions
   */

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
  class Animate {
    /**
     * (Re)plays the animations forwards.
     */

    /**
     * (Re)plays the animations backwards.
     */

    /**
     * Reverses the animations from its current direction.
     */

    static register() {
      registerAction("animate", element => new Animate(element));
    }
    constructor(element) {
      const logger = result ? new result.Logger({
        name: `Animate-${formatAsString(element)}`
      }) : null;

      // initial state is 0% and paused
      animate$1(element, GO_FORWARD, logger, true);
      let isFirst = true;
      this.do = () => animate$1(element, GO_FORWARD, logger);
      this.undo = () => animate$1(element, GO_BACKWARD, logger);
      this[S_TOGGLE] = () => {
        const res = animate$1(element, isFirst ? GO_FORWARD : GO_TOGGLE, logger);
        isFirst = false;
        return res;
      };
    }
  }

  // --------------------

  const GO_FORWARD = 0;
  const GO_BACKWARD = 1;
  const GO_TOGGLE = 2;
  const animate$1 = (element, direction, logger, isInitial = false) => {
    logger === null || logger === void 0 || logger.debug8("Animating element");
    return iterateAnimations(element, /* istanbul ignore next */ // jsdom doesn't support Web Animations
    animation => setupAnimation(animation, direction, logger, isInitial), element => setupAnimationLegacy(element, direction, logger, isInitial), isInitial);
  };

  /* istanbul ignore next */ // jsdom doesn't support Web Animations
  const setupAnimation = (animation, direction, logger, isInitial) => {
    const pauseTillReady = !isPageReady();
    const isBackward = animation.playbackRate === -1;
    logger === null || logger === void 0 || logger.debug9("Setting up animation", animation, {
      direction,
      isBackward
    });
    if (direction === GO_TOGGLE || direction === GO_FORWARD && isBackward || direction === GO_BACKWARD && !isBackward) {
      logger === null || logger === void 0 || logger.debug9("Reversing animation", animation.playState);
      animation.reverse();
    } else if (animation.playState === "paused") {
      logger === null || logger === void 0 || logger.debug9("Playing animation", animation.playState);
      animation.play();
    } else {
      logger === null || logger === void 0 || logger.debug9("Animation has played or is playing already", animation.playState);
    }
    if (isInitial || pauseTillReady) {
      logger === null || logger === void 0 || logger.debug9("Pausing animation", animation.playState);
      animation.pause();
      if (!isInitial) {
        // we were only pausing until ready
        /* istanbul ignore next */
        waitForPageReady().then(() => {
          logger === null || logger === void 0 || logger.debug9("Restarting animation", animation.playState);
          animation.play();
        });
      }
    }

    // If the element is moved (including if wrapped, such as by the ViewTrigger),
    // this will cancel CSS animations and replace them with new running ones
    if (isInstanceOf(animation, CSSAnimation)) {
      const cancelHandler = event => onAnimationCancel(event, animation, direction, logger, isInitial);
      animation.addEventListener(S_CANCEL, cancelHandler);
      animation.addEventListener("finish", () => animation.removeEventListener(S_CANCEL, cancelHandler));
    }
  };

  /* istanbul ignore next */ // jsdom doesn't support Web Animations
  const onAnimationCancel = (event, animation, direction, logger, isInitial) => {
    // setup again the new animation
    logger === null || logger === void 0 || logger.debug9("Animation cancelled, re-setting up new one");
    const target = targetOf(event);
    if (!isInstanceOf(target, Animation)) {
      return;
    }
    const effect = target.effect;
    if (!isInstanceOf(effect, KeyframeEffect)) {
      return;
    }
    for (const newAnimation of ((_MH$targetOf = targetOf(effect)) === null || _MH$targetOf === void 0 ? void 0 : _MH$targetOf.getAnimations()) || []) {
      var _MH$targetOf;
      if (isInstanceOf(newAnimation, CSSAnimation) && newAnimation.animationName === animation.animationName) {
        setupAnimation(newAnimation, direction, logger, isInitial);
        break;
      }
    }
  };
  const setupAnimationLegacy = (element, direction, logger, isInitial) => {
    const isBackward = hasClass(element, PREFIX_ANIMATE_REVERSE);
    const isPaused = hasClass(element, PREFIX_ANIMATE_PAUSE);
    const pauseTillReady = !isPageReady();
    const goBackwards = direction === GO_BACKWARD || direction === GO_TOGGLE && !isBackward;
    const doPause = isInitial || pauseTillReady;
    logger === null || logger === void 0 || logger.debug9("Setting up legacy animations", element, {
      direction,
      isBackward,
      isPaused,
      goBackwards,
      doPause
    });
    if (goBackwards === isBackward && doPause === isPaused) {
      // nothing to do
      logger === null || logger === void 0 || logger.debug9("No need to reset or pause animation");
      return;
    }
    resetCssAnimationsNow(element);
    removeClassesNow(element, PREFIX_ANIMATE_PAUSE, PREFIX_ANIMATE_REVERSE);
    addClassesNow(element, ...(goBackwards ? [PREFIX_ANIMATE_REVERSE] : []), ...(doPause ? [PREFIX_ANIMATE_PAUSE] : []));
    if (!isInitial && pauseTillReady) {
      waitForPageReady().then(() => removeClasses(element, PREFIX_ANIMATE_PAUSE));
    }
  };

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
  class AnimatePlay {
    /**
     * Resumes the animations without resetting them.
     */

    /**
     * Pauses the animations without resetting them.
     */

    /**
     * Resumes the animations if paused, otherwise pauses them.
     */

    static register() {
      registerAction("animate-play", element => new AnimatePlay(element));
    }
    constructor(element) {
      const {
        _play,
        _pause,
        _toggle
      } = getMethods$6(element);

      // initial state is 0% and paused
      animate(element, PAUSE, true);
      this.do = _play;
      this.undo = _pause;
      this[S_TOGGLE] = _toggle;
    }
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
  class AnimatePause {
    /**
     * Pauses the animations without resetting them.
     */

    /**
     * Resumes the animations without resetting them.
     */

    /**
     * Resumes the animations if paused, otherwise pauses them.
     */

    static register() {
      registerAction("animate-pause", element => new AnimatePause(element));
    }
    constructor(element) {
      const {
        _play,
        _pause,
        _toggle
      } = getMethods$6(element);

      // Initial state is playing
      _play();
      this.do = _pause;
      this.undo = _play;
      this[S_TOGGLE] = _toggle;
    }
  }

  // --------------------

  const PLAY = 0;
  const PAUSE = 1;
  const TOGGLE = 2;
  const getMethods$6 = element => {
    return {
      _play: () => animate(element, PLAY),
      _pause: () => animate(element, PAUSE),
      _toggle: () => animate(element, TOGGLE)
    };
  };
  const animate = (element, action, isInitial = false) => {
    return iterateAnimations(element, /* istanbul ignore next */ // jsdom doesn't support Web Animations
    animation => {
      const isPaused = animation.playState === "paused";
      if (action === PLAY || isPaused && action === TOGGLE) {
        animation.play();
      } else {
        animation.pause();
      }
    }, element => {
      if (isInitial) {
        resetCssAnimationsNow(element);
      }
      const isPaused = hasClass(element, PREFIX_ANIMATE_PAUSE);
      if (action === PLAY || isPaused && action === TOGGLE) {
        removeClassesNow(element, PREFIX_ANIMATE_PAUSE);
      } else {
        addClassesNow(element, PREFIX_ANIMATE_PAUSE);
      }
    }, isInitial);
  };

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
  class Display {
    /**
     * It reverts the element to its original `display` property.
     */

    /**
     * Sets `display: none` on the element.
     */

    /**
     * Displays the element if it's "undisplayed", otherwise "undisplays" it.
     */

    static register() {
      registerAction("display", element => new Display(element));
    }
    constructor(element) {
      undisplayElementNow(element); // initial state

      const {
        _display,
        _undisplay,
        _toggle
      } = getMethods$5(element);
      this.do = _display;
      this.undo = _undisplay;
      this[S_TOGGLE] = _toggle;
    }
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
  class Undisplay {
    /**
     * Sets `display: none` on the element.
     */

    /**
     * It reverts the element to its original `display` property.
     */

    /**
     * Displays the element if it's "undisplayed", otherwise "undisplays" it.
     */

    static register() {
      registerAction("undisplay", element => new Undisplay(element));
    }
    constructor(element) {
      displayElementNow(element); // initial state

      const {
        _display,
        _undisplay,
        _toggle
      } = getMethods$5(element);
      this.do = _undisplay;
      this.undo = _display;
      this[S_TOGGLE] = _toggle;
    }
  }

  // --------------------

  const getMethods$5 = element => {
    return {
      _display: async () => {
        await displayElement(element); // ignore return val
      },
      _undisplay: async () => {
        await undisplayElement(element); // ignore return val
      },
      _toggle: async () => {
        await toggleDisplayElement(element); // ignore return val
      }
    };
  };

  /**
   * @module Utils
   *
   * @categoryDescription DOM: Searching for reference elements
   * The functions allow you to find elements that match a given string
   * specification.
   */


  /**
   * Get the element that matches the given reference specification.
   *
   * The specification is of the form:
   *
   * ```
   * <FullSpec> ::=
   *     <Relation> "." <ClassName>  |
   *     <Relation> ["-" <ReferenceName>] |
   *     #<DOM_ID>
   *
   * <Relation> :==
   *     "next"  |
   *     "prev"  |
   *     "this"  |
   *     "first" |
   *     "last"
   * ```
   *
   * - `<DOM_ID>` is the unique ID of the element
   * - `<ClassName>` is a CSS class on the element
   * - `<ReferenceName>` is the value of the `data-lisn-ref` attribute on the
   *   element you are targeting. If not given, defaults to the value of the
   *   `data-lisn-ref` attribute on `thisElement`.
   *
   * There now follows an explanation of how "next", "prev", "this", "first" and
   * "last" search the DOM:
   * - "next": the tree is search in document order (depth first, then breadth),
   *   so the returned element could be a descendant of `thisElement`
   * - "prev": the tree is search in document order (depth first, then breadth),
   *   but excluding ancestors of `thisElement`, so the returned element is
   *   guaranteed to _not_ be an ancestor or descendant of `thisElement`.
   * - "this": if the given element itself matches the specification, it is
   *   returned, otherwise the closest ancestor of the given element that matches
   *   the specification
   * - "first": the first element matching; the tree is search in document order
   *   (depth first, then breadth).
   * - "last": the last element matching; the tree is search in document order
   *   (depth first, then breadth).
   *
   * @category DOM: Searching for reference elements
   *
   * @param thisElement The element to search relative to
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                        If the specification is invalid or if thisElement is
   *                        not given for a specification of "next", "prev" or "this"
   */
  const getReferenceElement = (spec, thisElement) => {
    if (!spec) {
      return thisElement;
    }
    if (spec[0] === "#") {
      // element ID
      const referenceElement = getElementById(spec.slice(1));
      if (!referenceElement) {
        return null;
      }
      return referenceElement;
    }
    const relation = ["next", "prev", "this", "first", "last"].find(p => spec.startsWith(`${p}.`) || spec.startsWith(`${p}-`) || spec === p);
    if (!relation) {
      throw usageError(`Invalid search specification '${spec}'`);
    }
    const rest = spec.slice(lengthOf(relation));
    const matchOp = rest.slice(0, 1);
    let refOrCls = rest.slice(1);
    let selector;
    if (matchOp === ".") {
      selector = matchOp + refOrCls;
    } else {
      if (!refOrCls) {
        var _getData;
        refOrCls = (_getData = getData(thisElement, PREFIX_REF)) !== null && _getData !== void 0 ? _getData : "";
      }
      if (!refOrCls) {
        throw usageError(`No reference name in '${spec}'`);
      }
      selector = `[${DATA_REF}="${refOrCls}"]`;
    }
    let referenceElement;
    if (relation === "first") {
      referenceElement = getFirstReferenceElement(selector);
    } else if (relation === "last") {
      referenceElement = getLastReferenceElement(selector);
    } else {
      if (relation === "this") {
        referenceElement = getThisReferenceElement(selector, thisElement);
      } else if (relation === "next") {
        referenceElement = getNextReferenceElement(selector, thisElement);
      } else if (relation === "prev") {
        referenceElement = getPrevReferenceElement(selector, thisElement);
      } else {
        /* istanbul ignore next */{
          logError(bugError(`Unhandled relation case ${relation}`));
          return null;
        }
      }
    }
    if (!referenceElement) {
      return null;
    }
    return referenceElement;
  };

  /**
   * Like {@link getReferenceElement} excepts if no element matches the
   * specification if will wait for at most the given time for such an element.
   *
   * @category DOM: Searching for reference elements
   */
  const waitForReferenceElement = (spec, thisElement, timeout = 200) => waitForElement(() => getReferenceElement(spec, thisElement), timeout);

  // ----------------------------------------

  const PREFIX_REF = prefixName("ref");
  const DATA_REF = prefixData(PREFIX_REF);
  const getAllReferenceElements = selector => docQuerySelectorAll(selector);
  const getFirstReferenceElement = selector => docQuerySelector(selector);
  const getLastReferenceElement = selector => {
    const allRefs = getAllReferenceElements(selector);
    return allRefs && allRefs[lengthOf(allRefs) - 1] || null;
  };
  const getThisReferenceElement = (selector, thisElement) => thisElement.closest(selector);
  const getNextReferenceElement = (selector, thisElement) => getNextOrPrevReferenceElement(selector, thisElement, false);
  const getPrevReferenceElement = (selector, thisElement) => getNextOrPrevReferenceElement(selector, thisElement, true);
  const getNextOrPrevReferenceElement = (selector, thisElement, goBackward) => {
    var _getThisReferenceElem, _allRefs$refIndex;
    thisElement = (_getThisReferenceElem = getThisReferenceElement(selector, thisElement)) !== null && _getThisReferenceElem !== void 0 ? _getThisReferenceElem : thisElement;
    if (!getDoc().contains(thisElement)) {
      return null;
    }
    const allRefs = getAllReferenceElements(selector);
    if (!allRefs) {
      return null;
    }
    const numRefs = lengthOf(allRefs);
    let refIndex = goBackward ? numRefs - 1 : -1;
    for (let i = 0; i < numRefs; i++) {
      const currentIsAfter = isNodeBAfterA(thisElement, allRefs[i]);

      // As soon as we find either the starting element or the first element
      // that follows it, stop iteration.
      // - If we're looking for the previous reference, then take the previous
      //   element in the iteration.
      // - Otherwise, if the current element in the iteration is the same as the
      //   starting one, then take either the next element in the iteration.
      //   - Otherwise, (if the current element follows the starting one, as
      //     would happen if the starting element was not in the list of matched
      //     elements, take the current element in the iteration.
      if (allRefs[i] === thisElement || currentIsAfter) {
        refIndex = i + (goBackward ? -1 : currentIsAfter ? 0 : 1);
        break;
      }
    }
    return (_allRefs$refIndex = allRefs[refIndex]) !== null && _allRefs$refIndex !== void 0 ? _allRefs$refIndex : null;
  };

  /**
   * ## Specification for the HTML API for triggers
   *
   * The following describes the general syntax when using the HTML API and
   * automatic widgets
   * ({@link Settings.settings.autoWidgets | settings.autoWidgets} is true)
   * specifically for triggers and actions.
   *
   * A trigger specification should be given as a
   * `data-lisn-on-<TriggerName>="<TriggerSpecList>"` attribute.
   * A fallback option of using a CSS class of the form
   * `lisn-on-<TriggerName>--<TriggerSpec>` is also supported but not recommended.
   *
   * The general specification for a trigger is of the form:
   *
   * ```
   * <TriggerSpecList> ::= <TriggerSpec> { ";" <TriggerSpec> }
   *
   * <TriggerSpec> ::= [ <TriggerArg> { "," <TriggerArg> } ]
   *                   "@" <ActionSpec> { "@" <ActionSpec> }
   *                   { "+" <TriggerOption> }
   *
   * <TriggerOption> ::=
   *     <BooleanOptionName> [ "=" ( "false" | "true" ) ] |
   *     <OptionName> "=" <OptionValue>
   *
   * <ActionSpec> ::= <ActionName> [ ":" <ActionArgOrOption> { "," <ActionArgOrOption> } ]
   *
   * <ActionArgOrOption> ::= <ActionArg> | <OptionName> "=" <OptionValue>
   * ```
   *
   * where `<TriggerArg>` is the particular trigger's main argument, which could
   * be required or optional (and not all triggers accept an argument). See each
   * trigger's specification for their arguments and options.
   *
   * Also refer to each action for their accepted arguments and/or options if any.
   *
   * **NOTE:**
   *
   * There can be 0 or more spaces around any of the separator characters.
   *
   * At least one action (with a preceding "@" character) is always required.
   *
   * The characters ";", ",", "=", "@", "+" and ":" are reserved separators and
   * cannot be used literally as part of an argument or option value.
   *
   * @module Triggers
   *
   * @categoryDescription Manual run
   * {@link Trigger} is the base trigger class that you can extend when building
   * custom triggers and it also registers a trigger that needs to be run
   * manually (by e.g. the {@link Actions.Run | Run} action).
   */


  /**
   * {@link Trigger} is the base trigger class that you can extend when building
   * custom triggers and it also registers a trigger that needs to be run
   * manually (by e.g. the {@link Actions.Run | Run} action).
   *
   * -------
   *
   * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
   * specification.
   *
   * @example
   * Show the element 1000ms after the first time the trigger is run.
   *
   * ```html
   * <div data-lisn-on-run="@show +once +delay=1000"></div>
   * ```
   *
   * @category Manual run
   */
  class Trigger extends Widget {
    /**
     * "Do"es all the {@link Action}s linked to the trigger.
     */

    /**
     * "Undo"es all the {@link Action}s linked to the trigger.
     */

    /**
     * "Toggle"s all the {@link Action}s linked to the trigger.
     */

    /**
     * Returns the trigger's actions.
     */

    /**
     * Returns the trigger config.
     */

    static get(element, id) {
      const instance = super.get(element, id);
      if (isInstanceOf(instance, Trigger)) {
        return instance;
      }
      return null;
    }
    static register() {
      registerTrigger("run", (element, a, actions, config) => new Trigger(element, actions, config), {});
    }

    /**
     * If no actions are supplied, nothing is done.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the config is invalid.
     */
    constructor(element, actions, config) {
      var _config$once, _config$oneWay, _config$delay, _config$doDelay, _config$undoDelay;
      super(element, config);
      const logger = result ? new result.Logger({
        name: `Trigger-${formatAsString(element)}`,
        logAtCreation: {
          actions,
          config
        }
      }) : null;
      const once = (_config$once = config === null || config === void 0 ? void 0 : config.once) !== null && _config$once !== void 0 ? _config$once : false;
      const oneWay = (_config$oneWay = config === null || config === void 0 ? void 0 : config.oneWay) !== null && _config$oneWay !== void 0 ? _config$oneWay : false;
      const delay = (_config$delay = config === null || config === void 0 ? void 0 : config.delay) !== null && _config$delay !== void 0 ? _config$delay : 0;
      const doDelay = (_config$doDelay = config === null || config === void 0 ? void 0 : config.doDelay) !== null && _config$doDelay !== void 0 ? _config$doDelay : delay;
      const undoDelay = (_config$undoDelay = config === null || config === void 0 ? void 0 : config.undoDelay) !== null && _config$undoDelay !== void 0 ? _config$undoDelay : delay;
      let lastCallId;
      // false if next should be do; true if next should be undo.
      // Used for determining delays only.
      let toggleState = false;
      const callActions = async (delay, callFn, newToggleState) => {
        if (this.isDisabled()) {
          return;
        }
        const myCallId = randId();
        lastCallId = myCallId;
        logger === null || logger === void 0 || logger.debug10(`callActions [${myCallId}] (new toggle state ${newToggleState})`, callFn);
        if (delay) {
          await waitForDelay(delay);
          if (lastCallId !== myCallId) {
            // overriden by subsequent call
            logger === null || logger === void 0 || logger.debug10(`callActions [${myCallId}]: overriden by ${lastCallId}`);
            return;
          }
        }
        for (const action of actions) {
          logger === null || logger === void 0 || logger.debug10(`callActions [${myCallId}]`, action);
          callFn(action);
        }
        toggleState = newToggleState;
        if (toggleState && once) {
          this.destroy();
        }
      };
      const run = wrapCallback(() => {
        callActions(doDelay, action => {
          action.do();
        }, true); // don't await
      });
      const reverse = wrapCallback(() => {
        if (!oneWay) {
          callActions(undoDelay, action => {
            action.undo();
          }, false); // don't await
        }
      });
      const toggle = wrapCallback(() => {
        callActions(toggleState ? undoDelay : doDelay, action => {
          action[S_TOGGLE]();
        }, !toggleState); // don't await
      });

      // ----------

      this.onDestroy(() => {
        logger === null || logger === void 0 || logger.debug5("Removing callbacks");
        remove(run);
        remove(reverse);
        remove(toggle);
      });
      this.run = run.invoke;
      this.reverse = reverse.invoke;
      this[S_TOGGLE] = oneWay ? run.invoke : toggle.invoke;
      this.getActions = () => [...actions]; // copy
      this.getConfig = () => copyObject(config);
    }
  }

  /**
   * @interface
   */

  /**
   * Registers the given trigger as a widget to be automatically configured for
   * all elements that have a trigger specification with the given name.
   *
   * A trigger specification can be given as a
   * `data-lisn-on-<TriggerName>="<TriggerSpec> { ";" <TriggerSpec> }"` attribute
   * or as one or more `lisn-on-<TriggerName>--<TriggerSpec>` classes.
   *
   * See the top of the {@link Triggers} page for an explanation of `<TriggerSpec>`.
   *
   * Using classes instead of attributes is not recommended and only available as
   * a fallback option.
   *
   * **IMPORTANT:** If a trigger by that name is already registered, the current
   * call does nothing, even if the remaining arguments differ.
   *
   * @param name       The name of the trigger. Should be in kebab-case.
   * @param newTrigger Called for every trigger specification on any element
   *                   that has one or more trigger specifications.
   * @param configValidator
   *                   A validator object, or a function that returns such an
   *                   object, for all options that are specific to the
   *                   trigger. Base options (in {@link TriggerConfig}) will
   *                   be parsed automatically and don't need to be handled by
   *                   `configValidator`.
   *                   If the parameter is a function, it will be called with
   *                   the element on which the trigger is being defined.
   *
   * @see {@link registerWidget}
   */
  const registerTrigger = (name, newTrigger, configValidator) => {
    const clsPref = prefixName(`on-${name}`);
    const newWidget = async element => {
      var _getData;
      const widgets = [];
      const baseConfigValidator = newBaseConfigValidator(element);
      const thisConfigValidator = isFunction(configValidator) ? await configValidator(element) : configValidator;
      const allSpecs = splitOn((_getData = getData(element, prefixName(`on-${name}`))) !== null && _getData !== void 0 ? _getData : "", TRIGGER_SEP, true);
      for (const cls of classList(element)) {
        if (cls.startsWith(`${clsPref}--`)) {
          allSpecs.push(cls.slice(lengthOf(clsPref) + 2));
        }
      }
      for (const spec of allSpecs) {
        var _config$actOn;
        const [tmp, configSpec] = splitOn(spec, OPTION_PREF_CHAR, true, 1);
        const [argSpec, allActionSpecs] = splitOn(tmp, ACTION_PREF_CHAR, true, 1);
        const args = filterBlank(splitOn(argSpec, ",", true)) || [];
        const config = await fetchWidgetConfig(configSpec, assign(baseConfigValidator, thisConfigValidator), OPTION_PREF_CHAR);
        const actionTarget = (_config$actOn = config.actOn) !== null && _config$actOn !== void 0 ? _config$actOn : element;
        const actions = [];
        for (const actionSpec of splitOn(allActionSpecs !== null && allActionSpecs !== void 0 ? allActionSpecs : "", ACTION_PREF_CHAR, true)) {
          const [name, actionArgsAndOptions] = splitOn(actionSpec, ACTION_ARGS_PREF_CHAR, true, 1);
          try {
            actions.push(await fetchAction(actionTarget, name, actionArgsAndOptions !== null && actionArgsAndOptions !== void 0 ? actionArgsAndOptions : ""));
          } catch (err) {
            if (isInstanceOf(err, LisnUsageError)) {
              // fetchAction would have logged an error
              continue;
            }
            throw err;
          }
        }
        widgets.push(await newTrigger(element, args, actions, config));
      }
      return widgets;
    };
    registerWidget(name, newWidget, null, {
      selector: `[class^="${clsPref}--"],[class*=" ${clsPref}--"],[data-${clsPref}]`
    });
  };

  // --------------------

  const TRIGGER_SEP = ";";
  const OPTION_PREF_CHAR = "+";
  const ACTION_PREF_CHAR = "@";
  const ACTION_ARGS_PREF_CHAR = ":";
  const newBaseConfigValidator = element => {
    return {
      id: validateString,
      once: validateBoolean,
      oneWay: validateBoolean,
      delay: validateNumber,
      doDelay: validateNumber,
      undoDelay: validateNumber,
      actOn: (key, value) => {
        var _ref;
        return (_ref = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
      }
    };
  };

  /**
   * @module Actions
   *
   * @categoryDescription Controlling triggers
   * {@link Enable} and {@link Disable} enable or disable a list of triggers
   * defined on the given element.
   *
   * {@link Run} runs or reverses a list of triggers defined on the given
   * element.
   */


  /**
   * Enables or disables a list of triggers defined on the given element.
   *
   * **IMPORTANT:** When constructed, it disables all given triggers as a form of
   * initialization.
   *
   * -------
   *
   * To use with auto-widgets (HTML API) as part of a trigger specification:
   *   - Action name: "enable".
   *   - Accepted string arguments: one or more unique IDs of triggers defined on
   *     the given element
   *
   * @example
   * ```html
   * <button id="btn">Enable/disable</button>
   * <button data-lisn-on-click="
   *         @enable=triggerA,triggerB +target=#btn
   *         @add-class=clsA +id=triggerA
   *      "
   *      data-lisn-on-click="@add-class=clsB +id=triggerB"
   * ></button>
   * ```
   *
   * @category Controlling triggers
   */
  class Enable {
    /**
     * Enables the triggers with IDs given to the constructor.
     */

    /**
     * Disables the triggers with IDs given to the constructor.
     */

    /**
     * Toggles the enabled state on each trigger given to the constructor.
     */

    static register() {
      registerAction("enable", (element, ids) => new Enable(element, ...ids));
    }
    constructor(element, ...ids) {
      const {
        _enable,
        _disable,
        _toggleEnable
      } = getMethods$4(element, ids);
      _disable(); // initial state

      this.do = _enable;
      this.undo = _disable;
      this[S_TOGGLE] = _toggleEnable;
    }
  }

  /**
   * Disables or enables a list of triggers defined on the given element.
   *
   * **IMPORTANT:** When constructed, it enables all given triggers as a form of
   * initialization.
   *
   * -------
   *
   * To use with auto-widgets (HTML API) as part of a trigger specification:
   *   - Action name: "disable".
   *   - Accepted string arguments: one or more unique IDs of triggers defined on
   *     the given element
   *
   * @example
   * ```html
   * <button id="btn">Enable/disable</button>
   * <button data-lisn-on-click="
   *         @disable=triggerA,triggerB +target=#btn
   *         @add-class=clsA +id=triggerA
   *      "
   *      data-lisn-on-click="@add-class=clsB +id=triggerB"
   * ></button>
   * ```
   *
   * @category Controlling triggers
   */
  class Disable {
    /**
     * Disables the triggers with IDs given to the constructor.
     */

    /**
     * Enables the triggers with IDs given to the constructor.
     */

    /**
     * Toggles the enabled state on each trigger given to the constructor.
     */

    static register() {
      registerAction("disable", (element, ids) => new Disable(element, ...ids));
    }
    constructor(element, ...ids) {
      const {
        _enable,
        _disable,
        _toggleEnable
      } = getMethods$4(element, ids);
      _enable(); // initial state

      this.do = _disable;
      this.undo = _enable;
      this[S_TOGGLE] = _toggleEnable;
    }
  }

  /**
   * Runs or reverses a list of triggers defined on the given element.
   *
   * -------
   *
   * To use with auto-widgets (HTML API) as part of a trigger specification:
   *   - Action name: "run".
   *   - Accepted string arguments: one or more unique IDs of triggers defined on
   *     the given element
   *
   * @example
   * ```html
   * <button data-lisn-on-click="
   *         @run=triggerA,triggerB
   *         @add-class=clsA +id=triggerA
   *      "
   *      data-lisn-on-run="@add-class=clsB +id=triggerB"
   * ></button>
   * ```
   *
   * @category Controlling triggers
   */
  class Run {
    /**
     * Runs the triggers with IDs given to the constructor.
     */

    /**
     * Reverses the triggers with IDs given to the constructor.
     */

    /**
     * Toggles the triggers with IDs given to the constructor.
     */

    static register() {
      registerAction("run", (element, ids) => new Run(element, ...ids));
    }
    constructor(element, ...ids) {
      const {
        _run,
        _reverse,
        _toggle
      } = getMethods$4(element, ids);
      this.do = _run;
      this.undo = _reverse;
      this[S_TOGGLE] = _toggle;
    }
  }

  // --------------------

  const getMethods$4 = (element, ids) => {
    const triggerPromises = getTriggers(element, ids);
    const call = async method => {
      const triggers = await triggerPromises;
      for (const trigger of triggers) {
        trigger[method]();
      }
    };
    return {
      _enable: () => call("enable"),
      _disable: () => call("disable"),
      _toggleEnable: () => call("toggleEnable"),
      _run: () => call("run"),
      _reverse: () => call("reverse"),
      _toggle: () => call(S_TOGGLE)
    };
  };
  const getTriggers = async (element, ids) => {
    const triggers = [];
    if (!lengthOf(ids)) {
      logWarn("At least 1 ID is required for enable action");
      return triggers;
    }
    for (const id of ids) {
      let trigger = Trigger.get(element, id);
      if (!trigger) {
        await waitForDelay(0); // in case it's being processed now
        trigger = Trigger.get(element, id);
        if (!trigger) {
          logWarn(`No trigger with ID ${id} for element ${formatAsString(element)}`);
          continue;
        }
      }
      triggers.push(trigger);
    }
    return triggers;
  };

  /**
   * @module Actions
   *
   * @categoryDescription Scrolling
   * {@link ScrollTo} scrolls to the given element or to the previous scroll
   * position.
   */

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
  class ScrollTo {
    /**
     * Scrolls the main scrolling element to the element's position.
     */

    /**
     * Scrolls the main scrolling element to the last scroll position before the
     * action was {@link do}ne. If the action had never been done, does nothing.
     */

    /**
     * Scrolls the main scrolling element to the element's position, if it's not
     * already there, or otherwise scrolls the main scrolling element to the
     * previous saved scroll position.
     */

    static register() {
      registerAction("scroll-to", (element, args, config) => {
        const offset = config ? {
          left: config.offsetX,
          top: config.offsetY
        } : undefined;
        return new ScrollTo(element, {
          offset,
          duration: config === null || config === void 0 ? void 0 : config.duration,
          scrollable: config === null || config === void 0 ? void 0 : config.scrollable
        });
      }, newConfigValidator$8);
    }
    constructor(element, config) {
      const watcher = ScrollWatcher.reuse();
      const {
        scrollable
      } = config !== null && config !== void 0 ? config : {};
      let prevScrollTop = -1,
        prevScrollLeft = -1;
      this.do = async () => {
        const current = await watcher.fetchCurrentScroll(scrollable);
        prevScrollTop = current[S_SCROLL_TOP];
        prevScrollLeft = current[S_SCROLL_LEFT];
        const action = await watcher.scrollTo(element, config);
        await (action === null || action === void 0 ? void 0 : action.waitFor());
      };
      this.undo = async () => {
        if (prevScrollTop !== -1) {
          const action = await watcher.scrollTo({
            top: prevScrollTop,
            left: prevScrollLeft
          }, omitKeys(config !== null && config !== void 0 ? config : {}, {
            offset: true
          }) // no offset when undoing
          );
          await (action === null || action === void 0 ? void 0 : action.waitFor());
        }
      };
      this[S_TOGGLE] = async () => {
        const start = await watcher.fetchCurrentScroll(scrollable);
        const canReverse = prevScrollTop !== -1;
        let hasReversed = false;

        // Try to scroll to the element, but if we're already close to it, then
        // reverse to previous position if any.
        const altTarget = {
          top: () => {
            hasReversed = true; // detect if we have reversed
            return prevScrollTop;
          },
          left: prevScrollLeft
        };
        const action = await watcher.scrollTo(element, merge(config, canReverse ? {
          altTarget
        } // no altOffset when reversing
        : {}));
        await (action === null || action === void 0 ? void 0 : action.waitFor());
        if (!hasReversed) {
          // We've scrolled to the element, so save the starting position as the
          // previous one.
          prevScrollTop = start[S_SCROLL_TOP];
          prevScrollLeft = start[S_SCROLL_LEFT];
        }
      };
    }
  }

  /**
   * @interface
   * @category Scrolling
   */

  // --------------------

  const newConfigValidator$8 = element => {
    return {
      offsetX: (key, value) => {
        var _validateNumber;
        return (_validateNumber = validateNumber(key, value)) !== null && _validateNumber !== void 0 ? _validateNumber : 0;
      },
      offsetY: (key, value) => {
        var _validateNumber2;
        return (_validateNumber2 = validateNumber(key, value)) !== null && _validateNumber2 !== void 0 ? _validateNumber2 : 0;
      },
      duration: (key, value) => validateNumber(key, value),
      scrollable: (key, value) => {
        var _ref;
        return (_ref = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
      }
    };
  };

  /**
   * @module Actions
   *
   * @categoryDescription Setting/deleting attributes
   * {@link SetAttribute} sets or deletes an attribute on the given element.
   */

  /**
   * Either sets or deletes an attribute, or toggles between two values of an
   * attribute, on the given element.
   *
   * **IMPORTANT:** When constructed, it sets all given attributes on the
   * element to their _OFF_ (undone) state as a form of initialization.
   *
   * -------
   *
   * To use with auto-widgets (HTML API) as part of a trigger specification:
   * - Action name: "set-attribute".
   * - Accepted string arguments: name of attribute
   * - Accepted options:
   *   - `on`: A string value for the attribute. Can be blank. Omit this option
   *     in order to have the attribute deleted when the action is done.
   *   - `off`: A string value for the attribute. Can be blank. Omit this option
   *     in order to have the attribute deleted when the action is undone.
   *
   * Note that with the HTML API you can only specify one attribute per action.
   * But of course you can add the same action multiple times per trigger. See
   * examples below.
   *
   * @example
   * This is an overview of the various combinations that you can use to set an
   * attribute to a non-empty value, a blank value or delete the attribute when
   * the action is either done or undone:
   *
   * | Specification                         | Value when done | Value when undone |
   * | ------------------------------------- | --------------- | ----------------- |
   * | @set-attr: attr, on=onVal, off=offVal | "onVal"         | "offVal"          |
   * | @set-attr: attr, on=value             | "value"         | _deleted_         |
   * | @set-attr: attr, off=value            | _deleted_       | "value"           |
   * | @set-attr: attr, on=                  | ""              | _deleted_         |
   * | @set-attr: attr, off=                 | _deleted_       | ""                |
   * | @set-attr: attr, on=value, off=       | "value"         | ""                |
   * | @set-attr: attr, on= , off=value      | ""              | "value"           |
   *
   * @example
   * This will set attribute `attrA` to `valueA-ON` and `attrB` to `valueB-ON`
   * when the element enters the viewport and set `attrA` to `valueA-OFF` and
   * `attrB` to `valueB-OFF` when it leaves the viewport.
   *
   * ```html
   * <div data-lisn-on-view="@set-attribute: attrA, on=valueA-ON, off=valueA-OFF
   *                         @set-attribute: attrB, on=valueB-ON, off=valueB-OFF"
   * ></div>
   * ```
   *
   * @example
   * This will set attribute `attr` to `value` when the element enters the
   * viewport and _delete_ the attribute when it leaves the viewport.
   *
   * ```html
   * <div data-lisn-on-view="@set-attribute: attr, on=value"></div>
   * ```
   *
   * @example
   * This will _delete_ attribute `attr` when the element enters the viewport and
   * set it to `value` when it leaves the viewport.
   *
   * ```html
   * <div data-lisn-on-view="@set-attribute: attr, off=value"></div>
   * ```
   *
   * @example
   * This will set attribute `attr` to a blank value when the element enters the
   * viewport and _delete_ the attribute when it leaves the viewport.
   *
   * ```html
   * <div data-lisn-on-view="@set-attribute: attr, on="></div>
   * ```
   *
   * @example
   * This will _delete_ attribute `attr` when the element enters the viewport and
   * set it to a blank value when it leaves the viewport.
   *
   * ```html
   * <div data-lisn-on-view="@set-attribute: attr, off="></div>
   * ```
   *
   * @example
   * This will set attribute `attr` to `value` when the element enters the
   * viewport and set it to a blank value when it leaves the viewport.
   *
   * ```html
   * <div data-lisn-on-view="@set-attribute: attr, on=value, off="></div>
   * ```
   *
   * @example
   * This will set attribute `attr` to a blank value when the element enters the
   * viewport and set it to `value` when it leaves the viewport.
   *
   * ```html
   * <div data-lisn-on-view="@set-attribute: attr, on=, off=value"></div>
   * ```
   *
   * @category Setting/deleting attributes
   */
  class SetAttribute {
    /**
     * Sets the attribute to its "ON" value, or deletes it if that value is null.
     */

    /**
     * Sets the attribute to its "OFF" value, or deletes it if that value is null.
     */

    /**
     * Toggles the attribute from its "ON" to "OFF" value or vice versa.
     */

    static register() {
      registerAction("set-attribute", (element, args, config) => {
        return new SetAttribute(element, {
          [args[0]]: config !== null && config !== void 0 ? config : {}
        });
      }, configValidator$9);
    }
    constructor(element, attributes) {
      if (!attributes) {
        throw usageError("Attributes are required");
      }
      let isOn = false;
      const setAttrs = async on => {
        isOn = on;
        await waitForMutateTime();
        for (const attr in attributes) {
          const value = attributes[attr][on ? "on" : "off"];
          const attrName = camelToKebabCase(attr);
          if (isNullish(value)) {
            delAttr(element, attrName);
          } else {
            setAttr(element, attrName, value);
          }
        }
      };
      this.do = () => setAttrs(true);
      this.undo = () => setAttrs(false);
      this[S_TOGGLE] = () => setAttrs(!isOn);
      this.undo(); // initial state
    }
  }

  /**
   * Each key in the object is an attribute name. The `on` value is set when the
   * action is done and the `off` value is set when the action is undone. To set
   * the attribute to an empty value, use an empty string. To _delete_ the
   * attribute, use `null` as the value or simply omit the relevant `on` or `off`
   * key.
   *
   * **IMPORTANT:** Attribute names in camelCase are converted to kebab-case.
   * E.g. `dataFooBar` will translate to `data-foo-bar`.
   *
   * @category Setting/deleting attributes
   */

  // --------------------

  const configValidator$9 = {
    on: validateString,
    off: validateString
  };

  /**
   * @module Actions
   */


  /**
   * Shows or hides the given element with a smooth fading transition.
   *
   * **IMPORTANT:** When constructed, it will hide the element as a form of
   * initialization.
   *
   * -------
   *
   * To use with auto-widgets (HTML API) as part of a trigger specification:
   * - Action name: "show".
   * - Accepted string arguments: none
   * - Accepted options: none
   *
   * @example
   * ```html
   * <button id="btn">Show/hide</button>
   * <div data-lisn-on-click="@show +target=#btn"></div>
   * ```
   *
   * @category Showing/hiding elements
   */
  class Show {
    /**
     * Shows the element with a smooth fade in transition.
     */

    /**
     * Hides the element with a smooth fade out transition.
     */

    /**
     * Shows the element if it is hidden, hides it otherwise.
     */

    static register() {
      registerAction("show", element => new Show(element));
    }
    constructor(element) {
      disableInitialTransition(element);
      hideElement(element); // initial state

      const {
        _show,
        _hide,
        _toggle
      } = getMethods$3(element);
      this.do = _show;
      this.undo = _hide;
      this[S_TOGGLE] = _toggle;
    }
  }

  /**
   * Hides or shows the given element with a smooth fading transition.
   *
   * **IMPORTANT:** When constructed, it will remove any `lisn-hide` class from
   * the element as a form of initialization.
   *
   * -------
   *
   * To use with auto-widgets (HTML API) as part of a trigger specification:
   * - Action name: "hide".
   * - Accepted string arguments: none
   * - Accepted options: none
   *
   * @example
   * ```html
   * <button id="btn">Show/hide</button>
   * <div data-lisn-on-click="@hide +target=#btn"></div>
   * ```
   *
   * @category Showing/hiding elements
   */
  class Hide {
    /**
     * Hides the element with a smooth fade out transition.
     */

    /**
     * Shows the element with a smooth fade in transition.
     */

    /**
     * Shows the element if it is hidden, hides it otherwise.
     */

    static register() {
      registerAction("hide", element => new Hide(element));
    }
    constructor(element) {
      disableInitialTransition(element);
      showElement(element); // initial state

      const {
        _show,
        _hide,
        _toggle
      } = getMethods$3(element);
      this.do = _hide;
      this.undo = _show;
      this[S_TOGGLE] = _toggle;
    }
  }

  // --------------------

  const getMethods$3 = element => {
    return {
      _show: async () => {
        await showElement(element); // ignore return val
      },
      _hide: async () => {
        await hideElement(element); // ignore return val
      },
      _toggle: async () => {
        await toggleShowElement(element); // ignore return val
      }
    };
  };

  /**
   * @module Utils
   */

  /**
   * @category Validation
   */
  const isValidPosition = position => includes(POSITIONS, position);

  /**
   * @category Validation
   */
  const isValidTwoFoldPosition = position => position.match(TWO_FOLD_POSITION_REGEX) !== null;

  /**
   * @ignore
   * @internal
   */
  const POSITIONS = [S_TOP, S_BOTTOM, S_LEFT, S_RIGHT];

  // --------------------

  const POSITIONS_OPTIONS_STR = "(" + POSITIONS.join("|") + ")";
  const TWO_FOLD_POSITION_REGEX = RegExp(`^${POSITIONS_OPTIONS_STR}-${POSITIONS_OPTIONS_STR}$`);

  /**
   * @module Widgets
   */


  /* ********************
   * Base Openable
   * ********************/

  /**
   * Enables automatic setting up of an {@link Openable} widget from an
   * elements matching its content element selector (`[data-lisn-<name>]` or
   * `.lisn-<name>`).
   *
   * The name you specify here should generally be the same name you pass in
   * {@link OpenableProperties.name | options.name} to the
   * {@link Openable.constructor} but it does not need to be the same.
   *
   * @param name            The name of the openable. Should be in kebab-case.
   * @param newOpenable     Called for every element matching the selector.
   * @param configValidator A validator object, or a function that returns such
   *                        an object, for all options supported by the widget.
   *
   * @see {@link registerWidget}
   */
  const registerOpenable = (name, newOpenable, configValidator) => {
    registerWidget(name, (element, config) => {
      if (isHTMLElement(element)) {
        if (!Openable.get(element)) {
          return newOpenable(element, config);
        }
      } else {
        logError(usageError("Openable widget supports only HTMLElement"));
      }
      return null;
    }, configValidator);
  };

  /**
   * {@link Openable} is an abstract base class. You should not directly
   * instantiate it but can inherit it to create your own custom openable widget.
   *
   * **IMPORTANT:** You should not instantiate more than one {@link Openable}
   * widget, regardless of type, on a given element. Use {@link Openable.get} to
   * get an existing instance if any. If there is already an {@link Openable}
   * widget of any type on this element, it will be destroyed!
   *
   * @see {@link registerOpenable}
   */
  class Openable extends Widget {
    /**
     * Opens the widget unless it is disabled.
     */

    /**
     * Closes the widget.
     */

    /**
     * Closes the widget if it is open, or opens it if it is closed (unless
     * it is disabled).
     */

    /**
     * The given handler will be called when the widget is open.
     *
     * If it returns a promise, it will be awaited upon.
     */

    /**
     * The given handler will be called when the widget is closed.
     *
     * If it returns a promise, it will be awaited upon.
     */

    /**
     * Returns true if the widget is currently open.
     */

    /**
     * Returns the root element created by us that wraps the original content
     * element passed to the constructor. It is located in the content element's
     * original place.
     */

    /**
     * Returns the element that was found to be the container. It is the closest
     * ancestor that has a `lisn-collapsible-container` class, or if no such
     * ancestor then the immediate parent of the content element.
     */

    /**
     * Returns the trigger elements, if any. Note that these may be wrappers
     * around the original triggers passed.
     */

    /**
     * Returns the trigger elements along with their configuration.
     */

    /**
     * Retrieve an existing widget by its content element or any of its triggers.
     *
     * If the element is already part of a configured {@link Openable} widget,
     * the widget instance is returned. Otherwise `null`.
     *
     * Note that trigger elements are not guaranteed to be unique among openable
     * widgets as the same element can be a trigger for multiple such widgets. If
     * the element you pass is a trigger, then the last openable widget that was
     * created for it will be returned.
     */
    static get(element) {
      var _instances$get;
      // We manage the instances here since we also map associated elements and
      // not just the main content element that created the widget.
      return (_instances$get = instances.get(element)) !== null && _instances$get !== void 0 ? _instances$get : null;
    }
    constructor(element, properties) {
      super(element);
      const {
        isModal,
        isOffcanvas
      } = properties;
      const openCallbacks = newSet();
      const closeCallbacks = newSet();
      let isOpen = false;

      // ----------

      const open = async () => {
        if (this.isDisabled() || isOpen) {
          return;
        }
        isOpen = true;
        for (const callback of openCallbacks) {
          await callback.invoke(this);
        }
        if (isModal) {
          setHasModal();
        }
        await setBooleanData(root, PREFIX_IS_OPEN);
      };

      // ----------

      const close = async () => {
        if (this.isDisabled() || !isOpen) {
          return;
        }
        isOpen = false;
        for (const callback of closeCallbacks) {
          await callback.invoke(this);
        }
        if (isModal) {
          delHasModal();
        }
        if (isOffcanvas) {
          scrollWrapperToTop(); // no need to await
        }
        await unsetBooleanData(root, PREFIX_IS_OPEN);
      };

      // ----------

      const scrollWrapperToTop = async () => {
        // Wait a bit before scrolling since the hiding of the element is animated.
        // Assume no more than 1s animation time.
        await waitForDelay(1000);
        await waitForMeasureTime();
        elScrollTo(outerWrapper, {
          top: 0,
          left: 0
        });
      };

      // --------------------

      this.open = open;
      this.close = close;
      this[S_TOGGLE] = () => isOpen ? close() : open();
      this.onOpen = handler => openCallbacks.add(wrapCallback(handler));
      this.onClose = handler => closeCallbacks.add(wrapCallback(handler));
      this.isOpen = () => isOpen;
      this.getRoot = () => root;
      this.getContainer = () => container;
      this.getTriggers = () => [...triggers.keys()];
      this.getTriggerConfigs = () => newMap([...triggers.entries()]);
      this.onDestroy(() => {
        openCallbacks.clear();
        closeCallbacks.clear();
      });
      const {
        root,
        container,
        triggers,
        outerWrapper
      } = setupElements(this, element, properties);
    }
  }

  /**
   * Per-trigger based configuration. Can either be given as an object as the
   * value of the {@link OpenableProperties.triggers} map, or it can be set as a
   * string configuration in the `data-lisn-<name>-trigger` data attribute. See
   * {@link getWidgetConfig} for the syntax.
   *
   * @example
   * ```html
   * <div data-lisn-collapsible-trigger="auto-close
   *                                     | icon=right
   *                                     | icon-closed=arrow-down
   *                                     | icon-open=x"
   * ></div>
   * ```
   *
   * @interface
   */

  /**
   * @interface
   */

  /* ********************
   * Collapsible
   * ********************/

  /**
   * Configures the given element as a {@link Collapsible} widget.
   *
   * The Collapsible widget sets up the given element to be collapsed and
   * expanded upon activation. Activation can be done manually by calling
   * {@link open} or when clicking on any of the given
   * {@link CollapsibleConfig.triggers | triggers}.
   *
   * **NOTE:** The Collapsible widget always wraps each trigger element in
   * another element in order to allow positioning the icon, if any.
   *
   * **IMPORTANT:** You should not instantiate more than one {@link Openable}
   * widget, regardless of type, on a given element. Use {@link Openable.get} to
   * get an existing instance if any. If there is already an {@link Openable}
   * widget of any type on this element, it will be destroyed!
   *
   * -----
   *
   * You can use the following dynamic attributes or CSS properties in your
   * stylesheet:
   *
   * The following dynamic attributes are set on the root element that is created
   * by LISN and has a class `lisn-collapsible__root`:
   * - `data-lisn-is-open`: `"true"` or `"false"`
   * - `data-lisn-reverse`: `"true"` or `"false"`
   * - `data-lisn-orientation`: `"horizontal"` or `"vertical"`
   *
   * The following dynamic attributes are set on each trigger:
   * - `data-lisn-opens-on-hover: `"true"` or `"false"`
   *
   * -----
   *
   * To use with auto-widgets (HTML API) (see
   * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
   * CSS classes or data attributes are recognized:
   * - `lisn-collapsible` class or `data-lisn-collapsible` attribute set on the
   *   element that holds the content of the collapsible
   * - `lisn-collapsible-trigger` class or `data-lisn-collapsible-trigger`
   *   attribute set on elements that should act as the triggers.
   *   If using a data attribute, you can configure the trigger via the value
   *   with a similar syntax to the configuration of the openable widget. For
   *   example:
   *   - Set the attribute to `"hover"` in order to have this trigger open the
   *     collapsible on hover _in addition to click_.
   *   - Set the attribute to `"hover|auto-close"` in order to have this trigger
   *     open the collapsible on hover but and override
   *     {@link CollapsibleConfig.autoClose} with true.
   *
   * When using auto-widgets, the elements that will be used as triggers are
   * discovered in the following way:
   * 1. If the content element has a `data-lisn-collapsible-content-id` attribute,
   *    then it must be a unique (for the current page) ID. In this case, the
   *    trigger elements will be any element in the document that has a
   *    `lisn-collapsible-trigger` class or `data-lisn-collapsible-trigger`
   *    attribute and the same `data-lisn-collapsible-content-id` attribute.
   * 2. Otherwise, the closest ancestor that has a `lisn-collapsible-container`
   *    class, or if no such ancestor then the immediate parent of the content
   *    element, is searched for any elements that have a
   *    `lisn-collapsible-trigger` class or `data-lisn-collapsible-trigger`
   *    attribute and that do _not_ have a `data-lisn-collapsible-content-id`
   *    attribute, and that are _not_ children of the content element.
   *
   * See below examples for what values you can use set for the data attributes
   * in order to modify the configuration of the automatically created widget.
   *
   * @example
   * This defines a simple collapsible with one trigger.
   *
   * ```html
   * <div>
   *   <div class="lisn-collapsible-trigger">Expand</div>
   *   <div class="lisn-collapsible">
   *     Some long content here...
   *   </div>
   * </div>
   * ```
   *
   * @example
   * This defines a collapsible that is partially visible when collapsed, and
   * where the trigger is in a different parent to the content.
   *
   * ```html
   * <div>
   *   <div data-lisn-collapsible-content-id="readmore"
   *        data-lisn-collapsible="peek">
   *     <p>
   *       Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis
   *       viverra faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus
   *       aliquet turpis. Diam potenti egestas dolor auctor nostra vestibulum.
   *       Tempus auctor quis turpis; pulvinar ante ultrices. Netus morbi
   *       imperdiet volutpat litora tellus turpis a. Sociosqu interdum sodales
   *       sapien nulla aptent pellentesque praesent. Senectus magnis
   *       pellentesque; dis porta justo habitant.
   *     </p>
   *
   *     <p>
   *       Imperdiet placerat habitant tristique turpis habitasse ligula pretium
   *       vehicula. Mauris molestie lectus leo aliquam condimentum elit fermentum
   *       tempus nisi. Eget mi vestibulum quisque enim himenaeos. Odio nascetur
   *       vel congue vivamus eleifend ut nascetur. Ultrices quisque non dictumst
   *       risus libero varius tincidunt vel. Suscipit netus maecenas imperdiet
   *       elementum donec maximus suspendisse luctus. Eu velit semper urna sem
   *       ullamcorper nisl turpis hendrerit. Gravida commodo nisl malesuada nibh
   *       ultricies scelerisque hendrerit tempus vehicula. Risus eleifend eros
   *       aliquam turpis elit ridiculus est class.
   *     </p>
   *   </div>
   * </div>
   *
   * <div>
   *   <div data-lisn-collapsible-content-id="readmore"
   *        class="lisn-collapsible-trigger">
   *     Read more
   *   </div>
   * </div>
   * ```
   *
   * @example
   * As above, but with all other possible configuration settings set explicitly.
   *
   * ```html
   * <div>
   *   <div data-lisn-collapsible-content-id="readmore"
   *        data-lisn-collapsible="peek=50px
   *                               | horizontal=false
   *                               | reverse=false
   *                               | auto-close
   *                               | icon=right
   *                               | icon-closed=arrow-up"
   *                               | icon-open=arrow-down">
   *     <p>
   *       Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis
   *       viverra faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus
   *       aliquet turpis. Diam potenti egestas dolor auctor nostra vestibulum.
   *       Tempus auctor quis turpis; pulvinar ante ultrices. Netus morbi
   *       imperdiet volutpat litora tellus turpis a. Sociosqu interdum sodales
   *       sapien nulla aptent pellentesque praesent. Senectus magnis
   *       pellentesque; dis porta justo habitant.
   *     </p>
   *
   *     <p>
   *       Imperdiet placerat habitant tristique turpis habitasse ligula pretium
   *       vehicula. Mauris molestie lectus leo aliquam condimentum elit fermentum
   *       tempus nisi. Eget mi vestibulum quisque enim himenaeos. Odio nascetur
   *       vel congue vivamus eleifend ut nascetur. Ultrices quisque non dictumst
   *       risus libero varius tincidunt vel. Suscipit netus maecenas imperdiet
   *       elementum donec maximus suspendisse luctus. Eu velit semper urna sem
   *       ullamcorper nisl turpis hendrerit. Gravida commodo nisl malesuada nibh
   *       ultricies scelerisque hendrerit tempus vehicula. Risus eleifend eros
   *       aliquam turpis elit ridiculus est class.
   *     </p>
   *   </div>
   * </div>
   *
   * <div>
   *   <div data-lisn-collapsible-content-id="readmore"
   *        class="lisn-collapsible-trigger">
   *     Read more
   *   </div>
   * </div>
   * ```
   */
  class Collapsible extends Openable {
    static register() {
      registerOpenable(WIDGET_NAME_COLLAPSIBLE, (el, config) => new Collapsible(el, config), collapsibleConfigValidator);
    }
    constructor(element, config) {
      var _config$autoClose, _config$reverse;
      const isHorizontal = config === null || config === void 0 ? void 0 : config.horizontal;
      const orientation = isHorizontal ? S_HORIZONTAL : S_VERTICAL;
      const onSetup = () => {
        // The triggers here are wrappers around the original which will be
        // replaced by the original on destroy, so no need to clean up this.
        for (const [trigger, triggerConfig] of this.getTriggerConfigs().entries()) {
          insertCollapsibleIcon(trigger, triggerConfig, this, config);
          setDataNow(trigger, PREFIX_ORIENTATION, orientation);
        }
      };
      super(element, {
        name: WIDGET_NAME_COLLAPSIBLE,
        id: config === null || config === void 0 ? void 0 : config.id,
        className: config === null || config === void 0 ? void 0 : config.className,
        autoClose: (_config$autoClose = config === null || config === void 0 ? void 0 : config.autoClose) !== null && _config$autoClose !== void 0 ? _config$autoClose : false,
        isModal: false,
        isOffcanvas: false,
        closeButton: false,
        triggers: config === null || config === void 0 ? void 0 : config.triggers,
        wrapTriggers: true,
        onSetup
      });
      const root = this.getRoot();
      const wrapper = childrenOf(root)[0];
      setData(root, PREFIX_ORIENTATION, orientation);
      setBooleanData(root, PREFIX_REVERSE, (_config$reverse = config === null || config === void 0 ? void 0 : config.reverse) !== null && _config$reverse !== void 0 ? _config$reverse : false);

      // -------------------- Transitions
      disableInitialTransition(element, 100);
      disableInitialTransition(root, 100);
      disableInitialTransition(wrapper, 100);
      let disableTransitionTimer = null;
      const tempEnableTransition = async () => {
        await removeClasses(root, PREFIX_TRANSITION_DISABLE);
        await removeClasses(wrapper, PREFIX_TRANSITION_DISABLE);
        if (disableTransitionTimer) {
          clearTimer(disableTransitionTimer);
        }
        const transitionDuration = await getMaxTransitionDuration(root);
        disableTransitionTimer = setTimer(() => {
          if (this.isOpen()) {
            addClasses(root, PREFIX_TRANSITION_DISABLE);
            addClasses(wrapper, PREFIX_TRANSITION_DISABLE);
            disableTransitionTimer = null;
          }
        }, transitionDuration);
      };

      // Disable transitions except during open/close, so that resizing the
      // window for example doesn't result in lagging width/height transition.
      this.onOpen(tempEnableTransition);
      this.onClose(tempEnableTransition);

      // -------------------- Peek
      const peek = config === null || config === void 0 ? void 0 : config.peek;
      if (peek) {
        (async () => {
          let peekSize = null;
          if (isString(peek)) {
            peekSize = peek;
          } else {
            peekSize = await getStyleProp(element, VAR_PEEK_SIZE);
          }
          addClasses(root, PREFIX_PEEK);
          if (peekSize) {
            setStyleProp(root, VAR_PEEK_SIZE, peekSize);
          }
        })();
      }

      // -------------------- Width in horizontal mode
      if (isHorizontal) {
        const updateWidth = async () => {
          const width = await getComputedStyleProp(root, S_WIDTH);
          await setStyleProp(element, VAR_JS_COLLAPSIBLE_WIDTH, width);
        };
        setTimer(updateWidth);

        // Save its current width so that if it contains text, it does not
        // "collapse" and end up super tall.
        this.onClose(updateWidth);
        this.onOpen(async () => {
          // Update the content width before opening.
          await updateWidth();

          // Delete the fixed width property soon after opening to allow it to
          // resize again while it's open.
          waitForDelay(2000).then(() => {
            if (this.isOpen()) {
              delStyleProp(element, VAR_JS_COLLAPSIBLE_WIDTH);
            }
          });
        });
      }
    }
  }

  /**
   * @interface
   */

  /* ********************
   * Popup
   * ********************/

  /**
   * Configures the given element as a {@link Popup} widget.
   *
   * The Popup widget sets up the given element to be hidden and open in a
   * floating popup upon activation. Activation can be done manually by calling
   * {@link open} or when clicking on any of the given
   * {@link PopupConfig.triggers | triggers}.
   *
   * **IMPORTANT:** The popup is positioned absolutely in its container and the
   * position is relative to the container. The container gets `width:
   * fit-content` by default but you can override this in your CSS. The popup
   * also gets a configurable `min-width` set.
   *
   * **IMPORTANT:** You should not instantiate more than one {@link Openable}
   * widget, regardless of type, on a given element. Use {@link Openable.get} to
   * get an existing instance if any. If there is already an {@link Openable}
   * widget of any type on this element, it will be destroyed!
   *
   * -----
   *
   * You can use the following dynamic attributes or CSS properties in your
   * stylesheet:
   *
   * The following dynamic attributes are set on the root element that is created
   * by LISN and has a class `lisn-popup__root`:
   * - `data-lisn-is-open`: `"true"` or `"false"`
   * - `data-lisn-place`: the actual position (top, bottom, left, top-left, etc)
   *
   * The following dynamic attributes are set on each trigger:
   * - `data-lisn-opens-on-hover: `"true"` or `"false"`
   *
   * -----
   *
   * To use with auto-widgets (HTML API) (see
   * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
   * CSS classes or data attributes are recognized:
   * - `lisn-popup` class or `data-lisn-popup` attribute set on the element that
   *   holds the content of the popup
   * - `lisn-popup-trigger` class or `data-lisn-popup-trigger`
   *   attribute set on elements that should act as the triggers.
   *   If using a data attribute, you can configure the trigger via the value
   *   with a similar syntax to the configuration of the openable widget. For
   *   example:
   *   - Set the attribute to `"hover"` in order to have this trigger open the
   *     popup on hover _in addition to click_.
   *   - Set the attribute to `"hover|auto-close=false"` in order to have this
   *     trigger open the popup on hover but and override
   *     {@link PopupConfig.autoClose} with true.
   *
   * When using auto-widgets, the elements that will be used as triggers are
   * discovered in the following way:
   * 1. If the content element has a `data-lisn-popup-content-id` attribute, then
   *    it must be a unique (for the current page) ID. In this case, the trigger
   *    elements will be any element in the document that has a
   *    `lisn-popup-trigger` class or `data-lisn-popup-trigger` attribute and the
   *    same `data-lisn-popup-content-id` attribute.
   * 2. Otherwise, the closest ancestor that has a `lisn-popup-container` class,
   *    or if no such ancestor then the immediate parent of the content element,
   *    is searched for any elements that have a `lisn-popup-trigger` class or
   *    `data-lisn-popup-trigger` attribute and that do _not_ have a
   *    `data-lisn-popup-content-id` attribute, and that are _not_ children of
   *    the content element.
   *
   * See below examples for what values you can use set for the data attributes
   * in order to modify the configuration of the automatically created widget.
   *
   * @example
   * This defines a simple popup with one trigger.
   *
   * ```html
   * <div>
   *   <div class="lisn-popup-trigger">Open</div>
   *   <div class="lisn-popup">
   *     Some content here...
   *   </div>
   * </div>
   * ```
   *
   * @example
   * This defines a popup that has a close button, and where the trigger is in a
   * different parent to the content.
   *
   * ```html
   * <div>
   *   <div data-lisn-popup-content-id="popup"
   *        data-lisn-popup="close-button">
   *     Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis viverra
   *     faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus aliquet
   *     turpis. Diam potenti egestas dolor auctor nostra vestibulum. Tempus
   *     auctor quis turpis; pulvinar ante ultrices. Netus morbi imperdiet
   *     volutpat litora tellus turpis a. Sociosqu interdum sodales sapien nulla
   *     aptent pellentesque praesent. Senectus magnis pellentesque; dis porta
   *     justo habitant.
   *   </div>
   * </div>
   *
   * <div>
   *   <div data-lisn-popup-content-id="popup" class="lisn-popup-trigger">
   *     Open
   *   </div>
   * </div>
   * ```
   *
   * @example
   * As above, but with all possible configuration settings set explicitly.
   *
   * ```html
   * <div>
   *   <div data-lisn-popup-content-id="popup" class="lisn-popup-trigger">
   *     Open
   *   </div>
   * </div>
   *
   * <div>
   *   <div data-lisn-popup-content-id="popup"
   *        data-lisn-popup="close-button | position=bottom | auto-close=false">
   *     Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis viverra
   *     faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus aliquet
   *     turpis. Diam potenti egestas dolor auctor nostra vestibulum. Tempus
   *     auctor quis turpis; pulvinar ante ultrices. Netus morbi imperdiet
   *     volutpat litora tellus turpis a. Sociosqu interdum sodales sapien nulla
   *     aptent pellentesque praesent. Senectus magnis pellentesque; dis porta
   *     justo habitant.
   *   </div>
   * </div>
   * ```
   */
  class Popup extends Openable {
    static register() {
      registerOpenable(WIDGET_NAME_POPUP, (el, config) => new Popup(el, config), popupConfigValidator);
    }
    constructor(element, config) {
      var _config$autoClose2, _config$closeButton;
      super(element, {
        name: WIDGET_NAME_POPUP,
        id: config === null || config === void 0 ? void 0 : config.id,
        className: config === null || config === void 0 ? void 0 : config.className,
        autoClose: (_config$autoClose2 = config === null || config === void 0 ? void 0 : config.autoClose) !== null && _config$autoClose2 !== void 0 ? _config$autoClose2 : true,
        isModal: false,
        isOffcanvas: false,
        closeButton: (_config$closeButton = config === null || config === void 0 ? void 0 : config.closeButton) !== null && _config$closeButton !== void 0 ? _config$closeButton : false,
        triggers: config === null || config === void 0 ? void 0 : config.triggers
      });
      const root = this.getRoot();
      const container = this.getContainer();
      const position = (config === null || config === void 0 ? void 0 : config.position) || S_AUTO;
      if (position !== S_AUTO) {
        setData(root, PREFIX_PLACE, position);
      }
      if (container && position === S_AUTO) {
        // Automatic position
        this.onOpen(async () => {
          const [contentSize, containerView] = await promiseAll([SizeWatcher.reuse().fetchCurrentSize(element), ViewWatcher.reuse().fetchCurrentView(container)]);
          const placement = await fetchPopupPlacement(contentSize, containerView);
          if (placement) {
            await setData(root, PREFIX_PLACE, placement);
          }
        });
      }
    }
  }

  /**
   * @interface
   */

  /* ********************
   * Modal
   * ********************/

  /**
   * Configures the given element as a {@link Modal} widget.
   *
   * The Modal widget sets up the given element to be hidden and open in a fixed
   * full-screen modal popup upon activation. Activation can be done manually by
   * calling {@link open} or when clicking on any of the given
   * {@link ModalConfig.triggers | triggers}.
   *
   * **IMPORTANT:** You should not instantiate more than one {@link Openable}
   * widget, regardless of type, on a given element. Use {@link Openable.get} to
   * get an existing instance if any. If there is already an {@link Openable}
   * widget of any type on this element, it will be destroyed!
   *
   * -----
   *
   * You can use the following dynamic attributes or CSS properties in your
   * stylesheet:
   *
   * The following dynamic attributes are set on the root element that is created
   * by LISN and has a class `lisn-modal__root`:
   * - `data-lisn-is-open`: `"true"` or `"false"`
   *
   * The following dynamic attributes are set on each trigger:
   * - `data-lisn-opens-on-hover: `"true"` or `"false"`
   *
   * -----
   *
   * To use with auto-widgets (HTML API) (see
   * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
   * CSS classes or data attributes are recognized:
   * - `lisn-modal` class or `data-lisn-modal` attribute set on the element that
   *   holds the content of the modal
   * - `lisn-modal-trigger` class or `data-lisn-modal-trigger`
   *   attribute set on elements that should act as the triggers.
   *   If using a data attribute, you can configure the trigger via the value
   *   with a similar syntax to the configuration of the openable widget. For
   *   example:
   *   - Set the attribute to `"hover"` in order to have this trigger open the
   *     modal on hover _in addition to click_.
   *   - Set the attribute to `"hover|auto-close=false"` in order to have this
   *     trigger open the modal on hover but and override
   *     {@link ModalConfig.autoClose} with true.
   *
   * When using auto-widgets, the elements that will be used as triggers are
   * discovered in the following way:
   * 1. If the content element has a `data-lisn-modal-content-id` attribute, then
   *    it must be a unique (for the current page) ID. In this case, the trigger
   *    elements will be any element in the document that has a
   *    `lisn-modal-trigger` class or `data-lisn-modal-trigger` attribute and the
   *    same `data-lisn-modal-content-id` attribute.
   * 2. Otherwise, the closest ancestor that has a `lisn-modal-container` class,
   *    or if no such ancestor then the immediate parent of the content element,
   *    is searched for any elements that have a `lisn-modal-trigger` class or
   *    `data-lisn-modal-trigger` attribute and that do _not_ have a
   *    `data-lisn-modal-content-id` attribute, and that are _not_ children of
   *    the content element.
   *
   * See below examples for what values you can use set for the data attributes
   * in order to modify the configuration of the automatically created widget.
   *
   * @example
   * This defines a simple modal with one trigger.
   *
   * ```html
   * <div>
   *   <div class="lisn-modal-trigger">Open</div>
   *   <div class="lisn-modal">
   *     Some content here...
   *   </div>
   * </div>
   * ```
   *
   * @example
   * This defines a modal that doesn't automatically close on click outside or
   * Escape and, and that has several triggers in a different parent to the
   * content.
   *
   * ```html
   * <div>
   *   <div data-lisn-modal-content-id="modal"
   *        data-lisn-modal="auto-close=false">
   *     Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis viverra
   *     faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus aliquet
   *     turpis. Diam potenti egestas dolor auctor nostra vestibulum. Tempus
   *     auctor quis turpis; pulvinar ante ultrices. Netus morbi imperdiet
   *     volutpat litora tellus turpis a. Sociosqu interdum sodales sapien nulla
   *     aptent pellentesque praesent. Senectus magnis pellentesque; dis porta
   *     justo habitant.
   *   </div>
   * </div>
   *
   * <div>
   *   <div data-lisn-modal-content-id="modal" class="lisn-modal-trigger">
   *     Open
   *   </div>
   * </div>
   *
   * <div>
   *   <div data-lisn-modal-content-id="modal" class="lisn-modal-trigger">
   *     Another trigger
   *   </div>
   * </div>
   * ```
   *
   * @example
   * As above, but with all possible configuration settings set explicitly.
   *
   * ```html
   * <div>
   *   <div data-lisn-modal-content-id="modal"
   *        data-lisn-modal="auto-close=false | close-button=true">
   *     Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis viverra
   *     faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus aliquet
   *     turpis. Diam potenti egestas dolor auctor nostra vestibulum. Tempus
   *     auctor quis turpis; pulvinar ante ultrices. Netus morbi imperdiet
   *     volutpat litora tellus turpis a. Sociosqu interdum sodales sapien nulla
   *     aptent pellentesque praesent. Senectus magnis pellentesque; dis porta
   *     justo habitant.
   *   </div>
   * </div>
   *
   * <div>
   *   <div data-lisn-modal-content-id="modal" class="lisn-modal-trigger">
   *     Open
   *   </div>
   * </div>
   *
   * <div>
   *   <div data-lisn-modal-content-id="modal" class="lisn-modal-trigger">
   *     Another trigger
   *   </div>
   * </div>
   * ```
   */
  class Modal extends Openable {
    static register() {
      registerOpenable(WIDGET_NAME_MODAL, (el, config) => new Modal(el, config), modalConfigValidator);
    }
    constructor(element, config) {
      var _config$autoClose3, _config$closeButton2;
      super(element, {
        name: WIDGET_NAME_MODAL,
        id: config === null || config === void 0 ? void 0 : config.id,
        className: config === null || config === void 0 ? void 0 : config.className,
        autoClose: (_config$autoClose3 = config === null || config === void 0 ? void 0 : config.autoClose) !== null && _config$autoClose3 !== void 0 ? _config$autoClose3 : true,
        isModal: true,
        isOffcanvas: true,
        closeButton: (_config$closeButton2 = config === null || config === void 0 ? void 0 : config.closeButton) !== null && _config$closeButton2 !== void 0 ? _config$closeButton2 : true,
        triggers: config === null || config === void 0 ? void 0 : config.triggers
      });
    }
  }

  /**
   * @interface
   */

  /* ********************
   * Offcanvas
   * ********************/

  /**
   * Configures the given element as a {@link Offcanvas} widget.
   *
   * The Offcanvas widget sets up the given element to be hidden and open in a
   * fixed overlay (non full-screen) upon activation. Activation can be done
   * manually by calling {@link open} or when clicking on any of the given
   * {@link OffcanvasConfig.triggers | triggers}.
   *
   * **IMPORTANT:** You should not instantiate more than one {@link Openable}
   * widget, regardless of type, on a given element. Use {@link Openable.get} to
   * get an existing instance if any. If there is already an {@link Openable}
   * widget of any type on this element, it will be destroyed!
   *
   * -----
   *
   * You can use the following dynamic attributes or CSS properties in your
   * stylesheet:
   *
   * The following dynamic attributes are set on the root element that is created
   * by LISN and has a class `lisn-offcanvas__root`:
   * - `data-lisn-is-open`: `"true"` or `"false"`
   * - `data-lisn-place`: the actual position `"top"`, `"bottom"`, `"left"` or
   *   `"right"`
   *
   * The following dynamic attributes are set on each trigger:
   * - `data-lisn-opens-on-hover: `"true"` or `"false"`
   *
   * -----
   *
   * To use with auto-widgets (HTML API) (see
   * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
   * CSS classes or data attributes are recognized:
   * - `lisn-offcanvas` class or `data-lisn-offcanvas` attribute set on the
   *   element that holds the content of the offcanvas
   * - `lisn-offcanvas-trigger` class or `data-lisn-offcanvas-trigger`
   *   attribute set on elements that should act as the triggers.
   *   If using a data attribute, you can configure the trigger via the value
   *   with a similar syntax to the configuration of the openable widget. For
   *   example:
   *   - Set the attribute to `"hover"` in order to have this trigger open the
   *     offcanvas on hover _in addition to click_.
   *   - Set the attribute to `"hover|auto-close=false"` in order to have this
   *     trigger open the offcanvas on hover but and override
   *     {@link OffcanvasConfig.autoClose} with true.
   *
   * When using auto-widgets, the elements that will be used as triggers are
   * discovered in the following way:
   * 1. If the content element has a `data-lisn-offcanvas-content-id` attribute,
   *    then it must be a unique (for the current page) ID. In this case, the
   *    trigger elements will be any element in the document that has a
   *    `lisn-offcanvas-trigger` class or `data-lisn-offcanvas-trigger` attribute
   *    and the same `data-lisn-offcanvas-content-id` attribute.
   * 2. Otherwise, the closest ancestor that has a `lisn-offcanvas-container`
   *    class, or if no such ancestor then the immediate parent of the content
   *    element, is searched for any elements that have a
   *    `lisn-offcanvas-trigger` class or `data-lisn-offcanvas-trigger` attribute
   *    and that do _not_ have a `data-lisn-offcanvas-content-id`
   *    attribute, and that are _not_ children of the content element.
   *
   * See below examples for what values you can use set for the data attributes
   * in order to modify the configuration of the automatically created widget.
   *
   * @example
   * This defines a simple offcanvas with one trigger.
   *
   * ```html
   * <div>
   *   <div class="lisn-offcanvas-trigger">Open</div>
   *   <div class="lisn-offcanvas">
   *     Some content here...
   *   </div>
   * </div>
   * ```
   *
   * @example
   * This defines a offcanvas that doesn't automatically close on click outside
   * or Escape and, and that has several triggers in a different parent to the
   * content.
   *
   * ```html
   * <div>
   *   <div data-lisn-offcanvas-content-id="offcanvas"
   *        data-lisn-offcanvas="auto-close=false">
   *     Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis viverra
   *     faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus aliquet
   *     turpis. Diam potenti egestas dolor auctor nostra vestibulum. Tempus
   *     auctor quis turpis; pulvinar ante ultrices. Netus morbi imperdiet
   *     volutpat litora tellus turpis a. Sociosqu interdum sodales sapien nulla
   *     aptent pellentesque praesent. Senectus magnis pellentesque; dis porta
   *     justo habitant.
   *   </div>
   * </div>
   *
   * <div>
   *   <div data-lisn-offcanvas-content-id="offcanvas" class="lisn-offcanvas-trigger">
   *     Open
   *   </div>
   * </div>
   *
   * <div>
   *   <div data-lisn-offcanvas-content-id="offcanvas" class="lisn-offcanvas-trigger">
   *     Another trigger
   *   </div>
   * </div>
   * ```
   *
   * @example
   * As above, but with all possible configuration settings set explicitly.
   *
   * ```html
   * <div>
   *   <div data-lisn-offcanvas-content-id="offcanvas"
   *        data-lisn-offcanvas="position=top | auto-close=false | close-button=true">
   *     Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis viverra
   *     faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus aliquet
   *     turpis. Diam potenti egestas dolor auctor nostra vestibulum. Tempus
   *     auctor quis turpis; pulvinar ante ultrices. Netus morbi imperdiet
   *     volutpat litora tellus turpis a. Sociosqu interdum sodales sapien nulla
   *     aptent pellentesque praesent. Senectus magnis pellentesque; dis porta
   *     justo habitant.
   *   </div>
   * </div>
   *
   * <div>
   *   <div data-lisn-offcanvas-content-id="offcanvas" class="lisn-offcanvas-trigger">
   *     Open
   *   </div>
   * </div>
   *
   * <div>
   *   <div data-lisn-offcanvas-content-id="offcanvas" class="lisn-offcanvas-trigger">
   *     Another trigger
   *   </div>
   * </div>
   * ```
   */
  class Offcanvas extends Openable {
    static register() {
      registerOpenable(WIDGET_NAME_OFFCANVAS, (el, config) => new Offcanvas(el, config), offcanvasConfigValidator);
    }
    constructor(element, config) {
      var _config$autoClose4, _config$closeButton3;
      super(element, {
        name: WIDGET_NAME_OFFCANVAS,
        id: config === null || config === void 0 ? void 0 : config.id,
        className: config === null || config === void 0 ? void 0 : config.className,
        autoClose: (_config$autoClose4 = config === null || config === void 0 ? void 0 : config.autoClose) !== null && _config$autoClose4 !== void 0 ? _config$autoClose4 : true,
        isModal: false,
        isOffcanvas: true,
        closeButton: (_config$closeButton3 = config === null || config === void 0 ? void 0 : config.closeButton) !== null && _config$closeButton3 !== void 0 ? _config$closeButton3 : true,
        triggers: config === null || config === void 0 ? void 0 : config.triggers
      });
      const position = (config === null || config === void 0 ? void 0 : config.position) || S_RIGHT;
      setData(this.getRoot(), PREFIX_PLACE, position);
    }
  }

  /**
   * @interface
   */

  // ------------------------------

  const instances = newWeakMap();
  const WIDGET_NAME_COLLAPSIBLE = "collapsible";
  const WIDGET_NAME_POPUP = "popup";
  const WIDGET_NAME_MODAL = "modal";
  const WIDGET_NAME_OFFCANVAS = "offcanvas";
  const PREFIX_CLOSE_BTN = prefixName("close-button");
  const PREFIX_IS_OPEN = prefixName("is-open");
  const PREFIX_REVERSE = prefixName(S_REVERSE);
  const PREFIX_PEEK = prefixName("peek");
  const PREFIX_OPENS_ON_HOVER = prefixName("opens-on-hover");
  const PREFIX_LINE = prefixName("line");
  const PREFIX_ICON_POSITION = prefixName("icon-position");
  const PREFIX_TRIGGER_ICON = prefixName("trigger-icon");
  const PREFIX_ICON_WRAPPER = prefixName("icon-wrapper");
  const S_AUTO = "auto";
  const S_ARIA_EXPANDED = ARIA_PREFIX + "expanded";
  const S_ARIA_MODAL = ARIA_PREFIX + "modal";
  const VAR_PEEK_SIZE = prefixCssVar("peek-size");
  const VAR_JS_COLLAPSIBLE_WIDTH = prefixCssJsVar("collapsible-width");
  const MIN_CLICK_TIME_AFTER_HOVER_OPEN = 1000;
  const S_ARROW_UP = `${S_ARROW}-${S_UP}`;
  const S_ARROW_DOWN = `${S_ARROW}-${S_DOWN}`;
  const S_ARROW_LEFT = `${S_ARROW}-${S_LEFT}`;
  const S_ARROW_RIGHT = `${S_ARROW}-${S_RIGHT}`;
  const ARROW_TYPES = [S_ARROW_UP, S_ARROW_DOWN, S_ARROW_LEFT, S_ARROW_RIGHT];
  const ICON_CLOSED_TYPES = ["plus", ...ARROW_TYPES];
  const ICON_OPEN_TYPES = ["minus", "x", ...ARROW_TYPES];
  const isValidIconClosed = value => includes(ICON_CLOSED_TYPES, value);
  const isValidIconOpen = value => includes(ICON_OPEN_TYPES, value);
  const triggerConfigValidator = {
    id: validateString,
    className: (key, value) => validateStrList(key, toArrayIfSingle(value)),
    autoClose: validateBoolean,
    icon: (key, value) => value && toBoolean(value) === false ? false : validateString(key, value, isValidPosition),
    iconClosed: (key, value) => validateString(key, value, isValidIconClosed),
    iconOpen: (key, value) => validateString(key, value, isValidIconOpen),
    hover: validateBoolean
  };
  const collapsibleConfigValidator = {
    id: validateString,
    className: (key, value) => validateStrList(key, toArrayIfSingle(value)),
    horizontal: validateBoolean,
    reverse: validateBoolean,
    peek: validateBooleanOrString,
    autoClose: validateBoolean,
    icon: (key, value) => toBoolean(value) === false ? false : validateString(key, value, isValidPosition),
    iconClosed: (key, value) => validateString(key, value, isValidIconClosed),
    iconOpen: (key, value) => validateString(key, value, isValidIconOpen)
  };
  const popupConfigValidator = {
    id: validateString,
    className: (key, value) => validateStrList(key, toArrayIfSingle(value)),
    closeButton: validateBoolean,
    position: (key, value) => validateString(key, value, v => v === S_AUTO || isValidPosition(v) || isValidTwoFoldPosition(v)),
    autoClose: validateBoolean
  };
  const modalConfigValidator = {
    id: validateString,
    className: (key, value) => validateStrList(key, toArrayIfSingle(value)),
    closeButton: validateBoolean,
    autoClose: validateBoolean
  };
  const offcanvasConfigValidator = {
    id: validateString,
    className: (key, value) => validateStrList(key, toArrayIfSingle(value)),
    closeButton: validateBoolean,
    position: (key, value) => validateString(key, value, isValidPosition),
    autoClose: validateBoolean
  };
  const getPrefixedNames = name => {
    const pref = prefixName(name);
    return {
      _root: `${pref}__root`,
      _overlay: `${pref}__overlay`,
      // only used for modal/offcanvas
      _innerWrapper: `${pref}__inner-wrapper`,
      _outerWrapper: `${pref}__outer-wrapper`,
      _content: `${pref}__content`,
      _container: `${pref}__container`,
      _trigger: `${pref}__trigger`,
      // Use different classes for styling to the ones used for auto-discovering
      // elements, so that re-creating existing widgets can correctly find the
      // elements to be used by the new widget synchronously before the current
      // one is destroyed.
      _containerForSelect: `${pref}-container`,
      _triggerForSelect: `${pref}-trigger`,
      _contentId: `${pref}-content-id`
    };
  };
  const findContainer = (content, cls) => {
    var _currWidget$getRoot;
    const currWidget = instances.get(content);
    // If there's an existing widget that we're about to destroy, the content
    // element will be wrapped in several elements and won't be restored until
    // the next mutate time. In that case, to correctly determine the container
    // element, use the current widget's root element, which is located in the
    // content element's original place.
    let childRef = (_currWidget$getRoot = currWidget === null || currWidget === void 0 ? void 0 : currWidget.getRoot()) !== null && _currWidget$getRoot !== void 0 ? _currWidget$getRoot : content;
    if (!parentOf(childRef)) {
      // The current widget is not yet initialized (i.e. we are re-creating it
      // immediately after it was constructed)
      childRef = content;
    }

    // Find the content container
    let container = childRef.closest(`.${cls}`);
    if (!container) {
      container = parentOf(childRef);
    }
    return container;
  };
  const findTriggers = (content, prefixedNames) => {
    const container = findContainer(content, prefixedNames._containerForSelect);
    // jsdom does not like the below selector when suffixed by [data-*] or :not()...
    // const triggerSelector = `:is(.${prefixedNames._triggerForSelect},[data-${prefixedNames._triggerForSelect}])`;
    // So use this:
    const getTriggerSelector = suffix => `.${prefixedNames._triggerForSelect}${suffix},` + `[data-${prefixedNames._triggerForSelect}]${suffix}`;
    const contentId = getData(content, prefixedNames._contentId);
    let triggers = [];
    if (contentId) {
      triggers = [...docQuerySelectorAll(getTriggerSelector(`[data-${prefixedNames._contentId}="${contentId}"]`))];
    } else if (container) {
      triggers = [...arrayFrom(querySelectorAll(container, getTriggerSelector(`:not([data-${prefixedNames._contentId}])`))).filter(t => !content.contains(t))];
    }
    return triggers;
  };
  const getTriggersFrom = (content, inputTriggers, wrapTriggers, prefixedNames) => {
    const triggerMap = newMap();
    inputTriggers = inputTriggers || findTriggers(content, prefixedNames);
    const addTrigger = (trigger, triggerConfig) => {
      if (wrapTriggers) {
        const wrapper = createElement(isInlineTag(tagName(trigger)) ? "span" : "div");
        wrapElement(trigger, {
          wrapper,
          ignoreMove: true
        }); // no need to await
        trigger = wrapper;
      }
      triggerMap.set(trigger, triggerConfig);
    };
    if (isArray(inputTriggers)) {
      for (const trigger of inputTriggers) {
        addTrigger(trigger, getWidgetConfig(getData(trigger, prefixedNames._triggerForSelect), triggerConfigValidator));
      }
    } else if (isInstanceOf(inputTriggers, Map)) {
      for (const [trigger, triggerConfig] of inputTriggers.entries()) {
        addTrigger(trigger, getWidgetConfig(triggerConfig, triggerConfigValidator));
      }
    }
    return triggerMap;
  };
  const setupElements = (widget, content, properties) => {
    var _properties$wrapTrigg;
    const prefixedNames = getPrefixedNames(properties.name);
    const container = findContainer(content, prefixedNames._containerForSelect);
    const wrapTriggers = (_properties$wrapTrigg = properties.wrapTriggers) !== null && _properties$wrapTrigg !== void 0 ? _properties$wrapTrigg : false;
    const triggers = getTriggersFrom(content, properties.triggers, wrapTriggers, prefixedNames);

    // Create two wrappers
    const innerWrapper = createElement("div");
    addClasses(innerWrapper, prefixedNames._innerWrapper);
    const outerWrapper = wrapElementNow(innerWrapper);

    // Setup the root element.
    // For off-canvas types we need another wrapper to serve as the root and we
    // need a placeholder element to save the content's original position so it
    // can be restored on destroy.
    // Otherwise use outerWrapper for root and insert the root where the content
    // was.
    let root;
    let placeholder;
    if (properties.isOffcanvas) {
      addClasses(outerWrapper, prefixedNames._outerWrapper);
      root = wrapElementNow(outerWrapper);
      placeholder = createElement("div");
      const overlay = createElement("div");
      addClasses(overlay, prefixedNames._overlay);
      moveElement(overlay, {
        to: root
      });
    } else {
      // Otherwise use the outer wrapper as the root
      root = placeholder = outerWrapper;
    }
    if (properties.id) {
      root.id = properties.id;
    }
    if (properties.className) {
      addClassesNow(root, ...toArrayIfSingle(properties.className));
    }
    unsetBooleanData(root, PREFIX_IS_OPEN);
    const domID = getOrAssignID(root, properties.name);
    if (properties.isModal) {
      setAttr(root, S_ROLE, "dialog");
      setAttr(root, S_ARIA_MODAL);
    }
    addClasses(root, prefixedNames._root);
    disableInitialTransition(root);

    // Add a close button?
    if (properties.closeButton) {
      const closeBtn = createButton("Close");
      addClasses(closeBtn, PREFIX_CLOSE_BTN);

      // If autoClose is true, it will be closed on click anyway, because the
      // close button is outside the content.
      addEventListenerTo(closeBtn, S_CLICK, () => {
        widget.close();
      });
      moveElement(closeBtn, {
        to: properties.isOffcanvas ? root : innerWrapper
      });
    }

    // Transfer the relevant classes/data attrs from content to root element, so
    // that our CSS can work without :has.
    // This won't cause forced layout since the root is not yet attached to the
    // DOM.
    for (const cls of [settings.lightThemeClassName, settings.darkThemeClassName]) {
      if (hasClass(content, cls)) {
        addClasses(root, cls);
      }
    }
    const elements = {
      content,
      root,
      container,
      outerWrapper,
      triggers
    };

    // -------------------- Close / destroy hooks
    widget.onClose(async () => {
      for (const trigger of triggers.keys()) {
        delData(trigger, PREFIX_OPENS_ON_HOVER);
        unsetAttr(trigger, S_ARIA_EXPANDED);
        await unsetBooleanData(trigger, PREFIX_IS_OPEN);
      }
    });
    widget.onDestroy(async () => {
      await waitForMutateTime();
      replaceElementNow(placeholder, content, {
        ignoreMove: true
      });
      moveElementNow(root); // remove
      removeClassesNow(content, prefixedNames._content);
      if (container) {
        removeClassesNow(container, prefixedNames._container);
      }
      for (const [trigger, triggerConfig] of triggers.entries()) {
        delAttr(trigger, S_ARIA_CONTROLS);
        delAttr(trigger, S_ARIA_EXPANDED);
        delDataNow(trigger, PREFIX_OPENS_ON_HOVER);
        delDataNow(trigger, PREFIX_IS_OPEN);
        removeClassesNow(trigger, prefixedNames._trigger, ...((triggerConfig === null || triggerConfig === void 0 ? void 0 : triggerConfig.className) || []));
        if (trigger.id === (triggerConfig === null || triggerConfig === void 0 ? void 0 : triggerConfig.id)) {
          trigger.id = "";
        }
        if (wrapTriggers) {
          replaceElementNow(trigger, childrenOf(trigger)[0], {
            ignoreMove: true
          });
        }
      }
      triggers.clear();
      for (const el of [content, ...triggers.keys()]) {
        if (instances.get(el) === widget) {
          deleteKey(instances, el);
        }
      }
    });

    // -------------------- SETUP
    // Save the elements so we can lookup the instance
    const currWidget = instances.get(content);
    for (const el of [content, ...triggers.keys()]) {
      instances.set(el, widget);
    }

    // Wait for the DOMWatcher to be active, which may not be before interactive.
    waitForInteractive().then(currWidget === null || currWidget === void 0 ? void 0 : currWidget.destroy).then(waitForMutateTime).then(() => {
      if (widget.isDestroyed()) {
        return;
      }
      addClassesNow(content, prefixedNames._content);
      if (container) {
        addClassesNow(container, prefixedNames._container);
      }
      if (properties.isOffcanvas) {
        moveElementNow(root, {
          to: getBody(),
          ignoreMove: true
        });
      }

      // Move the placeholder element to before the content and then move
      // content into inner wrapper.
      moveElementNow(placeholder, {
        // for not-offcanvas it's also the root
        to: content,
        position: "before",
        ignoreMove: true
      });
      moveElementNow(content, {
        to: innerWrapper,
        ignoreMove: true
      });

      // Setup the triggers
      for (const [trigger, triggerConfig] of triggers.entries()) {
        setAttr(trigger, S_ARIA_CONTROLS, domID);
        unsetAttr(trigger, S_ARIA_EXPANDED);
        setBooleanDataNow(trigger, PREFIX_OPENS_ON_HOVER, triggerConfig[S_HOVER]);
        unsetBooleanDataNow(trigger, PREFIX_IS_OPEN);
        addClassesNow(trigger, prefixedNames._trigger, ...((triggerConfig === null || triggerConfig === void 0 ? void 0 : triggerConfig.className) || []));
        if (triggerConfig !== null && triggerConfig !== void 0 && triggerConfig.id) {
          trigger.id = triggerConfig.id;
        }
      }
      setupListeners(widget, elements, properties, prefixedNames);
      if (properties.onSetup) {
        properties.onSetup();
      }
    });
    return elements;
  };
  const setupListeners = (widget, elements, properties, prefixedNames) => {
    const {
      content,
      root,
      triggers
    } = elements;
    const doc = getDoc();
    let hoverTimeOpened = 0;
    let isPointerOver = false;
    let activeTrigger = null;

    // ----------

    const isTrigger = element => includes(arrayFrom(triggers.keys()), element.closest(getDefaultWidgetSelector(prefixedNames._trigger)));
    const shouldPreventDefault = trigger => {
      var _triggers$get$prevent, _triggers$get;
      return (_triggers$get$prevent = (_triggers$get = triggers.get(trigger)) === null || _triggers$get === void 0 ? void 0 : _triggers$get.preventDefault) !== null && _triggers$get$prevent !== void 0 ? _triggers$get$prevent : true;
    };
    const usesHover = trigger => {
      var _triggers$get2;
      return (_triggers$get2 = triggers.get(trigger)) === null || _triggers$get2 === void 0 ? void 0 : _triggers$get2.hover;
    };
    const usesAutoClose = trigger => {
      var _ref, _triggers$get3;
      return (_ref = trigger ? (_triggers$get3 = triggers.get(trigger)) === null || _triggers$get3 === void 0 ? void 0 : _triggers$get3.autoClose : null) !== null && _ref !== void 0 ? _ref : properties.autoClose;
    };

    // ----------

    const toggleTrigger = (event, openIt) => {
      const trigger = currentTargetOf(event);
      if (isElement(trigger)) {
        if (shouldPreventDefault(trigger)) {
          preventDefault(event);
        }

        // If a click was fired shortly after opening on hover, ignore
        if (openIt !== false &&
        // not explicitly asked to close
        widget.isOpen() && timeSince(hoverTimeOpened) < MIN_CLICK_TIME_AFTER_HOVER_OPEN) {
          return;
        }
        if (openIt !== null && openIt !== void 0 ? openIt : !widget.isOpen()) {
          // open it
          activeTrigger = trigger;
          setAttr(trigger, S_ARIA_EXPANDED); // will be unset on close
          setBooleanData(trigger, PREFIX_IS_OPEN); // will be unset on close

          widget.open(); // no need to await

          if (usesAutoClose(trigger)) {
            if (usesHover(trigger)) {
              addEventListenerTo(root, S_POINTERENTER, setIsPointerOver);
              addEventListenerTo(root, S_POINTERLEAVE, pointerLeft);
            }

            // auto-close listeners setup by the onOpen handler below
          }
        } else {
          widget.close(); // out onClose handler below will remove listeners
        }
      }
    };

    // ----------

    const setIsPointerOver = () => {
      isPointerOver = true;
    };

    // ----------

    const unsetIsPointerOver = event => {
      // Keep it set to true if this is a touch pointer type; otherwise unset
      isPointerOver = isPointerOver && isTouchPointerEvent(event);
    };

    // ----------

    const pointerEntered = event => {
      setIsPointerOver();
      if (!widget.isOpen()) {
        hoverTimeOpened = timeNow();
        toggleTrigger(event, true);
      }
    };

    // ----------

    const pointerLeft = event => {
      unsetIsPointerOver(event);
      const trigger = currentTargetOf(event);
      if (isElement(trigger) && usesAutoClose(trigger)) {
        setTimer(() => {
          if (!isPointerOver) {
            widget.close();
          }
        },
        // use a delay that allows the mouse to move from trigger to content
        // without closing it
        // TODO make this user-configurable
        properties.isOffcanvas ? 300 : 50);
      }
    };

    // ----------

    const closeIfEscape = event => {
      if (event.key === "Escape") {
        widget.close(); // no need to await
      }
    };

    // ----------

    const closeIfClickOutside = event => {
      const target = targetOf(event);
      if (target === doc || isElement(target) && !content.contains(target) &&
      // outside content
      !isTrigger(target) // handled by pointer watcher
      ) {
        widget.close();
      }
    };

    // ----------

    const maybeSetupAutoCloseListeners = (trigger, remove) => {
      if (usesAutoClose(trigger)) {
        const addOrRemove = remove ? removeEventListenerFrom : addEventListenerTo;
        addOrRemove(doc, "keyup", closeIfEscape);

        // Add a short delay so that we don't catch the bubbling of the click event
        // that opened the widget.
        setTimer(() => addOrRemove(doc, S_CLICK, closeIfClickOutside), 100);
        if (trigger && usesHover(trigger)) {
          addOrRemove(trigger, S_POINTERLEAVE, pointerLeft);
        }
      }
    };

    // ----------

    const setupOrCleanup = remove => {
      const addOrRemove = remove ? removeEventListenerFrom : addEventListenerTo;
      for (const [trigger, triggerConfig] of triggers.entries()) {
        // Always setup click listeners
        addOrRemove(trigger, S_CLICK, toggleTrigger);
        if (triggerConfig[S_HOVER]) {
          addOrRemove(trigger, S_POINTERENTER, pointerEntered);
        }
      }
    };

    // ----------

    setupOrCleanup(false);
    widget.onOpen(() => {
      maybeSetupAutoCloseListeners(activeTrigger, false); // setup listeners if relevant
    });
    widget.onClose(() => {
      hoverTimeOpened = 0;
      isPointerOver = false;
      removeEventListenerFrom(root, S_POINTERENTER, setIsPointerOver);
      removeEventListenerFrom(root, S_POINTERLEAVE, pointerLeft);
      maybeSetupAutoCloseListeners(activeTrigger, true); // remove listeners if any
      activeTrigger = null;
    });
    widget.onDestroy(() => {
      setupOrCleanup(true); // remove
    });
  };

  // COLLAPSIBLE ------------------------------

  const insertCollapsibleIcon = (trigger, triggerConfig, widget, widgetConfig) => {
    var _triggerConfig$icon, _triggerConfig$iconCl, _triggerConfig$iconOp;
    const iconPosition = (_triggerConfig$icon = triggerConfig.icon) !== null && _triggerConfig$icon !== void 0 ? _triggerConfig$icon : widgetConfig === null || widgetConfig === void 0 ? void 0 : widgetConfig.icon;
    const iconClosed = ((_triggerConfig$iconCl = triggerConfig.iconClosed) !== null && _triggerConfig$iconCl !== void 0 ? _triggerConfig$iconCl : widgetConfig === null || widgetConfig === void 0 ? void 0 : widgetConfig.iconClosed) || "plus";
    const iconOpen = ((_triggerConfig$iconOp = triggerConfig.iconOpen) !== null && _triggerConfig$iconOp !== void 0 ? _triggerConfig$iconOp : widgetConfig === null || widgetConfig === void 0 ? void 0 : widgetConfig.iconOpen) || "minus";
    if (iconPosition) {
      addClasses(trigger, PREFIX_ICON_WRAPPER);
      setData(trigger, PREFIX_ICON_POSITION, iconPosition);
      const icon = createElement("span");
      setDataNow(icon, PREFIX_TRIGGER_ICON, iconClosed);
      for (let l = 0; l < 2; l++) {
        const line = createElement("span");
        addClassesNow(line, PREFIX_LINE);
        moveElementNow(line, {
          to: icon
        });
      }
      moveElement(icon, {
        to: trigger,
        ignoreMove: true
      });
      widget.onOpen(() => {
        if (getBooleanData(trigger, PREFIX_IS_OPEN)) {
          setData(icon, PREFIX_TRIGGER_ICON, iconOpen);
        }
      });
      widget.onClose(() => {
        setData(icon, PREFIX_TRIGGER_ICON, iconClosed);
      });
    }
  };

  // POPUP ------------------------------

  const fetchPopupPlacement = async (contentSize, containerView) => {
    const containerPosition = containerView.relative;
    const containerTop = containerPosition[S_TOP];
    const containerBottom = containerPosition[S_BOTTOM];
    const containerLeft = containerPosition[S_LEFT];
    const containerRight = containerPosition[S_RIGHT];
    const containerHMiddle = containerPosition.hMiddle;
    const containerVMiddle = containerPosition.vMiddle;
    const vpSize = await fetchViewportSize();
    const popupWidth = contentSize.border[S_WIDTH] / vpSize[S_WIDTH];
    const popupHeight = contentSize.border[S_HEIGHT] / vpSize[S_HEIGHT];

    // - Find the maximum of these quantities:
    //   - containerTop - popupHeight:
    //     the space on top if placed on top-(left|right|)
    //   - 1 - (containerBottom + popupHeight):
    //     the space on bottom be if placed on bottom-(left|right|)
    //   - containerLeft - popupWidth:
    //     the space on left if placed on left-(top|bottom|)
    //   - 1 - (containerRight + popupWidth):
    //     the space on right if placed on right-(top|bottom|)
    //
    // This determines the main placement: top|bottom|left|right

    // Then to determine secondary alignment:
    // - For top/bottom placement, determine horizontal alignment:
    //   - Find the maximum of these quantities:
    //     - 1 - (containerLeft + popupWidth):
    //       the space on right if left-aligned
    //     - containerRight - popupWidth:
    //       the space on left if right-aligned
    //     - min(
    //           containerHMiddle - popupWidth / 2,
    //           1 - (containerHMiddle + popupWidth / 2),
    //       ):
    //       the minimum of the space on either left or right if center-aligned
    //
    // - For left/right placement, determine vertical alignment:
    //   - Find the maximum of these quantities:
    //     - 1 - (containerTop + popupHeight):
    //       the space on bottom if top-aligned
    //     - containerBottom - popupHeight:
    //       the space on top if bottom-aligned
    //     - min(
    //           containerVMiddle - popupHeight / 2,
    //           1 - (containerVMiddle + popupHeight / 2),
    //       ):
    //       the minimum of the space on either top or bottom if center-aligned

    const placementVars = {
      top: containerTop - popupHeight,
      bottom: 1 - (containerBottom + popupHeight),
      left: containerLeft - popupWidth,
      right: 1 - (containerRight + popupWidth)
    };
    const placement = keyWithMaxVal(placementVars);
    if (placement === undefined) {
      // container must be out-view and so left/right are NaN
      return;
    }
    let finalPlacement = placement;
    let alignmentVars;
    switch (placement) {
      case S_TOP:
      case S_BOTTOM:
        alignmentVars = {
          left: 1 - (containerLeft + popupWidth),
          right: containerRight - popupWidth,
          middle: min(containerHMiddle - popupWidth / 2, 1 - (containerHMiddle + popupWidth / 2))
        };
        break;
      case S_LEFT:
      case S_RIGHT:
        alignmentVars = {
          top: 1 - (containerTop + popupHeight),
          bottom: containerBottom - popupHeight,
          middle: min(containerVMiddle - popupHeight / 2, 1 - (containerVMiddle + popupHeight / 2))
        };
        break;
      default:
        return;
    }
    const alignment = keyWithMaxVal(alignmentVars);
    if (alignment !== "middle") {
      finalPlacement += "-" + alignment;
    }
    return finalPlacement;
  };

  /**
   * @module Actions
   *
   * @categoryDescription Controlling openables
   * {@link Open} opens or closes the {@link Openable} widget setup for the given
   * element.
   */


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
  class Open {
    /**
     * Opens the Openable widget setup for the element.
     */

    /**
     * Closes the Openable widget setup for the element.
     */

    /**
     * Toggles the Openable widget setup for the element.
     */

    static register() {
      registerAction("open", element => new Open(element));
    }
    constructor(element) {
      const open = widget => widget === null || widget === void 0 ? void 0 : widget.open();
      const close = widget => widget === null || widget === void 0 ? void 0 : widget.close();
      const toggle = widget => widget === null || widget === void 0 ? void 0 : widget.toggle();
      const widgetPromise = fetchUniqueWidget("openable", element, Openable);
      this.do = () => widgetPromise.then(open);
      this.undo = () => widgetPromise.then(close);
      this[S_TOGGLE] = () => widgetPromise.then(toggle);
    }
  }

  /**
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
  class Pager extends Widget {
    /**
     * Advances the widget's page by 1. If the current page is the last one,
     * nothing is done, unless {@link PagerConfig.fullscreen} is true in which
     * case the pager's scrollable ancestor will be scrolled down/right
     * (depending on the gesture direction).
     */

    /**
     * Reverses the widget's page by 1. If the current page is the first one,
     * nothing is done, unless {@link PagerConfig.fullscreen} is true in which
     * case the pager's scrollable ancestor will be scrolled up/left
     * (depending on the gesture direction).
     */

    /**
     * Advances the widget to the given page. Note that page numbers start at 1.
     *
     * If this page is disabled, nothing is done.
     */

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

    /**
     * Re-enables the given page number. Note that page numbers start at 1.
     */

    /**
     * Re-enables the given page if it is disabled, otherwise disables it. Note
     * that page numbers start at 1.
     */

    /**
     * Returns true if the given page number is disabled. Note that page
     * numbers start at 1.
     */

    /**
     * Returns the current page.
     */

    /**
     * Returns the previous page, before the last transition.
     *
     * If there has been no change of page, returns the first page, same as
     * {@link getCurrentPageNum}.
     */

    /**
     * Returns the number of the current page. Note that numbers start at 1.
     */

    /**
     * Returns the number of the previous page, before the last transition. Note
     * that numbers start at 1.
     *
     * If there has been no change of page, returns the number of the first page,
     * same as {@link getCurrentPageNum}.
     */

    /**
     * The given handler will be called whenever there is a change of page. It
     * will be called after the current page number is updated internally (so
     * {@link getPreviousPageNum} and {@link getCurrentPageNum} will return the
     * updated numbers), but before the page transition styles are updated.
     *
     * If the handler returns a promise, it will be awaited upon.
     */

    /**
     * Returns the page elements.
     */

    /**
     * Returns the toggle elements if any.
     */

    /**
     * Returns the switch elements if any.
     */

    static get(element) {
      const instance = super.get(element, DUMMY_ID$a);
      if (isInstanceOf(instance, Pager)) {
        return instance;
      }
      return null;
    }
    static register() {
      registerWidget(WIDGET_NAME$a, (element, config) => {
        if (!Pager.get(element)) {
          return new Pager(element, config);
        }
        return null;
      }, configValidator$8);
    }

    /**
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If there are less than 2 pages given or found, or if any
     *                page is not a descendant of the main pager element.
     */
    constructor(element, config) {
      var _Pager$get, _config$nextSwitch, _config$prevSwitch;
      const destroyPromise = (_Pager$get = Pager.get(element)) === null || _Pager$get === void 0 ? void 0 : _Pager$get.destroy();
      super(element, {
        id: DUMMY_ID$a
      });
      const pages = (config === null || config === void 0 ? void 0 : config.pages) || [];
      const toggles = (config === null || config === void 0 ? void 0 : config.toggles) || [];
      const switches = (config === null || config === void 0 ? void 0 : config.switches) || [];
      const nextPrevSwitch = {
        _next: (_config$nextSwitch = config === null || config === void 0 ? void 0 : config.nextSwitch) !== null && _config$nextSwitch !== void 0 ? _config$nextSwitch : null,
        _prev: (_config$prevSwitch = config === null || config === void 0 ? void 0 : config.prevSwitch) !== null && _config$prevSwitch !== void 0 ? _config$prevSwitch : null
      };
      const pageSelector = getDefaultWidgetSelector(PREFIX_PAGE__FOR_SELECT);
      const toggleSelector = getDefaultWidgetSelector(PREFIX_TOGGLE__FOR_SELECT);
      const switchSelector = getDefaultWidgetSelector(PREFIX_SWITCH__FOR_SELECT);
      const nextSwitchSelector = getDefaultWidgetSelector(PREFIX_NEXT_SWITCH__FOR_SELECT);
      const prevSwitchSelector = getDefaultWidgetSelector(PREFIX_PREV_SWITCH__FOR_SELECT);
      if (!lengthOf(pages)) {
        pages.push(...querySelectorAll(element, pageSelector));
        if (!lengthOf(pages)) {
          pages.push(...getVisibleContentChildren(element).filter(e => !e.matches(switchSelector)));
        }
      }
      if (!lengthOf(toggles)) {
        toggles.push(...querySelectorAll(element, toggleSelector));
      }
      if (!lengthOf(switches)) {
        switches.push(...querySelectorAll(element, switchSelector));
      }
      if (!nextPrevSwitch._next) {
        nextPrevSwitch._next = querySelector(element, nextSwitchSelector);
      }
      if (!nextPrevSwitch._prev) {
        nextPrevSwitch._prev = querySelector(element, prevSwitchSelector);
      }
      const numPages = lengthOf(pages);
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
        _nextPrevSwitch: nextPrevSwitch
      };
      const methods = getMethods$2(this, components, element, config);
      (destroyPromise || promiseResolve()).then(() => {
        if (this.isDestroyed()) {
          return;
        }
        init$4(this, element, components, config, methods);
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

  // Swiping on some trackpads results in "trailing" wheel events sent for some
  // while which results in multiple pages being advanced in a short while. So we
  // limit how often pages can be advanced.
  const MIN_TIME_BETWEEN_WHEEL = 1000;
  const S_CURRENT = "current";
  const S_ARIA_CURRENT = ARIA_PREFIX + S_CURRENT;
  const S_COVERED = "covered";
  const S_NEXT = "next";
  const S_TOTAL_PAGES = "total-pages";
  const S_VISIBLE_PAGES = "visible-pages";
  const S_CURRENT_PAGE = "current-page";
  const S_PAGE_NUMBER = "page-number";
  const WIDGET_NAME$a = "pager";
  const PREFIXED_NAME$6 = prefixName(WIDGET_NAME$a);
  const PREFIX_ROOT$5 = `${PREFIXED_NAME$6}__root`;
  const PREFIX_PAGE_CONTAINER = `${PREFIXED_NAME$6}__page-container`;

  // Use different classes for styling items to the one used for auto-discovering
  // them, so that re-creating existing widgets can correctly find the items to
  // be used by the new widget synchronously before the current one is destroyed.
  const PREFIX_PAGE = `${PREFIXED_NAME$6}__page`;
  const PREFIX_PAGE__FOR_SELECT = `${PREFIXED_NAME$6}-page`;
  const PREFIX_TOGGLE__FOR_SELECT = `${PREFIXED_NAME$6}-toggle`;
  const PREFIX_SWITCH__FOR_SELECT = `${PREFIXED_NAME$6}-switch`;
  const PREFIX_NEXT_SWITCH__FOR_SELECT = `${PREFIXED_NAME$6}-next-switch`;
  const PREFIX_PREV_SWITCH__FOR_SELECT = `${PREFIXED_NAME$6}-prev-switch`;
  const PREFIX_STYLE = `${PREFIXED_NAME$6}-style`;
  const PREFIX_IS_FULLSCREEN = prefixName("is-fullscreen");
  const PREFIX_USE_PARALLAX = prefixName("use-parallax");
  const PREFIX_TOTAL_PAGES = prefixName(S_TOTAL_PAGES);
  const PREFIX_VISIBLE_PAGES = prefixName(S_VISIBLE_PAGES);
  const PREFIX_CURRENT_PAGE = prefixName(S_CURRENT_PAGE);
  const PREFIX_CURRENT_PAGE_IS_LAST = `${PREFIX_CURRENT_PAGE}-is-last`;
  const PREFIX_CURRENT_PAGE_IS_FIRST_ENABLED = `${PREFIX_CURRENT_PAGE}-is-first-enabled`;
  const PREFIX_CURRENT_PAGE_IS_LAST_ENABLED = `${PREFIX_CURRENT_PAGE_IS_LAST}-enabled`;
  const PREFIX_PAGE_STATE = prefixName("page-state");
  const PREFIX_PAGE_NUMBER = prefixName(S_PAGE_NUMBER);
  const VAR_CURRENT_PAGE = prefixCssJsVar(S_CURRENT_PAGE);
  const VAR_TOTAL_PAGES = prefixCssJsVar(S_TOTAL_PAGES);
  const VAR_VISIBLE_PAGES = prefixCssJsVar(S_VISIBLE_PAGES);
  const VAR_VISIBLE_GAPS = prefixCssJsVar("visible-gaps");
  const VAR_TRANSLATED_PAGES = prefixCssJsVar("translated-pages");
  const VAR_TRANSLATED_GAPS = prefixCssJsVar("translated-gaps");
  const VAR_PAGE_NUMBER = prefixCssJsVar(S_PAGE_NUMBER);

  // Only one Pager widget per element is allowed, but Widget requires a
  // non-blank ID.
  const DUMMY_ID$a = PREFIXED_NAME$6;
  const SUPPORTED_STYLES = ["slider", "carousel", "tabs"];
  const isValidStyle = value => includes(SUPPORTED_STYLES, value);
  const configValidator$8 = {
    initialPage: validateNumber,
    style: (key, value) => validateString(key, value, isValidStyle),
    pageSize: validateNumber,
    peek: validateBoolean,
    fullscreen: validateBoolean,
    parallax: validateBoolean,
    horizontal: validateBoolean,
    useGestures: (key, value) => {
      if (isNullish(value)) {
        return undefined;
      }
      const bool = toBoolean(value);
      if (bool !== null) {
        return bool;
      }
      return validateStrList("useGestures", validateString(key, value), isValidInputDevice) || true;
    },
    alignGestureDirection: validateBoolean,
    preventDefault: validateBoolean
  };
  const fetchClosestScrollable = element => waitForMeasureTime().then(() => {
    var _getClosestScrollable;
    return (_getClosestScrollable = getClosestScrollable(element, {
      active: true
    })) !== null && _getClosestScrollable !== void 0 ? _getClosestScrollable : undefined;
  });
  const setPageNumber = (components, pageNum) => {
    let lastPromise = promiseResolve();
    for (const el of [components._pages[pageNum - 1], components._toggles[pageNum - 1], components._switches[pageNum - 1]]) {
      if (el) {
        setData(el, PREFIX_PAGE_NUMBER, pageNum + "");
        lastPromise = setStyleProp(el, VAR_PAGE_NUMBER, pageNum + "");
      }
    }
    return lastPromise;
  };
  const setPageState = async (components, pageNum, state) => {
    for (const el of [components._pages[pageNum - 1], components._toggles[pageNum - 1], components._switches[pageNum - 1]]) {
      if (el) {
        await setData(el, PREFIX_PAGE_STATE, state);
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
    setStyleProp(pagerEl, VAR_CURRENT_PAGE, pageNumbers._current + "");
    setData(pagerEl, PREFIX_CURRENT_PAGE, pageNumbers._current + "");
    setBooleanData(pagerEl, PREFIX_CURRENT_PAGE_IS_LAST, pageNumbers._current === pageNumbers._total);
    setBooleanData(pagerEl, PREFIX_CURRENT_PAGE_IS_FIRST_ENABLED, isFirstEnabled);
    return setBooleanData(pagerEl, PREFIX_CURRENT_PAGE_IS_LAST_ENABLED, isLastEnabled);
  };
  const init$4 = (widget, element, components, config, methods) => {
    var _config$initialPage, _config$pageSize, _config$peek, _config$fullscreen, _config$parallax, _config$horizontal, _config$useGestures, _config$alignGestureD, _config$preventDefaul;
    const logger = result ? new result.Logger({
      name: `Pager-${formatAsString(element)}`,
      logAtCreation: config
    }) : null;
    const pages = components._pages;
    const toggles = components._toggles;
    const switches = components._switches;
    const nextSwitch = components._nextPrevSwitch._next;
    const prevSwitch = components._nextPrevSwitch._prev;
    const pageContainer = parentOf(pages[0]);
    let initialPage = toInt((_config$initialPage = config === null || config === void 0 ? void 0 : config.initialPage) !== null && _config$initialPage !== void 0 ? _config$initialPage : 1);
    const pagerStyle = (config === null || config === void 0 ? void 0 : config.style) || "slider";
    const isCarousel = pagerStyle === "carousel";
    const minPageSize = (_config$pageSize = config === null || config === void 0 ? void 0 : config.pageSize) !== null && _config$pageSize !== void 0 ? _config$pageSize : 300;
    const enablePeek = (_config$peek = config === null || config === void 0 ? void 0 : config.peek) !== null && _config$peek !== void 0 ? _config$peek : false;
    const isFullscreen = (_config$fullscreen = config === null || config === void 0 ? void 0 : config.fullscreen) !== null && _config$fullscreen !== void 0 ? _config$fullscreen : false;
    const isParallax = (_config$parallax = config === null || config === void 0 ? void 0 : config.parallax) !== null && _config$parallax !== void 0 ? _config$parallax : false;
    const isHorizontal = (_config$horizontal = config === null || config === void 0 ? void 0 : config.horizontal) !== null && _config$horizontal !== void 0 ? _config$horizontal : false;
    const orientation = isHorizontal ? S_HORIZONTAL : S_VERTICAL;
    const useGestures = (_config$useGestures = config === null || config === void 0 ? void 0 : config.useGestures) !== null && _config$useGestures !== void 0 ? _config$useGestures : true;
    const alignGestureDirection = (_config$alignGestureD = config === null || config === void 0 ? void 0 : config.alignGestureDirection) !== null && _config$alignGestureD !== void 0 ? _config$alignGestureD : false;
    const preventDefault = (_config$preventDefaul = config === null || config === void 0 ? void 0 : config.preventDefault) !== null && _config$preventDefaul !== void 0 ? _config$preventDefaul : true;
    const scrollWatcher = ScrollWatcher.reuse();
    const sizeWatcher = isCarousel ? SizeWatcher.reuse({
      resizeThreshold: 10
    }) : null;
    const gestureWatcher = useGestures ? GestureWatcher.reuse() : null;
    const viewWatcher = isFullscreen ? ViewWatcher.reuse({
      rootMargin: "0px",
      threshold: 0.3
    }) : null;
    const recalculateCarouselProps = async (t, data) => {
      if (data) {
        // there's been a resize
        const gap = parseFloat(await getComputedStyleProp(element, "gap")) || 0;
        const containerSize = data.content[isHorizontal ? S_WIDTH : S_HEIGHT];
        const getNumVisiblePages = (addPeek = false) => numVisiblePages = max(1,
        // at least 1
        min(floor((containerSize + gap - (addPeek ? 0.5 * minPageSize : 0)) / (minPageSize + gap)), numPages // and at most total number
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
        numTranslated = max(0, visibleStart - 1 - (isAtEdge ? 0.5 : 0.25));
      } else {
        numTranslated = (prevPageNum > currPageNum ? floor : ceil)(visibleStart) - 1;
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
      setData(element, PREFIX_VISIBLE_PAGES, fractionalNumVisiblePages + "");
      setStyleProp(element, VAR_VISIBLE_PAGES, fractionalNumVisiblePages + "");
      setStyleProp(element, VAR_VISIBLE_GAPS, numVisibleGaps + "");
      setStyleProp(element, VAR_TRANSLATED_PAGES, numTranslated + "");
      setStyleProp(element, VAR_TRANSLATED_GAPS, floor(numTranslated) + "");
    };
    const getGestureOptions = directions => {
      return {
        devices: isBoolean(useGestures) // i.e. true; if it's false, then gestureWatcher is null
        ? undefined // all devices
        : useGestures,
        intents: [S_DRAG, S_SCROLL],
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
      const swapDirection = data.intent === S_DRAG;
      if (includes([S_LEFT, S_UP], data.direction)) {
        (swapDirection ? methods._nextPage : methods._prevPage)(data);
      } else {
        (swapDirection ? methods._prevPage : methods._nextPage)(data);
      }
    };
    const addWatchers = () => {
      gestureWatcher === null || gestureWatcher === void 0 || gestureWatcher.onGesture(element, transitionOnGesture, getGestureOptions(alignGestureDirection ? isHorizontal ? [S_LEFT, S_RIGHT] : [S_UP, S_DOWN] : undefined // all directions
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
      const target = currentTargetOf(event);
      return isElement(target) ? toInt(getData(target, PREFIX_PAGE_NUMBER)) : 0;
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
      await waitForMutateTime();
      delDataNow(element, PREFIX_ORIENTATION);
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
      for (let idx = 0; idx < lengthOf(pages); idx++) {
        removeClassesNow(pages[idx], PREFIX_PAGE);
        for (const [el, listener] of [[pages[idx], null], [toggles[idx], toggleClickListener], [switches[idx], switchClickListener]]) {
          if (el) {
            delDataNow(el, PREFIX_PAGE_STATE);
            delDataNow(el, PREFIX_PAGE_NUMBER);
            delStylePropNow(el, VAR_PAGE_NUMBER);
            if (listener) {
              removeEventListenerFrom(el, S_CLICK, listener);
            }
          }
        }
        delAttr(pages[idx], S_ARIA_CURRENT);
      }
      if (nextSwitch) {
        removeEventListenerFrom(nextSwitch, S_CLICK, nextSwitchClickListener);
      }
      if (prevSwitch) {
        removeEventListenerFrom(prevSwitch, S_CLICK, prevSwitchClickListener);
      }
      removeClassesNow(element, PREFIX_ROOT$5);
      if (pageContainer) {
        removeClassesNow(pageContainer, PREFIX_PAGE_CONTAINER);
      }
    });
    if (isCarousel) {
      widget.onTransition(() => recalculateCarouselProps());
    }
    addWatchers();
    addClasses(element, PREFIX_ROOT$5);
    if (pageContainer) {
      addClasses(pageContainer, PREFIX_PAGE_CONTAINER);
    }
    const numPages = lengthOf(pages);
    let numVisiblePages = numPages;
    setData(element, PREFIX_ORIENTATION, orientation);
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
      for (const [el, listener] of [[toggles[idx], toggleClickListener], [switches[idx], switchClickListener]]) {
        if (el) {
          addEventListenerTo(el, S_CLICK, listener);
        }
      }
    }
    if (nextSwitch) {
      addEventListenerTo(nextSwitch, S_CLICK, nextSwitchClickListener);
    }
    if (prevSwitch) {
      addEventListenerTo(prevSwitch, S_CLICK, prevSwitchClickListener);
    }
    if (initialPage < 1 || initialPage > numPages) {
      initialPage = 1;
    }
    methods._goToPage(initialPage);
  };
  const getMethods$2 = (widget, components, element, config) => {
    const pages = components._pages;
    const scrollWatcher = ScrollWatcher.reuse();
    const isFullscreen = config === null || config === void 0 ? void 0 : config.fullscreen;
    const disabledPages = {};
    const callbacks = newSet();
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
      if ((gestureData === null || gestureData === void 0 ? void 0 : gestureData.device) !== S_WHEEL) {
        return true;
      }
      const timeNow$1 = timeNow();
      if (timeNow$1 - lastTransition > MIN_TIME_BETWEEN_WHEEL) {
        lastTransition = timeNow$1;
        return true;
      }
      return false;
    };
    const goToPage = async (pageNum, gestureData) => {
      pageNum = toInt(pageNum, -1);
      if (pageNum === currPageNum || !canTransition(gestureData)) {
        return;
      }
      const numPages = lengthOf(pages);
      if (currPageNum === 1 && pageNum === 0 || currPageNum === numPages && pageNum === numPages + 1) {
        // next/prev page beyond last/first
        if (isFullscreen) {
          scrollWatcher.scroll(pageNum ? (gestureData === null || gestureData === void 0 ? void 0 : gestureData.direction) === S_RIGHT ? S_RIGHT : S_DOWN : (gestureData === null || gestureData === void 0 ? void 0 : gestureData.direction) === S_LEFT ? S_LEFT : S_UP, await fetchScrollOptions()); // no need to await
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
      delAttr(pages[lastPageNum - 1], S_ARIA_CURRENT);
      for (let n = lastPageNum; n !== currPageNum; currPageNum < lastPageNum ? n-- : n++) {
        if (!isPageDisabled(n)) {
          setPageState(components, n, currPageNum < lastPageNum ? S_NEXT : S_COVERED);
        }
      }
      setCurrentPage(element, {
        _current: currPageNum,
        _total: numPages
      }, isPageDisabled);
      setAttr(pages[currPageNum - 1], S_ARIA_CURRENT);
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
      pageNum = toInt(pageNum);
      if (widget.isDisabled() || pageNum < 1 || pageNum > lengthOf(pages)) {
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
        _total: lengthOf(pages)
      }, isPageDisabled);
      await setPageState(components, pageNum, S_DISABLED);
    };
    const enablePage = async pageNum => {
      pageNum = toInt(pageNum);
      if (widget.isDisabled() || !isPageDisabled(pageNum)) {
        return;
      }

      // set immediately for toggle to work without awaiting on it
      disabledPages[pageNum] = false;
      setCurrentPage(element, {
        _current: currPageNum,
        _total: lengthOf(pages)
      }, isPageDisabled);
      await setPageState(components, pageNum, pageNum < currPageNum ? S_COVERED : S_NEXT);
    };
    const togglePage = pageNum => isPageDisabled(pageNum) ? enablePage(pageNum) : disablePage(pageNum);
    const onTransition = handler => callbacks.add(wrapCallback(handler));
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
      _getCurrentPageNum: () => lengthOf(pages) > 0 ? currPageNum : 0,
      _getPreviousPageNum: () => lengthOf(pages) > 0 ? lastPageNum : 0,
      _onTransition: onTransition
    };
  };

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
  class NextPage {
    /**
     * Advances the pager by one page.
     */

    /**
     * Reverses the pager by one page.
     */

    /**
     * Undoes the last action: reverses the pager if {@link do} was last called
     * or advances it otherwise.
     */

    static register() {
      registerAction("next-page", element => new NextPage(element));
    }
    constructor(element) {
      let toggleState = false;
      const {
        _nextPage,
        _prevPage
      } = getMethods$1(element);
      this.do = () => {
        toggleState = true;
        return _nextPage();
      };
      this.undo = () => {
        toggleState = false;
        return _prevPage();
      };
      this[S_TOGGLE] = () => {
        const method = toggleState ? _prevPage : _nextPage;
        toggleState = !toggleState;
        return method();
      };
    }
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
  class PrevPage {
    /**
     * Reverses the pager by one page.
     */

    /**
     * Advances the pager by one page.
     */

    /**
     * Undoes the last action: advances the pager if {@link do} was last called
     * or reverses it otherwise.
     */

    static register() {
      registerAction("prev-page", element => new PrevPage(element));
    }
    constructor(element) {
      let toggleState = false;
      const {
        _nextPage,
        _prevPage
      } = getMethods$1(element);
      this.do = () => {
        toggleState = true;
        return _prevPage();
      };
      this.undo = () => {
        toggleState = false;
        return _nextPage();
      };
      this[S_TOGGLE] = () => {
        const method = toggleState ? _nextPage : _prevPage;
        toggleState = !toggleState;
        return method();
      };
    }
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
  class GoToPage {
    /**
     * Goes to the page number given to the constructor. Numbers start at 1.
     */

    /**
     * Goes to the last saved page number before the action was {@link do}ne. If
     * the action had never been done, does nothing.
     */

    /**
     * Goes to the page number given to the constructor, or if already at this
     * number, goes to the last saved page if any. Numbers start at 1.
     */

    static register() {
      registerAction("go-to-page", (element, args) => new GoToPage(element, toInt(args[0])));
    }
    constructor(element, pageNum) {
      if (!pageNum) {
        throw usageError("Target page is required");
      }
      const {
        _goToPage
      } = getMethods$1(element);
      this.do = () => _goToPage(pageNum);
      this.undo = () => _goToPage(-1);
      this[S_TOGGLE] = () => _goToPage(pageNum, -1);
    }
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
  class EnablePage {
    /**
     * Enables the page number given to the constructor. Numbers start at 1.
     */

    /**
     * Disables the page number given to the constructor. Numbers start at 1.
     */

    /**
     * Enables the page number given to the constructor, if it is disabled,
     * otherwise disables it. Numbers start at 1.
     */

    static register() {
      registerAction("enable-page", (element, args) => new EnablePage(element, toInt(args[0])));
    }
    constructor(element, pageNum) {
      if (!pageNum) {
        throw usageError("Target page number is required");
      }
      const {
        _enablePage,
        _disablePage,
        _togglePage
      } = getMethods$1(element);
      _disablePage(pageNum); // initial state

      this.do = () => _enablePage(pageNum);
      this.undo = () => _disablePage(pageNum);
      this[S_TOGGLE] = () => _togglePage(pageNum);
    }
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
  class DisablePage {
    /**
     * Disables the page number given to the constructor. Numbers start at 1.
     */

    /**
     * Enables the page number given to the constructor. Numbers start at 1.
     */

    /**
     * Disables the page number given to the constructor, if it is enabled,
     * otherwise enables it. Numbers start at 1.
     */

    static register() {
      registerAction("disable-page", (element, args) => new DisablePage(element, toInt(args[0])));
    }
    constructor(element, pageNum) {
      if (!pageNum) {
        throw usageError("Target page number is required");
      }
      const {
        _enablePage,
        _disablePage,
        _togglePage
      } = getMethods$1(element);
      _enablePage(pageNum); // initial state

      this.do = () => _disablePage(pageNum);
      this.undo = () => _enablePage(pageNum);
      this[S_TOGGLE] = () => _togglePage(pageNum);
    }
  }

  // --------------------

  const getMethods$1 = element => {
    let lastPageNum = null;
    const nextPage = widget => widget === null || widget === void 0 ? void 0 : widget.nextPage();
    const prevPage = widget => widget === null || widget === void 0 ? void 0 : widget.prevPage();
    const goToPage = async (widget, pageNum, altPageNum) => {
      const currentNum = widget === null || widget === void 0 ? void 0 : widget.getCurrentPageNum();
      let targetNum = currentNum === pageNum ? altPageNum : pageNum;
      if (targetNum === -1) {
        targetNum = lastPageNum;
      }
      if (targetNum) {
        if (pageNum !== -1) {
          // save the current number unless this is "undo"
          lastPageNum = currentNum;
        }
        await (widget === null || widget === void 0 ? void 0 : widget.goToPage(targetNum));
      }
    };
    const enablePage = (widget, pageNum) => widget === null || widget === void 0 ? void 0 : widget.enablePage(pageNum);
    const disablePage = (widget, pageNum) => widget === null || widget === void 0 ? void 0 : widget.disablePage(pageNum);
    const togglePage = (widget, pageNum) => widget === null || widget === void 0 ? void 0 : widget.togglePage(pageNum);
    const widgetPromise = fetchUniqueWidget("pager", element, Pager);
    return {
      _nextPage: () => widgetPromise.then(nextPage),
      _prevPage: () => widgetPromise.then(prevPage),
      _goToPage: (pageNum, altPageNum = null) => widgetPromise.then(w => goToPage(w, pageNum, altPageNum)),
      _enablePage: pageNum => widgetPromise.then(w => enablePage(w, pageNum)),
      _disablePage: pageNum => widgetPromise.then(w => disablePage(w, pageNum)),
      _togglePage: pageNum => widgetPromise.then(w => togglePage(w, pageNum))
    };
  };

  /**
   * @module
   * @ignore
   * @internal
   */

  var _actions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    AddClass: AddClass,
    Animate: Animate,
    AnimatePause: AnimatePause,
    AnimatePlay: AnimatePlay,
    Disable: Disable,
    DisablePage: DisablePage,
    Display: Display,
    Enable: Enable,
    EnablePage: EnablePage,
    GoToPage: GoToPage,
    Hide: Hide,
    NextPage: NextPage,
    Open: Open,
    PrevPage: PrevPage,
    RemoveClass: RemoveClass,
    Run: Run,
    ScrollTo: ScrollTo,
    SetAttribute: SetAttribute,
    Show: Show,
    Undisplay: Undisplay,
    fetchAction: fetchAction,
    registerAction: registerAction
  });

  /**
   * @module Triggers
   *
   * @categoryDescription Input
   * {@link CheckTrigger} allows you to run actions when the user checks a target
   * checkbox input element, and undo those actions when they uncheck the checkbox.
   */

  /**
   * {@link CheckTrigger} allows you to run actions when the user checks a target
   * checkbox input element, and undo those actions when they uncheck the checkbox.
   *
   * -------
   *
   * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
   * specification.
   *
   * - Arguments: none
   * - Additional trigger options: none
   *   - `target`: A string element specification.
   *     See {@link Utils.getReferenceElement | getReferenceElement}.
   *
   * @example
   * Add classes `active` and `checked` when the user checks the checkbox,
   * remove them when unchecked.
   *
   * ```html
   * <input type="checkbox" data-lisn-on-check="@add-class=active,checked"/>
   * ```
   *
   * @example
   * As above, but using a CSS class instead of data attribute:
   *
   * ```html
   * <input type="checkbox" class="lisn-on-check--@add-class=active,checked"/>
   * ```
   *
   * @example
   * Play the animations on the element each time the user checks the next
   * element with class `checkbox` (do nothing when it's unchecked).
   *
   * ```html
   * <div data-lisn-on-check="@animate +one-way +target=next.checkbox"></div>
   * <input type="checkbox" class="checkbox"/>
   * ```
   *
   * @example
   * Add class `used` the first time the user checks the next element with class
   * `checkbox`, and play or reverse the animations 200ms after each time the
   * user toggles the reference checkbox.
   *
   * ```html
   * <div data-lisn-on-check="@add-class=used +once ;
   *                          @animate +delay=200 +target=next.checkbox"
   * ></div>
   * <input type="checkbox" class="checkbox"/>
   * ```
   *
   * @example
   * When the user checks the next element with class `checkbox` then add classes `c1`
   * and `c2` to the element (that the trigger is defined on) and enable trigger
   * `my-trigger` defined on this same element; undo all of that when the user unchecks
   * the reference checkbox.
   *
   * ```html
   * <div data-lisn-on-check="@add-class=c1,c2 @enable=my-trigger +target=next.checkbox"
   *      data-lisn-on-run="@show +id=my-trigger"
   * ></div>
   * <input type="checkbox" class="checkbox"/>
   * ```
   *
   * @example
   * As above, but using `data-lisn-ref` attribute instead of class selector.
   *
   * ```html
   * <div data-lisn-on-check="@add-class=c1,c2 @enable=my-trigger +target=next-checkbox"
   *      data-lisn-on-run="@show +id=my-trigger"
   * ></div>
   * <input type="checkbox" data-lisn-ref="checkbox"/>
   * ```
   *
   * @category Input
   */
  class CheckTrigger extends Trigger {
    static register() {
      registerTrigger("check", (element, args, actions, config) => new CheckTrigger(element, actions, config), newConfigValidator$7);
    }

    /**
     * If no actions are supplied, nothing is done.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the config is invalid.
     */
    constructor(element, actions, config) {
      var _MH$targetOf;
      super(element, actions, config);
      this.getConfig = () => copyObject(config);
      if (!lengthOf(actions)) {
        return;
      }
      const target = (_MH$targetOf = targetOf(config)) !== null && _MH$targetOf !== void 0 ? _MH$targetOf : element;
      if (!isInstanceOf(target, HTMLInputElement)) {
        return;
      }
      const onToggle = () => target.checked ? this.run() : this.reverse();
      addEventListenerTo(target, "change", onToggle);
      this.onDestroy(() => {
        removeEventListenerFrom(target, "change", onToggle);
      });
    }
  }

  /**
   * @category Input
   * @interface
   */

  // --------------------

  const newConfigValidator$7 = element => {
    return {
      target: (key, value) => {
        var _ref;
        return (_ref = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
      }
    };
  };

  /**
   * @module Triggers
   *
   * @categoryDescription Pointer
   * {@link ClickTrigger} allows you to run actions when a user clicks a target
   * element (first time and every other time, i.e. odd number of click), and undo
   * those actions when a user clicks the target element again (or every even
   * number of clicks). It always acts as a toggle.
   *
   * {@link PressTrigger} allows you to run actions when the user presses and
   * holds a pointing device (or their finger) on a target element, and undo those
   * actions when they release their pointing device or lift their finger off.
   *
   * {@link HoverTrigger} allows you to run actions when the user hovers overs a
   * target element, and undo those actions when their pointing device moves off
   * the target. On touch devices it acts just like {@link PressTrigger}.
   */

  /**
   * {@link ClickTrigger} allows you to run actions when a user clicks a target
   * element (first time and every other time, i.e. odd number of click), and
   * undo them when a user clicks the target element again (or every even number
   * of clicks). It always acts as a toggle.
   *
   * -------
   *
   * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
   * specification.
   *
   * - Arguments: none
   * - Additional trigger options: none
   *   - `target`: A string element specification.
   *     See {@link Utils.getReferenceElement | getReferenceElement}.
   *   - `prevent-default`: A boolean.
   *   - `prevent-select`: A boolean.
   *
   * @example
   * Add classes `active` and `toggled-on` when the user clicks the element
   * (first time and every other time, i.e. odd number of click), remove them
   * when clicked again (or even number of click);
   *
   * ```html
   * <div data-lisn-on-click="@add-class=active,toggled-on"></div>
   * ```
   *
   * @example
   * As above, but using a CSS class instead of data attribute:
   *
   * ```html
   * <div class="lisn-on-click--@add-class=active,toggled-on"></div>
   * ```
   *
   * @example
   * Play the animations on the element 1000ms after the first time the user
   * clicks it.
   *
   * ```html
   * <div data-lisn-on-click="@animate +once +delay=1000"></div>
   * ```
   *
   * @example
   * Add class `visited` the first time the user clicks the element, and play or
   * reverse the animations on the element 1000ms after each time the user clicks
   * it.
   *
   * ```html
   * <div data-lisn-on-click="@add-class=visited +once ;
   *                          @animate +delay=1000"
   * ></div>
   * ```
   *
   * @example
   * When the user clicks the next element with class `box` then add classes `c1`
   * and `c2` to the element (that the trigger is defined on) and enable trigger
   * `my-trigger` defined on this same element; undo all of that on even number
   * of clicks on the reference box element.
   *
   * ```html
   * <div data-lisn-on-click="@add-class=c1,c2 @enable=my-trigger +target=next.box"
   *      data-lisn-on-run="@show +id=my-trigger"
   * ></div>
   * <div class="box"></div>
   * ```
   *
   * @example
   * As above, but using `data-lisn-ref` attribute instead of class selector.
   *
   * ```html
   * <div data-lisn-on-click="@add-class=c1,c2 @enable=my-trigger +target=next-box"
   *      data-lisn-on-run="@show +id=my-trigger"
   * ></div>
   * <div data-lisn-ref="box"></div>
   * ```
   *
   * @category Pointer
   */
  class ClickTrigger extends Trigger {
    static register() {
      registerTrigger(S_CLICK, (element, args, actions, config) => new ClickTrigger(element, actions, config), newConfigValidator$6);
    }

    /**
     * If no actions are supplied, nothing is done.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the config is invalid.
     */
    constructor(element, actions, config) {
      super(element, actions, config);
      this.getConfig = () => copyObject(config);
      setupWatcher(this, element, actions, config, S_CLICK);
    }
  }

  /**
   * {@link PressTrigger} allows you to run actions when the user presses and
   * holds a pointing device (or their finger) on a target element, and undo
   * those actions when they release their pointing device or lift their finger
   * off.
   *
   * -------
   *
   * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
   * specification.
   *
   * - Arguments: none
   * - Additional trigger options: none
   *   - `target`: A string element specification.
   *     See {@link Utils.getReferenceElement | getReferenceElement}.
   *   - `prevent-default`: boolean
   *   - `prevent-select`: boolean
   *
   * @example
   * Add classes `active` and `pressed` when the user presses and holds (with
   * mouse, finger or any pointer) the element, remove them when they release
   * the mouse.
   *
   * ```html
   * <div data-lisn-on-press="@add-class=active,pressed"></div>
   * ```
   *
   * @example
   * As above, but using a CSS class instead of data attribute:
   *
   * ```html
   * <div class="lisn-on-press--@add-class=active,pressed"></div>
   * ```
   *
   * @example
   * Play the animations on the element 1000ms after the first time the user
   * presses on the element it.
   *
   * ```html
   * <div data-lisn-on-press="@animate +once +delay=1000"></div>
   * ```
   *
   * @example
   * Add class `pressed` the first time the user presses on the element, and
   * play the animations on the element while the user is pressing on the element
   * with a delay of 100ms, reverse the animations as soon as the user releases
   * the mouse.
   *
   * ```html
   * <div data-lisn-on-click="@add-class=pressed +once ;
   *                          @animate +do-delay=100"
   * ></div>
   * ```
   *
   * @example
   * When the user presses and holds the next element with class `box` then add
   * classes `c1` and `c2` to the element (that the trigger is defined on) and
   * enable trigger `my-trigger` defined on this same element; undo all of that
   * when they release the mouse (or lift their finger/pointer device) from the
   * reference box element.
   *
   * ```html
   * <div data-lisn-on-press="@add-class=c1,c2 @enable=my-trigger +target=next.box"
   *      data-lisn-on-run="@show +id=my-trigger"
   * ></div>
   * <div class="box"></div>
   * ```
   *
   * @example
   * As above, but using `data-lisn-ref` attribute instead of class selector.
   *
   * ```html
   * <div data-lisn-on-press="@add-class=c1,c2 @enable=my-trigger +target=next-box"
   *      data-lisn-on-run="@show +id=my-trigger"
   * ></div>
   * <div data-lisn-ref="box"></div>
   * ```
   *
   * @category Pointer
   */
  class PressTrigger extends Trigger {
    static register() {
      registerTrigger(S_PRESS, (element, args, actions, config) => new PressTrigger(element, actions, config), newConfigValidator$6);
    }

    /**
     * If no actions are supplied, nothing is done.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the config is invalid.
     */
    constructor(element, actions, config) {
      super(element, actions, config);
      this.getConfig = () => copyObject(config);
      setupWatcher(this, element, actions, config, S_PRESS);
    }
  }

  /**
   * {@link HoverTrigger} allows you to run actions when the user hovers overs
   * a target element, and undo those actions when their pointing device moves
   * off the target. On touch devices it acts just like {@link PressTrigger}.
   *
   * -------
   *
   * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
   * specification.
   *
   * - Arguments: none
   * - Additional trigger options: none
   *   - `target`: A string element specification.
   *     See {@link Utils.getReferenceElement | getReferenceElement}.
   *   - `prevent-default`: boolean
   *   - `prevent-select`: boolean
   *
   * @example
   * Add classes `active` and `hovered` when the user hovers over the element,
   * remove them otherwise.
   *
   * ```html
   * <div data-lisn-on-hover="@add-class=active,hovered"></div>
   * ```
   *
   * @example
   * As above, but using a CSS class instead of data attribute:
   *
   * ```html
   * <div class="lisn-on-press--@add-class=active,hovered"></div>
   * ```
   *
   * @example
   * Play the animations on the element 1000ms after the first time the user
   * hovers over the element it.
   *
   * ```html
   * <div data-lisn-on-hover="@animate +once +delay=1000"></div>
   * ```
   *
   * @example
   * Add class `hovered` the first time the user hovers over the element, and
   * play the animations on the element while the user is hovering over the
   * element with a delay of 100ms, reverse the animations as soon as the user
   * mouse leaves the element.
   *
   * ```html
   * <div data-lisn-on-click="@add-class=hovered +once ;
   *                          @animate +do-delay=100"
   * ></div>
   * ```
   *
   * @example
   * When the user hovers over the next element with class `box` then add classes
   * `c1` and `c2` to the element (that the trigger is defined on) and enable
   * trigger `my-trigger` defined on this same element; undo all of that when
   * their pointing device (or finger) moves off the reference element.
   *
   * ```html
   * <div data-lisn-on-hover="@add-class=c1,c2 @enable=my-trigger +target=next.box"
   *      data-lisn-on-run="@show +id=my-trigger"
   * ></div>
   * <div class="box"></div>
   * ```
   *
   * @example
   * As above, but using `data-lisn-ref` attribute instead of class selector.
   *
   * ```html
   * <div data-lisn-on-hover="@add-class=c1,c2 @enable=my-trigger +target=next-box"
   *      data-lisn-on-run="@show +id=my-trigger"
   * ></div>
   * <div data-lisn-ref="box"></div>
   * ```
   *
   * @category Pointer
   */
  class HoverTrigger extends Trigger {
    static register() {
      registerTrigger(S_HOVER, (element, args, actions, config) => new HoverTrigger(element, actions, config), newConfigValidator$6);
    }

    /**
     * If no actions are supplied, nothing is done.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the config is invalid.
     */
    constructor(element, actions, config) {
      super(element, actions, config);
      this.getConfig = () => copyObject(config);
      setupWatcher(this, element, actions, config, S_HOVER);
    }
  }

  /**
   * @category Pointer
   * @interface
   */

  // --------------------

  const newConfigValidator$6 = element => {
    return {
      target: (key, value) => {
        var _ref;
        return (_ref = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
      },
      preventDefault: validateBoolean,
      preventSelect: validateBoolean
    };
  };
  const setupWatcher = (widget, element, actions, config, action) => {
    var _MH$targetOf;
    if (!lengthOf(actions)) {
      return;
    }
    config !== null && config !== void 0 ? config : config = {};
    const target = (_MH$targetOf = targetOf(config)) !== null && _MH$targetOf !== void 0 ? _MH$targetOf : element;

    // For clicks use the trigger's own toggle function so that it remembers ITS
    // state rather than the odd/even clicks. Otherwise if the trigger is
    // disabled, then clicking will "swap" the state.
    let startHandler;
    let endHandler;
    if (action === S_CLICK) {
      startHandler = endHandler = widget[S_TOGGLE];
    } else {
      startHandler = widget.run;
      endHandler = widget.reverse;
    }
    PointerWatcher.reuse().onPointer(target, startHandler, endHandler, merge({
      actions: action
    }, omitKeys(config, {
      target: null
    })));
  };

  /**
   * @module Triggers
   *
   * @categoryDescription Layout
   * {@link LayoutTrigger} allows you to run actions when the viewport or a
   * target element's width or aspect ratio matches a given specification, and
   * undo those actions when the target's width or aspect ratio no longer
   * matches.
   */

  /**
   * {@link LayoutTrigger} allows you to run actions when the viewport or a
   * target element's width or aspect ratio matches a given specification, and
   * undo those actions when the target's width or aspect ratio no longer
   * matches.
   *
   * -------
   *
   * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
   * specification.
   *
   * - Arguments (required): A single {@link DeviceSpec} or
   *   {@link AspectRatioSpec}. In this case you can use a dash ("-") instead of
   *   space if needed (for example if using CSS classes instead of data
   *   attributes), e.g. "min-tablet" instead of "min tablet".
   *
   * - Additional trigger options:
   *   - `root`: A string element specification. See
   *     {@link Utils.getReferenceElement | getReferenceElement}.
   *
   * @example
   * Show the element when the window width matches "tablet" breakpoint, hide
   * otherwise:
   *
   * ```html
   * <div data-lisn-on-layout="tablet @show"></div>
   * ```
   *
   * @example
   * As above, but using a CSS class instead of data attribute:
   *
   * ```html
   * <div class="lisn-on-layout--tablet@show"></div>
   * ```
   *
   * @example
   * Show the element 1000ms after the window width matches "tablet" breakpoint,
   * hide otherwise:
   *
   * ```html
   * <div data-lisn-on-layout="tablet @show +delay=1000"></div>
   * ```
   *
   * @example
   * Add class `tablet` when the window width is at least "tablet", hide
   * otherwise:
   *
   * ```html
   * <div data-lisn-on-layout="min tablet @add-class=tablet"></div>
   * ```
   *
   * @example
   * Add class `mobile` when the window width is "mobile" or mobile-wide, add
   * class `tablet`, when it's "tablet" and so on; undo that otherwise:
   *
   * ```html
   * <div data-lisn-on-layout="max mobile-wide @add-class=mobile ;
   *                           tablet @add-class=tablet ;
   *                           desktop @add-class=desktop"
   * ></div>
   * ```
   *
   * @example
   * Show the element when window width is at least "mobile-wide" and at most
   * "tablet", hide otherwise:
   *
   * ```html
   * <div data-lisn-on-layout="mobile-wide to tablet @show"></div>
   * ```
   *
   * @example
   * When the aspect ratio of the next element with class `box` is square, then
   * add classes `c1` and `c2` to the element (that the trigger is defined on) and
   * enable trigger `my-trigger` defined on this same element; undo all of that
   * otherwise (on other aspect ratios of the reference root):
   *
   * ```html
   * <div data-lisn-on-layout="square @add-class=c1,c2 @enable=my-trigger +root=next.box"
   *      data-lisn-on-run="@show +id=my-trigger"
   * ></div>
   * <div class="box"></div>
   * ```
   *
   * @example
   * As above, but using `data-lisn-ref` attribute instead of class selector.
   *
   * ```html
   * <div data-lisn-on-layout="square @add-class=c1,c2 @enable=my-trigger +root=next-box"
   *      data-lisn-on-run="@show +id=my-trigger"
   * ></div>
   * <div data-lisn-ref="box"></div>
   *
   * @category Layout
   */
  class LayoutTrigger extends Trigger {
    static register() {
      registerTrigger("layout", (element, args, actions, config) => {
        var _args$;
        return new LayoutTrigger(element, actions, assign(config, {
          layout: validateStringRequired("layout", strReplace(strReplace((_args$ = args[0]) !== null && _args$ !== void 0 ? _args$ : "", /(min|max)-/g, "$1 "), /-to-/g, " to "), value => isValidDeviceList(value) || isValidAspectRatioList(value))
        }));
      }, newConfigValidator$5);
    }

    /**
     * If no actions are supplied, nothing is done.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the config is invalid.
     */
    constructor(element, actions, config) {
      var _config$layout;
      const layout = (_config$layout = config === null || config === void 0 ? void 0 : config.layout) !== null && _config$layout !== void 0 ? _config$layout : "";
      if (!layout) {
        throw usageError("'layout' is required");
      }
      super(element, actions, config);
      this.getConfig = () => copyObject(config);
      if (!lengthOf(actions)) {
        return;
      }
      let devices = [];
      let aspectRatios = [];
      let otherDevices = [];
      let otherAspectRatios = [];
      if (isValidDeviceList(layout)) {
        devices = layout;
        otherDevices = getOtherDevices(layout);
      } else {
        aspectRatios = layout;
        otherAspectRatios = getOtherAspectRatios(layout);
      }
      const root = config.root;
      const watcher = LayoutWatcher.reuse({
        root
      });
      watcher.onLayout(this.run, {
        devices,
        aspectRatios
      });
      if (lengthOf(otherDevices) || lengthOf(otherAspectRatios)) {
        watcher.onLayout(this.reverse, {
          devices: otherDevices,
          aspectRatios: otherAspectRatios
        });
      }
    }
  }

  /**
   * @category Layout
   * @interface
   */

  // --------------------

  const newConfigValidator$5 = element => {
    return {
      root: async (key, value) => {
        const root = isLiteralString(value) ? await waitForReferenceElement(value, element) : undefined;
        if (root && !isHTMLElement(root)) {
          throw usageError("root must be HTMLElement");
        }
        return root;
      }
    };
  };

  /**
   * @module Triggers
   *
   * @categoryDescription Load
   * {@link LoadTrigger} allows you to run actions once when the page is loaded.
   */


  /**
   * {@link LoadTrigger} allows you to run actions one when the page is loaded.
   *
   * -------
   *
   * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
   * specification.
   *
   * - Arguments: none
   * - Additional trigger options: none
   *
   * @example
   * Scroll to the given element when the page is loaded:
   *
   * ```html
   * <div data-lisn-on-load=":scroll-to"></div>
   * ```
   *
   * @example
   * Scroll to 100px above the given element 500ms after the page is loaded:
   *
   * ```html
   * <div data-lisn-on-load="@scroll-to=0,-100 +delay=500"></div>
   * ```
   *
   * @example
   * Scroll to 100px above the given element 500ms after the page is loaded, and
   * play animations defined on it 500ms later (1000ms after it's loaded):
   *
   * ```html
   * <div data-lisn-on-load="@scroll-to=0,-100 +delay=500 ;
   *                         @animate +delay=1000"
   * ></div>
   * ```
   *
   * @category Load
   */
  class LoadTrigger extends Trigger {
    static register() {
      registerTrigger("load", (element, args, actions, config) => new LoadTrigger(element, actions, config));
    }

    /**
     * If no actions are supplied, nothing is done.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the config is invalid.
     */
    constructor(element, actions, config) {
      super(element, actions, config);
      this.getConfig = () => copyObject(config);
      if (!lengthOf(actions)) {
        return;
      }
      waitForPageReady().then(this.run);
    }
  }

  /**
   * @module Triggers
   *
   * @categoryDescription Scroll
   * {@link ScrollTrigger} allows you to run actions when the user scrolls a
   * target element (or the main scrollable element) in a given direction, and
   * undo those actions when they scroll in the opposite direction.
   */

  /**
   * {@link ScrollTrigger} allows you to run actions when the user scrolls a
   * target element (or the main scrollable element) in a given direction, and
   * undo those actions when they scroll in the opposite direction.
   *
   * -------
   *
   * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
   * specification.
   *
   * - Arguments (optional): One or more (comma-separated) scroll directions.
   *   Note that if you do not specify any directions, then the trigger will just
   *   run once, on any scroll.
   * - Additional trigger options:
   *   - `scrollable`: A string element specification.
   *      See {@link Utils.getReferenceElement | getReferenceElement}.
   *   - `threshold`: A number.
   *
   * @example
   * Show the element when the user scrolls the page up, hide when scrolling
   * down. User scrolling left or right not trigger the action. See
   * {@link getOppositeXYDirections}:
   *
   * ```html
   * <div data-lisn-on-scroll="up @show"></div>
   * ```
   *
   * @example
   * As above, but using a CSS class instead of data attribute:
   *
   * ```html
   * <div class="lisn-on-scroll--up@show"></div>
   * ```
   *
   * @example
   * Show the element 1000ms after the first time the user scrolls the page up:
   *
   * ```html
   * <div data-lisn-on-scroll="up @show +once +delay=1000"></div>
   * ```
   *
   * @example
   * Add class `scrolled` the first time the user scrolls the page in any
   * direction (note that the `once` option is implied here), and show the
   * element 1000ms after each time the user scrolls the page up, hide it as soon
   * as they scroll down:
   *
   * ```html
   * <div data-lisn-on-scroll="@add-class=scrolled ;
   *                           up @show +do-delay=1000"
   * ></div>
   * ```
   *
   * @example
   * When the user scrolls up or down the closest ancestor with class `section`,
   * then add classes `c1` and `c2` and enable trigger `my-trigger` defined on
   * this same element; undo all of that when scrolling right or left:
   *
   * ```html
   * <div class="section">
   *   <div data-lisn-on-scroll="up,down @add-class=c1,c2 @enable=my-trigger +scrollable=this.section"
   *      data-lisn-on-run="@show +id=my-trigger"
   *   ></div>
   *</div>
   * ```
   *
   * @example
   * As above, but using `data-lisn-ref` attribute instead of class selector.
   *
   * ```html
   * <div data-lisn-ref="section">
   *   <div data-lisn-on-scroll="up,down @add-class=c1,c2 @enable=my-trigger +scrollable=this-section"
   *      data-lisn-on-run="@show +id=my-trigger"
   *   ></div>
   *</div>
   * ```
   *
   * @category Scroll
   */
  class ScrollTrigger extends Trigger {
    static register() {
      registerTrigger(S_SCROLL, (element, args, actions, config) => {
        return new ScrollTrigger(element, actions, assign(config, {
          directions: validateStrList("directions", args, isValidXYDirection)
        }));
      }, newConfigValidator$4);
    }

    /**
     * If no actions are supplied, nothing is done.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the config is invalid.
     */
    constructor(element, actions, config) {
      config !== null && config !== void 0 ? config : config = {};
      let directions = config.directions;
      if (!directions) {
        config.once = true;
        directions = [S_UP, S_DOWN, S_LEFT, S_RIGHT];
      }
      super(element, actions, config);
      this.getConfig = () => copyObject(config);
      if (!lengthOf(actions)) {
        return;
      }
      const watcher = ScrollWatcher.reuse();
      const scrollable = config.scrollable;
      const threshold = config.threshold;
      const oppositeDirections = directions ? getOppositeXYDirections(directions) : [];
      watcher.onScroll(this.run, {
        directions,
        scrollable,
        threshold
      });
      if (lengthOf(oppositeDirections)) {
        watcher.onScroll(this.reverse, {
          directions: oppositeDirections,
          scrollable,
          threshold
        });
      }
    }
  }

  /**
   * @category Scroll
   * @interface
   */

  // --------------------

  const newConfigValidator$4 = element => {
    return {
      scrollable: (key, value) => {
        var _ref;
        return (_ref = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
      },
      threshold: validateNumber
    };
  };

  /**
   * @module Triggers
   *
   * @categoryDescription View
   * {@link ViewTrigger} allows you to run actions when the viewport's scroll
   * position relative to a given target or offset from top/bottom/left/right is
   * one of the matching "views" (at/above/below/left/right), and undo those
   * actions when the viewport's "view" is not matching.
   */


  /**
   * {@link ViewTrigger} allows you to run actions when the viewport's scroll
   * position relative to a given target or offset from top/bottom/left/right is
   * one of the matching "views" (at/above/below/left/right), and undo those
   * actions when the viewport's "view" is not matching.
   *
   * -------
   *
   * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
   * specification.
   *
   * - Arguments (optional): One or more (comma-separated) {@link View}s.
   *   Default is "at".
   * - Additional trigger options:
   *   - `target`: A string element specification for an element (see
   *     {@link Utils.getReferenceElement | getReferenceElement}) or a
   *     {@link Types.ScrollOffset | ScrollOffset}.
   *   - `root`: A string element specification. See
   *     {@link Utils.getReferenceElement | getReferenceElement}.
   *   - `rootMargin`: A string.
   *   - `threshold`: A number or list (comma-separated) of numbers.
   *
   * @example
   * Show the element when it's in the viewport, hide otherwise.
   *
   * ```html
   * <div data-lisn-on-view="at @show"></div>
   * ```
   *
   * @example
   * Same as above. "views" is optional and defaults to "at".
   *
   * ```html
   * <div data-lisn-on-view="@show"></div>
   * ```
   *
   * @example
   * As above but using a CSS class instead of data attribute:
   *
   * ```html
   * <div class="lisn-on-view--@show"></div>
   * ```
   *
   * @example
   * Show the element 1000ms after the first time it enters the viewport.
   *
   * ```html
   * <div data-lisn-on-view="@show +once +delay=1000"></div>
   * ```
   *
   * @example
   * Add class `seen` the first time the element enters the viewport, and play
   * the animations defined on it 1000ms after each time it enters the viewport,
   * reverse the animations as soon as it goes out of view.
   *
   * ```html
   * <div data-lisn-on-view="@add-class=seen +once ;
   *                         @animate +do-delay=1000"
   * ></div>
   * ```
   *
   * @example
   * Add class `seen` when the viewport is at or below the element (element
   * above viewport), remove it when the viewport is above the element.
   * Element going to the left or right of the viewport will not trigger the
   * action. See {@link getOppositeViews}:
   *
   * ```html
   * <div data-lisn-on-view="at,below @add-class=seen"></div>
   * ```
   *
   * @example
   * Add class `cls` when the viewport is above or to the left the element
   * (element below or to the right of the viewport), remove it when the
   * viewport is either at, below or to the right of the element.
   *
   * ```html
   * <div data-lisn-on-view="above,left @add-class=cls"></div>
   * ```
   *
   * @example
   * Hide the element when the viewport is above the next element with class
   * `section`, show it when the viewport is below or at the target element.
   *
   * ```html
   * <div data-lisn-on-view="above @hide +target=next.section"></div>
   * <div class="section"></div>
   * ```
   *
   * @example
   * As above, but using `data-lisn-ref` attribute instead of class selector.
   *
   * ```html
   * <div data-lisn-on-view="above @hide +target=next-section"></div>
   * <div data-lisn-ref="section"></div>
   * ```
   *
   * @example
   * Open the {@link Widgets.Openable | Openable} widget configured for this
   * element when the viewport is 75% down from the top of the page.
   *
   * ```html
   * <div data-lisn-on-view="@open +target=top:75%"></div>
   * ```
   *
   * @category View
   */
  class ViewTrigger extends Trigger {
    static register() {
      registerTrigger("view", (element, args, actions, config) => {
        return new ViewTrigger(element, actions, assign(config, {
          views: validateStrList("views", args, isValidView)
        }));
      }, newConfigValidator$3);
    }

    /**
     * If no actions are supplied, nothing is done.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the config is invalid.
     */
    constructor(element, actions, config) {
      var _config$rootMargin, _config$target;
      super(element, actions, config);
      const logger = result ? new result.Logger({
        name: `ViewTrigger-${formatAsString(element)}`
      }) : null;
      this.getConfig = () => copyObject(config);
      if (!lengthOf(actions)) {
        return;
      }
      const watcher = ViewWatcher.reuse({
        root: config === null || config === void 0 ? void 0 : config.root,
        rootMargin: config === null || config === void 0 || (_config$rootMargin = config.rootMargin) === null || _config$rootMargin === void 0 ? void 0 : _config$rootMargin.replace(/,/g, " "),
        threshold: config === null || config === void 0 ? void 0 : config.threshold
      });
      const target = (_config$target = config === null || config === void 0 ? void 0 : config.target) !== null && _config$target !== void 0 ? _config$target : element;
      const views = (config === null || config === void 0 ? void 0 : config.views) || S_AT;
      const oppositeViews = getOppositeViews(views);
      const setupWatcher = target => {
        if (!lengthOf(oppositeViews)) {
          logger === null || logger === void 0 || logger.debug6("Trigger can never be reversed, running now");
          // The action is never undone
          this.run();
        } else {
          logger === null || logger === void 0 || logger.debug6("Setting up trigger", views, oppositeViews);
          watcher.onView(target, this.run, {
            views
          });
          watcher.onView(target, this.reverse, {
            views: oppositeViews
          });
        }
      };

      // See comment in globals/settings under contentWrappingAllowed
      let willAnimate = false;
      for (const action of actions) {
        if (isInstanceOf(action, Animate) || isInstanceOf(action, AnimatePlay)) {
          willAnimate = true;
          break;
        }
      }
      if (willAnimate) {
        setupRepresentative(element).then(setupWatcher);
      } else {
        setupWatcher(target);
      }
    }
  }

  /**
   * @category View
   * @interface
   */

  // ----------

  const newConfigValidator$3 = element => {
    return {
      target: (key, value) => {
        var _ref;
        return isLiteralString(value) && isValidScrollOffset(value) ? value : (_ref = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
      },
      root: (key, value) => {
        var _ref2;
        return (_ref2 = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref2 !== void 0 ? _ref2 : undefined;
      },
      rootMargin: validateString,
      threshold: (key, value) => validateNumList(key, value)
    };
  };
  const setupRepresentative = async element => {
    let target = await tryWrap(element);
    if (!target) {
      // Not allowed to wrap. Create a dummy hidden clone that's not animated and
      // position it absolutely in a wrapper of size 0 that's inserted just
      // before the actual element, so that the hidden clone overlaps the actual
      // element's regular (pre-transformed) position.

      const prev = element.previousElementSibling;
      const prevChild = childrenOf(prev)[0];
      if (prev && hasClass(prev, PREFIX_WRAPPER$3) && prevChild && hasClass(prevChild, PREFIX_GHOST)) {
        // Already cloned by a previous animate action?
        target = prevChild;
      } else {
        target = (await insertGhostClone(element))._clone;
      }
    }
    return target;
  };

  /**
   * @module
   * @ignore
   * @internal
   */

  var index$4 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CheckTrigger: CheckTrigger,
    ClickTrigger: ClickTrigger,
    HoverTrigger: HoverTrigger,
    LayoutTrigger: LayoutTrigger,
    LoadTrigger: LoadTrigger,
    PressTrigger: PressTrigger,
    ScrollTrigger: ScrollTrigger,
    Trigger: Trigger,
    ViewTrigger: ViewTrigger,
    registerTrigger: registerTrigger
  });

  /**
   * @module
   * @ignore
   * @internal
   */


  // --- remove widget specific actions
  const actions = omitKeys(_actions, {
    Open: true,
    NextPage: true,
    PrevPage: true,
    GoToPage: true,
    EnablePage: true,
    DisablePage: true
  });
  actions.AddClass.register();
  actions.RemoveClass.register();
  actions.AnimatePlay.register();
  actions.AnimatePause.register();
  actions.Animate.register();
  actions.Display.register();
  actions.Undisplay.register();
  actions.ScrollTo.register();
  actions.SetAttribute.register();
  actions.Show.register();
  actions.Hide.register();
  actions.Enable.register();
  actions.Disable.register();
  actions.Run.register();
  LayoutTrigger.register();
  LoadTrigger.register();
  CheckTrigger.register();
  ClickTrigger.register();
  PressTrigger.register();
  HoverTrigger.register();
  ScrollTrigger.register();
  Trigger.register();
  ViewTrigger.register();

  /**
   * @module Widgets
   */


  /**
   * Configures the given element as an {@link AutoHide} widget.
   *
   * The AutoHide widget automatically hides (and optionally removes) the given
   * element, or children of it that match a given selector, after a certain
   * delay.
   *
   * It executes these actions every time the matching element(s) have a change
   * of attribute or appear (are inserted) into the DOM.
   *
   * To use with auto-widgets (HTML API) (see
   * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
   * CSS classes or data attributes are recognized:
   * - `lisn-auto-hide` class or `data-lisn-auto-hide` attribute
   * - `lisn-auto-remove` class or `data-lisn-auto-remove` attribute (enables
   *   {@link AutoHideConfig.remove})
   *
   * **NOTE:** This widget supports multiple instances per element, you can
   * specify multiple widget configurations, separated with ";".
   *
   * See below examples for what values you can use set for the data attributes
   * in order to modify the configuration of the automatically created widget.
   *
   * @example
   * This will automatically hide (with class `lisn-hide`) the element 3 seconds
   * (default delay) after it is inserted into the DOM or after it gets any
   * attributes changed on it (for example that might show it again).
   *
   * ```html
   * <div class="lisn-auto-hide">
   *   Automatically hidden in 3s.
   * </div>
   * ```
   *
   * @example
   * This will automatically hide and then remove the element 3 seconds (default
   * delay) after it is inserted into the DOM.
   *
   * ```html
   * <div class="lisn-auto-remove">
   *   Automatically hidden and removed in 3s.
   * </div>
   * ```
   *
   * @example
   * This will automatically
   * - hide `p` elements with class `message` 2 seconds after they are inserted
   *   or changed
   * - hide `p` elements with class `warning` 5 seconds after they are inserted
   *   or changed; and it will save that particular {@link AutoHide} widget with
   *   ID `myID` so that it can be looked up using {@link AutoHide.get}
   * - remove `p` elements with class `disposable` 3 seconds (default delay)
   *   after they are inserted or changed
   *
   * ```html
   * <div data-lisn-auto-hide="selector=p.message delay=2000 ;
   *                           selector=p.warning delay=5000 id=myID"
   *      data-lisn-auto-remove="selector=p.disposable">
   *   <p>Some text, this will stay.</p>
   *   <p class="message">
   *     Automatically hidden in 2s.
   *   </p>
   *   <p class="warning">
   *     Automatically hidden in 5s.
   *   </p>
   *   <p class="disposable">
   *     Automatically hidden and removed in 3s.
   *   </p>
   * </div>
   * ```
   */
  class AutoHide extends Widget {
    static get(element, id) {
      const instance = super.get(element, id);
      if (isInstanceOf(instance, AutoHide)) {
        return instance;
      }
      return null;
    }
    static register() {
      for (const [name, remove] of [[WIDGET_NAME_HIDE, false], [WIDGET_NAME_REMOVE, true]]) {
        registerWidget(name, (element, config) => {
          return new AutoHide(element, config);
        }, newConfigValidator$2(remove), {
          supportsMultiple: true
        });
      }
    }
    constructor(element, config) {
      super(element, config);
      const selector = config === null || config === void 0 ? void 0 : config.selector;
      const watcher = DOMWatcher.create({
        root: element,
        subtree: selector ? true : false
      });

      // Watch for attribute change on this element, and for relevant children
      // being added/changed
      const watcherOptions = selector ? {
        selector: selector,
        categories: [S_ADDED, S_ATTRIBUTE],
        [S_SKIP_INITIAL]: true
      } : {
        categories: [S_ATTRIBUTE],
        [S_SKIP_INITIAL]: true
      };
      const hideOrRemoveEl = config !== null && config !== void 0 && config.remove ? hideAndRemoveElement : hideElement;
      const hideRelevant = () => {
        if (this.isDisabled()) {
          return;
        }
        const targetElements = selector ? querySelectorAll(element, selector) : [element];
        for (const elem of targetElements) {
          var _config$delay;
          hideOrRemoveEl(elem, (_config$delay = config === null || config === void 0 ? void 0 : config.delay) !== null && _config$delay !== void 0 ? _config$delay : DEFAULT_DELAY);
        }
      };
      const addWatcher = () => watcher.onMutation(hideRelevant, watcherOptions);
      const removeWatcher = () => watcher.offMutation(hideRelevant);

      // ------------------------------

      // Don't hide/remove before the page is loaded
      waitForPageReady().then(() => {
        // Hide initially
        if (this.isDestroyed()) {
          return;
        }
        hideRelevant();
        addWatcher();
      });
      this.onDisable(removeWatcher);
      this.onEnable(() => {
        hideRelevant();
        addWatcher();
      });
    }
  }

  /**
   * @interface
   */

  // ------------------------------

  const WIDGET_NAME_HIDE = "auto-hide";
  const WIDGET_NAME_REMOVE = "auto-remove";
  const DEFAULT_DELAY = 3000;
  const newConfigValidator$2 = autoRemove => {
    return {
      id: validateString,
      remove: () => autoRemove,
      selector: validateString,
      delay: validateNumber
    };
  };

  /**
   * @module Widgets
   */


  /**
   * Configures the given element as a {@link PageLoader} widget.
   *
   * The page loader is a full-page spinner. You would almost certainly use this
   * only once, to hide the page before it's loaded.
   *
   * **IMPORTANT:** You should not instantiate more than one {@link PageLoader}
   * widget on a given element. Use {@link PageLoader.get} to get an existing
   * instance if any. If there is already a widget instance, it will be destroyed!
   *
   * -----
   *
   * To use with auto-widgets (HTML API) (see
   * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
   * CSS classes or data attributes are recognized:
   * - `lisn-page-loader` class or `data-lisn-page-loader` attribute set on
   *   the element that constitutes the widget. The element should be empty.
   *
   * See below examples for what values you can use set for the data attributes
   * in order to modify the configuration of the automatically created widget.
   *
   * @example
   * This will create a page loader using the JavaScript API.
   *
   * This will work even if
   * {@link Settings.settings.autoWidgets | settings.autoWidgets}) is false
   *
   * ```html
   * <!-- LISN should be loaded beforehand -->
   * <script>
   *   LISN.widgets.PageLoader.enableMain();
   * </script>
   * ```
   *
   * @example
   * This will create a page loader using an existing element with default
   * {@link PageLoaderConfig}.
   *
   * ```html
   * <div class="lisn-page-loader"></div>
   * ```
   *
   * @example
   * As above but with custom settings.
   *
   * ```html
   * <div data-lisn-page-loader="auto-remove=false"></div>
   * ```
   */
  class PageLoader extends Widget {
    /**
     * If element is omitted, returns the instance created by {@link enableMain}
     * if any.
     */
    static get(element) {
      if (!element) {
        return mainWidget$3;
      }
      const instance = super.get(element, DUMMY_ID$9);
      if (isInstanceOf(instance, PageLoader)) {
        return instance;
      }
      return null;
    }
    static register() {
      registerWidget(WIDGET_NAME$9, (element, config) => {
        if (!PageLoader.get(element)) {
          return new PageLoader(element, config);
        }
        return null;
      }, configValidator$7);
    }

    /**
     * Creates a new element, inserts it into the document body and configures it
     * as a {@link PageLoader}.
     */
    static enableMain(config) {
      const loader = createElement("div");
      const widget = new PageLoader(loader, config);
      widget.onDestroy(() => {
        if (mainWidget$3 === widget) {
          mainWidget$3 = null;
        }
        return moveElement(loader);
      });
      waitForElement(getBody).then(body => {
        if (!widget.isDestroyed()) {
          moveElement(loader, {
            to: body
          });
        }
      });
      mainWidget$3 = widget;
      return widget;
    }
    constructor(element, config) {
      var _PageLoader$get;
      const destroyPromise = (_PageLoader$get = PageLoader.get(element)) === null || _PageLoader$get === void 0 ? void 0 : _PageLoader$get.destroy();
      super(element, {
        id: DUMMY_ID$9
      });
      (destroyPromise || promiseResolve()).then(() => {
        var _config$autoRemove;
        if (this.isDestroyed()) {
          return;
        }
        addClasses(element, PREFIX_ROOT$4);
        const spinner = createElement("div");
        addClasses(spinner, PREFIX_SPINNER);
        moveElement(spinner, {
          to: element
        });
        waitForElement(getBody).then(setHasModal); // we could be init before body

        if ((_config$autoRemove = config === null || config === void 0 ? void 0 : config.autoRemove) !== null && _config$autoRemove !== void 0 ? _config$autoRemove : true) {
          waitForPageReady().then(() => hideAndRemoveElement(element)).then(this.destroy);
        }
        this.onDisable(() => {
          undisplayElement(element);
          if (!docQuerySelector(`.${PREFIX_ROOT$4}`)) {
            delHasModal();
          }
        });
        this.onEnable(async () => {
          await displayElement(element);
        });
        this.onDestroy(async () => {
          moveElement(spinner); // remove
          await removeClasses(element, PREFIX_ROOT$4);
          await displayElement(element); // revert undisplay by onDisable
        });
      });
    }
  }

  /**
   * @interface
   */

  // --------------------

  const WIDGET_NAME$9 = "page-loader";
  const PREFIXED_NAME$5 = prefixName(WIDGET_NAME$9);
  const PREFIX_ROOT$4 = `${PREFIXED_NAME$5}__root`;
  const PREFIX_SPINNER = prefixName("spinner");
  // Only one PageLoader widget per element is allowed, but Widget requires a
  // non-blank ID.
  // In fact, it doesn't make much sense to have more than 1 page loader on the
  // whole page, but we support it, hence use a class rather than a DOM ID.
  const DUMMY_ID$9 = PREFIXED_NAME$5;
  let mainWidget$3 = null;
  const configValidator$7 = {
    autoRemove: validateBoolean
  };

  /**
   * @module Widgets
   */


  /**
   * Configures the given element as a {@link SameHeight} widget.
   *
   * The SameHeight widget sets up the given element as a flexbox and sets the
   * flex basis of its components so that their heights are as close as possible
   * to each other. It tracks their size (see {@link SizeWatcher}) and
   * continually updates the basis as needed.
   *
   * When calculating the best flex basis that would result in equal heights,
   * SameHeight determines whether a flex child is mostly text or mostly images
   * since the height of these scales in opposite manner with their width.
   * Therefore, the components of the widget should contain either mostly text or
   * mostly images.
   *
   * The widget should have more than one item and the items must be immediate
   * children of the container element.
   *
   * SameHeight tries to automatically determine if an item is mostly text or
   * mostly images based on the total display text content, but you can override
   * this in two ways:
   * 1. By passing a map of elements as {@link SameHeightConfig.items | items}
   *    instead of an array, and setting the value for each to either `"text"` or
   *    `"image"`
   * 2. By setting the `data-lisn-same-height-item` attribute to `"text"` or
   *   `"image"` on the children. **NOTE** however that when auto-discovering the
   *   items (i.e. when you have not explicitly passed a list/map of items), if
   *   you set the `data-lisn-same-height-item` attribute on _any_ child you must
   *   also add this attribute to all other children that are to be used by the
   *   widget. Other children (that don't have this attribute) will be ignored
   *   and assumed to be either zero-size or position absolute/fixed.
   *
   * **IMPORTANT:** You should not instantiate more than one {@link SameHeight}
   * widget on a given element. Use {@link SameHeight.get} to get an existing
   * instance if any. If there is already a widget instance, it will be destroyed!
   *
   * **IMPORTANT:** The element you pass will be set to `display: flex` and its
   * children will get `box-sizing: border-box` and continually updated
   * `flex-basis` style. You can add additional CSS to the element or its
   * children if you wish. For example you may wish to set `flex-wrap: wrap` on
   * the element and a `min-width` on the children.
   *
   * -----
   *
   * To use with auto-widgets (HTML API) (see {@link settings.autoWidgets}), the
   * following CSS classes or data attributes are recognized:
   * - `lisn-same-height` class or `data-lisn-same-height` attribute set on the
   *   container element that constitutes the widget
   *
   * When using auto-widgets, the elements that will be used as items are
   * discovered in the following way:
   * 1. The immediate children of the top-level element that constitutes the
   *    widget that have the `lisn-same-height-item` class or
   *    `data-lisn-same-height-item` attribute are taken.
   * 2. If none of the root's children have this class or attribute, then all of
   *    the immediate children of the widget element except any `script` or
   *    `style` elements are taken as the items.
   *
   * See below examples for what values you can use set for the data attribute
   * in order to modify the configuration of the automatically created widget.
   *
   * @example
   * This defines a simple SameHeight widget with one text and one image child.
   *
   * ```html
   * <div class="lisn-same-height">
   *   <div>
   *     <p>
   *       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
   *       eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
   *       minim veniam, quis nostrud exercitation ullamco laboris nisi ut
   *       aliquip ex ea commodo consequat. Duis aute irure dolor in
   *       reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
   *       pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
   *       culpa qui officia deserunt mollit anim id est laborum.
   *     </p>
   *   </div>
   *
   *   <div>
   *     <img
   *       src="https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2@1.5x.png"
   *     />
   *   </div>
   * </div>
   * ```
   *
   * @example
   * This defines a SameHeight widget with the flexbox children specified
   * explicitly (and one ignored), as well as having all custom settings.
   *
   * ```html
   * <div data-lisn-same-height="diff-tolerance=20
   *                             | resize-threshold=10
   *                             | debounce-window=50
   *                             | min-gap=50
   *                             | max-free-r=0.2
   *                             | max-width-r=3.2">
   *   <div>Example ignored child</div>
   *
   *   <div data-lisn-same-height-item><!-- Will be detected as text anyway -->
   *     <p>
   *       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
   *       eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
   *       minim veniam, quis nostrud exercitation ullamco laboris nisi ut
   *       aliquip ex ea commodo consequat. Duis aute irure dolor in
   *       reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
   *       pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
   *       culpa qui officia deserunt mollit anim id est laborum.
   *     </p>
   *   </div>
   *
   *   <!-- Explicitly set to image type, though it will be detected as such -->
   *   <div data-lisn-same-height-item="image">
   *     <img
   *       src="https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2@1.5x.png"
   *     />
   *   </div>
   *
   *   <!-- Explicitly set to text type, because it will NOT be detected as such (text too short). -->
   *   <div data-lisn-same-height-item="text">
   *     <p>
   *       Lorem ipsum dolor sit amet, consectetur adipiscing elit.
   *     </p>
   *   </div>
   * </div>
   * ```
   */
  class SameHeight extends Widget {
    /**
     * Switches the flexbox to vertical (column) mode.
     *
     * You can alternatively do this by setting the
     * `data-lisn-orientation="vertical"` attribute on the element at any time.
     *
     * You can do this for example as part of a trigger:
     *
     * @example
     * ```html
     * <div class="lisn-same-height"
     *      data-lisn-on-layout="max-mobile-wide:set-attribute=data-lisn-orientation#vertical">
     *      <!-- ... children -->
     * </div>
     * ```
     */

    /**
     * Switches the flexbox back to horizontal (row) mode, which is the default.
     *
     * You can alternatively do this by deleting the
     * `data-lisn-orientation` attribute on the element, or setting it to
     * `"horizontal"` at any time.
     */

    /**
     * Returns the elements used as the flex children.
     */

    /**
     * Returns a map of the elements used as the flex children with their type.
     */

    /**
     * If the element is already configured as a SameHeight widget, the widget
     * instance is returned. Otherwise null.
     */
    static get(containerElement) {
      const instance = super.get(containerElement, DUMMY_ID$8);
      if (isInstanceOf(instance, SameHeight)) {
        return instance;
      }
      return null;
    }
    static register() {
      registerWidget(WIDGET_NAME$8, (element, config) => {
        if (isHTMLElement(element)) {
          if (!SameHeight.get(element)) {
            return new SameHeight(element, config);
          }
        } else {
          logError(usageError("Only HTMLElement is supported for SameHeight widget"));
        }
        return null;
      }, configValidator$6);
    }
    constructor(containerElement, config) {
      var _SameHeight$get;
      const destroyPromise = (_SameHeight$get = SameHeight.get(containerElement)) === null || _SameHeight$get === void 0 ? void 0 : _SameHeight$get.destroy();
      super(containerElement, {
        id: DUMMY_ID$8
      });
      const items = getItemsFrom(containerElement, config === null || config === void 0 ? void 0 : config.items);
      if (sizeOf(items) < 2) {
        throw usageError("SameHeight must have more than 1 item");
      }
      for (const item of items.keys()) {
        if (parentOf(item) !== containerElement) {
          throw usageError("SameHeight's items must be its immediate children");
        }
      }
      fetchConfig(containerElement, config).then(fullConfig => {
        (destroyPromise || promiseResolve()).then(() => {
          if (this.isDestroyed()) {
            return;
          }
          init$3(this, containerElement, items, fullConfig);
        });
      });
      this.toColumn = () => setData(containerElement, PREFIX_ORIENTATION, S_VERTICAL);
      this.toRow = () => delData(containerElement, PREFIX_ORIENTATION);
      this.getItems = () => [...items.keys()];
      this.getItemConfigs = () => newMap([...items.entries()]);
    }
  }

  /**
   * @interface
   */

  // ------------------------------

  const WIDGET_NAME$8 = "same-height";
  const PREFIXED_NAME$4 = prefixName(WIDGET_NAME$8);
  const PREFIX_ROOT$3 = `${PREFIXED_NAME$4}__root`;

  // Use different classes for styling items to the one used for auto-discovering
  // them, so that re-creating existing widgets can correctly find the items to
  // be used by the new widget synchronously before the current one is destroyed.
  const PREFIX_ITEM$1 = `${PREFIXED_NAME$4}__item`;
  const PREFIX_ITEM__FOR_SELECT$1 = `${PREFIXED_NAME$4}-item`;
  const S_TEXT = "text";
  const S_IMAGE = "image";

  // Only one SameHeight widget per element is allowed, but Widget requires a
  // non-blank ID.
  const DUMMY_ID$8 = PREFIXED_NAME$4;

  // We consider elements that have text content of at least <MIN_CHARS_FOR_TEXT>
  // characters to be text.
  const MIN_CHARS_FOR_TEXT = 100;
  const configValidator$6 = {
    diffTolerance: validateNumber,
    resizeThreshold: validateNumber,
    [S_DEBOUNCE_WINDOW]: validateNumber,
    minGap: validateNumber,
    maxFreeR: validateNumber,
    maxWidthR: validateNumber
  };
  const isText = element => getData(element, PREFIX_ITEM__FOR_SELECT$1) === S_TEXT || getData(element, PREFIX_ITEM__FOR_SELECT$1) !== S_IMAGE && isHTMLElement(element) && lengthOf(element.innerText) >= MIN_CHARS_FOR_TEXT;
  const areImagesLoaded = element => {
    for (const img of element.querySelectorAll("img")) {
      // Don't rely on img.complete since sometimes this returns false even
      // though the image is loaded and has a size. Just check the size.
      if (img.naturalWidth === 0 || img.width === 0 || img.naturalHeight === 0 || img.height === 0) {
        return false;
      }
    }
    return true;
  };
  const fetchConfig = async (containerElement, userConfig) => {
    var _userConfig$minGap, _userConfig$maxFreeR, _userConfig$maxWidthR, _userConfig$diffToler, _userConfig$resizeThr, _userConfig$debounceW;
    const colGapStr = await getComputedStyleProp(containerElement, "column-gap");
    const minGap = getNumValue(strReplace(colGapStr, /px$/, ""), settings.sameHeightMinGap);
    return {
      _minGap: toNumWithBounds((_userConfig$minGap = userConfig === null || userConfig === void 0 ? void 0 : userConfig.minGap) !== null && _userConfig$minGap !== void 0 ? _userConfig$minGap : minGap, {
        min: 0
      }, 10),
      _maxFreeR: toNumWithBounds((_userConfig$maxFreeR = userConfig === null || userConfig === void 0 ? void 0 : userConfig.maxFreeR) !== null && _userConfig$maxFreeR !== void 0 ? _userConfig$maxFreeR : settings.sameHeightMaxFreeR, {
        min: 0,
        max: 0.9
      }, -1),
      _maxWidthR: toNumWithBounds((_userConfig$maxWidthR = userConfig === null || userConfig === void 0 ? void 0 : userConfig.maxWidthR) !== null && _userConfig$maxWidthR !== void 0 ? _userConfig$maxWidthR : settings.sameHeightMaxWidthR, {
        min: 1
      }, -1),
      _diffTolerance: (_userConfig$diffToler = userConfig === null || userConfig === void 0 ? void 0 : userConfig.diffTolerance) !== null && _userConfig$diffToler !== void 0 ? _userConfig$diffToler : settings.sameHeightDiffTolerance,
      _resizeThreshold: (_userConfig$resizeThr = userConfig === null || userConfig === void 0 ? void 0 : userConfig.resizeThreshold) !== null && _userConfig$resizeThr !== void 0 ? _userConfig$resizeThr : settings.sameHeightResizeThreshold,
      _debounceWindow: (_userConfig$debounceW = userConfig === null || userConfig === void 0 ? void 0 : userConfig.debounceWindow) !== null && _userConfig$debounceW !== void 0 ? _userConfig$debounceW : settings.sameHeightDebounceWindow
    };
  };
  const getNumValue = (strValue, defaultValue) => {
    const num = strValue ? parseFloat(strValue) : NaN;
    return isNaN(num) ? defaultValue : num;
  };
  const findItems = containerElement => {
    const items = [...querySelectorAll(containerElement, getDefaultWidgetSelector(PREFIX_ITEM__FOR_SELECT$1))];
    if (!lengthOf(items)) {
      items.push(...getVisibleContentChildren(containerElement));
    }
    return items;
  };
  const getItemsFrom = (containerElement, inputItems) => {
    const itemMap = newMap();
    inputItems = inputItems || findItems(containerElement);
    const addItem = (item, itemType) => {
      itemType = itemType || (isText(item) ? S_TEXT : S_IMAGE);
      itemMap.set(item, itemType);
    };
    if (isArray(inputItems)) {
      for (const item of inputItems) {
        addItem(item);
      }
    } else if (isInstanceOf(inputItems, Map)) {
      for (const [item, itemType] of inputItems.entries()) {
        addItem(item, itemType);
      }
    }
    return itemMap;
  };
  const init$3 = (widget, containerElement, items, config) => {
    const logger = result ? new result.Logger({
      name: `SameHeight-${formatAsString(containerElement)}`
    }) : null;
    const diffTolerance = config._diffTolerance;
    const debounceWindow = config._debounceWindow;
    const sizeWatcher = SizeWatcher.reuse({
      [S_DEBOUNCE_WINDOW]: debounceWindow,
      resizeThreshold: config._resizeThreshold
    });
    const allItems = newMap();
    let callCounter = 0;
    let isFirstTime = true;
    let lastOptimalHeight = 0;
    let hasScheduledReset = false;
    let counterTimeout = null;

    // ----------

    const resizeHandler = (element, sizeData) => {
      // Since the SizeWatcher calls us once for every element, we batch the
      // re-calculations so they are done once in every cycle.
      // Allow the queue of ResizeObserverEntry in the SizeWatcher to be
      // emptied, and therefore to ensure we have the latest size for all
      // elements.
      if (!hasScheduledReset) {
        logger === null || logger === void 0 || logger.debug7("Scheduling calculations", callCounter);
        hasScheduledReset = true;
        setTimer(() => {
          hasScheduledReset = false;
          if (callCounter > 1) {
            logger === null || logger === void 0 || logger.debug7("Already re-calculated once, skipping");
            callCounter = 0;
            return;
          }
          callCounter++;
          if (counterTimeout) {
            clearTimer(counterTimeout);
          }
          const measurements = calculateMeasurements(containerElement, allItems, isFirstTime, logger);
          const height = measurements ? getOptimalHeight(measurements, config, logger) : null;
          if (height && abs(lastOptimalHeight - height) > diffTolerance) {
            // Re-set widths again. We may be called again in the next cycle if
            // the change in size exceeds the resizeThreshold.
            lastOptimalHeight = height;
            isFirstTime = false;
            setWidths(height); // no need to await

            // If we are _not_ called again in the next cycle (just after
            // debounceWindow), then reset the counter. It means the resultant
            // change in size did not exceed the SizeWatcher threshold.
            counterTimeout = setTimer(() => {
              callCounter = 0;
            }, debounceWindow + 50);
          } else {
            // Done, until the next time elements are resized
            callCounter = 0;
          }
        }, 0);
      }

      // Save the size of the item
      const properties = allItems.get(element);
      if (!properties) {
        logError(bugError("Got SizeWatcher call for unknown element"));
        return;
      }
      properties._width = sizeData.border[S_WIDTH] || sizeData.content[S_WIDTH];
      properties._height = sizeData.border[S_HEIGHT] || sizeData.content[S_HEIGHT];
      logger === null || logger === void 0 || logger.debug7("Got size", element, properties);
    };

    // ----------

    const observeAll = () => {
      isFirstTime = true;
      for (const element of allItems.keys()) {
        sizeWatcher.onResize(resizeHandler, {
          target: element
        });
      }
    };

    // ----------

    const unobserveAll = () => {
      for (const element of allItems.keys()) {
        sizeWatcher.offResize(resizeHandler, element);
      }
    };

    // ----------

    const setWidths = height => {
      for (const [element, properties] of allItems.entries()) {
        if (parentOf(element) === containerElement) {
          const width = getWidthAtH(element, properties, height);
          logger === null || logger === void 0 || logger.debug9("Setting width property", element, properties, width);
          setNumericStyleJsVars(element, {
            sameHeightW: width
          }, {
            _units: "px"
          });
        }
      }
    };

    // SETUP ------------------------------

    widget.onDisable(unobserveAll);
    widget.onEnable(observeAll);
    widget.onDestroy(async () => {
      for (const element of allItems.keys()) {
        if (parentOf(element) === containerElement) {
          // delete the property and attribute
          await setNumericStyleJsVars(element, {
            sameHeightW: NaN
          });
          await removeClasses(element, PREFIX_ITEM$1);
        }
      }
      allItems.clear();
      await removeClasses(containerElement, PREFIX_ROOT$3);
    });

    // Find all relevant items: the container, its direct children and the
    // top-level text only elements.
    const getProperties = itemType => {
      return {
        _type: itemType,
        _width: NaN,
        _height: NaN,
        _aspectR: NaN,
        _area: NaN,
        _extraH: NaN,
        _components: []
      };
    };
    allItems.set(containerElement, getProperties(""));
    for (const [item, itemType] of items.entries()) {
      addClasses(item, PREFIX_ITEM$1);
      const properties = getProperties(itemType);
      allItems.set(item, properties);
      if (itemType === S_TEXT) {
        properties._components = getTextComponents(item);
        for (const child of properties._components) {
          allItems.set(child, getProperties(""));
        }
      }
    }
    addClasses(containerElement, PREFIX_ROOT$3);
    observeAll();
  };

  /**
   * Find the top-level text-only elements that are descendants of the given one.
   */
  const getTextComponents = element => {
    const components = [];
    for (const child of getVisibleContentChildren(element)) {
      if (isText(child)) {
        components.push(child);
      } else {
        components.push(...getTextComponents(child));
      }
    }
    return components;
  };
  const calculateMeasurements = (containerElement, allItems, isFirstTime, logger) => {
    if (getData(containerElement, PREFIX_ORIENTATION) === S_VERTICAL) {
      logger === null || logger === void 0 || logger.debug8("In vertical mode");
      return null;
    }
    logger === null || logger === void 0 || logger.debug7("Calculating measurements");
    // initial values
    let tArea = NaN,
      tExtraH = 0,
      imgAR = NaN,
      flexW = NaN,
      nItems = 0;
    for (const [element, properties] of allItems.entries()) {
      const width = properties._width;
      const height = properties._height;
      if (element === containerElement) {
        flexW = width;
        nItems = lengthOf(getVisibleContentChildren(element));

        //
      } else if (properties._type === S_TEXT) {
        let thisTxtArea = 0,
          thisTxtExtraH = 0;
        const components = properties._components;
        if (lengthOf(components)) {
          for (const component of properties._components) {
            const cmpProps = allItems.get(component);
            if (cmpProps) {
              thisTxtArea += cmpProps._width * cmpProps._height;
            } else {
              logError(bugError("Text component not observed"));
            }
          }
          thisTxtExtraH = height - thisTxtArea / width;
        } else {
          thisTxtArea = width * height;
        }
        properties._area = thisTxtArea;
        properties._extraH = thisTxtExtraH;
        tArea = (tArea || 0) + thisTxtArea;
        tExtraH += thisTxtExtraH;

        //
      } else if (properties._type === S_IMAGE) {
        if (isFirstTime && !areImagesLoaded(element)) {
          logger === null || logger === void 0 || logger.debug8("Images not loaded");
          return null;
        }
        const thisAspectR = width / height;
        imgAR = (imgAR || 0) + thisAspectR;
        properties._aspectR = thisAspectR;

        //
      } else {
        // skip grandchildren (text components), here
        continue;
      }
      logger === null || logger === void 0 || logger.debug8("Examined", properties, {
        tArea,
        tExtraH,
        imgAR,
        flexW
      });
    }
    return {
      _tArea: tArea,
      _tExtraH: tExtraH,
      _imgAR: imgAR,
      _flexW: flexW,
      _nItems: nItems
    };
  };
  const getWidthAtH = (element, properties, targetHeight) => properties._type === S_TEXT ? properties._area / (targetHeight - (properties._extraH || 0)) : properties._aspectR * targetHeight;
  const getOptimalHeight = (measurements, config, logger) => {
    const tArea = measurements._tArea;
    const tExtraH = measurements._tExtraH;
    const imgAR = measurements._imgAR;
    const flexW = measurements._flexW - (measurements._nItems - 1) * config._minGap;
    const maxFreeR = config._maxFreeR;
    const maxWidthR = config._maxWidthR;
    logger === null || logger === void 0 || logger.debug8("Getting optimal height", measurements, config);

    // CASE 1: No text items
    if (isNaN(tArea)) {
      logger === null || logger === void 0 || logger.debug8("No text items");
      if (!imgAR) {
        logger === null || logger === void 0 || logger.debug8("Images not loaded");
        return NaN;
      }
      return flexW / imgAR;
    }

    // CASE 2: No images
    if (isNaN(imgAR)) {
      logger === null || logger === void 0 || logger.debug8("No images");
      return tArea / flexW + tExtraH;
    }
    if (!imgAR || !tArea) {
      logger === null || logger === void 0 || logger.debug8("Expected both images and text, but no imgAR or tArea");
      return NaN;
    }
    const h0 = sqrt(tArea / imgAR) + tExtraH;

    // heights satisfying w(h) === flexW
    const [h2, h1] = quadraticRoots(imgAR, -(imgAR * tExtraH + flexW), tArea + tExtraH * flexW);

    // heights satisfying maxWidthR
    let hR0 = NaN,
      hR1 = NaN,
      hR2 = NaN;
    if (maxWidthR > 0) {
      hR0 = quadraticRoots(imgAR, -imgAR * tExtraH, -tArea)[0];
      hR1 = quadraticRoots(imgAR * maxWidthR, -imgAR * tExtraH * maxWidthR, -tArea)[0];
      hR2 = quadraticRoots(imgAR / maxWidthR, -imgAR * tExtraH / maxWidthR, -tArea)[0];
    }

    // heights satisfying maxFreeR
    let hF2 = NaN,
      hF1 = NaN;
    if (maxFreeR >= 0) {
      [hF2, hF1] = quadraticRoots(imgAR, -(imgAR * tExtraH + flexW * (1 - maxFreeR)), tArea + tExtraH * flexW * (1 - maxFreeR));
    }

    // limits on constraints
    const hConstr1 = max(...filter([h1, hR1, hF1], v => isValidNum(v)));
    const hConstr2 = min(...filter([h2, hR2, hF2], v => isValidNum(v)));

    // text and image widths at h0
    const tw0 = tArea / (h0 - tExtraH);
    const iw0 = h0 * imgAR;

    // free space at h0
    const freeSpace0 = flexW - tw0 - iw0;
    logger === null || logger === void 0 || logger.debug8("Optimal height calculations", config, measurements, {
      h0,
      h1,
      h2,
      hR0,
      hR1,
      hR2,
      hF1,
      hF2,
      hConstr1,
      hConstr2,
      tw0,
      iw0,
      freeSpace0
    });

    // ~~~~ Some sanity checks
    // If any of then is NaN, the comparison would be false, so we don't need to
    // check.
    // Also, we round the difference to 0.1 pixels to account for rounding
    // errors during calculations.
    if (!h0 || h0 <= 0) {
      logger === null || logger === void 0 || logger.debug1("Invalid calculation: Invalid h0");
    } else if (isValidNum(h1) !== isValidNum(h2)) {
      logger === null || logger === void 0 || logger.debug1("Invalid calculation: One and only one of h1 or h2 is real");
    } else if (isValidNum(hR1) !== isValidNum(hR2)) {
      logger === null || logger === void 0 || logger.debug1("Invalid calculation: One and only one of hR1 or hR2 is real");
    } else if (isValidNum(hF1) !== isValidNum(hF2)) {
      logger === null || logger === void 0 || logger.debug1("Invalid calculation: One and only one of hF1 or hF2 is real");
    } else if (h1 - h0 > 0.1) {
      logger === null || logger === void 0 || logger.debug1("Invalid calculation: h1 > h0");
    } else if (h0 - h2 > 0.1) {
      logger === null || logger === void 0 || logger.debug1("Invalid calculation: h0 > h2");
    } else if (hR0 - h0 > 0.1) {
      logger === null || logger === void 0 || logger.debug1("Invalid calculation: hR0 > h0");
    } else if (hR1 - hR0 > 0.1) {
      logger === null || logger === void 0 || logger.debug1("Invalid calculation: hR1 > hR0");
    } else if (hR0 - hR2 > 0.1) {
      logger === null || logger === void 0 || logger.debug1("Invalid calculation: hR0 > hR2");
    } else if (hF1 - hF2 > 0.1) {
      logger === null || logger === void 0 || logger.debug1("Invalid calculation: hF1 > hF2");
    } else if (h1 - hF1 > 0.1) {
      logger === null || logger === void 0 || logger.debug1("Invalid calculation: h1 > hF1");
    } else if (hF2 - h2 > 0.1) {
      logger === null || logger === void 0 || logger.debug1("Invalid calculation: hF2 > h2");
    } else {
      // Choose a height
      if (freeSpace0 <= 0) {
        // scenario 1 or 2
        return h0;
      } else {
        // scenario 3
        return min(hConstr1, hConstr2);
      }
    }
    logError(bugError("Invalid SameHeight calculations"), measurements, config);
    return NaN; // sanity checks failed
  };

  /**
   * @module Utils
   */


  /**
   * Returns true if the device has a touch screen.
   *
   * @category Browser info
   *
   * @since v1.2.0
   */
  const isTouchScreen = () => hasDOM() ? matchMedia("(any-pointer: coarse)").matches : false;

  /**
   * Returns true if the browser supports position: sticky.
   *
   * @category Browser info
   *
   * @since v1.2.0
   */
  const supportsSticky = () => hasDOM() ? typeof CSS !== "undefined" && CSS.supports("position", "sticky") : false;

  /**
   * Returns true if the page is in quirks mode.
   *
   * @category Browser info
   *
   * @since v1.2.0
   */
  const isInQuirksMode = () => hasDOM() ? document.compatMode === "BackCompat" : false;

  /**
   * Returns true if the device is mobile (based on user agent).
   *
   * @category Browser info
   *
   * @since v1.2.0
   */
  const isMobile = () => hasDOM() ? userAgent.match(/Mobile|Android|Silk\/|Kindle|BlackBerry|Opera Mini|Opera Mobi/) !== null : false;

  /**
   * @module Widgets
   */


  /**
   * Configures the given element, which must be scrollable, to use a
   * {@link Scrollbar}.
   *
   * The Scrollbar widget is a customizable alternative to the native
   * scrollbars (vertical and horizontal). You can position each of the two
   * scrollbars on any of the four sides of the element, make them automatically
   * hide after certain time of inactivity, style them as a traditional handle
   * scrollbar or a percentage fill progress bar and so on.
   *
   * It is also itself draggable/clickable so it _can_ be used to scroll the
   * element similar to the native scrollbar. The drag/click functionality can be
   * disabled too.
   *
   * **NOTE:** If you have disabled the {@link Widgets.PageLoader | PageLoader}
   * and have left {@link ScrollbarConfig.hideNative} ON, but are seeing the
   * native scrollbars just for a fraction of a second at the beginning of the
   * page load, you may want to manually add `lisn-hide-scroll` class on the
   * scrollable element to make sure the scrollbars are hidden as soon as
   * possible (before the scrollbar widget has time to initialize.
   *
   * **IMPORTANT:** If you are using the Scrollbar on an element other than the
   * main scrollable element, it's highly recommended to
   * {@link settings.contentWrappingAllowed | enable content wrapping} (it is
   * enabled by default). Otherwise, Scrollbar will rely on position: sticky. If
   * you want to instead manually create the wrappers yourself, ensure your
   * structure is as follows:
   * ```html
   * <div class="scrollable"><!-- Element you instantiate as Scrollbar -->
   *   <div class="lisn-scrollbar__content"><!-- Optional wrapper to avoid relying on sticky -->
   *     <div class="lisn-wrapper"><!-- Optional wrapper to enable efficient scroll tracking -->
   *       <!-- YOUR CONTENT -->
   *     </div>
   *   </div>
   * </div>
   * ```
   *
   * **IMPORTANT:** You should not instantiate more than one {@link Scrollbar}
   * widget on a given element. Use {@link Scrollbar.get} to get an existing
   * instance if any. If there is already a widget instance, it will be destroyed!
   *
   * -----
   *
   * You can use the following dynamic attributes or CSS properties in your
   * stylesheet:
   *
   * The following dynamic attributes are set on the element:
   * - `data-lisn-has-scrollbar-top`: `"true"` or `"false"`
   * - `data-lisn-has-scrollbar-bottom`: `"true"` or `"false"`
   * - `data-lisn-has-scrollbar-left`: `"true"` or `"false"`
   * - `data-lisn-has-scrollbar-right`: `"true"` or `"false"`
   *
   * The following dynamic attributes are set on each progressbar element:
   * - `data-lisn-orientation`: `"horizontal"` or `"vertical"`
   * - `data-lisn-place`: `"top"`, `"bottom"`, `"left"` or `"right"`
   * - `data-lisn-draggable`: `"true"` or `"false"`
   * - `data-lisn-clickable`: `"true"` or `"false"`
   *
   * -----
   *
   * To use with auto-widgets (HTML API) (see {@link settings.autoWidgets}), the
   * following CSS classes or data attributes are recognized:
   * - `lisn-scrollbar` class or `data-lisn-scrollbar` attribute set on the
   *   scrollable element that you want to enable custom scrollbars for
   *
   * See below examples for what values you can use set for the data attribute
   * in order to modify the configuration of the automatically created widget.
   *
   * @example
   * This will create custom scrollbars for
   * {@link settings.mainScrollableElementSelector | the main scrolling element}.
   *
   * This will work even if {@link settings.autoWidgets}) is false
   *
   * ```html
   * <!-- LISN should be loaded beforehand -->
   * <script>
   *   // You can also just customise global default settings:
   *   // LISN.settings.scrollbarPositionV = "top";
   *   // LISN.settings.scrollbarAutoHide = 3000;
   *   // LISN.settings.scrollbarUseHandle = true;
   *
   *   LISN.widgets.Scrollbar.enableMain({
   *     position: "top",
   *     autoHide: 3000,
   *     useHandle: true
   *   });
   * </script>
   * ```
   *
   * @example
   * This will create custom scrollbars for a custom scrolling element (i.e. one
   * with overflow "auto" or "scroll").
   *
   * ```html
   * <div class="scrolling lisn-scrollbar">
   *   <!-- content here... -->
   * </div>
   * ```
   *
   * @example
   * As above but with custom settings.
   *
   * ```html
   * <div
   *   class="scrolling"
   *   data-lisn-scrollbar="hide-native=false
   *                        | positionH=top
   *                        | positionV=left
   *                        | auto-hide=2000
   *                        | click-scroll=false
   *                        | drag-scroll=false
   *                        | use-handle=false
   *                        ">
   *   <!-- content here... -->
   * </div>
   * ```
   */
  class Scrollbar extends Widget {
    /**
     * Returns the actual scrollable element us which, unless the scrollable you
     * passed to the constructor is the
     * {@link settings.mainScrollableElementSelector | the main scrolling element}
     * or unless
     * {@link settings.contentWrappingAllowed | you've disabled content wrapping},
     * this will be a new element created by us that is a descendant of the
     * original element you passed.
     */

    /**
     * If element is omitted, returns the instance created by {@link enableMain}
     * if any.
     */
    static get(scrollable) {
      if (!scrollable) {
        return mainWidget$2;
      }
      if (scrollable === getDocElement()) {
        scrollable = getBody();
      }
      const instance = super.get(scrollable, DUMMY_ID$7);
      if (isInstanceOf(instance, Scrollbar)) {
        return instance;
      }
      return null;
    }

    /**
     * Enables scrollbars on the
     * {@link settings.mainScrollableElementSelector | the main scrolling element}.
     *
     * **NOTE:** It returns a Promise to a widget because it will wait for the
     * main scrollable element to be present in the DOM if not already.
     */
    static async enableMain(config) {
      // [TODO v2]: enableMain should be synchronous and the constructor should
      // wait for the scrollable, allowing users who want to use the main
      // scrollable to just pass null/undefined/window. Then getScrollable should
      // return null or the actual scrollable if available + add fetchScrollable
      // to return a Promise.
      const scrollable = await ScrollWatcher.fetchMainScrollableElement();
      const widget = new Scrollbar(scrollable, config);
      widget.onDestroy(() => {
        if (mainWidget$2 === widget) {
          mainWidget$2 = null;
        }
      });
      mainWidget$2 = widget;
      return widget;
    }
    static register() {
      registerWidget(WIDGET_NAME$7, (element, config) => {
        if (isHTMLElement(element)) {
          if (!Scrollbar.get(element)) {
            return new Scrollbar(element, config);
          }
        } else {
          logError(usageError("Only HTMLElement is supported for Scrollbar widget"));
        }
        return null;
      }, configValidator$5);
    }

    /**
     * Note that passing `document.body` is considered equivalent to
     * `document.documentElement`.
     */
    constructor(scrollable, config) {
      var _Scrollbar$get;
      if (scrollable === getDocElement()) {
        scrollable = getBody();
      }
      const destroyPromise = (_Scrollbar$get = Scrollbar.get(scrollable)) === null || _Scrollbar$get === void 0 ? void 0 : _Scrollbar$get.destroy();
      super(scrollable, {
        id: DUMMY_ID$7
      });
      const props = getScrollableProps(scrollable);
      const ourScrollable = props.scrollable;
      (destroyPromise || promiseResolve()).then(() => {
        if (this.isDestroyed()) {
          return;
        }
        init$2(this, scrollable, props, config);
      });
      this.getScrollable = () => ourScrollable;
    }
  }

  /**
   * @interface
   */

  // --------------------

  const WIDGET_NAME$7 = "scrollbar";
  const PREFIXED_NAME$3 = prefixName(WIDGET_NAME$7);
  // Only one Scrollbar widget per element is allowed, but Widget
  // requires a non-blank ID.
  const DUMMY_ID$7 = PREFIXED_NAME$3;
  const PREFIX_ROOT$2 = `${PREFIXED_NAME$3}__root`;
  const PREFIX_CONTAINER = `${PREFIXED_NAME$3}__container`;
  const PREFIX_CONTENT = `${PREFIXED_NAME$3}__content`;
  const PREFIX_BAR = `${PREFIXED_NAME$3}__bar`;
  const PREFIX_WRAPPER = `${PREFIXED_NAME$3}__wrapper`;
  const PREFIX_FILL = `${PREFIXED_NAME$3}__fill`;
  const PREFIX_SPACER = `${PREFIXED_NAME$3}__spacer`;
  const PREFIX_HANDLE = `${PREFIXED_NAME$3}__handle`;
  const PREFIX_DRAGGABLE = prefixName("draggable");
  const PREFIX_CLICKABLE = prefixName("clickable");
  const PREFIX_HAS_WRAPPER = prefixName("has-wrapper");
  const PREFIX_ALLOW_COLLAPSE = prefixName("allow-collapse");
  const PREFIX_HAS_V_SCROLL$1 = prefixName("has-v-scroll");
  const PREFIX_HAS_SCROLLBAR = prefixName("has-scrollbar");
  const PREFIX_HIDE_SCROLL = prefixName("hide-scroll");
  const S_SET_POINTER_CAPTURE = "setPointerCapture";
  const S_RELEASE_POINTER_CAPTURE = "releasePointerCapture";
  const S_ARIA_VALUENOW = ARIA_PREFIX + "valuenow";
  const S_SCROLLBAR = "scrollbar";
  let mainWidget$2 = null;
  const configValidator$5 = {
    id: validateString,
    className: validateStrList,
    hideNative: validateBoolean,
    onMobile: validateBoolean,
    positionH: validateString,
    positionV: validateString,
    autoHide: validateNumber,
    clickScroll: validateBoolean,
    dragScroll: validateBoolean,
    useHandle: validateBoolean
  };
  const getScrollableProps = containerElement => {
    // If main scrollable element doesn't exist yet, then the containerElement
    // passed can't be it anyway, so no need to use fetchMainScrollableElement.
    const mainScrollableElement = tryGetMainScrollableElement();
    const body = getBody();
    const defaultScrollable = getDefaultScrollingElement();
    const isBody = containerElement === body;
    const isMainScrollable = (isBody ? defaultScrollable : containerElement) === mainScrollableElement;
    const root = isMainScrollable ? mainScrollableElement : isBody ? defaultScrollable : containerElement;

    // check if we're using body in quirks mode
    const isBodyInQuirks = isBody && isInQuirksMode();
    const allowedToWrap = isAllowedToWrap(containerElement);
    const barParent = isMainScrollable ? body : containerElement;
    const hasVScroll = isScrollable(root, {
      axis: "y"
    });
    let contentWrapper = null;
    let supported = true;
    let hasExistingWrapper = true;
    if (!isMainScrollable && !isBody) {
      // we need to wrap if possible
      contentWrapper = getContentWrapper(containerElement, {
        _classNames: [PREFIX_CONTENT]
      });
      hasExistingWrapper = !isNullish(contentWrapper);
      if (!contentWrapper) {
        const warnMsgPrefix = "Scrollbar on elements other than " + "the main scrollable when content wrapping is " + "disabled relies on position: sticky";
        if (allowedToWrap) {
          // we'll wrap later, but create the wrapper now as it will be the actual
          // scrollable
          contentWrapper = createElement("div");
        } else if (supportsSticky()) {
          logWarn(`${warnMsgPrefix}, is experimental and may not work properly.`);
        } else {
          logError(`${warnMsgPrefix}, but this browser does not support sticky.`);
          supported = false;
        }
      }
    }
    const needsSticky = !isMainScrollable && !allowedToWrap && !hasExistingWrapper;
    return {
      supported,
      isMainScrollable,
      isBody,
      isBodyInQuirks,
      root,
      scrollable: contentWrapper !== null && contentWrapper !== void 0 ? contentWrapper : root,
      barParent,
      contentWrapper,
      hasExistingWrapper,
      needsSticky,
      hasVScroll
    };
  };
  const init$2 = (widget, containerElement, props, config) => {
    var _ref, _config$onMobile, _ref2, _config$hideNative, _config$autoHide, _config$clickScroll, _ref3, _config$dragScroll, _ref4, _config$useHandle;
    const {
      supported,
      isMainScrollable,
      isBody,
      isBodyInQuirks,
      root,
      scrollable,
      barParent,
      contentWrapper,
      hasExistingWrapper,
      needsSticky,
      hasVScroll
    } = props;
    const logger = result ? new result.Logger({
      name: `Scrollbar-${formatAsString(root)}`,
      logAtCreation: {
        props,
        config
      }
    }) : null;

    // config
    const onMobile = (_ref = (_config$onMobile = config === null || config === void 0 ? void 0 : config.onMobile) !== null && _config$onMobile !== void 0 ? _config$onMobile : settings.scrollbarOnMobile) !== null && _ref !== void 0 ? _ref : false;
    const hideNative = (_ref2 = (_config$hideNative = config === null || config === void 0 ? void 0 : config.hideNative) !== null && _config$hideNative !== void 0 ? _config$hideNative : settings.scrollbarHideNative) !== null && _ref2 !== void 0 ? _ref2 : false;
    const positionH = (config === null || config === void 0 ? void 0 : config.positionH) || settings.scrollbarPositionH;
    const positionV = (config === null || config === void 0 ? void 0 : config.positionV) || settings.scrollbarPositionV;
    const autoHideDelay = (_config$autoHide = config === null || config === void 0 ? void 0 : config.autoHide) !== null && _config$autoHide !== void 0 ? _config$autoHide : settings.scrollbarAutoHide;
    const clickScroll = (_config$clickScroll = config === null || config === void 0 ? void 0 : config.clickScroll) !== null && _config$clickScroll !== void 0 ? _config$clickScroll : settings.scrollbarClickScroll;
    const dragScroll = (_ref3 = (_config$dragScroll = config === null || config === void 0 ? void 0 : config.dragScroll) !== null && _config$dragScroll !== void 0 ? _config$dragScroll : settings.scrollbarDragScroll) !== null && _ref3 !== void 0 ? _ref3 : false;
    const useHandle = (_ref4 = (_config$useHandle = config === null || config === void 0 ? void 0 : config.useHandle) !== null && _config$useHandle !== void 0 ? _config$useHandle : settings.scrollbarUseHandle) !== null && _ref4 !== void 0 ? _ref4 : false;
    if (isMobile() && !onMobile) {
      return;
    }

    // Ensure scroll tracking that will be setup on the original element uses the
    // new scrollable we create.
    // XXX TODO But this still breaks any existing scroll tracking
    mapScrollable(root, scrollable);

    // ----------

    const newScrollbar = (wrapper, position) => {
      const barIsHorizontal = position === S_TOP || position === S_BOTTOM;
      const scrollbar = createElement("div");
      addClassesNow(scrollbar, PREFIX_BAR);
      setDataNow(scrollbar, PREFIX_ORIENTATION, barIsHorizontal ? S_HORIZONTAL : S_VERTICAL);
      setDataNow(scrollbar, PREFIX_PLACE, position);
      if (clickScroll || dragScroll) {
        setAttr(scrollbar, S_ROLE, S_SCROLLBAR);
        setAttr(scrollbar, S_ARIA_CONTROLS, scrollDomID);
      }
      const fill = createElement("div");
      addClassesNow(fill, useHandle ? PREFIX_SPACER : PREFIX_FILL);
      let handle = null;
      if (useHandle) {
        handle = createElement("div");
        addClassesNow(handle, PREFIX_HANDLE);
        setBooleanDataNow(handle, PREFIX_DRAGGABLE, dragScroll);
      }
      setBooleanDataNow(scrollbar, PREFIX_DRAGGABLE, dragScroll && !useHandle);
      setBooleanDataNow(scrollbar, PREFIX_CLICKABLE, clickScroll);
      moveElementNow(fill, {
        to: scrollbar
      });
      if (handle) {
        moveElementNow(handle, {
          to: scrollbar
        });
      }
      moveElementNow(scrollbar, {
        to: wrapper
      });
      return {
        _bar: scrollbar,
        _handle: handle,
        _fill: fill
      };
    };

    // ----------

    const setProgress = (scrollData, tracksH) => {
      const scrollbar = tracksH ? scrollbarH : scrollbarV;
      const hasBarPrefix = `${PREFIX_HAS_SCROLLBAR}-${tracksH ? positionH : positionV}`;
      const completeFraction = tracksH ? scrollData[S_SCROLL_LEFT_FRACTION] : scrollData[S_SCROLL_TOP_FRACTION];
      const viewFraction = tracksH ? scrollData[S_CLIENT_WIDTH] / scrollData[S_SCROLL_WIDTH] : scrollData[S_CLIENT_HEIGHT] / scrollData[S_SCROLL_HEIGHT];
      logger === null || logger === void 0 || logger.debug9("Updating progress", {
        tracksH,
        completeFraction,
        viewFraction
      });
      setAttr(scrollbar, S_ARIA_VALUENOW, round(completeFraction * 100) + "");
      setNumericStyleJsVars(scrollbar, {
        viewFr: viewFraction,
        completeFr: completeFraction
      }, {
        _numDecimal: 4
      });
      const scrollAxis = tracksH ? "x" : "y";
      // TODO When using content-box, reading scrollWidth/Height even on the
      // subsequent measure time still shows the "old" value that includes the
      // border width before it seems to adjust. So sometimes it gives false
      // positives for it being scrollable.
      const canScroll = viewFraction < 0.99 && (completeFraction > 0 || isScrollable(scrollable, {
        axis: scrollAxis,
        noCache: true
      }));
      if (canScroll) {
        setBooleanData(containerElement, hasBarPrefix);
        displayElement(scrollbar);
      } else {
        delData(containerElement, hasBarPrefix);
        undisplayElement(scrollbar);
      }
    };

    // ----------

    const updateProgress = (target, scrollData) => {
      if (!isMainScrollable && !isBody) {
        setBoxMeasureProps(containerElement);
      }
      setProgress(scrollData, true);
      setProgress(scrollData, false);
      if (autoHideDelay > 0) {
        showElement(wrapper).then(() => hideElement(wrapper, autoHideDelay));
      }
    };
    const updatePropsOnResize = (target, sizeData) => {
      setBoxMeasureProps(containerElement);
      setNumericStyleJsVars(containerElement, {
        barHeight: sizeData.border[S_HEIGHT]
      }, {
        _units: "px",
        _numDecimal: 2
      });
    };

    // ----------

    let isDragging = false;
    let lastOffset = 0;
    let lastTargetFraction = 0;
    let scrollAction;
    const onClickOrDrag = async (event, tracksH) => {
      preventDefault(event);
      const scrollbar = tracksH ? scrollbarH : scrollbarV;
      const handle = tracksH ? handleH : handleV;
      const target = targetOf(event);
      if (!isMouseEvent(event) || !isHTMLElement(target)) {
        return;
      }
      const eventType = event.type;
      const isClick = eventType === S_POINTERDOWN || eventType === S_MOUSEDOWN;
      const isHandleClick = isClick && useHandle && hasClass(target, PREFIX_HANDLE);
      const startsDrag = isClick && dragScroll && (isHandleClick || !useHandle);
      if (startsDrag) {
        isDragging = true;
        setOrReleasePointerCapture(event, scrollbar, S_SET_POINTER_CAPTURE);
      }
      logger === null || logger === void 0 || logger.debug10("Click or drag", {
        eventType,
        isClick,
        isHandleClick,
        isDragging,
        startsDrag
      });
      if (!isClick && !isDragging || isClick && !startsDrag && !clickScroll) {
        // - Either moving pointer when no drag scroll has been started OR
        // - Clicking when no drag is allowed in the context of the click and no
        //   click scroll is allowed either
        return;
      }
      await waitForMeasureTime();
      const barIsHorizontal = isHorizontal(scrollbar);
      const barLength = barIsHorizontal ? scrollbar[S_CLIENT_WIDTH] : scrollbar[S_CLIENT_HEIGHT];
      const currScrollOffset = tracksH ? scrollable[S_SCROLL_LEFT] : scrollable[S_SCROLL_TOP];
      const maxScrollOffset = tracksH ? scrollable[S_SCROLL_WIDTH] - getClientWidthNow(scrollable) : scrollable[S_SCROLL_HEIGHT] - getClientHeightNow(scrollable);

      // Get click offset relative to the scrollbar regardless of what the
      // event target is and what transforms is has applied.
      const rect = getBoundingClientRect(scrollbar);
      const offset = barIsHorizontal ? event.clientX - rect.left : event.clientY - rect.top;
      logger === null || logger === void 0 || logger.debug10("Pointer offset", offset);
      if (offset === lastOffset) {
        return;
      }
      const deltaOffset = isClick ? offset : offset - lastOffset;
      lastOffset = offset;
      if (!isClick && useHandle) {
        // Dragging the handle
        const handleLength = handle ? parseFloat(getComputedStylePropNow(handle, barIsHorizontal ? S_WIDTH : S_HEIGHT)) : 0;
        lastTargetFraction = lastTargetFraction + deltaOffset / (barLength - (handleLength || 0));
      } else if (isHandleClick) {
        // Starting a handle drag
        lastTargetFraction = currScrollOffset / maxScrollOffset;
      } else {
        // Clicking or dragging on the bar -> scroll to the offset under the pointer
        lastTargetFraction = offset / barLength;
      }
      if (isHandleClick || isClick && !clickScroll) {
        return;
      }
      const targetScrollOffset = lastTargetFraction * maxScrollOffset;
      const targetCoordinates = tracksH ? {
        left: targetScrollOffset
      } : {
        top: targetScrollOffset
      };
      logger === null || logger === void 0 || logger.debug10("Scroll target offset", {
        lastTargetFraction,
        targetCoordinates
      });
      if (isClick) {
        // smooth scroll
        scrollAction = await scrollWatcher.scrollTo(targetCoordinates, {
          scrollable,
          weCanInterrupt: true
        });
      } else {
        var _scrollAction;
        (_scrollAction = scrollAction) === null || _scrollAction === void 0 || _scrollAction.cancel();
        scrollAction = null;
        elScrollTo(scrollable, targetCoordinates);
      }
    };

    // ----------

    const onRelease = (event, tracksH) => {
      const scrollbar = tracksH ? scrollbarH : scrollbarV;
      setOrReleasePointerCapture(event, scrollbar, S_RELEASE_POINTER_CAPTURE);
      isDragging = false;
      scrollAction = null;
    };
    const onClickOrDragH = event => onClickOrDrag(event, true);
    const onClickOrDragV = event => onClickOrDrag(event, false);
    const onReleaseH = event => onRelease(event, true);
    const onReleaseV = event => onRelease(event, false);

    // ----------

    const maybeSetNativeHidden = () => {
      if (hideNative) {
        addClasses(scrollable, PREFIX_HIDE_SCROLL);
        if (isBodyInQuirks) {
          addClasses(getDocElement(), PREFIX_HIDE_SCROLL);
        }
      }
    };
    const setNativeShown = () => {
      removeClasses(scrollable, PREFIX_HIDE_SCROLL);
      if (isBodyInQuirks) {
        removeClasses(getDocElement(), PREFIX_HIDE_SCROLL);
      }
    };

    // ----------

    const addWatchers = () => {
      // Track scroll in any direction as well as changes in border or content size
      // of the element and its contents.
      scrollWatcher.trackScroll(updateProgress, {
        threshold: 0,
        scrollable
      });

      // Track changes in content or border size of the container element which
      // would also detect changes in its padding.
      sizeWatcher.onResize(updatePropsOnResize, {
        target: containerElement,
        threshold: 0
      });
    };
    const removeWatchers = () => {
      scrollWatcher.noTrackScroll(updateProgress, scrollable);
      sizeWatcher.offResize(updatePropsOnResize, containerElement);
    };

    // SETUP ------------------------------

    if (!supported) {
      setNativeShown();
      return;
    }
    const scrollWatcher = ScrollWatcher.reuse({
      [S_DEBOUNCE_WINDOW]: 0
    });
    const sizeWatcher = SizeWatcher.reuse({
      [S_DEBOUNCE_WINDOW]: 0
    });
    if (!isMainScrollable && !isBody) {
      addClasses(containerElement, PREFIX_CONTAINER);
    }
    setBooleanData(containerElement, PREFIX_ALLOW_COLLAPSE, !isMobile());
    setBooleanData(containerElement, PREFIX_HAS_WRAPPER, !!contentWrapper);
    setBooleanData(containerElement, PREFIX_HAS_V_SCROLL$1, !!contentWrapper && hasVScroll);

    // Wrap children if needed
    if (contentWrapper && !hasExistingWrapper) {
      wrapChildren(containerElement, {
        wrapper: contentWrapper,
        ignoreMove: true
      }); // no need to await here
      addClasses(contentWrapper, PREFIX_CONTENT);
    }
    maybeSetNativeHidden();
    const origDomID = scrollable.id;
    if (config !== null && config !== void 0 && config.id) {
      scrollable.id = config.id;
    }
    if (config !== null && config !== void 0 && config.className) {
      addClasses(scrollable, ...toArrayIfSingle(config.className));
    }
    const scrollDomID =
    // for ARIA
    clickScroll || dragScroll ? getOrAssignID(scrollable, S_SCROLLBAR) : "";
    addClasses(barParent, PREFIX_ROOT$2);
    const wrapper = createElement("div");
    preventSelect(wrapper);
    addClasses(wrapper, PREFIX_NO_TOUCH_ACTION);
    addClasses(wrapper, PREFIX_WRAPPER);
    if (isBody || isMainScrollable) {
      setData(wrapper, PREFIX_POSITION, S_FIXED);
    } else if (needsSticky) {
      setData(wrapper, PREFIX_POSITION, S_STICKY);
    }
    const {
      _bar: scrollbarH,
      _handle: handleH
    } = newScrollbar(wrapper, positionH);
    const {
      _bar: scrollbarV,
      _handle: handleV
    } = newScrollbar(wrapper, positionV);
    moveElement(wrapper, {
      to: barParent,
      position: "prepend"
    });
    addWatchers();

    // Track clicking and dragging on the two scrollbars
    if (dragScroll) {
      addEventListenerTo(scrollbarH, S_POINTERMOVE, onClickOrDragH);
      addEventListenerTo(scrollbarV, S_POINTERMOVE, onClickOrDragV);
      addEventListenerTo(scrollbarH, S_POINTERUP, onReleaseH);
      addEventListenerTo(scrollbarV, S_POINTERUP, onReleaseV);
    }
    if (dragScroll || clickScroll) {
      addEventListenerTo(scrollbarH, S_POINTERDOWN, onClickOrDragH);
      addEventListenerTo(scrollbarV, S_POINTERDOWN, onClickOrDragV);
    }
    widget.onDisable(() => {
      removeWatchers();
      undisplayElement(scrollbarH);
      undisplayElement(scrollbarV);
      setNativeShown();
    });
    widget.onEnable(() => {
      addWatchers();
      displayElement(scrollbarH);
      displayElement(scrollbarV);
      maybeSetNativeHidden();
    });
    widget.onDestroy(async () => {
      unmapScrollable(root);
      scrollable.id = origDomID;
      if (config !== null && config !== void 0 && config.className) {
        removeClasses(scrollable, ...toArrayIfSingle(config.className));
      }
      await waitForMutateTime();
      if (contentWrapper && !hasExistingWrapper) {
        unwrapContentNow(contentWrapper, [PREFIX_CONTENT]);
      }
      moveElementNow(wrapper); // remove

      if (dragScroll) {
        removeEventListenerFrom(scrollbarH, S_POINTERMOVE, onClickOrDragH);
        removeEventListenerFrom(scrollbarV, S_POINTERMOVE, onClickOrDragV);
        removeEventListenerFrom(scrollbarH, S_POINTERUP, onReleaseH);
        removeEventListenerFrom(scrollbarV, S_POINTERUP, onReleaseV);
      }
      if (dragScroll || clickScroll) {
        removeEventListenerFrom(scrollbarH, S_POINTERDOWN, onClickOrDragH);
        removeEventListenerFrom(scrollbarV, S_POINTERDOWN, onClickOrDragV);
      }
      removeClassesNow(barParent, PREFIX_ROOT$2);
      removeClassesNow(containerElement, PREFIX_CONTAINER);
      for (const position of [S_TOP, S_BOTTOM, S_LEFT, S_RIGHT]) {
        delDataNow(containerElement, `${PREFIX_HAS_SCROLLBAR}-${position}`);
      }
      delDataNow(containerElement, PREFIX_ALLOW_COLLAPSE);
      delDataNow(containerElement, PREFIX_HAS_WRAPPER);
      delDataNow(containerElement, PREFIX_HAS_V_SCROLL$1);
    });
  };
  const isHorizontal = scrollbar => getData(scrollbar, PREFIX_ORIENTATION) === S_HORIZONTAL;
  const setBoxMeasureProps = async element => {
    for (const side of [S_TOP, S_RIGHT, S_BOTTOM, S_LEFT]) {
      for (const key of [`padding-${side}`, `border-${side}-width`]) {
        const value = await getComputedStyleProp(element, key);
        setStyleProp(element, prefixCssJsVar(key), value);
      }
    }
  };
  const setOrReleasePointerCapture = (event, scrollbar, method) => {
    if (isPointerEvent(event) && method in scrollbar) {
      scrollbar[method](event.pointerId);
    }
  };

  /**
   * @module Widgets
   */


  /**
   * Configures the given element as a {@link ScrollToTop} widget.
   *
   * The ScrollToTop widget adds a scroll-to-top button in the lower right corder
   * of the screen (can be changed to bottom left) which scrolls smoothly (and
   * more slowly than the native scroll) back to the top.
   *
   * The button is only shown when the scroll offset from the top is more than a
   * given configurable amount.
   *
   * **IMPORTANT:** When configuring an existing element as the button (i.e. using
   * `new ScrollToTop` or auto-widgets, rather than {@link ScrollToTop.enableMain}):
   * - if using
   *   {@link Settings.settings.mainScrollableElementSelector | the main scrolling element}
   *   as the scrollable, the button element will have it's CSS position set to `fixed`;
   * - otherwise, if using a custom scrollable element, the button element may be
   *   moved in the DOM tree in order to position it on top of the scrollable
   * If you don't want the button element changed in any way, then consider using
   * the {@link Triggers.ClickTrigger | ClickTrigger} with a
   * {@link Actions.ScrollTo | ScrollTo} action.
   *
   * **IMPORTANT:** You should not instantiate more than one {@link ScrollToTop}
   * widget on a given element. Use {@link ScrollToTop.get} to get an existing
   * instance if any. If there is already a widget instance, it will be destroyed!
   *
   * -----
   *
   * You can use the following dynamic attributes or CSS properties in your
   * stylesheet:
   *
   * The following dynamic attributes are set on the element:
   * - `data-lisn-place`: `"left"` or `"right"`
   *
   * -----
   *
   * To use with auto-widgets (HTML API) (see
   * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
   * CSS classes or data attributes are recognized:
   * - `lisn-scroll-to-top` class or `data-lisn-scroll-to-top` attribute set on
   *   the element that constitutes the widget. The element should be empty.
   *
   * See below examples for what values you can use set for the data attributes
   * in order to modify the configuration of the automatically created widget.
   *
   * @example
   * This will create a scroll-to-top button using the JavaScript API.
   *
   * This will work even if
   * {@link Settings.settings.autoWidgets | settings.autoWidgets}) is false.
   *
   * ```html
   * <!-- LISN should be loaded beforehand -->
   * <script>
   *   LISN.widgets.ScrollToTop.enableMain({
   *     position: "left",
   *     offset: "top: 300vh"
   *   });
   * </script>
   * ```
   *
   * You can customise the offset show/hide trigger via CSS as well as long as
   * {@link ScrollToTopConfig.offset} is left at its default value which uses
   * this CSS property:
   *
   * ```html
   * <style type="text/css" media="screen">
   *   :root {
   *     --lisn-scroll-to-top--offset: 300vh;
   *   }
   * </style>
   * ```
   *
   * @example
   * This will configure the given element as a scroll-to-top button for the main
   * scrolling element using an existing element for the button with default
   * {@link ScrollToTopConfig}.
   *
   * ```html
   * <button class="lisn-scroll-to-top"></button>
   * ```
   * @example
   * As above but with custom settings.
   *
   * ```html
   * <button data-lisn-scroll-to-top="position=left | offset=top:300vh"></button>
   * ```
   *
   * @example
   * This will configure the given element as a scroll-to-top button for a custom
   * scrolling element (i.e. one with overflow "auto" or "scroll").
   *
   * ```html
   * <div id="scrollable">
   *   <!-- content here... -->
   * </div>
   * <button data-lisn-scroll-to-top="scrollable=#scrollable"></button>
   * ```
   *
   * @example
   * As above, but using a reference specification with a class name to find the
   * scrollable.
   *
   * ```html
   * <div class="scrollable">
   *   <!-- content here... -->
   * </div>
   * <button data-lisn-scroll-to-top="scrollable=prev.scrollable"></button>
   * ```
   *
   * @example
   * As above but with all custom settings.
   *
   * ```html
   * <div class="scrollable">
   *   <!-- content here... -->
   * </div>
   * <button data-lisn-scroll-to-top="scrollable=prev.scrollable
   *                               | position=left
   *                               | offset=top:300vh
   * "></button>
   * ```
   */
  class ScrollToTop extends Widget {
    /**
     * If element is omitted, returns the instance created by {@link enableMain}
     * if any.
     */
    static get(element) {
      if (!element) {
        return mainWidget$1;
      }
      const instance = super.get(element, DUMMY_ID$6);
      if (isInstanceOf(instance, ScrollToTop)) {
        return instance;
      }
      return null;
    }
    static register() {
      registerWidget(WIDGET_NAME$6, (element, config) => {
        if (!ScrollToTop.get(element)) {
          return new ScrollToTop(element, config);
        }
        return null;
      }, newConfigValidator$1);
    }

    /**
     * Creates a new button element, inserts it into the document body and
     * configures it as a {@link ScrollToTop}.
     */
    static enableMain(config) {
      const button = createButton("Back to top");
      const widget = new ScrollToTop(button, config);
      widget.onDestroy(() => {
        if (mainWidget$1 === widget) {
          mainWidget$1 = null;
        }
        return moveElement(button);
      });
      waitForElement(getBody).then(body => {
        if (!widget.isDestroyed()) {
          moveElement(button, {
            to: body
          });
        }
      });
      mainWidget$1 = widget;
      return widget;
    }
    constructor(element, config) {
      var _ScrollToTop$get;
      const destroyPromise = (_ScrollToTop$get = ScrollToTop.get(element)) === null || _ScrollToTop$get === void 0 ? void 0 : _ScrollToTop$get.destroy();
      super(element, {
        id: DUMMY_ID$6
      });
      const offset = (config === null || config === void 0 ? void 0 : config.offset) || `${S_TOP}: var(${prefixCssVar("scroll-to-top--offset")}, 200vh)`;
      const position = (config === null || config === void 0 ? void 0 : config.position) || S_RIGHT;
      const scrollable = config === null || config === void 0 ? void 0 : config.scrollable;
      const hasCustomScrollable = scrollable && scrollable !== getDocElement() && scrollable !== getBody();
      const scrollWatcher = ScrollWatcher.reuse();
      const viewWatcher = ViewWatcher.reuse(hasCustomScrollable ? {
        root: scrollable
      } : {});
      const clickListener = () => scrollWatcher.scrollTo({
        top: 0,
        left: 0
      }, {
        scrollable
      });
      let arrow;
      let placeholder;
      let root = element;
      const showIt = () => {
        showElement(root);
      };
      const hideIt = () => {
        hideElement(root);
      };

      // SETUP ------------------------------

      (destroyPromise || promiseResolve()).then(async () => {
        const flexDirection = scrollable ? await getParentFlexDirection(scrollable) : null;
        await waitForMutateTime();
        if (this.isDestroyed()) {
          return;
        }
        if (hasCustomScrollable) {
          // Add a placeholder to restore its position on destroy.
          placeholder = createElement("div");
          moveElementNow(placeholder, {
            to: element,
            position: "before",
            ignoreMove: true
          });

          // Then move it to immediately after the scrollable.
          // If the parent is a horizontal flexbox and position is left, then
          // we need to insert it before the scrollable.
          const shouldInsertBefore = flexDirection === "column-reverse" || position === S_LEFT && flexDirection === "row" || position === S_RIGHT && flexDirection === "row-reverse";
          moveElementNow(element, {
            to: scrollable,
            position: shouldInsertBefore ? "before" : "after",
            ignoreMove: true
          });

          // Wrap the button.
          root = wrapElementNow(element, {
            wrapper: "div",
            ignoreMove: true
          });
        }
        disableInitialTransition(root);
        addClassesNow(root, PREFIX_ROOT$1);
        addClassesNow(element, PREFIX_BTN);
        setBooleanDataNow(root, PREFIX_FIXED, !hasCustomScrollable);
        setDataNow(root, PREFIX_PLACE, position);
        arrow = insertArrow(element, S_UP);
        hideIt(); // initial

        addEventListenerTo(element, S_CLICK, clickListener);
        viewWatcher.onView(offset, showIt, {
          views: [S_AT, S_BELOW]
        });
        viewWatcher.onView(offset, hideIt, {
          views: [S_ABOVE]
        });
        this.onDisable(() => {
          undisplayElement(root);
        });
        this.onEnable(() => {
          displayElement(root);
        });
        this.onDestroy(async () => {
          await waitForMutateTime();
          removeEventListenerFrom(element, S_CLICK, clickListener);
          removeClassesNow(root, PREFIX_ROOT$1);
          removeClassesNow(element, PREFIX_BTN);
          delDataNow(root, PREFIX_FIXED);
          delDataNow(root, PREFIX_PLACE);
          displayElementNow(root); // revert undisplay by onDisable

          if (arrow) {
            moveElementNow(arrow); // remove
          }
          if (root !== element) {
            // Unwrap the button.
            replaceElementNow(root, element, {
              ignoreMove: true
            });
          }
          if (placeholder) {
            // Move it back into its original position.
            replaceElementNow(placeholder, element, {
              ignoreMove: true
            });
          }
          viewWatcher.offView(offset, showIt);
          viewWatcher.offView(offset, hideIt);
        });
      });
    }
  }

  /**
   * @interface
   */

  // --------------------

  const WIDGET_NAME$6 = "scroll-to-top";
  const PREFIXED_NAME$2 = prefixName(WIDGET_NAME$6);
  // Only one ScrollToTop widget per element is allowed, but Widget requires a
  // non-blank ID.
  const DUMMY_ID$6 = PREFIXED_NAME$2;
  const PREFIX_ROOT$1 = `${PREFIXED_NAME$2}__root`;
  const PREFIX_BTN = `${PREFIXED_NAME$2}__btn`;
  const PREFIX_FIXED = prefixName("fixed");
  let mainWidget$1 = null;
  const newConfigValidator$1 = element => {
    return {
      offset: (key, value) => validateString(key, value, isValidScrollOffset),
      position: (key, value) => validateString(key, value, v => v === S_LEFT || v === S_RIGHT),
      scrollable: (key, value) => {
        var _ref;
        return (_ref = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
      }
    };
  };

  /**
   * @module Widgets
   */


  /**
   * Configures the given element as a {@link SmoothScroll} widget.
   *
   * The SmoothScroll widget creates a configurable smooth scrolling
   * experience, including support for lag and parallax depth, and using a custom
   * element that only takes up part of the page, all while preserving native
   * scrolling behaviour (i.e. it does not disable native scroll and does not use
   * fake scrollbars).
   *
   * **IMPORTANT:** The scrollable element you pass must have its children
   * wrapped. This will be done automatically unless you create these wrappers
   * yourself by ensuring your structure is as follows:
   *
   * ```html
   * <!-- If using the document as the scrollable -->
   * <body><!-- Element you instantiate as SmoothScroll, or you can pass documentElement -->
   *   <div class="lisn-smooth-scroll__content"><!-- Required wrapper; will be created if missing -->
   *     <div class="lisn-smooth-scroll__inner"><!-- Required inner wrapper; will be created if missing -->
   *       <!-- YOUR CONTENT -->
   *     </div>
   *   </div>
   * </body>
   * ```
   *
   * ```html
   * <!-- If using a custom scrollable -->
   * <div class="scrollable"><!-- Element you instantiate as SmoothScroll -->
   *   <div class="lisn-smooth-scroll__content"><!-- Required outer wrapper; will be created if missing -->
   *     <div class="lisn-smooth-scroll__inner"><!-- Required inner wrapper; will be created if missing -->
   *       <!-- YOUR CONTENT -->
   *     </div>
   *   </div>
   * </div>
   * ```
   *
   * **IMPORTANT:** If the scrollable element you pass is other than
   * `document.documentElement` or `document.body`, SmoothScroll will then rely on
   * position: sticky. XXX TODO
   *
   * **IMPORTANT:** You should not instantiate more than one
   * {@link SmoothScroll} widget on a given element. Use
   * {@link SmoothScroll.get} to get an existing instance if any. If there is
   * already a widget instance, it will be destroyed!
   *
   * -----
   *
   * To use with auto-widgets (HTML API) (see
   * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
   * CSS classes or data attributes are recognized:
   * - `lisn-smooth-scroll` class or `data-lisn-smooth-scroll` attribute set
   *   on the container element that constitutes the scrollable container
   *
   * See below examples for what values you can use set for the data attribute
   * in order to modify the configuration of the automatically created widget.
   *
   * @example
   * This will create a smooth scroller for
   * {@link settings.mainScrollableElementSelector | the main scrolling element}.
   *
   * This will work even if {@link settings.autoWidgets}) is false
   *
   * ```html
   * <!-- LISN should be loaded beforehand -->
   * <script>
   *   // You can also just customise global default settings:
   *   // LISN.settings.smoothScroll = "TODO";
   *
   *   LISN.widgets.SmoothScroll.enableMain({
   *     XXX: "TODO",
   *   });
   * </script>
   * ```
   *
   * @example
   * This will create a smooth scroller for a custom scrolling element (i.e. one
   * with overflow "auto" or "scroll").
   *
   * ```html
   * <div class="scrolling lisn-smooth-scroll">
   *   <!-- content here... -->
   * </div>
   * ```
   *
   * @example
   * As above but with custom settings.
   *
   * ```html
   * <div
   *   class="scrolling"
   *   data-lisn-smooth-scroll="XXX=TODO
   *                            | XXX=TODO
   *                        ">
   *   <!-- content here... -->
   * </div>
   * ```
   */
  class SmoothScroll extends Widget {
    // XXX TODO getScrollable ?

    /**
     * If element is omitted, returns the instance created by {@link enableMain}
     * if any.
     */
    static get(scrollable) {
      if (!scrollable) {
        return mainWidget;
      }
      if (scrollable === getDocElement()) {
        scrollable = getBody();
      }
      const instance = super.get(scrollable, DUMMY_ID$5);
      if (isInstanceOf(instance, SmoothScroll)) {
        return instance;
      }
      return null;
    }

    /**
     * Creates a smooth scroller for the
     * {@link settings.mainScrollableElementSelector | the main scrolling element}.
     *
     * **NOTE:** It returns a Promise to a widget because it will wait for the
     * main scrollable element to be present in the DOM if not already.
     */
    static async enableMain(config) {
      const scrollable = await ScrollWatcher.fetchMainScrollableElement();
      const widget = new SmoothScroll(scrollable, config);
      widget.onDestroy(() => {
        if (mainWidget === widget) {
          mainWidget = null;
        }
      });
      mainWidget = widget;
      return widget;
    }
    static register() {
      registerWidget(WIDGET_NAME$5, (element, config) => {
        if (isHTMLElement(element)) {
          if (!SmoothScroll.get(element)) {
            return new SmoothScroll(element, config);
          }
        } else {
          logError(usageError("Only HTMLElement is supported for SmoothScroll widget"));
        }
        return null;
      }, configValidator$4);
    }

    /**
     * Note that passing `document.body` is considered equivalent to
     * `document.documentElement`.
     */
    constructor(scrollable, config) {
      var _SmoothScroll$get;
      if (scrollable === getDocElement()) {
        scrollable = getBody();
      }
      const destroyPromise = (_SmoothScroll$get = SmoothScroll.get(scrollable)) === null || _SmoothScroll$get === void 0 ? void 0 : _SmoothScroll$get.destroy();
      super(scrollable, {
        id: DUMMY_ID$5
      });

      // const props = getScrollableProps(scrollable); // XXX
      // const ourScrollable = props.scrollable; // XXX

      (destroyPromise || promiseResolve()).then(async () => {
        if (this.isDestroyed()) {
          return;
        }
        init$1(this, scrollable, config);
        // XXX init(this, scrollable, props, config);
      });
    }
  }

  /**
   * @interface
   */

  // --------------------

  const WIDGET_NAME$5 = "smooth-scroll";
  const PREFIXED_NAME$1 = prefixName(WIDGET_NAME$5);
  // Only one SmoothScroll widget per element is allowed, but Widget requires a
  // non-blank ID.
  const DUMMY_ID$5 = PREFIXED_NAME$1;
  const PREFIX_ROOT = `${PREFIXED_NAME$1}__root`;
  const PREFIX_DUMMY = `${PREFIXED_NAME$1}__dummy`;
  const PREFIX_OUTER_WRAPPER = `${PREFIXED_NAME$1}__content`;
  const PREFIX_INNER_WRAPPER = `${PREFIXED_NAME$1}__inner`;
  const PREFIX_HAS_H_SCROLL = prefixName("has-h-scroll");
  const PREFIX_HAS_V_SCROLL = prefixName("has-v-scroll");
  const PREFIX_USES_STICKY = prefixName("uses-sticky");
  let mainWidget = null;
  const configValidator$4 = {
    id: validateString,
    className: validateStrList,
    lag: validateNumber
  };
  const createWrappers = (element, classNamesEntries) => {
    const wrapContentNow = (element, classNames) => tryWrapContentNow(element, {
      _classNames: classNames,
      _required: true,
      _requiredBy: "SmoothScroll"
    });
    let lastWrapper = element;
    const result = {};
    let createdByUs = [];
    const unwrapFn = () => {
      for (const [wrapper, classNames] of createdByUs) {
        unwrapContentNow(wrapper, classNames);
      }
      createdByUs = [];
    };
    for (const [key, classNames] of classNamesEntries) {
      // Add generic lisn-wrapper class to allow ScrollWatcher to reuse it
      const allClassNames = [...classNames, PREFIX_WRAPPER$3];
      let wrapper = getContentWrapper(lastWrapper, {
        _classNames: allClassNames
      });
      if (!wrapper) {
        wrapper = wrapContentNow(lastWrapper, allClassNames);
        createdByUs.push([wrapper, classNames]); // only remove the specific classes
      }
      lastWrapper = wrapper;
      result[key] = wrapper;
    }
    return {
      wrappers: result,
      unwrapFn
    };
  };

  // XXX TODO children can use unique lag factor
  const init$1 = async (widget, scrollable, config) => {
    const docEl = getDocElement();
    const body = getBody();
    const defaultScrollable = getDefaultScrollingElement();
    let needsSticky = true;
    let root = scrollable;
    if (scrollable === docEl || scrollable === body) {
      scrollable = defaultScrollable;
      root = body;
      needsSticky = false;
    }
    const logger = result ? new result.Logger({
      name: `SmoothScroll-${formatAsString(scrollable)}`,
      logAtCreation: {
        config,
        needsSticky
      }
    }) : null;
    if (needsSticky && !supportsSticky()) {
      logError("SmoothScroll on elements other than the document relies on " + "position: sticky, but this browser does not support sticky.");
      return;
    }
    const scrollWatcher = ScrollWatcher.reuse({
      [S_DEBOUNCE_WINDOW]: 0
    });
    const sizeWatcher = SizeWatcher.reuse({
      [S_DEBOUNCE_WINDOW]: 0
    });
    await waitForMeasureTime();
    const initialContentWidth = scrollable[S_SCROLL_WIDTH];
    const initialContentHeight = scrollable[S_SCROLL_HEIGHT];
    logger === null || logger === void 0 || logger.debug5({
      clientWidth: scrollable.clientWidth,
      clientHeight: scrollable.clientHeight,
      scrollWidth: initialContentWidth,
      scrollHeight: initialContentHeight
    });

    // We only care if it has horizontal/vertical scroll if we're using a custom
    // scrollable, so no need to check otherwise.
    const hasHScroll = needsSticky ? isScrollable(scrollable, {
      axis: "x"
    }) : false;
    const hasVScroll = needsSticky ? isScrollable(scrollable, {
      axis: "y"
    }) : false;

    // ----------

    const setSizeVars = (element, width, height, now = false) => {
      (now ? setNumericStyleJsVarsNow : setNumericStyleJsVars)(element, {
        width,
        height
      }, {
        _units: "px",
        _numDecimal: 2
      });
    };

    // If there's a scroll or size change for the scrollable container, update the
    // transforms and possibly the width/height of the content (if it uses sticky)
    // .
    const updatePropsOnScroll = (target, scrollData) => {
      updateTargetPosition(scrollData);

      // If the scrollable scrolls horizontally we need to set a fixed width on
      // the inner wrapper, and if it scrolls vertically we need to set a fixed
      // height.
      if (needsSticky) {
        setSizeVars(innerWrapper, hasHScroll ? scrollData[S_CLIENT_WIDTH] : NaN, hasVScroll ? scrollData[S_CLIENT_HEIGHT] : NaN);
      }
    };

    // If content is resized, update the dummy overflow to match its size
    const updatePropsOnResize = (target, sizeData) => {
      setSizeVars(dummy, sizeData.border[S_WIDTH], sizeData.border[S_HEIGHT]);
    };

    // ----------

    const currentPositions = {
      x: 0,
      y: 0
    };
    const targetPositions = copyObject(currentPositions);
    const updateTargetPosition = scrollData => {
      for (const d of ["x", "y"]) {
        const current = currentPositions[d];
        const target = targetPositions[d];
        const newTarget = scrollData[d === "x" ? S_SCROLL_LEFT : S_SCROLL_TOP];
        const isOngoing = current !== target;
        targetPositions[d] = newTarget;
        if (!isOngoing) {
          animateTransforms(d);
        }
      }
    };
    const animateTransforms = async d => {
      var _config$lag;
      const lag = (_config$lag = config === null || config === void 0 ? void 0 : config.lag) !== null && _config$lag !== void 0 ? _config$lag : 1000; // XXX
      logger === null || logger === void 0 || logger.debug10(`Starting animating ${d} transforms with lag ${lag}`);
      let target = targetPositions[d];
      let current = currentPositions[d];
      const iterator = newCriticallyDampedAnimationIterator({
        l: current,
        lTarget: target,
        lag
      });
      while ({
        l: current
      } = (await iterator.next(target)).value) {
        currentPositions[d] = current;
        target = targetPositions[d];
        setNumericStyleJsVars(innerWrapper, {
          [d]: -current
        }, {
          _prefix: "offset-",
          _units: "px",
          _numDecimal: 2
        });
        console.log("XXX", JSON.stringify({
          d,
          current,
          target
        }));
        if (current === target) {
          logger === null || logger === void 0 || logger.debug10(`Done animating ${d} transforms`, target);
          return;
        }
      }
    };

    // ----------

    const addWatchers = () => {
      // Track scroll in any direction as well as changes in border or content size
      // of the element and its contents.
      scrollWatcher.trackScroll(updatePropsOnScroll, {
        threshold: 0,
        scrollable
      });

      // Track changes in content or border size of the inner content wrapper.
      sizeWatcher.onResize(updatePropsOnResize, {
        target: innerWrapper,
        threshold: 0
      });
    };
    const removeWatchers = () => {
      scrollWatcher.noTrackScroll(updatePropsOnScroll, scrollable);
      sizeWatcher.offResize(updatePropsOnResize, innerWrapper);
    };

    // SETUP ------------------------------

    await waitForMutateTime();
    addClassesNow(root, PREFIX_ROOT);

    // Wrap the contents in a fixed/sticky positioned wrapper and insert a dummy
    // overflow element of the same size.
    // [TODO v2]: Better way to centrally manage wrapping and wrapping of elements
    const {
      wrappers,
      unwrapFn
    } = createWrappers(root, [["o", [PREFIX_OUTER_WRAPPER]], ["i", [PREFIX_INNER_WRAPPER]]]);
    const outerWrapper = wrappers.o;
    const innerWrapper = wrappers.i;
    if (needsSticky) {
      setBooleanDataNow(root, PREFIX_HAS_H_SCROLL, hasHScroll);
      setBooleanDataNow(root, PREFIX_HAS_V_SCROLL, hasVScroll);
      setBooleanDataNow(root, PREFIX_USES_STICKY);
    }
    if (config !== null && config !== void 0 && config.id) {
      outerWrapper.id = config.id;
    }
    if (config !== null && config !== void 0 && config.className) {
      addClassesNow(outerWrapper, ...toArrayIfSingle(config.className));
    }
    const dummy = createElement("div");
    addClassesNow(dummy, PREFIX_DUMMY);
    // set its size now to prevent initial layout shifts
    setSizeVars(dummy, initialContentWidth, initialContentHeight, true);
    moveElementNow(dummy, {
      to: root,
      ignoreMove: true
    });
    addWatchers();
    widget.onDisable(() => {
      removeWatchers();
      // XXX TODO re-enable regular scrolling
    });
    widget.onEnable(() => {
      addWatchers();
      // XXX TODO re-enable smooth scrolling
    });
    widget.onDestroy(async () => {
      await waitForMutateTime();
      unwrapFn();
      moveElementNow(dummy); // remove

      removeClassesNow(root, PREFIX_ROOT);
      delDataNow(root, PREFIX_HAS_H_SCROLL);
      delDataNow(root, PREFIX_HAS_V_SCROLL);
      delDataNow(root, PREFIX_USES_STICKY);
    });
  };

  /**
   * @module Widgets
   */


  /**
   * Configures the given element as a {@link Sortable} widget.
   *
   * The Sortable widget allows the user to reorder elements by dragging and
   * dropping. It works on touch devices as well. However, it does not yet
   * support automatic scrolling when dragging beyond edge of screen on mobile
   * devices. For this, you may want to use
   * {@link https://github.com/SortableJS/Sortable | SortableJS} instead.
   *
   * The widget should have more than one draggable item.
   *
   * **IMPORTANT:** You should not instantiate more than one {@link Sortable}
   * widget on a given element. Use {@link Sortable.get} to get an existing
   * instance if any. If there is already a widget instance, it will be destroyed!
   *
   * -----
   *
   * You can use the following dynamic attributes or CSS properties in your
   * stylesheet:
   *
   * The following dynamic attributes are set on each item element:
   * - `data-lisn-is-draggable`: `"true"` or `"false"` (false if the item is disabled)
   *
   * -----
   *
   * To use with auto-widgets (HTML API) (see
   * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
   * CSS classes or data attributes are recognized:
   * - `lisn-sortable` class or `data-lisn-sortable` attribute set on the
   *   container element that constitutes the sortable container
   * - `lisn-sortable-item` class or `data-lisn-sortable-item` attribute set on
   *   elements that should act as the items.
   *
   * When using auto-widgets, the elements that will be used as items are
   * discovered in the following way:
   * 1. The top-level element that constitutes the widget is searched for any
   *    elements that contain the `lisn-sortable-item` class or
   *    `data-lisn-sortable-item` attribute. They do not have to be immediate
   *    children of the root element.
   * 2. If there are no such elements, all of the immediate children of the
   *    widget element (other than `script` and `style` elements) are taken as
   *    the items.
   *
   * @example
   * ```html
   * <div class="lisn-sortable">
   *   <div class="box">Item 1</div>
   *   <div class="box">Item 2</div>
   *   <div class="box">Item 3</div>
   *   <div class="box">Item 4</div>
   * </div>
   * ```
   */
  class Sortable extends Widget {
    /**
     * Disables the given item number. Note that item numbers start at 1.
     *
     * @param currentOrder If false (default), the item numbers refer to the
     *                     original order. If true, they refer to the current
     *                     document order.
     */

    /**
     * Re-enables the given item number. Note that item numbers start at 1.
     *
     * @param currentOrder If false (default), the item numbers refer to the
     *                     original order. If true, they refer to the current
     *                     document order.
     */

    /**
     * Re-enables the given item number if it is disabled, otherwise disables it.
     * Note that item numbers start at 1.
     *
     * @param currentOrder If false (default), the item numbers refer to the
     *                     original order. If true, they refer to the current
     *                     document order.
     */

    /**
     * Returns true if the given item number is disabled. Note that item numbers
     * start at 1.
     *
     * @param currentOrder If false (default), the item numbers refer to the
     *                     original order. If true, they refer to the current
     *                     document order.
     */

    /**
     * The given handler will be called whenever the user moves an item to
     * another position. It will be called after the item is moved so
     * {@link getItems} called with `currentOrder = true` will return the updated
     * order.
     *
     * If the handler returns a promise, it will be awaited upon.
     */

    /**
     * Returns the item elements.
     *
     * @param currentOrder If false (default), returns the items in the
     *                     original order. If true, they are returned in the
     *                     current document order.
     */

    static get(element) {
      const instance = super.get(element, DUMMY_ID$4);
      if (isInstanceOf(instance, Sortable)) {
        return instance;
      }
      return null;
    }
    static register() {
      registerWidget(WIDGET_NAME$4, (element, config) => {
        if (!Sortable.get(element)) {
          return new Sortable(element, config);
        }
        return null;
      }, configValidator$3);
    }

    /**
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If there are less than 2 items given or found.
     */
    constructor(element, config) {
      var _Sortable$get;
      const destroyPromise = (_Sortable$get = Sortable.get(element)) === null || _Sortable$get === void 0 ? void 0 : _Sortable$get.destroy();
      super(element, {
        id: DUMMY_ID$4
      });
      const items = (config === null || config === void 0 ? void 0 : config.items) || [];
      if (!lengthOf(items)) {
        items.push(...querySelectorAll(element, getDefaultWidgetSelector(PREFIX_ITEM__FOR_SELECT)));
        if (!lengthOf(items)) {
          items.push(...querySelectorAll(element, `[${S_DRAGGABLE}]`));
          if (!lengthOf(items)) {
            items.push(...getVisibleContentChildren(element));
          }
        }
      }
      if (lengthOf(items) < 2) {
        throw usageError("Sortable must have more than 1 item");
      }
      const methods = getMethods(this, items, config);
      (destroyPromise || promiseResolve()).then(() => {
        if (this.isDestroyed()) {
          return;
        }
        init(this, element, items, methods);
      });
      this.disableItem = methods._disableItem;
      this.enableItem = methods._enableItem;
      this.toggleItem = methods._toggleItem;
      this.isItemDisabled = methods._isItemDisabled;
      this.onMove = methods._onMove;
      this.getItems = (currentOrder = false) => currentOrder ? methods._getSortedItems() : [...items];
    }
  }

  /**
   * @interface
   */

  // --------------------

  const WIDGET_NAME$4 = "sortable";
  const PREFIXED_NAME = prefixName(WIDGET_NAME$4);
  const PREFIX_IS_DRAGGABLE = prefixName("is-draggable");

  // Use different classes for styling items to the one used for auto-discovering
  // them, so that re-creating existing widgets can correctly find the items to
  // be used by the new widget synchronously before the current one is destroyed.
  const PREFIX_ITEM = `${PREFIXED_NAME}__item`;
  const PREFIX_ITEM__FOR_SELECT = `${PREFIXED_NAME}-item`;
  const PREFIX_FLOATING_CLONE = `${PREFIXED_NAME}__ghost`;

  // Only one Sortable widget per element is allowed, but Widget requires a
  // non-blank ID.
  const DUMMY_ID$4 = PREFIXED_NAME;
  const configValidator$3 = {
    mode: (key, value) => validateString(key, value, v => v === "swap" || v === "move")
  };
  const touchMoveOptions = {
    passive: false,
    capture: true
  };
  const isItemDraggable = item => getBooleanData(item, PREFIX_IS_DRAGGABLE);
  const init = (widget, element, items, methods) => {
    let currentDraggedItem = null;
    let floatingClone = null;
    let ignoreCancel = false;
    let grabOffset = [0, 0];
    const setIgnoreCancel = () => ignoreCancel = true;
    const onDragStart = event => {
      const currTarget = currentTargetOf(event);
      if (isElement(currTarget) && isItemDraggable(currTarget) && isMouseEvent(event)) {
        currentDraggedItem = currTarget;
        setAttr(currTarget, S_DRAGGABLE);
        if (isTouchPointerEvent(event)) {
          const target = targetOf(event);
          if (isElement(target)) {
            target.releasePointerCapture(event.pointerId);
          }
        }
        addEventListenerTo(getDoc(), S_TOUCHMOVE, onTouchMove, touchMoveOptions);
        waitForMeasureTime().then(() => {
          // Get pointer offset relative to the current item being dragged
          // regardless of what the event target is and what transforms is has
          // applied.
          const rect = getBoundingClientRect(currTarget);
          grabOffset = [event.clientX - rect.left, event.clientY - rect.top];
        });
      }
    };
    const onDragEnd = event => {
      if (ignoreCancel && event.type === S_POINTERCANCEL) {
        ignoreCancel = false;
        return;
      }
      if (currentDraggedItem) {
        unsetAttr(currentDraggedItem, S_DRAGGABLE);
        currentDraggedItem = null;
        removeEventListenerFrom(getDoc(), S_TOUCHMOVE, onTouchMove, touchMoveOptions);
        if (floatingClone) {
          moveElement(floatingClone);
          floatingClone = null;
        }
      }
    };
    const onTouchMove = event => {
      if (isTouchEvent(event) && lengthOf(event.touches) === 1) {
        const parentEl = parentOf(currentDraggedItem);
        if (parentEl && currentDraggedItem) {
          preventDefault(event);
          const touch = event.touches[0];
          const clientX = touch.clientX;
          const clientY = touch.clientY;
          if (!floatingClone) {
            floatingClone = cloneElement(currentDraggedItem);
            addClasses(floatingClone, PREFIX_FLOATING_CLONE);
            copyStyle(currentDraggedItem, floatingClone, ["width", "height"]).then(() => {
              if (floatingClone) {
                moveElement(floatingClone, {
                  to: parentEl
                });
              }
            });
          }
          if (floatingClone) {
            setNumericStyleJsVars(floatingClone, {
              clientX: clientX - grabOffset[0],
              clientY: clientY - grabOffset[1]
            }, {
              _units: "px"
            });
          }
        }
      }
    };
    const onDragEnter = event => {
      const currTarget = currentTargetOf(event);
      const dragged = currentDraggedItem;
      if ((isTouchPointerEvent(event) || event.type === S_DRAGENTER) && dragged && isElement(currTarget) && currTarget !== dragged) {
        methods._dragItemOnto(dragged, currTarget); // no need to await
      }
    };
    const setupEvents = () => {
      for (const item of items) {
        preventSelect(item);
        addEventListenerTo(item, S_POINTERDOWN, onDragStart);
        addEventListenerTo(item, S_DRAGSTART, setIgnoreCancel); // non-touch

        addEventListenerTo(item, S_POINTERENTER, onDragEnter); // touch
        addEventListenerTo(item, S_DRAGENTER, onDragEnter); // non-touch

        addEventListenerTo(item, S_DRAGOVER, preventDefault); // non-touch

        addEventListenerTo(item, S_DRAGEND, onDragEnd); // non-touch
        addEventListenerTo(item, S_DROP, onDragEnd); // non-touch

        addEventListenerTo(getDoc(), S_POINTERUP, onDragEnd);
        addEventListenerTo(getDoc(), S_POINTERCANCEL, onDragEnd);
      }
    };

    // SETUP ------------------------------

    for (const item of items) {
      addClasses(item, PREFIX_ITEM);
      setBooleanData(item, PREFIX_IS_DRAGGABLE);
    }
    widget.onEnable(setupEvents);
    widget.onDisable(() => {
      for (const item of items) {
        undoPreventSelect(item);
        removeEventListenerFrom(item, S_POINTERDOWN, onDragStart);
        removeEventListenerFrom(item, S_DRAGSTART, setIgnoreCancel);
        removeEventListenerFrom(item, S_POINTERENTER, onDragEnter);
        removeEventListenerFrom(item, S_DRAGENTER, onDragEnter);
        removeEventListenerFrom(item, S_DRAGOVER, preventDefault);
        removeEventListenerFrom(item, S_POINTERUP, onDragEnd);
        removeEventListenerFrom(item, S_POINTERCANCEL, onDragEnd);
        removeEventListenerFrom(item, S_DRAGEND, onDragEnd);
        removeEventListenerFrom(item, S_DROP, onDragEnd);
      }
    });
    widget.onDestroy(async () => {
      for (const item of items) {
        await removeClasses(item, PREFIX_ITEM);
        await delData(item, PREFIX_IS_DRAGGABLE);
      }
    });
    setupEvents();
  };
  const getMethods = (widget, items, config) => {
    const doSwap = (config === null || config === void 0 ? void 0 : config.mode) === "swap";
    const disabledItems = {};
    const callbacks = newSet();
    const getSortedItems = () => [...items].sort((a, b) => isNodeBAfterA(a, b) ? -1 : 1);
    const getOrigItemNumber = (itemNum, currentOrder = false) => currentOrder ? items.indexOf(getSortedItems()[itemNum - 1]) + 1 : itemNum;
    const isItemDisabled = (itemNum, currentOrder = false) => disabledItems[getOrigItemNumber(itemNum, currentOrder)] === true;
    const disableItem = async (itemNum, currentOrder = false) => {
      itemNum = getOrigItemNumber(toInt(itemNum), currentOrder);
      if (widget.isDisabled() || itemNum < 1 || itemNum > lengthOf(items)) {
        return;
      }

      // set immediately for toggle to work without awaiting on it
      disabledItems[itemNum] = true;
      await unsetBooleanData(items[itemNum - 1], PREFIX_IS_DRAGGABLE);
    };
    const enableItem = async (itemNum, currentOrder = false) => {
      itemNum = getOrigItemNumber(toInt(itemNum), currentOrder);
      if (widget.isDisabled() || !isItemDisabled(itemNum)) {
        return;
      }

      // set immediately for toggle to work without awaiting on it
      disabledItems[itemNum] = false;
      await setBooleanData(items[itemNum - 1], PREFIX_IS_DRAGGABLE);
    };
    const toggleItem = (itemNum, currentOrder = false) => isItemDisabled(itemNum, currentOrder) ? enableItem(itemNum, currentOrder) : disableItem(itemNum, currentOrder);
    const onMove = handler => callbacks.add(wrapCallback(handler));

    // This is internal only for now...
    const dragItemOnto = async (dragged, draggedOver) => {
      if (doSwap) {
        await swapElements(dragged, draggedOver, {
          ignoreMove: true
        });
      } else {
        await moveElement(dragged, {
          to: draggedOver,
          position: isNodeBAfterA(dragged, draggedOver) ? "after" : "before",
          ignoreMove: true
        });
      }
      for (const callback of callbacks) {
        await callback.invoke(widget);
      }
    };
    return {
      _getSortedItems: getSortedItems,
      _disableItem: disableItem,
      _enableItem: enableItem,
      _toggleItem: toggleItem,
      _isItemDisabled: isItemDisabled,
      _onMove: onMove,
      _dragItemOnto: dragItemOnto
    };
  };

  /**
   * @module Widgets
   */


  /**
   * This is a simple wrapper around the {@link GestureWatcher}. If you are using
   * the JavaScript API, you should use the {@link GestureWatcher} directly. The
   * purpose of this widget is to expose the watcher's ability to track gestures
   * and set relevant CSS properties via the HTML API. See
   * {@link GestureWatcher.trackGesture}.
   *
   * -----
   *
   * To use with auto-widgets (HTML API) (see
   * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
   * CSS classes or data attributes are recognized:
   * - `lisn-track-gesture` class or `data-lisn-track-gesture` attribute set on
   *   the element that constitutes the widget.
   *
   * See below examples for what values you can use set for the data attributes
   * in order to modify the configuration of the automatically created widget.
   *
   * @example
   * This will track user gestures over this element and set the relevant CSS
   * properties. It will use the default {@link GestureWatcher} options.
   *
   * ```html
   * <div class="lisn-track-gesture"></div>
   * ```
   *
   * @example
   * As above but with custom settings.
   *
   * ```html
   * <div data-lisn-track-gesture="prevent-default=false
   *                               | min-delta-x=-100
   *                               | max-delta-x=100
   *                               | min-delta-y=-100
   *                               | max-delta-y=100
   *                               | min-delta-z=0.5
   *                               | max-delta-z=2"
   * ></div>
   * ```
   */
  class TrackGesture extends Widget {
    static get(element) {
      const instance = super.get(element, DUMMY_ID$3);
      if (isInstanceOf(instance, TrackGesture)) {
        return instance;
      }
      return null;
    }
    static register() {
      registerWidget(WIDGET_NAME$3, (element, config) => {
        if (!TrackGesture.get(element)) {
          return new TrackGesture(element, config);
        }
        return null;
      }, configValidator$2);
    }
    constructor(element, config) {
      super(element, {
        id: DUMMY_ID$3
      });
      GestureWatcher.reuse().trackGesture(element, null, {
        preventDefault: config === null || config === void 0 ? void 0 : config.preventDefault,
        minTotalDeltaX: config === null || config === void 0 ? void 0 : config.minDeltaX,
        maxTotalDeltaX: config === null || config === void 0 ? void 0 : config.maxDeltaX,
        minTotalDeltaY: config === null || config === void 0 ? void 0 : config.minDeltaY,
        maxTotalDeltaY: config === null || config === void 0 ? void 0 : config.maxDeltaY,
        minTotalDeltaZ: config === null || config === void 0 ? void 0 : config.minDeltaZ,
        maxTotalDeltaZ: config === null || config === void 0 ? void 0 : config.maxDeltaZ
      });
      this.onDestroy(() => GestureWatcher.reuse().noTrackGesture(element));
    }
  }

  /**
   * @interface
   */

  // --------------------

  const WIDGET_NAME$3 = "track-gesture";
  // Only one TrackGesture widget per element is allowed, but Widget requires a
  // non-blank ID.
  const DUMMY_ID$3 = WIDGET_NAME$3;
  const configValidator$2 = {
    preventDefault: validateBoolean,
    minDeltaX: validateNumber,
    maxDeltaX: validateNumber,
    minDeltaY: validateNumber,
    maxDeltaY: validateNumber,
    minDeltaZ: validateNumber,
    maxDeltaZ: validateNumber
  };

  /**
   * @module Widgets
   */


  /**
   * This is a simple wrapper around the {@link ScrollWatcher}. If you are using
   * the JavaScript API, you should use the {@link ScrollWatcher} directly. The
   * purpose of this widget is to expose the watcher's ability to track scroll
   * and set relevant CSS properties via the HTML API. See
   * {@link ScrollWatcher.trackScroll}.
   *
   * -----
   *
   * To use with auto-widgets (HTML API) (see
   * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
   * CSS classes or data attributes are recognized:
   * - `lisn-track-scroll` class or `data-lisn-track-scroll` attribute set on
   *   the element that constitutes the widget.
   *
   * @example
   * This will track scroll on this element and set the relevant CSS properties.
   *
   * ```html
   * <div class="lisn-track-scroll"></div>
   * ```
   *
   * @example
   * As above but with custom options
   *
   * ```html
   * <div data-lisn-track-scroll="threshold=0 | debounce-window=0"></div>
   * ```
   */
  class TrackScroll extends Widget {
    static get(element) {
      const instance = super.get(element, DUMMY_ID$2);
      if (isInstanceOf(instance, TrackScroll)) {
        return instance;
      }
      return null;
    }
    static register() {
      registerWidget(WIDGET_NAME$2, (element, config) => {
        if (!TrackScroll.get(element)) {
          return new TrackScroll(element, config);
        }
        return null;
      }, configValidator$1);
    }
    constructor(element, config) {
      super(element, {
        id: DUMMY_ID$2
      });
      ScrollWatcher.reuse().trackScroll(null, assign({
        scrollable: element
      }, config));
      this.onDestroy(() => ScrollWatcher.reuse().noTrackScroll(null, element));
    }
  }

  /**
   * @interface
   */

  // --------------------

  const WIDGET_NAME$2 = "track-scroll";
  // Only one TrackScroll widget per element is allowed, but Widget requires a
  // non-blank ID.
  const DUMMY_ID$2 = WIDGET_NAME$2;
  const configValidator$1 = {
    threshold: validateNumber,
    debounceWindow: validateNumber
  };

  /**
   * @module Widgets
   */


  /**
   * This is a simple wrapper around the {@link SizeWatcher}. If you are using
   * the JavaScript API, you should use the {@link SizeWatcher} directly. The
   * purpose of this widget is to expose the watcher's ability to track size
   * and set relevant CSS properties via the HTML API. See
   * {@link SizeWatcher.trackSize}.
   *
   * -----
   *
   * To use with auto-widgets (HTML API) (see
   * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
   * CSS classes or data attributes are recognized:
   * - `lisn-track-size` class or `data-lisn-track-size` attribute set on
   *   the element that constitutes the widget.
   *
   * This widget does not support configuration and uses the default
   * {@link SizeWatcher} configuration except for resize threshold equal to 0.
   *
   * @example
   * This will track the size of this element and set the relevant CSS
   * properties. It will use the default {@link SizeWatcher} options and resize
   * threshold of 0.
   *
   * ```html
   * <div class="lisn-track-size"></div>
   * ```
   *
   * @example
   * As above but with custom options
   *
   * ```html
   * <div data-lisn-track-size="threshold=0 | debounce-window=0"></div>
   * ```
   */
  class TrackSize extends Widget {
    static get(element) {
      const instance = super.get(element, DUMMY_ID$1);
      if (isInstanceOf(instance, TrackSize)) {
        return instance;
      }
      return null;
    }
    static register() {
      registerWidget(WIDGET_NAME$1, (element, config) => {
        if (!TrackSize.get(element)) {
          return new TrackSize(element, config);
        }
        return null;
      }, configValidator);
    }
    constructor(element, config) {
      super(element, {
        id: DUMMY_ID$1
      });
      SizeWatcher.reuse().trackSize(null, assign({
        target: element
      }, config));
      this.onDestroy(() => SizeWatcher.reuse().noTrackSize(null, element));
    }
  }

  /**
   * @interface
   *
   * @since v1.2.0
   */

  // --------------------

  const WIDGET_NAME$1 = "track-size";
  // Only one TrackSize widget per element is allowed, but Widget requires a
  // non-blank ID.
  const DUMMY_ID$1 = WIDGET_NAME$1;
  const configValidator = {
    threshold: validateNumber,
    debounceWindow: validateNumber
  };

  /**
   * @module Widgets
   */


  /**
   * This is a simple wrapper around the {@link ViewWatcher}. If you are using
   * the JavaScript API, you should use the {@link ViewWatcher} directly. The
   * purpose of this widget is to expose the watcher's ability to track an
   * element's position across the viewport (or a given root element) and set
   * relevant CSS properties via the HTML API. See {@link ViewWatcher.trackView}.
   *
   * -----
   *
   * To use with auto-widgets (HTML API) (see
   * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
   * CSS classes or data attributes are recognized:
   * - `lisn-track-view` class or `data-lisn-track-view` attribute set on
   *   the element that constitutes the widget.
   *
   * See below examples for what values you can use set for the data attributes
   * in order to modify the configuration of the automatically created widget.
   *
   * Note that the root margin value can either be comma-separated or
   * space-separated.
   *
   * @example
   * This will track the element across the viewport and set the relevant CSS
   * properties.
   *
   * ```html
   * <div class="lisn-track-view"></div>
   * ```
   *
   * @example
   * As above but with custom settings.
   *
   * ```html
   * <div id="myRoot"></div>
   * <div data-lisn-track-view="root=#myRoot
   *                            | root-margin=100px,50px
   *                            | threshold=0,0.5
   *                            | debounce-window=0
   *                            | resize-threshold=0
   *                            | scroll-threshold=0"
   * ></div>
   * ```
   */
  class TrackView extends Widget {
    static get(element) {
      const instance = super.get(element, DUMMY_ID);
      if (isInstanceOf(instance, TrackView)) {
        return instance;
      }
      return null;
    }
    static register() {
      registerWidget(WIDGET_NAME, (element, config) => {
        if (!TrackView.get(element)) {
          return new TrackView(element, config);
        }
        return null;
      }, newConfigValidator);
    }
    constructor(element, config) {
      var _config$rootMargin;
      super(element, {
        id: DUMMY_ID
      });
      const watcher = ViewWatcher.reuse({
        root: config === null || config === void 0 ? void 0 : config.root,
        rootMargin: config === null || config === void 0 || (_config$rootMargin = config.rootMargin) === null || _config$rootMargin === void 0 ? void 0 : _config$rootMargin.replace(/,/g, " "),
        threshold: config === null || config === void 0 ? void 0 : config.threshold
      });
      watcher.trackView(element, null, config);
      this.onDestroy(() => watcher.noTrackView(element));
    }
  }

  /**
   * @interface
   */

  // --------------------

  const WIDGET_NAME = "track-view";
  // Only one TrackView widget per element is allowed, but Widget requires a
  // non-blank ID.
  const DUMMY_ID = WIDGET_NAME;
  const newConfigValidator = element => {
    return {
      root: (key, value) => {
        var _ref;
        return (_ref = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
      },
      rootMargin: validateString,
      threshold: (key, value) => validateNumList(key, value),
      debounceWindow: validateNumber,
      resizeThreshold: validateNumber,
      scrollThreshold: validateNumber
    };
  };

  /**
   * @module
   * @ignore
   * @internal
   */

  var index$3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    AutoHide: AutoHide,
    Collapsible: Collapsible,
    Modal: Modal,
    Offcanvas: Offcanvas,
    Openable: Openable,
    PageLoader: PageLoader,
    Pager: Pager,
    Popup: Popup,
    SameHeight: SameHeight,
    ScrollToTop: ScrollToTop,
    Scrollbar: Scrollbar,
    SmoothScroll: SmoothScroll,
    Sortable: Sortable,
    TrackGesture: TrackGesture,
    TrackScroll: TrackScroll,
    TrackSize: TrackSize,
    TrackView: TrackView,
    Widget: Widget,
    fetchUniqueWidget: fetchUniqueWidget,
    fetchWidgetConfig: fetchWidgetConfig,
    getDefaultWidgetSelector: getDefaultWidgetSelector,
    getWidgetConfig: getWidgetConfig,
    registerOpenable: registerOpenable,
    registerWidget: registerWidget
  });

  /**
   * @module
   * @ignore
   * @internal
   */

  AddClass.register();
  RemoveClass.register();
  AnimatePlay.register();
  AnimatePause.register();
  Animate.register();
  Display.register();
  Undisplay.register();
  Open.register();
  NextPage.register();
  PrevPage.register();
  GoToPage.register();
  EnablePage.register();
  DisablePage.register();
  ScrollTo.register();
  SetAttribute.register();
  Show.register();
  Hide.register();
  Enable.register();
  Disable.register();
  Run.register();
  LayoutTrigger.register();
  LoadTrigger.register();
  CheckTrigger.register();
  ClickTrigger.register();
  PressTrigger.register();
  HoverTrigger.register();
  ScrollTrigger.register();
  Trigger.register();
  ViewTrigger.register();
  AutoHide.register();
  Collapsible.register();
  Popup.register();
  Modal.register();
  Offcanvas.register();
  PageLoader.register();
  Pager.register();
  SameHeight.register();
  Scrollbar.register();
  ScrollToTop.register();
  SmoothScroll.register();
  Sortable.register();
  TrackGesture.register();
  TrackScroll.register();
  TrackSize.register();
  TrackView.register();

  /**
   * @module
   * @ignore
   * @internal
   */

  var index$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Console: Console,
    Logger: Logger,
    RemoteConsole: RemoteConsole
  });

  /**
   * @module
   * @ignore
   * @internal
   */

  var index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    DEVICES: DEVICES,
    DIRECTIONS: DIRECTIONS,
    DOM_CATEGORIES_SPACE: DOM_CATEGORIES_SPACE,
    INTENTS: INTENTS,
    NUM_LAYOUTS: NUM_LAYOUTS,
    ORDERED_ASPECTR: ORDERED_ASPECTR,
    ORDERED_DEVICES: ORDERED_DEVICES,
    POINTER_ACTIONS: POINTER_ACTIONS,
    POSITIONS: POSITIONS,
    SCROLL_DIRECTIONS: SCROLL_DIRECTIONS,
    VIEWS_SPACE: VIEWS_SPACE,
    XY_DIRECTIONS: XY_DIRECTIONS,
    Z_DIRECTIONS: Z_DIRECTIONS,
    addClasses: addClasses,
    addClassesNow: addClassesNow,
    addDeltaZ: addDeltaZ,
    addEventListenerTo: addEventListenerTo,
    areAntiParallel: areAntiParallel,
    areParallel: areParallel,
    asyncMeasurerFor: asyncMeasurerFor,
    asyncMutatorFor: asyncMutatorFor,
    callEventListener: callEventListener,
    camelToKebabCase: camelToKebabCase,
    clearIgnoreMove: clearIgnoreMove,
    cloneElement: cloneElement,
    compareValuesIn: compareValuesIn,
    copyExistingKeys: copyExistingKeys,
    copyStyle: copyStyle,
    createOverlay: createOverlay,
    criticallyDamped: criticallyDamped,
    degToRad: degToRad,
    delData: delData,
    delDataNow: delDataNow,
    delHasModal: delHasModal,
    delStyleProp: delStyleProp,
    delStylePropNow: delStylePropNow,
    disableInitialTransition: disableInitialTransition,
    displayElement: displayElement,
    displayElementNow: displayElementNow,
    distanceBetween: distanceBetween,
    easeInOutQuad: easeInOutQuad,
    fetchMainContentElement: fetchMainContentElement,
    fetchMainScrollableElement: fetchMainScrollableElement,
    fetchScrollableElement: fetchScrollableElement,
    fetchViewportOverlay: fetchViewportOverlay,
    fetchViewportSize: fetchViewportSize,
    formatAsString: formatAsString,
    getBitmask: getBitmask,
    getBoolData: getBoolData,
    getBooleanData: getBooleanData,
    getBrowserSupport: getBrowserSupport,
    getClientHeightNow: getClientHeightNow,
    getClientWidthNow: getClientWidthNow,
    getClosestScrollable: getClosestScrollable,
    getComputedStyleProp: getComputedStyleProp,
    getComputedStylePropNow: getComputedStylePropNow,
    getContentWrapper: getContentWrapper,
    getCurrentScrollAction: getCurrentScrollAction,
    getData: getData,
    getDebouncedHandler: getDebouncedHandler,
    getDefaultScrollingElement: getDefaultScrollingElement,
    getEntryBorderBox: getEntryBorderBox,
    getEntryContentBox: getEntryContentBox,
    getFlexDirection: getFlexDirection,
    getIgnoreMove: getIgnoreMove,
    getKeyGestureFragment: getKeyGestureFragment,
    getLayoutBitmask: getLayoutBitmask,
    getMaxDeltaDirection: getMaxDeltaDirection,
    getMaxTransitionDuration: getMaxTransitionDuration,
    getOppositeDirection: getOppositeDirection,
    getOppositeViews: getOppositeViews,
    getOppositeXYDirections: getOppositeXYDirections,
    getOrAssignID: getOrAssignID,
    getOtherAspectRatios: getOtherAspectRatios,
    getOtherDevices: getOtherDevices,
    getOverlay: getOverlay,
    getParentFlexDirection: getParentFlexDirection,
    getPointerGestureFragment: getPointerGestureFragment,
    getReferenceElement: getReferenceElement,
    getStyleProp: getStyleProp,
    getStylePropNow: getStylePropNow,
    getTouchDiff: getTouchDiff,
    getTouchGestureFragment: getTouchGestureFragment,
    getVectorDirection: getVectorDirection,
    getViewsBitmask: getViewsBitmask,
    getVisibleContentChildren: getVisibleContentChildren,
    getWheelGestureFragment: getWheelGestureFragment,
    getWrapper: getWrapper,
    hAngle: hAngle,
    hasAllClasses: hasAllClasses,
    hasAnyClass: hasAnyClass,
    hasClass: hasClass,
    havingMaxAbs: havingMaxAbs,
    havingMinAbs: havingMinAbs,
    hideAndRemoveElement: hideAndRemoveElement,
    hideElement: hideElement,
    hideElementNow: hideElementNow,
    ignoreMove: ignoreMove,
    insertArrow: insertArrow,
    insertGhostClone: insertGhostClone,
    insertGhostCloneNow: insertGhostCloneNow,
    isAllowedToWrap: isAllowedToWrap,
    isDOMElement: isDOMElement,
    isElementHidden: isElementHidden,
    isElementUndisplayed: isElementUndisplayed,
    isFlex: isFlex,
    isFlexChild: isFlexChild,
    isInQuirksMode: isInQuirksMode,
    isInlineTag: isInlineTag,
    isMobile: isMobile,
    isPageReady: isPageReady,
    isScrollable: isScrollable,
    isTouchScreen: isTouchScreen,
    isValidAspectRatio: isValidAspectRatio,
    isValidAspectRatioList: isValidAspectRatioList,
    isValidBox: isValidBox,
    isValidDevice: isValidDevice,
    isValidDeviceList: isValidDeviceList,
    isValidDimension: isValidDimension,
    isValidDirection: isValidDirection,
    isValidDirectionList: isValidDirectionList,
    isValidInputDevice: isValidInputDevice,
    isValidInputDeviceList: isValidInputDeviceList,
    isValidIntent: isValidIntent,
    isValidIntentList: isValidIntentList,
    isValidMutationCategory: isValidMutationCategory,
    isValidMutationCategoryList: isValidMutationCategoryList,
    isValidNum: isValidNum,
    isValidPointerAction: isValidPointerAction,
    isValidPointerActionList: isValidPointerActionList,
    isValidPosition: isValidPosition,
    isValidScrollDirection: isValidScrollDirection,
    isValidScrollDirectionList: isValidScrollDirectionList,
    isValidScrollOffset: isValidScrollOffset,
    isValidStrList: isValidStrList,
    isValidTwoFoldPosition: isValidTwoFoldPosition,
    isValidView: isValidView,
    isValidViewList: isValidViewList,
    isValidXYDirection: isValidXYDirection,
    isValidZDirection: isValidZDirection,
    isVisibleContentTag: isVisibleContentTag,
    iterateAnimations: iterateAnimations,
    joinAsString: joinAsString,
    kebabToCamelCase: kebabToCamelCase,
    keyExists: keyExists,
    keyWithMaxVal: keyWithMaxVal,
    keyWithMinVal: keyWithMinVal,
    logError: logError,
    logInfo: logInfo,
    logWarn: logWarn,
    mapScrollable: mapScrollable,
    maxAbs: maxAbs,
    minAbs: minAbs,
    moveChildren: moveChildren,
    moveChildrenNow: moveChildrenNow,
    moveElement: moveElement,
    moveElementNow: moveElementNow,
    newAnimationFrameIterator: newAnimationFrameIterator,
    newCriticallyDampedAnimationIterator: newCriticallyDampedAnimationIterator,
    normalizeAngle: normalizeAngle,
    normalizeWheel: normalizeWheel,
    objToStrKey: objToStrKey,
    omitKeys: omitKeys,
    onEveryAnimationFrame: onEveryAnimationFrame,
    parseScrollOffset: parseScrollOffset,
    preventSelect: preventSelect,
    quadraticRoots: quadraticRoots,
    radToDeg: radToDeg,
    randId: randId,
    removeClasses: removeClasses,
    removeClassesNow: removeClassesNow,
    removeEventListenerFrom: removeEventListenerFrom,
    replaceClass: replaceClass,
    replaceClassNow: replaceClassNow,
    replaceElement: replaceElement,
    replaceElementNow: replaceElementNow,
    resetCssAnimationsNow: resetCssAnimationsNow,
    roundNumTo: roundNumTo,
    scheduleHighPriorityTask: scheduleHighPriorityTask,
    scrollTo: scrollTo,
    setBoolData: setBoolData,
    setBoolDataNow: setBoolDataNow,
    setBooleanData: setBooleanData,
    setBooleanDataNow: setBooleanDataNow,
    setData: setData,
    setDataNow: setDataNow,
    setHasModal: setHasModal,
    setNumericStyleJsVars: setNumericStyleJsVars,
    setNumericStyleJsVarsNow: setNumericStyleJsVarsNow,
    setStyleProp: setStyleProp,
    setStylePropNow: setStylePropNow,
    showElement: showElement,
    showElementNow: showElementNow,
    sortedKeysByVal: sortedKeysByVal,
    splitOn: splitOn,
    supportsSticky: supportsSticky,
    swapElements: swapElements,
    swapElementsNow: swapElementsNow,
    toArrayIfSingle: toArrayIfSingle,
    toBool: toBool,
    toBoolean: toBoolean,
    toInt: toInt,
    toMargins: toMargins,
    toNonNegNum: toNonNegNum,
    toNum: toNum,
    toNumWithBounds: toNumWithBounds,
    toPosNum: toPosNum,
    toggleClass: toggleClass,
    toggleClassNow: toggleClassNow,
    toggleClasses: toggleClasses,
    toggleClassesNow: toggleClassesNow,
    toggleDisplayElement: toggleDisplayElement,
    toggleDisplayElementNow: toggleDisplayElementNow,
    toggleShowElement: toggleShowElement,
    toggleShowElementNow: toggleShowElementNow,
    transitionElement: transitionElement,
    transitionElementNow: transitionElementNow,
    tryGetMainContentElement: tryGetMainContentElement,
    tryGetMainScrollableElement: tryGetMainScrollableElement,
    tryGetScrollableElement: tryGetScrollableElement,
    tryGetViewportOverlay: tryGetViewportOverlay,
    tryWrap: tryWrap,
    tryWrapContent: tryWrapContent,
    tryWrapContentNow: tryWrapContentNow,
    tryWrapNow: tryWrapNow,
    undisplayElement: undisplayElement,
    undisplayElementNow: undisplayElementNow,
    undoPreventSelect: undoPreventSelect,
    unmapScrollable: unmapScrollable,
    unsetBoolData: unsetBoolData,
    unsetBoolDataNow: unsetBoolDataNow,
    unsetBooleanData: unsetBooleanData,
    unsetBooleanDataNow: unsetBooleanDataNow,
    unwrapContent: unwrapContent,
    unwrapContentNow: unwrapContentNow,
    validateBoolean: validateBoolean,
    validateBooleanOrString: validateBooleanOrString,
    validateNumList: validateNumList,
    validateNumber: validateNumber,
    validateStrList: validateStrList,
    validateString: validateString,
    validateStringRequired: validateStringRequired,
    waitForAnimationFrame: waitForAnimationFrame,
    waitForComplete: waitForComplete,
    waitForDelay: waitForDelay,
    waitForElement: waitForElement,
    waitForElementOrInteractive: waitForElementOrInteractive,
    waitForInteractive: waitForInteractive,
    waitForMeasureTime: waitForMeasureTime,
    waitForMutateTime: waitForMutateTime,
    waitForPageReady: waitForPageReady,
    waitForReferenceElement: waitForReferenceElement,
    waitForSubsequentMeasureTime: waitForSubsequentMeasureTime,
    waitForSubsequentMutateTime: waitForSubsequentMutateTime,
    wrapChildren: wrapChildren,
    wrapChildrenNow: wrapChildrenNow,
    wrapElement: wrapElement,
    wrapElementNow: wrapElementNow
  });

  /**
   * @module
   * @ignore
   * @internal
   */

  var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    BitSpaces: BitSpaces,
    Callback: Callback,
    XIntersectionObserver: XIntersectionObserver,
    XMap: XMap,
    XMapBase: XMapBase,
    XResizeObserver: XResizeObserver,
    XWeakMap: XWeakMap,
    createBitSpace: createBitSpace,
    newBitSpaces: newBitSpaces,
    newXMap: newXMap,
    newXMapGetter: newXMapGetter,
    newXWeakMap: newXWeakMap,
    newXWeakMapGetter: newXWeakMapGetter,
    wrapCallback: wrapCallback
  });

  /**
   * @module
   * @ignore
   * @internal
   */

  settings.verbosityLevel = 10;

  exports.actions = _actions;
  exports.debug = index$2;
  exports.modules = index;
  exports.settings = settings;
  exports.triggers = index$4;
  exports.utils = index$1;
  exports.watchers = index$5;
  exports.widgets = index$3;

})(this.LISN = this.LISN || {});
//# sourceMappingURL=lisn.debug.js.map
