const { describe, test, expect } = require("@jest/globals");

const utils = window.LISN.utils;
window.LISN.settings.effectLag = 0;

// one rAF for measure time and one to run first step of initiateScroll
const minStartDelay = 20;

const diffTolerance = 100; // in milliseconds

const roundDiff = (x, y) => {
  return Math.floor(Math.abs(x - y));
};

document.documentElement.enableScroll();

const newScrollingElement = () => {
  const element = document.createElement("div");
  element.enableScroll();
  return element;
};

describe("scrollTo: basic (using number coordinates)", () => {
  test("no options + getCurrentScrollAction", async () => {
    const action = utils.scrollTo({
      top: 100,
      left: 50,
    });

    expect(utils.getCurrentScrollAction(document.documentElement)).not.toBe(
      action,
    );
    expect(utils.getCurrentScrollAction(document.documentElement)).toEqual(
      action,
    );
    expect(utils.getCurrentScrollAction()).not.toBe(action);
    expect(utils.getCurrentScrollAction()).toEqual(action);

    expect(utils.getCurrentScrollAction(document.body)).toBe(null);

    const startTime = Date.now() + minStartDelay;
    await expect(action.waitFor()).resolves.toEqual({ top: 100, left: 50 });
    expect(document.documentElement.scrollTop).toBe(100);
    expect(document.documentElement.scrollLeft).toBe(50);

    expect(utils.getCurrentScrollAction(document.documentElement)).toBe(null);
    expect(utils.getCurrentScrollAction()).toBe(null);
    const endTime = Date.now();
    expect(roundDiff(endTime, startTime)).toBeLessThan(diffTolerance);
  });

  test("custom scrolling element + getCurrentScrollAction", async () => {
    const element = newScrollingElement();
    const action = utils.scrollTo(
      {
        top: 100,
        left: 50,
      },
      { scrollable: element },
    );

    expect(utils.getCurrentScrollAction(element)).not.toBe(action);
    expect(utils.getCurrentScrollAction(element)).toEqual(action);

    const startTime = Date.now() + minStartDelay;
    await expect(action.waitFor()).resolves.toEqual({ top: 100, left: 50 });
    expect(element.scrollTop).toBe(100);
    expect(element.scrollLeft).toBe(50);

    expect(utils.getCurrentScrollAction(element)).toBe(null);
    const endTime = Date.now();
    expect(roundDiff(endTime, startTime)).toBeLessThan(diffTolerance);
  });

  test("single coordinate + non-0 starting position: top", async () => {
    const element = newScrollingElement();
    element.scrollTo(50, 50);
    const action = utils.scrollTo(
      {
        top: 100,
      },
      { scrollable: element },
    );
    await expect(action.waitFor()).resolves.toEqual({ top: 100, left: 50 });
    expect(element.scrollTop).toBe(100);
    expect(element.scrollLeft).toBe(50);
  });

  test("single coordinate + non-0 starting position: left", async () => {
    const element = newScrollingElement();
    element.scrollTo(50, 50);
    const action = utils.scrollTo(
      {
        left: 100,
      },
      { scrollable: element },
    );
    await expect(action.waitFor()).resolves.toEqual({ left: 100, top: 50 });
    expect(element.scrollTop).toBe(50);
    expect(element.scrollLeft).toBe(100);
  });

  test("duration", async () => {
    const element = newScrollingElement();
    const action = utils.scrollTo(
      { top: 100, left: 50 },
      { duration: 200, scrollable: element },
    );
    const startTime = Date.now() + minStartDelay;
    await expect(action.waitFor()).resolves.toEqual({ top: 100, left: 50 });
    expect(element.scrollTop).toBe(100);
    expect(element.scrollLeft).toBe(50);

    const endTime = Date.now();
    expect(roundDiff(endTime, startTime + 200)).toBeLessThan(diffTolerance);
  });
});

