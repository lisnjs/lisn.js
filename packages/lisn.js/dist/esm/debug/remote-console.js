function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Debugging
 */

import * as MH from "../globals/minification-helpers.js";
import { tryImport } from "../utils/misc.js";
import { joinAsString } from "../utils/text.js";
import { newXMap } from "../modules/x-map.js";
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
export class RemoteConsole {
  /**
   * Creates a new {@link RemoteConsole} and attempts to connect to the logger
   * at the given URL.
   *
   * @param {} url                      The URL of the remote logger.
   * @param {} [connectTimeout = 1500]  The timeout in ms for a connection
   *                                    to be considered failed.
   */
  constructor(url, connectTimeout = DEFAULT_TIMEOUT) {
    /**
     * Emits a message with ID `console.debug`.
     */
    _defineProperty(this, "debug", void 0);
    /**
     * Emits a message with ID `console.log`.
     */
    _defineProperty(this, "log", void 0);
    /**
     * Emits a message with ID `console.info`.
     */
    _defineProperty(this, "info", void 0);
    /**
     * Emits a message with ID `console.warn`.
     */
    _defineProperty(this, "warn", void 0);
    /**
     * Emits a message with ID `console.error`.
     */
    _defineProperty(this, "error", void 0);
    /**
     * Disconnects and destroys the {@link RemoteConsole}. Cannot be undone.
     */
    _defineProperty(this, "destroy", void 0);
    /**
     * Returns true if the client has been disconnected for more than
     * the connect timeout.
     */
    _defineProperty(this, "hasFailed", void 0);
    let hasFailed = false; // initially
    let isClosed = false;

    // Because socket.io module is optional we need to import it dynamically,
    // which is always async. So to avoid Console and Logger also needing to be
    // async, we queue messages sent to a RemoteConsole here and try to import
    // socket.io here.
    let tmpQueue = [];
    let sendLog = (level, args) => {
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
      var _instances$get;
      hasFailed = true;
      sendLog = (level__ignored, args__ignored) => {};
      tmpQueue = [];
      const instance = (_instances$get = instances.get(url)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(connectTimeout);
      if (instance === this) {
        MH.deleteKey(instances.get(url), connectTimeout);
        instances.prune(url);
      }
    };
    (async () => {
      const socket = await tryImport("socket.io-client");
      if (!socket) {
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
      sendLog = (level, args) => {
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
      let entry;
      while (entry = tmpQueue.shift()) {
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
  static reuse(url, connectTimeout = DEFAULT_TIMEOUT) {
    var _instances$get2;
    let rConsole = (_instances$get2 = instances.get(url)) === null || _instances$get2 === void 0 ? void 0 : _instances$get2.get(connectTimeout);
    if (!rConsole) {
      rConsole = new RemoteConsole(url, connectTimeout);
      instances.sGet(url).set(connectTimeout, rConsole);
    }
    return rConsole;
  }
}
const instances = newXMap(() => MH.newMap());
const DEFAULT_TIMEOUT = 1500;
//# sourceMappingURL=remote-console.js.map