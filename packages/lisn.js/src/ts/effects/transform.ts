/**
 * @module Effects
 *
 * @since v1.3.0
 *
 * @categoryDescription Effects/Transform
 * {@link Transform} controls an element's transform as a 3D matrix.
 * It supports translation, scaling, skewing and rotation as well as
 * setting a perspective.
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
  EffectConfig,
  EffectUpdater,
  EffectUpdaterName,
  EffectUpdaterReturn,
  EffectUpdaterEntry,
  EffectBase,
  registerEffect,
} from "@lisn/effects/effect";

/**
 * {@link Transform} controls an element's transform as a 3D matrix.
 *
 * It supports translation, scaling, skewing and rotation as well as
 * setting a perspective.
 *
 * Except for perspective, you can add multiple updaters of each category and
 * they will all be applied (multiply the state matrix) in order. E.g. adding a
 * {@link translate}, then {@link rotate}, then another {@link translate}
 * updater results in a transform matrix that's the equivalent of of
 * `translate(...) rotate(...) translate(...)`.
 *
 * Perspective applies at the start of all transforms and can be set only once,
 * i.e. subsequent calls to {@link perspective} always override the previous
 * result.
 *
 * ## Setting updaters and initial state
 *
 * Each updater method (e.g. "perspective", "translate", "scale", etc) accepts
 * either a plain value or a function.
 *
 * If a value is given, it should be of the correct type for this transform type,
 * e.g. {@link TranslateReturn} for "translate", and so on. This value will
 * modify the initial state of the effect instance that's to be
 * created. It's like a one-time update at the time of creation.
 *
 * If a function is given, it will be called whenever the effect instance is
 * updated by the composer. It will receive the latest
 * {@link Effects.EffectParams | parameters} and
 * {@link Effects.FXState | composer state}. The updater function should return
 * the correct type of value.
 *
 * {@link translate} updater functions will receive the parameters scaled by the
 * parallax depth of the composer. Other updater methods receive unscaled
 * parameters since parallax depth does not apply there.
 *
 * **IMPORTANT:** For {@link EffectConfig.isAbsolute | absolute} transform
 * instances, the state is reset at each update and so initial values set are
 * always discarded at every update.
 *
 * ## Negation and parallax depth
 *
 * {@link Transform} supports negation. It also supports parallax depth but only
 * for {@link translate | translation}.
 *
 * @category Effects/Transform
 */
export class Transform extends EffectBase<"transform"> {
  readonly type = "transform";

  /**
   * Sets the perspective initially or during update.
   *
   * **NOTE:** Unlike other transformations, perspective applies at the start of
   * all transforms and can be set only once. Subsequent calls to this method
   * always override the previous perspective.
   */
  readonly perspective: (
    updater: EffectUpdater<PerspectiveReturn> | PerspectiveReturn,
  ) => this;

  /**
   * Adds translation initially or during update.
   */
  readonly translate: (
    updater: EffectUpdater<TranslateReturn> | TranslateReturn,
  ) => this;

  /**
   * Adds scaling initially or during update.
   */
  readonly scale: (updater: EffectUpdater<ScaleReturn> | ScaleReturn) => this;

  /**
   * Adds skewing initially or during update.
   *
   * **NOTE:** If skewing along both axis (i.e. the updater returns both `degX`
   * and `degY`,* or `deg`), then skewing is done first along X, then along Y.
   */
  readonly skew: (updater: EffectUpdater<SkewReturn> | SkewReturn) => this;

  /**
   * Adds rotation initially or during update.
   */
  readonly rotate: (
    updater: EffectUpdater<RotateReturn> | RotateReturn,
  ) => this;

  constructor(config?: EffectConfig) {
    super();
    const { addUpdater: _addUpdater } = init(this, config);

    const addUpdater = (updaterEntry: EffectUpdaterEntry<"transform">) => {
      _addUpdater(updaterEntry);
      return this;
    };

    this.perspective = (updater) =>
      addUpdater({ name: "perspective", updater });
    this.translate = (updater) =>
      addUpdater({ name: "translate", updater, scaler: (v, d) => v / d });
    this.scale = (updater) => addUpdater({ name: "scale", updater });
    this.skew = (updater) => addUpdater({ name: "skew", updater });
    this.rotate = (updater) => addUpdater({ name: "rotate", updater });
  }
}

