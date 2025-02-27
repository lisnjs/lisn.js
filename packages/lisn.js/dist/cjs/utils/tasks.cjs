"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForDelay = exports.scheduleHighPriorityTask = exports.getDebouncedHandler = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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
exports.waitForDelay = waitForDelay;
//# sourceMappingURL=tasks.cjs.map