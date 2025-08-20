const { jest, describe, test, expect } = require("@jest/globals");

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
  expect(pin.isActive()).toBe(false);
});

describe("single matcher: when", () => {
  test("not matching yet", async () => {
    const { matcher, store } = newMatcher();
    expect(matcher.matches()).toBe(false);

    const pin = new FXPin();
    expect(pin.isActive()).toBe(false);

    expect(pin.when(matcher)).toBe(pin);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);

    store.setState(false); // no-op
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);

    store.setState(true);
    expect(matcher.matches()).toBe(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true); // activated

    store.setState(false);
    expect(matcher.matches()).toBe(false);
    await window.waitFor(0); // callbacks are async
    // pin is still active, since the condition was one-way (turn ON)
    expect(pin.isActive()).toBe(true);
  });

  test("already matching", async () => {
    const { matcher, store } = newMatcher();
    store.setState(true);
    expect(matcher.matches()).toBe(true);

    const pin = new FXPin();
    expect(pin.isActive()).toBe(false);

    pin.when(matcher);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true); // activated

    store.setState(true); // no-op
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true);

    store.setState(false);
    expect(matcher.matches()).toBe(false);
    await window.waitFor(0); // callbacks are async
    // pin is still active, since the condition was one-way (turn ON)
    expect(pin.isActive()).toBe(true);
  });
});

describe("single matcher: until", () => {
  test("not matching yet", async () => {
    const { matcher, store } = newMatcher();
    expect(matcher.matches()).toBe(false);

    const pin = new FXPin();
    expect(pin.isActive()).toBe(false);

    expect(pin.until(matcher)).toBe(pin);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);

    store.setState(false); // no-op
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);

    store.setState(true);
    expect(matcher.matches()).toBe(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // already deactivated, so no change

    store.setState(false);
    expect(matcher.matches()).toBe(false);
    await window.waitFor(0); // callbacks are async
    // pin is still not active, since the condition was one-way (turn OFF)
    expect(pin.isActive()).toBe(false);
  });

  test("already matching", async () => {
    const { matcher, store } = newMatcher();
    store.setState(true);
    expect(matcher.matches()).toBe(true);

    const pin = new FXPin();
    expect(pin.isActive()).toBe(false);

    pin.until(matcher);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // already deactivated, so no change

    store.setState(true); // no-op
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);

    store.setState(false);
    expect(matcher.matches()).toBe(false);
    await window.waitFor(0); // callbacks are async
    // pin is still not active, since the condition was one-way (turn OFF)
    expect(pin.isActive()).toBe(false);
  });
});

describe("when one matcher, until another matcher", () => {
  for (const firstA of [true, false]) {
    test(`not matching yet: order ${firstA ? 1 : 2}`, async () => {
      const { matcher: matcherA, store: storeA } = newMatcher();
      const { matcher: matcherB, store: storeB } = newMatcher();

      const pin = new FXPin();
      if (firstA) {
        pin.when(matcherA).until(matcherB);
      } else {
        pin.until(matcherB).when(matcherA);
      }

      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(false);

      storeB.setState(true); // OFF trigger
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(false); // already deactivated, so no change

      storeA.setState(true); // ON trigger
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(true); // activated, even though matcherB matches

      storeB.setState(false); // ignored
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(true); // already active, so no change

      storeB.setState(true); // OFF trigger
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(false); // deactivated, even though matcherA matches

      storeA.setState(false); // ignored
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(false);
    });

    test(`alredy matching: order ${firstA ? 1 : 2}`, async () => {
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

      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(initialExpectedState);

      storeA.setState(true); // no-op, since it already matches
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(initialExpectedState); // no change

      storeA.setState(false); // ignored
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(initialExpectedState);

      storeB.setState(true); // no-op, since it already matches
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(initialExpectedState); // no change

      storeB.setState(false); // ignored
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(initialExpectedState);

      if (initialExpectedState) {
        storeA.setState(true); // ON trigger
        await window.waitFor(0); // callbacks are async
        expect(pin.isActive()).toBe(true); // already activate
        storeA.setState(false); // reset, ignored

        storeB.setState(true); // OFF trigger
        await window.waitFor(0); // callbacks are async
        expect(pin.isActive()).toBe(false); // deactivated

        storeA.setState(true); // ON trigger
        await window.waitFor(0); // callbacks are async
        expect(pin.isActive()).toBe(true); // activated
      } else {
        storeB.setState(true); // OFF trigger
        await window.waitFor(0); // callbacks are async
        expect(pin.isActive()).toBe(false); // already deactivated
        storeB.setState(false); // reset, ignored

        storeA.setState(true); // ON trigger
        await window.waitFor(0); // callbacks are async
        expect(pin.isActive()).toBe(true); // activated

        storeB.setState(true); // OFF trigger
        await window.waitFor(0); // callbacks are async
        expect(pin.isActive()).toBe(false); // deactivated
      }
    });
  }
});

