const { jest, describe, beforeAll, test, expect } = require("@jest/globals");

const { roundNumTo, fetchViewportOverlay } = window.LISN.utils;
const { ViewWatcher } = window.LISN.watchers;

// TODO scrolling document and resizing "window" in other tests is
// interfering with predicting the relative position variable.
// How else to make these independent (while in the same test file)?

const VP_WIDTH = 400;
const VP_HEIGHT = 200;
document.documentElement.resize([800, 400], [VP_WIDTH, VP_HEIGHT]);
beforeAll(async () => {
  const viewportOverlay = await fetchViewportOverlay();
  viewportOverlay.resize([VP_WIDTH, VP_HEIGHT]);
  await window.waitFor(100);
});

// for convenience we don't use the default config, but set everything to 0
// unless explicitly given
const newWatcherElement = async (config = null) => {
  const callback = jest.fn();
  const element = document.createElement("div");
  const elementDummy = document.createElement("div");
  const dummyFn = () => {};

  document.body.append(element);

  const defaultConfig = {
    rootMargin: "0px",
  };
  config = {
    ...defaultConfig,
    ...(config || {}),
  };

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

describe("trackView", () => {
  test("adding", async () => {
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

    expect(
      Number.parseFloat(element.style.getPropertyValue("--lisn-js--r-top")),
    ).toBe(0);
    expect(element.style.getPropertyValue("--lisn-js--r-bottom")).toBe(
      roundNumTo(100 / VP_HEIGHT, 2) + "",
    );
    expect(
      Number.parseFloat(element.style.getPropertyValue("--lisn-js--r-left")),
    ).toBe(0);
    expect(element.style.getPropertyValue("--lisn-js--r-right")).toBe(
      roundNumTo(400 / VP_WIDTH, 2) + "",
    );
    expect(element.style.getPropertyValue("--lisn-js--r-width")).toBe(
      roundNumTo(400 / VP_WIDTH, 2) + "",
    );
    expect(element.style.getPropertyValue("--lisn-js--r-height")).toBe(
      roundNumTo(100 / VP_HEIGHT, 2) + "",
    );
    expect(element.style.getPropertyValue("--lisn-js--r-h-middle")).toBe(
      roundNumTo(200 / VP_WIDTH, 2) + "",
    );
    expect(element.style.getPropertyValue("--lisn-js--r-v-middle")).toBe(
      roundNumTo(50 / VP_HEIGHT, 2) + "",
    );

    await window.waitForVW();
    expect(mutationFn).toHaveBeenCalledTimes(1);
  });
});
