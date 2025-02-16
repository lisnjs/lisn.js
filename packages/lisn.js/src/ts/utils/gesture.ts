/**
 * @module Utils
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

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
  MH.includes(DEVICES, device);

/**
 * Returns true if the given string is a valid gesture intent.
 *
 * @category Validation
 */
export const isValidIntent = (intent: string): intent is GestureIntent =>
  MH.includes(INTENTS, intent);

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
  MH.max(MIN_DELTA_Z, current * increment);

/**
 * @ignore
 * @internal
 */
export const DEVICES: GestureDevice[] = [
  MC.S_KEY,
  MC.S_POINTER,
  MC.S_TOUCH,
  MC.S_WHEEL,
] as const;

/**
 * @ignore
 * @internal
 */
export const INTENTS: GestureIntent[] = [
  MC.S_SCROLL,
  MC.S_ZOOM,
  MC.S_DRAG,
  MC.S_UNKNOWN,
] as const;

// Do not allow zooming out more than this value
const MIN_DELTA_Z = 0.1;
