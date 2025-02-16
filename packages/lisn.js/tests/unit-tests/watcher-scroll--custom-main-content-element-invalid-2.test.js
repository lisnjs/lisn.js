const { beforeAll, jest, test, expect } = require("@jest/globals");

const settings = window.LISN.settings;
const { ScrollWatcher } = window.LISN.watchers;

settings.mainScrollableElementSelector = "#main";

beforeAll(async () => {
  ScrollWatcher.reuse().trackScroll();
});

window.MAIN_CONTENT_ELEMENT = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "svg",
);
window.MAIN_CONTENT_ELEMENT.id = "main";
document.body.append(window.MAIN_CONTENT_ELEMENT);

const warnFn = jest.fn();
window.expectWarning(
  "mainScrollableElementSelector should point to an HTMLElement",
  warnFn,
);

test("warning", async () => {
  await window.waitFor(100);
  expect(warnFn).toHaveBeenCalledTimes(1);
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
