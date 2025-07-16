"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollTrigger = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _directions = require("../utils/directions.cjs");
var _domSearch = require("../utils/dom-search.cjs");
var _validation = require("../utils/validation.cjs");
var _scrollWatcher = require("../watchers/scroll-watcher.cjs");
var _trigger = require("./trigger.cjs");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Triggers
 *
 * @categoryDescription Scroll
 * {@link ScrollTrigger} allows you to run actions when the user scrolls a
 * target element (or the main scrollable element) in a given direction, and
 * undo those actions when they scroll in the opposite direction.
 */
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
 * - Arguments (optional): One or more (comma-separated) scroll directions.
 *   Note that if you do not specify any directions, then the trigger will just
 *   run once, on any scroll.
 * - Additional trigger options:
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
 * <div data-lisn-on-scroll="@add-class=scrolled ;
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
 *   <div data-lisn-on-scroll="up,down @add-class=c1,c2 @enable=my-trigger +scrollable=this.section"
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
 *   <div data-lisn-on-scroll="up,down @add-class=c1,c2 @enable=my-trigger +scrollable=this-section"
 *      data-lisn-on-run="@show +id=my-trigger"
 *   ></div>
 *</div>
 * ```
 *
 * @category Scroll
 */
class ScrollTrigger extends _trigger.Trigger {
  static register() {
    (0, _trigger.registerTrigger)(MC.S_SCROLL, (element, args, actions, config) => {
      return new ScrollTrigger(element, actions, MH.assign(config, {
        directions: (0, _validation.validateStrList)("directions", args, _directions.isValidXYDirection)
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
    config = config !== null && config !== void 0 ? config : {};
    let directions = config.directions;
    if (!directions) {
      config.once = true;
      directions = [MC.S_UP, MC.S_DOWN, MC.S_LEFT, MC.S_RIGHT];
    }
    super(element, actions, config);
    _defineProperty(this, "getConfig", void 0);
    this.getConfig = () => MH.copyObject(config);
    if (!MH.lengthOf(actions)) {
      return;
    }
    const watcher = _scrollWatcher.ScrollWatcher.reuse();
    const scrollable = config.scrollable;
    const threshold = config.threshold;
    const oppositeDirections = directions ? (0, _directions.getOppositeXYDirections)(directions) : [];
    watcher.onScroll(this.run, {
      directions,
      scrollable,
      threshold
    });
    if (MH.lengthOf(oppositeDirections)) {
      watcher.onScroll(this.reverse, {
        directions: oppositeDirections,
        scrollable,
        threshold
      });
    }
  }
}

/**
 * @category Scroll
 * @interface
 */
exports.ScrollTrigger = ScrollTrigger;
// --------------------

const newConfigValidator = element => {
  return {
    scrollable: (key, value) => {
      var _ref;
      return (_ref = MH.isLiteralString(value) ? (0, _domSearch.waitForReferenceElement)(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    },
    threshold: _validation.validateNumber
  };
};
//# sourceMappingURL=scroll-trigger.cjs.map