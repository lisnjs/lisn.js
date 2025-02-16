const { jest, describe, test, expect } = require("@jest/globals");

const { isValidPointerAction, isValidPointerActionList } = window.LISN.utils;

const { PointerWatcher } = window.LISN.watchers;

const ACTIONS = ["click", "hover", "press"];

const newWatcherElement = () => {
  const startCallback = jest.fn();
  const endCallback = jest.fn();

  const watcher = PointerWatcher.create();
  const element = document.createElement("div");

  return { startCallback, endCallback, watcher, element };
};

test("illegal constructor", () => {
  expect(() => new PointerWatcher()).toThrow(/Illegal constructor/);
});

test("create reusable", () => {
  const watcherA = PointerWatcher.reuse();
  const watcherB = PointerWatcher.reuse();

  expect(watcherA).toBeInstanceOf(PointerWatcher);
  expect(watcherA).toBe(watcherB);
});

test("passing endHandler same as startHandler", async () => {
  const { startCallback, watcher, element } = newWatcherElement();
  await watcher.onPointer(element, startCallback, startCallback);

  element.dispatchEvent(window.newClick());
  await window.waitFor(0); // call is async
  expect(startCallback).toHaveBeenCalledTimes(1);

  element.dispatchEvent(window.newClick());
  await window.waitFor(0); // call is async
  expect(startCallback).toHaveBeenCalledTimes(2);
});

test("not passing endHandler", async () => {
  const { startCallback, watcher, element } = newWatcherElement();
  await watcher.onPointer(element, startCallback);

  element.dispatchEvent(window.newClick());
  await window.waitFor(0); // call is async
  expect(startCallback).toHaveBeenCalledTimes(1);

  element.dispatchEvent(window.newClick());
  await window.waitFor(0); // call is async
  expect(startCallback).toHaveBeenCalledTimes(2);
});

describe("duplicate handler", () => {
  test("same target, same options", async () => {
    const { startCallback, endCallback, watcher, element } =
      newWatcherElement();
    await Promise.all([
      watcher.onPointer(element, startCallback, endCallback),
      watcher.onPointer(element, startCallback, endCallback),
    ]);
    await watcher.onPointer(element, startCallback, endCallback);

    element.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(1);
    expect(endCallback).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(1);
    expect(endCallback).toHaveBeenCalledTimes(1);
  });

  test("same target, different options", async () => {
    const { startCallback, endCallback, watcher, element } =
      newWatcherElement();
    watcher.onPointer(element, startCallback, endCallback); // removed immediately
    await watcher.onPointer(element, startCallback, endCallback, {
      actions: "click",
    });

    element.dispatchEvent(window.newClick()); // ON
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(1);
    expect(endCallback).toHaveBeenCalledTimes(0);

    await watcher.onPointer(element, startCallback, endCallback, {
      // resets toggle state
      actions: "click",
    });

    element.dispatchEvent(window.newClick()); // ON
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(2);
    expect(endCallback).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newClick()); // OFF
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(2);
    expect(endCallback).toHaveBeenCalledTimes(1);
  });

  test("different target v1", async () => {
    const { startCallback, endCallback, watcher, element } =
      newWatcherElement();
    const elementB = document.createElement("div");
    await Promise.all([
      watcher.onPointer(element, startCallback, endCallback),
      watcher.onPointer(elementB, startCallback, endCallback),
    ]);

    element.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(1);
    expect(endCallback).toHaveBeenCalledTimes(0);

    elementB.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(2);
    expect(endCallback).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(2);
    expect(endCallback).toHaveBeenCalledTimes(1);

    elementB.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(2);
    expect(endCallback).toHaveBeenCalledTimes(2);
  });

  test("different target v2", async () => {
    const { startCallback, endCallback, watcher, element } =
      newWatcherElement();
    const elementB = document.createElement("div");
    await watcher.onPointer(element, startCallback, endCallback);
    await watcher.onPointer(elementB, startCallback, endCallback);

    element.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(1);
    expect(endCallback).toHaveBeenCalledTimes(0);

    elementB.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(2);
    expect(endCallback).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(2);
    expect(endCallback).toHaveBeenCalledTimes(1);

    elementB.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(2);
    expect(endCallback).toHaveBeenCalledTimes(2);
  });
});

