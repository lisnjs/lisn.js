const { describe, jest, test, expect } = require("@jest/globals");

const utils = window.LISN.utils;

test("onEveryAnimationFrame", async () => {
  const callback = jest.fn(() => callback.mock.calls.length < 4);
  utils.onEveryAnimationFrame(callback);
  expect(callback).toHaveBeenCalledTimes(0);

  await window.waitFor(500);
  expect(callback).toHaveBeenCalledTimes(4);

  // 1st time
  expect(callback.mock.calls[0][0].total).toBe(0);
  expect(callback.mock.calls[0][0].sinceLast).toBe(0);

  // 2nd time
  expect(callback.mock.calls[1][0].total).toBeGreaterThan(0);
  expect(callback.mock.calls[1][0].sinceLast).toBeGreaterThan(0);

  // 3rd time
  expect(callback.mock.calls[2][0].total).toBeGreaterThan(
    callback.mock.calls[1][0].total,
  );
  expect(callback.mock.calls[2][0].sinceLast).toBeGreaterThan(0);

  // 4th time
  expect(callback.mock.calls[3][0].total).toBeGreaterThan(
    callback.mock.calls[2][0].total,
  );
  expect(callback.mock.calls[3][0].sinceLast).toBeGreaterThan(0);
});

describe("newCriticallyDampedAnimationIterator", () => {
  test("for loop", async () => {
    const lTarget = 200;
    const lag = 100;
    const dt = 10;
    let l = 100,
      t = 0,
      i = 0;

    const iterator = utils.newCriticallyDampedAnimationIterator({
      l,
      lTarget,
      lag,
    });

    for await ({ l, t } of iterator) {
      i++;

      if (i == Math.round(lag / dt) - 1) {
        expect(Math.round(Math.abs(l - lTarget))).toBeLessThan(2);
      }
    }

    expect(i).toBeLessThan((lag * 2) / dt);
    expect(t).toBeLessThan(lag * 2);
  });

  test("with updating target", async () => {
    const lTarget = 200;
    const lag = 100;
    const dt = 10;
    let l = 100,
      t = 0,
      i = 0;

    const iterator = utils.newCriticallyDampedAnimationIterator({
      l,
      lTarget: lTarget / 2,
      lag,
    });

    let done = false;
    while (
      ({
        value: { l, t },
        done,
      } = await iterator.next(i > 1 ? lTarget : undefined))
    ) {
      i++;

      if (i == Math.round(lag / dt) - 1) {
        expect(Math.round(Math.abs(l - lTarget))).toBeLessThan(2);
      }

      if (done) {
        break;
      }
    }

    expect(i).toBeLessThan((lag * 2) / dt);
    expect(t).toBeLessThan(lag * 2);
  });
});
