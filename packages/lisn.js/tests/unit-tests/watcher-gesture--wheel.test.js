const { jest, describe, test, expect } = require("@jest/globals");

const { GestureWatcher } = window.LISN.watchers;

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

test("with irrelevant events", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback);

  const event = new MouseEvent("mousedown");
  element.dispatchEvent(event);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0);
});

test("baseline", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback);

  const event = window.newWheel(0, -100);
  element.dispatchEvent(event);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "wheel",
      deltaX: 0,
      deltaY: -100,
      deltaZ: 1,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: -100,
      totalDeltaZ: 1,
      direction: "up",
      intent: "scroll",
    },
    [event],
    watcher,
  );

  expect(event.defaultPrevented).toBe(true);
});

test("with direction (single)", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, { directions: "up" });

  element.dispatchEvent(window.newWheel(0, 100));
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // but total deltas updated: +100

  element.dispatchEvent(window.newWheel(0, 100));
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // but total deltas updated: +200

  const event = window.newWheel(0, -100);
  element.dispatchEvent(event);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "wheel",
      deltaX: 0,
      deltaY: -100,
      deltaZ: 1,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: +100, // 2 Down + 1 Up
      totalDeltaZ: 1,
      direction: "up",
      intent: "scroll",
    },
    [event],
    watcher,
  );
});

test("with direction (multiple)", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, {
    directions: ["up", "left"],
  });

  element.dispatchEvent(window.newWheel(0, 100));
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // but total deltas updated: +100

  let event = window.newWheel(0, -100);
  element.dispatchEvent(event);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "wheel",
      deltaX: 0,
      deltaY: -100,
      deltaZ: 1,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: 0, // Down + Up
      totalDeltaZ: 1,
      direction: "up",
      intent: "scroll",
    },
    [event],
    watcher,
  );

  event = window.newWheel(-100, 0);
  element.dispatchEvent(event);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "wheel",
      deltaX: -100,
      deltaY: 0,
      deltaZ: 1,
      time: 0,
      totalDeltaX: -100,
      totalDeltaY: 0,
      totalDeltaZ: 1,
      direction: "left",
      intent: "scroll",
    },
    [event],
    watcher,
  );
});

test("with intent (single)", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, { intents: "scroll" });

  // remember, if delta >= 50 it is treated as a mouse wheel and divided by 10
  element.dispatchEvent(window.newWheel(0, -50, false, true)); // + 5%
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // but total deltas updated: + 0.5 Z

  const event = window.newWheel(0, -100);
  element.dispatchEvent(event);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "wheel",
      deltaX: 0,
      deltaY: -100,
      deltaZ: 1,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: -100,
      totalDeltaZ: 1.05,
      direction: "up",
      intent: "scroll",
    },
    [event],
    watcher,
  );
});

test("with intent (multiple)", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, {
    intents: ["scroll", "zoom"],
  });

  let event = window.newWheel(0, -40, false, true); // +40% zoom
  element.dispatchEvent(event);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "wheel",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 1.4,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: 0,
      totalDeltaZ: 1.4,
      direction: "in",
      intent: "zoom",
    },
    [event],
    watcher,
  );

  event = window.newWheel(0, -100); // up
  element.dispatchEvent(event);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "wheel",
      deltaX: 0,
      deltaY: -100,
      deltaZ: 1,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: -100,
      totalDeltaZ: 1.4,
      direction: "up",
      intent: "scroll",
    },
    [event],
    watcher,
  );
});

test("with intent (multiple) + debounce window", async () => {
  // so that we can test with ambiguous intent which only occurs when summing
  // deltas
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, {
    intents: ["scroll", "zoom"],
    debounceWindow: 500,
  });

  // remember, if delta >= 50 it is treated as a mouse wheel and divided by 10
  element.dispatchEvent(window.newWheel(0, -50, false, true)); // +5% zoom
  element.dispatchEvent(window.newWheel(0, -100)); // up

  await window.waitFor(520);
  expect(callback).toHaveBeenCalledTimes(0); // ambiguous, but total deltas updated

  const event = window.newWheel(0, -20, false, true); // +20% zoom
  element.dispatchEvent(event);
  await window.waitFor(520);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "wheel",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 1.2,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: -100,
      totalDeltaZ: 1.05 * 1.2,
      direction: "in",
      intent: "zoom",
    },
    [event],
    watcher,
  );
});

