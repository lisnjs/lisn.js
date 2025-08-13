const { jest, describe, test, expect } = require("@jest/globals");

const { Transform, FXController } = window.LISN.effects;

const IDENTITY = new DOMMatrixReadOnly([
  ...[1, 0, 0, 0],
  ...[0, 1, 0, 0],
  ...[0, 0, 1, 0],
  ...[0, 0, 0, 1],
]);

const DEFAULT_OFFSETS = {
  x: 0,
  nx: 0,
  y: 0,
  ny: 0,
};

const newController = (withScrollable = false) => {
  if (withScrollable) {
    const scrollable = document.createElement("div");
    scrollable.enableScroll();
    return new FXController({ scrollable });
  }

  return new FXController();
};

const newIncrementalTransform = (init) =>
  new Transform({ init, isAbsolute: false });

const newAbsoluteTransform = (init) =>
  new Transform({ init, isAbsolute: true });

const newTestMatrix = (toValue = (i) => i + 1) => {
  const init = new Float32Array(16);
  for (let i = 0; i < 16; i++) {
    init[i] = toValue(i);
  }
  return new DOMMatrixReadOnly(init);
};

// XXX TODO
// with absolute and incremental
// add w and wo range
// - all range types
// clear
// apply w depth 1 and != 1
// getComposition
// toCss w and wo relativeTo
