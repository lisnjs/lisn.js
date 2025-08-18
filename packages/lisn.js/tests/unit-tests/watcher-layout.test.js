const { jest, describe, test, expect } = require("@jest/globals");

const settings = window.LISN.settings;
const {
  isValidDevice,
  isValidAspectRatio,
  isValidDeviceList,
  isValidAspectRatioList,
  getOtherDevices,
  getOtherAspectRatios,
} = window.LISN.utils;
const { LayoutWatcher } = window.LISN.watchers;

const DEVICES = ["desktop", "tablet", "mobile-wide", "mobile"];

const ASPECT_RATIOS = ["very-wide", "wide", "square", "tall", "very-tall"];

// NOTE passing custom root to the watcher means its createOverlays method
// awaits 1 less time, which means that concurrent tests waiting for the next
// IntersectionObserver instances get messed up... This is really not an ideal
// way to retrieve the observer and overlays. TODO better way
const getNextObserver = async () => {
  return new Promise((resolve) => {
    window.IntersectionObserver.onNextInstance.push(resolve);
  });
};

const findOverlays = async () => {
  const observer = await getNextObserver();
  const overlays = {};
  for (const overlay of observer.targets) {
    const layout =
      overlay.dataset.lisnDevice || overlay.dataset.lisnAspectRatio;
    overlays[layout] = overlay;
  }

  return { observer, overlays };
};

const newWatcher = async (config = {}) => {
  const callback = jest.fn();
  const watcher = LayoutWatcher.create(config);

  const { overlays, observer } = await findOverlays(watcher);

  // The mock implementation of IntersectionObserver is dumb and doesn't
  // understand root margins so by default all overlays will be intersecting.
  // We manually set them to non-intersecting as the initial state (desktop and
  // very-wide).
  for (const l in overlays) {
    const overlay = overlays[l];
    observer.trigger(overlay, ["right"]);
  }
  await window.waitFor(50);

  return { callback, watcher, overlays, observer };
};

test("illegal constructor", () => {
  expect(() => new LayoutWatcher()).toThrow(/Illegal constructor/);
});

// XXX this is messing up the getNextObserver...
test.skip("create reusable", async () => {
  const defaultConfig = {
    root: null,
    deviceBreakpoints: settings.deviceBreakpoints,
    aspectRatioBreakpoints: settings.aspectRatioBreakpoints,
  };
  const watcherA = LayoutWatcher.reuse();
  const watcherB = LayoutWatcher.reuse(defaultConfig);
  const watcherC = LayoutWatcher.reuse({
    deviceBreakpoints: { desktop: 1024 }, // not default
  });
  const watcherD = LayoutWatcher.reuse({
    ...defaultConfig,
    deviceBreakpoints: { desktop: 1024 }, // not default
  });

  expect(watcherA).toBeInstanceOf(LayoutWatcher);
  expect(watcherA).toBe(watcherB);
  expect(watcherA).not.toBe(watcherC);

  expect(watcherC).toBeInstanceOf(LayoutWatcher);
  expect(watcherC).toBe(watcherD);
});

