const { jest, describe, test, expect } = require("@jest/globals");

const DEFAULT_LAG = 400;
window.LISN.settings.effectLag = DEFAULT_LAG;

const { Callback } = window.LISN.modules;
const { deepCopy } = window.LISN._;
const { linearTweener } = window.LISN.utils;
const { FXComposer, FXTrigger, FXScrollTrigger, FXMatcher, FXPin } =
  window.LISN.effects;

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

const DUMMY_UPDATE2 = {
  x: {
    min: -1500,
    max: 1500,
    target: 600,
    snap: false,
  },
  y: {
    min: -180,
    max: 180,
    target: 60,
  },
  z: {
    min: -10,
    max: 10,
    target: 7,
    snap: false,
  },
};

const PARTIAL_UPDATE = {
  x: {
    max: 5000,
  },
};

class DummyEffect {
  type = "effect";

  isAbsolute() {
    return false;
  }

  constructor(state) {
    const invertOn = (negate) => {
      const s = deepCopy(state);
      const ns = negate?.getState() ?? {};
      for (const p in ns) {
        s[p] = (s[p] ?? 0) - ns[p];
      }
      return s;
    };

    const joinWith = (others) => {
      const s = deepCopy(state);
      for (const o of others) {
        const os = o.getState();
        for (const p in os) {
          s[p] = (s[p] ?? 0) + os[p];
        }
      }
      return s;
    };

    this.getState = () => deepCopy(state);

    this.update = jest.fn((fx) => {
      for (const p in state) {
        state[p] = fx.x.current;
      }
      return this;
    });

    this.export = jest.fn((negate) => new this.constructor(invertOn(negate)));

    this.toComposition = jest.fn(
      (...others) => new this.constructor(joinWith(others)),
    );

    this.toCss = jest.fn((negate) => invertOn(negate));
  }
}

class DummyEffectA extends DummyEffect {
  type = "effect-a";
}

class DummyEffectB extends DummyEffect {
  type = "effect-b";
}

class DummyEffectC extends DummyEffect {
  type = "effect-c";
}

class DummyEffectD extends DummyEffect {
  type = "effect-d";
}

const newState = (...partials) => {
  const result = deepCopy(DEFAULT_STATE);
  for (const partial of partials) {
    for (const a in partial) {
      for (const p in partial[a]) {
        result[a][p] = partial[a][p];
      }
    }
  }
  return result;
};

const newUpdate = (base, ...rest) => {
  const result = deepCopy(base);
  for (const update of rest) {
    for (const a in update) {
      for (const p in update[a]) {
        result[a][p] = update[a][p];
      }
    }
  }
  return result;
};

