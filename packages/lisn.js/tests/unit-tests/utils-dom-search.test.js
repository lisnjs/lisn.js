const { describe, test, expect } = require("@jest/globals");

const utils = window.LISN.utils;

const newRef = (root, id) => {
  const parentElement = document.createElement("div");
  parentElement.dataset.lisnRef = "parent";
  parentElement.id = "parent-" + id;
  parentElement.classList.add("parent-cls");

  const childElement = document.createElement("div");
  childElement.dataset.lisnRef = "child";
  childElement.id = "child-" + id;
  childElement.classList.add("child-cls");

  parentElement.append(childElement);

  if (root) {
    root.append(parentElement);
  }

  return {
    parent: {
      element: parentElement,
      getRef: (spec) => utils.getReferenceElement(spec, parentElement),
    },
    child: {
      element: childElement,
      getRef: (spec) => utils.getReferenceElement(spec, childElement),
    },
  };
};

const newDummy = (parent, id) => {
  const element = document.createElement("div");
  element.id = "dummy-" + id;
  if (parent) {
    parent.append(element);
  }

  const getRef = (spec) => utils.getReferenceElement(spec, element);
  return { element, getRef };
};

// - body
//   - dummy0
//   - parentA
//     - childA
//   - dummyA
//   - parentB
//     - childB
//     - dummyB
//   - parentC
//     - dummyC
//       - childC
//   - parentD
//     - childD
//   - dummyD
// - parentX
//   - childX
// - dummyX
const dummy0 = newDummy(document.body, "0");
const groupA = newRef(document.body, "A");
const dummyA = newDummy(document.body, "A");
const groupB = newRef(document.body, "B");
const dummyB = newDummy(groupB.parent.element, "B");
const groupC = newRef(document.body, "C");
const dummyC = newDummy(groupC.parent.element, "C");
dummyC.element.append(groupC.child.element);
const groupD = newRef(document.body, "D");
const dummyD = newDummy(document.body, "D");
const groupX = newRef(null, "X");
const dummyX = newDummy(null, "X");

test("blank spec", () => {
  expect(utils.getReferenceElement("", document.body)).toBe(document.body);
});

test("invalid", () => {
  expect(() => utils.getReferenceElement("prev+bla", document.body)).toThrow(
    /Invalid search specification/,
  );
  expect(() => utils.getReferenceElement("bla", document.body)).toThrow(
    /Invalid search specification/,
  );
});

test("non-existent", () => {
  expect(groupB.parent.getRef("first-bla")).toBe(null);
  expect(groupB.parent.getRef("last-bla")).toBe(null);
  expect(groupB.parent.getRef("this-bla")).toBe(null);
  expect(groupB.parent.getRef("next-bla")).toBe(null);
  expect(groupB.parent.getRef("prev-bla")).toBe(null);
});

