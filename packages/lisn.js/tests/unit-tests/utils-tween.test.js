const { jest, describe, test, expect } = require("@jest/globals");

const { deepCopy } = window.LISN._;
const {
  springTweener,
  linearTweener,
  quadraticTweener,
  cubicTweener,
  tween3DAnimationGenerator,
} = window.LISN.utils;

describe("springTweener", () => {
  test("to larger", () => {
    const target = 200;
    const lag = 1000;
    const deltaTime = 200;
    let current = 100,
      state = null,
      i;
    for (i = 0; i <= 1 + lag / deltaTime; i++) {
      ({ current, state } = springTweener({
        current,
        target,
        lag,
        deltaTime,
        state,
      }));

      if (current === target) {
        break;
      }
    }

    expect(i).toBeGreaterThan(lag / deltaTime - 2);
    expect(Math.round(Math.abs(current - target))).toBeLessThan(5);
    expect(state.velocity).toBeLessThan(1);
  });

  test("to smaller", () => {
    const target = 100;
    const lag = 1000;
    const deltaTime = 200;
    let current = 200,
      state = null,
      i;
    for (i = 0; i <= 1 + lag / deltaTime; i++) {
      ({ current, state } = springTweener({
        current,
        target,
        lag,
        deltaTime,
        state,
      }));

      if (current === target) {
        break;
      }
    }

    expect(i).toBeGreaterThan(lag / deltaTime - 2);
    expect(Math.round(Math.abs(current - target))).toBeLessThan(5);
    expect(state.velocity).toBeLessThan(1);
  });
});

describe("linearTweener", () => {
  test("to larger", () => {
    const target = 200;
    const lag = 1000;
    const deltaTime = 200;
    let current = 100,
      state = null,
      i;
    const initial = current;
    const fixedVelocity = (target - initial) / lag;

    for (i = 1; i <= lag / deltaTime; i++) {
      ({ current, state } = linearTweener({
        current,
        target,
        lag,
        deltaTime,
        state,
      }));

      expect(current).toBe(initial + fixedVelocity * i * deltaTime);
      if (current === target) {
        break;
      }
    }

    expect(i).toBe(lag / deltaTime);
    expect(current).toBe(target);
  });

  test("to smaller", () => {
    const target = 100;
    const lag = 1000;
    const deltaTime = 200;
    let current = 200,
      state = null,
      i;
    const initial = current;
    const fixedVelocity = (target - initial) / lag;

    for (i = 1; i <= lag / deltaTime; i++) {
      ({ current, state } = linearTweener({
        current,
        target,
        lag,
        deltaTime,
        state,
      }));

      expect(current).toBe(initial + fixedVelocity * i * deltaTime);
      if (current === target) {
        break;
      }
    }

    expect(i).toBe(lag / deltaTime);
    expect(current).toBe(target);
  });
});

