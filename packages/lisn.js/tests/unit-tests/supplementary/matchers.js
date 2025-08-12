const { expect } = require("@jest/globals");

expect.extend({
  toBeCloseToArray(received, expected, precision = 2) {
    received = window.toArray(received);
    expected = window.toArray(expected);

    if (!Array.isArray(received) || !Array.isArray(expected)) {
      return {
        pass: false,
        message: () =>
          `Both values must be arrays.\nReceived: ${typeof received}\nExpected: ${typeof expected}`,
      };
    }

    if (received.length !== expected.length) {
      return {
        pass: false,
        message: () =>
          `Arrays must have the same length.\nReceived length: ${received.length}\nExpected length: ${expected.length}`,
      };
    }

    const allClose = received.every((value, i) => {
      return Math.abs(value - expected[i]) < Math.pow(10, -precision) / 2;
    });

    return {
      pass: allClose,
      message: () => {
        if (allClose) {
          return `Expected arrays not to be close to each other with precision ${precision}`;
        } else {
          return (
            `Expected arrays to be close to each other with precision ${precision}\n` +
            `Received: ${JSON.stringify(received)}\n` +
            `Expected: ${JSON.stringify(expected)}`
          );
        }
      },
    };
  },
});
