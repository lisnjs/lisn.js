const { jest, describe, test, expect } = require("@jest/globals");

const { Callback } = window.LISN.modules;
const {
  FXTrigger,
  FXProxyTrigger,
  FXScrollTrigger,
  FXGestureTrigger,
  FX_TRIGGER,
} = window.LISN.effects;

const diffTolerance = 20; // in percent

const roundPercentDiff = (x, y) => {
  return 100 * Math.floor(Math.abs(x - y) / Math.max(x, y));
};

const startReceiver = (trigger, received) =>
  (async () => {
    for await (const value of trigger.poll()) {
      received.push(value);
    }
  })();

const newTrigger = (executorBody) => {
  let push;
  const executor = jest.fn((p) => {
    push = p;
    if (executorBody) {
      executorBody(push);
    }
  });

  const trigger = new FXTrigger(executor);

  return { trigger, push, executor };
};

describe("FXTrigger", () => {
  test("push/poll: for await ... of", async () => {
    const { trigger, push, executor } = newTrigger();
    expect(executor).toHaveBeenCalledTimes(1);

    const data = [null, undefined, true, false, { a: 1, b: 2 }, { a: 2, c: 3 }];
    const delays = data.map((e, i) => 100 + (i + 1) * 100);

    const setPushTimer = (n = 0) => {
      setTimeout(() => {
        push(data[n]);
        if (n < data.length - 1) {
          setPushTimer(n + 1);
        }
      }, delays[n]);
    };

    setPushTimer();

    let i = 0;
    for await (const value of trigger.poll()) {
      const startTime = Date.now();
      expect(roundPercentDiff(Date.now(), startTime + delays[i])).toBeLessThan(
        diffTolerance,
      );
      expect(value).toEqual(data[i]);

      i++;
      if (i === data.length) {
        break;
      }
    }

    expect(i).toBe(data.length);
    expect(executor).toHaveBeenCalledTimes(1);
  });

  test("push/poll: next()", async () => {
    const { trigger, push, executor } = newTrigger();
    expect(executor).toHaveBeenCalledTimes(1);

    const poller = trigger.poll();

    for (let i = 1; i <= 3; i++) {
      const data = { a: i, b: i + 1 };
      const delay = 100 + i * 100;
      setTimeout(() => push(data), delay);

      const startTime = Date.now();
      const { value, done } = await poller.next();

      expect(roundPercentDiff(Date.now(), startTime + delay)).toBeLessThan(
        diffTolerance,
      );
      expect(value).toEqual(data);
      expect(done).toBe(false);
    }

    expect(executor).toHaveBeenCalledTimes(1);
  });

  test("push multiple at a time + before poll: for await ... of", async () => {
    const { trigger, push, executor } = newTrigger();

    push("A");
    push("B"); // discards A

    const received = [];

    startReceiver(trigger, received);

    await window.waitFor(0);
    expect(received).toEqual(["B"]);

    push("C");
    push("D");
    push("E");

    await window.waitFor(100);
    expect(received).toEqual(["B", "C", "D", "E"]);

    expect(executor).toHaveBeenCalledTimes(1);
  });

  test("push multiple at a time + before poll: next()", async () => {
    const { trigger, push } = newTrigger();

    push("A");
    push("B"); // discards A

    const poller = trigger.poll();
    await expect(poller.next()).resolves.toEqual({ value: "B", done: false });

    push("C");
    push("D");

    await expect(poller.next()).resolves.toEqual({ value: "C", done: false });
    await expect(poller.next()).resolves.toEqual({ value: "D", done: false });
  });

  test("multiple pollers: push multiple at a time + before poll: for await ... of", async () => {
    const { trigger, push, executor } = newTrigger();

    push("A");
    push("B"); // discards A

    const receivedA = [];
    const receivedB = [];
    const receivedC = [];

    startReceiver(trigger, receivedA);
    startReceiver(trigger, receivedB);

    push("C");

    startReceiver(trigger, receivedC);

    push("D");
    push("E");

    await window.waitFor(0);
    for (const received of [receivedA, receivedB]) {
      expect(received).toEqual(["B", "C", "D", "E"]);
    }
    expect(receivedC).toEqual(["C", "D", "E"]);

    expect(executor).toHaveBeenCalledTimes(1);
  });

  test("multiple pollers: push multiple at a time + before poll: next()", async () => {
    const { trigger, push } = newTrigger();

    push("A");
    push("B"); // discards A

    const p1 = trigger.poll();
    const p2 = trigger.poll();

    await expect(p1.next()).resolves.toEqual({ value: "B", done: false });
    await expect(p2.next()).resolves.toEqual({ value: "B", done: false });

    push("C");

    const p3 = trigger.poll();

    await expect(p1.next()).resolves.toEqual({ value: "C", done: false });
    await expect(p2.next()).resolves.toEqual({ value: "C", done: false });
    await expect(p3.next()).resolves.toEqual({ value: "C", done: false });

    push("D");
    push("E");

    await expect(p1.next()).resolves.toEqual({ value: "D", done: false });
    await expect(p2.next()).resolves.toEqual({ value: "D", done: false });
    await expect(p3.next()).resolves.toEqual({ value: "D", done: false });

    await expect(p1.next()).resolves.toEqual({ value: "E", done: false });
    await expect(p2.next()).resolves.toEqual({ value: "E", done: false });
    await expect(p3.next()).resolves.toEqual({ value: "E", done: false });
  });

  test("modifying polled data", async () => {
    const { trigger, push } = newTrigger();

    const dataA = { a: 1, b: { c: "a" } };
    push(dataA);

    const p = trigger.poll();

    // ---------- initial (pre-poll) data

    let result = (await p.next()).value;
    expect(result).toEqual(dataA);
    expect(result).not.toBe(dataA); // copied

    result.b.c = "z";
    expect(dataA.b.c).toBe("a"); // deeply copied

    const dataB = { a: 2, b: { c: "b" } };

    const p2 = trigger.poll();
    let result2 = (await p2.next()).value;
    expect(result2).toEqual(dataA);

    // ---------- new data

    push(dataB);

    result = (await p.next()).value;
    expect(result).toEqual(dataB);
    expect(result).not.toBe(dataB); // copied

    result.b.c = "z";
    expect(dataB.b.c).toBe("b"); // deeply copied

    result2 = (await p2.next()).value;
    expect(result2).toEqual(dataB);
  });

  test("multiple pollers: push while paused + resume", async () => {
    const { trigger, push, executor } = newTrigger();
    expect(executor).toHaveBeenCalledTimes(1);

    const receivedA = [];
    const receivedB = [];
    const receivedC = [];
    const receivedD = [];

    push("A");
    push("B"); // discards A

    startReceiver(trigger, receivedA); // before pause

    push("C");
    await window.waitFor(0);
    expect(receivedA).toEqual(["B", "C"]);

    startReceiver(trigger, receivedB); // after first poller
    await window.waitFor(0);
    expect(receivedB).toEqual(["C"]);

    trigger.pause();
    startReceiver(trigger, receivedC); // after pause

    push("P1");
    await window.waitFor(0);
    // no new data
    expect(receivedA).toEqual(["B", "C"]);
    expect(receivedB).toEqual(["C"]);
    expect(receivedC).toEqual([]);

    push("P2"); // discards P1, will be yielded on resume
    await window.waitFor(0);
    // no new data
    expect(receivedA).toEqual(["B", "C"]);
    expect(receivedB).toEqual(["C"]);
    expect(receivedC).toEqual([]);

    trigger.resume();
    startReceiver(trigger, receivedD); // after resume

    await window.waitFor(0);
    expect(receivedA).toEqual(["B", "C", "P2"]);
    expect(receivedB).toEqual(["C", "P2"]);
    expect(receivedC).toEqual(["P2"]);
    expect(receivedD).toEqual(["P2"]);

    push("D");
    await window.waitFor(0);
    expect(receivedA).toEqual(["B", "C", "P2", "D"]);
    expect(receivedB).toEqual(["C", "P2", "D"]);
    expect(receivedC).toEqual(["P2", "D"]);
    expect(receivedD).toEqual(["P2", "D"]);

    expect(executor).toHaveBeenCalledTimes(1);
  });

  test("pause/resume + first push after paused", async () => {
    const { trigger, push, executor } = newTrigger();
    expect(trigger.isRunning()).toBe(true);
    expect(executor).toHaveBeenCalledTimes(1);

    const receivedA = [];
    const receivedB = [];
    const receivedC = [];

    startReceiver(trigger, receivedA); // before pause
    trigger.pause();
    expect(trigger.isRunning()).toBe(false);
    startReceiver(trigger, receivedB); // after pause

    push("P1");
    await window.waitFor(0);
    for (const received of [receivedA, receivedB, receivedC]) {
      expect(received).toEqual([]);
    }

    push("P2"); // discards P1, will be yielded on resume
    await window.waitFor(0);
    for (const received of [receivedA, receivedB, receivedC]) {
      expect(received).toEqual([]);
    }

    trigger.resume();
    expect(trigger.isRunning()).toBe(true);
    startReceiver(trigger, receivedC); // after resume

    await window.waitFor(0);
    for (const received of [receivedA, receivedB, receivedC]) {
      expect(received).toEqual(["P2"]);
    }

    push("A");
    push("B");
    await window.waitFor(0);
    for (const received of [receivedA, receivedB, receivedC]) {
      expect(received).toEqual(["P2", "A", "B"]);
    }

    expect(executor).toHaveBeenCalledTimes(1);
  });

  test("pause/resume + first push after resumed", async () => {
    const { trigger, push, executor } = newTrigger();
    expect(trigger.isRunning()).toBe(true);
    expect(executor).toHaveBeenCalledTimes(1);

    const receivedA = [];
    const receivedB = [];
    const receivedC = [];

    startReceiver(trigger, receivedA); // before pause
    trigger.pause();
    expect(trigger.isRunning()).toBe(false);
    startReceiver(trigger, receivedB); // after pause

    trigger.resume();
    expect(trigger.isRunning()).toBe(true);
    startReceiver(trigger, receivedC); // after resume

    await window.waitFor(0);
    for (const received of [receivedA, receivedB, receivedC]) {
      expect(received).toEqual([]);
    }

    push("A");
    push("B");
    await window.waitFor(0);
    for (const received of [receivedA, receivedB, receivedC]) {
      expect(received).toEqual(["A", "B"]);
    }

    expect(executor).toHaveBeenCalledTimes(1);
  });

  test("onToggle/offToggle", async () => {
    const cbk = jest.fn();
    const { trigger, push } = newTrigger();
    expect(trigger.isRunning()).toBe(true);

    trigger.onToggle(cbk);
    trigger.onToggle(cbk); // no-op
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(0);

    const received = [];

    startReceiver(trigger, received);

    push("A");
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(0); // not called on push

    trigger.pause();
    expect(trigger.isRunning()).toBe(false);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenNthCalledWith(1, trigger, { isRunning: false });

    trigger.pause(); // no-op
    expect(trigger.isRunning()).toBe(false);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(1);

    push("P1");
    await window.waitFor(0);
    expect(cbk).toHaveBeenCalledTimes(1); // no new calls

    push("P2");
    await window.waitFor(0);
    expect(cbk).toHaveBeenCalledTimes(1); // no new calls

    trigger.resume();
    expect(trigger.isRunning()).toBe(true);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(2);
    expect(cbk).toHaveBeenNthCalledWith(2, trigger, { isRunning: true });

    trigger.resume(); // no-op
    expect(trigger.isRunning()).toBe(true);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(2);

    push("B");
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(2); // not called on push

    expect(received).toEqual(["A", "P2", "B"]);

    // ---------- multiple changes at a time

    trigger.pause(); // +1
    trigger.resume(); // +1
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(4);
    expect(cbk).toHaveBeenNthCalledWith(3, trigger, { isRunning: false });
    expect(cbk).toHaveBeenNthCalledWith(4, trigger, { isRunning: true });

    trigger.offToggle(cbk);
    trigger.pause();
    trigger.resume();
    trigger.pause();
    trigger.resume();
    expect(trigger.isRunning()).toBe(true);

    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(4); // no new calls
  });

  test("onToggle/offToggle: callback.remove", async () => {
    const cbkJ = jest.fn();
    const cbk = Callback.wrap(cbkJ);
    const { trigger } = newTrigger();

    trigger.onToggle(cbk);
    trigger.onToggle(cbk); // no-op
    cbk.remove();

    trigger.pause();
    trigger.resume();
    trigger.pause();
    trigger.resume();

    await window.waitFor(0); // callbacks are async
    expect(cbkJ).toHaveBeenCalledTimes(0);
  });

  test("onToggle/offToggle: return Callback.REMOVE", async () => {
    const cbk = jest.fn(() => Callback.REMOVE);
    const { trigger } = newTrigger();

    trigger.onToggle(cbk);
    trigger.onToggle(cbk); // no-op

    trigger.pause();
    trigger.resume();
    trigger.pause();
    trigger.resume();

    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(1); // removed after 1st time
  });
});

