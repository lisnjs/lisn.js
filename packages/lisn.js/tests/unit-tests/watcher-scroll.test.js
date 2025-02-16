const { jest, describe, test, expect } = require("@jest/globals");

const { isValidScrollDirection, isValidScrollDirectionList } =
  window.LISN.utils;
const { ScrollWatcher } = window.LISN.watchers;

const DIRECTIONS = ["up", "down", "left", "right", "none", "ambiguous"];

window.LISN.settings.contentWrappingAllowed = false;

document.documentElement.enableScroll();

// for convenience we don't use the default config, but set everything to 0
// unless explicitly given
const newWatcherElement = (config = null) => {
  const callback = jest.fn();
  const element = document.createElement("div");
  element.enableScroll();
  const defaultConfig = {
    debounceWindow: 0,
    scrollThreshold: 0,
    scrollDuration: 0,
  };
  config = {
    ...defaultConfig,
    ...(config || {}),
  };

  const watcher = ScrollWatcher.create(config);

  return { watcher, callback, element };
};

const getScrollDataAfterScroll = (direction, x, y) => ({
  scrollTop: y,
  scrollTopFraction: y / (window.SCROLL_HEIGHT - window.CLIENT_HEIGHT),
  scrollLeft: x,
  scrollLeftFraction: x / (window.SCROLL_WIDTH - window.CLIENT_WIDTH),
  scrollWidth: window.SCROLL_WIDTH,
  scrollHeight: window.SCROLL_HEIGHT,
  direction: direction,
  clientWidth: window.CLIENT_WIDTH,
  clientHeight: window.CLIENT_HEIGHT,
});

const defaultScrollData = getScrollDataAfterScroll("none", 0, 0);

test("illegal constructor", () => {
  expect(() => new ScrollWatcher()).toThrow(/Illegal constructor/);
});

test("create reusable", () => {
  const defaultConfig = {
    debounceWindow: 75,
    scrollThreshold: 50,
    scrollDuration: 1000,
  };
  const watcherA = ScrollWatcher.reuse();
  const watcherB = ScrollWatcher.reuse(defaultConfig);
  const watcherC = ScrollWatcher.reuse({
    scrollThreshold: 10,
  });
  const watcherD = ScrollWatcher.reuse({
    ...defaultConfig,
    scrollThreshold: 10,
  });

  expect(watcherA).toBeInstanceOf(ScrollWatcher);
  expect(watcherA).toBe(watcherB);
  expect(watcherA).not.toBe(watcherC);

  expect(watcherC).toBeInstanceOf(ScrollWatcher);
  expect(watcherC).toBe(watcherD);
});

test("fetchMainContentElement", async () => {
  await expect(ScrollWatcher.fetchMainContentElement()).resolves.toBe(
    document.body,
  );
});

test("fetchMainScrollableElement", async () => {
  await expect(ScrollWatcher.fetchMainScrollableElement()).resolves.toBe(
    document.documentElement,
  );
});

