/**
 * @module Widgets
 */

// This widget finds optimal widths of flexbox children so that their heights
// are equal or as close as possible to each other. It takes into account
// whether they contain text (and possibly other elements, but not images) or
// images.
//
// NOTE:
//  - We assume that a given flexbox child is either a "text container" and
//    contains only text and other non-image elements (such as buttons), or is
//    an "image container" and contains only images.
//  - We also assume that all the text inside a text container is the same
//    font size as the font size of the text container.
//
// ~~~~~~ BACKGROUND: analysis for one text container and one image container ~~~~~~
//
// A text box has a fixed area, its height decreasing as width increases.
// Whereas an image has a fixed aspect ratio, its height increasing as width
// increases.
//
// We want to find an optimal configuration at which the text container (which
// can include other elements apart from text) and image heights are equal, or
// if not possible, at which they are as close as possible to each other while
// satisfying as best as possible these "guidelines" (constraints that are not
// enforced), based on visual appeal:
//   - minGap, minimum gap between each item
//   - maxWidthR, maximum ratio between the width of the widest child and the
//     narrowest child
//   - maxFreeR, maximum free space in the container as a percentage of its
//     total width
//
// Then we set flex-basis as the optimal width (making sure this is disabled
// when the flex direction is column). This allows for fluid width if the user
// to configure shrink or wrap on the flexbox using CSS.
//
// ~~~~~~ FORMULAE: text and image width as a function of their height ~~~~~~
//
// For a given height, h, the widths of the text and image are:
//
//                 txtArea
//   txtW(h) =  —————————————
//              h - txtExtraH
//
//   imgW(h) = imgAspectR * h
//
// where txtExtraH comes from buttons and other non-text elements inside the
// text container, whose height is treated as fixed (not changing with width).
//
// ~~~~~~ PLOT: total width as a function of height ~~~~~~
//
// The sum of the widths of image and text varies with their height, h, as:
//
//   w(h) = txtW(h) + imgW(h)
//
//              txtArea
//        =  —————————————  +  imgAspectR * h
//           h - txtExtraH
//
//
//       w(h)
//        ^
//        | |              .
//        | .             .
//        |  .           .
// flexW  +   .         .
//        |    .       .
//        |     .    .
//        |       -
//        |
//        |———|———|—————|———————————> h
//            h1  h0    h2
//
//
// ~~~~~~ FORMULAE: height at which total width is minimum ~~~~~~
//
// The minimum of the function w(h) is at h = h0
//
//            ⌈   txtArea  ⌉
//   h0 = sqrt| —————————— | + txtExtraH
//            ⌊ imgAspectR ⌋
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// The widths of image and text container at height = h0 are:
//
//   txtW(h0) = sqrt( txtArea * imgAspectR )
//
//   imgW(h0) = sqrt( txtArea * imgAspectR ) + imgAspectR * txtExtraH
//            = txtW(h0) + imgAspectR * txtExtraH
//
// - NOTE: at if txtExtraH is 0 (i.e. the container has only text), then
//   their widths are equal at h0; otherwise the image is wider
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// There are zero, one or two values of h at which w(h) equals the flexbox
// width, flexW. Labelled h1 and h2 above.
//
// ~~~~~~ FORMULAE: height at which total width is equal to flexbox width ~~~~~~
//
// The heights at which the sum of the widths, w(h) equals exactly flexW are:
//
//          -b ± sqrt( b^2 - 4ac )
//   h2/1 = ——————————————————————
//                  2a
//
// where:
// a = imgAspectR
// b = - ( (imgAspectR * txtExtraH) + flexW )
// c = txtArea + (txtExtraH * flexW)
//
// If h1 and h2 are real, then h1 <= h0 <= h2, as shown in plot above.
//
// ~~~~~~ SCENARIOS: free space or overflow in the flexbox ~~~~~~
//
// Whether there is a solution to the above equation, i.e. whether h1 and h2
// are real, depends on which scenario we have:
//
// 1. If flexW = w(h0), then h1 = h2 = h0
// 2. If flexW < w(h0), then there is no exact solution, i.e. it's impossible
//    to fit the text and image inside the flexbox and have them equal heights;
//    there is overflow even at h0
// 3. If flexW > w(h0) (as in the graph above), then at h0 there is free space
//    in the flexbox and we can choose any height between h1 and h2
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// The widths h0, h1 and h2 represent the following visual configuration:
//   - h0: intermediate height, maximum free space in the container;
//   - h1: minimum height (i.e. wide text and small image), no free space in
//     the container;
//   - h2: maximum height (i.e. narrow text and large image), no free space in
//     the container;
//
// ~~~~~~ THEREFORE: approach ~~~~~~
//
// 1. If flexW = w(h0), i.e. h1 = h2 = h0:
//    => we choose h0 as the height
// 2. If flexW < w(h0), i.e. it's impossible to fit the text and image inside
//    the flexbox and have them equal heights:
//    => we still choose h0 as the height as that gives the least amount of
//       overflow; user-defined CSS can control whether the items will be
//       shrunk, the flexbox will wrap or overflow
// 3. If flexW > w(h0), i.e. at h0 there is free space in the flexbox:
//    => choose a height between h1 and h2 that best fits with the guidelines
//       maxWidthR and maxFreeR
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// In scenario 3 we can look at the guidelines, maxWidthR and maxFreeR.
//
// ~~~~~~ GUIDELINE: maxWidthR ~~~~~~
//
// ~~~~~~ FORMULAE: height at which text and image width are equal ~~~~~~
//
// The width of the text and image container are equal at height hR0:
//
//         txtExtraH + sqrt( txtExtraH^2  +  4 * (h0 - txtExtraH)^2 )
// hR0  =  ——————————————————————————————————————————————————————————
//                                    2
//
// ~~~~~~ FORMULAE: height at which text to image width is maxWidthR ~~~~~~
//
// For heights < hR0, i.e. text becomes wider than the image, at some point the
// ratio of text width to image width becomes maxWidthR. This happens at hR1.
//
//                         ⌈                 4 * (h0 - txtExtraH)^2 ⌉
//         txtExtraH + sqrt| txtExtraH^2  +  —————————————————————— |
//                         ⌊                        maxWidthR       ⌋
// hR1  =  ——————————————————————————————————————————————————————————
//                                    2
//
// ~~~~~~ FORMULAE: height at which image to text width is maxWidthR ~~~~~~
//
// For heights > hR0, i.e. text becomes narrower than the image, at some point
// the ratio of image width to text width becomes maxWidthR. This happens at hR2.
//
//         txtExtraH + sqrt( txtExtraH^2  +  4 * maxWidthR * (h0 - txtExtraH)^2 )
// hR2  =  ——————————————————————————————————————————————————————————————————————
//                                        2
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// NOTE:
// - hR1 <= hR0 <= hR2 && hR0 <= h0
// - hR0, hR1 and hR2 are the first (larger) roots of the quadratic equation
//   with coefficients:
//     a = imgAspectR * R
//     b = - imgAspectR * txtExtraH * R
//     c = - textArea
//   where R = 1 gives hR0, R = maxWidthR gives hR1 and R = 1 / maxWidthR gives hR2
// - The smaller roots of the equation should be negative, so we ignore them
//
// ~~~~~~ GUIDELINE: maxFreeR ~~~~~~
//
// ~~~~~~ FORMULAE: free space in flexbox relative to its width ~~~~~~
//
// The percentage of free space in the container is:
//
//           flexW - w(h)
// freeR  =  ————————————
//              flexW
//
//
//                             txtArea
//                flexW  -  —————————————  - imgAspectR * h
//                          h - txtExtraH
//             =  —————————————————————————————————————————
//                                flexW
//
// ~~~~~~ FORMULAE: height at which relative free space is maxFreeR ~~~~~~
//
// This would be equal to maxFreeR at hF1 and hF2:
//
//          -b ± sqrt( b^2 - 4ac )
//   hF2/1 = ——————————————————————
//                  2a
//
// where:
// a = imgAspectR
// b = - ( (imgAspectR * txtExtraH) + ( flexW * (1 - maxFreeR) ) )
// c = txtArea + ( txtExtraH * flexW * (1 - maxFreeR) )
//
// If hF1 and hF2 are real, then h1 < hF1 <= h0 <= hF2 < h2.
//
// ~~~~~~ THEREFORE: choosing a height in scenario 3 ~~~~~~
//
// So in scenario 3 we can choose any height h between
//
//   max(h1, hR1, hF1)  and  min(h2, hR2, hF2)
//
// Note, it's possible that max(h1, hR1, hF1) is greater than min(h2, hR2, hF2),
// e.g. if hF1 > hR2 or hR1 > hF2.
//
// This will make the text and image equal height, fitting in the flexbox, and
// if possible, satisfying both maxFreeR and maxWidthR.
//
// Here we choose the smallest height possible, which would result in the
// larger ratio between text width and image width, but it will satisfy the
// constraints maxFreeR and maxWidthR, so that is ok.
//
// ~~~~~~ GENERALISING: for more than one text and/or image container ~~~~~~
//
// We can generalise the above in order to find an approximate solution for the
// case of multiple text or image containers (an exact solution would require
// solving a polynomial of degree equal to the number of elements).
//
// If we imaging putting all text in one container and all images in another
// container we are back at the above exact solutions for a single text and
// image container.
//
// We can solve for the following parameters:
// - txtArea:    total text area
//               = sum_i(txtArea_i)
//
// - txtExtraH:  weighted average extra height
//               = sum_i(txtExtraH_i * txtArea_i) / txtArea
//
// - imgAspectR: total image aspect ratio (for horizontally laid out image
//               containers)
//               = sum_i(imgAspectR_i)
//
// ~~~~~~ CASE 1: only images containers ~~~~~~
// If we have only image containers, we solve for the optimal height as follows:
//
//   flexW = imgAspectR * h
//
//                   flexW
//   => hIdeal  =  ——————————
//                 imgAspectR
//
// ~~~~~~ CASE 2: only text containers ~~~~~~
// If we have only text containers, we solve for the optimal height as follows:
//
//                  txtArea
//   flexW  =  ——————————————————
//             hIdeal - txtExtraH
//
//                 txtArea
//   => hIdeal  =  ———————  +  txtExtraH
//                  flexW
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Once we've found the optimal height h, we calculate the individual widths of
// the flexbox children as:
//
//                  txtArea_i
//   txtW_i(h) =  —————————————
//                h - txtExtraH_i
//
//   imgW_i(h) = imgAspectR_i * h
//
// ~~~~~~ IMPLEMENTATION ~~~~~~
//
// We go through the flexbox children and determine whether a child is a "text
// container" or an "image container".
//
// For image containers, we measure the width and height and calculate the
// aspect ratio using these.
//
// For text containers, we measure their width and height. We calculate the
// text area by measuring the size of all children of the text container that
// are deemed to contain only text (or if the entire text container is deemed
// to contain only text, then we take its size). Then we sum the areas of
// all such text-only boxes.
//
// To determine the extra height in the text container, we take the total
// height of all text-only boxes inside it, and we subtract that from its
// measured height.
//
// NOTE:
// - This does not work if the flexbox children are set to align stretch,
//   because in such cases there would be free vertical space in the container
//   that shouldn't be counted.
// - If the flexbox children or any of their descendants have paddings and
//   margins, then this calculation would only work if the paddings/margins
//   inside text containers are absolute and only on top and bottom, and
//   paddings/margins inside image containers are in percentages and only on
//   descendants of the image container. Otherwise the image aspect ratio and the
//   extra text height would not be constant, and there may be extra width in
//   the text container. It is very tricky to take all of this into account. So
//   we ignore such cases and assume constant image aspect ratio and constant
//   text area and text container extra height.
//
// We use resize observers to get the size of relevant elements and
// re-calculate as needed.

