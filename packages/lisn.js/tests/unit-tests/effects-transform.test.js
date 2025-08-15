const { jest, describe, test, expect } = require("@jest/globals");

const { deepCopy, copyExistingKeys } = window.LISN.utils;
const { Transform, FXController, getParameters } = window.LISN.effects;

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

const newTransform = (init, perspective) =>
  new Transform({ init, perspective });

const newAbsoluteTransform = (init, perspective) =>
  new Transform({ init, perspective, isAbsolute: true });

const newTestMatrix = (toValue = (i) => i + 1) => {
  const init = new Float32Array(16);
  for (let i = 0; i < 16; i++) {
    init[i] = toValue(i);
  }
  return new DOMMatrix(init);
};

const newState = (partial) => {
  const res = deepCopy(DEFAULT_STATE);
  copyExistingKeys(partial, res);
  return res;
};

describe("basic", () => {
  test("no init", () => {
    const t = newTransform();
    expect(t.isAbsolute()).toBe(false);
    expect(t.toMatrix()).toBeInstanceOf(DOMMatrixReadOnly);
    expect(t.toMatrix()).toBeCloseToArray(IDENTITY);

    expect(t.toFloat32Array()).toBeInstanceOf(Float32Array);
    expect(t.toFloat32Array()).toBeCloseToArray(IDENTITY);

    expect(t.toPerspective()).toBeUndefined();
    expect(t.toString()).toBe(IDENTITY.toString());
  });

  test("with init", () => {
    const init = newTestMatrix();
    const p = 200;
    const t = newTransform(init, p);
    expect(t.isAbsolute()).toBe(false);
    expect(t.toMatrix()).toBeInstanceOf(DOMMatrixReadOnly);
    expect(t.toMatrix()).toBeCloseToArray(init);

    expect(t.toFloat32Array()).toBeInstanceOf(Float32Array);
    expect(t.toFloat32Array()).toBeCloseToArray(init);

    expect(t.toPerspective()).toBe(p);
    expect(t.toString()).toBe(`perspective(${p}px) ` + init.toString());
  });

  test("absolute", () => {
    const t = newAbsoluteTransform();
    expect(t.isAbsolute()).toBe(true);
    expect(t.toMatrix()).toBeInstanceOf(DOMMatrixReadOnly);
    expect(t.toMatrix()).toBeCloseToArray(IDENTITY);

    expect(t.toFloat32Array()).toBeInstanceOf(Float32Array);
    expect(t.toFloat32Array()).toBeCloseToArray(IDENTITY);

    expect(t.toPerspective()).toBeUndefined();
    expect(t.toString()).toBe(IDENTITY.toString());
  });

  test("absolute: with init", () => {
    const init = newTestMatrix();
    const p = 200;
    const t = newAbsoluteTransform(init, p);
    expect(t.isAbsolute()).toBe(true);
    expect(t.toMatrix()).toBeInstanceOf(DOMMatrixReadOnly);
    expect(t.toMatrix()).toBeCloseToArray(init);

    expect(t.toFloat32Array()).toBeInstanceOf(Float32Array);
    expect(t.toFloat32Array()).toBeCloseToArray(init);

    expect(t.toPerspective()).toBe(p);
    expect(t.toString()).toBe(`perspective(${p}px) ` + init.toString());
  });

  test("modifying init DOMMatrix", () => {
    const init = newTestMatrix();
    const copy = new Float32Array(window.toArray(init));
    const t = newTransform(init);

    init.m21 *= 2;

    // not modified
    expect(t).not.toBeCloseToArray(init);
    expect(t).toBeCloseToArray(copy);
  });

  test("modifying init Float32Array", () => {
    const init = new Float32Array(window.toArray(newTestMatrix()));
    const copy = new Float32Array(window.toArray(init));
    const t = newTransform(init);

    init[4] *= 2;

    // not modified
    expect(t).not.toBeCloseToArray(init);
    expect(t).toBeCloseToArray(copy);
  });
});

