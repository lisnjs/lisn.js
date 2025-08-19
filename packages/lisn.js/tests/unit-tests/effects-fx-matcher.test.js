const { jest, describe, test, expect } = require("@jest/globals");

const {
  FXMatcher,
  FXRelativeMatcher,
  FXNegateMatcher,
  FXComposerMatcher,
  FXScrollMatcher,
  FXViewMatcher,
  FX_MATCH,
} = window.LISN.effects;

const newMatcher = (Class = FXMatcher, executorBody) => {
  let store;
  const executor = jest.fn((s) => {
    store = s;
    if (executorBody) {
      executorBody(store);
    }
  });

  const matcher = new Class(executor);

  return { matcher, store, executor };
};

describe("FXMatcher/FXRelativeMatcher common", () => {
  for (const Class of [FXMatcher, FXRelativeMatcher]) {
    test(`${Class.name}: executor + store`, () => {
      const { matcher, store, executor } = newMatcher(Class);

      expect(executor).toHaveBeenCalledTimes(1);
      expect(store).not.toBeUndefined();

      expect(store.getState()).toBe(false);
      expect(matcher.matches()).toBe(false);

      store.setState(true);
      expect(store.getState()).toBe(true);
      expect(matcher.matches()).toBe(true);

      expect(executor).toHaveBeenCalledTimes(1);
    });

    test(`${Class.name}: executor + store modified in executor`, async () => {
      const { matcher, store, executor } = newMatcher(Class, (store) => {
        store.setState(true);
        setTimeout(() => store.setState(false), 100);
      });

      expect(executor).toHaveBeenCalledTimes(1);
      expect(store).not.toBeUndefined();

      expect(store.getState()).toBe(true);
      expect(matcher.matches()).toBe(true);

      await window.waitFor(120);
      expect(store.getState()).toBe(false);
      expect(matcher.matches()).toBe(false);

      expect(executor).toHaveBeenCalledTimes(1);
    });

    test(`${Class.name}: onChange/offChange`, async () => {
      const changeCbk = jest.fn();
      const { matcher, store, executor } = newMatcher(Class);

      matcher.onChange(changeCbk);
      expect(executor).toHaveBeenCalledTimes(1);
      await window.waitFor(0); // callbacks are async
      expect(changeCbk).toHaveBeenCalledTimes(0); // initial state change in executor has already happened
      expect(matcher.matches()).toBe(false);

      store.setState(false); // no-op
      await window.waitFor(0); // callbacks are async
      expect(changeCbk).toHaveBeenCalledTimes(0);

      store.setState(true);
      await window.waitFor(0); // callbacks are async
      expect(changeCbk).toHaveBeenCalledTimes(1);
      expect(changeCbk).toHaveBeenNthCalledWith(1, true, matcher);
      expect(matcher.matches()).toBe(true);

      store.setState(true); // no-op
      await window.waitFor(0); // callbacks are async
      expect(changeCbk).toHaveBeenCalledTimes(1);
      expect(matcher.matches()).toBe(true);

      store.setState(false);
      await window.waitFor(0); // callbacks are async
      expect(changeCbk).toHaveBeenCalledTimes(2);
      expect(changeCbk).toHaveBeenNthCalledWith(2, false, matcher);
      expect(matcher.matches()).toBe(false);

      expect(executor).toHaveBeenCalledTimes(1);
    });

    test(`${Class.name}: onChange/offChange modified in executor`, async () => {
      const changeCbk = jest.fn();
      const { matcher, store, executor } = newMatcher(Class, (store) => {
        store.setState(true);
        setTimeout(() => store.setState(false), 100);
        setTimeout(() => store.setState(true), 200);
        setTimeout(() => store.setState(false), 300);
      });

      matcher.onChange(changeCbk);
      await window.waitFor(0); // callbacks are async
      expect(executor).toHaveBeenCalledTimes(1);
      expect(changeCbk).toHaveBeenCalledTimes(0); // initial state change in executor has already happened
      expect(matcher.matches()).toBe(true);

      store.setState(true); // no-op
      await window.waitFor(0); // callbacks are async
      expect(changeCbk).toHaveBeenCalledTimes(0);
      expect(matcher.matches()).toBe(true);

      await window.waitFor(120);
      await window.waitFor(0); // callbacks are async
      expect(changeCbk).toHaveBeenCalledTimes(1);
      expect(changeCbk).toHaveBeenNthCalledWith(1, false, matcher);
      expect(matcher.matches()).toBe(false);

      store.setState(false); // no-op
      await window.waitFor(0); // callbacks are async
      expect(changeCbk).toHaveBeenCalledTimes(1);
      expect(matcher.matches()).toBe(false);

      await window.waitFor(120);
      await window.waitFor(0); // callbacks are async
      expect(changeCbk).toHaveBeenCalledTimes(2);
      expect(changeCbk).toHaveBeenNthCalledWith(2, true, matcher);
      expect(matcher.matches()).toBe(true);

      await window.waitFor(120);
      await window.waitFor(0); // callbacks are async
      expect(changeCbk).toHaveBeenCalledTimes(3);
      expect(changeCbk).toHaveBeenNthCalledWith(3, false, matcher);
      expect(matcher.matches()).toBe(false);

      expect(executor).toHaveBeenCalledTimes(1);
    });
  }
});