import * as _ from "@lisn/_internal";

import { usageError, bugError } from "@lisn/globals/errors";

import { settings } from "@lisn/globals/settings";

import {
  addClasses,
  removeClasses,
  getData,
  setData,
  delData,
  setNumericStyleJsVars,
  getComputedStyleProp,
} from "@lisn/utils/css-alter";
import { getVisibleContentChildren } from "@lisn/utils/dom-query";
import { logError } from "@lisn/utils/log";
import { isValidNum, toNumWithBounds, quadraticRoots } from "@lisn/utils/math";
import { formatAsString } from "@lisn/utils/text";
import { validateNumber } from "@lisn/utils/validation";

import { SizeWatcher, SizeData } from "@lisn/watchers/size-watcher";

import {
  Widget,
  WidgetConfigValidatorObject,
  registerWidget,
  getDefaultWidgetSelector,
} from "@lisn/widgets/widget";

import { LoggerInterface } from "@lisn/debug/types";

import debug from "@lisn/debug/debug";

/**
 * Configures the given element as a {@link SameHeight} widget.
 *
 * The SameHeight widget sets up the given element as a flexbox and sets the
 * flex basis of its components so that their heights are as close as possible
 * to each other. It tracks their size (see {@link SizeWatcher}) and
 * continually updates the basis as needed.
 *
 * When calculating the best flex basis that would result in equal heights,
 * SameHeight determines whether a flex child is mostly text or mostly images
 * since the height of these scales in opposite manner with their width.
 * Therefore, the components of the widget should contain either mostly text or
 * mostly images.
 *
 * The widget should have more than one item and the items must be immediate
 * children of the container element.
 *
 * SameHeight tries to automatically determine if an item is mostly text or
 * mostly images based on the total display text content, but you can override
 * this in two ways:
 * 1. By passing a map of elements as {@link SameHeightConfig.items | items}
 *    instead of an array, and setting the value for each to either `"text"` or
 *    `"image"`
 * 2. By setting the `data-lisn-same-height-item` attribute to `"text"` or
 *   `"image"` on the children. **NOTE** however that when auto-discovering the
 *   items (i.e. when you have not explicitly passed a list/map of items), if
 *   you set the `data-lisn-same-height-item` attribute on _any_ child you must
 *   also add this attribute to all other children that are to be used by the
 *   widget. Other children (that don't have this attribute) will be ignored
 *   and assumed to be either zero-size or position absolute/fixed.
 *
 * **IMPORTANT:** You should not instantiate more than one {@link SameHeight}
 * widget on a given element. Use {@link SameHeight.get} to get an existing
 * instance if any. If there is already a widget instance, it will be destroyed!
 *
 * **IMPORTANT:** The element you pass will be set to `display: flex` and its
 * children will get `box-sizing: border-box` and continually updated
 * `flex-basis` style. You can add additional CSS to the element or its
 * children if you wish. For example you may wish to set `flex-wrap: wrap` on
 * the element and a `min-width` on the children.
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see {@link settings.autoWidgets}), the
 * following CSS classes or data attributes are recognized:
 * - `lisn-same-height` class or `data-lisn-same-height` attribute set on the
 *   container element that constitutes the widget.
 *
 * When using auto-widgets, the elements that will be used as items are
 * discovered in the following way:
 * 1. The immediate children of the top-level element that constitutes the
 *    widget that have the `lisn-same-height-item` class or
 *    `data-lisn-same-height-item` attribute are taken.
 * 2. If none of the root's children have this class or attribute, then all of
 *    the immediate children of the widget element except any `script` or
 *    `style` elements are taken as the items.
 *
 * See below examples for what values you can use set for the data attribute
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This defines a simple SameHeight widget with one text and one image child.
 *
 * ```html
 * <div class="lisn-same-height">
 *   <div>
 *     <p>
 *       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
 *       eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
 *       minim veniam, quis nostrud exercitation ullamco laboris nisi ut
 *       aliquip ex ea commodo consequat. Duis aute irure dolor in
 *       reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
 *       pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
 *       culpa qui officia deserunt mollit anim id est laborum.
 *     </p>
 *   </div>
 *
 *   <div>
 *     <img
 *       src="https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2@1.5x.png"
 *     />
 *   </div>
 * </div>
 * ```
 *
 * @example
 * This defines a SameHeight widget with the flexbox children specified
 * explicitly (and one ignored), as well as having all custom settings.
 *
 * ```html
 * <div data-lisn-same-height="diff-tolerance=20
 *                             | resize-threshold=10
 *                             | debounce-window=50
 *                             | min-gap=50
 *                             | max-free-r=0.2
 *                             | max-width-r=3.2">
 *   <div>Example ignored child</div>
 *
 *   <div data-lisn-same-height-item><!-- Will be detected as text anyway -->
 *     <p>
 *       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
 *       eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
 *       minim veniam, quis nostrud exercitation ullamco laboris nisi ut
 *       aliquip ex ea commodo consequat. Duis aute irure dolor in
 *       reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
 *       pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
 *       culpa qui officia deserunt mollit anim id est laborum.
 *     </p>
 *   </div>
 *
 *   <!-- Explicitly set to image type, though it will be detected as such -->
 *   <div data-lisn-same-height-item="image">
 *     <img
 *       src="https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2@1.5x.png"
 *     />
 *   </div>
 *
 *   <!-- Explicitly set to text type, because it will NOT be detected as such (text too short). -->
 *   <div data-lisn-same-height-item="text">
 *     <p>
 *       Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 *     </p>
 *   </div>
 * </div>
 * ```
 */
