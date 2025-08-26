const { jest, describe, test, expect } = require("@jest/globals");

const { Callback } = window.LISN.modules;
const { linearTweener } = window.LISN.utils;
const {
  FXMatcher,
  FXRelativeMatcher,
  FXNegateMatcher,
  FXComposerMatcher,
  FXScrollMatcher,
  // FXViewMatcher,
  FXPinMatcher,
  FXPin,
  FXComposer,
  FXTrigger,
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
      const cbk = jest.fn();
      const { matcher, store, executor } = newMatcher(Class);

      matcher.onChange(cbk);
      matcher.onChange(cbk); // no-op
      expect(executor).toHaveBeenCalledTimes(1);
      await window.waitFor(0); // callbacks are async
      expect(cbk).toHaveBeenCalledTimes(0); // initial state change in executor has already happened
      expect(matcher.matches()).toBe(false);

      store.setState(false); // no-op
      await window.waitFor(0); // callbacks are async
      expect(cbk).toHaveBeenCalledTimes(0);

      store.setState(true);
      await window.waitFor(0); // callbacks are async
      expect(cbk).toHaveBeenCalledTimes(1);
      expect(cbk).toHaveBeenNthCalledWith(1, true, matcher);
      expect(matcher.matches()).toBe(true);

      store.setState(true); // no-op
      await window.waitFor(0); // callbacks are async
      expect(cbk).toHaveBeenCalledTimes(1);
      expect(matcher.matches()).toBe(true);

      store.setState(false);
      await window.waitFor(0); // callbacks are async
      expect(cbk).toHaveBeenCalledTimes(2);
      expect(cbk).toHaveBeenNthCalledWith(2, false, matcher);
      expect(matcher.matches()).toBe(false);

      // multiple changes at a time
      store.setState(true); // +1
      store.setState(false); // +1
      await window.waitFor(0); // callbacks are async
      expect(cbk).toHaveBeenCalledTimes(4);
      expect(cbk).toHaveBeenNthCalledWith(3, true, matcher);
      expect(cbk).toHaveBeenNthCalledWith(4, false, matcher);

      matcher.offChange(cbk);
      store.setState(true);
      store.setState(false);
      store.setState(true);
      store.setState(false);

      await window.waitFor(0); // callbacks are async
      expect(cbk).toHaveBeenCalledTimes(4); // no new calls

      expect(executor).toHaveBeenCalledTimes(1);
    });

    test(`${Class.name}: onChange/offChange modified in executor`, async () => {
      const cbk = jest.fn();
      const { matcher, store, executor } = newMatcher(Class, (store) => {
        store.setState(true);
        setTimeout(() => store.setState(false), 100);
        setTimeout(() => store.setState(true), 200);
        setTimeout(() => store.setState(false), 300);
      });

      matcher.onChange(cbk);
      await window.waitFor(0); // callbacks are async
      expect(executor).toHaveBeenCalledTimes(1);
      expect(cbk).toHaveBeenCalledTimes(0); // initial state change in executor has already happened
      expect(matcher.matches()).toBe(true);

      store.setState(true); // no-op
      await window.waitFor(0); // callbacks are async
      expect(cbk).toHaveBeenCalledTimes(0);
      expect(matcher.matches()).toBe(true);

      await window.waitFor(120);
      await window.waitFor(0); // callbacks are async
      expect(cbk).toHaveBeenCalledTimes(1);
      expect(cbk).toHaveBeenNthCalledWith(1, false, matcher);
      expect(matcher.matches()).toBe(false);

      store.setState(false); // no-op
      await window.waitFor(0); // callbacks are async
      expect(cbk).toHaveBeenCalledTimes(1);
      expect(matcher.matches()).toBe(false);

      await window.waitFor(120);
      await window.waitFor(0); // callbacks are async
      expect(cbk).toHaveBeenCalledTimes(2);
      expect(cbk).toHaveBeenNthCalledWith(2, true, matcher);
      expect(matcher.matches()).toBe(true);

      await window.waitFor(120);
      await window.waitFor(0); // callbacks are async
      expect(cbk).toHaveBeenCalledTimes(3);
      expect(cbk).toHaveBeenNthCalledWith(3, false, matcher);
      expect(matcher.matches()).toBe(false);

      expect(executor).toHaveBeenCalledTimes(1);
    });

    test(`${Class.name}: onChange/offChange: callback.remove`, async () => {
      const cbkJ = jest.fn();
      const cbk = Callback.wrap(cbkJ);
      const { matcher, store } = newMatcher(Class);

      matcher.onChange(cbk);
      matcher.onChange(cbk); // no-op
      cbk.remove();

      store.setState(true);
      store.setState(false);
      store.setState(true);
      store.setState(false);

      await window.waitFor(0); // callbacks are async
      expect(cbkJ).toHaveBeenCalledTimes(0);
    });

    test(`${Class.name}: onChange/offChange: return Callback.REMOVE`, async () => {
      const cbk = jest.fn(() => Callback.REMOVE);
      const { matcher, store } = newMatcher(Class);

      matcher.onChange(cbk);
      matcher.onChange(cbk); // no-op

      store.setState(true);
      store.setState(false);
      store.setState(true);
      store.setState(false);

      await window.waitFor(0); // callbacks are async
      expect(cbk).toHaveBeenCalledTimes(1); // removed after 1st time
    });
  }
});

