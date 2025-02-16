"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPointerGestureFragment = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _directions = require("./directions.cjs");
var _event = require("./event.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
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
 * @return {} `false` if there are less than 2 "pointermove"/"mousemove" events
 * in the list, `null` if the gesture is terminated, otherwise a
 * {@link GestureFragment}.
 *
 * @category Gestures
 */
var getPointerGestureFragment = exports.getPointerGestureFragment = function getPointerGestureFragment(events, options) {
  if (!MH.isIterableObject(events)) {
    events = [events];
  }
  var isCancelled = false;
  var supports = (0, _event.getBrowserSupport)();

  // If the browser supports pointer events, then only take those; otherwise
  // take the mouse events
  var pointerEventClass = supports._pointer ? PointerEvent : MouseEvent;
  var pointerUpType = supports._pointer ? MC.S_POINTERUP : MC.S_MOUSEUP;
  var filteredEvents = MH.filter(events, function (event) {
    var eType = event.type;
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
  var numEvents = MH.lengthOf(filteredEvents);
  if (numEvents < 2) {
    return false; // no enough events
  }
  if (isCancelled) {
    return null; // terminated
  }
  var firstEvent = filteredEvents[0];
  var lastEvent = filteredEvents[numEvents - 1];
  if (MH.getPointerType(firstEvent) !== MH.getPointerType(lastEvent)) {
    return null; // different devices, consider it terminated
  }
  var deltaX = lastEvent.clientX - firstEvent.clientX;
  var deltaY = lastEvent.clientY - firstEvent.clientY;
  var direction = (0, _directions.getVectorDirection)([deltaX, deltaY], options === null || options === void 0 ? void 0 : options.angleDiffThreshold);
  return direction === MC.S_NONE ? false : {
    device: MC.S_POINTER,
    direction: direction,
    intent: MC.S_DRAG,
    deltaX: deltaX,
    deltaY: deltaY,
    deltaZ: 1
  };
};
//# sourceMappingURL=gesture-pointer.cjs.map