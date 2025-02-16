const { beforeAll, jest, describe, test, expect } = require("@jest/globals");

const { Callback } = window.LISN.modules;
const { ScrollWatcher } = window.LISN.watchers;
const { fetchViewportOverlay } = window.LISN.utils;

let viewportOverlay;

window.LISN.settings.contentWrappingAllowed = true;

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

// This should behave exactly as the one with no content wrapping because
// content wrapping of document.body is ignored
describe("trackScroll", () => {
  test("custom handler + cleanup", async () => {
    const { watcher, element, callback } = newWatcherElement();
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    // The above will activate DOMWatcher and SizeWatcher, so wait before adding
    await window.waitForAF();

    const wrapper = Callback.wrap(callback);

    await watcher.trackScroll(wrapper, { scrollable: element });

    await window.waitFor(100);
    expect(callback).toHaveBeenCalledTimes(1); // initial call

    // scroll element
    element.scrollTo(1, 1);
    await window.waitFor(100);
    expect(callback).toHaveBeenCalledTimes(2);

    // resize element
    element.resize([100, 100]);
    await window.waitFor(100);
    expect(callback).toHaveBeenCalledTimes(3);

    // add children (resize content)
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    await window.waitFor(150);
    expect(callback).toHaveBeenCalledTimes(4);

    // remove
    wrapper.remove();
    element.scrollTo(10, 10);
    element.resize([500, 500]);
    element.append(document.createElement("div"));
    await window.waitFor(100);
    expect(callback).toHaveBeenCalledTimes(4); // no new calls
  });

  test("custom handler on window", async () => {
    const { watcher, callback } = newWatcherElement();
    document.body.append(document.createElement("div"));
    document.body.append(document.createElement("div"));
    document.documentElement.enableScroll();
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
});
