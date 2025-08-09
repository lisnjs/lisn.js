/**
 * @module Modules/XMap
 *
 * @since v1.3
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { degToRad, normalizeAxis } from "@lisn/utils/math";

export type TransformOperation = ReturnType<
  | typeof Transform.TRANSLATE_X
  | typeof Transform.TRANSLATE_Y
  | typeof Transform.TRANSLATE_Z
  | typeof Transform.TRANSLATE
  | typeof Transform.SCALE_X
  | typeof Transform.SCALE_Y
  | typeof Transform.SCALE_Z
  | typeof Transform.SCALE
  | typeof Transform.SKEW_X
  | typeof Transform.SKEW_Y
  | typeof Transform.SKEW
  | typeof Transform.ROTATE_X
  | typeof Transform.ROTATE_Y
  | typeof Transform.ROTATE_Z
  | typeof Transform.ROTATE
>;

/**
 * {@link Transform} represents a 3D transform matrix.
 * All operations modify the transform in place and also return it for use in
 * chaining.
 */
export class Transform {
  /**
   * Returns a reference to the internal transform 4x4 matrix. Modifying it will
   * modify the effective transform.
   */
  matrix: Float32Array;

  /**
   * Returns a `matrix3d(...)` string for use as a CSS property.
   */
  readonly toString: () => string;

  /**
   * Returns a new {@link Transform} identical to the current one.
   */
  readonly clone: () => Transform;

  /**
   * If the transform is invertible, it inverts it in place.
   *
   * @returns `null` if the transform matrix can't be inverted or otherwise
   * returns the same {@link Transform} instance.
   */
  readonly invert: () => Transform | null;

  /**
   * Multiplies the transform by the given matrix in place.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly multiply: (other: Transform | Float32Array) => Transform | null;

  /**
   * Translates the transform in place along the X-axis.
   *
   * @param t The translation distance in pixels.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly translateX: (t: number) => Transform;

  /**
   * Translates the transform in place along the Y-axis.
   *
   * @param t The translation distance in pixels.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly translateY: (t: number) => Transform;

  /**
   * Translates the transform in place along the Z-axis.
   *
   * @param t The translation distance in pixels.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly translateZ: (t: number) => Transform;

  /**
   * Translates the transform in place.
   *
   * @param x The translation distance in pixels along the X-axis.
   * @param y The translation distance in pixels along the Y-axis.
   * @param [z = 0] The translation distance in pixels along the Z-axis.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly translate: (x: number, y: number, z?: number) => Transform;

  /**
   * The reverse of {@link translateX}.
   */
  readonly inverseTranslateX: (t: number) => Transform;

  /**
   * The reverse of {@link translateY}.
   */
  readonly inverseTranslateY: (t: number) => Transform;

  /**
   * The reverse of {@link translateZ}.
   */
  readonly inverseTranslateZ: (t: number) => Transform;

  /**
   * The reverse of {@link translate}.
   */
  readonly inverseTranslate: (x: number, y: number, z?: number) => Transform;

  /**
   * Scales the transform in place along the X-axis.
   *
   * @param s The scaling factor.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly scaleX: (s: number) => Transform;

  /**
   * Scales the transform in place along the Y-axis.
   *
   * @param s The scaling factor.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly scaleY: (s: number) => Transform;

  /**
   * Scales the transform in place along the Z-axis.
   *
   * @param s The scaling factor.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly scaleZ: (s: number) => Transform;

  /**
   * Scales the transform in place.
   *
   * @param x The scaling factor along the X-axis.
   * @param y The scaling factor along the Y-axis.
   * @param [z = 1] The scaling factor along the Z-axis.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly scale: (x: number, y: number, z?: number) => Transform;

  /**
   * The reverse of {@link scaleX}.
   *
   * @returns `null` if the scale operation can't be inverted (because the
   * scaling factor was 0) or otherwise returns the same {@link Transform}
   * instance.
   */
  readonly inverseScaleX: (t: number) => Transform | null;

