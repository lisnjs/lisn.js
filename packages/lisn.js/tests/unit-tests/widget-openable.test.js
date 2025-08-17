const { jest, describe, test, expect } = require("@jest/globals");

const { randId } = window.LISN.utils;
const { Openable, Collapsible, Popup, Modal } = window.LISN.widgets;

const newElements = () => {
  const containerParent = document.createElement("div");
  containerParent.classList.add("container-parent");

  const container = document.createElement("div");
  container.classList.add("container");

  const before = document.createElement("div");
  before.classList.add("before");

  const content = document.createElement("div");
  content.classList.add("content");

  const after = document.createElement("div");
  after.classList.add("after");

  const triggerA = document.createElement("div");
  triggerA.classList.add("triggerA");

  const triggerB = document.createElement("div");
  triggerB.classList.add("triggerB");

  container.append(before, content, after, triggerA, triggerB);
  containerParent.append(container);
  document.body.append(containerParent);

  return {
    containerParent,
    container,
    before,
    content,
    after,
    triggerA,
    triggerB,
  };
};

const testNotATrigger = async (notATrigger, widget, ...triggers) => {
  await testNotAClickTrigger(notATrigger, widget, ...triggers);
  await testNotAHoverTrigger(notATrigger, widget, ...triggers);
};

const testNotAClickTrigger = async (notATrigger, widget, ...triggers) => {
  expect(widget.isOpen()).toBe(false);
  for (const t of [notATrigger, ...triggers]) {
    expect(t.dataset.lisnIsOpen === "true").toBe(false);
  }

  notATrigger.dispatchEvent(window.newClick());
  await window.waitForAF();
  expect(widget.isOpen()).toBe(false);
  for (const t of [notATrigger, ...triggers]) {
    expect(t.dataset.lisnIsOpen === "true").toBe(false);
  }
};

const testNotAHoverTrigger = async (notATrigger, widget, ...triggers) => {
  expect(widget.isOpen()).toBe(false);
  for (const t of [notATrigger, ...triggers]) {
    expect(t.dataset.lisnIsOpen === "true").toBe(false);
  }

  notATrigger.dispatchEvent(window.newMouse("enter"));
  await window.waitForAF();
  expect(widget.isOpen()).toBe(false);
  for (const t of [notATrigger, ...triggers]) {
    expect(t.dataset.lisnIsOpen === "true").toBe(false);
  }
};

const testClickTrigger = async (trigger, widget, ...otherTriggers) => {
  expect(widget.isOpen()).toBe(false);
  for (const t of [trigger, ...otherTriggers]) {
    expect(t.dataset.lisnIsOpen === "true").toBe(false);
  }

  trigger.dispatchEvent(window.newClick());
  await window.waitForAF();
  expect(widget.isOpen()).toBe(true);
  expect(trigger.dataset.lisnIsOpen === "true").toBe(true);
  for (const t of otherTriggers) {
    expect(t.dataset.lisnIsOpen === "true").toBe(false);
  }

  await widget.close(); // close manually
  expect(widget.isOpen()).toBe(false);
  await window.waitForAF();
  for (const t of [trigger, ...otherTriggers]) {
    expect(t.dataset.lisnIsOpen === "true").toBe(false);
  }

  trigger.dispatchEvent(window.newClick()); // again, test toggle
  await window.waitForAF();
  expect(widget.isOpen()).toBe(true);
  expect(trigger.dataset.lisnIsOpen === "true").toBe(true);
  for (const t of otherTriggers) {
    expect(t.dataset.lisnIsOpen === "true").toBe(false);
  }

  trigger.dispatchEvent(window.newClick()); // close with trigger
  await window.waitForAF();
  expect(widget.isOpen()).toBe(false);
  await window.waitForAF();
  for (const t of [trigger, ...otherTriggers]) {
    expect(t.dataset.lisnIsOpen === "true").toBe(false);
  }
};

const testHoverTrigger = async (
  trigger,
  autoClose,
  widget,
  ...otherTriggers
) => {
  expect(widget.isOpen()).toBe(false);
  for (const t of [trigger, ...otherTriggers]) {
    expect(t.dataset.lisnIsOpen === "true").toBe(false);
  }

  trigger.dispatchEvent(window.newMouse("enter"));
  await window.waitForAF();
  expect(widget.isOpen()).toBe(true);
  expect(trigger.dataset.lisnIsOpen === "true").toBe(true);
  for (const t of otherTriggers) {
    expect(t.dataset.lisnIsOpen === "true").toBe(false);
  }

  await widget.close(); // close manually
  expect(widget.isOpen()).toBe(false);
  await window.waitForAF();
  for (const t of [trigger, ...otherTriggers]) {
    expect(t.dataset.lisnIsOpen === "true").toBe(false);
  }

  trigger.dispatchEvent(window.newMouse("enter")); // again, test toggle
  await window.waitForAF();
  expect(widget.isOpen()).toBe(true);
  expect(trigger.dataset.lisnIsOpen === "true").toBe(true);
  for (const t of otherTriggers) {
    expect(t.dataset.lisnIsOpen === "true").toBe(false);
  }

  trigger.dispatchEvent(window.newMouse("leave")); // close with trigger maybe
  await window.waitFor(350);
  expect(widget.isOpen()).toBe(!autoClose);
  await window.waitForAF();
  expect(trigger.dataset.lisnIsOpen === "true").toBe(!autoClose);
  for (const t of otherTriggers) {
    expect(t.dataset.lisnIsOpen === "true").toBe(false);
  }

  await widget.close();
};

