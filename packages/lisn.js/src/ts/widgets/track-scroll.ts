/**
 * @module Widgets
 */

import * as MH from "@lisn/globals/minification-helpers";

import { validateNumber } from "@lisn/utils/validation";

import { ScrollWatcher } from "@lisn/watchers/scroll-watcher";

import {
  Widget,
  WidgetConfigValidatorObject,
  registerWidget,
} from "@lisn/widgets/widget";

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
export class TrackScroll extends Widget {
  static get(element: Element): TrackScroll | null {
    const instance = super.get(element, DUMMY_ID);
    if (MH.isInstanceOf(instance, TrackScroll)) {
      return instance;
    }
    return null;
  }

  static register() {
    registerWidget(
      WIDGET_NAME,
      (element, config) => {
        if (!TrackScroll.get(element)) {
          return new TrackScroll(element, config);
        }
        return null;
      },
      configValidator,
    );
  }

  constructor(element: Element, config?: TrackScrollConfig) {
    super(element, { id: DUMMY_ID });

    ScrollWatcher.reuse().trackScroll(
      null,
      MH.assign(
        {
          scrollable: element,
        },
        config,
      ),
    );

    this.onDestroy(() => ScrollWatcher.reuse().noTrackScroll(null, element));
  }
}

/**
 * @interface
 */
export type TrackScrollConfig = {
  /**
   * Corresponds to
   * {@link Watchers/ScrollWatcher.OnScrollOptions.threshold | OnScrollOptions.threshold}.
   *
   * @defaultValue undefined // ScrollWatcher default
   */
  threshold?: number;

  /**
   * Corresponds to
   * {@link Watchers/ScrollWatcher.OnScrollOptions.debounceWindow | OnScrollOptions.debounceWindow}.
   *
   * @defaultValue undefined // ScrollWatcher default
   */
  debounceWindow?: number;
};

// --------------------

const WIDGET_NAME = "track-scroll";
// Only one TrackScroll widget per element is allowed, but Widget requires a
// non-blank ID.
const DUMMY_ID = WIDGET_NAME;

const configValidator: WidgetConfigValidatorObject<TrackScrollConfig> = {
  threshold: validateNumber,
  debounceWindow: validateNumber,
};
