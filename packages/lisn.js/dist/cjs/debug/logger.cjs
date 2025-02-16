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
var Logger = exports.Logger = /*#__PURE__*/_createClass(function Logger() {
  var _this = this;
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  _classCallCheck(this, Logger);
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
  var myConfig = MH.merge({
    // set defaults
    verbosityLevel: _settings.settings.verbosityLevel,
    remoteLoggerURL: _settings.settings.remoteLoggerURL,
    remoteLoggerOnMobileOnly: _settings.settings.remoteLoggerOnMobileOnly,
    debugID: (0, _text.randId)()
  }, config);
  var remoteLoggerURL = "";
  if (!getBooleanURLParam("disableRemoteLog") && (myConfig.remoteLoggerOnMobileOnly === false || isMobile())) {
    remoteLoggerURL = myConfig.remoteLoggerURL || "";
  }
  var name = myConfig.name || "";
  var myConsole = new _console.Console(remoteLoggerURL, myConfig.remoteLoggerConnectTimeout);
  // use setters bellow to validate value
  var verbosityLevel = 0;
  var logPrefix = "[LISN".concat(name ? ": " + name : "", "]");
  var debugID = myConfig.debugID;
  var debugPrefix = "[LISN".concat((name ? ": " + name : "") + (debugID ? "-" + debugID : ""), "]");
  this.getName = function () {
    return name;
  };
  this.getVerbosityLevel = function () {
    return verbosityLevel;
  };
  this.setVerbosityLevel = function (l) {
    verbosityLevel = l;
  };
  this.setVerbosityLevel(myConfig.verbosityLevel || 0);
  this.debug1 = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return logDebugN.apply(void 0, [_this, 1, debugPrefix].concat(args));
  };
  this.debug2 = function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return logDebugN.apply(void 0, [_this, 2, debugPrefix].concat(args));
  };
  this.debug3 = function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    return logDebugN.apply(void 0, [_this, 3, debugPrefix].concat(args));
  };
  this.debug4 = function () {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return logDebugN.apply(void 0, [_this, 4, debugPrefix].concat(args));
  };
  this.debug5 = function () {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }
    return logDebugN.apply(void 0, [_this, 5, debugPrefix].concat(args));
  };
  this.debug6 = function () {
    for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }
    return logDebugN.apply(void 0, [_this, 6, debugPrefix].concat(args));
  };
  this.debug7 = function () {
    for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }
    return logDebugN.apply(void 0, [_this, 7, debugPrefix].concat(args));
  };
  this.debug8 = function () {
    for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
    }
    return logDebugN.apply(void 0, [_this, 8, debugPrefix].concat(args));
  };
  this.debug9 = function () {
    for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
    }
    return logDebugN.apply(void 0, [_this, 9, debugPrefix].concat(args));
  };
  this.debug10 = function () {
    for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
      args[_key10] = arguments[_key10];
    }
    return logDebugN.apply(void 0, [_this, 10, debugPrefix].concat(args));
  };
  this.debug = function () {
    for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
      args[_key11] = arguments[_key11];
    }
    return myConsole.debug.apply(myConsole, [debugPrefix].concat(args));
  };
  this.log = function () {
    for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
      args[_key12] = arguments[_key12];
    }
    return myConsole.log.apply(myConsole, [logPrefix].concat(args));
  };
  this.info = function () {
    for (var _len13 = arguments.length, args = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
      args[_key13] = arguments[_key13];
    }
    return myConsole.info.apply(myConsole, [logPrefix].concat(args));
  };
  this.warn = function () {
    for (var _len14 = arguments.length, args = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
      args[_key14] = arguments[_key14];
    }
    return myConsole.warn.apply(myConsole, [logPrefix].concat(args));
  };
  this.error = function () {
    for (var _len15 = arguments.length, args = new Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
      args[_key15] = arguments[_key15];
    }
    myConsole.error.apply(myConsole, [logPrefix].concat(args));
  };

  // --------------------
  if ("logAtCreation" in myConfig) {
    this.debug6("New logger:", myConfig.logAtCreation);
  }
});
// ----------------------------------------

var logDebugN = function logDebugN(logger, level) {
  for (var _len16 = arguments.length, args = new Array(_len16 > 2 ? _len16 - 2 : 0), _key16 = 2; _key16 < _len16; _key16++) {
    args[_key16 - 2] = arguments[_key16];
  }
  if (!MH.isNumber(level)) {
    args.unshift(level);
    level = 1;
    logger.error(MH.bugError("Missing logger.debug level"));
  }
  if (logger.getVerbosityLevel() < level) {
    return;
  }
  logger.debug.apply(logger, ["[DEBUG ".concat(level, "]")].concat(args));
};
var isMobile = function isMobile() {
  var regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(MC.USER_AGENT);
};
var getBooleanURLParam = function getBooleanURLParam(name) {
  var value = getURLParameter(name);
  return value && (value === "1" || MH.toLowerCase(value) === "true");
};
var getURLParameter = function getURLParameter(name) {
  if (!MH.hasDOM()) {
    return null;
  }
  var loc = MH.getDoc().location;
  if (typeof URLSearchParams !== "undefined") {
    var urlParams = new URLSearchParams(loc.search);
    return urlParams.get(name);
  }
  name = MH.strReplace(name, /[[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  var match = loc.href.match(regex);
  if (!match) {
    return null;
  }
  if (!match[2]) {
    return "";
  }
  return decodeURIComponent(MH.strReplace(match[2], /\+/g, " "));
};
//# sourceMappingURL=logger.cjs.map