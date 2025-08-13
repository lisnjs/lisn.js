/**
 * @module Effects/Transform
 *
 * @since v1.3.0
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { AtLeastOne, Axis, Origin } from "@lisn/globals/types";

import { isValidNum, sum } from "@lisn/utils/math";

import { newXWeakMap } from "@lisn/modules/x-map";

import {
  EffectInterface,
  EffectHandler,
  ScrollOffsets,
} from "@lisn/effects/effect";

export type TransformLike = Transform | DOMMatrix | Float32Array;

/**
 * {@link Transform} controls an element's transform as a 3D matrix.
 */
export class Transform implements EffectInterface<"transform"> {
  readonly type = "transform";

  /**
   * Returns true if the transform is absolute. If true, its handlers receive
   * absolute offsets instead of delta values and applying the transform
   * discards all previous ones, including their {@link perspective}.
   */
  readonly isAbsolute: () => boolean;

  /**
   * Applies all transforms for the given scroll offsets.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If any of the values returned by the {@link EffectHandler}
   *                s is invalid.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly apply: (offsets: ScrollOffsets) => Transform;

  /**
   * Returns a **new** live transform that has all the handlers from this one
   * and the given transforms, in order. The resulting effective state (matrix)
   * is the combined product of its current matrix and that of all the other
   * given ones.
   *
   * **NOTE:** If any of the given transforms is
   * {@link TransformConfig.isAbsolute | absolute}, all previous ones are
   * essentially discarded and the resulting transform becomes absolute.
   *
   * @returns **A new** {@link Transform} instance.
   */
  readonly toComposition: (...others: Transform[]) => Transform;

  /**
   * Returns an object with the `transform` property and value equal to what's
   * returned by {@link toString}.
   *
   * @param relativeTo See {@link toMatrix}
   */
  readonly toCss: (relativeTo?: TransformLike) => Record<string, string>;

  /**
   * Returns a `perspective(...) matrix3d(...)` string for use as a CSS property.
   *
   * If no perspective has been set, it's omitted from the string.
   *
   * @param relativeTo See {@link toMatrix}
   */
  readonly toString: (relativeTo?: TransformLike) => string;

  /**
   * Returns the current effective perspective (since the last call to
   * {@link apply} set on the transform. If a number was passed, it is converted
   * to a CSS length string in pixels.
   *
   * @returns A non-empty CSS string for perspective or `undefined`
   */
  readonly toPerspective: () => string | undefined;

  /**
   * Returns a {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrixReadOnly | DOMMatrixReadOnly} representing the transform.
   *
   * @param relativeTo If given, then this matrix is first inverted and used as
   *                   a pre-multiplication
   */
  readonly toMatrix: (relativeTo?: TransformLike) => DOMMatrixReadOnly;

  /**
   * Returns a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array | Float32Array} representing the transform.
   *
   * @param relativeTo See {@link toMatrix}
   */
  readonly toFloat32Array: (relativeTo?: TransformLike) => Float32Array;

  /**
   * Sets the transform's perspective. Perspective applies at the start of
   * transforms and subsequent calls to this method always override previous
   * ones, i.e. it is not additive.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly perspective: (
    handler: EffectHandler<PerspectiveHandlerReturn>,
  ) => Transform;

  /**
   * Translates the transform.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly translate: (
    handler: EffectHandler<TranslateHandlerReturn>,
  ) => Transform;

  /**
   * Scales the transform.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly scale: (handler: EffectHandler<ScaleHandlerReturn>) => Transform;

  /**
   * Skews the transform.
   *
   * **NOTE:** If skewing along both axis (i.e. both `degX` and `degY` given,
   * or `deg` is given), then skewing is done first along X, then along Y.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly skew: (handler: EffectHandler<SkewHandlerReturn>) => Transform;

  /**
   * Rotates the transform around the given axis.
   *
   * @returns The same {@link Transform} instance.
   */
  readonly rotate: (handler: EffectHandler<RotateHandlerReturn>) => Transform;

