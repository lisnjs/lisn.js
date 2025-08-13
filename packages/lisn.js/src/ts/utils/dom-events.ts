/**
 * @module Utils
 */

import * as MH from "@lisn/globals/minification-helpers";

import { settings } from "@lisn/globals/settings";

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
 * @param timeout If given, then if no such element is present after this many
 *                milliseconds, the promise will resolve to `null`.
 *
 * @category DOM: Events
 */
export function waitForElement<F>(checkFn: () => F): Promise<NonNullable<F>>;
export function waitForElement<F>(
  checkFn: () => F,
  timeout: number,
): Promise<null | NonNullable<F>>;
export function waitForElement(checkFn: () => unknown, timeout?: number) {
  return MH.newPromise((resolve) => {
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
      setTimeout(() => {
        resolve(null);
        observer.disconnect();
      }, timeout);
    }

    const observer = new MutationObserver(() => {
      if (callFn()) {
        observer.disconnect();
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });
}

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
export const waitForElementOrInteractive = <F>(checkFn: () => F) =>
  MH.newPromise<NonNullable<true | F> | null>((resolve) => {
    let isInteractive = false;
    // Check element first, then readyState. The callback to waitForElement is
    // run synchronously first time, so isInteractive will be false and checkFn
    // will run.
    waitForElement(() => isInteractive || checkFn()).then((res) => {
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
export const waitForInteractive = () =>
  MH.newPromise<void>((resolve) => {
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
export const waitForComplete = () =>
  MH.newPromise<void>((resolve) => {
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
export const waitForPageReady = () =>
  MH.newPromise<void>((resolve) => {
    if (pageIsReady) {
      resolve();
      return;
    }

    return waitForInteractive().then(() => {
      // Setup a listener for the complete state but wait at most
      // <pageLoadTimeout> (if specified)
      let timer: ReturnType<typeof setTimeout> | null = null;

      const dispatchReady = () => {
        pageIsReady = true;
        if (timer) {
          MH.clearTimer(timer);
          timer = null;
        }
        resolve();
      };

      if (settings.pageLoadTimeout > 0) {
        timer = MH.setTimer(() => {
          dispatchReady();
        }, settings.pageLoadTimeout);
      }

      waitForComplete().then(dispatchReady);
    });
  });

/**
 * Returns true if the page is "ready". See {@link waitForPageReady}.
 *
 * @category DOM: Events
 */
export const isPageReady = () => pageIsReady;

// --------------------

const COMPLETE = "complete";
const INTERACTIVE = "interactive";

let pageIsReady = false;

if (!MH.hasDOM()) {
  pageIsReady = true;
} else {
  waitForPageReady(); // ensure pageIsReady is set even if waitForPageReady is not called
}
