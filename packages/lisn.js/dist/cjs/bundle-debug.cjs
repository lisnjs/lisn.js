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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * @module
 * @ignore
 * @internal
 */

// side effects

_settings.settings.verbosityLevel = 10;
//# sourceMappingURL=bundle-debug.cjs.map