describe("generic Openable", () => {
  test("basic", async () => {
    const { container, content } = newElements();

    const widget = new Openable(content, { name: "openable" });
    const root = widget.getRoot();
    const containerFound = widget.getContainer();

    await window.waitForAF();
    expect(containerFound).toBe(container);
    expect(root.parentElement).toBe(container);
    expect(root).not.toBe(content);
    expect(root.contains(content)).toBe(true);
  });

  test("with ID and 1 class name", async () => {
    const { content } = newElements();

    const widget = new Openable(content, {
      name: "openable",
      id: "myOpenable",
      className: "my-openable",
    });
    const root = widget.getRoot();

    await window.waitForAF();
    expect(root.id).toBe("myOpenable");
    expect(root.classList.contains("my-openable")).toBe(true);
  });

  test("with 2 class names", async () => {
    const { content } = newElements();

    const widget = new Openable(content, {
      name: "openable",
      className: ["my-openable", "some-cls"],
    });
    const root = widget.getRoot();

    await window.waitForAF();
    expect(root.classList.contains("my-openable")).toBe(true);
    expect(root.classList.contains("some-cls")).toBe(true);
  });

  test("disable + open/close", async () => {
    const { container, content } = newElements();

    const widget = new Openable(content, { name: "openable" });
    const root = widget.getRoot();
    const containerFound = widget.getContainer();

    await window.waitForAF();

    // ------- Disable when closed (initial)
    widget.disable();
    expect(containerFound).toBe(container);
    expect(root.parentElement).toBe(container);
    expect(root).not.toBe(content);
    expect(root.contains(content)).toBe(true);

    await widget.open();
    expect(widget.isOpen()).toBe(false);

    await widget.close();

    // ------- Enable when closed
    widget.enable();
    expect(widget.isOpen()).toBe(false);

    await widget.open();
    expect(widget.isOpen()).toBe(true);

    await widget.close();
    expect(widget.isOpen()).toBe(false);

    await widget.open();
    expect(widget.isOpen()).toBe(true);

    // ------- Disable when open
    widget.disable();
    expect(widget.isOpen()).toBe(true);
    await widget.close();
    expect(widget.isOpen()).toBe(true);
  });

  test("toggle", async () => {
    const { content } = newElements();

    const widget = new Openable(content, { name: "openable" });
    await window.waitForAF();

    // Toggle on and off
    await widget.toggle();
    expect(widget.isOpen()).toBe(true);

    await widget.toggle();
    expect(widget.isOpen()).toBe(false);

    // Open
    await widget.open();
    expect(widget.isOpen()).toBe(true);

    // Toggle -> off
    await widget.toggle();
    expect(widget.isOpen()).toBe(false);
  });

  test("onOpen/onClose", async () => {
    const { content } = newElements();

    const widget = new Openable(content, { name: "openable" });
    await window.waitForAF();

    const openFn = jest.fn();
    widget.onOpen(openFn);

    const closeFn = jest.fn();
    widget.onClose(closeFn);

    await widget.close(); // no-op as it's closed
    expect(openFn).toHaveBeenCalledTimes(0);
    expect(closeFn).toHaveBeenCalledTimes(0);

    await widget.open();
    expect(openFn).toHaveBeenCalledTimes(1);
    expect(openFn).toHaveBeenCalledWith(widget);
    expect(closeFn).toHaveBeenCalledTimes(0);

    await widget.open(); // no-op as it's open
    expect(openFn).toHaveBeenCalledTimes(1);
    expect(closeFn).toHaveBeenCalledTimes(0);

    await widget.close();
    expect(openFn).toHaveBeenCalledTimes(1); // no new calls
    expect(closeFn).toHaveBeenCalledTimes(1);
    expect(closeFn).toHaveBeenCalledWith(widget);

    await widget.toggle();
    expect(openFn).toHaveBeenCalledTimes(2);
    expect(openFn).toHaveBeenNthCalledWith(2, widget);
    expect(closeFn).toHaveBeenCalledTimes(1);

    await widget.toggle();
    expect(openFn).toHaveBeenCalledTimes(2);
    expect(closeFn).toHaveBeenCalledTimes(2);
    expect(closeFn).toHaveBeenNthCalledWith(2, widget);
  });

  test("offOpen/offClose", async () => {
    const { content } = newElements();

    const widget = new Openable(content, { name: "openable" });
    await window.waitForAF();

    const openFn = jest.fn();
    widget.onOpen(openFn);
    widget.offOpen(openFn);

    const closeFn = jest.fn();
    widget.onClose(closeFn);
    widget.offClose(closeFn);

    await widget.open();
    await widget.close();
    await widget.toggle();

    expect(openFn).toHaveBeenCalledTimes(0);
    expect(closeFn).toHaveBeenCalledTimes(0);
  });

  test("destroy not offcanvas", async () => {
    const { container, before, content, after, triggerA, triggerB } =
      newElements();
    triggerA.classList.add("lisn-openable-trigger");

    const widget = new Openable(content, {
      name: "openable",
      triggers: [triggerA, triggerB],
    });
    const root = widget.getRoot();
    const containerFound = widget.getContainer();
    const triggers = widget.getTriggers();

    expect(triggers).toEqual([triggerA, triggerB]);

    await window.waitForAF();
    expect(containerFound).toBe(container);
    expect(root.contains(content)).toBe(true);
    expect(root.parentElement).toBe(container);
    expect(root.previousElementSibling).toBe(before);
    expect(root.nextElementSibling).toBe(after);
    expect(content.classList.contains("lisn-openable__content")).toBe(true);
    expect(triggerA.classList.contains("lisn-openable__trigger")).toBe(true);
    expect(triggerB.classList.contains("lisn-openable__trigger")).toBe(true);

    await widget.destroy();
    expect(root.parentElement).toBe(null); // removed
    expect(content.parentElement).toBe(container); // restored
    expect(content.previousElementSibling).toBe(before);
    expect(content.nextElementSibling).toBe(after);
    expect(content.classList.contains("lisn-openable__content")).toBe(false);
    expect(triggerA.classList.contains("lisn-openable__trigger")).toBe(false);
    expect(triggerB.classList.contains("lisn-openable__trigger")).toBe(false);
    // triggerA had the class beforehand, so it's kept
    expect(triggerA.classList.contains("lisn-openable-trigger")).toBe(true);
  });

  test("destroy offcanvas", async () => {
    const { container, before, content, after, triggerA, triggerB } =
      newElements();
    triggerA.classList.add("lisn-openable-trigger");

    const widget = new Openable(content, {
      name: "openable",
      triggers: [triggerA, triggerB],
      isOffcanvas: true,
    });
    const root = widget.getRoot();
    const containerFound = widget.getContainer();
    const triggers = widget.getTriggers();

    expect(triggers).toEqual([triggerA, triggerB]);

    await window.waitForAF();
    expect(containerFound).toBe(container);
    expect(root.contains(content)).toBe(true);
    expect(root.parentElement).toBe(document.body);
    expect(content.classList.contains("lisn-openable__content")).toBe(true);
    expect(triggerA.classList.contains("lisn-openable__trigger")).toBe(true);
    expect(triggerB.classList.contains("lisn-openable__trigger")).toBe(true);

    await widget.destroy();
    expect(root.parentElement).toBe(null); // removed
    expect(content.parentElement).toBe(container); // restored
    expect(content.previousElementSibling).toBe(before);
    expect(content.nextElementSibling).toBe(after);
    expect(content.classList.contains("lisn-openable__content")).toBe(false);
    expect(triggerA.classList.contains("lisn-openable__trigger")).toBe(false);
    expect(triggerB.classList.contains("lisn-openable__trigger")).toBe(false);
    // triggerA had the class beforehand, so it's kept
    expect(triggerA.classList.contains("lisn-openable-trigger")).toBe(true);
  });
});

