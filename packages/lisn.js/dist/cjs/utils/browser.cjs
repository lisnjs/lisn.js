"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supportsSticky = exports.isTouchScreen = exports.isMobile = exports.isInQuirksMode = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * @module
 * @ignore
 * @internal
 */

const isTouchScreen = () => MH.hasDOM() ? matchMedia("(any-pointer: coarse)").matches : false;

/**
 * @since v1.2.0
 */
exports.isTouchScreen = isTouchScreen;
const supportsSticky = () => MH.hasDOM() ? typeof CSS !== "undefined" && CSS.supports("position", "sticky") : false;

/**
 * @since v1.2.0
 */
exports.supportsSticky = supportsSticky;
const isInQuirksMode = () => MH.hasDOM() ? document.compatMode === "BackCompat" : false;

/**
 * @since v1.2.0
 */
exports.isInQuirksMode = isInQuirksMode;
const isMobile = () => MH.hasDOM() ? MH.userAgent.match(/Mobile|Android|Silk\/|Kindle|BlackBerry|Opera Mini|Opera Mobi/) !== null : false;
exports.isMobile = isMobile;
//# sourceMappingURL=browser.cjs.map