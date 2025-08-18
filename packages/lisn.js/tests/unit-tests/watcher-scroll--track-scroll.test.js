const { jest, describe, test, expect } = require("@jest/globals");

const { roundNumTo } = window.LISN.utils;
const { Callback } = window.LISN.modules;
const { ScrollWatcher } = window.LISN.watchers;

window.LISN.settings.contentWrappingAllowed = false;

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
  const round = (n) => roundNumTo(n, 2);
  const roundTopF = (n) =>
    round(n / (window.SCROLL_HEIGHT - window.CLIENT_HEIGHT)) + "";
  const roundLeftF = (n) =>
    round(n / (window.SCROLL_WIDTH - window.CLIENT_WIDTH)) + "";

  test("adding", async () => {
    const { watcher, element } = newWatcherElement();

    element.scrollTo(10, 15);

    const mutationFn = jest.fn();
    const mo = new MutationObserver(mutationFn);
    mo.observe(element, {
      attributes: true,
    });

    watcher.noTrackScroll(null, element); // no-op
    watcher.trackScroll(null, { scrollable: element });
    watcher.trackScroll(null, { scrollable: element }); // no-op
    await watcher.trackScroll(null, { scrollable: element }); // no-op

    await window.waitFor(120);

    expect(element.style.getPropertyValue("--lisn-js--scroll-top")).toBe("15");
    expect(
      element.style.getPropertyValue("--lisn-js--scroll-top-fraction"),
    ).toBe(roundTopF(15));
    expect(element.style.getPropertyValue("--lisn-js--scroll-left")).toBe("10");
    expect(
      element.style.getPropertyValue("--lisn-js--scroll-left-fraction"),
    ).toBe(roundLeftF(10));
    expect(element.style.getPropertyValue("--lisn-js--scroll-width")).toBe(
      window.SCROLL_WIDTH + "",
    );
    expect(element.style.getPropertyValue("--lisn-js--scroll-height")).toBe(
      window.SCROLL_HEIGHT + "",
    );

    await window.waitFor(100);
    expect(mutationFn).toHaveBeenCalledTimes(1);
  });

  test("custom handler + cleanup", async () => {
    const { watcher, element, callback } = newWatcherElement();
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    // The above will activate DOMWatcher and SizeWatcher, so wait before adding
    await window.waitFor(100);

    const wrapper = Callback.wrap(callback);

    await watcher.trackScroll(wrapper, { scrollable: element });

    await window.waitFor(100);
    expect(callback).toHaveBeenCalledTimes(1); // initial call

    // scroll element
    element.scrollTo(1, 1);
    await window.waitFor(100);
    expect(callback).toHaveBeenCalledTimes(2);

    // resize client width/height
    element.resize([100, 100]);
    await window.waitFor(100);
    expect(callback).toHaveBeenCalledTimes(3);

    // add children (resize scroll width/height)
    element.appendAndResize(document.createElement("div"));
    element.appendAndResize(document.createElement("div"));
    await window.waitFor(100);
    expect(callback).toHaveBeenCalledTimes(4);

    // remove
    wrapper.remove();
    element.scrollTo(10, 10);
    element.resize([500, 500]);
    element.appendAndResize(document.createElement("div"));
    await window.waitFor(100);
    expect(callback).toHaveBeenCalledTimes(4); // no new calls
  });

  test("removing", async () => {
    const { watcher, element } = newWatcherElement();

    element.scrollTo(10, 15);

    const mutationFn = jest.fn();
    const mo = new MutationObserver(mutationFn);
    mo.observe(element, {
      attributes: true,
    });

    await watcher.trackScroll(null, { scrollable: element });

    await window.waitFor(100);

    expect(element.style.getPropertyValue("--lisn-js--scroll-top")).toBe("15");
    expect(
      element.style.getPropertyValue("--lisn-js--scroll-top-fraction"),
    ).toBe(roundTopF(15));
    expect(element.style.getPropertyValue("--lisn-js--scroll-left")).toBe("10");
    expect(
      element.style.getPropertyValue("--lisn-js--scroll-left-fraction"),
    ).toBe(roundLeftF(10));
    expect(element.style.getPropertyValue("--lisn-js--scroll-width")).toBe(
      window.SCROLL_WIDTH + "",
    );
    expect(element.style.getPropertyValue("--lisn-js--scroll-height")).toBe(
      window.SCROLL_HEIGHT + "",
    );

    await window.waitFor(100);
    expect(mutationFn).toHaveBeenCalledTimes(1);

    await watcher.noTrackScroll(null, element);
    await window.waitForAF();

    expect(element.style.getPropertyValue("--lisn-js--scroll-top")).toBe("");
    expect(
      element.style.getPropertyValue("--lisn-js--scroll-top-fraction"),
    ).toBe("");
    expect(element.style.getPropertyValue("--lisn-js--scroll-left")).toBe("");
    expect(
      element.style.getPropertyValue("--lisn-js--scroll-left-fraction"),
    ).toBe("");
    expect(element.style.getPropertyValue("--lisn-js--scroll-width")).toBe("");
    expect(element.style.getPropertyValue("--lisn-js--scroll-height")).toBe("");

    await window.waitFor(100);
    expect(mutationFn).toHaveBeenCalledTimes(2);
  });
});
