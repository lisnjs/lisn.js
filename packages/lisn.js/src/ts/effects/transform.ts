/**
 * @module Effects
 *
 * @since v1.3.0
 */

import * as _ from "@lisn/_internal";

import { AtLeastOne, Axis, Origin } from "@lisn/globals/types";

import { sum } from "@lisn/utils/math";
import {
  validateNumber,
  validateNonNegNumber,
  validatePosNumber,
} from "@lisn/utils/validation";

import {
  EffectInterface,
  FXHandler,
  FXState,
  HandlerMethodName,
  HandlerMethodTuple,
  toParameters,
  scaleParameters,
  saveHandlerFor,
  addHandlerTo,
  getHandlersFor,
} from "@lisn/effects/effect";

import { FXComposer } from "@lisn/effects/fx-composer";

export type TransformLike = Transform | DOMMatrixReadOnly | Float32Array;

/**
 * {@link Transform} controls an element's transform as a 3D matrix.
 *
 * It supports translation, scaling, skewing and rotation as well as
 * setting a perspective.
 *
 * Except for perspective, you can add multiple handlers of each category and
 * they will all be applied (multiply the state matrix) in order. E.g. adding a
 * {@link translate}, then {@link rotate}, then another {@link translate}
 * handler results in a transform matrix that's the product of
 * `translate(...) * rotate(...) * translate(...)`.
 *
 * Perspective handlers apply at the start of all transforms and can be set only
 * once, i.e. subsequent calls to {@link perspective} always override previous
 * perspective handlers.
 *
 * {@link Transform} supports negation. It also supports parallax depth as follows:
 * - {@link translate} will divide the parameters by the depth before passing
 *   them to the handlers.
 * - {@link rotate} will multiply the parameters by the depth before passing
 *   them to the handlers.
 * - {@link scale} and {@link skew} do not alter the parameters, ignoring depth.
 */
export class Transform implements EffectInterface<"transform", Transform> {
  readonly type = "transform";

  /**
   * Returns true if the transform is absolute. If true, the
   * {@link FXHandler | handlers} receive absolute
   * {@link Effects.FXParams | parameters} and each call to {@link update} will
   * reset the transform back to the identity one.
   *
   * Otherwise, the handlers receive delta values reflecting the change in
   * parameters since the last animation frame and the transform's state is
   * preserved between calls to {@link update}.
   */
  readonly isAbsolute: () => boolean;

  /**
   * Updates the transform as per the given state.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If any of the values returned by the {@link FXHandler}s
   *                is invalid.
   */
  readonly update: (state: FXState, composer: FXComposer) => this;

  /**
   * Returns a **static copy** of the transform that has the current state/value
   * of this transform, but no handlers.
   *
   * @param negate If given, `negate` will be inverted and used as the
   *               pre-multiplication matrix for the current transform matrix.
   *               Useful if you want to apply the current transform to an
   *               element that's a descendant of another transformed element
   *               and you want to first "undo" the parent transform.
   *
   * @returns **A new** {@link Transform} instance with no handlers.
   */
  readonly export: (negate?: TransformLike) => Transform;

  /**
   * Returns a **new live** transform that has all the handlers from this one
   * and the given transforms, in order. The resulting state (matrix) is the
   * combined product of its current matrix and that of all the other given
   * ones.
   *
   * **NOTE:** If any of the given transforms is
   * {@link TransformConfig.isAbsolute | absolute}, all previous ones are
   * discarded and the resulting transform becomes absolute.
   *
   * @returns **A new** {@link Transform} instance with all the same handlers as
   * this one.
   */
  readonly toComposition: (...others: Transform[]) => Transform;

  /**
   * Returns an object with the following properties:
   * - `transform`: {@link toString | the transform's state as a CSS string}
   * - `transition`: transform 0.05s linear
   *
   * The `transition` property is needed to smooth out the animation. It does
   * not introduce lag.
   *
   * @param negate See {@link export}
   */
  readonly toCss: (negate?: TransformLike) => Record<string, string>;

