const { jest, describe, test, expect } = require("@jest/globals");

const { isValidBox, isValidDimension } = window.LISN.utils;
const { SizeWatcher } = window.LISN.watchers;

// for convenience we don't use the default config, but set everything to 0
// unless explicitly given
const newWatcherElement = (
  { numEls, config } = { numEls: 5, config: null },
) => {
  const callback = jest.fn();

  const defaultConfig = {
    debounceWindow: 0,
    resizeThreshold: 0,
  };
  config = {
    ...defaultConfig,
    ...(config || {}),
  };

  const watcher = SizeWatcher.create(config);

  numEls = numEls === undefined ? 5 : numEls;

  let elements = [];
  for (let i = 0; i < numEls; i++) {
    elements.push(document.createElement("div"));
  }

  const resizeAll = (content, border) => {
    for (const e of elements) {
      e.resize(content, border);
    }
  };

  return { callback, watcher, elements, resizeAll };
};

const defaultSizeData = {
  border: {
    width: 0,
    height: 0,
  },
  content: {
    width: 0,
    height: 0,
  },
};

test("illegal constructor", () => {
  expect(() => new SizeWatcher()).toThrow(/Illegal constructor/);
});

test("create reusable", () => {
  const defaultConfig = {
    debounceWindow: 75,
    resizeThreshold: 50,
  };
  const watcherA = SizeWatcher.reuse();
  const watcherB = SizeWatcher.reuse(defaultConfig);
  const watcherC = SizeWatcher.reuse({
    resizeThreshold: 10,
  });
  const watcherD = SizeWatcher.reuse({
    ...defaultConfig,
    resizeThreshold: 10,
  });

  expect(watcherA).toBeInstanceOf(SizeWatcher);
  expect(watcherA).toBe(watcherB);
  expect(watcherA).not.toBe(watcherC);

  expect(watcherC).toBeInstanceOf(SizeWatcher);
  expect(watcherC).toBe(watcherD);
});

