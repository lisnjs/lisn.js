"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.iterateAnimations = void 0;
exports.newAnimationFrameIterator = newAnimationFrameIterator;
exports.newCriticallyDampedAnimationIterator = newCriticallyDampedAnimationIterator;
exports.waitForAnimationFrame = exports.resetCssAnimationsNow = exports.onEveryAnimationFrame = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _cssAlter = require("./css-alter.cjs");
var _domOptimize = require("./dom-optimize.cjs");
var _math = require("./math.cjs");
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
 * The callback is as an argument the {@link ElapsedTimes | elapsed times}:
 * - The total elapsed time in milliseconds since the start
 * - The elapsed time in milliseconds since the previous frame
 *
 * The first time this callback is called both of these will be 0 unless seed
 * values were provided.
 *
 * The callback must return `true` if it wants to animate again on the next
 * frame and `false` if done.
 *
 * @since v1.2.0
 *
 * @category Animations
 */

/**
 * Returns a promise that resolves at the next animation frame. Async/await
 * version of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame | requestAnimationFrame}.
 *
 * @returns The timestamp gotten from `requestAnimationFrame`
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
 * @param callback  See {@link AnimationCallback}.
 * @param elapsed   Seed values to use as the total elapsed and elapsed since
 *                  last. Otherwise it will use the timestamp of the first frame
 *                  as the start, which will result in those values being 0 the
 *                  first time.
 *
 * @since v1.2.0
 *
 * @category Animations
 */
exports.waitForAnimationFrame = waitForAnimationFrame;
const onEveryAnimationFrame = async (callback, elapsed) => {
  var _iteratorAbruptCompletion = false;
  var _didIteratorError = false;
  var _iteratorError;
  try {
    for (var _iterator = _asyncIterator(newAnimationFrameIterator(elapsed)), _step; _iteratorAbruptCompletion = !(_step = await _iterator.next()).done; _iteratorAbruptCompletion = false) {
      elapsed = _step.value;
      {
        const shouldRepeat = callback(elapsed);
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
 * for await (const elapsed of newAnimationFrameIterator()) {
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
function newAnimationFrameIterator(_x) {
  return _newAnimationFrameIterator.apply(this, arguments);
}
/**
 * Returns an animation iterator based on {@link criticallyDamped} that starts
 * at the given position `l`, with velocity `v = 0` and time `t = 0` and yields
 * the new position and velocity, and total time at every animation frame.
 *
 * @param [settings.l]         The initial starting position.
 * @param [settings.lTarget]   The initial target position. Can be updated when
 *                             calling next().
 * @param [settings.lag]       See {@link criticallyDamped}.
 * @param [settings.precision] See {@link criticallyDamped}.
 *
 * @returns An iterator whose `next` method accepts an optional new `lTarget`.
 * The iterator yields an object containing successive values for:
 * - position (`l`)
 * - velocity (`v`)
 * - total time elapsed (`t`)
 *
 * @example
 * If you never need to update the target you can use a for await loop:
 *
 * ```javascript
 * const iterator = newCriticallyDampedAnimationIterator({
 *   l: 10,
 *   lTarget: 100,
 *   lag: 1500
 * });
 *
 * for await (const { l, v, t } of iterator) {
 *   console.log({ l, v, t });
 * }
 * ```
 *
 * @example
 * If you do need to update the target, then call `next` explicitly:
 *
 * ```javascript
 * const iterator = newCriticallyDampedAnimationIterator({
 *   l: 10,
 *   lTarget: 100,
 *   lag: 1500
 * });
 *
 * let { value: { l, v, t } } = await iterator.next();
 * ({ value: { l, v, t } } = await iterator.next()); // updated
 * ({ value: { l, v, t } } = await iterator.next(200)); // updated towards a new target
 * ```
 *
 * @since v1.2.0
 *
 * @category Animations
 */
function _newAnimationFrameIterator() {
  _newAnimationFrameIterator = _wrapAsyncGenerator(function* (elapsed) {
    let startTime, previousTimeStamp;
    const {
      total: totalSeed = 0,
      sinceLast: sinceLastSeed = 0
    } = elapsed !== null && elapsed !== void 0 ? elapsed : {};
    const step = async () => {
      const timeStamp = await waitForAnimationFrame();
      if (!startTime || !previousTimeStamp) {
        // First time
        startTime = timeStamp - totalSeed;
        previousTimeStamp = timeStamp - sinceLastSeed;
      }
      const totalElapsed = timeStamp - startTime;
      const elapsedSinceLast = timeStamp - previousTimeStamp;
      previousTimeStamp = timeStamp;
      return {
        total: totalElapsed,
        sinceLast: elapsedSinceLast
      };
    };
    while (true) {
      yield step();
    }
  });
  return _newAnimationFrameIterator.apply(this, arguments);
}
function newCriticallyDampedAnimationIterator(_x2) {
  return _newCriticallyDampedAnimationIterator.apply(this, arguments);
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
function _newCriticallyDampedAnimationIterator() {
  _newCriticallyDampedAnimationIterator = _wrapAsyncGenerator(function* (settings) {
    let {
      l,
      lTarget
    } = settings;
    const {
      lag
    } = settings;
    let v = 0,
      t = 0,
      dt = 0;
    const next = async () => {
      ({
        l,
        v
      } = (0, _math.criticallyDamped)({
        l,
        v,
        lTarget,
        dt,
        lag
      }));
      return {
        l,
        v,
        t
      };
    };
    var _iteratorAbruptCompletion2 = false;
    var _didIteratorError2 = false;
    var _iteratorError2;
    try {
      for (var _iterator2 = _asyncIterator(newAnimationFrameIterator()), _step2; _iteratorAbruptCompletion2 = !(_step2 = yield _awaitAsyncGenerator(_iterator2.next())).done; _iteratorAbruptCompletion2 = false) {
        ({
          total: t,
          sinceLast: dt
        } = _step2.value);
        {
          var _next;
          if (dt === 0) {
            continue;
          }
          lTarget = yield (_next = next()) !== null && _next !== void 0 ? _next : lTarget;
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (_iteratorAbruptCompletion2 && _iterator2.return != null) {
          yield _awaitAsyncGenerator(_iterator2.return());
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
    throw null; // tell TypeScript it will never end
  });
  return _newCriticallyDampedAnimationIterator.apply(this, arguments);
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