/**
 * @module Utils
 */

import * as _ from "@lisn/_internal";

import {
  ColorComponents,
  ColorComponentsWithAlpha,
  ColorHSLComponents,
  ColorHSLAComponents,
  ColorRGBComponents,
  ColorRGBAComponents,
} from "@lisn/globals/types";

import { toNumWithBounds } from "@lisn/utils/math";

/**
 * Returns true if the given value is a valid {@link ColorComponents} object
 * containing all channels (alpha channel is optional).
 *
 * @category Validation
 *
 * @since v1.3.0
 */
export const isValidColorComponents = (
  color: unknown,
): color is ColorComponents =>
  _.isPlainObject(color) &&
  IS_KNOWN_SPACE[sortChars(_.keysOf(color))] === true &&
  _.keysOf(color).every((k) => _.isNumber(color[k])); // don't bother validating number range

/**
 * Adds the values of the given other color to the first color, where each
 * channel's value is simply added to the existing value. Then limits are
 * enforced, such that for example alpha channel is between 0 and 1, hue degree
 * is modulo 360, etc.
 *
 * @since v1.3.0
 *
 * @category Color
 */
export function addColor(
  color: ColorHSLComponents,
  other: Partial<ColorHSLComponents>,
): ColorHSLAComponents;
export function addColor(
  color: ColorComponents,
  other: Partial<ColorComponents>,
): ColorRGBAComponents;

export function addColor(
  color: ColorComponents,
  other: Partial<ColorComponents>,
): ColorComponentsWithAlpha {
  // Ensure, both are in the same space. Unless both are HSL, then we work in
  // RGB by default.
  if (!colorIsHSL(color) || (_.numKeysOf(other) > 0 && !colorIsHSL(other))) {
    color = colorIsHSL(color) ? hsl2rgb(color) : color;
    other = colorIsHSL(other) ? hsl2rgb(other) : other;
  }

  const output = _.copyObject(color);

  let ch: keyof typeof output;
  for (ch in output) {
    const currVal = output[ch];
    const newVal = other[ch] ?? 0;
    if (!_.isUndefined(currVal)) {
      output[ch] = currVal + newVal;
    }
  }

  return colorIsHSL(output)
    ? normalizeHSLColor(output)
    : normalizeRGBColor(output);
}

/**
 * Converts the given value to {@link ColorComponents}. If the value is an
 * object containing one or more channel values in a recognised space (HSLA or
 * RGBA), it returns a complete {@link ColorComponents} of the same space
 * and sets default values for missing channels, as follows:
 * - HSL:
 *   - h: 0
 *   - s: 100
 *   - l: 50
 *   - a: 1
 * - RGB:
 *   - r: 0
 *   - g: 0
 *   - b: 0
 *   - a: 1
 *
 * If the given value is not an object, or contains no HSL or RGB channels, it
 * returns undefined.
 *
 * @since v1.3.0
 *
 * @category Color
 */
export const toColorComponents = (
  v: unknown,
): ColorComponentsWithAlpha | undefined =>
  _.isPlainObject(v)
    ? colorIsHSL(v)
      ? normalizeHSLColor(v)
      : colorIsRGB(v)
        ? normalizeRGBColor(v)
        : void 0
    : void 0;

/**
 * Converts the given HSLA color to RGBA. Default values for the channels are:
 * - h: 0
 * - s: 100
 * - l: 50
 * - a: 1
 *
 * @since v1.3.0
 *
 * @category Color
 */
export const hsl2rgb = (
  color: Partial<ColorHSLComponents>,
): ColorRGBAComponents => {
  // Credit: https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
  const { h, s, l, a } = normalizeHSLColor(color);

  const lFr = l / 100;
  const A = (s * _.min(lFr, 1 - lFr)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = lFr - A * _.max(_.min(k - 3, 9 - k, 1), -1);
    return _.round(255 * (color + 1e-15));
  };
  return { r: f(0), g: f(8), b: f(4), a };
};

// --------------------

const sortChars = (s: string | string[]) => [...s].sort().join("");

const KNOWN_COLOR_SPACES = ["rgb", "rgba", "hsl", "hsla"];
const IS_KNOWN_SPACE = (() => {
  const sortedSpaces: Record<string, true> = {};
  for (const space of KNOWN_COLOR_SPACES) {
    sortedSpaces[sortChars(space)] = true;
  }
  return sortedSpaces;
})();

function colorIsHSL(
  c: Partial<ColorComponents>,
): c is Partial<ColorHSLComponents>;
function colorIsHSL(c: ColorComponents): c is ColorHSLComponents;
function colorIsHSL(c: ColorComponentsWithAlpha): c is ColorHSLAComponents;
function colorIsHSL(c: Partial<ColorComponents>) {
  return "h" in c || "s" in c || "l" in c;
}

function colorIsRGB(
  c: Partial<ColorComponents>,
): c is Partial<ColorRGBComponents>;
function colorIsRGB(c: ColorComponents): c is ColorRGBComponents;
function colorIsRGB(c: ColorComponentsWithAlpha): c is ColorRGBAComponents;
function colorIsRGB(c: Partial<ColorComponents>) {
  return "r" in c || "g" in c || "b" in c;
}

const normalizeHSLColor = (
  color: Partial<ColorHSLComponents>,
): ColorHSLAComponents => {
  const normalizeNum = (value: number, max = 100) =>
    toNumWithBounds(value, { min: 0, max });

  let { h = 0, s = 100, l = 50, a = 1 } = color;
  h = ((h % 360) + 360) % 360;
  s = normalizeNum(s);
  l = normalizeNum(l);
  a = normalizeNum(a, 1);
  return { h, s, l, a };
};

const normalizeRGBColor = (
  color: Partial<ColorRGBComponents>,
): ColorRGBAComponents => {
  const normalizeNum = (value: number, max = 255) =>
    toNumWithBounds(value, { min: 0, max });

  let { r = 0, g = 0, b = 0, a = 1 } = color;

  r = normalizeNum(r);
  g = normalizeNum(g);
  b = normalizeNum(b);
  a = normalizeNum(a, 1);
  return { r, g, b, a };
};
