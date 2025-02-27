const { test, expect } = require("@jest/globals");

const { AnimatePause, fetchAction } = window.LISN.actions;

test("basic", async () => {
  const element = document.createElement("div");
  const action = new AnimatePause(element);

  await window.waitForAF();
  // initial state playing
  expect(element.classList.contains("lisn-animate__pause")).toBe(false);

  await action.do();
  expect(element.classList.contains("lisn-animate__pause")).toBe(true);
  expect(element.classList.contains("lisn-animate__reverse")).toBe(false);

  await action.undo();
  expect(element.classList.contains("lisn-animate__pause")).toBe(false);
  expect(element.classList.contains("lisn-animate__reverse")).toBe(false);

  await action.undo(); // no-op
  expect(element.classList.contains("lisn-animate__pause")).toBe(false);
  expect(element.classList.contains("lisn-animate__reverse")).toBe(false);

  await action.toggle();
  expect(element.classList.contains("lisn-animate__pause")).toBe(true);
  expect(element.classList.contains("lisn-animate__reverse")).toBe(false);

  await action.toggle();
  expect(element.classList.contains("lisn-animate__pause")).toBe(false);
  expect(element.classList.contains("lisn-animate__reverse")).toBe(false);
});

test("is registered", async () => {
  const element = document.createElement("div");
  const action = await fetchAction(element, "animate-pause");
  expect(action).toBeInstanceOf(AnimatePause);

  await window.waitForAF();
  expect(element.classList.contains("lisn-animate__pause")).toBe(false);

  await action.do();
  expect(element.classList.contains("lisn-animate__pause")).toBe(true);
  expect(element.classList.contains("lisn-animate__reverse")).toBe(false);
});