describe("different types of target coordinate", () => {
  test("numbers", async () => {
    const element = newScrollingElement();
    element.scrollTo(50, 60);
    const action = utils.scrollTo(
      {
        top: 100,
        left: 50,
      },
      { scrollable: element },
    );
    await expect(action.waitFor()).resolves.toEqual({ top: 100, left: 50 });
    expect(element.scrollTop).toBe(100);
    expect(element.scrollLeft).toBe(50);
  });

  test("functions", async () => {
    const element = newScrollingElement();
    element.scrollTo(50, 60);
    const action = utils.scrollTo(
      {
        top: (e) => e.scrollTop + 100,
        left: (e) => e.scrollLeft + 50,
      },
      { scrollable: element },
    );
    await expect(action.waitFor()).resolves.toEqual({ top: 160, left: 100 });
    expect(element.scrollTop).toBe(160);
    expect(element.scrollLeft).toBe(100);
  });

  test("element", async () => {
    const targetElement = document.createElement("div");
    targetElement.getBoundingClientRect = () => {
      return {
        top: 100,
        left: 50,
      };
    };

    const element = newScrollingElement();
    element.getBoundingClientRect = () => {
      return {
        top: 10,
        left: 0,
      };
    }; // diff to target is +50, +90

    element.append(targetElement);

    element.scrollTo(50, 60); // starting position

    const action = utils.scrollTo(targetElement, {
      scrollable: element,
    });
    await expect(action.waitFor()).resolves.toEqual({ top: 150, left: 100 });
    expect(element.scrollTop).toBe(150);
    expect(element.scrollLeft).toBe(100);
  });

  test("selector", async () => {
    const targetElement = document.createElement("div");
    targetElement.getBoundingClientRect = () => {
      return {
        top: 100,
        left: 50,
      };
    };
    targetElement.id = "target";

    const element = newScrollingElement();
    element.getBoundingClientRect = () => {
      return {
        top: 10,
        left: 0,
      };
    }; // diff to target is +50, +90

    element.append(targetElement);
    document.body.append(element);

    element.scrollTo(50, 60); // starting position

    const action = utils.scrollTo("#target", {
      scrollable: element,
    });
    await expect(action.waitFor()).resolves.toEqual({ top: 150, left: 100 });
    expect(element.scrollTop).toBe(150);
    expect(element.scrollLeft).toBe(100);
  });

  test("element, not descending => error", async () => {
    const targetElement = document.createElement("div");
    const element = newScrollingElement();
    expect(() =>
      utils.scrollTo(targetElement, { scrollable: element }),
    ).toThrow(/Target must be a descendant of the scrollable one/);
    expect(() => utils.scrollTo(targetElement)).toThrow(
      /Target must be a descendant of the scrollable one/,
    );
  });

  test("outside limits: positive v1", async () => {
    const element = newScrollingElement();
    const maxTop = element.scrollHeight - element.clientHeight;
    const maxLeft = element.scrollWidth - element.clientWidth;
    expect(maxTop).toBeGreaterThan(0);
    expect(maxLeft).toBeGreaterThan(0);

    const action = utils.scrollTo(
      {
        top: maxTop * 10,
        left: maxLeft * 10,
      },
      { scrollable: element },
    );

    await expect(action.waitFor()).resolves.toEqual({
      top: maxTop,
      left: maxLeft,
    });
    expect(element.scrollTop).toBe(maxTop);
    expect(element.scrollLeft).toBe(maxLeft);
  });

  test("outside limits: positive v2", async () => {
    const element = newScrollingElement();
    const maxTop = element.scrollHeight - element.clientHeight;
    const maxLeft = element.scrollWidth - element.clientWidth;
    expect(maxTop).toBeGreaterThan(0);
    expect(maxLeft).toBeGreaterThan(0);

    const action = utils.scrollTo(
      {
        top: maxTop + 10,
        left: maxLeft + 10,
      },
      { scrollable: element },
    );

    await expect(action.waitFor()).resolves.toEqual({
      top: maxTop,
      left: maxLeft,
    });
    expect(element.scrollTop).toBe(maxTop);
    expect(element.scrollLeft).toBe(maxLeft);
  });

  test("outside limits: negative", async () => {
    const element = newScrollingElement();
    element.scrollTo(100, 100);

    const action = utils.scrollTo(
      {
        top: -10,
        left: -10,
      },
      { scrollable: element },
    );

    await expect(action.waitFor()).resolves.toEqual({
      top: 0,
      left: 0,
    });
    expect(element.scrollTop).toBe(0);
    expect(element.scrollLeft).toBe(0);
  });

  test("selector, non-existent => error", async () => {
    expect(() => utils.scrollTo("#nonexistent")).toThrow(/No match/);
  });

  test("invalid type", async () => {
    expect(() => utils.scrollTo([0, 1])).toThrow(/Invalid coordinates/);
  });
});

