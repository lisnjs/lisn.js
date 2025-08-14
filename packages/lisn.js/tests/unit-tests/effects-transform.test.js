const { jest, describe, test, expect } = require("@jest/globals");

const { deepCopy, copyExistingKeys } = window.LISN.utils;
const { Transform, FXController } = window.LISN.effects;

// XXX TODO
// - export
// - parallax depths

const DEFAULT_CONTROLLER = new FXController();

const IDENTITY = new DOMMatrixReadOnly([
  ...[1, 0, 0, 0],
  ...[0, 1, 0, 0],
  ...[0, 0, 1, 0],
  ...[0, 0, 0, 1],
]);

const DEFAULT_TWEEN_STATE = {
  x: 0,
  nx: 0,
  y: 0,
  ny: 0,
  z: 0,
  nz: 0,
};

const DEFAULT_STATE = {
  x: {
    min: 0,
    max: 1000,
    previous: 0,
    current: 0,
    target: 500,
  },
  y: {
    min: 0,
    max: 100,
    previous: 0,
    current: 0,
    target: 50,
  },
  z: {
    min: 0,
    max: 10,
    previous: 0,
    current: 0,
    target: 5,
  },
};

const newIncrementalTransform = (init) =>
  new Transform({ init, isAbsolute: false });

const newAbsoluteTransform = (init) =>
  new Transform({ init, isAbsolute: true });

const newTestMatrix = (toValue = (i) => i + 1) => {
  const init = new Float32Array(16);
  for (let i = 0; i < 16; i++) {
    init[i] = toValue(i);
  }
  return new DOMMatrixReadOnly(init);
};

const newState = (partial) => {
  const res = deepCopy(DEFAULT_STATE);
  copyExistingKeys(partial, res);
  return res;
};

describe("constructor", () => {
  test("no init", () => {
    const t = newIncrementalTransform();
    expect(t.isAbsolute()).toBe(false);
    expect(t.toMatrix()).toBeInstanceOf(DOMMatrixReadOnly);
    expect(t.toMatrix()).toBeCloseToArray(IDENTITY);

    expect(t.toFloat32Array()).toBeInstanceOf(Float32Array);
    expect(t.toFloat32Array()).toBeCloseToArray(IDENTITY);

    expect(t.toString()).toBe(new DOMMatrixReadOnly(IDENTITY).toString());
  });

  test("with init", () => {
    const init = newTestMatrix();
    const t = newIncrementalTransform(init);
    expect(t.toMatrix()).toBeInstanceOf(DOMMatrixReadOnly);
    expect(t.toMatrix()).toBeCloseToArray(init);

    expect(t.toFloat32Array()).toBeInstanceOf(Float32Array);
    expect(t.toFloat32Array()).toBeCloseToArray(init);

    expect(t.toString()).toBe(new DOMMatrixReadOnly(init).toString());
  });

  test("modifying init", () => {
    const init = window.toArray(newTestMatrix());
    const copy = new Float32Array(window.toArray(init));
    const t = newIncrementalTransform(init);

    init[4] *= 2;

    // not modified
    expect(t).not.toBeCloseToArray(init);
    expect(t).toBeCloseToArray(copy);
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
    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);
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

    const t = newAbsoluteTransform();
    expect(t.isAbsolute()).toBe(true);
    t.translate(() => ({ x: dA }));
    t.translate(() => ({ x: dB }));
    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);
  });
});

describe("toMatrix", () => {
  test("basic", () => {
    const init = newTestMatrix();
    const t = newIncrementalTransform(init);
    const m = t.toMatrix();
    expect(m).toBeInstanceOf(DOMMatrixReadOnly);
    expect(m).toBeCloseToArray(init);
  });

  test("negate", () => {
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
    expect(m).toBeCloseToArray(expected);

    // not modified
    expect(t).toBeCloseToArray(init);
  });

  test("modifying", () => {
    const init = newTestMatrix();
    const copy = new Float32Array(window.toArray(init));
    const t = newIncrementalTransform(init);
    const m = t.toMatrix();
    m.m21 *= 2;

    // not modified
    expect(init).toBeCloseToArray(copy);
    expect(t).toBeCloseToArray(init);
  });
});

