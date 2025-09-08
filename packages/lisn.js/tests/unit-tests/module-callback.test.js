const { jest, describe, test, expect } = require("@jest/globals");

const { Callback, CallbackManager } = window.LISN.modules;

describe("sync callbacks", () => {
  test("call: non-concurrent (default)", async () => {
    const x = [];
    const fnA = jest.fn((n) => {
      const r = "A" + n;
      x.push(r);
      return r;
    });
    const fnB = jest.fn((n) => {
      const r = "B" + n;
      x.push(r);
      return r;
    });
    const cbkA = new Callback(fnA);
    const cbkB = new Callback(fnB);
    expect(cbkA.isConcurrent()).toBe(false);
    expect(cbkB.isConcurrent()).toBe(false);

    const sTime = Date.now();
    const pA1 = cbkA.invoke(1);
    const pA2 = cbkA.invoke(2); // will await
    const pB1 = cbkB.invoke(1);
    const pB2 = cbkB.invoke(2); // will await

    // it's async
    expect(fnA).toHaveBeenCalledTimes(0);
    expect(fnB).toHaveBeenCalledTimes(0);
    expect(x).toEqual([]);

    await expect(pA1).resolves.toBe("A1");
    await expect(pA2).resolves.toBe("A2");
    await expect(pB1).resolves.toBe("B1");
    await expect(pB2).resolves.toBe("B2");
    expect(Date.now() - sTime).toBeLessThanOrEqual(15); // allow 15ms error

    expect(x).toEqual(["A1", "B1", "A2", "B2"]); // B1 before A2
    for (const fn of [fnA, fnB]) {
      expect(fn).toHaveBeenCalledTimes(2);
      for (let i = 1; i <= 2; i++) {
        expect(fn).toHaveBeenNthCalledWith(i, i);
      }
    }
  });

  test("call: concurrent", async () => {
    const x = [];
    const fnA = jest.fn((n) => {
      const r = "A" + n;
      x.push(r);
      return r;
    });
    const fnB = jest.fn((n) => {
      const r = "B" + n;
      x.push(r);
      return r;
    });
    const cbkA = new Callback(fnA, { concurrent: true });
    const cbkB = new Callback(fnB, { concurrent: true });
    expect(cbkA.isConcurrent()).toBe(true);
    expect(cbkB.isConcurrent()).toBe(true);

    const sTime = Date.now();
    const pA1 = cbkA.invoke(1);
    const pA2 = cbkA.invoke(2);
    const pB1 = cbkB.invoke(1);
    const pB2 = cbkB.invoke(2);

    // it's not async
    expect(x).toEqual(["A1", "A2", "B1", "B2"]);
    for (const fn of [fnA, fnB]) {
      expect(fn).toHaveBeenCalledTimes(2);
      for (let i = 1; i <= 2; i++) {
        expect(fn).toHaveBeenNthCalledWith(i, i);
      }
    }

    await expect(pA1).resolves.toBe("A1");
    await expect(pA2).resolves.toBe("A2");
    await expect(pB1).resolves.toBe("B1");
    await expect(pB2).resolves.toBe("B2");
    expect(Date.now() - sTime).toBeLessThanOrEqual(15); // allow 15ms error
  });

  for (const debounceWindow of [0, -10]) {
    test(`non-concurrent + debounceWindow = ${debounceWindow}`, async () => {
      const fn = jest.fn((a) => a + " done");
      const cbk = new Callback(fn, { debounceWindow });
      expect(cbk.isConcurrent()).toBe(false);
      expect(cbk.getDebounceWindow()).toBe(0);

      const sTime = Date.now();
      const p1 = cbk.invoke("a");
      const p2 = cbk.invoke("b");
      expect(fn).toHaveBeenCalledTimes(0); // not concurrent

      await expect(p1).resolves.toBe("a done");
      await expect(p2).resolves.toBe("b done");
      expect(Date.now() - sTime).toBeLessThanOrEqual(15); // allow 15ms error

      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(1, "a");
      expect(fn).toHaveBeenNthCalledWith(2, "b");
    });

    test(`concurrent + debounceWindow = ${debounceWindow}`, async () => {
      const fn = jest.fn((a) => a + " done");
      const cbk = new Callback(fn, { debounceWindow, concurrent: true });
      expect(cbk.isConcurrent()).toBe(true);
      expect(cbk.getDebounceWindow()).toBe(0);

      const sTime = Date.now();
      const p1 = cbk.invoke("a");
      const p2 = cbk.invoke("b");
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(1, "a");
      expect(fn).toHaveBeenNthCalledWith(2, "b");

      await expect(p1).resolves.toBe("a done");
      await expect(p2).resolves.toBe("b done");
      expect(Date.now() - sTime).toBeLessThanOrEqual(15); // allow 15ms error
    });
  }

  for (const concurrent of [false, true]) {
    test(`${concurrent ? "" : "non-"}concurrent + debounced`, async () => {
      const fn = jest.fn((a) => a + " done");
      const cbk = new Callback(fn, { debounceWindow: 20, concurrent });
      expect(cbk.getDebounceWindow()).toBe(20);

      const sTime = Date.now();
      const p1 = cbk.invoke("a");
      const p2 = cbk.invoke("b");
      expect(fn).toHaveBeenCalledTimes(0);

      await expect(p1).resolves.toBe("b done");
      await expect(p2).resolves.toBe("b done");
      expect(Date.now() - sTime).toBeLessThanOrEqual(35); // allow 15ms error

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith("b");
    });
  }

  test("throw err", async () => {
    const cbk = new Callback(() => {
      throw "err";
    });

    await expect(cbk.invoke()).rejects.toBe("err");
  });

  for (const reason of [undefined, Callback.REMOVE_REASON_RETURN]) {
    test(`remove + onRemove (multiple handlers)${reason ? " (reason return)" : ""}`, async () => {
      const rmFnA = jest.fn();
      const rmFnB = jest.fn();
      const cbk = new Callback(() => {});
      cbk.onRemove(rmFnA);
      cbk.onRemove(rmFnA); // duplicate ignored
      cbk.onRemove(rmFnB);

      expect(cbk.remove(reason)).toBe(Callback.REMOVE);
      expect(rmFnA).toHaveBeenCalledTimes(1);
      expect(rmFnB).toHaveBeenCalledTimes(1);
      expect(rmFnA).toHaveBeenCalledWith(
        reason ?? Callback.REMOVE_REASON_USER,
        cbk,
      );
      expect(rmFnB).toHaveBeenCalledWith(
        reason ?? Callback.REMOVE_REASON_USER,
        cbk,
      );

      cbk.remove(); // should be no-op
      expect(rmFnA).toHaveBeenCalledTimes(1); // no new calls
      expect(rmFnB).toHaveBeenCalledTimes(1); // no new calls

      expect(cbk.isRemoved()).toBe(true);
      await expect(cbk.invoke).rejects.toThrow(/Callback has been removed/);
    });
  }

  test("return REMOVE + onRemove", async () => {
    const rmFn = jest.fn();
    const fn = jest.fn(() => Callback.REMOVE);
    const cbk = new Callback(fn);
    cbk.onRemove(rmFn);

    const sTime = Date.now();
    const p1 = cbk.invoke(); // 1st call succeeds and removes it
    const p2 = cbk.invoke(); // rejects
    const p3 = cbk.invoke(); // rejects

    await expect(p1).resolves.toBe(Callback.REMOVE);
    await expect(p2).rejects.toBe(Callback.REMOVE);
    await expect(p3).rejects.toBe(Callback.REMOVE);
    expect(Date.now() - sTime).toBeLessThanOrEqual(15); // allow 15ms error

    expect(fn).toHaveBeenCalledTimes(1);
    expect(rmFn).toHaveBeenCalledTimes(1);
    expect(rmFn).toHaveBeenCalledWith(Callback.REMOVE_REASON_RETURN, cbk);

    expect(cbk.isRemoved()).toBe(true);
    await expect(cbk.invoke).rejects.toThrow(/Callback has been removed/);
  });

  test("return REMOVE + onRemove debounced", async () => {
    const rmFn = jest.fn();
    const fn = jest.fn(() => Callback.REMOVE);
    const cbk = new Callback(fn, { debounceWindow: 20 });
    expect(cbk.getDebounceWindow()).toBe(20);
    cbk.onRemove(rmFn);

    const sTime = Date.now();
    const p1 = cbk.invoke(); // discarded
    const p2 = cbk.invoke(); // discarded
    const p3 = cbk.invoke(); // 1st call succeeds and removes it

    await expect(p1).resolves.toBe(Callback.REMOVE);
    await expect(p2).resolves.toBe(Callback.REMOVE);
    await expect(p3).resolves.toBe(Callback.REMOVE);
    expect(Date.now() - sTime).toBeLessThanOrEqual(35); // allow 15ms error

    expect(fn).toHaveBeenCalledTimes(1);
    expect(rmFn).toHaveBeenCalledTimes(1);
    expect(rmFn).toHaveBeenCalledWith(Callback.REMOVE_REASON_RETURN, cbk);

    expect(cbk.isRemoved()).toBe(true);
    await expect(cbk.invoke).rejects.toThrow(/Callback has been removed/);
  });

  test("remove straight after scheduled", async () => {
    const fn = jest.fn();
    const cbk = new Callback(fn);
    const p1 = cbk.invoke("a");
    cbk.remove();
    await expect(p1).rejects.toBe(Callback.REMOVE);
    expect(fn).toHaveBeenCalledTimes(0);

    expect(cbk.isRemoved()).toBe(true);
    await expect(cbk.invoke).rejects.toThrow(/Callback has been removed/);
  });

  test("remove concurrent after invoking", async () => {
    const fn = jest.fn((a) => a + " done");
    const cbk = new Callback(fn, { concurrent: true });
    const p1 = cbk.invoke("a");
    cbk.remove();
    await expect(p1).resolves.toBe("a done");
    expect(fn).toHaveBeenCalledTimes(1);

    expect(cbk.isRemoved()).toBe(true);
    await expect(cbk.invoke).rejects.toThrow(/Callback has been removed/);
  });

  for (const concurrent of [false, true]) {
    test(`remove ${concurrent ? "" : "non-"}concurrent + debounced after invoking`, async () => {
      const fn = jest.fn();
      const cbk = new Callback(fn, { concurrent, debounceWindow: 20 });
      const p1 = cbk.invoke("a");
      cbk.remove();
      await expect(p1).rejects.toBe(Callback.REMOVE);
      expect(fn).toHaveBeenCalledTimes(0);

      expect(cbk.isRemoved()).toBe(true);
      await expect(cbk.invoke).rejects.toThrow(/Callback has been removed/);
    });
  }

  test("remove from within handler", async () => {
    const fn = jest.fn((a) => {
      cbk.remove();
      return a + " done";
    });
    const cbk = new Callback(fn);
    const p1 = cbk.invoke("a");
    const p2 = cbk.invoke("b");

    await expect(p1).resolves.toBe("a done");
    await expect(p2).rejects.toBe(Callback.REMOVE);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("a");

    expect(cbk.isRemoved()).toBe(true);
    await expect(cbk.invoke).rejects.toThrow(/Callback has been removed/);
  });

  test("ensure onRemove invoked synchronously", () => {
    const cbk = new Callback(() => {});

    const onRemove = jest.fn();
    cbk.onRemove(onRemove);
    cbk.remove();
    cbk.remove(); // no-op

    expect(onRemove).toHaveBeenCalledTimes(1); // it wasn't wrapped in a (non-concurrent) callback
  });

  test("call removed callbacks", async () => {
    const cbk = new Callback(() => {});
    expect(cbk.isRemoved()).toBe(false);
    cbk.remove();
    expect(cbk.isRemoved()).toBe(true);
    await expect(cbk.invoke).rejects.toThrow(/Callback has been removed/);
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
    expect(rmFnB).toHaveBeenCalledWith(Callback.REMOVE_REASON_USER, cbk);
  });
});

