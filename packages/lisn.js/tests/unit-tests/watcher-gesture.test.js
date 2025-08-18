const { jest, describe, test, expect } = require("@jest/globals");
const {
  toBeDeepCloseTo,
  toMatchCloseTo,
} = require("jest-matcher-deep-close-to");

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

const {
  isValidIntent,
  isValidInputDevice,
  isValidIntentList,
  isValidInputDeviceList,
} = window.LISN.utils;
const { GestureWatcher } = window.LISN.watchers;

const DEVICES = ["key", "pointer", "touch", "wheel"];
const INTENTS = ["scroll", "zoom", "drag", "unknown"];
const DIRECTIONS = [
  "up",
  "down",
  "left",
  "right",
  "in",
  "out",
  "ambiguous",
  // GestureWatcher doesn't call us for none direction
];

// for convenience we don't use the default config, but set everything to 0
// unless explicitly given
const newWatcherElement = (config = null) => {
  const callback = jest.fn();

  const defaultConfig = {
    deltaThreshold: 0,
    angleDiffThreshold: 0,
    debounceWindow: 0,
  };
  config = {
    ...defaultConfig,
    ...(config || {}),
  };

  const watcher = GestureWatcher.create(config);
  const element = document.createElement("div");

  return { callback, watcher, element };
};

test("illegal constructor", () => {
  expect(() => new GestureWatcher()).toThrow(/Illegal constructor/);
});

test("create reusable", () => {
  const defaultConfig = {
    preventDefault: true,
    debounceWindow: 150,
    deltaThreshold: 5,
    angleDiffThreshold: 35,
  };
  const watcherA = GestureWatcher.reuse();
  const watcherB = GestureWatcher.reuse(defaultConfig);
  const watcherC = GestureWatcher.reuse({
    deltaThreshold: 50,
  });
  const watcherD = GestureWatcher.reuse({
    ...defaultConfig,
    deltaThreshold: 50,
  });

  expect(watcherA).toBeInstanceOf(GestureWatcher);
  expect(watcherA).toBe(watcherB);
  expect(watcherA).not.toBe(watcherC);

  expect(watcherC).toBeInstanceOf(GestureWatcher);
  expect(watcherC).toBe(watcherD);
});

