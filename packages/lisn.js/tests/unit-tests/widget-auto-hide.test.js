const { describe, test, expect } = require("@jest/globals");

const { AutoHide } = window.LISN.widgets;
const { isElementHidden, showElement } = window.LISN.utils;

describe("basic", () => {
  test("all default", async () => {
    const element = document.createElement("div");
    document.body.append(element);

    new AutoHide(element);
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(false);

    await window.waitFor(2800); // default delay is 3000
    expect(isElementHidden(element)).toBe(false);

    await window.waitFor(200);
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(true);
    expect(element.parentElement).toBe(document.body);
  });
});

describe("custom delay", () => {
  test("from explicit options", async () => {
    const element = document.createElement("div");
    document.body.append(element);

    new AutoHide(element, { delay: 500 });
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(false);

    await window.waitFor(400);
    expect(isElementHidden(element)).toBe(false);

    await window.waitFor(100);
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(true);
    expect(element.parentElement).toBe(document.body);
  });

  test("from element dataset", async () => {
    const element = document.createElement("div");
    element.dataset.lisnAutoHide = "delay=500";
    document.body.append(element);

    await window.waitForMO();
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(false);

    await window.waitFor(400);
    expect(isElementHidden(element)).toBe(false);

    await window.waitFor(100);
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(true);
    expect(element.parentElement).toBe(document.body);
  });

  test("re-creating", async () => {
    const element = document.createElement("div");
    document.body.append(element);

    new AutoHide(element, { delay: 500 }).destroy();
    new AutoHide(element, { delay: 2000 });
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(false);

    await window.waitFor(1800); // delay is 2000
    expect(isElementHidden(element)).toBe(false);

    await window.waitFor(200);
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(true);
    expect(element.parentElement).toBe(document.body);
  });
});

describe("remove", () => {
  test("from explicit options", async () => {
    const element = document.createElement("div");
    document.body.append(element);

    new AutoHide(element, { delay: 0, remove: true });
    await window.waitFor(5);
    await window.waitForAF();
    expect(element.parentElement).toBe(null);
    expect(isElementHidden(element)).toBe(true);
  });

  test("from element class", async () => {
    const element = document.createElement("div");
    element.classList.add("lisn-auto-remove");
    document.body.append(element);

    await window.waitForMO();

    await window.waitFor(2800); // default delay is 3000
    expect(isElementHidden(element)).toBe(false);
    expect(element.parentElement).toBe(document.body);

    await window.waitFor(200);
    await window.waitForAF();
    expect(element.parentElement).toBe(null);
    expect(isElementHidden(element)).toBe(true);
  });

  test("with delay", async () => {
    const element = document.createElement("div");
    document.body.append(element);

    new AutoHide(element, { delay: 500, remove: true });
    await window.waitForAF();
    expect(element.parentElement).toBe(document.body);
    expect(isElementHidden(element)).toBe(false);

    await window.waitFor(500);
    await window.waitForAF();
    expect(element.parentElement).toBe(null);
    expect(isElementHidden(element)).toBe(true);
  });
});

describe("selector", () => {
  test("from explicit options", async () => {
    const element = document.createElement("div");
    document.body.append(element);

    const p = document.createElement("p");
    const span = document.createElement("span");
    element.append(p);
    element.append(span);

    new AutoHide(element, { delay: 0, selector: "span" });

    await window.waitFor(5);
    await window.waitForAF();
    expect(element.parentElement).toBe(document.body);
    expect(p.parentElement).toBe(element);
    expect(span.parentElement).toBe(element);
    expect(isElementHidden(element)).toBe(false);
    expect(isElementHidden(p)).toBe(false);
    expect(isElementHidden(span)).toBe(true); // only one hidden
  });

  test("from element dataset", async () => {
    const element = document.createElement("div");
    element.dataset.lisnAutoHide = "selector=span";
    document.body.append(element);

    const p = document.createElement("p");
    const span = document.createElement("span");
    element.append(p);
    element.append(span);

    await window.waitForMO();

    await window.waitFor(2800); // default delay is 3000
    expect(isElementHidden(element)).toBe(false);
    expect(element.parentElement).toBe(document.body);

    await window.waitFor(200);
    await window.waitForAF();
    expect(element.parentElement).toBe(document.body);
    expect(p.parentElement).toBe(element);
    expect(span.parentElement).toBe(element);
    expect(isElementHidden(element)).toBe(false);
    expect(isElementHidden(p)).toBe(false);
    expect(isElementHidden(span)).toBe(true); // only one hidden
  });

  test("from element dataset + delay", async () => {
    const element = document.createElement("div");
    element.dataset.lisnAutoHide = "delay=0|selector=span";
    document.body.append(element);

    const p = document.createElement("p");
    const span = document.createElement("span");
    element.append(p);
    element.append(span);

    await window.waitForMO();

    await window.waitForAF();
    expect(element.parentElement).toBe(document.body);
    expect(p.parentElement).toBe(element);
    expect(span.parentElement).toBe(element);
    expect(isElementHidden(element)).toBe(false);
    expect(isElementHidden(p)).toBe(false);
    expect(isElementHidden(span)).toBe(true); // only one hidden
  });
});

