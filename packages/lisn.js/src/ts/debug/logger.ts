/**
 * @module Debugging
 *
 * @categoryDescription Logging
 * {@link Debugging.LocalConsole | LocalConsole} logs to the local browser
 * console. On iOS devices it uses `console.info` for all levels because of a
 * bug in WebKit whereby other log levels don't show in some remote debuggers.
 * Also, iOS console only supports a single argument, so it joins the given
 * arguments as a single string.
 *
 * {@link Debugging.RemoteConsole | RemoteConsole} connects to a remote
 * {@link https://socket.io/ | socket.io} server and logs messages to it.
 *
 * {@link Console} holds a {@link LocalConsole} and optionally a
 * {@link RemoteConsole} and logs to both.
 *
 * {@link Logger} holds a {@link Console} and implements debug at 10 different
 * levels. The maximum logged level is configurable. Also emits a prefix in
 * debug messages that identifies the instance.
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { settings } from "@lisn/globals/settings";

import { LogFunction } from "@lisn/globals/types";

import { randId } from "@lisn/utils/text";

import { LoggerInterface, LoggerConfig } from "@lisn/debug/types";
import { Console } from "@lisn/debug/console";

/**
 * Holds a {@link Console} and implements debug at 10 different levels. The
 * maximum logged level is configurable. Also emits a prefix in debug messages
 * that identifies the instance.
 *
 * @category Logging
 */
export class Logger implements LoggerInterface {
  readonly debug: LogFunction;
  readonly log: LogFunction;
  readonly info: LogFunction;
  readonly warn: LogFunction;
  readonly error: LogFunction;
  readonly debug1: LogFunction;
  readonly debug2: LogFunction;
  readonly debug3: LogFunction;
  readonly debug4: LogFunction;
  readonly debug5: LogFunction;
  readonly debug6: LogFunction;
  readonly debug7: LogFunction;
  readonly debug8: LogFunction;
  readonly debug9: LogFunction;
  readonly debug10: LogFunction;
  readonly getName: () => string;
  readonly getVerbosityLevel: () => number;
  readonly setVerbosityLevel: (level: number) => void;

  constructor(config: LoggerConfig = {}) {
    const myConfig = MH.merge(
      {
        // set defaults
        verbosityLevel: settings.verbosityLevel,
        remoteLoggerURL: settings.remoteLoggerURL,
        remoteLoggerOnMobileOnly: settings.remoteLoggerOnMobileOnly,
        debugID: randId(),
      },
      config,
    );

    let remoteLoggerURL = "";
    if (
      !getBooleanURLParam("disableRemoteLog") &&
      (myConfig.remoteLoggerOnMobileOnly === false || isMobile())
    ) {
      remoteLoggerURL = myConfig.remoteLoggerURL || "";
    }

    const name = myConfig.name || "";
    const myConsole = new Console(
      remoteLoggerURL,
      myConfig.remoteLoggerConnectTimeout,
    );
    // use setters bellow to validate value
    let verbosityLevel = 0;
    const logPrefix = `[LISN${name ? ": " + name : ""}]`;
    const debugID = myConfig.debugID;
    const debugPrefix = `[LISN${(name ? ": " + name : "") + (debugID ? "-" + debugID : "")}]`;

    this.getName = () => name;

    this.getVerbosityLevel = () => verbosityLevel;
    this.setVerbosityLevel = (l) => {
      verbosityLevel = l;
    };

    this.setVerbosityLevel(myConfig.verbosityLevel || 0);

    this.debug1 = (...args) => logDebugN(this, 1, debugPrefix, ...args);
    this.debug2 = (...args) => logDebugN(this, 2, debugPrefix, ...args);
    this.debug3 = (...args) => logDebugN(this, 3, debugPrefix, ...args);
    this.debug4 = (...args) => logDebugN(this, 4, debugPrefix, ...args);
    this.debug5 = (...args) => logDebugN(this, 5, debugPrefix, ...args);
    this.debug6 = (...args) => logDebugN(this, 6, debugPrefix, ...args);
    this.debug7 = (...args) => logDebugN(this, 7, debugPrefix, ...args);
    this.debug8 = (...args) => logDebugN(this, 8, debugPrefix, ...args);
    this.debug9 = (...args) => logDebugN(this, 9, debugPrefix, ...args);
    this.debug10 = (...args) => logDebugN(this, 10, debugPrefix, ...args);

    this.debug = (...args) => myConsole.debug(debugPrefix, ...args);
    this.log = (...args) => myConsole.log(logPrefix, ...args);
    this.info = (...args) => myConsole.info(logPrefix, ...args);
    this.warn = (...args) => myConsole.warn(logPrefix, ...args);
    this.error = (...args) => {
      myConsole.error(logPrefix, ...args);
    };

    // --------------------
    if ("logAtCreation" in myConfig) {
      this.debug6("New logger:", myConfig.logAtCreation);
    }
  }
}

export type ErrorMatchList = Array<
  RegExp | string | { new (): Error } | symbol
>;

// ----------------------------------------

const logDebugN = (logger: Logger, level: number, ...args: unknown[]) => {
  if (!MH.isNumber(level)) {
    args.unshift(level);
    level = 1;
    logger.error(MH.bugError("Missing logger.debug level"));
  }

  if (logger.getVerbosityLevel() < level) {
    return;
  }

  logger.debug(`[DEBUG ${level}]`, ...args);
};

const isMobile = () => {
  const regex =
    /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(MC.USER_AGENT);
};

const getBooleanURLParam = (name: string) => {
  const value = getURLParameter(name);
  return value && (value === "1" || MH.toLowerCase(value) === "true");
};

const getURLParameter = (name: string) => {
  if (!MH.hasDOM()) {
    return null;
  }

  const loc = MH.getDoc().location;
  if (typeof URLSearchParams !== "undefined") {
    const urlParams = new URLSearchParams(loc.search);
    return urlParams.get(name);
  }

  name = MH.strReplace(name, /[[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const match = loc.href.match(regex);

  if (!match) {
    return null;
  }

  if (!match[2]) {
    return "";
  }
  return decodeURIComponent(MH.strReplace(match[2], /\+/g, " "));
};
