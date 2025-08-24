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
  if (tweenerName === "backOut" || tweenerName === "backInOut") {
    // TODO
    return;
  }

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

          if (
            elapsed > lag ||
            (tweenerName === "spring" && Math.abs(current - target) < 1)
          ) {
            break;
          }
        }

        expect(elapsed).toBeGreaterThanOrEqual(lag); // didn't finish early
        expect(Math.abs(current - target)).toBeLessThan(5); // reached close to target in lag time
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

        let expectedApproxTime = tweenerName === "spring" ? 1.5 * lag : lag;

        test(`${tweenerName}: updating target ${initial} -> ${firstTarget} -> ${finalTarget}`, () => {
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

            if (
              tweenerName === "spring" &&
              Math.abs(current - finalTarget) < 1
            ) {
              break;
            }
          }

          expect(currentTarget).toBe(finalTarget);

          const minTime =
            tweenerName === "spring"
              ? 0.6 * expectedApproxTime
              : 0.8 * expectedApproxTime;
          expect(elapsed).toBeGreaterThanOrEqual(minTime); // didn't finish too early
          expect(Math.abs(current - finalTarget)).toBeLessThan(5); // reached close to target in lag time
        });
      }
    }
  }
});

describe("animation3DTweener: custom", () => {
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

    expect(i).toBe(1); // yielded once
    expect(cbk).toHaveBeenCalledTimes(0);
  });

  for (const perAxisCbk of [true, false]) {
    test(`basic: for loop${perAxisCbk ? " + per-axis tweener" : ""}`, async () => {
      const step = 10;
      const times = { x: [], y: [] };
      const cbk = perAxisCbk
        ? {
            x: jest.fn(({ current, deltaTime }) => {
              times.x.push(deltaTime);
              return current + step;
            }),
            y: jest.fn(({ current, deltaTime }) => {
              times.y.push(deltaTime);
              return current + step;
            }),
          }
        : jest.fn(({ current }) => current + step);

      const tweener = perAxisCbk
        ? {
            x: newTweener(cbk.x),
            y: newTweener(cbk.y),
          }
        : newTweener(cbk);

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
          expect(state[a].target).toBe(input[a].target);
          expect(state[a].lag).toBe(input[a].lag);
          expect(state[a].snap).toBe(false);

          expect(state[a].initial).toBe(input[a].current);

          expect(state[a].current).toBe(
            Math.min(input[a].target, input[a].current + i * step),
          );

          expect(state[a].previous).toBe(state[a].current - step);
        }

        expect(state.z).toBeUndefined();
      }

      const nCalls = {
        x: Math.ceil((input.x.target - input.x.current) / step),
        y: Math.ceil((input.y.target - input.y.current) / step),
      };

      expect(i).toBe(Math.max(nCalls.x, nCalls.y));

      if (perAxisCbk) {
        for (const a of ["x", "y"]) {
          expect(cbk[a]).toHaveBeenCalledTimes(nCalls[a]);

          for (let c = 0; c++; c < nCalls[a]) {
            expect(times[a][c]).toBeLessThan(20);

            expect(cbk[a]).toHaveBeenNthCalledWith(c + 1, {
              current: input[a].current + c * step,
              target: input[a].target,
              lag: input[a].lag,
              deltaTime: times[a][c],
              precision: 1,
            });
          }
        }
      } else {
        expect(cbk).toHaveBeenCalledTimes(nCalls.x + nCalls.y);
      }
    });

    test(`basic: updating X target and lag at i=3${perAxisCbk ? " + per-axis tweener" : ""}`, async () => {
      const step = 10;
      const cbk = perAxisCbk
        ? {
            x: jest.fn(({ current }) => current + step),
            y: jest.fn(({ current }) => current + step),
          }
        : jest.fn(({ current }) => current + step);

      const tweener = perAxisCbk
        ? {
            x: newTweener(cbk.x),
            y: newTweener(cbk.y),
          }
        : newTweener(cbk);

      const targetX = 200;
      const lagX = 100;
      const input = {
        x: {
          current: targetX / 10,
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
        i++;

        const { value: state, done: genDone } = await generator.next(
          i === 3 ? update : undefined,
        );

        if (genDone) {
          i--;
          break;
        }

        expect(input).toEqual(inputCopy); // not modified

        for (const a of ["x", "y"]) {
          const target =
            a === "x" && i > 2 ? update[a].target : input[a].target;

          expect(state[a].target).toBe(target);
          expect(state[a].lag).toBe(
            a === "x" && i > 2 ? update[a].lag : input[a].lag,
          );
          expect(state[a].snap).toBe(false);

          expect(state[a].initial).toBe(input[a].current);

          expect(state[a].current).toBe(
            Math.min(target, input[a].current + i * step),
          );

          expect(state[a].previous).toBe(state[a].current - step);
        }

        expect(state.z).toBeUndefined();
      }

      const nCallsX = Math.ceil((targetX - input.x.current) / step);
      const nCallsY = Math.ceil((input.y.target - input.y.current) / step);
      expect(i).toBe(Math.max(nCallsX, nCallsY));

      if (perAxisCbk) {
        expect(cbk.x).toHaveBeenCalledTimes(nCallsX);
        expect(cbk.y).toHaveBeenCalledTimes(nCallsY);
      } else {
        expect(cbk).toHaveBeenCalledTimes(nCallsX + nCallsY);
      }
    });
  }

  test("already at target (X only)", async () => {
    const cbk = jest.fn(({ current }) => current);
    const tweener = newTweener(cbk);

    const input = {
      x: {
        current: 200,
        target: 200,
        lag: 100,
      },
      // omit y and z
    };

    const generator = animation3DTweener(tweener, input);
    let i = 0;
    for await (const state of generator) {
      i++;

      expect(state.x.target).toBe(input.x.target);
      expect(state.x.lag).toBe(input.x.lag);
      expect(state.x.snap).toBe(false);

      expect(state.x.initial).toBe(input.x.current);
      expect(state.x.current).toBe(input.x.target);
      expect(state.x.previous).toBe(input.x.target);

      expect(state.y).toBeUndefined();
      expect(state.z).toBeUndefined();
    }

    expect(i).toBe(1);
    expect(cbk).toHaveBeenCalledTimes(1); // should be called even if at target
  });

  for (const perAxisCbk of [true, false]) {
    test(`already at target (XY)${perAxisCbk ? " + per-axis tweener" : ""}`, async () => {
      const cbk = perAxisCbk
        ? {
            x: jest.fn(({ current }) => current),
            y: jest.fn(({ current }) => current),
          }
        : jest.fn(({ current }) => current);

      const tweener = perAxisCbk
        ? {
            x: newTweener(cbk.x),
            y: newTweener(cbk.y),
          }
        : newTweener(cbk);

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

        for (const a of ["x", "y"]) {
          expect(state[a].target).toBe(input[a].target);
          expect(state[a].lag).toBe(input[a].lag);
          expect(state[a].snap).toBe(false);

          expect(state[a].initial).toBe(input[a].current);
          expect(state[a].current).toBe(input[a].target);
          expect(state[a].previous).toBe(input[a].target);
        }

        expect(state.z).toBeUndefined();
      }

      expect(i).toBe(1);

      // should be called even if at target
      if (perAxisCbk) {
        expect(cbk.x).toHaveBeenCalledTimes(1);
        expect(cbk.y).toHaveBeenCalledTimes(1);
      } else {
        expect(cbk).toHaveBeenCalledTimes(2);
      }
    });

    test(`already at X target${perAxisCbk ? " + per-axis tweener" : ""}`, async () => {
      const step = 10;
      const cbk = perAxisCbk
        ? {
            x: jest.fn(({ current }) => current),
            y: jest.fn(({ current }) => current + step),
          }
        : jest.fn(({ current }) => current + step);

      const tweener = perAxisCbk
        ? {
            x: newTweener(cbk.x),
            y: newTweener(cbk.y),
          }
        : newTweener(cbk);

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

      const generator = animation3DTweener(tweener, input);
      let i = 0;
      for await (const state of generator) {
        i++;

        for (const a of ["x", "y"]) {
          expect(state[a].target).toBe(input[a].target);
          expect(state[a].lag).toBe(input[a].lag);
          expect(state[a].snap).toBe(false);

          expect(state[a].initial).toBe(input[a].current);

          expect(state[a].current).toBe(
            Math.min(input[a].target, input[a].current + i * step),
          );

          expect(state[a].previous).toBe(
            a === "x" ? input[a].target : state[a].current - step,
          );
        }

        expect(state.z).toBeUndefined();
      }

      const nCallsY = Math.ceil((input.y.target - input.y.current) / step);
      expect(i).toBe(nCallsY);

      if (perAxisCbk) {
        // should be called even if at target
        expect(cbk.x).toHaveBeenCalledTimes(1);
        expect(cbk.y).toHaveBeenCalledTimes(nCallsY);
      } else {
        expect(cbk).toHaveBeenCalledTimes(1 + nCallsY);
      }
    });
  }

  for (const sendUpdateOnce of [true, false]) {
    test(`already at target, but updated at i${sendUpdateOnce ? "=" : ">"}2 (X only)`, async () => {
      const step = 10;
      const cbk = jest.fn(({ current }) => current + step);

      const tweener = newTweener(cbk);

      const target = 200;
      const firstTarget = target / 2;
      const input = {
        x: {
          current: firstTarget,
          target: firstTarget,
          lag: 100,
        },
        // omit y and z
      };

      const update = { x: { target: target } };

      const generator = animation3DTweener(tweener, input);
      let i = 0;
      while (true) {
        i++;

        const { value: state, done: genDone } = await generator.next(
          !sendUpdateOnce || i === 2 ? update : undefined,
        );

        if (genDone) {
          i--;
          break;
        }

        expect(state.x.target).toBe(i > 1 ? target : input.x.target);
        expect(state.x.lag).toBe(input.x.lag);
        expect(state.x.snap).toBe(false);

        expect(state.x.initial).toBe(input.x.current);

        // on the first iteration, current is not updated
        expect(state.x.current).toBe(
          Math.min(target, input.x.current + (i - 1) * step),
        );

        expect(state.x.previous).toBe(
          i === 1 ? input.x.current : state.x.current - step,
        );

        expect(state.y).toBeUndefined();
        expect(state.z).toBeUndefined();
      }

      // on the first iteration, current is not updated, so 1 extra call
      expect(i).toBe(Math.ceil(1 + (target - input.x.current) / step));
      expect(cbk).toHaveBeenCalledTimes(i);
    });

    for (const perAxisCbk of [true, false]) {
      test(`already at X target, but updated at i${sendUpdateOnce ? "=" : ">"}3 (XY)${perAxisCbk ? " + per-axis tweener" : ""}`, async () => {
        const step = 10;
        const cbk = perAxisCbk
          ? {
              x: jest.fn(({ current }) => current + step),
              y: jest.fn(({ current }) => current + step),
            }
          : jest.fn(({ current }) => current + step);

        const tweener = perAxisCbk
          ? {
              x: newTweener(cbk.x),
              y: newTweener(cbk.y),
            }
          : newTweener(cbk);

        const targetX = 200;
        const firstTargetX = targetX / 2;
        const input = {
          x: {
            current: firstTargetX,
            target: firstTargetX,
            lag: 100,
          },
          y: {
            current: 0,
            target: 40,
            lag: 50,
          },
          // omit z
        };

        const update = { x: { target: targetX } };

        const generator = animation3DTweener(tweener, input);
        let i = 0;
        while (true) {
          i++;

          const { value: state, done: genDone } = await generator.next(
            i > 2 && (!sendUpdateOnce || i === 3) ? update : undefined,
          );

          if (genDone) {
            i--;
            break;
          }

          for (const a of ["x", "y"]) {
            const target =
              a === "x" && i > 2 ? update[a].target : input[a].target;

            expect(state[a].target).toBe(target);
            expect(state[a].lag).toBe(input[a].lag);
            expect(state[a].snap).toBe(false);

            expect(state[a].initial).toBe(input[a].current);

            // on the first two iterations, current for X is not updated
            expect(state[a].current).toBe(
              a === "x" && i <= 2
                ? input[a].current
                : Math.min(
                    target,
                    input[a].current + (i - (a === "x" ? 2 : 0)) * step,
                  ),
            );

            expect(state[a].previous).toBe(
              a === "x" && i <= 2 ? input[a].current : state[a].current - step,
            );
          }

          expect(state.z).toBeUndefined();
        }

        // on the first iteration, current is not updated, so 1 extra call
        const nCallsX = Math.ceil(1 + (targetX - input.x.current) / step);
        const nCallsY = Math.ceil((input.y.target - input.y.current) / step);

        // at i = 2 the X callback is not called, because its generator finishes,
        // so number of iterations is 1 extra
        expect(i).toBe(Math.max(1 + nCallsX, nCallsY));

        if (perAxisCbk) {
          expect(cbk.x).toHaveBeenCalledTimes(nCallsX);
          expect(cbk.y).toHaveBeenCalledTimes(nCallsY);
        } else {
          expect(cbk).toHaveBeenCalledTimes(nCallsX + nCallsY);
        }
      });
    }
  }

  for (const perAxisCbk of [true, false]) {
    for (const waitExtraTurn of [true, false]) {
      test(`updating X target ${waitExtraTurn ? "2" : "1"} iterations after reaching it${perAxisCbk ? " + per-axis tweener" : ""}`, async () => {
        const step = 10;
        const cbk = perAxisCbk
          ? {
              x: jest.fn(({ current }) => current + step),
              y: jest.fn(({ current }) => current + step),
            }
          : jest.fn(({ current }) => current + step);

        const tweener = perAxisCbk
          ? {
              x: newTweener(cbk.x),
              y: newTweener(cbk.y),
            }
          : newTweener(cbk);

        const targetX = 50;
        const input = {
          x: {
            current: 0,
            target: step, // reached in 1 iteration, but its generator will finish at i=2
            lag: 100,
          },
          y: {
            current: 0,
            target: 400,
            lag: 50,
          },
          // omit z
        };

        const update = { x: { target: targetX } };

        const generator = animation3DTweener(tweener, input);
        let i = 0;
        const updatedAtIter = 2 + (waitExtraTurn ? 1 : 0);

        while (true) {
          i++;

          const { value: state, done: genDone } = await generator.next(
            i === updatedAtIter ? update : undefined,
          );

          if (genDone) {
            i--;
            break;
          }

          for (const a of ["x", "y"]) {
            const target =
              a === "x" && i >= updatedAtIter
                ? update[a].target
                : input[a].target;

            expect(state[a].target).toBe(target);
            expect(state[a].lag).toBe(input[a].lag);
            expect(state[a].snap).toBe(false);

            expect(state[a].initial).toBe(input[a].current);

            expect(state[a].previous).toBe(state[a].current - step);
          }

          // On the first iteration, current for X is step (its first target)
          // Then if waitExtraTurn is false, update is applied on the second
          // iteration and incrementing continues
          // Otherwise, its generator finishes (state is same) and
          // incrementing continues from iteration 3
          expect(state.x.current).toBe(
            Math.min(
              update.x.target,
              input.x.current + (i - (i > 1 && waitExtraTurn ? 1 : 0)) * step,
            ),
          );

          expect(state.y.current).toBe(
            Math.min(input.y.target, input.y.current + i * step),
          );

          expect(state.z).toBeUndefined();
        }

        const nCallsX = Math.ceil((targetX - input.x.current) / step);
        const nCallsY = Math.ceil((input.y.target - input.y.current) / step);

        // if waitExtraTurn is true at i = 2, the X callback is
        // not called, because its generator has finished, so number of
        // iterations is 1 extra
        expect(i).toBe(Math.max((waitExtraTurn ? 1 : 0) + nCallsX, nCallsY));

        if (perAxisCbk) {
          expect(cbk.x).toHaveBeenCalledTimes(nCallsX);
          expect(cbk.y).toHaveBeenCalledTimes(nCallsY);
        } else {
          expect(cbk).toHaveBeenCalledTimes(nCallsX + nCallsY);
        }
      });
    }
  }

  for (const snapWithLag of [true, false]) {
    test(`X ${snapWithLag ? "lag = 0" : "snap"} in init`, async () => {
      const step = 10;

      const cbk = {
        x: jest.fn(() => {
          throw "Shouldn't be called";
        }),
        y: jest.fn(({ current }) => current + step),
      };

      const tweener = { x: newTweener(cbk.x), y: newTweener(cbk.y) };

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

      const generator = animation3DTweener(tweener, input);
      let i = 0;
      for await (const state of generator) {
        i++;

        for (const a of ["x", "y"]) {
          expect(state[a].target).toBe(input[a].target);
          expect(state[a].lag).toBe(input[a].lag);
          expect(state[a].snap).toBe(a === "x" && !snapWithLag);

          expect(state[a].initial).toBe(input[a].current);

          expect(state[a].current).toBe(
            a === "x"
              ? input[a].target
              : Math.min(input[a].target, input[a].current + i * step),
          );

          expect(state[a].previous).toBe(
            a === "x" ? input[a].current : state[a].current - step,
          );
        }

        expect(state.z).toBeUndefined();
      }

      const nCalls = Math.ceil((input.y.target - input.y.current) / step);
      expect(i).toBe(nCalls);

      expect(cbk.x).toHaveBeenCalledTimes(0);
      expect(cbk.y).toHaveBeenCalledTimes(nCalls);
    });

    test(`X ${snapWithLag ? "lag = 0" : "snap"} in update`, async () => {
      const step = 10;

      const cbk = {
        x: jest.fn(({ current }) => current + step),
        y: jest.fn(({ current }) => current + step),
      };

      const tweener = { x: newTweener(cbk.x), y: newTweener(cbk.y) };

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

      const update = { x: snapWithLag ? { lag: 0 } : { snap: true } };

      const generator = animation3DTweener(tweener, input);
      let i = 0;

      while (true) {
        i++;

        const { value: state, done: genDone } = await generator.next(update);

        if (genDone) {
          i--;
          break;
        }

        for (const a of ["x", "y"]) {
          expect(state[a].target).toBe(input[a].target);
          expect(state[a].lag).toBe(
            a === "x" && i > 1 && snapWithLag ? 0 : input[a].lag,
          );
          expect(state[a].snap).toBe(a === "x" && i > 1 && !snapWithLag);

          expect(state[a].initial).toBe(input[a].current);

          expect(state[a].current).toBe(
            a === "x" && i > 1 ? input[a].target : input[a].current + i * step,
          );

          expect(state[a].previous).toBe(
            a === "x" && i > 1 ? input[a].current : state[a].current - step,
          );
        }

        expect(state.z).toBeUndefined();
      }

      const nCalls = Math.ceil((input.y.target - input.y.current) / step);
      expect(i).toBe(nCalls);

      expect(cbk.x).toHaveBeenCalledTimes(1);
      expect(cbk.y).toHaveBeenCalledTimes(nCalls);
    });

    test(`XY ${snapWithLag ? "lag = 0" : "snap"} in init but updated + target for X at i=1`, async () => {
      const step = 10;

      const cbk = {
        x: jest.fn(({ current }) => current + step),
        y: jest.fn(() => {
          throw "Shouldn't be called";
        }),
      };

      const tweener = { x: newTweener(cbk.x), y: newTweener(cbk.y) };

      const lag = 100;
      const targetX = 200;
      const input = {
        x: {
          current: targetX / 10,
          target: targetX / 2, // snap to this target first
          lag: snapWithLag ? 0 : lag,
          snap: !snapWithLag,
        },
        y: {
          current: 0,
          target: 40,
          lag: snapWithLag ? 0 : lag,
          snap: !snapWithLag,
        },
        // omit z
      };

      const update = { x: { lag, target: targetX } }; // omit snap

      const generator = animation3DTweener(tweener, input);
      let i = 0;

      while (true) {
        i++;

        const { value: state, done: genDone } = await generator.next(update);

        if (genDone) {
          i--;
          break;
        }

        for (const a of ["x", "y"]) {
          const target =
            a === "x" && i > 1 ? update[a].target : input[a].target;

          expect(state[a].target).toBe(target);
          expect(state[a].lag).toBe(
            a === "x" && i > 1 ? update[a].lag : input[a].lag,
          );
          expect(state[a].snap).toBe(
            a === "y" || i === 1 ? input[a].snap : false,
          );

          expect(state[a].current).toBe(
            // X and Y snapped to initial targets, but for i > 1 X is further
            // incremented to another target
            a === "y" || i === 1
              ? input[a].target
              : input[a].target + (i - 1) * step,
          );

          expect(state[a].previous).toBe(
            a === "y" || i === 1 ? input[a].current : state[a].current - step,
          );
        }

        expect(state.z).toBeUndefined();
      }

      // snapping doesn't result in the callback being called, but it does
      // result in 1 extra iteration at the start
      const nCalls = Math.ceil((targetX - input.x.target) / step);
      expect(i).toBe(nCalls + 1);

      expect(cbk.x).toHaveBeenCalledTimes(nCalls);
      expect(cbk.y).toHaveBeenCalledTimes(0);
    });
  }
});
