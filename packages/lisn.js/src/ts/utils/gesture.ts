/**
 * @module Utils
 */

import * as _ from "@lisn/_internal";

import { Direction, GestureDevice, GestureIntent } from "@lisn/globals/types";

import { isValidStrList } from "@lisn/utils/validation";

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
export type GestureFragment = {
  device: GestureDevice;
  direction: Direction;
  intent: GestureIntent;
  deltaX: number;
  deltaY: number;
  deltaZ: number;
};

/**
 * Returns true if the given string is a valid gesture device.
 *
 * @category Validation
 */
export const isValidInputDevice = (device: string): device is GestureDevice =>
  _.includes(DEVICES, device);

/**
 * Returns true if the given string is a valid gesture intent.
 *
 * @category Validation
 */
export const isValidIntent = (intent: string): intent is GestureIntent =>
  _.includes(INTENTS, intent);

/**
 * Returns true if the given string or array is a list of valid gesture
 * devices.
 *
 * @category Validation
 */
export const isValidInputDeviceList = (devices: string | string[]) =>
  isValidStrList(devices, isValidInputDevice, false);

/**
 * Returns true if the given string or array is a list of valid gesture
 * intents.
 *
 * @category Validation
 */
export const isValidIntentList = (intents: string | string[]) =>
  isValidStrList(intents, isValidIntent, false);

/**
 * @ignore
 * @internal
 */
export const addDeltaZ = (current: number, increment: number) =>
  _.max(MIN_DELTA_Z, current * increment);

/**
 * @ignore
 * @internal
 */
export const DEVICES: GestureDevice[] = [
  _.S_KEY,
  _.S_POINTER,
  _.S_TOUCH,
  _.S_WHEEL,
] as const;

/**
 * @ignore
 * @internal
 */
export const INTENTS: GestureIntent[] = [
  _.S_SCROLL,
  _.S_ZOOM,
  _.S_DRAG,
  _.S_UNKNOWN,
] as const;

// Do not allow zooming out more than this value
const MIN_DELTA_Z = 0.1;
