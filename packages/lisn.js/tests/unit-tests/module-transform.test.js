const { describe, test, expect } = require("@jest/globals");

const { Transform } = window.LISN.modules;

const IDENTITY = new Float32Array([
  1, 0, 0, 0,

  0, 1, 0, 0,

  0, 0, 1, 0,

  0, 0, 0, 1,
]);

const newTestArray = (toValue = (i) => i + 1) => {
  const input = new Float32Array(16);
  for (let i = 0; i < 16; i++) {
    input[i] = toValue(i);
  }
  return input;
};

const expectToBeCloseToArray = (a, b, precision = 3) => {
  expect(a.length).toBe(b.length);
  for (let i = 0; i < a.length; i++) {
    expect(a[i]).toBeCloseTo(b[i], precision);
  }
};

describe("constructor", () => {
  test("no init", () => {
    const t = new Transform();
    expect(t.matrix).toBeInstanceOf(Float32Array);
    expect(t.matrix).toEqual(IDENTITY);
  });

  test("with init", () => {
    const input = newTestArray();
    const t = new Transform(input);
    expect(t.matrix).toBeInstanceOf(Float32Array);
    expect(t.matrix).toEqual(input);
  });
});

describe("matrix", () => {
  test("modifying", () => {
    const input = newTestArray();
    const copy = new Float32Array(input);

    const t = new Transform(input);
    expect(t.matrix).toBeInstanceOf(Float32Array);
    expect(t.matrix).toEqual(input);

    t.matrix[5] *= 2;
    expect(input).toEqual(copy); // input not modified
    expect(t.matrix).not.toEqual(input);
  });
});

describe("clone", () => {
  test("basic", () => {
    const input = newTestArray();
    const t = new Transform(input);
    const c = t.clone();
    expect(c.matrix).toEqual(input);
  });

  test("modifying original", () => {
    const input = newTestArray();
    const t = new Transform(input);
    expect(t.matrix).toEqual(input);

    const c = t.clone();

    t.matrix[5] *= 2;
    expect(t.matrix).not.toEqual(input);
    expect(c.matrix).toEqual(input);
  });

  test("modifying clone", () => {
    const input = newTestArray();
    const t = new Transform(input);
    expect(t.matrix).toEqual(input);

    const c = t.clone();

    c.matrix[5] *= 2;
    expect(t.matrix).toEqual(input);
    expect(c.matrix).not.toEqual(input);
  });
});

describe("invert", () => {
  test("invertible", () => {
    const input = new Float32Array([
      8, -6, -3, -5,

      -2, 7, -8, -5,

      -9, -3, 7, 8,

      -4, -3, 1, -10,
    ]);

    const inverse = new Float32Array([
      -0.0326087, -0.08631714, -0.10869565, -0.02749361,

      -0.16576087, -0.05642583, -0.13586956, 0.0023977,

      -0.16576087, -0.17407289, -0.13586956, 0.06122123,

      0.04619565, 0.03404731, 0.07065217, -0.08359975,
    ]);

    const t = new Transform(input);
    const res = t.invert();
    expect(res).toBe(t); // same object
    expectToBeCloseToArray(t.matrix, inverse);
  });

  test("non-invertible", () => {
    const input = new Float32Array([
      1, 2, 3, 4,

      5, 6, 7, 8,

      9, 10, 11, 12,

      1, 2, 3, 4,
    ]);

    const t = new Transform(input);
    const res = t.invert();
    expect(res).toBe(null);
    expect(t.matrix).toEqual(input); // not modified
  });
});

describe("multiply", () => {
  test("identity * identity", () => {
    const tA = new Transform();
    const tB = new Transform();
    const res = tA.multiply(tB);
    expect(res).toBe(tA); // same object
    expect(tA.matrix).toEqual(IDENTITY);
  });

  test("identity * other", () => {
    const input = newTestArray();
    const tA = new Transform();
    const tB = new Transform(input);
    const res = tA.multiply(tB);
    expect(res).toBe(tA); // same object
    expect(tA.matrix).toEqual(input);
    expect(tB.matrix).toEqual(input);
  });

  test("other * identity", () => {
    const input = newTestArray();
    const tA = new Transform();
    const tB = new Transform(input);
    const res = tB.multiply(tA);
    expect(res).toBe(tB); // same object
    expect(tA.matrix).toEqual(IDENTITY);
    expect(tB.matrix).toEqual(input);
  });

  test("other * other", () => {
    const inputA = newTestArray();
    const inputB = newTestArray((i) => 16 - i);

    const product = new Float32Array([
      386, 444, 502, 560,

      274, 316, 358, 400,

      162, 188, 214, 240,

      50, 60, 70, 80,
    ]);

    const tA = new Transform(inputA);
    const tB = new Transform(inputB);

    const res = tA.multiply(tB);
    expect(res).toBe(tA); // same object
    expect(tA.matrix).toEqual(product);
    expect(tB.matrix).toEqual(inputB);
  });
});

