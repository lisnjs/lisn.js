/**
 * @module Utils
 */
import { DeviceSpec, Device, AspectRatioSpec, AspectRatio } from "../globals/types.cjs";
import { BitSpace } from "../modules/bit-spaces.cjs";
/**
 * Returns true if the given string is a valid device name.
 *
 * @category Validation
 */
export declare const isValidDevice: (device: string) => device is Device;
/**
 * Returns true if the given string is a valid aspect ratio name.
 *
 * @category Validation
 */
export declare const isValidAspectRatio: (aspectRatio: string) => aspectRatio is AspectRatio;
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
export declare const isValidDeviceList: (device: string | string[]) => device is DeviceSpec | Device[];
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
export declare const isValidAspectRatioList: (aspectR: string | string[]) => aspectR is AspectRatioSpec | AspectRatio[];
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
export declare const getOtherDevices: (device: DeviceSpec | Device[]) => Device[];
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
export declare const getOtherAspectRatios: (aspectR: AspectRatioSpec | AspectRatio[]) => AspectRatio[];
/**
 * @ignore
 * @internal
 */
export declare const getLayoutBitmask: (options?: {
    devices?: DeviceSpec | Device[];
    aspectRatios?: AspectRatioSpec | AspectRatio[];
}) => number;
/**
 * @ignore
 * @internal
 */
export declare const ORDERED_DEVICES: BitSpace<"mobile" | "mobile-wide" | "tablet" | "desktop">;
/**
 * @ignore
 * @internal
 */
export declare const ORDERED_ASPECTR: BitSpace<"square" | "very-tall" | "tall" | "wide" | "very-wide">;
/**
 * @ignore
 * @internal
 */
export declare const NUM_LAYOUTS: number;
//# sourceMappingURL=layout.d.ts.map