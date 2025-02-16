/**
 * @module Widgets
 */

import * as MH from "@lisn/globals/minification-helpers";

import { SizeWatcher } from "@lisn/watchers/size-watcher";

import { Widget, registerWidget } from "@lisn/widgets/widget";

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
export class TrackSize extends Widget {
  static get(element: Element): TrackSize | null {
    const instance = super.get(element, DUMMY_ID);
    if (MH.isInstanceOf(instance, TrackSize)) {
      return instance;
    }
    return null;
  }

  static register() {
    registerWidget(WIDGET_NAME, (element) => {
      if (!TrackSize.get(element)) {
        return new TrackSize(element);
      }
      return null;
    });
  }

  constructor(element: Element) {
    super(element, { id: DUMMY_ID });

    SizeWatcher.reuse().trackSize(null, {
      target: element,
      threshold: 0,
    });

    this.onDestroy(() => SizeWatcher.reuse().noTrackSize(null, element));
  }
}

// --------------------

const WIDGET_NAME = "track-size";
// Only one TrackSize widget per element is allowed, but Widget requires a
// non-blank ID.
const DUMMY_ID = WIDGET_NAME;
