const { describe, test, expect } = require("@jest/globals");

const utils = window.LISN.utils;

test("toBoolean", () => {
  expect(utils.toBoolean(true)).toBe(true);
  expect(utils.toBoolean("true")).toBe(true);
  expect(utils.toBoolean("True")).toBe(true);
  expect(utils.toBoolean("TRUE")).toBe(true);
  expect(utils.toBoolean(" TRUE ")).toBe(true);

  expect(utils.toBoolean(false)).toBe(false);
  expect(utils.toBoolean("false")).toBe(false);
  expect(utils.toBoolean("False")).toBe(false);
  expect(utils.toBoolean("FALSE")).toBe(false);
  expect(utils.toBoolean(" FALSE ")).toBe(false);

  expect(utils.toBoolean(null)).toBe(false);
  expect(utils.toBoolean(undefined)).toBe(false);

  expect(utils.toBoolean("")).toBe(true);
  expect(utils.toBoolean("", true)).toBe(true);
  expect(utils.toBoolean("", false)).toBe(false);

  expect(utils.toBoolean(" ")).toBe(true);
  expect(utils.toBoolean(" ", true)).toBe(true);
  expect(utils.toBoolean(" ", false)).toBe(false);

  expect(utils.toBoolean("0")).toBe(null);
  expect(utils.toBoolean("1")).toBe(null);
  expect(utils.toBoolean(1)).toBe(null);
  expect(utils.toBoolean([])).toBe(null);
  expect(utils.toBoolean({})).toBe(null);
});

test("toIterableIfNot", () => {
  expect(utils.toIterableIfNot(1)).toEqual([1]);
  expect(utils.toIterableIfNot(false)).toEqual([false]);
  expect(utils.toIterableIfNot([1])).toEqual([1]);
  expect(utils.toIterableIfNot([1, 2])).toEqual([1, 2]);

  expect(utils.toIterableIfNot([])).toEqual([]);
  expect(utils.toIterableIfNot(null)).toEqual([]);
  expect(utils.toIterableIfNot()).toEqual([]);

  const s = new Set([1]);
  const m = new Map([[1, 1]]);
  expect(utils.toIterableIfNot(s)).toBe(s);
  expect(utils.toIterableIfNot(m)).toBe(m);
});

describe("compareValuesIn", () => {
  test("primitives: numbers", () => {
    expect(utils.compareValuesIn(1.1112, 1.1111)).toBe(true);
    expect(utils.compareValuesIn(1.1112, 1.1111, 4)).toBe(false);

    expect(utils.compareValuesIn(1, 1)).toBe(true);
    expect(utils.compareValuesIn(1, 1, 4)).toBe(true);
  });

  test("primitives: booleans", () => {
    expect(utils.compareValuesIn(true, true)).toBe(true);
    expect(utils.compareValuesIn(true, true, 4)).toBe(true);

    expect(utils.compareValuesIn(false, false)).toBe(true);
    expect(utils.compareValuesIn(false, false, 4)).toBe(true);

    expect(utils.compareValuesIn(false, true)).toBe(false);
    expect(utils.compareValuesIn(false, true, 4)).toBe(false);
  });

  test("primitives: strings", () => {
    expect(utils.compareValuesIn("1", "1")).toBe(true);
    expect(utils.compareValuesIn("1", "1", 4)).toBe(true);

    expect(utils.compareValuesIn("1.11111", "1.11112")).toBe(false);
    expect(utils.compareValuesIn("0", "-0")).toBe(false);
  });

  test("primitives: symbols", () => {
    const sA = Symbol("foo");
    const sB = Symbol("foo");
    expect(utils.compareValuesIn(sA, sA)).toBe(true);
    expect(utils.compareValuesIn(sA, sA, 4)).toBe(true);

    expect(utils.compareValuesIn(sA, sB)).toBe(false);
    expect(utils.compareValuesIn(sA, sB, 4)).toBe(false);
  });

  test("objects: l1", () => {
    const valA = {
      a: 1.1112,
      b: 2,
    };

    const valB = {
      a: 1.1111,
      b: 2,
    };

    expect(utils.compareValuesIn(valA, valB)).toBe(true);
    expect(utils.compareValuesIn(valA, valB, 4)).toBe(false);
  });

  test("objects: l2", () => {
    const valA = {
      a: {
        a: 1.1112,
        b: 2,
      },
    };

    const valB = {
      a: {
        a: 1.1111,
        b: 2,
      },
    };

    expect(utils.compareValuesIn(valA, valB)).toBe(true);
    expect(utils.compareValuesIn(valA, valB, 4)).toBe(false);
  });

  test("objects: extra keys", () => {
    const valA = {
      a: {
        a: 1,
      },
    };

    const valB = {
      a: {
        a: 1,
        b: 2,
      },
    };

    expect(utils.compareValuesIn(valA, valB)).toBe(false);
    expect(utils.compareValuesIn(valB, valA)).toBe(false);
  });

  test("objects: diff keys", () => {
    const valA = {
      a: {
        a: 1,
      },
    };

    const valB = {
      a: {
        b: 1,
      },
    };

    expect(utils.compareValuesIn(valA, valB)).toBe(false);
    expect(utils.compareValuesIn(valB, valA)).toBe(false);
  });

  test("arrays l1", () => {
    const valA = [1, 1.1112, 2];
    const valB = [1, 1.1111, 2];

    expect(utils.compareValuesIn(valA, valB)).toBe(true);
    expect(utils.compareValuesIn(valA, valB, 4)).toBe(false);
  });

  test("arrays l2", () => {
    const valA = [[1, 1.1112, 2], 3];
    const valB = [[1, 1.1111, 2], 3];

    expect(utils.compareValuesIn(valA, valB)).toBe(true);
    expect(utils.compareValuesIn(valA, valB, 4)).toBe(false);
  });

  test("arrays diff length", () => {
    const valA = [1, 2];
    const valB = [1, 2, 3];

    expect(utils.compareValuesIn(valA, valB)).toBe(false);
    expect(utils.compareValuesIn(valB, valA)).toBe(false);
  });

  test("arrays in objects in arrays", () => {
    const valA = [
      {
        a: [1, 1.1112],
      },
      2,
    ];
    const valB = [
      {
        a: [1, 1.1111],
      },
      2,
    ];

    expect(utils.compareValuesIn(valA, valB)).toBe(true);
    expect(utils.compareValuesIn(valA, valB, 4)).toBe(false);
  });
});
