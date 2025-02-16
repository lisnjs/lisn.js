const error = console.error;
const expectedErrors = new Map();
window.expectError = (err, fn = null) => expectedErrors.set(err, fn);
console.error = function () {
  const err =
    (arguments[0] + "").includes("LISN") && arguments.length > 1
      ? arguments[1]
      : arguments[0];

  for (const [exp, fn] of expectedErrors) {
    if ((err instanceof Error ? err.message : err).match(exp)) {
      if (fn) {
        fn(...arguments);
      }
      expectedErrors.delete(exp);
      return;
    }
  }

  error.apply(console, arguments);
};

const warn = console.warn;
const expectedWarnings = new Map();
window.expectWarning = (err, fn = null) => expectedWarnings.set(err, fn);
console.warn = function () {
  const msg =
    (arguments[0] + "").includes("LISN") && arguments.length > 1
      ? arguments[1]
      : arguments[0];

  for (const [exp, fn] of expectedWarnings) {
    if ((msg instanceof Error ? msg.message : msg).match(exp)) {
      if (fn) {
        fn(...arguments);
      }
      expectedErrors.delete(exp);
      return;
    }
  }

  warn.apply(console, arguments);
};
