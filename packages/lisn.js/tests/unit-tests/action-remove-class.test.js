const { test, expect } = require("@jest/globals");

const { RemoveClass, fetchAction } = window.LISN.actions;

test("basic", async () => {
  const element = document.createElement("div");
  element.classList.add("foo");

  const action = new RemoveClass(element, "foo", "bar");

  await window.waitForAF();
  expect(element.classList.contains("foo")).toBe(true); // initial state added

  await action.do();
  expect(element.classList.contains("foo")).toBe(false);
  expect(element.classList.contains("bar")).toBe(false);

  await action.undo();
  expect(element.classList.contains("foo")).toBe(true);
  expect(element.classList.contains("bar")).toBe(true);

  await action.undo(); // no-op
  expect(element.classList.contains("foo")).toBe(true);
  expect(element.classList.contains("bar")).toBe(true);

  await action.toggle();
  expect(element.classList.contains("foo")).toBe(false);
  expect(element.classList.contains("bar")).toBe(false);

  await action.toggle();
  expect(element.classList.contains("foo")).toBe(true);
  expect(element.classList.contains("bar")).toBe(true);
});

test("is registered", async () => {
  const element = document.createElement("div");
  element.classList.add("foo", "bar");
  const action = await fetchAction(element, "remove-class", "foo, bar");
  expect(action).toBeInstanceOf(RemoveClass);

  await action.do();
  expect(element.classList.contains("foo")).toBe(false);
  expect(element.classList.contains("bar")).toBe(false);
});