describe("after change", () => {
  test("auto-hide", async () => {
    const element = document.createElement("div");
    document.body.append(element);

    new AutoHide(element, { delay: 500 });
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(false);

    await window.waitFor(400);
    expect(isElementHidden(element)).toBe(false);

    await window.waitFor(100);
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(true);
    expect(element.parentElement).toBe(document.body);

    // show it
    showElement(element);
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(false);

    await window.waitFor(400);
    expect(isElementHidden(element)).toBe(false);

    await window.waitFor(100);
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(true);
    expect(element.parentElement).toBe(document.body);
  });

  test("auto-remove", async () => {
    const element = document.createElement("div");
    document.body.append(element);

    new AutoHide(element, { delay: 500, remove: true });
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(false);

    await window.waitFor(400);
    expect(isElementHidden(element)).toBe(false);

    await window.waitFor(100);
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(true);
    expect(element.parentElement).toBe(null);

    // show it and re-insert it
    showElement(element);
    document.body.append(element);
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(false);

    await window.waitFor(400);
    expect(isElementHidden(element)).toBe(false);

    await window.waitFor(100);
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(true);
    expect(element.parentElement).toBe(null);
  });
});

describe("destroy", () => {
  test("auto-hide", async () => {
    const element = document.createElement("div");
    document.body.append(element);

    const widget = new AutoHide(element, { delay: 0 });
    await window.waitFor(5);
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(true);
    expect(element.parentElement).toBe(document.body);

    await widget.destroy();

    // show it
    showElement(element);
    await window.waitFor(5);
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(false);
    expect(element.parentElement).toBe(document.body);
  });

  test("auto-remove", async () => {
    const element = document.createElement("div");
    document.body.append(element);

    const widget = new AutoHide(element, { delay: 0, remove: true });
    await window.waitFor(5);
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(true);
    expect(element.parentElement).toBe(null);

    await widget.destroy();

    // show it and re-insert it
    showElement(element);
    document.body.append(element);
    await window.waitFor(5);
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(false);
    expect(element.parentElement).toBe(document.body);
  });
});

describe("AutoHide.get", () => {
  test("no ID", async () => {
    const element = document.createElement("div");
    document.body.append(element);

    new AutoHide(element);
    expect(AutoHide.get(element, "")).toBe(null);
  });

  test("blank ID", async () => {
    const element = document.createElement("div");
    document.body.append(element);

    new AutoHide(element, { id: "" });
    expect(AutoHide.get(element, "")).toBe(null);
  });

  test("with ID", async () => {
    const element = document.createElement("div");
    document.body.append(element);

    const widget = new AutoHide(element, { id: "foo" });
    expect(AutoHide.get(element, "foo")).toBe(widget);

    await widget.destroy();
    expect(AutoHide.get(element)).toBe(null);
  });
});

