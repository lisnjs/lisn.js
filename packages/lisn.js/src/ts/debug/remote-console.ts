/**
 * @module Debugging
 */

import * as MH from "@lisn/globals/minification-helpers";

import { LogFunction } from "@lisn/globals/types";

import { joinAsString } from "@lisn/utils/text";

import { newXMap } from "@lisn/modules/x-map";

import { ConsoleInterface } from "@lisn/debug/types";

/* ******************************
 * Remote console
 * *******************************/

/**
 * Connects to a remote {@link https://socket.io/ | socket.io} server and logs
 * messages to it.
 *
 * In the root of the Git repository, there is a simple example server that
 * listens for these messages and logs them to the local console.
 *
 * @category Logging
 */
export class RemoteConsole implements ConsoleInterface {
  /**
   * Emits a message with ID `console.debug`.
   */
  readonly debug: LogFunction;

  /**
   * Emits a message with ID `console.log`.
   */
  readonly log: LogFunction;

  /**
   * Emits a message with ID `console.info`.
   */
  readonly info: LogFunction;

  /**
   * Emits a message with ID `console.warn`.
   */
  readonly warn: LogFunction;

  /**
   * Emits a message with ID `console.error`.
   */
  readonly error: LogFunction;

  /**
   * Disconnects and destroys the {@link RemoteConsole}. Cannot be undone.
   */
  readonly destroy: () => void;

  /**
   * Returns true if the client has been disconnected for more than
   * the connect timeout.
   */
  readonly hasFailed: () => boolean;

  /**
   * Creates a new {@link RemoteConsole} and attempts to connect to the logger
   * at the given URL.
   *
   * @param {} url                      The URL of the remote logger.
   * @param {} [connectTimeout = 1500]  The timeout in ms for a connection
   *                                    to be considered failed.
   */
  constructor(url: string, connectTimeout = DEFAULT_TIMEOUT) {
    let hasFailed = false; // initially
    let isClosed = false;

    // Because socket.io module is optional we need to import it dynamically,
    // which is always async. So to avoid Console and Logger also needing to be
    // async, we queue messages sent to a RemoteConsole here and try to import
    // socket.io here.
    let tmpQueue: Array<[string, unknown[]]> = [];
    let sendLog = (level: string, args: unknown[]) => {
      tmpQueue.push([level, args]);
    };
    let destroy = () => {};

    this.hasFailed = () => hasFailed;
    this.debug = (...args) => sendLog("debug", args);
    this.log = (...args) => sendLog("log", args);
    this.info = (...args) => sendLog("info", args);
    this.warn = (...args) => sendLog("warn", args);
    this.error = (...args) => sendLog("error", args);
    this.destroy = () => destroy();

    const cleanup = () => {
      hasFailed = true;
      sendLog = (level__ignored: string, args__ignored: unknown[]) => {};
      tmpQueue = [];

      const instance = instances.get(url)?.get(connectTimeout);
      if (instance === this) {
        MH.deleteKey(instances.get(url), connectTimeout);
        instances.prune(url);
      }
    };

    (async () => {
      let socket: typeof import("socket.io-client");
      const moduleName = "socket.io-client"; // suppress Vite static analysis
      try {
        socket = await import(/* webpackIgnore: true */ moduleName);
      } catch (e__ignored) {
        // module doesn't exist
        cleanup();
        return;
      }

      const ioClient = socket.io(url);

      // if not connected within connectTimeout initially, set as failed
      let disconnectTimer = MH.setTimer(() => {
        hasFailed = true;
      }, connectTimeout);

      ioClient.on("disconnect", () => {
        // if not re-connected within connectTimeout, set as failed
        MH.clearTimer(disconnectTimer);
        if (!isClosed) {
          disconnectTimer = MH.setTimer(() => {
            hasFailed = true;
          }, connectTimeout);
        }
      });

      ioClient.on("connect", () => {
        MH.clearTimer(disconnectTimer);
        hasFailed = false;
      });

      // Now we can send directly to the client
      sendLog = (level: string, args: unknown[]) => {
        if (!hasFailed) {
          ioClient.emit(`console.${level}`, joinAsString(" ", ...args));
        }
      };

      destroy = () => {
        isClosed = true; // do not wait for re-connect
        ioClient.disconnect();
        cleanup();
      };

      // Flush the queue
      let entry: [string, unknown[]] | undefined;
      while ((entry = tmpQueue.shift())) {
        sendLog(entry[0], entry[1]);
      }
    })();
  }

  /**
   * Returns an existing {@link RemoteConsole} for the given URL and timeout or
   * creates a new one.
   *
   * If a new one is created, it will be saved for later reuse.
   *
   * @param {} url               The URL of the remote logger.
   * @param {} [connectTimeout]  The timeout in ms for a remote connection to
   *                             be considered failed. Default is 1500.
   */
  static reuse(url: string, connectTimeout = DEFAULT_TIMEOUT) {
    let rConsole = instances.get(url)?.get(connectTimeout);
    if (!rConsole) {
      rConsole = new RemoteConsole(url, connectTimeout);
      instances.sGet(url).set(connectTimeout, rConsole);
    }

    return rConsole;
  }
}

const instances = newXMap<string, Map<number, RemoteConsole>>(() =>
  MH.newMap(),
);

const DEFAULT_TIMEOUT = 1500;
