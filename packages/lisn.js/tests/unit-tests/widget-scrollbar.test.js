const { describe, test, expect } = require("@jest/globals");

const { Scrollbar } = window.LISN.widgets;
const { randId } = window.LISN.utils;

const scrollbarPromise = window.LISN.utils.waitForElement(() =>
  document.querySelector(".lisn-scrollbar__root"),
);

Scrollbar.enableMain();

const newWidget = async ({
  existingWrapper = false,
  disableWrapping = false,
} = {}) => {
  const ensureIsWrapped = (isDestroyed = false) => {
    if (isDestroyed) {
      expect(actualRoot.children.length).toBe(1);
      expect(actualRoot.children[0]).toBe(actualScrollable);
    } else {
      expect(actualRoot.children.length).toBe(2);
      expect(actualRoot.children[0]).toBe(barWrapper);
      expect(actualRoot.children[1]).toBe(actualScrollable);
    }

    expect(actualScrollable.children.length).toBe(1);
    expect(actualScrollable.children[0]).toBe(actualContentWrapper);

    expect(actualContentWrapper.children.length).toBe(2);
    expect(actualContentWrapper.children[0]).toBe(child1);
    expect(actualContentWrapper.children[1]).toBe(child2);
  };

  const ensureIsUnwrapped = (isDestroyed = false) => {
    if (isDestroyed) {
      if (disableWrapping) {
        expect(actualRoot.children.length).toBe(2);
        expect(actualRoot.children[0]).toBe(child1);
        expect(actualRoot.children[1]).toBe(child2);
      } else {
        // The scroll watcher does not currently unwrap children when scroll
        // tracking is removed for an element, as it would be inefficient and more
        // detrimental than useful. So the contentWrapper would have remained

        expect(actualRoot.children.length).toBe(1);
        expect(actualRoot.children[0]).toBe(actualContentWrapper);

        expect(actualContentWrapper.children.length).toBe(2);
        expect(actualContentWrapper.children[0]).toBe(child1);
        expect(actualContentWrapper.children[1]).toBe(child2);
      }
    } else {
      expect(actualRoot.children.length).toBe(3);
      expect(actualRoot.children[0]).toBe(barWrapper);
      expect(actualRoot.children[1]).toBe(child1);
      expect(actualRoot.children[2]).toBe(child2);
    }
  };

  const ensureIsRestored = () => {
    expect(element.classList.contains("lisn-scrollbar__root")).toBe(false);
    expect(element.id).toBe(origId);
    expect(element.classList.contains(newClassName)).toBe(false);
    expect(element.classList.contains(origClassName)).toBe(true);

    if (existingWrapper) {
      ensureIsWrapped(true);
      expect(
        scrollableWrapper.classList.contains("lisn-scrollbar__content"),
      ).toBe(true);
      expect(contentWrapper.classList.contains("lisn-wrapper")).toBe(true);
    } else {
      ensureIsUnwrapped(true);
    }
  };

  // ------------------------------
  // ------------------------------
  // ------------------------------

  const element = document.createElement("div");
  const origId = randId();
  const origClassName = randId();

  const newId = randId();
  const newClassName = randId();

  element.id = origId;
  element.classList.add(origClassName);

  if (disableWrapping) {
    element.dataset.lisnNoWrap = "";
  }

  const child1 = document.createElement("div");
  const child2 = document.createElement("div");
  let scrollableWrapper = null;
  let contentWrapper = null;

  document.body.append(element);
  if (existingWrapper) {
    scrollableWrapper = document.createElement("div");
    scrollableWrapper.classList.add("lisn-scrollbar__content");
    if (disableWrapping) {
      scrollableWrapper.dataset.lisnNoWrap = "";
    }

    contentWrapper = document.createElement("div");
    contentWrapper.classList.add("lisn-wrapper");

    element.append(scrollableWrapper);
    scrollableWrapper.append(contentWrapper);
    contentWrapper.append(child1, child2);
  } else {
    element.append(child1, child2);
  }

  if (disableWrapping) {
    window.expectWarning(/relies on position: sticky/);
  }
  const widget = new Scrollbar(element, { id: newId, className: newClassName });
  const actualScrollable = widget.getScrollable();
  const actualRoot = widget.getElement();
  expect(actualRoot).toBe(element);

  await window.waitFor(300);

  const actualContentWrapper = disableWrapping
    ? null
    : actualScrollable.children[0];
  const barWrapper = actualRoot.children[0];

  // console.log("XXX", {
  //   disableWrapping,
  //   existingWrapper,
  //   actualRootCls: [...actualRoot.classList],
  //   actualRootChildren: [...actualRoot.children].map((c) => [...c.classList]),
  //   actualScrollableCls: [...actualScrollable.classList],
  //   actualScrollableChildren: [...actualScrollable.children].map((c) => [
  //     ...c.classList,
  //   ]),
  //   actualContentWrapperCls: [...(actualContentWrapper?.classList ?? [])],
  //   actualContentWrapperChildren: [
  //     ...(actualContentWrapper?.children ?? []),
  //   ].map((c) => [...c.classList]),
  //   barWrapperCls: [...barWrapper.classList],
  //   barWrapperChildren: [...barWrapper.children].map((c) => [...c.classList]),
  // });

  expect(actualScrollable.id).toBe(newId);
  expect(actualScrollable.classList.contains(newClassName)).toBe(true);

  if (disableWrapping) {
    expect(actualRoot).toBe(actualScrollable);
    ensureIsUnwrapped();
  } else {
    if (existingWrapper) {
      expect(actualScrollable).toBe(scrollableWrapper); // the one we created
      expect(actualContentWrapper).toBe(contentWrapper); // the one we created
    }
    ensureIsWrapped();
  }
  expect(barWrapper.children.length).toBe(2);

  expect(widget.getScrollable()).toBe(actualScrollable); // should have returned the same from the start
  expect(widget.getElement()).toBe(actualRoot); // should have returned the same from the start

  expect(element.classList.contains("lisn-scrollbar__root")).toBe(true);
  expect(barWrapper.classList.contains("lisn-scrollbar__wrapper")).toBe(true);
  expect(actualScrollable.classList.contains("lisn-scrollbar__content")).toBe(
    !disableWrapping,
  );
  if (!disableWrapping) {
    expect(actualContentWrapper.classList.contains("lisn-wrapper")).toBe(true);
  }

  for (const scrollbar of barWrapper.children) {
    expect(scrollbar.children.length).toBe(1); // just fill
    expect(scrollbar.classList.contains("lisn-scrollbar__bar")).toBe(true);
    expect(
      scrollbar.children[0].classList.contains("lisn-scrollbar__fill"),
    ).toBe(true);
  }

  return { element, widget, ensureIsRestored };
};

test("enableMain", async () => {
  const element = await scrollbarPromise;
  expect(element).toBeTruthy();
  expect(element).toBe(Scrollbar.get()?.getElement());
  expect(element).toBe(document.body);
});

describe("basic", () => {
  // TODO main element

  test("custom element, all default", async () => {
    const { widget, ensureIsRestored } = await newWidget();
    await widget.destroy();
    ensureIsRestored();
  });

  test("custom element, wrapping disabled", async () => {
    const { widget, ensureIsRestored } = await newWidget({
      disableWrapping: true,
    });
    await widget.destroy();
    ensureIsRestored();
  });

  test("custom element, existing wrapper", async () => {
    const { widget, ensureIsRestored } = await newWidget({
      existingWrapper: true,
    });
    await widget.destroy();
    ensureIsRestored();
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
