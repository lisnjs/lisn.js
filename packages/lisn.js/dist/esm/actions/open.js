function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
export var Open = /*#__PURE__*/function () {
  function Open(element) {
    _classCallCheck(this, Open);
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
    var open = function open(widget) {
      return widget === null || widget === void 0 ? void 0 : widget.open();
    };
    var close = function close(widget) {
      return widget === null || widget === void 0 ? void 0 : widget.close();
    };
    var toggle = function toggle(widget) {
      return widget === null || widget === void 0 ? void 0 : widget.toggle();
    };
    var widgetPromise = fetchUniqueWidget("openable", element, Openable);
    this["do"] = function () {
      return widgetPromise.then(open);
    };
    this.undo = function () {
      return widgetPromise.then(close);
    };
    this[MC.S_TOGGLE] = function () {
      return widgetPromise.then(toggle);
    };
  }
  return _createClass(Open, null, [{
    key: "register",
    value: function register() {
      registerAction("open", function (element) {
        return new Open(element);
      });
    }
  }]);
}();
//# sourceMappingURL=open.js.map