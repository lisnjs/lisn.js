"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newBitSpaces = exports.createBitSpace = exports.BitSpaces = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _math = require("../utils/math.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Modules/BitSpaces
 */
/**
 * A union of all property names in the space.
 */
/**
 * {@link BitSpace} represents a single set of mutually exclusive (or
 * orthogonal) properties.
 *
 * Each property has a numeric value equal to 1 bit-shifted by a certain number
 * of bits.
 *
 * Created using {@link BitSpaces.create}
 *
 * @interface
 */
/**
 * {@link BitSpaces} represents one or more related {@link BitSpace}s whose bit
 * values will not overlap.
 */
var BitSpaces = exports.BitSpaces = /*#__PURE__*/_createClass(function BitSpaces() {
  _classCallCheck(this, BitSpaces);
  /**
   * Creates and returns a new BitSpace that is bit shifted to the left as
   * many bits as the ending bit of the previous space created by this
   * instances, so that each new space created is non-overlapping with previous
   * ones.
   *
   * The numeric values of the properties are guaranteed to be in the same
   * order, increasing in value, as the keys passed to the function.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the number of bits in the space will exceed 32.
   *
   * @example
   * ```javascript
   * const spaces = new BitSpaces();
   * const spaceA = spaces.create("up", "down");
   *
   * // spaces.nBits   => 2
   * // spaces.bitmask => 3
   * //
   * // spaceA:
   * // {
   * //     bit: {
   * //         up:     1, // at bit 0, i.e. 1 << 0
   * //         down:   2, // at bit 1, i.e. 1 << 1
   * //     },
   * //     start:      0,
   * //     end:        1,
   * //     bitmask:    3, // 1 << 0 | 1 << 1
   * //     has:        (p) => p === "up" || p === "down",
   * //     bitmaskFor: (pStart, pEnd) => ...
   * //     nameOf:     (v) => v === 1 ? "up" : v === 2 ? "down" : null
   * // }
   *
   * const spaceB = spaces.create("left", "right");
   *
   * // spaces.nBits   => 4
   * // spaces.bitmask => 15
   * //
   * // spaceB:
   * // {
   * //     bit: {
   * //         left:   4, // at bit 2, i.e. 1 << 2
   * //         right:  8, // at bit 3, i.e. 1 << 3
   * //     },
   * //     start:      2,
   * //     end:        3,
   * //     bitmask:    12, // 1 << 2 | 1 << 3
   * //     has:        (p) => p === "left" || p === "right",
   * //     bitmaskFor: (pStart, pEnd) => ...
   * //     nameOf:     (v) => v === 4 ? "left" : v === 8 ? "right" : null
   * // }
   *
   * ```
   */
  _defineProperty(this, "create", void 0);
  /**
   * Returns the number of bits all created spaces span, i.e. the end bit of
   * the one + 1.
   */
  _defineProperty(this, "nBits", void 0);
  /**
   * Returns a bitmask containing all values in all created spaces.
   */
  _defineProperty(this, "bitmask", void 0);
  var counter = newCounter();
  this.create = function () {
    for (var _len = arguments.length, propNames = new Array(_len), _key = 0; _key < _len; _key++) {
      propNames[_key] = arguments[_key];
    }
    return newBitSpace(counter, propNames);
  };
  MH.defineProperty(this, "nBits", {
    get: function get() {
      return counter._nBits;
    }
  });
  MH.defineProperty(this, "bitmask", {
    get: function get() {
      return counter._bitmask;
    }
  });
});
/**
 * For minification optimization
 *
 * @ignore
 * @internal
 */
var newBitSpaces = exports.newBitSpaces = function newBitSpaces() {
  return new BitSpaces();
};

/**
 * For minification optimization
 *
 * @ignore
 * @internal
 */
var createBitSpace = exports.createBitSpace = function createBitSpace(spaces) {
  for (var _len2 = arguments.length, propNames = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    propNames[_key2 - 1] = arguments[_key2];
  }
  return spaces.create.apply(spaces, propNames);
};

// ----------------------------------------

var newCounter = function newCounter() {
  return {
    _nBits: 0,
    _bitmask: 0
  };
};
var newBitSpace = function newBitSpace(counter, propNames) {
  var start = counter._nBits;
  var end = start + MH.lengthOf(propNames) - 1;
  if (end >= 31) {
    throw MH.usageError("BitSpaces overflow");
  }
  var bitmask = (0, _math.getBitmask)(start, end);
  var space = {
    bit: {},
    start: start,
    end: end,
    bitmask: bitmask,
    has: function has(p) {
      return MH.isString(p) && p in space.bit && MH.isNumber(space.bit[p]);
    },
    bitmaskFor: function bitmaskFor(pStart, pEnd) {
      if (!MH.isEmpty(pStart) && !space.has(pStart) || !MH.isEmpty(pEnd) && !space.has(pEnd)) {
        return 0;
      }
      var thisStart = !MH.isEmpty(pStart) ? MH.log2(space.bit[pStart]) : start;
      var thisEnd = !MH.isEmpty(pEnd) ? MH.log2(space.bit[pEnd]) : end;
      return (0, _math.getBitmask)(thisStart, thisEnd);
    },
    nameOf: function nameOf(val) {
      var _propNames;
      return (_propNames = propNames[MH.log2(val) - start]) !== null && _propNames !== void 0 ? _propNames : null;
    }
  };
  var _iterator = _createForOfIteratorHelper(propNames),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var name = _step.value;
      MH.defineProperty(space.bit, name, {
        value: 1 << counter._nBits++,
        enumerable: true
      });
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  counter._bitmask |= bitmask;
  return space;
};
//# sourceMappingURL=bit-spaces.cjs.map