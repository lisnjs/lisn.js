/**
 * @module Modules/XMap
 */
import { MapBase } from "../globals/types.js";
export type DefaultValueGetter<K, V> = (key: K) => V;
export type IteratorCallback<K, V> = (value: V, key: K, map: XMap<K, V>) => void;
/**
 * For minification optimization
 *
 * @ignore
 * @internal
 */
export declare const newXMap: <K, V>(getDefaultV: DefaultValueGetter<K, V>) => XMap<K, V>;
/**
 * For minification optimization. Exposed through {@link XMap.newXMapGetter}.
 *
 * @ignore
 * @internal
 */
export declare const newXMapGetter: <K, V>(getDefaultV: DefaultValueGetter<K, V>) => () => XMap<K, V>;
/**
 * For minification optimization
 *
 * @ignore
 * @internal
 */
export declare const newXWeakMap: <K extends WeakKey, V>(getDefaultV: DefaultValueGetter<K, V>) => XWeakMap<K, V>;
/**
 * For minification optimization. Exposed through {@link XMap.newXWeakMapGetter}.
 *
 * @ignore
 * @internal
 */
export declare const newXWeakMapGetter: <K extends WeakKey, V>(getDefaultV: DefaultValueGetter<K, V>) => () => XWeakMap<K, V>;
export declare abstract class XMapBase<K, V> {
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
    readonly delete: (key: K) => void;
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
    protected constructor(root: MapBase<K, V>, getDefaultV: DefaultValueGetter<K, V>);
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
export declare class XMap<K, V> extends XMapBase<K, V> implements Iterable<[K, V]> {
    /**
     * Returns the number of entries in the {@link XMap}.
     */
    readonly size: number;
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
    readonly [Symbol.iterator]: () => IterableIterator<[K, V]>;
    /**
     * Returns a function that when called returns a new {@link XMap}.
     *
     * You can pass this to the constructor of an {@link XMap} or an
     * {@link XWeakMap}, whose values are {@link XMap}s.
     */
    static readonly newXMapGetter: <K_1, V_1>(getDefaultV: DefaultValueGetter<K_1, V_1>) => () => XMap<K_1, V_1>;
    /**
     * @param {} getDefaultV  This function is called each time
     *                        {@link sGet} is called with a non-existent
     *                        key and must return a value that is then set for
     *                        that key and returned.
     */
    constructor(getDefaultV: DefaultValueGetter<K, V>);
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
export declare class XWeakMap<K extends WeakKey, V> extends XMapBase<K, V> {
    /**
     * Returns a function that when called returns a new {@link XWeakMap}.
     *
     * You can pass this to the constructor of an {@link XMap} or an
     * {@link XWeakMap}, whose values are {@link XWeakMap}s.
     */
    static readonly newXWeakMapGetter: <K_1 extends WeakKey, V_1>(getDefaultV: DefaultValueGetter<K_1, V_1>) => () => XWeakMap<K_1, V_1>;
    /**
     * @param {} getDefaultV  This function is called each time
     *                        {@link sGet} is called with a non-existent
     *                        key and must return a value that is then set for
     *                        that key and returned.
     */
    constructor(getDefaultV: DefaultValueGetter<K, V>);
}
//# sourceMappingURL=x-map.d.ts.map