describe("translate", () => {
  test("translateX", () => {
    const expected = new Float32Array([
      1, 0, 0, 0,

      0, 1, 0, 0,

      0, 0, 1, 0,

      100, 0, 0, 1,
    ]);

    const t = new Transform();
    t.translateX(100);
    expect(t.matrix).toEqual(expected);

    t.inverseTranslateX(100);
    expect(t.matrix).toEqual(IDENTITY);

    t.translateX(50);
    t.translateX(50);
    expect(t.matrix).toEqual(expected);
  });

  test("translateY", () => {
    const expected = new Float32Array([
      1, 0, 0, 0,

      0, 1, 0, 0,

      0, 0, 1, 0,

      0, 100, 0, 1,
    ]);

    const t = new Transform();
    t.translateY(100);
    expect(t.matrix).toEqual(expected);

    t.inverseTranslateY(100);
    expect(t.matrix).toEqual(IDENTITY);

    t.translateY(50);
    t.translateY(50);
    expect(t.matrix).toEqual(expected);
  });

  test("translateZ", () => {
    const expected = new Float32Array([
      1, 0, 0, 0,

      0, 1, 0, 0,

      0, 0, 1, 0,

      0, 0, 100, 1,
    ]);

    const t = new Transform();
    t.translateZ(100);
    expect(t.matrix).toEqual(expected);

    t.inverseTranslateZ(100);
    expect(t.matrix).toEqual(IDENTITY);

    t.translateZ(50);
    t.translateZ(50);
    expect(t.matrix).toEqual(expected);
  });

  test("translate XY", () => {
    const expected = new Float32Array([
      1, 0, 0, 0,

      0, 1, 0, 0,

      0, 0, 1, 0,

      10, 20, 0, 1,
    ]);

    const t = new Transform();
    t.translate(10, 20);
    expect(t.matrix).toEqual(expected);

    t.inverseTranslate(10, 20);
    expect(t.matrix).toEqual(IDENTITY);

    t.translate(5, 10);
    t.translate(5, 10);
    expect(t.matrix).toEqual(expected);
  });

  test("translate", () => {
    const expected = new Float32Array([
      1, 0, 0, 0,

      0, 1, 0, 0,

      0, 0, 1, 0,

      10, 20, 30, 1,
    ]);

    const t = new Transform();
    t.translate(10, 20, 30);
    expect(t.matrix).toEqual(expected);

    t.inverseTranslate(10, 20, 30);
    expect(t.matrix).toEqual(IDENTITY);

    t.translate(5, 10, 15);
    t.translate(5, 10, 15);
    expect(t.matrix).toEqual(expected);
  });

  test("inverseTranslate after others", () => {
    const expected = new Float32Array([
      0.87559502, 0.42003109, -0.2385524, 0,

      -0.38175263, 0.90430386, 0.19104831, 0,

      0.29597008, -0.07621294, 0.95215193, 0,

      0, 0, 0, 1,
    ]);

    const t = new Transform();
    t.rotate(30, 1, 2, 3);
    expectToBeCloseToArray(t.matrix, expected);

    t.translate(10, 20, 30);
    t.inverseTranslate(10, 20, 30);
    expectToBeCloseToArray(t.matrix, expected);
  });
});