export class SameHeight extends Widget {
  /**
   * Switches the flexbox to vertical (column) mode.
   *
   * You can alternatively do this by setting the
   * `data-lisn-orientation="vertical"` attribute on the element at any time.
   *
   * You can do this for example as part of a trigger:
   *
   * @example
   * ```html
   * <div class="lisn-same-height"
   *      data-lisn-on-layout="max-mobile-wide:set-attribute=data-lisn-orientation#vertical">
   *      <!-- ... children -->
   * </div>
   * ```
   */
  readonly toColumn: () => Promise<void>;

  /**
   * Switches the flexbox back to horizontal (row) mode, which is the default.
   *
   * You can alternatively do this by deleting the
   * `data-lisn-orientation` attribute on the element, or setting it to
   * `"horizontal"` at any time.
   */
  readonly toRow: () => Promise<void>;

  /**
   * Returns the elements used as the flex children.
   */
  readonly getItems: () => Element[];

  /**
   * Returns a map of the elements used as the flex children with their type.
   */
  readonly getItemConfigs: () => Map<Element, "text" | "image">;

  /**
   * If the element is already configured as a SameHeight widget, the widget
   * instance is returned. Otherwise null.
   */
  static get(containerElement: Element): SameHeight | null {
    const instance = super.get(containerElement, DUMMY_ID);
    if (_.isInstanceOf(instance, SameHeight)) {
      return instance;
    }
    return null;
  }

