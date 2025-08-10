const { describe, test, expect } = require("@jest/globals");

const utils = window.LISN.utils;

test("roundNumTo", () => {
  expect(utils.roundNumTo(1.123, 4)).toBe(1.123);
  expect(utils.roundNumTo(1.123, 3)).toBe(1.123);
  expect(utils.roundNumTo(1.123, 2)).toBe(1.12);
  expect(utils.roundNumTo(1.123, 1)).toBe(1.1);
  expect(utils.roundNumTo(1.123, 0)).toBe(1);
  expect(utils.roundNumTo(1.123)).toBe(1);
});

test("isValidNum", () => {
  expect(utils.isValidNum(undefined)).toBe(false);
  expect(utils.isValidNum(null)).toBe(false);
  expect(utils.isValidNum("")).toBe(false);
  expect(utils.isValidNum("x")).toBe(false);
  expect(utils.isValidNum(NaN)).toBe(false);
  expect(utils.isValidNum(-Infinity)).toBe(false);
  expect(utils.isValidNum(Infinity)).toBe(false);
  expect(utils.isValidNum(1.1)).toBe(true);
  expect(utils.isValidNum(1)).toBe(true);
  expect(utils.isValidNum(0)).toBe(true);
  expect(utils.isValidNum(-1)).toBe(true);
});

test("toNum", () => {
  expect(utils.toNum("", -1)).toBe(-1);
  expect(utils.toNum("", null)).toBe(null);
  expect(utils.toNum("-1", null)).toBe(-1);
  expect(utils.toNum("0", null)).toBe(0);
  expect(utils.toNum("1", null)).toBe(1);
  expect(utils.toNum("1x", null)).toBe(null);
  expect(utils.toNum("x", null)).toBe(null);
  expect(utils.toNum(-1, null)).toBe(-1);
  expect(utils.toNum(-Infinity, null)).toBe(null);
  expect(utils.toNum(0, null)).toBe(0);
  expect(utils.toNum(1, null)).toBe(1);
  expect(utils.toNum(1.1, null)).toBe(1.1);
  expect(utils.toNum(Infinity, null)).toBe(null);
  expect(utils.toNum(NaN, null)).toBe(null);
  expect(utils.toNum(null, -1)).toBe(-1);
  expect(utils.toNum(undefined, null)).toBe(null);
});

test("toInt", () => {
  expect(utils.toInt("", -1)).toBe(-1);
  expect(utils.toInt("", null)).toBe(null);
  expect(utils.toInt("-1", null)).toBe(-1);
  expect(utils.toInt("0", null)).toBe(0);
  expect(utils.toInt("1", null)).toBe(1);
  expect(utils.toInt("1x", null)).toBe(null);
  expect(utils.toInt("x", null)).toBe(null);
  expect(utils.toInt(-1, null)).toBe(-1);
  expect(utils.toInt(-Infinity, null)).toBe(null);
  expect(utils.toInt(0, null)).toBe(0);
  expect(utils.toInt(1, null)).toBe(1);
  expect(utils.toInt(1.1, null)).toBe(null);
  expect(utils.toInt(Infinity, null)).toBe(null);
  expect(utils.toInt(NaN, null)).toBe(null);
  expect(utils.toInt(null, -1)).toBe(-1);
  expect(utils.toInt(undefined, null)).toBe(null);
});

test("toNonNegNum", () => {
  expect(utils.toNonNegNum("", -1)).toBe(-1);
  expect(utils.toNonNegNum("", null)).toBe(null);
  expect(utils.toNonNegNum("-1", null)).toBe(null);
  expect(utils.toNonNegNum("0", null)).toBe(0);
  expect(utils.toNonNegNum("1", null)).toBe(1);
  expect(utils.toNonNegNum("1x", null)).toBe(null);
  expect(utils.toNonNegNum("x", null)).toBe(null);
  expect(utils.toNonNegNum(-1, null)).toBe(null);
  expect(utils.toNonNegNum(-Infinity, null)).toBe(null);
  expect(utils.toNonNegNum(0, null)).toBe(0);
  expect(utils.toNonNegNum(1, null)).toBe(1);
  expect(utils.toNonNegNum(1.1, null)).toBe(1.1);
  expect(utils.toNonNegNum(Infinity, null)).toBe(null);
  expect(utils.toNonNegNum(NaN, null)).toBe(null);
  expect(utils.toNonNegNum(null, -1)).toBe(-1);
  expect(utils.toNonNegNum(undefined, null)).toBe(null);
});

test("toPosNum", () => {
  expect(utils.toPosNum("", -1)).toBe(-1);
  expect(utils.toPosNum("", null)).toBe(null);
  expect(utils.toPosNum("-1", null)).toBe(null);
  expect(utils.toPosNum("0", null)).toBe(null);
  expect(utils.toPosNum("1", null)).toBe(1);
  expect(utils.toPosNum("1x", null)).toBe(null);
  expect(utils.toPosNum("x", null)).toBe(null);
  expect(utils.toPosNum(-1, null)).toBe(null);
  expect(utils.toPosNum(-Infinity, null)).toBe(null);
  expect(utils.toPosNum(0, null)).toBe(null);
  expect(utils.toPosNum(1, null)).toBe(1);
  expect(utils.toPosNum(1.1, null)).toBe(1.1);
  expect(utils.toPosNum(Infinity, null)).toBe(null);
  expect(utils.toPosNum(NaN, null)).toBe(null);
  expect(utils.toPosNum(null, -1)).toBe(-1);
  expect(utils.toPosNum(undefined, null)).toBe(null);
});

