const { describe, test, expect } = require("@jest/globals");

const { ScrollWatcher } = window.LISN.watchers;

document.documentElement.enableScroll();

// for convenience we don't use the default config, but set everything to 0
// unless explicitly given
const newWatcherElement = (config = null) => {
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

  return { watcher, element };
};

describe("scrollTo: scrolling elements", () => {
  // rest is tested as part of scroll-utils
  test("default scrolling element", async () => {
    const { watcher } = newWatcherElement();
    const action = await watcher.scrollTo({
      top: 100,
      left: 50,
    });

    await expect(
      watcher.fetchCurrentScrollAction(document.documentElement),
    ).resolves.not.toBe(action);
    await expect(
      watcher.fetchCurrentScrollAction(document.documentElement),
    ).resolves.toEqual(action);
    await expect(watcher.fetchCurrentScrollAction()).resolves.not.toBe(action);
    await expect(watcher.fetchCurrentScrollAction()).resolves.toEqual(action);

    await expect(watcher.fetchCurrentScrollAction(document.body)).resolves.toBe(
      null,
    );

    await expect(action.waitFor()).resolves.toEqual({ top: 100, left: 50 });
    await expect(
      watcher.fetchCurrentScrollAction(document.documentElement),
    ).resolves.toBe(null);
    await expect(watcher.fetchCurrentScrollAction()).resolves.toBe(null);
  });

  test("custom scrolling element", async () => {
    const { watcher, element } = newWatcherElement();

    const action = await watcher.scrollTo(
      {
        top: 100,
        left: 50,
      },
      { scrollable: element },
    );

    await expect(watcher.fetchCurrentScrollAction(element)).resolves.not.toBe(
      action,
    );
    await expect(watcher.fetchCurrentScrollAction(element)).resolves.toEqual(
      action,
    );

    await expect(action.waitFor()).resolves.toEqual({ top: 100, left: 50 });
    await expect(watcher.fetchCurrentScrollAction(element)).resolves.toBe(null);
  });
});

describe("scroll", () => {
  test("invalid direction", () => {
    const { watcher } = newWatcherElement();
    expect(() => watcher.scroll("invalid")).toThrow(/Unknown scroll direction/);
  });

  test("invalid asFractionOf", () => {
    const { watcher } = newWatcherElement();
    expect(() => watcher.scroll("up", { asFractionOf: "invalid" })).toThrow(
      /Unknown 'asFractionOf' keyword/,
    );
  });

  for (const [direction, deltaX, deltaY] of [
    // TODO test.each
    ["up", 0, -1],
    ["down", 0, 1],
    ["left", -1, 0],
    ["right", 1, 0],
  ]) {
    test("direction " + direction, async () => {
      const { watcher, element } = newWatcherElement();
      element.scrollTo(200, 400);

      const action = await watcher.scroll(direction, {
        scrollable: element,
      });

      await expect(action.waitFor()).resolves.toEqual({
        top: 400 + deltaY * 100,
        left: 200 + deltaX * 100,
      });
    });

    test("direction " + direction + " asFractionOf visible", async () => {
      const { watcher, element } = newWatcherElement();
      element.scrollTo(window.CLIENT_WIDTH * 2, window.CLIENT_HEIGHT * 2);

      const action = await watcher.scroll(direction, {
        asFractionOf: "visible",
        scrollable: element,
      });

      await expect(action.waitFor()).resolves.toEqual({
        top: window.CLIENT_HEIGHT * 2 + deltaY * window.CLIENT_HEIGHT,
        left: window.CLIENT_WIDTH * 2 + deltaX * window.CLIENT_WIDTH,
      });
    });

    test("direction " + direction + " asFractionOf content", async () => {
      const { watcher, element } = newWatcherElement();
      element.scrollTo(window.SCROLL_WIDTH / 2, window.SCROLL_HEIGHT / 2);

      const action = await watcher.scroll(direction, {
        asFractionOf: "content",
        scrollable: element,
      });

      const expectedTop =
        window.SCROLL_HEIGHT / 2 + deltaY * window.SCROLL_HEIGHT;
      const expectedLeft =
        window.SCROLL_WIDTH / 2 + deltaX * window.SCROLL_WIDTH;

      await expect(action.waitFor()).resolves.toEqual({
        top: Math.max(
          0,
          Math.min(window.SCROLL_HEIGHT - window.CLIENT_HEIGHT, expectedTop),
        ),
        left: Math.max(
          0,
          Math.min(window.SCROLL_WIDTH - window.CLIENT_WIDTH, expectedLeft),
        ),
      });
    });
  }

  test("custom amount + additive effect", async () => {
    const { watcher, element } = newWatcherElement();
    let x = 10,
      y = 50;
    element.scrollTo(x, y);

    y += 200;
    let action = await watcher.scroll("down", {
      amount: 200,
      scrollable: element,
    });
    await expect(action.waitFor()).resolves.toEqual({
      top: y,
      left: x,
    });

    y -= 50;
    action = await watcher.scroll("up", {
      amount: 50,
      scrollable: element,
    });
    await expect(action.waitFor()).resolves.toEqual({
      top: y,
      left: x,
    });

    x += 70;
    action = await watcher.scroll("right", {
      amount: 70,
      scrollable: element,
    });
    await expect(action.waitFor()).resolves.toEqual({
      top: y,
      left: x,
    });
  });
});
