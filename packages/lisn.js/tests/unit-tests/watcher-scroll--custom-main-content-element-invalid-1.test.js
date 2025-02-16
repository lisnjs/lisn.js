const { beforeAll, jest, test, expect } = require("@jest/globals");

const settings = window.LISN.settings;
const { ScrollWatcher } = window.LISN.watchers;

settings.mainScrollableElementSelector = "#nonexistent";

beforeAll(async () => {
  ScrollWatcher.reuse().trackScroll();
});

const errFn = jest.fn();
window.expectError("No match for '#nonexistent'", errFn);

test("error", async () => {
  await window.waitFor(100);
  expect(errFn).toHaveBeenCalledTimes(1);
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
