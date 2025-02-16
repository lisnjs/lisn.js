"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidIntentList = exports.isValidIntent = exports.isValidInputDeviceList = exports.isValidInputDevice = exports.addDeltaZ = exports.INTENTS = exports.DEVICES = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _validation = require("./validation.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
/**
 * @module Utils
 */

/**
 * `deltaX` and `deltaY` together specify the precise direction in the XY plane
 * of the move if relevant (i.e. other than zoom intent). The direction
 * specifies the effective X ("left"/"right"), Y ("up"/"down") or Z ("in"/"out")
 * direction, or "none"/"ambiguous".
 *
 * `deltaZ` specifies relative zoom in or out for zoom intents.
 * For zoom in, deltaZ is always > 1, and for zoom out it is < 1.
 * For non-zoom events it is 1.
 *
 * For zoom intents, `direction` would be either in, out or none.
 * For other intents, it would be up, down, left, right, none or ambiguous.
 *
 * For important notes on the delta values see
 * - {@link Utils.getKeyGestureFragment | getKeyGestureFragment}
 * - {@link Utils.getTouchGestureFragment | getTouchGestureFragment}
 * - {@link Utils.getWheelGestureFragment | getWheelGestureFragment}
 *
 * @category Gestures
 */

/**
 * Returns true if the given string is a valid gesture device.
 *
 * @category Validation
 */
var isValidInputDevice = exports.isValidInputDevice = function isValidInputDevice(device) {
  return MH.includes(DEVICES, device);
};

/**
 * Returns true if the given string is a valid gesture intent.
 *
 * @category Validation
 */
var isValidIntent = exports.isValidIntent = function isValidIntent(intent) {
  return MH.includes(INTENTS, intent);
};

/**
 * Returns true if the given string or array is a list of valid gesture
 * devices.
 *
 * @category Validation
 */
var isValidInputDeviceList = exports.isValidInputDeviceList = function isValidInputDeviceList(devices) {
  return (0, _validation.isValidStrList)(devices, isValidInputDevice, false);
};

/**
 * Returns true if the given string or array is a list of valid gesture
 * intents.
 *
 * @category Validation
 */
var isValidIntentList = exports.isValidIntentList = function isValidIntentList(intents) {
  return (0, _validation.isValidStrList)(intents, isValidIntent, false);
};

/**
 * @ignore
 * @internal
 */
var addDeltaZ = exports.addDeltaZ = function addDeltaZ(current, increment) {
  return MH.max(MIN_DELTA_Z, current * increment);
};

/**
 * @ignore
 * @internal
 */
var DEVICES = exports.DEVICES = [MC.S_KEY, MC.S_POINTER, MC.S_TOUCH, MC.S_WHEEL];

/**
 * @ignore
 * @internal
 */
var INTENTS = exports.INTENTS = [MC.S_SCROLL, MC.S_ZOOM, MC.S_DRAG, MC.S_UNKNOWN];

// Do not allow zooming out more than this value
var MIN_DELTA_Z = 0.1;
//# sourceMappingURL=gesture.cjs.map