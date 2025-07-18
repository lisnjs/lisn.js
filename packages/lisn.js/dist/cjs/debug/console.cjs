"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Console = void 0;
var _localConsole = require("./local-console.cjs");
var _remoteConsole = require("./remote-console.cjs");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Debugging
 */
/**
 * Holds a {@link LocalConsole} and optionally a {@link RemoteConsole} and logs
 * to both.
 */
class Console {
  /**
   * @param remoteUrl        Attempt to use a remote logger at this URL.
   * @param [connectTimeout] The timeout in ms for a remote connection to be
   *                         considered failed. See {@link RemoteConsole}.
   */
  constructor(remoteUrl, connectTimeout) {
    _defineProperty(this, "debug", void 0);
    _defineProperty(this, "log", void 0);
    _defineProperty(this, "info", void 0);
    _defineProperty(this, "warn", void 0);
    _defineProperty(this, "error", void 0);
    let remoteConsole;
    // RemoteConsole import may be replaced with null by rollup when bundling
    // production, so check
    if (remoteUrl) {
      remoteConsole = _remoteConsole.RemoteConsole.reuse(remoteUrl, connectTimeout);
    } else {
      remoteConsole = null;
    }
    const localConsole = new _localConsole.LocalConsole();
    const sendLog = (level, args) => {
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
exports.Console = Console;
//# sourceMappingURL=console.cjs.map