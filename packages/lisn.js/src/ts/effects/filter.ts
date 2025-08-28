/**
 * @module Effects
 *
 * @since v1.3.0
 */

import * as _ from "@lisn/_internal";

import {
  EffectOf,
  FXHandler,
  FXState,
  HandlerMethodName,
  HandlerForMethod,
  HandlerMethodTuple,
  toParameters,
  validateOutputParameters,
  saveHandlerFor,
  addHandlerTo,
  getHandlersFor,
} from "@lisn/effects/effect";

import { FXComposer } from "@lisn/effects/fx-composer";

/**
 * {@link Filter} controls an element's
 * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/filter | filters}
 *
 * It supports:
 * - blur
 * - brightness
 * - contrast
 * - drop-shadow
 * - grayscale XXX TODO
 * - hue-rotate
 * - invert
 * - opacity
 * - saturate
 * - sepia
 *
 * {@link Filter} does not support negation and it does not support parallax
 * depth; it is ignored.
 */
export class Filter implements EffectOf<"filter"> {
  readonly type = "filter";

  /**
   * Returns true if the filter is absolute. If true, the
   * {@link FXHandler | handlers} receive absolute
   * {@link Effects.FXParams | parameters} and each call to {@link update} will
   * reset the filters back to "none".
   *
   * Otherwise, the handlers receive delta values reflecting the change in
   * parameters since the last animation frame and the filter's state is
   * preserved between calls to {@link update}.
   */
  readonly isAbsolute: () => boolean;

  /**
   * Updates the filter as per the given state.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If any of the values returned by the {@link FXHandler}s
   *                is invalid.
   */
  readonly update: (state: FXState, composer: FXComposer) => this;

  /**
   * Returns a **static copy** of the filter that has the current state/value
   * of this filter, but no handlers.
   *
   * @returns **A new** {@link Filter} instance with no handlers.
   */
  readonly export: () => Filter;

  /**
   * Returns a **new live** filter that has all the handlers from this one
   * and the given filters, in order. The resulting values are the combined (sum
   * or product, depending on the filter types) of its current state and that of
   * all the other given ones.
   *
   * **NOTE:** If any of the given filters is
   * {@link FilterConfig.isAbsolute | absolute}, all previous ones are discarded
   * and the resulting filter becomes absolute.
   *
   * @returns **A new** {@link Filter} instance with all the same handlers as
   * this one.
   */
  readonly toComposition: (...others: Filter[]) => Filter;

  /**
   * Returns an object with the following properties:
   * - `filter`: {@link toString | the filter's state as a CSS string}
   */
  readonly toCss: () => Record<string, string>;

  /**
   * Returns a space-separated string of filter functions and their values for
   * use as a CSS property.
   */
  readonly toString: () => string;

  /**
   * XXX TODO
   */
  readonly toXXX: () => FilterStateXXX;

  /**
   * Adds a blur handler.
   */
  readonly blur: (handler: FXHandler<BlurHandlerReturn>) => this;

  // XXX rest

  constructor(config?: FilterConfig) {
    const { isAbsolute = false, init } = config ?? {};
    const handlers: FXHandler<void>[] = [];

    let filters = _.deepCopy(init) ?? {};
    // XXX TODO

    // ----------

    const addOwnHandler = <M extends HandlerMethodName<"filter">>(
      methodName: M,
      handler: HandlerForMethod<"filter", M>,
      fn: FXHandler<void>,
    ) => {
      handlers.push(fn);
      saveHandlerFor(this, methodName, handler);
    };

    // --------------------

    this.isAbsolute = () => isAbsolute;

    this.update = (state, composer) => {
      if (isAbsolute) {
        filters = {};
      }

      const parameters = toParameters(state, composer, { isAbsolute });

      for (const fn of handlers) {
        fn(parameters, state, composer);
      }

      return this;
    };

    this.export = () =>
      new Filter({
        isAbsolute: isAbsolute,
        init: filters,
      });

    this.toComposition = (...others) => {
      let resultIsAbsolute = false;
      let resultInit: FilterStateXXX = {};
      let resultHandlers: HandlerMethodTuple<"filter">[] = [];
      for (const f of others) {
        if (f.isAbsolute()) {
          resultIsAbsolute = true;
          resultInit = {};
          resultHandlers = [];
        }

        const XXX = f.toXXX();
        let prop: keyof FilterStateXXX;
        for (prop in XXX) {
          resultInit[prop] = XXX[prop];
        }
        resultHandlers.push(...getHandlersFor(f));
      }

      const composed = new Filter({
        isAbsolute: resultIsAbsolute,
        init: resultInit,
      });

      for (const h of resultHandlers) {
        addHandlerTo(composed, ...h);
      }

      return composed;
    };

    this.toCss = () => ({
      filter: this.toString(),
    });

    this.toString = () => {
      let result = "";
      let p: keyof FilterStateXXX;
      for (p in filters) {
        const val = filters[p];
        if (!_.isNullish(val)) {
          result += (result ? " " : "") + VALUE_FORMATTERS[p](val);
        }
      }

      return result;
    };

    this.toXXX = () => _.deepCopy(filters);

    this.blur = (handler) => {
      addOwnHandler("blur", handler, (parameters, state, composer) => {
        const blur = handler(parameters, state, composer);
        if (_.isNull(blur)) {
          delete filters.blur;
        } else if (!_.isUndefined(blur)) {
          validateOutputParameters("Blur radius", [blur]);
          filters.blur = blur;
        }
      });

      return this;
    };
  }
}

/**
 * Should return the blur radius in pixels.
 *
 * Returning `null` resets the blur even if the filter is not absolute.
 */
export type BlurHandlerReturn = number | null;

export type FilterConfig = {
  /**
   * If true, the {@link FXHandler | handlers} receive absolute
   * {@link Effects.FXParams | parameters} and each call to {@link update} will
   * reset the filter back to "none".
   *
   * Otherwise, the handlers receive delta values reflecting the change in
   * parameters since the last animation frame and the filter's state is
   * preserved between calls to {@link update}.
   *
   * @defaultValue false
   */
  isAbsolute?: boolean;

  /**
   * Initial filters to begin with. Note that if {@link isAbsolute} is `true`,
   * it will be discarded on {@link Transform.update | update}.
   *
   * @defaultValue undefined
   */
  init?: FilterStateXXX;
};

export type FilterStateXXX = {
  blur?: number;
  brightness?: number;
  contrast?: number;
  // dropShadow?: XXX;
  grayscale?: number;
  hueRotate?: number;
  invert?: number;
  opacity?: number;
  saturate?: number;
  sepia?: number;
};

// ----------------------------------------

declare module "@lisn/effects/effect" {
  interface EffectRegistry {
    filter: Filter;
  }
}

// ----------------------------------------

const VALUE_FORMATTERS: {
  [K in keyof Required<FilterStateXXX>]: (value: number) => string;
} = {
  blur: (v) => `${v}px`,
  brightness: (v) => `${v}`,
  contrast: (v) => `${v}`,
  // dropShadow: (v) => ``, XXX
  grayscale: (v) => `${v}`,
  hueRotate: (v) => `${v}deg`,
  invert: (v) => `${v}`,
  opacity: (v) => `${v}`,
  saturate: (v) => `${v}`,
  sepia: (v) => `${v}`,
};

_.brandClass(Filter, "Filter");
