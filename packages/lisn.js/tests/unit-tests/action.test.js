const { jest, describe, test, expect } = require("@jest/globals");

const { registerAction, fetchAction } = window.LISN.actions;

describe("registerAction + fetchAction", () => {
  const action = {
    do: jest.fn(),
    undo: jest.fn(),
    toggle: jest.fn(),
  };

  const parser = jest.fn(() => {
    return action;
  });

  let nCalls = 0;

  registerAction("action", parser);

  const element = document.createElement("div");

  test("fetchAction: invalid", async () => {
    // no spec
    await expect(fetchAction(element, "")).rejects.toThrow(/Unknown action ''/);

    // invalid action
    await expect(fetchAction(element, "foo")).rejects.toThrow(
      /Unknown action 'foo'/,
    );
  });

  test("no args v1", async () => {
    let action = await fetchAction(element, "action");
    expect(action).toBe(action);
    expect(parser).toHaveBeenCalledTimes(++nCalls);
    expect(parser).toHaveBeenNthCalledWith(nCalls, element, [], undefined);
  });

  test("no args v2", async () => {
    let action = await fetchAction(element, "action", "");
    expect(action).toBe(action);
    expect(parser).toHaveBeenCalledTimes(++nCalls);
    expect(parser).toHaveBeenNthCalledWith(nCalls, element, [], undefined);
  });

  test("with args", async () => {
    let action = await fetchAction(element, "action", " foo , bar ");
    expect(action).toBe(action);
    expect(parser).toHaveBeenCalledTimes(++nCalls);
    expect(parser).toHaveBeenNthCalledWith(
      nCalls,
      element,
      ["foo", "bar"],
      undefined,
    );
  });
});

describe("registerAction with conf validator + fetchAction", () => {
  const action = {
    do: jest.fn(),
    undo: jest.fn(),
    toggle: jest.fn(),
  };

  const parser = jest.fn(() => {
    return action;
  });

  let nCalls = 0;

  registerAction("actionWithConf", parser, {
    optA: jest.fn((k, v) => v ?? "defaultA"),
    optB: jest.fn((k, v) => v ?? "defaultB"),
  });

  const element = document.createElement("div");

  test("no args v1", async () => {
    let action = await fetchAction(element, "actionWithConf");
    expect(action).toBe(action);
    expect(parser).toHaveBeenCalledTimes(++nCalls);
    expect(parser).toHaveBeenNthCalledWith(nCalls, element, [], {
      optA: "defaultA",
      optB: "defaultB",
    });
  });

  test("no args v2", async () => {
    let action = await fetchAction(element, "actionWithConf", "");
    expect(action).toBe(action);
    expect(parser).toHaveBeenCalledTimes(++nCalls);
    expect(parser).toHaveBeenNthCalledWith(nCalls, element, [], {
      optA: "defaultA",
      optB: "defaultB",
    });
  });

  test("with args and options", async () => {
    let action = await fetchAction(
      element,
      "actionWithConf",
      "arg1, arg2, optA=foo, random=bar",
    );
    expect(action).toBe(action);
    expect(parser).toHaveBeenCalledTimes(++nCalls);
    expect(parser).toHaveBeenNthCalledWith(nCalls, element, ["arg1", "arg2"], {
      optA: "foo",
      optB: "defaultB",
    });
  });
});
