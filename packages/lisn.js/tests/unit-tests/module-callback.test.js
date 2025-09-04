const { jest, describe, test, expect } = require("@jest/globals");

const { Callback, CallbackManager } = window.LISN.modules;

describe("sync callbacks", () => {
  test("call: non-concurrent (default)", async () => {
    const fn = jest.fn();
    const cbk = new Callback(fn);
    expect(cbk.isConcurrent()).toBe(false);

    const p1 = cbk.invoke("a");
    const p2 = cbk.invoke("b");
    expect(fn).toHaveBeenCalledTimes(0); // ensure it's async
    await p1;
    await p2;
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(1, "a");
    expect(fn).toHaveBeenNthCalledWith(2, "b");
  });

  test("call: concurrent", () => {
    const fn = jest.fn();
    const cbk = new Callback(fn, true);
    expect(cbk.isConcurrent()).toBe(true);

    cbk.invoke("a");
    cbk.invoke("b");
    expect(fn).toHaveBeenCalledTimes(2); // ensure it's not async
    expect(fn).toHaveBeenNthCalledWith(1, "a");
    expect(fn).toHaveBeenNthCalledWith(2, "b");
  });

  test("throw err", async () => {
    const cbk = new Callback(() => {
      throw "err";
    });
    await expect(cbk.invoke()).rejects.toBe("err");
  });

  test("remove + onRemove (multiple handlers)", () => {
    const rmFnA = jest.fn();
    const rmFnB = jest.fn();
    const cbk = new Callback(() => {});
    cbk.onRemove(rmFnA);
    cbk.onRemove(rmFnA); // duplicate ignored
    cbk.onRemove(rmFnB);

    expect(cbk.remove()).toBe(Callback.REMOVE);
    expect(rmFnA).toHaveBeenCalledTimes(1);
    expect(rmFnB).toHaveBeenCalledTimes(1);
    expect(rmFnA).toHaveBeenCalledWith(cbk);
    expect(rmFnB).toHaveBeenCalledWith(cbk);

    cbk.remove(); // should be no-op
    expect(rmFnA).toHaveBeenCalledTimes(1); // no new calls
    expect(rmFnB).toHaveBeenCalledTimes(1); // no new calls
  });

  test("return REMOVE + onRemove", async () => {
    const rmFn = jest.fn();
    const cbk = new Callback(() => Callback.REMOVE);
    cbk.onRemove(rmFn);

    const p1 = cbk.invoke();
    const p2 = cbk.invoke();

    await p1;
    await expect(p2).rejects.toBe(Callback.REMOVE);

    expect(rmFn).toHaveBeenCalledTimes(1);
    expect(rmFn).toHaveBeenCalledWith(cbk);
  });

  test("remove straight after scheduled", async () => {
    const fn = jest.fn();
    const cbk = new Callback(fn);
    const p1 = cbk.invoke("a");
    cbk.remove();
    await expect(p1).rejects.toBe(Callback.REMOVE);
    expect(fn).toHaveBeenCalledTimes(0);
  });

  test("remove from within handler", async () => {
    const fn = jest.fn(() => {
      cbk.remove();
    });
    const cbk = new Callback(fn);
    const p1 = cbk.invoke("a");
    const p2 = cbk.invoke("b");

    await p1;
    await expect(p2).rejects.toBe(Callback.REMOVE);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("a");
    await window.waitFor(0);
    expect(cbk.isRemoved()).toBe(true);
    await expect(cbk.invoke).rejects.toThrow(/Callback has been removed/);
  });

  test("onRemove invoked synchronously", () => {
    const cbk = new Callback(() => {});

    const onRemove = jest.fn();
    cbk.onRemove(onRemove);
    cbk.remove();
    cbk.remove(); // no-op

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  test("call removed callbacks", async () => {
    const cbk = new Callback(() => {});
    expect(cbk.isRemoved()).toBe(false);
    cbk.remove();
    expect(cbk.isRemoved()).toBe(true);
    await expect(cbk.invoke).rejects.toThrow(/Callback has been removed/);
  });

  test("wrap", () => {
    const cbkA = Callback.wrap(() => {});
    const cbkB = Callback.wrap(cbkA);
    expect(cbkA.isConcurrent()).toBe(false);
    expect(cbkB.isConcurrent()).toBe(false);

    expect(cbkA).toBeInstanceOf(Callback);
    expect(cbkA).not.toBe(cbkB);
  });

  test("wrap: concurrent", () => {
    const cbkA = new Callback(() => {}, true);
    const cbkB = Callback.wrap(cbkA);
    expect(cbkA.isConcurrent()).toBe(true);
    expect(cbkB.isConcurrent()).toBe(true);

    expect(cbkA).toBeInstanceOf(Callback);
    expect(cbkA).not.toBe(cbkB);
  });

  test("wrap debounced", async () => {
    const fn = jest.fn();
    const cbkA = new Callback(fn);
    const cbkDebA = Callback.wrap(fn, 10);
    const cbkDebB = Callback.wrap(cbkA, 10);
    expect(cbkA).not.toBe(cbkDebA);
    expect(cbkA).not.toBe(cbkDebB);
    expect(cbkDebA).not.toBe(cbkDebB);

    cbkDebA.invoke("a");
    cbkDebB.invoke("b");
    cbkDebA.invoke("c");
    cbkDebB.invoke("d");
    expect(fn).toHaveBeenCalledTimes(0);
    await window.waitFor(30);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith("c");
    expect(fn).toHaveBeenCalledWith("d");
  });

  test("remove wrapper", () => {
    const rmFn = jest.fn();
    const cbkInner = new Callback(() => {});
    cbkInner.onRemove(rmFn);

    const cbkWrapper = Callback.wrap(cbkInner);
    cbkWrapper.onRemove(rmFn);

    cbkWrapper.remove(); // should only remove wrapper

    expect(rmFn).toHaveBeenCalledTimes(1);
    expect(rmFn).toHaveBeenCalledWith(cbkWrapper);

    expect(cbkInner.isRemoved()).toBe(false);
    expect(cbkWrapper.isRemoved()).toBe(true);
  });

  test("remove wrapped", () => {
    const rmFn = jest.fn();
    const cbkInner = new Callback(() => {});
    cbkInner.onRemove(rmFn);

    const cbkWrapper = Callback.wrap(cbkInner);
    cbkWrapper.onRemove(rmFn);

    cbkInner.remove(); // should remove both wrapped and wrapper

    expect(rmFn).toHaveBeenCalledTimes(2);
    expect(rmFn).toHaveBeenCalledWith(cbkInner);
    expect(rmFn).toHaveBeenCalledWith(cbkWrapper);

    expect(cbkInner.isRemoved()).toBe(true);
    expect(cbkWrapper.isRemoved()).toBe(true);
  });

  test("return REMOVE from wrapped + invoke wrapped", async () => {
    const rmFn = jest.fn();
    const cbkInner = new Callback(() => Callback.REMOVE);
    cbkInner.onRemove(rmFn);

    const cbkWrapper = Callback.wrap(cbkInner);
    cbkWrapper.onRemove(rmFn);

    await cbkInner.invoke(); // should remove both

    expect(rmFn).toHaveBeenCalledTimes(2);
    expect(rmFn).toHaveBeenCalledWith(cbkInner);
    expect(rmFn).toHaveBeenCalledWith(cbkWrapper);

    expect(cbkInner.isRemoved()).toBe(true);
    expect(cbkWrapper.isRemoved()).toBe(true);
  });

  test("return REMOVE from wrapped + invoke wrapper", async () => {
    const rmFn = jest.fn();
    const cbkInner = new Callback(() => Callback.REMOVE);
    cbkInner.onRemove(rmFn);

    const cbkWrapper = Callback.wrap(cbkInner);
    cbkWrapper.onRemove(rmFn);

    await cbkWrapper.invoke(); // should remove both

    expect(rmFn).toHaveBeenCalledTimes(2);
    expect(rmFn).toHaveBeenCalledWith(cbkInner);
    expect(rmFn).toHaveBeenCalledWith(cbkWrapper);

    expect(cbkInner.isRemoved()).toBe(true);
    expect(cbkWrapper.isRemoved()).toBe(true);
  });

  test("offRemove", () => {
    const rmFnA = jest.fn();
    const rmFnB = jest.fn();
    const cbk = new Callback(() => {});
    cbk.onRemove(rmFnA);
    cbk.onRemove(rmFnA); // duplicate ignored
    cbk.onRemove(rmFnB);

    cbk.offRemove(rmFnA);

    cbk.remove();

    expect(rmFnA).toHaveBeenCalledTimes(0);
    expect(rmFnB).toHaveBeenCalledTimes(1);
    expect(rmFnB).toHaveBeenCalledWith(cbk);
  });
});

describe("async callbacks (selected tests)", () => {
  test("call: non-concurrent (default)", async () => {
    const x = [];
    const cbk = new Callback(
      (n) =>
        new Promise((resolve) => {
          window.setTimeout(() => {
            x.push("start" + n);
            window.setTimeout(() => {
              x.push("end" + n);
              resolve();
            }, 100);
          }, 10);
        }),
    );

    cbk.invoke(1);
    await cbk.invoke(2);
    expect(x).toEqual(["start1", "end1", "start2", "end2"]);
  });

  test("call: concurrent", async () => {
    const x = [];
    const cbk = new Callback(
      (n) =>
        new Promise((resolve) => {
          window.setTimeout(() => {
            x.push("start" + n);
            window.setTimeout(() => {
              x.push("end" + n);
              resolve();
            }, 100);
          }, 10);
        }),
      true,
    );

    cbk.invoke(1);
    await cbk.invoke(2);
    expect(x).toEqual(["start1", "start2", "end1", "end2"]);
  });

  test("call: concurrent v2", () => {
    const x = [];
    const cbkA = new Callback((n) => x.push("A" + n), true);
    const cbkB = new Callback((n) => x.push("B" + n), true);

    cbkA.invoke(1);
    cbkA.invoke(2);
    cbkB.invoke(1);
    cbkB.invoke(2);
    expect(x).toEqual(["A1", "A2", "B1", "B2"]);
  });

  test("throw err", async () => {
    const cbk = new Callback(
      () =>
        new Promise((res, rej) => {
          window.setTimeout(() => rej("err"), 10);
        }),
    );
    await expect(cbk.invoke()).rejects.toBe("err");
  });
});

describe("CallbackManager", () => {
  test("basic", async () => {
    const manager = new CallbackManager();
    expect(manager.isEmpty()).toBe(true);
    const fnA = jest.fn();
    const fnB = jest.fn();
    const cbkB = new Callback(fnB);

    manager.add(fnA);
    expect(manager.isEmpty()).toBe(false);
    manager.add(cbkB);

    await window.waitFor(0);
    for (const fn of [fnA, fnB]) {
      expect(fn).toHaveBeenCalledTimes(0);
    }

    manager.invoke("A", "B");
    for (const fn of [fnA, fnB]) {
      // not yet
      expect(fn).toHaveBeenCalledTimes(0);
    }

    await window.waitFor(0);
    for (const fn of [fnA, fnB]) {
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenLastCalledWith("A", "B");
    }

    manager.invoke("C", "D");
    await window.waitFor(0);
    for (const fn of [fnA, fnB]) {
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenLastCalledWith("C", "D");
    }
  });

  test("auto-removing", async () => {
    let removeSelf = false;

    const manager = new CallbackManager();
    const fnA = jest.fn(() => (removeSelf ? Callback.REMOVE : null));
    const fnB = jest.fn();
    const cbkB = new Callback(fnB);

    manager.add(fnA);
    manager.add(cbkB);

    manager.invoke(1);
    await window.waitFor(0);
    for (const fn of [fnA, fnB]) {
      expect(fn).toHaveBeenCalledTimes(1);
    }

    removeSelf = true;
    manager.invoke(2);
    await window.waitFor(0);
    for (const fn of [fnA, fnB]) {
      expect(fn).toHaveBeenCalledTimes(2); // fnA will have auto-removed
    }

    manager.invoke(3);
    await window.waitFor(0);
    expect(fnA).toHaveBeenCalledTimes(2); // no new calls
    expect(fnB).toHaveBeenCalledTimes(3);

    expect(manager.isEmpty()).toBe(false);
    cbkB.remove();
    expect(manager.isEmpty()).toBe(true);

    await window.waitFor(0);
    expect(fnA).toHaveBeenCalledTimes(2); // no new calls
    expect(fnB).toHaveBeenCalledTimes(3); // no new calls
  });

  test("config: defaultIsConcurrent", async () => {
    const managerA = new CallbackManager({ defaultIsConcurrent: true });
    const managerB = new CallbackManager({ defaultIsConcurrent: false });

    const fnA = jest.fn();
    const fnB = jest.fn();
    const cbkB = new Callback(fnB);

    managerA.add(fnA);
    managerB.add(cbkB);

    await window.waitFor(0);
    for (const fn of [fnA, fnB]) {
      expect(fn).toHaveBeenCalledTimes(0);
    }

    managerA.invoke("A");
    managerB.invoke("A");
    expect(fnA).toHaveBeenCalledTimes(1);
    expect(fnB).toHaveBeenCalledTimes(0); // async

    await window.waitFor(0);
    expect(fnB).toHaveBeenCalledTimes(1);
  });

  test("config + add options: defaultIsConcurrent", async () => {
    const managerA = new CallbackManager({ defaultIsConcurrent: false }); // opposite
    const managerB = new CallbackManager({ defaultIsConcurrent: true }); // opposite

    const fnA = jest.fn();
    const fnB = jest.fn();
    const cbkB = new Callback(fnB);

    managerA.add(fnA, { defaultIsConcurrent: true });
    managerB.add(cbkB, { defaultIsConcurrent: false });

    await window.waitFor(0);
    for (const fn of [fnA, fnB]) {
      expect(fn).toHaveBeenCalledTimes(0);
    }

    managerA.invoke("A");
    managerB.invoke("A");
    expect(fnA).toHaveBeenCalledTimes(1);
    expect(fnB).toHaveBeenCalledTimes(0); // async

    await window.waitFor(0);
    expect(fnB).toHaveBeenCalledTimes(1);
  });

  test("existing concurrent callback", async () => {
    const manager = new CallbackManager({ defaultIsConcurrent: false }); // irrelevant

    const fn = jest.fn();
    const cbk = new Callback(fn, true);

    manager.add(cbk, { defaultIsConcurrent: false }); // irrelevant

    await window.waitFor(0);
    expect(fn).toHaveBeenCalledTimes(0);

    manager.invoke(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test("config: debounceWindow", async () => {
    const manager = new CallbackManager({ debounceWindow: 10 });

    const fnA = jest.fn();
    const fnB = jest.fn();
    const cbkB = new Callback(fnB);

    manager.add(fnA);
    manager.add(cbkB);

    await window.waitFor(0);
    for (const fn of [fnA, fnB]) {
      expect(fn).toHaveBeenCalledTimes(0);
    }

    manager.invoke("A");
    await window.waitFor(0);
    for (const fn of [fnA, fnB]) {
      expect(fn).toHaveBeenCalledTimes(0); // not yet
    }

    await window.waitFor(20);
    for (const fn of [fnA, fnB]) {
      expect(fn).toHaveBeenCalledTimes(1);
    }
  });

  test("config + add options: debounceWindow", async () => {
    const manager = new CallbackManager({ debounceWindow: 0 }); // ignored

    const fnA = jest.fn();
    const fnB = jest.fn();
    const cbkB = new Callback(fnB);

    manager.add(fnA, { debounceWindow: 10 });
    manager.add(cbkB, { debounceWindow: 50 });

    await window.waitFor(0);
    for (const fn of [fnA, fnB]) {
      expect(fn).toHaveBeenCalledTimes(0);
    }

    manager.invoke(1);
    await window.waitFor(0);
    for (const fn of [fnA, fnB]) {
      expect(fn).toHaveBeenCalledTimes(0); // not yet
    }

    await window.waitFor(20);
    expect(fnA).toHaveBeenCalledTimes(1);
    expect(fnB).toHaveBeenCalledTimes(0); // not yet

    await window.waitFor(50);
    for (const fn of [fnA, fnB]) {
      expect(fn).toHaveBeenCalledTimes(1);
    }
  });

  test("delete", async () => {
    const manager = new CallbackManager();

    const fnA = jest.fn();
    const fnB = jest.fn();
    const cbkB = new Callback(fnB);

    manager.add(fnA);
    manager.add(cbkB);

    manager.invoke(1);
    await window.waitFor(0);
    for (const fn of [fnA, fnB]) {
      expect(fn).toHaveBeenCalledTimes(1);
    }

    manager.delete(fnA);
    expect(manager.isEmpty()).toBe(false);

    manager.invoke(2);
    await window.waitFor(0);
    expect(fnA).toHaveBeenCalledTimes(1); // no new calls
    expect(fnB).toHaveBeenCalledTimes(2);

    manager.delete(fnB); // no-op since the callback was added
    manager.delete(() => {}); // no-op
    expect(manager.isEmpty()).toBe(false);

    manager.invoke(3);
    await window.waitFor(0);
    expect(fnA).toHaveBeenCalledTimes(1); // no new calls
    expect(fnB).toHaveBeenCalledTimes(3);

    manager.delete(cbkB);
    expect(manager.isEmpty()).toBe(true);

    manager.invoke(4);
    await window.waitFor(0);
    expect(fnA).toHaveBeenCalledTimes(1); // no new calls
    expect(fnB).toHaveBeenCalledTimes(3); // no new calls

    expect(cbkB.isRemoved()).toBe(false); // original callback not affected
  });

  test("clear", async () => {
    const manager = new CallbackManager();

    const fnA = jest.fn();
    const fnB = jest.fn();
    const cbkB = new Callback(fnB);

    manager.add(fnA);
    manager.add(cbkB);

    manager.invoke(1);
    await window.waitFor(0);
    for (const fn of [fnA, fnB]) {
      expect(fn).toHaveBeenCalledTimes(1);
    }

    manager.clear();
    expect(manager.isEmpty()).toBe(true);

    manager.invoke(2);
    await window.waitFor(0);
    for (const fn of [fnA, fnB]) {
      expect(fn).toHaveBeenCalledTimes(1); // no new calls
    }

    expect(cbkB.isRemoved()).toBe(false); // original callback not affected
  });
});
