function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
export class AnimatePlay {
  static register() {
    registerAction("animate-play", element => new AnimatePlay(element));
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
export class AnimatePause {
  static register() {
    registerAction("animate-pause", element => new AnimatePause(element));
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
  return iterateAnimations(element, /* istanbul ignore next */ // jsdom doesn't support Web Animations
  animation => {
    const isPaused = animation.playState === "paused";
    if (action === PLAY || isPaused && action === TOGGLE) {
      animation.play();
    } else {
      animation.pause();
    }
  }, element => {
    if (isInitial) {
      resetCssAnimationsNow(element);
    }
    const isPaused = hasClass(element, MC.PREFIX_ANIMATE_PAUSE);
    if (action === PLAY || isPaused && action === TOGGLE) {
      removeClassesNow(element, MC.PREFIX_ANIMATE_PAUSE);
    } else {
      addClassesNow(element, MC.PREFIX_ANIMATE_PAUSE);
    }
  }, isInitial);
};
//# sourceMappingURL=animate-play.js.map