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

test("toArrayIfSingle", () => {
  expect(utils.toArrayIfSingle(1)).toEqual([1]);
  expect(utils.toArrayIfSingle(false)).toEqual([false]);
  expect(utils.toArrayIfSingle([1])).toEqual([1]);
  expect(utils.toArrayIfSingle([1, 2])).toEqual([1, 2]);

  expect(utils.toArrayIfSingle([])).toEqual([]);
  expect(utils.toArrayIfSingle(null)).toEqual([]);
  expect(utils.toArrayIfSingle()).toEqual([]);
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
