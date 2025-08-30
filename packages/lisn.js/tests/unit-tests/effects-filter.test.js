const { jest, describe, test, expect } = require("@jest/globals");

const { deepCopy, copyExistingKeysTo } = window.LISN._;
const { Filter, FXComposer, toParameters } = window.LISN.effects;

const DEFAULT_COMPOSER = new FXComposer();

const FILTER_NAMES = [
  "brightness",
  "blur",
  "contrast",
  "dropShadow",
  "grayscale",
  "hueRotate",
  "invert",
  "opacity",
  "saturate",
  "sepia",
];

const DEFAULT_TWEEN_STATE = {
  x: 0,
  nx: 0,
  y: 0,
  ny: 0,
  z: 0,
  nz: 0,
};

const DUMMY_STATE = {
  x: {
    low: -1000,
    high: 1000,
    initial: 0,
    previous: 0,
    current: 0,
    target: 500,
    lag: 0,
    depth: 1,
    snap: false,
  },
  y: {
    low: -100,
    high: 100,
    initial: 0,
    previous: 0,
    current: 0,
    target: 50,
    lag: 0,
    depth: 1,
    snap: false,
  },
  z: {
    low: -10,
    high: 10,
    initial: 0,
    previous: 0,
    current: 0,
    target: 5,
    lag: 0,
    depth: 1,
    snap: true,
  },
};

const DUMMY_STATE2 = {
  x: {
    low: -3000,
    high: 3000,
    initial: 0,
    previous: 0,
    current: 0,
    target: 700,
    lag: 0,
    depth: 1,
    snap: false,
  },
  y: {
    low: -300,
    high: 300,
    initial: 0,
    previous: 0,
    current: 0,
    target: 70,
    lag: 0,
    depth: 1,
    snap: false,
  },
  z: {
    low: -30,
    high: 30,
    initial: 0,
    previous: 0,
    current: 0,
    target: 7,
    lag: 0,
    depth: 1,
    snap: true,
  },
};

const DUMMY_INIT = [
  ["brightness", 1.5],
  ["contrast", null],
  ["brightness", 0.8],
  ["blur", 3],
];

const DUMMY_INIT_RESOLVED = [
  ["brightness", 1.5],
  ["contrast", 1],
  ["brightness", 0.8],
  ["blur", 3],
];

const DUMMY_INIT_STR = "brightness(1.5) brightness(0.8) blur(3px)";
const DUMMY_INIT_RESOLVED_STR =
  "brightness(1.5) contrast(1) brightness(0.8) blur(3px)";

const newFilter = (init) => new Filter({ init });

const newAbsoluteFilter = (init) => new Filter({ init, isAbsolute: true });

const newState = (partial = {}) => {
  const res = deepCopy(DUMMY_STATE);
  copyExistingKeysTo(partial, res);
  return res;
};

describe("basic", () => {
  for (const isAbsolute of [true, false]) {
    test(`${isAbsolute ? "absolute" : "incremental"}: no init`, () => {
      const f = isAbsolute ? newAbsoluteFilter() : newFilter();
      expect(f.isAbsolute()).toBe(isAbsolute);
      expect(f.toEntries()).toEqual([]);
      expect(f.toString()).toBe("none");
    });

    test(`${isAbsolute ? "absolute" : "incremental"}: with init`, () => {
      const initCopy = deepCopy(DUMMY_INIT);
      const f = isAbsolute
        ? newAbsoluteFilter(DUMMY_INIT)
        : newFilter(DUMMY_INIT);
      expect(f.isAbsolute()).toBe(isAbsolute);

      expect(f.toEntries()).toEqual(DUMMY_INIT);
      expect(f.toEntries()).not.toBe(DUMMY_INIT); // copied
      expect(f.toEntries()[0]).not.toBe(DUMMY_INIT[0]); // deeply copied

      expect(f.toString()).toBe(DUMMY_INIT_STR);

      f.blur(() => 100);
      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).not.toEqual(DUMMY_INIT);
      expect(DUMMY_INIT).toEqual(initCopy); // not modified
    });

    test(`${isAbsolute ? "absolute" : "incremental"}: overflowing values in init`, () => {
      const init = [
        ["brightness", -0.1],
        ["sepia", 1.2],
        ["dropShadow", { color: { h: 380, s: -10, l: 120 } }],
      ];

      const f = isAbsolute ? newAbsoluteFilter(init) : newFilter(init);
      expect(f.toEntries()).toEqual([
        ["brightness", 0],
        ["sepia", 1],
        [
          "dropShadow",
          {
            color: { h: 20, s: 0, l: 100, a: 1 },
            offsetX: 0,
            offsetY: 0,
            blur: 0,
          },
        ],
      ]);
    });
  }

  test("with init: invalid filter name", () => {
    expect(() => newFilter([["foo", 1]])).toThrow(/Unknown filter type 'foo'/);
  });

  test("modifying init", () => {
    const init = deepCopy(DUMMY_INIT);
    const copy = deepCopy(DUMMY_INIT);
    const f = newFilter(init);

    init[0][1] = 20;

    // not modified
    expect(f.toEntries()).not.toEqual(init);
    expect(f.toEntries()).toEqual(copy);
  });
});

