const { describe, test, expect } = require("@jest/globals");

const { BitSpaces } = window.LISN.modules;
const { getBitmask } = window.LISN.utils;

const bitSpaces = new BitSpaces();
const SPACEA = bitSpaces.create("a", "b");
const SPACEB = bitSpaces.create("c", "d", "e");

describe("BitSpace.has", () => {
  test("SPACEA", () => {
    expect(SPACEA.has("a")).toEqual(true);
    expect(SPACEA.has("b")).toEqual(true);

    expect(SPACEA.has("A")).toEqual(false);
    expect(SPACEA.has("B")).toEqual(false);

    expect(SPACEA.has("start")).toEqual(false);
    expect(SPACEA.has("end")).toEqual(false);
    expect(SPACEA.has("has")).toEqual(false);
    expect(SPACEA.has("bitmaskFor")).toEqual(false);
    expect(SPACEA.has("nameOf")).toEqual(false);

    expect(SPACEA.has("c")).toEqual(false);
  });

  test("SPACEB", () => {
    expect(SPACEB.has("c")).toEqual(true);
    expect(SPACEB.has("d")).toEqual(true);
    expect(SPACEB.has("e")).toEqual(true);

    expect(SPACEB.has("C")).toEqual(false);
    expect(SPACEB.has("D")).toEqual(false);
    expect(SPACEB.has("E")).toEqual(false);

    expect(SPACEB.has("start")).toEqual(false);
    expect(SPACEB.has("end")).toEqual(false);
    expect(SPACEB.has("has")).toEqual(false);
    expect(SPACEB.has("bitmaskFor")).toEqual(false);
    expect(SPACEB.has("nameOf")).toEqual(false);

    expect(SPACEB.has("a")).toEqual(false);
  });
});

describe("BitSpace.bitmaskFor", () => {
  test("SPACEA", () => {
    expect(SPACEA.bitmaskFor()).toBe(SPACEA.bitmask);
    expect(SPACEA.bitmaskFor("a")).toBe(SPACEA.bitmask);
    expect(SPACEA.bitmaskFor("b")).toBe(SPACEA.bit.b);
    expect(SPACEA.bitmaskFor(null, "a")).toBe(SPACEA.bit.a);
    expect(SPACEA.bitmaskFor(null, "b")).toBe(SPACEA.bitmask);
    expect(SPACEA.bitmaskFor("a", "b")).toBe(SPACEA.bitmask);
    expect(SPACEA.bitmaskFor("b", "a")).toBe(SPACEA.bitmask);

    expect(SPACEA.bitmaskFor("c")).toBe(0);
  });

  test("SPACEB", () => {
    expect(SPACEB.bitmaskFor()).toBe(SPACEB.bitmask);
    expect(SPACEB.bitmaskFor("c")).toBe(SPACEB.bitmask);
    expect(SPACEB.bitmaskFor("d")).toBe(SPACEB.bit.d | SPACEB.bit.e);
    expect(SPACEB.bitmaskFor("e")).toBe(SPACEB.bit.e);
    expect(SPACEB.bitmaskFor(null, "c")).toBe(SPACEB.bit.c);
    expect(SPACEB.bitmaskFor(null, "d")).toBe(SPACEB.bit.c | SPACEB.bit.d);
    expect(SPACEB.bitmaskFor(null, "e")).toBe(SPACEB.bitmask);
    expect(SPACEB.bitmaskFor("c", "e")).toBe(SPACEB.bitmask);
    expect(SPACEB.bitmaskFor("e", "c")).toBe(SPACEB.bitmask);

    expect(SPACEB.bitmaskFor("a")).toBe(0);
  });
});

describe("BitSpace.nameOf", () => {
  test("SPACEA", () => {
    expect(SPACEA.nameOf(1 << 0)).toBe("a");
    expect(SPACEA.nameOf(1 << 1)).toBe("b");

    expect(SPACEA.nameOf(0)).toBe(null);
    expect(SPACEA.nameOf(1 << 2)).toBe(null);
    expect(SPACEA.nameOf((1 << 0) | (1 << 1))).toBe(null);
  });

  test("SPACEB", () => {
    expect(SPACEB.nameOf(1 << 2)).toBe("c");
    expect(SPACEB.nameOf(1 << 3)).toBe("d");
    expect(SPACEB.nameOf(1 << 4)).toBe("e");

    expect(SPACEB.nameOf(0)).toBe(null);
    expect(SPACEB.nameOf(1 << 0)).toBe(null);
    expect(SPACEB.nameOf((1 << 2) | (1 << 3))).toBe(null);
  });
});

test("BitSpace.start", () => {
  expect(SPACEA.start).toBe(0);
  expect(SPACEB.start).toBe(2);
});

test("BitSpace.end", () => {
  expect(SPACEA.end).toBe(1);
  expect(SPACEB.end).toBe(4);
});

test("BitSpace.bitmask", () => {
  expect(SPACEA.bitmask).toBe((1 << 0) | (1 << 1));
  expect(SPACEB.bitmask).toBe((1 << 2) | (1 << 3) | (1 << 4));
});

test("BitSpace.overflow", () => {
  expect(() =>
    new BitSpaces().create(..."abcdefghijklmnopqrstuvwxyzABCDEF"),
  ).toThrow(/overflow/);
});

test("BitSpaces: no bit overlap between each value", () => {
  expect(SPACEA.bit.a).toBe(1 << 0);
  expect(SPACEA.bit.b).toBe(1 << 1);
  expect(SPACEB.bit.c).toBe(1 << 2);
  expect(SPACEB.bit.d).toBe(1 << 3);
  expect(SPACEB.bit.e).toBe(1 << 4);
});

test("BitSpaces: enumerability and order of bit props", () => {
  expect(Object.keys(SPACEA.bit)).toEqual(["a", "b"]);
  expect(Object.keys(SPACEB.bit)).toEqual(["c", "d", "e"]);
});

test("BitSpaces.nBits", () => {
  expect(bitSpaces.nBits).toBe(5);
});

test("BitSpaces.bitmask", () => {
  expect(bitSpaces.bitmask).toBe(
    (1 << 0) | (1 << 1) | (1 << 2) | (1 << 3) | (1 << 4),
  );
});

test("getBitmask", () => {
  expect(getBitmask(0, 0)).toBe(1 << 0);
  expect(getBitmask(0, 1)).toBe((1 << 0) | (1 << 1));
  expect(getBitmask(1, 0)).toBe((1 << 0) | (1 << 1));

  expect(getBitmask(1, 1)).toBe(1 << 1);
  expect(getBitmask(1, 2)).toBe((1 << 1) | (1 << 2));
  expect(getBitmask(2, 1)).toBe((1 << 1) | (1 << 2));
});
