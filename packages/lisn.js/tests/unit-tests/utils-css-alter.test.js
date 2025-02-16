const { jest, describe, test, expect } = require("@jest/globals");

const utils = window.LISN.utils;

const newObservedElement = () => {
  const element = document.createElement("div");
  document.body.append(element);

  const jestCallback = jest.fn();
  const callbackWrapper = (records) => {
    for (const r of records) {
      jestCallback(r.type, r.oldValue, element.getAttribute(r.attributeName));
    }
  };
  const observer = new MutationObserver(callbackWrapper);
  observer.observe(element, {
    attributes: true,
    attributeOldValue: true,
  });

  return { element, jestCallback };
};

describe("Scheduling and cancelling CSS transitions", () => {
  test("foo -> bar, delay 100; then, bar -> foo delay 10", async () => {
    const { element, jestCallback } = newObservedElement();

    utils.transitionElement(element, "foo", "bar", 100);
    utils.transitionElement(element, "bar", "foo", 10);
    await window.waitFor(200);

    // bar -> foo should cancel foo -> bar
    expect(jestCallback).toHaveBeenCalledTimes(1);
    expect(jestCallback).toHaveBeenCalledWith("attributes", null, "foo");
    expect(element.classList.toString()).toBe("foo");
  });

  test("foo -> bar, delay 10; then, bar -> foo delay 100", async () => {
    const { element, jestCallback } = newObservedElement();

    utils.transitionElement(element, "foo", "bar", 10);
    utils.transitionElement(element, "bar", "foo", 100);
    await window.waitFor(200);

    // foo -> bar should cancel bar -> foo
    expect(jestCallback).toHaveBeenCalledTimes(1);
    expect(jestCallback).toHaveBeenCalledWith("attributes", null, "bar");
    expect(element.classList.toString()).toBe("bar");
  });

  test("foo -> bar, delay 100; 5 later, bar -> foo delay 10", async () => {
    const { element, jestCallback } = newObservedElement();

    utils.transitionElement(element, "foo", "bar", 100);
    await window.waitFor(5);
    utils.transitionElement(element, "bar", "foo", 10);
    await window.waitFor(200);

    // bar -> foo should cancel foo -> bar
    expect(jestCallback).toHaveBeenCalledTimes(1);
    expect(jestCallback).toHaveBeenCalledWith("attributes", null, "foo");
    expect(element.classList.toString()).toBe("foo");
  });

  test("foo -> bar, delay 50; 5 later, bar -> foo delay 100", async () => {
    const { element, jestCallback } = newObservedElement();

    utils.transitionElement(element, "foo", "bar", 50);
    await window.waitFor(5);
    utils.transitionElement(element, "bar", "foo", 100);
    await window.waitFor(200);

    // foo -> bar should cancel bar -> foo
    expect(jestCallback).toHaveBeenCalledTimes(1);
    expect(jestCallback).toHaveBeenCalledWith("attributes", null, "bar");
    expect(element.classList.toString()).toBe("bar");
  });

  test("foo -> bar, delay 5; 20 later, bar -> foo delay 10", async () => {
    const { element, jestCallback } = newObservedElement();

    utils.transitionElement(element, "foo", "bar", 5);
    await window.waitFor(20);

    // foo -> bar completes before bar -> foo is scheduled
    expect(jestCallback).toHaveBeenCalledTimes(1);
    expect(jestCallback).toHaveBeenCalledWith("attributes", null, "bar");

    utils.transitionElement(element, "bar", "foo", 10);
    await window.waitFor(100);

    expect(jestCallback).toHaveBeenCalledTimes(3);
    // by the time the MutationObserver callback is called, the current value
    // is "foo" already (third arg)
    expect(jestCallback).toHaveBeenNthCalledWith(2, "attributes", "bar", "foo"); // bar -> ""
    expect(jestCallback).toHaveBeenNthCalledWith(3, "attributes", "", "foo"); // "" -> foo
    expect(element.classList.toString()).toBe("foo");
  });

  test("foo -> bar, delay 10; then, foo -> bar again delay 100", async () => {
    const { element, jestCallback } = newObservedElement();

    utils.transitionElement(element, "foo", "bar", 10);
    utils.transitionElement(element, "foo", "bar", 100);
    await window.waitFor(200);

    // second foo -> bar should not make any modifications
    expect(jestCallback).toHaveBeenCalledTimes(1);
    expect(jestCallback).toHaveBeenCalledWith("attributes", null, "bar");
    expect(element.classList.toString()).toBe("bar");
  });

  test("foo -> bar, delay 100; then, foo -> bar again delay 10", async () => {
    const { element, jestCallback } = newObservedElement();

    utils.transitionElement(element, "foo", "bar", 100);
    utils.transitionElement(element, "foo", "bar", 10);
    await window.waitFor(200);

    // first foo -> bar should not make any modifications
    expect(jestCallback).toHaveBeenCalledTimes(1);
    expect(jestCallback).toHaveBeenCalledWith("attributes", null, "bar");
    expect(element.classList.toString()).toBe("bar");
  });
});

