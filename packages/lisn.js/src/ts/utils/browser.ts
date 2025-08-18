/**
 * @module Utils
 */

import * as MH from "@lisn/globals/minification-helpers";

/**
 * Returns true if the device has a touch screen.
 *
 * @since v1.2.0
 *
 * @category Browser info
 */
export const isTouchScreen = () =>
  MH.hasDOM() ? matchMedia("(any-pointer: coarse)").matches : false;

/**
 * Returns true if the browser supports position: sticky.
 *
 * @since v1.2.0
 *
 * @category Browser info
 */
export const supportsSticky = () =>
  MH.hasDOM()
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
  MH.hasDOM() ? document.compatMode === "BackCompat" : false;

/**
 * Returns true if the device is mobile (based on user agent).
 *
 * @since v1.2.0
 *
 * @category Browser info
 */
export const isMobile = () =>
  MH.hasDOM()
    ? MH.userAgent.match(
        /Mobile|Android|Silk\/|Kindle|BlackBerry|Opera Mini|Opera Mobi/,
      ) !== null
    : false;
