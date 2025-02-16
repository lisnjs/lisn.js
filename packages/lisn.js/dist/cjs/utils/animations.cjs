"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetCssAnimationsNow = exports.iterateAnimations = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _cssAlter = require("./css-alter.cjs");
var _domOptimize = require("./dom-optimize.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * @module Utils
 */

/**
 * @param {} webAnimationCallback This function is called for each
 *                                {@link https://developer.mozilla.org/en-US/docs/Web/API/Animation | Animation}
 *                                on the element. It {@link waitForMeasureTime}
 *                                before reading the animations.
 * @param {} legacyCallback       This function is called if the browser does
 *                                not support the Web Animations API. It is
 *                                called after {@link waitForMutateTime} so it
 *                                can safely modify styles.
 * @param {} realtime             If true, then it does not
 *                                {@link waitForMeasureTime} or
 *                                {@link waitForMutateTime} and runs
 *                                synchronously.
 *
 * @category Animations
 */
const iterateAnimations = async (element, webAnimationCallback, legacyCallback, realtime = false) => {
  /* istanbul ignore next */ // jsdom doesn't support Web Animations
  if ("getAnimations" in element && (0, _cssAlter.getData)(element, MH.prefixName("test-legacy")) === null) {
    if (!realtime) {
      await (0, _domOptimize.waitForMeasureTime)();
    }
    for (const animation of element.getAnimations()) {
      webAnimationCallback(animation);
    }

    // Old browsers, no Animation API
  } else {
    if (!realtime) {
      await (0, _domOptimize.waitForMutateTime)();
    }
    legacyCallback(element);
  }
};

/**
 * @ignore
 * @internal
 */
exports.iterateAnimations = iterateAnimations;
const resetCssAnimationsNow = element => {
  (0, _cssAlter.addClassesNow)(element, MC.PREFIX_ANIMATE_DISABLE); // cause it to reset
  // If we remove the disable class immediately, then it will not have the
  // effect to reset the animation, since the browser won't see any change in
  // the classList at the start of the frame. So we ideally need to remove the
  // disable class after the next paint. However, depending on the animation,
  // and its state, disabling animation and waiting for the next animation
  // frame may cause a visible glitch, so we need to force layout now.
  /* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
  element[MC.S_CLIENT_WIDTH]; // forces layout

  (0, _cssAlter.removeClassesNow)(element, MC.PREFIX_ANIMATE_DISABLE);
};
exports.resetCssAnimationsNow = resetCssAnimationsNow;
//# sourceMappingURL=animations.cjs.map