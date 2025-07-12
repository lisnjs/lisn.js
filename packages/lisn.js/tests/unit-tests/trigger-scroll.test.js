const { jest, describe, test, expect } = require("@jest/globals");

const { ScrollTrigger } = window.LISN.triggers;
const { registerAction } = window.LISN.actions;
const { randId } = window.LISN.utils;

document.documentElement.enableScroll();

describe("ScrollTrigger", () => {
  test("invalid", () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    expect(
      () => new ScrollTrigger(document.body, [action], { directions: "none" }),
    ).toThrow(/Invalid value for 'directions'/);
  });

  test("basic", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const element = document.createElement("div");
    new ScrollTrigger(element, [action], {
      directions: "up",
    });

    await window.waitForAF();

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    document.documentElement.scrollTo(100, 0); // right
    await window.waitFor(100); // debounce window + a bit

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    document.documentElement.scrollTo(0, 0); // left
    await window.waitFor(100); // debounce window + a bit

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    document.documentElement.scrollTo(0, 100); // down
    await window.waitFor(100); // debounce window + a bit

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    document.documentElement.scrollTo(0, 0); // up
    await window.waitFor(100); // debounce window + a bit

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);
  });

  test("multiple directions: up,down", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const element = document.createElement("div");
    new ScrollTrigger(element, [action], {
      scrollable: element,
      directions: "up,down",
    });
    element.enableScroll();

    await window.waitForAF();

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.scrollTo(100, 0); // right
    await window.waitFor(100); // debounce window + a bit

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.scrollTo(0, 0); // left
    await window.waitFor(100); // debounce window + a bit

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(2);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.scrollTo(0, 100); // down
    await window.waitFor(100); // debounce window + a bit

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(2);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.scrollTo(0, 0); // up
    await window.waitFor(100); // debounce window + a bit

    expect(action.do).toHaveBeenCalledTimes(2);
    expect(action.undo).toHaveBeenCalledTimes(2);
    expect(action.toggle).toHaveBeenCalledTimes(0);
  });

  test("multiple directions: up,left", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const element = document.createElement("div");
    new ScrollTrigger(element, [action], {
      scrollable: element,
      directions: "up,left",
    });
    element.enableScroll();

    await window.waitForAF();

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.scrollTo(100, 0); // right
    await window.waitFor(100); // debounce window + a bit

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.scrollTo(0, 0); // left
    await window.waitFor(100); // debounce window + a bit

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.scrollTo(0, 100); // down
    await window.waitFor(100); // debounce window + a bit

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(2);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.scrollTo(0, 0); // up
    await window.waitFor(100); // debounce window + a bit

    expect(action.do).toHaveBeenCalledTimes(2);
    expect(action.undo).toHaveBeenCalledTimes(2);
    expect(action.toggle).toHaveBeenCalledTimes(0);
  });

  test("with another scrollable", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const element = document.createElement("div");
    new ScrollTrigger(document.body, [action], {
      scrollable: element,
      directions: "up",
    });
    element.enableScroll();

    await window.waitForAF();

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.scrollTo(100, 0); // right
    await window.waitFor(100); // debounce window + a bit

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.scrollTo(0, 0); // left
    await window.waitFor(100); // debounce window + a bit

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.scrollTo(0, 100); // down
    await window.waitFor(100); // debounce window + a bit

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    element.scrollTo(0, 0); // up
    await window.waitFor(100); // debounce window + a bit

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);
  });

  test("destroy", async () => {
    const action = {
      do: jest.fn(),
      undo: jest.fn(),
      toggle: jest.fn(),
    };

    const element = document.createElement("div");
    const trigger = new ScrollTrigger(element, [action], {
      scrollable: element,
      directions: "up",
    });

    await window.waitForAF();

    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    await trigger.destroy();

    element.scrollTo(0, 100); // down
    await window.waitFor(100); // debounce window + a bit

    // no new calls
    expect(action.do).toHaveBeenCalledTimes(0);
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
  const scrollable = document.createElement("div");
  scrollable.id = randId();
  document.body.append(scrollable);

  test("invalid direction", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnScroll = `foo @${actionName} +id=foo`;
    window.expectError(/Invalid value for 'directions'/);
    document.body.append(element);

    await window.waitForMO();

    expect(ScrollTrigger.get(element, "foo")).toBe(null);
  });

  test("basic", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnScroll =
      `up @${actionName} ` +
      `+id=foo +delay=10 +do-delay=15 +undo-delay=20 +once`;
    document.body.append(element);

    await window.waitForMO();

    const trigger = ScrollTrigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(ScrollTrigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      directions: ["up"],
      id: "foo",
      delay: 10,
      doDelay: 15,
      undoDelay: 20,
      once: true,
    });
  });

  test("with scrollable and other opts", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnScroll =
      `up @${actionName} ` +
      `+id=foo +delay=10 +do-delay=15 +undo-delay=20 +once +threshold=50 +scrollable=#${scrollable.id}`;
    document.body.append(element);

    await window.waitForMO();

    const trigger = ScrollTrigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(ScrollTrigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      directions: ["up"],
      scrollable: scrollable,
      threshold: 50,
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

  test("lisn-on-scroll--...", async () => {
    const element = document.createElement("div");
    element.classList.add(`lisn-on-scroll--up@${actionName}+id=foo`);
    document.body.append(element);

    await window.waitForMO();

    expect(ScrollTrigger.get(element, "foo")).toBeTruthy();
  });

  test("[data-lisn-on-scroll='...']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnScroll = `up @${actionName} +id=foo`;
    document.body.append(element);

    await window.waitForMO();

    expect(ScrollTrigger.get(element, "foo")).toBeTruthy();
  });
});
