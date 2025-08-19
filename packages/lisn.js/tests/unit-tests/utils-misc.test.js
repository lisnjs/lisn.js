const { jest, describe, test, expect } = require("@jest/globals");

const utils = window.LISN.utils;

const timeDiffTolerance = 25;

const roundDiff = (x, y) => {
  return Math.floor(Math.abs(x - y));
};

describe("deepCopy", () => {
  test("primitives", () => {
    expect(utils.deepCopy(42)).toBe(42);
    expect(utils.deepCopy("hi")).toBe("hi");
    expect(utils.deepCopy(true)).toBe(true);
    expect(utils.deepCopy(null)).toBeNull();
    expect(utils.deepCopy(undefined)).toBeUndefined();
    const sym = Symbol("x");
    expect(utils.deepCopy(sym)).toBe(sym);
  });

  test("functions, promises, weak collections", () => {
    const fn = () => 1;
    const p = Promise.resolve(1);
    const wm = new WeakMap();
    const ws = new WeakSet();

    // Not copied, returned as is
    expect(utils.deepCopy(fn)).toBe(fn);
    expect(utils.deepCopy(p)).toBe(p);
    expect(utils.deepCopy(wm)).toBe(wm);
    expect(utils.deepCopy(ws)).toBe(ws);
  });

  test("plain objects with symbol keys", () => {
    const sym = Symbol("k");
    const src = { x: { y: 1 }, [sym]: "s" };

    const copy = utils.deepCopy(src);
    expect(copy).not.toBe(src);

    expect(Object.getPrototypeOf(copy)).toBe(Object.prototype);
    expect(copy.x).not.toBe(src.x);
    expect(copy.x).toEqual(src.x);

    expect(copy[sym]).toBe("s");

    // Change copy, original not modified
    copy.x.y = 99;
    expect(src.x.y).toBe(1);
  });

  test("objects null prototype with symbol keys", () => {
    const sym = Symbol("k");
    const src = Object.create(null);
    src.x = { y: 1 };
    src[sym] = "s";

    const copy = utils.deepCopy(src);
    expect(copy).not.toBe(src);

    expect(Object.getPrototypeOf(copy)).toBe(null);
    expect(copy.x).not.toBe(src.x);
    expect(copy.x).toEqual(src.x);

    expect(copy[sym]).toBe("s");

    // Change copy, original not modified
    copy.x.y = 99;
    expect(src.x.y).toBe(1);
  });

  test("objects with property descriptors", () => {
    const obj = {};
    Object.defineProperty(obj, "locked", {
      value: { a: 1 },
      writable: false,
      enumerable: false,
      configurable: false,
    });

    const copy = utils.deepCopy(obj);
    const desc = Object.getOwnPropertyDescriptor(copy, "locked");

    expect(desc.writable).toBe(false);
    expect(desc.enumerable).toBe(false);
    expect(desc.configurable).toBe(false);

    // value deeply copied
    expect(copy.locked).not.toBe(obj.locked);
    expect(copy.locked).toEqual(obj.locked);
  });

  test("arrays", () => {
    const src = [1, { a: 2 }, [3]];
    const copy = utils.deepCopy(src);

    expect(copy).not.toBe(src);
    expect(copy).toEqual(src);

    expect(copy[1]).not.toBe(src[1]);
    copy[1].a = 99;
    expect(src[1].a).toBe(2);

    expect(copy[2]).not.toBe(src[2]);

    // Change copy, original not modified
    copy[2][0] = 99;
    expect(src[2][0]).toBe(3);
  });

  test("Map with object keys and values", () => {
    const k = { id: 1 };
    const v = { name: "Alice" };
    const src = new Map([[k, v]]);
    const copy = utils.deepCopy(src);

    expect(copy).not.toBe(src);
    const [[k2, v2]] = [...copy];
    expect(k2).not.toBe(k);
    expect(v2).not.toBe(v);
    expect(k2).toEqual(k);
    expect(v2).toEqual(v);

    // Change copy, original not modified
    v2.name = "Bob";
    expect(v.name).toBe("Alice");

    copy.set("foo", "bar");
    expect(src.get("foo")).toBeUndefined();
  });

  test("Set with object values", () => {
    const src = new Set([{ n: 1 }, { n: 2 }]);

    const copy = utils.deepCopy(src);
    expect(copy).not.toBe(src);

    const sa = [...src];
    const ca = [...copy];
    expect(ca).toEqual(sa);

    // Change copy, original not modified
    ca[0].n = 99;
    expect(sa[0].n).toBe(1);
  });

  test("ArrayBuffer, DataView, and TypedArrays", () => {
    const buf = new ArrayBuffer(4);
    const view = new DataView(buf);
    view.setInt16(0, 1234, true);
    const ta = new Int16Array(buf);

    const bufCopy = utils.deepCopy(buf);
    const viewCopy = utils.deepCopy(view);
    const taCopy = utils.deepCopy(ta);

    expect(bufCopy).not.toBe(buf);
    expect(new Int16Array(bufCopy)[0]).toBe(1234);

    expect(viewCopy).not.toBe(view);
    expect(viewCopy.getInt16(0, true)).toBe(1234);

    expect(taCopy).not.toBe(ta);
    expect(taCopy[0]).toBe(1234);

    // Change copy, original not modified
    new Int16Array(bufCopy)[0] = 4321;
    expect(new Int16Array(buf)[0]).toBe(1234);
  });

  test("Date", () => {
    const d = new Date("2020-01-01T00:00:00Z");
    const copy = utils.deepCopy(d);
    expect(copy).not.toBe(d);
    expect(copy.getTime()).toBe(d.getTime());
  });

  test("RegExp with flags and lastIndex", () => {
    const r = /a.b/gi;
    r.lastIndex = 2;

    const copy = utils.deepCopy(r);
    expect(copy).not.toBe(r);

    expect(copy.source).toBe(r.source);
    expect(copy.flags).toBe(r.flags);
    expect(copy.lastIndex).toBe(2);
  });

  test("circular references", () => {
    const obj = { name: "root" };
    obj.self = obj;

    const copy = utils.deepCopy(obj);
    expect(copy).not.toBe(obj);
    expect(copy).toEqual(obj);

    expect(copy.self).toBe(copy);
  });
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
