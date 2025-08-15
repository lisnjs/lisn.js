const { jest, describe, test, expect } = require("@jest/globals");

const { Transform, FXController } = window.LISN.effects;

const IDENTITY = new DOMMatrixReadOnly([
  ...[1, 0, 0, 0],
  ...[0, 1, 0, 0],
  ...[0, 0, 1, 0],
  ...[0, 0, 0, 1],
]);

// XXX TODO