describe("Collapsible", () => {
  for (const doAwait of [true, false]) {
    test(`re-create + destroy v1 with${doAwait ? "" : "out"} awaiting`, async () => {
      const { container, before, content, after, triggerA, triggerB } =
        newElements();
      triggerA.classList.add("lisn-collapsible-trigger");

      new Collapsible(content, {
        // will be destroyed next
        triggers: [triggerA, triggerB],
      });

      if (doAwait) {
        await window.waitForAF();
      }

      const widget = new Collapsible(content); // triggers auto-discovered as triggerA
      const root = widget.getRoot();
      const containerFound = widget.getContainer();
      const triggers = widget.getTriggers();

      await window.waitForAF();
      expect(containerFound).toBe(container);
      expect(root.parentElement).toBe(container);
      expect(root).not.toBe(content);
      expect(root.contains(content)).toBe(true);

      expect(triggers).toEqual([triggerA.parentElement]); // Collapsible wraps the triggers

      expect(content.classList.contains("lisn-collapsible__content")).toBe(
        true,
      );

      expect(
        triggerA.parentElement.classList.contains("lisn-collapsible__trigger"),
      ).toBe(true);
      expect(triggerA.parentElement).not.toBe(container);
      expect(triggerA.parentElement.parentElement).toBe(container);
      expect(
        triggerA.parentElement.classList.contains("lisn-icon-wrapper"),
      ).toBe(false);

      await widget.destroy();
      expect(content.parentElement).toBe(container); // restored
      expect(content.previousElementSibling).toBe(before);
      expect(content.nextElementSibling).toBe(after);
      expect(content.classList.contains("lisn-collapsible__content")).toBe(
        false,
      );
      expect(triggerA.classList.contains("lisn-collapsible__trigger")).toBe(
        false,
      );
      expect(triggerB.classList.contains("lisn-collapsible__trigger")).toBe(
        false,
      );
      // triggerA had the class beforehand, so it's kept
      expect(triggerA.classList.contains("lisn-collapsible-trigger")).toBe(
        true,
      );

      for (const trigger of [triggerA, triggerB]) {
        expect(trigger.parentElement).toBe(container);
      }
    });
  }

  test("re-create + destroy v2 (initial from auto widgets + trigger icon)", async () => {
    const { container, before, content, after, triggerA, triggerB } =
      newElements();
    content.classList.add("lisn-collapsible");
    triggerA.classList.add("lisn-collapsible-trigger");

    await window.waitForMO(); // will automatically create a Collapsible when DOM watcher picks it up

    const widget = new Collapsible(content, {
      // will re-create the widget
      triggers: [triggerA, triggerB],
      icon: "left",
    });
    const root = widget.getRoot();
    const containerFound = widget.getContainer();
    const triggers = widget.getTriggers();

    await window.waitForAF();
    expect(containerFound).toBe(container);
    expect(root.parentElement).toBe(container);
    expect(root).not.toBe(content);
    expect(root.contains(content)).toBe(true);

    expect(content.classList.contains("lisn-collapsible__content")).toBe(true);
    for (const trigger of [triggerA, triggerB]) {
      expect(
        trigger.parentElement.classList.contains("lisn-collapsible__trigger"),
      ).toBe(true);
      expect(trigger.parentElement).not.toBe(container);
      expect(trigger.parentElement.parentElement).toBe(container);

      expect(triggers.includes(trigger.parentElement)).toBe(true);

      expect(
        trigger.parentElement.classList.contains("lisn-icon-wrapper"),
      ).toBe(true);
    }

    await widget.destroy();
    expect(content.parentElement).toBe(container); // restored
    expect(content.previousElementSibling).toBe(before);
    expect(content.nextElementSibling).toBe(after);
    expect(content.classList.contains("lisn-collapsible")).toBe(
      true, // kept
    );
    expect(content.classList.contains("lisn-collapsible__content")).toBe(false);
    expect(triggerA.classList.contains("lisn-collapsible__trigger")).toBe(
      false,
    );
    expect(triggerB.classList.contains("lisn-collapsible__trigger")).toBe(
      false,
    );
    // triggerA had the class beforehand, so it's kept
    expect(triggerA.classList.contains("lisn-collapsible-trigger")).toBe(true);

    for (const trigger of [triggerA, triggerB]) {
      expect(trigger.parentElement).toBe(container);
    }
  });
});