describe("initial call", () => {
  test("all default: first and subsequent of type", async () => {
    const { callback, watcher, elements } = newWatcherElement();
    for (const e of elements) {
      await watcher.onResize(callback, { target: e });
    }

    await window.waitForRO();

    expect(callback).toHaveBeenCalledTimes(elements.length);
    for (let i = 1; i <= elements.length; i++) {
      expect(callback).toHaveBeenNthCalledWith(
        i,
        elements[i - 1],
        defaultSizeData,
        undefined,
        watcher,
      );
    }

    const callbackB = jest.fn();
    for (const e of elements) {
      await watcher.onResize(callbackB, { target: e });
    }

    // no ResizeObserver trigger but callback would be invoked manually
    await window.waitForRO();

    expect(callback).toHaveBeenCalledTimes(elements.length); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(elements.length);
    for (let i = 1; i <= elements.length; i++) {
      expect(callbackB).toHaveBeenNthCalledWith(
        i,
        elements[i - 1],
        defaultSizeData,
        undefined,
        watcher,
      );
    }
  });

  test("with threshold: first and subsequent of type", async () => {
    const { callback, watcher, elements } = newWatcherElement();
    for (const e of elements) {
      await watcher.onResize(callback, { target: e, threshold: 50 });
    }

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(elements.length);
    for (let i = 1; i <= elements.length; i++) {
      expect(callback).toHaveBeenNthCalledWith(
        i,
        elements[i - 1],
        defaultSizeData,
        undefined,
        watcher,
      );
    }

    const callbackB = jest.fn();
    for (const e of elements) {
      await watcher.onResize(callbackB, { target: e, threshold: 50 });
    }

    // no ResizeObserver trigger but callback would be invoked manually
    await window.waitForRO();

    expect(callback).toHaveBeenCalledTimes(elements.length); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(elements.length);
    for (let i = 1; i <= elements.length; i++) {
      expect(callbackB).toHaveBeenNthCalledWith(
        i,
        elements[i - 1],
        defaultSizeData,
        undefined,
        watcher,
      );
    }
  });

  test("with debounceWindow: first and subsequent of type", async () => {
    const { callback, watcher, elements, resizeAll } = newWatcherElement({
      config: { debounceWindow: 500 },
      numEls: 1,
    });
    const element = elements[0];

    await watcher.onResize(callback, { target: element }); // observe 1st

    // Initial call should not be debounced
    await window.waitForRO();

    expect(callback).toHaveBeenCalledTimes(1);
    for (let i = 1; i <= elements.length; i++) {
      expect(callback).toHaveBeenNthCalledWith(
        i,
        elements[i - 1],
        defaultSizeData,
        undefined,
        watcher,
      );
    }

    resizeAll([1, 1], [1, 1]);
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls YET

    // Add callback B
    const callbackB = jest.fn();
    await watcher.onResize(callbackB, { target: element });

    // Initial call should not be debounced
    await window.waitForRO();
    expect(callbackB).toHaveBeenCalledTimes(1);

    expect(callback).toHaveBeenCalledTimes(1); // no new calls YET

    await window.waitFor(520);
    expect(callback).toHaveBeenCalledTimes(2); // now called due to resize
    expect(callbackB).toHaveBeenCalledTimes(1); // no new calls since the initial
  });

  test("skipInitial: first and subsequent of type", async () => {
    const { callback, watcher, elements, resizeAll } = newWatcherElement();
    for (const e of elements) {
      await watcher.onResize(callback, { target: e, skipInitial: true });
    }

    const callbackB = jest.fn();
    for (const e of elements) {
      await watcher.onResize(callbackB, { target: e, skipInitial: true });
    }

    await window.waitForRO();

    expect(callback).toHaveBeenCalledTimes(0); // skipped
    expect(callbackB).toHaveBeenCalledTimes(0); // skipped

    const callbackC = jest.fn();
    for (const e of elements) {
      await watcher.onResize(callbackC, { target: e, skipInitial: true });
    }

    await window.waitForRO();

    expect(callback).toHaveBeenCalledTimes(0); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(0); // no new calls
    expect(callbackC).toHaveBeenCalledTimes(0); // skipped

    // trigger call
    resizeAll([0, 0], [0, 0]);

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // no resize in any direction
    expect(callbackB).toHaveBeenCalledTimes(0); // no resize in any direction
    expect(callbackC).toHaveBeenCalledTimes(0); // no resize in any direction

    resizeAll([1, 1], [1, 1]);
    await window.waitForRO();

    for (const cbk of [callback, callbackB, callbackC]) {
      expect(cbk).toHaveBeenCalledTimes(elements.length);
      for (let i = 1; i <= elements.length; i++) {
        expect(cbk).toHaveBeenNthCalledWith(
          i,
          elements[i - 1],
          {
            border: {
              width: 1,
              height: 1,
            },
            content: {
              width: 1,
              height: 1,
            },
          },
          defaultSizeData,
          watcher,
        );
      }
    }

    const callbackD = jest.fn();
    for (const e of elements) {
      await watcher.onResize(callbackD, { target: e, skipInitial: true });
    }

    // no ResizeObserver trigger but callback would be invoked manually
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(elements.length); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(elements.length); // no new calls
    expect(callbackC).toHaveBeenCalledTimes(elements.length); // no new calls
    expect(callbackD).toHaveBeenCalledTimes(0); // skipped

    resizeAll();

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(2 * elements.length); // called again
    expect(callbackB).toHaveBeenCalledTimes(2 * elements.length); // called again
    expect(callbackC).toHaveBeenCalledTimes(2 * elements.length); // called again
    expect(callbackD).toHaveBeenCalledTimes(elements.length);
  });
});

