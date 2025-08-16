/**
 * @module Effects/FXComposition
 *
 * @since v1.3.0
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { Effect, EffectRegistry } from "@lisn/effects/effect";

/**
 * Represents a map of effects, one per {@link Effect.type | type} that are
 * {@link Effect.toComposition | composed} together.
 */
export class FXComposition implements Iterable<[keyof EffectRegistry, Effect]> {
  readonly size!: number;

  /**
   * Adds a new effect to the composition. Will use the current effect for the
   * relevant type, if any, and compose it with the given.
   */
  readonly add: <T extends keyof EffectRegistry>(effect: Effect<T>) => this;

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

  readonly get: <T extends keyof EffectRegistry>(
    key: T,
  ) => Effect<T> | undefined;

  readonly delete: <T extends keyof EffectRegistry>(key: T) => boolean;
  readonly clear: () => void;

  readonly keys: () => IterableIterator<keyof EffectRegistry>;
  readonly values: () => IterableIterator<Effect>;
  readonly entries: <T extends keyof EffectRegistry>() => IterableIterator<
    [T, Effect<T>]
  >;
  readonly [Symbol.iterator]!: <
    T extends keyof EffectRegistry,
  >() => IterableIterator<[T, Effect<T>]>;

  constructor() {
    const map: EffectsMap = new Map();

    MH.defineProperty(this, "size", { get: () => map.size });

    this.add = (effect) => {
      map.set(
        effect.type,
        map.get(effect.type)?.toComposition(effect) ?? effect,
      );

      return this;
    };

    this.clone = () => {
      const copy = new FXComposition();
      for (const effect of map.values()) {
        copy.add(effect.toComposition());
      }

      return copy;
    };

    this.export = () => {
      const copy = new FXComposition();
      for (const effect of map.values()) {
        copy.add(effect.export());
      }

      return copy;
    };

    this.get = (key) => map.get(key);
    this.delete = (key) => map.delete(key);
    this.clear = () => map.clear();

    this.keys = () => map.keys();
    this.values = () => map.values();
    this.entries = () => map.entries();
    this[MC.SYMBOL.iterator] = () => map[MC.SYMBOL.iterator]();
  }
}

// ------------------------------

interface EffectsMap {
  size: number;
  get<T extends keyof EffectRegistry>(key: T): Effect<T> | undefined;
  set<T extends keyof EffectRegistry>(key: T, value: Effect<T>): this;
  has<T extends keyof EffectRegistry>(key: T): boolean;
  delete<T extends keyof EffectRegistry>(key: T): boolean;
  clear(): void;
  keys(): IterableIterator<keyof EffectRegistry>;
  values(): IterableIterator<Effect<keyof EffectRegistry>>;
  entries<T extends keyof EffectRegistry>(): IterableIterator<[T, Effect<T>]>;
  [Symbol.iterator]<T extends keyof EffectRegistry>(): IterableIterator<
    [T, Effect<T>]
  >;
}
