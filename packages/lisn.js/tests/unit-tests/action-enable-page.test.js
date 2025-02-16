const { test, expect } = require("@jest/globals");

const { EnablePage, fetchAction } = window.LISN.actions;
const { Pager } = window.LISN.widgets;

const newPager = async (numPages = 4, element = null) => {
  element ??= document.createElement("div");
  for (let i = 0; i < numPages; i++) {
    element.append(document.createElement("div"));
  }

  document.body.append(element);

  const pager = new Pager(element);
  await window.waitFor(100);

  const pages = [...element.children];

  expect(pager.getPages().length).toBe(pages.length);

  expect(pager.getCurrentPageNum()).toBe(1);
  expect(pager.getCurrentPage()).toBe(pages[0]);

  return { pager, element, pages };
};

test("basic", async () => {
  const element = document.createElement("div");

  // init action first to test waiting for triggers
  const action = new EnablePage(element, 3);

  const { pager } = await newPager(3, element);

  expect(pager.isPageDisabled(3)).toBe(true); // initial state disabled

  await action.do();
  expect(pager.isPageDisabled(3)).toBe(false);

  await action.undo();
  expect(pager.isPageDisabled(3)).toBe(true);

  await action.undo(); // no-op
  expect(pager.isPageDisabled(3)).toBe(true);

  await action.toggle();
  expect(pager.isPageDisabled(3)).toBe(false);

  await action.toggle();
  expect(pager.isPageDisabled(3)).toBe(true);
});

test("non-existent trigger", async () => {
  const element = document.createElement("div");
  window.expectWarning("No pager widget");
  const action = new EnablePage(element, 3);
  await window.waitFor(10);
  await action.do(); // no-op
  await action.undo(); // no-op
  await action.toggle(); // no-op
});

test("is registered", async () => {
  const { pager, element } = await newPager(3);

  const action = await fetchAction(element, "enable-page", "3");
  expect(action).toBeInstanceOf(EnablePage);

  await window.waitForAF();
  expect(pager.isPageDisabled(3)).toBe(true);

  await action.do();
  expect(pager.isPageDisabled(3)).toBe(false);
});