describe("update", () => {
  for (const isAbsolute of [true, false]) {
    test(`${isAbsolute ? "absolute" : "incremental"}: basic`, () => {
      const f = isAbsolute ? newAbsoluteFilter() : newFilter();
      for (const [method, value] of DUMMY_INIT) {
        f[method](() => value ?? 1);
      }
      expect(f.toEntries()).toEqual([]);

      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).toEqual(DUMMY_INIT_RESOLVED);
      expect(f.toString()).toEqual(DUMMY_INIT_RESOLVED_STR);
    });

    test(`${isAbsolute ? "absolute" : "incremental"}: no init`, () => {
      const f = isAbsolute ? newAbsoluteFilter() : newFilter();
      expect(f.isAbsolute()).toBe(isAbsolute);

      let hasCalled = false;

      const expectedIntermediate = [];
      const expectedFinal = [];
      for (const [method, value] of DUMMY_INIT) {
        const ret = value ?? 1;
        f[method](() => ret + (hasCalled ? 1 : 0));
        expectedIntermediate.push([method, ret]);
        expectedFinal.push([method, (isAbsolute ? 0 : ret) + ret + 1]);
      }

      // not updated yet
      expect(f.toEntries()).toEqual([]);

      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      hasCalled = true;
      expect(f.toEntries()).toEqual(expectedIntermediate);

      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).toEqual(expectedFinal);
    });

    test(`${isAbsolute ? "absolute" : "incremental"}: init but no handlers`, () => {
      const f = isAbsolute
        ? newAbsoluteFilter(DUMMY_INIT)
        : newFilter(DUMMY_INIT);
      expect(f.isAbsolute()).toBe(isAbsolute);

      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).toEqual(isAbsolute ? [] : DUMMY_INIT);
    });

    test(`${isAbsolute ? "absolute" : "incremental"}: with init`, () => {
      const f = isAbsolute
        ? newAbsoluteFilter(DUMMY_INIT)
        : newFilter(DUMMY_INIT);
      expect(f.isAbsolute()).toBe(isAbsolute);

      const expectedIntermediate = [];
      const expectedFinal = [];
      for (const [method, value] of DUMMY_INIT) {
        const ret = (value ?? 1) * 0.5;
        f[method](() => ret);
        const expInt = (isAbsolute ? 0 : (value ?? 0)) + ret;
        expectedIntermediate.push([
          method,
          (isAbsolute ? 0 : (value ?? 0)) + ret,
        ]);
        expectedFinal.push([method, (isAbsolute ? 0 : expInt) + ret]);
      }

      // not updated yet
      expect(f.toEntries()).toEqual(DUMMY_INIT);

      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).toEqual(expectedIntermediate);

      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).toEqual(expectedFinal);
    });

    test(`${isAbsolute ? "absolute" : "incremental"}: with mismatching init (mismatch at i=0)`, () => {
      const mismatchingInit = [
        ["brightness", 0.8],
        ["blur", 2],
      ];

      const f = isAbsolute
        ? newAbsoluteFilter(mismatchingInit)
        : newFilter(mismatchingInit);
      expect(f.isAbsolute()).toBe(isAbsolute);

      let hasCalled = false;
      f.blur(() => (hasCalled ? 2 : 1) * 3); // adds new entry
      f.brightness(() => (hasCalled ? 2 : 1) * 0.1); // adds new entry

      let expectedIntermediate, expectedFinal;
      if (isAbsolute) {
        // init discarded
        expectedIntermediate = [
          ["blur", 3],
          ["brightness", 0.1],
        ];
        expectedFinal = [
          ["blur", 2 * 3],
          ["brightness", 2 * 0.1],
        ];
      } else {
        expectedIntermediate = [
          ["brightness", 0.8], // preserved
          ["blur", 2], // preserved
          ["blur", 3],
          ["brightness", 0.1],
        ];
        expectedFinal = [
          ["brightness", 0.8], // preserved
          ["blur", 2], // preserved
          ["blur", 3 + 2 * 3],
          ["brightness", 0.1 + 2 * 0.1],
        ];
      }

      // not updated yet
      expect(f.toEntries()).toEqual(mismatchingInit);

      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      hasCalled = true;
      expect(f.toEntries()).toEqual(expectedIntermediate);

      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).toEqual(expectedFinal);
    });

    test(`${isAbsolute ? "absolute" : "incremental"}: with mismatching init (mismatch at i=2)`, () => {
      const mismatchingInit = [
        ["brightness", 1.5],
        ["contrast", 1.2],
        ["brightness", 0.8],
        ["blur", 2],
      ];

      const f = isAbsolute
        ? newAbsoluteFilter(mismatchingInit)
        : newFilter(mismatchingInit);
      expect(f.isAbsolute()).toBe(isAbsolute);

      let hasCalled = false;
      f.brightness(() => (hasCalled ? 2 : 1) * 0.2);
      f.contrast(() => (isAbsolute ? 1 : 0) - (hasCalled ? 2 : 1) * 0.1);
      f.blur(() => (hasCalled ? 2 : 1) * 3); // adds new entry
      f.brightness(() => (hasCalled ? 2 : 1) * 0.1); // adds new entry

      let expectedIntermediate, expectedFinal;
      if (isAbsolute) {
        // init discarded
        expectedIntermediate = [
          ["brightness", 0.2],
          ["contrast", 1 - 0.1],
          ["blur", 3],
          ["brightness", 0.1],
        ];
        expectedFinal = [
          ["brightness", 2 * 0.2],
          ["contrast", 1 - 2 * 0.1],
          ["blur", 2 * 3],
          ["brightness", 2 * 0.1],
        ];
      } else {
        expectedIntermediate = [
          ["brightness", 1.5 + 0.2],
          ["contrast", 1.2 - 0.1],
          ["brightness", 0.8], // preserved
          ["blur", 2], // preserved
          ["blur", 3],
          ["brightness", 0.1],
        ];
        expectedFinal = [
          ["brightness", 1.5 + 3 * 0.2],
          ["contrast", 1.2 + 3 * -0.1],
          ["brightness", 0.8], // preserved
          ["blur", 2], // preserved
          ["blur", 3 * 3],
          ["brightness", 3 * 0.1],
        ];
      }

      // not updated yet
      expect(f.toEntries()).toEqual(mismatchingInit);

      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      hasCalled = true;
      expect(f.toEntries()).toEqual(expectedIntermediate);

      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).toEqual(expectedFinal);
    });

    test(`${isAbsolute ? "absolute" : "incremental"}: adding handlers after update`, () => {
      const f = isAbsolute ? newAbsoluteFilter() : newFilter();
      f.brightness(() => 1.5);
      f.contrast(() => 0.7);

      // not updated yet
      expect(f.toEntries()).toEqual([]);
      expect(f.toString()).toBe("none");

      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).toEqual([
        ["brightness", 1.5],
        ["contrast", 0.7],
      ]);
      expect(f.toString()).toBe("brightness(1.5) contrast(0.7)");

      // new handlers
      f.brightness(() => 0.8);
      f.blur(() => 4);

      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).toEqual([
        ["brightness", (isAbsolute ? 1 : 2) * 1.5],
        ["contrast", (isAbsolute ? 1 : 2) * 0.7],
        ["brightness", 0.8],
        ["blur", 4],
      ]);
      expect(f.toString()).toBe(
        `brightness(${(isAbsolute ? 1 : 2) * 1.5}) ` +
          `contrast(${(isAbsolute ? 1 : 2) * 0.7}) brightness(0.8) blur(4px)`,
      );
    });
  }

  for (const isAbsolute of [true, false]) {
    test(`${isAbsolute ? "absolute" : "incremental"}: overflowing values in handler return`, () => {
      const f = isAbsolute ? newAbsoluteFilter() : newFilter();
      f.brightness(() => -0.1);
      f.sepia(() => 1.2);
      f.dropShadow(() => ({ color: { h: 380, s: -10, l: 120 } }));

      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).toEqual([
        ["brightness", 0],
        ["sepia", 1],
        [
          "dropShadow",
          {
            color: { h: 20, s: 0, l: 100, a: 1 },
            offsetX: 0,
            offsetY: 0,
            blur: 0,
          },
        ],
      ]);
    });

    test(`${isAbsolute ? "absolute" : "incremental"}: returning undefined: no init`, () => {
      const f = isAbsolute ? newAbsoluteFilter() : newFilter();
      f.brightness(() => {});
      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).toEqual([["brightness", null]]);
    });

    test(`${isAbsolute ? "absolute" : "incremental"}: returning undefined: with init`, () => {
      const init = [["brightness", 0.3]];
      const f = isAbsolute ? newAbsoluteFilter(init) : newFilter(init);
      f.brightness(() => {});
      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).toEqual([["brightness", isAbsolute ? null : 0.3]]);
    });
  }
});

