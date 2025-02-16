const { describe, test, expect } = require("@jest/globals");

const { getTouchDiff, getTouchGestureFragment } = window.LISN.utils;

describe("getTouchDiff", () => {
  test("basic", () => {
    const eventA = window.newTouch("move", [100, 100]);
    const eventB = window.newTouch("move", [75, 50]);
    expect(getTouchDiff([eventA, eventB])).toEqual([
      {
        startX: 100,
        startY: 100,
        endX: 75,
        endY: 50,
        deltaX: -25,
        deltaY: -50,
        isSignificant: true,
      },
    ]);
  });

  test("no move v1", () => {
    const eventA = window.newTouch("move", [0, 0]);
    const eventB = window.newTouch("move");
    expect(getTouchDiff([eventA, eventB])).toEqual([]);
  });

  test("no move v2", () => {
    const eventA = window.newTouch("move", [10, 10]);
    const eventB = window.newTouch("move", [10, 10]);
    expect(getTouchDiff([eventA, eventB])).toEqual([
      {
        startX: 10,
        startY: 10,
        endX: 10,
        endY: 10,
        deltaX: 0,
        deltaY: 0,
        isSignificant: true,
      },
    ]);
  });

  test("with move threshold: one delta significant, other not", () => {
    const eventA = window.newTouch("move", [100, 100]);
    const eventB = window.newTouch("move", [75, 50]);
    expect(getTouchDiff([eventA, eventB], 30)).toEqual([
      {
        startX: 100,
        startY: 100,
        endX: 75,
        endY: 50,
        deltaX: -25,
        deltaY: -50,
        isSignificant: true,
      },
    ]);
  });

  test("with move threshold: no deltas significant", () => {
    const eventA = window.newTouch("move", [100, 100]);
    const eventB = window.newTouch("move", [75, 50]);
    expect(getTouchDiff([eventA, eventB], 100)).toEqual([
      {
        startX: 100,
        startY: 100,
        endX: 75,
        endY: 50,
        deltaX: -25,
        deltaY: -50,
        isSignificant: false,
      },
    ]);
  });

  test("two-finger + significant threshold", () => {
    const eventA = window.newTouch("move", [100, 100], [40, 20]);
    const eventB = window.newTouch("move", [75, 50], [110, 80]);
    expect(getTouchDiff([eventA, eventB], 30)).toEqual([
      {
        startX: 100,
        startY: 100,
        endX: 75,
        endY: 50,
        deltaX: -25,
        deltaY: -50,
        isSignificant: true,
      },
      {
        startX: 40,
        startY: 20,
        endX: 110,
        endY: 80,
        deltaX: 70,
        deltaY: 60,
        isSignificant: true,
      },
    ]);
  });
});

