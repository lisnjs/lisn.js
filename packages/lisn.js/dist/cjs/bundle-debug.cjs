"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  debug: true,
  utils: true,
  modules: true
};
exports.utils = exports.modules = exports.debug = void 0;
var _bundle = require("./bundle.cjs");
Object.keys(_bundle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _bundle[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _bundle[key];
    }
  });
});
var _settings = require("./globals/settings.cjs");
var _debug = _interopRequireWildcard(require("./debug/index.cjs"));
exports.debug = _debug;
var _utils = _interopRequireWildcard(require("./utils/index.cjs"));
exports.utils = _utils;
var _modules = _interopRequireWildcard(require("./modules/index.cjs"));
exports.modules = _modules;
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * @module
 * @ignore
 * @internal
 */

// side effects

_settings.settings.verbosityLevel = 10;
//# sourceMappingURL=bundle-debug.cjs.map