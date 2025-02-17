"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidDeviceList = exports.isValidDevice = exports.isValidAspectRatioList = exports.isValidAspectRatio = exports.getOtherDevices = exports.getOtherAspectRatios = exports.getLayoutBitmask = exports.ORDERED_DEVICES = exports.ORDERED_ASPECTR = exports.NUM_LAYOUTS = void 0;
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _errors = require("../globals/errors.cjs");
var _settings = require("../globals/settings.cjs");
var _math = require("./math.cjs");
var _validation = require("./validation.cjs");
var _bitSpaces = require("../modules/bit-spaces.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * @module Utils
 */

/**
 * Returns true if the given string is a valid device name.
 *
 * @category Validation
 */
const isValidDevice = device => ORDERED_DEVICES.has(device);

/**
 * Returns true if the given string is a valid aspect ratio name.
 *
 * @category Validation
 */
exports.isValidDevice = isValidDevice;
const isValidAspectRatio = aspectRatio => ORDERED_ASPECTR.has(aspectRatio);

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
exports.isValidAspectRatio = isValidAspectRatio;
const isValidDeviceList = device => isValidForType(S_DEVICES, device, ORDERED_DEVICES);

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
exports.isValidDeviceList = isValidDeviceList;
const isValidAspectRatioList = aspectR => isValidForType(S_ASPECTRS_CAMEL, aspectR, ORDERED_ASPECTR);

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
exports.isValidAspectRatioList = isValidAspectRatioList;
const getOtherDevices = device => getOtherLayouts(S_DEVICES, device, ORDERED_DEVICES);

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
exports.getOtherDevices = getOtherDevices;
const getOtherAspectRatios = aspectR => getOtherLayouts(S_ASPECTRS_CAMEL, aspectR, ORDERED_ASPECTR);

/**
 * @ignore
 * @internal
 */
exports.getOtherAspectRatios = getOtherAspectRatios;
const getLayoutBitmask = options => {
  let layoutBitmask = getBitmaskFromSpec(S_DEVICES, options === null || options === void 0 ? void 0 : options.devices, ORDERED_DEVICES) | getBitmaskFromSpec(S_ASPECTRS_CAMEL, options === null || options === void 0 ? void 0 : options.aspectRatios, ORDERED_ASPECTR);
  if (!layoutBitmask) {
    layoutBitmask = ORDERED_DEVICES.bitmask | ORDERED_ASPECTR.bitmask; // default: all
  }
  return layoutBitmask;
};

// In ascending order by width.
exports.getLayoutBitmask = getLayoutBitmask;
const ORDERED_DEVICE_NAMES = (0, _math.sortedKeysByVal)(_settings.settings.deviceBreakpoints);
const ORDERED_ASPECTR_NAMES = (0, _math.sortedKeysByVal)(_settings.settings.aspectRatioBreakpoints);
const bitSpaces = (0, _bitSpaces.newBitSpaces)();

/**
 * @ignore
 * @internal
 */
const ORDERED_DEVICES = exports.ORDERED_DEVICES = (0, _bitSpaces.createBitSpace)(bitSpaces, ...ORDERED_DEVICE_NAMES);

/**
 * @ignore
 * @internal
 */
const ORDERED_ASPECTR = exports.ORDERED_ASPECTR = (0, _bitSpaces.createBitSpace)(bitSpaces, ...ORDERED_ASPECTR_NAMES);

/**
 * @ignore
 * @internal
 */
const NUM_LAYOUTS = exports.NUM_LAYOUTS = MH.lengthOf(ORDERED_DEVICE_NAMES) + MH.lengthOf(ORDERED_ASPECTR_NAMES);

// --------------------

const S_DEVICES = "devices";
const S_ASPECTRS_CAMEL = "aspectRatios";

// Don't use capture groups for old browser support
const LAYOUT_RANGE_REGEX = RegExp("^ *(?:" + "([a-z-]+) +to +([a-z-]+)|" + "min +([a-z-]+)|" + "max +([a-z-]+)" + ") *$");
const getLayoutsFromBitmask = (keyName, bitmask, bitSpace) => {
  const layouts = [];
  for (let bit = bitSpace.start; bit <= bitSpace.end; bit++) {
    const value = 1 << bit;
    if (bitmask & value) {
      const name = bitSpace.nameOf(value);
      if (name) {
        layouts.push(name);
      }
    }
  }
  return layouts;
};
const getOtherLayouts = (keyName, spec, bitSpace) => {
  const bitmask = getBitmaskFromSpec(keyName, spec, bitSpace);
  if (!bitmask) {
    return [];
  }
  const oppositeBitmask = bitSpace.bitmask & ~bitmask;
  return getLayoutsFromBitmask(keyName, oppositeBitmask, bitSpace);
};
const isValidForType = (keyName, spec, bitSpace) => {
  try {
    const bitmask = getBitmaskFromSpec(keyName, spec, bitSpace);
    return bitmask !== 0;
  } catch (err) {
    if (MH.isInstanceOf(err, _errors.LisnUsageError)) {
      return false;
    }
    throw err;
  }
};
const getBitmaskFromSpec = (keyName, spec, bitSpace) => {
  if (MH.isEmpty(spec)) {
    return 0;
  }
  const singleKeyName = keyName.slice(0, -1);
  if (MH.isString(spec)) {
    const rangeMatch = spec.match(LAYOUT_RANGE_REGEX);
    if (rangeMatch) {
      const minLayout = rangeMatch[1] || rangeMatch[3];
      const maxLayout = rangeMatch[2] || rangeMatch[4];
      if (minLayout !== undefined && !bitSpace.has(minLayout)) {
        throw MH.usageError(`Unknown ${singleKeyName} '${minLayout}'`);
      }
      if (maxLayout !== undefined && !bitSpace.has(maxLayout)) {
        throw MH.usageError(`Unknown ${singleKeyName} '${maxLayout}'`);
      }
      return bitSpace.bitmaskFor(minLayout, maxLayout);
    }
  }
  let bitmask = 0;
  const layouts = (0, _validation.validateStrList)(keyName, spec, bitSpace.has);
  if (layouts) {
    for (const lt of layouts) {
      bitmask |= bitSpace.bit[lt];
    }
  }
  return bitmask;
};
//# sourceMappingURL=layout.cjs.map