const { jest, describe, test, expect } = require("@jest/globals");

const utils = window.LISN.utils;

const timeDiffTolerance = 25;

const roundDiff = (x, y) => {
  return Math.floor(Math.abs(x - y));
};

test("deepCopy", () => {
  const obj = {
    a: 1,
    o: {
      a: 1,
      o: {
        a: 1,
        o: {},
      },
    },
  };

  const guard = {
    a: obj.a,
    o: obj.o,
    oa: obj.o.a,
    oo: obj.o.o,
    ooa: obj.o.o.a,
    ooo: obj.o.o.o,
  };

  const clone = utils.deepCopy(obj);
  expect(clone).toEqual(obj);
  expect(clone).not.toBe(obj);
  expect(clone.o).not.toBe(obj.o);
  expect(clone.o.o).not.toBe(obj.o.o);
  expect(clone.o.o.o).not.toBe(obj.o.o.o);

  // input not modified
  expect(obj.a).toBe(guard.a);
  expect(obj.o).toBe(guard.o);
  expect(obj.o.a).toBe(guard.oa);
  expect(obj.o.o).toBe(guard.oo);
  expect(obj.o.o.a).toBe(guard.ooa);
  expect(obj.o.o.o).toBe(guard.ooo);
});

test("copyExistingKeysTo", () => {
  const objA = {
    a: 1,
    b: 2,
    c: {
      a: 1,
      b: 2,
      c: {
        a: 1,
        b: 2,
      },
    },
  };

  const objB = {
    a: 5,
    z: 2,
    c: {
      a: 4,
      z: 2,
      c: {
        z: 2,
        b: 5,
      },
    },
  };

  utils.copyExistingKeysTo(objB, objA);
  expect(objA).toEqual({
    a: 5,
    b: 2,
    c: {
      a: 4,
      b: 2,
      c: {
        a: 1,
        b: 5,
      },
    },
  });
});

test("omitKeys", () => {
  const obj = {
    a: 1,
    b: 2,
    c: { a: 3 },
    d: { a: 4 },
  };

  const objRm = {
    c: null,
    a: 0,
  };

  const res = utils.omitKeys(obj, objRm);
  expect(res).toEqual({
    b: 2,
    d: obj.d,
  });
});

test("copySelectKeysTo", () => {
  const objA = {
    a: 1,
    b: 2,
    c: 3,
  };

  const objB = {
    a: 2,
    b: 3,
    c: 4,
    z: 10,
  };

  const keysToSelect = {
    c: null,
    a: 0,
  };

  utils.copySelectKeysTo(objB, objA, keysToSelect);
  expect(objA).toEqual({
    a: 2,
    b: 2, // unchanged
    c: 4,
    // no z
  });
});

describe("compareValuesIn", () => {
  test("basic", () => {
    const objA = {
      a: 1.1112,
      b: 2,
      c: {
        a: 1,
        b: 2,
        c: {
          a: "a",
          b: "b",
        },
      },
    };

    const objB = {
      // same to precision 3
      a: 1.1111,
      b: 2,
      c: {
        a: 1,
        b: 2,
        c: {
          a: "a",
          b: "b",
        },
      },
    };

    const objC = {
      a: 1.1111,
      b: 2,
      c: {
        a: 1,
        b: 2,
        c: {
          a: "aa", // diff
          b: "b",
        },
      },
    };

    expect(utils.compareValuesIn(objA, objB)).toBe(true);
    expect(utils.compareValuesIn(objA, objC)).toBe(false);
  });

  test("custom precision", () => {
    const objA = {
      a: 1.1112,
      b: 2,
      c: {
        a: 1,
        b: 2,
        c: {
          a: "a",
          b: "b",
        },
      },
    };

    const objB = {
      // same to precision 3 but not to 4
      a: 1.1111,
      b: 2,
      c: {
        a: 1,
        b: 2,
        c: {
          a: "a",
          b: "b",
        },
      },
    };

    expect(utils.compareValuesIn(objA, objB)).toBe(true);
    expect(utils.compareValuesIn(objA, objB, 4)).toBe(false);
  });
});

test("toArrayIfSingle", () => {
  expect(utils.toArrayIfSingle(1)).toEqual([1]);
  expect(utils.toArrayIfSingle(false)).toEqual([false]);
  expect(utils.toArrayIfSingle([1])).toEqual([1]);
  expect(utils.toArrayIfSingle([1, 2])).toEqual([1, 2]);

  expect(utils.toArrayIfSingle([])).toEqual([]);
  expect(utils.toArrayIfSingle(null)).toEqual([]);
  expect(utils.toArrayIfSingle()).toEqual([]);
});

test("waitForDelay", async () => {
  const startTime = Date.now();
  await utils.waitForDelay(500);
  const endTime = Date.now();
  expect(roundDiff(endTime, startTime + 500)).toBeLessThan(timeDiffTolerance);
});

describe("getDebouncedHandler", () => {
  test("non 0 debounceWindow", async () => {
    const cbk = jest.fn();
    const debouncedHandler = utils.getDebouncedHandler(50, cbk);
    expect(debouncedHandler).not.toBe(cbk);

    debouncedHandler("a");
    await window.waitFor(10);
    debouncedHandler("b");
    await window.waitFor(10);
    debouncedHandler("c");
    await window.waitFor(40);
    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenCalledWith("c");
  });

  test("0 debounceWindow", () => {
    const cbk = jest.fn();
    const debouncedHandler = utils.getDebouncedHandler(0, cbk);
    expect(debouncedHandler).toBe(cbk);
    debouncedHandler("a");
    debouncedHandler("b");
    debouncedHandler("c");
    expect(cbk).toHaveBeenCalledTimes(3);
  });
});
