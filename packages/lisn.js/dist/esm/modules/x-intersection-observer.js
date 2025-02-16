function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Modules/XIntersectionObserver
 */

import * as MH from "../globals/minification-helpers.js";
/**
 * {@link XIntersectionObserver} is an extension of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver | IntersectionObserver}
 * with added capabilities:
 * - can skip the initial callback that happens shortly after setting up via
 *   {@link observeLater}
 */
export class XIntersectionObserver {
  constructor(callback, observeOptions) {
    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root | IntersectionObserver:root}.
     */
    _defineProperty(this, "root", void 0);
    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin | IntersectionObserver:rootMargin}.
     */
    _defineProperty(this, "rootMargin", void 0);
    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds | IntersectionObserver:thresholds}.
     */
    _defineProperty(this, "thresholds", void 0);
    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/observe | IntersectionObserver:observe} except it accepts multiple
     * targets.
     */
    _defineProperty(this, "observe", void 0);
    /**
     * Like {@link observe} but it ignores the initial almost immediate callback
     * and only calls the callback on a subsequent intersection change.
     */
    _defineProperty(this, "observeLater", void 0);
    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/unobserve | IntersectionObserver:unobserve} except it accepts multiple
     * targets.
     */
    _defineProperty(this, "unobserve", void 0);
    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/disconnect | IntersectionObserver:disconnect}.
     */
    _defineProperty(this, "disconnect", void 0);
    /**
     * Like `IntersectionObserver.takeRecords`.
     */
    _defineProperty(this, "takeRecords", void 0);
    let observedTargets = MH.newWeakSet();
    const targetsToSkip = MH.newWeakSet();
    const intersectionHandler = entries => {
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
    const observer = MH.newIntersectionObserver(intersectionHandler, observeOptions);
    MH.defineProperty(this, "root", {
      get: () => observer.root
    });
    MH.defineProperty(this, "rootMargin", {
      get: () => observer.rootMargin
    });
    MH.defineProperty(this, "thresholds", {
      get: () => observer.thresholds
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
//# sourceMappingURL=x-intersection-observer.js.map