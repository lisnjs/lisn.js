/**
 * @module Effects
 *
 * @since v1.3.0
 */

import * as _ from "@lisn/_internal";

import { Effect, EffectType } from "@lisn/effects/effect";

/**
 * Represents a map of effects, one per {@link Effect.type | type} that are
 * {@link Effect.toComposition | composed} together.
 */
export class FXComposition implements Iterable<[EffectType, Effect]> {
  readonly size!: number;

  /**
   * Adds a new effect to the composition. Will use the current effect for the
   * relevant type, if any, and compose it with the given.
   *
   * **IMPORTANT:** If you add an {@link Effect.isAbsolute | absolute} effect,
   * it discards all previous effects of the respective
   * {@link Effect.type | type}.
   */
  readonly add: (effect: Effect) => this;

  /**
   * Returns a new **live** copy of the composition, where each effect is
   * {@link Effect.toComposition | cloned} while preserving its handlers.
   */
  readonly clone: () => FXComposition;

  /**
   * Returns a new **static** copy of the composition, where each effect is
   * {@link Effect.export | exported}, discarding its handlers.
   */
  readonly export: () => FXComposition;

  readonly get: <T extends EffectType>(key: T) => Effect<T> | undefined;

  readonly delete: (key: EffectType) => boolean;
  readonly clear: () => void;

  readonly keys: () => IterableIterator<EffectType>;
  readonly values: () => IterableIterator<Effect>;
  readonly entries: <T extends EffectType>() => IterableIterator<
    [T, Effect<T>]
  >;
  readonly [Symbol.iterator]!: <T extends EffectType>() => IterableIterator<
    [T, Effect<T>]
  >;

  constructor() {
    const map: EffectsMap = new Map();

    const cloneOrExport = (asExport: boolean) => {
      const copy = new FXComposition();
      for (const [t__ignored, effect] of map) {
        copy.add((asExport ? effect.export : effect.toComposition)());
      }

      return copy;
    };

    _.defineProperty(this, "size", { get: () => map.size });

    const add = <T extends EffectType>(effect: Effect<T>) => {
      const current = map.get(effect.type);
      const composed =
        !current || effect.isAbsolute()
          ? effect
          : current.toComposition(effect);

      map.set(effect.type, composed);

      return this;
    };

    this.add = (effect) => add(effect);

    this.clone = () => cloneOrExport(false);
    this.export = () => cloneOrExport(true);

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
  get<T extends EffectType>(key: T): Effect<T> | undefined;
  set<T extends EffectType>(key: T, value: Effect<T>): this;
  has(key: EffectType): boolean;
  delete(key: EffectType): boolean;
  clear(): void;
  keys(): IterableIterator<EffectType>;
  values(): IterableIterator<Effect>;
  entries<T extends EffectType>(): IterableIterator<[T, Effect<T>]>;
  [Symbol.iterator]<T extends EffectType>(): IterableIterator<[T, Effect<T>]>;
}

_.brandClass(FXComposition, "FXComposition");