describe("Callback.wrap", () => {
  test("wrap function", async () => {
    const fn = jest.fn((a) => a + " done");
    const cbk = Callback.wrap(fn);
    expect(cbk.isConcurrent()).toBe(false);

    expect(cbk).toBeInstanceOf(Callback);
    await expect(cbk.invoke("a")).resolves.toBe("a done");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("a");
  });

  test("wrap callback", async () => {
    const fn = jest.fn((a) => a + " done");
    const cbk = new Callback(fn);
    const cbkW = Callback.wrap(cbk);
    expect(cbkW.isConcurrent()).toBe(false);

    expect(cbkW).toBeInstanceOf(Callback);
    expect(cbkW).not.toBe(cbk);
    await expect(cbkW.invoke("a")).resolves.toBe("a done");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("a");
  });

  test("wrap invoke method + options v1", async () => {
    const fn = jest.fn((a) => a + " done");
    const cbk = new Callback(fn, { concurrent: true, debounceWindow: 20 });
    const cbkW = Callback.wrap(cbk.invoke);
    expect(cbkW.isConcurrent()).toBe(true);
    expect(cbkW.getDebounceWindow()).toBe(20);

    expect(cbkW).toBeInstanceOf(Callback);
    expect(cbkW).not.toBe(cbk);
    await expect(cbkW.invoke("a")).resolves.toBe("a done");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("a");
  });

  test("wrap invoke method + options v2", async () => {
    const fn = jest.fn((a) => a + " done");
    const cbk = new Callback(fn);
    const cbkW = Callback.wrap(cbk.invoke, {
      concurrent: true /* ignored */,
      debounceWindow: 20,
    });
    expect(cbkW.isConcurrent()).toBe(false);
    expect(cbkW.getDebounceWindow()).toBe(20);

    expect(cbkW).toBeInstanceOf(Callback);
    expect(cbkW).not.toBe(cbk);
    await expect(cbkW.invoke("a")).resolves.toBe("a done");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("a");
  });

  test("wrap: concurrent", () => {
    const cbk = Callback.wrap(() => {}, { concurrent: true });
    expect(cbk.isConcurrent()).toBe(true);
  });

  test("wrap: already non-concurrent callback", () => {
    const cbk = new Callback(() => {});
    const cbkW = Callback.wrap(cbk, { concurrent: true }); // setting ignored
    expect(cbk.isConcurrent()).toBe(false);
    expect(cbkW.isConcurrent()).toBe(false);

    expect(cbk).toBeInstanceOf(Callback);
    expect(cbkW).not.toBe(cbk);
  });

  test("wrap: already concurrent callback", () => {
    const cbk = new Callback(() => {}, { concurrent: true });
    const cbkW = Callback.wrap(cbk, { concurrent: false }); // setting ignored
    expect(cbk.isConcurrent()).toBe(true);
    expect(cbkW.isConcurrent()).toBe(true);

    expect(cbk).toBeInstanceOf(Callback);
    expect(cbkW).not.toBe(cbk);
  });

  for (const useCompat of [true, false]) {
    test(`wrap function debounce ${useCompat ? "deprecated signature" : ""}`, async () => {
      const fn = jest.fn((a) => a + " done");
      const cbkW = Callback.wrap(fn, useCompat ? 20 : { debounceWindow: 20 });
      expect(cbkW.getDebounceWindow()).toBe(20);

      const sTime = Date.now();
      const p1 = cbkW.invoke("a");
      const p2 = cbkW.invoke("b");
      expect(fn).toHaveBeenCalledTimes(0); // not concurrent

      await expect(p1).resolves.toBe("b done");
      await expect(p2).resolves.toBe("b done");
      expect(Date.now() - sTime).toBeLessThanOrEqual(35); // allow 15ms error

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith("b");
    });

    test(`wrap callback debounce ${useCompat ? "deprecated signature" : ""}`, async () => {
      const fn = jest.fn((a) => a + " done");
      const cbk = new Callback(fn);
      const cbkW = Callback.wrap(cbk, useCompat ? 20 : { debounceWindow: 20 });

      expect(cbk.getDebounceWindow()).toBe(0);
      expect(cbkW.getDebounceWindow()).toBe(20);

      expect(cbk).not.toBe(cbkW);

      const sTime = Date.now();
      const p1 = cbkW.invoke("a");
      const p2 = cbkW.invoke("b");
      expect(fn).toHaveBeenCalledTimes(0); // not concurrent

      await expect(p1).resolves.toBe("b done");
      await expect(p2).resolves.toBe("b done");
      expect(Date.now() - sTime).toBeLessThanOrEqual(35); // allow 15ms error

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith("b");
    });
  }

  test("wrap callback already debounced by more", async () => {
    const fn = jest.fn((a) => a + " done");
    const cbk = new Callback(fn, { debounceWindow: 100 });
    const cbkW = Callback.wrap(cbk, { debounceWindow: 20 });

    expect(cbk.getDebounceWindow()).toBe(100);
    expect(cbkW.getDebounceWindow()).toBe(100);

    const sTime = Date.now();
    const p1 = cbkW.invoke("a");
    const p2 = cbkW.invoke("b");
    expect(fn).toHaveBeenCalledTimes(0);

    await window.waitFor(50);
    expect(fn).toHaveBeenCalledTimes(0);

    await expect(p1).resolves.toBe("b done");
    await expect(p2).resolves.toBe("b done");
    expect(Date.now() - sTime).toBeGreaterThanOrEqual(95);
    expect(Date.now() - sTime).toBeLessThanOrEqual(115); // allow 15ms error
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("b");
  });

  test("wrap callback already debounced by less", async () => {
    const fn = jest.fn((a) => a + " done");
    const cbk = new Callback(fn, { debounceWindow: 50 });
    const cbkW = Callback.wrap(cbk, { debounceWindow: 100 });

    expect(cbk.getDebounceWindow()).toBe(50);
    expect(cbkW.getDebounceWindow()).toBe(100);

    const sTime = Date.now();
    const p1 = cbkW.invoke("a");
    const p2 = cbkW.invoke("b");
    expect(fn).toHaveBeenCalledTimes(0);

    await window.waitFor(50);
    expect(fn).toHaveBeenCalledTimes(0);

    await expect(p1).resolves.toBe("b done");
    await expect(p2).resolves.toBe("b done");
    expect(Date.now() - sTime).toBeGreaterThanOrEqual(95);
    expect(Date.now() - sTime).toBeLessThanOrEqual(115); // allow 15ms error
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("b");
  });

  test("remove wrapper", () => {
    const rmFn = jest.fn();
    const cbkInner = new Callback(() => {});
    cbkInner.onRemove(rmFn);

    const cbkWrapper = Callback.wrap(cbkInner);
    cbkWrapper.onRemove(rmFn);

    cbkWrapper.remove(); // should only remove wrapper

    expect(rmFn).toHaveBeenCalledTimes(1);
    expect(rmFn).toHaveBeenCalledWith(Callback.REMOVE_REASON_USER, cbkWrapper);

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
    expect(rmFn).toHaveBeenCalledWith(Callback.REMOVE_REASON_USER, cbkInner);
    expect(rmFn).toHaveBeenCalledWith(Callback.REMOVE_REASON_USER, cbkWrapper);

    expect(cbkInner.isRemoved()).toBe(true);
    expect(cbkWrapper.isRemoved()).toBe(true);
  });

  for (const invokeWrapper of [false, true]) {
    test(`return REMOVE from wrapped + invoke ${invokeWrapper ? "wrapper" : "wrapped"}`, async () => {
      const rmFn = jest.fn();
      const cbkInner = new Callback(() => Callback.REMOVE);
      cbkInner.onRemove(rmFn);

      const cbkWrapper = Callback.wrap(cbkInner);
      cbkWrapper.onRemove(rmFn);

      await (invokeWrapper ? cbkWrapper : cbkInner).invoke(); // should remove both either way

      expect(rmFn).toHaveBeenCalledTimes(2);
      expect(rmFn).toHaveBeenCalledWith(
        Callback.REMOVE_REASON_RETURN,
        cbkInner,
      );
      expect(rmFn).toHaveBeenCalledWith(
        Callback.REMOVE_REASON_RETURN,
        cbkWrapper,
      );

      expect(cbkInner.isRemoved()).toBe(true);
      expect(cbkWrapper.isRemoved()).toBe(true);
    });
  }
});

