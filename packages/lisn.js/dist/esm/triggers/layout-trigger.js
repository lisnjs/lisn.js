function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Triggers
 *
 * @categoryDescription Layout
 * {@link LayoutTrigger} allows you to run actions when the viewport or a
 * target element's width or aspect ratio matches a given specification, and
 * undo those actions when the target's width or aspect ratio no longer
 * matches.
 */

import * as MH from "../globals/minification-helpers.js";
import { waitForReferenceElement } from "../utils/dom-search.js";
import { isValidDeviceList, isValidAspectRatioList, getOtherDevices, getOtherAspectRatios } from "../utils/layout.js";
import { validateStringRequired } from "../utils/validation.js";
import { LayoutWatcher } from "../watchers/layout-watcher.js";
import { registerTrigger, Trigger } from "./trigger.js";
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
 *   {@link AspectRatioSpec}. In this case you can use a dash ("-") instead of
 *   space if needed (for example if using CSS classes instead of data
 *   attributes), e.g. "min-tablet" instead of "min tablet".
 *
 * - Additional trigger options:
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
 * <div data-lisn-on-layout="min tablet @add-class=tablet"></div>
 * ```
 *
 * @example
 * Add class `mobile` when the window width is "mobile" or mobile-wide, add
 * class `tablet`, when it's "tablet" and so on; undo that otherwise:
 *
 * ```html
 * <div data-lisn-on-layout="max mobile-wide @add-class=mobile ;
 *                           tablet @add-class=tablet ;
 *                           desktop @add-class=desktop"
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
 * <div data-lisn-on-layout="square @add-class=c1,c2 @enable=my-trigger +root=next.box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div class="box"></div>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <div data-lisn-on-layout="square @add-class=c1,c2 @enable=my-trigger +root=next-box"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <div data-lisn-ref="box"></div>
 *
 * @category Layout
 */
export class LayoutTrigger extends Trigger {
  static register() {
    registerTrigger("layout", (element, args, actions, config) => {
      var _args$;
      return new LayoutTrigger(element, actions, MH.assign(config, {
        layout: validateStringRequired("layout", MH.strReplace(MH.strReplace((_args$ = args[0]) !== null && _args$ !== void 0 ? _args$ : "", /(min|max)-/g, "$1 "), /-to-/g, " to "), value => isValidDeviceList(value) || isValidAspectRatioList(value))
      }));
    }, newConfigValidator);
  }

  /**
   * If no actions are supplied, nothing is done.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the config is invalid.
   */
  constructor(element, actions, config) {
    var _config$layout;
    const layout = (_config$layout = config === null || config === void 0 ? void 0 : config.layout) !== null && _config$layout !== void 0 ? _config$layout : "";
    if (!layout) {
      throw MH.usageError("'layout' is required");
    }
    super(element, actions, config);
    _defineProperty(this, "getConfig", void 0);
    this.getConfig = () => MH.copyObject(config);
    if (!MH.lengthOf(actions)) {
      return;
    }
    let devices = [];
    let aspectRatios = [];
    let otherDevices = [];
    let otherAspectRatios = [];
    if (isValidDeviceList(layout)) {
      devices = layout;
      otherDevices = getOtherDevices(layout);
    } else {
      aspectRatios = layout;
      otherAspectRatios = getOtherAspectRatios(layout);
    }
    const root = config.root;
    const watcher = LayoutWatcher.reuse({
      root
    });
    watcher.onLayout(this.run, {
      devices,
      aspectRatios
    });
    if (MH.lengthOf(otherDevices) || MH.lengthOf(otherAspectRatios)) {
      watcher.onLayout(this.reverse, {
        devices: otherDevices,
        aspectRatios: otherAspectRatios
      });
    }
  }
}

/**
 * @category Layout
 * @interface
 */

// --------------------

const newConfigValidator = element => {
  return {
    root: async (key, value) => {
      const root = MH.isLiteralString(value) ? await waitForReferenceElement(value, element) : undefined;
      if (root && !MH.isHTMLElement(root)) {
        throw MH.usageError("root must be HTMLElement");
      }
      return root;
    }
  };
};
//# sourceMappingURL=layout-trigger.js.map