describe("tween3DAnimationGenerator: custom", () => {
  test("for loop", async () => {
    const step = 10;
    const cbk = jest.fn(({ current }) => ({
      current: current + step,
    }));

    const input = {
      x: {
        current: 100,
        target: 200,
        lag: 100,
      },
      y: {
        current: 0,
        target: 40,
        lag: 50,
      },
      // omit z
    };
    const inputCopy = deepCopy(input);

    const generator = tween3DAnimationGenerator(cbk, input);
    let i = 0;
    for await (const state of generator) {
      i++;
      expect(input).toEqual(inputCopy); // not modified

      for (const a of ["x", "y"]) {
        expect(state[a].initial).toBe(input[a].current);
        expect(state[a].previous).toBe(
          Math.min(input[a].target - step, input[a].current + (i - 1) * step),
        );
        expect(state[a].current).toBe(
          Math.min(input[a].target, input[a].current + i * step),
        );
        expect(state[a].target).toBe(input[a].target);
        expect(state[a].lag).toBe(input[a].lag);
      }

      expect(state.z).toBeUndefined();
    }

    expect(i).toBe(
      Math.max(
        (input.x.target - input.x.current) / step,
        (input.y.target - input.y.current) / step,
      ),
    );
  });

  test("with updating target", async () => {
    const step = 10;
    const cbk = jest.fn(({ current }) => ({
      current: current + step,
    }));

    const targetX = 200;
    const lagX = 100;
    const input = {
      x: {
        current: 50,
        target: targetX / 2,
        lag: lagX / 2,
      },
      y: {
        current: 0,
        target: 40,
        lag: 50,
      },
      // omit z
    };
    const inputCopy = deepCopy(input);

    const update = { x: { target: targetX, lag: lagX } };

    const generator = tween3DAnimationGenerator(cbk, input);
    let i = 0;
    while (true) {
      const { value: state, done: genDone } = await generator.next(
        i > 0 ? update : undefined,
      );

      if (genDone) {
        break;
      }

      i++;
      expect(input).toEqual(inputCopy); // not modified

      for (const a of ["x", "y"]) {
        const target =
          a === "x" ? (i > 1 ? targetX : targetX / 2) : input.y.target;
        const lag = a === "x" ? (i > 1 ? lagX : lagX / 2) : input.y.lag;

        expect(state[a].target).toBe(target);
        expect(state[a].lag).toBe(lag);

        expect(state[a].initial).toBe(input[a].current);
        expect(state[a].previous).toBe(
          Math.min(target - step, input[a].current + (i - 1) * step),
        );
        expect(state[a].current).toBe(
          Math.min(target, input[a].current + i * step),
        );
      }

      expect(state.z).toBeUndefined();
    }

    expect(i).toBe(
      Math.max(
        (targetX - input.x.current) / step,
        (input.y.target - input.y.current) / step,
      ),
    );
  });

  test("already at target", async () => {
    const cbk = jest.fn(() => {
      throw "Shouldn't be called";
    });

    const input = {
      x: {
        current: 200,
        target: 200,
        lag: 100,
      },
      y: {
        current: 40,
        target: 40,
        lag: 50,
      },
      // omit z
    };

    const generator = tween3DAnimationGenerator(cbk, input);
    let i = 0;
    for await (const state of generator) {
      i++;
      for (const a of ["x", "y"]) {
        expect(state[a].initial).toBe(input[a].current);
        expect(state[a].previous).toBe(input[a].current);
        expect(state[a].current).toBe(input[a].target);
        expect(state[a].target).toBe(input[a].target);
        expect(state[a].lag).toBe(input[a].lag);
      }

      expect(state.z).toBeUndefined();
    }

    expect(i).toBe(1);
    expect(cbk).toHaveBeenCalledTimes(0);
  });

  test("already at x target + per-axis tweener", async () => {
    const step = 10;
    const times = [];

    const cbk = {
      x: jest.fn(() => {
        throw "Shouldn't be called";
      }),
      y: jest.fn(({ current, deltaTime }) => {
        times.push(deltaTime);
        return {
          current: current + step,
        };
      }),
    };

    const input = {
      x: {
        current: 200,
        target: 200,
        lag: 100,
      },
      y: {
        current: 0,
        target: 40,
        lag: 50,
      },
      // omit z
    };
    const inputCopy = deepCopy(input);

    const generator = tween3DAnimationGenerator(cbk, input);
    let i = 0;
    for await (const state of generator) {
      i++;
      expect(input).toEqual(inputCopy); // not modified

      for (const a of ["x", "y"]) {
        expect(state[a].initial).toBe(input[a].current);
        expect(state[a].previous).toBe(
          a === "x"
            ? input.x.current
            : Math.min(input.y.target - step, input.y.current + (i - 1) * step),
        );
        expect(state[a].current).toBe(
          Math.min(input[a].target, input[a].current + i * step),
        );
        expect(state[a].target).toBe(input[a].target);
        expect(state[a].lag).toBe(input[a].lag);
      }

      expect(state.z).toBeUndefined();
    }

    const nCalls = (input.y.target - input.y.current) / step;
    expect(i).toBe(nCalls);

    expect(cbk.x).toHaveBeenCalledTimes(0);
    expect(cbk.y).toHaveBeenCalledTimes(nCalls);

    for (let c = 0; c++; c < nCalls) {
      expect(times[c]).toBeLessThan(20);

      expect(cbk.y).toHaveBeenNthCalledWith(c + 1, {
        current: input.y.current + c * step,
        target: input.y.target,
        lag: input.y.lag,
        deltaTime: times[c],
      });
    }
  });

  test("snap x in init + per-axis tweener", async () => {
    const step = 10;
    const times = [];

    const cbk = {
      x: jest.fn(() => {
        throw "Shouldn't be called";
      }),
      y: jest.fn(({ current, deltaTime }) => {
        times.push(deltaTime);
        return {
          current: current + step,
        };
      }),
    };

    const input = {
      x: {
        current: 100,
        target: 200,
        lag: 100,
        snap: true,
      },
      y: {
        current: 0,
        target: 40,
        lag: 50,
      },
      // omit z
    };
    const inputCopy = deepCopy(input);

    const generator = tween3DAnimationGenerator(cbk, input);
    let i = 0;
    for await (const state of generator) {
      i++;
      expect(input).toEqual(inputCopy); // not modified

      for (const a of ["x", "y"]) {
        const current =
          a === "x"
            ? input.x.target
            : Math.min(input.y.target, input.y.current + i * step);

        const previous =
          a === "x"
            ? input.x.current
            : Math.min(input.y.target - step, input.y.current + (i - 1) * step);

        expect(state[a].initial).toBe(input[a].current);
        expect(state[a].current).toBe(current);
        expect(state[a].previous).toBe(previous);

        expect(state[a].target).toBe(input[a].target);
        expect(state[a].lag).toBe(input[a].lag);
      }

      expect(state.z).toBeUndefined();
    }

    const nCalls = (input.y.target - input.y.current) / step;
    expect(i).toBe(nCalls);

    expect(cbk.x).toHaveBeenCalledTimes(0);
    expect(cbk.y).toHaveBeenCalledTimes(nCalls);

    for (let c = 0; c++; c < nCalls) {
      expect(times[c]).toBeLessThan(20);

      expect(cbk.y).toHaveBeenNthCalledWith(c + 1, {
        current: input.y.current + c * step,
        target: input.y.target,
        lag: input.y.lag,
        deltaTime: times[c],
      });
    }
  });

  test("snap x in update + per-axis tweener", async () => {
    const step = 10;
    const times = [];

    const cbk = {
      x: jest.fn(({ current }) => {
        return {
          current: current + step,
        };
      }),
      y: jest.fn(({ current, deltaTime }) => {
        times.push(deltaTime);
        return {
          current: current + step,
        };
      }),
    };

    const input = {
      x: {
        current: 100,
        target: 200,
        lag: 100,
      },
      y: {
        current: 0,
        target: 40,
        lag: 50,
      },
      // omit z
    };
    const inputCopy = deepCopy(input);

    const update = { x: { snap: true } };

    const generator = tween3DAnimationGenerator(cbk, input);
    let i = 0;

    while (true) {
      const { value: state, done: genDone } = await generator.next(update);
      if (genDone) {
        break;
      }

      i++;
      expect(input).toEqual(inputCopy); // not modified

      for (const a of ["x", "y"]) {
        const current =
          a === "x"
            ? i > 1
              ? input.x.target
              : input.x.current + step
            : Math.min(input.y.target, input.y.current + i * step);

        const previous =
          a === "x"
            ? input.x.current
            : Math.min(input.y.target - step, input.y.current + (i - 1) * step);

        expect(state[a].initial).toBe(input[a].current);
        expect(state[a].current).toBe(current);
        expect(state[a].previous).toBe(previous);

        expect(state[a].target).toBe(input[a].target);
        expect(state[a].lag).toBe(input[a].lag);
      }

      expect(state.z).toBeUndefined();
    }

    const nCalls = (input.y.target - input.y.current) / step;
    expect(i).toBe(nCalls);

    expect(cbk.x).toHaveBeenCalledTimes(1);
    expect(cbk.y).toHaveBeenCalledTimes(nCalls);

    for (let c = 0; c++; c < nCalls) {
      expect(times[c]).toBeLessThan(20);

      expect(cbk.y).toHaveBeenNthCalledWith(c + 1, {
        current: input.y.current + c * step,
        target: input.y.target,
        lag: input.y.lag,
        deltaTime: times[c],
      });
    }
  });
});