describe("toFloat32Array", () => {
  test("basic", () => {
    const init = newTestMatrix();
    const t = newIncrementalTransform(init);
    const m = t.toFloat32Array();
    expect(m).toBeInstanceOf(Float32Array);
    expect(m).toBeCloseToArray(init);
  });

  test("negate", () => {
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
    expect(m).toBeCloseToArray(expected);

    // not modified
    expect(t).toBeCloseToArray(init);
  });

  test("modifying", () => {
    const init = newTestMatrix();
    const copy = new Float32Array(window.toArray(init));
    const t = newIncrementalTransform(init);
    const m = t.toFloat32Array();
    m[4] *= 2;

    // not modified
    expect(init).toBeCloseToArray(copy);
    expect(t).toBeCloseToArray(init);
  });
});

describe("toString", () => {
  test("basic", () => {
    const init = newTestMatrix();
    const t = newIncrementalTransform(init);
    expect(t.toString()).toBe(new DOMMatrixReadOnly(init).toString());
  });

  test("negate", () => {
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
    expect(t).toBeCloseToArray(init);
  });
});

describe("toCss", () => {
  test("basic", () => {
    const init = newTestMatrix();
    const t = newIncrementalTransform(init);
    expect(t.toCss()).toEqual({
      transform: new DOMMatrixReadOnly(init).toString(),
    });
  });

  test("negate", () => {
    const init = newTestMatrix();
    const ref = new DOMMatrixReadOnly([
      ...[8, -6, -3, -5],
      ...[-2, 7, -8, -5],
      ...[-9, -3, 7, 8],
      ...[-4, -3, 1, -10],
    ]);

    const expected = ref.inverse().multiply(init);

    const t = newIncrementalTransform(init);
    expect(t.toCss(ref)).toEqual({
      transform: new DOMMatrixReadOnly(expected).toString(),
    });

    // not modified
    expect(t).toBeCloseToArray(init);
  });
});

describe("toComposition", () => {
  test("all incremental", () => {
    const dx = 100,
      dy = 200,
      dz = 300,
      sx = 2,
      sy = 4,
      sz = 4,
      r = 30,
      ra = [1, 0, 0],
      sk = 15;

    const initA = newTestMatrix((i) => i + 1);
    const tA = newIncrementalTransform(initA);
    tA.translate(() => ({ x: dx, y: dy, z: dz }));
    tA.scale(() => ({ sx, sy }));

    const initB = newTestMatrix((i) => (i + 1) * 2);
    const tB = newIncrementalTransform(initB);
    tB.rotate(() => ({ deg: r, axis: ra }));

    const initC = newTestMatrix((i) => (i + 1) * 3);
    const tC = newIncrementalTransform(initC);
    tC.skew(() => ({ degY: sk }));
    tC.scale(() => ({ sz }));

    const expectedInit = new DOMMatrixReadOnly()
      .multiply(initA)
      .multiply(initB)
      .multiply(initC);

    const expectedFinal = expectedInit
      .translate(dx, dy, dz)
      .scale(sx, sy, 1)
      .rotateAxisAngle(...ra, r)
      .skewY(sk)
      .scale(1, 1, sz);

    const composed = tA.toComposition(tB, tC);
    expect(composed).toBeCloseToArray(expectedInit);

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed).toBeCloseToArray(expectedFinal);
    expect(tA).toBeCloseToArray(initA); // unchanged
    expect(tB).toBeCloseToArray(initB); // unchanged
    expect(tC).toBeCloseToArray(initC); // unchanged

    expect(composed.isAbsolute()).toBe(false);
    expect(composed.toPerspective()).toBeNull();
  });

  test("absolute ones", () => {
    const dx = 100,
      dy = 200,
      dz = 300,
      sx = 2,
      sy = 4,
      sz = 4,
      r = 30,
      ra = [1, 0, 0],
      sk = 15;

    const initA = newTestMatrix((i) => i + 1);
    const tA = newIncrementalTransform(initA);
    tA.translate(() => ({ x: dx, y: dy, z: dz }));

    const initB = newTestMatrix((i) => (i + 1) * 2);
    const tB = newAbsoluteTransform(initB); // discards tA
    tB.scale(() => ({ sx, sy }));

    const initC = newTestMatrix((i) => (i + 1) * 3);
    const tC = newAbsoluteTransform(initC); // discards tB
    tC.rotate(() => ({ deg: r, axis: ra }));
    tC.skew(() => ({ degY: sk }));

    const initD = newTestMatrix((i) => (i + 1) * 4);
    const tD = newIncrementalTransform(initD);
    tD.scale(() => ({ sz }));

    const expectedInit = new DOMMatrixReadOnly()
      .multiply(initC)
      .multiply(initD);

    // will be reset on apply, so init discarded
    const expectedFinal = new DOMMatrixReadOnly()
      .rotateAxisAngle(...ra, r)
      .skewY(sk)
      .scale(1, 1, sz);

    const composed = tA.toComposition(tB, tC, tD);
    expect(composed).toBeCloseToArray(expectedInit);

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed).toBeCloseToArray(expectedFinal);
    expect(tA).toBeCloseToArray(initA); // unchanged
    expect(tB).toBeCloseToArray(initB); // unchanged
    expect(tC).toBeCloseToArray(initC); // unchanged
    expect(tD).toBeCloseToArray(initD); // unchanged

    expect(composed.isAbsolute()).toBe(true);
    expect(composed.toPerspective()).toBeNull();
  });

  test("absolute clears perspective", () => {
    const p = 100;
    const tA = newIncrementalTransform().setPerspective(() => p);
    const tB = newAbsoluteTransform();

    const composed = tA.toComposition(tB);
    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed.toPerspective()).toBeNull();
  });

  test("multiple perspectives", () => {
    const pB = 100,
      pC = 200;
    const tA = newIncrementalTransform();
    const tB = newIncrementalTransform().setPerspective(() => pB);
    const tC = newIncrementalTransform().setPerspective(() => pC);
    const tD = newIncrementalTransform();

    const composed = tA.toComposition(tB, tC, tD);
    expect(composed.toPerspective()).toBeNull();

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed.toPerspective()).toBe(`${pC}px`);
  });
});

