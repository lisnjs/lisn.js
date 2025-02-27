"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrevPage = exports.NextPage = exports.GoToPage = exports.EnablePage = exports.DisablePage = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _math = require("../utils/math.cjs");
var _pager = require("../widgets/pager.cjs");
var _widget = require("../widgets/widget.cjs");
var _action = require("./action.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Actions
 *
 * @categoryDescription Controlling pagers
 * {@link NextPage} and {@link PrevPage} advance or reverse the {@link Pager}
 * widget setup for the given element.
 *
 * {@link GoToPage} sets the {@link Pager} to the given page or toggles to the
 * last saved one.
 *
 * {@link EnablePage} and {@link DisablePage} enable or disable the given page
 * of the {@link Pager} widget setup for the given element.
 */
/**
 * Advances or reverses the {@link Pager} widget setup for the given element.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "next-page".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div class="lisn-pager" data-lisn-on-click="@next-page +target=#myNextButton"></div>
 * <button id="myNextButton"></button>
 * ```
 *
 * @category Controlling pagers
 */
class NextPage {
  static register() {
    (0, _action.registerAction)("next-page", element => new NextPage(element));
  }
  constructor(element) {
    /**
     * Advances the pager by one page.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Reverses the pager by one page.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Undoes the last action: reverses the pager if {@link do} was last called
     * or advances it otherwise.
     */
    _defineProperty(this, "toggle", void 0);
    let toggleState = false;
    const {
      _nextPage,
      _prevPage
    } = getMethods(element);
    this.do = () => {
      toggleState = true;
      return _nextPage();
    };
    this.undo = () => {
      toggleState = false;
      return _prevPage();
    };
    this[MC.S_TOGGLE] = () => {
      const method = toggleState ? _prevPage : _nextPage;
      toggleState = !toggleState;
      return method();
    };
  }
}

/**
 * Reverses or advances the {@link Pager} widget setup for the given element.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "prev-page".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div class="lisn-pager" data-lisn-on-click="@prev-page +target=#myPrevButton"></div>
 * <button id="myPrevButton"></button>
 * ```
 *
 * @category Controlling pagers
 */
exports.NextPage = NextPage;
class PrevPage {
  static register() {
    (0, _action.registerAction)("prev-page", element => new PrevPage(element));
  }
  constructor(element) {
    /**
     * Reverses the pager by one page.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Advances the pager by one page.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Undoes the last action: advances the pager if {@link do} was last called
     * or reverses it otherwise.
     */
    _defineProperty(this, "toggle", void 0);
    let toggleState = false;
    const {
      _nextPage,
      _prevPage
    } = getMethods(element);
    this.do = () => {
      toggleState = true;
      return _prevPage();
    };
    this.undo = () => {
      toggleState = false;
      return _nextPage();
    };
    this[MC.S_TOGGLE] = () => {
      const method = toggleState ? _nextPage : _prevPage;
      toggleState = !toggleState;
      return method();
    };
  }
}

/**
 * Goes to a given page, or to the last one beforehand, of the {@link Pager}
 * widget setup for the given element.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "go-to-page".
 * - Accepted string arguments: the number of the target page
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div class="lisn-pager" data-lisn-on-click="@go-to-page:2 +target=#myGoToButton"></div>
 * <button id="myGoToButton"></button>
 * ```
 *
 * @category Controlling pagers
 */
exports.PrevPage = PrevPage;
class GoToPage {
  static register() {
    (0, _action.registerAction)("go-to-page", (element, args) => new GoToPage(element, (0, _math.toInt)(args[0])));
  }
  constructor(element, pageNum) {
    /**
     * Goes to the page number given to the constructor. Numbers start at 1.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Goes to the last saved page number before the action was {@link do}ne. If
     * the action had never been done, does nothing.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Goes to the page number given to the constructor, or if already at this
     * number, goes to the last saved page if any. Numbers start at 1.
     */
    _defineProperty(this, "toggle", void 0);
    if (!pageNum) {
      throw MH.usageError("Target page is required");
    }
    const {
      _goToPage
    } = getMethods(element);
    this.do = () => _goToPage(pageNum);
    this.undo = () => _goToPage(-1);
    this[MC.S_TOGGLE] = () => _goToPage(pageNum, -1);
  }
}

/**
 * Enables or disables the given page of the {@link Pager} widget setup for the
 * given element.
 *
 * **IMPORTANT:** When constructed, it disables the given page as a form of
 * initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "enable-page".
 * - Accepted string arguments: the number of the target page
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div class="lisn-pager" data-lisn-on-click="@enable-page:2 +target=#myEnableButton"></div>
 * <button id="myEnableButton"></button>
 * ```
 *
 * @category Controlling pagers
 */
exports.GoToPage = GoToPage;
class EnablePage {
  static register() {
    (0, _action.registerAction)("enable-page", (element, args) => new EnablePage(element, (0, _math.toInt)(args[0])));
  }
  constructor(element, pageNum) {
    /**
     * Enables the page number given to the constructor. Numbers start at 1.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Disables the page number given to the constructor. Numbers start at 1.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Enables the page number given to the constructor, if it is disabled,
     * otherwise disables it. Numbers start at 1.
     */
    _defineProperty(this, "toggle", void 0);
    if (!pageNum) {
      throw MH.usageError("Target page number is required");
    }
    const {
      _enablePage,
      _disablePage,
      _togglePage
    } = getMethods(element);
    _disablePage(pageNum); // initial state

    this.do = () => _enablePage(pageNum);
    this.undo = () => _disablePage(pageNum);
    this[MC.S_TOGGLE] = () => _togglePage(pageNum);
  }
}

/**
 * Disables or enables the given page of the {@link Pager} widget setup for the
 * given element.
 *
 * **IMPORTANT:** When constructed, it enables the given page as a form of
 * initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "disable-page".
 * - Accepted string arguments: the number of the target page
 * - Accepted options: none
 *
 * @example
 * ```html
 * <button id="myDisableButton"></button>
 * <div class="lisn-pager" data-lisn-on-click="@disable-page:2 +target=#myDisableButton"></div>
 * ```
 *
 * @category Controlling pagers
 */
exports.EnablePage = EnablePage;
class DisablePage {
  static register() {
    (0, _action.registerAction)("disable-page", (element, args) => new DisablePage(element, (0, _math.toInt)(args[0])));
  }
  constructor(element, pageNum) {
    /**
     * Disables the page number given to the constructor. Numbers start at 1.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Enables the page number given to the constructor. Numbers start at 1.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Disables the page number given to the constructor, if it is enabled,
     * otherwise enables it. Numbers start at 1.
     */
    _defineProperty(this, "toggle", void 0);
    if (!pageNum) {
      throw MH.usageError("Target page number is required");
    }
    const {
      _enablePage,
      _disablePage,
      _togglePage
    } = getMethods(element);
    _enablePage(pageNum); // initial state

    this.do = () => _disablePage(pageNum);
    this.undo = () => _enablePage(pageNum);
    this[MC.S_TOGGLE] = () => _togglePage(pageNum);
  }
}

// --------------------
exports.DisablePage = DisablePage;
const getMethods = element => {
  let lastPageNum = null;
  const nextPage = widget => widget === null || widget === void 0 ? void 0 : widget.nextPage();
  const prevPage = widget => widget === null || widget === void 0 ? void 0 : widget.prevPage();
  const goToPage = async (widget, pageNum, altPageNum) => {
    const currentNum = widget === null || widget === void 0 ? void 0 : widget.getCurrentPageNum();
    let targetNum = currentNum === pageNum ? altPageNum : pageNum;
    if (targetNum === -1) {
      targetNum = lastPageNum;
    }
    if (targetNum) {
      if (pageNum !== -1) {
        // save the current number unless this is "undo"
        lastPageNum = currentNum;
      }
      await (widget === null || widget === void 0 ? void 0 : widget.goToPage(targetNum));
    }
  };
  const enablePage = (widget, pageNum) => widget === null || widget === void 0 ? void 0 : widget.enablePage(pageNum);
  const disablePage = (widget, pageNum) => widget === null || widget === void 0 ? void 0 : widget.disablePage(pageNum);
  const togglePage = (widget, pageNum) => widget === null || widget === void 0 ? void 0 : widget.togglePage(pageNum);
  const widgetPromise = (0, _widget.fetchUniqueWidget)("pager", element, _pager.Pager);
  return {
    _nextPage: () => widgetPromise.then(nextPage),
    _prevPage: () => widgetPromise.then(prevPage),
    _goToPage: (pageNum, altPageNum = null) => widgetPromise.then(w => goToPage(w, pageNum, altPageNum)),
    _enablePage: pageNum => widgetPromise.then(w => enablePage(w, pageNum)),
    _disablePage: pageNum => widgetPromise.then(w => disablePage(w, pageNum)),
    _togglePage: pageNum => widgetPromise.then(w => togglePage(w, pageNum))
  };
};
//# sourceMappingURL=pager.cjs.map