describe("apply", () => {
  test("basic", () => {
    const dA = 10,
      dB = 20,
      p = 200;
    const expected = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[dA + dB, 0, 0, 1],
    ]);
    const expectedFinal = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[2 * (dA + dB), 0, 0, 1],
    ]);

    const t = newTransform();
    t.translate(() => ({ x: dA }));
    t.translate(() => ({ x: dB })); // adds to above one
    t.setPerspective(() => p * 10);
    t.setPerspective(() => p); // discards above one

    // not applied yet
    expect(t).toBeCloseToArray(IDENTITY);
    expect(t.toPerspective()).toBeUndefined();

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER); // 1st call: dA + dB; perspective p
    expect(t).toBeCloseToArray(expected);
    expect(t.toPerspective()).toBe(p);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER); // increments by the same quantity
    expect(t).toBeCloseToArray(expectedFinal);
    expect(t.toPerspective()).toBe(p * 2);
  });

  test("absolute", () => {
    const dA = 10,
      dB = 20,
      p = 200;
    const expected = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[dA + dB, 0, 0, 1],
    ]);
    const expectedFinal = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[dA + dB * 4, 0, 0, 1],
    ]);

    let nCalls = 0;

    const t = newAbsoluteTransform();
    expect(t.isAbsolute()).toBe(true);
    t.translate(() => ({ x: dA }));
    t.translate(() => ({ x: nCalls === 1 ? dB : dB * 4 })); // adds to above one
    t.setPerspective(() => p * 10);
    t.setPerspective(() => (nCalls === 1 ? p : p * 4)); // discards above

    // not applied yet
    expect(t).toBeCloseToArray(IDENTITY);
    expect(t.toPerspective()).toBeUndefined();

    nCalls++;
    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER); // 1st call: dA + dB; perspective p
    expect(t).toBeCloseToArray(expected);
    expect(t.toPerspective()).toBe(p);

    nCalls++;
    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER); // 2nd call: dA + dB * 4; perspective p * 4
    // overrides state, starts from identity again
    expect(t).toBeCloseToArray(expectedFinal);
    expect(t.toPerspective()).toBe(p * 4);
  });

  test("init but no handlers", () => {
    const init = newTestMatrix();
    const p = 200;
    const t = newTransform(init, p);
    expect(t.isAbsolute()).toBe(false);
    expect(t).toBeCloseToArray(init);
    expect(t.toPerspective()).toBe(p);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    // unchanged
    expect(t).toBeCloseToArray(init);
    expect(t.toPerspective()).toBe(p);
  });

  test("absolute: init but no handlers", () => {
    const init = newTestMatrix();
    const p = 200;
    const t = newAbsoluteTransform(init, p);
    expect(t.isAbsolute()).toBe(true);
    expect(t).toBeCloseToArray(init);
    expect(t.toPerspective()).toBe(p);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    // reset
    expect(t).toBeCloseToArray(IDENTITY);
    expect(t.toPerspective()).toBeUndefined();
  });

  test("with init", () => {
    const sI = 2,
      dI = 5,
      pI = 50,
      dA = 10,
      dB = 20,
      p = 200;
    const init = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, sI, 0, 0],
      ...[0, 0, 1, 0],
      ...[0, dI, 0, 1],
    ]);
    const expected = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, sI, 0, 0],
      ...[0, 0, 1, 0],
      ...[dA + dB, dI, 0, 1],
    ]);
    const expectedFinal = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, sI, 0, 0],
      ...[0, 0, 1, 0],
      ...[2 * (dA + dB), dI, 0, 1],
    ]);

    const t = newTransform(init, pI);
    t.translate(() => ({ x: dA }));
    t.translate(() => ({ x: dB })); // adds to above one
    t.setPerspective(() => p * 10);
    t.setPerspective(() => p); // discards above one

    // not applied yet
    expect(t).toBeCloseToArray(init);
    expect(t.toPerspective()).toBe(pI);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER); // increments: dA + dB; perspective p
    expect(t).toBeCloseToArray(expected);
    expect(t.toPerspective()).toBe(pI + p);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER); // increments by the same quantity
    expect(t).toBeCloseToArray(expectedFinal);
    expect(t.toPerspective()).toBe(pI + p * 2);
  });

  test("absolute: with init", () => {
    const sI = 2,
      dI = 5,
      pI = 50,
      dA = 10,
      dB = 20,
      p = 200;
    const init = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, sI, 0, 0],
      ...[0, 0, 1, 0],
      ...[0, dI, 0, 1],
    ]);
    const expected = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[dA + dB, 0, 0, 1],
    ]);
    const expectedFinal = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[dA + dB * 4, 0, 0, 1],
    ]);

    let nCalls = 0;

    const t = newAbsoluteTransform(init, pI);
    expect(t.isAbsolute()).toBe(true);
    t.translate(() => ({ x: dA }));
    t.translate(() => ({ x: nCalls === 1 ? dB : dB * 4 })); // adds to above one
    t.setPerspective(() => p * 10);
    t.setPerspective(() => (nCalls === 1 ? p : p * 4)); // discards above

    // not applied yet
    expect(t).toBeCloseToArray(init);
    expect(t.toPerspective()).toBe(pI);

    nCalls++;
    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER); // overrides: 1st call: dA + dB; perspective p
    expect(t).toBeCloseToArray(expected);
    expect(t.toPerspective()).toBe(p);

    nCalls++;
    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER); // overrides: 2nd call: dA + dB * 4; perspective p * 4
    // overrides state, starts from identity again
    expect(t).toBeCloseToArray(expectedFinal);
    expect(t.toPerspective()).toBe(p * 4);
  });

  test("adding handlers after apply", () => {
    const dA = 10,
      dB = 20,
      p = 200;
    const expected = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[dA, 0, 0, 1],
    ]);
    const expectedFinal = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[2 * dA + dB, 0, 0, 1],
    ]);

    const t = newTransform();
    t.translate(() => ({ x: dA }));
    t.setPerspective(() => p * 10);

    // not applied yet
    expect(t).toBeCloseToArray(IDENTITY);
    expect(t.toPerspective()).toBeUndefined();

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER); // dA; perspective p * 10
    expect(t).toBeCloseToArray(expected);
    expect(t.toPerspective()).toBe(p * 10);

    // new handlers
    t.translate(() => ({ x: dB }));
    t.setPerspective(() => p); // discards previous handler

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER); // increments by dA + dB; + perspective p
    expect(t).toBeCloseToArray(expectedFinal);
    expect(t.toPerspective()).toBe(p * 11);
  });

  test("absolute: adding handlers after apply", () => {
    const dA = 10,
      dB = 20,
      p = 200;
    const expected = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[dA, 0, 0, 1],
    ]);
    const expectedFinal = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[dA + dB, 0, 0, 1],
    ]);

    const t = newAbsoluteTransform();
    t.translate(() => ({ x: dA }));
    t.setPerspective(() => p * 10);

    // not applied yet
    expect(t).toBeCloseToArray(IDENTITY);
    expect(t.toPerspective()).toBeUndefined();

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);
    expect(t.toPerspective()).toBe(p * 10);

    // new handlers
    t.translate(() => ({ x: dB }));
    t.setPerspective(() => p); // discards previous handler

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER); // overrides: dA + dB; perspective p
    // overrides state, starts from identity again
    expect(t).toBeCloseToArray(expectedFinal);
    expect(t.toPerspective()).toBe(p);
  });
});

describe("apply parameters", () => {
  const state = {
    x: {
      min: -1000,
      max: 1000,
      previous: 0,
      current: 100,
      target: 500,
    },
    y: {
      min: -100,
      max: 100,
      previous: 0,
      current: 10,
      target: 50,
    },
    z: {
      min: -10,
      max: 10,
      previous: 0,
      current: 1,
      target: 5,
    },
  };

  const state2 = {
    x: {
      min: -2000,
      max: 2000,
      previous: 100,
      current: 150,
      target: 500,
    },
    y: {
      min: -100,
      max: 100,
      previous: 10,
      current: 15,
      target: 50,
    },
    z: {
      min: -10,
      max: 10,
      previous: 1,
      current: 2,
      target: 5,
    },
  };

  test("incremental", () => {
    const t = newTransform();
    const cbk = jest.fn((d) => ({ x: d.x, y: d.y, z: d.z }));
    t.translate(cbk);

    const params = getParameters(state, DEFAULT_CONTROLLER);
    t.apply(state, DEFAULT_CONTROLLER);

    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenNthCalledWith(1, params, state, DEFAULT_CONTROLLER);

    t.apply(state2, DEFAULT_CONTROLLER);
    const params2 = getParameters(state2, DEFAULT_CONTROLLER);

    expect(cbk).toHaveBeenCalledTimes(2);
    expect(cbk).toHaveBeenNthCalledWith(2, params2, state2, DEFAULT_CONTROLLER);
  });

  test("absolute", () => {
    const t = newAbsoluteTransform();
    const cbk = jest.fn((d) => ({ x: d.x, y: d.y, z: d.z }));
    t.translate(cbk);

    const params = getParameters(state, DEFAULT_CONTROLLER, {
      isAbsolute: true,
    });
    t.apply(state, DEFAULT_CONTROLLER);

    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenNthCalledWith(1, params, state, DEFAULT_CONTROLLER);

    t.apply(state2, DEFAULT_CONTROLLER);
    const params2 = getParameters(state2, DEFAULT_CONTROLLER, {
      isAbsolute: true,
    });

    expect(cbk).toHaveBeenCalledTimes(2);
    expect(cbk).toHaveBeenNthCalledWith(2, params2, state2, DEFAULT_CONTROLLER);
  });
});

