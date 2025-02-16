const { describe, test, expect } = require("@jest/globals");

const { PageLoader } = window.LISN.widgets;
const { isElementUndisplayed } = window.LISN.utils;

const pageLoaderPromise = window.LISN.utils.waitForElement(() =>
  document.querySelector(".lisn-page-loader__root"),
);
PageLoader.enableMain();

const newWidget = async (autoRemove = false) => {
  const element = document.createElement("div");
  document.body.append(element);
  const widget = new PageLoader(element, { autoRemove });

  await window.waitFor(100);

  return { element, widget };
};

test("enableMain", async () => {
  const element = await pageLoaderPromise;
  expect(element).toBeTruthy();
  expect(element).toBe(PageLoader.get()?.getElement());
});

test("basic", async () => {
  const { element } = await newWidget();
  expect(element.children.length).toBe(1);
  expect(element.classList.contains("lisn-page-loader__root")).toBe(true);
});

test("autoRemove true (default)", async () => {
  const { element, widget } = await newWidget(true);
  expect(element.classList.contains("lisn-page-loader__root")).toBe(false);
  expect(widget.isDestroyed()).toBe(true);
});

test("disable", async () => {
  const { element, widget } = await newWidget();

  widget.disable();

  await window.waitForAF();
  expect(isElementUndisplayed(element)).toBe(true);

  widget.enable();

  await window.waitForAF();
  expect(isElementUndisplayed(element)).toBe(false);
});

test("destroy", async () => {
  const { element, widget } = await newWidget();

  await widget.destroy();

  await window.waitForAF();
  expect(isElementUndisplayed(element)).toBe(false);
  expect(element.children.length).toBe(0);
});

test("PageLoader.get", async () => {
  const { element, widget } = await newWidget();
  expect(PageLoader.get(element)).toBe(widget);

  await widget.destroy();
  expect(PageLoader.get(element)).toBe(null);
});

describe("is registered", () => {
  // TODO these are being auto-removed so can't test
  // test(".lisn-page-loader", async () => {
  //   const element = document.createElement("div");
  //   element.classList.add("lisn-page-loader");
  //   document.body.append(element);
  //
  //   await window.waitForMO();
  //
  //   expect(PageLoader.get(element)).toBeInstanceOf(PageLoader);
  // });
  //
  // test("[data-lisn-page-loader='']", async () => {
  //   const element = document.createElement("div");
  //   element.dataset.lisnPageLoader = "";
  //   document.body.append(element);
  //
  //   await window.waitForMO();
  //
  //   expect(PageLoader.get(element)).toBeInstanceOf(PageLoader);
  // });
  //
  test("[data-lisn-page-loader='...']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnPageLoader = "auto-remove=false";
    document.body.append(element);

    await window.waitForMO();

    expect(PageLoader.get(element)).toBeInstanceOf(PageLoader);
  });
});
