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
 * @categoryDescription Animation
 * {@link AnimatePlay} and {@link AnimatePause} resume or pause all animations
 * on the given element. They work with CSS or Web Animations.
 *
 * {@link Actions.Animate | Animate} plays or reverses all animations on the
 * given element. It works with CSS or Web Animations.
 */

import * as MC from "../globals/minification-constants.js";
import { iterateAnimations, resetCssAnimationsNow } from "../utils/animations.js";
import { hasClass, addClassesNow, removeClassesNow } from "../utils/css-alter.js";
import { registerAction } from "./action.js";

/**
 * Resumes or pauses all animations on the given element.
 *
 * It works with CSS or Web Animations.
 *
 * **IMPORTANT:** When constructed, it resets and pauses the animations as a
 * form of initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "animate-play".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <button id="btn">Play/pause</button>
 * <div data-lisn-on-click="@animate-play +target=#btn"></div>
 * ```
 *
 * @category Animation
 */
export var AnimatePlay = /*#__PURE__*/function () {
  function AnimatePlay(element) {
    _classCallCheck(this, AnimatePlay);
    /**
     * Resumes the animations without resetting them.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Pauses the animations without resetting them.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Resumes the animations if paused, otherwise pauses them.
     */
    _defineProperty(this, "toggle", void 0);
    var _getMethods = getMethods(element),
      _play = _getMethods._play,
      _pause = _getMethods._pause,
      _toggle = _getMethods._toggle;

    // initial state is 0% and paused
    animate(element, PAUSE, true);
    this["do"] = _play;
    this.undo = _pause;
    this[MC.S_TOGGLE] = _toggle;
  }
  return _createClass(AnimatePlay, null, [{
    key: "register",
    value: function register() {
      registerAction("animate-play", function (element) {
        return new AnimatePlay(element);
      });
    }
  }]);
}();

/**
 * Pauses or resumes all animations on the given element.
 *
 * It works with CSS or Web Animations.
 *
 * **IMPORTANT:** When constructed, it plays the animations as a form of
 * initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "animate-pause".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <button id="btn">Play/pause</button>
 * <div data-lisn-on-click="@animate-pause +target=#btn"></div>
 * ```
 *
 * @category Animation
 */
export var AnimatePause = /*#__PURE__*/function () {
  function AnimatePause(element) {
    _classCallCheck(this, AnimatePause);
    /**
     * Pauses the animations without resetting them.
     */
    _defineProperty(this, "do", void 0);
    /**
     * Resumes the animations without resetting them.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Resumes the animations if paused, otherwise pauses them.
     */
    _defineProperty(this, "toggle", void 0);
    var _getMethods2 = getMethods(element),
      _play = _getMethods2._play,
      _pause = _getMethods2._pause,
      _toggle = _getMethods2._toggle;

    // Initial state is playing
    _play();
    this["do"] = _pause;
    this.undo = _play;
    this[MC.S_TOGGLE] = _toggle;
  }
  return _createClass(AnimatePause, null, [{
    key: "register",
    value: function register() {
      registerAction("animate-pause", function (element) {
        return new AnimatePause(element);
      });
    }
  }]);
}();

// --------------------

var PLAY = 0;
var PAUSE = 1;
var TOGGLE = 2;
var getMethods = function getMethods(element) {
  return {
    _play: function _play() {
      return animate(element, PLAY);
    },
    _pause: function _pause() {
      return animate(element, PAUSE);
    },
    _toggle: function _toggle() {
      return animate(element, TOGGLE);
    }
  };
};
var animate = function animate(element, action) {
  var isInitial = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return iterateAnimations(element, /* istanbul ignore next */ // jsdom doesn't support Web Animations
  function (animation) {
    var isPaused = animation.playState === "paused";
    if (action === PLAY || isPaused && action === TOGGLE) {
      animation.play();
    } else {
      animation.pause();
    }
  }, function (element) {
    if (isInitial) {
      resetCssAnimationsNow(element);
    }
    var isPaused = hasClass(element, MC.PREFIX_ANIMATE_PAUSE);
    if (action === PLAY || isPaused && action === TOGGLE) {
      removeClassesNow(element, MC.PREFIX_ANIMATE_PAUSE);
    } else {
      addClassesNow(element, MC.PREFIX_ANIMATE_PAUSE);
    }
  }, isInitial);
};
//# sourceMappingURL=animate-play.js.map