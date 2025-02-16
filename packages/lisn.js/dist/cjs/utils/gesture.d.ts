/**
 * @module Utils
 */
import { Direction, GestureDevice, GestureIntent } from "../globals/types.cjs";
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
export declare const isValidInputDevice: (device: string) => device is GestureDevice;
/**
 * Returns true if the given string is a valid gesture intent.
 *
 * @category Validation
 */
export declare const isValidIntent: (intent: string) => intent is GestureIntent;
/**
 * Returns true if the given string or array is a list of valid gesture
 * devices.
 *
 * @category Validation
 */
export declare const isValidInputDeviceList: (devices: string | string[]) => devices is "key" | "wheel" | "pointer" | "touch" | GestureDevice[] | "pointer,touch" | "touch,pointer" | "wheel,pointer" | "wheel,touch" | "wheel,pointer,touch" | "wheel,touch,pointer" | "touch,wheel" | "pointer,wheel" | "pointer,wheel,touch" | "pointer,touch,wheel" | "touch,wheel,pointer" | "touch,pointer,wheel" | "key,wheel" | "key,pointer" | "key,touch" | "key,pointer,touch" | "key,touch,pointer" | "key,wheel,pointer" | "key,wheel,touch" | "key,wheel,pointer,touch" | "key,wheel,touch,pointer" | "key,touch,wheel" | "key,pointer,wheel" | "key,pointer,wheel,touch" | "key,pointer,touch,wheel" | "key,touch,wheel,pointer" | "key,touch,pointer,wheel" | "touch,key" | "pointer,key" | "pointer,key,touch" | "pointer,touch,key" | "touch,key,pointer" | "touch,pointer,key" | "wheel,key" | "wheel,key,pointer" | "wheel,key,touch" | "wheel,key,pointer,touch" | "wheel,key,touch,pointer" | "wheel,touch,key" | "wheel,pointer,key" | "wheel,pointer,key,touch" | "wheel,pointer,touch,key" | "wheel,touch,key,pointer" | "wheel,touch,pointer,key" | "touch,key,wheel" | "touch,wheel,key" | "pointer,key,wheel" | "pointer,key,wheel,touch" | "pointer,key,touch,wheel" | "pointer,wheel,key" | "pointer,wheel,key,touch" | "pointer,wheel,touch,key" | "pointer,touch,key,wheel" | "pointer,touch,wheel,key" | "touch,key,wheel,pointer" | "touch,key,pointer,wheel" | "touch,wheel,key,pointer" | "touch,wheel,pointer,key" | "touch,pointer,key,wheel" | "touch,pointer,wheel,key";
/**
 * Returns true if the given string or array is a list of valid gesture
 * intents.
 *
 * @category Validation
 */
export declare const isValidIntentList: (intents: string | string[]) => intents is "zoom" | "drag" | "scroll" | "unknown" | GestureIntent[] | "scroll,unknown" | "unknown,scroll" | "drag,scroll" | "drag,unknown" | "drag,scroll,unknown" | "drag,unknown,scroll" | "unknown,drag" | "scroll,drag" | "scroll,drag,unknown" | "scroll,unknown,drag" | "unknown,drag,scroll" | "unknown,scroll,drag" | "zoom,drag" | "zoom,scroll" | "zoom,unknown" | "zoom,scroll,unknown" | "zoom,unknown,scroll" | "zoom,drag,scroll" | "zoom,drag,unknown" | "zoom,drag,scroll,unknown" | "zoom,drag,unknown,scroll" | "zoom,unknown,drag" | "zoom,scroll,drag" | "zoom,scroll,drag,unknown" | "zoom,scroll,unknown,drag" | "zoom,unknown,drag,scroll" | "zoom,unknown,scroll,drag" | "unknown,zoom" | "scroll,zoom" | "scroll,zoom,unknown" | "scroll,unknown,zoom" | "unknown,zoom,scroll" | "unknown,scroll,zoom" | "drag,zoom" | "drag,zoom,scroll" | "drag,zoom,unknown" | "drag,zoom,scroll,unknown" | "drag,zoom,unknown,scroll" | "drag,unknown,zoom" | "drag,scroll,zoom" | "drag,scroll,zoom,unknown" | "drag,scroll,unknown,zoom" | "drag,unknown,zoom,scroll" | "drag,unknown,scroll,zoom" | "unknown,zoom,drag" | "unknown,drag,zoom" | "scroll,zoom,drag" | "scroll,zoom,drag,unknown" | "scroll,zoom,unknown,drag" | "scroll,drag,zoom" | "scroll,drag,zoom,unknown" | "scroll,drag,unknown,zoom" | "scroll,unknown,zoom,drag" | "scroll,unknown,drag,zoom" | "unknown,zoom,drag,scroll" | "unknown,zoom,scroll,drag" | "unknown,drag,zoom,scroll" | "unknown,drag,scroll,zoom" | "unknown,scroll,zoom,drag" | "unknown,scroll,drag,zoom";
/**
 * @ignore
 * @internal
 */
export declare const addDeltaZ: (current: number, increment: number) => number;
/**
 * @ignore
 * @internal
 */
export declare const DEVICES: GestureDevice[];
/**
 * @ignore
 * @internal
 */
export declare const INTENTS: GestureIntent[];
//# sourceMappingURL=gesture.d.ts.map