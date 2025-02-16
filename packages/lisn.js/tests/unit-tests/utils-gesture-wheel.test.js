const { describe, test, expect } = require("@jest/globals");

const { getWheelGestureFragment } = window.LISN.utils;

// TODO test normalize delta for other delta modes?
describe("getWheelGestureFragment", () => {
  test("not a wheel event", () => {
    expect(getWheelGestureFragment(new MouseEvent("mousedown"))).toBe(false);
  });

  for (const [
    dx,
    dy,
    angleThresh,
    shiftKey,
    ctrlKey,
    expDirection,
    expIntent,
  ] of [
    // TODO test.each
    // various none/ambiguous
    [0, 0, 0, false, false, "none", "scroll"],
    [0, 0, 0, false, true, "none", "zoom"],
    [0, 0, 0, true, false, "none", "scroll"],
    [0, 0, 0, true, true, "none", "zoom"],

    [10, 10, 0, false, false, "ambiguous", "scroll"],
    [10, 10, 0, true, false, "ambiguous", "scroll"],

    [10, -10, 0, false, false, "ambiguous", "scroll"],
    [10, -10, 0, true, false, "ambiguous", "scroll"],

    // wheel up
    [0, -10, 0, false, false, "up", "scroll"],
    [0, -10, 0, false, true, "in", "zoom"],
    [0, -10, 0, true, false, "left", "scroll"],
    [0, -10, 0, true, true, "in", "zoom"],

    // wheel up large delta
    [0, -100, 0, false, false, "up", "scroll"],
    [0, -100, 0, false, true, "in", "zoom"],
    [0, -100, 0, true, false, "left", "scroll"],
    [0, -100, 0, true, true, "in", "zoom"],

    // wheel down
    [0, 10, 0, false, false, "down", "scroll"],
    [0, 10, 0, false, true, "out", "zoom"],
    [0, 10, 0, true, false, "right", "scroll"],
    [0, 10, 0, true, true, "out", "zoom"],

    // wheel down large delta
    [0, 100, 0, false, false, "down", "scroll"],
    [0, 100, 0, false, true, "out", "zoom"],
    [0, 100, 0, true, false, "right", "scroll"],
    [0, 100, 0, true, true, "out", "zoom"],

    // wheel left
    [-10, 0, 0, false, false, "left", "scroll"],
    [-10, 0, 0, false, true, "left", "scroll"],
    [-10, 0, 0, true, false, "left", "scroll"],
    [-10, 0, 0, true, true, "left", "scroll"],

    // wheel right
    [10, 0, 0, false, false, "right", "scroll"],
    [10, 0, 0, false, true, "right", "scroll"],
    [10, 0, 0, true, false, "right", "scroll"],
    [10, 0, 0, true, true, "right", "scroll"],

    // both deltas non-0: 0 angle threshold
    [10, -100, 0, false, false, "ambiguous", "scroll"],
    [10, -100, 0, false, true, "ambiguous", "scroll"], // non-0 deltaX is not considered for zoom
    [10, -100, 0, true, false, "ambiguous", "scroll"],
    [10, -100, 0, true, true, "ambiguous", "scroll"], // non-0 deltaX is not considered for zoom

    // both deltas non-0: + angle threshold
    [10, -100, 10, false, false, "up", "scroll"],
    [10, -100, 10, false, true, "up", "scroll"], // non-0 deltaX is not considered for zoom
    [10, -100, 10, true, false, "up", "scroll"], // non-0 deltaX is not considered for sideways scroll
    [10, -100, 10, true, true, "up", "scroll"], // non-0 deltaX is not considered for zoom or sideways scroll
  ]) {
    test(`${dx},${dy}: ${shiftKey},${ctrlKey}`, () => {
      const fragment = getWheelGestureFragment(
        window.newWheel(dx, dy, shiftKey, ctrlKey),
        { angleDiffThreshold: angleThresh },
      );

      if (expDirection === "none") {
        expect(fragment).toBe(false);
      } else {
        const isZoom = expIntent === "zoom";
        const isSideways = !ctrlKey && shiftKey && dx === 0;

        expect(fragment).toEqual({
          device: "wheel",
          deltaX: isZoom ? 0 : isSideways ? dy : dx,
          deltaY: isZoom ? 0 : isSideways ? 0 : dy,
          deltaZ: isZoom ? 1 - (Math.abs(dy) >= 50 ? dy / 10 : dy) / 100 : 1,
          direction: expDirection,
          intent: expIntent,
        });
      }
    });
  }

  test("no events", () => {
    expect(getWheelGestureFragment([])).toBe(false);
  });

  test("multiple events: scroll", () => {
    const eventA = window.newWheel(0, 5);
    const eventB = window.newWheel(0, 5);
    expect(
      getWheelGestureFragment([eventA, eventB], { angleDiffThreshold: 0 }),
    ).toEqual({
      device: "wheel",
      deltaX: 0,
      deltaY: 10,
      deltaZ: 1,
      direction: "down",
      intent: "scroll",
    });
  });

  test("multiple events: zoom to 0", () => {
    const eventA = window.newWheel(0, 10, false, true);
    const eventB = window.newWheel(0, (1 - 1 / 0.9) * 100, false, true); // approx 10
    expect(
      getWheelGestureFragment([eventA, eventB], { angleDiffThreshold: 0 }),
    ).toBe(false);
  });

  test("multiple events: zoom in", () => {
    const eventA = window.newWheel(0, 5, false, true);
    const eventB = window.newWheel(0, -5, false, true);
    const eventC = window.newWheel(0, -15, false, true);
    expect(
      getWheelGestureFragment([eventA, eventB, eventC], {
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "wheel",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 1 * 0.95 * 1.05 * 1.15,
      direction: "in",
      intent: "zoom",
    });
  });

  test("multiple events: zoom out", () => {
    const eventA = window.newWheel(0, 5, false, true);
    const eventB = window.newWheel(0, 5, false, true);
    expect(
      getWheelGestureFragment([eventA, eventB], { angleDiffThreshold: 0 }),
    ).toEqual({
      device: "wheel",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 0.95 * 0.95,
      direction: "out",
      intent: "zoom",
    });
  });

  test("multiple events: mixing shiftKey true/false: ambiguous", () => {
    const eventA = window.newWheel(0, 5, false, false);
    const eventB = window.newWheel(0, 5, true, false); // horizontal
    expect(
      getWheelGestureFragment([eventA, eventB], { angleDiffThreshold: 10 }),
    ).toEqual({
      device: "wheel",
      deltaX: 5,
      deltaY: 5,
      deltaZ: 1,
      direction: "ambiguous",
      intent: "scroll",
    });
  });

  test("multiple events: mixing shiftKey true/false: not ambiguous", () => {
    const eventA = window.newWheel(0, 5, false, false);
    const eventB = window.newWheel(0, 50, true, false); // horizontal
    expect(
      getWheelGestureFragment([eventA, eventB], { angleDiffThreshold: 10 }),
    ).toEqual({
      device: "wheel",
      deltaX: 50,
      deltaY: 5,
      deltaZ: 1,
      direction: "right",
      intent: "scroll",
    });
  });

  test("multiple events: mixing ctrlKey true/false => always ambiguous", () => {
    const eventA = window.newWheel(0, 5, false, false);
    const eventB = window.newWheel(0, 5, false, true); // 5% zoom out
    expect(
      getWheelGestureFragment([eventA, eventB], { angleDiffThreshold: 0 }),
    ).toEqual({
      device: "wheel",
      deltaX: 0,
      deltaY: 5,
      deltaZ: 0.95,
      direction: "ambiguous",
      intent: "unknown",
    });
  });

  test("with irrelevant events", () => {
    expect(
      getWheelGestureFragment([window.newClick(), window.newKeyDown("+")]),
    ).toEqual(false);
  });

  test("with irrelevant + relevant events", () => {
    expect(
      getWheelGestureFragment([
        window.newKeyDown("+"),
        window.newWheel(0, 100),
        window.newClick(),
      ]),
    ).toEqual({
      device: "wheel",
      deltaX: 0,
      deltaY: 100,
      deltaZ: 1,
      direction: "down",
      intent: "scroll",
    });
  });
});
