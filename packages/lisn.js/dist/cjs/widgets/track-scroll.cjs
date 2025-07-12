"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrackScroll = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _validation = require("../utils/validation.cjs");
var _scrollWatcher = require("../watchers/scroll-watcher.cjs");
var _widget = require("./widget.cjs");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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
class TrackScroll extends _widget.Widget {
  static get(element) {
    const instance = super.get(element, DUMMY_ID);
    if (MH.isInstanceOf(instance, TrackScroll)) {
      return instance;
    }
    return null;
  }
  static register() {
    (0, _widget.registerWidget)(WIDGET_NAME, (element, config) => {
      if (!TrackScroll.get(element)) {
        return new TrackScroll(element, config);
      }
      return null;
    }, configValidator);
  }
  constructor(element, config) {
    super(element, {
      id: DUMMY_ID
    });
    _scrollWatcher.ScrollWatcher.reuse().trackScroll(null, MH.assign({
      scrollable: element
    }, config));
    this.onDestroy(() => _scrollWatcher.ScrollWatcher.reuse().noTrackScroll(null, element));
  }
}

/**
 * @interface
 */
exports.TrackScroll = TrackScroll;
// --------------------

const WIDGET_NAME = "track-scroll";
// Only one TrackScroll widget per element is allowed, but Widget requires a
// non-blank ID.
const DUMMY_ID = WIDGET_NAME;
const configValidator = {
  threshold: _validation.validateNumber,
  debounceWindow: _validation.validateNumber
};
//# sourceMappingURL=track-scroll.cjs.map