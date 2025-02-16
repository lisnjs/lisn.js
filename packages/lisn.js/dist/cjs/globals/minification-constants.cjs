"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.S_TOGGLE = exports.S_STICKY = exports.S_SKIP_INITIAL = exports.S_SELECTSTART = exports.S_SCROLL_WIDTH = exports.S_SCROLL_TOP_FRACTION = exports.S_SCROLL_TOP = exports.S_SCROLL_LEFT_FRACTION = exports.S_SCROLL_LEFT = exports.S_SCROLL_HEIGHT = exports.S_SCROLL = exports.S_ROLE = exports.S_RIGHT = exports.S_REVERSE = exports.S_REMOVED = exports.S_PRESS = exports.S_POINTERUP = exports.S_POINTERMOVE = exports.S_POINTERLEAVE = exports.S_POINTERENTER = exports.S_POINTERDOWN = exports.S_POINTERCANCEL = exports.S_POINTER = exports.S_OUT = exports.S_NONE = exports.S_MOUSEUP = exports.S_MOUSEMOVE = exports.S_MOUSEDOWN = exports.S_MOUSE = exports.S_LEFT = exports.S_KEYDOWN = exports.S_KEY = exports.S_IN = exports.S_HOVER = exports.S_HORIZONTAL = exports.S_HEIGHT = exports.S_FIXED = exports.S_DROP = exports.S_DRAGSTART = exports.S_DRAGOVER = exports.S_DRAGLEAVE = exports.S_DRAGGABLE = exports.S_DRAGENTER = exports.S_DRAGEND = exports.S_DRAG = exports.S_DOWN = exports.S_DISABLED = exports.S_DEBOUNCE_WINDOW = exports.S_CLIENT_WIDTH = exports.S_CLIENT_HEIGHT = exports.S_CLICK = exports.S_CHILD_LIST = exports.S_CANCEL = exports.S_BOTTOM = exports.S_BELOW = exports.S_ATTRIBUTES = exports.S_ATTRIBUTE = exports.S_AT = exports.S_ARROW = exports.S_ARIA_CONTROLS = exports.S_ANIMATE = exports.S_AMBIGUOUS = exports.S_ADDED = exports.S_ABSOLUTE = exports.S_ABOVE = exports.SYMBOL = exports.STRING = exports.PROMISE = exports.PREFIX_WRAPPER = exports.PREFIX_UNDISPLAY = exports.PREFIX_TRANSITION_DISABLE = exports.PREFIX_TRANSITION = exports.PREFIX_SHOW = exports.PREFIX_POSITION = exports.PREFIX_PLACE = exports.PREFIX_ORIENTATION = exports.PREFIX_NO_WRAP = exports.PREFIX_NO_TOUCH_ACTION = exports.PREFIX_NO_SELECT = exports.PREFIX_INLINE_WRAPPER = exports.PREFIX_HIDE = exports.PREFIX_GHOST = exports.PREFIX_DISPLAY = exports.PREFIX_BORDER_SIZE = exports.PREFIX_ANIMATE_REVERSE = exports.PREFIX_ANIMATE_PAUSE = exports.PREFIX_ANIMATE_INFINITE = exports.PREFIX_ANIMATE_DISABLE = exports.PREFIX = exports.PI = exports.OBJECT = exports.NUMBER = exports.MATH = exports.LOG_PREFIX = exports.IS_MOBILE = exports.INFINITY = exports.FUNCTION = exports.ARRAY = exports.ARIA_PREFIX = exports.ANIMATE_PREFIX = void 0;
exports.USER_AGENT = exports.S_ZOOM = exports.S_WIDTH = exports.S_WHEEL = exports.S_VERTICAL = exports.S_UP = exports.S_UNKNOWN = exports.S_TOUCHSTART = exports.S_TOUCHMOVE = exports.S_TOUCHEND = exports.S_TOUCHCANCEL = exports.S_TOUCH = exports.S_TOP = void 0;
/**
 * For minification optimization.
 *
 * @module
 * @ignore
 * @internal
 */

