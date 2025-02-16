"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Logger = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _settings = require("../globals/settings.cjs");
var _text = require("../utils/text.cjs");
var _console = require("./console.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
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
/**
 * Holds a {@link Console} and implements debug at 10 different levels. The
 * maximum logged level is configurable. Also emits a prefix in debug messages
 * that identifies the instance.
 *
 * @category Logging
 */
class Logger {
  constructor(config = {}) {
    _defineProperty(this, "debug", void 0);
    _defineProperty(this, "log", void 0);
    _defineProperty(this, "info", void 0);
    _defineProperty(this, "warn", void 0);
    _defineProperty(this, "error", void 0);
    _defineProperty(this, "debug1", void 0);
    _defineProperty(this, "debug2", void 0);
    _defineProperty(this, "debug3", void 0);
    _defineProperty(this, "debug4", void 0);
    _defineProperty(this, "debug5", void 0);
    _defineProperty(this, "debug6", void 0);
    _defineProperty(this, "debug7", void 0);
    _defineProperty(this, "debug8", void 0);
    _defineProperty(this, "debug9", void 0);
    _defineProperty(this, "debug10", void 0);
    _defineProperty(this, "getName", void 0);
    _defineProperty(this, "getVerbosityLevel", void 0);
    _defineProperty(this, "setVerbosityLevel", void 0);
    const myConfig = MH.merge({
      // set defaults
      verbosityLevel: _settings.settings.verbosityLevel,
      remoteLoggerURL: _settings.settings.remoteLoggerURL,
      remoteLoggerOnMobileOnly: _settings.settings.remoteLoggerOnMobileOnly,
      debugID: (0, _text.randId)()
    }, config);
    let remoteLoggerURL = "";
    if (!getBooleanURLParam("disableRemoteLog") && (myConfig.remoteLoggerOnMobileOnly === false || isMobile())) {
      remoteLoggerURL = myConfig.remoteLoggerURL || "";
    }
    const name = myConfig.name || "";
    const myConsole = new _console.Console(remoteLoggerURL, myConfig.remoteLoggerConnectTimeout);
    // use setters bellow to validate value
    let verbosityLevel = 0;
    const logPrefix = `[LISN${name ? ": " + name : ""}]`;
    const debugID = myConfig.debugID;
    const debugPrefix = `[LISN${(name ? ": " + name : "") + (debugID ? "-" + debugID : "")}]`;
    this.getName = () => name;
    this.getVerbosityLevel = () => verbosityLevel;
    this.setVerbosityLevel = l => {
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
exports.Logger = Logger;
// ----------------------------------------

const logDebugN = (logger, level, ...args) => {
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
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(MC.USER_AGENT);
};
const getBooleanURLParam = name => {
  const value = getURLParameter(name);
  return value && (value === "1" || MH.toLowerCase(value) === "true");
};
const getURLParameter = name => {
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
//# sourceMappingURL=logger.cjs.map