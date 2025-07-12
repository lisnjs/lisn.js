"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnimatePlay = exports.AnimatePause = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var _animations = require("../utils/animations.cjs");
var _cssAlter = require("../utils/css-alter.cjs");
var _action = require("./action.cjs");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Actions
 *
 * @categoryDescription Animation
 * {@link AnimatePlay} and {@link AnimatePause} resume or pause all animations
 * on the given element. They work with CSS or Web Animations.
 *
 * {@link Actions.Animate | Animate} plays or reverses all animations on the
 * given element. It works with CSS or Web Animations.
 */
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
class AnimatePlay {
  static register() {
    (0, _action.registerAction)("animate-play", element => new AnimatePlay(element));
  }
  constructor(element) {
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
    const {
      _play,
      _pause,
      _toggle
    } = getMethods(element);

    // initial state is 0% and paused
    animate(element, PAUSE, true);
    this.do = _play;
    this.undo = _pause;
    this[MC.S_TOGGLE] = _toggle;
  }
}

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
exports.AnimatePlay = AnimatePlay;
class AnimatePause {
  static register() {
    (0, _action.registerAction)("animate-pause", element => new AnimatePause(element));
  }
  constructor(element) {
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
    const {
      _play,
      _pause,
      _toggle
    } = getMethods(element);

    // Initial state is playing
    _play();
    this.do = _pause;
    this.undo = _play;
    this[MC.S_TOGGLE] = _toggle;
  }
}

// --------------------
exports.AnimatePause = AnimatePause;
const PLAY = 0;
const PAUSE = 1;
const TOGGLE = 2;
const getMethods = element => {
  return {
    _play: () => animate(element, PLAY),
    _pause: () => animate(element, PAUSE),
    _toggle: () => animate(element, TOGGLE)
  };
};
const animate = (element, action, isInitial = false) => {
  return (0, _animations.iterateAnimations)(element, /* istanbul ignore next */ // jsdom doesn't support Web Animations
  animation => {
    const isPaused = animation.playState === "paused";
    if (action === PLAY || isPaused && action === TOGGLE) {
      animation.play();
    } else {
      animation.pause();
    }
  }, element => {
    if (isInitial) {
      (0, _animations.resetCssAnimationsNow)(element);
    }
    const isPaused = (0, _cssAlter.hasClass)(element, MC.PREFIX_ANIMATE_PAUSE);
    if (action === PLAY || isPaused && action === TOGGLE) {
      (0, _cssAlter.removeClassesNow)(element, MC.PREFIX_ANIMATE_PAUSE);
    } else {
      (0, _cssAlter.addClassesNow)(element, MC.PREFIX_ANIMATE_PAUSE);
    }
  }, isInitial);
};
//# sourceMappingURL=animate-play.cjs.map