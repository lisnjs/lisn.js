"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForDelay = exports.waitForAnimationFrame = exports.scheduleHighPriorityTask = exports.getDebouncedHandler = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * @module Utils
 */

/**
 * @category Tasks
 */

/**
 * @category Tasks
 */

/**
 * @category Tasks
 */

/* eslint-disable-next-line no-var */

/**
 * Schedules a task with high priority to be executed as soon as possible.
 *
 * It uses {@link https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/postTask | Scheduler:postTask}
 * if available, otherwise falls back to
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel | MessageChannel}.
 *
 * @category Tasks
 */
const scheduleHighPriorityTask = task => {
  if (typeof scheduler !== "undefined") {
    scheduler.postTask(task, {
      priority: "user-blocking"
    });
  } else {
    // Fallback to MessageChannel
    const channel = new MessageChannel();
    channel.port1.onmessage = () => {
      channel.port1.close();
      task();
    };
    channel.port2.postMessage("");
  }
};

/**
 * Returns a wrapper around the given handler that is debounced by the given
 * debounce window.
 *
 * @category Tasks
 */
exports.scheduleHighPriorityTask = scheduleHighPriorityTask;
const getDebouncedHandler = (debounceWindow, handler) => {
  if (!debounceWindow) {
    return handler;
  }
  let timer = null;
  let lastArgs;
  return (...args) => {
    lastArgs = args;
    if (timer === null) {
      timer = MH.setTimer(async () => {
        await handler(...lastArgs);
        timer = null;
      }, debounceWindow);
    }
  };
};

/**
 * Returns a promise that resolves at least the given number of delay (in
 * milliseconds) later. Uses `setTimeout`.
 *
 * @category Tasks
 */
exports.getDebouncedHandler = getDebouncedHandler;
const waitForDelay = delay => MH.newPromise(resolve => {
  MH.setTimer(resolve, delay);
});

/**
 * Returns a promise that resolves at the next animation frame. Async/await
 * version of requestAnimationFrame.
 *
 * @returns {} The timestamp gotten from requestAnimationFrame
 *
 * @category Tasks
 */
exports.waitForDelay = waitForDelay;
const waitForAnimationFrame = async () => MH.newPromise(resolve => {
  MH.onAnimationFrame(resolve);
});
exports.waitForAnimationFrame = waitForAnimationFrame;
//# sourceMappingURL=tasks.cjs.map