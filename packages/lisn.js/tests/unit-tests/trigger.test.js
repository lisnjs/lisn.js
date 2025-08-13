const { jest, describe, test, expect } = require("@jest/globals");

const { Trigger, registerTrigger } = window.LISN.triggers;
const { registerAction } = window.LISN.actions;
const { randId, kebabToCamelCase } = window.LISN.utils;

const newRegisterDummies = (callableValidator = false) => {
  const action = {
    do: jest.fn(),
    undo: jest.fn(),
    toggle: jest.fn(),
  };
  const actionName = randId();

  const actionConfValidator = {
    aOpt: jest.fn((k, v) => v ?? "aDefault"),
  };

  const newAction = jest.fn(() => action);
  registerAction(
    actionName,
    newAction,
    callableValidator ? () => actionConfValidator : actionConfValidator,
  );

  const triggerName = "a" + randId(); // jsdom seems to fail randomly if it starts with a digit???

  const newTrigger = jest.fn(
    (element, args, actions, config) => new Trigger(element, actions, config),
  );

  const triggerConfValidator = {
    opt: jest.fn((k, v) => v ?? "default"),
  };

  const element = document.createElement("div");

  const actOn = document.createElement("div");
  actOn.id = randId();
  document.body.append(actOn);

  registerTrigger(
    triggerName,
    newTrigger,
    callableValidator ? () => triggerConfValidator : triggerConfValidator,
  );

  return {
    actionName,
    newAction,
    actionConfValidator,
    action,
    triggerName,
    newTrigger,
    triggerConfValidator,
    element,
    actOn,
  };
};