describe("toNumWithBounds", () => {
  test("invalid number", () => {
    expect(utils.toNumWithBounds("x", { min: 10 }, null)).toBe(null);
    expect(utils.toNumWithBounds("x", { max: 10 })).toBe(10);
    expect(utils.toNumWithBounds("x", { min: 10 })).toBe(10);
    expect(utils.toNumWithBounds("x", { max: 10, min: 1 })).toBe(1);
    expect(utils.toNumWithBounds("x")).toBe(0);
  });

  test("outside bounds with default", () => {
    expect(utils.toNumWithBounds("1", { min: 10 }, null)).toBe(null);
    expect(utils.toNumWithBounds("20", { min: 10 }, null)).toBe(20);

    expect(utils.toNumWithBounds("1", { max: 10 }, null)).toBe(1);
    expect(utils.toNumWithBounds("20", { max: 10 }, null)).toBe(null);

    expect(utils.toNumWithBounds("1", { min: 0, max: 10 }, null)).toBe(1);
    expect(utils.toNumWithBounds("1", { min: 5, max: 10 }, null)).toBe(null);
    expect(utils.toNumWithBounds("20", { min: 5, max: 10 }, null)).toBe(null);

    expect(utils.toNumWithBounds("-1", { min: 0 }, null)).toBe(null);
    expect(utils.toNumWithBounds("-1", { min: -10 }, null)).toBe(-1);
    expect(utils.toNumWithBounds("-20", { min: -10 }, null)).toBe(null);
  });

  test("outside bounds without default", () => {
    expect(utils.toNumWithBounds("1", { min: 10 })).toBe(10);
    expect(utils.toNumWithBounds("20", { min: 10 })).toBe(20);

    expect(utils.toNumWithBounds("1", { max: 10 })).toBe(1);
    expect(utils.toNumWithBounds("20", { max: 10 })).toBe(10);

    expect(utils.toNumWithBounds("1", { min: 0, max: 10 })).toBe(1);
    expect(utils.toNumWithBounds("1", { min: 5, max: 10 })).toBe(5);
    expect(utils.toNumWithBounds("20", { min: 5, max: 10 })).toBe(10);

    expect(utils.toNumWithBounds("-1", { min: 0 })).toBe(0);
    expect(utils.toNumWithBounds("-1", { min: -10 })).toBe(-1);
    expect(utils.toNumWithBounds("-20", { min: -10 })).toBe(-10);
  });
});

test("toRawNum", () => {
  expect(utils.toRawNum(1, 10, null)).toBe(1);
  expect(utils.toRawNum(0, 10, null)).toBe(0);
  expect(utils.toRawNum(-1, 10, null)).toBe(-1);
  expect(utils.toRawNum(1.1, 10, null)).toBe(1.1);

  expect(utils.toRawNum(null, 10, null)).toBe(10);
  expect(utils.toRawNum(undefined, 10, null)).toBe(10);

  expect(utils.toRawNum(Infinity, 10, null)).toBe(10);
  expect(utils.toRawNum(NaN, 10, null)).toBe(10);
  expect(utils.toRawNum("1x", 10, null)).toBe(10);
  expect(utils.toRawNum("x1", 10, null)).toBe(10);

  expect(utils.toRawNum("0", 10, null)).toBe(0);
  expect(utils.toRawNum("1", 10, null)).toBe(1);

  expect(utils.toRawNum("-5", 10, null)).toBe(5);
  expect(utils.toRawNum("+10", 10, null)).toBe(20);
  expect(utils.toRawNum("*3", 10, null)).toBe(30);

  expect(utils.toRawNum("1", NaN, null)).toBe(1);

  expect(utils.toRawNum("-5", NaN, null)).toBe(null);
  expect(utils.toRawNum("x", NaN, null)).toBe(null);
});

test("quadraticRoots", () => {
  expect(utils.quadraticRoots(0, 0, 0)).toEqual([NaN, NaN]);
  expect(utils.quadraticRoots(1, 0, 0)).toEqual([0, -0]);
  expect(utils.quadraticRoots(1, 1, 0)).toEqual([0, -1]);
  expect(utils.quadraticRoots(1, 2, 3)).toEqual([NaN, NaN]);
  expect(utils.quadraticRoots(2, 4, 2)).toEqual([-1, -1]);
});

test("easeInOutQuad", () => {
  expect(utils.easeInOutQuad(0)).toBe(0);
  expect(utils.easeInOutQuad(0.2)).toBeLessThan(0.2);
  expect(utils.easeInOutQuad(0.5)).toBe(0.5);
  expect(utils.easeInOutQuad(0.7)).toBeGreaterThan(0.7);
  expect(utils.easeInOutQuad(1)).toBe(1);
});

