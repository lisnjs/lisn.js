"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LocalConsole = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _text = require("../utils/text.cjs");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Debugging
 */
/**
 * Logs to the local browser console. On iOS devices it uses `console.info` for
 * all levels because of a bug in WebKit whereby other log levels don't show in
 * some remote debuggers. Also, iOS console only supports a single argument, so
 * it joins the given arguments as a single string.
 *
 * @category Logging
 */
class LocalConsole {
  constructor() {
    _defineProperty(this, "debug", void 0);
    _defineProperty(this, "log", void 0);
    _defineProperty(this, "info", void 0);
    _defineProperty(this, "warn", void 0);
    _defineProperty(this, "error", void 0);
    this.debug = isiOS ? iOSlog : isJest ? jestLog.debug : MH.consoleDebug;
    this.log = isiOS ? iOSlog : isJest ? jestLog.log : MH.consoleLog;
    this.info = isiOS ? iOSlog : isJest ? jestLog.info : MH.consoleInfo;
    this.warn = isiOS ? iOSlog : isJest ? jestLog.warn : MH.consoleWarn;
    this.error = isiOS ? iOSlog : isJest ? jestLog.error : MH.consoleError;
  }
}

// ------------------------------
exports.LocalConsole = LocalConsole;
const isiOS = MH.includes(MC.USER_AGENT, "iPhone OS") || false;
const iOSlog = (...args) => MH.consoleInfo((0, _text.joinAsString)(" ", ...args));
const isJest = MH.includes(MC.USER_AGENT, " jsdom/") || false;
const jestLog = {
  debug: (...args) => MH.consoleDebug((0, _text.joinAsString)(" ", ...args)),
  log: (...args) => MH.consoleLog((0, _text.joinAsString)(" ", ...args)),
  info: (...args) => MH.consoleInfo((0, _text.joinAsString)(" ", ...args)),
  warn: (...args) => MH.consoleWarn((0, _text.joinAsString)(" ", ...args)),
  error: (...args) => MH.consoleError((0, _text.joinAsString)(" ", ...args))
};
//# sourceMappingURL=local-console.cjs.map