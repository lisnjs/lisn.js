const { describe, test, expect } = require("@jest/globals");

const { FXComposer, FXComposition, Transform } = window.LISN.effects;

const newDummyTransform = (type) =>
  class extends Transform {
    type = type;

    constructor(conf) {
      super(conf);

      const exportFn = this.export;
      const toCompositionFn = this.toComposition;

      this.export = (n) => {
        const res = exportFn(n);
        res.type = this.type;
        return res;
      };

      this.toComposition = (...o) => {
        const res = toCompositionFn(...o);
        res.type = this.type;
        return res;
      };
    }
  };

const EffectA = newDummyTransform("effect-a");
const EffectB = newDummyTransform("effect-b");

const DEFAULT_COMPOSER = new FXComposer();

const DUMMY_STATE = {
  x: {
    min: -Number.MAX_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER,
    initial: 0,
    previous: 0,
    current: 0,
    target: 500,
    lag: 0,
    depth: 1,
    snap: false,
  },
  y: {
    min: -Number.MAX_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER,
    initial: 0,
    previous: 0,
    current: 0,
    target: 50,
    lag: 0,
    depth: 1,
    snap: false,
  },
  z: {
    min: -Number.MAX_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER,
    initial: 0,
    previous: 0,
    current: 0,
    target: 5,
    lag: 0,
    depth: 1,
    snap: true,
  },
};

const newTestMatrix = (toValue = (i) => i + 1) => {
  const init = new Float32Array(16);
  for (let i = 0; i < 16; i++) {
    init[i] = toValue(i);
  }
  return new DOMMatrix(init);
};

describe("FXComposition", () => {
  const initA1 = newTestMatrix((i) => i + 1);
  const initA2 = newTestMatrix((i) => i + 2);
  const initB1 = newTestMatrix((i) => i + 3);
  const initB2 = newTestMatrix((i) => i + 4);

  test("get/delete/clear/size", () => {
    const c = new FXComposition();

    const eA1 = new EffectA();
    const eA2 = new EffectA();
    const eB1 = new EffectB();
    const eB2 = new EffectB();

    expect(c.get("non-existent")).toBeUndefined();
    expect(c.get("effect-a")).toBeUndefined();
    expect(c.size).toBe(0);

    c.size = 1; // readonly
    expect(c.size).toBe(0);

    c.add(eA1);
    expect(c.get("effect-a")).toBe(eA1);
    expect(c.size).toBe(1);

    c.add(eA2);
    expect(c.get("effect-a")).not.toBeUndefined();
    expect(c.size).toBe(1); // composed with previous

    c.add(eB1);
    expect(c.get("effect-b")).toBe(eB1);
    expect(c.size).toBe(2);

    c.add(eB2);
    expect(c.get("effect-b")).not.toBeUndefined();
    expect(c.size).toBe(2); // composed with previous

    c.delete("effect-a");
    expect(c.get("effect-a")).toBeUndefined();
    expect(c.size).toBe(1);

    c.add(eA1);
    expect(c.size).toBe(2);

    c.clear();
    expect(c.get("effect-a")).toBeUndefined();
    expect(c.get("effect-b")).toBeUndefined();
    expect(c.size).toBe(0);
  });

  test("add", () => {
    const c = new FXComposition();

    const eA1 = new EffectA({ init: initA1 });
    const eA2 = new EffectA({ init: initA2 });
    const eB1 = new EffectB({ init: initB1 });
    const eB2 = new EffectB({ init: initB2 });

    expect(c.add(eA1)).toBe(c); // first one of type, it will be saved as is
    expect(c.get("effect-a")).toBe(eA1);

    c.add(eB1); // first one of type, it will be saved as is
    expect(c.get("effect-b")).toBe(eB1);

    expect(c.get("effect-a")).toBe(eA1); // unchanged

    c.add(eB2); // second one of type, it will be composed
    const composedB = c.get("effect-b");
    expect(c.get("effect-b")).toBe(composedB); // same composed instance as before
    expect(composedB).not.toBe(eB1);
    expect(composedB).not.toBe(eB2);
    expect(composedB).toBeCloseToArray(eB1.toComposition(eB2));

    c.add(eA2); // second one of type, it will be composed
    const composedA = c.get("effect-a");
    expect(composedA).not.toBe(eA1);
    expect(composedA).not.toBe(eA2);
    expect(composedA).toBeCloseToArray(eA1.toComposition(eA2));

    expect(c.get("effect-b")).toBe(composedB); // unchanged
  });

  test("clone", () => {
    const orig = new FXComposition();
    const effect = new EffectA({ init: initA1 });
    effect.translate(() => ({ x: 10, y: 10, z: 10 }));

    orig.add(effect);

    const clone = orig.clone();
    expect(clone).not.toBe(orig);

    expect(orig.get("effect-a")).toBe(effect);

    const effectClone = clone.get("effect-a");
    expect(effectClone).not.toBeUndefined();
    expect(effectClone).not.toBe(effect); // new instance
    expect(effectClone).toBeCloseToArray(effect);

    effect.update(DUMMY_STATE, DEFAULT_COMPOSER);
    expect(effect).toBeCloseToArray(initA1.translate(10, 10, 10));

    // clone unchanged
    expect(effectClone).toBeCloseToArray(initA1);

    effectClone.update(DUMMY_STATE, DEFAULT_COMPOSER);
    // clone preserved handlers
    expect(effectClone).toBeCloseToArray(initA1.translate(10, 10, 10));

    // original unchanged since last update
    expect(effect).toBeCloseToArray(initA1.translate(10, 10, 10));
  });

  test("export", () => {
    const orig = new FXComposition();
    const effect = new EffectA({ init: initA1 });
    effect.translate(() => ({ x: 10, y: 10, z: 10 }));

    orig.add(effect);

    const exported = orig.export();
    expect(exported).not.toBe(orig);

    expect(orig.get("effect-a")).toBe(effect);

    const effectExported = exported.get("effect-a");
    expect(effectExported).not.toBeUndefined();
    expect(effectExported).not.toBe(effect); // new instance
    expect(effectExported).toBeCloseToArray(effect);

    effect.update(DUMMY_STATE, DEFAULT_COMPOSER);
    expect(effect).toBeCloseToArray(initA1.translate(10, 10, 10));

    // exported unchanged
    expect(effectExported).toBeCloseToArray(initA1);

    effectExported.update(DUMMY_STATE, DEFAULT_COMPOSER);
    // export discarded handlers, unchanged
    expect(effectExported).toBeCloseToArray(initA1);

    // original unchanged since last update
    expect(effect).toBeCloseToArray(initA1.translate(10, 10, 10));
  });

  test("keys/values/entries/forEach/Symbol.iterator", () => {
    const c = new FXComposition();

    const eA = new EffectA();
    const eB = new EffectB();

    c.add(eB).add(eA);

    expect([...c.keys()]).toEqual(["effect-b", "effect-a"]);
    expect([...c.values()]).toEqual([eB, eA]);
    expect([...c.entries()]).toEqual([
      ["effect-b", eB],
      ["effect-a", eA],
    ]);

    // Symbol.iterator
    expect([...c]).toEqual([
      ["effect-b", eB],
      ["effect-a", eA],
    ]);
  });
});
