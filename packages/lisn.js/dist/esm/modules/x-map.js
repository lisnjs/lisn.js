function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Modules/XMap
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
/**
 * For minification optimization
 *
 * @ignore
 * @internal
 */
export var newXMap = function newXMap(getDefaultV) {
  return new XMap(getDefaultV);
};

/**
 * For minification optimization. Exposed through {@link XMap.newXMapGetter}.
 *
 * @ignore
 * @internal
 */
export var newXMapGetter = function newXMapGetter(getDefaultV) {
  return function () {
    return newXMap(getDefaultV);
  };
};

/**
 * For minification optimization
 *
 * @ignore
 * @internal
 */
export var newXWeakMap = function newXWeakMap(getDefaultV) {
  return new XWeakMap(getDefaultV);
};

/**
 * For minification optimization. Exposed through {@link XMap.newXWeakMapGetter}.
 *
 * @ignore
 * @internal
 */
export var newXWeakMapGetter = function newXWeakMapGetter(getDefaultV) {
  return function () {
    return newXWeakMap(getDefaultV);
  };
};
export var XMapBase = /*#__PURE__*/_createClass(function XMapBase(root, getDefaultV) {
  _classCallCheck(this, XMapBase);
  /**
   * Returns the value at the given key in the {@link XMap} or {@link XWeakMap}.
   */
  _defineProperty(this, "get", void 0);
  /**
   * Like {@link get} except that if the key is not found in the map, then it
   * will set and return a default value by calling `getDefaultV` passed to the
   * constructor.
   */
  _defineProperty(this, "sGet", void 0);
  /**
   * Sets a value at the given key in the {@link XMap} or {@link XWeakMap}.
   */
  _defineProperty(this, "set", void 0);
  /**
   * Deletes a value at the given key in the {@link XMap} or {@link XWeakMap}.
   */
  _defineProperty(this, "delete", void 0);
  /**
   * Deletes empty keys in the {@link XMap} or {@link XWeakMap} starting at the
   * final nested path and checking the level above after deletion.
   *
   * A key is considered empty if it's value is undefined or it's an empty Map,
   * Set, Array, etc (anything with size or length property equal to 0).
   */
  _defineProperty(this, "prune", void 0);
  /**
   * Returns true if the {@link XMap} or {@link XWeakMap} contains the given key.
   */
  _defineProperty(this, "has", void 0);
  this.get = function (key) {
    return root.get(key);
  };
  this.set = function (key, value) {
    return root.set(key, value);
  };
  this["delete"] = function (key) {
    return MH.deleteKey(root, key);
  };
  this.has = function (key) {
    return root.has(key);
  };
  this.sGet = function (key) {
    var result = root.get(key);
    if (result === undefined) {
      result = getDefaultV(key);
      root.set(key, result);
    }
    return result;
  };
  this.prune = function (sk) {
    var value = root.get(sk);
    for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }
    if (value instanceof XMapBase && MH.lengthOf(rest)) {
      value.prune.apply(value, [rest[0]].concat(_toConsumableArray(rest.slice(1))));
    }
    if (value === undefined || MH.isIterableObject(value) && !("size" in value && value.size || "length" in value && value.length)) {
      MH.deleteKey(root, sk);
    }
  };
});

/**
 * {@link XMap} is like
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map | Map},
 * except that it supports automatically creating missing entries with
 * {@link sGet} according to a default value getter function.
 *
 * @typeParam K  The type of the keys the map holds.
 * @typeParam V  The type of the values the map holds.
 */
export var XMap = /*#__PURE__*/function (_XMapBase2) {
  /**
   * @param {} getDefaultV  This function is called each time
   *                        {@link sGet} is called with a non-existent
   *                        key and must return a value that is then set for
   *                        that key and returned.
   */
  function XMap(getDefaultV) {
    var _this;
    _classCallCheck(this, XMap);
    var root = MH.newMap();
    _this = _callSuper(this, XMap, [root, getDefaultV]);
    /**
     * Returns the number of entries in the {@link XMap}.
     */
    _defineProperty(_this, "size", void 0);
    /**
     * Deletes all entries in the {@link XMap}.
     */
    _defineProperty(_this, "clear", void 0);
    /**
     * Returns an iterator over the {@link XMap} entries.
     */
    _defineProperty(_this, "entries", void 0);
    /**
     * Returns an iterator over the {@link XMap} keys.
     */
    _defineProperty(_this, "keys", void 0);
    /**
     * Returns an iterator over the {@link XMap} values.
     */
    _defineProperty(_this, "values", void 0);
    _defineProperty(_this, Symbol.iterator, void 0);
    MH.defineProperty(_this, "size", {
      get: function get() {
        return root.size;
      }
    });
    _this.clear = function () {
      return root.clear();
    };
    _this.entries = function () {
      return root.entries();
    };
    _this.keys = function () {
      return root.keys();
    };
    _this.values = function () {
      return root.values();
    };
    _this[MC.SYMBOL.iterator] = function () {
      return root[MC.SYMBOL.iterator]();
    };
    return _this;
  }
  _inherits(XMap, _XMapBase2);
  return _createClass(XMap);
}(XMapBase);

/**
 * {@link XWeakMap} is like
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap | WeakMap},
 * except that it supports automatically creating missing entries with
 * with {@link sGet} according to a default value getter function.
 *
 * @typeParam K  The type of the keys the map holds.
 * @typeParam V  The type of the values the map holds.
 */
/**
 * Returns a function that when called returns a new {@link XMap}.
 *
 * You can pass this to the constructor of an {@link XMap} or an
 * {@link XWeakMap}, whose values are {@link XMap}s.
 */
_defineProperty(XMap, "newXMapGetter", newXMapGetter);
export var XWeakMap = /*#__PURE__*/function (_XMapBase3) {
  /**
   * @param {} getDefaultV  This function is called each time
   *                        {@link sGet} is called with a non-existent
   *                        key and must return a value that is then set for
   *                        that key and returned.
   */
  function XWeakMap(getDefaultV) {
    _classCallCheck(this, XWeakMap);
    var root = MH.newWeakMap();
    return _callSuper(this, XWeakMap, [root, getDefaultV]);
  }
  _inherits(XWeakMap, _XMapBase3);
  return _createClass(XWeakMap);
}(XMapBase);
/**
 * Returns a function that when called returns a new {@link XWeakMap}.
 *
 * You can pass this to the constructor of an {@link XMap} or an
 * {@link XWeakMap}, whose values are {@link XWeakMap}s.
 */
_defineProperty(XWeakMap, "newXWeakMapGetter", newXWeakMapGetter);
//# sourceMappingURL=x-map.js.map