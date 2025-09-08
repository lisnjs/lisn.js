const { jest, describe, test, expect } = require("@jest/globals");

const utils = window.LISN.utils;

const timeDiffTolerance = 25;

const roundDiff = (x, y) => {
  return Math.floor(Math.abs(x - y));
};

test("waitForDelay", async () => {
  const startTime = Date.now();
  await utils.waitForDelay(500);
  const endTime = Date.now();
  expect(roundDiff(endTime, startTime + 500)).toBeLessThan(timeDiffTolerance);
});

describe("getDebouncedHandler", () => {
  test("debounceWindow > 0", async () => {
    const cbk = jest.fn();
    const debouncedHandler = utils.getDebouncedHandler(50, cbk);
    expect(debouncedHandler).not.toBe(cbk);

    debouncedHandler("a");
    await window.waitFor(10);
    debouncedHandler("b");
    await window.waitFor(10);
    debouncedHandler("c");
    await window.waitFor(40);
    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenCalledWith("c");
  });

  for (const debounceWindow of [0, -10]) {
    test(`debounceWindow = ${debounceWindow}`, () => {
      const cbk = jest.fn();
      const debouncedHandler = utils.getDebouncedHandler(debounceWindow, cbk);
      expect(debouncedHandler).toBe(cbk);
      debouncedHandler("a");
      debouncedHandler("b");
      debouncedHandler("c");
      expect(cbk).toHaveBeenCalledTimes(3);
      expect(cbk).toHaveBeenCalledWith("a");
      expect(cbk).toHaveBeenCalledWith("b");
      expect(cbk).toHaveBeenCalledWith("c");
    });
  }
});

describe("getAsyncDebouncedHandler", () => {
  test("sync handler: debounceWindow > 0", async () => {
    const cbk = jest.fn((a) => a);
    const debouncedHandler = utils.getAsyncDebouncedHandler(50, cbk);

    const sTime = Date.now();
    const p1 = debouncedHandler("a");
    const p2 = debouncedHandler("b");
    await window.waitFor(10);
    const p3 = debouncedHandler("c");

    expect(cbk).toHaveBeenCalledTimes(0);

    await expect(p1).resolves.toEqual({ result: "c" });
    await expect(p2).resolves.toEqual({ result: "c" });
    await expect(p3).resolves.toEqual({ result: "c" });
    expect(Date.now() - sTime).toBeLessThanOrEqual(65); // allow 15ms error

    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenCalledWith("c");
  });

  test("async handler: debounceWindow > 0", async () => {
    const x = [];
    const cbk = jest.fn(
      (n) =>
        new Promise((resolve) => {
          x.push("start" + n);
          window.setTimeout(() => {
            x.push("end" + n);
            resolve(n);
          }, 100);
        }),
    );

    const debouncedHandler = utils.getAsyncDebouncedHandler(50, cbk);

    const sTime = Date.now();
    const p1 = debouncedHandler(1);
    const p2 = debouncedHandler(2);
    await window.waitFor(10);
    const p3 = debouncedHandler(3);

    expect(cbk).toHaveBeenCalledTimes(0);

    const p1Res = await p1;
    const p2Res = await p2;
    const p3Res = await p3;
    const pInner = p1Res.result;

    expect(Date.now() - sTime).toBeLessThanOrEqual(65); // allow 15ms error
    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenCalledWith(3);
    expect(x).toEqual(["start3"]);

    expect(pInner).toBeInstanceOf(Promise);
    expect(p1Res).toEqual({ result: pInner });
    expect(p2Res).toEqual({ result: pInner });
    expect(p3Res).toEqual({ result: pInner });

    await expect(pInner).resolves.toBe(3);
    expect(x).toEqual(["start3", "end3"]);
  });

  for (const debounceWindow of [0, -10]) {
    test(`sync handler: debounceWindow = ${debounceWindow}`, async () => {
      const cbk = jest.fn((a) => a);
      const debouncedHandler = utils.getAsyncDebouncedHandler(
        debounceWindow,
        cbk,
      );
      expect(debouncedHandler).not.toBe(cbk);

      const sTime = Date.now();
      const p1 = debouncedHandler("a");
      const p2 = debouncedHandler("b");
      const p3 = debouncedHandler("c");

      expect(cbk).toHaveBeenCalledTimes(3);
      expect(cbk).toHaveBeenCalledWith("a");
      expect(cbk).toHaveBeenCalledWith("b");
      expect(cbk).toHaveBeenCalledWith("c");

      await expect(p1).resolves.toEqual({ result: "a" });
      await expect(p2).resolves.toEqual({ result: "b" });
      await expect(p3).resolves.toEqual({ result: "c" });
      expect(Date.now() - sTime).toBeLessThanOrEqual(15); // allow 15ms error
    });

    test(`async handler: debounceWindow = ${debounceWindow}`, async () => {
      const x = [];
      const cbk = jest.fn(
        (n) =>
          new Promise((resolve) => {
            x.push("start" + n);
            window.setTimeout(() => {
              x.push("end" + n);
              resolve(n);
            }, 100);
          }),
      );

      const debouncedHandler = utils.getAsyncDebouncedHandler(
        debounceWindow,
        cbk,
      );
      expect(debouncedHandler).not.toBe(cbk);

      const sTime = Date.now();
      const p1 = debouncedHandler(1);
      const p2 = debouncedHandler(2);
      const p3 = debouncedHandler(3);

      expect(cbk).toHaveBeenCalledTimes(3);
      for (let i = 1; i <= 3; i++) {
        expect(cbk).toHaveBeenNthCalledWith(i, i);
      }
      expect(x).toEqual(["start1", "start2", "start3"]);

      const p1Res = await p1;
      const p2Res = await p2;
      const p3Res = await p3;
      expect(Date.now() - sTime).toBeLessThanOrEqual(15); // allow 15ms error
      expect(x).toEqual(["start1", "start2", "start3"]);

      const pInner1 = p1Res.result;
      const pInner2 = p2Res.result;
      const pInner3 = p3Res.result;

      expect(pInner1).toBeInstanceOf(Promise);
      expect(pInner2).toBeInstanceOf(Promise);
      expect(pInner3).toBeInstanceOf(Promise);

      await expect(pInner1).resolves.toBe(1);
      await expect(pInner2).resolves.toBe(2);
      await expect(pInner3).resolves.toBe(3);
      expect(x).toEqual(["start1", "start2", "start3", "end1", "end2", "end3"]);
    });
  }
});
