const { jest, describe, test, expect } = require("@jest/globals");

const { Callback } = window.LISN.modules;
const { Pager } = window.LISN.widgets;

const newPager = async (numPages = 4, config = {}) => {
  const element = document.createElement("div");
  for (let i = 0; i < numPages; i++) {
    element.append(document.createElement("div"));
  }

  document.body.append(element);

  const pager = new Pager(element, config);
  const pages = pager.getPages();

  await window.waitFor(400);

  expect(pages).toEqual([...element.children]);

  const initialPage = config.initialPage ?? 1;
  expect(pager.getCurrentPageNum()).toBe(initialPage);
  expect(pager.getPreviousPageNum()).toBe(initialPage);
  expect(pager.getCurrentPage()).toBe(pages[initialPage - 1]);
  expect(pager.getPreviousPage()).toBe(pages[initialPage - 1]);

  for (let i = 0; i < pages.length; i++) {
    pages[i].classList.add("page-" + (i + 1)); // for easier identifying in log msgs
    expect(pages[i].dataset.lisnPageState).toEqual(
      i + 1 === initialPage ? "current" : "next",
    );
    expect(pager.isPageDisabled(i + 1)).toBe(false);
    expect(pager.getPages()[i]).toBe(pages[i]);
  }

  return { pager, element, pages };
};