describe("is registered", () => {
  test(".lisn-auto-hide", async () => {
    const element = document.createElement("div");
    element.classList.add("lisn-auto-hide");
    document.body.append(element);
    expect(isElementHidden(element)).toBe(false);

    await window.waitForMO();

    await window.waitFor(2800); // default delay is 3000
    expect(isElementHidden(element)).toBe(false);

    await window.waitFor(200);
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(true);
    expect(element.parentElement).toBe(document.body);
  });

  test(".lisn-auto-remove", async () => {
    const element = document.createElement("div");
    element.classList.add("lisn-auto-remove");
    document.body.append(element);
    expect(isElementHidden(element)).toBe(false);

    await window.waitForMO();

    await window.waitFor(2800); // default delay is 3000
    expect(isElementHidden(element)).toBe(false);
    expect(element.parentElement).toBe(document.body);

    await window.waitFor(200);
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(true);
    expect(element.parentElement).toBe(null);
  });

  test("[data-lisn-auto-hide='']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnAutoHide = "";
    document.body.append(element);
    expect(isElementHidden(element)).toBe(false);

    await window.waitForMO();

    await window.waitFor(2800); // default delay is 3000
    expect(isElementHidden(element)).toBe(false);

    await window.waitFor(200);
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(true);
    expect(element.parentElement).toBe(document.body);
  });

  test("[data-lisn-auto-remove='']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnAutoRemove = "";
    document.body.append(element);
    expect(isElementHidden(element)).toBe(false);

    await window.waitForMO();

    await window.waitFor(2800); // default delay is 3000
    expect(isElementHidden(element)).toBe(false);
    expect(element.parentElement).toBe(document.body);

    await window.waitFor(200);
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(true);
    expect(element.parentElement).toBe(null);
  });

  test("[data-lisn-auto-hide='...']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnAutoHide = "delay=0";
    document.body.append(element);
    expect(isElementHidden(element)).toBe(false);

    await window.waitForMO();
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(true);
    expect(element.parentElement).toBe(document.body);
  });

  test("[data-lisn-auto-remove='...']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnAutoRemove = "delay=0";
    document.body.append(element);
    expect(isElementHidden(element)).toBe(false);

    await window.waitForMO();
    await window.waitForAF();
    expect(isElementHidden(element)).toBe(true);
    expect(element.parentElement).toBe(null);
  });
});

describe("multiple widgets", () => {
  test("from dataset", async () => {
    const element = document.createElement("div");
    element.dataset.lisnAutoHide =
      "delay=500 | selector=p ; delay=0 | selector=span";
    element.dataset.lisnAutoRemove = "delay=500 | selector=div.msg";
    document.body.append(element);

    const div = document.createElement("div");
    div.classList.add("msg");
    const p = document.createElement("p");
    const span = document.createElement("span");
    element.append(div);
    element.append(p);
    element.append(span);

    await window.waitForMO();

    await window.waitForAF();
    expect(element.parentElement).toBe(document.body);
    expect(div.parentElement).toBe(element);
    expect(p.parentElement).toBe(element);
    expect(span.parentElement).toBe(element);
    expect(isElementHidden(element)).toBe(false);
    expect(isElementHidden(p)).toBe(false);
    expect(isElementHidden(span)).toBe(true);

    await window.waitFor(500);
    await window.waitForAF();
    expect(element.parentElement).toBe(document.body);
    expect(div.parentElement).toBe(null); // removed
    expect(p.parentElement).toBe(element);
    expect(span.parentElement).toBe(element);
    expect(isElementHidden(element)).toBe(false);
    expect(isElementHidden(div)).toBe(true); // also hidden now
    expect(isElementHidden(p)).toBe(true); // also hidden now
    expect(isElementHidden(span)).toBe(true);
  });

  test("from explicit options", async () => {
    const element = document.createElement("div");
    document.body.append(element);

    const div = document.createElement("div");
    div.classList.add("msg");
    const p = document.createElement("p");
    const span = document.createElement("span");
    element.append(div);
    element.append(p);
    element.append(span);

    new AutoHide(element, { delay: 500, remove: true, selector: "div.msg" });
    new AutoHide(element, { delay: 500, selector: "p" });
    new AutoHide(element, { delay: 0, selector: "span" });

    await window.waitFor(5);
    await window.waitForAF();
    expect(element.parentElement).toBe(document.body);
    expect(div.parentElement).toBe(element);
    expect(p.parentElement).toBe(element);
    expect(span.parentElement).toBe(element);
    expect(isElementHidden(element)).toBe(false);
    expect(isElementHidden(p)).toBe(false);
    expect(isElementHidden(span)).toBe(true);

    await window.waitFor(500);
    await window.waitForAF();
    expect(element.parentElement).toBe(document.body);
    expect(div.parentElement).toBe(null); // removed
    expect(p.parentElement).toBe(element);
    expect(span.parentElement).toBe(element);
    expect(isElementHidden(element)).toBe(false);
    expect(isElementHidden(div)).toBe(true); // also hidden now
    expect(isElementHidden(p)).toBe(true); // also hidden now
    expect(isElementHidden(span)).toBe(true);
  });
});