describe("first", () => {
  test("first from parent", () => {
    expect(groupA.parent.getRef("first")).toBe(groupA.parent.element);
    expect(groupB.parent.getRef("first")).toBe(groupA.parent.element);
    expect(groupC.parent.getRef("first")).toBe(groupA.parent.element);
    expect(groupD.parent.getRef("first")).toBe(groupA.parent.element);
    expect(groupX.parent.getRef("first")).toBe(groupA.parent.element);
  });

  test("first-parent from parent", () => {
    expect(groupA.parent.getRef("first-parent")).toBe(groupA.parent.element);
    expect(groupB.parent.getRef("first-parent")).toBe(groupA.parent.element);
    expect(groupC.parent.getRef("first-parent")).toBe(groupA.parent.element);
    expect(groupD.parent.getRef("first-parent")).toBe(groupA.parent.element);
    expect(groupX.parent.getRef("first-parent")).toBe(groupA.parent.element);
  });

  test("first-child from parent", () => {
    expect(groupA.parent.getRef("first-child")).toBe(groupA.child.element);
    expect(groupB.parent.getRef("first-child")).toBe(groupA.child.element);
    expect(groupC.parent.getRef("first-child")).toBe(groupA.child.element);
    expect(groupD.parent.getRef("first-child")).toBe(groupA.child.element);
    expect(groupX.parent.getRef("first-child")).toBe(groupA.child.element);
  });

  test("first from child", () => {
    expect(groupA.child.getRef("first")).toBe(groupA.child.element);
    expect(groupB.child.getRef("first")).toBe(groupA.child.element);
    expect(groupC.child.getRef("first")).toBe(groupA.child.element);
    expect(groupD.child.getRef("first")).toBe(groupA.child.element);
    expect(groupX.child.getRef("first")).toBe(groupA.child.element);
  });

  test("first-parent from child", () => {
    expect(groupA.child.getRef("first-parent")).toBe(groupA.parent.element);
    expect(groupB.child.getRef("first-parent")).toBe(groupA.parent.element);
    expect(groupC.child.getRef("first-parent")).toBe(groupA.parent.element);
    expect(groupD.child.getRef("first-parent")).toBe(groupA.parent.element);
    expect(groupX.child.getRef("first-parent")).toBe(groupA.parent.element);
  });

  test("first-child from child", () => {
    expect(groupA.child.getRef("first-child")).toBe(groupA.child.element);
    expect(groupB.child.getRef("first-child")).toBe(groupA.child.element);
    expect(groupC.child.getRef("first-child")).toBe(groupA.child.element);
    expect(groupD.child.getRef("first-child")).toBe(groupA.child.element);
    expect(groupX.child.getRef("first-child")).toBe(groupA.child.element);
  });

  test("first from dummy", () => {
    expect(() => dummy0.getRef("first")).toThrow(/No reference/);
    expect(() => dummyA.getRef("first")).toThrow(/No reference/);
    expect(() => dummyB.getRef("first")).toThrow(/No reference/);
    expect(() => dummyC.getRef("first")).toThrow(/No reference/);
    expect(() => dummyD.getRef("first")).toThrow(/No reference/);
    expect(() => dummyX.getRef("first")).toThrow(/No reference/);
  });

  test("first-parent from dummy", () => {
    expect(dummy0.getRef("first-parent")).toBe(groupA.parent.element);
    expect(dummyA.getRef("first-parent")).toBe(groupA.parent.element);
    expect(dummyB.getRef("first-parent")).toBe(groupA.parent.element);
    expect(dummyC.getRef("first-parent")).toBe(groupA.parent.element);
    expect(dummyD.getRef("first-parent")).toBe(groupA.parent.element);
    expect(dummyX.getRef("first-parent")).toBe(groupA.parent.element);
  });

  test("first-child from dummy", () => {
    expect(dummy0.getRef("first-child")).toBe(groupA.child.element);
    expect(dummyA.getRef("first-child")).toBe(groupA.child.element);
    expect(dummyB.getRef("first-child")).toBe(groupA.child.element);
    expect(dummyC.getRef("first-child")).toBe(groupA.child.element);
    expect(dummyD.getRef("first-child")).toBe(groupA.child.element);
    expect(dummyX.getRef("first-child")).toBe(groupA.child.element);
  });
});

