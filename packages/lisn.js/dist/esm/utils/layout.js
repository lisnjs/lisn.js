function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * @module Utils
 */

import * as MH from "../globals/minification-helpers.js";
import { LisnUsageError } from "../globals/errors.js";
import { settings } from "../globals/settings.js";
import { sortedKeysByVal } from "./math.js";
import { validateStrList } from "./validation.js";
import { newBitSpaces, createBitSpace } from "../modules/bit-spaces.js";

/**
 * Returns true if the given string is a valid device name.
 *
 * @category Validation
 */
export var isValidDevice = function isValidDevice(device) {
  return ORDERED_DEVICES.has(device);
};

/**
 * Returns true if the given string is a valid aspect ratio name.
 *
 * @category Validation
 */
export var isValidAspectRatio = function isValidAspectRatio(aspectRatio) {
  return ORDERED_ASPECTR.has(aspectRatio);
};

/**
 * Returns true if the given string is a valid device specification (including
 * `"min <Device>"`, etc).
 *
 * Returns false for "", although if you passed "" in
 * {@link Watchers/LayoutWatcher.OnLayoutOptions | OnLayoutOptions} it would
 * accept it as specifying _all_ devices.
 *
 * @category Validation
 */
export var isValidDeviceList = function isValidDeviceList(device) {
  return isValidForType(S_DEVICES, device, ORDERED_DEVICES);
};

/**
 * Returns true if the given string is a valid aspect ratio specification
 * (including `"min <AspectRatio>"`, etc).
 *
 * Returns false for "", although if you passed "" in
 * {@link Watchers/LayoutWatcher.OnLayoutOptions | OnLayoutOptions} it would
 * accept it as specifying _all_ aspect ratios.
 *
 * @category Validation
 */
export var isValidAspectRatioList = function isValidAspectRatioList(aspectR) {
  return isValidForType(S_ASPECTRS_CAMEL, aspectR, ORDERED_ASPECTR);
};

/**
 * Returns a list of {@link Device}s that are not covered by the given device
 * specification. See
 * {@link Watchers/LayoutWatcher.OnLayoutOptions | OnLayoutOptions} for accepted
 * formats.
 *
 * Returns an empty for "" or for a specification that includes all devices.
 *
 * @category Layout
 */
export var getOtherDevices = function getOtherDevices(device) {
  return getOtherLayouts(S_DEVICES, device, ORDERED_DEVICES);
};

/**
 * Returns a list of {@link AspectRatio}s that are not covered by the given
 * aspect ratio specification. See
 * {@link Watchers/LayoutWatcher.OnLayoutOptions | OnLayoutOptions} for accepted
 * formats.
 *
 * Returns an empty for "" or for a specification that includes all aspect
 * ratios.
 *
 * @category Layout
 */
export var getOtherAspectRatios = function getOtherAspectRatios(aspectR) {
  return getOtherLayouts(S_ASPECTRS_CAMEL, aspectR, ORDERED_ASPECTR);
};

/**
 * @ignore
 * @internal
 */
export var getLayoutBitmask = function getLayoutBitmask(options) {
  var layoutBitmask = getBitmaskFromSpec(S_DEVICES, options === null || options === void 0 ? void 0 : options.devices, ORDERED_DEVICES) | getBitmaskFromSpec(S_ASPECTRS_CAMEL, options === null || options === void 0 ? void 0 : options.aspectRatios, ORDERED_ASPECTR);
  if (!layoutBitmask) {
    layoutBitmask = ORDERED_DEVICES.bitmask | ORDERED_ASPECTR.bitmask; // default: all
  }
  return layoutBitmask;
};

// In ascending order by width.
var ORDERED_DEVICE_NAMES = sortedKeysByVal(settings.deviceBreakpoints);
var ORDERED_ASPECTR_NAMES = sortedKeysByVal(settings.aspectRatioBreakpoints);
var bitSpaces = newBitSpaces();

/**
 * @ignore
 * @internal
 */
export var ORDERED_DEVICES = createBitSpace.apply(void 0, [bitSpaces].concat(_toConsumableArray(ORDERED_DEVICE_NAMES)));

/**
 * @ignore
 * @internal
 */
export var ORDERED_ASPECTR = createBitSpace.apply(void 0, [bitSpaces].concat(_toConsumableArray(ORDERED_ASPECTR_NAMES)));

/**
 * @ignore
 * @internal
 */
export var NUM_LAYOUTS = MH.lengthOf(ORDERED_DEVICE_NAMES) + MH.lengthOf(ORDERED_ASPECTR_NAMES);

// --------------------

var S_DEVICES = "devices";
var S_ASPECTRS_CAMEL = "aspectRatios";
var LAYOUT_RANGE_REGEX = RegExp("^ *(" + "(?<layoutA>[a-z-]+) +to +(?<layoutB>[a-z-]+)|" + "min +(?<minLayout>[a-z-]+)|" + "max +(?<maxLayout>[a-z-]+)" + ") *$");
var getLayoutsFromBitmask = function getLayoutsFromBitmask(keyName, bitmask, bitSpace) {
  var layouts = [];
  for (var bit = bitSpace.start; bit <= bitSpace.end; bit++) {
    var value = 1 << bit;
    if (bitmask & value) {
      var name = bitSpace.nameOf(value);
      if (name) {
        layouts.push(name);
      }
    }
  }
  return layouts;
};
var getOtherLayouts = function getOtherLayouts(keyName, spec, bitSpace) {
  var bitmask = getBitmaskFromSpec(keyName, spec, bitSpace);
  if (!bitmask) {
    return [];
  }
  var oppositeBitmask = bitSpace.bitmask & ~bitmask;
  return getLayoutsFromBitmask(keyName, oppositeBitmask, bitSpace);
};
var isValidForType = function isValidForType(keyName, spec, bitSpace) {
  try {
    var bitmask = getBitmaskFromSpec(keyName, spec, bitSpace);
    return bitmask !== 0;
  } catch (err) {
    if (MH.isInstanceOf(err, LisnUsageError)) {
      return false;
    }
    throw err;
  }
};
var getBitmaskFromSpec = function getBitmaskFromSpec(keyName, spec, bitSpace) {
  if (MH.isEmpty(spec)) {
    return 0;
  }
  var singleKeyName = keyName.slice(0, -1);
  if (MH.isString(spec)) {
    var rangeMatch = spec.match(LAYOUT_RANGE_REGEX);
    if (rangeMatch) {
      /* istanbul ignore next */ // shouldn't happen
      if (!rangeMatch.groups) {
        throw MH.bugError("Layout regex has no named groups");
      }
      var minLayout = rangeMatch.groups.layoutA || rangeMatch.groups.minLayout;
      var maxLayout = rangeMatch.groups.layoutB || rangeMatch.groups.maxLayout;
      if (minLayout !== undefined && !bitSpace.has(minLayout)) {
        throw MH.usageError("Unknown ".concat(singleKeyName, " '").concat(minLayout, "'"));
      }
      if (maxLayout !== undefined && !bitSpace.has(maxLayout)) {
        throw MH.usageError("Unknown ".concat(singleKeyName, " '").concat(maxLayout, "'"));
      }
      return bitSpace.bitmaskFor(minLayout, maxLayout);
    }
  }
  var bitmask = 0;
  var layouts = validateStrList(keyName, spec, bitSpace.has);
  if (layouts) {
    var _iterator = _createForOfIteratorHelper(layouts),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var lt = _step.value;
        bitmask |= bitSpace.bit[lt];
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  return bitmask;
};
//# sourceMappingURL=layout.js.map