test("displayElementNow", () => {
  const element = document.createElement("div");
  utils.displayElementNow(element);
  expect(element.classList.toString()).toBe("lisn-display");
});

test("displayElement", async () => {
  const element = document.createElement("div");
  await utils.displayElement(element);
  expect(element.classList.toString()).toBe("lisn-display");
});

test("undisplayElementNow", () => {
  const element = document.createElement("div");
  utils.undisplayElementNow(element);
  expect(element.classList.toString()).toBe("lisn-undisplay");
});

test("undisplayElement", async () => {
  const element = document.createElement("div");
  await utils.undisplayElement(element);
  expect(element.classList.toString()).toBe("lisn-undisplay");
});

test("showElementNow", () => {
  const element = document.createElement("div");
  utils.showElementNow(element);
  expect(element.classList.toString()).toBe("lisn-show");
});

test("showElement", async () => {
  const element = document.createElement("div");
  await utils.showElement(element);
  expect(element.classList.toString()).toBe("lisn-show");
});

test("hideElementNow", () => {
  const element = document.createElement("div");
  utils.hideElementNow(element);
  expect(element.classList.toString()).toBe("lisn-hide");
});

test("hideElement", async () => {
  const element = document.createElement("div");
  await utils.hideElement(element);
  expect(element.classList.toString()).toBe("lisn-hide");
});

test("toggleDisplayElementNow", () => {
  const element = document.createElement("div");
  utils.toggleDisplayElementNow(element);
  expect(element.classList.toString()).toBe("lisn-undisplay");
  utils.toggleDisplayElementNow(element);
  expect(element.classList.toString()).toBe("lisn-display");
});

test("toggleDisplayElement", async () => {
  const element = document.createElement("div");
  await utils.toggleDisplayElement(element);
  expect(element.classList.toString()).toBe("lisn-undisplay");
  await utils.toggleDisplayElement(element);
  expect(element.classList.toString()).toBe("lisn-display");
});

test("toggleShowElementNow", () => {
  const element = document.createElement("div");
  utils.toggleShowElementNow(element);
  expect(element.classList.toString()).toBe("lisn-hide");
  utils.toggleShowElementNow(element);
  expect(element.classList.toString()).toBe("lisn-show");
});

test("toggleShowElement", async () => {
  const element = document.createElement("div");
  await utils.toggleShowElement(element);
  expect(element.classList.toString()).toBe("lisn-hide");
  await utils.toggleShowElement(element);
  expect(element.classList.toString()).toBe("lisn-show");
});

test("isElementHidden", () => {
  const element = document.createElement("div");
  expect(utils.isElementHidden(element)).toBe(false);
  utils.showElementNow(element);
  expect(utils.isElementHidden(element)).toBe(false);
  utils.hideElementNow(element);
  expect(utils.isElementHidden(element)).toBe(true);
});

test("isElementUndisplayed", () => {
  const element = document.createElement("div");
  expect(utils.isElementUndisplayed(element)).toBe(false);
  utils.displayElementNow(element);
  expect(utils.isElementUndisplayed(element)).toBe(false);
  utils.undisplayElementNow(element);
  expect(utils.isElementUndisplayed(element)).toBe(true);
});