describe("update parameters", () => {
  for (const isAbsolute of [true, false]) {
    test(`${isAbsolute ? "" : "absolute: "}basic`, () => {
      const f = isAbsolute ? newAbsoluteFilter() : newFilter();
      const cbk = jest.fn((p) => p.nx);
      f.opacity(cbk);

      const params = toParameters(DUMMY_STATE, DEFAULT_COMPOSER, {
        isAbsolute,
      });
      f.update(DUMMY_STATE, DEFAULT_COMPOSER);

      expect(cbk).toHaveBeenCalledTimes(1);
      expect(cbk).toHaveBeenNthCalledWith(
        1,
        params,
        DUMMY_STATE,
        DEFAULT_COMPOSER,
      );

      f.update(DUMMY_STATE2, DEFAULT_COMPOSER);
      const params2 = toParameters(DUMMY_STATE2, DEFAULT_COMPOSER, {
        isAbsolute,
      });

      expect(cbk).toHaveBeenCalledTimes(2);
      expect(cbk).toHaveBeenNthCalledWith(
        2,
        params2,
        DUMMY_STATE2,
        DEFAULT_COMPOSER,
      );
    });
  }
});

describe("export", () => {
  for (const isAbsolute of [true, false]) {
    test(`${isAbsolute ? "absolute" : "incremental"}: no init`, () => {
      const f = isAbsolute ? newAbsoluteFilter() : newFilter();
      for (const [method, value] of DUMMY_INIT) {
        f[method](() => value ?? 1);
      }
      expect(f.toEntries()).toEqual([]);

      const exported = f.export();
      expect(exported.toEntries()).toEqual([]);
      expect(exported.isAbsolute()).toBe(isAbsolute);

      // update original
      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).toEqual(DUMMY_INIT_RESOLVED);

      // exported unchanged
      expect(exported.toEntries()).toEqual([]);

      // update exported
      exported.update(DUMMY_STATE, DEFAULT_COMPOSER);

      // original unchanged
      expect(f.toEntries()).toEqual(DUMMY_INIT_RESOLVED);

      // exported is static and detached from f's state and handlers
      expect(exported.toEntries()).toEqual([]);
    });

    test(`${isAbsolute ? "absolute" : "incremental"}: with init`, () => {
      const init = [
        ["brightness", 1.5],
        ["contrast", null],
        ["brightness", 0.8],
        ["blur", 3],
      ];

      let expected;
      if (isAbsolute) {
        expected = [
          ["brightness", 1.5],
          ["contrast", 1],
          ["brightness", 0.8],
          ["blur", 3],
        ];
      } else {
        expected = [
          ["brightness", 3],
          ["contrast", 1],
          ["brightness", 1.6],
          ["blur", 6],
        ];
      }

      const f = isAbsolute ? newAbsoluteFilter(init) : newFilter(init);
      for (const [method, value] of init) {
        f[method](() => value ?? 1);
      }

      expect(f.toEntries()).toEqual(init);

      const exported = f.export();
      expect(exported.toEntries()).toEqual(init);
      expect(exported.isAbsolute()).toBe(isAbsolute);

      // update original
      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).toEqual(expected);

      // exported unchanged
      expect(exported.toEntries()).toEqual(init);

      // update export
      exported.update(DUMMY_STATE, DEFAULT_COMPOSER);

      // original unchanged
      expect(f.toEntries()).toEqual(expected);

      // exported is static and detached from f's state and handlers and resets
      // itself on update if absolute
      if (isAbsolute) {
        expect(exported.toEntries()).toEqual([]);
      } else {
        expect(exported.toEntries()).toEqual(init);
      }
    });

    test(`${isAbsolute ? "absolute" : "incremental"}: after update`, () => {
      let hasCalled = false;
      const f = isAbsolute ? newAbsoluteFilter() : newFilter();
      for (const [method, value] of DUMMY_INIT) {
        f[method](() => (hasCalled ? 2 : 1) * (value ?? 1));
      }
      expect(f.toEntries()).toEqual([]);

      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      hasCalled = true;
      const newEntries = f.toEntries();

      const exported = f.export();
      expect(exported.toEntries()).toEqual(newEntries);
      expect(exported.isAbsolute()).toBe(isAbsolute);

      // update original again
      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      const newEntries2 = f.toEntries();
      expect(newEntries2).not.toEqual(newEntries);

      // exported unchanged
      expect(exported.toEntries()).toEqual(newEntries);

      // update exported
      exported.update(DUMMY_STATE, DEFAULT_COMPOSER);

      // static and detached from f's state and handlers and resets itself on
      // update if absolute
      if (isAbsolute) {
        expect(exported.toEntries()).toEqual([]);
      } else {
        expect(exported.toEntries()).toEqual(newEntries);
      }

      // original unchanged
      expect(f.toEntries()).toEqual(newEntries2);
    });
  }

  test("add handlers after export", () => {
    const f = newFilter();
    f.brightness(() => 1.5);

    const exported = f.export(); // discards brightness handler

    f.contrast(() => 1.2); // does not affect exported
    exported.contrast(() => 1.4); // does not affect original
    exported.blur(() => 3); // does not affect original

    const expectedO = [
      ["brightness", 1.5],
      ["contrast", 1.2],
    ];
    const expectedE = [
      ["contrast", 1.4],
      ["blur", 3],
    ];

    expect(f.toEntries()).toEqual([]);
    expect(exported.toEntries()).toEqual([]);

    f.update(DUMMY_STATE, DEFAULT_COMPOSER);
    exported.update(DUMMY_STATE, DEFAULT_COMPOSER);

    expect(f.toEntries()).toEqual(expectedO);
    expect(exported.toEntries()).toEqual(expectedE);
  });
});