describe("last", () => {
  test("last from parent", () => {
    expect(groupA.parent.getRef("last")).toBe(groupD.parent.element);
    expect(groupB.parent.getRef("last")).toBe(groupD.parent.element);
    expect(groupC.parent.getRef("last")).toBe(groupD.parent.element);
    expect(groupD.parent.getRef("last")).toBe(groupD.parent.element);
    expect(groupX.parent.getRef("last")).toBe(groupD.parent.element);
  });

  test("last-parent from parent", () => {
    expect(groupA.parent.getRef("last-parent")).toBe(groupD.parent.element);
    expect(groupB.parent.getRef("last-parent")).toBe(groupD.parent.element);
    expect(groupC.parent.getRef("last-parent")).toBe(groupD.parent.element);
    expect(groupD.parent.getRef("last-parent")).toBe(groupD.parent.element);
    expect(groupX.parent.getRef("last-parent")).toBe(groupD.parent.element);
  });

  test("last-child from parent", () => {
    expect(groupA.parent.getRef("last-child")).toBe(groupD.child.element);
    expect(groupB.parent.getRef("last-child")).toBe(groupD.child.element);
    expect(groupC.parent.getRef("last-child")).toBe(groupD.child.element);
    expect(groupD.parent.getRef("last-child")).toBe(groupD.child.element);
    expect(groupX.parent.getRef("last-child")).toBe(groupD.child.element);
  });

  test("last from child", () => {
    expect(groupA.child.getRef("last")).toBe(groupD.child.element);
    expect(groupB.child.getRef("last")).toBe(groupD.child.element);
    expect(groupC.child.getRef("last")).toBe(groupD.child.element);
    expect(groupD.child.getRef("last")).toBe(groupD.child.element);
    expect(groupX.child.getRef("last")).toBe(groupD.child.element);
  });

  test("last-parent from child", () => {
    expect(groupA.child.getRef("last-parent")).toBe(groupD.parent.element);
    expect(groupB.child.getRef("last-parent")).toBe(groupD.parent.element);
    expect(groupC.child.getRef("last-parent")).toBe(groupD.parent.element);
    expect(groupD.child.getRef("last-parent")).toBe(groupD.parent.element);
    expect(groupX.child.getRef("last-parent")).toBe(groupD.parent.element);
  });

  test("last-child from child", () => {
    expect(groupA.child.getRef("last-child")).toBe(groupD.child.element);
    expect(groupB.child.getRef("last-child")).toBe(groupD.child.element);
    expect(groupC.child.getRef("last-child")).toBe(groupD.child.element);
    expect(groupD.child.getRef("last-child")).toBe(groupD.child.element);
    expect(groupX.child.getRef("last-child")).toBe(groupD.child.element);
  });

  test("last from dummy", () => {
    expect(() => dummy0.getRef("last")).toThrow(/No reference/);
    expect(() => dummyA.getRef("last")).toThrow(/No reference/);
    expect(() => dummyB.getRef("last")).toThrow(/No reference/);
    expect(() => dummyC.getRef("last")).toThrow(/No reference/);
    expect(() => dummyD.getRef("last")).toThrow(/No reference/);
    expect(() => dummyX.getRef("last")).toThrow(/No reference/);
  });

  test("last-parent from dummy", () => {
    expect(dummy0.getRef("last-parent")).toBe(groupD.parent.element);
    expect(dummyA.getRef("last-parent")).toBe(groupD.parent.element);
    expect(dummyB.getRef("last-parent")).toBe(groupD.parent.element);
    expect(dummyC.getRef("last-parent")).toBe(groupD.parent.element);
    expect(dummyD.getRef("last-parent")).toBe(groupD.parent.element);
    expect(dummyX.getRef("last-parent")).toBe(groupD.parent.element);
  });

  test("last-child from dummy", () => {
    expect(dummy0.getRef("last-child")).toBe(groupD.child.element);
    expect(dummyA.getRef("last-child")).toBe(groupD.child.element);
    expect(dummyB.getRef("last-child")).toBe(groupD.child.element);
    expect(dummyC.getRef("last-child")).toBe(groupD.child.element);
    expect(dummyD.getRef("last-child")).toBe(groupD.child.element);
    expect(dummyX.getRef("last-child")).toBe(groupD.child.element);
  });
});