  /**
   * Returns a `perspective(...) matrix3d(...)` string for use as a CSS property.
   *
   * If no perspective has been set or it's `null`, it's omitted from the string.
   *
   * @param negate See {@link export}
   */
  readonly toString: (negate?: TransformLike) => string;

  /**
   * Returns the current perspective (since the last call to {@link update}).
   *
   * @returns The last applied perspective, or `undefined` if no perspective has
   * been applied.
   */
  readonly toPerspective: () => number | null | undefined;

  /**
   * Returns a {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrixReadOnly | DOMMatrixReadOnly} representing the transform.
   *
   * @param negate See {@link export}
   */
  readonly toMatrix: (negate?: TransformLike) => DOMMatrixReadOnly;

  /**
   * Returns a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array | Float32Array} representing the transform.
   *
   * @param negate See {@link export}
   */
  readonly toFloat32Array: (negate?: TransformLike) => Float32Array;

  /**
   * Sets the transform's perspective handler.
   *
   * **NOTE:** Unlike other transformations, perspective applies at the start of
   * all transforms and can be set only once. Subsequent calls to this method
   * always override previous perspective handlers.
   *
   * The handler receives the unscaled original
   * {@link Effects.FXParams | parameters}, regardless of the
   * {@link Effects.FXComposer | composer}'s parallax depth.
   */
  readonly perspective: (handler: FXHandler<PerspectiveHandlerReturn>) => this;

  /**
   * Adds a translation handler.
   *
   * The handler receives scaled {@link Effects.FXParams | parameters}, divided
   * by the parallax depth along the respective axis.
   */
  readonly translate: (handler: FXHandler<TranslateHandlerReturn>) => this;

  /**
   * Adds a scaling handler.
   *
   * The handler receives the unscaled original
   * {@link Effects.FXParams | parameters}, regardless of the
   * {@link Effects.FXComposer | composer}'s parallax depth.
   */
  readonly scale: (handler: FXHandler<ScaleHandlerReturn>) => this;

  /**
   * Adds a skewing handler.
   *
   * The handler receives the unscaled original
   * {@link Effects.FXParams | parameters}, regardless of the
   * {@link Effects.FXComposer | composer}'s parallax depth.
   *
   * **NOTE:** If skewing along both axis (i.e. the handler returns both `degX`
   * and `degY`,* or `deg`), then skewing is done first along X, then along Y.
   */
  readonly skew: (handler: FXHandler<SkewHandlerReturn>) => this;

  /**
   * Adds a rotation handler.
   *
   * The handler receives scaled {@link Effects.FXParams | parameters},
   * multiplied by the parallax depth along the respective axis.
   */
  readonly rotate: (handler: FXHandler<RotateHandlerReturn>) => this;

