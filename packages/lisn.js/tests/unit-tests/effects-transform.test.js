const { jest, describe, test, expect } = require("@jest/globals");

const { Transform } = window.LISN.effects;

const dummyEl = document.createElement("div");

const IDENTITY = new DOMMatrixReadOnly([
  ...[1, 0, 0, 0],
  ...[0, 1, 0, 0],
  ...[0, 0, 1, 0],
  ...[0, 0, 0, 1],
]);

const DEFAULT_OFFSETS = {
  x: 0,
  dx: 0,
  nx: 0,
  dnx: 0,
  y: 0,
  dy: 0,
  ny: 0,
  dny: 0,
};

const newIncrementalTransform = (init) =>
  new Transform({ init, isIncremental: true });

const newTestMatrix = (toValue = (i) => i + 1) => {
  const init = new Float32Array(16);
  for (let i = 0; i < 16; i++) {
    init[i] = toValue(i);
  }
  return new DOMMatrixReadOnly(init);
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
    const t = newIncrementalTransform();
    expect(t.toMatrix()).toBeInstanceOf(DOMMatrixReadOnly);
    expectToBeCloseToMatrix(t.toMatrix(), IDENTITY);

    expect(t.toFloat32Array()).toBeInstanceOf(Float32Array);
    expectToBeCloseToMatrix(t.toFloat32Array(), IDENTITY);

    expect(t.toString()).toBe(new DOMMatrixReadOnly(IDENTITY).toString());
  });

  test("with init", () => {
    const init = newTestMatrix();
    const t = newIncrementalTransform(init);
    expect(t.toMatrix()).toBeInstanceOf(DOMMatrixReadOnly);
    expectToBeCloseToMatrix(t.toMatrix(), init);

    expect(t.toFloat32Array()).toBeInstanceOf(Float32Array);
    expectToBeCloseToMatrix(t.toFloat32Array(), init);

    expect(t.toString()).toBe(new DOMMatrixReadOnly(init).toString());
  });

  test("modifying init", () => {
    const init = toArray(newTestMatrix());
    const copy = new Float32Array(toArray(init));
    const t = newIncrementalTransform(init);

    init[4] *= 2;
    expectNotToBeCloseToMatrix(t, init);
    expectToBeCloseToMatrix(t, copy);
  });

  test("incremental w multiple transforms", () => {
    const dA = 10,
      dB = 20;
    const expected = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[2 * (dA + dB), 0, 0, 1],
    ]);

    const t = newIncrementalTransform();
    t.translate(() => ({ x: dA }));
    t.translate(() => ({ x: dB }));
    t.apply(dummyEl, DEFAULT_OFFSETS);
    t.apply(dummyEl, DEFAULT_OFFSETS);
    expectToBeCloseToMatrix(t, expected);
  });

  test("non-incremental w multiple transforms", () => {
    const dA = 10,
      dB = 20;
    const expected = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[dA + dB, 0, 0, 1],
    ]);

    const t = new Transform();
    t.translate(() => ({ x: dA }));
    t.translate(() => ({ x: dB }));
    t.apply(dummyEl, DEFAULT_OFFSETS);
    t.apply(dummyEl, DEFAULT_OFFSETS);
    expectToBeCloseToMatrix(t, expected);
  });
});

describe("toMatrix", () => {
  test("basic", () => {
    const init = newTestMatrix();
    const t = newIncrementalTransform(init);
    const m = t.toMatrix();
    expect(m).toBeInstanceOf(DOMMatrixReadOnly);
    expectToBeCloseToMatrix(m, init);
  });

  test("relativeTo", () => {
    const init = newTestMatrix();
    const ref = new DOMMatrixReadOnly([
      ...[8, -6, -3, -5],
      ...[-2, 7, -8, -5],
      ...[-9, -3, 7, 8],
      ...[-4, -3, 1, -10],
    ]);

    const expected = ref.inverse().multiply(init);

    const t = newIncrementalTransform(init);
    const m = t.toMatrix(ref);
    expectToBeCloseToMatrix(m, expected);

    // not modified
    expectToBeCloseToMatrix(t, init);
  });

  test("modifying", () => {
    const init = newTestMatrix();
    const copy = new Float32Array(toArray(init));
    const t = newIncrementalTransform(init);
    const m = t.toMatrix();
    m.m21 *= 2;

    // not modified
    expectToBeCloseToMatrix(init, copy);
    expectToBeCloseToMatrix(t, init);
  });
});

