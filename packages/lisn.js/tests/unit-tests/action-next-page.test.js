const { test, expect } = require("@jest/globals");

const { NextPage, fetchAction } = window.LISN.actions;
const { Pager } = window.LISN.widgets;

const newPager = async (numPages = 4, element = null) => {
  element ??= document.createElement("div");
  for (let i = 0; i < numPages; i++) {
    element.append(document.createElement("div"));
  }

  document.body.append(element);

  const pager = new Pager(element);
  await window.waitFor(400);

  const pages = [...element.children];

  expect(pager.getPages().length).toBe(pages.length);

  expect(pager.getCurrentPageNum()).toBe(1);
  expect(pager.getCurrentPage()).toBe(pages[0]);

  expect(pages[0].dataset.lisnPageState).toEqual("current");
  for (const page of pages.slice(1)) {
    expect(page.dataset.lisnPageState).toEqual("next");
  }

  for (let i = 1; i <= pages.length; i++) {
    expect(pager.isPageDisabled(i)).toBe(false);
    expect(pager.getPages()[i]).toBe(pages[i]);
  }

  return { pager, element, pages };
};

test("basic", async () => {
  const element = document.createElement("div");

  // init action first to test waiting for widget
  const action = new NextPage(element);

  const { pager } = await newPager(3, element);

  expect(pager.getCurrentPageNum()).toBe(1);

  await action.do();
  expect(pager.getCurrentPageNum()).toBe(2);

  await action.do();
  expect(pager.getCurrentPageNum()).toBe(3);

  await action.do(); // no-op
  expect(pager.getCurrentPageNum()).toBe(3);

  await action.undo();
  expect(pager.getCurrentPageNum()).toBe(2);

  await action.undo();
  expect(pager.getCurrentPageNum()).toBe(1);

  await action.undo(); // no-op
  expect(pager.getCurrentPageNum()).toBe(1);

  await action.toggle();
  expect(pager.getCurrentPageNum()).toBe(2);

  await action.toggle();
  expect(pager.getCurrentPageNum()).toBe(1);
});

test("toggle after do", async () => {
  const element = document.createElement("div");
  // init action first to test waiting for widget
  const action = new NextPage(element);

  const { pager } = await newPager(3, element);

  expect(pager.getCurrentPageNum()).toBe(1);

  await action.do();
  expect(pager.getCurrentPageNum()).toBe(2);

  await action.toggle();
  expect(pager.getCurrentPageNum()).toBe(1);

  await action.toggle();
  expect(pager.getCurrentPageNum()).toBe(2);
});

test("toggle after undo", async () => {
  const element = document.createElement("div");
  // init action first to test waiting for widget
  const action = new NextPage(element);

  const { pager } = await newPager(3, element);

  await pager.goToPage(3);
  expect(pager.getCurrentPageNum()).toBe(3);

  await action.undo();
  expect(pager.getCurrentPageNum()).toBe(2);

  await action.toggle();
  expect(pager.getCurrentPageNum()).toBe(3);

  await action.toggle();
  expect(pager.getCurrentPageNum()).toBe(2);
});

test("toggle out of bounds", async () => {
  const element = document.createElement("div");
  // init action first to test waiting for widget
  const action = new NextPage(element);

  const { pager } = await newPager(3, element);

  await pager.goToPage(3);
  expect(pager.getCurrentPageNum()).toBe(3);

  await action.toggle(); // no-op
  expect(pager.getCurrentPageNum()).toBe(3);

  await action.toggle();
  expect(pager.getCurrentPageNum()).toBe(2);

  await action.toggle();
  expect(pager.getCurrentPageNum()).toBe(3);
});

test("toggle first", async () => {
  const element = document.createElement("div");
  // init action first to test waiting for widget
  const action = new NextPage(element);

  const { pager } = await newPager(3, element);

  expect(pager.getCurrentPageNum()).toBe(1);

  await action.toggle();
  expect(pager.getCurrentPageNum()).toBe(2);

  await action.toggle();
  expect(pager.getCurrentPageNum()).toBe(1);

  await action.toggle();
  expect(pager.getCurrentPageNum()).toBe(2);
});

test("non-existent widget", async () => {
  const element = document.createElement("div");
  window.expectWarning("No pager widget");
  const action = new NextPage(element);
  await window.waitFor(10);
  await action.do(); // no-op
  await action.undo(); // no-op
  await action.toggle(); // no-op
});

test("is registered", async () => {
  const { element, pager } = await newPager();
  const action = await fetchAction(element, "next-page");
  expect(action).toBeInstanceOf(NextPage);

  await window.waitForAF();
  expect(pager.getCurrentPageNum()).toBe(1);

  await action.do();
  expect(pager.getCurrentPageNum()).toBe(2);
});
