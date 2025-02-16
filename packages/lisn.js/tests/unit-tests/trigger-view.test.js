const { jest, beforeAll, describe, test, expect } = require("@jest/globals");

const { ViewTrigger } = window.LISN.triggers;
const { registerAction } = window.LISN.actions;
const { fetchViewportOverlay, randId } = window.LISN.utils;

let viewportOverlay;

// set non-0 size for window and document
document.documentElement.resize([800, 400], [400, 200]);
beforeAll(async () => {
  viewportOverlay = await fetchViewportOverlay();
  viewportOverlay.resize([400, 200]);
  await window.waitFor(100);
});

const newElement = () => {
  const element = document.createElement("div");
  element.resize([400, 100]); // set default size

  document.body.append(element);

  // needs to be called after ViewWatcher is setup for the element
  const getObserver = () => {
    const observers = window.IntersectionObserver.instances.get(element);
    if (observers === undefined) {
      throw "Can't find observer";
    } else if (observers.size > 1) {
      throw "Got multiple observers";
    }

    return Array.from(observers)[0];
  };

  return { element, getObserver };
};

describe("ViewTrigger", () => {
  test("basic", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const { element, getObserver } = newElement();

    new ViewTrigger(element, [action]);

    await window.waitForVW();
    const observer = getObserver();

    expect(action.do).toHaveBeenCalledTimes(1); // default initial view is at
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    observer.trigger(element, ["above"]);
    await window.waitForVW();

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    observer.trigger(element, ["at"]);
    await window.waitForVW();

    expect(action.do).toHaveBeenCalledTimes(2);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    observer.trigger(element, ["below"]);
    await window.waitForVW();

    expect(action.do).toHaveBeenCalledTimes(2);
    expect(action.undo).toHaveBeenCalledTimes(2);
    expect(action.toggle).toHaveBeenCalledTimes(0);
  });

  test("non-default view", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const { element, getObserver } = newElement();

    new ViewTrigger(element, [action], {
      views: "above",
    });

    await window.waitForVW();
    const observer = getObserver();

    expect(action.do).toHaveBeenCalledTimes(0); // default initial view is at
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    observer.trigger(element, ["above"]);
    await window.waitForVW();

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    observer.trigger(element, ["at"]);
    await window.waitForVW();

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(2);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    observer.trigger(element, ["below"]);
    await window.waitForVW();

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(3); // TODO ideally we don't get a call here
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
  const ref = document.createElement("div");
  ref.id = randId();
  document.body.append(ref);

  const root = document.createElement("div");
  root.id = randId();
  document.body.append(root);

  test("invalid view", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnView = `foo @${actionName} +id=foo`;
    window.expectError(/Invalid value for 'views'/);
    document.body.append(element);

    await window.waitForMO();

    expect(ViewTrigger.get(element, "foo")).toBe(null);
  });

  test("basic: missing views", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnView = `@${actionName} +id=foo`;
    document.body.append(element);

    await window.waitForMO();

    const trigger = ViewTrigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(ViewTrigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      id: "foo",
    });
  });

  test("basic: with 1 view", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnView = `above @${actionName} +id=foo`;
    document.body.append(element);

    await window.waitForMO();

    const trigger = ViewTrigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(ViewTrigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      views: ["above"],
      id: "foo",
    });
  });

  test("basic: with 2 views", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnView = `above,at @${actionName} +id=foo`;
    document.body.append(element);

    await window.waitForMO();

    const trigger = ViewTrigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(ViewTrigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      views: ["above", "at"],
      id: "foo",
    });
  });

  test("with root", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnView = `above,at @${actionName} +id=foo +root=#${root.id}`;
    document.body.append(element);

    await window.waitForMO();

    const trigger = ViewTrigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(ViewTrigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      views: ["above", "at"],
      root: root,
      id: "foo",
    });
  });

  test("with target el", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnView = `above,at @${actionName} +id=foo +target=#${ref.id}`;
    document.body.append(element);

    await window.waitForMO();

    const trigger = ViewTrigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(ViewTrigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      views: ["above", "at"],
      target: ref,
      id: "foo",
    });
  });

  test("with target offset", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnView = `above,at @${actionName} +id=foo +target=top:75%`;
    document.body.append(element);

    await window.waitForMO();

    const trigger = ViewTrigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(ViewTrigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      views: ["above", "at"],
      target: "top:75%",
      id: "foo",
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

  test("lisn-on-view--...", async () => {
    const element = document.createElement("div");
    element.classList.add(`lisn-on-view--at@${actionName}+id=foo`);
    document.body.append(element);

    await window.waitForMO();

    expect(ViewTrigger.get(element, "foo")).toBeTruthy();
  });

  test("[data-lisn-on-view='...']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnView = `at @${actionName} +id=foo`;
    document.body.append(element);

    await window.waitForMO();

    expect(ViewTrigger.get(element, "foo")).toBeTruthy();
  });
});
