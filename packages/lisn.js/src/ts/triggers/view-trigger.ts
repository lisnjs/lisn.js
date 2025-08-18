/**
 * @module Triggers
 *
 * @categoryDescription View
 * {@link ViewTrigger} allows you to run actions when the viewport's scroll
 * position relative to a given target or offset from top/bottom/left/right is
 * one of the matching "views" (at/above/below/left/right), and undo those
 * actions when the viewport's "view" is not matching.
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { ViewTarget, View, CommaSeparatedStr } from "@lisn/globals/types";

import { hasClass } from "@lisn/utils/css-alter";
import { insertGhostClone, tryWrap } from "@lisn/utils/dom-alter";
import { waitForReferenceElement } from "@lisn/utils/dom-search";
import { deepCopy } from "@lisn/utils/misc";
import { formatAsString } from "@lisn/utils/text";
import {
  validateStrList,
  validateString,
  validateNumList,
} from "@lisn/utils/validation";
import {
  getOppositeViews,
  isValidView,
  isValidScrollOffset,
} from "@lisn/utils/views";

import { Action } from "@lisn/actions/action";
import { Animate } from "@lisn/actions/animate";
import { AnimatePlay } from "@lisn/actions/animate-play";

import { ViewWatcher } from "@lisn/watchers/view-watcher";

import {
  registerTrigger,
  Trigger,
  TriggerConfig,
} from "@lisn/triggers/trigger";

import { WidgetConfigValidatorFunc } from "@lisn/widgets/widget";

import debug from "@lisn/debug/debug";

/**
 * {@link ViewTrigger} allows you to run actions when the viewport's scroll
 * position relative to a given target or offset from top/bottom/left/right is
 * one of the matching "views" (at/above/below/left/right), and undo those
 * actions when the viewport's "view" is not matching.
 *
 * -------
 *
 * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
 * specification.
 *
 * - Arguments (optional): One or more (comma-separated)
 *   {@link ViewTriggerConfig.views | views}. Default is "at".
 *
 * - Additional trigger options (see {@link ViewTriggerConfig}):
 *   - `target`: A string element specification for an element (see
 *     {@link Utils.getReferenceElement | getReferenceElement}) or a
 *     {@link Types.ScrollOffsetSpec | ScrollOffsetSpec}.
 *   - `root`: A string element specification. See
 *     {@link Utils.getReferenceElement | getReferenceElement}.
 *   - `rootMargin`: A string, a (comma or space-separated) list of margins.
 *   - `threshold`: A number or a (comma-separated) list of numbers.
 *
 * @example
 * Show the element when it's in the viewport, hide otherwise.
 *
 * ```html
 * <div data-lisn-on-view="at @show"></div>
 * ```
 *
 * @example
 * Same as above. "views" is optional and defaults to "at".
 *
 * ```html
 * <div data-lisn-on-view="@show"></div>
 * ```
 *
 * @example
 * As above but using a CSS class instead of data attribute:
 *
 * ```html
 * <div class="lisn-on-view--@show"></div>
 * ```
 *
 * @example
 * Show the element 1000ms after the first time it enters the viewport.
 *
 * ```html
 * <div data-lisn-on-view="@show +once +delay=1000"></div>
 * ```
 *
 * @example
 * Add class `seen` the first time the element enters the viewport, and play
 * the animations defined on it 1000ms after each time it enters the viewport,
 * reverse the animations as soon as it goes out of view.
 *
 * ```html
 * <div data-lisn-on-view="@add-class: seen +once ;
 *                         @animate +do-delay=1000"
 * ></div>
 * ```
 *
 * @example
 * Add class `seen` when the viewport is at or below the element (element
 * above viewport), remove it when the viewport is above the element.
 * Element going to the left or right of the viewport will not trigger the
 * action. See {@link getOppositeViews}:
 *
 * ```html
 * <div data-lisn-on-view="at,below @add-class: seen"></div>
 * ```
 *
 * @example
 * Add class `cls` when the viewport is above or to the left the element
 * (element below or to the right of the viewport), remove it when the
 * viewport is either at, below or to the right of the element.
 *
 * ```html
 * <div data-lisn-on-view="above,left @add-class: cls"></div>
 * ```
 *
 * @example
 * Hide the element when the viewport is above the next element with class
 * `section`, show it when the viewport is below or at the target element.
 *
 * ```html
 * <div data-lisn-on-view="above @hide +target=next.section"></div>
 * <div class="section"></div>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <div data-lisn-on-view="above @hide +target=next-section"></div>
 * <div data-lisn-ref="section"></div>
 * ```
 *
 * @example
 * Open the {@link Widgets.Openable | Openable} widget configured for this
 * element when the viewport is 75% down from the top of the page.
 *
 * ```html
 * <div data-lisn-on-view="@open +target=top:75%"></div>
 * ```
 *
 * @example
 * As above but using a custom {@link Watchers/ViewWatcher.ViewWatcherConfig.root | root},
 * {@link Watchers/ViewWatcher.ViewWatcherConfig.rootMargin | rootMargin} and
 * {@link Watchers/ViewWatcher.ViewWatcherConfig.threshold | threshold} for the
 * {@link ViewWatcher}.
 *
 * ```html
 * <div data-lisn-on-view="@open
 *                         +target=top:75%
 *                         +root=#root
 *                         +root-margin=10% 20% 10% 20%
 *                         +threshold=0.3"
 * ></div>
 * ```
 *
 * @category View
 */
