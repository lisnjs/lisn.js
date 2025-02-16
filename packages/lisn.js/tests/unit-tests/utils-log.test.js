const { describe, jest, test, expect } = require("@jest/globals");

const { logError } = window.LISN.utils;
const { Callback } = window.LISN.modules;

test("error once", () => {
  const err = "error once test";
  const errFn = jest.fn();
  window.expectError(err, errFn);

  logError(err);
  expect(errFn).toHaveBeenCalledTimes(1);

  logError(err);
  expect(errFn).toHaveBeenCalledTimes(1); // no new calls
});

describe("suppress Callback.REMOVE", () => {
  test("default", () => {
    const errFn = jest.fn();
    window.expectError(/Symbol\(REMOVE\)/, errFn);

    logError(Callback.REMOVE);
    expect(errFn).toHaveBeenCalledTimes(0);
  });
});
