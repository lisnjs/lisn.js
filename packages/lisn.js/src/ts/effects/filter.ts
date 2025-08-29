/**
 * @module Effects
 *
 * @since v1.3.0
 */

import * as _ from "@lisn/_internal";

import { ColorComponentsWithAlpha } from "@lisn/globals/types";

import { addColor, toColorComponents, toColor } from "@lisn/utils/colors";
import { normalizeAngleDeg } from "@lisn/utils/math";
import { validateNumber } from "@lisn/utils/validation";

import {
  EffectInterface,
  FXHandler,
  FXState,
  HandlerMethodName,
  HandlerMethodTuple,
  toParameters,
  saveHandlerFor,
  addHandlerTo,
  getHandlersFor,
} from "@lisn/effects/effect";

import { FXComposer } from "@lisn/effects/fx-composer";
import { usageError } from "@lisn/globals";

/**
 * {@link Filter} controls an element's
 * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/filter | filters}
 *
 * It supports:
 * - blur
 * - brightness
 * - contrast
 * - drop-shadow
 * - grayscale
 * - hue-rotate
 * - invert
 * - opacity
 * - saturate
 * - sepia
 *
 * {@link Filter} does not support negation and it does not support parallax
 * depth; it is ignored.
 */
export class Filter implements EffectInterface<"filter", Filter> {
  readonly type = "filter";

  /**
   * Returns true if the filter is absolute. If true, the
   * {@link FXHandler | handlers} receive absolute
   * {@link Effects.FXParams | parameters} and each call to {@link update} will
   * reset the filters back to "none".
   *
   * Otherwise, the handlers receive delta values reflecting the change in
   * parameters since the last animation frame and the filter's state is
   * preserved between calls to {@link update}. Each filter entry's value will
   * be added to with the new value returned by the corresponding handler.
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
   * Returns the current filters as an array of `[name, value]` tuples, e.g.:
   *
   * ```javascript
   * [
   *   ["blur", 2],
   *   ["brightness", 2],
   *   ["contrast", 0.8],
   *   ["brightness", 2],
   *   ...
   * ]
   * ```
   */
  readonly toEntries: () => FilterEntryResolved[];

  /**
   * Adds a blur handler.
   */
  readonly blur: (handler: FXHandler<FilterHandlerReturn<"blur">>) => this;

  /**
   * Adds a brightness handler.
   */
  readonly brightness: (
    handler: FXHandler<FilterHandlerReturn<"brightness">>,
  ) => this;

  /**
   * Adds a contrast handler.
   */
  readonly contrast: (
    handler: FXHandler<FilterHandlerReturn<"contrast">>,
  ) => this;

  /**
   * Adds a drop-shadow handler.
   */
  readonly dropShadow: (
    handler: FXHandler<FilterHandlerReturn<"dropShadow">>,
  ) => this;

  /**
   * Adds a grayscale handler.
   */
  readonly grayscale: (
    handler: FXHandler<FilterHandlerReturn<"grayscale">>,
  ) => this;

  /**
   * Adds a hue-rotate handler.
   */
  readonly hueRotate: (
    handler: FXHandler<FilterHandlerReturn<"hueRotate">>,
  ) => this;

  /**
   * Adds a invert handler.
   */
  readonly invert: (handler: FXHandler<FilterHandlerReturn<"invert">>) => this;

  /**
   * Adds a opacity handler.
   */
  readonly opacity: (
    handler: FXHandler<FilterHandlerReturn<"opacity">>,
  ) => this;

  /**
   * Adds a saturate handler.
   */
  readonly saturate: (
    handler: FXHandler<FilterHandlerReturn<"saturate">>,
  ) => this;

  /**
   * Adds a sepia handler.
   */
  readonly sepia: (handler: FXHandler<FilterHandlerReturn<"sepia">>) => this;

