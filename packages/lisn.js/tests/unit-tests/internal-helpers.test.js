const { describe, test, expect } = require("@jest/globals");

const _ = window.LISN._;

describe("deepCopy", () => {
  test("primitives", () => {
    expect(_.deepCopy(42)).toBe(42);
    expect(_.deepCopy("hi")).toBe("hi");
    expect(_.deepCopy(true)).toBe(true);
    expect(_.deepCopy(null)).toBeNull();
    expect(_.deepCopy(undefined)).toBeUndefined();
    const sym = Symbol("x");
    expect(_.deepCopy(sym)).toBe(sym);
  });

  test("functions, promises, weak collections", () => {
    const fn = () => 1;
    const p = Promise.resolve(1);
    const wm = new WeakMap();
    const ws = new WeakSet();

    // Not copied, returned as is
    expect(_.deepCopy(fn)).toBe(fn);
    expect(_.deepCopy(p)).toBe(p);
    expect(_.deepCopy(wm)).toBe(wm);
    expect(_.deepCopy(ws)).toBe(ws);
  });

  test("plain objects with symbol keys", () => {
    const sym = Symbol("k");
    const src = { x: { y: 1 }, [sym]: "s" };

    const copy = _.deepCopy(src);
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

    const copy = _.deepCopy(src);
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

    const copy = _.deepCopy(obj);
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
    const copy = _.deepCopy(src);

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
    const copy = _.deepCopy(src);

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

    const copy = _.deepCopy(src);
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

    const bufCopy = _.deepCopy(buf);
    const viewCopy = _.deepCopy(view);
    const taCopy = _.deepCopy(ta);

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
    const copy = _.deepCopy(d);
    expect(copy).not.toBe(d);
    expect(copy.getTime()).toBe(d.getTime());
  });

  test("RegExp with flags and lastIndex", () => {
    const r = /a.b/gi;
    r.lastIndex = 2;

    const copy = _.deepCopy(r);
    expect(copy).not.toBe(r);

    expect(copy.source).toBe(r.source);
    expect(copy.flags).toBe(r.flags);
    expect(copy.lastIndex).toBe(2);
  });

  test("circular references", () => {
    const obj = { name: "root" };
    obj.self = obj;

    const copy = _.deepCopy(obj);
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

  _.copyExistingKeysTo(objB, objA);
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

  const res = _.omitKeys(obj, objRm);
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

  _.copySelectKeysTo(objB, objA, keysToSelect);
  expect(objA).toEqual({
    a: 2,
    b: 2, // unchanged
    c: 4,
    // no z
  });
});
