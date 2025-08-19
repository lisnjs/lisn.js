/**
 * @module Triggers
 *
 * @categoryDescription Scroll
 * {@link ScrollTrigger} allows you to run actions when the user scrolls a
 * target element (or the main scrollable element) in a given direction, and
 * undo those actions when they scroll in the opposite direction.
 */

import * as _ from "@lisn/_internal";

import {
  XYDirection,
  CommaSeparatedStr,
  ScrollTarget,
} from "@lisn/globals/types";

import {
  getOppositeXYDirections,
  isValidXYDirection,
} from "@lisn/utils/directions";
import { waitForReferenceElement } from "@lisn/utils/dom-search";
import { validateStrList, validateNumber } from "@lisn/utils/validation";

import { Action } from "@lisn/actions/action";

import { ScrollWatcher } from "@lisn/watchers/scroll-watcher";

import {
  registerTrigger,
  Trigger,
  TriggerConfig,
} from "@lisn/triggers/trigger";

import { WidgetConfigValidatorFunc } from "@lisn/widgets/widget";

/**
 * {@link ScrollTrigger} allows you to run actions when the user scrolls a
 * target element (or the main scrollable element) in a given direction, and
 * undo those actions when they scroll in the opposite direction.
 *
 * -------
 *
 * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
 * specification.
 *
 * - Arguments (optional): One or more (comma-separated)
 *   {@link ScrollTriggerConfig.directions | scroll directions}.
 *   Note that if you do not specify any directions, then the trigger will just
 *   run once, on the first scroll in any direction.
 *
 * - Additional trigger options (see {@link ScrollTriggerConfig}):
 *   - `scrollable`: A string element specification.
 *      See {@link Utils.getReferenceElement | getReferenceElement}.
 *   - `threshold`: A number.
 *
 * @example
 * Show the element when the user scrolls the page up, hide when scrolling
 * down. User scrolling left or right not trigger the action. See
 * {@link getOppositeXYDirections}:
 *
 * ```html
 * <div data-lisn-on-scroll="up @show"></div>
 * ```
 *
 * @example
 * As above, but using a CSS class instead of data attribute:
 *
 * ```html
 * <div class="lisn-on-scroll--up@show"></div>
 * ```
 *
 * @example
 * Show the element 1000ms after the first time the user scrolls the page up:
 *
 * ```html
 * <div data-lisn-on-scroll="up @show +once +delay=1000"></div>
 * ```
 *
 * @example
 * Add class `scrolled` the first time the user scrolls the page in any
 * direction (note that the `once` option is implied here), and show the
 * element 1000ms after each time the user scrolls the page up, hide it as soon
 * as they scroll down:
 *
 * ```html
 * <div data-lisn-on-scroll="@add-class: scrolled ;
 *                           up @show +do-delay=1000"
 * ></div>
 * ```
 *
 * @example
 * When the user scrolls up or down the closest ancestor with class `section`,
 * then add classes `c1` and `c2` and enable trigger `my-trigger` defined on
 * this same element; undo all of that when scrolling right or left:
 *
 * ```html
 * <div class="section">
 *   <div data-lisn-on-scroll="up,down @add-class: c1,c2 @enable: my-trigger +scrollable=this.section"
 *      data-lisn-on-run="@show +id=my-trigger"
 *   ></div>
 *</div>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <div data-lisn-ref="section">
 *   <div data-lisn-on-scroll="up,down @add-class: c1,c2 @enable: my-trigger +scrollable=this-section"
 *      data-lisn-on-run="@show +id=my-trigger"
 *   ></div>
 *</div>
 * ```
 *
 * @category Scroll
 */
export class ScrollTrigger extends Trigger {
  readonly getConfig: () => ScrollTriggerConfig;

  static register() {
    registerTrigger(
      _.S_SCROLL,
      (element, args, actions, config) => {
        return new ScrollTrigger(
          element,
          actions,
          _.assign(config, {
            directions: validateStrList("directions", args, isValidXYDirection),
          }),
        );
      },
      createConfigValidator,
    );
  }

  /**
   * If no actions are supplied, nothing is done.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the config is invalid.
   */
  constructor(
    element: Element,
    actions: Action[],
    config?: ScrollTriggerConfig,
  ) {
    config ??= {};

    let directions = config.directions;
    if (!directions) {
      config.once = true;
      directions = [_.S_UP, _.S_DOWN, _.S_LEFT, _.S_RIGHT];
    }

    super(element, actions, config);
    this.getConfig = () => _.deepCopy(config);

    if (!_.lengthOf(actions)) {
      return;
    }

    const watcher = ScrollWatcher.reuse();
    const scrollable = config.scrollable;
    const threshold = config.threshold;

    const oppositeDirections = directions
      ? getOppositeXYDirections(directions)
      : [];

    watcher.onScroll(this.run, {
      directions,
      scrollable,
      threshold,
    });

    if (_.lengthOf(oppositeDirections)) {
      watcher.onScroll(this.reverse, {
        directions: oppositeDirections,
        scrollable,
        threshold,
      });
    }
  }
}

/**
 * @category Scroll
 * @interface
 */
export type ScrollTriggerConfig = TriggerConfig & {
  /**
   * The {@link XYDirection}s to use as the trigger.
   * See also {@link Watchers/ScrollWatcher.OnScrollOptions | OnScrollOptions}
   *
   * Actions will be "done" when the scroll direction is one of the given ones
   * and "undone" when it's the opposite direction. E.g. for "up" the opposite
   * is "down".
   */
  directions?: CommaSeparatedStr<XYDirection> | XYDirection[];

  /**
   * The scrolling element target to use for the ScrollWatcher.
   * See {@link Watchers/ScrollWatcher.OnScrollOptions | OnScrollOptions}
   *
   * @defaultValue {@link ScrollWatcher} default, the main scrolling element
   */
  scrollable?: ScrollTarget;

  /**
   * The scroll threshold to pass to the {@link ScrollWatcher}.
   * See also {@link Watchers/ScrollWatcher.OnScrollOptions | OnScrollOptions}
   *
   * @defaultValue {@link ScrollWatcher} default
   */
  threshold?: number;
};

// --------------------

const createConfigValidator: WidgetConfigValidatorFunc<
  Omit<ScrollTriggerConfig, "directions">
> = (element) => {
  return {
    scrollable: (key, value) =>
      _.isLiteralString(value)
        ? waitForReferenceElement(value, element).then((v) => v ?? void 0) // ugh, typescript...
        : void 0,
    threshold: validateNumber,
  };
};

_.brandClass(ScrollTrigger, "ScrollTrigger");
