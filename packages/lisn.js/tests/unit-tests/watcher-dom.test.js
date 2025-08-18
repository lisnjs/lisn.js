const { jest, describe, test, expect } = require("@jest/globals");

const { isValidMutationCategory, isValidMutationCategoryList } =
  window.LISN.utils;
const { DOMWatcher } = window.LISN.watchers;

const CATEGORIES = ["added", "removed", "attribute"];

// for convenience we don't use the default config, but set a newly created
// element as the root and subtree to true unless explicitly given
const newWatcherElement = (config = {}) => {
  const callback = jest.fn();

  const rootEl = document.createElement("div");
  rootEl.id = "root";

  if (config.root === undefined) {
    config.root = rootEl;
  }

  if (config.subtree === undefined) {
    config.subtree = true; // it's the default anyway
  }

  const watcher = DOMWatcher.create(config);

  const parentEl = document.createElement("div");
  parentEl.id = "parent";
  const parentElB = document.createElement("div");
  parentElB.id = "parentB";
  const childEl = document.createElement("div");
  childEl.id = "child";

  return { callback, watcher, rootEl, parentEl, parentElB, childEl };
};

test("illegal constructor", () => {
  expect(() => new DOMWatcher()).toThrow(/Illegal constructor/);
});

test("create reusable", () => {
  const defaultConfig = {
    root: document.body,
    subtree: true,
  };
  const watcherA = DOMWatcher.reuse();
  const watcherB = DOMWatcher.reuse(defaultConfig);
  const watcherC = DOMWatcher.reuse({
    root: document.documentElement,
  });
  const watcherD = DOMWatcher.reuse({
    ...defaultConfig,
    root: document.documentElement,
  });

  expect(watcherA).toBeInstanceOf(DOMWatcher);
  expect(watcherA).toBe(watcherB);
  expect(watcherA).not.toBe(watcherC);

  expect(watcherC).toBeInstanceOf(DOMWatcher);
  expect(watcherC).toBe(watcherD);
});