describe("initial call", () => {
  test("all default: first and subsequent of type", async () => {
    const { watcher, callback, element } = newWatcherElement();
    await watcher.onScroll(callback, { scrollable: element });

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(element, defaultScrollData);

    const callbackB = jest.fn();
    await watcher.onScroll(callbackB, { scrollable: element });

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(1);
    expect(callbackB).toHaveBeenCalledWith(element, defaultScrollData);
  });

  test("with threshold: first and subsequent of type", async () => {
    const { watcher, callback, element } = newWatcherElement();
    await watcher.onScroll(callback, { scrollable: element, threshold: 50 });

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(element, defaultScrollData);

    const callbackB = jest.fn();
    await watcher.onScroll(callbackB, { scrollable: element, threshold: 50 });

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(1);
    expect(callbackB).toHaveBeenCalledWith(element, defaultScrollData);
  });

  test("with debounceWindow: first and subsequent of type", async () => {
    const { watcher, callback, element } = newWatcherElement({
      debounceWindow: 500,
    });
    await watcher.onScroll(callback, { scrollable: element });

    // Initial call should not be debounced
    await window.waitForAF();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(element, defaultScrollData);

    element.scrollTo(1, 0);
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls YET

    // Add callback B
    const callbackB = jest.fn();
    await watcher.onScroll(callbackB, { scrollable: element });

    // Initial call should not be debounced
    await window.waitForAF();
    expect(callbackB).toHaveBeenCalledTimes(1);

    expect(callback).toHaveBeenCalledTimes(1); // no new calls YET

    await window.waitFor(520);
    expect(callback).toHaveBeenCalledTimes(2); // now called due to scroll
    expect(callbackB).toHaveBeenCalledTimes(1); // no new calls since the initial
  });

  test("skipInitial: first and subsequent of type", async () => {
    const { watcher, callback, element } = newWatcherElement();
    await watcher.onScroll(callback, {
      scrollable: element,
      skipInitial: true,
    });

    const callbackB = jest.fn();
    await watcher.onScroll(callbackB, {
      scrollable: element,
      skipInitial: true,
    });

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(0); // skipped
    expect(callbackB).toHaveBeenCalledTimes(0); // skipped

    const callbackC = jest.fn();
    await watcher.onScroll(callbackC, {
      scrollable: element,
      skipInitial: true,
    });

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(0); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(0); // no new calls
    expect(callbackC).toHaveBeenCalledTimes(0); // skipped

    // trigger call
    element.scrollTo(1, 0);

    await window.waitForAF();
    for (const cbk of [callback, callbackB, callbackC]) {
      expect(cbk).toHaveBeenCalledTimes(1);
      expect(cbk).toHaveBeenCalledWith(
        element,
        getScrollDataAfterScroll("right", 1, 0),
      );
    }

    const callbackD = jest.fn();
    await watcher.onScroll(callbackD, {
      scrollable: element,
      skipInitial: true,
    });

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackC).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackD).toHaveBeenCalledTimes(0); // skipped

    element.scrollTo(2, 0);

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(2); // called again
    expect(callbackB).toHaveBeenCalledTimes(2); // called again
    expect(callbackC).toHaveBeenCalledTimes(2); // called again
    expect(callbackD).toHaveBeenCalledTimes(1);
    expect(callbackD).toHaveBeenCalledWith(
      element,
      getScrollDataAfterScroll("right", 2, 0),
    );
    expect(callbackD).toHaveBeenCalledWith(
      element,
      getScrollDataAfterScroll("right", 2, 0),
    );
  });

  test("after a scroll in a matching direction: first and subsequent of type", async () => {
    const { watcher, callback, element } = newWatcherElement();
    element.scrollTo(0, 10); // down
    await watcher.onScroll(callback, { scrollable: element });

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1); // initial call
    expect(callback).toHaveBeenCalledWith(element, {
      scrollTop: 10,
      scrollTopFraction: 10 / (window.SCROLL_HEIGHT - window.CLIENT_HEIGHT),
      scrollLeft: 0,
      scrollLeftFraction: 0,
      scrollWidth: window.SCROLL_WIDTH,
      scrollHeight: window.SCROLL_HEIGHT,
      direction: "down",
      clientWidth: window.CLIENT_WIDTH,
      clientHeight: window.CLIENT_HEIGHT,
    });

    // there's already a previous event data
    const callbackB = jest.fn();
    await watcher.onScroll(callbackB, { scrollable: element }); // same observe type

    const callbackC = jest.fn();
    await watcher.onScroll(callbackC, { scrollable: element, threshold: 1 }); // diff. observe type
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
    for (const cbk of [callbackB, callbackC]) {
      expect(cbk).toHaveBeenCalledTimes(1);
      expect(cbk).toHaveBeenCalledWith(element, {
        scrollTop: 10,
        scrollTopFraction: 10 / (window.SCROLL_HEIGHT - window.CLIENT_HEIGHT),
        scrollLeft: 0,
        scrollLeftFraction: 0,
        scrollWidth: window.SCROLL_WIDTH,
        scrollHeight: window.SCROLL_HEIGHT,
        direction: "down",
        clientWidth: window.CLIENT_WIDTH,
        clientHeight: window.CLIENT_HEIGHT,
      });
    }
  });

  test("after a scroll in a non-matching direction: first and subsequent of type", async () => {
    const { watcher, callback, element } = newWatcherElement();
    element.scrollTo(0, 10); // down
    await watcher.onScroll(callback, { scrollable: element, directions: "up" });

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(0);

    // there's already a previous event data
    const callbackB = jest.fn();
    await watcher.onScroll(callbackB, {
      scrollable: element,
      directions: "up",
    }); // same observe type

    const callbackC = jest.fn();
    await watcher.onScroll(callbackC, {
      scrollable: element,
      directions: "up",
      threshold: 1,
    }); // diff. observe type

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(0);
    expect(callbackB).toHaveBeenCalledTimes(0);
    expect(callbackC).toHaveBeenCalledTimes(0);
  });

  test("no 'none' direction => skips initial", async () => {
    const { watcher, callback, element } = newWatcherElement();
    await watcher.onScroll(callback, {
      scrollable: element,
      directions: ["up", "down", "left", "right"],
    });

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(0); // direction is "none"

    element.scrollTo(0, 0);
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(0); // direction is "none"

    element.scrollTo(1, 1);
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(0); // direction is "ambiguous"

    element.scrollTo(10, 0);
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("duplicate handler", () => {
  test("same options", async () => {
    const { callback, watcher, element } = newWatcherElement();
    await Promise.all([
      watcher.onScroll(callback, { scrollable: element }),
      watcher.onScroll(callback, { scrollable: element }),
    ]);

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1); // initial call of 2nd one

    await watcher.onScroll(callback, { scrollable: element });

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(2); // initial call

    element.scrollTo(1, 1);

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(3);
  });

  test("different options", async () => {
    const { callback, watcher, element } = newWatcherElement();
    watcher.onScroll(callback, { scrollable: element }); // removed immediately
    await watcher.onScroll(callback, {
      scrollable: element,
      directions: "none,up,down",
    });

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1); // initial call

    element.scrollTo(0, 100); // down

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(2);

    await watcher.onScroll(callback, {
      scrollable: element,
      directions: "down",
    });

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(3); // initial call

    element.scrollTo(0, 0); // up

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(3); // no new calls
  });
});