describe("triggers", () => {
  test("from explicit options", async () => {
    const { container, content, triggerA, triggerB } = newElements();

    const notATrigger = document.createElement("div");
    container.append(notATrigger); // ignored trigger
    notATrigger.classList.add("lisn-popup-trigger");

    const widget = new Popup(content, {
      triggers: [triggerA, triggerB],
    });
    const triggers = widget.getTriggers();

    expect(triggers).toEqual([triggerA, triggerB]);

    await window.waitForAF();

    await testClickTrigger(triggerA, widget, triggerB);
    await testClickTrigger(triggerB, widget, triggerA);

    await testNotATrigger(notATrigger, widget, triggerA, triggerB);
  });

  test("from DOM: common container v1", async () => {
    const { containerParent, content, triggerA, triggerB } = newElements();

    const notATrigger = document.createElement("div");
    containerParent.append(notATrigger); // not a common container with others

    content.classList.add("lisn-popup");
    for (const el of [triggerA, triggerB, notATrigger]) {
      el.classList.add("lisn-popup-trigger");
    }

    await window.waitForMO();
    const widget = Popup.get(content);
    expect(widget).toBeInstanceOf(Popup);

    const triggers = widget.getTriggers();

    expect(triggers).toEqual([triggerA, triggerB]);

    await testClickTrigger(triggerA, widget, triggerB);
    await testClickTrigger(triggerB, widget, triggerA);

    await testNotATrigger(notATrigger, widget, triggerA, triggerB);
  });

  test("from DOM: common container v2", async () => {
    const { containerParent, content, triggerA, triggerB } = newElements();
    containerParent.classList.add("lisn-popup-container");

    const otherTrigger = document.createElement("div");
    containerParent.append(otherTrigger); // now it will be a trigger

    content.classList.add("lisn-popup");
    for (const el of [triggerA, triggerB, otherTrigger]) {
      el.classList.add("lisn-popup-trigger");
    }

    await window.waitForMO();
    const widget = Popup.get(content);
    expect(widget).toBeInstanceOf(Popup);

    const triggers = widget.getTriggers();

    expect(triggers).toEqual([triggerA, triggerB, otherTrigger]);

    await testClickTrigger(triggerA, widget, triggerB, otherTrigger);
    await testClickTrigger(triggerB, widget, triggerA, otherTrigger);

    await testClickTrigger(otherTrigger, widget, triggerA, triggerB);
  });

  test("from DOM: content ID", async () => {
    const { container, content, triggerA, triggerB } = newElements();
    content.classList.add("lisn-popup");

    const notATriggerA = document.createElement("div");
    container.append(notATriggerA);

    const notATriggerB = document.createElement("div");
    container.append(notATriggerB);

    for (const el of [triggerA, triggerB, notATriggerA, notATriggerB]) {
      el.classList.add("lisn-popup-trigger");
    }

    const contentId = randId();
    for (const el of [content, triggerA, triggerB]) {
      el.dataset.lisnPopupContentId = contentId;
    }

    notATriggerA.dataset.lisnPopupContentId = randId(); // not matching
    // notATriggerB has no lisn-popup-content-id => ignored

    await window.waitForMO();
    const widget = Popup.get(content);
    expect(widget).toBeInstanceOf(Popup);

    const triggers = widget.getTriggers();

    expect(triggers).toEqual([triggerA, triggerB]);

    await testClickTrigger(triggerA, widget, triggerB);
    await testClickTrigger(triggerB, widget, triggerA);

    await testNotATrigger(notATriggerA, widget, triggerA, triggerB);
    await testNotATrigger(notATriggerB, widget, triggerA, triggerB);
  });

  test("with data-lisn-*-trigger", async () => {
    const { container, content, triggerA, triggerB } = newElements();
    content.classList.add("lisn-popup");

    const notATriggerA = document.createElement("div");
    container.append(notATriggerA);

    const notATriggerB = document.createElement("div");
    container.append(notATriggerB);

    for (const el of [triggerA, triggerB, notATriggerA, notATriggerB]) {
      el.dataset.lisnPopupTrigger = "";
    }

    const contentId = randId();
    for (const el of [content, triggerA, triggerB]) {
      el.dataset.lisnPopupContentId = contentId;
    }

    notATriggerA.dataset.lisnPopupContentId = randId(); // not matching
    // notATriggerB has no lisn-popup-content-id => ignored

    await window.waitForMO();
    const widget = Popup.get(content);
    expect(widget).toBeInstanceOf(Popup);

    const triggers = widget.getTriggers();

    expect(triggers).toEqual([triggerA, triggerB]);

    await testClickTrigger(triggerA, widget, triggerB);
    await testClickTrigger(triggerB, widget, triggerA);

    await testNotATrigger(notATriggerA, widget, triggerA, triggerB);
    await testNotATrigger(notATriggerB, widget, triggerA, triggerB);
  });
});

