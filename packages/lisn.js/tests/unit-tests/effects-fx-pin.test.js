const { jest, describe, test, expect } = require("@jest/globals");

const { Callback } = window.LISN.modules;
const { FXPin, FXMatcher } = window.LISN.effects;

const newMatcher = (executorBody) => {
  let store;
  const executor = jest.fn((s) => {
    store = s;
    if (executorBody) {
      executorBody(store);
    }
  });

  const matcher = new FXMatcher(executor);

  return { matcher, store, executor };
};

test("default state: no matcher", () => {
  const pin = new FXPin();
  expect(pin.isPinned()).toBe(false);
});

describe("single matcher: when", () => {
  test("not matching yet", () => {
    const { matcher, store } = newMatcher();
    expect(matcher.matches()).toBe(false);

    const pin = new FXPin();
    expect(pin.isPinned()).toBe(false);

    expect(pin.when(matcher)).toBe(pin);
    expect(pin.isPinned()).toBe(false);

    store.setState(false); // no-op
    expect(pin.isPinned()).toBe(false);

    store.setState(true);
    expect(matcher.matches()).toBe(true);
    expect(pin.isPinned()).toBe(true); // activated

    store.setState(false);
    expect(matcher.matches()).toBe(false);
    // pin is still active, since the condition was one-way (turn ON)
    expect(pin.isPinned()).toBe(true);
  });

  test("match, then unmatch immediately", () => {
    const { matcher, store } = newMatcher();

    const pin = new FXPin();
    expect(pin.isPinned()).toBe(false);

    pin.when(matcher);
    expect(pin.isPinned()).toBe(false);

    store.setState(true);
    store.setState(false); // ignored
    expect(pin.isPinned()).toBe(true); // activated
  });

  test("already matching", () => {
    const { matcher, store } = newMatcher();
    store.setState(true);
    expect(matcher.matches()).toBe(true);

    const pin = new FXPin();
    expect(pin.isPinned()).toBe(false);

    pin.when(matcher);
    expect(pin.isPinned()).toBe(true); // activated

    store.setState(true); // no-op
    expect(pin.isPinned()).toBe(true);

    store.setState(false);
    expect(matcher.matches()).toBe(false);
    // pin is still active, since the condition was one-way (turn ON)
    expect(pin.isPinned()).toBe(true);
  });
});

describe("single matcher: until", () => {
  test("not matching yet", () => {
    const { matcher, store } = newMatcher();
    expect(matcher.matches()).toBe(false);

    const pin = new FXPin();
    expect(pin.isPinned()).toBe(false);

    expect(pin.until(matcher)).toBe(pin);
    expect(pin.isPinned()).toBe(false);

    store.setState(false); // no-op
    expect(pin.isPinned()).toBe(false);

    store.setState(true);
    expect(matcher.matches()).toBe(true);
    expect(pin.isPinned()).toBe(false); // already deactivated, so no change

    store.setState(false);
    expect(matcher.matches()).toBe(false);
    // pin is still not active, since the condition was one-way (turn OFF)
    expect(pin.isPinned()).toBe(false);
  });

  test("already matching", () => {
    const { matcher, store } = newMatcher();
    store.setState(true);
    expect(matcher.matches()).toBe(true);

    const pin = new FXPin();
    expect(pin.isPinned()).toBe(false);

    pin.until(matcher);
    expect(pin.isPinned()).toBe(false); // already deactivated, so no change

    store.setState(true); // no-op
    expect(pin.isPinned()).toBe(false);

    store.setState(false);
    expect(matcher.matches()).toBe(false);
    // pin is still not active, since the condition was one-way (turn OFF)
    expect(pin.isPinned()).toBe(false);
  });
});