describe("FXProxyTrigger", () => {
  test("no proxied", () => {
    expect(() => new FXProxyTrigger()).toThrow(/A trigger is required/);
  });

  test("basic", async () => {
    const { trigger: proxied, push } = newTrigger();
    const proxy = new FXProxyTrigger(proxied);

    const received = [];
    startReceiver(proxy, received);

    push("A");
    await window.waitFor(0); // callbacks are async
    expect(received).toEqual(["A"]);
  });

  test("proxied paused", async () => {
    const { trigger: proxied, push } = newTrigger();
    const proxy = new FXProxyTrigger(proxied);
    proxy.pause();

    const received = [];
    startReceiver(proxy, received);

    push("A");
    await window.waitFor(0); // callbacks are async
    expect(received).toEqual([]);
  });

  test("with delay", async () => {
    const { trigger: proxied, push } = newTrigger();
    const delay = 100;
    const proxy = new FXProxyTrigger(proxied, { delay });

    const received = [];
    startReceiver(proxy, received);

    push("A");
    await window.waitFor(delay - 10);
    expect(received).toEqual([]);

    await window.waitFor(delay + 10);
    expect(received).toEqual(["A"]);
  });

  test("with transformFn", async () => {
    const { trigger: proxied, push } = newTrigger();
    const transformFn = jest.fn(() => "B");
    const proxy = new FXProxyTrigger(proxied, { transformFn });

    const received = [];
    startReceiver(proxy, received);

    push("A");
    expect(transformFn).toHaveBeenCalledTimes(0); // not yet
    await window.waitFor(0); // callbacks are async
    expect(transformFn).toHaveBeenCalledTimes(1);
    expect(transformFn).toHaveBeenCalledWith("A");
    expect(received).toEqual(["B"]);
  });

  test("with delay and transformFn", async () => {
    const { trigger: proxied, push } = newTrigger();
    const delay = 100;
    const transformFn = jest.fn(() => "B");
    const proxy = new FXProxyTrigger(proxied, { delay, transformFn });

    const received = [];
    startReceiver(proxy, received);

    push("A");
    await window.waitFor(delay - 10);
    expect(transformFn).toHaveBeenCalledTimes(0); // not yet
    expect(received).toEqual([]);

    await window.waitFor(delay + 10);
    expect(transformFn).toHaveBeenCalledTimes(1);
    expect(transformFn).toHaveBeenCalledWith("A");
    expect(received).toEqual(["B"]);
  });

  test("in FX_TRIGGER", () => {
    const { trigger: proxied } = newTrigger();
    expect(FX_TRIGGER.proxy).not.toBeUndefined();
    expect(FX_TRIGGER.proxy(proxied)).toBeInstanceOf(FXProxyTrigger);
  });
});