describe("export", () => {
  test("basic", () => {
    const dx = 100,
      dy = 200,
      dz = 300,
      sx = 2,
      sy = 4,
      sz = 4,
      p = 200;

    const t = newTransform();
    t.translate(() => ({ x: dx, y: dy, z: dz }));
    t.scale(() => ({ sx, sy, sz }));
    t.setPerspective(() => p);

    const expectedO = IDENTITY.translate(dx, dy, dz).scale(sx, sy, sz);

    const exported = t.export();
    expect(exported).toBeCloseToArray(IDENTITY);
    expect(exported.toPerspective()).toBeUndefined();
    expect(exported.isAbsolute()).toBe(false);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    // unchanged
    expect(exported).toBeCloseToArray(IDENTITY);
    expect(exported.toPerspective()).toBeUndefined();

    exported.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);

    // original unchanged
    expect(t).toBeCloseToArray(expectedO);
    expect(t.toPerspective()).toBe(p);

    // exported is static and detached from t's state and handlers
    expect(exported).toBeCloseToArray(IDENTITY);
    expect(exported.toPerspective()).toBeUndefined();
  });

  test("absolute", () => {
    const dx = 100,
      dy = 200,
      dz = 300,
      sx = 2,
      sy = 4,
      sz = 4,
      p = 200;

    const t = newAbsoluteTransform();
    t.translate(() => ({ x: dx, y: dy, z: dz }));
    t.scale(() => ({ sx, sy, sz }));
    t.setPerspective(() => p);

    const exported = t.export();
    expect(exported).toBeCloseToArray(IDENTITY);
    expect(exported.toPerspective()).toBeUndefined();
    expect(exported.isAbsolute()).toBe(true);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    // unchanged
    expect(exported).toBeCloseToArray(IDENTITY);
    expect(exported.toPerspective()).toBeUndefined();

    exported.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);

    // exported is static and detached from t's state and handlers
    expect(exported).toBeCloseToArray(IDENTITY);
    expect(exported.toPerspective()).toBeUndefined();
  });

  test("with init", () => {
    const dx = 100,
      dy = 200,
      dz = 300,
      sx = 2,
      sy = 4,
      sz = 4,
      p = 200;

    const init = newTestMatrix((i) => i + 1);
    const t = newTransform(init, p);
    t.translate(() => ({ x: dx, y: dy, z: dz }));
    t.scale(() => ({ sx, sy, sz }));
    t.setPerspective(() => p * 2);

    const exported = t.export();
    expect(exported).toBeCloseToArray(init);
    expect(exported.toPerspective()).toBe(p);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    // unchanged
    expect(exported).toBeCloseToArray(init);
    expect(exported.toPerspective()).toBe(p);

    exported.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);

    // static and detached from t's state and handlers
    expect(exported).toBeCloseToArray(init);
    expect(exported.toPerspective()).toBe(p);
  });

  test("with init matrix only", () => {
    const dx = 100,
      dy = 200,
      dz = 300,
      sx = 2,
      sy = 4,
      sz = 4,
      p = 200;

    const init = newTestMatrix((i) => i + 1);
    const t = newTransform(init); // no initial perspective
    t.translate(() => ({ x: dx, y: dy, z: dz }));
    t.scale(() => ({ sx, sy, sz }));
    t.setPerspective(() => p);

    const exported = t.export();
    expect(exported).toBeCloseToArray(init);
    expect(exported.toPerspective()).toBeUndefined();

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    // unchanged
    expect(exported).toBeCloseToArray(init);
    expect(exported.toPerspective()).toBeUndefined();

    exported.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);

    // static and detached from t's state and handlers
    expect(exported).toBeCloseToArray(init);
    expect(exported.toPerspective()).toBeUndefined();
  });

  test("absolute: with init", () => {
    const dx = 100,
      dy = 200,
      dz = 300,
      sx = 2,
      sy = 4,
      sz = 4,
      p = 200;

    const init = newTestMatrix((i) => i + 1);
    const t = newAbsoluteTransform(init, p);
    t.translate(() => ({ x: dx, y: dy, z: dz }));
    t.scale(() => ({ sx, sy, sz }));
    t.setPerspective(() => p * 2);

    const exported = t.export();
    expect(exported).toBeCloseToArray(init);
    expect(exported.toPerspective()).toBe(p);
    expect(exported.isAbsolute()).toBe(true);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    // unchanged
    expect(exported).toBeCloseToArray(init);
    expect(exported.toPerspective()).toBe(p);

    exported.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);

    // static and detached from t's state and handlers
    // and resets itself on apply
    expect(exported).toBeCloseToArray(IDENTITY);
    expect(exported.toPerspective()).toBeUndefined();
  });

  test("after apply", () => {
    const dx = 100,
      dy = 200,
      dz = 300,
      sx = 2,
      sy = 4,
      sz = 4,
      p = 200;

    const t = newTransform();
    t.translate(() => ({ x: dx, y: dy, z: dz }));
    t.scale(() => ({ sx, sy, sz }));
    t.setPerspective(() => p);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);

    const expected = IDENTITY.translate(dx, dy, dz).scale(sx, sy, sz);

    const exported = t.export();
    expect(t).toBeCloseToArray(expected);
    expect(t.toPerspective()).toBe(p);
    expect(exported).toBeCloseToArray(expected);
    expect(exported.toPerspective()).toBe(p);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);

    const expected2 = expected.translate(dx, dy, dz).scale(sx, sy, sz);

    expect(t).toBeCloseToArray(expected2);
    expect(t.toPerspective()).toBe(p * 2);

    // unchanged
    expect(exported).toBeCloseToArray(expected);
    expect(exported.toPerspective()).toBe(p);

    exported.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);

    // original unchanged
    expect(t).toBeCloseToArray(expected2);
    expect(t.toPerspective()).toBe(p * 2);

    // static and detached from t's state and handlers
    expect(exported).toBeCloseToArray(expected);
    expect(exported.toPerspective()).toBe(p);
  });

  test("absolute: after apply", () => {
    const dx = 100,
      dy = 200,
      dz = 300,
      sx = 2,
      sy = 4,
      sz = 4,
      p = 200;

    const t = newAbsoluteTransform();
    let nCalls = 0;
    t.translate(() => ({
      x: dx * nCalls,
      y: dy * nCalls,
      z: dz * nCalls,
    }));
    t.scale(() => ({
      sx: sx * nCalls,
      sy: sy * nCalls,
      sz: sz * nCalls,
    }));
    t.setPerspective(() => p * nCalls);

    nCalls++;
    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);

    const expected = IDENTITY.translate(dx, dy, dz).scale(sx, sy, sz);

    const exported = t.export();
    expect(t).toBeCloseToArray(expected);
    expect(t.toPerspective()).toBe(p);
    expect(exported).toBeCloseToArray(expected);
    expect(exported.toPerspective()).toBe(p);

    nCalls++;
    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);

    const expected2 = IDENTITY.translate(dx * 2, dy * 2, dz * 2).scale(
      sx * 2,
      sy * 2,
      sz * 2,
    );

    expect(t).toBeCloseToArray(expected2);
    expect(t.toPerspective()).toBe(p * 2);

    // unchanged
    expect(exported).toBeCloseToArray(expected);
    expect(exported.toPerspective()).toBe(p);

    exported.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);

    // static and detached from t's state and handlers
    // and resets itself on apply
    expect(exported).toBeCloseToArray(IDENTITY);
    expect(exported.toPerspective()).toBeUndefined();
  });

  test("negate", () => {
    const init = newTestMatrix();
    const p = 200;
    const ref = new DOMMatrix([
      ...[8, -6, -3, -5],
      ...[-2, 7, -8, -5],
      ...[-9, -3, 7, 8],
      ...[-4, -3, 1, -10],
    ]);

    const expected = ref.inverse().multiply(init);

    const t = newTransform(init, p);
    const exported = t.export(ref);
    expect(exported).toBeCloseToArray(expected);
    expect(exported.toPerspective()).toBe(p);
    expect(exported.isAbsolute()).toBe(false);
  });

  test("negate: absolute", () => {
    const init = newTestMatrix();
    const p = 200;
    const ref = new DOMMatrix([
      ...[8, -6, -3, -5],
      ...[-2, 7, -8, -5],
      ...[-9, -3, 7, 8],
      ...[-4, -3, 1, -10],
    ]);

    const expected = ref.inverse().multiply(init);

    const t = newAbsoluteTransform(init, p);
    const exported = t.export(ref);
    expect(exported).toBeCloseToArray(expected);
    expect(exported.toPerspective()).toBe(p);
    expect(exported.isAbsolute()).toBe(true);
  });

  test("negage: after apply", () => {
    const dx = 100,
      dy = 200,
      dz = 300,
      p = 200;
    const ref = new DOMMatrix([
      ...[8, -6, -3, -5],
      ...[-2, 7, -8, -5],
      ...[-9, -3, 7, 8],
      ...[-4, -3, 1, -10],
    ]);

    const t = newTransform();
    t.translate(() => ({ x: dx, y: dy, z: dz }));
    t.setPerspective(() => p);
    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);

    const expected = IDENTITY.translate(dx, dy, dz);
    expect(t).toBeCloseToArray(expected);
    expect(t.toPerspective()).toBe(p);

    const expectedExp = ref.inverse().multiply(t.toMatrix());
    const exported = t.export(ref);
    expect(exported).toBeCloseToArray(expectedExp);
    expect(exported.toPerspective()).toBe(p);
  });
});