  static register() {
    registerWidget(
      WIDGET_NAME,
      (element, config) => {
        if (_.isHTMLElement(element)) {
          if (!SameHeight.get(element)) {
            return new SameHeight(element, config);
          }
        } else {
          logError(
            usageError("Only HTMLElement is supported for SameHeight widget"),
          );
        }
        return null;
      },
      configValidator,
    );
  }

  constructor(containerElement: HTMLElement, config?: SameHeightConfig) {
    const destroyPromise = SameHeight.get(containerElement)?.destroy();
    super(containerElement, { id: DUMMY_ID });

    const items = getItemsFrom(containerElement, config?.items);

    if (_.sizeOf(items) < 2) {
      throw usageError("SameHeight must have more than 1 item");
    }

    for (const item of items.keys()) {
      if (_.parentOf(item) !== containerElement) {
        throw usageError("SameHeight's items must be its immediate children");
      }
    }

    fetchConfig(containerElement, config).then((fullConfig) => {
      (destroyPromise || _.promiseResolve()).then(() => {
        if (this.isDestroyed()) {
          return;
        }

        init(this, containerElement, items, fullConfig);
      });
    });

    this.toColumn = () =>
      setData(containerElement, _.PREFIX_ORIENTATION, _.S_VERTICAL);

    this.toRow = () => delData(containerElement, _.PREFIX_ORIENTATION);

    this.getItems = () => [...items.keys()];
    this.getItemConfigs = () => _.newMap([...items.entries()]);
  }
}

/**
 * @interface
 */