describe("single matcher: while", () => {
  test("not matching yet", async () => {
    const { matcher, store } = newMatcher();
    expect(matcher.matches()).toBe(false);

    const pin = new FXPin();
    expect(pin.isActive()).toBe(false);

    expect(pin.while(matcher)).toBe(pin);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);

    store.setState(false); // no-op
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);

    store.setState(true);
    expect(matcher.matches()).toBe(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true); // activated

    store.setState(true); // no-op
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true);

    store.setState(false);
    expect(matcher.matches()).toBe(false);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // deactivated

    store.setState(true);
    expect(matcher.matches()).toBe(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true); // activated
  });

  test("already matching", async () => {
    const { matcher, store } = newMatcher();
    store.setState(true);
    expect(matcher.matches()).toBe(true);

    const pin = new FXPin();
    expect(pin.isActive()).toBe(false);

    pin.while(matcher);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true); // activated

    store.setState(true); // no-op
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true);

    store.setState(false);
    expect(matcher.matches()).toBe(false);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // deactivated

    store.setState(false); // no-op
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);

    store.setState(true);
    expect(matcher.matches()).toBe(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true); // activated
  });
});

describe("multiple conditions (OR) with single matcher: when", () => {
  for (const firstA of [true, false]) {
    test(`not matching yet: order ${firstA ? 1 : 2}`, async () => {
      const { matcher: matcherA, store: storeA } = newMatcher();
      const { matcher: matcherB, store: storeB } = newMatcher();

      const pin = new FXPin();
      if (firstA) {
        pin.when(matcherA).when(matcherB);
      } else {
        pin.when(matcherB).when(matcherA);
      }

      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(false);

      storeA.setState(true);
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(true); // activated

      storeB.setState(true);
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(true); // still activate

      storeA.setState(false); // ignored
      storeB.setState(false); // ignored
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(true); // still activate
    });

    test(`one matching already: order ${firstA ? 1 : 2}`, async () => {
      const { matcher: matcherA, store: storeA } = newMatcher();
      const { matcher: matcherB, store: storeB } = newMatcher();
      storeA.setState(true);

      const pin = new FXPin();
      if (firstA) {
        pin.when(matcherA).when(matcherB);
      } else {
        pin.when(matcherB).when(matcherA);
      }

      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(true); // activated

      storeB.setState(true);
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(true); // still activate

      storeA.setState(false); // ignored
      storeB.setState(false); // ignored
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(true); // still activate
    });
  }

  test("both matching already", async () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();
    storeA.setState(true);
    storeB.setState(true);

    const pin = new FXPin();
    pin.when(matcherA).when(matcherB);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true); // activated

    storeA.setState(false); // ignored
    storeB.setState(false); // ignored
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true); // still activate
  });
});

test("multiple conditions (OR) with single matcher: until", async () => {
  const { matcher: matcherA, store: storeA } = newMatcher();
  const { matcher: matcherB, store: storeB } = newMatcher();
  storeA.setState(true);

  const pin = new FXPin();
  pin.until(matcherA).until(matcherB);
  await window.waitFor(0); // callbacks are async
  expect(pin.isActive()).toBe(false); // already deactivated, so no change

  storeB.setState(true);
  await window.waitFor(0); // callbacks are async
  expect(pin.isActive()).toBe(false); // already deactivated, so no change

  storeA.setState(false); // ignored
  storeB.setState(false); // ignored
  await window.waitFor(0); // callbacks are async
  expect(pin.isActive()).toBe(false);
});

