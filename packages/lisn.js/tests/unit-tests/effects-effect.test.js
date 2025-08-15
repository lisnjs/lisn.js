const { jest, describe, test, expect } = require("@jest/globals");

const { deepCopy, copyExistingKeys } = window.LISN.utils;
const { toParameters, scaleParameters, recalibrateState, FXController } =
  window.LISN.effects;

window.LISN.settings.effectLag = 0;

const DEFAULT_SCALER_FN = (v, d) => v / d;

const DEFAULT_CONTROLLER = new FXController();

const DEFAULT_STATE = {
  x: {
    min: 0,
    max: 0,
    initial: 0,
    previous: 0,
    current: 0,
    target: 0,
    lag: 0,
    depth: 1,
  },
  y: {
    min: 0,
    max: 0,
    initial: 0,
    previous: 0,
    current: 0,
    target: 0,
    lag: 0,
    depth: 1,
  },
  z: {
    min: 0,
    max: 0,
    initial: 0,
    previous: 0,
    current: 0,
    target: 0,
    lag: 0,
    depth: 1,
  },
};

const DUMMY_STATE = {
  x: {
    min: -1000,
    max: 1000,
    initial: 0,
    previous: 0,
    current: 0,
    target: 500,
    lag: 0,
    depth: 1,
  },
  y: {
    min: -100,
    max: 100,
    initial: 0,
    previous: 0,
    current: 0,
    target: 50,
    lag: 0,
    depth: 1,
  },
  z: {
    min: -10,
    max: 10,
    initial: 0,
    previous: 0,
    current: 0,
    target: 5,
    lag: 0,
    depth: 1,
  },
};

const DUMMY_CALIBRATION = {
  x: {
    min: -2000,
    max: 2000,
    target: 700,
  },
  y: {
    min: -200,
    max: 200,
    target: 50,
  },
  z: {
    min: -20,
    max: 20,
    target: 5,
  },
};

const newState = (partial = {}, source = DEFAULT_STATE) => {
  const result = deepCopy(source);
  copyExistingKeys(partial, result);
  return result;
};

