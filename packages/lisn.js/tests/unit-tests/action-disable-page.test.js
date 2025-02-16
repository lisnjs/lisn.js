const { test, expect } = require("@jest/globals");

const { DisablePage, fetchAction } = window.LISN.actions;
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
  const { pager, element } = await newPager(3);
  pager.disablePage(3);
  expect(pager.isPageDisabled(3)).toBe(true);

  const action = new DisablePage(element, 3);

  await window.waitFor(0);
  expect(pager.isPageDisabled(3)).toBe(false); // initial state enabled

  await action.do();
  expect(pager.isPageDisabled(3)).toBe(true);

  await action.undo();
  expect(pager.isPageDisabled(3)).toBe(false);

  await action.undo(); // no-op
  expect(pager.isPageDisabled(3)).toBe(false);

  await action.toggle();
  expect(pager.isPageDisabled(3)).toBe(true);

  await action.toggle();
  expect(pager.isPageDisabled(3)).toBe(false);
});

test("non-existend trigger", async () => {
  const element = document.createElement("div");
  window.expectWarning("No pager widget");
  const action = new DisablePage(element, 3);
  await action.do(); // no-op
  await action.undo(); // no-op
  await action.toggle(); // no-op
});

test("is registered", async () => {
  const { pager, element } = await newPager(3);
  pager.disablePage(3);

  const action = await fetchAction(element, "disable-page", "3");
  expect(action).toBeInstanceOf(DisablePage);

  await window.waitForAF();
  expect(pager.isPageDisabled(3)).toBe(false);

  await action.do();
  expect(pager.isPageDisabled(3)).toBe(true);
});