export type SameHeightConfig = {
  /**
   * The elements that will make up the items. They **MUST** be immediate
   * children of the container element.
   *
   * The widget should have more than one item.
   *
   * If this is not specified, then
   * 1. The immediate children of the top-level element that constitutes the
   *    widget that have the `lisn-same-height-item` class or
   *    `data-lisn-same-height-item` attribute are taken.
   * 2. If none of the root's children have this class or attribute, then all of
   *    the immediate children of the widget element except any `script` or
   *    `style` elements are taken as the items.
   */
  items?: Element[] | Map<Element, "image" | "text">;

  /**
   * After setting the flex basis of the children and their size updates, in
   * case the resultant height differs from the predicted calculated one by
   * `diffTolerance` in pixels, then the calculations are re-run using the new
   * sizes. Calculations are re-run at most once only.
   *
   * Differences between the predicted and resultant height would happen if the
   * children contain a mixture of text and images or if there are margins or
   * paddings that don't scale in the same way as the content.
   *
   * @defaultValue {@link settings.sameHeightDiffTolerance}
   */
  diffTolerance?: number;

  /**
   * The `resizeThreshold` to pass to the {@link SizeWatcher}.
   *
   * @defaultValue {@link settings.sameHeightResizeThreshold}
   */
  resizeThreshold?: number;

  /**
   * The `debounceWindow` to pass to the {@link SizeWatcher}.
   *
   * @defaultValue {@link settings.sameHeightDebounceWindow}
   */
  debounceWindow?: number;

  /**
   * Minimum gap between the flex items. Note that setting this to 0 while at
   * the same time setting `flex-wrap` to `wrap` (or `wrap-reverse`) on the
   * element may lead to premature/unnecessary wrapping.
   *
   * Note that this is not strictly enforced, and is only used in finding
   * optimal height based on other constraints. If you want to enforce this gap,
   * set it as a `column-gap` CSS rule.
   *
   * @defaultValue The effective `column-gap` on the container element style or
   *               if none, {@link settings.sameHeightMinGap}
   */
  minGap?: number;

  /**
   * Maximum ratio between the free space in the flex container and its total
   * width. You can set this to a negative number to disable this restriction.
   *
   * It has to be < 1. Otherwise it is invalid and disables this restriction.
   *
   * Note that this is not strictly enforced, and is only used in finding
   * optimal height based on other constraints.
   *
   * @defaultValue {@link settings.sameHeightMaxFreeR}
   */
  maxFreeR?: number;

  /**
   * Maximum ratio between the width of the widest item and the narrowest item.
   * You can set this to 0 or a negative number to disable this restriction.
   *
   * It has to be >= 1. Otherwise it is invalid and disables this restriction.
   *
   * Note that this is not strictly enforced, and is only used in finding
   * optimal height based on other constraints.
   *
   * @defaultValue {@link settings.sameHeightMaxWidthR}
   */
  maxWidthR?: number;
};

// ------------------------------

type SameHeightConfigInternal = {
  _minGap: number;
  _diffTolerance: number;
  _resizeThreshold: number;
  _debounceWindow: number;
  _maxFreeR: number;
  _maxWidthR: number;
};

type ItemProperties = {
  _type: "" | "image" | "text";
  _width: number;
  _height: number;
  _aspectR: number;
  _area: number;
  _extraH: number;
  _components: Element[];
};

type AverageMeasurements = {
  _tArea: number;
  _tExtraH: number;
  _imgAR: number;
  _flexW: number;
  _nItems: number;
};

const WIDGET_NAME = "same-height";
const PREFIXED_NAME = _.prefixName(WIDGET_NAME);
const PREFIX_ROOT = `${PREFIXED_NAME}__root`;

// Use different classes for styling items to the one used for auto-discovering
// them, so that re-creating existing widgets can correctly find the items to
// be used by the new widget synchronously before the current one is destroyed.
const PREFIX_ITEM = `${PREFIXED_NAME}__item`;
const PREFIX_ITEM__FOR_SELECT = `${PREFIXED_NAME}-item`;

const S_TEXT = "text";
const S_IMAGE = "image";

// Only one SameHeight widget per element is allowed, but Widget requires a
// non-blank ID.
const DUMMY_ID = PREFIXED_NAME;

// We consider elements that have text content of at least <MIN_CHARS_FOR_TEXT>
// characters to be text.
const MIN_CHARS_FOR_TEXT = 100;

// For HTML API only
const configValidator: WidgetConfigValidatorObject<SameHeightConfig> = {
  diffTolerance: validateNumber,
  resizeThreshold: validateNumber,
  [_.S_DEBOUNCE_WINDOW]: validateNumber,
  minGap: validateNumber,
  maxFreeR: validateNumber,
  maxWidthR: validateNumber,
};

const isText = (element: Element) =>
  getData(element, PREFIX_ITEM__FOR_SELECT) === S_TEXT ||
  (getData(element, PREFIX_ITEM__FOR_SELECT) !== S_IMAGE &&
    _.isHTMLElement(element) &&
    _.lengthOf(element.innerText) >= MIN_CHARS_FOR_TEXT);

const areImagesLoaded = (element: Element) => {
  for (const img of element.querySelectorAll("img")) {
    // Don't rely on img.complete since sometimes this returns false even
    // though the image is loaded and has a size. Just check the size.
    if (
      img.naturalWidth === 0 ||
      img.width === 0 ||
      img.naturalHeight === 0 ||
      img.height === 0
    ) {
      return false;
    }
  }

  return true;
};