describe("FXScrollTrigger", () => {
  test("basic", async () => {
    const pollAndTestData = async (snap) => {
      const data = (await poller.next()).value;
      expect(data).toEqual({
        x: {
          low: 0,
          high: window.SCROLL_WIDTH - window.CLIENT_WIDTH,
          target: scrollLeft,
          snap,
        },
        y: {
          low: 0,
          high: window.SCROLL_HEIGHT - window.CLIENT_HEIGHT,
          target: scrollTop,
          snap,
        },
      });
    };

    const scrollable = document.createElement("div");
    scrollable.enableScroll();

    let scrollLeft = 20,
      scrollTop = 50;
    scrollable.scrollTo(scrollLeft, scrollTop);

    const trigger = new FXScrollTrigger(scrollable);
    const poller = trigger.poll();

    // ---------- initial
    await pollAndTestData(true);
    expect(window.numEventListeners.get(scrollable) || 0).toBeGreaterThan(0);

    // ---------- after scroll
    scrollLeft += 5;
    scrollTop += 5;
    scrollable.scrollTo(scrollLeft, scrollTop);

    await pollAndTestData(false);

    // ---------- after pause/resume
    trigger.pause();
    trigger.resume();

    scrollLeft += 5;
    scrollTop += 5;
    scrollable.scrollTo(scrollLeft, scrollTop);

    await pollAndTestData(true);

    // ---------- stop watcher on pause
    trigger.pause();
    await window.waitFor(50);
    expect(window.numEventListeners.get(scrollable) || 0).toBe(0);

    // ---------- restart watcher on resume
    trigger.resume();
    await window.waitFor(50);
    expect(window.numEventListeners.get(scrollable) || 0).toBeGreaterThan(0);
  });

  test("in FX_TRIGGER", () => {
    expect(FX_TRIGGER.scroll).not.toBeUndefined();
    expect(FX_TRIGGER.scroll()).toBeInstanceOf(FXScrollTrigger);
  });
});

