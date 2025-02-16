const { test, expect } = require("@jest/globals");

const { AddClass, fetchAction } = window.LISN.actions;

test("basic", async () => {
  const element = document.createElement("div");
  element.classList.add("foo");

  const action = new AddClass(element, "foo", "bar");

  await window.waitForAF();
  expect(element.classList.contains("foo")).toBe(false); // initial state removed

  await action.do();
  expect(element.classList.contains("foo")).toBe(true);
  expect(element.classList.contains("bar")).toBe(true);

  await action.undo();
  expect(element.classList.contains("foo")).toBe(false);
  expect(element.classList.contains("bar")).toBe(false);

  await action.undo(); // no-op
  expect(element.classList.contains("foo")).toBe(false);
  expect(element.classList.contains("bar")).toBe(false);

  await action.toggle();
  expect(element.classList.contains("foo")).toBe(true);
  expect(element.classList.contains("bar")).toBe(true);

  await action.toggle();
  expect(element.classList.contains("foo")).toBe(false);
  expect(element.classList.contains("bar")).toBe(false);
});

test("is registered", async () => {
  const element = document.createElement("div");
  const action = await fetchAction(element, "add-class", "foo, bar");
  expect(action).toBeInstanceOf(AddClass);

  await action.do();
  expect(element.classList.contains("foo")).toBe(true);
  expect(element.classList.contains("bar")).toBe(true);
});
