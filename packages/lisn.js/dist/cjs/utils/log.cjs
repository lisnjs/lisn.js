"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logWarn = exports.logInfo = exports.logError = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _text = require("./text.cjs");
var _callback = require("../modules/callback.cjs");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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