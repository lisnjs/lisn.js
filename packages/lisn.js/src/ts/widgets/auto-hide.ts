/**
 * @module Widgets
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { hideElement } from "@lisn/utils/css-alter";
import { hideAndRemoveElement } from "@lisn/utils/dom-alter";
import { waitForPageReady } from "@lisn/utils/dom-events";
import { validateString, validateNumber } from "@lisn/utils/validation";

import { DOMWatcher, OnMutationOptions } from "@lisn/watchers/dom-watcher";

import {
  Widget,
  WidgetConfigValidatorObject,
  registerWidget,
} from "@lisn/widgets/widget";

/**
 * Configures the given element as an {@link AutoHide} widget.
 *
 * The AutoHide widget automatically hides (and optionally removes) the given
 * element, or children of it that match a given selector, after a certain
 * delay.
 *
 * It executes these actions every time the matching element(s) have a change
 * of attribute or appear (are inserted) into the DOM.
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-auto-hide` class or `data-lisn-auto-hide` attribute
 * - `lisn-auto-remove` class or `data-lisn-auto-remove` attribute (enables
 *   {@link AutoHideConfig.remove})
 *
 * **NOTE:** This widget supports multiple instances per element, you can
 * specify multiple widget configurations, separated with ";".
 *
 * See below examples for what values you can use set for the data attributes
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This will automatically hide (with class `lisn-hide`) the element 3 seconds
 * (default delay) after it is inserted into the DOM or after it gets any
 * attributes changed on it (for example that might show it again).
 *
 * ```html
 * <div class="lisn-auto-hide">
 *   Automatically hidden in 3s.
 * </div>
 * ```
 *
 * @example
 * This will automatically hide and then remove the element 3 seconds (default
 * delay) after it is inserted into the DOM.
 *
 * ```html
 * <div class="lisn-auto-remove">
 *   Automatically hidden and removed in 3s.
 * </div>
 * ```
 *
 * @example
 * This will automatically
 * - hide `p` elements with class `message` 2 seconds after they are inserted
 *   or changed
 * - hide `p` elements with class `warning` 5 seconds after they are inserted
 *   or changed; and it will save that particular {@link AutoHide} widget with
 *   ID `myID` so that it can be looked up using {@link AutoHide.get}
 * - remove `p` elements with class `disposable` 3 seconds (default delay)
 *   after they are inserted or changed
 *
 * ```html
 * <div data-lisn-auto-hide="selector=p.message delay=2000 ;
 *                           selector=p.warning delay=5000 id=myID"
 *      data-lisn-auto-remove="selector=p.disposable">
 *   <p>Some text, this will stay.</p>
 *   <p class="message">
 *     Automatically hidden in 2s.
 *   </p>
 *   <p class="warning">
 *     Automatically hidden in 5s.
 *   </p>
 *   <p class="disposable">
 *     Automatically hidden and removed in 3s.
 *   </p>
 * </div>
 * ```
 */
export class AutoHide extends Widget {
  static get(element: Element, id: string): AutoHide | null {
    const instance = super.get(element, id);
    if (MH.isInstanceOf(instance, AutoHide)) {
      return instance;
    }
    return null;
  }

  static register() {
    for (const [name, remove] of [
      [WIDGET_NAME_HIDE, false],
      [WIDGET_NAME_REMOVE, true],
    ] as const) {
      registerWidget(
        name,
        (element, config) => {
          return new AutoHide(element, config);
        },
        newConfigValidator(remove),
        { supportsMultiple: true },
      );
    }
  }

  constructor(element: Element, config?: AutoHideConfig) {
    super(element, config);

    const selector = config?.selector;

    const watcher = DOMWatcher.create({
      root: element,
      subtree: selector ? true : false,
    });

    // Watch for attribute change on this element, and for relevant children
    // being added/changed
    const watcherOptions: OnMutationOptions = selector
      ? {
          selector: selector,
          categories: [MC.S_ADDED, MC.S_ATTRIBUTE],
          [MC.S_SKIP_INITIAL]: true,
        }
      : {
          categories: [MC.S_ATTRIBUTE],
          [MC.S_SKIP_INITIAL]: true,
        };

    const hideOrRemoveEl = config?.remove ? hideAndRemoveElement : hideElement;

    const hideRelevant = () => {
      if (this.isDisabled()) {
        return;
      }

      const targetElements = selector
        ? MH.querySelectorAll(element, selector)
        : [element];

      for (const elem of targetElements) {
        hideOrRemoveEl(elem, config?.delay ?? DEFAULT_DELAY);
      }
    };

    const addWatcher = () => watcher.onMutation(hideRelevant, watcherOptions);

    const removeWatcher = () => watcher.offMutation(hideRelevant);

    // ------------------------------

    // Don't hide/remove before the page is loaded
    waitForPageReady().then(() => {
      // Hide initially
      if (this.isDestroyed()) {
        return;
      }

      hideRelevant();
      addWatcher();
    });

    this.onDisable(removeWatcher);
    this.onEnable(() => {
      hideRelevant();
      addWatcher();
    });
  }
}

/**
 * @interface
 */
export type AutoHideConfig = {
  /**
   * An ID for the widget so that it can be looked up by element and ID using
   * {@link AutoHide.get}. It has to be unique for each element, but you can
   * use the same ID on different elements.
   *
   * @defaultValue undefined
   */
  id?: string;

  /**
   * If true, the matched elements are removed from the DOM instead of just
   * hidden.
   *
   * @defaultValue false
   */
  remove?: boolean;

  /**
   * If given, then the elements to be hidden/removed are selected using the
   * given `selector` starting at the container element. If not given, then
   * the container element itself is the target to be hidden/removed.
   *
   * E.g. if `selector` is `p.message`, then any newly added/changed `<p>`
   * elements with class `message` nested under the container element will be
   * auto-hidden/removed.
   *
   * @defaultValue undefined
   */
  selector?: string;

  /**
   * How long to wait before hiding or removing the matched elements.
   *
   * @defaultValue 3000
   */
  delay?: number;
};

// ------------------------------

const WIDGET_NAME_HIDE = "auto-hide";
const WIDGET_NAME_REMOVE = "auto-remove";

const DEFAULT_DELAY = 3000;

// For HTML API only
const newConfigValidator = (
  autoRemove: boolean,
): WidgetConfigValidatorObject<AutoHideConfig> => {
  return {
    id: validateString,
    remove: () => autoRemove,
    selector: validateString,
    delay: validateNumber,
  };
};
