/**
 * @module Widgets
 */

import * as MH from "@lisn/globals/minification-helpers";

import { validateBoolean, validateNumber } from "@lisn/utils/validation";

import { GestureWatcher } from "@lisn/watchers/gesture-watcher";

import {
  Widget,
  WidgetConfigValidatorObject,
  registerWidget,
} from "@lisn/widgets/widget";

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
  static get(element: Element): TrackGesture | null {
    const instance = super.get(element, DUMMY_ID);
    if (MH.isInstanceOf(instance, TrackGesture)) {
      return instance;
    }
    return null;
  }

  static register() {
    registerWidget(
      WIDGET_NAME,
      (element, config) => {
        if (!TrackGesture.get(element)) {
          return new TrackGesture(element, config);
        }
        return null;
      },
      configValidator,
    );
  }

  constructor(element: Element, config?: TrackGestureConfig) {
    super(element, { id: DUMMY_ID });

    GestureWatcher.reuse().trackGesture(element, null, {
      preventDefault: config?.preventDefault,
      minTotalDeltaX: config?.minDeltaX,
      maxTotalDeltaX: config?.maxDeltaX,
      minTotalDeltaY: config?.minDeltaY,
      maxTotalDeltaY: config?.maxDeltaY,
      minTotalDeltaZ: config?.minDeltaZ,
      maxTotalDeltaZ: config?.maxDeltaZ,
    });

    this.onDestroy(() => GestureWatcher.reuse().noTrackGesture(element));
  }
}

/**
 * @interface
 */
export type TrackGestureConfig = {
  /**
   * Corresponds to
   * {@link Watchers/GestureWatcher.OnGestureOptions.preventDefault | OnGestureOptions.preventDefault}.
   *
   * @defaultValue undefined // GestureWatcher default
   */
  preventDefault?: boolean;

  /**
   * Corresponds to
   * {@link Watchers/GestureWatcher.OnGestureOptions.minTotalDeltaX | OnGestureOptions.minTotalDeltaX}.
   *
   * @defaultValue undefined // GestureWatcher default
   */
  minDeltaX?: number;

  /**
   * Corresponds to
   * {@link Watchers/GestureWatcher.OnGestureOptions.maxTotalDeltaX | OnGestureOptions.maxTotalDeltaX}.
   *
   * @defaultValue undefined // GestureWatcher default
   */
  maxDeltaX?: number;

  /**
   * Corresponds to
   * {@link Watchers/GestureWatcher.OnGestureOptions.minTotalDeltaY | OnGestureOptions.minTotalDeltaY}.
   *
   * @defaultValue undefined // GestureWatcher default
   */
  minDeltaY?: number;

  /**
   * Corresponds to
   * {@link Watchers/GestureWatcher.OnGestureOptions.maxTotalDeltaY | OnGestureOptions.maxTotalDeltaY}.
   *
   * @defaultValue undefined // GestureWatcher default
   */
  maxDeltaY?: number;

  /**
   * Corresponds to
   * {@link Watchers/GestureWatcher.OnGestureOptions.minTotalDeltaZ | OnGestureOptions.minTotalDeltaZ}.
   *
   * @defaultValue undefined // GestureWatcher default
   */
  minDeltaZ?: number;

  /**
   * Corresponds to
   * {@link Watchers/GestureWatcher.OnGestureOptions.maxTotalDeltaZ | OnGestureOptions.maxTotalDeltaZ}.
   *
   * @defaultValue undefined // GestureWatcher default
   */
  maxDeltaZ?: number;
};

// --------------------

const WIDGET_NAME = "track-gesture";
// Only one TrackGesture widget per element is allowed, but Widget requires a
// non-blank ID.
const DUMMY_ID = WIDGET_NAME;

// For HTML API only
const configValidator: WidgetConfigValidatorObject<TrackGestureConfig> = {
  preventDefault: validateBoolean,
  minDeltaX: validateNumber,
  maxDeltaX: validateNumber,
  minDeltaY: validateNumber,
  maxDeltaY: validateNumber,
  minDeltaZ: validateNumber,
  maxDeltaZ: validateNumber,
};
