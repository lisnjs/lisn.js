const { describe, test, expect } = require("@jest/globals");

const utils = window.LISN.utils;

test("validateStrList", () => {
  expect(utils.validateStrList("test", [], () => true)).toBeUndefined();
  expect(utils.validateStrList("test", [""], () => true)).toBeUndefined();
  expect(utils.validateStrList("test", "", () => true)).toBeUndefined();
  expect(utils.validateStrList("test", ",", () => true)).toBeUndefined();
  expect(utils.validateStrList("test", " ", () => true)).toBeUndefined();
  expect(utils.validateStrList("test", [" a", "", "b "], () => true)).toEqual([
    "a",
    "b",
  ]);
  expect(utils.validateStrList("test", "a ,, b ,", () => true)).toEqual([
    "a",
    "b",
  ]);

  expect(utils.validateStrList("test", "a", (s) => s === "a")).toEqual(["a"]);

  expect(() => utils.validateStrList("test", false, () => true)).toThrow(
    /'test' must be a string or a string array/,
  );
  expect(() => utils.validateStrList("test", [false], () => true)).toThrow(
    /'test' must be a string or a string array/,
  );
  expect(() => utils.validateStrList("test", "a,b", () => false)).toThrow(
    /Invalid value for 'test'/,
  );
  expect(() => utils.validateStrList("test", [1], () => true)).toThrow(
    /'test' must be a string or a string array/,
  );
});

test("validateNumList", () => {
  expect(utils.validateNumList("test", [])).toBeUndefined();
  expect(utils.validateNumList("test", "")).toBeUndefined();
  expect(utils.validateNumList("test", ",")).toBeUndefined();
  expect(utils.validateNumList("test", " ")).toBeUndefined();
  expect(utils.validateNumList("test", "1 ,, 2 ,")).toEqual([1, 2]);

  expect(() => utils.validateNumList("test", false)).toThrow(
    /'test' must be a number or a number array/,
  );
  expect(() => utils.validateNumList("test", ["x"])).toThrow(
    /'test' must be a number or a number array/,
  );
});

describe("validateNumber", () => {
  test("invalid", () => {
    expect(() => utils.validateNumber("key", "1px")).toThrow(
      /'key' must be a number/,
    );

    expect(() => utils.validateNumber("key", false)).toThrow(
      /'key' must be a number/,
    );

    expect(() => utils.validateNumber("key", true)).toThrow(
      /'key' must be a number/,
    );

    expect(() => utils.validateNumber("key", "")).toThrow(
      /'key' must be a number/,
    );
  });

  test("basic", () => {
    expect(utils.validateNumber("key", undefined)).toBeUndefined();
    expect(utils.validateNumber("key", null)).toBeUndefined();

    expect(utils.validateNumber("key", "1")).toBe(1);
    expect(utils.validateNumber("key", 1)).toBe(1);
  });
});

describe("validateBoolean", () => {
  test("invalid", () => {
    expect(() => utils.validateBoolean("key", 1)).toThrow(
      /'key' must be "true" or "false"/,
    );
  });

  test("basic", () => {
    expect(utils.validateBoolean("key", undefined)).toBeUndefined();
    expect(utils.validateBoolean("key", null)).toBeUndefined();

    expect(utils.validateBoolean("key", "")).toBe(true);
    expect(utils.validateBoolean("key", true)).toBe(true);
    expect(utils.validateBoolean("key", "true")).toBe(true);
    expect(utils.validateBoolean("key", false)).toBe(false);
    expect(utils.validateBoolean("key", "false")).toBe(false);
  });
});

describe("validateString", () => {
  test("invalid", () => {
    expect(() => utils.validateString("key", 1)).toThrow(
      /'key' must be a string/,
    );

    expect(() => utils.validateString("key", false)).toThrow(
      /'key' must be a string/,
    );

    expect(() => utils.validateString("key", true)).toThrow(
      /'key' must be a string/,
    );

    expect(() =>
      utils.validateString("key", "foo", (v) => v === "bar"),
    ).toThrow(/Invalid value for 'key'/);
  });

  test("basic", () => {
    expect(utils.validateString("key", undefined)).toBeUndefined();
    expect(utils.validateString("key", null)).toBeUndefined();
    expect(utils.validateString("key", "")).toBe("");

    expect(utils.validateString("key", "foo")).toBe("foo");
  });

  test("with checkFn", () => {
    expect(utils.validateString("key", "foo", (v) => v === "foo")).toBe("foo");

    expect(utils.validateString("key", "", (v) => v !== "foo")).toBe("");

    expect(
      utils.validateString("key", undefined, (v) => v === "foo"),
    ).toBeUndefined();

    expect(
      utils.validateString("key", null, (v) => v === "foo"),
    ).toBeUndefined();
  });
});

describe("validateBooleanOrString", () => {
  test("invalid", () => {
    expect(() => utils.validateBooleanOrString("key", 1)).toThrow(
      /'key' must be a boolean or string/,
    );

    expect(() =>
      utils.validateBooleanOrString("key", "foo", (v) => v === "bar"),
    ).toThrow(/Invalid value for 'key'/);
  });

  test("basic", () => {
    expect(utils.validateBooleanOrString("key", undefined)).toBeUndefined();
    expect(utils.validateBooleanOrString("key", null)).toBeUndefined();

    expect(utils.validateBooleanOrString("key", "")).toBe(true);
    expect(utils.validateBooleanOrString("key", true)).toBe(true);
    expect(utils.validateBooleanOrString("key", "true")).toBe(true);
    expect(utils.validateBooleanOrString("key", false)).toBe(false);
    expect(utils.validateBooleanOrString("key", "false")).toBe(false);

    expect(utils.validateBooleanOrString("key", "bar")).toBe("bar");
  });

  test("with checkFn", () => {
    expect(utils.validateBooleanOrString("key", "", (v) => v === "foo")).toBe(
      true,
    );

    expect(
      utils.validateBooleanOrString("key", "true", (v) => v === "foo"),
    ).toBe(true);

    expect(
      utils.validateBooleanOrString("key", "foo", (v) => v === "foo"),
    ).toBe("foo");

    expect(
      utils.validateBooleanOrString("key", undefined, (v) => v === "foo"),
    ).toBeUndefined();

    expect(
      utils.validateBooleanOrString("key", null, (v) => v === "foo"),
    ).toBeUndefined();
  });
});
