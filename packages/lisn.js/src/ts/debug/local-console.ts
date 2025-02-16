/**
 * @module Debugging
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { LogFunction } from "@lisn/globals/types";

import { joinAsString } from "@lisn/utils/text";

import { LevelName, ConsoleInterface } from "@lisn/debug/types";

/**
 * Logs to the local browser console. On iOS devices it uses `console.info` for
 * all levels because of a bug in WebKit whereby other log levels don't show in
 * some remote debuggers. Also, iOS console only supports a single argument, so
 * it joins the given arguments as a single string.
 *
 * @category Logging
 */
export class LocalConsole implements ConsoleInterface {
  readonly debug: LogFunction;
  readonly log: LogFunction;
  readonly info: LogFunction;
  readonly warn: LogFunction;
  readonly error: LogFunction;

  constructor() {
    this.debug = isiOS ? iOSlog : isJest ? jestLog.debug : MH.consoleDebug;
    this.log = isiOS ? iOSlog : isJest ? jestLog.log : MH.consoleLog;
    this.info = isiOS ? iOSlog : isJest ? jestLog.info : MH.consoleInfo;
    this.warn = isiOS ? iOSlog : isJest ? jestLog.warn : MH.consoleWarn;
    this.error = isiOS ? iOSlog : isJest ? jestLog.error : MH.consoleError;
  }
}

// ------------------------------

const isiOS = MH.includes(MC.USER_AGENT, "iPhone OS") || false;
const iOSlog: LogFunction = (...args) =>
  MH.consoleInfo(joinAsString(" ", ...args));

const isJest = MH.includes(MC.USER_AGENT, " jsdom/") || false;
const jestLog: Record<LevelName, LogFunction> = {
  debug: (...args) => MH.consoleDebug(joinAsString(" ", ...args)),
  log: (...args) => MH.consoleLog(joinAsString(" ", ...args)),
  info: (...args) => MH.consoleInfo(joinAsString(" ", ...args)),
  warn: (...args) => MH.consoleWarn(joinAsString(" ", ...args)),
  error: (...args) => MH.consoleError(joinAsString(" ", ...args)),
};
