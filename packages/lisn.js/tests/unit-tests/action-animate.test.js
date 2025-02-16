const { test, expect } = require("@jest/globals");

const { Animate, fetchAction } = window.LISN.actions;

test("basic", async () => {
  const element = document.createElement("div");
  element.dataset.lisnTestLegacy = "";
  const action = new Animate(element);

  await window.waitForAF();
  expect(element.classList.contains("lisn-animate__pause")).toBe(true);

  await action.do();
  expect(element.classList.contains("lisn-animate__pause")).toBe(false);
  expect(element.classList.contains("lisn-animate__reverse")).toBe(false);

  await action.undo();
  expect(element.classList.contains("lisn-animate__pause")).toBe(false);
  expect(element.classList.contains("lisn-animate__reverse")).toBe(true);

  await action.undo(); // no-op
  expect(element.classList.contains("lisn-animate__pause")).toBe(false);
  expect(element.classList.contains("lisn-animate__reverse")).toBe(true);

  await action.toggle();
  expect(element.classList.contains("lisn-animate__pause")).toBe(false);
  expect(element.classList.contains("lisn-animate__reverse")).toBe(false);

  await action.toggle();
  expect(element.classList.contains("lisn-animate__pause")).toBe(false);
  expect(element.classList.contains("lisn-animate__reverse")).toBe(true);
});

test("is registered", async () => {
  const element = document.createElement("div");
  const action = await fetchAction(element, "animate");
  expect(action).toBeInstanceOf(Animate);

  await window.waitForAF();
  expect(element.classList.contains("lisn-animate__pause")).toBe(true);

  await action.do();
  expect(element.classList.contains("lisn-animate__pause")).toBe(false);
  expect(element.classList.contains("lisn-animate__reverse")).toBe(false);
});