  constructor(config?: TransformConfig) {
    const {
      isAbsolute = false,
      init,
      perspective: initPerspective,
    } = config ?? {};

    const transformers: FXHandler<void>[] = []; // not including perspective
    let perspectiveFn: FXHandler<void> | null = null;

    let currentPerspective: number | null | undefined = initPerspective;
    const matrix = createMatrix(false, init);

    // ----------

    const addOwnHandler = <M extends HandlerMethodName<"transform">>(
      tuple: HandlerMethodTuple<"transform", M>,
      fn: FXHandler<void>,
    ) => {
      if (tuple[0] === "perspective") {
        perspectiveFn = fn;
      } else {
        transformers.push(fn);
      }
      saveHandlerFor(this, tuple);
    };

    // ----------

    const toMatrix = (negate?: TransformLike) => {
      const m = createMatrix(true, matrix);
      const relM = negate ? createMatrix(true, negate) : null;
      return relM ? relM.inverse().multiply(m) : m;
    };

    // ----------

    const reset = () => {
      currentPerspective = void 0;

      matrix.m12 =
        matrix.m13 =
        matrix.m14 =
        matrix.m21 =
        matrix.m23 =
        matrix.m24 =
        matrix.m31 =
        matrix.m32 =
        matrix.m34 =
        matrix.m41 =
        matrix.m42 =
        matrix.m43 =
          0;
      matrix.m11 = matrix.m22 = matrix.m33 = matrix.m44 = 1;

      return this;
    };

    // --------------------

    this.isAbsolute = () => isAbsolute;

    this.update = (state, composer) => {
      if (isAbsolute) {
        reset();
      }

      const parameters = toParameters(state, composer, { isAbsolute });

      for (const fn of [
        ...(perspectiveFn ? [perspectiveFn] : []),
        ...transformers,
      ]) {
        fn(parameters, state, composer);
      }

      return this;
    };

    this.export = (negate) =>
      new Transform({
        isAbsolute: isAbsolute,
        init: toMatrix(negate),
        perspective: currentPerspective,
      });

    this.toComposition = (...others) => {
      let toCombine: Transform[] = [];
      let resultIsAbsolute = false;
      // Avoid computing products unnecessarily, so filter first.
      for (const t of [this, ...others]) {
        if (t.isAbsolute()) {
          resultIsAbsolute = true;
          toCombine = [];
        }

        toCombine.push(t);
      }

      const resultInit = new DOMMatrix();
      const resultHandlers: HandlerMethodTuple<"transform">[] = [];
      let resultPerspective: number | null | undefined = void 0;
      for (const t of toCombine) {
        const thisPerspective = t.toPerspective();
        if (!_.isUndefined(thisPerspective)) {
          resultPerspective = thisPerspective;
        }

        resultInit.multiplySelf(t.toMatrix());
        resultHandlers.push(...getHandlersFor(t));
      }

      const composed = new Transform({
        isAbsolute: resultIsAbsolute,
        init: resultInit,
        perspective: resultPerspective,
      });

      for (const h of resultHandlers) {
        addHandlerTo(composed, h);
      }

      return composed;
    };

    this.toCss = (negate) => ({
      transform: this.toString(negate),
      transition: "transform 0.05s linear",
    });

    this.toString = (negate) =>
      (_.isNullish(currentPerspective)
        ? ""
        : `perspective(${currentPerspective}px) `) +
      toMatrix(negate).toString();

    this.toPerspective = () => currentPerspective;

    this.toMatrix = toMatrix;
    this.toFloat32Array = (negate) => toMatrix(negate).toFloat32Array();

    this.perspective = (handler) => {
      addOwnHandler(["perspective", handler], (parameters, state, composer) => {
        const perspective = handler(parameters, state, composer);
        if (!_.isUndefined(perspective)) {
          validateNonNegNumber("Perspective", perspective ?? 0);

          if (_.isNullish(currentPerspective) || _.isNullish(perspective)) {
            currentPerspective = perspective;
          } else {
            // If transform is absolute, perspective would have been reset to null,
            // so this won't apply anyway.
            currentPerspective += perspective;
          }
        }
      });

      return this;
    };

    this.translate = (handler) => {
      addOwnHandler(["translate", handler], (parameters, state, composer) => {
        parameters = scaleParameters(parameters, composer, (v, d) => v / d);
        const result: Partial<TranslateHandlerReturn> =
          handler(parameters, state, composer) ?? {};

        if (!_.isNullish(result)) {
          const { x = 0, y = 0, z = 0 } = result;

          [x, y, z].map((v) => validateNumber("Translation distances", v));
          matrix.translateSelf(x, y, z);
        }
      });

      return this;
    };

    this.scale = (handler) => {
      addOwnHandler(["scale", handler], (parameters, state, composer) => {
        const result: Partial<ScaleHandlerReturn> =
          handler(parameters, state, composer) ?? {};

        if (!_.isNullish(result)) {
          const { s = 1, sx = s, sy = s, sz = s, origin = [0, 0, 0] } = result;

          [sx, sy, sz].map((v) =>
            validateNumber("Scale factors", v, { min: 0.0001 }),
          );
          origin.map((v) => validateNumber("Origin coordinates", v));
          matrix.scaleSelf(sx, sy, sz, ...origin);
        }
      });

      return this;
    };

    this.skew = (handler) => {
      addOwnHandler(["skew", handler], (parameters, state, composer) => {
        const result: Partial<SkewHandlerReturn> =
          handler(parameters, state, composer) ?? {};

        if (!_.isNullish(result)) {
          const { deg = 0, degX = deg, degY = deg } = result;

          [degX, degY].map((v) => validateNumber("Skew angles", v));
          matrix.skewXSelf(degX).skewYSelf(degY);
        }
      });

      return this;
    };

    this.rotate = (handler) => {
      addOwnHandler(["rotate", handler], (parameters, state, composer) => {
        parameters = scaleParameters(parameters, composer, (v, d) => v * d);
        const result: Partial<RotateHandlerReturn> =
          handler(parameters, state, composer) ?? {};

        if (!_.isNullish(result)) {
          const { deg = 0, axis = [0, 0, 1] } = result;

          validateNumber("Rotation angle", deg);
          axis.map((v) => validateNumber("Rotation axis coordinates", v));
          validatePosNumber("Rotation axis length", _.abs(sum(...axis)));
          matrix.rotateAxisAngleSelf(axis[0], axis[1] ?? 0, axis[2] ?? 0, deg);
        }
      });

      return this;
    };
  }
}