describe("initial call", () => {
  test("all default: first and subsequent of type", async () => {
    const { callback, watcher } = await newWatcher();
    await watcher.onLayout(callback);

    await window.waitForIO();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      {
        device: "desktop",
        aspectRatio: "very-wide",
      },
      watcher,
    );

    const callbackB = jest.fn();
    await watcher.onLayout(callbackB);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(1);
    expect(callbackB).toHaveBeenCalledWith(
      {
        device: "desktop",
        aspectRatio: "very-wide",
      },
      watcher,
    );
  });

  test("+skipInitial: first and subsequent of type", async () => {
    const { callback, watcher, overlays, observer } = await newWatcher();
    await watcher.onLayout(callback, { skipInitial: true });

    const callbackB = jest.fn();
    await watcher.onLayout(callbackB, { skipInitial: true });

    await window.waitForIO();

    expect(callback).toHaveBeenCalledTimes(0); // skipped
    expect(callbackB).toHaveBeenCalledTimes(0); // skipped

    const callbackC = jest.fn();
    await watcher.onLayout(callbackC, { skipInitial: true });

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(0); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(0); // no new calls
    expect(callbackC).toHaveBeenCalledTimes(0); // skipped

    // trigger call
    observer.trigger(overlays.desktop, ["at"]);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callbackB).toHaveBeenCalledTimes(1);
    expect(callbackC).toHaveBeenCalledTimes(1);

    const callbackD = jest.fn();
    await watcher.onLayout(callbackD, { skipInitial: true });

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackC).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackD).toHaveBeenCalledTimes(0); // skipped

    observer.trigger(overlays.tablet, ["at"]);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callbackB).toHaveBeenCalledTimes(2);
    expect(callbackC).toHaveBeenCalledTimes(2);
    expect(callbackD).toHaveBeenCalledTimes(1);
  });

  test("+matchig layouts: first and subsequent of type", async () => {
    const { callback, watcher } = await newWatcher();
    await watcher.onLayout(callback, { devices: "desktop" });

    await window.waitForIO();

    expect(callback).toHaveBeenCalledTimes(1);

    const callbackB = jest.fn();
    await watcher.onLayout(callbackB, { devices: "desktop" });

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(1);
  });

  test("+non-matchig layouts: first and subsequent of type", async () => {
    const { callback, watcher } = await newWatcher();
    await watcher.onLayout(callback, { devices: "tablet" });

    await window.waitForIO();

    expect(callback).toHaveBeenCalledTimes(0);

    const callbackB = jest.fn();
    await watcher.onLayout(callbackB, { devices: "tablet" });

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(0);
    expect(callbackB).toHaveBeenCalledTimes(0);
  });
});

describe("duplicate handler", () => {
  test("same options", async () => {
    const { callback, watcher, overlays, observer } = await newWatcher();
    await Promise.all([watcher.onLayout(callback), watcher.onLayout(callback)]);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(1); // initial call of 2nd one

    await watcher.onLayout(callback);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(2); // initial call

    observer.trigger(overlays.desktop, ["at"]);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(3);
  });

  test("different options", async () => {
    const { callback, watcher, overlays, observer } = await newWatcher();
    watcher.onLayout(callback); // removed immediately
    await watcher.onLayout(callback, { devices: "mobile-wide to desktop" });

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(1); // initial call

    await watcher.onLayout(callback, { devices: "desktop" });

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(2); // initial call

    observer.trigger(overlays.desktop, ["at"]); // mobile, no match

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(2); // no new calls
  });
});

