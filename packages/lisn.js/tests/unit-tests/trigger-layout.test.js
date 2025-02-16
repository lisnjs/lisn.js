const { jest, describe, test, expect } = require("@jest/globals");

const { LayoutTrigger } = window.LISN.triggers;
const { registerAction } = window.LISN.actions;
const { randId } = window.LISN.utils;

const observers = new Map();

const getNextObserver = async () => {
  return new Promise((resolve) => {
    window.IntersectionObserver.onNextInstance.push(resolve);
  });
};

const getOverlays = async (root = null) => {
  let { overlays, observer } = observers.get(root) || {};

  if (!overlays || !observer) {
    observer = await getNextObserver();
    overlays = {};
    for (const overlay of observer.targets) {
      const layout =
        overlay.dataset.lisnDevice || overlay.dataset.lisnAspectRatio;
      overlays[layout] = overlay;
    }

    observers.set(root, { overlays, observer });
  }

  // The mock implementation of IntersectionObserver is dumb and doesn't
  // understand root margins so by default all overlays will be intersecting.
  // We manually set them to non-intersecting as the initial state (desktop and
  // very-wide).
  for (const l in overlays) {
    const overlay = overlays[l];
    observer.trigger(overlay, ["right"]);
  }

  return { observer, overlays };
};

const newDummies = () => {
  const element = document.createElement("div");
  const action = {
    do: jest.fn(),
    undo: jest.fn(),
    toggle: jest.fn(),
  };

  const actionName = randId();
  registerAction(actionName, () => action);

  const root = document.createElement("div");
  root.id = randId();
  document.body.append(root);

  return { element, root, action, actionName };
};

describe("LayoutTrigger", () => {
  test("invalid", () => {
    const { action } = newDummies();

    expect(() => new LayoutTrigger(document.body, [action])).toThrow(
      /'layout' is required/,
    );
  });

  test("basic", async () => {
    const { action } = newDummies();

    new LayoutTrigger(document.body, [action], {
      layout: "min tablet",
    });
    const { overlays, observer } = await getOverlays();

    await window.waitForMO();
    expect(action.do).toHaveBeenCalledTimes(1); // deskop layout
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    // to mobile-wide
    observer.trigger(overlays.desktop, ["at"]);
    observer.trigger(overlays.tablet, ["at"]);
    await window.waitForMO();

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1); // mobile wide, undone
    expect(action.toggle).toHaveBeenCalledTimes(0);

    // to tablet
    observer.trigger(overlays.tablet, ["right"]);
    await window.waitForMO();

    expect(action.do).toHaveBeenCalledTimes(2);
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);
  });
});

