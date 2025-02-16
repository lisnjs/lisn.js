function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Actions
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { iterateAnimations, resetCssAnimationsNow } from "../utils/animations.js";
import { hasClass, addClassesNow, removeClasses, removeClassesNow } from "../utils/css-alter.js";
import { isPageReady, waitForPageReady } from "../utils/dom-events.js";
import { formatAsString } from "../utils/text.js";
import { registerAction } from "./action.js";
import debug from "../debug/debug.js";
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
export class Animate {
  static register() {
    registerAction("animate", element => new Animate(element));
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
    const logger = debug ? new debug.Logger({
      name: `Animate-${formatAsString(element)}`
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

const GO_FORWARD = 0;
const GO_BACKWARD = 1;
const GO_TOGGLE = 2;
const animate = (element, direction, logger, isInitial = false) => {
  debug: logger === null || logger === void 0 || logger.debug8("Animating element");
  return iterateAnimations(element, /* istanbul ignore next */ // jsdom doesn't support Web Animations
  animation => setupAnimation(animation, direction, logger, isInitial), element => setupAnimationLegacy(element, direction, logger, isInitial), isInitial);
};

/* istanbul ignore next */ // jsdom doesn't support Web Animations
const setupAnimation = (animation, direction, logger, isInitial) => {
  const pauseTillReady = !isPageReady();
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
      waitForPageReady().then(() => {
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
  const isBackward = hasClass(element, MC.PREFIX_ANIMATE_REVERSE);
  const isPaused = hasClass(element, MC.PREFIX_ANIMATE_PAUSE);
  const pauseTillReady = !isPageReady();
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
  resetCssAnimationsNow(element);
  removeClassesNow(element, MC.PREFIX_ANIMATE_PAUSE, MC.PREFIX_ANIMATE_REVERSE);
  addClassesNow(element, ...(goBackwards ? [MC.PREFIX_ANIMATE_REVERSE] : []), ...(doPause ? [MC.PREFIX_ANIMATE_PAUSE] : []));
  if (!isInitial && pauseTillReady) {
    waitForPageReady().then(() => removeClasses(element, MC.PREFIX_ANIMATE_PAUSE));
  }
};
//# sourceMappingURL=animate.js.map