describe("Callback: async handlers (selected tests)", () => {
  test("non-concurrent (default)", async () => {
    const x = [];
    const cbk = new Callback(
      (n) =>
        new Promise((resolve) => {
          x.push("start" + n);
          window.setTimeout(() => {
            x.push("end" + n);
            resolve(n);
          }, 100);
        }),
    );

    const p1 = cbk.invoke(1);
    const p2 = cbk.invoke(2);
    expect(x).toEqual([]);

    await expect(p1).resolves.toBe(1);
    await expect(p2).resolves.toBe(2);
    expect(x).toEqual(["start1", "end1", "start2", "end2"]);
  });

  test("concurrent", async () => {
    const x = [];
    const cbk = new Callback(
      (n) =>
        new Promise((resolve) => {
          x.push("start" + n);
          window.setTimeout(() => {
            x.push("end" + n);
            resolve(n);
          }, 100);
        }),
      { concurrent: true },
    );

    const p1 = cbk.invoke(1);
    const p2 = cbk.invoke(2);
    expect(x).toEqual(["start1", "start2"]);

    await expect(p1).resolves.toBe(1);
    await expect(p2).resolves.toBe(2);
    expect(x).toEqual(["start1", "start2", "end1", "end2"]);
  });

  test("non-concurrent + debounced", async () => {
    const x = [];
    const cbk = new Callback(
      (n) =>
        new Promise((resolve) => {
          x.push("start" + n);
          window.setTimeout(() => {
            x.push("end" + n);
            resolve(n);
          }, 100);
        }),
      { debounceWindow: 20 },
    );

    const p0 = cbk.invoke(0); // discarded
    const p1 = cbk.invoke(1); // goes in the queue
    expect(x).toEqual([]); // but not started yet
    await window.waitFor(40); // next one can be queued but start after 1st one done

    const p2 = cbk.invoke(2); // goes in the queue
    expect(x).toEqual(["start1"]); // but not started yet

    await expect(p0).resolves.toBe(1);
    await expect(p1).resolves.toBe(1);
    expect(x).toEqual(["start1", "end1", "start2"]); // 1st one done, 2nd one started

    await expect(p2).resolves.toBe(2);
    expect(x).toEqual(["start1", "end1", "start2", "end2"]);
  });

  test("concurrent + debounced", async () => {
    const x = [];
    const cbk = new Callback(
      (n) =>
        new Promise((resolve) => {
          x.push("start" + n);
          window.setTimeout(() => {
            x.push("end" + n);
            resolve(n);
          }, 100);
        }),
      { debounceWindow: 20, concurrent: true },
    );

    const p0 = cbk.invoke(0); // discarded
    const p1 = cbk.invoke(1); // goes in the queue
    expect(x).toEqual([]); // but not started yet
    await window.waitFor(40); // next one can be queued but start after 1st one done

    const p2 = cbk.invoke(2); // goes in the queue
    expect(x).toEqual(["start1"]); // but not started yet

    await window.waitFor(40);
    expect(x).toEqual(["start1", "start2"]); // 2nd one started

    await expect(p0).resolves.toBe(1);
    await expect(p1).resolves.toBe(1);
    await expect(p2).resolves.toBe(2);
    expect(x).toEqual(["start1", "start2", "end1", "end2"]);
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

  test("config: concurrent", async () => {
    const managerA = new CallbackManager({ concurrent: true });
    const managerB = new CallbackManager({ concurrent: false });

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

  test("config + add options: concurrent", async () => {
    const managerA = new CallbackManager({ concurrent: false }); // opposite
    const managerB = new CallbackManager({ concurrent: true }); // opposite

    const fnA = jest.fn();
    const fnB = jest.fn();
    const cbkB = new Callback(fnB);

    managerA.add(fnA, { concurrent: true });
    managerB.add(cbkB, { concurrent: false });

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
    const manager = new CallbackManager({ concurrent: false }); // irrelevant

    const fn = jest.fn();
    const cbk = new Callback(fn, { concurrent: true });

    manager.add(cbk, { concurrent: false }); // irrelevant

    await window.waitFor(0);
    expect(fn).toHaveBeenCalledTimes(0);

    manager.invoke(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test("config: debounceWindow", async () => {
    const manager = new CallbackManager({ debounceWindow: 20 });

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

    manager.add(fnA, { debounceWindow: 20 });
    manager.add(cbkB, { debounceWindow: 100 });

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

    await window.waitFor(100);
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