describe("multiple conditions (OR) with single matcher: while", () => {
  for (const firstA of [true, false]) {
    test(`not matching yet: order ${firstA ? 1 : 2}`, async () => {
      const { matcher: matcherA, store: storeA } = newMatcher();
      const { matcher: matcherB, store: storeB } = newMatcher();

      const pin = new FXPin();
      if (firstA) {
        pin.while(matcherA).while(matcherB);
      } else {
        pin.while(matcherB).while(matcherA);
      }

      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(false);

      storeA.setState(true);
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(true); // activated

      storeB.setState(true);
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(true); // already activated, so no change

      storeA.setState(false);
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(true); // still activate, since matcherB matches

      storeB.setState(false);
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(false); // deactivated
    });

    test(`already matching: order ${firstA ? 1 : 2}`, async () => {
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

      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(true); // activated

      storeA.setState(false);
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(true); // still activate, since matcherB matches

      storeB.setState(false);
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(false); // deactivated

      storeA.setState(false); // no-op
      storeB.setState(false); // no-op
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(false);

      storeA.setState(true);
      await window.waitFor(0); // callbacks are async
      expect(pin.isActive()).toBe(true); // activated
    });
  }
});

describe("multiple matchers (AND): when", () => {
  test("not matching yet", async () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();
    const { matcher: matcherC, store: storeC } = newMatcher();

    const pin = new FXPin();
    pin.when(matcherA, matcherB, matcherC);

    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);

    storeA.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // not activated yet

    storeC.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // not activated yet

    storeB.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true); // activated

    storeA.setState(false);
    storeB.setState(false);
    storeC.setState(false);
    await window.waitFor(0); // callbacks are async
    // pin is still active, since the condition was one-way (turn ON)
    expect(pin.isActive()).toBe(true);
  });

  test("some matching", async () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();
    const { matcher: matcherC, store: storeC } = newMatcher();
    storeA.setState(true);
    storeC.setState(true);

    const pin = new FXPin();
    pin.when(matcherA, matcherB, matcherC);

    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // not activated yet

    storeB.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true); // activated

    storeA.setState(false);
    storeB.setState(false);
    storeC.setState(false);
    await window.waitFor(0); // callbacks are async
    // pin is still active, since the condition was one-way (turn ON)
    expect(pin.isActive()).toBe(true);
  });

  test("all matching", async () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();
    const { matcher: matcherC, store: storeC } = newMatcher();
    storeA.setState(true);
    storeB.setState(true);
    storeC.setState(true);

    const pin = new FXPin();
    pin.when(matcherA, matcherB, matcherC);

    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true); // activated

    storeA.setState(false);
    storeB.setState(false);
    storeC.setState(false);
    await window.waitFor(0); // callbacks are async
    // pin is still active, since the condition was one-way (turn ON)
    expect(pin.isActive()).toBe(true);
  });
});

describe("multiple matchers (AND): until", () => {
  test("not matching yet", async () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();
    const { matcher: matcherC, store: storeC } = newMatcher();

    const pin = new FXPin();
    pin.until(matcherA, matcherB, matcherC);

    storeA.setState(true);
    storeB.setState(true);
    storeC.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // already deactivated, so no change
  });

  test("all matching", async () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();
    const { matcher: matcherC, store: storeC } = newMatcher();
    storeA.setState(true);
    storeB.setState(true);
    storeC.setState(true);

    const pin = new FXPin();
    pin.until(matcherA, matcherB, matcherC);

    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // already deactivated, so no change
  });
});