describe("offLayout", () => {
  test("awaiting", async () => {
    const { callback, watcher, overlays, observer } = await newWatcher();
    await watcher.onLayout(callback);
    await watcher.offLayout(callback);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(1);

    observer.trigger(overlays.desktop, ["at"]);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
  });

  test("immediate", async () => {
    const { callback, watcher, overlays, observer } = await newWatcher();
    watcher.onLayout(callback);
    watcher.offLayout(callback);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(0);

    observer.trigger(overlays.desktop, ["at"]);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("with mismatching options", async () => {
    const { callback, watcher, overlays, observer } = await newWatcher();
    watcher.onLayout(callback, {
      devices: "mobile to tablet",
      aspectRatios: "very-tall to very-wide",
    });
    watcher.offLayout(callback);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(0);

    observer.trigger(overlays.desktop, ["at"]);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("immediate for subsequent of type and later for first of type", async () => {
    const { callback, watcher, overlays, observer } = await newWatcher();
    watcher.onLayout(callback);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(1);

    const callbackB = jest.fn();
    watcher.onLayout(callbackB);

    // remove both
    watcher.offLayout(callback);
    watcher.offLayout(callbackB);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
    expect(callbackB).toHaveBeenCalledTimes(0);

    observer.trigger(overlays.desktop, ["at"]);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callbackB).toHaveBeenCalledTimes(0);
  });
});

describe("devices", () => {
  test("invalid", async () => {
    const { callback, watcher } = await newWatcher();

    await expect(() =>
      watcher.onLayout(callback, {
        devices: "invalid",
      }),
    ).rejects.toThrow(/Invalid value for 'devices'/);

    await expect(() =>
      watcher.onLayout(callback, {
        devices: "min invalid",
      }),
    ).rejects.toThrow(/Unknown device/);

    await expect(() =>
      watcher.onLayout(callback, {
        devices: "max invalid",
      }),
    ).rejects.toThrow(/Unknown device/);

    await expect(() =>
      watcher.onLayout(callback, {
        devices: "desktop to invalid",
      }),
    ).rejects.toThrow(/Unknown device/);

    await expect(() =>
      watcher.onLayout(callback, {
        devices: "invalid to desktop",
      }),
    ).rejects.toThrow(/Unknown device/);

    await expect(() =>
      watcher.onLayout(callback, {
        devices: ["invalid"],
      }),
    ).rejects.toThrow(/Invalid value for 'devices'/);

    await expect(() =>
      watcher.onLayout(callback, {
        devices: false,
      }),
    ).rejects.toThrow(/'devices' must be a string or a string array/);
  });

  test("no call when aspect ratio changes", async () => {
    const { callback, watcher, overlays, observer } = await newWatcher();
    await watcher.onLayout(callback, {
      devices: DEVICES,
    });

    await window.waitForIO();

    expect(callback).toHaveBeenCalledTimes(1); // initial

    // trigger wide
    observer.trigger(overlays["very-wide"], ["at"]);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
  });

  test("array", async () => {
    const { callback, watcher, overlays, observer } = await newWatcher();
    await watcher.onLayout(callback, {
      devices: ["tablet", "desktop"],
    });

    await window.waitForIO();

    expect(callback).toHaveBeenCalledTimes(1); // initial

    // trigger tablet
    observer.trigger(overlays.desktop, ["at"]);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(2);

    // trigger mobile-wide
    observer.trigger(overlays.tablet, ["at"]);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(2); // no new calls
  });

  test("comma-separated string with spaces", async () => {
    const { callback, watcher, overlays, observer } = await newWatcher();
    await watcher.onLayout(callback, {
      devices: "tablet, desktop",
    });

    await window.waitForIO();

    expect(callback).toHaveBeenCalledTimes(1); // initial

    // trigger tablet
    observer.trigger(overlays.desktop, ["at"]);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(2);

    // trigger mobile-wide
    observer.trigger(overlays.tablet, ["at"]);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(2); // no new calls
  });

  for (const device of DEVICES) {
    // TODO test.each
    test("specific device: " + device, async () => {
      const { callback, watcher, overlays, observer } = await newWatcher();
      await watcher.onLayout(callback, { devices: device });

      await window.waitForIO();

      // initial device is desktop
      let nCalls = device === "desktop" ? 1 : 0;
      expect(callback).toHaveBeenCalledTimes(nCalls);

      // trigger tablet
      observer.trigger(overlays.desktop, ["at"]);

      await window.waitForIO();
      nCalls += device === "tablet" ? 1 : 0;
      expect(callback).toHaveBeenCalledTimes(nCalls);

      // trigger mobile-wide
      observer.trigger(overlays.tablet, ["at"]);

      await window.waitForIO();
      nCalls += device === "mobile-wide" ? 1 : 0;
      expect(callback).toHaveBeenCalledTimes(nCalls);

      // trigger mobile
      observer.trigger(overlays["mobile-wide"], ["at"]);

      await window.waitForIO();
      nCalls += device === "mobile" ? 1 : 0;
      expect(callback).toHaveBeenCalledTimes(nCalls);
    });
  }

  for (const [spec, expectMatches] of [
    // TODO test.each
    ["min mobile", new Set(DEVICES)],
    ["min mobile-wide", new Set(["mobile-wide", "tablet", "desktop"])],
    ["min tablet", new Set(["tablet", "desktop"])],
    ["min desktop", new Set(["desktop"])],

    ["max desktop", new Set(DEVICES)],
    ["max tablet", new Set(["mobile", "mobile-wide", "tablet"])],
    ["max mobile-wide", new Set(["mobile", "mobile-wide"])],
    ["max mobile", new Set(["mobile"])],

    ["mobile to desktop", new Set(DEVICES)],
    ["mobile-wide to desktop", new Set(["mobile-wide", "tablet", "desktop"])],
    ["tablet to desktop", new Set(["tablet", "desktop"])],
    ["desktop to desktop", new Set(["desktop"])],

    ["mobile to tablet", new Set(["mobile", "mobile-wide", "tablet"])],
    ["mobile-wide to tablet", new Set(["mobile-wide", "tablet"])],
    ["tablet to tablet", new Set(["tablet"])],
    ["desktop to tablet", new Set(["tablet", "desktop"])],

    ["mobile to mobile-wide", new Set(["mobile", "mobile-wide"])],
    ["mobile-wide to mobile-wide", new Set(["mobile-wide"])],
    ["tablet to mobile-wide", new Set(["mobile-wide", "tablet"])],
    ["desktop to mobile-wide", new Set(["mobile-wide", "tablet", "desktop"])],

    ["mobile to mobile", new Set(["mobile"])],
    ["mobile-wide to mobile", new Set(["mobile", "mobile-wide"])],
    ["tablet to mobile", new Set(["mobile", "mobile-wide", "tablet"])],
    ["desktop to mobile", new Set(DEVICES)],
  ]) {
    test("range specification: " + spec, async () => {
      const { callback, watcher, overlays, observer } = await newWatcher();
      await watcher.onLayout(callback, { devices: spec });

      await window.waitForIO();

      // initial device is desktop
      let nCalls = expectMatches.has("desktop") ? 1 : 0;
      expect(callback).toHaveBeenCalledTimes(nCalls);

      // trigger tablet
      observer.trigger(overlays.desktop, ["at"]);

      await window.waitForIO();
      nCalls += expectMatches.has("tablet") ? 1 : 0;
      expect(callback).toHaveBeenCalledTimes(nCalls);

      // trigger mobile-wide
      observer.trigger(overlays.tablet, ["at"]);

      await window.waitForIO();
      nCalls += expectMatches.has("mobile-wide") ? 1 : 0;
      expect(callback).toHaveBeenCalledTimes(nCalls);

      // trigger mobile
      observer.trigger(overlays["mobile-wide"], ["at"]);

      await window.waitForIO();
      nCalls += expectMatches.has("mobile") ? 1 : 0;
      expect(callback).toHaveBeenCalledTimes(nCalls);
    });
  }
});

describe("aspectRatios", () => {
  test("invalid", async () => {
    const { callback, watcher } = await newWatcher();

    await expect(() =>
      watcher.onLayout(callback, {
        aspectRatios: "invalid",
      }),
    ).rejects.toThrow(/Invalid value for 'aspectRatios'/);

    await expect(() =>
      watcher.onLayout(callback, {
        aspectRatios: "min invalid",
      }),
    ).rejects.toThrow(/Unknown aspectRatio/);

    await expect(() =>
      watcher.onLayout(callback, {
        aspectRatios: "max invalid",
      }),
    ).rejects.toThrow(/Unknown aspectRatio/);

    await expect(() =>
      watcher.onLayout(callback, {
        aspectRatios: "wide to invalid",
      }),
    ).rejects.toThrow(/Unknown aspectRatio/);

    await expect(() =>
      watcher.onLayout(callback, {
        aspectRatios: "invalid to wide",
      }),
    ).rejects.toThrow(/Unknown aspectRatio/);

    await expect(() =>
      watcher.onLayout(callback, {
        aspectRatios: ["invalid"],
      }),
    ).rejects.toThrow(/Invalid value for 'aspectRatios'/);

    await expect(() =>
      watcher.onLayout(callback, {
        aspectRatios: false,
      }),
    ).rejects.toThrow(/'aspectRatios' must be a string or a string array/);
  });

  test("no call when device changes", async () => {
    const { callback, watcher, overlays, observer } = await newWatcher();
    await watcher.onLayout(callback, {
      aspectRatios: ASPECT_RATIOS,
    });

    await window.waitForIO();

    expect(callback).toHaveBeenCalledTimes(1); // initial

    // trigger tablet
    observer.trigger(overlays.desktop, ["at"]);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(1); // no new calls
  });

  test("array", async () => {
    const { callback, watcher, overlays, observer } = await newWatcher();
    await watcher.onLayout(callback, {
      aspectRatios: ["wide", "very-wide"],
    });

    await window.waitForIO();

    expect(callback).toHaveBeenCalledTimes(1); // initial

    // trigger wide
    observer.trigger(overlays["very-wide"], ["at"]);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("comma-separated string with spaces", async () => {
    const { callback, watcher, overlays, observer } = await newWatcher();
    await watcher.onLayout(callback, {
      aspectRatios: "wide, very-wide",
    });

    await window.waitForIO();

    expect(callback).toHaveBeenCalledTimes(1); // initial

    // trigger wide
    observer.trigger(overlays["very-wide"], ["at"]);

    await window.waitForIO();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  for (const aspectRatio of ASPECT_RATIOS) {
    // TODO test.each
    test("specific aspectRatio: " + aspectRatio, async () => {
      const { callback, watcher, overlays, observer } = await newWatcher();
      await watcher.onLayout(callback, { aspectRatios: aspectRatio });

      await window.waitForIO();

      // initial aspectRatio is very-wide
      let nCalls = aspectRatio === "very-wide" ? 1 : 0;
      expect(callback).toHaveBeenCalledTimes(nCalls);

      // trigger wide
      observer.trigger(overlays["very-wide"], ["at"]);

      await window.waitForIO();
      nCalls += aspectRatio === "wide" ? 1 : 0;
      expect(callback).toHaveBeenCalledTimes(nCalls);

      // trigger square
      observer.trigger(overlays.wide, ["at"]);

      await window.waitForIO();
      nCalls += aspectRatio === "square" ? 1 : 0;
      expect(callback).toHaveBeenCalledTimes(nCalls);

      // trigger tall
      observer.trigger(overlays.square, ["at"]);

      await window.waitForIO();
      nCalls += aspectRatio === "tall" ? 1 : 0;
      expect(callback).toHaveBeenCalledTimes(nCalls);

      // trigger very-tall
      observer.trigger(overlays.tall, ["at"]);

      await window.waitForIO();
      nCalls += aspectRatio === "very-tall" ? 1 : 0;
      expect(callback).toHaveBeenCalledTimes(nCalls);
    });
  }

  for (const [spec, expectMatches] of [
    // TODO test.each
    ["min very-tall", new Set(ASPECT_RATIOS)],
    ["min tall", new Set(["tall", "square", "wide", "very-wide"])],
    ["min square", new Set(["square", "wide", "very-wide"])],
    ["min wide", new Set(["wide", "very-wide"])],
    ["min very-wide", new Set(["very-wide"])],

    ["max very-wide", new Set(ASPECT_RATIOS)],
    ["max wide", new Set(["very-tall", "tall", "square", "wide"])],
    ["max square", new Set(["very-tall", "tall", "square"])],
    ["max tall", new Set(["very-tall", "tall"])],
    ["max very-tall", new Set(["very-tall"])],

    ["very-tall to very-wide", new Set(ASPECT_RATIOS)],
    ["tall to very-wide", new Set(["tall", "square", "wide", "very-wide"])],
    ["square to very-wide", new Set(["square", "wide", "very-wide"])],
    ["wide to very-wide", new Set(["wide", "very-wide"])],
    ["very-wide to very-wide", new Set(["very-wide"])],

    ["very-tall to wide", new Set(["very-tall", "tall", "square", "wide"])],
    ["tall to wide", new Set(["tall", "square", "wide"])],
    ["square to wide", new Set(["square", "wide"])],
    ["wide to wide", new Set(["wide"])],
    ["very-wide to wide", new Set(["wide", "very-wide"])],

    ["very-tall to square", new Set(["very-tall", "tall", "square"])],
    ["tall to square", new Set(["tall", "square"])],
    ["square to square", new Set(["square"])],
    ["wide to square", new Set(["square", "wide"])],
    ["very-wide to square", new Set(["square", "wide", "very-wide"])],

    ["very-tall to tall", new Set(["very-tall", "tall"])],
    ["tall to tall", new Set(["tall"])],
    ["square to tall", new Set(["tall", "square"])],
    ["wide to tall", new Set(["tall", "square", "wide"])],
    ["very-wide to tall", new Set(["tall", "square", "wide", "very-wide"])],

    ["very-tall to very-tall", new Set(["very-tall"])],
    ["tall to very-tall", new Set(["very-tall", "tall"])],
    ["square to very-tall", new Set(["very-tall", "tall", "square"])],
    ["wide to very-tall", new Set(["very-tall", "tall", "square", "wide"])],
    ["very-wide to very-tall", new Set(ASPECT_RATIOS)],
  ]) {
    test("range specification: " + spec, async () => {
      const { callback, watcher, overlays, observer } = await newWatcher();
      await watcher.onLayout(callback, { aspectRatios: spec });

      await window.waitForIO();

      // initial aspectRatio is very-wide
      let nCalls = expectMatches.has("very-wide") ? 1 : 0;
      expect(callback).toHaveBeenCalledTimes(nCalls);

      // trigger wide
      observer.trigger(overlays["very-wide"], ["at"]);

      await window.waitForIO();
      nCalls += expectMatches.has("wide") ? 1 : 0;
      expect(callback).toHaveBeenCalledTimes(nCalls);

      // trigger square
      observer.trigger(overlays.wide, ["at"]);

      await window.waitForIO();
      nCalls += expectMatches.has("square") ? 1 : 0;
      expect(callback).toHaveBeenCalledTimes(nCalls);

      // trigger tall
      observer.trigger(overlays.square, ["at"]);

      await window.waitForIO();
      nCalls += expectMatches.has("tall") ? 1 : 0;
      expect(callback).toHaveBeenCalledTimes(nCalls);

      // trigger very-tall
      observer.trigger(overlays.tall, ["at"]);

      await window.waitForIO();
      nCalls += expectMatches.has("very-tall") ? 1 : 0;
      expect(callback).toHaveBeenCalledTimes(nCalls);
    });
  }
});

test("custom root: waiting for ready + overlay props + custom breakpoints", async () => {
  const rootEl = document.createElement("div");
  document.body.append(rootEl);

  const { overlays, watcher } = await newWatcher({
    root: rootEl,
    deviceBreakpoints: {
      desktop: 1024,
      tablet: 820,
    },
    aspectRatioBreakpoints: {
      tall: 1 / 2,
      "very-wide": 2,
    },
  });

  const currLayout = await watcher.fetchCurrentLayout();
  expect(currLayout.device).toBe("desktop");
  expect(currLayout.aspectRatio).toBe("very-wide");

  expect(overlays.desktop.style.width).toBe("1024px");
  expect(overlays.tablet.style.width).toBe("820px");
  expect(overlays["mobile-wide"].style.width).toBe("576px"); // default
  expect(overlays.mobile.style.width).toBe("0px"); // default

  // TODO jsdom does not support this syntax (values using "var") and silently
  // drops the style when set
  // const parH = "var(--lisn-js--border-height, 0) \\* 1px";
  // const arCssW = (ar) => RegExp(`^calc\\( *${ar} +\\* +${parH} *\\)$`);
  // expect(overlays["very-wide"].style.width).toMatch(arCssW(2));
  // expect(overlays.wide.style.width).toMatch(arCssW(4 / 3)); // default
  // expect(overlays.square.style.width).toMatch(arCssW(3 / 4)); // default
  // expect(overlays.tall.style.width).toMatch(arCssW(1 / 2));
  // expect(overlays["very-tall"].style.width).toMatch(arCssW(0)); // default

  for (const k in overlays) {
    expect(overlays[k].parentElement).toBe(rootEl);
    expect(overlays[k].style.position).toBe("absolute");
  }
});

test("default root: overlay props + custom breakpoints", async () => {
  const { overlays } = await newWatcher({
    deviceBreakpoints: {
      desktop: 1024,
      tablet: 820,
    },
    aspectRatioBreakpoints: {
      tall: 1 / 2,
      "very-wide": 2,
    },
  });

  expect(overlays.desktop.style.width).toBe("1024px");
  expect(overlays.tablet.style.width).toBe("820px");
  expect(overlays["mobile-wide"].style.width).toBe("576px"); // default
  expect(overlays.mobile.style.width).toBe("0px"); // default

  const arCssW = (ar) => RegExp(`^calc\\( *${ar} *\\* *100vh *\\)$`);
  expect(overlays["very-wide"].style.width).toMatch(arCssW(2));
  expect(overlays.wide.style.width).toMatch(arCssW(4 / 3)); // default
  expect(overlays.square.style.width).toMatch(arCssW(3 / 4)); // default
  expect(overlays.tall.style.width).toMatch(arCssW(1 / 2));
  expect(overlays["very-tall"].style.width).toMatch(arCssW(0)); // default

  for (const k in overlays) {
    const parent = overlays[k].parentElement;
    expect(parent.classList.contains("lisn-overlay")).toBe(true);
    expect(parent.style.position).toBe("fixed");
    expect(overlays[k].style.position).toBe("absolute");
  }
});

test("fetchCurrentLayout", async () => {
  const { watcher, overlays, observer } = await newWatcher();

  await window.waitForIO();

  await expect(watcher.fetchCurrentLayout()).resolves.toEqual({
    device: "desktop",
    aspectRatio: "very-wide",
  });

  // trigger wide and tablet
  observer.trigger(overlays.desktop, ["at"]);
  observer.trigger(overlays["very-wide"], ["at"]);

  await window.waitForIO();
  await expect(watcher.fetchCurrentLayout()).resolves.toEqual({
    device: "tablet",
    aspectRatio: "wide",
  });
});

test("layout jumping or duplicate intersections", async () => {
  const { watcher, overlays, observer } = await newWatcher();

  await window.waitForIO();

  await expect(watcher.fetchCurrentLayout()).resolves.toEqual({
    device: "desktop",
    aspectRatio: "very-wide",
  });

  // trigger tall (out of order intersections)
  observer.trigger(overlays["very-wide"], ["at"]);
  observer.trigger(overlays.square, ["at"]);
  observer.trigger(overlays.wide, ["at"]);

  // trigger mobile-wide (out of order intersections)
  observer.trigger(overlays.tablet, ["at"]);
  observer.trigger(overlays.desktop, ["at"]);

  await window.waitForIO();
  await expect(watcher.fetchCurrentLayout()).resolves.toEqual({
    device: "mobile-wide",
    aspectRatio: "tall",
  });

  // duplicate entries
  observer.trigger(overlays.square, ["at"]);
  observer.trigger(overlays.desktop, ["at"]);

  await window.waitForIO();
  await expect(watcher.fetchCurrentLayout()).resolves.toEqual({
    device: "mobile-wide",
    aspectRatio: "tall",
  });
});

describe("isValidDevice", () => {
  for (const device of DEVICES) {
    test(device, () => {
      expect(isValidDevice(device)).toBe(true);
    });
  }

  test("invalid", () => {
    expect(isValidDevice("min tablet")).toBe(false);
    expect(isValidDevice("square")).toBe(false);
    expect(isValidDevice("")).toBe(false);
    expect(isValidDevice(" ")).toBe(false);
    expect(isValidDevice(" , ")).toBe(false);
    expect(isValidDevice("random")).toBe(false);
    expect(isValidDevice("random to invalid")).toBe(false);
  });
});

describe("isValidAspectRatio", () => {
  for (const aspectRatio of ASPECT_RATIOS) {
    test(aspectRatio, () => {
      expect(isValidAspectRatio(aspectRatio)).toBe(true);
    });
  }

  test("invalid", () => {
    expect(isValidAspectRatio("min square")).toBe(false);
    expect(isValidAspectRatio("tablet")).toBe(false);
    expect(isValidAspectRatio("")).toBe(false);
    expect(isValidAspectRatio(" ")).toBe(false);
    expect(isValidAspectRatio(" , ")).toBe(false);
    expect(isValidAspectRatio("random")).toBe(false);
    expect(isValidAspectRatio("random to invalid")).toBe(false);
  });
});

describe("isValidDeviceList", () => {
  for (const device of DEVICES) {
    test(device, () => {
      expect(isValidDeviceList(device)).toBe(true);
      expect(isValidDeviceList("min " + device)).toBe(true);
      expect(isValidDeviceList("max " + device)).toBe(true);
    });
  }

  test("X to X", () => {
    expect(isValidDeviceList("mobile-wide to tablet")).toBe(true);
  });

  test("list of multiple", () => {
    expect(isValidDeviceList("mobile-wide,tablet")).toBe(true);
    expect(isValidDeviceList(["mobile-wide", "tablet"])).toBe(true);
  });

  test("invalid", () => {
    expect(isValidDeviceList("square")).toBe(false);
    expect(isValidDeviceList([])).toBe(false);
    expect(isValidDeviceList([""])).toBe(false);
    expect(isValidDeviceList("")).toBe(false);
    expect(isValidDeviceList(" ")).toBe(false);
    expect(isValidDeviceList(" , ")).toBe(false);
    expect(isValidDeviceList("random")).toBe(false);
    expect(isValidDeviceList("random to invalid")).toBe(false);
  });
});

describe("isValidAspectRatioList", () => {
  for (const aspectRatio of ASPECT_RATIOS) {
    test(aspectRatio, () => {
      expect(isValidAspectRatioList(aspectRatio)).toBe(true);
      expect(isValidAspectRatioList("min " + aspectRatio)).toBe(true);
      expect(isValidAspectRatioList("max " + aspectRatio)).toBe(true);
    });
  }

  test("X to X", () => {
    expect(isValidAspectRatioList("tall to wide")).toBe(true);
  });

  test("list of multiple", () => {
    expect(isValidAspectRatioList("square,wide")).toBe(true);
    expect(isValidAspectRatioList(["square", "wide"])).toBe(true);
  });

  test("invalid", () => {
    expect(isValidAspectRatioList("desktop")).toBe(false);
    expect(isValidAspectRatioList([])).toBe(false);
    expect(isValidAspectRatioList([""])).toBe(false);
    expect(isValidAspectRatioList("")).toBe(false);
    expect(isValidAspectRatioList(" ")).toBe(false);
    expect(isValidAspectRatioList(" , ")).toBe(false);
    expect(isValidAspectRatioList("random")).toBe(false);
    expect(isValidAspectRatioList("random to invalid")).toBe(false);
  });
});

describe("getOtherDevices", () => {
  test("selected ones", () => {
    expect(getOtherDevices("")).toEqual([]);
    expect(getOtherDevices([])).toEqual([]);

    expect(getOtherDevices("desktop").sort()).toEqual(
      ["tablet", "mobile-wide", "mobile"].sort(),
    );

    expect(getOtherDevices("tablet").sort()).toEqual(
      ["desktop", "mobile-wide", "mobile"].sort(),
    );

    expect(getOtherDevices("min desktop").sort()).toEqual(
      ["tablet", "mobile-wide", "mobile"].sort(),
    );

    expect(getOtherDevices("min tablet").sort()).toEqual(
      ["mobile-wide", "mobile"].sort(),
    );

    expect(getOtherDevices("min mobile").sort()).toEqual([]);

    expect(getOtherDevices("max desktop")).toEqual([]);

    expect(getOtherDevices("max tablet")).toEqual(["desktop"]);

    expect(getOtherDevices("max mobile").sort()).toEqual(
      ["desktop", "tablet", "mobile-wide"].sort(),
    );
  });

  test("invalid", () => {
    expect(() => getOtherDevices("invalid")).toThrow(
      /Invalid value for 'devices'/,
    );
  });
});

describe("getOtherAspectRatios", () => {
  test("selected ones", () => {
    expect(getOtherAspectRatios("")).toEqual([]);
    expect(getOtherAspectRatios([])).toEqual([]);

    expect(getOtherAspectRatios("very-wide").sort()).toEqual(
      ["wide", "square", "tall", "very-tall"].sort(),
    );

    expect(getOtherAspectRatios("square").sort()).toEqual(
      ["very-wide", "wide", "tall", "very-tall"].sort(),
    );

    expect(getOtherAspectRatios("min very-wide").sort()).toEqual(
      ["wide", "square", "tall", "very-tall"].sort(),
    );

    expect(getOtherAspectRatios("min square").sort()).toEqual(
      ["tall", "very-tall"].sort(),
    );

    expect(getOtherAspectRatios("min very-tall")).toEqual([]);

    expect(getOtherAspectRatios("max very-wide")).toEqual([]);

    expect(getOtherAspectRatios("max square").sort()).toEqual(
      ["wide", "very-wide"].sort(),
    );

    expect(getOtherAspectRatios("max very-tall").sort()).toEqual(
      ["very-wide", "wide", "square", "tall"].sort(),
    );
  });

  test("invalid", () => {
    expect(() => getOtherAspectRatios("invalid")).toThrow(
      /Invalid value for 'aspectRatios'/,
    );
  });
});
