const { jest, test, expect } = require("@jest/globals");

const { XIntersectionObserver } = window.LISN.modules;

const newObserverAndElement = (numEls = 5) => {
  const callback = jest.fn();
  const xObserver = new XIntersectionObserver((entries) => {
    callback(entries.length);
  });

  let elements = [];
  for (let i = 0; i < numEls; i++) {
    elements.push(document.createElement("div"));
  }

  let observer;
  const triggerAll = (isIntersecting) => {
    const observer = getObserver();

    for (const e of elements) {
      observer.trigger(e, isIntersecting);
    }
  };

  // !!! Must be called after observe and before pausing/disconnecting
  const getObserver = () => {
    if (observer !== undefined) {
      return observer;
    }

    const observers = window.IntersectionObserver.instances.get(elements[0]);

    if (observers === undefined) {
      throw (
        "Can't find this XIntersectionObserver's observer. " +
        "Did you await enough time?"
      );
    }

    if (observers.size > 1) {
      throw "Got multiple observers for this XIntersectionObserver's element";
    }

    observer = Array.from(observers)[0]; // save for next time
    return observer;
  };

  return { callback, xObserver, elements, getObserver, triggerAll };
};

test("observe", async () => {
  const { callback, xObserver, elements } = newObserverAndElement();
  xObserver.observe(...elements);

  await window.waitForIO();
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(elements.length);
});

test("observeLater + trigger later (all)", async () => {
  const { callback, xObserver, elements, triggerAll } = newObserverAndElement();
  xObserver.observeLater(...elements);

  await window.waitForIO();
  expect(callback).toHaveBeenCalledTimes(0); // skipped initial

  triggerAll();
  await window.waitForIO();
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(elements.length);
});

test("observeLater + trigger later (one)", async () => {
  const { callback, xObserver, elements, getObserver } =
    newObserverAndElement();
  xObserver.observeLater(...elements);
  const observer = getObserver();

  await window.waitForIO();

  expect(callback).toHaveBeenCalledTimes(0); // skipped initial

  observer.trigger(elements[0]);
  await window.waitForIO();
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(1);
});

test("observeLater + trigger immediately", async () => {
  const { callback, xObserver, elements, getObserver } =
    newObserverAndElement();
  xObserver.observeLater(...elements); // initial call should be skipped

  const observer = getObserver();
  observer.trigger(elements[0]); // this one should trigger

  await window.waitForIO();
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(1);
});

test("observeLater already observed", async () => {
  const { callback, xObserver, elements, triggerAll } = newObserverAndElement();
  xObserver.observe(...elements);

  await window.waitForIO();
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(elements.length);

  xObserver.observeLater(...elements); // shouldn't skip them
  triggerAll();
  await window.waitForIO();
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenNthCalledWith(2, elements.length);
});

test("unobserve", async () => {
  const { callback, xObserver, elements, triggerAll, getObserver } =
    newObserverAndElement();
  xObserver.observe(...elements);
  const observer = getObserver();

  await window.waitForIO();
  expect(callback).toHaveBeenCalledTimes(1); // initial call
  expect(callback).toHaveBeenNthCalledWith(1, elements.length);

  xObserver.unobserve(elements[0], elements[1]);

  observer.trigger(elements[0]);
  observer.trigger(elements[1]);

  await window.waitForIO();
  expect(callback).toHaveBeenCalledTimes(1); // no new calls

  triggerAll();
  await window.waitForIO();
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenNthCalledWith(2, elements.length - 2);

  xObserver.unobserve(...elements);

  triggerAll();
  await window.waitForIO();
  expect(callback).toHaveBeenCalledTimes(2); // no new calls
});

test("unobserve immediately", async () => {
  const { callback, xObserver, elements, triggerAll, getObserver } =
    newObserverAndElement();
  xObserver.observe(...elements);
  getObserver(); // get it now otherwise triggerAll won't be able to get it

  xObserver.unobserve(...elements);

  await window.waitForIO();
  expect(callback).toHaveBeenCalledTimes(0);

  triggerAll();
  await window.waitForIO();
  expect(callback).toHaveBeenCalledTimes(0);
});

test("disconnect", async () => {
  const { callback, xObserver, elements, triggerAll, getObserver } =
    newObserverAndElement();
  xObserver.observe(...elements);
  getObserver(); // get it now otherwise triggerAll won't be able to get it

  await window.waitForIO();
  expect(callback).toHaveBeenCalledTimes(1); // initial call
  expect(callback).toHaveBeenNthCalledWith(1, elements.length);

  xObserver.disconnect();

  triggerAll();
  await window.waitForIO();
  expect(callback).toHaveBeenCalledTimes(1); // no new calls
});

test("takeRecords", async () => {
  const { callback, xObserver, elements, triggerAll } = newObserverAndElement();
  xObserver.observe(...elements);

  await window.waitForIO();
  expect(callback).toHaveBeenCalledTimes(1); // initial call
  expect(callback).toHaveBeenNthCalledWith(1, elements.length);

  triggerAll();

  const records = xObserver.takeRecords();
  expect(records.length).toBe(elements.length);

  await window.waitForIO();
  expect(callback).toHaveBeenCalledTimes(1); // no new calls

  triggerAll();

  await window.waitForIO();
  expect(callback).toHaveBeenCalledTimes(2);
});

test("get root, rootMargin and thresholds", () => {
  const xObserver = new XIntersectionObserver(() => {}, {
    root: document.body,
    rootMargin: "-10% -10% -10% -10%",
    threshold: [0, 0.2],
  });
  expect(xObserver.root).toBe(document.body);
  expect(xObserver.rootMargin).toBe("-10% -10% -10% -10%");
  expect(xObserver.thresholds).toEqual([0, 0.2]);
});
