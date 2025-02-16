const { describe, test, expect } = require("@jest/globals");

const { TrackScroll } = window.LISN.widgets;

describe("basic", () => {
  test("all default", async () => {
    const element = document.createElement("div");
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    const widget = new TrackScroll(element);
    await window.waitForAF();
    await window.waitForAF();

    expect(
      element.style.getPropertyValue("--lisn-js--scroll-top"),
    ).toBeTruthy();

    await widget.destroy();
    await window.waitForAF();
    await window.waitForAF();
    expect(element.style.getPropertyValue("--lisn-js--scroll-top")).toBe("");
  });
});

test("TrackScroll.get", async () => {
  const element = document.createElement("div");
  element.append(document.createElement("div"));
  element.append(document.createElement("div"));
  document.body.append(element);

  const widget = new TrackScroll(element);
  expect(TrackScroll.get(element)).toBe(widget);

  await widget.destroy();
  expect(TrackScroll.get(element)).toBe(null);
});

describe("is registered", () => {
  test(".lisn-track-scroll", async () => {
    const element = document.createElement("div");
    element.classList.add("lisn-track-scroll");
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    await window.waitForMO();

    expect(TrackScroll.get(element)).toBeInstanceOf(TrackScroll);
  });

  test("[lisn-track-scroll='']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnTrackScroll = "";
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    await window.waitForMO();

    expect(TrackScroll.get(element)).toBeInstanceOf(TrackScroll);
  });

  test("[lisn-track-scroll='...']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnTrackScroll = "random";
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    await window.waitForMO();

    expect(TrackScroll.get(element)).toBeInstanceOf(TrackScroll);
  });
});

// TODO test with custom options
