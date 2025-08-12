/**
 * @module Utils
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import {
  addClasses,
  addClassesNow,
  setDataNow,
  setStylePropNow,
} from "@lisn/utils/css-alter";
import { moveElement, tryWrapContent } from "@lisn/utils/dom-alter";
import { waitForElement } from "@lisn/utils/dom-events";
import { waitForMutateTime } from "@lisn/utils/dom-optimize";
import { camelToKebabCase, objToStrKey } from "@lisn/utils/text";
import {
  isScrollable,
  tryGetMainContentElement,
  fetchMainContentElement,
} from "@lisn/utils/scroll";

import { newXWeakMap } from "@lisn/modules/x-map";

/**
 * @category Overlays
 * @interface
 */
export type OverlayOptions = {
  /**
   * The parent element to insert the overlay into.
   *
   * If not given, then:
   * - if the overlay is to have a `position: fixed`, then `document.body` is used
   * - otherwise,
   *   {@link Settings.settings.mainScrollableElementSelector | the main scrolling element}
   *   is used
   */
  parent?: HTMLElement;

  /**
   * If set, then it will be assigned as the DOM element ID for the new
   * overlay.
   *
   * Furthermore, the new overlay will be created and will not be saved for
   * future reuse.
   *
   * By default, if `id` is not given, the overlay will be saved, and if
   * {@link createOverlay} is called again with the same `style`, `data` and
   * parent, the previous overlay is returned.
   */
  id?: string;

  /**
   * Every entry in this object will be set on the `style` of the new overlay.
   *
   * **IMPORTANT:** By default overlays are positioned absolutely, so if you need
   * another positioning, override this here by setting a `position` key in
   * `style`. If position is either "absolute" (by default or explicitly set) or
   * "fixed", and none of `top` or `bottom` is given, `top: 0` is set; and
   * similarly, if none of `left` or `right` is given, `left: 0` is set.
   */
  style?: Record<string, string>;

  /**
   * Every entry in this object will be set as a data attribute on the new
   * overlay.
   *
   * Keys can be either kebab-case or camelCase (they will be converted if
   * needed). Do _not_ include the "data-" prefix which will be added
   * automatically. E.g. both "foo-bar" and "fooBar" will result in
   * "data-foo-bar" being set.
   */
  data?: Record<string, string>;
};

/**
 * Returns an existing overlay for this specification. If the overlay was just
 * created it may not yet be attached to the DOM.
 *
 * @category Overlays
 */
export const getOverlay = (userOptions?: OverlayOptions) => {
  const options = tryGetOverlayOptions(userOptions);
  if (!options) {
    return null;
  }

  return overlays.get(options._parent)?.get(options._overlayKey) ?? null;
};

/**
 * Creates a new overlay, and inserts it into the DOM as soon as
 * {@link waitForMutateTime} resolves, or returns an already existing matching
 * overlay.
 *
 * **Note** that if {@link OverlayOptions.id} is set, a new overlay will
 * _always_ be created.
 *
 * @category Overlays
 */
export const createOverlay = async (userOptions?: OverlayOptions) => {
  const options = await fetchOverlayOptions(userOptions);
  const canReuse = !options._id;

  if (canReuse) {
    const existingOverlay = overlays
      .get(options._parent)
      ?.get(options._overlayKey);

    if (existingOverlay) {
      if (!MH.parentOf(existingOverlay)) {
        // not yet inserted into the DOM, so wait until it is
        await waitForMutateTime();
      }
      return existingOverlay;
    }
  }

  // Create a new one
  const overlay = createOnlyOverlay(options);
  if (canReuse) {
    // Save it now before awating, so that concurrent requests to create the
    // same one use it
    overlays.sGet(options._parent).set(options._overlayKey, overlay);
  } else {
    overlay.id = options._id;
  }

  const isPercentageHOffset = MH.includes(
    (options._style.left || "") + (options._style.right || ""),
    "%",
  );

  const isPercentageVOffset = MH.includes(
    (options._style.top || "") + (options._style.bottom || ""),
    "%",
  );

  let needsContentWrapping = false;
  let parentEl = options._parent;
  if (isPercentageHOffset || isPercentageVOffset) {
    needsContentWrapping =
      (isPercentageHOffset && isScrollable(parentEl, { axis: "x" })) ||
      (isPercentageVOffset && isScrollable(parentEl, { axis: "y" }));
  }

  if (needsContentWrapping) {
    // TODO Is it possible to unwrap the children when no longer needing this
    // overlay? Probably not worth the effort. ViewWatcher doesn't remove old
    // olverlays anyway.
    parentEl = await tryWrapContent(parentEl, {
      _classNames: [
        MC.PREFIX_WRAPPER,
        MC.PREFIX_WRAPPER_CONTENT,
        PREFIX_WRAPPER,
      ],
      _required: true,
      _requiredBy: "percentage offset view trigger with scrolling root",
    });
  }

  if (options._style.position === MC.S_ABSOLUTE) {
    // Ensure parent has non-static positioning
    addClasses(parentEl, MC.PREFIX_RELATIVE);
  }

  await moveElement(overlay, { to: parentEl });

  return overlay;
};

