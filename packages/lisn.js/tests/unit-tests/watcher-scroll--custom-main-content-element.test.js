const { test, expect } = require("@jest/globals");
require("./supplementary/settings--main-content-element");

const { ScrollWatcher } = window.LISN.watchers;

test("fetchMainContentElement", async () => {
  await expect(ScrollWatcher.fetchMainContentElement()).resolves.toBe(
    window.MAIN_CONTENT_ELEMENT,
  );
});

test("fetchMainScrollableElement", async () => {
  await expect(ScrollWatcher.fetchMainScrollableElement()).resolves.toBe(
    window.MAIN_CONTENT_ELEMENT,
  );
});
