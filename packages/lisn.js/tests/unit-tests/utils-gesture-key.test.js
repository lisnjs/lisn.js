const { describe, beforeAll, test, expect } = require("@jest/globals");

const { getKeyGestureFragment, fetchViewportOverlay, fetchViewportSize } =
  window.LISN.utils;

let viewportOverlay;

const LINE = 40;
const PAGE = 20 * LINE;
const CONTENT = PAGE; // default

document.documentElement.resize([800, 400], [PAGE, PAGE]);
beforeAll(async () => {
  viewportOverlay = await fetchViewportOverlay();
  viewportOverlay.resize([PAGE, PAGE]);
  await window.waitFor(100);
});

test("check viewport size", async () => {
  expect(fetchViewportSize()).resolves.toEqual({ width: PAGE, height: PAGE });
});

describe("getKeyGestureFragment", () => {
  test("keyup", () => {
    expect(getKeyGestureFragment(window.newKeyUp("ArrowDown"))).toBe(false);
  });

  for (const [key, shiftKey, expDirection, expDx, expDy, expDz] of [
    // TODO test.each
    ["A", false, "none", 0, 0, 1],

    ["Up", false, "up", 0, -LINE, 1],
    ["ArrowUp", false, "up", 0, -LINE, 1],
    ["PageUp", false, "up", 0, -PAGE, 1],
    ["Home", false, "up", 0, -CONTENT, 1],
    ["Down", false, "down", 0, LINE, 1],
    ["ArrowDown", false, "down", 0, LINE, 1],
    ["PageDown", false, "down", 0, PAGE, 1],
    ["End", false, "down", 0, CONTENT, 1],
    ["Left", false, "left", -LINE, 0, 1],
    ["ArrowLeft", false, "left", -LINE, 0, 1],
    ["Right", false, "right", LINE, 0, 1],
    ["ArrowRight", false, "right", LINE, 0, 1],
    [" ", false, "down", 0, PAGE, 1],
    ["+", false, "in", 0, 0, 1.15],
    ["-", false, "out", 0, 0, 1 / 1.15],

    ["Up", true, "up", 0, -LINE, 1],
    ["ArrowUp", true, "up", 0, -LINE, 1],
    ["PageUp", true, "up", 0, -PAGE, 1],
    ["Home", true, "up", 0, -CONTENT, 1],
    ["Down", true, "down", 0, LINE, 1],
    ["ArrowDown", true, "down", 0, LINE, 1],
    ["PageDown", true, "down", 0, PAGE, 1],
    ["End", true, "down", 0, CONTENT, 1],
    ["Left", true, "left", -LINE, 0, 1],
    ["ArrowLeft", true, "left", -LINE, 0, 1],
    ["Right", true, "right", LINE, 0, 1],
    ["ArrowRight", true, "right", LINE, 0, 1],
    [" ", true, "up", 0, -PAGE, 1],
    ["+", true, "in", 0, 0, 1.15],
    ["-", true, "out", 0, 0, 1 / 1.15],
  ]) {
    test(`${key}: ${shiftKey}`, () => {
      const fragment = getKeyGestureFragment(window.newKeyDown(key, shiftKey));

      if (expDirection === "none") {
        expect(fragment).toBe(false);
      } else {
        const isZoom = expDirection === "in" || expDirection === "out";

        expect(fragment).toEqual({
          device: "key",
          deltaX: expDx,
          deltaY: expDy,
          deltaZ: expDz,
          direction: expDirection,
          intent: isZoom ? "zoom" : "scroll",
        });
      }
    });
  }

  test("with explicit scroll height", () => {
    const fragment = getKeyGestureFragment(window.newKeyDown("Home"), {
      angleDiffThreshold: 10,
      scrollHeight: 200 * LINE,
    });

    expect(fragment).toEqual({
      device: "key",
      deltaX: 0,
      deltaY: -200 * LINE,
      deltaZ: 1,
      direction: "up",
      intent: "scroll",
    });
  });

  test("no events", () => {
    expect(getKeyGestureFragment([])).toBe(false);
  });

  test("multiple events: scroll", () => {
    expect(
      getKeyGestureFragment(
        [
          window.newKeyDown("Down"), // +1 line
          window.newKeyDown("Up"), // 0
          window.newKeyDown("Down"), // +1 line
          window.newKeyDown("Down"), // +2 lines
          window.newKeyDown("PageUp"), // -18 lines
          window.newKeyDown("Left"), // -1 line in X
        ],
        { angleDiffThreshold: 10 },
      ),
    ).toEqual({
      device: "key",
      deltaX: -LINE,
      deltaY: -18 * LINE,
      deltaZ: 1,
      direction: "up",
      intent: "scroll",
    });
  });

  test("multiple events: zoom to 0", () => {
    expect(
      getKeyGestureFragment([window.newKeyDown("+"), window.newKeyDown("-")]),
    ).toBe(false);
  });

  test("multiple events: zoom in", () => {
    expect(
      getKeyGestureFragment([
        window.newKeyDown("+"),
        window.newKeyDown("-"),
        window.newKeyDown("+"),
        window.newKeyDown("+"),
      ]),
    ).toEqual({
      device: "key",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 1.15 * 1.15,
      direction: "in",
      intent: "zoom",
    });
  });

  test("multiple events: zoom out", () => {
    expect(
      getKeyGestureFragment([
        window.newKeyDown("-"),
        window.newKeyDown("+"),
        window.newKeyDown("-"),
        window.newKeyDown("-"),
      ]),
    ).toEqual({
      device: "key",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 1 / (1.15 * 1.15),
      direction: "out",
      intent: "zoom",
    });
  });

  test("multiple events: none", () => {
    expect(
      getKeyGestureFragment([
        window.newKeyDown("Down"), // +1 line
        window.newKeyDown("Up"), // 0
      ]),
    ).toBe(false);
  });

  test("multiple events: ambiguous", () => {
    expect(
      getKeyGestureFragment([
        window.newKeyDown("+"), // zoom
        window.newKeyDown("Up"), // scroll
      ]),
    ).toEqual({
      device: "key",
      deltaX: 0,
      deltaY: -LINE,
      deltaZ: 1.15,
      direction: "ambiguous",
      intent: "unknown",
    });
  });

  test("with irrelevant events", () => {
    expect(
      getKeyGestureFragment([window.newClick(), window.newWheel(10, 10)]),
    ).toEqual(false);
  });

  test("with irrelevant + relevant events", () => {
    expect(
      getKeyGestureFragment([window.newKeyDown("+"), window.newWheel(10, 10)]),
    ).toEqual({
      device: "key",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 1.15,
      direction: "in",
      intent: "zoom",
    });
  });
});