describe("Trigger", () => {
  test("basic", async () => {
    const actionA = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const actionB = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const trigger = new Trigger(document.body, [actionA, actionB]);

    await null; // callback is async

    expect(actionA.do).toHaveBeenCalledTimes(0);
    expect(actionA.undo).toHaveBeenCalledTimes(0);
    expect(actionA.toggle).toHaveBeenCalledTimes(0);
    expect(actionB.do).toHaveBeenCalledTimes(0);
    expect(actionB.undo).toHaveBeenCalledTimes(0);
    expect(actionB.toggle).toHaveBeenCalledTimes(0);

    await trigger.run();

    expect(actionA.do).toHaveBeenCalledTimes(1);
    expect(actionA.undo).toHaveBeenCalledTimes(0);
    expect(actionA.toggle).toHaveBeenCalledTimes(0);
    expect(actionB.do).toHaveBeenCalledTimes(1);
    expect(actionB.undo).toHaveBeenCalledTimes(0);
    expect(actionB.toggle).toHaveBeenCalledTimes(0);

    await trigger.run();

    expect(actionA.do).toHaveBeenCalledTimes(2);
    expect(actionA.undo).toHaveBeenCalledTimes(0);
    expect(actionA.toggle).toHaveBeenCalledTimes(0);
    expect(actionB.do).toHaveBeenCalledTimes(2);
    expect(actionB.undo).toHaveBeenCalledTimes(0);
    expect(actionB.toggle).toHaveBeenCalledTimes(0);

    await trigger.reverse();

    expect(actionA.do).toHaveBeenCalledTimes(2);
    expect(actionA.undo).toHaveBeenCalledTimes(1);
    expect(actionA.toggle).toHaveBeenCalledTimes(0);
    expect(actionB.do).toHaveBeenCalledTimes(2);
    expect(actionB.undo).toHaveBeenCalledTimes(1);
    expect(actionB.toggle).toHaveBeenCalledTimes(0);

    await trigger.toggle();

    expect(actionA.do).toHaveBeenCalledTimes(2);
    expect(actionA.undo).toHaveBeenCalledTimes(1);
    expect(actionA.toggle).toHaveBeenCalledTimes(1);
    expect(actionB.do).toHaveBeenCalledTimes(2);
    expect(actionB.undo).toHaveBeenCalledTimes(1);
    expect(actionB.toggle).toHaveBeenCalledTimes(1);

    await trigger.toggle();

    expect(actionA.do).toHaveBeenCalledTimes(2);
    expect(actionA.undo).toHaveBeenCalledTimes(1);
    expect(actionA.toggle).toHaveBeenCalledTimes(2);
    expect(actionB.do).toHaveBeenCalledTimes(2);
    expect(actionB.undo).toHaveBeenCalledTimes(1);
    expect(actionB.toggle).toHaveBeenCalledTimes(2);

    await trigger.reverse();

    expect(actionA.do).toHaveBeenCalledTimes(2);
    expect(actionA.undo).toHaveBeenCalledTimes(2);
    expect(actionA.toggle).toHaveBeenCalledTimes(2);
    expect(actionB.do).toHaveBeenCalledTimes(2);
    expect(actionB.undo).toHaveBeenCalledTimes(2);
    expect(actionB.toggle).toHaveBeenCalledTimes(2);
  });

  test("with once v1", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const trigger = new Trigger(document.body, [action], {
      once: true,
    });

    // DO ----
    await trigger.run();

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    // UNDO ----
    await window.waitForAF(); // onDestroy callbacks are called asynchronously
    expect(trigger.isDestroyed()).toBe(true);
    await expect(trigger.reverse()).rejects.toThrow(
      /Callback has been removed/,
    );

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(0); // it's done
    expect(action.toggle).toHaveBeenCalledTimes(0);

    // TOGGLE ----
    await expect(trigger.toggle()).rejects.toThrow(/Callback has been removed/);

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0); // it's done
  });

  test("with once v2", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const trigger = new Trigger(document.body, [action], {
      once: true,
    });

    // UNDO ----
    await trigger.reverse();

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    // TOGGLE ----
    await trigger.toggle();

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(1);

    // DO ----
    await window.waitForAF(); // onDestroy callbacks are called asynchronously
    expect(trigger.isDestroyed()).toBe(true);
    await expect(trigger.run()).rejects.toThrow(/Callback has been removed/);

    expect(action.do).toHaveBeenCalledTimes(0); // it's done
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(1);
  });

  test("with once v3", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const trigger = new Trigger(document.body, [action], {
      once: true,
    });

    // TOGGLE ----
    await trigger.toggle();

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(1);

    // DO ----
    await window.waitForAF(); // onDestroy callbacks are called asynchronously
    expect(trigger.isDestroyed()).toBe(true);
    await expect(trigger.run()).rejects.toThrow(/Callback has been removed/);

    expect(action.do).toHaveBeenCalledTimes(0); // it's done
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(1);

    // UNDO ----
    await expect(trigger.reverse()).rejects.toThrow(
      /Callback has been removed/,
    );

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0); // it's done
    expect(action.toggle).toHaveBeenCalledTimes(1);
  });

  test("with oneWay", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const trigger = new Trigger(document.body, [action], {
      oneWay: true,
    });

    // DO ----
    await trigger.run();

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    // UNDO ----
    await trigger.reverse(); // no-op

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    // TOGGLE ----
    await trigger.toggle(); // run

    expect(action.do).toHaveBeenCalledTimes(2);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    // TOGGLE AGAIN ----
    await trigger.toggle(); // run

    expect(action.do).toHaveBeenCalledTimes(3);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);
  });

  test("with delay", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const trigger = new Trigger(document.body, [action], {
      delay: 100,
    });

    // DO ----
    await trigger.run();
    await window.waitFor(80);

    expect(action.do).toHaveBeenCalledTimes(0); // not yet
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    await window.waitFor(30); // + 110

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    // UNDO ----
    await trigger.reverse();
    await window.waitFor(80);

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(0); // not yet
    expect(action.toggle).toHaveBeenCalledTimes(0);

    await window.waitFor(30); // + 110

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    // TOGGLE ----
    await trigger.toggle();
    await window.waitFor(80);

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0); // not yet

    await window.waitFor(30); // + 110

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(1);
  });

  test("with doDelay", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const trigger = new Trigger(document.body, [action], {
      doDelay: 100,
      // undoDelay default to 0
    });

    // DO ----
    await trigger.run();
    await window.waitFor(80);

    expect(action.do).toHaveBeenCalledTimes(0); // not yet
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    await window.waitFor(30); // + 110

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    // UNDO ----
    await trigger.reverse();

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    // TOGGLE ----
    await trigger.toggle(); // next uses doDelay (100)
    await window.waitFor(80);

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0); // not yet

    await window.waitFor(30); // + 110

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(1);

    // TOGGLE ----
    await trigger.toggle(); // next uses undoDelay (0)

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(2);

    // DO ----
    await trigger.run();
    await window.waitFor(80);

    expect(action.do).toHaveBeenCalledTimes(1); // not yet
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(2);

    await window.waitFor(30); // + 110

    expect(action.do).toHaveBeenCalledTimes(2);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(2);

    // TOGGLE ----
    await trigger.toggle(); // next uses undoDelay again since it's after do

    expect(action.do).toHaveBeenCalledTimes(2);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(3);
  });

  test("with undoDelay", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const trigger = new Trigger(document.body, [action], {
      undoDelay: 100,
      // doDelay default to 0
    });

    // DO ----
    await trigger.run();

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    // UNDO ----
    await trigger.reverse();
    await window.waitFor(80);

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(0); // not yet
    expect(action.toggle).toHaveBeenCalledTimes(0);

    await window.waitFor(30); // + 110

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    // TOGGLE ----
    await trigger.toggle(); // next uses doDelay (0)

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(1);

    // TOGGLE ----
    await trigger.toggle(); // next uses undoDelay (100)
    await window.waitFor(80);

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(1); // not yet

    await window.waitFor(30); // + 110

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(2);

    // DO ----
    await trigger.run();
    expect(action.do).toHaveBeenCalledTimes(2);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(2);

    // TOGGLE ----
    await trigger.toggle(); // next uses undoDelay again since it's after do
    await window.waitFor(80);

    expect(action.do).toHaveBeenCalledTimes(2);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(2); // not yet

    await window.waitFor(30); // + 110

    expect(action.do).toHaveBeenCalledTimes(2);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(3);
  });

  test("enable/disable", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const trigger = new Trigger(document.body, [action]);

    trigger.disable();
    await trigger.run();
    await trigger.reverse();
    await trigger.toggle();

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    trigger.enable();
    await trigger.run();
    await trigger.reverse();
    await trigger.toggle();

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(1);
  });

  test("destroy", async () => {
    const actionA = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const actionB = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const trigger = new Trigger(document.body, [actionA, actionB]);

    await null; // callback is async

    expect(actionA.do).toHaveBeenCalledTimes(0);
    expect(actionA.undo).toHaveBeenCalledTimes(0);
    expect(actionA.toggle).toHaveBeenCalledTimes(0);
    expect(actionB.do).toHaveBeenCalledTimes(0);
    expect(actionB.undo).toHaveBeenCalledTimes(0);
    expect(actionB.toggle).toHaveBeenCalledTimes(0);

    await trigger.destroy();

    await expect(trigger.run).rejects.toThrow(/Callback has been removed/);
    await expect(trigger.reverse).rejects.toThrow(/Callback has been removed/);
    await expect(trigger.toggle).rejects.toThrow(/Callback has been removed/);

    // no new calls
    expect(actionA.do).toHaveBeenCalledTimes(0);
    expect(actionA.undo).toHaveBeenCalledTimes(0);
    expect(actionA.toggle).toHaveBeenCalledTimes(0);
    expect(actionB.do).toHaveBeenCalledTimes(0);
    expect(actionB.undo).toHaveBeenCalledTimes(0);
    expect(actionB.toggle).toHaveBeenCalledTimes(0);
  });
});