describe("auto-widgets", () => {
  test("invalid: missing layout", async () => {
    const { element, actionName } = newDummies();
    element.dataset.lisnOnLayout = `@${actionName} +id=foo`;
    window.expectError(/Invalid value for 'layout'/);
    document.body.append(element);

    await window.waitForMO();

    expect(LayoutTrigger.get(element, "foo")).toBe(null);
  });

  test("invalid layout", async () => {
    const { element, actionName } = newDummies();
    element.dataset.lisnOnLayout = `foo @${actionName} +id=foo`;
    window.expectError(/Invalid value for 'layout'/);
    document.body.append(element);

    await window.waitForMO();

    expect(LayoutTrigger.get(element, "foo")).toBe(null);
  });

  test("basic: desktop", async () => {
    const { element, action, actionName } = newDummies();
    element.dataset.lisnOnLayout = `desktop @${actionName} +id=foo`;
    document.body.append(element);

    const { overlays, observer } = await getOverlays();
    await window.waitForMO();

    const trigger = LayoutTrigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(LayoutTrigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      layout: "desktop",
      id: "foo",
    });

    await window.waitForMO();
    expect(action.do).toHaveBeenCalledTimes(1); // deskop layout
    expect(action.undo).toHaveBeenCalledTimes(0);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    // to tablet
    observer.trigger(overlays.desktop, ["at"]);
    await window.waitForMO();

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(1); // tablet, no match
    expect(action.toggle).toHaveBeenCalledTimes(0);
  });

  test("max mobile-wide +root=...", async () => {
    const { element, root, action, actionName } = newDummies();
    element.dataset.lisnOnLayout =
      `max mobile-wide @${actionName} ` +
      `+id=foo +delay=0 +do-delay=500 +undo-delay=800 +root=#${root.id}`;
    document.body.append(element);

    const { overlays, observer } = await getOverlays(root);
    await window.waitForMO();

    const trigger = LayoutTrigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(LayoutTrigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      layout: "max mobile-wide",
      root,
      id: "foo",
      delay: 0,
      doDelay: 500,
      undoDelay: 800,
    });

    await window.waitForMO();

    await window.waitFor(500);
    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0); // delayed
    expect(action.toggle).toHaveBeenCalledTimes(0);

    await window.waitFor(800);
    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(1); // deskop layout, no match
    expect(action.toggle).toHaveBeenCalledTimes(0);

    // to tablet
    observer.trigger(overlays.desktop, ["at"]);
    await window.waitForMO();

    await window.waitFor(800);
    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(2); // tablet, no match
    expect(action.toggle).toHaveBeenCalledTimes(0);

    // to mobile wide
    observer.trigger(overlays.tablet, ["at"]);
    await window.waitForMO();

    await window.waitFor(300);
    expect(action.do).toHaveBeenCalledTimes(0); // delayed
    expect(action.undo).toHaveBeenCalledTimes(2);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    await window.waitFor(500);
    expect(action.do).toHaveBeenCalledTimes(1); // mobile wide, match
    expect(action.undo).toHaveBeenCalledTimes(2);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    // to mobile
    observer.trigger(overlays["mobile-wide"], ["at"]);
    await window.waitForMO();

    await window.waitFor(500);
    expect(action.do).toHaveBeenCalledTimes(2); // mobile, match
    expect(action.undo).toHaveBeenCalledTimes(2);
    expect(action.toggle).toHaveBeenCalledTimes(0);
  });

  test("class: max-mobile-wide+root=...", async () => {
    const { element, root, action, actionName } = newDummies();
    element.classList.add(
      `lisn-on-layout--max-mobile-wide@${actionName}` +
        `+id=foo+delay=0+do-delay=500+undo-delay=800+root=#${root.id}`,
    );
    document.body.append(element);

    const { overlays, observer } = await getOverlays(root);
    await window.waitForMO();

    const trigger = LayoutTrigger.get(element, "foo");
    expect(trigger).toBeInstanceOf(LayoutTrigger);
    expect(trigger.getActions()).toEqual([action]);
    expect(trigger.getConfig()).toEqual({
      layout: "max mobile-wide",
      root,
      id: "foo",
      delay: 0,
      doDelay: 500,
      undoDelay: 800,
    });

    await window.waitForMO();

    await window.waitFor(500);
    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(0); // delayed
    expect(action.toggle).toHaveBeenCalledTimes(0);

    await window.waitFor(800);
    expect(action.do).toHaveBeenCalledTimes(0);
    expect(action.undo).toHaveBeenCalledTimes(1); // deskop layout, no match
    expect(action.toggle).toHaveBeenCalledTimes(0);

    // to mobile wide first this time
    observer.trigger(overlays.desktop, ["at"]);
    observer.trigger(overlays.tablet, ["at"]);
    await window.waitForMO();

    await window.waitFor(300);
    expect(action.do).toHaveBeenCalledTimes(0); // delayed
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    await window.waitFor(500);
    expect(action.do).toHaveBeenCalledTimes(1); // mobile wide, match
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(action.toggle).toHaveBeenCalledTimes(0);

    // back to tablet
    observer.trigger(overlays.tablet, ["right"]);
    await window.waitForMO();

    await window.waitFor(800);
    expect(action.do).toHaveBeenCalledTimes(1);
    expect(action.undo).toHaveBeenCalledTimes(2); // tablet, no match
    expect(action.toggle).toHaveBeenCalledTimes(0);

    // to mobile
    observer.trigger(overlays.tablet, ["at"]);
    observer.trigger(overlays["mobile-wide"], ["at"]);
    await window.waitForMO();

    await window.waitFor(500);
    expect(action.do).toHaveBeenCalledTimes(2); // mobile, match
    expect(action.undo).toHaveBeenCalledTimes(2);
    expect(action.toggle).toHaveBeenCalledTimes(0);
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

  test("lisn-on-layout--...", async () => {
    const element = document.createElement("div");
    element.classList.add(`lisn-on-layout--desktop@${actionName}+id=foo`);
    document.body.append(element);

    await window.waitForMO();

    expect(LayoutTrigger.get(element, "foo")).toBeTruthy();
  });

  test("[data-lisn-on-layout='...']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnOnLayout = `desktop @${actionName} +id=foo`;
    document.body.append(element);

    await window.waitForMO();

    expect(LayoutTrigger.get(element, "foo")).toBeTruthy();
  });
});
