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

import * as MC from "@lisn/globals/minification-constants";

import {
  iterateAnimations,
  resetCssAnimationsNow,
} from "@lisn/utils/animations";
import {
  hasClass,
  addClassesNow,
  removeClassesNow,
} from "@lisn/utils/css-alter";

import { Action, registerAction } from "@lisn/actions/action";

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
export class AnimatePlay implements Action {
  /**
   * Resumes the animations without resetting them.
   */
  readonly do: () => Promise<void>;

  /**
   * Pauses the animations without resetting them.
   */
  readonly undo: () => Promise<void>;

  /**
   * Resumes the animations if paused, otherwise pauses them.
   */
  readonly toggle: () => Promise<void>;

  static register() {
    registerAction("animate-play", (element) => new AnimatePlay(element));
  }

  constructor(element: Element) {
    const { _play, _pause, _toggle } = getMethods(element);

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
export class AnimatePause implements Action {
  /**
   * Pauses the animations without resetting them.
   */
  readonly do: () => Promise<void>;

  /**
   * Resumes the animations without resetting them.
   */
  readonly undo: () => Promise<void>;

  /**
   * Resumes the animations if paused, otherwise pauses them.
   */
  readonly toggle: () => Promise<void>;

  static register() {
    registerAction("animate-pause", (element) => new AnimatePause(element));
  }

  constructor(element: Element) {
    const { _play, _pause, _toggle } = getMethods(element);

    // Initial state is playing
    _play();

    this.do = _pause;
    this.undo = _play;
    this[MC.S_TOGGLE] = _toggle;
  }
}

// --------------------

type AnimateAction = typeof PLAY | typeof PAUSE | typeof TOGGLE;

const PLAY = 0;
const PAUSE = 1;
const TOGGLE = 2;

const getMethods = (element: Element) => {
  return {
    _play: () => animate(element, PLAY),
    _pause: () => animate(element, PAUSE),
    _toggle: () => animate(element, TOGGLE),
  };
};

const animate = (
  element: Element,
  action: AnimateAction,
  isInitial = false,
) => {
  return iterateAnimations(
    element,
    /* istanbul ignore next */ // jsdom doesn't support Web Animations
    (animation) => {
      const isPaused = animation.playState === "paused";
      if (action === PLAY || (isPaused && action === TOGGLE)) {
        animation.play();
      } else {
        animation.pause();
      }
    },
    (element) => {
      if (isInitial) {
        resetCssAnimationsNow(element);
      }

      const isPaused = hasClass(element, MC.PREFIX_ANIMATE_PAUSE);
      if (action === PLAY || (isPaused && action === TOGGLE)) {
        removeClassesNow(element, MC.PREFIX_ANIMATE_PAUSE);
      } else {
        addClassesNow(element, MC.PREFIX_ANIMATE_PAUSE);
      }
    },
    isInitial,
  );
};
