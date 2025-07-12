const { jest, describe, test, expect } = require("@jest/globals");

const { LoadTrigger } = window.LISN.triggers;
const { registerAction } = window.LISN.actions;
const { randId } = window.LISN.utils;

describe("LoadTrigger", () => {
  test("basic", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const element = document.createElement("div");
    new LoadTrigger(element, [action]);

    await window.waitForAF();

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);
  });
});

describe("auto-widgets", () => {
  const action = {
    do: jest.fn(),
    undo: jest.fn(),
    toggle: jest.fn(),
  };
  const actionName = randId();

  registerAction(actionName, () => action);

  test("basic", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnLoad =
      `@${actionName} ` +
      `+id=foo +delay=10 +do-delay=15 +undo-delay=20 +once=false`;
    document.body.append(element);

    await window.waitForMO();

    const trigger = LoadTrigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(LoadTrigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      id: "foo",
      delay: 10,
      doDelay: 15,
      undoDelay: 20,
      once: false,
    });
  });
});

describe("is registered", () => {
  const action = {
    do: jest.fn(),
    undo: jest.fn(),
    toggle: jest.fn(),
  };
  const actionName = randId();

  registerAction(actionName, () => action);

  test("lisn-on-load--...", async () => {
    const element = document.createElement("div");
    element.classList.add(`lisn-on-load--@${actionName}+id=foo`);
    document.body.append(element);

    await window.waitForMO();

    expect(LoadTrigger.get(element, "foo")).toBeTruthy();
  });

  test("[data-lisn-on-load='...']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnLoad = `${actionName} +id=foo`;
    document.body.append(element);

    await window.waitForMO();

    expect(LoadTrigger.get(element, "foo")).toBeTruthy();
  });
});
