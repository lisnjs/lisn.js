const { jest, describe, beforeAll, test, expect } = require("@jest/globals");
// TODO test with incremental small changes to trackView?
// TODO test with custom root

const { fetchViewportOverlay, isValidView, isValidViewList, getOppositeViews } =
  window.LISN.utils;
const { Callback } = window.LISN.modules;
const { ViewWatcher } = window.LISN.watchers;

const VIEWS = ["at", "above", "below", "left", "right"];

let viewportOverlay;

// set non-0 size for window and document
const VP_WIDTH = 400;
const VP_HEIGHT = 200;
document.documentElement.resize([800, 400], [VP_WIDTH, VP_HEIGHT]);
beforeAll(async () => {
  viewportOverlay = await fetchViewportOverlay();
  viewportOverlay.resize([VP_WIDTH, VP_HEIGHT]);
  await window.waitFor(100);
});

document.documentElement.enableScroll();

const newWatcherElement = async (config = {}) => {
  const callback = jest.fn();
  const element = document.createElement("div");
  element.resize([400, 100]); // set default size

  const elementDummy = document.createElement("div");
  const dummyFn = () => {};

  document.body.append(element);
  const watcher = ViewWatcher.create(config);
  await watcher.onView(elementDummy, dummyFn);

  // Because the ViewWatcher will use a new plain IntersectionObserver to get
  // the initial view data for this element, there will at first be two
  // instances bound to this element. So wait a bit for the dummy one to be
  // disconnected.

  await window.waitFor(50);

  const observers = window.IntersectionObserver.instances.get(elementDummy);
  if (observers === undefined) {
    throw "Can't find this ViewWatcher's observer";
  } else if (observers.size > 1) {
    throw "Got multiple observers for this ViewWatcher";
  }

  const observer = Array.from(observers)[0];
  await watcher.offView(elementDummy, dummyFn);

  return { watcher, callback, element, observer };
};

test("baseline", () => {
  expect(window.LISN.utils.isScrollable(document.documentElement)).toBe(true);
});

test("illegal constructor", () => {
  expect(() => new ViewWatcher()).toThrow(/Illegal constructor/);
});

test("create reusable", () => {
  const defaultConfig = {
    root: null,
    rootMargin: "0px 0px 0px 0px",
    threshold: 0,
  };
  const watcherA = ViewWatcher.reuse();
  const watcherB = ViewWatcher.reuse(defaultConfig);
  const watcherC = ViewWatcher.reuse({
    ...defaultConfig,
    threshold: [0, 0.5],
  });
  const watcherD = ViewWatcher.reuse({
    ...defaultConfig,
    threshold: [0, 0.5],
  });

  expect(watcherA).toBeInstanceOf(ViewWatcher);
  expect(watcherA).toBe(watcherB);
  expect(watcherA).not.toBe(watcherC);

  expect(watcherC).toBeInstanceOf(ViewWatcher);
  expect(watcherC).toBe(watcherD);
});

