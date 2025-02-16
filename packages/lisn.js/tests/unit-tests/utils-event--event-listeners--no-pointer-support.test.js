const { test, expect } = require("@jest/globals");

const utils = window.LISN.utils;

let eventCounters = new WeakMap();
const ptEvent = new Event("pointermove", { bubbles: true });
const msEvent = new Event("mousemove", { bubbles: true });

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

test("pointer event", () => {
  // jsdom has no pointer support anyway, but if they add it, how to mock it??
  expect("onpointerup" in document.body).toBe(false);
  expect("onmouseup" in document.body).toBe(true);

  const [parent, child] = createElements();
  expect(eventCounters.get(child)?.pointermove).toBeUndefined();

  expect(utils.addEventListenerTo(parent, "pointermove", eventHandlerFn)).toBe(
    true,
  );

  expect(
    utils.addEventListenerTo(parent, "mousemove", eventHandlerFn, {}),
  ).toBe(false); // same as above

  child.dispatchEvent(ptEvent);
  expect(eventCounters.get(child)?.pointermove).toBeUndefined();
  expect(eventCounters.get(child)?.mousemove).toBeUndefined();

  child.dispatchEvent(msEvent);
  expect(eventCounters.get(child)?.pointermove).toBeUndefined();
  expect(eventCounters.get(child)?.mousemove).toEqual({
    [Event.BUBBLING_PHASE]: 1,
  });
});
