const { describe, test, expect } = require("@jest/globals");

const utils = window.LISN.utils;

describe("formatAsString", () => {
  test("string", () => {
    expect(utils.formatAsString("foo")).toBe("foo");
  });

  test("<p>", () => {
    const el = document.createElement("p");
    expect(utils.formatAsString(el)).toBe("<P>");
  });

  test("<div class='foo bar'>", () => {
    const el = document.createElement("div");
    el.classList.add("foo", "bar");
    expect(utils.formatAsString(el)).toBe('<DIV class="foo bar">');
  });

  test("Error('foobar')", () => {
    expect(utils.formatAsString(new Error("foobar"))).toMatch(/^Error: foobar/);
  });

  test("Set([1,2,3])", () => {
    expect(utils.formatAsString(new Set([1, 2, 3]))).toBe("Set([1,2,3])");
  });

  test("1", () => {
    expect(utils.formatAsString(1)).toBe("1");
  });

  test("true", () => {
    expect(utils.formatAsString(true)).toBe("true");
  });

  test("null", () => {
    expect(utils.formatAsString(null)).toBe("null");
  });

  test("'aaaaaa' maxLen = -1", () => {
    expect(utils.formatAsString("aaaaaa", -1)).toBe("aaaaaa");
  });

  test("'aaaaaa' maxLen = 0", () => {
    expect(utils.formatAsString("aaaaaa", 0)).toBe("aaaaaa");
  });

  test("'aaaaaa' maxLen = 1", () => {
    expect(utils.formatAsString("aaaaaa", 1)).toBe("...");
  });

  test("'aaaaaa' maxLen = 2", () => {
    expect(utils.formatAsString("aaaaaa", 2)).toBe("...");
  });

  test("'aaaaaa' maxLen = 3", () => {
    expect(utils.formatAsString("aaaaaa", 3)).toBe("...");
  });

  test("'aaaaaa' maxLen = 4", () => {
    expect(utils.formatAsString("aaaaaa", 4)).toBe("a...");
  });

  test("'aaaaaa' maxLen = 5", () => {
    expect(utils.formatAsString("aaaaaa", 5)).toBe("aa...");
  });

  test("deeply nested", () => {
    expect(
      utils.formatAsString({
        a: {
          b: [
            "1",
            2,
            3,
            null,
            true,
            new Set([4, [5, false, "true", 6, 7, new Set([8, 9])]]),
          ],
          c: [new Map([["a", 1]])],
          d: new Map([["a", 1]]),
          e: "foo",
          f: {
            g: [document.body],
            h: true,
            i: 13,
            j: "s",
          },
        },
      }),
    ).toBe(
      '{"a":{"b":"[\\"1\\",2,3,null,true,Set([4,[5,false,\\"true\\",6,7,Set([8,9])]])]","c":"[Map([[\\"a\\",1]])]","d":"Map([[\\"a\\",1]])","e":"foo","f":{"g":"[<BODY>]","h":true,"i":13,"j":"s"}}}',
    );
  });
});

describe("joinAsString", () => {
  test("no args", () => {
    expect(utils.joinAsString("|")).toBe("");
  });
  test("|-separated misc values", () => {
    expect(utils.joinAsString("|", [1, 2, 3], 1, "a")).toBe("[1,2,3]|1|a");
  });
});

describe("splitOn", () => {
  expect(utils.splitOn("", ",")).toEqual([]);
  expect(utils.splitOn(" ", ",")).toEqual([]);
  expect(utils.splitOn(" a | b", "|")).toEqual([" a ", " b"]);
  expect(utils.splitOn(" a | b", "|", true)).toEqual(["a", "b"]);

  expect(utils.splitOn("foo   bar baz bla", /\s+/, false, 0)).toEqual([
    "foo   bar baz bla",
  ]);

  expect(utils.splitOn("foo   bar baz bla", /\s+/, false, 1)).toEqual([
    "foo",
    "bar baz bla",
  ]);

  expect(utils.splitOn("foo   bar baz bla", /\s+/, false, 2)).toEqual([
    "foo",
    "bar",
    "baz bla",
  ]);

  expect(utils.splitOn("foo   bar baz bla", /\s+/, false, 3)).toEqual([
    "foo",
    "bar",
    "baz",
    "bla",
  ]);

  expect(utils.splitOn("foo   bar baz bla", /\s+/, false, 4)).toEqual([
    "foo",
    "bar",
    "baz",
    "bla",
  ]);

  expect(utils.splitOn("foo   bar baz bla", /X/, false, 2)).toEqual([
    "foo   bar baz bla",
  ]);

  expect(utils.splitOn("foo   bar baz bla", /\s+/)).toEqual([
    "foo",
    "bar",
    "baz",
    "bla",
  ]);

  expect(utils.splitOn("foo bar baz bla", " ", false, -1)).toEqual([
    "foo",
    "bar",
    "baz",
    "bla",
  ]);
});