describe("toParameters", () => {
  test("basic", () => {
    const x = 1000,
      y = 100,
      z = 10;

    const state = newState({
      x: {
        max: x * 2,
        current: x,
        target: x,
      },
      y: {
        max: y * 2,
        current: y,
        target: y,
      },
      z: {
        max: z * 2,
        current: z,
        target: z,
      },
    });

    const parameters = toParameters(state, DEFAULT_CONTROLLER);
    expect(parameters).toEqual({
      x,
      nx: 0.5,
      y,
      ny: 0.5,
      z,
      nz: 0.5,
    });

    // previous is 0 and min is 0, so the absolute parameters are the same
    expect(
      toParameters(state, DEFAULT_CONTROLLER, { isAbsolute: true }),
    ).toEqual(parameters);
  });

  test("with positive min", () => {
    const x = 1000,
      y = 100,
      z = 10;

    const state = newState({
      x: {
        min: x / 4,
        max: x * 2,
        initial: x / 4,
        previous: x / 4, // must be at least min
        current: x,
        target: x,
      },
      y: {
        min: y / 4,
        max: y * 2,
        initial: y / 4,
        previous: y / 4, // must be at least min
        current: y,
        target: y,
      },
      z: {
        min: z / 4,
        max: z * 2,
        initial: z / 4,
        previous: z / 4, // must be at least min
        current: z,
        target: z,
      },
    });

    // incremental
    expect(toParameters(state, DEFAULT_CONTROLLER)).toEqual({
      x: 0.75 * x,
      nx: 3 / 7, // curr nx - prev nx (which is 0)
      y: 0.75 * y,
      ny: 3 / 7,
      z: 0.75 * z,
      nz: 3 / 7,
    });

    expect(
      toParameters(state, DEFAULT_CONTROLLER, { isAbsolute: true }),
    ).toEqual({
      x: x,
      nx: 3 / 7, // (curr - min) / (max - min)
      y: y,
      ny: 3 / 7,
      z: z,
      nz: 3 / 7,
    });
  });

  test("with negative min", () => {
    const x = 1000,
      y = 100,
      z = 10;

    const state = newState({
      x: {
        min: -x * 2,
        max: x * 2,
        current: x,
        target: x,
      },
      y: {
        min: -y * 2,
        max: y * 2,
        current: y,
        target: y,
      },
      z: {
        min: -z * 2,
        max: z * 2,
        current: z,
        target: z,
      },
    });

    // incremental
    expect(toParameters(state, DEFAULT_CONTROLLER)).toEqual({
      x,
      nx: 0.25, // curr abs nx (which is 3 / 4) - prev abs nx (which is 1 / 2)
      y,
      ny: 0.25,
      z,
      nz: 0.25,
    });

    expect(
      toParameters(state, DEFAULT_CONTROLLER, { isAbsolute: true }),
    ).toEqual({
      x,
      nx: 0.75,
      y,
      ny: 0.75,
      z,
      nz: 0.75,
    });
  });

  test("with negative current", () => {
    const x = 1000,
      y = 100,
      z = 10;

    const state = newState({
      x: {
        min: -x * 2,
        max: x * 2,
        current: -x,
        target: x,
      },
      y: {
        min: -y * 2,
        max: y * 2,
        current: -y,
        target: y,
      },
      z: {
        min: -z * 2,
        max: z * 2,
        current: -z,
        target: z,
      },
    });

    // incremental
    expect(toParameters(state, DEFAULT_CONTROLLER)).toEqual({
      x: -x,
      nx: -0.25, // curr abs nx (which is 1 / 4) - prev abs nx (which is 1 / 2)
      y: -y,
      ny: -0.25,
      z: -z,
      nz: -0.25,
    });

    expect(
      toParameters(state, DEFAULT_CONTROLLER, { isAbsolute: true }),
    ).toEqual({
      x: -x,
      nx: 0.25,
      y: -y,
      ny: 0.25,
      z: -z,
      nz: 0.25,
    });
  });

  test("with previous", () => {
    const x = 1000,
      y = 100,
      z = 10;

    const state = newState({
      x: {
        max: x * 2,
        previous: x / 4,
        current: x,
        target: x,
      },
      y: {
        max: y * 2,
        previous: y / 4,
        current: y,
        target: y,
      },
      z: {
        max: z * 2,
        previous: z / 4,
        current: z,
        target: z,
      },
    });

    // incremental
    expect(toParameters(state, DEFAULT_CONTROLLER)).toEqual({
      x: 0.75 * x,
      nx: 0.5 - 1 / 8, // curr abs nx (which is 1 / 2) - prev abs nx (which is 1 / 8)
      y: 0.75 * y,
      ny: 0.5 - 1 / 8,
      z: 0.75 * z,
      nz: 0.5 - 1 / 8,
    });

    expect(
      toParameters(state, DEFAULT_CONTROLLER, { isAbsolute: true }),
    ).toEqual({
      x,
      nx: 0.5,
      y,
      ny: 0.5,
      z,
      nz: 0.5,
    });
  });

  test("invalid state", () => {
    const x = 1000,
      y = 100,
      z = 10;

    // validation is fully tested by recalibrateState, so only test here that
    // it's being passed through validation
    const state = {
      // incomplete
      x: {
        min: x,
        max: x * 2,
        previous: x * 4, // enforced to max of x * 2
        current: x / 2, // enforced to min of x
      },
      y: {
        min: 0,
        max: y / 2,
        previous: -y, // enforced to min of 0
        current: y, // enforced to max of y/2
      },
      z: {
        min: z / 2,
        max: z * 2,
        // missing current and previous: both enforced to min of z / 2
      },
    };

    // incremental
    expect(toParameters(state, DEFAULT_CONTROLLER)).toEqual({
      x: -x, // x - x * 2
      nx: -1, // curr abs nx (which is 0) - prev abs nx (which is 1)
      y: y / 2, // y / 2 - 0
      ny: 1, // curr abs ny (which is 1) - prev abs ny (which is 0)
      z: 0, // current and previous forced to z/2
      nz: 0,
    });

    expect(
      toParameters(state, DEFAULT_CONTROLLER, { isAbsolute: true }),
    ).toEqual({
      x,
      nx: 0,
      y: y / 2,
      ny: 1,
      z: z / 2,
      nz: 0,
    });
  });

  test("scalerFn", () => {
    const depthX = 2,
      depthY = 3,
      depthZ = 4;
    const controller = new FXController({ depthX, depthY, depthZ });
    const x = 10,
      y = 20,
      z = 30,
      max = 1000;

    const state = newState({
      x: {
        max,
        current: x,
      },
      y: {
        max,
        current: y,
      },
      z: {
        max,
        current: z,
      },
    });

    expect(
      toParameters(state, controller, {
        isAbsolute: true,
        scalerFn: DEFAULT_SCALER_FN,
      }),
    ).toEqual({
      x: x / depthX,
      nx: x / max,
      y: y / depthY,
      ny: y / max,
      z: z / depthZ,
      nz: z / max,
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
      scaleParameters(params, DEFAULT_CONTROLLER, DEFAULT_SCALER_FN),
    ).toEqual(params);
  });

  test("depth (single)", () => {
    const depth = 3;
    const controller = new FXController({ depth });
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

    expect(scaleParameters(params, controller, DEFAULT_SCALER_FN)).toEqual({
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
    const controller = new FXController({ depthX, depthY, depthZ });
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

    expect(scaleParameters(params, controller, DEFAULT_SCALER_FN)).toEqual({
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
    const controller = new FXController({ depth });
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

    scaleParameters(params, controller, DEFAULT_SCALER_FN);
    expect(params).toEqual(copy);
  });

  test("scalerFn input", () => {
    const scalerFn = jest.fn((v, d, a) =>
      a === "x" ? v / d : a === "y" ? v * d : v,
    );

    const depthX = 2,
      depthY = 3,
      depthZ = 4;
    const controller = new FXController({ depthX, depthY, depthZ });
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

    const result = scaleParameters(params, controller, scalerFn);
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

describe("recalibrateState: validate current", () => {
  const depthX = 2,
    depthY = 3,
    depthZ = 4;
  const controller = new FXController({ depthX, depthY, depthZ });
  const dummyState = newState(
    { x: { depth: depthX }, y: { depth: depthY }, z: { depth: depthZ } },
    DUMMY_STATE,
  );

  test("missing", () => {
    const thisDefaultState = newState(
      { x: { depth: depthX }, y: { depth: depthY }, z: { depth: depthZ } },
      DEFAULT_STATE,
    );
    expect(recalibrateState({}, controller)).toEqual(thisDefaultState);
    expect(recalibrateState({}, DEFAULT_CONTROLLER)).toEqual(DEFAULT_STATE);
  });

  for (const axis of ["x", "y", "z"]) {
    for (const prop of ["lag", "depth"]) {
      test(`${axis}: out of date ${prop}`, () => {
        const state = deepCopy(dummyState);
        const expected = deepCopy(state);

        state[axis][prop] = 1000;
        expect(recalibrateState(state, controller)).toEqual(expected);
      });
    }

    test(`${axis}: min > max`, () => {
      const state = deepCopy(dummyState);
      const expected = deepCopy(state);

      [state[axis].min, state[axis].max] = [state[axis].max, state[axis].min];
      expect(recalibrateState(state, controller)).toEqual(expected);
    });

    test(`${axis}: missing min`, () => {
      const state = deepCopy(dummyState);
      const expected = deepCopy(state);
      expected[axis].min = 0;

      delete state[axis].min;
      expect(recalibrateState(state, controller)).toEqual(expected);
    });

    test(`${axis}: invalid min`, () => {
      const state = deepCopy(dummyState);
      const expected = deepCopy(state);
      expected[axis].min = 0;

      state[axis].min = NaN;
      expect(recalibrateState(state, controller)).toEqual(expected);
    });

    test(`${axis}: missing max (min < 0)`, () => {
      const state = deepCopy(dummyState);
      state[axis].min = -100;

      const expected = deepCopy(state);
      expected[axis].max =
        expected[axis].initial =
        expected[axis].previous =
        expected[axis].current =
        expected[axis].target =
          0;

      delete state[axis].max;
      expect(recalibrateState(state, controller)).toEqual(expected);
    });

    test(`${axis}: invalid max (min < 0)`, () => {
      const state = deepCopy(dummyState);
      state[axis].min = -100;

      const expected = deepCopy(state);
      expected[axis].max =
        expected[axis].initial =
        expected[axis].previous =
        expected[axis].current =
        expected[axis].target =
          0;

      state[axis].max = NaN;
      expect(recalibrateState(state, controller)).toEqual(expected);
    });

    test(`${axis}: missing max (min > 0)`, () => {
      const min = 10000;
      const state = deepCopy(dummyState);
      state[axis].min = min;

      const expected = deepCopy(state);
      expected[axis].max =
        expected[axis].initial =
        expected[axis].previous =
        expected[axis].current =
        expected[axis].target =
          min;

      delete state[axis].max;
      expect(recalibrateState(state, controller)).toEqual(expected);
    });

    test(`${axis}: invalid max (min > 0)`, () => {
      const min = 10000;
      const state = deepCopy(dummyState);
      state[axis].min = min;

      const expected = deepCopy(state);
      expected[axis].max =
        expected[axis].initial =
        expected[axis].previous =
        expected[axis].current =
        expected[axis].target =
          min;

      state[axis].max = NaN;
      expect(recalibrateState(state, controller)).toEqual(expected);
    });

    for (const prop of ["initial", "previous", "current", "target"]) {
      test(`${axis}: ${prop} < min`, () => {
        const state = deepCopy(dummyState);
        const expected = deepCopy(state);
        expected[axis][prop] = expected[axis].min;

        state[axis][prop] = state[axis].min - 10;
        expect(recalibrateState(state, controller)).toEqual(expected);
      });

      test(`${axis}: ${prop} > max`, () => {
        const state = deepCopy(dummyState);
        const expected = deepCopy(state);
        expected[axis][prop] = expected[axis].max;

        state[axis][prop] = state[axis].max + 10;
        expect(recalibrateState(state, controller)).toEqual(expected);
      });

      test(`${axis}: missing ${prop}`, () => {
        const state = deepCopy(dummyState);
        const expected = deepCopy(state);
        expected[axis][prop] = expected[axis].min;

        delete state[axis][prop];
        expect(recalibrateState(state, controller)).toEqual(expected);
      });

      test(`${axis}: invalid ${prop}`, () => {
        const state = deepCopy(dummyState);
        const expected = deepCopy(state);
        expected[axis][prop] = expected[axis].min;

        state[axis][prop] = NaN;
        expect(recalibrateState(state, controller)).toEqual(expected);
      });
    }

    test(`${axis}: multiple invalid v1`, () => {
      const min = 100;
      const state = deepCopy(dummyState);
      state[axis].min = min;

      const expected = deepCopy(state);
      expected[axis].max = min;
      expected[axis].initial = min;
      expected[axis].previous = min;
      expected[axis].current = min;
      expected[axis].target = min;

      state[axis].max = NaN;
      delete state[axis].previous;
      state[axis].current = 0; // < min
      state[axis].target = min * 2; // > new max
      expect(recalibrateState(state, controller)).toEqual(expected);
    });

    test(`${axis}: multiple invalid v2`, () => {
      const max = 100;
      const state = deepCopy(dummyState);
      state[axis].max = max;

      const expected = deepCopy(state);
      expected[axis].min = 0;
      expected[axis].initial = 0;
      expected[axis].previous = 0;
      expected[axis].current = 0;
      expected[axis].target = max;

      state[axis].min = NaN;
      delete state[axis].previous;
      state[axis].current = -100; // < new min
      state[axis].target = max * 2; // > max
      expect(recalibrateState(state, controller)).toEqual(expected);
    });
  }
});

describe("recalibrateState: with calibration", () => {
  const depthX = 2,
    depthY = 3,
    depthZ = 4;
  const controller = new FXController({ depthX, depthY, depthZ });
  const dummyState = newState(
    { x: { depth: depthX }, y: { depth: depthY }, z: { depth: depthZ } },
    DUMMY_STATE,
  );

  test("missing", () => {
    expect(recalibrateState(dummyState, controller)).toEqual(dummyState);
  });

  test("basic", () => {
    const state = deepCopy(dummyState);
    const calibration = deepCopy(DUMMY_CALIBRATION);
    const expected = deepCopy(state);
    copyExistingKeys(calibration, expected);

    expect(recalibrateState(state, controller, calibration)).toEqual(expected);
  });

  test("not modifying input state", () => {
    const state = deepCopy(dummyState);
    const copy = deepCopy(dummyState);
    const calibration = deepCopy(DUMMY_CALIBRATION);
    const expected = deepCopy(state);
    copyExistingKeys(calibration, expected);

    expect(recalibrateState(state, controller, calibration)).toEqual(expected);
    expect(state).toEqual(copy);
  });

  test("not modifying input calibration", () => {
    const state = deepCopy(dummyState);
    const calibration = deepCopy(DUMMY_CALIBRATION);

    [calibration.x.min, calibration.x.max] = [
      calibration.x.max,
      calibration.x.min,
    ];

    delete calibration.y.min;
    calibration.y.target = NaN;
    delete calibration.z.target;

    const copy = deepCopy(calibration);
    recalibrateState(state, controller, calibration);
    expect(calibration).toEqual(copy);
  });

  for (const axis of ["x", "y", "z"]) {
    test(`${axis}: min > max`, () => {
      const state = deepCopy(dummyState);
      const calibration = deepCopy(DUMMY_CALIBRATION);
      const expected = deepCopy(state);
      copyExistingKeys(calibration, expected);

      [calibration[axis].min, calibration[axis].max] = [
        calibration[axis].max,
        calibration[axis].min,
      ];
      expect(recalibrateState(state, controller, calibration)).toEqual(
        expected,
      );
    });

    for (const prop of ["min", "max", "target"]) {
      test(`${axis}: missing ${prop}`, () => {
        const state = deepCopy(dummyState);

        const calibration = deepCopy(DUMMY_CALIBRATION);
        const expected = deepCopy(state);
        copyExistingKeys(calibration, expected);
        expected[axis][prop] = state[axis][prop]; // preserved

        delete calibration[axis][prop];
        expect(recalibrateState(state, controller, calibration)).toEqual(
          expected,
        );
      });

      test(`${axis}: invalid ${prop}`, () => {
        const state = deepCopy(dummyState);

        const calibration = deepCopy(DUMMY_CALIBRATION);
        const expected = deepCopy(state);
        copyExistingKeys(calibration, expected);
        expected[axis][prop] = state[axis][prop]; // preserved

        calibration[axis][prop] = NaN;
        expect(recalibrateState(state, controller, calibration)).toEqual(
          expected,
        );
      });
    }

    test(`${axis}: target < min`, () => {
      const state = deepCopy(dummyState);

      const calibration = deepCopy(DUMMY_CALIBRATION);
      const expected = deepCopy(state);
      copyExistingKeys(calibration, expected);
      expected[axis].target = expected[axis].min;

      calibration[axis].target = calibration[axis].min - 10;
      expect(recalibrateState(state, controller, calibration)).toEqual(
        expected,
      );
    });

    test(`${axis}: target > max`, () => {
      const state = deepCopy(dummyState);

      const calibration = deepCopy(DUMMY_CALIBRATION);
      const expected = deepCopy(state);
      copyExistingKeys(calibration, expected);
      expected[axis].target = expected[axis].max;

      calibration[axis].target = calibration[axis].max + 10;
      expect(recalibrateState(state, controller, calibration)).toEqual(
        expected,
      );
    });

    test(`${axis}: with other props => ignored`, () => {
      const state = deepCopy(dummyState);

      const calibration = deepCopy(DUMMY_CALIBRATION);
      const expected = deepCopy(state);
      copyExistingKeys(calibration, expected);

      calibration[axis].initial =
        calibration[axis].previous =
        calibration[axis].current =
          state[axis].max;

      calibration[axis].lag = 1000;
      calibration[axis].depth = 10;
      expect(recalibrateState(state, controller, calibration)).toEqual(
        expected,
      );
    });
  }
});
