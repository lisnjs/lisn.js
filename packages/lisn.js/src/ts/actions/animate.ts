/**
 * @module Actions
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import {
  iterateAnimations,
  resetCssAnimationsNow,
} from "@lisn/utils/animations";
import {
  hasClass,
  addClassesNow,
  removeClasses,
  removeClassesNow,
} from "@lisn/utils/css-alter";
import { isPageReady, waitForPageReady } from "@lisn/utils/dom-events";
import { formatAsString } from "@lisn/utils/text";

import { Action, registerAction } from "@lisn/actions/action";

import debug from "@lisn/debug/debug";
import { LoggerInterface } from "@lisn/debug/types";

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
 * - Arguments: none
 * - Options: none
 *
 * @example
 * ```html
 * <div data-lisn-on-view="@animate"></div>
 * ```
 *
 * @category Animation
 */
export class Animate implements Action {
  /**
   * (Re)plays the animations forwards.
   */
  readonly do: () => Promise<void>;

  /**
   * (Re)plays the animations backwards.
   */
  readonly undo: () => Promise<void>;

  /**
   * Reverses the animations from its current direction.
   */
  readonly toggle: () => Promise<void>;

  static register() {
    registerAction("animate", (element) => new Animate(element));
  }

  constructor(element: Element) {
    const logger = debug
      ? new debug.Logger({
          name: `Animate-${formatAsString(element)}`,
        })
      : null;

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

type AnimateDirection =
  | typeof GO_FORWARD
  | typeof GO_BACKWARD
  | typeof GO_TOGGLE;

const GO_FORWARD = 0;
const GO_BACKWARD = 1;
const GO_TOGGLE = 2;

const animate = (
  element: Element,
  direction: AnimateDirection,
  logger: LoggerInterface | null,
  isInitial = false,
) => {
  debug: logger?.debug8("Animating element");
  return iterateAnimations(
    element,
    /* istanbul ignore next */ // jsdom doesn't support Web Animations
    (animation) => setupAnimation(animation, direction, logger, isInitial),
    (element) => setupAnimationLegacy(element, direction, logger, isInitial),
    isInitial,
  );
};

/* istanbul ignore next */ // jsdom doesn't support Web Animations
const setupAnimation = (
  animation: Animation,
  direction: AnimateDirection,
  logger: LoggerInterface | null,
  isInitial: boolean,
) => {
  const pauseTillReady = !isPageReady();
  const isBackward = animation.playbackRate === -1;

  debug: logger?.debug9("Setting up animation", animation, {
    direction,
    isBackward,
  });

  if (
    direction === GO_TOGGLE ||
    (direction === GO_FORWARD && isBackward) ||
    (direction === GO_BACKWARD && !isBackward)
  ) {
    debug: logger?.debug9("Reversing animation", animation.playState);
    animation.reverse();
  } else if (animation.playState === "paused") {
    debug: logger?.debug9("Playing animation", animation.playState);
    animation.play();
  } else {
    debug: logger?.debug9(
      "Animation has played or is playing already",
      animation.playState,
    );
  }

  if (isInitial || pauseTillReady) {
    debug: logger?.debug9("Pausing animation", animation.playState);
    animation.pause();

    if (!isInitial) {
      // we were only pausing until ready
      /* istanbul ignore next */
      waitForPageReady().then(() => {
        debug: logger?.debug9("Restarting animation", animation.playState);
        animation.play();
      });
    }
  }

  // If the element is moved (including if wrapped, such as by the ViewTrigger),
  // this will cancel CSS animations and replace them with new running ones
  if (MH.isCSSAnimation(animation)) {
    const cancelHandler = (event: AnimationPlaybackEvent) =>
      onAnimationCancel(event, animation, direction, logger, isInitial);

    animation.addEventListener(MC.S_CANCEL, cancelHandler);
    animation.addEventListener("finish", () =>
      animation.removeEventListener(MC.S_CANCEL, cancelHandler),
    );
  }
};

/* istanbul ignore next */ // jsdom doesn't support Web Animations
const onAnimationCancel = (
  event: AnimationPlaybackEvent,
  animation: CSSAnimation,
  direction: AnimateDirection,
  logger: LoggerInterface | null,
  isInitial: boolean,
) => {
  // setup again the new animation
  debug: logger?.debug9("Animation cancelled, re-setting up new one");
  const target = MH.targetOf(event);
  if (!MH.isAnimation(target)) {
    return;
  }

  const effect = target.effect;
  if (!MH.isKeyframeEffect(effect)) {
    return;
  }

  for (const newAnimation of MH.targetOf(effect)?.getAnimations() || []) {
    if (
      MH.isCSSAnimation(newAnimation) &&
      newAnimation.animationName === animation.animationName
    ) {
      setupAnimation(newAnimation, direction, logger, isInitial);
      break;
    }
  }
};

const setupAnimationLegacy = (
  element: Element,
  direction: AnimateDirection,
  logger: LoggerInterface | null,
  isInitial: boolean,
) => {
  const isBackward = hasClass(element, MC.PREFIX_ANIMATE_REVERSE);
  const isPaused = hasClass(element, MC.PREFIX_ANIMATE_PAUSE);

  const pauseTillReady = !isPageReady();

  const goBackwards =
    direction === GO_BACKWARD || (direction === GO_TOGGLE && !isBackward);

  const doPause = isInitial || pauseTillReady;

  debug: logger?.debug9("Setting up legacy animations", element, {
    direction,
    isBackward,
    isPaused,
    goBackwards,
    doPause,
  });

  if (goBackwards === isBackward && doPause === isPaused) {
    // nothing to do
    debug: logger?.debug9("No need to reset or pause animation");
    return;
  }

  resetCssAnimationsNow(element);

  removeClassesNow(element, MC.PREFIX_ANIMATE_PAUSE, MC.PREFIX_ANIMATE_REVERSE);
  addClassesNow(
    element,
    ...(goBackwards ? [MC.PREFIX_ANIMATE_REVERSE] : []),
    ...(doPause ? [MC.PREFIX_ANIMATE_PAUSE] : []),
  );

  if (!isInitial && pauseTillReady) {
    waitForPageReady().then(() =>
      removeClasses(element, MC.PREFIX_ANIMATE_PAUSE),
    );
  }
};