describe("kebabToCamelCase", () => {
  test("fooBarBaz", () => {
    expect(utils.kebabToCamelCase("fooBarBaz")).toBe("fooBarBaz");
  });

  test("foo-bar-baz", () => {
    expect(utils.kebabToCamelCase("foo-bar-baz")).toBe("fooBarBaz");
  });

  test("foo-Bar-baz", () => {
    expect(utils.kebabToCamelCase("foo-Bar-baz")).toBe("fooBarBaz");
  });

  test("-foo-Bar-baz", () => {
    expect(utils.kebabToCamelCase("-foo-Bar-baz")).toBe("FooBarBaz");
  });

  test("-foo-Bar-baz", () => {
    expect(utils.kebabToCamelCase("-foo-BAR-baz")).toBe("FooBARBaz");
  });
});

describe("camelToKebabCase", () => {
  test("foo-bar-baz", () => {
    expect(utils.camelToKebabCase("foo-bar-baz")).toBe("foo-bar-baz");
  });

  test("fooBarBaz", () => {
    expect(utils.camelToKebabCase("fooBarBaz")).toBe("foo-bar-baz");
  });

  test("FooBarBaz", () => {
    expect(utils.camelToKebabCase("FooBarBaz")).toBe("-foo-bar-baz");
  });

  test("FOOBarBaz", () => {
    expect(utils.camelToKebabCase("FOOBarBaz")).toBe("-foo-bar-baz");
  });

  test("FooBARBaz", () => {
    expect(utils.camelToKebabCase("FooBARBaz")).toBe("-foo-bar-baz");
  });

  test("fooBARBaz", () => {
    expect(utils.camelToKebabCase("fooBARBaz")).toBe("foo-bar-baz");
  });
});

describe("randId", () => {
  test("default length", () => {
    const nIter = 100000;
    const lengths = {};
    const seen = {};
    let duplicates = 0;
    for (let i = 0; i < 100000; i++) {
      const s = utils.randId();
      if (seen[s]) {
        duplicates++;
      }
      seen[s] = true;
      lengths[s.length] = (lengths[s.length] || 0) + 1;
    }
    expect(lengths).toEqual({ 8: nIter });
    expect(duplicates).toBeLessThan(nIter / 10000);
  });

  test("odd length", () => {
    const nIter = 100000;
    const strLen = 11;
    const lengths = {};
    const seen = {};
    let duplicates = 0;
    for (let i = 0; i < 100000; i++) {
      const s = utils.randId(strLen);
      if (seen[s]) {
        duplicates++;
      }
      seen[s] = true;
      lengths[s.length] = (lengths[s.length] || 0) + 1;
    }
    expect(lengths).toEqual({ [strLen]: nIter });
    expect(duplicates).toBeLessThan(nIter / 10000);
  });
});

