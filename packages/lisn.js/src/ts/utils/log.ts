/**
 * @module Utils
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { LogFunction } from "@lisn/globals/types";

import { joinAsString } from "@lisn/utils/text";

import { Callback } from "@lisn/modules/callback";

/**
 * Like `console.info` except if the string representation of the given
 * arguments has already been logged, it does nothing.
 *
 * @category Logging
 */
export const logInfo: LogFunction = (...args) => {
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
export const logWarn: LogFunction = (...args) => {
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
export const logError: LogFunction = (...args) => {
  if (
    (MH.lengthOf(args) > 1 || args[0] !== Callback.REMOVE) &&
    !isMessageSeen(args)
  ) {
    MH.consoleError(MC.LOG_PREFIX, ...args);
  }
};

const discardMessages = MH.newSet<string>();
const isMessageSeen = (args: unknown[]) => {
  const msg = joinAsString(" ", ...args);
  const isSeen = discardMessages.has(msg);
  discardMessages.add(msg);
  return isSeen;
};
