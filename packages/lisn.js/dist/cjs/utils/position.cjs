"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidTwoFoldPosition = exports.isValidPosition = exports.POSITIONS = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
/**
 * @module Utils
 */

/**
 * @category Validation
 */
var isValidPosition = exports.isValidPosition = function isValidPosition(position) {
  return MH.includes(POSITIONS, position);
};

/**
 * @category Validation
 */
var isValidTwoFoldPosition = exports.isValidTwoFoldPosition = function isValidTwoFoldPosition(position) {
  return position.match(TWO_FOLD_POSITION_REGEX) !== null;
};

/**
 * @ignore
 * @internal
 */
var POSITIONS = exports.POSITIONS = [MC.S_TOP, MC.S_BOTTOM, MC.S_LEFT, MC.S_RIGHT];

// --------------------

var POSITIONS_OPTIONS_STR = "(" + POSITIONS.join("|") + ")";
var TWO_FOLD_POSITION_REGEX = RegExp("^".concat(POSITIONS_OPTIONS_STR, "-").concat(POSITIONS_OPTIONS_STR, "$"));
//# sourceMappingURL=position.cjs.map