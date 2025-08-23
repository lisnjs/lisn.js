const { jest, describe, test, expect } = require("@jest/globals");

const { deepCopy, copyExistingKeysTo } = window.LISN._;
const { animation3DTweener, TWEENERS } = window.LISN.utils;

const newTweener = (cbk) => {
  return function* (input) {
    const state = deepCopy(input);
    const initial = state.current;

    while (true) {
      let current = cbk(state);

      if (Math.abs(state.target - initial) < Math.abs(current - initial)) {
        // overshot
        current = state.target;
      }

      state.current = current;
      const update = yield { current: state.current };
      copyExistingKeysTo(update ?? {}, state);

      if (state.current === state.target) {
        return;
      }
    }
  };
};

const validateTweenerOutput = ({
  tweenerName,
  lag,
  initial,
  target,
  old,
  current,
  elapsed,
  switchedAtElapsed = 0,
  switchedAtPosition = initial,
  firstTarget = target,
}) => {
  const hasSwitched = switchedAtElapsed > 0;

  const hasReversed =
    hasSwitched &&
    Math.abs(initial - target) < Math.abs(initial - firstTarget) &&
    Math.abs(initial - target) < Math.abs(initial - switchedAtPosition);

  const recentlyReversed =
    hasReversed && elapsed - switchedAtElapsed < 0.2 * lag;

  const referencePosition = hasSwitched ? switchedAtPosition : initial;

  const oldProgress = Math.abs(
    (referencePosition - old) / (referencePosition - target),
  );
  const progress = Math.abs(
    (referencePosition - current) / (referencePosition - target),
  );

  expect(progress).toBeLessThanOrEqual(1);
  if (tweenerName === "spring" && recentlyReversed) {
    // spring has some momentum, so it will take a while to slow down and
    // reverse
  } else if (switchedAtPosition !== current) {
    // should be getting closer to target
    expect(progress).toBeGreaterThan(oldProgress);
  }

  expect(old).not.toBe(current);

  // TODO figure out how to test in case it has switched target/lag

  if (!hasSwitched) {
    switch (tweenerName) {
      case "spring":
        if (elapsed > lag / 3) {
          expect(progress).toBeGreaterThanOrEqual(0.5);
        } else if (elapsed < lag / 10) {
          expect(progress).toBeLessThanOrEqual(0.5);
        }
        break;
      case "linear":
        expect(progress).toBeCloseTo(elapsed / lag);
        break;
      case "quadratic":
      case "cubic":
      case "sine":
        if (elapsed > lag / 2) {
          expect(progress).toBeGreaterThanOrEqual(0.5);
        } else {
          expect(progress).toBeLessThanOrEqual(0.5);
        }
        break;
    }
  }
};

