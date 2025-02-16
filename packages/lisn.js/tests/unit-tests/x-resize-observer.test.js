const { jest, test, expect } = require("@jest/globals");

const { XResizeObserver } = window.LISN.modules;

const newObserverAndElement = (numEls = 5, debounceWindow = 0) => {
  const callback = jest.fn();
  const xObserver = new XResizeObserver((entries) => {
    callback(entries.length);
  }, debounceWindow);

  let elements = [];
  for (let i = 0; i < numEls; i++) {
    elements.push(document.createElement("div"));
  }

  const resizeAll = () => {
    for (const e of elements) {
      e.resize();
    }
  };

  return { callback, xObserver, elements, resizeAll };
};

test("observe", async () => {
  const { callback, xObserver, elements } = newObserverAndElement();
  xObserver.observe(...elements);

  await window.waitForRO();
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(elements.length);
});

test("observeLater + resize later (all)", async () => {
  const { callback, xObserver, elements, resizeAll } = newObserverAndElement();
  xObserver.observeLater(...elements);

  await window.waitForRO();
  expect(callback).toHaveBeenCalledTimes(0); // skipped initial

  resizeAll();
  await window.waitForRO();
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(elements.length);
});

test("observeLater + resize later (one)", async () => {
  const { callback, xObserver, elements } = newObserverAndElement();
  xObserver.observeLater(...elements);

  await window.waitForRO();
  expect(callback).toHaveBeenCalledTimes(0); // skipped initial

  elements[0].resize();
  await window.waitForRO();
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(1);
});

test("observeLater + resize immediately", async () => {
  const { callback, xObserver, elements } = newObserverAndElement();
  xObserver.observeLater(...elements); // initial call should be skipped
  elements[0].resize(); // this one should trigger

  await window.waitForRO();
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(1);
});

test("observeLater already observed", async () => {
  const { callback, xObserver, elements, resizeAll } = newObserverAndElement();
  xObserver.observe(...elements);

  await window.waitForRO();
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(elements.length);

  xObserver.observeLater(...elements); // shouldn't skip them
  resizeAll();
  await window.waitForRO();
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenNthCalledWith(2, elements.length);
});

test("unobserve", async () => {
  const { callback, xObserver, elements, resizeAll } = newObserverAndElement();
  xObserver.observe(...elements);

  await window.waitForRO();
  expect(callback).toHaveBeenCalledTimes(1); // initial call
  expect(callback).toHaveBeenNthCalledWith(1, elements.length);

  xObserver.unobserve(elements[0], elements[1]);

  elements[0].resize();
  elements[1].resize();

  await window.waitForRO();
  expect(callback).toHaveBeenCalledTimes(1); // no new calls

  resizeAll();
  await window.waitForRO();
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenNthCalledWith(2, elements.length - 2);

  xObserver.unobserve(...elements);

  resizeAll();
  await window.waitForRO();
  expect(callback).toHaveBeenCalledTimes(2); // no new calls
});

test("unobserve immediately", async () => {
  const { callback, xObserver, elements, resizeAll } = newObserverAndElement();
  xObserver.observe(...elements);
  xObserver.unobserve(...elements);

  await window.waitForRO();
  expect(callback).toHaveBeenCalledTimes(0);

  resizeAll();
  await window.waitForRO();
  expect(callback).toHaveBeenCalledTimes(0);
});

test("disconnect", async () => {
  const { callback, xObserver, elements, resizeAll } = newObserverAndElement();
  xObserver.observe(...elements);

  await window.waitForRO();
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenNthCalledWith(1, elements.length);

  xObserver.disconnect();

  resizeAll();
  await window.waitForRO();
  expect(callback).toHaveBeenCalledTimes(1); // no new calls
});

test("debounce window", async () => {
  const { callback, xObserver, elements, resizeAll } = newObserverAndElement(
    5,
    500,
  );

  xObserver.observe(elements[0]); // observe 1st

  resizeAll();
  await window.waitForRO();
  expect(callback).toHaveBeenCalledTimes(0);

  // observe remaining
  xObserver.observe(...elements);

  resizeAll();
  await window.waitForRO();
  expect(callback).toHaveBeenCalledTimes(0);

  await window.waitFor(520);

  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(elements.length); // no duplicate entry for 1st
});
