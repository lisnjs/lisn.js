/**
 * @module Debugging
 */

import { LogFunction } from "@lisn/globals/types";

import { LevelName, ConsoleInterface } from "@lisn/debug/types";
import { LocalConsole } from "@lisn/debug/local-console";
import { RemoteConsole } from "@lisn/debug/remote-console";

/**
 * Holds a {@link LocalConsole} and optionally a {@link RemoteConsole} and logs
 * to both.
 */
export class Console implements ConsoleInterface {
  readonly debug: LogFunction;
  readonly log: LogFunction;
  readonly info: LogFunction;
  readonly warn: LogFunction;
  readonly error: LogFunction;

  /**
   * @param {} remoteUrl         Attempt to use a remote logger at this URL.
   * @param {} [connectTimeout]  The timeout in ms for a remote connection to
   *                             be considered failed.
   *                             See {@link RemoteConsole}.
   */
  constructor(remoteUrl?: string, connectTimeout?: number) {
    let remoteConsole;
    // RemoteConsole import may be replaced with null by rollup when bundling
    // production, so check
    if (remoteUrl) {
      remoteConsole = RemoteConsole.reuse(remoteUrl, connectTimeout);
    } else {
      remoteConsole = null;
    }

    const localConsole = new LocalConsole();
    const sendLog = (level: LevelName, args: unknown[]) => {
      localConsole[level](...args);
      if (remoteConsole) {
        remoteConsole[level](...args);
      }
    };

    this.debug = (...args) => sendLog("debug", args);
    this.log = (...args) => sendLog("log", args);
    this.info = (...args) => sendLog("info", args);
    this.warn = (...args) => sendLog("warn", args);
    this.error = (...args) => sendLog("error", args);
  }
}
