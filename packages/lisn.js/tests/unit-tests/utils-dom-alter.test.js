const { jest, describe, test, expect } = require("@jest/globals");

// TODO tryWrap, tryWrapContent

const utils = window.LISN.utils;
const { DOMWatcher } = window.LISN.watchers;

const newWatcherElements = async () => {
  const { parentEl, parentElB, childEl, childElB } = newElements();

  document.body.append(parentEl, parentElB);
  await window.waitForMO();
  const callback = jest.fn();

  DOMWatcher.reuse().onMutation(callback);
  await window.waitForMO();

  expect(callback).toHaveBeenCalledTimes(0);
  return { parentEl, parentElB, childEl, childElB, callback };
};

// returns this structure:
// parentEl
//   |--- childEl
//   |--- childElB
// parentElB
const newElements = (inline = false) => {
  const tag = inline ? "span" : "div";
  const parentEl = document.createElement(tag);
  parentEl.id = "parent";
  const parentElB = document.createElement(tag);
  parentElB.id = "parentB";
  const childEl = document.createElement(tag);
  childEl.id = "child";
  const childElB = document.createElement(tag);
  childElB.id = "childB";

  parentEl.append(childEl, childElB);

  return { parentEl, parentElB, childEl, childElB };
};

describe("wrapElementNow", () => {
  test("ignoreMove: true", async () => {
    const { parentEl, callback } = await newWatcherElements();
    utils.wrapElementNow(parentEl, {
      ignoreMove: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("ignoreMove: false", async () => {
    const { parentEl, callback } = await newWatcherElements();
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
    const { parentEl, callback } = await newWatcherElements();
    await utils.wrapElement(parentEl, {
      ignoreMove: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("ignoreMove: false", async () => {
    const { parentEl, callback } = await newWatcherElements();
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

describe("wrapChildrenNow", () => {
  test("ignoreMove: true", async () => {
    const { parentEl, callback } = await newWatcherElements();
    utils.wrapChildrenNow(parentEl, {
      ignoreMove: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("ignoreMove: false", async () => {
    const { parentEl, callback } = await newWatcherElements();
    utils.wrapChildrenNow(parentEl);

    await window.waitForMO();
    expect(callback.mock.calls.length).toBeGreaterThan(0);
  });

  test("default for span", () => {
    const { parentEl, childEl, childElB } = newElements(true); // span
    const wrapper = utils.wrapChildrenNow(parentEl);
    expect(wrapper.tagName).toBe("SPAN");
    expect(wrapper.parentElement).toBe(parentEl);
    expect(wrapper.children.length).toBe(2);
    expect(childEl.parentElement).toBe(wrapper);
    expect(childElB.parentElement).toBe(wrapper);
  });

  test("default for div", () => {
    const { parentEl, childEl, childElB } = newElements();
    const wrapper = utils.wrapChildrenNow(parentEl);
    expect(wrapper.tagName).toBe("DIV");
    expect(wrapper.parentElement).toBe(parentEl);
    expect(wrapper.children.length).toBe(2);
    expect(childEl.parentElement).toBe(wrapper);
    expect(childElB.parentElement).toBe(wrapper);
  });

  test("supplied tag for div", () => {
    const { parentEl, childEl, childElB } = newElements();
    const wrapper = utils.wrapChildrenNow(parentEl, {
      wrapper: "section",
    });
    expect(wrapper.tagName).toBe("SECTION");
    expect(wrapper.parentElement).toBe(parentEl);
    expect(wrapper.children.length).toBe(2);
    expect(childEl.parentElement).toBe(wrapper);
    expect(childElB.parentElement).toBe(wrapper);
  });

  test("supplied tag for span", () => {
    const { parentEl, childEl, childElB } = newElements(true); // span
    const wrapper = utils.wrapChildrenNow(parentEl, {
      wrapper: "b",
    });
    expect(wrapper.tagName).toBe("B");
    expect(wrapper.parentElement).toBe(parentEl);
    expect(wrapper.children.length).toBe(2);
    expect(childEl.parentElement).toBe(wrapper);
    expect(childElB.parentElement).toBe(wrapper);
  });

  test("supplied wrapper", () => {
    const wrapper = document.createElement("div");
    const { parentEl, childEl, childElB } = newElements();
    const result = utils.wrapChildrenNow(parentEl, {
      wrapper,
    });
    expect(result).toBe(wrapper);
    expect(wrapper.parentElement).toBe(parentEl);
    expect(wrapper.children.length).toBe(2);
    expect(childEl.parentElement).toBe(wrapper);
    expect(childElB.parentElement).toBe(wrapper);
  });
});

describe("replaceElementNow", () => {
  test("ignoreMove: true", async () => {
    const { parentElB, childEl, callback } = await newWatcherElements();
    utils.replaceElementNow(childEl, parentElB, {
      ignoreMove: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("ignoreMove: false", async () => {
    const { parentElB, childEl, callback } = await newWatcherElements();
    utils.replaceElementNow(childEl, parentElB);

    await window.waitForMO();
    expect(callback.mock.calls.length).toBeGreaterThan(0);
  });

  test("default", () => {
    const { parentEl, parentElB, childEl } = newElements();

    expect(childEl.parentElement).toBe(parentEl);
    utils.replaceElementNow(childEl, parentElB);

    expect(parentElB.parentElement).toBe(parentEl);
    expect(childEl.parentElement).toBe(null);
  });
});

describe("replaceElement", () => {
  test("ignoreMove: true", async () => {
    const { parentElB, childEl, callback } = await newWatcherElements();
    await utils.replaceElement(childEl, parentElB, {
      ignoreMove: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("ignoreMove: false", async () => {
    const { parentElB, childEl, callback } = await newWatcherElements();
    await utils.replaceElement(childEl, parentElB);

    await window.waitForMO();
    expect(callback.mock.calls.length).toBeGreaterThan(0);
  });

  test("default", async () => {
    const { parentEl, parentElB, childEl } = newElements();

    expect(childEl.parentElement).toBe(parentEl);
    await utils.replaceElement(childEl, parentElB);

    expect(parentElB.parentElement).toBe(parentEl);
    expect(childEl.parentElement).toBe(null);
  });
});

describe("swapElementsNow", () => {
  test("ignoreMove: true", async () => {
    const { parentElB, childEl, callback } = await newWatcherElements();
    utils.swapElementsNow(childEl, parentElB, {
      ignoreMove: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("ignoreMove: false", async () => {
    const { parentElB, childEl, callback } = await newWatcherElements();
    utils.swapElementsNow(childEl, parentElB);

    await window.waitForMO();
    expect(callback.mock.calls.length).toBeGreaterThan(0);
  });

  test("from same parent", () => {
    const { parentEl, childEl, childElB } = newElements();

    expect(childEl.parentElement).toBe(parentEl);
    expect(childElB.parentElement).toBe(parentEl);
    expect(childEl.nextElementSibling).toBe(childElB);
    utils.swapElementsNow(childEl, childElB);

    expect(childEl.parentElement).toBe(parentEl);
    expect(childElB.parentElement).toBe(parentEl);
    expect(childElB.nextElementSibling).toBe(childEl);
  });

  test("from different parents", () => {
    const { parentEl, parentElB, childEl, childElB } = newElements();
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
    const { parentElB, childEl, callback } = await newWatcherElements();
    await utils.swapElements(childEl, parentElB, {
      ignoreMove: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("ignoreMove: false", async () => {
    const { parentElB, childEl, callback } = await newWatcherElements();
    await utils.swapElements(childEl, parentElB);

    await window.waitForMO();
    expect(callback.mock.calls.length).toBeGreaterThan(0);
  });

  test("from same parent", async () => {
    const { parentEl, childEl, childElB } = newElements();

    expect(childEl.parentElement).toBe(parentEl);
    expect(childElB.parentElement).toBe(parentEl);
    expect(childEl.nextElementSibling).toBe(childElB);
    await utils.swapElements(childEl, childElB);

    expect(childEl.parentElement).toBe(parentEl);
    expect(childElB.parentElement).toBe(parentEl);
    expect(childElB.nextElementSibling).toBe(childEl);
  });

  test("from different parents", async () => {
    const { parentEl, parentElB, childEl, childElB } = newElements();
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
    const { parentEl, parentElB, callback } = await newWatcherElements();
    utils.moveChildrenNow(parentEl, parentElB, {
      ignoreMove: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("ignoreMove: false", async () => {
    const { parentEl, parentElB, callback } = await newWatcherElements();
    utils.moveChildrenNow(parentEl, parentElB);

    await window.waitForMO();
    expect(callback.mock.calls.length).toBeGreaterThan(0);
  });

  test("default", () => {
    const { parentEl, parentElB, childEl, childElB } = newElements();

    expect(childEl.parentElement).toBe(parentEl);
    expect(childElB.parentElement).toBe(parentEl);
    utils.moveChildrenNow(parentEl, parentElB);

    expect(childEl.parentElement).toBe(parentElB);
    expect(childElB.parentElement).toBe(parentElB);
  });
});

describe("moveChildren", () => {
  test("ignoreMove: true", async () => {
    const { parentEl, parentElB, callback } = await newWatcherElements();
    await utils.moveChildren(parentEl, parentElB, {
      ignoreMove: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("ignoreMove: false", async () => {
    const { parentEl, parentElB, callback } = await newWatcherElements();
    await utils.moveChildren(parentEl, parentElB);

    await window.waitForMO();
    expect(callback.mock.calls.length).toBeGreaterThan(0);
  });

  test("default", async () => {
    const { parentEl, parentElB, childEl, childElB } = newElements();

    expect(childEl.parentElement).toBe(parentEl);
    expect(childElB.parentElement).toBe(parentEl);
    await utils.moveChildren(parentEl, parentElB);

    expect(childEl.parentElement).toBe(parentElB);
    expect(childElB.parentElement).toBe(parentElB);
  });
});

describe("moveElementNow", () => {
  test("ignoreMove: true", async () => {
    const { parentElB, childEl, callback } = await newWatcherElements();
    utils.moveElementNow(childEl, {
      to: parentElB,
      ignoreMove: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("ignoreMove: false", async () => {
    const { parentElB, childEl, callback } = await newWatcherElements();
    utils.moveElementNow(childEl, { to: parentElB });

    await window.waitForMO();
    expect(callback.mock.calls.length).toBeGreaterThan(0);
  });

  test("default (removing)", () => {
    const { parentEl, childEl } = newElements();

    expect(childEl.parentElement).toBe(parentEl);
    utils.moveElementNow(childEl);

    expect(childEl.parentElement).toBe(null);
  });

  test("to another", () => {
    const { parentEl, parentElB, childEl } = newElements();

    expect(childEl.parentElement).toBe(parentEl);
    utils.moveElementNow(childEl, { to: parentElB });

    expect(childEl.parentElement).toBe(parentElB);
  });

  test("append (default)", () => {
    const { parentElB, childEl, childElB } = newElements();
    parentElB.append(childElB);

    utils.moveElementNow(childEl, { to: parentElB });

    expect(childEl.parentElement).toBe(parentElB);
    expect(childEl.previousElementSibling).toBe(childElB);
  });

  test("prepend", () => {
    const { parentElB, childEl, childElB } = newElements();
    parentElB.append(childElB);

    utils.moveElementNow(childEl, { to: parentElB, position: "prepend" });

    expect(childEl.parentElement).toBe(parentElB);
    expect(childEl.nextElementSibling).toBe(childElB);
  });

  test("before", () => {
    const { parentElB, childEl, childElB } = newElements();
    parentElB.append(childElB);

    utils.moveElementNow(childEl, { to: childElB, position: "before" });

    expect(childEl.parentElement).toBe(parentElB);
    expect(childEl.nextElementSibling).toBe(childElB);
  });

  test("prepend", () => {
    const { parentElB, childEl, childElB } = newElements();
    parentElB.append(childElB);

    utils.moveElementNow(childEl, { to: childElB, position: "after" });

    expect(childEl.parentElement).toBe(parentElB);
    expect(childEl.previousElementSibling).toBe(childElB);
  });
});

describe("moveElement", () => {
  test("ignoreMove: true", async () => {
    const { parentElB, childEl, callback } = await newWatcherElements();
    await utils.moveElement(childEl, {
      to: parentElB,
      ignoreMove: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("ignoreMove: false", async () => {
    const { parentElB, childEl, callback } = await newWatcherElements();
    await utils.moveElement(childEl, { to: parentElB });

    await window.waitForMO();
    expect(callback.mock.calls.length).toBeGreaterThan(0);
  });

  test("default (removing)", async () => {
    const { parentEl, childEl } = newElements();

    expect(childEl.parentElement).toBe(parentEl);
    await utils.moveElement(childEl);

    expect(childEl.parentElement).toBe(null);
  });

  test("to another", async () => {
    const { parentEl, parentElB, childEl } = newElements();

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
