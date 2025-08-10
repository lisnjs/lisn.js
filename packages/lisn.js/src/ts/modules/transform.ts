/**
 * @module Modules/XMap
 *
 * @since v1.3.0
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { Axis, Origin } from "@lisn/globals/types";

import { isValidNum, sum } from "@lisn/utils/math";

export type TransformCategory =
  | typeof TRANSLATE
  | typeof SCALE
  | typeof SKEW
  | typeof ROTATE;

export type TransformOperationID =
  | typeof RESET
  | typeof TRANSLATE_X
  | typeof TRANSLATE_Y
  | typeof TRANSLATE_Z
  | typeof TRANSLATE
  | typeof SCALE_X
  | typeof SCALE_Y
  | typeof SCALE_Z
  | typeof SCALE
  | typeof SKEW_X
  | typeof SKEW_Y
  | typeof SKEW
  | typeof ROTATE_X
  | typeof ROTATE_Y
  | typeof ROTATE_Z
  | typeof ROTATE;

export type TranslateOperation = ReturnType<
  | typeof Transform.translateX
  | typeof Transform.translateY
  | typeof Transform.translateZ
  | typeof Transform.translate
>;

export type ScaleOperation = ReturnType<
  | typeof Transform.scaleX
  | typeof Transform.scaleY
  | typeof Transform.scaleZ
  | typeof Transform.scale
>;

export type SkewOperation = ReturnType<
  typeof Transform.skewX | typeof Transform.skewY | typeof Transform.skew
>;

export type RotateOperation = ReturnType<
  | typeof Transform.rotateX
  | typeof Transform.rotateY
  | typeof Transform.rotateZ
  | typeof Transform.rotate
>;

export type ResetOperation = ReturnType<typeof Transform.reset>;

export type TransformOperation =
  | TranslateOperation
  | ScaleOperation
  | SkewOperation
  | RotateOperation
  | ResetOperation;

/**
 * {@link Transform} represents a 3D transform matrix.
 * All operations modify the transform in place and also return it for use in
 * chaining.
 */
export class Transform {
  /**
   * Returns a reference to the internal 4x4 transform matrix. Modifying it will
   * modify the effective transform.
   */
  matrix: DOMMatrix;

  /**
   * Returns a `matrix3d(...)` string for use as a CSS property.
   */
  readonly toString: () => string;

  /**
   * Returns a new {@link Transform} identical to the current one.
   */
  readonly clone: () => Transform;

  /**
   * Resets the transformation back to the default (identity) one.
   */
  readonly reset: () => Transform;

  /**
   * Inverts the transform in place.
   */
  readonly invert: () => Transform;

  /**
   * Translates the transform in place along the X-axis.
   *
   * @param t The translation distance in pixels.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the distance is not a finite number.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly translateX: (t: number) => Transform;

  /**
   * Translates the transform in place along the Y-axis.
   *
   * @param t The translation distance in pixels.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the distance is not a finite number.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly translateY: (t: number) => Transform;

  /**
   * Translates the transform in place along the Z-axis.
   *
   * @param t The translation distance in pixels.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the distance is not a finite number.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly translateZ: (t: number) => Transform;

  /**
   * Translates the transform in place.
   *
   * @param tx       The translation distance in pixels along the X-axis.
   * @param ty       The translation distance in pixels along the Y-axis.
   * @param [tz = 0] The translation distance in pixels along the Z-axis.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If any of the distances are not a finite number.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly translate: (tx: number, ty: number, tz?: number) => Transform;

  /**
   * The reverse of {@link translateX}.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the distance is not a finite number.
   */
  readonly inverseTranslateX: (t: number) => Transform;

  /**
   * The reverse of {@link translateY}.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the distance is not a finite number.
   */
  readonly inverseTranslateY: (t: number) => Transform;

  /**
   * The reverse of {@link translateZ}.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the distance is not a finite number.
   */
  readonly inverseTranslateZ: (t: number) => Transform;