describe("multiple matchers (AND): while", () => {
  test("multiple changing states at once", async () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();
    const { matcher: matcherC, store: storeC } = newMatcher();

    const pin = new FXPin();
    pin.while(matcherA, matcherB, matcherC);

    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);

    storeA.setState(true);
    storeB.setState(true);
    storeC.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true); // activated

    storeA.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // deactivated

    storeA.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true); // activated

    storeA.setState(false);
    storeB.setState(false);
    storeC.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // deactivated

    storeA.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // not activated yet

    storeB.setState(true);
    storeC.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true); // activated
  });

  test("not matching yet", async () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();
    const { matcher: matcherC, store: storeC } = newMatcher();

    const pin = new FXPin();
    pin.while(matcherA, matcherB, matcherC);

    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);

    storeA.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // not activated yet

    storeA.setState(true); // no-op
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);

    storeC.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // not activated yet

    storeB.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true); // activated

    storeA.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // deactivated

    storeB.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // already deactivated, so no change

    storeB.setState(false); // no-op
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);

    storeA.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // not activated yet

    storeB.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true); // activated

    storeC.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // deactivated
  });

  test("some matching", async () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();
    const { matcher: matcherC, store: storeC } = newMatcher();
    storeA.setState(true);
    storeC.setState(true);

    const pin = new FXPin();
    pin.while(matcherA, matcherB, matcherC);

    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // not activated yet

    storeB.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true); // activated

    storeA.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // deactivated

    storeA.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true); // activated

    storeC.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // deactivated
  });

  test("all matching", async () => {
    const { matcher: matcherA, store: storeA } = newMatcher();
    const { matcher: matcherB, store: storeB } = newMatcher();
    const { matcher: matcherC, store: storeC } = newMatcher();
    storeA.setState(true);
    storeB.setState(true);
    storeC.setState(true);

    const pin = new FXPin();
    pin.while(matcherA, matcherB, matcherC);

    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true); // activated

    storeB.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // deactivated

    storeB.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(true); // activated

    storeC.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false); // deactivated
  });
});

describe("multiple conditions (OR) with multiple matchers (AND): mix", () => {
  //  XXX TODO
});

describe("with pin", () => {
  test("when", async () => {
    const { matcher, store } = newMatcher();
    expect(matcher.matches()).toBe(false);

    const triggerPin = new FXPin();
    triggerPin.while(matcher);

    const pin = new FXPin();
    pin.when(triggerPin);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);

    store.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(triggerPin.isActive()).toBe(true);
    expect(pin.isActive()).toBe(true); // activated

    store.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(triggerPin.isActive()).toBe(false);
    // pin is still active, since the condition was one-way (turn ON)
    expect(pin.isActive()).toBe(true);
  });

  test("until", async () => {
    const { matcher, store } = newMatcher();
    expect(matcher.matches()).toBe(false);

    const triggerPin = new FXPin();
    triggerPin.while(matcher);

    const pin = new FXPin();
    pin.until(triggerPin);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);

    store.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(triggerPin.isActive()).toBe(true);
    expect(pin.isActive()).toBe(false); // already deactivated, so no change
  });

  test("while", async () => {
    const { matcher, store } = newMatcher();
    expect(matcher.matches()).toBe(false);

    const triggerPin = new FXPin();
    triggerPin.while(matcher);

    const pin = new FXPin();
    pin.while(triggerPin);
    await window.waitFor(0); // callbacks are async
    expect(pin.isActive()).toBe(false);

    store.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(triggerPin.isActive()).toBe(true);
    expect(pin.isActive()).toBe(true); // activated

    store.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(triggerPin.isActive()).toBe(false);
    expect(pin.isActive()).toBe(false); // deactivated
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

    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(0);

    store.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(1);
    expect(cbk).toHaveBeenNthCalledWith(1, true, pin);

    store.setState(true); // no-op
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(1);

    store.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(2);
    expect(cbk).toHaveBeenNthCalledWith(2, false, pin);

    store.setState(false); // no-op
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(2);

    store.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(3);
    expect(cbk).toHaveBeenNthCalledWith(3, true, pin);

    pin.offChange(cbk);
    store.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(3); // no new calls

    store.setState(true);
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
    expect(cbk).toHaveBeenNthCalledWith(1, true, pin);

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
    expect(pin.isActive()).toBe(true);

    storeA.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(2);
    expect(cbk).toHaveBeenNthCalledWith(2, false, pin);

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
    expect(cbk).toHaveBeenNthCalledWith(3, true, pin);

    storeD.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(4);
    expect(cbk).toHaveBeenNthCalledWith(4, false, pin);

    storeA.setState(true);
    storeB.setState(true);
    storeC.setState(true);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(5);
    expect(cbk).toHaveBeenNthCalledWith(5, true, pin);

    pin.offChange(cbk);
    storeA.setState(false);
    storeB.setState(false);
    storeC.setState(false);
    await window.waitFor(0); // callbacks are async
    expect(cbk).toHaveBeenCalledTimes(5); // no new calls
  });
});