describe("single matcher: while", () => {
  test("not matching yet", () => {
    const { matcher, store } = newMatcher();
    expect(matcher.matches()).toBe(false);

    const pin = new FXPin();
    expect(pin.isPinned()).toBe(false);

    expect(pin.while(matcher)).toBe(pin);
    expect(pin.isPinned()).toBe(false);

    store.setState(false); // no-op
    expect(pin.isPinned()).toBe(false);

    store.setState(true);
    expect(matcher.matches()).toBe(true);
    expect(pin.isPinned()).toBe(true); // activated

    store.setState(true); // no-op
    expect(pin.isPinned()).toBe(true);

    store.setState(false);
    expect(matcher.matches()).toBe(false);
    expect(pin.isPinned()).toBe(false); // deactivated

    store.setState(true);
    expect(matcher.matches()).toBe(true);
    expect(pin.isPinned()).toBe(true); // activated
  });

  test("match, then unmatch immediately", () => {
    const { matcher, store } = newMatcher();

    const pin = new FXPin();
    expect(pin.isPinned()).toBe(false);

    pin.while(matcher);
    expect(pin.isPinned()).toBe(false);

    store.setState(true); // activates
    store.setState(false); // deactivates
    expect(pin.isPinned()).toBe(false);
  });

  test("already matching", () => {
    const { matcher, store } = newMatcher();
    store.setState(true);
    expect(matcher.matches()).toBe(true);

    const pin = new FXPin();
    expect(pin.isPinned()).toBe(false);

    pin.while(matcher);
    expect(pin.isPinned()).toBe(true); // activated

    store.setState(true); // no-op
    expect(pin.isPinned()).toBe(true);

    store.setState(false);
    expect(matcher.matches()).toBe(false);
    expect(pin.isPinned()).toBe(false); // deactivated

    store.setState(false); // no-op
    expect(pin.isPinned()).toBe(false);

    store.setState(true);
    expect(matcher.matches()).toBe(true);
    expect(pin.isPinned()).toBe(true); // activated
  });
});

describe("multiple conditions (OR) with single matcher: when", () => {
  for (const firstA of [true, false]) {
    test(`not matching yet: order ${firstA ? 1 : 2}`, () => {
      const { matcher: matcherA, store: storeA } = newMatcher();
      const { matcher: matcherB, store: storeB } = newMatcher();

      const pin = new FXPin();
      if (firstA) {
        pin.when(matcherA).when(matcherB);
      } else {
        pin.when(matcherB).when(matcherA);
      }

      expect(pin.isPinned()).toBe(false);

      storeA.setState(true);
      expect(pin.isPinned()).toBe(true); // activated

      storeB.setState(true);
      expect(pin.isPinned()).toBe(true); // still activate

      storeA.setState(false); // ignored
      storeB.setState(false); // ignored
      expect(pin.isPinned()).toBe(true); // still activate
    });

    test(`one matching already: order ${firstA ? 1 : 2}`, () => {
      const { matcher: matcherA, store: storeA } = newMatcher();
      const { matcher: matcherB, store: storeB } = newMatcher();
      storeA.setState(true);

      const pin = new FXPin();
      if (firstA) {
        pin.when(matcherA).when(matcherB);
      } else {
        pin.when(matcherB).when(matcherA);
      }

      expect(pin.isPinned()).toBe(true); // activated

      storeB.setState(true);
      expect(pin.isPinned()).toBe(true); // still activate

      storeA.setState(false); // ignored
      storeB.setState(false); // ignored
      expect(pin.isPinned()).toBe(true); // still activate
    });
  }

  test("both matching already", () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();
    storeA.setState(true);
    storeB.setState(true);

    const pin = new FXPin();
    pin.when(matcherA).when(matcherB);
    expect(pin.isPinned()).toBe(true); // activated

    storeA.setState(false); // ignored
    storeB.setState(false); // ignored
    expect(pin.isPinned()).toBe(true); // still activate
  });
});

test("multiple conditions (OR) with single matcher: until", () => {
  const { matcher: matcherA, store: storeA } = newMatcher();
  const { matcher: matcherB, store: storeB } = newMatcher();
  storeA.setState(true);

  const pin = new FXPin();
  pin.until(matcherA).until(matcherB);
  expect(pin.isPinned()).toBe(false); // already deactivated, so no change

  storeB.setState(true);
  expect(pin.isPinned()).toBe(false); // already deactivated, so no change

  storeA.setState(false); // ignored
  storeB.setState(false); // ignored
  expect(pin.isPinned()).toBe(false);
});

