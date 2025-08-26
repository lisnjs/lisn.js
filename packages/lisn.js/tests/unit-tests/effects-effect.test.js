const { jest, describe, test, expect } = require("@jest/globals");

const { deepCopy, copyExistingKeysTo } = window.LISN._;
const { toParameters, scaleParameters, getUpdatedState, FXComposer } =
  window.LISN.effects;

window.LISN.settings.effectLag = 0;

const DEFAULT_SCALER_FN = (v, d) => v / d;

const DEFAULT_COMPOSER = new FXComposer();

const DEFAULT_STATE = {
  x: {
    low: 0,
    high: 0,
    initial: 0,
    previous: 0,
    current: 0,
    target: 0,
    lag: 0,
    depth: 1,
    snap: false,
  },
  y: {
    low: 0,
    high: 0,
    initial: 0,
    previous: 0,
    current: 0,
    target: 0,
    lag: 0,
    depth: 1,
    snap: false,
  },
  z: {
    low: 0,
    high: 0,
    initial: 0,
    previous: 0,
    current: 0,
    target: 0,
    lag: 0,
    depth: 1,
    snap: false,
  },
};

const DUMMY_STATE = {
  x: {
    low: -1000,
    high: 1000,
    initial: 50,
    previous: 100,
    current: 200,
    target: 500,
    lag: 0,
    depth: 1,
    snap: false,
  },
  y: {
    low: -100,
    high: 100,
    initial: 5,
    previous: 10,
    current: 20,
    target: 50,
    lag: 0,
    depth: 1,
    snap: false,
  },
  z: {
    low: -10,
    high: 10,
    initial: 1,
    previous: 2,
    current: 3,
    target: 5,
    lag: 0,
    depth: 1,
    snap: false,
  },
};

const DUMMY_UPDATE = {
  x: {
    low: -2000,
    high: 2000,
    target: 700,
    snap: true,
  },
  y: {
    low: -200,
    high: 200,
    target: 50,
  },
  z: {
    low: -20,
    high: 20,
    target: 5,
    snap: false,
  },
};

const newState = (partial = {}, source = DEFAULT_STATE) => {
  const result = deepCopy(source);
  copyExistingKeysTo(partial, result);
  return result;
};