describe("FXGestureTrigger", () => {
  test("no target", () => {
    expect(() => new FXGestureTrigger()).toThrow(/A target is required/);
  });

  test("basic", async () => {
    const pollAndTestData = async (x, y, z) => {
      const data = (await poller.next()).value;
      expect(data).toEqual({
        x: {
          low: 0,
          high: x,
          target: x,
        },
        y: {
          low: 0,
          high: y,
          target: y,
        },
        z: {
          low: 0,
          high: z,
          target: z,
        },
      });
    };
    const target = document.createElement("div");

    const trigger = new FXGestureTrigger(target);
    const poller = trigger.poll();

    await window.waitFor(50);
    expect(window.numEventListeners.get(target) || 0).toBeGreaterThan(0);

    // ---------- wheel scroll
    target.dispatchEvent(window.newWheel(0, -100));
    await pollAndTestData(0, -100, 1);

    // ---------- wheel zoom
    target.dispatchEvent(window.newWheel(0, -10, false, true)); // +10% zoom
    await pollAndTestData(0, -100, 1.1);

    // ---------- after pause/resume
    trigger.pause();
    trigger.resume();

    await window.waitFor(50);

    target.dispatchEvent(window.newWheel(10, 10));
    await pollAndTestData(10, -90, 1.1);

    // ---------- stop watcher on pause
    trigger.pause();
    await window.waitFor(50);
    expect(window.numEventListeners.get(target) || 0).toBe(0);

    // ---------- restart watcher on resume
    trigger.resume();
    await window.waitFor(50);
    expect(window.numEventListeners.get(target) || 0).toBeGreaterThan(0);
  });

  test("with config (selected)", async () => {
    const pollAndTestData = (x, y, z, next = null, timeout = 100) => {
      return new Promise((resolve) => {
        let isResolved = false;

        setTimeout(() => {
          if (!isResolved) {
            isResolved = true;
            resolve({ timeout: true, next });
          }
        }, timeout);

        (async () => {
          next ??= poller.next().then((v) => v.value);
          const data = await next;
          if (isResolved) {
            return;
          }

          expect(data).toEqual({
            x: {
              low: 0,
              high: x,
              target: x,
            },
            y: {
              low: 0,
              high: y,
              target: y,
            },
            z: {
              low: 0,
              high: z,
              target: z,
            },
          });

          isResolved = true;
          resolve({ timeout: false, next: null });
        })();
      });
    };

    const LINE = 40;

    const target = document.createElement("div");

    const trigger = new FXGestureTrigger(target, {
      devices: "key",
      intents: "scroll",
      directions: "up,down",
    });
    const poller = trigger.poll();

    await window.waitFor(50);
    expect(window.numEventListeners.get(target) || 0).toBeGreaterThan(0);

    // ---------- key scroll up
    target.dispatchEvent(window.newKeyDown("Up"));
    let result = await pollAndTestData(0, -LINE, 1);
    expect(result.timeout).toBe(false);
    expect(result.next).toBe(null);

    // ---------- wheel scroll (ignored)
    target.dispatchEvent(window.newWheel(0, -100));
    result = await pollAndTestData(0, -LINE, 1);
    expect(result.timeout).toBe(true);
    expect(result.next).toBeTruthy();

    // ---------- key scroll left (ignored)
    target.dispatchEvent(window.newKeyDown("Left"));
    result = await pollAndTestData(0, -LINE, 1, result.next);
    expect(result.timeout).toBe(true);
    expect(result.next).toBeTruthy();

    // ---------- key zoom (ignored)
    target.dispatchEvent(window.newKeyDown("+"));
    result = await pollAndTestData(0, -LINE, 1, result.next);
    expect(result.timeout).toBe(true);
    expect(result.next).toBeTruthy();

    // ---------- key scroll down
    target.dispatchEvent(window.newKeyDown("Down"));
    result = await pollAndTestData(0, 0, 1, result.next);
    expect(result.timeout).toBe(false);
    expect(result.next).toBe(null);

    target.dispatchEvent(window.newKeyDown("Down"));
    result = await pollAndTestData(0, LINE, 1, result.next);
    expect(result.timeout).toBe(false);
    expect(result.next).toBe(null);

    // ---------- after pause/resume
    trigger.pause();
    trigger.resume();

    await window.waitFor(50);

    // ---------- key scroll down
    target.dispatchEvent(window.newKeyDown("Down"));
    result = await pollAndTestData(0, 2 * LINE, 1, result.next);
    expect(result.timeout).toBe(false);
    expect(result.next).toBe(null);

    // ---------- key scroll left (ignored)
    target.dispatchEvent(window.newKeyDown("Left"));
    result = await pollAndTestData(0, 2 * LINE, 1, result.next);
    expect(result.timeout).toBe(true);
    expect(result.next).toBeTruthy();

    // ---------- stop watcher on pause
    trigger.pause();
    await window.waitFor(50);
    expect(window.numEventListeners.get(target) || 0).toBe(0);

    // ---------- restart watcher on resume
    trigger.resume();
    await window.waitFor(50);
    expect(window.numEventListeners.get(target) || 0).toBeGreaterThan(0);
  });

  test("in FX_TRIGGER", () => {
    expect(FX_TRIGGER.gesture).not.toBeUndefined();
    expect(FX_TRIGGER.gesture(document.createElement("div"))).toBeInstanceOf(
      FXGestureTrigger,
    );
  });
});
