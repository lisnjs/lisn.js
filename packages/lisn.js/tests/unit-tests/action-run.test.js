const { jest, test, expect } = require("@jest/globals");

const { Run, fetchAction } = window.LISN.actions;
const { Trigger } = window.LISN.triggers;

test("basic", async () => {
  const element = document.createElement("div");
  const dummyActionA = {
    do: jest.fn(),
    undo: jest.fn(),
    toggle: jest.fn(),
  };
  const dummyActionB = {
    do: jest.fn(),
    undo: jest.fn(),
    toggle: jest.fn(),
  };

  // init action first to test waiting for triggers
  const action = new Run(element, "foo", "bar");
  new Trigger(element, [dummyActionA], { id: "foo" });
  new Trigger(element, [dummyActionB], { id: "bar" });

  await action.do();
  expect(dummyActionA.do).toHaveBeenCalledTimes(1);
  expect(dummyActionB.do).toHaveBeenCalledTimes(1);
  expect(dummyActionA.undo).toHaveBeenCalledTimes(0);
  expect(dummyActionB.undo).toHaveBeenCalledTimes(0);
  expect(dummyActionA.toggle).toHaveBeenCalledTimes(0);
  expect(dummyActionB.toggle).toHaveBeenCalledTimes(0);

  await action.undo();
  expect(dummyActionA.do).toHaveBeenCalledTimes(1);
  expect(dummyActionB.do).toHaveBeenCalledTimes(1);
  expect(dummyActionA.undo).toHaveBeenCalledTimes(1);
  expect(dummyActionB.undo).toHaveBeenCalledTimes(1);
  expect(dummyActionA.toggle).toHaveBeenCalledTimes(0);
  expect(dummyActionB.toggle).toHaveBeenCalledTimes(0);

  await action.toggle();
  expect(dummyActionA.do).toHaveBeenCalledTimes(1);
  expect(dummyActionB.do).toHaveBeenCalledTimes(1);
  expect(dummyActionA.undo).toHaveBeenCalledTimes(1);
  expect(dummyActionB.undo).toHaveBeenCalledTimes(1);
  expect(dummyActionA.toggle).toHaveBeenCalledTimes(1);
  expect(dummyActionB.toggle).toHaveBeenCalledTimes(1);
});

test("non-existent trigger", async () => {
  const element = document.createElement("div");
  window.expectWarning("No trigger with ID foo");
  const action = new Run(element, "foo");
  await window.waitFor(10);
  await action.do(); // no-op
  await action.undo(); // no-op
  await action.toggle(); // no-op
});

test("no triggers", async () => {
  // shouldn't throw
  const element = document.createElement("div");
  window.expectWarning("At least 1 ID is required");
  const action = new Run(element);
  await action.do(); // no-op
  await action.undo(); // no-op
  await action.toggle(); // no-op
});

test("is registered", async () => {
  const element = document.createElement("div");
  const dummyActionA = {
    do: jest.fn(),
    undo: jest.fn(),
    toggle: jest.fn(),
  };
  const dummyActionB = {
    do: jest.fn(),
    undo: jest.fn(),
    toggle: jest.fn(),
  };

  new Trigger(element, [dummyActionA], { id: "foo" });
  new Trigger(element, [dummyActionB], { id: "bar" });
  const action = await fetchAction(element, "run", "foo, bar");
  expect(action).toBeInstanceOf(Run);

  await action.do();
  expect(dummyActionA.do).toHaveBeenCalledTimes(1);
  expect(dummyActionB.do).toHaveBeenCalledTimes(1);
  expect(dummyActionA.undo).toHaveBeenCalledTimes(0);
  expect(dummyActionB.undo).toHaveBeenCalledTimes(0);
  expect(dummyActionA.toggle).toHaveBeenCalledTimes(0);
  expect(dummyActionB.toggle).toHaveBeenCalledTimes(0);
});
