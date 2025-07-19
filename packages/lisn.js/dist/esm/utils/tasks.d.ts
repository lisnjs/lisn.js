/**
 * @module Utils
 */
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
    postTask<T, P extends readonly unknown[] | []>(callback: (...params: P) => T, options?: SchedulerPostTaskOptions, ...args: P): Promise<T>;
};
/**
 * @category Tasks
 */
export type TaskPriority = "user-blocking" | "user-visible" | "background";
/**
 * Schedules a task with high priority to be executed as soon as possible.
 *
 * It uses {@link https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/postTask | Scheduler:postTask}
 * if available, otherwise falls back to
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel | MessageChannel}.
 *
 * @category Tasks
 */
export declare const scheduleHighPriorityTask: (task: () => void) => void;
/**
 * Returns a wrapper around the given handler that is debounced by the given
 * debounce window.
 *
 * @category Tasks
 */
export declare const getDebouncedHandler: <Args extends unknown[]>(debounceWindow: number, handler: (...args: Args) => void) => (...args: Args) => void;
/**
 * Returns a promise that resolves at least the given number of delay (in
 * milliseconds) later. Uses `setTimeout`.
 *
 * @category Tasks
 */
export declare const waitForDelay: (delay?: number) => Promise<void>;
//# sourceMappingURL=tasks.d.ts.map