describe("offPointer", () => {
  test("awaiting", async () => {
    const { startCallback, endCallback, watcher, element } =
      newWatcherElement();

    await watcher.onPointer(element, startCallback, endCallback);
    watcher.offPointer(element, startCallback, endCallback);

    element.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(0);
    expect(endCallback).toHaveBeenCalledTimes(0);
  });

  test("immediate", async () => {
    const { startCallback, endCallback, watcher, element } =
      newWatcherElement();

    watcher.onPointer(element, startCallback, endCallback);
    watcher.offPointer(element, startCallback, endCallback);

    element.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(0);
    expect(endCallback).toHaveBeenCalledTimes(0);
  });

  test("with mismatching options", async () => {
    const { startCallback, endCallback, watcher, element } =
      newWatcherElement();

    watcher.onPointer(element, startCallback, endCallback, {
      actions: "click",
    });
    watcher.offPointer(element, startCallback, endCallback);

    element.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(0);
    expect(endCallback).toHaveBeenCalledTimes(0);
  });

  test("with different target v1", async () => {
    const { watcher, startCallback, endCallback, element } =
      newWatcherElement();
    const elementB = document.createElement("div");

    watcher.onPointer(element, startCallback, endCallback);
    watcher.offPointer(elementB, startCallback, endCallback); // no-op

    elementB.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(0);
    expect(endCallback).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(1);
    expect(endCallback).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(1);
    expect(endCallback).toHaveBeenCalledTimes(1);
  });

  test("with different target v2", async () => {
    const { watcher, startCallback, endCallback, element } =
      newWatcherElement();
    const elementB = document.createElement("div");

    watcher.onPointer(element, startCallback, endCallback);
    watcher.onPointer(elementB, startCallback, endCallback);
    watcher.offPointer(elementB, startCallback, endCallback); // removed for elementB only

    elementB.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(0);
    expect(endCallback).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(1);
    expect(endCallback).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(1);
    expect(endCallback).toHaveBeenCalledTimes(1);
  });
});

describe("actions", () => {
  test("invalid", async () => {
    const { startCallback, endCallback, watcher, element } =
      newWatcherElement();

    await expect(() =>
      watcher.onPointer(element, startCallback, endCallback, {
        actions: "invalid",
      }),
    ).rejects.toThrow(/Invalid value for 'actions'/);

    await expect(() =>
      watcher.onPointer(element, startCallback, endCallback, {
        actions: ["invalid"],
      }),
    ).rejects.toThrow(/Invalid value for 'actions'/);

    await expect(() =>
      watcher.onPointer(element, startCallback, endCallback, {
        actions: false,
      }),
    ).rejects.toThrow(/'actions' must be a string or a string array/);
  });

  test("array", async () => {
    const { watcher, startCallback, endCallback, element } =
      newWatcherElement();

    watcher.onPointer(element, startCallback, endCallback, {
      actions: ["click", "press"],
    });

    element.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(1);
    expect(endCallback).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newMouse("down"));
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(2);
    expect(endCallback).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newMouse("up"));
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(2);
    expect(endCallback).toHaveBeenCalledTimes(1);

    element.dispatchEvent(window.newMouse("enter"));
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(2); // no new calls
    expect(endCallback).toHaveBeenCalledTimes(1);
  });

  test("comma-separated string with spaces", async () => {
    const { watcher, startCallback, endCallback, element } =
      newWatcherElement();

    watcher.onPointer(element, startCallback, endCallback, {
      actions: "click, press",
    });

    element.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(1);
    expect(endCallback).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newMouse("down"));
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(2);
    expect(endCallback).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newMouse("up"));
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(2);
    expect(endCallback).toHaveBeenCalledTimes(1);

    element.dispatchEvent(window.newMouse("enter"));
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(2); // no new calls
    expect(endCallback).toHaveBeenCalledTimes(1);
  });

  for (const action of ACTIONS) {
    // TODO test.each
    test("specific action: " + action, async () => {
      const { startCallback, endCallback, watcher, element } =
        newWatcherElement();
      await watcher.onPointer(element, startCallback, endCallback, {
        actions: action,
      });

      element.dispatchEvent(window.newClick());
      let nSCalls = action === "click" ? 1 : 0;
      let nECalls = 0;
      await window.waitFor(0); // call is async
      expect(startCallback).toHaveBeenCalledTimes(nSCalls);
      expect(endCallback).toHaveBeenCalledTimes(nECalls);

      element.dispatchEvent(window.newClick());
      nECalls += action === "click" ? 1 : 0;
      await window.waitFor(0); // call is async
      expect(startCallback).toHaveBeenCalledTimes(nSCalls);
      expect(endCallback).toHaveBeenCalledTimes(nECalls);

      element.dispatchEvent(window.newMouse("enter"));
      nSCalls += action === "hover" ? 1 : 0;
      await window.waitFor(0); // call is async
      expect(startCallback).toHaveBeenCalledTimes(nSCalls);
      expect(endCallback).toHaveBeenCalledTimes(nECalls);

      element.dispatchEvent(window.newMouse("leave"));
      nECalls += action === "hover" ? 1 : 0;
      await window.waitFor(0); // call is async
      expect(startCallback).toHaveBeenCalledTimes(nSCalls);
      expect(endCallback).toHaveBeenCalledTimes(nECalls);

      element.dispatchEvent(window.newMouse("down"));
      nSCalls += action === "press" ? 1 : 0;
      await window.waitFor(0); // call is async
      expect(startCallback).toHaveBeenCalledTimes(nSCalls);
      expect(endCallback).toHaveBeenCalledTimes(nECalls);

      element.dispatchEvent(window.newMouse("up"));
      nECalls += action === "press" ? 1 : 0;
      await window.waitFor(0); // call is async
      expect(startCallback).toHaveBeenCalledTimes(nSCalls);
      expect(endCallback).toHaveBeenCalledTimes(nECalls);
    });
  }
});

