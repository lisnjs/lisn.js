const { describe, test, expect } = require("@jest/globals");

const utils = window.LISN.utils;

describe("isValidColorComponents", () => {
  test("hsl", () => {
    expect(utils.isValidColorComponents({ h: 100, s: 50, l: 50 })).toBe(true);
    expect(utils.isValidColorComponents({ l: 100, s: 50, h: 50 })).toBe(true);
    expect(utils.isValidColorComponents({ h: 100, s: 50, l: 50, a: 1 })).toBe(
      true,
    );

    expect(utils.isValidColorComponents({ h: 100, s: "50" })).toBe(false);
    expect(utils.isValidColorComponents({ h: 100, s: 50 })).toBe(false);
    expect(utils.isValidColorComponents({ h: 100, s: 50, a: 1 })).toBe(false);
  });

  test("rgb", () => {
    expect(utils.isValidColorComponents({ r: 100, g: 50, b: 50 })).toBe(true);
    expect(utils.isValidColorComponents({ b: 100, g: 50, r: 50 })).toBe(true);
    expect(utils.isValidColorComponents({ r: 100, g: 50, b: 50, a: 1 })).toBe(
      true,
    );

    expect(utils.isValidColorComponents({ r: 100, g: "50", b: 50 })).toBe(
      false,
    );
    expect(utils.isValidColorComponents({ r: 100, g: 50 })).toBe(false);
    expect(utils.isValidColorComponents({ r: 100, g: 50, a: 1 })).toBe(false);
  });
});

test("toColorComponents", () => {
  expect(utils.toColorComponents(null)).toBeUndefined();
  expect(utils.toColorComponents(false)).toBeUndefined();
  expect(utils.toColorComponents({})).toBeUndefined();
  expect(utils.toColorComponents({ a: 1 })).toBeUndefined();
  expect(utils.toColorComponents({ x: 1, a: 1 })).toBeUndefined();

  expect(utils.toColorComponents({ h: 1 })).toEqual({
    h: 1,
    s: 100,
    l: 50,
    a: 1,
  });
  expect(utils.toColorComponents({ s: 1 })).toEqual({
    h: 0,
    s: 1,
    l: 50,
    a: 1,
  });
  expect(utils.toColorComponents({ l: 1 })).toEqual({
    h: 0,
    s: 100,
    l: 1,
    a: 1,
  });
  expect(utils.toColorComponents({ h: 1, s: 2, l: 3, x: 10, a: 0.5 })).toEqual({
    h: 1,
    s: 2,
    l: 3,
    a: 0.5,
  });

  expect(utils.toColorComponents({ r: 1 })).toEqual({ r: 1, g: 0, b: 0, a: 1 });
  expect(utils.toColorComponents({ g: 1 })).toEqual({ r: 0, g: 1, b: 0, a: 1 });
  expect(utils.toColorComponents({ b: 1 })).toEqual({ r: 0, g: 0, b: 1, a: 1 });
  expect(utils.toColorComponents({ r: 1, g: 2, b: 3, x: 10, a: 0.5 })).toEqual({
    r: 1,
    g: 2,
    b: 3,
    a: 0.5,
  });
});

test("toColor", () => {
  expect(utils.toColor(null)).toBe("");
  expect(utils.toColor({})).toBe("");

  expect(utils.toColor({ h: 10 })).toBe("hsl(10 100 50 / 1)");
  expect(utils.toColor({ h: 10, s: 50, l: 20, a: 0.5 })).toBe(
    "hsl(10 50 20 / 0.5)",
  );

  expect(utils.toColor({ r: 10 })).toBe("rgb(10 0 0 / 1)");
  expect(utils.toColor({ r: 10, g: 50, b: 20, a: 0.5 })).toBe(
    "rgb(10 50 20 / 0.5)",
  );
});

