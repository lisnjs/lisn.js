const { jest, describe, test, expect } = require("@jest/globals");

const { GestureWatcher } = window.LISN.watchers;

const LINE = 40;

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

test("with keyup event", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback);

  element.dispatchEvent(window.newKeyUp("Up"));
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0);
});

test("with irrelevant key", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback);

  const event = window.newKeyDown("X");
  element.dispatchEvent(event);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0);
});

test("baseline", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback);

  const event = window.newKeyDown("Up");
  element.dispatchEvent(event);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "key",
      deltaX: 0,
      deltaY: -LINE,
      deltaZ: 1,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: -LINE,
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

  element.dispatchEvent(window.newKeyDown("Down"));
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // but total deltas updated: +LINE

  element.dispatchEvent(window.newKeyDown("Down"));
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // but total deltas updated: +2 LINE

  const event = window.newKeyDown("Up");
  element.dispatchEvent(event);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "key",
      deltaX: 0,
      deltaY: -LINE,
      deltaZ: 1,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: +LINE, // 2 Down + 1 Up
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

  element.dispatchEvent(window.newKeyDown("Down"));
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // but total deltas updated: +LINE

  let event = window.newKeyDown("Up");
  element.dispatchEvent(event);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "key",
      deltaX: 0,
      deltaY: -LINE,
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

  event = window.newKeyDown("Left");
  element.dispatchEvent(event);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "key",
      deltaX: -LINE,
      deltaY: 0,
      deltaZ: 1,
      time: 0,
      totalDeltaX: -LINE,
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

  element.dispatchEvent(window.newKeyDown("+"));
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // but total deltas updated: + 1.15 Z

  const event = window.newKeyDown("Up");
  element.dispatchEvent(event);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "key",
      deltaX: 0,
      deltaY: -LINE,
      deltaZ: 1,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: -LINE,
      totalDeltaZ: 1.15,
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

  let event = window.newKeyDown("+");
  element.dispatchEvent(event);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1);
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
    [event],
    watcher,
  );

  event = window.newKeyDown("Up");
  element.dispatchEvent(event);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "key",
      deltaX: 0,
      deltaY: -LINE,
      deltaZ: 1,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: -LINE,
      totalDeltaZ: 1.15,
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

  element.dispatchEvent(window.newKeyDown("+"));
  element.dispatchEvent(window.newKeyDown("Up"));

  await window.waitFor(520);
  expect(callback).toHaveBeenCalledTimes(0); // ambiguous, but total deltas updated

  const event = window.newKeyDown("+");
  element.dispatchEvent(event);
  await window.waitFor(520);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "key",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 1.15,
      time: 0,
      totalDeltaX: 0,
      totalDeltaY: -LINE,
      totalDeltaZ: 1.15 * 1.15,
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

    const event = window.newKeyDown("Up");
    element.dispatchEvent(event);
    await window.waitFor(10); // callback is async
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      element,
      {
        device: "key",
        deltaX: 0,
        deltaY: -LINE,
        deltaZ: 1,
        time: 0,
        totalDeltaX: 0,
        totalDeltaY: -LINE,
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
    });

    const irrelevantEvent = window.newKeyDown("A");
    const event = window.newKeyDown("Up");
    element.dispatchEvent(irrelevantEvent);
    element.dispatchEvent(event);
    element.dispatchEvent(irrelevantEvent);

    await window.waitFor(10); // callback is async
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      element,
      {
        device: "key",
        deltaX: 0,
        deltaY: -LINE,
        deltaZ: 1,
        time: event.timeStamp - irrelevantEvent.timeStamp,
        totalDeltaX: 0,
        totalDeltaY: -LINE,
        totalDeltaZ: 1,
        direction: "up",
        intent: "scroll",
      },
      [irrelevantEvent, event],
      watcher,
    );

    expect(event.defaultPrevented).toBe(true);
    expect(irrelevantEvent.defaultPrevented).toBe(false);
  });
});

test("with debounceWindow", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, {
    debounceWindow: 500,
  });

  const eventA = window.newKeyDown("Up");
  const eventB = window.newKeyDown("Down");
  const eventC = window.newKeyDown("Up");
  const eventD = window.newKeyDown("Up");
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
      device: "key",
      deltaX: 0,
      deltaY: -2 * LINE, // effective summed from up + down + up + up
      deltaZ: 1,
      time: eventD.timeStamp - eventA.timeStamp,
      totalDeltaX: 0,
      totalDeltaY: -2 * LINE,
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

  const eventA = window.newKeyDown("Down");
  element.dispatchEvent(eventA);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // +40

  const eventB = window.newKeyDown("Down");
  element.dispatchEvent(eventB);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // +80

  const eventC = window.newKeyDown("Up");
  element.dispatchEvent(eventC);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // +40

  const eventD = window.newKeyDown("Down");
  element.dispatchEvent(eventD);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // +80

  const eventE = window.newKeyDown("Down");
  element.dispatchEvent(eventE);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1); // +120
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "key",
      deltaX: 0,
      deltaY: 3 * LINE,
      deltaZ: 1,
      time: eventE.timeStamp - eventA.timeStamp,
      totalDeltaX: 0,
      totalDeltaY: 3 * LINE,
      totalDeltaZ: 1,
      direction: "down",
      intent: "scroll",
    },
    [eventA, eventB, eventC, eventD, eventE],
    watcher,
  );
});