describe("multiple conditions (OR) with single matcher: while", () => {
  for (const firstA of [true, false]) {
    test(`not matching yet: order ${firstA ? 1 : 2}`, () => {
      const { matcher: matcherA, store: storeA } = newMatcher();
      const { matcher: matcherB, store: storeB } = newMatcher();

      const pin = new FXPin();
      if (firstA) {
        pin.while(matcherA).while(matcherB);
      } else {
        pin.while(matcherB).while(matcherA);
      }

      expect(pin.isPinned()).toBe(false);

      storeA.setState(true);
      expect(pin.isPinned()).toBe(true); // activated

      storeB.setState(true);
      expect(pin.isPinned()).toBe(true); // already activated, so no change

      storeA.setState(false);
      expect(pin.isPinned()).toBe(true); // still activate, since matcherB matches

      storeB.setState(false);
      expect(pin.isPinned()).toBe(false); // deactivated
    });

    test(`already matching: order ${firstA ? 1 : 2}`, () => {
      const { matcher: matcherA, store: storeA } = newMatcher();
      const { matcher: matcherB, store: storeB } = newMatcher();
      storeA.setState(true);
      storeB.setState(true);

      const pin = new FXPin();
      if (firstA) {
        pin.while(matcherA).while(matcherB);
      } else {
        pin.while(matcherB).while(matcherA);
      }

      expect(pin.isPinned()).toBe(true); // activated

      storeA.setState(false);
      expect(pin.isPinned()).toBe(true); // still activate, since matcherB matches

      storeB.setState(false);
      expect(pin.isPinned()).toBe(false); // deactivated

      storeA.setState(false); // no-op
      storeB.setState(false); // no-op
      expect(pin.isPinned()).toBe(false);

      storeA.setState(true);
      expect(pin.isPinned()).toBe(true); // activated
    });
  }
});

describe("multiple matchers (AND): when", () => {
  test("not matching yet", () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();
    const { matcher: matcherC, store: storeC } = newMatcher();

    const pin = new FXPin();
    pin.when(matcherA, matcherB, matcherC);

    expect(pin.isPinned()).toBe(false);

    storeA.setState(true);
    expect(pin.isPinned()).toBe(false); // not activated yet

    storeC.setState(true);
    expect(pin.isPinned()).toBe(false); // not activated yet

    storeB.setState(true);
    expect(pin.isPinned()).toBe(true); // activated

    storeA.setState(false);
    storeB.setState(false);
    storeC.setState(false);
    // pin is still active, since the condition was one-way (turn ON)
    expect(pin.isPinned()).toBe(true);
  });

  test("match, then unmatch immediately", async () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();

    const cbk = jest.fn();
    const pin = new FXPin();
    pin.onChange(cbk);

    pin.when(matcherA, matcherB);
    expect(pin.isPinned()).toBe(false);

    storeA.setState(true);
    storeA.setState(false);
    storeB.setState(true);
    storeB.setState(false);

    await window.waitFor(0); // callbacks are async
    expect(pin.isPinned()).toBe(false);
    expect(cbk).toHaveBeenCalledTimes(0); // matcherA and B not matching at the same time

    storeA.setState(true);
    storeB.setState(true); // activated
    storeA.setState(false);
    storeB.setState(false); // still active as it's one-way

    await window.waitFor(0); // callbacks are async
    expect(pin.isPinned()).toBe(true);
    expect(cbk).toHaveBeenCalledTimes(1);
  });

  test("some matching", () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();
    const { matcher: matcherC, store: storeC } = newMatcher();
    storeA.setState(true);
    storeC.setState(true);

    const pin = new FXPin();
    pin.when(matcherA, matcherB, matcherC);

    expect(pin.isPinned()).toBe(false); // not activated yet

    storeB.setState(true);
    expect(pin.isPinned()).toBe(true); // activated

    storeA.setState(false);
    storeB.setState(false);
    storeC.setState(false);
    // pin is still active, since the condition was one-way (turn ON)
    expect(pin.isPinned()).toBe(true);
  });

  test("all already matching", () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();
    const { matcher: matcherC, store: storeC } = newMatcher();
    storeA.setState(true);
    storeB.setState(true);
    storeC.setState(true);

    const pin = new FXPin();
    pin.when(matcherA, matcherB, matcherC);

    expect(pin.isPinned()).toBe(true); // activated

    storeA.setState(false);
    storeB.setState(false);
    storeC.setState(false);
    // pin is still active, since the condition was one-way (turn ON)
    expect(pin.isPinned()).toBe(true);
  });
});

describe("multiple matchers (AND): until", () => {
  test("not matching yet", () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();
    const { matcher: matcherC, store: storeC } = newMatcher();

    const pin = new FXPin();
    pin.until(matcherA, matcherB, matcherC);

    storeA.setState(true);
    storeB.setState(true);
    storeC.setState(true);
    expect(pin.isPinned()).toBe(false); // already deactivated, so no change
  });

  test("all already matching", () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();
    const { matcher: matcherC, store: storeC } = newMatcher();
    storeA.setState(true);
    storeB.setState(true);
    storeC.setState(true);

    const pin = new FXPin();
    pin.until(matcherA, matcherB, matcherC);

    expect(pin.isPinned()).toBe(false); // already deactivated, so no change
  });
});

