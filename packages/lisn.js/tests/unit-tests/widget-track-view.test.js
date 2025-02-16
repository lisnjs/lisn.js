const { describe, beforeAll, test, expect } = require("@jest/globals");

const { fetchViewportOverlay } = window.LISN.utils;
const { TrackView } = window.LISN.widgets;

let viewportOverlay;

// set non-0 size for window and document
const VP_WIDTH = 400;
const VP_HEIGHT = 200;
document.documentElement.resize([800, 400], [VP_WIDTH, VP_HEIGHT]);
beforeAll(async () => {
  viewportOverlay = await fetchViewportOverlay();
  viewportOverlay.resize([VP_WIDTH, VP_HEIGHT]);
  await window.waitFor(100);
});

describe("basic", () => {
  test("all default", async () => {
    const element = document.createElement("div");
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    const widget = new TrackView(element);
    await window.waitForAF();
    await window.waitFor(100);

    expect(
      element.style.getPropertyValue("--lisn-js--r-v-middle"),
    ).toBeTruthy();

    await widget.destroy();
    await window.waitForAF();
    await window.waitFor(100);
    expect(element.style.getPropertyValue("--lisn-js--r-v-middle")).toBe("");
  });
});

test("TrackView.get", async () => {
  const element = document.createElement("div");
  element.append(document.createElement("div"));
  element.append(document.createElement("div"));
  document.body.append(element);

  const widget = new TrackView(element);
  expect(TrackView.get(element)).toBe(widget);

  await widget.destroy();
  expect(TrackView.get(element)).toBe(null);
});

describe("is registered", () => {
  test(".lisn-track-view", async () => {
    const element = document.createElement("div");
    element.classList.add("lisn-track-view");
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    await window.waitForMO();

    expect(TrackView.get(element)).toBeInstanceOf(TrackView);
  });

  test("[lisn-track-view='']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnTrackView = "";
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    await window.waitForMO();

    expect(TrackView.get(element)).toBeInstanceOf(TrackView);
  });

  test("[lisn-track-view='...']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnTrackView = "random";
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    await window.waitForMO();

    expect(TrackView.get(element)).toBeInstanceOf(TrackView);
  });
});

// TODO test with custom options