describe("tweeners", () => {
  const lag = 1000;
  const deltaTime = 100;

  for (const tweenerName in TWEENERS) {
    const tweener = TWEENERS[tweenerName];

    for (const [initial, target] of [
      [-100, 200],
      [0, 200],
      [100, 200],

      [200, 100],
      [200, 0],
      [200, -100],
    ]) {
      test(`${tweenerName}: ${initial} -> ${target}`, () => {
        let current = initial,
          old = initial,
          elapsed = 0;

        const generator = tweener({
          current,
          target,
          lag,
          deltaTime,
        });

        for ({ current } of generator) {
          elapsed += deltaTime;

          validateTweenerOutput({
            tweenerName,
            lag,
            initial,
            target,
            old,
            current,
            elapsed,
          });

          old = current;

          if (elapsed > lag || current === target) {
            break;
          }
        }

        expect(elapsed).toBeGreaterThanOrEqual(lag); // didn't finish early
        expect(Math.round(Math.abs(current - target))).toBeLessThan(5); // reached close to target in lag time
      });

      for (const extendTarget of [true, false]) {
        let firstTarget = initial + 0.35 * (target - initial);
        let finalTarget = target;

        if (
          Math.abs(firstTarget - initial) < Math.abs(finalTarget - initial) !==
          extendTarget
        ) {
          [firstTarget, finalTarget] = [finalTarget, firstTarget];
        }

        let expectedApproxTime = tweenerName === "spring" ? 1.7 * lag : lag;

        test(`${tweenerName}: with updating target ${initial} -> ${firstTarget} -> ${finalTarget}`, () => {
          let currentTarget = firstTarget,
            current = initial,
            switchedAtElapsed = 0,
            switchedAtPosition = 0,
            old = initial,
            elapsed = 0;

          const generator = tweener({
            current,
            target: firstTarget,
            lag,
            deltaTime,
          });

          while (true) {
            const next = generator.next({ target: currentTarget });
            if (next.done) {
              break;
            }

            current = next.value.current;
            elapsed += deltaTime;

            if (currentTarget !== finalTarget && elapsed >= lag / 2) {
              currentTarget = finalTarget;
              switchedAtElapsed = elapsed;
              switchedAtPosition = current;

              if (
                Math.abs(current - initial) > Math.abs(finalTarget - initial) &&
                tweenerName !== "spring"
              ) {
                // reversing
                expectedApproxTime += 0.5 * lag;
              } else {
                if (extendTarget) {
                  expectedApproxTime += 0.25 * lag;
                } else {
                  expectedApproxTime -= 0.5 * lag;
                }
              }
            }

            validateTweenerOutput({
              tweenerName,
              lag,
              initial,
              target: currentTarget,
              old,
              current,
              elapsed,
              switchedAtElapsed,
              switchedAtPosition,
              firstTarget,
            });

            old = current;

            if (current === finalTarget) {
              break;
            }
          }

          expect(currentTarget).toBe(finalTarget);

          const minTime =
            tweenerName === "spring"
              ? 0.6 * expectedApproxTime
              : 0.8 * expectedApproxTime;
          expect(elapsed).toBeGreaterThanOrEqual(minTime); // didn't finish too early
          expect(Math.round(Math.abs(current - finalTarget))).toBeLessThan(5); // reached close to target in lag time
        });
      }
    }
  }
});

