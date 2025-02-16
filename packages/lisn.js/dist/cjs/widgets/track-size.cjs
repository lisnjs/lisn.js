"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrackSize = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _sizeWatcher = require("../watchers/size-watcher.cjs");
var _widget = require("./widget.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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
 */
class TrackSize extends _widget.Widget {
  static get(element) {
    const instance = super.get(element, DUMMY_ID);
    if (MH.isInstanceOf(instance, TrackSize)) {
      return instance;
    }
    return null;
  }
  static register() {
    (0, _widget.registerWidget)(WIDGET_NAME, element => {
      if (!TrackSize.get(element)) {
        return new TrackSize(element);
      }
      return null;
    });
  }
  constructor(element) {
    super(element, {
      id: DUMMY_ID
    });
    _sizeWatcher.SizeWatcher.reuse().trackSize(null, {
      target: element,
      threshold: 0
    });
    this.onDestroy(() => _sizeWatcher.SizeWatcher.reuse().noTrackSize(null, element));
  }
}

// --------------------
exports.TrackSize = TrackSize;
const WIDGET_NAME = "track-size";
// Only one TrackSize widget per element is allowed, but Widget requires a
// non-blank ID.
const DUMMY_ID = WIDGET_NAME;
//# sourceMappingURL=track-size.cjs.map