describe("initial call", () => {
  test("all default: first and subsequent of type", async () => {
    const { watcher, callback, element } = await newWatcherElement();
    await watcher.onView(element, callback);

    await window.waitForVW();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0].length).toBe(4);
    expect(callback.mock.calls[0][0]).toBe(element);
    expect(callback.mock.calls[0][1].isIntersecting).toBe(true);
    expect(callback.mock.calls[0][2]).toBeUndefined();
    expect(callback.mock.calls[0][3]).toBe(watcher);

    const callbackB = jest.fn();
    await watcher.onView(element, callbackB);

    await window.waitForVW();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(1);
  });

  test("skipInitial: first and subsequent of type", async () => {
    const { watcher, callback, element, observer } = await newWatcherElement();
    const callbackB = jest.fn();

    await Promise.all([
      watcher.onView(element, callback, { skipInitial: true }),
      watcher.onView(element, callbackB, { skipInitial: true }),
    ]);

    await window.waitForVW();

    expect(callback).toHaveBeenCalledTimes(0); // skipped
    expect(callbackB).toHaveBeenCalledTimes(0); // skipped

    const callbackC = jest.fn();
    await watcher.onView(element, callbackC, { skipInitial: true });

    await window.waitForVW();
    expect(callback).toHaveBeenCalledTimes(0); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(0); // no new calls
    expect(callbackC).toHaveBeenCalledTimes(0); // skipped

    // trigger call; need to change something to result in a different data
    element.resize();
    observer.trigger(element);

    await window.waitForVW();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callbackB).toHaveBeenCalledTimes(1);
    expect(callbackC).toHaveBeenCalledTimes(1);

    const callbackD = jest.fn();
    await watcher.onView(element, callbackD, { skipInitial: true });

    await window.waitForVW();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackC).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackD).toHaveBeenCalledTimes(0); // skipped

    element.resize();
    observer.trigger(element);

    await window.waitForVW();
    expect(callback).toHaveBeenCalledTimes(2); // called again
    expect(callbackB).toHaveBeenCalledTimes(2);
    expect(callbackC).toHaveBeenCalledTimes(2);
    expect(callbackD).toHaveBeenCalledTimes(1);

    for (const cbk of [callback, callbackB, callbackC, callbackD]) {
      const c = cbk.mock.calls.length - 1;
      expect(cbk.mock.calls[c].length).toBe(4);
      expect(cbk.mock.calls[c][0]).toBe(element);
      if (c > 0) {
        // previous data equals the latest data from the previous call
        expect(cbk.mock.calls[c][2]).toEqual(cbk.mock.calls[c - 1][1]);
      }
      expect(cbk.mock.calls[c][3]).toBe(watcher);
    }
  });

  test("after there's been a matching 'view': first and subsequent of type", async () => {
    const { watcher, callback, element } = await newWatcherElement();

    await watcher.onView(element, callback, { views: "at" });

    await window.waitForVW();
    expect(callback).toHaveBeenCalledTimes(1);

    const callbackB = jest.fn();
    const callbackC = jest.fn();

    await Promise.all([
      watcher.onView(element, callbackB, { views: "at" }), // same observe type
      watcher.onView(element, callbackC, { views: "at, above" }), // diff. observe type
    ]);

    await window.waitForVW();

    expect(callbackB).toHaveBeenCalledTimes(1);
    expect(callbackC).toHaveBeenCalledTimes(1);
  });

  test("after there's been a non-matching 'view': first and subsequent of type", async () => {
    const { watcher, callback, element } = await newWatcherElement();

    await watcher.onView(element, callback, { views: "above" });

    await window.waitForVW();
    expect(callback).toHaveBeenCalledTimes(0);

    const callbackB = jest.fn();
    const callbackC = jest.fn();

    await Promise.all([
      watcher.onView(element, callbackB, { views: "above" }), // same observe type
      watcher.onView(element, callbackC, { views: "left, above" }), // diff. observe type
    ]);

    await window.waitForVW();

    expect(callbackB).toHaveBeenCalledTimes(0);
    expect(callbackC).toHaveBeenCalledTimes(0);
  });
});

test("duplicate handler", async () => {
  const { callback, watcher, element, observer } = await newWatcherElement();
  await Promise.all([
    watcher.onView(element, callback),
    watcher.onView(element, callback),
  ]);

  await window.waitForVW();
  expect(callback).toHaveBeenCalledTimes(1); // initial call of 2nd one

  await watcher.onView(element, callback);

  await window.waitForVW();
  expect(callback).toHaveBeenCalledTimes(2); // initial call

  element.resize();
  observer.trigger(element);

  await window.waitForVW();
  expect(callback).toHaveBeenCalledTimes(3);
});