const fetchConfig = async (
  containerElement: HTMLElement,
  userConfig: SameHeightConfig | undefined,
): Promise<SameHeightConfigInternal> => {
  const colGapStr = await getComputedStyleProp(containerElement, "column-gap");
  const minGap = getNumValue(
    _.strReplace(colGapStr, /px$/, ""),
    settings.sameHeightMinGap,
  );

  return {
    _minGap: toNumWithBounds(userConfig?.minGap ?? minGap, { min: 0 }, 10),
    _maxFreeR: toNumWithBounds(
      userConfig?.maxFreeR ?? settings.sameHeightMaxFreeR,
      { min: 0, max: 0.9 },
      -1,
    ),
    _maxWidthR: toNumWithBounds(
      userConfig?.maxWidthR ?? settings.sameHeightMaxWidthR,
      { min: 1 },
      -1,
    ),
    _diffTolerance:
      userConfig?.diffTolerance ?? settings.sameHeightDiffTolerance,
    _resizeThreshold:
      userConfig?.resizeThreshold ?? settings.sameHeightResizeThreshold,
    _debounceWindow:
      userConfig?.debounceWindow ?? settings.sameHeightDebounceWindow,
  };
};

const getNumValue = (strValue: string | null, defaultValue: number): number => {
  const num = strValue ? _.parseFloat(strValue) : NaN;
  return _.isNaN(num) ? defaultValue : num;
};

const findItems = (containerElement: HTMLElement) => {
  const items = [
    ..._.querySelectorAll(
      containerElement,
      getDefaultWidgetSelector(PREFIX_ITEM__FOR_SELECT),
    ),
  ];

  if (!_.lengthOf(items)) {
    items.push(...getVisibleContentChildren(containerElement));
  }

  return items;
};

const getItemsFrom = (
  containerElement: HTMLElement,
  inputItems: Element[] | Map<Element, "image" | "text"> | undefined,
) => {
  const itemMap = _.newMap<Element, "image" | "text">();

  inputItems = inputItems || findItems(containerElement);

  const addItem = (item: Element, itemType?: "text" | "image") => {
    itemType = itemType || (isText(item) ? S_TEXT : S_IMAGE);
    itemMap.set(item, itemType);
  };

  if (_.isArray(inputItems)) {
    for (const item of inputItems) {
      addItem(item);
    }
  } else if (_.isMap(inputItems)) {
    for (const [item, itemType] of inputItems.entries()) {
      addItem(item, itemType);
    }
  }

  return itemMap;
};

const init = (
  widget: SameHeight,
  containerElement: HTMLElement,
  items: Map<Element, "image" | "text">,
  config: SameHeightConfigInternal,
) => {
  const logger = debug
    ? new debug.Logger({
        name: `SameHeight-${formatAsString(containerElement)}`,
      })
    : null;

  const diffTolerance = config._diffTolerance;
  const debounceWindow = config._debounceWindow;

  const sizeWatcher = SizeWatcher.reuse({
    [_.S_DEBOUNCE_WINDOW]: debounceWindow,
    resizeThreshold: config._resizeThreshold,
  });

  const allItems = _.newMap<Element, ItemProperties>();

  let callCounter = 0;
  let isFirstTime = true;
  let lastOptimalHeight = 0;
  let hasScheduledReset = false;
  let counterTimeout: ReturnType<typeof setTimeout> | null = null;

  // ----------

  const resizeHandler = (element: Element, sizeData: SizeData) => {
    // Since the SizeWatcher calls us once for every element, we batch the
    // re-calculations so they are done once in every cycle.
    // Allow the queue of ResizeObserverEntry in the SizeWatcher to be
    // emptied, and therefore to ensure we have the latest size for all
    // elements.
    if (!hasScheduledReset) {
      debug: logger?.debug7("Scheduling calculations", callCounter);
      hasScheduledReset = true;

      _.setTimer(() => {
        hasScheduledReset = false;

        if (callCounter > 1) {
          debug: logger?.debug7("Already re-calculated once, skipping");
          callCounter = 0;
          return;
        }

        callCounter++;
        if (counterTimeout) {
          _.clearTimer(counterTimeout);
        }

        const measurements = calculateMeasurements(
          containerElement,
          allItems,
          isFirstTime,
          logger,
        );

        const height = measurements
          ? getOptimalHeight(measurements, config, logger)
          : null;

        if (height && _.abs(lastOptimalHeight - height) > diffTolerance) {
          // Re-set widths again. We may be called again in the next cycle if
          // the change in size exceeds the resizeThreshold.
          lastOptimalHeight = height;
          isFirstTime = false;
          setWidths(height); // no need to await

          // If we are _not_ called again in the next cycle (just after
          // debounceWindow), then reset the counter. It means the resultant
          // change in size did not exceed the SizeWatcher threshold.
          counterTimeout = _.setTimer(() => {
            callCounter = 0;
          }, debounceWindow + 50);
        } else {
          // Done, until the next time elements are resized
          callCounter = 0;
        }
      }, 0);
    }

    // Save the size of the item
    const properties = allItems.get(element);
    if (!properties) {
      logError(bugError("Got SizeWatcher call for unknown element"));
      return;
    }

    properties._width =
      sizeData.border[_.S_WIDTH] || sizeData.content[_.S_WIDTH];
    properties._height =
      sizeData.border[_.S_HEIGHT] || sizeData.content[_.S_HEIGHT];

    debug: logger?.debug7("Got size", element, properties);
  };

  // ----------

  const observeAll = () => {
    isFirstTime = true;

    for (const element of allItems.keys()) {
      sizeWatcher.onResize(resizeHandler, { target: element });
    }
  };

  // ----------

  const unobserveAll = () => {
    for (const element of allItems.keys()) {
      sizeWatcher.offResize(resizeHandler, element);
    }
  };

  // ----------

  const setWidths = (height: number) => {
    for (const [element, properties] of allItems.entries()) {
      if (_.parentOf(element) === containerElement) {
        const width = getWidthAtH(element, properties, height);
        debug: logger?.debug9(
          "Setting width property",
          element,
          properties,
          width,
        );
        setNumericStyleJsVars(
          element,
          { sameHeightW: width },
          { _units: "px" },
        );
      }
    }
  };

  // SETUP ------------------------------

  widget.onDisable(unobserveAll);
  widget.onEnable(observeAll);

  widget.onDestroy(async () => {
    for (const element of allItems.keys()) {
      if (_.parentOf(element) === containerElement) {
        // delete the property and attribute
        await setNumericStyleJsVars(element, { sameHeightW: NaN });
        await removeClasses(element, PREFIX_ITEM);
      }
    }

    allItems.clear();

    await removeClasses(containerElement, PREFIX_ROOT);
  });

  // Find all relevant items: the container, its direct children and the
  // top-level text only elements.
  const getProperties = (itemType: "" | "image" | "text"): ItemProperties => {
    return {
      _type: itemType,
      _width: NaN,
      _height: NaN,
      _aspectR: NaN,
      _area: NaN,
      _extraH: NaN,
      _components: [],
    };
  };

  allItems.set(containerElement, getProperties(""));

  for (const [item, itemType] of items.entries()) {
    addClasses(item, PREFIX_ITEM);

    const properties: ItemProperties = getProperties(itemType);
    allItems.set(item, properties);

    if (itemType === S_TEXT) {
      properties._components = getTextComponents(item);
      for (const child of properties._components) {
        allItems.set(child, getProperties(""));
      }
    }
  }

  addClasses(containerElement, PREFIX_ROOT);
  observeAll();
};