  constructor(config?: TransformConfig) {
    const { isAbsolute = false, init } = config ?? {};
    const selfM = newMatrix(false, init);
    const processedHandlers: EffectHandler<void>[] = [];
    let perspective: string | undefined = undefined;

    const addOwnHandler = <T extends HandlerTuple>(
      original: T,
      processed: EffectHandler<void>,
    ) => {
      processedHandlers.push(processed);
      saveHandlerFor(this, original);
    };

    const toMatrix = (relativeTo?: TransformLike) => {
      const m = newMatrix(true, selfM);
      const relM = relativeTo ? newMatrix(true, relativeTo) : null;
      return relM ? relM.inverse().multiply(m) : m;
    };

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

    // ----------

    this.isAbsolute = () => isAbsolute;

    this.apply = (offsets) => {
      if (isAbsolute) {
        reset();
      }

      for (const handler of processedHandlers) {
        handler(offsets);
      }

      return this;
    };

    this.toComposition = (...others) => {
      let toCombine: Transform[] = [];
      let resIsAbsolute = false;
      // Avoid computing products unnecessarily, so filter first.
      for (const t of [this, ...others]) {
        if (t.isAbsolute()) {
          resIsAbsolute = true;
          toCombine = [];
        }

        toCombine.push(t);
      }

      const resultInit = new DOMMatrix();
      const resultHandlers: HandlerTuple[] = [];
      for (const t of toCombine) {
        resultInit.multiplySelf(t.toMatrix());
        resultHandlers.push(...getHandlersFor(t));
      }

      const result = new Transform({
        isAbsolute: resIsAbsolute,
        init: resultInit,
      });

      for (const h of resultHandlers) {
        addAndSaveHandlerFor(result, h);
      }

      return result;
    };

    this.toCss = (relativeTo) => ({ transform: this.toString(relativeTo) });
    this.toString = (relativeTo) =>
      (perspective ? `perspective(${perspective}) ` : "") +
      toMatrix(relativeTo).toString();
    this.toPerspective = () => perspective;

    this.toMatrix = toMatrix;
    this.toFloat32Array = (relativeTo) => toMatrix(relativeTo).toFloat32Array();

    this.perspective = (handler) => {
      addOwnHandler([PERSPECTIVE, handler], (offsets) => {
        const res = handler(offsets);
        perspective = MH.isEmpty(res)
          ? undefined
          : MH.isString(res)
            ? res
            : `${res}px`;
      });
      return this;
    };

    this.translate = (handler) => {
      addOwnHandler([TRANSLATE, handler], (offsets) => {
        const { x = 0, y = 0, z = 0 } = handler(offsets) ?? {};
        validateInputs("Translate distance", [x, y, z]);
        selfM.translateSelf(x, y, z);
      });
      return this;
    };

    this.scale = (handler) => {
      addOwnHandler([SCALE, handler], (offsets) => {
        const {
          s = 1,
          sx = s,
          sy = s,
          sz = s,
          origin = [0, 0, 0],
        } = handler(offsets) ?? {};
        validateInputs("Scale factor", [sx, sy, sz], true);
        validateInputs("Origin", origin);
        selfM.scaleSelf(sx, sy, sz, ...origin);
      });
      return this;
    };

    this.skew = (handler) => {
      addOwnHandler([SKEW, handler], (offsets) => {
        const { deg = 0, degX = deg, degY = deg } = handler(offsets) ?? {};
        validateInputs("Skew angle", [degX, degY]);
        selfM.skewXSelf(degX).skewYSelf(degY);
      });
      return this;
    };

    this.rotate = (handler) => {
      addOwnHandler([ROTATE, handler], (offsets) => {
        const { deg = 0, axis = [0, 0, 1] } = handler(offsets) ?? {};
        validateInputs("Rotation angle", [deg]);
        validateInputs("Rotation axis", [sum(...axis)], true);
        selfM.rotateAxisAngleSelf(axis[0], axis[1] ?? 0, axis[2] ?? 0, deg);
      });
      return this;
    };
  }
}

/**
 * Should return the perspective as a number (if in pixels) or as a CSS
 * perspective string.
 *
 * Returning an empty string results in clearing the perspective completely.
 *
 * @defaultValue undefined
 */
export type PerspectiveHandlerReturn = number | string;

/**
 * Should return the translation distances along one or more axes.
 */
export type TranslateHandlerReturn = AtLeastOne<{
  /**
   * The translation distance in pixels along the X-axis.
   *
   * @defaultValue 0
   */
  x: number;

  /**
   * The translation distance in pixels along the Y-axis.
   *
   * @defaultValue 0
   */
  y: number;

  /**
   * The translation distance in pixels along the Z-axis.
   *
   * @defaultValue 0
   */
  z: number;
}>;

/**
 * Should return the scaling factor along one or more axes.
 */
