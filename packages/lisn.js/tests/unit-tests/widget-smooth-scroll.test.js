const { describe, test, expect } = require("@jest/globals");

const { SmoothScroll } = window.LISN.widgets;
const { FXComposer, FXScrollTrigger } = window.LISN.effects;

const smoothScrollPromise = window.LISN.utils.waitForElement(() =>
  document.querySelector(".lisn-smooth-scroll__root"),
);

const CONTAINER = document.createElement("div");
CONTAINER.id = "container";

const ORIGINAL_MAIN_CHILDREN = [
  CONTAINER,
  document.createElement("div"),
  document.createElement("div"),
];
document.body.append(...ORIGINAL_MAIN_CHILDREN);

SmoothScroll.enableMain();

const newWidget = async (existingWrappers = false) => {
  const ensureIsWrapped = (isDestroyed = false) => {
    if (isDestroyed) {
      expect(root.children.length).toBe(1);
    } else {
      expect(root.children.length).toBe(2);
      expect(root.children[1]).toBe(overflowDummy);
    }
    expect(root.children[0]).toBe(pinWrapper);

    expect(pinWrapper.children.length).toBe(1);
    expect(pinWrapper.children[0]).toBe(contentWrapper);

    expect(contentWrapper.children.length).toBe(originalChildren.length);
    for (let i = 0; i < contentWrapper.children.length; i++) {
      expect(contentWrapper.children[i]).toBe(originalChildren[i]);
    }
  };

  const ensureIsUnwrapped = () => {
    expect(root.children.length).toBe(originalChildren.length);
    for (let i = 0; i < root.children.length; i++) {
      expect(root.children[i]).toBe(originalChildren[i]);
    }
    expect(overflowDummy.parentElement).toBe(null);
  };

  const ensureIsRestored = () => {
    expect(root.classList.contains("lisn-smooth-scroll__root")).toBe(false);

    if (existingWrappers) {
      ensureIsWrapped(true);
      expect(pinWrapper.classList.contains("lisn-smooth-scroll__pin")).toBe(
        true,
      );
      expect(
        contentWrapper.classList.contains("lisn-smooth-scroll__content"),
      ).toBe(true);
    } else {
      ensureIsUnwrapped();
    }
  };

  // ------------------------------

  const root = document.createElement("div");
  root.enableScroll();

  const originalChildren = [
    document.createElement("div"),
    document.createElement("div"),
  ];

  let pinWrapper = null;
  let contentWrapper = null;
  let overflowDummy;

  CONTAINER.append(root);
  if (existingWrappers) {
    pinWrapper = document.createElement("div");
    pinWrapper.classList.add("lisn-smooth-scroll__pin");

    contentWrapper = document.createElement("div");
    contentWrapper.classList.add("lisn-smooth-scroll__content");

    root.append(pinWrapper);
    pinWrapper.append(contentWrapper);
    contentWrapper.append(...originalChildren);
  } else {
    root.append(...originalChildren);
  }

  const widget = new SmoothScroll(root);

  await window.waitFor(300);

  if (!existingWrappers) {
    pinWrapper = root.children[0];
    contentWrapper = pinWrapper.children[0];
  }

  overflowDummy = root.children[1];

  expect(root.classList.contains("lisn-smooth-scroll__root")).toBe(true);
  expect(pinWrapper.classList.contains("lisn-smooth-scroll__pin")).toBe(true);
  expect(contentWrapper.classList.contains("lisn-smooth-scroll__content")).toBe(
    true,
  );
  expect(overflowDummy.classList.contains("lisn-smooth-scroll__overflow")).toBe(
    true,
  );

  ensureIsWrapped();

  return { root, widget, ensureIsRestored };
};

test("enableMain", async () => {
  const root = await smoothScrollPromise;
  expect(root).toBe(document.body);

  const widget = SmoothScroll.get();
  expect(widget).toBeInstanceOf(SmoothScroll);
  expect(SmoothScroll.get(document.body)).toBe(widget);
  expect(SmoothScroll.get(document.documentElement)).toBe(widget);

  expect(root.classList.contains("lisn-smooth-scroll__root")).toBe(true);
  expect(root.children.length).toBe(1);
  const contentWrapper = root.children[0];
  expect(contentWrapper.classList.contains("lisn-smooth-scroll__content")).toBe(
    true,
  );
  expect(contentWrapper.children.length).toBe(ORIGINAL_MAIN_CHILDREN.length);
  for (let i = 0; i < ORIGINAL_MAIN_CHILDREN.length; i++) {
    expect(contentWrapper.children[i]).toBe(ORIGINAL_MAIN_CHILDREN[i]);
  }

  await widget.destroy();
  expect(root.classList.contains("lisn-smooth-scroll__root")).toBe(false);
  expect(root.children.length).toBe(ORIGINAL_MAIN_CHILDREN.length);
  for (let i = 0; i < ORIGINAL_MAIN_CHILDREN.length; i++) {
    expect(root.children[i]).toBe(ORIGINAL_MAIN_CHILDREN[i]);
  }
});