/**
 * Find the top-level text-only elements that are descendants of the given one.
 */
const getTextComponents = (element: Element): Element[] => {
  const components: Element[] = [];
  for (const child of getVisibleContentChildren(element)) {
    if (isText(child)) {
      components.push(child);
    } else {
      components.push(...getTextComponents(child));
    }
  }

  return components;
};

const calculateMeasurements = (
  containerElement: HTMLElement,
  allItems: Map<Element, ItemProperties>,
  isFirstTime: boolean,
  logger: LoggerInterface | null,
): AverageMeasurements | null => {
  if (getData(containerElement, _.PREFIX_ORIENTATION) === _.S_VERTICAL) {
    debug: logger?.debug8("In vertical mode");
    return null;
  }

  debug: logger?.debug7("Calculating measurements");
  // initial values
  let tArea = NaN,
    tExtraH = 0,
    imgAR = NaN,
    flexW = NaN,
    nItems = 0;

  for (const [element, properties] of allItems.entries()) {
    const width = properties._width;
    const height = properties._height;

    if (element === containerElement) {
      flexW = width;
      nItems = _.lengthOf(getVisibleContentChildren(element));

      //
    } else if (properties._type === S_TEXT) {
      let thisTxtArea = 0,
        thisTxtExtraH = 0;
      const components = properties._components;

      if (_.lengthOf(components)) {
        for (const component of properties._components) {
          const cmpProps = allItems.get(component);
          if (cmpProps) {
            thisTxtArea += cmpProps._width * cmpProps._height;
          } else {
            logError(bugError("Text component not observed"));
          }
        }
        thisTxtExtraH = height - thisTxtArea / width;
      } else {
        thisTxtArea = width * height;
      }

      properties._area = thisTxtArea;
      properties._extraH = thisTxtExtraH;

      tArea = (tArea || 0) + thisTxtArea;
      tExtraH += thisTxtExtraH;

      //
    } else if (properties._type === S_IMAGE) {
      if (isFirstTime && !areImagesLoaded(element)) {
        debug: logger?.debug8("Images not loaded");
        return null;
      }

      const thisAspectR = width / height;
      imgAR = (imgAR || 0) + thisAspectR;
      properties._aspectR = thisAspectR;

      //
    } else {
      // skip grandchildren (text components), here
      continue;
    }

    debug: logger?.debug8("Examined", properties, {
      tArea,
      tExtraH,
      imgAR,
      flexW,
    });
  }

  return {
    _tArea: tArea,
    _tExtraH: tExtraH,
    _imgAR: imgAR,
    _flexW: flexW,
    _nItems: nItems,
  };
};

const getWidthAtH = (
  element: Element,
  properties: ItemProperties,
  targetHeight: number,
): number =>
  properties._type === S_TEXT
    ? properties._area / (targetHeight - (properties._extraH || 0))
    : properties._aspectR * targetHeight;