describe("toMargins", () => {
  const sizeObj = { width: 100, height: 200 };
  const size = sizeObj.width;

  test("invalid", () => {
    expect(() => utils.toMargins("10em", size)).toThrow(
      /values should be in pixel or percentage/,
    );
    expect(() => utils.toMargins("auto", size)).toThrow(
      /values should be in pixel or percentage/,
    );
  });

  test("absolute: one value", () => {
    expect(utils.toMargins("10px", size)).toEqual([10, 10, 10, 10]);
    expect(utils.toMargins("10", size)).toEqual([10, 10, 10, 10]);

    expect(utils.toMargins("0px", size)).toEqual([0, 0, 0, 0]);
    expect(utils.toMargins("0", size)).toEqual([0, 0, 0, 0]);

    expect(utils.toMargins("-10px", size)).toEqual([-10, -10, -10, -10]);
    expect(utils.toMargins("-10", size)).toEqual([-10, -10, -10, -10]);
  });

  test("absolute: two values", () => {
    expect(utils.toMargins("10px -20px", size)).toEqual([10, -20, 10, -20]);
    expect(utils.toMargins("10 -20", size)).toEqual([10, -20, 10, -20]);

    expect(utils.toMargins("0px -10", size)).toEqual([0, -10, 0, -10]);
    expect(utils.toMargins("0 -10px", size)).toEqual([0, -10, 0, -10]);
  });

  test("absolute: three values", () => {
    expect(utils.toMargins("10px -20px 0px", size)).toEqual([10, -20, 0, -20]);
    expect(utils.toMargins("10 -20 0", size)).toEqual([10, -20, 0, -20]);

    expect(utils.toMargins("0px -10 20", size)).toEqual([0, -10, 20, -10]);
    expect(utils.toMargins("0 -10px 20px", size)).toEqual([0, -10, 20, -10]);
  });

  test("absolute: four values", () => {
    expect(utils.toMargins("10px -20px 0px 5px", size)).toEqual([
      10, -20, 0, 5,
    ]);
    expect(utils.toMargins("10 -20 0 5", size)).toEqual([10, -20, 0, 5]);

    expect(utils.toMargins("0px -10 20 5px", size)).toEqual([0, -10, 20, 5]);
    expect(utils.toMargins("0 -10px 20px 5", size)).toEqual([0, -10, 20, 5]);
  });

  test("percentage: one value", () => {
    expect(utils.toMargins("10%", sizeObj)).toEqual([
      10 * sizeObj.height,
      10 * sizeObj.width,
      10 * sizeObj.height,
      10 * sizeObj.width,
    ]);
    expect(utils.toMargins("10%", size)).toEqual([
      10 * size,
      10 * size,
      10 * size,
      10 * size,
    ]);
  });

  test("percentage: two values", () => {
    expect(utils.toMargins("10% -20%", sizeObj)).toEqual([
      10 * sizeObj.height,
      -20 * sizeObj.width,
      10 * sizeObj.height,
      -20 * sizeObj.width,
    ]);
    expect(utils.toMargins("10% -20%", size)).toEqual([
      10 * size,
      -20 * size,
      10 * size,
      -20 * size,
    ]);

    expect(utils.toMargins("0% -10%", sizeObj)).toEqual([
      0 * sizeObj.height,
      -10 * sizeObj.width,
      0 * sizeObj.height,
      -10 * sizeObj.width,
    ]);
    expect(utils.toMargins("0% -10%", size)).toEqual([
      0 * size,
      -10 * size,
      0 * size,
      -10 * size,
    ]);
  });

  test("percentage: three values", () => {
    expect(utils.toMargins("10% -20% 0%", sizeObj)).toEqual([
      10 * sizeObj.height,
      -20 * sizeObj.width,
      0 * sizeObj.height,
      -20 * sizeObj.width,
    ]);
    expect(utils.toMargins("10% -20% 0%", size)).toEqual([
      10 * size,
      -20 * size,
      0 * size,
      -20 * size,
    ]);
  });

  test("percentage: four values", () => {
    expect(utils.toMargins("10% -20% 0% 5%", sizeObj)).toEqual([
      10 * sizeObj.height,
      -20 * sizeObj.width,
      0 * sizeObj.height,
      5 * sizeObj.width,
    ]);
    expect(utils.toMargins("10% -20% 0% 5%", size)).toEqual([
      10 * size,
      -20 * size,
      0 * size,
      5 * size,
    ]);
  });
});

