"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidPointerActionList = exports.isValidPointerAction = exports.POINTER_ACTIONS = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _validation = require("./validation.cjs");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * @module Utils
 */

/**
 * Returns true if the given string is a valid pointer action.
 *
 * @category Validation
 */
const isValidPointerAction = action => MH.includes(POINTER_ACTIONS, action);

/**
 * Returns true if the given string or array is a valid list of pointer
 * actions.
 *
 * @category Validation
 */
exports.isValidPointerAction = isValidPointerAction;
const isValidPointerActionList = actions => (0, _validation.isValidStrList)(actions, isValidPointerAction, false);

/**
 * @ignore
 * @internal
 */
exports.isValidPointerActionList = isValidPointerActionList;
const POINTER_ACTIONS = exports.POINTER_ACTIONS = [MC.S_CLICK, MC.S_HOVER, MC.S_PRESS];
//# sourceMappingURL=pointer.cjs.map