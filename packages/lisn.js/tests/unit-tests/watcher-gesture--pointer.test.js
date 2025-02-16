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

  const eventA = window.newTouch("start", [10, 10]);
  const eventB = window.newClick(2);
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0);
});

test("with no move", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback);

  const eventA = window.newMouse("down", 10, 10);
  const eventB = window.newMouse("up", 10, 10);
  const eventC = window.newClick(2);
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  element.dispatchEvent(eventC);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0);

  // pointerdown is always prevented as long as the buttons is 1
  expect(eventA.defaultPrevented).toBe(true);
  expect(eventB.defaultPrevented).toBe(false);
  expect(eventC.defaultPrevented).toBe(false);
});

test("with 1 relevant + irrelevant events + another relevant", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback);

  const eventA = window.newTouch("start", [10, 10]); // should be ignored
  const eventB = window.newMouse("down", 10, 10);
  const eventC = window.newClick(2);
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  element.dispatchEvent(eventC);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // no gesture yet, but accumulating events

  const eventD = window.newMouse("move", 10, 100);
  element.dispatchEvent(eventD);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "pointer",
      deltaX: 0,
      deltaY: 90,
      deltaZ: 1,
      time: eventD.timeStamp - eventA.timeStamp,
      totalDeltaX: 0,
      totalDeltaY: 90,
      totalDeltaZ: 1,
      direction: "down",
      intent: "drag",
    },
    [eventA, eventB, eventC, eventD],
  );
});

test("while holding button 2", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback);

  const eventA = window.newMouse("down", 100, 200, 2);
  const eventB = window.newMouse("move", 100, 100, 2);
  const eventC = window.newMouse("up", 100, 100, 2);
  const eventD = window.newClick(2);
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  element.dispatchEvent(eventC);
  element.dispatchEvent(eventD);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0);

  expect(eventA.defaultPrevented).toBe(false);
  expect(eventB.defaultPrevented).toBe(false);
  expect(eventC.defaultPrevented).toBe(false);
  expect(eventD.defaultPrevented).toBe(false);
});

test("while not holding buttons", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback);

  const eventA = window.newMouse("down", 100, 200, 0);
  const eventB = window.newMouse("move", 100, 100, 0);
  const eventC = window.newMouse("up", 100, 100, 0);
  const eventD = window.newClick(0);
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  element.dispatchEvent(eventC);
  element.dispatchEvent(eventD);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0);

  expect(eventA.defaultPrevented).toBe(false);
  expect(eventB.defaultPrevented).toBe(false);
  expect(eventC.defaultPrevented).toBe(false);
  expect(eventD.defaultPrevented).toBe(false);
});

test("baseline", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback);

  const eventA = window.newMouse("down", 100, 200);
  const eventB = window.newMouse("move", 100, 100);
  const eventC = window.newMouse("up", 100, 100);
  const eventD = window.newClick(0);
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  element.dispatchEvent(eventC);
  element.dispatchEvent(eventD);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "pointer",
      deltaX: 0,
      deltaY: -100,
      deltaZ: 1,
      time: eventB.timeStamp - eventA.timeStamp,
      totalDeltaX: 0,
      totalDeltaY: -100,
      totalDeltaZ: 1,
      direction: "up",
      intent: "drag",
    },
    [eventA, eventB],
  );

  expect(eventA.defaultPrevented).toBe(true);
  // pointermove and pointerup are not default-prevented as they have no default action
  expect(eventB.defaultPrevented).toBe(false);
  expect(eventC.defaultPrevented).toBe(false);
  expect(eventD.defaultPrevented).toBe(true);
});

test("with direction (single)", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, {
    directions: "up",
  });

  const eventA = window.newMouse("down", 100, 200);
  const eventB = window.newMouse("move", 100, 300); // down
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // but total deltas updated: +100

  const eventC = window.newMouse("move", 100, 250); // up since last
  element.dispatchEvent(eventC);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "pointer",
      deltaX: 0,
      deltaY: -50,
      deltaZ: 1,
      time: eventC.timeStamp - eventB.timeStamp,
      totalDeltaX: 0,
      totalDeltaY: +50,
      totalDeltaZ: 1,
      direction: "up",
      intent: "drag",
    },
    [eventB, eventC],
  );
});

test("with direction (multiple)", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, {
    directions: ["up", "left"],
  });

  const eventA = window.newMouse("down", 100, 200);
  const eventB = window.newMouse("move", 100, 300); // down
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // but total deltas updated: +100

  const eventC = window.newMouse("move", 100, 250); // up since last
  element.dispatchEvent(eventC);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "pointer",
      deltaX: 0,
      deltaY: -50,
      deltaZ: 1,
      time: eventC.timeStamp - eventB.timeStamp,
      totalDeltaX: 0,
      totalDeltaY: +50,
      totalDeltaZ: 1,
      direction: "up",
      intent: "drag",
    },
    [eventB, eventC],
  );

  const eventD = window.newMouse("move", 0, 250); // left since last
  element.dispatchEvent(eventD);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "pointer",
      deltaX: -100,
      deltaY: 0,
      deltaZ: 1,
      time: eventD.timeStamp - eventC.timeStamp,
      totalDeltaX: -100,
      totalDeltaY: +50,
      totalDeltaZ: 1,
      direction: "left",
      intent: "drag",
    },
    [eventC, eventD],
  );
});

