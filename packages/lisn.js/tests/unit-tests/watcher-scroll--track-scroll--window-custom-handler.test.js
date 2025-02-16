const { jest, beforeAll, test, expect } = require("@jest/globals");

const { ScrollWatcher } = window.LISN.watchers;
const { fetchViewportOverlay } = window.LISN.utils;

let viewportOverlay;

window.LISN.settings.contentWrappingAllowed = false;

document.documentElement.enableScroll();
beforeAll(async () => {
  viewportOverlay = await fetchViewportOverlay();
});

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

test("custom handler on window", async () => {
  const { watcher, callback } = newWatcherElement();
  document.body.append(document.createElement("div"));
  document.body.append(document.createElement("div"));
  // The above will activate DOMWatcher and SizeWatcher, so wait before adding
  await window.waitForAF();

  await watcher.trackScroll(callback);

  await window.waitFor(100);
  expect(callback).toHaveBeenCalledTimes(1); // initial call

  // scroll document
  document.documentElement.scrollTo(1, 1);
  await window.waitFor(100);
  expect(callback).toHaveBeenCalledTimes(2);

  // resize viewport
  document.documentElement.resize([100, 100]); // content
  await window.waitFor(100);
  expect(callback).toHaveBeenCalledTimes(3);

  viewportOverlay.resize([100, 100]); // viewport
  await window.waitFor(100);
  expect(callback).toHaveBeenCalledTimes(4);

  // add children (resize content)
  // TODO how to mock: our mock append to body won't resize documentElement
  // document.body.append(document.createElement("div"));
  // await window.waitFor(100);
  // expect(callback).toHaveBeenCalledTimes(5);
});
