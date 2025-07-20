const { test, expect } = require("@jest/globals");

const { ScrollTo, fetchAction } = window.LISN.actions;
const { randId } = window.LISN.utils;

const newScrollingRoot = (x = 0, y = 0, useDocumentElement = false) => {
  const root = useDocumentElement
    ? document.documentElement
    : document.createElement("div");

  if (!useDocumentElement) {
    root.id = randId();
    document.body.append(root);
  }

  root.enableScroll();
  root.scrollTo(x, y);
  expect(root.scrollLeft).toBe(x);
  expect(root.scrollTop).toBe(y);

  const element = document.createElement("div");
  root.append(element);

  return { root, element };
};

test("basic", async () => {
  const docTop = 500;
  const docLeft = 100;
  const { root, element } = newScrollingRoot(docLeft, docTop, true);

  const elTop = 300;
  const elLeft = 50;
  const elW = 100;
  const elH = 50;
  element.setOffset(elLeft, elTop);
  element.resize([elW, elH]);

  const action = new ScrollTo(element, { duration: 0 });

  await window.waitForAF();
  expect(root.scrollTop).toBe(docTop);
  expect(root.scrollLeft).toBe(docLeft);

  await action.do();
  expect(root.scrollTop).toBe(elTop);
  expect(root.scrollLeft).toBe(elLeft);

  await action.undo();
  expect(root.scrollTop).toBe(docTop);
  expect(root.scrollLeft).toBe(docLeft);

  await action.undo(); // no-op
  expect(root.scrollTop).toBe(docTop);
  expect(root.scrollLeft).toBe(docLeft);

  await action.toggle();
  expect(root.scrollTop).toBe(elTop);
  expect(root.scrollLeft).toBe(elLeft);

  await action.toggle();
  expect(root.scrollTop).toBe(docTop);
  expect(root.scrollLeft).toBe(docLeft);
});

test("with offset", async () => {
  const docTop = 500;
  const docLeft = 100;
  const { root, element } = newScrollingRoot(docLeft, docTop);

  const elTop = 300;
  const elLeft = 50;
  const elW = 100;
  const elH = 50;
  element.setOffset(elLeft, elTop);
  element.resize([elW, elH]);

  const action = new ScrollTo(element, {
    scrollable: root,
    offset: { top: 10, left: 20 },
    duration: 0,
  });

  await window.waitForAF();
  expect(root.scrollTop).toBe(docTop);
  expect(root.scrollLeft).toBe(docLeft);

  await action.do();
  expect(root.scrollTop).toBe(elTop + 10);
  expect(root.scrollLeft).toBe(elLeft + 20);

  await action.undo();
  expect(root.scrollTop).toBe(docTop);
  expect(root.scrollLeft).toBe(docLeft);

  await action.undo(); // no-op
  expect(root.scrollTop).toBe(docTop);
  expect(root.scrollLeft).toBe(docLeft);

  await action.toggle();
  expect(root.scrollTop).toBe(elTop + 10);
  expect(root.scrollLeft).toBe(elLeft + 20);

  await action.toggle();
  expect(root.scrollTop).toBe(docTop);
  expect(root.scrollLeft).toBe(docLeft);
});

test("parse with offset", async () => {
  const docTop = 500;
  const docLeft = 100;
  const { root, element } = newScrollingRoot(docLeft, docTop);

  const elTop = 300;
  const elLeft = 50;
  const elW = 100;
  const elH = 50;
  element.setOffset(elLeft, elTop);
  element.resize([elW, elH]);

  const action = await fetchAction(
    element,
    "scroll-to",
    `offsetX=20, scrollable=#${root.id}, duration=0`,
  );
  expect(action).toBeInstanceOf(ScrollTo);

  await window.waitForAF();
  expect(root.scrollTop).toBe(docTop);
  expect(root.scrollLeft).toBe(docLeft);

  await action.do();
  expect(root.scrollTop).toBe(elTop);
  expect(root.scrollLeft).toBe(elLeft + 20);
});

test("parse with 2 offsets", async () => {
  const docTop = 500;
  const docLeft = 100;
  const { root, element } = newScrollingRoot(docLeft, docTop);

  const elTop = 300;
  const elLeft = 50;
  const elW = 100;
  const elH = 50;
  element.setOffset(elLeft, elTop);
  element.resize([elW, elH]);

  const action = await fetchAction(
    element,
    "scroll-to",
    ` offsetX=20, offsetY=-10, scrollable=#${root.id}, duration=0`,
  );
  expect(action).toBeInstanceOf(ScrollTo);

  await window.waitForAF();
  expect(root.scrollTop).toBe(docTop);
  expect(root.scrollLeft).toBe(docLeft);

  await action.do();
  expect(root.scrollTop).toBe(elTop - 10);
  expect(root.scrollLeft).toBe(elLeft + 20);
});

test("is registered", async () => {
  const element = document.createElement("div");
  const action = await fetchAction(element, "scroll-to");
  expect(action).toBeInstanceOf(ScrollTo);
});