describe("toFloat32Array", () => {
  test("basic", () => {
    const init = newTestMatrix();
    const t = newIncrementalTransform(init);
    const m = t.toFloat32Array();
    expect(m).toBeInstanceOf(Float32Array);
    expectToBeCloseToMatrix(m, init);
  });

  test("relativeTo", () => {
    const init = newTestMatrix();
    const ref = new DOMMatrixReadOnly([
      ...[8, -6, -3, -5],
      ...[-2, 7, -8, -5],
      ...[-9, -3, 7, 8],
      ...[-4, -3, 1, -10],
    ]);

    const expected = ref.inverse().multiply(init);

    const t = newIncrementalTransform(init);
    const m = t.toFloat32Array(ref);
    expectToBeCloseToMatrix(m, expected);

    // not modified
    expectToBeCloseToMatrix(t, init);
  });

  test("modifying", () => {
    const init = newTestMatrix();
    const copy = new Float32Array(toArray(init));
    const t = newIncrementalTransform(init);
    const m = t.toFloat32Array();
    m[4] *= 2;

    // not modified
    expectToBeCloseToMatrix(init, copy);
    expectToBeCloseToMatrix(t, init);
  });
});

describe("toString", () => {
  test("basic", () => {
    const init = newTestMatrix();
    const t = newIncrementalTransform(init);
    expect(t.toString()).toBe(new DOMMatrixReadOnly(init).toString());
  });

  test("relativeTo", () => {
    const init = newTestMatrix();
    const ref = new DOMMatrixReadOnly([
      ...[8, -6, -3, -5],
      ...[-2, 7, -8, -5],
      ...[-9, -3, 7, 8],
      ...[-4, -3, 1, -10],
    ]);

    const expected = ref.inverse().multiply(init);

    const t = newIncrementalTransform(init);
    expect(t.toString(ref)).toBe(new DOMMatrixReadOnly(expected).toString());

    // not modified
    expectToBeCloseToMatrix(t, init);
  });
});

test("perspective", () => {
  const t = newIncrementalTransform();
  t.perspective(() => 500);
  t.apply(dummyEl, DEFAULT_OFFSETS);
  expect(t.toString()).toBe(
    "perspective(500px) " + new DOMMatrixReadOnly(IDENTITY).toString(),
  );

  t.perspective(() => "30rem");
  t.apply(dummyEl, DEFAULT_OFFSETS);
  expect(t.toString()).toBe(
    "perspective(30rem) " + new DOMMatrixReadOnly(IDENTITY).toString(),
  );
});

describe("translate", () => {
  test("apply", () => {
    const cbk = jest.fn(() => null);
    const t = newIncrementalTransform();
    t.translate(cbk);
    expect(cbk).toHaveBeenCalledTimes(0);

    t.apply(dummyEl, DEFAULT_OFFSETS);
    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenCalledWith(DEFAULT_OFFSETS);
  });

  test("X", () => {
    const d = 100;
    const expected = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[d, 0, 0, 1],
    ]);

    const t = newIncrementalTransform();
    t.translate((d) => ({ x: d.x }));
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, x: d });
    expectToBeCloseToMatrix(t, expected);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, x: -d });
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, x: d / 2 });
    t.apply(dummyEl, { ...DEFAULT_OFFSETS, x: d / 2 });
    expectToBeCloseToMatrix(t, expected);
  });

  test("Y", () => {
    const d = 100;
    const expected = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[0, d, 0, 1],
    ]);

    const t = newIncrementalTransform();
    t.translate((d) => ({ y: d.y }));
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, y: d });
    expectToBeCloseToMatrix(t, expected);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, y: -d });
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, y: d / 2 });
    t.apply(dummyEl, { ...DEFAULT_OFFSETS, y: d / 2 });
    expectToBeCloseToMatrix(t, expected);
  });

  test("Z", () => {
    const d = 100;
    const expected = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[0, 0, d, 1],
    ]);

    const t = newIncrementalTransform();
    t.translate((d) => ({ z: d.ny }));
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, ny: d });
    expectToBeCloseToMatrix(t, expected);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, ny: -d });
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, ny: d / 2 });
    t.apply(dummyEl, { ...DEFAULT_OFFSETS, ny: d / 2 });
    expectToBeCloseToMatrix(t, expected);
  });

  test("XYZ", () => {
    const dx = 10,
      dy = 20,
      dz = 30;
    const expected = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[dx, dy, dz, 1],
    ]);

    const t = newIncrementalTransform();
    t.translate((d) => ({ x: d.x, y: d.y, z: d.ny }));
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, x: dx, y: dy, ny: dz });
    expectToBeCloseToMatrix(t, expected);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, x: -dx, y: -dy, ny: -dz });
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, x: dx / 2, y: dy / 2, ny: dz / 2 });
    t.apply(dummyEl, { ...DEFAULT_OFFSETS, x: dx / 2, y: dy / 2, ny: dz / 2 });
    expectToBeCloseToMatrix(t, expected);
  });
});

