"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidTwoFoldPosition = exports.isValidPosition = exports.POSITIONS = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * @module Utils
 */

/**
 * @category Validation
 */
const isValidPosition = position => MH.includes(POSITIONS, position);

/**
 * @category Validation
 */
exports.isValidPosition = isValidPosition;
const isValidTwoFoldPosition = position => position.match(TWO_FOLD_POSITION_REGEX) !== null;

/**
 * @ignore
 * @internal
 */
exports.isValidTwoFoldPosition = isValidTwoFoldPosition;
const POSITIONS = exports.POSITIONS = [MC.S_TOP, MC.S_BOTTOM, MC.S_LEFT, MC.S_RIGHT];

// --------------------

const POSITIONS_OPTIONS_STR = "(" + POSITIONS.join("|") + ")";
const TWO_FOLD_POSITION_REGEX = RegExp(`^${POSITIONS_OPTIONS_STR}-${POSITIONS_OPTIONS_STR}$`);
//# sourceMappingURL=position.cjs.map