"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Open = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var _openable = require("../widgets/openable.cjs");
var _widget = require("../widgets/widget.cjs");
var _action = require("./action.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
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
var Open = exports.Open = /*#__PURE__*/function () {
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
    var widgetPromise = (0, _widget.fetchUniqueWidget)("openable", element, _openable.Openable);
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
      (0, _action.registerAction)("open", function (element) {
        return new Open(element);
      });
    }
  }]);
}();
//# sourceMappingURL=open.cjs.map