describe("FXRelativeMatcher", () => {
  test("executor + store data", async () => {
    const cbk = jest.fn();

    const { matcher, store, executor } = newMatcher(FXRelativeMatcher);
    matcher.onChange(cbk);

    expect(executor).toHaveBeenCalledTimes(1);
    expect(store.getData()).toBeUndefined();
    expect(store.getReferenceData()).toBeUndefined();

    const input = { a: 1, b: { c: 2 } };
    const origInput = { a: 1, b: { c: 2 } };
    store.setData(input);

    const data = store.getData();

    expect(data).toEqual(input);
    expect(data).not.toBe(input); // copied
    expect(store.getReferenceData()).toEqual(input); // initial

    input.b.c = 4;
    expect(data).toEqual(origInput); // deeply copied when setting

    data.b.c = 4;
    expect(store.getData()).toEqual(origInput); // deeply copied when returned
    expect(store.getReferenceData()).toEqual(origInput);

    store.setData(2);
    expect(store.getData()).toBe(2);
    expect(store.getReferenceData()).toEqual(origInput); // still initial

    store.setData(null);
    expect(store.getData()).toBe(null);
    expect(store.getReferenceData()).toEqual(origInput); // still initial

    store.setData(false);
    expect(store.getData()).toBe(false);
    expect(store.getReferenceData()).toEqual(origInput); // still initial

    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(0); // not called for data change

    expect(executor).toHaveBeenCalledTimes(1);
  });

  test("executor + store modified in executor", async () => {
    const d = { a: 1, b: 2 };
    const d2 = "foo";

    const cbk = jest.fn();
    const { matcher, store, executor } = newMatcher(
      FXRelativeMatcher,
      (store) => {
        store.setData(d);
        setTimeout(() => store.setData(d2), 100);
      },
    );

    matcher.onChange(cbk);

    expect(executor).toHaveBeenCalledTimes(1);
    expect(store.getData()).toEqual(d);
    expect(store.getReferenceData()).toEqual(d); // initial

    await window.waitFor(120);
    expect(store.getData()).toEqual(d2);
    expect(store.getReferenceData()).toEqual(d); // still initial

    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(0); // not called for data change

    expect(executor).toHaveBeenCalledTimes(1);
  });

  test("restart + reference data", async () => {
    const lastData = "foo";

    const cbk = jest.fn();
    const { matcher, store, executor } = newMatcher(FXRelativeMatcher);

    matcher.onChange(cbk);

    expect(store.getData()).toBeUndefined();
    expect(store.getReferenceData()).toBeUndefined();

    expect(executor).toHaveBeenCalledTimes(1);

    matcher.restart();
    expect(store.getData()).toBeUndefined();
    expect(store.getReferenceData()).toBeUndefined();

    store.setData(2);
    expect(store.getData()).toBe(2);
    expect(store.getReferenceData()).toBe(2); // initial

    const input = { a: 1, b: { c: 2 } };
    const origInput = { a: 1, b: { c: 2 } };
    store.setData(input);
    expect(store.getData()).toEqual(input);
    expect(store.getReferenceData()).toBe(2); // still initial

    matcher.restart();

    const data = store.getData();
    const reference = store.getReferenceData();
    expect(data).toEqual(input);
    expect(reference).toEqual(input);
    expect(reference).not.toBe(input); // copied
    expect(reference).not.toBe(data);

    reference.b.c = 4;
    expect(store.getReferenceData()).toEqual(origInput);

    store.setData(null);
    expect(store.getData()).toBe(null);
    expect(store.getReferenceData()).toEqual(origInput);

    store.setData(lastData);
    expect(store.getData()).toEqual(lastData);
    expect(store.getReferenceData()).toEqual(origInput);

    matcher.restart();
    expect(store.getData()).toEqual(lastData);
    expect(store.getReferenceData()).toEqual(lastData);

    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(0); // not called for data change or restart

    expect(executor).toHaveBeenCalledTimes(1);
  });
});

describe("FXNegateMatcher", () => {
  test("basic", async () => {
    const { matcher, store } = newMatcher();
    const negated = new FXNegateMatcher(matcher);

    expect(matcher.matches()).toBe(false);
    expect(negated.matches()).toBe(true);

    store.setState(true);
    expect(matcher.matches()).toBe(true);
    await window.waitFor(0); // callbacks are async
    expect(negated.matches()).toBe(false);

    store.setState(false);
    expect(matcher.matches()).toBe(false);
    await window.waitFor(0); // callbacks are async
    expect(negated.matches()).toBe(true);
  });

  test("basic v2", async () => {
    const { matcher, store } = newMatcher();
    store.setState(true);

    const negated = new FXNegateMatcher(matcher);
    expect(matcher.matches()).toBe(true);
    await window.waitFor(0); // callbacks are async
    expect(negated.matches()).toBe(false);

    store.setState(false);
    expect(matcher.matches()).toBe(false);
    await window.waitFor(0); // callbacks are async
    expect(negated.matches()).toBe(true);
  });

  test("onChange/offChange", async () => {
    const cbk = jest.fn();
    const negatedCbk = jest.fn();
    const { matcher, store, executor } = newMatcher();

    const negated = new FXNegateMatcher(matcher);

    matcher.onChange(cbk);
    negated.onChange(negatedCbk);

    expect(executor).toHaveBeenCalledTimes(1);
    // initial state change in executor has already happened
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(0);
    expect(negatedCbk).toHaveBeenCalledTimes(0);
    expect(matcher.matches()).toBe(false);
    expect(negated.matches()).toBe(true);

    store.setState(false); // no-op
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(0);
    expect(negatedCbk).toHaveBeenCalledTimes(0);
    expect(matcher.matches()).toBe(false);
    expect(negated.matches()).toBe(true);

    store.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenNthCalledWith(1, true, matcher);
    expect(matcher.matches()).toBe(true);

    expect(negatedCbk).toHaveBeenCalledTimes(1);
    expect(negatedCbk).toHaveBeenNthCalledWith(1, false, negated);
    expect(negated.matches()).toBe(false);

    store.setState(true); // no-op
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenNthCalledWith(1, true, matcher);
    expect(matcher.matches()).toBe(true);

    expect(negatedCbk).toHaveBeenCalledTimes(1);
    expect(negatedCbk).toHaveBeenNthCalledWith(1, false, negated);
    expect(negated.matches()).toBe(false);

    store.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(2);
    expect(cbk).toHaveBeenNthCalledWith(2, false, matcher);
    expect(matcher.matches()).toBe(false);

    expect(negatedCbk).toHaveBeenCalledTimes(2);
    expect(negatedCbk).toHaveBeenNthCalledWith(2, true, negated);
    expect(negated.matches()).toBe(true);

    matcher.offChange(cbk);
    negated.offChange(negatedCbk);
    store.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(2); // no new calls
    expect(negatedCbk).toHaveBeenCalledTimes(2); // no new calls

    expect(executor).toHaveBeenCalledTimes(1);
  });

  test("in FX_MATCH", () => {
    const { matcher } = newMatcher();
    expect(FX_MATCH.negate).not.toBeUndefined();
    expect(FX_MATCH.negate(matcher)).toBeInstanceOf(FXNegateMatcher);
  });
});