describe("scrollTo: weCanInterrupt", () => {
  test("cancel: weCanInterrupt false", async () => {
    const element = newScrollingElement();
    const action = utils.scrollTo(
      { top: 100, left: 50 },
      { scrollable: element, duration: 200 },
    );
    const startTime = Date.now() + minStartDelay;
    action.cancel();
    await expect(action.waitFor()).resolves.toEqual({ top: 100, left: 50 });
    expect(element.scrollTop).toBe(100);
    expect(element.scrollLeft).toBe(50);

    const endTime = Date.now();
    expect(roundDiff(endTime, startTime + 200)).toBeLessThan(diffTolerance);
  });

  test("cancel: weCanInterrupt true + getCurrentScrollAction", async () => {
    const element = newScrollingElement();
    const action = utils.scrollTo(
      { top: 100, left: 50 },
      { scrollable: element, duration: 1000, weCanInterrupt: true },
    );
    expect(utils.getCurrentScrollAction(element)).toEqual(action);
    const startTime = Date.now() + minStartDelay;
    action.cancel();
    await expect(action.waitFor()).rejects.toEqual({ top: 0, left: 0 });
    expect(element.scrollTop).toBe(0);
    expect(element.scrollLeft).toBe(0);

    expect(utils.getCurrentScrollAction(element)).toBe(null);
    const endTime = Date.now();
    expect(roundDiff(endTime, startTime)).toBeLessThan(diffTolerance);
  });

  test("cancel later: weCanInterrupt true", async () => {
    const element = newScrollingElement();
    const action = utils.scrollTo(
      { top: 1000, left: 500 },
      { scrollable: element, duration: 1000, weCanInterrupt: true },
    );
    const startTime = Date.now() + minStartDelay;
    window.setTimeout(action.cancel, 50 + minStartDelay);

    let endCoords = {};
    await action.waitFor().catch((c) => {
      endCoords = c;
    });
    const endTime = Date.now();
    await expect(action.waitFor()).rejects.toBeTruthy();
    // cancelled in 50ms
    expect(endCoords.top).toBeLessThan(1000 * (50 / 1000));
    expect(endCoords.left).toBeLessThan(500 * (50 / 1000));
    expect(roundDiff(endTime, startTime + 50)).toBeLessThan(diffTolerance);
  });
});

describe("scrollTo: userCanInterrupt", () => {
  test("scroll gesture: userCanInterrupt false", async () => {
    const element = newScrollingElement();
    const action = utils.scrollTo(
      { top: 100, left: 50 },
      { scrollable: element, duration: 200 },
    );
    const startTime = Date.now() + minStartDelay;
    element.dispatchEvent(new WheelEvent("wheel", { deltaX: 100 }));
    await expect(action.waitFor()).resolves.toEqual({ top: 100, left: 50 });
    expect(element.scrollTop).toBe(100);
    expect(element.scrollLeft).toBe(50);

    const endTime = Date.now();
    expect(roundDiff(endTime, startTime + 200)).toBeLessThan(diffTolerance);
  });

  test("scroll gesture: userCanInterrupt true + getCurrentScrollAction", async () => {
    const element = newScrollingElement();
    const action = utils.scrollTo(
      { top: 100, left: 50 },
      { scrollable: element, duration: 1000, userCanInterrupt: true },
    );
    expect(utils.getCurrentScrollAction(element)).toEqual(action);
    const startTime = Date.now() + minStartDelay;
    element.dispatchEvent(new WheelEvent("wheel", { deltaX: 100 }));
    await expect(action.waitFor()).rejects.toEqual({ top: 0, left: 0 });
    expect(element.scrollTop).toBe(0);
    expect(element.scrollLeft).toBe(0);

    expect(utils.getCurrentScrollAction(element)).toBe(null);
    const endTime = Date.now();
    expect(roundDiff(endTime, startTime)).toBeLessThan(diffTolerance);
  });

  test("scroll gesture later: userCanInterrupt true", async () => {
    const element = newScrollingElement();
    const action = utils.scrollTo(
      { top: 100, left: 50 },
      { scrollable: element, duration: 1000, userCanInterrupt: true },
    );
    const startTime = Date.now() + minStartDelay;
    window.setTimeout(
      () => element.dispatchEvent(new WheelEvent("wheel", { deltaX: 100 })),
      50 + minStartDelay,
    );

    let endCoords = {};
    await action.waitFor().catch((c) => {
      endCoords = c;
    });
    const endTime = Date.now();
    await expect(action.waitFor()).rejects.toBeTruthy();
    expect(roundDiff(endCoords.top, 100 * (50 / 1000))).toBeLessThan(
      diffTolerance,
    );
    expect(roundDiff(endCoords.left, 50 * (50 / 1000))).toBeLessThan(
      diffTolerance,
    );
    expect(roundDiff(endTime, startTime + 50)).toBeLessThan(diffTolerance);
  });
});

