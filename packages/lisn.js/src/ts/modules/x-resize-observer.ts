/**
 * @module Modules/XResizeObserver
 */

import * as MH from "@lisn/globals/minification-helpers";

import { logWarn, logError } from "@lisn/utils/log";

import debug from "@lisn/debug/debug";

export type XResizeObserverCallback = (
  entries: ResizeObserverEntry[],
  observer: XResizeObserver,
) => void;

/**
 * {@link XResizeObserver} is an extension of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver | ResizeObserver}
 * - observes both border box and content box size changes
 * - can skip the initial callback that happens shortly after setting up via
 *   {@link observeLater}
 * - can debounce the callback
 */
export class XResizeObserver {
  /**
   * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/observe | ResizeObserver:observe} except it accepts multiple targets.
   */
  readonly observe: (...targets: Element[]) => void;

  /**
   * Like {@link observe} but it ignores the initial almost immediate callback
   * and only calls the callback on a subsequent resize.
   *
   * If the target is already being observed, nothing is done.
   */
  readonly observeLater: (...targets: Element[]) => void;

  /**
   * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/unobserve | ResizeObserver:unobserve} except it accepts multiple targets.
   */
  readonly unobserve: (...targets: Element[]) => void;

  /**
   * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/disconnect | ResizeObserver:disconnect}.
   */
  readonly disconnect: () => void;

  /**
   * @param debounceWindow Debounce the handler so that it's called at most
   *                       every `debounceWindow` ms.
   */
  constructor(callback: XResizeObserverCallback, debounceWindow?: number) {
    const logger = debug ? new debug.Logger({ name: "XResizeObserver" }) : null;

    // Keep the latest ResizeObserverEntry for each target during the
    // debounceWindow. Short-lived, so ok to use a Map.
    const buffer = MH.newMap<Element, ResizeObserverEntry>();

    // Since internally we have two observers, one for border box, one for
    // content box, we will get called initially twice for a target. So we keep
    // a counter of 1 or 2 for how many more calls to ignore.
    const targetsToSkip = MH.newWeakMap<Element, 1 | 2>();

    let observedTargets = MH.newWeakSet<Element>();

    debounceWindow ??= 0;

    let timer: ReturnType<typeof setTimeout> | null = null;
    const resizeHandler = (entries: ResizeObserverEntry[]) => {
      // Override entries for previous targets, but keep entries whose targets
      // were not resized in this round
      for (const entry of entries) {
        const target = MH.targetOf(entry);
        const skipNum = targetsToSkip.get(target);
        if (skipNum !== undefined) {
          if (skipNum === 2) {
            // expect one more call
            targetsToSkip.set(target, 1);
          } else {
            // done
            /* istanbul ignore next */
            if (skipNum !== 1) {
              logError(MH.bugError(`# targetsToSkip is ${skipNum}`));
            }
            MH.deleteKey(targetsToSkip, target);
          }

          continue;
        }

        buffer.set(target, entry);
      }

      debug: logger?.debug9(
        `Got ${entries.length} new entries. ` +
          `Have ${buffer.size} unique-target entries`,
        entries,
      );

      if (!timer && MH.sizeOf(buffer)) {
        timer = MH.setTimer(() => {
          if (MH.sizeOf(buffer)) {
            callback([...buffer.values()], this);
            buffer.clear();
          }

          timer = null;
        }, debounceWindow);
      }
    };

    const borderObserver = MH.newResizeObserver(resizeHandler);
    const contentObserver = MH.newResizeObserver(resizeHandler);
    if (!borderObserver || !contentObserver) {
      logWarn(
        "This browser does not support ResizeObserver. Some features won't work.",
      );
    }

    const observeTarget = (target: Element) => {
      observedTargets.add(target);
      borderObserver?.observe(target, { box: "border-box" });
      contentObserver?.observe(target);
    };

    // --------------------

    this.observe = (...targets) => {
      debug: logger?.debug10("Observing targets", targets);

      for (const target of targets) {
        observeTarget(target);
      }
    };

    this.observeLater = (...targets) => {
      debug: logger?.debug10("Observing targets (later)", targets);
      for (const target of targets) {
        // Only skip them if not already observed, otherwise the initial
        // (almost) immediate callback won't happen anyway.
        if (observedTargets.has(target)) {
          continue;
        }

        targetsToSkip.set(target, 2);
        observeTarget(target);
      }
    };

    this.unobserve = (...targets) => {
      debug: logger?.debug10("Unobserving targets", targets);

      for (const target of targets) {
        MH.deleteKey(observedTargets, target);
        borderObserver?.unobserve(target);
        contentObserver?.unobserve(target);
      }
    };

    this.disconnect = () => {
      debug: logger?.debug10("Disconnecting");
      observedTargets = MH.newWeakSet();
      borderObserver?.disconnect();
      contentObserver?.disconnect();
    };
  }
}
