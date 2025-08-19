/**
 * @module Modules/XMap
 */

import * as _ from "@lisn/_internal";

import { MapBase } from "@lisn/globals/types";

export type DefaultValueGetter<K, V> = (key: K) => V;
export type IteratorCallback<K, V> = (
  value: V,
  key: K,
  map: XMap<K, V>,
) => void;

/**
 * For minification optimization
 *
 * @ignore
 * @internal
 */
export const newXMap = <K, V>(getDefaultV: DefaultValueGetter<K, V>) =>
  new XMap(getDefaultV);

/**
 * For minification optimization. Exposed through {@link XMap.newXMapGetter}.
 *
 * @ignore
 * @internal
 */
export const newXMapGetter =
  <K, V>(getDefaultV: DefaultValueGetter<K, V>) =>
  () =>
    newXMap(getDefaultV);

/**
 * For minification optimization
 *
 * @ignore
 * @internal
 */
export const newXWeakMap = <K extends WeakKey, V>(
  getDefaultV: DefaultValueGetter<K, V>,
) => new XWeakMap(getDefaultV);

/**
 * For minification optimization. Exposed through {@link XMap.newXWeakMapGetter}.
 *
 * @ignore
 * @internal
 */
export const newXWeakMapGetter =
  <K extends WeakKey, V>(getDefaultV: DefaultValueGetter<K, V>) =>
  () =>
    newXWeakMap(getDefaultV);

export abstract class XMapBase<K, V> {
  /**
   * Returns the value at the given key in the {@link XMap} or {@link XWeakMap}.
   */
  readonly get: (key: K) => V | undefined;

  /**
   * Like {@link get} except that if the key is not found in the map, then it
   * will set and return a default value by calling `getDefaultV` passed to the
   * constructor.
   */
  readonly sGet: (key: K) => V;

  /**
   * Sets a value at the given key in the {@link XMap} or {@link XWeakMap}.
   */
  readonly set: (key: K, value: V) => void;

  /**
   * Deletes a value at the given key in the {@link XMap} or {@link XWeakMap}.
   */
  readonly delete: (key: K) => boolean;

  /**
   * Deletes empty keys in the {@link XMap} or {@link XWeakMap} starting at the
   * final nested path and checking the level above after deletion.
   *
   * A key is considered empty if it's value is undefined or it's an empty Map,
   * Set, Array, etc (anything with size or length property equal to 0).
   */
  readonly prune: (sk: K, ...rest: unknown[]) => void;

  /**
   * Returns true if the {@link XMap} or {@link XWeakMap} contains the given key.
   */
  readonly has: (key: K) => boolean;

  protected constructor(
    root: MapBase<K, V>,
    getDefaultV: DefaultValueGetter<K, V>,
  ) {
    this.get = (key) => root.get(key);
    this.set = (key, value) => root.set(key, value);
    this.delete = (key) => root.delete(key);
    this.has = (key) => root.has(key);

    this.sGet = (key) => {
      let result = root.get(key);
      if (result === undefined) {
        result = getDefaultV(key);
        root.set(key, result);
      }
      return result;
    };

    this.prune = (sk, ...rest) => {
      const value = root.get(sk);
      if (value instanceof XMapBase && _.lengthOf(rest)) {
        value.prune(rest[0], ...rest.slice(1));
      }

      if (
        value === undefined ||
        (_.isIterableObject(value) &&
          !(
            ("size" in value && value.size) ||
            ("length" in value && value.length)
          ))
      ) {
        _.deleteKey(root, sk);
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
 * @typeParam K The type of the keys the map holds.
 * @typeParam V The type of the values the map holds.
 */
export class XMap<K, V> extends XMapBase<K, V> implements Iterable<[K, V]> {
  /**
   * Returns the number of entries in the {@link XMap}.
   */
  readonly size!: number;

  /**
   * Deletes all entries in the {@link XMap}.
   */
  readonly clear: () => void;

  /**
   * Returns an iterator over the {@link XMap} entries.
   */
  readonly entries: () => MapIterator<[K, V]>;

  /**
   * Returns an iterator over the {@link XMap} keys.
   */
  readonly keys: () => MapIterator<K>;

  /**
   * Returns an iterator over the {@link XMap} values.
   */
  readonly values: () => MapIterator<V>;

  readonly [Symbol.iterator]!: () => IterableIterator<[K, V]>;

  /**
   * Returns a function that when called returns a new {@link XMap}.
   *
   * You can pass this to the constructor of an {@link XMap} or an
   * {@link XWeakMap}, whose values are {@link XMap}s.
   */
  static readonly newXMapGetter = newXMapGetter;

  /**
   * @param getDefaultV This function is called each time {@link sGet} is
   *                    called with a non-existent key and must return a value
   *                    that is then set for that key and returned.
   */
  constructor(getDefaultV: DefaultValueGetter<K, V>) {
    const root = _.newMap<K, V>();
    super(root, getDefaultV);

    _.defineProperty(this, "size", { get: () => root.size });
    this.clear = () => root.clear();
    this.entries = () => root.entries();
    this.keys = () => root.keys();
    this.values = () => root.values();
    this[_.SYMBOL.iterator] = () => root[_.SYMBOL.iterator]();
  }
}

/**
 * {@link XWeakMap} is like
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap | WeakMap},
 * except that it supports automatically creating missing entries with
 * with {@link sGet} according to a default value getter function.
 *
 * @typeParam K The type of the keys the map holds.
 * @typeParam V The type of the values the map holds.
 */
export class XWeakMap<K extends WeakKey, V> extends XMapBase<K, V> {
  /**
   * Returns a function that when called returns a new {@link XWeakMap}.
   *
   * You can pass this to the constructor of an {@link XMap} or an
   * {@link XWeakMap}, whose values are {@link XWeakMap}s.
   */
  static readonly newXWeakMapGetter = newXWeakMapGetter;

  /**
   * @param getDefaultV This function is called each time {@link sGet} is
   *                    called with a non-existent key and must return a value
   *                    that is then set for that key and returned.
   */
  constructor(getDefaultV: DefaultValueGetter<K, V>) {
    const root = _.newWeakMap<K, V>();
    super(root, getDefaultV);
  }
}

_.brandClass(XMapBase, "XMapBase");
_.brandClass(XMap, "XMap");
_.brandClass(XWeakMap, "XWeakMap");
