/**
 * @module Widgets
 */

import * as MH from "@lisn/globals/minification-helpers";

import { validateNumber } from "@lisn/utils/validation";

import { SizeWatcher } from "@lisn/watchers/size-watcher";

import {
  Widget,
  WidgetConfigValidatorObject,
  registerWidget,
} from "@lisn/widgets/widget";

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
 *
 * @example
 * As above but with custom options
 *
 * ```html
 * <div data-lisn-track-size="threshold=0 | debounce-window=0"></div>
 * ```
 */
export class TrackSize extends Widget {
  static get(element: Element): TrackSize | null {
    const instance = super.get(element, DUMMY_ID);
    if (MH.isInstanceOf(instance, TrackSize)) {
      return instance;
    }
    return null;
  }

  static register() {
    registerWidget(
      WIDGET_NAME,
      (element, config) => {
        if (!TrackSize.get(element)) {
          return new TrackSize(element, config);
        }
        return null;
      },
      configValidator,
    );
  }

  constructor(element: Element, config?: TrackSizeConfig) {
    super(element, { id: DUMMY_ID });

    SizeWatcher.reuse().trackSize(
      null,
      MH.assign(
        {
          target: element,
        },
        config,
      ),
    );

    this.onDestroy(() => SizeWatcher.reuse().noTrackSize(null, element));
  }
}

/**
 * @interface
 *
 * @since v1.2.0
 */
export type TrackSizeConfig = {
  /**
   * Corresponds to
   * {@link Watchers/SizeWatcher.OnResizeOptions.threshold | OnResizeOptions.threshold}.
   *
   * @defaultValue undefined // SizeWatcher default
   */
  threshold?: number;

  /**
   * Corresponds to
   * {@link Watchers/SizeWatcher.OnResizeOptions.debounceWindow | OnResizeOptions.debounceWindow}.
   *
   * @defaultValue undefined // SizeWatcher default
   */
  debounceWindow?: number;
};

// --------------------

const WIDGET_NAME = "track-size";
// Only one TrackSize widget per element is allowed, but Widget requires a
// non-blank ID.
const DUMMY_ID = WIDGET_NAME;

const configValidator: WidgetConfigValidatorObject<TrackSizeConfig> = {
  threshold: validateNumber,
  debounceWindow: validateNumber,
};
