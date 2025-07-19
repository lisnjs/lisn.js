const { jest, test, expect } = require("@jest/globals");

const utils = window.LISN.utils;

test("onEveryAnimationFrame", async () => {
  const callback = jest.fn(() => callback.mock.calls.length < 3);
  utils.onEveryAnimationFrame(callback);
  expect(callback).toHaveBeenCalledTimes(0);

  await window.waitFor(500);
  expect(callback).toHaveBeenCalledTimes(3);

  expect(callback.mock.calls[0][0]).toBe(0); // total elapsed, 1st time
  expect(callback.mock.calls[0][1]).toBe(0); // elapsed since last, 1st time

  expect(callback.mock.calls[1][0]).toBeGreaterThan(0); // total elapsed, 2nd time
  expect(callback.mock.calls[1][1]).toBeGreaterThan(0); // elapsed since last, 2nd time

  expect(callback.mock.calls[2][0]).toBeGreaterThan(callback.mock.calls[1][0]); // total elapsed, 3rd time
  expect(callback.mock.calls[2][1]).toBeGreaterThan(callback.mock.calls[1][1]); // elapsed since last, 3rd time
});