describe("toComposition: single (clone)", () => {
  for (const isAbsolute of [true, false]) {
    test(`${isAbsolute ? "absolute" : "incremental"}: no init`, () => {
      const f = isAbsolute ? newAbsoluteFilter() : newFilter();
      for (const [method, value] of DUMMY_INIT) {
        f[method](() => value ?? 1);
      }
      expect(f.toEntries()).toEqual([]);

      const composed = f.toComposition();
      expect(composed.toEntries()).toEqual([]);
      expect(composed.isAbsolute()).toBe(isAbsolute);

      // update original
      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).toEqual(DUMMY_INIT_RESOLVED);

      // composed unchanged
      expect(composed.toEntries()).toEqual([]);

      // update composed
      composed.update(DUMMY_STATE, DEFAULT_COMPOSER);

      // original unchanged
      expect(f.toEntries()).toEqual(DUMMY_INIT_RESOLVED);

      expect(composed.toEntries()).toEqual(DUMMY_INIT_RESOLVED); // preserved handlers
    });

    test(`${isAbsolute ? "absolute" : "incremental"}: with init`, () => {
      const f = isAbsolute
        ? newAbsoluteFilter(DUMMY_INIT)
        : newFilter(DUMMY_INIT);
      expect(f.isAbsolute()).toBe(isAbsolute);

      const expected = [];
      for (const [method, value] of DUMMY_INIT) {
        const ret = (value ?? 1) * 0.5;
        f[method](() => ret);
        expected.push([method, (isAbsolute ? 0 : (value ?? 0)) + ret]);
      }

      expect(f.toEntries()).toEqual(DUMMY_INIT);

      const composed = f.toComposition();
      expect(composed.toEntries()).toEqual(DUMMY_INIT);
      expect(composed.isAbsolute()).toBe(isAbsolute);

      // update original
      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).toEqual(expected);

      // composed unchanged
      expect(composed.toEntries()).toEqual(DUMMY_INIT);

      // update composed
      composed.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(composed.toEntries()).toEqual(expected); // preserved handlers

      // original unchanged
      expect(f.toEntries()).toEqual(expected);
    });

    test(`${isAbsolute ? "absolute" : "incremental"}: after update`, () => {
      let hasCalled = false;
      const f = isAbsolute ? newAbsoluteFilter() : newFilter();
      for (const [method, value] of DUMMY_INIT) {
        f[method](() => (hasCalled ? 2 : 1) * (value ?? 1));
      }
      expect(f.toEntries()).toEqual([]);

      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      hasCalled = true;
      expect(f.toEntries()).toEqual(DUMMY_INIT_RESOLVED);

      const composed = f.toComposition();
      expect(composed.toEntries()).toEqual(DUMMY_INIT_RESOLVED);
      expect(composed.isAbsolute()).toBe(isAbsolute);

      // update original again
      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      const newEntries = f.toEntries();
      expect(newEntries).not.toEqual(DUMMY_INIT_RESOLVED);

      // composed unchanged
      expect(composed.toEntries()).toEqual(DUMMY_INIT_RESOLVED);

      // update composed
      composed.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(composed.toEntries()).toEqual(newEntries); // preserved handlers

      // original unchanged
      expect(f.toEntries()).toEqual(newEntries);
    });
  }

  test("add handlers after cloning", () => {
    const f = newFilter();
    f.brightness(() => 1.5);

    const composed = f.toComposition();

    f.contrast(() => 1.2); // does not affect composed
    composed.contrast(() => 1.4); // does not affect original
    composed.blur(() => 3); // does not affect original

    const expectedO = [
      ["brightness", 1.5],
      ["contrast", 1.2],
    ];
    const expectedE = [
      ["brightness", 1.5], // preserved
      ["contrast", 1.4],
      ["blur", 3],
    ];

    expect(f.toEntries()).toEqual([]);
    expect(composed.toEntries()).toEqual([]);

    f.update(DUMMY_STATE, DEFAULT_COMPOSER);
    composed.update(DUMMY_STATE, DEFAULT_COMPOSER);

    expect(f.toEntries()).toEqual(expectedO);
    expect(composed.toEntries()).toEqual(expectedE);
  });
});

