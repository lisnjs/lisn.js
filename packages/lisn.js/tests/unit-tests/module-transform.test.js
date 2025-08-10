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

const toArray = (m) => {
  let a = m;
  if (a instanceof Transform || a instanceof DOMMatrixReadOnly) {
    a = a.toFloat32Array();
  }

  return Array.from(a);
};

const expectToBeCloseToMatrix = (mA, mB, precision = 4) => {
  const a = toArray(mA);
  const b = toArray(mB);
  expect(a.length).toBe(b.length);
  for (let i = 0; i < a.length; i++) {
    expect(a[i]).toBeCloseTo(b[i], precision);
  }
};

const expectNotToBeCloseToMatrix = (mA, mB, precision = 4) => {
  const a = toArray(mA);
  const b = toArray(mB);
  let areEqual = a.length === b.length;

  for (let i = 0; i < a.length; i++) {
    if (!areEqual) break;
    areEqual &&= Math.abs(a[i] - b[i]) < Math.pow(10, -precision) / 2;
  }

  expect(areEqual).toBe(false);
};

describe("constructor", () => {
  test("no init", () => {
    const t = new Transform();
    expect(t.toMatrix()).toBeInstanceOf(DOMMatrixReadOnly);
    expect(t.toFloat32Array()).toBeInstanceOf(Float32Array);
    expectToBeCloseToMatrix(t, IDENTITY);
  });

  test("with init", () => {
    const input = newTestArray();
    const t = new Transform(input);
    expect(t.toMatrix()).toBeInstanceOf(DOMMatrixReadOnly);
    expect(t.toFloat32Array()).toBeInstanceOf(Float32Array);
    expectToBeCloseToMatrix(t, input);
  });
});

describe("toFloat32Array", () => {
  test("modifying", () => {
    const input = newTestArray();
    const copy = new Float32Array(input);

    const t = new Transform(input);
    const a = t.toFloat32Array();
    expect(a).toBeInstanceOf(Float32Array);
    expectToBeCloseToMatrix(t, input);

    a[4] *= 2;
    // not modified
    expectToBeCloseToMatrix(input, copy);
    expectToBeCloseToMatrix(t, input);
  });
});

describe("toMatrix", () => {
  test("modifying", () => {
    const input = newTestArray();
    const copy = new Float32Array(input);

    const t = new Transform(input);
    const m = t.toMatrix();
    expect(m).toBeInstanceOf(DOMMatrixReadOnly);
    expectToBeCloseToMatrix(t, input);

    m.m21 *= 2;
    // not modified
    expectToBeCloseToMatrix(input, copy);
    expectToBeCloseToMatrix(t, input);
  });
});

describe("clone", () => {
  test("basic", () => {
    const input = newTestArray();
    const t = new Transform(input);
    const c = t.clone();
    expectToBeCloseToMatrix(c, input);
  });

  test("modifying original", () => {
    const input = newTestArray();
    const t = new Transform(input);
    expectToBeCloseToMatrix(t, input);

    const c = t.clone();

    t.translateX(10);
    expectNotToBeCloseToMatrix(t, input);
    expectToBeCloseToMatrix(c, input);
  });

  test("modifying clone", () => {
    const input = newTestArray();
    const t = new Transform(input);
    expectToBeCloseToMatrix(t, input);

    const c = t.clone();

    c.translateX(10);
    expectToBeCloseToMatrix(t, input);
    expectNotToBeCloseToMatrix(c, input);
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
    expectToBeCloseToMatrix(t, inverse);
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
    expect(res).toBe(t); // same object
    const resArr = toArray(t);
    for (let i = 0; i < 16; i++) {
      expect(resArr[i]).toBeNaN();
    }
  });
});

