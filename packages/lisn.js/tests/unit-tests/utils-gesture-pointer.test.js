const { describe, test, expect } = require("@jest/globals");

const { getPointerGestureFragment } = window.LISN.utils;

Element.prototype.onpointerup = true; // mock support for pointer
describe("getPointerGestureFragment", () => {
  test("touch type", () => {
    const eventA = window.newPointer("down", 10, 10, "touch");
    const eventB = window.newPointer("move", 30, 30, "touch");
    expect(getPointerGestureFragment([eventA, eventB])).toBe(false);
  });

  test("pointer + mouse mix v1", () => {
    const eventA = window.newMouse("down", 10, 10);
    const eventB = window.newPointer("move", 30, 30, "mouse");
    expect(getPointerGestureFragment([eventA, eventB])).toBe(false);
  });

  test("pointer + mouse mix v2", () => {
    const eventA = window.newMouse("down", 10, 10);
    const eventB = window.newMouse("move", 30, 10);
    const eventC = window.newPointer("down", 10, 10);
    const eventD = window.newPointer("move", 30, 10);
    expect(getPointerGestureFragment([eventA, eventB, eventC, eventD])).toEqual(
      {
        device: "pointer",
        deltaX: 20,
        deltaY: 0,
        deltaZ: 1,
        direction: "right",
        intent: "drag",
      },
    );
  });

  test("pointer types mix", () => {
    const eventA = window.newPointer("down", 10, 10, "pointer");
    const eventB = window.newPointer("move", 30, 30, "mouse");
    expect(getPointerGestureFragment([eventA, eventB])).toBe(null);
  });

  test("down then up", () => {
    const eventA = window.newPointer("down", 10, 10);
    const eventB = window.newPointer("up", 10, 10);
    expect(getPointerGestureFragment([eventA, eventB])).toBe(false);
  });

  test("up then move", () => {
    // not really realistic example
    const eventA = window.newPointer("up", 10, 10);
    const eventB = window.newPointer("move", 30, 10);
    expect(getPointerGestureFragment([eventA, eventB])).toEqual({
      device: "pointer",
      deltaX: 20,
      deltaY: 0,
      deltaZ: 1,
      direction: "right",
      intent: "drag",
    });
  });

  test("move then up", () => {
    const eventA = window.newPointer("move", 10, 10);
    const eventB = window.newPointer("up", 10, 10);
    expect(getPointerGestureFragment([eventA, eventB])).toBe(false);
  });

  test("down then move", () => {
    const eventA = window.newPointer("down", 10, 10);
    const eventB = window.newPointer("move", 30, 10);
    expect(getPointerGestureFragment([eventA, eventB])).toEqual({
      device: "pointer",
      deltaX: 20,
      deltaY: 0,
      deltaZ: 1,
      direction: "right",
      intent: "drag",
    });
  });

  test("down then move, no delta", () => {
    const eventA = window.newPointer("down", 10, 10);
    const eventB = window.newPointer("move", 10, 10);
    expect(getPointerGestureFragment([eventA, eventB])).toBe(false);
  });

  test("down then move, holding no button", () => {
    // not really realistic example
    const eventA = window.newPointer("down", 10, 10, "mouse", 0);
    const eventB = window.newPointer("move", 30, 10, "mouse", 0);
    expect(getPointerGestureFragment([eventA, eventB])).toBe(null);
  });

  test("down then move, holding secondary", () => {
    const eventA = window.newPointer("down", 10, 10, "mouse", 2);
    const eventB = window.newPointer("move", 30, 10, "mouse", 2);
    expect(getPointerGestureFragment([eventA, eventB])).toBe(null);
  });

  test("down then move, holding primary + secondary", () => {
    const eventA = window.newPointer("down", 10, 10, "mouse", 3);
    const eventB = window.newPointer("move", 30, 10, "mouse", 3);
    expect(getPointerGestureFragment([eventA, eventB])).toBe(null);
  });

  test("move then move: 3 events", () => {
    const eventA = window.newPointer("move", 10, 10);
    const eventB = window.newPointer("move", 0, 0); // ignored
    const eventC = window.newPointer("move", 30, 10);
    expect(getPointerGestureFragment([eventA, eventB, eventC])).toEqual({
      device: "pointer",
      deltaX: 20,
      deltaY: 0,
      deltaZ: 1,
      direction: "right",
      intent: "drag",
    });
  });

  test("with all irrelevant events", () => {
    expect(
      getPointerGestureFragment([window.newClick(), window.newWheel(10, 10)]),
    ).toEqual(false);
  });

  test("with irrelevant events + only 1 relevant", () => {
    expect(
      getPointerGestureFragment([
        window.newClick(),
        window.newPointer("move", 10, 10),
        window.newWheel(10, 10),
      ]),
    ).toEqual(false);
  });

  test("with irrelevant events + enough relevant", () => {
    expect(
      getPointerGestureFragment([
        window.newPointer("move", 100, 100),
        window.newPointer("move", 100, 50),
        window.newClick(),
        window.newWheel(10, 10),
      ]),
    ).toEqual({
      device: "pointer",
      deltaX: 0,
      deltaY: -50,
      deltaZ: 1,
      direction: "up",
      intent: "drag",
    });
  });
});