describe("offView", () => {
  test("awaiting", async () => {
    const { watcher, callback, element, observer } = await newWatcherElement();

    await watcher.onView(element, callback);
    await watcher.offView(element, callback);

    await window.waitForVW();
    expect(callback).toHaveBeenCalledTimes(1); // initial call

    element.resize();
    observer.trigger(element);
    await window.waitForVW();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
  });

  test("immediate", async () => {
    const { watcher, callback, element, observer } = await newWatcherElement();

    watcher.onView(element, callback);
    watcher.offView(element, callback);

    await window.waitForVW();
    expect(callback).toHaveBeenCalledTimes(0);

    element.resize();
    observer.trigger(element);
    await window.waitForVW();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("with mismatching options", async () => {
    const { watcher, callback, element, observer } = await newWatcherElement();

    watcher.onView(element, callback, {
      views: ["at", "above", "below"],
    });
    watcher.offView(element, callback);

    await window.waitForVW();
    expect(callback).toHaveBeenCalledTimes(0);

    element.resize();
    observer.trigger(element);
    await window.waitForVW();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("immediate for subsequent of type and later for first of type", async () => {
    const { watcher, callback, element, observer } = await newWatcherElement();

    watcher.onView(element, callback);

    await window.waitFor(100);
    expect(callback).toHaveBeenCalledTimes(1);

    const callbackB = jest.fn();
    watcher.onView(element, callbackB);

    // remove both
    watcher.offView(element, callback);
    watcher.offView(element, callbackB);

    await window.waitForVW();

    expect(callback).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(0);

    element.resize();
    observer.trigger(element);
    await window.waitForVW();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(0); // no new calls
  });
});

describe("views", () => {
  test("invalid", async () => {
    const { callback, watcher, element } = await newWatcherElement();

    await expect(() =>
      watcher.onView(element, callback, {
        views: "invalid",
      }),
    ).rejects.toThrow(/Invalid value for 'views'/);

    await expect(() =>
      watcher.onView(element, callback, {
        views: ["invalid"],
      }),
    ).rejects.toThrow(/Invalid value for 'views'/);

    await expect(() =>
      watcher.onView(element, callback, {
        views: false,
      }),
    ).rejects.toThrow(/'views' must be a string or a string array/);
  });

  // don't start with "at" which is same as current initial
  for (const triggerView of VIEWS.reverse()) {
    test(`specific view: actual view is ${triggerView}`, async () => {
      const { watcher, callback, observer, element } =
        await newWatcherElement();
      await watcher.onView(element, callback, { skipInitial: true });

      const restrictedCallbacks = {};
      for (const filterView of VIEWS) {
        const thisCallback = jest.fn();
        await watcher.onView(element, thisCallback, {
          views: filterView,
          skipInitial: true,
        });
        restrictedCallbacks[filterView] = thisCallback;
      }

      // no initial call
      await window.waitForVW();
      expect(callback).toHaveBeenCalledTimes(0);
      for (const filterView in restrictedCallbacks) {
        expect(restrictedCallbacks[filterView]).toHaveBeenCalledTimes(0);
      }

      observer.trigger(element, [triggerView]);
      await window.waitForVW();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback.mock.calls[0][1].views).toEqual([triggerView]);
      for (const filterView in restrictedCallbacks) {
        expect(restrictedCallbacks[filterView]).toHaveBeenCalledTimes(
          filterView === triggerView ? 1 : 0,
        );
      }
    });

    test(`views: multiple (left,above): actual view is ${triggerView}`, async () => {
      const { watcher, callback, observer, element } =
        await newWatcherElement();
      await watcher.onView(element, callback, { skipInitial: true });

      const restrictedCallback = jest.fn();
      await watcher.onView(element, restrictedCallback, {
        views: ["left", "above"],
        skipInitial: true,
      });

      // no initial call
      await window.waitForVW();
      expect(callback).toHaveBeenCalledTimes(0);
      expect(restrictedCallback).toHaveBeenCalledTimes(0);

      observer.trigger(element, [triggerView]);
      await window.waitForVW();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback.mock.calls[0][1].views).toEqual([triggerView]);
      expect(restrictedCallback).toHaveBeenCalledTimes(
        triggerView === "left" || triggerView === "above" ? 1 : 0,
      );
    });
  }
});

describe("offset target", () => {
  test("invalid", async () => {
    const { watcher, callback } = await newWatcherElement();
    await expect(watcher.onView("foo: bar", callback)).rejects.toThrow(
      /Invalid offset/,
    );
  });

  for (const ref of ["top", "bottom", "left", "right"]) {
    test(`generic CSS offset: ${ref}`, async () => {
      const { watcher, callback, observer } = await newWatcherElement();
      const offset = "200px";
      await watcher.onView(`${ref}: ${offset}`, callback);

      // no initial call
      await window.waitForVW();
      expect(observer.targets.size).toBe(1);
      const overlay = Array.from(observer.targets)[0];
      expect(overlay.classList.contains("lisn-overlay")).toBe(true);
      expect(overlay.style.getPropertyValue("position")).toBe("absolute");
      expect(overlay.style.getPropertyValue(ref)).toBe(offset);
      expect(overlay.parentElement).toBe(document.body);
    });
  }
});

describe("cleanup on removal", () => {
  test("removing immediately", async () => {
    const { callback, watcher, element } = await newWatcherElement();

    expect(window.IntersectionObserver.instances.get(element)?.size || 0).toBe(
      0,
    );
    watcher.onView(element, callback);
    watcher.offView(element, callback);

    await window.waitFor(10);
    expect(window.IntersectionObserver.instances.get(element)?.size || 0).toBe(
      0,
    );
  });

  test("multiple callbacks, different observe type", async () => {
    const { callback, watcher, element, observer } = await newWatcherElement();
    const callbackB = jest.fn();

    expect(window.IntersectionObserver.instances.get(element)?.size || 0).toBe(
      0,
    );

    await watcher.onView(element, callback);
    await watcher.onView(element, callbackB); // same watcher

    await window.waitForVW();
    expect(window.IntersectionObserver.instances.get(element)?.size).toBe(1);
    expect(observer.targets.size).toBe(1);

    expect(callback).toHaveBeenCalledTimes(1); // initial call
    expect(callbackB).toHaveBeenCalledTimes(1); // initial call

    // remove callback B
    await watcher.offView(element, callbackB);

    expect(window.IntersectionObserver.instances.get(element)?.size).toBe(1);
    expect(observer.targets.size).toBe(1);

    // remove callback A
    await watcher.offView(element, callback);

    expect(window.IntersectionObserver.instances.get(element)?.size).toBe(0);
    expect(observer.targets.size).toBe(0); // should have been unobserved
  });

  test("multiple callbacks, different observe type", async () => {
    const { callback, watcher, element, observer } = await newWatcherElement();
    const callbackB = jest.fn();

    await watcher.onView(element, callback);
    await watcher.onView(element, callbackB, { views: "at, below, above" }); // same watcher

    await window.waitForVW();
    expect(window.IntersectionObserver.instances.get(element)?.size).toBe(1);
    expect(observer.targets.size).toBe(1);

    expect(callback).toHaveBeenCalledTimes(1); // initial call
    expect(callbackB).toHaveBeenCalledTimes(1); // initial call

    // remove callback B
    await watcher.offView(element, callbackB);

    expect(window.IntersectionObserver.instances.get(element)?.size).toBe(1);
    expect(observer.targets.size).toBe(1);

    // remove callback A
    await watcher.offView(element, callback);

    expect(window.IntersectionObserver.instances.get(element)?.size).toBe(0);
    expect(observer.targets.size).toBe(0); // should have been unobserved
  });
});

describe("trackView", () => {
  test("adding", async () => {
    const { watcher, element } = await newWatcherElement();

    element.resize([400, 100]);

    const mutationFn = jest.fn();
    const mo = new MutationObserver(mutationFn);
    mo.observe(element, {
      attributes: true,
    });

    watcher.noTrackView(element); // no-op
    watcher.trackView(element);
    watcher.trackView(element); // no-op
    await watcher.trackView(element); // no-op

    await window.waitForVW();
    await window.waitForAF();

    expect(element.style.getPropertyValue("--lisn-js--r-top")).toBeTruthy();
    expect(element.style.getPropertyValue("--lisn-js--r-bottom")).toBeTruthy();
    expect(element.style.getPropertyValue("--lisn-js--r-left")).toBeTruthy();
    expect(element.style.getPropertyValue("--lisn-js--r-right")).toBeTruthy();
    expect(element.style.getPropertyValue("--lisn-js--r-width")).toBeTruthy();
    expect(element.style.getPropertyValue("--lisn-js--r-height")).toBeTruthy();
    expect(
      element.style.getPropertyValue("--lisn-js--r-h-middle"),
    ).toBeTruthy();
    expect(
      element.style.getPropertyValue("--lisn-js--r-v-middle"),
    ).toBeTruthy();

    await window.waitForVW();
    expect(mutationFn).toHaveBeenCalledTimes(1);
  });

  test("custom handler + cleanup", async () => {
    const { watcher, element, callback } = await newWatcherElement();

    const wrapper = Callback.wrap(callback);
    await watcher.trackView(element, wrapper);

    await window.waitForVW();
    expect(callback).toHaveBeenCalledTimes(1); // initial call

    // resize element
    element.resize([200, 200]);
    await window.waitFor(150);
    expect(callback).toHaveBeenCalledTimes(2);

    // resize viewport
    document.documentElement.resize([800, 400], [2 * VP_WIDTH, 2 * VP_HEIGHT]);
    viewportOverlay.resize([2 * VP_WIDTH, 2 * VP_HEIGHT]);
    await window.waitFor(150);
    expect(callback).toHaveBeenCalledTimes(3);

    // scroll document
    document.documentElement.scrollTo(0, 500);
    await window.waitFor(150);
    expect(callback).toHaveBeenCalledTimes(4);

    // change style
    element.offsetWidth *= 2;
    element.clientWidth *= 2;
    element.offsetHeight *= 2;
    element.clientHeight *= 2;
    element.style.setProperty("transform", "scale(2)");

    await window.waitFor(150);
    expect(callback).toHaveBeenCalledTimes(5);

    // remove
    wrapper.remove();
    element.resize([300, 300]);
    document.documentElement.resize([800, 400], [3 * VP_WIDTH, 3 * VP_HEIGHT]);
    viewportOverlay.resize([3 * VP_WIDTH, 3 * VP_HEIGHT]);
    document.documentElement.scrollTo(0, 300);
    element.style.setProperty("transform", "scale(1)");
    await window.waitFor(100);
    expect(callback).toHaveBeenCalledTimes(5); // no new calls
  });

  test("custom handler: with same handler as onView", async () => {
    const { watcher, element, callback, observer } = await newWatcherElement();

    await Promise.all([
      watcher.onView(element, callback),
      watcher.trackView(element, callback),
      watcher.trackView(element, callback), // no-op
    ]);

    await window.waitFor(150);
    expect(callback).toHaveBeenCalledTimes(1); // initial call of 3rd

    await watcher.trackView(element, callback); // no-op

    await window.waitFor(150);
    expect(callback).toHaveBeenCalledTimes(2); // initial call

    element.resize();
    observer.trigger(element);

    await window.waitForVW();
    expect(callback).toHaveBeenCalledTimes(3);
  });

  test("removing", async () => {
    const { watcher, element } = await newWatcherElement();

    element.resize([400, 100]);

    const mutationFn = jest.fn();
    const mo = new MutationObserver(mutationFn);
    mo.observe(element, {
      attributes: true,
    });

    await Promise.all([
      watcher.noTrackView(element), // no-op
      watcher.trackView(element),
      watcher.trackView(element), // no-op
      watcher.trackView(element), // no-op
    ]);

    await window.waitForVW();
    await window.waitForAF();

    expect(element.style.getPropertyValue("--lisn-js--r-top")).toBeTruthy();
    expect(element.style.getPropertyValue("--lisn-js--r-bottom")).toBeTruthy();
    expect(element.style.getPropertyValue("--lisn-js--r-left")).toBeTruthy();
    expect(element.style.getPropertyValue("--lisn-js--r-right")).toBeTruthy();
    expect(element.style.getPropertyValue("--lisn-js--r-width")).toBeTruthy();
    expect(element.style.getPropertyValue("--lisn-js--r-height")).toBeTruthy();
    expect(
      element.style.getPropertyValue("--lisn-js--r-h-middle"),
    ).toBeTruthy();
    expect(
      element.style.getPropertyValue("--lisn-js--r-v-middle"),
    ).toBeTruthy();

    await window.waitForVW();
    expect(mutationFn).toHaveBeenCalledTimes(1);

    await watcher.noTrackView(element);
    await window.waitForAF();

    expect(element.style.getPropertyValue("--lisn-js--r-top")).toBe("");
    expect(element.style.getPropertyValue("--lisn-js--r-bottom")).toBe("");
    expect(element.style.getPropertyValue("--lisn-js--r-left")).toBe("");
    expect(element.style.getPropertyValue("--lisn-js--r-right")).toBe("");
    expect(element.style.getPropertyValue("--lisn-js--r-width")).toBe("");
    expect(element.style.getPropertyValue("--lisn-js--r-height")).toBe("");
    expect(element.style.getPropertyValue("--lisn-js--r-h-middle")).toBe("");
    expect(element.style.getPropertyValue("--lisn-js--r-v-middle")).toBe("");

    await window.waitForVW();
    expect(mutationFn).toHaveBeenCalledTimes(2);
  });
});

describe("isValidView", () => {
  for (const view of VIEWS) {
    test(view, () => {
      expect(isValidView(view)).toBe(true);
    });
  }

  test("invalid", () => {
    expect(isValidView("at,above")).toBe(false);
    expect(isValidView("")).toBe(false);
    expect(isValidView(" ")).toBe(false);
    expect(isValidView(" , ")).toBe(false);
    expect(isValidView("random")).toBe(false);
  });
});

describe("isValidViewList", () => {
  for (const view of VIEWS) {
    test(view, () => {
      expect(isValidViewList(view)).toBe(true);
    });
  }

  test("multiple", () => {
    expect(isValidViewList("at,above")).toBe(true);
    expect(isValidViewList(["at"], ["above"])).toBe(true);
  });

  test("invalid", () => {
    expect(isValidViewList([])).toBe(false);
    expect(isValidViewList([""])).toBe(false);
    expect(isValidViewList("")).toBe(false);
    expect(isValidViewList(" ")).toBe(false);
    expect(isValidViewList(" , ")).toBe(false);
    expect(isValidViewList("random")).toBe(false);
  });
});

describe("getOppositeViews", () => {
  test("valid: single one", () => {
    expect(getOppositeViews("above").sort()).toEqual(["at", "below"].sort());
    expect(getOppositeViews("below").sort()).toEqual(["at", "above"].sort());
    expect(getOppositeViews("left").sort()).toEqual(["at", "right"].sort());
    expect(getOppositeViews("right").sort()).toEqual(["at", "left"].sort());
    expect(getOppositeViews("at").sort()).toEqual(
      ["above", "below", "left", "right"].sort(),
    );
  });

  test("valid: muliple ones", () => {
    expect(getOppositeViews("at,above").sort()).toEqual(["below"].sort());
    expect(getOppositeViews("at,below").sort()).toEqual(["above"].sort());
    expect(getOppositeViews("at,left").sort()).toEqual(["right"].sort());
    expect(getOppositeViews("at,right").sort()).toEqual(["left"].sort());

    expect(getOppositeViews("above,right").sort()).toEqual(
      ["at", "below", "left"].sort(),
    );
    expect(getOppositeViews("at,above,right").sort()).toEqual(
      ["below", "left"].sort(),
    );

    expect(getOppositeViews("above,below,right").sort()).toEqual(
      ["at", "left"].sort(),
    );
    expect(getOppositeViews("at,above,below,right")).toEqual(["left"]);

    expect(getOppositeViews("above,below")).toEqual(["at"]);
    expect(getOppositeViews("at,above,below")).toEqual([]);

    expect(getOppositeViews("left,right")).toEqual(["at"]);
    expect(getOppositeViews("at,left,right")).toEqual([]);
  });

  test("using array", () => {
    expect(getOppositeViews(["left", "right"])).toEqual(["at"]);
  });

  test("invalid", () => {
    expect(() => getOppositeViews("")).toThrow(/'views' cannot be empty/);
    expect(() => getOppositeViews("random")).toThrow(
      /Invalid value for 'views'/,
    );
  });
});