describe("toParameters", () => {
  test("basic", () => {
    const x = 1000,
      y = 100,
      z = 10;

    const state = newState({
      x: {
        high: x * 2,
        current: x,
        target: x,
      },
      y: {
        high: y * 2,
        current: y,
        target: y,
      },
      z: {
        high: z * 2,
        current: z,
        target: z,
      },
    });

    const parameters = toParameters(state, DEFAULT_COMPOSER);
    expect(parameters).toEqual({
      x,
      nx: 0.5,
      y,
      ny: 0.5,
      z,
      nz: 0.5,
    });

    // previous is 0 and low is 0, so the absolute parameters are the same
    expect(toParameters(state, DEFAULT_COMPOSER, { isAbsolute: true })).toEqual(
      parameters,
    );
  });

  test("with positive low", () => {
    const x = 1000,
      y = 100,
      z = 10;

    const state = newState({
      x: {
        low: x / 4,
        high: x * 2,
        initial: x / 4,
        previous: x / 4,
        current: x,
        target: x,
      },
      y: {
        low: y / 4,
        high: y * 2,
        initial: y / 4,
        previous: y / 4,
        current: y,
        target: y,
      },
      z: {
        low: z / 4,
        high: z * 2,
        initial: z / 4,
        previous: z / 4,
        current: z,
        target: z,
      },
    });

    // incremental
    expect(toParameters(state, DEFAULT_COMPOSER)).toEqual({
      x: 0.75 * x,
      nx: 3 / 7, // curr nx - prev nx (which is 0)
      y: 0.75 * y,
      ny: 3 / 7,
      z: 0.75 * z,
      nz: 3 / 7,
    });

    expect(toParameters(state, DEFAULT_COMPOSER, { isAbsolute: true })).toEqual(
      {
        x: x,
        nx: 3 / 7, // (curr - low) / (high - low)
        y: y,
        ny: 3 / 7,
        z: z,
        nz: 3 / 7,
      },
    );
  });

  test("with negative low", () => {
    const x = 1000,
      y = 100,
      z = 10;

    const state = newState({
      x: {
        low: -x * 2,
        high: x * 2,
        current: x,
        target: x,
      },
      y: {
        low: -y * 2,
        high: y * 2,
        current: y,
        target: y,
      },
      z: {
        low: -z * 2,
        high: z * 2,
        current: z,
        target: z,
      },
    });

    // incremental
    expect(toParameters(state, DEFAULT_COMPOSER)).toEqual({
      x,
      nx: 0.25, // curr abs nx (which is 3 / 4) - prev abs nx (which is 1 / 2)
      y,
      ny: 0.25,
      z,
      nz: 0.25,
    });

    expect(toParameters(state, DEFAULT_COMPOSER, { isAbsolute: true })).toEqual(
      {
        x,
        nx: 0.75,
        y,
        ny: 0.75,
        z,
        nz: 0.75,
      },
    );
  });

  test("with negative current", () => {
    const x = 1000,
      y = 100,
      z = 10;

    const state = newState({
      x: {
        low: -x * 2,
        high: x * 2,
        current: -x,
        target: x,
      },
      y: {
        low: -y * 2,
        high: y * 2,
        current: -y,
        target: y,
      },
      z: {
        low: -z * 2,
        high: z * 2,
        current: -z,
        target: z,
      },
    });

    // incremental
    expect(toParameters(state, DEFAULT_COMPOSER)).toEqual({
      x: -x,
      nx: -0.25, // curr abs nx (which is 1 / 4) - prev abs nx (which is 1 / 2)
      y: -y,
      ny: -0.25,
      z: -z,
      nz: -0.25,
    });

    expect(toParameters(state, DEFAULT_COMPOSER, { isAbsolute: true })).toEqual(
      {
        x: -x,
        nx: 0.25,
        y: -y,
        ny: 0.25,
        z: -z,
        nz: 0.25,
      },
    );
  });

  test("with previous", () => {
    const x = 1000,
      y = 100,
      z = 10;

    const state = newState({
      x: {
        high: x * 2,
        previous: x / 4,
        current: x,
        target: x,
      },
      y: {
        high: y * 2,
        previous: y / 4,
        current: y,
        target: y,
      },
      z: {
        high: z * 2,
        previous: z / 4,
        current: z,
        target: z,
      },
    });

    // incremental
    expect(toParameters(state, DEFAULT_COMPOSER)).toEqual({
      x: 0.75 * x,
      nx: 0.5 - 1 / 8, // curr abs nx (which is 1 / 2) - prev abs nx (which is 1 / 8)
      y: 0.75 * y,
      ny: 0.5 - 1 / 8,
      z: 0.75 * z,
      nz: 0.5 - 1 / 8,
    });

    expect(toParameters(state, DEFAULT_COMPOSER, { isAbsolute: true })).toEqual(
      {
        x,
        nx: 0.5,
        y,
        ny: 0.5,
        z,
        nz: 0.5,
      },
    );
  });

  test("outside low/high", () => {
    const x = 1000,
      y = 100,
      z = 10;

    const state = newState({
      x: {
        low: x,
        high: 3 * x,
        initial: 0,
        previous: 0.25 * x, // < low
        current: 0.5 * x, // < low
        target: x, // must be >= low to avoid updating it
      },
      y: {
        low: 0,
        high: 0.5 * y,
        initial: y, // > high
        previous: 1.5 * y, // > high
        current: 2 * y, // > high
        target: 0, // must be <= high to avoid updating it
      },
      z: {
        low: 0,
        high: 0,
        initial: 0.25 * z,
        previous: 0.25 * z,
        current: z,
        target: 0, // avoid updating low/high
      },
    });

    // incremental
    expect(toParameters(state, DEFAULT_COMPOSER)).toEqual({
      x: 0.25 * x,
      nx: -0.25 + 0.75 / 2, // curr nx (which is -0.25) - prev nx (which is -0.75 / 2)
      y: 0.5 * y,
      ny: 4 - 3,
      z: 0.75 * z,
      nz: 1, // low === high
    });

    expect(toParameters(state, DEFAULT_COMPOSER, { isAbsolute: true })).toEqual(
      {
        x: 0.5 * x,
        nx: -0.25, // (curr - low) / (high - low)
        y: 2 * y,
        ny: 4,
        z: z,
        nz: 1, // low === high
      },
    );
  });

  test("invalid state", () => {
    const x = 1000,
      y = 100,
      z = 10;

    // validation is fully tested by getUpdatedState, so only test here that
    // it's being passed through validation
    const state = {
      // incomplete
      x: {
        low: x,
        high: 2 * x,
        previous: NaN, // set to low
        current: 1.5 * x,
      },
      y: {
        low: 0,
        high: y,
        initial: 0.2 * y,
        previous: 0.5 * y,
        current: Infinity, // set to initial
      },
      z: {
        low: 0.5 * z,
        high: 2 * z,
        // missing current and previous: both set to low
      },
    };

    // incremental
    expect(toParameters(state, DEFAULT_COMPOSER)).toEqual({
      x: 0.5 * x, // 1.5 * x - x
      nx: 0.5, // curr abs nx (which is 0.5) - prev abs nx (which is 0)
      y: (0.2 - 0.5) * y, // 0.25 * y - 0.5 * y / 2
      ny: 0.2 - 0.5,
      z: 0, // current and previous set to low
      nz: 0,
    });

    expect(toParameters(state, DEFAULT_COMPOSER, { isAbsolute: true })).toEqual(
      {
        x: 1.5 * x,
        nx: 0.5,
        y: 0.2 * y,
        ny: 0.2,
        z: 0.5 * z,
        nz: 0,
      },
    );
  });

  test("scalerFn", () => {
    const depthX = 2,
      depthY = 3,
      depthZ = 4;
    const composer = new FXComposer({ depthX, depthY, depthZ });
    const x = 10,
      y = 20,
      z = 30,
      high = 1000;

    const state = newState({
      x: {
        high,
        current: x,
      },
      y: {
        high,
        current: y,
      },
      z: {
        high,
        current: z,
      },
    });

    expect(
      toParameters(state, composer, {
        isAbsolute: true,
        scalerFn: DEFAULT_SCALER_FN,
      }),
    ).toEqual({
      x: x / depthX,
      nx: x / high,
      y: y / depthY,
      ny: y / high,
      z: z / depthZ,
      nz: z / high,
    });
  });
});

