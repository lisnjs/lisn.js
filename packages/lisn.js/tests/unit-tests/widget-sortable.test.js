const { jest, describe, test, expect } = require("@jest/globals");

const { Callback } = window.LISN.modules;
const { Sortable } = window.LISN.widgets;

const newSortable = async (numItems = 4, config = {}) => {
  const element = document.createElement("div");
  for (let i = 0; i < numItems; i++) {
    element.append(document.createElement("div"));
  }

  document.body.append(element);

  const sortable = new Sortable(element, config);
  const items = sortable.getItems();

  await window.waitFor(400);

  expect(items).toEqual([...element.children]);

  for (let i = 0; i < items.length; i++) {
    items[i].classList.add("item-" + (i + 1)); // for easier identifying in log msgs
    expect(sortable.isItemDisabled(i + 1)).toBe(false);
    expect(sortable.getItems()[i]).toBe(items[i]);
    expect(sortable.getItems(true)[i]).toBe(items[i]);
  }

  return { sortable, element, items };
};

describe("basic", () => {
  test("all default", async () => {
    const { element } = await newSortable(4);

    for (const ch of element.children) {
      expect(ch.classList.contains("lisn-sortable__item")).toBe(true);
    }
  });

  test("no items", () => {
    const element = document.createElement("div");
    document.body.append(element);

    expect(() => new Sortable(element)).toThrow(
      /Sortable must have more than 1 item/,
    );
  });

  test("one item", () => {
    const element = document.createElement("div");
    element.append(document.createElement("div"));
    document.body.append(element);

    expect(() => new Sortable(element)).toThrow(
      /Sortable must have more than 1 item/,
    );
  });
});

describe("re-creating and items auto-discovery", () => {
  for (const doAwait of [true, false]) {
    test(`with${doAwait ? "" : "out"} awaiting`, async () => {
      const element = document.createElement("div");
      const items = [];
      const itemsTagged = [];

      for (let i = 0; i < 4; i++) {
        const itemEl = document.createElement("div");
        element.append(itemEl);

        items.push(itemEl);

        if (i % 2) {
          itemsTagged.push(itemEl);
          itemEl.classList.add("lisn-sortable-item");
        }
      }

      const sortableA = new Sortable(element, { items });
      const itemsFoundA = sortableA.getItems();

      if (doAwait) {
        await window.waitFor(400);
      }

      // re-create using auto-discovered items for 2nd one
      const sortableB = new Sortable(element);
      const itemsFoundB = sortableB.getItems();

      expect(itemsFoundA).toEqual(items);
      expect(itemsFoundB).toEqual(itemsTagged);

      await window.waitFor(400);
      for (const itemEl of itemsFoundB) {
        expect(itemEl.classList.contains("lisn-sortable__item")).toBe(true);
        expect(itemEl.classList.contains("lisn-sortable-item")).toBe(
          itemsTagged.includes(itemEl),
        );
      }
    });
  }
});

test("destroy", async () => {
  const element = document.createElement("div");
  const items = [];

  for (let i = 0; i < 4; i++) {
    const itemEl = document.createElement("div");
    element.append(itemEl);

    items.push(itemEl);

    if (i % 2) {
      itemEl.classList.add("lisn-sortable-item");
    }
  }

  const sortable = new Sortable(element, { items });
  await window.waitFor(400);

  for (let i = 0; i < 4; i++) {
    const itemEl = items[i];
    expect(itemEl.classList.contains("lisn-sortable__item")).toBe(true);
    expect(itemEl.classList.contains("lisn-sortable-item")).toBe(i % 2 !== 0);
  }

  await sortable.destroy();

  for (let i = 0; i < 4; i++) {
    const itemEl = items[i];
    expect(itemEl.classList.contains("lisn-sortable__item")).toBe(false);
    expect(itemEl.classList.contains("lisn-sortable-item")).toBe(
      i % 2 !== 0, // kept
    );
  }
});

