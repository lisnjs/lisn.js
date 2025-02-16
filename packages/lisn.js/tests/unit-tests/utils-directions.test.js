const { describe, test, expect } = require("@jest/globals");

const utils = window.LISN.utils;

const DIRECTIONS = {
  // and their opposites
  none: null,
  ambiguous: null,
  up: "down",
  down: "up",
  left: "right",
  right: "left",
  in: "out",
  out: "in",
};

for (const [dx, dy, expectedDirection] of [
  // TODO test.each
  [0, 0, "none"],

  [1, 1, "ambiguous"],
  [1, -1, "ambiguous"],

  [0, -1, "up"],
  [1, -2, "up"],
  [-1, -2, "up"],

  [0, 1, "down"],
  [1, 2, "down"],
  [-1, 2, "down"],

  [-1, 0, "left"],
  [-2, 1, "left"],
  [-2, -1, "left"],

  [1, 0, "right"],
  [2, 1, "right"],
  [2, -1, "right"],
]) {
  test(`getMaxDeltaDirection: ${dx}${dy}`, () => {
    expect(utils.getMaxDeltaDirection(dx, dy)).toBe(expectedDirection);
  });
}

describe("getVectorDirection", () => {
  for (const [dx, dy, angleThresh, expectedDirection] of [
    [0, 0, 0, "none"],
    [0, 0, 10, "none"],

    [-0, 0, 0, "none"],
    [-0, 0, 10, "none"],

    [0, -0, 0, "none"],
    [0, -0, 10, "none"],

    [100, 100, 0, "ambiguous"],
    [100, 100, 10, "ambiguous"],

    [100, -0, 0, "right"],
    [100, 0, 0, "right"],
    [100, 10, 0, "ambiguous"],
    [100, 10, 10, "right"],
    [100, 10, 50, "right"], // angleThresh > 45
    [100, 10, 100, "right"], // angleThresh > 90
    [100, 10, 200, "right"], // angleThresh > 180

    [-0, 100, 0, "down"],
    [0, 100, 0, "down"],
    [10, 100, 0, "ambiguous"],
    [10, 100, 10, "down"],
    [10, 100, 50, "down"], // angleThresh > 45
    [10, 100, 100, "down"], // angleThresh > 90
    [10, 100, 200, "down"], // angleThresh > 180

    [-100, -0, 0, "left"],
    [-100, 0, 0, "left"],
    [-100, 10, 0, "ambiguous"],
    [-100, 10, 10, "left"],
    [-100, 10, 50, "left"], // angleThresh > 45
    [-100, 10, 100, "left"], // angleThresh > 90
    [-100, 10, 200, "left"], // angleThresh > 180

    [-0, -100, 0, "up"],
    [0, -100, 0, "up"],
    [10, -100, 0, "ambiguous"],
    [10, -100, 10, "up"],
    [10, -100, 50, "up"], // angleThresh > 45
    [10, -100, 100, "up"], // angleThresh > 90
    [10, -100, 200, "up"], // angleThresh > 180
  ]) {
    test(`[${dx}, ${dy}] (within ${angleThresh}) === ${expectedDirection}?`, () => {
      expect(utils.getVectorDirection([dx, dy], angleThresh)).toBe(
        expectedDirection,
      );
    });
  }
});

describe("getOppositeDirection", () => {
  for (const direction in DIRECTIONS) {
    const expectedOpposite = DIRECTIONS[direction];
    test(`opposite of ${direction} === ${expectedOpposite}?`, () => {
      expect(utils.getOppositeDirection(direction)).toBe(expectedOpposite);
    });
  }

  test("invalid", () => {
    expect(() => utils.getOppositeDirection("")).toThrow(/Invalid 'direction'/);
    expect(() => utils.getOppositeDirection("random")).toThrow(
      /Invalid 'direction'/,
    );
  });
});