describe("multiple matchers (AND): while", () => {
  test("multiple changing states at once", () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();
    const { matcher: matcherC, store: storeC } = newMatcher();

    const pin = new FXPin();
    pin.while(matcherA, matcherB, matcherC);

    expect(pin.isPinned()).toBe(false);

    storeA.setState(true);
    storeB.setState(true);
    storeC.setState(true);
    expect(pin.isPinned()).toBe(true); // activated

    storeA.setState(false);
    expect(pin.isPinned()).toBe(false); // deactivated

    storeA.setState(true);
    expect(pin.isPinned()).toBe(true); // activated

    storeA.setState(false);
    storeB.setState(false);
    storeC.setState(false);
    expect(pin.isPinned()).toBe(false); // deactivated

    storeA.setState(true);
    expect(pin.isPinned()).toBe(false); // not activated yet

    storeB.setState(true);
    storeC.setState(true);
    expect(pin.isPinned()).toBe(true); // activated
  });

  test("not matching yet", () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();
    const { matcher: matcherC, store: storeC } = newMatcher();

    const pin = new FXPin();
    pin.while(matcherA, matcherB, matcherC);

    expect(pin.isPinned()).toBe(false);

    storeA.setState(true);
    expect(pin.isPinned()).toBe(false); // not activated yet

    storeA.setState(true); // no-op
    expect(pin.isPinned()).toBe(false);

    storeC.setState(true);
    expect(pin.isPinned()).toBe(false); // not activated yet

    storeB.setState(true);
    expect(pin.isPinned()).toBe(true); // activated

    storeA.setState(false);
    expect(pin.isPinned()).toBe(false); // deactivated

    storeB.setState(false);
    expect(pin.isPinned()).toBe(false); // already deactivated, so no change

    storeB.setState(false); // no-op
    expect(pin.isPinned()).toBe(false);

    storeA.setState(true);
    expect(pin.isPinned()).toBe(false); // not activated yet

    storeB.setState(true);
    expect(pin.isPinned()).toBe(true); // activated

    storeC.setState(false);
    expect(pin.isPinned()).toBe(false); // deactivated
  });

  test("match, then unmatch immediately", async () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();

    const cbk = jest.fn();
    const pin = new FXPin();
    pin.onChange(cbk);

    pin.while(matcherA, matcherB);
    expect(pin.isPinned()).toBe(false);

    storeA.setState(true);
    storeA.setState(false);
    storeB.setState(true);
    storeB.setState(false);

    await window.waitFor(0); // callbacks are async
    expect(pin.isPinned()).toBe(false);
    expect(cbk).toHaveBeenCalledTimes(0); // matcherA and B not matching at the same time

    storeA.setState(true);
    storeB.setState(true); // activated
    storeA.setState(false);
    storeB.setState(false); // deactivated

    await window.waitFor(0); // callbacks are async
    expect(pin.isPinned()).toBe(false);
    expect(cbk).toHaveBeenCalledTimes(2);
  });

  test("some matching", () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();
    const { matcher: matcherC, store: storeC } = newMatcher();
    storeA.setState(true);
    storeC.setState(true);

    const pin = new FXPin();
    pin.while(matcherA, matcherB, matcherC);

    expect(pin.isPinned()).toBe(false); // not activated yet

    storeB.setState(true);
    expect(pin.isPinned()).toBe(true); // activated

    storeA.setState(false);
    expect(pin.isPinned()).toBe(false); // deactivated

    storeA.setState(true);
    expect(pin.isPinned()).toBe(true); // activated

    storeC.setState(false);
    expect(pin.isPinned()).toBe(false); // deactivated
  });

  test("all already matching", () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();
    const { matcher: matcherC, store: storeC } = newMatcher();
    storeA.setState(true);
    storeB.setState(true);
    storeC.setState(true);

    const pin = new FXPin();
    pin.while(matcherA, matcherB, matcherC);

    expect(pin.isPinned()).toBe(true); // activated

    storeB.setState(false);
    expect(pin.isPinned()).toBe(false); // deactivated

    storeB.setState(true);
    expect(pin.isPinned()).toBe(true); // activated

    storeC.setState(false);
    expect(pin.isPinned()).toBe(false); // deactivated
  });
});