describe("root", () => {
  test("default root", async () => {
    const { callback, watcher, parentEl } = newWatcherElement({
      root: document.body,
    });
    parentEl.id = "default-root-test";
    await watcher.onMutation(callback, { selector: "#default-root-test" });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);

    document.documentElement.append(parentEl); // should be ignored, as root is body
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);

    document.body.append(parentEl);
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1);

    watcher.offMutation(callback);
  });

  test("custom root", async () => {
    const { callback, watcher, rootEl, parentEl } = newWatcherElement();
    parentEl.id = "custom-root-test";
    await watcher.onMutation(callback, { selector: "#custom-root-test" });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);

    document.body.append(parentEl); // should be ignored, as root is "rootEl"
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);

    rootEl.append(parentEl);
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("initial call", () => {
  test("no options", async () => {
    const { callback, watcher, rootEl, parentEl } = newWatcherElement();
    rootEl.append(parentEl);
    await watcher.onMutation(callback);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("+selector", async () => {
    const { callback, watcher, rootEl, parentEl } = newWatcherElement();
    rootEl.append(parentEl);
    await watcher.onMutation(callback, { selector: "#parent" });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      {
        target: parentEl,
        currentTarget: parentEl,
        attributes: new Set(),
        addedTo: rootEl,
        removedFrom: null,
      },
      watcher,
    );
  });

  test("+selector but no 'added' categories", async () => {
    const { callback, watcher, rootEl, parentEl } = newWatcherElement();
    rootEl.append(parentEl);
    await watcher.onMutation(callback, {
      selector: "#parent",
      categories: "attribute,removed",
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("+selector +skipInitial", async () => {
    const { callback, watcher, rootEl, parentEl } = newWatcherElement();
    rootEl.append(parentEl);
    await watcher.onMutation(callback, {
      selector: "#parent",
      skipInitial: true,
    });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("+selector for subsequent callbacks just after observed mutation: v1", async () => {
    const { callback, watcher, rootEl, parentEl, parentElB, childEl } =
      newWatcherElement();
    const callbackB = jest.fn();
    document.body.append(rootEl);

    rootEl.append(childEl); // not observed

    await watcher.onMutation(callback); // activates observer
    rootEl.append(parentEl); // observed

    // Add callback B
    await watcher.onMutation(callbackB, { selector: "div" }); // has a selector => has an initial call

    rootEl.append(parentElB); // observed

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(2); // parent added, parentB added
    expect(callbackB).toHaveBeenCalledTimes(4); // including root and child from initial call

    expect(callbackB).toHaveBeenCalledWith(
      {
        // initial call
        target: childEl,
        currentTarget: childEl,
        attributes: new Set(),
        addedTo: rootEl,
        removedFrom: null,
      },
      watcher,
    );

    expect(callbackB).toHaveBeenCalledWith(
      {
        target: rootEl,
        currentTarget: rootEl,
        attributes: new Set(),
        addedTo: document.body,
        removedFrom: null,
      },
      watcher,
    );

    for (const cbk of [callback, callbackB]) {
      expect(cbk).toHaveBeenCalledWith(
        {
          target: parentEl,
          currentTarget: parentEl,
          attributes: new Set(),
          addedTo: rootEl,
          removedFrom: null,
        },
        watcher,
      );

      expect(cbk).toHaveBeenCalledWith(
        {
          target: parentElB,
          currentTarget: parentElB,
          attributes: new Set(),
          addedTo: rootEl,
          removedFrom: null,
        },
        watcher,
      );
    }
  });
});

describe("duplicate handler", () => {
  test("same options", async () => {
    const { callback, watcher, rootEl, parentEl, parentElB } =
      newWatcherElement();
    rootEl.append(parentEl);
    await Promise.all([
      watcher.onMutation(callback, { selector: "div:not(#root)" }),
      watcher.onMutation(callback, { selector: "div:not(#root)" }),
    ]);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1); // initial call of 2nd one

    await watcher.onMutation(callback, { selector: "div:not(#root)" });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(2); // initial call

    rootEl.append(parentElB);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(3);
  });

  test("different options", async () => {
    const { callback, watcher, rootEl } = newWatcherElement();

    const ul = document.createElement("ul");
    rootEl.append(ul);

    watcher.onMutation(callback, { selector: "p" }); // removed immediately
    await watcher.onMutation(callback, { selector: "ul" });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1); // initial call for ul

    const span = document.createElement("span");
    rootEl.append(span);

    await watcher.onMutation(callback, { selector: "span, p" }); // re-added

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(2); // + initial call for span

    const ul2 = document.createElement("ul");
    rootEl.append(ul2);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(2); // no new calls, ul not matching

    const p = document.createElement("p");
    rootEl.append(p);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(3); // call for p
  });
});

describe("operations", () => {
  test("combining operations", async () => {
    const { callback, watcher, rootEl, parentEl } = newWatcherElement();
    await watcher.onMutation(callback);

    rootEl.append(parentEl); // 1st operation for parentEl
    parentEl.classList.add("parent"); // still in 1st operation
    parentEl.setAttribute("attr", "value"); // still in 1st operation

    await window.waitForMO();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      {
        target: parentEl,
        currentTarget: parentEl,
        attributes: new Set(["class", "attr"]),
        addedTo: rootEl,
        removedFrom: null,
      },
      watcher,
    );
  });

  test("performing mutations prior to onMutation", async () => {
    const { callback, watcher, rootEl, parentEl, childEl } =
      newWatcherElement();
    await watcher.onMutation(callback);

    parentEl.append(childEl); // ignored as parentEl not in rootEl yet
    rootEl.append(parentEl); // 1st operation for parentEl

    await window.waitForMO();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      {
        target: parentEl,
        currentTarget: parentEl,
        attributes: new Set(),
        addedTo: rootEl,
        removedFrom: null,
      },
      watcher,
    );
  });

  test("moving element that was added prior to onMutation: from outside tree", async () => {
    const { callback, watcher, rootEl, parentEl, parentElB, childEl } =
      newWatcherElement();
    await watcher.onMutation(callback);

    parentElB.append(childEl); // ignored as parentElB not in rootEl
    rootEl.append(parentEl); // 1st operation for parentEl

    // 2nd operation: insertion of childEl only as parentElB is not under rootEl
    parentEl.append(childEl);

    await window.waitForMO();

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith(
      {
        target: parentEl,
        currentTarget: parentEl,
        attributes: new Set(),
        addedTo: rootEl,
        removedFrom: null,
      },
      watcher,
    );

    expect(callback).toHaveBeenCalledWith(
      {
        target: childEl,
        currentTarget: childEl,
        attributes: new Set(),
        addedTo: parentEl,
        removedFrom: null,
      },
      watcher,
    );
  });

  test("moving element that was added prior to onMutation: to outside tree", async () => {
    const { callback, watcher, rootEl, parentEl, parentElB, childEl } =
      newWatcherElement();
    await watcher.onMutation(callback);

    parentEl.append(childEl); // ignored as parentEl not in rootEl
    rootEl.append(parentEl); // 1st operation for parentEl

    // 2nd operation: removal of childEl only as parentElB is not under rootEl
    parentElB.append(childEl);

    await window.waitForMO();

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith(
      {
        target: parentEl,
        currentTarget: parentEl,
        attributes: new Set(),
        addedTo: rootEl,
        removedFrom: null,
      },
      watcher,
    );

    expect(callback).toHaveBeenCalledWith(
      {
        target: childEl,
        currentTarget: childEl,
        attributes: new Set(),
        addedTo: null, // adding to parentElB never observed
        removedFrom: parentEl,
      },
      watcher,
    );
  });

  test("moving element that was added prior to onMutation: from/to inside tree", async () => {
    const { callback, watcher, rootEl, parentEl, parentElB, childEl } =
      newWatcherElement();
    await watcher.onMutation(callback);

    parentEl.append(childEl); // ignored as parentEl not in rootEl
    rootEl.append(parentEl); // 1st operation for parentEl
    rootEl.append(parentElB); // 2nd operation for parentElB
    parentElB.append(childEl); // 3rd operation: moving of childEl

    await window.waitForMO();

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenCalledWith(
      {
        target: parentEl,
        currentTarget: parentEl,
        attributes: new Set(),
        addedTo: rootEl,
        removedFrom: null,
      },
      watcher,
    );

    expect(callback).toHaveBeenCalledWith(
      {
        target: parentElB,
        currentTarget: parentElB,
        attributes: new Set(),
        addedTo: rootEl,
        removedFrom: null,
      },
      watcher,
    );

    expect(callback).toHaveBeenCalledWith(
      {
        target: childEl,
        currentTarget: childEl,
        attributes: new Set(),
        addedTo: parentElB,
        removedFrom: parentEl,
      },
      watcher,
    );
  });

  test("overriding previous suboperations", async () => {
    const { callback, watcher, rootEl, parentEl, parentElB } =
      newWatcherElement();
    await watcher.onMutation(callback);

    rootEl.append(parentEl); // 1st operation for parentEl
    rootEl.append(parentElB); // 2nd operation for parentElB
    parentEl.setAttribute("attr", "val"); // still within 1st
    parentEl.setAttribute("attr", "other val"); // still within 1st, overrides
    parentElB.append(parentEl); // still within 1st, overrides

    await window.waitForMO();

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith(
      {
        target: parentEl,
        currentTarget: parentEl,
        attributes: new Set(["attr"]),
        addedTo: parentElB,
        removedFrom: rootEl,
      },
      watcher,
    );

    expect(callback).toHaveBeenCalledWith(
      {
        target: parentElB,
        currentTarget: parentElB,
        attributes: new Set(),
        addedTo: rootEl,
        removedFrom: null,
      },
      watcher,
    );
  });
});

describe("offMutation: immediate", () => {
  // There is no synchronisation between callbacks of same observe type and
  // also MutationObserver does not trigger an initial call, so there's no need
  // to test with adding multiple callbacks and/or waiting for mutation first
  test("basic", async () => {
    const { callback, watcher, rootEl, parentEl, parentElB } =
      newWatcherElement();

    watcher.offMutation(callback); // no-op
    watcher.offMutation(callback); // no-op
    watcher.offMutation(callback); // no-op
    watcher.onMutation(callback);
    watcher.onMutation(callback); // no-op

    rootEl.append(parentEl); // will be ignored

    watcher.offMutation(callback);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);

    rootEl.append(parentElB);
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // no new calls
  });

  test("with initial call and mutations just before and after", async () => {
    const { callback, watcher, rootEl, parentEl, parentElB, childEl } =
      newWatcherElement();
    rootEl.append(parentEl);

    // use selector to enable initial call
    watcher.onMutation(callback, { selector: "div:not(#root)" });

    rootEl.append(parentElB); // will be ignored

    watcher.offMutation(callback);

    rootEl.append(childEl); // will be ignored

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // no new calls

    parentEl.classList.add("parent"); // will be ignored

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // no new calls
  });

  test("with mismatching options", async () => {
    const { callback, watcher, rootEl, parentEl } = newWatcherElement();

    watcher.onMutation(callback, {
      selector: "foo",
      skipInitial: true,
      categories: "added",
    });
    watcher.offMutation(callback);

    rootEl.append(parentEl);
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });
});

describe("categories, including passing as string and array", () => {
  test("invalid", async () => {
    const { callback, watcher } = newWatcherElement();

    await expect(() =>
      watcher.onMutation(callback, {
        categories: "invalid",
      }),
    ).rejects.toThrow(/Invalid value for 'categories'/);

    await expect(() =>
      watcher.onMutation(callback, {
        categories: ["invalid"],
      }),
    ).rejects.toThrow(/Invalid value for 'categories'/);

    await expect(() =>
      watcher.onMutation(callback, {
        categories: false,
      }),
    ).rejects.toThrow(/'categories' must be a string or a string array/);
  });

  test("added", async () => {
    const { callback, watcher, rootEl, parentEl } = newWatcherElement();
    await watcher.onMutation(callback, { categories: "added" });

    rootEl.append(parentEl);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1);

    parentEl.classList.add("parent");

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls

    parentEl.remove();

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
  });

  test("removed", async () => {
    const { callback, watcher, rootEl, parentEl } = newWatcherElement();
    await watcher.onMutation(callback, { categories: "removed" });

    rootEl.append(parentEl);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // no new calls

    parentEl.classList.add("parent");

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // no new calls

    parentEl.remove();

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("added/removed as comma-separated string with spaced", async () => {
    const { callback, watcher, rootEl, parentEl } = newWatcherElement();
    await watcher.onMutation(callback, { categories: " added , removed " });

    rootEl.append(parentEl);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1);

    parentEl.classList.add("parent");

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls

    parentEl.remove();

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("added/removed as array", async () => {
    const { callback, watcher, rootEl, parentEl } = newWatcherElement();
    await watcher.onMutation(callback, { categories: ["added", "removed"] });

    rootEl.append(parentEl);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1);

    parentEl.classList.add("parent");

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls

    parentEl.remove();

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("attribute", async () => {
    const { callback, watcher, rootEl, parentEl } = newWatcherElement();
    await watcher.onMutation(callback, { categories: "attribute" });

    rootEl.append(parentEl);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // no new calls

    parentEl.classList.add("parent");

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1);

    parentEl.remove();

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
  });
});

test("text nodes: ignored", async () => {
  const { callback, watcher, rootEl } = newWatcherElement();
  await watcher.onMutation(callback);

  const node = document.createTextNode("foo");
  rootEl.append(node);

  await window.waitForMO();
  expect(callback).toHaveBeenCalledTimes(0);
});

// blank selectors are already tested as part of the other tests
describe("selector", () => {
  test("top-level match v1", async () => {
    const { callback, watcher, rootEl, parentEl, parentElB, childEl } =
      newWatcherElement();
    await watcher.onMutation(callback, {
      selector: "#parent, #child",
    });

    rootEl.append(parentEl); // match
    rootEl.append(parentElB); // no-match
    parentEl.append(childEl); // match

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenCalledWith(
      {
        target: parentEl,
        currentTarget: parentEl,
        attributes: new Set(),
        addedTo: rootEl,
        removedFrom: null,
      },
      watcher,
    );

    expect(callback).toHaveBeenCalledWith(
      {
        target: parentEl,
        currentTarget: childEl,
        attributes: new Set(),
        addedTo: rootEl,
        removedFrom: null,
      },
      watcher,
    );

    expect(callback).toHaveBeenCalledWith(
      {
        target: childEl,
        currentTarget: childEl,
        attributes: new Set(),
        addedTo: parentEl,
        removedFrom: null,
      },
      watcher,
    );
  });

  test("top-level match v2", async () => {
    const { callback, watcher, rootEl, parentEl, parentElB, childEl } =
      newWatcherElement();
    await watcher.onMutation(callback, {
      selector: "#parent, #child",
    });

    rootEl.append(parentEl); // match
    rootEl.append(parentElB); // no-match

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      {
        target: parentEl,
        currentTarget: parentEl,
        attributes: new Set(),
        addedTo: rootEl,
        removedFrom: null,
      },
      watcher,
    );

    parentEl.append(childEl); // match

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith(
      {
        target: childEl,
        currentTarget: childEl,
        attributes: new Set(),
        addedTo: parentEl,
        removedFrom: null,
      },
      watcher,
    );
  });

  test("deep match", async () => {
    const { callback, watcher, rootEl, parentEl, parentElB, childEl } =
      newWatcherElement();
    await watcher.onMutation(callback, {
      selector: "#parent > #child",
    });

    parentEl.append(childEl); // no match as not yet in DOM
    rootEl.append(parentElB); // no-match
    rootEl.append(parentEl); // deep match

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      {
        target: parentEl,
        currentTarget: childEl,
        attributes: new Set(),
        addedTo: rootEl,
        removedFrom: null,
      },
      watcher,
    );
  });
});

describe("target", () => {
  test("top-level match", async () => {
    const { callback, watcher, rootEl, parentEl, parentElB } =
      newWatcherElement();
    await watcher.onMutation(callback, {
      target: parentEl,
      currentTarget: parentEl,
    });

    rootEl.append(parentEl); // match
    rootEl.append(parentElB); // no-match

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      {
        target: parentEl,
        currentTarget: parentEl,
        attributes: new Set(),
        addedTo: rootEl,
        removedFrom: null,
      },
      watcher,
    );
  });

  test("deep match", async () => {
    const { callback, watcher, rootEl, parentEl, parentElB, childEl } =
      newWatcherElement();
    await watcher.onMutation(callback, {
      target: childEl,
      currentTarget: childEl,
    });

    parentEl.append(childEl); // no match as not yet in DOM
    rootEl.append(parentElB); // no-match
    rootEl.append(parentEl); // deep match

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      {
        target: parentEl,
        currentTarget: childEl,
        attributes: new Set(),
        addedTo: rootEl,
        removedFrom: null,
      },
      watcher,
    );
  });
});