describe("toComposition: single (clone)", () => {
  test("basic", () => {
    const dx = 100,
      dy = 200,
      dz = 300,
      sx = 2,
      sy = 4,
      sz = 4,
      p = 200;

    const t = newTransform();
    t.translate(() => ({ x: dx, y: dy, z: dz }));
    t.scale(() => ({ sx, sy, sz }));
    t.setPerspective(() => p);

    const expected = IDENTITY.translate(dx, dy, dz).scale(sx, sy, sz);

    const composed = t.toComposition();
    expect(composed.isAbsolute()).toBe(false);
    expect(composed).toBeCloseToArray(IDENTITY);
    expect(composed.toPerspective()).toBeUndefined();

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed).toBeCloseToArray(expected); // preserved handlers
    expect(composed.toPerspective()).toBe(p);

    expect(t).toBeCloseToArray(IDENTITY); // unchanged
    expect(t.toPerspective()).toBeUndefined();
  });

  test("absolute", () => {
    const dx = 100,
      dy = 200,
      dz = 300,
      sx = 2,
      sy = 4,
      sz = 4,
      p = 200;

    const t = newAbsoluteTransform();
    t.translate(() => ({ x: dx, y: dy, z: dz }));
    t.scale(() => ({ sx, sy, sz }));
    t.setPerspective(() => p);

    const expected = IDENTITY.translate(dx, dy, dz).scale(sx, sy, sz);

    const composed = t.toComposition();
    expect(composed.isAbsolute()).toBe(true);
    expect(composed).toBeCloseToArray(IDENTITY);
    expect(composed.toPerspective()).toBeUndefined();

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed).toBeCloseToArray(expected); // preserved handlers
    expect(composed.toPerspective()).toBe(p);

    expect(t).toBeCloseToArray(IDENTITY); // unchanged
    expect(t.toPerspective()).toBeUndefined();
  });

  test("with init", () => {
    const dx = 100,
      dy = 200,
      dz = 300,
      sx = 2,
      sy = 4,
      sz = 4,
      p = 200;

    const init = newTestMatrix((i) => i + 1);
    const t = newTransform(init, p);
    t.translate(() => ({ x: dx, y: dy, z: dz }));
    t.scale(() => ({ sx, sy, sz }));
    t.setPerspective(() => p * 2); // adds to existing

    const expected = init.translate(dx, dy, dz).scale(sx, sy, sz);

    const composed = t.toComposition();
    expect(composed.isAbsolute()).toBe(false);
    expect(composed).toBeCloseToArray(init);
    expect(composed.toPerspective()).toBe(p);

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed).toBeCloseToArray(expected); // preserved handlers
    expect(composed.toPerspective()).toBe(p * 3);

    expect(t).toBeCloseToArray(init); // unchanged
    expect(t.toPerspective()).toBe(p);
  });

  test("absolute: with init", () => {
    const dx = 100,
      dy = 200,
      dz = 300,
      sx = 2,
      sy = 4,
      sz = 4,
      p = 200;

    const init = newTestMatrix((i) => i + 1);
    const t = newAbsoluteTransform(init, p);
    t.translate(() => ({ x: dx, y: dy, z: dz }));
    t.scale(() => ({ sx, sy, sz }));
    t.setPerspective(() => p * 2); // overrides existing

    const expected = IDENTITY.translate(dx, dy, dz).scale(sx, sy, sz);

    const composed = t.toComposition();
    expect(composed.isAbsolute()).toBe(true);
    expect(composed).toBeCloseToArray(init);
    expect(composed.toPerspective()).toBe(p);

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed).toBeCloseToArray(expected); // preserved handlers
    expect(composed.toPerspective()).toBe(p * 2);

    expect(t).toBeCloseToArray(init); // unchanged
    expect(t.toPerspective()).toBe(p);
  });

  test("after apply", () => {
    const dx = 100,
      dy = 200,
      dz = 300,
      sx = 2,
      sy = 4,
      sz = 4,
      p = 200;

    const t = newTransform();
    t.translate(() => ({ x: dx, y: dy, z: dz }));
    t.scale(() => ({ sx, sy, sz }));
    t.setPerspective(() => p);
    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);

    const expected = IDENTITY.translate(dx, dy, dz).scale(sx, sy, sz);
    const expectedFinal = expected.translate(dx, dy, dz).scale(sx, sy, sz);

    const composed = t.toComposition();
    expect(t).toBeCloseToArray(expected);
    expect(t.toPerspective()).toBe(p);
    expect(composed).toBeCloseToArray(expected);
    expect(composed.toPerspective()).toBe(p);

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed).toBeCloseToArray(expectedFinal); // preserved handlers
    expect(composed.toPerspective()).toBe(p * 2);

    expect(t).toBeCloseToArray(expected); // unchanged
    expect(t.toPerspective()).toBe(p);

    // apply original
    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expectedFinal);
    expect(t.toPerspective()).toBe(p * 2);

    expect(composed).toBeCloseToArray(expectedFinal); // unchanged
    expect(composed.toPerspective()).toBe(p * 2);
  });

  test("add handlers after clone", () => {
    const dx = 100,
      dy = 200,
      dz = 300,
      sx = 2,
      sy = 4,
      sz = 4,
      p = 200;

    const t = newTransform();
    t.translate(() => ({ x: dx, y: dy, z: dz }));

    const composed = t.toComposition();

    t.scale(() => ({ sx, sy, sz })); // does not affect composed
    composed.setPerspective(() => p); // does not affect original

    const expectedO = IDENTITY.translate(dx, dy, dz).scale(sx, sy, sz);
    const expectedC = IDENTITY.translate(dx, dy, dz);

    expect(t).toBeCloseToArray(IDENTITY);
    expect(t.toPerspective()).toBeUndefined();

    expect(composed).toBeCloseToArray(IDENTITY);
    expect(composed.toPerspective()).toBeUndefined();

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);

    expect(composed).toBeCloseToArray(expectedC);
    expect(composed.toPerspective()).toBe(p);

    expect(t).toBeCloseToArray(expectedO);
    expect(t.toPerspective()).toBeUndefined();
  });
});

