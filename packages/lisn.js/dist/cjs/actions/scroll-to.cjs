"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollTo = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var _domSearch = require("../utils/dom-search.cjs");
var _validation = require("../utils/validation.cjs");
var _scrollWatcher = require("../watchers/scroll-watcher.cjs");
var _action = require("./action.cjs");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Actions
 *
 * @categoryDescription Scrolling
 * {@link ScrollTo} scrolls to the given element or to the previous scroll
 * position.
 */
/**
 * Scrolls to the given element or to the previous scroll position.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "scroll-to".
 * - Accepted string arguments: none
 * - Accepted options:
 *   - `offsetX`: A number.
 *   - `offsetY`: A number.
 *   - `scrollable`: A string element specification for an element (see
 *     {@link Utils.getReferenceElement | getReferenceElement}). Note that,
 *     unless it's a DOM ID, the specification is parsed relative to the
 *     element being acted on and not the element the trigger is defined on (in
 *     case you've used the `act-on` trigger option).
 *
 * **NOTE:** Do not place a + sign in front of the offset values (just omit it
 * if you want a positive offset). Otherwise it will be interpreted as a
 * trigger option.
 *
 * @example
 * When the user clicks the button, scroll the main scrolling element to
 * element's position:
 *
 * ```html
 * <button id="btn">Scroll to/back</button>
 * <div data-lisn-on-click="@scroll-to +target=#btn"></div>
 * ```
 *
 * @example
 * When the user clicks the button, scroll the main scrolling element to
 * element's position +10px down:
 *
 * ```html
 * <button id="btn">Scroll to/back</button>
 * <div data-lisn-on-click="@scroll-to: offsetY=10 +target=#btn"></div>
 * ```
 *
 * @example
 * When the user clicks the button, scroll the main scrolling element to
 * element's position 10px _down_ and 50px _left_:
 *
 * ```html
 * <button id="btn">Scroll to/back</button>
 * <div data-lisn-on-click="@scroll-to: offsetY=10, offsetX=-50 +target=#btn"></div>
 * ```
 *
 * @example
 * When the user clicks the button, scroll the closest parent element with
 * class `scrollable` to the element's position:
 *
 * ```html
 * <button id="btn">Scroll to/back</button>
 * <div class="scrollable">
 *   <div data-lisn-on-click="@scroll-to: scrollable=this.scrollable +target=#btn"></div>
 * </div>
 * ```
 *
 * @example
 * As above, but using `data-lisn-ref` attribute instead of class selector.
 *
 * ```html
 * <button id="btn">Scroll to/back</button>
 * <div data-lisn-ref="scrollable">
 *   <div data-lisn-on-click="@scroll-to: scrollable=this-scrollable +target=#btn"></div>
 * </div>
 * ```
 *
 * @category Scrolling
 */
class ScrollTo {
  static register() {
    (0, _action.registerAction)("scroll-to", (element, args, config) => {
      const offset = config ? {
        left: config.offsetX,
        top: config.offsetY
      } : undefined;
      return new ScrollTo(element, {
        scrollable: config === null || config === void 0 ? void 0 : config.scrollable,
        offset
      });
    }, newConfigValidator);
  }
  constructor(element, config) {
    /**
     * Scrolls the main scrolling element to the element's position.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Scrolls the main scrolling element to the last scroll position before the
     * action was {@link do}ne. If the action had never been done, does nothing.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Scrolls the main scrolling element to the element's position, if it's not
     * already there, or otherwise scrolls the main scrolling element to the
     * previous saved scroll position.
     */
    _defineProperty(this, "toggle", void 0);
    const offset = config === null || config === void 0 ? void 0 : config.offset;
    const scrollable = config === null || config === void 0 ? void 0 : config.scrollable;
    const watcher = _scrollWatcher.ScrollWatcher.reuse();
    let prevScrollTop = -1,
      prevScrollLeft = -1;
    this.do = async () => {
      const current = await watcher.fetchCurrentScroll();
      prevScrollTop = current[MC.S_SCROLL_TOP];
      prevScrollLeft = current[MC.S_SCROLL_LEFT];
      const action = await watcher.scrollTo(element, {
        offset,
        scrollable
      });
      await (action === null || action === void 0 ? void 0 : action.waitFor());
    };
    this.undo = async () => {
      if (prevScrollTop !== -1) {
        const action = await watcher.scrollTo({
          top: prevScrollTop,
          left: prevScrollLeft
        });
        await (action === null || action === void 0 ? void 0 : action.waitFor());
      }
    };
    this[MC.S_TOGGLE] = async () => {
      const start = await watcher.fetchCurrentScroll();
      const canReverse = prevScrollTop !== -1;
      let hasReversed = false;

      // Try to scroll to the element, but if we're already at it, then reverse
      // to previous position if any.
      const altTarget = {
        top: () => {
          hasReversed = true;
          return prevScrollTop;
        },
        left: prevScrollLeft
      };
      const action = await watcher.scrollTo(element, canReverse ? {
        altTarget,
        offset
      } : {
        offset
      });
      await (action === null || action === void 0 ? void 0 : action.waitFor());
      if (!hasReversed) {
        // We've scrolled to the element, so save the starting position as the
        // previous one.
        prevScrollTop = start[MC.S_SCROLL_TOP];
        prevScrollLeft = start[MC.S_SCROLL_LEFT];
      }
    };
  }
}

/**
 * @interface
 * @category Scrolling
 */
exports.ScrollTo = ScrollTo;
// --------------------

const newConfigValidator = element => {
  return {
    offsetX: (key, value) => {
      var _validateNumber;
      return (_validateNumber = (0, _validation.validateNumber)(key, value)) !== null && _validateNumber !== void 0 ? _validateNumber : 0;
    },
    offsetY: (key, value) => {
      var _validateNumber2;
      return (_validateNumber2 = (0, _validation.validateNumber)(key, value)) !== null && _validateNumber2 !== void 0 ? _validateNumber2 : 0;
    },
    scrollable: (key, value) => {
      var _ref;
      return (_ref = MH.isLiteralString(value) ? (0, _domSearch.waitForReferenceElement)(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    }
  };
};
//# sourceMappingURL=scroll-to.cjs.map