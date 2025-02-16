const { jest, test, expect } = require("@jest/globals");
require("./supplementary/settings--main-content-element");

const { roundNumTo } = window.LISN.utils;
const { ScrollWatcher } = window.LISN.watchers;

window.LISN.settings.contentWrappingAllowed = false;

window.MAIN_CONTENT_ELEMENT.enableScroll();

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

test("on window", async () => {
  const { watcher } = newWatcherElement();

  window.MAIN_CONTENT_ELEMENT.scrollTo(10, 15);
  const round = (n) => roundNumTo(n, 2);
  const roundTopF = (n) =>
    round(n / (window.SCROLL_HEIGHT - window.CLIENT_HEIGHT)) + "";
  const roundLeftF = (n) =>
    round(n / (window.SCROLL_WIDTH - window.CLIENT_WIDTH)) + "";

  await watcher.trackScroll();

  await window.waitFor(100);

  expect(
    document.documentElement.style.getPropertyValue(
      "--lisn-js--page-scroll-top",
    ),
  ).toBe("15");
  expect(
    document.documentElement.style.getPropertyValue(
      "--lisn-js--page-scroll-top-fraction",
    ),
  ).toBe(roundTopF(15));
  expect(
    document.documentElement.style.getPropertyValue(
      "--lisn-js--page-scroll-left",
    ),
  ).toBe("10");
  expect(
    document.documentElement.style.getPropertyValue(
      "--lisn-js--page-scroll-left-fraction",
    ),
  ).toBe(roundLeftF(10));
  expect(
    document.documentElement.style.getPropertyValue(
      "--lisn-js--page-scroll-width",
    ),
  ).toBe(window.SCROLL_WIDTH + "");
  expect(
    document.documentElement.style.getPropertyValue(
      "--lisn-js--page-scroll-height",
    ),
  ).toBe(window.SCROLL_HEIGHT + "");
});