const getOptimalHeight = (
  measurements: AverageMeasurements,
  config: SameHeightConfigInternal,
  logger: LoggerInterface | null,
) => {
  const tArea = measurements._tArea;
  const tExtraH = measurements._tExtraH;
  const imgAR = measurements._imgAR;
  const flexW =
    measurements._flexW - (measurements._nItems - 1) * config._minGap;
  const maxFreeR = config._maxFreeR;
  const maxWidthR = config._maxWidthR;

  debug: logger?.debug8("Getting optimal height", measurements, config);

  // CASE 1: No text items
  if (_.isNaN(tArea)) {
    debug: logger?.debug8("No text items");
    if (!imgAR) {
      debug: logger?.debug8("Images not loaded");
      return NaN;
    }

    return flexW / imgAR;
  }

  // CASE 2: No images
  if (_.isNaN(imgAR)) {
    debug: logger?.debug8("No images");
    return tArea / flexW + tExtraH;
  }

  if (!imgAR || !tArea) {
    debug: logger?.debug8(
      "Expected both images and text, but no imgAR or tArea",
    );
    return NaN;
  }

  const h0 = _.sqrt(tArea / imgAR) + tExtraH;

  // heights satisfying w(h) === flexW
  const [h2, h1] = quadraticRoots(
    imgAR,
    -(imgAR * tExtraH + flexW),
    tArea + tExtraH * flexW,
  );

  // heights satisfying maxWidthR
  let hR0 = NaN,
    hR1 = NaN,
    hR2 = NaN;
  if (maxWidthR > 0) {
    hR0 = quadraticRoots(imgAR, -imgAR * tExtraH, -tArea)[0];

    hR1 = quadraticRoots(
      imgAR * maxWidthR,

      -imgAR * tExtraH * maxWidthR,
      -tArea,
    )[0];

    hR2 = quadraticRoots(
      imgAR / maxWidthR,
      (-imgAR * tExtraH) / maxWidthR,
      -tArea,
    )[0];
  }

  // heights satisfying maxFreeR
  let hF2 = NaN,
    hF1 = NaN;
  if (maxFreeR >= 0) {
    [hF2, hF1] = quadraticRoots(
      imgAR,
      -(imgAR * tExtraH + flexW * (1 - maxFreeR)),
      tArea + tExtraH * flexW * (1 - maxFreeR),
    );
  }

  // limits on constraints
  const hConstr1 = _.max(..._.filter([h1, hR1, hF1], (v) => isValidNum(v)));
  const hConstr2 = _.min(..._.filter([h2, hR2, hF2], (v) => isValidNum(v)));

  // text and image widths at h0
  const tw0 = tArea / (h0 - tExtraH);
  const iw0 = h0 * imgAR;

  // free space at h0
  const freeSpace0 = flexW - tw0 - iw0;

  debug: logger?.debug8("Optimal height calculations", config, measurements, {
    h0,
    h1,
    h2,
    hR0,
    hR1,
    hR2,
    hF1,
    hF2,
    hConstr1,
    hConstr2,
    tw0,
    iw0,
    freeSpace0,
  });

  // ~~~~ Some sanity checks
  // If any of then is NaN, the comparison would be false, so we don't need to
  // check.
  // Also, we round the difference to 0.1 pixels to account for rounding
  // errors during calculations.
  if (!h0 || h0 <= 0) {
    debug: logger?.debug1("Invalid calculation: Invalid h0");
  } else if (isValidNum(h1) !== isValidNum(h2)) {
    debug: logger?.debug1(
      "Invalid calculation: One and only one of h1 or h2 is real",
    );
  } else if (isValidNum(hR1) !== isValidNum(hR2)) {
    debug: logger?.debug1(
      "Invalid calculation: One and only one of hR1 or hR2 is real",
    );
  } else if (isValidNum(hF1) !== isValidNum(hF2)) {
    debug: logger?.debug1(
      "Invalid calculation: One and only one of hF1 or hF2 is real",
    );
  } else if (h1 - h0 > 0.1) {
    debug: logger?.debug1("Invalid calculation: h1 > h0");
  } else if (h0 - h2 > 0.1) {
    debug: logger?.debug1("Invalid calculation: h0 > h2");
  } else if (hR0 - h0 > 0.1) {
    debug: logger?.debug1("Invalid calculation: hR0 > h0");
  } else if (hR1 - hR0 > 0.1) {
    debug: logger?.debug1("Invalid calculation: hR1 > hR0");
  } else if (hR0 - hR2 > 0.1) {
    debug: logger?.debug1("Invalid calculation: hR0 > hR2");
  } else if (hF1 - hF2 > 0.1) {
    debug: logger?.debug1("Invalid calculation: hF1 > hF2");
  } else if (h1 - hF1 > 0.1) {
    debug: logger?.debug1("Invalid calculation: h1 > hF1");
  } else if (hF2 - h2 > 0.1) {
    debug: logger?.debug1("Invalid calculation: hF2 > h2");
  } else {
    // Choose a height
    if (freeSpace0 <= 0) {
      // scenario 1 or 2
      return h0;
    } else {
      // scenario 3
      return _.min(hConstr1, hConstr2);
    }
  }

  logError(bugError("Invalid SameHeight calculations"), measurements, config);
  return NaN; // sanity checks failed
};

_.brandClass(SameHeight, "SameHeight");
