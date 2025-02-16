"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOverlay = exports.createOverlay = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _settings = require("../globals/settings.cjs");
var _cssAlter = require("./css-alter.cjs");
var _domAlter = require("./dom-alter.cjs");
var _domEvents = require("./dom-events.cjs");
var _domOptimize = require("./dom-optimize.cjs");
var _log = require("./log.cjs");
var _text = require("./text.cjs");
var _scroll = require("./scroll.cjs");
var _xMap = require("../modules/x-map.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * @module Utils
 */

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
const getOverlay = userOptions => {
  var _overlays$get;
  const options = tryGetOverlayOptions(userOptions);
  if (!options) {
    return null;
  }
  return ((_overlays$get = overlays.get(options._parent)) === null || _overlays$get === void 0 ? void 0 : _overlays$get.get(options._overlayKey)) || null;
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
exports.getOverlay = getOverlay;
const createOverlay = async userOptions => {
  const options = await fetchOverlayOptions(userOptions);
  const canReuse = !options._id;
  if (canReuse) {
    var _overlays$get2;
    const existingOverlay = (_overlays$get2 = overlays.get(options._parent)) === null || _overlays$get2 === void 0 ? void 0 : _overlays$get2.get(options._overlayKey);
    if (existingOverlay) {
      if (!MH.parentOf(existingOverlay)) {
        // not yet inserted into the DOM, so wait until it is
        await (0, _domOptimize.waitForMutateTime)();
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
    needsContentWrapping = isPercentageHOffset && (0, _scroll.isScrollable)(parentEl, {
      axis: "x"
    }) || isPercentageVOffset && (0, _scroll.isScrollable)(parentEl, {
      axis: "y"
    });
  }
  if (needsContentWrapping) {
    if (_settings.settings.contentWrappingAllowed) {
      parentEl = await (0, _domAlter.wrapScrollingContent)(parentEl);
    } else {
      (0, _log.logWarn)("Percentage offset view trigger with scrolling root requires contentWrappingAllowed");
    }
  }
  if (options._style.position === MC.S_ABSOLUTE) {
    // Ensure parent has non-static positioning
    (0, _cssAlter.addClasses)(parentEl, MH.prefixName("overlay-container"));
  }
  await (0, _domAlter.moveElement)(overlay, {
    to: parentEl
  });
  return overlay;
};

// ----------------------------------------
exports.createOverlay = createOverlay;
const overlays = (0, _xMap.newXWeakMap)(() => MH.newMap());
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
const getOverlayKey = (style, data) => (0, _text.objToStrKey)(style) + "|" + (0, _text.objToStrKey)(data);
const getCssProperties = style => {
  const finalCssProperties = MH.merge({
    position: MC.S_ABSOLUTE
  },
  // default
  style);
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
const tryGetParent = (userSuppliedParent, position) => userSuppliedParent !== null && userSuppliedParent !== void 0 ? userSuppliedParent : position === MC.S_FIXED ? MH.getBody() : (0, _scroll.tryGetMainContentElement)();
const fetchParent = async (userSuppliedParent, position) => userSuppliedParent !== null && userSuppliedParent !== void 0 ? userSuppliedParent : position === MC.S_FIXED ? await (0, _domEvents.waitForElement)(MH.getBody) : await (0, _scroll.fetchMainContentElement)();
const createOnlyOverlay = options => {
  const overlay = MH.createElement("div");
  (0, _cssAlter.addClassesNow)(overlay, MH.prefixName("overlay"));
  const data = options._data;
  for (const attr of MH.keysOf(data)) {
    (0, _cssAlter.setDataNow)(overlay, (0, _text.camelToKebabCase)(attr), data[attr]);
  }
  const style = options._style;
  for (const prop of MH.keysOf(style)) {
    (0, _cssAlter.setStylePropNow)(overlay, prop, style[prop]);
  }
  return overlay;
};
//# sourceMappingURL=overlays.cjs.map