describe("FXPinMatcher", () => {
  test("basic", async () => {
    const { matcher: triggerMatcher, store } = newMatcher();
    const pin = new FXPin();
    pin.while(triggerMatcher);

    const pinMatcher = new FXPinMatcher(pin);

    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);
    expect(pinMatcher.matches()).toBe(pin.isActive());

    store.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true);
    expect(pinMatcher.matches()).toBe(pin.isActive());

    store.setState(true); // no-op
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true);
    expect(pinMatcher.matches()).toBe(pin.isActive());

    store.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);
    expect(pinMatcher.matches()).toBe(pin.isActive());

    store.setState(false); // no-op
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);
    expect(pinMatcher.matches()).toBe(pin.isActive());

    store.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true);
    expect(pinMatcher.matches()).toBe(pin.isActive());
  });

  test("basic v2", async () => {
    const { matcher: triggerMatcher, store } = newMatcher();
    store.setState(true);

    const pin = new FXPin();
    pin.while(triggerMatcher);

    const pinMatcher = new FXPinMatcher(pin);

    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true);
    expect(pinMatcher.matches()).toBe(pin.isActive());

    store.setState(true); // no-op
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true);
    expect(pinMatcher.matches()).toBe(pin.isActive());

    store.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);
    expect(pinMatcher.matches()).toBe(pin.isActive());

    store.setState(false); // no-op
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);
    expect(pinMatcher.matches()).toBe(pin.isActive());

    store.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true);
    expect(pinMatcher.matches()).toBe(pin.isActive());
  });

  test("onChange/offChange", async () => {
    const cbk = jest.fn();
    const { matcher: triggerMatcher, store } = newMatcher();
    const pin = new FXPin();
    pin.while(triggerMatcher);

    const pinMatcher = new FXPinMatcher(pin);
    pinMatcher.onChange(cbk);

    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);
    expect(pinMatcher.matches()).toBe(pin.isActive());
    expect(cbk).toHaveBeenCalledTimes(0);

    store.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true);
    expect(pinMatcher.matches()).toBe(pin.isActive());
    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenNthCalledWith(1, true, pinMatcher);

    store.setState(true); // no-op
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true);
    expect(pinMatcher.matches()).toBe(pin.isActive());
    expect(cbk).toHaveBeenCalledTimes(1);

    store.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);
    expect(pinMatcher.matches()).toBe(pin.isActive());
    expect(cbk).toHaveBeenCalledTimes(2);
    expect(cbk).toHaveBeenNthCalledWith(2, false, pinMatcher);

    store.setState(false); // no-op
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);
    expect(pinMatcher.matches()).toBe(pin.isActive());
    expect(cbk).toHaveBeenCalledTimes(2);

    store.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true);
    expect(pinMatcher.matches()).toBe(pin.isActive());
    expect(cbk).toHaveBeenCalledTimes(3);
    expect(cbk).toHaveBeenNthCalledWith(3, true, pinMatcher);

    pinMatcher.offChange(cbk);
    store.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(3); // no new calls
  });

  test("in FX_MATCH", () => {
    const pin = new FXPin();
    expect(FX_MATCH.pin).not.toBeUndefined();
    expect(FX_MATCH.pin(pin)).toBeInstanceOf(FXPinMatcher);
  });
});