test("minAbs", () => {
  expect(utils.minAbs(2, -5, 1)).toBe(1);
  expect(utils.minAbs(2, 5, -1)).toBe(1);
  expect(utils.minAbs(2, 5, -1, 0)).toBe(0);
});

test("maxAbs", () => {
  expect(utils.maxAbs(2, -5, 1, 0)).toBe(5);
  expect(utils.maxAbs(2, 5, -1, 0)).toBe(5);
});

test("havingMinAbs", () => {
  expect(utils.havingMinAbs(2, -5, 1)).toBe(1);
  expect(utils.havingMinAbs(2, 5, -1)).toBe(-1);
  expect(utils.havingMinAbs(2, 5, -1, 0)).toBe(0);
});

test("havingMaxAbs", () => {
  expect(utils.havingMaxAbs(2, -5, 1, 0)).toBe(-5);
  expect(utils.havingMaxAbs(2, 5, -1, 0)).toBe(5);
});

test("hAngle", () => {
  expect(utils.hAngle(1, 0)).toBe(0);
  expect(utils.hAngle(1, -0) + 0).toBe(0);
  expect(utils.hAngle(1, 1)).toBe(Math.PI / 4);
  expect(utils.hAngle(0, 1)).toBe(Math.PI / 2);
  expect(utils.hAngle(-0, 1)).toBe(Math.PI / 2);
  expect(utils.hAngle(-1, 1)).toBe((Math.PI * 3) / 4);
  expect(utils.hAngle(-1, 0)).toBe(Math.PI);
  expect(utils.hAngle(-1, -0)).toBe(Math.PI);
  expect(utils.hAngle(-1, -1)).toBe((-Math.PI * 3) / 4);
  expect(utils.hAngle(0, -1)).toBe(-Math.PI / 2);
  expect(utils.hAngle(-0, -1)).toBe(-Math.PI / 2);
  expect(utils.hAngle(1, -1)).toBe(-Math.PI / 4);
});

for (const offset of [
  0,
  Math.PI * 2,
  Math.PI * 4,
  -Math.PI * 2,
  -Math.PI * 4,
]) {
  test(`normalizeAngle (offset ${offset})`, () => {
    expect(utils.normalizeAngle(offset + 0)).toBeCloseTo(0, 6);
    expect(utils.normalizeAngle(offset + Math.PI / 4)).toBeCloseTo(
      Math.PI / 4,
      6,
    );
    expect(utils.normalizeAngle(offset + Math.PI / 2)).toBeCloseTo(
      Math.PI / 2,
      6,
    );
    expect(utils.normalizeAngle(offset + (Math.PI * 3) / 4)).toBeCloseTo(
      (Math.PI * 3) / 4,
      6,
    );
    expect(utils.normalizeAngle(offset + Math.PI)).toBeCloseTo(Math.PI, 6);
    expect(utils.normalizeAngle(offset + (Math.PI * 5) / 4)).toBeCloseTo(
      (-Math.PI * 3) / 4,
      6,
    );
    expect(utils.normalizeAngle(offset + (Math.PI * 3) / 2)).toBeCloseTo(
      -Math.PI / 2,
      6,
    );
    expect(utils.normalizeAngle(offset + (Math.PI * 7) / 4)).toBeCloseTo(
      -Math.PI / 4,
      6,
    );
    expect(utils.normalizeAngle(offset - Math.PI)).toBeCloseTo(Math.PI, 6);
  });
}

test("degToRad", () => {
  expect(utils.degToRad(0)).toBe(0);
  expect(utils.degToRad(45)).toBe(Math.PI / 4);
  expect(utils.degToRad(90)).toBe(Math.PI / 2);
  expect(utils.degToRad(135)).toBe((Math.PI * 3) / 4);
  expect(utils.degToRad(180)).toBe(Math.PI);
  expect(utils.degToRad(225)).toBe((Math.PI * 5) / 4);
  expect(utils.degToRad(270)).toBe((Math.PI * 3) / 2);
});

test("radToDeg", () => {
  expect(utils.radToDeg(0)).toBe(0);
  expect(utils.radToDeg(Math.PI / 4)).toBe(45);
  expect(utils.radToDeg(Math.PI / 2)).toBe(90);
  expect(utils.radToDeg((Math.PI * 3) / 4)).toBe(135);
  expect(utils.radToDeg(Math.PI)).toBe(180);
  expect(utils.radToDeg((Math.PI * 5) / 4)).toBe(225);
  expect(utils.radToDeg((Math.PI * 3) / 2)).toBe(270);
});

test("distanceBetween", () => {
  expect(utils.distanceBetween([0, 0], [1, 0])).toBe(1);
  expect(utils.distanceBetween([1, 0], [1, 0])).toBe(0);
  expect(utils.distanceBetween([0, 1], [1, 0])).toBe(Math.sqrt(2));
  expect(utils.distanceBetween([1, 1], [1, 1])).toBe(0);
  expect(utils.distanceBetween([1, 1], [1, 2])).toBe(1);
  expect(utils.distanceBetween([1, 1], [2, 2])).toBe(Math.sqrt(2));
});

