function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * @module Utils
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { isValidStrList, validateStrList } from "./validation.js";
import { newBitSpaces, createBitSpace } from "../modules/bit-spaces.js";

/**
 * Returns true if the given string is a valid {@link ScrollOffset}.
 *
 * @category Validation
 */
export var isValidScrollOffset = function isValidScrollOffset(offset) {
  return offset.match(OFFSET_REGEX) !== null;
};

/**
 * Returns true if the given string is a valid "view".
 *
 * @category Validation
 */
export var isValidView = function isValidView(view) {
  return MH.includes(VIEWS, view);
};

/**
 * Returns true if the given string or array is a list of valid views.
 *
 * @category Validation
 */
export var isValidViewList = function isValidViewList(views) {
  return isValidStrList(views, isValidView, false);
};

/**
 * Returns the views that are opposite to the given set of views.
 *
 * Above and below are opposites, and so are left and right.
 *
 * "at" is a special case. It is considered opposite to any view in the sense
 * that if it is not present in `views` it will always be included in the
 * returned array. However it is not "strongly" opposite in the sense that it
 * will not cause other views to be included in the result unless it is the
 * only view in `views`. That is, there are two sets of strongly opposite pairs
 * ("above"/"below" and "left"/"right") and at least one of the two opposing
 * views of a pair must be present for the other one to be included, _except in
 * the special case of `views` being "at"_. See examples below for
 * clarification.
 *
 * **Note** that the order of the returned array is not defined.
 *
 * @example
 * Returns ["above", "below", "left", "right"] (not definite order), since
 * "at" is the only view present and is opposite to all:
 *
 * ```javascript
 * getOppositeViews("at"); // -> ["above", "below", "left", "right"] (not necessarily in this order)
 * ```
 *
 * @example
 * Returns ["below"]. "left" and "right" are NOT included even though "at" is
 * given, because at least one of the two opposing views of a pair must be
 * present for the other one to be included (except in the special case of
 * `views` being "at").
 *
 * ```javascript
 * getOppositeViews("at,above"); // -> ["below"]
 * ```
 *
 * @example
 * ```javascript
 * getOppositeViews("above"); // -> ["at", "below"] (not necessarily in this order)
 * ```
 *
 * @example
 * ```javascript
 * getOppositeViews("above,below"); // -> ["at"]
 * ```
 *
 * @example
 * ```javascript
 * getOppositeViews("at,above,below"); // -> []
 * ```
 *
 * @example
 * ```javascript
 * getOppositeViews("above,right"); // -> ["at", "below", "left"] (not necessarily in this order)
 * ```
 *
 * @example
 * ```javascript
 * getOppositeViews("at,above,right"); // -> ["below", "left"] (not necessarily in this order)
 * ```
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the given view is not valid, including if it's empty "".
 *
 * @category Views
 */
export var getOppositeViews = function getOppositeViews(views) {
  if (!views) {
    throw MH.usageError("'views' cannot be empty");
  }
  var bitmask = getViewsBitmask(views);
  var oppositeBitmask = VIEWS_SPACE.bitmask & ~bitmask; // initial, all not present in bitmask

  // If the given view is "at", then include all the other ones.
  // Otherwise include only the opposite views of those directional
  // (above/below/left/right) that are present. I.e. if neither left not right
  // is given, then don't include them
  if (bitmask !== VIEWS_SPACE.bit.at) {
    // remove the opposite ones to those not present
    if (!(bitmask & VIEWS_SPACE.bit.above)) {
      oppositeBitmask &= ~VIEWS_SPACE.bit.below;
    }
    if (!(bitmask & VIEWS_SPACE.bit.below)) {
      oppositeBitmask &= ~VIEWS_SPACE.bit.above;
    }
    if (!(bitmask & VIEWS_SPACE.bit.left)) {
      oppositeBitmask &= ~VIEWS_SPACE.bit.right;
    }
    if (!(bitmask & VIEWS_SPACE.bit.right)) {
      oppositeBitmask &= ~VIEWS_SPACE.bit.left;
    }
  }
  return getViewsFromBitmask(oppositeBitmask);
};

/**
 * @ignore
 * @internal
 */
export var getViewsBitmask = function getViewsBitmask(viewsStr) {
  var viewsBitmask = 0;
  var views = validateStrList("views", viewsStr, isValidView);
  if (views) {
    var _iterator = _createForOfIteratorHelper(views),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var v = _step.value;
        if (!isValidView(v)) {
          throw MH.usageError("Unknown view '".concat(v, "'"));
        }
        viewsBitmask |= VIEWS_SPACE.bit[v];
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } else {
    viewsBitmask = VIEWS_SPACE.bitmask; // default: all
  }
  return viewsBitmask;
};

/**
 * @ignore
 * @internal
 */
export var parseScrollOffset = function parseScrollOffset(input) {
  var _match$groups, _match$groups2;
  var match = input.match(OFFSET_REGEX);
  if (!match) {
    throw MH.usageError("Invalid offset: '".concat(input, "'"));
  }
  var reference = (_match$groups = match.groups) === null || _match$groups === void 0 ? void 0 : _match$groups.ref;
  var value = (_match$groups2 = match.groups) === null || _match$groups2 === void 0 ? void 0 : _match$groups2.value;
  /* istanbul ignore next */ // shouldn't happen
  if (!reference || !value) {
    throw MH.bugError("Offset regex: blank named groups");
  }
  return {
    reference: reference,
    value: value
  };
};
var VIEWS = [MC.S_AT, MC.S_ABOVE, MC.S_BELOW, MC.S_LEFT, MC.S_RIGHT];

/**
 * @ignore
 * @internal
 */
export var VIEWS_SPACE = createBitSpace.apply(void 0, [newBitSpaces()].concat(VIEWS));

// --------------------

var OFFSET_REGEX = RegExp("(?<ref>top|bottom|left|right): *(?<value>[^ ].+)");
var getViewsFromBitmask = function getViewsFromBitmask(bitmask) {
  var views = [];
  for (var bit = VIEWS_SPACE.start; bit <= VIEWS_SPACE.end; bit++) {
    var value = 1 << bit;
    if (bitmask & value) {
      var name = VIEWS_SPACE.nameOf(value);
      if (name) {
        views.push(name);
      }
    }
  }
  return views;
};
//# sourceMappingURL=views.js.map