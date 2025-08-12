window.waitFor = (d) => new Promise((resolve) => window.setTimeout(resolve, d));

window.waitForTick = () =>
  new Promise((resolve) => window.setTimeout(resolve, 10));

window.waitForAF = () =>
  new Promise((resolve) => window.setTimeout(resolve, 50));

window.waitForRO = () =>
  new Promise((resolve) => window.setTimeout(resolve, 50));

window.waitForMO = window.waitForRO;
window.waitForIO = window.waitForRO;
window.waitForVW = () => window.waitForIO().then(window.waitForAF());

window.newClick = (buttons = 1) =>
  new MouseEvent("click", { buttons, cancelable: true });

window.newKeyDown = (key, shiftKey = false) =>
  new KeyboardEvent("keydown", { key, shiftKey, cancelable: true });

window.newKeyUp = (key, shiftKey = false) =>
  new KeyboardEvent("keyup", { key, shiftKey, cancelable: true });

window.newWheel = (deltaX, deltaY, shiftKey = false, ctrlKey = false) =>
  new WheelEvent("wheel", {
    deltaX,
    deltaY,
    shiftKey,
    ctrlKey,
    cancelable: true,
  });

window.newPointer = (
  type,
  clientX,
  clientY,
  pointerType = "mouse",
  buttons = null, // default is 0 for pointerup and 1 otherwise
) =>
  new PointerEvent("pointer" + type, {
    clientX,
    clientY,
    pointerType,
    buttons: buttons ?? (type === "up" ? 0 : 1),
    cancelable: true,
  });

window.newMouse = (
  type,
  clientX,
  clientY,
  buttons = null, // default is 0 for pointerup and 1 otherwise
) =>
  new MouseEvent("mouse" + type, {
    clientX,
    clientY,
    buttons: buttons ?? (type === "up" ? 0 : 1),
    cancelable: true,
  });

// xy is an array of touch coordinates. The index in the array will become the
// touch identifier. Pass null to exclude this touch, i.e. to simulate that
// finger having been lifted.
window.newTouch = (type, ...xy) => {
  const touches = [];
  let id = 0;
  for (const thisXY of xy) {
    id++;
    if (thisXY === null) {
      continue;
    }

    touches.push(
      new window.Touch({
        identifier: id,
        clientX: thisXY[0],
        clientY: thisXY[1],
        target: document.body,
      }),
    );
  }

  return new TouchEvent("touch" + type, { touches, cancelable: true });
};

window.toArray = (a) => {
  if ("toFloat32Array" in a) {
    a = a.toFloat32Array();
  } else if ("toFloat64Array" in a) {
    a = a.toFloat64Array();
  } else if ("toArray" in a) {
    a = a.toArray();
  }
  return Array.from(a);
};