test("sortedKeysByVal", () => {
  expect(utils.sortedKeysByVal({ a: 2, b: -1, e: 10, z: 3 })).toEqual([
    "b",
    "a",
    "z",
    "e",
  ]);

  expect(utils.sortedKeysByVal({ a: 2, b: -1, e: 10, z: 3 }, true)).toEqual([
    "e",
    "z",
    "a",
    "b",
  ]);

  expect(utils.sortedKeysByVal({})).toEqual([]);
});

test("keyWithMaxVal", () => {
  expect(utils.keyWithMaxVal({ a: 2, b: -1, e: 10, z: 3 })).toBe("e");
  expect(utils.keyWithMaxVal({})).toBeUndefined();
});

test("keyWithMinVal", () => {
  expect(utils.keyWithMinVal({ a: 2, b: -1, e: 10, z: 3 })).toBe("b");
  expect(utils.keyWithMinVal({})).toBeUndefined();
});

describe("areParallel/AntiParallel", () => {
  const hyp = (x, y) => Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

  const l = hyp(1, 1); // vector length
  const thresh = 10; // 10 degrees vector comparison threshold
  const dThA = (9 * Math.PI) / 180; // 9 degress variation
  const dThB = (11 * Math.PI) / 180; // 11 degress variation

  const x = (th) => l * Math.cos(th); // x coord at angle th
  const y = (th) => l * Math.sin(th); // y coord at angle th

  const varyXY = (fromXY, dTh) => {
    const newAngle = utils.hAngle(...fromXY) + dTh; // vary x coord by dTh angle
    return [x(newAngle), y(newAngle)];
  };

  test("sanity check", () => {
    expect(hyp(1, 1)).toBe(l);

    expect(hyp(...varyXY([l, 0], dThA))).toBeCloseTo(l, 4);
    expect(hyp(...varyXY([l, -0], dThA))).toBeCloseTo(l, 4);
    expect(utils.hAngle(...varyXY([l, 0], dThA))).toBeCloseTo(dThA, 4);
    expect(utils.hAngle(...varyXY([l, -0], dThA))).toBeCloseTo(dThA, 4);

    expect(hyp(...varyXY([l, 0], -dThA))).toBeCloseTo(l, 4);
    expect(hyp(...varyXY([l, -0], -dThA))).toBeCloseTo(l, 4);
    expect(utils.hAngle(...varyXY([l, 0], -dThA))).toBeCloseTo(-dThA, 4);
    expect(utils.hAngle(...varyXY([l, -0], -dThA))).toBeCloseTo(-dThA, 4);

    expect(hyp(...varyXY([0, l], dThA))).toBeCloseTo(l, 4);
    expect(hyp(...varyXY([-0, l], dThA))).toBeCloseTo(l, 4);
    expect(utils.hAngle(...varyXY([0, l], dThA))).toBeCloseTo(
      Math.PI / 2 + dThA,
      4,
    );
    expect(utils.hAngle(...varyXY([-0, l], dThA))).toBeCloseTo(
      Math.PI / 2 + dThA,
      4,
    );

    expect(hyp(...varyXY([0, l], -dThA))).toBeCloseTo(l, 4);
    expect(hyp(...varyXY([-0, l], -dThA))).toBeCloseTo(l, 4);
    expect(utils.hAngle(...varyXY([0, l], -dThA))).toBeCloseTo(
      Math.PI / 2 - dThA,
      4,
    );
    expect(utils.hAngle(...varyXY([-0, l], -dThA))).toBeCloseTo(
      Math.PI / 2 - dThA,
      4,
    );

    expect(hyp(...varyXY([1, 1], dThA))).toBeCloseTo(l, 4);
    expect(utils.hAngle(...varyXY([1, 1], dThA))).toBeCloseTo(
      Math.PI / 4 + dThA,
      4,
    );

    expect(hyp(...varyXY([1, 1], -dThA))).toBeCloseTo(l, 4);
    expect(utils.hAngle(...varyXY([1, 1], -dThA))).toBeCloseTo(
      Math.PI / 4 - dThA,
      4,
    );
  });

  for (const [vA, vB, angleThresh, expectedOpposite] of [
    // -------------- vB is x-axis
    [[l, 0], [l, 0], thresh, false],
    [[1, 1], [l, 0], thresh, false],
    [[0, l], [l, 0], thresh, false],
    [[-1, 1], [l, 0], thresh, false],

    [[l, 0], [l, -0], thresh, false],
    [[1, 1], [l, -0], thresh, false],
    [[0, l], [l, -0], thresh, false],
    [[-1, 1], [l, -0], thresh, false],

    // ---
    [[-l, 0], [l, 0], 0, true],
    [[-l, 0], [l, -0], 0, true],

    [varyXY([-l, 0], dThA), [l, 0], 0, false],
    [varyXY([-l, 0], dThA), [l, 0], thresh, true],
    [varyXY([-l, 0], -dThA), [l, 0], 0, false],
    [varyXY([-l, 0], -dThA), [l, 0], thresh, true],
    [[-l, 0], varyXY([l, 0], dThA), 0, false],
    [[-l, 0], varyXY([l, 0], dThA), thresh, true],
    [[-l, 0], varyXY([l, 0], -dThA), 0, false],
    [[-l, 0], varyXY([l, 0], -dThA), thresh, true],

    [varyXY([-l, 0], dThA), [l, -0], 0, false],
    [varyXY([-l, 0], dThA), [l, -0], thresh, true],
    [varyXY([-l, 0], -dThA), [l, -0], 0, false],
    [varyXY([-l, 0], -dThA), [l, -0], thresh, true],
    [[-l, -0], varyXY([l, 0], dThA), 0, false],
    [[-l, -0], varyXY([l, 0], dThA), thresh, true],
    [[-l, -0], varyXY([l, 0], -dThA), 0, false],
    [[-l, -0], varyXY([l, 0], -dThA), thresh, true],

    [varyXY([-l, 0], dThB), [l, 0], thresh, false],
    [varyXY([-l, 0], -dThB), [l, 0], thresh, false],
    [[-l, 0], varyXY([l, 0], dThB), thresh, false],
    [[-l, 0], varyXY([l, 0], -dThB), thresh, false],

    [varyXY([-l, 0], dThB), [l, -0], thresh, false],
    [varyXY([-l, 0], -dThB), [l, -0], thresh, false],
    [[-l, 0], varyXY([l, -0], dThB), thresh, false],
    [[-l, 0], varyXY([l, -0], -dThB), thresh, false],
    // ---

    [[-1, -1], [l, 0], thresh, false],
    [[0, -l], [l, 0], thresh, false],
    [[1, -1], [l, 0], thresh, false],

    [[-1, -1], [l, -0], thresh, false],
    [[0, -l], [l, -0], thresh, false],
    [[1, -1], [l, -0], thresh, false],

    // -------------- vB is at 45deg to x-axis
    [[l, 0], [1, 1], thresh, false],
    [[1, 1], [1, 1], thresh, false],
    [[0, l], [1, 1], thresh, false],
    [[-1, 1], [1, 1], thresh, false],
    [[-l, 0], [1, 1], thresh, false],

    [[l, -0], [1, 1], thresh, false],
    [[-0, l], [1, 1], thresh, false],
    [[-l, -0], [1, 1], thresh, false],

    // ---
    [[-1, -1], [1, 1], 0, true],

    [varyXY([-1, -1], dThA), [1, 1], 0, false],
    [varyXY([-1, -1], dThA), [1, 1], thresh, true],
    [varyXY([-1, -1], -dThA), [1, 1], 0, false],
    [varyXY([-1, -1], -dThA), [1, 1], thresh, true],
    [[-1, -1], varyXY([1, 1], dThA), 0, false],
    [[-1, -1], varyXY([1, 1], dThA), thresh, true],
    [[-1, -1], varyXY([1, 1], -dThA), 0, false],
    [[-1, -1], varyXY([1, 1], -dThA), thresh, true],

    [varyXY([-1, -1], dThB), [1, 1], thresh, false],
    [varyXY([-1, -1], -dThB), [1, 1], thresh, false],
    [[-1, -1], varyXY([1, 1], dThB), thresh, false],
    [[-1, -1], varyXY([1, 1], -dThB), thresh, false],
    // ---

    [[0, -l], [1, 1], thresh, false],
    [[1, -1], [1, 1], thresh, false],

    [[-0, -l], [1, 1], thresh, false],

    // -------------- vB is y-axis
    [[l, 0], [0, l], thresh, false],
    [[1, 1], [0, l], thresh, false],
    [[0, l], [0, l], thresh, false],
    [[-1, 1], [0, l], thresh, false],
    [[-l, 0], [0, l], thresh, false],
    [[-1, -1], [0, l], thresh, false],

    [[l, 0], [-0, l], thresh, false],
    [[1, 1], [-0, l], thresh, false],
    [[0, l], [-0, l], thresh, false],
    [[-1, 1], [-0, l], thresh, false],
    [[-l, 0], [-0, l], thresh, false],
    [[-1, -1], [-0, l], thresh, false],

    // ---
    [[0, -l], [0, l], thresh, true],
    [[0, -l], [-0, l], thresh, true],

    [varyXY([0, -l], dThA), [0, l], 0, false],
    [varyXY([0, -l], dThA), [0, l], thresh, true],
    [varyXY([0, -l], -dThA), [0, l], 0, false],
    [varyXY([0, -l], -dThA), [0, l], thresh, true],
    [[0, -l], varyXY([0, l], dThA), 0, false],
    [[0, -l], varyXY([0, l], dThA), thresh, true],
    [[0, -l], varyXY([0, l], -dThA), 0, false],
    [[0, -l], varyXY([0, l], -dThA), thresh, true],

    [varyXY([0, -l], dThA), [-0, l], 0, false],
    [varyXY([0, -l], dThA), [-0, l], thresh, true],
    [varyXY([0, -l], -dThA), [-0, l], 0, false],
    [varyXY([0, -l], -dThA), [-0, l], thresh, true],
    [[-0, -l], varyXY([0, l], dThA), 0, false],
    [[-0, -l], varyXY([0, l], dThA), thresh, true],
    [[-0, -l], varyXY([0, l], -dThA), 0, false],
    [[-0, -l], varyXY([0, l], -dThA), thresh, true],

    [varyXY([0, -l], dThB), [0, l], thresh, false],
    [varyXY([0, -l], -dThB), [0, l], thresh, false],
    [[0, -l], varyXY([0, l], dThB), thresh, false],
    [[0, -l], varyXY([0, l], -dThB), thresh, false],

    [varyXY([0, -l], dThB), [-0, l], thresh, false],
    [varyXY([0, -l], -dThB), [-0, l], thresh, false],
    [[-0, -l], varyXY([0, l], dThB), thresh, false],
    [[-0, -l], varyXY([0, l], -dThB), thresh, false],
    // ---

    [[1, -1], [0, l], thresh, false],
    [[1, -1], [-0, l], thresh, false],

    // -------------- vB is negative x-axis
    [[l, 0], [-l, 0], 0, true],
    [[l, 0], [-l, -0], 0, true],

    [varyXY([l, 0], dThA), [-l, 0], 0, false],
    [varyXY([l, 0], dThA), [-l, 0], thresh, true],
    [varyXY([l, 0], -dThA), [-l, 0], 0, false],
    [varyXY([l, 0], -dThA), [-l, 0], thresh, true],
    [[l, 0], varyXY([-l, 0], dThA), 0, false],
    [[l, 0], varyXY([-l, 0], dThA), thresh, true],
    [[l, 0], varyXY([-l, 0], -dThA), 0, false],
    [[l, 0], varyXY([-l, 0], -dThA), thresh, true],

    [varyXY([l, 0], dThA), [-l, -0], 0, false],
    [varyXY([l, 0], dThA), [-l, -0], thresh, true],
    [varyXY([l, 0], -dThA), [-l, -0], 0, false],
    [varyXY([l, 0], -dThA), [-l, -0], thresh, true],
    [[l, -0], varyXY([-l, 0], dThA), 0, false],
    [[l, -0], varyXY([-l, 0], dThA), thresh, true],
    [[l, -0], varyXY([-l, 0], -dThA), 0, false],
    [[l, -0], varyXY([-l, 0], -dThA), thresh, true],

    [varyXY([l, 0], dThB), [-l, 0], thresh, false],
    [varyXY([l, 0], -dThB), [-l, 0], thresh, false],
    [[l, 0], varyXY([-l, 0], dThB), thresh, false],
    [[l, 0], varyXY([-l, 0], -dThB), thresh, false],

    [varyXY([l, 0], dThB), [-l, -0], thresh, false],
    [varyXY([l, 0], -dThB), [-l, -0], thresh, false],
    [[l, -0], varyXY([-l, 0], dThB), thresh, false],
    [[l, -0], varyXY([-l, 0], -dThB), thresh, false],
    // ---

    [[1, 1], [-l, 0], thresh, false],
    [[0, l], [-l, 0], thresh, false],
    [[-1, 1], [-l, 0], thresh, false],
    [[-l, 0], [-l, 0], thresh, false],
    [[-1, -1], [-l, 0], thresh, false],
    [[0, -l], [-l, 0], thresh, false],
    [[1, -1], [-l, 0], thresh, false],

    [[1, 1], [-l, -0], thresh, false],
    [[0, l], [-l, -0], thresh, false],
    [[-1, 1], [-l, -0], thresh, false],
    [[-l, 0], [-l, -0], thresh, false],
    [[-1, -1], [-l, -0], thresh, false],
    [[0, -l], [-l, -0], thresh, false],
    [[1, -1], [-l, -0], thresh, false],
  ]) {
    test(`areAntiParallel: ${vA}, ${vB}, ${angleThresh}`, () => {
      expect(utils.areAntiParallel(vA, vB, angleThresh)).toBe(expectedOpposite);
    });
  }

  for (const [vA, vB, angleThresh, expectedSame] of [
    // -------------- vB is x-axis
    [[l, 0], [l, 0], thresh, true],
    [[l, 0], [l, -0], thresh, true],

    [varyXY([l, 0], dThA), [l, 0], 0, false],
    [varyXY([l, 0], dThA), [l, 0], thresh, true],
    [varyXY([l, 0], -dThA), [l, 0], 0, false],
    [varyXY([l, 0], -dThA), [l, 0], thresh, true],
    [[l, 0], varyXY([l, 0], dThA), 0, false],
    [[l, 0], varyXY([l, 0], dThA), thresh, true],
    [[l, 0], varyXY([l, 0], -dThA), 0, false],
    [[l, 0], varyXY([l, 0], -dThA), thresh, true],

    [varyXY([l, 0], dThA), [l, -0], 0, false],
    [varyXY([l, 0], dThA), [l, -0], thresh, true],
    [varyXY([l, 0], -dThA), [l, -0], 0, false],
    [varyXY([l, 0], -dThA), [l, -0], thresh, true],
    [[l, -0], varyXY([l, 0], dThA), 0, false],
    [[l, -0], varyXY([l, 0], dThA), thresh, true],
    [[l, -0], varyXY([l, 0], -dThA), 0, false],
    [[l, -0], varyXY([l, 0], -dThA), thresh, true],

    [varyXY([l, 0], dThB), [l, 0], thresh, false],
    [varyXY([l, 0], -dThB), [l, 0], thresh, false],
    [[l, 0], varyXY([l, 0], dThB), thresh, false],
    [[l, 0], varyXY([l, 0], -dThB), thresh, false],

    [varyXY([l, 0], dThB), [l, -0], thresh, false],
    [varyXY([l, 0], -dThB), [l, -0], thresh, false],
    [[l, -0], varyXY([l, 0], dThB), thresh, false],
    [[l, -0], varyXY([l, 0], -dThB), thresh, false],
    // ---

    [[1, 1], [l, 0], thresh, false],
    [[0, l], [l, 0], thresh, false],
    [[-1, 1], [l, 0], thresh, false],
    [[-l, 0], [l, 0], thresh, false],
    [[-1, -1], [l, 0], thresh, false],
    [[0, -l], [l, 0], thresh, false],
    [[1, -1], [l, 0], thresh, false],

    [[1, 1], [l, -0], thresh, false],
    [[0, l], [l, -0], thresh, false],
    [[-1, 1], [l, -0], thresh, false],
    [[-l, 0], [l, -0], thresh, false],
    [[-1, -1], [l, -0], thresh, false],
    [[0, -l], [l, -0], thresh, false],
    [[1, -1], [l, -0], thresh, false],

    // -------------- vB is at 45deg to x-axis
    [[l, 0], [1, 1], thresh, false],
    [[l, -0], [1, 1], thresh, false],

    // ---
    [[1, 1], [1, 1], thresh, true],

    [varyXY([1, 1], dThA), [1, 1], 0, false],
    [varyXY([1, 1], dThA), [1, 1], thresh, true],
    [varyXY([1, 1], -dThA), [1, 1], 0, false],
    [varyXY([1, 1], -dThA), [1, 1], thresh, true],
    [[1, 1], varyXY([1, 1], dThA), 0, false],
    [[1, 1], varyXY([1, 1], dThA), thresh, true],
    [[1, 1], varyXY([1, 1], -dThA), 0, false],
    [[1, 1], varyXY([1, 1], -dThA), thresh, true],

    [varyXY([1, 1], dThB), [1, 1], thresh, false],
    [varyXY([1, 1], -dThB), [1, 1], thresh, false],
    [[1, 1], varyXY([1, 1], dThB), thresh, false],
    [[1, 1], varyXY([1, 1], -dThB), thresh, false],
    // ---

    [[0, l], [1, 1], thresh, false],
    [[-1, 1], [1, 1], thresh, false],
    [[-l, 0], [1, 1], thresh, false],
    [[-1, -1], [1, 1], thresh, false],
    [[0, -l], [1, 1], thresh, false],
    [[1, -1], [1, 1], thresh, false],

    [[-0, l], [1, 1], thresh, false],
    [[-l, -0], [1, 1], thresh, false],
    [[-0, -l], [1, 1], thresh, false],

    // -------------- vB is y-axis
    [[l, 0], [0, l], thresh, false],
    [[1, 1], [0, l], thresh, false],

    [[l, 0], [-0, l], thresh, false],
    [[1, 1], [-0, l], thresh, false],

    // ---
    [[0, l], [0, l], thresh, true],
    [[0, l], [-0, l], thresh, true],

    [varyXY([0, l], dThA), [0, l], 0, false],
    [varyXY([0, l], dThA), [0, l], thresh, true],
    [varyXY([0, l], -dThA), [0, l], 0, false],
    [varyXY([0, l], -dThA), [0, l], thresh, true],
    [[0, l], varyXY([0, l], dThA), 0, false],
    [[0, l], varyXY([0, l], dThA), thresh, true],
    [[0, l], varyXY([0, l], -dThA), 0, false],
    [[0, l], varyXY([0, l], -dThA), thresh, true],

    [varyXY([0, l], dThA), [-0, l], 0, false],
    [varyXY([0, l], dThA), [-0, l], thresh, true],
    [varyXY([0, l], -dThA), [-0, l], 0, false],
    [varyXY([0, l], -dThA), [-0, l], thresh, true],
    [[-0, l], varyXY([0, l], dThA), 0, false],
    [[-0, l], varyXY([0, l], dThA), thresh, true],
    [[-0, l], varyXY([0, l], -dThA), 0, false],
    [[-0, l], varyXY([0, l], -dThA), thresh, true],

    [varyXY([0, l], dThB), [0, l], thresh, false],
    [varyXY([0, l], -dThB), [0, l], thresh, false],
    [[0, l], varyXY([0, l], dThB), thresh, false],
    [[0, l], varyXY([0, l], -dThB), thresh, false],

    [varyXY([0, l], dThB), [-0, l], thresh, false],
    [varyXY([0, l], -dThB), [-0, l], thresh, false],
    [[-0, l], varyXY([0, l], dThB), thresh, false],
    [[-0, l], varyXY([0, l], -dThB), thresh, false],
    // ---

    [[-1, 1], [0, l], thresh, false],
    [[-l, 0], [0, l], thresh, false],
    [[-1, -1], [0, l], thresh, false],
    [[0, -l], [0, l], thresh, false],
    [[1, -1], [0, l], thresh, false],

    [[-1, 1], [-0, l], thresh, false],
    [[-l, 0], [-0, l], thresh, false],
    [[-1, -1], [-0, l], thresh, false],
    [[0, -l], [-0, l], thresh, false],
    [[1, -1], [-0, l], thresh, false],

    // -------------- vB is negative x-axis
    [[l, 0], [-l, 0], thresh, false],
    [[1, 1], [-l, 0], thresh, false],
    [[0, l], [-l, 0], thresh, false],
    [[-1, 1], [-l, 0], thresh, false],

    [[l, 0], [-l, -0], thresh, false],
    [[1, 1], [-l, -0], thresh, false],
    [[0, l], [-l, -0], thresh, false],
    [[-1, 1], [-l, -0], thresh, false],

    // ---
    [[-l, 0], [-l, 0], thresh, true],
    [[-l, 0], [-l, -0], thresh, true],

    [varyXY([-l, 0], dThA), [-l, 0], 0, false],
    [varyXY([-l, 0], dThA), [-l, 0], thresh, true],
    [varyXY([-l, 0], -dThA), [-l, 0], 0, false],
    [varyXY([-l, 0], -dThA), [-l, 0], thresh, true],
    [[-l, 0], varyXY([-l, 0], dThA), 0, false],
    [[-l, 0], varyXY([-l, 0], dThA), thresh, true],
    [[-l, 0], varyXY([-l, 0], -dThA), 0, false],
    [[-l, 0], varyXY([-l, 0], -dThA), thresh, true],

    [varyXY([-l, 0], dThA), [-l, -0], 0, false],
    [varyXY([-l, 0], dThA), [-l, -0], thresh, true],
    [varyXY([-l, 0], -dThA), [-l, -0], 0, false],
    [varyXY([-l, 0], -dThA), [-l, -0], thresh, true],
    [[-l, -0], varyXY([-l, 0], dThA), 0, false],
    [[-l, -0], varyXY([-l, 0], dThA), thresh, true],
    [[-l, -0], varyXY([-l, 0], -dThA), 0, false],
    [[-l, -0], varyXY([-l, 0], -dThA), thresh, true],

    [varyXY([-l, 0], dThB), [-l, 0], thresh, false],
    [varyXY([-l, 0], -dThB), [-l, 0], thresh, false],
    [[-l, 0], varyXY([-l, 0], dThB), thresh, false],
    [[-l, 0], varyXY([-l, 0], -dThB), thresh, false],

    [varyXY([-l, 0], dThB), [-l, -0], thresh, false],
    [varyXY([-l, 0], -dThB), [-l, -0], thresh, false],
    [[-l, -0], varyXY([-l, 0], dThB), thresh, false],
    [[-l, -0], varyXY([-l, 0], -dThB), thresh, false],
    // ---

    [[-1, -1], [-l, 0], thresh, false],
    [[0, -l], [-l, 0], thresh, false],
    [[1, -1], [-l, 0], thresh, false],

    [[-1, -1], [-l, -0], thresh, false],
    [[0, -l], [-l, -0], thresh, false],
    [[1, -1], [-l, -0], thresh, false],
  ]) {
    test(`areParallel: ${vA}, ${vB}, ${angleThresh}`, () => {
      expect(utils.areParallel(vA, vB, angleThresh)).toBe(expectedSame);
    });
  }
});

