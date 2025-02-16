const { beforeAll, jest, describe, test, expect } = require("@jest/globals");
require("./supplementary/settings--main-content-element");

const { ScrollWatcher } = window.LISN.watchers;

window.LISN.settings.contentWrappingAllowed = true;

window.MAIN_CONTENT_ELEMENT.enableScroll();

beforeAll(async () => {
  // await for it to setup the scroll tracking
  await null;
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

describe("trackScroll", () => {
  test("custom handler on window", async () => {
    const { watcher, callback } = newWatcherElement();
    window.MAIN_CONTENT_ELEMENT.append(document.createElement("div"));
    window.MAIN_CONTENT_ELEMENT.append(document.createElement("div"));
    // The above will activate DOMWatcher and SizeWatcher, so wait before adding
    await window.waitForAF();

    await watcher.trackScroll(callback);

    await window.waitFor(100);
    expect(callback).toHaveBeenCalledTimes(1); // initial call

    // scroll element
    window.MAIN_CONTENT_ELEMENT.scrollTo(1, 1);
    await window.waitFor(100);
    expect(callback).toHaveBeenCalledTimes(2);

    // resize element
    window.MAIN_CONTENT_ELEMENT.resize([100, 100]);
    await window.waitFor(100);
    expect(callback).toHaveBeenCalledTimes(3);

    // add children (resize content)
    window.MAIN_CONTENT_ELEMENT.append(document.createElement("div"));
    window.MAIN_CONTENT_ELEMENT.append(document.createElement("div"));
    await window.waitFor(200);
    expect(callback).toHaveBeenCalledTimes(4);
  });
});