describe("getTouchGestureFragment: basic", () => {
  test("start then end v1", () => {
    const eventA = window.newTouch("start", [0, 0], [10, 10]);
    const eventB = window.newTouch("end", [0, 0], null);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toBe(false);
  });

  test("start then end v2", () => {
    const eventA = window.newTouch("start", [10, 10]);
    const eventB = window.newTouch("end", null);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toBe(null);
  });

  test("move then cancel then move", () => {
    const eventA = window.newTouch("move", [0, 0]);
    const eventB = window.newTouch("cancel", [0, 0]);
    const eventC = window.newTouch("move", [10, 10]);
    expect(
      getTouchGestureFragment([eventA, eventB, eventC], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toBe(null);
  });

  test("move then end v1", () => {
    const eventA = window.newTouch("move", [0, 0], [10, 10]);
    const eventB = window.newTouch("end", [0, 0], null);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toBe(false);
  });

  test("move then end v2", () => {
    const eventA = window.newTouch("move", [10, 10]);
    const eventB = window.newTouch("end", null);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toBe(null);
  });

  test("move then start", () => {
    const eventA = window.newTouch("move", [0, 0]);
    const eventB = window.newTouch("start", [0, 0], [10, 10]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toBe(false);
  });

  test("start then move", () => {
    const eventA = window.newTouch("start", [0, 0]);
    const eventB = window.newTouch("move", [10, 500]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 10,
      }),
    ).toEqual({
      device: "touch",
      deltaX: -10,
      deltaY: -500,
      deltaZ: 1,
      direction: "up",
      intent: "scroll",
    });
  });

  test("start then move: reverse scroll", () => {
    const eventA = window.newTouch("start", [0, 0]);
    const eventB = window.newTouch("move", [10, 500]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 10,
        reverseScroll: true,
      }),
    ).toEqual({
      device: "touch",
      deltaX: 10,
      deltaY: 500,
      deltaZ: 1,
      direction: "down",
      intent: "scroll",
    });
  });

  test("move then move: 3 events", () => {
    const eventA = window.newTouch("move", [10, 10]);
    const eventB = window.newTouch("move", [0, 0]); // ignored
    const eventC = window.newTouch("move", [50, 50]);
    expect(
      getTouchGestureFragment([eventA, eventB, eventC], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: -40,
      deltaY: -40,
      deltaZ: 1,
      direction: "ambiguous",
      intent: "scroll",
    });
  });

  test("mismatching moves", () => {
    const eventA = window.newTouch("move", [0, 0], null);
    const eventB = window.newTouch("move", null, [10, 10]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toBe(false);
  });

  test("mismatching fingers", () => {
    const eventA = window.newTouch("move", [0, 0]);
    const eventB = window.newTouch("move", null, [1, 1]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toBe(false);
  });

  test("no move", () => {
    const eventA = window.newTouch("move", [10, 10]);
    const eventB = window.newTouch("move", [10, 10]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toBe(false);
  });
});

describe("getTouchGestureFragment: one-finger", () => {
  test("up", () => {
    const eventA = window.newTouch("move", [100, 100]);
    const eventB = window.newTouch("move", [100, 50]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: 0,
      deltaY: 50,
      deltaZ: 1,
      direction: "down",
      intent: "scroll",
    });
  });

  test("up, reverseScroll", () => {
    const eventA = window.newTouch("move", [100, 100]);
    const eventB = window.newTouch("move", [100, 50]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
        reverseScroll: true,
      }),
    ).toEqual({
      device: "touch",
      deltaX: 0,
      deltaY: -50,
      deltaZ: 1,
      direction: "up",
      intent: "scroll",
    });
  });

  test("up, drag", () => {
    const eventA = window.newTouch("move", [100, 100]);
    const eventB = window.newTouch("move", [100, 50]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
        dragHoldTime: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: 0,
      deltaY: -50,
      deltaZ: 1,
      direction: "up",
      intent: "drag",
    });
  });

  test("up, drag + reverseScroll (ignored)", () => {
    const eventA = window.newTouch("move", [100, 100]);
    const eventB = window.newTouch("move", [100, 50]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
        reverseScroll: true,
        dragHoldTime: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: 0,
      deltaY: -50,
      deltaZ: 1,
      direction: "up",
      intent: "drag",
    });
  });

  test("down", () => {
    const eventA = window.newTouch("move", [100, 100]);
    const eventB = window.newTouch("move", [100, 150]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: 0,
      deltaY: -50,
      deltaZ: 1,
      direction: "up",
      intent: "scroll",
    });
  });

  test("left", () => {
    const eventA = window.newTouch("move", [100, 100]);
    const eventB = window.newTouch("move", [50, 100]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: 50,
      deltaY: 0,
      deltaZ: 1,
      direction: "right",
      intent: "scroll",
    });
  });

  test("right", () => {
    const eventA = window.newTouch("move", [100, 100]);
    const eventB = window.newTouch("move", [150, 100]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: -50,
      deltaY: 0,
      deltaZ: 1,
      direction: "left",
      intent: "scroll",
    });
  });

  test("intermediate", () => {
    const eventA = window.newTouch("move", [100, 100]);
    const eventB = window.newTouch("move", [200, 120]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: -100,
      deltaY: -20,
      deltaZ: 1,
      direction: "ambiguous",
      intent: "scroll",
    });
  });

  test("with angle threshold: intermediate", () => {
    const eventA = window.newTouch("move", [100, 100]);
    const eventB = window.newTouch("move", [200, 120]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 15,
      }),
    ).toEqual({
      device: "touch",
      deltaX: -100,
      deltaY: -20,
      deltaZ: 1,
      direction: "left",
      intent: "scroll",
    });
  });
});

