const { jest, describe, test, expect } = require("@jest/globals");

const { Callback } = window.LISN.modules;

describe("sync callbacks", () => {
  test("call", async () => {
    const fn = jest.fn();
    const cbk = new Callback(fn);
    const p1 = cbk.invoke("a");
    const p2 = cbk.invoke("b");
    expect(fn).toHaveBeenCalledTimes(0); // ensure it's async
    await p1;
    await p2;
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(1, "a");
    expect(fn).toHaveBeenNthCalledWith(2, "b");
  });

  test("throw err", async () => {
    const cbk = new Callback(() => {
      throw "err";
    });
    await expect(cbk.invoke()).rejects.toBe("err");
  });

  test("remove + onRemove", () => {
    const rmFn = jest.fn();
    const cbk = new Callback(() => {});
    cbk.onRemove(() => rmFn("a"));
    cbk.onRemove(() => rmFn("a2"));
    cbk.remove();
    expect(rmFn).toHaveBeenCalledTimes(2);
    expect(rmFn).toHaveBeenNthCalledWith(1, "a");
    expect(rmFn).toHaveBeenNthCalledWith(2, "a2");
    cbk.remove(); // should be no-op
    expect(rmFn).toHaveBeenCalledTimes(2);
  });

  test("return REMOVE + onRemove", async () => {
    const rmFn = jest.fn();
    const cbk = new Callback(() => Callback.REMOVE);
    cbk.onRemove(() => rmFn("a"));

    const p1 = cbk.invoke();
    const p2 = cbk.invoke();

    await p1;
    await expect(p2).rejects.toBe(Callback.REMOVE);

    expect(rmFn).toHaveBeenCalledTimes(1);
    expect(rmFn).toHaveBeenCalledWith("a");
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

  test("remove wrapper + onRemove", () => {
    const rmFn = jest.fn();
    const cbkInner = new Callback(() => {});
    const cbkWrapper = Callback.wrap(cbkInner);
    cbkWrapper.onRemove(() => rmFn("a"));
    cbkWrapper.onRemove(() => rmFn("a2"));
    cbkWrapper.remove(); // should only remove wrapper

    expect(rmFn).toHaveBeenCalledTimes(2);
    expect(rmFn).toHaveBeenNthCalledWith(1, "a");
    expect(rmFn).toHaveBeenNthCalledWith(2, "a2");
    expect(cbkInner.isRemoved()).toBe(false);
    expect(cbkWrapper.isRemoved()).toBe(true);

    cbkWrapper.remove(); // should be no-op
    cbkInner.remove(); // should remove inner, but not call wrapper's onRemove again
    expect(rmFn).toHaveBeenCalledTimes(2);
    expect(cbkInner.isRemoved()).toBe(true);
  });

  test("remove wrapped + onRemove", () => {
    const rmFn = jest.fn();
    const cbkInner = new Callback(() => {});
    const cbkWrapper = Callback.wrap(cbkInner);
    cbkWrapper.onRemove(() => rmFn("a"));
    cbkWrapper.onRemove(() => rmFn("a2"));
    cbkInner.remove(); // should remove both

    expect(rmFn).toHaveBeenCalledTimes(2);
    expect(rmFn).toHaveBeenNthCalledWith(1, "a");
    expect(rmFn).toHaveBeenNthCalledWith(2, "a2");
    expect(cbkInner.isRemoved()).toBe(true);
    expect(cbkWrapper.isRemoved()).toBe(true);

    cbkWrapper.remove(); // should be no-op
    cbkInner.remove(); // should be no-op
    expect(rmFn).toHaveBeenCalledTimes(2);
  });

  test("return REMOVE from wrapped + onRemove", async () => {
    const rmFn = jest.fn();
    const cbkInner = new Callback(() => Callback.REMOVE);
    const cbkWrapper = Callback.wrap(cbkInner);
    cbkWrapper.onRemove(() => rmFn("a"));
    cbkWrapper.onRemove(() => rmFn("a2"));
    await cbkWrapper.invoke(); // should remove both

    expect(rmFn).toHaveBeenCalledTimes(2);
    expect(rmFn).toHaveBeenNthCalledWith(1, "a");
    expect(rmFn).toHaveBeenNthCalledWith(2, "a2");
    expect(cbkInner.isRemoved()).toBe(true);
    expect(cbkWrapper.isRemoved()).toBe(true);

    cbkWrapper.remove(); // should be no-op
    cbkInner.remove(); // should be no-op
    expect(rmFn).toHaveBeenCalledTimes(2);
  });

  test("remove wrapped invoke method + onRemove", () => {
    const rmFn = jest.fn();
    const cbkInner = new Callback(() => {});
    const cbkWrapper = Callback.wrap(cbkInner.invoke);
    cbkWrapper.onRemove(() => rmFn("a"));
    cbkWrapper.onRemove(() => rmFn("a2"));
    cbkInner.remove(); // should remove both

    expect(rmFn).toHaveBeenCalledTimes(2);
    expect(rmFn).toHaveBeenNthCalledWith(1, "a");
    expect(rmFn).toHaveBeenNthCalledWith(2, "a2");
    expect(cbkInner.isRemoved()).toBe(true);
    expect(cbkWrapper.isRemoved()).toBe(true);

    cbkWrapper.remove(); // should be no-op
    cbkInner.remove(); // should be no-op
    expect(rmFn).toHaveBeenCalledTimes(2);
  });
});

describe("async callbacks (selected tests)", () => {
  test("call", async () => {
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
