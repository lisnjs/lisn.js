const { jest, test, expect } = require("@jest/globals");

const { Disable, fetchAction } = window.LISN.actions;
const { Trigger } = window.LISN.triggers;

const dummyAction = {
  do: jest.fn(),
  undo: jest.fn(),
  toggle: jest.fn(),
};

test("basic", async () => {
  const element = document.createElement("div");
  const triggerA = new Trigger(element, [dummyAction], { id: "foo" });
  const triggerB = new Trigger(element, [dummyAction], { id: "bar" });
  triggerA.disable();
  triggerB.disable();

  const action = new Disable(element, "foo", "bar");
  expect(triggerA.isDisabled()).toBe(true);
  expect(triggerB.isDisabled()).toBe(true);

  await window.waitForAF();
  expect(triggerA.isDisabled()).toBe(false); // initial state enabled
  expect(triggerB.isDisabled()).toBe(false); // initial state enabled

  await action.do();
  expect(triggerA.isDisabled()).toBe(true);
  expect(triggerB.isDisabled()).toBe(true);

  await action.undo();
  expect(triggerA.isDisabled()).toBe(false);
  expect(triggerB.isDisabled()).toBe(false);

  await action.undo(); // no-op
  expect(triggerA.isDisabled()).toBe(false);
  expect(triggerB.isDisabled()).toBe(false);

  await action.toggle();
  expect(triggerA.isDisabled()).toBe(true);
  expect(triggerB.isDisabled()).toBe(true);

  await action.toggle();
  expect(triggerA.isDisabled()).toBe(false);
  expect(triggerB.isDisabled()).toBe(false);
});

test("non-existend trigger", async () => {
  const element = document.createElement("div");
  window.expectWarning("No trigger with ID foo");
  const action = new Disable(element, "foo");
  await action.do(); // no-op
  await action.undo(); // no-op
  await action.toggle(); // no-op
});

test("no triggers", async () => {
  // shouldn't throw
  const element = document.createElement("div");
  window.expectWarning("At least 1 ID is required");
  const action = new Disable(element);
  await action.do(); // no-op
  await action.undo(); // no-op
  await action.toggle(); // no-op
});

test("is registered", async () => {
  const element = document.createElement("div");
  const triggerA = new Trigger(element, [dummyAction], { id: "foo" });
  const triggerB = new Trigger(element, [dummyAction], { id: "bar" });
  triggerA.disable();
  triggerB.disable();

  const action = await fetchAction(element, "disable", "foo, bar");
  expect(action).toBeInstanceOf(Disable);

  await window.waitForAF();
  expect(triggerA.isDisabled()).toBe(false);
  expect(triggerB.isDisabled()).toBe(false);

  await action.do();
  expect(triggerA.isDisabled()).toBe(true);
  expect(triggerB.isDisabled()).toBe(true);
});
