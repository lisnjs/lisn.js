/**
 * @module Widgets
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { showElement, hideElement, displayElement, undisplayElement, disableInitialTransition, addClasses, removeClasses, setData, delData } from "../utils/css-alter.js";
import { moveElement, insertArrow } from "../utils/dom-alter.js";
import { waitForElement } from "../utils/dom-events.js";
import { addEventListenerTo, removeEventListenerFrom } from "../utils/event.js";
import { validateString } from "../utils/validation.js";
import { isValidScrollOffset } from "../utils/views.js";
import { ScrollWatcher } from "../watchers/scroll-watcher.js";
import { ViewWatcher } from "../watchers/view-watcher.js";
import { Widget, registerWidget } from "./widget.js";

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
 * **NOTE:** Currently the widget only supports fixed positioned button that
 * scrolls the main scrolling element (see
 * {@link Settings.settings.mainScrollableElementSelector | settings.mainScrollableElementSelector}).
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
 * This will create a scroll-to-top button for the main scrolling element
 * using an existing element for the button with default
 * {@link ScrollToTopConfig}.
 *
 * ```html
 * <div class="lisn-scroll-to-top"></div>
 * ```
 *
 * @example
 * As above but with custom settings.
 *
 * ```html
 * <div data-lisn-scroll-to-top="position=left | offset=top:300vh"></div>
 * ```
 */
export class ScrollToTop extends Widget {
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
    registerWidget(WIDGET_NAME, (element, config) => {
      if (!ScrollToTop.get(element)) {
        return new ScrollToTop(element, config);
      }
      return null;
    }, configValidator);
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
      return moveElement(button);
    });
    waitForElement(MH.getBody).then(body => {
      if (!widget.isDestroyed()) {
        moveElement(button, {
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
    const scrollWatcher = ScrollWatcher.reuse();
    const viewWatcher = ViewWatcher.reuse();
    const offset = (config === null || config === void 0 ? void 0 : config.offset) || `${MC.S_TOP}: var(${MH.prefixCssVar("scroll-to-top--offset")}, 200vh)`;
    const position = (config === null || config === void 0 ? void 0 : config.position) || MC.S_RIGHT;
    const clickListener = () => scrollWatcher.scrollTo({
      top: 0
    });
    const arrow = insertArrow(element, MC.S_UP);
    const showIt = () => {
      showElement(element);
    };
    const hideIt = () => {
      hideElement(element);
    };

    // SETUP ------------------------------

    (destroyPromise || MH.promiseResolve()).then(() => {
      if (this.isDestroyed()) {
        return;
      }
      disableInitialTransition(element);
      addClasses(element, PREFIX_ROOT);
      setData(element, MC.PREFIX_PLACE, position);
      hideIt(); // initial

      addEventListenerTo(element, MC.S_CLICK, clickListener);
      viewWatcher.onView(offset, showIt, {
        views: [MC.S_AT, MC.S_BELOW]
      });
      viewWatcher.onView(offset, hideIt, {
        views: [MC.S_ABOVE]
      });
      this.onDisable(() => {
        undisplayElement(element);
      });
      this.onEnable(() => {
        displayElement(element);
      });
      this.onDestroy(async () => {
        removeEventListenerFrom(element, MC.S_CLICK, clickListener);
        await delData(element, MC.PREFIX_PLACE);
        await moveElement(arrow); // remove
        await removeClasses(element, PREFIX_ROOT);
        await displayElement(element); // revert undisplay by onDisable
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

const WIDGET_NAME = "scroll-to-top";
const PREFIXED_NAME = MH.prefixName(WIDGET_NAME);
const PREFIX_ROOT = `${PREFIXED_NAME}__root`;
// Only one ScrollToTop widget per element is allowed, but Widget requires a
// non-blank ID.
// In fact, it doesn't make much sense to have more than 1 scroll-to-top button
// on the whole page, but we support it, hence use a class rather than a DOM ID.
const DUMMY_ID = PREFIXED_NAME;
let mainWidget = null;
const configValidator = {
  offset: (key, value) => validateString(key, value, isValidScrollOffset),
  position: (key, value) => validateString(key, value, v => v === MC.S_LEFT || v === MC.S_RIGHT)
};
//# sourceMappingURL=scroll-to-top.js.map