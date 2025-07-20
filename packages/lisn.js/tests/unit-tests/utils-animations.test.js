const { jest, test, expect } = require("@jest/globals");

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
