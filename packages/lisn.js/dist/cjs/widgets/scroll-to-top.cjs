"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollToTop = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _cssAlter = require("../utils/css-alter.cjs");
var _domAlter = require("../utils/dom-alter.cjs");
var _domEvents = require("../utils/dom-events.cjs");
var _domOptimize = require("../utils/dom-optimize.cjs");
var _domSearch = require("../utils/dom-search.cjs");
var _event = require("../utils/event.cjs");
var _validation = require("../utils/validation.cjs");
var _views = require("../utils/views.cjs");
var _scrollWatcher = require("../watchers/scroll-watcher.cjs");
var _viewWatcher = require("../watchers/view-watcher.cjs");
var _widget = require("./widget.cjs");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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
class ScrollToTop extends _widget.Widget {
  /**
   * If element is omitted, returns the instance created by {@link enableMain}
   * if any.
   */
  static get(element) {
    if (!element) {
      return mainWidget;
    }
    const instance = super.get(element, DUMMY_ID);
    if (MH.isInstanceOf(instance, ScrollToTop)) {
      return instance;
    }
    return null;
  }
  static register() {
    (0, _widget.registerWidget)(WIDGET_NAME, (element, config) => {
      if (!ScrollToTop.get(element)) {
        return new ScrollToTop(element, config);
      }
      return null;
    }, newConfigValidator);
  }

  /**
   * Creates a new button element, inserts it into the document body and
   * configures it as a {@link ScrollToTop}.
   */
  static enableMain(config) {
    const button = MH.createButton("Back to top");
    const widget = new ScrollToTop(button, config);
    widget.onDestroy(() => {
      if (mainWidget === widget) {
        mainWidget = null;
      }
      return (0, _domAlter.moveElement)(button);
    });
    (0, _domEvents.waitForElement)(MH.getBody).then(body => {
      if (!widget.isDestroyed()) {
        (0, _domAlter.moveElement)(button, {
          to: body
        });
      }
    });
    mainWidget = widget;
    return widget;
  }
  constructor(element, config) {
    var _ScrollToTop$get;
    const destroyPromise = (_ScrollToTop$get = ScrollToTop.get(element)) === null || _ScrollToTop$get === void 0 ? void 0 : _ScrollToTop$get.destroy();
    super(element, {
      id: DUMMY_ID
    });
    const offset = (config === null || config === void 0 ? void 0 : config.offset) || `${MC.S_TOP}: var(${MH.prefixCssVar("scroll-to-top--offset")}, 200vh)`;
    const position = (config === null || config === void 0 ? void 0 : config.position) || MC.S_RIGHT;
    const scrollable = config === null || config === void 0 ? void 0 : config.scrollable;
    const hasCustomScrollable = scrollable && scrollable !== MH.getDocElement() && scrollable !== MH.getBody();
    const scrollWatcher = _scrollWatcher.ScrollWatcher.reuse();
    const viewWatcher = _viewWatcher.ViewWatcher.reuse(hasCustomScrollable ? {
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
      (0, _cssAlter.showElement)(root);
    };
    const hideIt = () => {
      (0, _cssAlter.hideElement)(root);
    };

    // SETUP ------------------------------

    (destroyPromise || MH.promiseResolve()).then(async () => {
      const flexDirection = scrollable ? await (0, _cssAlter.getParentFlexDirection)(scrollable) : null;
      await (0, _domOptimize.waitForMutateTime)();
      if (this.isDestroyed()) {
        return;
      }
      if (hasCustomScrollable) {
        // Add a placeholder to restore its position on destroy.
        placeholder = MH.createElement("div");
        (0, _domAlter.moveElementNow)(placeholder, {
          to: element,
          position: "before",
          ignoreMove: true
        });

        // Then move it to immediately after the scrollable.
        // If the parent is a horizontal flexbox and position is left, then
        // we need to insert it before the scrollable.
        const shouldInsertBefore = flexDirection === "column-reverse" || position === MC.S_LEFT && flexDirection === "row" || position === MC.S_RIGHT && flexDirection === "row-reverse";
        (0, _domAlter.moveElementNow)(element, {
          to: scrollable,
          position: shouldInsertBefore ? "before" : "after",
          ignoreMove: true
        });

        // Wrap the button.
        root = (0, _domAlter.wrapElementNow)(element, {
          wrapper: "div",
          ignoreMove: true
        });
      }
      (0, _cssAlter.disableInitialTransition)(root);
      (0, _cssAlter.addClassesNow)(root, PREFIX_ROOT);
      (0, _cssAlter.addClassesNow)(element, PREFIX_BTN);
      (0, _cssAlter.setBooleanDataNow)(root, PREFIX_FIXED, !hasCustomScrollable);
      (0, _cssAlter.setDataNow)(root, MC.PREFIX_PLACE, position);
      arrow = (0, _domAlter.insertArrow)(element, MC.S_UP);
      hideIt(); // initial

      (0, _event.addEventListenerTo)(element, MC.S_CLICK, clickListener);
      viewWatcher.onView(offset, showIt, {
        views: [MC.S_AT, MC.S_BELOW]
      });
      viewWatcher.onView(offset, hideIt, {
        views: [MC.S_ABOVE]
      });
      this.onDisable(() => {
        (0, _cssAlter.undisplayElement)(root);
      });
      this.onEnable(() => {
        (0, _cssAlter.displayElement)(root);
      });
      this.onDestroy(async () => {
        await (0, _domOptimize.waitForMutateTime)();
        (0, _event.removeEventListenerFrom)(element, MC.S_CLICK, clickListener);
        (0, _cssAlter.removeClassesNow)(root, PREFIX_ROOT);
        (0, _cssAlter.removeClassesNow)(element, PREFIX_BTN);
        (0, _cssAlter.delDataNow)(root, PREFIX_FIXED);
        (0, _cssAlter.delDataNow)(root, MC.PREFIX_PLACE);
        (0, _cssAlter.displayElementNow)(root); // revert undisplay by onDisable

        if (arrow) {
          (0, _domAlter.moveElementNow)(arrow); // remove
        }
        if (root !== element) {
          // Unwrap the button.
          (0, _domAlter.replaceElementNow)(root, element, {
            ignoreMove: true
          });
        }
        if (placeholder) {
          // Move it back into its original position.
          (0, _domAlter.replaceElementNow)(placeholder, element, {
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
exports.ScrollToTop = ScrollToTop;
// --------------------

const WIDGET_NAME = "scroll-to-top";
const PREFIXED_NAME = MH.prefixName(WIDGET_NAME);
// Only one ScrollToTop widget per element is allowed, but Widget requires a
// non-blank ID.
const DUMMY_ID = PREFIXED_NAME;
const PREFIX_ROOT = `${PREFIXED_NAME}__root`;
const PREFIX_BTN = `${PREFIXED_NAME}__btn`;
const PREFIX_FIXED = MH.prefixName("fixed");
let mainWidget = null;
const newConfigValidator = element => {
  return {
    offset: (key, value) => (0, _validation.validateString)(key, value, _views.isValidScrollOffset),
    position: (key, value) => (0, _validation.validateString)(key, value, v => v === MC.S_LEFT || v === MC.S_RIGHT),
    scrollable: (key, value) => {
      var _ref;
      return (_ref = MH.isLiteralString(value) ? (0, _domSearch.waitForReferenceElement)(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    }
  };
};
//# sourceMappingURL=scroll-to-top.cjs.map