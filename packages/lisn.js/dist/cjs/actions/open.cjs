"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Open = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var _openable = require("../widgets/openable.cjs");
var _widget = require("../widgets/widget.cjs");
var _action = require("./action.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Actions
 *
 * @categoryDescription Controlling openables
 * {@link Open} opens or closes the {@link Openable} widget setup for the given
 * element.
 */
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
class Open {
  static register() {
    (0, _action.registerAction)("open", element => new Open(element));
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
    const widgetPromise = (0, _widget.fetchUniqueWidget)("openable", element, _openable.Openable);
    this.do = () => widgetPromise.then(open);
    this.undo = () => widgetPromise.then(close);
    this[MC.S_TOGGLE] = () => widgetPromise.then(toggle);
  }
}
exports.Open = Open;
//# sourceMappingURL=open.cjs.map