describe("this", () => {
  test("this from parent", () => {
    expect(groupA.parent.getRef("this")).toBe(groupA.parent.element);
    expect(groupB.parent.getRef("this")).toBe(groupB.parent.element);
    expect(groupC.parent.getRef("this")).toBe(groupC.parent.element);
    expect(groupD.parent.getRef("this")).toBe(groupD.parent.element);
    expect(groupX.parent.getRef("this")).toBe(groupX.parent.element);
  });

  test("this-parent from parent", () => {
    expect(groupA.parent.getRef("this-parent")).toBe(groupA.parent.element);
    expect(groupB.parent.getRef("this-parent")).toBe(groupB.parent.element);
    expect(groupC.parent.getRef("this-parent")).toBe(groupC.parent.element);
    expect(groupD.parent.getRef("this-parent")).toBe(groupD.parent.element);
    expect(groupX.parent.getRef("this-parent")).toBe(groupX.parent.element);
  });

  test("this-child from parent", () => {
    expect(groupA.parent.getRef("this-child")).toBe(null);
    expect(groupB.parent.getRef("this-child")).toBe(null);
    expect(groupC.parent.getRef("this-child")).toBe(null);
    expect(groupD.parent.getRef("this-child")).toBe(null);
    expect(groupX.parent.getRef("this-child")).toBe(null);
  });

  test("this from child", () => {
    expect(groupA.child.getRef("this")).toBe(groupA.child.element);
    expect(groupB.child.getRef("this")).toBe(groupB.child.element);
    expect(groupC.child.getRef("this")).toBe(groupC.child.element);
    expect(groupD.child.getRef("this")).toBe(groupD.child.element);
    expect(groupX.child.getRef("this")).toBe(groupX.child.element);
  });

  test("this-parent from child", () => {
    expect(groupA.child.getRef("this-parent")).toBe(groupA.parent.element);
    expect(groupB.child.getRef("this-parent")).toBe(groupB.parent.element);
    expect(groupC.child.getRef("this-parent")).toBe(groupC.parent.element);
    expect(groupD.child.getRef("this-parent")).toBe(groupD.parent.element);
    expect(groupX.child.getRef("this-parent")).toBe(groupX.parent.element);
  });

  test("this-child from child", () => {
    expect(groupA.child.getRef("this-child")).toBe(groupA.child.element);
    expect(groupB.child.getRef("this-child")).toBe(groupB.child.element);
    expect(groupC.child.getRef("this-child")).toBe(groupC.child.element);
    expect(groupD.child.getRef("this-child")).toBe(groupD.child.element);
    expect(groupX.child.getRef("this-child")).toBe(groupX.child.element);
  });

  test("this from dummy", () => {
    expect(() => dummy0.getRef("this")).toThrow(/No reference/);
    expect(() => dummyA.getRef("this")).toThrow(/No reference/);
    expect(() => dummyB.getRef("this")).toThrow(/No reference/);
    expect(() => dummyC.getRef("this")).toThrow(/No reference/);
    expect(() => dummyD.getRef("this")).toThrow(/No reference/);
    expect(() => dummyX.getRef("this")).toThrow(/No reference/);
  });

  test("this-parent from dummy", () => {
    expect(dummy0.getRef("this-parent")).toBe(null);
    expect(dummyA.getRef("this-parent")).toBe(null);
    expect(dummyB.getRef("this-parent")).toBe(groupB.parent.element);
    expect(dummyC.getRef("this-parent")).toBe(groupC.parent.element);
    expect(dummyD.getRef("this-parent")).toBe(null);
    expect(dummyX.getRef("this-parent")).toBe(null);
  });

  test("this-child from dummy", () => {
    expect(dummy0.getRef("this-child")).toBe(null);
    expect(dummyA.getRef("this-child")).toBe(null);
    expect(dummyB.getRef("this-child")).toBe(null);
    expect(dummyC.getRef("this-child")).toBe(null);
    expect(dummyD.getRef("this-child")).toBe(null);
    expect(dummyX.getRef("this-child")).toBe(null);
  });
});