describe("toComposition: multiple", () => {
  test("with init", () => {
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
    const tA = newTransform(initA);
    tA.translate(() => ({ x: dx, y: dy, z: dz }));
    tA.scale(() => ({ sx, sy }));

    const initB = newTestMatrix((i) => (i + 1) * 2);
    const tB = newTransform(initB);
    tB.rotate(() => ({ deg: r, axis: ra }));

    const initC = newTestMatrix((i) => (i + 1) * 3);
    const tC = newTransform(initC);
    tC.skew(() => ({ degY: sk }));
    tC.scale(() => ({ sz }));

    const expectedInit = IDENTITY.multiply(initA)
      .multiply(initB)
      .multiply(initC);

    const expectedFinal = expectedInit
      .translate(dx, dy, dz)
      .scale(sx, sy, 1)
      .rotateAxisAngle(...ra, r)
      .skewY(sk)
      .scale(1, 1, sz);

    const composed = tA.toComposition(tB, tC);
    expect(composed.isAbsolute()).toBe(false);
    expect(composed).toBeCloseToArray(expectedInit);

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed).toBeCloseToArray(expectedFinal);

    expect(tA).toBeCloseToArray(initA); // unchanged
    expect(tB).toBeCloseToArray(initB); // unchanged
    expect(tC).toBeCloseToArray(initC); // unchanged
  });

  test("absolute: with init", () => {
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
    const tA = newTransform(initA);
    tA.translate(() => ({ x: dx, y: dy, z: dz }));

    const initB = newTestMatrix((i) => (i + 1) * 2);
    const tB = newAbsoluteTransform(initB); // discards tA
    tB.scale(() => ({ sx, sy }));

    const initC = newTestMatrix((i) => (i + 1) * 3);
    const tC = newAbsoluteTransform(initC); // discards tB
    tC.rotate(() => ({ deg: r, axis: ra }));
    tC.skew(() => ({ degY: sk }));

    const initD = newTestMatrix((i) => (i + 1) * 4);
    const tD = newTransform(initD);
    tD.scale(() => ({ sz }));

    const expectedInit = IDENTITY.multiply(initC).multiply(initD);

    // will be reset on apply, so init discarded
    const expectedFinal = IDENTITY.rotateAxisAngle(...ra, r)
      .skewY(sk)
      .scale(1, 1, sz);

    const composed = tA.toComposition(tB, tC, tD);
    expect(composed.isAbsolute()).toBe(true);
    expect(composed).toBeCloseToArray(expectedInit);

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed).toBeCloseToArray(expectedFinal);

    expect(tA).toBeCloseToArray(initA); // unchanged
    expect(tB).toBeCloseToArray(initB); // unchanged
    expect(tC).toBeCloseToArray(initC); // unchanged
    expect(tD).toBeCloseToArray(initD); // unchanged
  });
});

