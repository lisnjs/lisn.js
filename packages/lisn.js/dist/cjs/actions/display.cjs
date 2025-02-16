"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Undisplay = exports.Display = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var _cssAlter = require("../utils/css-alter.cjs");
var _action = require("./action.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Actions
 *
 * @categoryDescription Showing/hiding elements
 * {@link Display} and {@link Undisplay} displays or "undisplays" (display:
 * none) the given element.
 *
 * {@link Actions.Show | Show} and {@link Actions.Hide | Hide} show or hide the
 * given element with a smooth fading transition.
 */
/**
 * Displays or "undisplays" (display: none) the given element.
 *
 * **IMPORTANT:** When constructed, it adds `display: none` to the element as a
 * form of initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "display".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <button id="btn">Display/undisplay</button>
 * <div data-lisn-on-click="@display +target=#btn"></div>
 * ```
 *
 * @category Showing/hiding elements
 */
class Display {
  static register() {
    (0, _action.registerAction)("display", element => new Display(element));
  }
  constructor(element) {
    /**
     * It reverts the element to its original `display` property.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Sets `display: none` on the element.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Displays the element if it's "undisplayed", otherwise "undisplays" it.
     */
    _defineProperty(this, "toggle", void 0);
    (0, _cssAlter.undisplayElementNow)(element); // initial state

    const {
      _display,
      _undisplay,
      _toggle
    } = getMethods(element);
    this.do = _display;
    this.undo = _undisplay;
    this[MC.S_TOGGLE] = _toggle;
  }
}

/**
 * "Undisplays" (display: none) or displays the given element.
 *
 * **IMPORTANT:** When constructed, it removes the `lisn-undisplay` class if
 * present on the element as a form of initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "undisplay".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <button id="btn">Display/undisplay</button>
 * <div data-lisn-on-click="@undisplay +target=#btn"></div>
 * ```
 *
 * @category Showing/hiding elements
 */
exports.Display = Display;
class Undisplay {
  static register() {
    (0, _action.registerAction)("undisplay", element => new Undisplay(element));
  }
  constructor(element) {
    /**
     * Sets `display: none` on the element.
     */
    _defineProperty(this, "do", void 0);
    /**
     * It reverts the element to its original `display` property.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Displays the element if it's "undisplayed", otherwise "undisplays" it.
     */
    _defineProperty(this, "toggle", void 0);
    (0, _cssAlter.displayElementNow)(element); // initial state

    const {
      _display,
      _undisplay,
      _toggle
    } = getMethods(element);
    this.do = _undisplay;
    this.undo = _display;
    this[MC.S_TOGGLE] = _toggle;
  }
}

// --------------------
exports.Undisplay = Undisplay;
const getMethods = element => {
  return {
    _display: async () => {
      await (0, _cssAlter.displayElement)(element); // ignore return val
    },
    _undisplay: async () => {
      await (0, _cssAlter.undisplayElement)(element); // ignore return val
    },
    _toggle: async () => {
      await (0, _cssAlter.toggleDisplayElement)(element); // ignore return val
    }
  };
};
//# sourceMappingURL=display.cjs.map