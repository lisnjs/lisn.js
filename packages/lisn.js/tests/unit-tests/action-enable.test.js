const { jest, test, expect } = require("@jest/globals");

const { Enable, fetchAction } = window.LISN.actions;
const { Trigger } = window.LISN.triggers;

const dummyAction = {
  do: jest.fn(),
  undo: jest.fn(),
  toggle: jest.fn(),
};

test("basic", async () => {
  const element = document.createElement("div");

  // init action first to test waiting for triggers
  const action = new Enable(element, "foo", "bar");
  const triggerA = new Trigger(element, [dummyAction], { id: "foo" });
  const triggerB = new Trigger(element, [dummyAction], { id: "bar" });
  expect(triggerA.isDisabled()).toBe(false);
  expect(triggerB.isDisabled()).toBe(false);

  await window.waitForAF();
  expect(triggerA.isDisabled()).toBe(true); // initial state disabled
  expect(triggerB.isDisabled()).toBe(true); // initial state disabled

  await action.do();
  expect(triggerA.isDisabled()).toBe(false);
  expect(triggerB.isDisabled()).toBe(false);

  await action.undo();
  expect(triggerA.isDisabled()).toBe(true);
  expect(triggerB.isDisabled()).toBe(true);

  await action.undo(); // no-op
  expect(triggerA.isDisabled()).toBe(true);
  expect(triggerB.isDisabled()).toBe(true);

  await action.toggle();
  expect(triggerA.isDisabled()).toBe(false);
  expect(triggerB.isDisabled()).toBe(false);

  await action.toggle();
  expect(triggerA.isDisabled()).toBe(true);
  expect(triggerB.isDisabled()).toBe(true);
});

test("non-existent trigger", async () => {
  const element = document.createElement("div");
  window.expectWarning("No trigger with ID foo");
  const action = new Enable(element, "foo");
  await window.waitFor(10);
  await action.do(); // no-op
  await action.undo(); // no-op
  await action.toggle(); // no-op
});

test("no triggers", async () => {
  // shouldn't throw
  const element = document.createElement("div");
  window.expectWarning("At least 1 ID is required");
  const action = new Enable(element);
  await action.do(); // no-op
  await action.undo(); // no-op
  await action.toggle(); // no-op
});

test("is registered", async () => {
  const element = document.createElement("div");
  const triggerA = new Trigger(element, [dummyAction], { id: "foo" });
  const triggerB = new Trigger(element, [dummyAction], { id: "bar" });

  const action = await fetchAction(element, "enable", "foo, bar");
  expect(action).toBeInstanceOf(Enable);

  await window.waitForAF();
  expect(triggerA.isDisabled()).toBe(true);
  expect(triggerB.isDisabled()).toBe(true);

  await action.do();
  expect(triggerA.isDisabled()).toBe(false);
  expect(triggerB.isDisabled()).toBe(false);
});