describe("scaleParameters", () => {
  test("depth 1", () => {
    const x = 10,
      y = 20,
      z = 30;
    const nx = 0.5,
      ny = 1,
      nz = 2;
    const params = {
      x,
      nx,
      y,
      ny,
      z,
      nz,
    };

    expect(
      scaleParameters(params, DEFAULT_COMPOSER, DEFAULT_SCALER_FN),
    ).toEqual(params);
  });

  test("depth (single)", () => {
    const depth = 3;
    const composer = new FXComposer({ depth });
    const x = 10,
      y = 20,
      z = 30;
    const nx = 0.5,
      ny = 1,
      nz = 2;
    const params = {
      x,
      nx,
      y,
      ny,
      z,
      nz,
    };

    expect(scaleParameters(params, composer, DEFAULT_SCALER_FN)).toEqual({
      x: x / depth,
      nx,
      y: y / depth,
      ny,
      z: z / depth,
      nz,
    });
  });

  test("depth XYZ", () => {
    const depthX = 2,
      depthY = 3,
      depthZ = 4;
    const composer = new FXComposer({ depthX, depthY, depthZ });
    const x = 10,
      y = 20,
      z = 30;
    const nx = 0.5,
      ny = 1,
      nz = 2;
    const params = {
      x,
      nx,
      y,
      ny,
      z,
      nz,
    };

    expect(scaleParameters(params, composer, DEFAULT_SCALER_FN)).toEqual({
      x: x / depthX,
      nx,
      y: y / depthY,
      ny,
      z: z / depthZ,
      nz,
    });
  });

  test("not modifying input params", () => {
    const depth = 3;
    const composer = new FXComposer({ depth });
    const x = 10,
      y = 20,
      z = 30;
    const nx = 0.5,
      ny = 1,
      nz = 2;
    const params = {
      x,
      nx,
      y,
      ny,
      z,
      nz,
    };
    const copy = deepCopy(params);

    scaleParameters(params, composer, DEFAULT_SCALER_FN);
    expect(params).toEqual(copy);
  });

  test("scalerFn input", () => {
    const scalerFn = jest.fn((v, d, a) =>
      a === "x" ? v / d : a === "y" ? v * d : v,
    );

    const depthX = 2,
      depthY = 3,
      depthZ = 4;
    const composer = new FXComposer({ depthX, depthY, depthZ });
    const x = 10,
      y = 20,
      z = 30;
    const nx = 0.5,
      ny = 1,
      nz = 2;
    const params = {
      x,
      nx,
      y,
      ny,
      z,
      nz,
    };

    const result = scaleParameters(params, composer, scalerFn);
    expect(scalerFn).toHaveBeenCalledTimes(3);
    expect(scalerFn).toHaveBeenCalledWith(x, depthX, "x");
    expect(scalerFn).toHaveBeenCalledWith(y, depthY, "y");
    expect(scalerFn).toHaveBeenCalledWith(z, depthZ, "z");

    expect(result).toEqual({
      x: x / depthX,
      nx,
      y: y * depthY,
      ny,
      z: z,
      nz,
    });
  });
});

