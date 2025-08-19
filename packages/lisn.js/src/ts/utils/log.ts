/**
 * @module Utils
 */

import * as _ from "@lisn/_internal";

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
    _.consoleInfo(_.LOG_PREFIX, ...args);
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
    _.consoleWarn(_.LOG_PREFIX, ...args);
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
    (_.lengthOf(args) > 1 || args[0] !== Callback.REMOVE) &&
    !isMessageSeen(args)
  ) {
    _.consoleError(_.LOG_PREFIX, ...args);
  }
};

const discardMessages = _.createSet<string>();
const isMessageSeen = (args: unknown[]) => {
  const msg = joinAsString(" ", ...args);
  const isSeen = discardMessages.has(msg);
  discardMessages.add(msg);
  return isSeen;
};
