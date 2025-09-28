/**
 * @module Effects
 *
 * @since v1.3.0
 *
 * @categoryDescription Effects/Filter
 * {@link Filter} controls an element's
 * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/filter | filters}
 * It supports:
 * - brightness
 * - blur
 * - contrast
 * - drop-shadow
 * - grayscale
 * - hue-rotate
 * - invert
 * - opacity
 * - saturate
 * - sepia
 */

import * as _ from "@lisn/_internal";

import { ColorComponentsWithAlpha } from "@lisn/globals/types";

import { bugError, usageError } from "@lisn/globals/errors";

import { addColor, toColorComponents, toColor } from "@lisn/utils/colors";
import { normalizeAngleDeg, toNumWithBounds } from "@lisn/utils/math";
import { validateNumber } from "@lisn/utils/validation";

import {
  EffectConfig,
  EffectUpdater,
  EffectUpdaterName,
  EffectUpdaterEntry,
  EffectBase,
  registerEffect,
} from "@lisn/effects/effect";

/**
 * {@link Filter} controls an element's
 * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/filter | filters}
 *
 * It supports:
 * - brightness
 * - blur
 * - contrast
 * - drop-shadow
 * - grayscale
 * - hue-rotate
 * - invert
 * - opacity
 * - saturate
 * - sepia
 *
 * ## Setting updaters and initial state
 *
 * Each updater method (e.g. "brightness", "blur", etc) accepts either a plain
 * value or a function.
 *
 * If a value is given, it should be of the {@link FilterReturn | correct type}
 * for this filter type. This value will modify the initial state of the effect
 * instance that's to be created. It's like a one-time update at the time of
 * creation.
 *
 * If a function is given, it will be called whenever the effect instance is
 * updated by the composer. It will receive the latest
 * {@link Effects.EffectParams | parameters} and
 * {@link Effects.FXState | composer state}. The updater function should return
 * the correct type of value.
 *
 * Updater methods receive unscaled parameters since parallax depth does not
 * apply to filters.
 *
 * **IMPORTANT:** The filter state is composed of an array of filter sub-types
 * (e.g. blur, opacity), which preserve the order in which they have been added.
 * If the effect instance is not {@link EffectConfig.isAbsolute | absolute},
 * then each updater **function** modifies its own slot into this array.
 * Therefore, passing a plain value to an updater method can do one of two
 * things:
 * 1. Set the initial value for a filter that's later updated by an updater
 *    method.
 * 2. Add a static filter to the array that is never updated, but preserved
 *    across updates.
 *
 * If you want case 1 then call the same updater method twice in immediate
 * succession, first with the initial value and then with the updater function,
 * like so:
 *
 * ```javascript
 * const f = new Filter();
 * f.blur(2); // add a blur filter with initial value of 2
 * f.blur((params) => params.nx); // add to the initial blur(2) at every update
 *
 * f.opacity(0.5); // add an opacity filter with an initial value of  0.5
 * f.opacity((params) => params.nx); // add to the initial opacity(0.5) at every update
 * ```
 *
 * Any other order of adding initial values results in case 2. For example:
 * ```javascript
 * const f = new Filter();
 * f.blur((params) => params.nx); // add a blur filter with no initial value and add to it at every update
 *
 * f.blur(2); // add a static blur filter with value of 2; won't change
 *
 * f.opacity((params) => params.nx); // add a new opacity filter with no initial value and add to it at every update
 *
 * f.brightness(1.2); // add a static brightness filter with value of 1.2; won't change
 * ```
 *
 * **NOTE:** For {@link EffectConfig.isAbsolute | absolute} filter instances,
 * the entire array is reset at each update and so initial values set are always
 * discarded at every update.
 *
 * ## Negation and parallax depth
 *
 * {@link Filter} does not support negation and it does not support parallax
 * depth either.
 *
 * @category Effects/Filter
 */
export class Filter extends EffectBase<"filter"> {
  readonly type = "filter";

  /**
   * Adds brightness initially or during update.
   */
  readonly brightness: (
    updater:
      | EffectUpdater<FilterReturn<"brightness">>
      | FilterReturn<"brightness">,
  ) => this;

  /**
   * Adds blur initially or during update.
   */
  readonly blur: (
    updater: EffectUpdater<FilterReturn<"blur">> | FilterReturn<"blur">,
  ) => this;

  /**
   * Adds contrast initially or during update.
   */
  readonly contrast: (
    updater: EffectUpdater<FilterReturn<"contrast">> | FilterReturn<"contrast">,
  ) => this;

  /**
   * Adds drop-shadow initially or during update.
   */
  readonly dropShadow: (
    updater:
      | EffectUpdater<FilterReturn<"dropShadow">>
      | FilterReturn<"dropShadow">,
  ) => this;

  /**
   * Adds grayscale initially or during update.
   */
  readonly grayscale: (
    updater:
      | EffectUpdater<FilterReturn<"grayscale">>
      | FilterReturn<"grayscale">,
  ) => this;