/**
 * Should return the perspective as a number in pixels.
 *
 * Returning `null` clears the perspective completely even if the transform is
 * not absolute.
 *
 * Returning `undefined` leaves the current value unchanged.
 *
 * @category Effects/Transform
 */
export type PerspectiveReturn = number | null;

/**
 * Should return the translation distances along one or more axes.
 *
 * Returning `undefined` leaves the current value unchanged.
 *
 * @category Effects/Transform
 */
export type TranslateReturn = AtLeastOne<{
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
 * Returning `undefined` leaves the current value unchanged.
 *
 * @category Effects/Transform
 */
export type ScaleReturn = AtLeastOne<{
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
 * **NOTE:** If skewing along both axis (i.e. the updater returns both `degX`
 * and `degY`,* or `deg`), then skewing is done first along X, then along Y.
 *
 * Returning `undefined` leaves the current value unchanged.
 *
 * @category Effects/Transform
 */
export type SkewReturn = AtLeastOne<{
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
 * Returning `undefined` leaves the current value unchanged.
 *
 * @category Effects/Transform
 */
export type RotateReturn = {
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

// --------------------

type TransformState = {
  _perspective: number | null | undefined;
  _matrix: DOMMatrix;
};

const createMatrix = (init?: DOMMatrix) => {
  return new DOMMatrix(
    _.isNullish(init) ? init : _.arrayFrom(init.toFloat32Array()),
  );
};

const { init } = registerEffect<"transform", TransformState>({
  type: "transform",
  logic: {
    processUpdate: (state, name, result) => {
      if (!_.isNull(result) || name === "perspective") {
        UPDATE_PROCESSORS[name](state, result);
      }
      return state;
    },
    clone: (state) => {
      return {
        _perspective: state._perspective,
        _matrix: createMatrix(state._matrix),
      };
    },
    composeWith: (state, other) => {
      const otherPerspective = other._perspective;
      return {
        _perspective: _.isUndefined(otherPerspective)
          ? state._perspective
          : otherPerspective,
        _matrix: state._matrix.multiply(other._matrix),
      };
    },
    toCss: (state, negate) => {
      const matrix = negate
        ? negate._matrix.inverse().multiply(state._matrix)
        : state._matrix;

      const perspectiveString = _.isNullish(state._perspective)
        ? ""
        : `perspective(${state._perspective}px) `;

      return {
        transform: perspectiveString + matrix.toString(),
        transition: "transform 0.05s linear",
      };
    },
  },
  nullState: {
    _perspective: void 0,
    _matrix: createMatrix(),
  },
});

const UPDATE_PROCESSORS: {
  [M in EffectUpdaterName<"transform">]: (
    state: TransformState,
    result: EffectUpdaterReturn<"transform", M>,
  ) => void;
} = {
  perspective: (state, result) => {
    validateNonNegNumber("Perspective", result ?? 0);
    if (_.isNullish(state._perspective) || _.isNull(result)) {
      state._perspective = result;
    } else {
      // If transform is absolute, perspective would have been reset to
      // undefined, so this won't apply anyway.
      state._perspective += result;
    }
  },

  translate: (state, result) => {
    const { x = 0, y = 0, z = 0 } = result;

    [x, y, z].map((v) => validateNumber("Translation distances", v));
    state._matrix.translateSelf(x, y, z);
  },

  scale: (state, result) => {
    const { s = 1, sx = s, sy = s, sz = s, origin = [0, 0, 0] } = result;

    [sx, sy, sz].map((v) =>
      validateNumber("Scale factors", v, { min: 0.0001 }),
    );
    origin.map((v) => validateNumber("Origin coordinates", v));
    state._matrix.scaleSelf(sx, sy, sz, ...origin);
  },

  skew: (state, result) => {
    const { deg = 0, degX = deg, degY = deg } = result;

    [degX, degY].map((v) => validateNumber("Skew angles", v));
    state._matrix.skewXSelf(degX).skewYSelf(degY);
  },

  rotate: (state, result) => {
    const { deg = 0, axis = [0, 0, 1] } = result;

    validateNumber("Rotation angle", deg);
    axis.map((v) => validateNumber("Rotation axis coordinates", v));
    validatePosNumber("Rotation axis length", _.abs(sum(...axis)));
    state._matrix.rotateAxisAngleSelf(axis[0], axis[1] ?? 0, axis[2] ?? 0, deg);
  },
};

// ----------------------------------------

declare module "@lisn/effects/effect" {
  interface EffectRegistry {
    transform: Transform;
  }
}

_.brandClass(Transform, "Transform");
