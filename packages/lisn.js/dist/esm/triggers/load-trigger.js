function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Triggers
 *
 * @categoryDescription Load
 * {@link LoadTrigger} allows you to run actions once when the page is loaded.
 */

import * as MH from "../globals/minification-helpers.js";
import { waitForPageReady } from "../utils/dom-events.js";
import { registerTrigger, Trigger } from "./trigger.js";

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
export class LoadTrigger extends Trigger {
  static register() {
    registerTrigger("load", (element, args, actions, config) => new LoadTrigger(element, actions, config));
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
    waitForPageReady().then(this.run);
  }
}
//# sourceMappingURL=load-trigger.js.map