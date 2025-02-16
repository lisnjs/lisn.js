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

  const eventA = window.newMouse("move", 10, 10);
  const eventB = window.newClick(2);
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0);
});

test("with no move", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback);

  const eventA = window.newTouch("start", [10, 10]);
  const eventB = window.newTouch("end", [10, 10]);
  const eventC = window.newClick(2);
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  element.dispatchEvent(eventC);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0);

  // touchstart and touchend are not default-prevented as they have no default action
  expect(eventA.defaultPrevented).toBe(false);
  expect(eventB.defaultPrevented).toBe(false);
  // click is only prevented for pointer gestures
  expect(eventC.defaultPrevented).toBe(false);
});

test("with 1 relevant + irrelevant events + another relevant", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback);

  const eventA = window.newMouse("down", 10, 10); // should be ignored
  const eventB = window.newTouch("start", [10, 10]);
  const eventC = window.newClick(2);
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  element.dispatchEvent(eventC);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // no gesture yet, but accumulating events

  const eventD = window.newTouch("move", [10, 100]);
  element.dispatchEvent(eventD);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "touch",
      deltaX: 0,
      deltaY: -90,
      deltaZ: 1,
      time: eventD.timeStamp - eventA.timeStamp,
      totalDeltaX: 0,
      totalDeltaY: -90,
      totalDeltaZ: 1,
      direction: "up",
      intent: "scroll",
    },
    [eventA, eventB, eventC, eventD],
  );
});

test("after touchcancel", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback);

  const eventA = window.newTouch("cancel", [10, 10]);
  const eventB = window.newTouch("move", [10, 10]);
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0);
});

test("baseline", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback);

  const eventA = window.newTouch("start", [100, 200]);
  const eventB = window.newTouch("move", [100, 100]);
  const eventC = window.newTouch("end");
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
      device: "touch",
      deltaX: 0,
      deltaY: 100,
      deltaZ: 1,
      time: eventB.timeStamp - eventA.timeStamp,
      totalDeltaX: 0,
      totalDeltaY: 100,
      totalDeltaZ: 1,
      direction: "down",
      intent: "scroll",
    },
    [eventA, eventB],
  );

  // touchstart and touchend are not default-prevented as they have no default action
  expect(eventA.defaultPrevented).toBe(false);
  expect(eventB.defaultPrevented).toBe(true);
  expect(eventC.defaultPrevented).toBe(false);
  // click is only prevented for pointer gestures
  expect(eventD.defaultPrevented).toBe(false);
});

test("with natural scrolling OFF", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, { naturalTouchScroll: false });

  const eventA = window.newTouch("start", [100, 200]);
  const eventB = window.newTouch("move", [100, 100]);
  const eventC = window.newTouch("end");
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
      device: "touch",
      deltaX: 0,
      deltaY: -100,
      deltaZ: 1,
      time: eventB.timeStamp - eventA.timeStamp,
      totalDeltaX: 0,
      totalDeltaY: -100,
      totalDeltaZ: 1,
      direction: "up",
      intent: "scroll",
    },
    [eventA, eventB],
  );
});

test("press and hold => drag", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback);

  const eventA = window.newTouch("start", [100, 200]);
  element.dispatchEvent(eventA);
  await window.waitFor(600);

  const eventB = window.newTouch("move", [100, 100]);
  const eventC = window.newTouch("end");
  const eventD = window.newClick(0);
  element.dispatchEvent(eventB);
  element.dispatchEvent(eventC);
  element.dispatchEvent(eventD);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "touch",
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
});

test("with direction (single)", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, {
    directions: "down",
  });

  const eventA = window.newTouch("start", [100, 200]);
  const eventB = window.newTouch("move", [100, 300]); // up
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // but total deltas updated: +100

  const eventC = window.newTouch("move", [100, 250]); // down since last
  element.dispatchEvent(eventC);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "touch",
      deltaX: 0,
      deltaY: 50,
      deltaZ: 1,
      time: eventC.timeStamp - eventB.timeStamp,
      totalDeltaX: 0,
      totalDeltaY: -50,
      totalDeltaZ: 1,
      direction: "down",
      intent: "scroll",
    },
    [eventB, eventC],
  );
});

test("with direction (multiple)", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, {
    directions: ["down", "right"],
  });

  const eventA = window.newTouch("start", [100, 200]);
  const eventB = window.newTouch("move", [100, 300]); // up
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // but total deltas updated: +100

  const eventC = window.newTouch("move", [100, 250]); // down since last
  element.dispatchEvent(eventC);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "touch",
      deltaX: 0,
      deltaY: 50,
      deltaZ: 1,
      time: eventC.timeStamp - eventB.timeStamp,
      totalDeltaX: 0,
      totalDeltaY: -50,
      totalDeltaZ: 1,
      direction: "down",
      intent: "scroll",
    },
    [eventB, eventC],
  );

  const eventD = window.newTouch("move", [0, 250]); // right since last
  element.dispatchEvent(eventD);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "touch",
      deltaX: 100,
      deltaY: 0,
      deltaZ: 1,
      time: eventD.timeStamp - eventC.timeStamp,
      totalDeltaX: 100,
      totalDeltaY: -50,
      totalDeltaZ: 1,
      direction: "right",
      intent: "scroll",
    },
    [eventC, eventD],
  );
});

