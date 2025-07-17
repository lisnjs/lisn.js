/**
 * @module Widgets
 */

import * as MH from "@lisn/globals/minification-helpers";

import { waitForReferenceElement } from "@lisn/utils/dom-search";
import {
  validateNumber,
  validateString,
  validateNumList,
} from "@lisn/utils/validation";

import { ViewWatcher } from "@lisn/watchers/view-watcher";

import {
  Widget,
  WidgetConfigValidatorFunc,
  registerWidget,
} from "@lisn/widgets/widget";

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
 *                            | threshold=0,0.5
 *                            | debounce-window=0
 *                            | resize-threshold=0
 *                            | scroll-threshold=0"
 * ></div>
 * ```
 */
export class TrackView extends Widget {
  static get(element: Element): TrackView | null {
    const instance = super.get(element, DUMMY_ID);
    if (MH.isInstanceOf(instance, TrackView)) {
      return instance;
    }
    return null;
  }

  static register() {
    registerWidget(
      WIDGET_NAME,
      (element, config) => {
        if (!TrackView.get(element)) {
          return new TrackView(element, config);
        }
        return null;
      },
      newConfigValidator,
    );
  }

  constructor(element: Element, config?: TrackViewConfig) {
    super(element, { id: DUMMY_ID });

    const watcher = ViewWatcher.reuse({
      root: config?.root,
      rootMargin: config?.rootMargin?.replace(/,/g, " "),
      threshold: config?.threshold,
    });

    watcher.trackView(element, null, config);

    this.onDestroy(() => watcher.noTrackView(element));
  }
}

/**
 * @interface
 */
export type TrackViewConfig = {
  /**
   * Corresponds to
   * {@link Watchers/ViewWatcher.ViewWatcherConfig.root | ViewWatcherConfig.root}.
   *
   * @defaultValue undefined // ViewWatcher default
   */
  root?: Element | null;

  /**
   * Corresponds to
   * {@link Watchers/ViewWatcher.ViewWatcherConfig.rootMargin | ViewWatcherConfig.rootMargin}.
   *
   * @defaultValue undefined // ViewWatcher default
   */
  rootMargin?: string;

  /**
   * Corresponds to
   * {@link Watchers/ViewWatcher.ViewWatcherConfig.threshold | ViewWatcherConfig.threshold}.
   *
   * @defaultValue undefined // ViewWatcher default
   */
  threshold?: number | number[];

  /**
   * Corresponds to
   * {@link Watchers/ViewWatcher.TrackViewOptions.debounceWindow | TrackViewOptions.debounceWindow}.
   *
   * @defaultValue undefined // ViewWatcher default
   */
  debounceWindow?: number;

  /**
   * Corresponds to
   * {@link Watchers/ViewWatcher.TrackViewOptions.resizeThreshold | TrackViewOptions.resizeThreshold}.
   *
   * @defaultValue undefined // ViewWatcher default
   */
  resizeThreshold?: number;

  /**
   * Corresponds to
   * {@link Watchers/ViewWatcher.TrackViewOptions.scrollThreshold | TrackViewOptions.scrollThreshold}.
   *
   * @defaultValue undefined // ViewWatcher default
   */
  scrollThreshold?: number;
};

// --------------------

const WIDGET_NAME = "track-view";
// Only one TrackView widget per element is allowed, but Widget requires a
// non-blank ID.
const DUMMY_ID = WIDGET_NAME;

const newConfigValidator: WidgetConfigValidatorFunc<TrackViewConfig> = (
  element: Element,
) => {
  return {
    root: (key, value) =>
      (MH.isLiteralString(value)
        ? waitForReferenceElement(value, element)
        : null) ?? undefined,
    rootMargin: validateString,
    threshold: (key, value) => validateNumList(key, value),
    debounceWindow: validateNumber,
    resizeThreshold: validateNumber,
    scrollThreshold: validateNumber,
  };
};
