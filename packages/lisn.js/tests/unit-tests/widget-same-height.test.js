const { describe, test, expect } = require("@jest/globals");

const { SameHeight } = window.LISN.widgets;

describe("basic", () => {
  test("all default", async () => {
    const element = document.createElement("div");
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    const widget = new SameHeight(element);
    const items = widget.getItems();
    expect(items).toEqual([...element.children]);

    await window.waitForAF();
    await window.waitForAF();

    expect(element.classList.contains("lisn-same-height__root")).toBe(true);
    for (const child of element.children) {
      expect(child.classList.contains("lisn-same-height__item")).toBe(true);
    }
  });

  test("overriding type", async () => {
    const element = document.createElement("div");
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    element.children[0].dataset.lisnSameHeightItem = "text";
    element.children[1].dataset.lisnSameHeightItem = ""; // auto-detect as image
    document.body.append(element);

    const widget = new SameHeight(element);
    const itemConfigs = widget.getItemConfigs();
    expect([...itemConfigs.keys()]).toEqual([...element.children]);
    expect(itemConfigs.get(element.children[0])).toBe("text");
    expect(itemConfigs.get(element.children[1])).toBe("image");
  });

  test("no children", () => {
    const element = document.createElement("div");
    document.body.append(element);

    expect(() => new SameHeight(element)).toThrow(
      /SameHeight must have more than 1 item/,
    );
  });

  test("one child", () => {
    const element = document.createElement("div");
    element.append(document.createElement("div"));
    document.body.append(element);

    expect(() => new SameHeight(element)).toThrow(
      /SameHeight must have more than 1 item/,
    );
  });
});

// TODO re-creating test

test("SameHeight.get", async () => {
  const element = document.createElement("div");
  element.append(document.createElement("div"));
  element.append(document.createElement("div"));
  document.body.append(element);

  const widget = new SameHeight(element);
  expect(SameHeight.get(element)).toBe(widget);

  await widget.destroy();
  expect(SameHeight.get(element)).toBe(null);
});

describe("is registered", () => {
  test(".lisn-same-height", async () => {
    const element = document.createElement("div");
    element.classList.add("lisn-same-height");
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    await window.waitForMO();

    expect(SameHeight.get(element)).toBeInstanceOf(SameHeight);
  });

  test("[lisn-same-height='']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnSameHeight = "";
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    await window.waitForMO();

    expect(SameHeight.get(element)).toBeInstanceOf(SameHeight);
  });

  test("[lisn-same-height='...']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnSameHeight = "max-width-r=3";
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    await window.waitForMO();

    expect(SameHeight.get(element)).toBeInstanceOf(SameHeight);
  });
});

// TODO test with custom options
