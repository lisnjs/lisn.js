/**
 * @module Utils
 */

import * as MH from "../globals/minification-helpers.js";

/**
 * Returns true if the device has a touch screen.
 *
 * @category Browser info
 *
 * @since v1.2.0
 */
export const isTouchScreen = () => MH.hasDOM() ? matchMedia("(any-pointer: coarse)").matches : false;

/**
 * Returns true if the browser supports position: sticky.
 *
 * @category Browser info
 *
 * @since v1.2.0
 */
export const supportsSticky = () => MH.hasDOM() ? typeof CSS !== "undefined" && CSS.supports("position", "sticky") : false;

/**
 * Returns true if the page is in quirks mode.
 *
 * @category Browser info
 *
 * @since v1.2.0
 */
export const isInQuirksMode = () => MH.hasDOM() ? document.compatMode === "BackCompat" : false;

/**
 * Returns true if the device is mobile (based on user agent).
 *
 * @category Browser info
 *
 * @since v1.2.0
 */
export const isMobile = () => MH.hasDOM() ? MH.userAgent.match(/Mobile|Android|Silk\/|Kindle|BlackBerry|Opera Mini|Opera Mobi/) !== null : false;
//# sourceMappingURL=browser.js.map