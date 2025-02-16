const { test, expect } = require("@jest/globals");

const { Undisplay, fetchAction } = window.LISN.actions;
const { isElementUndisplayed } = window.LISN.utils;

test("basic", async () => {
  const element = document.createElement("div");
  element.classList.add("lisn-undisplay");
  expect(isElementUndisplayed(element)).toBe(true);

  const action = new Undisplay(element);

  await window.waitForAF();
  expect(isElementUndisplayed(element)).toBe(false); // initial state displayed

  await action.do();
  expect(isElementUndisplayed(element)).toBe(true);

  await action.undo();
  expect(isElementUndisplayed(element)).toBe(false);

  await action.undo(); // no-op
  expect(isElementUndisplayed(element)).toBe(false);

  await action.toggle();
  expect(isElementUndisplayed(element)).toBe(true);

  await action.toggle();
  expect(isElementUndisplayed(element)).toBe(false);
});

test("is registered", async () => {
  const element = document.createElement("div");
  element.classList.add("lisn-undisplay");

  const action = await fetchAction(element, "undisplay");
  expect(action).toBeInstanceOf(Undisplay);

  await window.waitForAF();
  expect(isElementUndisplayed(element)).toBe(false);

  await action.do();
  expect(isElementUndisplayed(element)).toBe(true);
});