describe("toComposition: multiple with perspective", () => {
  test("init: first only", () => {
    const p = 100;
    const tA = newTransform(undefined, p);
    const tB = newTransform();

    const composed = tA.toComposition(tB);
    expect(composed.toPerspective()).toBe(p);

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed.toPerspective()).toBe(p); // no handler to update
  });

  test("handler: first only", () => {
    const p = 100;
    const tA = newTransform().setPerspective(() => p);
    const tB = newTransform();

    const composed = tA.toComposition(tB);
    expect(composed.toPerspective()).toBeUndefined();

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed.toPerspective()).toBe(p);

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed.toPerspective()).toBe(p * 2);
  });

  test("init + handler", () => {
    const pA = 100,
      pB = 200;
    const tA = newTransform().setPerspective(() => pA);
    const tB = newTransform(undefined, pB);

    const composed = tA.toComposition(tB);
    expect(composed.toPerspective()).toBe(pB);

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed.toPerspective()).toBe(pA + pB);

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed.toPerspective()).toBe(pA * 2 + pB);
  });

  test("init: multiple", () => {
    const pA = 100,
      pC = 200;
    const tA = newTransform(undefined, pA);
    const tB = newTransform();
    const tC = newTransform(undefined, pC);

    const composed = tA.toComposition(tB, tC);
    expect(composed.toPerspective()).toBe(pC);

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed.toPerspective()).toBe(pC);
  });

  test("init: multiple v2", () => {
    const pB = 100,
      pC = 200;
    const tA = newTransform();
    const tB = newTransform(undefined, pB);
    const tC = newTransform(undefined, pC);
    const tD = newTransform();

    const composed = tA.toComposition(tB, tC, tD);
    expect(composed.toPerspective()).toBe(pC);

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed.toPerspective()).toBe(pC);
  });

  test("init: multiple with first null", () => {
    const p = 100;
    const tA = newTransform(undefined, null);
    const tB = newTransform(undefined, p);

    const composed = tA.toComposition(tB);
    expect(composed.toPerspective()).toBe(p);

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed.toPerspective()).toBe(p);
  });

  test("init: multiple with last null", () => {
    const p = 100;
    const tA = newTransform(undefined, p);
    const tB = newTransform(undefined, null);

    const composed = tA.toComposition(tB);
    expect(composed.toPerspective()).toBeNull();

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed.toPerspective()).toBeNull();
  });

  test("handler: multiple", () => {
    const pA = 100,
      pC = 200;
    const tA = newTransform().setPerspective(() => pA);
    const tB = newTransform();
    const tC = newTransform().setPerspective(() => pC);

    const composed = tA.toComposition(tB, tC);
    expect(composed.toPerspective()).toBeUndefined();

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed.toPerspective()).toBe(pC);

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed.toPerspective()).toBe(pC * 2);
  });

  test("handler: multiple v2", () => {
    const pB = 100,
      pC = 200;
    const tA = newTransform();
    const tB = newTransform().setPerspective(() => pB);
    const tC = newTransform().setPerspective(() => pC);
    const tD = newTransform();

    const composed = tA.toComposition(tB, tC, tD);
    expect(composed.toPerspective()).toBeUndefined();

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed.toPerspective()).toBe(pC);

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed.toPerspective()).toBe(pC * 2);
  });

  test("init + handler: last null", () => {
    const p = 100;
    const tA = newTransform(undefined, p);
    const tB = newTransform(undefined).setPerspective(() => null);

    const composed = tA.toComposition(tB);
    expect(composed.toPerspective()).toBe(p);

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed.toPerspective()).toBeNull();
  });

  test("init + handler: multiple", () => {
    const pA = 100,
      pB = 150,
      pC = 200;
    const tA = newTransform(undefined, pA);
    const tB = newTransform().setPerspective(() => pB);
    const tC = newTransform(undefined, pC);

    const composed = tA.toComposition(tB, tC);
    expect(composed.toPerspective()).toBe(pC);

    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed.toPerspective()).toBe(pB + pC);
  });

  test("absolute", () => {
    const p = 100;
    const tA = newTransform(undefined, p).setPerspective(() => p);
    const tB = newAbsoluteTransform(); // discards both init and handler

    const composed = tA.toComposition(tB);
    composed.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(composed.toPerspective()).toBeUndefined();
  });
});

describe("toCss", () => {
  test("basic", () => {
    const init = newTestMatrix();
    const t = newTransform(init);
    expect(t.toCss()).toEqual({
      transform: init.toString(),
    });
  });

  test("negate", () => {
    const init = newTestMatrix();
    const ref = new DOMMatrix([
      ...[8, -6, -3, -5],
      ...[-2, 7, -8, -5],
      ...[-9, -3, 7, 8],
      ...[-4, -3, 1, -10],
    ]);

    const expected = ref.inverse().multiply(init);

    const t = newTransform(init);
    expect(t.toCss(ref)).toEqual({
      transform: expected.toString(),
    });

    // not modified
    expect(t).toBeCloseToArray(init);
  });
});

describe("toString", () => {
  test("basic", () => {
    const init = newTestMatrix();
    const t = newTransform(init);
    expect(t.toString()).toBe(init.toString());
  });

  test("with null perspective", () => {
    const init = newTestMatrix();
    const t = newTransform(init, null);
    expect(t.toString()).toBe(init.toString());
  });

  test("with perspective", () => {
    const init = newTestMatrix();
    const t = newTransform(init, 200);
    expect(t.toString()).toBe("perspective(200px) " + init.toString());
  });

  test("negate", () => {
    const init = newTestMatrix();
    const ref = new DOMMatrix([
      ...[8, -6, -3, -5],
      ...[-2, 7, -8, -5],
      ...[-9, -3, 7, 8],
      ...[-4, -3, 1, -10],
    ]);

    const expected = ref.inverse().multiply(init);

    const t = newTransform(init);
    expect(t.toString(ref)).toBe(expected.toString());

    // not modified
    expect(t).toBeCloseToArray(init);
  });
});

describe("toMatrix", () => {
  test("basic", () => {
    const init = newTestMatrix();
    const t = newTransform(init);
    const m = t.toMatrix();
    expect(m).toBeInstanceOf(DOMMatrixReadOnly);
    expect(m).toBeCloseToArray(init);
  });

  test("negate", () => {
    const init = newTestMatrix();
    const ref = new DOMMatrix([
      ...[8, -6, -3, -5],
      ...[-2, 7, -8, -5],
      ...[-9, -3, 7, 8],
      ...[-4, -3, 1, -10],
    ]);

    const expected = ref.inverse().multiply(init);

    const t = newTransform(init);
    const m = t.toMatrix(ref);
    expect(m).toBeCloseToArray(expected);

    // not modified
    expect(t).toBeCloseToArray(init);
  });

  test("modifying", () => {
    const init = newTestMatrix();
    const copy = new Float32Array(window.toArray(init));
    const t = newTransform(init);
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
    const t = newTransform(init);
    const m = t.toFloat32Array();
    expect(m).toBeInstanceOf(Float32Array);
    expect(m).toBeCloseToArray(init);
  });

  test("negate", () => {
    const init = newTestMatrix();
    const ref = new DOMMatrix([
      ...[8, -6, -3, -5],
      ...[-2, 7, -8, -5],
      ...[-9, -3, 7, 8],
      ...[-4, -3, 1, -10],
    ]);

    const expected = ref.inverse().multiply(init);

    const t = newTransform(init);
    const m = t.toFloat32Array(ref);
    expect(m).toBeCloseToArray(expected);

    // not modified
    expect(t).toBeCloseToArray(init);
  });

  test("modifying", () => {
    const init = newTestMatrix();
    const copy = new Float32Array(window.toArray(init));
    const t = newTransform(init);
    const m = t.toFloat32Array();
    m[4] *= 2;

    // not modified
    expect(init).toBeCloseToArray(copy);
    expect(t).toBeCloseToArray(init);
  });
});