  /**
   * The reverse of {@link scaleY}.
   *
   * @returns `null` if the scale operation can't be inverted (because the
   * scaling factor was 0) or otherwise returns the same {@link Transform}
   * instance.
   */
  readonly inverseScaleY: (t: number) => Transform | null;

  /**
   * The reverse of {@link scaleZ}.
   *
   * @returns `null` if the scale operation can't be inverted (because the
   * scaling factor was 0) or otherwise returns the same {@link Transform}
   * instance.
   */
  readonly inverseScaleZ: (t: number) => Transform | null;

  /**
   * The reverse of {@link scale}.
   *
   * @returns `null` if the scale operation can't be inverted (because the
   * scaling factor was 0) or otherwise returns the same {@link Transform}
   * instance.
   */
  readonly inverseScale: (x: number, y: number, z?: number) => Transform | null;

  /**
   * Skews the transform in place along the X-axis.
   *
   * @param deg The skewing angle in degrees.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly skewX: (deg: number) => Transform;

  /**
   * Skews the transform in place along the Y-axis.
   *
   * @param deg The skewing angle in degrees.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly skewY: (deg: number) => Transform;

  /**
   * Skews the transform in place.
   *
   * @param degX The skewing angle in degrees along the X-axis.
   * @param degY The skewing angle in degrees along the Y-axis.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly skew: (degX: number, degY: number) => Transform;

  /**
   * The reverse of {@link skewX}.
   *
   * @returns `null` if the skew operation can't be inverted or otherwise
   * returns the same {@link Transform} instance.
   */
  readonly inverseSkewX: (t: number) => Transform | null;

  /**
   * The reverse of {@link skewY}.
   *
   * @returns `null` if the skew operation can't be inverted or otherwise
   * returns the same {@link Transform} instance.
   */
  readonly inverseSkewY: (t: number) => Transform | null;

  /**
   * The reverse of {@link skew}.
   *
   * @returns `null` if the skew operation can't be inverted or otherwise
   * returns the same {@link Transform} instance.
   */
  readonly inverseSkew: (degX: number, degY: number) => Transform | null;

  /**
   * Rotates the transform in place around the X-axis.
   *
   * @param deg The rotation angle in degrees.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly rotateX: (deg: number) => Transform;

  /**
   * Rotates the transform in place around the Y-axis.
   *
   * @param deg The rotation angle in degrees.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly rotateY: (deg: number) => Transform;

  /**
   * Rotates the transform in place around the Z-axis.
   *
   * @param deg The rotation angle in degrees.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly rotateZ: (deg: number) => Transform;

  /**
   * Rotates the transform in place around the given axis.
   *
   * @param deg The rotation angle in degrees.
   * @param x   The X portion of the axis of rotation.
   * @param y   The Y portion of the axis of rotation.
   * @param z   The Z portion of the axis of rotation.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly rotate: (deg: number, x: number, y: number, z?: number) => Transform;

  /**
   * The reverse of {@link rotateX}.
   */
  readonly inverseRotateX: (t: number) => Transform;

  /**
   * The reverse of {@link rotateY}.
   */
  readonly inverseRotateY: (t: number) => Transform;

  /**
   * The reverse of {@link rotateZ}.
   */
  readonly inverseRotateZ: (t: number) => Transform;

  /**
   * The reverse of {@link rotate}.
   */
  readonly inverseRotate: (
    deg: number,
    x: number,
    y: number,
    z?: number,
  ) => Transform;