describe("Trigger.get", () => {
  const action = {
    do: jest.fn(),
    undo: jest.fn(),
    toggle: jest.fn(),
  };
  test("no ID", async () => {
    new Trigger(document.body, [action]);
    expect(Trigger.get(document.body, "")).toBe(null);
  });

  test("blank ID", async () => {
    new Trigger(document.body, [action], { id: "" });
    expect(Trigger.get(document.body, "")).toBe(null);
  });

  test("with ID", async () => {
    const trigger = new Trigger(document.body, [action], { id: "foo" });
    expect(Trigger.get(document.body, "foo")).toBe(trigger);

    await trigger.destroy();
    expect(Trigger.get(document.body, "foo")).toBe(null);
  });
});

test("auto-widgets", async () => {
  const action = {
    do: jest.fn(),
    undo: jest.fn(),
    toggle: jest.fn(),
  };
  const actionName = randId();

  registerAction(actionName, () => action);
  const element = document.createElement("div");
  element.dataset.lisnOnRun =
    `@${actionName} ` + `+id=foo +delay=10 +do-delay=15 +undo-delay=20 +once`;
  document.body.append(element);

  await window.waitForMO();

  const trigger = Trigger.get(element, "foo");
  expect(trigger).toBeInstanceOf(Trigger);
  expect(trigger.getActions()).toEqual([action]);
  expect(trigger.getConfig()).toEqual({
    id: "foo",
    delay: 10,
    doDelay: 15,
    undoDelay: 20,
    once: true,
  });
});