describe("mixed hover and click triggers", () => {
  test("from explicit options", async () => {
    const { container, content, triggerA, triggerB } = newElements();

    const notATrigger = document.createElement("div");
    container.append(notATrigger); // ignored trigger
    notATrigger.classList.add("lisn-popup-trigger");

    const widget = new Popup(content, {
      triggers: new Map([
        [triggerA, { hover: true }],
        [triggerB, null],
      ]),
    });
    const triggers = widget.getTriggers();

    expect(triggers).toEqual([triggerA, triggerB]);

    await window.waitForAF();

    await testClickTrigger(triggerA, widget, triggerB);
    expect(widget.isOpen()).toBe(false);
    await testHoverTrigger(triggerA, true, widget, triggerB);
    await testClickTrigger(triggerB, widget, triggerA);
    await testNotAHoverTrigger(triggerB, widget, triggerA);

    await testNotATrigger(notATrigger, widget, triggerA, triggerB);
  });

  test("from DOM: common container v1", async () => {
    const { containerParent, content, triggerA, triggerB } = newElements();

    const notATrigger = document.createElement("div");
    containerParent.append(notATrigger); // not a common container with others

    content.classList.add("lisn-popup");
    for (const el of [triggerB, notATrigger]) {
      el.classList.add("lisn-popup-trigger");
    }
    triggerA.dataset.lisnPopupTrigger = "hover";

    await window.waitForMO();
    const widget = Popup.get(content);
    expect(widget).toBeInstanceOf(Popup);

    const triggers = widget.getTriggers();

    expect(triggers).toEqual([triggerA, triggerB]);

    await window.waitForAF();

    await testClickTrigger(triggerA, widget, triggerB);
    await testHoverTrigger(triggerA, true, widget, triggerB);
    await testClickTrigger(triggerB, widget, triggerA);
    await testNotAHoverTrigger(triggerB, widget, triggerA);

    await testNotATrigger(notATrigger, widget, triggerA, triggerB);
  });

  test("from DOM: common container v2", async () => {
    const { containerParent, content, triggerA, triggerB } = newElements();
    containerParent.classList.add("lisn-popup-container");

    const otherTrigger = document.createElement("div");
    containerParent.append(otherTrigger); // now it will be a trigger

    content.classList.add("lisn-popup");
    for (const el of [triggerB, otherTrigger]) {
      el.classList.add("lisn-popup-trigger");
    }
    triggerA.dataset.lisnPopupTrigger = "hover";

    await window.waitForMO();
    const widget = Popup.get(content);
    expect(widget).toBeInstanceOf(Popup);

    const triggers = widget.getTriggers();

    expect(triggers).toEqual([triggerA, triggerB, otherTrigger]);

    await window.waitForAF();

    await testClickTrigger(triggerA, widget, triggerB, otherTrigger);
    await testHoverTrigger(triggerA, true, widget, triggerB, otherTrigger);
    await testClickTrigger(triggerB, widget, triggerA, otherTrigger);
    await testNotAHoverTrigger(triggerB, widget, triggerA, otherTrigger);

    await testClickTrigger(otherTrigger, widget, triggerA, triggerB);
    await testNotAHoverTrigger(otherTrigger, widget, triggerA, triggerB);
  });

  test("from DOM: content ID", async () => {
    const { container, content, triggerA, triggerB } = newElements();
    content.classList.add("lisn-popup");

    const notATriggerA = document.createElement("div");
    container.append(notATriggerA);

    const notATriggerB = document.createElement("div");
    container.append(notATriggerB);

    for (const el of [triggerB, notATriggerA, notATriggerB]) {
      el.classList.add("lisn-popup-trigger");
    }
    triggerA.dataset.lisnPopupTrigger = "hover";

    const contentId = randId();
    for (const el of [content, triggerA, triggerB]) {
      el.dataset.lisnPopupContentId = contentId;
    }

    notATriggerA.dataset.lisnPopupContentId = randId(); // not matching
    // notATriggerB has no lisn-popup-content-id => ignored

    await window.waitForMO();
    const widget = Popup.get(content);
    expect(widget).toBeInstanceOf(Popup);

    const triggers = widget.getTriggers();

    expect(triggers).toEqual([triggerA, triggerB]);

    await window.waitForAF();

    await testClickTrigger(triggerA, widget, triggerB);
    await testHoverTrigger(triggerA, true, widget, triggerB);
    await testClickTrigger(triggerB, widget, triggerA);
    await testNotAHoverTrigger(triggerB, widget, triggerA);

    await testNotATrigger(notATriggerA, widget, triggerA, triggerB);
    await testNotATrigger(notATriggerB, widget, triggerA, triggerB);
  });

  test("with autoClose from trigger v1", async () => {
    const { container, content, triggerA, triggerB } = newElements();

    const notATrigger = document.createElement("div");
    container.append(notATrigger); // ignored trigger
    notATrigger.classList.add("lisn-popup-trigger");

    const widget = new Popup(content, {
      triggers: new Map([
        [triggerA, { hover: true, autoClose: true }],
        [triggerB, null],
      ]),
    });
    const triggers = widget.getTriggers();

    expect(triggers).toEqual([triggerA, triggerB]);

    await window.waitForAF();

    await testClickTrigger(triggerA, widget, triggerB);
    await testHoverTrigger(triggerA, true, widget, triggerB);
    await testClickTrigger(triggerB, widget, triggerA);
    await testNotAHoverTrigger(triggerB, widget, triggerA);

    await testNotATrigger(notATrigger, widget, triggerA, triggerB);
  });

  test("with autoClose from trigger v2", async () => {
    const { containerParent, content, triggerA, triggerB } = newElements();

    const notATrigger = document.createElement("div");
    containerParent.append(notATrigger); // not a common container with others

    content.classList.add("lisn-popup");
    for (const el of [triggerB, notATrigger]) {
      el.classList.add("lisn-popup-trigger");
    }
    triggerA.dataset.lisnPopupTrigger = "hover | auto-close";

    await window.waitForMO();
    const widget = Popup.get(content);
    expect(widget).toBeInstanceOf(Popup);

    const triggers = widget.getTriggers();

    expect(triggers).toEqual([triggerA, triggerB]);

    await testClickTrigger(triggerA, widget, triggerB);
    await testHoverTrigger(triggerA, true, widget, triggerB);
    await testClickTrigger(triggerB, widget, triggerA);
    await testNotAHoverTrigger(triggerB, widget, triggerA);

    await testNotATrigger(notATrigger, widget, triggerA, triggerB);
  });

  test("with autoClose from widget v1", async () => {
    const { container, content, triggerA, triggerB } = newElements();

    const notATrigger = document.createElement("div");
    container.append(notATrigger); // ignored trigger
    notATrigger.classList.add("lisn-popup-trigger");

    const widget = new Popup(content, {
      autoClose: true,
      triggers: new Map([
        [triggerA, { hover: true }],
        [triggerB, null],
      ]),
    });
    const triggers = widget.getTriggers();

    expect(triggers).toEqual([triggerA, triggerB]);

    await window.waitForAF();

    await testClickTrigger(triggerA, widget, triggerB);
    await testHoverTrigger(triggerA, true, widget, triggerB);
    await testClickTrigger(triggerB, widget, triggerA);
    await testNotAHoverTrigger(triggerB, widget, triggerA);

    await testNotATrigger(notATrigger, widget, triggerA, triggerB);
  });

  test("with autoClose from widget v2", async () => {
    const { container, content, triggerA, triggerB } = newElements();

    const notATrigger = document.createElement("div");
    container.append(notATrigger); // ignored trigger
    notATrigger.classList.add("lisn-modal-trigger");

    const widget = new Modal(content, {
      // default is auto-close
      triggers: new Map([
        [triggerA, { hover: true }],
        [triggerB, null],
      ]),
    });
    const triggers = widget.getTriggers();

    expect(triggers).toEqual([triggerA, triggerB]);

    await window.waitForAF();

    await testClickTrigger(triggerA, widget, triggerB);
    await testHoverTrigger(triggerA, true, widget, triggerB);
    await testClickTrigger(triggerB, widget, triggerA);
    await testNotAHoverTrigger(triggerB, widget, triggerA);

    await testNotATrigger(notATrigger, widget, triggerA, triggerB);
  });

  test("with autoClose false from trigger v1", async () => {
    const { container, content, triggerA, triggerB } = newElements();

    const notATrigger = document.createElement("div");
    container.append(notATrigger); // ignored trigger
    notATrigger.classList.add("lisn-popup-trigger");

    const widget = new Popup(content, {
      autoClose: true,
      triggers: new Map([
        [triggerA, { hover: true, autoClose: false }],
        [triggerB, null],
      ]),
    });
    const triggers = widget.getTriggers();

    expect(triggers).toEqual([triggerA, triggerB]);

    await window.waitForAF();

    await testClickTrigger(triggerA, widget, triggerB);
    await testHoverTrigger(triggerA, false, widget, triggerB);
    await testClickTrigger(triggerB, widget, triggerA);
    await testNotAHoverTrigger(triggerB, widget, triggerA);

    await testNotATrigger(notATrigger, widget, triggerA, triggerB);
  });

  test("with autoClose false from trigger v2", async () => {
    const { container, content, triggerA, triggerB } = newElements();

    const notATrigger = document.createElement("div");
    container.append(notATrigger); // ignored trigger
    notATrigger.classList.add("lisn-popup-trigger");

    const widget = new Popup(content, {
      autoClose: true,
      triggers: new Map([
        [triggerA, { hover: true, autoClose: false }],
        [triggerB, null],
      ]),
    });
    const triggers = widget.getTriggers();

    expect(triggers).toEqual([triggerA, triggerB]);

    await window.waitForAF();

    await testClickTrigger(triggerA, widget, triggerB);
    await testHoverTrigger(triggerA, false, widget, triggerB);
    await testClickTrigger(triggerB, widget, triggerA);
    await testNotAHoverTrigger(triggerB, widget, triggerA);

    await testNotATrigger(notATrigger, widget, triggerA, triggerB);
  });
});