describe("ignoring operations", () => {
  test("ignoring move to element outside root: match", async () => {
    const { callback, watcher, rootEl, parentEl, parentElB } =
      newWatcherElement();

    rootEl.append(parentEl);
    await watcher.onMutation(callback);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial (no selector)

    // to: parentElB is a match because parentEl's new parent is parentElB,
    // even though it's not in root
    watcher.ignoreMove(parentEl, { from: rootEl, to: parentElB });

    parentElB.append(parentEl);
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // ignored
  });

  test("ignoring move to element outside root: mismatch v1", async () => {
    const { callback, watcher, rootEl, parentEl, parentElB, childEl } =
      newWatcherElement();

    rootEl.append(parentEl);
    await watcher.onMutation(callback);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    // to: childEl is not a match because parentEl's new parent is parentElB,
    // even though neither parentElB nor childEl are in root
    watcher.ignoreMove(parentEl, { from: rootEl, to: childEl });

    parentElB.append(parentEl);
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("ignoring move to element outside root: mismatch v2", async () => {
    const { callback, watcher, rootEl, parentEl, parentElB } =
      newWatcherElement();

    rootEl.append(parentEl);
    await watcher.onMutation(callback);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    // to: null is not a match because parentEl's new parent is not null, even
    // though it's not in root
    watcher.ignoreMove(parentEl, { from: rootEl });

    parentElB.append(parentEl);
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("ignoring move from element outside root: match v1", async () => {
    const { callback, watcher, rootEl, parentEl } = newWatcherElement();

    document.body.append(parentEl); // not observed
    await watcher.onMutation(callback);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    // from: null is a match, even though parentEl's old parent was
    // document.body, because parentEl's previous parent was not observed
    watcher.ignoreMove(parentEl, { to: rootEl });

    rootEl.append(parentEl);
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // ignored
  });

  test("ignoring move from element outside root: match v2", async () => {
    const { callback, watcher, rootEl, parentEl } = newWatcherElement();

    document.body.append(parentEl); // not observed
    await watcher.onMutation(callback);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    // from: document.body is a match, because it is treated as from: null
    // because document.body is not in root
    watcher.ignoreMove(parentEl, { to: rootEl, from: document.body });

    rootEl.append(parentEl);
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // ignored
  });

  test("ignoring move from element outside root: match v3", async () => {
    const { callback, watcher, rootEl, parentEl, childEl } =
      newWatcherElement();

    document.body.append(parentEl); // not observed
    await watcher.onMutation(callback);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    // from: childEl is a match, because it is treated as from: null
    // because childEl is not in root
    watcher.ignoreMove(parentEl, { to: rootEl, from: childEl });

    rootEl.append(parentEl);
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // ignored
  });

  test("ignoring move from element outside root: mismatch", async () => {
    const { callback, watcher, rootEl, parentEl, childEl } =
      newWatcherElement();

    rootEl.append(childEl);
    document.body.append(parentEl); // not observed
    await watcher.onMutation(callback);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    // from: childEl is not a match, because childEl is in root
    watcher.ignoreMove(parentEl, { to: rootEl, from: childEl });

    rootEl.append(parentEl);
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("ignoring move from/to elements in root: match", async () => {
    const { callback, watcher, rootEl, parentEl, parentElB } =
      newWatcherElement();

    rootEl.append(parentEl);
    rootEl.append(parentElB);
    await watcher.onMutation(callback);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    // to: parentElB is a match because parentEl's new parent is parentElB
    watcher.ignoreMove(parentEl, { from: rootEl, to: parentElB });

    parentElB.append(parentEl);
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // ignored
  });

  test("ignoring move from/to elements in root: mismatch", async () => {
    const { callback, watcher, rootEl, parentEl, parentElB } =
      newWatcherElement();

    rootEl.append(parentEl);
    rootEl.append(parentElB);
    await watcher.onMutation(callback);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    // to: null is not a match because parentEl's new parent is parentElB
    watcher.ignoreMove(parentEl, { from: rootEl });

    parentElB.append(parentEl);
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("ignoring remove: match", async () => {
    const { callback, watcher, rootEl, parentEl } = newWatcherElement();

    rootEl.append(parentEl);
    await watcher.onMutation(callback);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    watcher.ignoreMove(parentEl, { from: rootEl });

    parentEl.remove();
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // ignored
  });

  test("ignoring remove: mismatch v1", async () => {
    const { callback, watcher, rootEl, parentEl } = newWatcherElement();

    rootEl.append(parentEl);
    await watcher.onMutation(callback);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    // to: document.body is not a match, even though document.body is in root,
    // because parentEl's new parent is null
    watcher.ignoreMove(parentEl, { from: rootEl, to: document.body });

    parentEl.remove();
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("ignoring remove: mismatch v2", async () => {
    const { callback, watcher, rootEl, parentEl, childEl } =
      newWatcherElement();

    rootEl.append(parentEl);
    await watcher.onMutation(callback);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    // to: childEl is not a match, even though childEl is in root, because
    // parentEl's new parent is null
    watcher.ignoreMove(parentEl, { from: rootEl, to: childEl });

    parentEl.remove();
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("ignoring adding: match v1", async () => {
    const { callback, watcher, rootEl, parentEl } = newWatcherElement();

    await watcher.onMutation(callback);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    watcher.ignoreMove(parentEl, { to: rootEl });

    rootEl.append(parentEl);
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // ignored
  });

  test("ignoring adding: match v2", async () => {
    const { callback, watcher, rootEl, parentEl } = newWatcherElement();

    await watcher.onMutation(callback);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    // from: document.body is a match, because it is treated as from: null
    // because document.body is not in root
    watcher.ignoreMove(parentEl, { to: rootEl, from: document.body });

    rootEl.append(parentEl);
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // ignored
  });

  test("ignoring adding: mismatch", async () => {
    const { callback, watcher, rootEl, parentEl, childEl } =
      newWatcherElement();

    rootEl.append(childEl);
    await watcher.onMutation(callback);

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0); // skipped initial

    // from: childEl is not a match, because childEl is in root
    watcher.ignoreMove(parentEl, { to: rootEl, from: childEl });

    rootEl.append(parentEl);
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("ignoring move: multiple watchers", async () => {
    const A = newWatcherElement();

    const B = newWatcherElement();

    A.rootEl.append(B.parentEl);
    await A.watcher.onMutation(A.callback);
    await B.watcher.onMutation(B.callback);

    await window.waitForMO();
    expect(A.callback).toHaveBeenCalledTimes(0); // skipped initial
    expect(B.callback).toHaveBeenCalledTimes(0); // skipped initial

    A.watcher.ignoreMove(B.parentEl, { from: A.rootEl, to: B.rootEl });

    B.rootEl.append(B.parentEl);
    await window.waitForMO();
    expect(A.callback).toHaveBeenCalledTimes(0); // ignored
    expect(B.callback).toHaveBeenCalledTimes(0); // ignored
  });

  test("initial call: ignoring move", async () => {
    const { callback, watcher, rootEl, parentEl } = newWatcherElement();

    watcher.ignoreMove(parentEl, { to: rootEl });
    rootEl.append(parentEl);
    await watcher.onMutation(callback, { selector: "#parent" });

    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(0);
  });
});

describe("cleanup on removal", () => {
  test("removing immediately", async () => {
    const { callback, watcher, rootEl } = newWatcherElement();

    watcher.onMutation(callback);
    watcher.offMutation(callback);

    await window.waitFor(10);
    expect(window.MutationObserver.instances.get(rootEl)?.size || 0).toBe(0);
  });

  test("multiple callbacks, same observe type", async () => {
    const { callback, watcher, rootEl, parentEl, parentElB } =
      newWatcherElement();
    const callbackB = jest.fn();

    expect(window.MutationObserver.instances.get(rootEl)?.size || 0).toBe(0);

    await watcher.onMutation(callback);
    await watcher.onMutation(callbackB); // same watcher

    await window.waitForMO();
    const observers = window.MutationObserver.instances.get(rootEl);
    expect(observers.size).toBe(2); // childList and attributes

    for (const observer of observers) {
      expect(observer.targets.size).toBe(1);
    }

    // remove callback B
    watcher.offMutation(callbackB);

    rootEl.append(parentEl);
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callbackB).toHaveBeenCalledTimes(0); // no new calls

    for (const observer of observers) {
      expect(observer.targets.size).toBe(1);
    }

    // remove callback A
    watcher.offMutation(callback);

    rootEl.append(parentElB);
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(0); // no new calls

    for (const observer of observers) {
      expect(observer.targets.size).toBe(0); // should have been unobserved
    }

    expect(window.MutationObserver.instances.get(rootEl)?.size || 0).toBe(0);
  });

  test("multiple callbacks, different observe type", async () => {
    const { callback, watcher, rootEl, parentEl, parentElB } =
      newWatcherElement();
    const callbackB = jest.fn();

    expect(window.MutationObserver.instances.get(rootEl)?.size || 0).toBe(0);

    await watcher.onMutation(callback);
    await watcher.onMutation(callbackB, { categories: "added,removed" }); // same watcher

    await window.waitForMO();
    const observers = window.MutationObserver.instances.get(rootEl);
    expect(observers.size).toBe(2); // childList and attributes

    for (const observer of observers) {
      expect(observer.targets.size).toBe(1);
    }

    // remove callback B
    watcher.offMutation(callbackB);

    rootEl.append(parentEl);
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callbackB).toHaveBeenCalledTimes(0); // no new calls

    for (const observer of observers) {
      expect(observer.targets.size).toBe(1);
    }

    // remove callback A
    watcher.offMutation(callback);

    rootEl.append(parentElB);
    await window.waitForMO();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(0); // no new calls

    for (const observer of observers) {
      expect(observer.targets.size).toBe(0); // should have been unobserved
    }

    expect(window.MutationObserver.instances.get(rootEl)?.size || 0).toBe(0);
  });
});

describe("isValidMutationCategory", () => {
  for (const category of CATEGORIES) {
    test(category, () => {
      expect(isValidMutationCategory(category)).toBe(true);
    });
  }

  test("invalid", () => {
    expect(isValidMutationCategory("added,removed")).toBe(false);
    expect(isValidMutationCategory("")).toBe(false);
    expect(isValidMutationCategory(" ")).toBe(false);
    expect(isValidMutationCategory(" , ")).toBe(false);
    expect(isValidMutationCategory("random")).toBe(false);
  });
});

describe("isValidMutationCategoryList", () => {
  for (const category of CATEGORIES) {
    test(category, () => {
      expect(isValidMutationCategoryList(category)).toBe(true);
    });
  }

  test("multiple", () => {
    expect(isValidMutationCategoryList("added,removed")).toBe(true);
    expect(isValidMutationCategoryList(["added"], ["removed"])).toBe(true);
  });

  test("invalid", () => {
    expect(isValidMutationCategoryList([])).toBe(false);
    expect(isValidMutationCategoryList([""])).toBe(false);
    expect(isValidMutationCategoryList("")).toBe(false);
    expect(isValidMutationCategoryList(" ")).toBe(false);
    expect(isValidMutationCategoryList(" , ")).toBe(false);
    expect(isValidMutationCategoryList("random")).toBe(false);
  });
});
