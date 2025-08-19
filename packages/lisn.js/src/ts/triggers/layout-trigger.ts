/**
 * @module Triggers
 *
 * @categoryDescription Layout
 * {@link LayoutTrigger} allows you to run actions when the viewport or a
 * target element's width or aspect ratio matches a given specification, and
 * undo those actions when the target's width or aspect ratio no longer
 * matches.
 */

import * as _ from "@lisn/_internal";

import { usageError } from "@lisn/globals/errors";

import {
  DeviceSpec,
  Device,
  AspectRatioSpec,
  AspectRatio,
} from "@lisn/globals/types";

import { waitForReferenceElement } from "@lisn/utils/dom-search";
import {
  isValidDeviceList,
  isValidAspectRatioList,
  getOtherDevices,
  getOtherAspectRatios,
} from "@lisn/utils/layout";
import { validateStringRequired } from "@lisn/utils/validation";

import { Action } from "@lisn/actions/action";

import { LayoutWatcher } from "@lisn/watchers/layout-watcher";

import {
  registerTrigger,
  Trigger,
  TriggerConfig,
} from "@lisn/triggers/trigger";

import { WidgetConfigValidatorFunc } from "@lisn/widgets/widget";

/**
 * {@link LayoutTrigger} allows you to run actions when the viewport or a
 * target element's width or aspect ratio matches a given specification, and
 * undo those actions when the target's width or aspect ratio no longer
 * matches.
 *
 * -------
 *
 * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
 * specification.
 *
 * - Arguments (required): A single {@link DeviceSpec} or
 *   {@link AspectRatioSpec} (see {@link LayoutTriggerConfig.layout}). In this
 *   case you can use a dash ("-") instead of space if needed (for example if
 *   using CSS classes instead of data attributes), e.g. "min-tablet" instead
 *   of "min tablet".
 *
 * - Additional trigger options (see {@link LayoutTriggerConfig}:
 *   - `root`: A string element specification. See
 *     {@link Utils.getReferenceElement | getReferenceElement}.
 *
 * @example
 * Show the element when the window width matches "tablet" breakpoint, hide
 * otherwise:
 *
 * ```html
 * <div data-lisn-on-layout="tablet @show"></div>
 * ```
 *
 * @example
 * As above, but using a CSS class instead of data attribute:
 *
 * ```html
 * <div class="lisn-on-layout--tablet@show"></div>
 * ```
 *
 * @example
 * Show the element 1000ms after the window width matches "tablet" breakpoint,
 * hide otherwise:
 *
 * ```html
 * <div data-lisn-on-layout="tablet @show +delay=1000"></div>
 * ```
 *
 * @example
 * Add class `tablet` when the window width is at least "tablet", hide
 * otherwise:
 *
 * ```html
 * <div data-lisn-on-layout="min tablet @add-class: tablet"></div>
 * ```
 *
 * @example
 * Add class `mobile` when the window width is "mobile" or mobile-wide, add
 * class `tablet`, when it's "tablet" and so on; undo that otherwise:
 *
 * ```html
 * <div data-lisn-on-layout="max mobile-wide @add-class: mobile ;
 *                           tablet @add-class: tablet ;
 *                           desktop @add-class: desktop"
 * ></div>
 * ```
 *
 * @example
 * Show the element when window width is at least "mobile-wide" and at most
 * "tablet", hide otherwise:
 *
 * ```html
 * <div data-lisn-on-layout="mobile-wide to tablet @show"></div>
 * ```
 *
 * @example
 * When the aspect ratio of the next element with class `box` is square, then
 * add classes `c1` and `c2` to the element (that the trigger is defined on) and
 * enable trigger `my-trigger` defined on this same element; undo all of that
 * otherwise (on other aspect ratios of the reference root):
 *
 * ```html
 * <div data-lisn-on-layout="square @add-class: c1,c2 @enable: my-trigger +root=next.box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div class="box"></div>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <div data-lisn-on-layout="square @add-class: c1,c2 @enable: my-trigger +root=next-box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div data-lisn-ref="box"></div>
 *
 * @category Layout
 */
export class LayoutTrigger extends Trigger {
  readonly getConfig: () => LayoutTriggerConfig;

  static register() {
    registerTrigger(
      "layout",
      (element, args, actions, config) => {
        return new LayoutTrigger(
          element,
          actions,
          _.assign(config, {
            layout: validateStringRequired(
              "layout",
              _.strReplace(
                _.strReplace(args[0] ?? "", /(min|max)-/g, "$1 "),
                /-to-/g,
                " to ",
              ),
              (value) =>
                isValidDeviceList(value) || isValidAspectRatioList(value),
            ),
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
    config: LayoutTriggerConfig,
  ) {
    const layout = config?.layout ?? "";
    if (!layout) {
      throw usageError("'layout' is required");
    }

    super(element, actions, config);
    this.getConfig = () => _.deepCopy(config);

    if (!_.lengthOf(actions)) {
      return;
    }

    let devices: DeviceSpec | Device[] = [];
    let aspectRatios: AspectRatioSpec | AspectRatio[] = [];
    let otherDevices: Device[] = [];
    let otherAspectRatios: AspectRatio[] = [];

    if (isValidDeviceList(layout)) {
      devices = layout;
      otherDevices = getOtherDevices(layout);
    } else {
      aspectRatios = layout;
      otherAspectRatios = getOtherAspectRatios(layout);
    }

    const root = config.root;
    const watcher = LayoutWatcher.reuse({ root });

    watcher.onLayout(this.run, { devices, aspectRatios });

    if (_.lengthOf(otherDevices) || _.lengthOf(otherAspectRatios)) {
      watcher.onLayout(this.reverse, {
        devices: otherDevices,
        aspectRatios: otherAspectRatios,
      });
    }
  }
}

/**
 * @category Layout
 * @interface
 */
export type LayoutTriggerConfig = TriggerConfig & {
  /**
   * The {@link DeviceSpec} or {@link AspectRatioSpec} to use. Required.
   * See {@link Watchers/LayoutWatcher.OnLayoutOptions | OnLayoutOptions} for
   * accepted formats.
   *
   * Actions will be "done" when the layout of the root matches the given spec
   * and "undone" otherwise.
   */
  layout: DeviceSpec | Device[] | AspectRatioSpec | AspectRatio[];

  /**
   * The root to use for the {@link LayoutWatcher}.
   * See {@link Watchers/LayoutWatcher.LayoutWatcherConfig | LayoutWatcherConfig}
   *
   * @defaultValue {@link LayoutWatcher} default, the viewport
   */
  root?: HTMLElement | null;
};

// --------------------

const createConfigValidator: WidgetConfigValidatorFunc<
  Omit<LayoutTriggerConfig, "layout">
> = (element) => {
  return {
    root: async (key, value) => {
      const root = _.isLiteralString(value)
        ? await waitForReferenceElement(value, element)
        : void 0;
      if (root && !_.isHTMLElement(root)) {
        throw usageError("root must be HTMLElement");
      }
      return root;
    },
  };
};

_.brandClass(LayoutTrigger, "LayoutTrigger");