describe("preventDefault", () => {
  test("false", async () => {
    const { callback, watcher, element } = newWatcherElement();
    watcher.onGesture(element, callback, {
      preventDefault: false,
    });

    const eventA = window.newMouse("down", 100, 200);
    const eventB = window.newMouse("move", 100, 100);
    const eventC = window.newMouse("up", 100, 100);
    const eventD = window.newClick();
    element.dispatchEvent(eventA);
    element.dispatchEvent(eventB);
    element.dispatchEvent(eventC);
    element.dispatchEvent(eventD);
    await window.waitFor(10); // callback is async
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      element,
      {
        device: "pointer",
        deltaX: 0,
        deltaY: -100,
        deltaZ: 1,
        time: eventB.timeStamp - eventA.timeStamp,
        totalDeltaX: 0,
        totalDeltaY: -100,
        totalDeltaZ: 1,
        direction: "up",
        intent: "drag",
      },
      [eventA, eventB],
    );

    expect(eventA.defaultPrevented).toBe(false);
    expect(eventB.defaultPrevented).toBe(false);
    expect(eventC.defaultPrevented).toBe(false);
    expect(eventD.defaultPrevented).toBe(false);
  });

  test("true", async () => {
    const { callback, watcher, element } = newWatcherElement();
    watcher.onGesture(element, callback, {
      // preventDefault: true, // default is true
    });

    const eventA = window.newMouse("down", 100, 200);
    const eventB = window.newMouse("move", 100, 100);
    const eventC = window.newMouse("up", 100, 100);
    const eventD = window.newClick();
    element.dispatchEvent(eventA);
    element.dispatchEvent(eventB);
    element.dispatchEvent(eventC);
    element.dispatchEvent(eventD);
    await window.waitFor(10); // callback is async
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      element,
      {
        device: "pointer",
        deltaX: 0,
        deltaY: -100,
        deltaZ: 1,
        time: eventB.timeStamp - eventA.timeStamp,
        totalDeltaX: 0,
        totalDeltaY: -100,
        totalDeltaZ: 1,
        direction: "up",
        intent: "drag",
      },
      [eventA, eventB],
    );

    expect(eventA.defaultPrevented).toBe(true);
    // pointermove and pointerup are not default-prevented as they have no default action
    expect(eventB.defaultPrevented).toBe(false);
    expect(eventC.defaultPrevented).toBe(false);
    expect(eventD.defaultPrevented).toBe(true);
  });
});

test("with debounceWindow", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, {
    debounceWindow: 500,
  });

  const eventA = window.newMouse("down", 100, 200);
  const eventB = window.newMouse("move", 100, 100);
  const eventC = window.newMouse("move", 100, 300);
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  element.dispatchEvent(eventC);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0);

  await window.waitFor(520);
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "pointer",
      deltaX: 0,
      deltaY: +100, // effective sum
      deltaZ: 1,
      time: eventC.timeStamp - eventA.timeStamp,
      totalDeltaX: 0,
      totalDeltaY: +100,
      totalDeltaZ: 1,
      direction: "down",
      intent: "drag",
    },
    [eventA, eventB, eventC],
  );
});

test("with deltaThreshold", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, {
    deltaThreshold: 150,
  });

  const eventA = window.newMouse("down", 100, 100);
  const eventB = window.newMouse("move", 100, 150);
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // +50

  const eventC = window.newMouse("move", 100, 200);
  element.dispatchEvent(eventC);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // +100

  const eventD = window.newMouse("move", 100, 150);
  element.dispatchEvent(eventD);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // +50

  const eventE = window.newMouse("move", 100, 250);
  element.dispatchEvent(eventE);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1); // +150
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "pointer",
      deltaX: 0,
      deltaY: 150,
      deltaZ: 1,
      time: eventE.timeStamp - eventA.timeStamp,
      totalDeltaX: 0,
      totalDeltaY: +150,
      totalDeltaZ: 1,
      direction: "down",
      intent: "drag",
    },
    [eventA, eventB, eventC, eventD, eventE],
  );
});

test("with deltaThreshold: terminating before exceeded", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, {
    deltaThreshold: 100,
  });

  const eventA = window.newPointer("down", 100, 100);
  const eventB = window.newPointer("move", 100, 150);
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // +50

  const eventC = window.newPointer("cancel", 100, 150);
  const eventD = window.newPointer("move", 100, 200);
  element.dispatchEvent(eventC);
  element.dispatchEvent(eventD);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // +100 but terminated by pointerup
});