describe("registerTrigger", () => {
  test("basic", async () => {
    const {
      actionName,
      newAction,
      actionConfValidator,
      action,
      triggerName,
      newTrigger,
      triggerConfValidator,
      element,
    } = newRegisterDummies();

    element.dataset[kebabToCamelCase("lisn-on-" + triggerName)] =
      `@${actionName}`;
    document.body.append(element);

    await window.waitForMO();

    expect(newAction).toHaveBeenCalledTimes(1);
    expect(newAction).toHaveBeenCalledWith(element, [], { aOpt: "aDefault" });
    expect(actionConfValidator.aOpt).toHaveBeenCalledTimes(1);

    expect(newTrigger).toHaveBeenCalledTimes(1);
    expect(newTrigger).toHaveBeenCalledWith(element, [], [action], {
      opt: "default",
    });
    expect(triggerConfValidator.opt).toHaveBeenCalledTimes(1);
  });

  test("with action args and options", async () => {
    const {
      actionName,
      newAction,
      actionConfValidator,
      action,
      triggerName,
      newTrigger,
      triggerConfValidator,
      element,
    } = newRegisterDummies();

    element.dataset[kebabToCamelCase("lisn-on-" + triggerName)] =
      `@${actionName}:arg,aOpt=foo,random=bar`;
    document.body.append(element);

    await window.waitForMO();

    expect(newAction).toHaveBeenCalledTimes(1);
    expect(newAction).toHaveBeenCalledWith(element, ["arg"], {
      aOpt: "foo",
    });
    expect(actionConfValidator.aOpt).toHaveBeenCalledTimes(1);

    expect(newTrigger).toHaveBeenCalledTimes(1);
    expect(newTrigger).toHaveBeenCalledWith(element, [], [action], {
      opt: "default",
    });
    expect(triggerConfValidator.opt).toHaveBeenCalledTimes(1);
  });

  test("with action args and options (extra spaces)", async () => {
    const {
      actionName,
      newAction,
      actionConfValidator,
      action,
      triggerName,
      newTrigger,
      triggerConfValidator,
      element,
    } = newRegisterDummies();

    element.dataset[kebabToCamelCase("lisn-on-" + triggerName)] =
      `@ ${actionName} : arg , aOpt = foo , random = bar`;
    document.body.append(element);

    await window.waitForMO();

    expect(newAction).toHaveBeenCalledTimes(1);
    expect(newAction).toHaveBeenCalledWith(element, ["arg"], {
      aOpt: "foo",
    });
    expect(actionConfValidator.aOpt).toHaveBeenCalledTimes(1);

    expect(newTrigger).toHaveBeenCalledTimes(1);
    expect(newTrigger).toHaveBeenCalledWith(element, [], [action], {
      opt: "default",
    });
    expect(triggerConfValidator.opt).toHaveBeenCalledTimes(1);
  });

  test("with duplicate action name", async () => {
    const {
      actionName,
      newAction,
      actionConfValidator,
      action,
      triggerName,
      newTrigger,
      triggerConfValidator,
      element,
    } = newRegisterDummies();

    element.dataset[kebabToCamelCase("lisn-on-" + triggerName)] =
      `@${actionName} @${actionName}:arg`;
    document.body.append(element);

    await window.waitForMO();

    expect(newAction).toHaveBeenCalledTimes(2);
    expect(newAction).toHaveBeenCalledWith(element, [], { aOpt: "aDefault" });
    expect(newAction).toHaveBeenCalledWith(element, ["arg"], {
      aOpt: "aDefault",
    });
    expect(actionConfValidator.aOpt).toHaveBeenCalledTimes(2);

    expect(newTrigger).toHaveBeenCalledTimes(1);
    expect(newTrigger).toHaveBeenCalledWith(element, [], [action, action], {
      opt: "default",
    });
    expect(triggerConfValidator.opt).toHaveBeenCalledTimes(1);
  });

  test("with custom opt", async () => {
    const {
      actionName,
      action,
      triggerName,
      newTrigger,
      triggerConfValidator,
      element,
    } = newRegisterDummies();

    element.dataset[kebabToCamelCase("lisn-on-" + triggerName)] =
      `@${actionName} +opt=bar +unknown=foo`;
    document.body.append(element);

    await window.waitForMO();

    expect(newTrigger).toHaveBeenCalledTimes(1);
    expect(newTrigger).toHaveBeenCalledWith(element, [], [action], {
      opt: "bar",
    });
    expect(triggerConfValidator.opt).toHaveBeenCalledTimes(1);
  });

  test("with callable config validator", async () => {
    const {
      actionName,
      newAction,
      actionConfValidator,
      action,
      triggerName,
      newTrigger,
      triggerConfValidator,
      element,
    } = newRegisterDummies(true);

    element.dataset[kebabToCamelCase("lisn-on-" + triggerName)] =
      `@${actionName}: arg, aOpt=foo, random=bar +opt=bar +unknown=foo`;
    document.body.append(element);

    await window.waitForMO();

    expect(newAction).toHaveBeenCalledTimes(1);
    expect(newAction).toHaveBeenCalledWith(element, ["arg"], {
      aOpt: "foo",
    });
    expect(actionConfValidator.aOpt).toHaveBeenCalledTimes(1);

    expect(newTrigger).toHaveBeenCalledTimes(1);
    expect(newTrigger).toHaveBeenCalledWith(element, [], [action], {
      opt: "bar",
    });
    expect(triggerConfValidator.opt).toHaveBeenCalledTimes(1);
  });

  test("with class name", async () => {
    const {
      actionName,
      action,
      triggerName,
      newTrigger,
      triggerConfValidator,
      element,
    } = newRegisterDummies();

    element.classList.add(`lisn-on-${triggerName}--@${actionName}+id=foo`);
    document.body.append(element);

    await window.waitForMO();

    expect(newTrigger).toHaveBeenCalledTimes(1);
    expect(newTrigger).toHaveBeenCalledWith(element, [], [action], {
      opt: "default",
      id: "foo",
    });
    expect(triggerConfValidator.opt).toHaveBeenCalledTimes(1);

    const trigger = Trigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(Trigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      opt: "default",
      id: "foo",
    });
  });

  test("with multiple triggers: 2 classes and 2 attrs values", async () => {
    const {
      actionName,
      action,
      triggerName,
      newTrigger,
      triggerConfValidator,
      element,
    } = newRegisterDummies();

    element.classList.add(
      `lisn-on-${triggerName}--@${actionName}+id=multi-foo`,
    );
    element.classList.add(
      `lisn-on-${triggerName}--@${actionName}+id=multi-bar`,
    );
    element.dataset[kebabToCamelCase("lisn-on-" + triggerName)] =
      `@${actionName} +id=multi-baz ; @${actionName} +id=multi-bla`;
    document.body.append(element);

    await window.waitForMO();

    expect(newTrigger).toHaveBeenCalledTimes(4);
    expect(triggerConfValidator.opt).toHaveBeenCalledTimes(4);

    for (const id of ["foo", "bar", "baz", "bla"]) {
      expect(newTrigger).toHaveBeenCalledWith(element, [], [action], {
        opt: "default",
        id: "multi-" + id,
      });

      const trigger = Trigger.get(element, "multi-" + id);
      expect(trigger).toBeInstanceOf(Trigger);
      expect(trigger.getActions()).toEqual([action]);
      expect(trigger.getConfig()).toEqual({
        opt: "default",
        id: "multi-" + id,
      });
    }
  });

  test("with id", async () => {
    const {
      actionName,
      action,
      triggerName,
      newTrigger,
      triggerConfValidator,
      element,
    } = newRegisterDummies();

    element.dataset[kebabToCamelCase("lisn-on-" + triggerName)] =
      `@${actionName} +id=foo`;
    document.body.append(element);

    await window.waitForMO();

    expect(newTrigger).toHaveBeenCalledTimes(1);
    expect(newTrigger).toHaveBeenCalledWith(element, [], [action], {
      opt: "default",
      id: "foo",
    });
    expect(triggerConfValidator.opt).toHaveBeenCalledTimes(1);

    const trigger = Trigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(Trigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      opt: "default",
      id: "foo",
    });
  });

  test("with once", async () => {
    const {
      actionName,
      action,
      triggerName,
      newTrigger,
      triggerConfValidator,
      element,
    } = newRegisterDummies();

    element.dataset[kebabToCamelCase("lisn-on-" + triggerName)] =
      `@${actionName} +id=foo +once`;
    document.body.append(element);

    await window.waitForMO();

    expect(newTrigger).toHaveBeenCalledTimes(1);
    expect(newTrigger).toHaveBeenCalledWith(element, [], [action], {
      opt: "default",
      id: "foo",
      once: true,
    });
    expect(triggerConfValidator.opt).toHaveBeenCalledTimes(1);

    const trigger = Trigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(Trigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      opt: "default",
      id: "foo",
      once: true,
    });
  });

  test("with once=true", async () => {
    const {
      actionName,
      action,
      triggerName,
      newTrigger,
      triggerConfValidator,
      element,
    } = newRegisterDummies();

    element.dataset[kebabToCamelCase("lisn-on-" + triggerName)] =
      `@${actionName} +id=foo +once=true`;
    document.body.append(element);

    await window.waitForMO();

    expect(newTrigger).toHaveBeenCalledTimes(1);
    expect(newTrigger).toHaveBeenCalledWith(element, [], [action], {
      opt: "default",
      id: "foo",
      once: true,
    });
    expect(triggerConfValidator.opt).toHaveBeenCalledTimes(1);

    const trigger = Trigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(Trigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      opt: "default",
      id: "foo",
      once: true,
    });
  });

  test("with once=false", async () => {
    const {
      actionName,
      action,
      triggerName,
      newTrigger,
      triggerConfValidator,
      element,
    } = newRegisterDummies();

    element.dataset[kebabToCamelCase("lisn-on-" + triggerName)] =
      `@${actionName} +id=foo +once=false`;
    document.body.append(element);

    await window.waitForMO();

    expect(newTrigger).toHaveBeenCalledTimes(1);
    expect(newTrigger).toHaveBeenCalledWith(element, [], [action], {
      opt: "default",
      id: "foo",
      once: false,
    });
    expect(triggerConfValidator.opt).toHaveBeenCalledTimes(1);

    const trigger = Trigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(Trigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      opt: "default",
      id: "foo",
      once: false,
    });
  });

  test("with action target", async () => {
    const {
      actionName,
      newAction,
      actionConfValidator,
      action,
      triggerName,
      newTrigger,
      triggerConfValidator,
      element,
      actOn,
    } = newRegisterDummies();

    element.dataset[kebabToCamelCase("lisn-on-" + triggerName)] =
      `@${actionName} ` + `+id=foo +act-on=#${actOn.id}`;
    document.body.append(element);

    await window.waitForMO();

    expect(newAction).toHaveBeenCalledTimes(1);
    expect(newAction).toHaveBeenCalledWith(actOn, [], { aOpt: "aDefault" });
    expect(actionConfValidator.aOpt).toHaveBeenCalledTimes(1);

    expect(newTrigger).toHaveBeenCalledTimes(1);
    expect(newTrigger).toHaveBeenCalledWith(element, [], [action], {
      opt: "default",
      id: "foo",
      actOn: actOn,
    });
    expect(triggerConfValidator.opt).toHaveBeenCalledTimes(1);

    const trigger = Trigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(Trigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      opt: "default",
      id: "foo",
      actOn: actOn,
    });

    actOn.remove();
  });

  test("with all other options", async () => {
    const {
      actionName,
      action,
      triggerName,
      newTrigger,
      triggerConfValidator,
      element,
      actOn,
    } = newRegisterDummies();

    element.dataset[kebabToCamelCase("lisn-on-" + triggerName)] =
      `@${actionName} ` +
      `+id=foo +opt=bar +delay=10 +do-delay=15 +undo-delay=20 +once +one-way=false +act-on=#${actOn.id}`;
    document.body.append(element);

    await window.waitForMO();

    expect(newTrigger).toHaveBeenCalledTimes(1);
    expect(newTrigger).toHaveBeenCalledWith(element, [], [action], {
      opt: "bar",
      id: "foo",
      delay: 10,
      doDelay: 15,
      undoDelay: 20,
      once: true,
      oneWay: false,
      actOn: actOn,
    });
    expect(triggerConfValidator.opt).toHaveBeenCalledTimes(1);

    const trigger = Trigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(Trigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      opt: "bar",
      id: "foo",
      delay: 10,
      doDelay: 15,
      undoDelay: 20,
      once: true,
      oneWay: false,
      actOn: actOn,
    });
  });

  test("with all options (camelCase)", async () => {
    const {
      actionName,
      action,
      triggerName,
      newTrigger,
      triggerConfValidator,
      element,
      actOn,
    } = newRegisterDummies();

    element.dataset[kebabToCamelCase("lisn-on-" + triggerName)] =
      `@${actionName} ` +
      `+id=foo +opt=bar +delay=10 +doDelay=15 +undoDelay=20 +once +oneWay=false +actOn=#${actOn.id}`;
    document.body.append(element);

    await window.waitForMO();

    expect(newTrigger).toHaveBeenCalledTimes(1);
    expect(newTrigger).toHaveBeenCalledWith(element, [], [action], {
      opt: "bar",
      id: "foo",
      delay: 10,
      doDelay: 15,
      undoDelay: 20,
      once: true,
      oneWay: false,
      actOn: actOn,
    });
    expect(triggerConfValidator.opt).toHaveBeenCalledTimes(1);

    const trigger = Trigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(Trigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      opt: "bar",
      id: "foo",
      delay: 10,
      doDelay: 15,
      undoDelay: 20,
      once: true,
      oneWay: false,
      actOn: actOn,
    });
  });

  test("with all options (no spaces)", async () => {
    const {
      actionName,
      action,
      triggerName,
      newTrigger,
      triggerConfValidator,
      element,
      actOn,
    } = newRegisterDummies();

    element.dataset[kebabToCamelCase("lisn-on-" + triggerName)] =
      `@${actionName}` +
      `+id=foo+opt=bar+delay=10+do-delay=15+undo-delay=20+once+one-way=false +act-on=#${actOn.id}`;
    document.body.append(element);

    await window.waitForMO();

    expect(newTrigger).toHaveBeenCalledTimes(1);
    expect(newTrigger).toHaveBeenCalledWith(element, [], [action], {
      opt: "bar",
      id: "foo",
      delay: 10,
      doDelay: 15,
      undoDelay: 20,
      once: true,
      oneWay: false,
      actOn: actOn,
    });
    expect(triggerConfValidator.opt).toHaveBeenCalledTimes(1);

    const trigger = Trigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(Trigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      opt: "bar",
      id: "foo",
      delay: 10,
      doDelay: 15,
      undoDelay: 20,
      once: true,
      oneWay: false,
      actOn: actOn,
    });
  });

  test("with all options (extra spaces)", async () => {
    const {
      actionName,
      action,
      triggerName,
      newTrigger,
      triggerConfValidator,
      element,
      actOn,
    } = newRegisterDummies();

    element.dataset[kebabToCamelCase("lisn-on-" + triggerName)] =
      ` @${actionName}    ` +
      `+ id = foo   + opt = bar   + delay = 10   + do-delay = 15   ` +
      `+ undo-delay = 20   + once + one-way = false +act-on=#${actOn.id}`;
    document.body.append(element);

    await window.waitForMO();

    expect(newTrigger).toHaveBeenCalledTimes(1);
    expect(newTrigger).toHaveBeenCalledWith(element, [], [action], {
      opt: "bar",
      id: "foo",
      delay: 10,
      doDelay: 15,
      undoDelay: 20,
      once: true,
      oneWay: false,
      actOn: actOn,
    });
    expect(triggerConfValidator.opt).toHaveBeenCalledTimes(1);

    const trigger = Trigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(Trigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      opt: "bar",
      id: "foo",
      delay: 10,
      doDelay: 15,
      undoDelay: 20,
      once: true,
      oneWay: false,
      actOn: actOn,
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

  test("lisn-on-run--...", async () => {
    const element = document.createElement("div");
    element.classList.add(`lisn-on-run--@${actionName}+id=foo`);
    document.body.append(element);

    await window.waitForMO();

    expect(Trigger.get(element, "foo")).toBeTruthy();
  });

  test("[data-lisn-on-run='...']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnRun = `@${actionName} +id=foo`;
    document.body.append(element);

    await window.waitForMO();

    expect(Trigger.get(element, "foo")).toBeTruthy();
  });
});
