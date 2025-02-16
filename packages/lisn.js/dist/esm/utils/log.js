function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * @module Utils
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { joinAsString } from "./text.js";
import { Callback } from "../modules/callback.js";

/**
 * Like `console.info` except if the string representation of the given
 * arguments has already been logged, it does nothing.
 *
 * @category Logging
 */
export var logInfo = function logInfo() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  if (!isMessageSeen(args)) {
    MH.consoleInfo.apply(MH, [MC.LOG_PREFIX].concat(args));
  }
};

/**
 * Like `console.warn` except if the string representation of the given
 * arguments has already been logged, it does nothing.
 *
 * @category Logging
 */
export var logWarn = function logWarn() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }
  if (!isMessageSeen(args)) {
    MH.consoleWarn.apply(MH, [MC.LOG_PREFIX].concat(args));
  }
};

/**
 * Like `console.error` except if the string representation of the given
 * arguments has already been logged, it does nothing.
 *
 * @category Logging
 */
export var logError = function logError() {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }
  if ((MH.lengthOf(args) > 1 || args[0] !== Callback.REMOVE) && !isMessageSeen(args)) {
    MH.consoleError.apply(MH, [MC.LOG_PREFIX].concat(args));
  }
};
var discardMessages = MH.newSet();
var isMessageSeen = function isMessageSeen(args) {
  var msg = joinAsString.apply(void 0, [" "].concat(_toConsumableArray(args)));
  var isSeen = discardMessages.has(msg);
  discardMessages.add(msg);
  return isSeen;
};
//# sourceMappingURL=log.js.map