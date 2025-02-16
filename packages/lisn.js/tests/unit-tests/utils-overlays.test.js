const { describe, test, expect } = require("@jest/globals");
require("./supplementary/settings--main-content-element");

const utils = window.LISN.utils;

test("getOverlay", async () => {
  expect(utils.getOverlay()).toBe(null);
  const overlayA = await utils.createOverlay();
  expect(utils.getOverlay()).toBe(overlayA);
});

test("basic, no options", async () => {
  const overlayA = await utils.createOverlay();
  const overlayB = await utils.createOverlay();

  expect(overlayA.tagName).toBe("DIV");
  expect(overlayA.dataset.lisnOverlayId).toBeUndefined();
  expect(overlayA.style.position).toBe("absolute");
  expect(overlayA.style.top).toBe("0px");
  expect(overlayA.style.left).toBe("0px");
  expect(overlayA.style.bottom).toBe("");
  expect(overlayA.style.right).toBe("");
  expect(overlayA.parentElement).toBe(window.MAIN_CONTENT_ELEMENT);

  expect(overlayB).toBe(overlayA);
});

test("basic, no options, async, concurrent", async () => {
  const pA = utils.createOverlay();
  const pB = utils.createOverlay();
  const overlayA = await pA;
  const overlayB = await pB;

  expect(overlayA.tagName).toBe("DIV");
  expect(overlayA.dataset.lisnOverlayId).toBeUndefined();
  expect(overlayA.style.position).toBe("absolute");
  expect(overlayA.style.top).toBe("0px");
  expect(overlayA.style.left).toBe("0px");
  expect(overlayA.style.bottom).toBe("");
  expect(overlayA.style.right).toBe("");
  expect(overlayA.parentElement).toBe(window.MAIN_CONTENT_ELEMENT);

  expect(overlayB).toBe(overlayA);
});

describe("style props", () => {
  for (const pos of ["static", "relative"]) {
    // TODO test.each
    test(`position ${pos}, no top/left/etc`, async () => {
      const overlay = await utils.createOverlay({
        style: {
          position: pos,
        },
      });

      expect(overlay.style.position).toBe(pos);
      expect(overlay.style.top).toBe("");
      expect(overlay.style.left).toBe("");
      expect(overlay.style.bottom).toBe("");
      expect(overlay.style.right).toBe("");
    });
  }

  for (const pos of ["absolute", "fixed"]) {
    // TODO test.each
    test(`position ${pos}, no top/left/etc`, async () => {
      const overlay = await utils.createOverlay({
        style: {
          position: pos,
        },
      });

      expect(overlay.style.position).toBe(pos);
      expect(overlay.style.top).toBe("0px");
      expect(overlay.style.left).toBe("0px");
      expect(overlay.style.bottom).toBe("");
      expect(overlay.style.right).toBe("");
    });
  }

  for (const pos of ["absolute", "fixed"]) {
    // TODO test.each
    test(`position ${pos}, + top`, async () => {
      const overlay = await utils.createOverlay({
        style: {
          position: pos,
          top: "5px",
        },
      });

      expect(overlay.style.position).toBe(pos);
      expect(overlay.style.top).toBe("5px");
      expect(overlay.style.left).toBe("0px");
      expect(overlay.style.bottom).toBe("");
      expect(overlay.style.right).toBe("");
    });

    test(`position ${pos}, + bottom`, async () => {
      const overlay = await utils.createOverlay({
        style: {
          position: pos,
          bottom: "5px",
        },
      });

      expect(overlay.style.position).toBe(pos);
      expect(overlay.style.top).toBe("");
      expect(overlay.style.left).toBe("0px");
      expect(overlay.style.bottom).toBe("5px");
      expect(overlay.style.right).toBe("");
    });

    test(`position ${pos}, + left`, async () => {
      const overlay = await utils.createOverlay({
        style: {
          position: pos,
          left: "5px",
        },
      });

      expect(overlay.style.position).toBe(pos);
      expect(overlay.style.top).toBe("0px");
      expect(overlay.style.left).toBe("5px");
      expect(overlay.style.bottom).toBe("");
      expect(overlay.style.right).toBe("");
    });

    test(`position ${pos}, + right`, async () => {
      const overlay = await utils.createOverlay({
        style: {
          position: pos,
          right: "5px",
        },
      });

      expect(overlay.style.position).toBe(pos);
      expect(overlay.style.top).toBe("0px");
      expect(overlay.style.left).toBe("");
      expect(overlay.style.bottom).toBe("");
      expect(overlay.style.right).toBe("5px");
    });
  }

  test("vars + misc props", async () => {
    const overlay = await utils.createOverlay({
      style: {
        "--foo": "0",
        background: "blue",
      },
    });

    expect(overlay.style.getPropertyValue("--foo")).toBe("0");
    expect(overlay.style.background).toBe("blue");
  });
});

test("data attrs", async () => {
  const overlay = await utils.createOverlay({
    data: {
      someAttr: "some val",
    },
  });

  expect(overlay.dataset.someAttr).toBe("some val");
});