describe("FXRelativeMatcher", () => {
  test("executor + store data", async () => {
    const changeCbk = jest.fn();

    const { matcher, store, executor } = newMatcher(FXRelativeMatcher);
    matcher.onChange(changeCbk);

    expect(executor).toHaveBeenCalledTimes(1);
    expect(store.getData()).toBeUndefined();
    expect(store.getReferenceData()).toBeUndefined();

    const d = { a: 1, b: 2 };
    store.setData(d);
    expect(store.getData()).toBe(d); // not copied
    expect(store.getReferenceData()).toBeUndefined();

    store.setData(2);
    expect(store.getData()).toBe(2);
    expect(store.getReferenceData()).toBeUndefined();

    store.setData(null);
    expect(store.getData()).toBe(null);
    expect(store.getReferenceData()).toBeUndefined();

    store.setData(false);
    expect(store.getData()).toBe(false);
    expect(store.getReferenceData()).toBeUndefined();

    await window.waitFor(0); // callbacks are async
    expect(changeCbk).toHaveBeenCalledTimes(0); // not called for data change

    expect(executor).toHaveBeenCalledTimes(1);
  });

  test("executor + store modified in executor", async () => {
    const d = { a: 1, b: 2 };
    const d2 = "foo";

    const changeCbk = jest.fn();
    const { matcher, store, executor } = newMatcher(
      FXRelativeMatcher,
      (store) => {
        store.setData(d);
        setTimeout(() => store.setData(d2), 100);
      },
    );

    matcher.onChange(changeCbk);

    expect(executor).toHaveBeenCalledTimes(1);
    expect(store.getData()).toBe(d);
    expect(store.getReferenceData()).toBeUndefined();

    await window.waitFor(120);
    expect(store.getData()).toEqual(d2);
    expect(store.getReferenceData()).toBeUndefined();

    await window.waitFor(0); // callbacks are async
    expect(changeCbk).toHaveBeenCalledTimes(0); // not called for data change

    expect(executor).toHaveBeenCalledTimes(1);
  });

  test("restart + reference data", async () => {
    const lastData = "foo";

    const changeCbk = jest.fn();
    const { matcher, store, executor } = newMatcher(
      FXRelativeMatcher,
      (store) => {
        setTimeout(() => expect(store.getReferenceData()).toBe(lastData), 100);
      },
    );

    matcher.onChange(changeCbk);

    expect(executor).toHaveBeenCalledTimes(1);

    matcher.restart();
    expect(store.getData()).toBeUndefined();
    expect(store.getReferenceData()).toBeUndefined();

    store.setData(2);
    expect(store.getData()).toBe(2);
    expect(store.getReferenceData()).toBeUndefined();

    const d = { a: 1, b: 2 };
    store.setData(d);
    expect(store.getData()).toBe(d); // not copied
    expect(store.getReferenceData()).toBeUndefined();

    matcher.restart();
    expect(store.getData()).toBe(d);
    expect(store.getReferenceData()).toBe(d); // not copied

    store.setData(null);
    expect(store.getData()).toBe(null);
    expect(store.getReferenceData()).toBe(d);

    store.setData(lastData);
    expect(store.getData()).toBe(lastData);
    expect(store.getReferenceData()).toBe(d);

    matcher.restart();
    expect(store.getData()).toBe(lastData);
    expect(store.getReferenceData()).toBe(lastData);

    await window.waitFor(0); // callbacks are async
    expect(changeCbk).toHaveBeenCalledTimes(0); // not called for data change or restart

    await window.waitFor(120);

    expect(executor).toHaveBeenCalledTimes(1);
  });
});

