/**
 * @module Modules/XIntersectionObserver
 */

import * as MH from "@lisn/globals/minification-helpers";

export type XIntersectionObserverCallback = (
  entries: IntersectionObserverEntry[],
  observer: XIntersectionObserver,
) => void;

/**
 * {@link XIntersectionObserver} is an extension of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver | IntersectionObserver}
 * with added capabilities:
 * - can skip the initial callback that happens shortly after setting up via
 *   {@link observeLater}
 */
export class XIntersectionObserver {
  /**
   * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root | IntersectionObserver:root}.
   */
  readonly root!: Element | Document | null;

  /**
   * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin | IntersectionObserver:rootMargin}.
   */
  readonly rootMargin!: string;

  /**
   * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds | IntersectionObserver:thresholds}.
   */
  readonly thresholds!: number[];

  /**
   * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/observe | IntersectionObserver:observe} except it accepts multiple
   * targets.
   */
  readonly observe: (...targets: Element[]) => void;

  /**
   * Like {@link observe} but it ignores the initial almost immediate callback
   * and only calls the callback on a subsequent intersection change.
   */
  readonly observeLater: (...targets: Element[]) => void;

  /**
   * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/unobserve | IntersectionObserver:unobserve} except it accepts multiple
   * targets.
   */
  readonly unobserve: (...targets: Element[]) => void;

  /**
   * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/disconnect | IntersectionObserver:disconnect}.
   */
  readonly disconnect: () => void;

  /**
   * Like `IntersectionObserver.takeRecords`.
   */
  readonly takeRecords: () => void;

  constructor(
    callback: XIntersectionObserverCallback,
    observeOptions?: IntersectionObserverInit,
  ) {
    let observedTargets = MH.newWeakSet<Element>();
    const targetsToSkip = MH.newWeakSet<Element>();

    const intersectionHandler = (entries: IntersectionObserverEntry[]) => {
      const selectedEntries = [];

      for (const entry of entries) {
        if (targetsToSkip.has(MH.targetOf(entry))) {
          MH.deleteKey(targetsToSkip, MH.targetOf(entry));
          continue;
        }

        selectedEntries.push(entry);
      }

      if (MH.lengthOf(selectedEntries)) {
        callback(selectedEntries, this);
      }
    };

    const observer = MH.newIntersectionObserver(
      intersectionHandler,
      observeOptions,
    );

    MH.defineProperty(this, "root", { get: () => observer.root });
    MH.defineProperty(this, "rootMargin", {
      get: () => observer.rootMargin,
    });
    MH.defineProperty(this, "thresholds", {
      get: () => observer.thresholds,
    });

    this.observe = (...targets) => {
      for (const target of targets) {
        observedTargets.add(target);
        observer.observe(target);
      }
    };

    this.observeLater = (...targets) => {
      for (const target of targets) {
        // Only skip them if not already observed, otherwise the initial
        // (almost) immediate callback won't happen anyway.
        if (observedTargets.has(target)) {
          continue;
        }

        targetsToSkip.add(target);
        this.observe(target);
      }
    };

    this.unobserve = (...targets) => {
      for (const target of targets) {
        MH.deleteKey(observedTargets, target);
        observer.unobserve(target);
      }
    };

    this.disconnect = () => {
      observedTargets = MH.newWeakSet();
      observer.disconnect();
    };

    this.takeRecords = () => observer.takeRecords();
  }
}