describe("perspective", () => {
  test("basic", () => {
    const t = newTransform();
    expect(t.toPerspective()).toBeUndefined();
  });

  test("init + no handler", () => {
    const t = newTransform(undefined, 200);
    expect(t.toPerspective()).toBe(200);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe(200);
  });

  test("absolute: init + no handler", () => {
    const t = newAbsoluteTransform(undefined, 200);
    expect(t.toPerspective()).toBe(200);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBeUndefined();
  });

  test("init null", () => {
    const t = newTransform(undefined, null);
    expect(t.toPerspective()).toBeNull();
  });

  test("init number", () => {
    const t = newTransform(undefined, 200);
    expect(t.toPerspective()).toBe(200);
  });

  test("handler => null", () => {
    const t = newTransform().setPerspective(() => null);
    expect(t.toPerspective()).toBeUndefined();

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBeNull();
  });

  test("handler => number", () => {
    const t = newTransform().setPerspective(() => 200);
    expect(t.toPerspective()).toBeUndefined();

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe(200);
  });

  test("init null + handler => null", () => {
    const t = newTransform(undefined, null).setPerspective(() => null);
    expect(t.toPerspective()).toBeNull();

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBeNull();

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBeNull();
  });

  test("init number + handler => null", () => {
    const p = 200;
    const t = newTransform(undefined, p).setPerspective(() => null);
    expect(t.toPerspective()).toBe(p);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBeNull();

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBeNull();
  });

  test("init null + handler => number", () => {
    const p = 200;
    const t = newTransform(undefined, null).setPerspective(() => p);
    expect(t.toPerspective()).toBeNull();

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe(p);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe(p * 2);
  });

  test("init number + handler => number", () => {
    const pI = 100,
      p = 200;
    const t = newTransform(undefined, pI).setPerspective(() => p);
    expect(t.toPerspective()).toBe(pI);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe(pI + p);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe(pI + p * 2);
  });

  test("absolute: init null + handler => null", () => {
    const t = newAbsoluteTransform(undefined, null).setPerspective(() => null);
    expect(t.toPerspective()).toBeNull();

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBeNull();

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBeNull();
  });

  test("absolute: init number + handler => null", () => {
    const p = 200;
    const t = newAbsoluteTransform(undefined, p).setPerspective(() => null);
    expect(t.toPerspective()).toBe(p);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBeNull();

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBeNull();
  });

  test("absolute: init null + handler => number", () => {
    const p = 200;
    const t = newAbsoluteTransform(undefined, null).setPerspective(() => p);
    expect(t.toPerspective()).toBeNull();

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe(p);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe(p);
  });

  test("absolute: init number + handler => number", () => {
    const pI = 100,
      p = 200;
    const t = newAbsoluteTransform(undefined, pI).setPerspective(() => p);
    expect(t.toPerspective()).toBe(pI);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe(p);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe(p);
  });

  test("override handler", () => {
    const pA = 100,
      pB = 200;
    const t = newTransform();
    t.setPerspective(() => pA);
    t.setPerspective(() => pB);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe(pB);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe(pB * 2);
  });

  test("absolute: override handler", () => {
    const pA = 100,
      pB = 200;
    const t = newAbsoluteTransform();
    t.setPerspective(() => pA);
    t.setPerspective(() => pB);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe(pB);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe(pB);
  });

  test("override handler after apply", () => {
    const pA = 100,
      pB = 200;
    const t = newTransform();
    t.setPerspective(() => pA);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe(pA);

    t.setPerspective(() => pB);
    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe(pA + pB);

    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t.toPerspective()).toBe(pA + pB * 2);
  });
});

