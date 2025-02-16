const { describe, test, expect } = require("@jest/globals");

const { TrackSize } = window.LISN.widgets;

describe("basic", () => {
  test("all default", async () => {
    const element = document.createElement("div");
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    const widget = new TrackSize(element);
    await window.waitForAF();
    await window.waitForAF();

    expect(
      element.style.getPropertyValue("--lisn-js--border-width"),
    ).toBeTruthy();

    await widget.destroy();
    await window.waitForAF();
    await window.waitForAF();
    expect(element.style.getPropertyValue("--lisn-js--border-width")).toBe("");
  });
});

test("TrackSize.get", async () => {
  const element = document.createElement("div");
  element.append(document.createElement("div"));
  element.append(document.createElement("div"));
  document.body.append(element);

  const widget = new TrackSize(element);
  expect(TrackSize.get(element)).toBe(widget);

  await widget.destroy();
  expect(TrackSize.get(element)).toBe(null);
});

describe("is registered", () => {
  test(".lisn-track-size", async () => {
    const element = document.createElement("div");
    element.classList.add("lisn-track-size");
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    await window.waitForMO();

    expect(TrackSize.get(element)).toBeInstanceOf(TrackSize);
  });

  test("[lisn-track-size='']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnTrackSize = "";
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    await window.waitForMO();

    expect(TrackSize.get(element)).toBeInstanceOf(TrackSize);
  });

  test("[lisn-track-size='...']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnTrackSize = "random";
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    await window.waitForMO();

    expect(TrackSize.get(element)).toBeInstanceOf(TrackSize);
  });
});

// TODO test with custom options