describe("scale", () => {
  test("apply", () => {
    const cbk = jest.fn(() => null);
    const t = newIncrementalTransform();
    t.scale(cbk);
    expect(cbk).toHaveBeenCalledTimes(0);

    t.apply(dummyEl, DEFAULT_OFFSETS);
    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenCalledWith(DEFAULT_OFFSETS);
  });

  test("X", () => {
    const s = 100;
    const expected = new Float32Array([
      ...[s, 0, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = newIncrementalTransform();
    t.scale((d) => ({ sx: d.nx }));
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, nx: s });
    expectToBeCloseToMatrix(t, expected);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, nx: 1 / s });
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, nx: s / 2 });
    t.apply(dummyEl, { ...DEFAULT_OFFSETS, nx: 2 });
    expectToBeCloseToMatrix(t, expected);
  });

  test("Y", () => {
    const s = 100;
    const expected = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, s, 0, 0],
      ...[0, 0, 1, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = newIncrementalTransform();
    t.scale((d) => ({ sy: d.ny }));
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, ny: s });
    expectToBeCloseToMatrix(t, expected);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, ny: 1 / s });
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, ny: s / 2 });
    t.apply(dummyEl, { ...DEFAULT_OFFSETS, ny: 2 });
    expectToBeCloseToMatrix(t, expected);
  });

  test("Z", () => {
    const s = 100;
    const expected = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, s, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = newIncrementalTransform();
    t.scale((d) => ({ sz: d.dny }));
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, dny: s });
    expectToBeCloseToMatrix(t, expected);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, dny: 1 / s });
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, dny: s / 2 });
    t.apply(dummyEl, { ...DEFAULT_OFFSETS, dny: 2 });
    expectToBeCloseToMatrix(t, expected);
  });

  test("XYZ", () => {
    const sx = 10,
      sy = 20,
      sz = 30;
    const expected = new Float32Array([
      ...[sx, 0, 0, 0],
      ...[0, sy, 0, 0],
      ...[0, 0, sz, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = newIncrementalTransform();
    t.scale((d) => ({
      s: d.nx + d.ny + d.dny /* ignored */,
      sx: d.nx,
      sy: d.ny,
      sz: d.dny,
    }));
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, nx: sx, ny: sy, dny: sz });
    expectToBeCloseToMatrix(t, expected);

    t.apply(dummyEl, {
      ...DEFAULT_OFFSETS,
      nx: 1 / sx,
      ny: 1 / sy,
      dny: 1 / sz,
    });
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, {
      ...DEFAULT_OFFSETS,
      nx: sx / 2,
      ny: sy / 2,
      dny: sz / 4,
    });
    t.apply(dummyEl, { ...DEFAULT_OFFSETS, nx: 2, ny: 2, dny: 4 });
    expectToBeCloseToMatrix(t, expected);
  });

  test("XYZ v2", () => {
    const s = 100;
    const expected = new Float32Array([
      ...[s, 0, 0, 0],
      ...[0, s, 0, 0],
      ...[0, 0, s, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = newIncrementalTransform();
    t.scale((d) => ({ s: d.ny }));
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, ny: s });
    expectToBeCloseToMatrix(t, expected);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, ny: 1 / s });
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, ny: s / 2 });
    t.apply(dummyEl, { ...DEFAULT_OFFSETS, ny: 2 });
    expectToBeCloseToMatrix(t, expected);
  });

  test("at origin", () => {
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

    const t = newIncrementalTransform();
    t.scale((d) => ({ sx: d.nx, sy: d.ny, sz: d.dny, origin: [ox, oy, oz] }));
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, nx: sx, ny: sy, dny: sz });
    expectToBeCloseToMatrix(t, expected);

    t.apply(dummyEl, {
      ...DEFAULT_OFFSETS,
      nx: 1 / sx,
      ny: 1 / sy,
      dny: 1 / sz,
    });
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, {
      ...DEFAULT_OFFSETS,
      nx: sx / 2,
      ny: sy / 2,
      dny: sz / 4,
    });
    t.apply(dummyEl, { ...DEFAULT_OFFSETS, nx: 2, ny: 2, dny: 4 });
    expectToBeCloseToMatrix(t, expected);
  });
});