describe("tween3DAnimationGenerator: spring", () => {
  test("for loop", async () => {
    const input = {
      x: {
        current: 100,
        target: 200,
        lag: 100,
      },
      y: {
        current: 0,
        target: 40,
        lag: 50,
      },
    };

    const deltaTime = 10; // mock requestAnimationFrame uses 10ms timer
    let i = { x: 0, y: 0 };

    const generator = tween3DAnimationGenerator("spring", input);

    let done = 0;
    for await (const state of generator) {
      expect(done).toBeLessThan(2); // generator should have finished otherwise

      let numAxesDone = 0;
      for (const a of ["x", "y"]) {
        const { current, target, lag } = state[a];
        if (i[a] >= Math.round(lag / deltaTime) - 1) {
          expect(Math.round(Math.abs(current - target))).toBeLessThan(5);
        }

        if (current === target) {
          numAxesDone++;
        } else {
          i[a]++;
        }
      }

      if (numAxesDone == 2) {
        done++;
      }
    }

    expect(done).toBe(1);
    expect(i.x).toBeLessThan((input.x.lag * 1.3) / deltaTime);
    expect(i.y).toBeLessThan((input.y.lag * 1.3) / deltaTime);
  });

  test("with updating target", async () => {
    const targetXA = 150;
    const targetXB = 200;
    const input = {
      x: {
        current: 100,
        target: targetXA,
        lag: 100,
      },
      y: {
        current: 0,
        target: 10,
        lag: 50,
      },
    };

    const update = { x: { target: targetXB } };

    const deltaTime = 10; // mock requestAnimationFrame uses 10ms timer
    let i = { x: 0, y: 0 };

    const generator = tween3DAnimationGenerator("spring", input);

    let done = 0;
    while (true) {
      expect(done).toBeLessThan(2); // generator should have finished otherwise

      const { value: state, done: genDone } = await generator.next(
        i.x > 0 ? update : undefined,
      );

      if (genDone) {
        break;
      }

      expect(state.x.target).toBe(i.x > 0 ? targetXB : targetXA);

      let numAxesDone = 0;
      for (const a of ["x", "y"]) {
        const { current, target, lag } = state[a];
        if (i[a] >= Math.round(lag / deltaTime) - 1) {
          expect(Math.round(Math.abs(current - target))).toBeLessThan(5);
        }

        if (current === target) {
          numAxesDone++;
        } else {
          i[a]++;
        }
      }

      if (numAxesDone == 2) {
        done++;
      }
    }

    expect(done).toBe(1);
    expect(i.x).toBeLessThan((input.x.lag * 1.3) / deltaTime);
    expect(i.y).toBeLessThan((input.y.lag * 1.3) / deltaTime);
  });
});

// XXX TODO remaining tweeners test
