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
export const isValidDevice = device => ORDERED_DEVICES.has(device);

/**
 * Returns true if the given string is a valid aspect ratio name.
 *
 * @category Validation
 */
export const isValidAspectRatio = aspectRatio => ORDERED_ASPECTR.has(aspectRatio);

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
export const isValidDeviceList = device => isValidForType(S_DEVICES, device, ORDERED_DEVICES);

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
export const isValidAspectRatioList = aspectR => isValidForType(S_ASPECTRS_CAMEL, aspectR, ORDERED_ASPECTR);

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
export const getOtherDevices = device => getOtherLayouts(S_DEVICES, device, ORDERED_DEVICES);

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
export const getOtherAspectRatios = aspectR => getOtherLayouts(S_ASPECTRS_CAMEL, aspectR, ORDERED_ASPECTR);

/**
 * @ignore
 * @internal
 */
export const getLayoutBitmask = options => {
  let layoutBitmask = getBitmaskFromSpec(S_DEVICES, options === null || options === void 0 ? void 0 : options.devices, ORDERED_DEVICES) | getBitmaskFromSpec(S_ASPECTRS_CAMEL, options === null || options === void 0 ? void 0 : options.aspectRatios, ORDERED_ASPECTR);
  if (!layoutBitmask) {
    layoutBitmask = ORDERED_DEVICES.bitmask | ORDERED_ASPECTR.bitmask; // default: all
  }
  return layoutBitmask;
};

// In ascending order by width.
const ORDERED_DEVICE_NAMES = sortedKeysByVal(settings.deviceBreakpoints);
const ORDERED_ASPECTR_NAMES = sortedKeysByVal(settings.aspectRatioBreakpoints);
const bitSpaces = newBitSpaces();

/**
 * @ignore
 * @internal
 */
export const ORDERED_DEVICES = createBitSpace(bitSpaces, ...ORDERED_DEVICE_NAMES);

/**
 * @ignore
 * @internal
 */
export const ORDERED_ASPECTR = createBitSpace(bitSpaces, ...ORDERED_ASPECTR_NAMES);

/**
 * @ignore
 * @internal
 */
export const NUM_LAYOUTS = MH.lengthOf(ORDERED_DEVICE_NAMES) + MH.lengthOf(ORDERED_ASPECTR_NAMES);

// --------------------

const S_DEVICES = "devices";
const S_ASPECTRS_CAMEL = "aspectRatios";
const LAYOUT_RANGE_REGEX = RegExp("^ *(" + "(?<layoutA>[a-z-]+) +to +(?<layoutB>[a-z-]+)|" + "min +(?<minLayout>[a-z-]+)|" + "max +(?<maxLayout>[a-z-]+)" + ") *$");
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
    if (MH.isInstanceOf(err, LisnUsageError)) {
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
      /* istanbul ignore next */ // shouldn't happen
      if (!rangeMatch.groups) {
        throw MH.bugError("Layout regex has no named groups");
      }
      const minLayout = rangeMatch.groups.layoutA || rangeMatch.groups.minLayout;
      const maxLayout = rangeMatch.groups.layoutB || rangeMatch.groups.maxLayout;
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
  const layouts = validateStrList(keyName, spec, bitSpace.has);
  if (layouts) {
    for (const lt of layouts) {
      bitmask |= bitSpace.bit[lt];
    }
  }
  return bitmask;
};
//# sourceMappingURL=layout.js.map