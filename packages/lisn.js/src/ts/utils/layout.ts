/**
 * @module Utils
 */

import * as _ from "@lisn/_internal";

import { usageError, isUsageError } from "@lisn/globals/errors";

import { settings } from "@lisn/globals/settings";

import {
  DeviceSpec,
  Device,
  AspectRatioSpec,
  AspectRatio,
} from "@lisn/globals/types";

import { sortedKeysByVal } from "@lisn/utils/math";
import { validateStrList } from "@lisn/utils/validation";

import {
  BitSpace,
  newBitSpaces,
  createBitSpace,
} from "@lisn/modules/bit-spaces";

/**
 * Returns true if the given string is a valid device name.
 *
 * @category Validation
 */
export const isValidDevice = (device: string): device is Device =>
  ORDERED_DEVICES.has(device);

/**
 * Returns true if the given string is a valid aspect ratio name.
 *
 * @category Validation
 */
export const isValidAspectRatio = (
  aspectRatio: string,
): aspectRatio is AspectRatio => ORDERED_ASPECTR.has(aspectRatio);

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
export const isValidDeviceList = (
  device: string | string[],
): device is DeviceSpec | Device[] =>
  isValidForType(S_DEVICES, device, ORDERED_DEVICES);

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
export const isValidAspectRatioList = (
  aspectR: string | string[],
): aspectR is AspectRatioSpec | AspectRatio[] =>
  isValidForType(S_ASPECTRS_CAMEL, aspectR, ORDERED_ASPECTR);

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
export const getOtherDevices = (device: DeviceSpec | Device[]): Device[] =>
  getOtherLayouts(S_DEVICES, device, ORDERED_DEVICES);

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
export const getOtherAspectRatios = (
  aspectR: AspectRatioSpec | AspectRatio[],
): AspectRatio[] => getOtherLayouts(S_ASPECTRS_CAMEL, aspectR, ORDERED_ASPECTR);

/**
 * @ignore
 * @internal
 */
export const getLayoutBitmask = (options?: {
  devices?: DeviceSpec | Device[];
  aspectRatios?: AspectRatioSpec | AspectRatio[];
}): number => {
  let layoutBitmask =
    getBitmaskFromSpec(S_DEVICES, options?.devices, ORDERED_DEVICES) |
    getBitmaskFromSpec(
      S_ASPECTRS_CAMEL,
      options?.aspectRatios,
      ORDERED_ASPECTR,
    );

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
export const ORDERED_DEVICES = createBitSpace(
  bitSpaces,
  ...ORDERED_DEVICE_NAMES,
);

/**
 * @ignore
 * @internal
 */
export const ORDERED_ASPECTR = createBitSpace(
  bitSpaces,
  ...ORDERED_ASPECTR_NAMES,
);

/**
 * @ignore
 * @internal
 */
export const NUM_LAYOUTS =
  _.lengthOf(ORDERED_DEVICE_NAMES) + _.lengthOf(ORDERED_ASPECTR_NAMES);

// --------------------

const S_DEVICES = "devices";
const S_ASPECTRS_CAMEL = "aspectRatios";

// Don't use capture groups for old browser support
const LAYOUT_RANGE_REGEX = RegExp(
  "^ *(?:" +
    "([a-z-]+) +to +([a-z-]+)|" +
    "min +([a-z-]+)|" +
    "max +([a-z-]+)" +
    ") *$",
);

const getLayoutsFromBitmask = <T extends Device | AspectRatio>(
  keyName: string,
  bitmask: number,
  bitSpace: BitSpace<T>,
): T[] => {
  const layouts: T[] = [];
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

const getOtherLayouts = <T extends Device | AspectRatio>(
  keyName: string,
  spec: string | string[],
  bitSpace: BitSpace<T>,
): T[] => {
  const bitmask = getBitmaskFromSpec(keyName, spec, bitSpace);
  if (!bitmask) {
    return [];
  }

  const oppositeBitmask = bitSpace.bitmask & ~bitmask;
  return getLayoutsFromBitmask(keyName, oppositeBitmask, bitSpace);
};

const isValidForType = <T extends Device | AspectRatio>(
  keyName: string,
  spec: string | string[],
  bitSpace: BitSpace<T>,
): boolean => {
  try {
    const bitmask = getBitmaskFromSpec(keyName, spec, bitSpace);
    return bitmask !== 0;
  } catch (err) {
    if (isUsageError(err)) {
      return false;
    }
    throw err;
  }
};

const getBitmaskFromSpec = <T extends Device | AspectRatio>(
  keyName: string,
  spec: string | string[] | undefined | null,
  bitSpace: BitSpace<T>,
): number => {
  if (_.isEmpty(spec)) {
    return 0;
  }
  const singleKeyName = keyName.slice(0, -1);

  if (_.isString(spec)) {
    const rangeMatch = spec.match(LAYOUT_RANGE_REGEX);
    if (rangeMatch) {
      const minLayout = rangeMatch[1] || rangeMatch[3];
      const maxLayout = rangeMatch[2] || rangeMatch[4];

      if (!_.isNullish(minLayout) && !bitSpace.has(minLayout)) {
        throw usageError(`Unknown ${singleKeyName} '${minLayout}'`);
      }

      if (!_.isNullish(maxLayout) && !bitSpace.has(maxLayout)) {
        throw usageError(`Unknown ${singleKeyName} '${maxLayout}'`);
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
