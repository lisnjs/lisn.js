"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LocalConsole = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _text = require("../utils/text.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
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
var LocalConsole = exports.LocalConsole = /*#__PURE__*/_createClass(function LocalConsole() {
  _classCallCheck(this, LocalConsole);
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
}); // ------------------------------
var isiOS = MH.includes(MC.USER_AGENT, "iPhone OS") || false;
var iOSlog = function iOSlog() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return MH.consoleInfo(_text.joinAsString.apply(void 0, [" "].concat(args)));
};
var isJest = MH.includes(MC.USER_AGENT, " jsdom/") || false;
var jestLog = {
  debug: function debug() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return MH.consoleDebug(_text.joinAsString.apply(void 0, [" "].concat(args)));
  },
  log: function log() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    return MH.consoleLog(_text.joinAsString.apply(void 0, [" "].concat(args)));
  },
  info: function info() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return MH.consoleInfo(_text.joinAsString.apply(void 0, [" "].concat(args)));
  },
  warn: function warn() {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }
    return MH.consoleWarn(_text.joinAsString.apply(void 0, [" "].concat(args)));
  },
  error: function error() {
    for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }
    return MH.consoleError(_text.joinAsString.apply(void 0, [" "].concat(args)));
  }
};
//# sourceMappingURL=local-console.cjs.map