describe("toComposition: multiple", () => {
  test("no init", () => {
    const fA = newFilter();
    fA.brightness(() => 0.2);
    fA.contrast(() => 0.1);
    fA.brightness(() => 0.3);

    const fB = newFilter();
    fB.brightness(() => 0.8);

    const fC = newFilter();
    fC.blur(() => 3);
    fC.opacity(() => 0.5);

    const expectedIntermediate = [
      ["brightness", 0.2],
      ["contrast", 0.1],
      ["brightness", 0.3],
      ["brightness", 0.8],
      ["blur", 3],
      ["opacity", 0.5],
    ];

    const expectedFinal = expectedIntermediate.map((e) => [e[0], e[1] * 2]);

    const composed = fA.toComposition(fB, fC);
    expect(composed.isAbsolute()).toBe(false);
    expect(composed.toEntries()).toEqual([]);

    composed.update(DUMMY_STATE, DEFAULT_COMPOSER);
    expect(composed.toEntries()).toEqual(expectedIntermediate);

    composed.update(DUMMY_STATE, DEFAULT_COMPOSER);
    expect(composed.toEntries()).toEqual(expectedFinal);

    expect(fA.toEntries()).toEqual([]); // unchanged
    expect(fB.toEntries()).toEqual([]); // unchanged
    expect(fC.toEntries()).toEqual([]); // unchanged
  });

  test("1st absolute: no init", () => {
    let hasCalled = false;
    const fA = newAbsoluteFilter();
    fA.brightness(() => (hasCalled ? 1 : 0) + 0.2);
    fA.contrast(() => (hasCalled ? 1 : 0) + 0.1);
    fA.brightness(() => (hasCalled ? 1 : 0) + 0.3);

    const fB = newFilter();
    fB.brightness(() => 0.8);

    const fC = newFilter();
    fC.blur(() => 3);
    fC.opacity(() => 0.5);

    const expectedIntermediate = [
      ["brightness", 0.2],
      ["contrast", 0.1],
      ["brightness", 0.3],
      ["brightness", 0.8],
      ["blur", 3],
      ["opacity", 0.5],
    ];

    const expectedFinal = [
      // discarded previous value
      ["brightness", 1.2],
      ["contrast", 1.1],
      ["brightness", 1.3],
      ["brightness", 0.8],
      ["blur", 3],
      ["opacity", 0.5],
    ];

    const composed = fA.toComposition(fB, fC);
    expect(composed.isAbsolute()).toBe(true);
    expect(composed.toEntries()).toEqual([]);

    composed.update(DUMMY_STATE, DEFAULT_COMPOSER);
    hasCalled = true;
    expect(composed.toEntries()).toEqual(expectedIntermediate);

    composed.update(DUMMY_STATE, DEFAULT_COMPOSER);
    expect(composed.toEntries()).toEqual(expectedFinal);

    expect(fA.toEntries()).toEqual([]); // unchanged
    expect(fB.toEntries()).toEqual([]); // unchanged
    expect(fC.toEntries()).toEqual([]); // unchanged
  });

  test("2nd absolute: no init", () => {
    let hasCalled = false;
    const fA = newFilter();
    fA.brightness(() => 0.2);
    fA.contrast(() => 0.1);
    fA.brightness(() => 0.3);

    const fB = newAbsoluteFilter();
    fB.brightness(() => (hasCalled ? 1 : 0) + 0.8);

    const fC = newFilter();
    fC.blur(() => 3);
    fC.opacity(() => 0.5);

    const expectedIntermediate = [
      ["brightness", 0.8],
      ["blur", 3],
      ["opacity", 0.5],
    ];

    const expectedFinal = [
      // discarded previous values
      ["brightness", 1.8],
      ["blur", 3],
      ["opacity", 0.5],
    ];

    const composed = fA.toComposition(fB, fC);
    expect(composed.isAbsolute()).toBe(true);
    expect(composed.toEntries()).toEqual([]);

    composed.update(DUMMY_STATE, DEFAULT_COMPOSER);
    hasCalled = true;
    expect(composed.toEntries()).toEqual(expectedIntermediate);

    composed.update(DUMMY_STATE, DEFAULT_COMPOSER);
    expect(composed.toEntries()).toEqual(expectedFinal);

    expect(fA.toEntries()).toEqual([]); // unchanged
    expect(fB.toEntries()).toEqual([]); // unchanged
    expect(fC.toEntries()).toEqual([]); // unchanged
  });

  test("all absolute: no init", () => {
    const fA = newAbsoluteFilter();
    fA.brightness(() => 0.2);
    fA.contrast(() => 0.1);
    fA.brightness(() => 0.3);

    const fB = newAbsoluteFilter();
    fB.brightness(() => 0.8);

    const fC = newAbsoluteFilter();
    fC.blur(() => 3);
    fC.opacity(() => 0.5);

    const expected = [
      ["blur", 3],
      ["opacity", 0.5],
    ];

    const composed = fA.toComposition(fB, fC);
    expect(composed.isAbsolute()).toBe(true);
    expect(composed.toEntries()).toEqual([]);

    composed.update(DUMMY_STATE, DEFAULT_COMPOSER);
    expect(composed.toEntries()).toEqual(expected);

    composed.update(DUMMY_STATE, DEFAULT_COMPOSER);
    expect(composed.toEntries()).toEqual(expected);

    expect(fA.toEntries()).toEqual([]); // unchanged
    expect(fB.toEntries()).toEqual([]); // unchanged
    expect(fC.toEntries()).toEqual([]); // unchanged
  });

  test("with init", () => {
    const initA = [
      ["brightness", 1.5],
      ["contrast", 1.2],
      ["brightness", 0.8],
    ];
    const fA = newFilter(initA);
    fA.brightness(() => 0.2);
    fA.contrast(() => -0.1);
    fA.brightness(() => -0.3);
    fA.blur(() => 3); // adds a new entry

    const initB = [
      ["brightness", 0.9],
      ["blur", 2],
    ];
    const fB = newFilter(initB);
    fB.brightness(() => 0.3);
    // no handler for modifying blur

    const initC = [
      ["contrast", 1.2],
      ["opacity", 0.4],
    ];
    const fC = newFilter(initC);
    fC.contrast(() => -0.3);
    fC.opacity(() => 0.4);
    fC.sepia(() => 0.5); // new entry

    const expectedInit = [
      ["brightness", 1.5],
      ["contrast", 1.2],
      ["brightness", 0.8],
      ["blur", null], // blank slot for blur handler from fA
      ["brightness", 0.9],
      ["blur", 2],
      ["contrast", 1.2],
      ["opacity", 0.4],
      // ["sepia", null], // blank slot for sepia handler from fC not added yet
    ];

    const expectedFinal = [
      ["brightness", 1.5 + 0.2],
      ["contrast", 1.2 - 0.1],
      ["brightness", 0.8 - 0.3],
      ["blur", 3],
      ["brightness", 0.9 + 0.3],
      ["blur", 2], // unchanged
      ["contrast", 1.2 - 0.3],
      ["opacity", 0.4 + 0.4],
      ["sepia", 0.5],
    ];

    const composed = fA.toComposition(fB, fC);
    expect(composed.isAbsolute()).toBe(false);
    expect(composed.toEntries()).toEqual(expectedInit);

    composed.update(DUMMY_STATE, DEFAULT_COMPOSER);
    expect(composed.toEntries()).toEqual(expectedFinal);

    expect(fA.toEntries()).toEqual(initA); // unchanged
    expect(fB.toEntries()).toEqual(initB); // unchanged
    expect(fC.toEntries()).toEqual(initC); // unchanged
  });

  test("1st absolute: with init", () => {
    let hasCalled = false;
    const initA = [
      ["brightness", 1.5],
      ["contrast", 1.2],
      ["brightness", 0.8],
    ];
    const fA = newAbsoluteFilter(initA);
    fA.brightness(() => (hasCalled ? 1 : 0) + 0.2);
    fA.contrast(() => (hasCalled ? 1 : 0) + 0.1);
    fA.brightness(() => (hasCalled ? 1 : 0) + 0.3);
    fA.blur(() => 3); // adds a new entry

    const initB = [
      ["brightness", 0.9],
      ["blur", 2],
    ];
    const fB = newFilter(initB);
    fB.brightness(() => 0.3);
    // no handler for modifying blur

    const initC = [
      ["contrast", 1.2],
      ["opacity", 0.4],
    ];
    const fC = newFilter(initC);
    fC.contrast(() => -0.3);
    fC.opacity(() => 0.4);
    fC.sepia(() => 0.5); // new entry

    const expectedInit = [
      ["brightness", 1.5],
      ["contrast", 1.2],
      ["brightness", 0.8],
      ["blur", null], // blank slot for blur handler from fA
      ["brightness", 0.9],
      ["blur", 2],
      ["contrast", 1.2],
      ["opacity", 0.4],
      // ["sepia", null], // blank slot for sepia handler from fC not added yet
    ];

    const expectedIntermediate = [
      // discarded initial values
      ["brightness", 0.2],
      ["contrast", 0.1],
      ["brightness", 0.3],
      ["blur", 3],
      ["brightness", 0.3],
      ["blur", null],
      ["contrast", 0], // forced to min of 0
      ["opacity", 0.4],
      ["sepia", 0.5],
    ];

    const expectedFinal = [
      // discarded previous values
      ["brightness", 1.2],
      ["contrast", 1.1],
      ["brightness", 1.3],
      ["blur", 3],
      ["brightness", 0.3],
      ["blur", null],
      ["contrast", 0],
      ["opacity", 0.4],
      ["sepia", 0.5],
    ];

    const composed = fA.toComposition(fB, fC);
    expect(composed.isAbsolute()).toBe(true);
    expect(composed.toEntries()).toEqual(expectedInit);

    composed.update(DUMMY_STATE, DEFAULT_COMPOSER);
    hasCalled = true;
    expect(composed.toEntries()).toEqual(expectedIntermediate);

    composed.update(DUMMY_STATE, DEFAULT_COMPOSER);
    expect(composed.toEntries()).toEqual(expectedFinal);

    expect(fA.toEntries()).toEqual(initA); // unchanged
    expect(fB.toEntries()).toEqual(initB); // unchanged
    expect(fC.toEntries()).toEqual(initC); // unchanged
  });

  test("2nd absolute: with init", () => {
    let hasCalled = false;
    const initA = [
      ["brightness", 1.5],
      ["contrast", 1.2],
      ["brightness", 0.8],
    ];
    const fA = newFilter(initA);
    fA.brightness(() => 0.2);
    fA.contrast(() => 0.1);
    fA.brightness(() => 0.3);
    fA.blur(() => 3); // adds a new entry

    const initB = [
      ["brightness", 0.9],
      ["blur", 2],
    ];
    const fB = newAbsoluteFilter(initB);
    fB.brightness(() => (hasCalled ? 1 : 0) + 0.3);
    // no handler for modifying blur

    const initC = [
      ["contrast", 1.2],
      ["opacity", 0.4],
    ];
    const fC = newFilter(initC);
    fC.contrast(() => -0.3);
    fC.opacity(() => 0.4);
    fC.sepia(() => 0.5); // new entry

    const expectedInit = [
      ["brightness", 0.9],
      ["blur", 2],
      ["contrast", 1.2],
      ["opacity", 0.4],
      // ["sepia", null], // blank slot for sepia handler from fC not added yet
    ];

    const expectedIntermediate = [
      // discarded initial values
      ["brightness", 0.3],
      ["blur", null],
      ["contrast", 0], // forced to min of 0
      ["opacity", 0.4],
      ["sepia", 0.5],
    ];

    const expectedFinal = [
      // discarded previous values
      ["brightness", 1.3],
      ["blur", null],
      ["contrast", 0],
      ["opacity", 0.4],
      ["sepia", 0.5],
    ];

    const composed = fA.toComposition(fB, fC);
    expect(composed.isAbsolute()).toBe(true);
    expect(composed.toEntries()).toEqual(expectedInit);

    composed.update(DUMMY_STATE, DEFAULT_COMPOSER);
    hasCalled = true;
    expect(composed.toEntries()).toEqual(expectedIntermediate);

    composed.update(DUMMY_STATE, DEFAULT_COMPOSER);
    expect(composed.toEntries()).toEqual(expectedFinal);

    expect(fA.toEntries()).toEqual(initA); // unchanged
    expect(fB.toEntries()).toEqual(initB); // unchanged
    expect(fC.toEntries()).toEqual(initC); // unchanged
  });

  test("all absolute: with init", () => {
    let hasCalled = false;
    const initA = [
      ["brightness", 1.5],
      ["contrast", 1.2],
      ["brightness", 0.8],
    ];
    const fA = newAbsoluteFilter(initA);
    fA.brightness(() => 0.2);
    fA.contrast(() => 0.1);
    fA.brightness(() => 0.3);
    fA.blur(() => 3); // adds a new entry

    const initB = [
      ["brightness", 0.9],
      ["blur", 2],
    ];
    const fB = newAbsoluteFilter(initB);
    fB.brightness(() => (hasCalled ? 1 : 0) + 0.3);
    // no handler for modifying blur

    const initC = [
      ["contrast", 1.2],
      ["opacity", 0.4],
    ];
    const fC = newAbsoluteFilter(initC);
    fC.contrast(() => 0.3);
    fC.opacity(() => 0.4);
    fC.sepia(() => 0.5); // new entry

    const expectedInit = [
      ["contrast", 1.2],
      ["opacity", 0.4],
      // ["sepia", null], // blank slot for sepia handler from fC not added yet
    ];

    const expectedFinal = [
      ["contrast", 0.3],
      ["opacity", 0.4],
      ["sepia", 0.5],
    ];

    const composed = fA.toComposition(fB, fC);
    expect(composed.isAbsolute()).toBe(true);
    expect(composed.toEntries()).toEqual(expectedInit);

    composed.update(DUMMY_STATE, DEFAULT_COMPOSER);
    hasCalled = true;
    expect(composed.toEntries()).toEqual(expectedFinal);

    composed.update(DUMMY_STATE, DEFAULT_COMPOSER);
    expect(composed.toEntries()).toEqual(expectedFinal);

    expect(fA.toEntries()).toEqual(initA); // unchanged
    expect(fB.toEntries()).toEqual(initB); // unchanged
    expect(fC.toEntries()).toEqual(initC); // unchanged
  });
});

