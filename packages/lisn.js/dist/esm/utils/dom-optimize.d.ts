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
/**
 * Returns a Promise that is resolved before the next repaint.
 *
 * @category DOM: Preventing layout trashing
 */
export declare const waitForMutateTime: () => Promise<void>;
/**
 * Returns a Promise that is resolved as soon as possible after the next
 * repaint.
 *
 * @category DOM: Preventing layout trashing
 */
export declare const waitForMeasureTime: () => Promise<void>;
/**
 * Returns a Promise that is resolved before the repaint that follows the next
 * repaint.
 *
 * @category DOM: Preventing layout trashing
 */
export declare const waitForSubsequentMutateTime: () => Promise<void>;
/**
 * Returns a Promise that is resolved as soon as possible after the repaint
 * that follows the next repaint.
 *
 * @category DOM: Preventing layout trashing
 */
export declare const waitForSubsequentMeasureTime: () => Promise<void>;
//# sourceMappingURL=dom-optimize.d.ts.map