"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RemoveClass = exports.AddClass = void 0;
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
 * @categoryDescription Adding/removing class
 * {@link AddClass} and {@link RemoveClass} add or remove a list of CSS classes
 * to/from the given element.
 */
/**
 * Adds or removes a list of CSS classes to/from the given element.
 *
 * **IMPORTANT:** When constructed, it removes all given classes from the
 * element as a form of initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "add-class".
 * - Accepted string arguments: one or more CSS classes
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div data-lisn-on-view="@add-class: clsA, clsB"></div>
 * ```
 *
 * @category Adding/removing class
 */
class AddClass {
  static register() {
    (0, _action.registerAction)("add-class", (element, classNames) => new AddClass(element, ...classNames));
  }
  constructor(element, ...classNames) {
    /**
     * Adds the classes given to the constructor.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Removes the classes given to the constructor.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Toggles each class given to the constructor.
     */
    _defineProperty(this, "toggle", void 0);
    const {
      _add,
      _remove,
      _toggle
    } = getMethods(element, classNames);
    _remove(); // initial state

    this.do = _add;
    this.undo = _remove;
    this[MC.S_TOGGLE] = _toggle;
  }
}

/**
 * Removes or adds a list of CSS classes to/from the given element.
 *
 * **IMPORTANT:** When constructed, it adds all given classes from the element
 * as a form of initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "remove-class".
 * - Accepted string arguments: one or more CSS classes
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div data-lisn-on-view="@remove-class: clsA, clsB"></div>
 * ```
 *
 * @category Adding/removing class
 */
exports.AddClass = AddClass;
class RemoveClass {
  static register() {
    (0, _action.registerAction)("remove-class", (element, classNames) => new RemoveClass(element, ...classNames));
  }
  constructor(element, ...classNames) {
    /**
     * Removes the classes given to the constructor.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Adds the classes given to the constructor.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Toggles each class given to the constructor.
     */
    _defineProperty(this, "toggle", void 0);
    const {
      _add,
      _remove,
      _toggle
    } = getMethods(element, classNames);
    _add(); // initial state

    this.do = _remove;
    this.undo = _add;
    this[MC.S_TOGGLE] = _toggle;
  }
}

// --------------------
exports.RemoveClass = RemoveClass;
const getMethods = (element, classNames) => {
  return {
    _add: () => (0, _cssAlter.addClasses)(element, ...classNames),
    _remove: () => (0, _cssAlter.removeClasses)(element, ...classNames),
    _toggle: async () => {
      for (const cls of classNames) {
        await (0, _cssAlter.toggleClass)(element, cls);
      }
    }
  };
};
//# sourceMappingURL=add-class.cjs.map