describe("toCss", () => {
  test("no init", () => {
    const f = newFilter();
    expect(f.toCss()).toEqual({ filter: "none" });
  });

  test("all null init", () => {
    const f = newFilter([
      ["brightness", null],
      ["contrast", null],
    ]);
    expect(f.toCss()).toEqual({ filter: "none" });
  });

  test("with init", () => {
    const f = newFilter([
      ["brightness", 0.9],
      ["contrast", 1.1],
    ]);
    expect(f.toCss()).toEqual({ filter: "brightness(0.9) contrast(1.1)" });
  });

  test("after update", () => {
    const f = newFilter();
    for (const [method, value] of DUMMY_INIT) {
      f[method](() => value ?? 1);
    }

    f.update(DUMMY_STATE, DEFAULT_COMPOSER);
    expect(f.toCss()).toEqual({ filter: DUMMY_INIT_RESOLVED_STR });
  });
});

describe("toString", () => {
  test("no init", () => {
    const f = newFilter();
    expect(f.toString()).toBe("none");
  });

  test("all null init", () => {
    const f = newFilter([
      ["brightness", null],
      ["contrast", null],
    ]);
    expect(f.toString()).toBe("none");
  });

  test("with init", () => {
    const f = newFilter([
      ["brightness", 0.9],
      ["contrast", 1.1],
    ]);
    expect(f.toString()).toBe("brightness(0.9) contrast(1.1)");
  });

  test("after update", () => {
    const f = newFilter();
    for (const [method, value] of DUMMY_INIT) {
      f[method](() => value ?? 1);
    }

    f.update(DUMMY_STATE, DEFAULT_COMPOSER);
    expect(f.toString()).toEqual(DUMMY_INIT_RESOLVED_STR);
  });
});

describe("toEntries", () => {
  test("modifying", () => {
    const f = newFilter();
    const entries = f.toEntries();
    expect(f.toEntries()).not.toBe(entries); // new copy
    entries.push(["brightness", 0.9]);
    expect(f.toEntries()).toEqual([]);
  });
});

for (const name of FILTER_NAMES.filter((n) => n !== "dropShadow")) {
  const axis = {
    low: -1,
    high: 1,
    initial: 0,
    previous: 0,
    current: 0.5,
    target: 1,
    lag: 0,
    depth: 1,
    snap: false,
  };
  const state = { x: axis, y: axis, z: axis };

  const axis2 = {
    ...axis,
    previous: axis.current,
    current: 0.8,
  };
  const state2 = { x: axis2, y: axis2, z: axis2 };

  describe(name, () => {
    test("update", () => {
      const cbk = jest.fn(() => 0.5);
      const f = newFilter();
      f[name](cbk);
      expect(cbk).toHaveBeenCalledTimes(0);

      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(cbk).toHaveBeenCalledTimes(1);
      expect(cbk).toHaveBeenCalledWith(
        DEFAULT_TWEEN_STATE,
        DUMMY_STATE,
        DEFAULT_COMPOSER,
      );
    });

    for (const isAbsolute of [true, false]) {
      test(`${isAbsolute ? "absolute" : "incremental"}: with other filter init, missing return`, () => {
        const init = [[name === "brightness" ? "blur" : "brightness", 0.5]];
        const f = isAbsolute ? newAbsoluteFilter(init) : newFilter(init);
        f[name](() => {});

        const expected = isAbsolute ? [] : deepCopy(init);
        expected.push([name, null]);

        f.update(DUMMY_STATE, DEFAULT_COMPOSER);
        expect(f.toEntries()).toEqual(expected);
      });

      test(`${isAbsolute ? "absolute" : "incremental"}: with same init, missing return`, () => {
        const init = [[name, 0.5]];
        const f = isAbsolute ? newAbsoluteFilter(init) : newFilter(init);
        f[name](() => {});

        const expected = isAbsolute ? [[name, null]] : deepCopy(init);

        f.update(DUMMY_STATE, DEFAULT_COMPOSER);
        expect(f.toEntries()).toEqual(expected);
      });

      for (const v of [NaN, -Infinity]) {
        test(`${isAbsolute ? "absolute" : "incremental"}: with init, invalid return ${v}`, () => {
          const f = isAbsolute
            ? newAbsoluteFilter(DUMMY_INIT)
            : newFilter(DUMMY_INIT);
          f[name](() => v);

          expect(() => f.update(DUMMY_STATE, DEFAULT_COMPOSER)).toThrow(
            /must be a number/,
          );
          expect(f.toEntries()).toEqual(isAbsolute ? [] : DUMMY_INIT);
        });
      }

      test(`${isAbsolute ? "absolute" : "incremental"}: 2 updates: no init`, () => {
        const f = isAbsolute ? newAbsoluteFilter() : newFilter();
        f[name]((p) => p.x);

        expect(f.toEntries()).toEqual([]);

        f.update(state, DEFAULT_COMPOSER);
        expect(f.toEntries().length).toBe(1);
        expect(f.toEntries()[0]).toBeCloseToArray([name, state.x.current]);

        f.update(state2, DEFAULT_COMPOSER);
        expect(f.toEntries().length).toBe(1);
        expect(f.toEntries()[0]).toBeCloseToArray([name, state2.x.current]);
      });

      test(`${isAbsolute ? "absolute" : "incremental"}: 2 updates: with init`, () => {
        const initVal = 0.2;
        const init = [[name, initVal]];
        const f = isAbsolute ? newAbsoluteFilter(init) : newFilter(init);
        f[name]((p) => p.x);

        expect(f.toEntries().length).toBe(1);
        expect(f.toEntries()[0]).toBeCloseToArray(init[0]);

        f.update(state, DEFAULT_COMPOSER);
        expect(f.toEntries().length).toBe(1);
        expect(f.toEntries()[0]).toBeCloseToArray([
          name,
          (isAbsolute ? 0 : initVal) + state.x.current,
        ]);

        f.update(state2, DEFAULT_COMPOSER);
        expect(f.toEntries().length).toBe(1);
        expect(f.toEntries()[0]).toBeCloseToArray([
          name,
          (isAbsolute ? 0 : initVal) + state2.x.current,
        ]);
      });
    }
  });
}

