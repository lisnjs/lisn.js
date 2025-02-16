const { describe, test, expect } = require("@jest/globals");

const utils = window.LISN.utils;

let eventCounters = new WeakMap();
const event = new Event("test", { bubbles: true });

const eventHandlerObject = {
  handleEvent: (event) => eventHandlerFn(event),
};

const eventHandlerFn = (event) => {
  let counters = eventCounters.get(event.target);
  if (counters === undefined) {
    counters = {};
    eventCounters.set(event.target, counters);
  }

  counters[event.type] = counters[event.type] || {};
  counters[event.type][event.eventPhase] =
    (counters[event.type][event.eventPhase] || 0) + 1;
};

const createElements = () => {
  const parent = document.createElement("div");
  const child = document.createElement("div");
  parent.appendChild(child);
  return [parent, child];
};

describe("event handling: default detection", () => {
  test("default opts: using function handler", () => {
    const [parent, child] = createElements();
    utils.addEventListenerTo(parent, "test", eventHandlerFn);
    child.dispatchEvent(event);
    child.dispatchEvent(event);
    expect(eventCounters.get(child)?.test).toEqual({
      [Event.BUBBLING_PHASE]: 2,
    });
  });

  test("default opts: using object handler", () => {
    const [parent, child] = createElements();
    expect(eventCounters.get(child)?.test).toBeUndefined();
    utils.addEventListenerTo(parent, "test", eventHandlerObject);
    child.dispatchEvent(event);
    child.dispatchEvent(event);
    expect(eventCounters.get(child)?.test).toEqual({
      [Event.BUBBLING_PHASE]: 2,
    });
  });

  test("once: true", () => {
    const [parent, child] = createElements();
    expect(eventCounters.get(child)?.test).toBeUndefined();
    utils.addEventListenerTo(parent, "test", eventHandlerFn, {
      once: true,
    });
    child.dispatchEvent(event);
    child.dispatchEvent(event);
    expect(eventCounters.get(child)?.test).toEqual({
      [Event.BUBBLING_PHASE]: 1,
    });
  });

  test("true", () => {
    const [parent, child] = createElements();
    expect(eventCounters.get(child)?.test).toBeUndefined();
    utils.addEventListenerTo(parent, "test", eventHandlerFn, true);
    child.dispatchEvent(event);
    child.dispatchEvent(event);
    expect(eventCounters.get(child)?.test).toEqual({
      [Event.CAPTURING_PHASE]: 2,
    });
  });

  test("capture: true", () => {
    const [parent, child] = createElements();
    expect(eventCounters.get(child)?.test).toBeUndefined();
    utils.addEventListenerTo(parent, "test", eventHandlerFn, {
      capture: true,
    });
    child.dispatchEvent(event);
    child.dispatchEvent(event);
    expect(eventCounters.get(child)?.test).toEqual({
      [Event.CAPTURING_PHASE]: 2,
    });
  });

  test("adding duplicate", () => {
    const [parent, child] = createElements();
    expect(eventCounters.get(child)?.test).toBeUndefined();

    expect(utils.addEventListenerTo(parent, "test", eventHandlerFn)).toBe(true);

    expect(utils.addEventListenerTo(parent, "test", eventHandlerFn, {})).toBe(
      false,
    ); // same as above

    expect(
      utils.addEventListenerTo(parent, "test", eventHandlerFn, {
        passive: false,
        capture: false,
      }),
    ).toBe(false); // same as above

    expect(
      utils.addEventListenerTo(parent, "test", eventHandlerFn, false),
    ).toBe(false); // same as above

    expect(utils.addEventListenerTo(parent, "test", eventHandlerFn, true)).toBe(
      true,
    );

    expect(
      utils.addEventListenerTo(parent, "test", eventHandlerFn, {
        capture: true,
      }),
    ).toBe(false); // same as above

    child.dispatchEvent(event);
    expect(eventCounters.get(child)?.test).toEqual({
      [Event.CAPTURING_PHASE]: 1,
      [Event.BUBBLING_PHASE]: 1,
    });

    expect(
      utils.removeEventListenerFrom(parent, "test", eventHandlerFn, true),
    ).toBe(true);
    expect(
      utils.removeEventListenerFrom(parent, "test", eventHandlerFn, true),
    ).toBe(false); // no-op

    child.dispatchEvent(event);
    expect(eventCounters.get(child)?.test).toEqual({
      [Event.CAPTURING_PHASE]: 1,
      [Event.BUBBLING_PHASE]: 2,
    });
  });
});
