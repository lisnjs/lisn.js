const { describe, test, expect } = require("@jest/globals");

const { Scrollbar } = window.LISN.widgets;

const scrollbarPromise = window.LISN.utils.waitForElement(() =>
  document.querySelector(".lisn-scrollbar__root"),
);

Scrollbar.enableMain();

test("enableMain", async () => {
  const element = await scrollbarPromise;
  expect(element).toBeTruthy();
  expect(element).toBe(Scrollbar.get()?.getElement());
});

describe("basic", () => {
  // TODO main element

  test("custom element, all default", async () => {
    const element = document.createElement("div");
    const child1 = document.createElement("div");
    const child2 = document.createElement("div");
    document.body.append(element);
    element.append(child1, child2);

    const widget = new Scrollbar(element);
    const scrollable = widget.getScrollable();

    await window.waitFor(100);

    expect(element.children.length).toBe(2);
    const barWrapper = element.children[0];
    const contentWrapper = element.children[1];

    expect(widget.getScrollable()).toBe(contentWrapper);
    expect(scrollable).toBe(contentWrapper); // should have returned the same from the start

    expect(element.classList.contains("lisn-scrollbar__root")).toBe(true);

    expect(barWrapper.classList.contains("lisn-scrollbar__wrapper")).toBe(true);
    expect(barWrapper.children.length).toBe(2);

    expect(contentWrapper.classList.contains("lisn-scrollbar__content")).toBe(
      true,
    );

    for (const scrollbar of barWrapper.children) {
      expect(scrollbar.children.length).toBe(1); // just fill

      expect(scrollbar.classList.contains("lisn-scrollbar__bar")).toBe(true);

      expect(
        scrollbar.children[0].classList.contains("lisn-scrollbar__fill"),
      ).toBe(true);
    }
  });
});

test("Scrollbar.get", async () => {
  const element = document.createElement("div");
  document.body.append(element);

  const widget = new Scrollbar(element);
  expect(Scrollbar.get(element)).toBe(widget);

  await widget.destroy();
  expect(Scrollbar.get(element)).toBe(null);
});

describe("is registered", () => {
  test(".lisn-scrollbar", async () => {
    const element = document.createElement("div");
    element.classList.add("lisn-scrollbar");
    document.body.append(element);

    await window.waitForMO();

    expect(Scrollbar.get(element)).toBeInstanceOf(Scrollbar);
  });

  test("[data-lisn-scrollbar='']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnScrollbar = "";
    document.body.append(element);

    await window.waitForMO();

    expect(Scrollbar.get(element)).toBeInstanceOf(Scrollbar);
  });

  test("[data-lisn-scrollbar='...']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnScrollbar = "click-scroll=false";
    document.body.append(element);

    await window.waitForMO();

    expect(Scrollbar.get(element)).toBeInstanceOf(Scrollbar);
  });
});

// TODO test with custom options and setting of complete-fr attribute when
// scrolling element
