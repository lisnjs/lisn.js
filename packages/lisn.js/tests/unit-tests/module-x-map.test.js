const { test, expect } = require("@jest/globals");

const { XMap, XWeakMap } = window.LISN.modules;

const newXM = () => {
  const xm = new XMap(XMap.newXMapGetter(XMap.newXMapGetter(() => "default")));

  const cxm = xm.sGet("a");
  const gcxm = cxm.sGet(true);
  gcxm.sGet(1);
  return { xm, cxm, gcxm };
};

test("sGet", () => {
  const { xm, cxm, gcxm } = newXM();

  expect(cxm).toBeInstanceOf(XMap);
  expect(gcxm).toBeInstanceOf(XMap);

  expect(xm.size).toBe(1);
  expect(cxm.size).toBe(1);
  expect(gcxm.size).toBe(1);

  expect(xm.get("a")).toBe(cxm);
  expect(xm.sGet("a")).toBe(cxm);
  expect(xm.get("c")).toBeUndefined();

  expect(cxm.get(true)).toBe(gcxm);
  expect(cxm.sGet(true)).toBe(gcxm);
  expect(cxm.get(false)).toBeUndefined();

  expect(gcxm.get(1)).toBe("default");
  expect(gcxm.get(2)).toBeUndefined();
});

test("get", () => {
  const { xm } = newXM();

  expect(xm.get("A")?.get(true)?.get(1)).toBeUndefined();
  expect(xm.get("a")?.get(false)?.get(1)).toBeUndefined();
  expect(xm.get("a")?.get(true)?.get(2)).toBeUndefined();
  expect(xm.get("a")?.get(true)?.get(1)).toBe("default");
});

test("set", () => {
  const { gcxm } = newXM();

  gcxm.set(1, "foo");
  gcxm.set(2, "bar");
  expect(gcxm.size).toBe(2);

  expect(gcxm.get(1)).toBe("foo");
  expect(gcxm.get(2)).toBe("bar");
});

test("delete", () => {
  const { gcxm } = newXM();

  expect(gcxm.size).toBe(1);
  gcxm.delete(1);
  gcxm.delete(2); // non-existent

  expect(gcxm.size).toBe(0);
  expect(gcxm.get(1)).toBeUndefined();
  expect(gcxm.get(2)).toBeUndefined();
});

test("clear", () => {
  const { xm } = newXM();

  expect(xm.size).toBe(1);
  xm.clear();

  expect(xm.get("a")).toBeUndefined();
  expect(xm.size).toBe(0);
});

test("prune", () => {
  const { xm, cxm, gcxm } = newXM();
  cxm.sGet(false);
  gcxm.set(2, [2]);

  expect(xm.size).toBe(1);
  expect(cxm.size).toBe(2);
  expect(gcxm.size).toBe(2);

  xm.prune("a", false);
  expect(xm.size).toBe(1);
  expect(cxm.size).toBe(1);
  expect(gcxm.size).toBe(2);

  gcxm.delete(1);
  xm.prune("a", true);
  expect(xm.size).toBe(1);
  expect(cxm.size).toBe(1);
  expect(gcxm.size).toBe(1);

  gcxm.set(2, []);
  xm.prune("a", true, 2);
  expect(xm.size).toBe(0);
  expect(cxm.size).toBe(0);
  expect(gcxm.size).toBe(0);
});

test("XWeakMap: sGet", () => {
  const xm = new XWeakMap(XWeakMap.newXWeakMapGetter(() => "default"));

  const key = {};

  expect(xm.get(key)).toBeUndefined();

  const cxm = xm.sGet(key);
  expect(cxm).toBeInstanceOf(XWeakMap);

  expect(cxm.get(key)).toBeUndefined();
  expect(cxm.sGet(key)).toBe("default");
  expect(cxm.get(key)).toBe("default");
});