describe("FXComposerMatcher", () => {
  const newComposer = (lag = 0) => {
    let push;
    const trigger = new FXTrigger((p) => {
      push = p;
    });

    const composer = new FXComposer({ trigger, lag, tweener: linearTweener });
    return { push, composer };
  };

  const targets = { x: 100, y: 200, z: 300 };

  for (const useMax of [true, false]) {
    const limit = useMax ? "max" : "min";

    for (const axis in targets) {
      const target = targets[axis];

      test(`raw bounds: ${limit} ${axis}`, async () => {
        const { push, composer } = newComposer();

        expect(composer.getState()[axis].current).toBe(0);

        const matcher = new FXComposerMatcher(
          {
            [limit]: { [axis]: target },
          },
          composer,
        );

        await window.waitFor(50);
        expect(matcher.matches()).toBe(useMax);

        push({ [axis]: { target: target + 1 } });
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);

        push({ [axis]: { target: target } });
        await window.waitFor(50);
        expect(matcher.matches()).toBe(true);

        push({ [axis]: { target: target - 1 } });
        await window.waitFor(50);
        expect(matcher.matches()).toBe(useMax);

        push({ [axis]: { target: target + 1 } });
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);
      });

      test(`raw bounds: ${limit} ${axis} after push to > ${limit}`, async () => {
        const { push, composer } = newComposer();

        push({ [axis]: { target: target + 1 } });
        await window.waitFor(50);
        expect(composer.getState()[axis].current).toBe(target + 1);

        const matcher = new FXComposerMatcher(
          {
            [limit]: { [axis]: target },
          },
          composer,
        );

        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);
      });
    }

    test(`raw bounds: ${limit} x & y`, async () => {
      const { push, composer } = newComposer();

      expect(composer.getState().x.current).toBe(0);
      expect(composer.getState().y.current).toBe(0);

      const matcher = new FXComposerMatcher(
        {
          [limit]: { x: targets.x, y: targets.y },
        },
        composer,
      );

      await window.waitFor(50);
      expect(matcher.matches()).toBe(useMax);

      push({
        x: { target: targets.x + 1 },
        y: { target: 0 },
        // only one matches
      });
      await window.waitFor(50);
      expect(matcher.matches()).toBe(false);

      push({
        x: { target: 0 },
        y: { target: targets.y + 1 },
        // only one matches
      });
      await window.waitFor(50);
      expect(matcher.matches()).toBe(false);

      push({
        x: { target: targets.x + 1 },
        y: { target: targets.y + 1 },
      });
      await window.waitFor(50);
      expect(matcher.matches()).toBe(!useMax);

      push({
        x: { target: targets.x },
        y: { target: targets.y },
      });
      await window.waitFor(50);
      expect(matcher.matches()).toBe(true);

      push({
        x: { target: targets.x - 1 },
        y: { target: targets.y + 1 },
        // only one matches
      });
      await window.waitFor(50);
      expect(matcher.matches()).toBe(false);

      push({
        x: { target: targets.x + 1 },
        y: { target: targets.y - 1 },
        // only one matches
      });
      await window.waitFor(50);
      expect(matcher.matches()).toBe(false);

      push({
        x: { target: targets.x - 1 },
        y: { target: targets.y - 1 },
      });
      await window.waitFor(50);
      expect(matcher.matches()).toBe(useMax);
    });

    test(`raw bounds: ${limit} x & y after push to > ${limit}`, async () => {
      const { push, composer } = newComposer();

      push({
        x: { target: targets.x + 1 },
        y: { target: targets.y + 1 },
      });
      await window.waitFor(50);
      expect(composer.getState().x.current).toBe(targets.x + 1);
      expect(composer.getState().y.current).toBe(targets.y + 1);

      const matcher = new FXComposerMatcher(
        {
          [limit]: { x: targets.x, y: targets.y },
        },
        composer,
      );

      await window.waitFor(50);
      expect(matcher.matches()).toBe(!useMax);
    });

    test(`raw bounds: ${limit} x, y & z`, async () => {
      const { push, composer } = newComposer();

      expect(composer.getState().x.current).toBe(0);
      expect(composer.getState().y.current).toBe(0);
      expect(composer.getState().z.current).toBe(0);

      const matcher = new FXComposerMatcher(
        {
          [limit]: targets,
        },
        composer,
      );

      await window.waitFor(50);
      expect(matcher.matches()).toBe(useMax);

      push({
        x: { target: targets.x + 1 },
        y: { target: 0 },
        z: { target: 0 },
        // only one or two match
      });
      await window.waitFor(50);
      expect(matcher.matches()).toBe(false);

      push({
        x: { target: 0 },
        y: { target: targets.y + 1 },
        z: { target: targets.z + 1 },
        // only one or two match
      });
      await window.waitFor(50);
      expect(matcher.matches()).toBe(false);

      push({
        x: { target: targets.x + 1 },
        y: { target: targets.y + 1 },
        z: { target: targets.z + 1 },
      });
      await window.waitFor(50);
      expect(matcher.matches()).toBe(!useMax);

      push({
        x: { target: targets.x },
        y: { target: targets.y },
        z: { target: targets.z },
      });
      await window.waitFor(50);
      expect(matcher.matches()).toBe(true);

      push({
        x: { target: targets.x - 1 },
        y: { target: targets.y + 1 },
        z: { target: targets.z + 1 },
        // only one or two match
      });
      await window.waitFor(50);
      expect(matcher.matches()).toBe(false);

      push({
        x: { target: targets.x + 1 },
        y: { target: targets.y - 1 },
        z: { target: targets.z - 1 },
        // only one or two match
      });
      await window.waitFor(50);
      expect(matcher.matches()).toBe(false);

      push({
        x: { target: targets.x - 1 },
        y: { target: targets.y - 1 },
        z: { target: targets.z - 1 },
      });
      await window.waitFor(50);
      expect(matcher.matches()).toBe(useMax);
    });

    for (const axis in targets) {
      const high = targets[axis];

      for (const low of [-high, 0, high / 2]) {
        const tenPc = 0.1 * (high - low);
        const tenPcAbs = low + tenPc;

        for (const doRestart of [true, false]) {
          test(`relative bounds: ${limit} ${axis} 10%${doRestart ? " (+restart)" : ""} (low = ${low})`, async () => {
            // 10% is not relative to any reference data, so restarting doesn't make
            // a difference
            const { push, composer } = newComposer();

            // start at some value other than low
            const initial = low + 2 * tenPc; // > low + 10%
            push({ [axis]: { target: initial, low, high } });
            await window.waitFor(50);

            expect(composer.getState()[axis].current).toBe(initial);

            const matcher = new FXComposerMatcher(
              {
                [limit]: { [axis]: "10%" },
              },
              composer,
            );

            if (doRestart) {
              matcher.restart();
            }
            await window.waitFor(50);
            expect(matcher.matches()).toBe(!useMax);

            if (doRestart) {
              matcher.restart();
            }
            push({ [axis]: { target: tenPcAbs + 1 } });
            await window.waitFor(50);
            expect(matcher.matches()).toBe(!useMax);

            if (doRestart) {
              matcher.restart();
            }
            push({ [axis]: { target: tenPcAbs } });
            await window.waitFor(50);
            expect(matcher.matches()).toBe(true);

            if (doRestart) {
              matcher.restart();
            }
            push({ [axis]: { target: tenPcAbs - 1 } });
            await window.waitFor(50);
            expect(matcher.matches()).toBe(useMax);

            if (doRestart) {
              matcher.restart();
            }
            push({ [axis]: { target: tenPcAbs + 1 } });
            await window.waitFor(50);
            expect(matcher.matches()).toBe(!useMax);
          });
        }

        test(`relative bounds: ${limit} ${axis} +10 + restart (low = ${low})`, async () => {
          const { push, composer } = newComposer();

          // start at some value other than low
          const initial = low + 50; // > low + 10
          push({ [axis]: { target: initial, low, high } });
          await window.waitFor(50);

          expect(composer.getState()[axis].current).toBe(initial);

          const matcher = new FXComposerMatcher(
            {
              [limit]: { [axis]: "+10" },
            },
            composer,
          );

          let target = composer.getState()[axis].current + 10; // initial max/min
          for (let i = 0; i < 3; i++) {
            await window.waitFor(50);
            expect(matcher.matches()).toBe(useMax);

            push({ [axis]: { target: target + 1 } });
            await window.waitFor(50);
            expect(matcher.matches()).toBe(!useMax);

            push({ [axis]: { target } });
            await window.waitFor(50);
            expect(matcher.matches()).toBe(true);

            push({ [axis]: { target: target - 1 } });
            await window.waitFor(50);
            expect(matcher.matches()).toBe(useMax);

            matcher.restart();
            target += 9; // new max/min
          }
        });

        test(`relative bounds: ${limit} ${axis} +10% + restart (low = ${low})`, async () => {
          const { push, composer } = newComposer();

          // start at some value other than low
          const initial = low + tenPc * 2; // > low + 10%
          push({ [axis]: { target: initial, low, high } });
          await window.waitFor(50);

          expect(composer.getState()[axis].current).toBe(initial);

          const matcher = new FXComposerMatcher(
            {
              [limit]: { [axis]: "+10%" },
            },
            composer,
          );

          let target = composer.getState()[axis].current + tenPc; // initial max/min
          for (let i = 0; i < 3; i++) {
            await window.waitFor(50);
            expect(matcher.matches()).toBe(useMax);

            push({ [axis]: { target: target + 1 } });
            await window.waitFor(50);
            expect(matcher.matches()).toBe(!useMax);

            push({ [axis]: { target } });
            await window.waitFor(50);
            expect(matcher.matches()).toBe(true);

            push({ [axis]: { target: target - 1 } });
            await window.waitFor(50);
            expect(matcher.matches()).toBe(useMax);

            matcher.restart();
            target += tenPc - 1; // new max/min
          }
        });

        test(`relative bounds: ${limit} ${axis} -10 + restart (low = ${low})`, async () => {
          const { push, composer } = newComposer();

          // start at some value other than low
          const initial = low + 100;
          push({ [axis]: { target: initial, low, high } });
          await window.waitFor(50);

          expect(composer.getState()[axis].current).toBe(initial);

          const matcher = new FXComposerMatcher(
            {
              [limit]: { [axis]: "-10" },
            },
            composer,
          );

          // max/min is initial - 10
          await window.waitFor(50);
          expect(matcher.matches()).toBe(!useMax);

          push({ [axis]: { target: high } });
          await window.waitFor(50);
          expect(composer.getState()[axis].current).toBe(high);

          matcher.restart(); // reference is now "high"

          let target = composer.getState()[axis].current - 10; // new max/min
          for (let i = 0; i < 3; i++) {
            await window.waitFor(50);
            expect(matcher.matches()).toBe(!useMax);

            push({ [axis]: { target: target - 1 } });
            await window.waitFor(50);
            expect(matcher.matches()).toBe(useMax);

            push({ [axis]: { target } });
            await window.waitFor(50);
            expect(matcher.matches()).toBe(true);

            push({ [axis]: { target: target + 1 } });
            await window.waitFor(50);
            expect(matcher.matches()).toBe(!useMax);

            matcher.restart(); // reference is now (current target + 1)
            target -= 9; // new max/min
          }
        });

        test(`relative bounds: ${limit} ${axis} -10% + restart (low = ${low})`, async () => {
          const { push, composer } = newComposer();

          // start at some value other than low
          const initial = low + 5 * tenPc;
          push({ [axis]: { target: initial, low, high } });
          await window.waitFor(50);

          expect(composer.getState()[axis].current).toBe(initial);

          const matcher = new FXComposerMatcher(
            {
              [limit]: { [axis]: "-10%" },
            },
            composer,
          );

          // max/min is initial - 10%
          await window.waitFor(50);
          expect(matcher.matches()).toBe(!useMax);

          push({ [axis]: { target: high } });
          await window.waitFor(50);
          expect(composer.getState()[axis].current).toBe(high);

          matcher.restart(); // reference is now "high"

          let target = composer.getState()[axis].current - tenPc; // new max/min
          for (let i = 0; i < 3; i++) {
            await window.waitFor(50);
            expect(matcher.matches()).toBe(!useMax);

            push({ [axis]: { target: target - 1 } });
            await window.waitFor(50);
            expect(matcher.matches()).toBe(useMax);

            push({ [axis]: { target } });
            await window.waitFor(50);
            expect(matcher.matches()).toBe(true);

            push({ [axis]: { target: target + 1 } });
            await window.waitFor(50);
            expect(matcher.matches()).toBe(!useMax);

            matcher.restart(); // reference is now (current target + 1)
            target -= tenPc - 1; // new max/min
          }
        });
      }
    }

    test(`relative bounds: ${limit} selected test + restart => changes state`, async () => {
      const { push, composer } = newComposer();

      push({ x: { target: 0 } });
      await window.waitFor(50);

      expect(composer.getState().x.current).toBe(0);

      const matcher = new FXComposerMatcher(
        {
          [limit]: { x: "+10" },
        },
        composer,
      );

      let target = 10; // initial max/min; reference is 0
      for (let i = 0; i < 3; i++) {
        await window.waitFor(50);
        expect(matcher.matches()).toBe(useMax);

        push({ x: { target: target + 1 } });
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);

        matcher.restart(); // reference is not (current target + 1);
        target += 11; // new max/min
      }
    });

    test(`raw bounds with lag: ${limit} x`, async () => {
      const lag = 500;
      const { push, composer } = newComposer(lag);

      expect(composer.getState().x.current).toBe(0);

      const target = targets.x;
      const matcher = new FXComposerMatcher(
        {
          [limit]: { x: target },
        },
        composer,
      );

      push({ x: { target: target * 2 } });

      await window.waitFor(50); // still close to 0
      expect(matcher.matches()).toBe(useMax);

      await window.waitFor(lag / 4); // close to target / 2
      expect(matcher.matches()).toBe(useMax);

      await window.waitFor(50 + lag / 4); // just above target
      expect(matcher.matches()).toBe(!useMax);

      await window.waitFor(lag / 2); // should have reached "target * 2"
      expect(matcher.matches()).toBe(!useMax);

      expect(composer.getState().x.current).toBe(target * 2);
      push({ x: { target: target } });

      await window.waitFor(lag / 2); // close to 1.5 * target
      expect(matcher.matches()).toBe(!useMax);

      await window.waitFor(50 + lag / 2); // should have reached "target"
      expect(matcher.matches()).toBe(true);
    });
  }
});

