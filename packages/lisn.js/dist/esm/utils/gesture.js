/**
 * @module Utils
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { isValidStrList } from "./validation.js";

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
export const isValidInputDevice = device => MH.includes(DEVICES, device);

/**
 * Returns true if the given string is a valid gesture intent.
 *
 * @category Validation
 */
export const isValidIntent = intent => MH.includes(INTENTS, intent);

/**
 * Returns true if the given string or array is a list of valid gesture
 * devices.
 *
 * @category Validation
 */
export const isValidInputDeviceList = devices => isValidStrList(devices, isValidInputDevice, false);

/**
 * Returns true if the given string or array is a list of valid gesture
 * intents.
 *
 * @category Validation
 */
export const isValidIntentList = intents => isValidStrList(intents, isValidIntent, false);

/**
 * @ignore
 * @internal
 */
export const addDeltaZ = (current, increment) => MH.max(MIN_DELTA_Z, current * increment);

/**
 * @ignore
 * @internal
 */
export const DEVICES = [MC.S_KEY, MC.S_POINTER, MC.S_TOUCH, MC.S_WHEEL];

/**
 * @ignore
 * @internal
 */
export const INTENTS = [MC.S_SCROLL, MC.S_ZOOM, MC.S_DRAG, MC.S_UNKNOWN];

// Do not allow zooming out more than this value
const MIN_DELTA_Z = 0.1;
//# sourceMappingURL=gesture.js.map