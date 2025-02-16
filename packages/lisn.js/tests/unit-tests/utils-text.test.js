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
