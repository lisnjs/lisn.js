window.numEventListeners = new Map();

const addEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function (
  eventType,
  handler,
  options,
) {
  window.numEventListeners.set(
    this,
    (window.numEventListeners.get(this) || 0) + 1,
  );

  return addEventListener.call(this, eventType, handler, options);
};

const removeEventListener = EventTarget.prototype.removeEventListener;
EventTarget.prototype.removeEventListener = function (
  eventType,
  handler,
  options,
) {
  const nListeners = window.numEventListeners.get(this) || 0;
  window.numEventListeners.set(this, nListeners - 1);

  return removeEventListener.call(this, eventType, handler, options);
};
