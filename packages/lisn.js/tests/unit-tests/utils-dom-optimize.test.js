const { jest, test, expect } = require("@jest/globals");

const utils = window.LISN.utils;
const { Logger } = window.LISN.debug;

const newCallbacks = () => {
  const jestCallback = jest.fn();
  const callbackWrapper = (x) => {
    jestCallback(x);
    new Logger().debug1(Date.now(), "Wrapper", x);
  };

  return {
    callbackWrapper,
    jestCallback,
  };
};

test("DOM mutations/measurements", async () => {
  const { callbackWrapper, jestCallback } = newCallbacks();

  const runAndScheduleSubTasks = (prefix) => {
    callbackWrapper(prefix);

    const canRecurse = !prefix.includes(".");
    if (canRecurse) {
      utils.waitForMeasureTime().then(() => {
        runAndScheduleSubTasks(`${prefix}.measurement1`);
      });

      utils.waitForMutateTime().then(() => {
        runAndScheduleSubTasks(`${prefix}.mutation1`);
      });

      utils.waitForMeasureTime().then(() => {
        runAndScheduleSubTasks(`${prefix}.measurement2`);
      });

      utils.waitForMutateTime().then(() => {
        runAndScheduleSubTasks(`${prefix}.mutation2`);
      });
    }
  };

  utils.waitForMeasureTime().then(() => {
    runAndScheduleSubTasks("measurement1");
  });

  utils.waitForMutateTime().then(() => {
    runAndScheduleSubTasks("mutation1");
  });

  utils.waitForMeasureTime().then(() => {
    runAndScheduleSubTasks("measurement2");
  });

  utils.waitForMutateTime().then(() => {
    runAndScheduleSubTasks("mutation2");
  });

  expect(jestCallback).toHaveBeenCalledTimes(0);
  await window.waitFor(200);

  let nCall = 0;

  // mutations
  expect(jestCallback).toHaveBeenNthCalledWith(++nCall, "mutation1");
  expect(jestCallback).toHaveBeenNthCalledWith(++nCall, "mutation2");

  // mutations scheduled from within a mutation
  expect(jestCallback).toHaveBeenNthCalledWith(++nCall, "mutation1.mutation1");
  expect(jestCallback).toHaveBeenNthCalledWith(++nCall, "mutation1.mutation2");

  expect(jestCallback).toHaveBeenNthCalledWith(++nCall, "mutation2.mutation1");
  expect(jestCallback).toHaveBeenNthCalledWith(++nCall, "mutation2.mutation2");

  // repaint should happen now
  // measurements
  expect(jestCallback).toHaveBeenNthCalledWith(++nCall, "measurement1");
  expect(jestCallback).toHaveBeenNthCalledWith(++nCall, "measurement2");

  // measurements scheduled from within a mutation
  expect(jestCallback).toHaveBeenNthCalledWith(
    ++nCall,
    "mutation1.measurement1",
  );
  expect(jestCallback).toHaveBeenNthCalledWith(
    ++nCall,
    "mutation1.measurement2",
  );

  expect(jestCallback).toHaveBeenNthCalledWith(
    ++nCall,
    "mutation2.measurement1",
  );
  expect(jestCallback).toHaveBeenNthCalledWith(
    ++nCall,
    "mutation2.measurement2",
  );

  // measurements scheduled from within a measurement
  expect(jestCallback).toHaveBeenNthCalledWith(
    ++nCall,
    "measurement1.measurement1",
  );
  expect(jestCallback).toHaveBeenNthCalledWith(
    ++nCall,
    "measurement1.measurement2",
  );

  expect(jestCallback).toHaveBeenNthCalledWith(
    ++nCall,
    "measurement2.measurement1",
  );
  expect(jestCallback).toHaveBeenNthCalledWith(
    ++nCall,
    "measurement2.measurement2",
  );

  // next batch
  // mutations scheduled from within a measurement
  expect(jestCallback).toHaveBeenNthCalledWith(
    ++nCall,
    "measurement1.mutation1",
  );
  expect(jestCallback).toHaveBeenNthCalledWith(
    ++nCall,
    "measurement1.mutation2",
  );

  expect(jestCallback).toHaveBeenNthCalledWith(
    ++nCall,
    "measurement2.mutation1",
  );
  expect(jestCallback).toHaveBeenNthCalledWith(
    ++nCall,
    "measurement2.mutation2",
  );

  expect(jestCallback).toHaveBeenCalledTimes(nCall); // no more calls than the above
});

test("DOM subsequent mutations", async () => {
  const { callbackWrapper, jestCallback } = newCallbacks();

  utils
    .waitForMeasureTime()
    .then(utils.waitForMeasureTime)
    .then(() => callbackWrapper("same measure time"));

  utils.waitForMeasureTime().then(() => callbackWrapper("measure time"));

  utils
    .waitForMutateTime()
    .then(utils.waitForMutateTime)
    .then(() => callbackWrapper("same mutate time"));

  utils.waitForMutateTime().then(() => callbackWrapper("mutate time"));

  utils
    .waitForSubsequentMutateTime()
    .then(() => callbackWrapper("subsequent mutate time"));

  utils
    .waitForSubsequentMeasureTime()
    .then(() => callbackWrapper("subsequent measure time"));

  await window.waitFor(200);

  let nCall = 0;
  expect(jestCallback).toHaveBeenNthCalledWith(++nCall, "mutate time");
  expect(jestCallback).toHaveBeenNthCalledWith(++nCall, "same mutate time");
  expect(jestCallback).toHaveBeenNthCalledWith(++nCall, "measure time");
  expect(jestCallback).toHaveBeenNthCalledWith(++nCall, "same measure time");
  expect(jestCallback).toHaveBeenNthCalledWith(
    ++nCall,
    "subsequent mutate time",
  );
  expect(jestCallback).toHaveBeenNthCalledWith(
    ++nCall,
    "subsequent measure time",
  );
  expect(jestCallback).toHaveBeenCalledTimes(nCall);
});
