const { jest, describe, test, expect } = require("@jest/globals");

const settings = window.LISN.settings;
const { Widget, registerWidget, getWidgetConfig } = window.LISN.widgets;
const { randId, validateNumber, validateBoolean } = window.LISN.utils;

describe("Widget", () => {
  test("enable/disable/destroy", async () => {
    const widget = new Widget(document.body);
    expect(widget.isDisabled()).toBe(false);
    expect(widget.isDestroyed()).toBe(false);

    await widget.enable(); // no-op
    expect(widget.isDisabled()).toBe(false);
    expect(widget.isDestroyed()).toBe(false);

    await widget.disable();
    expect(widget.isDisabled()).toBe(true);
    expect(widget.isDestroyed()).toBe(false);

    await widget.disable(); // no-op
    expect(widget.isDisabled()).toBe(true);
    expect(widget.isDestroyed()).toBe(false);

    await widget.enable();
    expect(widget.isDisabled()).toBe(false);
    expect(widget.isDestroyed()).toBe(false);

    await widget.destroy();
    expect(widget.isDisabled()).toBe(true);
    expect(widget.isDestroyed()).toBe(true);

    await widget.disable(); // no-op
    await widget.enable(); // no-op
    await widget.destroy(); // no-op
    expect(widget.isDisabled()).toBe(true);
    expect(widget.isDestroyed()).toBe(true);
  });

  test("onEnable/onDisable/onDestroy", async () => {
    const onEnable = jest.fn();
    const onDisable = jest.fn();
    const onDestroy = jest.fn();

    const widget = new Widget(document.body);
    widget.onEnable(onEnable);
    widget.onDisable(onDisable);
    widget.onDestroy(onDestroy);
    await window.waitFor(0); // callbacks is async

    expect(onEnable).toHaveBeenCalledTimes(0);
    expect(onDisable).toHaveBeenCalledTimes(0);
    expect(onDestroy).toHaveBeenCalledTimes(0);

    await widget.enable(); // no-op as it's enabled

    expect(onEnable).toHaveBeenCalledTimes(0);
    expect(onDisable).toHaveBeenCalledTimes(0);
    expect(onDestroy).toHaveBeenCalledTimes(0);

    await widget.disable();

    expect(onEnable).toHaveBeenCalledTimes(0);
    expect(onDisable).toHaveBeenCalledTimes(1);
    expect(onDisable).toHaveBeenCalledWith(widget);
    expect(onDestroy).toHaveBeenCalledTimes(0);

    await widget.disable(); // no-op

    expect(onEnable).toHaveBeenCalledTimes(0);
    expect(onDisable).toHaveBeenCalledTimes(1);
    expect(onDestroy).toHaveBeenCalledTimes(0);

    await widget.enable();

    expect(onEnable).toHaveBeenCalledTimes(1);
    expect(onEnable).toHaveBeenCalledWith(widget);
    expect(onDisable).toHaveBeenCalledTimes(1);
    expect(onDestroy).toHaveBeenCalledTimes(0);

    await widget.destroy();

    expect(onEnable).toHaveBeenCalledTimes(1);
    expect(onDisable).toHaveBeenCalledTimes(2); // destroy disables it beforehand
    expect(onDestroy).toHaveBeenCalledTimes(1);
    expect(onDestroy).toHaveBeenCalledWith(widget);

    await widget.disable(); // no-op
    await widget.enable(); // no-op
    await widget.destroy(); // no-op

    // no new calls
    expect(onEnable).toHaveBeenCalledTimes(1);
    expect(onDisable).toHaveBeenCalledTimes(2);
    expect(onDestroy).toHaveBeenCalledTimes(1);
  });

  test("onEnable/onDisable/onDestroy without awaiting", async () => {
    const onEnable = jest.fn();
    const onDisable = jest.fn();
    const onDestroy = jest.fn();

    const widget = new Widget(document.body);
    widget.onEnable(onEnable);
    widget.onDisable(onDisable);
    widget.onDestroy(onDestroy);
    await window.waitFor(0); // callbacks is async

    expect(onEnable).toHaveBeenCalledTimes(0);
    expect(onDisable).toHaveBeenCalledTimes(0);
    expect(onDestroy).toHaveBeenCalledTimes(0);

    widget.disable(); // +1 disable
    widget.enable(); // +1 enable
    widget.disable(); // +1 disable
    widget.enable(); // +1 enable
    widget.destroy(); // +1 disable and destroy

    await window.waitFor(0); // callbacks is async
    expect(onEnable).toHaveBeenCalledTimes(2);
    expect(onDisable).toHaveBeenCalledTimes(3);
    expect(onDestroy).toHaveBeenCalledTimes(1);
  });

  test("offEnable/offDisable/offDestroy", async () => {
    const onEnable = jest.fn();
    const onDisable = jest.fn();
    const onDestroy = jest.fn();

    const widget = new Widget(document.body);
    widget.onEnable(onEnable);
    widget.onDisable(onDisable);
    widget.onDestroy(onDestroy);
    await window.waitFor(0); // callbacks is async

    widget.offEnable(onEnable);
    widget.offDisable(onDisable);
    widget.offDestroy(onDestroy);

    expect(onEnable).toHaveBeenCalledTimes(0);
    expect(onDisable).toHaveBeenCalledTimes(0);
    expect(onDestroy).toHaveBeenCalledTimes(0);

    await widget.enable(); // no-op as it's enabled
    await widget.disable();
    await widget.destroy();

    expect(onEnable).toHaveBeenCalledTimes(0);
    expect(onDisable).toHaveBeenCalledTimes(0);
    expect(onDestroy).toHaveBeenCalledTimes(0);
  });
});