describe("dropShadow", () => {
  const axis = {
    low: -10,
    high: 10,
    initial: 0,
    previous: 0,
    current: 5,
    target: 10,
    lag: 0,
    depth: 1,
    snap: false,
  };
  const state = { x: axis, y: axis, z: axis };

  const axis2 = {
    ...axis,
    previous: axis.current,
    current: 8,
  };
  const state2 = { x: axis2, y: axis2, z: axis2 };

  test("update", () => {
    const cbk = jest.fn(() => 0.5);
    const f = newFilter();
    f.dropShadow(cbk);
    expect(cbk).toHaveBeenCalledTimes(0);

    f.update(DUMMY_STATE, DEFAULT_COMPOSER);
    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenCalledWith(
      DEFAULT_TWEEN_STATE,
      DUMMY_STATE,
      DEFAULT_COMPOSER,
    );
  });

  for (const isAbsolute of [true, false]) {
    test(`${isAbsolute ? "absolute" : "incremental"}: with other filter init, missing return`, () => {
      const init = [["brightness", 0.5]];
      const f = isAbsolute ? newAbsoluteFilter(init) : newFilter(init);
      f.dropShadow(() => {});

      const expected = isAbsolute ? [] : deepCopy(init);
      expected.push(["dropShadow", null]);

      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).toEqual(expected);
    });

    test(`${isAbsolute ? "absolute" : "incremental"}: with same init, missing return`, () => {
      const init = [
        [
          "dropShadow",
          {
            color: { r: 10, g: 20, b: 30, a: 0.5 },
            offsetX: 10,
            offsetY: 20,
            blur: 5,
          },
        ],
      ];
      const f = isAbsolute ? newAbsoluteFilter(init) : newFilter(init);
      f.dropShadow(() => {});

      const expected = isAbsolute ? [["dropShadow", null]] : deepCopy(init);

      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).toEqual(expected);
    });

    test(`${isAbsolute ? "absolute" : "incremental"}: with same filter init, missing prop`, () => {
      const init = [
        [
          "dropShadow",
          {
            color: { r: 10, g: 20, b: 30, a: 0.5 },
            offsetX: 10,
            offsetY: 20,
            blur: 5,
          },
        ],
      ];
      const f = isAbsolute ? newAbsoluteFilter(init) : newFilter(init);
      f.dropShadow(() => ({ color: { r: 20, a: 0.2 }, offsetY: 10 }));

      let expected;
      if (isAbsolute) {
        expected = [
          [
            "dropShadow",
            {
              color: { r: 20, g: 0, b: 0, a: 0.2 },
              offsetX: 0,
              offsetY: 10,
              blur: 0,
            },
          ],
        ];
      } else {
        expected = [
          [
            "dropShadow",
            {
              color: { r: 10 + 20, g: 20, b: 30, a: 0.7 },
              offsetX: 10,
              offsetY: 20 + 10,
              blur: 5,
            },
          ],
        ];
      }

      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).toEqual(expected);
    });

    for (const c of [false, { x: 1 }]) {
      test(`${isAbsolute ? "absolute" : "incremental"}: with init, invalid color ${c}`, () => {
        const f = isAbsolute
          ? newAbsoluteFilter(DUMMY_INIT)
          : newFilter(DUMMY_INIT);
        f.dropShadow(() => ({ color: c }));

        expect(() => f.update(DUMMY_STATE, DEFAULT_COMPOSER)).toThrow(
          /must be a valid HSL\(A\) or RGB\(A\) color object/,
        );
        expect(f.toEntries()).toEqual(isAbsolute ? [] : DUMMY_INIT);
      });
    }

    for (const v of [NaN, -Infinity]) {
      for (const prop of ["offsetX", "offsetY", "blur"]) {
        test(`${isAbsolute ? "absolute" : "incremental"}: with init, invalid ${prop} ${v}`, () => {
          const f = isAbsolute
            ? newAbsoluteFilter(DUMMY_INIT)
            : newFilter(DUMMY_INIT);
          f.dropShadow(() => ({ [prop]: v }));

          expect(() => f.update(DUMMY_STATE, DEFAULT_COMPOSER)).toThrow(
            /must be a number/,
          );
          expect(f.toEntries()).toEqual(isAbsolute ? [] : DUMMY_INIT);
        });
      }
    }

    test(`${isAbsolute ? "absolute" : "incremental"}: 2 updates: no init`, () => {
      const f = isAbsolute ? newAbsoluteFilter() : newFilter();
      f.dropShadow((p) => ({
        color: { r: p.x, g: p.x, b: p.x },
        offsetX: p.x,
        offsetY: p.x,
        blur: p.x,
      }));

      expect(f.toEntries()).toEqual([]);

      for (const s of [state, state2]) {
        f.update(s, DEFAULT_COMPOSER);
        const entries = f.toEntries();
        expect(entries.length).toBe(1);
        expect(entries[0][0]).toBe("dropShadow");
        const val = entries[0][1];
        const x = s.x.current;

        expect(val.offsetX).toBeCloseTo(x);
        expect(val.offsetY).toBeCloseTo(x);
        expect(val.blur).toBeCloseTo(x);
        expect(val.color).toEqual({
          r: x,
          g: x,
          b: x,
          a: 1,
        });
      }
    });

    test(`${isAbsolute ? "absolute" : "incremental"}: 2 updates: with init`, () => {
      const initVal = {
        color: { r: 10, g: 20, b: 30, a: 0.5 },
        offsetX: 10,
        offsetY: 20,
        blur: 5,
      };
      const init = [["dropShadow", initVal]];
      const f = isAbsolute ? newAbsoluteFilter(init) : newFilter(init);
      f.dropShadow((p) => ({
        color: { r: p.x, g: p.x, b: p.x },
        offsetX: p.x,
        offsetY: p.x,
        blur: p.x,
      }));

      expect(f.toEntries()).toEqual(init);

      for (const s of [state, state2]) {
        f.update(s, DEFAULT_COMPOSER);
        const entries = f.toEntries();
        expect(entries.length).toBe(1);
        expect(entries[0][0]).toBe("dropShadow");
        const val = entries[0][1];
        const x = s.x.current;

        expect(val.offsetX).toBeCloseTo((isAbsolute ? 0 : initVal.offsetX) + x);
        expect(val.offsetY).toBeCloseTo((isAbsolute ? 0 : initVal.offsetY) + x);
        expect(val.blur).toBeCloseTo((isAbsolute ? 0 : initVal.blur) + x);
        expect(val.color).toEqual({
          r: (isAbsolute ? 0 : initVal.color.r) + x,
          g: (isAbsolute ? 0 : initVal.color.g) + x,
          b: (isAbsolute ? 0 : initVal.color.b) + x,
          a: 1,
        });
      }
    });
  }
});