describe("duplicate handler", () => {
  test("same target, same options", async () => {
    const { callback, watcher, element } = newWatcherElement();
    await Promise.all([
      watcher.onGesture(element, callback),
      watcher.onGesture(element, callback),
    ]);
    await watcher.onGesture(element, callback);

    element.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(1);

    element.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("same target, different options", async () => {
    const { callback, watcher, element } = newWatcherElement();
    watcher.onGesture(element, callback); // removed immediately
    await watcher.onGesture(element, callback, { devices: "wheel" });

    element.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(1);

    await watcher.onGesture(element, callback, { devices: "key" });

    element.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
  });

  test("different target v1", async () => {
    const { callback, watcher, element } = newWatcherElement();
    const elementB = document.createElement("div");
    await Promise.all([
      watcher.onGesture(element, callback),
      watcher.onGesture(elementB, callback),
    ]);

    element.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(1);

    element.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(2);

    elementB.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(3);

    elementB.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(4);
  });

  test("different target v2", async () => {
    const { callback, watcher, element } = newWatcherElement();
    const elementB = document.createElement("div");
    await watcher.onGesture(element, callback);
    await watcher.onGesture(elementB, callback);

    element.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(1);

    element.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(2);

    elementB.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(3);

    elementB.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(4);
  });
});

describe("offGesture", () => {
  test("awaiting", async () => {
    const { callback, watcher, element } = newWatcherElement();

    await watcher.onGesture(element, callback);
    watcher.offGesture(element, callback);

    element.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("immediate", async () => {
    const { callback, watcher, element } = newWatcherElement();

    watcher.onGesture(element, callback);
    watcher.offGesture(element, callback);

    element.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("with mismatching options", async () => {
    const { callback, watcher, element } = newWatcherElement();

    watcher.onGesture(element, callback, { devices: "wheel" });
    watcher.offGesture(element, callback);

    element.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("with different target v1", async () => {
    const { watcher, callback, element } = newWatcherElement();
    const elementB = document.createElement("div");

    watcher.onGesture(element, callback);
    watcher.offGesture(elementB, callback); // no-op

    elementB.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("with different target v2", async () => {
    const { watcher, callback, element } = newWatcherElement();
    const elementB = document.createElement("div");

    watcher.onGesture(element, callback);
    watcher.onGesture(elementB, callback);
    watcher.offGesture(elementB, callback); // removed for elementB only

    elementB.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("devices", () => {
  test("invalid", async () => {
    const { callback, watcher, element } = newWatcherElement();

    await expect(() =>
      watcher.onGesture(element, callback, {
        devices: "invalid",
      }),
    ).rejects.toThrow(/Invalid value for 'devices'/);

    await expect(() =>
      watcher.onGesture(element, callback, {
        devices: ["invalid"],
      }),
    ).rejects.toThrow(/Invalid value for 'devices'/);

    await expect(() =>
      watcher.onGesture(element, callback, {
        devices: false,
      }),
    ).rejects.toThrow(/'devices' must be a string or a string array/);
  });

  test("array", async () => {
    const { watcher, callback, element } = newWatcherElement();

    watcher.onGesture(element, callback, {
      devices: ["wheel", "touch"],
    });

    element.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(1);

    element.dispatchEvent(window.newTouch("start", [10, 10]));
    element.dispatchEvent(window.newTouch("move", [10, 10]));
    element.dispatchEvent(window.newTouch("move", [50, 50]));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(2);

    element.dispatchEvent(window.newKeyDown("Down"));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(2); // no new calls
  });

  test("comma-separated string with spaces", async () => {
    const { watcher, callback, element } = newWatcherElement();

    watcher.onGesture(element, callback, {
      devices: "wheel, touch",
    });

    element.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(1);

    element.dispatchEvent(window.newTouch("start", [10, 10]));
    element.dispatchEvent(window.newTouch("move", [10, 10]));
    element.dispatchEvent(window.newTouch("move", [50, 50]));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(2);

    element.dispatchEvent(window.newKeyDown("Down"));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(2); // no new calls
  });

  for (const device of DEVICES) {
    // TODO test.each
    test("specific device: " + device, async () => {
      const { callback, watcher, element } = newWatcherElement();
      await watcher.onGesture(element, callback, { devices: device });

      element.dispatchEvent(window.newKeyDown("Down"));
      let nCalls = device === "key" ? 1 : 0;
      await window.waitFor(0); // call is async
      expect(callback).toHaveBeenCalledTimes(nCalls);

      element.dispatchEvent(window.newMouse("down", 0, 0));
      element.dispatchEvent(window.newMouse("move", 0, 0));
      element.dispatchEvent(window.newMouse("move", 0, 100));
      nCalls += device === "pointer" ? 1 : 0;
      await window.waitFor(0); // call is async
      expect(callback).toHaveBeenCalledTimes(nCalls);

      element.dispatchEvent(window.newTouch("start", [10, 10]));
      element.dispatchEvent(window.newTouch("move", [10, 10]));
      element.dispatchEvent(window.newTouch("move", [50, 50]));
      nCalls += device === "touch" ? 1 : 0;
      await window.waitFor(0); // call is async
      expect(callback).toHaveBeenCalledTimes(nCalls);

      element.dispatchEvent(window.newWheel(0, 100));
      nCalls += device === "wheel" ? 1 : 0;
      await window.waitFor(0); // call is async
      expect(callback).toHaveBeenCalledTimes(nCalls);
    });
  }
});

describe("directions", () => {
  test("invalid", async () => {
    const { callback, watcher, element } = newWatcherElement();

    await expect(() =>
      watcher.onGesture(element, callback, {
        directions: "invalid",
      }),
    ).rejects.toThrow(/Invalid value for 'directions'/);

    await expect(() =>
      watcher.onGesture(element, callback, {
        directions: ["invalid"],
      }),
    ).rejects.toThrow(/Invalid value for 'directions'/);

    await expect(() =>
      watcher.onGesture(element, callback, {
        directions: false,
      }),
    ).rejects.toThrow(/'directions' must be a string or a string array/);
  });

  test("array", async () => {
    const { watcher, callback, element } = newWatcherElement();

    watcher.onGesture(element, callback, {
      directions: ["up", "left"],
    });

    element.dispatchEvent(window.newWheel(0, -100)); // up
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(1);

    element.dispatchEvent(window.newKeyDown("Left"));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(2);

    element.dispatchEvent(window.newKeyDown("Down"));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(2); // no new calls
  });

  test("comma-separated string with spaces", async () => {
    const { watcher, callback, element } = newWatcherElement();

    watcher.onGesture(element, callback, {
      directions: "up, left",
    });

    element.dispatchEvent(window.newWheel(0, -100)); // up
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(1);

    element.dispatchEvent(window.newKeyDown("Left"));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(2);

    element.dispatchEvent(window.newKeyDown("Down"));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(2); // no new calls
  });

  for (const [direction, directionRev, dx, dy, ctrlKey] of [
    ["up", "down", 0, -100, false],
    ["down", "up", 0, 100, false],
    ["left", "right", -100, 0, false],
    ["right", "left", 100, 0, false],
    ["in", "out", 0, -100, true],
    ["out", "in", 0, 100, true],
    ["ambiguous", "ambiguous", 100, 100],
  ]) {
    for (const filterDirection of DIRECTIONS) {
      // TODO test.each
      test(
        "specific direction (0 threshold): " +
          filterDirection +
          " actual: " +
          direction,
        async () => {
          const { callback, watcher, element } = newWatcherElement();
          await watcher.onGesture(element, callback, {
            directions: filterDirection,
            deltaThreshold: 0,
          });

          let nCalls = filterDirection === direction ? 1 : 0;
          element.dispatchEvent(window.newWheel(dx, dy, false, ctrlKey));
          await window.waitFor(0); // call is async
          expect(callback).toHaveBeenCalledTimes(nCalls);

          nCalls += filterDirection === directionRev ? 1 : 0;
          element.dispatchEvent(window.newWheel(-dx, -dy, false, ctrlKey));
          await window.waitFor(0); // call is async
          expect(callback).toHaveBeenCalledTimes(nCalls);
        },
      );
    }
  }

  for (const [direction, directionRev, dx, dy, ctrlKey] of [
    ["up", "down", 0, -100, false],
    ["down", "up", 0, 100, false],
    ["left", "right", -100, 0, false],
    ["right", "left", 100, 0, false],
    ["in", "out", 0, -100, true],
    ["out", "in", 0, 100, true],
    ["ambiguous", "ambiguous", 100, 100],
  ]) {
    for (const filterDirection of DIRECTIONS) {
      // TODO test.each
      test(
        "specific direction + threshold: " +
          filterDirection +
          " actual: " +
          direction,
        async () => {
          const { callback, watcher, element } = newWatcherElement();
          await watcher.onGesture(element, callback, {
            directions: filterDirection,
            deltaThreshold: 10,
          });

          let nCalls = filterDirection === direction ? 1 : 0;
          element.dispatchEvent(window.newWheel(dx, dy, false, ctrlKey));
          await window.waitFor(0); // call is async
          expect(callback).toHaveBeenCalledTimes(nCalls);

          nCalls += filterDirection === directionRev ? 1 : 0;
          element.dispatchEvent(window.newWheel(-dx, -dy, false, ctrlKey));
          await window.waitFor(0); // call is async
          expect(callback).toHaveBeenCalledTimes(nCalls);
        },
      );
    }
  }
});

describe("intents", () => {
  test("invalid", async () => {
    const { callback, watcher, element } = newWatcherElement();

    await expect(() =>
      watcher.onGesture(element, callback, {
        intents: "invalid",
      }),
    ).rejects.toThrow(/Invalid value for 'intents'/);

    await expect(() =>
      watcher.onGesture(element, callback, {
        intents: ["invalid"],
      }),
    ).rejects.toThrow(/Invalid value for 'intents'/);

    await expect(() =>
      watcher.onGesture(element, callback, {
        intents: false,
      }),
    ).rejects.toThrow(/'intents' must be a string or a string array/);
  });

  test("array", async () => {
    const { watcher, callback, element } = newWatcherElement();

    watcher.onGesture(element, callback, {
      intents: ["scroll", "drag"],
    });

    element.dispatchEvent(window.newWheel(0, 100)); // scroll
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(1);

    element.dispatchEvent(window.newMouse("down", 10, 10));
    element.dispatchEvent(window.newMouse("move", 10, 10));
    element.dispatchEvent(window.newMouse("move", 50, 50)); // drag
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(2);

    element.dispatchEvent(window.newKeyDown("+")); // zoom
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(2); // no new calls
  });

  test("comma-separated string with spaces", async () => {
    const { watcher, callback, element } = newWatcherElement();

    watcher.onGesture(element, callback, {
      intents: "scroll, drag",
    });

    element.dispatchEvent(window.newWheel(0, 100)); // scroll
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(1);

    element.dispatchEvent(window.newMouse("down", 10, 10));
    element.dispatchEvent(window.newMouse("move", 10, 10));
    element.dispatchEvent(window.newMouse("move", 50, 50)); // drag
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(2);

    element.dispatchEvent(window.newKeyDown("+")); // zoom
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(2); // no new calls
  });

  for (const intent of INTENTS) {
    // TODO test.each
    test("specific intent: " + intent, async () => {
      const { callback, watcher, element } = newWatcherElement();
      await watcher.onGesture(element, callback, { intents: intent });

      element.dispatchEvent(window.newKeyDown("Down"));
      let nCalls = intent === "scroll" ? 1 : 0;
      await window.waitFor(0); // call is async
      expect(callback).toHaveBeenCalledTimes(nCalls);

      element.dispatchEvent(window.newKeyDown("+"));
      nCalls += intent === "zoom" ? 1 : 0;
      await window.waitFor(0); // call is async
      expect(callback).toHaveBeenCalledTimes(nCalls);

      element.dispatchEvent(window.newMouse("down", 10, 10));
      element.dispatchEvent(window.newMouse("move", 10, 10));
      element.dispatchEvent(window.newMouse("move", 50, 50)); // drag
      nCalls += intent === "drag" ? 1 : 0;
      await window.waitFor(0); // call is async
      expect(callback).toHaveBeenCalledTimes(nCalls);
    });
  }
});

describe("min/max deltas", () => {
  test("scroll (X/Y)", async () => {
    const { watcher, callback, element } = newWatcherElement();

    watcher.onGesture(element, callback, {
      minTotalDeltaX: -100,
      maxTotalDeltaX: 100,
      minTotalDeltaY: -200,
      maxTotalDeltaY: 200,
    });

    let nCalls = 0;
    const eventUp = window.newWheel(-70, -70);
    const eventDown = window.newWheel(70, 70);

    element.dispatchEvent(eventUp);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(++nCalls);
    expect(callback).toHaveBeenCalledWith(
      element,
      {
        device: "wheel",
        deltaX: -70,
        deltaY: -70,
        deltaZ: 1,
        time: 0,
        totalDeltaX: -70,
        totalDeltaY: -70,
        totalDeltaZ: 1,
        direction: "ambiguous",
        intent: "scroll",
      },
      [eventUp],
      watcher,
    );

    element.dispatchEvent(eventUp);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(++nCalls);
    expect(callback).toHaveBeenCalledWith(
      element,
      {
        device: "wheel",
        deltaX: -70,
        deltaY: -70,
        deltaZ: 1,
        time: 0,
        totalDeltaX: -100,
        totalDeltaY: -140,
        totalDeltaZ: 1,
        direction: "ambiguous",
        intent: "scroll",
      },
      [eventUp],
      watcher,
    );

    element.dispatchEvent(eventUp);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(++nCalls);
    expect(callback).toHaveBeenCalledWith(
      element,
      {
        device: "wheel",
        deltaX: -70,
        deltaY: -70,
        deltaZ: 1,
        time: 0,
        totalDeltaX: -100,
        totalDeltaY: -200,
        totalDeltaZ: 1,
        direction: "ambiguous",
        intent: "scroll",
      },
      [eventUp],
      watcher,
    );

    element.dispatchEvent(eventUp); // ignored
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(nCalls); // no new calls

    element.dispatchEvent(eventDown);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(++nCalls);
    expect(callback).toHaveBeenCalledWith(
      element,
      {
        device: "wheel",
        deltaX: 70,
        deltaY: 70,
        deltaZ: 1,
        time: 0,
        totalDeltaX: -30,
        totalDeltaY: -130,
        totalDeltaZ: 1,
        direction: "ambiguous",
        intent: "scroll",
      },
      [eventDown],
      watcher,
    );

    element.dispatchEvent(eventDown);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(++nCalls);
    expect(callback).toHaveBeenCalledWith(
      element,
      {
        device: "wheel",
        deltaX: 70,
        deltaY: 70,
        deltaZ: 1,
        time: 0,
        totalDeltaX: 40,
        totalDeltaY: -60,
        totalDeltaZ: 1,
        direction: "ambiguous",
        intent: "scroll",
      },
      [eventDown],
      watcher,
    );

    element.dispatchEvent(eventDown);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(++nCalls);
    expect(callback).toHaveBeenCalledWith(
      element,
      {
        device: "wheel",
        deltaX: 70,
        deltaY: 70,
        deltaZ: 1,
        time: 0,
        totalDeltaX: 100,
        totalDeltaY: 10,
        totalDeltaZ: 1,
        direction: "ambiguous",
        intent: "scroll",
      },
      [eventDown],
      watcher,
    );

    element.dispatchEvent(eventDown);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(++nCalls);
    expect(callback).toHaveBeenCalledWith(
      element,
      {
        device: "wheel",
        deltaX: 70,
        deltaY: 70,
        deltaZ: 1,
        time: 0,
        totalDeltaX: 100,
        totalDeltaY: 80,
        totalDeltaZ: 1,
        direction: "ambiguous",
        intent: "scroll",
      },
      [eventDown],
      watcher,
    );

    element.dispatchEvent(eventDown);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(++nCalls);
    expect(callback).toHaveBeenCalledWith(
      element,
      {
        device: "wheel",
        deltaX: 70,
        deltaY: 70,
        deltaZ: 1,
        time: 0,
        totalDeltaX: 100,
        totalDeltaY: 150,
        totalDeltaZ: 1,
        direction: "ambiguous",
        intent: "scroll",
      },
      [eventDown],
      watcher,
    );

    element.dispatchEvent(eventDown);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(++nCalls);
    expect(callback).toHaveBeenCalledWith(
      element,
      {
        device: "wheel",
        deltaX: 70,
        deltaY: 70,
        deltaZ: 1,
        time: 0,
        totalDeltaX: 100,
        totalDeltaY: 200,
        totalDeltaZ: 1,
        direction: "ambiguous",
        intent: "scroll",
      },
      [eventDown],
      watcher,
    );

    element.dispatchEvent(eventDown); // ignored
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(nCalls); // no new calls
  });

  test("zoom Z", async () => {
    const { watcher, callback, element } = newWatcherElement();

    watcher.onGesture(element, callback, {
      minTotalDeltaZ: 0.8,
      maxTotalDeltaZ: 2,
    });

    let nCalls = 0;
    const eventIn = window.newKeyDown("+");
    const eventOut = window.newKeyDown("-");

    element.dispatchEvent(eventIn);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(++nCalls);
    expect(callback).toHaveBeenCalledWith(
      element,
      {
        device: "key",
        deltaX: 0,
        deltaY: 0,
        deltaZ: 1.15,
        time: 0,
        totalDeltaX: 0,
        totalDeltaY: 0,
        totalDeltaZ: 1.15,
        direction: "in",
        intent: "zoom",
      },
      [eventIn],
      watcher,
    );

    element.dispatchEvent(eventIn);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(++nCalls);
    expect(callback.mock.calls[nCalls - 1][1]).toMatchCloseTo({
      device: "key",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 1.15,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: 0,
      totalDeltaZ: Math.pow(1.15, 2), // < 2
      direction: "in",
      intent: "zoom",
    });

    element.dispatchEvent(eventIn);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(++nCalls);
    expect(callback.mock.calls[nCalls - 1][1]).toMatchCloseTo({
      device: "key",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 1.15,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: 0,
      totalDeltaZ: Math.pow(1.15, 3), // < 2
      direction: "in",
      intent: "zoom",
    });

    element.dispatchEvent(eventIn);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(++nCalls);
    expect(callback.mock.calls[nCalls - 1][1]).toMatchCloseTo({
      device: "key",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 1.15,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: 0,
      totalDeltaZ: Math.pow(1.15, 4), // < 2
      direction: "in",
      intent: "zoom",
    });

    element.dispatchEvent(eventIn);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(++nCalls);
    expect(callback.mock.calls[nCalls - 1][1]).toMatchCloseTo({
      device: "key",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 1.15,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: 0,
      totalDeltaZ: 2, // limit
      direction: "in",
      intent: "zoom",
    });

    element.dispatchEvent(eventIn); // ignored
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(nCalls); // no new calls

    element.dispatchEvent(eventOut);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(++nCalls);
    expect(callback.mock.calls[nCalls - 1][1]).toMatchCloseTo({
      device: "key",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 1 / 1.15,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: 0,
      totalDeltaZ: 2 / 1.15,
      direction: "out",
      intent: "zoom",
    });

    element.dispatchEvent(eventOut);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(++nCalls);
    expect(callback.mock.calls[nCalls - 1][1]).toMatchCloseTo({
      device: "key",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 1 / 1.15,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: 0,
      totalDeltaZ: 2 / Math.pow(1.15, 2), // > 0.8
      direction: "out",
      intent: "zoom",
    });

    element.dispatchEvent(eventOut);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(++nCalls);
    expect(callback.mock.calls[nCalls - 1][1]).toMatchCloseTo({
      device: "key",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 1 / 1.15,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: 0,
      totalDeltaZ: 2 / Math.pow(1.15, 3), // > 0.8
      direction: "out",
      intent: "zoom",
    });

    element.dispatchEvent(eventOut);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(++nCalls);
    expect(callback.mock.calls[nCalls - 1][1]).toMatchCloseTo({
      device: "key",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 1 / 1.15,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: 0,
      totalDeltaZ: 2 / Math.pow(1.15, 4), // > 0.8
      direction: "out",
      intent: "zoom",
    });

    element.dispatchEvent(eventOut);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(++nCalls);
    expect(callback.mock.calls[nCalls - 1][1]).toMatchCloseTo({
      device: "key",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 1 / 1.15,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: 0,
      totalDeltaZ: 2 / Math.pow(1.15, 5), // > 0.8
      direction: "out",
      intent: "zoom",
    });

    element.dispatchEvent(eventOut);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(++nCalls);
    expect(callback.mock.calls[nCalls - 1][1]).toMatchCloseTo({
      device: "key",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 1 / 1.15,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: 0,
      totalDeltaZ: 2 / Math.pow(1.15, 6), // > 0.8
      direction: "out",
      intent: "zoom",
    });

    element.dispatchEvent(eventOut);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(++nCalls);
    expect(callback.mock.calls[nCalls - 1][1]).toMatchCloseTo({
      device: "key",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 1 / 1.15,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: 0,
      totalDeltaZ: 0.8, // limit
      direction: "out",
      intent: "zoom",
    });

    element.dispatchEvent(eventOut); // ignored
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(nCalls); // no new calls
  });
});

describe("deltaThreshold", () => {
  test("baseline", async () => {
    const { watcher, callback, element } = newWatcherElement();

    watcher.onGesture(element, callback, {
      deltaThreshold: 0,
    });

    element.dispatchEvent(window.newWheel(0, -10)); // -30
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("deltaThreshold", async () => {
    const { watcher, callback, element } = newWatcherElement();

    watcher.onGesture(element, callback, {
      deltaThreshold: 100,
    });

    element.dispatchEvent(window.newWheel(0, -30)); // -30
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newWheel(0, 10)); // -20
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newWheel(0, -50)); // -70
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newWheel(0, -30)); // -100
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("angleDiffThreshold", () => {
  test("baseline 1", async () => {
    const { watcher, callback, element } = newWatcherElement();

    watcher.onGesture(element, callback, {
      angleDiffThreshold: 0,
      directions: "up,down,left,right",
    });

    element.dispatchEvent(window.newWheel(5, 30));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("baseline 2", async () => {
    const { watcher, callback, element } = newWatcherElement();

    watcher.onGesture(element, callback, {
      angleDiffThreshold: 45,
      directions: "up,down,left,right",
    });

    element.dispatchEvent(window.newWheel(20, 30));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("angleDiffThreshold", async () => {
    const { watcher, callback, element } = newWatcherElement();

    watcher.onGesture(element, callback, {
      angleDiffThreshold: 30,
      directions: "up,down,left,right",
    });

    element.dispatchEvent(window.newWheel(20, 30));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newWheel(5, 30));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("preventDefault", () => {
  test("baseline: false", async () => {
    const { watcher, callback, element } = newWatcherElement();

    watcher.onGesture(element, callback, {
      preventDefault: false,
    });

    const eventW = window.newWheel(0, -50);
    element.dispatchEvent(eventW);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(1);
    expect(eventW.defaultPrevented).toBe(false);

    const eventK = window.newKeyDown("Down");
    element.dispatchEvent(eventK);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(2);
    expect(eventK.defaultPrevented).toBe(false);

    const dummyW = window.newWheel(0, -50);
    dummyW.preventDefault();
    expect(dummyW.defaultPrevented).toBe(true);

    const dummyK = window.newKeyDown("Down");
    dummyK.preventDefault();
    expect(dummyK.defaultPrevented).toBe(true);
  });

  test("preventDefault: true", async () => {
    const { watcher, callback, element } = newWatcherElement();

    watcher.onGesture(element, callback, {
      // preventDefault: true, // on by default
    });

    const event = window.newWheel(0, -50);
    element.dispatchEvent(event);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);

    const eventK = window.newKeyDown("Down");
    element.dispatchEvent(eventK);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(2);
    expect(eventK.defaultPrevented).toBe(true);

    const eventK2 = window.newKeyDown("A"); // irrelevant
    element.dispatchEvent(eventK2);
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(2); // no new calls
    expect(eventK2.defaultPrevented).toBe(false);
  });
});

// TODO maybe test with other devices as well? but we'll need to hardcode the
// list of events it listens for...
describe("cleanup on removal", () => {
  test("removing immediately", async () => {
    const { callback, watcher, element } = newWatcherElement();

    watcher.onGesture(element, callback, { devices: "wheel" });
    watcher.offGesture(element, callback);

    await window.waitFor(10);
    expect(window.numEventListeners.get(element) || 0).toBe(0);
  });

  test("removing later", async () => {
    const { callback, watcher, element } = newWatcherElement();
    const callbackB = jest.fn();

    await watcher.onGesture(element, callback, { devices: "wheel" });
    await watcher.onGesture(element, callbackB, { devices: "wheel" }); // same watcher

    element.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callbackB).toHaveBeenCalledTimes(1);
    expect(window.numEventListeners.get(element)).toBe(1);

    // remove callback B
    watcher.offGesture(element, callbackB);

    element.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callbackB).toHaveBeenCalledTimes(1); // no new calls
    expect(window.numEventListeners.get(element)).toBe(1);

    // remove callback A
    watcher.offGesture(element, callback);

    element.dispatchEvent(window.newWheel(0, 100));
    await window.waitFor(0); // call is async
    expect(callback).toHaveBeenCalledTimes(2); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(1); // no new calls
    expect(window.numEventListeners.get(element) || 0).toBe(0);
  });
});

test("multiple gesture devices", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, {
    preventDefault: false,
  });

  const eventK = window.newKeyDown("+");
  element.dispatchEvent(eventK);

  const eventW = window.newWheel(100, 0);
  element.dispatchEvent(eventW);

  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "key",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 1.15,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: 0,
      totalDeltaZ: 1.15,
      direction: "in",
      intent: "zoom",
    },
    [eventK],
    watcher,
  );
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "wheel",
      deltaX: 100,
      deltaY: 0,
      deltaZ: 1,
      time: 0,
      totalDeltaX: 100,
      totalDeltaY: 0,
      totalDeltaZ: 1.15,
      direction: "right",
      intent: "scroll",
    },
    [eventW],
    watcher,
  );
});

describe("isValidInputDevice", () => {
  for (const device of DEVICES) {
    test(device, () => {
      expect(isValidInputDevice(device)).toBe(true);
    });
  }

  test("invalid", () => {
    expect(isValidInputDevice("")).toBe(false);
    expect(isValidInputDevice(" ")).toBe(false);
    expect(isValidInputDevice(" , ")).toBe(false);
    expect(isValidInputDevice("random")).toBe(false);
    expect(isValidInputDevice("scroll")).toBe(false);
  });
});

describe("isValidIntent", () => {
  for (const intent of INTENTS) {
    test(intent, () => {
      expect(isValidIntent(intent)).toBe(true);
    });
  }

  test("invalid", () => {
    expect(isValidIntent("")).toBe(false);
    expect(isValidIntent(" ")).toBe(false);
    expect(isValidIntent(" , ")).toBe(false);
    expect(isValidIntent("random")).toBe(false);
    expect(isValidIntent("key")).toBe(false);
  });
});

describe("isValidInputDeviceList", () => {
  for (const device of DEVICES) {
    test(device, () => {
      expect(isValidInputDeviceList(device)).toBe(true);
    });
  }

  test("multiple", () => {
    expect(isValidInputDeviceList("key,wheel")).toBe(true);
    expect(isValidInputDeviceList(["key"], ["wheel"])).toBe(true);
  });

  test("invalid", () => {
    expect(isValidInputDeviceList([])).toBe(false);
    expect(isValidInputDeviceList([""])).toBe(false);
    expect(isValidInputDeviceList("")).toBe(false);
    expect(isValidInputDeviceList(" ")).toBe(false);
    expect(isValidInputDeviceList(" , ")).toBe(false);
    expect(isValidInputDeviceList("random")).toBe(false);
    expect(isValidInputDeviceList("scroll")).toBe(false);
  });
});

describe("isValidIntentList", () => {
  for (const intent of INTENTS) {
    test(intent, () => {
      expect(isValidIntentList(intent)).toBe(true);
    });
  }

  test("multiple", () => {
    expect(isValidIntentList("scroll,zoom")).toBe(true);
    expect(isValidIntentList(["scroll"], ["zoom"])).toBe(true);
  });

  test("invalid", () => {
    expect(isValidIntentList([])).toBe(false);
    expect(isValidIntentList([""])).toBe(false);
    expect(isValidIntentList("")).toBe(false);
    expect(isValidIntentList(" ")).toBe(false);
    expect(isValidIntentList(" , ")).toBe(false);
    expect(isValidIntentList("random")).toBe(false);
    expect(isValidIntentList("key")).toBe(false);
  });
});
