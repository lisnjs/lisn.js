"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newXWeakMapGetter = exports.newXWeakMap = exports.newXMapGetter = exports.newXMap = exports.XWeakMap = exports.XMapBase = exports.XMap = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Modules/XMap
 */
/**
 * For minification optimization
 *
 * @ignore
 * @internal
 */
const newXMap = getDefaultV => new XMap(getDefaultV);

/**
 * For minification optimization. Exposed through {@link XMap.newXMapGetter}.
 *
 * @ignore
 * @internal
 */
exports.newXMap = newXMap;
const newXMapGetter = getDefaultV => () => newXMap(getDefaultV);

/**
 * For minification optimization
 *
 * @ignore
 * @internal
 */
exports.newXMapGetter = newXMapGetter;
const newXWeakMap = getDefaultV => new XWeakMap(getDefaultV);

/**
 * For minification optimization. Exposed through {@link XMap.newXWeakMapGetter}.
 *
 * @ignore
 * @internal
 */
exports.newXWeakMap = newXWeakMap;
const newXWeakMapGetter = getDefaultV => () => newXWeakMap(getDefaultV);
exports.newXWeakMapGetter = newXWeakMapGetter;
class XMapBase {
  constructor(root, getDefaultV) {
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
    this.get = key => root.get(key);
    this.set = (key, value) => root.set(key, value);
    this.delete = key => MH.deleteKey(root, key);
    this.has = key => root.has(key);
    this.sGet = key => {
      let result = root.get(key);
      if (result === undefined) {
        result = getDefaultV(key);
        root.set(key, result);
      }
      return result;
    };
    this.prune = (sk, ...rest) => {
      const value = root.get(sk);
      if (value instanceof XMapBase && MH.lengthOf(rest)) {
        value.prune(rest[0], ...rest.slice(1));
      }
      if (value === undefined || MH.isIterableObject(value) && !("size" in value && value.size || "length" in value && value.length)) {
        MH.deleteKey(root, sk);
      }
    };
  }
}

/**
 * {@link XMap} is like
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map | Map},
 * except that it supports automatically creating missing entries with
 * {@link sGet} according to a default value getter function.
 *
 * @typeParam K  The type of the keys the map holds.
 * @typeParam V  The type of the values the map holds.
 */
exports.XMapBase = XMapBase;
class XMap extends XMapBase {
  /**
   * @param {} getDefaultV  This function is called each time
   *                        {@link sGet} is called with a non-existent
   *                        key and must return a value that is then set for
   *                        that key and returned.
   */
  constructor(getDefaultV) {
    const root = MH.newMap();
    super(root, getDefaultV);
    /**
     * Returns the number of entries in the {@link XMap}.
     */
    _defineProperty(this, "size", void 0);
    /**
     * Deletes all entries in the {@link XMap}.
     */
    _defineProperty(this, "clear", void 0);
    /**
     * Returns an iterator over the {@link XMap} entries.
     */
    _defineProperty(this, "entries", void 0);
    /**
     * Returns an iterator over the {@link XMap} keys.
     */
    _defineProperty(this, "keys", void 0);
    /**
     * Returns an iterator over the {@link XMap} values.
     */
    _defineProperty(this, "values", void 0);
    _defineProperty(this, Symbol.iterator, void 0);
    MH.defineProperty(this, "size", {
      get: () => root.size
    });
    this.clear = () => root.clear();
    this.entries = () => root.entries();
    this.keys = () => root.keys();
    this.values = () => root.values();
    this[MC.SYMBOL.iterator] = () => root[MC.SYMBOL.iterator]();
  }
}

/**
 * {@link XWeakMap} is like
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap | WeakMap},
 * except that it supports automatically creating missing entries with
 * with {@link sGet} according to a default value getter function.
 *
 * @typeParam K  The type of the keys the map holds.
 * @typeParam V  The type of the values the map holds.
 */
exports.XMap = XMap;
/**
 * Returns a function that when called returns a new {@link XMap}.
 *
 * You can pass this to the constructor of an {@link XMap} or an
 * {@link XWeakMap}, whose values are {@link XMap}s.
 */
_defineProperty(XMap, "newXMapGetter", newXMapGetter);
class XWeakMap extends XMapBase {
  /**
   * @param {} getDefaultV  This function is called each time
   *                        {@link sGet} is called with a non-existent
   *                        key and must return a value that is then set for
   *                        that key and returned.
   */
  constructor(getDefaultV) {
    const root = MH.newWeakMap();
    super(root, getDefaultV);
  }
}
exports.XWeakMap = XWeakMap;
/**
 * Returns a function that when called returns a new {@link XWeakMap}.
 *
 * You can pass this to the constructor of an {@link XMap} or an
 * {@link XWeakMap}, whose values are {@link XWeakMap}s.
 */
_defineProperty(XWeakMap, "newXWeakMapGetter", newXWeakMapGetter);
//# sourceMappingURL=x-map.cjs.map