  constructor(config?: FilterConfig) {
    const { isAbsolute = false, init = [] } = config ?? {};
    const handlers: HandlerMethodTuple<"filter">[] = [];

    let filters: FilterEntryResolved[] = [];
    for (const [name, value] of init) {
      filters.push(validateEntry(name, value));
    }

    // ----------

    const addOwnHandler = <M extends HandlerMethodName<"filter">>(
      tuple: HandlerMethodTuple<"filter", M>,
    ) => {
      handlers.push(tuple);
      saveHandlerFor(this, tuple);
      return this;
    };

    // --------------------

    this.isAbsolute = () => isAbsolute;

    this.update = (state, composer) => {
      if (isAbsolute) {
        filters = [];
      }

      const parameters = toParameters(state, composer, { isAbsolute });

      let idx = 0;
      for (const [name, handler] of handlers) {
        const value = handler(parameters, state, composer);
        if (_.isNull(value)) {
          filters[idx] = [name, null];
        } else if (!_.isUndefined(value)) {
          const currentType = (filters[idx] ?? [])[0];
          if (currentType !== name) {
            filters.length = idx;
          }

          const currentValue = (filters[idx] ??
            [])[1] as FilterValueMap[typeof name];

          filters[idx] = validateEntry(name, value, currentValue);
        }

        idx++;
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
      let resultInit: FilterEntryResolved[] = [];
      let resultHandlers: HandlerMethodTuple<"filter">[] = [];
      for (const f of [this, ...others]) {
        if (f.isAbsolute()) {
          resultIsAbsolute = true;
          resultInit = [];
          resultHandlers = [];
        }

        const entries = f.toEntries();
        for (const e of entries) {
          resultInit.push(e);
        }
        resultHandlers.push(...getHandlersFor(f));
      }

      const composed = new Filter({
        isAbsolute: resultIsAbsolute,
        init: resultInit,
      });

      for (const h of resultHandlers) {
        addHandlerTo(composed, h);
      }

      return composed;
    };

    this.toCss = () => ({
      filter: this.toString(),
    });

    this.toString = () => {
      let result = "";
      for (const [p, val] of filters) {
        if (!_.isNullish(val)) {
          result += (result ? " " : "") + formatEntry(p, val);
        }
      }

      return result;
    };

    this.toEntries = () => _.deepCopy(filters);
    this.blur = (handler) => addOwnHandler(["blur", handler]);
    this.brightness = (handler) => addOwnHandler(["brightness", handler]);
    this.contrast = (handler) => addOwnHandler(["contrast", handler]);
    this.dropShadow = (handler) => addOwnHandler(["dropShadow", handler]);
    this.grayscale = (handler) => addOwnHandler(["grayscale", handler]);
    this.hueRotate = (handler) => addOwnHandler(["hueRotate", handler]);
    this.invert = (handler) => addOwnHandler(["invert", handler]);
    this.opacity = (handler) => addOwnHandler(["opacity", handler]);
    this.saturate = (handler) => addOwnHandler(["saturate", handler]);
    this.sepia = (handler) => addOwnHandler(["sepia", handler]);
  }
}

/**
 * Handlers should return the {@link FilterValueMap | correct value} for the
 * respective filter type or `null`.
 *
 * Returning `null` temporarily disabled this filter entry so that it's not
 * included in the CSS string.
 *
 * Returning `undefined` should leave the current value unchanged.
 */
export type FilterHandlerReturn<F extends FilterName> = Partial<
  FilterValueMap[F]
>;

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
   * these will be discarded on {@link Transform.update | update}.
   *
   * **IMPORTANT** If the filter is not absolute (which is the case by default),
   * the {@link FilterName | filter type} in each entry in the array must
   * correspond to the type of handler added in this order. I.e. if {@link init}
   * is `[
   *   ["blur", 2],
   *   ["brightness", 0.9],
   *   ["contrast", 0.8],
   *   ["brightness", 1.2],
   * ]`
   *
   * then the first handler you add must be {@link Filter.blur | blur}, and it
   * will add to the value of 2px in each {@link Filter.update | update}; the
   * next handler you add must be {@link Filter.brightness | brightness} and it
   * will add to the value of 0.9 in each {@link Filter.update | update}, and so
   * on. If the number `N` handler you add does not correspond to the type in
   * entry `N` in the {@link init} array, that entry and all subsequent ones
   * will be discarded.
   *
   * @defaultValue undefined
   */
  init?: FilterEntry[];
};

export type FilterValueMap = {
  /**
   * The blur radius in pixels.
   *
   * Value must be >= 0.
   */
  blur: number | null;

  /**
   * The brightness fraction where 1 is 100%.
   *
   * Value must be >= 0.
   */
  brightness: number | null;

  /**
   * The contrast fraction where 1 is 100%.
   *
   * Value must be >= 0.
   */
  contrast: number | null;

  /**
   * An object describing a drop shadow.
   */
  dropShadow: {
    /**
     * The color of the drop shadow as RGBA or HSLA values.
     *
     * @defaultValue null // no color will be specified and the browser will use
     * the current color
     */
    color: ColorComponentsWithAlpha | null;

    /**
     * The X offset of the shadow in pixels.
     *
     * @defaultValue 0
     */
    offsetX: number;

    /**
     * The Y offset of the shadow in pixels.
     *
     * @defaultValue 0
     */
    offsetY: number;

    /**
     * The Gaussian blur standard deviation in pixels.
     *
     * @defaultValue 0
     */
    blur: number;
  } | null;

  /**
   * The grayscale fraction where 1 is 100%.
   *
   * Value must be >= 0 and <= 1.
   */
  grayscale: number | null;

  /**
   * The hue rotation angle in **degrees*.
   */
  hueRotate: number | null;

  /**
   * The invert fraction where 1 is 100%.
   *
   * Value must be >= 0 and <= 1.
   */
  invert: number | null;

  /**
   * The opacity fraction where 1 is 100%.
   *
   * Value must be >= 0 and <= 1.
   */
  opacity: number | null;

  /**
   * The saturation fraction where 1 is 100%.
   *
   * Value must be >= 0.
   */
  saturate: number | null;

  /**
   * The sepia fraction where 1 is 100%.
   *
   * Value must be >= 0 and <= 1.
   */
  sepia: number | null;
};