describe("toMarginProps", () => {
  const sizeObj = { width: 100, height: 200 };
  const size = sizeObj.width;

  test("invalid", () => {
    expect(() => utils.toMarginProps("10em", size)).toThrow(
      /values should be in pixel or percentage/,
    );
    expect(() => utils.toMarginProps("auto", size)).toThrow(
      /values should be in pixel or percentage/,
    );
  });

  test("absolute: one value", () => {
    expect(utils.toMarginProps("10px", size)).toEqual({
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    });
    expect(utils.toMarginProps("10", size)).toEqual({
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    });

    expect(utils.toMarginProps("0px", size)).toEqual({
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });
    expect(utils.toMarginProps("0", size)).toEqual({
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });

    expect(utils.toMarginProps("-10px", size)).toEqual({
      top: -10,
      right: -10,
      bottom: -10,
      left: -10,
    });
    expect(utils.toMarginProps("-10", size)).toEqual({
      top: -10,
      right: -10,
      bottom: -10,
      left: -10,
    });
  });

  test("absolute: two values", () => {
    expect(utils.toMarginProps("10px -20px", size)).toEqual({
      top: 10,
      right: -20,
      bottom: 10,
      left: -20,
    });
    expect(utils.toMarginProps("10 -20", size)).toEqual({
      top: 10,
      right: -20,
      bottom: 10,
      left: -20,
    });

    expect(utils.toMarginProps("0px -10", size)).toEqual({
      top: 0,
      right: -10,
      bottom: 0,
      left: -10,
    });
    expect(utils.toMarginProps("0 -10px", size)).toEqual({
      top: 0,
      right: -10,
      bottom: 0,
      left: -10,
    });
  });

  test("absolute: three values", () => {
    expect(utils.toMarginProps("10px -20px 0px", size)).toEqual({
      top: 10,
      right: -20,
      bottom: 0,
      left: -20,
    });
    expect(utils.toMarginProps("10 -20 0", size)).toEqual({
      top: 10,
      right: -20,
      bottom: 0,
      left: -20,
    });

    expect(utils.toMarginProps("0px -10 20", size)).toEqual({
      top: 0,
      right: -10,
      bottom: 20,
      left: -10,
    });
    expect(utils.toMarginProps("0 -10px 20px", size)).toEqual({
      top: 0,
      right: -10,
      bottom: 20,
      left: -10,
    });
  });

  test("absolute: four values", () => {
    expect(utils.toMarginProps("10px -20px 0px 5px", size)).toEqual({
      top: 10,
      right: -20,
      bottom: 0,
      left: 5,
    });
    expect(utils.toMarginProps("10 -20 0 5", size)).toEqual({
      top: 10,
      right: -20,
      bottom: 0,
      left: 5,
    });

    expect(utils.toMarginProps("0px -10 20 5px", size)).toEqual({
      top: 0,
      right: -10,
      bottom: 20,
      left: 5,
    });
    expect(utils.toMarginProps("0 -10px 20px 5", size)).toEqual({
      top: 0,
      right: -10,
      bottom: 20,
      left: 5,
    });
  });

  test("percentage: one value", () => {
    expect(utils.toMarginProps("10%", sizeObj)).toEqual({
      top: 10 * sizeObj.height,
      right: 10 * sizeObj.width,
      bottom: 10 * sizeObj.height,
      left: 10 * sizeObj.width,
    });
    expect(utils.toMarginProps("10%", size)).toEqual({
      top: 10 * size,
      right: 10 * size,
      bottom: 10 * size,
      left: 10 * size,
    });
  });

  test("percentage: two values", () => {
    expect(utils.toMarginProps("10% -20%", sizeObj)).toEqual({
      top: 10 * sizeObj.height,
      right: -20 * sizeObj.width,
      bottom: 10 * sizeObj.height,
      left: -20 * sizeObj.width,
    });
    expect(utils.toMarginProps("10% -20%", size)).toEqual({
      top: 10 * size,
      right: -20 * size,
      bottom: 10 * size,
      left: -20 * size,
    });

    expect(utils.toMarginProps("0% -10%", sizeObj)).toEqual({
      top: 0 * sizeObj.height,
      right: -10 * sizeObj.width,
      bottom: 0 * sizeObj.height,
      left: -10 * sizeObj.width,
    });
    expect(utils.toMarginProps("0% -10%", size)).toEqual({
      top: 0 * size,
      right: -10 * size,
      bottom: 0 * size,
      left: -10 * size,
    });
  });

  test("percentage: three values", () => {
    expect(utils.toMarginProps("10% -20% 0%", sizeObj)).toEqual({
      top: 10 * sizeObj.height,
      right: -20 * sizeObj.width,
      bottom: 0 * sizeObj.height,
      left: -20 * sizeObj.width,
    });
    expect(utils.toMarginProps("10% -20% 0%", size)).toEqual({
      top: 10 * size,
      right: -20 * size,
      bottom: 0 * size,
      left: -20 * size,
    });
  });

  test("percentage: four values", () => {
    expect(utils.toMarginProps("10% -20% 0% 5%", sizeObj)).toEqual({
      top: 10 * sizeObj.height,
      right: -20 * sizeObj.width,
      bottom: 0 * sizeObj.height,
      left: 5 * sizeObj.width,
    });
    expect(utils.toMarginProps("10% -20% 0% 5%", size)).toEqual({
      top: 10 * size,
      right: -20 * size,
      bottom: 0 * size,
      left: 5 * size,
    });
  });
});