describe("getUpdatedState: validate current", () => {
  const depthX = 2,
    depthY = 3,
    depthZ = 4;
  const composer = new FXComposer({ depthX, depthY, depthZ });
  const dummyState = newState(
    { x: { depth: depthX }, y: { depth: depthY }, z: { depth: depthZ } },
    DUMMY_STATE,
  );

  test("missing", () => {
    const thisDefaultState = newState(
      { x: { depth: depthX }, y: { depth: depthY }, z: { depth: depthZ } },
      DEFAULT_STATE,
    );
    expect(getUpdatedState(null, composer)).toEqual(thisDefaultState);
    expect(getUpdatedState(null, DEFAULT_COMPOSER)).toEqual(DEFAULT_STATE);
  });

  for (const axis of ["x", "y", "z"]) {
    for (const prop of ["lag", "depth"]) {
      test(`${axis}: out of date ${prop}`, () => {
        const state = deepCopy(dummyState);
        const expected = deepCopy(state);

        state[axis][prop] = 1000;
        expect(getUpdatedState(state, composer)).toEqual(expected);
      });
    }

    test(`${axis}: low > high`, () => {
      const state = deepCopy(dummyState);
      const expected = deepCopy(state);

      [state[axis].low, state[axis].high] = [state[axis].high, state[axis].low];
      expect(getUpdatedState(state, composer)).toEqual(expected);
    });

    // low/high --------------------
    for (const useInvalid of [true, false]) {
      test(`${axis}: ${useInvalid ? "invalid" : "missing"} low`, () => {
        const state = deepCopy(dummyState);
        const expected = deepCopy(state);
        expected[axis].low = 0;

        if (useInvalid) {
          state[axis].low = Infinity;
        } else {
          delete state[axis].low;
        }
        expect(getUpdatedState(state, composer)).toEqual(expected);
      });

      test(`${axis}: ${useInvalid ? "invalid" : "missing"} low (target === high < 0)`, () => {
        const val = -10000;
        const state = deepCopy(dummyState);
        state[axis].high = val;
        state[axis].target = val; // otherwise high will be set to target

        const expected = deepCopy(state);
        expected[axis].low = val; // swapped
        expected[axis].high = 0; // default low

        if (useInvalid) {
          state[axis].low = Infinity;
        } else {
          delete state[axis].low;
        }
        expect(getUpdatedState(state, composer)).toEqual(expected);
      });

      test(`${axis}: ${useInvalid ? "invalid" : "missing"} low (high < 0 < target)`, () => {
        const val = -10000;
        const state = deepCopy(dummyState);
        state[axis].high = val;

        const expected = deepCopy(state);
        expected[axis].low = val; // swapped
        expected[axis].high = expected[axis].target; // bumped up

        if (useInvalid) {
          state[axis].low = Infinity;
        } else {
          delete state[axis].low;
        }
        expect(getUpdatedState(state, composer)).toEqual(expected);
      });

      test(`${axis}: ${useInvalid ? "invalid" : "missing"} high (target === low < 0)`, () => {
        const state = deepCopy(dummyState);
        state[axis].target = state[axis].low; // otherwise high will be set to target

        const expected = deepCopy(state);
        expected[axis].high = 0;

        if (useInvalid) {
          state[axis].high = -Infinity;
        } else {
          delete state[axis].high;
        }
        expect(getUpdatedState(state, composer)).toEqual(expected);
      });

      test(`${axis}: ${useInvalid ? "invalid" : "missing"} high (target > 0 > low)`, () => {
        const state = deepCopy(dummyState);

        const expected = deepCopy(state);
        expected[axis].high = expected[axis].target;

        if (useInvalid) {
          state[axis].high = -Infinity;
        } else {
          delete state[axis].high;
        }
        expect(getUpdatedState(state, composer)).toEqual(expected);
      });

      test(`${axis}: ${useInvalid ? "invalid" : "missing"} high (low > target > 0)`, () => {
        const val = 10000;
        const state = deepCopy(dummyState);
        state[axis].low = val;
        state[axis].target = val - 100;

        const expected = deepCopy(state);
        expected[axis].high = val; // swapped first, so target doesn't bring down the initial value of low
        expected[axis].low = 0;

        if (useInvalid) {
          state[axis].high = -Infinity;
        } else {
          delete state[axis].high;
        }
        expect(getUpdatedState(state, composer)).toEqual(expected);
      });

      test(`${axis}: ${useInvalid ? "invalid" : "missing"} high (target > low > 0)`, () => {
        const val = 10000;
        const state = deepCopy(dummyState);
        state[axis].low = val;
        state[axis].target = val + 100;

        const expected = deepCopy(state);
        expected[axis].high = expected[axis].target; // bumped up
        expected[axis].low = 0; // default high

        if (useInvalid) {
          state[axis].high = -Infinity;
        } else {
          delete state[axis].high;
        }
        expect(getUpdatedState(state, composer)).toEqual(expected);
      });
    }

    // initial/prev/current/target --------------------
    for (const prop of ["initial", "previous", "current", "target"]) {
      test(`${axis}: ${prop} < low`, () => {
        const state = deepCopy(dummyState);
        state[axis][prop] = state[axis].low - 10;

        const expected = deepCopy(state);
        if (prop === "target") {
          expected[axis].low = expected[axis].target;
        }

        expect(getUpdatedState(state, composer)).toEqual(expected);
      });

      test(`${axis}: ${prop} > high`, () => {
        const state = deepCopy(dummyState);
        state[axis][prop] = state[axis].high + 10;

        const expected = deepCopy(state);
        if (prop === "target") {
          expected[axis].high = expected[axis].target;
        }

        expect(getUpdatedState(state, composer)).toEqual(expected);
      });

      for (const useInvalid of [true, false]) {
        test(`${axis}: ${useInvalid ? "invalid" : "missing"} ${prop}`, () => {
          const state = deepCopy(dummyState);
          const expected = deepCopy(state);

          let expectedVal;
          if (prop === "initial") {
            expectedVal = expected[axis].low;
          } else if (prop === "target") {
            expectedVal = expected[axis].current;
          } else {
            expectedVal = expected[axis].initial;
          }

          expected[axis][prop] = expectedVal;

          if (useInvalid) {
            state[axis][prop] = NaN;
          } else {
            delete state[axis][prop];
          }
          expect(getUpdatedState(state, composer)).toEqual(expected);
        });
      }
    }

    // snap --------------------
    for (const useInvalid of [true, false]) {
      test(`${axis}: ${useInvalid ? "invalid" : "missing"} snap`, () => {
        const state = deepCopy(dummyState);
        const expected = deepCopy(state);
        expected[axis].snap = false;

        if (useInvalid) {
          state[axis].snap = 1;
        } else {
          delete state[axis].snap;
        }
        expect(getUpdatedState(state, composer)).toEqual(expected);
      });
    }

    test(`${axis}: snap: true`, () => {
      const state = deepCopy(dummyState);
      state[axis].snap = true;

      expect(getUpdatedState(state, composer)).toEqual(state); // preserved
    });

    test(`${axis}: multiple invalid`, () => {
      const state = deepCopy(dummyState);
      const max = 10000;
      state[axis].low = max;
      state[axis].target = max * 2;

      const expected = deepCopy(state);
      expected[axis].high = expected[axis].target; // bumped from target
      expected[axis].low = 0; // default high applied, then swapped
      expected[axis].previous = expected[axis].initial;
      expected[axis].current = expected[axis].initial;
      expected[axis].snap = false;

      state[axis].high = NaN;
      delete state[axis].previous;
      state[axis].current = Infinity;
      state[axis].snap = 1;
      expect(getUpdatedState(state, composer)).toEqual(expected);
    });
  }
});