describe("registerWidget", () => {
  test("with autoWidgets true", async () => {
    settings.autoWidgets = true; // default
    const id = randId();
    let widget;
    const setupFn = jest.fn((e) => {
      widget = new Widget(e, { id });
      return widget;
    });
    registerWidget("test", setupFn, null, { selector: "p" });

    const span = document.createElement("span");
    document.body.append(span);
    await window.waitForMO();

    expect(setupFn).toHaveBeenCalledTimes(0); // no match

    const p = document.createElement("p");
    document.body.append(p);
    await window.waitForMO();

    expect(setupFn).toHaveBeenCalledTimes(1);

    expect(Widget.get(p, id)).toBe(widget);
    expect(widget.isDestroyed()).toBe(false);

    p.remove();

    await window.waitForMO();
    expect(Widget.get(p, id)).toBe(null);
    expect(widget.isDestroyed()).toBe(true);
  });

  test("with autoWidgets false", async () => {
    settings.autoWidgets = false;
    const setupFn = jest.fn();
    registerWidget("test", setupFn, null, { selector: "h1" });

    const h1 = document.createElement("h1");
    document.body.append(h1);
    await window.waitForMO();

    expect(setupFn).toHaveBeenCalledTimes(0);
    settings.autoWidgets = true; // reset
  });

  test("with css class and default selector", async () => {
    const id = randId();
    let widget;
    const setupFn = jest.fn((e) => {
      widget = new Widget(e, { id });
      return widget;
    });
    registerWidget("test-a", setupFn);

    const span = document.createElement("span");
    document.body.append(span);
    await window.waitForMO();

    expect(setupFn).toHaveBeenCalledTimes(0); // no match

    const el = document.createElement("div");
    el.classList.add("lisn-test-a");
    document.body.append(el);
    await window.waitForMO();

    expect(setupFn).toHaveBeenCalledTimes(1);
    expect(setupFn).toHaveBeenCalledWith(el, undefined);

    expect(Widget.get(el, id)).toBe(widget);
    expect(widget.isDestroyed()).toBe(false);

    el.remove();

    await window.waitForMO();
    expect(Widget.get(el, id)).toBe(null);
    expect(widget.isDestroyed()).toBe(true);
  });

  test("with configValidator and default selector", async () => {
    const id = randId();
    let widget;
    const setupFn = jest.fn((e) => {
      widget = new Widget(e, { id });
      return widget;
    });
    registerWidget("test-b", setupFn, { opt: (k, v) => v });

    const span = document.createElement("span");
    document.body.append(span);
    await window.waitForMO();

    expect(setupFn).toHaveBeenCalledTimes(0); // no match

    const el = document.createElement("div");
    el.dataset.lisnTestB = "opt=a | random=b ; opt=ignored";
    document.body.append(el);
    await window.waitForMO();

    expect(setupFn).toHaveBeenCalledTimes(1);
    expect(setupFn).toHaveBeenCalledWith(el, { opt: "a" });

    expect(Widget.get(el, id)).toBe(widget);
    expect(widget.isDestroyed()).toBe(false);

    el.remove();

    await window.waitForMO();
    expect(Widget.get(el, id)).toBe(null);
    expect(widget.isDestroyed()).toBe(true);
  });

  test("with configValidator and multiple", async () => {
    const id = randId();
    let widget;
    const setupFn = jest.fn((e) => {
      widget = new Widget(e, { id });
      return widget;
    });

    registerWidget(
      "test-c",
      setupFn,
      { opt: (k, v) => v },
      { supportsMultiple: true },
    );

    const span = document.createElement("span");
    document.body.append(span);
    await window.waitForMO();

    expect(setupFn).toHaveBeenCalledTimes(0); // no match

    const el = document.createElement("div");
    el.dataset.lisnTestC = "opt=a | random=b ; opt=b";
    document.body.append(el);
    await window.waitForMO();

    expect(setupFn).toHaveBeenCalledTimes(2);
    expect(setupFn).toHaveBeenCalledWith(el, { opt: "a" });
    expect(setupFn).toHaveBeenCalledWith(el, { opt: "b" });

    expect(Widget.get(el, id)).toBe(widget);
    expect(widget.isDestroyed()).toBe(false);

    el.remove();

    await window.waitForMO();
    expect(Widget.get(el, id)).toBe(null);
    expect(widget.isDestroyed()).toBe(true);
  });

  test("with custom selector", async () => {
    const id = randId();
    let widget;
    const setupFn = jest.fn((e) => {
      widget = new Widget(e, { id });
      return widget;
    });
    registerWidget("ignored", setupFn, {}, { selector: ".test-custom-a" });

    const span = document.createElement("span");
    document.body.append(span);
    await window.waitForMO();

    expect(setupFn).toHaveBeenCalledTimes(0); // no match

    const el = document.createElement("div");
    el.classList.add("test-custom-a");
    document.body.append(el);
    await window.waitForMO();

    expect(setupFn).toHaveBeenCalledTimes(1);
    expect(setupFn).toHaveBeenCalledWith(el, {});

    expect(Widget.get(el, id)).toBe(widget);
    expect(widget.isDestroyed()).toBe(false);

    el.remove();

    await window.waitForMO();
    expect(Widget.get(el, id)).toBe(null);
    expect(widget.isDestroyed()).toBe(true);
  });
});

