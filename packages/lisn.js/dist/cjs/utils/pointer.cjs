"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidPointerActionList = exports.isValidPointerAction = exports.POINTER_ACTIONS = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _validation = require("./validation.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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