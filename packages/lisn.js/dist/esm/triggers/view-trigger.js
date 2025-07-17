function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Triggers
 *
 * @categoryDescription View
 * {@link ViewTrigger} allows you to run actions when the viewport's scroll
 * position relative to a given target or offset from top/bottom/left/right is
 * one of the matching "views" (at/above/below/left/right), and undo those
 * actions when the viewport's "view" is not matching.
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { hasClass } from "../utils/css-alter.js";
import { insertGhostClone, tryWrap } from "../utils/dom-alter.js";
import { waitForReferenceElement } from "../utils/dom-search.js";
import { formatAsString } from "../utils/text.js";
import { validateStrList, validateString, validateNumList } from "../utils/validation.js";
import { getOppositeViews, isValidView, isValidScrollOffset } from "../utils/views.js";
import { Animate } from "../actions/animate.js";
import { AnimatePlay } from "../actions/animate-play.js";
import { ViewWatcher } from "../watchers/view-watcher.js";
import { registerTrigger, Trigger } from "./trigger.js";
import debug from "../debug/debug.js";

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
 * - Arguments (optional): One or more (comma-separated) {@link View}s.
 *   Default is "at".
 * - Additional trigger options:
 *   - `target`: A string element specification for an element (see
 *     {@link Utils.getReferenceElement | getReferenceElement}) or a
 *     {@link Types.ScrollOffset | ScrollOffset}.
 *   - `root`: A string element specification. See
 *     {@link Utils.getReferenceElement | getReferenceElement}.
 *   - `rootMargin`: A string.
 *   - `threshold`: A number or list (comma-separated) of numbers.
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
 * <div data-lisn-on-view="@add-class=seen +once ;
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
 * <div data-lisn-on-view="at,below @add-class=seen"></div>
 * ```
 *
 * @example
 * Add class `cls` when the viewport is above or to the left the element
 * (element below or to the right of the viewport), remove it when the
 * viewport is either at, below or to the right of the element.
 *
 * ```html
 * <div data-lisn-on-view="above,left @add-class=cls"></div>
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
 * @category View
 */
export class ViewTrigger extends Trigger {
  static register() {
    registerTrigger("view", (element, args, actions, config) => {
      return new ViewTrigger(element, actions, MH.assign(config, {
        views: validateStrList("views", args, isValidView)
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
    var _config$rootMargin;
    super(element, actions, config);
    _defineProperty(this, "getConfig", void 0);
    const logger = debug ? new debug.Logger({
      name: `ViewTrigger-${formatAsString(element)}`
    }) : null;
    this.getConfig = () => MH.copyObject(config || {});
    if (!MH.lengthOf(actions)) {
      return;
    }
    const watcher = ViewWatcher.reuse({
      root: config === null || config === void 0 ? void 0 : config.root,
      rootMargin: config === null || config === void 0 || (_config$rootMargin = config.rootMargin) === null || _config$rootMargin === void 0 ? void 0 : _config$rootMargin.replace(/,/g, " "),
      threshold: config === null || config === void 0 ? void 0 : config.threshold
    });
    const target = (config === null || config === void 0 ? void 0 : config.target) || element;
    const views = (config === null || config === void 0 ? void 0 : config.views) || MC.S_AT;
    const oppositeViews = getOppositeViews(views);
    const setupWatcher = target => {
      if (!MH.lengthOf(oppositeViews)) {
        debug: logger === null || logger === void 0 || logger.debug6("Trigger can never be reversed, running now");
        // The action is never undone
        this.run();
      } else {
        debug: logger === null || logger === void 0 || logger.debug6("Setting up trigger", views, oppositeViews);
        watcher.onView(target, this.run, {
          views
        });
        watcher.onView(target, this.reverse, {
          views: oppositeViews
        });
      }
    };

    // See comment in globals/settings under contentWrappingAllowed
    let willAnimate = false;
    for (const action of actions) {
      if (MH.isInstanceOf(action, Animate) || MH.isInstanceOf(action, AnimatePlay)) {
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

// ----------

const newConfigValidator = element => {
  return {
    target: (key, value) => {
      var _ref;
      return MH.isLiteralString(value) && isValidScrollOffset(value) ? value : (_ref = MH.isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    },
    root: (key, value) => {
      var _ref2;
      return (_ref2 = MH.isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref2 !== void 0 ? _ref2 : undefined;
    },
    rootMargin: validateString,
    threshold: (key, value) => validateNumList(key, value)
  };
};
const setupRepresentative = async element => {
  let target = await tryWrap(element);
  if (!target) {
    // Not allowed to wrap. Create a dummy hidden clone that's not animated and
    // position it absolutely in a wrapper of size 0 that's inserted just
    // before the actual element, so that the hidden clone overlaps the actual
    // element's regular (pre-transformed) position.

    const prev = element.previousElementSibling;
    const prevChild = MH.childrenOf(prev)[0];
    if (prev && hasClass(prev, MC.PREFIX_WRAPPER) && prevChild && hasClass(prevChild, MC.PREFIX_GHOST)) {
      // Done by a previous animate action?
      target = prevChild;
    } else {
      target = (await insertGhostClone(element))._clone;
    }
  }
  return target;
};
//# sourceMappingURL=view-trigger.js.map