describe("animation3DTweener: custom", () => {
  test("for loop", async () => {
    const step = 10;
    const cbk = jest.fn(({ current }) => current + step);
    const tweener = newTweener(cbk);

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

    const generator = animation3DTweener(tweener, input);
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

  test("with updating target and lag", async () => {
    const step = 10;
    const cbk = jest.fn(({ current }) => current + step);
    const tweener = newTweener(cbk);

    const targetX = 200;
    const lagX = 100;
    const input = {
      x: {
        current: targetX / 4,
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

    const generator = animation3DTweener(tweener, input);
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

  test("no input", async () => {
    const cbk = jest.fn(() => {
      throw "Shouldn't be called";
    });
    const tweener = newTweener(cbk);

    const input = {};

    const generator = animation3DTweener(tweener, input);
    let i = 0;
    for await (const __ignored of generator) {
      i++;
    }

    expect(i).toBe(1);
    expect(cbk).toHaveBeenCalledTimes(0);
  });

  test("already at target", async () => {
    const cbk = jest.fn(({ current }) => current);
    const tweener = newTweener(cbk);

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

    const generator = animation3DTweener(tweener, input);
    let i = 0;
    for await (const state of generator) {
      i++;
      expect(state.x.current).toBe(input.x.target);
      expect(state.y.current).toBe(input.y.target);
    }

    expect(i).toBe(1);
    expect(cbk).toHaveBeenCalledTimes(2); // one for each axis
  });

  test("already at target, but updated at i=1", async () => {
    const step = 10;
    const cbk = jest.fn(({ current }) => current + step);
    const tweener = newTweener(cbk);

    const targetX = 200;
    const input = {
      x: {
        current: targetX / 2,
        target: targetX / 2,
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

    const update = { x: { target: targetX } };

    const generator = animation3DTweener(tweener, input);
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
          a === "x" ? (i > 1 ? targetX : input.x.target) : input.y.target;

        expect(state[a].target).toBe(target);
        expect(state[a].lag).toBe(input[a].lag);

        expect(state[a].initial).toBe(input[a].current);

        if (a === "x" && i === 1) {
          expect(state.x.previous).toBe(input[a].current);
        } else {
          // x has skipped one step
          expect(state[a].previous).toBe(
            Math.min(
              target - step,
              input[a].current + (i - (a === "x" ? 2 : 1)) * step,
            ),
          );
        }

        expect(state[a].current).toBe(
          Math.min(target, input[a].current + (i - (a === "x" ? 1 : 0)) * step),
        );
      }

      expect(state.z).toBeUndefined();
    }

    expect(i).toBe(
      Math.max(
        1 + (targetX - input.x.current) / step,
        (input.y.target - input.y.current) / step,
      ),
    );
  });

  test("with updating x target after reaching it", async () => {
    const step = 10;
    const cbk = jest.fn(({ current }) => current + step);
    const tweener = newTweener(cbk);

    const targetX = 50;
    const input = {
      x: {
        current: 0,
        target: 10, // reached in 1 iteration
        lag: 100,
      },
      y: {
        current: 0,
        target: 400,
        lag: 50,
      },
      // omit z
    };
    const inputCopy = deepCopy(input);

    const update = { x: { target: targetX } };

    const generator = animation3DTweener(tweener, input);
    let i = 0;
    while (true) {
      const { value: state, done: genDone } = await generator.next(
        i === 2 ? update : undefined,
      );

      if (genDone) {
        break;
      }

      i++;
      if (i == 1) {
        expect(state.x.current).toBe(state.x.target);
      }

      expect(input).toEqual(inputCopy); // not modified

      for (const a of ["x", "y"]) {
        const target =
          a === "x" ? (i > 2 ? targetX : input.x.target) : input.y.target;

        expect(state[a].target).toBe(target);
        expect(state[a].lag).toBe(input[a].lag);

        expect(state[a].initial).toBe(input[a].current);

        if (a === "x" && i <= 2) {
          expect(state.x.previous).toBe(input[a].current);
        } else {
          // x has skipped one step
          expect(state[a].previous).toBe(
            Math.min(
              target - step,
              input[a].current + (i - (a === "x" ? 2 : 1)) * step,
            ),
          );
        }

        if (a === "x" && i <= 2) {
          expect(state.x.current).toBe(
            Math.min(target, input.x.current + step),
          );
        } else {
          expect(state[a].current).toBe(
            Math.min(
              target,
              input[a].current + (i - (a === "x" ? 1 : 0)) * step,
            ),
          );
        }
      }

      expect(state.z).toBeUndefined();
    }

    expect(i).toBe(
      Math.max(
        1 + (targetX - input.x.current) / step,
        (input.y.target - input.y.current) / step,
      ),
    );
  });

  test("already at x target + per-axis tweener", async () => {
    const step = 10;
    const times = [];

    const cbk = {
      x: jest.fn(({ current }) => current),
      y: jest.fn(({ current, deltaTime }) => {
        times.push(deltaTime);
        return current + step;
      }),
    };

    const tweeners = { x: newTweener(cbk.x), y: newTweener(cbk.y) };

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

    const generator = animation3DTweener(tweeners, input);
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

    expect(cbk.x).toHaveBeenCalledTimes(1);
    expect(cbk.y).toHaveBeenCalledTimes(nCalls);

    for (let c = 0; c++; c < nCalls) {
      expect(times[c]).toBeLessThan(20);

      expect(cbk.y).toHaveBeenNthCalledWith(c + 1, {
        current: input.y.current + c * step,
        target: input.y.target,
        lag: input.y.lag,
        deltaTime: times[c],
        precision: 1,
      });
    }
  });

  for (const snapWithLag of [true, false]) {
    test(`${snapWithLag ? "lag x = 0" : "snap x"} in init + per-axis tweener`, async () => {
      const step = 10;
      const times = [];

      const cbk = {
        x: jest.fn(() => {
          throw "Shouldn't be called";
        }),
        y: jest.fn(({ current, deltaTime }) => {
          times.push(deltaTime);
          return current + step;
        }),
      };

      const tweeners = { x: newTweener(cbk.x), y: newTweener(cbk.y) };

      const input = {
        x: {
          current: 100,
          target: 200,
          lag: snapWithLag ? 0 : 100,
          snap: !snapWithLag,
        },
        y: {
          current: 0,
          target: 40,
          lag: 50,
        },
        // omit z
      };
      const inputCopy = deepCopy(input);

      const generator = animation3DTweener(tweeners, input);
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
              : Math.min(
                  input.y.target - step,
                  input.y.current + (i - 1) * step,
                );

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
          precision: 1,
        });
      }
    });

    test(`${snapWithLag ? "lag x = 0" : "snap x"} in update + per-axis tweener`, async () => {
      const step = 10;
      const times = [];

      const cbk = {
        x: jest.fn(({ current }) => current + step),
        y: jest.fn(({ current, deltaTime }) => {
          times.push(deltaTime);
          return current + step;
        }),
      };

      const tweeners = { x: newTweener(cbk.x), y: newTweener(cbk.y) };

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

      const update = { x: { lag: snapWithLag ? 0 : 100, snap: !snapWithLag } };

      const generator = animation3DTweener(tweeners, input);
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
              : Math.min(
                  input.y.target - step,
                  input.y.current + (i - 1) * step,
                );

          expect(state[a].initial).toBe(input[a].current);
          expect(state[a].current).toBe(current);
          expect(state[a].previous).toBe(previous);

          expect(state[a].target).toBe(input[a].target);
          expect(state[a].lag).toBe(
            a === "x" && i > 1 && snapWithLag ? 0 : input[a].lag,
          );
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
          precision: 1,
        });
      }
    });
  }
});