describe("skew", () => {
  const deg = 30;
  const tan = Math.tan((deg * Math.PI) / 180);

  const deg2 = 15;
  const tan2 = Math.tan((deg2 * Math.PI) / 180);

  test("apply", () => {
    const cbk = jest.fn(() => null);
    const t = newIncrementalTransform();
    t.skew(cbk);
    expect(cbk).toHaveBeenCalledTimes(0);

    t.apply(dummyEl, DEFAULT_OFFSETS);
    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenCalledWith(DEFAULT_OFFSETS);
  });

  test("X", () => {
    const expected = new Float32Array([
      ...[1, 0, 0, 0],
      ...[tan, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = newIncrementalTransform();
    t.skew((d) => ({ degX: d.x }));
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, x: deg });
    expectToBeCloseToMatrix(t, expected);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, x: -deg });
    expectToBeCloseToMatrix(t, IDENTITY);
  });

  test("Y", () => {
    const expected = new Float32Array([
      ...[1, tan, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = newIncrementalTransform();
    t.skew((d) => ({ degY: d.y }));
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, y: deg });
    expectToBeCloseToMatrix(t, expected);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, y: -deg });
    expectToBeCloseToMatrix(t, IDENTITY);
  });

  test("XY", () => {
    const expected = new Float32Array([
      ...[1 + tan * tan2, tan2, 0, 0],
      ...[tan, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = newIncrementalTransform();
    t.skew((d) => ({ deg: d.x + d.y /* ignored */, degX: d.x, degY: d.y }));
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, x: deg, y: deg2 });
    expectToBeCloseToMatrix(t, expected);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, y: -deg2 });
    t.apply(dummyEl, { ...DEFAULT_OFFSETS, x: -deg });
    expectToBeCloseToMatrix(t, IDENTITY);
  });

  test("XY v2", () => {
    const expected = new Float32Array([
      ...[1 + tan * tan, tan, 0, 0],
      ...[tan, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = newIncrementalTransform();
    t.skew((d) => ({ deg: d.y }));
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, y: deg });
    expectToBeCloseToMatrix(t, expected);
  });
});

describe("rotate", () => {
  const deg = 30;
  const cos = Math.cos((deg * Math.PI) / 180);
  const sin = Math.sin((deg * Math.PI) / 180);

  test("apply", () => {
    const cbk = jest.fn(() => null);
    const t = newIncrementalTransform();
    t.rotate(cbk);
    expect(cbk).toHaveBeenCalledTimes(0);

    t.apply(dummyEl, DEFAULT_OFFSETS);
    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenCalledWith(DEFAULT_OFFSETS);
  });

  test("X", () => {
    const expected = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, cos, sin, 0],
      ...[0, -sin, cos, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = newIncrementalTransform();
    t.rotate((d) => ({ deg: d.x, axis: [1, 0, 0] }));
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, x: deg });
    expectToBeCloseToMatrix(t, expected);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, x: -deg });
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, x: deg / 2 });
    t.apply(dummyEl, { ...DEFAULT_OFFSETS, x: deg / 2 });
    expectToBeCloseToMatrix(t, expected);
  });

  test("Y", () => {
    const expected = new Float32Array([
      ...[cos, 0, -sin, 0],
      ...[0, 1, 0, 0],
      ...[sin, 0, cos, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = newIncrementalTransform();
    t.rotate((d) => ({ deg: d.y, axis: [0, 1, 0] }));
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, y: deg });
    expectToBeCloseToMatrix(t, expected);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, y: -deg });
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, y: deg / 2 });
    t.apply(dummyEl, { ...DEFAULT_OFFSETS, y: deg / 2 });
    expectToBeCloseToMatrix(t, expected);
  });

  test("Z", () => {
    const expected = new Float32Array([
      ...[cos, sin, 0, 0],
      ...[-sin, cos, 0, 0],
      ...[0, 0, 1, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = newIncrementalTransform();
    t.rotate((d) => ({ deg: d.ny, axis: [0, 0, 1] }));
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, ny: deg });
    expectToBeCloseToMatrix(t, expected);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, ny: -deg });
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, ny: deg / 2 });
    t.apply(dummyEl, { ...DEFAULT_OFFSETS, ny: deg / 2 });
    expectToBeCloseToMatrix(t, expected);
  });

  test("X.Y.Z", () => {
    const degX = 30,
      degY = 20,
      degZ = 10;
    const expected = new Float32Array([
      ...[0.92541652, 0.31879577, -0.20487411, 0],
      ...[-0.16317591, 0.82317292, 0.54383814, 0],
      ...[0.34202015, -0.4698463, 0.81379765, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = newIncrementalTransform();
    t.rotate((d) => ({ deg: d.x, axis: [1, 0, 0] }));
    t.rotate((d) => ({ deg: d.y, axis: [0, 1, 0] }));
    t.rotate((d) => ({ deg: d.ny, axis: [0, 0, 1] }));
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, x: degX, y: degY, ny: degZ });
    expectToBeCloseToMatrix(t, expected);
  });

  test("XYZ", () => {
    const expected = new Float32Array([
      ...[0.87559502, 0.42003109, -0.2385524, 0],
      ...[-0.38175263, 0.90430386, 0.19104831, 0],
      ...[0.29597008, -0.07621294, 0.95215193, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = newIncrementalTransform();
    t.rotate((d) => ({ deg: d.y, axis: [1, 2, 3] }));
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, y: deg });
    expectToBeCloseToMatrix(t, expected);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, y: -deg });
    expectToBeCloseToMatrix(t, IDENTITY);

    t.apply(dummyEl, { ...DEFAULT_OFFSETS, y: deg / 2 });
    t.apply(dummyEl, { ...DEFAULT_OFFSETS, y: deg / 2 });
    expectToBeCloseToMatrix(t, expected);
  });
});