describe("moving", () => {
  test("default mode", async () => {
    const { sortable, items } = await newSortable(4);

    expect(
      items[1].compareDocumentPosition(items[3]) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0);

    // move item #2 to after item #4
    items[1].dispatchEvent(new MouseEvent("mousedown"));
    items[3].dispatchEvent(new Event("dragenter"));
    items[1].dispatchEvent(new Event("dragend"));

    await window.waitForAF();

    expect(
      items[1].compareDocumentPosition(items[3]) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(0);

    const expectedOrder = [0, 2, 3, 1];
    for (let i = 0; i < items.length; i++) {
      expect(sortable.getItems()[i]).toBe(items[i]);
      expect(sortable.getItems(true)[i]).toBe(items[expectedOrder[i]]);
    }
  });

  test("swap mode", async () => {
    const { sortable, items } = await newSortable(4, { mode: "swap" });

    expect(
      items[1].compareDocumentPosition(items[3]) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0);

    // swap item #2 and item #4
    items[1].dispatchEvent(new MouseEvent("mousedown"));
    items[3].dispatchEvent(new Event("dragenter"));
    items[1].dispatchEvent(new Event("dragend"));

    await window.waitForAF();

    expect(
      items[1].compareDocumentPosition(items[3]) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(0);

    const expectedOrder = [0, 3, 2, 1];
    for (let i = 0; i < items.length; i++) {
      expect(sortable.getItems()[i]).toBe(items[i]);
      expect(sortable.getItems(true)[i]).toBe(items[expectedOrder[i]]);
    }
  });

  test("onMove", async () => {
    const { sortable, items } = await newSortable(4);

    let currItems = null;
    const callback = jest.fn((sortable) => {
      currItems = sortable.getItems(true);
    });

    sortable.onMove(callback);
    expect(callback).toHaveBeenCalledTimes(0);

    // move item #2 to after item #4
    items[1].dispatchEvent(new MouseEvent("mousedown"));
    items[3].dispatchEvent(new Event("dragenter"));
    items[1].dispatchEvent(new Event("dragend"));

    await window.waitForAF();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(sortable);
    expect(currItems).toBeTruthy();

    const expectedOrder = [0, 2, 3, 1];
    for (let i = 0; i < items.length; i++) {
      expect(currItems[i]).toBe(items[expectedOrder[i]]);
    }
  });

  test("offMove", async () => {
    const { sortable, items } = await newSortable(4);

    const callback = jest.fn();

    sortable.onMove(callback);
    sortable.offMove(callback);

    // move item #2 to after item #4
    items[1].dispatchEvent(new MouseEvent("mousedown"));
    items[3].dispatchEvent(new Event("dragenter"));
    items[1].dispatchEvent(new Event("dragend"));

    await window.waitForAF();

    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("offMove: callback.remove", async () => {
    const { sortable, items } = await newSortable(4);

    const callbackJ = jest.fn();
    const callback = Callback.wrap(callbackJ);

    sortable.onMove(callback);
    callback.remove();

    // move item #2 to after item #4
    items[1].dispatchEvent(new MouseEvent("mousedown"));
    items[3].dispatchEvent(new Event("dragenter"));
    items[1].dispatchEvent(new Event("dragend"));

    await window.waitForAF();

    expect(callbackJ).toHaveBeenCalledTimes(0);
  });

  test("offMove: return Callback.REMOVE", async () => {
    const { sortable, items } = await newSortable(4);

    const callback = jest.fn(() => Callback.REMOVE);

    sortable.onMove(callback);

    // move item #2 to after item #4
    items[1].dispatchEvent(new MouseEvent("mousedown"));
    items[3].dispatchEvent(new Event("dragenter"));
    items[1].dispatchEvent(new Event("dragend"));

    await window.waitForAF();

    // move item #4 to after item #2
    items[3].dispatchEvent(new MouseEvent("mousedown"));
    items[1].dispatchEvent(new Event("dragenter"));
    items[3].dispatchEvent(new Event("dragend"));

    await window.waitForAF();

    expect(callback).toHaveBeenCalledTimes(1); // removed after 1st time
  });
});

describe("disabling/enabling items", () => {
  test("disable/enable", async () => {
    const { sortable } = await newSortable(4);
    await sortable.disableItem(2);

    for (let i = 1; i <= 4; i++) {
      expect(sortable.isItemDisabled(i)).toBe(i === 2);
    }

    await sortable.enableItem(2);

    for (let i = 1; i <= 4; i++) {
      expect(sortable.isItemDisabled(i)).toBe(false);
    }
  });

  test("disabling/enabling without awaiting", async () => {
    const { sortable } = await newSortable(3);

    sortable.disableItem(1);
    expect(sortable.isItemDisabled(1)).toBe(true);

    sortable.enableItem(1);
    expect(sortable.isItemDisabled(1)).toBe(false);
  });

  test("toggle", async () => {
    const { sortable } = await newSortable(3);

    expect(sortable.isItemDisabled(1)).toBe(false);

    await sortable.toggleItem(1);
    expect(sortable.isItemDisabled(1)).toBe(true);

    await sortable.toggleItem(1);
    expect(sortable.isItemDisabled(1)).toBe(false);
  });

  test("toggle without await", async () => {
    const { sortable } = await newSortable(3);

    expect(sortable.isItemDisabled(1)).toBe(false);

    sortable.toggleItem(1); // disabled
    await sortable.toggleItem(1); // re-enabled
    expect(sortable.isItemDisabled(1)).toBe(false);
  });

  test("disabled item by original order after moving", async () => {
    const { sortable, items } = await newSortable(4);

    expect(
      items[1].compareDocumentPosition(items[3]) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0);

    // move item #2 to after item #4
    items[1].dispatchEvent(new MouseEvent("mousedown"));
    items[3].dispatchEvent(new Event("dragenter"));
    items[1].dispatchEvent(new Event("dragend"));

    await window.waitForAF();

    expect(
      items[1].compareDocumentPosition(items[3]) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(0);

    let expectedOrder = [0, 2, 3, 1];
    for (let i = 0; i < items.length; i++) {
      expect(sortable.getItems()[i]).toBe(items[i]);
      expect(sortable.getItems(true)[i]).toBe(items[expectedOrder[i]]);
    }

    await sortable.disableItem(2); // original #2
    expect(sortable.isItemDisabled(2)).toBe(true); // original #2
    expect(sortable.isItemDisabled(4, true)).toBe(true); // current #4, original #2
    expect(sortable.isItemDisabled(2, true)).toBe(false); // current #2, original #3
    expect(sortable.isItemDisabled(4)).toBe(false); // original #4

    // try to move item #2 back in its place
    items[1].dispatchEvent(new MouseEvent("mousedown"));
    items[2].dispatchEvent(new Event("dragenter"));
    items[1].dispatchEvent(new Event("dragend"));

    await window.waitForAF();

    expectedOrder = [0, 2, 3, 1];
    for (let i = 0; i < items.length; i++) {
      expect(sortable.getItems()[i]).toBe(items[i]);
      expect(sortable.getItems(true)[i]).toBe(items[expectedOrder[i]]);
    }

    // move item #4 to before #3
    items[3].dispatchEvent(new MouseEvent("mousedown"));
    items[2].dispatchEvent(new Event("dragenter"));
    items[3].dispatchEvent(new Event("dragend"));

    await window.waitForAF();

    expectedOrder = [0, 3, 2, 1]; // success
    for (let i = 0; i < items.length; i++) {
      expect(sortable.getItems()[i]).toBe(items[i]);
      expect(sortable.getItems(true)[i]).toBe(items[expectedOrder[i]]);
    }
  });

  test("disabled item by current order after moving", async () => {
    const { sortable, items } = await newSortable(4);

    expect(
      items[1].compareDocumentPosition(items[3]) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0);

    // move item #2 to after item #4
    items[1].dispatchEvent(new MouseEvent("mousedown"));
    items[3].dispatchEvent(new Event("dragenter"));
    items[1].dispatchEvent(new Event("dragend"));

    await window.waitForAF();

    expect(
      items[1].compareDocumentPosition(items[3]) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(0);

    let expectedOrder = [0, 2, 3, 1];
    for (let i = 0; i < items.length; i++) {
      expect(sortable.getItems()[i]).toBe(items[i]);
      expect(sortable.getItems(true)[i]).toBe(items[expectedOrder[i]]);
    }

    await sortable.disableItem(4, true); // current #4, original #2
    expect(sortable.isItemDisabled(2)).toBe(true); // original #2
    expect(sortable.isItemDisabled(4, true)).toBe(true); // current #4, original #2
    expect(sortable.isItemDisabled(2, true)).toBe(false); // current #2, original #3
    expect(sortable.isItemDisabled(4)).toBe(false); // original #4

    // try to move item #2 back in its place
    items[1].dispatchEvent(new MouseEvent("mousedown"));
    items[2].dispatchEvent(new Event("dragenter"));
    items[1].dispatchEvent(new Event("dragend"));

    await window.waitForAF();

    expectedOrder = [0, 2, 3, 1];
    for (let i = 0; i < items.length; i++) {
      expect(sortable.getItems()[i]).toBe(items[i]);
      expect(sortable.getItems(true)[i]).toBe(items[expectedOrder[i]]);
    }

    // move item #4 to before #3
    items[3].dispatchEvent(new MouseEvent("mousedown"));
    items[2].dispatchEvent(new Event("dragenter"));
    items[3].dispatchEvent(new Event("dragend"));

    await window.waitForAF();

    expectedOrder = [0, 3, 2, 1]; // success
    for (let i = 0; i < items.length; i++) {
      expect(sortable.getItems()[i]).toBe(items[i]);
      expect(sortable.getItems(true)[i]).toBe(items[expectedOrder[i]]);
    }
  });

  test("moving disabled item", async () => {
    const { sortable, items } = await newSortable(4);
    await sortable.disableItem(2);

    expect(
      items[1].compareDocumentPosition(items[3]) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0);

    // try to move item #2 to after item #4
    items[1].dispatchEvent(new MouseEvent("mousedown"));
    items[3].dispatchEvent(new Event("dragenter"));
    items[1].dispatchEvent(new Event("dragend"));

    await window.waitForAF();

    expect(
      items[1].compareDocumentPosition(items[3]) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0); // failed, still in its old place

    const expectedOrder = [0, 1, 2, 3];
    for (let i = 0; i < items.length; i++) {
      expect(sortable.getItems()[i]).toBe(items[i]);
      expect(sortable.getItems(true)[i]).toBe(items[expectedOrder[i]]);
    }
  });
});

test("Sortable.get", async () => {
  const { sortable, element } = await newSortable(4);

  expect(Sortable.get(element)).toBe(sortable);

  await sortable.destroy();
  expect(Sortable.get(element)).toBe(null);
});

describe("is registered", () => {
  test(".lisn-sortable", async () => {
    const element = document.createElement("div");
    element.classList.add("lisn-sortable");
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    await window.waitForMO();

    expect(Sortable.get(element)).toBeInstanceOf(Sortable);
  });

  test("[data-lisn-sortable='']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnSortable = "";
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    await window.waitForMO();

    expect(Sortable.get(element)).toBeInstanceOf(Sortable);
  });

  test("[data-lisn-sortable='...']", async () => {
    const element = document.createElement("div");
    element.dataset.lisnSortable = "whatever"; // currently there's no config for it
    element.append(document.createElement("div"));
    element.append(document.createElement("div"));
    document.body.append(element);

    await window.waitForMO();

    expect(Sortable.get(element)).toBeInstanceOf(Sortable);
  });
});

// TODO test with custom options
