/**
 * @module Widgets
 */

import * as MH from "../globals/minification-helpers.js";
import { displayElement, undisplayElement, addClasses, removeClasses, setHasModal, delHasModal } from "../utils/css-alter.js";
import { moveElement, hideAndRemoveElement } from "../utils/dom-alter.js";
import { waitForElement, waitForPageReady } from "../utils/dom-events.js";
import { validateBoolean } from "../utils/validation.js";
import { Widget, registerWidget } from "./widget.js";

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
export class PageLoader extends Widget {
  /**
   * If element is omitted, returns the instance created by {@link enableMain}
   * if any.
   */
  static get(element) {
    if (!element) {
      return mainWidget;
    }
    const instance = super.get(element, DUMMY_ID);
    if (MH.isInstanceOf(instance, PageLoader)) {
      return instance;
    }
    return null;
  }
  static register() {
    registerWidget(WIDGET_NAME, (element, config) => {
      if (!PageLoader.get(element)) {
        return new PageLoader(element, config);
      }
      return null;
    }, configValidator);
  }

  /**
   * Creates a new element, inserts it into the document body and configures it
   * as a {@link PageLoader}.
   */
  static enableMain(config) {
    const loader = MH.createElement("div");
    const widget = new PageLoader(loader, config);
    widget.onDestroy(() => {
      if (mainWidget === widget) {
        mainWidget = null;
      }
      return moveElement(loader);
    });
    waitForElement(MH.getBody).then(body => {
      if (!widget.isDestroyed()) {
        moveElement(loader, {
          to: body
        });
      }
    });
    mainWidget = widget;
    return widget;
  }
  constructor(element, config) {
    var _PageLoader$get;
    const destroyPromise = (_PageLoader$get = PageLoader.get(element)) === null || _PageLoader$get === void 0 ? void 0 : _PageLoader$get.destroy();
    super(element, {
      id: DUMMY_ID
    });
    (destroyPromise || MH.promiseResolve()).then(() => {
      var _config$autoRemove;
      if (this.isDestroyed()) {
        return;
      }
      addClasses(element, PREFIX_ROOT);
      const spinner = MH.createElement("div");
      addClasses(spinner, PREFIX_SPINNER);
      moveElement(spinner, {
        to: element
      });
      waitForElement(MH.getBody).then(setHasModal); // we could be init before body

      if ((_config$autoRemove = config === null || config === void 0 ? void 0 : config.autoRemove) !== null && _config$autoRemove !== void 0 ? _config$autoRemove : true) {
        waitForPageReady().then(() => hideAndRemoveElement(element)).then(this.destroy);
      }
      this.onDisable(() => {
        undisplayElement(element);
        if (!MH.docQuerySelector(`.${PREFIX_ROOT}`)) {
          delHasModal();
        }
      });
      this.onEnable(async () => {
        await displayElement(element);
      });
      this.onDestroy(async () => {
        moveElement(spinner); // remove
        await removeClasses(element, PREFIX_ROOT);
        await displayElement(element); // revert undisplay by onDisable
      });
    });
  }
}

/**
 * @interface
 */

// --------------------

const WIDGET_NAME = "page-loader";
const PREFIXED_NAME = MH.prefixName(WIDGET_NAME);
const PREFIX_ROOT = `${PREFIXED_NAME}__root`;
const PREFIX_SPINNER = MH.prefixName("spinner");
// Only one PageLoader widget per element is allowed, but Widget requires a
// non-blank ID.
// In fact, it doesn't make much sense to have more than 1 page loader on the
// whole page, but we support it, hence use a class rather than a DOM ID.
const DUMMY_ID = PREFIXED_NAME;
let mainWidget = null;
const configValidator = {
  autoRemove: validateBoolean
};
//# sourceMappingURL=page-loader.js.map