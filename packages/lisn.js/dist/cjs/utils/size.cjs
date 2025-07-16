"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tryGetViewportOverlay = exports.isValidDimension = exports.isValidBox = exports.getEntryContentBox = exports.getEntryBorderBox = exports.fetchViewportSize = exports.fetchViewportOverlay = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _domOptimize = require("./dom-optimize.cjs");
var _overlays = require("./overlays.cjs");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * @module Utils
 */

/**
 * Returns the content box size of the given
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry | ResizeObserverEntry}.
 *
 * @category Size measurements
 */
const getEntryContentBox = entry => {
  const size = entry.contentBoxSize;
  if (size) {
    return getSizeFromInlineBlock(size);
  }
  const rect = entry.contentRect;
  return {
    [MC.S_WIDTH]: rect[MC.S_WIDTH],
    [MC.S_HEIGHT]: rect[MC.S_HEIGHT]
  };
};

/**
 * Returns the border box size of the given
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry | ResizeObserverEntry}.
 *
 * @param {} fallbackToContent If the entry does not contain border box
 *                             measurements (depending on browser), then fall
 *                             back to using the content box size. Otherwise
 *                             (by default) will return `NaN` values for width
 *                             and height.
 *
 * @category Size measurements
 */
exports.getEntryContentBox = getEntryContentBox;
const getEntryBorderBox = (entry, fallbackToContent = false) => {
  const size = entry.borderBoxSize;
  if (size) {
    return getSizeFromInlineBlock(size);
  } else if (fallbackToContent) {
    return getEntryContentBox(entry);
  }
  return {
    [MC.S_WIDTH]: NaN,
    [MC.S_HEIGHT]: NaN
  };
};

/**
 * Returns true if the given string is a valid box type.
 *
 * @category Validation
 */
exports.getEntryBorderBox = getEntryBorderBox;
const isValidBox = box => MH.includes(ALL_BOXES, box);

/**
 * Returns true if the given string is a valid dimension.
 *
 * @category Validation
 */
exports.isValidBox = isValidBox;
const isValidDimension = dimension => MH.includes(ALL_DIMENSIONS, dimension);

/**
 * @ignore
 * @internal
 */
exports.isValidDimension = isValidDimension;
const tryGetViewportOverlay = () => viewportOverlay !== null && viewportOverlay !== void 0 ? viewportOverlay : null;

/**
 * @ignore
 * @internal
 *
 * Exposed via SizeWatcher
 */
exports.tryGetViewportOverlay = tryGetViewportOverlay;
const fetchViewportOverlay = async () => {
  await init();
  return viewportOverlay;
};

/**
 * @ignore
 * @internal
 */
exports.fetchViewportOverlay = fetchViewportOverlay;
const fetchViewportSize = async (realtime = false) => {
  var _MH$getDocScrollingEl;
  if (!realtime) {
    await (0, _domOptimize.waitForMeasureTime)();
  }
  const root = MH.hasDOM() ? (_MH$getDocScrollingEl = MH.getDocScrollingElement()) !== null && _MH$getDocScrollingEl !== void 0 ? _MH$getDocScrollingEl : MH.getBody() : null;
  return {
    [MC.S_WIDTH]: (root === null || root === void 0 ? void 0 : root.clientWidth) || 0,
    [MC.S_HEIGHT]: (root === null || root === void 0 ? void 0 : root.clientHeight) || 0
  };
};

// ----------------------------------------
exports.fetchViewportSize = fetchViewportSize;
const S_INLINE_SIZE = "inlineSize";
const S_BLOCK_SIZE = "blockSize";
const ALL_BOXES = ["content", "border"];
const ALL_DIMENSIONS = [MC.S_WIDTH, MC.S_HEIGHT];
const getSizeFromInlineBlock = size => {
  /* istanbul ignore else */
  if (MH.isIterableObject(size)) {
    return {
      [MC.S_WIDTH]: size[0][S_INLINE_SIZE],
      [MC.S_HEIGHT]: size[0][S_BLOCK_SIZE]
    };
  }
  return {
    // in some browsers inlineSize and blockSize are scalars and nor Arrays
    [MC.S_WIDTH]: size[S_INLINE_SIZE],
    [MC.S_HEIGHT]: size[S_BLOCK_SIZE]
  };
};

// ------------------------------

let viewportOverlay;
let initPromise = null;
const init = () => {
  if (!initPromise) {
    initPromise = (async () => {
      viewportOverlay = await (0, _overlays.createOverlay)({
        id: MH.prefixName("vp-ovrl"),
        style: {
          position: "fixed",
          [MC.S_WIDTH]: "100vw",
          [MC.S_HEIGHT]: "100vh"
        }
      });
    })();
  }
  return initPromise;
};
//# sourceMappingURL=size.cjs.map