  /**
   * The reverse of {@link translate}.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If any of the distances are not a finite number.
   */
  readonly inverseTranslate: (tx: number, ty: number, tz?: number) => Transform;

  /**
   * Scales the transform in place along the X-axis.
   *
   * @param s                  The scaling factor.
   * @param [origin = [0,0,0]] The origin of the operation.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the scaling factor is 0 or not a finite number, or the
   *                origin is not a finite number.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly scaleX: (s: number, origin?: Origin) => Transform;

  /**
   * Scales the transform in place along the Y-axis.
   *
   * @param s                  The scaling factor.
   * @param [origin = [0,0,0]] The origin of the operation.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the scaling factor is 0 or not a finite number, or the
   *                origin is not a finite number.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly scaleY: (s: number, origin?: Origin) => Transform;

  /**
   * Scales the transform in place along the Z-axis.
   *
   * @param s                  The scaling factor.
   * @param [origin = [0,0,0]] The origin of the operation.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the scaling factor is 0 or not a finite number, or the
   *                origin is not a finite number.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly scaleZ: (s: number, origin?: Origin) => Transform;

  /**
   * Scales the transform in place.
   *
   * @param sx                 The scaling factor along the X-axis.
   * @param sy                 The scaling factor along the Y-axis.
   * @param [sz = 1]           The scaling factor along the Z-axis.
   * @param [origin = [0,0,0]] The origin of the operation.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If any of the scaling factors are 0 or not a finite number,
   *                or the origin is not a finite number.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly scale: (
    sx: number,
    sy: number,
    sz?: number,
    origin?: Origin,
  ) => Transform;

  /**
   * The reverse of {@link scaleX}.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the scaling factor is 0 or not a finite number, or the
   *                origin is not a finite number.
   */
  readonly inverseScaleX: (s: number, origin?: Origin) => Transform;

  /**
   * The reverse of {@link scaleY}.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the scaling factor is 0 or not a finite number, or the
   *                origin is not a finite number.
   */
  readonly inverseScaleY: (s: number, origin?: Origin) => Transform;

  /**
   * The reverse of {@link scaleZ}.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the scaling factor is 0 or not a finite number, or the
   *                origin is not a finite number.
   */
  readonly inverseScaleZ: (s: number, origin?: Origin) => Transform;

  /**
   * The reverse of {@link scale}.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If any of the scaling factors are 0 or not a finite number,
   *                or the origin is not a finite number.
   */
  readonly inverseScale: (
    sx: number,
    sy: number,
    sz?: number,
    origin?: Origin,
  ) => Transform;

  /**
   * Skews the transform in place along the X-axis.
   *
   * @param deg The skewing angle in degrees.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the angle is not a finite number.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly skewX: (deg: number) => Transform;

  /**
   * Skews the transform in place along the Y-axis.
   *
   * @param deg The skewing angle in degrees.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the angle is not a finite number.
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
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If any of the angles are not a finite number.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly skew: (degX: number, degY: number) => Transform;

  /**
   * The reverse of {@link skewX}.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the angle is not a finite number.
   */
  readonly inverseSkewX: (deg: number) => Transform;

  /**
   * The reverse of {@link skewY}.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the angle is not a finite number.
   */
  readonly inverseSkewY: (deg: number) => Transform;

  /**
   * The reverse of {@link skew}.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If any of the angles are not a finite number.
   */
  readonly inverseSkew: (degX: number, degY: number) => Transform;

  /**
   * Rotates the transform in place around the X-axis.
   *
   * @param deg The rotation angle in degrees.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the angle is not a finite number.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly rotateX: (deg: number) => Transform;

  /**
   * Rotates the transform in place around the Y-axis.
   *
   * @param deg The rotation angle in degrees.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the angle is not a finite number.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly rotateY: (deg: number) => Transform;

  /**
   * Rotates the transform in place around the Z-axis.
   *
   * @param deg The rotation angle in degrees.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the angle is not a finite number.
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
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If any of the angles are not a finite number.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly rotate: (deg: number, axis: Axis) => Transform;

  /**
   * The reverse of {@link rotateX}.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the angle is not a finite number.
   */
  readonly inverseRotateX: (deg: number) => Transform;