describe("getTouchGestureFragment: 2-finger", () => {
  test("up", () => {
    const eventA = window.newTouch("move", [100, 100], [200, 200]);
    const eventB = window.newTouch("move", [100, 50], [200, 150]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: 0,
      deltaY: 50,
      deltaZ: 1,
      direction: "down",
      intent: "scroll",
    });
  });

  test("down", () => {
    const eventA = window.newTouch("move", [100, 100], [200, 200]);
    const eventB = window.newTouch("move", [100, 150], [200, 250]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: 0,
      deltaY: -50,
      deltaZ: 1,
      direction: "up",
      intent: "scroll",
    });
  });

  test("left", () => {
    const eventA = window.newTouch("move", [100, 100], [200, 200]);
    const eventB = window.newTouch("move", [50, 100], [150, 200]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: 50,
      deltaY: 0,
      deltaZ: 1,
      direction: "right",
      intent: "scroll",
    });
  });

  test("right", () => {
    const eventA = window.newTouch("move", [100, 100], [200, 200]);
    const eventB = window.newTouch("move", [150, 100], [250, 200]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: -50,
      deltaY: 0,
      deltaZ: 1,
      direction: "left",
      intent: "scroll",
    });
  });

  test("intermediate", () => {
    const eventA = window.newTouch("move", [100, 100], [200, 200]);
    const eventB = window.newTouch("move", [200, 120], [300, 220]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: -100,
      deltaY: -20,
      deltaZ: 1,
      direction: "ambiguous",
      intent: "scroll",
    });
  });

  test("with angle threshold: intermediate", () => {
    const eventA = window.newTouch("move", [100, 100], [200, 200]);
    const eventB = window.newTouch("move", [200, 120], [300, 220]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 15,
      }),
    ).toEqual({
      device: "touch",
      deltaX: -100,
      deltaY: -20,
      deltaZ: 1,
      direction: "left",
      intent: "scroll",
    });
  });

  test("pinch in v1", () => {
    const eventA = window.newTouch("move", [100, 100], [200, 100]);
    const eventB = window.newTouch("move", [150, 100], [160, 100]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 0.1,
      direction: "out",
      intent: "zoom",
    });
  });

  test("pinch in v2", () => {
    const eventA = window.newTouch("move", [100, 100], [100, 200]);
    const eventB = window.newTouch("move", [100, 150], [100, 160]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 0.1,
      direction: "out",
      intent: "zoom",
    });
  });

  test("pinch in v3", () => {
    const eventA = window.newTouch("move", [100, 100], [200, 200]);
    const eventB = window.newTouch("move", [150, 150], [160, 160]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 0.1,
      direction: "out",
      intent: "zoom",
    });
  });

  test("pinch in v4: touch 1, then touch 2, then pinch in", () => {
    const eventA = window.newTouch("start", [100, 100]);
    const eventB = window.newTouch("start", [100, 100], [200, 100]);
    const eventC = window.newTouch("move", [150, 100], [160, 100]);
    expect(
      getTouchGestureFragment([eventA, eventB, eventC], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 0.1,
      direction: "out",
      intent: "zoom",
    });
  });

  test("pinch out v1", () => {
    const eventA = window.newTouch("move", [150, 100], [160, 100]);
    const eventB = window.newTouch("move", [100, 100], [200, 100]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 10,
      direction: "in",
      intent: "zoom",
    });
  });

  test("pinch out v2", () => {
    const eventA = window.newTouch("move", [100, 150], [100, 160]);
    const eventB = window.newTouch("move", [100, 100], [100, 200]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 10,
      direction: "in",
      intent: "zoom",
    });
  });

  test("pinch out v3", () => {
    const eventA = window.newTouch("move", [150, 150], [160, 160]);
    const eventB = window.newTouch("move", [100, 100], [200, 200]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 10,
      direction: "in",
      intent: "zoom",
    });
  });
});

describe("getTouchGestureFragment: 3+ fingers", () => {
  test("up: all significant", () => {
    const eventA = window.newTouch("move", [100, 100], [200, 200], [300, 300]);
    const eventB = window.newTouch("move", [100, 50], [200, 150], [300, 250]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 0,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: 0,
      deltaY: 50,
      deltaZ: 1,
      direction: "down",
      intent: "scroll",
    });
  });

  test("pinch in: 2 significant", () => {
    const eventA = window.newTouch("move", [100, 100], [100, 200], [300, 300]);
    const eventB = window.newTouch("move", [100, 150], [100, 160], [300, 290]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 20,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: 0,
      deltaY: 0,
      deltaZ: 0.1,
      direction: "out",
      intent: "zoom",
    });
  });

  test("various directions: none significant", () => {
    const eventA = window.newTouch("move", [100, 100], [200, 200], [300, 300]);
    const eventB = window.newTouch("move", [100, 150], [100, 200], [300, 200]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 200,
        angleDiffThreshold: 0,
      }),
    ).toBe(false);
  });

  test("various directions: all significant", () => {
    const eventA = window.newTouch("move", [100, 100], [200, 200], [300, 300]);
    const eventB = window.newTouch("move", [100, 150], [100, 200], [300, 200]);
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 30,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: 100,
      deltaY: 100,
      deltaZ: 1,
      direction: "ambiguous",
      intent: "scroll",
    });
  });

  test("various directions: two significant, in one direction", () => {
    const eventA = window.newTouch(
      "move",
      [100, 100],
      [200, 200],
      [300, 300],
      [120, 190],
    );
    const eventB = window.newTouch(
      "move",
      [100, 160],
      [200, 300],
      [270, 300], // not significant
      [150, 200], // not significant
    );
    expect(
      getTouchGestureFragment([eventA, eventB], {
        deltaThreshold: 50,
        angleDiffThreshold: 0,
      }),
    ).toEqual({
      device: "touch",
      deltaX: 30,
      deltaY: -100,
      deltaZ: 1,
      direction: "up",
      intent: "scroll",
    });
  });

  test("with all irrelevant events", () => {
    expect(
      getTouchGestureFragment([window.newClick(), window.newWheel(10, 10)]),
    ).toEqual(null);
  });

  test("with irrelevant events + only 1 relevant", () => {
    expect(
      getTouchGestureFragment([
        window.newClick(),
        window.newTouch("move", [10, 10]),
        window.newWheel(10, 10),
      ]),
    ).toEqual(false);
  });

  test("with irrelevant events + enough relevant", () => {
    expect(
      getTouchGestureFragment([
        window.newClick(),
        window.newTouch("move", [100, 100]),
        window.newTouch("move", [100, 50]),
        window.newWheel(10, 10),
      ]),
    ).toEqual({
      device: "touch",
      deltaX: 0,
      deltaY: 50,
      deltaZ: 1,
      direction: "down",
      intent: "scroll",
    });
  });
});