describe("getOppositeXYDirections", () => {
  test("single one", () => {
    expect(utils.getOppositeXYDirections("up")).toEqual(["down"]);
    expect(utils.getOppositeXYDirections("left")).toEqual(["right"]);
    expect(utils.getOppositeXYDirections("down")).toEqual(["up"]);
    expect(utils.getOppositeXYDirections("right")).toEqual(["left"]);
  });

  test("multiple ones", () => {
    expect(utils.getOppositeXYDirections("up,down").sort()).toEqual(
      ["left", "right"].sort(),
    );

    expect(utils.getOppositeXYDirections("left,right").sort()).toEqual(
      ["up", "down"].sort(),
    );

    expect(utils.getOppositeXYDirections("up,left").sort()).toEqual(
      ["down", "right"].sort(),
    );

    expect(utils.getOppositeXYDirections("left,up,down")).toEqual(["right"]);
    expect(utils.getOppositeXYDirections("up,left,right")).toEqual(["down"]);
    expect(utils.getOppositeXYDirections("up,down,left,right")).toEqual([]);
  });

  test("invalid", () => {
    expect(() => utils.getOppositeXYDirections("")).toThrow(
      /'directions' is required/,
    );
    expect(() => utils.getOppositeXYDirections(" , ")).toThrow(
      /'directions' is required/,
    );
    expect(() => utils.getOppositeXYDirections("in")).toThrow(
      /Invalid value for 'directions'/,
    );
    expect(() => utils.getOppositeXYDirections("out")).toThrow(
      /Invalid value for 'directions'/,
    );
    expect(() => utils.getOppositeXYDirections("ambiguous")).toThrow(
      /Invalid value for 'directions'/,
    );
    expect(() => utils.getOppositeXYDirections("none")).toThrow(
      /Invalid value for 'directions'/,
    );
    expect(() => utils.getOppositeXYDirections("random")).toThrow(
      /Invalid value for 'directions'/,
    );
  });
});

test("isValidXYDirection", () => {
  expect(utils.isValidXYDirection("up")).toBe(true);
  expect(utils.isValidXYDirection("down")).toBe(true);
  expect(utils.isValidXYDirection("left")).toBe(true);
  expect(utils.isValidXYDirection("right")).toBe(true);

  expect(utils.isValidXYDirection("")).toBe(false);
  expect(utils.isValidXYDirection(" ")).toBe(false);
  expect(utils.isValidXYDirection(" , ")).toBe(false);
  expect(utils.isValidXYDirection("up,down")).toBe(false);
  expect(utils.isValidXYDirection("random")).toBe(false);
});

test("isValidZDirection", () => {
  expect(utils.isValidZDirection("in")).toBe(true);
  expect(utils.isValidZDirection("out")).toBe(true);

  expect(utils.isValidZDirection("")).toBe(false);
  expect(utils.isValidZDirection(" ")).toBe(false);
  expect(utils.isValidZDirection(" , ")).toBe(false);
  expect(utils.isValidZDirection("in,out")).toBe(false);
  expect(utils.isValidZDirection("random")).toBe(false);
});

test("isValidDirection", () => {
  for (const direction in DIRECTIONS) {
    expect(utils.isValidDirection(direction)).toBe(true);
  }

  expect(utils.isValidDirection("")).toBe(false);
  expect(utils.isValidDirection(" ")).toBe(false);
  expect(utils.isValidDirection(" , ")).toBe(false);
  expect(utils.isValidDirection("up,down")).toBe(false);
  expect(utils.isValidDirection("random")).toBe(false);
});

test("isValidDirectionList", () => {
  for (const direction in DIRECTIONS) {
    expect(utils.isValidDirectionList(direction)).toBe(true);
  }
  expect(utils.isValidDirectionList("up,down,left")).toBe(true);

  expect(utils.isValidDirectionList("")).toBe(false);
  expect(utils.isValidDirectionList(" ")).toBe(false);
  expect(utils.isValidDirectionList(" , ")).toBe(false);
  expect(utils.isValidDirectionList("random")).toBe(false);
});
