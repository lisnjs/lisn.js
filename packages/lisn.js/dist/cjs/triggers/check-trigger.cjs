"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CheckTrigger = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _domSearch = require("../utils/dom-search.cjs");
var _event = require("../utils/event.cjs");
var _trigger = require("./trigger.cjs");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Triggers
 *
 * @categoryDescription Input
 * {@link CheckTrigger} allows you to run actions when the user checks a target
 * checkbox input element, and undo those actions when they uncheck the checkbox.
 */
/**
 * {@link CheckTrigger} allows you to run actions when the user checks a target
 * checkbox input element, and undo those actions when they uncheck the checkbox.
 *
 * -------
 *
 * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
 * specification.
 *
 * - Arguments: none
 * - Additional trigger options: none
 *   - `target`: A string element specification.
 *     See {@link Utils.getReferenceElement | getReferenceElement}.
 *
 * @example
 * Add classes `active` and `checked` when the user checks the checkbox,
 * remove them when unchecked.
 *
 * ```html
 * <input type="checkbox" data-lisn-on-check="@add-class=active,checked"/>
 * ```
 *
 * @example
 * As above, but using a CSS class instead of data attribute:
 *
 * ```html
 * <input type="checkbox" class="lisn-on-check--@add-class=active,checked"/>
 * ```
 *
 * @example
 * Play the animations on the element each time the user checks the next
 * element with class `checkbox` (do nothing when it's unchecked).
 *
 * ```html
 * <div data-lisn-on-check="@animate +one-way +target=next.checkbox"></div>
 * <input type="checkbox" class="checkbox"/>
 * ```
 *
 * @example
 * Add class `used` the first time the user checks the next element with class
 * `checkbox`, and play or reverse the animations 200ms after each time the
 * user toggles the reference checkbox.
 *
 * ```html
 * <div data-lisn-on-check="@add-class=used +once ;
 *                          @animate +delay=200 +target=next.checkbox"
 * ></div>
 * <input type="checkbox" class="checkbox"/>
 * ```
 *
 * @example
 * When the user checks the next element with class `checkbox` then add classes `c1`
 * and `c2` to the element (that the trigger is defined on) and enable trigger
 * `my-trigger` defined on this same element; undo all of that when the user unchecks
 * the reference checkbox.
 *
 * ```html
 * <div data-lisn-on-check="@add-class=c1,c2 @enable=my-trigger +target=next.checkbox"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <input type="checkbox" class="checkbox"/>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <div data-lisn-on-check="@add-class=c1,c2 @enable=my-trigger +target=next-checkbox"
 *      data-lisn-on-run="@show +id=my-trigger"
 * ></div>
 * <input type="checkbox" data-lisn-ref="checkbox"/>
 * ```
 *
 * @category Input
 */
class CheckTrigger extends _trigger.Trigger {
  static register() {
    (0, _trigger.registerTrigger)("check", (element, args, actions, config) => new CheckTrigger(element, actions, config), newConfigValidator);
  }

  /**
   * If no actions are supplied, nothing is done.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the config is invalid.
   */
  constructor(element, actions, config = {}) {
    super(element, actions, config);
    _defineProperty(this, "getConfig", void 0);
    this.getConfig = () => MH.copyObject(config);
    if (!MH.lengthOf(actions)) {
      return;
    }
    const target = MH.targetOf(config) || element;
    if (!MH.isInstanceOf(target, HTMLInputElement)) {
      return;
    }
    const onToggle = () => target.checked ? this.run() : this.reverse();
    (0, _event.addEventListenerTo)(target, "change", onToggle);
    this.onDestroy(() => {
      (0, _event.removeEventListenerFrom)(target, "change", onToggle);
    });
  }
}

/**
 * @category Input
 * @interface
 */
exports.CheckTrigger = CheckTrigger;
// --------------------

const newConfigValidator = element => {
  return {
    target: (key, value) => {
      var _ref;
      return (_ref = MH.isLiteralString(value) ? (0, _domSearch.waitForReferenceElement)(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    }
  };
};
//# sourceMappingURL=check-trigger.cjs.map