describe("preventDefault", () => {
  test("false", async () => {
    const { callback, watcher, element } = newWatcherElement();
    watcher.onGesture(element, callback, {
      preventDefault: false,
    });

    const event = window.newWheel(0, -100);
    element.dispatchEvent(event);
    await window.waitFor(10); // callback is async
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      element,
      {
        device: "wheel",
        deltaX: 0,
        deltaY: -100,
        deltaZ: 1,
        time: 0,
        totalDeltaX: 0,
        totalDeltaY: -100,
        totalDeltaZ: 1,
        direction: "up",
        intent: "scroll",
      },
      [event],
      watcher,
    );

    expect(event.defaultPrevented).toBe(false);
  });

  test("true", async () => {
    const { callback, watcher, element } = newWatcherElement();
    watcher.onGesture(element, callback, {
      // preventDefault: true, // default is true
      devices: "wheel",
    });

    const irrelevantEventA = new MouseEvent("mousedown");
    const irrelevantEventB = new KeyboardEvent("keydown", { key: "+" });
    const event = window.newWheel(0, -100);
    element.dispatchEvent(irrelevantEventA);
    element.dispatchEvent(event);
    element.dispatchEvent(irrelevantEventB);

    await window.waitFor(10); // callback is async
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      element,
      {
        device: "wheel",
        deltaX: 0,
        deltaY: -100,
        deltaZ: 1,
        time: 0,
        totalDeltaX: 0,
        totalDeltaY: -100,
        totalDeltaZ: 1,
        direction: "up",
        intent: "scroll",
      },
      [event],
      watcher,
    );

    expect(event.defaultPrevented).toBe(true);
    expect(irrelevantEventA.defaultPrevented).toBe(false);
    expect(irrelevantEventB.defaultPrevented).toBe(false);
  });
});

test("with debounceWindow", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, {
    debounceWindow: 500,
  });

  const eventA = window.newWheel(0, -100);
  const eventB = window.newWheel(0, 100);
  const eventC = window.newWheel(0, -100);
  const eventD = window.newWheel(0, -100);
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  element.dispatchEvent(eventC);
  element.dispatchEvent(eventD);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0);

  await window.waitFor(520);
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "wheel",
      deltaX: 0,
      deltaY: -2 * 100, // effective summed from up + down + up + up
      deltaZ: 1,
      time: eventD.timeStamp - eventA.timeStamp,
      totalDeltaX: 0,
      totalDeltaY: -2 * 100,
      totalDeltaZ: 1,
      direction: "up",
      intent: "scroll",
    },
    [eventA, eventB, eventC, eventD],
    watcher,
  );
});

test("with deltaThreshold", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, {
    deltaThreshold: 120,
  });

  const eventA = window.newWheel(0, 40);
  element.dispatchEvent(eventA);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // +40

  const eventB = window.newWheel(0, 40);
  element.dispatchEvent(eventB);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // +80

  const eventC = window.newWheel(0, -40);
  element.dispatchEvent(eventC);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // +40

  const eventD = window.newWheel(0, 40);
  element.dispatchEvent(eventD);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // +80

  const eventE = window.newWheel(0, 40);
  element.dispatchEvent(eventE);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1); // +120
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "wheel",
      deltaX: 0,
      deltaY: 3 * 40,
      deltaZ: 1,
      time: eventE.timeStamp - eventA.timeStamp,
      totalDeltaX: 0,
      totalDeltaY: 3 * 40,
      totalDeltaZ: 1,
      direction: "down",
      intent: "scroll",
    },
    [eventA, eventB, eventC, eventD, eventE],
    watcher,
  );
});