describe("addColor", () => {
  test("hsl + hsl", () => {
    // no other
    expect(utils.addColor({ h: 100, s: 50, l: 20, a: 0.5 }, {})).toEqual({
      h: 100,
      s: 50,
      l: 20,
      a: 0.5,
    });

    // missing alpha in original
    expect(utils.addColor({ h: 100, s: 50, l: 20 }, {})).toEqual({
      h: 100,
      s: 50,
      l: 20,
      a: 1,
    });

    // not overflowing
    expect(
      utils.addColor(
        { h: 100, s: 50, l: 20, a: 0.5 },
        { h: 250, s: 20, l: 10, a: 0.2 },
      ),
    ).toEqual({
      h: 350,
      s: 70,
      l: 30,
      a: 0.7,
    });

    // overflowing
    expect(
      utils.addColor(
        { h: 100, s: 50, l: 20, a: 0.5 },
        { h: 350, s: 80, l: 90, a: 0.7 },
      ),
    ).toEqual({
      h: 90, // 450 % 360
      s: 100,
      l: 100,
      a: 1,
    });

    // underflowing min
    expect(
      utils.addColor(
        { h: 100, s: 50, l: 20, a: 0.5 },
        { h: -850, s: -80, l: -90, a: -0.7 },
      ),
    ).toEqual({
      h: 330, // -750 % 360 + 360
      s: 0,
      l: 0,
      a: 0,
    });
  });

  test("rgb + rgb", () => {
    // no other
    expect(utils.addColor({ r: 100, g: 50, b: 20, a: 0.5 }, {})).toEqual({
      r: 100,
      g: 50,
      b: 20,
      a: 0.5,
    });

    // missing alpha in original
    expect(utils.addColor({ r: 100, g: 50, b: 20 }, {})).toEqual({
      r: 100,
      g: 50,
      b: 20,
      a: 1,
    });

    // not overflowing
    expect(
      utils.addColor(
        { r: 100, g: 50, b: 20, a: 0.5 },
        { r: 150, g: 20, b: 10, a: 0.2 },
      ),
    ).toEqual({
      r: 250,
      g: 70,
      b: 30,
      a: 0.7,
    });

    // overflowing
    expect(
      utils.addColor(
        { r: 100, g: 250, b: 220, a: 0.5 },
        { r: 350, g: 80, b: 90, a: 0.7 },
      ),
    ).toEqual({
      r: 255,
      g: 255,
      b: 255,
      a: 1,
    });

    // underflowing min
    expect(
      utils.addColor(
        { r: 100, g: 50, b: 20, a: 0.5 },
        { r: -250, g: -80, b: -90, a: -0.7 },
      ),
    ).toEqual({
      r: 0,
      g: 0,
      b: 0,
      a: 0,
    });
  });

  test("hsl + rgb", () => {
    const orig = { h: 100, s: 50, l: 20, a: 0.5 };
    const origRGB = utils.hsl2rgb(orig);
    const other = { r: 150, g: 20, b: 10, a: 0.2 };

    expect(utils.addColor(orig, other)).toEqual(utils.addColor(origRGB, other));
  });

  test("rgb + hsl", () => {
    const orig = { r: 100, g: 50, b: 20, a: 0.5 };
    const other = { h: 250, s: 20, l: 10, a: 0.2 };
    const otherRGB = utils.hsl2rgb(other);

    expect(utils.addColor(orig, other)).toEqual(utils.addColor(orig, otherRGB));
  });
});

test("hsl2rgb", () => {
  // pure red
  // ----- alpha 0
  expect(utils.hsl2rgb({ h: 0, s: 100, l: 50, a: 0 })).toEqual({
    r: 255,
    g: 0,
    b: 0,
    a: 0,
  });
  // ----- alpha 0.5
  expect(utils.hsl2rgb({ h: 0, s: 100, l: 50, a: 0.5 })).toEqual({
    r: 255,
    g: 0,
    b: 0,
    a: 0.5,
  });
  // ----- missing alpha
  expect(utils.hsl2rgb({ h: 0, s: 100, l: 50 })).toEqual({
    r: 255,
    g: 0,
    b: 0,
    a: 1,
  });
  // ----- overflowing values
  expect(utils.hsl2rgb({ h: 360, s: 150, l: 50 })).toEqual({
    r: 255,
    g: 0,
    b: 0,
    a: 1,
  });
  expect(utils.hsl2rgb({ h: 720, s: 150, l: 50 })).toEqual({
    r: 255,
    g: 0,
    b: 0,
    a: 1,
  });

  // pure green
  expect(utils.hsl2rgb({ h: 120, s: 100, l: 50, a: 1 })).toEqual({
    r: 0,
    g: 255,
    b: 0,
    a: 1,
  });

  // pure blue
  expect(utils.hsl2rgb({ h: 240, s: 100, l: 50, a: 1 })).toEqual({
    r: 0,
    g: 0,
    b: 255,
    a: 1,
  });

  // yellow
  expect(utils.hsl2rgb({ h: 60, s: 100, l: 50, a: 1 })).toEqual({
    r: 255,
    g: 255,
    b: 0,
    a: 1,
  });

  // cyan
  expect(utils.hsl2rgb({ h: 180, s: 100, l: 50, a: 1 })).toEqual({
    r: 0,
    g: 255,
    b: 255,
    a: 1,
  });

  // magenta
  expect(utils.hsl2rgb({ h: 300, s: 100, l: 50, a: 1 })).toEqual({
    r: 255,
    g: 0,
    b: 255,
    a: 1,
  });

  // white
  for (let i = 0; i < 5; i++) {
    expect(utils.hsl2rgb({ h: i * 60, s: i * 25, l: 100, a: 1 })).toEqual({
      r: 255,
      g: 255,
      b: 255,
      a: 1,
    });
  }

  // black
  for (let i = 0; i < 5; i++) {
    expect(utils.hsl2rgb({ h: i * 60, s: i * 25, l: 0, a: 1 })).toEqual({
      r: 0,
      g: 0,
      b: 0,
      a: 1,
    });
  }

  // grey
  for (let i = 0; i < 5; i++) {
    expect(utils.hsl2rgb({ h: i * 60, s: 0, l: 50, a: 1 })).toEqual({
      r: 128,
      g: 128,
      b: 128,
      a: 1,
    });
  }

  // intermediate
  expect(utils.hsl2rgb({ h: 0, s: 100, l: 25 })).toEqual({
    r: 128,
    g: 0,
    b: 0,
    a: 1,
  });
  expect(utils.hsl2rgb({ h: 200, s: 100, l: 25 })).toEqual({
    r: 0,
    g: 85,
    b: 128,
    a: 1,
  });
  expect(utils.hsl2rgb({ h: 50, s: 100, l: 50 })).toEqual({
    r: 255,
    g: 213,
    b: 0,
    a: 1,
  });
  expect(utils.hsl2rgb({ h: 210, s: 50, l: 60 })).toEqual({
    r: 102,
    g: 153,
    b: 204,
    a: 1,
  });
});
