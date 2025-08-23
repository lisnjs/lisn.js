const { jest, describe, test, expect } = require("@jest/globals");

const DEFAULT_LAG = 1000;
window.LISN.settings.effectLag = DEFAULT_LAG;

const { deepCopy, copyExistingKeysTo } = window.LISN._;
const { linearTweener } = window.LISN.utils;
const { FXComposer, FXTrigger, Transform } = window.LISN.effects;

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
    snap: false,
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
    snap: false,
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
    snap: false,
  },
};

const DUMMY_UPDATE = {
  x: {
    min: -2000,
    max: 2000,
    target: 700,
    snap: false,
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
    snap: false,
  },
};

// const newDummyTransform = (type) =>
//   class DummyTransform extends Transform {
//     type = type;
//
//     constructor(conf) {
//       super(conf);
//
//       const exportFn = this.export;
//       const toCompositionFn = this.toComposition;
//
//       this.export = (n) => {
//         const res = exportFn(n);
//         res.type = this.type;
//         return res;
//       };
//
//       this.toComposition = (...o) => {
//         const res = toCompositionFn(...o);
//         res.type = this.type;
//         return res;
//       };
//     }
//   };
//
// const EffectA = newDummyTransform("effect-a");
// const EffectB = newDummyTransform("effect-b");

const newState = (...partials) => {
  const result = deepCopy(DEFAULT_STATE);
  for (const partial of partials) {
    copyExistingKeysTo(partial, result);
  }
  return result;
};

const newTrigger = (executorBody) => {
  let push;
  const executor = jest.fn((p) => {
    push = p;
    if (executorBody) {
      executorBody(push);
    }
  });

  const trigger = new FXTrigger(executor);

  return { trigger, push };
};

describe("trigger", () => {
  test("basic lag = 0 + invalid update", async () => {
    const { trigger, push } = newTrigger();
    const composer = new FXComposer({ trigger, lag: 0 });

    await window.waitFor(50);
    expect(composer.getState()).toEqual(DEFAULT_STATE);

    push(DUMMY_UPDATE);
    await window.waitFor(50);
    const state = composer.getState();
    // The composer should have snapped current to target values because lag is
    // 0
    expect(state).toEqual(
      newState(DUMMY_UPDATE, {
        x: { current: DUMMY_UPDATE.x.target },
        y: { current: DUMMY_UPDATE.y.target },
        z: { current: DUMMY_UPDATE.z.target },
      }),
    );

    for (const invUpdate of [
      true,
      null,
      undefined,
      {},
      { x: { target: NaN } },
      { x: { target: "foo" } },
      { x: { current: 0, z: "foo" } },
    ]) {
      push(invUpdate);
      await window.waitFor(50);
      expect(composer.getState()).toEqual(state); // unchanged
    }
  });

  test("basic lag = default (1000)", async () => {
    const { trigger, push } = newTrigger();
    const composer = new FXComposer({ trigger, tweener: linearTweener });

    const expectedInitialState = newState({
      x: { lag: DEFAULT_LAG },
      y: { lag: DEFAULT_LAG },
      z: { lag: DEFAULT_LAG },
    });

    const expectedFinalState = newState(expectedInitialState, DUMMY_UPDATE, {
      x: { current: DUMMY_UPDATE.x.target },
      y: { current: DUMMY_UPDATE.y.target },
      z: { current: DUMMY_UPDATE.z.target },
    });

    await window.waitFor(50);
    expect(composer.getState()).toEqual(expectedInitialState);

    push(DUMMY_UPDATE);
    await window.waitFor(DEFAULT_LAG / 2);
    const state = composer.getState();

    // The composer should be tweening towards the final one
    for (const axis of ["x", "y", "z"]) {
      // mock animation frame takes approx 10ms
      const approxStep = (expectedFinalState[axis].target * 10) / DEFAULT_LAG;
      const approxNumSteps = DEFAULT_LAG / 10;

      for (const prop in expectedFinalState[axis]) {
        if (prop === "current") {
          expect(
            Math.abs(state[axis].current - expectedFinalState[axis].target / 2),
          ).toBeLessThan((approxNumSteps / 2) * approxStep * 0.3);
          // accept 30% variation in each step so far due to mock animation
          // frame using setTimeout
        } else if (prop === "previous") {
          expect(
            Math.abs(state[axis].previous + approxStep - state[axis].current),
          ).toBeLessThan(approxStep * 0.3);
        } else {
          expect(state[axis][prop]).toBe(expectedFinalState[axis][prop]);
        }
      }
    }

    await window.waitFor(50 + DEFAULT_LAG / 2);
    // The composer should have reached the final state
    const finalState = composer.getState();
    expect(finalState).not.toEqual(state); // returned was a deep copy

    for (const axis of ["x", "y", "z"]) {
      // mock animation frame takes approx 10ms
      const approxStep = (expectedFinalState[axis].target * 10) / DEFAULT_LAG;

      for (const prop in expectedFinalState[axis]) {
        if (prop === "previous") {
          expect(
            Math.abs(state[axis].previous + approxStep - state[axis].current),
          ).toBeLessThan(approxStep * 0.3);
        } else {
          expect(finalState[axis][prop]).toBe(expectedFinalState[axis][prop]);
        }
      }
    }
  });
});
