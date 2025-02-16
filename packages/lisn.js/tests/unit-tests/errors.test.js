const { test, expect } = require("@jest/globals");

// They are not on any bundle
const { LisnUsageError, LisnBugError } = require("@lisn/globals/errors");

test("LisnUsageError", () => {
  const e = new LisnUsageError("foo");
  expect(e).toBeInstanceOf(Error);
  expect(e.message).toBe("[LISN.js] Incorrect usage: foo");
  expect(e.name).toBe("LisnUsageError");
});

test("LisnBugError", () => {
  const e = new LisnBugError("foo");
  expect(e).toBeInstanceOf(Error);
  expect(e.message).toBe("[LISN.js] Please report a bug: foo");
  expect(e.name).toBe("LisnBugError");
});
