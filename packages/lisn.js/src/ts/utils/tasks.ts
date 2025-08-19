/**
 * @module Utils
 */

import * as _ from "@lisn/_internal";

/**
 * @category Tasks
 */
export type SchedulerPostTaskOptions = {
  delay?: number;
  priority?: TaskPriority;
  signal?: AbortSignal;
};

/**
 * @category Tasks
 */
export type Scheduler = {
  postTask<T, P extends readonly unknown[] | []>(
    callback: (...params: P) => T,
    options?: SchedulerPostTaskOptions,
    ...args: P
  ): Promise<T>;
};

/**
 * @category Tasks
 */
export type TaskPriority = "user-blocking" | "user-visible" | "background";

/* eslint-disable-next-line no-var */
declare var scheduler: Scheduler;

/**
 * Schedules a task with high priority to be executed as soon as possible.
 *
 * It uses {@link https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/postTask | Scheduler:postTask}
 * if available, otherwise falls back to
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel | MessageChannel}.
 *
 * @category Tasks
 */
export const scheduleHighPriorityTask = (task: () => void) => {
  if (typeof scheduler !== "undefined") {
    scheduler.postTask(task, {
      priority: "user-blocking",
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
export const getDebouncedHandler = <Args extends readonly unknown[]>(
  debounceWindow: number,
  handler: (...args: Args) => void,
) => {
  if (!debounceWindow) {
    return handler;
  }

  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Args;

  return (...args: Args) => {
    lastArgs = args;

    if (timer === null) {
      timer = _.setTimer(async () => {
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
export const waitForDelay = (delay?: number) =>
  _.newPromise<void>((resolve) => {
    _.setTimer(resolve, delay);
  });