describe("FXScrollMatcher", () => {
  const newScrollable = () => {
    const scrollable = document.createElement("div");
    scrollable.enableScroll();
    return scrollable;
  };

  const top = 100,
    left = 200;

  for (const useMax of [true, false]) {
    const limit = useMax ? "max" : "min";
    test(`raw bounds: ${limit} top`, async () => {
      const scrollable = newScrollable();

      const matcher = new FXScrollMatcher(
        {
          [limit]: { top },
        },
        scrollable,
      );

      await window.waitFor(50);
      expect(matcher.matches()).toBe(useMax);

      scrollable.scrollTo(0, top + 1);
      await window.waitFor(50);
      expect(matcher.matches()).toBe(!useMax);

      scrollable.scrollTo(0, top);
      await window.waitFor(50);
      expect(matcher.matches()).toBe(true);

      scrollable.scrollTo(0, top - 1);
      await window.waitFor(50);
      expect(matcher.matches()).toBe(useMax);

      scrollable.scrollTo(0, top + 1);
      await window.waitFor(50);
      expect(matcher.matches()).toBe(!useMax);
    });

    test(`raw bounds: ${limit} top after scroll to > ${limit}`, async () => {
      const scrollable = newScrollable();

      scrollable.scrollTo(0, top + 1);
      await window.waitFor(50);

      const matcher = new FXScrollMatcher(
        {
          [limit]: { top },
        },
        scrollable,
      );

      await window.waitFor(50);
      expect(matcher.matches()).toBe(!useMax);
    });

    test(`raw bounds: ${limit} left`, async () => {
      const scrollable = newScrollable();

      const matcher = new FXScrollMatcher(
        {
          [limit]: { left },
        },
        scrollable,
      );

      await window.waitFor(50);
      expect(matcher.matches()).toBe(useMax);

      scrollable.scrollTo(left + 1, 0);
      await window.waitFor(50);
      expect(matcher.matches()).toBe(!useMax);

      scrollable.scrollTo(left, 0);
      await window.waitFor(50);
      expect(matcher.matches()).toBe(true);

      scrollable.scrollTo(left - 1, 0);
      await window.waitFor(50);
      expect(matcher.matches()).toBe(useMax);

      scrollable.scrollTo(left + 1, 0);
      await window.waitFor(50);
      expect(matcher.matches()).toBe(!useMax);
    });

    test(`raw bounds: ${limit} left after scroll to > ${limit}`, async () => {
      const scrollable = newScrollable();

      scrollable.scrollTo(left + 1, 0);
      await window.waitFor(50);

      const matcher = new FXScrollMatcher(
        {
          [limit]: { left },
        },
        scrollable,
      );

      await window.waitFor(50);
      expect(matcher.matches()).toBe(!useMax);
    });

    test(`raw bounds: ${limit} top & left`, async () => {
      const scrollable = newScrollable();

      const matcher = new FXScrollMatcher(
        {
          [limit]: { top, left },
        },
        scrollable,
      );

      await window.waitFor(50);
      expect(matcher.matches()).toBe(useMax);

      scrollable.scrollTo(left + 1, 0); // only one matches
      await window.waitFor(50);
      expect(matcher.matches()).toBe(false);

      scrollable.scrollTo(0, top + 1); // only one matches
      await window.waitFor(50);
      expect(matcher.matches()).toBe(false);

      scrollable.scrollTo(left + 1, top + 1);
      await window.waitFor(50);
      expect(matcher.matches()).toBe(!useMax);

      scrollable.scrollTo(left, top);
      await window.waitFor(50);
      expect(matcher.matches()).toBe(true);

      scrollable.scrollTo(left - 1, top + 1); // only one matches
      await window.waitFor(50);
      expect(matcher.matches()).toBe(false);

      scrollable.scrollTo(left + 1, top - 1); // only one matches
      await window.waitFor(50);
      expect(matcher.matches()).toBe(false);

      scrollable.scrollTo(left - 1, top - 1);
      await window.waitFor(50);
      expect(matcher.matches()).toBe(useMax);
    });

    test(`raw bounds: ${limit} top & left after scroll to > ${limit}`, async () => {
      const scrollable = newScrollable();

      scrollable.scrollTo(left + 1, top + 1);
      await window.waitFor(50);

      const matcher = new FXScrollMatcher(
        {
          [limit]: { top, left },
        },
        scrollable,
      );

      await window.waitFor(50);
      expect(matcher.matches()).toBe(!useMax);
    });

    for (const doRestart of [true, false]) {
      test(`relative bounds: ${limit} top 10%${doRestart ? " (+restart)" : ""}`, async () => {
        // 10% is not relative to any reference data, so restarting doesn't make
        // a difference
        const scrollable = newScrollable();

        // start at some value other than 0
        const initial = 0.8 * window.SCROLL_HEIGHT; // > 10%
        scrollable.scrollTo(0, initial);

        const top = 0.1 * window.SCROLL_HEIGHT;

        const matcher = new FXScrollMatcher(
          {
            [limit]: { top: "10%" },
          },
          scrollable,
        );

        if (doRestart) {
          matcher.restart();
        }
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);

        if (doRestart) {
          matcher.restart();
        }
        scrollable.scrollTo(0, top + 1);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);

        if (doRestart) {
          matcher.restart();
        }
        scrollable.scrollTo(0, top);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(true);

        if (doRestart) {
          matcher.restart();
        }
        scrollable.scrollTo(0, top - 1);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(useMax);

        if (doRestart) {
          matcher.restart();
        }
        scrollable.scrollTo(0, top + 1);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);
      });

      test(`relative bounds: ${limit} left 10%${doRestart ? " (+restart)" : ""}`, async () => {
        // 10% is not relative to any reference data, so restarting doesn't make
        // a difference
        const scrollable = newScrollable();

        // start at some value other than 0
        const initial = 0.8 * window.SCROLL_WIDTH; // > 10%
        scrollable.scrollTo(initial, 0);

        const left = 0.1 * window.SCROLL_WIDTH;

        const matcher = new FXScrollMatcher(
          {
            [limit]: { left: "10%" },
          },
          scrollable,
        );

        if (doRestart) {
          matcher.restart();
        }
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);

        if (doRestart) {
          matcher.restart();
        }
        scrollable.scrollTo(left + 1, 0);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);

        if (doRestart) {
          matcher.restart();
        }
        scrollable.scrollTo(left, 0);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(true);

        if (doRestart) {
          matcher.restart();
        }
        scrollable.scrollTo(left - 1, 0);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(useMax);

        if (doRestart) {
          matcher.restart();
        }
        scrollable.scrollTo(left + 1, 0);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);
      });
    }

    test(`relative bounds: ${limit} top +10 + restart`, async () => {
      const scrollable = newScrollable();

      // start at some value other than 0
      const initial = 50; // > 10
      scrollable.scrollTo(0, initial);
      expect(scrollable.scrollTop).toBe(initial);

      const matcher = new FXScrollMatcher(
        {
          [limit]: { top: "+10" },
        },
        scrollable,
      );

      let top = scrollable.scrollTop + 10; // initial max/min
      for (let i = 0; i < 3; i++) {
        await window.waitFor(50);
        expect(matcher.matches()).toBe(useMax);

        scrollable.scrollTo(0, top + 1);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);

        scrollable.scrollTo(0, top);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(true);

        scrollable.scrollTo(0, top - 1);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(useMax);

        matcher.restart(); // reference is now (current top - 1)
        top += 9; // new max/min
      }
    });

    test(`relative bounds: ${limit} left +10 + restart`, async () => {
      const scrollable = newScrollable();

      // start at some value other than 0
      const initial = 50;
      scrollable.scrollTo(initial, 0);
      expect(scrollable.scrollLeft).toBe(initial);

      const matcher = new FXScrollMatcher(
        {
          [limit]: { left: "+10" },
        },
        scrollable,
      );

      let left = scrollable.scrollLeft + 10; // initial max/min
      for (let i = 0; i < 3; i++) {
        await window.waitFor(50);
        expect(matcher.matches()).toBe(useMax);

        scrollable.scrollTo(left + 1, 0);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);

        scrollable.scrollTo(left, 0);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(true);

        scrollable.scrollTo(left - 1, 0);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(useMax);

        matcher.restart(); // reference is now (current left - 1)
        left += 9; // new max/min
      }
    });

    test(`relative bounds: ${limit} top +10% + restart`, async () => {
      const scrollable = newScrollable();

      // start at some value other than 0
      const initial = 0.3 * window.SCROLL_HEIGHT;
      scrollable.scrollTo(0, initial);
      expect(scrollable.scrollTop).toBe(initial);

      const matcher = new FXScrollMatcher(
        {
          [limit]: { top: "+10%" },
        },
        scrollable,
      );

      let top = scrollable.scrollTop + 0.1 * window.SCROLL_HEIGHT; // initial max/min
      for (let i = 0; i < 3; i++) {
        await window.waitFor(50);
        expect(matcher.matches()).toBe(useMax);

        scrollable.scrollTo(0, top + 1);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);

        scrollable.scrollTo(0, top);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(true);

        scrollable.scrollTo(0, top - 1);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(useMax);

        matcher.restart(); // reference is now (current top - 1)
        top += 0.1 * window.SCROLL_HEIGHT - 1; // new max/min
      }
    });

    test(`relative bounds: ${limit} left +10% + restart`, async () => {
      const scrollable = newScrollable();

      // start at some value other than 0
      const initial = 0.3 * window.SCROLL_WIDTH;
      scrollable.scrollTo(initial, 0);
      expect(scrollable.scrollLeft).toBe(initial);

      const matcher = new FXScrollMatcher(
        {
          [limit]: { left: "+10%" },
        },
        scrollable,
      );

      let left = scrollable.scrollLeft + 0.1 * window.SCROLL_WIDTH; // initial max/min
      for (let i = 0; i < 3; i++) {
        await window.waitFor(50);
        expect(matcher.matches()).toBe(useMax);

        scrollable.scrollTo(left + 1, 0);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);

        scrollable.scrollTo(left, 0);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(true);

        scrollable.scrollTo(left - 1, 0);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(useMax);

        matcher.restart(); // reference is now (current left - 1)
        left += 0.1 * window.SCROLL_WIDTH - 1; // new max/min
      }
    });

    test(`relative bounds: ${limit} top -10 + restart`, async () => {
      const scrollable = newScrollable();

      // start at some value other than 0
      const initial = 100;
      scrollable.scrollTo(0, initial);
      expect(scrollable.scrollTop).toBe(initial);

      const matcher = new FXScrollMatcher(
        {
          [limit]: { top: "-10" },
        },
        scrollable,
      );

      // max/min is initial - 10
      await window.waitFor(50);
      expect(matcher.matches()).toBe(!useMax);

      scrollable.scrollTo(0, 200);

      await window.waitFor(50); // let the matcher update its data on scroll
      matcher.restart(); // reference is now 200

      let top = scrollable.scrollTop - 10; // new max/min
      for (let i = 0; i < 3; i++) {
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);

        scrollable.scrollTo(0, top - 1);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(useMax);

        scrollable.scrollTo(0, top);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(true);

        scrollable.scrollTo(0, top + 1);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);

        matcher.restart(); // reference is now (current top + 1)
        top -= 9; // new max/min
      }
    });

    test(`relative bounds: ${limit} left -10 + restart`, async () => {
      const scrollable = newScrollable();

      // start at some value other than 0
      const initial = 100;
      scrollable.scrollTo(initial, 0);
      expect(scrollable.scrollLeft).toBe(initial);

      const matcher = new FXScrollMatcher(
        {
          [limit]: { left: "-10" },
        },
        scrollable,
      );

      // max/min is initial - 10
      await window.waitFor(50);
      expect(matcher.matches()).toBe(!useMax);

      scrollable.scrollTo(0, 200);

      await window.waitFor(50); // let the matcher update its data on scroll
      matcher.restart(); // reference is now 200

      let left = scrollable.scrollLeft - 10; // new max/min
      for (let i = 0; i < 3; i++) {
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);

        scrollable.scrollTo(left - 1, 0);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(useMax);

        scrollable.scrollTo(left, 0);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(true);

        scrollable.scrollTo(left + 1, 0);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);

        matcher.restart(); // reference is now (current left + 1)
        left -= 9; // new max/min
      }
    });

    test(`relative bounds: ${limit} top -10% + restart`, async () => {
      const scrollable = newScrollable();

      // start at some value other than 0
      const initial = window.SCROLL_HEIGHT / 2;
      scrollable.scrollTo(0, initial);
      expect(scrollable.scrollTop).toBe(initial);

      const matcher = new FXScrollMatcher(
        {
          [limit]: { top: "-10%" },
        },
        scrollable,
      );

      // max/min is initial - 10%
      await window.waitFor(50);
      expect(matcher.matches()).toBe(!useMax);

      scrollable.scrollTo(0, 0.8 * window.SCROLL_HEIGHT);

      await window.waitFor(50); // let the matcher update its data on scroll
      matcher.restart(); // reference is now 0.8 * scroll height

      let top = scrollable.scrollTop - 0.1 * window.SCROLL_HEIGHT; // new max/min
      for (let i = 0; i < 3; i++) {
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);

        scrollable.scrollTo(0, top - 1);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(useMax);

        scrollable.scrollTo(0, top);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(true);

        scrollable.scrollTo(0, top + 1);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);

        matcher.restart(); // reference is now (current top + 1)
        top -= 0.1 * window.SCROLL_HEIGHT - 1; // new max/min
      }
    });

    test(`relative bounds: ${limit} left -10% + restart`, async () => {
      const scrollable = newScrollable();

      // start at some value other than 0
      const initial = window.SCROLL_WIDTH / 2;
      scrollable.scrollTo(initial, 0);
      expect(scrollable.scrollLeft).toBe(initial);

      const matcher = new FXScrollMatcher(
        {
          [limit]: { left: "-10%" },
        },
        scrollable,
      );

      // max/min is initial - 10%
      await window.waitFor(50);
      expect(matcher.matches()).toBe(!useMax);

      scrollable.scrollTo(0.8 * window.SCROLL_WIDTH, 0);

      await window.waitFor(50); // let the matcher update its data on scroll
      matcher.restart(); // reference is now 0.8 * scroll width

      let left = scrollable.scrollLeft - 0.1 * window.SCROLL_WIDTH; // new max/min
      for (let i = 0; i < 3; i++) {
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);

        scrollable.scrollTo(left - 1, 0);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(useMax);

        scrollable.scrollTo(left, 0);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(true);

        scrollable.scrollTo(left + 1, 0);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);

        matcher.restart(); // reference is now (current left + 1)
        left -= 0.1 * window.SCROLL_WIDTH - 1; // new max/min
      }
    });

    test(`relative bounds: ${limit} selected test + restart => changes state`, async () => {
      const scrollable = newScrollable();

      const matcher = new FXScrollMatcher(
        {
          [limit]: { top: "+10" },
        },
        scrollable,
      );

      let top = 10; // initial max/min; reference is 0
      for (let i = 0; i < 3; i++) {
        await window.waitFor(50);
        expect(matcher.matches()).toBe(useMax);

        scrollable.scrollTo(0, top + 1);
        await window.waitFor(50);
        expect(matcher.matches()).toBe(!useMax);

        matcher.restart(); // reference is now (current top + 1)
        top += 11; // new max/min
      }
    });
  }
});

// XXX TODO view matcher including when the condition matches initially