describe("duplicate handler", () => {
  test("same options", async () => {
    const { callback, watcher, elements } = newWatcherElement({ numEls: 1 });
    const element = elements[0];
    await Promise.all([
      watcher.onResize(callback, { target: element }),
      watcher.onResize(callback, { target: element }),
    ]);

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(1); // initial call of 2nd one

    await watcher.onResize(callback, { target: element });

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(2); // initial call

    element.resize();

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(3);
  });

  test("different options", async () => {
    const { callback, watcher, elements } = newWatcherElement({ numEls: 1 });
    const element = elements[0];
    watcher.onResize(callback, { target: element }); // removed immediately
    await watcher.onResize(callback, { target: element, dimension: "width" });

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(1); // initial call of 2nd one

    await watcher.onResize(callback, { target: element, dimension: "height" });

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(2); // initial call

    element.resize();

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe("offResize", () => {
  test("1 of 1: awaiting", async () => {
    const { callback, watcher, elements } = newWatcherElement({
      numEls: 1,
    });
    const element = elements[0];

    await watcher.onResize(callback, { target: element });
    await watcher.offResize(callback, element);

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("1 of 1 immediate", async () => {
    const { callback, watcher, elements } = newWatcherElement({
      numEls: 1,
    });
    const element = elements[0];

    watcher.onResize(callback, { target: element });
    watcher.offResize(callback, element);

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("1 of 1 immediate + mismatching options", async () => {
    const { callback, watcher, elements } = newWatcherElement({
      numEls: 1,
    });
    const element = elements[0];

    watcher.onResize(callback, { target: element, box: "" });
    watcher.offResize(callback, element);

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("1 of 1 immediate for subsequent of type and later for first of type", async () => {
    const { callback, watcher, elements, resizeAll } = newWatcherElement({
      numEls: 1,
    });
    const element = elements[0];

    await watcher.onResize(callback, { target: element });

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(1);

    const callbackB = jest.fn();

    // No ResizeObserver trigger but callback would be invoked manually
    // immediately as there's already size data for this observe type
    watcher.onResize(callbackB, { target: element });

    // remove both
    watcher.offResize(callback, element);
    watcher.offResize(callbackB, element);

    await window.waitForRO();

    expect(callback).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(0);

    resizeAll();
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(0); // no new calls
  });
});

describe("targets", () => {
  test("invalid", async () => {
    const { callback, watcher } = newWatcherElement({ numEls: 0 });

    await expect(() =>
      watcher.onResize(callback, {
        target: "invalid",
      }),
    ).rejects.toThrow(/Unsupported resize target/);
  });

  for (const target of [undefined, null, window]) {
    // TODO test.each
    test(target + " -> viewport overlay", async () => {
      const { callback, watcher } = newWatcherElement({ numEls: 0 });

      await watcher.onResize(callback, { target });

      await window.waitForRO();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback.mock.calls[0].length).toBe(4);
      expect(callback.mock.calls[0][0].classList.contains("lisn-overlay")).toBe(
        true,
      );
    });
  }

  test("document -> documentElement", async () => {
    const { callback, watcher } = newWatcherElement({ numEls: 0 });

    await watcher.onResize(callback, { target: document });

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0].length).toBe(4);
    expect(callback.mock.calls[0][0]).toBe(document.documentElement);
  });
});

describe("threshold", () => {
  for (const [title, watcherConf, onResizeConf] of [
    // TODO test.each
    ["from onResize", { resizeThreshold: 10 }, { threshold: 50 }],
    ["from config", { resizeThreshold: 50 }, {}],
    ["+skipInitial", { resizeThreshold: 50 }, { skipInitial: true }],
  ]) {
    test(title, async () => {
      const { callback, watcher, elements } = newWatcherElement({
        config: watcherConf,
        numEls: 1,
      });
      const element = elements[0];

      element.resize([10, 20], [0, 0]); // sets last threshold to 0, 20
      await watcher.onResize(callback, { target: element, ...onResizeConf });

      await window.waitForRO();

      let nCalls = 0;
      let data = {
        border: {
          width: 10,
          height: 20,
        },
        content: {
          width: 0,
          height: 0,
        },
      };
      let lastData = undefined;
      if (onResizeConf.skipInitial) {
        expect(callback).toHaveBeenCalledTimes(0); // skipped
      } else {
        nCalls++;
        expect(callback).toHaveBeenCalledTimes(nCalls); // initial call
        expect(callback).toHaveBeenNthCalledWith(
          nCalls,
          element,
          data,
          lastData,
          watcher,
        );
      }
      lastData = data;

      element.resize([0, 0], [0, 0]); // max change of -20
      await window.waitForRO();
      expect(callback).toHaveBeenCalledTimes(nCalls);

      element.resize([10, 69], [0, 0]); // max change of +49
      await window.waitForRO();
      expect(callback).toHaveBeenCalledTimes(nCalls);

      element.resize([15, 70], [5, 5]); // max change of +50 => trigger
      await window.waitForRO();
      data = {
        border: {
          width: 15,
          height: 70,
        },
        content: {
          width: 5,
          height: 5,
        },
      };
      expect(callback).toHaveBeenCalledTimes(++nCalls);
      expect(callback).toHaveBeenNthCalledWith(
        nCalls,
        element,
        data,
        lastData,
        watcher,
      );
      lastData = data;

      element.resize([0, 21], [0, 0]); // max change of -49
      await window.waitForRO();
      expect(callback).toHaveBeenCalledTimes(nCalls);

      element.resize([10, 20], [1, 1]); // max change of -50 => trigger
      await window.waitForRO();
      data = {
        border: {
          width: 10,
          height: 20,
        },
        content: {
          width: 1,
          height: 1,
        },
      };
      expect(callback).toHaveBeenCalledTimes(++nCalls);
      expect(callback).toHaveBeenNthCalledWith(
        nCalls,
        element,
        data,
        lastData,
        watcher,
      );
      lastData = data;
    });
  }
});

describe("box (0 threshold, effective 1)", () => {
  test("invalid", async () => {
    const { callback, watcher, elements } = newWatcherElement({ numEls: 1 });
    const element = elements[0];

    await expect(() =>
      watcher.onResize(callback, {
        target: element,
        box: "invalid",
      }),
    ).rejects.toThrow(/Unknown box type/);
  });

  test("border", async () => {
    const { callback, watcher, elements } = newWatcherElement({ numEls: 1 });
    const element = elements[0];
    element.resize([1, 1], [0, 0]); // sets last threshold to 1, 1

    await watcher.onResize(callback, {
      target: element,
      box: "border",
      skipInitial: true,
    });

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    element.resize([1, 1], [60, 60]); // border size not changed
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // no new calls

    element.resize([2, 2], [60, 60]); // border size changed
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("content", async () => {
    const { callback, watcher, elements } = newWatcherElement({ numEls: 1 });
    const element = elements[0];
    element.resize([0, 0], [1, 1]); // sets last threshold to 1, 1

    await watcher.onResize(callback, {
      target: element,
      box: "content",
      skipInitial: true,
    });

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    element.resize([100, 100], [1, 1]); // content size not changed
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // no new calls

    element.resize([100, 100], [2, 2]); // content size changed
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("dimension (0 threshold)", () => {
  test("invalid", async () => {
    const { callback, watcher, elements } = newWatcherElement({ numEls: 1 });
    const element = elements[0];

    await expect(() =>
      watcher.onResize(callback, {
        target: element,
        dimension: "invalid",
      }),
    ).rejects.toThrow(/Unknown dimension/);
  });

  test("width", async () => {
    const { callback, watcher, elements } = newWatcherElement({ numEls: 1 });
    const element = elements[0];
    element.resize([1, 0], [0, 0]); // sets last threshold to 1

    await watcher.onResize(callback, {
      target: element,
      dimension: "width",
      skipInitial: true,
    });

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    element.resize([1, 1], [0, 0]); // width not changed
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // no new calls

    element.resize([2, 1], [0, 0]); // width changed
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("height", async () => {
    const { callback, watcher, elements } = newWatcherElement({ numEls: 1 });
    const element = elements[0];
    element.resize([0, 1], [0, 0]); // sets last threshold to 1

    await watcher.onResize(callback, {
      target: element,
      dimension: "height",
      skipInitial: true,
    });

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    element.resize([1, 1], [0, 0]); // height not changed
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // no new calls

    element.resize([1, 2], [0, 0]); // height changed
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("box + threshold", () => {
  test("border", async () => {
    const { callback, watcher, elements } = newWatcherElement({ numEls: 1 });
    const element = elements[0];
    element.resize([10, 10], [0, 0]); // sets last threshold to 10, 10

    await watcher.onResize(callback, {
      target: element,
      threshold: 50,
      box: "border",
      skipInitial: true,
    });

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    element.resize([0, 0], [60, 60]); // border size -10
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // no new calls

    element.resize([100, 100], [60, 60]); // border size +100
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("content", async () => {
    const { callback, watcher, elements } = newWatcherElement({ numEls: 1 });
    const element = elements[0];
    element.resize([0, 0], [10, 10]); // sets last threshold to 10, 10

    await watcher.onResize(callback, {
      target: element,
      threshold: 50,
      box: "content",
      skipInitial: true,
    });

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    element.resize([60, 60], [0, 0]); // content size -10
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // no new calls

    element.resize([60, 60], [100, 100]); // content size +100
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("dimension + threshold", () => {
  test("width", async () => {
    const { callback, watcher, elements } = newWatcherElement({ numEls: 1 });
    const element = elements[0];
    element.resize([10, 0], [10, 0]); // sets last threshold to 10, 10

    await watcher.onResize(callback, {
      target: element,
      threshold: 50,
      dimension: "width",
      skipInitial: true,
    });

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    element.resize([0, 60], [0, 60]); // width size -10
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // no new calls

    element.resize([100, 60], [100, 60]); // width size +100
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("height", async () => {
    const { callback, watcher, elements } = newWatcherElement({ numEls: 1 });
    const element = elements[0];
    element.resize([0, 10], [0, 10]); // sets last threshold to 10, 10

    await watcher.onResize(callback, {
      target: element,
      threshold: 50,
      dimension: "height",
      skipInitial: true,
    });

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    element.resize([60, 0], [60, 0]); // height size -10
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // no new calls

    element.resize([60, 100], [60, 100]); // height size +100
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("box + dimension + threshold", () => {
  test("border width", async () => {
    const { callback, watcher, elements } = newWatcherElement({ numEls: 1 });
    const element = elements[0];
    element.resize([10, 0], [0, 0]); // sets last threshold to 10

    await watcher.onResize(callback, {
      target: element,
      threshold: 50,
      box: "border",
      dimension: "width",
      skipInitial: true,
    });

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    element.resize([0, 60], [60, 60]); // border width size -10
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // no new calls

    element.resize([100, 60], [60, 60]); // border width size +100
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("border height", async () => {
    const { callback, watcher, elements } = newWatcherElement({ numEls: 1 });
    const element = elements[0];
    element.resize([0, 10], [0, 0]); // sets last threshold to 10

    await watcher.onResize(callback, {
      target: element,
      threshold: 50,
      box: "border",
      dimension: "height",
      skipInitial: true,
    });

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    element.resize([60, 0], [60, 60]); // border height size -10
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // no new calls

    element.resize([60, 100], [60, 60]); // border height size +100
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("content width", async () => {
    const { callback, watcher, elements } = newWatcherElement({ numEls: 1 });
    const element = elements[0];
    element.resize([0, 0], [10, 0]); // sets last threshold to 10

    await watcher.onResize(callback, {
      target: element,
      threshold: 50,
      box: "content",
      dimension: "width",
      skipInitial: true,
    });

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    element.resize([60, 60], [0, 60]); // content width size -10
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // no new calls

    element.resize([60, 60], [100, 60]); // content width size +100
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("content height", async () => {
    const { callback, watcher, elements } = newWatcherElement({ numEls: 1 });
    const element = elements[0];
    element.resize([0, 0], [0, 10]); // sets last threshold to 10

    await watcher.onResize(callback, {
      target: element,
      threshold: 50,
      box: "content",
      dimension: "height",
      skipInitial: true,
    });

    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    element.resize([60, 60], [60, 0]); // content height size -10
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(0); // no new calls

    element.resize([60, 60], [60, 100]); // content height size +100
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("cleanup on removal", () => {
  test("removing immediately", async () => {
    const { callback, watcher, elements } = newWatcherElement();
    const element = elements[0];

    watcher.onResize(callback, { target: element });
    watcher.offResize(callback, element);

    await window.waitForRO();
    expect(window.ResizeObserver.instances.get(element)?.size || 0).toBe(0);
  });

  test("removing later", async () => {
    const { callback, watcher, elements } = newWatcherElement({ numEls: 1 });
    const callbackB = jest.fn();
    const element = elements[0];

    expect(window.ResizeObserver.instances.get(element)?.size || 0).toBe(0);

    await watcher.onResize(callback, { target: element });
    await watcher.onResize(callbackB, { target: element }); // same watcher

    await window.waitForRO();
    const observers = window.ResizeObserver.instances.get(element);
    expect(observers.size).toBe(2); // content box and border box

    expect(callback).toHaveBeenCalledTimes(1); // initial call
    expect(callbackB).toHaveBeenCalledTimes(1); // initial call

    for (const observer of observers) {
      expect(observer.targets.size).toBe(1);
    }

    // remove callback B
    await watcher.offResize(callbackB, element);

    element.resize();
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callbackB).toHaveBeenCalledTimes(1); // no new calls

    for (const observer of observers) {
      expect(observer.targets.size).toBe(1);
    }

    // remove callback A
    await watcher.offResize(callback, element);

    element.resize();
    await window.waitForRO();
    expect(callback).toHaveBeenCalledTimes(2); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(1); // no new calls

    for (const observer of observers) {
      expect(observer.targets.size).toBe(0); // should have been unobserved
    }

    expect(window.ResizeObserver.instances.get(element)?.size || 0).toBe(0);
  });
});

describe("trackSize", () => {
  test("adding", async () => {
    const { watcher, elements } = newWatcherElement({ numEls: 1 });
    const element = elements[0];

    element.resize([10, 20], [5, 7]);

    const mutationFn = jest.fn();
    const mo = new MutationObserver(mutationFn);
    mo.observe(element, {
      attributes: true,
    });

    watcher.noTrackSize(null, element); // no-op
    watcher.trackSize(null, { target: element });
    watcher.trackSize(null, { target: element }); // no-op
    await watcher.trackSize(null, { target: element }); // no-op

    await window.waitForRO();
    await window.waitForAF();

    expect(element.style.getPropertyValue("--lisn-js--border-width")).toBe(
      "10",
    );
    expect(element.style.getPropertyValue("--lisn-js--border-height")).toBe(
      "20",
    );
    expect(element.style.getPropertyValue("--lisn-js--content-width")).toBe(
      "5",
    );
    expect(element.style.getPropertyValue("--lisn-js--content-height")).toBe(
      "7",
    );

    await window.waitForAF();
    expect(mutationFn).toHaveBeenCalledTimes(1);
  });

  test("removing", async () => {
    const { watcher, elements } = newWatcherElement({ numEls: 1 });
    const element = elements[0];

    element.resize([10, 20], [5, 7]);

    const mutationFn = jest.fn();
    const mo = new MutationObserver(mutationFn);
    mo.observe(element, {
      attributes: true,
    });

    await watcher.trackSize(null, { target: element });

    await window.waitForRO();
    await window.waitForAF();

    expect(element.style.getPropertyValue("--lisn-js--border-width")).toBe(
      "10",
    );
    expect(element.style.getPropertyValue("--lisn-js--border-height")).toBe(
      "20",
    );
    expect(element.style.getPropertyValue("--lisn-js--content-width")).toBe(
      "5",
    );
    expect(element.style.getPropertyValue("--lisn-js--content-height")).toBe(
      "7",
    );

    await window.waitForAF();
    expect(mutationFn).toHaveBeenCalledTimes(1);

    await watcher.noTrackSize(null, element);
    await window.waitForAF();

    expect(element.style.getPropertyValue("--lisn-js--border-width")).toBe("");
    expect(element.style.getPropertyValue("--lisn-js--border-height")).toBe("");
    expect(element.style.getPropertyValue("--lisn-js--content-width")).toBe("");
    expect(element.style.getPropertyValue("--lisn-js--content-height")).toBe(
      "",
    );

    await window.waitForAF();
    expect(mutationFn).toHaveBeenCalledTimes(2);
  });

  test("on window", async () => {
    const { watcher } = newWatcherElement({ numEls: 0 });

    await watcher.trackSize();

    await window.waitForRO();
    await window.waitForAF();

    expect(
      document.documentElement.style.getPropertyValue(
        "--lisn-js--window-border-width",
      ),
    ).toBe("0");
    expect(
      document.documentElement.style.getPropertyValue(
        "--lisn-js--window-border-height",
      ),
    ).toBe("0");
    expect(
      document.documentElement.style.getPropertyValue(
        "--lisn-js--window-content-width",
      ),
    ).toBe("0");
    expect(
      document.documentElement.style.getPropertyValue(
        "--lisn-js--window-content-height",
      ),
    ).toBe("0");
  });
});

test("fetchCurrentSize", async () => {
  const { watcher, elements } = newWatcherElement({
    numEls: 1,
  });
  const element = elements[0];
  element.resize([1, 2], [3, 4]);
  const tStart = Date.now();
  const size = await watcher.fetchCurrentSize(element);
  const tEnd = Date.now();
  expect(size).toEqual({
    border: {
      width: 1,
      height: 2,
    },
    content: {
      width: 3,
      height: 4,
    },
  });
  expect(tEnd - tStart).toBeLessThan(20);
});

describe("isValidBox", () => {
  for (const box of ["content", "border"]) {
    test(box, () => {
      expect(isValidBox(box)).toBe(true);
    });
  }

  test("invalid", () => {
    expect(isValidBox("content,border")).toBe(false);
    expect(isValidBox("")).toBe(false);
    expect(isValidBox(" ")).toBe(false);
    expect(isValidBox(" , ")).toBe(false);
    expect(isValidBox("random")).toBe(false);
  });
});

describe("isValidDimension", () => {
  for (const dimension of ["width", "height"]) {
    test(dimension, () => {
      expect(isValidDimension(dimension)).toBe(true);
    });
  }

  test("invalid", () => {
    expect(isValidDimension("width,height")).toBe(false);
    expect(isValidDimension("")).toBe(false);
    expect(isValidDimension(" ")).toBe(false);
    expect(isValidDimension(" , ")).toBe(false);
    expect(isValidDimension("random")).toBe(false);
  });
});
