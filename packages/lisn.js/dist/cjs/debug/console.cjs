"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Console = void 0;
var _localConsole = require("./local-console.cjs");
var _remoteConsole2 = require("./remote-console.cjs");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Debugging
 */
/**
 * Holds a {@link LocalConsole} and optionally a {@link RemoteConsole} and logs
 * to both.
 */
var Console = exports.Console = /*#__PURE__*/_createClass(
/**
 * @param {} remoteUrl         Attempt to use a remote logger at this URL.
 * @param {} [connectTimeout]  The timeout in ms for a remote connection to
 *                             be considered failed.
 *                             See {@link RemoteConsole}.
 */
function Console(remoteUrl, connectTimeout) {
  _classCallCheck(this, Console);
  _defineProperty(this, "debug", void 0);
  _defineProperty(this, "log", void 0);
  _defineProperty(this, "info", void 0);
  _defineProperty(this, "warn", void 0);
  _defineProperty(this, "error", void 0);
  var remoteConsole;
  // RemoteConsole import may be replaced with null by rollup when bundling
  // production, so check
  if (remoteUrl) {
    remoteConsole = _remoteConsole2.RemoteConsole.reuse(remoteUrl, connectTimeout);
  } else {
    remoteConsole = null;
  }
  var localConsole = new _localConsole.LocalConsole();
  var sendLog = function sendLog(level, args) {
    localConsole[level].apply(localConsole, _toConsumableArray(args));
    if (remoteConsole) {
      var _remoteConsole;
      (_remoteConsole = remoteConsole)[level].apply(_remoteConsole, _toConsumableArray(args));
    }
  };
  this.debug = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return sendLog("debug", args);
  };
  this.log = function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return sendLog("log", args);
  };
  this.info = function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    return sendLog("info", args);
  };
  this.warn = function () {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return sendLog("warn", args);
  };
  this.error = function () {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }
    return sendLog("error", args);
  };
});
//# sourceMappingURL=console.cjs.map