/**
 * @module Effects
 *
 * @since v1.3.0
 */

// XXX should we set this:
// will-change: transform;
// transition: transform 0.05s linear;

import * as _ from "@lisn/_internal";

import { bugError } from "@lisn/globals/errors";

import { AtLeastOne, Axis, Origin } from "@lisn/globals/types";

import { sum } from "@lisn/utils/math";

import { createXWeakMap } from "@lisn/modules/x-map";

import {
  EffectInterface,
  FXHandler,
  FXState,
  toParameters,
  scaleParameters,
  validateOutputParameters,
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
 * {@link Transform} supports parallax depth as follows:
 * - {@link translate} will divide the parameters by the depth before passing
 *   them to the handlers.
 * - {@link rotate} will multiply the parameters by the depth before passing
 *   them to the handlers.
 * - {@link scale} and {@link skew} do not alter the parameters, ignoring depth.
 */
export class Transform implements EffectInterface<"transform"> {
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
   *                If any of the values returned by the {@link FXHandler}
   *                s is invalid.
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
   * essentially discarded and the resulting transform becomes absolute.
   *
   * @returns **A new** {@link Transform} instance with all the same handlers as
   * this one.
   */
  readonly toComposition: (...others: Transform[]) => Transform;

  /**
   * Returns an object with the `transform` property and value equal to
   * {@link toString | the transform's state as a CSS string}.
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
    const stateMatrix = createMatrix(false, init);

    // ----------

    const addOwnHandler = <T extends HandlerTuple>(
      original: T,
      fn: FXHandler<void>,
    ) => {
      if (original[0] === PERSPECTIVE) {
        perspectiveFn = fn;
      } else {
        transformers.push(fn);
      }
      saveHandlerFor(this, original);
    };

    // ----------

    const toMatrix = (negate?: TransformLike) => {
      const m = createMatrix(true, stateMatrix);
      const relM = negate ? createMatrix(true, negate) : null;
      return relM ? relM.inverse().multiply(m) : m;
    };

    // ----------

    const reset = () => {
      currentPerspective = void 0;

      stateMatrix.m12 =
        stateMatrix.m13 =
        stateMatrix.m14 =
        stateMatrix.m21 =
        stateMatrix.m23 =
        stateMatrix.m24 =
        stateMatrix.m31 =
        stateMatrix.m32 =
        stateMatrix.m34 =
        stateMatrix.m41 =
        stateMatrix.m42 =
        stateMatrix.m43 =
          0;
      stateMatrix.m11 = stateMatrix.m22 = stateMatrix.m33 = stateMatrix.m44 = 1;

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
      const resultHandlers: HandlerTuple[] = [];
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
        addAndSaveHandlerFor(composed, h);
      }

      return composed;
    };

    this.toCss = (negate) => ({ transform: this.toString(negate) });

    this.toString = (negate) =>
      (_.isNullish(currentPerspective)
        ? ""
        : `perspective(${currentPerspective}px) `) +
      toMatrix(negate).toString();

    this.toPerspective = () => currentPerspective;

    this.toMatrix = toMatrix;
    this.toFloat32Array = (negate) => toMatrix(negate).toFloat32Array();

    this.perspective = (handler) => {
      addOwnHandler([PERSPECTIVE, handler], (parameters, state, composer) => {
        const perspective = handler(parameters, state, composer);
        if (!_.isUndefined(perspective)) {
          validateOutputParameters("Perspective", [perspective ?? 0]);

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
      addOwnHandler([TRANSLATE, handler], (parameters, state, composer) => {
        parameters = scaleParameters(parameters, composer, (v, d) => v / d);
        const result: Partial<TranslateHandlerReturn> =
          handler(parameters, state, composer) ?? {};

        if (!_.isNullish(result)) {
          const { x = 0, y = 0, z = 0 } = result;

          validateOutputParameters("Translate distance", [x, y, z]);
          stateMatrix.translateSelf(x, y, z);
        }
      });

      return this;
    };

    this.scale = (handler) => {
      addOwnHandler([SCALE, handler], (parameters, state, composer) => {
        const result: Partial<ScaleHandlerReturn> =
          handler(parameters, state, composer) ?? {};

        if (!_.isNullish(result)) {
          const { s = 1, sx = s, sy = s, sz = s, origin = [0, 0, 0] } = result;

          validateOutputParameters("Scale factor", [sx, sy, sz], true);
          validateOutputParameters("Origin", origin);
          stateMatrix.scaleSelf(sx, sy, sz, ...origin);
        }
      });

      return this;
    };

    this.skew = (handler) => {
      addOwnHandler([SKEW, handler], (parameters, state, composer) => {
        const result: Partial<SkewHandlerReturn> =
          handler(parameters, state, composer) ?? {};

        if (!_.isNullish(result)) {
          const { deg = 0, degX = deg, degY = deg } = result;

          validateOutputParameters("Skew angle", [degX, degY]);
          stateMatrix.skewXSelf(degX).skewYSelf(degY);
        }
      });

      return this;
    };

    this.rotate = (handler) => {
      addOwnHandler([ROTATE, handler], (parameters, state, composer) => {
        parameters = scaleParameters(parameters, composer, (v, d) => v * d);
        const result: Partial<RotateHandlerReturn> =
          handler(parameters, state, composer) ?? {};

        if (!_.isNullish(result)) {
          const { deg = 0, axis = [0, 0, 1] } = result;

          validateOutputParameters("Rotation angle", [deg]);
          validateOutputParameters("Rotation axis", [sum(...axis)], true);
          stateMatrix.rotateAxisAngleSelf(
            axis[0],
            axis[1] ?? 0,
            axis[2] ?? 0,
            deg,
          );
        }
      });

      return this;
    };
  }
}

/**
 * Should return the perspective as a number in pixels.
 *
 * If {@link TransformConfig.isAbsolute} is `false` (default), the return value
 * is taken as a change in the current perspective. Otherwise the return value
 * overrides the perspective.
 *
 * Returning `null` clears the perspective completely even if the transform is
 * not absolute.
 *
 * Returning `undefined` does nothing (leaves the perspective unchanged).
 *
 * @defaultValue undefined
 */
export type PerspectiveHandlerReturn = number | null | undefined;

/**
 * Should return the translation distances along one or more axes.
 *
 * Returning `undefined` does nothing (leaves the transform unchanged).
 */
export type TranslateHandlerReturn =
  | AtLeastOne<{
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
    }>
  | undefined;

/**
 * Should return the scaling factor along one or more axes.
 *
 * Returning `undefined` does nothing (leaves the transform unchanged).
 */
export type ScaleHandlerReturn =
  | (AtLeastOne<{
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
    })
  | undefined;

/**
 * Should return the skewing angle along one or more axes.
 *
 * **NOTE:** If skewing along both axis (i.e. the handler returns both `degX`
 * and `degY`,* or `deg`), then skewing is done first along X, then along Y.
 *
 * Returning `undefined` does nothing (leaves the transform unchanged).
 */
export type SkewHandlerReturn =
  | AtLeastOne<{
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
    }>
  | undefined;

/**
 * Should return the rotation angle and axis of rotation.
 *
 * Returning `undefined` does nothing (leaves the transform unchanged).
 */
export type RotateHandlerReturn =
  | {
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
    }
  | undefined;

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

const PERSPECTIVE: unique symbol = _.SYMBOL() as typeof PERSPECTIVE;
const TRANSLATE: unique symbol = _.SYMBOL() as typeof TRANSLATE;
const SCALE: unique symbol = _.SYMBOL() as typeof SCALE;
const SKEW: unique symbol = _.SYMBOL() as typeof SKEW;
const ROTATE: unique symbol = _.SYMBOL() as typeof ROTATE;

type HandlersMap = {
  [PERSPECTIVE]: FXHandler<PerspectiveHandlerReturn>;
  [TRANSLATE]: FXHandler<TranslateHandlerReturn>;
  [SCALE]: FXHandler<ScaleHandlerReturn>;
  [SKEW]: FXHandler<SkewHandlerReturn>;
  [ROTATE]: FXHandler<RotateHandlerReturn>;
};

type HandlerTuple = {
  [K in keyof HandlersMap]: [K, HandlersMap[K]];
}[keyof HandlersMap];

const allUserHandlersMap = createXWeakMap<Transform, HandlerTuple[]>(() => []);

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
      throw bugError("Unhandled transform effect category");
  }
};

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