describe("criticallyDamped", () => {
  test("to larger", () => {
    const lTarget = 200;
    const lag = 1000;
    const dt = 200;
    let l = 100,
      v = 0,
      dlFr,
      i;
    for (i = 0; i < 50; i++) {
      ({ l, v, dlFr } = utils.criticallyDamped({
        l,
        v,
        lTarget,
        lag,
        dt,
        precision: 1,
      }));

      if (i == Math.round(lag / dt) - 1) {
        expect(Math.round(Math.abs(l - lTarget))).toBeLessThan(2);
      }

      if (l === lTarget) {
        expect(dlFr).toBe(1);
        break;
      }
    }

    expect(i).toBeLessThan(10);
  });

  test("to smaller", () => {
    const lTarget = 100;
    const lag = 1000;
    const dt = 200;
    let l = 200,
      v = 0,
      dlFr,
      i;
    for (i = 0; i < 50; i++) {
      ({ l, v, dlFr } = utils.criticallyDamped({
        l,
        v,
        lTarget,
        lag,
        dt,
        precision: 1,
      }));

      if (i == Math.round(lag / dt) - 1) {
        expect(Math.round(Math.abs(l - lTarget))).toBeLessThan(2);
      }

      if (l === lTarget) {
        expect(dlFr).toBe(1);
        break;
      }
    }

    expect(i).toBeLessThan(10);
  });
});