  /**
   * Adds hue-rotate initially or during update.
   */
  readonly hueRotate: (
    updater:
      | EffectUpdater<FilterReturn<"hueRotate">>
      | FilterReturn<"hueRotate">,
  ) => this;

  /**
   * Adds invert initially or during update.
   */
  readonly invert: (
    updater: EffectUpdater<FilterReturn<"invert">> | FilterReturn<"invert">,
  ) => this;

  /**
   * Adds opacity initially or during update.
   */
  readonly opacity: (
    updater: EffectUpdater<FilterReturn<"opacity">> | FilterReturn<"opacity">,
  ) => this;

  /**
   * Adds saturate initially or during update.
   */
  readonly saturate: (
    updater: EffectUpdater<FilterReturn<"saturate">> | FilterReturn<"saturate">,
  ) => this;

  /**
   * Adds sepia initially or during update.
   */
  readonly sepia: (
    updater: EffectUpdater<FilterReturn<"sepia">> | FilterReturn<"sepia">,
  ) => this;

  constructor(config?: EffectConfig) {
    super();
    const { setUpdaters } = init(this, config);

    const valueUpdaters: EffectUpdaterEntry<"filter">[] = [];
    const fnUpdaters: EffectUpdaterEntry<"filter">[] = [];
    let numFilters = 0;

    const addUpdater = ({ name, updater }: EffectUpdaterEntry<"filter">) => {
      const isFn = _.isFunction(updater);

      if (
        isFn &&
        valueUpdaters[numFilters - 1]?.name === name &&
        fnUpdaters[numFilters - 1]?.updater === DUMMY_UPDATER
      ) {
        // previous one was a plain value for this filter type
        // => replace dummy handler
        fnUpdaters[numFilters - 1].updater = updater;
      } else {
        const tag = numFilters++;
        if (isFn) {
          // insert a new slot with null value
          valueUpdaters.push({ name, updater: null, tag });
          fnUpdaters.push({ name, updater, tag });
        } else {
          // insert a new slot with the value and a dummy handler (will be
          // overridden if user sets a handler on the next call
          valueUpdaters.push({ name, updater, tag });
          fnUpdaters.push({ name, updater: DUMMY_UPDATER, tag });
        }
      }

      setUpdaters([...valueUpdaters, ...fnUpdaters]);
      return this;
    };

    this.brightness = (updater) => addUpdater({ name: "brightness", updater });
    this.blur = (updater) => addUpdater({ name: "blur", updater });
    this.contrast = (updater) => addUpdater({ name: "contrast", updater });
    this.dropShadow = (updater) => addUpdater({ name: "dropShadow", updater });
    this.grayscale = (updater) => addUpdater({ name: "grayscale", updater });
    this.hueRotate = (updater) => addUpdater({ name: "hueRotate", updater });
    this.invert = (updater) => addUpdater({ name: "invert", updater });
    this.opacity = (updater) => addUpdater({ name: "opacity", updater });
    this.saturate = (updater) => addUpdater({ name: "saturate", updater });
    this.sepia = (updater) => addUpdater({ name: "sepia", updater });
  }
}

/**
 * Updaters should return the {@link FilterValueMap | correct value} for the
 * respective filter type or `null`.
 *
 * Returning `null` temporarily disables this filter entry so that it's not
 * included in the CSS string.
 *
 * Returning `undefined` leaves the current value unchanged.
 *
 * @category Effects/Filter
 */
export type FilterReturn<F extends FilterName> = Partial<FilterValueMap[F]>;

/**
 * Specifies the expected value type for each sub-filter.
 * The initial values for all filters types is null.
 *
 * @category Effects/Filter
 */