describe("mix", () => {
  for (const firstA of [true, false]) {
    test(`when + until: order ${firstA ? 1 : 2}`, () => {
      const { matcher: matcherA, store: storeA } = newMatcher();
      const { matcher: matcherB, store: storeB } = newMatcher();

      const pin = new FXPin();
      if (firstA) {
        pin.when(matcherA).until(matcherB);
      } else {
        pin.until(matcherB).when(matcherA);
      }

      expect(pin.isPinned()).toBe(false);

      storeB.setState(true); // OFF trigger
      expect(pin.isPinned()).toBe(false); // already deactivated, so no change

      storeA.setState(true); // ON trigger
      expect(pin.isPinned()).toBe(true); // activated, even though matcherB matches

      storeB.setState(false); // ignored
      expect(pin.isPinned()).toBe(true);

      storeB.setState(true); // OFF trigger
      expect(pin.isPinned()).toBe(false); // deactivated, even though matcherA matches

      storeA.setState(false); // ignored
      expect(pin.isPinned()).toBe(false);

      storeB.setState(false); // ignored
      storeB.setState(true); // OFF trigger
      expect(pin.isPinned()).toBe(false); // already deactivated, so no change

      storeB.setState(false); // reset

      // ---------- multiple at a time v1
      storeB.setState(true); // OFF trigger
      storeA.setState(true); // ON trigger
      expect(pin.isPinned()).toBe(true); // activated

      storeB.setState(false); // ignored
      storeA.setState(false); // ignored
      expect(pin.isPinned()).toBe(true); // no change

      storeA.setState(true); // ON trigger
      storeB.setState(true); // OFF trigger
      expect(pin.isPinned()).toBe(false); // deactivated
      storeA.setState(false); // reset
      storeB.setState(false); // reset

      // ---------- multiple at a time v2
      storeA.setState(true); // ON trigger
      storeA.setState(false); // ignored
      expect(pin.isPinned()).toBe(true); // activated

      storeB.setState(true); // OFF trigger
      storeB.setState(false); // ignored
      expect(pin.isPinned()).toBe(false); // deactivated
    });

    test(`when + until (both matching): order ${firstA ? 1 : 2}`, () => {
      const { matcher: matcherA, store: storeA } = newMatcher();
      const { matcher: matcherB, store: storeB } = newMatcher();
      storeA.setState(true);
      storeB.setState(true);

      let initialExpectedState;
      const pin = new FXPin();
      if (firstA) {
        // matcherA's state activates it, then matcherB state deactivates it
        pin.when(matcherA).until(matcherB);
        initialExpectedState = false;
      } else {
        // matcherB's state deactivates it (though it's already deactivated), then
        // matcherA state deactivates it
        pin.until(matcherB).when(matcherA);
        initialExpectedState = true;
      }

      expect(pin.isPinned()).toBe(initialExpectedState);

      storeA.setState(true); // no-op, since it already matches
      expect(pin.isPinned()).toBe(initialExpectedState); // no change

      storeA.setState(false); // ignored
      expect(pin.isPinned()).toBe(initialExpectedState);

      storeB.setState(true); // no-op, since it already matches
      expect(pin.isPinned()).toBe(initialExpectedState); // no change

      storeB.setState(false); // ignored
      expect(pin.isPinned()).toBe(initialExpectedState);

      if (initialExpectedState) {
        storeA.setState(true); // ON trigger
        expect(pin.isPinned()).toBe(true); // already activate
        storeA.setState(false); // reset, ignored

        storeB.setState(true); // OFF trigger
        expect(pin.isPinned()).toBe(false); // deactivated

        storeA.setState(true); // ON trigger
        expect(pin.isPinned()).toBe(true); // activated
      } else {
        storeB.setState(true); // OFF trigger
        expect(pin.isPinned()).toBe(false); // already deactivated
        storeB.setState(false); // reset, ignored

        storeA.setState(true); // ON trigger
        expect(pin.isPinned()).toBe(true); // activated

        storeB.setState(true); // OFF trigger
        expect(pin.isPinned()).toBe(false); // deactivated
      }
    });

    test(`when + while: order ${firstA ? 1 : 2}`, async () => {
      const { matcher: matcherA, store: storeA } = newMatcher();
      const { matcher: matcherB, store: storeB } = newMatcher();

      const cbk = jest.fn();
      const pin = new FXPin();
      pin.onChange(cbk);

      if (firstA) {
        pin.when(matcherA).while(matcherB);
      } else {
        pin.while(matcherB).when(matcherA);
      }

      await window.waitFor(0); // callbacks are async
      expect(pin.isPinned()).toBe(false);
      expect(cbk).toHaveBeenCalledTimes(0);

      storeA.setState(true); // ON trigger
      await window.waitFor(0); // callbacks are async
      expect(pin.isPinned()).toBe(true);
      expect(cbk).toHaveBeenCalledTimes(1);

      storeB.setState(true); // LOCK
      await window.waitFor(0); // callbacks are async
      expect(pin.isPinned()).toBe(true); // already active, so no change
      expect(cbk).toHaveBeenCalledTimes(1);

      storeB.setState(false); // UNLOCK and deactivate
      await window.waitFor(0); // callbacks are async
      expect(pin.isPinned()).toBe(false); // deactivated
      expect(cbk).toHaveBeenCalledTimes(2);

      storeB.setState(true); // activate and LOCK
      await window.waitFor(0); // callbacks are async
      expect(pin.isPinned()).toBe(true); // activated
      expect(cbk).toHaveBeenCalledTimes(3);

      storeA.setState(false); // ignored
      await window.waitFor(0); // callbacks are async
      expect(pin.isPinned()).toBe(true);
      expect(cbk).toHaveBeenCalledTimes(3);
    });

    test(`when (already matching) + while: order ${firstA ? 1 : 2}`, async () => {
      const { matcher: matcherA, store: storeA } = newMatcher();
      const { matcher: matcherB, store: storeB } = newMatcher();
      storeA.setState(true);

      const cbk = jest.fn();
      const pin = new FXPin();
      pin.onChange(cbk);

      if (firstA) {
        pin.when(matcherA).while(matcherB);
      } else {
        pin.while(matcherB).when(matcherA);
      }

      await window.waitFor(0); // callbacks are async
      expect(pin.isPinned()).toBe(true); // activated by when condition
      expect(cbk).toHaveBeenCalledTimes(1);

      storeA.setState(false); // ignored
      await window.waitFor(0); // callbacks are async
      expect(pin.isPinned()).toBe(true);
      expect(cbk).toHaveBeenCalledTimes(1);

      storeB.setState(true); // LOCK
      await window.waitFor(0); // callbacks are async
      expect(pin.isPinned()).toBe(true); // already active, so no change
      expect(cbk).toHaveBeenCalledTimes(1);

      storeB.setState(false); // UNLOCK and deactivate
      await window.waitFor(0); // callbacks are async
      expect(pin.isPinned()).toBe(false); // deactivated
      expect(cbk).toHaveBeenCalledTimes(2);

      storeA.setState(true); // ON trigger
      await window.waitFor(0); // callbacks are async
      expect(pin.isPinned()).toBe(true); // activated
      expect(cbk).toHaveBeenCalledTimes(3);
    });
  }

  for (const order of [1, 2, 3]) {
    test(`when + until + while: order ${order}`, () => {
      const { matcher: matcherA, store: storeA } = newMatcher();
      const { matcher: matcherB, store: storeB } = newMatcher();
      const { matcher: matcherC, store: storeC } = newMatcher();

      const cbk = jest.fn();
      const pin = new FXPin();
      pin.onChange(cbk);

      if (order === 1) {
        pin.when(matcherA).until(matcherB).while(matcherC);
      } else if (order === 2) {
        pin.while(matcherC).when(matcherA).until(matcherB);
      } else if (order === 3) {
        pin.while(matcherC).until(matcherB).when(matcherA);
      }

      expect(pin.isPinned()).toBe(false); // not activated yet

      // ---------- one at a time
      storeA.setState(true); // ON trigger
      storeA.setState(false); // ignored
      expect(pin.isPinned()).toBe(true); // activated

      storeB.setState(true); // OFF trigger
      storeB.setState(false); // ignored
      expect(pin.isPinned()).toBe(false); // deactivated

      storeC.setState(true); // activate and LOCK
      expect(pin.isPinned()).toBe(true); // activated

      storeB.setState(true); // OFF trigger, but it's locked
      expect(pin.isPinned()).toBe(true); // still activated

      storeC.setState(false); // UNLOCK and deactivate
      expect(pin.isPinned()).toBe(false); // deactivated
      storeB.setState(false);

      // ---------- multiple at a time v1
      storeA.setState(true); // ON trigger
      storeB.setState(true); // OFF trigger
      storeC.setState(true); // activate and LOCK
      expect(pin.isPinned()).toBe(true); // activated

      storeC.setState(false); // UNLOCK and deactivate
      expect(pin.isPinned()).toBe(false); // deactivated

      storeA.setState(false); // ignored
      storeB.setState(false); // ignored

      // ---------- multiple at a time v2
      storeC.setState(true); // activate and LOCK
      storeB.setState(true); // OFF trigger but it's locked
      expect(pin.isPinned()).toBe(true); // activated

      storeA.setState(true); // ON trigger but already active
      storeC.setState(false); // UNLOCK and deactivate
      expect(pin.isPinned()).toBe(false); // deactivated

      storeA.setState(false); // ignored
      storeB.setState(false); // ignored
    });

    test(`when (already matching) + until (already matching) + while: order ${order}`, () => {
      const { matcher: matcherA, store: storeA } = newMatcher();
      const { matcher: matcherB, store: storeB } = newMatcher();
      const { matcher: matcherC } = newMatcher();
      storeA.setState(true);
      storeB.setState(true);

      const cbk = jest.fn();
      const pin = new FXPin();
      pin.onChange(cbk);

      let initialExpectedState;
      if (order === 1) {
        // matcherA's state activates it, then matcherB state deactivates it
        pin.when(matcherA).until(matcherB).while(matcherC);
        initialExpectedState = false;
      } else if (order === 2) {
        // matcherA's state activates it, then matcherB state deactivates it
        pin.while(matcherC).when(matcherA).until(matcherB);
        initialExpectedState = false;
      } else if (order === 3) {
        // matcherB's state deactivates it (though it's already deactivated), then
        // matcherA state deactivates it
        pin.while(matcherC).until(matcherB).when(matcherA);
        initialExpectedState = true;
      }

      expect(pin.isPinned()).toBe(initialExpectedState);
    });

    test(`when + until + while (already matching): order ${order}`, () => {
      const { matcher: matcherA } = newMatcher();
      const { matcher: matcherB } = newMatcher();
      const { matcher: matcherC, store: storeC } = newMatcher();
      storeC.setState(true);

      const cbk = jest.fn();
      const pin = new FXPin();
      pin.onChange(cbk);

      if (order === 1) {
        pin.when(matcherA).until(matcherB).while(matcherC);
      } else if (order === 2) {
        pin.while(matcherC).when(matcherA).until(matcherB);
      } else if (order === 3) {
        pin.while(matcherC).until(matcherB).when(matcherA);
      }

      expect(pin.isPinned()).toBe(true); // activated
    });

    test(`when + until + while (all already matching): order ${order}`, () => {
      const { matcher: matcherA, store: storeA } = newMatcher();
      const { matcher: matcherB, store: storeB } = newMatcher();
      const { matcher: matcherC, store: storeC } = newMatcher();
      storeA.setState(true);
      storeB.setState(true);
      storeC.setState(true);

      const cbk = jest.fn();
      const pin = new FXPin();
      pin.onChange(cbk);

      if (order === 1) {
        pin.when(matcherA).until(matcherB).while(matcherC);
      } else if (order === 2) {
        pin.while(matcherC).when(matcherA).until(matcherB);
      } else if (order === 3) {
        pin.while(matcherC).until(matcherB).when(matcherA);
      }

      expect(pin.isPinned()).toBe(true); // activated
    });
  }
});

