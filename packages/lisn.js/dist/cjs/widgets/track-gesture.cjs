"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrackGesture = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _validation = require("../utils/validation.cjs");
var _gestureWatcher = require("../watchers/gesture-watcher.cjs");
var _widget = require("./widget.cjs");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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
class TrackGesture extends _widget.Widget {
  static get(element) {
    const instance = super.get(element, DUMMY_ID);
    if (MH.isInstanceOf(instance, TrackGesture)) {
      return instance;
    }
    return null;
  }
  static register() {
    (0, _widget.registerWidget)(WIDGET_NAME, (element, config) => {
      if (!TrackGesture.get(element)) {
        return new TrackGesture(element, config);
      }
      return null;
    }, configValidator);
  }
  constructor(element, config) {
    super(element, {
      id: DUMMY_ID
    });
    _gestureWatcher.GestureWatcher.reuse().trackGesture(element, null, {
      preventDefault: config === null || config === void 0 ? void 0 : config.preventDefault,
      minTotalDeltaX: config === null || config === void 0 ? void 0 : config.minDeltaX,
      maxTotalDeltaX: config === null || config === void 0 ? void 0 : config.maxDeltaX,
      minTotalDeltaY: config === null || config === void 0 ? void 0 : config.minDeltaY,
      maxTotalDeltaY: config === null || config === void 0 ? void 0 : config.maxDeltaY,
      minTotalDeltaZ: config === null || config === void 0 ? void 0 : config.minDeltaZ,
      maxTotalDeltaZ: config === null || config === void 0 ? void 0 : config.maxDeltaZ
    });
    this.onDestroy(() => _gestureWatcher.GestureWatcher.reuse().noTrackGesture(element));
  }
}

/**
 * @interface
 */
exports.TrackGesture = TrackGesture;
// --------------------

const WIDGET_NAME = "track-gesture";
// Only one TrackGesture widget per element is allowed, but Widget requires a
// non-blank ID.
const DUMMY_ID = WIDGET_NAME;
const configValidator = {
  preventDefault: _validation.validateBoolean,
  minDeltaX: _validation.validateNumber,
  maxDeltaX: _validation.validateNumber,
  minDeltaY: _validation.validateNumber,
  maxDeltaY: _validation.validateNumber,
  minDeltaZ: _validation.validateNumber,
  maxDeltaZ: _validation.validateNumber
};
//# sourceMappingURL=track-gesture.cjs.map