export type FilterName = keyof FilterValueMap;

export type FilterEntryResolved<F extends FilterName = FilterName> = [
  F,
  FilterValueMap[F],
];

export type FilterEntry<F extends FilterName = FilterName> = [
  F,
  Partial<FilterValueMap[F]>,
];

// ----------------------------------------

declare module "@lisn/effects/effect" {
  interface EffectRegistry {
    filter: Filter;
  }
}

// ----------------------------------------

const VALUE_VALIDATORS: {
  [F in FilterName]: (
    value: unknown,
    currentValue?: FilterValueMap[F],
  ) => FilterValueMap[F];
} = {
  blur: (v, c) => validateAndAddNumeric("blur", v, c),
  brightness: (v, c) => validateAndAddNumeric("brightness", v, c),
  contrast: (v, c) => validateAndAddNumeric("contrast", v, c),
  grayscale: (v, c) => validateAndAddNumeric("grayscale", v, c, 1),
  hueRotate: (v, c) =>
    normalizeAngleDeg(validateAndAddNumeric("hueRotate", v, c)),
  invert: (v, c) => validateAndAddNumeric("invert", v, c, 1),
  opacity: (v, c) => validateAndAddNumeric("opacity", v, c, 1),
  saturate: (v, c) => validateAndAddNumeric("saturate", v, c),
  sepia: (v, c) => validateAndAddNumeric("sepia", v, c, 1),

  dropShadow: (v, c) => {
    const { color, offsetX, offsetY, blur } = _.isPlainObject(v) ? v : {};

    let newColor = validateColor("drop-shadow color", color) ?? null;
    if (c?.color) {
      newColor = addColor(c.color, newColor ?? {});
    }

    return {
      color: newColor,
      offsetX:
        (c?.offsetX ?? 0) +
        (validateNumber("drop-shadow offsetX", offsetX) ?? 0),
      offsetY:
        (c?.offsetY ?? 0) +
        (validateNumber("drop-shadow offsetY", offsetY) ?? 0),
      blur: (c?.blur ?? 0) + (validateNumber("drop-shadow blur", blur) ?? 0),
    };
  },
};

const VALUE_FORMATTERS: {
  [F in FilterName]: (value: NonNullable<FilterValueMap[F]>) => string;
} = {
  blur: (v) => `${v}px`,
  brightness: (v) => `${v}`,
  contrast: (v) => `${v}`,
  dropShadow: (v) => `${v.offsetX} ${v.offsetY} ${v.blur} ${toColor(v.color)}`,
  grayscale: (v) => `${v}`,
  hueRotate: (v) => `${v}deg`,
  invert: (v) => `${v}`,
  opacity: (v) => `${v}`,
  saturate: (v) => `${v}`,
  sepia: (v) => `${v}`,
};

const validateColor = (
  key: string,
  value: unknown,
): ColorComponentsWithAlpha | undefined => {
  if (_.isNullish(value)) {
    return;
  }

  const color = toColorComponents(value);
  if (!color) {
    throw usageError(`'${key}' must be a valid HSL(A) or RGB(A) color object`);
  }

  return color;
};

const validateAndAddNumeric = (
  key: string,
  value: unknown,
  currentValue: number | null | undefined,
  max: number | null = null,
) => (currentValue ?? 0) + (validateNumber(key, value, { min: 0, max }) ?? 0);

const validateEntry = <F extends FilterName>(
  name: F,
  value: unknown,
  currentValue?: FilterValueMap[F],
): FilterEntryResolved<F> =>
  [name, VALUE_VALIDATORS[name](value, currentValue)] as const;

const formatEntry = <F extends FilterName>(
  name: F,
  value: NonNullable<FilterValueMap[F]> | null,
) => (_.isNullish(value) ? "" : VALUE_FORMATTERS[name](value));

_.brandClass(Filter, "Filter");