describe("translate", () => {
  test("apply", () => {
    const cbk = jest.fn(() => null);
    const t = newTransform();
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

    const t = newTransform();
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

    const t = newTransform();
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

    const t = newTransform();
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

    const t = newTransform();
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
    const t = newTransform();
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

    const t = newTransform();
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

    const t = newTransform();
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

    const t = newTransform();
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

    const t = newTransform();
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

    const t = newTransform();
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

    const t = newTransform();
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
    const t = newTransform();
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

    const t = newTransform();
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

    const t = newTransform();
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

    const t = newTransform();
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

    const t = newTransform();
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
    const t = newTransform();
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

    const t = newTransform();
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

    const t = newTransform();
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

    const t = newTransform();
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
    const expected = IDENTITY.rotateAxisAngle(1, 0, 0, degX)
      .rotateAxisAngle(0, 1, 0, degY)
      .rotateAxisAngle(0, 0, 1, degZ);
    const expected2 = new Float32Array([
      // double check mock implementation
      ...[0.92541652, 0.31879577, -0.20487411, 0],
      ...[-0.16317591, 0.82317292, 0.54383814, 0],
      ...[0.34202015, -0.4698463, 0.81379765, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = newTransform();
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
    const expected = IDENTITY.rotateAxisAngle(1, 2, 3, deg);
    const expected2 = new Float32Array([
      ...[0.87559502, 0.42003109, -0.2385524, 0],
      ...[-0.38175263, 0.90430386, 0.19104831, 0],
      ...[0.29597008, -0.07621294, 0.95215193, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = newTransform();
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

describe("multiple effects", () => {
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
    const expected = IDENTITY.translate(dx, dy, dz)
      .scale(sx, sy, sz)
      .rotateAxisAngle(...ra, r)
      .skewY(sk);

    const t = newTransform();
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
    const expected = IDENTITY.skewY(sk)
      .rotateAxisAngle(...ra, r)
      .scale(sx, sy, sz)
      .translate(dx, dy, dz);

    const t = newTransform();
    t.skew(() => ({ degY: sk }));
    t.rotate(() => ({ deg: r, axis: ra }));
    t.scale(() => ({ sx, sy, sz }));
    t.translate(() => ({ x: dx, y: dy, z: dz }));
    t.apply(DEFAULT_STATE, DEFAULT_CONTROLLER);
    expect(t).toBeCloseToArray(expected);
  });
});

describe("parallax depth", () => {
  const depthX = 4,
    depthY = 3,
    depthZ = 2;
  const controller = new FXController({ depthX, depthY, depthZ });

  test("translate", () => {
    const dx = 10,
      dy = 20,
      dz = 30;
    const expected = new Float32Array([
      ...[1, 0, 0, 0],
      ...[0, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[dx / depthX, dy / depthY, dz / depthZ, 1],
    ]);

    const t = newTransform();
    const cbk = jest.fn((d) => ({ x: d.x, y: d.y, z: d.z }));
    t.translate(cbk);

    const state = newState({
      x: { current: dx },
      y: { current: dy },
      z: { current: dz },
    });
    const params = getParameters(state, controller);

    t.apply(state, controller);

    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenNthCalledWith(
      1,
      {
        x: params.x / depthX,
        nx: params.nx,
        y: params.y / depthY,
        ny: params.ny,
        z: params.z / depthZ,
        nz: params.nz,
      },
      state,
      controller,
    );
    expect(t).toBeCloseToArray(expected);

    t.apply(
      newState({
        x: { current: -dx },
        y: { current: -dy },
        z: { current: -dz },
      }),
      controller,
    );
    expect(t).toBeCloseToArray(IDENTITY);
  });

  test("scale", () => {
    const sx = 10,
      sy = 20,
      sz = 30;
    const expected = new Float32Array([
      ...[sx, 0, 0, 0],
      ...[0, sy, 0, 0],
      ...[0, 0, sz, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = newTransform();
    const cbk = jest.fn((d) => ({ sx: d.x, sy: d.y, sz: d.z }));
    t.scale(cbk);

    const state = newState({
      x: { current: sx },
      y: { current: sy },
      z: { current: sz },
    });
    const params = getParameters(state, controller);

    t.apply(state, controller);

    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenNthCalledWith(
      1,
      params, // raw, unscaled
      state,
      controller,
    );
    expect(t).toBeCloseToArray(expected);

    t.apply(
      newState({
        x: { current: 1 / sx },
        y: { current: 1 / sy },
        z: { current: 1 / sz },
      }),
      controller,
    );
    expect(t).toBeCloseToArray(IDENTITY);
  });

  test("skew", () => {
    const deg = 30;
    const tan = Math.tan((deg * Math.PI) / 180);
    const deg2 = 15;
    const tan2 = Math.tan((deg2 * Math.PI) / 180);
    const expected = new Float32Array([
      ...[1 + tan * tan2, tan2, 0, 0],
      ...[tan, 1, 0, 0],
      ...[0, 0, 1, 0],
      ...[0, 0, 0, 1],
    ]);

    const t = newTransform();
    const cbk = jest.fn((d) => ({ degX: d.x, degY: d.y }));
    t.skew(cbk);

    const state = newState({
      x: { current: deg },
      y: { current: deg2 },
      z: { current: deg + deg2 },
    });
    const params = getParameters(state, controller);

    t.apply(state, controller);

    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenNthCalledWith(
      1,
      params, // raw, unscaled
      state,
      controller,
    );
    expect(t).toBeCloseToArray(expected);

    t.apply(newState({ y: { current: -deg2 } }), controller);
    t.apply(newState({ x: { current: -deg } }), controller);
    expect(t).toBeCloseToArray(IDENTITY);
  });

  test("rotate", () => {
    const deg = 30;
    const expected = IDENTITY.rotateAxisAngle(1, 2, 3, deg * depthY);

    const t = newTransform();
    const cbk = jest.fn((d) => ({ deg: d.y, axis: [1, 2, 3] }));
    t.rotate(cbk);

    const state = newState({
      x: { current: deg },
      y: { current: deg },
      z: { current: deg },
    });
    const params = getParameters(state, controller);

    t.apply(state, controller);

    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenNthCalledWith(
      1,
      {
        x: params.x * depthX,
        nx: params.nx,
        y: params.y * depthY,
        ny: params.ny,
        z: params.z * depthZ,
        nz: params.nz,
      },
      state,
      controller,
    );
    expect(t).toBeCloseToArray(expected);

    t.apply(
      newState({
        x: { current: -deg },
        y: { current: -deg },
        z: { current: -deg },
      }),
      controller,
    );
    expect(t).toBeCloseToArray(IDENTITY);
  });

  test("multiple effects", () => {
    const x = 10,
      y = 20,
      z = 30;

    const t = newTransform();
    const cbkTranslate = jest.fn((d) => ({ x: d.x, y: d.y, z: d.z }));
    const cbkScale = jest.fn((d) => ({ sx: d.x, sy: d.y, sz: d.z }));
    const cbkSkew = jest.fn((d) => ({ degX: d.x, degY: d.y }));
    const cbkRotate = jest.fn((d) => ({ deg: d.y }));
    t.translate(cbkTranslate);
    t.scale(cbkScale);
    t.rotate(cbkRotate);
    t.skew(cbkSkew);

    const state = newState({
      x: { current: x },
      y: { current: y },
      z: { current: z },
    });
    const params = getParameters(state, controller);

    t.apply(state, controller);

    expect(cbkTranslate).toHaveBeenCalledTimes(1);
    expect(cbkTranslate).toHaveBeenNthCalledWith(
      1,
      {
        x: params.x / depthX,
        nx: params.nx,
        y: params.y / depthY,
        ny: params.ny,
        z: params.z / depthZ,
        nz: params.nz,
      },
      state,
      controller,
    );

    expect(cbkScale).toHaveBeenCalledTimes(1);
    expect(cbkScale).toHaveBeenNthCalledWith(1, params, state, controller);

    expect(cbkRotate).toHaveBeenCalledTimes(1);
    expect(cbkRotate).toHaveBeenNthCalledWith(
      1,
      {
        x: params.x * depthX,
        nx: params.nx,
        y: params.y * depthY,
        ny: params.ny,
        z: params.z * depthZ,
        nz: params.nz,
      },
      state,
      controller,
    );

    expect(cbkSkew).toHaveBeenCalledTimes(1);
    expect(cbkSkew).toHaveBeenNthCalledWith(1, params, state, controller);
  });
});
