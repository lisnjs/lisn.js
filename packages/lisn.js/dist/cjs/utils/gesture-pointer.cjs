"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPointerGestureFragment = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _directions = require("./directions.cjs");
var _event = require("./event.cjs");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * @module Utils
 */

/**
 * Returns a {@link GestureFragment} for the given events. If the browser
 * supports Pointer events, then only "pointermove" events will be considered.
 * Otherwise, only "mousemove" events will be considered.
 *
 * If there are less than 2 such events in the given list of events, returns
 * `false`.
 *
 * If the gesture is to be considered terminated, e.g. because there is
 * "pointercancel" in the list or buttons other than the primary are pressed,
 * returns `null`.
 *
 * Pointer gestures always require the primary button to be pressed and the
 * resulting intent is always "drag", and `deltaZ` is always 1.
 *
 * @param {} [options.angleDiffThreshold] See {@link getVectorDirection}
 *
 * @returns {} `false` if there are less than 2 "pointermove"/"mousemove" events
 * in the list, `null` if the gesture is terminated, otherwise a
 * {@link GestureFragment}.
 *
 * @category Gestures
 */
const getPointerGestureFragment = (events, options) => {
  if (!MH.isIterableObject(events)) {
    events = [events];
  }
  let isCancelled = false;
  const supports = (0, _event.getBrowserSupport)();

  // If the browser supports pointer events, then only take those; otherwise
  // take the mouse events
  const pointerEventClass = supports._pointer ? PointerEvent : MouseEvent;
  const pointerUpType = supports._pointer ? MC.S_POINTERUP : MC.S_MOUSEUP;
  const filteredEvents = MH.filter(events, event => {
    const eType = event.type;
    isCancelled = isCancelled || eType === MC.S_POINTERCANCEL;
    if (eType !== MC.S_CLICK && MH.isInstanceOf(event, pointerEventClass)) {
      // Only events where the primary button is pressed (unless it's a
      // pointerup event, in which case no buttons should be pressed) are
      // considered, otherwise consider it terminated
      isCancelled = isCancelled || eType === pointerUpType && event.buttons !== 0 || eType !== pointerUpType && event.buttons !== 1;
      // we don't handle touch pointer events
      return !MH.isTouchPointerEvent(event);
    }
    return false;
  });
  const numEvents = MH.lengthOf(filteredEvents);
  if (numEvents < 2) {
    return false; // no enough events
  }
  if (isCancelled) {
    return null; // terminated
  }
  const firstEvent = filteredEvents[0];
  const lastEvent = filteredEvents[numEvents - 1];
  if (MH.getPointerType(firstEvent) !== MH.getPointerType(lastEvent)) {
    return null; // different devices, consider it terminated
  }
  const deltaX = lastEvent.clientX - firstEvent.clientX;
  const deltaY = lastEvent.clientY - firstEvent.clientY;
  const direction = (0, _directions.getVectorDirection)([deltaX, deltaY], options === null || options === void 0 ? void 0 : options.angleDiffThreshold);
  return direction === MC.S_NONE ? false : {
    device: MC.S_POINTER,
    direction,
    intent: MC.S_DRAG,
    deltaX,
    deltaY,
    deltaZ: 1
  };
};
exports.getPointerGestureFragment = getPointerGestureFragment;
//# sourceMappingURL=gesture-pointer.cjs.map