test("with intent (single)", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, {
    intents: "zoom",
  });

  const eventA = window.newTouch("start", [150, 100], [200, 100]);
  const eventB = window.newTouch("move", [150, 200], [200, 200]); // scroll
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // but total deltas updated: +100 Y

  const eventC = window.newTouch("move", [50, 200], [300, 200]); // zoom in
  element.dispatchEvent(eventC);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "touch",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 250 / 50,
      time: eventC.timeStamp - eventB.timeStamp,
      totalDeltaX: 0,
      totalDeltaY: -100,
      totalDeltaZ: 250 / 50,
      direction: "in",
      intent: "zoom",
    },
    [eventB, eventC],
  );
});

test("with intent (multiple)", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, {
    intents: ["scroll", "zoom"],
  });

  const eventA = window.newTouch("start", [150, 100], [200, 100]);
  const eventB = window.newTouch("move", [150, 200], [200, 200]); // scroll
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "touch",
      deltaX: 0,
      deltaY: -100,
      deltaZ: 1,
      time: eventB.timeStamp - eventA.timeStamp,
      totalDeltaX: 0,
      totalDeltaY: -100,
      totalDeltaZ: 1,
      direction: "up",
      intent: "scroll",
    },
    [eventA, eventB],
  );

  const eventC = window.newTouch("move", [50, 200], [300, 200]); // zoom in
  element.dispatchEvent(eventC);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "touch",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 250 / 50,
      time: eventC.timeStamp - eventB.timeStamp,
      totalDeltaX: 0,
      totalDeltaY: -100,
      totalDeltaZ: 250 / 50,
      direction: "in",
      intent: "zoom",
    },
    [eventB, eventC],
  );
});

describe("preventDefault", () => {
  test("false", async () => {
    const { callback, watcher, element } = newWatcherElement();
    watcher.onGesture(element, callback, {
      preventDefault: false,
    });

    const eventA = window.newTouch("start", [100, 200]);
    const eventB = window.newTouch("move", [100, 100]);
    const eventC = window.newTouch("end");
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
        device: "touch",
        deltaX: 0,
        deltaY: 100,
        deltaZ: 1,
        time: eventB.timeStamp - eventA.timeStamp,
        totalDeltaX: 0,
        totalDeltaY: 100,
        totalDeltaZ: 1,
        direction: "down",
        intent: "scroll",
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

    const eventA = window.newTouch("start", [100, 200]);
    const eventB = window.newTouch("move", [100, 100]);
    const eventC = window.newTouch("end");
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
        device: "touch",
        deltaX: 0,
        deltaY: 100,
        deltaZ: 1,
        time: eventB.timeStamp - eventA.timeStamp,
        totalDeltaX: 0,
        totalDeltaY: 100,
        totalDeltaZ: 1,
        direction: "down",
        intent: "scroll",
      },
      [eventA, eventB],
    );

    // touchstart and end are not prevented (TODO should we?)
    expect(eventA.defaultPrevented).toBe(false);
    expect(eventB.defaultPrevented).toBe(true);
    expect(eventC.defaultPrevented).toBe(false);
    // click is only prevented for pointer gestures
    expect(eventD.defaultPrevented).toBe(false);
  });
});

test("with debounceWindow", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, {
    debounceWindow: 500,
  });

  const eventA = window.newTouch("start", [100, 200]);
  const eventB = window.newTouch("move", [100, 100]);
  const eventC = window.newTouch("move", [100, 300]);
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
      device: "touch",
      deltaX: 0,
      deltaY: -100, // effective sum
      deltaZ: 1,
      time: eventC.timeStamp - eventA.timeStamp,
      totalDeltaX: 0,
      totalDeltaY: -100,
      totalDeltaZ: 1,
      direction: "up",
      intent: "scroll",
    },
    [eventA, eventB, eventC],
  );
});

test("with deltaThreshold", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, {
    deltaThreshold: 150,
  });

  const eventA = window.newTouch("start", [100, 100]);
  const eventB = window.newTouch("move", [100, 150]);
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // +50

  const eventC = window.newTouch("move", [100, 200]);
  element.dispatchEvent(eventC);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // +100

  const eventD = window.newTouch("move", [100, 150]);
  element.dispatchEvent(eventD);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // +50

  const eventE = window.newTouch("move", [100, 250]);
  element.dispatchEvent(eventE);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(1); // +150
  expect(callback).toHaveBeenCalledWith(
    element,
    {
      device: "touch",
      deltaX: 0,
      deltaY: -150,
      deltaZ: 1,
      time: eventE.timeStamp - eventA.timeStamp,
      totalDeltaX: 0,
      totalDeltaY: -150,
      totalDeltaZ: 1,
      direction: "up",
      intent: "scroll",
    },
    [eventA, eventB, eventC, eventD, eventE],
  );
});

test("with deltaThreshold: terminating before exceeded", async () => {
  const { callback, watcher, element } = newWatcherElement();
  watcher.onGesture(element, callback, {
    deltaThreshold: 100,
  });

  const eventA = window.newTouch("start", [100, 100]);
  const eventB = window.newTouch("move", [100, 150]);
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // +50

  const eventC = window.newTouch("cancel", [100, 150]); // terminates
  const eventD = window.newTouch("move", [100, 200]);
  element.dispatchEvent(eventC);
  element.dispatchEvent(eventD);
  await window.waitFor(10); // callback is async
  expect(callback).toHaveBeenCalledTimes(0); // +100 but terminated by pointerup
});
