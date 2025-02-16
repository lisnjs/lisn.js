const { test, expect } = require("@jest/globals");
require("./supplementary/settings--main-content-element");

const { ScrollWatcher } = window.LISN.watchers;

window.MAIN_CONTENT_ELEMENT.enableScroll();

test("scrollTo: default scrolling element", async () => {
  const watcher = ScrollWatcher.create();
  const action = await watcher.scrollTo({
    top: 100,
    left: 50,
  });

  await expect(
    watcher.fetchCurrentScrollAction(window.MAIN_CONTENT_ELEMENT),
  ).resolves.not.toBe(action);
  await expect(
    watcher.fetchCurrentScrollAction(window.MAIN_CONTENT_ELEMENT),
  ).resolves.toEqual(action);
  await expect(watcher.fetchCurrentScrollAction()).resolves.not.toBe(action);
  await expect(watcher.fetchCurrentScrollAction()).resolves.toEqual(action);

  await expect(
    watcher.fetchCurrentScrollAction(document.documentElement),
  ).resolves.toBe(null);
  await expect(watcher.fetchCurrentScrollAction(document.body)).resolves.toBe(
    null,
  );

  await expect(action.waitFor()).resolves.toEqual({ top: 100, left: 50 });
  await expect(
    watcher.fetchCurrentScrollAction(window.MAIN_CONTENT_ELEMENT),
  ).resolves.toBe(null);
  await expect(watcher.fetchCurrentScrollAction()).resolves.toBe(null);
});
