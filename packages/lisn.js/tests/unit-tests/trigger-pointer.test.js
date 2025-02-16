const { jest, describe, test, expect } = require("@jest/globals");

const { ClickTrigger, HoverTrigger, PressTrigger } = window.LISN.triggers;
const { registerAction } = window.LISN.actions;
const { randId } = window.LISN.utils;

describe("ClickTrigger", () => {
  test("basic", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const element = document.createElement("div");
    new ClickTrigger(element, [action]);

    await window.waitForAF();

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newClick());
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(1);

    element.dispatchEvent(window.newClick());
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(2);

    element.dispatchEvent(window.newClick());
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(3);
  });

  test("with another target", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const element = document.createElement("div");
    new ClickTrigger(document.body, [action], {
      target: element,
    });

    await window.waitForAF();

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newClick());
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(1);

    element.dispatchEvent(window.newClick());
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(2);

    element.dispatchEvent(window.newClick());
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(3);
  });
});

describe("ClickTrigger auto-widgets", () => {
  const action = {
    do: jest.fn(),
    undo: jest.fn(),
    toggle: jest.fn(),
  };
  const actionName = randId();

  registerAction(actionName, () => action);
  const target = document.createElement("div");
  target.id = randId();
  document.body.append(target);

  test("basic", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnClick =
      `@${actionName} ` + `+id=foo +delay=10 +do-delay=15 +undo-delay=20 +once`;
    document.body.append(element);

    await window.waitForMO();

    const trigger = ClickTrigger.get(element, "foo");

    expect(trigger).toBeInstanceOf(ClickTrigger);
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
    element.dataset.lisnOnClick =
      `@${actionName} ` +
      `+id=foo +delay=10 +do-delay=15 +undo-delay=20 +once +target=#${target.id}`;
    document.body.append(element);

    await window.waitForMO();

    const trigger = ClickTrigger.get(element, "foo");

    expect(trigger).toBeInstanceOf(ClickTrigger);
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

describe("HoverTrigger", () => {
  test("basic", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const element = document.createElement("div");
    new HoverTrigger(element, [action]);

    await window.waitForAF();

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newMouse("enter"));
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newMouse("leave"));
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newMouse("enter"));
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

    const element = document.createElement("div");
    new HoverTrigger(document.body, [action], {
      target: element,
    });

    await window.waitForAF();

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newMouse("enter"));
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newMouse("leave"));
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newMouse("enter"));
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(2);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);
  });
});

describe("HoverTrigger auto-widgets", () => {
  const action = {
    do: jest.fn(),
    undo: jest.fn(),
    toggle: jest.fn(),
  };
  const actionName = randId();

  registerAction(actionName, () => action);
  const target = document.createElement("div");
  target.id = randId();
  document.body.append(target);

  test("basic", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnHover =
      `@${actionName} ` + `+id=foo +delay=10 +do-delay=15 +undo-delay=20 +once`;
    document.body.append(element);

    await window.waitForMO();

    const trigger = HoverTrigger.get(element, "foo");

    expect(trigger).toBeInstanceOf(HoverTrigger);
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
    element.dataset.lisnOnHover =
      `@${actionName} ` +
      `+id=foo +delay=10 +do-delay=15 +undo-delay=20 +once +target=#${target.id}`;
    document.body.append(element);

    await window.waitForMO();

    const trigger = HoverTrigger.get(element, "foo");

    expect(trigger).toBeInstanceOf(HoverTrigger);
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

describe("PressTrigger", () => {
  test("basic", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const element = document.createElement("div");
    new PressTrigger(element, [action]);

    await window.waitForAF();

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newMouse("down"));
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newMouse("up"));
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newMouse("down"));
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

    const element = document.createElement("div");
    new PressTrigger(document.body, [action], {
      target: element,
    });

    await window.waitForAF();

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newMouse("down"));
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newMouse("up"));
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.dispatchEvent(window.newMouse("down"));
    await window.waitFor(10); // callbacks are async

    expect(action.do).toHaveBeenCalledTimes(2);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);
  });
});

describe("PressTrigger auto-widgets", () => {
  const action = {
    do: jest.fn(),
    undo: jest.fn(),
    toggle: jest.fn(),
  };
  const actionName = randId();

  registerAction(actionName, () => action);
  const target = document.createElement("div");
  target.id = randId();
  document.body.append(target);

  test("basic", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnPress =
      `@${actionName} ` + `+id=foo +delay=10 +do-delay=15 +undo-delay=20 +once`;
    document.body.append(element);

    await window.waitForMO();

    const trigger = PressTrigger.get(element, "foo");

    expect(trigger).toBeInstanceOf(PressTrigger);
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
    element.dataset.lisnOnPress =
      `@${actionName} ` +
      `+id=foo +delay=10 +do-delay=15 +undo-delay=20 +once +target=#${target.id}`;
    document.body.append(element);

    await window.waitForMO();

    const trigger = PressTrigger.get(element, "foo");

    expect(trigger).toBeInstanceOf(PressTrigger);
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

describe("ClickTrigger is registered", () => {
  const action = {
    do: jest.fn(),
    undo: jest.fn(),
    toggle: jest.fn(),
  };
  const actionName = randId();

  registerAction(actionName, () => action);

  test("lisn-on-click--...", async () => {
    const element = document.createElement("div");
    element.classList.add(`lisn-on-click--@${actionName}+id=foo`);
    document.body.append(element);

    await window.waitForMO();

    expect(ClickTrigger.get(element, "foo")).toBeTruthy();
  });

  test("[data-lisn-on-click='...']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnClick = `@${actionName} +id=foo`;
    document.body.append(element);

    await window.waitForMO();

    expect(ClickTrigger.get(element, "foo")).toBeTruthy();
  });
});

describe("HoverTrigger is registered", () => {
  const action = {
    do: jest.fn(),
    undo: jest.fn(),
    toggle: jest.fn(),
  };
  const actionName = randId();

  registerAction(actionName, () => action);

  test("lisn-on-hover--...", async () => {
    const element = document.createElement("div");
    element.classList.add(`lisn-on-hover--@${actionName}+id=foo`);
    document.body.append(element);

    await window.waitForMO();

    expect(HoverTrigger.get(element, "foo")).toBeTruthy();
  });

  test("[data-lisn-on-hover='...']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnHover = `@${actionName} +id=foo`;
    document.body.append(element);

    await window.waitForMO();

    expect(HoverTrigger.get(element, "foo")).toBeTruthy();
  });
});

describe("PressTrigger is registered", () => {
  const action = {
    do: jest.fn(),
    undo: jest.fn(),
    toggle: jest.fn(),
  };
  const actionName = randId();

  registerAction(actionName, () => action);

  test("lisn-on-press--...", async () => {
    const element = document.createElement("div");
    element.classList.add(`lisn-on-press--@${actionName}+id=foo`);
    document.body.append(element);

    await window.waitForMO();

    expect(PressTrigger.get(element, "foo")).toBeTruthy();
  });

  test("[data-lisn-on-press='...']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnPress = `@${actionName} +id=foo`;
    document.body.append(element);

    await window.waitForMO();

    expect(PressTrigger.get(element, "foo")).toBeTruthy();
  });
});
