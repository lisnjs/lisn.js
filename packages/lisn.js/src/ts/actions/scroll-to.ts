/**
 * @module Actions
 *
 * @categoryDescription Scrolling
 * {@link ScrollTo} scrolls to the given element or to the previous scroll
 * position.
 */

import * as MH from "@lisn/globals/minification-helpers";
import * as MC from "@lisn/globals/minification-constants";

import { CoordinateOffset } from "@lisn/globals/types";

import { waitForReferenceElement } from "@lisn/utils/dom-search";
import { omitKeys } from "@lisn/utils/misc";
import { validateNumber } from "@lisn/utils/validation";

import { ScrollWatcher } from "@lisn/watchers/scroll-watcher";

import { Action, registerAction } from "@lisn/actions/action";

import { WidgetConfigValidatorFunc } from "@lisn/widgets/widget";

/**
 * Scrolls to the given element or to the previous scroll position.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "scroll-to".
 * - Accepted string arguments: none
 * - Accepted options:
 *   - `offsetX`: A number.
 *   - `offsetY`: A number.
 *   - `duration`: A number.
 *   - `scrollable`: A string element specification for an element (see
 *     {@link Utils.getReferenceElement | getReferenceElement}). Note that,
 *     unless it's a DOM ID, the specification is parsed relative to the
 *     element being acted on and not the element the trigger is defined on (in
 *     case you've used the `act-on` trigger option).
 *
 * **NOTE:** Do not place a + sign in front of the offset values (just omit it
 * if you want a positive offset). Otherwise it will be interpreted as a
 * trigger option.
 *
 * @example
 * When the user clicks the button, scroll the main scrolling element to
 * element's position:
 *
 * ```html
 * <button id="btn">Scroll to/back</button>
 * <div data-lisn-on-click="@scroll-to +target=#btn"></div>
 * ```
 *
 * @example
 * When the user clicks the button, scroll the main scrolling element to
 * element's position +10px down:
 *
 * ```html
 * <button id="btn">Scroll to/back</button>
 * <div data-lisn-on-click="@scroll-to: offsetY=10 +target=#btn"></div>
 * ```
 *
 * @example
 * When the user clicks the button, scroll the main scrolling element to
 * element's position 10px _down_ and 50px _left_, with a duration of 200ms:
 *
 * ```html
 * <button id="btn">Scroll to/back</button>
 * <div data-lisn-on-click="@scroll-to: offsetY=10, offsetX=-50, duration=200 +target=#btn"></div>
 * ```
 *
 * @example
 * When the user clicks the button, scroll the closest parent element with
 * class `scrollable` to the element's position:
 *
 * ```html
 * <button id="btn">Scroll to/back</button>
 * <div class="scrollable">
 *   <div data-lisn-on-click="@scroll-to: scrollable=this.scrollable +target=#btn"></div>
 * </div>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <button id="btn">Scroll to/back</button>
 * <div data-lisn-ref="scrollable">
 *   <div data-lisn-on-click="@scroll-to: scrollable=this-scrollable +target=#btn"></div>
 * </div>
 * ```
 *
 * @category Scrolling
 */
export class ScrollTo implements Action {
  /**
   * Scrolls the main scrolling element to the element's position.
   */
  readonly do: () => Promise<void>;

  /**
   * Scrolls the main scrolling element to the last scroll position before the
   * action was {@link do}ne. If the action had never been done, does nothing.
   */
  readonly undo: () => Promise<void>;

  /**
   * Scrolls the main scrolling element to the element's position, if it's not
   * already there, or otherwise scrolls the main scrolling element to the
   * previous saved scroll position.
   */
  readonly toggle: () => Promise<void>;

  static register() {
    registerAction(
      "scroll-to",
      (element, args, config) => {
        const offset = config
          ? {
              left: config.offsetX,
              top: config.offsetY,
            }
          : undefined;

        return new ScrollTo(element, {
          offset,
          duration: config?.duration,
          scrollable: config?.scrollable,
        });
      },
      newConfigValidator,
    );
  }

  constructor(element: Element, config?: ScrollToConfig) {
    const watcher = ScrollWatcher.reuse();
    const { scrollable } = config ?? {};
    let prevScrollTop = -1,
      prevScrollLeft = -1;

    this.do = async () => {
      const current = await watcher.fetchCurrentScroll(scrollable);
      prevScrollTop = current[MC.S_SCROLL_TOP];
      prevScrollLeft = current[MC.S_SCROLL_LEFT];

      const action = await watcher.scrollTo(element, config);
      await action?.waitFor();
    };

    this.undo = async () => {
      if (prevScrollTop !== -1) {
        const action = await watcher.scrollTo(
          {
            top: prevScrollTop,
            left: prevScrollLeft,
          },
          omitKeys(config ?? {}, { offset: true }), // no offset when undoing
        );
        await action?.waitFor();
      }
    };

    this[MC.S_TOGGLE] = async () => {
      const start = await watcher.fetchCurrentScroll(scrollable);

      const canReverse = prevScrollTop !== -1;
      let hasReversed = false;

      // Try to scroll to the element, but if we're already close to it, then
      // reverse to previous position if any.
      const altTarget = {
        top: () => {
          hasReversed = true; // detect if we have reversed
          return prevScrollTop;
        },
        left: prevScrollLeft,
      };

      const action = await watcher.scrollTo(
        element,
        MH.merge(
          config,
          canReverse
            ? { altTarget } // no altOffset when reversing
            : {},
        ),
      );
      await action?.waitFor();

      if (!hasReversed) {
        // We've scrolled to the element, so save the starting position as the
        // previous one.
        prevScrollTop = start[MC.S_SCROLL_TOP];
        prevScrollLeft = start[MC.S_SCROLL_LEFT];
      }
    };
  }
}

/**
 * @interface
 * @category Scrolling
 */
export type ScrollToConfig = {
  /**
   * See {@link Utils.ScrollToOptions.offset}.
   *
   * @defaultValue undefined // none
   */
  offset?: CoordinateOffset;

  /**
   * The duration in milliseconds of the scroll animation.
   *
   * @defaultValue {@link ScrollWatcher} default
   */
  duration?: number;

  /**
   * The element that should be scrolled.
   *
   * @defaultValue {@link ScrollWatcher} default
   */
  scrollable?: Element;
};

// --------------------

const newConfigValidator: WidgetConfigValidatorFunc<{
  offsetX: number;
  offsetY: number;
  duration: number | undefined;
  scrollable?: Element;
}> = (element) => {
  return {
    offsetX: (key, value) => validateNumber(key, value) ?? 0,
    offsetY: (key, value) => validateNumber(key, value) ?? 0,
    duration: (key, value) => validateNumber(key, value),
    scrollable: (key, value) =>
      (MH.isLiteralString(value)
        ? waitForReferenceElement(value, element)
        : null) ?? undefined,
  };
};