// describe("multiply", () => {
//   test("identity * identity", () => {
//     const tA = new Transform();
//     const tB = new Transform();
//     const res = tA.multiply(tB);
//     expect(res).toBe(tA); // same object
//     expectToBeCloseToMatrix(tA, IDENTITY);
//   });
//
//   test("identity * other", () => {
//     const input = newTestArray();
//     const tA = new Transform();
//     const tB = new Transform(input);
//     const res = tA.multiply(tB);
//     expect(res).toBe(tA); // same object
//     expectToBeCloseToMatrix(tA, input);
//     expectToBeCloseToMatrix(tB, input);
//   });
//
//   test("other * identity", () => {
//     const input = newTestArray();
//     const tA = new Transform();
//     const tB = new Transform(input);
//     const res = tB.multiply(tA);
//     expect(res).toBe(tB); // same object
//     expectToBeCloseToMatrix(tA, IDENTITY);
//     expectToBeCloseToMatrix(tB, input);
//   });
//
//   test("other * other", () => {
//     const inputA = newTestArray();
//     const inputB = newTestArray((i) => 16 - i);
//
//     const product = new Float32Array([
//       386, 444, 502, 560,
//
//       274, 316, 358, 400,
//
//       162, 188, 214, 240,
//
//       50, 60, 70, 80,
//     ]);
//
//     const tA = new Transform(inputA);
//     const tB = new Transform(inputB);
//
//     const res = tA.multiply(tB);
//     expect(res).toBe(tA); // same object
//     expectToBeCloseToMatrix(tA, product);
//     expectToBeCloseToMatrix(tB, inputB);
//   });
// });

describe("translate", () => {
  test("translateX", () => {
    const expected = new Float32Array([
      1, 0, 0, 0,

      0, 1, 0, 0,

      0, 0, 1, 0,

      100, 0, 0, 1,
    ]);

    const t = new Transform();
    let res = t.translateX(100);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, expected);

    res = t.inverseTranslateX(100);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, IDENTITY);

    t.translateX(50);
    t.translateX(50);
    expectToBeCloseToMatrix(t, expected);
  });

  test("translateY", () => {
    const expected = new Float32Array([
      1, 0, 0, 0,

      0, 1, 0, 0,

      0, 0, 1, 0,

      0, 100, 0, 1,
    ]);

    const t = new Transform();
    let res = t.translateY(100);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, expected);

    res = t.inverseTranslateY(100);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, IDENTITY);

    t.translateY(50);
    t.translateY(50);
    expectToBeCloseToMatrix(t, expected);
  });

  test("translateZ", () => {
    const expected = new Float32Array([
      1, 0, 0, 0,

      0, 1, 0, 0,

      0, 0, 1, 0,

      0, 0, 100, 1,
    ]);

    const t = new Transform();
    let res = t.translateZ(100);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, expected);

    res = t.inverseTranslateZ(100);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, IDENTITY);

    t.translateZ(50);
    t.translateZ(50);
    expectToBeCloseToMatrix(t, expected);
  });

  test("translate XY", () => {
    const expected = new Float32Array([
      1, 0, 0, 0,

      0, 1, 0, 0,

      0, 0, 1, 0,

      10, 20, 0, 1,
    ]);

    const t = new Transform();
    let res = t.translate(10, 20);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, expected);

    res = t.inverseTranslate(10, 20);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, IDENTITY);

    t.translate(5, 10);
    t.translate(5, 10);
    expectToBeCloseToMatrix(t, expected);
  });

  test("translate", () => {
    const expected = new Float32Array([
      1, 0, 0, 0,

      0, 1, 0, 0,

      0, 0, 1, 0,

      10, 20, 30, 1,
    ]);

    const t = new Transform();
    let res = t.translate(10, 20, 30);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, expected);

    res = t.inverseTranslate(10, 20, 30);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, IDENTITY);

    t.translate(5, 10, 15);
    t.translate(5, 10, 15);
    expectToBeCloseToMatrix(t, expected);
  });

  test("inverseTranslate after others", () => {
    const expected = new Float32Array([
      0.87559502, 0.42003109, -0.2385524, 0,

      -0.38175263, 0.90430386, 0.19104831, 0,

      0.29597008, -0.07621294, 0.95215193, 0,

      0, 0, 0, 1,
    ]);

    const t = new Transform();
    t.rotate(30, [1, 2, 3]);
    expectToBeCloseToMatrix(t, expected);

    t.translate(10, 20, 30);
    t.inverseTranslate(10, 20, 30);
    expectToBeCloseToMatrix(t, expected);
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
    let res = t.scaleX(10);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, expected);

    res = t.inverseScaleX(10);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, IDENTITY);

    t.scaleX(5);
    t.scaleX(2);
    expectToBeCloseToMatrix(t, expected);
  });

  test("scaleY", () => {
    const expected = new Float32Array([
      1, 0, 0, 0,

      0, 10, 0, 0,

      0, 0, 1, 0,

      0, 0, 0, 1,
    ]);

    const t = new Transform();
    let res = t.scaleY(10);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, expected);

    res = t.inverseScaleY(10);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, IDENTITY);

    t.scaleY(5);
    t.scaleY(2);
    expectToBeCloseToMatrix(t, expected);
  });

  test("scaleZ", () => {
    const expected = new Float32Array([
      1, 0, 0, 0,

      0, 1, 0, 0,

      0, 0, 10, 0,

      0, 0, 0, 1,
    ]);

    const t = new Transform();
    let res = t.scaleZ(10);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, expected);

    res = t.inverseScaleZ(10);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, IDENTITY);

    t.scaleZ(5);
    t.scaleZ(2);
    expectToBeCloseToMatrix(t, expected);
  });

  test("scale XY", () => {
    const expected = new Float32Array([
      10, 0, 0, 0,

      0, 20, 0, 0,

      0, 0, 1, 0,

      0, 0, 0, 1,
    ]);

    const t = new Transform();
    let res = t.scale(10, 20);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, expected);

    res = t.inverseScale(10, 20);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, IDENTITY);

    t.scale(5, 10);
    t.scale(2, 2);
    expectToBeCloseToMatrix(t, expected);
  });

  test("scale", () => {
    const expected = new Float32Array([
      10, 0, 0, 0,

      0, 20, 0, 0,

      0, 0, 40, 0,

      0, 0, 0, 1,
    ]);

    const t = new Transform();
    let res = t.scale(10, 20, 40);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, expected);

    res = t.inverseScale(10, 20, 40);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, IDENTITY);

    t.scale(5, 10, 10);
    t.scale(2, 2, 4);
    expectToBeCloseToMatrix(t, expected);
  });

  test("inverseScale after others", () => {
    const expected = new Float32Array([
      0.87559502, 0.42003109, -0.2385524, 0,

      -0.38175263, 0.90430386, 0.19104831, 0,

      0.29597008, -0.07621294, 0.95215193, 0,

      0, 0, 0, 1,
    ]);

    const t = new Transform();
    t.rotate(30, [1, 2, 3]);
    expectToBeCloseToMatrix(t, expected);

    t.scale(10, 20, 40);
    t.inverseScale(10, 20, 40);
    expectToBeCloseToMatrix(t, expected);
  });

  test("scale at origin", () => {
    const sx = 10,
      sy = 20,
      sz = 40;
    const ox = 100,
      oy = 200,
      oz = 400;
    const expected = new Float32Array([
      ...[sx, 0, 0, 0],
      ...[0, sy, 0, 0],
      ...[0, 0, sz, 0],
      ...[(1 - sx) * ox, (1 - sy) * oy, (1 - sz) * oz, 1],
    ]);

    const t = new Transform();
    t.scale(sx, sy, sz, [ox, oy, oz]);
    expectToBeCloseToMatrix(t, expected);

    t.inverseScale(sx, sy, sz, [ox, oy, oz]);
    expectToBeCloseToMatrix(t, IDENTITY);

    t.scale(sx / 2, sy / 2, sz / 4, [ox, oy, oz]);
    t.scale(2, 2, 4, [ox, oy, oz]);
    expectToBeCloseToMatrix(t, expected);
  });
});