/**
 * Should return the perspective as a number in pixels.
 *
 * Returning `null` clears the perspective completely even if the transform is
 * not absolute.
 *
 * Returning `undefined` should leave the current value unchanged.
 */
export type PerspectiveHandlerReturn = number | null;

/**
 * Should return the translation distances along one or more axes.
 *
 * Returning `undefined` should leave the current value unchanged.
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
 *
 * Returning `undefined` should leave the current value unchanged.
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
 * **NOTE:** If skewing along both axis (i.e. the handler returns both `degX`
 * and `degY`,* or `deg`), then skewing is done first along X, then along Y.
 *
 * Returning `undefined` should leave the current value unchanged.
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
 *
 * Returning `undefined` should leave the current value unchanged.
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
   * If true, the {@link FXHandler | handlers} receive absolute
   * {@link Effects.FXParams | parameters} and each call to {@link update} will
   * reset the transform back to the identity one.
   *
   * Otherwise, the handlers receive delta values reflecting the change in
   * parameters since the last animation frame and the transform's state is
   * preserved between calls to {@link update}.
   *
   * @defaultValue false
   */
  isAbsolute?: boolean;

  /**
   * Initial transform to begin with. Note that if {@link isAbsolute} is `true`,
   * it will be discarded on {@link Transform.update | update}.
   *
   * @defaultValue undefined // identity matrix
   */
  init?: TransformLike;

  /**
   * Initial transform to begin with. Note that if {@link isAbsolute} is `true`,
   * it will be discarded on {@link Transform.update | update}.
   *
   * @defaultValue undefined
   */
  perspective?: number | null;
};

// ----------------------------------------

declare module "@lisn/effects/effect" {
  interface EffectRegistry {
    transform: Transform;
  }
}

// ----------------------------------------

function createMatrix(readonly: true, init?: TransformLike): DOMMatrixReadOnly;
function createMatrix(readonly: false, init?: TransformLike): DOMMatrix;
function createMatrix(readonly: boolean, init?: TransformLike) {
  const initM = _.isInstanceOf(init, Transform) ? init.toMatrix() : init;
  return new (readonly ? DOMMatrixReadOnly : DOMMatrix)(
    _.isNullish(initM)
      ? initM
      : _.arrayFrom(
          _.isOfType(initM, "DOMMatrixReadOnly")
            ? initM.toFloat32Array()
            : initM,
        ),
  );
}

_.brandClass(Transform, "Transform");
