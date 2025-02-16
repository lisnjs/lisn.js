const { describe, test, expect } = require("@jest/globals");

const { SetAttribute, fetchAction } = window.LISN.actions;

describe("basic", () => {
  test("on and off given", async () => {
    const element = document.createElement("div");
    element.dataset.fooBar = "value";

    const action = new SetAttribute(element, {
      dataFooBar: { on: "value", off: "unset" },
    });

    await window.waitForAF();
    expect(element.dataset.fooBar).toBe("unset"); // initial state unset

    await action.do();
    expect(element.dataset.fooBar).toBe("value");

    await action.undo();
    expect(element.dataset.fooBar).toBe("unset");

    await action.undo(); // no-op
    expect(element.dataset.fooBar).toBe("unset");

    await action.toggle();
    expect(element.dataset.fooBar).toBe("value");

    await action.toggle();
    expect(element.dataset.fooBar).toBe("unset");
  });

  test("on given, off blank", async () => {
    const element = document.createElement("div");
    element.dataset.fooBar = "value";

    const action = new SetAttribute(element, {
      dataFooBar: { on: "value", off: "" },
    });

    await window.waitForAF();
    expect(element.dataset.fooBar).toBe(""); // initial state unset

    await action.do();
    expect(element.dataset.fooBar).toBe("value");

    await action.undo();
    expect(element.dataset.fooBar).toBe("");

    await action.undo(); // no-op
    expect(element.dataset.fooBar).toBe("");

    await action.toggle();
    expect(element.dataset.fooBar).toBe("value");

    await action.toggle();
    expect(element.dataset.fooBar).toBe("");
  });

  test("on given, off omitted", async () => {
    const element = document.createElement("div");
    element.dataset.fooBar = "value";

    const action = new SetAttribute(element, {
      dataFooBar: { on: "value" },
    });

    await window.waitForAF();
    expect(element.dataset.fooBar).toBeUndefined(); // initial state unset

    await action.do();
    expect(element.dataset.fooBar).toBe("value");

    await action.undo();
    expect(element.dataset.fooBar).toBeUndefined();

    await action.undo(); // no-op
    expect(element.dataset.fooBar).toBeUndefined();

    await action.toggle();
    expect(element.dataset.fooBar).toBe("value");

    await action.toggle();
    expect(element.dataset.fooBar).toBeUndefined();
  });

  test("on given, off null", async () => {
    const element = document.createElement("div");
    element.dataset.fooBar = "value";

    const action = new SetAttribute(element, {
      dataFooBar: { on: "value", off: null },
    });

    await window.waitForAF();
    expect(element.dataset.fooBar).toBeUndefined(); // initial state unset

    await action.do();
    expect(element.dataset.fooBar).toBe("value");

    await action.undo();
    expect(element.dataset.fooBar).toBeUndefined();

    await action.undo(); // no-op
    expect(element.dataset.fooBar).toBeUndefined();

    await action.toggle();
    expect(element.dataset.fooBar).toBe("value");

    await action.toggle();
    expect(element.dataset.fooBar).toBeUndefined();
  });

  test("on omitted, off given", async () => {
    const element = document.createElement("div");

    const action = new SetAttribute(element, {
      dataFooBar: { off: "value" },
    });

    await window.waitForAF();
    expect(element.dataset.fooBar).toBe("value"); // initial state set

    await action.do();
    expect(element.dataset.fooBar).toBeUndefined();

    await action.undo();
    expect(element.dataset.fooBar).toBe("value");

    await action.undo(); // no-op
    expect(element.dataset.fooBar).toBe("value");

    await action.toggle();
    expect(element.dataset.fooBar).toBeUndefined();

    await action.toggle();
    expect(element.dataset.fooBar).toBe("value");
  });
});

describe("parsing", () => {
  test("dataFooBar, on=onVal, off=offVal", async () => {
    const element = document.createElement("div");
    const action = await fetchAction(
      element,
      "set-attribute",
      "dataFooBar, on=onVal, off=offVal",
    );
    expect(action).toBeInstanceOf(SetAttribute);

    await window.waitForAF();
    expect(element.dataset.fooBar).toBe("offVal");

    await action.do();
    expect(element.dataset.fooBar).toBe("onVal");

    await action.undo();
    expect(element.dataset.fooBar).toBe("offVal");
  });

  test("dataFooBar, on=onVal", async () => {
    const element = document.createElement("div");
    const action = await fetchAction(
      element,
      "set-attribute",
      "dataFooBar, on=onVal",
    );
    expect(action).toBeInstanceOf(SetAttribute);

    await window.waitForAF();
    expect(element.dataset.fooBar).toBeUndefined();

    await action.do();
    expect(element.dataset.fooBar).toBe("onVal");

    await action.undo();
    expect(element.dataset.fooBar).toBeUndefined();
  });

  test("dataFooBar, off=offVal", async () => {
    const element = document.createElement("div");
    const action = await fetchAction(
      element,
      "set-attribute",
      "dataFooBar, off=offVal",
    );
    expect(action).toBeInstanceOf(SetAttribute);

    await window.waitForAF();
    expect(element.dataset.fooBar).toBe("offVal");

    await action.do();
    expect(element.dataset.fooBar).toBeUndefined();

    await action.undo();
    expect(element.dataset.fooBar).toBe("offVal");
  });

  test("dataFooBar, on=onVal, off=", async () => {
    const element = document.createElement("div");
    const action = await fetchAction(
      element,
      "set-attribute",
      "dataFooBar, on=onVal, off=",
    );
    expect(action).toBeInstanceOf(SetAttribute);

    await window.waitForAF();
    expect(element.dataset.fooBar).toBe("");

    await action.do();
    expect(element.dataset.fooBar).toBe("onVal");

    await action.undo();
    expect(element.dataset.fooBar).toBe("");
  });

  test("dataFooBar, on=, off=offVal", async () => {
    const element = document.createElement("div");
    const action = await fetchAction(
      element,
      "set-attribute",
      "dataFooBar, on=, off=offVal",
    );
    expect(action).toBeInstanceOf(SetAttribute);

    await window.waitForAF();
    expect(element.dataset.fooBar).toBe("offVal");

    await action.do();
    expect(element.dataset.fooBar).toBe("");

    await action.undo();
    expect(element.dataset.fooBar).toBe("offVal");
  });

  test("dataFooBar, on=", async () => {
    const element = document.createElement("div");
    const action = await fetchAction(
      element,
      "set-attribute",
      "dataFooBar, on=",
    );
    expect(action).toBeInstanceOf(SetAttribute);

    await window.waitForAF();
    expect(element.dataset.fooBar).toBeUndefined();

    await action.do();
    expect(element.dataset.fooBar).toBe("");

    await action.undo();
    expect(element.dataset.fooBar).toBeUndefined();
  });

  test("dataFooBar, off=", async () => {
    const element = document.createElement("div");
    const action = await fetchAction(
      element,
      "set-attribute",
      "dataFooBar, off=",
    );
    expect(action).toBeInstanceOf(SetAttribute);

    await window.waitForAF();
    expect(element.dataset.fooBar).toBe("");

    await action.do();
    expect(element.dataset.fooBar).toBeUndefined();

    await action.undo();
    expect(element.dataset.fooBar).toBe("");
  });
});

test("is registered", async () => {
  const element = document.createElement("div");
  const action = await fetchAction(
    element,
    "set-attribute",
    "dataFooBar, on=value",
  );
  expect(action).toBeInstanceOf(SetAttribute);

  await action.do();
  expect(element.dataset.fooBar).toBe("value");
});
