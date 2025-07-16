const { beforeAll, describe, test, expect } = require("@jest/globals");

const { ScrollToTop } = window.LISN.widgets;
const { isElementHidden, isElementUndisplayed } = window.LISN.utils;

document.documentElement.enableScroll();
const scrollToTopPromise = window.LISN.utils.waitForElement(() =>
  document.querySelector(".lisn-scroll-to-top__root"),
);

ScrollToTop.enableMain();

// The ViewWatcher instance is being reused, so there will be only 1
// ViewWatcher and 1 XIntersectionObserver.
let observer = null;
beforeAll(async () => {
  Promise.resolve().then(() => {
    observer =
      window.IntersectionObserver.instancesList[
        window.IntersectionObserver.instancesList.length - 1
      ];
  });
});

const newScrollingElement = () => {
  const element = document.createElement("div");
  element.enableScroll();
  return element;
};

// Since overlays with same properties will be reused, ensure each test uses a
// unique offset.
const newWidget = async (config = {}) => {
  const element = document.createElement("div");
  document.body.append(element);

  const offset = Math.floor(Math.random() * 1000) + "px";
  const widget = new ScrollToTop(element, {
    offset: `top: ${offset}`,
    ...config,
  });

  await window.waitFor(100);
  let overlay = null,
    thisObserver = null;

  if (!config.scrollable) {
    thisObserver = observer;
    expect(thisObserver.targets.size).toBeGreaterThanOrEqual(1);
    overlay = getLastTarget(thisObserver);
    expect(overlay.classList.contains("lisn-overlay")).toBe(true);
    expect(overlay.style.getPropertyValue("position")).toBe("absolute");
    expect(overlay.style.getPropertyValue("top")).toBe(offset);
    expect(overlay.parentElement).toBe(document.body);
  }
  // TODO get the observer if using a custom scrollable?

  return {
    widget,
    offset,
    observer: thisObserver,
    element,
    overlay,
  };
};

const getLastTarget = (observer) => {
  return Array.from(observer.targets)[observer.targets.size - 1];
};

test("enableMain", async () => {
  const element = await scrollToTopPromise;
  expect(element).toBeTruthy();
  expect(element).toBe(ScrollToTop.get()?.getElement());
});

test("basic + offset trigger", async () => {
  const { observer, element, overlay } = await newWidget();

  // initial view is at
  await window.waitForVW();
  expect(isElementHidden(element)).toBe(false);

  observer.trigger(overlay, ["above"]);
  await window.waitForVW();
  expect(isElementHidden(element)).toBe(true);

  observer.trigger(overlay, ["right"]);
  await window.waitForVW();
  expect(isElementHidden(element)).toBe(true); // no change since last

  observer.trigger(overlay, ["below"]);
  await window.waitForVW();
  expect(isElementHidden(element)).toBe(false);

  observer.trigger(overlay, ["left"]);
  await window.waitForVW();
  expect(isElementHidden(element)).toBe(false); // no change since last

  observer.trigger(overlay, ["above"]);
  await window.waitForVW();
  expect(isElementHidden(element)).toBe(true);

  observer.trigger(overlay, ["at"]);
  await window.waitForVW();
  expect(isElementHidden(element)).toBe(false);

  expect(isElementUndisplayed(element)).toBe(false);
  expect(observer.targets.has(overlay)).toBe(true);
});

test("disable", async () => {
  const { widget, observer, element, overlay } = await newWidget();

  widget.disable();

  await window.waitForAF();
  expect(isElementUndisplayed(element)).toBe(true);
  expect(observer.targets.has(overlay)).toBe(true);

  widget.enable();

  await window.waitForAF();
  expect(isElementUndisplayed(element)).toBe(false);
  expect(observer.targets.has(overlay)).toBe(true);
});

describe("destroy", () => {
  test("basic", async () => {
    const { widget, observer, element, overlay } = await newWidget();
    await window.waitFor(100);
    expect(element.parentElement).toBe(document.body);

    await widget.destroy();

    await window.waitForAF();
    expect(isElementUndisplayed(element)).toBe(false);
    expect(observer.targets.has(overlay)).toBe(false);
    expect(element.children.length).toBe(0); // arrow removed
  });

  test("wrapping/unwrapping when custom scrollable", async () => {
    const scrollable = newScrollingElement();
    const { widget, element } = await newWidget({ scrollable });
    await window.waitFor(100);
    expect(element.parentElement.parentElement).toBe(document.body); // wrapped

    await widget.destroy();

    await window.waitForAF();
    expect(element.parentElement).toBe(document.body); // unwrapped
    expect(element.children.length).toBe(0); // arrow removed
  });
});

describe("click", () => {
  test("default scrollable", async () => {
    document.documentElement.scrollTo(200, 200);
    await window.waitFor(100);
    expect(document.documentElement.scrollTop).toBe(200);
    expect(document.documentElement.scrollLeft).toBe(200);

    const { element } = await newWidget();
    element.dispatchEvent(window.newClick());
    await window.waitFor(1200); // scroll takes 1s
    expect(document.documentElement.scrollTop).toBe(0);
    expect(document.documentElement.scrollLeft).toBe(0);
  });

  test("custom scrollable", async () => {
    const scrollable = newScrollingElement();
    scrollable.scrollTo(200, 200);
    await window.waitFor(100);
    expect(scrollable.scrollTop).toBe(200);
    expect(scrollable.scrollLeft).toBe(200);

    const { element } = await newWidget({ scrollable });
    element.dispatchEvent(window.newClick());
    await window.waitFor(1200); // scroll takes 1s
    expect(scrollable.scrollTop).toBe(0);
    expect(scrollable.scrollLeft).toBe(0);
  });
});

test("ScrollToTop.get", async () => {
  const element = document.createElement("div");
  document.body.append(element);

  const widget = new ScrollToTop(element);
  expect(ScrollToTop.get(element)).toBe(widget);

  await widget.destroy();
  expect(ScrollToTop.get(element)).toBe(null);
});

describe("is registered", () => {
  test(".lisn-scroll-to-top", async () => {
    const element = document.createElement("div");
    element.classList.add("lisn-scroll-to-top");
    document.body.append(element);

    await window.waitForMO();

    expect(ScrollToTop.get(element)).toBeInstanceOf(ScrollToTop);
  });

  test("[data-lisn-scroll-to-top='']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnScrollToTop = "";
    document.body.append(element);

    await window.waitForMO();

    expect(ScrollToTop.get(element)).toBeInstanceOf(ScrollToTop);
  });

  test("[data-lisn-scroll-to-top='...']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnScrollToTop = "position=left";
    document.body.append(element);

    await window.waitForMO();

    expect(ScrollToTop.get(element)).toBeInstanceOf(ScrollToTop);
  });
});