export class ViewTrigger extends Trigger {
  readonly getConfig: () => ViewTriggerConfig;

  static register() {
    registerTrigger(
      "view",
      (element, args, actions, config) => {
        return new ViewTrigger(
          element,
          actions,
          MH.assign(config, {
            views: validateStrList("views", args, isValidView),
          } as const),
        );
      },
      newConfigValidator,
    );
  }

  /**
   * If no actions are supplied, nothing is done.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the config is invalid.
   */
  constructor(element: Element, actions: Action[], config?: ViewTriggerConfig) {
    config ??= {};
    super(element, actions, config);

    const logger = debug
      ? new debug.Logger({
          name: `ViewTrigger-${formatAsString(element)}`,
        })
      : null;

    this.getConfig = () => deepCopy(config);

    if (!MH.lengthOf(actions)) {
      return;
    }

    let rootMargin = config.rootMargin;
    if (MH.isString(rootMargin)) {
      rootMargin = rootMargin.replace(/,/g, " ");
    }

    const watcher = ViewWatcher.reuse({
      root: config.root,
      rootMargin,
      threshold: config.threshold,
    });

    const target = config.target ?? element;
    const views = config.views || MC.S_AT;
    const oppositeViews = getOppositeViews(views);

    const setupWatcher = (target: ViewTarget) => {
      if (!MH.lengthOf(oppositeViews)) {
        debug: logger?.debug6("Trigger can never be reversed, running now");
        // The action is never undone
        this.run();
      } else {
        debug: logger?.debug6("Setting up trigger", views, oppositeViews);
        watcher.onView(target, this.run, { views });
        watcher.onView(target, this.reverse, { views: oppositeViews });
      }
    };

    // See comment in globals/settings under contentWrappingAllowed
    let willAnimate = false;
    for (const action of actions) {
      if (
        MH.isInstanceOf(action, Animate) ||
        MH.isInstanceOf(action, AnimatePlay)
      ) {
        willAnimate = true;
        break;
      }
    }

    if (willAnimate) {
      setupRepresentative(element).then(setupWatcher);
    } else {
      setupWatcher(target);
    }
  }
}

/**
 * @category View
 * @interface
 */
export type ViewTriggerConfig = TriggerConfig & {
  /**
   * The {@link View} to use as the trigger.
   * See also {@link Watchers/ViewWatcher.OnViewOptions | OnViewOptions}
   *
   * Actions will be "done" when the view matches the given spec and "undone"
   * otherwise. What the opposite views are depends on the given view. E.g. for
   * "at", opposites are all the other ones;  for "above", the opposite ones
   * are "at" and "below"; for "at,above" opposite is "below", etc.
   *
   * @defaultValue "at"
   */
  views?: CommaSeparatedStr<View> | View[];

  /**
   * The target to use for the ViewWatcher. It can be a string offset
   * specification.
   * See {@link Watchers/ViewWatcher.OnViewOptions | OnViewOptions}
   *
   * @defaultValue The element on which the {@link ViewTrigger} is defined
   */
  target?: ViewTarget;

  /**
   * The root to pass to the {@link ViewWatcher}.
   * See also {@link Watchers/ViewWatcher.ViewWatcherConfig | ViewWatcherConfig}
   *
   * @defaultValue {@link ViewWatcher} default
   */
  root?: Element | null;

  /**
   * The root margin to pass to the {@link ViewWatcher}.
   * See also {@link Watchers/ViewWatcher.ViewWatcherConfig | ViewWatcherConfig}
   *
   * @defaultValue {@link ViewWatcher} default
   */
  rootMargin?:
    | string
    | { top?: number; right?: number; bottom?: number; left?: number };

  /**
   * The threshold to pass to the {@link ViewWatcher}.
   * See also {@link Watchers/ViewWatcher.ViewWatcherConfig | ViewWatcherConfig}
   *
   * @defaultValue {@link ViewWatcher} default
   */
  threshold?: number | number[];
};

// ----------

const newConfigValidator: WidgetConfigValidatorFunc<
  Omit<ViewTriggerConfig, "views">
> = (element) => {
  return {
    target: (key, value) =>
      MH.isLiteralString(value) && isValidScrollOffset(value)
        ? value
        : MH.isLiteralString(value)
          ? waitForReferenceElement(value, element).then((v) => v ?? undefined) // ugh, typescript...
          : undefined,
    root: (key, value) =>
      MH.isLiteralString(value)
        ? waitForReferenceElement(value, element).then((v) => v ?? undefined) // ugh, typescript...
        : undefined,
    rootMargin: validateString,
    threshold: (key, value) => validateNumList(key, value),
  };
};

const setupRepresentative = async (element: Element): Promise<Element> => {
  let target: Element | null = await tryWrap(element);
  if (!target) {
    // Not allowed to wrap. Create a dummy hidden clone that's not animated and
    // position it absolutely in a wrapper of size 0 that's inserted just
    // before the actual element, so that the hidden clone overlaps the actual
    // element's regular (pre-transformed) position.

    const prev = element.previousElementSibling;
    const prevChild = MH.childrenOf(prev)[0];
    if (
      prev &&
      hasClass(prev, MC.PREFIX_WRAPPER) &&
      prevChild &&
      hasClass(prevChild, MC.PREFIX_GHOST)
    ) {
      // Already cloned by a previous animate action?
      target = prevChild;
    } else {
      target = (await insertGhostClone(element))._clone;
    }
  }

  return target;
};