describe("scale", () => {
  test("scaleX", () => {
    const expected = new Float32Array([
      10, 0, 0, 0,

      0, 1, 0, 0,

      0, 0, 1, 0,

      0, 0, 0, 1,
    ]);

    const t = new Transform();
    t.scaleX(10);
    expect(t.matrix).toEqual(expected);

    t.inverseScaleX(10);
    expect(t.matrix).toEqual(IDENTITY);

    t.scaleX(5);
    t.scaleX(2);
    expect(t.matrix).toEqual(expected);
  });

  test("scaleY", () => {
    const expected = new Float32Array([
      1, 0, 0, 0,

      0, 10, 0, 0,

      0, 0, 1, 0,

      0, 0, 0, 1,
    ]);

    const t = new Transform();
    t.scaleY(10);
    expect(t.matrix).toEqual(expected);

    t.inverseScaleY(10);
    expect(t.matrix).toEqual(IDENTITY);

    t.scaleY(5);
    t.scaleY(2);
    expect(t.matrix).toEqual(expected);
  });

  test("scaleZ", () => {
    const expected = new Float32Array([
      1, 0, 0, 0,

      0, 1, 0, 0,

      0, 0, 10, 0,

      0, 0, 0, 1,
    ]);

    const t = new Transform();
    t.scaleZ(10);
    expect(t.matrix).toEqual(expected);

    t.inverseScaleZ(10);
    expect(t.matrix).toEqual(IDENTITY);

    t.scaleZ(5);
    t.scaleZ(2);
    expect(t.matrix).toEqual(expected);
  });

  test("scale XY", () => {
    const expected = new Float32Array([
      10, 0, 0, 0,

      0, 20, 0, 0,

      0, 0, 1, 0,

      0, 0, 0, 1,
    ]);

    const t = new Transform();
    t.scale(10, 20);
    expect(t.matrix).toEqual(expected);

    t.inverseScale(10, 20);
    expect(t.matrix).toEqual(IDENTITY);

    t.scale(5, 10);
    t.scale(2, 2);
    expect(t.matrix).toEqual(expected);
  });

  test("scale", () => {
    const expected = new Float32Array([
      10, 0, 0, 0,

      0, 20, 0, 0,

      0, 0, 40, 0,

      0, 0, 0, 1,
    ]);

    const t = new Transform();
    t.scale(10, 20, 40);
    expect(t.matrix).toEqual(expected);

    t.inverseScale(10, 20, 40);
    expect(t.matrix).toEqual(IDENTITY);

    t.scale(5, 10, 10);
    t.scale(2, 2, 4);
    expect(t.matrix).toEqual(expected);
  });

  test("inverseScale after others", () => {
    const expected = new Float32Array([
      0.87559502, 0.42003109, -0.2385524, 0,

      -0.38175263, 0.90430386, 0.19104831, 0,

      0.29597008, -0.07621294, 0.95215193, 0,

      0, 0, 0, 1,
    ]);

    const t = new Transform();
    t.rotate(30, 1, 2, 3);
    expectToBeCloseToArray(t.matrix, expected);

    t.scale(10, 20, 40);
    t.inverseScale(10, 20, 40);
    expectToBeCloseToArray(t.matrix, expected);
  });
});

