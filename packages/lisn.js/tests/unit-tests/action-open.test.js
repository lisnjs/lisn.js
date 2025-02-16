const { test, expect } = require("@jest/globals");

const { Open, fetchAction } = window.LISN.actions;
const { Collapsible } = window.LISN.widgets;

test("basic", async () => {
  const element = document.createElement("div");

  // init action first to test waiting for widget
  const action = new Open(element, "foo", "bar");
  const widget = new Collapsible(element);

  await window.waitForAF();
  expect(widget.isOpen()).toBe(false);

  await action.do();
  expect(widget.isOpen()).toBe(true);

  await action.undo();
  expect(widget.isOpen()).toBe(false);

  await action.undo(); // no-op
  expect(widget.isOpen()).toBe(false);

  await action.toggle();
  expect(widget.isOpen()).toBe(true);

  await action.toggle();
  expect(widget.isOpen()).toBe(false);
});

test("non-existent widget", async () => {
  const element = document.createElement("div");
  window.expectWarning("No openable widget");
  const action = new Open(element);
  await window.waitFor(10);
  await action.do(); // no-op
  await action.undo(); // no-op
  await action.toggle(); // no-op
});

test("is registered", async () => {
  const element = document.createElement("div");
  const widget = new Collapsible(element);
  const action = await fetchAction(element, "open");
  expect(action).toBeInstanceOf(Open);

  await window.waitForAF();
  expect(widget.isOpen()).toBe(false);

  await action.do();
  expect(widget.isOpen()).toBe(true);
});