// ----------------------------------------

type OverlayOptionsInternal = {
  _parent: HTMLElement;
  _id: string;
  _style: Record<string, string>;
  _data: Record<string, string>;
  _overlayKey: string;
};

const PREFIX_WRAPPER = MH.prefixName("overlay-wrapper");

const overlays = newXWeakMap<HTMLElement, Map<string, HTMLElement>>(() =>
  MH.newMap(),
);

const tryGetOverlayOptions = (
  userOptions: OverlayOptions | undefined,
): OverlayOptionsInternal | null => {
  const style = getCssProperties(userOptions?.style);
  const data = userOptions?.data ?? {};
  const parentEl = tryGetParent(userOptions?.parent, style.position);
  if (!parentEl) {
    return null;
  }

  return {
    _parent: parentEl,
    _id: userOptions?.id ?? "",
    _style: style,
    _data: data,
    _overlayKey: getOverlayKey(style, data),
  };
};

const fetchOverlayOptions = async (
  userOptions: OverlayOptions | undefined,
): Promise<OverlayOptionsInternal> => {
  const style = getCssProperties(userOptions?.style);
  const data = userOptions?.data ?? {};
  const parentEl = await fetchParent(userOptions?.parent, style.position);

  return {
    _parent: parentEl,
    _id: userOptions?.id ?? "",
    _style: style,
    _data: data,
    _overlayKey: getOverlayKey(style, data),
  };
};

const getOverlayKey = (
  style: Record<string, string>,
  data: Record<string, string>,
) => objToStrKey(style) + "|" + objToStrKey(data);

const getCssProperties = (style: Record<string, string> | undefined) => {
  const finalCssProperties: Record<string, string> = MH.merge(
    style,
    { position: style?.position || MC.S_ABSOLUTE }, // default
  );

  if (
    finalCssProperties.position === MC.S_ABSOLUTE ||
    finalCssProperties.position === MC.S_FIXED
  ) {
    if (
      MH.isEmpty(finalCssProperties.top) &&
      MH.isEmpty(finalCssProperties.bottom)
    ) {
      finalCssProperties.top = "0px";
    }

    if (
      MH.isEmpty(finalCssProperties.left) &&
      MH.isEmpty(finalCssProperties.right)
    ) {
      finalCssProperties.left = "0px";
    }
  }

  return finalCssProperties;
};

const tryGetParent = (
  userSuppliedParent: HTMLElement | undefined | null,
  position: string,
) =>
  userSuppliedParent ??
  (position === MC.S_FIXED ? MH.getBody() : tryGetMainContentElement());

const fetchParent = async (
  userSuppliedParent: HTMLElement | undefined | null,
  position: string,
) =>
  userSuppliedParent ??
  (position === MC.S_FIXED
    ? await waitForElement(MH.getBody)
    : await fetchMainContentElement());

const createOnlyOverlay = (options: OverlayOptionsInternal) => {
  const overlay = MH.createElement("div");

  addClassesNow(overlay, MH.prefixName("overlay"));

  const data = options._data;
  for (const attr of MH.keysOf(data)) {
    setDataNow(overlay, camelToKebabCase(attr), data[attr]);
  }

  const style = options._style;
  for (const prop of MH.keysOf(style)) {
    setStylePropNow(overlay, prop, style[prop]);
  }

  return overlay;
};
