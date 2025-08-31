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

import { addColor, toColorComponents, toColor } from "@lisn/utils/colors";
import { normalizeAngleDeg, toNumWithBounds } from "@lisn/utils/math";
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

import { bugError, usageError } from "@lisn/globals";

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
 * {@link Filter} does not support negation and it does not support parallax
 * depth; it is ignored.
 *
 * @category Effects/Filter
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
   * parameters since the last animation frame and the filter's entries are
   * preserved between calls to {@link update}. Each handler's return value adds
   * to the value of the corresponding entry. If the current value in the entry
   * is null, it is converted to 0 (or "black" for color).
   */
  readonly isAbsolute: () => boolean;

  /**
   * Updates the filter as per the given state.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If any of the values returned by the {@link FXHandler}s
   *                is invalid.
   */
  readonly update: (state: FXState) => this;

  /**
   * Returns a **static copy** of the filter that has the current entries
   * of this filter, but no handlers. New handlers can be added afterwards.
   *
   * @returns **A new** {@link Filter} instance with no handlers.
   */
  readonly export: () => Filter;

  /**
   * Returns a **new live** filter that has all the handlers from this one
   * and the given filters, in order. The resulting entries are the combined
   * (joined arrays) of its current entries and that of all the other given ones.
   *
   * **NOTE:** If any of the given filters is
   * {@link FilterConfig.isAbsolute | absolute}, all previous ones are discarded
   * and the resulting filter becomes absolute.
   *
   * **NOTE:** If any of the given filters is not absolute, then for each filter
   * in the list of filters to compose, its entries and handlers will be
   * compared by the {@link FilterName | filter type} and if there's a mismatch
   * it will be handled in a similar way as explained in
   * {@link FilterConfig.init}.
   *
   * With each new filter added to the composition, if the previous filter had
   * entries and no corresponding handlers (which could be the case if the
   * filter was initialized with existing entries), then dummy (no-change)
   * handlers will be added that preserve those entries. And if it had handlers
   * that haven't yet pushed their values into the entries (which would be the
   * case if the filter hasn't been updated since those handlers were added),
   * then blank (null) entries will be pushed which will accept the new value
   * from those handlers on update. In this way multiple filters composed don't
   * affect entries and handlers from each other.
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
   * Adds a brightness handler.
   */
  readonly brightness: (
    handler: FXHandler<FilterHandlerReturn<"brightness">>,
  ) => this;

  /**
   * Adds a blur handler.
   */
  readonly blur: (handler: FXHandler<FilterHandlerReturn<"blur">>) => this;

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
      if (!(name in VALUE_VALIDATORS)) {
        throw usageError(`Unknown filter type '${name}'`);
      }

      if (_.isNull(value)) {
        filters.push([name, value]);
      } else {
        filters.push(validateAndAddEntry(name, value));
      }
    }

    // ----------

    const pushHandler = <M extends HandlerMethodName<"filter">>(
      tuple: HandlerMethodTuple<"filter", M>,
    ) => {
      handlers.push(tuple);
      saveHandlerFor(this, tuple);
      return this;
    };

    // ----------

    const addOwnHandler = <M extends HandlerMethodName<"filter">>(
      tuple: HandlerMethodTuple<"filter", M>,
    ) => {
      const idx = _.lengthOf(handlers);
      const existingEntry = filters[idx];
      if (!isAbsolute && existingEntry && existingEntry[0] !== tuple[0]) {
        // mismatching handler
        // pad with no-op handlers to keep existing entries
        const numEntries = _.lengthOf(filters);
        for (let i = idx; i < numEntries; i++) {
          pushHandler([filters[i][0], () => void 0]);
        }
      }

      return pushHandler(tuple);
    };

    // --------------------

    this.isAbsolute = () => isAbsolute;

    this.update = (state) => {
      if (isAbsolute) {
        filters = [];
      }

      const parameters = toParameters(state, { isAbsolute });

      let idx = 0;
      for (const [name, handler] of handlers) {
        const value = handler(parameters, state);
        if (!_.isNullish(value)) {
          const currentValue = (filters[idx] ??
            [])[1] as FilterValueMap[typeof name];

          filters[idx] = validateAndAddEntry(name, value, currentValue);
        } else if (!filters[idx] || _.isNull(value)) {
          filters[idx] = [name, null];
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

      let prevEntries: FilterEntryResolved[] | null = null;
      let prevHandlers: HandlerMethodTuple<"filter">[] | null = null;
      for (const f of [this, ...others]) {
        if (f.isAbsolute()) {
          resultIsAbsolute = true;
          resultInit = [];
          resultHandlers = [];
          prevEntries = prevHandlers = null;
        }

        if (prevEntries && prevHandlers) {
          const numEntries = _.lengthOf(prevEntries);
          const numHandlers = _.lengthOf(prevHandlers);
          let i = 0;
          for (i = 0; i < _.min(numEntries, numHandlers); i++) {
            /* istanbul ignore next */
            if (prevEntries[i][0] !== prevHandlers[i][0]) {
              // Should have been handled by addOwnHandler when that filter's
              // handler was being added
              throw bugError("Handlers for filter don't match entries");
            }
          }

          const diffN = _.abs(numHandlers - numEntries);
          for (let j = i; j < i + diffN; j++) {
            if (numEntries > numHandlers) {
              // pad with no-op handlers
              resultHandlers.push([prevEntries[j][0], () => void 0]);
            } else {
              // pad with null entries
              resultInit.push([prevHandlers[j][0], null]);
            }
          }
        }

        const entries = f.toEntries();
        const handlers = getHandlersFor<"filter">(f);
        prevEntries = entries;
        prevHandlers = handlers;

        resultInit.push(...entries);
        resultHandlers.push(...handlers);
      }

      const composed = new Filter({
        isAbsolute: resultIsAbsolute,
        init: resultInit.some((e) => !_.isNull(e[1])) ? resultInit : [],
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
      for (const [name, val] of filters) {
        if (!_.isNullish(val)) {
          result += (result ? " " : "") + formatEntry(name, val);
        }
      }

      return result ? result : "none";
    };

    this.toEntries = () => _.copyNested(filters);
    this.brightness = (handler) => addOwnHandler(["brightness", handler]);
    this.blur = (handler) => addOwnHandler(["blur", handler]);
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
 * Returning `null` temporarily disables this filter entry so that it's not
 * included in the CSS string.
 *
 * Returning `undefined` should leave the current value unchanged.
 *
 * @category Effects/Filter
 */
export type FilterHandlerReturn<F extends FilterName> = Partial<
  FilterValueMap[F]
>;

/**
 * @category Effects/Filter
 */
export type FilterConfig = {
  /**
   * If true, the {@link FXHandler | handlers} receive absolute
   * {@link Effects.FXParams | parameters} and each call to
   * {@link Filter.update | update} will reset the filter back to "none".
   *
   * Otherwise, the handlers receive delta values reflecting the change in
   * parameters since the last animation frame and the filter's entries are
   * preserved between calls to {@link Filter.update | update}. Each handler's
   * return value adds to the value of the corresponding entry. If the current
   * value in the entry is null, it is converted to 0 (or "black" for color).
   *
   * @defaultValue false
   */
  isAbsolute?: boolean;

  /**
   * Initial filters to begin with. Note that if {@link isAbsolute} is `true`,
   * these will be discarded on {@link Filter.update | update}.
   *
   * **NOTE** If the filter is not absolute (which is the case by default),
   * then each entry in the init array will try to be matched to subsequent
   * handlers added, in order, based on the {@link FilterName | filter type}.
   * The handler will then amend (add to) the entry during
   * {@link Filter.update | update}.
   *
   * As soon as a mismatching handler is added, then for each remaining entry in
   * the array, a dummy no-change handler will be added which will preserve it,
   * and the new handler being added will push its own new entry into the array,
   * which it will modify on each {@link Filter.update | update}.
   *
   * For example, if {@link init} is:
   * ```javascript
   * [
   *   ["blur", 2],
   *   ["brightness", 0.9],
   *   ["contrast", 0.8],
   *   ["brightness", 1.2],
   * ]
   * ```
   *
   * and you add the following handlers in order:
   * ```javascript
   * filter.blur(() => {...}) // will modify the entry in init at index 0
   * filter.brightness(() => {...}) // will modify the entry in init at index 1
   * filter.saturation(() => {...}) // NO match => will push its own entry at index 4
   * filter.opacity(() => {...}) // will push its own entry at index 5
   * ```
   *
   * then each time you {@link Filter.update | update} the filter the entries
   * will be as follows:
   * ```javascript
   * [
   *   ["blur", 2 + ...], // added whatever the first handler returned
   *   ["brightness", 0.9 + ...], // added whatever the second handler returned
   *   ["contrast", 0.8], // preserved, will never change
   *   ["brightness", 1.2], // preserved, will never change
   *   ["saturation", ...], // whatever the third handler returned
   *   ["opacity", ...], // whatever the fourth handler returned
   * ]
   * ```
   *
   * @defaultValue undefined
   */
  init?: FilterEntry[];
};

/**
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
     * handler once and later you omit this property, the last color set will be
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
type FilterNameFromMethods = HandlerMethodName<"filter">;
type FilterNameGuard = FilterName extends FilterNameFromMethods
  ? FilterNameFromMethods extends FilterName
    ? FilterName
    : never
  : never;
const typeGuard__ignored: FilterNameGuard = "brightness";

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
  value: unknown,
  currentValue?: FilterValueMap[F],
): FilterEntryResolved<F> =>
  [name, VALUE_VALIDATORS[name](value, currentValue)] as const;

const formatEntry = <F extends FilterName>(
  name: F,
  value: NonNullable<FilterValueMap[F]> | null,
) => (_.isNullish(value) ? "" : ENTRY_FORMATTERS[name](value));

_.brandClass(Filter, "Filter");