describe("with pin", () => {
  test("when", () => {
    const { matcher, store } = newMatcher();
    expect(matcher.matches()).toBe(false);

    const triggerPin = new FXPin();
    triggerPin.while(matcher);

    const pin = new FXPin();
    pin.when(triggerPin);
    expect(pin.isPinned()).toBe(false);

    store.setState(true);
    expect(triggerPin.isPinned()).toBe(true);
    expect(pin.isPinned()).toBe(true); // activated

    store.setState(false);
    expect(triggerPin.isPinned()).toBe(false);
    // pin is still active, since the condition was one-way (turn ON)
    expect(pin.isPinned()).toBe(true);
  });

  test("until", () => {
    const { matcher, store } = newMatcher();
    expect(matcher.matches()).toBe(false);

    const triggerPin = new FXPin();
    triggerPin.while(matcher);

    const pin = new FXPin();
    pin.until(triggerPin);
    expect(pin.isPinned()).toBe(false);

    store.setState(true);
    expect(triggerPin.isPinned()).toBe(true);
    expect(pin.isPinned()).toBe(false); // already deactivated, so no change
  });

  test("while", () => {
    const { matcher, store } = newMatcher();
    expect(matcher.matches()).toBe(false);

    const triggerPin = new FXPin();
    triggerPin.while(matcher);

    const pin = new FXPin();
    pin.while(triggerPin);
    expect(pin.isPinned()).toBe(false);

    store.setState(true);
    expect(triggerPin.isPinned()).toBe(true);
    expect(pin.isPinned()).toBe(true); // activated

    store.setState(false);
    expect(triggerPin.isPinned()).toBe(false);
    expect(pin.isPinned()).toBe(false); // deactivated
  });
});

