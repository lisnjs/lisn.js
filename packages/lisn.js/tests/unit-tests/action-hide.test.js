const { test, expect } = require("@jest/globals");

const { Hide, fetchAction } = window.LISN.actions;
const { isElementHidden } = window.LISN.utils;

test("basic", async () => {
  const element = document.createElement("div");
  element.classList.add("lisn-hide");
  expect(isElementHidden(element)).toBe(true);

  const action = new Hide(element);

  await window.waitForAF();
  expect(isElementHidden(element)).toBe(false); // initial state shown

  await action.do();
  expect(isElementHidden(element)).toBe(true);

  await action.undo();
  expect(isElementHidden(element)).toBe(false);

  await action.undo(); // no-op
  expect(isElementHidden(element)).toBe(false);

  await action.toggle();
  expect(isElementHidden(element)).toBe(true);

  await action.toggle();
  expect(isElementHidden(element)).toBe(false);
});

test("is registered", async () => {
  const element = document.createElement("div");
  element.classList.add("lisn-hide");

  const action = await fetchAction(element, "hide");
  expect(action).toBeInstanceOf(Hide);

  await window.waitForAF();
  expect(isElementHidden(element)).toBe(false);

  await action.do();
  expect(isElementHidden(element)).toBe(true);
});