export type ScaleHandlerReturn = AtLeastOne<{
  /**
   * The default scaling factor for any axis if not overridden by {@link sx},
   * {@link sy} or {@link sz}. This would result in all three axes being
   * scaled.
   *
   * @defaultValue 1
   */
  s: number;

  /**
   * The translation distance in pixels along the X-axis.
   *
   * @defaultValue {@link s}
   */
  sx: number;

  /**
   * The translation distance in pixels along the Y-axis.
   *
   * @defaultValue {@link s}
   */
  sy: number;

  /**
   * The translation distance in pixels along the Z-axis.
   *
   * @defaultValue {@link s}
   */
  sz: number;
}> & {
  /**
   * The transform origin.
   *
   * @defaultValue [0,0,0]
   */
  origin?: Origin;
};

/**
 * Should return the skewing angle along one or more axes.
 *
 * **NOTE:** If skewing along both axis (i.e. both `degX` and `degY` given, or
 * `deg` is given), then skewing is done first along X, then along Y.
 */
export type SkewHandlerReturn = AtLeastOne<{
  /**
   * The skewing angle in degrees for either axis if not overridden by
   * {@link degX} or {@link degY}. This would result in both axes being skewed.
   *
   * @defaultValue 0
   */
  deg: number;

  /**
   * The skewing angle in degrees along the X-axis.
   *
   * @defaultValue {@link deg}
   */
  degX: number;

  /**
   * The skewing angle in degrees along the Y-axis.
   *
   * @defaultValue {@link deg}
   */
  degY: number;
}>;

/**
 * Should return the rotation angle and axis of rotation.
 */
export type RotateHandlerReturn = {
  /**
   * The angle in degrees to rotate.
   */
  deg: number;

  /**
   * The axis of rotation.
   *
   * @defaultValue [0,0,1] // The Z-axis
   */
  axis?: Axis;
};

export type TransformConfig = {
  /**
   * If this is true, the {@link EffectHandler}s will receive absolute scroll
   * offsets in {@link ScrollOffsets} and the current matrix will be reset back
   * to the identity at each invocation to {@link Transform.apply | apply}.
   *
   * Otherwise, the {@link EffectHandler}s will receive delta values for the
   * scroll offsets and the current matrix will be multiplied by the new
   * transforms returned by the handlers.
   *
   * @defaultValue false
   */
  isAbsolute?: boolean;

  /**
   * Initial transform to begin with. Only useful if {@link isAbsolute} is
   * `true`, otherwise it will be discarded on {@link Transform.apply | apply}.
   *
   * @defaultValue undefined // identity matrix
   */
  init?: TransformLike;
};

// ----------------------------------------

const PERSPECTIVE: unique symbol = MC.SYMBOL() as typeof PERSPECTIVE;
const TRANSLATE: unique symbol = MC.SYMBOL() as typeof TRANSLATE;
const SCALE: unique symbol = MC.SYMBOL() as typeof SCALE;
const SKEW: unique symbol = MC.SYMBOL() as typeof SKEW;
const ROTATE: unique symbol = MC.SYMBOL() as typeof ROTATE;

type HandlersMap = {
  [PERSPECTIVE]: EffectHandler<PerspectiveHandlerReturn>;
  [TRANSLATE]: EffectHandler<TranslateHandlerReturn>;
  [SCALE]: EffectHandler<ScaleHandlerReturn>;
  [SKEW]: EffectHandler<SkewHandlerReturn>;
  [ROTATE]: EffectHandler<RotateHandlerReturn>;
};

type HandlerTuple = {
  [K in keyof HandlersMap]: [K, HandlersMap[K]];
}[keyof HandlersMap];

const allUserHandlersMap = newXWeakMap<Transform, HandlerTuple[]>(() => []);

const getHandlersFor = (t: Transform) => allUserHandlersMap.sGet(t);

const saveHandlerFor = <T extends HandlerTuple>(
  transform: Transform,
  tuple: T,
) => {
  const handlers = getHandlersFor(transform);
  handlers.push(tuple);
};

const addAndSaveHandlerFor = <T extends HandlerTuple>(
  transform: Transform,
  tuple: T,
) => {
  saveHandlerFor(transform, tuple);
  const [type, handler] = tuple;
  switch (type) {
    case PERSPECTIVE:
      transform.perspective(handler);
      break;
    case TRANSLATE:
      transform.translate(handler);
      break;
    case SCALE:
      transform.scale(handler);
      break;
    case SKEW:
      transform.skew(handler);
      break;
    case ROTATE:
      transform.rotate(handler);
      break;
    default:
      throw MH.bugError("Unhandled transform effect category");
  }
};

const newMatrix = <B extends boolean>(readonly: B, init?: TransformLike) => {
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

declare module "@lisn/effects/effect" {
  interface EffectRegistry {
    transform: Transform;
  }
}
