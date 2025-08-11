/**
 * @module Effects/Transform
 *
 * @since v1.3.0
 */

import * as MH from "@lisn/globals/minification-helpers";

import { AtLeastOne, Axis, Origin } from "@lisn/globals/types";

import { setStyleProp } from "@lisn/utils/css-alter";
import { isValidNum, sum } from "@lisn/utils/math";

import { Effect, EffectCallback, ScrollOffsets } from "@lisn/effects/effect";

/**
 * {@link Transform} controls an element's transform a 3D transform matrix.
 */
export class Transform implements Effect {
  /**
   * Returns a {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrixReadOnly | DOMMatrixReadOnly} representing the transform.
   *
   * @param relativeTo If given, then this matrix is first inverted and used as
   *                   a pre-multiplication
   */
  readonly toMatrix: (
    relativeTo?: Transform | DOMMatrix | Float32Array,
  ) => DOMMatrixReadOnly;

  /**
   * Returns a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array | Float32Array} representing the transform.
   *
   * @param relativeTo See {@link toMatrix}
   */
  readonly toFloat32Array: (
    relativeTo?: Transform | DOMMatrix | Float32Array,
  ) => Float32Array;

  /**
   * Returns a `perspective(...) matrix3d(...)` string for use as a CSS property.
   *
   * If no perspective has been set, it's omitted from the string.
   *
   * @param relativeTo See {@link toMatrix}
   */
  readonly toString: (
    relativeTo?: Transform | DOMMatrix | Float32Array,
  ) => string;

  /**
   * Resets the transformation back to the default (identity) one.
   */
  readonly reset: () => Transform;

  /**
   * Sets the transform's perspective. Perspective applies at the start of
   * transforms and subsequent calls to this method always override previous
   * ones.
   *
   * @param callback The callback that returns the perspective as a number (in
   *                 pixels) or CSS perspective string
   *
   * @returns The same {@link Transform} instance.
   */
  readonly perspective: (
    callback: EffectCallback<number | string>,
  ) => Transform;

  /**
   * Translates the transform.
   *
   * @param callback The callback that returns one or more of:
   *                 - x The translation distance in pixels along the X-axis.
   *                 - y The translation distance in pixels along the Y-axis.
   *                 - z The translation distance in pixels along the Z-axis.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly translate: (
    callback: EffectCallback<AtLeastOne<{ x: number; y: number; z: number }>>,
  ) => Transform;

  /**
   * Scales the transform.
   *
   * @param callback The callback that returns one or more of:
   *                 - s      The default scaling factor for any axis if not
   *                          overridden by sx, sy or sz.
   *                 - sx     The translation distance in pixels along the X-axis.
   *                 - sy     The translation distance in pixels along the Y-axis.
   *                 - sz     The translation distance in pixels along the Z-axis.
   *                 - origin The transform origin
   *
   * @returns The same {@link Transform} instance.
   */
  readonly scale: (
    callback: EffectCallback<
      AtLeastOne<{ s: number; sx: number; sy: number; sz: number }> & {
        origin?: Origin;
      }
    >,
  ) => Transform;

  /**
   * Skews the transform. If skewing along both axis (i.e. both `degX` and
   * `degY` given, or `deg` is given), then skewing is done first along X, then
   * along Y.
   *
   * @param callback The callback that returns one or more of:
   *                 - deg  The skewing angle in degrees for either axis if not
   *                        overridden by degX or degY.
   *                 - degX The skewing angle in degrees along the X-axis.
   *                 - degY The skewing angle in degrees along the Y-axis.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly skew: (
    callback: EffectCallback<
      AtLeastOne<{ deg: number; degX: number; degY: number }>
    >,
  ) => Transform;

  /**
   * Rotates the transform around the given axis.
   *
   * @param callback The callback that returns one or more of:
   *                 - deg  The angle in degrees to rotate.
   *                 - axis The axis of rotation. Default is Z-axis.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly rotate: (
    callback: EffectCallback<{ deg: number; axis?: Axis }>,
  ) => Transform;

  /**
   * Applies all transforms for the given scroll offsets.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If any of the values returned by the {@link EffectCallback}
   *                s is invalid.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly apply: (element: Element, offsets: ScrollOffsets) => Transform;

  constructor(init?: Transform | DOMMatrix | Float32Array) {
    const selfM = newMatrix(false, init);
    const callbacks: EffectCallback<void>[] = [];
    let perspective = "";

    const addCallback = (callback: EffectCallback<void>) =>
      callbacks.push(callback);

    const toMatrix = (relativeTo?: Transform | DOMMatrix | Float32Array) => {
      const m = newMatrix(true, selfM);
      const relM = relativeTo ? newMatrix(true, relativeTo) : null;
      return relM ? relM.inverse().multiply(m) : m;
    };

    this.toMatrix = toMatrix;
    this.toFloat32Array = (relativeTo) => toMatrix(relativeTo).toFloat32Array();
    this.toString = (relativeTo) =>
      (perspective ? `perspective(${perspective}) ` : "") +
      toMatrix(relativeTo).toString();

    this.reset = () => {
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

    this.perspective = (callback) => {
      addCallback((offsets) => {
        const res = callback(offsets);
        perspective = res ? (MH.isString(res) ? res : `${res}px`) : "";
      });
      return this;
    };

    this.translate = (callback) => {
      addCallback((offsets) => {
        const { x = 0, y = 0, z = 0 } = callback(offsets) ?? {};
        validateInputs("Translate distance", [x, y, z]);
        selfM.translateSelf(x, y, z);
      });
      return this;
    };

    this.scale = (callback) => {
      addCallback((offsets) => {
        const {
          s = 1,
          sx = s,
          sy = s,
          sz = s,
          origin = [0, 0, 0],
        } = callback(offsets) ?? {};
        validateInputs("Scale factor", [sx, sy, sz], true);
        validateInputs("Origin", origin);
        selfM.scaleSelf(sx, sy, sz, ...origin);
      });
      return this;
    };

    this.skew = (callback) => {
      addCallback((offsets) => {
        const { deg = 0, degX = deg, degY = deg } = callback(offsets) ?? {};
        validateInputs("Skew angle", [degX, degY]);
        selfM.skewXSelf(degX).skewYSelf(degY);
      });
      return this;
    };

    this.rotate = (callback) => {
      addCallback((offsets) => {
        const { deg = 0, axis = [0, 0, 1] } = callback(offsets) ?? {};
        validateInputs("Rotation angle", [deg]);
        validateInputs("Rotation axis", [sum(...axis)], true);
        selfM.rotateAxisAngleSelf(axis[0], axis[1] ?? 0, axis[2] ?? 0, deg);
      });
      return this;
    };

    this.apply = (element, offsets) => {
      for (const callback of callbacks) {
        callback(offsets);
      }

      setStyleProp(element, "transform", this.toString());
      return this;
    };
  }
}

// ----------------------------------------

const newMatrix = <B extends boolean>(
  readonly: B,
  init?: Transform | DOMMatrix | Float32Array,
) => {
  const initM = MH.isInstanceOf(init, Transform) ? init.toMatrix() : init;
  return new (readonly ? DOMMatrixReadOnly : DOMMatrix)(
    MH.isNullish(initM)
      ? initM
      : MH.arrayFrom(
          MH.isInstanceOf(initM, DOMMatrixReadOnly)
            ? initM.toFloat32Array()
            : initM,
        ),
  ) as typeof readonly extends true ? DOMMatrixReadOnly : DOMMatrix;
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