describe("toMarginString", () => {
  test("single value", () => {
    expect(utils.toMarginString(10)).toBe("10px 10px 10px 10px");
    expect(utils.toMarginString("10px")).toBe("10px 10px 10px 10px");
    expect(utils.toMarginString("10em")).toBe("10em 10em 10em 10em");
  });

  test("string with multiple", () => {
    expect(utils.toMarginString("10px -10em")).toBe("10px -10em 10px -10em");
    expect(utils.toMarginString("10px -10em 5%")).toBe("10px -10em 5% -10em");
    expect(utils.toMarginString("10px -10em 5% 0px")).toBe("10px -10em 5% 0px");
  });

  test("[margin]", () => {
    expect(utils.toMarginString([10])).toBe("10px 10px 10px 10px");
    expect(utils.toMarginString(["10px"])).toBe("10px 10px 10px 10px");
    expect(utils.toMarginString(["10em"])).toBe("10em 10em 10em 10em");
  });

  test("[margin, margin]", () => {
    expect(utils.toMarginString([10, -10])).toBe("10px -10px 10px -10px");
    expect(utils.toMarginString([10, "2em"])).toBe("10px 2em 10px 2em");
    expect(utils.toMarginString(["10px", "-10%"])).toBe("10px -10% 10px -10%");
  });

  test("[margin, margin, margin]", () => {
    expect(utils.toMarginString([10, -10, 0])).toBe("10px -10px 0px -10px");
    expect(utils.toMarginString([10, "2em", "0%"])).toBe("10px 2em 0% 2em");
    expect(utils.toMarginString(["10px", "-10%", 0])).toBe(
      "10px -10% 0px -10%",
    );
  });

  test("[margin, margin, margin, margin]", () => {
    expect(utils.toMarginString([10, -10, 0, 1])).toBe("10px -10px 0px 1px");
    expect(utils.toMarginString([10, "2em", "0%", "5px"])).toBe(
      "10px 2em 0% 5px",
    );
    expect(utils.toMarginString(["10px", "-10%", 0, "5px"])).toBe(
      "10px -10% 0px 5px",
    );
  });
});

describe("objToStrKey", () => {
  test("basic: order", () => {
    expect(utils.objToStrKey({ b: 1, a: 2 })).toBe("[2,1]");
    expect(utils.objToStrKey({ a: 2, b: 1 })).toBe("[2,1]");
  });

  test("array of objects", () => {
    expect(
      utils.objToStrKey([
        { b: 1, a: 2 },
        { z: 4, y: 3 },
      ]),
    ).toBe("[[2,1],[3,4]]");
  });

  test("nested", () => {
    expect(
      utils.objToStrKey({
        a: 1,
        c: 2,
        b: { ba: 3, bc: 4, bb: { bba: [5, [6, { z: 7, x: 8 }]] } },
      }),
    ).toBe("[1,[3,[[5,[6,[8,7]]]],4],2]");
  });

  test("empty", () => {
    expect(utils.objToStrKey({})).toBe("[]");
  });
});