describe("parent", () => {
  for (const pos of ["static", "relative", "fixed", "absolute"]) {
    // TODO test.each
    test(`explicit parent + position ${pos}`, async () => {
      const parent = document.createElement("div");
      const overlay = await utils.createOverlay({
        parent,
        style: {
          position: pos,
        },
      });

      expect(overlay.style.position).toBe(pos);
      expect(overlay.parentElement).toBe(parent);
    });
  }

  for (const pos of ["static", "relative", "absolute"]) {
    // TODO test.each
    test(`no parent + position ${pos}`, async () => {
      const overlay = await utils.createOverlay({
        style: {
          position: pos,
        },
      });

      expect(overlay.style.position).toBe(pos);
      expect(overlay.parentElement).toBe(window.MAIN_CONTENT_ELEMENT);
    });
  }

  test("no parent + position fixed", async () => {
    const overlay = await utils.createOverlay({
      style: {
        position: "fixed",
      },
    });

    expect(overlay.style.position).toBe("fixed");
    expect(overlay.parentElement).toBe(document.body);
  });
});

describe("reusing previous", () => {
  test("identical style props and data attrs + 1st has ID", async () => {
    const attrVal = utils.randId();
    const overlayA = await utils.createOverlay({
      style: {
        top: "0px",
        left: "5px",
        width: "100%",
      },
      data: {
        someAttr: attrVal,
      },
      id: "overlay", // makes it unique
    });

    const overlayB = await utils.createOverlay({
      style: {
        left: "5px",
        top: "0px",
        width: "100%",
      },
      data: {
        someAttr: attrVal,
      },
    });

    expect(overlayB).not.toBe(overlayA);
  });

  test("identical style props and data attrs + 2nd has ID", async () => {
    const attrVal = utils.randId();
    const overlayA = await utils.createOverlay({
      style: {
        top: "0px",
        left: "5px",
        width: "100%",
      },
      data: {
        someAttr: attrVal,
      },
    });

    const overlayB = await utils.createOverlay({
      style: {
        left: "5px",
        top: "0px",
        width: "100%",
      },
      data: {
        someAttr: attrVal,
      },
      id: "overlay", // makes it unique
    });

    expect(overlayB).not.toBe(overlayA);
  });

  test("identical style props and data attrs + same ID", async () => {
    const attrVal = utils.randId();
    // technically we shouldn't have duplicate IDs on the page, but Overlays
    // doesn't care; it should create a new one if id is given
    const overlayA = await utils.createOverlay({
      style: {
        top: "0px",
        left: "5px",
        width: "100%",
      },
      data: {
        someAttr: attrVal,
      },
      id: "overlay", // makes it unique
    });

    const overlayB = await utils.createOverlay({
      style: {
        left: "5px",
        top: "0px",
        width: "100%",
      },
      data: {
        someAttr: attrVal,
      },
      id: "overlay", // makes it unique
    });

    expect(overlayB).not.toBe(overlayA);
  });

  test("not awaiting: identical style props and data attrs", async () => {
    const attrVal = utils.randId();
    const [overlayA, overlayB, overlayC] = await Promise.all([
      utils.createOverlay({
        style: {
          top: "0px",
          left: "5px",
        },
        data: {
          someAttr: attrVal,
        },
      }),

      utils.createOverlay({
        style: {
          left: "5px",
          top: "0px",
        },
        data: {
          someAttr: attrVal,
        },
      }),

      utils.createOverlay({
        style: {
          left: "5px",
          // top is 0 by default
        },
        data: {
          someAttr: attrVal,
        },
      }),
    ]);

    expect(overlayB).toBe(overlayA);
    expect(overlayC).toBe(overlayA);
  });

  test("awating: identical style props and data attrs", async () => {
    const attrVal = utils.randId();
    const overlayA = await utils.createOverlay({
      style: {
        top: "0px",
        left: "5px",
      },
      data: {
        someAttr: attrVal,
      },
    });

    const overlayB = await utils.createOverlay({
      style: {
        left: "5px",
        top: "0px",
      },
      data: {
        someAttr: attrVal,
      },
    });

    const overlayC = await utils.createOverlay({
      style: {
        left: "5px",
        // top is 0 by default
      },
      data: {
        someAttr: attrVal,
      },
    });

    expect(overlayB).toBe(overlayA);
    expect(overlayC).toBe(overlayA);
  });

  test("identical style props and different data attrs", async () => {
    const attrVal = utils.randId();
    const overlayA = await utils.createOverlay({
      style: {
        top: "0px",
        left: "5px",
      },
      data: {
        someAttr: attrVal,
      },
    });

    const overlayB = await utils.createOverlay({
      style: {
        left: "5px",
        top: "0px",
      },
      data: {
        someAttr: attrVal + "2",
      },
    });

    const overlayC = await utils.createOverlay({
      style: {
        left: "5px",
      },
    });

    expect(overlayB).not.toBe(overlayA);
    expect(overlayC).not.toBe(overlayA);
    expect(overlayC).not.toBe(overlayB);
  });

  test("different style props and identical data attrs", async () => {
    const attrVal = utils.randId();
    const overlayA = await utils.createOverlay({
      style: {
        top: "0px",
        left: "5px",
      },
      data: {
        someAttr: attrVal,
      },
    });
    const overlayB = await utils.createOverlay({
      style: {
        left: "5px",
        top: "10px",
      },
      data: {
        someAttr: attrVal,
      },
    });

    expect(overlayB).not.toBe(overlayA);
  });
});