describe("perspective", () => {
  test("incremental", () => {
    const t = newIncrementalTransform();
    t.setPerspective(() => 500);
    expect(t.toPerspective()).toBeNull();

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe("500px");
    expect(t.toString()).toBe(
      "perspective(500px) " + new DOMMatrixReadOnly(IDENTITY).toString(),
    );

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe("1000px");
    expect(t.toString()).toBe(
      "perspective(1000px) " + new DOMMatrixReadOnly(IDENTITY).toString(),
    );

    // override handler
    t.setPerspective(() => -200);
    expect(t.toPerspective()).toBe("1000px");

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe("800px");
    expect(t.toString()).toBe(
      "perspective(800px) " + new DOMMatrixReadOnly(IDENTITY).toString(),
    );

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe("600px");
    expect(t.toString()).toBe(
      "perspective(600px) " + new DOMMatrixReadOnly(IDENTITY).toString(),
    );
  });

  test("absolute", () => {
    const t = newAbsoluteTransform();
    t.setPerspective(() => 500);
    expect(t.toPerspective()).toBeNull();

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe("500px");
    expect(t.toString()).toBe(
      "perspective(500px) " + new DOMMatrixReadOnly(IDENTITY).toString(),
    );

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe("500px");
    expect(t.toString()).toBe(
      "perspective(500px) " + new DOMMatrixReadOnly(IDENTITY).toString(),
    );

    // override handler
    t.setPerspective(() => 200);
    expect(t.toPerspective()).toBe("500px");

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe("200px");
    expect(t.toString()).toBe(
      "perspective(200px) " + new DOMMatrixReadOnly(IDENTITY).toString(),
    );

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe("200px");
    expect(t.toString()).toBe(
      "perspective(200px) " + new DOMMatrixReadOnly(IDENTITY).toString(),
    );
  });
});