describe("scrollTo before previous one finishes", () => {
  test("interruptable", async () => {
    const element = newScrollingElement();
    const action = utils.scrollTo(
      { top: 100, left: 50 },
      { scrollable: element, duration: 1000, weCanInterrupt: true },
    );

    const action2 = utils.scrollTo(
      { top: 10, left: 20 },
      { scrollable: element, duration: 200 },
    );

    const startTime = Date.now() + minStartDelay;
    await expect(action.waitFor()).rejects.toEqual({ top: 0, left: 0 });
    await expect(action2.waitFor()).resolves.toEqual({ top: 10, left: 20 });
    const endTime = Date.now();
    expect(element.scrollTop).toBe(10);
    expect(element.scrollLeft).toBe(20);
    expect(roundDiff(endTime, startTime + 200)).toBeLessThan(diffTolerance);
  });

  test("non-interruptable", async () => {
    const element = newScrollingElement();
    const action = utils.scrollTo(
      { top: 100, left: 50 },
      { scrollable: element, duration: 200 },
    );

    const action2 = utils.scrollTo(
      { top: 10, left: 20 },
      { scrollable: element, duration: 1000 },
    );
    expect(action2).toBe(null);

    const startTime = Date.now() + minStartDelay;
    await expect(action.waitFor()).resolves.toEqual({ top: 100, left: 50 });
    const endTime = Date.now();
    expect(element.scrollTop).toBe(100);
    expect(element.scrollLeft).toBe(50);
    expect(roundDiff(endTime, startTime + 200)).toBeLessThan(diffTolerance);
  });
});

test("scrollTo: already at target, no altTarget", async () => {
  const element = newScrollingElement();
  element.scrollTo(49.6, 49.6);
  const action = utils.scrollTo(
    {
      top: 50,
      left: 50,
    },
    { duration: 1000, scrollable: element },
  );

  const startTime = Date.now() + minStartDelay;
  await expect(action.waitFor()).resolves.toEqual({ top: 50, left: 50 });
  expect(element.scrollTop).toBe(50);
  expect(element.scrollLeft).toBe(50);

  const endTime = Date.now();
  expect(roundDiff(endTime, startTime)).toBeLessThan(diffTolerance);
});

test("scrollTo: altTarget", async () => {
  const element = newScrollingElement();
  element.scrollTo(48, 49);
  const action = utils.scrollTo(
    {
      top: 50,
      left: 50,
    },
    {
      duration: 200,
      scrollable: element,
      altTarget: {
        top: 150,
        left: 150,
      },
    },
  );

  const startTime = Date.now() + minStartDelay;
  await expect(action.waitFor()).resolves.toEqual({ top: 150, left: 150 });
  expect(element.scrollTop).toBe(150);
  expect(element.scrollLeft).toBe(150);

  const endTime = Date.now();
  expect(roundDiff(endTime, startTime + 200)).toBeLessThan(diffTolerance);
});

describe("scrollTo: offset", () => {
  test("basic", async () => {
    const element = newScrollingElement();
    const action = utils.scrollTo(
      {
        top: 100,
        left: 40,
      },
      {
        scrollable: element,
        offset: { top: -50, left: 10 },
      },
    );

    await expect(action.waitFor()).resolves.toEqual({ top: 50, left: 50 });
    expect(element.scrollTop).toBe(50);
    expect(element.scrollLeft).toBe(50);
  });

  test("+ altTarget", async () => {
    const element = newScrollingElement();
    element.scrollTo(48, 49);
    const action = utils.scrollTo(
      {
        top: 0,
        left: 70,
      },
      {
        offset: { top: 50, left: -20 },
        altOffset: { top: -50, left: 10 },
        scrollable: element,
        altTarget: {
          top: 200,
          left: 140,
        },
      },
    );

    await expect(action.waitFor()).resolves.toEqual({ top: 150, left: 150 });
    expect(element.scrollTop).toBe(150);
    expect(element.scrollLeft).toBe(150);
  });

  test("+ altTarget and no offset", async () => {
    const element = newScrollingElement();
    element.scrollTo(48, 49);
    const action = utils.scrollTo(
      {
        top: 50,
        left: 50,
      },
      {
        altOffset: { top: -50, left: 10 },
        scrollable: element,
        altTarget: {
          top: 200,
          left: 140,
        },
      },
    );

    await expect(action.waitFor()).resolves.toEqual({ top: 150, left: 150 });
    expect(element.scrollTop).toBe(150);
    expect(element.scrollLeft).toBe(150);
  });

  test("+ altTarget and no altOffset", async () => {
    const element = newScrollingElement();
    element.scrollTo(48, 49);
    const action = utils.scrollTo(
      {
        top: 100,
        left: 40,
      },
      {
        offset: { top: -50, left: 10 },
        scrollable: element,
        altTarget: {
          top: 150,
          left: 150,
        },
      },
    );

    await expect(action.waitFor()).resolves.toEqual({ top: 150, left: 150 });
    expect(element.scrollTop).toBe(150);
    expect(element.scrollLeft).toBe(150);
  });
});

