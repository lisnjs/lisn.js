/**
 * @module Utils
 */

import * as _ from "@lisn/_internal";

/**
 * Returns true if the device has a touch screen.
 *
 * @since v1.2.0
 *
 * @category Browser info
 */
export const isTouchScreen = () =>
  _.hasDOM() ? matchMedia("(any-pointer: coarse)").matches : false;

/**
 * Returns true if the browser supports position: sticky.
 *
 * @since v1.2.0
 *
 * @category Browser info
 */
export const supportsSticky = () =>
  _.hasDOM()
    ? typeof CSS !== "undefined" && CSS.supports("position", "sticky")
    : false;

/**
 * Returns true if the page is in quirks mode.
 *
 * @since v1.2.0
 *
 * @category Browser info
 */
export const isInQuirksMode = () =>
  _.hasDOM() ? document.compatMode === "BackCompat" : false;

/**
 * Returns true if the device is mobile (based on user agent).
 *
 * @since v1.2.0
 *
 * @category Browser info
 */
export const isMobile = () =>
  _.hasDOM()
    ? _.userAgent.match(
        /Mobile|Android|Silk\/|Kindle|BlackBerry|Opera Mini|Opera Mobi/,
      ) !== null
    : false;
