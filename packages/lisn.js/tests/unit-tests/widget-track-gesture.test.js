const { describe, test, expect } = require("@jest/globals");

const { TrackGesture } = window.LISN.widgets;

describe("basic", () => {
  test("all default", async () => {
    const element = document.createElement("div");
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    const widget = new TrackGesture(element);
    await window.waitForAF();
    await window.waitForAF();

    expect(
      element.style.getPropertyValue("--lisn-js--scroll-delta-x"),
    ).toBeTruthy();

    await widget.destroy();
    await window.waitForAF();
    await window.waitForAF();
    expect(element.style.getPropertyValue("--lisn-js--scroll-delta-x")).toBe(
      "",
    );
  });
});

test("TrackGesture.get", async () => {
  const element = document.createElement("div");
  element.append(document.createElement("div"));
  element.append(document.createElement("div"));
  document.body.append(element);

  const widget = new TrackGesture(element);
  expect(TrackGesture.get(element)).toBe(widget);

  await widget.destroy();
  expect(TrackGesture.get(element)).toBe(null);
});

describe("is registered", () => {
  test(".lisn-track-gesture", async () => {
    const element = document.createElement("div");
    element.classList.add("lisn-track-gesture");
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    await window.waitForMO();

    expect(TrackGesture.get(element)).toBeInstanceOf(TrackGesture);
  });

  test("[lisn-track-gesture='']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnTrackGesture = "";
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    await window.waitForMO();

    expect(TrackGesture.get(element)).toBeInstanceOf(TrackGesture);
  });

  test("[lisn-track-gesture='...']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnTrackGesture = "random";
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    await window.waitForMO();

    expect(TrackGesture.get(element)).toBeInstanceOf(TrackGesture);
  });
});

// TODO test with custom options
