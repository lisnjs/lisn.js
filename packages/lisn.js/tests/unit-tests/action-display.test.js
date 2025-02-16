const { test, expect } = require("@jest/globals");

const { Display, fetchAction } = window.LISN.actions;
const { isElementUndisplayed } = window.LISN.utils;

test("basic", async () => {
  const element = document.createElement("div");

  const action = new Display(element);

  await window.waitForAF();
  expect(isElementUndisplayed(element)).toBe(true); // initial state undisplayed

  await action.do();
  expect(isElementUndisplayed(element)).toBe(false);

  await action.undo();
  expect(isElementUndisplayed(element)).toBe(true);

  await action.undo(); // no-op
  expect(isElementUndisplayed(element)).toBe(true);

  await action.toggle();
  expect(isElementUndisplayed(element)).toBe(false);

  await action.toggle();
  expect(isElementUndisplayed(element)).toBe(true);
});

test("is registered", async () => {
  const element = document.createElement("div");
  const action = await fetchAction(element, "display");
  expect(action).toBeInstanceOf(Display);

  await window.waitForAF();
  expect(isElementUndisplayed(element)).toBe(true);

  await action.do();
  expect(isElementUndisplayed(element)).toBe(false);
});