describe("chaining", () => {
  test("order 1", () => {
    const dx = 100,
      dy = 200,
      dz = 300,
      sx = 2,
      sy = 4,
      sz = 4,
      r = 30,
      ra = [1, 0, 0],
      sk = 15;
    const expected = new DOMMatrixReadOnly()
      .translate(dx, dy, dz)
      .scale(sx, sy, sz)
      .rotateAxisAngle(...ra, r)
      .skewY(sk);

    const t = newIncrementalTransform();
    t.translate(() => ({ x: dx, y: dy, z: dz }));
    t.scale(() => ({ sx, sy, sz }));
    t.rotate(() => ({ deg: r, axis: ra }));
    t.skew(() => ({ degY: sk }));
    t.apply(dummyEl, DEFAULT_OFFSETS);
    expectToBeCloseToMatrix(t, expected);
  });

  test("order 2", () => {
    const dx = 100,
      dy = 200,
      dz = 300,
      sx = 2,
      sy = 4,
      sz = 4,
      r = 30,
      ra = [1, 0, 0],
      sk = 15;
    const expected = new DOMMatrixReadOnly()
      .skewY(sk)
      .rotateAxisAngle(...ra, r)
      .scale(sx, sy, sz)
      .translate(dx, dy, dz);

    const t = newIncrementalTransform();
    t.skew(() => ({ degY: sk }));
    t.rotate(() => ({ deg: r, axis: ra }));
    t.scale(() => ({ sx, sy, sz }));
    t.translate(() => ({ x: dx, y: dy, z: dz }));
    t.apply(dummyEl, DEFAULT_OFFSETS);
    expectToBeCloseToMatrix(t, expected);
  });
});

describe("apply", () => {
  test("basic", async () => {
    const el = document.createElement("div");
    const t = newIncrementalTransform();
    t.apply(el, DEFAULT_OFFSETS);
    await window.waitForAF();
    expect(el.style.transform).toBe(new DOMMatrixReadOnly(IDENTITY).toString());
  });

  test("relativeTo", async () => {
    const init = newTestMatrix();
    const ref = new DOMMatrixReadOnly([
      ...[8, -6, -3, -5],
      ...[-2, 7, -8, -5],
      ...[-9, -3, 7, 8],
      ...[-4, -3, 1, -10],
    ]);

    const expected = ref.inverse().multiply(init);

    const el = document.createElement("div");
    const t = newIncrementalTransform(init);
    t.apply(el, DEFAULT_OFFSETS, ref);
    await window.waitForAF();
    expect(el.style.transform).toBe(new DOMMatrixReadOnly(expected).toString());
  });
});
