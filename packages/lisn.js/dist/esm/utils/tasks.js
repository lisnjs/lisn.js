/**
 * @module Utils
 */

import * as MH from "../globals/minification-helpers.js";

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
export const scheduleHighPriorityTask = task => {
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
export const getDebouncedHandler = (debounceWindow, handler) => {
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
export const waitForDelay = delay => MH.newPromise(resolve => {
  MH.setTimer(resolve, delay);
});

/**
 * Returns a promise that resolves at the next animation frame. Async/await
 * version of requestAnimationFrame.
 *
 * @returns The timestamp gotten from requestAnimationFrame
 *
 * @category Tasks
 */
export const waitForAnimationFrame = async () => MH.newPromise(resolve => {
  MH.onAnimationFrame(resolve);
});
//# sourceMappingURL=tasks.js.map