var PREFIX = exports.PREFIX = "lisn";
var LOG_PREFIX = exports.LOG_PREFIX = "[LISN.js]";
var OBJECT = exports.OBJECT = Object;
var SYMBOL = exports.SYMBOL = Symbol;
var ARRAY = exports.ARRAY = Array;
var STRING = exports.STRING = String;
var FUNCTION = exports.FUNCTION = Function;
var MATH = exports.MATH = Math;
var NUMBER = exports.NUMBER = Number;
var PROMISE = exports.PROMISE = Promise;
var PI = exports.PI = MATH.PI;
var INFINITY = exports.INFINITY = Infinity;
var S_ABSOLUTE = exports.S_ABSOLUTE = "absolute";
var S_FIXED = exports.S_FIXED = "fixed";
var S_STICKY = exports.S_STICKY = "sticky";
var S_WIDTH = exports.S_WIDTH = "width";
var S_HEIGHT = exports.S_HEIGHT = "height";
var S_TOP = exports.S_TOP = "top";
var S_BOTTOM = exports.S_BOTTOM = "bottom";
var S_UP = exports.S_UP = "up";
var S_DOWN = exports.S_DOWN = "down";
var S_LEFT = exports.S_LEFT = "left";
var S_RIGHT = exports.S_RIGHT = "right";
var S_AT = exports.S_AT = "at";
var S_ABOVE = exports.S_ABOVE = "above";
var S_BELOW = exports.S_BELOW = "below";
var S_IN = exports.S_IN = "in";
var S_OUT = exports.S_OUT = "out";
var S_NONE = exports.S_NONE = "none";
var S_AMBIGUOUS = exports.S_AMBIGUOUS = "ambiguous";
var S_ADDED = exports.S_ADDED = "added";
var S_REMOVED = exports.S_REMOVED = "removed";
var S_ATTRIBUTE = exports.S_ATTRIBUTE = "attribute";
var S_KEY = exports.S_KEY = "key";
var S_MOUSE = exports.S_MOUSE = "mouse";
var S_POINTER = exports.S_POINTER = "pointer";
var S_TOUCH = exports.S_TOUCH = "touch";
var S_WHEEL = exports.S_WHEEL = "wheel";
var S_CLICK = exports.S_CLICK = "click";
var S_HOVER = exports.S_HOVER = "hover";
var S_PRESS = exports.S_PRESS = "press";
var S_SCROLL = exports.S_SCROLL = "scroll";
var S_ZOOM = exports.S_ZOOM = "zoom";
var S_DRAG = exports.S_DRAG = "drag";
var S_UNKNOWN = exports.S_UNKNOWN = "unknown";
var S_SCROLL_TOP = exports.S_SCROLL_TOP = "".concat(S_SCROLL, "Top");
var S_SCROLL_LEFT = exports.S_SCROLL_LEFT = "".concat(S_SCROLL, "Left");
var S_SCROLL_WIDTH = exports.S_SCROLL_WIDTH = "".concat(S_SCROLL, "Width");
var S_SCROLL_HEIGHT = exports.S_SCROLL_HEIGHT = "".concat(S_SCROLL, "Height");
var S_CLIENT_WIDTH = exports.S_CLIENT_WIDTH = "clientWidth";
var S_CLIENT_HEIGHT = exports.S_CLIENT_HEIGHT = "clientHeight";
var S_SCROLL_TOP_FRACTION = exports.S_SCROLL_TOP_FRACTION = "".concat(S_SCROLL, "TopFraction");
var S_SCROLL_LEFT_FRACTION = exports.S_SCROLL_LEFT_FRACTION = "".concat(S_SCROLL, "LeftFraction");
var S_HORIZONTAL = exports.S_HORIZONTAL = "horizontal";
var S_VERTICAL = exports.S_VERTICAL = "vertical";
var S_SKIP_INITIAL = exports.S_SKIP_INITIAL = "skipInitial";
var S_DEBOUNCE_WINDOW = exports.S_DEBOUNCE_WINDOW = "debounceWindow";
var S_TOGGLE = exports.S_TOGGLE = "toggle";
var S_CANCEL = exports.S_CANCEL = "cancel";
var S_KEYDOWN = exports.S_KEYDOWN = S_KEY + S_DOWN;
var S_MOUSEUP = exports.S_MOUSEUP = S_MOUSE + S_UP;
var S_MOUSEDOWN = exports.S_MOUSEDOWN = S_MOUSE + S_DOWN;
var S_MOUSEMOVE = exports.S_MOUSEMOVE = "".concat(S_MOUSE, "move");
var S_POINTERUP = exports.S_POINTERUP = S_POINTER + S_UP;
var S_POINTERDOWN = exports.S_POINTERDOWN = S_POINTER + S_DOWN;
var S_POINTERENTER = exports.S_POINTERENTER = "".concat(S_POINTER, "enter");
var S_POINTERLEAVE = exports.S_POINTERLEAVE = "".concat(S_POINTER, "leave");
var S_POINTERMOVE = exports.S_POINTERMOVE = "".concat(S_POINTER, "move");
var S_POINTERCANCEL = exports.S_POINTERCANCEL = S_POINTER + S_CANCEL;
var S_TOUCHSTART = exports.S_TOUCHSTART = "".concat(S_TOUCH, "start");
var S_TOUCHEND = exports.S_TOUCHEND = "".concat(S_TOUCH, "end");
var S_TOUCHMOVE = exports.S_TOUCHMOVE = "".concat(S_TOUCH, "move");
var S_TOUCHCANCEL = exports.S_TOUCHCANCEL = S_TOUCH + S_CANCEL;
var S_DRAGSTART = exports.S_DRAGSTART = "".concat(S_DRAG, "start");
var S_DRAGEND = exports.S_DRAGEND = "".concat(S_DRAG, "end");
var S_DRAGENTER = exports.S_DRAGENTER = "".concat(S_DRAG, "enter");
var S_DRAGOVER = exports.S_DRAGOVER = "".concat(S_DRAG, "over");
var S_DRAGLEAVE = exports.S_DRAGLEAVE = "".concat(S_DRAG, "leave");
var S_DROP = exports.S_DROP = "drop";
var S_SELECTSTART = exports.S_SELECTSTART = "selectstart";
var S_ATTRIBUTES = exports.S_ATTRIBUTES = "attributes";
var S_CHILD_LIST = exports.S_CHILD_LIST = "childList";
var S_REVERSE = exports.S_REVERSE = "reverse";
var S_DRAGGABLE = exports.S_DRAGGABLE = "draggable";
var S_DISABLED = exports.S_DISABLED = "disabled";
var S_ARROW = exports.S_ARROW = "arrow";
var S_ROLE = exports.S_ROLE = "role";
var ARIA_PREFIX = exports.ARIA_PREFIX = "aria-";
var S_ARIA_CONTROLS = exports.S_ARIA_CONTROLS = ARIA_PREFIX + "controls";
var PREFIX_WRAPPER = exports.PREFIX_WRAPPER = "".concat(PREFIX, "-wrapper");
var PREFIX_INLINE_WRAPPER = exports.PREFIX_INLINE_WRAPPER = "".concat(PREFIX_WRAPPER, "-inline");
var PREFIX_TRANSITION = exports.PREFIX_TRANSITION = "".concat(PREFIX, "-transition");
var PREFIX_TRANSITION_DISABLE = exports.PREFIX_TRANSITION_DISABLE = "".concat(PREFIX_TRANSITION, "__disable");
var PREFIX_HIDE = exports.PREFIX_HIDE = "".concat(PREFIX, "-hide");
var PREFIX_SHOW = exports.PREFIX_SHOW = "".concat(PREFIX, "-show");
var PREFIX_DISPLAY = exports.PREFIX_DISPLAY = "".concat(PREFIX, "-display");
var PREFIX_UNDISPLAY = exports.PREFIX_UNDISPLAY = "".concat(PREFIX, "-undisplay");
var PREFIX_PLACE = exports.PREFIX_PLACE = "".concat(PREFIX, "-place");
var PREFIX_ORIENTATION = exports.PREFIX_ORIENTATION = "".concat(PREFIX, "-orientation");
var PREFIX_POSITION = exports.PREFIX_POSITION = "".concat(PREFIX, "-position");
var PREFIX_GHOST = exports.PREFIX_GHOST = "".concat(PREFIX, "-ghost");
var PREFIX_BORDER_SIZE = exports.PREFIX_BORDER_SIZE = "".concat(PREFIX, "-border-size");
var PREFIX_NO_SELECT = exports.PREFIX_NO_SELECT = "".concat(PREFIX, "-no-select");
var PREFIX_NO_TOUCH_ACTION = exports.PREFIX_NO_TOUCH_ACTION = "".concat(PREFIX, "-no-touch-action");
var PREFIX_NO_WRAP = exports.PREFIX_NO_WRAP = "".concat(PREFIX, "-no-wrap");
var S_ANIMATE = exports.S_ANIMATE = "animate";
var ANIMATE_PREFIX = exports.ANIMATE_PREFIX = "".concat(PREFIX, "-").concat(S_ANIMATE, "__");
var PREFIX_ANIMATE_DISABLE = exports.PREFIX_ANIMATE_DISABLE = "".concat(ANIMATE_PREFIX, "disable");
var PREFIX_ANIMATE_PAUSE = exports.PREFIX_ANIMATE_PAUSE = "".concat(ANIMATE_PREFIX, "pause");
var PREFIX_ANIMATE_REVERSE = exports.PREFIX_ANIMATE_REVERSE = "".concat(ANIMATE_PREFIX).concat(S_REVERSE);
var PREFIX_ANIMATE_INFINITE = exports.PREFIX_ANIMATE_INFINITE = "".concat(ANIMATE_PREFIX, "infinite");
var USER_AGENT = exports.USER_AGENT = typeof navigator === "undefined" ? "" : navigator.userAgent;
var IS_MOBILE = exports.IS_MOBILE = USER_AGENT.match(/Mobile|Android|Silk\/|Kindle|BlackBerry|Opera Mini|Opera Mobi/) !== null;
//# sourceMappingURL=minification-constants.cjs.map