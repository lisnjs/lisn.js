const { describe, test, expect } = require("@jest/globals");

const isPlainObject = (v) =>
  v !== null &&
  typeof v === "object" &&
  (Object.getPrototypeOf(v) === null ||
    Object.getPrototypeOf(Object.getPrototypeOf(v)) === null);

const classes = (() => {
  const classes = [];

  const addClassesFrom = (obj) => {
    for (const name in obj) {
      if (name === "_" || name === "utils") {
        continue;
      }

      const v = obj[name];
      if (isPlainObject(v)) {
        addClassesFrom(v);
      } else if (
        name.slice(0, 1) === name.slice(0, 1).toUpperCase() &&
        name !== name.toUpperCase() &&
        v &&
        (typeof v === "object" || typeof v === "function") &&
        typeof v.constructor === "function" &&
        !Array.isArray(v)
      ) {
        classes.push([name, v]);
      }
    }
  };

  addClassesFrom(window.LISN);
  return classes;
})();

describe("all classes have branding and no duplicated", () => {
  const brandProp = Symbol.for("__lisn.js:brand");
  const seen = {};

  for (const [name, cls] of classes) {
    test(name, () => {
      expect(name in seen).toBe(false);
      expect(cls.prototype[brandProp]).toBe(Symbol.for(`LISN.js/${name}`));
      expect(cls.prototype[Symbol.toStringTag]).toBe(name);
      expect(cls.name).toBe(name);
      seen[name] = true;
    });
  }
});
