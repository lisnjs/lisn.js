const { jest, describe, test, expect } = require("@jest/globals");

const utils = window.LISN.utils;
const { DOMWatcher } = window.LISN.watchers;

const newWatcherElement = async () => {
  const { parentEl, parentElB, childEl, childElB } = newElement();

  document.body.append(parentEl, parentElB);
  await window.waitForMO();
  const callback = jest.fn();

  DOMWatcher.reuse().onMutation(callback);
  await window.waitForMO();

  expect(callback).toHaveBeenCalledTimes(0);
  return { parentEl, parentElB, childEl, childElB, callback };
};

// parentEl
//   |--- childEl
//   |--- childElB
// parentElB
const newElement = () => {
  const parentEl = document.createElement("div");
  parentEl.id = "parent";
  const parentElB = document.createElement("div");
  parentElB.id = "parentB";
  const childEl = document.createElement("div");
  childEl.id = "child";
  const childElB = document.createElement("div");
  childElB.id = "childB";

  parentEl.append(childEl, childElB);

  return { parentEl, parentElB, childEl, childElB };
};

describe("wrapElementNow", () => {
  test("ignoreMove: true", async () => {
    const { parentEl, callback } = await newWatcherElement();
    utils.wrapElementNow(parentEl, {
      ignoreMove: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("ignoreMove: false", async () => {
    const { parentEl, callback } = await newWatcherElement();
    utils.wrapElementNow(parentEl);

    await window.waitForMO();
    expect(callback.mock.calls.length).toBeGreaterThan(0);
  });

  test("default for span", () => {
    const el = document.createElement("span");
    const wrapper = utils.wrapElementNow(el);
    expect(wrapper.tagName).toBe("SPAN");
    expect(el.parentElement).toBe(wrapper);
  });

  test("default for div", () => {
    const el = document.createElement("div");
    const wrapper = utils.wrapElementNow(el);
    expect(wrapper.tagName).toBe("DIV");
    expect(el.parentElement).toBe(wrapper);
  });

  test("supplied tag for div", () => {
    const el = document.createElement("div");
    const wrapper = utils.wrapElementNow(el, {
      wrapper: "section",
    });
    expect(wrapper.tagName).toBe("SECTION");
    expect(el.parentElement).toBe(wrapper);
  });

  test("supplied tag for span", () => {
    const el = document.createElement("span");
    const wrapper = utils.wrapElementNow(el, {
      wrapper: "p",
    });
    expect(wrapper.tagName).toBe("P");
    expect(el.parentElement).toBe(wrapper);
  });

  test("supplied wrapper", () => {
    const el = document.createElement("div");
    const wrapper = document.createElement("div");
    const result = utils.wrapElementNow(el, {
      wrapper,
    });
    expect(result).toBe(wrapper);
    expect(el.parentElement).toBe(wrapper);
  });
});

describe("wrapElement", () => {
  test("ignoreMove: true", async () => {
    const { parentEl, callback } = await newWatcherElement();
    await utils.wrapElement(parentEl, {
      ignoreMove: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("ignoreMove: false", async () => {
    const { parentEl, callback } = await newWatcherElement();
    await utils.wrapElement(parentEl);

    await window.waitForMO();
    expect(callback.mock.calls.length).toBeGreaterThan(0);
  });

  test("default for span", async () => {
    const el = document.createElement("span");
    const wrapper = await utils.wrapElement(el);
    expect(wrapper.tagName).toBe("SPAN");
    expect(el.parentElement).toBe(wrapper);
  });

  test("default for div", async () => {
    const el = document.createElement("div");
    const wrapper = await utils.wrapElement(el);
    expect(wrapper.tagName).toBe("DIV");
    expect(el.parentElement).toBe(wrapper);
  });

  test("supplied tag for div", async () => {
    const el = document.createElement("div");
    const wrapper = await utils.wrapElement(el, {
      wrapper: "section",
    });
    expect(wrapper.tagName).toBe("SECTION");
    expect(el.parentElement).toBe(wrapper);
  });

  test("supplied tag for span", async () => {
    const el = document.createElement("span");
    const wrapper = await utils.wrapElement(el, {
      wrapper: "p",
    });
    expect(wrapper.tagName).toBe("P");
    expect(el.parentElement).toBe(wrapper);
  });

  test("supplied wrapper", async () => {
    const el = document.createElement("div");
    const wrapper = document.createElement("div");
    const result = await utils.wrapElement(el, {
      wrapper,
    });
    expect(result).toBe(wrapper);
    expect(el.parentElement).toBe(wrapper);
  });
});

describe("replaceElementNow", () => {
  test("ignoreMove: true", async () => {
    const { parentElB, childEl, callback } = await newWatcherElement();
    utils.replaceElementNow(childEl, parentElB, {
      ignoreMove: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("ignoreMove: false", async () => {
    const { parentElB, childEl, callback } = await newWatcherElement();
    utils.replaceElementNow(childEl, parentElB);

    await window.waitForMO();
    expect(callback.mock.calls.length).toBeGreaterThan(0);
  });

  test("default", () => {
    const { parentEl, parentElB, childEl } = newElement();

    expect(childEl.parentElement).toBe(parentEl);
    utils.replaceElementNow(childEl, parentElB);

    expect(parentElB.parentElement).toBe(parentEl);
    expect(childEl.parentElement).toBe(null);
  });
});

describe("replaceElement", () => {
  test("ignoreMove: true", async () => {
    const { parentElB, childEl, callback } = await newWatcherElement();
    await utils.replaceElement(childEl, parentElB, {
      ignoreMove: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("ignoreMove: false", async () => {
    const { parentElB, childEl, callback } = await newWatcherElement();
    await utils.replaceElement(childEl, parentElB);

    await window.waitForMO();
    expect(callback.mock.calls.length).toBeGreaterThan(0);
  });

  test("default", async () => {
    const { parentEl, parentElB, childEl } = newElement();

    expect(childEl.parentElement).toBe(parentEl);
    await utils.replaceElement(childEl, parentElB);

    expect(parentElB.parentElement).toBe(parentEl);
    expect(childEl.parentElement).toBe(null);
  });
});

describe("swapElementsNow", () => {
  test("ignoreMove: true", async () => {
    const { parentElB, childEl, callback } = await newWatcherElement();
    utils.swapElementsNow(childEl, parentElB, {
      ignoreMove: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("ignoreMove: false", async () => {
    const { parentElB, childEl, callback } = await newWatcherElement();
    utils.swapElementsNow(childEl, parentElB);

    await window.waitForMO();
    expect(callback.mock.calls.length).toBeGreaterThan(0);
  });

  test("from same parent", () => {
    const { parentEl, childEl, childElB } = newElement();

    expect(childEl.parentElement).toBe(parentEl);
    expect(childElB.parentElement).toBe(parentEl);
    expect(childEl.nextElementSibling).toBe(childElB);
    utils.swapElementsNow(childEl, childElB);

    expect(childEl.parentElement).toBe(parentEl);
    expect(childElB.parentElement).toBe(parentEl);
    expect(childElB.nextElementSibling).toBe(childEl);
  });

  test("from different parents", () => {
    const { parentEl, parentElB, childEl, childElB } = newElement();
    parentElB.append(childElB);

    expect(childEl.parentElement).toBe(parentEl);
    expect(childElB.parentElement).toBe(parentElB);
    utils.swapElementsNow(childEl, childElB);

    expect(childEl.parentElement).toBe(parentElB);
    expect(childElB.parentElement).toBe(parentEl);
  });
});

describe("swapElements", () => {
  test("ignoreMove: true", async () => {
    const { parentElB, childEl, callback } = await newWatcherElement();
    await utils.swapElements(childEl, parentElB, {
      ignoreMove: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("ignoreMove: false", async () => {
    const { parentElB, childEl, callback } = await newWatcherElement();
    await utils.swapElements(childEl, parentElB);

    await window.waitForMO();
    expect(callback.mock.calls.length).toBeGreaterThan(0);
  });

  test("from same parent", async () => {
    const { parentEl, childEl, childElB } = newElement();

    expect(childEl.parentElement).toBe(parentEl);
    expect(childElB.parentElement).toBe(parentEl);
    expect(childEl.nextElementSibling).toBe(childElB);
    await utils.swapElements(childEl, childElB);

    expect(childEl.parentElement).toBe(parentEl);
    expect(childElB.parentElement).toBe(parentEl);
    expect(childElB.nextElementSibling).toBe(childEl);
  });

  test("from different parents", async () => {
    const { parentEl, parentElB, childEl, childElB } = newElement();
    parentElB.append(childElB);

    expect(childEl.parentElement).toBe(parentEl);
    expect(childElB.parentElement).toBe(parentElB);
    await utils.swapElements(childEl, childElB);

    expect(childEl.parentElement).toBe(parentElB);
    expect(childElB.parentElement).toBe(parentEl);
  });
});

describe("moveChildrenNow", () => {
  test("ignoreMove: true", async () => {
    const { parentEl, parentElB, callback } = await newWatcherElement();
    utils.moveChildrenNow(parentEl, parentElB, {
      ignoreMove: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("ignoreMove: false", async () => {
    const { parentEl, parentElB, callback } = await newWatcherElement();
    utils.moveChildrenNow(parentEl, parentElB);

    await window.waitForMO();
    expect(callback.mock.calls.length).toBeGreaterThan(0);
  });

  test("default", () => {
    const { parentEl, parentElB, childEl, childElB } = newElement();

    expect(childEl.parentElement).toBe(parentEl);
    expect(childElB.parentElement).toBe(parentEl);
    utils.moveChildrenNow(parentEl, parentElB);

    expect(childEl.parentElement).toBe(parentElB);
    expect(childElB.parentElement).toBe(parentElB);
  });
});

describe("moveChildren", () => {
  test("ignoreMove: true", async () => {
    const { parentEl, parentElB, callback } = await newWatcherElement();
    await utils.moveChildren(parentEl, parentElB, {
      ignoreMove: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("ignoreMove: false", async () => {
    const { parentEl, parentElB, callback } = await newWatcherElement();
    await utils.moveChildren(parentEl, parentElB);

    await window.waitForMO();
    expect(callback.mock.calls.length).toBeGreaterThan(0);
  });

  test("default", async () => {
    const { parentEl, parentElB, childEl, childElB } = newElement();

    expect(childEl.parentElement).toBe(parentEl);
    expect(childElB.parentElement).toBe(parentEl);
    await utils.moveChildren(parentEl, parentElB);

    expect(childEl.parentElement).toBe(parentElB);
    expect(childElB.parentElement).toBe(parentElB);
  });
});

describe("moveElementNow", () => {
  test("ignoreMove: true", async () => {
    const { parentElB, childEl, callback } = await newWatcherElement();
    utils.moveElementNow(childEl, {
      to: parentElB,
      ignoreMove: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("ignoreMove: false", async () => {
    const { parentElB, childEl, callback } = await newWatcherElement();
    utils.moveElementNow(childEl, { to: parentElB });

    await window.waitForMO();
    expect(callback.mock.calls.length).toBeGreaterThan(0);
  });

  test("default (removing)", () => {
    const { parentEl, childEl } = newElement();

    expect(childEl.parentElement).toBe(parentEl);
    utils.moveElementNow(childEl);

    expect(childEl.parentElement).toBe(null);
  });

  test("to another", () => {
    const { parentEl, parentElB, childEl } = newElement();

    expect(childEl.parentElement).toBe(parentEl);
    utils.moveElementNow(childEl, { to: parentElB });

    expect(childEl.parentElement).toBe(parentElB);
  });

  test("append (default)", () => {
    const { parentElB, childEl, childElB } = newElement();
    parentElB.append(childElB);

    utils.moveElementNow(childEl, { to: parentElB });

    expect(childEl.parentElement).toBe(parentElB);
    expect(childEl.previousElementSibling).toBe(childElB);
  });

  test("prepend", () => {
    const { parentElB, childEl, childElB } = newElement();
    parentElB.append(childElB);

    utils.moveElementNow(childEl, { to: parentElB, position: "prepend" });

    expect(childEl.parentElement).toBe(parentElB);
    expect(childEl.nextElementSibling).toBe(childElB);
  });

  test("before", () => {
    const { parentElB, childEl, childElB } = newElement();
    parentElB.append(childElB);

    utils.moveElementNow(childEl, { to: childElB, position: "before" });

    expect(childEl.parentElement).toBe(parentElB);
    expect(childEl.nextElementSibling).toBe(childElB);
  });

  test("prepend", () => {
    const { parentElB, childEl, childElB } = newElement();
    parentElB.append(childElB);

    utils.moveElementNow(childEl, { to: childElB, position: "after" });

    expect(childEl.parentElement).toBe(parentElB);
    expect(childEl.previousElementSibling).toBe(childElB);
  });
});

describe("moveElement", () => {
  test("ignoreMove: true", async () => {
    const { parentElB, childEl, callback } = await newWatcherElement();
    await utils.moveElement(childEl, {
      to: parentElB,
      ignoreMove: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("ignoreMove: false", async () => {
    const { parentElB, childEl, callback } = await newWatcherElement();
    await utils.moveElement(childEl, { to: parentElB });

    await window.waitForMO();
    expect(callback.mock.calls.length).toBeGreaterThan(0);
  });

  test("default (removing)", async () => {
    const { parentEl, childEl } = newElement();

    expect(childEl.parentElement).toBe(parentEl);
    await utils.moveElement(childEl);

    expect(childEl.parentElement).toBe(null);
  });

  test("to another", async () => {
    const { parentEl, parentElB, childEl } = newElement();

    expect(childEl.parentElement).toBe(parentEl);
    await utils.moveElement(childEl, { to: parentElB });

    expect(childEl.parentElement).toBe(parentElB);
  });
});

test("hideAndRemoveElement", async () => {
  const element = document.createElement("div");
  element.style.setProperty("transition-duration", 1000);
  document.body.append(element);
  const prom = utils.hideAndRemoveElement(element);

  const startTime = Date.now();
  await window.waitFor(30);
  expect(element.classList.toString()).toBe("lisn-hide");
  expect(element.parentElement).toBe(document.body);
  await prom;

  const endTime = Date.now();
  expect(element.parentElement).toBe(null);
  expect(Math.abs(endTime - startTime - 1000)).toBeLessThan(50); // margin for error
});
