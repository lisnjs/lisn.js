"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrackView = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _domSearch = require("../utils/dom-search.cjs");
var _validation = require("../utils/validation.cjs");
var _viewWatcher = require("../watchers/view-watcher.cjs");
var _widget = require("./widget.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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
 *                            | threshold=0,0.5"
 * ></div>
 * ```
 */
class TrackView extends _widget.Widget {
  static get(element) {
    const instance = super.get(element, DUMMY_ID);
    if (MH.isInstanceOf(instance, TrackView)) {
      return instance;
    }
    return null;
  }
  static register() {
    (0, _widget.registerWidget)(WIDGET_NAME, (element, config) => {
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
    const watcher = _viewWatcher.ViewWatcher.reuse({
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
exports.TrackView = TrackView;
// --------------------

const WIDGET_NAME = "track-view";
// Only one TrackView widget per element is allowed, but Widget requires a
// non-blank ID.
const DUMMY_ID = WIDGET_NAME;
const newConfigValidator = element => {
  return {
    root: (key, value) => {
      var _ref;
      return (_ref = MH.isLiteralString(value) ? (0, _domSearch.waitForReferenceElement)(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    },
    rootMargin: _validation.validateString,
    threshold: (key, value) => (0, _validation.validateNumList)(key, value),
    debounceWindow: _validation.validateNumber,
    resizeThreshold: _validation.validateNumber,
    scrollThreshold: _validation.validateNumber
  };
};
//# sourceMappingURL=track-view.cjs.map