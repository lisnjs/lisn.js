"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageLoader = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _cssAlter = require("../utils/css-alter.cjs");
var _domAlter = require("../utils/dom-alter.cjs");
var _domEvents = require("../utils/dom-events.cjs");
var _validation = require("../utils/validation.cjs");
var _widget = require("./widget.cjs");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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
class PageLoader extends _widget.Widget {
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
    (0, _widget.registerWidget)(WIDGET_NAME, (element, config) => {
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
      return (0, _domAlter.moveElement)(loader);
    });
    (0, _domEvents.waitForElement)(MH.getBody).then(body => {
      if (!widget.isDestroyed()) {
        (0, _domAlter.moveElement)(loader, {
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
      (0, _cssAlter.addClasses)(element, PREFIX_ROOT);
      const spinner = MH.createElement("div");
      (0, _cssAlter.addClasses)(spinner, PREFIX_SPINNER);
      (0, _domAlter.moveElement)(spinner, {
        to: element
      });
      (0, _domEvents.waitForElement)(MH.getBody).then(_cssAlter.setHasModal); // we could be init before body

      if ((_config$autoRemove = config === null || config === void 0 ? void 0 : config.autoRemove) !== null && _config$autoRemove !== void 0 ? _config$autoRemove : true) {
        (0, _domEvents.waitForPageReady)().then(() => (0, _domAlter.hideAndRemoveElement)(element)).then(this.destroy);
      }
      this.onDisable(() => {
        (0, _cssAlter.undisplayElement)(element);
        if (!MH.docQuerySelector(`.${PREFIX_ROOT}`)) {
          (0, _cssAlter.delHasModal)();
        }
      });
      this.onEnable(async () => {
        await (0, _cssAlter.displayElement)(element);
      });
      this.onDestroy(async () => {
        (0, _domAlter.moveElement)(spinner); // remove
        await (0, _cssAlter.removeClasses)(element, PREFIX_ROOT);
        await (0, _cssAlter.displayElement)(element); // revert undisplay by onDisable
      });
    });
  }
}

/**
 * @interface
 */
exports.PageLoader = PageLoader;
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
  autoRemove: _validation.validateBoolean
};
//# sourceMappingURL=page-loader.cjs.map