describe("autoClose with triggers", () => {
  test("on document click", async () => {
    const { content, triggerA } = newElements();
    const widget = new Modal(content, { triggers: [triggerA] });
    await window.waitFor(100); // wait for listeners to be setup

    triggerA.dispatchEvent(new MouseEvent("click"));
    await window.waitForAF();
    expect(widget.isOpen()).toBe(true);

    await window.waitFor(200);
    document.dispatchEvent(new MouseEvent("click"));

    await window.waitForAF();
    expect(widget.isOpen()).toBe(false);
  });

  test("on Escape", async () => {
    const { content, triggerA } = newElements();
    const widget = new Modal(content, { triggers: [triggerA] });
    await window.waitFor(100); // wait for listeners to be setup

    triggerA.dispatchEvent(new MouseEvent("click"));
    await window.waitForAF();
    expect(widget.isOpen()).toBe(true);

    await window.waitFor(200);
    document.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }));

    await window.waitForAF();
    expect(widget.isOpen()).toBe(false);
  });
});

describe("autoClose with triggers, but opening manually", () => {
  test("on document click", async () => {
    const { content, triggerA } = newElements();
    const widget = new Modal(content, { triggers: [triggerA] });
    await window.waitFor(100); // wait for listeners to be setup

    await widget.open();
    expect(widget.isOpen()).toBe(true);

    await window.waitFor(200);
    document.dispatchEvent(new MouseEvent("click"));

    await window.waitForAF();
    expect(widget.isOpen()).toBe(false);
  });

  test("on Escape", async () => {
    const { content, triggerA } = newElements();
    const widget = new Modal(content, { triggers: [triggerA] });
    await window.waitFor(100); // wait for listeners to be setup

    await widget.open();
    expect(widget.isOpen()).toBe(true);

    await window.waitFor(200);
    document.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }));

    await window.waitForAF();
    expect(widget.isOpen()).toBe(false);
  });
});

