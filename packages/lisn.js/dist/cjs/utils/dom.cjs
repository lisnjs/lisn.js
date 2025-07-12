"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidMutationCategoryList = exports.isValidMutationCategory = exports.DOM_CATEGORIES_SPACE = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var _validation = require("./validation.cjs");
var _bitSpaces = require("../modules/bit-spaces.cjs");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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