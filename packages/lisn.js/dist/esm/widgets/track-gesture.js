/**
 * @module Widgets
 */

import * as MH from "../globals/minification-helpers.js";
import { validateBoolean, validateNumber } from "../utils/validation.js";
import { GestureWatcher } from "../watchers/gesture-watcher.js";
import { Widget, registerWidget } from "./widget.js";

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
export class TrackGesture extends Widget {
  static get(element) {
    const instance = super.get(element, DUMMY_ID);
    if (MH.isInstanceOf(instance, TrackGesture)) {
      return instance;
    }
    return null;
  }
  static register() {
    registerWidget(WIDGET_NAME, (element, config) => {
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

const WIDGET_NAME = "track-gesture";
// Only one TrackGesture widget per element is allowed, but Widget requires a
// non-blank ID.
const DUMMY_ID = WIDGET_NAME;
const configValidator = {
  preventDefault: validateBoolean,
  minDeltaX: validateNumber,
  maxDeltaX: validateNumber,
  minDeltaY: validateNumber,
  maxDeltaY: validateNumber,
  minDeltaZ: validateNumber,
  maxDeltaZ: validateNumber
};
//# sourceMappingURL=track-gesture.js.map