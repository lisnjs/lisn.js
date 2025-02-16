function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * @module Utils
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { getVectorDirection } from "./directions.js";
import { havingMaxAbs } from "./math.js";
import { normalizeWheel } from "./normalize-wheel.js";
import { addDeltaZ } from "./gesture.js";

/**
 * Returns a {@link GestureFragment} for the given events. Only "wheel" events
 * will be considered.
 *
 * If there are no "wheel" events in the given list of events, returns `false`.
 *
 * The deltas of all events are summed together before determining final delta
 * and direction.
 *
 * If the events are of conflicting types, i.e. some scroll, some zoom, then
 * the intent will be "unknown" and the direction will be "ambiguous".
 *
 * If the deltas sum up to 0, the direction will be "none".
 *
 * **IMPORTANT NOTES ON THE DELTA VALUES**
 *
 * For wheel gestures the deltas are _highly_ unreliable, especially when
 * zooming (Control + wheel or pinching trackpad). You should not assume they
 * correspond to the would-be scroll or zoom amount that the browser would do.
 * But they can be used to determine relative amounts for animating, etc.
 *
 * If the browser reports the delta values of a WheelEvent to be in mode "line",
 * then a configurable fixed value is used
 * ({@link Settings.settings.deltaLineHeight | settings.deltaLineHeight}).
 *
 * If the browser reports the delta values of a WheelEvent to be in mode "page",
 * then a configurable fixed value is used
 * ({@link Settings.settings.deltaPageWidth | settings.deltaPageWidth} and
 * ({@link Settings.settings.deltaPageHeight | settings.deltaPageHeight}).
 *
 * For zoom intents `deltaZ` is based on what the browser reports as the
 * `deltaY`, which in most browsers roughly corresponds to a percentage zoom
 * factor.
 *
 * @param {} [options.angleDiffThreshold] See {@link getVectorDirection}.
 *                                        Default is 5.
 *
 * @return {} `false` if there are no "wheel" events in the list, otherwise a
 * {@link GestureFragment}.
 *
 * @category Gestures
 */
export var getWheelGestureFragment = function getWheelGestureFragment(events, options) {
  if (!MH.isIterableObject(events)) {
    events = [events];
  }
  var direction = MC.S_NONE;
  var intent = null;
  var deltaX = 0,
    deltaY = 0,
    deltaZ = 1;
  var _iterator = _createForOfIteratorHelper(events),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var event = _step.value;
      if (!MH.isWheelEvent(event) || event.type !== MC.S_WHEEL) {
        continue;
      }
      var data = normalizeWheel(event);
      var thisIntent = MC.S_SCROLL;
      var thisDeltaX = data.pixelX;
      var thisDeltaY = data.pixelY;
      var thisDeltaZ = 1;
      var maxDelta = havingMaxAbs(thisDeltaX, thisDeltaY);
      if (event.ctrlKey && !thisDeltaX) {
        // Browsers report negative deltaY for zoom in, so swap sign
        var percentage = -maxDelta;
        // If it's more than 50, assume it's a mouse wheel => delta is roughly
        // multiple of 10%. Otherwise a trackpad => delta is roughly multiple of 1%
        if (MH.abs(percentage) >= 50) {
          percentage /= 10;
        }
        thisDeltaZ = 1 + percentage / 100;
        thisDeltaX = thisDeltaY = 0;
        thisIntent = MC.S_ZOOM;
      } else if (event.shiftKey && !thisDeltaX) {
        // Holding Shift while turning wheel or swiping trackpad in vertically
        // results in sideways scroll.
        thisDeltaX = thisDeltaY;
        thisDeltaY = 0;
      }
      deltaX += thisDeltaX;
      deltaY += thisDeltaY;
      deltaZ = addDeltaZ(deltaZ, thisDeltaZ);
      if (!thisIntent) {
        // not a relevant key
      } else if (!intent) {
        intent = thisIntent;
      } else if (intent !== thisIntent) {
        // mixture of zoom and scroll
        intent = MC.S_UNKNOWN;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (!intent) {
    return false; // no relevant events
  } else if (intent === MC.S_UNKNOWN) {
    direction = MC.S_AMBIGUOUS;
  } else if (intent === MC.S_ZOOM) {
    direction = deltaZ > 1 ? MC.S_IN : deltaZ < 1 ? MC.S_OUT : MC.S_NONE;
  } else {
    direction = getVectorDirection([deltaX, deltaY], options === null || options === void 0 ? void 0 : options.angleDiffThreshold);
  }
  return direction === MC.S_NONE ? false : {
    device: MC.S_WHEEL,
    direction: direction,
    intent: intent,
    deltaX: deltaX,
    deltaY: deltaY,
    deltaZ: deltaZ
  };
};
//# sourceMappingURL=gesture-wheel.js.map