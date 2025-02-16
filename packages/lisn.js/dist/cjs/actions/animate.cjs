"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Animate = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _animations = require("../utils/animations.cjs");
var _cssAlter = require("../utils/css-alter.cjs");
var _domEvents = require("../utils/dom-events.cjs");
var _text = require("../utils/text.cjs");
var _action = require("./action.cjs");
var _debug = _interopRequireDefault(require("../debug/debug.cjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Actions
 */
/**
 * Plays or reverses all animations on the given element.
 *
 * It works with CSS or Web Animations.
 *
 * **IMPORTANT:** When constructed, it resets and pauses the animations as a
 * form of initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "animate".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div data-lisn-on-view="@animate"></div>
 * ```
 *
 * @category Animation
 */
var Animate = exports.Animate = /*#__PURE__*/function () {
  function Animate(element) {
    _classCallCheck(this, Animate);
    /**
     * (Re)plays the animations forwards.
     */
    _defineProperty(this, "do", void 0);
    /**
     * (Re)plays the animations backwards.
     */
    _defineProperty(this, "undo", void 0);
    /**
     * Reverses the animations from its current direction.
     */
    _defineProperty(this, "toggle", void 0);
    var logger = _debug["default"] ? new _debug["default"].Logger({
      name: "Animate-".concat((0, _text.formatAsString)(element))
    }) : null;

    // initial state is 0% and paused
    animate(element, GO_FORWARD, logger, true);
    var isFirst = true;
    this["do"] = function () {
      return animate(element, GO_FORWARD, logger);
    };
    this.undo = function () {
      return animate(element, GO_BACKWARD, logger);
    };
    this[MC.S_TOGGLE] = function () {
      var res = animate(element, isFirst ? GO_FORWARD : GO_TOGGLE, logger);
      isFirst = false;
      return res;
    };
  }
  return _createClass(Animate, null, [{
    key: "register",
    value: function register() {
      (0, _action.registerAction)("animate", function (element) {
        return new Animate(element);
      });
    }
  }]);
}(); // --------------------
var GO_FORWARD = 0;
var GO_BACKWARD = 1;
var GO_TOGGLE = 2;
var animate = function animate(element, direction, logger) {
  var isInitial = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  debug: logger === null || logger === void 0 || logger.debug8("Animating element");
  return (0, _animations.iterateAnimations)(element, /* istanbul ignore next */ // jsdom doesn't support Web Animations
  function (animation) {
    return setupAnimation(animation, direction, logger, isInitial);
  }, function (element) {
    return setupAnimationLegacy(element, direction, logger, isInitial);
  }, isInitial);
};

/* istanbul ignore next */ // jsdom doesn't support Web Animations
var setupAnimation = function setupAnimation(animation, direction, logger, isInitial) {
  var pauseTillReady = !(0, _domEvents.isPageReady)();
  var isBackward = animation.playbackRate === -1;
  debug: logger === null || logger === void 0 || logger.debug9("Setting up animation", animation, {
    direction: direction,
    isBackward: isBackward
  });
  if (direction === GO_TOGGLE || direction === GO_FORWARD && isBackward || direction === GO_BACKWARD && !isBackward) {
    debug: logger === null || logger === void 0 || logger.debug9("Reversing animation", animation.playState);
    animation.reverse();
  } else if (animation.playState === "paused") {
    debug: logger === null || logger === void 0 || logger.debug9("Playing animation", animation.playState);
    animation.play();
  } else {
    debug: logger === null || logger === void 0 || logger.debug9("Animation has played or is playing already", animation.playState);
  }
  if (isInitial || pauseTillReady) {
    debug: logger === null || logger === void 0 || logger.debug9("Pausing animation", animation.playState);
    animation.pause();
    if (!isInitial) {
      // we were only pausing until ready
      /* istanbul ignore next */
      (0, _domEvents.waitForPageReady)().then(function () {
        debug: logger === null || logger === void 0 || logger.debug9("Restarting animation", animation.playState);
        animation.play();
      });
    }
  }

  // If the element is moved (including if wrapped, such as by the ViewTrigger),
  // this will cancel CSS animations and replace them with new running ones
  if (MH.isInstanceOf(animation, CSSAnimation)) {
    var cancelHandler = function cancelHandler(event) {
      return onAnimationCancel(event, animation, direction, logger, isInitial);
    };
    animation.addEventListener(MC.S_CANCEL, cancelHandler);
    animation.addEventListener("finish", function () {
      return animation.removeEventListener(MC.S_CANCEL, cancelHandler);
    });
  }
};

/* istanbul ignore next */ // jsdom doesn't support Web Animations
var onAnimationCancel = function onAnimationCancel(event, animation, direction, logger, isInitial) {
  var _MH$targetOf;
  // setup again the new animation
  debug: logger === null || logger === void 0 || logger.debug9("Animation cancelled, re-setting up new one");
  var target = MH.targetOf(event);
  if (!MH.isInstanceOf(target, Animation)) {
    return;
  }
  var effect = target.effect;
  if (!MH.isInstanceOf(effect, KeyframeEffect)) {
    return;
  }
  var _iterator = _createForOfIteratorHelper(((_MH$targetOf = MH.targetOf(effect)) === null || _MH$targetOf === void 0 ? void 0 : _MH$targetOf.getAnimations()) || []),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var newAnimation = _step.value;
      if (MH.isInstanceOf(newAnimation, CSSAnimation) && newAnimation.animationName === animation.animationName) {
        setupAnimation(newAnimation, direction, logger, isInitial);
        break;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
};
var setupAnimationLegacy = function setupAnimationLegacy(element, direction, logger, isInitial) {
  var isBackward = (0, _cssAlter.hasClass)(element, MC.PREFIX_ANIMATE_REVERSE);
  var isPaused = (0, _cssAlter.hasClass)(element, MC.PREFIX_ANIMATE_PAUSE);
  var pauseTillReady = !(0, _domEvents.isPageReady)();
  var goBackwards = direction === GO_BACKWARD || direction === GO_TOGGLE && !isBackward;
  var doPause = isInitial || pauseTillReady;
  debug: logger === null || logger === void 0 || logger.debug9("Setting up legacy animations", element, {
    direction: direction,
    isBackward: isBackward,
    isPaused: isPaused,
    goBackwards: goBackwards,
    doPause: doPause
  });
  if (goBackwards === isBackward && doPause === isPaused) {
    // nothing to do
    debug: logger === null || logger === void 0 || logger.debug9("No need to reset or pause animation");
    return;
  }
  (0, _animations.resetCssAnimationsNow)(element);
  (0, _cssAlter.removeClassesNow)(element, MC.PREFIX_ANIMATE_PAUSE, MC.PREFIX_ANIMATE_REVERSE);
  _cssAlter.addClassesNow.apply(void 0, [element].concat(_toConsumableArray(goBackwards ? [MC.PREFIX_ANIMATE_REVERSE] : []), _toConsumableArray(doPause ? [MC.PREFIX_ANIMATE_PAUSE] : [])));
  if (!isInitial && pauseTillReady) {
    (0, _domEvents.waitForPageReady)().then(function () {
      return (0, _cssAlter.removeClasses)(element, MC.PREFIX_ANIMATE_PAUSE);
    });
  }
};
//# sourceMappingURL=animate.cjs.map