  /**
   * The reverse of {@link rotateY}.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the angle is not a finite number.
   */
  readonly inverseRotateY: (deg: number) => Transform;

  /**
   * The reverse of {@link rotateZ}.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the angle is not a finite number.
   */
  readonly inverseRotateZ: (deg: number) => Transform;

  /**
   * The reverse of {@link rotate}.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If any of the angles are not a finite number.
   */
  readonly inverseRotate: (deg: number, axis: Axis) => Transform;

  /**
   * Applies the given {@link Transform}s in place.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If encountering an unknown transform or invalid input for
   *                any transform. Note that transforms preceding the unknown
   *                one would have already been applied.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly apply: (...transforms: TransformOperation[]) => Transform;

  /**
   * Inverses the given {@link Transform}s in place. They are inverted in
   * reverse order, so that `inverseApply(T1, T2, T3)` undoes `apply(T1, T2, T3)`.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If encountering an unknown transform or invalid input for
   *                any transform. Note that transforms preceding the unknown
   *                one would have already been applied.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly inverseApply: (...transforms: TransformOperation[]) => Transform;

  static readonly reset = () => toOperation(RESET);
  static readonly translateX = (t: number) => toOperation(TRANSLATE_X, t);
  static readonly translateY = (t: number) => toOperation(TRANSLATE_Y, t);
  static readonly translateZ = (t: number) => toOperation(TRANSLATE_Z, t);
  static readonly translate = (tx: number, ty: number, tz?: number) =>
    toOperation(TRANSLATE, tx, ty, tz);

  static readonly scaleX = (s: number, origin?: Origin) =>
    toOperation(SCALE_X, s, origin);
  static readonly scaleY = (s: number, origin?: Origin) =>
    toOperation(SCALE_Y, s, origin);
  static readonly scaleZ = (s: number, origin?: Origin) =>
    toOperation(SCALE_Z, s, origin);
  static readonly scale = (
    sx: number,
    sy: number,
    sz?: number,
    origin?: Origin,
  ) => toOperation(SCALE, sx, sy, sz, origin);

  static readonly skewX = (deg: number) => toOperation(SKEW_X, deg);
  static readonly skewY = (deg: number) => toOperation(SKEW_Y, deg);
  static readonly skew = (degX: number, degY: number) =>
    toOperation(SKEW, degX, degY);

  static readonly rotateX = (deg: number) => toOperation(ROTATE_X, deg);
  static readonly rotateY = (deg: number) => toOperation(ROTATE_Y, deg);
  static readonly rotateZ = (deg: number) => toOperation(ROTATE_Z, deg);
  static readonly rotate = (deg: number, axis: Axis) =>
    toOperation(ROTATE, deg, axis);

  constructor(input?: Transform | DOMMatrix | Float32Array) {
    const selfM = newMatrix(input);

    const reset = () => {
      selfM.m12 =
        selfM.m13 =
        selfM.m14 =
        selfM.m21 =
        selfM.m23 =
        selfM.m24 =
        selfM.m31 =
        selfM.m32 =
        selfM.m34 =
        selfM.m41 =
        selfM.m42 =
        selfM.m43 =
          0;
      selfM.m11 = selfM.m22 = selfM.m33 = selfM.m44 = 1;
      return this;
    };

    const invert = () => {
      selfM.invertSelf();
      return this;
    };

    // ----------

    const translateX = (t: number) => translate(t, 0);
    const translateY = (t: number) => translate(0, t);
    const translateZ = (t: number) => translate(0, 0, t);

    const translate = (tx: number, ty: number, tz = 0) => {
      validateInputs("Translate distance", [tx, ty, tz]);
      selfM.translateSelf(tx, ty, tz);
      return this;
    };

    const inverseTranslateX = (t: number) => inverseTranslate(t, 0);
    const inverseTranslateY = (t: number) => inverseTranslate(0, t);
    const inverseTranslateZ = (t: number) => inverseTranslate(0, 0, t);

    const inverseTranslate = (tx: number, ty: number, tz = 0) =>
      translate(-tx, -ty, -tz);

    // ----------

    const scaleX = (s: number, origin?: Origin) => scale(s, 1, 1, origin);
    const scaleY = (s: number, origin?: Origin) => scale(1, s, 1, origin);
    const scaleZ = (s: number, origin?: Origin) => scale(1, 1, s, origin);

    const scale = (sx: number, sy: number, sz = 1, origin = [0, 0, 0]) => {
      validateInputs("Scale factor", [sx, sy, sz], true);
      validateInputs("Origin", origin);
      selfM.scaleSelf(sx, sy, sz, ...origin);
      return this;
    };

    const inverseScaleX = (s: number, origin?: Origin) =>
      inverseScale(s, 1, 1, origin);
    const inverseScaleY = (s: number, origin?: Origin) =>
      inverseScale(1, s, 1, origin);
    const inverseScaleZ = (s: number, origin?: Origin) =>
      inverseScale(1, 1, s, origin);

    const inverseScale = (sx: number, sy: number, sz = 1, origin?: Origin) => {
      validateInputs("Scale factor", [sx, sy, sz], true);
      return scale(1 / sx, 1 / sy, 1 / sz, origin);
    };

    // ----------

    const skewX = (deg: number) => skew(deg, 0);
    const skewY = (deg: number) => skew(0, deg);

    const skew = (degX: number, degY: number) => {
      validateInputs("Skew angle", [degX, degY]);
      selfM.skewXSelf(degX).skewYSelf(degY);
      return this;
    };

    const inverseSkewX = (deg: number) => inverseSkew(deg, 0);
    const inverseSkewY = (deg: number) => inverseSkew(0, deg);

    const inverseSkew = (degX: number, degY: number) => {
      validateInputs("Skew angle", [degX, degY]);
      selfM.skewYSelf(-degY).skewXSelf(-degX);
      return this;
    };

    // ----------

    const rotateX = (deg: number) => rotate(deg, [1, 0, 0]);
    const rotateY = (deg: number) => rotate(deg, [0, 1, 0]);
    const rotateZ = (deg: number) => rotate(deg, [0, 0, 1]);

    const rotate = (deg: number, axis: Axis) => {
      validateInputs("Rotation axis", [sum(...axis)], true);
      selfM.rotateAxisAngleSelf(axis[0], axis[1], axis[2] ?? 0, deg);
      return this;
    };

    const inverseRotateX = (deg: number) => inverseRotate(deg, [1, 0, 0]);
    const inverseRotateY = (deg: number) => inverseRotate(deg, [0, 1, 0]);
    const inverseRotateZ = (deg: number) => inverseRotate(deg, [0, 0, 1]);

    const inverseRotate = (deg: number, axis: Axis) => rotate(-deg, axis);

    const apply = (transforms: TransformOperation[], inverse: boolean) => {
      if (inverse) {
        transforms = transforms.reverse();
      }

      for (const t of transforms) {
        const { operation, args } = t;
        switch (operation) {
          case RESET:
            reset();
            break;

          case TRANSLATE_X:
            (inverse ? inverseTranslateX : translateX)(...args);
            break;
          case TRANSLATE_Y:
            (inverse ? inverseTranslateY : translateY)(...args);
            break;
          case TRANSLATE_Z:
            (inverse ? inverseTranslateZ : translateZ)(...args);
            break;
          case TRANSLATE:
            (inverse ? inverseTranslate : translate)(...args);
            break;

          case SCALE_X:
            (inverse ? inverseScaleX : scaleX)(...args);
            break;
          case SCALE_Y:
            (inverse ? inverseScaleY : scaleY)(...args);
            break;
          case SCALE_Z:
            (inverse ? inverseScaleZ : scaleZ)(...args);
            break;
          case SCALE:
            (inverse ? inverseScale : scale)(...args);
            break;

          case SKEW_X:
            (inverse ? inverseSkewX : skewX)(...args);
            break;
          case SKEW_Y:
            (inverse ? inverseSkewY : skewY)(...args);
            break;
          case SKEW:
            (inverse ? inverseSkew : skew)(...args);
            break;

          case ROTATE_X:
            (inverse ? inverseRotateX : rotateX)(...args);
            break;
          case ROTATE_Y:
            (inverse ? inverseRotateY : rotateY)(...args);
            break;
          case ROTATE_Z:
            (inverse ? inverseRotateZ : rotateZ)(...args);
            break;
          case ROTATE:
            (inverse ? inverseRotate : rotate)(...args);
            break;

          default:
            throw MH.usageError("Unknown transform operation");
        }
      }

      return this;
    };

    // ----------

    this.matrix = selfM;

    this.toString = () => selfM.toString();
    this.clone = () => new Transform(selfM);
    this.reset = reset;
    this.invert = invert;

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

export const RESET: unique symbol = MC.SYMBOL() as typeof RESET;

export const TRANSLATE_X: unique symbol = MC.SYMBOL() as typeof TRANSLATE_X;
export const TRANSLATE_Y: unique symbol = MC.SYMBOL() as typeof TRANSLATE_Y;
export const TRANSLATE_Z: unique symbol = MC.SYMBOL() as typeof TRANSLATE_Z;
export const TRANSLATE: unique symbol = MC.SYMBOL() as typeof TRANSLATE;

export const SCALE_X: unique symbol = MC.SYMBOL() as typeof SCALE_X;
export const SCALE_Y: unique symbol = MC.SYMBOL() as typeof SCALE_Y;
export const SCALE_Z: unique symbol = MC.SYMBOL() as typeof SCALE_Z;
export const SCALE: unique symbol = MC.SYMBOL() as typeof SCALE;

export const SKEW_X: unique symbol = MC.SYMBOL() as typeof SKEW_X;
export const SKEW_Y: unique symbol = MC.SYMBOL() as typeof SKEW_Y;
export const SKEW: unique symbol = MC.SYMBOL() as typeof SKEW;

export const ROTATE_X: unique symbol = MC.SYMBOL() as typeof ROTATE_X;
export const ROTATE_Y: unique symbol = MC.SYMBOL() as typeof ROTATE_Y;
export const ROTATE_Z: unique symbol = MC.SYMBOL() as typeof ROTATE_Z;
export const ROTATE: unique symbol = MC.SYMBOL() as typeof ROTATE;

// ----------------------------------------

const newMatrix = (input?: Transform | DOMMatrix | Float32Array) => {
  const inputM = MH.isInstanceOf(input, Transform) ? input.matrix : input;
  return new DOMMatrix(
    MH.isNullish(inputM)
      ? inputM
      : MH.arrayFrom(
          MH.isInstanceOf(inputM, DOMMatrix) ? inputM.toFloat32Array() : inputM,
        ),
  );
};

const validateInputs = (
  name: string,
  inputs: number[],
  requireNonZero = false,
) => {
  for (const i of inputs) {
    if (!isValidNum(i) || (requireNonZero && MH.abs(i) < 1e-10)) {
      throw MH.usageError(
        `${name} must be finite${requireNonZero ? " and non-zero" : ""}`,
      );
    }
  }
};

const toOperation = <
  O extends TransformOperationID,
  A extends readonly unknown[],
>(
  operation: O,
  ...args: A
) => ({ operation, args });
