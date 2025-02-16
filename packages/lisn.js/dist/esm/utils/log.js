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
export const logInfo = (...args) => {
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
export const logWarn = (...args) => {
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
export const logError = (...args) => {
  if ((MH.lengthOf(args) > 1 || args[0] !== Callback.REMOVE) && !isMessageSeen(args)) {
    MH.consoleError(MC.LOG_PREFIX, ...args);
  }
};
const discardMessages = MH.newSet();
const isMessageSeen = args => {
  const msg = joinAsString(" ", ...args);
  const isSeen = discardMessages.has(msg);
  discardMessages.add(msg);
  return isSeen;
};
//# sourceMappingURL=log.js.map