describe("basic", () => {
  test("custom element, all default", async () => {
    const { widget, ensureIsRestored } = await newWidget();
    await widget.destroy();
    ensureIsRestored();
  });

  test("custom element, existing wrappers", async () => {
    const { widget, ensureIsRestored } = await newWidget(true);
    await widget.destroy();
    ensureIsRestored();
  });
});

describe("composer config", () => {
  test("all default", () => {
    const root = document.createElement("div");
    root.enableScroll();
    const widget = new SmoothScroll(root);
    const composer = widget.getComposer();

    expect(composer).toBeInstanceOf(FXComposer);
    expect([...composer.getComposition().keys()]).toEqual(["transform"]);

    const config = composer.getConfig();
    expect(config.trigger).toBeInstanceOf(FXScrollTrigger);
    expect(config.parent).toBeUndefined();
    expect(config.negate).toBeUndefined();
    expect(config.tweener).toBe("spring");
    expect(config.lagX).toBe(window.LISN.settings.effectLag);
    expect(config.lagY).toBe(window.LISN.settings.effectLag);
    expect(config.lagZ).toBe(0);
    expect(config.depthX).toBe(1);
    expect(config.depthY).toBe(1);
    expect(config.depthZ).toBe(1);
  });

  test("all custom", () => {
    const root = document.createElement("div");
    root.enableScroll();

    const inputConfig = {
      tweener: { x: "spring", y: "linear" },
      lag: 300,
      lagY: 100,
      depth: 2, // ignored
      depthY: 3, // ignored
    };
    const widget = new SmoothScroll(root, inputConfig);
    const composer = widget.getComposer();

    expect(composer).toBeInstanceOf(FXComposer);
    expect([...composer.getComposition().keys()]).toEqual(["transform"]);

    const config = composer.getConfig();
    expect(config.trigger).toBeInstanceOf(FXScrollTrigger);
    expect(config.parent).toBeUndefined();
    expect(config.negate).toBeUndefined();
    expect(config.tweener).toEqual({ ...inputConfig.tweener, z: "spring" });
    expect(config.lagX).toBe(inputConfig.lag);
    expect(config.lagY).toBe(inputConfig.lagY);
    expect(config.lagZ).toBe(0);
    expect(config.depthX).toBe(1);
    expect(config.depthY).toBe(1);
    expect(config.depthZ).toBe(1);
  });

  test("defaultEffects = false", () => {
    const root = document.createElement("div");
    root.enableScroll();
    const widget = new SmoothScroll(root, { defaultEffects: false });
    const composer = widget.getComposer();

    expect(composer).toBeInstanceOf(FXComposer);
    expect(composer.getComposition().size).toBe(0);
  });

  for (const useMap of [true, false]) {
    test(`with layer with no config (using ${useMap ? "map" : "array"})`, () => {
      const root = document.createElement("div");
      root.enableScroll();

      const layer = document.createElement("div");
      root.append(layer);

      const inputConfig = {
        tweener: "linear",
        lag: 300,
        lagY: 100,
        depth: 2, // ignored
        depthY: 3, // ignored
        layers: useMap ? new Map([[layer, {}]]) : [layer],
      };
      const widget = new SmoothScroll(root, inputConfig);
      const composerRoot = widget.getComposer();
      const composerLayer = widget.getComposer(layer);

      for (const composer of [composerRoot, composerLayer]) {
        expect(composer).toBeInstanceOf(FXComposer);
        expect([...composer.getComposition().keys()]).toEqual(["transform"]);

        const config = composer.getConfig();
        if (composer === composerRoot) {
          expect(config.parent).toBeUndefined();
          expect(config.negate).toBeUndefined();
        } else {
          expect(config.parent).toBe(composerRoot);
          expect(config.negate).toBe(composerRoot);
        }

        expect(config.trigger).toBeInstanceOf(FXScrollTrigger);
        expect(config.tweener).toBe(inputConfig.tweener);
        expect(config.lagX).toBe(inputConfig.lag);
        expect(config.lagY).toBe(inputConfig.lagY);
        expect(config.lagZ).toBe(0);
        expect(config.depthX).toBe(1);
        expect(config.depthY).toBe(1);
        expect(config.depthZ).toBe(1);
      }
    });

    test(`defaultEffects = false: with layer with no config (using ${useMap ? "map" : "array"})`, () => {
      const root = document.createElement("div");
      root.enableScroll();

      const layer = document.createElement("div");
      root.append(layer);

      const widget = new SmoothScroll(root, {
        defaultEffects: false,
        layers: useMap ? new Map([[layer, {}]]) : [layer],
      });
      const composerRoot = widget.getComposer();
      const composerLayer = widget.getComposer(layer);

      for (const composer of [composerRoot, composerLayer]) {
        expect(composer).toBeInstanceOf(FXComposer);
        expect(composer.getComposition().size).toBe(0);
      }
    });
  }

  test("with layer with config", () => {
    const root = document.createElement("div");
    root.enableScroll();

    const layer = document.createElement("div");
    root.append(layer);

    const inputLayerConfig = {
      tweener: "cubic",
      lag: 500,
      lagY: 200,
      depth: 2,
      depthY: 3,
      defaultEffects: true,
    };

    const inputRootConfig = {
      tweener: "linear",
      lag: 300,
      lagY: 100,
      layers: new Map([[layer, inputLayerConfig]]),
      defaultEffects: false,
    };
    const widget = new SmoothScroll(root, inputRootConfig);
    const composerRoot = widget.getComposer();
    const composerLayer = widget.getComposer(layer);

    expect(composerRoot).toBeInstanceOf(FXComposer);
    expect(composerRoot.getComposition().size).toBe(0);

    const configRoot = composerRoot.getConfig();
    expect(configRoot.trigger).toBeInstanceOf(FXScrollTrigger);
    expect(configRoot.parent).toBeUndefined();
    expect(configRoot.negate).toBeUndefined();
    expect(configRoot.tweener).toBe(inputRootConfig.tweener);
    expect(configRoot.lagX).toBe(inputRootConfig.lag);
    expect(configRoot.lagY).toBe(inputRootConfig.lagY);
    expect(configRoot.lagZ).toBe(0);
    expect(configRoot.depthX).toBe(1);
    expect(configRoot.depthY).toBe(1);
    expect(configRoot.depthZ).toBe(1);

    // -----

    expect(composerLayer).toBeInstanceOf(FXComposer);
    expect([...composerLayer.getComposition().keys()]).toEqual(["transform"]);

    const configLayer = composerLayer.getConfig();
    expect(configLayer.trigger).toBeInstanceOf(FXScrollTrigger);
    expect(configLayer.parent).toBe(composerRoot);
    expect(configLayer.negate).toBe(composerRoot);
    expect(configLayer.tweener).toBe(inputLayerConfig.tweener);
    expect(configLayer.lagX).toBe(inputLayerConfig.lag);
    expect(configLayer.lagY).toBe(inputLayerConfig.lagY);
    expect(configLayer.lagZ).toBe(0);
    expect(configLayer.depthX).toBe(inputLayerConfig.depth);
    expect(configLayer.depthY).toBe(inputLayerConfig.depthY);
    expect(configLayer.depthZ).toBe(1);
  });
});

test("SmoothScroll.get", async () => {
  const root = document.createElement("div");
  CONTAINER.append(root);

  const widget = new SmoothScroll(root);
  expect(SmoothScroll.get(root)).toBe(widget);

  await widget.destroy();
  expect(SmoothScroll.get(root)).toBe(null);
});

describe("is registered", () => {
  test(".lisn-smooth-scroll", async () => {
    const root = document.createElement("div");
    root.classList.add("lisn-smooth-scroll");
    CONTAINER.append(root);

    await window.waitForMO();

    expect(SmoothScroll.get(root)).toBeInstanceOf(SmoothScroll);
  });

  test("[data-lisn-smooth-scroll='']", async () => {
    const root = document.createElement("div");
    root.dataset.lisnSmoothScroll = "";
    CONTAINER.append(root);

    await window.waitForMO();

    expect(SmoothScroll.get(root)).toBeInstanceOf(SmoothScroll);
  });

  test("[data-lisn-smooth-scroll='...']", async () => {
    const root = document.createElement("div");
    root.dataset.lisnSmoothScroll = "click-scroll=false";
    CONTAINER.append(root);

    await window.waitForMO();

    expect(SmoothScroll.get(root)).toBeInstanceOf(SmoothScroll);
  });
});
