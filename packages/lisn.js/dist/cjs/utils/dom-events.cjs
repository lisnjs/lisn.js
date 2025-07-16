"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForPageReady = exports.waitForInteractive = exports.waitForElementOrInteractive = exports.waitForElement = exports.waitForComplete = exports.isPageReady = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _settings = require("../globals/settings.cjs");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * @module Utils
 */

/**
 * Returns a Promise that is resolved when the given `checkFn` function returns
 * a value other than `null` or `undefined`.
 *
 * The Promise is resolved with `checkFn`'s return value.
 *
 * The function is called initially, and then every time there are changes to
 * the DOM children. Uses
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver | MutationObserver}.
 *
 * @param {} timeout If given, then if no such element is present after this
 *                    many milliseconds, the promise will resolve to `null`.
 *
 * @category DOM: Events
 */
const waitForElement = (checkFn, timeout) => MH.newPromise(resolve => {
  const callFn = () => {
    const result = checkFn();
    if (!MH.isNullish(result)) {
      resolve(result);
      return true; // done
    }
    return false;
  };
  if (callFn()) {
    return; // resolved already
  }
  if (!MH.isNullish(timeout)) {
    MH.setTimer(() => {
      resolve(null);
      observer.disconnect();
    }, timeout);
  }
  const observer = MH.newMutationObserver(() => {
    if (callFn()) {
      observer.disconnect();
    }
  });
  observer.observe(MH.getDocElement(), {
    childList: true,
    subtree: true
  });
});

/**
 * Returns a Promise that is resolved when the given `checkFn` function returns
 * a value other than `null` or `undefined` or the
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState | Document:readyState}
 * becomes "interactive".
 *
 * It always calls the given `checkFn` first before examining the `readyState`.
 *
 * If the `readyState` became interactive before the element was found, the
 * Promise resolves to `null`. Otherwise the Promise is resolved with `checkFn`'s
 * return value.
 *
 * The function is called initially, and then every time there are changes to
 * the DOM children. Uses
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver | MutationObserver}.
 *
 * @category DOM: Events
 */
exports.waitForElement = waitForElement;
const waitForElementOrInteractive = checkFn => MH.newPromise(resolve => {
  let isInteractive = false;
  // Check element first, then readyState. The callback to waitForElement is
  // run synchronously first time, so isInteractive will be false and checkFn
  // will run.
  waitForElement(() => isInteractive || checkFn()).then(res => {
    if (!isInteractive) {
      resolve(res);
    } // else already resolved to null
  });
  waitForInteractive().then(() => {
    isInteractive = true;
    resolve(null);
  });
});

/**
 * Returns a Promise that is resolved when the
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState | Document:readyState}
 * is "interactive" (or if it's already "interactive" or "complete", the
 * Promise is fulfilled immediately).
 *
 * @category DOM: Events
 */
exports.waitForElementOrInteractive = waitForElementOrInteractive;
const waitForInteractive = () => MH.newPromise(resolve => {
  const readyState = MH.getReadyState();
  if (readyState === INTERACTIVE || readyState === COMPLETE) {
    resolve();
    return;
  }
  MH.getDoc().addEventListener("DOMContentLoaded", () => resolve());
});

/**
 * Returns a Promise that is resolved when the
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState | Document:readyState}
 * is "complete" (or if it's already "complete", the Promise is fulfilled
 * immediately).
 *
 * @category DOM: Events
 */
exports.waitForInteractive = waitForInteractive;
const waitForComplete = () => MH.newPromise(resolve => {
  if (MH.getReadyState() === COMPLETE) {
    resolve();
    return;
  }
  MH.getDoc().addEventListener("readystatechange", () => {
    if (MH.getReadyState() === COMPLETE) {
      resolve();
    }
  });
});

/**
 * Returns a Promise that is resolved either when the
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState | Document:readyState}
 * is "complete" or the `readyState` is "interactive" and at least
 * {@link settings.pageLoadTimeout} milliseconds have passed (if > 0) since it
 * became "interactive".
 *
 * @category DOM: Events
 */
exports.waitForComplete = waitForComplete;
const waitForPageReady = () => MH.newPromise(resolve => {
  if (pageIsReady) {
    resolve();
    return;
  }
  return waitForInteractive().then(() => {
    // Setup a listener for the complete state but wait at most
    // <pageLoadTimeout> (if specified)
    let timer = null;
    const dispatchReady = () => {
      pageIsReady = true;
      if (timer) {
        MH.clearTimer(timer);
        timer = null;
      }
      resolve();
    };
    if (_settings.settings.pageLoadTimeout > 0) {
      timer = MH.setTimer(() => {
        dispatchReady();
      }, _settings.settings.pageLoadTimeout);
    }
    waitForComplete().then(dispatchReady);
  });
});

/**
 * Returns true if the page is "ready". See {@link waitForPageReady}.
 *
 * @category DOM: Events
 */
exports.waitForPageReady = waitForPageReady;
const isPageReady = () => pageIsReady;

// --------------------
exports.isPageReady = isPageReady;
const COMPLETE = "complete";
const INTERACTIVE = "interactive";
let pageIsReady = false;
if (!MH.hasDOM()) {
  pageIsReady = true;
} else {
  waitForPageReady(); // ensure pageIsReady is set even if waitForPageReady is not called
}
//# sourceMappingURL=dom-events.cjs.map