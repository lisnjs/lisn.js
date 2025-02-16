function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Modules/BitSpaces
 */

import * as MH from "../globals/minification-helpers.js";
import { getBitmask } from "../utils/math.js";

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
export class BitSpaces {
  constructor() {
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
    const counter = newCounter();
    this.create = (...propNames) => newBitSpace(counter, propNames);
    MH.defineProperty(this, "nBits", {
      get: () => counter._nBits
    });
    MH.defineProperty(this, "bitmask", {
      get: () => counter._bitmask
    });
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
export const createBitSpace = (spaces, ...propNames) => spaces.create(...propNames);

// ----------------------------------------

const newCounter = () => ({
  _nBits: 0,
  _bitmask: 0
});
const newBitSpace = (counter, propNames) => {
  const start = counter._nBits;
  const end = start + MH.lengthOf(propNames) - 1;
  if (end >= 31) {
    throw MH.usageError("BitSpaces overflow");
  }
  const bitmask = getBitmask(start, end);
  const space = {
    bit: {},
    start,
    end,
    bitmask,
    has: p => MH.isString(p) && p in space.bit && MH.isNumber(space.bit[p]),
    bitmaskFor: (pStart, pEnd) => {
      if (!MH.isEmpty(pStart) && !space.has(pStart) || !MH.isEmpty(pEnd) && !space.has(pEnd)) {
        return 0;
      }
      const thisStart = !MH.isEmpty(pStart) ? MH.log2(space.bit[pStart]) : start;
      const thisEnd = !MH.isEmpty(pEnd) ? MH.log2(space.bit[pEnd]) : end;
      return getBitmask(thisStart, thisEnd);
    },
    nameOf: val => {
      var _propNames;
      return (_propNames = propNames[MH.log2(val) - start]) !== null && _propNames !== void 0 ? _propNames : null;
    }
  };
  for (const name of propNames) {
    MH.defineProperty(space.bit, name, {
      value: 1 << counter._nBits++,
      enumerable: true
    });
  }
  counter._bitmask |= bitmask;
  return space;
};
//# sourceMappingURL=bit-spaces.js.map