export type FilterValueMap = {
  /**
   * The brightness fraction where 1 is 100%.
   *
   * Value must be >= 0.
   */
  brightness: number | null;

  /**
   * The blur radius in pixels.
   *
   * Value must be >= 0.
   */
  blur: number | null;

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
     * Initial value is `null`, which means no color will be specified and the
     * browser will use the current color. If you've returned a color from the
     * updater once and later you omit this property, the last color set will be
     * preserved.
     */
    color: ColorComponentsWithAlpha | null;

    /**
     * The X offset of the shadow in pixels.
     */
    offsetX: number;

    /**
     * The Y offset of the shadow in pixels.
     */
    offsetY: number;

    /**
     * The Gaussian blur standard deviation in pixels.
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

/**
 * @category Effects/Filter
 */
export type FilterName = keyof FilterValueMap;

/**
 * @category Effects/Filter
 */
export type FilterEntryResolved<F extends FilterName = FilterName> = [
  F,
  FilterValueMap[F],
];

/**
 * @category Effects/Filter
 */
export type FilterEntry<F extends FilterName = FilterName> = [
  F,
  Partial<FilterValueMap[F]>,
];

// ----------------------------------------

// Ensure they match
type FilterNameFromMethods = EffectUpdaterName<"filter">;
type FilterNameGuard = FilterName extends FilterNameFromMethods
  ? FilterNameFromMethods extends FilterName
    ? FilterName
    : never
  : never;
const typeGuard__ignored: FilterNameGuard = "brightness";

type FilterState = {
  _filters: FilterEntryResolved[];
};

const { init } = registerEffect<"filter", FilterState>({
  type: "filter",
  logic: {
    update: (state, name, result, idx) => {
      if (!_.isLiteralNumber(idx)) {
        throw bugError("Filter entry tag is not a number");
      }

      const value: FilterReturn<typeof name> = result;
      if (_.isNull(value)) {
        state._filters[idx] = [name, null];
      } else {
        const currentValue = (state._filters[idx] ??
          [])[1] as FilterValueMap[typeof name];

        state._filters[idx] = validateAndAddEntry(name, value, currentValue);
      }

      return state;
    },
    clone: (state) => {
      return {
        _filters: _.copyNested(state._filters),
      };
    },
    composeWith: (state, other) => {
      return {
        _filters: [
          ..._.copyNested(state._filters),
          ..._.copyNested(other._filters),
        ],
      };
    },
    toCss: (state) => {
      let filterStr = "";
      for (const [name, val] of state._filters) {
        if (!_.isNullish(val)) {
          filterStr += (filterStr ? " " : "") + formatEntry(name, val);
        }
      }

      return {
        filter: filterStr ? filterStr : "none",
      };
    },
  },
  nullState: {
    _filters: [],
  },
});

const DUMMY_UPDATER = () => void 0;

const VALUE_VALIDATORS: {
  [F in FilterName]: (
    value: unknown,
    currentValue?: FilterValueMap[F],
  ) => FilterValueMap[F];
} = {
  brightness: (v, c) => validateAndAddNumeric("brightness", v, c),
  blur: (v, c) => validateAndAddNumeric("blur", v, c),
  contrast: (v, c) => validateAndAddNumeric("contrast", v, c),
  grayscale: (v, c) => validateAndAddNumeric("grayscale", v, c, 1),
  hueRotate: (v, c) =>
    normalizeAngleDeg(validateAndAddNumeric("hueRotate", v, c)),
  invert: (v, c) => validateAndAddNumeric("invert", v, c, 1),
  opacity: (v, c) => validateAndAddNumeric("opacity", v, c, 1),
  saturate: (v, c) => validateAndAddNumeric("saturate", v, c),
  sepia: (v, c) => validateAndAddNumeric("sepia", v, c, 1),

  dropShadow: (v, c) => {
    const { color, offsetX, offsetY, blur } = _.isObject(v)
      ? (v as Record<string, unknown>)
      : {};

    let newColor = validateColor("drop-shadow color", color) ?? null;
    if (c?.color) {
      newColor = addColor(c.color, newColor ?? {});
    }

    return {
      color: newColor,
      offsetX: validateAndAddNumeric(
        "drop-shadow offsetX",
        offsetX,
        c?.offsetX,
      ),
      offsetY: validateAndAddNumeric(
        "drop-shadow offsetY",
        offsetY,
        c?.offsetY,
      ),
      blur: validateAndAddNumeric("drop-shadow blur", blur, c?.blur),
    };
  },
};

const ENTRY_FORMATTERS: {
  [F in FilterName]: (value: NonNullable<FilterValueMap[F]>) => string;
} = {
  brightness: (v) => `brightness(${v})`,
  blur: (v) => `blur(${v}px)`,
  contrast: (v) => `contrast(${v})`,
  dropShadow: (v) =>
    `drop-shadow(${v.offsetX} ${v.offsetY} ${v.blur} ${toColor(v.color)})`,
  grayscale: (v) => `grayscale(${v})`,
  hueRotate: (v) => `hue-rotate(${v}deg)`,
  invert: (v) => `invert(${v})`,
  opacity: (v) => `opacity(${v})`,
  saturate: (v) => `saturate(${v})`,
  sepia: (v) => `sepia(${v})`,
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
) =>
  toNumWithBounds((currentValue ?? 0) + (validateNumber(key, value) ?? 0), {
    min: 0,
    max,
  });

const validateAndAddEntry = <F extends FilterName>(
  name: F,
  value: NonNullable<Partial<FilterValueMap[F]>>,
  currentValue?: FilterValueMap[F],
): FilterEntryResolved<F> =>
  [name, VALUE_VALIDATORS[name](value, currentValue)] as const;

const formatEntry = <F extends FilterName>(
  name: F,
  value: NonNullable<FilterValueMap[F]> | null,
) => (_.isNullish(value) ? "" : ENTRY_FORMATTERS[name](value));

// ----------------------------------------

declare module "@lisn/effects/effect" {
  interface EffectRegistry {
    filter: Filter;
  }
}

_.brandClass(Filter, "Filter");