describe("translate", () => {
  test("apply", () => {
    const cbk = jest.fn(() => null);
    const t = newIncrementalTransform();
    t.translate(cbk);
    expect(cbk).toHaveBeenCalledTimes(0);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenCalledWith(
      DEFAULT_TWEEN_STATE,
      DEFAULT_STATE,
      DEFAULT_CONTROLLER,
    );
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
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ x: { current: d } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);

    t.apply(newState({ x: { current: -d } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ x: { current: d / 2 } }), DEFAULT_CONTROLLER);
    t.apply(newState({ x: { current: d / 2 } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);
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
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ y: { current: d } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);

    t.apply(newState({ y: { current: -d } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ y: { current: d / 2 } }), DEFAULT_CONTROLLER);
    t.apply(newState({ y: { current: d / 2 } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);
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
    t.translate((d) => ({ z: d.z }));
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ z: { current: d } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);

    t.apply(newState({ z: { current: -d } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ z: { current: d / 2 } }), DEFAULT_CONTROLLER);
    t.apply(newState({ z: { current: d / 2 } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);
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
    t.translate((d) => ({ x: d.x, y: d.y, z: d.z }));
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(
      newState({ x: { current: dx }, y: { current: dy }, z: { current: dz } }),
      DEFAULT_CONTROLLER,
    );
    expect(t).toBeCloseToArray(expected);

    t.apply(
      newState({
        x: { current: -dx },
        y: { current: -dy },
        z: { current: -dz },
      }),
      DEFAULT_CONTROLLER,
    );
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(
      newState({
        x: { current: dx / 2 },
        y: { current: dy / 2 },
        z: { current: dz / 2 },
      }),
      DEFAULT_CONTROLLER,
    );
    t.apply(
      newState({
        x: { current: dx / 2 },
        y: { current: dy / 2 },
        z: { current: dz / 2 },
      }),
      DEFAULT_CONTROLLER,
    );
    expect(t).toBeCloseToArray(expected);
  });
});

describe("scale", () => {
  test("apply", () => {
    const cbk = jest.fn(() => null);
    const t = newIncrementalTransform();
    t.scale(cbk);
    expect(cbk).toHaveBeenCalledTimes(0);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenCalledWith(
      DEFAULT_TWEEN_STATE,
      DEFAULT_STATE,
      DEFAULT_CONTROLLER,
    );
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
    t.scale((d) => ({ sx: d.x }));
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ x: { current: s } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);

    t.apply(newState({ x: { current: 1 / s } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ x: { current: s / 2 } }), DEFAULT_CONTROLLER);
    t.apply(newState({ x: { current: 2 } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);
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
    t.scale((d) => ({ sy: d.y }));
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ y: { current: s } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);

    t.apply(newState({ y: { current: 1 / s } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ y: { current: s / 2 } }), DEFAULT_CONTROLLER);
    t.apply(newState({ y: { current: 2 } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);
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
    t.scale((d) => ({ sz: d.z }));
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ z: { current: s } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);

    t.apply(newState({ z: { current: 1 / s } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ z: { current: s / 2 } }), DEFAULT_CONTROLLER);
    t.apply(newState({ z: { current: 2 } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);
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
      s: d.x * d.y * d.z /* ignored */,
      sx: d.x,
      sy: d.y,
      sz: d.z,
    }));
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(
      newState({ x: { current: sx }, y: { current: sy }, z: { current: sz } }),
      DEFAULT_CONTROLLER,
    );
    expect(t).toBeCloseToArray(expected);

    t.apply(
      newState({
        x: { current: 1 / sx },
        y: { current: 1 / sy },
        z: { current: 1 / sz },
      }),
    );
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(
      newState({
        x: { current: sx / 2 },
        y: { current: sy / 2 },
        z: { current: sz / 4 },
      }),
    );
    t.apply(
      newState({ x: { current: 2 }, y: { current: 2 }, z: { current: 4 } }),
      DEFAULT_CONTROLLER,
    );
    expect(t).toBeCloseToArray(expected);
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
    t.scale((d) => ({ s: d.y }));
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ y: { current: s } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);

    t.apply(newState({ y: { current: 1 / s } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ y: { current: s / 2 } }), DEFAULT_CONTROLLER);
    t.apply(newState({ y: { current: 2 } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);
  });

  test("at origin", () => {
    const sx = 10,
      sy = 20,
      sz = 30;
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
    t.scale((d) => ({
      sx: d.x,
      sy: d.y,
      sz: d.z,
      origin: [ox, oy, oz],
    }));
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(
      newState({ x: { current: sx }, y: { current: sy }, z: { current: sz } }),
      DEFAULT_CONTROLLER,
    );
    expect(t).toBeCloseToArray(expected);

    t.apply(
      newState({
        x: { current: 1 / sx },
        y: { current: 1 / sy },
        z: { current: 1 / sz },
      }),
    );
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(
      newState({
        x: { current: sx / 2 },
        y: { current: sy / 2 },
        z: { current: sz / 4 },
      }),
    );
    t.apply(
      newState({ x: { current: 2 }, y: { current: 2 }, z: { current: 4 } }),
      DEFAULT_CONTROLLER,
    );
    expect(t).toBeCloseToArray(expected);
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

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenCalledWith(
      DEFAULT_TWEEN_STATE,
      DEFAULT_STATE,
      DEFAULT_CONTROLLER,
    );
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
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ x: { current: deg } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);

    t.apply(newState({ x: { current: -deg } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(IDENTITY);
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
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ y: { current: deg } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);

    t.apply(newState({ y: { current: -deg } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(IDENTITY);
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
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(
      newState({ x: { current: deg }, y: { current: deg2 } }),
      DEFAULT_CONTROLLER,
    );
    expect(t).toBeCloseToArray(expected);

    t.apply(newState({ y: { current: -deg2 } }), DEFAULT_CONTROLLER);
    t.apply(newState({ x: { current: -deg } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(IDENTITY);
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
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ y: { current: deg } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);
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

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenCalledWith(
      DEFAULT_TWEEN_STATE,
      DEFAULT_STATE,
      DEFAULT_CONTROLLER,
    );
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
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ x: { current: deg } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);

    t.apply(newState({ x: { current: -deg } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ x: { current: deg / 2 } }), DEFAULT_CONTROLLER);
    t.apply(newState({ x: { current: deg / 2 } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);
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
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ y: { current: deg } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);

    t.apply(newState({ y: { current: -deg } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ y: { current: deg / 2 } }), DEFAULT_CONTROLLER);
    t.apply(newState({ y: { current: deg / 2 } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);
  });

  test("Z", () => {
    const expected = new Float32Array([
      ...[cos, sin, 0, 0],
      ...[-sin, cos, 0, 0],
      ...[0, 0, 1, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = newIncrementalTransform();
    t.rotate((d) => ({ deg: d.z, axis: [0, 0, 1] }));
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ z: { current: deg } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);

    t.apply(newState({ z: { current: -deg } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ z: { current: deg / 2 } }), DEFAULT_CONTROLLER);
    t.apply(newState({ z: { current: deg / 2 } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);
  });

  test("X.Y.Z", () => {
    const degX = 30,
      degY = 20,
      degZ = 10;
    const expected = new DOMMatrixReadOnly()
      .rotateAxisAngle(1, 0, 0, degX)
      .rotateAxisAngle(0, 1, 0, degY)
      .rotateAxisAngle(0, 0, 1, degZ);
    const expected2 = new Float32Array([
      // double check mock implementation
      ...[0.92541652, 0.31879577, -0.20487411, 0],
      ...[-0.16317591, 0.82317292, 0.54383814, 0],
      ...[0.34202015, -0.4698463, 0.81379765, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = newIncrementalTransform();
    t.rotate((d) => ({ deg: d.x, axis: [1, 0, 0] }));
    t.rotate((d) => ({ deg: d.y, axis: [0, 1, 0] }));
    t.rotate((d) => ({ deg: d.z, axis: [0, 0, 1] }));
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(
      newState({
        x: { current: degX },
        y: { current: degY },
        z: { current: degZ },
      }),
      DEFAULT_CONTROLLER,
    );
    expect(t).toBeCloseToArray(expected);
    expect(t).toBeCloseToArray(expected2);
  });

  test("XYZ", () => {
    const expected = new DOMMatrixReadOnly().rotateAxisAngle(1, 2, 3, deg);
    const expected2 = new Float32Array([
      ...[0.87559502, 0.42003109, -0.2385524, 0],
      ...[-0.38175263, 0.90430386, 0.19104831, 0],
      ...[0.29597008, -0.07621294, 0.95215193, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = newIncrementalTransform();
    t.rotate((d) => ({ deg: d.y, axis: [1, 2, 3] }));
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ y: { current: deg } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);

    t.apply(newState({ y: { current: -deg } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(IDENTITY);

    t.apply(newState({ y: { current: deg / 2 } }), DEFAULT_CONTROLLER);
    t.apply(newState({ y: { current: deg / 2 } }), DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);
    expect(t).toBeCloseToArray(expected2);
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
    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);
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
    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);
  });
});
