"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidMutationCategoryList = exports.isValidMutationCategory = exports.DOM_CATEGORIES_SPACE = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var _validation = require("./validation.cjs");
var _bitSpaces = require("../modules/bit-spaces.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * @module Utils
 */

/**
 * Returns true if the given string is a valid category.
 *
 * @category Validation
 */
const isValidMutationCategory = category => DOM_CATEGORIES_SPACE.has(category);

/**
 * Returns true if the given string or array is a list of valid categories.
 *
 * @category Validation
 */
exports.isValidMutationCategory = isValidMutationCategory;
const isValidMutationCategoryList = categories => (0, _validation.isValidStrList)(categories, isValidMutationCategory, false);

/**
 * @ignore
 * @internal
 */
exports.isValidMutationCategoryList = isValidMutationCategoryList;
const DOM_CATEGORIES_SPACE = exports.DOM_CATEGORIES_SPACE = (0, _bitSpaces.createBitSpace)((0, _bitSpaces.newBitSpaces)(), MC.S_ADDED, MC.S_REMOVED, MC.S_ATTRIBUTE);
//# sourceMappingURL=dom.cjs.map