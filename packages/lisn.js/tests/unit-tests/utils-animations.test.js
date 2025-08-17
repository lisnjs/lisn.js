const { jest, test, expect } = require("@jest/globals");

const { onEveryAnimationFrame, animationFrameGenerator, sum } =
  window.LISN.utils;

test("onEveryAnimationFrame", async () => {
  let nCalls = 0;
  const maxCalls = 5;
  const callback = jest.fn(() => ++nCalls < maxCalls);
  onEveryAnimationFrame(callback);
  expect(callback).toHaveBeenCalledTimes(0);

  await window.waitFor(500);
  expect(callback).toHaveBeenCalledTimes(maxCalls);
  for (let c = 0; c++; c < maxCalls) {
    if (c === 0) {
      expect(callback.mock.calls[c][0].total).toBe(0);
      expect(callback.mock.calls[c][0].sinceLast).toBe(0);
    } else {
      expect(callback.mock.calls[c][0].sinceLast).toBeGreaterThan(0);
      expect(callback.mock.calls[c][0].sinceLast).toBeLessThan(20);
      expect(callback.mock.calls[c][0].total).toBe(
        sum(...callback.mock.calls.slice(0, c + 1).map((a) => a[0].sinceLast)),
      );
    }
  }
});

test("animationFrameGenerator", async () => {
  let c = 0;
  const times = [];
  for await (const { total, sinceLast } of animationFrameGenerator()) {
    times.push({ total, sinceLast });

    if (c === 0) {
      expect(total).toBe(0);
      expect(sinceLast).toBe(0);
    } else {
      expect(sinceLast).toBeGreaterThan(0);
      expect(sinceLast).toBeLessThan(20);
      expect(total).toBe(sum(...times.map((a) => a.sinceLast)));
    }

    c++;
    if (c > 5) {
      break;
    }
  }
});