test("isScrollable", () => {
  const element = document.createElement("div");

  expect(utils.isScrollable(element, { noCache: true })).toBe(false);
  expect(utils.isScrollable(element, { active: true, noCache: true })).toBe(
    false,
  );
  expect(element.scrollTop).toBe(0);
  expect(element.scrollLeft).toBe(0);

  element.resize();
  expect(utils.isScrollable(element, { noCache: true })).toBe(false);
  expect(utils.isScrollable(element, { active: true, noCache: true })).toBe(
    false,
  );
  expect(element.scrollTop).toBe(0);
  expect(element.scrollLeft).toBe(0);

  // ----------
  element.enableScroll();

  element.style.overflow = "visible";
  expect(utils.isScrollable(element, { noCache: true })).toBe(false);
  element.style.overflow = "hidden";
  expect(utils.isScrollable(element, { noCache: true })).toBe(false);
  element.style.overflow = "scroll";
  expect(utils.isScrollable(element, { noCache: true })).toBe(true);
  element.style.overflow = "auto";
  expect(utils.isScrollable(element, { axis: "x", noCache: true })).toBe(true);
  expect(utils.isScrollable(element, { axis: "y", noCache: true })).toBe(true);
  expect(utils.isScrollable(element, { noCache: true })).toBe(true);

  expect(utils.isScrollable(element, { active: true, noCache: true })).toBe(
    true,
  );
  expect(
    utils.isScrollable(element, { active: true, axis: "x", noCache: true }),
  ).toBe(true);
  expect(
    utils.isScrollable(element, { active: true, axis: "y", noCache: true }),
  ).toBe(true);

  expect(element.scrollTop).toBe(0);
  expect(element.scrollLeft).toBe(0);

  // ----------
  element.scrollTo(10, 0);

  expect(utils.isScrollable(element, { noCache: true })).toBe(true);
  expect(utils.isScrollable(element, { axis: "x", noCache: true })).toBe(true);
  expect(utils.isScrollable(element, { axis: "y", noCache: true })).toBe(true);

  expect(utils.isScrollable(element, { active: true, noCache: true })).toBe(
    true,
  );
  expect(
    utils.isScrollable(element, { active: true, axis: "x", noCache: true }),
  ).toBe(true);
  expect(
    utils.isScrollable(element, { active: true, axis: "y", noCache: true }),
  ).toBe(true);

  expect(element.scrollTop).toBe(0);
  expect(element.scrollLeft).toBe(10);

  // ----------
  element.scrollTo(0, 10);

  expect(utils.isScrollable(element, { noCache: true })).toBe(true);
  expect(utils.isScrollable(element, { axis: "x", noCache: true })).toBe(true);
  expect(utils.isScrollable(element, { axis: "y", noCache: true })).toBe(true);

  expect(utils.isScrollable(element, { active: true, noCache: true })).toBe(
    true,
  );
  expect(
    utils.isScrollable(element, { active: true, axis: "x", noCache: true }),
  ).toBe(true);
  expect(
    utils.isScrollable(element, { active: true, axis: "y", noCache: true }),
  ).toBe(true);

  expect(element.scrollTop).toBe(10);
  expect(element.scrollLeft).toBe(0);

  // ----------
  element.scrollTo(10, 10);

  expect(utils.isScrollable(element, { axis: "x", noCache: true })).toBe(true);
  expect(utils.isScrollable(element, { axis: "y", noCache: true })).toBe(true);
  expect(utils.isScrollable(element, { noCache: true })).toBe(true);

  expect(utils.isScrollable(element, { active: true, noCache: true })).toBe(
    true,
  );
  expect(
    utils.isScrollable(element, { active: true, axis: "x", noCache: true }),
  ).toBe(true);
  expect(
    utils.isScrollable(element, { active: true, axis: "y", noCache: true }),
  ).toBe(true);

  expect(element.scrollTop).toBe(10);
  expect(element.scrollLeft).toBe(10);
});
