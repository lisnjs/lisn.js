/**
 * @module Widgets
 */

import * as MH from "../globals/minification-helpers.js";
import { waitForReferenceElement } from "../utils/dom-search.js";
import { validateNumber, validateString, validateNumList } from "../utils/validation.js";
import { ViewWatcher } from "../watchers/view-watcher.js";
import { Widget, registerWidget } from "./widget.js";

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
export class TrackView extends Widget {
  static get(element) {
    const instance = super.get(element, DUMMY_ID);
    if (MH.isInstanceOf(instance, TrackView)) {
      return instance;
    }
    return null;
  }
  static register() {
    registerWidget(WIDGET_NAME, (element, config) => {
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
    const watcher = ViewWatcher.reuse({
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

// --------------------

const WIDGET_NAME = "track-view";
// Only one TrackView widget per element is allowed, but Widget requires a
// non-blank ID.
const DUMMY_ID = WIDGET_NAME;
const newConfigValidator = element => {
  return {
    root: (key, value) => {
      var _ref;
      return (_ref = MH.isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    },
    rootMargin: validateString,
    threshold: (key, value) => validateNumList(key, value),
    debounceWindow: validateNumber,
    resizeThreshold: validateNumber,
    scrollThreshold: validateNumber
  };
};
//# sourceMappingURL=track-view.js.map