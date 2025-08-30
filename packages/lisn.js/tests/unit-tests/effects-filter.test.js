const { jest, describe, test, expect } = require("@jest/globals");

const { deepCopy, copyExistingKeysTo } = window.LISN._;
const { Filter, FXComposer, toParameters } = window.LISN.effects;

const DEFAULT_COMPOSER = new FXComposer();

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
    test(`${isAbsolute ? "absolute: " : ""}no init`, () => {
      const f = isAbsolute ? newAbsoluteFilter() : newFilter();
      expect(f.isAbsolute()).toBe(isAbsolute);
      expect(f.toEntries()).toEqual([]);
      expect(f.toString()).toBe("none");
    });

    test(`${isAbsolute ? "absolute: " : ""}with init`, () => {
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
    test(`${isAbsolute ? "absolute: " : ""}basic`, () => {
      const f = isAbsolute ? newAbsoluteFilter() : newFilter();
      for (const [method, value] of DUMMY_INIT) {
        f[method](() => value ?? 1);
      }
      expect(f.toEntries()).toEqual([]);

      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).toEqual(DUMMY_INIT_RESOLVED);
      expect(f.toString()).toEqual(DUMMY_INIT_RESOLVED_STR);
    });

    test(`${isAbsolute ? "absolute: " : ""}no init`, () => {
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

    test(`${isAbsolute ? "absolute: " : ""}init but no handlers`, () => {
      const f = isAbsolute
        ? newAbsoluteFilter(DUMMY_INIT)
        : newFilter(DUMMY_INIT);
      expect(f.isAbsolute()).toBe(isAbsolute);

      f.update(DUMMY_STATE, DEFAULT_COMPOSER);
      expect(f.toEntries()).toEqual(isAbsolute ? [] : DUMMY_INIT);
    });

    test(`${isAbsolute ? "absolute: " : ""}with init`, () => {
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

    test(`${isAbsolute ? "absolute: " : ""}with mismatching init (mismatch at i=0)`, () => {
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

    test(`${isAbsolute ? "absolute: " : ""}with mismatching init (mismatch at i=2)`, () => {
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

    test(`${isAbsolute ? "absolute: " : ""}adding handlers after update`, () => {
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
});

describe("update parameters", () => {
  const state = {
    x: {
      low: -1000,
      high: 1000,
      initial: 0,
      previous: 0,
      current: 100,
      target: 500,
      lag: 0,
      depth: 1,
    },
    y: {
      low: -100,
      high: 100,
      initial: 0,
      previous: 0,
      current: 10,
      target: 50,
      lag: 0,
      depth: 1,
    },
    z: {
      low: -10,
      high: 10,
      initial: 0,
      previous: 0,
      current: 1,
      target: 5,
      lag: 0,
      depth: 1,
    },
  };

  const state2 = {
    x: {
      low: -2000,
      high: 2000,
      initial: 0,
      previous: 100,
      current: 150,
      target: 500,
      lag: 0,
      depth: 1,
    },
    y: {
      low: -100,
      high: 100,
      initial: 0,
      previous: 10,
      current: 15,
      target: 50,
      lag: 0,
      depth: 1,
    },
    z: {
      low: -10,
      high: 10,
      initial: 0,
      previous: 1,
      current: 2,
      target: 5,
      lag: 0,
      depth: 1,
    },
  };

  for (const isAbsolute of [true, false]) {
    test(isAbsolute ? "incremental" : "absolute", () => {
      const f = isAbsolute ? newAbsoluteFilter() : newFilter();
      const cbk = jest.fn((d) => d.nx);
      f.opacity(cbk);

      const params = toParameters(state, DEFAULT_COMPOSER, { isAbsolute });
      f.update(state, DEFAULT_COMPOSER);

      expect(cbk).toHaveBeenCalledTimes(1);
      expect(cbk).toHaveBeenNthCalledWith(1, params, state, DEFAULT_COMPOSER);

      f.update(state2, DEFAULT_COMPOSER);
      const params2 = toParameters(state2, DEFAULT_COMPOSER, { isAbsolute });

      expect(cbk).toHaveBeenCalledTimes(2);
      expect(cbk).toHaveBeenNthCalledWith(2, params2, state2, DEFAULT_COMPOSER);
    });
  }
});

describe("export", () => {
  for (const isAbsolute of [true, false]) {
    test(`${isAbsolute ? "absolute: " : ""}no init`, () => {
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

    test(`${isAbsolute ? "absolute: " : ""}with init`, () => {
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

    test(`${isAbsolute ? "absolute: " : ""}after update`, () => {
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
    test(`${isAbsolute ? "absolute: " : ""}no init`, () => {
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

    test(`${isAbsolute ? "absolute: " : ""}with init`, () => {
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

    test(`${isAbsolute ? "absolute: " : ""}after update`, () => {
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
    fC.opacity(() => 0.3);
    fC.sepia(() => 0.3); // new entry

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
      // after handlers
      ["brightness", 1.5 + 0.2],
      ["contrast", 1.2 - 0.1],
      ["brightness", 0.8 - 0.3],
      ["blur", 3],
      ["brightness", 0.9 + 0.3],
      ["blur", 2], // unchanged
      ["contrast", 1.2 - 0.3],
      ["opacity", 0.4 + 0.3],
      ["sepia", 0.3],
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

  // XXX TODO with some absolute, some not
});

test("toCss", () => {
  // XXX TODO
});

test("toString", () => {
  // XXX TODO
});

describe("toEntries", () => {
  test("basic + after update", () => {
    // XXX TODO
  });

  test("modifying", () => {
    // XXX TODO
  });
});

describe("single filters", () => {
  // XXX for (const ...
  test("update", () => {
    // XXX TODO
  });

  test("missing return", () => {
    // XXX TODO
  });

  test("invalid return", () => {
    // XXX TODO
  });

  test("basic", () => {
    // XXX TODO
  });
});

describe("multiple filters", () => {
  // XXX TODO
});

describe("parallax depth (ignored)", () => {
  // XXX TODO
});
