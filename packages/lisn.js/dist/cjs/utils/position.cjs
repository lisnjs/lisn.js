"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidTwoFoldPosition = exports.isValidPosition = exports.POSITIONS = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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