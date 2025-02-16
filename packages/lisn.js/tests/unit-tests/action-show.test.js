const { test, expect } = require("@jest/globals");

const { Show, fetchAction } = window.LISN.actions;
const { isElementHidden } = window.LISN.utils;

test("basic", async () => {
  const element = document.createElement("div");

  const action = new Show(element);

  await window.waitForAF();
  expect(isElementHidden(element)).toBe(true); // initial state hidden

  await action.do();
  expect(isElementHidden(element)).toBe(false);

  await action.undo();
  expect(isElementHidden(element)).toBe(true);

  await action.undo(); // no-op
  expect(isElementHidden(element)).toBe(true);

  await action.toggle();
  expect(isElementHidden(element)).toBe(false);

  await action.toggle();
  expect(isElementHidden(element)).toBe(true);
});

test("is registered", async () => {
  const element = document.createElement("div");
  const action = await fetchAction(element, "show");
  expect(action).toBeInstanceOf(Show);

  await window.waitForAF();
  expect(isElementHidden(element)).toBe(true);

  await action.do();
  expect(isElementHidden(element)).toBe(false);
});
