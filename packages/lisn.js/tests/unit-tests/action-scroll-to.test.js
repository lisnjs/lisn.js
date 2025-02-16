const { test, expect } = require("@jest/globals");

const { ScrollTo, fetchAction } = window.LISN.actions;

document.documentElement.enableScroll();

test("basic", async () => {
  const docTop = 500;
  const docLeft = 100;
  document.documentElement.scrollTo(docLeft, docTop);
  const element = document.createElement("div");

  const elTop = 300;
  const elLeft = 50;
  const elW = 100;
  const elH = 50;
  element.getBoundingClientRect = () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollLeft = document.documentElement.scrollLeft;

    const x = elLeft - scrollLeft;
    const y = elTop - scrollTop;
    return {
      x,
      left: x,
      right: x + elW,
      width: elW,
      y: y,
      top: y,
      bottom: y + elH,
      height: elH,
    };
  };
  document.body.append(element);

  const action = new ScrollTo(element);

  await window.waitForAF();
  expect(document.documentElement.scrollTop).toBe(docTop);
  expect(document.documentElement.scrollLeft).toBe(docLeft);

  await action.do();
  expect(document.documentElement.scrollTop).toBe(elTop);
  expect(document.documentElement.scrollLeft).toBe(elLeft);

  await action.undo();
  expect(document.documentElement.scrollTop).toBe(docTop);
  expect(document.documentElement.scrollLeft).toBe(docLeft);

  await action.undo(); // no-op
  expect(document.documentElement.scrollTop).toBe(docTop);
  expect(document.documentElement.scrollLeft).toBe(docLeft);

  await action.toggle();
  expect(document.documentElement.scrollTop).toBe(elTop);
  expect(document.documentElement.scrollLeft).toBe(elLeft);

  await action.toggle();
  expect(document.documentElement.scrollTop).toBe(docTop);
  expect(document.documentElement.scrollLeft).toBe(docLeft);
});

test("with offset", async () => {
  const docTop = 500;
  const docLeft = 100;
  document.documentElement.scrollTo(docLeft, docTop);
  const element = document.createElement("div");

  const elTop = 300;
  const elLeft = 50;
  const elW = 100;
  const elH = 50;
  element.getBoundingClientRect = () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollLeft = document.documentElement.scrollLeft;

    const x = elLeft - scrollLeft;
    const y = elTop - scrollTop;
    return {
      x,
      left: x,
      right: x + elW,
      width: elW,
      y: y,
      top: y,
      bottom: y + elH,
      height: elH,
    };
  };
  document.body.append(element);

  const action = new ScrollTo(element, { offset: { top: 10, left: 20 } });

  await window.waitForAF();
  expect(document.documentElement.scrollTop).toBe(docTop);
  expect(document.documentElement.scrollLeft).toBe(docLeft);

  await action.do();
  expect(document.documentElement.scrollTop).toBe(elTop + 10);
  expect(document.documentElement.scrollLeft).toBe(elLeft + 20);

  await action.undo();
  expect(document.documentElement.scrollTop).toBe(docTop);
  expect(document.documentElement.scrollLeft).toBe(docLeft);

  await action.undo(); // no-op
  expect(document.documentElement.scrollTop).toBe(docTop);
  expect(document.documentElement.scrollLeft).toBe(docLeft);

  await action.toggle();
  expect(document.documentElement.scrollTop).toBe(elTop + 10);
  expect(document.documentElement.scrollLeft).toBe(elLeft + 20);

  await action.toggle();
  expect(document.documentElement.scrollTop).toBe(docTop);
  expect(document.documentElement.scrollLeft).toBe(docLeft);
});

test("parse with offset", async () => {
  const docTop = 500;
  const docLeft = 100;
  document.documentElement.scrollTo(docLeft, docTop);
  const element = document.createElement("div");

  const elTop = 300;
  const elLeft = 50;
  const elW = 100;
  const elH = 50;
  element.getBoundingClientRect = () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollLeft = document.documentElement.scrollLeft;

    const x = elLeft - scrollLeft;
    const y = elTop - scrollTop;
    return {
      x,
      left: x,
      right: x + elW,
      width: elW,
      y: y,
      top: y,
      bottom: y + elH,
      height: elH,
    };
  };
  document.body.append(element);

  const action = await fetchAction(element, "scroll-to", "offsetX=20");
  expect(action).toBeInstanceOf(ScrollTo);

  await window.waitForAF();
  expect(document.documentElement.scrollTop).toBe(docTop);
  expect(document.documentElement.scrollLeft).toBe(docLeft);

  await action.do();
  expect(document.documentElement.scrollTop).toBe(elTop);
  expect(document.documentElement.scrollLeft).toBe(elLeft + 20);
});

test("parse with 2 offsets", async () => {
  const docTop = 500;
  const docLeft = 100;
  document.documentElement.scrollTo(docLeft, docTop);
  const element = document.createElement("div");

  const elTop = 300;
  const elLeft = 50;
  const elW = 100;
  const elH = 50;
  element.getBoundingClientRect = () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollLeft = document.documentElement.scrollLeft;

    const x = elLeft - scrollLeft;
    const y = elTop - scrollTop;
    return {
      x,
      left: x,
      right: x + elW,
      width: elW,
      y: y,
      top: y,
      bottom: y + elH,
      height: elH,
    };
  };
  document.body.append(element);

  const action = await fetchAction(
    element,
    "scroll-to",
    " offsetX=20, offsetY=-10",
  );
  expect(action).toBeInstanceOf(ScrollTo);

  await window.waitForAF();
  expect(document.documentElement.scrollTop).toBe(docTop);
  expect(document.documentElement.scrollLeft).toBe(docLeft);

  await action.do();
  expect(document.documentElement.scrollTop).toBe(elTop - 10);
  expect(document.documentElement.scrollLeft).toBe(elLeft + 20);
});

test("is registered", async () => {
  const element = document.createElement("div");
  const action = await fetchAction(element, "scroll-to");
  expect(action).toBeInstanceOf(ScrollTo);
});