describe("FXNegateMatcher", () => {
  test("basic", () => {
    const { matcher, store } = newMatcher();
    const negated = new FXNegateMatcher(matcher);

    expect(matcher.matches()).toBe(false);
    expect(negated.matches()).toBe(true);

    store.setState(true);
    expect(matcher.matches()).toBe(true);
    expect(negated.matches()).toBe(false);

    store.setState(false);
    expect(matcher.matches()).toBe(false);
    expect(negated.matches()).toBe(true);
  });

  test("basic v2", () => {
    const { matcher, store } = newMatcher();
    store.setState(true);

    const negated = new FXNegateMatcher(matcher);
    expect(matcher.matches()).toBe(true);
    expect(negated.matches()).toBe(false);

    store.setState(false);
    expect(matcher.matches()).toBe(false);
    expect(negated.matches()).toBe(true);
  });

  test("onChange/offChange", async () => {
    const changeCbk = jest.fn();
    const negatedChangeCbk = jest.fn();
    const { matcher, store, executor } = newMatcher();

    const negated = new FXNegateMatcher(matcher);

    matcher.onChange(changeCbk);
    negated.onChange(negatedChangeCbk);

    expect(executor).toHaveBeenCalledTimes(1);
    // initial state change in executor has already happened
    await window.waitFor(0); // callbacks are async
    expect(changeCbk).toHaveBeenCalledTimes(0);
    expect(negatedChangeCbk).toHaveBeenCalledTimes(0);
    expect(matcher.matches()).toBe(false);
    expect(negated.matches()).toBe(true);

    store.setState(false); // no-op
    await window.waitFor(0); // callbacks are async
    expect(changeCbk).toHaveBeenCalledTimes(0);
    expect(negatedChangeCbk).toHaveBeenCalledTimes(0);
    expect(matcher.matches()).toBe(false);
    expect(negated.matches()).toBe(true);

    store.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(changeCbk).toHaveBeenCalledTimes(1);
    expect(changeCbk).toHaveBeenNthCalledWith(1, true, matcher);
    expect(matcher.matches()).toBe(true);

    expect(negatedChangeCbk).toHaveBeenCalledTimes(1);
    expect(negatedChangeCbk).toHaveBeenNthCalledWith(1, false, negated);
    expect(negated.matches()).toBe(false);

    store.setState(true); // no-op
    await window.waitFor(0); // callbacks are async
    expect(changeCbk).toHaveBeenCalledTimes(1);
    expect(changeCbk).toHaveBeenNthCalledWith(1, true, matcher);
    expect(matcher.matches()).toBe(true);

    expect(negatedChangeCbk).toHaveBeenCalledTimes(1);
    expect(negatedChangeCbk).toHaveBeenNthCalledWith(1, false, negated);
    expect(negated.matches()).toBe(false);

    store.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(changeCbk).toHaveBeenCalledTimes(2);
    expect(changeCbk).toHaveBeenNthCalledWith(2, false, matcher);
    expect(matcher.matches()).toBe(false);

    expect(negatedChangeCbk).toHaveBeenCalledTimes(2);
    expect(negatedChangeCbk).toHaveBeenNthCalledWith(2, true, negated);
    expect(negated.matches()).toBe(true);

    expect(executor).toHaveBeenCalledTimes(1);
  });

  test("in FX_MATCH", () => {
    const { matcher } = newMatcher();
    expect(FX_MATCH.negate).not.toBeUndefined();
    expect(FX_MATCH.negate(matcher)).toBeInstanceOf(FXNegateMatcher);
  });
});