describe("basic", () => {
  test("all default", async () => {
    const { element, pages } = await newPager(4);

    expect(element.classList.contains("lisn-pager__root")).toBe(true);
    for (const page of pages) {
      expect(page.dataset.lisnPageState).toBeTruthy();
    }
  });

  test("initial page", async () => {
    const { element, pages } = await newPager(4, { initialPage: 2 });

    expect(element.classList.contains("lisn-pager__root")).toBe(true);
    for (const page of pages) {
      expect(page.dataset.lisnPageState).toBeTruthy();
    }
  });

  test("no pages", () => {
    const element = document.createElement("div");
    document.body.append(element);

    expect(() => new Pager(element)).toThrow(
      /Pager must have more than 1 page/,
    );
  });

  test("one page", () => {
    const element = document.createElement("div");
    element.append(document.createElement("div"));
    document.body.append(element);

    expect(() => new Pager(element)).toThrow(
      /Pager must have more than 1 page/,
    );
  });

  test("outside page", () => {
    const element = document.createElement("div");
    element.append(document.createElement("div"));
    document.body.append(element);

    expect(
      () =>
        new Pager(element, {
          pages: [...element.children, document.createElement("div")],
        }),
    ).toThrow(/Pager's pages must be its descendants/);
  });
});

describe("re-creating and items auto-discovery", () => {
  for (const doAwait of [true, false]) {
    test(`with${doAwait ? "" : "out"} awaiting`, async () => {
      const element = document.createElement("div");
      const pages = [];
      const toggles = [];
      const switches = [];

      const pagesTagged = [];
      const togglesTagged = [];
      const switchesTagged = [];

      for (let i = 0; i < 4; i++) {
        const pageEl = document.createElement("div");
        const toggleEl = document.createElement("div");
        const switchEl = document.createElement("div");
        element.append(pageEl);
        element.append(toggleEl);
        element.append(switchEl);

        pages.push(pageEl);
        toggles.push(toggleEl);
        switches.push(switchEl);

        if (i % 2) {
          pagesTagged.push(pageEl);
          pageEl.classList.add("lisn-pager-page");

          togglesTagged.push(toggleEl);
          toggleEl.classList.add("lisn-pager-toggle");

          switchesTagged.push(switchEl);
          switchEl.classList.add("lisn-pager-switch");
        }
      }

      const pagerA = new Pager(element, { pages, toggles, switches });
      const pagesFoundA = pagerA.getPages();
      const togglesFoundA = pagerA.getToggles();
      const switchesFoundA = pagerA.getSwitches();

      if (doAwait) {
        await window.waitFor(400);
      }

      // re-create using auto-discovered items for 2nd one
      const pagerB = new Pager(element);
      const pagesFoundB = pagerB.getPages();
      const togglesFoundB = pagerB.getToggles();
      const switchesFoundB = pagerB.getSwitches();

      expect(pagesFoundA).toEqual(pages);
      expect(togglesFoundA).toEqual(toggles);
      expect(switchesFoundA).toEqual(switches);

      expect(pagesFoundB).toEqual(pagesTagged);
      expect(togglesFoundB).toEqual(togglesTagged);
      expect(switchesFoundB).toEqual(switchesTagged);

      await window.waitFor(400);
      for (const [collection, tagged] of [
        [pages, pagesTagged],
        [toggles, togglesTagged],
        [switches, switchesTagged],
      ]) {
        for (const el of collection) {
          if (tagged.includes(el)) {
            expect(
              el.dataset.lisnPageState === "current" ||
                el.dataset.lisnPageState === "next",
            ).toBe(true);
          } else {
            expect(el.dataset.lisnPageState).not.toBeTruthy();
          }
        }
      }
    });
  }
});

describe("transitioning pages", () => {
  test("goToPage", async () => {
    const { pager, pages } = await newPager(3);

    await pager.goToPage(3);

    expect(pager.getCurrentPageNum()).toBe(3);
    expect(pager.getCurrentPage()).toBe(pages[2]);
    expect(pager.getPreviousPageNum()).toBe(1);
    expect(pager.getPreviousPage()).toBe(pages[0]);

    expect(pages[0].dataset.lisnPageState).toEqual("covered");
    expect(pages[1].dataset.lisnPageState).toEqual("covered");
    expect(pages[2].dataset.lisnPageState).toEqual("current");

    await pager.goToPage(1);

    expect(pager.getCurrentPageNum()).toBe(1);
    expect(pager.getCurrentPage()).toBe(pages[0]);
    expect(pager.getPreviousPageNum()).toBe(3);
    expect(pager.getPreviousPage()).toBe(pages[2]);

    expect(pages[0].dataset.lisnPageState).toEqual("current");
    expect(pages[1].dataset.lisnPageState).toEqual("next");
    expect(pages[2].dataset.lisnPageState).toEqual("next");

    await pager.goToPage(3.1); // ignored as not an int

    expect(pager.getCurrentPageNum()).toBe(1);
    expect(pager.getCurrentPage()).toBe(pages[0]);
    expect(pager.getPreviousPageNum()).toBe(3);
    expect(pager.getPreviousPage()).toBe(pages[2]);

    expect(pages[0].dataset.lisnPageState).toEqual("current");
    expect(pages[1].dataset.lisnPageState).toEqual("next");
    expect(pages[2].dataset.lisnPageState).toEqual("next");

    await pager.goToPage(4); // ignored as out of bounds

    expect(pager.getCurrentPageNum()).toBe(1);
    expect(pager.getCurrentPage()).toBe(pages[0]);
    expect(pager.getPreviousPageNum()).toBe(3);
    expect(pager.getPreviousPage()).toBe(pages[2]);

    expect(pages[0].dataset.lisnPageState).toEqual("current");
    expect(pages[1].dataset.lisnPageState).toEqual("next");
    expect(pages[2].dataset.lisnPageState).toEqual("next");

    await pager.goToPage(0); // ignored as out of bounds

    expect(pager.getCurrentPageNum()).toBe(1);
    expect(pager.getCurrentPage()).toBe(pages[0]);
    expect(pager.getPreviousPageNum()).toBe(3);
    expect(pager.getPreviousPage()).toBe(pages[2]);

    expect(pages[0].dataset.lisnPageState).toEqual("current");
    expect(pages[1].dataset.lisnPageState).toEqual("next");
    expect(pages[2].dataset.lisnPageState).toEqual("next");

    await pager.disablePage(3);
    await pager.goToPage(3); // ignored as disabled

    expect(pager.getCurrentPageNum()).toBe(1);
    expect(pager.getCurrentPage()).toBe(pages[0]);
    expect(pager.getPreviousPageNum()).toBe(3);
    expect(pager.getPreviousPage()).toBe(pages[2]);

    expect(pages[0].dataset.lisnPageState).toEqual("current");
    expect(pages[1].dataset.lisnPageState).toEqual("next");
    expect(pages[2].dataset.lisnPageState).toEqual("disabled");
  });

  test("goToPage, skipping over disabled", async () => {
    const { pager, pages } = await newPager(3);

    await pager.disablePage(2);
    await pager.goToPage(3);

    expect(pager.getCurrentPageNum()).toBe(3);
    expect(pager.getCurrentPage()).toBe(pages[2]);
    expect(pager.getPreviousPageNum()).toBe(1);
    expect(pager.getPreviousPage()).toBe(pages[0]);

    expect(pages[0].dataset.lisnPageState).toEqual("covered");
    expect(pages[1].dataset.lisnPageState).toEqual("disabled");
    expect(pages[2].dataset.lisnPageState).toEqual("current");
  });

  test("nextPage or prevPage", async () => {
    const { pager, pages } = await newPager(3);

    await pager.nextPage();

    expect(pager.getCurrentPageNum()).toBe(2);
    expect(pager.getCurrentPage()).toBe(pages[1]);
    expect(pager.getPreviousPageNum()).toBe(1);
    expect(pager.getPreviousPage()).toBe(pages[0]);

    expect(pages[0].dataset.lisnPageState).toEqual("covered");
    expect(pages[1].dataset.lisnPageState).toEqual("current");
    expect(pages[2].dataset.lisnPageState).toEqual("next");

    await pager.nextPage();

    expect(pager.getCurrentPageNum()).toBe(3);
    expect(pager.getCurrentPage()).toBe(pages[2]);
    expect(pager.getPreviousPageNum()).toBe(2);
    expect(pager.getPreviousPage()).toBe(pages[1]);

    expect(pages[0].dataset.lisnPageState).toEqual("covered");
    expect(pages[1].dataset.lisnPageState).toEqual("covered");
    expect(pages[2].dataset.lisnPageState).toEqual("current");

    await pager.nextPage(); // ignored as current is last

    expect(pager.getCurrentPageNum()).toBe(3);
    expect(pager.getCurrentPage()).toBe(pages[2]);
    expect(pager.getPreviousPageNum()).toBe(2);
    expect(pager.getPreviousPage()).toBe(pages[1]);

    expect(pages[0].dataset.lisnPageState).toEqual("covered");
    expect(pages[1].dataset.lisnPageState).toEqual("covered");
    expect(pages[2].dataset.lisnPageState).toEqual("current");

    await pager.prevPage();

    expect(pager.getCurrentPageNum()).toBe(2);
    expect(pager.getCurrentPage()).toBe(pages[1]);
    expect(pager.getPreviousPageNum()).toBe(3);
    expect(pager.getPreviousPage()).toBe(pages[2]);

    expect(pages[0].dataset.lisnPageState).toEqual("covered");
    expect(pages[1].dataset.lisnPageState).toEqual("current");
    expect(pages[2].dataset.lisnPageState).toEqual("next");

    await pager.prevPage();

    expect(pager.getCurrentPageNum()).toBe(1);
    expect(pager.getCurrentPage()).toBe(pages[0]);
    expect(pager.getPreviousPageNum()).toBe(2);
    expect(pager.getPreviousPage()).toBe(pages[1]);

    expect(pages[0].dataset.lisnPageState).toEqual("current");
    expect(pages[1].dataset.lisnPageState).toEqual("next");
    expect(pages[2].dataset.lisnPageState).toEqual("next");

    await pager.prevPage(); // ignored as current is first

    expect(pager.getCurrentPageNum()).toBe(1);
    expect(pager.getCurrentPage()).toBe(pages[0]);
    expect(pager.getPreviousPageNum()).toBe(2);
    expect(pager.getPreviousPage()).toBe(pages[1]);

    expect(pages[0].dataset.lisnPageState).toEqual("current");
    expect(pages[1].dataset.lisnPageState).toEqual("next");
    expect(pages[2].dataset.lisnPageState).toEqual("next");
  });

  for (const horizontal of [true, false]) {
    test(`using gesture (horizontal: ${horizontal}, alignGestureDirection false)`, async () => {
      const { pager, element, pages } = await newPager(3, { horizontal });

      element.dispatchEvent(window.newKeyDown("Down"));
      await window.waitFor(400);

      expect(pager.getCurrentPageNum()).toBe(2);
      expect(pager.getCurrentPage()).toBe(pages[1]);
      expect(pager.getPreviousPageNum()).toBe(1);
      expect(pager.getPreviousPage()).toBe(pages[0]);

      expect(pages[0].dataset.lisnPageState).toEqual("covered");
      expect(pages[1].dataset.lisnPageState).toEqual("current");
      expect(pages[2].dataset.lisnPageState).toEqual("next");

      element.dispatchEvent(window.newKeyDown("Right"));
      await window.waitFor(400);

      expect(pager.getCurrentPageNum()).toBe(3);
      expect(pager.getCurrentPage()).toBe(pages[2]);
      expect(pager.getPreviousPageNum()).toBe(2);
      expect(pager.getPreviousPage()).toBe(pages[1]);

      expect(pages[0].dataset.lisnPageState).toEqual("covered");
      expect(pages[1].dataset.lisnPageState).toEqual("covered");
      expect(pages[2].dataset.lisnPageState).toEqual("current");

      element.dispatchEvent(window.newKeyDown("Down")); // ignored as current is last
      await window.waitFor(400);

      expect(pager.getCurrentPageNum()).toBe(3);
      expect(pager.getCurrentPage()).toBe(pages[2]);
      expect(pager.getPreviousPageNum()).toBe(2);
      expect(pager.getPreviousPage()).toBe(pages[1]);

      expect(pages[0].dataset.lisnPageState).toEqual("covered");
      expect(pages[1].dataset.lisnPageState).toEqual("covered");
      expect(pages[2].dataset.lisnPageState).toEqual("current");

      element.dispatchEvent(window.newKeyDown("Up"));
      await window.waitFor(400);

      expect(pager.getCurrentPageNum()).toBe(2);
      expect(pager.getCurrentPage()).toBe(pages[1]);
      expect(pager.getPreviousPageNum()).toBe(3);
      expect(pager.getPreviousPage()).toBe(pages[2]);

      expect(pages[0].dataset.lisnPageState).toEqual("covered");
      expect(pages[1].dataset.lisnPageState).toEqual("current");
      expect(pages[2].dataset.lisnPageState).toEqual("next");

      element.dispatchEvent(window.newKeyDown("Left"));
      await window.waitFor(400);

      expect(pager.getCurrentPageNum()).toBe(1);
      expect(pager.getCurrentPage()).toBe(pages[0]);
      expect(pager.getPreviousPageNum()).toBe(2);
      expect(pager.getPreviousPage()).toBe(pages[1]);

      expect(pages[0].dataset.lisnPageState).toEqual("current");
      expect(pages[1].dataset.lisnPageState).toEqual("next");
      expect(pages[2].dataset.lisnPageState).toEqual("next");

      element.dispatchEvent(window.newKeyDown("Up")); // ignored as current is first
      await window.waitFor(400);

      expect(pager.getCurrentPageNum()).toBe(1);
      expect(pager.getCurrentPage()).toBe(pages[0]);
      expect(pager.getPreviousPageNum()).toBe(2);
      expect(pager.getPreviousPage()).toBe(pages[1]);

      expect(pages[0].dataset.lisnPageState).toEqual("current");
      expect(pages[1].dataset.lisnPageState).toEqual("next");
      expect(pages[2].dataset.lisnPageState).toEqual("next");
    });
  }

  for (const horizontal of [true, false]) {
    test(`using gesture (horizontal: ${horizontal}, alignGestureDirection true)`, async () => {
      const { pager, element, pages } = await newPager(3, {
        horizontal,
        alignGestureDirection: true,
      });

      element.dispatchEvent(window.newKeyDown(horizontal ? "Right" : "Down"));
      await window.waitFor(400);

      expect(pager.getCurrentPageNum()).toBe(2);
      expect(pager.getCurrentPage()).toBe(pages[1]);
      expect(pager.getPreviousPageNum()).toBe(1);
      expect(pager.getPreviousPage()).toBe(pages[0]);

      expect(pages[0].dataset.lisnPageState).toEqual("covered");
      expect(pages[1].dataset.lisnPageState).toEqual("current");
      expect(pages[2].dataset.lisnPageState).toEqual("next");

      element.dispatchEvent(window.newKeyDown(horizontal ? "Down" : "Right")); // no matching direction
      await window.waitFor(400);

      expect(pager.getCurrentPageNum()).toBe(2);
      expect(pager.getCurrentPage()).toBe(pages[1]);
      expect(pager.getPreviousPageNum()).toBe(1);
      expect(pager.getPreviousPage()).toBe(pages[0]);

      expect(pages[0].dataset.lisnPageState).toEqual("covered");
      expect(pages[1].dataset.lisnPageState).toEqual("current");
      expect(pages[2].dataset.lisnPageState).toEqual("next");

      element.dispatchEvent(window.newKeyDown(horizontal ? "Right" : "Down"));
      await window.waitFor(400);

      expect(pager.getCurrentPageNum()).toBe(3);
      expect(pager.getCurrentPage()).toBe(pages[2]);
      expect(pager.getPreviousPageNum()).toBe(2);
      expect(pager.getPreviousPage()).toBe(pages[1]);

      expect(pages[0].dataset.lisnPageState).toEqual("covered");
      expect(pages[1].dataset.lisnPageState).toEqual("covered");
      expect(pages[2].dataset.lisnPageState).toEqual("current");

      element.dispatchEvent(window.newKeyDown(horizontal ? "Right" : "Down")); // ignored as current is last
      await window.waitFor(400);

      expect(pager.getCurrentPageNum()).toBe(3);
      expect(pager.getCurrentPage()).toBe(pages[2]);
      expect(pager.getPreviousPageNum()).toBe(2);
      expect(pager.getPreviousPage()).toBe(pages[1]);

      expect(pages[0].dataset.lisnPageState).toEqual("covered");
      expect(pages[1].dataset.lisnPageState).toEqual("covered");
      expect(pages[2].dataset.lisnPageState).toEqual("current");

      element.dispatchEvent(window.newKeyDown(horizontal ? "Left" : "Up"));
      await window.waitFor(400);

      expect(pager.getCurrentPageNum()).toBe(2);
      expect(pager.getCurrentPage()).toBe(pages[1]);
      expect(pager.getPreviousPageNum()).toBe(3);
      expect(pager.getPreviousPage()).toBe(pages[2]);

      expect(pages[0].dataset.lisnPageState).toEqual("covered");
      expect(pages[1].dataset.lisnPageState).toEqual("current");
      expect(pages[2].dataset.lisnPageState).toEqual("next");

      element.dispatchEvent(window.newKeyDown(horizontal ? "Up" : "Left")); // no matching direction
      await window.waitFor(400);

      expect(pager.getCurrentPageNum()).toBe(2);
      expect(pager.getCurrentPage()).toBe(pages[1]);
      expect(pager.getPreviousPageNum()).toBe(3);
      expect(pager.getPreviousPage()).toBe(pages[2]);

      expect(pages[0].dataset.lisnPageState).toEqual("covered");
      expect(pages[1].dataset.lisnPageState).toEqual("current");
      expect(pages[2].dataset.lisnPageState).toEqual("next");

      element.dispatchEvent(window.newKeyDown(horizontal ? "Left" : "Up"));
      await window.waitFor(400);

      expect(pager.getCurrentPageNum()).toBe(1);
      expect(pager.getCurrentPage()).toBe(pages[0]);
      expect(pager.getPreviousPageNum()).toBe(2);
      expect(pager.getPreviousPage()).toBe(pages[1]);

      expect(pages[0].dataset.lisnPageState).toEqual("current");
      expect(pages[1].dataset.lisnPageState).toEqual("next");
      expect(pages[2].dataset.lisnPageState).toEqual("next");

      element.dispatchEvent(window.newKeyDown(horizontal ? "Left" : "Up")); // ignored as current is first
      await window.waitFor(400);

      expect(pager.getCurrentPageNum()).toBe(1);
      expect(pager.getCurrentPage()).toBe(pages[0]);
      expect(pager.getPreviousPageNum()).toBe(2);
      expect(pager.getPreviousPage()).toBe(pages[1]);

      expect(pages[0].dataset.lisnPageState).toEqual("current");
      expect(pages[1].dataset.lisnPageState).toEqual("next");
      expect(pages[2].dataset.lisnPageState).toEqual("next");
    });
  }

  test("onTransition", async () => {
    const { pager } = await newPager(3);

    let oldPage, currPage;
    const callback = jest.fn((pager) => {
      oldPage = pager.getPreviousPageNum();
      currPage = pager.getCurrentPageNum();
    });

    pager.onTransition(callback);
    expect(callback).toHaveBeenCalledTimes(0);

    await pager.goToPage(3);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(pager);
    expect(oldPage).toBe(1);
    expect(currPage).toBe(3);

    await pager.goToPage(2);

    expect(callback).toHaveBeenCalledTimes(2);
    expect(oldPage).toBe(3);
    expect(currPage).toBe(2);

    // without awaiting
    pager.goToPage(1); // +1 call
    pager.goToPage(2); // +1 call
    await window.waitForAF();
    expect(callback).toHaveBeenCalledTimes(4);
  });

  test("offTransition", async () => {
    const { pager } = await newPager(3);

    const callback = jest.fn();

    pager.onTransition(callback);
    pager.offTransition(callback);

    pager.goToPage(3); // concurrent
    pager.goToPage(2); // concurrent
    await pager.goToPage(1);

    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("offTransition: callback.remove", async () => {
    const { pager } = await newPager(3);

    const callbackJ = jest.fn();
    const callback = Callback.wrap(callbackJ);

    pager.onTransition(callback);
    callback.remove();

    pager.goToPage(3); // concurrent
    pager.goToPage(2); // concurrent
    await pager.goToPage(1);

    expect(callbackJ).toHaveBeenCalledTimes(0);
  });

  test("offTransition: return Callback.REMOVE", async () => {
    const { pager } = await newPager(3);

    const callback = jest.fn(() => Callback.REMOVE);

    pager.onTransition(callback);

    pager.goToPage(3); // concurrent
    pager.goToPage(2); // concurrent
    await pager.goToPage(1);

    expect(callback).toHaveBeenCalledTimes(1); // removed after 1st time
  });
});

describe("disabling pages", () => {
  test("disabling first page", async () => {
    const { pager, pages } = await newPager(3);

    await pager.nextPage();

    expect(pager.getCurrentPageNum()).toBe(2);
    expect(pager.getCurrentPage()).toBe(pages[1]);

    await pager.disablePage(1);
    expect(pager.isPageDisabled(1)).toBe(true);

    expect(pages[0].dataset.lisnPageState).toEqual("disabled");
    expect(pages[1].dataset.lisnPageState).toEqual("current");
    expect(pages[2].dataset.lisnPageState).toEqual("next");

    await pager.nextPage();

    expect(pager.getCurrentPageNum()).toBe(3);
    expect(pager.getCurrentPage()).toBe(pages[2]);

    expect(pages[0].dataset.lisnPageState).toEqual("disabled");
    expect(pages[1].dataset.lisnPageState).toEqual("covered");
    expect(pages[2].dataset.lisnPageState).toEqual("current");

    await pager.prevPage();

    expect(pager.getCurrentPageNum()).toBe(2);
    expect(pager.getCurrentPage()).toBe(pages[1]);

    expect(pages[0].dataset.lisnPageState).toEqual("disabled");
    expect(pages[1].dataset.lisnPageState).toEqual("current");
    expect(pages[2].dataset.lisnPageState).toEqual("next");

    await pager.prevPage(); // ignored as current is first enabled

    expect(pager.getCurrentPageNum()).toBe(2);
    expect(pager.getCurrentPage()).toBe(pages[1]);

    expect(pages[0].dataset.lisnPageState).toEqual("disabled");
    expect(pages[1].dataset.lisnPageState).toEqual("current");
    expect(pages[2].dataset.lisnPageState).toEqual("next");

    await pager.enablePage(1);
    expect(pager.isPageDisabled(1)).toBe(false);

    await pager.prevPage();

    expect(pager.getCurrentPageNum()).toBe(1);
    expect(pager.getCurrentPage()).toBe(pages[0]);

    expect(pages[0].dataset.lisnPageState).toEqual("current");
    expect(pages[1].dataset.lisnPageState).toEqual("next");
    expect(pages[2].dataset.lisnPageState).toEqual("next");
  });

  test("disabling last page", async () => {
    const { pager, pages } = await newPager(3);

    await pager.disablePage(3);
    expect(pager.isPageDisabled(3)).toBe(true);
    await pager.nextPage();

    expect(pager.getCurrentPageNum()).toBe(2);
    expect(pager.getCurrentPage()).toBe(pages[1]);

    expect(pages[0].dataset.lisnPageState).toEqual("covered");
    expect(pages[1].dataset.lisnPageState).toEqual("current");
    expect(pages[2].dataset.lisnPageState).toEqual("disabled");

    await pager.nextPage(); // ignored as current is last enabled

    expect(pager.getCurrentPageNum()).toBe(2);
    expect(pager.getCurrentPage()).toBe(pages[1]);

    expect(pages[0].dataset.lisnPageState).toEqual("covered");
    expect(pages[1].dataset.lisnPageState).toEqual("current");
    expect(pages[2].dataset.lisnPageState).toEqual("disabled");

    await pager.enablePage(3);
    expect(pager.isPageDisabled(3)).toBe(false);

    await pager.nextPage();

    expect(pager.getCurrentPageNum()).toBe(3);
    expect(pager.getCurrentPage()).toBe(pages[2]);

    expect(pages[0].dataset.lisnPageState).toEqual("covered");
    expect(pages[1].dataset.lisnPageState).toEqual("covered");
    expect(pages[2].dataset.lisnPageState).toEqual("current");
  });

  test("disabling middle page", async () => {
    const { pager, pages } = await newPager(3);

    await pager.disablePage(2);
    expect(pager.isPageDisabled(2)).toBe(true);
    await pager.nextPage();

    expect(pager.getCurrentPageNum()).toBe(3); // jump from 1 to 3
    expect(pager.getCurrentPage()).toBe(pages[2]);

    expect(pages[0].dataset.lisnPageState).toEqual("covered");
    expect(pages[1].dataset.lisnPageState).toEqual("disabled");
    expect(pages[2].dataset.lisnPageState).toEqual("current");

    await pager.prevPage();

    expect(pager.getCurrentPageNum()).toBe(1); // jump from 3 to 1
    expect(pager.getCurrentPage()).toBe(pages[0]);
  });

  test("disabling current first page", async () => {
    const { pager, pages } = await newPager(3);

    await pager.disablePage(1);
    expect(pager.isPageDisabled(1)).toBe(true);

    expect(pager.getCurrentPageNum()).toBe(2); // switched to 2
    expect(pager.getCurrentPage()).toBe(pages[1]);
  });

  test("disabling current middle page", async () => {
    const { pager, pages } = await newPager(3);

    await pager.nextPage();

    expect(pager.getCurrentPageNum()).toBe(2);
    expect(pager.getCurrentPage()).toBe(pages[1]);

    await pager.disablePage(2);
    expect(pager.isPageDisabled(2)).toBe(true);

    expect(pager.getCurrentPageNum()).toBe(1); // switched to 1
    expect(pager.getCurrentPage()).toBe(pages[0]);
  });

  test("disabling current last page", async () => {
    const { pager, pages } = await newPager(3);

    await pager.nextPage();
    await pager.nextPage();

    expect(pager.getCurrentPageNum()).toBe(3);
    expect(pager.getCurrentPage()).toBe(pages[2]);

    await pager.disablePage(3);
    expect(pager.isPageDisabled(3)).toBe(true);

    expect(pager.getCurrentPageNum()).toBe(2); // switched to 2
    expect(pager.getCurrentPage()).toBe(pages[1]);
  });

  test("disabling all, one by one v1", async () => {
    const { pager, pages } = await newPager(3);

    await pager.disablePage(2);
    expect(pager.isPageDisabled(2)).toBe(true);

    await pager.nextPage();

    expect(pager.getCurrentPageNum()).toBe(3); // jump from 1 to 3
    expect(pager.getCurrentPage()).toBe(pages[2]);

    await pager.disablePage(1);
    expect(pager.isPageDisabled(1)).toBe(true);

    await pager.disablePage(3); // ignored
    await pager.prevPage(); // ignored
    expect(pager.isPageDisabled(3)).toBe(false);

    expect(pager.getCurrentPageNum()).toBe(3);
    expect(pager.getCurrentPage()).toBe(pages[2]);

    expect(pages[0].dataset.lisnPageState).toEqual("disabled");
    expect(pages[1].dataset.lisnPageState).toEqual("disabled");
    expect(pages[2].dataset.lisnPageState).toEqual("current");
  });

  test("disabling all, one by one v2", async () => {
    const { pager, pages } = await newPager(3);

    await pager.disablePage(1);
    expect(pager.isPageDisabled(1)).toBe(true);

    expect(pager.getCurrentPageNum()).toBe(2);
    expect(pager.getCurrentPage()).toBe(pages[1]);

    await pager.disablePage(2);
    expect(pager.isPageDisabled(2)).toBe(true);

    expect(pager.getCurrentPageNum()).toBe(3);

    await pager.disablePage(3); // ignored
    await pager.prevPage(); // ignored
    expect(pager.isPageDisabled(3)).toBe(false);

    expect(pager.getCurrentPage()).toBe(pages[2]);
    expect(pager.getCurrentPageNum()).toBe(3);

    expect(pages[0].dataset.lisnPageState).toEqual("disabled");
    expect(pages[1].dataset.lisnPageState).toEqual("disabled");
    expect(pages[2].dataset.lisnPageState).toEqual("current");
  });

  test("disabling all, one by one v3", async () => {
    const { pager, pages } = await newPager(3);

    await pager.nextPage();
    await pager.nextPage();

    expect(pager.getCurrentPageNum()).toBe(3);
    expect(pager.getCurrentPage()).toBe(pages[2]);

    await pager.disablePage(3);
    expect(pager.isPageDisabled(3)).toBe(true);

    expect(pager.getCurrentPageNum()).toBe(2);
    expect(pager.getCurrentPage()).toBe(pages[1]);

    await pager.disablePage(2);
    expect(pager.isPageDisabled(2)).toBe(true);

    expect(pager.getCurrentPageNum()).toBe(1);
    expect(pager.getCurrentPage()).toBe(pages[0]);

    await pager.disablePage(1); // ignored
    await pager.nextPage(); // ignored
    expect(pager.isPageDisabled(1)).toBe(false);

    expect(pager.getCurrentPageNum()).toBe(1);
    expect(pager.getCurrentPage()).toBe(pages[0]);

    expect(pages[0].dataset.lisnPageState).toEqual("current");
    expect(pages[1].dataset.lisnPageState).toEqual("disabled");
    expect(pages[2].dataset.lisnPageState).toEqual("disabled");
  });

  test("toggling pages", async () => {
    const { pager } = await newPager(3);

    expect(pager.getCurrentPageNum()).toBe(1);
    expect(pager.isPageDisabled(1)).toBe(false);

    await pager.togglePage(1);
    expect(pager.isPageDisabled(1)).toBe(true);
    expect(pager.getCurrentPageNum()).toBe(2);

    await pager.togglePage(1);
    expect(pager.isPageDisabled(1)).toBe(false);
    expect(pager.getCurrentPageNum()).toBe(2); // does not switch back to it
  });

  test("toggling pages without awaiting", async () => {
    const { pager } = await newPager(3);

    expect(pager.getCurrentPageNum()).toBe(1);
    expect(pager.isPageDisabled(1)).toBe(false);

    pager.togglePage(1); // disabled
    await pager.togglePage(1); // re-enabled
    expect(pager.isPageDisabled(1)).toBe(false);
    expect(pager.getCurrentPageNum()).toBe(2); // switched to 2 during disabling
  });

  test("disabling/enabling without awaiting", async () => {
    const { pager } = await newPager(3);

    pager.disablePage(1);
    expect(pager.isPageDisabled(1)).toBe(true);

    pager.enablePage(1);
    expect(pager.isPageDisabled(1)).toBe(false);
  });

  test("disabling/enabling invalid", async () => {
    const { pager, pages } = await newPager(3);

    pager.disablePage(1.1); // ignored as not an int
    expect(pager.isPageDisabled(1)).toBe(false);
    expect(pager.isPageDisabled(2)).toBe(false);
    expect(pager.isPageDisabled(3)).toBe(false);

    expect(pager.getCurrentPageNum()).toBe(1);
    expect(pager.getCurrentPage()).toBe(pages[0]);

    expect(pages[0].dataset.lisnPageState).toEqual("current");
    expect(pages[1].dataset.lisnPageState).toEqual("next");
    expect(pages[2].dataset.lisnPageState).toEqual("next");

    pager.disablePage(0); // ignored as out of bounds
    expect(pager.isPageDisabled(1)).toBe(false);
    expect(pager.isPageDisabled(2)).toBe(false);
    expect(pager.isPageDisabled(3)).toBe(false);

    expect(pager.getCurrentPageNum()).toBe(1);
    expect(pager.getCurrentPage()).toBe(pages[0]);

    expect(pages[0].dataset.lisnPageState).toEqual("current");
    expect(pages[1].dataset.lisnPageState).toEqual("next");
    expect(pages[2].dataset.lisnPageState).toEqual("next");

    pager.disablePage(4); // ignored as out of bounds
    expect(pager.isPageDisabled(1)).toBe(false);
    expect(pager.isPageDisabled(2)).toBe(false);
    expect(pager.isPageDisabled(3)).toBe(false);

    expect(pager.getCurrentPageNum()).toBe(1);
    expect(pager.getCurrentPage()).toBe(pages[0]);

    expect(pages[0].dataset.lisnPageState).toEqual("current");
    expect(pages[1].dataset.lisnPageState).toEqual("next");
    expect(pages[2].dataset.lisnPageState).toEqual("next");

    await pager.disablePage(1);
    expect(pager.isPageDisabled(1)).toBe(true);

    expect(pager.getCurrentPageNum()).toBe(2); // switched to 2
    expect(pager.getCurrentPage()).toBe(pages[1]);
    expect(pages[0].dataset.lisnPageState).toEqual("disabled");
    expect(pages[1].dataset.lisnPageState).toEqual("current");
    expect(pages[2].dataset.lisnPageState).toEqual("next");

    await pager.enablePage(1.1); // ignored as not an int
    expect(pager.isPageDisabled(1)).toBe(true);
    expect(pager.isPageDisabled(2)).toBe(false);
    expect(pager.isPageDisabled(3)).toBe(false);

    expect(pager.getCurrentPageNum()).toBe(2);
    expect(pager.getCurrentPage()).toBe(pages[1]);
    expect(pages[0].dataset.lisnPageState).toEqual("disabled");
    expect(pages[1].dataset.lisnPageState).toEqual("current");
    expect(pages[2].dataset.lisnPageState).toEqual("next");
  });
});

test("Pager.get", async () => {
  const element = document.createElement("div");
  element.append(document.createElement("div"));
  element.append(document.createElement("div"));
  document.body.append(element);

  const widget = new Pager(element);
  expect(Pager.get(element)).toBe(widget);

  await widget.destroy();
  expect(Pager.get(element)).toBe(null);
});

describe("is registered", () => {
  test(".lisn-pager", async () => {
    const element = document.createElement("div");
    element.classList.add("lisn-pager");
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    await window.waitForMO();

    expect(Pager.get(element)).toBeInstanceOf(Pager);
  });

  test("[data-lisn-pager='']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnPager = "";
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    await window.waitForMO();

    expect(Pager.get(element)).toBeInstanceOf(Pager);
  });

  test("[data-lisn-pager='...']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnPager = "horizontal";
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    await window.waitForMO();

    expect(Pager.get(element)).toBeInstanceOf(Pager);
  });
});

// TODO test with custom options and setting of complete-fr attribute when
// scrolling element
