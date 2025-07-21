/**
 * @module
 * @ignore
 * @internal
 */

import * as MH from "../globals/minification-helpers.js";
export const isTouchScreen = () => MH.hasDOM() ? matchMedia("(any-pointer: coarse)").matches : false;

/**
 * @since v1.2.0
 */
export const supportsSticky = () => MH.hasDOM() ? typeof CSS !== "undefined" && CSS.supports("position", "sticky") : false;

/**
 * @since v1.2.0
 */
export const isInQuirksMode = () => MH.hasDOM() ? document.compatMode === "BackCompat" : false;

/**
 * @since v1.2.0
 */
export const isMobile = () => MH.hasDOM() ? MH.userAgent.match(/Mobile|Android|Silk\/|Kindle|BlackBerry|Opera Mini|Opera Mobi/) !== null : false;
//# sourceMappingURL=browser.js.map