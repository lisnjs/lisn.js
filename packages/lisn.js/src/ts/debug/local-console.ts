/**
 * @module Debugging
 */

import * as _ from "@lisn/_internal";

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
    this.debug = isiOS ? iOSlog : isJest ? jestLog.debug : _.consoleDebug;
    this.log = isiOS ? iOSlog : isJest ? jestLog.log : _.consoleLog;
    this.info = isiOS ? iOSlog : isJest ? jestLog.info : _.consoleInfo;
    this.warn = isiOS ? iOSlog : isJest ? jestLog.warn : _.consoleWarn;
    this.error = isiOS ? iOSlog : isJest ? jestLog.error : _.consoleError;
  }
}

// ------------------------------

const isiOS = _.includes(_.userAgent, "iPhone OS");
const iOSlog: LogFunction = (...args) =>
  _.consoleInfo(joinAsString(" ", ...args));

const isJest = _.includes(_.userAgent, " jsdom/");
const jestLog: Record<LevelName, LogFunction> = {
  debug: (...args) => _.consoleDebug(joinAsString(" ", ...args)),
  log: (...args) => _.consoleLog(joinAsString(" ", ...args)),
  info: (...args) => _.consoleInfo(joinAsString(" ", ...args)),
  warn: (...args) => _.consoleWarn(joinAsString(" ", ...args)),
  error: (...args) => _.consoleError(joinAsString(" ", ...args)),
};

_.brandClass(LocalConsole, "LocalConsole");