describe("preventDefault", () => {
  test("baseline", async () => {
    const { watcher, startCallback, endCallback, element } =
      newWatcherElement();

    watcher.onPointer(element, startCallback, endCallback, {
      preventDefault: false,
    });

    const eventC = window.newClick();
    element.dispatchEvent(eventC);
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(1);
    expect(endCallback).toHaveBeenCalledTimes(0);
    expect(eventC.defaultPrevented).toBe(false);

    const eventD = window.newMouse("down");
    element.dispatchEvent(eventD);
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(2);
    expect(endCallback).toHaveBeenCalledTimes(0);
    expect(eventD.defaultPrevented).toBe(false);

    const eventU = window.newMouse("up");
    element.dispatchEvent(eventU);
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(2);
    expect(endCallback).toHaveBeenCalledTimes(1);
    expect(eventU.defaultPrevented).toBe(false);

    const dummyC = window.newClick();
    dummyC.preventDefault();
    expect(dummyC.defaultPrevented).toBe(true);

    const dummyD = window.newMouse("down");
    dummyD.preventDefault();
    expect(dummyD.defaultPrevented).toBe(true);

    const dummyU = window.newMouse("up");
    dummyU.preventDefault();
    expect(dummyU.defaultPrevented).toBe(true);
  });

  test("preventDefault", async () => {
    const { watcher, startCallback, endCallback, element } =
      newWatcherElement();

    watcher.onPointer(element, startCallback, endCallback, {
      preventDefault: true,
    });

    const eventC = window.newClick();
    element.dispatchEvent(eventC);
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(1);
    expect(endCallback).toHaveBeenCalledTimes(0);
    expect(eventC.defaultPrevented).toBe(true);

    const eventD = window.newMouse("down");
    element.dispatchEvent(eventD);
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(2);
    expect(endCallback).toHaveBeenCalledTimes(0);
    expect(eventD.defaultPrevented).toBe(true);

    const eventU = window.newMouse("up");
    element.dispatchEvent(eventU);
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(2);
    expect(endCallback).toHaveBeenCalledTimes(1);
    expect(eventU.defaultPrevented).toBe(true);
  });
});

