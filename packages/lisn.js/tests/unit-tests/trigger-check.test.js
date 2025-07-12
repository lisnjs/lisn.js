const { jest, describe, test, expect } = require("@jest/globals");

const { CheckTrigger } = window.LISN.triggers;
const { registerAction } = window.LISN.actions;
const { randId } = window.LISN.utils;

const newCheckbox = (type = "checkbox") => {
  const element = document.createElement("input");
  element.type = type;
  return element;
};

const toggleCheckbox = (input) => {
  input.checked = !input.checked;
  input.dispatchEvent(new Event("change"));
};

describe("CheckTrigger", () => {
  test("basic", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const element = newCheckbox();
    new CheckTrigger(element, [action]);

    await window.waitForAF();

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    toggleCheckbox(element);
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    toggleCheckbox(element);
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    toggleCheckbox(element);
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(2);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);
  });

  test("with another target", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const element = newCheckbox();
    new CheckTrigger(document.body, [action], {
      target: element,
    });

    await window.waitForAF();

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    toggleCheckbox(element);
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    toggleCheckbox(element);
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    toggleCheckbox(element);
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(2);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);
  });

  test("destroy", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const element = newCheckbox();
    const trigger = new CheckTrigger(element, [action]);

    await window.waitForAF();

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    await trigger.destroy();

    toggleCheckbox(element);
    await window.waitFor(10); // callbacks are async

    // no new calls
    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);
  });
});

describe("CheckTrigger auto-widgets", () => {
  const action = {
    do: jest.fn(),
    undo: jest.fn(),
    toggle: jest.fn(),
  };
  const actionName = randId();

  registerAction(actionName, () => action);
  const target = newCheckbox();
  target.id = randId();
  document.body.append(target);

  test("basic", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnCheck =
      `@${actionName} ` + `+id=foo +delay=10 +do-delay=15 +undo-delay=20 +once`;
    document.body.append(element);

    await window.waitForMO();

    const trigger = CheckTrigger.get(element, "foo");

    expect(trigger).toBeInstanceOf(CheckTrigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      id: "foo",
      delay: 10,
      doDelay: 15,
      undoDelay: 20,
      once: true,
    });
  });

  test("with target", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnCheck =
      `@${actionName} ` +
      `+id=foo +delay=10 +do-delay=15 +undo-delay=20 +once +target=#${target.id}`;
    document.body.append(element);

    await window.waitForMO();

    const trigger = CheckTrigger.get(element, "foo");

    expect(trigger).toBeInstanceOf(CheckTrigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      target: target,
      id: "foo",
      delay: 10,
      doDelay: 15,
      undoDelay: 20,
      once: true,
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

  test("lisn-on-check--...", async () => {
    const element = document.createElement("div");
    element.classList.add(`lisn-on-check--@${actionName}+id=foo`);
    document.body.append(element);

    await window.waitForMO();

    expect(CheckTrigger.get(element, "foo")).toBeTruthy();
  });

  test("[data-lisn-on-check='...']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnCheck = `@${actionName} +id=foo`;
    document.body.append(element);

    await window.waitForMO();

    expect(CheckTrigger.get(element, "foo")).toBeTruthy();
  });
});
