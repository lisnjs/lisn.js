/**
 * @module Effects
 *
 * @since v1.3.0
 */

import * as _ from "@lisn/_internal";

import type { EffectInstance, EffectName } from "@lisn/effects/effect";
import type { FXPin } from "@lisn/effects/fx-pin";

/**
 * Represents a map of effects, one per
 * {@link Effects.EffectInstanceInterface.type | type} that are
 * {@link Effects.EffectInstanceInterface.toComposition | composed} together.
 *
 * @category Composer
 */
export class FXComposition implements Iterable<[EffectName, EffectInstance]> {
  readonly size!: number;

  /**
   * Adds a new effect instance to the composition. Will use the current effect
   * for the relevant type, if any, and compose it with the given.
   *
   * **IMPORTANT:** If you add an
   * {@link Effects.EffectConfig.isAbsolute | absolute} effect, it discards
   * all previous effects of the respective
   * {@link Effects.EffectInstanceInterface.type | type}.
   */
  readonly add: (instance: EffectInstance) => this;

  /**
   * Returns a copy of the composition, where each effect is
   * {@link Effects.EffectInstanceInterface.clone | cloned}.
   *
   * @param discardUpdaters See {@link Effects.EffectInstanceInterface.clone}
   */
  readonly clone: (options?: {
    pin?: FXPin | false;
    discardUpdaters?: boolean;
  }) => FXComposition;

  readonly get: <T extends EffectName>(key: T) => EffectInstance<T> | undefined;

  readonly delete: (key: EffectName) => boolean;
  readonly clear: () => void;

  readonly keys: () => IterableIterator<EffectName>;
  readonly values: () => IterableIterator<EffectInstance>;
  readonly entries: <T extends EffectName>() => IterableIterator<
    [T, EffectInstance<T>]
  >;
  readonly [Symbol.iterator]!: <T extends EffectName>() => IterableIterator<
    [T, EffectInstance<T>]
  >;

  constructor() {
    const map: EffectsMap = new Map();

    _.defineProperty(this, "size", { get: () => map.size });

    const add = <T extends EffectName>(instance: EffectInstance<T>) => {
      const current = map.get(instance.type);
      const composed =
        !current || instance.isAbsolute()
          ? instance
          : current.toComposition(instance);

      map.set(instance.type, composed);

      return this;
    };

    this.add = (instance) => add(instance);

    this.clone = (options) => {
      const copy = new FXComposition();
      for (const instance of map.values()) {
        copy.add(instance.clone(options));
      }

      return copy;
    };

    this.get = (key) => map.get(key);
    this.delete = (key) => map.delete(key);
    this.clear = () => map.clear();

    this.keys = () => map.keys();
    this.values = () => map.values();
    this.entries = () => map.entries();
    this[_.SYMBOL.iterator] = () => map[_.SYMBOL.iterator]();
  }
}

// ------------------------------

interface EffectsMap {
  size: number;
  get<T extends EffectName>(key: T): EffectInstance<T> | undefined;
  set<T extends EffectName>(key: T, value: EffectInstance<T>): this;
  has(key: EffectName): boolean;
  delete(key: EffectName): boolean;
  clear(): void;
  keys(): IterableIterator<EffectName>;
  values(): IterableIterator<EffectInstance>;
  entries<T extends EffectName>(): IterableIterator<[T, EffectInstance<T>]>;
  [Symbol.iterator]<T extends EffectName>(): IterableIterator<
    [T, EffectInstance<T>]
  >;
}

_.brandClass(FXComposition, "FXComposition");
