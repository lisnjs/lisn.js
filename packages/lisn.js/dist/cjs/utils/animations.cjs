"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.animationFrameIterator = animationFrameIterator;
exports.waitForAnimationFrame = exports.resetCssAnimationsNow = exports.onEveryAnimationFrame = exports.iterateAnimations = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _cssAlter = require("./css-alter.cjs");
var _domOptimize = require("./dom-optimize.cjs");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _awaitAsyncGenerator(e) { return new _OverloadYield(e, 0); }
function _wrapAsyncGenerator(e) { return function () { return new AsyncGenerator(e.apply(this, arguments)); }; }
function AsyncGenerator(e) { var r, t; function resume(r, t) { try { var n = e[r](t), o = n.value, u = o instanceof _OverloadYield; Promise.resolve(u ? o.v : o).then(function (t) { if (u) { var i = "return" === r ? "return" : "next"; if (!o.k || t.done) return resume(i, t); t = e[i](t).value; } settle(n.done ? "return" : "normal", t); }, function (e) { resume("throw", e); }); } catch (e) { settle("throw", e); } } function settle(e, n) { switch (e) { case "return": r.resolve({ value: n, done: !0 }); break; case "throw": r.reject(n); break; default: r.resolve({ value: n, done: !1 }); } (r = r.next) ? resume(r.key, r.arg) : t = null; } this._invoke = function (e, n) { return new Promise(function (o, u) { var i = { key: e, arg: n, resolve: o, reject: u, next: null }; t ? t = t.next = i : (r = t = i, resume(e, n)); }); }, "function" != typeof e.return && (this.return = void 0); }
AsyncGenerator.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function () { return this; }, AsyncGenerator.prototype.next = function (e) { return this._invoke("next", e); }, AsyncGenerator.prototype.throw = function (e) { return this._invoke("throw", e); }, AsyncGenerator.prototype.return = function (e) { return this._invoke("return", e); };
function _OverloadYield(e, d) { this.v = e, this.k = d; }
function _asyncIterator(r) { var n, t, o, e = 2; for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) { if (t && null != (n = r[t])) return n.call(r); if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r)); t = "@@asyncIterator", o = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(r) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var n = r.done; return Promise.resolve(r.value).then(function (r) { return { value: r, done: n }; }); } return AsyncFromSyncIterator = function (r) { this.s = r, this.n = r.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function () { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function (r) { var n = this.s.return; return void 0 === n ? Promise.resolve({ value: r, done: !0 }) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); }, throw: function (r) { var n = this.s.return; return void 0 === n ? Promise.reject(r) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(r); } /**
 * @module Utils
 */
/**
 * The callback is passed two arguments:
 * 1. The total elapsed time in milliseconds since the start
 * 2. The elapsed time in milliseconds since the previous frame
 *
 * The first time this callback is called both of these will be 0.
 *
 * The callback must return `true` if it wants to animate again on the next
 * frame and `false` if done.
 */

/**
 * Returns a promise that resolves at the next animation frame. Async/await
 * version of requestAnimationFrame.
 *
 * @returns The timestamp gotten from requestAnimationFrame
 *
 * @category Animations
 */
const waitForAnimationFrame = async () => MH.newPromise(resolve => {
  MH.onAnimationFrame(resolve);
});

/**
 * Calls the given callback on every animation frame.
 *
 * The returned Promise resolves when the callback is done (returns `false`).
 *
 * @see {@link AnimationCallback}
 *
 * @since v1.2.0
 *
 * @category Animations
 */
exports.waitForAnimationFrame = waitForAnimationFrame;
const onEveryAnimationFrame = async callback => {
  var _iteratorAbruptCompletion = false;
  var _didIteratorError = false;
  var _iteratorError;
  try {
    for (var _iterator = _asyncIterator(animationFrameIterator()), _step; _iteratorAbruptCompletion = !(_step = await _iterator.next()).done; _iteratorAbruptCompletion = false) {
      const [totalElapsed, elapsedSinceLast] = _step.value;
      {
        const shouldRepeat = callback(totalElapsed, elapsedSinceLast);
        if (!shouldRepeat) {
          break;
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (_iteratorAbruptCompletion && _iterator.return != null) {
        await _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

/**
 * Generator version of {@link onEveryAnimationFrame}.
 *
 * Returns a new async iterator which yields the total elapsed time and elapsed
 * time since the last call on every animation frame.
 *
 * @example
 * ```javascript
 * for await (const [totalElapsed, elapsedSinceLast] of animationFrameIterator()) {
 *   // ... do something
 *   if (done) break;
 * }
 * ```
 *
 * @since v1.2.0
 *
 * @category Animations
 */
exports.onEveryAnimationFrame = onEveryAnimationFrame;
function animationFrameIterator() {
  return _animationFrameIterator.apply(this, arguments);
}
/**
 * @param webAnimationCallback This function is called for each
 *                             {@link https://developer.mozilla.org/en-US/docs/Web/API/Animation | Animation}
 *                             on the element. It {@link waitForMeasureTime}
 *                             before reading the animations.
 * @param legacyCallback       This function is called if the browser does not
 *                             support the Web Animations API. It is called
 *                             after {@link waitForMutateTime} so it can safely
 *                             modify styles.
 * @param realtime             If true, then it does not
 *                             {@link waitForMeasureTime} or
 *                             {@link waitForMutateTime} and runs
 *                             synchronously.
 *
 * @category Animations
 */
function _animationFrameIterator() {
  _animationFrameIterator = _wrapAsyncGenerator(function* () {
    let startTime, previousTimeStamp;
    const step = async () => {
      const timeStamp = await waitForAnimationFrame();
      if (!startTime) {
        startTime = timeStamp;
        previousTimeStamp = timeStamp;
      }
      const totalElapsed = timeStamp - startTime;
      const elapsedSinceLast = timeStamp - previousTimeStamp;
      previousTimeStamp = timeStamp;
      return [totalElapsed, elapsedSinceLast];
    };
    while (true) {
      yield step();
    }
  });
  return _animationFrameIterator.apply(this, arguments);
}
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