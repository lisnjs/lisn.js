"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AutoHide = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _cssAlter = require("../utils/css-alter.cjs");
var _domAlter = require("../utils/dom-alter.cjs");
var _domEvents = require("../utils/dom-events.cjs");
var _validation = require("../utils/validation.cjs");
var _domWatcher = require("../watchers/dom-watcher.cjs");
var _widget = require("./widget.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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
class AutoHide extends _widget.Widget {
  static get(element, id) {
    const instance = super.get(element, id);
    if (MH.isInstanceOf(instance, AutoHide)) {
      return instance;
    }
    return null;
  }
  static register() {
    for (const [name, remove] of [[WIDGET_NAME_HIDE, false], [WIDGET_NAME_REMOVE, true]]) {
      (0, _widget.registerWidget)(name, (element, config) => {
        return new AutoHide(element, config);
      }, newConfigValidator(remove), {
        supportsMultiple: true
      });
    }
  }
  constructor(element, config) {
    super(element, config);
    const selector = config === null || config === void 0 ? void 0 : config.selector;
    const watcher = _domWatcher.DOMWatcher.create({
      root: element,
      subtree: selector ? true : false
    });

    // Watch for attribute change on this element, and for relevant children
    // being added/changed
    const watcherOptions = selector ? {
      selector: selector,
      categories: [MC.S_ADDED, MC.S_ATTRIBUTE],
      [MC.S_SKIP_INITIAL]: true
    } : {
      categories: [MC.S_ATTRIBUTE],
      [MC.S_SKIP_INITIAL]: true
    };
    const hideOrRemoveEl = config !== null && config !== void 0 && config.remove ? _domAlter.hideAndRemoveElement : _cssAlter.hideElement;
    const hideRelevant = () => {
      if (this.isDisabled()) {
        return;
      }
      const targetElements = selector ? MH.querySelectorAll(element, selector) : [element];
      for (const elem of targetElements) {
        var _config$delay;
        hideOrRemoveEl(elem, (_config$delay = config === null || config === void 0 ? void 0 : config.delay) !== null && _config$delay !== void 0 ? _config$delay : DEFAULT_DELAY);
      }
    };
    const addWatcher = () => watcher.onMutation(hideRelevant, watcherOptions);
    const removeWatcher = () => watcher.offMutation(hideRelevant);

    // ------------------------------

    // Don't hide/remove before the page is loaded
    (0, _domEvents.waitForPageReady)().then(() => {
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
exports.AutoHide = AutoHide;
// ------------------------------

const WIDGET_NAME_HIDE = "auto-hide";
const WIDGET_NAME_REMOVE = "auto-remove";
const DEFAULT_DELAY = 3000;
const newConfigValidator = autoRemove => {
  return {
    id: _validation.validateString,
    remove: () => autoRemove,
    selector: _validation.validateString,
    delay: _validation.validateNumber
  };
};
//# sourceMappingURL=auto-hide.cjs.map