"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Animate = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _animations = require("../utils/animations.cjs");
var _cssAlter = require("../utils/css-alter.cjs");
var _domEvents = require("../utils/dom-events.cjs");
var _text = require("../utils/text.cjs");
var _action = require("./action.cjs");
var _debug = _interopRequireDefault(require("../debug/debug.cjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Actions
 */
/**
 * Plays or reverses all animations on the given element.
 *
 * It works with CSS or Web Animations.
 *
 * **IMPORTANT:** When constructed, it resets and pauses the animations as a
 * form of initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "animate".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div data-lisn-on-view="@animate"></div>
 * ```
 *
 * @category Animation
 */
class Animate {
  static register() {
    (0, _action.registerAction)("animate", element => new Animate(element));
  }
  constructor(element) {
    /**
     * (Re)plays the animations forwards.
     */
    _defineProperty(this, "do", void 0);
    /**
     * (Re)plays the animations backwards.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Reverses the animations from its current direction.
     */
    _defineProperty(this, "toggle", void 0);
    const logger = _debug.default ? new _debug.default.Logger({
      name: `Animate-${(0, _text.formatAsString)(element)}`
    }) : null;

    // initial state is 0% and paused
    animate(element, GO_FORWARD, logger, true);
    let isFirst = true;
    this.do = () => animate(element, GO_FORWARD, logger);
    this.undo = () => animate(element, GO_BACKWARD, logger);
    this[MC.S_TOGGLE] = () => {
      const res = animate(element, isFirst ? GO_FORWARD : GO_TOGGLE, logger);
      isFirst = false;
      return res;
    };
  }
}

// --------------------
exports.Animate = Animate;
const GO_FORWARD = 0;
const GO_BACKWARD = 1;
const GO_TOGGLE = 2;
const animate = (element, direction, logger, isInitial = false) => {
  debug: logger === null || logger === void 0 || logger.debug8("Animating element");
  return (0, _animations.iterateAnimations)(element, /* istanbul ignore next */ // jsdom doesn't support Web Animations
  animation => setupAnimation(animation, direction, logger, isInitial), element => setupAnimationLegacy(element, direction, logger, isInitial), isInitial);
};

/* istanbul ignore next */ // jsdom doesn't support Web Animations
const setupAnimation = (animation, direction, logger, isInitial) => {
  const pauseTillReady = !(0, _domEvents.isPageReady)();
  const isBackward = animation.playbackRate === -1;
  debug: logger === null || logger === void 0 || logger.debug9("Setting up animation", animation, {
    direction,
    isBackward
  });
  if (direction === GO_TOGGLE || direction === GO_FORWARD && isBackward || direction === GO_BACKWARD && !isBackward) {
    debug: logger === null || logger === void 0 || logger.debug9("Reversing animation", animation.playState);
    animation.reverse();
  } else if (animation.playState === "paused") {
    debug: logger === null || logger === void 0 || logger.debug9("Playing animation", animation.playState);
    animation.play();
  } else {
    debug: logger === null || logger === void 0 || logger.debug9("Animation has played or is playing already", animation.playState);
  }
  if (isInitial || pauseTillReady) {
    debug: logger === null || logger === void 0 || logger.debug9("Pausing animation", animation.playState);
    animation.pause();
    if (!isInitial) {
      // we were only pausing until ready
      /* istanbul ignore next */
      (0, _domEvents.waitForPageReady)().then(() => {
        debug: logger === null || logger === void 0 || logger.debug9("Restarting animation", animation.playState);
        animation.play();
      });
    }
  }

  // If the element is moved (including if wrapped, such as by the ViewTrigger),
  // this will cancel CSS animations and replace them with new running ones
  if (MH.isInstanceOf(animation, CSSAnimation)) {
    const cancelHandler = event => onAnimationCancel(event, animation, direction, logger, isInitial);
    animation.addEventListener(MC.S_CANCEL, cancelHandler);
    animation.addEventListener("finish", () => animation.removeEventListener(MC.S_CANCEL, cancelHandler));
  }
};

/* istanbul ignore next */ // jsdom doesn't support Web Animations
const onAnimationCancel = (event, animation, direction, logger, isInitial) => {
  // setup again the new animation
  debug: logger === null || logger === void 0 || logger.debug9("Animation cancelled, re-setting up new one");
  const target = MH.targetOf(event);
  if (!MH.isInstanceOf(target, Animation)) {
    return;
  }
  const effect = target.effect;
  if (!MH.isInstanceOf(effect, KeyframeEffect)) {
    return;
  }
  for (const newAnimation of ((_MH$targetOf = MH.targetOf(effect)) === null || _MH$targetOf === void 0 ? void 0 : _MH$targetOf.getAnimations()) || []) {
    var _MH$targetOf;
    if (MH.isInstanceOf(newAnimation, CSSAnimation) && newAnimation.animationName === animation.animationName) {
      setupAnimation(newAnimation, direction, logger, isInitial);
      break;
    }
  }
};
const setupAnimationLegacy = (element, direction, logger, isInitial) => {
  const isBackward = (0, _cssAlter.hasClass)(element, MC.PREFIX_ANIMATE_REVERSE);
  const isPaused = (0, _cssAlter.hasClass)(element, MC.PREFIX_ANIMATE_PAUSE);
  const pauseTillReady = !(0, _domEvents.isPageReady)();
  const goBackwards = direction === GO_BACKWARD || direction === GO_TOGGLE && !isBackward;
  const doPause = isInitial || pauseTillReady;
  debug: logger === null || logger === void 0 || logger.debug9("Setting up legacy animations", element, {
    direction,
    isBackward,
    isPaused,
    goBackwards,
    doPause
  });
  if (goBackwards === isBackward && doPause === isPaused) {
    // nothing to do
    debug: logger === null || logger === void 0 || logger.debug9("No need to reset or pause animation");
    return;
  }
  (0, _animations.resetCssAnimationsNow)(element);
  (0, _cssAlter.removeClassesNow)(element, MC.PREFIX_ANIMATE_PAUSE, MC.PREFIX_ANIMATE_REVERSE);
  (0, _cssAlter.addClassesNow)(element, ...(goBackwards ? [MC.PREFIX_ANIMATE_REVERSE] : []), ...(doPause ? [MC.PREFIX_ANIMATE_PAUSE] : []));
  if (!isInitial && pauseTillReady) {
    (0, _domEvents.waitForPageReady)().then(() => (0, _cssAlter.removeClasses)(element, MC.PREFIX_ANIMATE_PAUSE));
  }
};
//# sourceMappingURL=animate.cjs.map