describe("offScroll", () => {
  test("awaiting", async () => {
    const { watcher, callback, element } = newWatcherElement();

    await watcher.onScroll(callback, { scrollable: element });
    watcher.offScroll(callback, element);

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1);

    element.scrollTo(0, 0);
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
  });

  test("immediate", async () => {
    const { watcher, callback, element } = newWatcherElement();

    watcher.onScroll(callback, { scrollable: element });
    watcher.offScroll(callback, element);

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(0);

    element.scrollTo(0, 0);
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("with mismatching options", async () => {
    const { watcher, callback, element } = newWatcherElement();

    watcher.onScroll(callback, {
      scrollable: element,
      directions: ["up", "down"],
    });
    watcher.offScroll(callback, element);

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(0);

    element.scrollTo(0, 0);
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("immediate for subsequent of type and later for first of type", async () => {
    const { watcher, callback, element } = newWatcherElement();

    watcher.onScroll(callback, { scrollable: element });

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1);

    const callbackB = jest.fn();
    watcher.onScroll(callbackB, { scrollable: element });

    // remove both
    watcher.offScroll(callback, element);
    watcher.offScroll(callbackB, element);

    await window.waitForAF();

    expect(callback).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(0);

    element.scrollTo(1, 1);
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(0); // no new calls
  });
});

describe("scrollable", () => {
  test("invalid", async () => {
    const { callback, watcher } = newWatcherElement();

    await expect(() =>
      watcher.onScroll(callback, {
        scrollable: "invalid",
      }),
    ).rejects.toThrow(/Unsupported scroll target/);
  });

  for (const scrollable of [
    // TODO test.each
    undefined,
    null,
    window,
    document,
    document.documentElement,
  ]) {
    test(scrollable + " -> documentElement", async () => {
      const { watcher, callback } = newWatcherElement();

      await watcher.onScroll(callback, { scrollable });

      await window.waitForAF();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(
        document.documentElement,
        defaultScrollData,
      );
    });
  }
});

describe("threshold", () => {
  for (const [title, watcherConf, onScrollConf] of [
    // TODO test.each
    ["from onScroll", { scrollThreshold: 10 }, { threshold: 50 }],
    ["from config", { scrollThreshold: 50 }, {}],
    ["+skipInitial", { scrollThreshold: 50 }, { skipInitial: true }],
  ]) {
    test(title, async () => {
      const { watcher, callback, element } = newWatcherElement(watcherConf);

      element.scrollTo(40, 50); // sets last threshold to 40, 50
      await watcher.onScroll(callback, {
        scrollable: element,
        ...onScrollConf,
      });

      await window.waitForAF();

      let nCalls = 0;
      if (onScrollConf.skipInitial) {
        expect(callback).toHaveBeenCalledTimes(0); // skipped
      } else {
        nCalls++;
        expect(callback).toHaveBeenCalledTimes(nCalls); // initial call
        expect(callback).toHaveBeenNthCalledWith(nCalls, element, {
          scrollTop: 50,
          scrollTopFraction: 50 / (window.SCROLL_HEIGHT - window.CLIENT_HEIGHT),
          scrollLeft: 40,
          scrollLeftFraction: 40 / (window.SCROLL_WIDTH - window.CLIENT_WIDTH),
          scrollWidth: window.SCROLL_WIDTH,
          scrollHeight: window.SCROLL_HEIGHT,
          direction: "down",
          clientWidth: window.CLIENT_WIDTH,
          clientHeight: window.CLIENT_HEIGHT,
        });
      }

      element.scrollTo(30, 50); // max change of -10
      await window.waitForAF();
      expect(callback).toHaveBeenCalledTimes(nCalls);

      element.scrollTo(20, 99); // max change of +49
      await window.waitForAF();
      expect(callback).toHaveBeenCalledTimes(nCalls);

      // Compared to last threshold it's down, but compared to last event it's
      // a scroll left
      element.scrollTo(10, 100); // max change of +50 => trigger
      await window.waitForAF();
      expect(callback).toHaveBeenCalledTimes(++nCalls);
      expect(callback).toHaveBeenNthCalledWith(nCalls, element, {
        scrollTop: 100,
        scrollTopFraction: 100 / (window.SCROLL_HEIGHT - window.CLIENT_HEIGHT),
        scrollLeft: 10,
        scrollLeftFraction: 10 / (window.SCROLL_WIDTH - window.CLIENT_WIDTH),
        scrollWidth: window.SCROLL_WIDTH,
        scrollHeight: window.SCROLL_HEIGHT,
        direction: "left", // compared to last event
        clientWidth: window.CLIENT_WIDTH,
        clientHeight: window.CLIENT_HEIGHT,
      });

      element.scrollTo(20, 51); // max change of -49
      await window.waitForAF();
      expect(callback).toHaveBeenCalledTimes(nCalls);

      // Compared to last threshold it's up, but compared to last event it's
      // a scroll right
      element.scrollTo(30, 50); // max change of -50 => trigger
      await window.waitForAF();
      expect(callback).toHaveBeenCalledTimes(++nCalls);
      expect(callback).toHaveBeenNthCalledWith(nCalls, element, {
        scrollTop: 50,
        scrollTopFraction: 50 / (window.SCROLL_HEIGHT - window.CLIENT_HEIGHT),
        scrollLeft: 30,
        scrollLeftFraction: 30 / (window.SCROLL_WIDTH - window.CLIENT_WIDTH),
        scrollWidth: window.SCROLL_WIDTH,
        scrollHeight: window.SCROLL_HEIGHT,
        direction: "right", // compared to last event
        clientWidth: window.CLIENT_WIDTH,
        clientHeight: window.CLIENT_HEIGHT,
      });
    });
  }
});

describe("direction (0 threshold, effective 1)", () => {
  test("invalid", async () => {
    const { callback, watcher, element } = newWatcherElement();

    await expect(() =>
      watcher.onScroll(callback, {
        scrollable: element,
        directions: "invalid",
      }),
    ).rejects.toThrow(/Invalid value for 'directions'/);

    await expect(() =>
      watcher.onScroll(callback, {
        scrollable: element,
        directions: ["invalid"],
      }),
    ).rejects.toThrow(/Invalid value for 'directions'/);

    await expect(() =>
      watcher.onScroll(callback, {
        scrollable: element,
        directions: false,
      }),
    ).rejects.toThrow(/'directions' must be a string or a string array/);
  });

  test("array", async () => {
    const { watcher, callback, element } = newWatcherElement();
    await watcher.onScroll(callback, {
      scrollable: element,
      directions: ["up", "down"],
      skipInitial: true,
    });

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(0); // skip initial

    element.scrollTo(0, 10); // down
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1);

    element.scrollTo(0, 0); // scroll back up
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("orthogonal ones", async () => {
    const { watcher, callback, element } = newWatcherElement();
    await watcher.onScroll(callback, {
      scrollable: element,
      directions: ["up", "left"],
      skipInitial: true,
    });

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(0); // skip initial

    element.scrollTo(0, 10); // down
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(0);

    element.scrollTo(0, 0); // up
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1);

    element.scrollTo(10, 0); // right
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1);

    element.scrollTo(0, 0); // left
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("comma-separated string with spaces", async () => {
    const { watcher, callback, element } = newWatcherElement();
    await watcher.onScroll(callback, {
      scrollable: element,
      directions: " up , down ",
      skipInitial: true,
    });

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(0); // skip initial

    element.scrollTo(0, 10); // down
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1);

    element.scrollTo(0, 0); // scroll back up
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  for (const [startCoords, endCoords, expDirection, expDirectionRev] of [
    // TODO test.each
    [[50, 50], [20, 0], "up", "down"], // deltaY is larger => up
    [[50, 50], [20, 100], "down", "up"], // deltaY is larger => down
    [[50, 50], [0, 10], "left", "right"], // deltaX is larger => left
    [[50, 50], [100, 10], "right", "left"], // deltaX is larger => right
    [[50, 50], [100, 100], "ambiguous", "ambiguous"], // equal deltas => ambiguous
  ]) {
    test(`scroll ${expDirection}, then back ${expDirectionRev}`, async () => {
      const { watcher, callback, element } = newWatcherElement();
      element.scrollTo(...startCoords);

      await watcher.onScroll(callback, {
        // any direction
        scrollable: element,
        skipInitial: true,
      });

      const restrictedCallbacks = {};
      for (const direction of DIRECTIONS) {
        const thisCbk = jest.fn();
        restrictedCallbacks[direction] = thisCbk;

        await watcher.onScroll(thisCbk, {
          scrollable: element,
          directions: direction,
          threshold: 0,
          skipInitial: true,
        });
      }

      await window.waitForAF();
      expect(callback).toHaveBeenCalledTimes(0); // skipped initial

      for (const direction of DIRECTIONS) {
        // skipped initial
        expect(restrictedCallbacks[direction]).toHaveBeenCalledTimes(0);
      }

      element.scrollTo(...endCoords);
      await window.waitForAF();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(element, {
        scrollTop: endCoords[1],
        scrollTopFraction:
          endCoords[1] / (window.SCROLL_HEIGHT - window.CLIENT_HEIGHT),
        scrollLeft: endCoords[0],
        scrollLeftFraction:
          endCoords[0] / (window.SCROLL_WIDTH - window.CLIENT_WIDTH),
        scrollWidth: window.SCROLL_WIDTH,
        scrollHeight: window.SCROLL_HEIGHT,
        direction: expDirection,
        clientWidth: window.CLIENT_WIDTH,
        clientHeight: window.CLIENT_HEIGHT,
      });

      const nCalls = {};
      for (const direction of DIRECTIONS) {
        nCalls[direction] = direction === expDirection ? 1 : 0;
        expect(restrictedCallbacks[direction]).toHaveBeenCalledTimes(
          nCalls[direction],
        );
      }

      // back the other way
      element.scrollTo(...startCoords);
      await window.waitForAF();
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(element, {
        scrollTop: startCoords[1],
        scrollTopFraction:
          startCoords[1] / (window.SCROLL_HEIGHT - window.CLIENT_HEIGHT),
        scrollLeft: startCoords[0],
        scrollLeftFraction:
          startCoords[0] / (window.SCROLL_WIDTH - window.CLIENT_WIDTH),
        scrollWidth: window.SCROLL_WIDTH,
        scrollHeight: window.SCROLL_HEIGHT,
        direction: expDirectionRev,
        clientWidth: window.CLIENT_WIDTH,
        clientHeight: window.CLIENT_HEIGHT,
      });

      for (const direction of DIRECTIONS) {
        nCalls[direction] += direction === expDirectionRev ? 1 : 0;
        expect(restrictedCallbacks[direction]).toHaveBeenCalledTimes(
          nCalls[direction],
        );
      }
    });
  }
});

describe("direction + threshold", () => {
  for (const [startCoords, endCoords, expDirection, expDirectionRev] of [
    // TODO test.each
    [[50, 50], [20, 0], "up", "down"], // deltaY is larger => up
    [[50, 50], [20, 100], "down", "up"], // deltaY is larger => down
    [[50, 50], [0, 10], "left", "right"], // deltaX is larger => left
    [[50, 50], [100, 10], "right", "left"], // deltaX is larger => right
    [[50, 50], [100, 100], "ambiguous", "ambiguous"], // equal deltas => ambiguous
  ]) {
    test(`scroll ${expDirection}, then back ${expDirectionRev}`, async () => {
      const { watcher, callback, element } = newWatcherElement();
      element.scrollTo(...startCoords);

      await watcher.onScroll(callback, {
        // any direction
        scrollable: element,
        skipInitial: true,
      });

      const restrictedCallbacks = {};
      for (const direction of DIRECTIONS) {
        const thisCbk = jest.fn();
        restrictedCallbacks[direction] = thisCbk;

        await watcher.onScroll(thisCbk, {
          scrollable: element,
          directions: direction,
          threshold: 10,
          skipInitial: true,
        });
      }

      await window.waitForAF();
      expect(callback).toHaveBeenCalledTimes(0); // skipped initial

      for (const direction of DIRECTIONS) {
        // skipped initial
        expect(restrictedCallbacks[direction]).toHaveBeenCalledTimes(0);
      }

      element.scrollTo(...endCoords);
      await window.waitForAF();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(element, {
        scrollTop: endCoords[1],
        scrollTopFraction:
          endCoords[1] / (window.SCROLL_HEIGHT - window.CLIENT_HEIGHT),
        scrollLeft: endCoords[0],
        scrollLeftFraction:
          endCoords[0] / (window.SCROLL_WIDTH - window.CLIENT_WIDTH),
        scrollWidth: window.SCROLL_WIDTH,
        scrollHeight: window.SCROLL_HEIGHT,
        direction: expDirection,
        clientWidth: window.CLIENT_WIDTH,
        clientHeight: window.CLIENT_HEIGHT,
      });

      const nCalls = {};
      for (const direction of DIRECTIONS) {
        nCalls[direction] = direction === expDirection ? 1 : 0;
        expect(restrictedCallbacks[direction]).toHaveBeenCalledTimes(
          nCalls[direction],
        );
      }

      // back the other way
      element.scrollTo(...startCoords);
      await window.waitForAF();
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(element, {
        scrollTop: startCoords[1],
        scrollTopFraction:
          startCoords[1] / (window.SCROLL_HEIGHT - window.CLIENT_HEIGHT),
        scrollLeft: startCoords[0],
        scrollLeftFraction:
          startCoords[0] / (window.SCROLL_WIDTH - window.CLIENT_WIDTH),
        scrollWidth: window.SCROLL_WIDTH,
        scrollHeight: window.SCROLL_HEIGHT,
        direction: expDirectionRev,
        clientWidth: window.CLIENT_WIDTH,
        clientHeight: window.CLIENT_HEIGHT,
      });

      for (const direction of DIRECTIONS) {
        nCalls[direction] += direction === expDirectionRev ? 1 : 0;
        expect(restrictedCallbacks[direction]).toHaveBeenCalledTimes(
          nCalls[direction],
        );
      }
    });
  }

  test("orthogonal ones", async () => {
    const { watcher, callback, element } = newWatcherElement();
    await watcher.onScroll(callback, {
      scrollable: element,
      threshold: 10,
      directions: ["up", "left"],
      skipInitial: true,
    });

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(0); // skip initial

    element.scrollTo(0, 10); // down
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(0);

    element.scrollTo(0, 0); // up
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1);

    element.scrollTo(10, 0); // right
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1);

    element.scrollTo(0, 0); // left
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(2);
  });
});

describe("cleanup on removal", () => {
  test("removing immediately", async () => {
    const { callback, watcher, element } = newWatcherElement();

    watcher.onScroll(callback, { scrollable: element });
    watcher.offScroll(callback, element);

    await window.waitForAF();
    expect(window.numEventListeners.get(element) || 0).toBe(0);
  });

  test("removing later", async () => {
    const { callback, watcher, element } = newWatcherElement();
    const callbackB = jest.fn();

    await watcher.onScroll(callback, { scrollable: element });
    await watcher.onScroll(callbackB, { scrollable: element }); // same watcher

    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(1); // initial call
    expect(callbackB).toHaveBeenCalledTimes(1); // initial call
    expect(window.numEventListeners.get(element)).toBe(1);

    // remove callback B
    watcher.offScroll(callbackB, element);

    element.scrollTo(1, 1);
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callbackB).toHaveBeenCalledTimes(1); // no new calls
    expect(window.numEventListeners.get(element)).toBe(1);

    // remove callback A
    watcher.offScroll(callback, element);

    element.scrollTo(2, 2);
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(2); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(1); // no new calls
    expect(window.numEventListeners.get(element) || 0).toBe(0);
  });
});

test("fetchCurrentScroll", async () => {
  const { watcher, element } = newWatcherElement();
  element.scrollTo(10, 20);
  const tStart = Date.now();
  const scroll = await watcher.fetchCurrentScroll(element);
  const tEnd = Date.now();
  expect(scroll).toEqual({
    scrollTop: 20,
    scrollTopFraction: 20 / (window.SCROLL_HEIGHT - window.CLIENT_HEIGHT),
    scrollLeft: 10,
    scrollLeftFraction: 10 / (window.SCROLL_WIDTH - window.CLIENT_WIDTH),
    scrollWidth: window.SCROLL_WIDTH,
    scrollHeight: window.SCROLL_HEIGHT,
    direction: "down",
    clientWidth: window.CLIENT_WIDTH,
    clientHeight: window.CLIENT_HEIGHT,
  });
  expect(tEnd - tStart).toBeLessThan(30);
});

describe("isValidScrollDirection", () => {
  for (const direction of DIRECTIONS) {
    test(direction, () => {
      expect(isValidScrollDirection(direction)).toBe(true);
    });
  }

  test("invalid", () => {
    expect(isValidScrollDirection("up,down")).toBe(false);
    expect(isValidScrollDirection("")).toBe(false);
    expect(isValidScrollDirection(" ")).toBe(false);
    expect(isValidScrollDirection(" , ")).toBe(false);
    expect(isValidScrollDirection("random")).toBe(false);
  });
});

describe("isValidScrollDirectionList", () => {
  for (const direction of DIRECTIONS) {
    test(direction, () => {
      expect(isValidScrollDirectionList(direction)).toBe(true);
    });
  }

  test("multiple", () => {
    expect(isValidScrollDirectionList("up,down")).toBe(true);
    expect(isValidScrollDirectionList(["up"], ["down"])).toBe(true);
  });

  test("invalid", () => {
    expect(isValidScrollDirectionList([])).toBe(false);
    expect(isValidScrollDirectionList([""])).toBe(false);
    expect(isValidScrollDirectionList("")).toBe(false);
    expect(isValidScrollDirectionList(" ")).toBe(false);
    expect(isValidScrollDirectionList(" , ")).toBe(false);
    expect(isValidScrollDirectionList("random")).toBe(false);
  });
});
