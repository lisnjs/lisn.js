function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * @module Utils
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { settings } from "../globals/settings.js";
import { getVectorDirection } from "./directions.js";
import { addDeltaZ } from "./gesture.js";

/**
 * Returns a {@link GestureFragment} for the given events. Only "keydown"
 * events will be considered.
 *
 * If there are no "keydown" events in the given list of events, returns
 * `false`.
 *
 * The deltas of all events are summed together before determining final delta
 * and direction.
 *
 * If the events are of conflicting types, i.e. some scroll, some zoom, then
 * the intent will be "unknown" and the direction will be "ambiguous".
 *
 * Otherwise, if the deltas sum up to 0, the direction will be "none".
 *
 * **IMPORTANT NOTES ON THE DELTA VALUES**
 *
 * For key gestures the deltas are unreliable. You should not assume they
 * correspond to the would-be scroll or zoom amount that the browser would do.
 * But they can be used to determine relative amounts for animating, etc.
 *
 * Key press events can be divided into 3 categories: that scroll by a "line"
 * (e.g. arrow keys), by a "page" (e.g. PageUp/PageDown) or by the full content
 * height/width (e.g. Home/End). The actual scroll amount that _would_ result
 * from the event is dependent on the browser, the window size or the element's
 * scroll width/height, so ours can only be a best guess.
 *
 * Since the actual pixel equivalent is browser specific, we use reasonable
 * default values of delta for each of these "line", "page" or "content" modes,
 * similar to what
 * {@link Utils.getWheelGestureFragment | getWheelGestureFragment} does:
 * - For "line", then a configurable fixed value is used
 *  ({@link settings.deltaLineHeight}).
 * - For "page", then a configurable fixed value is used
 *  ({@link settings.deltaPageHeight}).
 * - For "content", the element's scroll height is used if given, otherwise
 *   the viewport height (same as "page"). We do not try to get the current
 *   scroll height of the target element, (which would be the best guess value
 *   of `deltaY` in case of Home/End key presses), as that would either involve
 *   an asynchronous action or would result in forced layout. If the caller is
 *   already tracking the scroll height of the target, you can pass this as an
 *   argument. Otherwise, we'll default to using the viewport height, same as
 *   for PageUp/Down.
 *
 * If the key gesture fragment is a result of multiple events that were
 * accumulated, the deltas are summed as usual, e.g. if a "page" is equal to 20
 * "lines", then pressing PageDown and then 10 times Up, would result in a
 * delta equal to 10 "lines" down.
 *
 * For zoom intents, `deltaZ` gives a relative change of scale, whereby each
 * press of + or - steps up by 15% or down by ~13% (`1 / 1.15` to be exact)
 * since the previous one.
 *
 * @param {} [options.angleDiffThreshold]
 *                                  See {@link getVectorDirection}
 * @param {} [options.scrollHeight] Use this as deltaY when Home/End is pressed
 *
 * @return {} `false` if there are no "keydown" events in the list, otherwise a
 * {@link GestureFragment}.
 *
 * @category Gestures
 */
export var getKeyGestureFragment = function getKeyGestureFragment(events, options) {
  var _options$scrollHeight;
  if (!MH.isIterableObject(events)) {
    events = [events];
  }
  var LINE = settings.deltaLineHeight;
  var PAGE = settings.deltaPageHeight;
  var CONTENT = (_options$scrollHeight = options === null || options === void 0 ? void 0 : options.scrollHeight) !== null && _options$scrollHeight !== void 0 ? _options$scrollHeight : PAGE;
  var deltasUp = function deltasUp(amount) {
    return [0, -amount, 1];
  };
  var deltasDown = function deltasDown(amount) {
    return [0, amount, 1];
  };
  var deltasLeft = function deltasLeft(amount) {
    return [-amount, 0, 1];
  };
  var deltasRight = function deltasRight(amount) {
    return [amount, 0, 1];
  };
  var deltasIn = [0, 0, 1.15];
  var deltasOut = [0, 0, 1 / 1.15];
  var direction = MC.S_NONE;
  var intent = null;
  var deltaX = 0,
    deltaY = 0,
    deltaZ = 1;
  var _iterator = _createForOfIteratorHelper(events),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _deltasForKey;
      var event = _step.value;
      if (!MH.isKeyboardEvent(event) || event.type !== MC.S_KEYDOWN) {
        continue;
      }
      var deltasForKey = (_deltasForKey = {}, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_deltasForKey, SK_UP, deltasUp(LINE)), SK_ARROWUP, deltasUp(LINE)), SK_PAGEUP, deltasUp(PAGE)), "Home", deltasUp(CONTENT)), SK_DOWN, deltasDown(LINE)), SK_ARROWDOWN, deltasDown(LINE)), SK_PAGEDOWN, deltasDown(PAGE)), "End", deltasDown(CONTENT)), SK_LEFT, deltasLeft(LINE)), SK_ARROWLEFT, deltasLeft(LINE)), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_deltasForKey, SK_RIGHT, deltasRight(LINE)), SK_ARROWRIGHT, deltasRight(LINE)), " ", (event.shiftKey ? deltasUp : deltasDown)(PAGE)), "+", deltasIn), "=", event.ctrlKey ? deltasIn : null), "-", deltasOut));
      var theseDeltas = deltasForKey[event.key] || null;
      if (!theseDeltas) {
        // not a relevant key
        continue;
      }
      var _theseDeltas = _slicedToArray(theseDeltas, 3),
        thisDeltaX = _theseDeltas[0],
        thisDeltaY = _theseDeltas[1],
        thisDeltaZ = _theseDeltas[2];
      var thisIntent = thisDeltaZ !== 1 ? MC.S_ZOOM : MC.S_SCROLL;
      deltaX += thisDeltaX;
      deltaY += thisDeltaY;
      deltaZ = addDeltaZ(deltaZ, thisDeltaZ);
      if (!intent) {
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
    device: MC.S_KEY,
    direction: direction,
    intent: intent,
    deltaX: deltaX,
    deltaY: deltaY,
    deltaZ: deltaZ
  };
};

// --------------------

var SK_UP = "Up";
var SK_DOWN = "Down";
var SK_LEFT = "Left";
var SK_RIGHT = "Right";
var SK_PAGE = "Page";
var SK_ARROW = "Arrow";
var SK_PAGEUP = SK_PAGE + SK_UP;
var SK_PAGEDOWN = SK_PAGE + SK_DOWN;
var SK_ARROWUP = SK_ARROW + SK_UP;
var SK_ARROWDOWN = SK_ARROW + SK_DOWN;
var SK_ARROWLEFT = SK_ARROW + SK_LEFT;
var SK_ARROWRIGHT = SK_ARROW + SK_RIGHT;
//# sourceMappingURL=gesture-key.js.map