describe("animation3DTweener: spring", () => {
  test("for loop", async () => {
    const input = {
      x: {
        current: 100,
        target: 200,
        lag: 1000,
      },
      y: {
        current: 0,
        target: 80,
        lag: 500,
      },
    };

    const deltaTime = 10; // mock requestAnimationFrame uses 10ms timer
    let i = { x: 0, y: 0 };

    const generator = animation3DTweener("spring", input);

    let done = 0;
    let closeEnoughAt = { x: 0, y: 0 };
    for await (const state of generator) {
      expect(done).toBeLessThan(2); // generator should have finished otherwise

      let numAxesDone = 0;
      for (const a of ["x", "y"]) {
        const { current, target, lag } = state[a];
        if (i[a] >= Math.round(lag / deltaTime) - 1) {
          expect(Math.round(Math.abs(current - target))).toBeLessThan(5);
        }

        if (closeEnoughAt[a] === 0 && Math.abs(current - target) < 2) {
          closeEnoughAt[a] = i[a];
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
    expect(i.x).toBeGreaterThanOrEqual(input.x.lag / deltaTime);
    expect(i.y).toBeGreaterThanOrEqual(input.y.lag / deltaTime);
    expect(i.x).toBeLessThanOrEqual((input.x.lag * 1.7) / deltaTime);
    expect(i.y).toBeLessThanOrEqual((input.y.lag * 1.7) / deltaTime);

    expect(closeEnoughAt.x).toBeGreaterThanOrEqual(
      (input.x.lag * 0.6) / deltaTime,
    );
    expect(closeEnoughAt.y).toBeGreaterThanOrEqual(
      (input.y.lag * 0.6) / deltaTime,
    );
    expect(closeEnoughAt.x).toBeLessThanOrEqual(
      (input.x.lag * 1.3) / deltaTime,
    );
    expect(closeEnoughAt.y).toBeLessThanOrEqual(
      (input.y.lag * 1.3) / deltaTime,
    );
  });

  test("with updating target", async () => {
    const targetXA = 150;
    const targetXB = 200;
    const input = {
      x: {
        current: 100,
        target: targetXA,
        lag: 1000,
      },
      y: {
        current: 0,
        target: 200,
        lag: 500,
      },
    };

    const update = { x: { target: targetXB } };

    const deltaTime = 10; // mock requestAnimationFrame uses 10ms timer
    let i = { x: 0, y: 0 };

    const generator = animation3DTweener("spring", input);

    let done = 0;
    let closeEnoughAt = { x: 0, y: 0 };
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

        if (closeEnoughAt[a] === 0 && Math.abs(current - target) < 2) {
          closeEnoughAt[a] = i[a];
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
    expect(i.x).toBeGreaterThanOrEqual(input.x.lag / deltaTime);
    expect(i.y).toBeGreaterThanOrEqual(input.y.lag / deltaTime);
    expect(i.x).toBeLessThanOrEqual((input.x.lag * 1.7) / deltaTime);
    expect(i.y).toBeLessThanOrEqual((input.y.lag * 1.7) / deltaTime);

    expect(closeEnoughAt.x).toBeGreaterThanOrEqual(
      (input.x.lag * 0.6) / deltaTime,
    );
    expect(closeEnoughAt.y).toBeGreaterThanOrEqual(
      (input.y.lag * 0.6) / deltaTime,
    );
    expect(closeEnoughAt.x).toBeLessThanOrEqual(
      (input.x.lag * 1.3) / deltaTime,
    );
    expect(closeEnoughAt.y).toBeLessThanOrEqual(
      (input.y.lag * 1.3) / deltaTime,
    );
  });
});
