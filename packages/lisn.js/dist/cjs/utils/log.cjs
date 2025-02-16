"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logWarn = exports.logInfo = exports.logError = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _text = require("./text.cjs");
var _callback = require("../modules/callback.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * @module Utils
 */

/**
 * Like `console.info` except if the string representation of the given
 * arguments has already been logged, it does nothing.
 *
 * @category Logging
 */
const logInfo = (...args) => {
  if (!isMessageSeen(args)) {
    MH.consoleInfo(MC.LOG_PREFIX, ...args);
  }
};

/**
 * Like `console.warn` except if the string representation of the given
 * arguments has already been logged, it does nothing.
 *
 * @category Logging
 */
exports.logInfo = logInfo;
const logWarn = (...args) => {
  if (!isMessageSeen(args)) {
    MH.consoleWarn(MC.LOG_PREFIX, ...args);
  }
};

/**
 * Like `console.error` except if the string representation of the given
 * arguments has already been logged, it does nothing.
 *
 * @category Logging
 */
exports.logWarn = logWarn;
const logError = (...args) => {
  if ((MH.lengthOf(args) > 1 || args[0] !== _callback.Callback.REMOVE) && !isMessageSeen(args)) {
    MH.consoleError(MC.LOG_PREFIX, ...args);
  }
};
exports.logError = logError;
const discardMessages = MH.newSet();
const isMessageSeen = args => {
  const msg = (0, _text.joinAsString)(" ", ...args);
  const isSeen = discardMessages.has(msg);
  discardMessages.add(msg);
  return isSeen;
};
//# sourceMappingURL=log.cjs.map