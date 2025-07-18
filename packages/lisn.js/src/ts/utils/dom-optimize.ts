/**
 * @module Utils
 *
 * @categoryDescription DOM: Preventing layout trashing
 *
 * {@link waitForMeasureTime} allows you to schedule tasks that read or
 * "measure", the DOM, for example getting computed styles, taking the
 * `offsetWidth` or the `scrollTop` of an element, etc... anything that _would_
 * force a layout if it runs after the layout has been invalidated by a
 * "mutation".
 *
 * See https://gist.github.com/paulirish/5d52fb081b3570c81e3 for a list of
 * operations that should be run on a valid layout to avoid forced layouts.
 *
 * {@link waitForMutateTime} allows you to schedule tasks that invalidate the
 * DOM layout by making changes to the style, inserting or removing elements,
 * etc.
 *
 * These ensure that:
 * - All mutation tasks that would invalidate the style run together before the
 *   next repaint.
 * - All measurement tasks that need a valid style will run as soon as possible
 *   after the next repaint.
 * - If a mutation task is scheduled by another mutation task, it will run in
 *   the same batch.
 * - If a measurement task is scheduled by either a mutation or another
 *   measurement task, it will run in the same batch.
 */

import * as MH from "@lisn/globals/minification-helpers";

import { logError } from "@lisn/utils/log";
import { scheduleHighPriorityTask } from "@lisn/utils/tasks";

/**
 * Returns a Promise that is resolved before the next repaint.
 *
 * @category DOM: Preventing layout trashing
 */
export const waitForMutateTime = () =>
  MH.newPromise<void>((resolve) => {
    scheduleDOMTask(scheduledDOMMutations, resolve);
  });

/**
 * Returns a Promise that is resolved as soon as possible after the next
 * repaint.
 *
 * @category DOM: Preventing layout trashing
 */
export const waitForMeasureTime = () =>
  MH.newPromise<void>((resolve) => {
    scheduleDOMTask(scheduledDOMMeasurements, resolve);
  });

/**
 * Returns a Promise that is resolved before the repaint that follows the next
 * repaint.
 *
 * @category DOM: Preventing layout trashing
 */
export const waitForSubsequentMutateTime = () =>
  waitForMutateTime().then(waitForMeasureTime).then(waitForMutateTime);

/**
 * Returns a Promise that is resolved as soon as possible after the repaint
 * that follows the next repaint.
 *
 * @category DOM: Preventing layout trashing
 */
export const waitForSubsequentMeasureTime = () =>
  waitForMeasureTime().then(waitForMutateTime).then(waitForMeasureTime);

/**
 * @ignore
 * @internal
 */
export const asyncMutatorFor =
  <Args extends unknown[], Ret>(func: (...args: Args) => Ret) =>
  async (...args: Args) =>
    waitForMutateTime().then(() => func(...args));

/**
 * @ignore
 * @internal
 */
export const asyncMeasurerFor =
  <Args extends unknown[], Ret>(func: (...args: Args) => Ret) =>
  async (...args: Args) =>
    waitForMeasureTime().then(() => func(...args));

// ----------------------------------------

type TaskResolver = () => void;
type DOMTaskQueue = TaskResolver[];

const scheduledDOMMeasurements: DOMTaskQueue = [];
const scheduledDOMMutations: DOMTaskQueue = [];
let hasScheduledDOMTasks = false;

const scheduleDOMTask = (queue: DOMTaskQueue, resolve: TaskResolver) => {
  queue.push(resolve);
  if (!hasScheduledDOMTasks) {
    hasScheduledDOMTasks = true;
    MH.onAnimationFrame(runAllDOMTasks);
  }
};

const runAllDOMTasks = async () => {
  // We suspend (await null) after each queue to ensure that microtasks that
  // have been added by await waitFor* or waitFor*().then run before the next
  // queue, so that if they schedule more measurements and/or mutations, they
  // can be flushed now, in the same batch.

  // We're inside an animation frame. Run all mutation tasks now.
  while (MH.lengthOf(scheduledDOMMutations)) {
    runDOMTaskQueue(scheduledDOMMutations);
    // wait for tasks awaiting on the resolved promises, then check queue again
    await null;
  }

  // The measurement queue is now empty => scheduling measurements after
  // this point will result in rescheduling both queues again in the next
  // frame.
  //
  // Schedule the measurement tasks as soon as possible, after the upcoming
  // paint. Use a macro task with as high priority as possible.
  scheduleHighPriorityTask(async () => {
    while (MH.lengthOf(scheduledDOMMeasurements)) {
      runDOMTaskQueue(scheduledDOMMeasurements);
      // wait for tasks awaiting on the resolved promises, then check queue again
      await null;
    }

    if (MH.lengthOf(scheduledDOMMutations)) {
      // There have been mutations added. Schedule another flush.
      MH.onAnimationFrame(runAllDOMTasks);
    } else {
      hasScheduledDOMTasks = false;
    }
  });
};

const runDOMTaskQueue = (queue: DOMTaskQueue) => {
  let resolve: TaskResolver | undefined;
  while ((resolve = queue.shift())) {
    try {
      resolve();
    } catch (err) /* istanbul ignore next */ {
      logError(err);
    }
  }
};