describe("autoClose with no triggers", () => {
  test("on document click", async () => {
    const { content } = newElements();
    const widget = new Modal(content);
    await window.waitFor(100); // wait for listeners to be setup

    await widget.open();
    expect(widget.isOpen()).toBe(true);

    await window.waitFor(200);
    document.dispatchEvent(new MouseEvent("click"));

    await window.waitForAF();
    expect(widget.isOpen()).toBe(false);
  });

  test("on Escape", async () => {
    const { content } = newElements();
    const widget = new Modal(content);
    await window.waitFor(100); // wait for listeners to be setup

    await widget.open();
    await window.waitForAF();
    expect(widget.isOpen()).toBe(true);

    await window.waitFor(200);
    document.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }));

    await window.waitForAF();
    expect(widget.isOpen()).toBe(false);
  });
});

describe("autoClose OFF", () => {
  test("on document click", async () => {
    const { content, triggerA } = newElements();
    const widget = new Modal(content, {
      triggers: [triggerA],
      autoClose: false,
    });
    await window.waitFor(100); // wait for listeners to be setup

    triggerA.dispatchEvent(window.newClick());
    await window.waitForAF();
    expect(widget.isOpen()).toBe(true);

    await window.waitFor(200);
    document.dispatchEvent(window.newClick());

    await window.waitForAF();
    expect(widget.isOpen()).toBe(true);
  });

  test("on Escape", async () => {
    const { content, triggerA } = newElements();
    const widget = new Modal(content, {
      triggers: [triggerA],
      autoClose: false,
    });
    await window.waitFor(100); // wait for listeners to be setup

    triggerA.dispatchEvent(window.newClick());
    await window.waitForAF();
    expect(widget.isOpen()).toBe(true);

    await window.waitFor(200);
    document.dispatchEvent(window.newKeyUp("Escape"));

    await window.waitForAF();
    expect(widget.isOpen()).toBe(true);
  });
});

test("Openable.get", () => {
  const { container, content, triggerA } = newElements();

  const widget = new Openable(content, {
    name: "openable",
    triggers: [triggerA],
  });

  const root = widget.getRoot();

  for (const el of [content, triggerA]) {
    expect(Openable.get(el)).toBeInstanceOf(Openable);
  }

  for (const el of [container, root]) {
    expect(Openable.get(el)).toBe(null);
  }
});

describe("is registered", () => {
  for (const name of ["collapsible", "popup", "offcanvas", "modal"]) {
    test(`.lisn-${name}`, async () => {
      const element = document.createElement("div");
      element.classList.add(`lisn-${name}`);
      document.body.append(element);

      await window.waitForMO();

      expect(Openable.get(element)).toBeInstanceOf(Openable);
    });

    test(`[data-lisn-${name}]`, async () => {
      const element = document.createElement("div");
      element.setAttribute(`data-lisn-${name}`, "");
      document.body.append(element);

      await window.waitForMO();

      expect(Openable.get(element)).toBeInstanceOf(Openable);
    });
  }
});