const newPin = () => {
  let store;
  const executor = jest.fn((s) => {
    store = s;
  });

  const matcher = new FXMatcher(executor);
  const pin = new FXPin();
  pin.while(matcher);

  return { pin, setPinState: store.setState };
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

const newComposer = ({
  triggerBody,
  lag,
  tweener = linearTweener,
  ...rest
} = {}) => {
  const { trigger, push } = newTrigger(triggerBody);
  const effectiveLag = lag ?? DEFAULT_LAG;
  const composer = new FXComposer({ trigger, lag, tweener, ...rest });
  return { push, lag: effectiveLag, composer };
};

describe("getConfig", () => {
  test("all default", () => {
    const composer = new FXComposer();
    const trigger = composer.getConfig().trigger;
    expect(trigger).not.toBeUndefined();
    expect(trigger).toBeInstanceOf(FXScrollTrigger);

    expect(composer.getConfig()).toEqual({
      trigger,
      parent: undefined,
      negate: undefined,
      tweener: "spring",
      lagX: DEFAULT_LAG,
      lagY: DEFAULT_LAG,
      lagZ: DEFAULT_LAG,
      depthX: 1,
      depthY: 1,
      depthZ: 1,
    });
  });

  test("all custom", () => {
    const parent = new FXComposer();
    const negate = new FXComposer();
    const lag = 100;
    const depthX = 2;

    const { trigger } = newTrigger();
    const composer = new FXComposer({
      parent,
      negate,
      lag,
      depthX,
      trigger,
      tweener: linearTweener,
    });

    expect(composer.getConfig()).toEqual({
      trigger,
      parent,
      negate,
      tweener: linearTweener,
      lagX: lag,
      lagY: lag,
      lagZ: lag,
      depthX,
      depthY: 1,
      depthZ: 1,
    });
  });
});

describe("trigger / tween", () => {
  test("basic: lag = 0 + invalid update", async () => {
    const { push, composer } = newComposer({ lag: 0 });

    await window.waitFor(50);
    expect(composer.getState()).toEqual(DEFAULT_STATE);

    push(DUMMY_UPDATE);
    await window.waitFor(50);
    const state = composer.getState();
    // The composer should have snapped current to target values because lag is
    // 0. Initial and previous left at 0.
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

    // partial update
    push(PARTIAL_UPDATE);
    await window.waitFor(50);

    const state2 = composer.getState();
    expect(state2).toEqual(
      newState(state, PARTIAL_UPDATE, {
        // It would have tweened, but target is unchanged, so initial/previous
        // are at also at target (previous current).
        x: {
          initial: state.x.target,
          previous: state.x.target,
        },
        y: {
          initial: state.y.target,
          previous: state.y.target,
        },
        z: {
          initial: state.z.target,
          previous: state.z.target,
        },
      }),
    );

    // full new update
    push(DUMMY_UPDATE2);
    await window.waitFor(50);

    expect(composer.getState()).toEqual(
      newState(state2, DUMMY_UPDATE2, {
        x: { current: DUMMY_UPDATE2.x.target },
        y: { current: DUMMY_UPDATE2.y.target },
        z: { current: DUMMY_UPDATE2.z.target },
      }),
    );
  });

  for (const lag of [undefined, 200]) {
    test(`tween: lag = ${lag === undefined ? "default (${DEFAULT_LAG})" : lag}`, async () => {
      const { lag, push, composer } = newComposer();

      const expectedInitialState = newState({
        x: { lag },
        y: { lag },
        z: { lag },
      });

      const expectedFinalState = newState(expectedInitialState, DUMMY_UPDATE, {
        x: { current: DUMMY_UPDATE.x.target },
        y: { current: DUMMY_UPDATE.y.target },
        z: { current: DUMMY_UPDATE.z.target },
      });

      await window.waitFor(50);
      expect(composer.getState()).toEqual(expectedInitialState);

      push(DUMMY_UPDATE);
      await window.waitFor(lag / 2);
      const state = composer.getState();

      // Should be tweening towards the final one
      for (const axis of ["x", "y", "z"]) {
        const expectedProgress = 0.5; // we waited lag / 2
        // mock animation frame takes approx 10ms
        const approxNumSteps = (expectedProgress * lag) / 10;
        const approxStep =
          ((expectedFinalState[axis].target -
            expectedFinalState[axis].initial) *
            10) /
          lag;

        for (const prop in expectedFinalState[axis]) {
          if (prop === "current") {
            expect(
              Math.abs(
                state[axis].current -
                  expectedProgress * expectedFinalState[axis].target,
              ),
            ).toBeLessThan(approxNumSteps * approxStep * 0.3);
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

      await window.waitFor(lag / 2 + 50);
      // Should have reached the final state
      const finalState = composer.getState();
      expect(finalState).not.toEqual(state); // returned was a deep copy

      for (const axis of ["x", "y", "z"]) {
        // mock animation frame takes approx 10ms
        const approxStep =
          ((expectedFinalState[axis].target -
            expectedFinalState[axis].initial) *
            10) /
          lag;

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
  }

  test("tween: per-axis lag", async () => {
    const { push, composer } = newComposer();
    const lagX = 0,
      lagY = 300,
      lagZ = 400;

    composer.setLag({ lagX, lagY, lagZ });
    expect(composer.getConfig().lagX).toBe(lagX);
    expect(composer.getConfig().lagY).toBe(lagY);
    expect(composer.getConfig().lagZ).toBe(lagZ);

    const expectedInitialState = newState({
      x: { lag: lagX },
      y: { lag: lagY },
      z: { lag: lagZ },
    });

    const expectedFinalState = newState(expectedInitialState, DUMMY_UPDATE, {
      x: { current: DUMMY_UPDATE.x.target },
      y: { current: DUMMY_UPDATE.y.target },
      z: { current: DUMMY_UPDATE.z.target },
    });

    await window.waitFor(50);
    expect(composer.getState()).toEqual(expectedInitialState);

    push(DUMMY_UPDATE);
    const delay = lagZ / 2;
    await window.waitFor(delay);
    const state = composer.getState();

    // Should have snapped x
    expect(state.x.current).toBe(state.x.target);
    expect(state.x.previous).toBe(state.x.initial);

    // Should be tweening towards the final one
    for (const axis of ["y", "z"]) {
      const lag = expectedFinalState[axis].lag;
      const expectedProgress = delay / lag;
      // mock animation frame takes approx 10ms
      const approxNumSteps = (expectedProgress * lag) / 10;
      const approxStep =
        ((expectedFinalState[axis].target - expectedFinalState[axis].initial) *
          10) /
        lag;

      for (const prop in expectedFinalState[axis]) {
        if (prop === "current") {
          expect(
            Math.abs(
              state[axis].current -
                expectedProgress * expectedFinalState[axis].target,
            ),
          ).toBeLessThan(approxNumSteps * approxStep * 0.3);
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

    await window.waitFor(Math.max(lagY, lagZ) - delay + 50);
    // Should have reached the final state
    const finalState = composer.getState();
    expect(finalState).not.toEqual(state); // returned was a deep copy

    for (const axis of ["x", "y", "z"]) {
      const lag = expectedFinalState[axis].lag;
      // mock animation frame takes approx 10ms
      const approxStep =
        (expectedFinalState[axis].target - expectedFinalState[axis].initial) *
        (lag ? 10 / lag : 1);

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

  for (const snap of [true, false]) {
    for (const trySetLagInUpdate of [true, false]) {
      for (const lag of [0, 200]) {
        test(`onTrigger/offTrigger & onTween/offTween; lag = ${lag}${trySetLagInUpdate ? " try in update" : ""}; snap = ${snap}`, async () => {
          // use non-0 lag to ensure callback only called once and not on tween
          const { push, composer } = newComposer(
            trySetLagInUpdate ? {} : { lag },
          );
          // composer does not accept lag updates via trigger data; only via
          // setLag, so it should use its default lag
          const expectedLag = trySetLagInUpdate ? DEFAULT_LAG : lag;
          const effectiveLag = snap ? 0 : expectedLag;

          const update = newUpdate(DUMMY_UPDATE, {
            x: { snap, lag: trySetLagInUpdate ? lag : undefined },
            y: { snap, lag: trySetLagInUpdate ? lag : undefined },
            z: { snap, lag: trySetLagInUpdate ? lag : undefined },
          });
          const update2 = newUpdate(DUMMY_UPDATE2, {
            x: { snap, lag: trySetLagInUpdate ? lag : undefined },
            y: { snap, lag: trySetLagInUpdate ? lag : undefined },
            z: { snap, lag: trySetLagInUpdate ? lag : undefined },
          });

          const expectedInitialState = newState(update, {
            // after trigger, before tween
            x: { lag: trySetLagInUpdate ? DEFAULT_LAG : lag },
            y: { lag: trySetLagInUpdate ? DEFAULT_LAG : lag },
            z: { lag: trySetLagInUpdate ? DEFAULT_LAG : lag },
          });

          const triggerCbk = jest.fn();
          const tweenCbk = jest.fn();

          composer.onTrigger(triggerCbk);
          composer.onTween(tweenCbk);
          push(update);

          await window.waitFor(effectiveLag + 50);
          expect(composer.getConfig().lagX).toBe(expectedLag);
          expect(composer.getConfig().lagY).toBe(expectedLag);
          expect(composer.getConfig().lagZ).toBe(expectedLag);

          expect(triggerCbk).toHaveBeenCalledTimes(1);
          expect(triggerCbk).toHaveBeenCalledWith(
            // min/max updated, but current is still at 0
            expectedInitialState,
            composer,
          );

          // exactly 2 if effectiveLag is 0
          const approxTweenNCallsPerTrigger = effectiveLag
            ? 1 + effectiveLag / 10
            : 2;
          let lastTweenNCalls = tweenCbk.mock.calls.length;
          expect(lastTweenNCalls).toBeGreaterThanOrEqual(
            // i.e. > 1 if effectiveLag is 0
            0.8 * approxTweenNCallsPerTrigger,
          );
          expect(lastTweenNCalls).toBeLessThanOrEqual(
            // i.e. <= 2 if effectiveLag is 0
            1.2 * approxTweenNCallsPerTrigger,
          );
          const state = composer.getState();

          if (effectiveLag > 0) {
            expect(state.x.previous).toBeGreaterThan(0);
            expect(state.y.previous).toBeGreaterThan(0);
            expect(state.z.previous).toBeGreaterThan(0);
          } else {
            expect(state.x.previous).toBe(0);
            expect(state.y.previous).toBe(0);
            expect(state.z.previous).toBe(0);
          }

          expect(tweenCbk).toHaveBeenNthCalledWith(
            1,
            expectedInitialState,
            composer,
          );
          expect(tweenCbk).toHaveBeenLastCalledWith(
            // final tween
            newState(expectedInitialState, {
              x: {
                current: expectedInitialState.x.target,
                previous: state.x.previous,
                lag: expectedLag,
                snap,
              },
              y: {
                current: expectedInitialState.y.target,
                previous: state.y.previous,
                lag: expectedLag,
                snap,
              },
              z: {
                current: expectedInitialState.z.target,
                previous: state.z.previous,
                lag: expectedLag,
                snap,
              },
            }),
            composer,
          );

          // ----------

          push(update); // no-op as the state hasn't changed

          await window.waitFor(effectiveLag + 50);
          // no new calls
          expect(triggerCbk).toHaveBeenCalledTimes(1);
          expect(tweenCbk).toHaveBeenCalledTimes(lastTweenNCalls);

          push(update2);

          await window.waitFor(effectiveLag + 50);
          expect(triggerCbk).toHaveBeenCalledTimes(2);

          expect(tweenCbk.mock.calls.length).toBeGreaterThanOrEqual(
            lastTweenNCalls + 0.8 * approxTweenNCallsPerTrigger,
          );
          expect(tweenCbk.mock.calls.length).toBeLessThanOrEqual(
            lastTweenNCalls + 1.2 * approxTweenNCallsPerTrigger,
          );
          lastTweenNCalls = tweenCbk.mock.calls.length;

          push(update);

          await window.waitFor(effectiveLag + 50);
          expect(triggerCbk).toHaveBeenCalledTimes(3);
          expect(tweenCbk.mock.calls.length).toBeGreaterThanOrEqual(
            lastTweenNCalls + 0.8 * approxTweenNCallsPerTrigger,
          );
          expect(tweenCbk.mock.calls.length).toBeLessThanOrEqual(
            lastTweenNCalls + 1.2 * approxTweenNCallsPerTrigger,
          );
          lastTweenNCalls = tweenCbk.mock.calls.length;

          composer.offTrigger(triggerCbk);
          composer.offTween(tweenCbk);
          push(update2);

          await window.waitFor(effectiveLag + 50);
          // no new calls
          expect(triggerCbk).toHaveBeenCalledTimes(3);
          expect(tweenCbk.mock.calls.length).toBe(lastTweenNCalls);
        });
      }
    }
  }

  test("onTrigger/offTrigger & onTween/offTween: callback.remove", async () => {
    // use non-0 lag to ensure callback only called once and not on tween
    const { lag, push, composer } = newComposer({ lag: 200 });

    const triggerCbkJ = jest.fn();
    const triggerCbk = Callback.wrap(triggerCbkJ);

    const tweenCbkJ = jest.fn();
    const tweenCbk = Callback.wrap(tweenCbkJ);

    composer.onTrigger(triggerCbk);
    composer.onTween(tweenCbk);

    triggerCbk.remove();
    tweenCbk.remove();

    push(DUMMY_UPDATE);

    await window.waitFor(lag + 50);
    expect(triggerCbkJ).toHaveBeenCalledTimes(0);
    expect(tweenCbkJ).toHaveBeenCalledTimes(0);
  });

  test("onTrigger/offTrigger & onTween/offTween: return Callback.REMOVE", async () => {
    // use non-0 lag to ensure callback only called once and not on tween
    const { lag, push, composer } = newComposer({ lag: 200 });

    const triggerCbk = jest.fn(() => Callback.REMOVE);
    const tweenCbk = jest.fn(() => Callback.REMOVE);

    composer.onTrigger(triggerCbk);
    composer.onTween(tweenCbk);

    push(DUMMY_UPDATE);
    await window.waitFor(lag + 50);

    expect(triggerCbk).toHaveBeenCalledTimes(1); // removed now
    expect(tweenCbk).toHaveBeenCalledTimes(1); // removed now

    push(DUMMY_UPDATE2);
    await window.waitFor(lag + 50);

    push(DUMMY_UPDATE);
    await window.waitFor(lag + 50);

    // no new calls
    expect(triggerCbk).toHaveBeenCalledTimes(1);
    expect(tweenCbk).toHaveBeenCalledTimes(1);
  });
});

describe("setLag", () => {
  test("during tween: set all lag to 0", async () => {
    const { lag, push, composer } = newComposer();
    expect(lag).toBe(DEFAULT_LAG);

    // check default
    expect(composer.getConfig().lagX).toBe(lag);
    expect(composer.getConfig().lagY).toBe(lag);
    expect(composer.getConfig().lagZ).toBe(lag);

    expect(composer.getState().x.lag).toBe(lag);
    expect(composer.getState().y.lag).toBe(lag);
    expect(composer.getState().z.lag).toBe(lag);

    push(DUMMY_UPDATE);
    await window.waitFor(lag / 2);
    let state = composer.getState();
    expect(state.x.current).toBeLessThan(state.x.target * 0.6);
    expect(state.y.current).toBeLessThan(state.y.target * 0.6);
    expect(state.z.current).toBeLessThan(state.z.target * 0.6);

    composer.setLag(0);
    expect(composer.getConfig().lagX).toBe(0);
    expect(composer.getConfig().lagY).toBe(0);
    expect(composer.getConfig().lagZ).toBe(0);

    expect(composer.getState().x.lag).toBe(0);
    expect(composer.getState().y.lag).toBe(0);
    expect(composer.getState().z.lag).toBe(0);

    await window.waitFor(50);
    state = composer.getState();
    expect(state.x.current).toBe(state.x.target);
    expect(state.y.current).toBe(state.y.target);
    expect(state.z.current).toBe(state.z.target);
  });

  test("set all lag to same value (> 0) + ensure it does not trigger tween", async () => {
    const { composer } = newComposer();

    const triggerCbk = jest.fn();
    const tweenCbk = jest.fn();

    composer.onTrigger(triggerCbk);
    composer.onTween(tweenCbk);

    const lag = 100;
    composer.setLag(lag);
    expect(composer.getConfig().lagX).toBe(lag);
    expect(composer.getConfig().lagY).toBe(lag);
    expect(composer.getConfig().lagZ).toBe(lag);

    expect(composer.getState().x.lag).toBe(lag);
    expect(composer.getState().y.lag).toBe(lag);
    expect(composer.getState().z.lag).toBe(lag);

    await window.waitFor(50);
    expect(triggerCbk).toHaveBeenCalledTimes(0);
    expect(tweenCbk).toHaveBeenCalledTimes(0);
  });

  test("set all lag to negative", () => {
    const { composer } = newComposer();

    const minLag = 0;
    composer.setLag(-1);
    expect(composer.getConfig().lagX).toBe(minLag);
    expect(composer.getConfig().lagY).toBe(minLag);
    expect(composer.getConfig().lagZ).toBe(minLag);

    expect(composer.getState().x.lag).toBe(minLag);
    expect(composer.getState().y.lag).toBe(minLag);
    expect(composer.getState().z.lag).toBe(minLag);
  });

  test("set all lag to invalid", () => {
    const { lag, composer } = newComposer({ lag: 1000 });

    for (const invalid of [NaN, Infinity, null]) {
      composer.setLag(invalid);

      // preserved old
      expect(composer.getConfig().lagX).toBe(lag);
      expect(composer.getConfig().lagY).toBe(lag);
      expect(composer.getConfig().lagZ).toBe(lag);

      expect(composer.getState().x.lag).toBe(lag);
      expect(composer.getState().y.lag).toBe(lag);
      expect(composer.getState().z.lag).toBe(lag);
    }
  });

  test("set default lag to one value + lagZ to another", () => {
    const { composer } = newComposer();

    const lag = 100,
      lagZ = 200;
    composer.setLag({ lag, lagZ });
    expect(composer.getConfig().lagX).toBe(lag);
    expect(composer.getConfig().lagY).toBe(lag);
    expect(composer.getConfig().lagZ).toBe(lagZ);

    expect(composer.getState().x.lag).toBe(lag);
    expect(composer.getState().y.lag).toBe(lag);
    expect(composer.getState().z.lag).toBe(lagZ);
  });

  for (const includeDefault of [true, false]) {
    test(`all different (${includeDefault ? "" : "not "}including default)`, () => {
      const { composer } = newComposer();

      const lagX = 0,
        lagY = 100,
        lagZ = 200;
      composer.setLag({
        lag: includeDefault ? 500 : undefined,
        lagX,
        lagY,
        lagZ,
      });
      expect(composer.getConfig().lagX).toBe(lagX);
      expect(composer.getConfig().lagY).toBe(lagY);
      expect(composer.getConfig().lagZ).toBe(lagZ);

      expect(composer.getState().x.lag).toBe(lagX);
      expect(composer.getState().y.lag).toBe(lagY);
      expect(composer.getState().z.lag).toBe(lagZ);
    });
  }
});

describe("setDepth", () => {
  test("set all depth to same value + ensure it triggers tween", async () => {
    const { composer } = newComposer();

    // check default
    expect(composer.getConfig().depthX).toBe(1);
    expect(composer.getConfig().depthY).toBe(1);
    expect(composer.getConfig().depthZ).toBe(1);

    const triggerCbk = jest.fn();
    const tweenCbk = jest.fn();

    composer.onTrigger(triggerCbk);
    composer.onTween(tweenCbk);

    await window.waitFor(50);
    expect(triggerCbk).toHaveBeenCalledTimes(0);
    expect(tweenCbk).toHaveBeenCalledTimes(0);

    const depth = 2;
    composer.setDepth(depth);

    expect(composer.getConfig().depthX).toBe(depth);
    expect(composer.getConfig().depthY).toBe(depth);
    expect(composer.getConfig().depthZ).toBe(depth);

    await window.waitFor(50);

    expect(triggerCbk).toHaveBeenCalledTimes(0); // not called on setDepth
    expect(tweenCbk).toHaveBeenCalledTimes(1);
  });

  for (const depth of [0, -1]) {
    test(`set all depth to ${depth < 0 ? "negative" : "0"}`, () => {
      const { composer } = newComposer();

      const minDepth = 0.01; // hardcoded in composer
      composer.setDepth(depth);
      expect(composer.getConfig().depthX).toBe(minDepth);
      expect(composer.getConfig().depthY).toBe(minDepth);
      expect(composer.getConfig().depthZ).toBe(minDepth);
    });
  }

  test("set all depth to invalid", () => {
    const { composer } = newComposer();

    const depth = 2;
    composer.setDepth(depth);

    for (const invalid of [NaN, Infinity, null]) {
      composer.setDepth(invalid);

      // reset to default
      expect(composer.getConfig().depthX).toBe(depth);
      expect(composer.getConfig().depthY).toBe(depth);
      expect(composer.getConfig().depthZ).toBe(depth);
    }
  });

  test("set default depth to one value + depthZ to another", () => {
    const { composer } = newComposer();

    const depth = 2,
      depthZ = 3;
    composer.setDepth({ depth, depthZ });
    expect(composer.getConfig().depthX).toBe(depth);
    expect(composer.getConfig().depthY).toBe(depth);
    expect(composer.getConfig().depthZ).toBe(depthZ);
  });

  for (const includeDefault of [true, false]) {
    test(`all different (${includeDefault ? "" : "not "}including default)`, () => {
      const { composer } = newComposer();

      const depthX = 2,
        depthY = 3,
        depthZ = 4;
      composer.setDepth({
        depth: includeDefault ? 10 : undefined,
        depthX,
        depthY,
        depthZ,
      });
      expect(composer.getConfig().depthX).toBe(depthX);
      expect(composer.getConfig().depthY).toBe(depthY);
      expect(composer.getConfig().depthZ).toBe(depthZ);
    });
  }
});

describe("add/getComposition/toCss", () => {
  test("getComposition/toCss: returned copy", () => {
    const effect = new DummyEffect();

    const { composer } = newComposer();

    const composition = composer.getComposition();
    const css = composer.toCss();

    expect(composition.size).toBe(0);
    expect(css).toEqual({});

    composition.add(effect);
    expect(composition.size).toBe(1);
    css.a = "foo";

    expect(composer.getComposition().size).toBe(0);
    expect(composer.toCss()).toEqual({});
  });

  test("add effect/composer + getComposition/toCss", async () => {
    const effectAO = new DummyEffectA({ a: 1 });
    const effectBO = new DummyEffectB({ b: 2 });

    const { composer } = newComposer();
    const { composer: composerB } = newComposer();
    composer.add(effectAO).add(composerB.add(effectBO));

    await window.waitFor(0); // callbacks are async

    for (const e of [effectAO, effectBO]) {
      for (const m of ["update", "export", "toCss"]) {
        expect(e[m]).toHaveBeenCalledTimes(0);
      }

      expect(e.toComposition).toHaveBeenCalledTimes(1); // cloned
    }

    // getComposition ----------

    const composition = composer.getComposition();
    expect(composition.size).toBe(2);
    expect([...composition.keys()]).toEqual(["effect-a", "effect-b"]);

    const effectA = composition.get("effect-a");
    const effectB = composition.get("effect-b");
    expect(effectA).not.toBe(effectAO); // cloned
    expect(effectB).not.toBe(effectBO); // cloned

    // toCss ----------

    const css = composer.toCss();
    expect(css).toEqual({ a: 1, b: 2 });

    await window.waitFor(0); // callbacks are async
    // no new calls on original effects
    for (const e of [effectAO, effectBO]) {
      for (const m of ["update", "export", "toCss"]) {
        expect(e[m]).toHaveBeenCalledTimes(0);
      }

      expect(e.toComposition).toHaveBeenCalledTimes(1);
    }

    // No calls for the cloned effects
    // FXComposer returns an exported composition, with effects cloned each time
    // so we can't get the original effect objects it has
    for (const e of [effectA, effectB]) {
      for (const m of ["update", "export", "toComposition", "toCss"]) {
        expect(e[m]).toHaveBeenCalledTimes(0);
      }
    }
  });

  test("toCss with no negated", async () => {
    const effectA = new DummyEffectA({ a: 1 });
    const effectB = new DummyEffectB({ b: 2 });
    const effectC = new DummyEffectC({ c: 3 });

    const { composer } = newComposer();
    expect(composer.toCss()).toEqual({}); // no effects yet

    composer.add(effectA).add(effectB).add(effectC);

    const css = composer.toCss();
    expect(css).toEqual({ a: 1, b: 2, c: 3 });
  });

  for (const useExplicit of [true, false]) {
    test("toCss with negated (default)", async () => {
      const effectIgnored = new DummyEffectA({ a: 10 });
      const { composer: negatedIgnored } = newComposer();
      negatedIgnored.add(effectIgnored);

      const effectAN = new DummyEffectA({ a: 1 });
      const effectBN = new DummyEffectB({ b: 2 });
      const effectCN = new DummyEffectC({ c: 3 });

      const { composer: negated } = newComposer();
      negated.add(effectAN).add(effectBN).add(effectCN);

      expect(negated.toCss()).toEqual({ a: 1, b: 2, c: 3 });

      const { composer } = useExplicit
        ? newComposer({ negate: negatedIgnored })
        : newComposer({ negate: negated });

      expect(composer.toCss()).toEqual({}); // no effects yet

      const effectA = new DummyEffectA({ a: 10 });
      const effectA2 = new DummyEffectA({ a2: 5 });
      const effectB = new DummyEffectB({ b: 3 });
      const effectD = new DummyEffectD({ d: 1 });

      composer.add(effectA).add(effectA2).add(effectB).add(effectD);

      expect(composer.getComposition().get("effect-a").getState()).toEqual({
        a: 10,
        a2: 5,
      });

      const css = composer.toCss(useExplicit ? negated : undefined);
      expect(css).toEqual({ a: 9 /* 10 - 1 */, a2: 5, b: 1 /* 3 - 2 */, d: 1 });
    });
  }

  test("toCss with pinned effects", async () => {
    const { setPinState, pin: pinA } = newPin();
    setPinState(true); // shouldn't matter
    const effectA = new DummyEffectA({ a: 1 });
    const effectB = new DummyEffectB({ b: 2 });
    const effectC = new DummyEffectC({ c: 3 });

    const { composer } = newComposer();
    composer.add(effectA, pinA).add(effectB).add(effectC);

    const css = composer.toCss();
    expect(css).toEqual({ a: 1, b: 2, c: 3 });
  });
});

// XXX
// pinned effects with trigger
//
// clear + onClear / offClear
//
// animate / deanimate
// startAnimate / stopAnimate