test("all filters + toCss", () => {
  const f = newFilter();
  f.brightness(() => 0.1)
    .brightness(() => 0.2)
    .blur(() => 2)
    .contrast(() => 0.3)
    .dropShadow(() => ({
      color: { r: 100, g: 110, b: 120, a: 0.5 },
      offsetX: 10,
      offsetY: 20,
      blur: 3,
    }))
    .grayscale(() => 0.4)
    .hueRotate(() => 30)
    .invert(() => 0.3)
    .hueRotate(() => 30)
    .opacity(() => 0.2)
    .saturate(() => 0.1)
    .sepia(() => 0.2);

  expect(f.toEntries()).toEqual([]);
  expect(f.toString()).toBe("none");
  expect(f.toCss()).toEqual({ filter: "none" });

  f.update(DUMMY_STATE, DEFAULT_COMPOSER);
  expect(f.toEntries()).toEqual([
    ["brightness", 0.1],
    ["brightness", 0.2],
    ["blur", 2],
    ["contrast", 0.3],
    [
      "dropShadow",
      {
        color: { r: 100, g: 110, b: 120, a: 0.5 },
        offsetX: 10,
        offsetY: 20,
        blur: 3,
      },
    ],
    ["grayscale", 0.4],
    ["hueRotate", 30],
    ["invert", 0.3],
    ["hueRotate", 30],
    ["opacity", 0.2],
    ["saturate", 0.1],
    ["sepia", 0.2],
  ]);
  expect(f.toString()).toBe(
    "brightness(0.1) " +
      "brightness(0.2) " +
      "blur(2px) " +
      "contrast(0.3) " +
      "drop-shadow(10 20 3 rgb(100 110 120 / 0.5)) " +
      "grayscale(0.4) " +
      "hue-rotate(30deg) " +
      "invert(0.3) " +
      "hue-rotate(30deg) " +
      "opacity(0.2) " +
      "saturate(0.1) " +
      "sepia(0.2)",
  );
  expect(f.toCss()).toEqual({ filter: f.toString() });

  // doubled values
  f.update(DUMMY_STATE, DEFAULT_COMPOSER);
  expect(f.toEntries()).toEqual([
    ["brightness", 0.2],
    ["brightness", 0.4],
    ["blur", 4],
    ["contrast", 0.6],
    [
      "dropShadow",
      {
        color: { r: 200, g: 220, b: 240, a: 1 },
        offsetX: 20,
        offsetY: 40,
        blur: 6,
      },
    ],
    ["grayscale", 0.8],
    ["hueRotate", 60],
    ["invert", 0.6],
    ["hueRotate", 60],
    ["opacity", 0.4],
    ["saturate", 0.2],
    ["sepia", 0.4],
  ]);
  expect(f.toString()).toBe(
    "brightness(0.2) " +
      "brightness(0.4) " +
      "blur(4px) " +
      "contrast(0.6) " +
      "drop-shadow(20 40 6 rgb(200 220 240 / 1)) " +
      "grayscale(0.8) " +
      "hue-rotate(60deg) " +
      "invert(0.6) " +
      "hue-rotate(60deg) " +
      "opacity(0.4) " +
      "saturate(0.2) " +
      "sepia(0.4)",
  );
  expect(f.toCss()).toEqual({ filter: f.toString() });
});

describe("parallax depth (ignored)", () => {
  const depthX = 4,
    depthY = 3,
    depthZ = 2;
  const composer = new FXComposer({ depthX, depthY, depthZ });
  const cbk = jest.fn(() => 0.5);
  const cbkSh = jest.fn(() => ({
    color: { r: 10, g: 10, b: 10, a: 0.5 },
    offsetX: 10,
    offsetY: 10,
    blur: 10,
  }));
  const f = newFilter();

  for (const name of FILTER_NAMES) {
    f[name](name === "dropShadow" ? cbkSh : cbk);
  }

  const params = toParameters(DUMMY_STATE, composer);
  f.update(DUMMY_STATE, composer);
  expect(cbk).toHaveBeenCalledTimes(9);
  for (let i = 1; i <= 9; i++) {
    expect(cbk).toHaveBeenNthCalledWith(i, params, DUMMY_STATE, composer);
  }
  expect(cbkSh).toHaveBeenCalledTimes(1);
  expect(cbkSh).toHaveBeenCalledWith(params, DUMMY_STATE, composer);

  expect(f.toEntries()).toEqual(
    FILTER_NAMES.map((name) => [
      name,
      name === "dropShadow"
        ? {
            color: { r: 10, g: 10, b: 10, a: 0.5 },
            offsetX: 10,
            offsetY: 10,
            blur: 10,
          }
        : 0.5,
    ]),
  );
});

test("modifying params and state inside handler", () => {
  const f = newFilter();
  const cbkA = jest.fn((p) => {
    params.x *= 2;
    state.x.current *= 2;

    return p.x;
  });

  const cbkB = jest.fn((p) => p.x);

  const state = newState();
  const params = toParameters(state, DEFAULT_COMPOSER);

  const stateCopy = deepCopy(state);
  const paramsCopy = deepCopy(params);

  f.blur(cbkA);
  f.blur(cbkB);

  f.update(state, DEFAULT_COMPOSER);

  expect(cbkA).toHaveBeenCalledTimes(1);
  expect(cbkA).toHaveBeenCalledWith(paramsCopy, stateCopy, DEFAULT_COMPOSER);

  expect(cbkB).toHaveBeenCalledTimes(1);
  expect(cbkB).toHaveBeenCalledWith(paramsCopy, stateCopy, DEFAULT_COMPOSER);

  expect(state).toEqual(stateCopy);
  expect(params).toEqual(paramsCopy);
});
