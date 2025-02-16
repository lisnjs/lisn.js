"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoadTrigger = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _domEvents = require("../utils/dom-events.cjs");
var _trigger = require("./trigger.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Triggers
 *
 * @categoryDescription Load
 * {@link LoadTrigger} allows you to run actions once when the page is loaded.
 */
/**
 * {@link LoadTrigger} allows you to run actions one when the page is loaded.
 *
 * -------
 *
 * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
 * specification.
 *
 * - Arguments: none
 * - Additional trigger options: none
 *
 * @example
 * Scroll to the given element when the page is loaded:
 *
 * ```html
 * <div data-lisn-on-load=":scroll-to"></div>
 * ```
 *
 * @example
 * Scroll to 100px above the given element 500ms after the page is loaded:
 *
 * ```html
 * <div data-lisn-on-load="@scroll-to=0,-100 +delay=500"></div>
 * ```
 *
 * @example
 * Scroll to 100px above the given element 500ms after the page is loaded, and
 * play animations defined on it 500ms later (1000ms after it's loaded):
 *
 * ```html
 * <div data-lisn-on-load="@scroll-to=0,-100 +delay=500 ;
 *                         @animate +delay=1000"
 * ></div>
 * ```
 *
 * @category Load
 */
class LoadTrigger extends _trigger.Trigger {
  static register() {
    (0, _trigger.registerTrigger)("load", (element, args, actions, config) => new LoadTrigger(element, actions, config));
  }

  /**
   * If no actions are supplied, nothing is done.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the config is invalid.
   */
  constructor(element, actions, config) {
    super(element, actions, config);
    _defineProperty(this, "getConfig", void 0);
    this.getConfig = () => MH.copyObject(config);
    if (!MH.lengthOf(actions)) {
      return;
    }
    (0, _domEvents.waitForPageReady)().then(this.run);
  }
}
exports.LoadTrigger = LoadTrigger;
//# sourceMappingURL=load-trigger.cjs.map