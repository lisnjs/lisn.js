"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTouchGestureFragment = exports.getTouchDiff = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _directions = require("./directions.cjs");
var _math = require("./math.cjs");
var _xMap = require("../modules/x-map.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; } /**
 * @module Utils
 */
/**
 * @category Gestures
 */

/**
 * Returns a {@link GestureFragment} for the given events. Only "touchmove" events
 * will be considered.
 *
 * If there are less than 2 such events in the given list of events, returns `false`.
 *
 * If the gesture is to be considered terminated, e.g. because there is
 * "touchcancel" in the list, returns `null`.
 *
 * Note that by default swipe actions follow the natural direction: swipe up
 * with scroll intent results in direction down and swipe down results in
 * direction up. Drag intent always follows the direction of the gesture.
 *
 * For zoom intents, which necessarily involves exactly two fingers `deltaZ`
 * is based on the relative change in distance between the fingers.
 *
 * @param {} [options.deltaThreshold]
 *                          A change of x or y coordinate less than this is
 *                          considered insignificant, for the purposes of
 *                          determining:
 *                          1) whether the inferred direction is in one of the
 *                             four cardinal ones, or otherwise ambiguous; and
 *                          2) whether more than two fingers have moved and
 *                             therefore whether the direction could be zoom or
 *                             not
 * @param {} [options.angleDiffThreshold] See {@link getVectorDirection}
 * @param {} [options.reverseScroll]
 *                          If set to `true`, will disable natural scroll
 *                          direction.
 * @param {} [options.dragHoldTime]
 *                          If the user presses and holds for at least the
 *                          given amount of milliseconds before moving the
 *                          finger(s), gestures other than pinch will be
 *                          treated as a drag instead of scroll as long as the
 *                          number of fingers touching the screen is
 *                          `options.dragNumFingers`. Default is 500ms.
 * @param {} [options.dragNumFingers]
 *                          The number of fingers that could be considered a
 *                          drag intent. Default is 1.
 *
 * @return {} `false` if there are less than 2 "touchmove" events in the list,
 * `null` if the gesture is terminated, otherwise a {@link GestureFragment}.
 *
 * @category Gestures
 */
var getTouchGestureFragment = exports.getTouchGestureFragment = function getTouchGestureFragment(events, options) {
  var _options$dragHoldTime, _options$dragNumFinge;
  if (!MH.isIterableObject(events)) {
    events = [events];
  }
  var moves = getTouchDiff(events, options === null || options === void 0 ? void 0 : options.deltaThreshold);
  if (!moves) {
    return null; // terminated
  }
  var numMoves = MH.lengthOf(moves);
  var holdTime = getHoldTime(events);
  var canBeDrag = holdTime >= ((_options$dragHoldTime = options === null || options === void 0 ? void 0 : options.dragHoldTime) !== null && _options$dragHoldTime !== void 0 ? _options$dragHoldTime : 500) && numMoves === ((_options$dragNumFinge = options === null || options === void 0 ? void 0 : options.dragNumFingers) !== null && _options$dragNumFinge !== void 0 ? _options$dragNumFinge : 1);
  var angleDiffThreshold = options === null || options === void 0 ? void 0 : options.angleDiffThreshold;
  var deltaX = _math.havingMaxAbs.apply(void 0, _toConsumableArray(moves.map(function (m) {
    return m.deltaX;
  })));
  var deltaY = _math.havingMaxAbs.apply(void 0, _toConsumableArray(moves.map(function (m) {
    return m.deltaY;
  })));
  var deltaZ = 1;
  if (numMoves > 2) {
    // Take only the significant ones
    moves = MH.filter(moves, function (d) {
      return d.isSignificant;
    });
    numMoves = MH.lengthOf(moves);
  }
  var direction = MC.S_NONE;
  var intent = MC.S_UNKNOWN;
  if (numMoves === 2) {
    // Check if it's a zoom
    var vectorA = [moves[0].deltaX, moves[0].deltaY];
    var vectorB = [moves[1].deltaX, moves[1].deltaY];

    // If either finger is approx stationary, or if they move in opposite directions,
    // treat it as zoom.
    if (!_math.havingMaxAbs.apply(void 0, vectorA) ||
    // finger A still
    !_math.havingMaxAbs.apply(void 0, vectorB) ||
    // finger B still
    (0, _math.areAntiParallel)(vectorA, vectorB, angleDiffThreshold)) {
      // It's a pinch motion => zoom
      var startDistance = (0, _math.distanceBetween)([moves[0].startX, moves[0].startY], [moves[1].startX, moves[1].startY]);
      var endDistance = (0, _math.distanceBetween)([moves[0].endX, moves[0].endY], [moves[1].endX, moves[1].endY]);
      direction = startDistance < endDistance ? MC.S_IN : MC.S_OUT;
      deltaZ = endDistance / startDistance;
      deltaX = deltaY = 0;
      intent = MC.S_ZOOM;
    }
  }
  var deltaSign = canBeDrag || options !== null && options !== void 0 && options.reverseScroll ? 1 : -1;
  // If scrolling, swap the deltas for natural scroll direction.
  // Add +0 to force -0 to be +0 since jest doesn't think they're equal
  deltaX = deltaSign * deltaX + 0;
  deltaY = deltaSign * deltaY + 0;
  if (direction === MC.S_NONE) {
    // Wasn't a zoom. Check if all moves are aligned.
    var isFirst = true;
    var _iterator = _createForOfIteratorHelper(moves),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var m = _step.value;
        // There's at least one significant move, assume scroll or drag intent.
        intent = canBeDrag ? MC.S_DRAG : MC.S_SCROLL;
        var thisDirection = (0, _directions.getVectorDirection)([deltaSign * m.deltaX, deltaSign * m.deltaY], angleDiffThreshold);
        if (thisDirection === MC.S_NONE) {
          continue;
        }
        if (isFirst) {
          direction = thisDirection;
        } else if (direction !== thisDirection) {
          direction = MC.S_AMBIGUOUS;
          break;
        }
        isFirst = false;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  if (direction === MC.S_NONE) {
    var lastTouchEvent = events.filter(MH.isTouchEvent).slice(-1)[0];
    // If all fingers have lifted off, consider it terminated, otherwise wait
    // for more events.
    return MH.lengthOf(lastTouchEvent === null || lastTouchEvent === void 0 ? void 0 : lastTouchEvent.touches) ? false : null;
  }
  return {
    device: MC.S_TOUCH,
    direction: direction,
    intent: intent,
    deltaX: deltaX,
    deltaY: deltaY,
    deltaZ: deltaZ
  };
};

/**
 * Returns a description of the changes in each finger between the first and
 * the last relevant TouchEvent in the list.
 *
 * If the gesture is to be considered terminated, e.g. because there is
 * "touchcancel" in the list, returns `null`.
 *
 * Note that, `deltaX`/`deltaY` are the end X/Y coordinate minus the start X/Y
 * coordinate. For natural scroll direction you should swap their signs.
 *
 * @param {} deltaThreshold If the change of x and y coordinate are both less
 *                          than this, it is marked as not significant.
 *
 * @category Gestures
 */
var getTouchDiff = exports.getTouchDiff = function getTouchDiff(events) {
  var deltaThreshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Group each touch point of each event by identifier, so that we can get the
  // start and end coordinate of each finger
  var groupedTouches = (0, _xMap.newXMap)(function () {
    return [];
  });
  var _iterator2 = _createForOfIteratorHelper(events),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var event = _step2.value;
      if (!MH.isTouchEvent(event)) {
        continue;
      }
      if (event.type === MC.S_TOUCHCANCEL) {
        return null; // gesture terminated
      }
      var _iterator4 = _createForOfIteratorHelper(event.touches),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var touch = _step4.value;
          groupedTouches.sGet(touch.identifier).push(touch);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  var moves = [];
  var _iterator3 = _createForOfIteratorHelper(groupedTouches.values()),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var touchList = _step3.value;
      var nTouches = MH.lengthOf(touchList);
      if (nTouches < 2) {
        // Only one event had that finger in it, so there's no move for it
        continue;
      }
      var firstTouch = touchList[0];
      var lastTouch = touchList[nTouches - 1];
      var startX = firstTouch.clientX;
      var startY = firstTouch.clientY;
      var endX = lastTouch.clientX;
      var endY = lastTouch.clientY;
      var deltaX = endX - startX;
      var deltaY = endY - startY;
      var isSignificant = (0, _math.maxAbs)(deltaX, deltaY) >= deltaThreshold;

      // Consider it a move in one of the 4 cardinal ones
      moves.push({
        startX: startX,
        startY: startY,
        endX: endX,
        endY: endY,
        deltaX: deltaX,
        deltaY: deltaY,
        isSignificant: isSignificant
      });
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  return moves;
};

// --------------------

var getHoldTime = function getHoldTime(events) {
  var firstStart = events.findIndex(function (e) {
    return e.type === MC.S_TOUCHSTART;
  });
  var firstMove = events.findIndex(function (e) {
    return e.type === MC.S_TOUCHMOVE;
  });
  if (firstStart < 0 || firstMove < 1) {
    return 0;
  }
  return events[firstMove].timeStamp - events[firstStart].timeStamp;
};
//# sourceMappingURL=gesture-touch.cjs.map