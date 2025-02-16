/**
 * @module Modules/BitSpaces
 */

import * as MH from "@lisn/globals/minification-helpers";

import { getBitmask } from "@lisn/utils/math";

export type BitPropName = string;

/**
 * A union of all property names in the space.
 */
export type BitSpaceKey<S> = S extends BitSpace<infer T> ? T : never;

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
export type BitSpace<T extends BitPropName> = {
  /**
   * The starting bit of the space. It's 0 for the first space created in a
   * given set of {@link BitSpaces}.
   */
  start: number;

  /**
   * The ending bit of the space. It's always equal to
   * start + (# of properties in space) - 1
   */
  end: number;

  /**
   * A bitmask of all values in the space.
   */
  bitmask: number;

  /**
   * Returns true if the given name is one of the properties in the space.
   * It is case-sensitive.
   */
  has: (p: string) => p is T;

  /**
   * Takes the names of two properties within the space and returns a bitmask
   * that covers all values between them _including the starting and ending
   * one_.*
   *
   * If pStart > pEnd, they are reversed.
   *
   * * The numeric values of the properties are guaranteed to be in the same
   *   order, increasing in value, as the keys passed to the `BitSpaces.create`,
   *   function.
   *
   * @param {} pStart  The name of the property that holds the start value.
   *                   If null the bitmask will cover from the lowest property.
   * @param {} pEnd    The name of the property that holds the end cut-off
   *                   value for the bitmask. The bitmask with _not_ include
   *                   pEnd's value.
   *                   If null the bitmask will cover to the highest property,
   *                   _including_.
   *
   * @returns {} Returns a non-0 bitmask containing all values in the space
   *             between the given ones.
   *             Returns 0 if one or both of the given properties do not exist
   *             in the space.
   */
  bitmaskFor: (pStart?: T | null, pEnd?: T | null) => number;

  /**
   * Returns the name of the property with the given value, or null if the
   * value does not correspond to one of the space properties.
   */
  nameOf: (val: number) => T | null;

  /**
   * Holds properties whose numeric values are non-overlapping binary values,
   * suitable for bitmasking.
   *
   * The given properties are set under the "bit" key in the object and hold
   * the numeric value.
   *
   * @example
   * ```javascript
   * const space = new BitSpaces().create("up", "down", "left", "right");
   *
   * // {
   * //     bit: {
   * //         up:    1, // at bit 0, i.e. 1 << 0
   * //         down:  2, // at bit 1, i.e. 1 << 1
   * //         left:  4, // at bit 2, i.e. 1 << 2
   * //         right: 8, // at bit 3, i.e. 1 << 3
   * //     },
   * //     start:      0,
   * //     end:        3,
   * //     bitmask:    15, // 1 << 0 | 1 << 1 | 1 << 2 | 1 << 3
   * //     has:        (p) => p === "up" || p === "down" || p === "left" || p === "right",
   * //     bitmaskFor: (pStart, pEnd) => ...
   * //     nameOf:     (v) => v === 1 ? "up" : v === 2 ? "down" : v === 4 ...
   * // }
   *
   * space.bitmaskFor(); // => space.bitmask (15)
   * space.bitmaskFor("left"); // => space.bit.left | space.bit.right (12)
   * space.bitmaskFor(null, "down"); // => space.bit.up | space.bit.down (3)
   * ```
   */
  bit: {
    [key in T]: number;
  };
};

/**
 * {@link BitSpaces} represents one or more related {@link BitSpace}s whose bit
 * values will not overlap.
 */
export class BitSpaces {
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
  readonly create: <T extends BitPropName>(
    ...propNames: readonly T[]
  ) => BitSpace<T>;

  /**
   * Returns the number of bits all created spaces span, i.e. the end bit of
   * the one + 1.
   */
  readonly nBits!: number;

  /**
   * Returns a bitmask containing all values in all created spaces.
   */
  readonly bitmask!: number;

  constructor() {
    const counter = newCounter();

    this.create = (...propNames) => newBitSpace(counter, propNames);
    MH.defineProperty(this, "nBits", { get: () => counter._nBits });
    MH.defineProperty(this, "bitmask", { get: () => counter._bitmask });
  }
}

/**
 * For minification optimization
 *
 * @ignore
 * @internal
 */
export const newBitSpaces = () => new BitSpaces();

/**
 * For minification optimization
 *
 * @ignore
 * @internal
 */
export const createBitSpace = <T extends BitPropName>(
  spaces: BitSpaces,
  ...propNames: readonly T[]
): BitSpace<T> => spaces.create(...propNames);

// ----------------------------------------

type BitCounter = {
  _nBits: number;
  _bitmask: number;
};

const newCounter = (): BitCounter => ({
  _nBits: 0,
  _bitmask: 0,
});

const newBitSpace = <T extends BitPropName>(
  counter: BitCounter,
  propNames: readonly T[],
): BitSpace<T> => {
  const start = counter._nBits;
  const end = start + MH.lengthOf(propNames) - 1;
  if (end >= 31) {
    throw MH.usageError("BitSpaces overflow");
  }

  const bitmask = getBitmask(start, end);
  const space: BitSpace<T> = {
    bit: {},
    start,
    end,
    bitmask,

    has: (p) =>
      MH.isString(p) &&
      p in space.bit &&
      MH.isNumber((space.bit as Record<string, unknown>)[p]),

    bitmaskFor: (pStart, pEnd) => {
      if (
        (!MH.isEmpty(pStart) && !space.has(pStart)) ||
        (!MH.isEmpty(pEnd) && !space.has(pEnd))
      ) {
        return 0;
      }

      const thisStart = !MH.isEmpty(pStart)
        ? MH.log2(space.bit[pStart])
        : start;
      const thisEnd = !MH.isEmpty(pEnd) ? MH.log2(space.bit[pEnd]) : end;

      return getBitmask(thisStart, thisEnd);
    },

    nameOf: (val) => propNames[MH.log2(val) - start] ?? null,
  } as BitSpace<T>;

  for (const name of propNames) {
    MH.defineProperty(space.bit, name, {
      value: 1 << counter._nBits++,
      enumerable: true,
    });
  }

  counter._bitmask |= bitmask;

  return space;
};