describe("skew", () => {
  const deg = 30;
  const tan = Math.tan((deg * Math.PI) / 180);

  const deg2 = 45;
  const tan2 = Math.tan((deg2 * Math.PI) / 180);

  test("skewX", () => {
    const expected = new Float32Array([
      ...[1, 0, 0, 0],
      ...[tan, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = new Transform();
    t.skewX(deg);
    expectToBeCloseToArray(t.matrix, expected);

    t.inverseSkewX(deg);
    expectToBeCloseToArray(t.matrix, IDENTITY);
  });

  test("skewY", () => {
    const expected = new Float32Array([
      ...[1, tan, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = new Transform();
    t.skewY(deg);
    expectToBeCloseToArray(t.matrix, expected);

    t.inverseSkewY(deg);
    expectToBeCloseToArray(t.matrix, IDENTITY);
  });

  test("skew", () => {
    const expected = new Float32Array([
      ...[1, tan2, 0, 0],
      ...[tan, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = new Transform();
    t.skew(deg, deg2);
    expectToBeCloseToArray(t.matrix, expected);

    t.inverseSkew(deg, deg2);
    expectToBeCloseToArray(t.matrix, IDENTITY);
  });

  test("inverseSkew after others", () => {
    const expected = new Float32Array([
      0.87559502, 0.42003109, -0.2385524, 0,

      -0.38175263, 0.90430386, 0.19104831, 0,

      0.29597008, -0.07621294, 0.95215193, 0,

      0, 0, 0, 1,
    ]);

    const t = new Transform();
    t.rotate(30, 1, 2, 3);
    expectToBeCloseToArray(t.matrix, expected);

    t.skew(deg, deg2);
    t.inverseSkew(deg, deg2);
    expectToBeCloseToArray(t.matrix, expected);
  });
});

describe("rotate", () => {
  const deg = 30;
  const cos = Math.cos((deg * Math.PI) / 180);
  const sin = Math.sin((deg * Math.PI) / 180);

  test("rotateX", () => {
    const expected = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, cos, sin, 0],
      ...[0, -sin, cos, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = new Transform();
    t.rotateX(deg);
    expectToBeCloseToArray(t.matrix, expected);

    t.inverseRotateX(deg);
    expectToBeCloseToArray(t.matrix, IDENTITY);

    t.rotateX(deg / 2);
    t.rotateX(deg / 2);
    expectToBeCloseToArray(t.matrix, expected);
  });

  test("rotateY", () => {
    const expected = new Float32Array([
      ...[cos, 0, -sin, 0],
      ...[0, 1, 0, 0],
      ...[sin, 0, cos, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = new Transform();
    t.rotateY(deg);
    expectToBeCloseToArray(t.matrix, expected);

    t.inverseRotateY(deg);
    expectToBeCloseToArray(t.matrix, IDENTITY);

    t.rotateY(deg / 2);
    t.rotateY(deg / 2);
    expectToBeCloseToArray(t.matrix, expected);
  });

  test("rotateZ", () => {
    const expected = new Float32Array([
      ...[cos, sin, 0, 0],
      ...[-sin, cos, 0, 0],
      ...[0, 0, 1, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = new Transform();
    t.rotateZ(deg);
    expectToBeCloseToArray(t.matrix, expected);

    t.inverseRotateZ(deg);
    expectToBeCloseToArray(t.matrix, IDENTITY);

    t.rotateZ(deg / 2);
    t.rotateZ(deg / 2);
    expectToBeCloseToArray(t.matrix, expected);
  });

  test("rotateX.Y.Z", () => {
    const expected = new Float32Array([
      0.92541652, 0.31879577, -0.20487411, 0,

      -0.16317591, 0.82317292, 0.54383814, 0,

      0.34202015, -0.4698463, 0.81379765, 0,

      0, 0, 0, 1,
    ]);

    const t = new Transform();
    t.rotateX(30);
    t.rotateY(20);
    t.rotateZ(10);
    expectToBeCloseToArray(t.matrix, expected);
  });

  test("rotate XY", () => {
    const expected = new Float32Array([
      0.89282032, 0.05358984, -0.4472136, 0,

      0.05358984, 0.97320508, 0.2236068, 0,

      0.4472136, -0.2236068, 0.8660254, 0,

      0, 0, 0, 1,
    ]);

    const t = new Transform();
    t.rotate(30, 1, 2);
    expectToBeCloseToArray(t.matrix, expected);

    t.inverseRotate(30, 1, 2);
    expectToBeCloseToArray(t.matrix, IDENTITY);
  });

  test("rotate", () => {
    const expected = new Float32Array([
      0.87559502, 0.42003109, -0.2385524, 0,

      -0.38175263, 0.90430386, 0.19104831, 0,

      0.29597008, -0.07621294, 0.95215193, 0,

      0, 0, 0, 1,
    ]);

    const t = new Transform();
    t.rotate(30, 1, 2, 3);
    expectToBeCloseToArray(t.matrix, expected);

    t.inverseRotate(30, 1, 2, 3);
    expectToBeCloseToArray(t.matrix, IDENTITY);
  });

  test("inverseRotate after others", () => {
    const expected = new Float32Array([
      1, 0, 0, 0,

      0, 1, 0, 0,

      0, 0, 1, 0,

      10, 20, 30, 1,
    ]);

    const t = new Transform();
    t.translate(10, 20, 30);
    expectToBeCloseToArray(t.matrix, expected);

    t.rotate(30, 1, 2, 3);
    t.inverseRotate(30, 1, 2, 3);
    expectToBeCloseToArray(t.matrix, expected);
  });
});

describe("apply", () => {
  test("unknown", () => {
    const t = new Transform();
    expect(() => t.apply([Symbol(), 1])).toThrow(/Unknown transform/);
  });

  test("single: TRANSLATE_X", () => {
    const tRef = new Transform();
    tRef.translateX(100);

    const t = new Transform();
    t.apply(Transform.TRANSLATE_X(100));
    expect(t.matrix).toEqual(tRef.matrix);
    expect(t.matrix).not.toEqual(IDENTITY);
  });

  test("single: TRANSLATE_Y", () => {
    const tRef = new Transform();
    tRef.translateY(100);

    const t = new Transform();
    t.apply(Transform.TRANSLATE_Y(100));
    expect(t.matrix).toEqual(tRef.matrix);
    expect(t.matrix).not.toEqual(IDENTITY);
  });

  test("single: TRANSLATE_Z", () => {
    const tRef = new Transform();
    tRef.translateZ(100);

    const t = new Transform();
    t.apply(Transform.TRANSLATE_Z(100));
    expect(t.matrix).toEqual(tRef.matrix);
    expect(t.matrix).not.toEqual(IDENTITY);
  });

  test("single: TRANSLATE", () => {
    const tRef = new Transform();
    tRef.translate(10, 20, 30);

    const t = new Transform();
    t.apply(Transform.TRANSLATE(10, 20, 30));
    expect(t.matrix).toEqual(tRef.matrix);
    expect(t.matrix).not.toEqual(IDENTITY);
  });

  test("single: SCALE_X", () => {
    const tRef = new Transform();
    tRef.scaleX(10);

    const t = new Transform();
    t.apply(Transform.SCALE_X(10));
    expect(t.matrix).toEqual(tRef.matrix);
    expect(t.matrix).not.toEqual(IDENTITY);
  });

  test("single: SCALE_Y", () => {
    const tRef = new Transform();
    tRef.scaleY(10);

    const t = new Transform();
    t.apply(Transform.SCALE_Y(10));
    expect(t.matrix).toEqual(tRef.matrix);
    expect(t.matrix).not.toEqual(IDENTITY);
  });

  test("single: SCALE_Z", () => {
    const tRef = new Transform();
    tRef.scaleZ(10);

    const t = new Transform();
    t.apply(Transform.SCALE_Z(10));
    expect(t.matrix).toEqual(tRef.matrix);
    expect(t.matrix).not.toEqual(IDENTITY);
  });

  test("single: SCALE", () => {
    const tRef = new Transform();
    tRef.scale(5, 10, 20);

    const t = new Transform();
    t.apply(Transform.SCALE(5, 10, 20));
    expect(t.matrix).toEqual(tRef.matrix);
    expect(t.matrix).not.toEqual(IDENTITY);
  });

  test("single: SKEW_X", () => {
    const tRef = new Transform();
    tRef.skewX(30);

    const t = new Transform();
    t.apply(Transform.SKEW_X(30));
    expect(t.matrix).toEqual(tRef.matrix);
    expect(t.matrix).not.toEqual(IDENTITY);
  });

  test("single: SKEW_Y", () => {
    const tRef = new Transform();
    tRef.skewY(30);

    const t = new Transform();
    t.apply(Transform.SKEW_Y(30));
    expect(t.matrix).toEqual(tRef.matrix);
    expect(t.matrix).not.toEqual(IDENTITY);
  });

  test("single: SKEW", () => {
    const tRef = new Transform();
    tRef.skew(30, 45);

    const t = new Transform();
    t.apply(Transform.SKEW(30, 45));
    expect(t.matrix).toEqual(tRef.matrix);
    expect(t.matrix).not.toEqual(IDENTITY);
  });

  test("single: ROTATE_X", () => {
    const tRef = new Transform();
    tRef.rotateX(30);

    const t = new Transform();
    t.apply(Transform.ROTATE_X(30));
    expect(t.matrix).toEqual(tRef.matrix);
    expect(t.matrix).not.toEqual(IDENTITY);
  });

  test("single: ROTATE_Y", () => {
    const tRef = new Transform();
    tRef.rotateY(30);

    const t = new Transform();
    t.apply(Transform.ROTATE_Y(30));
    expect(t.matrix).toEqual(tRef.matrix);
    expect(t.matrix).not.toEqual(IDENTITY);
  });

  test("single: ROTATE_Z", () => {
    const tRef = new Transform();
    tRef.rotateZ(30);

    const t = new Transform();
    t.apply(Transform.ROTATE_Z(30));
    expect(t.matrix).toEqual(tRef.matrix);
    expect(t.matrix).not.toEqual(IDENTITY);
  });

  test("single: ROTATE", () => {
    const tRef = new Transform();
    tRef.rotate(30, 20, 10);

    const t = new Transform();
    t.apply(Transform.ROTATE(30, 20, 10));
    expect(t.matrix).toEqual(tRef.matrix);
    expect(t.matrix).not.toEqual(IDENTITY);
  });

  test("multiple", () => {
    const tRef = new Transform();
    tRef.translate(10, 20, 30);
    tRef.scale(5, 10, 20);
    tRef.rotate(30, 20, 10);

    const t = new Transform();
    t.apply(
      Transform.TRANSLATE(10, 20, 30),
      Transform.SCALE(5, 10, 20),
      Transform.ROTATE(30, 20, 10),
    );
    expect(t.matrix).toEqual(tRef.matrix);
    expect(t.matrix).not.toEqual(IDENTITY);
  });

  test("inverse", () => {
    const t = new Transform();
    t.translate(10, 20, 30);
    t.scale(5, 10, 20);
    t.rotate(30, 20, 10);

    t.inverseApply(
      Transform.TRANSLATE(10, 20, 30),
      Transform.SCALE(5, 10, 20),
      Transform.ROTATE(30, 20, 10),
    );
    expectToBeCloseToArray(t.matrix, IDENTITY);
  });
});