  /**
   * Applies the given {@link Transform}s in place.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If encountering an unknown transform. Note that transforms
   *                preceding the unknown one would have already been applied.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly apply: (...transforms: TransformOperation[]) => Transform;

  /**
   * Inverses the given {@link Transform}s in place. They are inverted in
   * reverse order, so that `inverseApply(T1, T2, T3)` undoes `apply(T1, T2, T3)`.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If encountering an unknown transform. Note that transforms
   *                preceding the unknown one would have already been applied.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly inverseApply: (...transforms: TransformOperation[]) => Transform;

  static readonly TRANSLATE_X = (x: number) => [TRANSLATE_X, x] as const;
  static readonly TRANSLATE_Y = (y: number) => [TRANSLATE_Y, y] as const;
  static readonly TRANSLATE_Z = (z: number) => [TRANSLATE_Z, z] as const;
  static readonly TRANSLATE = (x: number, y: number, z?: number) =>
    [TRANSLATE, x, y, z] as const;

  static readonly SCALE_X = (x: number) => [SCALE_X, x] as const;
  static readonly SCALE_Y = (y: number) => [SCALE_Y, y] as const;
  static readonly SCALE_Z = (z: number) => [SCALE_Z, z] as const;
  static readonly SCALE = (x: number, y: number, z?: number) =>
    [SCALE, x, y, z] as const;

  static readonly SKEW_X = (degX: number) => [SKEW_X, degX] as const;
  static readonly SKEW_Y = (degY: number) => [SKEW_Y, degY] as const;
  static readonly SKEW = (degX: number, degY: number) =>
    [SKEW, degX, degY] as const;

  static readonly ROTATE_X = (degX: number) => [ROTATE_X, degX] as const;
  static readonly ROTATE_Y = (degY: number) => [ROTATE_Y, degY] as const;
  static readonly ROTATE_Z = (degZ: number) => [ROTATE_Z, degZ] as const;
  static readonly ROTATE = (deg: number, x: number, y: number, z?: number) =>
    [ROTATE, deg, x, y, z] as const;

  constructor(input?: Transform | Float32Array) {
    const selfM = MH.isNullish(input)
      ? newTransformMatrix()
      : MH.isInstanceOf(input, Transform)
        ? new Float32Array(input.matrix)
        : new Float32Array(input);

    const invert = () => invertInPlace(this);

    const multiply = (other: Transform | Float32Array) =>
      multiplyInPlace(this, other);

    // ----------

    const translateX = (t: number) => translate(t, 0);
    const translateY = (t: number) => translate(0, t);
    const translateZ = (t: number) => translate(0, 0, t);

    const translate = (x: number, y: number, z = 0) => {
      const t = newTransformMatrix();
      t[12] = x;
      t[13] = y;
      t[14] = z;
      return multiply(t);
    };

    const inverseTranslateX = (t: number) => inverseTranslate(t, 0);
    const inverseTranslateY = (t: number) => inverseTranslate(0, t);
    const inverseTranslateZ = (t: number) => inverseTranslate(0, 0, t);

    const inverseTranslate = (x: number, y: number, z = 0) =>
      translate(-x, -y, -z);

    // ----------

    const scaleX = (s: number) => scale(s, 1);
    const scaleY = (s: number) => scale(1, s);
    const scaleZ = (s: number) => scale(1, 1, s);

    const scale = (x: number, y: number, z = 1) => {
      const s = newTransformMatrix();
      s[0] = x;
      s[5] = y;
      s[10] = z;
      return multiply(s);
    };

    const inverseScaleX = (s: number) => inverseScale(s, 1);
    const inverseScaleY = (s: number) => inverseScale(1, s);
    const inverseScaleZ = (s: number) => inverseScale(1, 1, s);

    const inverseScale = (x: number, y: number, z = 1) =>
      !canDivideBy(x) || !canDivideBy(y) || !canDivideBy(z)
        ? null
        : scale(1 / x, 1 / y, 1 / z);

    // ----------

    const skewX = (deg: number) => skew(deg, 0);
    const skewY = (deg: number) => skew(0, deg);

    const skew = (degX: number, degY: number) => {
      const radX = degToRad(degX);
      const radY = degToRad(degY);
      const sk = newTransformMatrix();
      sk[4] = MH.tan(radX);
      sk[1] = MH.tan(radY);
      return multiply(sk);
    };

    const inverseSkewX = (deg: number) => inverseSkew(deg, 0);
    const inverseSkewY = (deg: number) => inverseSkew(0, deg);

    const inverseSkew = (degX: number, degY: number) => {
      const tanX = MH.tan(degToRad(degX));
      const tanY = MH.tan(degToRad(degY));
      const denom = 1 - tanX * tanY;

      if (!canDivideBy(denom)) {
        return null;
      }

      const iw = newTransformMatrix();
      iw[0] = 1 / denom;
      iw[1] = -tanY / denom;
      iw[4] = -tanX / denom;
      iw[5] = 1 / denom;

      return multiply(iw);
    };

    // ----------

    const rotateX = (deg: number) => rotate(deg, 1, 0, 0);
    const rotateY = (deg: number) => rotate(deg, 0, 1, 0);
    const rotateZ = (deg: number) => rotate(deg, 0, 0, 1);

    const rotate = (deg: number, x: number, y: number, z = 0) => {
      const rad = degToRad(deg);

      const [u, v, w] = normalizeAxis(x, y, z);

      const c = MH.cos(rad);
      const s = MH.sin(rad);
      const t = 1 - c;

      const r = newTransformMatrix();

      r[0] = t * u * u + c;
      r[1] = t * u * v + s * w;
      r[2] = t * u * w - s * v;

      r[4] = t * u * v - s * w;
      r[5] = t * v * v + c;
      r[6] = t * v * w + s * u;

      r[8] = t * u * w + s * v;
      r[9] = t * v * w - s * u;
      r[10] = t * w * w + c;

      return multiply(r);
    };

    const inverseRotateX = (deg: number) => inverseRotate(deg, 1, 0, 0);
    const inverseRotateY = (deg: number) => inverseRotate(deg, 0, 1, 0);
    const inverseRotateZ = (deg: number) => inverseRotate(deg, 0, 0, 1);

    const inverseRotate = (deg: number, x: number, y: number, z = 0) =>
      rotate(-deg, x, y, z);

    const apply = (transforms: TransformOperation[], inverse: boolean) => {
      if (inverse) {
        transforms = transforms.reverse();
      }

      for (const t of transforms) {
        const op = t[0];
        switch (op) {
          case TRANSLATE_X:
            (inverse ? inverseTranslateX : translateX)(t[1]);
            break;
          case TRANSLATE_Y:
            (inverse ? inverseTranslateY : translateY)(t[1]);
            break;
          case TRANSLATE_Z:
            (inverse ? inverseTranslateZ : translateZ)(t[1]);
            break;
          case TRANSLATE:
            (inverse ? inverseTranslate : translate)(t[1], t[2], t[3]);
            break;

          case SCALE_X:
            (inverse ? inverseScaleX : scaleX)(t[1]);
            break;
          case SCALE_Y:
            (inverse ? inverseScaleY : scaleY)(t[1]);
            break;
          case SCALE_Z:
            (inverse ? inverseScaleZ : scaleZ)(t[1]);
            break;
          case SCALE:
            (inverse ? inverseScale : scale)(t[1], t[2], t[3]);
            break;

          case SKEW_X:
            (inverse ? inverseSkewX : skewX)(t[1]);
            break;
          case SKEW_Y:
            (inverse ? inverseSkewY : skewY)(t[1]);
            break;
          case SKEW:
            (inverse ? inverseSkew : skew)(t[1], t[2]);
            break;

          case ROTATE_X:
            (inverse ? inverseRotateX : rotateX)(t[1]);
            break;
          case ROTATE_Y:
            (inverse ? inverseRotateY : rotateY)(t[1]);
            break;
          case ROTATE_Z:
            (inverse ? inverseRotateZ : rotateZ)(t[1]);
            break;
          case ROTATE:
            (inverse ? inverseRotate : rotate)(t[1], t[2], t[3], t[4]);
            break;

          default:
            throw MH.usageError("Unknown transform operation");
        }
      }

      return this;
    };

    // ----------

    this.matrix = selfM;

    this.toString = () => matrixToString(selfM);
    this.clone = () => new Transform(selfM);
    this.invert = invert;
    this.multiply = multiply;

    this.translateX = translateX;
    this.translateY = translateY;
    this.translateZ = translateZ;
    this.translate = translate;

    this.inverseTranslateX = inverseTranslateX;
    this.inverseTranslateY = inverseTranslateY;
    this.inverseTranslateZ = inverseTranslateZ;
    this.inverseTranslate = inverseTranslate;

    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.scaleZ = scaleZ;
    this.scale = scale;

    this.inverseScaleX = inverseScaleX;
    this.inverseScaleY = inverseScaleY;
    this.inverseScaleZ = inverseScaleZ;
    this.inverseScale = inverseScale;

    this.skewX = skewX;
    this.skewY = skewY;
    this.skew = skew;

    this.inverseSkewX = inverseSkewX;
    this.inverseSkewY = inverseSkewY;
    this.inverseSkew = inverseSkew;

    this.rotateX = rotateX;
    this.rotateY = rotateY;
    this.rotateZ = rotateZ;
    this.rotate = rotate;

    this.inverseRotateX = inverseRotateX;
    this.inverseRotateY = inverseRotateY;
    this.inverseRotateZ = inverseRotateZ;
    this.inverseRotate = inverseRotate;

    this.apply = (...transforms) => apply(transforms, false);
    this.inverseApply = (...transforms) => apply(transforms, true);
  }
}

/**
 * @ignore
 * @internal
 */
export const matrixToString = (m: Float32Array) =>
  `matrix3d(${MH.arrayFrom(m).join(",")})`;

// ----------------------------------------

const TRANSLATE_X: unique symbol = MC.SYMBOL() as typeof TRANSLATE_X;
const TRANSLATE_Y: unique symbol = MC.SYMBOL() as typeof TRANSLATE_Y;
const TRANSLATE_Z: unique symbol = MC.SYMBOL() as typeof TRANSLATE_Z;
const TRANSLATE: unique symbol = MC.SYMBOL() as typeof TRANSLATE;

const SCALE_X: unique symbol = MC.SYMBOL() as typeof SCALE_X;
const SCALE_Y: unique symbol = MC.SYMBOL() as typeof SCALE_Y;
const SCALE_Z: unique symbol = MC.SYMBOL() as typeof SCALE_Z;
const SCALE: unique symbol = MC.SYMBOL() as typeof SCALE;

const SKEW_X: unique symbol = MC.SYMBOL() as typeof SKEW_X;
const SKEW_Y: unique symbol = MC.SYMBOL() as typeof SKEW_Y;
const SKEW: unique symbol = MC.SYMBOL() as typeof SKEW;

const ROTATE_X: unique symbol = MC.SYMBOL() as typeof ROTATE_X;
const ROTATE_Y: unique symbol = MC.SYMBOL() as typeof ROTATE_Y;
const ROTATE_Z: unique symbol = MC.SYMBOL() as typeof ROTATE_Z;
const ROTATE: unique symbol = MC.SYMBOL() as typeof ROTATE;

const canDivideBy = (n: number) => MH.abs(n) > 1e-10;

const newBlankMatrix = (l = 16) => new Float32Array(l);

const newTransformMatrix = () => {
  const m = newBlankMatrix();
  m[0] = m[5] = m[10] = m[15] = 1;
  return m;
};

const invertInPlace = (self: Transform) => {
  const sourceM = self.matrix;
  const inv = newBlankMatrix();

  inv[0] =
    sourceM[5] * sourceM[10] * sourceM[15] -
    sourceM[5] * sourceM[11] * sourceM[14] -
    sourceM[9] * sourceM[6] * sourceM[15] +
    sourceM[9] * sourceM[7] * sourceM[14] +
    sourceM[13] * sourceM[6] * sourceM[11] -
    sourceM[13] * sourceM[7] * sourceM[10];
  inv[4] =
    -sourceM[4] * sourceM[10] * sourceM[15] +
    sourceM[4] * sourceM[11] * sourceM[14] +
    sourceM[8] * sourceM[6] * sourceM[15] -
    sourceM[8] * sourceM[7] * sourceM[14] -
    sourceM[12] * sourceM[6] * sourceM[11] +
    sourceM[12] * sourceM[7] * sourceM[10];
  inv[8] =
    sourceM[4] * sourceM[9] * sourceM[15] -
    sourceM[4] * sourceM[11] * sourceM[13] -
    sourceM[8] * sourceM[5] * sourceM[15] +
    sourceM[8] * sourceM[7] * sourceM[13] +
    sourceM[12] * sourceM[5] * sourceM[11] -
    sourceM[12] * sourceM[7] * sourceM[9];
  inv[12] =
    -sourceM[4] * sourceM[9] * sourceM[14] +
    sourceM[4] * sourceM[10] * sourceM[13] +
    sourceM[8] * sourceM[5] * sourceM[14] -
    sourceM[8] * sourceM[6] * sourceM[13] -
    sourceM[12] * sourceM[5] * sourceM[10] +
    sourceM[12] * sourceM[6] * sourceM[9];

  inv[1] =
    -sourceM[1] * sourceM[10] * sourceM[15] +
    sourceM[1] * sourceM[11] * sourceM[14] +
    sourceM[9] * sourceM[2] * sourceM[15] -
    sourceM[9] * sourceM[3] * sourceM[14] -
    sourceM[13] * sourceM[2] * sourceM[11] +
    sourceM[13] * sourceM[3] * sourceM[10];
  inv[5] =
    sourceM[0] * sourceM[10] * sourceM[15] -
    sourceM[0] * sourceM[11] * sourceM[14] -
    sourceM[8] * sourceM[2] * sourceM[15] +
    sourceM[8] * sourceM[3] * sourceM[14] +
    sourceM[12] * sourceM[2] * sourceM[11] -
    sourceM[12] * sourceM[3] * sourceM[10];
  inv[9] =
    -sourceM[0] * sourceM[9] * sourceM[15] +
    sourceM[0] * sourceM[11] * sourceM[13] +
    sourceM[8] * sourceM[1] * sourceM[15] -
    sourceM[8] * sourceM[3] * sourceM[13] -
    sourceM[12] * sourceM[1] * sourceM[11] +
    sourceM[12] * sourceM[3] * sourceM[9];
  inv[13] =
    sourceM[0] * sourceM[9] * sourceM[14] -
    sourceM[0] * sourceM[10] * sourceM[13] -
    sourceM[8] * sourceM[1] * sourceM[14] +
    sourceM[8] * sourceM[2] * sourceM[13] +
    sourceM[12] * sourceM[1] * sourceM[10] -
    sourceM[12] * sourceM[2] * sourceM[9];

  inv[2] =
    sourceM[1] * sourceM[6] * sourceM[15] -
    sourceM[1] * sourceM[7] * sourceM[14] -
    sourceM[5] * sourceM[2] * sourceM[15] +
    sourceM[5] * sourceM[3] * sourceM[14] +
    sourceM[13] * sourceM[2] * sourceM[7] -
    sourceM[13] * sourceM[3] * sourceM[6];
  inv[6] =
    -sourceM[0] * sourceM[6] * sourceM[15] +
    sourceM[0] * sourceM[7] * sourceM[14] +
    sourceM[4] * sourceM[2] * sourceM[15] -
    sourceM[4] * sourceM[3] * sourceM[14] -
    sourceM[12] * sourceM[2] * sourceM[7] +
    sourceM[12] * sourceM[3] * sourceM[6];
  inv[10] =
    sourceM[0] * sourceM[5] * sourceM[15] -
    sourceM[0] * sourceM[7] * sourceM[13] -
    sourceM[4] * sourceM[1] * sourceM[15] +
    sourceM[4] * sourceM[3] * sourceM[13] +
    sourceM[12] * sourceM[1] * sourceM[7] -
    sourceM[12] * sourceM[3] * sourceM[5];
  inv[14] =
    -sourceM[0] * sourceM[5] * sourceM[14] +
    sourceM[0] * sourceM[6] * sourceM[13] +
    sourceM[4] * sourceM[1] * sourceM[14] -
    sourceM[4] * sourceM[2] * sourceM[13] -
    sourceM[12] * sourceM[1] * sourceM[6] +
    sourceM[12] * sourceM[2] * sourceM[5];

  inv[3] =
    -sourceM[1] * sourceM[6] * sourceM[11] +
    sourceM[1] * sourceM[7] * sourceM[10] +
    sourceM[5] * sourceM[2] * sourceM[11] -
    sourceM[5] * sourceM[3] * sourceM[10] -
    sourceM[9] * sourceM[2] * sourceM[7] +
    sourceM[9] * sourceM[3] * sourceM[6];
  inv[7] =
    sourceM[0] * sourceM[6] * sourceM[11] -
    sourceM[0] * sourceM[7] * sourceM[10] -
    sourceM[4] * sourceM[2] * sourceM[11] +
    sourceM[4] * sourceM[3] * sourceM[10] +
    sourceM[8] * sourceM[2] * sourceM[7] -
    sourceM[8] * sourceM[3] * sourceM[6];
  inv[11] =
    -sourceM[0] * sourceM[5] * sourceM[11] +
    sourceM[0] * sourceM[7] * sourceM[9] +
    sourceM[4] * sourceM[1] * sourceM[11] -
    sourceM[4] * sourceM[3] * sourceM[9] -
    sourceM[8] * sourceM[1] * sourceM[7] +
    sourceM[8] * sourceM[3] * sourceM[5];
  inv[15] =
    sourceM[0] * sourceM[5] * sourceM[10] -
    sourceM[0] * sourceM[6] * sourceM[9] -
    sourceM[4] * sourceM[1] * sourceM[10] +
    sourceM[4] * sourceM[2] * sourceM[9] +
    sourceM[8] * sourceM[1] * sourceM[6] -
    sourceM[8] * sourceM[2] * sourceM[5];

  let det =
    sourceM[0] * inv[0] +
    sourceM[1] * inv[4] +
    sourceM[2] * inv[8] +
    sourceM[3] * inv[12];

  if (!canDivideBy(det)) {
    return null;
  }

  det = 1.0 / det;
  for (let i = 0; i < 16; i++) {
    sourceM[i] = inv[i] * det;
  }

  return self;
};

const multiplyInPlace = (self: Transform, other: Transform | Float32Array) => {
  const sourceM = self.matrix;
  const x = MH.isInstanceOf(other, Transform) ? other.matrix : other;

  const a00 = sourceM[0],
    a01 = sourceM[1],
    a02 = sourceM[2],
    a03 = sourceM[3];
  const a10 = sourceM[4],
    a11 = sourceM[5],
    a12 = sourceM[6],
    a13 = sourceM[7];
  const a20 = sourceM[8],
    a21 = sourceM[9],
    a22 = sourceM[10],
    a23 = sourceM[11];
  const a30 = sourceM[12],
    a31 = sourceM[13],
    a32 = sourceM[14],
    a33 = sourceM[15];

  const b00 = x[0],
    b01 = x[1],
    b02 = x[2],
    b03 = x[3];
  const b10 = x[4],
    b11 = x[5],
    b12 = x[6],
    b13 = x[7];
  const b20 = x[8],
    b21 = x[9],
    b22 = x[10],
    b23 = x[11];
  const b30 = x[12],
    b31 = x[13],
    b32 = x[14],
    b33 = x[15];

  sourceM[0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
  sourceM[1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
  sourceM[2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
  sourceM[3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;

  sourceM[4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
  sourceM[5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
  sourceM[6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
  sourceM[7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;

  sourceM[8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
  sourceM[9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
  sourceM[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
  sourceM[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;

  sourceM[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
  sourceM[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
  sourceM[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
  sourceM[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;

  return self;
};
