const { beforeAll, test, expect } = require("@jest/globals");

const settings = window.LISN.settings;
const { ScrollWatcher } = window.LISN.watchers;

settings.mainScrollableElementSelector = "body";

beforeAll(async () => {
  // await for it to setup the scroll tracking
  await null;
});

test("fetchMainContentElement", async () => {
  await expect(ScrollWatcher.fetchMainContentElement()).resolves.toBe(
    document.body,
  );
});

test("fetchMainScrollableElement", async () => {
  await expect(ScrollWatcher.fetchMainScrollableElement()).resolves.toBe(
    document.documentElement,
  );
});