describe("prev", () => {
  test("prev from parent", () => {
    expect(groupA.parent.getRef("prev")).toBe(null);
    expect(groupB.parent.getRef("prev")).toBe(groupA.parent.element);
    expect(groupC.parent.getRef("prev")).toBe(groupB.parent.element);
    expect(groupD.parent.getRef("prev")).toBe(groupC.parent.element);
    expect(groupX.parent.getRef("prev")).toBe(null);
  });

  test("prev-parent from parent", () => {
    expect(groupA.parent.getRef("prev-parent")).toBe(null);
    expect(groupB.parent.getRef("prev-parent")).toBe(groupA.parent.element);
    expect(groupC.parent.getRef("prev-parent")).toBe(groupB.parent.element);
    expect(groupD.parent.getRef("prev-parent")).toBe(groupC.parent.element);
    expect(groupX.parent.getRef("prev-parent")).toBe(null);
  });

  test("prev-child from parent", () => {
    expect(groupA.parent.getRef("prev-child")).toBe(null);
    expect(groupB.parent.getRef("prev-child")).toBe(groupA.child.element);
    expect(groupC.parent.getRef("prev-child")).toBe(groupB.child.element);
    expect(groupD.parent.getRef("prev-child")).toBe(groupC.child.element);
    expect(groupX.parent.getRef("prev-child")).toBe(null);
  });

  test("prev from child", () => {
    expect(groupA.child.getRef("prev")).toBe(null);
    expect(groupB.child.getRef("prev")).toBe(groupA.child.element);
    expect(groupC.child.getRef("prev")).toBe(groupB.child.element);
    expect(groupD.child.getRef("prev")).toBe(groupC.child.element);
    expect(groupX.child.getRef("prev")).toBe(null);
  });

  test("prev-parent from child", () => {
    expect(groupA.child.getRef("prev-parent")).toBe(null);
    expect(groupB.child.getRef("prev-parent")).toBe(groupA.parent.element);
    expect(groupC.child.getRef("prev-parent")).toBe(groupB.parent.element);
    expect(groupD.child.getRef("prev-parent")).toBe(groupC.parent.element);
    expect(groupX.child.getRef("prev-parent")).toBe(null);
  });

  test("prev-child from child", () => {
    expect(groupA.child.getRef("prev-child")).toBe(null);
    expect(groupB.child.getRef("prev-child")).toBe(groupA.child.element);
    expect(groupC.child.getRef("prev-child")).toBe(groupB.child.element);
    expect(groupD.child.getRef("prev-child")).toBe(groupC.child.element);
    expect(groupX.child.getRef("prev-child")).toBe(null);
  });

  test("prev from dummy", () => {
    expect(() => dummy0.getRef("prev")).toThrow(/No reference/);
    expect(() => dummyA.getRef("prev")).toThrow(/No reference/);
    expect(() => dummyB.getRef("prev")).toThrow(/No reference/);
    expect(() => dummyC.getRef("prev")).toThrow(/No reference/);
    expect(() => dummyD.getRef("prev")).toThrow(/No reference/);
    expect(() => dummyX.getRef("prev")).toThrow(/No reference/);
  });

  test("prev-parent from dummy", () => {
    expect(dummy0.getRef("prev-parent")).toBe(null);
    expect(dummyA.getRef("prev-parent")).toBe(groupA.parent.element);
    expect(dummyB.getRef("prev-parent")).toBe(groupA.parent.element); // A
    expect(dummyC.getRef("prev-parent")).toBe(groupB.parent.element); // B
    expect(dummyD.getRef("prev-parent")).toBe(groupD.parent.element);
    expect(dummyX.getRef("prev-parent")).toBe(null);
  });

  test("prev-child from dummy", () => {
    expect(dummy0.getRef("prev-child")).toBe(null);
    expect(dummyA.getRef("prev-child")).toBe(groupA.child.element);
    expect(dummyB.getRef("prev-child")).toBe(groupB.child.element);
    expect(dummyC.getRef("prev-child")).toBe(groupB.child.element); // B
    expect(dummyD.getRef("prev-child")).toBe(groupD.child.element);
    expect(dummyX.getRef("prev-child")).toBe(null);
  });
});