describe("skew", () => {
  const deg = 30;
  const tan = Math.tan((deg * Math.PI) / 180);

  const deg2 = 15;
  const tan2 = Math.tan((deg2 * Math.PI) / 180);

  test("skewX", () => {
    const expected = new Float32Array([
      ...[1, 0, 0, 0],
      ...[tan, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = new Transform();
    let res = t.skewX(deg);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, expected);

    res = t.inverseSkewX(deg);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, IDENTITY);
  });

  test("skewY", () => {
    const expected = new Float32Array([
      ...[1, tan, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = new Transform();
    let res = t.skewY(deg);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, expected);

    res = t.inverseSkewY(deg);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, IDENTITY);
  });

  test("skew", () => {
    const expected = new Float32Array([
      ...[1 + tan * tan2, tan2, 0, 0],
      ...[tan, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = new Transform();
    let res = t.skew(deg, deg2);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, expected);

    res = t.inverseSkew(deg, deg2);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, IDENTITY);
  });

  test("inverseSkew after others", () => {
    const expected = new Float32Array([
      0.87559502, 0.42003109, -0.2385524, 0,

      -0.38175263, 0.90430386, 0.19104831, 0,

      0.29597008, -0.07621294, 0.95215193, 0,

      0, 0, 0, 1,
    ]);

    const t = new Transform();
    t.rotate(30, [1, 2, 3]);
    expectToBeCloseToMatrix(t, expected);

    t.skew(deg, deg2);
    t.inverseSkew(deg, deg2);
    expectToBeCloseToMatrix(t, expected);
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
    let res = t.rotateX(deg);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, expected);

    res = t.inverseRotateX(deg);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, IDENTITY);

    t.rotateX(deg / 2);
    t.rotateX(deg / 2);
    expectToBeCloseToMatrix(t, expected);
  });

  test("rotateY", () => {
    const expected = new Float32Array([
      ...[cos, 0, -sin, 0],
      ...[0, 1, 0, 0],
      ...[sin, 0, cos, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = new Transform();
    let res = t.rotateY(deg);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, expected);

    res = t.inverseRotateY(deg);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, IDENTITY);

    t.rotateY(deg / 2);
    t.rotateY(deg / 2);
    expectToBeCloseToMatrix(t, expected);
  });

  test("rotateZ", () => {
    const expected = new Float32Array([
      ...[cos, sin, 0, 0],
      ...[-sin, cos, 0, 0],
      ...[0, 0, 1, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = new Transform();
    let res = t.rotateZ(deg);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, expected);

    res = t.inverseRotateZ(deg);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, IDENTITY);

    t.rotateZ(deg / 2);
    t.rotateZ(deg / 2);
    expectToBeCloseToMatrix(t, expected);
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
    expectToBeCloseToMatrix(t, expected);
  });

  test("rotate XY", () => {
    const expected = new Float32Array([
      0.89282032, 0.05358984, -0.4472136, 0,

      0.05358984, 0.97320508, 0.2236068, 0,

      0.4472136, -0.2236068, 0.8660254, 0,

      0, 0, 0, 1,
    ]);

    const t = new Transform();
    let res = t.rotate(30, [1, 2]);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, expected);

    res = t.inverseRotate(30, [1, 2]);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, IDENTITY);
  });

  test("rotate", () => {
    const expected = new Float32Array([
      0.87559502, 0.42003109, -0.2385524, 0,

      -0.38175263, 0.90430386, 0.19104831, 0,

      0.29597008, -0.07621294, 0.95215193, 0,

      0, 0, 0, 1,
    ]);

    const t = new Transform();
    let res = t.rotate(30, [1, 2, 3]);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, expected);

    res = t.inverseRotate(30, [1, 2, 3]);
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, IDENTITY);
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
    expectToBeCloseToMatrix(t, expected);

    t.rotate(30, [1, 2, 3]);
    t.inverseRotate(30, [1, 2, 3]);
    expectToBeCloseToMatrix(t, expected);
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
    const res = t.apply(Transform.translateX(100));
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, tRef);
    expectNotToBeCloseToMatrix(t, IDENTITY);
  });

  test("single: TRANSLATE_Y", () => {
    const tRef = new Transform();
    tRef.translateY(100);

    const t = new Transform();
    const res = t.apply(Transform.translateY(100));
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, tRef);
    expectNotToBeCloseToMatrix(t, IDENTITY);
  });

  test("single: TRANSLATE_Z", () => {
    const tRef = new Transform();
    tRef.translateZ(100);

    const t = new Transform();
    const res = t.apply(Transform.translateZ(100));
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, tRef);
    expectNotToBeCloseToMatrix(t, IDENTITY);
  });

  test("single: TRANSLATE", () => {
    const tRef = new Transform();
    tRef.translate(10, 20, 30);

    const t = new Transform();
    const res = t.apply(Transform.translate(10, 20, 30));
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, tRef);
    expectNotToBeCloseToMatrix(t, IDENTITY);
  });

  test("single: SCALE_X", () => {
    const tRef = new Transform();
    tRef.scaleX(10);

    const t = new Transform();
    const res = t.apply(Transform.scaleX(10));
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, tRef);
    expectNotToBeCloseToMatrix(t, IDENTITY);
  });

  test("single: SCALE_Y", () => {
    const tRef = new Transform();
    tRef.scaleY(10);

    const t = new Transform();
    const res = t.apply(Transform.scaleY(10));
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, tRef);
    expectNotToBeCloseToMatrix(t, IDENTITY);
  });

  test("single: SCALE_Z", () => {
    const tRef = new Transform();
    tRef.scaleZ(10);

    const t = new Transform();
    const res = t.apply(Transform.scaleZ(10));
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, tRef);
    expectNotToBeCloseToMatrix(t, IDENTITY);
  });

  test("single: SCALE", () => {
    const tRef = new Transform();
    tRef.scale(5, 10, 20);

    const t = new Transform();
    const res = t.apply(Transform.scale(5, 10, 20));
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, tRef);
    expectNotToBeCloseToMatrix(t, IDENTITY);
  });

  test("single: SKEW_X", () => {
    const tRef = new Transform();
    tRef.skewX(30);

    const t = new Transform();
    const res = t.apply(Transform.skewX(30));
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, tRef);
    expectNotToBeCloseToMatrix(t, IDENTITY);
  });

  test("single: SKEW_Y", () => {
    const tRef = new Transform();
    tRef.skewY(30);

    const t = new Transform();
    const res = t.apply(Transform.skewY(30));
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, tRef);
    expectNotToBeCloseToMatrix(t, IDENTITY);
  });

  test("single: SKEW", () => {
    const tRef = new Transform();
    tRef.skew(30, 45);

    const t = new Transform();
    const res = t.apply(Transform.skew(30, 45));
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, tRef);
    expectNotToBeCloseToMatrix(t, IDENTITY);
  });

  test("single: ROTATE_X", () => {
    const tRef = new Transform();
    tRef.rotateX(30);

    const t = new Transform();
    const res = t.apply(Transform.rotateX(30));
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, tRef);
    expectNotToBeCloseToMatrix(t, IDENTITY);
  });

  test("single: ROTATE_Y", () => {
    const tRef = new Transform();
    tRef.rotateY(30);

    const t = new Transform();
    const res = t.apply(Transform.rotateY(30));
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, tRef);
    expectNotToBeCloseToMatrix(t, IDENTITY);
  });

  test("single: ROTATE_Z", () => {
    const tRef = new Transform();
    tRef.rotateZ(30);

    const t = new Transform();
    const res = t.apply(Transform.rotateZ(30));
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, tRef);
    expectNotToBeCloseToMatrix(t, IDENTITY);
  });

  test("single: ROTATE", () => {
    const tRef = new Transform();
    tRef.rotate(30, [1, 2, 3]);

    const t = new Transform();
    const res = t.apply(Transform.rotate(30, [1, 2, 3]));
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, tRef);
    expectNotToBeCloseToMatrix(t, IDENTITY);
  });

  test("multiple", () => {
    const tRef = new Transform();
    tRef.translate(10, 20, 30);
    tRef.scale(5, 10, 20);
    tRef.rotate(30, [1, 2, 3]);

    const t = new Transform();
    const res = t.apply(
      Transform.translate(10, 20, 30),
      Transform.scale(5, 10, 20),
      Transform.rotate(30, [1, 2, 3]),
    );
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, tRef);
    expectNotToBeCloseToMatrix(t, IDENTITY);
  });

  test("inverse", () => {
    const t = new Transform();
    t.translate(10, 20, 30);
    t.scale(5, 10, 20);
    t.rotate(30, [1, 2, 3]);

    const res = t.inverseApply(
      Transform.translate(10, 20, 30),
      Transform.scale(5, 10, 20),
      Transform.rotate(30, [1, 2, 3]),
    );
    expect(res).toBe(t); // same object
    expectToBeCloseToMatrix(t, IDENTITY);
  });
});

test("interpolate", () => {
  const target = newTestArray((i) => (i % 2 ? i + 1 : -i - 1));
  const tA = new Transform();
  const initial = toArray(tA);
  const tB = new Transform(target);

  const res = tA.interpolate(tB, 0.5);
  expect(res).toBe(tA); // same object
  let arrA = toArray(tA);
  for (let i = 0; i < 16; i++) {
    expect(arrA[i]).toBe(initial[i] + 0.5 * (target[i] - initial[i]));
  }

  tA.interpolate(tB, 0.5);
  arrA = toArray(tA);
  for (let i = 0; i < 16; i++) {
    expect(arrA[i]).toBe(initial[i] + 0.75 * (target[i] - initial[i]));
  }
});