test("callback args", async () => {
  const { startCallback, endCallback, watcher, element } = newWatcherElement();
  await watcher.onPointer(element, startCallback, endCallback);

  // click and press intertwined
  const eventA = window.newClick();
  const eventB = window.newMouse("down");
  const eventC = window.newClick();
  const eventD = window.newMouse("up");
  const eventE = window.newMouse("enter");
  const eventF = window.newMouse("leave");
  element.dispatchEvent(eventA);
  element.dispatchEvent(eventB);
  element.dispatchEvent(eventC);
  element.dispatchEvent(eventD);
  // hover
  element.dispatchEvent(eventE);
  element.dispatchEvent(eventF);

  await window.waitFor(10);

  expect(startCallback).toHaveBeenCalledWith(
    element,
    {
      action: "click",
      state: "ON",
    },
    eventA,
  );

  expect(startCallback).toHaveBeenCalledWith(
    element,
    {
      action: "press",
      state: "ON",
    },
    eventB,
  );

  expect(endCallback).toHaveBeenCalledWith(
    element,
    {
      action: "click",
      state: "OFF",
    },
    eventC,
  );

  expect(endCallback).toHaveBeenCalledWith(
    element,
    {
      action: "press",
      state: "OFF",
    },
    eventD,
  );

  expect(startCallback).toHaveBeenCalledWith(
    element,
    {
      action: "hover",
      state: "ON",
    },
    eventE,
  );

  expect(endCallback).toHaveBeenCalledWith(
    element,
    {
      action: "hover",
      state: "OFF",
    },
    eventF,
  );
});

describe("cleanup on removal", () => {
  test("removing immediately", async () => {
    const { startCallback, endCallback, watcher, element } =
      newWatcherElement();

    watcher.onPointer(element, startCallback, endCallback, {
      actions: "click",
    });
    watcher.offPointer(element, startCallback, endCallback);

    await window.waitFor(10);
    expect(window.numEventListeners.get(element) || 0).toBe(0);
  });

  test("removing later", async () => {
    const { startCallback, endCallback, watcher, element } =
      newWatcherElement();
    const startCallbackB = jest.fn();
    const endCallbackB = jest.fn();

    await watcher.onPointer(element, startCallback, endCallback);
    await watcher.onPointer(element, startCallbackB, endCallbackB); // same watcher

    element.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(1);
    expect(endCallback).toHaveBeenCalledTimes(0);
    expect(startCallbackB).toHaveBeenCalledTimes(1);
    expect(endCallbackB).toHaveBeenCalledTimes(0);
    expect(window.numEventListeners.get(element) || 0).not.toBe(0);

    // remove callback B
    watcher.offPointer(element, startCallbackB, endCallbackB);

    element.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(1);
    expect(endCallback).toHaveBeenCalledTimes(1);
    expect(startCallbackB).toHaveBeenCalledTimes(1); // no new calls
    expect(endCallbackB).toHaveBeenCalledTimes(0); // no new calls
    expect(window.numEventListeners.get(element) || 0).not.toBe(0);

    // remove callback A
    watcher.offPointer(element, startCallback, endCallback);

    element.dispatchEvent(window.newClick());
    await window.waitFor(0); // call is async
    expect(startCallback).toHaveBeenCalledTimes(1); // no new calls
    expect(endCallback).toHaveBeenCalledTimes(1); // no new calls
    expect(startCallbackB).toHaveBeenCalledTimes(1); // no new calls
    expect(endCallbackB).toHaveBeenCalledTimes(0); // no new calls
    expect(window.numEventListeners.get(element) || 0).toBe(0);
  });
});

describe("isValidPointerAction", () => {
  for (const action of ACTIONS) {
    test(action, () => {
      expect(isValidPointerAction(action)).toBe(true);
    });
  }

  test("invalid", () => {
    expect(isValidPointerAction("")).toBe(false);
    expect(isValidPointerAction(" ")).toBe(false);
    expect(isValidPointerAction(" , ")).toBe(false);
    expect(isValidPointerAction("random")).toBe(false);
  });
});

describe("isValidPointerActionList", () => {
  for (const action of ACTIONS) {
    test(action, () => {
      expect(isValidPointerActionList(action)).toBe(true);
    });
  }

  test("multiple", () => {
    expect(isValidPointerActionList("click,hover")).toBe(true);
    expect(isValidPointerActionList(["click"], ["hover"])).toBe(true);
  });

  test("invalid", () => {
    expect(isValidPointerActionList([])).toBe(false);
    expect(isValidPointerActionList([""])).toBe(false);
    expect(isValidPointerActionList("")).toBe(false);
    expect(isValidPointerActionList(" ")).toBe(false);
    expect(isValidPointerActionList(" , ")).toBe(false);
    expect(isValidPointerActionList("random")).toBe(false);
  });
});
