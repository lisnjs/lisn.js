function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Actions
 *
 * @categoryDescription Controlling openables
 * {@link Open} opens or closes the {@link Openable} widget setup for the given
 * element.
 */

import * as MC from "../globals/minification-constants.js";
import { Openable } from "../widgets/openable.js";
import { fetchUniqueWidget } from "../widgets/widget.js";
import { registerAction } from "./action.js";

/**
 * Opens or closes the {@link Openable} widget setup for the given element.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "open".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div class="lisn-modal" data-lisn-on-view="@open +reference=top:50%"></div>
 * ```
 *
 * @category Controlling openables
 */
export class Open {
  static register() {
    registerAction("open", element => new Open(element));
  }
  constructor(element) {
    /**
     * Opens the Openable widget setup for the element.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Closes the Openable widget setup for the element.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Toggles the Openable widget setup for the element.
     */
    _defineProperty(this, "toggle", void 0);
    const open = widget => widget === null || widget === void 0 ? void 0 : widget.open();
    const close = widget => widget === null || widget === void 0 ? void 0 : widget.close();
    const toggle = widget => widget === null || widget === void 0 ? void 0 : widget.toggle();
    const widgetPromise = fetchUniqueWidget("openable", element, Openable);
    this.do = () => widgetPromise.then(open);
    this.undo = () => widgetPromise.then(close);
    this[MC.S_TOGGLE] = () => widgetPromise.then(toggle);
  }
}
//# sourceMappingURL=open.js.map