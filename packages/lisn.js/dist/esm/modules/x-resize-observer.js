function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Modules/XResizeObserver
 */

import * as MH from "../globals/minification-helpers.js";
import { logWarn, logError } from "../utils/log.js";
import debug from "../debug/debug.js";
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
   * @param debounceWindow Debounce the handler so that it's called at most
   *                       every `debounceWindow` ms.
   */
  constructor(callback, debounceWindow) {
    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/observe | ResizeObserver:observe} except it accepts multiple targets.
     */
    _defineProperty(this, "observe", void 0);
    /**
     * Like {@link observe} but it ignores the initial almost immediate callback
     * and only calls the callback on a subsequent resize.
     *
     * If the target is already being observed, nothing is done.
     */
    _defineProperty(this, "observeLater", void 0);
    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/unobserve | ResizeObserver:unobserve} except it accepts multiple targets.
     */
    _defineProperty(this, "unobserve", void 0);
    /**
     * Like {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/disconnect | ResizeObserver:disconnect}.
     */
    _defineProperty(this, "disconnect", void 0);
    const logger = debug ? new debug.Logger({
      name: "XResizeObserver"
    }) : null;

    // Keep the latest ResizeObserverEntry for each target during the
    // debounceWindow. Short-lived, so ok to use a Map.
    const buffer = MH.newMap();

    // Since internally we have two observers, one for border box, one for
    // content box, we will get called initially twice for a target. So we keep
    // a counter of 1 or 2 for how many more calls to ignore.
    const targetsToSkip = MH.newWeakMap();
    let observedTargets = MH.newWeakSet();
    debounceWindow !== null && debounceWindow !== void 0 ? debounceWindow : debounceWindow = 0;
    let timer = null;
    const resizeHandler = entries => {
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
      debug: logger === null || logger === void 0 || logger.debug9(`Got ${entries.length} new entries. ` + `Have ${buffer.size} unique-target entries`, entries);
      if (!timer && MH.sizeOf(buffer)) {
        timer = MH.setTimer(() => {
          if (MH.sizeOf(buffer)) {
            callback(MH.arrayFrom(buffer.values()), this);
            buffer.clear();
          }
          timer = null;
        }, debounceWindow);
      }
    };
    const borderObserver = MH.newResizeObserver(resizeHandler);
    const contentObserver = MH.newResizeObserver(resizeHandler);
    if (!borderObserver || !contentObserver) {
      logWarn("This browser does not support ResizeObserver. Some features won't work.");
    }
    const observeTarget = target => {
      observedTargets.add(target);
      borderObserver === null || borderObserver === void 0 || borderObserver.observe(target, {
        box: "border-box"
      });
      contentObserver === null || contentObserver === void 0 || contentObserver.observe(target);
    };

    // --------------------

    this.observe = (...targets) => {
      debug: logger === null || logger === void 0 || logger.debug10("Observing targets", targets);
      for (const target of targets) {
        observeTarget(target);
      }
    };
    this.observeLater = (...targets) => {
      debug: logger === null || logger === void 0 || logger.debug10("Observing targets (later)", targets);
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
      debug: logger === null || logger === void 0 || logger.debug10("Unobserving targets", targets);
      for (const target of targets) {
        MH.deleteKey(observedTargets, target);
        borderObserver === null || borderObserver === void 0 || borderObserver.unobserve(target);
        contentObserver === null || contentObserver === void 0 || contentObserver.unobserve(target);
      }
    };
    this.disconnect = () => {
      debug: logger === null || logger === void 0 || logger.debug10("Disconnecting");
      observedTargets = MH.newWeakSet();
      borderObserver === null || borderObserver === void 0 || borderObserver.disconnect();
      contentObserver === null || contentObserver === void 0 || contentObserver.disconnect();
    };
  }
}
//# sourceMappingURL=x-resize-observer.js.map