"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "settings", {
  enumerable: true,
  get: function () {
    return _settings.settings;
  }
});
exports.watchers = void 0;
var _settings = require("./globals/settings.cjs");
var _watchers = _interopRequireWildcard(require("./watchers/index.cjs"));
exports.watchers = _watchers;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * @module
 * @ignore
 * @internal
 */

_settings.settings.autoWidgets = true;
//# sourceMappingURL=bundle-essentials.cjs.map