describe("Widget.get", () => {
  test("no ID", async () => {
    new Widget(document.body);
    expect(Widget.get(document.body, "")).toBe(null);
  });

  test("blank ID", async () => {
    new Widget(document.body, { id: "" });
    expect(Widget.get(document.body, "")).toBe(null);
  });

  test("with ID", async () => {
    const widget = new Widget(document.body, { id: "foo" });
    expect(Widget.get(document.body, "foo")).toBe(widget);

    await widget.destroy();
    expect(Widget.get(document.body, "foo")).toBe(null);
  });
});

describe("getWidgetConfig + validateNumber + validateBoolean", () => {
  const validator = {
    bool: jest.fn((key, value) => validateBoolean(key, value)),
    numA: jest.fn((key, value) => validateNumber(key, value)),
    numB: jest.fn((key, value) => validateNumber(key, value) ?? 5),
  };

  test("null", () => {
    expect(getWidgetConfig(null, validator)).toEqual({
      numB: 5,
    });
  });

  test("{}", () => {
    expect(getWidgetConfig({}, validator)).toEqual({
      numB: 5,
    });
  });

  test("''", () => {
    expect(getWidgetConfig("", validator)).toEqual({
      numB: 5,
    });
  });

  test("some given: as object", () => {
    expect(getWidgetConfig({ bool: true, numA: 1 }, validator)).toEqual({
      bool: true,
      numA: 1,
      numB: 5,
    });
  });

  test("some given: as string with whitespace", () => {
    expect(getWidgetConfig(" bool = true  |  numA = 1", validator)).toEqual({
      bool: true,
      numA: 1,
      numB: 5,
    });
  });

  test("some given: as string, kebab-case + overriding default", () => {
    expect(getWidgetConfig("bool=true|num-a=1|num-b=10", validator)).toEqual({
      bool: true,
      numA: 1,
      numB: 10,
    });
  });

  test("bool with no value + camelCase", () => {
    expect(getWidgetConfig("bool|numA=1", validator)).toEqual({
      bool: true,
      numA: 1,
      numB: 5,
    });
  });

  test("number as string", () => {
    expect(getWidgetConfig({ bool: true, numA: "1" }, validator)).toEqual({
      bool: true,
      numA: 1,
      numB: 5,
    });
  });

  test("invalid 1", () => {
    expect(() => getWidgetConfig("numA=1px", validator)).toThrow(
      /'numA' must be a number/,
    );
  });

  test("invalid 1", () => {
    expect(() => getWidgetConfig({ numA: "1px" }, validator)).toThrow(
      /'numA' must be a number/,
    );
  });

  test("invalid 2", () => {
    expect(() => getWidgetConfig("bool=x", validator)).toThrow(
      /'bool' must be "true" or "false"/,
    );
  });

  test("invalid 2", () => {
    expect(() => getWidgetConfig({ bool: "x" }, validator)).toThrow(
      /'bool' must be "true" or "false"/,
    );
  });
});