describe("next", () => {
  test("next from parent", () => {
    expect(groupA.parent.getRef("next")).toBe(groupB.parent.element);
    expect(groupB.parent.getRef("next")).toBe(groupC.parent.element);
    expect(groupC.parent.getRef("next")).toBe(groupD.parent.element);
    expect(groupD.parent.getRef("next")).toBe(null);
    expect(groupX.parent.getRef("next")).toBe(null);
  });

  test("next-parent from parent", () => {
    expect(groupA.parent.getRef("next-parent")).toBe(groupB.parent.element);
    expect(groupB.parent.getRef("next-parent")).toBe(groupC.parent.element);
    expect(groupC.parent.getRef("next-parent")).toBe(groupD.parent.element);
    expect(groupD.parent.getRef("next-parent")).toBe(null);
    expect(groupX.parent.getRef("next-parent")).toBe(null);
  });

  test("next-child from parent", () => {
    expect(groupA.parent.getRef("next-child")).toBe(groupA.child.element);
    expect(groupB.parent.getRef("next-child")).toBe(groupB.child.element);
    expect(groupC.parent.getRef("next-child")).toBe(groupC.child.element);
    expect(groupD.parent.getRef("next-child")).toBe(groupD.child.element);
    expect(groupX.parent.getRef("next-child")).toBe(null);
  });

  test("next from child", () => {
    expect(groupA.child.getRef("next")).toBe(groupB.child.element);
    expect(groupB.child.getRef("next")).toBe(groupC.child.element);
    expect(groupC.child.getRef("next")).toBe(groupD.child.element);
    expect(groupD.child.getRef("next")).toBe(null);
    expect(groupX.child.getRef("next")).toBe(null);
  });

  test("next-parent from child", () => {
    expect(groupA.child.getRef("next-parent")).toBe(groupB.parent.element);
    expect(groupB.child.getRef("next-parent")).toBe(groupC.parent.element);
    expect(groupC.child.getRef("next-parent")).toBe(groupD.parent.element);
    expect(groupD.child.getRef("next-parent")).toBe(null);
    expect(groupX.child.getRef("next-parent")).toBe(null);
  });

  test("next-child from child", () => {
    expect(groupA.child.getRef("next")).toBe(groupB.child.element);
    expect(groupB.child.getRef("next")).toBe(groupC.child.element);
    expect(groupC.child.getRef("next")).toBe(groupD.child.element);
    expect(groupD.child.getRef("next")).toBe(null);
    expect(groupX.child.getRef("next")).toBe(null);
  });

  test("next from dummy", () => {
    expect(() => dummy0.getRef("next")).toThrow(/No reference/);
    expect(() => dummyA.getRef("next")).toThrow(/No reference/);
    expect(() => dummyB.getRef("next")).toThrow(/No reference/);
    expect(() => dummyC.getRef("next")).toThrow(/No reference/);
    expect(() => dummyD.getRef("next")).toThrow(/No reference/);
    expect(() => dummyX.getRef("next")).toThrow(/No reference/);
  });

  test("next-parent from dummy", () => {
    expect(dummy0.getRef("next-parent")).toBe(groupA.parent.element);
    expect(dummyA.getRef("next-parent")).toBe(groupB.parent.element);
    expect(dummyB.getRef("next-parent")).toBe(groupC.parent.element);
    expect(dummyC.getRef("next-parent")).toBe(groupD.parent.element);
    expect(dummyD.getRef("next-parent")).toBe(null);
    expect(dummyX.getRef("next-parent")).toBe(null);
  });

  test("next-child from dummy", () => {
    expect(dummy0.getRef("next-child")).toBe(groupA.child.element);
    expect(dummyA.getRef("next-child")).toBe(groupB.child.element);
    expect(dummyB.getRef("next-child")).toBe(groupC.child.element);
    expect(dummyC.getRef("next-child")).toBe(groupC.child.element); // C
    expect(dummyD.getRef("next-child")).toBe(null);
    expect(dummyX.getRef("next-child")).toBe(null);
  });
});

test("using a class selector: selected one", () => {
  expect(groupA.parent.getRef("this.parent-cls")).toBe(groupA.parent.element);
  expect(groupB.parent.getRef("this.parent-cls")).toBe(groupB.parent.element);
  expect(groupC.parent.getRef("this.parent-cls")).toBe(groupC.parent.element);
  expect(groupD.parent.getRef("this.parent-cls")).toBe(groupD.parent.element);
  expect(groupX.parent.getRef("this.parent-cls")).toBe(groupX.parent.element);
});

test("using ID", () => {
  expect(groupA.parent.getRef("#child-B")).toBe(groupB.child.element);
  expect(groupB.parent.getRef("#child-B")).toBe(groupB.child.element);
  expect(groupC.parent.getRef("#child-B")).toBe(groupB.child.element);
  expect(groupD.parent.getRef("#child-B")).toBe(groupB.child.element);
  expect(groupX.parent.getRef("#child-B")).toBe(groupB.child.element);
  expect(groupA.child.getRef("#child-B")).toBe(groupB.child.element);
  expect(groupB.child.getRef("#child-B")).toBe(groupB.child.element);
  expect(groupC.child.getRef("#child-B")).toBe(groupB.child.element);
  expect(groupD.child.getRef("#child-B")).toBe(groupB.child.element);
  expect(groupX.child.getRef("#child-B")).toBe(groupB.child.element);
  expect(dummy0.getRef("#child-B")).toBe(groupB.child.element);
  expect(dummyA.getRef("#child-B")).toBe(groupB.child.element);
  expect(dummyB.getRef("#child-B")).toBe(groupB.child.element);
  expect(dummyC.getRef("#child-B")).toBe(groupB.child.element);
  expect(dummyD.getRef("#child-B")).toBe(groupB.child.element);
  expect(dummyX.getRef("#child-B")).toBe(groupB.child.element);
});

test("using non-existend ID", () => {
  expect(groupA.parent.getRef("#foo")).toBe(null);
});
