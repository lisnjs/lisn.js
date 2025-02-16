"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForPageReady = exports.waitForInteractive = exports.waitForElementOrInteractive = exports.waitForElement = exports.waitForComplete = exports.isPageReady = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _settings = require("../globals/settings.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
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
var waitForElement = exports.waitForElement = function waitForElement(checkFn, timeout) {
  return MH.newPromise(function (resolve) {
    var callFn = function callFn() {
      var result = checkFn();
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
      MH.setTimer(function () {
        resolve(null);
        observer.disconnect();
      }, timeout);
    }
    var observer = MH.newMutationObserver(function () {
      if (callFn()) {
        observer.disconnect();
      }
    });
    observer.observe(MH.getDocElement(), {
      childList: true,
      subtree: true
    });
  });
};

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
var waitForElementOrInteractive = exports.waitForElementOrInteractive = function waitForElementOrInteractive(checkFn) {
  return MH.newPromise(function (resolve) {
    var isInteractive = false;
    // Check element first, then readyState. The callback to waitForElement is
    // run synchronously first time, so isInteractive will be false and checkFn
    // will run.
    waitForElement(function () {
      return isInteractive || checkFn();
    }).then(function (res) {
      if (!isInteractive) {
        resolve(res);
      } // else already resolved to null
    });
    waitForInteractive().then(function () {
      isInteractive = true;
      resolve(null);
    });
  });
};

/**
 * Returns a Promise that is resolved when the
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState | Document:readyState}
 * is "interactive" (or if it's already "interactive" or "complete", the
 * Promise is fulfilled immediately).
 *
 * @category DOM: Events
 */
var waitForInteractive = exports.waitForInteractive = function waitForInteractive() {
  return MH.newPromise(function (resolve) {
    var readyState = MH.getReadyState();
    if (readyState === INTERACTIVE || readyState === COMPLETE) {
      resolve();
      return;
    }
    MH.getDoc().addEventListener("DOMContentLoaded", function () {
      return resolve();
    });
  });
};

/**
 * Returns a Promise that is resolved when the
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState | Document:readyState}
 * is "complete" (or if it's already "complete", the Promise is fulfilled
 * immediately).
 *
 * @category DOM: Events
 */
var waitForComplete = exports.waitForComplete = function waitForComplete() {
  return MH.newPromise(function (resolve) {
    if (MH.getReadyState() === COMPLETE) {
      resolve();
      return;
    }
    MH.getDoc().addEventListener("readystatechange", function () {
      if (MH.getReadyState() === COMPLETE) {
        resolve();
      }
    });
  });
};

/**
 * Returns a Promise that is resolved either when the
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState | Document:readyState}
 * is "complete" or the `readyState` is "interactive" and at least
 * {@link settings.pageLoadTimeout} milliseconds have passed (if > 0) since it
 * became "interactive".
 *
 * @category DOM: Events
 */
var waitForPageReady = exports.waitForPageReady = function waitForPageReady() {
  return MH.newPromise(function (resolve) {
    if (pageIsReady) {
      resolve();
      return;
    }
    return waitForInteractive().then(function () {
      // Setup a listener for the complete state but wait at most
      // <pageLoadTimeout> (if specified)
      var timer = null;
      var dispatchReady = function dispatchReady() {
        pageIsReady = true;
        if (timer) {
          MH.clearTimer(timer);
          timer = null;
        }
        resolve();
      };
      if (_settings.settings.pageLoadTimeout > 0) {
        timer = MH.setTimer(function () {
          dispatchReady();
        }, _settings.settings.pageLoadTimeout);
      }
      waitForComplete().then(dispatchReady);
    });
  });
};

/**
 * Returns true if the page is "ready". See {@link waitForPageReady}.
 *
 * @category DOM: Events
 */
var isPageReady = exports.isPageReady = function isPageReady() {
  return pageIsReady;
};

// --------------------

var COMPLETE = "complete";
var INTERACTIVE = "interactive";
var pageIsReady = false;
if (!MH.hasDOM()) {
  pageIsReady = true;
} else {
  waitForPageReady(); // ensure pageIsReady is set even if waitForPageReady is not called
}
//# sourceMappingURL=dom-events.cjs.map