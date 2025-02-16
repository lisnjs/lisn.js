"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Show = exports.Hide = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var _cssAlter = require("../utils/css-alter.cjs");
var _action = require("./action.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Actions
 */
/**
 * Shows or hides the given element with a smooth fading transition.
 *
 * **IMPORTANT:** When constructed, it will hide the element as a form of
 * initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "show".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <button id="btn">Show/hide</button>
 * <div data-lisn-on-click="@show +target=#btn"></div>
 * ```
 *
 * @category Showing/hiding elements
 */
class Show {
  static register() {
    (0, _action.registerAction)("show", element => new Show(element));
  }
  constructor(element) {
    /**
     * Shows the element with a smooth fade in transition.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Hides the element with a smooth fade out transition.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Shows the element if it is hidden, hides it otherwise.
     */
    _defineProperty(this, "toggle", void 0);
    (0, _cssAlter.disableInitialTransition)(element);
    (0, _cssAlter.hideElement)(element); // initial state

    const {
      _show,
      _hide,
      _toggle
    } = getMethods(element);
    this.do = _show;
    this.undo = _hide;
    this[MC.S_TOGGLE] = _toggle;
  }
}

/**
 * Hides or shows the given element with a smooth fading transition.
 *
 * **IMPORTANT:** When constructed, it will remove any `lisn-hide` class from
 * the element as a form of initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "hide".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <button id="btn">Show/hide</button>
 * <div data-lisn-on-click="@hide +target=#btn"></div>
 * ```
 *
 * @category Showing/hiding elements
 */
exports.Show = Show;
class Hide {
  static register() {
    (0, _action.registerAction)("hide", element => new Hide(element));
  }
  constructor(element) {
    /**
     * Hides the element with a smooth fade out transition.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Shows the element with a smooth fade in transition.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Shows the element if it is hidden, hides it otherwise.
     */
    _defineProperty(this, "toggle", void 0);
    (0, _cssAlter.disableInitialTransition)(element);
    (0, _cssAlter.showElement)(element); // initial state

    const {
      _show,
      _hide,
      _toggle
    } = getMethods(element);
    this.do = _hide;
    this.undo = _show;
    this[MC.S_TOGGLE] = _toggle;
  }
}

// --------------------
exports.Hide = Hide;
const getMethods = element => {
  return {
    _show: async () => {
      await (0, _cssAlter.showElement)(element); // ignore return val
    },
    _hide: async () => {
      await (0, _cssAlter.hideElement)(element); // ignore return val
    },
    _toggle: async () => {
      await (0, _cssAlter.toggleShowElement)(element); // ignore return val
    }
  };
};
//# sourceMappingURL=show.cjs.map