describe("getUpdatedState: with update data", () => {
  const depthX = 2,
    depthY = 3,
    depthZ = 4;
  const composer = new FXComposer({ depthX, depthY, depthZ });
  const dummyState = newState(
    { x: { depth: depthX }, y: { depth: depthY }, z: { depth: depthZ } },
    DUMMY_STATE,
  );

  test("missing", () => {
    expect(getUpdatedState(dummyState, composer)).toEqual(dummyState);
  });

  test("basic + ensure not modifying input", () => {
    const state = deepCopy(dummyState);
    const copy = deepCopy(state);

    const update = deepCopy(DUMMY_UPDATE);
    const copyU = deepCopy(update);

    const expected = deepCopy(state);
    copyExistingKeysTo(update, expected);

    expect(getUpdatedState(state, composer, update)).toEqual(expected);
    expect(state).toEqual(copy); // not modified
    expect(update).toEqual(copyU); // not modified
  });

  test("ensure not modifying input v2", () => {
    const state = deepCopy(dummyState);
    const copy = deepCopy(state);

    const update = deepCopy(DUMMY_UPDATE);

    [update.x.low, update.x.high] = [update.x.high, update.x.low];

    delete update.y.low;
    update.y.target = NaN;
    delete update.z.target;

    const copyU = deepCopy(update);
    getUpdatedState(state, composer, update);
    expect(state).toEqual(copy); // not modified
    expect(update).toEqual(copyU); // not modified
  });

  for (const axis of ["x", "y", "z"]) {
    test(`${axis}: low > high`, () => {
      const state = deepCopy(dummyState);
      const update = deepCopy(DUMMY_UPDATE);
      const expected = deepCopy(state);
      copyExistingKeysTo(update, expected);

      [update[axis].low, update[axis].high] = [
        update[axis].high,
        update[axis].low,
      ];
      expect(getUpdatedState(state, composer, update)).toEqual(expected);
    });

    for (const prop of ["low", "high", "target", "snap"]) {
      for (const useInvalid of [true, false]) {
        test(`${axis}: ${useInvalid ? "invalid" : "missing"} ${prop}`, () => {
          const state = deepCopy(dummyState);

          const update = deepCopy(DUMMY_UPDATE);
          const expected = deepCopy(state);
          copyExistingKeysTo(update, expected);
          expected[axis][prop] = state[axis][prop]; // preserved from state

          if (useInvalid) {
            update[axis][prop] = prop === "snap" ? 0 : NaN;
          } else {
            delete update[axis][prop];
          }
          expect(getUpdatedState(state, composer, update)).toEqual(expected);
        });
      }
    }

    test(`${axis}: target < low`, () => {
      const state = deepCopy(dummyState);

      const update = deepCopy(DUMMY_UPDATE);
      update[axis].target = update[axis].low - 10;

      const expected = deepCopy(state);
      copyExistingKeysTo(update, expected);
      expected[axis].low = expected[axis].target;

      expect(getUpdatedState(state, composer, update)).toEqual(expected);
    });

    test(`${axis}: target > high`, () => {
      const state = deepCopy(dummyState);

      const update = deepCopy(DUMMY_UPDATE);
      update[axis].target = update[axis].high + 10;

      const expected = deepCopy(state);
      copyExistingKeysTo(update, expected);
      expected[axis].high = expected[axis].target;

      expect(getUpdatedState(state, composer, update)).toEqual(expected);
    });

    test(`${axis}: with other props => ignored`, () => {
      const state = deepCopy(dummyState);

      const update = deepCopy(DUMMY_UPDATE);
      const expected = deepCopy(state);
      copyExistingKeysTo(update, expected);

      update[axis].initial =
        update[axis].previous =
        update[axis].current =
          state[axis].low;

      update[axis].lag = 1000;
      update[axis].depth = 10;
      expect(getUpdatedState(state, composer, update)).toEqual(expected);
    });

    test(`${axis}: input snap: true and missing update for axis v1`, () => {
      const state = deepCopy(dummyState);
      state[axis].snap = true;

      const update = null;
      expect(getUpdatedState(state, composer, update)).toEqual(state); // preserved
    });

    test(`${axis}: input snap: true and missing update for axis v2`, () => {
      const state = deepCopy(dummyState);
      state[axis].snap = true;

      const update = {};
      expect(getUpdatedState(state, composer, update)).toEqual(state); // preserved
    });

    test(`${axis}: input snap: true and present update for axis`, () => {
      const state = deepCopy(dummyState);
      state[axis].snap = true;

      const expected = deepCopy(state);
      expected[axis].snap = false;

      const update = { [axis]: {} };
      expect(getUpdatedState(state, composer, update)).toEqual(expected); // reset to false
    });
  }
});
