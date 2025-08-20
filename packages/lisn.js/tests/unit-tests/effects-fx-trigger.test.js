const { jest, describe, test, expect } = require("@jest/globals");

const { FXTrigger } = window.LISN.effects;

const newTrigger = (executorBody) => {
  let push;
  const executor = jest.fn((p) => {
    push = p;
    if (executorBody) {
      executorBody(push);
    }
  });

  const trigger = new FXTrigger(executor);

  return { trigger, push, executor };
};

describe("FXTrigger", () => {
  test("basic", async () => {
    const { trigger, push } = newTrigger();
  });
});