describe("onChange/offChange", () => {
  test("single matcher condition", async () => {
    const { matcher, store } = newMatcher();
    expect(matcher.matches()).toBe(false);

    const pin = new FXPin();
    pin.while(matcher);

    const cbk = jest.fn();
    pin.onChange(cbk);
    pin.onChange(cbk); // no-op

    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(0);

    store.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenNthCalledWith(1, pin, { isPinned: true });

    store.setState(true); // no-op
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(1);

    store.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(2);
    expect(cbk).toHaveBeenNthCalledWith(2, pin, { isPinned: false });

    store.setState(false); // no-op
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(2);

    store.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(3);
    expect(cbk).toHaveBeenNthCalledWith(3, pin, { isPinned: true });

    pin.offChange(cbk);
    store.setState(true);
    store.setState(false);
    store.setState(true);
    store.setState(false);

    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(3); // no new calls
  });

  test("multiple matcher condition, multiple matchers", async () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();
    const { matcher: matcherC, store: storeC } = newMatcher();
    const { matcher: matcherD, store: storeD } = newMatcher();

    const pin = new FXPin();
    pin.while(matcherA).when(matcherB, matcherC).until(matcherD);

    const cbk = jest.fn();
    pin.onChange(cbk);

    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(0);

    storeA.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenNthCalledWith(1, pin, { isPinned: true });

    storeA.setState(true); // no-op
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(1);

    storeD.setState(true); // ignored
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(1);

    storeD.setState(false); // ignored
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(1);

    storeB.setState(true); // ignored
    storeC.setState(true); // ignored
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(1);

    storeB.setState(false); // ignored
    storeC.setState(false); // ignored
    expect(pin.isPinned()).toBe(true);

    storeA.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(2);
    expect(cbk).toHaveBeenNthCalledWith(2, pin, { isPinned: false });

    // -----

    storeB.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(2); // no yet active

    storeB.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(2);

    storeB.setState(true);
    storeC.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(3);
    expect(cbk).toHaveBeenNthCalledWith(3, pin, { isPinned: true });

    storeD.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(4);
    expect(cbk).toHaveBeenNthCalledWith(4, pin, { isPinned: false });

    storeA.setState(true);
    storeB.setState(true);
    storeC.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(5);
    expect(cbk).toHaveBeenNthCalledWith(5, pin, { isPinned: true });

    pin.offChange(cbk);
    storeA.setState(false);
    storeB.setState(false);
    storeC.setState(false);

    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(5); // no new calls
  });

  test("callback.remove", async () => {
    const { matcher, store } = newMatcher();

    const pin = new FXPin();
    pin.while(matcher);

    const cbkJ = jest.fn();
    const cbk = Callback.wrap(cbkJ);

    pin.onChange(cbk);
    pin.onChange(cbk); // no-op
    cbk.remove();

    store.setState(true);
    store.setState(false);
    store.setState(true);
    store.setState(false);

    await window.waitFor(0); // callbacks are async
    expect(cbkJ).toHaveBeenCalledTimes(0);
  });

  test("return Callback.REMOVE", async () => {
    const { matcher, store } = newMatcher();

    const pin = new FXPin();
    pin.while(matcher);

    const cbk = jest.fn(() => Callback.REMOVE);

    pin.onChange(cbk);
    pin.onChange(cbk); // no-op

    store.setState(true);
    store.setState(false);
    store.setState(true);
    store.setState(false);

    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(1); // removed after 1st time
  });
});

describe("invert", () => {
  test("when not pinned", () => {
    const { matcher, store } = newMatcher();
    const pin = new FXPin();
    pin.while(matcher);
    expect(pin.isPinned()).toBe(false);

    const inverted = pin.invert();
    expect(pin.isPinned()).toBe(false);
    expect(inverted.isPinned()).toBe(true);

    store.setState(true);

    expect(pin.isPinned()).toBe(true);
    expect(inverted.isPinned()).toBe(false);
  });

  test("when pinned", () => {
    const { matcher, store } = newMatcher();
    const pin = new FXPin();
    pin.while(matcher);
    expect(pin.isPinned()).toBe(false);

    store.setState(true);
    expect(pin.isPinned()).toBe(true);

    const inverted = pin.invert();
    expect(pin.isPinned()).toBe(true);
    expect(inverted.isPinned()).toBe(false);

    store.setState(false);

    expect(pin.isPinned()).toBe(false);
    expect(inverted.isPinned()).toBe(true);
  });
});
