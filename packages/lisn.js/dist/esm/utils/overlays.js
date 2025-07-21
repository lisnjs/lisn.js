/**
 * @module Utils
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { addClasses, addClassesNow, setDataNow, setStylePropNow } from "./css-alter.js";
import { moveElement, tryWrapContent } from "./dom-alter.js";
import { waitForElement } from "./dom-events.js";
import { waitForMutateTime } from "./dom-optimize.js";
import { camelToKebabCase, objToStrKey } from "./text.js";
import { isScrollable, tryGetMainContentElement, fetchMainContentElement } from "./scroll.js";
import { newXWeakMap } from "../modules/x-map.js";

/**
 * @category Overlays
 * @interface
 */

/**
 * Returns an existing overlay for this specification. If the overlay was just
 * created it may not yet be attached to the DOM.
 *
 * @category Overlays
 */
export const getOverlay = userOptions => {
  var _overlays$get$get, _overlays$get;
  const options = tryGetOverlayOptions(userOptions);
  if (!options) {
    return null;
  }
  return (_overlays$get$get = (_overlays$get = overlays.get(options._parent)) === null || _overlays$get === void 0 ? void 0 : _overlays$get.get(options._overlayKey)) !== null && _overlays$get$get !== void 0 ? _overlays$get$get : null;
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
export const createOverlay = async userOptions => {
  const options = await fetchOverlayOptions(userOptions);
  const canReuse = !options._id;
  if (canReuse) {
    var _overlays$get2;
    const existingOverlay = (_overlays$get2 = overlays.get(options._parent)) === null || _overlays$get2 === void 0 ? void 0 : _overlays$get2.get(options._overlayKey);
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
  const isPercentageHOffset = MH.includes((options._style.left || "") + (options._style.right || ""), "%");
  const isPercentageVOffset = MH.includes((options._style.top || "") + (options._style.bottom || ""), "%");
  let needsContentWrapping = false;
  let parentEl = options._parent;
  if (isPercentageHOffset || isPercentageVOffset) {
    needsContentWrapping = isPercentageHOffset && isScrollable(parentEl, {
      axis: "x"
    }) || isPercentageVOffset && isScrollable(parentEl, {
      axis: "y"
    });
  }
  if (needsContentWrapping) {
    // TODO Is it possible to unwrap the children when no longer needing this
    // overlay? Probably not worth the effort. ViewWatcher doesn't remove old
    // olverlays anyway.
    parentEl = await tryWrapContent(parentEl, {
      _classNames: [MC.PREFIX_WRAPPER, PREFIX_WRAPPER],
      _required: true,
      _requiredBy: "percentage offset view trigger with scrolling root"
    });
  }
  if (options._style.position === MC.S_ABSOLUTE) {
    // Ensure parent has non-static positioning
    addClasses(parentEl, MH.prefixName("overlay-container"));
  }
  await moveElement(overlay, {
    to: parentEl
  });
  return overlay;
};

// ----------------------------------------

const PREFIX_WRAPPER = MH.prefixName("overlay-wrapper");
const overlays = newXWeakMap(() => MH.newMap());
const tryGetOverlayOptions = userOptions => {
  var _userOptions$data, _userOptions$id;
  const style = getCssProperties(userOptions === null || userOptions === void 0 ? void 0 : userOptions.style);
  const data = (_userOptions$data = userOptions === null || userOptions === void 0 ? void 0 : userOptions.data) !== null && _userOptions$data !== void 0 ? _userOptions$data : {};
  const parentEl = tryGetParent(userOptions === null || userOptions === void 0 ? void 0 : userOptions.parent, style.position);
  if (!parentEl) {
    return null;
  }
  return {
    _parent: parentEl,
    _id: (_userOptions$id = userOptions === null || userOptions === void 0 ? void 0 : userOptions.id) !== null && _userOptions$id !== void 0 ? _userOptions$id : "",
    _style: style,
    _data: data,
    _overlayKey: getOverlayKey(style, data)
  };
};
const fetchOverlayOptions = async userOptions => {
  var _userOptions$data2, _userOptions$id2;
  const style = getCssProperties(userOptions === null || userOptions === void 0 ? void 0 : userOptions.style);
  const data = (_userOptions$data2 = userOptions === null || userOptions === void 0 ? void 0 : userOptions.data) !== null && _userOptions$data2 !== void 0 ? _userOptions$data2 : {};
  const parentEl = await fetchParent(userOptions === null || userOptions === void 0 ? void 0 : userOptions.parent, style.position);
  return {
    _parent: parentEl,
    _id: (_userOptions$id2 = userOptions === null || userOptions === void 0 ? void 0 : userOptions.id) !== null && _userOptions$id2 !== void 0 ? _userOptions$id2 : "",
    _style: style,
    _data: data,
    _overlayKey: getOverlayKey(style, data)
  };
};
const getOverlayKey = (style, data) => objToStrKey(style) + "|" + objToStrKey(data);
const getCssProperties = style => {
  const finalCssProperties = MH.merge(style, {
    position: (style === null || style === void 0 ? void 0 : style.position) || MC.S_ABSOLUTE
  } // default
  );
  if (finalCssProperties.position === MC.S_ABSOLUTE || finalCssProperties.position === MC.S_FIXED) {
    if (MH.isEmpty(finalCssProperties.top) && MH.isEmpty(finalCssProperties.bottom)) {
      finalCssProperties.top = "0px";
    }
    if (MH.isEmpty(finalCssProperties.left) && MH.isEmpty(finalCssProperties.right)) {
      finalCssProperties.left = "0px";
    }
  }
  return finalCssProperties;
};
const tryGetParent = (userSuppliedParent, position) => userSuppliedParent !== null && userSuppliedParent !== void 0 ? userSuppliedParent : position === MC.S_FIXED ? MH.getBody() : tryGetMainContentElement();
const fetchParent = async (userSuppliedParent, position) => userSuppliedParent !== null && userSuppliedParent !== void 0 ? userSuppliedParent : position === MC.S_FIXED ? await waitForElement(MH.getBody) : await fetchMainContentElement();
const createOnlyOverlay = options => {
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
//# sourceMappingURL=overlays.js.map